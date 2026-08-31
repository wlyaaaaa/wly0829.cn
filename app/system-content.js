import {
  systemActiveAutomations,
  systemComposedWorkflows,
  systemDependencyNodes,
  systemDependencyRelations,
  systemHomeHero,
  systemProjectDomains,
  systemScenarios
} from "./system-home-content.js";

const systemNodeTitles = new Map(systemDependencyNodes.map((node) => [node.id, node.title]));

export const systemSearchEntries = [
  {
    type: "系统总览",
    title: systemHomeHero.eyebrow,
    detail: `${systemHomeHero.title}。${systemHomeHero.paragraphs[0]}`,
    href: "/",
    aliases: ["个人 AI 工作系统", "AI 如何协助工作", "通用 AI 和个人项目怎样协作"],
    compactSearch: systemHomeHero.roles.map((item) => `${item.title} ${item.body}`).join(" "),
    search: `${systemHomeHero.paragraphs.join(" ")} ${systemHomeHero.roles.map((item) => `${item.title} ${item.body}`).join(" ")}`
  },
  ...systemScenarios.map((scenario) => ({
    type: "真实工作场景",
    title: scenario.title,
    detail: `${scenario.request}｜${scenario.result}`,
    href: `/#system-scenario-${scenario.id}`,
    aliases: [scenario.label],
    compactSearch: `${scenario.rules} ${scenario.value} ${scenario.stages.map((stage) => stage.title).join(" ")}`,
    search: `${scenario.systems.join(" ")} ${scenario.rules} ${scenario.value} ${scenario.stages.map((stage) => `${stage.title} ${stage.body} ${stage.items.flat().join(" ")}`).join(" ")}`
  })),
  ...systemActiveAutomations.items.map((item) => ({
    type: "自动协作",
    title: item.title,
    detail: `${item.cadence}｜${item.focus}`,
    href: "/#system-automations",
    aliases: [],
    compactSearch: `${item.process} ${item.delivery}`,
    search: `${item.process} ${item.delivery}`
  })),
  ...systemComposedWorkflows.map((workflow) => ({
    type: "组合工作流",
    title: workflow.title,
    detail: `${workflow.request}｜${workflow.delivery}`,
    href: `/#system-composed-workflow-${workflow.id}`,
    aliases: [],
    compactSearch: `${workflow.path.join(" ")} ${workflow.unavailable}`,
    search: `${workflow.path.join(" ")} ${workflow.unavailable} ${workflow.evidence}`
  })),
  ...systemProjectDomains.map((domain) => ({
    type: "系统版图",
    title: domain.title,
    detail: `${domain.summary} ${domain.assets.map((asset) => asset.title).join("、")}`,
    href: `/#system-project-domain-${domain.id}`,
    aliases: [domain.ordinaryRequest],
    compactSearch: `${domain.ordinaryRequest} ${domain.delivery} ${domain.assets.map((asset) => asset.title).join(" ")}`,
    search: `${domain.ordinaryRequest} ${domain.delivery} ${domain.assets.map((asset) => `${asset.repo || ""} ${asset.role}`).join(" ")}`
  })),
  ...systemProjectDomains.flatMap((domain) => domain.assets
    .filter((asset) => asset.href.includes("/github-index/repository-ledger"))
    .map((asset) => ({
      type: "项目资产",
      group: "项目",
      scopes: ["project"],
      title: asset.title,
      detail: asset.role,
      href: `/#system-project-asset-${asset.id}`,
      aliases: [asset.repo].filter(Boolean),
      compactSearch: domain.title,
      search: domain.title
    }))),
  ...systemDependencyNodes.map((node) => ({
    type: "系统组成",
    title: node.title,
    detail: `${node.subtitle}。${node.detail}`,
    href: node.href.startsWith("#") ? `/${node.href}` : node.href,
    aliases: node.searchAliases || [],
    compactSearch: `${node.subtitle} ${node.detail}`,
    search: `${node.lane} ${node.subtitle} ${node.detail}`
  })),
  ...systemDependencyRelations.map((relation) => ({
    type: "系统关系",
    title: relation.label,
    detail: relation.detail,
    href: `/#system-relation-${relation.id}`,
    aliases: [],
    compactSearch: relation.nodes.map((id) => systemNodeTitles.get(id) || id).join(" "),
    search: relation.nodes.join(" ")
  }))
];
