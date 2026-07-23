"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import GlitchTitle from "./GlitchTitle";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const disturb = (intensity: number) => {
  window.dispatchEvent(
    new CustomEvent("ttinker:disturb", {
      detail: { intensity: clamp(intensity, 0.2, 1) },
    }),
  );
};

export default function SignalStage() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0, speed: 0, progress: 0, scroll: 0 };
    const current = { ...target };
    let frame = 0;
    let previousFrame = 0;
    let previousPointer = { x: 0, y: 0, time: 0 };
    let lastBurst = 0;

    const render = (time: number) => {
      const delta = clamp((time - previousFrame) / 1000 || 1 / 60, 1 / 240, 0.05);
      previousFrame = time;
      const direct = 1 - Math.exp(-delta * 13);
      const trailing = 1 - Math.exp(-delta * 7);

      current.x += (target.x - current.x) * direct;
      current.y += (target.y - current.y) * direct;
      current.speed += (target.speed - current.speed) * trailing;
      current.progress += (target.progress - current.progress) * trailing;
      current.scroll += (target.scroll - current.scroll) * trailing;
      target.speed *= Math.exp(-delta * 8);

      stage.style.setProperty("--signal-x", current.x.toFixed(4));
      stage.style.setProperty("--signal-y", current.y.toFixed(4));
      stage.style.setProperty("--signal-speed", current.speed.toFixed(4));
      stage.style.setProperty("--stage-progress", current.progress.toFixed(4));
      stage.style.setProperty("--hero-scroll", current.scroll.toFixed(4));
      stage.dataset.stage = String(clamp(Math.round(current.progress * 4), 0, 4));

      const unsettled =
        Math.abs(target.x - current.x) +
          Math.abs(target.y - current.y) +
          Math.abs(target.speed - current.speed) +
          Math.abs(target.progress - current.progress) +
          Math.abs(target.scroll - current.scroll) >
        0.004;

      frame = unsettled ? requestAnimationFrame(render) : 0;
    };

    const start = () => {
      if (!frame) {
        previousFrame = performance.now();
        frame = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" && !event.isPrimary) return;
      const bounds = stage.getBoundingClientRect();
      const localX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const localY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      const now = performance.now();
      const elapsed = Math.max(16, now - previousPointer.time);
      const distance = Math.hypot(
        event.clientX - previousPointer.x,
        event.clientY - previousPointer.y,
      );
      const velocity = clamp(distance / elapsed / 1.2, 0, 1);

      previousPointer = { x: event.clientX, y: event.clientY, time: now };
      target.x = (localX - 0.5) * 2;
      target.y = (localY - 0.5) * 2;
      target.speed = Math.max(target.speed, velocity);
      target.progress = localX;
      stage.style.setProperty("--probe-left", `${(localX * 100).toFixed(2)}%`);
      stage.style.setProperty("--probe-top", `${(localY * 100).toFixed(2)}%`);
      stage.dataset.engaged = "true";

      if (velocity > 0.34 && now - lastBurst > 480) {
        lastBurst = now;
        disturb(0.35 + velocity * 0.65);
      }
      start();
    };

    const onPointerDown = (event: PointerEvent) => {
      onPointerMove(event);
      disturb(0.88);
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
      target.speed = 0;
      target.progress = target.scroll;
      stage.dataset.engaged = "false";
      start();
    };

    const onScroll = () => {
      const progress = clamp(window.scrollY / Math.max(1, stage.offsetHeight * 0.92), 0, 1);
      target.scroll = progress;
      if (stage.dataset.engaged !== "true") target.progress = progress;
      start();
    };

    const onVisibility = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        start();
      }
    };

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={stageRef} data-stage="0" data-engaged="false">
      <div className="signal-probe" aria-hidden="true"><i /></div>

      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> TT1NKER · COMPUTER ENGINEERING</p>
        <GlitchTitle />
        <span className="chromatic-rule" aria-hidden="true" />
        <p className="hero-intro">SYSTEM ENGINEER / SYSTEM ARTIST</p>
        <div className="hero-actions">
          <a className="hero-link" href="#work">浏览项目 / EXPLORE <b>↓</b></a>
          <a className="text-link" href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">github.com/TT1nKer ↗</a>
        </div>
      </div>

      <button
        className="hero-emblem"
        type="button"
        aria-label="扰动 TT1nKer 信号"
        onClick={() => disturb(1)}
      >
        <Image
          src="/icon-tt-question-transparent-v2.png"
          alt=""
          width={512}
          height={512}
          priority
          unoptimized
        />
      </button>

      <div className="process-loop" aria-label="从想法到新问题的实验循环">
        <div className="process-step"><small>01</small><span>IDEA</span></div>
        <div className="process-step"><small>02</small><span>PROMPT</span></div>
        <div className="process-step"><small>03</small><span>CODE</span></div>
        <div className="process-step"><small>04</small><span>TEST</span></div>
        <div className="process-step question"><small>05</small><span>?</span></div>
        <i className="process-pulse" aria-hidden="true" />
      </div>
    </section>
  );
}
