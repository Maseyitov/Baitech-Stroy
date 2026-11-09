import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, CircleHelp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'

/** Сворачиваемый блок фильтра */
export function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <section className="border-t border-line/60 py-3 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-1 text-left text-[13px] font-medium hover:text-blue"
      >
        {title}
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-300', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/** Строка «текст … [чекбокс]» */
export function CheckRow({
  label,
  checked,
  onChange,
  hint,
  icon,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
  icon?: ReactNode
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 py-[5px] text-[12px]">
      {icon}
      <span className={cn('flex-1 transition-colors group-hover:text-blue', checked && 'text-navy')}>{label}</span>
      {hint && (
        <span title={hint} className="text-muted/70 hover:text-blue">
          <CircleHelp size={13} aria-label={hint} />
        </span>
      )}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green',
          checked ? 'border-navy bg-navy text-white' : 'border-navy/30 bg-white group-hover:border-navy/60',
        )}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
    </label>
  )
}

/** Список чекбоксов по массиву строк */
export function CheckList({
  options,
  value,
  onChange,
  hints,
}: {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  hints?: Record<string, string | undefined>
}) {
  const toggle = (opt: string, on: boolean) => onChange(on ? [...value, opt] : value.filter((v) => v !== opt))
  return (
    <div>
      {options.map((opt) => (
        <CheckRow key={opt} label={opt} hint={hints?.[opt]} checked={value.includes(opt)} onChange={(on) => toggle(opt, on)} />
      ))}
    </div>
  )
}

/** Переключатель-«таблетка» */
export function Toggle({
  label,
  checked,
  onChange,
  className,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('group inline-flex items-center gap-2 text-[12px] hover:text-blue', className)}
    >
      <span
        className={cn(
          'relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors duration-300',
          checked ? 'bg-green' : 'bg-navy',
        )}
      >
        <span
          className={cn(
            'absolute top-[3px] h-3 w-3 rounded-full bg-white transition-all duration-300',
            checked ? 'left-[17px]' : 'left-[3px]',
          )}
        />
      </span>
      {label}
    </button>
  )
}

/** Сегментированный переключатель из двух-трёх вариантов */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={cn('grid rounded-lg bg-surface p-[3px]', className)} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md py-1.5 text-[12px] transition-colors',
            o.value === value ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-navy',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
