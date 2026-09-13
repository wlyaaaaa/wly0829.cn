import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

// An unrelated publication may preserve an existing observation, but cannot
// create or edit one under the authority of an older installed release.
export const ruleSnapshotPaths = [
  "app/content-rule-guides.js",
  "config/panel-rule-bindings.json"
];

const skillSupplyProjectionPaths = ["app/panel-facts.generated.js", "app/content-core.js"];

export function normalisePanelFacts(text) {
  const match = /export const generatedPanelFacts = ([\s\S]*);\s*$/.exec(text);
  if (!match) return null;
  const prefix = text.slice(0, match.index);
  let facts;
  try { facts = JSON.parse(match[1]); } catch { return null; }
  const sourceWorktreeFields = ["sourceWorktreeClean", "sourcePublicWorktreeClean"].filter((key) => Object.hasOwn(facts, key));
  if (sourceWorktreeFields.length !== 1 || typeof facts[sourceWorktreeFields[0]] !== "boolean") return null;
  const clean = facts[sourceWorktreeFields[0]];
  delete facts.sourceWorktreeClean;
  delete facts.sourcePublicWorktreeClean;
  facts.sourcePublicWorktreeClean = clean;
  const skills = facts.skills || {};
  const allowed = new Set(["activeInstallIntent", "transactionCampaignCount", "publicRegisteredCount", "publicInstallIntentCount", "publicInactiveIntentCount", "retiredSkillCount"]);
  for (const key of Object.keys(skills)) if (allowed.has(key)) delete skills[key];
  const row = facts.validation?.rows?.find((item) => item.layer === "Skill supply（能力供应）");
  if (!row) return null;
  if (Object.keys(row).some((key) => !["layer", "status", "label", "detail"].includes(key))) return null;
  row.detail = "[public-skill-supply-projection]";
  if (facts.integrity?.schema !== "wly.panel-facts-integrity.v1" || facts.integrity?.algorithm !== "sha256") return null;
  delete facts.integrity.payloadSha256;
  return `${prefix}${JSON.stringify(facts)}`;
}

export function normaliseContentCore(text) {
  const normalised = text
    .replaceAll("publicInstallIntentCount", "activeInstallIntent")
    .replaceAll("当前公开范围内${panelSnapshot.skills.activeInstallIntent}个安装意图", "当前${panelSnapshot.skills.activeInstallIntent}个安装意图")
    .replace(/\n  \|\| !Number\.isInteger\(generatedPanelFacts\?\.skills\?\.(?:public(?:RegisteredCount|InactiveIntentCount|InstallIntentCount)|retiredSkillCount)\)/g, "")
    .replace(/\n  \|\| !Number\.isInteger\(generatedPanelFacts\?\.skills\?\.transactionCampaignCount\)/g, "")
    .replace(/\{ label: "Skill 供应快照", value: `[^`]*`, hero: false \},/, "{ label: \"Skill 供应快照\", value: \"[public-skill-supply-projection]\", hero: false },")
    .replace(/\{ label: "供给与展示口径", value: [^\n]*\},/, "{ label: \"供给与展示口径\", value: \"[public-skill-supply-projection]\", hero: false },");
  return normalised.includes('{ label: "Skill 供应快照", value: "[public-skill-supply-projection]", hero: false },')
    && normalised.includes('{ label: "供给与展示口径", value: "[public-skill-supply-projection]", hero: false },')
    ? normalised
    : null;
}

function isAllowedSkillSupplyProjection(file, baselineText, candidateText) {
  baselineText = baselineText.replaceAll("\r\n", "\n");
  candidateText = candidateText.replaceAll("\r\n", "\n");
  if (baselineText === candidateText) return true;
  if (file === "app/panel-facts.generated.js") return normalisePanelFacts(baselineText) === normalisePanelFacts(candidateText) && normalisePanelFacts(candidateText) !== null;
  if (file === "app/content-core.js") {
    const baseline = normaliseContentCore(baselineText);
    const candidate = normaliseContentCore(candidateText);
    return baseline !== null && candidate !== null && baseline === candidate;
  }
  return false;
}

export function inspectRetainedRuleSnapshot({ websiteRoot, sourceRoot, authority, ruleBinding, documentedRules }) {
  const failures = [];
  const git = (cwd, args) => spawnSync("git", ["-C", cwd, ...args], { windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  const text = (result) => result.stdout?.toString("utf8").trim();
  const published = git(websiteRoot, ["rev-parse", "refs/remotes/origin/main"]);
  if (published.status !== 0 || git(websiteRoot, ["merge-base", "--is-ancestor", text(published), "HEAD"]).status !== 0) {
    failures.push({ code: "retained_snapshot_published_baseline_unavailable", detail: "origin/main must be available and an ancestor of this candidate" });
  }
  for (const file of ruleSnapshotPaths) {
    const baseline = git(websiteRoot, ["rev-parse", `refs/remotes/origin/main:${file}`]);
    // Git's own clean conversion makes CRLF checkouts comparable to LF blobs.
    const candidate = git(websiteRoot, ["hash-object", `--path=${file}`, file]);
    if (baseline.status !== 0 || candidate.status !== 0 || text(baseline) !== text(candidate)) {
      failures.push({ code: "retained_snapshot_surface_changed", detail: file });
    }
  }
  for (const file of skillSupplyProjectionPaths) {
    const baseline = git(websiteRoot, ["show", `refs/remotes/origin/main:${file}`]);
    let candidateText = null;
    try { candidateText = readFileSync(path.join(websiteRoot, file), "utf8"); } catch {}
    if (baseline.status !== 0 || candidateText === null || !isAllowedSkillSupplyProjection(file, baseline.stdout.toString("utf8"), candidateText)) {
      failures.push({ code: "retained_snapshot_surface_changed", detail: file });
    }
  }
  if (!/^[a-f0-9]{40}$/.test(authority.gitCommit || "") || git(sourceRoot, ["merge-base", "--is-ancestor", authority.gitCommit, "refs/remotes/origin/main"]).status !== 0) {
    failures.push({ code: "retained_snapshot_source_not_published", detail: authority.gitCommit });
    return { status: "block", baselineCommit: text(published), failures };
  }
  for (const rule of documentedRules) {
    const relative = path.relative(sourceRoot, rule.sourcePath).replaceAll("\\", "/");
    if (!relative || relative.startsWith("../") || path.isAbsolute(relative)) {
      failures.push({ code: "retained_snapshot_source_path_invalid", detail: rule.logicalId });
      continue;
    }
    const blob = git(sourceRoot, ["show", `${authority.gitCommit}:${relative}`]);
    const bound = ruleBinding.find((item) => item.logicalId === rule.logicalId);
    if (blob.status !== 0 || !bound || blob.stdout.length !== Number(bound.bytes) || createHash("sha256").update(blob.stdout).digest("hex") !== bound.sha256) {
      failures.push({ code: "retained_snapshot_source_bytes_mismatch", detail: rule.logicalId });
    }
  }
  return { status: failures.length ? "block" : "pass", baselineCommit: text(published), failures };
}

export function canRetainRuleObservation(authority, liveRelease, evidence) {
  const current = liveRelease?.verified_current;
  return liveRelease?.status === "pass" && liveRelease?.reason === "e_rules_active_verified"
    && /^E\d+$/.test(authority.releaseId) && /^E\d+$/.test(current?.release_id || "")
    && Number(authority.releaseId.slice(1)) < Number(current.release_id.slice(1))
    && evidence?.status === "pass";
}
