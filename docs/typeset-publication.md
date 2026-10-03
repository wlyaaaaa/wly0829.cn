# 程序排版页面的发布准备

这套入口把程序排版页面混入当前生产网站，保留已经上线的首页、未发布的旧页面和资产。默认只检查本地证据。全站预览与程序验收逐项通过、Claude 看过结果并明确发出一条“发布”指令后，才执行带 `-Publish` 的命令。本人尚未视觉验收不影响发布。

执行依据是本人北京时间 2026-10-03 10:15 的更正（指令 `55676eb6-6494-4d9c-923c-92205c8bbce5`）：此前必须本人认可的门已撤销，改为 Claude 的明确发布指令；真实程序问题仍须解决，确认上线失败时精确自动回退，传输不明时不盲目回退。

旧 `publish-hybrid.ps1` 的批准条件针对旧图页；新程序排版不能拿旧 `pages-approved.json` 当成通过凭据。新入口复用 `hybrid-release.py` 的混合清单校验、基线包装和 Git 精确恢复，不另建部署工作流。

## 准备什么

| 参数 | 内容 |
|---|---|
| `TypesetRoot` | 每页一个目录，目录内有本代 `page-manifest.json`、图片和链接坐标文件 |
| `Inventory` | 当前 `screens.jsonl`，含页面、逻辑屏、源路径和源指纹 |
| `Geometry` | 显式传入的本代 DOM 量测快照，例如 `integration/motion-geometry.json`；本地检查与发布前重建必须使用同一个文件 |
| `Baseline` | 当前实际生产静态包，必须包含已经上线的首页；优先使用已核对生产身份的 `site-release` 或完整生产包 |
| `BaselineManifest` | 与基线完全对应的清单；省略时读 `Baseline/release-manifest.json` |
| `Release` | 构建器输出的完整混合静态包，带 `wly.hybrid-release.v1` 清单 |
| `BuildReport` | `wly.typeset-build.v1` 的本代构建报告 |
| `Verification` | 同一构建及版本的 `wly.typeset-verification.v1` 桌面、手机 DOM 验收 |
| `Directive` | Claude 看过全站程序验收后实际发出的 `wly.typeset-publish-directive.v1`；本地检查可以省略，此时完整回执标记发布指令缺失并阻断，不生成替代指令 |
| `LegacySite` | 发布前重建需要的既有静态网站目录，`-Publish` 时必填 |
| `AssetCache` | 可选的已验证无损传输缓存；省略时沿用审查过的构建报告中的路径，快照构建不另起重复缓存 |
| `Pages` | 可选的明确页名列表；省略时检查当前期待的全部 84 页 |
| `RunRoot` | 可选的新目录，保存本次准备、上线回读和回退材料；默认在 `.publish/` 下 |
| `LockHolder` | `-Publish` 时必填，格式为 `Claude/真实任务号` 或 `Codex/真实任务号`；不自行生成虚构任务号 |

基线必须反映当前生产网站。原 `online-production-manifest.json` 曾记录旧生产快照；它是否适用由本轮生产字节决定，不能因文件存在就继续用。发布入口会在拉取最新 `origin/main` 后，把本地基线全部文件与该提交的 `site-release` 对齐，并核对线上发布清单和首页字节。基线里未包含当前上线首页、漏文件或字节不一致时停止。

## 本代证据怎样对应

上游还在重出图时，先用 `snapshot-typeset-inputs.py --typeset-root 原排版目录 --inventory 原库存 --output 新快照目录` 保存一组稳定输入。随后 TypesetRoot 指向快照的 `typeset-out`，Inventory 指向快照的 `typeset-inventory/screens.jsonl`，Geometry 保存于同一快照。源定稿和 PNG 保持原字节，HTML/CSS 的实际文件引用指向稳定副本；明确声明的截图 file/full 通过 snapshot.json 的 resource_map 读取副本。系统字体保持原 URI，记录 SHA 与字节数并作为构建外部输入核对。快照只服务本批构建的实际依赖，不备份未使用裁片或原图溯源库；后来的源变化进入下一批。

构建报告须有 `pages` 对象、完整输出 `files`、`baseline_root`、`baseline_index_sha256`、`built_at_beijing`、`geometry_path` 和 `geometry_sha256`；可记录当前 `baseline_production_commit`。每页须有 `url`、`status`、`html_sha256`、`issues`、`inputs`、`quality` 和同一 `geometry_sha256`。`inputs` 的键是绝对路径，值是 `sha256`、`bytes`；全局共有输入也可放在报告顶层 `inputs`。每页清单、清单列出的全部图片和链接文件、库存及对应源文件都必须有本代输入指纹。构建器把实际秒数写入报告的 `seconds`；它是测得的统计值，不是调用者填写的 `--seconds` 参数。

