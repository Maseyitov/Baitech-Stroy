/** Общая плавная кривая (быстрый старт, мягкое торможение) */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
