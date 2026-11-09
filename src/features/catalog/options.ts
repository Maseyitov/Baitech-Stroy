import type { Kind, Project, SortKey } from './types'

/** Курс для отображения цен в долларах */
export const USD_RATE = 87.5

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Название 1', color: '#1d5fd8', finished: true },
  { id: 'p2', name: 'Название 2', color: '#19a974', finished: true },
  { id: 'p3', name: 'Название 3', color: '#14325c', finished: false },
  { id: 'p4', name: 'Название 4', color: '#6b7a90', finished: true },
  { id: 'p5', name: 'Название 5', color: '#0b1f3a', finished: false },
  { id: 'p6', name: 'Название 6', color: '#4f8be8', finished: false },
  { id: 'p7', name: 'Название 7', color: '#5cc79d', finished: true },
  { id: 'p8', name: 'Название 8', color: '#8a6d3b', finished: false },
]

export const PROJECT_BY_ID = Object.fromEntries(PROJECTS.map((p) => [p.id, p]))

export type TypeOption = { value: string; hint?: string }

export const TYPES: Record<Kind, TypeOption[]> = {
  living: [
    { value: 'Квартира' },
    { value: 'Пентхаус', hint: 'Квартира на последнем этаже с увеличенной высотой потолков и террасой' },
    { value: 'Двухуровневая квартира', hint: 'Квартира на двух этажах с внутренней лестницей' },
    { value: 'Ситихаус', hint: 'Таунхаус в городской черте с отдельным входом' },
    { value: 'Вилла', hint: 'Отдельный дом на территории комплекса' },
    { value: 'Особняк', hint: 'Отдельный многоуровневый дом с собственным участком' },
  ],
  commercial: [
    { value: 'Офис' },
    { value: 'Торговое помещение' },
    { value: 'Ресторан', hint: 'Помещение с вытяжкой и отдельным входом' },
  ],
}

export const FEATURES: Record<Kind, string[]> = {
  living: [
    'Терраса',
    'Бассейн',
    'Камин',
    'Балкон',
    'Панорамные окна',
    'Окно в ванной',
    'Гардеробная',
    'Кабинет',
    'Комната для гостей',
    'Кладовая',
    'Машиноместо',
  ],
  commercial: ['Отдельный вход', 'Витринные окна', 'Высокие потолки', 'Терраса', 'Машиноместо'],
}

export const VIEWS = ['На горы', 'На город', 'На парк', 'Во двор']

export const SIDES = ['Север', 'Юг', 'Восток', 'Запад']

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5]

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'area-desc', label: 'Площадь: по убыванию' },
  { value: 'area-asc', label: 'Площадь: по возрастанию' },
  { value: 'ppm-asc', label: 'Цена за м²: по возрастанию' },
]

export const PAGE_SIZE = 12
