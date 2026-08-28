import SignalField from "./signal.jsx";
import { navLinks, principles, projects, socialLinks } from "./site-content.js";

export default function Page() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="返回吴乐阳个人网站首页">
          <span>WLY</span>
          <span className="wordmark-index">/ AI 产品与应用</span>
        </a>
        <nav className="external-links" aria-label="主要导航">
          {navLinks.map((link) => (
            <a
              aria-label={link.ariaLabel}
              className="external-link"
              href={link.href}
              key={link.label}
              rel={link.newWindow ? "noopener noreferrer" : undefined}
              target={link.newWindow ? "_blank" : undefined}
            >
              {link.label}
              {link.newWindow ? <span aria-hidden="true">↗</span> : null}
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content">
      <section className="hero" aria-labelledby="site-title">
        <div className="hero-copy">
          <p className="eyebrow">AI Tech Product × Applied AI</p>
          <h1 id="site-title">
            把 AI 想法
            <br />
            判断清楚，也把
            <br />
            应用真正做出来<span className="accent-dot">。</span>
          </h1>
          <p className="intro">
            我一边做 AI 产品，一边做 AI 应用研发，关注 Agent、RAG、评测与系统集成。
            先把问题和成功标准说清楚，再把产品做进真实流程，用实际结果收尾。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#projects">
              看公开项目 <span aria-hidden="true">↓</span>
            </a>
            <a className="text-action" href="mailto:hello@wly0829.cn">
              聊一个想法 <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="hero-status" aria-label="工作重点">
            <span>判断 / <strong>问题与边界</strong></span>
            <span>实现 / <strong>Agent · RAG · 集成</strong></span>
            <span>验收 / <strong>真实任务回读</strong></span>
          </div>
        </div>

        <SignalField />
      </section>

      <section className="thinking" id="thinking" aria-labelledby="thinking-title">
        <div className="section-heading section-heading-wide">
          <div>
            <p className="eyebrow">Product Thinking / 01</p>
            <h2 id="thinking-title">我的判断方式</h2>
          </div>
          <p>
            不是从“要不要做 Agent”开始，
            <br />
            而是从任务是否值得这份复杂度开始。
          </p>
        </div>

        <div className="principle-grid">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <span className="card-index">{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects" id="projects" aria-labelledby="projects-title">
        <div className="section-heading section-heading-wide">
          <div>
            <p className="eyebrow">Public Work / 02</p>
            <h2 id="projects-title">公开实践</h2>
          </div>
          <p>
            只展示公开仓库里的真实项目。
            <br />
            不拿企业、私有或假想案例填满页面。
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              aria-label={`在新窗口查看 ${project.title}`}
              className="project-card"
              href={project.href}
              key={project.number}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="project-topline">
                <span>{project.number}</span>
                <span>{project.category}</span>
              </div>
              <div className="project-copy">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <ul className="tag-list" aria-label={`${project.title} 技术关键词`}>
                {project.stack.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <span className="project-link">查看 GitHub <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-panel">
          <div>
            <p className="eyebrow">Contact / 03</p>
            <h2 id="contact-title">
              产品、技术，或者一个还没成形的点子，
              <br />
              都可以找我聊。
            </h2>
          </div>
          <div className="contact-actions">
            <a href="mailto:hello@wly0829.cn">
              hello@wly0829.cn <span aria-hidden="true">→</span>
            </a>
            <a href="https://github.com/wlyaaaaa" rel="noopener noreferrer" target="_blank">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
      </main>

      <footer className="footer">
        <p>吴乐阳 / WLY0829.CN</p>
        <nav aria-label="其他个人主页">
          {socialLinks.map((link) => (
            <a
              aria-label={link.ariaLabel}
              href={link.href}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
