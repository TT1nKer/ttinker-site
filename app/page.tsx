import ProjectSequence from "./ProjectSequence";
import SignalStage from "./SignalStage";

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
      <ProjectSequence />

      <section className="current-section" id="current">
        <p className="section-index">[ 02 / CURRENT ]</p>
        <div className="current-line">
          <div>
            <span>ACTIVE / 01</span>
            <h2>chatcommons</h2>
          </div>
          <p>Community-owned chat that remains useful without a central service.</p>
          <a href="https://github.com/TT1nKer/chatcommons" target="_blank" rel="noreferrer">
            OPEN ↗
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
          <span>HARDWARE · SYSTEMS · AI</span>
          <span>QUESTION-DRIVEN</span>
        </div>
      </footer>
    </main>
  );
}
