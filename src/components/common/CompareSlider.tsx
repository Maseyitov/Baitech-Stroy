import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import CircleButton from "@/components/ui/CircleButton";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import styles from "./CompareSlider.module.scss";

export type CompareShot = {
  /** Подпись на превью: «Фасад», «Двор»… */
  label: string;
  /** Рендер — нижний слой, видно слева от линии («Проект») */
  render?: string;
  /** Живая фотография — верхний слой, видно справа от линии («Реальность») */
  photo?: string;
};
export type CompareProject = { name: string; shots: CompareShot[] };

type Props = { projects: CompareProject[] };

type Tone = "blue" | "green" | "navy" | "dusk";
const LEFT: Tone[] = ["dusk", "blue", "navy"];
const RIGHT: Tone[] = ["green", "blue", "dusk"];

/** Стартовое положение линии, % */
const START = 50;
/** Радиус захвата: сколько px слева и справа от линии можно хватать */
const HIT = 40;
/** Расстояние между «таблетками» «Проект» и «Реальность», px */
const PILL_GAP = 44;
/** Насколько темнеет меньшая половина, когда линия у самого края (0 — никак, 1 — полностью чёрная) */
const MAX_DARK = 0.7;
/** Шаг линии при управлении стрелками клавиатуры, % */
const KEY_STEP = 2;

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/** Картинка, а если ссылки нет — заглушка */
function Picture({
  src,
  tone,
  alt,
}: {
  src?: string;
  tone: Tone;
  alt: string;
}) {
  return src ? (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="h-full w-full select-none object-cover"
    />
  ) : (
    <ImagePlaceholder tone={tone} alt={alt} className="h-full w-full" />
  );
}

