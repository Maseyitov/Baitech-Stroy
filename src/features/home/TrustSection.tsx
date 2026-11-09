import CircleSection from "@/components/ui/CircleSection";
import ArrowLink from "@/components/ui/ArrowLink";
import ImageSlider from "@/components/common/ImageSlider";
import Reveal from "@/components/motion/Reveal";
import { TRUST_SLIDES } from "@/data/home";

export default function TrustSection() {
  return (
    <>
      <CircleSection
        value="25"
        caption="лет опыта"
        heading={
          <h2 className="text-[clamp(2rem,3.6vw,3.25rem)]">
            Девелопер, которому
            <br />
            можно доверять
          </h2>
        }
      >
        <div className="space-y-3 text-[13px] leading-relaxed">
          <p>
            Компания обладает 25-летним опытом строительства жилой и
            коммерческой недвижимости. За это время реализовано более 100
            проектов общей площадью 12 млн кв. м.
          </p>
          <p>
            Многолетний опыт и накопленные технологии мы применяем в каждом
            новом доме.
          </p>
        </div>
        <ArrowLink to="/about" className="mt-6" />
      </CircleSection>

      <section className="px-[3vw] pb-20 md:pb-28">
        <Reveal variant="image">
          <ImageSlider
            variant="wide"
            slides={TRUST_SLIDES}
            autoplay={5000}
            imageClassName="aspect-[1.6] md:aspect-[2.1]"
          />
        </Reveal>
      </section>
    </>
  );
}
