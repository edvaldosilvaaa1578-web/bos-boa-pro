'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registroSchema, type RegistroFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react'
import { cn, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { TypeBadge } from '@/components/ui/TypeBadge'

type Registro = Database['public']['Tables']['registros']['Row'] & {
  colaboradores?: { nome: string; setor: string; matricula: string } | null
  categorias?: { nome: string; pontos: number } | null
}
type Colaborador = { id: string; nome: string; matricula: string; setor: string }
type Categoria = Database['public']['Tables']['categorias']['Row']

interface Props {
  registros: Registro[]
  colaboradores: Colaborador[]
  categorias: Categoria[]
}

const defaultCategoriasBOS = ['Acidente de Trabalho', 'Quase Acidente', 'Ato Inseguro', 'Condição Insegura', 'EPI', 'Outros']
const defaultCategoriasBOA = ['Bom Desempenho', 'Sugestão de Melhoria', 'Trabalho em Equipe', 'Proatividade', 'Outros']

const PAGE_SIZE = 10

export function RegistrosClient({ registros: initial, colaboradores, categorias }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [registros, setRegistros] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState<'todos' | 'BOS' | 'BOA'>('todos')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

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
  const watchedCategoria = watch('categoria')

  // Auto-fill pontuação when category changes (watchedCategoria now holds the UUID)
  useEffect(() => {
    if (!watchedCategoria || categorias.length === 0) return
    const found = categorias.find((c) => c.id === watchedCategoria)
    if (found) setValue('pontuacao', found.pontuacao_padrao)
  }, [watchedCategoria, watchedTipo, categorias, setValue])

  // Reset category when tipo changes (category list changes)
  useEffect(() => {
    setValue('categoria', '')
  }, [watchedTipo, setValue])

  const categoriasParaTipo = categorias.length > 0
    ? categorias.filter((c) => c.tipo === watchedTipo)
    : (watchedTipo === 'BOS' ? defaultCategoriasBOS : defaultCategoriasBOA).map((nome) => ({
        id: nome, nome, tipo: watchedTipo, pontuacao_padrao: 10, descricao: null, created_at: '',
      }))

  const filtered = registros.filter((r) => {
    const matchSearch =
      (r.colaboradores?.nome ?? '').toLowerCase().includes(search.toLowerCase()) ||
      r.descricao.toLowerCase().includes(search.toLowerCase()) ||
      r.categoria.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipo === 'todos' || r.tipo === filterTipo
    const matchStatus = filterStatus === 'todos' || r.status === filterStatus
    return matchSearch && matchTipo && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleFilterTipo = (v: 'todos' | 'BOS' | 'BOA') => { setFilterTipo(v); setPage(1) }
  const handleFilterStatus = (v: string) => { setFilterStatus(v); setPage(1) }

  const openNew = () => {
    reset({ tipo: 'BOS', status: 'aberto', pontuacao: 10 })
    setSubmitError(null)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (r: Registro) => {
    reset({
      tipo: r.tipo,
      colaborador_id: r.colaborador_id,
      descricao: r.descricao,
      categoria: (r as unknown as Record<string, string>).categoria_id ?? r.categoria ?? '',
      data_ocorrencia: r.data_ocorrencia,
      pontuacao: (r as unknown as Record<string, number>).pontos ?? r.pontuacao ?? 10,
      status: r.status,
      observacoes: r.observacoes ?? '',
    })
    setSubmitError(null)
    setEditingId(r.id)
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setSubmitError(null); reset() }

  const onSubmit = async (data: RegistroFormData) => {
    setLoading(true)
    setSubmitError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSubmitError('Sessão expirada. Faça login novamente.')
      setLoading(false)
      return
    }

    const payload = {
      tipo: data.tipo,
      colaborador_id: data.colaborador_id,
      categoria_id: data.categoria,
      descricao: data.descricao,
      pontos: data.pontuacao,
      data_ocorrencia: data.data_ocorrencia,
      registrado_por: session.user.id,
    }

    console.log('payload:', payload)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = (supabase as any).from('registros_v2')

    if (editingId) {
      const { data: updated, error } = await table
        .update(payload)
        .eq('id', editingId)
        .select('*, colaboradores(nome, setor, matricula), categorias(nome, pontos)')
        .single()

      if (error) {
        console.error('Erro ao atualizar registro:', error)
        setSubmitError(error.message)
        setLoading(false)
        return
      }
      if (updated) {
        setRegistros((prev) => prev.map((r) => (r.id === editingId ? updated as Registro : r)))
      }
    } else {
      const { data: created, error } = await table
        .insert(payload)
        .select('*, colaboradores(nome, setor, matricula), categorias(nome, pontos)')
        .single()

      if (error) {
        console.error('Erro ao criar registro:', error)
        setSubmitError(error.message)
        setLoading(false)
        return
      }
      if (created) {
        setRegistros((prev) => [created as Registro, ...prev])
      }
    }

    setLoading(false)
    closeModal()
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este registro?')) return
    const { error } = await supabase.from('registros_v2').delete().eq('id', id)
    if (!error) setRegistros((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => handleFilterTipo(e.target.value as 'todos' | 'BOS' | 'BOA')}
            className="input-field w-auto min-w-[140px]"
          >
            <option value="todos">Todos os tipos</option>
            <option value="BOS">BOS</option>
            <option value="BOA">BOA</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterStatus(e.target.value)}
            className="input-field w-auto min-w-[140px]"
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

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Colaborador</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Data</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Pontos</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <TypeBadge tipo={r.tipo} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{r.colaboradores?.nome ?? '-'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{r.colaboradores?.setor}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.categorias?.nome ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(r.data_ocorrencia)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'font-semibold',
                        r.tipo === 'BOS' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      )}>
                        {r.tipo === 'BOS' ? '-' : '+'}{r.categorias?.pontos ?? r.pontuacao}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', getStatusColor(r.status))}>
                        {getStatusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Editar Registro' : 'Novo Registro'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submitError && (
            <div className="md:col-span-2 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo *</label>
            <select {...register('tipo')} className="input-field">
              <option value="BOS">BOS — Boletim de Ocorrência de Segurança</option>
              <option value="BOA">BOA — Boletim de Ocorrência Administrativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Colaborador *</label>
            <select {...register('colaborador_id')} className="input-field">
              <option value="">Selecione o colaborador</option>
              {colaboradores.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} ({c.matricula})</option>
              ))}
            </select>
            {errors.colaborador_id && <p className="text-red-500 text-xs mt-1">{errors.colaborador_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
            <select {...register('categoria')} className="input-field">
              <option value="">Selecione a categoria</option>
              {categoriasParaTipo.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data da Ocorrência *</label>
            <input {...register('data_ocorrencia')} type="date" className="input-field" />
            {errors.data_ocorrencia && <p className="text-red-500 text-xs mt-1">{errors.data_ocorrencia.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pontuação *
              <span className="ml-1 text-xs text-gray-400 font-normal">(auto-preenchido pela categoria)</span>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select {...register('status')} className="input-field">
              <option value="aberto">Aberto</option>
              <option value="em_analise">Em Análise</option>
              <option value="encerrado">Encerrado</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição *</label>
            <textarea
              {...register('descricao')}
              rows={3}
              className="input-field resize-none"
              placeholder="Descreva a ocorrência detalhadamente..."
            />
            {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações</label>
            <textarea
              {...register('observacoes')}
              rows={2}
              className="input-field resize-none"
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Check className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
