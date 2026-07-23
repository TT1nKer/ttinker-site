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
  assert.match(html, /PROJECTS\./);
  assert.match(html, /LOCAL FIRST\./);
  assert.match(html, /chatcommons/);
  assert.match(html, /opensender/);
  assert.match(html, /39 \/ 39 TESTS/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SEND IT MY WAY|RECENT WORK/i);
});

test("ships a causal input system with cleanup and reduced-motion coverage", async () => {
  const [stage, glitch, css, page] = await Promise.all([
    readFile(new URL("../app/SignalStage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GlitchTitle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(stage, /pointermove/);
  assert.match(stage, /visibilitychange/);
  assert.match(stage, /cancelAnimationFrame/);
  assert.match(stage, /prefers-reduced-motion/);
  assert.match(stage, /removeEventListener/);
  assert.match(glitch, /ttinker:disturb/);
  assert.match(glitch, /between\(5200,\s*14800\)/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(page, /OWN REPOSITORIES/);
  assert.doesNotMatch(page, /\bai-town\b|\bopenclaw\b|\bMaaFramework\b/);
});
