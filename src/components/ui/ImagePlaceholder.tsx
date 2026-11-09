import { cn } from '@/lib/cn'

import blueImage from '@/assets/images/blue.jpg'
import greenImage from '@/assets/images/green.jpg'
import navyImage from '@/assets/images/navy.jpg'
import duskImage from '@/assets/images/dusk.jpg'

type Tone = 'blue' | 'green' | 'navy' | 'dusk'

const DEFAULT_IMAGES: Record<Tone, string> = {
  blue: blueImage,
  green: greenImage,
  navy: navyImage,
  dusk: duskImage,
}

type Props = {
  src?: string
  alt?: string
  tone?: Tone
  label?: string
  className?: string
}

export default function ImagePlaceholder({
  src,
  alt = '',
  tone = 'blue',
  label,
  className,
}: Props) {
  return (
    <img
      src={src || DEFAULT_IMAGES[tone]}
      alt={alt || label || 'Изображение'}
      className={cn('object-cover', className)}
    />
  )
}