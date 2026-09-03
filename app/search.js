import { ruleGuides } from "./content-rule-guides.js";
import { skillGuides, skillOutcomes } from "./content-skill-guides.js";
import { projectCatalog, rulesSnapshot, skills, systemSearchEntries } from "./site-content.js";
import { compactSearchScore, createCompactSearchEntry, searchCompactEntries } from "./compact-search.js";

export const ruleSearchAliases = {
  agents_root_rules: ["怎么避免全局规则覆盖项目自己的验收方式"],
  protected_major_actions_contract: ["dirty source 不能冒充 current release", "current E rules 怎么验证", "C盘规则为什么不能阻塞spawn", "旧Publisher为什么退役", "五份规则的 ruleset 是什么", "candidate 不能冒充 active"],
  authorization_delegation_contract: ["同一个目标不要反复问我授权", "授权过一次为什么还问", "同一目标不重复索权", "谁可以修改这个项目", "不要覆盖未提交修改", "未提交修改怎么保留"],
  four_base_decision_context_contract: ["这个事实应该去哪里查", "仓库事实和机器事实分别谁负责"],
  capability_routing_contract: ["什么时候开子代理", "应该用哪个工具或 Skill", "模型怎么选择能力"]
};

const skillSearchAliases = {
  "personal-media": ["哪个 Skill 可以找照片", "找照片视频录音", "用一句话找媒体原件", "找一张照片"],
  "document-materials": ["帮我起草合同并整理材料包", "制作文书和附件包", "生成DOCX和PDF材料"],
  "personal-panel-refresh": ["刷新看板", "fresh task 为什么受阻", "改了项目怎么没有自动刷新面板", "为什么看板没有更新", "这次发布会不会让看板说错话"],
  "timeaudit-diagnostics": ["过去一小时为什么卡", "没有游戏帧是不是掉帧", "电脑昨天为什么发热", "睡眠还是采集断档", "TimeAudit 历史证据"],
  "daily-preferences": ["吃什么", "今天吃什么", "购物", "购物推荐", "支付", "支付习惯", "出行", "出行推荐", "旅行景点", "住宿推荐", "娱乐", "娱乐推荐", "数字消费", "服务怎么选", "工具习惯", "审美偏好", "我改主意", "我改主意了", "以后按这个推荐", "以后按我的偏好推荐"],
  "work-delivery": ["来源变更后哪些文档要重做", "需求变了怎么同步PRD和执行表"],
  "project-entry-gate": ["提交前为什么要检查仓库", "会不会推错远端", "公开仓库泄露"],
  "token-budget-advisor": ["这段文字有多少 token", "会不会超过上下文限制"]
};

const projectModuleSearchAliases = {
  "agents/context-evidence": ["本地构建通过为什么还不能说网站完成"]
};

const projectCompactExtraAliases = {
  pcconfig: ["Vault V2", "银行卡盲填", "waiting_for_codex_exit"],
  timeaudit: ["卡顿", "电脑卡顿", "游戏卡顿"]
};

