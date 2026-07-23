"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import ProjectVisual from "./ProjectVisual";

const projects = [
  {
    index: "01",
    name: "chatcommons",
    area: "ACTIVE PROTOCOL",
    description: "Open, offline-first protocol for community-owned chat.",
    detail: "Rust · Protocols · Offline-first",
    href: "https://github.com/TT1nKer/chatcommons",
    signal: "mesh",
    readout: "PEERS / LOCAL",
  },
  {
    index: "02",
    name: "opensender",
    area: "WORKING TOOL",
    description: "Parallel, resumable transfer across high-latency links.",
    detail: "Go · HTTP Range · Networking",
    href: "https://github.com/TT1nKer/opensender",
    signal: "transfer",
    readout: "RANGE / RESUME",
  },
  {
    index: "03",
    name: "adaptiveNet",
    area: "BROWSER LAB",
    description: "Node-edge dynamical systems with live controls.",
    detail: "TypeScript · Dynamics · WebGL",
    href: "https://github.com/TT1nKer/adaptiveNet",
    signal: "field",
    readout: "STATE / EVOLVE",
  },
  {
    index: "04",
    name: "Model Brain Surgery",
    area: "EXPERIMENT",
    description: "Ablation, persona vectors, and live memory editing.",
    detail: "Python · Transformers · Ablation",
    href: "https://github.com/TT1nKer/model-brain-surgery-lab",
    signal: "ablation",
    readout: "VECTOR / CUT",
  },
  {
    index: "05",
    name: "fstCC",
    area: "39 / 39 TESTS",
    description: "A tiny C compiler bootstrapped in RISC-V assembly.",
    detail: "RISC-V · Assembly · Compilers",
    href: "https://github.com/TT1nKer/fstCC",
    signal: "compiler",
    readout: "L0 → RV64",
  },
  {
    index: "06",
    name: "StockItsMygo",
    area: "HOBBY TOOL",
    description: "A personal market-watching dashboard.",
    detail: "Python · PostgreSQL · Data",
    href: "https://github.com/TT1nKer/StockItsMygo",
    signal: "market",
    readout: "WATCH / FILTER",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Project = (typeof projects)[number];
type Signal = "mesh" | "transfer" | "field" | "ablation" | "compiler" | "market";

export default function ProjectSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    let frame = 0;
    let previousIndex = 0;

    const update = () => {
      frame = 0;
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-section.getBoundingClientRect().top / range, 0, 1);
      const scaled = progress * (projects.length - 1);
      const index = clamp(Math.floor(scaled), 0, projects.length - 1);
      const local = index === projects.length - 1 ? 0 : clamp(scaled - index, 0, 1);

      section.style.setProperty("--work-progress", progress.toFixed(5));
      if (index !== previousIndex) {
        section.dataset.direction = index > previousIndex ? "forward" : "backward";
        previousIndex = index;
        setActiveIndex(index);
        frame = requestAnimationFrame(update);
        return;
      }
      section.style.setProperty("--project-local", local.toFixed(5));
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (reduced) return;
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const range = section.offsetHeight - window.innerHeight;
    const top = section.offsetTop + index / (projects.length - 1) * range;
    window.scrollTo({ top, behavior: "auto" });
  };

  const project = projects[activeIndex];
  const nextProject = projects[activeIndex + 1];

  const renderProject = (item: Project, role: "current" | "next") => (
    <article
      className={`project-focus is-${role}`}
      key={`${role}-${item.name}`}
      aria-hidden={role === "next"}
    >
      <div className="project-copy">
        <p className="project-status">{item.area}</p>
        <h2>{item.name}</h2>
        <p className="project-description">{item.description}</p>
        <div className="project-detail">
          <span>{item.detail}</span>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            tabIndex={role === "next" ? -1 : undefined}
          >
            OPEN REPOSITORY <b>↗</b>
          </a>
        </div>
      </div>

      <div className="project-observation" data-signal={item.signal} aria-hidden="true">
        <span className="observation-readout">{item.readout}</span>
        <strong>{item.index}</strong>
        <ProjectVisual signal={item.signal as Signal} />
      </div>
    </article>
  );

  if (reducedMotion) {
    return (
      <section className="project-static" id="work">
        <p>[ 01 / OWN REPOSITORIES ]</p>
        {projects.map((item) => (
          <article key={item.name}>
            <span>{item.index} / {item.area}</span>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <a href={item.href} target="_blank" rel="noreferrer">OPEN REPOSITORY ↗</a>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section
      className="project-sequence"
      id="work"
      ref={sectionRef}
      data-direction="forward"
      style={{ "--project-count": projects.length } as CSSProperties}
    >
      <div className="project-stage">
        <div className="project-atmospheres" aria-hidden="true">
          <i className="project-atmosphere is-current" data-signal={project.signal} />
          {nextProject && (
            <i className="project-atmosphere is-next" data-signal={nextProject.signal} />
          )}
        </div>

        <div className="project-stage-head">
          <p>[ 01 / OWN REPOSITORIES ]</p>
          <div className="project-counter" aria-hidden="true">
            <span className="is-current">{project.index}</span>
            {nextProject && <span className="is-next">{nextProject.index}</span>}
            <b>/ {String(projects.length).padStart(2, "0")}</b>
          </div>
        </div>

        <div className="project-motion-window">
          {renderProject(project, "current")}
          {nextProject && renderProject(nextProject, "next")}
        </div>

        <div className="project-stage-foot">
          <ol aria-label="选择项目">
            {projects.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => jumpTo(index)}
                  aria-current={index === activeIndex ? "true" : undefined}
                  aria-label={`${item.index} ${item.name}`}
                >
                  <span>{item.index}</span>
                  <i />
                </button>
              </li>
            ))}
          </ol>
          <span className="scroll-instruction">SCROLL / EXAMINE</span>
          <a href="https://github.com/TT1nKer?tab=repositories" target="_blank" rel="noreferrer">
            ALL REPOSITORIES ↗
          </a>
        </div>
        <div className="project-progress" aria-hidden="true"><i /></div>
      </div>

      <div className="project-scroll-space" aria-hidden="true">
        {projects.map((project) => <i key={project.name} />)}
      </div>
    </section>
  );
}
