import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { RegistrosClient } from '@/components/registros/RegistrosClient'
import { Database } from '@/lib/supabase/types'

type RegistroComColab = Database['public']['Tables']['registros']['Row'] & {
  colaboradores: { nome: string; setor: string; matricula: string } | null
  categorias: { nome: string; pontos: number } | null
}

export default async function RegistrosPage() {
  const supabase = await createServerClient()

  const { data: registrosRaw } = await supabase
    .from('registros')
    .select('*, colaboradores(nome, setor, matricula), categorias(nome, pontos)')
    .order('created_at', { ascending: false })

  const { data: colaboradores } = await supabase
    .from('colaboradores')
    .select('id, nome, matricula, setor')
    .eq('ativo', true)
    .order('nome')

  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('nome')

  const registros = (registrosRaw ?? []) as unknown as RegistroComColab[]

  return (
    <div>
      <Header
        title="Registros BOS/BOA"
        subtitle="Gerencie os boletins de ocorrência"
      />
      <RegistrosClient
        registros={registros}
        colaboradores={colaboradores ?? []}
        categorias={categorias ?? []}
      />
    </div>
  )
}
