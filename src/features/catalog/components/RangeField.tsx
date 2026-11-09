import { useState, type ReactNode } from 'react'
import { formatNumber } from '../format'
import type { Range } from '../types'

type Props = {
  label: ReactNode
  /** Справа от подписи (например, выбор валюты) */
  aside?: ReactNode
  /** Границы и значение — в базовых единицах (сомы, м², этажи) */
  bounds: Range
  value?: Range
  onChange: (value: Range | undefined) => void
  /** Перевод в единицы, которые видит человек (например, сомы → млн сом) */
  toDisplay?: (v: number) => number
  fromDisplay?: (v: number) => number
  digits?: number
}

const identity = (v: number) => v

/**
 * Поле «от … до …» с двойным ползунком снизу.
 * Внутри работает в отображаемых единицах, наружу отдаёт базовые.
 * Если диапазон совпадает с границами — фильтр снимается (onChange(undefined)).
 */
export default function RangeField({
  label,
  aside,
  bounds,
  value,
  onChange,
  toDisplay = identity,
  fromDisplay = identity,
  digits = 0,
}: Props) {
  const k = 10 ** digits
  const min = Math.floor(toDisplay(bounds[0]) * k) / k
  const max = Math.ceil(toDisplay(bounds[1]) * k) / k
  const lo = value ? Math.max(min, Math.round(toDisplay(value[0]) * k) / k) : min
  const hi = value ? Math.min(max, Math.round(toDisplay(value[1]) * k) / k) : max
  const step = digits ? 1 / k : Math.max(1, Math.round((max - min) / 300))

  const commit = (a: number, b: number) => {
    let [x, y] = [Math.max(min, Math.min(a, max)), Math.max(min, Math.min(b, max))]
    if (x > y) [x, y] = [y, x]
    if (x <= min && y >= max) onChange(undefined)
    else onChange([x <= min ? bounds[0] : fromDisplay(x), y >= max ? bounds[1] : fromDisplay(y)])
  }

  const pct = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100)

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted">
        <span>{label}</span>
        {aside}
      </div>
      <div className="relative rounded-lg border border-line bg-white transition-colors focus-within:border-navy/50 hover:border-navy/40">
        <div className="grid grid-cols-2 divide-x divide-line">
          <NumberBox prefix="от" value={lo} digits={digits} onCommit={(n) => commit(n, hi)} />
          <NumberBox prefix="до" value={hi} digits={digits} onCommit={(n) => commit(lo, n)} />
        </div>

        {/* Двойной ползунок: два input[type=range] поверх одной дорожки */}
        <div className="dual-range absolute inset-x-2 -bottom-[7px] h-[14px]">
          <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded bg-line" />
          <div
            className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded bg-navy"
            style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
          />
          <input
            type="range"
            aria-label="Минимум"
            min={min}
            max={max}
            step={step}
            value={lo}
            onChange={(e) => commit(Math.min(+e.target.value, hi), hi)}
          />
          <input
            type="range"
            aria-label="Максимум"
            min={min}
            max={max}
            step={step}
            value={hi}
            onChange={(e) => commit(lo, Math.max(+e.target.value, lo))}
          />
        </div>
      </div>
    </div>
  )
}

/** Текстовое поле: пока печатают — свободный ввод, по Enter / потере фокуса — применяется */
function NumberBox({
  prefix,
  value,
  digits,
  onCommit,
}: {
  prefix: string
  value: number
  digits: number
  onCommit: (n: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

  const apply = () => {
    if (draft === null) return
    const n = parseFloat(draft.replace(/\s/g, '').replace(',', '.'))
    setDraft(null)
    if (Number.isFinite(n)) onCommit(n)
  }

  return (
    <label className="flex items-baseline gap-1.5 px-2.5 py-2 text-[12px]">
      <span className="text-muted">{prefix}</span>
      <input
        inputMode="decimal"
        value={draft ?? formatNumber(value, digits)}
        onFocus={(e) => {
          setDraft(String(value).replace('.', ','))
          requestAnimationFrame(() => e.target.select())
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={apply}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        className="w-full min-w-0 bg-transparent font-medium outline-none"
      />
    </label>
  )
}
