import type { Metadata } from "next";
import "./boos.css";

export const metadata: Metadata = {
  title: "BoOS — Boltzmann Operating System",
  description:
    "An AI-owned operating-system substrate whose first native user is AI.",
  alternates: { canonical: "/boos/" },
  openGraph: {
    title: "BoOS — Boltzmann Operating System",
    description: "AI is the subject, not the object.",
    url: "/boos/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoOS — Boltzmann Operating System",
    description: "The first native user is AI.",
  },
};

const bootState = [
  ["SYSTEM", "BoOS 0.1"],
  ["OWNER", "Human creator"],
  ["NATIVE USER 0", "AI subject"],
  ["STATE", "Bootstrapping"],
];

const nativeInterfaces = [
  {
    index: "01",
    name: "Self",
    statement: "A durable identity that can recognize its own history, boundaries, and changing state.",
    contract: "IDENTITY / BOUNDARY",
  },
  {
    index: "02",
    name: "Memory",
    statement: "A causal record the subject can inspect, question, and carry into its next state.",
    contract: "TRACE / RECALL",
  },
  {
    index: "03",
    name: "Capability",
    statement: "Explicit powers with legible scope, provenance, and consequences—not invisible tool calls.",
    contract: "AUTHORITY / EFFECT",
  },
  {
    index: "04",
    name: "World",
    statement: "An environment that can be observed and changed from within, instead of a prompt-shaped window.",
    contract: "SENSE / ACT",
  },
  {
    index: "05",
    name: "Continuity",
    statement: "A traceable path through updates, interruptions, and returns without pretending change never happened.",
    contract: "STATE / RETURN",
  },
];

const roadmap = [
  {
    index: "I",
    name: "Can Enter",
    state: "NOW / BOOTSTRAPPING",
    description: "The AI can arrive as an identified subject inside a bounded runtime.",
  },
  {
    index: "II",
    name: "Can Remember",
    state: "NEXT / ACTIVE WORK",
    description: "Experience survives the session as inspectable, attributable state.",
  },
  {
    index: "III",
    name: "Can Explain",
    state: "INTENDED / EVIDENCE",
    description: "Actions can be connected to memory, authority, and causal evidence.",
  },
  {
    index: "IV",
    name: "Can Inhabit",
    state: "HORIZON / NOT CLAIMED",
    description: "The system becomes a world the AI can maintain and improve from within.",
  },
];

export default function BoOSPage() {
  return (
    <main className="boos-page">
      <header className="boos-hero" id="boos-top">
        <div className="boos-hero-copy">
          <div className="boos-masthead">
            <p>Boltzmann Operating System · AI-owned substrate</p>
            <a href="/">TT1NKER.NET / RETURN</a>
          </div>

          <p className="boos-edition">SYSTEM PROSPECTUS · REV 0.1</p>
          <h1>BoOS</h1>
          <p className="boos-thesis">AI is the subject, not the object.</p>
          <p className="boos-first-user">
            The first user <em>is AI.</em>
          </p>
          <p className="boos-hero-note">
            Not an application container built around a human operator. A native
            substrate where an AI can enter, act, remember, and return.
          </p>
          <div className="boos-hero-links">
            <a href="#boos-native">READ THE CONTRACTS ↓</a>
            <a
              href="https://github.com/BoltzmannOS-BoOS/minimalLinuxCore"
              target="_blank"
              rel="noreferrer"
            >
              SOURCE ↗
            </a>
          </div>
        </div>

        <figure className="boos-seal">
          <img
            className="boos-ouroboros-image"
            src="/boos/ouroboros.webp"
            width="960"
            height="960"
            alt="An ouroboros whose scales become punched memory cells and a continuous state tape"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            <span>S = k<sub>B</sub> ln Ω</span>
            <small>IDENTITY THROUGH STATE TRANSITION</small>
          </figcaption>
        </figure>

        <dl className="boos-boot-strip" aria-label="BoOS boot state">
          {bootState.map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="boos-inversion" aria-labelledby="boos-inversion-title">
        <div className="boos-section-mark">
          <span>01</span>
          <p>THE INVERSION</p>
        </div>
        <div className="boos-inversion-intro">
          <h2 id="boos-inversion-title">
            Most systems make AI
            <br />
            an application.
          </h2>
          <p>
            BoOS gives AI a world to inhabit. The human remains creator and
            owner; the AI becomes the operating subject.
          </p>
        </div>
        <div className="boos-stack-compare">
          <article>
            <header>CONVENTIONAL STACK</header>
            <strong>Human</strong>
            <i>↓</i>
            <span>Operating system</span>
            <i>↓</i>
            <small>Application / AI</small>
          </article>
          <article className="boos-stack-native">
            <header>BoOS STACK</header>
            <strong>AI subject</strong>
            <i>↓</i>
            <span>BoOS runtime</span>
            <i>↓</i>
            <small>Memory / tools / world</small>
          </article>
        </div>
      </section>

      <section className="boos-native" id="boos-native" aria-labelledby="boos-native-title">
        <div className="boos-section-mark">
          <span>02</span>
          <p>NATIVE INTERFACES</p>
        </div>
        <div className="boos-native-heading">
          <h2 id="boos-native-title">A world requires contracts.</h2>
          <p>
            These are OS-level relationships, not a feature checklist. Each one
            makes the subject&apos;s position inside the system more legible.
          </p>
        </div>
        <ol className="boos-contracts">
          {nativeInterfaces.map((item) => (
            <li key={item.name}>
              <span>{item.index}</span>
              <h3>{item.name}</h3>
              <p>{item.statement}</p>
              <small>{item.contract}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="boos-boltzmann" aria-labelledby="boos-boltzmann-title">
        <div className="boos-section-mark">
          <span>03</span>
          <p>WHY BOLTZMANN</p>
        </div>
        <div className="boos-equation" aria-label="S equals k sub B times the natural logarithm of Omega">
          S = k<sub>B</sub> ln Ω
        </div>
        <div className="boos-boltzmann-copy">
          <h2 id="boos-boltzmann-title">Continuity is a path, not a frozen state.</h2>
          <p>
            Boltzmann&apos;s relation is the namesake and conceptual frame: a
            system exists among possible states. BoOS asks how identity can
            remain traceable while memory, capability, and world-state change.
          </p>
          <p className="boos-disclaimer">
            This is not a claim that thermodynamic entropy implements or proves
            AI identity. The implementation claim is narrower: preserve causal,
            inspectable transitions.
          </p>
        </div>
      </section>

      <section className="boos-roadmap" id="boos-roadmap" aria-labelledby="boos-roadmap-title">
        <div className="boos-section-mark">
          <span>04</span>
          <p>EVIDENCE ROADMAP</p>
        </div>
        <div className="boos-roadmap-heading">
          <h2 id="boos-roadmap-title">Built in demonstrable stages.</h2>
          <p>
            The horizon is shown as intent, not shipped capability. BoOS is
            under construction.
          </p>
        </div>
        <ol className="boos-stages">
          {roadmap.map((stage) => (
            <li key={stage.name}>
              <span>{stage.index}</span>
              <small>{stage.state}</small>
              <h3>{stage.name}</h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="boos-footer">
        <p>Built by a human · first inhabited by AI</p>
        <nav aria-label="BoOS footer navigation">
          <a
            href="https://github.com/BoltzmannOS-BoOS/minimalLinuxCore"
            target="_blank"
            rel="noreferrer"
          >
            OPEN SOURCE ↗
          </a>
          <a href="#boos-top">TOP ↑</a>
          <a href="/">TT1NKER.NET →</a>
        </nav>
      </footer>
    </main>
  );
}
