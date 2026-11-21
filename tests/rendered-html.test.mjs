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

test("renders the English portfolio with complete work samples and real project destinations", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>TT1nKer \| Systems Software Portfolio<\/title>/);
  const main = html.match(/<main id="top" class="portfolio">[\s\S]*?<\/main>/)?.[0];
  assert.ok(main, "The portfolio must be server-rendered without nested main elements");
  for (const section of ["compiler", "transfer", "projects"]) {
    assert.match(main, new RegExp(`<section\\b[^>]*id="${section}"`));
  }
  assert.doesNotMatch(main, /\/liubai\/|\bblog\b|journal-teaser|data-latest|latest-story|question-driven|question-led/i);
  assert.doesNotMatch(main, /home-atlas|first-plate|plates\.js|<canvas\b|class="[^"]*\bledger\b|data-(?:plate|scrub|play|project)=["']/i);
  assert.doesNotMatch(main.replace(/<[^>]*>/g, ""), /\p{Script=Han}/u);
  for (const [, heading] of main.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
    const text = heading.replace(/<[^>]*>/g, "").trim();
    assert.ok(text);
    assert.doesNotMatch(text, /[?？]/u);
    assert.doesNotMatch(text, /^(?:how|why|what|which|when|where|can|could|should|would|does|do|is|are)\b/i);
  }
  const links = [...main.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  const targets = [
    ["chatcommons", /^https:\/\/github\.com\/TT1nKer\/chatcommons(?:[\/#]|$)/],
    ["opensender", /^https:\/\/github\.com\/TT1nKer\/opensender(?:[\/#]|$)/],
    ["adaptiveNet", /^https:\/\/tt1nker\.github\.io\/adaptiveNet\/index\.html$/],
    ["hwine", /^https:\/\/github\.com\/TT1nKer\/hwine(?:[\/#]|$)/],
    ["solar", /^https:\/\/github\.com\/TT1nKer\/solar(?:[\/#]|$)/],
    ["pomodoroAKAtimer", /^https:\/\/(?:github\.com\/TT1nKer\/pomodoroAKAtimer(?:[\/#]|$)|ttinker\.net\/pomodoro\/)/],
    ["fstCC", /^https:\/\/github\.com\/TT1nKer\/fstCC(?:[\/#]|$)/],
    ["StockItsMygo", /^https:\/\/github\.com\/TT1nKer\/StockItsMygo(?:[\/#]|$)/],
    ["BoOS", /^https:\/\/github\.com\/BoltzmannOS-BoOS\/minimalLinuxCore(?:[\/#]|$)/],
  ];
  for (const [project, destination] of targets) {
    const matches = links.filter(([, href]) => destination.test(href));
    assert.ok(matches.length, `No real destination for ${project}`);
    for (const [tag, , content] of matches) {
      assert.ok(content.replace(/<[^>]*>/g, "").trim() || /aria-label="[^"]+"/.test(tag), `Unnamed ${project} link`);
    }
  }
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /["']use client["']|from ["']next\/link["']/);
});

test("provides accessible source selections with corresponding assembly groups", async () => {
  const response = await render();
  const html = await response.text();
  const buttons = [...html.matchAll(/<button\b[^>]*data-trace-key="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)];
  const groups = new Set([...html.matchAll(/data-asm-group="([^"]+)"/g)].map(([, key]) => key));
  assert.ok(buttons.length > 1, "The work sample must offer actual source selections");
  assert.equal(new Set(buttons.map(([, key]) => key)).size, buttons.length);
  for (const [button, key, label] of buttons) {
    assert.ok(groups.has(key), `Missing assembly group for ${key}`);
    assert.match(button, /aria-pressed="(?:true|false)"/);
    assert.ok(label.replace(/<[^>]*>/g, "").trim() || /aria-label="[^"]+"/.test(button));
  }
  assert.ok(buttons.filter(([button]) => /aria-pressed="true"/.test(button)).length <= 1);
  const interaction = await readFile(new URL("../public/portfolio/work.js", import.meta.url), "utf8");
  assert.doesNotMatch(interaction, /\/liubai\/|\bblog\b|journal-teaser|data-latest|latest-story|loadLatest|\/api\/posts|\bfetch\s*\(|home-atlas|TinkerPlate/);
  assert.doesNotMatch(interaction, /\p{Script=Han}/u);
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

test("preserves the BoOS overflow correction", async () => {
  const css = await readFile(new URL("../app/boos/boos.css", import.meta.url), "utf8");
  assert.match(css, /\.boos-hero-copy\s*\{[^}]*min-width:\s*0/s);
});
