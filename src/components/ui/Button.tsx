import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  to: string
  children: ReactNode
  variant?: 'green' | 'outline'
  className?: string
}

export default function Button({ to, children, variant = 'green', className }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider transition',
        variant === 'green' && 'bg-green text-white hover:bg-blue',
        variant === 'outline' && 'border border-white/60 text-white hover:bg-white hover:text-navy',
        className,
      )}
    >
      {children}
    </Link>
  )
}