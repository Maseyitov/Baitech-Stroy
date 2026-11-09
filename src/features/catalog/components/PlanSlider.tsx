import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'

/** Слайды планировок: свайп / перетаскивание мышью, внизу черточки-индикаторы */
export default function PlanSlider({ slides, className }: { slides: ReactNode[]; className?: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const go = (next: number) => {
    const n = (next + slides.length) % slides.length
    setState([n, next > index ? 1 : -1])
  }

  return (
    <div className={cn('relative flex flex-col', className)}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 40, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_OUT }}
            drag={slides.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) go(index + 1)
              else if (info.offset.x > 40) go(index - 1)
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {slides[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className="grid h-4 place-items-center"
            >
              <span className={cn('block h-[3px] rounded-full transition-all duration-300', i === index ? 'w-5 bg-navy' : 'w-2 bg-navy/20')} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
