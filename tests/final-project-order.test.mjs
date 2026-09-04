import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { projectCatalog, routePaths } from "../app/site-content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(await readFile(path.join(projectRoot, "config", "final-project-order.json"), "utf8"));
const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));
const generatedIndex = await readFile(path.join(projectRoot, "app", "project-content-index.generated.js"), "utf8");
const readme = await readFile(path.join(projectRoot, "README.md"), "utf8");

test("the final project plan fixes one complete value order without placeholder projects", () => {
  assert.equal(plan.schema, "wly.personal-panel-final-project-order.v1");
  assert.equal(plan.target_project_count, 36);
  assert.match(plan.ranking_basis, /consensus total net value for a broad rational audience/);
  assert.match(plan.ranking_rules.join("\n"), /do not add points for the owner's current usage frequency/);
  assert.match(plan.display_rule, /missing ranks remain absent.*never create placeholder cards or routes/);
  assert.match(plan.construction_rule, /smallest final_rank still marked planned.*publication and public read-back/);
  assert.equal(plan.ranking_rules.length, 4);

  assert.equal(plan.projects.length, 36);
  assert.deepEqual(plan.projects.map((item) => item.final_rank), Array.from({ length: 36 }, (_, index) => index + 1));
  assert.equal(new Set(plan.projects.map((item) => item.id)).size, 36);

  const published = plan.projects.filter((item) => item.state === "published");
  const planned = plan.projects.filter((item) => item.state === "planned");
  assert.equal(published.length, 22);
  assert.equal(planned.length, 14);
  assert.equal(planned[0].final_rank, Math.min(...planned.map((item) => item.final_rank)));
  assert.equal(typeof planned[0].source, "string");
  assert.ok(readme.includes(`#${planned[0].final_rank} ${planned[0].id}`), "README next project drifted from the final plan");

  const planById = new Map(plan.projects.map((item) => [item.id, item]));
  const enabled = registry.projects.filter((item) => item.enabled).sort((left, right) => left.order - right.order);
  assert.deepEqual(enabled.map((item) => item.order), published.map((item) => item.final_rank));
  assert.deepEqual(enabled.map((item) => item.id), published.map((item) => item.id));
  assert.deepEqual(projectCatalog.map((entry) => entry.registration.id), published.map((item) => item.id));
  for (const registration of enabled) {
    assert.equal(registration.order, planById.get(registration.id)?.final_rank, `${registration.id} drifted from its fixed final rank`);
  }

  const registeredIds = new Set(registry.projects.map((item) => item.id));
  for (const item of planned) {
    assert.equal(registeredIds.has(item.id), false, `${item.id} entered the published registry before construction`);
    assert.equal(routePaths.includes(`/projects/${item.id}`), false, `${item.id} received a placeholder route`);
    assert.equal(generatedIndex.includes(`["${item.id}"`), false, `${item.id} entered the generated content index`);
    assert.equal(Object.hasOwn(item, "route"), false);
    assert.equal(Object.hasOwn(item, "content_path"), false);
  }
});

test("non-card explanations keep only real remaining work and private exclusions stay non-public", () => {
  assert.equal(plan.non_card_explanations.length, 10);
  assert.equal(plan.non_card_explanations.filter((item) => item.status === "done").length, 8);
  assert.deepEqual(
    plan.non_card_explanations.filter((item) => item.status === "todo").map((item) => item.id),
    ["wechat-pre-public-private-archive", "health-longevity-early-project"]
  );
  assert.deepEqual(plan.private_exclusion_boundary, {
    excluded_project_count: 4,
    public_todo_forbidden: true,
    authority: "docs/design/private-content-rules.md"
  });
});
