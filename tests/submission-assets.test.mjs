import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function text(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("README states the product and prototype boundary", async () => {
  const readme = await text("../README.md");
  assert.match(readme, /Review-to-Recovery OS/);
  assert.match(readme, /deterministic synthetic demo logic/i);
});

test("demo script includes the differentiating workflow", async () => {
  const demo = await text("../DEMO_SCRIPT.md");
  for (const surface of ["Recovery Command", "Decision Lab", "Recovery Control", "Evaluation Lab", "Agent System"]) {
    assert.match(demo, new RegExp(surface));
  }
});

test("submission checklist protects public-link verification", async () => {
  const checklist = await text("../SUBMISSION_CHECKLIST.md");
  assert.match(checklist, /Public/);
  assert.match(checklist, /incognito\/private window/i);
  assert.match(checklist, /No \.env, API key, token, secret/);
});
