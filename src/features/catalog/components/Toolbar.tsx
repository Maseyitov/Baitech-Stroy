import { ChevronDown, CircleHelp, LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Catalog } from '../useCatalog'
import type { SortKey, ViewMode } from '../types'
import { SORT_OPTIONS } from '../options'
import { Toggle } from './controls'

const VIEWS: { value: ViewMode; label: string; Icon: typeof LayoutGrid }[] = [
  { value: 'grid', label: 'Плиткой', Icon: LayoutGrid },
  { value: 'list', label: 'Списком', Icon: Rows3 },
]

export default function Toolbar({ catalog, onOpenFilters }: { catalog: Catalog; onOpenFilters: () => void }) {
  const { filters, update, sort, setSort, view, setView, activeCount } = catalog

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl bg-white px-4 py-3">
      {/* На мобильных фильтры открываются отдельной панелью */}
      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex items-center gap-2 rounded-lg bg-navy px-3 py-2 text-[12px] text-white lg:hidden"
      >
        <SlidersHorizontal size={14} />
        Фильтры
        {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-green px-1 text-[10px]">{activeCount}</span>}
      </button>

      <span
        className="hidden items-center gap-1.5 text-[12px] text-blue sm:inline-flex"
        title="Рассрочка без переплаты до окончания строительства. Подробности у менеджера."
      >
        Беспроцентная рассрочка
        <CircleHelp size={13} />
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-3">
        <Toggle label="Скрыть забронированные" checked={filters.hideReserved} onChange={(hideReserved) => update({ hideReserved })} />

        <label className="relative inline-flex items-center text-[12px] text-blue hover:text-green">
          <span className="sr-only">Сортировка</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field-sizing-content cursor-pointer appearance-none bg-transparent pr-5 outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-0" />
        </label>

        <div className="hidden gap-1 md:flex" role="group" aria-label="Вид">
          {VIEWS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={view === value}
              onClick={() => setView(value)}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-lg border transition-colors',
                view === value ? 'border-navy bg-navy text-white' : 'border-line hover:border-navy',
              )}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
