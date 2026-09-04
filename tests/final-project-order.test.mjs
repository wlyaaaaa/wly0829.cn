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
const agentsRules = await readFile(path.join(projectRoot, "AGENTS.md"), "utf8");
const wechatDirectSource = await readFile(path.join(projectRoot, "app", "content-wechatdirect.js"), "utf8");
const personalHealthSource = await readFile(path.join(projectRoot, "app", "content-personal-health.js"), "utf8");
const systemSource = await readFile(path.join(projectRoot, "app", "system-home-content.js"), "utf8");
const designQa = await readFile(path.join(projectRoot, "design-qa.md"), "utf8");

test("the final project plan fixes one complete value order without placeholder projects", () => {
  assert.equal(plan.schema, "wly.personal-panel-final-project-order.v1");
  assert.equal(plan.target_project_count, 35);
  assert.match(plan.ranking_basis, /consensus total net value for a broad rational audience/);
  assert.match(plan.ranking_rules.join("\n"), /do not add points for the owner's current usage frequency/);
  assert.match(plan.display_rule, /missing ranks remain absent.*never create placeholder cards or routes/);
  assert.match(plan.construction_rule, /smallest final_rank still marked planned.*publication and public read-back/);
  assert.doesNotMatch(plan.construction_rule, /construction_hold|held project|removes the hold/);
  assert.equal(plan.ranking_rules.length, 4);

  assert.equal(plan.projects.length, 35);
  assert.deepEqual(plan.projects.map((item) => item.final_rank), Array.from({ length: 35 }, (_, index) => index + 1));
  assert.equal(new Set(plan.projects.map((item) => item.id)).size, 35);

  const published = plan.projects.filter((item) => item.state === "published");
  const planned = plan.projects.filter((item) => item.state === "planned");
  assert.equal(published.length, 23);
  assert.equal(planned.length, 12);
  assert.equal(planned[0].final_rank, Math.min(...planned.map((item) => item.final_rank)));
  assert.equal(planned[0].final_rank, 15);
  assert.equal(typeof planned[0].source, "string");
  assert.ok(readme.includes(`#${planned[0].final_rank} ${planned[0].id}`), "README next project drifted from the final plan");
  assert.equal(plan.projects.some((item) => Object.hasOwn(item, "construction_hold")), false);
  assert.equal(plan.projects.some((item) => item.id === "md-triple-tactics-talent-solver"), false);
  assert.equal(registry.projects.some((item) => item.id === "md-triple-tactics-talent-solver"), false);
  assert.equal(projectCatalog.some((entry) => entry.registration.id === "md-triple-tactics-talent-solver"), false);
  assert.equal(routePaths.includes("/projects/md-triple-tactics-talent-solver"), false);
  assert.doesNotMatch(generatedIndex, /\/projects\/md-triple-tactics-talent-solver/);
  assert.match(systemSource, /md-triple-tactics-talent-solver.*历史.*不属于 35 个独立项目.*不生成项目卡、路由、内容包或未来施工项/s);
  assert.match(readme, /md-triple-tactics-talent-solver.*历史 GitHub 总账资产.*不属于独立项目规划.*不生成项目卡、路由、内容包或未来施工项/s);
  assert.doesNotMatch(agentsRules, /construction_hold|Rank 36|thirty-six-project/);
  assert.match(designQa, /固定 35 项价值顺序.*35 个独立项目.*22 个项目已经发布.*13 个项目仍待建设/s);
  assert.doesNotMatch(designQa, /固定 36 项|36 个独立项目|14 个项目仍待建设|construction_hold|rank 36|Rank 36/);

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
  assert.equal(plan.non_card_explanations.length, 11);
  assert.equal(plan.non_card_explanations.filter((item) => item.status === "done").length, 11);
  assert.equal(plan.non_card_explanations.filter((item) => item.status === "todo").length, 0);
  assert.equal(plan.non_card_explanations.some((item) => item.id === "md-triple-tactics-ledger-asset" && item.status === "done"), true);
  assert.equal(plan.non_card_explanations.some((item) => item.id === "wechat-pre-public-private-archive" && item.status === "done"), true);
  assert.equal(plan.non_card_explanations.some((item) => item.id === "health-longevity-early-project" && item.status === "done"), true);
  assert.match(wechatDirectSource, /WeChatDirect-private-archive.*公开前.*PRIVATE 仓库已经归档.*不生产.*现役.*PUBLIC WeChatDirect/s);
  assert.match(personalHealthSource, /HealthLongevity.*早期项目.*不再拥有任何写入.*personal-health.*Health Owner.*没有读取.*健康记录、诊断、数值和私人正文/s);
  assert.match(systemSource, /WeChatDirect-private-archive|wechat-direct-private-archive/);
  assert.match(systemSource, /HealthLongevity.*不再拥有写入.*personal-health/s);
  assert.deepEqual(plan.private_exclusion_boundary, {
    excluded_project_count: 4,
    public_todo_forbidden: true,
    authority: "docs/design/private-content-rules.md"
  });
});
