import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { generatedPanelFacts } from "../app/panel-facts.generated.js";
import documentedRules from "../config/panel-rule-bindings.json" with { type: "json" };
import { canRetainRuleObservation } from "../scripts/retained-rule-snapshot.mjs";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const clone = (value) => JSON.parse(JSON.stringify(value));
const expectedInputPaths = [
  "AGENTS.md",
  "docs/contracts/agents.protected-major-actions.md",
  "docs/contracts/agents.authorization-delegation.md",
  "docs/contracts/agents.four-base-decision-context.md",
  "docs/contracts/agents.capability-routing.md",
  "templates/codex-home/AGENTS.md",
  "tools/Invoke-EAgentRulesRelease.ps1"
];

// Run the real script body with in-memory files and bounded process responses.
// No global rule validator, source checkout, release or filesystem is mutated.
async function executeScript(name, globals) {
  const scriptUrl = new URL("../scripts/" + name, import.meta.url);
  const source = (await readFile(scriptUrl, "utf8"))
    .replace(/^import .*;\r?$/gm, "")
    .replaceAll("import.meta.url", "scriptUrl");
  const output = [];
  const sandbox = {
    Buffer, URL, Date, Intl, path, createHash, fileURLToPath, scriptUrl: scriptUrl.href,
    process: { platform: "linux", pid: 17, once() {}, stdout: { write: (text) => output.push(text) } },
    ...globals
  };
  await vm.runInNewContext("(async () => {\n" + source + "\n})()", sandbox);
  return { report: JSON.parse(output.join("")), exitCode: sandbox.process.exitCode || 0 };
}

