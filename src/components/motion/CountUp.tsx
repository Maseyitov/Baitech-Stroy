import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useInView, useReducedMotion } from "motion/react";
import { useAlreadyPlayed } from "./PageScope";

const NUM = /\d(?:[ \d]*\d)?/g;

/** Подставляет в строку числа, умноженные на прогресс p (0..1). Пробелы-разделители сохраняются. */
function render(value: string, p: number) {
  return value.replace(NUM, (token) => {
    const n = Math.round(parseInt(token.replace(/ /g, ""), 10) * p);
    const s = String(n);
    return token.includes(" ") ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
  });
}

type Props = {
  /** Число или строка: "100", "550 000", "24/7". Цифры внутри набегают от нуля. */
  value?: string | number;
  className?: string;
  duration?: number;
};

/**
 * Число «набегает» от нуля ОДИН РАЗ — когда блок впервые попадает на экран (Anime.js).
 * Потом число остаётся на месте и не пересчитывается (пока сайт не обновлён).
 */
export default function CountUp({
  value: raw,
  className,
  duration = 2200,
}: Props) {
  // Если значение забыли передать — не падаем, а показываем пустое место и пишем подсказку в консоль
  if (import.meta.env.DEV && (raw === undefined || raw === null)) {
    console.warn(
      'CountUp: не передан value. Проверь <CountUp value="..."> или <CircleSection value="...">',
    );
  }
  const value = raw === undefined || raw === null ? "" : String(raw);

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  const alreadyPlayed = useAlreadyPlayed();
  const showFinal = reduced || alreadyPlayed;

  useEffect(() => {
    const el = ref.current;
    if (!value || showFinal || !inView || !el) return;

    const state = { p: 0 };
    const anim = animate(state, {
      p: 1,
      duration,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = render(value, state.p);
      },
      onComplete: () => {
        el.textContent = value;
      },
    });

    return () => {
      anim.revert();
      el.textContent = value;
    };
  }, [inView, showFinal, value, duration]);

  return (
    <span
      ref={ref}
      className={`whitespace-nowrap tabular-nums ${className ?? ""}`}
      aria-label={value || undefined}
    >
      {showFinal ? value : render(value, 0)}
    </span>
  );
}
