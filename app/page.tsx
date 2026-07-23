import SignalStage from "./SignalStage";

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
    featured: true,
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

function ProjectInstrument({ signal, readout }: { signal: string; readout: string }) {
  return (
    <div className="project-instrument" data-signal={signal} aria-hidden="true">
      <span className="instrument-readout">{readout}</span>
      <div className="instrument-field">
        {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="site-mark" href="#top" aria-label="TT1nKer 首页">TT1?</a>
        <nav aria-label="主导航">
          <a href="#work">PROJECTS</a>
          <a href="#current">CURRENT</a>
          <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </nav>
      </header>

      <SignalStage />

      <section className="field-strip" aria-label="关注领域">
        <span>EMBEDDED SYSTEMS</span><i>◆</i>
        <span>AI AGENTS</span><i>◆</i>
        <span>COMPLEX NETWORKS</span><i>◆</i>
        <span>COMPILERS</span><i>◆</i>
        <span>SPECULATIVE WORLDS</span><i>◆</i>
        <span>HARDWARE</span>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div>
            <p className="section-index">[ 01 / OWN REPOSITORIES ]</p>
            <h2>PROJECTS.</h2>
          </div>
          <p className="section-note">Six things that currently have code,<br />tests, or a working surface.</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              className={`project-card${project.featured ? " featured" : ""}`}
              data-index={project.index}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={project.name}
            >
              <div className="project-meta">
                <span>{project.index}</span>
                <span>{project.area}</span>
              </div>
              <ProjectInstrument signal={project.signal} readout={project.readout} />
              <div className="project-body">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <div className="project-foot">
                <span>{project.detail}</span><b>↗</b>
              </div>
            </a>
          ))}
        </div>
        <a className="all-projects" href="https://github.com/TT1nKer?tab=repositories" target="_blank" rel="noreferrer">
          ALL REPOSITORIES <span>GITHUB ↗</span>
        </a>
      </section>

      <section className="current-section" id="current">
        <div className="current-heading">
          <p className="section-index">[ 02 / CURRENT INPUT ]</p>
          <span>ACTIVE / 01</span>
        </div>
        <div className="current-grid">
          <div>
            <p className="current-name">chatcommons</p>
            <h2>LOCAL FIRST.<br />OPEN PROTOCOL.</h2>
          </div>
          <div className="current-copy">
            <p>Community-owned chat that remains useful without a central service.</p>
            <a href="https://github.com/TT1nKer/chatcommons" target="_blank" rel="noreferrer">
              OPEN REPOSITORY <span>↗</span>
            </a>
          </div>
          <div className="current-signal" aria-hidden="true">
            {Array.from({ length: 20 }, (_, index) => <i key={index} />)}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-wordmark" href="#top">TT1NKER.NET</a>
        <div className="footer-links">
          <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">GITHUB ↗</a>
          <a href="#top">TOP ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TT1nKer</span>
          <span>HARDWARE · SYSTEMS · AI</span>
          <span>QUESTION-DRIVEN</span>
        </div>
      </footer>
    </main>
  );
}
