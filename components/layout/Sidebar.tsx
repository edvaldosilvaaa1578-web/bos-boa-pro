'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Trophy,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  UserCog,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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

interface Props {
  userPerfil: UserPerfil
}

export function Sidebar({ userPerfil }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initial = userPerfil.nome.charAt(0).toUpperCase()

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-primary-900 text-white flex flex-col z-50">
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
        {navItems.map((item) => {
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

        {userPerfil.role === 'admin' && (
          <Link
            href="/usuarios"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === '/usuarios'
                ? 'bg-primary-700 text-white'
                : 'text-primary-300 hover:bg-primary-800 hover:text-white'
            )}
          >
            <UserCog className="w-5 h-5 flex-shrink-0" />
            Usuários
          </Link>
        )}
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
}
