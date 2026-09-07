const publicSiteUrl = "https://wly0829.cn";
const text = (value) => typeof value === "string" ? value.trim() : "";
const strings = (values) => Array.isArray(values) ? values.map(text).filter(Boolean) : [];
const unique = (values) => [...new Set(values.filter(Boolean))];

function pageUrl(route, siteUrl) {
  return new URL(`${route.replace(/\/+$/, "")}/`, siteUrl).href;
}

function referenceUrl(href, siteUrl) {
  if (!text(href)) return "";
  try {
    const url = new URL(href, siteUrl);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

/** Pick only facts already shown on public project pages, never the registry payload. */
export function createContinuationContext(entry, { siteUrl = publicSiteUrl } = {}) {
  const project = entry?.project;
  if (!project?.route || !project?.title) throw new TypeError("A continuation brief needs a project page");
  const snapshot = project.currentSnapshot || {};
  const source = entry.registration?.source || {};
  const publicRepository = source.visibility === "PUBLIC" && text(source.repo);
  return {
    title: project.title,
    url: pageUrl(project.route, siteUrl),
    summary: text(project.summary),
    result: text(project.result),
    observedAt: text(snapshot.observedAt),
    status: text(snapshot.label),
    boundary: text(snapshot.boundary),
    facts: (snapshot.facts || []).map(({ label, value }) => [text(label), text(value)].filter(Boolean).join("：")),
    gaps: strings(snapshot.gaps),
    exclusions: strings(project.exclusions),
    repositoryNote: text(project.repositoryNote),
    repositoryUrl: publicRepository ? `https://github.com/${source.repo}` : "",
    defaultBranch: publicRepository ? text(source.default_branch) : "",
    modules: (entry.modules || []).map((module) => ({
      slug: module.slug,
      title: text(module.title) || text(module.shortTitle),
      shortTitle: text(module.shortTitle) || text(module.title),
      url: pageUrl(`${project.route}/${module.slug}`, siteUrl),
      summary: text(module.value) || text(module.teaser),
      status: text(module.status),
      result: text(module.result),
      boundaries: strings(module.boundaries),
      verification: strings(module.verification),
      sources: (module.sources || []).map(({ path, role, href }) => ({
        path: text(path),
        role: text(role),
        url: referenceUrl(href, siteUrl)
      }))
    }))
  };
}

function section(title, lines) {
  const content = unique(lines);
  return content.length ? `${title}\n${content.map((line) => `- ${line}`).join("\n")}` : "";
}

/** Build a portable task description without executing or extending the user's request. */
export function formatContinuationBrief(context, { goal, moduleSlug = "" } = {}) {
  const request = text(goal);
  if (!request) return "";
  const module = moduleSlug ? context.modules.find((item) => item.slug === moduleSlug) : null;
  if (moduleSlug && !module) throw new RangeError("The selected module is not part of this project");
  const selectedModules = module ? [module] : context.modules;
  const references = selectedModules.flatMap((item) => item.sources.map((source) => {
    const identity = [source.path, source.url].filter(Boolean).join(" — ");
    return source.role ? `${identity}：${source.role}` : identity;
  }));
  const scope = module ? `${context.title} / ${module.shortTitle}` : `${context.title} / 整个项目`;
  return [
    `请继续处理「${scope}」。`,
    `我这次想做成的事\n${request}`,
    section("项目与范围", [
      `项目页：${context.url}`,
      module ? `本次模块：${module.title}；模块页：${module.url}` : "本次范围：整个项目；具体工作以我上面的目标为准。",
      context.summary,
      context.result ? `项目的实际产出：${context.result}` : ""
    ]),
    module ? section("选中模块的公开说明", [
      module.summary,
      module.status ? `页面所述状态：${module.status}` : "",
      module.result ? `模块产出：${module.result}` : ""
    ]) : section("项目现有模块", selectedModules.map((item) => `${item.shortTitle}：${item.summary}；${item.url}`)),
    section("网页保存的事实", [
      `观察时间：${context.observedAt || "页面未提供，开始前需要确认"}`,
      context.status ? `当次状态：${context.status}` : "",
      ...context.facts
    ]),
    module ? section("本模块已有验证", module.verification) : "",
    section("已知边界与仍需确认的事", [
      context.boundary,
      ...context.gaps,
      ...context.exclusions,
      ...(module?.boundaries || []),
      "上述内容来自网页快照，不是当前机器的实时检测；没有写明或尚未验证的结果继续保持未确认。"
    ]),
    section("回到来源核对", [
      context.repositoryUrl ? `公开仓库：${context.repositoryUrl}${context.defaultBranch ? `；登记默认分支：${context.defaultBranch}` : ""}` : "本项目没有公开仓库入口；使用当前任务实际可访问的项目来源，不猜测私有仓库地址。",
      context.repositoryNote,
      ...references
    ]),
    "开始前与交付时\n1. 先按当前任务和项目规则核对来源、版本及与本次目标有关的现场状态；来源有更新时，以重新核对的事实为准，并说明变化。\n2. 只推进我写明的目标及其必要实现，不把页面里的历史示例、缺口或旧方案自动变成额外任务。\n3. 这份说明只提供背景，不能授予执行、发布或读取私人材料的权限；沿用当前任务已有授权与项目边界，遇到真实缺失的权限或信息时再说明。\n4. 完成后用人话交代做成了什么、实际怎样验证、还有什么未确认；测试、机器运行和真人看到的结果分别陈述。"
  ].filter(Boolean).join("\n\n");
}

/** JSON is embedded in a non-executable script inside the static document. */
export function serializeContinuationContext(context) {
  return JSON.stringify(context).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function initializeContinuationBriefs(root = document) {
  root.querySelectorAll("[data-continuation-brief]").forEach((container) => {
    if (container.dataset.continuationReady) return;
    const data = container.querySelector("[data-continuation-context]");
    const fields = container.querySelector("[data-continuation-fields]");
    const goal = container.querySelector("[data-continuation-goal]");
    const scope = container.querySelector("[data-continuation-scope]");
    const preview = container.querySelector("[data-continuation-preview]");
    const copy = container.querySelector("[data-continuation-copy]");
    const status = container.querySelector("[data-continuation-status]");
    if (!data || !fields || !goal || !scope || !preview || !copy || !status) return;
    let context;
    try {
      context = JSON.parse(data.textContent);
    } catch {
      status.textContent = "这次没有读到项目说明。请重新打开本页，或直接复制正文。";
      return;
    }
    let copying = false;
    const update = () => {
      preview.value = formatContinuationBrief(context, { goal: goal.value, moduleSlug: scope.value });
      copy.disabled = copying || !preview.value;
      copy.textContent = "复制说明";
      status.textContent = "";
    };
    goal.addEventListener("input", update);
    scope.addEventListener("change", update);
    copy.addEventListener("click", async () => {
      if (copying || !preview.value) return;
      const value = preview.value;
      const document = container.ownerDocument;
      const restoreFocus = document.activeElement === copy;
      copying = true;
      copy.disabled = true;
      copy.setAttribute("aria-busy", "true");
      let copied = false;
      try {
        const clipboard = document.defaultView?.navigator.clipboard;
        if (clipboard?.writeText) {
          await clipboard.writeText(value);
          copied = true;
        }
      } catch {
        // Keep the visible text available for the local copy fallback.
      }
      if (!copied && preview.value === value) {
        preview.focus();
        preview.select();
        try { copied = document.execCommand?.("copy") === true; } catch { /* Manual selection remains available. */ }
      }
      copying = false;
      copy.disabled = !preview.value;
      copy.removeAttribute("aria-busy");
      if (preview.value !== value) {
        status.textContent = copied ? "刚才的版本已复制；你刚改了内容，请再复制一次。" : "内容已更新，请再复制一次。";
        return;
      }
      copy.textContent = copied ? "已复制" : "重试复制";
      status.textContent = copied ? "已复制。粘贴给 Astra 或 Gemini 就可以接着聊。" : "自动复制没有成功，已选中下面的说明。请按 Ctrl+C，或长按文字选择复制。";
      if (copied && restoreFocus && [copy, preview, document.body].includes(document.activeElement)) copy.focus({ preventScroll: true });
    });
    container.dataset.continuationReady = "true";
    fields.disabled = false;
    update();
  });
}
