'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export type Perfil = {
  id: string
  nome: string
  email: string
  role: 'admin' | 'gestor' | 'viewer'
  created_at: string
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'viewer', label: 'Visualizador' },
]

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  gestor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  viewer: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

export function UsuariosClient({ perfis: initial }: { perfis: Perfil[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const [perfis, setPerfis] = useState(initial)
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRoleChange = (id: string, role: string) => {
    setPendingRoles((prev) => ({ ...prev, [id]: role }))
  }

  const handleSave = async (id: string) => {
    const newRole = pendingRoles[id]
    if (!newRole || newRole === perfis.find((p) => p.id === id)?.role) return
    setSaving(id)
    setError(null)
    setSuccess(null)

    const { error: err } = await supabase
      .from('perfis')
      .update({ role: newRole })
      .eq('id', id)

    if (err) {
      setError(err.message)
    } else {
      setPerfis((prev) =>
        prev.map((p) => (p.id === id ? { ...p, role: newRole as Perfil['role'] } : p))
      )
      setPendingRoles((prev) => { const next = { ...prev }; delete next[id]; return next })
      setSuccess('Role atualizado com sucesso.')
      setTimeout(() => setSuccess(null), 3000)
    }
    setSaving(null)
  }

  return (
    <div className="p-6 space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role Atual</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Alterar Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Criado em</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {perfis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                perfis.map((p) => {
                  const currentRole = pendingRoles[p.id] ?? p.role
                  const isDirty = pendingRoles[p.id] && pendingRoles[p.id] !== p.role
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{p.nome}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.email}</td>
                      <td className="px-4 py-3">
                        <span className={cn('badge', ROLE_COLORS[p.role] ?? ROLE_COLORS.viewer)}>
                          {ROLE_OPTIONS.find((r) => r.value === p.role)?.label ?? p.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={currentRole}
                          onChange={(e) => handleRoleChange(p.id, e.target.value)}
                          className="input-field w-auto text-sm"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(p.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSave(p.id)}
                          disabled={!isDirty || saving === p.id}
                          className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 disabled:opacity-40"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {saving === p.id ? 'Salvando...' : 'Salvar'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          {perfis.length} usuário{perfis.length !== 1 ? 's' : ''} cadastrado{perfis.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