geometry 快照须为 `wly.typeset-geometry.v1`、`geometry_version: 2`，使用与生产 PNG 相同的视口高度量测。每个实际发布页的屏、方向须恰好覆盖其清单，不缺失、不重复；每条记录的生产 HTML 路径与 SHA-256、按清单顺序排列的 PNG 分片尺寸与 SHA-256 都须对应当前文件，量测没有 `issues` 或 `broken_images`。程序直接读取 PNG 文件头核对尺寸，不看图片。快照本身也须登记在构建 `inputs` 中，文件指纹同时进入 DOM 验收和发布证据。全局 `complete` 标记不能替代逐页覆盖校验；部分批次可以使用只完成该批次的快照，未测完的页仍不可发布。全缺 geometry 的旧构建即使有图片，也不具备发布所需证据。

渲染器质量报告按真实状态记录。旧记录、没有 `status`、`visual_pending`、`legacy` 和纯视觉 `incomplete` 不会单独拦住发布，也不会被改成“源质量通过”；Claude 要看报告里的这些待看或未知项，再决定是否发布。报告明确的 `fail`、G1–G6 实际失败及真实问题列表仍会阻断，发布指令不能绕过它们。缺图、缺热区、错误链接、截图或实时槽位丢失、视频或动效程序验收失败属于必修问题。

DOM 验收须包含 `build_report_sha256`、`release_id`、`verified_at_beijing` 和逐页结果。每页的 `url` 与构建一致，`status` 为 `pass`，`checks` 同时覆盖 `width: 1440` 与 `width: 390`，每条 `issues` 都为空。程序检查真实字段、指纹和页面字节；它不会冒充主观的视觉验收。

每页构建还须有 `effects_expected`，只列旧站真实具备的能力。每页验收的 `effects` 是独立对象，须为 `status: "pass"`、`issues: []`；它的 `expected` 与构建一致，`preserved` 覆盖这些能力。证据必须真实包含 `normal_branch`、`new_geometry_bound`、`hotspot_css_feedback`、`native_buttons_bound` 均为 `true`，`geometry_sha256` 与本代快照一致，`geometry_counts` 的 cards、numbers、dots、arrows 是新布局的非负整数，`running_animation_count` 是实际观察的非负整数。`new_geometry_bound` 来自正常 DOM 对当前 `page-data` 中分片坐标和尺寸的真实绑定检查，单独一个布尔值不证明量测输入正确。新组件数量可以变化，不与旧图片坐标或旧组件数量硬比。正常分支未验、绑定假几何、原有实时槽位、截图、点击、悬停或动效缺失都不放行。

`effects.evidence.checks` 须恰有 1440 与 390 两档正常分支观察，各自记录真实绑定、交互、原生条件、组件数、动画数和保留能力，`issues` 为空、`hidden` 与 `reduced_motion` 为假。顶层组件数须等于两档观察之和，动画数为两档最大值，保留能力须等于两档观察的并集；只有汇总值、缺少实际分档观察的旧文件不能放行。无视频页也须在这两档真实观察 `hero_video_attached: false`、`video_spec: null`。

每页构建须明确 `video_expected: null` 或现役视频与 mask 的 src、bytes、sha256。`video_checks` 也是独立对象，不能用它的条件测试替换普通桌面和手机检查。存在视频时，须同时有视频和 mask 两项文件证据，HTTP 为 200，实际 bytes、sha256 与构建期待值及最终包一致；desktop（1440 横屏）、below_width（1023）、portrait（390 竖屏）、reduced_motion、offscreen、document_hidden 六个条件都须通过，实际展示和播放与期待完全一致。`mounted` 记录有效展示的播放器，`attached` 另记仍有播放器对象；只在宽度至少 1024、非竖屏、可见、非减弱动效且文档未隐藏的分支展示并播放。无视频的页面必须真实观察 `mounted: false`，文件和条件列表为空；缺证据不当作“本页没视频”。

视频文件相对 `src`、`mask` 按实际页面 URL 解析，须与发布清单的完整资产路径一致。六类条件分别用正常页面分支观察；每条须记录真实的 `reduced_motion`、`portrait`、`section_visible`、`hidden`、`attached`、`phase` 和 `time_advanced`。desktop 须真正展示、播放且时间前进；其余五类须停止有效展示和播放，时间不增长、状态为图片。禁用条件下可以保留播放器 DOM，`attached` 如实记录；仍有播放器时必须实际观察 `video_paused: true`、`video_hidden: true`，并记录停止前后的播放时间。desktop 的两项值须为假。`section_visible` 只在 desktop 要求真、offscreen 要求假；竖屏里被隐藏的横屏分片可以如实记录为假，不把它误报为视频条件失败。

