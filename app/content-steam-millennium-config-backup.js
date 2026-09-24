import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以怎么用", "需要处理什么", "什么时候不可用"];
const sourceCommit = "5c65e9499b076ba745d9fe9358d7a72bd7cb2151";
const configCommit = "0b118b09670e0cfbff34cb99e031ea45fac8284f";

const steamMillenniumConfigBackupSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T19:27:00Z",
  label: "完整性快照、受控恢复与回滚已接入；最近任务成功，真实Steam效果仍待验",
  boundary: "只读核对正式源码、现行任务和快照状态；来源已提供中断恢复、G/H副本和选择性回填。最近任务结果0不代替Steam界面、逐插件加载或新机恢复。",
  metrics: [
    { label: "插件清单", value: "5 款 · 配置启用 3 款" },
    { label: "主题设置", value: "2 套 · 选中 Adwaita" },
    { label: "本地快照", value: "20 个配置文件 · 独立完整性清单" },
    { label: "最近自动采集", value: "最近任务成功 · 9月18日快照" }
  ],
  facts: [
    { label: "来源与发布", value: "PUBLIC仓库wlyaaaaa/steam-millennium-config-backup，默认master=5c65e9499b076ba745d9fe9358d7a72bd7cb2151已远端回读，工作树干净。当前工具提供采集、只读状态/验证、恢复计划、受控恢复、回滚和独立副本，不再只是文件复制脚本。" },
    { label: "当前可验证快照", value: "snapshot-manifest.json使用millennium.snapshot.v2，现有20个配置文件各自绑定字节数与SHA-256；状态代号20260918T044109Z-3baa6bc2e6e9，最后采集成功2026-09-18T05:26:00.471186Z，manifest_sha256=29afa8d8f0676565e3a12bfd50560f3008babffc269717a23e9d8325ba6ce28d。这是当前快照记录，不是再次运行采集或Steam内验收。" },
    { label: "安装观察与备份范围", value: "当前公开快照、源安装和实际Steam外观分开判断；9月8日Zehn/Adwaita版本差异及9月14日17/20字节一致是历史观察，不再当作当前失败。新版只发布明确支持的核心字段与清单，未知核心字段报告名称但不发布其值；插件私有设置、程序、图片和字体仍不在备份中。" },
    { label: "插件与启用配置", value: "快照记录 Extendium 2.0.4、Size on Disk 1.1.0、Easy SteamGrid 4.1.0、HLTB for Steam 2.1.0、Taskbar Download progress 2.3.0。plugins.enabledPlugins 为 size-on-disk、steam-easygrid、extendium；这是配置选择，本轮没有逐插件实际加载验收。" },
    { label: "核心设置", value: "general.accentColor=#00ff00，millenniumUpdateChannel=stable，injectCSS=true、injectJavascript=true；themes.activeTheme=Adwaita-for-Steam。quick.css 定义 4px 滚动条、半透明滑块和透明轨道，实际作用范围取决于 Millennium 的注入与页面对相应 CSS 的支持。" },
    { label: "现役计划任务", value: "原SteamMillenniumConfigSnapshot任务保持每周日当地时间19:30、实际交互用户和普通权限；隐藏VBS调用PowerShell7及Python核心，错过补跑、最多3次15分钟重试、10分钟上限、忽略重入。新状态窗口可以刷新、采集和启停未来触发，关闭窗口不取消已登记任务。" },
    { label: "最近真实采集", value: "2026-09-18只读任务：最近2026-09-17T22:25:58-07:00运行，LastTaskResult=0；下一计划2026-09-20T19:30:00-07:00。成功记录为2026-09-18T05:26:00.471186Z。沿用现有Windows任务，没有为本网页重跑采集、恢复或新增调度器。" },
    { label: "历史验证（9月8日）", value: "2026-09-08的历史验收：源码原有测试实际通过 19 项断言，包含 Windows PowerShell 5.1 调用。隔离采集和回填的 20 文件均与来源 SHA-256 相同，19 个 JSON 可解析，3 个虚构插件程序/私有设置/主题资源保留。源码指南与 3 页 PDF 已修正并在 master 回读；真实 Steam 未重启、未安装或恢复。" }
  ],
  gaps: [
    "没有 Steam、Millennium、插件程序或主题图片/字体包；插件自建 config.json、账号状态与其他私有设置不在当前文件名白名单中。",
    "最新记录证明当前快照代号与任务最近成功，不证明每个主题/插件当前界面已恢复。重新安装后的版本和资源必须与所选快照核对，旧版本观察不能充当当前安装。",
    "新版是有持久前像和显式Recover的多文件事务，不是整个文件系统的全局原子替换。硬中断或外来修改可能留下待恢复记录；不能手删记录制造正常状态，真实断电仍未演练。",
    "JSON严格解析、支持字段白名单与已知敏感模式只构成有范围的防误发布检查，不是任意私人内容识别器。未知字段与插件私有设置不静默进入公开快照。",
    "9月8日隔离复制回填属于历史证据；当前来源增加了恢复计划、事务恢复及回滚测试。本网页未向真实Steam目录回填、未启停Steam、未验证全部插件加载或跨版本迁移。"
  ]
});

