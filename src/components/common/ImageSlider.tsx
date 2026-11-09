import { useEffect, useRef, useState, type FocusEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import CircleButton from "@/components/ui/CircleButton";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export type Slide = {
  caption: string;
  image?: string;
  tone?: "blue" | "green" | "navy" | "dusk";
};

type Props = {
  slides: Slide[];
  /**
   * framed — картинка с закруглением, подпись и стрелки под ней
   * wide   — во всю ширину, белые стрелки по бокам, счётчик по центру
   */
  variant?: "framed" | "wide";
  /** Автопереключение: интервал в мс (например 5000). Не указан — слайдер листается только вручную */
  autoplay?: number;
  className?: string;
  imageClassName?: string;
};

/** Цифра счётчика «выезжает» снизу вверх при смене слайда */
function Digit({ n }: { n: number }) {
  return (
    <span className="relative inline-flex h-[1.25em] min-w-[0.6em] justify-center overflow-hidden align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={n}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="inline-block"
        >
          {n}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function ImageSlider({
  slides,
  variant = "framed",
  autoplay,
  className,
  imageClassName,
}: Props) {
  const [index, setIndex] = useState(0);
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);
  const current = slides[index];

  // ——— автопереключение ———
  const rootRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false); // курсор над слайдером
  const [focused, setFocused] = useState(false); // фокус с клавиатуры внутри слайдера
  const [dragging, setDragging] = useState(false); // листают свайпом
  const [onScreen, setOnScreen] = useState(false); // слайдер виден на экране
  const [tabActive, setTabActive] = useState(true); // вкладка браузера открыта
  const reduceMotion = useReducedMotion(); // в системе включено «уменьшить движение»

  const running =
    !!autoplay &&
    slides.length > 1 &&
    !hovered &&
    !focused &&
    !dragging &&
    onScreen &&
    tabActive &&
    !reduceMotion;

  // Следим, виден ли слайдер на экране
  useEffect(() => {
    const el = rootRef.current;
    if (!autoplay || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoplay]);

  // Следим, открыта ли вкладка браузера
  useEffect(() => {
    if (!autoplay) return;
    const onChange = () => setTabActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, [autoplay]);

  // Таймер перезапускается при каждой смене слайда — и автоматической, и ручной.
  // Поэтому после клика по стрелке снова ждём полный интервал.
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(1), autoplay);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, autoplay]);

  // Пауза только при фокусе с клавиатуры (клик мышью по стрелке не должен останавливать навсегда)
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(":focus-visible")) setFocused(true);
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null))
      setFocused(false);
  };

  const rootProps = {
    ref: rootRef,
    className,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus,
    onBlur,
  };

  const track = (
    // Пока слайды листаются сами, экранный диктор не зачитывает каждую смену
    <div
      className="relative overflow-hidden"
      aria-live={running ? "off" : "polite"}
    >
      {/* Слайды можно листать свайпом/мышью */}
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragElastic={0.12}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={(_, info) => {
          setDragging(false);
          if (info.offset.x < -60) go(1);
          else if (info.offset.x > 60) go(-1);
        }}
        style={{ touchAction: "pan-y" }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {slides.map((s, i) => (
          <motion.div
            key={i}
            className={
              i === index ? "relative" : "pointer-events-none absolute inset-0"
            }
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 1.06,
            }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            aria-hidden={i !== index}
          >
            <ImagePlaceholder
              src={s.image}
              alt={s.caption}
              tone={s.tone}
              className={cn("h-full w-full", imageClassName)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const caption = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="block"
      >
        {current.caption}
      </motion.span>
    </AnimatePresence>
  );

  if (variant === "wide") {
    return (
      <figure {...rootProps}>
        <div className="relative">
          {track}
          <CircleButton
            dir="prev"
            variant="white"
            onClick={() => go(-1)}
            className="absolute left-[3%] top-1/2 -translate-y-1/2"
          />
          <CircleButton
            dir="next"
            variant="white"
            onClick={() => go(1)}
            className="absolute right-[3%] top-1/2 -translate-y-1/2"
          />
          <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-display text-3xl font-normal tabular-nums text-white">
            <Digit n={index + 1} />/
            <span className="text-sm">{slides.length}</span>
          </p>
        </div>
        <figcaption className="mt-4 pl-[2.5vw] text-xs text-muted">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure {...rootProps}>
      {track}
      <figcaption className="mt-4 flex items-center justify-between gap-4 text-xs text-muted">
        {caption}
        <span className="flex shrink-0 items-center gap-4">
          <CircleButton dir="prev" size="sm" onClick={() => go(-1)} />
          <span className="font-display text-sm tabular-nums text-navy">
            <Digit n={index + 1} /> / {slides.length}
          </span>
          <CircleButton dir="next" size="sm" onClick={() => go(1)} />
        </span>
      </figcaption>
    </figure>
  );
}
