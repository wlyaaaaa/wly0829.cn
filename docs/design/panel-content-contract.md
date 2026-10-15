# Panel product and content contract

These sections remain project rules. Before changing the website's product, page
copy, styling, interactions, navigation, project selection, content generation or
public publication, or tools or documents that can affect them, read this entire
document. Code paths are interpreted from the repository root.

## Product boundary

- This is a personal project, rules, capabilities and collaboration workspace.
  It includes reading and discovery, AI continuation instructions and computer
  connection entrypoints. Describe the actions each existing entry can actually
  enable; do not label the whole website or system read-only. A dated project
  snapshot remains distinct from an operation and its verified result. It is not
  a resume, marketing landing page, activity feed or repository browser.
- The owner's explicit 2026-09-24 request adds a bounded personal AI experience
  highlight to System and `.agents`: dated usage screenshots, independent Codex
  totals and first-person tool experience. Keep it distinct from system/project
  results, preserve the working entrypoints and complete technical content, and
  do not expand this exception into a site-wide marketing redesign.
- The owner is the primary reader. Do not optimize information density, wording
  or project selection for recruiters, salary negotiation or external
  persuasion. A public visitor may read the same material, but the panel must
  first let the owner recover the complete operating picture.
- `config/final-project-order.json` is the sole authority for retained
  project identities and their fixed value slots, the
  next project to build and the status of non-card explanations.
  `config/panel-projects.json` contains only
  enabled, published project packages; every enabled package must use the same
  fixed rank as its `order`. The current published and planned counts, exact
  ranks and next project are derived from that file rather than copied here.
  These internal value slots determine relative order, not visible card numbers.
  Project cards show consecutive numbers from 1 through the displayed project
  count, as the owner corrected on 2026-09-08. Retired internal slots never leave
  a gap in those visible numbers or create placeholder cards, routes or copy.
  Each project owns its real module count and module
  boundaries; visual symmetry is never a reason to force every project into
  the same number of modules.
- A registry entry defaults to `real_dashboard`: publish dense, current facts,
  architecture, failures and evidence. Only a project explicitly designated by
  the owner as `curated_packaging` may use packaging copy or exclusions. A
  curated project may also be `manual_owner_only`: only an explicit owner request
  can refresh it; source, rule and Skill events never create a website task.
- The owner selected the website itself as “个人网站（总看板）” on 2026-10-07.
  It owns the single personal dashboard and appears as a normal project card.
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
- The reader layer must make these things easy to understand: what this thing
  actually does for the owner; what concrete problem or accident it prevents;
  one realistic ordinary request; what the owner receives; and what happens
  when the work succeeds, finds a problem or cannot run. This is a content
  quality floor, not a shared card layout, field order or three-label template;
  each System section, project, Rule and Skill keeps the structure that best
  explains its subject. System stays medium-density while owning detail pages
  go deeper. Only after the reader can form a real working picture should the
  page lead with architecture, commands, schemas, hashes and implementation
  evidence; adding more words never substitutes for removing mystery copy.
- Plain-language acceptance is semantic, not lexical. Natural first-person
  requests, dialogue, metaphors, colloquial wording and moderate exaggeration
  are welcome when they make the product easier to understand. A fixed opening
  phrase, global forbidden-word list, tone score or regex coverage percentage
  never proves quality. Vivid wording must not change a fact, evidence level,
  operating boundary or current status, or turn an unverified outcome into a
  guarantee.
- A wording-only editorial pass uses the latest accepted default branch as its
  semantic baseline and preserves every capability, fact, state, boundary,
  evidence level and Unknown. It does not require a source-independent
  completeness rebuild. If the wording adds, removes, weakens or reinterprets
  product meaning, only that affected scope becomes a source-backed content
  refresh. Copy from an older worktree is a proposal: port useful wording onto
  the current publication Owner result, never merge, cherry-pick or copy it in
  a way that overwrites later Owner work.
- Plain-language review covers every visible interaction surface, including
  project kickers, System requests, Rule and Skill examples, `plainExample`,
  module `example` and `usageExamples`. A reader-layer example normally leads
  with one request a person might actually make and the result they would see;
  commands, fixtures, internal states and proof details stay in the technical
  layer unless that exact request genuinely needs them.
