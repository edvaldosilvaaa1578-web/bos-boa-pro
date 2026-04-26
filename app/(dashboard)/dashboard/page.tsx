import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { Database } from '@/lib/supabase/types'

type Registro = Database['public']['Tables']['registros']['Row']

export default async function DashboardPage() {
  const supabase = createServerClient()

  const { count: totalColaboradores } = await supabase
    .from('colaboradores')
    .select('*', { count: 'exact', head: true })
    .eq('ativo', true)

  const { data: registrosRaw } = await supabase
    .from('registros')
    .select('*')
    .order('created_at', { ascending: false })

  const registros: Registro[] = registrosRaw ?? []

  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { data: registrosMesRaw } = await supabase
    .from('registros')
    .select('*')
    .gte('created_at', inicioMes)

  const registrosMes: Registro[] = registrosMesRaw ?? []

  const totalBOS = registros.filter((r) => r.tipo === 'BOS').length
  const totalBOA = registros.filter((r) => r.tipo === 'BOA').length
  const abertos = registros.filter((r) => r.status === 'aberto').length
  const bosMes = registrosMes.filter((r) => r.tipo === 'BOS').length
  const boaMes = registrosMes.filter((r) => r.tipo === 'BOA').length

  const monthlyData = buildMonthlyData(registros)

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Visão geral do sistema de gestão BOS/BOA"
      />
      <DashboardClient
        stats={{
          totalColaboradores: totalColaboradores ?? 0,
          totalBOS,
          totalBOA,
          abertos,
          bosMes,
          boaMes,
        }}
        monthlyData={monthlyData}
      />
    </div>
  )
}

function buildMonthlyData(registros: Registro[]) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const now = new Date()
  const data = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthIndex = date.getMonth()
    const year = date.getFullYear()

    const bos = registros.filter((r) => {
      const d = new Date(r.created_at)
      return r.tipo === 'BOS' && d.getMonth() === monthIndex && d.getFullYear() === year
    }).length

    const boa = registros.filter((r) => {
      const d = new Date(r.created_at)
      return r.tipo === 'BOA' && d.getMonth() === monthIndex && d.getFullYear() === year
    }).length

    data.push({ mes: months[monthIndex], BOS: bos, BOA: boa })
  }

  return data
}
