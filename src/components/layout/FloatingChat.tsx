import { MessageCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

/** Круглая кнопка связи: появляется с пружиной, вокруг пульсирует кольцо. */
export default function FloatingChat() {
  const reduced = useReducedMotion()

  return (
    <motion.a
      href="https://wa.me/996000000000"
      aria-label="Написать нам в WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.8, type: 'spring', stiffness: 260, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-[3vw] z-30 grid h-[60px] w-[60px] place-items-center rounded-full bg-navy text-white shadow-lg transition-colors hover:bg-green"
    >
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-navy"
          animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 2.5 }}
        />
      )}
      <MessageCircle size={26} strokeWidth={1.5} className="relative" />
    </motion.a>
  )
}
