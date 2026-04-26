'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { setorSchema, type SetorFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Plus, Trash2, X, Check, Building2, Tag } from 'lucide-react'

type Setor = Database['public']['Tables']['setores']['Row']
type Categoria = Database['public']['Tables']['categorias']['Row']

interface Props {
  setores: Setor[]
  categorias: Categoria[]
}

export function ConfiguracoesClient({ setores: initialSetores, categorias: initialCategorias }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [setores, setSetores] = useState(initialSetores)
  const [categorias, setCategorias] = useState(initialCategorias)
  const [showSetorForm, setShowSetorForm] = useState(false)
  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', tipo: 'BOS' as 'BOS' | 'BOA', pontuacao_padrao: 10, descricao: '' })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'setores' | 'categorias'>('setores')

  const {
    register: registerSetor,
    handleSubmit: handleSubmitSetor,
    reset: resetSetor,
    formState: { errors: errorsSetor },
  } = useForm<SetorFormData>({
    resolver: zodResolver(setorSchema),
  })

  const onSubmitSetor = async (data: SetorFormData) => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: created } = await (supabase as any)
      .from('setores')
      .insert({ ...data, user_id: session.user.id })
      .select()
      .single()

    if (created) {
      setSetores((prev) => [...prev, created as Setor].sort((a, b) => a.nome.localeCompare(b.nome)))
    }

    setLoading(false)
    setShowSetorForm(false)
    resetSetor()
    router.refresh()
  }

  const deleteSetor = async (id: string) => {
    if (!confirm('Deseja excluir este setor?')) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('setores').delete().eq('id', id)
    if (!error) setSetores((prev) => prev.filter((s) => s.id !== id))
  }

  const onSubmitCategoria = async () => {
    if (!novaCategoria.nome.trim()) return
    setLoading(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: created } = await (supabase as any)
      .from('categorias')
      .insert(novaCategoria)
      .select()
      .single()

    if (created) {
      setCategorias((prev) => [...prev, created as Categoria].sort((a, b) => a.nome.localeCompare(b.nome)))
    }

    setLoading(false)
    setShowCategoriaForm(false)
    setNovaCategoria({ nome: '', tipo: 'BOS', pontuacao_padrao: 10, descricao: '' })
    router.refresh()
  }

  const deleteCategoria = async (id: string) => {
    if (!confirm('Deseja excluir esta categoria?')) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('categorias').delete().eq('id', id)
    if (!error) setCategorias((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'setores', label: 'Setores', icon: Building2 },
          { id: 'categorias', label: 'Categorias', icon: Tag },
        ].map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'setores' | 'categorias')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'setores' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Setores Cadastrados</h3>
            <button
              onClick={() => setShowSetorForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Setor
            </button>
          </div>

          {showSetorForm && (
            <div className="card border-primary-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Novo Setor</h4>
                <button onClick={() => setShowSetorForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmitSetor(onSubmitSetor)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input {...registerSetor('nome')} className="input-field" placeholder="Nome do setor" />
                  {errorsSetor.nome && <p className="text-red-500 text-xs mt-1">{errorsSetor.nome.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input {...registerSetor('descricao')} className="input-field" placeholder="Descrição (opcional)" />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowSetorForm(false)} className="btn-secondary">Cancelar</button>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {setores.length === 0 ? (
              <div className="col-span-full card text-center py-8 text-gray-400">
                Nenhum setor cadastrado
              </div>
            ) : (
              setores.map((s) => (
                <div key={s.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{s.nome}</p>
                    {s.descricao && <p className="text-sm text-gray-500">{s.descricao}</p>}
                  </div>
                  <button
                    onClick={() => deleteSetor(s.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'categorias' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Categorias de Registro</h3>
            <button
              onClick={() => setShowCategoriaForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </button>
          </div>

          {showCategoriaForm && (
            <div className="card border-primary-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Nova Categoria</h4>
                <button onClick={() => setShowCategoriaForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    value={novaCategoria.nome}
                    onChange={(e) => setNovaCategoria((p) => ({ ...p, nome: e.target.value }))}
                    className="input-field"
                    placeholder="Nome da categoria"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={novaCategoria.tipo}
                    onChange={(e) => setNovaCategoria((p) => ({ ...p, tipo: e.target.value as 'BOS' | 'BOA' }))}
                    className="input-field"
                  >
                    <option value="BOS">BOS</option>
                    <option value="BOA">BOA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pontuação Padrão</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={novaCategoria.pontuacao_padrao}
                    onChange={(e) => setNovaCategoria((p) => ({ ...p, pontuacao_padrao: Number(e.target.value) }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    value={novaCategoria.descricao}
                    onChange={(e) => setNovaCategoria((p) => ({ ...p, descricao: e.target.value }))}
                    className="input-field"
                    placeholder="Descrição (opcional)"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCategoriaForm(false)} className="btn-secondary">Cancelar</button>
                  <button onClick={onSubmitCategoria} disabled={loading} className="btn-primary flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Pontuação</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      Nenhuma categoria cadastrada
                    </td>
                  </tr>
                ) : (
                  categorias.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${c.tipo === 'BOS' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.pontuacao_padrao}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteCategoria(c.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
