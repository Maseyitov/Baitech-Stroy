import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { COMPANY, NAV_LINKS, SOCIALS } from '@/constants'
import Logo from '@/components/ui/Logo'

type Props = { open: boolean; onClose: () => void }

// Круг раскрывается из места, где находится кнопка бургера
const ORIGIN = 'at 36px 30px'

const LIST = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
}
const ITEM = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function MenuDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
          initial={{ clipPath: `circle(0% ${ORIGIN})` }}
          animate={{ clipPath: `circle(150% ${ORIGIN})` }}
          exit={{ clipPath: `circle(0% ${ORIGIN})`, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 overflow-y-auto bg-navy-deep text-white"
        >
          <div className="flex min-h-full flex-col px-[3vw] py-3">
            <div className="flex h-[44px] items-center justify-between">
              <Logo light />
              <motion.button
                autoFocus
                onClick={onClose}
                aria-label="Закрыть меню"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="grid h-10 w-10 place-items-center hover:text-green"
              >
                <X size={26} strokeWidth={1.25} />
              </motion.button>
            </div>

            <div className="mt-12 grid flex-1 gap-12 md:mt-20 md:grid-cols-2 md:pl-[8vw]">
              <motion.nav
                aria-label="Основная навигация"
                variants={LIST}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {NAV_LINKS.map((l) => (
                  <div key={l.to} className="overflow-hidden">
                    <motion.div variants={ITEM}>
                      <Link
                        to={l.to}
                        onClick={onClose}
                        className="inline-block font-display text-4xl font-light uppercase transition-all duration-300 hover:translate-x-3 hover:text-green md:text-6xl"
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }}
                className="flex flex-col gap-5 text-white/80"
              >
                <a href={`mailto:${COMPANY.email}`} className="hover:text-green">{COMPANY.email}</a>
                <a href={COMPANY.phoneHref} className="font-display text-3xl text-white hover:text-green">{COMPANY.phone}</a>
                <p>{COMPANY.address}</p>
                <div className="flex gap-6">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} className="hover:text-green">{s.label}</a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