function compactSearchTopics(projection) {
  if (!projection) return "";
  const values = Array.isArray(projection)
    ? projection
    : Object.values(projection).flatMap((value) => Array.isArray(value) ? value : [value]);
  const unique = [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
  return unique.filter((value) => !unique.some((other) => other.length > value.length && other.toLowerCase().includes(value.toLowerCase()))).join(" ");
}

function withTechnicalSearchTerms(entry) {
  const compact = createCompactSearchEntry(entry);
  const covered = `${compact.title} ${compact.detail} ${compact.aliases.join(" ")} ${compact.search}`.toLowerCase();
  const tokens = [...new Set((entry.search.match(/[a-z0-9][a-z0-9_.:/\\-]*/gi) || []).map((token) => token.replace(/[.:]+$/g, "")))];
  const technical = tokens.filter((token) => token.length > 1 && (
    /^[a-f0-9]{7,64}$/i.test(token)
    || /^v?\d+(?:\.\d+)+/i.test(token)
    || (/[a-z]/i.test(token) && (/\d|[_.:/\\-]/.test(token) || /[a-z][A-Z]/.test(token) || /^[A-Z]{2,}$/.test(token)))
  ));
  const missing = technical.filter((token) => !covered.includes(token.toLowerCase()));
  return { ...entry, compactSearch: [compact.search, ...missing].filter(Boolean).join(" ") };
}

function projectCompactSearchText(project, modules) {
  const heroLatinTokens = (project.heroFacts || []).flatMap((item) => `${item.label} ${item.value}`.toLowerCase().match(/[a-z][a-z0-9_.:/-]*/g) || []);
  return compactSearchTopics([
    project.summary,
    project.why,
    project.plainExample,
    ...project.responsibilities,
    project.cardStatus,
    ...(project.usageExamples || []).filter((item) => !item.moduleSlug).map((item) => item.ask),
    ...(project.operationalEntrypoints || []).map((item) => item.command),
    compactSearchTopics(project.searchProjection),
    ...heroLatinTokens,
    ...(projectCompactExtraAliases[project.slug] || []),
    ...modules.flatMap((module) => [module.title, module.teaser, ...(module.searchAliases || []), ...(projectModuleSearchAliases[`${project.slug}/${module.slug}`] || [])])
  ]);
}

const projectSearchEntries = projectCatalog.flatMap(({ project, modules }) => [
  {
    type: "项目",
    group: "项目",
    scopes: ["project", `project:${project.slug}`],
    projectSlug: project.slug,
    title: `${project.title} · 总览`,
    detail: project.summary,
    href: project.route,
    aliases: project.searchAliases || [],
    compactSearch: projectCompactSearchText(project, modules),
    search: [
      project.summary,
      project.status || "",
      project.why,
      project.plainExample,
      project.result,
      ...Object.values(project.readerStates || {}),
      ...project.responsibilities,
      ...project.exclusions,
      ...project.glossary.flatMap((item) => [item.term, item.meaning]),
      ...(project.currentState?.facts || []),
      ...(project.currentState?.gaps || []),
      project.currentState?.label || "",
      ...project.components.flatMap((item) => [item.name, item.responsibility, item.implementation]),
      ...project.usageExamples.filter((item) => !item.moduleSlug).flatMap((item) => [item.ask, item.effect]),
      ...project.evidenceLayers.flatMap((item) => [item.layer, item.proves, item.doesNotProve]),
      ...project.operationalEntrypoints.flatMap((item) => [item.name, item.command, item.purpose]),
      ...project.evolution.flatMap((item) => [item.date, item.commit, item.result]),
      ...modules.flatMap((module) => [
        module.title,
        module.shortTitle,
        module.teaser,
        module.problem,
        module.why,
        module.example,
        module.result,
        ...(module.searchAliases || [])
      ])
    ].join(" ")
  },
  ...modules.map((module) => ({
    type: "项目内容",
    group: "项目",
    scopes: [`project:${project.slug}`],
    projectSlug: project.slug,
    title: module.title,
    detail: `${project.title}｜${module.teaser}`,
    href: `${project.route}/${module.slug}`,
    aliases: [...(module.searchAliases || []), ...(projectModuleSearchAliases[`${project.slug}/${module.slug}`] || [])],
    compactSearch: compactSearchTopics([compactSearchTopics(module.searchProjection), module.value, module.result, ...(project.usageExamples || []).filter((item) => item.moduleSlug === module.slug).flatMap((item) => [item.ask, item.effect])]),
    search: [
      project.title,
      module.status,
      module.problem,
      module.why,
      module.example,
      module.result,
      compactSearchTopics(module.searchProjection),
      ...(project.usageExamples || []).filter((item) => item.moduleSlug === module.slug).flatMap((item) => [item.ask, item.effect]),
      ...Object.values(module.readerStates || {}),
      ...module.decisionImpact,
      ...module.implementation,
      ...module.flow,
      ...module.boundaries,
      ...module.concepts.flatMap((item) => [item.term, item.explanation]),
      ...module.failures.flatMap((item) => [item.condition, item.response]),
      ...module.sources.flatMap((item) => [item.path, item.role]),
      ...module.verification,
      module.relation,
      ...(projectModuleSearchAliases[`${project.slug}/${module.slug}`] || [])
    ].join(" ")
  }))
]);

export const globalSearchEntries = [
  ...projectSearchEntries,
  ...systemSearchEntries.map((entry) => ({ ...entry, group: entry.group || "系统", scopes: entry.scopes || ["system"] })),
  ...rulesSnapshot.rules.map((rule) => {
    const guide = ruleGuides[rule.logicalId];
    return {
      type: "规则",
      group: "规则",
      scopes: ["rules"],
      title: rule.title,
      detail: rule.question,
      href: `/rules?rule=${rule.logicalId}`,
      aliases: ruleSearchAliases[rule.logicalId] || [],
      compactSearch: compactSearchTopics([rule.searchProjection, rule.plainLanguage, rule.example, rule.decisions]),
      search: [
        rule.logicalId,
        rule.purpose,
        rule.plainLanguage,
        rule.why,
        rule.example,
        rule.result,
        ...rule.decisions,
        ...rule.allowed,
        ...rule.forbidden,
        ...(ruleSearchAliases[rule.logicalId] || []),
        ...guide.glossary.flat(),
        ...guide.sections.flatMap((section) => [section.title, section.intro, ...section.items.flatMap((entry) => [entry.title, entry.detail, entry.example || ""])])
      ].join(" ")
    };
  }),
  ...skills.map((item) => {
    const guide = skillGuides[item.slug];
    const outcome = skillOutcomes[item.slug];
    return {
      type: "Skill",
      group: "Skills",
      scopes: ["skills"],
      title: item.slug === "document-materials" ? item.title : item.name,
      detail: `${item.title}：${outcome.value}`,
      href: `/skills/${item.slug}`,
      aliases: skillSearchAliases[item.slug] || [],
      compactSearch: compactSearchTopics([item.searchProjection, item.useWhen, outcome.example, guide.failures.map((failure) => failure[0])]),
      search: [
        item.title,
        item.status,
        item.provenance,
        item.maturity,
        item.summary,
        outcome.value,
        outcome.why,
        outcome.example,
        outcome.result,
        ...outcome.changes,
        ...item.useWhen,
        ...item.avoidWhen,
        ...item.inputs,
        ...item.outputs,
        ...item.flow,
        item.sourceState,
        item.installState,
        item.transactionState,
        item.currentTaskState,
        item.freshTaskState,
        item.endToEndState,
        item.tests,
        item.evidenceSourceCommit,
        item.supplyEvidenceCommand,
        ...(skillSearchAliases[item.slug] || []),
        ...guide.glossary.flat(),
        ...guide.failures.flat()
      ].join(" ")
    };
  })
].map(withTechnicalSearchTerms);

export const searchScore = compactSearchScore;

export function searchPanel(query, scope = "all") {
  return searchCompactEntries(globalSearchEntries, query, scope);
}

export function searchScopeById(scopeId) {
  if (String(scopeId).startsWith("project:")) {
    const slug = String(scopeId).slice("project:".length);
    const projectEntry = projectCatalog.find((entry) => entry.project.slug === slug);
    if (!projectEntry) return null;
    return {
      id: `project:${projectEntry.project.slug}`,
      label: projectEntry.project.title,
      placeholder: `搜索 ${projectEntry.project.title} 的总览、模块或问题`,
      help: "可搜本项目的用途、场景、模块、证据或直接描述问题",
      examples: projectEntry.project.searchAliases?.slice(0, 4) || []
    };
  }
  if (scopeId === "system") return { id: "system", label: "系统", placeholder: "搜索责任、关系或使用入口", help: "可搜谁负责什么、项目怎样协作或出现问题先去哪里", examples: ["昨晚电脑为什么卡", "仓库事实谁负责", "中文录音怎么处理"] };
  if (scopeId === "rules") return { id: "rules", label: "规则", placeholder: "搜索规则或直接描述约束问题", help: "可搜授权、委派、重大动作、事实责任或能力路由", examples: ["什么时候开子代理", "谁可以修改项目", "这个事实应该去哪里查"] };
  if (scopeId === "skills") return { id: "skills", label: "Skills", placeholder: "搜索 Skill 名称或直接描述要解决的问题", help: "搜索始终覆盖全部 Skills，不受浏览分类限制", examples: ["找照片", "过去一小时为什么卡", "批量加密文件"] };
  if (scopeId === "all") return { id: "all", label: "全站", placeholder: "搜索项目、系统、规则或 Skills", help: "可以输入准确名称，也可以直接描述你想解决的问题", examples: ["恢复电脑", "什么时候需要授权", "找录音"] };
  if (scopeId === "project") return { id: "project", label: "项目", placeholder: "搜索项目名、用途、模块或直接描述问题", help: "结果只落到项目；进入项目后可继续搜索项目内部内容", examples: ["电脑卡顿", "中文录音", "安全发布仓库"] };
  return null;
}

export function searchScopeForPath(pathname) {
  const path = `/${String(pathname || "/").split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
  const normalized = path === "/" ? "/" : path;
  const projectEntry = projectCatalog.find((entry) => normalized === entry.project.route || normalized.startsWith(`${entry.project.route}/`));
  if (projectEntry) return searchScopeById(`project:${projectEntry.project.slug}`);
  if (normalized === "/") return searchScopeById("all");
  if (normalized === "/projects") return searchScopeById("project");
  if (normalized === "/system") return searchScopeById("system");
  if (normalized === "/rules") return searchScopeById("rules");
  if (normalized === "/skills" || normalized.startsWith("/skills/")) return searchScopeById("skills");
  if (normalized === "/search") return searchScopeById("all");
  return searchScopeById("project");
}

export function searchScopeOptionsForPath(pathname) {
  const current = searchScopeForPath(pathname);
  return current.id === "all" ? [current] : [current, { id: "all", label: "全站" }];
}
