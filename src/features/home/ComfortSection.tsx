import CircleSection from '@/components/ui/CircleSection'
import ArrowLink from '@/components/ui/ArrowLink'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import CountUp from '@/components/motion/CountUp'
import Reveal from '@/components/motion/Reveal'

const STATS = [
  { value: '550 000', unit: 'м²', label: 'в управлении' },
  { value: '310', unit: '', label: 'сотрудников' },
]

export default function ComfortSection() {
  return (
    <>
      <CircleSection
        value="24/7"
        caption="круглосуточная забота"
        heading={
          <h2 className="text-[clamp(2rem,3.6vw,3.25rem)]">
            Служба
            <br />
            комфорта
          </h2>
        }
        image={<ImagePlaceholder tone="green" alt="Камин в лобби" className="aspect-[1.15] w-full rounded-tl-[3rem]" />}
      >
        <p className="text-[13px] leading-relaxed">
          Служба комфорта обеспечивает высокий уровень сервиса, единые стандарты которого действуют
          во всех построенных нами домах и деловых центрах.
        </p>
      </CircleSection>

      <section className="grid items-center gap-10 px-[3vw] pb-12 md:grid-cols-2 md:pb-20">
        <Reveal className="md:pl-[8vw] md:pr-10">
          <dl className="flex border-y border-line md:max-w-[22rem]">
            {STATS.map((s, i) => (
              <div key={s.label} className={`flex-1 px-5 py-4 ${i ? 'border-l border-line' : ''}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-light tabular-nums">
                  <CountUp value={s.value} /> <span className="text-xs">{s.unit}</span>
                  <span className="mt-1 block text-[10px] font-normal text-blue">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[26rem] text-[13px] leading-relaxed">
            Служба комфорта — одно из подразделений компании, которое занимается содержанием наших
            домов. Но это больше, чем управляющая компания: она работает круглосуточно, обеспечивая
            максимальный комфорт и премиальное качество жизни для наших клиентов.
          </p>
          <ArrowLink to="/services" className="mt-8" />
        </Reveal>
        <Reveal variant="image" delay={0.1}>
        <figure>
          <ImagePlaceholder tone="blue" alt="Двор дома" className="aspect-[1.55] w-full rounded-bl-[6rem]" />
          <figcaption className="mt-3 text-right text-xs text-muted">
            Двор дома «<span className="text-blue">Название 2</span>»
          </figcaption>
        </figure>
        </Reveal>
      </section>
    </>
  )
}
