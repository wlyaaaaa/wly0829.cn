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
  target has ten enabled entries: `.agents`, PCConfig, GitHub 总索引,
  ChineseASR, TimeAudit, PC Panel Hub, CACB, the curated learning method,
  Codex Remote and personal-health in order 1/2/3/4/5/6/7/8/9/10. The registry
  remains extensible, and `.agents` always has order 1. Each project owns its
  real module count and module boundaries; visual symmetry is never a reason to
  force every project into the same number of modules.
- A registry entry defaults to `real_dashboard`: publish dense, current facts,
  architecture, failures and evidence. Only a project explicitly designated by
  the owner as `curated_packaging` may use packaging copy or exclusions. A
  curated project may also be `manual_owner_only`: only an explicit owner request
  can refresh it; source, rule and Skill events never create a website task.
- The website source project is infrastructure for the presentation layer and
  never appears as one of the projects being presented.
- The site's overall identity stays platform-neutral: no one assistant product,
  runtime wrapper or compatibility layer defines the whole panel. This is not
  permission to euphemize a selected project's real identity. Name the actual
  product, platform and public repository when they make the project clearer;
  `Codex Remote`, 微信 and `WeChatDirect` may therefore be stated directly.
  Accuracy remains the primary product requirement. Product names, platform
  labels and otherwise public-safe paths or identifiers are not sensitive
  merely because of their wording and must not be replaced by euphemisms. Only
  actual values with positive L3+ evidence enter the global
  personal-data review; reusable credential values remain forbidden. When one
  exact value is withheld, retain the component's public-safe identity, state,
  role, drive/location class, selected configuration, migration relation,
  evidence and decision impact.
- Accuracy and owner usefulness outrank persuasion. Do not hide current rules,
  generations, limitations, evidence gaps or implementation state merely to
  make the site look cleaner or stronger.
- `professional_detailed_plain_language` means professional depth and plain
  language must exist together; it never means removing technical detail or
  replacing it with a short marketing summary. Every project, module, rule and
  Skill page must begin with a reader layer that a person unfamiliar with the
  system can understand before the technical reference layer starts.
- The reader layer must answer, in this order: what this thing actually does for
  the owner; what concrete problem or accident it prevents; one realistic
  example using an ordinary request; what the owner receives at the end; and
  what happens when the check passes, finds a problem, or cannot run. Only
  after those answers may the page present triggers, inputs, outputs,
  architecture, commands, schemas, hashes, evidence and recovery details.
- Every project detail page uses three reading layers: `速览`, `产品` and
  `技术`. They are a content priority and reading order, not three
  copies of the same prose, three network loads or a fixed module count.
  `速览` owns the product essence, the problem, one ordinary example, the
  result, the project's deliberate choices and its most important boundary.
  `产品` owns natural requests, realistic flows, success/problem/
  unavailable behavior, product principles and visual results when they help.
  `技术` owns current snapshots, exact models and versions, architecture,
  commands, schemas, hashes, source/test/runtime/publish evidence, failures,
  recovery and evolution. Existing module routes remain the deep technical
  reference instead of becoming a second product introduction.
- Every project must state its own product principles and design highlights in
  direct language: what it optimizes for, which common default it rejects, who
  decides, what trade-off is deliberate and when it refuses to guess. These
  judgments are part of the product, not optional marketing copy. Their count
  follows the real project; do not force symmetry or pad a quota.
- The product layers must not open with a release id, commit, test count,
  schema, process name, port, model stack or internal component. Those facts
  remain complete in `技术`; they are evidence for the product, not the
  product's identity. A first-time reader must understand the value and use
  without reading the reference layer.
- Public pages never expose internal presentation or maintenance labels such
  as `curated_packaging`, `manual_owner_only`, “包装内容”, “手动维护” or task
  handoff bookkeeping. These may remain in Registry and tests as implementation
  facts, but the visible product is described by its real usable form.
- For every selected project, the public panel is technically complete by
  default. Except for reviewed L3+ values that the active global classification
  actually requires withholding and reusable secrets, retain the details
  needed to reconstruct the current product: exact models,
  providers, profiles, versions, modes, paths, ports, components, data flow,
  commits, hashes, candidates, installed/runtime state, failures, tests, E2E
  evidence and named gaps. “Public”, “too technical”, “too much text” and
  recruiter readability are not valid reasons to remove these facts.
- Public visibility is never a reason to suppress a non-secret fact that would
  change the owner's understanding of the current project.
