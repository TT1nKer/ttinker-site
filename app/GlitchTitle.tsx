"use client";

import { useEffect, useRef } from "react";

const between = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

export default function GlitchTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = new Set<ReturnType<typeof setTimeout>>();
    let stopped = false;
    let active = false;
    let lastBurst = 0;

    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
    };

    const reset = () => {
      active = false;
      title.classList.remove("is-glitching");
      for (const property of [
        "--title-x", "--title-y", "--title-skew", "--cyan-x", "--cyan-y",
        "--coral-x", "--coral-y", "--cyan-clip", "--coral-clip",
      ]) {
        title.style.removeProperty(property);
      }
    };

    const paintFragment = (intensity: number) => {
      const cyanTop = between(3, 78);
      const cyanHeight = between(9, 28);
      const coralTop = between(7, 82);
      const coralHeight = between(8, 25);
      const reach = 8 + intensity * 26;

      title.classList.add("is-glitching");
      title.style.setProperty("--title-x", `${between(-3, 3) * intensity}px`);
      title.style.setProperty("--title-y", `${between(-2, 2) * intensity}px`);
      title.style.setProperty("--title-skew", `${between(-12, 12) * intensity / 10}deg`);
      title.style.setProperty("--cyan-x", `${between(-reach, reach)}px`);
      title.style.setProperty("--cyan-y", `${between(-5, 5)}px`);
      title.style.setProperty("--coral-x", `${between(-reach, reach)}px`);
      title.style.setProperty("--coral-y", `${between(-4, 4)}px`);
      title.style.setProperty(
        "--cyan-clip",
        `inset(${cyanTop}% -5% ${Math.max(0, 100 - cyanTop - cyanHeight)}% -5%)`,
      );
      title.style.setProperty(
        "--coral-clip",
        `inset(${coralTop}% -5% ${Math.max(0, 100 - coralTop - coralHeight)}% -5%)`,
      );
    };

    const burst = (intensity: number, forced = false) => {
      const now = performance.now();
      if (stopped || active || (!forced && now - lastBurst < 650)) return;
      lastBurst = now;
      active = true;

      const fragments = between(2, intensity > 0.75 ? 5 : 3);
      let elapsed = 0;
      for (let index = 0; index < fragments; index += 1) {
        elapsed += between(28, 105);
        later(() => paintFragment(intensity * (index === 0 ? 1 : 0.72 + Math.random() * 0.28)), elapsed);
      }
      later(reset, elapsed + between(45, 130));
    };

    const scheduleAmbient = () => {
      if (stopped) return;
      later(() => {
        if (!document.hidden) burst(0.32 + Math.random() * 0.22, true);
        scheduleAmbient();
      }, between(5200, 14800));
    };

    const onDisturb = (event: Event) => {
      const intensity = (event as CustomEvent<{ intensity?: number }>).detail?.intensity ?? 0.5;
      burst(Math.min(1, Math.max(0.2, intensity)));
    };

    window.addEventListener("ttinker:disturb", onDisturb);
    scheduleAmbient();

    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
      timers.clear();
      window.removeEventListener("ttinker:disturb", onDisturb);
      reset();
    };
  }, []);

  return (
    <h1 ref={titleRef} className="hero-title">
      <span className="sr-only">TT1nKer</span>
      <span className="hero-title-visual" data-text="TT1NKER." aria-hidden="true">
        TT<span className="kinetic">1</span>NKER.
      </span>
    </h1>
  );
}
