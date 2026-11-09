import Container from '@/components/ui/Container'
import ArrowLink from '@/components/ui/ArrowLink'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

export default function StatsSection() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <ImagePlaceholder label="Фото дома" className="aspect-[4/5] w-full rounded-2xl" />
        <div>
          <p className="text-7xl font-bold text-blue md:text-9xl">100</p>
          <p className="mt-2 text-sm uppercase tracking-widest text-green">проектов</p>
          <p className="mt-8 max-w-lg text-lg text-navy-light">
            Мы вкладываем душу в каждый проект: прорабатываем детали, продумываем инфраструктуру и
            подбираем материалы.
          </p>
          <div className="mt-8">
            <ArrowLink to="/projects" />
          </div>
        </div>
      </Container>
    </section>
  )
}