减弱动效使用 Chrome 原生媒体条件。文档隐藏使用真实导航：先在 1440 横屏正常播放，再把本地验收 iframe 导航到 `about:blank`，捕捉旧文档原生的 `visibilitychange` 和 `doc.hidden: true`，保留旧对象引用观察网站自身的暂停、隐藏与图片状态，等待 350 毫秒确认播放时间没有增长。证据须有 `method: "navigation_visibilitychange"`、真实来源页、目标、`visibility_event_observed`、`visibility_state: "hidden"`、`parent_hidden: false` 和 `before_navigation` 的实际可见播放正例。无头 Chrome 另开一个标签不会可靠地隐藏旧文档，不用这个动作冒充验收，也不能改写 `matchMedia` 或 `document.hidden`。视频的新位置来自本代量测；用于同图匹配的原插图资产清单也须登记为构建输入。

首页保持当前生产字节；`rules-home` 必须保留经过现役 video-5 审核的视频和 mask 原字节。源图片、源 HTML 和新布局几何的输入指纹属于本代构建绑定。旧审查模式的结果或缺正常分支证据的旧验收文件不能冒充本轮通过。

Claude 发布指令的字段如下。下面是**未发出指令的结构示例**，执行入口会拒绝它：

```json
{
  "schema": "wly.typeset-publish-directive.v1",
  "instruction": "待 Claude 明确发出发布指令",
  "reviewed": false,
  "pages": ["实际指令覆盖的页名"],
  "build_report_sha256": "实际构建报告的 SHA-256",
  "release_id": "实际静态包的版本标识",
  "recorded_by": "Claude",
  "instructed_at_beijing": "实际指令时间，含 +08:00",
  "source": "可回查到 Claude 这条发布指令的编号或原话"
}
```

只有 Claude 看过本代全站程序验收结果且实际发出“发布”以后，才把真实指令记录为 `instruction: "发布"`、`reviewed: true`，填入实际版本、页名和出处。脚本不生成指令、不伪造通过，不把程序构建成功解释为 Claude 已经看过结果。所有证据时间均采用带 `+08:00` 的北京时间。

指令覆盖的页名必须与本次请求完全相同；发布清单的 `accepted_pages` 必须恰好对应这些页的 URL。首页任何别名都不能出现在接受清单中，最终 `index.html` 必须与生产基线逐字节一致。`404` 使用 `/404.html`。

`github-profile` 的源没有网站原路由，本地 `/github-profile/` 仅供预览；发布准备明确阻断它，报告为“Claude 待确定发布目标”。此入口不默认新增它的网站页，也不改 GitHub README。因此，当前 84 页默认整批检查会如实指出它尚未就绪；其他页的质量或验收缺口也逐项列出。

若 Claude 的明确发布指令只覆盖部分网站页面，传精确的 `-Pages` 列表，构建、程序验收与指令须针对同一部分批次。回执标 `batch: partial` 并列出全部 `deferred_pages`；部分批次不能报告为全部 84 页完成。

## 本地检查命令

上游重出图片后，在网站工作副本中填入本轮文件的实际路径，运行下面一条命令即可重新冻结输入、量测全部横竖版面、构建 84 页、执行两档布局和视频动效验收，并写本地发布准备回执。`RunRoot` 必须是新目录，旧证据保留；命令使用本机安装的 Chrome、独立临时配置和系统分配的本地端口，结束时关闭自己启动的服务和浏览器。它不执行 Git 或发布动作。

```powershell
python scripts/check-typeset-site.py `
  --typeset-root '当前 typeset-out 的绝对路径' --inventory '当前 screens.jsonl 的绝对路径' `
  --baseline '已核对生产基线的绝对路径' --legacy-site '既有静态网站的绝对路径' `
  --asset-cache '本轮已验证的无损缓存目录' --run-root '新的检查目录'
