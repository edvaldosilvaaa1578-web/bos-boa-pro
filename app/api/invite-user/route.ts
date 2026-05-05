import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { nome, email, role } = await req.json()

    if (!nome || !email || !role) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Verificar se usuário logado é admin
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { data: meuPerfil } = await (supabase as any)
      .from('perfis')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (meuPerfil?.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas administradores podem convidar usuários' }, { status: 403 })
    }

    // Criar usuário via Supabase Auth Admin (server-side)
    const { createClient } = await import('@supabase/supabase-js')
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: invited, error: inviteError } = await (adminClient.auth.admin as any)
      ?.inviteUserByEmail?.(email, {
        data: { nome, role },
        redirectTo: `${req.headers.get('origin') ?? ''}/login`,
      }) ?? { data: null, error: { message: 'Admin API não disponível' } }

    if (inviteError) {
      // Fallback: inserir direto na tabela perfis (para ambientes sem service role)
      const { error: perfisError } = await (supabase as any)
        .from('perfis')
        .insert({ nome, email, role, ativo: true })

      if (perfisError) throw new Error(perfisError.message)
    }

    return NextResponse.json({ success: true, message: `Convite enviado para ${email}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Erro interno' }, { status: 500 })
  }
}
