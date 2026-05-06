'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, ClipboardList, Trophy,
  BarChart3, Settings, Shield, LogOut, UserCog, Menu, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { UserPerfil } from '@/app/(dashboard)/layout'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/colaboradores', label: 'Colaboradores', icon: Users },
  { href: '/registros', label: 'Registros', icon: ClipboardList },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  gestor: 'Gestor',
  viewer: 'Visualizador',
}

interface Props { userPerfil: UserPerfil }

export function Sidebar({ userPerfil }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Fecha o menu ao navegar
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Bloqueia scroll quando menu aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initial = userPerfil.nome.charAt(0).toUpperCase()

  const allNavItems = [
    ...navItems,
    ...(userPerfil.role === 'admin' ? [{ href: '/usuarios', label: 'Usuários', icon: UserCog }] : []),
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-primary-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="bg-primary-700 p-2 rounded-lg">
            <Shield className="w-5 h-5 text-primary-200" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Gestão BOS/BOA</p>
            <p className="text-primary-400 text-xs">Pro</p>
          </div>
        </div>
        {/* Botão fechar no mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-primary-800 text-primary-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {allNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-300 hover:bg-primary-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-primary-700 space-y-2">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-200">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userPerfil.nome}</p>
            <p className="text-xs text-primary-400">{ROLE_LABELS[userPerfil.role] ?? userPerfil.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-64 z-50 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary-900 text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-primary-700 p-1.5 rounded-lg">
            <Shield className="w-4 h-4 text-primary-200" />
          </div>
          <span className="font-bold text-sm">Gestão BOS/BOA</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-primary-800 text-primary-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </div>

      {/* Mobile bottom nav (5 itens principais) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around px-2 py-1 safe-area-pb">
        {[
          { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
          { href: '/colaboradores', label: 'Equipe', icon: Users },
          { href: '/registros', label: 'Registros', icon: ClipboardList },
          { href: '/ranking', label: 'Ranking', icon: Trophy },
          { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'scale-110 transition-transform')} />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary-600 dark:bg-primary-400" />}
            </Link>
          )
        })}
      </div>
    </>
  )
}
