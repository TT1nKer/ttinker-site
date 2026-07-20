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
        <a className="wordmark" href="#top" aria-label="返回顶部">
          TT<span>1</span>nKer
        </a>
        <nav aria-label="主导航">
          <a href="#work">WORK</a>
          <a href="#now">NOW</a>
          <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> TT1NKER · COMPUTER ENGINEERING</p>
          <h1>
            THINGS IN
            <span className="kinetic" data-text="PROGRESS.">PROGRESS.</span>
          </h1>
          <p className="hero-intro">硬件、系统、AI。持续试验。</p>
          <div className="hero-actions">
            <a className="primary-button" href="#work">随便看看 / BROWSE AROUND <b>↘</b></a>
            <a className="text-link" href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">github.com/TT1nKer ↗</a>
          </div>
        </div>

        <div className="system-visual" aria-hidden="true">
          <div className="coordinate top">N 43.6532°</div>
          <div className="coordinate bottom">E 79.3832°</div>
          <div className="orbit orbit-one"><i /><i /><i /></div>
          <div className="orbit orbit-two"><i /><i /></div>
          <div className="signal-ring" />
          <div className="runner runner-a" />
          <div className="runner runner-b" />
          <div className="core">
            <span>TT1</span>
            <small>SYS.RUN</small>
          </div>
          <div className="axis axis-x" />
          <div className="axis axis-y" />
          <p>PROBABLY OVERTHINKING IT</p>
        </div>

        <div className="telemetry-rail" aria-hidden="true">
          <span>01 / BUILD</span><span>02 / BREAK</span><span>03 / REPEAT</span>
        </div>

        <div className="hero-stats" aria-label="GitHub 公开数据快照">
          <div><strong>60</strong><span>PUBLIC REPOS</span></div>
          <div><strong>WIP</strong><span>CURRENT STATE</span></div>
          <div><strong>AI</strong><span>TOOL OF CHOICE</span></div>
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