- When a project reads, collects or accepts information, its reader layer must
  name the actual devices, services, applications or files and explain the
  concrete data categories it uses, what happens to them and what the owner
  receives. A collector, probe, provider or evidence pipeline is not an adequate
  substitute for the real source and observations. Distinguish implemented
  collection, configured access, current records, quality checks and analysis;
  an endpoint count, field count, connection test or technical glossary cannot
  stand in for that explanation. For a method without automatic collection,
  state what the person supplies and what AI produces instead of inventing a
  collector. Readers must not need the owner's private memory to understand it.
- Every project Overview, project module and Skill detail uses two full-width
  reading tabs: `产品用法` and `技术与依据`, with product usage visible by
  default. Reuse the established segmented tab style. Both complete bodies
  are in the initial HTML; JavaScript only switches visibility and a no-JS
  reader can still read both. Ordinary navigation to another module starts at
  its product explanation, never at the previous page's scroll height. Existing
  product, technical and inner-heading links select the owning tab on direct
  load, refresh and browser history navigation.
  `产品用法` owns the product essence, why it matters, actual starting point,
  necessary inputs, natural requests, complete user steps, results,
  success/problem/unavailable behavior, principles and useful visual results.
  An example and result alone do not explain how to use a product. A feature
  that is only designed or not installed must say what can actually be done
  now; do not invent a usable interface or turn maintenance evidence into use.
  `技术与依据` owns current snapshots, exact models and versions, architecture,
  commands, schemas, hashes, source/test/runtime/publish evidence, failures,
  and recovery. Product evolution belongs to the product layer: explain the
  original need, the new capability and the practical consequence at each
  meaningful stage. Each module owns the complete use and technical explanation
  of that function; Overview keeps an overall journey and linked capability
  index, without repeating that index or its examples in another chapter.
- Every project must state its own product principles and design highlights in
  direct language: what it optimizes for, which common default it rejects, who
  decides, what trade-off is deliberate and when it refuses to guess. These
  judgments are part of the product, not optional marketing copy. Their count
  follows the real project; do not force symmetry or pad a quota.
- The reader must be able to move from an ordinary need to an implemented
  capability, its actual input, a usable result and the important choice or
  limit. A module name, translated acronym, checklist or test result does not
  establish that connection. Where choosing a model or tool changes use, show
  its actual public-safe name and role in the reader layer after the purpose;
  keep complete IDs, parameters, versions and evidence in the technical layer.
  "Do not lead with a stack" is not permission to hide the available choices.
- Project, module, example, search excerpt and evolution must tell the same
  current story. Review the whole owning explanation when a capability changes;
  changing one result field while leaving the request or earlier stage wrong
  is incomplete. Evolution groups needs and resulting capabilities, not commits.
  Keep current implementation, accepted future design and unavailable evidence
  visibly distinct. Do not activate a pending business design from the website.
- Reader boundaries are short, project-authored statements of the most important
  decision-changing gap. The complete dated snapshot remains in the reference
  layer; never delete useful evidence merely to shorten the opening. Optional
  operating choices belong to their project, not a renderer-owned second story.
- The product layers must not open with a release id, commit, test count,
  schema, process name, port, model stack or internal component. Those facts
  remain complete in `技术`; they are evidence for the product, not the
  product's identity. A first-time reader must understand the value and use
  without reading the reference layer.

- **Stranger 30-second gate:** a reader with no knowledge of this machine,
  .agents, PCConfig, Git, model routing or the author's private history must
  be able to answer, from the default visible layer, what this page is for,
  what they can ask it to do, what the system will do, what result they get,
  when the system stops or asks the owner, and what is still unavailable.
  Passing tests, complete fields or technically correct terminology do not
  satisfy this gate. If the answer requires understanding Owner, Provider,
  schema, runtime, ruleset, SHA or logical ids, the reader layer has failed.
  Professional detail must remain available; move it into an explicit
  technical/evidence layer instead of deleting it.
