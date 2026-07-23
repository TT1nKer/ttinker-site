import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://ttinker.net/", {
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
  assert.match(html, /OWN REPOSITORIES/);
  assert.match(html, /CURRENT/);
  assert.match(html, /chatcommons/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SEND IT MY WAY|RECENT WORK|LOCAL FIRST/i);
});

test("ships causal hero and scroll-stage systems with cleanup and reduced-motion coverage", async () => {
  const [stage, sequence, visual, glitch, css, page] = await Promise.all([
    readFile(new URL("../app/SignalStage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ProjectSequence.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ProjectVisual.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GlitchTitle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(stage, /pointermove/);
  assert.match(stage, /visibilitychange/);
  assert.match(stage, /cancelAnimationFrame/);
  assert.match(stage, /prefers-reduced-motion/);
  assert.match(stage, /removeEventListener/);
  assert.match(sequence, /position|requestAnimationFrame/);
  assert.match(sequence, /OWN REPOSITORIES/);
  assert.match(sequence, /opensender/);
  assert.match(sequence, /hwine/);
  assert.match(sequence, /solar/);
  assert.match(sequence, /pomodoroAKAtimer/);
  assert.match(sequence, /39 \/ 39 TESTS/);
  assert.doesNotMatch(sequence, /Model Brain Surgery|model-brain-surgery|ablation/i);
  assert.match(sequence, /prefers-reduced-motion/);
  assert.match(sequence, /project-static/);
  assert.match(sequence, /removeEventListener/);
  assert.match(sequence, /progress \* projects\.length/);
  assert.match(sequence, /project-active-marker/);
  assert.match(sequence, /project-tracker-cursor/);
  assert.match(sequence, /--active-index/);
  assert.doesNotMatch(sequence, /project-atmosphere|is-next|departing/);
  assert.match(visual, /drawProtocolMorph/);
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
  assert.match(css, /\.project-stage\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.project-tracker-scale/);
  assert.match(css, /\.project-tracker-cursor/);
  assert.match(css, /var\(--project-count\)/);
  assert.match(css, /var\(--tracker-travel\)/);
  assert.match(css, /var\(--work-progress\)/);
  assert.match(css, /tracker-lock/);
  assert.match(css, /\.project-active-marker/);
  assert.match(css, /var\(--active-index\)/);
  assert.match(css, /project-switch-forward/);
  assert.match(css, /project-switch-backward/);
  assert.doesNotMatch(css, /project-focus\.is-current|project-focus\.is-next|project-atmosphere/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(page, /ProjectSequence/);
  assert.doesNotMatch(page, /field-strip|project-grid/);
  assert.doesNotMatch(page, /\bai-town\b|\bopenclaw\b|\bMaaFramework\b/);
});
