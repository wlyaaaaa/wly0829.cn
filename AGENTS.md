# wly0829.cn project rules

This repository is public. Every tracked file must be suitable for an unknown
visitor to read, clone and quote. The website itself is primarily the owner's
personal AI collaboration workspace; public presentation is secondary.

本人问网站某天或某几天访问人数时，在仓库根运行 `python -B -X utf8 tools/query-site-visitors.py --start 2026-10-12 --end 2026-10-12`（替换日期；最近七天用 `--days 7`）：默认排除本人和巡检、北京时间切日，以浏览器访客编号及整段跨天去重为主（换设备或清存储会多算、共用浏览器会少算），独立 IP 是辅助口径（换网络多算、共用 IP 少算、资源缓存会漏算）；近 7 天从 SLS 实时日志查询，约延迟 3 分钟，更早来自 OSS 日志转存，可能延迟最多 48 小时，输出会列出各段来源，零条日志不能认定零访客，本人设备访问任一页带 `?self=1` 后持续排除，`?self=0` 取消。

本人问网站搜索词、点击、展示、平均排名或收录时，查询入口是 `python -B -X utf8 tools/query-search-terms.py --days 28`（默认 28 天，可改天数或用 `--end YYYY-MM-DD`；凭据须经密码中心登记程序供给，未配置或读取失败会明确报错）；Google 按太平洋日期切日、默认截止到当地三天前，数据通常晚 2–3 天且低频词会被隐去，网站总量与可见词表分开，Bing 词统计按返回日期筛选但每周更新且周覆盖区间未知，Google 全站收录需另读 Page Indexing 或通过 `--google-index-snapshot <本机快照.json>` 显示带日期的非实时快照，Bing 显示最新可取得的收录快照，空记录不等于无人搜索。

月度热门页面用 `python -B -X utf8 tools/query-site-visitors.py --month 2026-10`。普通查询同时输出离线 ip2region 省市、IPtoASN 机构网络与 App 分布、新访客/回头客、每页与每个编号的停留汇总，以及按省份/运营商分组的打开速度中位数；地区与机构只是 IP 网络归属线索，不证明个人身份、精确位置或雇主，原始 IP 不出本机。离线数据库与首次观察编号历史只保存在本机默认缓存 `E:\Cache\wly-site-visitors`，不提交仓库；数据库不可用时汇总明确为未知，不用网络查询 IP。新/回头客依据已观察日志中的首次日期，首次观察不证明绝对首次来访，苹果 Safari 与微信清存储会使回头客偏少。

推断某个日期附近的可能访问来源，用 `python -B -X utf8 tools/query-site-visitors.py --around 2026-10-12 --city 上海 --days 14`，可加 `--org 电信` 等实际机构网络名或运营商名片段；`--days` 表示以该日期为中心的总窗口天数，默认 14 天。此模式额外列出匹配编号对应的首次观察时间、城市、机构网络、App、看过的页面和停留；结论只能写“可能”，不得据此确认是谁，也不建立投递记录。

停留优先采用离开/隐藏信标累计的实际可见秒数，同一页面实例的多次发送只取最大值；缺离开信标时用相邻页面的时间差后备（最多 30 分钟），最后一页保持未知。打开速度为 Navigation Timing 从导航开始到首字节、DOM 完成和 load 完成的毫秒数，只汇总已收到的字段。图片桶日志另统计 GPTBot、ClaudeBot、PerplexityBot、Bytespider、Amazonbot、meta-externalagent、Google-Extended 等声称的 UA 次数与日期，注明“只是下限，看不到只抓网页的爬虫”。

普通访客查询默认单列“简历来的（/cv）”（`entry.cv`），按首次已标记入口去重，包含人数、首次时间、城市、看过的页和停留；`/cv` 自动跳到首页，跳转本身不计阅读停留。

