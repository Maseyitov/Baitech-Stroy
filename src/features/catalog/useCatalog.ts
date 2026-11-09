import { useDeferredValue, useMemo, useState } from 'react'
import type { Currency, FilterState, Kind, SortKey, ViewMode } from './types'
import { PROPERTIES } from './data'
import { PAGE_SIZE } from './options'
import { applyFilters, countActive, createFilters, getBounds, sortItems } from './filters'

/** Вся логика страницы подбора: состояние фильтров, сортировка, вид, «показать ещё». */
export function useCatalog() {
  const [filters, setFilters] = useState<FilterState>(() => createFilters())
  const [sort, setSort] = useState<SortKey>('price-desc')
  const [view, setView] = useState<ViewMode>('grid')
  const [currency, setCurrency] = useState<Currency>('KGS')
  const [limit, setLimit] = useState(PAGE_SIZE)

  // Ползунки двигаются плавно, а тяжёлая фильтрация догоняет
  const deferred = useDeferredValue(filters)

  const bounds = useMemo(() => getBounds(PROPERTIES.filter((p) => p.kind === filters.kind)), [filters.kind])
  const results = useMemo(() => sortItems(applyFilters(PROPERTIES, deferred), sort), [deferred, sort])

  const update = (patch: Partial<FilterState>) => {
    setFilters((f) => ({ ...f, ...patch }))
    setLimit(PAGE_SIZE)
  }

  const setKind = (kind: Kind) => {
    // У жилой и коммерческой разные типы и диапазоны — начинаем с чистого листа, оставив общие настройки
    setFilters((f) => ({ ...createFilters(kind), hideReserved: f.hideReserved }))
    setLimit(PAGE_SIZE)
  }

  const reset = () => setKind(filters.kind)

  return {
    filters,
    update,
    setKind,
    reset,
    activeCount: countActive(filters),
    bounds,
    results,
    visible: results.slice(0, limit),
    hasMore: results.length > limit,
    showMore: () => setLimit((l) => l + PAGE_SIZE),
    isStale: deferred !== filters,
    sort,
    setSort: (s: SortKey) => {
      setSort(s)
      setLimit(PAGE_SIZE)
    },
    view,
    setView,
    currency,
    setCurrency,
  }
}

export type Catalog = ReturnType<typeof useCatalog>
