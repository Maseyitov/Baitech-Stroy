import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'
import { useAlreadyPlayed } from './PageScope'

type Variant = 'up' | 'fade' | 'image'
/** below — блок ниже экрана, above — выше экрана, visible — уже показан */
type Side = 'below' | 'above' | 'visible'

const OFFSET = 36

/**
 * Блок появляется ОДИН РАЗ — когда впервые попадает на экран. После этого он остаётся на месте
 * и больше не анимируется (пока сайт не обновлён). Если страницу листают вверх, блок впервые
 * въезжает сверху, если вниз — снизу.
 */
const VARIANTS: Record<Variant, Variants> = {
  up: {
    below: { opacity: 0, y: OFFSET },
    above: { opacity: 0, y: -OFFSET },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    below: { opacity: 0 },
    above: { opacity: 0 },
    visible: { opacity: 1 },
  },
  image: {
    below: { opacity: 0, clipPath: 'inset(16% 0% 0% 0%)', scale: 1.05 },
    above: { opacity: 0, clipPath: 'inset(0% 0% 16% 0%)', scale: 1.05 },
    visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  },
}

type Props = {
  children: ReactNode
  variant?: Variant
  delay?: number
  className?: string
}

/** Плавное появление блока один раз при первом показе (Motion + IntersectionObserver). */
export default function Reveal({ children, variant = 'up', delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const alreadyPlayed = useAlreadyPlayed() // страницу уже открывали — показываем сразу, без анимации
  const [side, setSide] = useState<Side>(alreadyPlayed ? 'visible' : 'below')

  useEffect(() => {
    const el = ref.current
    if (!el || alreadyPlayed) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSide('visible')
          io.disconnect() // показали один раз — больше не следим
        } else {
          // пока блок не показан, помним, с какой стороны он ждёт
          setSide(entry.boundingClientRect.top < 0 ? 'above' : 'below')
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [alreadyPlayed])

  const variants: Variants = {
    ...VARIANTS[variant],
    visible: {
      ...(VARIANTS[variant].visible as object),
      transition: { duration: variant === 'image' ? 1.2 : 0.9, ease: EASE_OUT, delay },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial={alreadyPlayed ? 'visible' : 'below'}
      animate={side}
    >
      {children}
    </motion.div>
  )
}