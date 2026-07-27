"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import ProjectVisual from "./ProjectVisual";

type Signal =
  | "mesh"
  | "transfer"
  | "field"
  | "datapath"
  | "orbit"
  | "timer"
  | "compiler"
  | "market";

const systems: Array<{
  index: string;
  name: string;
  kind: string;
  state: string;
  description: string;
  stack: string;
  href: string;
  signal: Signal;
  accent: string;
}> = [
  {
    index: "001",
    name: "opensender",
    kind: "NETWORK TRANSFER",
    state: "WORKING TOOL",
    description: "Parallel, resumable transfer for links where one TCP stream underperforms.",
    stack: "GO / HTTP RANGE / SHA-256",
    href: "https://github.com/TT1nKer/opensender",
    signal: "transfer",
    accent: "#ef5a46",
  },
  {
    index: "002",
    name: "adaptiveNet",
    kind: "COMPLEX SYSTEMS",
    state: "BROWSER LAB",
    description: "Node-edge dynamical systems with live controls and visible state.",
    stack: "TYPESCRIPT / DYNAMICS / WEBGL",
    href: "https://github.com/TT1nKer/adaptiveNet",
    signal: "field",
    accent: "#17aeb8",
  },
  {
    index: "003",
    name: "hwine",
    kind: "HARDWARE SYNTHESIS",
    state: "EXPERIMENT",
    description: "Equality-saturation studies for FPGA datapath optimization.",
    stack: "RUST / E-GRAPHS / SYSTEMVERILOG",
    href: "https://github.com/TT1nKer/hwine",
    signal: "datapath",
    accent: "#7357d8",
  },
  {
    index: "004",
    name: "solar",
    kind: "ORBITAL MECHANICS",
    state: "SANDBOX",
    description: "A C++17 environment for orbital mechanics and mission experiments.",
    stack: "C++17 / DYNAMICS / VALIDATION",
    href: "https://github.com/TT1nKer/solar",
    signal: "orbit",
    accent: "#c4882b",
  },
  {
    index: "005",
    name: "pomodoroAKAtimer",
    kind: "FOCUS TOOL",
    state: "SHIPPED",
    description: "An offline focus timer with custom phases and a local music bridge.",
    stack: "VUE / RUST / OFFLINE",
    href: "https://github.com/TT1nKer/pomodoroAKAtimer",
    signal: "timer",
    accent: "#dd4f73",
  },
  {
    index: "006",
    name: "fstCC",
    kind: "BOOTSTRAP COMPILER",
    state: "39 / 39 TESTS",
    description: "A tiny C compiler bootstrapped in RISC-V assembly.",
    stack: "RISC-V / ASSEMBLY / C",
    href: "https://github.com/TT1nKer/fstCC",
    signal: "compiler",
    accent: "#3978cc",
  },
  {
    index: "007",
    name: "StockItsMygo",
    kind: "MARKET WATCHER",
    state: "HOBBY TOOL",
    description: "A personal dashboard for watching and filtering market signals.",
    stack: "PYTHON / POSTGRESQL / DATA",
    href: "https://github.com/TT1nKer/StockItsMygo",
    signal: "market",
    accent: "#7d9d34",
  },
];

const facts = [
  ["VERSION", "0.1.0-alpha.3"],
  ["PROTOCOL", "chatcommons.chat.v2"],
  ["IDENTITY", "Ed25519"],
  ["TRANSPORT", "Direct QUIC / Relay v2"],
  ["STORAGE", "SQLite / signed event DAG"],
  ["STATE", "Friends alpha"],
];

const limits = [
  "No production hosted service",
  "No trusted release binary",
  "No voice or account recovery",
  "No multi-device identity",
];

export default function SystemsArchive() {
  const [active, setActive] = useState(0);
  const system = systems[active];

  return (
    <>
      <section className="active-system" id="systems" aria-labelledby="active-system-title">
        <div className="active-system-head">
          <p>[ 01 / ACTIVE SYSTEM ]</p>
          <span>REAL STATE / NO TELEMETRY THEATER</span>
        </div>

        <div className="active-system-grid">
          <div className="active-system-copy">
            <p className="active-kicker"><i /> FRIENDS-AND-CONTRIBUTORS ALPHA</p>
            <h2 id="active-system-title">chatcommons</h2>
            <p className="active-statement">
              Community-owned communication infrastructure.
              <br />
              Offline-first. Signed. Replaceable by design.
            </p>

            <div className="active-actions">
              <a
                href="https://github.com/TT1nKer/chatcommons/blob/main/docs/protocol.md"
                target="_blank"
                rel="noreferrer"
              >
                READ THE SYSTEM <b>→</b>
              </a>
              <a
                href="https://github.com/TT1nKer/chatcommons"
                target="_blank"
                rel="noreferrer"
              >
                SOURCE ↗
              </a>
            </div>
          </div>

          <div className="active-system-data">
            <dl>
              {facts.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="protocol-map" aria-label="ChatCommons 系统结构">
          <div className="protocol-node">
            <span>01</span>
            <strong>IDENTITY</strong>
            <small>Ed25519 device keys</small>
          </div>
          <i aria-hidden="true"><b /></i>
          <div className="protocol-node">
            <span>02</span>
            <strong>SIGNED EVENT DAG</strong>
            <small>Verifiable local history</small>
          </div>
          <i aria-hidden="true"><b /></i>
          <div className="protocol-node">
            <span>03</span>
            <strong>DIRECT / RELAYED QUIC</strong>
            <small>Bounded synchronization</small>
          </div>
          <i aria-hidden="true"><b /></i>
          <div className="protocol-node">
            <span>04</span>
            <strong>REPLACEABLE HOME SERVER</strong>
            <small>Owner-signed declaration</small>
          </div>
        </div>

        <div className="active-limits">
          <span>CURRENT BOUNDARY</span>
          <ul>
            {limits.map((limit) => <li key={limit}>{limit}</li>)}
          </ul>
        </div>
      </section>

      <section className="system-index" id="index" aria-labelledby="system-index-title">
        <div className="system-index-head">
          <p>[ 02 / SYSTEM INDEX ]</p>
          <h2 id="system-index-title">Other systems,<br />tools, and studies.</h2>
        </div>

        <div className="system-index-grid">
          <ol className="system-list" aria-label="系统目录">
            {systems.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-current={index === active ? "true" : undefined}
                  style={{ "--system-accent": item.accent } as CSSProperties}
                >
                  <span>{item.index}</span>
                  <strong>{item.name}</strong>
                  <small>{item.kind}</small>
                  <b>{item.state}</b>
                  <i>↗</i>
                </button>
              </li>
            ))}
          </ol>

          <aside
            className="system-inspector"
            style={{ "--system-accent": system.accent } as CSSProperties}
            aria-live="polite"
          >
            <div className="system-inspector-visual" aria-hidden="true">
              <span>{system.index} / SIGNAL</span>
              <ProjectVisual signal={system.signal} />
            </div>
            <div className="system-inspector-copy">
              <span>{system.state}</span>
              <h3>{system.name}</h3>
              <p>{system.description}</p>
              <footer>
                <small>{system.stack}</small>
                <a href={system.href} target="_blank" rel="noreferrer">
                  OPEN REPOSITORY ↗
                </a>
              </footer>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
