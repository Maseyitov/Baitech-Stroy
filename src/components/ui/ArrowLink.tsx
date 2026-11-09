import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './ArrowLink.module.scss'

type Props = { to: string; label?: string; light?: boolean; className?: string }

export default function ArrowLink({ to, label = 'Подробнее', light, className }: Props) {
  return (
    <Link to={to} className={`${styles.link} ${light ? styles.light : ''} ${className ?? ''}`}>
      {label}
      <span className={styles.circle}>
        <ArrowRight size={18} strokeWidth={1.25} />
      </span>
    </Link>
  )
}