const steamMillenniumConfigBackupProject = {
  order: 31,
  slug: "steam-millennium-config-backup",
  usageEntry: "运行 tools/Show-MillenniumBackupStatus.ps1 打开状态窗口看周任务与最近快照；手动采集用 tools/Invoke-MillenniumBackup.ps1 -Mode Snapshot，恢复先用 -Mode RestorePlan 预览。",
  usageInputs: ["这次要备份还是恢复","要恢复的日期或偏好（不确定可先看版本列表）","恢复后想保留的插件和主题"],
  title: "Steam Millennium 配置备份",
  kicker: "留住 Steam 外观选择，恢复之前先看会改什么",
  route: "/projects/steam-millennium-config-backup",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "最近采集成功；恢复先预检，冲突可保留并回滚",
  cardStatusTone: "mixed",
  ...steamMillenniumConfigBackupSnapshot,
  summary: "定期保留Steam的Millennium核心设置、自写样式、插件清单与主题选择，改坏界面或重装后不必靠记忆重新调整。现在可以先看恢复计划，再只回填支持的设置，保留新机器的网络配置和未知字段；遇到冲突或中断就保留现场，按记录继续或撤回。程序、主题资源和插件私有数据另行安装或恢复，最终仍要打开Steam确认实际效果。",
  why: "Steam 的绿色强调色、圆角、标题栏、插件开关分散在不同配置中，调好一次不代表换电脑后还能找回来。这里保存难以凭记忆重做的选择和安装线索；程序与主题资源另行取得，让备份的范围和恢复时还要做的事情都清楚。",
  plainExample: "“我把Steam界面改乱了，先告诉我恢复上一份配置会改哪些地方，别直接覆盖。”工具先列出可恢复项、版本和资源缺口。确认并退出Steam后才执行，保留回滚点；重新打开后再核对主题、样式和插件，必要时撤回未被后来改动的那一轮。",
  result: "得到带完整性清单的配置快照、独立副本结果、最近任务状态和可回滚恢复计划。无变化不会重复造一代；源读取不完整、目标被别人修改、G盘不可用或恢复条件不足时分别报告，已成功的本地副本不因另一层失败而被抹掉。",
  readerStates: {
    pass: "当前快照清单与文件验证通过，来源稳定时才更新；恢复计划无阻断且对应实际目标，明确执行后回读受支持配置并保留回滚点。Steam最终显示另行验证。",
    problem: "来源文件变化、目标有手工改动或两边路径重叠时先处理冲突；版本不同要核对实际选项，不把旧快照当作当前安装。",
    unavailable: "Steam 安装目录或需要的程序资源不可用时，本次配置采集或界面恢复不能完成；现有快照仍保留，插件私有设置另行恢复。"
  },
  repositoryNote: "公开仓库保留白名单中的 Millennium 核心设置、自定义 CSS、插件清单及主题选项，同时保存快照脚本和恢复说明。程序、主题资源、账号凭据及插件私有设置不在这份配置备份中；已提交版本、本地配置改动和当前安装状态分别展示。",
  searchAliases: ["Steam Millennium 配置备份", "Steam皮肤备份", "Millennium配置备份", "Steam主题恢复", "Adwaita-for-Steam", "Zehn", "第30项目"],
  searchProjection: {
    intents: ["备份 Steam 的主题和插件设置", "重装电脑后恢复 Steam Millennium 外观", "找回 Steam 的绿色主题和细滚动条", "查看 Millennium 配置最近有没有备份"],
    entities: ["Steam", "Millennium", "Adwaita-for-Steam", "Zehn", "quick.css", "SteamMillenniumConfigSnapshot"],
    relations: ["Millennium 加载主题和插件，本项目保存其配置与清单", "程序重新安装，配置合并回填，插件私有设置另外核对", "每周采集更新本地目录，不自动提交 Git"]
  },
  components: [
    { name: "config/config.json", responsibility: "保存核心设置和实际选择", implementation: "general 保存强调色、更新和注入开关；plugins.enabledPlugins 保存启用名单；themes 保存当前主题、conditions 选项和 themeColors 配色。" },
    { name: "config/quick.css", responsibility: "保存自己的样式修改", implementation: "::-webkit-scrollbar 定义宽/高 4px，滑块 rgba(0,0,0,0.1)、悬停 0.25，轨道透明。复制文件不证明实际界面所有滚动区域都应用了它。" },
    { name: "plugins/", responsibility: "留下重装插件的线索", implementation: "只保存 plugin.json、metadata.json 和存在时的 install-state.json；清单描述用途、版本、后端类型及上游提交，不包含插件可执行源码。" },
    { name: "themes/", responsibility: "保存主题定义及版本记录", implementation: "Adwaita 保存 metadata/skin/theme；Zehn 保存 metadata/skin/options/waifus。定义中的 CSS 资源路径仍依赖重新安装的主题资源。" },
    { name: "tools/millennium_backup.py 与 Invoke-MillenniumBackup.ps1", responsibility: "定位、筛选并采集快照", implementation: "PowerShell7.2+启动Python3.11+标准库核心，严格解析和白名单采集；源前后稳定性、目标清单、固定锁、持久前像、文件回读与清单最后发布共同形成可恢复事务。旧脚本名仅作兼容入口。" },
    { name: "tools/register-millennium-config-snapshot-task.ps1", responsibility: "建立每周任务", implementation: "配置交互登录用户、周日 19:30、错过补跑、3 次间隔 15 分钟重试及 10 分钟上限。重新运行会创建或更新任务。" },
    { name: "tools/snapshot-millennium-config-hidden.vbs", responsibility: "隐藏调用窗口并传递结果", implementation: "VBS隐藏启动PowerShell7，等待并传播退出码；WindowsPowerShell5.1仅保留启动兼容，不再执行备份核心。任务与人工运行使用同一固定目标锁。" },
    { name: "README.md / README.pdf / tests/run-snapshot-tests.ps1", responsibility: "指导操作并验证关键行为", implementation: "现行指南、核心Python回归和Windows集成分别覆盖连续采集、有效删除、读取不完整、冲突、中断、恢复计划、回滚和副本；9月8日19项断言保留为旧版历史，不冒充新版完整验收。" }
  ],
  technicalContracts: [{"artifact":"采集范围与公开投影","schema":"millennium.snapshot.v2","owner":"tools/millennium_backup.py","boundary":"核心只保存支持的config.json字段与quick.css，插件/主题只取明确的清单文件。严格JSON拒绝重复键、截断、非有限数字和错误类型；未知核心字段报告但不公开值。源目录完整可读且稳定时才传播正常卸载，缺源不是删除。"},{"artifact":"内容代际与保留","schema":"snapshot-manifest.json / millennium.current.v2","owner":"配置快照核心","boundary":"每份清单绑定文件字节与SHA-256；与上一份生成清单比较，不要求每次采集后Git提交。runtime/snapshots默认4份、Keep允许2–32；无变化仍验证、不生成重复代。每文件8MiB、一次64MiB、最多4096文件。"},{"artifact":"中断事务","schema":"millennium.transaction.v1","owner":"配置快照与Recover入口","boundary":"效果前持久保存原件与计划，逐文件替换、清单最后发布；未完成事务使正式读取拒绝。Recover在固定目标锁内校验原记录并恢复，外来修改保留。不是全文件系统原子操作，未知旧记录不能直接删除。"},{"artifact":"恢复计划与回滚","schema":"millennium.restore-plan.v2 / millennium.restore-rollback.v2","owner":"RestorePlan / Restore / Rollback","boundary":"计划零写入，Restore要求ExpectedPlan仍匹配；真实Steam安装目标须先退出Steam但工具不替人结束进程。只合并支持字段和CSS，保留网络与未知字段，不覆盖安装清单、程序和资源。回滚核对当前目标仍是本轮结果，冲突不覆盖。"},{"artifact":"状态与独立副本","schema":"millennium.snapshot-state.v2 / millennium.replica.v2","owner":"本项目；PCConfig拥有G/H介质绑定","boundary":"last-run记录最近尝试，成功状态绑定代号和清单。G复制当前及保留历史并逐份验证，失败保留本地结果但任务非零；H复用PCConfig冷备。任务、Git、G/H与实际Steam恢复分别验收。"}],
  evidenceLayers: [
    { layer: "源码和远端提交", proves: `工具及公开指南由 master=${sourceCommit} 回读；7 个既有本地配置改动原样保留。`, doesNotProve: "本地新配置已提交，或远端版本就是今天的安装状态。" },
    { layer: "安装目录只读比对", proves: "当前读取正式快照清单及成功状态；9月14日安装17/20一致仍只保留历史日期，不把它延伸为今天的完整安装比对。", doesNotProve: "这些插件都已加载、界面样式都生效或新旧版本兼容。" },
    { layer: "计划任务及采集记录", proves: "原任务最近结果0，当前状态绑定9月18日快照代号与清单哈希；没有为网页触发任务。", doesNotProve: "未来每次执行成功、未登录时也运行，或自动同步到了 GitHub。" },
    { layer: "原有 19 项隔离断言", proves: "来源新版测试涵盖连续采集、内容校验、中断恢复、回滚与副本；本网页只读取其合同与测试入口，不冒称重新执行。", doesNotProve: "任意凭据识别、全量 JSON schema 校验、真实界面恢复或完整重试故障演练；两项重试断言只是读取注册脚本。" },
    { layer: "9月8日隔离采集与回填", proves: "20 个文件在采集及回填后分别与来源字节一致，19 个 JSON 可解析；虚构程序、私有设置和主题资源均保留。", doesNotProve: "Steam 实机恢复、插件执行成功或跨版本无损还原。" }
  ],
  operationalEntrypoints: [{"name":"只读状态与完整性","command":"pwsh -File tools/Invoke-MillenniumBackup.ps1 -Mode Status; pwsh -File tools/Invoke-MillenniumBackup.ps1 -Mode Verify","purpose":"零写入检查，不创建目录或日志，不触发备份。"},{"name":"采集一次配置","command":"pwsh -File tools/Invoke-MillenniumBackup.ps1 -Mode Snapshot","purpose":"核对源、目标和机器绑定后采集；无变化验证后保持，不恢复七天节流或脏工作树绕过。"},{"name":"预检与受控恢复","command":"pwsh -File tools/Invoke-MillenniumBackup.ps1 -Mode RestorePlan -DestinationRoot <备份> -TargetRoot <目标>","purpose":"先取得plan_sha256；实际Restore另传-ExpectedPlan并满足目标版本、资源和Steam退出条件。"},{"name":"精确回滚或中断恢复","command":"pwsh -File tools/Invoke-MillenniumBackup.ps1 -Mode Rollback -DestinationRoot <目标> -RollbackId <本次编号>","purpose":"只撤回仍与本轮结果一致的对象；未完成采集事务使用Recover，不删除前像冒充完成。"},{"name":"可见任务管理","command":"pwsh -File tools/Show-MillenniumBackupStatus.ps1","purpose":"显示本地/G和任务，提供刷新、立即采集与启停未来触发；关闭窗口不停止原任务，H单独核对。"},{"name":"隔离回归","command":"pwsh -File tests/run-snapshot-tests.ps1","purpose":"虚构源与目标，不向真实Steam恢复、不安装插件。"}],
  technicalOperatingFlow: [
    { title: "平时把变化留下来", detail: "每周任务定位 Steam/millennium；检查没有覆盖冲突后，筛选文件、暂存检查并更新本地备份。成功时间与文件数写入 runtime，Git 提交另行进行。" },
    { title: "先确定用哪一份恢复", detail: "区分远端提交、本地尚未提交的快照和当前安装。需要恢复哪天的设置，就选那份实际存在的版本；当前机器比快照更新时不要误当成已经备份。" },
    { title: "装好程序，再合并配置", detail: "安装 Steam、Millennium 及需要的插件和主题。退出 Steam、保留目标配置副本，逐文件合并回填；保留新装程序及主题资源，不清空整目录。版本不同时先核对旧 metadata 和安装记录。" },
    { title: "从实际界面确认完成", detail: "启动 Steam，检查主题、颜色、滚动条和启用插件，再核对未备份的插件私有设置。上游资源缺失或配置键变化时，按实际版本处理；需要时回到目标机器保留的配置。" }
  ],
  operatingFlow: [{"title":"平时留下配置快照","detail":"周任务或手动 Snapshot 只采核心设置、样式、插件与主题清单；看最近成功与 G 副本状态。"},{"title":"恢复先选版本","detail":"区分远端提交、本地未提交快照和当前安装，先预览要回填的文件。"},{"title":"装好本体再合并","detail":"退出 Steam，保留当前配置副本，先安装插件主题本体，再逐文件恢复支持的设置。"},{"title":"在 Steam 里验收","detail":"看主题、颜色、插件启用与缺失的私有配置；快照不包括游戏、账号或整个程序。"}],
  productPrinciples: [
    { title: "优先保存自己的选择", detail: "保存核心配置、样式、插件线索和主题选项；可以重新取得的程序与资源另行安装。因此快照很小，也不能独自重建完整环境。" },
    { title: "定期采集，冲突时保留现场", detail: "按既有每周任务检查，真正无变化就不生成重复代，不再以七天节流代替内容判断。快照与上一份生成清单比较；手工修改、额外未知文件或Git读取失败会阻止覆盖，普通README修改不会阻断采集。" },
    { title: "备份新不新，要和安装状态比较", detail: "成功采集、Git 提交、实际安装是不同事实。今天的插件更新不能因为昨晚备份成功就被算进那份快照。" },
    { title: "恢复以能用为准", detail: "合并文件只是一步，程序、主题资源、版本适配和插件私有设置都可能影响结果。最终需要看 Steam 界面和插件表现，不把复制成功包装成完整恢复。" }
  ],
  responsibilities: [
    "保留 Millennium 核心设置、全局 quick.css、插件清单与主题选项及配色。",
    "按白名单定期采集，避免目录重叠或不同的手工改动被覆盖，并留下成功时间。",
    "记录原来的插件名称、版本、提交及启用选择，供重新安装与比较。",
    "提供零写入恢复计划、受控回填、精确回滚和中断事务恢复；程序资源、私有设置与应用内验收仍分开。"
  ],
  exclusions: [
    "Steam 和 Millennium 本体、DLL/EXE、插件程序、主题图片/字体/CSS 资源不在配置快照中；全局 quick.css 是明确包含的例外。",
    "id_cache.json、cache.json、日志、崩溃文件和各插件自建私有配置不在文件名白名单中；不备份账号登录状态或游戏存档。",
    "不会自动安装程序、停止Steam、执行插件代码、Git推送或盲目跨版本转换。已有受控恢复和回滚命令，但它们不等于整机一键恢复。"
  ],
  failures: [
    { condition: "来源不可用或一个允许文件也没有", response: "脚本报错；检查实际 Steam 安装目录或显式 -SourceRoot。缺少部分文件会被跳过，因此文件计数变化仍需检查，不能自动认为快照完整。" },
    { condition: "SourceRoot and DestinationRoot must not overlap", response: "源和目标相同或嵌套，脚本在复制前拒绝。选择不同目录；采集脚本不承担恢复。" },
    { condition: "Destination git workspace is dirty", response: "目标和上一份生成清单不符、未知额外文件或Git读取失败时保留现场并停止覆盖；不使用AllowDirtyDestination绕过。普通文档变化不等同快照冲突。" },
    { condition: "暂存内容检查命中", response: "抛错并停止更新目标；按报告检查具体文件。检查发生在 runtime/staging，失败暂存可能仍在本机，但不应提交为公开快照。" },
    { condition: "复制中断或恢复后界面不对", response: "分目录替换可能只完成一部分；保留现场，核对选定快照与上游版本后重做必要文件。需要回退时用实际保留的 Git 版本或目标配置副本；没有自动回滚承诺。" }
  ],
  usageExamples: [
    { ask: "Steam 原来的绿色和细滚动条怎么找回来？", effect: "用选定快照的核心设置与 quick.css 回填，再检查 Millennium 注入和实际界面。", moduleSlug: "allowlist-config-and-style-snapshot" },
    { ask: "换电脑后，我以前那几个 Steam 插件叫什么？", effect: "读清单中的名称、版本和提交，再看启用名单；重新安装后另查插件私有设置。", moduleSlug: "plugin-manifest-and-install-state-tracking" },
    { ask: "Adwaita 和 Zehn 的颜色、圆角设置留住了吗？", effect: "检查 config.json 的选择值和对应主题定义，并区分备份版本与这台电脑当前安装版本。", moduleSlug: "theme-options-palette-and-dual-baseline-tracking" },
    { ask: "最近有没有自动备份，真要恢复该怎么做？", effect: "核对任务结果和快照时间，再按安装、合并回填、逐项检查的步骤恢复。", moduleSlug: "scheduled-snapshot-guardian-and-clean-restore-boundary" }
  ],
  glossary: [
    { term: "Millennium", meaning: "为 Steam 客户端加载主题和插件的工具；本项目备份它的一部分配置，不备份 Steam 全部数据。" },
    { term: "conditions / themeColors", meaning: "前者保存各主题选项的选择，后者保存颜色变量；可否应用仍取决于对应主题版本。" },
    { term: "metadata.json", meaning: "记录插件或主题的来源、提交等元数据；它是重装线索，文件本身不是程序。" },
    { term: "SteamID64", meaning: "Steam 的数字账号标识，不是登录凭据。本采集器会排除相应缓存文件，并检查暂存内容中的一种常见数字形式。" },
    { term: "staging（暂存区）", meaning: "准备此次采集文件的位置。检查通过后再更新备份目录，但后续分目录复制仍可能中断。" }
  ],
  sources: [
    { path: "config/config.json / config/quick.css", role: "核心设置、插件开关、两套主题选择与全局样式。" },
    { path: "plugins/ / themes/", role: "逐项白名单清单、版本、元数据、主题结构与选项。" },
    { path: "tools/snapshot-millennium-config.ps1", role: "现行PowerShell兼容入口；实际采集、恢复、事务与清单由tools/millennium_backup.py维护。" },
    { path: "tools/register-millennium-config-snapshot-task.ps1 / tools/snapshot-millennium-config-hidden.vbs", role: "任务注册、隐藏窗口调用及退出码传递。" },
    { path: "runtime/snapshot-state.json / SteamMillenniumConfigSnapshot", role: "本机最近成功采集与现役任务状态；runtime 不进入 Git。" },
    { path: "tests/run-snapshot-tests.ps1 / README.md / README.pdf", role: "19 项隔离断言，以及已修正并发布的操作与恢复指南。" }
  ],
  evolution: [
    {
      "date": "2026-07",
      "title": "不用靠记忆重调自己的 Steam",
      "commit": "",
      "result": "留下核心设置、自写样式、插件与主题清单，原有任务按周采集；程序和私有插件数据不冒充已备份。",
      "evidence": [
        {
          "date": "2026-07",
          "note": "定期配置备份、安装线索与手工改动保护。",
          "commit": "9df1944 / 6507178 / ffd0870"
        }
      ]
    },
    {
      "date": "2026-08",
      "title": "采集不应覆盖还没处理的改动",
      "commit": "",
      "result": "拒绝源目标重叠和未知手工冲突，配置与程序版本分开；恢复前先确认新装资源。",
      "evidence": [
        {
          "date": "2026-08",
          "note": "源目标重叠保护与主题版本区分；当时的手工恢复边界已由后续受控恢复增强，不再作为当前能力上限。",
          "commit": "c65bb36 / 0b118b0"
        }
      ]
    },
    {
      "date": "2026-09-18",
      "title": "从手工照着抄，变成先计划再恢复",
      "commit": "5c65e94",
      "result": "快照附完整性清单，支持恢复预览、按计划回填、精确撤回与中断恢复；状态窗口可控制原任务，各层副本和真实Steam效果分别验收。"
    }
  ],
  snapshotUpdateNote: "本页将公开配置、本机成功快照、最新采集尝试和实际安装分开。9月14日确认最新任务返回1、成功记录仍为9月7日，安装白名单17/20一致；没有重跑任务或修改Steam，9月8日测试、指南与隔离恢复证据保留原日期。",
  "readerBoundary": "保存的是核心设置、样式和安装清单，不含游戏、账号或全部插件私有数据。先装好兼容组件并退出Steam，再执行恢复，最后从真实界面确认。",
};

