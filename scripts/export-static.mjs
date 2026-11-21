import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const output = new URL("../out/", import.meta.url);
const routes = [
  { pathname: "/", output: new URL("../out/index.html", import.meta.url) },
  { pathname: "/boos/", output: new URL("../out/boos/index.html", import.meta.url) },
];

async function renderRoute(worker, pathname) {
  const response = await worker.fetch(
    new Request(new URL(pathname, "https://ttinker.net"), {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) {
    throw new Error(`Static render failed for ${pathname} with ${response.status}`);
  }

  return response.text();
}

// The root page is authored once in React, but its production delivery is plain
// HTML. Do not publish layout CSS, React hydration, font preloads or RSC payloads
// from the shared BoOS build into the homepage.
export function cleanHomeHtml(renderedHtml) {
  const mains = [...renderedHtml.matchAll(/<main\b[^>]*>[\s\S]*?<\/main>/gi)];
  if (mains.length !== 1 || (mains[0][0].match(/<main\b/gi) ?? []).length !== 1) {
    throw new Error("Homepage export requires exactly one non-nested main element");
  }
  const main = mains[0][0];
  const opening = main.slice(0, main.indexOf(">") + 1);
  if (!/\bid="top"/.test(opening) || !/\bclass="[^"]*\batlas\b[^"]*"/.test(opening)) {
    throw new Error("Homepage export requires main#top.atlas");
  }
  if (/<(?:script|style|link)\b/i.test(main)) {
    throw new Error("Homepage resources must be outside its main element");
  }

  // Keep metadata produced by the same SSR render, rather than a second set of
  // copy in an HTML template. Resource-bearing tags are explicitly reconstructed.
  const title = renderedHtml.match(/<title>[\s\S]*?<\/title>/i)?.[0];
  const metadata = [...renderedHtml.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .filter((tag) => /\b(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"/i.test(tag));
  if (!title || !metadata.some((tag) => /\bname="description"/i.test(tag))) {
    throw new Error("Homepage title and description are required");
  }

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${title}
${metadata.join("\n")}
<link rel="canonical" href="https://ttinker.net/">
<link rel="icon" href="/favicon-tt-question-v1.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-tt-question-v1.png">
<link rel="stylesheet" href="/home-atlas/home.css">
<script src="/home-atlas/plates.js" defer></script>
<script src="/home-atlas/home.js" defer></script>
</head>
<body>
${main}
</body>
</html>
`;
}

export async function versionHomeAssets(html) {
  const files = ["home.css", "plates.js", "home.js", "first-plate.png", "social.png"];
  const versions = await Promise.all(files.map(async (file) => {
    const bytes = await readFile(new URL(`../dist/client/home-atlas/${file}`, import.meta.url));
    return [file, createHash("sha256").update(bytes).digest("hex").slice(0, 12)];
  }));
  for (const [file, version] of versions) {
    const path = `/home-atlas/${file}`;
    const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Includes absolute social-image URLs and replaces an existing version if
    // called again. Only the root HTML changes; original filenames stay intact.
    html = html.replace(new RegExp(`${escaped}(?:\\?[^"\\s<>]*)?(?=")`, "g"), `${path}?v=${version}`);
  }
  return html;
}

export async function exportStatic() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("export", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const rendered = [];
  for (const route of routes) {
    const html = await renderRoute(worker, route.pathname);
    rendered.push({ ...route, html: route.pathname === "/" ? await versionHomeAssets(cleanHomeHtml(html)) : html });
  }

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(new URL("../dist/client/", import.meta.url), output, { recursive: true });

  for (const route of rendered) {
    await mkdir(new URL(".", route.output), { recursive: true });
    await writeFile(route.output, route.html);
  }
  console.log(`Exported ${routes.length} static routes to ${output.pathname}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await exportStatic();
}
