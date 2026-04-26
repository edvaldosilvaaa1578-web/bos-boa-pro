import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ConfiguracoesClient } from '@/components/configuracoes/ConfiguracoesClient'

export default async function ConfiguracoesPage() {
  const supabase = createServerClient()

  const [{ data: setores }, { data: categorias }] = await Promise.all([
    supabase.from('setores').select('*').order('nome'),
    supabase.from('categorias').select('*').order('nome'),
  ])

  return (
    <div>
      <Header
        title="Configurações"
        subtitle="Gerencie setores, categorias e preferências do sistema"
      />
      <ConfiguracoesClient
        setores={setores ?? []}
        categorias={categorias ?? []}
      />
    </div>
  )
}