Before changing the website's product, page copy, styling, interactions,
navigation, project selection, content generation or public publication, or tools
or documents that can affect them, read the
[complete panel content contract](docs/design/panel-content-contract.md) in full.
It remains mandatory project rules; code paths are interpreted from the repository root.

## Product boundary

See [Product boundary](docs/design/panel-content-contract.md#product-boundary).

## Public-content gate

See [Public-content gate](docs/design/panel-content-contract.md#public-content-gate).

## Project expansion gate

See [Project expansion gate](docs/design/panel-content-contract.md#project-expansion-gate).

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
- Website content, design, writing and independent acceptance use the active
  native economy-routing policy. The owner removed the website-specific
  Astra-only/model-effort floor on 2026-09-22. Preserve the user's selected root
  model; choose whether to delegate and the child model/effort from the actual
  remaining difficulty, quality needs, independent-review value and total cost.
  Registry records this routing policy rather than a permanent website model.
  A null semantic_model/semantic_reasoning_effort means selection by the AI
  executor under that policy, never a literal provider/model name. Record the
  model and effort that actually ran; do not infer them from titles or defaults.
  Protected-action judgment qualifications remain governed separately by the
  active protection contract; ordinary website editing does not acquire them.
- A targeted refresh touches only the named project. A full refresh iterates all
  enabled projects but may leave most or all files byte-identical. It is a
  revalidation request, not permission to rewrite every page.
- Before the first fully accepted baseline release, omissions, riddle copy and
  blind-reader product defects are construction defects, not incremental drift;
  repair them from owning sources before publication instead of deferring them
  to a later requested refresh.
- After that baseline, an incremental refresh merges the affected new truth into
  current owning content. It must not replace richer valid prose with a shorter,
  older or generated snapshot; unaffected content stays byte-identical, and
  removal requires source evidence that the old product meaning is superseded.
- Before an incremental edit, the selected AI records a bounded semantic delta:
  product and technical additions, changes, retirements/replacements and
  Unknowns, followed by the affected Project, Rules, Skills and System surfaces.
  This is an AI-authored conclusion with Owner evidence, not hidden reasoning and
  not a deterministic content gate. Git paths and hashes only locate candidates.
- The website updates only when the owner asks to update it. There is no
  automatic weekly review or source-event refresh. If AI notices stale website
  content while doing other work, it mentions that fact in its report to the
  owner without handing off or creating a website task.
- Website content is not restricted by the personal-data lock (owner,
  2026-10-11 15:48 and 15:54). Researching, writing and refreshing website
  content may read the owner's private sources it needs, regardless of the
  current lock state and without asking for verification. The lock is not a
  reason to leave website content stale, Unknown or vague. What may actually
  be published is a separate question that still follows the public-content
  gate, the active global classification and page-specific rules (for example
  personal-health never publishes records). This exemption covers website
  content work only.
- During an owner-requested refresh, every dated figure the pages display
  ("截至……", "数字截至……", counts, sizes, states) is re-read from its current
  Owner source, including when the change came from a feature change rather
  than a commit. A figure that cannot be re-read stays with its old date and an
  explicit Unknown (owner, 2026-10-11 15:47).
- A frozen generator page that the current refresh would otherwise leave
  materially stale is rebuilt as a current typeset page in the same refresh,
  at the same quality bar as other pages; frozen pages untouched by the
  refresh stay frozen until a later refresh reaches them (owner, 2026-10-11
  03:19, 15:40 and 15:42).
- An owner-requested refresh closes Project, Rules and Skills pages through their own
  Owners first, then derives whether System still tells the truth. Git history,
  diffs and changed paths identify candidates only. When roles, use, boundaries,
  entry points and reader decisions are unchanged, System remains byte-identical.
  A `manual_owner_only` page without a fresh explicit owner request keeps its
  last verified published snapshot; another task does not manufacture newer facts.
- An unchanged source commit does not establish an unchanged snapshot. For each
  reviewed project, distinguish published implementation, local uncommitted
  changes and decision-relevant non-Git state such as inventories, indexed-text
  coverage, installed configuration and runtime receipts. Read the existing
  bounded read-only Owner entrypoints for displayed current facts even when
  Git is clean. Describe uncommitted behavior as a candidate, never as released.
  Refresh material state or coverage changes in place; retain dated historical
  test evidence without implying it was rerun. A cutoff, unavailable source or
  missing observation remains a named gap or lower bound, never an exact total
  or a fresh unchanged conclusion. Do not create a new collector, polling
  service or business-data mutation merely to obtain a website snapshot.
- The published site represents the last verified and released state. E release
  identity is the rule-version boundary; an on-demand refresh does not make every
  displayed fact live, and the site must not claim background freshness beyond
  the evidence and observation time it actually read back.
- Every owner-requested refresh ends with a plain-language report of
  the concrete changes: affected project or page, what changed in use or state,
  repairs, publication result and unresolved gaps. A no-op reports the checked
  scope and why no update was needed. Counts and passing tests do not replace
  this explanation. Report in the task reply, without adding a website update
  feed, duplicate cards or another scheduled task.
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
- Source changes do not dispatch website work. Changed paths only identify
  candidates for the next owner-requested refresh; a source task may mention
  material stale content in its report to the owner. Within the requested scope,
  update the corresponding registered snapshot and only its directly affected
  Project, Rules, Skills or System surfaces. A targeted request does not permit
  enumerating unrelated projects or running `refresh:ai -- --all`.
- Bind each accepted source delta to source identity, published read-back commit,
  changed paths, observation time and active generation. Reuse evidence only
  while its source inputs, E identity, Registry revision and owned surface still
  match. A descendant commit for the same source changes evidence rather than
  responsibility; it replaces only the same-source delta it actually includes.
- Keep one stable source-snapshot implementation responsibility and one publisher.
  Ordinary commit and normal push remain in the existing authorized source scope;
  do not create an otherwise unnecessary publication scope for routine Git closeout.
  Finish one coherent edit batch and its focused checks before freezing a stable
  publication batch; then run one final complete test/build/public-content gate
  and one final browser acceptance. A later material delta stays with the same
  publisher as the next bounded batch instead of restarting the closing batch.
- When the same failure class recurs twice without a source, input, code or
  environment change, diagnose the shared cause before another patch. Run any
  development or preview server in a controllable background session with a
  bounded readiness deadline, and stop only its owned process/session on success,
  failure or timeout; never await it as an ordinary foreground command.
- An enabled project with `ai_refresh.mode=manual_owner_only` enters a targeted
  or full refresh only when the owner explicitly asks to update it; the plan
  and result must carry that manual-owner-request fact. Source, Rule and Skill
  changes do not authorize a handoff or a new website task for any project.
- An owner-requested website update has one publisher. Any in-scope source
  evidence needed for that request stays with the same task; receiving evidence
  does not establish that the update has been read, merged or published.
- Default is no website change. AI updates a project only when leaving the page
  unchanged would make a displayed capability, boundary, current state, usage
  or user decision materially wrong. Small source updates never trigger a
  website task.
- Refreshes replace, merge or remove existing content in place. They do not add
  update logs, duplicate evidence sections, new cards or timeline entries merely
  because another refresh occurred. A 40+ project panel must remain readable;
  unchanged projects and unchanged sections stay byte-identical.
- Before publishing a refreshed snapshot, inspect the current source owners for
  contradictions, missing product explanations and broken validation paths.
  The owner has explicitly authorized necessary source-project repairs,
  including product functionality, and corrections to these website project
  rules within the requested goal. Repair real defects through their owning
  source and preserve its boundaries; do not ask the owner to repeat ordinary
  implementation permission or use a page edit to disguise a source defect.
  Publish the repaired state. This authorization does not create additional
  product goals; defects that cannot be repaired in the same goal remain
  visible as named gaps.
- The four-project MVP and the existing PUBLIC destination are owner-accepted.
  Subsequent registered project and Skill refreshes, including the selected
  TimeAudit, PC Panel Hub, manually requested CACB, learning-method, Codex
  Remote, personal-health, WeChatDirect, personal-materials, document-materials,
  work-delivery, daily-preferences, personal-media, LocalOCR, vault-tool,
  video-scaffold, AI CLI Profile Manager, OpenClawGateway and Sunshine remote
  streaming additions, are standing-authorized to commit, normal-push
  existing PUBLIC `main` and complete publication and read-back under
  [docs/publish-and-scan.md](docs/publish-and-scan.md) automatically
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
- Choose native subagents, including semantic authors and independent reviewers,
  through the active economy route and real host capabilities. No website-wide
  model family or effort minimum is imposed. Use sufficient capability for the
  remaining task and preserve independent judgment; zero delegates is valid.
  A task name does not prove actual model/effort, and ordinary tools can perform
  mechanical collection and tests without becoming semantic decision-makers.
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

- 按需更新执行清单见 [docs/ondemand-update.md](docs/ondemand-update.md)；常驻工作树与回退操作见 [docs/maintenance.md](docs/maintenance.md)，发布和回读契约见 [docs/publish-and-scan.md](docs/publish-and-scan.md)。
- Preserve the current `scripts/build-site.py` -> `site-astro` single build and
  route-generation chain; see [site-astro/README.md](site-astro/README.md).
- Verify build, direct routes, custom 404, keyboard navigation, desktop/mobile
  overflow and browser console before normal-pushing `main`.
- Content acceptance is a real reading test, not a schema check: for a sample
  from every content type and every displayed Skill, a first-time reader must
  be able to restate its practical use, concrete risk, example and final result
  without opening the source Skill or asking a follow-up question. Automated
  field checks are supporting evidence only. For each reviewed project the
  reviewer must also be able to describe its real inputs or collected data,
  their named sources and the resulting output without relying on the owner's
  private knowledge. Missing meaning is a content defect even when all names,
  links, counts and tests exist; correct the owning explanation, not just a
  glossary or a passing assertion.
- Content completeness is a separate, source-first acceptance gate. Before a
  new project, full refresh or completeness repair may PASS, an independent
  reviewer selected through the active economy route receives the current source entrypoints and the candidate
  page without being given the page's module list as the expected answer. It
  must reconstruct important product capabilities and technical subsystems,
  compare both layers with the page and report any absent source-backed axis.
  One P0 capability omission blocks content acceptance and publication; a
  reader test, green build or prior page-internal audit cannot waive it.
  When the owner explicitly permits the main task to proceed without subagents
  and no verified native review interface exists, record the main task's actual
  source/content review and the independent-review gap separately. Do not invent
  a reviewer, substitute a local model, or lower the content-completeness floor.
- After the accepted MVP, local preview remains required product evidence but
  is non-blocking for ordinary registered refreshes and selected new projects,
  including WeChatDirect, personal-materials, document-materials, work-delivery,
  daily-preferences, personal-media, LocalOCR, vault-tool, video-scaffold and
  AI CLI Profile Manager and OpenClawGateway:
  open the project index, Overview and representative detail, notify the owner,
  then continue to the already authorized PUBLIC release unless the owner says
  to hold. Preview never substitutes for content reading, tests, Pages or
  public read-back.
- The public-content gate scans every tracked/unignored source file and every
  production artifact regardless of extension. Directory-route canonical,
  Open Graph and sitemap URLs use the trailing-slash URL that Pages serves as
  `200`, not the redirecting form.
- Verify source commit, built artifacts, resource upload, Pages deployment and
  public read-back separately under [docs/publish-and-scan.md](docs/publish-and-scan.md).
  Source push alone does not establish public completion.
