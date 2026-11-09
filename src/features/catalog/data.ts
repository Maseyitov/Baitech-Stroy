import type { Kind, Property } from './types'
import { FEATURES, PROJECTS, SIDES, TYPES, USD_RATE, VIEWS } from './options'

/**
 * ВРЕМЕННЫЕ данные: генерируются из фиксированного зерна, поэтому при каждой загрузке одинаковые.
 * Когда появится API или CMS — замени PROPERTIES на загруженный массив того же типа Property.
 */

// Простой детерминированный генератор случайных чисел
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(2026)
const between = (min: number, max: number) => min + rand() * (max - min)
const int = (min: number, max: number) => Math.floor(between(min, max + 1))
const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]
const sample = <T,>(list: T[], chance: number) => list.filter(() => rand() < chance)

type TypeSpec = { area: [number, number]; mult: number; levels: [number, number]; weight: number }

const SPECS: Record<string, TypeSpec> = {
  Квартира: { area: [42, 190], mult: 1, levels: [1, 1], weight: 10 },
  Пентхаус: { area: [180, 780], mult: 1.45, levels: [1, 3], weight: 3 },
  'Двухуровневая квартира': { area: [120, 280], mult: 1.15, levels: [2, 2], weight: 2 },
  Ситихаус: { area: [150, 360], mult: 1.2, levels: [2, 3], weight: 1.5 },
  Вилла: { area: [280, 760], mult: 1.35, levels: [2, 3], weight: 1 },
  Особняк: { area: [420, 980], mult: 1.5, levels: [3, 3], weight: 0.7 },
  Офис: { area: [45, 420], mult: 0.9, levels: [1, 1], weight: 4 },
  'Торговое помещение': { area: [60, 480], mult: 1.05, levels: [1, 2], weight: 3 },
  Ресторан: { area: [150, 620], mult: 1, levels: [1, 2], weight: 1 },
}

function pickType(kind: Kind) {
  const options = TYPES[kind].map((t) => t.value)
  const total = options.reduce((s, t) => s + SPECS[t].weight, 0)
  let r = rand() * total
  for (const t of options) {
    r -= SPECS[t].weight
    if (r <= 0) return t
  }
  return options[0]
}

const BUILDINGS = ['А', 'Б', 'В', 'Восточный', 'Западный', 'Центральный']
const LETTERS = ['', '', '', 'А', 'Б', 'Д']

function generate(count: number): Property[] {
  // Базовая цена м² по проекту, $
  const base = Object.fromEntries(PROJECTS.map((p) => [p.id, between(1300, 3600)]))
  const floorsByProject = Object.fromEntries(PROJECTS.map((p) => [p.id, int(7, 22)]))
  const used = new Set<string>()

  return Array.from({ length: count }, (_, i) => {
    const project = pick(PROJECTS)
    const kind: Kind = rand() < 0.8 ? 'living' : 'commercial'
    const type = pickType(kind)
    const spec = SPECS[type]
    const area = Math.round(between(...spec.area))
    const floorsTotal = floorsByProject[project.id]

    let floor: number
    let total = floorsTotal
    if (type === 'Пентхаус') floor = floorsTotal - int(0, 1)
    else if (type === 'Вилла' || type === 'Особняк' || type === 'Ситихаус') {
      floor = 1
      total = int(2, 3)
    } else if (kind === 'commercial') floor = int(1, 2)
    else floor = int(2, floorsTotal - 1)

    const ceiling = +(type === 'Пентхаус' ? between(3.6, 4.6) : kind === 'commercial' ? between(3.8, 6.2) : between(3, 3.9)).toFixed(2)
    const bedrooms = kind === 'commercial' ? 0 : Math.max(1, Math.min(6, Math.round(area / 60)))
    const height = 1 + (floor / floorsTotal) * 0.15
    const ppmUsd = base[project.id] * spec.mult * height * between(0.9, 1.1)
    const price = Math.round((area * ppmUsd * USD_RATE) / 10000) * 10000

    let number = kind === 'commercial' ? `Н-${int(1, 40)}` : `${floor}${int(1, 8)}${pick(LETTERS)}`
    while (used.has(project.id + number)) number += 'А'
    used.add(project.id + number)

    const features = sample(FEATURES[kind], 0.25)
    const views = sample(VIEWS, 0.4)
    if ((type === 'Пентхаус' || type === 'Вилла') && !features.includes('Терраса')) features.unshift('Терраса')

    return {
      id: `obj-${i + 1}`,
      number,
      kind,
      projectId: project.id,
      type,
      building: rand() < 0.65 ? pick(BUILDINGS) : undefined,
      floor,
      floorsTotal: total,
      ceiling,
      area,
      bedrooms,
      price,
      ppm: Math.round(price / area),
      levels: int(...spec.levels),
      features,
      views: views.length ? views : [pick(VIEWS)],
      sides: [pick(SIDES), ...sample(SIDES, 0.25)].filter((s, j, a) => a.indexOf(s) === j),
      finishing: rand() < 0.4,
      reserved: rand() < 0.12,
      seed: int(1, 1_000_000),
    }
  })
}

export const PROPERTIES: Property[] = generate(180)
