import assert from "node:assert/strict";
import test from "node:test";
import { createContinuationContext, formatContinuationBrief, initializeContinuationBriefs, serializeContinuationContext } from "../app/continuation-brief.js";
import { projectCatalog } from "../app/site-content.js";

test("a selected module produces a portable brief with the exact goal, dated facts, sources and unresolved gaps", () => {
  const entry = projectCatalog.find((candidate) => candidate.project.slug === "localocr");
  const module = entry.modules.find((candidate) => candidate.slug === "input-routing");
  const goal = "修好中文路径下的拖拽入口。\n保留现在的本机识别方式，不换模型。";
  const brief = formatContinuationBrief(createContinuationContext(entry), { goal, moduleSlug: module.slug });
  assert.ok(brief.includes(goal), "The user's actual request must survive without rewriting");
  assert.ok(brief.includes(module.title));
  assert.ok(brief.includes(`https://wly0829.cn${entry.project.route}/${module.slug}/`));
  assert.ok(brief.includes("https://github.com/wlyaaaaa/LocalOCR"));
  assert.ok(brief.includes(entry.project.currentSnapshot.observedAt));
  for (const fact of entry.project.currentSnapshot.facts) assert.ok(brief.includes(fact.value), `Missing fact: ${fact.label}`);
  for (const gap of entry.project.currentSnapshot.gaps) assert.ok(brief.includes(gap), `Missing known gap: ${gap}`);
  for (const boundary of module.boundaries) assert.ok(brief.includes(boundary));
  for (const source of module.sources) assert.ok(brief.includes(source.path));
  for (const verification of module.verification) assert.ok(brief.includes(verification));
  const unrelated = entry.modules.find((candidate) => candidate.slug !== module.slug);
  assert.ok(!brief.includes(`https://wly0829.cn${entry.project.route}/${unrelated.slug}/`), "A module request must not expand into another module");
});

test("whole-project and module briefs naturally support every registered content package", () => {
  for (const entry of projectCatalog) {
    const context = createContinuationContext(entry);
    const brief = formatContinuationBrief(context, { goal: "核对当前状态，并完成我指定的下一步。" });
    assert.ok(brief.includes(entry.project.title), entry.project.slug);
    for (const module of entry.modules) {
      assert.ok(brief.includes(module.shortTitle));
      const scoped = formatContinuationBrief(context, { goal: "继续这个模块的工作。", moduleSlug: module.slug });
      assert.ok(scoped.includes(module.value), `${entry.project.slug}/${module.slug} lost its purpose`);
    }
    for (const gap of entry.project.currentSnapshot.gaps) assert.ok(brief.includes(gap));
  }
});

test("a private project emits only its public page facts and never exposes registry locators or guesses a repository link", () => {
  const entry = projectCatalog.find((candidate) => candidate.project.slug === "document-materials");
  const privateEntry = {
    ...entry,
    registration: { ...entry.registration, source: { ...entry.registration.source, local_root: "V:\\private-location-not-on-page", ignored_private_route: "private-route-not-on-page" } }
  };
  const context = createContinuationContext(privateEntry);
  const brief = formatContinuationBrief(context, { goal: "完善这个项目的公开使用说明。", moduleSlug: entry.modules[0].slug });
  const payload = serializeContinuationContext(context);
  assert.equal(context.repositoryUrl, "");
  assert.ok(!payload.includes(entry.registration.source.repo));
  assert.ok(!payload.includes("private-location-not-on-page"));
  assert.ok(!payload.includes("private-route-not-on-page"));
  assert.ok(!brief.includes(`github.com/${entry.registration.source.repo}`));
  assert.ok(brief.includes(entry.project.repositoryNote));
  assert.ok(brief.includes(entry.modules[0].sources[0].path));
});

