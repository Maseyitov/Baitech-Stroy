import ArrowLink from '@/components/ui/ArrowLink'
import ImageSlider, { type Slide } from '@/components/common/ImageSlider'
import Reveal from '@/components/motion/Reveal'
import img1 from "../images/img1.jpg"
import img2 from "../images/img2.jpg"
import img3 from "../images/img3.jpg"
import img4 from "../images/img4.jpg"

/* ============ ФОТО СЛАЙДЕРА — добавляй и меняй прямо здесь ============
  1. Положи фото в папку public/images (например, intro-1.jpg).
  2. Впиши путь в image: '/images/intro-1.jpg'  (всегда с / в начале, без слова public).
  3. caption — подпись под фото.
  4. Пока image: '' — вместо фото показывается градиент (tone — его цвет).
  Нужно больше слайдов — копируй строку целиком. Лишние — просто удаляй.
  Лучше всего фото 4:3, например 1600×1200 px, формат .jpg или .webp, до 300 КБ.
======================================================================= */
const SLIDES: Slide[] = [
  { image: img1, caption: 'Холл жилого комплекса «Название 1»', tone: 'blue' },
  { image: img2, caption: 'Двор жилого комплекса «Название 2»', tone: 'green' },
  { image: img3, caption: 'Интерьер квартиры в доме «Название 3»', tone: 'dusk' },
  { image: img4, caption: 'Фасад бизнес-центра «Название 4»', tone: 'navy' },
]

export default function IntroSection() {
  return (
    <section className="px-[3vw] pt-12 md:pt-16">
      <div className="grid items-start gap-8 md:grid-cols-2 md:pl-[8vw]">
        <Reveal>
          <ArrowLink to="/projects" label="Портфолио проектов" />
        </Reveal>
        <Reveal delay={0.15} className="md:pl-[8vw]">
          <p className="max-w-[27rem] text-[13px] leading-relaxed">
            Мы создаём комфортную и надёжную среду для жизни и работы. Заботимся о клиенте на каждом
            этапе: при выборе, на стадии покупки, в ожидании ключей и, конечно, во время жизни и
            работы в наших домах. Мы смотрим на свою работу глазами клиента и строим только то, что
            устроило бы нас самих.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-16 md:mt-24 md:pl-[8vw]">
        <h2 className="text-[clamp(2rem,3.6vw,3.25rem)]">
          Уникальные дома,
          <br />
          превосходящие ожидания
        </h2>
      </Reveal>

      <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-2">
        <Reveal className="md:pl-[8vw] md:pr-10">
          <p className="max-w-[26rem] text-[13px] leading-relaxed">
            Нам важно, как человек будет чувствовать себя в построенном нами доме. Мы вкладываем
            душу в каждый элемент и продумываем всё до мелочей. Наши продукты отличаются
            максимальной комплектацией и зачастую превосходят продукты конкурентов. Мы стремимся
            сделать каждый элемент дома идеальным для детей и родителей, добрососедства, здорового
            образа жизни, автомобилей и велосипедов, жителей и их гостей — для всех вас.
          </p>
          <ArrowLink to="/about" className="mt-8" />
        </Reveal>

        <Reveal variant="image" delay={0.1}>
          <ImageSlider slides={SLIDES} imageClassName="aspect-[4/3] rounded-tl-[6rem]" />
        </Reveal>
      </div>
    </section>
  )
}