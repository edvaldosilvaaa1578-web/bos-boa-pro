'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { Calendar, TrendingUp } from 'lucide-react'

type RegistroRelatorio = {
  tipo: string
  categoria: string
  status: string
  pontuacao: number
  data_ocorrencia: string
  created_at: string
  colaboradores?: { nome: string; setor: string } | null
}

interface Props {
  registros: RegistroRelatorio[]
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']

export function RelatoriosClient({ registros }: Props) {
  const [periodo, setPeriodo] = useState('6m')

  const cutoff = useMemo(() => {
    const now = new Date()
    if (periodo === '1m') return new Date(now.getFullYear(), now.getMonth() - 1, 1)
    if (periodo === '3m') return new Date(now.getFullYear(), now.getMonth() - 3, 1)
    if (periodo === '6m') return new Date(now.getFullYear(), now.getMonth() - 6, 1)
    if (periodo === '12m') return new Date(now.getFullYear(), now.getMonth() - 12, 1)
    return new Date(0)
  }, [periodo])

  const filtered = useMemo(
    () => registros.filter((r) => new Date(r.data_ocorrencia) >= cutoff),
    [registros, cutoff]
  )

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const map = new Map<string, { mes: string; BOS: number; BOA: number; total: number }>()

    for (const r of filtered) {
      const d = new Date(r.data_ocorrencia)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const label = `${months[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`
      const existing = map.get(key) ?? { mes: label, BOS: 0, BOA: 0, total: 0 }
      if (r.tipo === 'BOS') existing.BOS++
      else existing.BOA++
      existing.total++
      map.set(key, existing)
    }

    return Array.from(map.values()).sort((a, b) => a.mes.localeCompare(b.mes))
  }, [filtered])

  const categoriaData = useMemo(() => {
    const map = new Map<string, { categoria: string; BOS: number; BOA: number }>()
    for (const r of filtered) {
      const existing = map.get(r.categoria) ?? { categoria: r.categoria, BOS: 0, BOA: 0 }
      if (r.tipo === 'BOS') existing.BOS++
      else existing.BOA++
      map.set(r.categoria, existing)
    }
    return Array.from(map.values()).sort((a, b) => (b.BOS + b.BOA) - (a.BOS + a.BOA)).slice(0, 8)
  }, [filtered])

  const setorData = useMemo(() => {
    const map = new Map<string, { setor: string; BOS: number; BOA: number }>()
    for (const r of filtered) {
      const setor = r.colaboradores?.setor ?? 'Sem setor'
      const existing = map.get(setor) ?? { setor, BOS: 0, BOA: 0 }
      if (r.tipo === 'BOS') existing.BOS++
      else existing.BOA++
      map.set(setor, existing)
    }
    return Array.from(map.values())
  }, [filtered])

  const statusData = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of filtered) {
      map.set(r.status, (map.get(r.status) ?? 0) + 1)
    }
    return Array.from(map.entries()).map(([name, value]) => ({
      name: name === 'aberto' ? 'Aberto' : name === 'em_analise' ? 'Em Análise' : 'Encerrado',
      value,
    }))
  }, [filtered])

  const totalBOS = filtered.filter((r) => r.tipo === 'BOS').length
  const totalBOA = filtered.filter((r) => r.tipo === 'BOA').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{filtered.length} registros no período</span>
        </div>
        <div className="flex gap-2">
          {[
            { value: '1m', label: '1 mês' },
            { value: '3m', label: '3 meses' },
            { value: '6m', label: '6 meses' },
            { value: '12m', label: '12 meses' },
            { value: 'all', label: 'Tudo' },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                periodo === p.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-900">{filtered.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total de Registros</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-600">{totalBOS}</p>
          <p className="text-sm text-gray-500 mt-1">Total BOS</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{totalBOA}</p>
          <p className="text-sm text-gray-500 mt-1">Total BOA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Evolução Mensal</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="BOS" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="BOS" />
              <Line type="monotone" dataKey="BOA" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="BOA" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Registros por Categoria</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoriaData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="categoria" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="BOS" fill="#ef4444" name="BOS" />
              <Bar dataKey="BOA" fill="#22c55e" name="BOA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Registros por Setor</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={setorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="setor" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="BOS" fill="#ef4444" name="BOS" radius={[4, 4, 0, 0]} />
              <Bar dataKey="BOA" fill="#22c55e" name="BOA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Distribuição por Status</h2>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {statusData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-gray-600">{s.name}: {s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
