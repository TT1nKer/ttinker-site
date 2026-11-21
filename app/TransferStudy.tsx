/**
 * Source: TT1nKer/opensender, README.md lines 42–51 at c74534f.
 * These are the author's reported results, not new measurements or a time series.
 * client.go lines 136–154 define the benchmark's `256K` as 256 × 1024 bytes.
 * The mixed-unit scp comparison is intentionally not used in this figure.
 */
const revision = "c74534fd563dbe5709c1f007d017937a70765e83";
const source = `https://github.com/TT1nKer/opensender/blob/${revision}`;
const runs = [
  { workers: "1,024", throughput: 7.58 },
  { workers: "2,048", throughput: 7.15 },
  { workers: "4,096", throughput: 5.41 },
] as const;

function TransferFigure() {
  const left = 134;
  const span = 488;
  const maximum = 8;

  return (
    <svg
      className="transfer-chart"
      viewBox="0 0 760 338"
      role="img"
      aria-labelledby="transfer-chart-title transfer-chart-description"
    >
      <title id="transfer-chart-title">Reported throughput by worker count</title>
      <desc id="transfer-chart-description">
        The horizontal scale runs from 0 to 8 MiB per second. 1,024 workers:
        7.58 MiB/s. 2,048 workers: 7.15 MiB/s. 4,096 workers: 5.41 MiB/s.
        Each setting used 256 KiB chunks and a 500 MiB random file. These
        results describe one Canada–China Tailscale path on 18 May 2026.
      </desc>

      <g className="transfer-chart-head" aria-hidden="true">
        <text x="0" y="22">Workers</text>
        <text x={left} y="22">Throughput</text>
        <text x="744" y="22" textAnchor="end">MiB/s</text>
      </g>

      {[0, 2, 4, 6, 8].map((tick) => {
        const x = left + (tick / maximum) * span;
        return (
          <g key={tick} aria-hidden="true">
            <line
              className={tick === 0 ? "transfer-zero" : "transfer-guide"}
              x1={x} x2={x} y1="46" y2="282"
            />
            <text className="transfer-tick" x={x} y="309" textAnchor="middle">
              {tick}
            </text>
          </g>
        );
      })}

      {runs.map((run, index) => {
        const y = 85 + index * 77;
        return (
          <g
            className={index === 0 ? "transfer-run transfer-run-best" : "transfer-run"}
            key={run.workers}
            aria-hidden="true"
          >
            <text className="transfer-worker-count" x="0" y={y + 8}>
              {run.workers}
            </text>
            <rect
              className="transfer-bar"
              x={left} y={y - 4} width={(run.throughput / maximum) * span} height="8"
            />
            <text className="transfer-value" x="744" y={y + 11} textAnchor="end">
              {run.throughput.toFixed(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function TransferStudy() {
  return (
      <section className="transfer-study" id="transfer" aria-labelledby="transfer-title">
        <div className="wrap">
          <div className="transfer-eyebrow">
            <span>File transfer</span>
            <span>Go · HTTP/1.1</span>
          </div>

          <header className="transfer-intro">
            <h2 id="transfer-title"><span id="p-opensender"></span>opensender</h2>
            <p>
              Parallel downloads for a long-distance connection. Chunks are
              checked with SHA-256. A local manifest lets interrupted
              transfers resume.
            </p>
          </header>

          <figure className="transfer-evidence" aria-describedby="transfer-method">
            <div className="transfer-result">
              <p className="transfer-result-label">Best reported setting</p>
              <div className="transfer-reading">
                <span className="transfer-number">7.58</span>
                <span className="transfer-unit">MiB/s</span>
              </div>
              <p className="transfer-result-detail">1,024 parallel workers</p>
            </div>

            <div className="transfer-comparison">
              <TransferFigure />
            </div>
            <figcaption>More workers did not improve this transfer.</figcaption>
          </figure>

          <dl className="transfer-conditions">
            <div><dt>Tested</dt><dd><time dateTime="2026-05-18">18 May 2026</time></dd></div>
            <div><dt>Path</dt><dd>Canada ↔ China · Tailscale</dd></div>
            <div><dt>Payload</dt><dd>500 MiB random file</dd></div>
            <div><dt>Chunk size</dt><dd>256 KiB</dd></div>
          </dl>

          <footer className="transfer-source-row">
            <p id="transfer-method">
              Author-reported results on one path, received by a Windows client
              on a 100 Mbps residential LAN. The repository supplies no raw run
              logs or repeat counts.
            </p>
            <div className="transfer-links">
              <a href={`${source}/README.md#L42-L51`}>
                Measurement record
              </a>
              <a href={`${source}/client.go#L737-L775`}>
                Chunk verification
              </a>
              <a href={`${source}/client_test.go#L131-L166`}>
                Manifest test
              </a>
            </div>
          </footer>
        </div>
      </section>
  );
}
