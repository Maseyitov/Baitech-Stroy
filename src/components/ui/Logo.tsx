import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Props = { light?: boolean; className?: string }

/** Временный логотип-заглушка. Заменится, когда будет настоящее название. */
export default function Logo({ light, className }: Props) {
  return (
    <Link
      to="/"
      aria-label="BAITECH STROY — на главную"
      className={cn('flex items-center gap-3', light ? 'text-white' : 'text-navy', className)}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <path d="M3 27V13L15 3l12 10v14" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 27V17h10v10" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 27h24" stroke="#19a974" strokeWidth="2.4" />
      </svg>
      <span className="font-display text-[26px] font-normal leading-none tracking-tight">
        Baitech
      </span>
      <span className={cn('hidden h-7 w-px sm:block', light ? 'bg-white/40' : 'bg-navy/30')} />
      <span className="hidden font-display text-[9px] font-normal uppercase leading-[1.35] tracking-[0.18em] sm:block">
        Строительная
        <br />
        компания
      </span>
    </Link>
  )
}
