import { Link } from 'react-router-dom'
import { CATALOG_PATH, COMPANY, FOOTER_LEFT, FOOTER_RIGHT, SOCIALS } from '@/constants'
import Logo from '@/components/ui/Logo'
import Reveal from '@/components/motion/Reveal'

const linkCls = 'text-[12px] font-medium text-white hover:text-green'

export default function Footer() {
  return (
    <footer className="bg-navy-deep px-[3vw] pb-8 pt-10 text-white">
      <Reveal variant="fade">
      <div className="mx-auto grid max-w-5xl items-start gap-10 text-center md:grid-cols-[1fr_auto_1fr]">
        <nav aria-label="Разделы" className="flex flex-col gap-3 md:items-end md:text-right">
          {FOOTER_LEFT.map((l) => (
            <Link key={l.label} to={l.to} className={linkCls}>{l.label}</Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3">
          <Logo light />
          <a href={`mailto:${COMPANY.email}`} className={`${linkCls} mt-4`}>{COMPANY.email}</a>
          <a href={COMPANY.phoneHref} className="font-display text-lg font-normal hover:text-green">{COMPANY.phone}</a>
          <Link
            to={CATALOG_PATH}
            className="mt-2 rounded-full border border-white/60 px-10 py-2.5 text-[12px] font-medium transition hover:bg-white hover:text-navy"
          >
            Выбрать объект
          </Link>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-7 w-7 place-items-center rounded-sm border border-white/30 text-[9px] font-medium text-white/70 hover:border-green hover:text-green"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Информация" className="flex flex-col gap-3 md:items-start md:text-left">
          {FOOTER_RIGHT.map((l) => (
            <Link key={l.label} to={l.to} className={linkCls}>{l.label}</Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-4xl space-y-1.5 text-center text-[10px] leading-relaxed text-white/70">
        <p>
          <Link to="/contact" className="underline hover:text-green">Правовая информация</Link>
        </p>
        <p>Данный сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой.</p>
        <p>{COMPANY.legal} {COMPANY.address}</p>
      </div>
      </Reveal>
    </footer>
  )
}