const steamMillenniumConfigBackupModules = [
  {
    id: "allowlist-config-and-style-snapshot", slug: "allowlist-config-and-style-snapshot", order: 1,
    usageEntry: "运行 tools/Show-MillenniumBackupStatus.ps1 看现有周任务；若要手动留一份，用 tools/Invoke-MillenniumBackup.ps1 -Mode Snapshot，恢复先看 RestorePlan。",
    usageInputs: ["这次要采集还是恢复","要恢复的版本（不确定可先看列表）"],
    productFlow: [{"title":"只取支持文件","detail":"从真实安装中找核心配置和自己的样式，按白名单复制。"},{"title":"核对快照","detail":"候选文件通过类型和内容检查后更新备份，未变就不造新代。"},{"title":"恢复后看 Steam","detail":"按选定版本合并回填配置，再检查界面；账号、游戏和存档不在这份快照里。"}],
    title: "核心设置与自己的样式", shortTitle: "核心设置与样式", kicker: "留住颜色、更新开关、插件选择和细滚动条",
    value: "保存 Millennium 的核心设置与 quick.css，让重装或误改后能按记录恢复自己的选择。",
    status: "配置已采集；本轮未做界面恢复", statusTone: "accent", stateLabels,
    why: "颜色和滚动条只是看得见的一部分，更新通道、注入开关、插件启用名单也会影响客户端行为。一起保存，恢复时才不只找回一张相似的皮肤。",
    example: "“我想恢复 Steam 之前的绿色和细滚动条。”先装好 Millennium，再合并回填 config/config.json 与 config/quick.css；打开 Steam 检查颜色和滚动区域，不能只看文件在不在。",
    result: "拿到原来的参数和 CSS 文件；对应版本可用且注入正常时，用它们恢复设置，再从界面确认。",
    teaser: "核心开关和全局 quick.css 都保留，文件复制与实际效果分开验证。",
    problem: "只重装主题不能恢复全部个人选择，直接覆盖不兼容的新配置也可能让设置失效。",
    readerStates: {"pass":"选定的核心设置和自己的样式在快照里能核对，恢复时只回填受支持部分。","problem":"版本变了先核对当前配置选择；样式没生效再看程序和主题是否正确加载。","unavailable":"没有 Millennium 或所需主题资源时，单复制配置不能让界面恢复。"},
    decisionImpact: ["核心JSON按受支持字段生成公开投影，恢复时只合并这些字段，保留目标网络和未知字段；不盲目复制整份配置。", "保留核心选择和轻量 CSS，程序、缓存与账号状态不随配置走。", "quick.css 是样式定义；不存在“所有 Steam 窗口已验证生效”的推断。"],
    concepts: [{ term: "CSS / JavaScript 注入", explanation: "Millennium 把样式或脚本加载到 Steam 页面；开关配置与页面实际执行是两层证据。" }, { term: "quick.css", explanation: "个人全局样式文件，本快照保留滚动条 4px、半透明滑块和透明轨道规则。" }],
    implementation: ["general.accentColor=#00ff00，millenniumUpdateChannel=stable；更新检查和 injectCSS/injectJavascript 开启，onMillenniumUpdate=2。三项通知开关均开启，network.proxy、proxyUsername、proxyPassword 均为空；不从数值枚举推断未验证的更新行为。", "plugins.enabledPlugins 保存 3 个插件名；themes.activeTheme、conditions、themeColors 分别保存当前主题、选项和颜色。", "millennium_backup.py严格解析并选择支持字段，quick.css规范UTF-8换行并检查已知风险；未知键只报告名称。新格式与旧无清单快照不同，AdoptExisting也不能绕过内容或哈希检查。"],
    flow: ["在实际 Millennium 目录找到核心配置与 quick.css。", "与其余白名单文件一起复制到暂存区并检查。", "更新备份 config 目录；恢复时则合并回填所选版本的文件，最后在 Steam 检查效果。"],
    boundaries: ["有受支持字段的类型与内容检查，不是通用配置迁移器；不转换未知键，不保证全部CSS在所有Steam窗口生效。", "不覆盖 Steam 原生账号登录、游戏库或存档恢复。"],
    failures: [{ condition: "配置里存在非空代理用户名或密码", response: "代理账号和未知字段不进入公开投影；支持字段中出现已知凭据模式仍拒绝，省略范围与实际值风险分别复核。" }, { condition: "回填后样式或选项没有按预期出现", response: "检查 Millennium、主题版本与注入配置；按需要撤回目标机保留的配置，不宣称清空 quick.css 必然修复所有窗口问题。" }],
    sources: [{ path: "config/config.json", role: "真实参数与选择。" }, { path: "config/quick.css", role: "实际滚动条样式定义。" }, { path: "tools/snapshot-millennium-config.ps1", role: "复制范围及内容检查。" }],
    verification: ["原有测试的 copies config.json 与 copies quick.css 通过。", "9月8日核心文件经隔离采集及回填后与来源SHA-256相同；该历史测试不等于本次真实界面验收。"],
    searchProjection: { intents: ["找回 Steam 绿色强调色和细滚动条", "Millennium quick.css 怎么备份和恢复"], entities: ["config/config.json", "config/quick.css", "general.accentColor", "injectCSS", "injectJavascript", "::-webkit-scrollbar"], relations: ["核心配置保存选择，quick.css 保存样式，Millennium 负责实际加载"], failureRecovery: ["样式不生效时核对注入和主题版本，必要时回到目标机已保留配置"] },
    relation: "核心配置中的插件名单和主题选择连接后两类快照；采集与恢复流程负责搬运这些文件。",
    readerStatus: "核心设置和自定义样式已采集；本轮没有回填并查看Steam实际界面。"
  },
  {
    id: "plugin-manifest-and-install-state-tracking", slug: "plugin-manifest-and-install-state-tracking", order: 2,
    usageEntry: "查看项目快照中的插件清单来重建安装选择；插件本体需要从对应来源另行安装，再在 Steam 中核对。",
    usageInputs: ["想恢复哪些插件或启用选择","目标电脑上哪些插件需要重新安装"],
    productFlow: [{"title":"记录有哪些插件","detail":"采集各插件允许的清单和存在时的安装记录，启用选择在核心配置中另存。"},{"title":"恢复时找本体","detail":"先安装对应插件，再用快照线索核对版本和启用项。"},{"title":"确认缺口","detail":"插件私有配置、源码和可执行依赖未在快照中，缺失时不能称完整恢复。"}],
    title: "插件清单、版本与启用选择", shortTitle: "插件清单", kicker: "重装时知道装什么，也知道哪些设置还要另外找",
    value: "留下插件名称、用途、版本、上游提交和启用名单，帮助重新安装与排查版本差异。",
    status: "5 款清单；配置启用 3 款", statusTone: "accent", stateLabels,
    why: "换电脑后容易只记得“装过一个封面插件”，却不记得名称和版本。清单能补上这部分记忆，但不能代替插件程序和插件自己保存的数据。",
    example: "“我之前装了哪些 Steam 插件？”清单能找出 Extendium、Size on Disk 和 Easy SteamGrid 等名称；配置也表明其中哪些被启用。按清单重新安装后，进入插件设置确认还缺什么。",
    result: "得到可核对的重装线索和启用选择；不会把一份 plugin.json 误当成已经装好的插件。",
    teaser: "5 款插件的用途、版本和提交都有记录，私有设置仍需另外恢复。",
    problem: "清单版本、实际程序版本和启用配置可能不同；复制旧 metadata 不能把新程序变回旧程序。",
    readerStates: {"pass":"能查到上次保存的插件名称、版本线索和启用选择，作为重新安装的依据。","problem":"清单与当前安装版本不一致时逐个核对，不能由旧记录推断插件今天可运行。","unavailable":"插件程序无法取得或在当前 Steam 不能加载时，清单无法替它运行。"},
    decisionImpact: ["只保存 plugin.json、metadata.json 和存在时的 install-state.json，不把私有 config.json 混进插件清单。", "把启用选择与实际加载分开；本轮没有调用插件功能。", "旧元数据是重装参考，恢复到不同版本时先核对实际安装，避免写成不实状态。"],
    concepts: [{ term: "plugin.json", explanation: "插件名称、用途、版本及后端类型等描述，不是插件可执行代码。" }, { term: "metadata.json / install-state.json", explanation: "来源提交等元数据和安装过程记录；install-state.json 并非每个插件都有。" }],
    implementation: [
      "Extendium 2.0.4：为 Steam 提供 Chrome 扩展支持；backendType=lua，include=fake-header-extension；快照提交 3f9ffb0cd9ada58a7de7f71b3ed8d094ca7130f6。",
      "Size on Disk 1.1.0：显示游戏磁盘占用；useBackend=false；快照提交 8ebb14647f6a3be231069d11bd8e7002383df45b。",
      "Easy SteamGrid 4.1.0：SteamGridDB 封面集成；backendType=lua；快照提交 44860b53bedb672675a55981863890d9be86025a。",
      "HLTB for Steam 2.1.0：显示 How Long To Beat 通关时长；backendType=lua；快照提交 49d59edf7475ceef42734627687bdb71d7d08709，安装元数据提交已为 7decc0a06bb26b365a779c9d1a85195834c940e1。",
      "Taskbar Download progress 2.3.0：Windows 任务栏下载进度；backendType=lua；快照提交 56678fd10dba9826d34fcf8e6630fe1c099360e1。",
      "plugins.enabledPlugins=size-on-disk、steam-easygrid、extendium；只有 Extendium 另有 install-state.json，记录 lastChecked、installAttempted=false、installFailed=false，不表示本轮安装成功。"
    ],
    flow: ["遍历实际 plugins 子目录，逐个寻找三个允许的文件名。", "保存描述、元数据和存在时的安装记录，核心 config.json 单独保存启用名单。", "重装时用这些线索找对应程序，再核对版本和插件私有设置。"],
    boundaries: ["快照没有插件源码、可执行依赖、缓存或各插件的私有配置。", "描述中的插件用途不证明本轮已经运行该功能，安装元数据也不证明始终可下载同一版本。"],
    failures: [{ condition: "恢复后插件没有运行", response: "先看程序是否存在、版本是否相容，再核对启用名单与插件自己的错误；不能靠复制清单解决所有加载问题。" }, { condition: "需要的私人设置不在备份中", response: "从另外实际保留的来源恢复，或在插件中重新设置。本项目不能凭空重建它们。" }],
    sources: [{ path: "plugins/*/plugin.json / plugins/*/metadata.json", role: "5 款插件真实版本、用途、提交及元数据。" }, { path: "plugins/extendium/install-state.json", role: "唯一保存的插件安装过程记录。" }, { path: "config/config.json", role: "plugins.enabledPlugins 的实际选择。" }],
    verification: ["原有测试证明插件描述会复制，缓存和插件源码被排除。", "当前备份与安装目录的插件版本描述可读取；HLTB 元数据差异如实保留，没有执行插件加载验收。"],
    searchProjection: { intents: ["重装电脑找回 Steam 以前的插件", "Millennium 哪些插件启用了", "为什么插件自己的设置没有备份"], entities: ["Extendium", "Size on Disk", "Easy SteamGrid", "HLTB for Steam", "Taskbar Download progress", "plugins.enabledPlugins", "install-state.json"], relations: ["plugin.json 记录插件身份和版本，config.json 记录启用选择", "清单指导重新安装，不含插件程序或私有设置"], failureRecovery: ["插件不能加载时分别核对程序、版本、启用配置与插件错误"] },
    relation: "依赖 Millennium 加载；本项目只保留重装和比较需要的清单，不接管插件自身功能。",
    readerStatus: "快照保留5款插件清单及其中3款启用选择；插件程序和私有设置不由这份清单恢复。"
  },
  {
    id: "theme-options-palette-and-dual-baseline-tracking", slug: "theme-options-palette-and-dual-baseline-tracking", order: 3,
    usageEntry: "从项目快照选择目标主题配置，先确认目标机器已安装对应主题资源，再按恢复计划合并选项和配色。",
    usageInputs: ["想恢复的主题外观与日期","目标电脑已装或希望重装的主题"],
    productFlow: [{"title":"确定基线","detail":"分清远端提交、本地未提交快照与当前安装，选要恢复的那一份。"},{"title":"核对主题版本","detail":"先装可用资源，再把对应选项和配色合并回填，不盲迁移未知键。"},{"title":"实际看外观","detail":"在 Steam 核对主题、颜色和滚动条；版本差异或缺资源时保留明确缺口。"}],
    title: "主题选项、配色与版本差异", shortTitle: "主题选项与配色", kicker: "留住 Adwaita 和 Zehn 的选择，恢复时对上真实主题版本",
    value: "保存两套主题的选项定义、来源提交与自己的颜色选择，减少换机后重新调校。",
    status: "选中 Adwaita；Zehn 安装版本已更新", statusTone: "accent", stateLabels,
    why: "圆角、字体、标题栏和配色很难只凭记忆复现。主题更新又可能增删选项，所以需要同时知道“我选了什么”和“这些选项属于哪一版主题”。",
    example: "“我以前把 Zehn 主题调成浅色和圆角，想找回当时的选择。”先选旧快照，再比较当前已安装的主题版本；旧配置不能直接当作新版本的真实外观。",
    result: "可以读回自己的选项和 RGB 配色，再对照主题版本恢复；最终仍需在当前 Steam 中检查效果。",
    teaser: "Adwaita 和 Zehn 的选项、颜色与来源提交都留下；公开提交、本地快照和安装分别说明。",
    problem: "只有配色值没有主题资源无法呈现界面；复制旧版本定义到新程序，也可能引用已经变化的选项或资源。",
    readerStates: {"pass":"能从选定快照读回主题选项与颜色，并在当前 Steam 里看到对应效果。","problem":"公开版本、本地快照和当前安装不一致时，先选要恢复哪一份。","unavailable":"主题程序、图片或字体缺失时，只有配置文字仍不能重建完整外观。"},
    decisionImpact: ["选择值和主题定义分别保留，不把“已有 JSON”当作所有版本都支持这些键。", "只保存名单内的定义文件，主题 CSS、图片和字体仍要从主题程序取得。", "未提交不等于未生效：Adwaita 本地 4.4 已与安装匹配；Zehn 安装则比本地快照更新。"],
    concepts: [{ term: "conditions", explanation: "config.json 中每套主题已经选择的开关或枚举值。" }, { term: "themeColors", explanation: "保存 RGB 三元组配色，供对应主题引用；这是选择值，不是独立调色程序。" }, { term: "skin.json / theme.json", explanation: "主题选项、补丁目标和资源路径定义，引用的实际 CSS 等资源未随快照打包。" }],
    implementation: [
      "Adwaita-for-Steam 来自 tkashkin/Adwaita-for-Steam；本地 metadata 提交 1e92107a51f6ed53c59c38646444c9eb3a52b030。已提交配置版本 4.2，本地快照与已安装定义为 4.4。",
      "Zehn 来自 yurisuika/Zehn；已提交配置版本 2026.7.24，本地快照 2026.8.29、metadata 提交 fbce1f5cc550d04c9909076ebbe54df9368e50a7；已安装 2026.9.7、提交 68719556122c06fdaaa14358012a697577042d17。",
      "Adwaita 子目录保存 metadata.json、skin.json、theme.json；Zehn 保存 metadata.json、skin.json、options.json、waifus.json。",
      "本地 Adwaita 保存 17 个条件选择与 48 个颜色变量，包括 System 配色方案、Adwaita 字体、圆角与方形游戏图标选择；如 --adw-accent-bg-rgb=39, 168, 100。Zehn 保存 25 个条件选择与 14 个颜色变量，包括 Embed Size=640、Avatar Frame=no 等选项与各状态颜色。"
    ],
    flow: ["复制每套主题允许的定义与元数据文件。", "与核心 config.json 中该主题的 conditions、themeColors 一起保存。", "恢复时核对安装版本、资源和选项对应关系，合并回填后在 Steam 查看实际外观。"],
    boundaries: ["不会合并主题对象、自动调整废弃键或保证上游忽略未知选项时一定不出错。", "本地快照存在 7 个未提交文件是当前状态，不是另建的版本管理或主题自动迁移系统。"],
    failures: [{ condition: "主题新版本删改了旧选项或资源路径", response: "按对应主题实际版本重新核对；无法从本项目证明自动兼容，不保证复制后原样还原。" }, { condition: "主题外观不符合预期", response: "核对 activeTheme、conditions、themeColors 以及实际安装资源，必要时恢复目标机已保留配置。" }],
    sources: [{ path: "themes/Adwaita-for-Steam/", role: "主题定义、元数据及已提交/本地版本。" }, { path: "themes/Zehn/", role: "皮肤定义、选项、元数据与本地版本。" }, { path: "config/config.json", role: "实际选中的主题、条件和 RGB 颜色。" }],
    verification: ["原有测试证明主题元数据会复制，主题图片资源不复制。", "只读比对确认 Adwaita 本地文件与安装一致；Zehn metadata/skin 与安装不同，版本分别列出。"],
    searchProjection: { intents: ["备份 Adwaita 和 Zehn 的颜色圆角", "Steam 主题更新后怎么核对旧配置", "Zehn 当前安装和备份版本不同"], entities: ["Adwaita-for-Steam", "Zehn", "themes.conditions", "themes.themeColors", "skin.json", "options.json", "2026.9.7"], relations: ["config.json 保存个人选择，主题定义提供选项和资源引用", "安装版本可以晚于最近快照和公开提交"], failureRecovery: ["新旧主题不匹配时核对选项和资源，不把旧清单当作当前程序状态"] },
    relation: "与核心设置一起还原外观；插件清单是另外一类扩展，二者都依赖真实程序资源。",
    readerStatus: "当前选择与两套主题配置已有记录，安装版本存在差异；恢复前应分清要用的版本，再看Steam实际效果。"
  },
  {
    id: "scheduled-snapshot-guardian-and-clean-restore-boundary", slug: "scheduled-snapshot-guardian-and-clean-restore-boundary", order: 4,
    usageEntry: "运行 tools/Show-MillenniumBackupStatus.ps1 看任务或立即采集；命令行可用 tools/Invoke-MillenniumBackup.ps1 -Mode Snapshot。恢复先用 -Mode RestorePlan 选版本。",
    usageInputs: ["这次要查状态、立即采集还是恢复","恢复时想选哪天的版本","是否已退出 Steam"],
    productFlow: [{"title":"先看快照真的留到了哪里","detail":"周任务或手动采集分别报告本地结果与独立副本；提交到版本库和冷备是另外的证据。"},{"title":"恢复前看清范围","detail":"选确实存在的日期和版本，预览要改的设置，并确认所需插件或主题已安装。"},{"title":"合并后在 Steam 里看","detail":"保留撤回依据，只回填支持的配置，再打开 Steam 核对外观和插件；工具不替人安装程序。"}],
    title: "每周采集、可见管理与可回滚恢复", shortTitle: "自动采集与恢复", kicker: "按时留下配置，遇到冲突保留现场，恢复时逐项检查",
    value: "平时让原任务定期留存配置，需要时打开状态窗口看最近成功、独立副本和下一次检查。出问题先看恢复计划，确认后仅回填支持的设置；冲突不覆盖，中断可以按原记录处理。",
    status: "最近任务成功；可验证代际和恢复命令已实现，真实Steam效果另验", statusTone: "mixed", stateLabels,
    why: "手工记着备份容易遗漏；采集也不能把正在修改的文件冲掉，更不能误把“有快照”当作已重装好全部程序。",
    example: "“恢复上一份Steam配置前，先告诉我会改什么；不合适还能撤回。”先取得只读计划，核对程序版本与资源，确认并退出Steam后再回填；完成后得到回滚编号，打开Steam检查实际效果。",
    result: "状态窗口分别显示本地快照、最近尝试与成功、独立副本和任务状态。恢复只回填支持的配置，程序、主题资源和最终 Steam 界面仍要另验。",
    teaser: "无变化不重复留代，恢复先预检、保留原值；任务与G/H各自报告",
    problem: "任务存在不代表采集成功，本地采集不等于 GitHub 已更新，文件复制也不等于恢复完成。",
    readerStates: {"pass":"快照文件与清单一致；恢复按已确认的计划完成并保留撤回依据，随后在 Steam 看实际效果。","problem":"采集未完成、来源不全或有人改过目标时停止覆盖，保留文件和记录供恢复。","unavailable":"找不到当前安装、用户未登录或缺程序资源时，这次采集或界面恢复不能完成；旧快照仍保留。"},
    decisionImpact: ["复用 Windows 任务计划与小 VBS，不增加常驻备份服务。", "没有七天节流和脏目标绕过；无变化仍验证，默认保留4份已验证代际。", "恢复是单独的RestorePlan/Restore/Rollback流程，不能反向运行采集脚本；中断用原事务Recover。", "恢复按现有分步规程进行，用户可选择具体快照，并核对新装程序是否与旧配置对应。"],
    concepts: [{"term":"Verified generation（已验证代际）","explanation":"一组文件及对应完整性清单，验证后才成为当前；无变化不创建重复代。"}, { term: "Interactive Logon（交互登录）", explanation: "现役任务依赖该用户已经登录；不是保证无人登录时运行的服务。" }, { term: "staging（暂存区）", explanation: "先保存待发布文件和原值，再逐文件提交、最后发布清单；可恢复中断但不是全文件系统原子切换。" }],
    implementation: ["PowerShell7.2+调用Python3.11+核心，显式来源或注册表/常见目录定位；只有机器名与实际仓库均匹配才消费PCConfig机器绑定，拒绝在该绑定下替换采集源。","目标与上一份已生成清单比较；手动、定时及其他进程受同一固定目标锁保护。未知文件、真实快照修改或Git读取失败停止覆盖，源或目标/运行根重叠、链接路径拒绝。","支持目录完整且前后稳定才生成候选，先保存持久前像和计划，再逐文件写入，清单最后提交与回读；未完成记录阻断正式读入口，Recover检查记录和当前资源后处理，保留外来改动。","现役任务仍为周日当地19:30、Interactive/Limited、错过补跑、3次15分钟重试、10分钟上限和IgnoreNew；隐藏VBS调用PowerShell7，启停只管理该任务未来触发。","RestorePlan只读验证备份和目标；Restore要求ExpectedPlan，合并支持配置并保留网络/未知字段，资源或版本不匹配停止。真实安装目标需Steam已退出，不自动结束进程、下载或运行插件。","恢复结果带rollback_id，Rollback只撤回仍匹配本轮postimage的修改。恢复历史默认保留4条已完成、回滚或中止记录，未完成记录不自动清掉。","G副本先核验PCConfig卷身份和路径，再复制当前及保留历史并验证；G失败仍保留本地但自动任务非零。H使用原PCConfig冷备集合，无新任务、无自动解锁。"],
    flow: ["原周任务或明确人工Snapshot进入实际来源与机器绑定。","检查源稳定性、目标清单、固定锁和是否有未完成事务。","生成并验证候选，逐文件写入、最后发布清单；无变化不增加代际。","独立验证G副本并分别报告最近尝试与最近成功；Git发布与H冷备另行执行。","恢复先只读计划，核对版本和资源；明确执行后保留回滚点，最后在Steam内验证。"],
    boundaries: ["不自动Git提交或推送，采集、G副本、H和实际应用分层判断。","有持久前像的多文件事务不等于任意断电和硬件损坏均已验证；不抹去外部修改或未知旧记录。","受控恢复只回填支持的配置，不安装插件、不启停Steam、不覆盖主题程序和私有数据。"],
    failures: [{ condition: "源与目标重叠或不同的手工改动仍未处理", response: "保留源与目标，处理精确冲突；当前入口不提供脏目标绕过。" }, {"condition":"本次内容没有变化","response":"验证现有清单和文件后保持，不新建重复代；仍分开检查G副本与任务状态。"}, { condition: "写入中断或恢复版本不匹配", response: "同一事务检查后Recover，恢复版本/资源不匹配则停止回填；已提交恢复若清理失败保持真实提交结果，不回滚掉已成功内容。" }],
    sources: [{ path: "tools/snapshot-millennium-config.ps1", role: "真实采集与失败处理。" }, { path: "tools/register-millennium-config-snapshot-task.ps1", role: "注册及任务参数。" }, { path: "tools/snapshot-millennium-config-hidden.vbs", role: "隐藏调用与退出码传递。" }, { path: "runtime/snapshot-state.json / README.md / tests/run-snapshot-tests.ps1", role: "现行清单、绑定成功状态、操作指南与隔离回归；9月8日19项仅是历史。" }],
    verification: ["原有 19 项断言全部通过；重试参数的两项检查属于源码断言，不是实际失败重试演练。", "2026-09-18只读回读：任务Ready，最近结果0，成功状态绑定20260918T044109Z-3baa6bc2e6e9及清单哈希；没有再次触发真实采集。", "9月8日20文件隔离采集与回填字节一致，19 JSON解析成功，3个虚构已安装资源/私有设置保留；本次未做真实Steam恢复。"],
    searchProjection: { intents: ["Steam Millennium 最近有没有自动备份", "每周备份 Steam 配置不要弹黑框", "Millennium 重装恢复步骤", "备份脚本提示工作区有改动怎么办"], entities: ["SteamMillenniumConfigSnapshot","millennium_backup.py","snapshot-manifest.json","RestorePlan","ExpectedPlan","Rollback","Recover","Show-MillenniumBackupStatus.ps1"], relations: ["任务调用 VBS，VBS 隐藏运行采集脚本并传回退出码", "清单最后发布、原值先保留；恢复按独立计划合并并可回滚"], failureRecovery: ["不同的手工改动先处理再采集", "复制成功后还需要核对界面和插件，不能当作完整恢复"] },
    relation: "负责前三类配置的定期留存和恢复操作；Steam、Millennium 及插件主题各自负责实际运行。",
    readerStatus: "最近采集任务成功，已有恢复计划、回滚和中断处理；文件完成不代表Steam界面已经恢复。"
  }
];

export const project = steamMillenniumConfigBackupProject;
export const modules = steamMillenniumConfigBackupModules;
export { steamMillenniumConfigBackupSnapshot, steamMillenniumConfigBackupProject, steamMillenniumConfigBackupModules };
