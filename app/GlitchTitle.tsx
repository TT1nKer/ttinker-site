"use client";

import { useEffect, useRef } from "react";

const between = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

export default function GlitchTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    const reset = () => {
      title.classList.remove("is-glitching");
      title.style.removeProperty("--title-x");
      title.style.removeProperty("--title-y");
      title.style.removeProperty("--title-skew");
      title.style.removeProperty("--cyan-x");
      title.style.removeProperty("--cyan-y");
      title.style.removeProperty("--coral-x");
      title.style.removeProperty("--coral-y");
      title.style.removeProperty("--cyan-clip");
      title.style.removeProperty("--coral-clip");
    };

    const frame = (remaining: number) => {
      if (stopped) return;

      const cyanTop = between(4, 76);
      const cyanHeight = between(12, 32);
      const coralTop = between(8, 80);
      const coralHeight = between(10, 28);
      const force = Math.random() < 0.3 ? 2.2 : 1;

      title.classList.add("is-glitching");
      title.style.setProperty("--title-x", `${between(-5, 5)}px`);
      title.style.setProperty("--title-y", `${between(-2, 2)}px`);
      title.style.setProperty("--title-skew", `${between(-10, 10) / 10}deg`);
      title.style.setProperty("--cyan-x", `${Math.round(between(-24, 24) * force)}px`);
      title.style.setProperty("--cyan-y", `${between(-7, 7)}px`);
      title.style.setProperty("--coral-x", `${Math.round(between(-22, 22) * force)}px`);
      title.style.setProperty("--coral-y", `${between(-6, 6)}px`);
      title.style.setProperty(
        "--cyan-clip",
        `inset(${cyanTop}% -4% ${Math.max(0, 100 - cyanTop - cyanHeight)}% -4%)`,
      );
      title.style.setProperty(
        "--coral-clip",
        `inset(${coralTop}% -4% ${Math.max(0, 100 - coralTop - coralHeight)}% -4%)`,
      );

      if (remaining > 1) {
        timer = setTimeout(() => frame(remaining - 1), between(55, 135));
      } else {
        timer = setTimeout(() => {
          reset();
          schedule();
        }, between(65, 170));
      }
    };

    const schedule = () => {
      if (stopped) return;
      timer = setTimeout(() => frame(between(3, 8)), between(950, 4800));
    };

    schedule();
    return () => {
      stopped = true;
      clearTimeout(timer);
      reset();
    };
  }, []);

  return (
    <h1 ref={titleRef} className="hero-title" data-text="TT1NKER." aria-label="TT1nKer">
      TT<span className="kinetic">1</span>NKER.
    </h1>
  );
}
