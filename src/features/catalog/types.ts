export type Kind = 'living' | 'commercial'

export type Currency = 'KGS' | 'USD'

export type Project = {
  id: string
  name: string
  /** Цвет миниатюры в фильтре, пока нет фото */
  color: string
  /** Дом сдан */
  finished: boolean
}

export type Property = {
  id: string
  /** Номер квартиры / помещения, по нему работает поиск */
  number: string
  kind: Kind
  projectId: string
  type: string
  building?: string
  floor: number
  floorsTotal: number
  /** Высота потолков, м */
  ceiling: number
  /** Площадь, м² */
  area: number
  /** 0 — для коммерции */
  bedrooms: number
  /** Цена в сомах (базовая валюта) */
  price: number
  /** Цена за м² в сомах */
  ppm: number
  /** Количество уровней — сколько этажей на планировке */
  levels: number
  features: string[]
  views: string[]
  sides: string[]
  finishing: boolean
  reserved: boolean
  /** Когда будут настоящие планировки: пути к картинкам ('/images/plans/25a-1.png'). Без них рисуется схема. */
  plans?: string[]
  /** Зерно для генерации схемы планировки */
  seed: number
}

export type RangeKey = 'area' | 'price' | 'ppm' | 'floor' | 'ceiling'

export type Range = [number, number]

export type FilterState = {
  query: string
  kind: Kind
  projects: string[]
  /** 1..5, где 5 означает «5 и больше» */
  bedrooms: number[]
  ranges: Partial<Record<RangeKey, Range>>
  finished: boolean
  finishing: boolean
  types: string[]
  features: string[]
  views: string[]
  sides: string[]
  hideReserved: boolean
}

export type SortKey = 'price-desc' | 'price-asc' | 'area-desc' | 'area-asc' | 'ppm-asc'

export type ViewMode = 'grid' | 'list'
