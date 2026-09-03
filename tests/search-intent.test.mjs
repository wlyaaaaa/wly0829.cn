import assert from "node:assert/strict";
import test from "node:test";
import { compactSearchScore, createCompactSearchEntry, searchCompactEntries } from "../app/compact-search.js";
import { globalSearchEntries, searchPanel } from "../app/search.js";
import { canonicalPath } from "../app/site-content.js";

const canonicalHref = (href) => {
  const target = new URL(href, "https://wly0829.cn");
  return `${canonicalPath(target.pathname)}${target.search}${target.hash}`;
};
const projectedEntries = globalSearchEntries.map((entry) => createCompactSearchEntry(entry, canonicalHref(entry.href)));
const quickEntries = projectedEntries.filter((entry) => entry.type !== "项目内容");
const browserEntries = [...quickEntries, ...projectedEntries.filter((entry) => entry.type === "项目内容")];
const belongsToProject = (entry, slug) => {
  const parts = new URL(entry.href, "https://wly0829.cn").pathname.split("/");
  return parts[1] === "projects" && parts[2] === slug;
};
const intents = [
  ["昨晚电脑风扇为什么一直很响", "timeaudit"],
  ["找出去年在海边拍的照片", "personal-media"],
  ["截图上写着退货两个字帮我找到那张图", "personal-media"],
  ["我在文件管理器删除了一张照片它还会从备份回来吗", "personal-media"],
  ["记得有一份合同但不知道电脑哪个目录", "personal-materials"],
  ["把正式声明做成能修改和打印签字文件", "document-materials"],
  ["多人录音转文字标出不确定", "chinese-asr"],
  ["归档一个微信群之后只补新增消息", "wechat-direct"],
  ["手机继续电脑AI任务", "codex-remote"],
  ["桌边小屏显示电脑状态", "pc-panel-hub"],
  ["少量问题检验是否理解", "learning"],
  ["不是找照片哈，是那份以前交出去的申请材料，我只记得内容，不记得存哪了。", "personal-materials"],
  ["有几个 AI 同时帮我改东西，怎样避免他们互相覆盖，还能确认最后真的交付了？", "agents"],
  ["几个 AI 都说活干完了，我想用同一道实际任务检验谁交的东西真的能用。", "cacb"],
  ["把这份旁白和素材做成先预览再渲染的4K60视频", "video-scaffold"]
];

test("natural requests expose the owning project within the first visible results", () => {
  for (const [query, projectSlug] of intents) {
    assert.ok(searchPanel(query).slice(0, 3).some((entry) => belongsToProject(entry, projectSlug)), `full: ${query}`);
    assert.ok(searchCompactEntries(quickEntries, query).slice(0, 3).some((entry) => belongsToProject(entry, projectSlug)), `header: ${query}`);
  }
});

test("polite phrasing and punctuation do not turn a useful request into an empty result", () => {
  for (const [query, projectSlug] of intents) {
    const sentence = `请问，帮我看看：${query}？`;
    assert.ok(searchPanel(sentence).slice(0, 3).some((entry) => belongsToProject(entry, projectSlug)), sentence);
  }
});

test("the full index and the production compact projection rank the same entries", () => {
  const queries = [...intents.map(([query]) => query), "sync-contact", "--query-manifest", "verify-export", "吃什么", "过去一小时为什么卡"];
  for (const query of queries) {
    assert.deepEqual(searchCompactEntries(browserEntries, query).map((entry) => entry.href), searchPanel(query).map((entry) => canonicalHref(entry.href)), query);
  }
});

test("exact project names, existing aliases and commands keep their navigation priority", () => {
  for (const [query, slug] of [[".agents", "agents"], ["PCConfig", "pcconfig"], ["GitHub 总索引", "github-index"], ["ChineseASR", "chinese-asr"], ["TimeAudit", "timeaudit"], ["PC Panel Hub", "pc-panel-hub"], ["CACB", "cacb"], ["WeChatDirect", "wechat-direct"], ["video-scaffold", "video-scaffold"]]) {
    assert.equal(searchPanel(query)[0]?.href, `/projects/${slug}`, query);
  }
  assert.equal(searchPanel("ＣｈｉｎｅｓｅＡＳＲ")[0]?.href, "/projects/chinese-asr");
  assert.equal(searchPanel("sync-contact")[0]?.href, "/projects/wechat-direct/named-chat-archive");
  assert.equal(searchPanel("--query-manifest")[0]?.projectSlug, "personal-health");
  assert.equal(searchPanel("verify-export")[0]?.href, "/projects/wechat-direct/preservation-verification");
  assert.equal(searchPanel("过去一小时为什么卡")[0]?.href, "/skills/timeaudit-diagnostics");
  assert.equal(searchPanel("scripts\\transcribe-folder.ps1 -InputDir <folder>")[0]?.projectSlug, "chinese-asr");
  assert.equal(searchPanel("E:\\PCConfig\\tools\\Test-PCConfigDrift.ps1 -NoWrite -Json")[0]?.projectSlug, "pcconfig");
});

