'use client'

import { useState } from 'react'
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RankingItem {
  id: string
  nome: string
  setor: string
  matricula: string
  cargo: string
  pontuacao: number
  totalBOS: number
  totalBOA: number
}

interface Props {
  ranking: RankingItem[]
}

export function RankingClient({ ranking }: Props) {
  const [search, setSearch] = useState('')
  const [filterSetor, setFilterSetor] = useState('todos')

  const setores = Array.from(new Set(ranking.map((r) => r.setor)))

  const filtered = ranking.filter((r) => {
    const matchSearch =
      r.nome.toLowerCase().includes(search.toLowerCase()) ||
      r.matricula.toLowerCase().includes(search.toLowerCase())
    const matchSetor = filterSetor === 'todos' || r.setor === filterSetor
    return matchSearch && matchSetor
  })

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (position === 3) return <Award className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold text-sm">{position}</span>
  }

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600'
    if (score < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
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
          className="input-field w-auto"
        >
          <option value="todos">Todos os setores</option>
          {setores.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex items-center justify-center py-12 text-gray-400">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum dado de ranking disponível</p>
            <p className="text-sm mt-1">Registros com status &quot;Encerrado&quot; são usados no ranking</p>
          </div>
        </div>
      ) : (
        <>
          {filtered.slice(0, 3).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filtered.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    'card text-center border-2',
                    index === 0 && 'border-yellow-400 bg-yellow-50',
                    index === 1 && 'border-gray-300 bg-gray-50',
                    index === 2 && 'border-amber-400 bg-amber-50'
                  )}
                >
                  <div className="flex justify-center mb-2">{getRankIcon(index + 1)}</div>
                  <p className="font-bold text-gray-900">{item.nome}</p>
                  <p className="text-sm text-gray-500">{item.setor}</p>
                  <p className={cn('text-2xl font-bold mt-2', getScoreColor(item.pontuacao))}>
                    {item.pontuacao > 0 ? '+' : ''}{item.pontuacao}
                  </p>
                  <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="text-red-500">BOS: {item.totalBOS}</span>
                    <span className="text-green-500">BOA: {item.totalBOA}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 w-12">#</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Colaborador</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Setor</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Cargo</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">BOS</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">BOA</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Pontuação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item, index) => (
                    <tr key={item.id} className={cn(
                      'hover:bg-gray-50 transition-colors',
                      index === 0 && 'bg-yellow-50/50',
                      index === 1 && 'bg-gray-50/50',
                      index === 2 && 'bg-amber-50/50',
                    )}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">{getRankIcon(index + 1)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.nome}</p>
                        <p className="text-xs text-gray-400">{item.matricula}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.setor}</td>
                      <td className="px-4 py-3 text-gray-600">{item.cargo}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="badge bg-red-100 text-red-700">{item.totalBOS}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="badge bg-green-100 text-green-700">{item.totalBOA}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.pontuacao >= 0
                            ? <TrendingUp className="w-4 h-4 text-green-500" />
                            : <TrendingDown className="w-4 h-4 text-red-500" />
                          }
                          <span className={cn('font-bold', getScoreColor(item.pontuacao))}>
                            {item.pontuacao > 0 ? '+' : ''}{item.pontuacao}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
