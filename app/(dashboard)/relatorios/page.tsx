import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { RelatoriosClient } from '@/components/relatorios/RelatoriosClient'

type RegistroRelatorio = {
  tipo: 'BOS' | 'BOA'
  categoria: string
  status: string
  pontuacao: number
  data_ocorrencia: string
  colaboradores: { nome: string; setor: string } | null
}

export default async function RelatoriosPage() {
  const supabase = await createServerClient()

  const [{ data: registrosData }, { count: totalColaboradores }] = await Promise.all([
    supabase
      .from('registros')
      .select('tipo, categoria, status, pontuacao, data_ocorrencia, colaboradores(nome, setor)')
      .order('data_ocorrencia', { ascending: false }),
    supabase
      .from('colaboradores')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true),
  ])

  const registros = (registrosData ?? []) as unknown as RegistroRelatorio[]

  return (
    <div>
      <Header
        title="Relatórios"
        subtitle="Análises e estatísticas dos registros BOS/BOA"
      />
      <RelatoriosClient
        registros={registros}
        totalColaboradores={totalColaboradores ?? 0}
      />
    </div>
  )
}
