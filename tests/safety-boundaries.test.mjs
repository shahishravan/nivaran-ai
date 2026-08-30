import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("never presents public posting as autonomous", () => {
  assert.match(source, /Nothing is posted without your approval/);
  assert.match(source, /No response is published/);
});

test("keeps ambiguous safety cases guarded", () => {
  assert.match(source, /Safety ambiguity/);
  assert.match(source, /No automatic safety claim/);
  assert.match(source, /Route to human verification/);
});

test("shows explicit policy controls", () => {
  for (const control of ["Human approval", "Refund authorization", "PII protection", "Confidence floor"]) {
    assert.match(source, new RegExp(control));
  }
});
