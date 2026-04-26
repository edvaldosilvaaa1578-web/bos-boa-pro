import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'aberto':
      return 'bg-yellow-100 text-yellow-800'
    case 'em_analise':
      return 'bg-blue-100 text-blue-800'
    case 'encerrado':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case 'aberto':
      return 'Aberto'
    case 'em_analise':
      return 'Em Análise'
    case 'encerrado':
      return 'Encerrado'
    default:
      return status
  }
}

export function getTipoColor(tipo: string) {
  return tipo === 'BOS'
    ? 'bg-red-100 text-red-800'
    : 'bg-green-100 text-green-800'
}
