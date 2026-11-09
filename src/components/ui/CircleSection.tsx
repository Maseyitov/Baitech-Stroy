import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { animate, onScroll } from "animejs";
import { useReducedMotion } from "motion/react";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import styles from "./CircleSection.module.scss";

type Props = {
  value: string;
  caption: string;
  /** Заголовок над кругом */
  heading?: ReactNode;
  /** Фото слева внизу круга */
  image?: ReactNode;
  /** Текст справа внизу */
  children: ReactNode;
};

/** Точка на окружности радиусом 49.5 с центром (50, 50); угол в градусах по часовой от оси X */
const pt = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  return `${(50 + 49.5 * Math.cos(r)).toFixed(2)} ${(50 + 49.5 * Math.sin(r)).toFixed(2)}`;
};
/** Дуга от a до b градусов. Режется на кусочки по 90°, чтобы получалась ровной при любой длине. */
const arc = (a: number, b: number) => {
  const steps = Math.max(1, Math.ceil((b - a) / 90));
  let d = `M ${pt(a)}`;
  for (let i = 1; i <= steps; i++)
    d += ` A 49.5 49.5 0 0 1 ${pt(a + ((b - a) * i) / steps)}`;
  return d;
};

/**
 * Куски линии. Углы считаются от ВЕРХНЕЙ точки круга по часовой стрелке:
 *   0° — верх, 90° — право, 180° — низ, 270° — лево.
 * Между 100° и 180° линии нет — это место, где стоит текст. Больше разрывов нет:
 * на 360° линия приходит в ту же верхнюю точку, откуда начиналась, и круг замыкается.
 */
const SEGMENTS = [
  { from: 0, to: 100 }, // сверху вниз по правой стороне, обрывается над текстом
  { from: 180, to: 360 }, // снизу влево, под фото, вверх по левой стороне и в верхнюю точку
];

// В SVG ноль градусов справа, поэтому отнимаем 90°, чтобы начинать сверху
const PATHS = SEGMENTS.map((s) => arc(s.from - 90, s.to - 90));

/**
 * ====================  СКОРОСТЬ РИСОВАНИЯ — МЕНЯЙ ЗДЕСЬ  ====================
 *
 * SLOWNESS — «медлительность» линии. ЧЕМ БОЛЬШЕ ЧИСЛО, ТЕМ МЕДЛЕННЕЕ РАСТЁТ ЛИНИЯ.
 *   Допустимо от 0.5 до 2.
 *     0.7 — быстро: круг дорисовывается, пока блок только выезжает на экран
 *     1   — круг готов, когда его центр дошёл до середины экрана
 *     1.5 — спокойно
 *     1.8 — медленно (сейчас)
 *     2   — самое медленное: круг заканчивается, когда блок полностью уехал вверх за экран
 *   Больше 2 ставить нет смысла: линия не успела бы дорисоваться до того, как блок уйдёт с экрана.
 *
 * SMOOTH — инерция. ЧЕМ МЕНЬШЕ ЧИСЛО, ТЕМ ПЛАВНЕЕ И ЛЕНИВЕЕ линия догоняет колесо мыши.
 *   От 0.05 (очень плавно, как тянется) до 1 (жёстко, ровно за прокруткой).
 */
const SLOWNESS = 2.0;
const SMOOTH = 0.5;
// ============================================================================

/**
 * Блок с большой цифрой в тонком круге.
 * Линия «растёт» как стрелка спидометра: от верхней точки по часовой стрелке, по мере прокрутки.
 * Листаешь вниз — линия растёт, вверх — убывает (Anime.js onScroll).
 */
export default function CircleSection({
  value,
  caption,
  heading,
  image,
  children,
}: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const reduced = useReducedMotion();

  /** p от 0 (ничего нет) до 1 (круг целиком) */
  const draw = (p: number) => {
    const sweep = p * 360; // на сколько градусов уже «прошла стрелка»
    SEGMENTS.forEach((s, i) => {
      const el = pathRefs.current[i];
      if (!el) return;
      const f = Math.min(1, Math.max(0, (sweep - s.from) / (s.to - s.from)));
      el.style.strokeDasharray = `${f * 100} 100`; // pathLength=100, поэтому 100 = весь кусок
      el.style.opacity = f > 0.002 ? "1" : "0";
    });
  };

  // До первого кадра: круг пустой (или полный, если включено «уменьшить движение»)
  useLayoutEffect(() => {
    draw(reduced ? 1 : 0);
  }, [reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const ring = ringRef.current;
    if (reduced || !ring) return;

    // Наблюдатель считает весь путь блока по экрану: 0 — верх круга показался снизу,
    // 1 — круг полностью ушёл вверх. Половина пути = центр круга посреди экрана.
    // Из-за этого «2 / SLOWNESS» растягивает рисование на нужную долю пути.
    const speedUp = 2 / Math.min(2, Math.max(0.5, SLOWNESS));
    const observer = onScroll({ target: ring, sync: SMOOTH });
    const state = { p: 0 };
    const anim = animate(state, {
      p: 1,
      ease: "linear",
      autoplay: observer,
      onUpdate: () => draw(Math.min(1, state.p * speedUp)),
    });

    return () => {
      anim.revert();
      observer.revert();
    };
  }, [reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.section}>
      <div className={styles.box}>
        {heading && <Reveal className={styles.heading}>{heading}</Reveal>}

        <div ref={ringRef} className={styles.ring}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                pathLength={100}
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
              />
            ))}
          </svg>
          <div className={styles.value}>
            <strong>
              <CountUp value={value} />
            </strong>
            <Reveal variant="fade" delay={0.5}>
              <span className={styles.caption}>{caption}</span>
            </Reveal>
          </div>
        </div>

        {image && (
          <Reveal variant="image" className={styles.photo}>
            {image}
          </Reveal>
        )}

        <Reveal delay={0.15} className={styles.text}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