- The first project viewport stays product-first and discloses a short project
  status, the most important snapshot boundary and its observation time in
  plain language. Exact model stacks, recovery/runtime versions, repository and
  worktree facts, commits and test matrices remain complete in `技术`; they
  must not displace the product's purpose and use from `速览`. A boundary may
  name one decision-changing gap, but it must distinguish what the project can
  do from what this webpage did not re-verify.
- If a reviewed L3+ value must be withheld, or a reusable secret is present,
  omit only that payload/value while keeping the public-safe identity, state,
  boundary and effect on current decisions. Unknown stays explicit Unknown.
  Never replace exact facts with a vague “configured / available / verified”
  label.
- Sensitivity is decided from the actual value, not the field name. Process
  names, executable paths, command lines, window titles, timestamps, usage
  durations, telemetry, network metrics, hardware identifiers and screenshots
  are not blanket-sensitive and may be public when useful. Only actual values
  with positive L3+ evidence enter review; redact a value only when that review
  requires it, and never publish reusable credentials. Bulk raw data may be
  omitted for boundedness, noise or product value, but never mislabeled as
  forbidden merely because of its schema.
- PUBLIC personal-data decisions follow the active global authorization
  contract's single classification table and the owner's exact project-specific
  instructions. This project neither copies, redefines nor independently
  tightens that table; a project-authored restriction cannot create its own
  publication authority.
- A page is still a riddle when a first-time reader can only tell that it is
  “related to Git / AI / files” but cannot explain what useful task it performs.
  Field completeness, a glossary, translated labels, tests and correct terms do
  not make that page understandable by themselves.
- The first occurrence of a technical English term must either follow an
  immediately visible explanation or use `English（中文含义）`. A glossary later
  on the page cannot excuse unexplained English used earlier. Repeated terms may
  use the shorter form after the first explanation.
- Automatic term annotation is a single-pass, longest-phrase safety net. It
  must never rewrite text that it already inserted or nest translations inside
  one another. Context-dependent words such as token, source, candidate,
  projection, limit, profile, Owner, Provider, Authority and root must be
  disambiguated in the owning content instead of receiving one global
  translation that changes their meaning.
- Preserve the professional reference content after the reader layer. Do not
  delete boundaries, failure behavior, implementation detail or verification
  evidence merely to make the opening easier to read.
- AI content must make an independent product judgment from current Owner
  evidence. Do not copy a README section by section, paraphrase one source as
  if that were analysis, or repeat fashionable conclusions without explaining
  the project's own trade-offs, evidence, failure modes and decision impact.
- Project evolution is a milestone timeline, not a commit log. Group related
  changes into one important product stage that explains the resulting change
  in capability, boundary or user experience. A stage may use one date or a
  date range. Small fixes, tests, refactors, copy changes and individual commits
  never create evolution entries; AI refreshes merge, rewrite or remove old
  stages before considering a new one.
- Do not impose word targets or maximum lengths on reference pages. Content is
  complete only when the owner can reconstruct the subject without another
  conversation or private memory.
- Project index pages start with real content. Do not repeat the active top
  navigation as a large page title and explanatory paragraph.
- The project summary area opens that project's Overview module. The same card
  directly exposes Overview and every project-owned module as visible links;
  do not hide a small module list in a dropdown or add a redundant “enter
  project” button. Module lists belong to each project, so future projects do
  not inherit `.agents` modules. Use a single row while entries fit at readable
  widths; when a future project has more modules, wrap the visible links into
  additional rows with the same separators and active state. Never shrink text
  below readability merely to force one row.
- The desktop project index uses a two-column grid sized for four cards in the
  first viewport and continues vertically. Mobile uses one column sized for
  roughly two cards in the first viewport. When the registry contains only one
  project, that single card spans both desktop columns instead of occupying an
  empty half-grid; two-column placement begins only when a second project exists.
- Project navigation must not introduce click-time lazy loading or a visible
  loading pause. The current panel generates complete route-specific HTML at
  build time, uses native directory-document navigation, keeps one small shared
  enhancement script, and prefetches likely next routes before interaction.
  Direct routes must expose complete content before enhancement; clicks must
  not show a spinner, skeleton or blank state. Likely transitions must issue
  non-blocking prefetch hints before interaction, but native navigation never
  waits for a hint to finish. Verify both first load and transitions on the
  public site, and never meet a size budget by deleting
  required professional content or moving narratives back into shared JS.
