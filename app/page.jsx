import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle,
  EnvelopeSimple,
  House,
  Info,
  List,
  LockKey,
  MagnifyingGlass,
  ShieldCheck,
  Warning,
  Wrench,
  X
} from "@phosphor-icons/react";
import { SiBilibili, SiGithub, SiX } from "@icons-pack/react-simple-icons";
import {
  excludedSkills,
  canonicalUrl,
  modules,
  normalizePath,
  panelSnapshot,
  primaryNav,
  project,
  routeMeta,
  rulesSnapshot,
  site,
  skills,
  socialLinks
} from "./site-content.js";
import { ruleGuides } from "./content-rule-guides.js";
import { skillGuides, skillOutcomes } from "./content-skill-guides.js";
import { searchPanel } from "./search.js";

function useLocationState() {
  const [location, setLocation] = useState(() => ({
    pathname: normalizePath(window.location.pathname),
    search: window.location.search
  }));

  useEffect(() => {
    function update() {
      setLocation({ pathname: normalizePath(window.location.pathname), search: window.location.search });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return location;
}

function isModifiedClick(event) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

function SiteLink({ href, onNavigate, children, ...props }) {
  const internal = href.startsWith("/");

  function handleClick(event) {
    props.onClick?.(event);
    if (event.defaultPrevented || !internal || event.button !== 0 || isModifiedClick(event) || props.target) return;
    event.preventDefault();
    const target = new URL(href, window.location.origin);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const next = `${target.pathname}${target.search}${target.hash}`;
    if (current === next) window.scrollTo({ top: 0, behavior: "instant" });
    else {
      window.history.pushState({}, "", next);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    onNavigate?.();
  }

  return <a href={href} {...props} onClick={handleClick}>{children}</a>;
}

function SocialIcon({ name }) {
  const props = { size: 18, color: "currentColor", "aria-hidden": true };
  if (name === "github") return <SiGithub {...props} />;
  if (name === "bilibili") return <SiBilibili {...props} />;
  if (name === "x") return <SiX {...props} />;
  return <EnvelopeSimple size={19} aria-hidden="true" />;
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return [];
    return searchPanel(normalized);
  }, [normalized]);

  return (
    <div
      className="global-search"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    >
      <label>
        <MagnifyingGlass size={18} aria-hidden="true" />
        <span className="visually-hidden">搜索项目、规则和 Skills</span>
        <input
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); event.currentTarget.blur(); } }}
          aria-expanded={Boolean(open && normalized)}
          aria-controls="global-search-results"
          placeholder="搜索项目、规则或 Skill"
        />
      </label>
      {open && normalized ? (
        <div className="global-search-results" id="global-search-results" aria-label="全站搜索结果">
          <p aria-live="polite">{results.length > 9 ? `找到 ${results.length} 项，显示前 9 项` : `找到 ${results.length} 项`}</p>
          {results.length ? results.slice(0, 9).map((entry) => (
            <SiteLink href={entry.href} key={`${entry.type}-${entry.href}`} onNavigate={() => { setOpen(false); setQuery(""); }}>
              <span>{entry.type}</span><span><strong>{entry.title}</strong><small>{entry.detail}</small></span><ArrowRight size={16} aria-hidden="true" />
            </SiteLink>
          )) : <div className="global-search-empty">没有匹配结果。可以直接搜索“委派”“录音”“仓库”或“加密”。</div>}
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
  if (href === "/") return path === "/" || path.startsWith("/projects/");
  return path === href || path.startsWith(`${href}/`);
}

function Header({ path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  return (
    <>
      <header className="site-header">
        <a className="skip-link" href="#main-content">跳到主要内容</a>
        <div className="header-inner">
        <SiteLink className="brand" href="/" aria-label="返回吴乐阳首页">吴乐阳</SiteLink>
        <GlobalSearch />
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={23} aria-hidden="true" /> : <List size={23} aria-hidden="true" />}
        </button>
        <div className={`header-navigation${menuOpen ? " is-open" : ""}`} id="site-navigation">
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
      </header>
      {menuOpen ? <button className="menu-backdrop" type="button" tabIndex={-1} aria-label="关闭导航菜单背景" onClick={() => setMenuOpen(false)} /> : null}
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

function skillStatusTone(status) {
  const value = String(status);
  if (/受阻|不可用|失败|BLOCK|未验证|未知/i.test(value)) return "repair";
  if (/通过|在线|已安装|已配置|受保护/i.test(value)) return "pass";
  return "unknown";
}

function HomePage() {
  const unresolved = panelSnapshot.validation.rows.filter((item) => item.status !== "pass").length;
  return (
    <div className="page-frame home-page">
      <h1 className="visually-hidden">个人项目</h1>
      <div className="project-grid">
        <SiteLink className="featured-project" href={project.route} aria-labelledby="agents-card-title">
          <span className="project-index" aria-hidden="true"><strong>01</strong><span /></span>
          <div className="project-card-body">
            <div className="project-card-header">
              <div className="project-title-row"><span className="project-mark" aria-hidden="true" /><h2 id="agents-card-title">{project.title}</h2></div>
              <span className="project-visibility"><LockKey size={15} aria-hidden="true" />{project.visibility}</span>
            </div>
            <p className="project-summary">{project.summary}</p>
            <dl className="project-metrics">
              <div><dt>活动代际</dt><dd>{panelSnapshot.authority.generation}</dd></div>
              <div><dt>现行规则</dt><dd>{rulesSnapshot.rules.length}</dd></div>
              <div><dt>面板收录 Skills</dt><dd>{skills.length}</dd></div>
              <div><dt>基础矩阵待闭合</dt><dd>{unresolved}</dd></div>
            </dl>
            <div className="project-card-foot">
              <StatusPill status="pass">{panelSnapshot.authority.statusLabel}</StatusPill>
              <span>{panelSnapshot.observedAt}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </div>
          </div>
        </SiteLink>
      </div>
    </div>
  );
}

function ProjectHero() {
  return (
    <>
      <Breadcrumbs items={[{ label: "项目", href: "/" }, { label: ".agents" }]} />
      <section className="project-hero">
        <div>
          <p className="section-kicker">个人智能体控制面</p>
          <h1><span className="title-accent" aria-hidden="true" />.agents</h1>
          <p className="project-lead">{project.summary}</p>
        </div>
        <aside className="snapshot-card" aria-label="当前快照">
          <span className="snapshot-label">当前快照</span>
          <strong>Generation {panelSnapshot.authority.generation}</strong>
          <span>{panelSnapshot.authority.statusLabel}</span>
          <span>{panelSnapshot.observedAt}</span>
          <span>{project.repositoryNote}</span>
        </aside>
      </section>
    </>
  );
}

function ProjectNav({ current }) {
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
  }, [current]);

  return (
    <nav className="project-navigation" aria-label=".agents 模块导航" ref={navigationRef}>
      <SiteLink className={!current ? "is-current" : undefined} href="/projects/agents" aria-current={!current ? "page" : undefined}>总览</SiteLink>
      {modules.map((item) => (
        <SiteLink
          className={current === item.slug ? "is-current" : undefined}
          href={`/projects/agents/${item.slug}`}
          key={item.slug}
          aria-current={current === item.slug ? "page" : undefined}
        >{item.shortTitle}</SiteLink>
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
          <p>这里不只显示“有失败”。每一项都保留测试身份、位置和本轮失败原因，便于判断该修哪里。</p>
          {failures.map((failure) => (
            <article key={failure.id}>
              <div><strong>{failure.id}</strong><StatusPill status="repair">{failure.status}</StatusPill></div>
              <dl>
                <div><dt>测试文件</dt><dd><code>{failure.path}</code></dd></div>
                <div><dt>退出码 / 耗时</dt><dd>{failure.exitCode ?? "无"} / {failure.durationSeconds} 秒</dd></div>
                <div><dt>失败原因</dt><dd>{failure.reason}</dd></div>
              </dl>
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}

function ProjectOverview() {
  return (
    <article className="document-content overview-content">
      <section className="document-section document-section-first">
        <p className="section-kicker">现实定位</p>
        <h2>不是 Prompt 集合，而是个人 AI 工作的规则、授权和能力控制面。</h2>
        <p>它把“模型能不能做”进一步拆成：答案去哪里取真相、谁可以写、什么动作已经获得授权、失败后怎样恢复、哪一层证据才算完成。</p>
      </section>

      <section className="document-section split-section">
        <div><h2>它负责</h2><ul className="plain-list">{project.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h2>它不负责</h2><ul className="plain-list">{project.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>

      <section className="document-section">
        <h2>当前状态</h2>
        <dl className="fact-grid">
          <div><dt>仓库</dt><dd>{panelSnapshot.repositoryVisibility} / {panelSnapshot.sourceBranch}</dd></div>
          <div><dt>源提交</dt><dd><code>{panelSnapshot.sourceCommit.slice(0, 12)}</code></dd></div>
          <div><dt>活动规则</dt><dd>{panelSnapshot.authority.status} / {panelSnapshot.authority.statusLabel} / 第 {panelSnapshot.authority.generation} 代</dd></div>
          <div><dt>Candidate</dt><dd>{panelSnapshot.authority.candidate}</dd></div>
          <div><dt>生产适配器</dt><dd>{panelSnapshot.authority.productionActivation ? "已激活" : "未激活"}</dd></div>
          <div><dt>Skills</dt><dd>面板收录 {skills.length} / 当前供应 {panelSnapshot.skills.activeInstallIntent}</dd></div>
        </dl>
      </section>

      <section className="document-section">
        <h2>先把项目里的词讲清楚</h2>
        <p>看板后面会直接使用这些英文技术词；这里先给出中文含义。相同术语在规则和 Skill 页面保持同一解释。</p>
        <dl className="project-glossary-grid">
          {project.glossary.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}
        </dl>
      </section>

      <section className="document-section">
        <h2>一条真实工作流</h2>
        <ol className="number-list">
          {project.operatingFlow.map((step, index) => (
            <li key={step.title}><span>{index + 1}</span><div><strong>{step.title}</strong><p>{step.detail}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="document-section">
        <h2>系统里实际有什么</h2>
        <p>下面是当前产品组件，不是概念分类。每一项都对应真实文件、入口或验证链。</p>
        <div className="component-table" role="table" aria-label=".agents 当前组件">
          {project.components.map((item, index) => (
            <article role="row" key={item.name}>
              <span role="cell">{String(index + 1).padStart(2, "0")}</span>
              <div role="cell"><strong>{item.name}</strong><p>{item.responsibility}</p></div>
              <p role="cell">{item.implementation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="document-section">
        <h2>我平时怎样使用它</h2>
        <div className="usage-table">
          {project.usageExamples.map((item) => <article key={item.ask}><blockquote>{item.ask}</blockquote><p>{item.effect}</p></article>)}
        </div>
      </section>

      <section className="document-section">
        <h2>六个模块</h2>
        <div className="module-index">
          {modules.map((item, index) => (
            <SiteLink href={`/projects/agents/${item.slug}`} key={item.slug}>
              <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="module-index-copy"><strong>{item.title}</strong><span>{item.teaser}</span></span>
              <ArrowRight size={18} aria-hidden="true" />
            </SiteLink>
          ))}
        </div>
      </section>

      <section className="document-section">
        <h2>验证不是一盏总绿灯</h2>
        <p>{panelSnapshot.validation.summary}</p>
        <ValidationMatrix />
      </section>

      <section className="document-section">
        <h2>七层证据分别证明什么</h2>
        <div className="evidence-table">
          {project.evidenceLayers.map((item) => <article key={item.layer}><strong>{item.layer}</strong><p><span>能证明：</span>{item.proves}</p><p><span>不能证明：</span>{item.doesNotProve}</p></article>)}
        </div>
      </section>

      <section className="document-section">
        <h2>维护入口</h2>
        <div className="source-list">
          {project.operationalEntrypoints.map((item) => <div key={item.name}><code>{item.command}</code><p><strong>{item.name}</strong>：{item.purpose}</p></div>)}
        </div>
      </section>

      <section className="document-section">
        <h2>项目怎样演化到现在</h2>
        <div className="evolution-timeline">
          {project.evolution.map((item) => <article key={`${item.date}-${item.commit}`}><time>{item.date}</time><code>{item.commit}</code><p>{item.result}</p></article>)}
        </div>
      </section>

      <section className="document-section source-note">
        <h2>快照怎样更新</h2>
        <p>页面代表最后一次明确刷新并发布的状态，不承诺后台自动同步。更新时重新读取固定活动 Authority、真实默认分支、Skill registry 和测试结果；扫描到可自动修复的问题先交给真实 Owner 修复，再生成新快照。</p>
      </section>
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
  ["Production activation", "生产执行状态"],
  ["Active generation", "活动代际"],
  ["Candidate pending", "候选待发布"],
  ["CoreGoalStepCapability", "单步能力"],
  ["CoreGoalCommitment", "目标承诺"],
  ["Execution Owner", "施工责任"],
  ["Registered target", "已登记目标"],
  ["External effect", "外部现实动作"],
  ["Read-back", "正式回读"],
  ["Fresh task", "全新任务验证"],
  ["Source Owner", "来源项目责任人"],
  ["Material change", "实质变化"],
  ["Impact candidate", "影响候选"],
  ["saved local Git project", "已保存本地 Git 项目"],
  ["live evidence", "实时证据"],
  ["current task", "当前任务"],
  ["recovery capsule", "恢复胶囊"],
  ["canonical source", "唯一维护源"],
  ["install intent", "安装意图"],
  ["objective sidecar", "客观结果侧车"],
  ["held-out attribution", "留出样本归属"],
  ["blind fill", "盲填"],
  ["fast-forward", "快进推送"],
  ["worktree", "Git 工作树"],
  ["upstream", "上游分支"],
  ["fallback", "后备路线"],
  ["contact sheet", "页面总览图"],
  ["raw bytes", "原始字节"],
  ["repair plan", "修复计划"],
  ["cache miss", "缓存未命中"],
  ["anonymous", "匿名"],
  ["unknown", "未验证"],
  ["Structure", "结构化版面"],
  ["Timeout", "等待超时"],
  ["objective", "客观状态"],
  ["containment", "隔离处置"],
  ["candidate-only", "仅候选"],
  ["candidate", "候选规则"],
  ["generation", "代际"],
  ["projection", "规则投影"],
  ["Provider", "固定服务入口"],
  ["admission", "仓库准入结果"],
  ["dirty work", "未提交改动"],
  ["metadata", "元数据"],
  ["registry", "登记清单"],
  ["receipt", "执行回执"],
  ["route", "处理路线"],
  ["job", "任务记录"],
  ["scope", "范围"],
  ["effort", "思考等级"],
  ["spawn", "创建子代理"],
  ["Root", "根代理"],
  ["Child", "子代理"],
  ["E2E", "端到端验证"],
  ["ASR", "自动语音识别"],
  ["OCR", "光学字符识别"]
].sort((left, right) => right[0].length - left[0].length);

function annotateTerms(text) {
  let result = String(text);
  for (const [term, translation] of inlineTermTranslations) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const startsWithLatin = /^[A-Za-z0-9]/.test(term);
    const endsWithLatin = /[A-Za-z0-9]$/.test(term);
    const expression = new RegExp(`${startsWithLatin ? "(?<![A-Za-z0-9_-])" : ""}${escaped}${endsWithLatin ? "(?![A-Za-z0-9_-]|（)" : "(?!（)"}`, "gi");
    result = result.replace(expression, (match) => `${match}（${translation}）`);
  }
  return result;
}

function maturityMeaning(value) {
  if (value === "A") return "稳定";
  if (value === "A-") return "基本稳定，仍有明确边界";
  if (value === "B") return "可用，但依赖环境或仍有证据缺口";
  return "按详情判断";
}

function ModuleDetail({ module }) {
  const index = modules.findIndex((item) => item.slug === module.slug);
  const previous = modules[index - 1];
  const next = modules[index + 1];
  return (
    <article className="document-content module-detail">
      <header className="module-heading">
        <p className="section-kicker">模块 {String(index + 1).padStart(2, "0")}</p>
        <h2>{module.title}</h2>
        <p>{annotateTerms(module.teaser)}</p>
        <StatusPill status={module.status.includes("修复") ? "repair" : "pass"}>{module.status}</StatusPill>
      </header>
      <section className="module-outcome"><p className="section-kicker">这个模块有什么意义</p><h2>它会改变哪些实际操作</h2><p>{annotateTerms(module.value)}</p><div className="skill-decision-list">{module.decisionImpact.map((change, index) => <article key={change}><span>{index + 1}</span><p>{annotateTerms(change)}</p></article>)}</div></section>
      <section className="problem-callout"><p className="section-kicker">解决什么</p><p>{annotateTerms(module.problem)}</p></section>
      <section className="document-section"><h2>当前怎样实现</h2><StringList items={module.implementation.map(annotateTerms)} /></section>
      <section className="document-section"><h2>执行流程</h2><ol className="number-list compact-list">{module.flow.map((item, flowIndex) => <li key={item}><span>{flowIndex + 1}</span><div><p>{annotateTerms(item)}</p></div></li>)}</ol></section>
      <section className="document-section"><h2>关键概念</h2><dl className="definition-list">{module.concepts.map((item) => <div key={item.term}><dt>{displayTerm(item.term)}</dt><dd>{item.explanation}</dd></div>)}</dl></section>
      <section className="document-section split-section"><div><h2>边界</h2><StringList items={module.boundaries} /></div><div><h2>失败与恢复</h2><dl className="failure-list">{module.failures.map((item) => <div key={item.condition}><dt>{item.condition}</dt><dd>{item.response}</dd></div>)}</dl></div></section>
      <section className="document-section"><h2>真实入口</h2><div className="source-list">{module.sources.map((source) => <div key={source.path}><code>{source.path}</code><p>{source.role}</p></div>)}</div></section>
      <section className="document-section"><h2>如何验证</h2><StringList items={module.verification} /></section>
      <section className="document-section"><h2>与其他模块的关系</h2><p>{module.relation}</p></section>
      <nav className="document-pagination" aria-label="模块前后导航">
        {previous ? <SiteLink href={`/projects/agents/${previous.slug}`}><ArrowLeft size={18} aria-hidden="true" /><span><small>上一个模块</small>{previous.shortTitle}</span></SiteLink> : <span />}
        {next ? <SiteLink href={`/projects/agents/${next.slug}`}><span><small>下一个模块</small>{next.shortTitle}</span><ArrowRight size={18} aria-hidden="true" /></SiteLink> : null}
      </nav>
    </article>
  );
}

function ProjectPage({ module }) {
  return (
    <div className="page-frame project-page">
      <ProjectHero />
      <div className="project-layout"><ProjectNav current={module?.slug} />{module ? <ModuleDetail module={module} /> : <ProjectOverview />}</div>
    </div>
  );
}

function RuleSelector({ selectedId, onSelect }) {
  function handleTabKeyDown(event, logicalId) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const currentIndex = rulesSnapshot.rules.findIndex((rule) => rule.logicalId === logicalId);
    let nextIndex = currentIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % rulesSnapshot.rules.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + rulesSnapshot.rules.length) % rulesSnapshot.rules.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = rulesSnapshot.rules.length - 1;
    const next = rulesSnapshot.rules[nextIndex];
    onSelect(next.logicalId);
    window.requestAnimationFrame(() => document.getElementById(`rule-tab-${next.logicalId}`)?.focus());
  }

  return (
    <aside className="rule-selector-panel">
      <div className="rule-selector-heading"><span>5 份现行规则</span><small>同一活动代际</small></div>
      <label className="rule-mobile-select">
        <span>选择规则</span>
        <select value={selectedId} onChange={(event) => onSelect(event.target.value)}>
          {rulesSnapshot.rules.map((rule) => <option value={rule.logicalId} key={rule.logicalId}>{rule.title}</option>)}
        </select>
      </label>
      <div className="rule-selector-list" role="tablist" aria-label="规则选择" aria-orientation="vertical">
        {rulesSnapshot.rules.map((rule, index) => (
          <button
            key={rule.logicalId}
            type="button"
            role="tab"
            id={`rule-tab-${rule.logicalId}`}
            aria-controls="rule-panel"
            aria-selected={selectedId === rule.logicalId}
            tabIndex={selectedId === rule.logicalId ? 0 : -1}
            className={selectedId === rule.logicalId ? "is-selected" : undefined}
            onClick={() => onSelect(rule.logicalId)}
            onKeyDown={(event) => handleTabKeyDown(event, rule.logicalId)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span><strong>{rule.title}</strong><small>{rule.question}</small></span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function RuleDetail({ rule }) {
  const index = rulesSnapshot.rules.findIndex((item) => item.logicalId === rule.logicalId);
  const guide = ruleGuides[rule.logicalId];
  const sourceBinding = panelSnapshot.ruleBinding.find((item) => item.logicalId === rule.logicalId);
  const candidateSourceDescription = rulesSnapshot.candidateUnavailable
    ? "Canonical candidate source（候选源码）当前不可取得；活动投影仍可正常读取。"
    : sourceBinding?.candidateMatchesActive
      ? "Canonical candidate source（候选源码）：这一份当前与活动投影逐字节一致；全局仍可因其他规则不同而处于 candidate pending。"
      : rulesSnapshot.candidatePending
        ? "Canonical candidate source（候选源码）：这一份当前与活动投影不同，属于待发布候选；本页没有把候选冒充成现行规则。"
        : "Canonical candidate source（候选源码）与活动投影的逐文件关系尚未验证。";
  return (
    <article className="rule-detail" role="tabpanel" id="rule-panel" aria-labelledby={`rule-tab-${rule.logicalId}`}>
      <header className="rule-detail-heading"><span className="rule-order">{String(index + 1).padStart(2, "0")}</span><div><p className="section-kicker">{rule.logicalId}</p><h2>{rule.title}</h2><p>{rule.question}</p></div></header>
      <section className="rule-plain-language"><p className="section-kicker">先看懂</p><p>{rule.plainLanguage}</p></section>
      <section className="rule-overview-grid">
        <div><h3>它解决什么</h3><p>{rule.purpose}</p></div>
        <div><h3>适用范围</h3><StringList items={rule.scope} /></div>
        <div><h3>它负责判断什么</h3><StringList items={rule.decisions} /></div>
      </section>
      <section className="rule-glossary"><h3>先把术语讲清楚</h3><dl className="definition-list">{guide.glossary.map(([term, explanation]) => <div key={term}><dt>{displayTerm(term)}</dt><dd>{explanation}</dd></div>)}</dl></section>
      <section className="rule-complete-guide">
        <div className="complete-guide-heading"><p className="section-kicker">完整语义清单</p><h3>这份规则逐条写了什么</h3><p>下面不是摘要，而是按原规则结构逐项解释。每一项都说明真实约束；带“例子”的内容只是帮助理解，不会反过来创造新规则。</p></div>
        {guide.sections.map((section) => (
          <div className="guide-section" key={section.title}>
            <header><h4>{section.title}</h4><p>{section.intro}</p></header>
            <div className="guide-item-grid">
              {section.items.map((entry, entryIndex) => (
                <article className="guide-item" key={`${section.title}-${entry.title}`}>
                  <span>{String(entryIndex + 1).padStart(2, "0")}</span>
                  <div><h5>{entry.title}</h5><p>{entry.detail}</p>{entry.example ? <p className="guide-example"><strong>例子：</strong>{entry.example}</p> : null}</div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="rule-dual-column"><div><h3>允许</h3><StringList items={rule.allowed} /></div><div><h3>禁止</h3><StringList items={rule.forbidden} /></div></section>
      <section><h3>典型执行顺序</h3><ol className="number-list compact-list">{rule.process.map((item, processIndex) => <li key={item}><span>{processIndex + 1}</span><div><p>{item}</p></div></li>)}</ol></section>
      <section><h3>失败关闭与恢复</h3><StringList items={rule.failure} /></section>
      <section><h3>来源、版本与关系</h3><dl className="rule-identity-grid">
        <div><dt>Owner（责任源）</dt><dd>{rule.owner}</dd></div><div><dt>Generation（活动代际）</dt><dd>{rulesSnapshot.generation}</dd></div>
        <div><dt>Size（大小）</dt><dd>{rule.bytes} bytes / {rule.lines} 行</dd></div><div className="rule-hash"><dt>SHA-256（内容指纹）</dt><dd><code>{rule.sha256}</code></dd></div>
      </dl><div className="source-list">
        <div><code>{`C:\\ProgramData\\PCConfig\\AuthorityHost\\policy\\generations\\${rulesSnapshot.generationId}\\projection\\${rule.projectionRelpath}`}</code><p>Active projection（活动规则投影）：本页规则语义和 SHA 以这里为准。</p></div>
        <div><code>{rule.sourcePath}</code><p>{candidateSourceDescription}</p>{sourceBinding ? <p><strong>Candidate fingerprint（候选指纹）：</strong><code>{sourceBinding.candidateSha256}</code> / {sourceBinding.candidateBytes} bytes。</p> : null}</div>
      </div><p>{rule.relation}</p></section>
    </article>
  );
}

function RulesPage({ search }) {
  const query = new URLSearchParams(search);
  const requested = query.get("rule");
  const selected = rulesSnapshot.rules.find((rule) => rule.logicalId === requested) || rulesSnapshot.rules[0];

  function selectRule(logicalId) {
    const next = new URL(window.location.href);
    next.pathname = "/rules";
    next.searchParams.set("rule", logicalId);
    window.history.pushState({}, "", `${next.pathname}${next.search}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div className="page-frame rules-page">
      <section className="rules-dashboard-bar">
        <div><p className="section-kicker">当前生效规则</p><h1>Generation {rulesSnapshot.generation}</h1><span>{rulesSnapshot.observedAt}</span></div>
        <dl>
          <div><dt>Authority（活动权威）</dt><dd>{rulesSnapshot.status} · {panelSnapshot.authority.statusLabel}</dd></div>
          <div><dt>Rule closure（规则闭包）</dt><dd>{rulesSnapshot.rules.length} / 5</dd></div>
          <div><dt>Production（生产执行）</dt><dd>{rulesSnapshot.productionActivation ? "已激活" : "未激活"}</dd></div>
          <div><dt>Candidate（候选规则）</dt><dd>{rulesSnapshot.candidate}</dd></div>
          <div><dt>Source（源码）</dt><dd>{rulesSnapshot.candidatePending ? "候选与活动规则不同" : rulesSnapshot.candidateUnavailable ? "候选不可取得" : "五份逐字节一致"}</dd></div>
        </dl>
      </section>
      <div className="rules-workbench"><RuleSelector selectedId={selected.logicalId} onSelect={selectRule} /><RuleDetail rule={selected} /></div>
      <section className="rules-validation">
        <div><p className="section-kicker">验证矩阵</p><h2>活动规则有效，不代表所有消费者和跨 Owner 检查都已通过。</h2><p>{panelSnapshot.validation.summary}</p></div>
        <ValidationMatrix />
      </section>
    </div>
  );
}

function SkillsPage() {
  return (
    <div className="page-frame directory-page skills-page">
      <h1 className="visually-hidden">Skills</h1>
      <p className="directory-status-line"><strong>公开 MVP 收录 {skills.length} 个 Skills</strong><span>当前供应清单有 {panelSnapshot.skills.activeInstallIntent} 个 active install intent（活动安装意图）；{panelSnapshot.skills.activeInstallIntent - skills.length} 个因明确公开边界未进入页面。收录项按使用频率、不可替代性、成熟度、真实 E2E（端到端验证）和失败成本综合排序。</span></p>
      <div className="skill-directory">
          {skills.map((item, index) => (
            <SiteLink href={`/skills/${item.slug}`} key={item.slug}>
              <span className="directory-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="directory-copy"><span className="skill-card-top"><strong>{item.name}</strong><StatusPill status={skillStatusTone(item.status)}>{item.status}</StatusPill></span><span className="skill-plain-title">{item.title}</span><span>{annotateTerms(skillOutcomes[item.slug].value)}</span><small>{item.provenance} · 成熟度 {item.maturity}（{maturityMeaning(item.maturity)}）</small></span>
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
    <dl className="evidence-grid">
      <div><dt>Source（源码）</dt><dd>{item.sourceState}</dd></div><div><dt>Install（安装）</dt><dd>{item.installState}</dd></div>
      <div><dt>Current task（当前任务）</dt><dd>{item.currentTaskState}</dd></div><div><dt>Fresh task（全新任务）</dt><dd>{item.freshTaskState}</dd></div>
      <div><dt>End to end（端到端）</dt><dd>{item.endToEndState}</dd></div><div><dt>Regression（回归）</dt><dd>{item.tests}</dd></div>
    </dl>
  );
}

function SkillDetail({ item, search }) {
  const back = "/skills";
  const guide = skillGuides[item.slug];
  const outcome = skillOutcomes[item.slug];
  return (
    <div className="page-frame detail-page">
      <article className="standalone-document skill-document">
        <Breadcrumbs items={[{ label: "Skills", href: back }, { label: item.name }]} />
        <header><p className="section-kicker">{item.provenance} · 成熟度 {item.maturity}（{maturityMeaning(item.maturity)}）</p><h1>{item.name}</h1><p className="skill-human-title">{item.title}</p><p className="standfirst">{annotateTerms(item.summary)}</p><StatusPill status={skillStatusTone(item.status)}>{item.status}</StatusPill></header>
        <section className="skill-outcome">
          <p className="section-kicker">这个 Skill 有什么意义</p>
          <h2>它解决的不是“核对信息”，而是改变下一步该怎么做</h2>
          <p>{annotateTerms(outcome.value)}</p>
          <div className="skill-decision-list">
            {outcome.changes.map((change, index) => <article key={change}><span>{index + 1}</span><p>{annotateTerms(change)}</p></article>)}
          </div>
        </section>
        <section><h2>先把术语翻译成人话</h2><dl className="definition-list">{guide.glossary.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></section>
        <section className="skill-current-rule">
          <p className="section-kicker">当前规则</p>
          <h2>系统现在会怎样使用这个 Skill</h2>
          <p>下面四块就是当前生效的操作规则，不是宣传摘要。规则正文来自页面底部列出的 canonical source（唯一维护源）。</p>
          <div className="skill-current-rule-grid">
            <article><h3>1. 什么时候触发</h3><StringList items={item.useWhen.map(annotateTerms)} /></article>
            <article><h3>2. 触发后按什么顺序做</h3><ol>{item.flow.map((step, index) => <li key={step}><span>{index + 1}</span>{annotateTerms(step)}</li>)}</ol></article>
            <article><h3>3. 明确不做什么</h3><StringList items={[...item.avoidWhen, ...item.boundaries].map(annotateTerms)} /></article>
            <article><h3>4. 怎样才算有结果</h3><StringList items={[...item.outputs, `当前端到端证据：${item.endToEndState}`, `当前回归证据：${item.tests}`].map(annotateTerms)} /></article>
          </div>
        </section>
        <section><h2>失败时会怎样恢复</h2><div className="skill-failure-table">{guide.failures.map(([condition, response, recovery]) => <article key={condition}><h3>{annotateTerms(condition)}</h3><p><strong>系统反应：</strong>{annotateTerms(response)}</p><p><strong>恢复方式：</strong>{annotateTerms(recovery)}</p></article>)}</div></section>
        <div className="skill-detail-pair">
          <section><h2>输入</h2><StringList items={item.inputs.map(annotateTerms)} /></section>
          <section><h2>输出</h2><StringList items={item.outputs.map(annotateTerms)} /></section>
        </div>
        <section><h2>依赖</h2><StringList items={item.dependencies.map(annotateTerms)} /></section>
        <section><h2>验证状态</h2><p>六层证据分开显示。source 和 install 不会自动提升 current task、fresh task 或真实 E2E。</p><EvidenceGrid skill={item} /></section>
        <section><h2>证据时间与来源</h2><dl className="fact-grid"><div><dt>Observed at（观察时间）</dt><dd>{item.evidenceObservedAt}</dd></div><div><dt>Evidence basis（证据来源）</dt><dd>{item.evidenceBasis}</dd></div><div><dt>Snapshot（快照）</dt><dd>这表示本次核验事实；以后状态改变时由 material refresh 更新。</dd></div></dl></section>
        <section><h2>Canonical source</h2><div className="source-list"><div><code>{item.sourcePath}</code><p>该路径是维护源；用户目录中的发现入口不是第二份源码。</p></div></div></section>
        <SiteLink className="back-link" href={back}><ArrowLeft size={18} aria-hidden="true" />返回 Skills</SiteLink>
      </article>
    </div>
  );
}

function NotFound() {
  return <div className="page-frame not-found-page"><p className="section-kicker">404</p><h1>没有这个页面</h1><p>当前 MVP 只包含一个 .agents 项目、五份规则和已纳入的 Skills。</p><SiteLink href="/"><House size={18} aria-hidden="true" />返回项目</SiteLink></div>;
}

export default function Page() {
  const location = useLocationState();
  const path = location.pathname;
  useEffect(() => {
    const meta = routeMeta(path);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl(path));
  }, [path]);

  let content;
  if (path === "/") content = <HomePage />;
  else if (path === "/projects/agents") content = <ProjectPage />;
  else if (path.startsWith("/projects/agents/")) {
    const module = modules.find((item) => item.slug === path.split("/").at(-1));
    content = module ? <ProjectPage module={module} /> : <NotFound />;
  } else if (path === "/rules") content = <RulesPage search={location.search} />;
  else if (path === "/skills") content = <SkillsPage search={location.search} />;
  else if (path.startsWith("/skills/")) {
    const item = skills.find((candidate) => candidate.slug === path.split("/").at(-1));
    content = item ? <SkillDetail item={item} search={location.search} /> : <NotFound />;
  } else content = <NotFound />;

  return <><FlowField /><Header path={path} /><main id="main-content">{content}</main></>;
}
