# wly0829.cn project rules

This repository is public. Every tracked file must be suitable for an unknown
visitor to read, clone and quote. The website itself is primarily the owner's
read-only operating panel; public presentation is secondary.

## Product boundary

- This is a read-only personal project, rules and capabilities panel. It is not
  a resume, marketing landing page, activity feed, admin console or repository
  browser.
- The owner is the primary reader. Do not optimize information density, wording
  or project selection for recruiters, salary negotiation or external
  persuasion. A public visitor may read the same material, but the panel must
  first let the owner recover the complete operating picture.
- Project entries are maintained in `config/panel-projects.json`. The current
  MVP has one entry, but the registry is designed for many projects. `.agents`
  always has order 1.
- A registry entry defaults to `real_dashboard`: publish dense, current facts,
  architecture, failures and evidence. Only a project explicitly designated by
  the owner as `curated_packaging` may use packaging copy or exclusions.
- The website source project is infrastructure for the presentation layer and
  never appears as one of the projects being presented.
- Public copy stays vendor-neutral. Describe reusable AI workflow and harness
  concepts without naming one assistant product or compatibility harness as
  the site's identity.
- Accuracy and owner usefulness outrank persuasion. Do not hide current rules,
  generations, limitations, evidence gaps or implementation state merely to
  make the site look cleaner or stronger.
- Do not impose word targets or maximum lengths on reference pages. Content is
  complete only when the owner can reconstruct the subject without another
  conversation or private memory.
- Project index pages start with real content. Do not repeat the active top
  navigation as a large page title and explanatory paragraph.
- A project card is one clickable unit. Show its public/private status at the
  top right; do not add a separate “enter project” button.
- The desktop project index uses a two-column grid sized for four cards in the
  first viewport and continues vertically. Mobile uses one column sized for
  roughly two cards in the first viewport.
- Use official brand marks from a maintained icon library for external social
  links. Do not approximate brand logos with generic UI icons.
- Do not add a decorative footer that only repeats the owner's name or domain.
- The white background may use a fixed canvas of slowly moving parallel
  hairlines. Motion must be visible within a short observation while remaining
  readable. Curves stay smooth; no particles, radial bursts, pointer dents,
  sharp peaks, glows or decorative technology wallpaper.
- Respect reduced-motion preferences and keep page content independently
  scrollable above the background.

## Public-content gate

- Never track credential values: passwords, private keys, access tokens,
  recovery secrets, authentication codes or equivalent reusable secret
  material. Detecting one must fail the public build instead of merely hiding
  it in the interface.
- Do not remove technical paths, identifiers, hashes, generation facts,
  implementation details, failure evidence or operating limitations merely
  because the repository is public. This panel is allowed to be technically
  complete. Unrelated sensitive personal domains such as litigation are
  outside this MVP rather than silently generalized into public content.
- Do not expose project-retirement bookkeeping. A selected older project may
  describe its enduring product idea and what was actually built, without
  publishing internal lifecycle labels or implying untrue current operation.
- If a learning product is ever selected, describe only its learning method,
  product design and implementation. Do not expose career or offer strategy.
- Detail pages are durable reference documents, not one-line marketing cards.
  They should explain product intent, real scenarios, information flow,
  architecture, important decisions, boundaries, failure handling and
  verification in professional plain language.
- A reasonable design that has not been implemented may be documented as a
  design, but must not be presented as a verified production result. Never
  package an unfinished fact as completed.
- There is no standalone Ideas directory in the current information
  architecture. Project-specific judgments live with the project/module that
  gives them context.
- `/rules` is one rules workbench. It shows the active generation and exactly
  five current rules through an in-page selector; do not create rule detail
  routes.

## MVP expansion gate

- The MVP contains exactly one project: `.agents`, plus the one-page Rules
  workbench and the current public-safe Skills catalog.
