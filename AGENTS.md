# wly0829.cn project rules

This repository is public. Every tracked file must be suitable for an unknown
visitor to read, clone and quote. The website itself is primarily the owner's
read-only operating panel; public presentation is secondary.

## Product boundary

- This is a read-only personal project, rules and capabilities panel. It is not
  a resume, marketing landing page, activity feed, admin console or repository
  browser.
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

- Never track credentials, tokens, private evidence, personal case material,
  machine-specific paths, private conversations or internal career packaging.
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

## Project-local evidence

- Design briefs, comparison screenshots, review notes and machine-path evidence
  stay in `docs/design/` or root `design-qa.md`; both are ignored local files.
- Product Design QA may update those local files, but public commits contain
  only the resulting product and public-safe documentation.

## Verification and publication

- Preserve the existing React, Vite and GitHub Pages route-generation chain.
- Verify build, direct routes, custom 404, keyboard navigation, desktop/mobile
  overflow and browser console before normal-pushing `main`.
- Public completion requires local HEAD, remote `main` and the Pages deployment
  commit to match.