test("scope filtering, href deduplication and empty or unrelated queries remain intact", () => {
  for (const [query, scope] of [["卡顿", "project"], ["FPS", "project:timeaudit"], ["授权", "rules"], ["照片", "skills"]]) {
    const full = searchPanel(query, scope);
    assert.ok(full.length > 0, scope);
    assert.ok(full.every((entry) => entry.scopes.includes(scope)), scope);
    assert.deepEqual(searchCompactEntries(browserEntries, query, scope).map((entry) => entry.href), full.map((entry) => canonicalHref(entry.href)));
    assert.equal(new Set(full.map((entry) => entry.href)).size, full.length);
  }
  assert.deepEqual(searchPanel("   "), []);
  assert.deepEqual(searchPanel("zzzxqv79802"), []);
  assert.ok(searchPanel("卡顿", "project").every((entry) => entry.type === "项目"));
  assert.equal(searchPanel("ProxyClean", "project")[0]?.href, "/#system-project-asset-proxy-clean");
});

test("corrections drop rejected topics without dropping an inherited action", () => {
  const entries = [
    { type: "项目", title: "图片制作", detail: "生成新的图片", href: "/image", search: "制作 图片 生成" },
    { type: "项目", title: "文档查找", detail: "寻找以前保存的文档", href: "/find", search: "查找 文档 存在哪里" },
    { type: "项目", title: "文档制作", detail: "编写新的文档", href: "/write", search: "生成 制作 文档" }
  ];
  for (const [query, expected] of [["不是制作图片，而是查找文档", "/find"], ["不是找图片，是那份旧文档", "/find"], ["不是找文档，而是制作图片", "/image"]]) {
    assert.equal(searchCompactEntries(entries, query)[0]?.href, expected, query);
  }
  const corrected = intents.find(([query]) => query.startsWith("不是找照片"))[0];
  assert.ok(belongsToProject(searchPanel(corrected)[0], "personal-materials"));
  assert.ok(belongsToProject(searchCompactEntries(quickEntries, corrected)[0], "personal-materials"));
});

test("adding unrelated technical detail does not penalize an existing match", () => {
  const entry = { type: "项目", title: "资料查找", detail: "找回以前保存的资料", href: "/find", search: "查找 资料" };
  const expanded = { ...entry, search: `${entry.search} ${"unused-technical-command ".repeat(100)}` };
  assert.equal(compactSearchScore(entry, "帮我找回那份资料"), compactSearchScore(expanded, "帮我找回那份资料"));
});

test("short Chinese words and known technical identifiers do not dissolve into unrelated fragments", () => {
  const entries = [
    { type: "项目", title: "卡顿排查 AB12", detail: "检查延迟并发布通知", href: "/latency", scopes: ["project", "project:latency"], search: "卡顿 发布通知" },
    { type: "项目资产", title: "显卡控制 AB34", detail: "查看硬件并发布通知", href: "/gpu", scopes: ["project", "project:gpu"], search: "显卡 发布通知" }
  ];
  assert.deepEqual(searchCompactEntries(entries, "卡顿", "project").map((entry) => entry.href), ["/latency"]);
  assert.deepEqual(searchCompactEntries(entries, "AB12怎么发布通知", "project").map((entry) => entry.href), ["/latency"]);
  assert.deepEqual(searchCompactEntries(entries, "AB12怎么发布通知", "project:gpu"), []);
  assert.deepEqual(searchCompactEntries(entries, "不是AB12，而是AB34怎么发布通知", "project").map((entry) => entry.href), ["/gpu"]);
});

test("technical revisions remain searchable even when they are outside the hero text", () => {
  const cacb = globalSearchEntries.find((entry) => entry.type === "项目" && entry.projectSlug === "cacb");
  const commit = cacb.search.match(/\b[a-f0-9]{40}\b/i)?.[0];
  assert.ok(commit, "current source commit is missing");
  for (const query of [commit, commit.slice(0, 7)]) {
    assert.equal(searchPanel(query, "project")[0]?.projectSlug, "cacb", query);
    assert.equal(searchCompactEntries(quickEntries, query, "project")[0]?.projectSlug, "cacb", query);
  }
  for (const entry of globalSearchEntries.filter((entry) => entry.type === "项目")) {
    const compact = createCompactSearchEntry(entry);
    const text = `${compact.title} ${compact.detail} ${compact.aliases.join(" ")} ${compact.search}`.toLowerCase();
    for (const hash of entry.search.match(/\b[a-f0-9]{40,64}\b/gi) || []) assert.ok(text.includes(hash.toLowerCase()), entry.href);
  }
});