- “Skills” means the owner's personal usable capability catalog, not a catalog
  owned by one assistant product. It may include both personally maintained
  Skills and high-value externally supplied Skills that are genuinely available
  to the owner.
- Inclusion never implies authorship. Use public-safe provenance such as
  “personally maintained” or “integrated capability” when provenance matters,
  while keeping product-facing names and explanations vendor-neutral.
- Display an integrated Skill only when it is currently usable, materially
  valuable, sufficiently understood, non-duplicative and safe to publish.
- Finish content before breadth. `.agents` overview and all six modules, all
  five current rules, and every displayed Skill must let the owner reconstruct
  the subject, its current state, technical design, operating flow, boundaries,
  failures and verification without another conversation.
- Do not add a second project, placeholder project, future-project card or
  project-navigation category until the owner has reviewed and accepted those
  three MVP content areas.
- UI completion, route existence and concise summaries do not satisfy the MVP
  content gate.
- Before changing public project selection or copy, read
  `docs/design/private-content-rules.md` when that local-only file exists. It
  may add stricter exclusions and must never be staged.
- `docs/design/private-content-rules.md` is the only project document that stays
  outside Git. Product specifications, content principles, maintenance policy,
  the project registry and the current `design-qa.md` are maintained in Git.

## Project-local evidence

- Design briefs, current content principles and `design-qa.md` are maintained
  project documentation and are tracked. Reproducible comparison screenshots
  remain ignored under `docs/design/qa/` to avoid binary history bloat.
- Product Design QA updates `design-qa.md` with current evidence references and
  final status; stale prior QA is replaced rather than accumulated.

## Refresh model

- This is a continuously maintainable panel with manual, user-requested
  refreshes. It is neither an immutable one-time snapshot nor an automatically
  synchronized monitoring service.
- The published site represents the last explicitly refreshed and released
  state. Generation identity is the version boundary; do not claim background
  freshness, watchers or scheduled synchronization.
- Content construction should provide one fast local refresh path that reads
  the current owners, regenerates public-safe structured content, validates it,
  and uses the existing normal publication chain only when the user asks.
- Snapshot generation always performs a live source fetch, requires the exact
  canonical `.agents` root to be clean and equal to `origin/main`, and writes a
  payload commitment. Build verifies that commitment plus the generation,
  five-rule and selected-Skill bindings before producing public files; there is
  no offline or alternate-source write mode.
- Do not add a daemon, watcher, scheduled task, polling service or public live
  dependency merely to keep the panel current.
- Cross-project refresh is event-driven and thresholded. A matching changed path
  is only an impact candidate; create a fresh independent website task only when
  the source task has determined that a displayed fact, explanation, boundary,
  maturity or user decision would otherwise become materially wrong. Small
  refactors, timestamps, formatting, blocked candidates and hash-only drift may
  wait for the next material refresh.
- Before publishing a refreshed snapshot, inspect the current source owners for
  contradictions and broken validation paths. Repair safe, in-scope defects
  through their real owner when possible; publish the repaired state. Defects
  that cannot be repaired in the same goal remain visible as named gaps.

## Subagent discipline

- A subagent receives exactly one bounded goal. Never reuse a completed,
  interrupted or failed subagent for a second goal.
- Create a fresh subagent when another independent goal has positive parallel
  value. Subagents remain read-only unless their single goal explicitly owns a
  named implementation scope; the root agent integrates the website and runs
  the final audit.

## Verification and publication

- Preserve the existing React, Vite and GitHub Pages route-generation chain.
- Verify build, direct routes, custom 404, keyboard navigation, desktop/mobile
  overflow and browser console before normal-pushing `main`.
- The public-content gate scans every tracked/unignored source file and every
  production artifact regardless of extension. Directory-route canonical,
  Open Graph and sitemap URLs use the trailing-slash URL that Pages serves as
  `200`, not the redirecting form.
- Public completion requires local HEAD, remote `main` and the Pages deployment
  commit to match.
