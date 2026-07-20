const projects = [
  {
    index: "01",
    name: "chatcommons",
    area: "EARLY / ACTIVE",
    description:
      "一个社区自有、offline-first 的聊天协议。还很早期，但我最近确实在认真做它。",
    detail: "Rust · Protocols · Offline-first",
    href: "https://github.com/TT1nKer/chatcommons",
    featured: true,
  },
  {
    index: "02",
    name: "opensender",
    area: "WORKING TOOL",
    description:
      "跨境传文件太慢，所以写了一个高并发传输工具。它解决了我的问题，顺便让我补了很多网络课。",
    detail: "Go · HTTP Range · Networking",
    href: "https://github.com/TT1nKer/opensender",
  },
  {
    index: "03",
    name: "adaptiveNet",
    area: "PLAYGROUND",
    description:
      "把 Gray–Scott、Hopfield、Ising 和脉冲神经元塞进浏览器。更像一个会动的学习笔记，不是严肃研究。",
    detail: "TypeScript · Dynamics · WebGL",
    href: "https://github.com/TT1nKer/adaptiveNet",
  },
  {
    index: "04",
    name: "Model Brain Surgery",
    area: "EXPERIMENT / WIP",
    description:
      "一些关于模型消融、persona 向量和记忆编辑的实验脚手架。主要用来验证脑洞，结论还在路上。",
    detail: "Python · Transformers · Ablation",
    href: "https://github.com/TT1nKer/model-brain-surgery-lab",
  },
  {
    index: "05",
    name: "fstCC",
    area: "LEARNING PROJECT",
    description:
      "试着用 RISC-V 汇编自举一个很小的 C 编译器。测试能跑，但它更像一次从零理解编译器的练习。",
    detail: "RISC-V · Assembly · Compilers",
    href: "https://github.com/TT1nKer/fstCC",
  },
  {
    index: "06",
    name: "StockItsMygo",
    area: "HOBBY PROJECT",
    description:
      "个人股票观察 dashboard：watchlist、指标筛选和一些数据管道。写着玩，不构成任何投资建议。",
    detail: "Python · PostgreSQL · Data",
    href: "https://github.com/TT1nKer/StockItsMygo",
  },
];

const signals = [
  ["Follow the rabbit hole", "我经常因为一个小问题突然开仓库。它不一定有用，但通常能让我学会点东西。"],
  ["Vibe code, honestly", "大量代码是和 AI 一起写的。我负责提问题、做取舍、测试，以及在它胡说时把方向拽回来。"],
  ["Prototype before expertise", "我不会等到“够资格”才开始。很多项目就是我理解一个陌生领域的方法。"],
  ["It’s okay to leave things WIP", "有些仓库会长成工具，有些只留下一个能跑的想法。两种都算数。"],
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
          <p className="eyebrow"><span className="status-dot" /> COMPUTER ENGINEERING STUDENT · CURIOUS GENERALIST</p>
          <h1>
            I MAKE THINGS.
            <span>MOSTLY WITH AI.</span>
          </h1>
          <p className="hero-intro">
            我不是什么全栈大神。大部分项目都是边学边做，也让 AI 写了很多代码；
            有些真的能用，有些只是一个想法长出了仓库。这里放的是我最近折腾过的东西。
          </p>
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
          <div className="core">
            <span>TT1</span>
            <small>SYS.RUN</small>
          </div>
          <div className="axis axis-x" />
          <div className="axis axis-y" />
          <p>PROBABLY OVERTHINKING IT</p>
        </div>

        <div className="hero-stats" aria-label="GitHub 公开数据快照">
          <div><strong>60</strong><span>REPOS, FORKS INCLUDED</span></div>
          <div><strong>WIP</strong><span>DEFAULT STATUS</span></div>
          <div><strong>AI</strong><span>PAIR PROGRAMMER</span></div>
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
            <p className="section-index">[ 01 / RECENT RABBIT HOLES ]</p>
            <h2>THINGS I’VE<br />MESSED WITH.</h2>
          </div>
          <p>不是精选代表作，也不保证做完。<br />只是目前还愿意公开给人看的几个仓库。</p>
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
          包括 fork、旧坑和黑历史 <span>ALL 60 REPOSITORIES ↗</span>
        </a>
      </section>

      <section className="signal-section" id="signal">
        <div className="section-heading inverse">
          <div>
            <p className="section-index">[ 02 / HONEST WORKFLOW ]</p>
            <h2>HOW I ACTUALLY<br />MAKE THINGS.</h2>
          </div>
          <p>没有神秘方法论。<br />大概就是好奇、AI、测试，然后继续改。</p>
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
          <p>我做这些不是因为已经会了。<br />恰恰是因为不会。</p>
          <footer>— LEARNING IN PUBLIC, WITH A LOT OF GENERATED CODE</footer>
        </blockquote>
      </section>

      <section className="now-section">
        <p className="section-index">[ 03 / CURRENTLY MESSING WITH ]</p>
        <div className="now-grid">
          <h2>NOW,<br />MAYBE.</h2>
          <div className="now-copy">
            <p>
              最近主要在做 <strong>chatcommons</strong>，想看看社区自有、离线优先的聊天协议能长成什么样；
              旁边还开着一些 agent、硬件和模型实验，不保证哪个先填完。
            </p>
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
