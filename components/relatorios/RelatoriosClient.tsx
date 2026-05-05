'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { Calendar, Download, Users, AlertTriangle, CheckCircle, TrendingUp, FileText, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'

type RegistroRelatorio = {
  tipo: 'BOS' | 'BOA'
  categoria: string
  status: string
  pontuacao: number
  data_ocorrencia: string
  colaboradores: { nome: string; setor: string } | null
}

interface Props {
  registros: RegistroRelatorio[]
  totalColaboradores: number
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const PERIODOS = [
  { value: '1m', label: '1 mês' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '12m', label: '12 meses' },
  { value: 'all', label: 'Tudo' },
]

function getCutoff(periodo: string): Date {
  const now = new Date()
  if (periodo === '1m') return new Date(now.getFullYear(), now.getMonth() - 1, 1)
  if (periodo === '3m') return new Date(now.getFullYear(), now.getMonth() - 3, 1)
  if (periodo === '6m') return new Date(now.getFullYear(), now.getMonth() - 6, 1)
  if (periodo === '12m') return new Date(now.getFullYear(), now.getMonth() - 12, 1)
  return new Date(0)
}

function exportToCSV(registros: RegistroRelatorio[], periodo: string, setor: string) {
  const headers = ['Tipo', 'Colaborador', 'Setor', 'Categoria', 'Pontuação', 'Status', 'Data']
  const rows = registros.map(r => [
    r.tipo,
    r.colaboradores?.nome ?? '-',
    r.colaboradores?.setor ?? '-',
    r.categoria,
    r.pontuacao,
    r.status,
    new Date(r.data_ocorrencia).toLocaleDateString('pt-BR'),
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `relatorio-bosboa-${periodo}-${setor}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function exportToPDF(periodo: string, setor: string) {
  const style = document.createElement('style')
  style.id = 'print-style'
  style.innerHTML = `
    @media print {
      body * { visibility: hidden !important; }
      #relatorio-print, #relatorio-print * { visibility: visible !important; }
      #relatorio-print { position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; background: white; }
      .no-print { display: none !important; }
      @page { margin: 1.5cm; size: A4; }
    }
  `
  document.head.appendChild(style)

  const printHeader = document.createElement('div')
  printHeader.id = 'print-header-inject'
  printHeader.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:white;z-index:10000;padding:12px 24px;border-bottom:2px solid #1e40af;display:flex;justify-content:space-between;align-items:center;'
  printHeader.innerHTML = `
    <div>
      <div style="font-size:18px;font-weight:700;color:#1e40af;">Gestão BOS/BOA Pro</div>
      <div style="font-size:12px;color:#6b7280;">Relatório — Período: ${periodo} | Setor: ${setor}</div>
    </div>
    <div style="font-size:11px;color:#6b7280;">Gerado em ${new Date().toLocaleString('pt-BR')}</div>
  `

  const target = document.getElementById('relatorio-print')
  if (target) target.prepend(printHeader)

  window.print()

  setTimeout(() => {
    style.remove()
    printHeader.remove()
  }, 1000)
}

export function RelatoriosClient({ registros, totalColaboradores }: Props) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [periodo, setPeriodo] = useState('6m')
  const [filterSetor, setFilterSetor] = useState('todos')
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)

  const gridColor = isDark ? '#374151' : '#f0f0f0'
  const tickColor = isDark ? '#9ca3af' : '#6b7280'
  const tooltipStyle = isDark
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }
    : { backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#111827' }

  const cutoff = useMemo(() => getCutoff(periodo), [periodo])

  const setores = useMemo(
    () => Array.from(new Set(registros.map((r) => r.colaboradores?.setor ?? '').filter(Boolean))).sort(),
    [registros]
  )

  const filtered = useMemo(() =>
    registros.filter((r) => {
      const matchPeriodo = new Date(r.data_ocorrencia) >= cutoff
      const matchSetor = filterSetor === 'todos' || r.colaboradores?.setor === filterSetor
      return matchPeriodo && matchSetor
    }),
    [registros, cutoff, filterSetor]
  )

  const totalBOS = useMemo(() => filtered.filter((r) => r.tipo === 'BOS').length, [filtered])
  const totalBOA = useMemo(() => filtered.filter((r) => r.tipo === 'BOA').length, [filtered])
  const mediaPontos = useMemo(() => {
    if (filtered.length === 0) return 0
    const net = filtered.reduce((acc, r) => acc + (r.tipo === 'BOA' ? r.pontuacao : -r.pontuacao), 0)
    return Math.round(net / filtered.length)
  }, [filtered])
  const colaboradoresFiltrados = useMemo(() =>
    filterSetor === 'todos'
      ? totalColaboradores
      : new Set(filtered.map((r) => r.colaboradores?.nome).filter(Boolean)).size,
    [filtered, filterSetor, totalColaboradores]
  )

  const monthlyData = useMemo(() => {
    const map = new Map<string, { mes: string; BOS: number; BOA: number; saldo: number; order: string }>()
    for (const r of filtered) {
      const d = new Date(r.data_ocorrencia)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      const label = `${MONTHS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`
      const existing = map.get(key) ?? { mes: label, BOS: 0, BOA: 0, saldo: 0, order: key }
      if (r.tipo === 'BOS') { existing.BOS++; existing.saldo -= r.pontuacao }
      else { existing.BOA++; existing.saldo += r.pontuacao }
      map.set(key, existing)
    }
    return Array.from(map.values()).sort((a, b) => a.order.localeCompare(b.order))
  }, [filtered])

  const categoriaData = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of filtered) {
      map.set(r.categoria, (map.get(r.categoria) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [filtered])

  const pontosData = useMemo(() => {
    const map = new Map<string, { mes: string; total: number; count: number; order: string }>()
    for (const r of filtered) {
      const d = new Date(r.data_ocorrencia)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      const label = `${MONTHS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`
      const existing = map.get(key) ?? { mes: label, total: 0, count: 0, order: key }
      existing.total += r.tipo === 'BOA' ? r.pontuacao : -r.pontuacao
      existing.count++
      map.set(key, existing)
    }
    return Array.from(map.values())
      .sort((a, b) => a.order.localeCompare(b.order))
      .map(({ mes, total, count }) => ({ mes, media: count > 0 ? Math.round(total / count) : 0 }))
  }, [filtered])

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf')
    const periodoLabel = PERIODOS.find(p => p.value === periodo)?.label ?? periodo
    const setorLabel = filterSetor === 'todos' ? 'Todos' : filterSetor
    setTimeout(() => {
      exportToPDF(periodoLabel, setorLabel)
      setExporting(null)
    }, 200)
  }, [periodo, filterSetor])

  const handleExportExcel = useCallback(() => {
    setExporting('excel')
    const periodoLabel = PERIODOS.find(p => p.value === periodo)?.label ?? periodo
    const setorLabel = filterSetor === 'todos' ? 'todos' : filterSetor
    setTimeout(() => {
      exportToCSV(filtered, periodoLabel, setorLabel)
      setExporting(null)
    }, 200)
  }, [filtered, periodo, filterSetor])

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{filtered.length} registros no período</span>
          </div>
          <select
            value={filterSetor}
            onChange={(e) => setFilterSetor(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="todos">Todos os setores</option>
            {setores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1.5">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors',
                  periodo === p.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Botões de export */}
          <button
            onClick={handleExportExcel}
            disabled={exporting === 'excel' || filtered.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {exporting === 'excel' ? 'Exportando...' : 'Excel/CSV'}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting === 'pdf'}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {exporting === 'pdf' ? 'Gerando...' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Área imprimível */}
      <div id="relatorio-print">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{colaboradoresFiltrados}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Colaboradores</p>
          </div>
          <div className="card text-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalBOS}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total BOS</p>
          </div>
          <div className="card text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalBOA}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total BOA</p>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className={cn('text-3xl font-bold', mediaPontos >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
              {mediaPontos > 0 ? '+' : ''}{mediaPontos}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Média de Pontos</p>
          </div>
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Registros por Mês</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} />
                  <Bar dataKey="BOS" fill="#ef4444" radius={[4, 4, 0, 0]} name="BOS" />
                  <Bar dataKey="BOA" fill="#22c55e" radius={[4, 4, 0, 0]} name="BOA" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">Sem dados no período</div>
            )}
          </div>

          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Evolução da Pontuação Média</h2>
            {pontosData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={pontosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v > 0 ? '+' : ''}${v}`, 'Pontuação média']} />
                  <Line type="monotone" dataKey="media" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} name="Pontuação média" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">Sem dados no período</div>
            )}
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Distribuição por Categoria</h2>
            {categoriaData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoriaData} cx="50%" cy="50%" outerRadius={85} innerRadius={40} paddingAngle={3} dataKey="value">
                      {categoriaData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                  {categoriaData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{c.name} ({c.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">Sem dados no período</div>
            )}
          </div>

          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Saldo de Pontuação Mensal</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v > 0 ? '+' : ''}${v}`, 'Saldo']} />
                  <Bar dataKey="saldo" name="Saldo" radius={[4, 4, 0, 0]} fill="#8b5cf6">
                    {monthlyData.map((entry, i) => <Cell key={i} fill={entry.saldo >= 0 ? '#22c55e' : '#ef4444'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">Sem dados no período</div>
            )}
          </div>
        </div>

        {/* Tabela de registros para export */}
        <div className="card mt-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Registros Detalhados ({filtered.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Tipo</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Colaborador</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Setor</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Categoria</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Pontos</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.slice(0, 50).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-3 py-2">
                      <span className={cn('badge text-xs', r.tipo === 'BOS' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400')}>
                        {r.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{r.colaboradores?.nome ?? '-'}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.colaboradores?.setor ?? '-'}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.categoria}</td>
                    <td className="px-3 py-2 font-medium">
                      <span className={r.tipo === 'BOA' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {r.tipo === 'BOA' ? '+' : '-'}{r.pontuacao}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                      {new Date(r.data_ocorrencia).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {filtered.length > 50 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-2 text-center text-sm text-gray-500">
                      + {filtered.length - 50} registros adicionais no arquivo exportado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
