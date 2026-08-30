import { ruleGuides } from "./content-rule-guides.js";
import { skillGuides, skillOutcomes } from "./content-skill-guides.js";
import { projectCatalog, rulesSnapshot, skills } from "./site-content.js";

export const ruleSearchAliases = {
  agents_root_rules: ["怎么避免全局规则覆盖项目自己的验收方式"],
  protected_major_actions_contract: ["dirty source 不能冒充 current release", "current E rules 怎么验证", "C盘规则为什么不能阻塞spawn", "旧Publisher为什么退役", "五份规则的 ruleset 是什么", "candidate 不能冒充 active"],
  authorization_delegation_contract: ["同一个目标不要反复问我授权", "授权过一次为什么还问", "同一目标不重复索权", "谁可以修改这个项目"],
  four_base_decision_context_contract: ["这个事实应该去哪里查", "仓库事实和机器事实分别谁负责"],
  capability_routing_contract: ["什么时候开子代理", "应该用哪个工具或 Skill", "模型怎么选择能力"]
};

const skillSearchAliases = {
  "personal-media": ["哪个 Skill 可以找照片", "找照片视频录音", "用一句话找媒体原件"],
  "personal-panel-refresh": ["刷新看板", "fresh task 为什么受阻", "改了项目怎么没有自动刷新面板", "为什么看板没有更新", "这次发布会不会让看板说错话"],
  "timeaudit-diagnostics": ["过去一小时为什么卡", "没有游戏帧是不是掉帧", "电脑昨天为什么发热", "睡眠还是采集断档", "TimeAudit 历史证据"],
  "project-entry-gate": ["提交前为什么要检查仓库", "会不会推错远端", "公开仓库泄露"],
  "token-budget-advisor": ["这段文字有多少 token", "会不会超过上下文限制"]
};

const projectSearchEntries = projectCatalog.flatMap(({ project, modules }) => [
  {
    type: "项目",
    title: `${project.title} · 总览`,
    detail: project.summary,
    href: project.route,
    aliases: project.searchAliases || [],
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
      ...project.usageExamples.flatMap((item) => [item.ask, item.effect]),
      ...project.evidenceLayers.flatMap((item) => [item.layer, item.proves, item.doesNotProve]),
      ...project.operationalEntrypoints.flatMap((item) => [item.name, item.command, item.purpose]),
      ...project.evolution.flatMap((item) => [item.date, item.commit, item.result])
    ].join(" ")
  },
  ...modules.map((module) => ({
    type: "项目模块",
    title: module.title,
    detail: `${project.title}｜${module.teaser}`,
    href: `${project.route}/${module.slug}`,
    aliases: module.searchAliases || [],
    search: [
      project.title,
      module.status,
      module.problem,
      module.why,
      module.example,
      module.result,
      ...Object.values(module.readerStates || {}),
      ...module.decisionImpact,
      ...module.implementation,
      ...module.flow,
      ...module.boundaries,
      ...module.concepts.flatMap((item) => [item.term, item.explanation]),
      ...module.failures.flatMap((item) => [item.condition, item.response]),
      ...module.sources.flatMap((item) => [item.path, item.role]),
      ...module.verification,
      module.relation
    ].join(" ")
  }))
]);

export const globalSearchEntries = [
  ...projectSearchEntries,
  ...rulesSnapshot.rules.map((rule) => {
    const guide = ruleGuides[rule.logicalId];
    return {
      type: "规则",
      title: rule.title,
      detail: rule.question,
      href: `/rules?rule=${rule.logicalId}`,
      aliases: ruleSearchAliases[rule.logicalId] || [],
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
      title: item.name,
      detail: `${item.title}：${outcome.value}`,
      href: `/skills/${item.slug}`,
      aliases: skillSearchAliases[item.slug] || [],
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
];

export function searchScore(entry, query) {
  const normalized = String(query).trim().toLowerCase();
  if (!normalized) return 0;
  const title = entry.title.toLowerCase();
  const detail = entry.detail.toLowerCase();
  const aliases = (entry.aliases || []).map((value) => value.toLowerCase());
  const all = `${entry.type} ${title} ${detail} ${entry.search} ${aliases.join(" ")}`.toLowerCase();
  const latinTokens = normalized.match(/[a-z][a-z0-9_.:/-]*/g) || [];
  if (latinTokens.some((token) => !all.includes(token))) return 0;
  if (title.includes(normalized)) return 140;
  if (aliases.some((alias) => alias.includes(normalized))) return 160;
  if (detail.includes(normalized)) return 110;
  if (all.includes(normalized)) return 90;

  const compact = normalized.replace(/[a-z0-9_.:/-]+/gi, "").replace(/[^\p{Script=Han}]/gu, "");
  const grams = compact.length >= 3
    ? Array.from({ length: compact.length - 1 }, (_, index) => compact.slice(index, index + 2))
    : compact ? [compact] : [];
  if (!grams.length) return latinTokens.length ? 70 + latinTokens.length * 8 : 0;
  const matched = grams.filter((gram) => all.includes(gram)).length;
  if (matched / grams.length < 0.45) return 0;
  const titleMatched = grams.filter((gram) => title.includes(gram)).length;
  const detailMatched = grams.filter((gram) => detail.includes(gram)).length;
  return matched * 10 + titleMatched * 8 + detailMatched * 4;
}

export function searchPanel(query) {
  return globalSearchEntries
    .map((entry, index) => ({ entry, index, score: searchScore(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((result) => result.entry);
}
