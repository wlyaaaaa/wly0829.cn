import {
  panelSnapshot,
  primaryNav,
  rulesSnapshot,
  site,
  socialLinks
} from "./content-core.js";
import { excludedSkills, skills } from "./content-skills.js";
import { projectContentPackages } from "./project-content-index.generated.js";
import panelRegistry from "../config/panel-projects.json" with { type: "json" };

const contentPackages = projectContentPackages;

function registeredContent(entry) {
  const content = contentPackages.get(entry.id);
  if (!content) throw new Error(`Enabled panel project has no content package: ${entry.id}`);
  const expectedVisibility = entry.source.visibility === "PRIVATE" ? "私有仓库" : "公开仓库";
  const mismatches = [
    content.project.slug !== entry.id && "id",
    content.project.order !== entry.order && "order",
    content.project.title !== entry.title && "title",
    content.project.route !== entry.route && "route",
    content.project.visibility !== expectedVisibility && "visibility",
    entry.presentation_mode !== "real_dashboard" && "presentation_mode"
  ].filter(Boolean);
  if (mismatches.length) throw new Error(`Panel project registry/content mismatch for ${entry.id}: ${mismatches.join(",")}`);
  return { ...content, registration: entry };
}

export const projectCatalog = panelRegistry.projects
  .filter((entry) => entry.enabled)
  .sort((left, right) => left.order - right.order)
  .map(registeredContent);

export const projects = projectCatalog.map((entry) => entry.project);

export const agentsProject = contentPackages.get("agents").project;
export const agentsModules = contentPackages.get("agents").modules;
export const pcconfigProject = contentPackages.get("pcconfig").project;
export const pcconfigModules = contentPackages.get("pcconfig").modules;
export const githubIndexProject = contentPackages.get("github-index").project;
export const githubIndexModules = contentPackages.get("github-index").modules;
export const chineseAsrProject = contentPackages.get("chinese-asr").project;
export const chineseAsrModules = contentPackages.get("chinese-asr").modules;
export const timeAuditProject = contentPackages.get("timeaudit").project;
export const timeAuditModules = contentPackages.get("timeaudit").modules;

// Rules and Skills remain global surfaces owned by the accepted .agents
// project. These aliases preserve that contract while project pages become
// data-driven.
export const project = agentsProject;
export const modules = agentsModules;

export {
  excludedSkills,
  panelSnapshot,
  primaryNav,
  rulesSnapshot,
  site,
  skills,
  socialLinks
};

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
}

export function canonicalUrl(pathname) {
  return `${site.url}${canonicalPath(pathname)}`;
}

export function canonicalPath(pathname) {
  const path = normalizePath(pathname);
  return path === "/" ? "/" : `${path}/`;
}

export function projectEntryBySlug(slug) {
  return projectCatalog.find((entry) => entry.project.slug === slug);
}

export function projectEntryForPath(pathname) {
  const path = normalizePath(pathname);
  return projectCatalog.find((entry) => path === entry.project.route || path.startsWith(`${entry.project.route}/`));
}

export const routePaths = [
  "/",
  ...projectCatalog.flatMap((entry) => [
    entry.project.route,
    ...entry.modules.map((item) => `${entry.project.route}/${item.slug}`)
  ]),
  "/rules",
  "/skills",
  ...skills.map((item) => `/skills/${item.slug}`)
];

export function routeMeta(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") {
    return {
      title: `项目｜${site.name}`,
      description: "吴乐阳的个人只读工作台，完整记录 .agents、PCConfig、GitHub 总索引、ChineseASR、TimeAudit、PC Panel Hub、现行规则、Skills 与真实缺口。"
    };
  }

  const entry = projectEntryForPath(path);
  if (entry) {
    const { project: currentProject, modules: currentModules } = entry;
    if (path === currentProject.route) {
      return {
        title: `${currentProject.title} 项目总览｜${site.name}`,
        description: currentProject.summary.slice(0, 200)
      };
    }
    const moduleSlug = path.slice(currentProject.route.length + 1);
    const currentModule = currentModules.find((item) => item.slug === moduleSlug);
    return currentModule
      ? {
          title: `${currentModule.title}｜${currentProject.title}｜${site.name}`,
          description: currentModule.problem.slice(0, 200)
        }
      : { title: `页面不存在｜${site.name}`, description: `没有找到对应的 ${currentProject.title} 模块。` };
  }

  if (path === "/rules") {
    return {
      title: `${rulesSnapshot.releaseId} 当前规则｜${site.name}`,
      description: `${rulesSnapshot.releaseId} 五份活动 E 规则的完整人话解释、技术语义、文件 SHA、ruleset、current/previous 和验证矩阵。`
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
    return item && path === `/skills/${item.slug}`
      ? { title: `${item.name}｜Skills｜${site.name}`, description: item.summary.slice(0, 180) }
      : { title: `页面不存在｜${site.name}`, description: "没有找到对应的 Skill。" };
  }
  return { title: `页面不存在｜${site.name}`, description: "没有找到对应页面。" };
}
