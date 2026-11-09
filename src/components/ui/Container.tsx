import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = { children: ReactNode; className?: string }

export default function Container({ children, className }: Props) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 md:px-10', className)}>{children}</div>
}