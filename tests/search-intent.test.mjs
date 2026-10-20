import assert from "node:assert/strict";
import test from "node:test";
import { compactSearchScore, createCompactSearchEntry, searchCompactEntries } from "../app/compact-search.js";

test("ordinary compact entries preserve literal wire markers", () => {
  for (const type of ["页面", "项目内容"]) {
    const entry = { type, title: "Literal", detail: "prefix", search: "\u0001dLiteral", href: "/literal/", aliases: [] };
    assert.equal(createCompactSearchEntry(entry).search, "\u0001dliteral");
    assert.equal(searchCompactEntries([entry], "Literal")[0], entry);
  }
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

});

test("adding unrelated technical detail does not penalize an existing match", () => {
  const entry = { type: "项目", title: "资料查找", detail: "找回以前保存的资料", href: "/find", search: "查找 资料" };
  const expanded = { ...entry, search: `${entry.search} ${"unused-technical-command ".repeat(100)}` };
  assert.equal(compactSearchScore(entry, "帮我找回那份资料"), compactSearchScore(expanded, "帮我找回那份资料"));
});

test("Chinese word boundaries do not invent topics while split nouns remain searchable", () => {
  const entries = [
    { type: "项目", title: "口令管理", detail: "将口令列表导出", href: "/export", search: "" },
    { type: "项目", title: "出口指示", detail: "指向离开房间的方向", href: "/exit", search: "" },
    { type: "项目", title: "桌面小屏", detail: "显示运行状态", href: "/small-screen", search: "" },
    { type: "项目", title: "大屏控制", detail: "显示运行状态", href: "/large-screen", search: "" }
  ];
  assert.deepEqual(searchCompactEntries(entries, "导出口令列表").map((entry) => entry.href), ["/export"]);
  assert.equal(searchCompactEntries(entries, "桌边小屏的运行状态")[0]?.href, "/small-screen");
});

test("lookup verb variants cannot outweigh the requested object through rarity alone", () => {
  const entries = [
    { type: "项目", title: "日志归档", detail: "找到以前保存的日志", href: "/logs", search: "" },
    { type: "项目", title: "数据质量", detail: "找出数据中的错误", href: "/data", search: "" },
    ...Array.from({ length: 8 }, (_, index) => ({ type: "Skill", title: `格式工具 ${index}`, detail: "日志格式转换", href: `/format-${index}`, search: "" }))
  ];
  for (const verb of ["找出", "查找", "寻找", "搜索", "检索", "找到", "找回"]) {
    const query = `请${verb}去年六月的日志`;
    assert.equal(searchCompactEntries(entries, query)[0]?.href, "/logs", query);
  }
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
