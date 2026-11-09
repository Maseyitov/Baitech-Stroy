import Accordion from '@/components/common/Accordion'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import Reveal from '@/components/motion/Reveal'
import { CARE_ITEMS } from '@/data/home'

export default function CareSection() {
  return (
    <section className="px-[3vw] py-12 md:py-20">
      <div className="grid gap-8 md:grid-cols-2">
        <Reveal className="md:pl-[8vw]">
        <h2 className="text-[clamp(2rem,3.6vw,3.25rem)]">
          Забота о клиенте и учёт
          <br />
          его потребностей
          <br />
          на каждом этапе
        </h2>
        </Reveal>
        <Reveal delay={0.15} className="self-end md:pl-[8vw]">
        <p className="max-w-[27rem] text-[13px] leading-relaxed">
          Мы с уважением относимся к своим клиентам и окружаем их заботой на каждом этапе: при
          выборе и покупке недвижимости, во время ожидания и получения ключей, на стадии жизни и
          работы в наших домах.
        </p>
        </Reveal>
      </div>

      <div className="mt-14 grid items-start gap-10 md:mt-20 md:grid-cols-2">
        <Reveal variant="image">
          <ImagePlaceholder tone="dusk" alt="Клиент с телефоном" className="aspect-[1.33] w-full" />
        </Reveal>
        <Reveal delay={0.15} className="md:pl-[8vw]">
          <Accordion items={CARE_ITEMS} />
        </Reveal>
      </div>
    </section>
  )
}
