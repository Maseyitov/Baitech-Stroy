import { RotateCcw, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Catalog } from '../useCatalog'
import type { Currency, Kind } from '../types'
import { BEDROOM_OPTIONS, FEATURES, PROJECTS, SIDES, TYPES, USD_RATE, VIEWS } from '../options'
import RangeField from './RangeField'
import { CheckList, CheckRow, FilterSection, Segmented, Toggle } from './controls'

const KIND_OPTIONS: { value: Kind; label: string }[] = [
  { value: 'living', label: 'Жилая' },
  { value: 'commercial', label: 'Коммерческая' },
]

export default function FilterPanel({ catalog, className }: { catalog: Catalog; className?: string }) {
  const { filters: f, update, bounds, currency, setCurrency, activeCount, reset } = catalog
  const usd = currency === 'USD'

  // Цена: сомы → млн сом / млн $; цена за м²: сомы → тыс. сом / $
  const priceDisplay = {
    toDisplay: (v: number) => (usd ? v / USD_RATE : v) / 1e6,
    fromDisplay: (v: number) => v * 1e6 * (usd ? USD_RATE : 1),
    digits: 2,
  }
  const ppmDisplay = usd
    ? { toDisplay: (v: number) => v / USD_RATE, fromDisplay: (v: number) => v * USD_RATE, digits: 0 }
    : { toDisplay: (v: number) => v / 1000, fromDisplay: (v: number) => v * 1000, digits: 1 }

  const typeOptions = TYPES[f.kind]
  const hints = Object.fromEntries(typeOptions.map((t) => [t.value, t.hint]))

  const setRange = (key: keyof typeof f.ranges) => (v: [number, number] | undefined) => {
    const ranges = { ...f.ranges }
    if (v) ranges[key] = v
    else delete ranges[key]
    update({ ranges })
  }

  const toggleBedroom = (n: number) =>
    update({ bedrooms: f.bedrooms.includes(n) ? f.bedrooms.filter((b) => b !== n) : [...f.bedrooms, n] })

  return (
    <div className={cn('flex flex-col', className)}>
      <label className="relative block">
        <span className="sr-only">Поиск по номеру</span>
        <input
          type="search"
          value={f.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Поиск по номеру"
          className="w-full rounded-lg border border-line bg-white py-2 pl-3 pr-8 text-[12px] outline-none transition-colors placeholder:text-muted hover:border-navy/40 focus:border-navy/50"
        />
        <Search size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      </label>

      <Segmented className="mt-3" options={KIND_OPTIONS} value={f.kind} onChange={catalog.setKind} />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mt-3 inline-flex items-center gap-1.5 self-start text-[12px] text-blue hover:text-green"
        >
          <RotateCcw size={12} />
          Сбросить фильтры ({activeCount})
        </button>
      )}

      <div className="mt-2">
        <FilterSection title="Проект">
          {PROJECTS.map((p) => (
            <CheckRow
              key={p.id}
              label={p.name}
              checked={f.projects.includes(p.id)}
              onChange={(on) => update({ projects: on ? [...f.projects, p.id] : f.projects.filter((id) => id !== p.id) })}
              icon={
                <span
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 rounded-[5px]"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}
                />
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Основные параметры">
          {f.kind === 'living' && (
            <div>
              <p className="text-[11px] text-muted">Количество спален</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {BEDROOM_OPTIONS.map((n) => {
                  const on = f.bedrooms.includes(n)
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleBedroom(n)}
                      className={cn(
                        'grid h-7 min-w-7 place-items-center rounded-full px-2 text-[11px] transition-colors',
                        on ? 'bg-navy text-white' : 'bg-surface hover:bg-navy/10',
                      )}
                    >
                      {n === 5 ? '5+' : n}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <RangeField label="Площадь, м²" bounds={bounds.area} value={f.ranges.area} onChange={setRange('area')} />
          <RangeField
            label={`Стоимость, млн ${usd ? '$' : 'сом'}`}
            aside={<CurrencySelect value={currency} onChange={setCurrency} />}
            bounds={bounds.price}
            value={f.ranges.price}
            onChange={setRange('price')}
            {...priceDisplay}
          />
          <RangeField
            label={usd ? 'Цена за м², $' : 'Цена за м², тыс. сом'}
            bounds={bounds.ppm}
            value={f.ranges.ppm}
            onChange={setRange('ppm')}
            {...ppmDisplay}
          />
          <RangeField label="Этаж" bounds={bounds.floor} value={f.ranges.floor} onChange={setRange('floor')} />
          <RangeField
            label="Высота потолка, м"
            bounds={bounds.ceiling}
            value={f.ranges.ceiling}
            onChange={setRange('ceiling')}
            digits={2}
          />

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <Toggle label="Дом сдан" checked={f.finished} onChange={(finished) => update({ finished })} />
            <Toggle label="С отделкой" checked={f.finishing} onChange={(finishing) => update({ finishing })} />
          </div>
        </FilterSection>

        <FilterSection title="Тип">
          <CheckList options={typeOptions.map((t) => t.value)} hints={hints} value={f.types} onChange={(types) => update({ types })} />
        </FilterSection>

        <FilterSection title="Преимущества">
          <CheckList options={FEATURES[f.kind]} value={f.features} onChange={(features) => update({ features })} />
        </FilterSection>

        <FilterSection title="Вид из окна" defaultOpen={false}>
          <CheckList options={VIEWS} value={f.views} onChange={(views) => update({ views })} />
        </FilterSection>

        <FilterSection title="Стороны света" defaultOpen={false}>
          <CheckList options={SIDES} value={f.sides} onChange={(sides) => update({ sides })} />
        </FilterSection>
      </div>
    </div>
  )
}

function CurrencySelect({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  return (
    <select
      aria-label="Валюта"
      value={value}
      onChange={(e) => onChange(e.target.value as Currency)}
      className="field-sizing-content cursor-pointer bg-transparent text-[11px] text-navy outline-none hover:text-blue"
    >
      <option value="KGS">Сомы</option>
      <option value="USD">Доллары</option>
    </select>
  )
}
