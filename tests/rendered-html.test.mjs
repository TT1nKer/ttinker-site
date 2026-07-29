import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "https://ttinker.net"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the authored portfolio instead of starter or template copy", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>TT1nKer<\/title>/i);
  assert.match(html, /TT1NKER\./);
  assert.match(html, /ACTIVE SYSTEM/);
  assert.match(html, /SYSTEM INDEX/);
  assert.match(html, /FIELD NOTES/);
  assert.match(html, /chatcommons/);
  assert.match(html, /Boltzmann Operating System/);
  assert.match(html, /href="\/boos\/"/);
  assert.match(html, /0\.1\.0-alpha\.3/);
  assert.match(html, /chatcommons\.chat\.v2/);
  assert.match(html, /CURRENT BOUNDARY/);
  assert.doesNotMatch(html, /OWN REPOSITORIES|PEERS \/ LOCAL/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SEND IT MY WAY|RECENT WORK|LOCAL FIRST/i);
});

test("renders the AI-native Boltzmann Operating System showcase", async () => {
  const response = await render("/boos/");
  const source = await readFile(new URL("../app/boos/page.tsx", import.meta.url), "utf8");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>BoOS — Boltzmann Operating System<\/title>/i);
  assert.match(html, /Boltzmann Operating System/i);
  assert.match(html, /AI is the subject, not the object/i);
  assert.match(html, /The first user[\s\S]*is[\s\S]*AI/i);
  assert.match(html, /Native user 0/i);
  assert.match(html, /S\s*=\s*k/i);
  assert.match(html, /Can Enter/i);
  assert.match(html, /Can Inhabit/i);
  assert.match(html, /boos-ouroboros/i);
  assert.match(html, /https:\/\/ttinker\.net\/boos\/og\.png/i);
  assert.match(html, /property="og:image"/i);
  assert.match(html, /name="twitter:image"/i);
  assert.doesNotMatch(html, /Archimedes|capability governor|memory drum/i);
  assert.doesNotMatch(source, /from ["']next\/link["']/);
  assert.doesNotMatch(source, /["']use client["']/);
});

test("ships causal hero and evidence-backed system archive with cleanup and reduced-motion coverage", async () => {
  const [stage, archive, visual, glitch, css, boosCss, page] = await Promise.all([
    readFile(new URL("../app/SignalStage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SystemsArchive.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ProjectVisual.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GlitchTitle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/boos/boos.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(stage, /pointermove/);
  assert.match(stage, /visibilitychange/);
  assert.match(stage, /cancelAnimationFrame/);
  assert.match(stage, /prefers-reduced-motion/);
  assert.match(stage, /removeEventListener/);
  assert.match(stage, /QUESTION/);
  assert.match(stage, /MODEL/);
  assert.match(stage, /REVISE/);
  assert.doesNotMatch(stage, /PROMPT/);
  assert.match(archive, /0\.1\.0-alpha\.3/);
  assert.match(archive, /chatcommons\.chat\.v2/);
  assert.match(archive, /Ed25519/);
  assert.match(archive, /Direct QUIC \/ Relay v2/);
  assert.match(archive, /No production hosted service/);
  assert.match(archive, /opensender/);
  assert.match(archive, /hwine/);
  assert.match(archive, /solar/);
  assert.match(archive, /pomodoroAKAtimer/);
  assert.match(archive, /39 \/ 39 TESTS/);
  assert.doesNotMatch(archive, /Model Brain Surgery|model-brain-surgery|ablation/i);
  assert.match(archive, /onPointerEnter/);
  assert.match(archive, /onFocus/);
  assert.match(archive, /aria-live/);
  assert.match(visual, /drawProtocolMorph/);
  assert.match(visual, /drawTransferFieldMorph/);
  assert.match(visual, /drawCalibrationBridge/);
  assert.match(visual, /document\.createElement\("canvas"\)/);
  assert.match(visual, /smoothstep\(\.48,\s*\.98,\s*localProgress\)/);
  assert.match(visual, /drawDatapath/);
  assert.match(visual, /drawOrbitTransfer/);
  assert.match(visual, /drawFocusPhases/);
  assert.match(visual, /drawCompiler/);
  assert.match(visual, /drawMarketFilter/);
  assert.match(visual, /IntersectionObserver/);
  assert.match(visual, /ResizeObserver/);
  assert.match(visual, /Math\.min\(1\.5,\s*window\.devicePixelRatio/);
  assert.match(visual, /cancelAnimationFrame/);
  assert.match(visual, /observer\.disconnect/);
  assert.match(glitch, /ttinker:disturb/);
  assert.match(glitch, /between\(5200,\s*14800\)/);
  assert.match(glitch, /--glitch-primary-x/);
  assert.match(glitch, /--glitch-signal-x/);
  assert.match(css, /\.active-system/);
  assert.match(css, /\.protocol-map/);
  assert.match(css, /\.system-index/);
  assert.match(css, /\.system-inspector\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.field-notes/);
  assert.match(css, /protocol-packet/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /--ink:\s*#17131d/);
  assert.match(css, /--accent-primary:\s*#516394/);
  assert.match(css, /--accent-signal:\s*#d06435/);
  assert.match(css, /--surface-primary:\s*#2948e8/);
  assert.doesNotMatch(css, /--(?:coral|cyan|lime):/);
  assert.match(boosCss, /\.boos-hero-copy\s*\{[^}]*min-width:\s*0/s);
  assert.match(page, /SystemsArchive/);
  assert.match(page, /Questions before conclusions/);
  assert.doesNotMatch(page, /field-strip|project-grid/);
  assert.doesNotMatch(page, /\bai-town\b|\bopenclaw\b|\bMaaFramework\b/);
});
