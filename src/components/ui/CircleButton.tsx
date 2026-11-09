import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

type Props = {
  dir: 'prev' | 'next'
  onClick?: () => void
  /** white — белая заливка (поверх фото), outline — тонкий контур */
  variant?: 'white' | 'outline'
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

export default function CircleButton({
  dir,
  onClick,
  variant = 'outline',
  size = 'md',
  label,
  className,
}: Props) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label ?? (dir === 'prev' ? 'Назад' : 'Вперёд')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'grid shrink-0 place-items-center rounded-full transition-colors duration-300',
        size === 'md' ? 'h-11 w-11' : 'h-9 w-9',
        variant === 'white'
          ? 'bg-white text-navy shadow-md hover:bg-green hover:text-white'
          : 'border border-navy/60 text-navy hover:bg-navy hover:text-white',
        className,
      )}
    >
      <Icon size={size === 'md' ? 20 : 16} strokeWidth={1.25} />
    </motion.button>
  )
}
