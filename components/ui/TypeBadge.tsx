'use client'

import { cn } from '@/lib/utils'

interface TypeBadgeProps {
  tipo: 'BOS' | 'BOA'
  className?: string
}

export function TypeBadge({ tipo, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        tipo === 'BOS'
          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        className
      )}
    >
      {tipo}
    </span>
  )
}
