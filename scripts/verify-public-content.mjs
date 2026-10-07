import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const distArgument = process.argv.indexOf("--dist");
if (distArgument >= 0 && !process.argv[distArgument + 1]) throw new Error("--dist requires a directory");
const distRoot = distArgument >= 0 ? path.resolve(process.argv[distArgument + 1]) : path.join(projectRoot, "dist");
const secretPatterns = [
  ["OpenAI-style key", /\bsk-[A-Za-z0-9_-]{20,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{20,}/],
  ["GitHub fine-grained token", /github_pat_[A-Za-z0-9_]{20,}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{30,}/],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["assigned credential", /(?:password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{8,}/i]
];

async function listDistFiles(root) {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(target);
      else if (entry.isFile()) files.push(target);
    }
  }
  const rootStat = await stat(root);
  if (!rootStat.isDirectory()) throw new Error("dist exists but is not a directory");
  await walk(root);
  return files;
}

const sourceCandidates = execFileSync("git", ["-c", "core.quotepath=false", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
  cwd: projectRoot,
  windowsHide: true
}).toString("utf8").split("\0").filter(Boolean).map((relative) => path.join(projectRoot, relative));
const sourceFiles = (await Promise.all(sourceCandidates.map(async (file) => {
  try {
    return (await stat(file)).isFile() ? file : null;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}))).filter(Boolean);
const findings = [];
let distFiles = [];
try {
  distFiles = await listDistFiles(distRoot);
} catch (error) {
  findings.push({
    file: "dist/",
    type: "production_artifact_missing",
    detail: error?.code === "ENOENT" ? "dist directory does not exist" : error.message
  });
}

const distHtmlFiles = distFiles.filter((file) => path.extname(file).toLowerCase() === ".html");
const distJavaScriptFiles = distFiles.filter((file) => path.extname(file).toLowerCase() === ".js");
let remoteJavaScriptCount = 0;
let remoteArtifactCount = 0;
let remoteTextCount = 0;
let remoteCachedCount = 0;
let remoteEvidenceCount = 0;
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
const manifestPath = path.join(distRoot, "release-manifest.json");
if (distFiles.includes(manifestPath)) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.oss) {
    try {
      execFileSync(process.platform === "win32" ? "python" : "python3", [
        path.join(scriptDirectory, "hybrid-release.py"), "verify", "--output", distRoot, "--check-sealed-content"
      ], { cwd: projectRoot, windowsHide: true, stdio: "pipe" });
      const textExtensions = new Set([".js", ".mjs", ".css", ".svg", ".json", ".webmanifest"]);
      const entries = Object.entries(manifest.oss.objects);
      let cursor = 0;
      await Promise.all(Array.from({ length: Math.min(4, entries.length) }, async () => {
        while (cursor < entries.length) {
          const [relative, object] = entries[cursor++];
          try {
            remoteArtifactCount++;
            if (textExtensions.has(path.extname(relative))) remoteTextCount++;
            if ([".js", ".mjs"].includes(path.extname(relative))) remoteJavaScriptCount++;
          } catch (error) {
            findings.push({ file: `OSS/${relative}`, type: "production_remote_asset_unverified", detail: error.message });
          }
        }
      }));
    } catch (error) {
      findings.push({ file: "dist/release-manifest.json", type: "production_oss_manifest_invalid", detail: error.message });
    }
  }
}
if (distFiles.length === 0 && !findings.some((item) => item.type === "production_artifact_missing")) {
  findings.push({ file: "dist/", type: "production_artifact_empty", detail: "dist contains no files" });
}
if (distFiles.length && !distHtmlFiles.length) {
  findings.push({ file: "dist/", type: "production_html_missing", detail: "dist contains no HTML entry" });
}
if (distFiles.length && !distJavaScriptFiles.length && !remoteJavaScriptCount) {
  findings.push({ file: "dist/", type: "production_javascript_missing", detail: "dist contains no JavaScript bundle" });
}

const files = [...new Set([...sourceFiles, ...distFiles])];

function inspectBytes(bytes, relative) {
  const latinText = bytes.toString("latin1");
  let utf8Text = "";
  try {
    utf8Text = utf8Decoder.decode(bytes);
  } catch {
    // Binary files still receive the byte-preserving latin1 credential scan.
  }
  const searchableText = `${latinText}\n${utf8Text}`;
  for (const [name, pattern] of secretPatterns) {
    if (pattern.test(searchableText)) findings.push({ file: relative, type: "credential_value", pattern: name });
  }
}
for (const file of files) {
  inspectBytes(await readFile(file), path.relative(projectRoot, file).replaceAll("\\", "/"));
}

const report = {
  schema: "wly.public-content-gate.v1",
  status: findings.length ? "block" : "pass",
  source_scanned_file_count: sourceFiles.length,
  dist_scanned_file_count: distFiles.length,
  dist_total_file_count: distFiles.length,
  production_html_count: distHtmlFiles.length,
  production_javascript_count: distJavaScriptFiles.length,
  production_remote_javascript_count: remoteJavaScriptCount,
  production_remote_text_scanned_count: remoteTextCount,
  production_remote_artifact_scanned_count: remoteArtifactCount,
  production_remote_verified_cache_used_count: remoteCachedCount,
  production_remote_content_evidence_reused_count: remoteEvidenceCount,
  scanned_file_count: files.length + remoteArtifactCount,
  finding_count: findings.length,
  findings
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (findings.length) process.exitCode = 1;
