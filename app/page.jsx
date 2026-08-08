import SignalField from "./signal.jsx";

const shelves = [
  {
    number: "01",
    mark: "LAB",
    title: "Experiments",
    note: "Prototypes, model behavior and ideas worth testing."
  },
  {
    number: "02",
    mark: "LOG",
    title: "Field notes",
    note: "Short observations from building and learning."
  },
  {
    number: "03",
    mark: "SHIP",
    title: "Small tools",
    note: "Useful things that have earned a public address."
  }
];

export default function Page() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="./" aria-label="wly0829.cn home">
          <span className="wordmark-dot" aria-hidden="true" />
          <span>wly0829.cn</span>
        </a>
        <div className="topbar-meta" aria-label="site status">
          <span>Public workbench</span>
          <span className="live-state">
            <span aria-hidden="true" /> live
          </span>
        </div>
      </header>

      <section className="hero" aria-labelledby="site-title">
        <div className="hero-copy">
          <p className="eyebrow">A PERSONAL SURFACE / FRAME 00</p>
          <h1 id="site-title">
            Things begin
            <br />
            <em>as signals.</em>
          </h1>
          <p className="intro">
            A quiet frame for experiments, notes and small things that work.
          </p>
          <div className="hero-status" aria-label="current state">
            <span>FRAME / READY</span>
            <span>CONTENTS / OPEN</span>
          </div>
        </div>

        <SignalField />
      </section>

      <section className="index" aria-labelledby="index-title">
        <div className="section-heading">
          <p className="eyebrow" id="index-title">
            OPEN INDEX
          </p>
          <p>Three shelves, intentionally empty.</p>
        </div>

        <div className="shelf-grid">
          {shelves.map((shelf) => (
            <article className="shelf" key={shelf.mark}>
              <div className="shelf-topline">
                <span>{shelf.number}</span>
                <span>{shelf.mark}</span>
              </div>
              <div className="shelf-body">
                <h2>{shelf.title}</h2>
                <p>{shelf.note}</p>
              </div>
              <div className="empty-state">
                <span aria-hidden="true" />
                <span>NO ENTRIES YET</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Structure first. Everything else can arrive later.</p>
        <p className="footer-coordinate">FRAME / PUBLIC</p>
      </footer>
    </main>
  );
}
