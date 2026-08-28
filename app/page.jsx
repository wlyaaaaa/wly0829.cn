import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CaretRight,
  CheckCircle,
  EnvelopeSimple,
  GithubLogo,
  House,
  List,
  LockKey,
  TelevisionSimple,
  X,
  XLogo
} from "@phosphor-icons/react";
import {
  ideas,
  modules,
  normalizePath,
  primaryNav,
  project,
  routeMeta,
  routePaths,
  site,
  skills,
  socialLinks
} from "./site-content.js";

function isModifiedClick(event) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

function SiteLink({ href, onNavigate, children, ...props }) {
  const internal = href.startsWith("/");

  function navigateInternal() {
    const nextPath = normalizePath(href);
    if (normalizePath(window.location.pathname) !== nextPath) {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      window.scrollTo(0, 0);
    }
    onNavigate?.();
  }

  function handleClick(event) {
    props.onClick?.(event);
    if (
      event.defaultPrevented ||
      !internal ||
      event.button !== 0 ||
      isModifiedClick(event) ||
      props.target
    ) {
      return;
    }

    event.preventDefault();
    navigateInternal();
  }

  function handleKeyDown(event) {
    props.onKeyDown?.(event);
    if (!event.defaultPrevented && internal && !props.target && event.key === "Enter") {
      event.preventDefault();
      navigateInternal();
    }
  }

  return (
    <a href={href} {...props} onClick={handleClick} onKeyDown={handleKeyDown}>
      {children}
    </a>
  );
}

function SocialIcon({ name }) {
  const iconProps = { size: 19, weight: "regular", "aria-hidden": true };
  if (name === "github") return <GithubLogo {...iconProps} />;
  if (name === "bilibili") return <TelevisionSimple {...iconProps} />;
  if (name === "x") return <XLogo {...iconProps} />;
  return <EnvelopeSimple {...iconProps} />;
}

function navIsActive(href, path) {
  if (href === "/") return path === "/" || path.startsWith("/projects/");
  return path === href || path.startsWith(`${href}/`);
}

