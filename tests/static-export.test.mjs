import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { before, test } from "node:test";
import { cleanHomeHtml, versionHomeAssets } from "../scripts/export-static.mjs";

const execFileAsync = promisify(execFile);
const root = new URL("..", import.meta.url);
let home;
let boos;

before(async () => {
  await execFileAsync(process.execPath, ["scripts/export-static.mjs"], { cwd: root });
  [home, boos] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/boos/index.html", import.meta.url), "utf8"),
  ]);
});

function resources(html) {
  const found = [];
  for (const [tag] of html.matchAll(/<(?:link|script|img|source)\b[^>]*>/gi)) {
    // Navigation and canonical links do not load a runtime asset.
    if (tag.startsWith("<link") && /\brel="canonical"/.test(tag)) continue;
    const value = tag.match(/\b(?:href|src)="([^"]+)"/)?.[1];
    if (value) found.push(value);
  }
  return [...new Set(found)];
}

function localPath(reference, base = "https://ttinker.net/") {
  const url = new URL(reference, base);
  assert.equal(url.origin, "https://ttinker.net", `Unexpected external asset: ${reference}`);
  return decodeURIComponent(url.pathname).slice(1);
}

async function existsAt(directory, path) {
  const info = await stat(join(directory, path));
  assert.ok(info.isFile() && info.size > 0, `Missing or empty asset: ${path}`);
}