- Registered byte budgets are anti-bloat review thresholds, not permanent
  content ceilings. If current facts and professional detail cannot fit without
  semantic loss, first audit real duplication, dependencies and public
  wall-clock behavior, then record and apply only the smallest justified budget
  increase. Never enlarge a budget merely to hide an avoidable regression.
- Use official brand marks from a maintained icon library for external social
  links. Do not approximate brand logos with generic UI icons.
- A project whose Registry visibility is PUBLIC exposes one explicit GitHub
  repository button on its card and detail header, using the official GitHub
  mark and opening the registered repository. PRIVATE projects show status only
  and never receive a guessed or inaccessible repository link.
- ChineseASR is a real dashboard entry, not a model showcase. Keep source,
  unit-test, dependency, runtime-smoke, benchmark and human-review evidence
  separate. Never publish private recordings, transcripts, voice vectors,
  model weights, cloud requests or secret values, and never present anonymous
  speaker clustering or a local `person:self` clue as identity proof.
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
  complete. Unregistered personal domains are outside the current MVP because
  they have not been selected as projects; their product or domain names are
  not sensitive by themselves.
- Do not expose project-retirement bookkeeping. A selected older project may
  describe its enduring product idea and what was actually built, without
  publishing internal lifecycle labels or implying untrue current operation.
- If a learning product is ever selected, describe only its learning method,
  product design and implementation. Do not expose career or offer strategy.
- A private personal domain is not automatically excluded from future project
  selection. When the owner selects one, a `curated_packaging` +
  `manual_owner_only` page may publish its reusable product thinking, evidence
  method, correction flow, human decision boundary and design ideas while
  omitting only reviewed L3+ values that must stay private, reusable credentials
  and individual outcomes outside the selected public product. A health
  project may therefore explain evidence routing, uncertainty and safety
  boundaries, but must not publish the owner's health records, diagnoses, test
  results, medication list or individualized advice.
- Contract, formal-document and private-affairs projects or Skills are eligible
  for the public panel. Their public product layer may describe contract and
  document intake, fact/source checking, drafting, formatting, evidence review,
  submission-state separation and recovery as a general private-affairs
  workflow. Do not foreground lawsuit/case labels, case facts, personal
  evidence or individual outcomes on the homepage. Public copy presents the
  usable product directly and never exposes "packaging" as a maintenance label.
- The selected personal-health project is a curated, manual-only explanation of
  its evidence product: processed-current routing, protected foreground refresh,
  raw preservation and exact resume, deterministic offline verification,
  decision-ready/inventory-only evidence states, Health Owner review, red flags
  and low-attention governance. Never read or publish `CURRENT.md`, `SOURCES.md`,
  reports, raw responses, manifests/briefs, personal values, diagnoses,
  medications, individualized advice, OAuth payloads or credentials for this
  page. Source code, tests, schema names, PRIVATE repository identity and
  ordinary technical facts remain public-safe.
- Detail pages are durable reference documents, not one-line marketing cards.
  They should explain product intent, real scenarios, information flow,
  architecture, important decisions, boundaries, failure handling and
  verification in professional plain language.
- Projects with real visual output may expose one reusable gallery:
  lazy-loaded previews open the complete image on one click and provide close,
  previous and next controls. Reuse the same component for later visual
  projects; do not add a gallery dependency, duplicate thumbnail files, infer
  missing labels, or alter the meaning of the supplied evidence image.
- A reasonable design that has not been implemented may be documented as a
  design, but must not be presented as a verified production result. Never
  package an unfinished fact as completed.
- There is no standalone Ideas directory in the current information
  architecture. Project-specific judgments live with the project/module that
  gives them context.
- `/rules` is one rules workbench. It shows the verified current E release,
  current/previous pointer, PRIVATE main commit, five-file ruleset and exactly
  five current rules through an in-page selector; do not create rule detail
  routes. Historical C material may appear only as recovery-only history.

## Project expansion gate

- The owner accepted the four-project public MVP on 2026-08-30, then explicitly
  authorized TimeAudit as project 5, PC Panel Hub as project 6, CACB as the
  curated manual-only project 7 and the AI-assisted learning method as the
  curated manual-only project 8, followed by Codex Remote as the curated
  manual-only project 9 and personal-health as curated manual-only project 10.
  The current target therefore contains
  `.agents`, PCConfig, GitHub 总索引, ChineseASR, TimeAudit, PC Panel Hub,
  CACB, the learning method, Codex Remote, personal-health, plus the one-page Rules workbench
  and current public-safe Skills catalog.
