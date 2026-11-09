import type { FilterState, Kind, Property, Range, RangeKey, SortKey } from './types'
import { PROJECT_BY_ID } from './options'

export const createFilters = (kind: Kind = 'living'): FilterState => ({
  query: '',
  kind,
  projects: [],
  bedrooms: [],
  ranges: {},
  finished: false,
  finishing: false,
  types: [],
  features: [],
  views: [],
  sides: [],
  hideReserved: false,
})

export const RANGE_KEYS: RangeKey[] = ['area', 'price', 'ppm', 'floor', 'ceiling']

const valueOf = (p: Property, key: RangeKey) => p[key]

/** Границы ползунков считаются по всем объектам выбранного типа (жилая/коммерческая), а не по отфильтрованным — так ползунки не «прыгают». */
export function getBounds(items: Property[]): Record<RangeKey, Range> {
  const bounds = {} as Record<RangeKey, Range>
  for (const key of RANGE_KEYS) {
    let min = Infinity
    let max = -Infinity
    for (const p of items) {
      const v = valueOf(p, key)
      if (v < min) min = v
      if (v > max) max = v
    }
    bounds[key] = items.length ? [min, max] : [0, 0]
  }
  return bounds
}

const hasAny = (selected: string[], values: string[]) => selected.length === 0 || selected.some((s) => values.includes(s))
const hasAll = (selected: string[], values: string[]) => selected.every((s) => values.includes(s))

/** Всё, кроме kind и hideReserved: одна функция для списка и для счётчика активных фильтров */
export function applyFilters(items: Property[], f: FilterState) {
  const q = f.query.trim().toLowerCase()
  return items.filter((p) => {
    if (p.kind !== f.kind) return false
    if (f.hideReserved && p.reserved) return false
    if (q && !p.number.toLowerCase().includes(q)) return false
    if (f.projects.length && !f.projects.includes(p.projectId)) return false
    if (f.bedrooms.length && !f.bedrooms.includes(Math.min(p.bedrooms, 5))) return false
    if (f.types.length && !f.types.includes(p.type)) return false
    if (f.finished && !PROJECT_BY_ID[p.projectId]?.finished) return false
    if (f.finishing && !p.finishing) return false
    if (!hasAll(f.features, p.features)) return false
    if (!hasAny(f.views, p.views)) return false
    if (!hasAny(f.sides, p.sides)) return false
    for (const key of RANGE_KEYS) {
      const r = f.ranges[key]
      if (r && (valueOf(p, key) < r[0] || valueOf(p, key) > r[1])) return false
    }
    return true
  })
}

export function sortItems(items: Property[], sort: SortKey) {
  const sorted = [...items]
  const by = (fn: (p: Property) => number) => sorted.sort((a, b) => fn(a) - fn(b))
  switch (sort) {
    case 'price-desc':
      return by((p) => -p.price)
    case 'price-asc':
      return by((p) => p.price)
    case 'area-desc':
      return by((p) => -p.area)
    case 'area-asc':
      return by((p) => p.area)
    case 'ppm-asc':
      return by((p) => p.ppm)
  }
}

/** Сколько фильтров включено (для бейджа на кнопке и кнопки «Сбросить») */
export function countActive(f: FilterState) {
  return (
    (f.query.trim() ? 1 : 0) +
    f.projects.length +
    f.bedrooms.length +
    Object.keys(f.ranges).length +
    (f.finished ? 1 : 0) +
    (f.finishing ? 1 : 0) +
    f.types.length +
    f.features.length +
    f.views.length +
    f.sides.length
  )
}
