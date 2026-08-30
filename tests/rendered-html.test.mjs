import assert from "node:assert/strict";
import test from "node:test";

test("renders the Nivaran evaluator entrance and production metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
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

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Nivaran AI — The Review-to-Recovery OS<\/title>/);
  assert.match(html, /data-testid="demo-login"/);
  assert.match(html, /Signal.*Decision.*Action.*Evidence.*Recovery/s);
  assert.match(html, /judge[\s\S]{0,120}nivaran2026/);
  assert.doesNotMatch(html, /name=["']codex-preview["']/i);
});
