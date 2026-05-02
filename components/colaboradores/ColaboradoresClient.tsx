'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Edit2, UserCheck, UserX, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'

type Setor = { id: string; nome: string }

type Colaborador = {
  id: string
  nome: string
  matricula: string
  setor_id: string
  cargo: string
  email: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

const colaboradorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  setor_id: z.string().min(1, 'Setor é obrigatório'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  ativo: z.boolean().default(true),
})

type ColaboradorFormData = z.infer<typeof colaboradorSchema>

interface Props {
  colaboradores: Colaborador[]
}

const PAGE_SIZE = 10

export function ColaboradoresClient({ colaboradores: initial }: Props) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  const [colaboradores, setColaboradores] = useState(initial)
  const [setores, setSetores] = useState<Setor[]>([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    supabase.from('setores').select('id, nome').order('nome').then(({ data }: { data: Setor[] | null }) => {
      if (data) setSetores(data)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSetorNome = (setor_id: string) =>
    setores.find((s) => s.id === setor_id)?.nome ?? setor_id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: { ativo: true },
  })

  const filtered = colaboradores.filter((c) => {
    const setorNome = getSetorNome(c.setor_id).toLowerCase()
    const q = search.toLowerCase()
    return (
      c.nome.toLowerCase().includes(q) ||
      c.matricula.toLowerCase().includes(q) ||
      setorNome.includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }

  const openNew = () => {
    reset({ ativo: true, setor_id: '' })
    setSubmitError(null)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (c: Colaborador) => {
    reset({
      nome: c.nome,
      matricula: c.matricula,
      setor_id: c.setor_id,
      cargo: c.cargo,
      email: c.email ?? '',
      ativo: c.ativo,
    })
    setSubmitError(null)
    setEditingId(c.id)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSubmitError(null)
    reset()
  }

  const onSubmit = async (data: ColaboradorFormData) => {
    setLoading(true)
    setSubmitError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSubmitError('Sessão expirada. Faça login novamente.')
      setLoading(false)
      return
    }

    const payload = {
      nome: data.nome,
      matricula: data.matricula,
      setor_id: data.setor_id,
      cargo: data.cargo,
      email: data.email || null,
      ativo: data.ativo,
    }

    console.log('payload:', payload)

    if (editingId) {
      const { data: updated, error } = await supabase
        .from('colaboradores')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editingId)
        .select()
        .single()

      if (error) {
        setSubmitError(error.message)
        setLoading(false)
        return
      }
      if (updated) {
        setColaboradores((prev: Colaborador[]) =>
          prev.map((c) => (c.id === editingId ? updated as Colaborador : c))
        )
      }
    } else {
      const { data: created, error } = await supabase
        .from('colaboradores')
        .insert(payload)
        .select()
        .single()

      if (error) {
        setSubmitError(error.message)
        setLoading(false)
        return
      }
      if (created) {
        setColaboradores((prev: Colaborador[]) => [created as Colaborador, ...prev])
      }
    }

    setLoading(false)
    closeModal()
    router.refresh()
  }

  const toggleAtivo = async (c: Colaborador) => {
    const { data: updated } = await supabase
      .from('colaboradores')
      .update({ ativo: !c.ativo, updated_at: new Date().toISOString() })
      .eq('id', c.id)
      .select()
      .single()
    if (updated) {
      setColaboradores((prev: Colaborador[]) =>
        prev.map((x) => (x.id === c.id ? updated as Colaborador : x))
      )
    }
  }

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, matrícula ou setor..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Matrícula</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Setor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Cargo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                    Nenhum colaborador encontrado
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{c.nome}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.matricula}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{getSetorNome(c.setor_id)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.cargo}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'badge',
                        c.ativo
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      )}>
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => toggleAtivo(c)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title={c.ativo ? 'Inativar' : 'Ativar'}
                        >
                          {c.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} colaborador{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
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
        title={editingId ? 'Editar Colaborador' : 'Novo Colaborador'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {submitError && (
            <div className="md:col-span-2 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome *</label>
            <input {...register('nome')} className="input-field" placeholder="Nome completo" />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matrícula *</label>
            <input {...register('matricula')} className="input-field" placeholder="Matrícula" />
            {errors.matricula && <p className="text-red-500 text-xs mt-1">{errors.matricula.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setor *</label>
            <select {...register('setor_id')} className="input-field">
              <option value="">Selecione o setor</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            {setores.length === 0 && (
              <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                Carregando setores...
              </p>
            )}
            {errors.setor_id && <p className="text-red-500 text-xs mt-1">{errors.setor_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo *</label>
            <input {...register('cargo')} className="input-field" placeholder="Cargo" />
            {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
            <input {...register('email')} type="email" className="input-field" placeholder="email@empresa.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="ativo"
              {...register('ativo')}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="ativo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Colaborador ativo
            </label>
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