function Header({ path }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [path]);

  function handleMenuKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setMenuOpen((current) => !current);
    }
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div className="header-inner">
        <SiteLink className="brand" href="/" aria-label="返回吴乐阳首页">
          吴乐阳
        </SiteLink>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          onKeyDown={handleMenuKeyDown}
        >
          {menuOpen ? <X size={23} aria-hidden="true" /> : <List size={23} aria-hidden="true" />}
        </button>

        <div className={`header-navigation${menuOpen ? " is-open" : ""}`} id="site-navigation">
          <nav className="primary-nav" aria-label="主要导航">
            {primaryNav.map((item) => (
              <SiteLink
                className={navIsActive(item.href, path) ? "is-active" : undefined}
                href={item.href}
                key={item.href}
                aria-current={navIsActive(item.href, path) ? "page" : undefined}
              >
                {item.label}
              </SiteLink>
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
                <SocialIcon name={item.icon} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>吴乐阳 / WLY0829.CN</p>
      <div className="footer-links">
        <SiteLink href="/projects/agents">.agents</SiteLink>
        <SiteLink href="/skills">Skills</SiteLink>
        <SiteLink href="/ideas">想法</SiteLink>
      </div>
    </footer>
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

function PageLead({ eyebrow, title, children }) {
  return (
    <section className="page-lead" aria-labelledby="page-title">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 id="page-title">{title}</h1>
      {children ? <div className="page-intro">{children}</div> : null}
    </section>
  );
}

function HomePage() {
  const previewIdeas = ideas.slice(0, 3);
  return (
    <div className="page-frame home-page">
      <PageLead title="项目">
        <p>这里记录已经形成稳定方法、并且值得长期查阅的产品与工具。</p>
      </PageLead>

      <article className="featured-project" aria-labelledby="featured-project-title">
        <div className="project-title-row">
          <span className="project-mark" aria-hidden="true" />
          <h2 id="featured-project-title">{project.title}</h2>
        </div>

        <div className="project-summary">
          {project.summary.map((line) => (
            <p key={line}>{line.replaceAll("`", "")}</p>
          ))}
        </div>

        <div className="preview-row">
          <p className="preview-label">模块</p>
          <div className="preview-links module-preview-links">
            {modules.map((item) => (
              <SiteLink href={`/projects/agents/${item.slug}`} key={item.slug}>
                {item.shortTitle}
              </SiteLink>
            ))}
          </div>
        </div>

        <div className="preview-row">
          <p className="preview-label">相关想法</p>
          <div className="preview-links">
            {previewIdeas.map((item) => (
              <SiteLink href={`/ideas/${item.slug}`} key={item.slug}>
                {item.title}
              </SiteLink>
            ))}
          </div>
        </div>

        <SiteLink className="enter-link" href="/projects/agents">
          进入项目 <ArrowRight size={18} aria-hidden="true" />
        </SiteLink>
      </article>
    </div>
  );
}

function ProjectHeader() {
  return (
    <>
      <Breadcrumbs items={[{ label: "项目", href: "/" }, { label: ".agents" }]} />
      <section className="project-hero" aria-labelledby="project-title">
        <div className="project-hero-copy">
          <h1 id="project-title">
            <span className="title-accent" aria-hidden="true" />
            {project.title}
          </h1>
          <div className="project-hero-summary">
            {project.detailSummary.map((line) => (
              <p key={line}>{line.replaceAll("`", "")}</p>
            ))}
          </div>
        </div>

        <div className="repository-block">
          <a
            className="repository-link"
            href={project.repository.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LockKey size={19} aria-hidden="true" />
            {project.repository.label}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <p>{project.repository.note}</p>
        </div>
      </section>
    </>
  );
}

function ProjectNavigation({ currentSlug }) {
  return (
    <nav className="project-navigation" aria-label=".agents 模块导航">
      <SiteLink
        className={!currentSlug ? "is-current" : undefined}
        href="/projects/agents"
        aria-current={!currentSlug ? "page" : undefined}
      >
        总览
      </SiteLink>
      {modules.map((item) => (
        <SiteLink
          className={currentSlug === item.slug ? "is-current" : undefined}
          href={`/projects/agents/${item.slug}`}
          key={item.slug}
          aria-current={currentSlug === item.slug ? "page" : undefined}
        >
          {item.shortTitle}
        </SiteLink>
      ))}
    </nav>
  );
}

function RelatedIdeas({ slugs = ideas.slice(0, 4).map((item) => item.slug) }) {
  const entries = slugs.map((slug) => ideas.find((idea) => idea.slug === slug)).filter(Boolean);
  return (
    <aside className="related-panel" aria-labelledby="related-ideas-title">
      <h2 id="related-ideas-title">相关想法</h2>
      <div className="related-links">
        {entries.map((item) => (
          <SiteLink href={`/ideas/${item.slug}`} key={item.slug}>
            <span>{item.title}</span>
            <CaretRight size={17} aria-hidden="true" />
          </SiteLink>
        ))}
      </div>
      <SiteLink className="all-link" href="/ideas">
        查看全部想法 <ArrowRight size={17} aria-hidden="true" />
      </SiteLink>
    </aside>
  );
}

function ProjectOverview() {
  return (
    <article className="document-content overview-content">
      <section className="document-section document-section-first">
        <p className="section-kicker">这个项目解决什么</p>
        <h2>让个人 AI 工作长期保持可控，而不是每次重新约定。</h2>
        <p>
          `.agents` 负责跨项目都需要的行为规则、能力选择、授权边界和完成方法。它不替具体项目做产品决定，也不储存个人材料；它提供的是一套稳定的工作方式，让不同任务知道从哪里读事实、怎样安全推进、什么证据才算完成。
        </p>
      </section>

      <section className="document-section">
        <h2>整体怎么工作</h2>
        <ol className="number-list">
          <li><span>1</span><div><strong>先确定目标与规则。</strong><p>从当前项目最近的规则开始，确认用户目标、硬边界和真正的事实 owner。</p></div></li>
          <li><span>2</span><div><strong>选择能力与执行方式。</strong><p>根据风险、可逆性和净收益决定直接处理、读取 Skill、调用工具或委派原生代理。</p></div></li>
          <li><span>3</span><div><strong>绑定授权与责任。</strong><p>外部 effect 使用精确授权，写入 scope 由执行 Owner 认领；并发只串行真正冲突的部分。</p></div></li>
          <li><span>4</span><div><strong>用独立证据收口。</strong><p>源码、测试、安装、发布、fresh task 与用户可见路径分别验证，缺一层就保留真实缺口。</p></div></li>
        </ol>
      </section>

      <section className="document-section">
        <h2>六个模块</h2>
        <div className="module-index">
          {modules.map((item, index) => (
            <SiteLink href={`/projects/agents/${item.slug}`} key={item.slug}>
              <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="module-index-copy">
                <strong>{item.title}</strong>
                <span>{item.teaser}</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </SiteLink>
          ))}
        </div>
      </section>

      <section className="document-section">
        <h2>模块关系</h2>
        <p>
          规则与合同先给出共同边界；能力路由选择方法；授权与执行 Owner 把方法绑定到允许的动作和施工责任；受保护策略为重大动作提供可信活动规则；Skills / Plugins 供应窄能力；上下文与证据模块最后判断用户可见结果是否成立。
        </p>
        <p>这是一条责任链，不是一条必须逐项执行的流水线。简单、低风险任务可以直接完成；只有当前问题真正触发某个模块时才进入它。</p>
      </section>

      <section className="document-section boundary-section">
        <h2>公开边界</h2>
        <p>
          本站详细介绍模块、合同、源码入口、工具职责和测试方式，但不发布密码、Token、密钥、私人聊天与个人证据，也不展示没有稳定阅读价值的动态代际、hash、ledger 或 nonce。
        </p>
        <div className="boundary-note">
          <LockKey size={20} aria-hidden="true" />
          <div>
            <strong>.agents 是私有仓库</strong>
            <p>链接用于已登录且有权限的 GitHub 用户；其他访客可能看到 404，这不代表本站页面失效。</p>
          </div>
        </div>
      </section>
    </article>
  );
}

function SimpleList({ items, ordered = false }) {
  const Component = ordered ? "ol" : "ul";
  return (
    <Component className={ordered ? "plain-list ordered-list" : "plain-list"}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </Component>
  );
}

function ModuleDetail({ module }) {
  const currentIndex = modules.findIndex((item) => item.slug === module.slug);
  const previous = modules[currentIndex - 1];
  const next = modules[currentIndex + 1];
  return (
    <article className="document-content module-detail">
      <header className="module-heading">
        <p className="section-kicker">当前模块</p>
        <h2>{module.title}</h2>
      </header>

      <section className="problem-callout">
        <p className="section-kicker">解决什么</p>
        <p>{module.problem}</p>
      </section>

      <section className="document-section">
        <h2>具体做什么</h2>
        <SimpleList items={module.actions} ordered />
      </section>

      <section className="document-section">
        <h2>为什么这样设计</h2>
        <p>{module.rationale}</p>
      </section>

      <section className="document-section">
        <h2>边界在哪里</h2>
        <SimpleList items={module.boundaries} />
      </section>

      <section className="document-section">
        <h2>关键入口</h2>
        <div className="source-list">
          {module.sources.map((source) => (
            <div key={source.path}>
              <code>{source.path}</code>
              <p>{source.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="document-section">
        <h2>如何验证</h2>
        <SimpleList items={module.tests} />
      </section>

      <section className="document-section">
        <h2>与其他模块的关系</h2>
        <p>{module.relation}</p>
      </section>

      <nav className="document-pagination" aria-label="模块前后导航">
        {previous ? (
          <SiteLink href={`/projects/agents/${previous.slug}`}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span><small>上一个模块</small>{previous.shortTitle}</span>
          </SiteLink>
        ) : <span />}
        {next ? (
          <SiteLink href={`/projects/agents/${next.slug}`}>
            <span><small>下一个模块</small>{next.shortTitle}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </SiteLink>
        ) : null}
      </nav>
    </article>
  );
}

function ProjectPage({ module }) {
  return (
    <div className="page-frame project-page">
      <ProjectHeader />
      <div className="project-layout">
        <ProjectNavigation currentSlug={module?.slug} />
        {module ? <ModuleDetail module={module} /> : <ProjectOverview />}
        <RelatedIdeas slugs={module?.ideaSlugs} />
      </div>
    </div>
  );
}

function IdeasPage() {
  return (
    <div className="page-frame directory-page">
      <PageLead eyebrow="Notes" title="想法">
        <p>这些不是口号，而是从长期 AI 工作中抽出的设计判断。每一条都说明它解决什么、怎样使用，以及不适用在哪里。</p>
      </PageLead>
      <div className="directory-list idea-directory">
        {ideas.map((idea, index) => (
          <SiteLink href={`/ideas/${idea.slug}`} key={idea.slug}>
            <span className="directory-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="directory-copy">
              <strong>{idea.title}</strong>
              <span>{idea.summary}</span>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </SiteLink>
        ))}
      </div>
    </div>
  );
}

function IdeaDetailPage({ idea }) {
  const related = idea.relatedModules.map((slug) => modules.find((item) => item.slug === slug)).filter(Boolean);
  return (
    <div className="page-frame detail-page">
      <Breadcrumbs items={[{ label: "想法", href: "/ideas" }, { label: idea.title }]} />
      <article className="standalone-document">
        <header>
          <p className="eyebrow">Idea</p>
          <h1>{idea.title}</h1>
          <p className="standfirst">{idea.summary}</p>
        </header>
        <section><h2>定义</h2><p>{idea.definition}</p></section>
        <section><h2>解决的问题</h2><p>{idea.problem}</p></section>
        <section><h2>实际用途</h2><SimpleList items={idea.use} /></section>
        <section><h2>设计依据</h2><p>{idea.basis}</p></section>
        <section><h2>边界</h2><p>{idea.boundary}</p></section>
        <section className="related-modules-section">
          <h2>在 .agents 中对应</h2>
          <div className="inline-links">
            {related.map((module) => (
              <SiteLink href={`/projects/agents/${module.slug}`} key={module.slug}>
                {module.title} <ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
            ))}
          </div>
        </section>
        <SiteLink className="back-link" href="/projects/agents">
          <ArrowLeft size={17} aria-hidden="true" /> 返回 .agents 项目
        </SiteLink>
      </article>
    </div>
  );
}

function SkillsPage() {
  return (
    <div className="page-frame directory-page skills-page">
      <PageLead eyebrow="Codex Skills" title="Skills">
        <p>
          这是现行个人 Codex Skills 的只读目录。Skill 是处理特定需求的窄入口，不是项目、等级或能力排名；只有触发条件成立时才进入对应方法。
        </p>
      </PageLead>
      <div className="skill-directory">
        {skills.map((skill) => (
          <SiteLink href={`/skills/${skill.slug}`} key={skill.slug}>
            <BookOpenText size={22} aria-hidden="true" />
            <span className="directory-copy">
              <strong>{skill.title}</strong>
              <span>{skill.summary}</span>
            </span>
            <ArrowRight size={19} aria-hidden="true" />
          </SiteLink>
        ))}
      </div>
    </div>
  );
}

function SkillDetailPage({ skill }) {
  return (
    <div className="page-frame detail-page">
      <Breadcrumbs items={[{ label: "Skills", href: "/skills" }, { label: skill.title }]} />
      <article className="standalone-document skill-document">
        <header>
          <p className="eyebrow">Codex Skill</p>
          <h1>{skill.title}</h1>
          <p className="standfirst">{skill.summary}</p>
        </header>
        <section><h2>解决什么</h2><p>{skill.purpose}</p></section>
        <section><h2>什么时候使用</h2><p>{skill.trigger}</p></section>
        <section><h2>为什么单独成 Skill</h2><p>{skill.why}</p></section>
        <section><h2>边界</h2><p>{skill.boundary}</p></section>
        <aside className="skill-note">
          <CheckCircle size={21} aria-hidden="true" />
          <p>本页只介绍公开安全的用途与边界，不包含私人正文、机器路径、凭据或运行状态。</p>
        </aside>
        <SiteLink className="back-link" href="/skills">
          <ArrowLeft size={17} aria-hidden="true" /> 返回 Skills 目录
        </SiteLink>
      </article>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page-frame not-found-page">
      <p className="eyebrow">Error / 404</p>
      <h1>这里没有这页。</h1>
      <p>地址可能已经变化，也可能从未存在。可以回到首页，或直接进入唯一项目。</p>
      <div className="not-found-actions">
        <SiteLink href="/"><House size={18} aria-hidden="true" />返回首页</SiteLink>
        <SiteLink href="/projects/agents">查看 .agents<ArrowRight size={18} aria-hidden="true" /></SiteLink>
      </div>
    </div>
  );
}

function resolveRoute(path) {
  if (path === "/") return <HomePage />;
  if (path === "/projects/agents") return <ProjectPage />;
  if (path.startsWith("/projects/agents/")) {
    const module = modules.find((item) => path === `/projects/agents/${item.slug}`);
    if (module) return <ProjectPage module={module} />;
  }
  if (path === "/ideas") return <IdeasPage />;
  if (path.startsWith("/ideas/")) {
    const idea = ideas.find((item) => path === `/ideas/${item.slug}`);
    if (idea) return <IdeaDetailPage idea={idea} />;
  }
  if (path === "/skills") return <SkillsPage />;
  if (path.startsWith("/skills/")) {
    const skill = skills.find((item) => path === `/skills/${item.slug}`);
    if (skill) return <SkillDetailPage skill={skill} />;
  }
  return <NotFoundPage />;
}

function applyRouteMetadata(path) {
  const meta = routeMeta(path);
  document.title = meta.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", meta.description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `${site.url}${path === "/" ? "/" : path}`);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${site.url}${path === "/" ? "/" : path}`);
}

export default function Page() {
  const initialPath = useMemo(() => normalizePath(window.location.pathname), []);
  const [path, setPath] = useState(initialPath);

  useEffect(() => {
    function syncPath() {
      setPath(normalizePath(window.location.pathname));
      window.scrollTo(0, 0);
    }
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => applyRouteMetadata(path), [path]);

  return (
    <div className="site-shell" data-route-known={routePaths.includes(path)}>
      <Header path={path} />
      <main id="main-content">{resolveRoute(path)}</main>
      <Footer />
    </div>
  );
}
