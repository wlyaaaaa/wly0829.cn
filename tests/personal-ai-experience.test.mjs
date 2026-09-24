import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { personalAiImages, personalCodexTotal, personalCodexTotalLabel } from "../app/personal-ai-experience.js";

test("personal experience preserves 11 unique original images, with only five independent Codex records in the total", async () => {
  assert.equal(personalAiImages.length, 11);
  assert.equal(new Set(personalAiImages.map(image => image.originalSha256)).size, 11);
  assert.equal((await readdir(new URL("../public/images/personal-ai-experience/", import.meta.url))).length, 11);
  assert.deepEqual(personalAiImages.slice(0, 5).map(image => image.platform), Array(5).fill("Codex"));
  assert.equal(personalAiImages.slice(5).some(image => image.codexHundredMillion !== null), false);
  assert.equal(personalCodexTotal, 1921.1);
  assert.equal(personalCodexTotalLabel, "1,921.1");
  for (const image of personalAiImages) {
    const bytes = await readFile(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), image.originalSha256);
    assert.equal(bytes.length, image.originalBytes);
    if (image.src.endsWith(".png")) {
      assert.equal(bytes.readUInt32BE(16), image.width);
      assert.equal(bytes.readUInt32BE(20), image.height);
    }
  }
  const opencode = personalAiImages.filter(image => image.platform === "OpenCode");
  assert.equal(opencode.length, 1);
  assert.match(opencode[0].caption, /105\.0M.*1,170/);
  assert.match(personalAiImages.find(image => image.platform === "Qwen").caption, /43,094K（43,094,000）/);
});

test("the built highlight keeps personal evidence separate from project results and preserves the work-first order", async () => {
  const system = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const agents = await readFile(new URL("../dist/projects/agents/index.html", import.meta.url), "utf8");
  for (const html of [system, agents]) {
    assert.ok(html.includes("1,921.1"));
    assert.ok(html.includes("我的 Codex 五份独立使用记录合计"));
    assert.ok(html.includes("2026年9月24日"));
    assert.ok(html.includes("非实时统计"));
    assert.ok(html.includes("Codex × GLM / DeepSeek / Qwen"));
    assert.ok(html.includes("我自己的 Codex 环境已接入这些模型"));
    assert.ok(html.includes("ChatGPT × 电脑 MCP"));
    assert.ok(html.includes("已有 ChatGPT 订阅内使用 GPT-6 Astra Pro"));
    assert.ok(html.includes("不另付 API 费用 · 不占 Codex 用量"));
    assert.ok(html.includes("ChatGPT 套餐规则仍适用"));
    assert.equal((html.match(/id="personal-ai-experience"/g) || []).length, 1);
    assert.ok(html.includes('data-gallery-src="/images/personal-ai-experience/codex-521-9.png"'));
  }
  assert.ok(system.indexOf('id="general-ai"') < system.indexOf('id="personal-ai-experience"'));
  assert.ok(system.indexOf('id="personal-ai-experience"') < system.indexOf('class="system-section-navigation"'));
  assert.equal((system.match(/data-gallery-src="\/images\/personal-ai-experience\//g) || []).length, 3);
  assert.ok(system.includes('/projects/agents/#personal-ai-experience'));
  assert.ok(!system.includes("Claude Code 的历史记录"), "the System summary delegates detailed history to the full records");
  assert.ok(agents.indexOf("最快了解这个项目") < agents.indexOf('id="personal-ai-experience"'));
  assert.ok(agents.indexOf('id="personal-ai-experience"') < agents.indexOf("从哪里开始"));
  assert.equal((agents.match(/data-gallery-src="\/images\/personal-ai-experience\//g) || []).length, 11);
  assert.ok(agents.includes("2026年6月30日被封"));
  assert.ok(agents.includes("国产模型这组记录只能展示约一个月"));
  assert.match(agents, /之前已经用了<strong>数亿 tokens<\/strong>；这部分没有计入上面的数字/);
  for (const name of ["Grok Build", "Google Antigravity", "OpenCode", "Cline", "Qoder", "OpenClaw"]) assert.ok(agents.includes(name));
  assert.equal((agents.match(/id="personal-ai-records"/g) || []).length, 1);
  assert.equal((agents.match(/id="personal-ai-records-title"/g) || []).length, 1);
  assert.ok(agents.includes("521.9 + 204.4 + 296.5 + 378.2 + 520.1 = 1,921.1"));
  const area = agents.slice(agents.indexOf('id="personal-ai-experience"'), agents.indexOf("从哪里开始"));
  assert.ok(!area.includes("可视化结果"));
  assert.ok(area.includes('loading="lazy"'));
  assert.ok(area.indexOf("codex-204-4.png") < area.indexOf("glm-zcode.png"));
});
