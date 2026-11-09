import type { Currency } from './types'
import { USD_RATE } from './options'

const num = (value: number, digits = 2) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(value)

export const formatNumber = num

/** Перевод из базовой валюты (сом) в выбранную */
export const convert = (som: number, currency: Currency) => (currency === 'USD' ? som / USD_RATE : som)

const SYMBOL: Record<Currency, string> = { KGS: 'сом', USD: '$' }

/** 6,17 млрд сом · 45,3 млн сом · $1,25 млн */
export function formatPrice(som: number, currency: Currency) {
  const v = convert(som, currency)
  const [amount, unit] =
    v >= 1e9 ? [num(v / 1e9), 'млрд'] : v >= 1e6 ? [num(v / 1e6), 'млн'] : v >= 1e3 ? [num(v / 1e3, 0), 'тыс.'] : [num(v, 0), '']
  const text = [amount, unit].filter(Boolean).join(' ')
  return currency === 'USD' ? `$${text}` : `${text} ${SYMBOL.KGS}`
}

/** 520 тыс. сом/м² · $2 450/м² */
export function formatPpm(som: number, currency: Currency) {
  const v = convert(som, currency)
  return currency === 'USD' ? `$${num(v, 0)}/м²` : `${num(v / 1000, 1)} тыс. сом/м²`
}

/** plural(5, ['объект', 'объекта', 'объектов']) → 'объектов' */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export const bedroomsLabel = (n: number) =>
  n >= 5 ? '5+ спален' : `${n} ${plural(n, ['спальня', 'спальни', 'спален'])}`
