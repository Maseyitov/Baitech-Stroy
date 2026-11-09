import CircleSection from "@/components/ui/CircleSection";
import ArrowLink from "@/components/ui/ArrowLink";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import img5 from "../images/img5.jpg";

const BLOCK = {
  value: "100",
  caption: "проектов",
  photo: img5,
  photoAlt: "Жилой дом с террасой",
  text: "Мы вкладываем душу в каждый проект: прорабатываем детали, продумываем инфраструктуру и подбираем материалы.",
};

export default function ProjectsCountSection() {
  return (
    <CircleSection
      value={BLOCK.value}
      caption={BLOCK.caption}
      image={
        <ImagePlaceholder
          src={BLOCK.photo || undefined}
          tone="dusk"
          alt={BLOCK.photoAlt}
          className="aspect-[1.14] w-full rounded-tl-[3rem]"
        />
      }
    >
      <p className="text-[14px] leading-relaxed">{BLOCK.text}</p>
      <ArrowLink to="/projects" className="mt-6" />
    </CircleSection>
  );
}