- Rules follow the same reader/technical split as projects. The default Rules
  experience starts from ordinary situations and shows a plain conclusion,
  trigger, system behavior, owner action, real example and non-behavior.
  A second expandable reader layer preserves the important conditions,
  exceptions, failure handling and recovery from the active source topic.
  Logical ids, release metadata, hashes, canonical paths, full structured
  rule summaries and validation matrices belong to a separate technical
  evidence layer. Rule technical evidence is expanded by default; selecting a
  Skill's technical tab exposes its full reference without another closed box,
  and System composition is normal visible content, not a collapsed appendix.
  A short slogan is not a substitute for a 10k–20k source
  contract.
- Skill details lead with when to use the capability, where to start, what to
  provide, an ordinary request, the actual process, result and recovery.
  Dependencies and technical identity stay complete in the technical tab.
  System leads with “what I want to do
  today”; dependency maps, project atlases, validation layers and system
  internals remain available but must not dominate the default reading path.
- Public pages never expose internal presentation or maintenance labels such
  as `curated_packaging`, `manual_owner_only`, “包装内容”, “手动维护” or task
  handoff bookkeeping. These may remain in Registry and tests as implementation
  facts, but the visible product is described by its real usable form.
  This excludes this website run's internal scheduling and presentation state,
  not a represented product's public-safe API fields or failure-state names in
  its technical reference. A product's actual manual maintenance feature is
  also distinct from the website's internal manual-refresh designation.
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
  must not displace the product's purpose and use from `产品用法`. A boundary may
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
- Device brands and models, software identities, measurement names and data
  categories are product facts, not the person's raw records or measured
  values. Do not hide them behind generic labels or forbid them as keywords.
  Retain the exact private payload boundary without erasing what the product
  actually collects, processes or delivers.
- PUBLIC personal-data decisions follow the active global authorization
  contract's single classification table and the owner's exact project-specific
  instructions. This project neither copies, redefines nor independently
  tightens that table; a project-authored restriction cannot create its own
  publication authority.
- A page is still a riddle when a first-time reader can only tell that it is
  “related to Git / AI / files” but cannot explain what useful task it performs.
  Field completeness, a glossary, translated labels, tests and correct terms do
  not make that page understandable by themselves.
- A page is also still a riddle when current Owner evidence can safely answer a
  basic scale or state question but the page hides behind “not read in this
  refresh”, “private source” or a generic boundary. Real-dashboard pages must
  directly expose decision-changing public-safe aggregates, current counts,
  component/path identities, usable results, known coverage and named gaps.
  Omitting raw private payload does not authorize omitting its harmless count or
  product state. Personal-media must state separate current photo, video and
  audio counts, then split audio by its real canonical roles instead of calling
  every audio file a recording; personal-materials must state current source, material,
  relation and searchable-text counts when the bounded read-only status path is
  available.
- Personal-materials and personal-media canonical roots are trusted owner
  surfaces. When the owner deletes an exact original in the file manager and
  that locator no longer exists under an available registered root, the product
  meaning is authoritative retirement without a second AI notification or
  recovery prompt. Read and search entries remain read-only; the existing daily
  backup task maintains the current catalog, seed, bound relations/text,
  G mirrors, phone-package and cloud-candidate derivatives. No separate
  deletion/protection/recovery framework is required. A whole source root
  being unavailable is still only unavailable. Public copy may claim this only
  after source tests pass; until then it is a named source blocker, never a
  silent restore or a completed capability.
- Explain an unfamiliar technical term when its meaning is needed to understand
  the action or result, preferably in the sentence itself; `English（中文含义）`
  is useful only when that short explanation actually helps. Familiar formats,
  common names and acronyms such as Markdown, PDF, Git and API do not need
  automatic parenthetical translations. Do not repeatedly annotate a term
  throughout a page. A glossary remains available for precise reference, but
  cannot replace an intelligible product explanation.
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
- A new project, full refresh or completeness audit must start with a
  `source_independent_coverage` pass. Reconstruct the source project's
  long-lived product axes from its own current rules, human entrypoints,
  product contracts, registries, recovery documents and code entrypoints
  before reading the website's module list, search aliases or existing
  coverage claims. Registry impact paths help locate evidence; they cannot
  prove that every important subsystem was observed.
- Compare that source inventory with the page in two separate layers. Every
  selected long-lived axis needs both a product explanation (purpose, people or
  devices, ordinary scenario, result and deliberate trade-off) and a technical
  reference (identity, components, data flow, entrypoints, state/failure,
  recovery, current evidence and named unknowns). A timeline mention, source
  path, test count, glossary term or isolated technical paragraph proves
  neither layer.
