import assert from "node:assert/strict";
import test from "node:test";
import { searchResultExcerpt } from "../app/compact-search.js";

test("search excerpts select the relevant original sentence without keyword projection copy", () => {
  const intro = "这个项目还包含其他工具的介绍，以及已经验证的使用方法和完整的参考说明。";
  const entry = { detail: `${intro}录音可以先转写，再定位原话所在的时间。${intro}`, search: "invented-keywords" };
  const excerpt = searchResultExcerpt(entry, "录音原话", 42);
  assert.ok(excerpt.includes("录音可以先转写，再定位原话所在的时间。"));
  assert.ok(!excerpt.includes("invented-keywords"));
  assert.ok(excerpt.startsWith("…"));
});

test("a relevant unavailable statement keeps its negation and short details stay intact", () => {
  const entry = { detail: `${"这是项目的完整概况。".repeat(12)}当前不能恢复手机里的原文件，需要连接设备。` };
  assert.ok(searchResultExcerpt(entry, "恢复手机原文件", 60).includes("当前不能恢复手机里的原文件"));
  assert.equal(searchResultExcerpt({ detail: "当前尚未验证。" }, "验证"), "当前尚未验证。");
});
