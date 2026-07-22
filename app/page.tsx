import GlitchTitle from "./GlitchTitle";

const projects = [
  {
    index: "01",
    name: "chatcommons",
    area: "EARLY / ACTIVE",
    description: "Community-owned, offline-first chat.",
    detail: "Rust · Protocols · Offline-first",
    href: "https://github.com/TT1nKer/chatcommons",
    featured: true,
  },
  {
    index: "02",
    name: "opensender",
    area: "WORKING TOOL",
    description: "High-concurrency transfer for slow, high-latency links.",
    detail: "Go · HTTP Range · Networking",
    href: "https://github.com/TT1nKer/opensender",
  },
  {
    index: "03",
    name: "adaptiveNet",
    area: "PLAYGROUND",
    description: "Dynamical systems, live in the browser.",
    detail: "TypeScript · Dynamics · WebGL",
    href: "https://github.com/TT1nKer/adaptiveNet",
  },
  {
    index: "04",
    name: "Model Brain Surgery",
    area: "EXPERIMENT / WIP",
    description: "Ablation, persona vectors, memory editing.",
    detail: "Python · Transformers · Ablation",
    href: "https://github.com/TT1nKer/model-brain-surgery-lab",
  },
  {
    index: "05",
    name: "fstCC",
    area: "LEARNING PROJECT",
    description: "A tiny C compiler bootstrapped in RISC-V assembly.",
    detail: "RISC-V · Assembly · Compilers",
    href: "https://github.com/TT1nKer/fstCC",
  },
  {
    index: "06",
    name: "StockItsMygo",
    area: "HOBBY PROJECT",
    description: "A personal market-watching dashboard.",
    detail: "Python · PostgreSQL · Data",
    href: "https://github.com/TT1nKer/StockItsMygo",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <nav aria-label="主导航">
          <a href="#work">WORK</a>
          <a href="#now">NOW</a>
          <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> TT1NKER · COMPUTER ENGINEERING</p>
          <GlitchTitle />
          <span className="chromatic-rule" aria-hidden="true" />
          <p className="hero-intro">硬件、系统、AI。持续试验。</p>
          <div className="hero-actions">
            <a className="primary-button" href="#work">随便看看 / BROWSE AROUND <b>↘</b></a>
            <a className="text-link" href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">github.com/TT1nKer ↗</a>
          </div>
        </div>

        <a className="hero-emblem" href="#top" aria-label="TT1nKer 标志，返回顶部">
          <img src="/icon-tt-question-v1.png" alt="" />
        </a>

        <div className="process-loop" aria-label="创作循环">
          <div className="process-step"><small>01</small><span>IDEA</span></div>
          <div className="process-step"><small>02</small><span>PROMPT</span></div>
          <div className="process-step"><small>03</small><span>CODE</span></div>
          <div className="process-step"><small>04</small><span>TEST</span></div>
          <div className="process-step question"><small>05</small><span>?</span></div>
          <i className="process-pulse" />
        </div>
      </section>

      <section className="ticker" aria-label="关注领域">
        <div className="ticker-track">
          <div className="ticker-group">
            <span>EMBEDDED SYSTEMS</span><i>◆</i><span>AI AGENTS</span><i>◆</i>
            <span>COMPLEX NETWORKS</span><i>◆</i><span>COMPILERS</span><i>◆</i>
            <span>SPECULATIVE WORLDS</span><i>◆</i><span>HARDWARE</span><i>◆</i>
          </div>
          <div className="ticker-group" aria-hidden="true">
            <span>EMBEDDED SYSTEMS</span><i>◆</i><span>AI AGENTS</span><i>◆</i>
            <span>COMPLEX NETWORKS</span><i>◆</i><span>COMPILERS</span><i>◆</i>
            <span>SPECULATIVE WORLDS</span><i>◆</i><span>HARDWARE</span><i>◆</i>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div>
            <p className="section-index">[ 01 / SELECTED REPOS ]</p>
            <h2>RECENT<br />WORK.</h2>
          </div>
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
              <div className="project-body">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <div className="project-wave" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i />
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

      <section className="now-section" id="now">
        <p className="section-index">[ 02 / NOW ]</p>
        <div className="now-grid">
          <h2>NOW.</h2>
          <div className="now-copy">
            <p><strong>chatcommons</strong> — community-owned, offline-first chat.</p>
            <div className="now-tags">
              <span>CHATCOMMONS</span><span>MODEL EXPERIMENTS</span><span>HARDWARE SIDE QUESTS</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p>GOT A WEIRD IDEA?</p>
          <h2>SEND IT<br />MY WAY.</h2>
        </div>
        <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">START WITH GITHUB <span>↗</span></a>
        <div className="footer-bottom">
          <span>© 2026 TT1nKer</span>
          <span>ENGINEERED WITH CURIOSITY</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
