import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpenText,
  CheckCircle,
  CopySimple,
  Desktop,
  EnvelopeSimple,
  House,
  Info,
  List,
  Laptop,
  LockKey,
  ShieldCheck,
  MagnifyingGlass,
  Minus,
  Plus,
  Warning,
  Wrench,
  X
} from "@phosphor-icons/react";
import { SiBilibili, SiGithub, SiGrafana, SiX } from "@icons-pack/react-simple-icons";
import {
  excludedSkills,
  canonicalPath,
  canonicalUrl,
  normalizePath,
  panelSnapshot,
  primaryNav,
  projectCatalog,
  projectEntryForPath,
  routeMeta,
  rulesSnapshot,
  site,
  skills,
  socialLinks
} from "./site-content.js";
import {
  systemActiveAutomations,
  systemDependencyLanes,
  systemDependencyNodes,
  systemDirectoryIntroductions,
  systemEvidenceLayers,
  systemHomeChapters,
  systemHomeHero,
  systemScenarios
} from "./system-home-content.js";
import { ruleGuides, legacyRuleAliases } from "./content-rule-guides.js";
import { ruleReaderGuides } from "./content-rule-reader.js";
import { skillGuides, skillOutcomes } from "./content-skill-guides.js";
import { capabilityRelationLabels, projectReferenceLinks, skillProjectLinks } from "./content-capability-links.js";
import { searchPanel, searchScopeById, searchScopeForPath, searchScopeOptionsForPath } from "./search.js";
import { createTermAnnotator } from "./term-annotator.js";
import { searchResultExcerpt } from "./compact-search.js";
import { ProjectContinuation } from "./continuation-brief.jsx";
import { mcpDevices, mcpMainFallback, mcpSetupNote } from "./content-mcp-access.js";
import ComputerAccess from "./computer-access.jsx";

function useLocationState(initialPathname, initialSearch) {
  const browserLocation = typeof window === "undefined" ? null : window.location;
  const [location, setLocation] = useState(() => ({
    pathname: normalizePath(initialPathname || browserLocation?.pathname || "/"),
    search: initialSearch ?? browserLocation?.search ?? ""
  }));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    function update() {
      setLocation({ pathname: normalizePath(window.location.pathname), search: window.location.search });
    }
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return location;
}

function SiteLink({ href, onNavigate, children, ...props }) {
  const internal = href.startsWith("/");
  const targetHref = internal ? (() => {
    const target = new URL(href, "https://local.invalid");
    return `${canonicalPath(target.pathname)}${target.search}${target.hash}`;
  })() : href;

  // Route changes intentionally use native directory-document navigation. The
  // build emits complete HTML for every target, so clicks never wait for a
  // content import or a client-side route fetch.
  void onNavigate;
  return <a href={targetHref} {...props}>{children}</a>;
}

function SocialIcon({ name }) {
  const props = { size: 18, color: "currentColor", "aria-hidden": true };
  if (name === "github") return <SiGithub {...props} />;
  if (name === "bilibili") return <SiBilibili {...props} />;
  if (name === "x") return <SiX {...props} />;
  return <EnvelopeSimple size={19} aria-hidden="true" />;
}

function GlobalSearch({ path = "/", search = "", autoFocus = false, className = "", resultId = "global-search-results" }) {
  const searchParams = new URLSearchParams(search);
  const initialQuery = path === "/search" ? searchParams.get("q") || "" : "";
  const requestedScope = path === "/search" ? searchScopeById(searchParams.get("scope")) : null;
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const currentScope = requestedScope || searchScopeForPath(path);
  const scopeOptions = path === "/search"
    ? [...new Map([currentScope, searchScopeById("all")].map((item) => [item.id, item])).values()]
    : searchScopeOptionsForPath(path);
  const [scope, setScope] = useState(currentScope.id);
  useEffect(() => { setScope(currentScope.id); setQuery(initialQuery); setOpen(false); }, [path, search, currentScope.id, initialQuery]);
  const selectedScope = scope === "all" ? searchScopeForPath("/search") : currentScope;
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return [];
    return searchPanel(normalized, scope);
  }, [normalized, scope]);
  const usesPartialAllIndex = path !== "/search" && scope === "all";

  return (
    <div
      className={`global-search${className ? ` ${className}` : ""}`}
      data-search-scope={scope}
      data-search-path={path}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    >
      <form className="global-search-form" role="search" action="/search/" method="get">
        <MagnifyingGlass size={18} aria-hidden="true" />
        <select className="search-scope-select" name="scope" aria-label="搜索范围" value={scope} onChange={(event) => { setScope(event.target.value); setOpen(true); }}>
          {scopeOptions.map((option) => <option value={option.id} data-search-placeholder={option.placeholder || searchScopeById(option.id)?.placeholder} data-search-help={option.help || searchScopeById(option.id)?.help} data-search-examples={(option.examples || searchScopeById(option.id)?.examples || []).join(" · ")} key={option.id}>{option.label}</option>)}
        </select>
        <input
          name="q"
          aria-label={`在${selectedScope.label}范围搜索关键词`}
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); event.currentTarget.blur(); } }}
          aria-expanded={Boolean(open)}
          aria-controls={open ? resultId : undefined}
          placeholder={selectedScope.placeholder}
        />
      </form>
      {open ? (
        <div className="global-search-results" id={resultId} aria-label={`${selectedScope.label}搜索结果`}>
          {!normalized ? <div className="global-search-help"><strong>{selectedScope.help}</strong><span>{selectedScope.examples?.length ? `试试：${selectedScope.examples.join(" · ")}` : "输入名称或直接描述问题"}</span></div> : null}
          {normalized ? <>
            <p aria-live="polite">{usesPartialAllIndex ? (results.length ? `显示最相关的前 ${Math.min(results.length, 9)} 项` : "快速结果未命中") : (results.length > 9 ? `找到 ${results.length} 项，显示前 9 项` : `找到 ${results.length} 项`)}</p>
            {results.length ? results.slice(0, 9).map((entry) => (
              <SiteLink href={entry.href} key={`${entry.type}-${entry.href}`} onNavigate={() => { setOpen(false); setQuery(""); }}>
                <span>{entry.type}</span><span><strong>{entry.title}</strong><small>{searchResultExcerpt(entry, query)}</small></span><ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
            )) : <div className="global-search-empty">{usesPartialAllIndex ? "快速结果没找到；按回车查看完整结果，还会继续搜索项目正文。" : "没找到匹配内容。可以换成日常说法、缩短关键词，或切换搜索范围。"}</div>}
            {usesPartialAllIndex || results.length > 9 ? <SiteLink className="global-search-all-results" href={`/search/?q=${encodeURIComponent(query)}&scope=${encodeURIComponent(scope)}`}>{usesPartialAllIndex ? "查看完整搜索结果" : `查看全部 ${results.length} 条结果`}<ArrowRight size={16} aria-hidden="true" /></SiteLink> : null}
          </> : null}
        </div>
      ) : null}
    </div>
  );
}

function FlowField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let previous = 0;
    let hidden = document.hidden;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now(), true);
    }

    function curveY(x, base, phase, amplitude) {
      return base
        + Math.sin(x * 0.00175 + phase) * amplitude
        + Math.sin(x * 0.00062 - phase * 0.67) * amplitude * 0.52
        + Math.sin(x * 0.0031 + phase * 0.31) * amplitude * 0.12;
    }

    function draw(now, force = false) {
      if (hidden && !force) return;
      if (!force && now - previous < 40) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      previous = now;
      context.clearRect(0, 0, width, height);

      const time = reducedMotion ? 0 : now / 1000;
      const lineCount = width < 700 ? 24 : 38;
      const fieldHeight = height + 260;
      const verticalDrift = reducedMotion ? 0 : time * 13;
      const amplitude = width < 700 ? 22 : 38;
      const step = width < 700 ? 9 : 12;

      for (let index = 0; index < lineCount; index += 1) {
        const row = (fieldHeight * index) / Math.max(lineCount - 1, 1);
        const base = -130 + ((row + verticalDrift) % fieldHeight);
        const phase = time * 0.16 + index * 0.025;
        const accent = index % 9 === 4;
        context.beginPath();
        for (let x = -80; x <= width + 80; x += step) {
          const y = curveY(x, base, phase, amplitude);
          if (x === -80) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = accent ? "rgba(0, 164, 73, 0.30)" : "rgba(0, 118, 53, 0.12)";
        context.lineWidth = accent ? 1.15 : 0.72;
        context.stroke();
      }

      if (!force && !reducedMotion && !hidden) frame = window.requestAnimationFrame(draw);
    }

    function handleVisibility() {
      hidden = document.hidden;
      window.cancelAnimationFrame(frame);
      if (!hidden) frame = window.requestAnimationFrame(draw);
    }
    function handleMotion(event) {
      reducedMotion = event.matches;
      window.cancelAnimationFrame(frame);
      draw(performance.now(), true);
      if (!reducedMotion && !hidden) frame = window.requestAnimationFrame(draw);
    }

    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener?.("change", handleMotion);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener?.("change", handleMotion);
    };
  }, []);

  return <canvas className="flow-field" ref={canvasRef} aria-hidden="true" />;
}

function navActive(href, path) {
  if (href === "/") return path === "/" || path === "/system";
  return path === href || path.startsWith(`${href}/`);
}

function Header({ path, search = "" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [path]);
  useEffect(() => {
    if (!menuOpen && !searchOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        (searchOpen ? searchButtonRef : menuButtonRef).current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, searchOpen]);
  return (
    <>
      <header className="site-header">
        <a className="skip-link" href="#main-content">跳到主要内容</a>
        <div className="header-inner">
        <a className="brand" href="https://github.com/wlyaaaaa" target="_blank" rel="noopener noreferrer" aria-label="在新窗口打开吴乐阳的 GitHub 主页"><img className="brand-logo" src="/media/brand/wuleyang-logo-full.png" width="1687" height="327" alt="" fetchPriority="high" /><span className="brand-text">吴乐阳</span></a>
        <nav className="primary-nav" aria-label="主要导航">
          {primaryNav.map((item) => (
            <SiteLink
              className={navActive(item.href, path) ? "is-active" : undefined}
              href={item.href}
              key={item.href}
              aria-current={navActive(item.href, path) ? "page" : undefined}
            >{item.label}</SiteLink>
          ))}
        </nav>
        {path === "/" ? <div className="home-search-dock"><a className="desktop-home-search" href="#home-search"><MagnifyingGlass size={17} aria-hidden="true" />搜索项目与能力</a></div> : <GlobalSearch path={path} search={search} className="desktop-search" resultId="desktop-global-search-results" />}
        <div className="header-utilities">
        <a className="header-connect" href="https://grafana.wly0829.cn/" target="_blank" rel="noopener noreferrer" aria-label="在新窗口打开 Grafana"><SiGrafana size={17} color="#F46800" aria-hidden="true" /><span>Grafana</span></a>
        <SiteLink className="header-connect" href="/mcp" aria-label="连接电脑" aria-current={path === "/mcp" ? "page" : undefined}><Desktop size={17} aria-hidden="true" /><span>连接电脑</span></SiteLink>
        <SiteLink className="header-connect" href="/computer-access/" aria-label="授权与状态" aria-current={path === "/computer-access" ? "page" : undefined}><ShieldCheck size={18} aria-hidden="true" /><span>授权与状态</span></SiteLink>
        <button
          ref={searchButtonRef}
          className="mobile-search-button"
          type="button"
          aria-label={searchOpen ? "关闭搜索" : "打开搜索"}
          aria-controls="mobile-site-search"
          aria-expanded={searchOpen}
          onClick={() => { setMenuOpen(false); setSearchOpen((value) => !value); }}
        >
          <span className="header-state-icon header-state-icon-closed"><MagnifyingGlass size={20} aria-hidden="true" /></span>
          <span className="header-state-icon header-state-icon-open"><X size={20} aria-hidden="true" /></span>
        </button>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "关闭外部链接" : "打开外部链接"}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          onClick={() => { setSearchOpen(false); setMenuOpen((value) => !value); }}
        >
          <span className="header-state-icon header-state-icon-closed"><List size={20} aria-hidden="true" /></span>
          <span className="header-state-icon header-state-icon-open"><X size={20} aria-hidden="true" /></span>
        </button>
        <div className={`header-navigation${menuOpen ? " is-open" : ""}`} id="site-navigation">
          <nav className="social-nav" aria-label="外部链接">
            {socialLinks.map((item) => (
              <a
                className="social-link"
                href={item.href}
                key={item.label}
                aria-label={item.ariaLabel}
                rel={item.mail ? undefined : "noopener noreferrer"}
                target={item.mail ? undefined : "_blank"}
              >
                <SocialIcon name={item.icon} /><span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        </div>
        <div className={`mobile-search-panel${searchOpen ? " is-open" : ""}`} id="mobile-site-search" hidden={!searchOpen}>{path !== "/" ? <GlobalSearch path={path} search={search} autoFocus={searchOpen} className="mobile-search-control" resultId="mobile-global-search-results" /> : null}</div>
        </div>
      </header>
      <button className="menu-backdrop" type="button" tabIndex={-1} aria-label="关闭顶部浮层背景" onClick={() => { setMenuOpen(false); setSearchOpen(false); }} hidden={!menuOpen && !searchOpen} />
    </>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="面包屑导航">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <SiteLink href={item.href}>{item.label}</SiteLink> : <span aria-current="page">{item.label}</span>}
          {index < items.length - 1 ? <span className="breadcrumb-separator">/</span> : null}
        </span>
      ))}
    </nav>
  );
}

function StatusPill({ status, children }) {
  return <span className={`status-pill status-${status}`}>{children}</span>;
}

function moduleStatusTone(module) {
  if (module.statusTone === "problem" || module.statusTone === "mixed") return "repair";
  if (module.statusTone === "unknown") return "unknown";
  if (module.statusTone === "pass") return "pass";
  return "unknown";
}

function ThreeStateSummary({ pass, problem, unavailable, kind, labels: customLabels }) {
  const labels = customLabels || (kind === "learning"
    ? ["证据足够时", "遇到冲突时", "暂时无法判断时"]
    : ["正常时", "发现问题时", "入口不可用或证据不足时"]);
  return (
    <div className="outcome-state-grid">
      <article><h3>{labels[0]}</h3><p>{displayCopy(pass, kind)}</p></article>
      <article><h3>{labels[1]}</h3><p>{displayCopy(problem, kind)}</p></article>
      <article><h3>{labels[2]}</h3><p>{displayCopy(unavailable, kind)}</p></article>
    </div>
  );
}

function skillStatusTone(item) {
  if (item.statusTone === "problem") return "repair";
  if (["pass", "mixed", "unknown"].includes(item.statusTone)) return item.statusTone;
  return "unknown";
}

function authorityStatusText(status) {
  if (status === "e_rules_active_verified") return "e_rules_active_verified（E 规则已验证）";
  if (status === "candidate_pending") return "candidate_pending（候选规则待发布）";
  if (status === "active_verified") return "active_verified（活动规则已验证）";
  if (status === "candidate_unavailable") return "candidate_unavailable（候选规则暂不可取得）";
  return annotateTerms(status);
}

