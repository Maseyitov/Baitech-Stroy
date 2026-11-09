import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import SplitTitle from "@/components/motion/SplitTitle";
import video from "@/assets/video/hero.mp4";

/* ============ НАСТРОЙКИ БАННЕРА — меняй только здесь ============ */
const HERO = {
  // Видео: файл положи в public/video/hero.mp4 и впиши '/video/hero.mp4'. Пусто = градиент
  video: video as string,
  // Кадр, который виден, пока видео грузится: '/images/hero-poster.jpg' (необязательно)
  poster: "" as string,
  title: ["Строим надёжно", "Premium Development"],
  // Высота баннера. Растёт с экраном, но не больше 36rem (576px) — на больших мониторах она фиксирована.
  // Хочешь выше или ниже — меняй числа: h-[clamp(МИНИМУМ, 46vw, МАКСИМУМ)]
  height: "h-[clamp(24rem,46vw,36rem)]",
};
/* ================================================================= */

const EASE_EXPAND = [0.76, 0, 0.24, 1] as const;

/** Границы баннера относительно краёв окна (в пикселях) */
type Box = { top: number; left: number; right: number; bottom: number };

/** Видео на весь экран. Появляется ровно поверх баннера и разрастается до краёв окна. */
function ExpandedVideo({
  from,
  startTime,
  onClose,
}: {
  from: Box;
  startTime: number;
  onClose: () => void;
}) {
  useEffect(() => {
    // gutter: stable — чтобы страница не дёргалась, когда пропадает полоса прокрутки
    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.scrollbarGutter = "";
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Видео о компании"
      className="fixed z-[60] overflow-hidden bg-black"
      initial={from}
      animate={{ top: 0, left: 0, right: 0, bottom: 0 }}
      exit={from}
      transition={{ duration: 0.85, ease: EASE_EXPAND }}
    >
      {HERO.video ? (
        <video
          src={HERO.video}
          poster={HERO.poster || undefined}
          autoPlay
          controls
          playsInline
          // продолжаем с того же кадра, что был в баннере
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = startTime;
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <ImagePlaceholder tone="blue" alt="" className="h-full w-full" />
          <p className="absolute inset-0 grid place-items-center text-sm text-white/70">
            Здесь будет видео о компании
          </p>
        </>
      )}

      <motion.button
        autoFocus
        type="button"
        aria-label="Свернуть видео"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.4 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        whileHover={{ rotate: 90 }}
        className="absolute right-[3vw] top-5 grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-navy-deep/40 text-white backdrop-blur transition-colors hover:bg-white hover:text-navy"
      >
        <X size={22} strokeWidth={1.25} />
      </motion.button>
    </motion.div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState<{
    from: Box;
    startTime: number;
  } | null>(null);

  const open = () => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const root = document.documentElement;
    setExpanded({
      from: {
        top: r.top,
        left: r.left,
        right: root.clientWidth - r.right,
        bottom: root.clientHeight - r.bottom,
      },
      startTime: bgVideoRef.current?.currentTime ?? 0,
    });
    bgVideoRef.current?.pause(); // фоновое видео не крутим, пока открыто большое
  };

  const close = useCallback(() => setExpanded(null), []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative isolate overflow-hidden text-white", HERO.height)}
    >
      {/* Фоновое видео: без звука, по кругу. При включённом «уменьшить движение» не запускается само */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {HERO.video ? (
          <video
            ref={bgVideoRef}
            src={HERO.video}
            poster={HERO.poster || undefined}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder tone="blue" alt="" className="h-full w-full" />
        )}
      </motion.div>

      {/* Затемнение: чтобы белый заголовок читался на любом видео */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-deep/75 via-navy-deep/15 to-navy-deep/10" />

      {/* Кнопка play в центре */}
      <motion.div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 16 }}
      >
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-white/70"
            animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.button
          type="button"
          aria-label="Открыть видео на весь экран"
          onClick={open}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-navy transition-colors hover:bg-green hover:text-white"
        >
          <Play size={20} strokeWidth={1.25} className="ml-0.5" />
        </motion.button>
      </motion.div>

      {/* Заголовок */}
      <div className="absolute bottom-[9%] left-[3vw] md:left-[11vw]">
        <SplitTitle className="text-[clamp(2.25rem,4.6vw,4.25rem)] font-light">
          {HERO.title[0]}
          <br />
          <span className="text-white/85">{HERO.title[1]}</span>
        </SplitTitle>
      </div>

      {/* Большое видео рисуется поверх всей страницы (portal в body), иначе его обрежет баннер */}
      {createPortal(
        <AnimatePresence
          onExitComplete={() => bgVideoRef.current?.play().catch(() => {})}
        >
          {expanded && (
            <ExpandedVideo
              key="expanded"
              from={expanded.from}
              startTime={expanded.startTime}
              onClose={close}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
