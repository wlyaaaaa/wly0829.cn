import { createProjectSnapshot } from "./project-snapshot.js";

const stateLabels = ["可以怎么用", "需要处理什么", "什么时候不可用"];
const sourceCommit = "b51236216dbe815b945cdcb6be6f80adee9fdb10";
const configCommit = "0b118b09670e0cfbff34cb99e031ea45fac8284f";

const steamMillenniumConfigBackupSnapshot = createProjectSnapshot({
  observedAt: "2026-09-08T03:09:30Z",
  label: "每周本机快照已运行；配置、已发布版本与实际安装分别核对",
  boundary: "保存配置和安装清单；恢复仍需安装程序、合并回填并逐项检查。当前安装目录有 3 个文件比本地快照更新或不同。",
  metrics: [
    { label: "插件清单", value: "5 款 · 配置启用 3 款" },
    { label: "主题设置", value: "2 套 · 选中 Adwaita" },
    { label: "本地快照", value: "20 文件 · 44,478 字节" },
    { label: "最近自动采集", value: "9 月 7 日 · 任务结果 0" }
  ],
  facts: [
    { label: "来源与发布", value: `PUBLIC（公开）仓库 wlyaaaaa/steam-millennium-config-backup；默认 master 的本地与远端均为 ${sourceCommit}。本次仅修正 README.md 与配套 PDF；配置提交仍沿用 ${configCommit}。` },
    { label: "本地快照与未提交变化", value: "config、plugins、themes 共 20 个文件、44,478 字节，其中 19 个 JSON 均可解析。原有 7 个未提交改动保留：config/config.json，Adwaita 的 metadata/skin/theme，以及 Zehn 的 metadata/options/skin。未提交状态不等于未安装，也不等于已经发布。" },
    { label: "实际安装与快照的差异", value: "逐文件读取 Steam/millennium 后，20 个白名单文件中 17 个与本地快照字节一致。不同的是 plugins/hltb-for-millennium/metadata.json、themes/Zehn/metadata.json 与 skin.json。已安装 Zehn 为 2026.9.7，本地快照为 2026.8.29，已提交配置为 2026.7.24；Adwaita 已安装与本地快照均为 4.4，已提交配置为 4.2。" },
    { label: "插件与启用配置", value: "快照记录 Extendium 2.0.4、Size on Disk 1.1.0、Easy SteamGrid 4.1.0、HLTB for Steam 2.1.0、Taskbar Download progress 2.3.0。plugins.enabledPlugins 为 size-on-disk、steam-easygrid、extendium；这是配置选择，本轮没有逐插件实际加载验收。" },
    { label: "核心设置", value: "general.accentColor=#00ff00，millenniumUpdateChannel=stable，injectCSS=true、injectJavascript=true；themes.activeTheme=Adwaita-for-Steam。quick.css 定义 4px 滚动条、半透明滑块和透明轨道，实际作用范围取决于 Millennium 的注入与页面对相应 CSS 的支持。" },
    { label: "现役计划任务", value: "SteamMillenniumConfigSnapshot 为 Ready（就绪），每周日当地时间 19:30，通过 wscript.exe 调用项目 VBS，继而隐藏运行 powershell.exe。要求当前用户已登录；错过时间尽快补跑，失败每 15 分钟重试、最多 3 次，上限 10 分钟，已有实例时忽略新触发。" },
    { label: "最近真实采集", value: "任务最近运行于 2026-09-07T02:30:00Z，LastTaskResult=0；runtime/snapshot-state.json 记录成功时间 2026-09-07T02:30:01.5691614Z、20 文件、来源 C:\\Program Files (x86)\\Steam\\millennium、目标 E:\\Projects\\Tools\\steam-millennium-config-backup。采集不自动提交或推送 Git。" },
    { label: "本轮验证", value: "源码原有测试实际通过 19 项断言，包含 Windows PowerShell 5.1 调用。隔离采集和回填的 20 文件均与来源 SHA-256 相同，19 个 JSON 可解析，3 个虚构插件程序/私有设置/主题资源保留。源码指南与 3 页 PDF 已修正并在 master 回读；真实 Steam 未重启、未安装或恢复。" }
  ],
  gaps: [
    "没有 Steam、Millennium、插件程序或主题图片/字体包；插件自建 config.json、账号状态与其他私有设置不在当前文件名白名单中。",
    "当前安装目录的 HLTB 元数据及 Zehn 元数据、皮肤定义与最近本地快照不同。公开配置、本地采集和安装状态分开，不能把任何一层当作另外两层。",
    "先暂存检查，再依次替换 config、plugins、themes；这不是原子事务，写入中断可能留下部分新快照，也没有自动回滚或自动 Git 提交。",
    "内容检查只覆盖禁用文件/目录、扩展名、SteamID64 形式及非空代理用户名/密码；不证明能识别所有秘密或私人内容。",
    "本轮证明了隔离目录中的复制与回填，没有执行真实 Steam 界面恢复、逐插件加载或跨版本兼容验收。"
  ]
});

