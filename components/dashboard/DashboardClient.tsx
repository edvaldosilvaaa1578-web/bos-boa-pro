'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Users, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react'

interface Stats {
  totalColaboradores: number
  totalBOS: number
  totalBOA: number
  abertos: number
  bosMes: number
  boaMes: number
}

interface MonthlyDataPoint {
  mes: string
  BOS: number
  BOA: number
}

interface DashboardClientProps {
  stats: Stats
  monthlyData: MonthlyDataPoint[]
}

const COLORS = ['#ef4444', '#22c55e']

export function DashboardClient({ stats, monthlyData }: DashboardClientProps) {
  const pieData = [
    { name: 'BOS', value: stats.totalBOS },
    { name: 'BOA', value: stats.totalBOA },
  ]

  const statCards = [
    {
      label: 'Colaboradores Ativos',
      value: stats.totalColaboradores,
      icon: Users,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total BOS',
      value: stats.totalBOS,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bg: 'bg-red-50',
      sub: `${stats.bosMes} este mês`,
    },
    {
      label: 'Total BOA',
      value: stats.totalBOA,
      icon: CheckCircle,
      color: 'bg-green-500',
      bg: 'bg-green-50',
      sub: `${stats.boaMes} este mês`,
    },
    {
      label: 'Registros Abertos',
      value: stats.abertos,
      icon: Clock,
      color: 'bg-yellow-500',
      bg: 'bg-yellow-50',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card flex items-center gap-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
                {card.sub && (
                  <p className="text-xs text-gray-400">{card.sub}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Registros por Mês (últimos 6 meses)
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="BOS" fill="#ef4444" radius={[4, 4, 0, 0]} name="BOS" />
              <Bar dataKey="BOA" fill="#22c55e" radius={[4, 4, 0, 0]} name="BOA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Distribuição BOS vs BOA
          </h2>
          {stats.totalBOS + stats.totalBOA > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">BOS ({stats.totalBOS})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">BOA ({stats.totalBOA})</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Resumo do Mês</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">BOS registrados</span>
              </div>
              <span className="font-semibold text-red-600">{stats.bosMes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">BOA registrados</span>
              </div>
              <span className="font-semibold text-green-600">{stats.boaMes}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Saldo do mês</span>
              <span className={`font-bold ${stats.boaMes - stats.bosMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.boaMes - stats.bosMes >= 0 ? '+' : ''}{stats.boaMes - stats.bosMes}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Status dos Registros</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-sm text-gray-600">Em aberto</span>
              </div>
              <span className="font-semibold text-yellow-600">{stats.abertos}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-sm text-gray-600">Total geral</span>
              </div>
              <span className="font-semibold text-blue-600">{stats.totalBOS + stats.totalBOA}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600">Colaboradores</span>
              </div>
              <span className="font-semibold text-gray-600">{stats.totalColaboradores}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