- Most real projects may eventually enter the panel. Add them in owner-selected
  value order, one completed project at a time; do not create placeholder cards
  or delay a selected project's construction by making agents vote on the
  entire future backlog.
- Project 10 is personal-health. Its completion and independent report must
  precede any implementation of project 11 LocalOCR; no placeholder card or
  advance route is allowed.
- The selected sequential queue gives the future personal-media project a
  non-optional content floor: automatic increments, classification, cloud and
  phone recovery bundles, dual preservation/read-back, and fail-closed controls
  against unattended loss. The future 微信 / `WeChatDirect` project must directly
  cover incremental WeChat archiving, reply and image/audio/file relationships,
  resumable replay and recovery. These requirements do not authorize building
  either project before its turn; finish and report the current project first.
- “Skills” means the owner's personal usable capability catalog, not a catalog
  owned by one assistant product. It may include both personally maintained
  Skills and high-value externally supplied Skills that are genuinely available
  to the owner.
- Inclusion never implies authorship. Use public-safe provenance such as
  “personally maintained” or “integrated capability” when provenance matters,
  while keeping product-facing names and explanations vendor-neutral.
- Display an integrated Skill only when it is currently usable, materially
  valuable, sufficiently understood, non-duplicative and safe to publish.
- Finish content before breadth. `.agents` Overview and all six project modules, all
  five current rules, and every displayed Skill must let the owner reconstruct
  the subject, its current state, technical design, operating flow, boundaries,
  failures and verification without another conversation.
- Every enabled Registry project may enter routes and navigation only within
  its own content, evidence and public-safety boundary. Source, install,
  runtime and evidence gaps remain visible; local integration must not upgrade
  them to production PASS. Publication follows only after current project facts
  are refreshed, verified and read back from Pages.
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

## AI refresh model

- The website's semantic updater is AI. The owner asks naturally to refresh one
  project or says “全部更新一下”; the website task reads the Registry, collects
  current Owner evidence, repairs safe in-scope defects, edits the owning
  content in professional plain language, validates it and presents a preview.
  Deterministic scripts may collect facts and verify contracts, but never write
  narrative content or decide materiality.
- A targeted refresh touches only the named project. A full refresh iterates all
  enabled projects but may leave most or all files byte-identical. It is a
  revalidation request, not permission to rewrite every page.
- This is a continuously maintainable panel with on-demand AI refreshes plus
  one owner-authorized weekly material-drift review. The weekly task reads
  current project, Rule and Skill evidence after governance, remains a no-op
  when the page would stay truthful, and updates only the affected snapshot
  when a real change would alter reader understanding. It is not continuous
  synchronization and does not justify a watcher, daemon or duplicate writer.
- The published site represents the last verified and released state. E release
  identity is the rule-version boundary; the weekly review does not make every
  displayed fact live, and the site must not claim background freshness beyond
  the evidence and observation time it actually read back.
- The fast project function must provide `targeted` and `all` AI refresh plans
  from `config/panel-projects.json`, including the current content path, source
  identity, evidence collectors and existing snapshot fingerprint. Plans are
  context for AI, not a second writer.
- `scripts/refresh-panel-snapshot.mjs` owns only the `.agents` current E-release,
  source-checkout and Skill evidence payload. Rules always bind to the frozen,
  verified current E release. A dirty or newer source checkout is shown as
  non-active candidate work; it cannot overwrite the release and does not block
  an otherwise truthful snapshot or unrelated project refresh.
- A refresh collector that needs full Windows visibility is explicitly allowed
  to run as Administrator or SYSTEM for this read-only snapshot. It must return
  a bounded public-safe receipt and leave no persistent task, service, queue or
  secret. The website task must not downgrade to a partial ordinary-user view
  or describe the product gap as "insufficient permissions". If the registered
  SYSTEM route cannot actually run, mark only the affected live fields Unknown
  with the last verified evidence time and record a refresh-route defect. That
  defect blocks only a claim that requires fresh full visibility; it does not
  turn an accurately disclosed source-project gap into a blanket MAP release
  blocker or justify another website service/state layer.
- Do not add a daemon, watcher, scheduled task, polling service or public live
  dependency merely to keep the panel current.
- Cross-project refresh is event-driven and thresholded. A matching changed path
  is only an impact candidate; create a fresh independent website task only when
  the source task has determined that a displayed fact, explanation, boundary,
  maturity or user decision would otherwise become materially wrong. Small
  refactors, timestamps, formatting, blocked candidates and hash-only drift may
  wait for the next material refresh.
