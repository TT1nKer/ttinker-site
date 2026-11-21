import { projects } from "./atlas-projects";

const issue = "https://github.com/TT1nKer/";
const notes = [
  ["chatcommons", "如果社区服务器关了，聊天记录还在谁手里？", issue + "chatcommons/blob/main/docs/governance/control-boundaries.md"],
  ["opensender", "一条连接跑不满带宽的时候，还能怎么传？", issue + "opensender"],
  ["fstCC", "从汇编开始，写一个 C 编译器要走多远？", issue + "fstCC"],
];

export default function Home() {
  const first = projects[0];
  return (
    <>
      <link rel="stylesheet" href="/home-atlas/home.css" />
      <script src="/home-atlas/plates.js" defer></script>
      <script src="/home-atlas/home.js" defer></script>
      <main id="top" className="atlas">
        <a href="#systems" className="atlas-skip">直接浏览项目</a>
        <div className="folio">
          <header className="navigation">
            <a className="domain" href="#top" aria-label="ttinker.net 首页"><i className="maker-mark" aria-hidden="true"></i>ttinker.net</a>
            <nav aria-label="主导航">
              <a href="#systems">项目</a>
              <a href="/liubai/">留白</a>
              <a lang="en" href="https://github.com/TT1nKer">GitHub</a>
            </nav>
          </header>

          <div className="mast">
            <h1 className="signature" aria-label="TT1nKer"><span>TT</span><i>1</i><span>nKer</span></h1>
            <div className="journal-teaser">
              <a className="teaser-section" href="/liubai/"><i className="journal-mark" aria-hidden="true"></i>留白<span>个人随记</span></a>
              <a data-latest-link className="latest-story" href="/liubai/">翻开随记</a>
              <time data-latest-date className="story-date"></time>
            </div>
          </div>

          <div className="spread" id="systems">
            <div className="exhibit">
              <figure className="instrument">
                <div className="plate-heading">
                  <strong className="plate-title" data-plate-heading>{first.title}</strong>
                  <span className="plate-tag">过程图解</span>
                </div>
                <div className="plate-stage">
                  <img className="first-plate" src="/home-atlas/first-plate.png" alt="" width="1200" height="514" />
                  <canvas data-plate role="img" aria-label={first.title}></canvas>
                </div>
                <figcaption className="transport" data-transport hidden>
                  <button type="button" className="play" data-play aria-label="播放图解" aria-pressed="false"><span aria-hidden="true"></span></button>
                  <span className="phase-caption" data-phase>{first.stage[1]}</span>
                  <input type="range" min="0" max="100" step="1" defaultValue="62" data-scrub aria-label="图解进度" />
                </figcaption>
              </figure>
              <div className="project-reading">
                {projects.map((p, i) => (
                  <article key={p.id} id={"reading-" + p.id} data-article={p.id} data-stages={JSON.stringify(p.stage)} data-category={p.category} hidden={i !== 0}>
                    <header className="reading-head">
                      <h2 data-project-title>{p.name}</h2>
                      <span className="category">{p.category}</span>
                    </header>
                    <span data-question hidden>{p.title}</span>
                    <p className="project-body">{p.body}</p>
                    <div className="destinations">
                      {p.links.map(link => <a className="resource-link" href={link.href} key={link.href}>{link.label}</a>)}
                    </div>
                    <details className="specs">
                      <summary>技术细节</summary>
                      <dl>{p.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                      {"footnote" in p && p.footnote && <p>{p.footnote}</p>}
                    </details>
                  </article>
                ))}
              </div>
            </div>

            <span className="atlas-visually-hidden" role="status" data-selection-status></span>
            <aside className="ledger" aria-label="项目目录">
              <div className="ledger-head"><h2>项目目录</h2><span>{String(projects.length).padStart(2, "0")} 项</span></div>
              <ol className="rows">
                {projects.map((p, i) => (
                  <li key={p.id}>
                    <a data-project={p.id} href={p.links[0].href} aria-controls={"reading-" + p.id} aria-current={i === 0 ? "true" : undefined} className="project-row">
                      <span className="project-name" lang="en">{p.name}</span><span className="row-caption">{p.category}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <section id="notes" className="field-notes" aria-labelledby="notes-title">
            <div className="notes-heading"><h2 id="notes-title">手头的问题</h2></div>
            <div className="note-list">{notes.map(([project, title, href]) => (
              <a href={href} key={project}><span>{project}</span><strong>{title}</strong></a>
            ))}</div>
          </section>

          <footer className="colophon">
            <span>TT1nKer</span>
            <nav aria-label="页脚"><a href="/liubai/">留白博客</a><a href="https://github.com/TT1nKer">GitHub</a><a href="#top">回到页首</a></nav>
          </footer>
        </div>
      </main>
    </>
  );
}
