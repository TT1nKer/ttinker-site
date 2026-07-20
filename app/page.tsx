const projects = [
  {
    index: "01",
    name: "BoOS",
    area: "AI × SYSTEMS",
    description:
      "一个 AI-native 的操作系统层：让 agent 拥有记忆、意图、权限与可审计行动，而不只是住在应用层。",
    detail: "Linux · Agents · Rust",
    href: "https://github.com/BoltzmannOS-BoOS/BoOS",
    featured: true,
  },
  {
    index: "02",
    name: "fstCC",
    area: "FROM ZERO",
    description:
      "用手写 RISC-V 汇编自举一个 C 编译器。没有 libc，没有 LLVM，Stage 0 已通过 39/39 测试。",
    detail: "RISC-V · Assembly · Compilers",
    href: "https://github.com/TT1nKer/fstCC",
  },
  {
    index: "03",
    name: "adaptiveNet",
    area: "COMPLEX SYSTEMS",
    description:
      "在浏览器里探索 Gray–Scott、Hopfield、Ising、脉冲神经元与图灵斑图，让方程变成可触摸的直觉。",
    detail: "TypeScript · Dynamics · WebGL",
    href: "https://github.com/TT1nKer/adaptiveNet",
  },
  {
    index: "04",
    name: "Model Brain Surgery",
    area: "MECHANISTIC AI",
    description:
      "对 Transformer 做维度手术：知识分离、persona 向量、方向消融与实时记忆编辑。",
    detail: "Python · Transformers · Ablation",
    href: "https://github.com/TT1nKer/model-brain-surgery-lab",
  },
  {
    index: "05",
    name: "opensender",
    area: "NETWORKS",
    description:
      "为高延迟链路设计的并发文件传输器。在真实跨境链路上，把单流基线提升约 170 倍。",
    detail: "Go · HTTP Range · Systems",
    href: "https://github.com/TT1nKer/opensender",
  },
  {
    index: "06",
    name: "After Branching",
    area: "SPECULATIVE FICTION",
    description:
      "一部关于制度如何繁殖、竞争与吞噬的科幻设定：当文明成为超有机体，异议就是它的感觉器官。",
    detail: "Worldbuilding · Institutions · Sci-fi",
    href: "https://github.com/TT1nKer/after-branching",
  },
];

const signals = [
  ["AI-native systems", "让 AI 从工具变成有边界、有记忆、可问责的系统主体。"],
  ["Mechanisms, not magic", "我更关心模型内部发生了什么，以及怎样用实验把它拆开。"],
  ["Build from first principles", "从 bootloader、RTOS、PCB 到编译器；理解一层的最好方式是亲手造一遍。"],
  ["Ideas need a body", "一个概念只有变成程序、设备、交互或故事，才真正开始接受现实的检验。"],
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
          <a href="#signal">SIGNAL</a>
          <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> COMPUTER ENGINEERING · BUILDER · TT1NKER</p>
          <h1>
            BUILDING BETWEEN
            <span>SILICON &amp; THOUGHT.</span>
          </h1>
          <p className="hero-intro">
            我在硬件、底层系统、复杂网络与人工智能之间工作。喜欢从第一性原理出发，
            把还没有名字的想法做成可以运行、可以测量、也可以被质疑的东西。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#work">查看实验 / VIEW WORK <b>↘</b></a>
            <a className="text-link" href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">github.com/TT1nKer ↗</a>
          </div>
        </div>

        <div className="system-visual" aria-hidden="true">
          <div className="coordinate top">N 43.6532°</div>
          <div className="coordinate bottom">E 79.3832°</div>
          <div className="orbit orbit-one"><i /><i /><i /></div>
          <div className="orbit orbit-two"><i /><i /></div>
          <div className="core">
            <span>TT1</span>
            <small>SYS.RUN</small>
          </div>
          <div className="axis axis-x" />
          <div className="axis axis-y" />
          <p>THE SYSTEM IS THE MEDIUM</p>
        </div>

        <div className="hero-stats" aria-label="GitHub 公开数据快照">
          <div><strong>60</strong><span>PUBLIC REPOS</span></div>
          <div><strong>324</strong><span>CONTRIBUTIONS / YR</span></div>
          <div><strong>∞</strong><span>CURIOSITY BUDGET</span></div>
        </div>
      </section>

      <section className="ticker" aria-label="关注领域">
        <span>EMBEDDED SYSTEMS</span><i>◆</i><span>AI AGENTS</span><i>◆</i>
        <span>COMPLEX NETWORKS</span><i>◆</i><span>COMPILERS</span><i>◆</i>
        <span>SPECULATIVE WORLDS</span><i>◆</i><span>HARDWARE</span>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div>
            <p className="section-index">[ 01 / SELECTED EXPERIMENTS ]</p>
            <h2>THINGS I’VE<br />MADE REAL.</h2>
          </div>
          <p>不是作品集，而是一组持续生长的实验。<br />每一个都从一个“如果……”开始。</p>
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
          浏览全部 60 个公开仓库 <span>ALL REPOSITORIES ↗</span>
        </a>
      </section>

      <section className="signal-section" id="signal">
        <div className="section-heading inverse">
          <div>
            <p className="section-index">[ 02 / OPERATING SIGNAL ]</p>
            <h2>WHAT I KEEP<br />RETURNING TO.</h2>
          </div>
          <p>看似分散的项目背后，<br />其实反复出现的是同几个问题。</p>
        </div>

        <div className="signal-list">
          {signals.map(([title, description], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <blockquote>
          <span>“</span>
          <p>我不是在追逐某一项技术。<br />我在追问：一个系统何时开始拥有自己的行为？</p>
          <footer>— A QUESTION ACROSS CODE, CIRCUITS &amp; CIVILIZATIONS</footer>
        </blockquote>
      </section>

      <section className="now-section">
        <p className="section-index">[ 03 / CURRENT VECTOR ]</p>
        <div className="now-grid">
          <h2>NOW,<br />NEXT.</h2>
          <div className="now-copy">
            <p>
              当前在探索 <strong>AI-native operating systems</strong>、agent memory 与权限边界，
              也继续把 Transformer 当成一台可以打开盖子研究的机器。
            </p>
            <div className="now-tags">
              <span>BOOS / STAGE 0</span><span>MODEL SURGERY</span><span>AGENT RUNTIME</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p>HAVE A STRANGE PROBLEM?</p>
          <h2>LET’S MAKE IT<br />OBSESSIVELY REAL.</h2>
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