test("exports the exact SSR main with an independent document and current metadata", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request("https://ttinker.net/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  assert.equal(home, await versionHomeAssets(cleanHomeHtml(await response.text())));
  assert.equal((home.match(/<main\b/g) ?? []).length, 1);
  assert.match(home, /<title>TT1nKer · 个人项目与随记<\/title>/);
  assert.match(home, /<meta name="description" content="TT1nKer 的个人主页。浏览程序、网络与计算实验，阅读留白博客。"/);
  assert.match(home, /property="og:image" content="https:\/\/ttinker\.net\/home-atlas\/social\.png\?v=[a-f0-9]{12}"/);
  assert.match(home, /name="twitter:image" content="https:\/\/ttinker\.net\/home-atlas\/social\.png\?v=[a-f0-9]{12}"/);
  assert.match(home, /rel="canonical" href="https:\/\/ttinker\.net\/"/);
  assert.match(home, /href="\/liubai\/"/);
  assert.match(home, /href="\/boos\/"/);
  assert.doesNotMatch(home, /__vite|__rsc|__next|modulepreload|data-rsc|geist|\/assets\/|og-editorial|fonts\.google/i);
  assert.equal((home.match(/<script\b/g) ?? []).length, 2);
  assert.match(home, /<script src="\/home-atlas\/plates\.js\?v=[a-f0-9]{12}" defer><\/script>\s*<script src="\/home-atlas\/home\.js\?v=[a-f0-9]{12}" defer><\/script>/);
  assert.deepEqual([...home.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(([, href]) => localPath(href)), ["home-atlas/home.css"]);
});

test("versions every home CSS, script and image URL from its own exported bytes", async () => {
  const references = [...home.matchAll(/(?:src|href|content)="([^"]+)"/g)].map(([, value]) => value);
  for (const file of ["home.css", "plates.js", "home.js", "first-plate.png", "social.png"]) {
    const path = `/home-atlas/${file}`;
    const bytes = await readFile(new URL(`../dist/client${path}`, import.meta.url));
    const expected = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    const matching = references.filter((value) => value.startsWith(path) || value.startsWith(`https://ttinker.net${path}`));
    assert.ok(matching.length > 0, `The export must reference ${path}`);
    for (const reference of matching) {
      const url = new URL(reference, "https://ttinker.net/");
      assert.equal(url.pathname, path);
      assert.equal(url.search, `?v=${expected}`, `Incorrect cache version for ${path}`);
    }
  }
  assert.equal(await versionHomeAssets(home), home, "Asset versioning must be idempotent");
});

test("the homepage deploys with only index, home-atlas and the existing site icons", async () => {
  const candidate = await mkdtemp(join(tmpdir(), "ttinker-home-export-"));
  try {
    await cp(new URL("../out/index.html", import.meta.url), join(candidate, "index.html"));
    await cp(new URL("../out/home-atlas/", import.meta.url), join(candidate, "home-atlas"), { recursive: true });
    // These files already exist on the production root and are deliberately not
    // part of the homepage replacement, unlike /assets used by the BoOS route.
    for (const icon of ["favicon-tt-question-v1.png", "apple-touch-tt-question-v1.png"]) {
      await cp(new URL(`../public/${icon}`, import.meta.url), join(candidate, icon));
    }
    for (const reference of resources(home)) {
      const path = localPath(reference);
      assert.ok(path.startsWith("home-atlas/") || /^(favicon|apple-touch)-tt-question-v1\.png$/.test(path), path);
      await existsAt(candidate, path);
    }
    const css = await readFile(join(candidate, "home-atlas/home.css"), "utf8");
    for (const [, reference] of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
      if (reference.startsWith("data:")) continue;
      const path = localPath(reference, "https://ttinker.net/home-atlas/home.css");
      assert.ok(path.startsWith("home-atlas/"), `CSS escapes the homepage asset directory: ${path}`);
      await existsAt(candidate, path);
    }
    const social = await readFile(join(candidate, "home-atlas/social.png"));
    assert.equal(social.subarray(1, 4).toString(), "PNG");
    assert.equal(social.readUInt32BE(16), 1200);
    assert.equal(social.readUInt32BE(20), 630);
  } finally {
    await rm(candidate, { recursive: true, force: true });
  }
});

test("exports BoOS unchanged and preserves all of its independent build assets", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request("https://ttinker.net/boos/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  assert.equal(boos, await response.text(), "The BoOS route must retain the original SSR export");
  assert.match(boos, /Boltzmann Operating System/i);
  assert.match(boos, /The first user/i);
  assert.match(boos, /Native user 0/i);
  assert.match(boos, /rel="canonical" href="https:\/\/ttinker\.net\/boos\/"/);
  assert.match(boos, /https:\/\/ttinker\.net\/boos\/og\.png/);
  assert.doesNotMatch(boos, /home-atlas\//);
  const paths = resources(boos).map((reference) => localPath(reference));
  assert.ok(paths.some((path) => path.startsWith("assets/") && path.endsWith(".js")));
  assert.ok(paths.some((path) => path.startsWith("assets/") && path.endsWith(".css")));
  for (const path of paths) {
    const [actual, source] = await Promise.all([
      readFile(new URL(`../out/${path}`, import.meta.url)),
      readFile(new URL(`../dist/client/${path}`, import.meta.url)),
    ]);
    assert.deepEqual(actual, source, `Export altered an existing child-route asset: ${path}`);
  }
});

test("refuses malformed home markup instead of exporting a partly stripped document", () => {
  const head = '<title>Example &amp; title</title><meta name="description" content="A &amp; B">';
  const document = (body) => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
  assert.throws(() => cleanHomeHtml(document("<div>No main</div>")), /exactly one/);
  assert.throws(() => cleanHomeHtml(document('<main id="top" class="atlas"><main>nested</main></main>')), /non-nested/);
  assert.throws(() => cleanHomeHtml(document('<main id="top" class="atlas"></main><main>other</main>')), /exactly one/);
  assert.throws(() => cleanHomeHtml(document('<main class="old-site">old layout</main>')), /main#top.atlas/);
  assert.throws(() => cleanHomeHtml(document('<main id="top" class="atlas"><script>legacy()</script></main>')), /resources must be outside/);
  const result = cleanHomeHtml(document('<main id="top" class="atlas"><p>SSR content &amp; punctuation.</p></main><script>old hydration()</script>'));
  assert.match(result, /<title>Example &amp; title<\/title>/);
  assert.match(result, /<p>SSR content &amp; punctuation\.<\/p>/);
  assert.doesNotMatch(result, /old hydration/);
});
