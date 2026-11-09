import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'

export type AccordionItem = { title: string; paragraphs: string[] }

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = i === open
        return (
          <div key={item.title} className="border-b border-line">
            <h3 className="font-display text-sm font-normal normal-case tracking-normal">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={cn(
                  'flex w-full items-center justify-between py-4 text-left uppercase transition-colors',
                  isOpen ? 'text-navy' : 'text-muted hover:text-navy',
                )}
              >
                {item.title}
                {/* Плюс поворачивается в крестик */}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="grid"
                >
                  <Plus size={14} strokeWidth={1.25} />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${i}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-5 text-[13px] leading-relaxed">
                    {item.paragraphs.map((t, k) => (
                      <motion.p
                        key={t}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 + k * 0.08 }}
                      >
                        {t}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
