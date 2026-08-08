import SignalField from "./signal.jsx";
import { externalLinks, shelves } from "./site-content.js";

export default function Page() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="./" aria-label="个人实验场首页">
          <span>个人实验场</span>
          <span className="wordmark-index">/ 00</span>
        </a>
        <div className="topbar-actions">
          <nav className="external-links" aria-label="外部链接">
            {externalLinks.map((link) => (
              <a
                aria-label={`${link.label}（在新窗口打开）`}
                className="external-link"
                href={link.href}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <span className="live-state" role="status">
            <span aria-hidden="true" />
            框架已就绪
          </span>
        </div>
      </header>

      <section className="hero" aria-labelledby="site-title">
        <div className="hero-copy">
          <p className="eyebrow">个人实验场 / 00</p>
          <h1 id="site-title">
            先搭一块，
            <br />
            可以生长的地方<span className="accent-dot">。</span>
          </h1>
          <p className="intro">
            实验、记录和偶尔做成的小东西，以后再慢慢放进来。
          </p>
          <div className="hero-status" aria-label="当前状态">
            <span>结构 / <strong>已就绪</strong></span>
            <span>内容 / <strong>待发生</strong></span>
          </div>
        </div>

        <SignalField />
      </section>

      <section className="index" aria-labelledby="index-title">
        <div className="section-heading">
          <h2 id="index-title">开放索引</h2>
          <p>三个位置，暂时保持空白。</p>
        </div>

        <div className="shelf-grid">
          {shelves.map((shelf) => (
            <article className="shelf" key={shelf.number}>
              <div className="shelf-topline">
                <span>{shelf.number}</span>
              </div>
              <div className="shelf-body">
                <h2>{shelf.title}</h2>
              </div>
              <div className="empty-state">
                <span aria-hidden="true" />
                <span>{shelf.state}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p><span aria-hidden="true">—</span> 保持好奇，慢慢搭建。</p>
      </footer>
    </main>
  );
}
