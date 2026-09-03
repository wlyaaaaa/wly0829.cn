import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { project } from "../app/content-core.js";
import { pcconfigProject } from "../app/content-pcconfig.js";
import { githubIndexProject } from "../app/content-github-index.js";
import { chineseAsrProject } from "../app/content-chinese-asr.js";
import { timeAuditProject } from "../app/content-timeaudit.js";
import { pcPanelHubProject } from "../app/content-pc-panel-hub.js";
import { cacbProject } from "../app/content-cacb.js";
import { learningProject } from "../app/content-learning.js";
import { codexRemoteProject } from "../app/content-codex-remote.js";
import { personalHealthProject } from "../app/content-personal-health.js";
import { wechatDirectProject } from "../app/content-wechatdirect.js";
import { personalMaterialsProject } from "../app/content-personal-materials.js";
import { documentMaterialsProject } from "../app/content-document-materials.js";
import { workDeliveryProject } from "../app/content-work-delivery.js";
import { dailyPreferencesProject } from "../app/content-daily-preferences.js";
import { personalMediaProject } from "../app/content-personal-media.js";
import { localOcrProject } from "../app/content-localocr.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packages = [
  [project, "app/content-core.js"],
  [pcconfigProject, "app/content-pcconfig.js"],
  [githubIndexProject, "app/content-github-index.js"],
  [chineseAsrProject, "app/content-chinese-asr.js"],
  [timeAuditProject, "app/content-timeaudit.js"],
  [pcPanelHubProject, "app/content-pc-panel-hub.js"],
  [cacbProject, "app/content-cacb.js"],
  [learningProject, "app/content-learning.js"],
  [codexRemoteProject, "app/content-codex-remote.js"],
  [personalHealthProject, "app/content-personal-health.js"],
  [wechatDirectProject, "app/content-wechatdirect.js"],
  [personalMaterialsProject, "app/content-personal-materials.js"],
  [documentMaterialsProject, "app/content-document-materials.js"],
  [workDeliveryProject, "app/content-work-delivery.js"],
  [dailyPreferencesProject, "app/content-daily-preferences.js"],
  [personalMediaProject, "app/content-personal-media.js"],
  [localOcrProject, "app/content-localocr.js"]
];

test("all seventeen project surfaces are deterministic projections of one currentSnapshot", () => {
  for (const [candidate] of packages) {
    const snapshot = candidate.currentSnapshot;
    assert.ok(snapshot && typeof snapshot === "object", `${candidate.slug} has no currentSnapshot`);
    assert.ok(Number.isFinite(Date.parse(snapshot.observedAt)), `${candidate.slug} observedAt is invalid`);
    assert.ok(snapshot.metrics.length >= 3 && snapshot.metrics.length <= 4, `${candidate.slug} metrics are not card-sized`);
    assert.ok(snapshot.facts.some((fact) => fact.hero), `${candidate.slug} has no visible snapshot facts`);
    assert.ok(snapshot.gaps.length >= 1, `${candidate.slug} has no explicit gap`);

    assert.deepEqual(candidate.cardMetrics, snapshot.metrics.map(({ label, value }) => ({ label, value })));
    assert.deepEqual(candidate.heroFacts, snapshot.facts.filter((fact) => fact.hero).map(({ label, value }) => ({ label, value })));
    assert.deepEqual(candidate.currentState, {
      observedAt: snapshot.observedAt,
      label: snapshot.label,
      facts: snapshot.facts.map(({ value }) => value),
      gaps: snapshot.gaps
    });
    assert.equal(candidate.snapshotBoundary, `观察于 ${snapshot.observedAt}；${snapshot.boundary}`);

    const factText = snapshot.facts.map(({ value }) => value).join("\n");
    for (const metric of snapshot.metrics) {
      const tokens = metric.value.match(/(?:[Ev]\d+(?:\.\d+)+|\d+(?:\.\d+)?(?:\/\d+)?)/g) || [];
      assert.ok(typeof metric.value === "string" && metric.value.trim(), `${candidate.slug}/${metric.label} has no value or state`);
      for (const token of tokens) assert.ok(factText.includes(token) || token.length === 1, `${candidate.slug}/${metric.label} is not traceable to currentSnapshot facts: ${token}`);
    }
  }
});

test("project content files do not maintain four independent snapshot surfaces", async () => {
  for (const [candidate, relativePath] of packages) {
    const source = await readFile(path.join(projectRoot, relativePath), "utf8");
    assert.match(source, /createProjectSnapshot\s*\(/, `${candidate.slug} does not declare its snapshot through the shared projector`);
    assert.doesNotMatch(source, /^  (?:cardMetrics|heroFacts|currentState|snapshotBoundary):/m, `${candidate.slug} keeps a second project surface ledger`);
  }
});
