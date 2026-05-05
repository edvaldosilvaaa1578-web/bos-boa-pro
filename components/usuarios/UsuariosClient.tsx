'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Check, AlertCircle, UserPlus, X, Mail,
  ShieldCheck, Eye, UserCog, Search, RefreshCw
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export type Perfil = {
  id: string
  nome: string
  email: string
  role: 'admin' | 'gestor' | 'viewer'
  ativo?: boolean
  created_at: string
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador', icon: ShieldCheck, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'gestor', label: 'Gestor', icon: UserCog, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'viewer', label: 'Visualizador', icon: Eye, color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
]

function getRoleInfo(role: string) {
  return ROLE_OPTIONS.find(r => r.value === role) ?? ROLE_OPTIONS[2]
}

interface InviteModalProps {
  onClose: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

function InviteModal({ onClose, onSuccess, onError }: InviteModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'gestor' | 'viewer'>('viewer')
  const [loading, setLoading] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao convidar')
      onSuccess(`Convite enviado para ${email}!`)
      onClose()
    } catch (err: any) {
      onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Convidar Usuário</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Enviar convite por email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleInvite} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                required
                className="input-field w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nível de acesso</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map(r => {
                const Icon = r.icon
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value as any)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-xs font-medium',
                      role === r.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {r.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {role === 'admin' && 'Acesso total ao sistema, incluindo gestão de usuários.'}
              {role === 'gestor' && 'Pode criar e gerenciar registros BOS/BOA e colaboradores.'}
              {role === 'viewer' && 'Apenas visualiza dados, sem permissão de edição.'}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {loading ? 'Enviando...' : 'Enviar Convite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function UsuariosClient({ perfis: initial }: { perfis: Perfil[] }) {
  const supabase = createClient() as any
  const [perfis, setPerfis] = useState(initial)
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 4000)
  }

  const showError = (msg: string) => {
    setError(msg)
    setTimeout(() => setError(null), 5000)
  }

  const handleRoleChange = (id: string, role: string) => {
    setPendingRoles(prev => ({ ...prev, [id]: role }))
  }

  const handleSave = async (id: string) => {
    const newRole = pendingRoles[id]
    if (!newRole || newRole === perfis.find(p => p.id === id)?.role) return
    setSaving(id)

    const { error: err } = await supabase
      .from('perfis')
      .update({ role: newRole })
      .eq('id', id)

    if (err) {
      showError(err.message)
    } else {
      setPerfis(prev => prev.map(p => p.id === id ? { ...p, role: newRole as Perfil['role'] } : p))
      setPendingRoles(prev => { const next = { ...prev }; delete next[id]; return next })
      showSuccess('Permissão atualizada com sucesso!')
    }
    setSaving(null)
  }

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    setSaving(id)
    const { error: err } = await supabase
      .from('perfis')
      .update({ ativo: !ativo })
      .eq('id', id)

    if (err) {
      showError(err.message)
    } else {
      setPerfis(prev => prev.map(p => p.id === id ? { ...p, ativo: !ativo } : p))
      showSuccess(!ativo ? 'Usuário ativado!' : 'Usuário desativado!')
    }
    setSaving(null)
  }

  const filtered = perfis.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || p.role === filterRole
    return matchSearch && matchRole
  })

  const stats = {
    total: perfis.length,
    admins: perfis.filter(p => p.role === 'admin').length,
    gestores: perfis.filter(p => p.role === 'gestor').length,
    ativos: perfis.filter(p => p.ativo !== false).length,
  }

  return (
    <div className="p-6 space-y-5">
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total de usuários', value: stats.total, color: 'text-gray-700 dark:text-gray-300', bg: '' },
          { label: 'Administradores', value: stats.admins, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/10' },
          { label: 'Gestores', value: stats.gestores, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Usuários ativos', value: stats.ativos, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/10' },
        ].map(s => (
          <div key={s.label} className={cn('card p-4 text-center', s.bg)}>
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros + botão */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="input-field w-full pl-9"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">Todos os perfis</option>
          {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          Convidar Usuário
        </button>
      </div>

      {/* Tabela */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Usuário</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Perfil atual</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Alterar perfil</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Cadastrado em</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                      <UserCog className="w-8 h-8 opacity-40" />
                      <p className="text-sm">
                        {search || filterRole !== 'all'
                          ? 'Nenhum usuário encontrado com os filtros aplicados'
                          : 'Nenhum usuário cadastrado'}
                      </p>
                      {!search && filterRole === 'all' && (
                        <button onClick={() => setShowInvite(true)} className="btn-primary text-xs mt-1">
                          Convidar primeiro usuário
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const roleInfo = getRoleInfo(p.role)
                  const currentRole = pendingRoles[p.id] ?? p.role
                  const isDirty = pendingRoles[p.id] && pendingRoles[p.id] !== p.role
                  const isAtivo = p.ativo !== false
                  const isSaving = saving === p.id

                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        'transition-colors',
                        isAtivo
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          : 'bg-gray-50/80 dark:bg-gray-800/50 opacity-60'
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-700 dark:text-primary-400">
                              {p.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{p.nome}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('badge', roleInfo.color)}>{roleInfo.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={currentRole}
                          onChange={e => handleRoleChange(p.id, e.target.value)}
                          disabled={!isAtivo}
                          className="input-field w-auto text-sm disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'badge',
                          isAtivo
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        )}>
                          {isAtivo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                        {formatDate(p.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isDirty && (
                            <button
                              onClick={() => handleSave(p.id)}
                              disabled={isSaving}
                              className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 disabled:opacity-40"
                            >
                              {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              Salvar
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleAtivo(p.id, isAtivo)}
                            disabled={isSaving}
                            className={cn(
                              'text-xs py-1.5 px-3 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-40',
                              isAtivo
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                            )}
                          >
                            {isSaving
                              ? <RefreshCw className="w-3 h-3 animate-spin" />
                              : isAtivo ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />
                            }
                            {isAtivo ? 'Desativar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Mostrando {filtered.length} de {perfis.length} usuário{perfis.length !== 1 ? 's' : ''}</span>
          <span>{stats.ativos} ativo{stats.ativos !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSuccess={showSuccess}
          onError={showError}
        />
      )}
    </div>
  )
}
