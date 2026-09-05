import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { inspectRetainedRuleSnapshot, canRetainRuleObservation, ruleSnapshotPaths } from "../scripts/retained-rule-snapshot.mjs";

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "retained-rules-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const websiteRoot = path.join(root, "website");
  const sourceRoot = path.join(root, "source");
  const git = (cwd, ...args) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", windowsHide: true, stdio: ["ignore", "pipe", "pipe"] }).trim();
  for (const dir of [websiteRoot, sourceRoot]) {
    mkdirSync(dir);
    git(dir, "init", "-b", "main");
    git(dir, "config", "user.email", "fixture@example.invalid");
    git(dir, "config", "user.name", "Fixture");
    git(dir, "config", "core.autocrlf", "true");
  }
  const write = (dir, file, body) => {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), body);
  };
  const commit = (dir) => { git(dir, "add", "--all"); git(dir, "commit", "-m", "fixture"); return git(dir, "rev-parse", "HEAD"); };
  const documentedRules = Array.from({ length: 5 }, (_, i) => ({ logicalId: `rule_${i}`, sourcePath: path.join(sourceRoot, `rule-${i}.md`) }));
  const ruleBinding = documentedRules.map((rule, i) => {
    const body = `原始规则 ${i}\n`;
    writeFileSync(rule.sourcePath, body);
    return { logicalId: rule.logicalId, bytes: Buffer.byteLength(body), sha256: createHash("sha256").update(body).digest("hex") };
  });
  const authority = { releaseId: "E101", gitCommit: commit(sourceRoot) };
  git(sourceRoot, "update-ref", "refs/remotes/origin/main", "HEAD");
  for (const file of ruleSnapshotPaths) write(websiteRoot, file, "unchanged observed snapshot\n");
  commit(websiteRoot);
  git(websiteRoot, "update-ref", "refs/remotes/origin/main", "HEAD");
  write(websiteRoot, "chinese-asr.txt", "dictation\n");
  commit(websiteRoot);
  return { websiteRoot, sourceRoot, authority, ruleBinding, documentedRules, git, write, commit };
}

test("an unrelated candidate retains only unchanged published rule surfaces and original Git bytes", (t) => {
  const f = fixture(t);
  for (const file of ruleSnapshotPaths) f.write(f.websiteRoot, file, "unchanged observed snapshot\r\n");
  const evidence = inspectRetainedRuleSnapshot(f);
  assert.equal(evidence.status, "pass", JSON.stringify(evidence));
  const live = { status: "pass", reason: "e_rules_active_verified", verified_current: { release_id: "E112" } };
  assert.equal(canRetainRuleObservation(f.authority, live, evidence), true);
  assert.equal(canRetainRuleObservation(f.authority, { ...live, status: "block" }, evidence), false);
  assert.equal(canRetainRuleObservation(f.authority, { ...live, verified_current: { release_id: "E101" } }, evidence), false);
  assert.equal(canRetainRuleObservation(f.authority, { ...live, verified_current: { release_id: "E100" } }, evidence), false);
});

for (const file of ruleSnapshotPaths) test(`editing ${file} cannot retain the older release`, (t) => {
  const f = fixture(t);
  f.write(f.websiteRoot, file, "changed rule meaning or observation\n");
  const evidence = inspectRetainedRuleSnapshot(f);
  assert.equal(evidence.status, "block");
  assert.ok(evidence.failures.some((item) => item.code === "retained_snapshot_surface_changed" && item.detail === file));
});

test("missing published baseline and unpublished source commits cannot become retained evidence", (t) => {
  const f = fixture(t);
  f.git(f.websiteRoot, "update-ref", "-d", "refs/remotes/origin/main");
  assert.ok(inspectRetainedRuleSnapshot(f).failures.some((item) => item.code === "retained_snapshot_published_baseline_unavailable"));
  f.write(f.sourceRoot, "new.txt", "not published\n");
  f.authority.gitCommit = f.commit(f.sourceRoot);
  assert.ok(inspectRetainedRuleSnapshot(f).failures.some((item) => item.code === "retained_snapshot_source_not_published"));
});

test("a present published commit cannot excuse mismatched or unavailable original rule bytes", (t) => {
  const f = fixture(t);
  f.ruleBinding[0].sha256 = "0".repeat(64);
  f.documentedRules[1].sourcePath = path.join(f.sourceRoot, "missing.md");
  const evidence = inspectRetainedRuleSnapshot(f);
  assert.equal(evidence.status, "block");
  assert.deepEqual(evidence.failures.map((item) => item.detail), ["rule_0", "rule_1"]);
});
