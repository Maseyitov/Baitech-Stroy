import { memo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, Check, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Currency, Property, ViewMode } from '../types'
import { PROJECT_BY_ID } from '../options'
import { bedroomsLabel, formatNumber, formatPpm, formatPrice } from '../format'
import { FloorSchematic, PlanSchematic } from './FloorPlan'
import PlanSlider from './PlanSlider'

// Цвет бейджа «N спален»: чем больше спален, тем насыщеннее
const BEDROOM_TINTS = ['', '#e3f4ec', '#d6efe3', '#dde8fb', '#cfdcf7', '#e6e0d4']

type Props = {
  item: Property
  view: ViewMode
  currency: Currency
  favorite: boolean
  onFavorite: (id: string) => void
}

function PropertyCard({ item, view, currency, favorite, onFavorite }: Props) {
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const project = PROJECT_BY_ID[item.projectId]
  const list = view === 'list'

  const slides = item.plans?.length
    ? item.plans.map((src, i) => <img key={src} src={src} alt={`Планировка, слайд ${i + 1}`} className="h-full w-full object-contain" draggable={false} />)
    : [
        <PlanSchematic key="plan" seed={item.seed} levels={item.levels} terrace={item.features.includes('Терраса')} />,
        <FloorSchematic key="floor" seed={item.seed} />,
      ]

  const facts = [
    { value: item.number, label: 'номер' },
    item.building && { value: item.building, label: 'корпус' },
    { value: item.floorsTotal > 1 ? `${item.floor} из ${item.floorsTotal}` : item.floor, label: 'этаж' },
    { value: `${formatNumber(item.ceiling)} м`, label: 'потолки' },
  ].filter(Boolean) as { value: string | number; label: string }[]

  return (
    <article
      className={cn(
        'group/card relative flex w-full overflow-hidden rounded-xl bg-white transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(11,31,58,0.10)]',
        list ? 'flex-col md:flex-row' : 'flex-col',
        item.reserved && 'opacity-75',
      )}
    >
      {/* Шапка: тип, спальни, площадь */}
      <header className={cn('flex items-center justify-between gap-3 px-4 py-3', list && 'md:hidden')}>
        <Badges item={item} />
        <Area value={item.area} />
      </header>

      <div className={cn('flex flex-1 flex-col border-t border-line/50', list && 'md:flex-row md:border-t-0')}>
        <div className={cn('flex flex-col px-4 pt-3', list && 'md:w-[38%] md:shrink-0 md:border-r md:border-line/50 md:py-4')}>
          {list && (
            <div className="mb-3 hidden items-center justify-between gap-3 md:flex">
              <Badges item={item} />
              <Area value={item.area} />
            </div>
          )}
          <p className="font-display text-[15px] text-blue">{project?.name}</p>
          <dl className="mt-2 grid grid-flow-col auto-cols-fr divide-x divide-line/60">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0 px-2 first:pl-0">
                <dd className="truncate text-[12px]">{f.value}</dd>
                <dt className="text-[10px] text-muted">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className={cn('relative px-4 py-3', list ? 'h-[230px] md:h-auto md:min-h-[200px] md:flex-1' : 'h-[250px]')}>
          <PlanSlider slides={slides} className="h-full" />

          {item.reserved && (
            <span className="absolute left-4 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-[10px] text-white">Забронировано</span>
          )}

          <AnimatePresence>
            {featuresOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-10 overflow-y-auto bg-white/95 px-4 py-3 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium">Преимущества</p>
                  <button type="button" aria-label="Закрыть" onClick={() => setFeaturesOpen(false)} className="hover:text-green">
                    <X size={16} />
                  </button>
                </div>
                <ul className="mt-2 space-y-1.5 text-[12px]">
                  {[...item.features, ...item.views.map((v) => `Вид ${v.toLowerCase()}`), item.finishing && 'С отделкой', project?.finished && 'Дом сдан']
                    .filter(Boolean)
                    .map((f) => (
                      <li key={f as string} className="flex items-center gap-2">
                        <Check size={13} className="text-green" />
                        {f}
                      </li>
                    ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Цена и действия */}
        <footer
          className={cn(
            'mt-auto flex items-end justify-between gap-3 border-t border-line/50 px-4 py-3',
            list && 'md:mt-0 md:w-[24%] md:shrink-0 md:flex-col md:items-stretch md:justify-center md:border-l md:border-t-0',
          )}
        >
          <div>
            <p className="font-display text-[19px] leading-tight">{formatPrice(item.price, currency)}</p>
            <p className="text-[10px] text-muted">{formatPpm(item.ppm, currency)}</p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-expanded={featuresOpen}
              onClick={() => setFeaturesOpen((o) => !o)}
              className={cn(
                'h-8 flex-1 rounded-lg border px-3.5 text-[12px] transition-colors',
                featuresOpen ? 'border-navy bg-navy text-white' : 'border-line hover:border-navy',
              )}
            >
              Преимущества
            </button>
            <button
              type="button"
              aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
              aria-pressed={favorite}
              onClick={() => onFavorite(item.id)}
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors',
                favorite ? 'border-green bg-green text-white' : 'border-line hover:border-navy',
              )}
            >
              <Bookmark size={14} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </footer>
      </div>
    </article>
  )
}

function Badges({ item }: { item: Property }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-[10px] text-white">
        <Sparkles size={10} />
        {item.type}
      </span>
      {item.bedrooms > 0 && (
        <span className="rounded-full px-2.5 py-1 text-[10px]" style={{ background: BEDROOM_TINTS[Math.min(item.bedrooms, 5)] }}>
          {bedroomsLabel(item.bedrooms)}
        </span>
      )}
    </div>
  )
}

function Area({ value }: { value: number }) {
  return (
    <p className="shrink-0 font-display text-[22px] font-light leading-none">
      {value} м<sup className="text-[11px]">2</sup>
    </p>
  )
}

export default memo(PropertyCard)