async function collect({ dirty = "", ahead = 0, behind = 0, ruleChanged = false, excludedFixture = null, retiredFixtures = [], corruptAux = false, omitCatalog = false, duplicatePrimary = false } = {}) {
  const sourceRoot = "E:\\.agents";
  const sourceCommit = "b".repeat(40);
  const activeCommit = "a".repeat(40);
  const releaseId = generatedPanelFacts.authority.releaseId;
  const files = new Map();
  const key = (value) => path.resolve(value).toLowerCase();
  const write = (file, value) => files.set(key(file), Buffer.from(value));
  const rules = documentedRules.rules.map((rule, index) => {
    const bytes = Buffer.from("Fixture rule " + rule.logicalId + "\n");
    const relativePath = path.win32.relative(sourceRoot, rule.sourcePath);
    const releasePath = path.join(sourceRoot, "releases", releaseId, relativePath);
    write(releasePath, bytes);
    write(rule.sourcePath, ruleChanged && index === 0 ? Buffer.concat([bytes, Buffer.from("candidate\n")]) : bytes);
    return { logical_id: rule.logicalId, relative_path: relativePath, sha256: sha256(bytes), bytes: bytes.length, releasePath };
  });
  const topicCount = rules.length;
  const auxiliary = { logical_id: "codex_entry_template", relative_path: "templates/codex-home/AGENTS.md", sha256: sha256("Fixture template\n"), bytes: Buffer.byteLength("Fixture template\n") };
  write(path.join(sourceRoot,"releases",releaseId,auxiliary.relative_path), corruptAux ? "Changed template\n" : "Fixture template\n");
  rules.push(auxiliary);
  if (!omitCatalog) {
    const catalog = JSON.stringify({documents:[...documentedRules.rules.map(x=>({logical_id:x.logicalId})), ...(duplicatePrimary ? [{logical_id:documentedRules.rules[0].logicalId}] : [])]});
    const descriptor = {logical_id:"rules_catalog",relative_path:"rules-catalog.json",sha256:sha256(catalog),bytes:Buffer.byteLength(catalog)};
    write(path.join(sourceRoot,"releases",releaseId,descriptor.relative_path),catalog);
    rules.push(descriptor);
  }
  const releaseRecord = {
    schema: "agents.e-rules-release.v3", release_id: releaseId, git_commit: activeCommit,
    ruleset_sha256: documentedRules.ruleset_sha256, source_inputs_clean: true,
    input_paths: expectedInputPaths, remote_main_contains_commit: true,
    created_at_utc: "2026-09-06T12:58:00Z"
  };
  const recordBytes = JSON.stringify(releaseRecord);
  write(path.join(sourceRoot, "releases", releaseId, "release.json"), recordBytes);
  const current = {
    release_id: releaseId, git_commit: activeCommit, ruleset_sha256: documentedRules.ruleset_sha256,
    release_record_sha256: sha256(recordBytes), files: rules,
    required_rule_paths: Object.fromEntries(rules.map((rule) => [rule.logical_id, rule.releasePath]))
  };
  const release = {
    status: "pass", reason: "e_rules_active_verified", verified_current: current,
    pointer_sha256: "d".repeat(64),
    pointer: { current, previous: null, pointer_revision: 26, activated_at_utc: "2026-09-06T12:58:39Z" }
  };
  const publicFixture = { name: "public-fixture", source: "skills/public-fixture", install: true };
  const registrySkills = [publicFixture];
  write(path.join(sourceRoot, publicFixture.source, "SKILL.md"), "---\nname: public-fixture\ndescription: Public fixture\n---\n");
  if (excludedFixture) {
    const excluded = { name: "excluded-fixture", source: "skills/excluded-fixture", install: true };
    registrySkills.push(excluded);
    write(path.join(sourceRoot, excluded.source, "SKILL.md"), `---\nname: excluded-fixture\ndescription: Excluded fixture\nmetadata:\n  personal_website: excluded\n---\n${excludedFixture}`);
  }
  for (const retired of retiredFixtures) {
    write(path.join(sourceRoot, retired.source, "SKILL.md"), `---\nname: ${retired.name}\ndescription: Retired fixture\n${retired.excluded ? "metadata:\n  personal_website: excluded\n" : ""}---\n`);
  }
  const skills = [{ slug: "public-fixture", registryName: "public-fixture", sourceKind: "personal_install", sourcePath: "skills/public-fixture/SKILL.md" }];
  const read = async (file, encoding) => {
    let bytes = files.get(key(file));
    if (path.basename(file) === "panel-projects.json") bytes = Buffer.from(JSON.stringify({ projects: [{ id: "agents", enabled: true, source: { visibility: "PRIVATE" } }] }));
    if (path.basename(file) === "panel-rule-bindings.json") bytes = Buffer.from(JSON.stringify(documentedRules));
    if (path.basename(file) === "personal-skill-supply.json") bytes = Buffer.from(JSON.stringify({ skills: registrySkills, retired_skills: retiredFixtures.map(({ name, source }) => ({ name, source })) }));
    assert.ok(bytes, "Unexpected fixture read: " + file);
    return encoding ? bytes.toString(encoding) : bytes;
  };
  const spawnSync = (executable, args) => {
    let stdout;
    if (executable === "git") {
      const command = args.join(" ");
      const responses = {
        "fetch --no-tags origin main": "",
        "rev-parse --show-toplevel": sourceRoot,
        "rev-parse HEAD": sourceCommit,
        "rev-parse origin/main": sourceCommit,
        "branch --show-current": "main",
        "rev-list --left-right --count HEAD...origin/main": ahead + "\t" + behind,
        "status --porcelain=v1 -z": dirty
      };
      stdout = command.startsWith("merge-base --is-ancestor ") ? "" : responses[command];
      assert.notEqual(stdout, undefined, "Unexpected Git call: " + command);
    } else {
      const entry = path.basename(args[args.indexOf("-File") + 1]);
      if (entry === "Invoke-EAgentRulesRelease.ps1") {
        assert.ok(args.includes("Inspect"), "The fixture must never request release activation");
        stdout = JSON.stringify(release);
      } else if (entry === "Test-ControlPlaneContractCoverage.ps1") stdout = JSON.stringify({ status: "pass" });
      else if (entry === "Test-EAgentRulesRelease.ps1") stdout = "fixture validator passed";
      else if (entry === "Test-PersonalSkillSupply.ps1") {
        assert.equal(args[args.indexOf("-SkillName") + 1], "public-fixture", "only public fixture supply is checked");
        stdout = JSON.stringify({ source: { status: "pass" }, install: { status: "pass" }, transaction: { status: "pass", campaign_count: 1 } });
      }
      else assert.fail("Unexpected process entry: " + entry);
    }
    return { status: 0, stdout, stderr: "" };
  };
  await executeScript("refresh-panel-snapshot.mjs", {
    skills, spawnSync, readFile: read,
    mkdirSync() {}, openSync: () => 1, writeFileSync() {}, closeSync() {}, unlinkSync() {},
    readFileSync() { assert.fail("The fixture has no stale lock"); },
    writeFile: async (file, value) => write(file, value),
    rename: async (from, to) => { files.set(key(to), files.get(key(from))); files.delete(key(from)); },
    unlink: async (file) => { files.delete(key(file)); }
  });
  const generated = [...files.entries()].find(([file]) => file.endsWith("panel-facts.generated.js"))?.[1].toString("utf8");
  assert.ok(generated, "Collector did not emit its snapshot");
  return JSON.parse(generated.slice(generated.indexOf(" = ") + 3).trim().replace(/;$/, ""));
}

