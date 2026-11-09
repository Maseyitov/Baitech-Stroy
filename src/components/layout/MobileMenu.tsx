import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { COMPANY, NAV_LINKS, SOCIALS } from '@/constants'
import { cn } from '@/lib/cn'
import Button from '@/components/ui/Button'

type Props = { open: boolean; onClose: () => void }

export default function MobileMenu({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 overflow-y-auto bg-navy text-white transition-all duration-500',
        open ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      <div className="mx-auto flex min-h-full max-w-7xl flex-col px-5 py-6 md:px-10">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-widest">{COMPANY.name}</span>
          <button onClick={onClose} aria-label="Закрыть" className="hover:text-green">
            <X size={30} />
          </button>
        </div>

        <div className="mt-12 grid flex-1 gap-12 md:grid-cols-2">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className="text-3xl font-light transition hover:translate-x-2 hover:text-green md:text-5xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-6 text-white/80">
            <a href={`mailto:${COMPANY.email}`} className="hover:text-green">
              {COMPANY.email}
            </a>
            <a href={COMPANY.phoneHref} className="text-2xl text-white hover:text-green">
              {COMPANY.phone}
            </a>
            <p>{COMPANY.address}</p>
            <div className="flex gap-5">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} className="hover:text-green">
                  {s.label}
                </a>
              ))}
            </div>
            <Button to="/projects" className="self-start" >
              Выбрать объект
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}