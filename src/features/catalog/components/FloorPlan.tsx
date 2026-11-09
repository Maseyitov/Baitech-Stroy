import { memo } from 'react'

/**
 * Условная схема планировки — заглушка, пока нет настоящих чертежей.
 * Комнаты получаются делением контура на прямоугольники; одинаковое зерно → одинаковая схема.
 */

type Rect = { x: number; y: number; w: number; h: number }

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function splitRooms(r: Rect, rand: () => number, depth = 0): Rect[] {
  const tooSmall = r.w < 26 && r.h < 26
  if (depth > 3 || tooSmall || (depth > 1 && rand() < 0.2)) return [r]
  const vertical = r.w > r.h * 1.15 ? true : r.h > r.w * 1.15 ? false : rand() < 0.5
  const t = 0.32 + rand() * 0.36
  const [a, b]: Rect[] = vertical
    ? [
        { x: r.x, y: r.y, w: r.w * t, h: r.h },
        { x: r.x + r.w * t, y: r.y, w: r.w * (1 - t), h: r.h },
      ]
    : [
        { x: r.x, y: r.y, w: r.w, h: r.h * t },
        { x: r.x, y: r.y + r.h * t, w: r.w, h: r.h * (1 - t) },
      ]
  return [...splitRooms(a, rand, depth + 1), ...splitRooms(b, rand, depth + 1)]
}

const NAVY = 'var(--color-navy)'

function Level({ seed, x, label, terrace }: { seed: number; x: number; label?: string; terrace: boolean }) {
  const rand = rng(seed)
  const w = 70 + rand() * 25
  const h = 60 + rand() * 25
  const outline: Rect = { x: x + (100 - w) / 2, y: (100 - h) / 2 - 4, w, h }
  const rooms = splitRooms(outline, rand)
  const smallest = [...rooms].sort((a, b) => a.w * a.h - b.w * b.h).slice(0, 2)

  return (
    <g>
      {terrace && (
        <rect
          x={outline.x + outline.w - 18}
          y={outline.y - 9}
          width={22}
          height={outline.h * 0.55}
          fill="color-mix(in srgb, var(--color-green) 12%, transparent)"
          stroke="var(--color-green)"
          strokeWidth={0.5}
          strokeDasharray="1.5 1.5"
        />
      )}
      <rect {...rectProps(outline)} fill="#fff" stroke={NAVY} strokeWidth={1.6} />
      {rooms.map((r, i) => {
        const wet = smallest.includes(r)
        const area = r.w * r.h
        return (
          <g key={i}>
            <rect
              {...rectProps(r)}
              fill={wet ? 'color-mix(in srgb, var(--color-blue) 10%, transparent)' : 'transparent'}
              stroke={NAVY}
              strokeWidth={0.55}
            />
            {/* «Дверной проём» — разрыв в стене */}
            <line x1={r.x + r.w * 0.3} y1={r.y} x2={r.x + r.w * 0.3 + 4} y2={r.y} stroke="#fff" strokeWidth={1.2} />
            {/* Мебель: кровать в больших комнатах, стол в средних */}
            {!wet && area > 520 && (
              <rect x={r.x + r.w / 2 - 6} y={r.y + r.h / 2 - 7} width={12} height={14} rx={1} fill="none" stroke={NAVY} strokeWidth={0.35} opacity={0.6} />
            )}
            {!wet && area > 260 && area <= 520 && (
              <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r={3.5} fill="none" stroke={NAVY} strokeWidth={0.35} opacity={0.6} />
            )}
            {wet && <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r={1.6} fill="none" stroke="var(--color-blue)" strokeWidth={0.4} />}
          </g>
        )
      })}
      {label && (
        <text x={x + 50} y={98} textAnchor="middle" fontSize={5} fill="var(--color-muted)" fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </g>
  )
}

const rectProps = (r: Rect) => ({ x: r.x, y: r.y, width: r.w, height: r.h })

/** Все уровни квартиры рядом */
export const PlanSchematic = memo(function PlanSchematic({
  seed,
  levels,
  terrace,
}: {
  seed: number
  levels: number
  terrace: boolean
}) {
  return (
    <svg viewBox={`0 0 ${levels * 100} 100`} className="h-full w-full" role="img" aria-label="Схема планировки">
      {Array.from({ length: levels }, (_, i) => (
        <Level
          key={i}
          seed={seed + i * 7919}
          x={i * 100}
          label={levels > 1 ? `${i + 1} уровень` : undefined}
          terrace={terrace && i === levels - 1}
        />
      ))}
    </svg>
  )
})

/** Где объект на этаже: контур секции, нужная квартира подсвечена */
export const FloorSchematic = memo(function FloorSchematic({ seed }: { seed: number }) {
  const rand = rng(seed + 31)
  const cols = 3 + Math.floor(rand() * 2)
  const target = Math.floor(rand() * cols * 2)
  const cw = 160 / cols
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full" role="img" aria-label="Расположение на этаже">
      {Array.from({ length: cols * 2 }, (_, i) => {
        const row = Math.floor(i / cols)
        const col = i % cols
        const on = i === target
        return (
          <rect
            key={i}
            x={20 + col * cw}
            y={row === 0 ? 14 : 54}
            width={cw}
            height={32}
            fill={on ? 'color-mix(in srgb, var(--color-green) 22%, white)' : '#fff'}
            stroke={on ? 'var(--color-green)' : NAVY}
            strokeWidth={on ? 1.4 : 0.6}
          />
        )
      })}
      <rect x={20} y={46} width={160} height={8} fill="var(--color-surface)" stroke={NAVY} strokeWidth={0.4} />
      <text x={100} y={96} textAnchor="middle" fontSize={6} fill="var(--color-muted)" fontFamily="var(--font-sans)">
        Расположение на этаже
      </text>
    </svg>
  )
})