```

当前任务的运行依赖是登记过的 Python、现有 Playwright 和已安装的 Chrome，精确运行路径写在该轮汇报里。换机器时使用当地已验证的 Python 和 Chrome；`run-typeset-checks.py --chrome` 可显式指定同品牌安装。临时配置、日志、快照和编译产物均写在任务目录所在的数据盘。浏览器临时配置随后按活动规则回收；检查脚本不会永久删除它们。

`local-run.json.summary` 区分通过、失败和未验页，`publication-preparation.json` 列出发布阻塞项。程序完成仍可以有失败页，发布准备也可以因真实问题或缺少 Claude 指令而阻塞。退出码 `0` 表示本地程序及成品检查通过，`2` 表示有失败或未完成；任何一种都不表示已经得到发布指令。几何检查无法消除的源 HTML/PNG 不一致会留下证据，继续构建并完成全部页面验收，不把失败版面硬拉伸到通过。

已有稳定快照需要复验同一批次时加 `--snapshot '该快照目录'`，其他参数不变；要验上游最新产物时省略它。新的几何文件写入新的 RunRoot；已有快照含几何时只复制到本轮后继续量测，不覆盖旧证据所依赖的文件。不要把旧快照的通过结论套给重出的源文件。

在网站工作副本中执行，填写本代成品、程序证据和 Claude 实际发布指令的路径：

```powershell
$parameters = @{
    TypesetRoot = '本代排版根目录'
    Inventory = '当前 screens.jsonl 的绝对路径'
    Geometry = '本代 integration/motion-geometry.json 的绝对路径'
    Baseline = '当前生产静态包的绝对路径'
    Release = '本代完整混合 dist 的绝对路径'
    BuildReport = '本代 build-report.json 的绝对路径'
    Verification = '本代 verification.json 的绝对路径'
    LegacySite = '当前既有静态网站的绝对路径'
}
# 尚无真实指令时省略 Directive，得到明确阻断的完整本地回执；已有指令才填其实际路径。
# $parameters.Directive = '真实 publish-directive.json 的绝对路径'
& ./scripts/publish-typeset.ps1 @parameters
```

也可直接运行 Python 准备器；`prepare` 可以省略：

```powershell
python scripts/prepare-typeset-release.py prepare `
  --typeset-root '本代排版根目录' --inventory '当前 screens.jsonl' `
  --geometry '本代 integration/motion-geometry.json' `
  --baseline '当前生产目录' --baseline-manifest '当前生产清单' `
  --release '本代完整 dist' --build-report '本代构建报告' `
  --verification '本代 DOM 验收' `
  --output '.publish/typeset-preparation.json'
