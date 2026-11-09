import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { CATALOG_PATH, COMPANY } from '@/constants'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'
import Logo from '@/components/ui/Logo'
import MenuDrawer from './MenuDrawer'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Шапка прячется при прокрутке вниз и возвращается при прокрутке вверх
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 240)
    setScrolled(y > 10)
  })

  return (
    <>
      <motion.header
        initial={{ y: -70 }}
        animate={{ y: hidden && !open ? -70 : 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={cn(
          'fixed inset-x-0 top-0 z-40 h-[60px] border-b border-line bg-white/95 backdrop-blur transition-shadow duration-500',
          scrolled && 'shadow-[0_8px_30px_rgba(11,31,58,0.08)]',
        )}
      >
        <div className="relative flex h-full items-center justify-between px-[3vw]">
          <div className="flex items-center gap-6 md:gap-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={open}
              className="group grid h-10 w-10 place-items-center"
            >
              <span className="flex flex-col items-start gap-[5px]">
                <span className="h-px w-7 bg-navy transition-all duration-300 group-hover:bg-green" />
                <span className="h-px w-5 bg-navy transition-all duration-300 group-hover:w-7 group-hover:bg-green" />
                <span className="h-px w-3 bg-navy transition-all duration-300 group-hover:w-7 group-hover:bg-green" />
              </span>
            </button>
            <Logo />
          </div>

          <Link
            to="/about"
            className="absolute left-1/2 hidden -translate-x-1/2 text-[13px] hover:text-green lg:block"
          >
            Коротко о нас
          </Link>

          <div className="flex items-center gap-5 text-[13px] md:gap-10">
            <Link to={CATALOG_PATH} className="hidden items-center gap-2 hover:text-green sm:flex">
              Выбрать объект
              <SlidersHorizontal size={16} strokeWidth={1.25} aria-hidden="true" />
            </Link>
            <a href={COMPANY.phoneHref} className="hover:text-green">
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </motion.header>

      <MenuDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
