# wly0829.cn MVP rebuild

status: active

## Goal

Rebuild the website from current owner sources so it is the owner's detailed,
plain-language, professional, read-only operating panel for `.agents`, the five
active rules and the current usable Skills catalog.

The prior website copy is not an input. Existing code may be reused only as UI
infrastructure after its content is removed.

## Hard boundaries

- MVP contains exactly one project: `.agents`.
- MVP is not the long-term project-count limit. Future projects are added to
  `config/panel-projects.json`; `.agents` keeps order 1.
- Top-level information areas are Project, Rules and Skills.
- No Ideas area, website-self project, future placeholders, career marketing or
  salary-oriented copy.
- Public content may include detailed architecture, paths, hashes, versions,
  failures and verification evidence.
- Passwords, keys, tokens, recovery secrets and other credential values never
  enter generated data, source, bundles or HTML.
- Litigation and other unrelated sensitive personal projects are out of scope.
- One fresh subagent has one goal. Never reuse it for another goal.
- All product and maintenance documents are tracked except
  `docs/design/private-content-rules.md`, the sole packaging/exclusion document.

## Source hierarchy

1. Current AuthorityHost status and the five files from one verified active
   generation for live rule state.
2. Canonical `.agents` source on its real default branch for product design,
   Skills supply, tools and tests.
3. GitHub live repository metadata for repository identity and remote state.
4. Current tests and real entrypoint readback for implementation evidence.
5. Editorial explanations derived from those facts; never the other way round.

## Product acceptance

- The project overview reconstructs responsibility, architecture, workflows,
  current state, known gaps, recovery and evidence without another chat.
- Each of the five rules has a plain-language reading layer and a complete
  technical layer on one rules workbench.
- Every displayed Skill explains what it is for, when to use it, when not to use
  it, its inputs and outputs, workflow, dependencies, boundaries, failure and
  verification state.
- Search and navigation work by keyboard and touch; long reference pages remain
  readable on mobile.
- The white-and-green full-page background visibly moves without moving the
  content, and respects reduced-motion settings.
- Build, direct routes, custom 404, desktop/mobile overflow, console and public
  deployment all pass.

## Snapshot rule

The published website is the last explicitly refreshed and published state.
Source defects discovered before generation are repaired through their real
owner when safe and verifiable. Remaining defects are shown as gaps with the
evidence date; no all-green summary may hide them.

Cross-project refresh is event-driven and thresholded. A path or generation
change is only an impact candidate. A fresh independent website task is created
only when the source Owner confirms that a displayed fact, explanation,
boundary, maturity or user decision would materially become wrong. Small or
already-accurately-disclosed changes wait for the next material refresh.
