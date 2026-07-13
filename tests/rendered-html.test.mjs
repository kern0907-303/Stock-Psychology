import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(html, /<title>操作節奏適配掃描｜NAS<\/title>/);
  assert.match(html, /你不一定缺方法/);
  assert.match(html, /開始 6 分鐘掃描/);
  assert.match(html, /不蒐集帳戶資料/);
  assert.match(html, /og:image/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("ships a complete questionnaire, safety gate, and share image", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /number:\s*15/);
  assert.match(page, /getLifePath/);
  assert.match(page, /score\.safety >= 7/);
  assert.match(page, /先建立規則，再談操作週期/);
  assert.match(page, /不構成個別投資建議/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /og\.png/);
  await access(new URL("../public/og.png", import.meta.url));
});
