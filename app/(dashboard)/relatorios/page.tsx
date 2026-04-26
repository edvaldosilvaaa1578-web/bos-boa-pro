import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { RelatoriosClient } from '@/components/relatorios/RelatoriosClient'

type RegistroRelatorio = {
  tipo: string
  categoria: string
  status: string
  pontuacao: number
  data_ocorrencia: string
  created_at: string
  colaboradores: { nome: string; setor: string } | null
}

export default async function RelatoriosPage() {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('registros')
    .select('tipo, categoria, status, pontuacao, data_ocorrencia, created_at, colaboradores(nome, setor)')
    .order('data_ocorrencia', { ascending: false })

  const registros = (data ?? []) as unknown as RegistroRelatorio[]

  return (
    <div>
      <Header
        title="Relatórios"
        subtitle="Análises e estatísticas dos registros BOS/BOA"
      />
      <RelatoriosClient registros={registros} />
    </div>
  )
}