- For every long-lived mechanism selected from source, the owning product
  reader layer must let a first-time reader answer five practical questions in
  plain language: which accident it prevents; when it activates; what actually
  happens; what happens on conflict or unavailability; and which result,
  evidence or recovery point is returned. Naming the mechanism only in a
  system diagram, glossary, rule field or technical module is still a content
  omission.
- `product_capability_completeness_gate`: omitting a current, source-backed,
  public-safe, long-lived product capability that could change how the owner
  uses or judges the project is a P0 content defect. Missing either its product
  explanation or its technical reference blocks that project's content PASS
  and blocks publication of the incomplete snapshot. UI quality, route
  existence, search results, schema fields, build success and prior page-only
  audits cannot downgrade or offset this defect.
- Decide module boundaries only after the source-to-page difference is known.
  Add a module when the source proves an independent long-lived capability
  with its own users/devices, lifecycle or recovery boundary; otherwise repair
  the owning module in place. Module count remains project-specific. A fresh
  reviewer must be able to name important source subsystems that are absent
  from the page; auditing only the page's existing fields is circular and
  cannot produce a content PASS.
- Project evolution is a milestone timeline, not a commit log. Group related
  changes into one important product stage that explains the resulting change
  in capability, boundary or user experience. A stage may use one date or a
  date range. Small fixes, tests, refactors, copy changes and individual commits
  never create evolution entries; AI refreshes merge, rewrite or remove old
  stages before considering a new one.
- Grouping evolution stages must preserve important product transitions and
  their dated evidence. Keep commit/version references with each product stage,
  including multiple references when several stages merge; the stage may expose
  these as optional evidence. Do not create a second evolution chapter in the
  technical layer. A title needs readable space, never a narrow commit column.
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
  product design and implementation. Do not expose individual outcomes or private planning.
- A private personal domain is not automatically excluded from future project
  selection. When the owner selects one, a `curated_packaging` +
  `manual_owner_only` page may publish its reusable product thinking, evidence
  method, correction flow, human decision boundary and design ideas while
  omitting only reviewed L3+ values that must stay private, reusable credentials
  and individual outcomes outside the selected public product. A health
  project may therefore explain evidence routing, uncertainty and safety
  boundaries, but must not publish the owner's health records, diagnoses, test
  results, medication list or individualized advice.
- The public `document-materials` capability is presented as “文书和材料制作”.
  Explain how contracts, formal statements, applications, event materials and
  submission packs move from originals and current material state into
  editable files, PDF or reviewed bundles; keep generated material, user
  action, platform receipt and recipient processing separate. Do not expose a
  narrower private-domain identity, internal source route or personal result.
  Public copy presents the usable product directly and never exposes
  "packaging" as a maintenance label.
- The selected `work-delivery` project is presented as “工作支持与交付”,
  following its current source product name. It supports ordinary work matters,
  communication, decisions and reviews directly; a persistent delivery package
  is used only when selected changing sources and consistent outputs need it.
  Explain package entry and explicitly selected sources, evidence and typed
  facts, append-only reviews and the canonical quality gate, the exact six
  current deliverables, precise source rebound/stale behavior, and the
  separate status/time-value/recovery evidence. The Skill remains discovery
  and routing only. Current formal outputs are exactly `PRD.md`,
  `manifest.json`, `traceability.csv`, `产品需求文档.docx`, `项目评审.pptx`
  and `执行跟踪表.xlsx`; never claim a current project-plan, weekly-report or
  reporting output. Keep actor absence, fact/whole-build impact granularity,
  narrow inputs, external AI analysis, `baseline_required`, no real work or
  real source-change acceptance, and no export/backup/restore visible.
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
  current/previous pointer, PRIVATE main commit and complete verified release
  inventory. Its in-page selector follows the same release catalog's primary
  topics; compatibility aliases and entry templates remain in the integrity
  closure but never become duplicate reading topics. Do not create rule detail
  routes. Historical C material may appear only as recovery-only history.

## Project expansion gate

