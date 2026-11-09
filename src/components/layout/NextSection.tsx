import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { animate } from 'animejs'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import Reveal from '@/components/motion/Reveal'

type Props = { to: string; title: string }

/** Тёмный баннер «Следующий раздел» перед подвалом. */
export default function NextSection({ to, title }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  // Стрелка постоянно «подталкивает» вперёд (Anime.js)
  useEffect(() => {
    if (reduced || !arrowRef.current) return
    const anim = animate(arrowRef.current, {
      x: [-4, 5],
      duration: 900,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    })
    return () => {
      anim.revert()
    }
  }, [reduced])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden text-center text-white">
      <motion.div className="absolute -inset-y-[10%] inset-x-0 -z-10" style={reduced ? undefined : { y: bgY }}>
        <ImagePlaceholder tone="navy" className="h-full w-full opacity-95" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-navy-deep/40" />

      <Link to={to} className="group flex flex-col items-center px-[3vw] py-20 md:py-28">
        <Reveal variant="fade">
          <span className="text-[11px] font-medium">Следующий раздел</span>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="mt-2 block font-display text-3xl font-light uppercase md:text-5xl">{title}</span>
        </Reveal>
        <Reveal delay={0.25}>
          <span className="mt-6 grid h-11 w-11 place-items-center rounded-full bg-white text-navy transition-colors duration-300 group-hover:bg-green group-hover:text-white">
            <span ref={arrowRef} className="grid">
              <ArrowRight size={20} strokeWidth={1.25} />
            </span>
          </span>
        </Reveal>
      </Link>
    </section>
  )
}
