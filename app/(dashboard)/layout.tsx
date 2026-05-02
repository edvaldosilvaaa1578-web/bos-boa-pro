import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

export type UserPerfil = {
  nome: string
  role: 'admin' | 'gestor' | 'viewer'
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: perfil } = await (supabase as any)
    .from('perfis')
    .select('nome, role')
    .eq('id', session.user.id)
    .single()

  const userPerfil: UserPerfil = {
    nome: perfil?.nome ?? session.user.email?.split('@')[0] ?? 'Usuário',
    role: (perfil?.role ?? 'admin') as UserPerfil['role'],
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar userPerfil={userPerfil} />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
