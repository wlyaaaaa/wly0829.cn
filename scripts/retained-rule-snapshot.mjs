import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";

// An unrelated publication may preserve an existing observation, but cannot
// create or edit one under the authority of an older installed release.
export const ruleSnapshotPaths = [
  "app/panel-facts.generated.js",
  "app/content-core.js",
  "app/content-rule-guides.js",
  "config/panel-rule-bindings.json"
];

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
