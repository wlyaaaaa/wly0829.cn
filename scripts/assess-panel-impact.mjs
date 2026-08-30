import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const registry = JSON.parse(await readFile(path.join(projectRoot, "config", "panel-projects.json"), "utf8"));

const projectArg = process.argv.indexOf("--project");
const projectId = projectArg >= 0 ? process.argv[projectArg + 1] : "";
const changedPaths = process.argv
  .flatMap((value, index, args) => value === "--path" ? [args[index + 1]] : [])
  .filter(Boolean)
  .map((value) => value.replaceAll("\\", "/"));
const generationChanged = process.argv.includes("--generation-changed");
const materialChange = process.argv.includes("--material-change");

if (!projectId) throw new Error("--project is required");
const project = registry.projects.find((item) => item.id === projectId && item.enabled);
if (!project) throw new Error(`unknown or disabled panel project: ${projectId}`);

if (project.ai_refresh?.mode === "manual_owner_only") {
  const result = {
    schema: "wly.personal-panel-impact.v1",
    project_id: project.id,
    refresh_mode: "manual_owner_only",
    impact_candidate: false,
    material_change_confirmed: false,
    source_materiality_ignored: materialChange,
    task_required: false,
    reasons: ["manual_owner_only_no_source_or_skill_handoff"],
    changed_paths: changedPaths,
    action: "manual_owner_request_required_no_automatic_handoff",
    registry: "config/panel-projects.json"
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(0);
}

function matches(pattern, candidate) {
  const normalized = pattern.replaceAll("\\", "/");
  let expression = "^";
  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    if (character === "*" && normalized[index + 1] === "*") {
      expression += ".*";
      index += 1;
    } else if (character === "*") {
      expression += "[^/]*";
    } else {
      expression += character.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    }
  }
  expression += "$";
  return new RegExp(expression, "i").test(candidate);
}

const reasons = [];
if (generationChanged) reasons.push("active_generation_changed");
for (const changedPath of changedPaths) {
  for (const source of project.impact_sources) {
    for (const pattern of source.paths || []) {
      if (matches(pattern, changedPath)) {
        reasons.push(`${source.kind}:${changedPath}`);
        break;
      }
    }
  }
}

const uniqueReasons = [...new Set(reasons)];
const result = {
  schema: "wly.personal-panel-impact.v1",
  project_id: project.id,
  impact_candidate: uniqueReasons.length > 0,
  material_change_confirmed: materialChange,
  task_required: uniqueReasons.length > 0 && materialChange,
  reasons: uniqueReasons,
  changed_paths: changedPaths,
  action: uniqueReasons.length > 0 && materialChange
    ? "create_fresh_independent_website_project_task_after_source_readback"
    : uniqueReasons.length
      ? "record_candidate_and_wait_for_materiality_decision"
      : "no_website_task",
  registry: "config/panel-projects.json"
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
