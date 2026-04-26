import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ColaboradoresClient } from '@/components/colaboradores/ColaboradoresClient'

export default async function ColaboradoresPage() {
  const supabase = createServerClient()
  const { data: colaboradores } = await supabase
    .from('colaboradores')
    .select('*')
    .order('nome')

  const { data: setores } = await supabase
    .from('setores')
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
        setores={setores ?? []}
      />
    </div>
  )
}
