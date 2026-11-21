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

test("renders the complete Chinese project directory and useful destinations on the server", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>TT1nKer · 个人项目与随记<\/title>/);
  assert.match(html, /<main id="top" class="atlas">/);
  assert.match(html, /href="\/liubai\/"/);
  assert.match(html, /href="\/boos\/"/);
  assert.match(html, /href="https:\/\/ttinker\.net\/pomodoro\/"/);
  assert.match(html, /href="https:\/\/github\.com\/TT1nKer"/);
  assert.match(html, /href="https:\/\/tt1nker\.github\.io\/adaptiveNet\/index\.zh\.html"/);

  const projects = ["chatcommons", "opensender", "adaptiveNet", "hwine", "solar", "pomodoroAKAtimer", "fstCC", "StockItsMygo", "BoOS"];
  const articles = [...html.matchAll(/<article\b[^>]*data-article="([^"]+)"[^>]*>[\s\S]*?<\/article>/g)];
  assert.deepEqual(articles.map(([, id]) => id), projects);
  for (const [article, id] of articles) {
    assert.match(article, /<h2\b/);
    assert.match(article, /<details\b/);
    assert.match(article, /<a\b[^>]*href="(?:https:\/\/|\/boos\/)/);
    assert.match(html, new RegExp(`data-project="${id}"`));
  }
  assert.match(articles[0][0], /0\.1\.0-alpha\.7/);
  assert.match(articles[0][0], /暂无正式托管服务/);
  assert.doesNotMatch(articles[0][0].split(">")[0], /\bhidden/);
  for (const [article] of articles.slice(1)) assert.match(article.split(">")[0], /\bhidden/);
  assert.match(html, /<input\b[^>]*type="range"[^>]*aria-label="图解进度"/);
  assert.match(html, /data-play[^>]*aria-label="播放图解"[^>]*aria-pressed="false"/);
  assert.match(html, /<canvas\b[^>]*role="img"[^>]*aria-label="[^"]+"/);
  assert.doesNotMatch(html, /Your site is taking shape|SEND IT MY WAY|CURRENT BOUNDARY|ACTIVE SYSTEM/);
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /["']use client["']|from ["']next\/link["']/);
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