function observedTimeText(value) {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(String(value))) return String(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}（中国时间）`;
}

function ObservedTime({ value }) {
  const iso = /^\d{4}-\d{2}-\d{2}T/.test(String(value));
  return <span className="observed-time" title={iso ? String(value) : undefined}>{iso ? <time dateTime={value}>{observedTimeText(value)}</time> : observedTimeText(value)}</span>;
}

function publicRepositoryUrl(entry) {
  return entry.registration.source.visibility === "PUBLIC"
    ? `https://github.com/${entry.registration.source.repo}`
    : null;
}

function projectCardPresentation(entry) {
  const state = entry.project.currentState || {};
  return {
    tone: entry.project.cardStatusTone || moduleStatusTone(entry.project),
    status: entry.project.cardStatus || state.label || "可按当前说明使用",
    boundary: entry.project.readerBoundary || entry.project.currentSnapshot?.boundary || state.gaps?.[0] || "本页不承诺后台实时同步",
    observedAt: state.observedAt || "当前网页快照"
  };
}

function resolvedCapabilityRelation(relation) {
  if (relation.href) return { ...relation, href: relation.href };
  if (relation.systemAssetId) return { ...relation, href: `/#system-project-asset-${relation.systemAssetId}` };
  if (relation.projectSlug) {
    const projectEntry = projectCatalog.find((entry) => entry.project.slug === relation.projectSlug);
    if (!projectEntry) return { ...relation, href: null };
    const module = relation.moduleSlug ? projectEntry.modules.find((item) => item.slug === relation.moduleSlug) : null;
    return { ...relation, href: module ? `${projectEntry.project.route}/${module.slug}` : projectEntry.project.route };
  }
  return { ...relation, href: null };
}

function CapabilityLinkBar({ title, items }) {
  const resolved = items.map(resolvedCapabilityRelation);
  if (!resolved.length) return null;
  return (
    <aside className="capability-link-bar" aria-label={title}>
      <strong>{title}</strong>
      <div>{resolved.map((item, index) => {
        const content = <><span>{item.kindLabel || capabilityRelationLabels[item.relation] || "相关入口"}</span><b>{item.label}</b>{item.href ? <ArrowRight size={14} aria-hidden="true" /> : null}</>;
        return item.href
          ? <SiteLink href={item.href} key={`${item.relation}-${item.href}-${index}`}>{content}</SiteLink>
          : <span className="capability-link-note" key={`${item.relation}-${item.label}-${index}`}>{content}</span>;
      })}</div>
    </aside>
  );
}

function skillConnectionItems(slug) {
  return skillProjectLinks[slug] || [];
}

function projectConnectionItems(projectSlug) {
  const relatedSkills = new Map();
  for (const [skillSlug, relations] of Object.entries(skillProjectLinks)) {
    const relation = relations.find((item) => item.projectSlug === projectSlug);
    const skill = skills.find((item) => item.slug === skillSlug);
    if (!relation || !skill) continue;
    relatedSkills.set(skillSlug, {
      relation: relation.relation,
      href: `/skills/${skillSlug}`,
      label: skill.title,
      kindLabel: relation.relation === "uses-project" ? "相关 Skill" : "能力入口"
    });
  }
  const explicit = projectReferenceLinks[projectSlug] || [];
  return [...explicit, ...[...relatedSkills.values()].filter((item) => !explicit.some((link) => link.href && canonicalPath(link.href) === canonicalPath(item.href)))];
}

function ProjectMetrics({ items, kind }) {
  if (!items?.length) return null;
  return <dl className="project-metrics">{items.map((item) => <div key={item.label}><dt>{displayCopy(item.label, kind)}</dt><dd>{displayCopy(item.value, kind)}</dd></div>)}</dl>;
}

function ProjectCard({ entry, number }) {
  const { project: currentProject, modules: currentModules } = entry;
  const moduleOptions = [
    { label: "总览", href: currentProject.route },
    ...currentModules.map((item) => ({ label: item.shortTitle, href: `${currentProject.route}/${item.slug}` }))
  ];
  const moduleRows = Array.from(
    { length: Math.ceil(moduleOptions.length / 7) },
    (_, index) => moduleOptions.slice(index * 7, index * 7 + 7)
  );
  const presentation = projectCardPresentation(entry);
  const headingId = `${currentProject.slug}-card-title`;
  const repositoryUrl = publicRepositoryUrl(entry);

  return (
    <article className={`project-card-shell reader-project-card${entry.kind === "learning" ? " learning-project-card" : ""}`}>
      {repositoryUrl ? (
        <a className="project-visibility project-repository-button" href={repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label={`打开 ${currentProject.title} 的公开 GitHub 仓库`}>
          <SiGithub size={15} aria-hidden="true" /><span>GitHub 仓库</span>
        </a>
      ) : (
        <span className="project-visibility project-private-status"><LockKey size={15} aria-hidden="true" />{currentProject.visibility}</span>
      )}
      <SiteLink className="featured-project" href={currentProject.route} aria-labelledby={headingId}>
        <span className="project-index" aria-hidden="true"><strong>{String(number).padStart(2, "0")}</strong><span /></span>
        <div className="project-card-body">
          <div className="project-card-header">
            <div className="project-title-row"><span className="project-mark" aria-hidden="true" /><h2 id={headingId}>{currentProject.title}</h2></div>
          </div>
          <p className="project-summary">{displayCopy(currentProject.summary, entry.kind)}</p>
          <ProjectMetrics items={currentProject.cardMetrics} kind={entry.kind} />
          <dl className="project-card-state">
            <div><dt>项目状态</dt><dd><span className={`project-card-status-text status-${presentation.tone}`}>{displayCopy(presentation.status, entry.kind)}</span></dd></div>
            <div className="project-card-snapshot-boundary"><dt>快照边界</dt><dd>{displayCopy(presentation.boundary, entry.kind)}</dd></div>
          </dl>
          <div className="project-card-foot">
            <ObservedTime value={presentation.observedAt} />
            <ArrowRight size={18} aria-hidden="true" />
          </div>
        </div>
      </SiteLink>
      <nav className="project-module-links" aria-label={`${currentProject.title} 模块入口`}>
        <span>模块</span>
        <div className="project-module-link-rows">{moduleRows.map((row, rowIndex) => (
          <div className="project-module-link-row" style={{ "--module-count": row.length, "--mobile-last-span": row.length % 4 === 0 ? 1 : 5 - (row.length % 4) }} key={`${currentProject.slug}-module-row-${rowIndex}`}>
            {row.map((item) => <SiteLink className={item.href === currentProject.route ? "is-default" : undefined} href={item.href} key={item.href}>{item.label === "Skills / Plugins" ? item.label : annotateTerms(item.label)}</SiteLink>)}
          </div>
        ))}</div>
      </nav>
    </article>
  );
}

function HomePage() {
  return (
    <div className="page-frame home-page">
      <h1 className="visually-hidden">个人项目</h1>
      <div className="project-grid">
        {projectCatalog.map((entry, index) => <ProjectCard entry={entry} number={index + 1} key={entry.project.slug} />)}
      </div>
    </div>
  );
}

function projectKicker() { return "项目与实际用途"; }

function ProjectHero({ entry, module }) {
  const { project: currentProject } = entry;
  const repositoryUrl = publicRepositoryUrl(entry);
  const breadcrumbItems = module
    ? [{ label: "项目", href: "/projects" }, { label: currentProject.title, href: currentProject.route }, { label: module.shortTitle || module.title }]
    : [{ label: "项目", href: "/projects" }, { label: currentProject.title }];
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <section className={`project-hero${module ? " project-hero-module" : ""}`}>
        <div className="project-hero-main">
          <div className="project-hero-copy">
            <p className="section-kicker">{module ? `${currentProject.title} · 功能说明` : currentProject.kicker || projectKicker(entry.kind)}</p>
            <h1><span className="title-accent" aria-hidden="true" /><span className="project-hero-title-text">{displayCopy(module?.title || currentProject.title, entry.kind)}</span></h1>
            <p className="project-lead">{displayCopy(module?.value || currentProject.summary, entry.kind)}</p>
            {module?.readerStatus ? <p className="module-reader-state"><strong>当前情况：</strong>{displayCopy(module.readerStatus, entry.kind)}</p> : null}
            {module ? <p className="reader-observation">项目快照核对于 <ObservedTime value={projectCardPresentation(entry).observedAt} />；具体测试保留各自日期，页面不实时探测运行状态。</p> : null}
            {!module ? <ProjectQuickState entry={entry} /> : null}
          </div>
        </div>
        <aside className="snapshot-card project-entry-card" aria-label="项目源码">
          <span className="snapshot-label">项目源码</span>
          <strong>{currentProject.visibility}</strong>
          {!repositoryUrl ? <span>源码未公开；用法与技术说明可在下面阅读。</span> : null}
          {repositoryUrl ? <a className="project-hero-repository-link" href={repositoryUrl} target="_blank" rel="noopener noreferrer"><SiGithub size={17} aria-hidden="true" />打开 GitHub 仓库</a> : null}
        </aside>
      </section>
    </>
  );
}

function ProjectNav({ entry, current }) {
  const { project: currentProject, modules: currentModules } = entry;
  const navigationRef = useRef(null);

  useEffect(() => {
    const navigation = navigationRef.current;
    const selected = navigation?.querySelector('[aria-current="page"]');
    if (!navigation || !selected) return;
    if (window.innerWidth <= 900) {
      navigation.scrollLeft = Math.max(0, selected.offsetLeft - (navigation.clientWidth - selected.clientWidth) / 2);
    } else {
      navigation.scrollTop = Math.max(0, selected.offsetTop - 8);
    }
  }, [current, currentProject.route]);

  return (
    <nav className="project-navigation" aria-label={`${currentProject.title} 模块导航`} ref={navigationRef}>
      <SiteLink className={!current ? "is-current" : undefined} href={currentProject.route} aria-current={!current ? "page" : undefined}>总览</SiteLink>
      {currentModules.map((item) => (
        <SiteLink
          className={current === item.slug ? "is-current" : undefined}
          href={`${currentProject.route}/${item.slug}`}
          key={item.slug}
          aria-current={current === item.slug ? "page" : undefined}
        >{annotateTerms(item.shortTitle)}</SiteLink>
      ))}
    </nav>
  );
}

