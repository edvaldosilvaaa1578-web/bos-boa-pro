'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { colaboradorSchema, type ColaboradorFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Plus, Search, Edit2, Trash2, X, Check, UserCheck, UserX } from 'lucide-react'
import { cn } from '@/lib/utils'

type Colaborador = Database['public']['Tables']['colaboradores']['Row']
type Setor = Database['public']['Tables']['setores']['Row']

interface Props {
  colaboradores: Colaborador[]
  setores: Setor[]
}

export function ColaboradoresClient({ colaboradores: initial, setores }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [colaboradores, setColaboradores] = useState(initial)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: { ativo: true },
  })

  const filtered = colaboradores.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.matricula.toLowerCase().includes(search.toLowerCase()) ||
      c.setor.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    reset({ ativo: true })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (c: Colaborador) => {
    setValue('nome', c.nome)
    setValue('matricula', c.matricula)
    setValue('setor', c.setor)
    setValue('cargo', c.cargo)
    setValue('email', c.email ?? '')
    setValue('telefone', c.telefone ?? '')
    setValue('ativo', c.ativo)
    setEditingId(c.id)
    setShowForm(true)
  }

  const onSubmit = async (data: ColaboradorFormData) => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = (supabase as any).from('colaboradores')

    if (editingId) {
      const { data: updated, error } = await table
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingId)
        .select()
        .single()

      if (!error && updated) {
        setColaboradores((prev) => prev.map((c) => (c.id === editingId ? (updated as Colaborador) : c)))
      }
    } else {
      const { data: created, error } = await table
        .insert({ ...data, user_id: session.user.id })
        .select()
        .single()

      if (!error && created) {
        setColaboradores((prev) => [created, ...prev])
      }
    }

    setLoading(false)
    setShowForm(false)
    reset()
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este colaborador?')) return
    const { error } = await supabase.from('colaboradores').delete().eq('id', id)
    if (!error) {
      setColaboradores((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const toggleAtivo = async (c: Colaborador) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated } = await (supabase as any)
      .from('colaboradores')
      .update({ ativo: !c.ativo, updated_at: new Date().toISOString() })
      .eq('id', c.id)
      .select()
      .single()
    if (updated) {
      setColaboradores((prev) => prev.map((x) => (x.id === c.id ? (updated as Colaborador) : x)))
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, matrícula ou setor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </button>
      </div>

      {showForm && (
        <div className="card border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input {...register('nome')} className="input-field" placeholder="Nome completo" />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
              <input {...register('matricula')} className="input-field" placeholder="Matrícula" />
              {errors.matricula && <p className="text-red-500 text-xs mt-1">{errors.matricula.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setor *</label>
              {setores.length > 0 ? (
                <select {...register('setor')} className="input-field">
                  <option value="">Selecione o setor</option>
                  {setores.map((s) => (
                    <option key={s.id} value={s.nome}>{s.nome}</option>
                  ))}
                </select>
              ) : (
                <input {...register('setor')} className="input-field" placeholder="Nome do setor" />
              )}
              {errors.setor && <p className="text-red-500 text-xs mt-1">{errors.setor.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
              <input {...register('cargo')} className="input-field" placeholder="Cargo" />
              {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input {...register('email')} type="email" className="input-field" placeholder="email@empresa.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input {...register('telefone')} className="input-field" placeholder="(11) 99999-9999" />
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Matrícula</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Setor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cargo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhum colaborador encontrado
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{c.matricula}</td>
                    <td className="px-4 py-3 text-gray-600">{c.setor}</td>
                    <td className="px-4 py-3 text-gray-600">{c.cargo}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', c.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => toggleAtivo(c)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={c.ativo ? 'Inativar' : 'Ativar'}
                        >
                          {c.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
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
          {filtered.length} colaborador{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
