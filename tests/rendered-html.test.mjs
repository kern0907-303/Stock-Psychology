import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the operation-style assessment landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>你在不確定裡，怎麼做決定？｜NAS<\/title>/);
  assert.match(html, /我們以為在看市場/);
  assert.match(html, /開始看看自己/);
  assert.match(html, /不問生日/);
  assert.match(html, /og:image/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("ships a NAS self-awareness questionnaire and optional life-number reflection", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /number:\s*10/);
  assert.match(page, /getLifePath/);
  assert.match(page, /setActiveQuestion/);
  assert.match(page, /選定後會自動前往下一題/);
  assert.match(page, /怕錯過型/);
  assert.match(page, /選擇性延伸/);
  assert.match(page, /不是投資測驗/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /og-v2\.png/);
});