/** Слой на всю рамку: при смене кадра новая картинка плавно «наезжает» поверх старой */
function Layer({
  id,
  src,
  tone,
  alt,
}: {
  id: string;
  src?: string;
  tone: Tone;
  alt: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-navy">
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <Picture src={src} tone={tone} alt={alt} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Подпись стоит на месте — по центру своей половины кадра */
const labelCls =
  "pointer-events-none absolute bottom-5 w-1/2 whitespace-nowrap text-center font-display text-xl font-normal text-white md:text-2xl";

/** Сравнение «Проект / Реальность» с вкладками проектов и лентой превью. */
export default function CompareSlider({ projects }: Props) {
  const [p, setP] = useState(0);
  const [s, setS] = useState(0);
  const [dragging, setDragging] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * Положение линии хранится НЕ в state, а в ref + CSS-переменной --pos.
   * Так при движении React ничего не перерисовывает — браузер просто двигает линию.
   */
  const posRef = useRef(START);
  const pendingRef = useRef(START);
  const rafRef = useRef(0);
  /** Насколько курсор был левее/правее линии в момент захвата — чтобы линия не «прыгала» под палец */
  const grabOffset = useRef(0);

  const project = projects[p];
  const shot = project.shots[s];
  const frameId = `${p}-${s}`;
  const leftTone = LEFT[(p + s) % LEFT.length];
  const rightTone = RIGHT[(p + s) % RIGHT.length];

  /** Применяет положение линии напрямую к DOM */
  const apply = (v: number) => {
    posRef.current = v;
    const frame = frameRef.current;
    if (frame) {
      frame.style.setProperty("--pos", `${v}%`);
      // Чем меньше остаётся половины, тем она темнее: от 0 в центре до MAX_DARK у края
      frame.style.setProperty(
        "--dark-render",
        String(v < 50 ? ((50 - v) / 50) * MAX_DARK : 0),
      );
      frame.style.setProperty(
        "--dark-photo",
        String(v > 50 ? ((v - 50) / 50) * MAX_DARK : 0),
      );
    }
    const handle = handleRef.current;
    if (handle) {
      handle.setAttribute("aria-valuenow", String(Math.round(v)));
      handle.setAttribute(
        "aria-valuetext",
        `Видно фотографии: ${Math.round(100 - v)}%`,
      );
    }
  };

  useLayoutEffect(() => apply(START), []);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ——— переключение кадров ———
  const goTo = (projectIndex: number, shotIndex: number) => {
    setP(projectIndex);
    setS(shotIndex);
    apply(START); // на новом кадре линия плавно возвращается в центр
  };
  const step = (dir: 1 | -1) =>
    goTo(p, (s + dir + project.shots.length) % project.shots.length);

  // Лента превью сама докручивается до выбранного кадра (крутим только ленту, не страницу)
  useEffect(() => {
    const strip = stripRef.current;
    const el = thumbRefs.current[s];
    if (!strip || !el) return;
    strip.scrollTo({
      left: el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [p, s]);

  // ——— перетаскивание линии ———
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    grabOffset.current =
      e.clientX - (rect.left + (rect.width * posRef.current) / 100);
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    pendingRef.current = clamp(
      ((e.clientX - grabOffset.current - rect.left) / rect.width) * 100,
    );
    // Не чаще одного раза за кадр экрана
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        apply(pendingRef.current);
      });
    }
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = e.shiftKey ? 5 : 1;
    const pos = posRef.current;
    const next: Record<string, number> = {
      ArrowLeft: pos - KEY_STEP * big,
      ArrowRight: pos + KEY_STEP * big,
      Home: 0,
      End: 100,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    apply(clamp(next[e.key]));
  };

  // Анимация только когда НЕ тянем (сброс в центр, клавиатура). Во время перетаскивания — ноль задержки.
  const ease = "duration-500 ease-out";

  return (
    <div>
      <div
        role="tablist"
        aria-label="Проекты"
        className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-[3vw] pb-1 md:justify-center md:gap-8"
      >
        {projects.map((item, i) => (
          <button
            key={item.name}
            role="tab"
            aria-selected={i === p}
            onClick={() => goTo(i, 0)}
            className={cn(styles.tab, i === p && styles.tabActive)}
          >
            {item.name}
            {/* Подчёркивание плавно переезжает с вкладки на вкладку */}
            {i === p && (
              <motion.span
                layoutId="compare-tab"
                className="absolute inset-x-0 -bottom-0.5 h-px bg-navy"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        ref={frameRef}
        className={cn(
          "relative mx-[3vw] mt-8 aspect-[16/10] select-none overflow-hidden md:aspect-[1.9]",
          dragging && "cursor-grabbing",
        )}
      >
        {/* Нижний слой — рендер на всю рамку. Подпись стоит на месте, фото просто наезжает на неё */}
        <div className="absolute inset-0">
          <Layer
            id={`r-${frameId}`}
            src={shot.render}
            tone={leftTone}
            alt={`Рендер: ${shot.label}`}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-black",
              !dragging && `transition-opacity ${ease}`,
            )}
            style={{ opacity: "var(--dark-render, 0)" }}
          />
          <span className={cn(labelCls, "left-0")}>Рендер</span>
        </div>

        {/* Верхний слой — фото на всю рамку, обрезан слева по линии. Подпись обрезается вместе с ним */}
        <div
          className={cn(
            "absolute inset-0 will-change-[clip-path]",
            !dragging && `transition-[clip-path] ${ease}`,
          )}
          style={{ clipPath: "inset(0 0 0 var(--pos, 50%))" }}
        >
          <Layer
            id={`p-${frameId}`}
            src={shot.photo}
            tone={rightTone}
            alt={`Фотография: ${shot.label}`}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-black",
              !dragging && `transition-opacity ${ease}`,
            )}
            style={{ opacity: "var(--dark-photo, 0)" }}
          />
          <span className={cn(labelCls, "right-0")}>Фотография</span>
        </div>

        {/* Ручка: зона захвата — по HIT px слева и справа от линии */}
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label="Граница между рендером и фотографией"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={START}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
          className={cn(
            "group absolute inset-y-0 z-20 -translate-x-1/2 touch-none outline-none will-change-[left]",
            dragging
              ? "cursor-grabbing"
              : `cursor-grab transition-[left] ${ease}`,
          )}
          style={{ left: "var(--pos, 50%)", width: HIT * 2 }}
        >
          <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/60" />
          {/* «Таблетки» разнесены от линии на PILL_GAP / 2 в каждую сторону */}
          <span
            className={cn(
              styles.pill,
              "bg-white text-navy group-focus-visible:ring-2 group-focus-visible:ring-white/70",
            )}
            style={{ right: `calc(50% + ${PILL_GAP / 2}px)` }}
          >
            Проект
          </span>
          <span
            className={cn(
              styles.pill,
              "bg-navy text-white group-focus-visible:ring-2 group-focus-visible:ring-white/70",
            )}
            style={{ left: `calc(50% + ${PILL_GAP / 2}px)` }}
          >
            Реальность
          </span>
        </div>

        <CircleButton
          dir="prev"
          variant="white"
          onClick={() => step(-1)}
          className="absolute left-[3%] top-1/2 z-30 -translate-y-1/2"
        />
        <CircleButton
          dir="next"
          variant="white"
          onClick={() => step(1)}
          className="absolute right-[3%] top-1/2 z-30 -translate-y-1/2"
        />
      </div>

      <div className="mx-[3vw] mt-2 flex items-center gap-1">
        <button
          onClick={() => step(-1)}
          aria-label="Предыдущий кадр"
          className="shrink-0 self-start py-4 text-navy"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>

        <div
          ref={stripRef}
          className="relative flex flex-1 gap-1 overflow-x-auto"
        >
          {project.shots.map((item, i) => (
            <div
              key={`${p}-${i}`}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              className="flex flex-1 basis-26 flex-col items-stretch"
            >
              <button
                onClick={() => goTo(p, i)}
                aria-label={item.label}
                aria-current={i === s}
                className={cn(styles.thumb, i === s && styles.thumbActive)}
              >
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    tone={i % 2 ? "navy" : "blue"}
                    className="absolute inset-0 h-full w-full"
                  />
                )}
                <span>{item.label}</span>
              </button>
              <span className="mt-1 flex h-[7px] justify-center">
                {/* Зелёный маркер скользит под выбранное превью */}
                {i === s && (
                  <motion.span
                    layoutId="thumb-marker"
                    className="block h-0 w-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-green"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => step(1)}
          aria-label="Следующий кадр"
          className="shrink-0 self-start py-4 text-navy"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