function ValidationMatrix({ compact = false }) {
  const failures = panelSnapshot.validation.failures || [];
  return (
    <>
      <div className={`validation-matrix${compact ? " is-compact" : ""}`}>
        {panelSnapshot.validation.rows.map((row) => (
          <article key={row.layer}>
            <div><strong>{row.layer}</strong><StatusPill status={row.status}>{row.label}</StatusPill></div>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
      {failures.length ? (
        <section className="validation-failures" aria-labelledby="validation-failures-title">
          <h3 id="validation-failures-title">当前失败项与恢复线索</h3>
          <p>这里不只亮一盏红灯。每一项都保留测试身份、文件位置和本轮原因；退出码与耗时只在真实回执提供时显示，方便直接找到该修哪一步。</p>
          {failures.map((failure) => (
            <article key={failure.id}>
              <div><strong>{failure.id === "e-rules-release-validator" ? "规则发布验证" : failure.id}</strong><StatusPill status="repair">失败</StatusPill></div>
              <dl>
                <div><dt>检查项</dt><dd><code>{failure.id}</code></dd></div>
                <div><dt>测试文件</dt><dd><code>{failure.path}</code></dd></div>
                <div><dt>退出码 / 耗时</dt><dd>{failure.exitCode ?? "无"} / {failure.durationSeconds == null ? "无" : `${failure.durationSeconds} 秒`}</dd></div>
                <div><dt>失败原因</dt><dd><details><summary>查看本次检查返回的原始错误</summary><p>{failure.reason}</p></details></dd></div>
              </dl>
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}

function ProjectCurrentState({ entry }) {
  if (entry.kind === "agents") {
    return (
      <dl className="fact-grid">
        <div><dt>仓库</dt><dd>{panelSnapshot.repositoryVisibility} / {annotateTerms(panelSnapshot.sourceBranch)}<small>来自项目 Registry 登记；GitHub 实时可见性仍需 Git Owner 单独回读</small></dd></div>
        <div><dt>源提交</dt><dd><code>{panelSnapshot.sourceCommit.slice(0, 12)}</code></dd></div>
        <div><dt>同步状态</dt><dd>{annotateTerms(panelSnapshot.sourceSync)}</dd></div>
        <div><dt>活动 E 规则</dt><dd>{authorityStatusText(panelSnapshot.authority.status)} / {panelSnapshot.authority.releaseId} / pointer revision {panelSnapshot.authority.pointerRevision}</dd></div>
        <div><dt>规则身份</dt><dd><code>{panelSnapshot.authority.gitCommit.slice(0, 12)}</code><small>ruleset {panelSnapshot.authority.rulesetSha256}</small></dd></div>
        <div><dt>前一代</dt><dd>{panelSnapshot.authority.previous?.release_id || "无"}<small>{panelSnapshot.authority.previous?.git_commit?.slice(0, 12) || "无 previous commit"}</small></dd></div>
        <div><dt>源码与 release</dt><dd>{panelSnapshot.authority.sourceMatchesRelease ? "五份 canonical source 与活动 release 一致" : `当前 source 有 ${panelSnapshot.sourceDirtyCount || 0} 项未激活施工；活动规则仍是 frozen ${panelSnapshot.authority.releaseId}`}</dd></div>
        <div><dt>Skills（能力入口）</dt><dd>面板收录 {skills.length} / 当前供应 {panelSnapshot.skills.publicInstallIntentCount}</dd></div>
      </dl>
    );
  }
  const state = entry.project.currentState;
  if (entry.kind === "learning") {
    return (
      <>
        <div className="project-state-heading learning-method-state"><StatusPill status={moduleStatusTone(entry.project)}>{displayCopy(state.label, "learning")}</StatusPill><ObservedTime value={state.observedAt} /></div>
        <div className="split-section project-state-split learning-method-state-grid">
          <div><h3>已经明确的做法</h3><ul className="plain-list">{state.facts.map((item) => <li key={item}>{displayCopy(item, "learning")}</li>)}</ul></div>
          <div><h3>不能据此推断</h3><ul className="plain-list">{state.gaps.map((item) => <li key={item}>{displayCopy(item, "learning")}</li>)}</ul></div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="project-state-heading"><StatusPill status={moduleStatusTone(entry.project)}>{displayCopy(state.label, entry.kind)}</StatusPill><ObservedTime value={state.observedAt} /></div>
      <div className="split-section project-state-split">
        <div><h3>已确认事实</h3><ul className="plain-list">{state.facts.map((item) => <li key={item}>{displayCopy(item, entry.kind)}</li>)}</ul></div>
        <div><h3>当前缺口</h3><ul className="plain-list">{state.gaps.map((item) => <li key={item}>{displayCopy(item, entry.kind)}</li>)}</ul></div>
      </div>
    </>
  );
}

function ProjectGallery({ title, images, presentation = {} }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [fitSize, setFitSize] = useState(null);
  const [displayedImageSrc, setDisplayedImageSrc] = useState(null);
  const closeButtonRef = useRef(null);
  const imageRef = useRef(null);
  const returnFocusRef = useRef(null);
  const viewportRef = useRef(null);
  const zoomRef = useRef(1);
  const fullImageRequestsRef = useRef(new Map());
  const fullRequestTokenRef = useRef(0);
  const prefetchAdjacent = presentation.prefetchAdjacentFull === true;
  zoomRef.current = zoom;
  const isOpen = activeIndex !== null;
  const hasStructuredEvidence = images.every((image) => image.evidenceLevel && image.evidenceLabel && image.proves && image.doesNotProve);

  const measureImageFit = useCallback((image = imageRef.current) => {
    const viewport = viewportRef.current;
    if (!image?.naturalWidth || !image?.naturalHeight || !viewport?.clientWidth || !viewport?.clientHeight) return;
    const scale = Math.min(viewport.clientWidth / image.naturalWidth, viewport.clientHeight / image.naturalHeight);
    const next = {
      width: Math.max(1, Math.floor(image.naturalWidth * scale)),
      height: Math.max(1, Math.floor(image.naturalHeight * scale)),
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      viewportWidth: viewport.clientWidth,
      viewportHeight: viewport.clientHeight
    };
    setFitSize((current) => current && Object.keys(next).every((key) => current[key] === next[key]) ? current : next);
  }, []);

  const loadDecodedFullImage = useCallback((src) => {
    const existing = fullImageRequestsRef.current.get(src);
    if (existing) return existing;
    const request = (async () => {
      const candidate = new Image();
      candidate.decoding = "async";
      candidate.src = src;
      await candidate.decode();
      if (!candidate.naturalWidth || !candidate.naturalHeight) throw new Error("gallery_full_image_empty");
      return candidate;
    })();
    fullImageRequestsRef.current.set(src, request);
    request.catch(() => {
      if (fullImageRequestsRef.current.get(src) === request) fullImageRequestsRef.current.delete(src);
    });
    return request;
  }, []);

  const prefetchAdjacentFullImages = useCallback((index) => {
    if (!prefetchAdjacent || images.length < 2) return;
    const adjacent = new Set([(index - 1 + images.length) % images.length, (index + 1) % images.length]);
    for (const adjacentIndex of adjacent) void loadDecodedFullImage(images[adjacentIndex].src).catch(() => {});
  }, [images, loadDecodedFullImage, prefetchAdjacent]);

  function changeZoom(delta) {
    setZoom((current) => {
      const next = Math.min(4, Math.max(1, Number((current + delta).toFixed(1))));
      zoomRef.current = next;
      return next;
    });
  }

  function resetZoom() {
    zoomRef.current = 1;
    setZoom(1);
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  }

  function selectImage(index) {
    const nextIndex = (index + images.length) % images.length;
    fullRequestTokenRef.current += 1;
    if (!prefetchAdjacent) fullImageRequestsRef.current.clear();
    resetZoom();
    setFitSize(null);
    setDisplayedImageSrc(images[nextIndex].thumbnail || images[nextIndex].src);
    setActiveIndex(nextIndex);
  }

  function closeImage() {
    fullRequestTokenRef.current += 1;
    resetZoom();
    setFitSize(null);
    setDisplayedImageSrc(null);
    setActiveIndex(null);
  }

  function changeImage(delta) {
    selectImage(activeIndex + delta);
  }

  useEffect(() => {
    if (!isOpen) return;
    setZoom(1);
    setFitSize(null);
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => measureImageFit());
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [isOpen, activeIndex, measureImageFit]);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const requestIndex = activeIndex;
    const requestToken = fullRequestTokenRef.current;
    let current = true;
    void (async () => {
      try {
        await loadDecodedFullImage(images[requestIndex].src);
        if (!current || requestToken !== fullRequestTokenRef.current || requestIndex !== activeIndex) return;
        setDisplayedImageSrc(images[requestIndex].src);
        setFitSize(null);
        window.requestAnimationFrame(() => measureImageFit());
        prefetchAdjacentFullImages(requestIndex);
      } catch {
        // Keep the eager thumbnail visible and every control usable.
      }
    })();
    return () => { current = false; };
  }, [activeIndex, images, loadDecodedFullImage, measureImageFit, prefetchAdjacentFullImages]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event) {
      if (event.key === "Tab") {
        const controls = Array.from(document.querySelectorAll('.project-lightbox button:not([disabled]), .project-lightbox-viewport[tabindex="0"]'));
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      } else if (event.key === "Escape") closeImage();
      else if (event.key === "ArrowLeft" && !(zoomRef.current > 1 && viewportRef.current?.contains(document.activeElement))) changeImage(-1);
      else if (event.key === "ArrowRight" && !(zoomRef.current > 1 && viewportRef.current?.contains(document.activeElement))) changeImage(1);
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "+" || event.key === "=")) {
        event.preventDefault();
        changeZoom(0.5);
      } else if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "-" || event.key === "_")) {
        event.preventDefault();
        changeZoom(-0.5);
      } else if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === "0") {
        event.preventDefault();
        resetZoom();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => returnFocusRef.current?.focus());
    };
  }, [isOpen, images.length]);

  if (!images.length) return null;
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const scaledImageSize = fitSize ? {
    width: Math.max(1, Math.round(fitSize.width * zoom)),
    height: Math.max(1, Math.round(fitSize.height * zoom))
  } : null;
  const imageCanvasStyle = scaledImageSize ? {
    width: `${zoom === 1 ? scaledImageSize.width : Math.max(fitSize.viewportWidth, scaledImageSize.width)}px`,
    height: `${zoom === 1 ? scaledImageSize.height : Math.max(fitSize.viewportHeight, scaledImageSize.height)}px`
  } : undefined;
  const imageStyle = scaledImageSize ? { width: `${scaledImageSize.width}px`, height: `${scaledImageSize.height}px` } : undefined;
  const imageOrientation = fitSize && fitSize.naturalWidth > fitSize.naturalHeight ? "landscape" : "portrait";
  function openImage(index, event) {
    returnFocusRef.current = event.currentTarget;
    selectImage(index);
  }

  return (
    <section className={`document-section project-gallery${presentation.variant ? ` ${presentation.variant}` : ""}`} aria-labelledby="project-gallery-title" data-gallery-prefetch-adjacent-full={prefetchAdjacent ? "true" : "false"}>
      <div className="project-gallery-heading">
        <div><p className="section-kicker">{presentation.kicker || (hasStructuredEvidence ? "可视化证据" : "真实界面")}</p><h2 id="project-gallery-title">{presentation.title || `${title} 的${hasStructuredEvidence ? "图片与证据等级" : "可视化结果"}`}</h2></div>
        <p>{presentation.description || (hasStructuredEvidence ? "单击图片查看完整大图；每张图同时说明它能证明和不能证明什么。" : "单击图片查看完整大图。")}打开后可缩放、滚动查看细节，也可关闭或切换上一张、下一张。</p>
      </div>
      <div className="project-gallery-grid">
        {images.map((image, index) => (
          <button
            className="project-gallery-card"
            type="button"
            style={image.width > 0 && image.height > 0 ? { "--photo-ratio": image.width / image.height } : undefined}
            onClick={(event) => openImage(index, event)}
            key={image.src}
            aria-label={`打开大图：${image.alt}`}
            data-gallery-src={image.src}
            data-gallery-alt={image.alt}
            data-gallery-caption={image.caption}
            data-gallery-evidence-level={image.evidenceLevel || ""}
            data-gallery-evidence-label={image.evidenceLabel || ""}
            data-gallery-proves={image.proves || ""}
            data-gallery-does-not-prove={image.doesNotProve || ""}
            data-gallery-category-label={image.categoryLabel || ""}
          >
            <img src={image.thumbnail || image.src} alt={image.alt} width={image.width || undefined} height={image.height || undefined} loading="lazy" decoding="async" style={image.thumbnailPosition ? { objectPosition: image.thumbnailPosition } : undefined} />
            <span><strong>{String(index + 1).padStart(2, "0")}</strong><span>{image.evidenceLevel ? <b>{image.evidenceLevel} · {image.evidenceLabel}</b> : image.categoryLabel ? <b>{image.categoryLabel}</b> : null}{image.caption}</span></span>
          </button>
        ))}
      </div>
      {activeImage ? createPortal((
        <div className="project-lightbox" role="dialog" aria-modal="true" aria-labelledby="project-lightbox-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeImage(); }}>
          <div className="project-lightbox-dialog" data-image-orientation={imageOrientation} data-zoom={zoom}>
            <h2 className="visually-hidden" id="project-lightbox-title">图片查看器：{activeImage.alt}</h2>
            <div className="project-lightbox-toolbar">
              <span>{activeIndex + 1} / {images.length}</span>
              <span className="visually-hidden" aria-live="polite" aria-atomic="true">第 {activeIndex + 1} 张，共 {images.length} 张：{activeImage.alt}</span>
              <div className="project-lightbox-zoom-controls" role="group" aria-label="大图缩放">
                <button type="button" onClick={() => changeZoom(-0.5)} disabled={zoom <= 1} aria-label="缩小大图"><Minus size={20} aria-hidden="true" /></button>
                <button className="project-lightbox-zoom-reset" type="button" onClick={resetZoom} aria-label="恢复适合窗口大小"><span aria-live="polite">{Math.round(zoom * 100)}%</span></button>
                <button type="button" onClick={() => changeZoom(0.5)} disabled={zoom >= 4} aria-label="放大大图"><Plus size={20} aria-hidden="true" /></button>
              </div>
              <button className="project-lightbox-close" type="button" onClick={closeImage} ref={closeButtonRef} aria-label="关闭大图"><X size={22} aria-hidden="true" />关闭</button>
            </div>
            <div className="project-lightbox-stage">
              <figure>
                <div className="project-lightbox-viewport" ref={viewportRef} data-zoom={zoom} tabIndex="0" aria-label={zoom > 1 ? "已放大的图片区域；使用方向键或滚动条查看细节" : "完整图片区域"}>
                  <button className="project-lightbox-previous" type="button" onClick={() => changeImage(-1)} aria-label="上一张"><ArrowLeft size={25} aria-hidden="true" /></button>
                  <div className="project-lightbox-image-canvas" style={imageCanvasStyle}>
                    <img className="project-lightbox-image" ref={imageRef} src={displayedImageSrc || activeImage.thumbnail || activeImage.src} alt={activeImage.alt} style={imageStyle} onLoad={(event) => measureImageFit(event.currentTarget)} onDoubleClick={() => zoom === 1 ? setZoom(2) : resetZoom()} />
                  </div>
                  <button className="project-lightbox-next" type="button" onClick={() => changeImage(1)} aria-label="下一张"><ArrowRight size={25} aria-hidden="true" /></button>
                </div>
                <figcaption className="project-lightbox-caption" id="project-lightbox-caption">
                  {activeImage.evidenceLevel ? <strong>{activeImage.evidenceLevel} · {activeImage.evidenceLabel}</strong> : activeImage.categoryLabel ? <strong>{activeImage.categoryLabel}</strong> : null}
                  <span>{activeImage.caption}</span>
                  {activeImage.proves ? <small><b>能证明：</b>{activeImage.proves}</small> : null}
                  {activeImage.doesNotProve ? <small><b>不能证明：</b>{activeImage.doesNotProve}</small> : null}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      ), document.body) : null}
    </section>
  );
}

function MethodCanvas({ canvas, kind }) {
  if (!canvas?.steps?.length) return null;
  const copy = (value) => displayCopy(value, kind);
  const roleColumns = canvas.columns || [
    { title: "你", note: "决定与反馈", items: canvas.humanRole || [] },
    { title: "AI", note: "研究与协助", items: canvas.aiRole || [] },
    { title: "刻意没有", note: "有意不建设", items: canvas.absentByDesign || [] }
  ];
  const questions = canvas.thinkingQuestions || [];

  return (
    <section className="method-canvas document-section" aria-labelledby="method-canvas-title">
      <header className="method-canvas-heading">
        <p className="section-kicker">{canvas.kicker || "方法画布"} · {canvas.steps.length} 步</p>
        <h2 id="method-canvas-title">{copy(canvas.headline)}</h2>
        <p>{copy(canvas.description || "这是一张可直接照着使用的说明，不是学习进度表。每一步都说明谁来做，也保留暂停、反驳和改方向的空间。")}</p>
      </header>
      <ol className="method-step-flow" aria-label={`${canvas.steps.length} 步协作流程`}>
        {canvas.steps.map((step, index) => (
          <li key={`${step.actor}-${step.title}`}>
            <span className="method-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="method-step-actor">{step.actor}</span>
            <strong>{copy(step.title)}</strong>
            <p>{copy(step.detail)}</p>
          </li>
        ))}
      </ol>
      <div className="method-role-grid plain-language-grid" aria-label={canvas.columnsAriaLabel || "你、AI与刻意不建设的边界"}>
        {roleColumns.map((column) => (
          <article key={column.title}>
            <header><h3>{column.title}</h3><span>{column.note}</span></header>
            <ul className="plain-list">{column.items.map((item) => <li key={item}>{copy(item)}</li>)}</ul>
          </article>
        ))}
      </div>
      {questions.length ? (
        <section className="method-thinking-questions" aria-labelledby="method-thinking-questions-title">
          <header>
            <div><p className="section-kicker">可选练习</p><h3 id="method-thinking-questions-title">问题不计分，也不会形成掌握记录</h3></div>
            <p>只选当前真正有帮助的一题即可；跳过、暂停或换方向都不需要解释。</p>
          </header>
          <ol className="number-list method-thinking-question-list">{questions.map((question, index) => <li key={question}><span>{index + 1}</span><div><p>{copy(question)}</p></div></li>)}</ol>
        </section>
      ) : null}
    </section>
  );
}

const projectReadingLayers = [
  { id: "product", label: "产品用法" },
  { id: "technical", label: "技术与依据" }
];

function ProjectReadingNav() {
  return (
    <nav className="project-reading-nav" aria-label="阅读方式" role="tablist">
      {projectReadingLayers.map((layer, index) => <a role="tab" id={`project-reading-tab-${layer.id}`} aria-controls={`project-reading-panel-${layer.id}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} data-project-reading-tab={layer.id} className={index === 0 ? "is-current" : undefined} href={`#project-reading-panel-${layer.id}`} key={layer.id}>{layer.label}</a>)}
    </nav>
  );
}

function ProjectReadingPanel({ id, selected = false, children }) {
  return <section className="project-reading-panel" id={`project-reading-panel-${id}`} data-project-reading-panel={id} role="tabpanel" aria-labelledby={`project-reading-tab-${id}`} hidden={!selected}>{children}</section>;
}

function UsageStart({ entry, inputs, kind }) {
  return (
    <section className="usage-start">
      <h2>从哪里开始</h2>
      <p>{displayCopy(entry, kind)}</p>
      {inputs?.length ? <div className="usage-inputs"><h3>需要准备什么</h3><ul className="plain-list">{inputs.map((input) => <li key={input}>{displayCopy(input, kind)}</li>)}</ul></div> : null}
    </section>
  );
}

function TechnicalSections({ sections, kind }) {
  return sections?.map((section) => <section className="document-section technical-reference-section" key={section.title}><h2>{displayCopy(section.title, kind)}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{displayCopy(paragraph, kind)}</p>)}</section>);
}

function ProjectQuickState({ entry }) {
  const presentation = projectCardPresentation(entry);
  return (
    <dl className="project-quick-state">
      <div><dt>项目状态</dt><dd><span className={`project-card-status-text status-${presentation.tone}`}>{displayCopy(presentation.status, entry.kind)}</span></dd></div>
      <div><dt>快照边界</dt><dd>{displayCopy(presentation.boundary, entry.kind)}</dd></div>
      <div><dt>观察时间</dt><dd><ObservedTime value={presentation.observedAt} /></dd></div>
    </dl>
  );
}

function ProjectEvolutionStage({ stage, copy }) {
  const entries = [
      ...(stage.commit ? [{ date: stage.date, commit: stage.commit, note: stage.title || stage.result }] : []),
      ...(stage.evidence || [])
    ].map((item) => ({ ...item, date: item.date || stage.date, note: item.note || stage.title }))
    .filter((item, index, items) => (item.commit || item.note) && items.findIndex((candidate) => candidate.commit === item.commit && candidate.date === item.date && candidate.note === item.note) === index);
  return <article><time>{stage.date}</time>{stage.title ? <h3>{copy(stage.title)}</h3> : null}<div className="evolution-stage-body"><p>{copy(stage.result)}</p>{entries.length ? <details className="evolution-stage-evidence"><summary>阶段依据</summary><ul>{entries.map((item) => <li key={`${item.date}-${item.commit || "note"}-${item.note || ""}`}><span>{item.date}{item.note ? ` · ${copy(item.note)}` : ""}</span>{item.commit ? <code>{item.commit}</code> : null}</li>)}</ul></details> : null}</div></article>;
}

function ProjectOverview({ entry }) {
  const { project: currentProject, modules: currentModules } = entry;
  const isLearning = entry.kind === "learning";
  const copy = (value) => displayCopy(value, entry.kind);
  return (
    <article className="document-content overview-content">
      <ProjectReadingPanel id="product" selected>
        <span id="project-reading-panel-quick" />
        {currentProject.gallery?.length ? <a className="project-result-preview" href={currentProject.gallery[0].src} data-project-gallery-preview=""><img src={currentProject.gallery[0].thumbnail || currentProject.gallery[0].src} alt={currentProject.gallery[0].alt} loading="lazy" decoding="async" /><span><small>{currentProject.gallery[0].evidenceLabel || currentProject.gallery[0].categoryLabel || "项目图示"}</small><strong>先看图示与结果</strong><span>{copy(currentProject.gallery[0].caption)}</span><b>打开大图 <ArrowRight size={15} aria-hidden="true" /></b></span></a> : null}
        <section className="document-section document-section-first">
          <p className="section-kicker">用途与结果</p>
          <h2>最快了解这个项目</h2>
          <div className="plain-language-grid"><article><h3>为什么需要它</h3><p>{copy(currentProject.why)}</p></article><article><h3>举个实际例子</h3><p>{copy(currentProject.plainExample)}</p></article><article><h3>最后我会得到什么</h3><p>{copy(currentProject.result)}</p></article></div>
          <ThreeStateSummary {...currentProject.readerStates} kind={entry.kind} labels={currentProject.stateLabels} />
        </section>
        <UsageStart entry={currentProject.usageEntry} inputs={currentProject.usageInputs} kind={entry.kind} />
        <section className="document-section"><h2>{isLearning ? "这套方法怎样工作" : "从开始到拿到结果"}</h2><ol className="number-list">{currentProject.operatingFlow.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><strong>{copy(step.title)}</strong><p>{copy(step.detail)}</p></div></li>)}</ol></section>
        <section className="document-section project-capability-overview">
          <h2>{isLearning ? "这套方法可以直接这样用" : entry.kind === "codex-remote" ? "历史功能与使用方式" : "从这些需求了解功能"}</h2>
          <p>{isLearning ? "下面每一项都是可以直接提出的真实学习需求；点进去再看这项方法的完整边界。" : entry.kind === "codex-remote" ? "当前控制入口不可用。下面保留已形成的产品功能和历史使用方式，具体限制见各模块。" : "从一个实际问题看它怎样处理、交回什么；当前能做到哪一步和仍有哪些限制，也写在对应说明中。"}</p>
          <div className="module-index split-section">
            {currentModules.map((item, index) => {
              const examples = currentProject.usageExamples.filter((candidate) => candidate.moduleSlug === item.slug);
              return <SiteLink href={`${currentProject.route}/${item.slug}`} key={item.slug}><span className="module-number">{String(index + 1).padStart(2, "0")}</span><span className="module-index-copy"><strong>{copy(item.shortTitle)}</strong>{examples.length ? examples.map((usage) => <span className="module-use-example" key={usage.ask}><b>{copy(usage.ask)}</b><span>{copy(usage.effect)}</span></span>) : <span>{copy(item.value || item.teaser)}</span>}<small>查看使用步骤与完整说明</small></span><ArrowRight size={18} aria-hidden="true" /></SiteLink>;
            })}
          </div>
        </section>
        {currentProject.operatingChoices?.rows?.length ? <section className="document-section project-operating-choices"><h2>{copy(currentProject.operatingChoices.title || "按需求选择")}</h2><p>{copy(currentProject.operatingChoices.intro)}</p><div className="component-table" role="table" aria-label={`${currentProject.title} 的使用选择`}>{currentProject.operatingChoices.rows.map((item, index) => <article role="row" key={item.need}><span role="cell">{String(index + 1).padStart(2, "0")}</span><div role="cell"><strong>{copy(item.need)}</strong><p>{copy(item.choice)}</p></div><div role="cell"><p>{copy(item.result)}</p>{item.boundary ? <p className="choice-boundary">{copy(item.boundary)}</p> : null}</div></article>)}</div></section> : null}
        {currentProject.gallery?.length ? <ProjectGallery title={currentProject.title} images={currentProject.gallery} presentation={currentProject.galleryPresentation} /> : null}
        <details className="project-quick-details" open>
          <summary><span>项目指标与相关入口</span><small>查看规模、覆盖范围和关联能力</small></summary>
          <div className="project-quick-details-body">
            <section className="document-section project-positive-snapshot"><h2>当前项目指标</h2><ProjectMetrics items={currentProject.cardMetrics} kind={entry.kind} /></section>
            <CapabilityLinkBar title="可以继续进入" items={projectConnectionItems(currentProject.slug)} />
          </div>
        </details>
        <MethodCanvas canvas={currentProject.methodCanvas} kind={entry.kind} />
        <section className="document-section split-section">
          <div><h2>{isLearning ? "AI协助" : "它负责"}</h2><ul className="plain-list">{currentProject.responsibilities.map((item) => <li key={item}>{copy(item)}</li>)}</ul></div>
          <div><h2>{isLearning ? "刻意不做" : "它不负责"}</h2><ul className="plain-list">{currentProject.exclusions.map((item) => <li key={item}>{copy(item)}</li>)}</ul></div>
        </section>
        {currentProject.productPrinciples?.length ? <section className="document-section"><h2>产品思想与设计核心</h2><div className="product-principle-grid">{currentProject.productPrinciples.map((principle, index) => <article key={principle.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{copy(principle.title)}</h3><p>{copy(principle.detail)}</p></article>)}</div></section> : null}
        {currentProject.dataSources?.rows?.length ? <section className="document-section project-data-sources"><h2>{copy(currentProject.dataSources.title)}</h2><p>{copy(currentProject.dataSources.intro)}</p><div className="component-table" role="table" aria-label={`${currentProject.title} 的来源、数据与用途`}>{currentProject.dataSources.rows.map((item, index) => <article role="row" key={item.source}><span role="cell">{String(index + 1).padStart(2, "0")}</span><div role="cell"><strong>{copy(item.source)}</strong><p>{copy(item.data)}</p></div><p role="cell">{copy(item.result)}</p></article>)}</div>{currentProject.dataSources.note ? <p>{copy(currentProject.dataSources.note)}</p> : null}</section> : null}
        <section className="document-section"><h2>{isLearning ? "这套方法怎样形成" : "项目怎样演化到现在"}</h2><div className="evolution-timeline">{currentProject.evolution.map((item) => <ProjectEvolutionStage stage={item} copy={copy} key={`${item.date}-${item.title || item.commit}`} />)}</div></section>
      </ProjectReadingPanel>

      <ProjectReadingPanel id="technical">
        <section className="document-section document-section-first"><h2>{isLearning ? "方法状态与证据边界" : "完整项目状态与证据边界"}</h2><ProjectCurrentState entry={entry} /></section>
        <section className="document-section"><h2>来源与公开边界</h2><p>{displayCopy(currentProject.repositoryNote, entry.kind)}</p></section>
        {currentProject.heroFacts?.length ? <section className="document-section"><h2>当前关键技术事实</h2><dl className="project-headline-facts project-headline-facts-technical" aria-label={`${currentProject.title} 当前关键技术事实`}>{currentProject.heroFacts.map((fact) => <div key={fact.label}><dt>{displayCopy(fact.label, entry.kind)}</dt><dd>{displayCopy(fact.value, entry.kind)}</dd></div>)}</dl></section> : null}
        {currentProject.technicalOperatingFlow?.length ? <section className="document-section"><h2>完整执行流程</h2><ol className="number-list compact-list">{currentProject.technicalOperatingFlow.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><strong>{copy(step.title)}</strong><p>{copy(step.detail)}</p></div></li>)}</ol></section> : null}
        <TechnicalSections sections={currentProject.technicalSections} kind={entry.kind} />
        <section className="document-section compact-terms"><h2>{isLearning ? "这套方法里的关键说法" : "本页用到的名词"}</h2><p>需要核对专业含义时，可以在这里查看它在 {currentProject.title} {isLearning ? "方法" : "项目"}中的具体用法。</p><dl className="project-glossary-grid">{currentProject.glossary.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl></section>
        <section className="document-section"><h2>{isLearning ? "方法由什么组成" : "系统里实际有什么"}</h2><p>{isLearning ? "下面把协作方法拆成可以单独检查的部分；这不是监督系统，也不代表个人学习进度。" : "下面是当前产品组件，不是概念分类。每一项都对应真实文件、入口或验证链。"}</p><div className="component-table" role="table" aria-label={`${currentProject.title} 当前组件`}>{currentProject.components.map((item, index) => <article role="row" key={item.name}><span role="cell">{String(index + 1).padStart(2, "0")}</span><div role="cell"><strong>{copy(item.name)}</strong><p>{copy(item.responsibility)}</p></div><p role="cell">{copy(item.implementation)}</p></article>)}</div></section>
        {currentProject.technicalContracts?.length ? <section className="document-section"><h2>当前数据合同与写读边界</h2><div className="component-table" role="table" aria-label={`${currentProject.title} 当前数据合同`}>{currentProject.technicalContracts.map((item, index) => <article role="row" key={item.artifact}><span role="cell">{String(index + 1).padStart(2, "0")}</span><div role="cell"><strong>{item.artifact}</strong><p><code>{item.schema}</code></p></div><p role="cell"><strong>{copy(item.owner)}</strong>：{copy(item.boundary)}</p></article>)}</div></section> : null}
        {currentProject.gallery?.some((item) => item.originalSha256 && item.originalBytes && item.width && item.height) ? <section className="document-section">
          <h2>照片原件与显示版本</h2>
          <p>缩略图用于快速浏览，点开后才加载大图。经过转换或压缩的显示副本与来源原件分别标明，下面可下载网页使用的大图。</p>
          <div className="source-list">{currentProject.gallery.map((item) => <div key={item.src}>
            <a href={item.src} download>{item.src.split("/").at(-1)}</a>
            <p>显示尺寸 {item.width} × {item.height} · {(item.displayBytes || item.originalBytes).toLocaleString("en-US")} B · SHA-256 <code>{item.displaySha256 || item.originalSha256}</code></p>
            {item.displaySha256 ? <p>来源原件 {item.originalWidth || item.width} × {item.originalHeight || item.height} · {item.originalBytes.toLocaleString("en-US")} B · SHA-256 <code>{item.originalSha256}</code></p> : null}
            {item.displayNote ? <p>{item.displayNote}</p> : null}
            {item.originalSrc ? <a href={item.originalSrc} download>下载来源原件</a> : null}
          </div>)}</div>
        </section> : null}
        {entry.kind === "agents" ? <section className="document-section"><h2>验证不是一盏总绿灯</h2><p>{annotateTerms(panelSnapshot.validation.summary)}</p><ValidationMatrix /></section> : null}
        <section className="document-section"><h2>{isLearning ? "参考与依据" : `${currentProject.evidenceLayers.length} 层证据分别证明什么`}</h2><div className="evidence-table">{currentProject.evidenceLayers.map((item) => <article key={item.layer}><strong>{copy(item.layer)}</strong><p><span>能证明：</span>{copy(item.proves)}</p><p><span>不能证明：</span>{copy(item.doesNotProve)}</p></article>)}</div></section>
        <section className="document-section"><h2>{isLearning ? "直接怎么用" : "维护入口"}</h2><div className="source-list">{currentProject.operationalEntrypoints.map((item) => <div key={item.name}><code>{item.command}</code><p><strong>{copy(item.name)}</strong>：{copy(item.purpose)}</p></div>)}</div></section>
        <section className="document-section source-note"><h2>快照怎样更新</h2><p>{copy(currentProject.snapshotUpdateNote || "本页代表最后一次明确核对并发布的项目状态，不承诺后台实时同步。再次更新时会重新读取该项目当前事实、边界和验证结果；无法确认的内容继续明确标成网页快照边界，不用旧记录猜成当前状态。")}</p></section>
      </ProjectReadingPanel>
    </article>
  );
}

function StringList({ items }) {
  return <ul className="plain-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

const translatedTerms = {
  "事实 Owner": "Fact Owner（事实责任源）",
  "Project rule": "Project rule（项目规则）",
  "External effect": "External effect（外部现实动作）",
  "Advisory artifact": "Advisory artifact（建议性制品）",
  "Read-back": "Read-back（正式回读）",
  "Fail closed": "Fail closed（失败关闭）",
  "Candidate": "Candidate（候选规则）",
  "Active generation": "Active generation（活动代际）",
  "Policy epoch": "Policy epoch（策略代际）",
  "Anchor": "Anchor（活动锚点）",
  "Containment": "Containment（隔离处置）",
  "Adapter": "Adapter（执行适配器）",
  "Authorization": "Authorization（用户授权）",
  "CoreGoal": "CoreGoal（长期目标）",
  "CoreGoalCommitment": "CoreGoalCommitment（目标承诺）",
  "CoreGoalStepCapability": "CoreGoalStepCapability（单步能力）",
  "Execution Owner": "Execution Owner（施工责任）",
  "Registered target": "Registered target（已登记目标）",
  "Residual": "Residual（残余义务）",
  "Compatibility ID": "Compatibility ID（兼容标识）",
  "Primary": "Primary（首要文档）",
  "Conditional": "Conditional（条件文档）",
  "Expected net value": "Expected net value（预期净收益）",
  "Capability salience": "Capability salience（能力显著性）",
  "Evidence-based degradation": "Evidence-based degradation（证据式降级）",
  "Reader routing": "Reader routing（读取路由）",
  "Fresh task": "Fresh task（全新任务验证）",
  "E2E": "E2E（端到端验证）",
  "Canonical source": "Canonical source（唯一维护源）",
  "Install intent": "Install intent（安装意图）",
  "Recovery capsule": "Recovery capsule（恢复胶囊）",
  "Durable state": "Durable state（耐久状态）",
  "Evidence layer": "Evidence layer（证据层）",
  "Unknown": "Unknown（未验证）"
};

function displayTerm(term) {
  return translatedTerms[term] || term;
}

const inlineTermTranslations = [
  ["CoreGoalStepCapability", "单步执行能力"],
  ["CoreGoalCommitment", "目标承诺"],
  ["Production activation", "生产执行状态"],
  ["saved local Git project", "已保存的本地 Git 项目"],
  ["Authorization", "用户授权"],
  ["Active generation", "活动规则代际"],
  ["Candidate fingerprint", "候选规则指纹"],
  ["Candidate pending", "候选规则待发布"],
  ["Execution Owner", "施工责任"],
  ["External effect", "外部现实动作"],
  ["Recovery capsule", "恢复胶囊"],
  ["Password Center", "密码中心"],
  ["Secret Broker", "本机受保护凭据中介"],
  ["LocalGpuBroker", "本地 GPU 调度器"],
  ["Speech Activity Detection", "语音活动检测"],
  ["Windows Subsystem for Linux", "Windows 的 Linux 子系统"],
  ["Health Owner", "健康资料责任源"],
  ["VerifyRemote", "远端核验"],
  ["Source hash", "源文件指纹"],
  ["objective sidecar", "客观结果侧车文件"],
  ["contact sheet", "页面总览图"],
  ["Registered target", "已登记目标"],
  ["User acceptance", "用户验收"],
  ["Policy epoch", "策略代际号"],
  ["effect authority", "动作授权"],
  ["highest authority", "最高权限身份"],
  ["Secret authority", "秘密权限来源"],
  ["authority locator", "权威原件定位记录"],
  ["Authority descriptor", "活动权威描述符"],
  ["fixed Authority", "固定活动规则权威"],
  ["C Authority", "C 盘活动规则权威"],
  ["活动 Authority", "活动规则权威"],
  ["执行 Owner", "施工责任"],
  ["Fact Owner", "事实责任源"],
  ["事实 Owner", "事实责任源"],
  ["任务 Owner", "任务责任方"],
  ["项目 Owner", "项目责任方"],
  ["Owner registry", "施工责任登记表"],
  ["Git Owner", "Git 事实责任方"],
  ["Provider Owner", "服务责任方"],
  ["Account provider", "账号验证提供方"],
  ["Google Workspace Provider", "Google Workspace 固定服务入口"],
  ["Workspace Provider", "Workspace 固定服务入口"],
  ["OAuth Provider", "OAuth 账号服务入口"],
  ["C Provider", "C 盘固定服务入口"],
  ["Owner Provider", "Owner 现场提供器"],
  ["控制面 Provider", "控制面现场读取器"],
  ["dynamic Provider", "动态现场读取器"],
  ["Provider runtime", "服务运行环境"],
  ["Provider config", "服务配置"],
  ["Coordination Owner", "协调责任方"],
  ["active generation root", "活动代际根目录"],
  ["generation root", "代际根目录"],
  ["repository root", "仓库根目录"],
  ["source root", "来源根目录"],
  ["root/child role", "根代理/子代理角色"],
  ["root/child", "根代理/子代理"],
  ["root agent", "根代理"],
  ["child agent", "子代理"],
  ["child identity", "子代理身份"],
  ["successor", "后继目标或任务"],
  ["residual", "未完成义务"],
  ["checkpoint", "续作检查点"],
  ["ahead/behind", "领先/落后提交数"],
  ["identity baseline", "身份基线"],
  ["partial projection failure", "部分投影失败"],
  ["NUL-delimited", "以空字符分隔"],
  ["git status", "Git 状态命令"],
  ["node id", "稳定节点编号"],
  ["diverged", "本地与远端双向分叉"],
  ["detached", "分离提交状态"],
  ["ignored", "已被版本控制忽略"],
  ["provenance", "来源说明"],
  ["nullable", "可为空"],
  ["Hook", "钩子"],
  ["execution limit", "执行时限"],
  ["access token", "访问令牌"],
  ["refresh token", "刷新令牌"],
  ["GitHub token", "GitHub 访问令牌"],
  ["admin token", "管理员权限令牌"],
  ["Medium token", "中等完整性权限令牌"],
  ["OS token", "操作系统权限令牌"],
  ["material refresh", "实质变化触发的刷新"],
  ["material event", "会让看板失真的实质变化事件"],
  ["projectless", "无项目任务"],
  ["system/developer/platform", "系统指令、开发者指令和平台规则"],
  ["system/developer", "系统指令和开发者指令"],
  ["PreToolUse", "工具执行前复核"],
  ["TOCTOU", "检查到执行之间的状态漂移"],
  ["nonce", "一次性随机凭据"],
  ["principal", "受验证的执行主体"],
  ["runtime", "运行环境"],
  ["StepCapability", "单步执行能力"],
  ["Install intent", "安装意图"],
  ["Canonical source", "唯一维护源"],
  ["Source Owner", "来源项目责任人"],
  ["Material change", "实质变化"],
  ["Impact candidate", "影响候选"],
  ["Evidence layer", "证据层"],
  ["Durable state", "耐久状态"],
  ["Fresh task", "全新任务验证"],
  ["Read-back", "正式回读"],
  ["Fail closed", "失败关闭"],
  ["Attestation", "证明声明"],
  ["Manifest", "清单"],
  ["Junction", "目录联接"],
  ["Backend", "模型后端"],
  ["Broker", "代理服务"],
  ["Vault", "加密保险库"],
  ["consumer", "使用方"],
  ["NDJSON", "逐行 JSON 数据格式"],
  ["WSL", "Windows 的 Linux 子系统"],
  ["VAD", "语音活动检测"],
  ["CLI", "命令行工具"],
  ["TDD", "测试驱动开发"],
  ["shim", "受保护入口垫片"],
  ["Adapter", "执行适配器"],
  ["Ledger", "追加式账本"],
  ["Anchor", "活动锚点"],
  ["Catalog", "目录"],
  ["Validator", "校验器"],
  ["validation", "验证"],
  ["tokenizer", "分词器"],
  ["hardlink", "硬链接"],
  ["locator", "原件定位记录"],
  ["sidecar", "侧车文件"],
  ["WhatIf", "只读预演"],
  ["OAuth", "账号授权协议"],
  ["CURRENT", "当前状态"],
  ["transaction", "事务"],
  ["visibility", "公开或私有属性"],
  ["metadata", "元数据"],
  ["registry", "登记清单"],
  ["candidate-only", "仅候选"],
  ["generation", "代际"],
  ["admission", "仓库准入检查"],
  ["dirty work", "未提交改动"],
  ["fast-forward", "快进推送"],
  ["worktree", "Git 工作树"],
  ["upstream", "上游分支"],
  ["checkout", "本地检出目录"],
  ["remote", "远端仓库"],
  ["branch", "分支"],
  ["freshness", "证据新鲜度"],
  ["current task", "当前任务"],
  ["live evidence", "实时证据"],
  ["effect", "外部现实动作"],
  ["receipt", "执行回执"],
  ["schema", "数据结构"],
  ["usage", "真实用量"],
  ["hash", "内容指纹"],
  ["MVP", "最小可用版本"],
  ["PUBLIC", "公开"],
  ["PRIVATE", "私有"],
  ["held-out attribution", "留出样本归属"],
  ["blind fill", "盲填"],
  ["fallback", "后备路线"],
  ["raw bytes", "原始字节"],
  ["repair plan", "修复计划"],
  ["cache miss", "缓存未命中"],
  ["anonymous", "匿名"],
  ["unknown", "未验证"],
  ["Structure", "结构化版面"],
  ["Timeout", "等待超时"],
  ["containment", "隔离处置"],
  ["route", "处理路线"],
  ["Job Object", "作业对象"],
  ["job", "任务记录"],
  ["effort", "思考等级"],
  ["spawn", "创建子代理"],
  ["E2E", "端到端验证"],
  ["ASR", "自动语音识别"],
  ["OCR", "光学字符识别"]
].sort((left, right) => right[0].length - left[0].length);

const annotateTerms = createTermAnnotator(inlineTermTranslations);
const codexRemoteSpecificTerms = {
  "app-server": "任务协议服务",
  "public-safety": "公开内容安全检查",
  threadId: "任务标识",
  turnId: "轮次标识",
  Sidecar: "认证侧车服务",
  Browser: "浏览器端",
  loopback: "本机回环",
  Chromium: "浏览器内核",
  Origin: "请求来源",
  Shell: "命令行入口",
  diff: "文件差异"
};
const annotateCodexRemoteTerms = createTermAnnotator([
  ...Object.entries(codexRemoteSpecificTerms),
  ...inlineTermTranslations.filter(([term]) => term.toLowerCase() !== "remote")
]);

function displayCopy(value, kind) {
  if (kind === "learning") return value;
  if (kind === "codex-remote") return annotateCodexRemoteTerms(value);
  return annotateTerms(value);
}

function maturityMeaning(value) {
  if (value === "A") return "稳定";
  if (value === "A-") return "基本稳定，仍有明确边界";
  if (value === "B") return "可用，但依赖环境或仍有证据缺口";
  return "按详情判断";
}

function ModuleDetail({ entry, module }) {
  const { project: currentProject, modules: currentModules } = entry;
  const isLearning = entry.kind === "learning";
  const copy = (value) => displayCopy(value, entry.kind);
  const index = currentModules.findIndex((item) => item.slug === module.slug);
  const previous = currentModules[index - 1];
  const next = currentModules[index + 1];
  return (
    <article className="document-content module-detail">
      <ProjectReadingPanel id="product" selected>
      <section className="module-product" id="module-product" aria-labelledby="module-product-title">
  <section className="module-outcome"><p className="section-kicker">用途与实际影响</p><h2 id="module-product-title">{isLearning ? "这一步怎样帮助学习" : "这项功能怎样使用"}</h2><div className="plain-language-grid"><article><h3>为什么需要它</h3><p>{copy(module.why)}</p></article><article><h3>举个实际例子</h3><p>{copy(module.example)}</p></article><article><h3>最后我会得到什么</h3><p>{copy(module.result)}</p></article></div><ThreeStateSummary {...module.readerStates} kind={entry.kind} labels={module.stateLabels} /></section>
        <UsageStart entry={module.usageEntry} inputs={module.usageInputs} kind={entry.kind} />
        {module.productFlow?.length ? <section className="module-product-flow"><h3>从开始到拿到结果</h3><ol className="number-list">{module.productFlow.map((step, i) => <li key={step.title}><span>{i + 1}</span><div><h4>{copy(step.title)}</h4><p>{copy(step.detail)}</p></div></li>)}</ol></section> : null}
        {module.productSections?.map((section) => <section className="module-product-section" key={section.title}><h2>{copy(section.title)}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{copy(paragraph)}</p>)}{section.cases?.length ? <dl className="module-product-cases">{section.cases.map((item) => <div key={item.situation}><dt>{copy(item.situation)}</dt><dd>{copy(item.behavior)}</dd></div>)}</dl> : null}</section>)}
      </section>
      </ProjectReadingPanel>
      <ProjectReadingPanel id="technical">
      <section className="module-technical" id="module-technical" aria-labelledby="module-technical-title">
        <header className="module-technical-heading"><h2 id="module-technical-title">技术实现与依据</h2><p>这里保留实现、关键条件、精确入口、历史记录和验证结果。</p><StatusPill status={moduleStatusTone(module)}>{copy(module.status)}</StatusPill></header>
        <section className="document-section"><h3>关键规则与设计选择</h3><div className="skill-decision-list">{module.decisionImpact.map((change, i) => <article key={change}><span>{i + 1}</span><p>{copy(change)}</p></article>)}</div></section>
      <TechnicalSections sections={module.technicalSections} kind={entry.kind} />
      <section className="document-section compact-terms"><h2>{isLearning ? "这里会用到的说法" : "本模块用到的名词"}</h2><dl className="definition-list">{module.concepts.map((item) => <div key={item.term}><dt>{displayTerm(item.term)}</dt><dd>{copy(item.explanation)}</dd></div>)}</dl></section>
      <section className="document-section"><h2>{isLearning ? "这一步说的是什么" : "专业定义"}</h2><p>{copy(module.teaser)}</p></section>
      <section className="problem-callout"><p className="section-kicker">{isLearning ? "避免什么问题" : "解决什么"}</p><p>{copy(module.problem)}</p></section>
      <section className="document-section"><h2>{isLearning ? "AI现在怎样协助" : "当前怎样实现"}</h2><StringList items={module.implementation.map(copy)} /></section>
      <section className="document-section"><h2>{isLearning ? "这一步怎样进行" : "执行流程"}</h2><ol className="number-list compact-list">{module.flow.map((item, flowIndex) => <li key={item}><span>{flowIndex + 1}</span><div><p>{copy(item)}</p></div></li>)}</ol></section>
      <section className="document-section split-section"><div><h2>边界</h2><StringList items={module.boundaries.map(copy)} /></div><div><h2>{isLearning ? "遇到问题时怎样处理" : "失败与恢复"}</h2><dl className="failure-list">{module.failures.map((item) => <div key={item.condition}><dt>{copy(item.condition)}</dt><dd>{copy(item.response)}</dd></div>)}</dl></div></section>
      <section className="document-section"><h2>{isLearning ? "参考与依据" : "真实入口"}</h2><div className="source-list">{module.sources.map((source) => <div key={source.path}>{source.href ? <a className="source-reference-link" href={source.href} download={source.download || undefined} target={/^https?:\/\//.test(source.href) ? "_blank" : undefined} rel={/^https?:\/\//.test(source.href) ? "noopener noreferrer" : undefined}>{source.download ? "下载 " : null}<code>{source.path}</code><ArrowRight size={16} aria-hidden="true" /></a> : <code>{source.path}</code>}<p>{copy(source.role)}</p></div>)}</div></section>
      <section className="document-section"><h2>{isLearning ? "怎样检查这一步没有跑偏" : "如何验证"}</h2><StringList items={module.verification.map(copy)} /></section>
      <section className="document-section"><h2>{isLearning ? "和其他步骤怎样衔接" : "与其他模块的关系"}</h2><p>{copy(module.relation)}</p></section>
      </section>
      </ProjectReadingPanel>
      <nav className="document-pagination" aria-label="模块前后导航">
        {previous ? <SiteLink href={`${currentProject.route}/${previous.slug}`}><ArrowLeft size={18} aria-hidden="true" /><span><small>{isLearning ? "上一个方法节点" : "上一个模块"}</small>{previous.shortTitle}</span></SiteLink> : <span />}
        {next ? <SiteLink href={`${currentProject.route}/${next.slug}`}><span><small>{isLearning ? "下一个方法节点" : "下一个模块"}</small>{next.shortTitle}</span><ArrowRight size={18} aria-hidden="true" /></SiteLink> : null}
      </nav>
    </article>
  );
}

function ProjectPage({ entry, module }) {
  return (
    <div className={`page-frame project-page${entry.kind === "learning" ? " learning-project-page" : ""}${entry.kind === "daily-preferences" ? " daily-preferences-project-page" : ""}`}>
      <ProjectHero entry={entry} module={module} />
      <ProjectReadingNav />
      <ProjectContinuation entry={entry} module={module} />
      <div className="project-layout"><ProjectNav entry={entry} current={module?.slug} />{module ? <ModuleDetail entry={entry} module={module} /> : <ProjectOverview entry={entry} />}</div>
    </div>
  );
}

function RuleSelector({ selectedId }) {
  return (
    <aside className="rule-selector-panel">
      <div className="rule-selector-heading"><span>规则专题</span><small>{rulesSnapshot.rules.length} 个主题 · 查看完整说明</small></div>
      <label className="rule-mobile-select">
        <span>选择你想了解的问题</span>
        <select defaultValue={selectedId}>
          {rulesSnapshot.rules.map((rule) => <option value={rule.logicalId} key={rule.logicalId}>{ruleReaderGuides[rule.logicalId]?.title || rule.title}</option>)}
        </select>
      </label>
      <nav className="rule-selector-list" aria-label="规则选择">
        {rulesSnapshot.rules.map((rule, index) => {
          const reader = ruleReaderGuides[rule.logicalId];
          return (
            <a
              key={rule.logicalId}
              id={"rule-tab-" + rule.logicalId}
              aria-controls={"rule-panel-" + rule.logicalId}
              aria-current={selectedId === rule.logicalId ? "page" : undefined}
              className={selectedId === rule.logicalId ? "is-selected" : undefined}
              href={"/rules/?rule=" + rule.logicalId + "#rule-panel-" + rule.logicalId}
              title={reader?.title || rule.question}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span><strong>{rule.title}</strong></span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function RuleHumanSection({ section, index }) {
  return (
    <section className="rule-reader-chapter">
      <header><span>{String(index + 1).padStart(2, "0")}</span><h4>{section.title}</h4></header>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{annotateTerms(paragraph)}</p>)}
      <StringList items={section.points.map(annotateTerms)} />
    </section>
  );
}

function RuleDetail({ rule, selected = true }) {
  const index = rulesSnapshot.rules.findIndex((item) => item.logicalId === rule.logicalId);
  const guide = ruleGuides[rule.logicalId];
  const reader = ruleReaderGuides[rule.logicalId];
  const sourceBinding = panelSnapshot.ruleBinding.find((item) => item.logicalId === rule.logicalId);
  const sourceDescription = sourceBinding?.sourceMatchesRelease
    ? `Canonical source（规范源码）当前与 ${rulesSnapshot.releaseId} release 逐字节一致。`
    : `Canonical source（规范源码）当前属于未激活施工；活动正文仍固定为 ${rulesSnapshot.releaseId} release。`;

  return (
    <article className="rule-detail" role="tabpanel" id={`rule-panel-${rule.logicalId}`} data-rule-panel={rule.logicalId} aria-labelledby={`rule-tab-${rule.logicalId}`} hidden={!selected}>
      <header className="rule-detail-heading rule-reader-heading">
        <span className="rule-order">{String(index + 1).padStart(2, "0")}</span>
        <div><p className="section-kicker">先看人话 · 原规则：{rule.title}</p><h2>{reader.title}</h2><p>{reader.answer}</p></div>
      </header>

      <section className="rule-reader-summary" aria-label="30 秒看懂">
        <div className="rule-reader-summary-heading"><p className="section-kicker">30 秒看懂</p><h3>遇到这类情况时，系统会这样处理</h3></div>
        <div className="rule-reader-summary-grid">
          <article><h4>什么时候会遇到</h4><StringList items={reader.when.map(annotateTerms)} /></article>
          <article><h4>AI 会怎么做</h4><StringList items={reader.ai.map(annotateTerms)} /></article>
          <article><h4>你需要做什么</h4><StringList items={reader.user.map(annotateTerms)} /></article>
          <article><h4>不会怎样做</h4><StringList items={reader.willNot.map(annotateTerms)} /></article>
        </div>
      </section>

      <section className="rule-reader-examples">
        <p className="section-kicker">真实说法</p>
        <h3>你可以直接这样说</h3>
        <div className="rule-reader-example-grid">
          {reader.examples.map((example) => <article key={example.ask}><blockquote>{example.ask}</blockquote><p><strong>系统应当：</strong>{annotateTerms(example.result)}</p></article>)}
        </div>
      </section>

      <details className="rule-reader-deep-dive" open>
        <summary><span>完整人话解释</span><small>{reader.sections.length} 个主题 · 保留重要条件、例外、失败和恢复，不要求第一次访问就全读</small></summary>
        <div className="rule-reader-chapters">
          {reader.sections.map((section, sectionIndex) => <RuleHumanSection section={section} index={sectionIndex} key={section.title} />)}
        </div>
      </details>

      <details className="rule-technical-details" open>
        <summary><span>技术规则与证据</span><small>{rule.title} · {rule.logicalId} · {rulesSnapshot.releaseId}</small></summary>
        <div className="rule-technical-details-body">
          <ThreeStateSummary {...rule.readerStates} />
          <section className="rule-glossary compact-terms"><h3>这条规则用到的名词</h3><dl className="definition-list">{guide.glossary.map(([term, explanation]) => <div key={term}><dt>{displayTerm(term)}</dt><dd>{annotateTerms(explanation)}</dd></div>)}</dl></section>
          <section className="rule-overview-grid">
            <div><h3>它解决什么</h3><p>{annotateTerms(rule.purpose)}</p></div>
            <div><h3>适用范围</h3><StringList items={rule.scope.map(annotateTerms)} /></div>
            <div><h3>它负责判断什么</h3><StringList items={rule.decisions.map(annotateTerms)} /></div>
          </section>
          <section className="rule-complete-guide">
            <div className="complete-guide-heading"><p className="section-kicker">原规则与决策依据</p><h3>原规则的结构化技术说明</h3><p>按原规则的职责与决策单元说明要求、条件、例外和执行依据；原始版本与来源在下方核对。</p></div>
            {guide.sections.map((section) => (
              <div className="guide-section" key={section.title}>
                <header><h4>{annotateTerms(section.title)}</h4><p>{annotateTerms(section.intro)}</p></header>
                <div className="guide-item-grid">
                  {section.items.map((entry, entryIndex) => (
                    <article className="guide-item" key={`${section.title}-${entry.title}`}>
                      <span>{String(entryIndex + 1).padStart(2, "0")}</span>
                      <div><h5>{annotateTerms(entry.title)}</h5><p>{annotateTerms(entry.detail)}</p>{entry.example ? <p className="guide-example"><strong>例子：</strong>{annotateTerms(entry.example)}</p> : null}</div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
          <section className="rule-dual-column"><div><h3>允许</h3><StringList items={rule.allowed.map(annotateTerms)} /></div><div><h3>禁止</h3><StringList items={rule.forbidden.map(annotateTerms)} /></div></section>
          <section><h3>典型执行顺序</h3><ol className="number-list compact-list">{rule.process.map((item, processIndex) => <li key={item}><span>{processIndex + 1}</span><div><p>{annotateTerms(item)}</p></div></li>)}</ol></section>
          <section><h3>失败关闭与恢复</h3><StringList items={rule.failure.map(annotateTerms)} /></section>
          <section><h3>来源、版本与关系</h3><dl className="rule-identity-grid">
            <div><dt>Owner（责任源）</dt><dd>{rule.owner}</dd></div><div><dt>E release（活动规则代号）</dt><dd>{rulesSnapshot.releaseId}</dd></div>
            <div><dt>Size（大小）</dt><dd>{rule.bytes} 字节 / {rule.lines} 行</dd></div><div className="rule-hash"><dt>SHA-256（内容指纹）</dt><dd><code>{rule.sha256}</code></dd></div>
          </dl><div className="source-list">
            <div><code>{sourceBinding?.releasePath || `E:\\.agents\\releases\\${rulesSnapshot.releaseId}\\${rule.releaseRelativePath}`}</code><p>Active release（活动规则副本）：本页规则语义、SHA 和字节数以这里为准。</p></div>
            <div><code>{rule.sourcePath}</code><p>{sourceDescription}</p>{sourceBinding ? <p><strong>Source fingerprint（源码指纹）：</strong><code>{sourceBinding.sourceSha256}</code> / {sourceBinding.sourceBytes} bytes（字节）。</p> : null}</div>
          </div><p>{annotateTerms(rule.relation)}</p></section>
        </div>
      </details>
    </article>
  );
}

function RulesPage({ search }) {
  const query = new URLSearchParams(search);
  const requested = legacyRuleAliases[query.get("rule")] || query.get("rule");
  const selected = rulesSnapshot.rules.find((rule) => rule.logicalId === requested) || rulesSnapshot.rules[0];



  return (
    <div className="page-frame rules-page">
      <section className="rules-reader-hero">
        <p className="section-kicker">不用先学 AI 规则</p>
        <h1>AI 怎样处理你的请求</h1>
        <p>从你遇到的问题开始，看 AI 会怎样处理、什么时候需要你决定、出了问题怎样继续。下面保留完整说明、技术依据与版本证据，可以按需要阅读或收起。</p>
      </section>

      <div className="rules-workbench" data-rule-aliases={JSON.stringify(legacyRuleAliases)}><RuleSelector selectedId={selected.logicalId} /><div className="rule-detail-stack">{rulesSnapshot.rules.map((rule) => <RuleDetail rule={rule} selected={rule.logicalId === selected.logicalId} key={rule.logicalId} />)}</div></div>

      <details className="rules-technical-dashboard" open>
        <summary><span>查看当前规则版本、完整发布集合和验证证据</span><small>当前版本、完整文件清单与分层验证结果</small></summary>
        <section className="rules-dashboard-bar">
          <div><p className="section-kicker">当前活动规则</p><h2>E rules（E 规则） {rulesSnapshot.releaseId}</h2><span>{rulesSnapshot.observedAt}</span></div>
          <dl>
            <div><dt>Authority（规则权威）</dt><dd>{authorityStatusText(rulesSnapshot.status)} · PRIVATE main <code>{rulesSnapshot.gitCommit.slice(0, 12)}</code></dd></div>
            <div><dt>Rule closure（规则闭包）</dt><dd>{rulesSnapshot.rules.length} 个正式专题 · {rulesSnapshot.releaseFileCount || rulesSnapshot.rules.length} 个已核验发布文件 · ruleset <code>{rulesSnapshot.rulesetSha256}</code></dd></div>
            <div><dt>Current pointer（当前指针）</dt><dd>revision {rulesSnapshot.pointerRevision} · activated {observedTimeText(rulesSnapshot.activatedAtUtc)}</dd></div>
            <div><dt>Previous（上一代）</dt><dd>{rulesSnapshot.previous?.release_id || "无"} · <code>{rulesSnapshot.previous?.git_commit?.slice(0, 12) || "无"}</code></dd></div>
            <div><dt>Source（规范源码）</dt><dd>{rulesSnapshot.sourceMatchesRelease ? "当前发布输入与活动版本一致" : `存在 ${panelSnapshot.sourceDirtyCount || 0} 项未激活施工；不覆盖 ${rulesSnapshot.releaseId}`}</dd></div>
          </dl>
        </section>
        <details className="document-section rules-release-inventory" open><summary>完整发布集合：专题正文、兼容引用与入口模板</summary><p>选择器只展示正式专题。完整性检查还覆盖同版兼容文本、目录与入口模板；文件多于专题不代表多了一套需要重复阅读的规则。</p><div className="table-scroll"><table className="data-table"><thead><tr><th>文件身份</th><th>同版相对路径</th><th>字节</th><th>SHA-256</th></tr></thead><tbody>{(rulesSnapshot.releaseInventory || []).map(file => <tr key={file.logicalId}><td>{file.logicalId}</td><td>{file.relativePath}</td><td>{file.bytes}</td><td><code>{file.sha256}</code></td></tr>)}</tbody></table></div></details>
        <section className="rules-validation">
          <div><p className="section-kicker">验证矩阵</p><h2>E release 有效，不代表当前 dirty source、Skills 场景或所有消费者都已通过。</h2><p>{annotateTerms(panelSnapshot.validation.summary)}</p></div>
          <ValidationMatrix />
        </section>
      </details>
    </div>
  );
}

function SystemScenarioPanel({ scenario, index }) {
  return (
    <section
      className={`system-workflow-panel${index === 0 ? " is-current" : ""}`}
      id={`system-scenario-${scenario.id}`}
      data-system-scenario-panel={scenario.id}
      role="tabpanel"
      aria-labelledby={`system-scenario-tab-${scenario.id}`}
    >
      <aside className="system-workflow-summary">
        <span>场景 {String(index + 1).padStart(2, "0")}</span>
        <h3>{scenario.title}</h3>
        <blockquote>{scenario.request}</blockquote>
        <p>{scenario.value}</p>
      </aside>
      <div className="system-workflow-stages">
        {scenario.stages.map((stage) => (
          <article className="system-workflow-stage" key={`${scenario.id}-${stage.number}`}>
            <span>{stage.number} / {stage.kicker}</span>
            <h4>{stage.title}</h4>
            <p>{stage.body}</p>
            <div className="system-workflow-stage-items">
              {stage.items.map(([title, detail]) => <div key={title}><strong>{title}</strong><small>{detail}</small></div>)}
            </div>
          </article>
        ))}
      </div>
      <dl className="system-workflow-contract">
        <div><dt>本次实际使用</dt><dd>{scenario.systems.join("、")}</dd></div>
        <div><dt>这件事的边界</dt><dd>{scenario.rules}</dd></div>
        <div><dt>最终交付</dt><dd>{scenario.result}</dd></div>
      </dl>
    </section>
  );
}

function SystemDependencyNode({ node }) {
  const primaryHref = node.href || node.links?.[0]?.href;
  const defaultLinkLabel = node.linkLabel || (primaryHref?.startsWith("#") ? "查看本页说明" : /^https?:\/\//.test(primaryHref) ? "查看官方说明" : (primaryHref === "/skills" || primaryHref?.startsWith("/skills/")) ? "进入 Skill" : primaryHref === "/rules" ? "进入规则" : "进入项目");
  const links = node.links?.length ? node.links : primaryHref ? [{ href: primaryHref, label: defaultLinkLabel }] : [];
  return (
    <article
      className="system-dependency-node"
      id={`system-node-${node.id}`}
      data-system-dependency-node={node.id}
    >
      {node.legacyIds?.map((id) => <span className="system-anchor-alias" id={id} key={id} />)}
      <div className="system-dependency-node-copy">
        <strong>{node.title}</strong>
        <span>{node.subtitle}</span>
        <p>{node.detail}</p>
      </div>
      {links.length > 0 && <div className="system-dependency-node-footer"><div className="system-dependency-node-actions">{links.map((link) => <SiteLink href={link.href} key={`${link.href}-${link.label}`}>{link.label}<ArrowRight size={15} aria-hidden="true" /></SiteLink>)}</div></div>}
    </article>
  );
}

function SystemActiveAutomationList() {
  return (
    <section className="system-frame system-active-automations" id="system-automations" aria-labelledby="system-active-automations-title">
      <div className="system-home-section-heading system-active-automations-heading"><h2 id="system-active-automations-title">{systemActiveAutomations.items.length} 项定时协作</h2><p>{systemActiveAutomations.items.filter((item) => item.group === "mobile").length} 个云端任务和 {systemActiveAutomations.items.filter((item) => item.group === "computer").length} 个电脑端任务，分别说明运行频率、处理内容和交付结果。清单基线观察于 {systemActiveAutomations.observedAt}，条目中的后续核对保留各自日期；这页不会实时探测任务，也不把已登记当作最近运行或通知送达的证明。</p></div>
      <div className="system-active-automation-groups">{systemActiveAutomations.groups.map((group) => (
        <section key={group.id}>
          <header><span>{group.label}</span><h3>{group.title}</h3><p>{group.description}</p><small><i aria-hidden="true" />记录时已启用</small></header>
          <div className="system-active-automation-grid">
            {systemActiveAutomations.items.filter((item) => item.group === group.id).map((item) => {
              const number = systemActiveAutomations.items.findIndex((candidate) => candidate.id === item.id) + 1;
              return <article key={item.id}><span>{String(number).padStart(2, "0")} / {item.cadence}</span><strong>{item.title}</strong><dl><div><dt>关注什么</dt><dd>{item.focus}</dd></div><div><dt>交回什么</dt><dd>{item.delivery}</dd></div></dl><details className="system-inline-details"><summary>怎样处理</summary><p>{item.process}</p></details></article>;
            })}
          </div>
        </section>
      ))}</div>
    </section>
  );
}

function SystemSectionNavigation() {
  return (
    <nav className="system-section-navigation" data-system-section-navigation aria-label="System 章节导航">
      <div className="system-frame">
        <div className="system-section-navigation-rail">
          {systemHomeChapters.map((item, index) => <a className={index === 0 ? "is-current" : undefined} aria-current={index === 0 ? "location" : undefined} data-system-section-link={item.id} href={`#${item.id}`} key={item.id}>{item.label}</a>)}
        </div>
      </div>
    </nav>
  );
}

function SystemPage() {
  return (
    <div className="system-home">
      <header className="system-frame system-home-hero daily-home-hero" id="general-ai">
        <p className="section-kicker">我的工作入口</p>
        <h1>{systemHomeHero.eyebrow}</h1>
        <h2>{systemHomeHero.title}</h2>
        <p className="daily-home-intro">找资料、整理微信、做文档、修电脑、远程操作或研究问题，都可以从一个具体需求开始。这里帮你找到项目和能力，带上续作说明交给 AI，或配置电脑连接继续操作；下面也能查看整套系统的分工。</p>
        <div id="home-search" className="daily-home-search"><GlobalSearch path="/" className="hero-search-control" resultId="home-global-search-results" /></div>
        <div className="daily-entry-links">
          <SiteLink href="/projects"><span>看看我现在有哪些项目</span><small>{projectCatalog.length} 个项目 · 每个项目先看能做什么</small><ArrowRight size={20} aria-hidden="true" /></SiteLink>
          <SiteLink href="/skills"><span>按需求找到能力</span><small>不用记 Skill 名，直接说想完成什么</small><ArrowRight size={20} aria-hidden="true" /></SiteLink>
          <a href="#system-workflows"><span>从一件具体事情开始</span><small>{systemScenarios.length} 个真实场景 · 看 AI 怎样把事情办成</small><ArrowRight size={20} aria-hidden="true" /></a>
        </div>
        <details className="system-home-about"><summary>这套系统到底是什么？</summary><div className="system-home-hero-copy">{systemHomeHero.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="system-home-role-grid">{systemHomeHero.roles.map((role, index) => <article key={role.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{role.title}</strong><p>{role.body}</p></article>)}</div></details>
      </header>

      <SystemSectionNavigation />

      <section className="system-frame system-workflows" id="system-workflows" aria-labelledby="system-workflows-title">
        <div className="system-home-section-heading"><h2 id="system-workflows-title">先看：你可以直接让 AI 做哪些事</h2><p>下面不是架构图，而是 {systemScenarios.length} 件真实事情。每个场景都先告诉你怎么说、AI 会做什么、最后交回什么。</p></div>
        <div className="system-workflow-tabs" role="tablist" aria-label="选择真实工作场景">
          {systemScenarios.map((scenario, index) => <button type="button" role="tab" id={`system-scenario-tab-${scenario.id}`} aria-controls={`system-scenario-${scenario.id}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} data-system-scenario-tab={scenario.id} className={index === 0 ? "is-current" : undefined} key={scenario.id}>{scenario.label}</button>)}
        </div>
        <div className="system-workflow-scroll-indicator" data-system-workflow-scroll-indicator aria-hidden="true" hidden><small>左右滑动查看更多</small><span><i /></span></div>
        <div className="system-workflow-panels">{systemScenarios.map((scenario, index) => <SystemScenarioPanel scenario={scenario} index={index} key={scenario.id} />)}</div>
      </section>

      <section className="system-frame system-reader-section" id="system-inside" aria-label="系统组成"><span id="system-more" /><span id="system-project-atlas" />
        <div className="system-reader-details-body">
          <section className="system-dependencies" id="system-dependencies" aria-labelledby="system-dependencies-title">
            <div className="system-home-section-heading"><h2 id="system-dependencies-title">这套系统实际由什么组成</h2><p>查资料、理解内容、操作电脑、制作文件和检查结果，各有合适的工具与项目；这里说明内部怎样接上。</p></div>
            <div className="system-dependency-map">
              {systemDependencyLanes.map((lane) => {
                const laneNodes = systemDependencyNodes.filter((node) => node.lane === lane.id).sort((left, right) => (left.displayOrder || 0) - (right.displayOrder || 0));
                return <section className="system-dependency-lane" id={`system-lane-${lane.id}`} data-system-lane={lane.id} key={lane.id}><header><span>{lane.number}</span><h3>{lane.title}</h3><p>{lane.description}</p></header><div className="system-dependency-node-grid" data-node-mod-4={laneNodes.length % 4} data-node-mod-3={laneNodes.length % 3} data-node-mod-2={laneNodes.length % 2}>{laneNodes.map((node) => <SystemDependencyNode node={node} key={node.id} />)}</div></section>;
              })}
            </div>
          </section>

        </div>
      </section>

      <section className="system-frame system-reader-section" id="system-automation-details" aria-label="自动协作">
        <div className="system-reader-details-body"><SystemActiveAutomationList /></div>
      </section>

      <section className="system-frame system-evidence" id="evidence" aria-labelledby="system-evidence-title">
        <span id="system-node-verification" /><span id="system-node-human-review" /><div className="system-home-section-heading"><h2 id="system-evidence-title">各层验证分别能证明什么</h2><p>源码、测试、安装、真实使用和发布分别说明；一层通过，不代表其余层已经完成。</p></div>
        <div className="system-evidence-grid">{systemEvidenceLayers.map((layer, index) => <article id={layer.id === "human" ? "evidence-human" : `evidence-${layer.id}`} key={layer.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{layer.title}</strong><p>{layer.proves}</p><small>不能证明：{layer.doesNotProve}</small></article>)}</div>
      </section>


    </div>
  );
}

function SearchResultsPage({ search }) {
  const params = new URLSearchParams(search);
  const query = params.get("q")?.trim() || "";
  const requestedScope = searchScopeById(params.get("scope")) || searchScopeById("all");
  const results = query ? searchPanel(query, requestedScope.id) : [];
  return (
    <div className="page-frame search-results-page">
      <header><p className="section-kicker">完整搜索结果</p><h1>{query ? `“${query}”` : "输入一个名称或问题"}</h1><p>当前范围：{requestedScope.label}。修改查询或范围请直接使用页头唯一的搜索框。</p></header>
      {!query ? <div className="search-results-empty"><strong>{requestedScope.help}</strong><p>试试：{requestedScope.examples.join(" · ")}</p></div> : null}
      {query && !results.length ? <div className="search-results-empty"><strong>没找到匹配内容</strong><p>可以换成日常说法、缩短关键词，或在页头切换搜索范围。</p></div> : null}
      {results.length > 0 ? <section className="search-result-group" aria-label="按相关性排列的搜索结果"><div><h2>找到的内容</h2><span>{results.length} 项</span></div>{results.map((entry) => <SiteLink href={entry.href} key={`${entry.type}-${entry.href}`}><span>{entry.type}</span><span><strong>{entry.title}</strong><small>{searchResultExcerpt(entry, query, 140)}</small></span><ArrowRight size={18} aria-hidden="true" /></SiteLink>)}</section> : null}
    </div>
  );
}

const skillCategoryDefinitions = [
  { id: "all", label: "全部" },
  { id: "find", label: "找东西", slugs: ["personal-media", "personal-materials", "wechat-direct", "google-workspace-direct"] },
  { id: "understand", label: "理解与转换", slugs: ["chinese-asr", "localocr", "file-intake-router", "media-person-self", "md-to-pdf", "pdf-render-safe", "mojibake-doctor"] },
  { id: "personal", label: "个人事务", slugs: ["personal-health", "daily-preferences"] },
  { id: "deliver", label: "文书与交付", slugs: ["document-materials", "work-delivery", "documents", "pdf"] },
  { id: "diagnose", label: "电脑与系统", slugs: ["browser-control-continuity", "timeaudit-diagnostics", "control-plane-doctor", "tailscale-safe-exposure"] },
  { id: "git", label: "Git 与发布", slugs: ["project-entry-gate", "personal-panel-refresh"] },
  { id: "protect", label: "安全与恢复", slugs: ["local-secret-broker", "authorization-file-broker", "vault-workflow"] },
  { id: "ai", label: "AI 协作", slugs: ["explain-to-me", "reply-as-me", "llm-backend-toolkit", "native-economy-routing", "token-budget-advisor"] }
];

function skillCategoryIds(slug) {
  return skillCategoryDefinitions.filter((category) => category.slugs?.includes(slug)).map((category) => category.id);
}

function SkillsPage() {
  return (
    <div className="page-frame directory-page skills-page">
      <h1 className="visually-hidden">Skills（能力）</h1>
      <div className="skill-category-rail" role="toolbar" aria-label="按用途浏览 Skills">
        {skillCategoryDefinitions.map((category) => <button type="button" className={category.id === "all" ? "is-current" : undefined} aria-pressed={category.id === "all"} data-skill-category={category.id} key={category.id}>{category.label}{category.id === "all" ? ` ${skills.length}` : ""}</button>)}
      </div>
      <div className="skill-category-summary"><p className="skill-category-note">分类只影响浏览；页头搜索始终覆盖全部 Skills。</p><p className="skill-result-count" data-skill-result-count="" role="status" aria-live="polite">{skills.length} 项能力</p></div>
      <div className="skill-directory">
          {skills.map((item, index) => (
            <SiteLink className="skill-directory-item" href={`/skills/${item.slug}`} data-skill-categories={skillCategoryIds(item.slug).join(" ")} key={item.slug}>
              <span className="directory-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="directory-copy"><span className="skill-card-top"><strong>{annotateTerms(item.title)}</strong><StatusPill status={skillStatusTone(item)}>{annotateTerms(item.status)}</StatusPill></span><span className="skill-plain-title">Skill · {item.name}</span><span>{annotateTerms(skillOutcomes[item.slug].value)}</span><small>{item.provenance} · 成熟度 {item.maturity}（{maturityMeaning(item.maturity)}）</small></span>
              <ArrowRight size={18} aria-hidden="true" />
            </SiteLink>
          ))}
      </div>
      {excludedSkills.length ? <aside className="catalog-boundary"><h2>本轮没有放进来的项</h2>{excludedSkills.map((item) => <p key={item.name}><strong>{item.name}</strong>：{item.reason}</p>)}</aside> : null}
    </div>
  );
}

function EvidenceGrid({ skill: item }) {
  return (
    <>
      <dl className="evidence-grid">
        <div><dt>Source（源码）</dt><dd>{annotateTerms(item.sourceState)}</dd></div><div><dt>Install（安装）</dt><dd>{annotateTerms(item.installState)}</dd></div>
        <div><dt>Transaction（供应事务）</dt><dd>{annotateTerms(item.transactionState)}</dd></div><div><dt>Current task（当前任务）</dt><dd>{annotateTerms(item.currentTaskState)}</dd></div>
        <div><dt>Fresh task（全新任务）</dt><dd>{annotateTerms(item.freshTaskState)}</dd></div><div><dt>End to end（端到端）</dt><dd>{annotateTerms(item.endToEndState)}</dd></div>
      </dl>
      <div className="skill-regression-evidence"><strong>Regression（回归证据）</strong><p>{annotateTerms(item.tests)}</p></div>
    </>
  );
}

function SkillDetail({ item, search }) {
  const back = "/skills";
  const guide = skillGuides[item.slug];
  const outcome = skillOutcomes[item.slug];
  const quickAvoid = item.avoidWhen;
  return (
    <div className="page-frame detail-page">
      <article className="standalone-document skill-document">
        <Breadcrumbs items={[{ label: "Skills", href: back }, { label: item.title }]} />
        <header><p className="section-kicker">能力入口 · {item.provenance}</p><h1>{annotateTerms(item.title)}</h1><p className="standfirst">{annotateTerms(outcome.value)}</p><StatusPill status={skillStatusTone(item)}>{annotateTerms(item.readerStatus || item.status)}</StatusPill></header>
        <ProjectReadingNav />
        <ProjectReadingPanel id="product" selected>
        <section className="skill-reader-quick">
          <p className="section-kicker">先看怎么用</p>
          <h2>你不需要记住 Skill 名，直接说需求就行</h2>
          <div className="plain-language-grid">
            <article><h3>什么时候用</h3><StringList items={item.useWhen.map(annotateTerms)} /></article>
            <article><h3>可以直接这样说</h3><p>{annotateTerms(outcome.example)}</p></article>
            <article><h3>最后会得到什么</h3><p>{annotateTerms(outcome.result)}</p></article>
            <article><h3>不适合这样用</h3><StringList items={quickAvoid.map(annotateTerms)} /></article>
          </div>
          <ThreeStateSummary {...outcome.readerStates} />
        </section>
        <UsageStart entry={item.usageEntry} inputs={item.usageInputs} />
          <div className="skill-reader-details-body">
            <section className="skill-outcome">
              <h2>为什么需要这个能力</h2>
              <p>{annotateTerms(outcome.why)}</p>
              {item.productProcesses?.length ? <div className="skill-product-processes">{item.productProcesses.map((process) => <section className="skill-product-process" key={process.title}><h3>{annotateTerms(process.title)}</h3><blockquote>{annotateTerms(process.request)}</blockquote><p>{annotateTerms(process.input)}</p><p>{annotateTerms(process.action)}</p><p>{annotateTerms(process.result)}</p><p className="product-process-boundary">{annotateTerms(process.boundary)}</p></section>)}</div> : <><h3>从需求到结果</h3><div className="skill-decision-list">{outcome.changes.map((change, index) => <article key={change}><span>{index + 1}</span><p>{annotateTerms(change)}</p></article>)}</div></>}
            </section>

            <section><h2>失败时会怎样恢复</h2><div className="skill-failure-table">{guide.failures.map(([condition, response, recovery]) => <article key={condition}><h3>{annotateTerms(condition)}</h3><p><strong>系统反应：</strong>{annotateTerms(response)}</p><p><strong>恢复方式：</strong>{annotateTerms(recovery)}</p></article>)}</div></section>
          </div>
        </ProjectReadingPanel>
        <ProjectReadingPanel id="technical">
          <header className="module-technical-heading"><h2>技术身份与验证证据</h2><p>Skill · {item.name} · 成熟度 {item.maturity}（{maturityMeaning(item.maturity)}）</p></header>
          <div className="skill-technical-details-body">
            <CapabilityLinkBar title="项目与系统关系" items={skillConnectionItems(item.slug)} />
            <section className="compact-terms"><h2>这个 Skill 用到的名词</h2><dl className="definition-list">{guide.glossary.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{annotateTerms(meaning)}</dd></div>)}</dl></section>
            <section><h2>专业定义</h2><p>{annotateTerms(item.summary)}</p></section>
            <section className="skill-execution-reference"><h2>执行参考</h2><p>下面保留 AI 和工具实际使用的参数、步骤与依赖。日常使用可以直接提出需求，不需要先手工准备这些协议。</p><div className="skill-detail-pair"><section><h3>输入</h3><StringList items={item.inputs.map(annotateTerms)} /></section><section><h3>输出</h3><StringList items={item.outputs.map(annotateTerms)} /></section></div><h3>执行顺序</h3><ol className="number-list compact-list">{item.flow.map((step, index) => <li key={step}><span>{index + 1}</span><div><p>{annotateTerms(step)}</p></div></li>)}</ol><h3>操作边界</h3><StringList items={item.boundaries.map(annotateTerms)} /><h3>依赖</h3><StringList items={item.dependencies.map(annotateTerms)} /></section>
            {item.technicalSections?.map((section) => <section className="skill-technical-section" key={section.title}><h2>{annotateTerms(section.title)}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{annotateTerms(paragraph)}</p>)}{section.commands?.map((command) => <pre key={command}><code>{command}</code></pre>)}</section>)}
            <section><h2>验证状态</h2><p>源码、安装、供应检查、当前任务、新任务和真实使用分别列出；一层通过不自动提升另一层。</p><EvidenceGrid skill={item} /></section>
            <section><h2>证据时间与来源</h2><dl className="fact-grid"><div><dt>Observed at（观察时间）</dt><dd>{item.evidenceObservedAt}</dd></div><div><dt>Source commit（来源提交）</dt><dd>{item.evidenceSourceCommit ? <code>{item.evidenceSourceCommit}</code> : "不适用：宿主集成能力不绑定项目 Git 提交"}</dd></div><div><dt>Supply command（供应验证命令）</dt><dd>{item.sourceLocatorVisibility === "withheld" ? "由个人 Skill 供应链在内部执行并回读；公开页不展示维护命令或路径。" : <code>{item.supplyEvidenceCommand}</code>}</dd></div><div><dt>Evidence basis（证据来源）</dt><dd>{annotateTerms(item.evidenceBasis)}</dd></div></dl></section>
            <section><h2>Canonical source（唯一维护源）</h2><div className="source-list">{item.sourceKind === "host_integrated" ? <><div><code>{item.capabilityId}</code><p>这是稳定的宿主能力身份；宿主更新后仍按能力发现，不以版本化缓存路径准入。</p></div><div><code>{item.observedSourcePath}</code><p>这是本次观察到的 bundle（宿主能力包）源码位置，只用于记录本轮 bytes / SHA 快照。</p></div></> : item.sourceLocatorVisibility === "withheld" ? <div><code>{item.publicSourceLabel}</code><p>精确维护定位由个人 Skill 供应链保留；公开页只显示可用产品入口、当前规则与分层验证，不暴露内部维护路径。</p></div> : <div><code>{item.sourcePath}</code><p>该路径是维护源；用户目录中的发现入口不是第二份源码。</p></div>}</div></section>
          </div>
        </ProjectReadingPanel>

        <SiteLink className="back-link" href={back}><ArrowLeft size={18} aria-hidden="true" />返回 Skills（能力）</SiteLink>
      </article>
    </div>
  );
}

function NotFound() {
  return <div className="page-frame not-found-page"><p className="section-kicker">404</p><h1>你访问的页面不存在</h1><p>当前公开了 {projectCatalog.length} 个项目页面；你可以返回项目列表，或者用页头搜索找到想看的内容。</p><p className="not-found-easter-egg">啦啦啦，没找到页面啦</p><SiteLink href="/projects"><House size={18} aria-hidden="true" />返回项目列表</SiteLink></div>;
}

function BackToTopButton() {
  return (
    <>
      <button className="back-to-top" type="button" data-back-to-top aria-label="回到页面顶部" title="回到顶部" hidden><ArrowUp size={21} weight="bold" aria-hidden="true" /></button>
      <span className="visually-hidden" data-back-to-top-stamp-status role="status" aria-live="polite" aria-atomic="true" />
    </>
  );
}

function FooterEmailLink({ item }) {
  return (
    <div className="site-footer-email-row" data-footer-email-copy={site.email} data-copy-value={site.email}>
      <a href={item.href}><SocialIcon name={item.icon} /><strong>{item.label}</strong><code>{item.href}</code></a>
      <button type="button" data-footer-email-copy-button aria-label="复制邮箱地址"><CopySimple size={15} aria-hidden="true" /><span data-footer-email-copy-label>复制</span></button>
      <span className="visually-hidden" data-footer-email-copy-status role="status" aria-live="polite" />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <section className="site-footer-intro" aria-labelledby="site-footer-title">
          <span>个人 AI 协作系统</span>
          <h2 id="site-footer-title">从这里继续工作</h2>
          <p>这里集中查看项目、规则和能力，也提供 AI 续作说明与电脑连接入口。页面状态保留各自的观察时间；接上工具后的实际操作和结果，在对应任务中完成并核对。</p>
        </section>
        <nav className="site-footer-links" aria-label="页脚站内导航">
          <h2><span>01</span>站内入口</h2>
          {primaryNav.map((item) => { const introduction = systemDirectoryIntroductions.find((candidate) => candidate.href === item.href); return <SiteLink href={item.href} id={introduction ? `system-directory-${introduction.id}` : undefined} title={introduction?.body} key={item.href}><strong>{item.label}</strong><code>{canonicalUrl(item.href)}</code><ArrowRight size={15} aria-hidden="true" /></SiteLink>; })}
        </nav>
        <nav className="site-footer-links site-footer-external" aria-label="页脚外部与联系入口">
          <h2><span>02</span>外部与联系</h2>
          {socialLinks.map((item) => item.mail
            ? <FooterEmailLink item={item} key={item.label} />
            : <a href={item.href} key={item.label} rel="noopener noreferrer" target="_blank"><SocialIcon name={item.icon} /><strong>{item.label}</strong><code>{item.href}</code><ArrowRight size={15} aria-hidden="true" /></a>)}
        </nav>
      </div>
      <div className="site-footer-meta">
        <span className="site-footer-identity">© 2026 吴乐阳 <a href={`${site.url}/`}>{site.url}/</a></span>
        <button className="site-footer-signature" type="button" data-footer-signature aria-label="查看页脚彩蛋"><span data-footer-signature-label>啦啦啦</span></button>
        <span className="visually-hidden" data-footer-signature-status role="status" aria-live="polite" />
        <small>项目、规则、能力与协作入口</small>
      </div>
    </footer>
  );
}

function McpAccessPage() {
  return (
    <div className="mcp-page">
      <header className="mcp-intro">
        <p className="section-kicker">电脑连接 · MCP</p>
        <h1>我的电脑连接</h1>
        <p>为自己使用的智能体、桌面应用或自动化工具，配置主机与副机的 MCP（模型上下文协议）连接。</p>
        <p className="mcp-access-boundary"><LockKey size={17} aria-hidden="true" /><strong>仅限本人及已授权客户端使用。</strong>需要有效凭据或 OAuth 授权，复制地址不会获得电脑操作权限。</p>
        <p className="mcp-use-note">配置连接或找地址时来这里。连接完成后，直接在原来的客户端使用。</p>
      </header>

      <section className="mcp-device-grid" aria-label="选择要连接的电脑">
        {mcpDevices.map((device) => {
          const DeviceIcon = device.id === "main" ? Desktop : Laptop;
          return <article className="mcp-device-card" key={device.id} aria-labelledby={`mcp-${device.id}-title`}>
            <div className="mcp-device-heading"><span className="mcp-device-icon"><DeviceIcon size={31} weight="regular" aria-hidden="true" /></span><div><p>{device.label}</p><h2 id={`mcp-${device.id}-title`}>{device.name}</h2></div><span className="mcp-protocol">MCP</span></div>
            <p className="mcp-device-summary">{device.summary}</p>
            <div className="mcp-address-block">
              <span className="mcp-field-label">连接地址</span>
              <code className="mcp-endpoint">{device.endpoint}</code>
              <div className="mcp-copy-actions">
                <div data-copy-value={mcpSetupNote(device)} data-copy-name={`${device.name}接入说明`}><button className="mcp-copy-button" type="button" data-copy-button aria-label={`复制给 AI 的${device.name}接入说明`}><CopySimple size={17} aria-hidden="true" /><span data-copy-label>复制给 AI 的说明</span></button><span className="visually-hidden" data-copy-status role="status" aria-live="polite" /></div>
                <div data-copy-value={device.endpoint} data-copy-name={`${device.name}连接地址`}><button className="mcp-copy-button mcp-copy-address" type="button" data-copy-button aria-label={`复制${device.name}连接地址`}><span data-copy-label>只复制地址</span></button><span className="visually-hidden" data-copy-status role="status" aria-live="polite" /></div>
              </div>
              <p className="mcp-copy-help">不熟悉配置时，把接入说明交给能配置工具的 AI；已有 MCP 设置入口时，直接填地址。</p>
            </div>
            <p className="mcp-permission"><LockKey size={15} aria-hidden="true" />{device.permissionNote}</p>
            <div className="mcp-verified"><span>最近普通调用验收</span><time dateTime={device.verifiedAt}>{device.verifiedLabel}</time></div>
          </article>;
        })}
      </section>

      <details className="mcp-fallback">
        <summary><span><strong>主机的备用连接</strong><small>主入口确认故障时，经副机连回主机。</small></span><span className="mcp-fallback-toggle" aria-hidden="true">＋</span></summary>
        <div className="mcp-fallback-body">
          <p>文件和命令仍在主机上执行，使用主机原有凭据与权限。两台电脑都需要开机联网；副机自己的连接不受这次切换影响。</p>
          <div className="mcp-address-block">
            <span className="mcp-field-label">主机备用地址 · 经副机转接</span>
            <code className="mcp-endpoint">{mcpMainFallback.endpoint}</code>
            <div className="mcp-copy-actions">
              <div data-copy-value={mcpSetupNote(mcpMainFallback)} data-copy-name="主机备用接入说明"><button className="mcp-copy-button" type="button" data-copy-button aria-label="复制给 AI 的主机备用接入说明"><CopySimple size={17} aria-hidden="true" /><span data-copy-label>复制备用接入说明</span></button><span className="visually-hidden" data-copy-status role="status" aria-live="polite" /></div>
              <div data-copy-value={mcpMainFallback.endpoint} data-copy-name="主机备用地址"><button className="mcp-copy-button mcp-copy-address" type="button" data-copy-button aria-label="复制主机备用地址"><span data-copy-label>只复制地址</span></button><span className="visually-hidden" data-copy-status role="status" aria-live="polite" /></div>
            </div>
          </div>
          <p className="mcp-copy-help">“密码或授权不正确”应先处理认证。操作超时、结果未知时，先核实是否已执行，再决定是否重试。备用入口不会自动切换或重复执行任务。</p>
          <p className="mcp-copy-help">已完成断开与恢复演练：经副机公网调用主机，并以 SYSTEM 成功恢复主入口。<time dateTime={mcpMainFallback.verifiedAt}>{mcpMainFallback.verifiedLabel}</time>。</p>
        </div>
      </details>

      <section className="mcp-start" aria-labelledby="mcp-start-title">
        <h2 id="mcp-start-title">三步，开始使用</h2>
        <ol><li><span>01</span><div><h3>选电脑，复制说明</h3><p>把接入说明交给能配置工具的 AI，或自己在应用中添加远程 MCP。</p></div></li><li><span>02</span><div><h3>完成认证</h3><p>在应用的认证设置中使用有效凭据，或按提示完成 OAuth 授权。</p></div></li><li><span>03</span><div><h3>确认连通，再使用</h3><p>先检查连接的是哪台电脑，再让 AI 使用它的文件、命令和桌面工具。</p></div></li></ol>
      </section>

      <div className="mcp-details">
        <details><summary>接入方式与认证<span aria-hidden="true">＋</span></summary><div className="mcp-detail-body"><p>需要支持远程 MCP 的客户端。不同工具的设置位置、认证方式和能力支持不同；地址本身不包含操作权限。</p><dl><div><dt>OAuth 登录授权</dt><dd>适用于当前已登记的客户端。首次连接时，按客户端提示完成授权。</dd></div><div><dt>Bearer 凭据</dt><dd>已有兼容方式，供支持此认证的客户端使用。凭据在私下配置，不会展示在网页上。</dd></div><div><dt>已验收的示例</dt><dd>ChatGPT 已完成真实工具调用验收。可在<a href="https://chatgpt.com/plugins" target="_blank" rel="noopener noreferrer">插件设置 <ArrowRight size={13} aria-hidden="true" /></a>添加或管理连接。其他客户端仍需各自完成接入验证。</dd></div></dl><p>如果新工具无法完成认证，应先确认它支持哪种方式，再配置对应授权。</p></div></details>
        <details><summary>技术与最近验收<span aria-hidden="true">＋</span></summary><div className="mcp-detail-body"><p>这里显示最近一次验收记录，不代表电脑此刻在线。页面本身是静态网页，打开时不请求两台电脑。</p>{mcpDevices.map((device) => <section key={device.id}><h3>{device.name}</h3><p>{device.evidence}</p><p className="mcp-technical-note">当前入口：{device.transport}</p></section>)}<section><h3>主机备用入口 · 故障演练</h3><p>{mcpMainFallback.evidence}</p><p>这证明主机隧道断开时可以经副机公网连接主机，不代表已经模拟 Cloudflare 全球故障。备用通路仍依赖两台电脑、副机公网入口、两机私网连接和主机 MCP 服务。</p></section><p>普通命令验收不等于每一种文件和桌面操作都已复测。电脑需要开机、联网且服务运行，客户端才能调用工具。</p></div></details>
      </div>
      <SiteLink className="mcp-back-link" href="/"><ArrowLeft size={16} aria-hidden="true" />回到个人 AI 协作系统</SiteLink>
    </div>
  );
}

export default function Page({ initialPathname = "/", initialSearch = "" } = {}) {
  const location = useLocationState(initialPathname, initialSearch);
  const path = location.pathname;
  const mainHasMountedRef = useRef(false);
  const setMainRef = useCallback((node) => {
    if (!node) return;
    if (!mainHasMountedRef.current) {
      mainHasMountedRef.current = true;
      return;
    }
    node.focus({ preventScroll: true });
  }, [path]);
  useEffect(() => {
    const meta = routeMeta(path);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl(path));
  }, [path]);

  let content;
  const currentProjectEntry = projectEntryForPath(path);
  if (path === "/") content = <SystemPage />;
  else if (path === "/projects") content = <HomePage />;
  else if (path === "/system") content = <SystemPage />;
  else if (path === "/search") content = <SearchResultsPage search={location.search} />;
  else if (path === "/mcp") content = <McpAccessPage />;
  else if (path === "/computer-access") content = <div data-computer-access><ComputerAccess /></div>;
  else if (currentProjectEntry) {
    if (path === currentProjectEntry.project.route) content = <ProjectPage entry={currentProjectEntry} />;
    else {
      const moduleSlug = path.slice(currentProjectEntry.project.route.length + 1);
      const module = currentProjectEntry.modules.find((item) => item.slug === moduleSlug);
      content = module ? <ProjectPage entry={currentProjectEntry} module={module} /> : <NotFound />;
    }
  } else if (path === "/rules") content = <RulesPage search={location.search} />;
  else if (path === "/skills") content = <SkillsPage search={location.search} />;
  else if (path.startsWith("/skills/")) {
    const item = skills.find((candidate) => candidate.slug === path.split("/").at(-1));
    content = item && path === `/skills/${item.slug}` ? <SkillDetail item={item} search={location.search} /> : <NotFound />;
  } else content = <NotFound />;

  return <>{path === "/computer-access" ? null : <FlowField />}<Header path={path} search={location.search} /><main id="main-content" ref={setMainRef} tabIndex={-1}>{content}</main><SiteFooter /><BackToTopButton /></>;
}