- An enabled project with `ai_refresh.mode=manual_owner_only` is outside the
  event-driven handoff set. `assess-panel-impact` must always return no website
  task for it, even when paths or commits change and even when a source caller
  claims materiality. It enters a targeted or full refresh only when the owner
  explicitly asks to update it; the refresh plan and result must carry that
  manual-owner-request fact. This rule creates no Skill, watcher or Source hook.
- The owner has standing-authorized that one necessary fresh website task for
  registered rule, Skill and project sources. Once the material threshold and
  duplicate check pass, do not ask again whether a new conversation may be
  opened. This authorization does not cover non-material changes, duplicate
  tasks, unregistered sources or broader website work.
- That handoff follows the active global default and is projectless unless the
  owner explicitly selected a project. It is asynchronous: a returned task id
  is the creation receipt, a creation error is reported to the owner, and the
  source conversation never waits for or polls website-task progress.
- Default is no website change. AI updates a project only when leaving the page
  unchanged would make a displayed capability, boundary, current state, usage
  or user decision materially wrong. Small source updates never trigger a
  website task.
- Refreshes replace, merge or remove existing content in place. They do not add
  update logs, duplicate evidence sections, new cards or timeline entries merely
  because another refresh occurred. A 40+ project panel must remain readable;
  unchanged projects and unchanged sections stay byte-identical.
- Before publishing a refreshed snapshot, inspect the current source owners for
  contradictions and broken validation paths. Repair safe, in-scope defects
  through their real owner when possible; publish the repaired state. Defects
  that cannot be repaired in the same goal remain visible as named gaps.
- The four-project MVP and the existing PUBLIC destination are owner-accepted.
  Subsequent registered project and Skill refreshes, including the selected
  TimeAudit, PC Panel Hub, manually requested CACB, learning-method, Codex
  Remote and personal-health additions, are standing-authorized to commit, normal-push existing
  PUBLIC `main`, wait for Pages and read back the deployed commit automatically
  after all content, test, build and public gates pass.
  Do not ask for another publication approval. A new public destination, paid
  effect, secret exposure, force-push or explicit owner hold remains outside
  this authorization.

## Subagent discipline

- Every current and future website project may use multiple native subagents
  whenever independent content judgment, visual work, implementation,
  evidence collection or final audit can materially improve the delivered
  page. Do not reduce final quality merely to conserve an ample model quota,
  and do not create subagents just to reach a fixed count.
- Every native subagent used for this website, at every descendant depth, must
  be exactly `gpt-5.6-sol` with `max` effort. Luna, Terra, local aliases and
  lower effort are forbidden even for bounded tests or read-only audits. Choose
  the actual number of Sol Max agents from independent work surfaces and net
  quality gain; zero remains valid. This rule applies equally to projects added
  after the current ten.
- One subagent owns one durable goal. A follow-up may clarify, narrow or expand
  the scope, evidence or acceptance criteria of that same goal, including
  continuing it after interruption. It must never replace that goal with an
  unrelated objective.
- Create a fresh subagent for every unrelated new goal. Do not use an old child
  merely because it is idle or already has context.
- Subagents remain read-only unless their one goal explicitly owns a named
  implementation scope; the root agent integrates the website and runs the
  final audit.

## Verification and publication

- Preserve the existing React, Vite and GitHub Pages route-generation chain.
- Verify build, direct routes, custom 404, keyboard navigation, desktop/mobile
  overflow and browser console before normal-pushing `main`.
- Content acceptance is a real reading test, not a schema check: for a sample
  from every content type and every displayed Skill, a first-time reader must
  be able to restate its practical use, concrete risk, example and final result
  without opening the source Skill or asking a follow-up question. Automated
  field checks are supporting evidence only.
- After the accepted MVP, local preview remains required product evidence but
  is non-blocking for ordinary registered refreshes and selected new projects:
  open the project index, Overview and representative detail, notify the owner,
  then continue to the already authorized PUBLIC release unless the owner says
  to hold. Preview never substitutes for content reading, tests, Pages or
  public read-back.
- The public-content gate scans every tracked/unignored source file and every
  production artifact regardless of extension. Directory-route canonical,
  Open Graph and sitemap URLs use the trailing-slash URL that Pages serves as
  `200`, not the redirecting form.
- Public completion requires local HEAD, remote `main` and the Pages deployment
  commit to match.
