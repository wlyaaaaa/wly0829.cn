import SignalField from "./signal.jsx";
import { navLinks, projects, socialLinks } from "./site-content.js";

export default function Page() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="返回吴乐阳个人主页首页">
          <span>WLY</span>
          <span className="wordmark-index">/ 个人主页</span>
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
            <p className="eyebrow">WLY / 00</p>
            <h1 id="site-title">
              写点工具，
              <br />
              也记录一些想法<span className="accent-dot">。</span>
            </h1>
            <p className="intro">
              这里放我自己做的项目和偶尔想清楚的东西。主要是 AI、Windows，
              还有一些为了解决实际问题写的小工具。
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#projects">
                看看项目 <span aria-hidden="true">↓</span>
              </a>
              <a className="text-action" href="mailto:hello@wly0829.cn">
                发封邮件 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <SignalField />
        </section>

        <section className="projects" id="projects" aria-labelledby="projects-title">
          <div className="section-heading-wide">
            <div>
              <p className="eyebrow">Projects / 01</p>
              <h2 id="projects-title">最近做的东西</h2>
            </div>
            <p>下面这些都来自公开仓库，也都是我自己实际做过、用过的项目。</p>
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
              <p className="eyebrow">Contact / 02</p>
              <h2 id="contact-title">有想法、有问题，或者只是想聊聊，都可以发邮件。</h2>
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
