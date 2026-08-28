import SignalField from "./signal.jsx";
import { navLinks, privateIdeas, projects, socialLinks } from "./site-content.js";

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
              吴乐阳<span className="accent-dot">。</span>
            </h1>
            <p className="intro">
              公开仓库可以直接点开，没公开的只放介绍。
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
              <h2 id="projects-title">做过的东西</h2>
            </div>
            <p>有些已经做出来了，有些还在继续折腾。</p>
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
                  <p className="project-question">{project.question}</p>
                  <p className="project-outcome">{project.outcome}</p>
                </div>
                <ul className="tag-list" aria-label={`${project.title} 技术关键词`}>
                  {project.stack.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <span className="project-link">查看 GitHub <span aria-hidden="true">↗</span></span>
              </a>
            ))}
          </div>
        </section>

        <section className="private-work" id="private" aria-labelledby="private-title">
          <div className="section-heading-wide">
            <div>
              <p className="eyebrow">Private / 02</p>
              <h2 id="private-title">没公开的东西</h2>
            </div>
            <p>这里只写它们在做什么，不放源码和私下内容。</p>
          </div>

          <div className="idea-grid">
            {privateIdeas.map((idea) => (
              <article className={`idea-card idea-card-${idea.shape}`} key={idea.number}>
                <div className="idea-topline">
                  <span>{idea.number}</span>
                  <span>{idea.status}</span>
                </div>
                <div className="idea-copy">
                  <h3>{idea.title}</h3>
                  <p className="idea-question">{idea.question}</p>
                  <p className="idea-outcome">{idea.outcome}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="learning-note" aria-label="我怎么用 AI 学习">
            <p className="eyebrow">Learning note</p>
            <p>
              我用 AI 学习时，会先让它准备一份终稿，再自己用语音讲一遍；
              下一次只补没讲清的地方。
            </p>
          </aside>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-panel">
            <div>
              <p className="eyebrow">Contact / 03</p>
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
