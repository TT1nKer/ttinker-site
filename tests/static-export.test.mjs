import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("exports the homepage and BoOS route", async () => {
  await execFileAsync(process.execPath, ["scripts/export-static.mjs"], {
    cwd: new URL("..", import.meta.url),
  });

  const [home, boos] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/boos/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(home, /TT1NKER\./);
  assert.match(home, /href="\/boos\/"/);
  assert.match(boos, /Boltzmann Operating System/i);
  assert.match(boos, /The first user/i);
  assert.match(boos, /Native user 0/i);
});