const steamMillenniumConfigBackupProject = {
  order: 30,
  slug: "steam-millennium-config-backup",
  title: "Steam Millennium 配置备份",
  kicker: "把 Steam 调好的外观和插件清单留一份，重装时有据可循",
  route: "/projects/steam-millennium-config-backup",
  visibility: "公开仓库",
  statusTone: "accent",
  cardStatus: "每周本机快照已运行；保存配置，按步骤手工恢复",
  cardStatusTone: "accent",
  ...steamMillenniumConfigBackupSnapshot,
  summary: "Millennium 用来给 Steam 换主题、加插件。本项目定期保存它的核心设置、自己写的滚动条样式、插件版本清单，以及 Adwaita 和 Zehn 两套主题的选项与配色。重装电脑或改坏界面后，先重新装好程序，再照这份记录恢复设置，少靠记忆重新调整；插件本体和插件自己保存的私有设置不包含在这份快照里。",
  why: "Steam 的绿色强调色、圆角、标题栏、插件开关分散在不同配置中，调好一次不代表换电脑后还能找回来。这里保存难以凭记忆重做的选择和安装线索；程序与主题资源另行取得，让备份的范围和恢复时还要做的事情都清楚。",
  plainExample: "“我重装了 Windows，想把 Steam 调回原来的样子。”先装 Steam、Millennium 和清单中的插件、主题；退出 Steam，留存新机器当前配置，再把备份文件合并复制到对应位置。启动后核对颜色、滚动条、主题和各插件设置。若新主题改了选项或少了资源，继续按实际版本调整，文件复制成功还不算界面恢复成功。",
  result: "得到一份可用 Git 查版本的配置快照、每周自动采集任务和分步恢复指南。可以知道保存了什么、最近何时采集、哪些插件曾被选中，以及恢复时还缺程序、资源或私有设置中的哪一部分。",
  readerStates: {
    quick: "保存调好的 Steam 外观与插件清单；重装时按记录找回选择，程序仍需重新安装。",
    product: "日常每周采集一次；需要恢复时，合并回填配置并检查界面和插件。手工改动冲突、版本不匹配或来源不可用时都有明确处理边界。",
    technical: "查看文件名白名单、配置键和上游提交、计划任务及节流行为，并分别判断公开提交、本地快照、实际安装、隔离测试与真实恢复。"
  },
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
    { name: "tools/snapshot-millennium-config.ps1", responsibility: "定位、筛选并采集快照", implementation: "检查来源和目的目录、目标 Git 改动及 7 天节流；暂存允许文件并检查，再逐目录复制，成功后写 snapshot-state.json。" },
    { name: "tools/register-millennium-config-snapshot-task.ps1", responsibility: "建立每周任务", implementation: "配置交互登录用户、周日 19:30、错过补跑、3 次间隔 15 分钟重试及 10 分钟上限。重新运行会创建或更新任务。" },
    { name: "tools/snapshot-millennium-config-hidden.vbs", responsibility: "隐藏调用窗口并传递结果", implementation: "从自己的位置解析仓库与脚本，shell.Run(command, 0, True) 等待 powershell.exe 完成，再 WScript.Quit 返回相同退出码。" },
    { name: "README.md / README.pdf / tests/run-snapshot-tests.ps1", responsibility: "指导操作并验证关键行为", implementation: "人类指南说明采集、任务、手工恢复和版本差异；原有 19 项隔离断言验证复制、排除、目录重叠、目标改动和 PowerShell 5.1 调用。" }
  ],
  technicalContracts: [
    { artifact: "精确复制范围", schema: "Copy-MillenniumAllowlist", owner: "tools/snapshot-millennium-config.ps1", boundary: "核心仅 config/config.json、config/quick.css；每个插件仅 plugin.json、metadata.json、install-state.json；每个主题仅 metadata.json、skin.json、theme.json、options.json、waifus.json。不是任意 plugins/**/*.json 或 themes/**/*.json。不存在的允许文件跳过；一个也没有则报错。" },
    { artifact: "选择值与主题定义", schema: "general / plugins.enabledPlugins / themes.conditions / themes.themeColors", owner: "Millennium 配置与主题清单", boundary: "用户选择在 config.json，选项、补丁目标和资源路径在主题定义中。脚本复制原文件，不合并对象、不转换 JSON、不迁移旧选项。未声明新的项目 schema 编号。" },
    { artifact: "内容检查", schema: "Test-SensitiveStagingContent", owner: "tools/snapshot-millennium-config.ps1", boundary: "只检查暂存文件：禁用名称 id_cache.json/cache.json/debug.log、bin/lib/crashes 目录、非 .json/.css 扩展名、7656119 后接 10 位数字的形式，以及非空 proxyUsername/proxyPassword。命中则抛错；不宣称通用内容识别。" },
    { artifact: "快照时间记录", schema: "lastSnapshotUtc / sourceRoot / destinationRoot / copiedFiles", owner: "runtime/snapshot-state.json", boundary: "成功复制后写入这四个字段；runtime 被 Git 忽略。没有独立版本 schema，也不把文件数当作恢复成功证明。" },
    { artifact: "复制方向与失败边界", schema: "SourceRoot → DestinationRoot；RuntimeRoot/staging", owner: "采集脚本与手工恢复指南", boundary: "采集脚本会重建目标中的三个目录；恢复需合并复制白名单文件、保留已安装资源。暂存后仍为逐目录替换，写入期间失败不具备自动事务回滚。" }
  ],
  evidenceLayers: [
    { layer: "源码和远端提交", proves: `工具及公开指南由 master=${sourceCommit} 回读；7 个既有本地配置改动原样保留。`, doesNotProve: "本地新配置已提交，或远端版本就是今天的安装状态。" },
    { layer: "安装目录只读比对", proves: "20 个文件均存在，17 个与本地快照一致；Zehn 已安装 2026.9.7，本地快照 2026.8.29。", doesNotProve: "这些插件都已加载、界面样式都生效或新旧版本兼容。" },
    { layer: "计划任务及采集记录", proves: "现役任务配置、最近运行结果 0 和 2026-09-07 的 20 文件采集记录。", doesNotProve: "未来每次执行成功、未登录时也运行，或自动同步到了 GitHub。" },
    { layer: "原有 19 项隔离断言", proves: "白名单复制/排除、重叠目录和目标手工改动保护，以及 Windows PowerShell 5.1 的基本调用通过。", doesNotProve: "任意凭据识别、全量 JSON schema 校验、真实界面恢复或完整重试故障演练；两项重试断言只是读取注册脚本。" },
    { layer: "本轮隔离采集与回填", proves: "20 个文件在采集及回填后分别与来源字节一致，19 个 JSON 可解析；虚构程序、私有设置和主题资源均保留。", doesNotProve: "Steam 实机恢复、插件执行成功或跨版本无损还原。" }
  ],
  operationalEntrypoints: [
    { name: "采集一次本机配置", command: "pwsh -NoProfile -File tools/snapshot-millennium-config.ps1", purpose: "按当前白名单更新本地快照；默认 7 天节流，可用 -SourceRoot、-DestinationRoot、-RuntimeRoot 指定目录。" },
    { name: "忽略时间间隔立即采集", command: "pwsh -NoProfile -File tools/snapshot-millennium-config.ps1 -Force", purpose: "只跳过 7 天节流，仍检查路径、目标改动和暂存内容。不要把源与目标反转当恢复工具。" },
    { name: "创建或更新每周任务", command: "powershell.exe -NoProfile -File tools/register-millennium-config-snapshot-task.ps1", purpose: "会写入当前用户任务计划；不是只读检查，也不会启动 Steam 或安装插件。" },
    { name: "只读核对任务结果", command: "Get-ScheduledTaskInfo -TaskName SteamMillenniumConfigSnapshot", purpose: "结合 runtime/snapshot-state.json 和文件差异判断最近实际采集，不以任务存在替代成功记录。" },
    { name: "运行隔离测试", command: "pwsh -NoProfile -File tests/run-snapshot-tests.ps1", purpose: "使用临时虚构目录验证 19 项断言；不向真实 Steam 恢复配置。" }
  ],
  operatingFlow: [
    { title: "平时把变化留下来", detail: "每周任务定位 Steam/millennium；检查没有覆盖冲突后，筛选文件、暂存检查并更新本地备份。成功时间与文件数写入 runtime，Git 提交另行进行。" },
    { title: "先确定用哪一份恢复", detail: "区分远端提交、本地尚未提交的快照和当前安装。需要恢复哪天的设置，就选那份实际存在的版本；当前机器比快照更新时不要误当成已经备份。" },
    { title: "装好程序，再合并配置", detail: "安装 Steam、Millennium 及需要的插件和主题。退出 Steam、保留目标配置副本，逐文件合并回填；保留新装程序及主题资源，不清空整目录。版本不同时先核对旧 metadata 和安装记录。" },
    { title: "从实际界面确认完成", detail: "启动 Steam，检查主题、颜色、滚动条和启用插件，再核对未备份的插件私有设置。上游资源缺失或配置键变化时，按实际版本处理；需要时回到目标机器保留的配置。" }
  ],
  productPrinciples: [
    { title: "优先保存自己的选择", detail: "保存核心配置、样式、插件线索和主题选项；可以重新取得的程序与资源另行安装。因此快照很小，也不能独自重建完整环境。" },
    { title: "定期采集，冲突时保留现场", detail: "每周运行减少遗漏和干扰，7 天节流避免重复复制。未提交文件与当前源完全相同可以继续；不同的手工修改先报错，不悄悄冲掉。" },
    { title: "备份新不新，要和安装状态比较", detail: "成功采集、Git 提交、实际安装是不同事实。今天的插件更新不能因为昨晚备份成功就被算进那份快照。" },
    { title: "恢复以能用为准", detail: "合并文件只是一步，程序、主题资源、版本适配和插件私有设置都可能影响结果。最终需要看 Steam 界面和插件表现，不把复制成功包装成完整恢复。" }
  ],
  responsibilities: [
    "保留 Millennium 核心设置、全局 quick.css、插件清单与主题选项及配色。",
    "按白名单定期采集，避免目录重叠或不同的手工改动被覆盖，并留下成功时间。",
    "记录原来的插件名称、版本、提交及启用选择，供重新安装与比较。",
    "提供分步手工恢复规程，明确程序资源、插件私有设置及实际验收的责任。"
  ],
  exclusions: [
    "Steam 和 Millennium 本体、DLL/EXE、插件程序、主题图片/字体/CSS 资源不在配置快照中；全局 quick.css 是明确包含的例外。",
    "id_cache.json、cache.json、日志、崩溃文件和各插件自建私有配置不在文件名白名单中；不备份账号登录状态或游戏存档。",
    "没有自动安装、自动 Git 推送、一键恢复或跨版本迁移器。手工恢复和实际界面检查仍是完整流程的一部分。"
  ],
  failures: [
    { condition: "来源不可用或一个允许文件也没有", response: "脚本报错；检查实际 Steam 安装目录或显式 -SourceRoot。缺少部分文件会被跳过，因此文件计数变化仍需检查，不能自动认为快照完整。" },
    { condition: "SourceRoot and DestinationRoot must not overlap", response: "源和目标相同或嵌套，脚本在复制前拒绝。选择不同目录；采集脚本不承担恢复。" },
    { condition: "Destination git workspace is dirty", response: "有与当前源不同的手工改动或其他脏文件。先检查并保留需要的变化；只有明确允许覆盖时才使用 -AllowDirtyDestination。与源字节一致的快照改动和采集脚本自身改动是已实现的窄例外。" },
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
    { path: "tools/snapshot-millennium-config.ps1", role: "实际采集、节流、目标差异和内容检查、顺序复制实现。" },
    { path: "tools/register-millennium-config-snapshot-task.ps1 / tools/snapshot-millennium-config-hidden.vbs", role: "任务注册、隐藏窗口调用及退出码传递。" },
    { path: "runtime/snapshot-state.json / SteamMillenniumConfigSnapshot", role: "本机最近成功采集与现役任务状态；runtime 不进入 Git。" },
    { path: "tests/run-snapshot-tests.ps1 / README.md / README.pdf", role: "19 项隔离断言，以及已修正并发布的操作与恢复指南。" }
  ],
  evolution: [
    { date: "2026-07", commit: "9df1944 / 6507178 / ffd0870", result: "从配置留存形成可定期使用的备份：明确插件私有设置不随清单保存，加入隐藏窗口运行、目标手工改动保护和失败重试。" },
    { date: "2026-08", commit: "c65bb36 / 0b118b0", result: "更新两套主题配置，并阻止源与目标相同或嵌套时错误覆盖来源；保留完整的手工恢复边界。" }
  ],
  snapshotUpdateNote: "本页将公开配置版本、本机快照和安装目录分开。来源指南已修正为实际插件版本与分步恢复说明；本轮没有启动、重启、安装或恢复真实 Steam，也没有把未提交配置推送到远端。"
};

