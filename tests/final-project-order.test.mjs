import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const json = async (name) => JSON.parse(await readFile(new URL(`../config/${name}.json`, import.meta.url), "utf8"));
test("published registrations preserve the accepted project identities and fixed value ranks", async () => {
  const order = await json("final-project-order"), registry = await json("panel-projects");
  const enabled = registry.projects.filter((item) => item.enabled).sort((a, b) => a.order - b.order);
  const published = order.projects.filter((item) => item.state === "published");
  assert.deepEqual(enabled.map((item) => [item.id, item.order]), published.map((item) => [item.id, item.final_rank]));
  assert.equal(new Set(enabled.map((item) => item.id)).size, enabled.length);
  for (const item of enabled) {
    assert.ok(!item.ai_refresh.content_path.startsWith("app/"), item.id);
    await readFile(new URL(`../${item.ai_refresh.content_path}`, import.meta.url));
  }
  for (const retired of ["scripts", "playbook", "rtx-5090d-ollama", "md-triple-tactics-talent-solver"]) {
    assert.ok(!enabled.some((item) => item.id === retired));
  }
});