```

默认命令只读取成品和证据，写本地准备回执；不构建、不拉取、不合并、不暂存、不提交、不推送、不联网。准备回执写在静态包外，保持验收过的成品字节不变。Python 准备器退出码 `0` 为就绪，`2` 为阻断；PowerShell 包装入口遇到阻断时失败退出，提前显示同一回执的路径。其他必需输入文件缺失或损坏也以失败退出。

尚无实际发布指令时，`directive_sha256` 为 `null`，回执包含 `publication_instruction` 阻断项。检查其余证据不需要另造“待发布”文件。真实指令到达后才在 Python 命令加入 `--directive '实际文件'`，或填写 PowerShell 参数 `Directive`；带 `-Publish` 但没有真实指令，也会在任何网络或 Git 动作前停止。

## Claude 明确指令后的一键发布

先由本轮唯一发布者把经过审查的源码定向提交在 `prep/*` 分支。Claude 看过全站程序验收并明确发出对应批次的“发布”以后，在同一参数基础上运行，锁持有人填写当前宿主和真实任务号：

```powershell
& ./scripts/publish-typeset.ps1 @parameters -LockHolder 'Claude/实际任务号' -Publish
```

发布流程依次执行：

1. 核验原成品、真实程序故障、全站预览、桌面和手机视频动效证据及 Claude 明确发布指令，检查工作副本没有未提交或来历不明的改动。
2. 经活动规则的 `Invoke-ShortLock.ps1` 先 Inspect 再 Acquire `website-publication` 短锁，正常拉取并合并最新 `origin/main`；别人的有效锁不抢，冲突时不强推、不覆盖其他改动。
3. 核对当前生产身份和保留首页，调用 `build-typeset-site.py --typeset-root --inventory --geometry --baseline --legacy-site --output --report`，显式使用检查过的 geometry 路径，部分批次再带 `--pages`。
4. 重建的 `release_id` 与原指令版本必须相同；原报告的输入和输出指纹也须完全匹配重建包。准备器带 `--rebuilt-report` 再核对重建报告，每个选中页须仍为 `built`、无 `issues`，输入、HTML、质量和视频动效契约与审查过的报告一致。构建时间、实测秒数和输出目录可以变化，新报告不替换原程序依据。任何版本、输入、HTML 或程序契约改变时，停止，对新包重新做全站程序验收、Claude 看结果并发出新指令；不要求本人先验收。
5. 运行既有混合内容检查和公开内容检查，把当前生产包包成精确回退版本并定向提交到 `site-release`，从这个 Git 提交提取一次精确恢复进行校验。
6. 写入回退引用和逐页清单、构建、源质量状态、DOM、Claude 指令的真实指纹后，把本代成品复制至 `site-release`，再次验证，定向暂存并正常提交，推送 `HEAD:main`。这一步只更新发布清单元数据，HTML 和资产保持程序验收过的字节。
7. 回读远端 `main`，等本提交的 `.github/workflows/pages.yml` 成功，逐个核对线上 HTML 与资产指纹，最后再次核对本地和远端提交一致。全部完成才记录 `published`。等待与回读期间续领短锁，退出时在 `finally` 释放。

脚本复用已有登录，不执行 `gh auth login`、改账号、改令牌或改代理。`-Publish` 是实际合并和发布入口；本轮只准备代码和文档时不要执行它。

## 耗时怎样估计

准备回执的 `local_build_statistics` 引用实际构建报告，列出页数、发布文件数和总字节数。本轮 full-13 记录 84 页、2,844 个文件，构建实际 54.252 秒，两档布局及视频动效检查实际 342.703 秒；复用快照的完整本地流程实际 492.383 秒。完整源快照另测得 140.265 秒，源图重出后的首次无损压缩可能更长。该代仍有真实问题，计时完成不代表发布就绪。只有有限、非负的实测秒数才显示为 `elapsed_seconds`，其余保持未知；耗时统计缺失不会另设发布审批。

Git 上传尚未实际测速，上传时间和总发布时间目前是未知值；字节数也不能直接当作 Git 实际压缩传输量。实际发布会把本轮重建秒数、正常推送秒数写入 `publication-state.json.timings`，以后才可引用同规模实测作参照。Pages 的默认二十分钟是等待上限，不是预计耗时；线上读回也受实际下载速度、文件数和是否需要重试影响。不得把本地程序通过时间写成包含上传、部署和读回的总上线时间。

## 回读与精确恢复

线上回读采用有限重试，分别记录真实字节不符与网络结果不明。默认三轮确认，每轮未解决文件再做三次读取，轮间隔十秒；已核对通过的同代文件沿前轮完整回执保留，后续只重查未解决文件和发布清单。三轮均出现同样的错误文件与错误指纹，才认定持续字节不符；错误变化、传输中断、接口超时或不可核对的结论都记录为不明。

Pages 明确终态失败，或者持续字节不符被确认后，自动执行原 `rollback-hybrid.ps1 -RestoreRef <精确引用> -Publish`：先再次核对本地 HEAD、远端 `main` 仍是本次推送，原工具再 fetch 并检查二者一致，用原字节正常提交推送，等回退 Pages 成功并回读旧 HTML 与全部资产。发现别人的后续提交时停止自动恢复，不强推、不回掉后续提交。恢复通过记为 `rolled_back`，发布命令仍以失败返回，让调用者知道新版本没有完成上线。

未知结果不会盲目恢复。三轮后仍不明时保留 `pages_unknown`、`readback_unconfirmed` 或 `rollback_unconfirmed` 和原因，由 Claude 继续核查；需要改为尽力恢复时，依据本人或 Claude 的后续明确指令再执行。`publication-state.json` 记录已推送、恢复是否发送、Pages、线上指纹及并发状态，不把它们写成已经完成。

只重试线上验证，不触发推送或回退：

```powershell
python scripts/prepare-typeset-release.py readback `
  --release '本轮已推送的 site-release' `
  --output '.publish/typeset-online-readback-retry.json'
```

回读覆盖发布清单内全部 HTML 与资产。`CNAME` 是 GitHub Pages 的部署元数据，不能通过普通网页读取，单独列为不经 HTTP 读取的部署文件。Python `readback` 单独执行只读网络，退出码 `0` 为全部通过、`2` 为字节不符、`3` 为网络结果不明；自动恢复由带明确发布指令和短锁的 PowerShell 包装按上述确认条件执行。

精确恢复也可沿用原入口先准备本地包。对未知结果的手工恢复，要先取得本轮后续明确指令并核对远端并发状态，再带 `-Publish`：

```powershell
pwsh -NoProfile -File scripts/rollback-hybrid.ps1 -RestoreRef '实际回退提交'
```

生产恢复后仍须等 Pages 成功并回读上线字节。保留本轮恢复包及对应 Git 引用，直到本代上线被确认且不再需要恢复；清理本轮临时材料遵照活动规则放进回收站，不永久删除来历不明的文件。
