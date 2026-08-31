import {
  systemActiveAutomations,
  systemDependencyNodes,
  systemEvidenceLayers,
  systemHomeHero,
  systemProjectDomains,
  systemScenarios
} from "./system-home-content.js";

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
  ...systemProjectDomains.map((domain) => ({
    type: "系统版图",
    title: domain.title,
    detail: `${domain.summary} ${domain.assets.filter((asset) => !asset.presentationOnly).map((asset) => asset.title).join("、")}`,
    href: `/#system-project-domain-${domain.id}`,
    aliases: [domain.ordinaryRequest],
    compactSearch: `${domain.ordinaryRequest} ${domain.delivery} ${domain.assets.filter((asset) => !asset.presentationOnly).map((asset) => asset.title).join(" ")}`,
    search: `${domain.ordinaryRequest} ${domain.delivery} ${domain.assets.filter((asset) => !asset.presentationOnly).map((asset) => `${asset.repo || ""} ${asset.role}`).join(" ")}`
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
    detail: node.searchDetail || `${node.subtitle}。${node.detail}`,
    href: (node.searchHref || node.href || node.links[0].href).startsWith("#") ? `/${node.searchHref || node.href || node.links[0].href}` : (node.searchHref || node.href || node.links[0].href),
    aliases: node.searchAliases || [],
    compactSearch: node.compactSearch || `${node.subtitle} ${node.detail}`,
    search: node.searchText || `${node.lane} ${node.subtitle} ${node.detail}`
  })),
  ...systemEvidenceLayers.map((layer) => ({
    type: "验证层",
    title: layer.title,
    detail: `能证明：${layer.proves} 不能证明：${layer.doesNotProve}`,
    href: `/#${layer.id === "human" ? "evidence-human" : `evidence-${layer.id}`}`,
    aliases: layer.searchAliases || [],
    compactSearch: `${layer.proves} ${layer.doesNotProve}`,
    search: `${layer.proves} ${layer.doesNotProve}`
  }))
];
