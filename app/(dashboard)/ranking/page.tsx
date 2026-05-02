import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { RankingClient } from '@/components/ranking/RankingClient'

export type ColaboradorRanking = {
  id: string
  nome: string
  matricula: string
  cargo: string
  setor: string
  registros: { tipo: 'BOS' | 'BOA'; pontos: number; data_ocorrencia: string }[]
}

export default async function RankingPage() {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from('colaboradores')
    .select(`
      id, nome, matricula, cargo, setor,
      registros(tipo, pontos, data_ocorrencia)
    `)
    .eq('ativo', true)

  const colaboradores = (data ?? []) as unknown as ColaboradorRanking[]

  return (
    <div>
      <Header
        title="Ranking de Colaboradores"
        subtitle="Classificação baseada em todos os registros BOS/BOA"
      />
      <RankingClient colaboradores={colaboradores} />
    </div>
  )
}
