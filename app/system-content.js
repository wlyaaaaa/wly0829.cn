import {
  systemDependencyNodes,
  systemHomeHero,
  systemScenarios
} from "./system-home-content.js";

export const systemSearchEntries = [
  {
    type: "系统总览",
    title: systemHomeHero.eyebrow,
    detail: `${systemHomeHero.title}。${systemHomeHero.paragraphs[0]}`,
    href: "/",
    aliases: ["个人 AI 工作系统", "AI 如何协助工作", "通用 AI 和个人项目怎样协作"],
    search: `${systemHomeHero.paragraphs.join(" ")} ${systemHomeHero.roles.map((item) => `${item.title} ${item.body}`).join(" ")}`
  },
  ...systemScenarios.map((scenario) => ({
    type: "真实工作场景",
    title: scenario.title,
    detail: `${scenario.request}｜${scenario.result}`,
    href: `/#system-scenario-${scenario.id}`,
    aliases: [scenario.label],
    search: `${scenario.systems.join(" ")} ${scenario.rules} ${scenario.value} ${scenario.stages.map((stage) => `${stage.title} ${stage.body} ${stage.items.flat().join(" ")}`).join(" ")}`
  })),
  ...systemDependencyNodes.map((node) => ({
    type: "系统组成",
    title: node.title,
    detail: `${node.subtitle}。${node.detail}`,
    href: `/#system-node-${node.id}`,
    aliases: [],
    search: `${node.lane} ${node.subtitle} ${node.detail}`
  }))
];
