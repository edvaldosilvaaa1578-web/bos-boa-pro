import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ColaboradoresClient } from '@/components/colaboradores/ColaboradoresClient'

export default async function ColaboradoresPage() {
  const supabase = await createServerClient()
  const { data: colaboradores } = await supabase
    .from('colaboradores_v2')
    .select('*')
    .order('nome')

  return (
    <div>
      <Header
        title="Colaboradores"
        subtitle="Gerencie os colaboradores cadastrados no sistema"
      />
      <ColaboradoresClient
        colaboradores={colaboradores ?? []}
      />
    </div>
  )
}
