import { modules, panelSnapshot, primaryNav, project, rulesSnapshot, site, socialLinks } from "./content-core.js";
import { excludedSkills, skills } from "./content-skills.js";

export { excludedSkills, modules, panelSnapshot, primaryNav, project, rulesSnapshot, site, skills, socialLinks };

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
}

export function canonicalUrl(pathname) {
  const path = normalizePath(pathname);
  return `${site.url}${path === "/" ? "/" : `${path}/`}`;
}

export const routePaths = [
  "/",
  project.route,
  ...modules.map((item) => `/projects/agents/${item.slug}`),
  "/rules",
  "/skills",
  ...skills.map((item) => `/skills/${item.slug}`)
];

export function routeMeta(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") {
    return {
      title: `项目｜${site.name}`,
      description: "吴乐阳的个人只读工作台，完整记录 .agents 项目、现行规则、Skills、验证状态与真实缺口。"
    };
  }
  if (path === "/projects/agents") {
    return {
      title: `.agents 项目总览｜${site.name}`,
      description: "从事实 Owner、授权、能力路由、保护策略、Skills 供应和证据分层理解 .agents。"
    };
  }
  if (path.startsWith("/projects/agents/")) {
    const slug = path.split("/").at(-1);
    const module = modules.find((item) => item.slug === slug);
    return module
      ? { title: `${module.title}｜.agents｜${site.name}`, description: module.problem.slice(0, 180) }
      : { title: `页面不存在｜${site.name}`, description: "没有找到对应的 .agents 模块。" };
  }
  if (path === "/rules") {
    return {
      title: `当前生效规则｜${site.name}`,
      description: `第 ${rulesSnapshot.generation} 代五份活动规则的完整人话解释、技术语义、哈希和验证矩阵。`
    };
  }
  if (path === "/skills") {
    return {
      title: `Skills｜${site.name}`,
      description: "个人当前可用 Skills 的用途、触发边界、输入输出、依赖、失败恢复和分层验证。"
    };
  }
  if (path.startsWith("/skills/")) {
    const slug = path.split("/").at(-1);
    const item = skills.find((candidate) => candidate.slug === slug);
    return item
      ? { title: `${item.name}｜Skills｜${site.name}`, description: item.summary.slice(0, 180) }
      : { title: `页面不存在｜${site.name}`, description: "没有找到对应的 Skill。" };
  }
  return { title: `页面不存在｜${site.name}`, description: "没有找到对应页面。" };
}
