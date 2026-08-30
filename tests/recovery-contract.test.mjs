import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("keeps the complete recovery chain visible", () => {
  for (const stage of ["Signal", "Decide", "Act", "Prove", "Recover"]) {
    assert.match(source, new RegExp(`["']${stage}["']`));
  }
});

test("requires evidence before recovery closure", () => {
  assert.match(source, /Outcome must be visible before Nivaran marks recovery complete/);
  assert.match(source, /resolution evidence/i);
  assert.match(source, /recovery receipt/i);
});

test("preserves owner and SLA accountability", () => {
  assert.match(source, /Human-owned recovery/);
  assert.match(source, /SLA/);
  assert.match(source, /Owner/);
});
