import SignalStage from "./SignalStage";
import SystemsArchive from "./SystemsArchive";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="site-mark" href="#top" aria-label="TT1nKer 首页">TT1?</a>
        <nav aria-label="主导航">
          <a href="#systems">SYSTEMS</a>
          <a href="#notes">NOTES</a>
          <a href="https://github.com/TT1nKer" target="_blank" rel="noreferrer">GITHUB ↗</a>
        </nav>
      </header>

      <SignalStage />
      <SystemsArchive />

      <section className="field-notes" id="notes" aria-labelledby="field-notes-title">
        <div className="field-notes-head">
          <p>[ 03 / FIELD NOTES ]</p>
          <h2 id="field-notes-title">Questions before conclusions.</h2>
        </div>
        <div className="notes-list">
          <a
            href="https://github.com/TT1nKer/chatcommons/blob/main/docs/governance/control-boundaries.md"
            target="_blank"
            rel="noreferrer"
          >
            <span>NETWORKS / 001</span>
            <strong>What must remain true when a community server disappears?</strong>
            <i>↗</i>
          </a>
          <a
            href="https://github.com/TT1nKer/opensender"
            target="_blank"
            rel="noreferrer"
          >
            <span>TRANSFER / 002</span>
            <strong>When does one TCP stream become the bottleneck?</strong>
            <i>↗</i>
          </a>
          <a
            href="https://github.com/TT1nKer/fstCC"
            target="_blank"
            rel="noreferrer"
          >
            <span>COMPILERS / 003</span>
            <strong>How little machinery does a C compiler need?</strong>
            <i>↗</i>
          </a>
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
          <span>PROTOCOLS · RUNTIMES · STRANGE MACHINES</span>
          <span>QUESTION-DRIVEN</span>
        </div>
      </footer>
    </main>
  );
}