async function verify(facts) {
  const copy = clone(facts);
  delete copy.integrity;
  copy.integrity = { schema: "wly.panel-facts-integrity.v1", algorithm: "sha256", payloadSha256: sha256(JSON.stringify(copy)) };
  return executeScript("verify-panel-snapshot.mjs", {
    generatedPanelFacts: copy, documentedRuleBindings: documentedRules,
    rulesSnapshot: { ...copy.authority, rules: copy.ruleBinding },
    canRetainRuleObservation,
    skills: [{ sourceKind: "personal_install" }],
    spawnSync() { assert.fail("Portable verification must not invoke the live release"); }
  });
}

test("later published Skill commits retain a passing primary-topic source relation and complete catalog evidence", async () => {
  const facts = await collect();
  assert.notEqual(facts.sourceCommit, facts.authority.gitCommit);
  assert.equal(facts.authority.sourceMatchesRelease, true);
  assert.equal(facts.validation.rows.find((row) => row.layer.startsWith("Source checkout")).status, "pass");
  assert.equal(facts.authority.releaseRecordSchema, "agents.e-rules-release.v3");
  assert.equal(facts.authority.releaseSourceWorktreeClean, null);
  assert.equal(facts.authority.releaseSourceInputsClean, true);
  assert.deepEqual(facts.authority.releaseInputPaths, expectedInputPaths);
  assert.equal(facts.validation.rows.find((row) => row.layer.startsWith("Full local tests")).status, "unknown");
  const result = await verify(facts);
  assert.equal(result.exitCode, 0, JSON.stringify(result.report.findings));
  const rejected = clone(facts);
  rejected.validation.rows.find((row) => row.layer.startsWith("Source checkout")).status = "repair";
  assert.ok((await verify(rejected)).report.findings.some((item) => item.code === "snapshot_matching_published_source_misclassified"));
});

test("excluded fixture metadata leaves the public snapshot unchanged while public entries still disclose changes", async () => {
  const baseline = await collect();
  const excluded = await collect({
    dirty: " M skills/excluded-fixture/SKILL.md\0",
    excludedFixture: "modified privately"
  });
  const projection = (facts) => ({
    sourcePublicWorktreeClean: facts.sourcePublicWorktreeClean,
    sourceDirtyCount: facts.sourceDirtyCount,
    sourceDirtyPaths: facts.sourceDirtyPaths,
    sourceSync: facts.sourceSync,
    skills: facts.skills,
    validation: facts.validation
  });
  assert.deepEqual(projection(excluded), projection(baseline));
  assert.doesNotMatch(JSON.stringify(excluded), /excluded-fixture|Excluded fixture|modified privately/);

  const publicChange = await collect({ dirty: " M skills/public-fixture/SKILL.md\0" });
  assert.equal(publicChange.sourceDirtyCount, 1);
  assert.deepEqual(publicChange.sourceDirtyPaths, ["skills/public-fixture/SKILL.md"]);
  assert.equal(publicChange.validation.rows.find((row) => row.layer.startsWith("Source checkout")).status, "repair");

  const renamedAcrossBoundary = await collect({ dirty: "R  skills/excluded-fixture/SKILL.md\0skills/public-fixture/SKILL.md\0", excludedFixture: "modified privately" });
  assert.equal(renamedAcrossBoundary.sourceDirtyCount, 1);
  assert.deepEqual(renamedAcrossBoundary.sourceDirtyPaths, ["skills/public-fixture/SKILL.md"]);
});

test("retired Skill statistics use retired_skills and omit only explicitly excluded fixtures", async () => {
  const facts = await collect({ retiredFixtures: [
    { name: "retired-public-fixture", source: "skills/retired-public-fixture" },
    { name: "retired-excluded-fixture", source: "skills/retired-excluded-fixture", excluded: true }
  ] });
  assert.equal(facts.skills.retiredSkillCount, 1);
});

for (const [name, state] of [
  ["dirty source", { dirty: " M skills/public-fixture/SKILL.md\0" }],
  ["unpublished commits", { ahead: 1 }],
  ["remote changes", { behind: 1 }],
  ["unactivated rule bytes", { ruleChanged: true }]
]) test(name + " remains disclosed even when other snapshot validation passes", async () => {
  const facts = await collect(state);
  const sourceRow = facts.validation.rows.find((row) => row.layer.startsWith("Source checkout"));
  assert.equal(sourceRow.status, "repair");
  assert.equal((await verify(facts)).exitCode, 0);
  sourceRow.status = "pass";
  assert.ok((await verify(facts)).report.findings.some((item) => item.code === "snapshot_dirty_source_not_disclosed"));
});

for (const [name,options,expected] of [
 ["a changed non-reader template",{corruptAux:true},/complete release file drift/],
 ["a missing release catalog",{omitCatalog:true},/catalog is missing/],
 ["a duplicated primary topic",{duplicatePrimary:true},/material semantic refresh/]
]) test("collector rejects "+name+" without publishing partial facts",async()=>{await assert.rejects(collect(options),expected);});