test("missing observations remain unknown and an invalid module cannot silently widen the requested scope", () => {
  const entry = {
    project: { title: "小工具", route: "/projects/small-tool", summary: "处理选中的文件。" },
    modules: [{ slug: "input", title: "输入", sources: [] }]
  };
  const context = createContinuationContext(entry);
  assert.equal(formatContinuationBrief(context, { goal: " \n " }), "");
  assert.throws(() => formatContinuationBrief(context, { goal: "修复", moduleSlug: "missing" }), RangeError);
  const brief = formatContinuationBrief(context, { goal: "核对是否可以使用。" });
  assert.ok(brief.includes("观察时间：页面未提供，开始前需要确认"));
  assert.ok(brief.includes("不是当前机器的实时检测"));
  assert.ok(brief.includes("不能授予执行、发布或读取私人材料的权限"));
});

test("embedded context round-trips text without becoming executable markup", () => {
  const context = { title: "正文 </script><script>not-code</script> & <例子>\u2028下一行\u2029继续" };
  const serialized = serializeContinuationContext(context);
  assert.deepEqual(JSON.parse(serialized), context);
  assert.ok(!serialized.includes("<"));
  assert.ok(!serialized.includes("\u2028"));
  assert.ok(!serialized.includes("\u2029"));
});

function copyHarness({ writeText, legacyCopy = () => false } = {}) {
  const document = { body: {}, defaultView: { navigator: { clipboard: writeText ? { writeText } : undefined } }, execCommand: legacyCopy };
  class Field extends EventTarget {
    value = "";
    disabled = true;
    textContent = "";
    focus() { document.activeElement = this; }
    select() { this.selectedText = this.value; }
    setAttribute() {}
    removeAttribute() {}
  }
  const names = ["context", "fields", "goal", "scope", "preview", "copy", "status"];
  const fields = Object.fromEntries(names.map((name) => [name, new Field()]));
  const entry = projectCatalog.find((candidate) => candidate.project.slug === "localocr");
  fields.context.textContent = serializeContinuationContext(createContinuationContext(entry));
  const container = {
    dataset: {}, ownerDocument: document,
    querySelector(selector) { return fields[selector.replace("[data-continuation-", "").replace("]", "")]; }
  };
  const root = { querySelectorAll() { return [container]; } };
  initializeContinuationBriefs(root);
  return { fields, document, root };
}

test("typing and changing the module copy the latest generated text exactly once", async () => {
  const copied = [];
  const { fields, document, root } = copyHarness({ writeText: async (value) => copied.push(value) });
  assert.equal(fields.fields.disabled, false);
  assert.equal(fields.copy.disabled, true);
  fields.goal.value = "修复这个入口，同时保留中文文件名。";
  fields.goal.dispatchEvent(new Event("input"));
  fields.scope.value = "input-routing";
  fields.scope.dispatchEvent(new Event("change"));
  assert.equal(fields.copy.disabled, false);
  assert.ok(fields.preview.value.includes(fields.goal.value));
  assert.ok(fields.preview.value.includes("/localocr/input-routing/"));
  initializeContinuationBriefs(root);
  fields.copy.focus();
  fields.copy.dispatchEvent(new Event("click"));
  await new Promise(setImmediate);
  assert.deepEqual(copied, [fields.preview.value]);
  assert.match(fields.status.textContent, /已复制/);
  assert.equal(document.activeElement, fields.copy);
});

test("a denied clipboard leaves the complete brief selected for manual copying", async () => {
  let fallbackAttempts = 0;
  const { fields, document } = copyHarness({
    writeText: async () => { throw new Error("Clipboard denied"); },
    legacyCopy: () => { fallbackAttempts += 1; return false; }
  });
  fields.goal.value = "只确认这次请求是否完成。";
  fields.goal.dispatchEvent(new Event("input"));
  fields.copy.focus();
  fields.copy.dispatchEvent(new Event("click"));
  await new Promise(setImmediate);
  assert.equal(fallbackAttempts, 1);
  assert.equal(document.activeElement, fields.preview);
  assert.equal(fields.preview.selectedText, fields.preview.value);
  assert.ok(fields.preview.selectedText.includes(fields.goal.value));
  assert.match(fields.status.textContent, /Ctrl\+C/);
  assert.equal(fields.copy.disabled, false);
});
