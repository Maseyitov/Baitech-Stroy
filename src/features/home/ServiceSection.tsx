import Container from '@/components/ui/Container'
import ArrowLink from '@/components/ui/ArrowLink'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

const STATS = [
  { value: '550 000', unit: 'м²', label: 'в управлении' },
  { value: '310', unit: '', label: 'сотрудников' },
]

export default function ServiceSection() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-green">
            Служба комфорта
          </p>
          <p className="mt-4 text-lg text-navy-light">
            Единые стандарты сервиса действуют во всех построенных нами домах и деловых центрах.
            Служба работает круглосуточно и обеспечивает высокое качество жизни клиентов.
          </p>

          <div className="mt-10 flex gap-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-blue md:text-5xl">
                  {s.value} <span className="text-2xl">{s.unit}</span>
                </p>
                <p className="mt-1 text-sm uppercase tracking-widest text-navy-light">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <ArrowLink to="/services" />
          </div>
        </div>

        <ImagePlaceholder label="Камин в лобби" className="aspect-[4/3] w-full rounded-2xl" />
      </Container>
    </section>
  )
}