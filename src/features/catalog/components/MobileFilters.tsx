import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion'
import type { Catalog } from '../useCatalog'
import { plural } from '../format'
import FilterPanel from './FilterPanel'

/** Фильтры на телефоне/планшете: выезжающая панель с кнопкой «Показать N» */
export default function MobileFilters({ catalog, open, onClose }: { catalog: Catalog; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const n = catalog.results.length

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-navy/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Фильтры"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[380px] flex-col bg-white lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[15px] font-medium">Фильтры</p>
              <button type="button" aria-label="Закрыть" onClick={onClose} className="hover:text-green">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterPanel catalog={catalog} />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg bg-navy py-3 text-[13px] text-white transition-colors hover:bg-green"
              >
                Показать {n} {plural(n, ['объект', 'объекта', 'объектов'])}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
