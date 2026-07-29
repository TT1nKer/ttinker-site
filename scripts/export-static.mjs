import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const output = new URL("../out/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", `${Date.now()}`);
const routes = [
  { pathname: "/", output: new URL("../out/index.html", import.meta.url) },
  { pathname: "/boos/", output: new URL("../out/boos/index.html", import.meta.url) },
];

const { default: worker } = await import(workerUrl.href);

async function renderRoute(pathname) {
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

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("../dist/client/", import.meta.url), output, { recursive: true });

for (const route of routes) {
  const html = await renderRoute(route.pathname);
  await mkdir(new URL(".", route.output), { recursive: true });
  await writeFile(route.output, html);
}

console.log(`Exported ${routes.length} static routes to ${output.pathname}`);
