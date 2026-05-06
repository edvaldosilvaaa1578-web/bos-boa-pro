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

  useEffect(() => { setMobileOpen(false) }, [pathname])

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

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-64 z-50 flex-col bg-primary-900 text-white">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-700">
          <div className="bg-primary-700 p-2 rounded-lg">
            <Shield className="w-5 h-5 text-primary-200" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Gestão BOS/BOA</p>
            <p className="text-primary-400 text-xs">Pro</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {allNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-700 text-white' : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
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
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary-900 text-white flex items-center justify-between px-4 h-14 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-primary-700 p-1.5 rounded-lg">
            <Shield className="w-4 h-4 text-primary-200" />
          </div>
          <span className="font-bold text-sm">Gestão BOS/BOA</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-primary-300 hover:bg-primary-800">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== MOBILE DRAWER ===== */}
      <div className={cn(
        'lg:hidden fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col bg-primary-900 text-white transform transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-700">
          <div className="flex items-center gap-3">
            <div className="bg-primary-700 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-primary-200" />
            </div>
            <div>
              <p className="font-bold text-sm">Gestão BOS/BOA</p>
              <p className="text-primary-400 text-xs">Pro</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-primary-300 hover:bg-primary-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {allNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-700 text-white' : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-primary-700 space-y-2">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-200">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{userPerfil.nome}</p>
              <p className="text-xs text-primary-400">{ROLE_LABELS[userPerfil.role] ?? userPerfil.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around py-2">
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
            <Link key={item.href} href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl flex-1',
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
