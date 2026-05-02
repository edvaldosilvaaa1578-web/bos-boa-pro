import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { UsuariosClient, type Perfil } from '@/components/usuarios/UsuariosClient'

export default async function UsuariosPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: meuPerfil } = await (supabase as any)
    .from('perfis')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (meuPerfil?.role && meuPerfil.role !== 'admin') redirect('/dashboard')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: usuarios } = await (supabase as any)
    .from('perfis')
    .select('*')
    .order('created_at')

  return (
    <div>
      <Header
        title="Gestão de Usuários"
        subtitle="Gerencie permissões e roles dos usuários do sistema"
      />
      <UsuariosClient perfis={(usuarios ?? []) as Perfil[]} />
    </div>
  )
}
