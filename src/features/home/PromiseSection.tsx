import ArrowLink from '@/components/ui/ArrowLink'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import CompareSlider from '@/components/common/CompareSlider'
import Reveal from '@/components/motion/Reveal'
import { COMPARE_PROJECTS } from '@/data/home'

export default function PromiseSection() {
  return (
    <section className="py-12 md:py-20">
      <Reveal className="px-[3vw] md:pl-[11vw]">
        <h2 className="text-[clamp(2rem,3.6vw,3.25rem)]">
          Мы всегда строим
          <br />
          то, что обещали
        </h2>
        <p className="mt-10 text-[13px]">Сравните рендеры и живые фотографии.</p>
      </Reveal>

      <Reveal variant="image" className="mt-12">
        <CompareSlider projects={COMPARE_PROJECTS} />
      </Reveal>

      <div className="mt-16 grid items-center gap-10 px-[3vw] md:mt-24 md:grid-cols-2">
        <Reveal className="md:pl-[8vw] md:pr-10">
          <p className="max-w-[26rem] text-[13px] leading-relaxed">
            Мы никогда не экономим на материалах и строительных решениях, не меняем изначальный
            проект и гордимся тем, что фотографии готовых домов не отличаются от рендеров в нашей
            рекламе.
          </p>
          <ArrowLink to="/projects" className="mt-8" />
        </Reveal>
        <Reveal variant="image" delay={0.1}>
        <figure>
          <ImagePlaceholder tone="green" alt="Ресепшн дома" className="aspect-[1.3] w-full rounded-bl-[6rem]" />
          <figcaption className="mt-3 text-right text-xs text-muted">
            Ресепшн дома «<span className="text-blue">Название 3</span>»
          </figcaption>
        </figure>
        </Reveal>
      </div>
    </section>
  )
}
