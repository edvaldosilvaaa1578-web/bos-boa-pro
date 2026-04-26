import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { RankingClient } from '@/components/ranking/RankingClient'

type RegistroComColab = {
  colaborador_id: string
  tipo: string
  pontuacao: number
  colaboradores: { id: string; nome: string; setor: string; matricula: string; cargo: string } | null
}

export default async function RankingPage() {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('registros')
    .select('colaborador_id, tipo, pontuacao, colaboradores(id, nome, setor, matricula, cargo)')
    .eq('status', 'encerrado')

  const registros = (data ?? []) as unknown as RegistroComColab[]

  const rankingMap = new Map<string, {
    id: string
    nome: string
    setor: string
    matricula: string
    cargo: string
    pontuacao: number
    totalBOS: number
    totalBOA: number
  }>()

  for (const r of registros) {
    const colab = r.colaboradores
    if (!colab) continue

    const existing = rankingMap.get(colab.id) ?? {
      id: colab.id,
      nome: colab.nome,
      setor: colab.setor,
      matricula: colab.matricula,
      cargo: colab.cargo,
      pontuacao: 0,
      totalBOS: 0,
      totalBOA: 0,
    }

    if (r.tipo === 'BOS') {
      existing.pontuacao -= r.pontuacao
      existing.totalBOS += 1
    } else {
      existing.pontuacao += r.pontuacao
      existing.totalBOA += 1
    }

    rankingMap.set(colab.id, existing)
  }

  const ranking = Array.from(rankingMap.values()).sort((a, b) => b.pontuacao - a.pontuacao)

  return (
    <div>
      <Header
        title="Ranking de Colaboradores"
        subtitle="Classificação baseada nos registros BOS/BOA"
      />
      <RankingClient ranking={ranking} />
    </div>
  )
}
