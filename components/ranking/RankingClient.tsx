'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type RegistroItem = {
  tipo: 'BOS' | 'BOA'
  pontos: number
  data_ocorrencia: string
}

type ColaboradorRanking = {
  id: string
  nome: string
  matricula: string
  cargo: string
  setor: string
  registros: RegistroItem[]
}

interface Props {
  colaboradores: ColaboradorRanking[]
}

type RankingEntry = {
  id: string
  nome: string
  setor: string
  matricula: string
  cargo: string
  total_boas: number
  total_bos: number
  pontos_boa: number
  pontos_bos: number
  total_pontos: number
}

const PERIODOS = [
  { value: 'mes', label: 'Mês atual' },
  { value: '3m', label: '3 meses' },
  { value: 'ano', label: 'Este ano' },
  { value: 'tudo', label: 'Tudo' },
]

function getCutoff(periodo: string): Date | null {
  const now = new Date()
  if (periodo === 'mes') return new Date(now.getFullYear(), now.getMonth(), 1)
  if (periodo === '3m') return new Date(now.getFullYear(), now.getMonth() - 3, 1)
  if (periodo === 'ano') return new Date(now.getFullYear(), 0, 1)
  return null
}

function computeRanking(colaboradores: ColaboradorRanking[], cutoff: Date | null): RankingEntry[] {
  return colaboradores
    .map((c) => {
      const registros = cutoff
        ? c.registros.filter((r) => new Date(r.data_ocorrencia) >= cutoff)
        : c.registros

      const boas = registros.filter((r) => r.tipo === 'BOA')
      const bos = registros.filter((r) => r.tipo === 'BOS')
      const pontos_boa = boas.reduce((sum, r) => sum + (r.pontos ?? 0), 0)
      const pontos_bos = bos.reduce((sum, r) => sum + (r.pontos ?? 0), 0)

      return {
        id: c.id,
        nome: c.nome,
        setor: c.setor,
        matricula: c.matricula,
        cargo: c.cargo,
        total_boas: boas.length,
        total_bos: bos.length,
        pontos_boa,
        pontos_bos,
        total_pontos: pontos_boa + pontos_bos,
      }
    })
    .filter((e) => e.total_boas + e.total_bos > 0)
    .sort((a, b) => b.total_pontos - a.total_pontos)
}

function PositionBadge({ pos }: { pos: number }) {
  if (pos === 1) return <span className="text-2xl leading-none">🥇</span>
  if (pos === 2) return <span className="text-2xl leading-none">🥈</span>
  if (pos === 3) return <span className="text-2xl leading-none">🥉</span>
  return (
    <span className={cn(
      'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
      pos <= 10
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    )}>
      {pos}
    </span>
  )
}

export function RankingClient({ colaboradores }: Props) {
  const [search, setSearch] = useState('')
  const [filterSetor, setFilterSetor] = useState('todos')
  const [periodo, setPeriodo] = useState('tudo')

  const cutoff = useMemo(() => getCutoff(periodo), [periodo])
  const allRanking = useMemo(() => computeRanking(colaboradores, cutoff), [colaboradores, cutoff])

  const setores = useMemo(
    () => Array.from(new Set(colaboradores.map((c) => c.setor ?? '').filter(Boolean))).sort(),
    [colaboradores]
  )

  const filtered = useMemo(() => allRanking.filter((item) => {
    const matchSearch =
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.matricula.toLowerCase().includes(search.toLowerCase())
    const matchSetor = filterSetor === 'todos' || item.setor === filterSetor
    return matchSearch && matchSetor
  }), [allRanking, search, filterSetor])

  const leader = allRanking[0] ?? null
  const mostBOA = [...allRanking].sort((a, b) => b.total_boas - a.total_boas)[0] ?? null
  const bestRatio = [...allRanking]
    .filter((e) => e.total_boas + e.total_bos >= 2)
    .sort((a, b) => {
      const ra = a.total_boas / (a.total_boas + a.total_bos)
      const rb = b.total_boas / (b.total_boas + b.total_bos)
      return rb - ra
    })[0] ?? null

  return (
    <div className="p-6 space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between flex-wrap">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filterSetor}
            onChange={(e) => setFilterSetor(e.target.value)}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="todos">Todos os setores</option>
            {setores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-1.5 flex-wrap">
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
      </div>

      {allRanking.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-5xl mb-3 opacity-40">🏆</span>
          <p className="font-medium">Nenhum dado de ranking disponível</p>
          <p className="text-sm mt-1">Cadastre colaboradores e registros para ver o ranking</p>
        </div>
      ) : (
        <>
          {/* Highlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leader && (
              <div className="card border-2 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 text-center">
                <div className="text-4xl mb-1">🥇</div>
                <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider mb-1">1º Lugar</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{leader.nome}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{leader.setor}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {leader.total_pontos} pts
                </p>
                <div className="flex justify-center gap-3 mt-1 text-xs">
                  <span className="text-green-600 dark:text-green-400">BOA: {leader.total_boas}</span>
                  <span className="text-red-500 dark:text-red-400">BOS: {leader.total_bos}</span>
                </div>
              </div>
            )}

            {mostBOA && (
              <div className="card border-2 border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/10 text-center">
                <div className="text-4xl mb-1">💚</div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Mais BOAs</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{mostBOA.nome}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mostBOA.setor}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{mostBOA.total_boas} BOAs</p>
                <div className="flex justify-center gap-3 mt-1 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    #{allRanking.findIndex((x) => x.id === mostBOA.id) + 1} no ranking
                  </span>
                </div>
              </div>
            )}

            {bestRatio && (
              <div className="card border-2 border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10 text-center">
                <div className="text-4xl mb-1">⭐</div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Melhor Aproveitamento</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{bestRatio.nome}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{bestRatio.setor}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {Math.round((bestRatio.total_boas / (bestRatio.total_boas + bestRatio.total_bos)) * 100)}% BOA
                </p>
                <div className="flex justify-center gap-3 mt-1 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {bestRatio.total_boas + bestRatio.total_bos} registros
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 w-14">#</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Colaborador</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Setor</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">BOA</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">BOS</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Pontuação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((item) => {
                    const pos = allRanking.findIndex((x) => x.id === item.id) + 1
                    const netScore = item.pontos_boa - item.pontos_bos
                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          'transition-colors',
                          pos === 1 && 'bg-yellow-50/70 dark:bg-yellow-900/10 hover:bg-yellow-100/70 dark:hover:bg-yellow-900/20',
                          pos === 2 && 'bg-gray-50/70 dark:bg-gray-700/20 hover:bg-gray-100/70 dark:hover:bg-gray-700/30',
                          pos === 3 && 'bg-amber-50/70 dark:bg-amber-900/10 hover:bg-amber-100/70 dark:hover:bg-amber-900/20',
                          pos > 3 && 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        )}
                      >
                        <td className="px-4 py-3">
                          <PositionBadge pos={pos} />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{item.nome}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{item.matricula} · {item.cargo}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.setor}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{item.total_boas}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{item.total_bos}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {netScore >= 0
                              ? <TrendingUp className="w-4 h-4 text-green-500" />
                              : <TrendingDown className="w-4 h-4 text-red-500" />
                            }
                            <span className={cn(
                              'font-bold text-base',
                              netScore > 0 ? 'text-green-600 dark:text-green-400' : netScore < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                            )}>
                              {netScore > 0 ? '+' : ''}{netScore}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({item.total_pontos} total)</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} colaborador{filtered.length !== 1 ? 'es' : ''} no ranking
              {periodo !== 'tudo' && ` · ${PERIODOS.find(p => p.value === periodo)?.label}`}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
