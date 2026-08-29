import { execFileSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const forbiddenTerms = [
  "Q29kZXg=",
  "Q29kZXhIYXJuZXNz",
  "UGVyc29uYWxPUw==",
  "UGVyc29uYWxLbm93bGVkZ2VCYXNl",
  "cGVyc29uYWwtbGl0aWdhdGlvbg==",
  "6K+J6K68",
  "QUkg5aSn5qih5Z6L",
  "QUnlpKfmqKHlnos=",
  "QUkg5pWZ57uD",
  "QUnmlZnnu4M="
].map((value) => Buffer.from(value, "base64").toString("utf8"));
const secretPatterns = [
  ["OpenAI-style key", /sk-[A-Za-z0-9_-]{20,}/],
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

const sourceFiles = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
  cwd: projectRoot,
  encoding: "utf8",
  windowsHide: true
}).split(/\r?\n/).filter(Boolean).map((relative) => path.join(projectRoot, relative));
const findings = [];
let distFiles = [];
try {
  distFiles = await listDistFiles(path.join(projectRoot, "dist"));
} catch (error) {
  findings.push({
    file: "dist/",
    type: "production_artifact_missing",
    detail: error?.code === "ENOENT" ? "dist directory does not exist" : error.message
  });
}

const distHtmlFiles = distFiles.filter((file) => path.extname(file).toLowerCase() === ".html");
const distJavaScriptFiles = distFiles.filter((file) => path.extname(file).toLowerCase() === ".js");
if (distFiles.length === 0 && !findings.some((item) => item.type === "production_artifact_missing")) {
  findings.push({ file: "dist/", type: "production_artifact_empty", detail: "dist contains no files" });
}
if (distFiles.length && !distHtmlFiles.length) {
  findings.push({ file: "dist/", type: "production_html_missing", detail: "dist contains no HTML entry" });
}
if (distFiles.length && !distJavaScriptFiles.length) {
  findings.push({ file: "dist/", type: "production_javascript_missing", detail: "dist contains no JavaScript bundle" });
}

const files = [...new Set([...sourceFiles, ...distFiles])];
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });

for (const file of files) {
  const bytes = await readFile(file);
  const latinText = bytes.toString("latin1");
  let utf8Text = "";
  try {
    utf8Text = utf8Decoder.decode(bytes);
  } catch {
    // Binary files still receive the byte-preserving latin1 credential scan.
  }
  const searchableText = `${latinText}\n${utf8Text}`;
  const relative = path.relative(projectRoot, file).replaceAll("\\", "/");
  for (const term of forbiddenTerms) {
    if (searchableText.toLowerCase().includes(term.toLowerCase())) findings.push({ file: relative, type: "forbidden_public_term", term });
  }
  for (const [name, pattern] of secretPatterns) {
    if (pattern.test(searchableText)) findings.push({ file: relative, type: "credential_value", pattern: name });
  }
}

const report = {
  schema: "wly.public-content-gate.v1",
  status: findings.length ? "block" : "pass",
  source_scanned_file_count: sourceFiles.length,
  dist_scanned_file_count: distFiles.length,
  dist_total_file_count: distFiles.length,
  production_html_count: distHtmlFiles.length,
  production_javascript_count: distJavaScriptFiles.length,
  scanned_file_count: files.length,
  finding_count: findings.length,
  findings
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (findings.length) process.exitCode = 1;
