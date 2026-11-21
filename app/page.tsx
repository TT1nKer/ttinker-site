import { compilerSample as sample, type CompilerCorrespondenceRow } from "./compiler-sample";
import TransferStudy from "./TransferStudy";

const github = "https://github.com/TT1nKer";
const compiler = github + "/fstCC";
const studies = [
  { id: "chatcommons", name: "ChatCommons", field: "Distributed systems", description: "An offline-first chat protocol. Devices sign their own events and exchange them over QUIC, directly or through a relay.", link: github + "/chatcommons/blob/main/docs/protocol.md", action: "Read the protocol", repo: github + "/chatcommons" },
  { id: "hwine", name: "hwine", field: "Hardware synthesis", description: "An FPGA arithmetic optimizer that generates SystemVerilog circuits, checks equivalence, and compares area and timing.", link: github + "/hwine/blob/main/docs/PROJECT_STATUS.md", action: "See the results", repo: github + "/hwine" },
  { id: "adaptiveNet", name: "adaptiveNet", field: "Scientific computing", description: "Eleven browser experiments in dynamical systems, from reaction–diffusion patterns to Hopfield memory.", link: "https://tt1nker.github.io/adaptiveNet/index.html", action: "Open the lab", repo: github + "/adaptiveNet" },
  { id: "solar", name: "solar", field: "Orbital mechanics", description: "A C++17 orbital mechanics sandbox. The Earth–Mars transfer example compares the computed trajectory with reference values.", link: github + "/solar/blob/main/docs/validation/02_hohmann_earth_mars.md", action: "Read the calculation", repo: github + "/solar" },
  { id: "BoOS", name: "BoOS", field: "Operating systems", description: "A Linux runtime experiment with separate user identities, private state, and persistent request queues.", link: "/boos/", action: "Project overview", repo: "https://github.com/BoltzmannOS-BoOS/minimalLinuxCore" },
  { id: "pomodoroAKAtimer", name: "pomodoroAKAtimer", field: "Browser tools", description: "An offline Vue timer with custom work intervals, local session history, and generated ambient sound.", link: "https://ttinker.net/pomodoro/", action: "Open the timer", repo: github + "/pomodoroAKAtimer" },
  { id: "StockItsMygo", name: "StockItsMygo", field: "Data engineering", description: "A self-hosted market dashboard with historical prices in TimescaleDB and separate watchlists for each user.", link: github + "/StockItsMygo", action: "Source code" },
];

export default function Home() {
  const rows: CompilerCorrespondenceRow[] = sample.rows;
  const selectable = sample.source.lines.flatMap(line => {
    const matches = rows.filter(row => row.sourceLines.includes(line.number));
    if (!matches.length) return [];
    const last = matches[matches.length - 1];
    return [{
      ...last,
      assemblyLines: matches.flatMap(row => row.assemblyLines),
      note: matches.length > 1 ? "Load doubled into the return register, restore the caller’s stack frame, and return to the entry point." : last.note,
    }];
  });
  const initial = selectable.find(row => row.mnemonic === "addw")!;
  return (
    <>
      <link rel="stylesheet" href="/portfolio/work.css" />
      <link rel="stylesheet" href="/portfolio/transfer.css" />
      <script src="/portfolio/work.js" defer></script>
      <main id="top" className="portfolio">
        <a className="skip" href="#compiler">Skip to work</a>
        <header className="mastbar wrap">
          <div className="identity"><a href="#top" aria-label="TT1nKer home">TT1nKer</a><span>Systems software portfolio</span></div>
          <nav aria-label="Main navigation"><a href="#transfer">File transfer</a><a href="#projects">Other work</a><a href={github}>GitHub</a></nav>
        </header>

        <section id="compiler" className="compiler wrap" aria-labelledby="compiler-title">
          <div className="case-head" id="p-fstCC">
            <div className="case-lede"><h1 id="compiler-title">fstCC</h1><p>A C compiler I wrote in RISC-V assembly.</p></div>
            <a className="text-link" href={compiler}>Compiler source</a>
          </div>
          <div className="workbench" data-trace>
            <div className="source-side">
              <div className="fileline"><span>Source</span><code>{sample.source.file.split("/").pop()}</code></div>
              <div className="big-token" data-expression aria-hidden="true">{initial.expression}</div>
              <p className="trace-help" hidden>Select a line to trace its instructions.</p>
              <div className="source-code" aria-label="C source statements">
                {sample.source.lines.map(line => {
                  const row = selectable.find(r => r.sourceLines.includes(line.number));
                  return row ? <button disabled type="button" className="statement" key={line.number} data-trace-key={row.id} data-expression-value={row.expression} data-mnemonic-value={row.mnemonic} aria-pressed={row === initial} aria-controls={"asm-" + row.id}><span className="lineno" aria-hidden="true">{line.number}</span><code>{line.text}</code></button>
                    : <div className="statement passive" key={line.number}><span className="lineno">{line.number}</span><code>{line.text}</code></div>;
                })}
              </div>
              <div className="wires" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            </div>
            <div className="printout">
              <div className="fileline"><span>Compiler output</span><code>{sample.assembly.file.split("/").pop()} · RV64IM</code></div>
              <div className="big-token operator" data-mnemonic aria-hidden="true">{initial.mnemonic}</div>
              <div className="excerpts" aria-live="polite">
                {selectable.map(row => <div key={row.id} id={"asm-" + row.id} data-asm-group={row.id} className={row === initial ? "is-active" : ""} hidden={row !== initial}>
                  <div className="asm-lines">{row.assemblyLines.map(num => {
                    const line = sample.assembly.lines[num - 1];
                    return <div className={"asm-line" + (num === row.instructionLine ? " primary-op" : "")} key={num}><span className="lineno" aria-hidden="true">{num}</span><code>{line.text.trimStart().replaceAll("\t", "  ")}</code></div>;
                  })}</div>
                  <p className="trace-note">{row.note}</p>
                </div>)}
              </div>
            </div>
          </div>
          <div className="run-metadata">
            <span className="run-result">QEMU exit status <b>42</b></span>
            <a href={compiler + "/tree/" + sample.evidence.commit}>fstCC <code>{sample.evidence.commit.slice(0, 7)}</code></a>
          </div>
          <details className="full-run">
            <summary>Full compiler output</summary>
            <p className="listing-method">The line mapping was checked by hand against this listing. The compiled program and its GCC reference both returned 42.</p>
            <pre><code>{sample.assembly.text}</code></pre>
            <a className="text-link" href={compiler + "/tree/" + sample.evidence.commit + "#reproduce-from-a-clean-checkout"}>Build and verify fstCC</a>
          </details>
        </section>

        <TransferStudy />

        <section className="more" id="projects" aria-labelledby="more-title">
          <div className="wrap more-layout">
            <h2 id="more-title">Other work</h2>
            <div className="other-list">
              {studies.map(p => <article id={"p-" + p.id} key={p.id}>
                <header><h3><a href={p.link}>{p.name}</a></h3><span>{p.field}</span></header>
                <p>{p.description}</p>
                <div className="other-links"><a href={p.link}>{p.action}</a>{p.repo && <a href={p.repo}>Source code</a>}</div>
              </article>)}
            </div>
          </div>
        </section>
        <footer className="sitefoot wrap"><a href="#top">TT1nKer</a><a href={github}>GitHub profile</a></footer>
      </main>
    </>
  );
}
