'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registroSchema, type RegistroFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Plus, Search, Edit2, Trash2, X, Check, Filter } from 'lucide-react'
import { cn, formatDate, getStatusColor, getStatusLabel, getTipoColor } from '@/lib/utils'

type Registro = Database['public']['Tables']['registros']['Row'] & {
  colaboradores?: { nome: string; setor: string; matricula: string } | null
}
type Colaborador = { id: string; nome: string; matricula: string; setor: string }
type Categoria = Database['public']['Tables']['categorias']['Row']

interface Props {
  registros: Registro[]
  colaboradores: Colaborador[]
  categorias: Categoria[]
}

const defaultCategoriasBOS = ['Acidente de Trabalho', 'Quase Acidente', 'Ato Inseguro', 'Condição Insegura', 'EPI', 'Outros']
const defaultCategoriasBoA = ['Bom Desempenho', 'Sugestão de Melhoria', 'Trabalho em Equipe', 'Proatividade', 'Outros']

export function RegistrosClient({ registros: initial, colaboradores, categorias }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [registros, setRegistros] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState<'todos' | 'BOS' | 'BOA'>('todos')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTipo, setSelectedTipo] = useState<'BOS' | 'BOA'>('BOS')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: { tipo: 'BOS', status: 'aberto', pontuacao: 10 },
  })

  const watchedTipo = watch('tipo')

  const categoriasParaTipo = categorias.length > 0
    ? categorias.filter((c) => c.tipo === watchedTipo).map((c) => c.nome)
    : watchedTipo === 'BOS' ? defaultCategoriasBOS : defaultCategoriasBoA

  const filtered = registros.filter((r) => {
    const matchSearch =
      r.colaboradores?.nome.toLowerCase().includes(search.toLowerCase()) ||
      r.descricao.toLowerCase().includes(search.toLowerCase()) ||
      r.categoria.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipo === 'todos' || r.tipo === filterTipo
    const matchStatus = filterStatus === 'todos' || r.status === filterStatus
    return matchSearch && matchTipo && matchStatus
  })

  const openNew = () => {
    reset({ tipo: 'BOS', status: 'aberto', pontuacao: 10 })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (r: Registro) => {
    setValue('tipo', r.tipo)
    setValue('colaborador_id', r.colaborador_id)
    setValue('descricao', r.descricao)
    setValue('categoria', r.categoria)
    setValue('data_ocorrencia', r.data_ocorrencia)
    setValue('pontuacao', r.pontuacao)
    setValue('status', r.status)
    setValue('observacoes', r.observacoes ?? '')
    setEditingId(r.id)
    setShowForm(true)
  }

  const onSubmit = async (data: RegistroFormData) => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = (supabase as any).from('registros')

    if (editingId) {
      const { data: updated, error } = await table
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingId)
        .select('*, colaboradores(nome, setor, matricula)')
        .single()

      if (!error && updated) {
        setRegistros((prev) => prev.map((r) => (r.id === editingId ? updated as Registro : r)))
      }
    } else {
      const { data: created, error } = await table
        .insert({ ...data, user_id: session.user.id })
        .select('*, colaboradores(nome, setor, matricula)')
        .single()

      if (!error && created) {
        setRegistros((prev) => [created as Registro, ...prev])
      }
    }

    setLoading(false)
    setShowForm(false)
    reset()
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este registro?')) return
    const { error } = await supabase.from('registros').delete().eq('id', id)
    if (!error) {
      setRegistros((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as 'todos' | 'BOS' | 'BOA')}
            className="input-field w-auto"
          >
            <option value="todos">Todos os tipos</option>
            <option value="BOS">BOS</option>
            <option value="BOA">BOA</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="todos">Todos os status</option>
            <option value="aberto">Aberto</option>
            <option value="em_analise">Em Análise</option>
            <option value="encerrado">Encerrado</option>
          </select>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Novo Registro
        </button>
      </div>

      {showForm && (
        <div className="card border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? 'Editar Registro' : 'Novo Registro'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select {...register('tipo')} className="input-field">
                <option value="BOS">BOS - Boletim de Ocorrência de Segurança</option>
                <option value="BOA">BOA - Boletim de Ocorrência Administrativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador *</label>
              <select {...register('colaborador_id')} className="input-field">
                <option value="">Selecione o colaborador</option>
                {colaboradores.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.matricula})</option>
                ))}
              </select>
              {errors.colaborador_id && <p className="text-red-500 text-xs mt-1">{errors.colaborador_id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select {...register('categoria')} className="input-field">
                <option value="">Selecione a categoria</option>
                {categoriasParaTipo.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Ocorrência *</label>
              <input {...register('data_ocorrencia')} type="date" className="input-field" />
              {errors.data_ocorrencia && <p className="text-red-500 text-xs mt-1">{errors.data_ocorrencia.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontuação * <span className="text-gray-400 font-normal">(1-100)</span>
              </label>
              <input
                {...register('pontuacao', { valueAsNumber: true })}
                type="number"
                min={1}
                max={100}
                className="input-field"
              />
              {errors.pontuacao && <p className="text-red-500 text-xs mt-1">{errors.pontuacao.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option value="aberto">Aberto</option>
                <option value="em_analise">Em Análise</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <textarea
                {...register('descricao')}
                rows={3}
                className="input-field resize-none"
                placeholder="Descreva a ocorrência detalhadamente..."
              />
              {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                {...register('observacoes')}
                rows={2}
                className="input-field resize-none"
                placeholder="Observações adicionais..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Check className="w-4 h-4" />
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Colaborador</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pontuação</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={cn('badge', getTipoColor(r.tipo))}>{r.tipo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{r.colaboradores?.nome ?? '-'}</p>
                        <p className="text-xs text-gray-400">{r.colaboradores?.setor}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.categoria}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(r.data_ocorrencia)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'font-semibold',
                        r.tipo === 'BOS' ? 'text-red-600' : 'text-green-600'
                      )}>
                        {r.tipo === 'BOS' ? '-' : '+'}{r.pontuacao}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', getStatusColor(r.status))}>
                        {getStatusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
