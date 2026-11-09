import { useEffect, useRef, type ReactNode } from "react";
import { animate, splitText, stagger } from "animejs";
import { prefersReducedMotion } from "@/lib/motion";
import { useAlreadyPlayed } from "./PageScope";

type Props = { children: ReactNode; className?: string; delay?: number };

/** Заголовок, который выезжает по буквам (Anime.js splitText). Играет один раз за посещение сайта. */
export default function SplitTitle({
  children,
  className,
  delay = 400,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const alreadyPlayed = useAlreadyPlayed();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (alreadyPlayed || prefersReducedMotion()) {
      el.style.visibility = "visible";
      return;
    }

    const split = splitText(el, { chars: { wrap: "clip" } });
    el.style.visibility = "visible";
    const anim = animate(split.chars, {
      y: ["115%", "0%"],
      opacity: [0, 1],
      duration: 1200,
      ease: "outExpo",
      delay: stagger(30, { start: delay }),
    });

    return () => {
      anim.revert();
      split.revert();
    };
  }, [delay, alreadyPlayed]);

  return (
    <h1 ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </h1>
  );
}