const steamMillenniumConfigBackupModules = [
  {
    id: "allowlist-config-and-style-snapshot", slug: "allowlist-config-and-style-snapshot", order: 1,
    title: "核心设置与自己的样式", shortTitle: "核心设置与样式", kicker: "留住颜色、更新开关、插件选择和细滚动条",
    value: "保存 Millennium 的核心设置与 quick.css，让重装或误改后能按记录恢复自己的选择。",
    status: "配置已采集；本轮未做界面恢复", statusTone: "accent", stateLabels,
    why: "颜色和滚动条只是看得见的一部分，更新通道、注入开关、插件启用名单也会影响客户端行为。一起保存，恢复时才不只找回一张相似的皮肤。",
    example: "“我想恢复 Steam 之前的绿色和细滚动条。”先装好 Millennium，再合并回填 config/config.json 与 config/quick.css；打开 Steam 检查颜色和滚动区域，不能只看文件在不在。",
    result: "拿到原来的参数和 CSS 文件；对应版本可用且注入正常时，用它们恢复设置，再从界面确认。",
    teaser: "核心开关和全局 quick.css 都保留，文件复制与实际效果分开验证。",
    problem: "只重装主题不能恢复全部个人选择，直接覆盖不兼容的新配置也可能让设置失效。",
    readerStates: { pass: "核心设置与样式已在快照中，可用于核对或手工回填。", problem: "版本不同先检查实际配置键与选项；样式不生效再查注入开关和当前页面支持。", unavailable: "没有 Millennium、资源未装好或相应注入关闭时，复制 CSS 不会自动建立运行环境。" },
    decisionImpact: ["只复制原文件，不替用户重写配置或自动转换键名。", "保留核心选择和轻量 CSS，程序、缓存与账号状态不随配置走。", "quick.css 是样式定义；不存在“所有 Steam 窗口已验证生效”的推断。"],
    concepts: [{ term: "CSS / JavaScript 注入", explanation: "Millennium 把样式或脚本加载到 Steam 页面；开关配置与页面实际执行是两层证据。" }, { term: "quick.css", explanation: "个人全局样式文件，本快照保留滚动条 4px、半透明滑块和透明轨道规则。" }],
    implementation: ["general.accentColor=#00ff00，millenniumUpdateChannel=stable；更新检查和 injectCSS/injectJavascript 开启，onMillenniumUpdate=2。三项通知开关均开启，network.proxy、proxyUsername、proxyPassword 均为空；不从数值枚举推断未验证的更新行为。", "plugins.enabledPlugins 保存 3 个插件名；themes.activeTheme、conditions、themeColors 分别保存当前主题、选项和颜色。", "Copy-MillenniumAllowlist 只复制核心的 config.json 与 quick.css；不重排或重新序列化 JSON。"],
    flow: ["在实际 Millennium 目录找到核心配置与 quick.css。", "与其余白名单文件一起复制到暂存区并检查。", "更新备份 config 目录；恢复时则合并回填所选版本的文件，最后在 Steam 检查效果。"],
    boundaries: ["快照工具不做通用 JSON schema 校验、CSS 兼容转换或配置自动迁移。", "不覆盖 Steam 原生账号登录、游戏库或存档恢复。"],
    failures: [{ condition: "配置里存在非空代理用户名或密码", response: "当前内容检查会拒绝更新目标。按具体值处理，不能通过公开提交整个配置来解决采集失败。" }, { condition: "回填后样式或选项没有按预期出现", response: "检查 Millennium、主题版本与注入配置；按需要撤回目标机保留的配置，不宣称清空 quick.css 必然修复所有窗口问题。" }],
    sources: [{ path: "config/config.json", role: "真实参数与选择。" }, { path: "config/quick.css", role: "实际滚动条样式定义。" }, { path: "tools/snapshot-millennium-config.ps1", role: "复制范围及内容检查。" }],
    verification: ["原有测试的 copies config.json 与 copies quick.css 通过。", "本轮核心文件经隔离采集及回填后，与来源 SHA-256 相同；没有将这个结果当作真实界面验收。"],
    searchProjection: { intents: ["找回 Steam 绿色强调色和细滚动条", "Millennium quick.css 怎么备份和恢复"], entities: ["config/config.json", "config/quick.css", "general.accentColor", "injectCSS", "injectJavascript", "::-webkit-scrollbar"], relations: ["核心配置保存选择，quick.css 保存样式，Millennium 负责实际加载"], failureRecovery: ["样式不生效时核对注入和主题版本，必要时回到目标机已保留配置"] },
    relation: "核心配置中的插件名单和主题选择连接后两类快照；采集与恢复流程负责搬运这些文件。"
  },
  {
    id: "plugin-manifest-and-install-state-tracking", slug: "plugin-manifest-and-install-state-tracking", order: 2,
    title: "插件清单、版本与启用选择", shortTitle: "插件清单", kicker: "重装时知道装什么，也知道哪些设置还要另外找",
    value: "留下插件名称、用途、版本、上游提交和启用名单，帮助重新安装与排查版本差异。",
    status: "5 款清单；配置启用 3 款", statusTone: "accent", stateLabels,
    why: "换电脑后容易只记得“装过一个封面插件”，却不记得名称和版本。清单能补上这部分记忆，但不能代替插件程序和插件自己保存的数据。",
    example: "“我之前装了哪些 Steam 插件？”清单能找出 Extendium、Size on Disk 和 Easy SteamGrid 等名称；配置也表明其中哪些被启用。按清单重新安装后，进入插件设置确认还缺什么。",
    result: "得到可核对的重装线索和启用选择；不会把一份 plugin.json 误当成已经装好的插件。",
    teaser: "5 款插件的用途、版本和提交都有记录，私有设置仍需另外恢复。",
    problem: "清单版本、实际程序版本和启用配置可能不同；复制旧 metadata 不能把新程序变回旧程序。",
    readerStates: { pass: "可以直接查到 5 款插件和配置中的 3 款启用选择。", problem: "当前 HLTB 的安装元数据比快照不同；其他插件的实际功能也要在 Steam 中检查。", unavailable: "插件程序未安装、对应版本不可取得或不能在当前 Steam 中加载时，配置清单本身无法运行它。" },
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
    relation: "依赖 Millennium 加载；本项目只保留重装和比较需要的清单，不接管插件自身功能。"
  },
  {
    id: "theme-options-palette-and-dual-baseline-tracking", slug: "theme-options-palette-and-dual-baseline-tracking", order: 3,
    title: "主题选项、配色与版本差异", shortTitle: "主题选项与配色", kicker: "留住 Adwaita 和 Zehn 的选择，恢复时对上真实主题版本",
    value: "保存两套主题的选项定义、来源提交与自己的颜色选择，减少换机后重新调校。",
    status: "选中 Adwaita；Zehn 安装版本已更新", statusTone: "accent", stateLabels,
    why: "圆角、字体、标题栏和配色很难只凭记忆复现。主题更新又可能增删选项，所以需要同时知道“我选了什么”和“这些选项属于哪一版主题”。",
    example: "“之前 Zehn 的浅色和圆角怎么调的？”config.json 保存 Color Mode=Light、Panel Roundness=4、Scrollbar Style=Hidden 等选择。但当前安装的 Zehn 已更新到 2026.9.7，不能把快照里的旧定义直接当作新版本状态。",
    result: "可以读回自己的选项和 RGB 配色，再对照主题版本恢复；最终仍需在当前 Steam 中检查效果。",
    teaser: "Adwaita 和 Zehn 的选项、颜色与来源提交都留下；公开提交、本地快照和安装分别说明。",
    problem: "只有配色值没有主题资源无法呈现界面；复制旧版本定义到新程序，也可能引用已经变化的选项或资源。",
    readerStates: { pass: "config.json 保存两套主题条件与配色，activeTheme 选中 Adwaita-for-Steam。", problem: "公开配置、本地快照和当前安装的版本并不完全一致；先选择要恢复的那一层。", unavailable: "主题资源缺失或旧版本不可取得时，配置文件不能补出图片、字体、样式程序或兼容转换。" },
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
    relation: "与核心设置一起还原外观；插件清单是另外一类扩展，二者都依赖真实程序资源。"
  },
  {
    id: "scheduled-snapshot-guardian-and-clean-restore-boundary", slug: "scheduled-snapshot-guardian-and-clean-restore-boundary", order: 4,
    title: "每周采集与手工恢复", shortTitle: "自动采集与恢复", kicker: "按时留下配置，遇到冲突保留现场，恢复时逐项检查",
    value: "用每周任务减少忘记备份；根据成功时间、文件差异和恢复规程判断是否已经准备好。",
    status: "最近任务成功；隔离回填通过", statusTone: "accent", stateLabels,
    why: "手工记着备份容易遗漏；采集也不能把正在修改的文件冲掉，更不能误把“有快照”当作已重装好全部程序。",
    example: "“我想每周自动留一份配置，出问题时照着恢复。”任务在用户登录后按周执行，不显示调用窗口；来源不可用、路径重叠或手工改动冲突时报错。需要恢复时先装程序，再合并配置，最后检查实际界面与插件。",
    result: "得到本地快照、最近成功记录和可执行的手工步骤；任务失败、备份落后或尚未实机恢复都能分别判断。",
    teaser: "每周日 19:30 采集，7 天节流；已有手工改动先检查，恢复保留程序与资源。",
    problem: "任务存在不代表采集成功，本地采集不等于 GitHub 已更新，文件复制也不等于恢复完成。",
    readerStates: { pass: "任务最近结果为 0，采集记录有时间与 20 文件；本轮隔离回填逐字节一致。", problem: "不同的手工改动会使脚本报错，写入中断可能只更新部分目录；需检查和处理后再运行。", unavailable: "找不到 Millennium 或当前用户未登录时，不具备同样的采集条件；配置也不能代替缺失的程序资源。" },
    decisionImpact: ["复用 Windows 任务计划与小 VBS，不增加常驻备份服务。", "7 天节流只是避免重复运行；-Force 不绕过路径、目标改动和内容检查。", "目录替换有明确中断边界，手工恢复用合并复制，不能反向运行快照脚本。", "恢复按现有分步规程进行，用户可选择具体快照，并核对新装程序是否与旧配置对应。"],
    concepts: [{ term: "ThrottleDays（节流天数）", explanation: "默认 7 天内已有成功采集就跳过；-Force 或非正天数可忽略时间限制。" }, { term: "Interactive Logon（交互登录）", explanation: "现役任务依赖该用户已经登录；不是保证无人登录时运行的服务。" }, { term: "staging（暂存区）", explanation: "先组装和检查允许文件，再逐目录更新备份；它不提供原子替换或自动回滚。" }],
    implementation: [
      "来源优先用显式 SourceRoot，否则 HKCU:\\Software\\Valve\\Steam 的 SteamPath，再检查 Program Files 常见路径；找不到时报错。DestinationRoot 默认项目根，RuntimeRoot 默认项目 runtime。",
      "Test-PathsOverlap 拒绝源与目标相同或包含；Test-DestinationDirty 检查目标 Git。与源字节相同的快照改动及采集脚本自身变化允许继续，其他脏文件阻断，除非明确使用 AllowDirtyDestination。",
      "读取 snapshot-state.json 判断 7 天节流；记录缺失或无法解析则不节流。按允许文件名采集到 staging，零文件时报错，通过内容检查后顺序重建 config、plugins、themes，最后写成功状态。",
      "注册脚本设置周日当地时间 19:30、Limited 权限、Interactive 登录、StartWhenAvailable、IgnoreNew、3 次重试、15 分钟间隔和 10 分钟上限。VBS 调用 powershell.exe，隐藏窗口、等待退出并传回退出码。",
      "恢复规程要求先安装程序和对应资源，再退出 Steam、保留目标配置、合并回填允许文件，检查旧 metadata 与新程序版本是否对应，启动后逐项检查。"
    ],
    flow: ["周任务触发或手动采集，解析实际来源。", "检查目录重叠、目标差异和最近成功时间。", "按文件名白名单暂存，检查指定内容模式，再依次更新三个快照目录。", "写入成功时间和文件数；需要远端保存时另行检查差异并提交 Git。", "恢复时选择一份真实快照、重新安装程序资源、合并文件，最后从 Steam 与插件确认结果。"],
    boundaries: ["任务是本地定期采集，不自动 push、不保存每次未提交改动的历史，也不保证未来每次运行成功。", "暂存检查不做全库扫描或任意秘密检测，顺序复制不具备自动事务回滚。", "恢复没有一键脚本，本轮不启动或重启真实 Steam，也不安装/卸载插件和主题。"],
    failures: [{ condition: "源与目标重叠或不同的手工改动仍未处理", response: "采集报错并保留现场；先选择分离目录或处理具体差异，不默认传 AllowDirtyDestination 覆盖一切。" }, { condition: "最近采集时间仍在 7 天内", response: "返回正常跳过；确需新快照可用 -Force，仍保留其他检查。" }, { condition: "写入中断或恢复版本不匹配", response: "核对实际目录和选定版本，重做必要复制或回到已有恢复点；无法证明的实际外观与插件结果继续标明未验证。" }],
    sources: [{ path: "tools/snapshot-millennium-config.ps1", role: "真实采集与失败处理。" }, { path: "tools/register-millennium-config-snapshot-task.ps1", role: "注册及任务参数。" }, { path: "tools/snapshot-millennium-config-hidden.vbs", role: "隐藏调用与退出码传递。" }, { path: "runtime/snapshot-state.json / README.md / tests/run-snapshot-tests.ps1", role: "成功记录、分步恢复指南与 19 项隔离断言。" }],
    verification: ["原有 19 项断言全部通过；重试参数的两项检查属于源码断言，不是实际失败重试演练。", "现场任务 Ready、最近结果 0；成功记录为 2026-09-07T02:30:01.5691614Z、20 文件。", "20 文件隔离采集与回填字节一致，19 JSON 解析成功，3 个虚构已安装资源/私有设置保留；未做真实 Steam 恢复。"],
    searchProjection: { intents: ["Steam Millennium 最近有没有自动备份", "每周备份 Steam 配置不要弹黑框", "Millennium 重装恢复步骤", "备份脚本提示工作区有改动怎么办"], entities: ["SteamMillenniumConfigSnapshot", "tools/snapshot-millennium-config.ps1", "tools/register-millennium-config-snapshot-task.ps1", "tools/snapshot-millennium-config-hidden.vbs", "tests/run-snapshot-tests.ps1", "runtime/snapshot-state.json", "ThrottleDays", "AllowDirtyDestination"], relations: ["任务调用 VBS，VBS 隐藏运行采集脚本并传回退出码", "快照先检查再顺序复制，恢复另行合并回填"], failureRecovery: ["不同的手工改动先处理再采集", "复制成功后还需要核对界面和插件，不能当作完整恢复"] },
    relation: "负责前三类配置的定期留存和恢复操作；Steam、Millennium 及插件主题各自负责实际运行。"
  }
];

export const project = steamMillenniumConfigBackupProject;
export const modules = steamMillenniumConfigBackupModules;
export { steamMillenniumConfigBackupSnapshot, steamMillenniumConfigBackupProject, steamMillenniumConfigBackupModules };