- The owner accepted the four-project public MVP on 2026-08-30 and later
  completed twenty-two project pages in a historical construction sequence.
  Historical construction numbers are no longer display ranks. Retained
  project identities keep their accepted slots in the value order
  from `config/final-project-order.json`; rank 15 is unused after
  the owner moved Scripts capabilities into their owning projects. The current
  complete packages in Registry remain enabled at
  their fixed, possibly non-contiguous internal ranks; visible project-card
  numbers remain consecutive. They sit alongside the one-page Rules workbench
  and current public-safe Skills catalog.
- The intended end state includes essentially every real project that can be
  presented within its actual public-content boundary. Exclude only an exact
  project identity or payload that the owner or an applicable higher rule
  actually excludes; a private source, technical depth, long page or the need
  to omit one L3+ value never excludes the remaining project. Add projects in
  the fixed value order. Historical Gemini/Astra construction assignments do
  not constrain current work. Choose authors, implementation and independent
  review through active economy routing and actual ownership; an authorized
  whole-site repair may cover its affected projects together. Combine the
  results for final local verification. Publication follows the owner's current
  release authorization and the final verification gates. Do not create
  placeholder cards or re-vote the backlog after each delivery; change the fixed order only when the owner
  explicitly corrects it or material project truth makes the value judgment
  wrong.
- vault-tool is the existing local file-encryption and recovery product. It
  receives one
  source-first complete product and technical snapshot, necessary source
  repair, independent content audit, PUBLIC release and read-back. Explain
  selected files and directories, archive creation versus merge, local viewing
  and extraction, password/keyfile and format choices, maintenance and recovery,
  dual-password containers, image carriers, AI metadata and local UI boundaries,
  and private ciphertext publication. Keep ordinary scenarios and actual
  outcomes ahead of algorithms. Preserve the two reading tabs and actual
  source module boundaries; do not create a web encryption service, another
  password manager or a new vault format. Verify with isolated fictional files,
  never the owner's real vault, password, keyfile or private plaintext. Tests,
  metadata inspection, actual cryptographic round trips, GUI interaction and
  remote recovery are separate evidence layers. No placeholder card or advance
  route is allowed for a later item.
- video-scaffold is the existing staged local video-production scaffold. It
  receives one
  source-first complete product and technical snapshot, necessary source
  repair, independent content audit, PUBLIC release and read-back. Explain a
  clean project bootstrap, Fish Audio narration and its external text boundary,
  Fish-native word timing or ChineseASR alignment of confirmed text, reviewed
  SVG fragments and real asset URIs,
  build/lint/preview before expensive rendering, deterministic `seekTime(t)`
  frames, AV1 NVENC chunks, input-safe resume, narration/BGM merge, cover,
  chapters, final verification, cleanup and human viewing. Preserve environment,
  test, preview, render, delivery and publication as separate evidence layers.
  Do not invent a topic, script, storyboard, demo video, upload service,
  browser editor, cloud renderer, daemon, database or a new video format merely
  to build the page. Placeholder art and old bespoke examples never prove a
  current finished video.
- AI CLI Profile Manager is the existing Windows 11 PowerShell
  product for launching and operating native Codex CLI, Claude Code, Qwen Code,
  OpenCode and the current Rust Open Interpreter through explicit Profiles. It
  receives one source-first
  complete product and technical snapshot, necessary source repair, independent
  content audit, PUBLIC release and read-back. Explain Profile creation and
  selection, `start` / `native` / `eject`, exact Provider and no-fallback
  identities, DPAPI and target-process-only secret injection, Doctor versus
  text/tool/Agent Live evidence, recoverable Codex machine runs, permission and
  model read-back, managed public search, local-model and optional proxy
  boundaries, CurrentUser install, upgrade, uninstall, retirement recovery,
  Chinese manuals and the current compatibility matrix. Source, static,
  installed, runtime and Live evidence remain separate; old or differently
  fingerprinted receipts never become current merely because the page exists.
  Do not add a GUI, TUI, PTY or chat shell, a new Provider or model Profile,
  paid Live calls, a second run ledger, a daemon, database, dynamic website
  runtime or unrelated planned-project placeholder routes merely to build the page.
