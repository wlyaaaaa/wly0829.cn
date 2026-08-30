import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "../app/page.jsx";
import { globalSearchEntries, searchPanel } from "../app/search.js";
import { canonicalPath, canonicalUrl, routeMeta, routePaths } from "../app/site-content.js";

const compactSearchCandidateAliases = [
  "规则如何激活", "什么时候开子代理", "能力路由与授权", "三控制面怎么分工",
  "本地构建通过为什么还不能说网站完成",
  "电脑配置恢复", "本机运行时和端口", "Windows 重装恢复", "机器事实在哪里",
  "仓库是公开还是私有", "远端和默认分支", "工作树和发布事实", "会不会推错仓库",
  "中文录音转写", "长音频断点续跑", "说话人分离", "本地语音识别",
  "过去一小时为什么卡", "1 秒 FPS 采样", "前台卡顿分析", "时间都花在哪", "数据库行和窗口标题不公开",
  "机箱屏冻结", "command 204", "HS2 六卡", "实体像素验收", "副屏显示恢复",
  "回答完成却没有结果", "隔离 workspace", "隐藏验证", "能力问题还是执行环境问题", "Agent 能力评测"
];

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceRequired(html, matcher, replacement) {
  if (!matcher.test(html)) throw new Error(`Expected HTML pattern was not found: ${matcher}`);
  return html.replace(matcher, replacement);
}

function canonicalDocumentHref(href) {
  const target = new URL(href, "https://wly0829.cn");
  return `${canonicalPath(target.pathname)}${target.search}${target.hash}`;
}

const projectedAliases = new Map();
for (const alias of compactSearchCandidateAliases) {
  const owner = searchPanel(alias)[0];
  if (!owner) continue;
  const ownerHref = canonicalDocumentHref(owner.href);
  const ownerKey = `${owner.type}|${owner.title}|${ownerHref}`;
  projectedAliases.set(ownerKey, [...(projectedAliases.get(ownerKey) || []), alias]);
}

const compactSearchIndex = globalSearchEntries.map((entry) => {
  const href = canonicalDocumentHref(entry.href);
  const projectionKey = `${entry.type}|${entry.title}|${href}`;
  return {
    type: entry.type,
    group: entry.group,
    scopes: entry.scopes || [],
    projectSlug: entry.projectSlug || null,
    title: entry.title,
    detail: entry.detail.slice(0, 240),
    href,
    aliases: [...new Set([...(entry.aliases || []), ...(projectedAliases.get(projectionKey) || [])])]
  };
});

export const compactSearchRecordCount = compactSearchIndex.length;

function jsonForInlineScript(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

const searchIndexScript = `<script id="search-index" type="application/json">${jsonForInlineScript(compactSearchIndex)}</script>`;

function likelyNextRoutes(route) {
  const currentIndex = routePaths.indexOf(route);
  return [...new Set([
    routePaths[currentIndex + 1],
    routePaths[currentIndex - 1],
    "/",
    "/system",
    "/rules",
    "/search",
    "/skills"
  ].filter((candidate) => candidate && candidate !== route))].slice(0, 5);
}

export function renderRoute(pathname, search = "") {
  return renderToStaticMarkup(<Page initialPathname={pathname} initialSearch={search} />);
}

export function renderDocument(template, pathname, search = "") {
  const route = canonicalPath(pathname) === "/" ? "/" : canonicalPath(pathname).slice(0, -1);
  const meta = routeMeta(route);
  const canonical = canonicalUrl(route);
  const prefetchLinks = likelyNextRoutes(route)
    .map((target) => `<link rel="prefetch" as="document" href="${escapeAttribute(canonicalPath(target))}" />`)
    .join("\n    ");
  let html = template;
  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeAttribute(meta.title)}</title>`);
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttribute(meta.description)}" />`);
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeAttribute(canonical)}" />`);
  html = replaceRequired(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeAttribute(canonical)}" />`);
  html = replaceRequired(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`);
  html = replaceRequired(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`);
  html = replaceRequired(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`);
  html = replaceRequired(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeAttribute(meta.description)}" />`);
  html = replaceRequired(html, /<div id="root"><\/div>/, `<div id="root" data-static-route="${escapeAttribute(route)}">${renderRoute(route, search)}</div>`);
  html = html.replace("</head>", `    ${prefetchLinks}\n  </head>`);
  if (!/<script\s+type="module"/.test(html)) throw new Error("HTML template has no client enhancement entry");
  return html.replace(/(<script\s+type="module")/, `${searchIndexScript}\n    $1`);
}