- OpenClawGateway is the existing public-safe Windows operations layer for an
  OpenClaw message gateway. It receives one source-first complete product and
  technical snapshot, necessary source repair, independent content audit,
  PUBLIC release and read-back. Explain Telegram and Feishu ingress separately
  from real message E2E; official Gateway lifecycle, loopback health, heartbeat
  and Windows task history; catalog-backed local versus remote model and cost
  posture; manual controlled updates across stable, extended-stable, beta and
  dev; official verified backup, fresh staging restore and separate offline
  activation; the four distinct current Codex/Gemini/Claude/OpenClaw private
  backup consumers with their local/G/private-Git outputs and different
  failure semantics; the exact three-task/four-consumer schedule, including
  shared Claude-then-OpenClaw execution and first-nonzero result propagation;
  PUBLIC repository auto-archive; public bootstrap and
  private runtime settings; and the managed
  CodeG/Cline MCP bridge. Keep configured, running, connected, loaded, route,
  auth, tests, actual model output and final reply as separate evidence. Do not
  expose account ids, tokens, private hostnames, private repository locations,
  message bodies or raw logs. Do not send a message, make a paid model call,
  update/restart the runtime, activate a restore, create another gateway,
  install a plugin or prebuild another planned project merely for the page.
- sunshine-remote-streaming is the existing PRIVATE Windows operations layer
  for Sunshine and Moonlight remote streaming. It receives one source-first complete
  product and technical snapshot, necessary source repair, independent content
  audit, PUBLIC release and read-back. Explain physical-primary capture with a
  uniquely verified MTT1337 VDD fallback; window-placement recovery; independent
  VDD resolution, refresh, scaling and HDR controls; disabled automatic display
  topology changes; GPU-instability fail-closed behavior; transport-layer
  diagnosis and repair; documented bitrate and codec guidance; remote-power
  design choices; and the daily lightweight verification task. Keep source,
  isolated tests, installed configuration, service/task state, peer-route proof,
  phone interaction, physical display failover and cold-power acceptance as
  separate evidence. A local IPv6 endpoint, codec mask, running service or
  recommendation never proves a direct phone route, stream quality, no loss,
  display failover or remote cold start. Do not expose real IP addresses,
  Tailnet names, device names, endpoints or credentials. Do not run `-Apply`,
  change MTT VDD or physical-display state, alter host HDR/resolution/refresh/
  topology or Sunshine configuration, restart services, disturb ToDesk, or
  prebuild another planned project merely for the page.
- The selected personal-media project has a non-optional content floor:
  automatic increments, classification, cloud and
  phone recovery bundles, dual preservation/read-back, and fail-closed controls
  against unattended loss. It also explains that the media library owns fast
  retrieval and image understanding while LocalOCR contributes bounded exact
  text evidence to the same catalog rather than a second index; it exposes the
  one no-quota selected-media entry with separate photo/video roots, current
  counts and E/G read-back. A canonical original deleted by the owner in the
  trusted file manager is authoritative retirement, not an accidental-loss or
  restore request: publish catalog/seed/G/phone-package/cloud-candidate
  convergence only after the source implementation and tests prove it, and
  otherwise show the source blocker explicitly. Its Overview also contains 10–20 owner-authorized,
  aesthetically selected real photos with lightweight thumbnails and clearly
  sharper, size-optimized display images loaded only when selected. The owner
  requested this web delivery on 2026-09-08; preserve framing, orientation and
  color, keep source originals in the media library, and distinguish compressed
  display files from source originals. Ordinary personal photos are not excluded merely because
  their source is private. The completed document-materials project directly
  explains entry bypass, current matter and original inputs, same-source
  DOCX/PDF, page/color/grayscale verification, signature and ready versioning,
  reality-state separation, sign-back and copy-and-verify recovery. These requirements do not authorize
  building a later project before its turn; finish and report each selected
  project first.
- “Skills” means the owner's personal usable capability catalog, not a catalog
  owned by one assistant product. It may include both personally maintained
  Skills and high-value externally supplied Skills that are genuinely available
  to the owner.
- Inclusion never implies authorship. Use public-safe provenance such as
  “personally maintained” or “integrated capability” when provenance matters,
  while keeping product-facing names and explanations vendor-neutral.
- Display an integrated Skill only when it is currently usable, materially
  valuable, sufficiently understood, non-duplicative and safe to publish.
- Finish content before breadth. `.agents` Overview and all seven project modules, all
  current primary rule topics, and every displayed Skill must let the owner reconstruct
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

