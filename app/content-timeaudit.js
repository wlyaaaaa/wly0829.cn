import { createProjectSnapshot } from "./project-snapshot.js";

const timeAuditSnapshot = createProjectSnapshot({
  observedAt: "2026-09-24T17:45:00Z",
  label: "Grafana公网入口已恢复，原采集与自动启动已加固；历史空档如实保留",
  boundary: "本轮已提交 PUBLIC main=9f51f40：恢复既有Docker依赖链，Grafana宿主端口由被Windows保留的53000迁到43000，原公网地址及数据卷保持。完整运行健康回读通过、待入库归零，公网健康接口200；约12:53–16:46 UTC的硬件遥测空档没有回填。活动、帧率、备份和历史图片继续保留各自原观察日期。",
  metrics: [
    { label: "9月14日一小时硬件样本", value: "3599" },
    { label: "9月14日有效/拒绝正帧", value: "2369 / 1229" },
    { label: "9月14日活动覆盖", value: "3383 / 3600 秒" },
    { label: "大盘", value: "6 · 78" }
  ],
  facts: [
    { label: "当前帧有效性与历史窗口", value: "2026-09-08修复后三分钟历史窗口的133个正帧全部被拒绝，no_game_frames结论保留。2026-09-14一小时摘要另有3598正帧，其中2369有效、1229拒绝，quality=mixed_valid_and_rejected；有效子集FPS均值222.631、最低172.8，1% Low均值111.272、帧时p95为7.356ms。有效性只证明数值范围及FPS与帧时一致；提供器未给拒绝原因分项或帧源身份，不能推断拒绝来自哪种故障，也不能把这些帧自动称为真实游戏验收。" },
    { label: "采样与保留", value: "硬件 / FPS / 前台心跳 1 秒，活跃进程 3 秒；约 2 GB/周、330 GB/三年、1200 天保留；数据库与 Grafana 每类备份轮转上限 14 份" },
    { label: "帧率来源与空闲", value: "当前源码优先读取 RTSS（RivaTuner Statistics Server 帧率工具）的共享内存；按前台进程、RTSS 最近前台、已启用的 Wallpaper 桌面渲染器和唯一新鲜帧源选择。映射可用但无有效帧为正常 gated_idle；映射不可用才启用 PresentMon 后备，不能把所有零值都当正常等待。" },
    { label: "存储与展示", value: "PostgreSQL 15（本机45432）+ Grafana 13.0.2（本机43000）；原公网Grafana地址保持，6 张仪表盘、78 个面板。" },
    { label: "当前共享健康与历史聚合", value: "2026-09-18T13:14Z共享健康正常：AHK约0.87秒、硬件数据库约0.38秒新鲜，待写、写失败和溢出均0，已有contract-2质量来源。数据库备份14份，最近约9.22小时/4162.12MiB，清单/长度通过、full_restore_verified=false；本轮未重哈希或恢复数据库。9月14日3599样本/3383秒活动覆盖仍是历史窗口，不能拿当前心跳覆盖它的217秒缺口。" },
    { label: "9月8日受管换代与空档", value: "2026-09-08T08:34:28Z仅停止已核对身份的旧采集worker，由既有TimeAudit_Watchdog拉起新launcher 57708→worker 61904（08:34:50Z）。首个新样本08:35:19Z，启动窗口前沿有51.03秒缺口。随后三分钟GPU占用/温度/功率/核心和显存时钟180/180非空且物理有效；不新增服务、不改历史样本，也未重启电脑或GPU驱动。" },
    { label: "当前正式实现与部署边界", value: "PUBLIC main 9f51f40e729ffd8c0e3c8cebafe331b3cefa00c7 已正常推送。既有AutoStart恢复缺失依赖，正在启动时不重复触发；AHK精确实例与健康容器保留，配置变更只在明确部署时应用。18项Python与8项PowerShell恢复分支测试通过；源码与实际恢复分别回读。" },
    { label: "完整时段个人活动读取", value: "personal_activity_reader.py --summary 可按明确时间窗给完整时段与北京时间逐日概览，分别说明前台和 AHK 记录覆盖、未覆盖、状态及应用排名。开放会话不外推，记录不是本人在场或工作成果；本轮只核源码与测试，未读取生产活动窗口，也未证明 timeaudit-diagnostics Skill 已自动调用新入口。", hero: false },
    { label: "剪贴板同内容分组", value: "源码 622b66c 对完全相同内容分组；按来源实例、开机、会话和序列排除同一次复制的重复观察，真正再次复制才增加次数。日期、链接、疑似密钥等筛选先于全历史分组和分页；疑似密钥是格式线索，不保证检出。原事件和正文对象保持，实际当前总数本轮未重读。", hero: false },
    { label: "本轮有界运行健康", value: "2026-09-24T16:52:36Z完整TimeAudit健康为healthy，Grafana、数据库、遥测、入库、活动持久化及watchdog均正常；963条积压批次由原入库器处理，pending_files=0。公网Grafana健康接口随后返回200/database=ok；没有重置Docker、删除数据库或重算缺失历史。", hero: false },
    { label: "独立剪贴板历史 · 8月31日证据", value: "WM_CLIPBOARDUPDATE事件采集与SQLite schema v1/WAL/FTS5独立工作。8月31日为5234事件、2312个blob（正文对象）、3406条全文索引，3个任务与无正文adapter（适配出口）验证通过、专属11项测试通过；本次未重读当前正文或计数。" },
    { label: "已验证发布基线", value: "Git Owner 在 2026-08-31T21:38:05Z live（实时）回读确认 wlyaaaaa/TimeAudit 为 PUBLIC（公开），当时 main（默认主分支）=本地 HEAD=origin/main=001cee0918f3fc1adbd5eed5145c7ee353038291，ahead/behind（本地领先/落后）均为 0，工作树 clean（干净）。这是下列发布、测试与现场证据的固定版本，不用它冒充后续源码的发布证明。", hero: false },
    { label: "现役源码的帧链与坏值处理", value: "e5459ce保留RTSSSharedMemoryV2只读首选、2秒新鲜度、双读一致性和fps_capture_status/detail入库；只有映射不可用才考虑PresentMon。新增NVML成功返回但核心指标非有限或越界时，按既有失败路径清句柄并重新初始化，当前拍只接受真实LHM回退或NULL，不把坏值裁成0。README已改为四worker、新实例退让，以及映射不可用才后备。", hero: false },
    { label: "LHM 单 Owner 源码", value: "44a842e..001cee0 的 6 文件变更已成为正式 source（源码）：LibreHardwareMonitor 的运行 owner 收敛到独立 `LibreHardwareMonitor` 计划任务，`telemetry_watchdog.ps1` 是登记的自动恢复路径，hardware_worker.py 对运行中的 LHM 只读本机 18085，端点不可用时留空而不自行拉起、结束或替换 LHM；缺少二进制时的 prepare（文件准备）线程仍只负责取得组件文件。", hero: false },
    { label: "8 月 31 日运行字节加载", value: "当次 hardware_worker.py blob 为 9cfc397，与 001cee0 完全一致；文件在 16:56:22Z 落盘，项目 `.venv` 的 main.py 逻辑进程在 17:10:05Z 启动，证明当时主引擎在该 worker 字节落盘后加载，不证明已采用后来的 c3ca677 帧链。Windows 中可见的 `.venv` launcher（启动器）与其 Python 3.11 子进程是一个父子运行链，不是两个独立 collector。", hero: false },
    { label: "8月31日LHM与Watchdog现场", value: "`LibreHardwareMonitor` 任务为 Interactive Highest（交互式最高权限）、IgnoreNew（忽略重复实例）且 action（动作）精确指向项目 exe；观察时 1 个 46-thread（线程）实例运行并由 18085 返回 HTTP 200，另有 3 个零线程 stopped（已停止）的 crash ghost（崩溃残影），新健康检查不会把残影冒充在线。`TimeAudit_Watchdog` 每分钟 + 登录触发、IgnoreNew、3 次/1 分钟任务级重试、3 分钟上限，最近一轮结果为 0；任务清单中只有这两个入口引用 LHM / telemetry_watchdog。", hero: false },
    { label: "8月31日容器与数据库现场", value: "audit-postgres、audit-ingester、audit-grafana 三个容器运行，入库器为 healthy（健康），PostgreSQL 暴露本机 45432，Grafana 13.0.2 暴露本机 53000；只读现场健康脚本 21/21 通过，近 2 分钟 120/120 条硬件样本均有 LHM GPU 电压与 CPU Vcore，最新写入年龄 0.8 秒。", hero: false },
    { label: "8月31日完整回归", value: "001cee0完整回归为182 passed（通过）、11 subtests passed（子测试通过）、49.01秒；另有LHM/Watchdog的10/10定向断言。9月8日e5459ce只重跑与NVML、FPS选择/状态和诊断摘要有关的39项；没有重跑旧182项，也没有安装或改写生产依赖。", hero: false },
    { label: "8月31日剪贴板Sidecar", value: "8月31日剪贴板sidecar的PCConfig有界验证为 passed（通过）：TimeAudit_ClipboardCollector 为 Running，TimeAudit_ClipboardWatchdog 与 TimeAudit_ClipboardNearlineBackup 为 Ready，三任务均为普通用户 Limited（受限）运行级别；无正文 heartbeat 年龄 2824 ms、数据库 integrity=ok、schema_version=1，计数为 5234 个事件 / 2312 个正文对象 / 3406 条 FTS 索引，adapter（适配出口）返回 v1 且 payload（正文载荷）缺省。专属 11 项合成回归另在 0.806 秒内通过。", hero: false },
    { label: "8月31日一小时诊断", value: "`timeaudit_diagnostic_summary.py --hours 1` 在 2026-08-31T21:45:19Z 返回 schema=timeaudit.diagnostic-summary.v1、owner=timeaudit:diagnostic-history、status=ok、coverage=fresh、3660 个硬件样本，最新样本年龄 0.129 秒、最大 gap 1.086 秒；活动记录覆盖 3478/3600 秒，未覆盖 122 秒。CPU 均值/峰值 65.4/71.4°C、GPU hotspot 最高 64°C、磁盘 p95 0.235 ms，没有有效游戏帧被正确标为 no_game_frames。packet-loss 信号 17 次、活动状态重叠 36 秒都只进入复核边界。", hero: false },
    { label: "采集可靠性", value: "当前源码的 RTSS 分支以系统 tick（启动计时）判断帧年龄并复核共享内存一致性；PresentMon 后备仍用单调时钟判断新鲜度，避免墙钟回拨让旧帧存活。`psutil.net_connections()` 进入可重启隔离进程，并避开 Windows `cpu_stats()` 原生崩溃路径。", hero: false },
    { label: "运行依赖", value: "生产 Python 依赖已经收敛到项目 `.venv`；启动器与 Watchdog 不依赖全局 Python 包。", hero: false },
    { label: "容量合同", value: "保留与备份审计按约 2 GB/周、330 GB/三年和 1200 天保留估算；数据库与 Grafana 每类备份轮转上限为 14 份。这是容量与轮转合同，不证明任一备份已完成隔离整库恢复。", hero: false },
    { label: "已根治的采集误差", value: "历史源码修复已消除172个正常系统进程误报，修正一小时窗中的 138 对重叠以避免 1 小时被算成 1.5 小时，并把占采集耗时 86% 的父进程解析替换为同一快照映射。", hero: false },
    { label: "聚合接口边界", value: "两个聚合回执为了快速、有界而不返回逐行历史、进程或窗口明细；这是 provider（提供器）的接口范围，不代表这些字段类别禁止公开。阈值信号也只表示相关与出现次数，不证明硬件故障、恶意程序或用户意图。", hero: false }
  ],
  gaps: [
    "2026-09-24约12:53–16:46 UTC未采集的硬件遥测没有回填。旧53000落入Windows排除范围52954–53053，现改43000；已有但失效的Docker后端仍只报告不可用，不自动重启共享引擎。",
    "网页使用官方有界摘要；源修复只额外核对精确采集进程与GPU有效计数。没有读取窗口、聊天或剪贴板正文，不能据此解释某段私人活动或具体程序根因。",
    "001cee0 的 182 项完整源码回归与 21 项现场健康检查已通过，但没有执行 db_audit.py 的整库数据审计，也没有对全部 Grafana SQL 做当前数据库执行计划验收；在线状态与测试都不能证明历史数据全绿。",
    "2026-09-08曾通过既有Watchdog真实换代TimeAudit采集器，保留约51.03秒启动前沿空档；LHM进程崩溃或18085端点故障的恢复没有重新注入，不能把采集器换代当作所有依赖故障都已验收。",
    "8 月 31 日的一小时诊断窗口没有有效游戏帧，因此没有 FPS、1% Low 与 frametime 结论。no_game_frames 只说明该摘要没有可分析帧；判断正常空闲还必须同时看新鲜度和明确的 gated_idle，不能掩盖 waiting_frames、error 或来源不可用。",
    "当前摘要仍有1229个正帧被拒绝；提供器没有帧源身份和拒绝原因分项，不能把有效子集升级为真实游戏或确定故障结论。",
    "本次没有打开 Grafana 做 index→Overview→代表模块的用户可见路径验收；容器运行、聚合查询和历史截图不能替代当前浏览器 E2E。",
    "diagnostic summary v1 最长查询 168 小时且仅聚合；需要更长趋势或逐进程/路径/窗口明细时，应建立有明确价值并按实际值判断敏感性的另一条路线，不能把缺失字段猜出来。",
    "已证旧长寿命进程内NVML返回失真，最初触发原因仍未知。新进程使用当前库与显式旧DLL均正常，旧DLL版本不是已证根因；三分钟新样本正常不证明永不复发，历史坏值没有自动删除或重算。",
    "剪贴板专属 11 项单元测试与 PCConfig 无正文运行验证通过，但本次没有执行会写入合成剪贴板内容的真机 smoke test（回环测试），也没有从 G 盘近线副本恢复到空目录；任务结果 0 与备份根存在都不能证明最新副本已完成端到端恢复。",
    "8月31日历史备份任务结果为0、定向恢复测试通过；本轮未重查任务或从最新dump和Grafana备份做隔离整套恢复。"
  ]
});

export const timeAuditProject = {
  usageEntry: "在TimeAudit数据大盘（Grafana）查看电脑历史与性能；本站首页可先看Grafana状态并进入大盘。需要AI解释一段异常时，说明症状和时间。复制记录在本机“密码中心”的“剪贴板历史”页查看。",
  usageInputs: ["想看的时间范围与异常现象", "是硬件、进程、使用时长还是剪贴板记录", "需要只读分析还是维护恢复"],
  order: 10,
  slug: "timeaudit",
  title: "TimeAudit",
  route: "/projects/timeaudit",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "最新一小时采样新鲜、硬件阈值异常0；有效帧与拒绝帧并存",
  cardStatusTone: "mixed",
  ...timeAuditSnapshot,
  searchAliases: [
    "昨晚电脑为什么突然卡",
    "哪个程序闪退写盘或联网",
    "电脑最近发热耗电怎么复盘",
    "TimeAudit新电脑怎样安装",
    "换机怎样带走TimeAudit历史",
    "系统重装后怎样恢复TimeAudit",
    "刚才复制的内容被覆盖了怎么找回",
    "怎样搜索以前复制过的网址和文件路径",
    "剪贴板历史怎样再次复制",
    "剪贴板历史怎样增量导出"
  ],
  repositoryNote: "这是吴乐阳个人维护并集成第三方探针/库的 PUBLIC（公开）GitHub 仓库；根目录没有统一 LICENSE，不能仅因公开就称为开源，也不能把 LibreHardwareMonitor、RTSS、PresentMon、Grafana 等外部组件冒充个人原创。进程名、路径、命令行、窗口标题、时间、遥测、机器与网络指标不因字段类型自动保密；本页可在有用时公开这些技术事实。只有实际包含个人敏感正文或密码、令牌、密钥、恢复码等凭据的具体值才隐藏。原始全库不镜像进网页，是因为体积、噪声和解释边界。",
  summary: "电脑卡过、热过、掉过帧，等打开任务管理器时却恢复正常了。TimeAudit 持续保留硬件、程序、时间使用与能耗记录，可按完整时段和每天查看已记录的活动与空档，再把故障信号按同一时间对齐；另有独立的本机剪贴板历史，把相同内容和真实复制次数放在一起，帮我找回曾复制的东西。记录缺失就明确留空，诊断不会因为发现异常便重启程序或替我认定原因。",
  why: "任务管理器只能看此刻，卡顿、过热、异常写盘和闪退等现场很快消失；剪贴板内容也会被下一次复制覆盖。TimeAudit 让偶发故障可以事后按时间对齐，让曾复制的资料可以按关键词、日期和类型找回，同时明确区分观察事实、估算、空档和未知。",
  plainExample: "我可以问：“昨晚游戏突然卡了两秒，到底是显卡、磁盘，还是后台程序在抢资源？”TimeAudit 会先告诉我那段时间有没有足够记录；有的话就把帧率、温度、磁盘和前后台变化对到同一时刻，给出最值得继续查的方向，没有证据的地方直接留空，不靠重启电脑碰运气。",
  result: "得到与故障时间对应的记录、覆盖缺口和值得继续检查的方向，或者按关键词找回的复制内容。健康检查回答现在还在不在记录，备份和隔离恢复另答能否取回数据；三者不能用同一个绿灯代替。",
  readerStates: {
    "pass": "电脑活动时间线可显示有来源的硬件与程序记录，完整时段摘要会分开列出记录覆盖与空档；剪贴板历史另在本机把同内容分组、显示复制次数并允许再次复制。每条能力各自说明最近记录到什么时候。",
    "problem": "采集出现空档、读数异常或某次复制被跳过时，指出受影响的时间和能力；异常本身不等于硬件坏了或某个程序有恶意。",
    "unavailable": "某个传感器、保存位置或查看窗口不可用时，只把相应结果标成无法判断，不补造读数，也不拿私人复制内容做公开报告。"
  },
  gallery: [
    { src: "/media/timeaudit/dashboard-catalog.webp", thumbnail: "/media/timeaudit/thumbs/dashboard-catalog.webp", alt: "TimeAudit 六张仪表盘目录", caption: "2026-08-29 的真实 Grafana 目录：六张盘把性能、流畅度、功耗、取证、后台资源和使用时间组成可回放产品。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明六张仪表盘和 78 个面板曾在真实 Grafana 中组成完整产品入口。", doesNotProve: "不证明当前服务在线、每个查询仍正确或当前数据没有空档。" },
    { src: "/media/timeaudit/screen-time-focus.webp", thumbnail: "/media/timeaudit/thumbs/screen-time-focus.webp", alt: "屏幕使用时间与专注复盘", caption: "2026-08-29 的真实界面，展示屏幕使用、专注上下文、最近切换以及睡眠和暂离边界。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明使用时间与焦点关系曾能在同一大盘阅读，普通应用和时长按真实画面保留。", doesNotProve: "不证明这些应用、标题、时长或生活规律仍是当前事实。" },
    { src: "/media/timeaudit/power-cost.webp", thumbnail: "/media/timeaudit/thumbs/power-cost.webp", alt: "TimeAudit 功耗与电费诊断界面", caption: "2026-08-29 的真实功耗盘，把 CPU、GPU、其他部件、峰谷时段和费用估算放在同一视图。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明功率采样、时段和费用模型已有可用界面。", doesNotProve: "其他部件功耗、电费与碳排是模型估算，不是插座计量或账单。" },
    { src: "/media/timeaudit/hardware-long-term.webp", thumbnail: "/media/timeaudit/thumbs/hardware-long-term.webp", alt: "历史旧版整机硬件长期趋势界面", caption: "历史旧版截图仍含 RTX5080 标题；当前 dashboard 已移除 SKU 绑定，因此它只作为界面演化证据。", evidenceLevel: "E0", evidenceLabel: "历史旧版界面", observedAt: "2026-08-29", sourceCommit: "pre-44a842e dashboard capture", proves: "证明长期温度、功率、频率和降频趋势的界面形态曾存在。", doesNotProve: "不代表当前硬件型号、当前 dashboard 标题或当前长期趋势。" },
    { src: "/media/timeaudit/fps-stutter.webp", thumbnail: "/media/timeaudit/thumbs/fps-stutter.webp", alt: "历史 FPS 数据质量坏例", caption: "历史截图出现最高 8192 FPS 等不可信量级，现作为 PresentMon 新鲜度与一致性修复前的数据质量坏例保留。", evidenceLevel: "E0", evidenceLabel: "历史数据质量坏例", observedAt: "2026-08-29", sourceCommit: "pre-44a842e dashboard capture", proves: "证明旧链曾把异常量级带进 FPS/卡顿界面，也说明为什么需要单调时钟和新鲜度门。", doesNotProve: "不证明任何真实游戏性能、掉帧原因或当前 PresentMon 输出。" },
    { src: "/media/timeaudit/foreground-stutter-analysis.webp", thumbnail: "/media/timeaudit/thumbs/foreground-stutter-analysis.webp", alt: "历史前台卡顿数据质量坏例", caption: "历史界面曾显示 Windows Terminal 平均 826 FPS 等不可信值；它用于展示旧数据问题，不作为当前性能证据。", evidenceLevel: "E0", evidenceLabel: "历史数据质量坏例", observedAt: "2026-08-29", sourceCommit: "pre-44a842e dashboard capture", proves: "证明前台应用、卡顿标记和瓶颈时间线的界面结构，以及旧数据口径曾需要修复。", doesNotProve: "不证明截图中的应用 FPS、瓶颈或任何当前卡顿结论。" },
    { src: "/media/timeaudit/foreground-timeline.webp", thumbnail: "/media/timeaudit/thumbs/foreground-timeline.webp", alt: "前台焦点与卡顿时间线", caption: "2026-08-29 的真实界面，把微观卡顿与前台焦点对齐，并保留当时可见的真实应用上下文。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明焦点时间线和卡顿标记曾能在同一页面对齐。", doesNotProve: "不证明旧 FPS 点全部有效，也不代表当前使用上下文。" },
    { src: "/media/timeaudit/system-pressure.webp", thumbnail: "/media/timeaudit/thumbs/system-pressure.webp", alt: "系统压力与上下文切换", caption: "2026-08-29 的真实系统压力盘，对齐用户态调度抖动、上下文切换、内存与磁盘延迟。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明多个系统压力信号可在同一时间轴比较。", doesNotProve: "不证明内核 DPC、硬件故障或任何单一根因。" },
    { src: "/media/timeaudit/resource-usage.webp", thumbnail: "/media/timeaudit/thumbs/resource-usage.webp", alt: "资源大户与后台负载", caption: "2026-08-29 的真实资源盘，按 CPU、GPU、内存、显存、磁盘和网络展示程序聚合。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明本机 Grafana 可以查看具体程序的资源排行和时间变化。", doesNotProve: "不证明 timeaudit-diagnostics Skill 会自动返回程序名，也不证明资源占用就是根因。" },
    { src: "/media/timeaudit/process-forensics.webp", thumbnail: "/media/timeaudit/thumbs/process-forensics.webp", alt: "进程生命周期与取证线索", caption: "2026-08-29 的真实取证盘，用签名、提权、生命周期、退出码和路径异常提供人工核查线索。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明进程生灭与路径/签名线索有可视化入口。", doesNotProve: "无签名、异常路径或同期活动都不自动证明恶意、黑客或键盘监听。" },
    { src: "/media/timeaudit/storage-scale.webp", thumbnail: "/media/timeaudit/thumbs/storage-scale.webp", alt: "存储吞吐与数据库规模", caption: "2026-08-29 的真实存储盘，展示写密集时序系统的吞吐和分区规模。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明存储吞吐、显存/网络和数据库规模有可读界面。", doesNotProve: "不证明全部 SQL 当前都已裁剪、备份可恢复或长期容量没有风险。" }
  ],
  productPrinciples: [
    {
      "title": "先问什么时候发生",
      "detail": "时间窗口是诊断入口；先定位问题时刻，再决定需要哪些硬件、进程、前台和生命周期证据。"
    },
    {
      "title": "多种信号必须对齐解释",
      "detail": "单个温度、帧率或磁盘尖峰不能直接给根因，只有同一时间轴上的关系才形成候选解释。"
    },
    {
      "title": "空白也有不同原因",
      "detail": "没有游戏帧、没有采到和采集器故障是三种状态，不能都显示成零或正常。"
    },
    {
      "title": "实测、估算、推导和未知分开",
      "detail": "能耗、电费、签名风险和因果判断都有边界，界面必须说明每个值来自哪里、能证明什么。"
    },
    {
      "title": "先看有界摘要，再决定是否深挖",
      "detail": "快速查询先确认覆盖和方向，只有真正需要时才进入详细大盘，不让每次诊断都临时拼查询。"
    },
    {
      "title": "只记录和解释，不自动处置",
      "detail": "异常摘要不自动处置其他应用或修改系统配置；采集器自身仍由既有看门狗按精确身份恢复。相关性、异常路径和无签名都不能直接升级成安全结论。"
    },
    {
      "title": "复制过不等于看过或同意",
      "detail": "本机剪贴板历史只说明电脑观察到一次复制，不能据此推断本人阅读、执行或打算使用它。"
    },
    {
      "title": "私密复制内容只在本机打开",
      "detail": "搜索、预览和再次复制都在本机查看器完成。公开页面只说明功能状态，不显示复制原文、敏感窗口或凭据。"
    },
    {
      "title": "两条记录线可以分别成功或失败",
      "detail": "性能时间线和剪贴板历史各有自己的保存与查看入口；一条暂时坏了，不因此把另一条也报成不可用。"
    },
    {
      "title": "程序在跑也要看数据有没有更新",
      "detail": "最近写入时间只能说明记录在继续；若显卡温度等读数明显越界，先换真实可用来源核对，没有可靠值就留空。"
    },
    {
      "title": "备份成功不等于恢复完成",
      "detail": "数据库、面板和任务都要在隔离环境恢复并回读结果，不能用备份任务退出码冒充可恢复。"
    },
    {
      "title": "读不到就留空，不补一个看似正常的零",
      "detail": "缺传感器、保存失败或采集延迟都要标明。要判断昨晚发生了什么，还须检查当时的记录覆盖，不能只看现在程序在不在。"
    }
  ],
  responsibilities: [
    "持续记录电脑硬件、游戏帧、正在运行的程序、前台使用和程序启停。",
    "把连续读数和有起止时间的活动分别保存，让过去的故障可按时间回看。",
    "在浏览器数据大盘里按实际问题展示变化，而不要求用户先看一长串原始数字。",
    "指出哪些读数来自传感器，哪些是估算、空白或仍不知道。",
    "在本机单独保存新复制的文字、网址和普通文件路径，支持搜索与再次复制。",
    "让已获准的其他工具从上次读到的位置继续取新记录，原始复制内容仍留在本机。",
    "检查是否持续写入，并通过已有恢复任务和备份留住历史。",
    "按点名时间先给简明异常摘要，确需深查再打开详细记录。"
  ],
  exclusions: [
    "不会因一条异常记录自动结束程序、封网或修改电脑。",
    "不是多台公司电脑的集中监控、远程控制或云端告警服务。",
    "网络流量分摊和电脑响应抖动只是线索，不能直接判定某个程序或驱动就是根因。",
    "没有游戏帧可能只是没开游戏，不自动算成采集故障。",
    "不记录图片和任意二进制剪贴板内容，也不把复制当成阅读、同意或执行。",
    "复制内容只在本机查看，不送到网页、性能大盘或公开记录。",
    "不会把整份原始历史都交给一次诊断；先取与问题时间有关的证据。"
  ],
  glossary: [
    { term: "Telemetry（遥测）", meaning: "按固定节拍记录机器状态，供后续回放；本页只展示结构与聚合状态。" },
    { term: "fast / slow lane（快 / 慢车道）", meaning: "1 秒硬件路径与约 3 秒全进程扫描分开，慢扫描不拖住快车道。" },
    { term: "worker（采集工作单元）", meaning: "分别负责前台、进程资源、硬件和生命周期的独立逻辑。" },
    { term: "partition（数据库分区）", meaning: "按周或月拆大表，使长期数据仍可按时间范围裁剪查询。" },
    { term: "FPS / 1% Low（帧率 / 最差 1% 帧率）", meaning: "平均 FPS 看总体速度，1% Low 更能揭示偶发卡顿。" },
    { term: "wall / monotonic clock（墙上 / 单调时间）", meaning: "前者识别睡眠并写事件，后者计算速率以避免对时回拨假尖刺。" },
    { term: "heartbeat（心跳）", meaning: "只记最近成功推进时刻的无正文文件，用来发现进程仍在但循环卡死。" },
    { term: "spool（暂存段）", meaning: "AHK 记录入库前的短期文件；事务成功后才删除。" },
    { term: "WAL（预写日志）", meaning: "SQLite 先把变更写入日志，再合并到主库，使采集和只读查询可以安全并行。" },
    { term: "FTS5（全文搜索索引）", meaning: "SQLite 的全文检索表；缺失时查看器明确不可用，不退化为长期全表扫描。" },
    { term: "lineage（恢复来源链）", meaning: "再次复制时把新事件连接回原事件，既保留两次真实复制，也避免把恢复动作猜成普通来源。" },
    { term: "fail-closed（失败关闭）", meaning: "来源、版本或证据不一致时停止覆盖和恢复，不猜可用结果。" },
    { term: "diagnostic summary（诊断摘要）", meaning: "在最长 168 小时的窗口内用一次聚合查询返回覆盖、硬件、游戏帧、电脑状态、阈值信号和解释边界。" },
    { term: "E2E（端到端验证）", meaning: "真实采集、写库、查询到用户看图完整走通；源码测试不能替代。" }
  ],
  operatingFlow: [
    {
      "title": "先核对这段记录有没有空白",
      "detail": "系统看指定时间内采集是否持续、电脑是否睡眠，以及哪段数据缺失；有缺口先标出来。"
    },
    {
      "title": "核对记录是否完整",
      "detail": "查看采集覆盖、最后写入时间和数据缺口，再打开相应大盘或精确本机记录。"
    },
    {
      "title": "对齐来源找解释",
      "detail": "把硬件、前台、进程、帧率和睡眠等证据放到同一时间线上，估算与探针失败明确标注。"
    },
    {
      "title": "拿到可复查结论",
      "detail": "交回图表、候选原因和未知项；采集停摆先按单组件恢复，不把空值或进程存在当作正常。"
    }
  ],
  technicalOperatingFlow: [
    { title: "分开两条前台记录", detail: "AHK 记录简版使用区间并经 spool 入库；Python 主引擎写硬件、进程、上下文和生命周期事实。" },
    { title: "按快慢节拍采集", detail: "每 1 秒推进硬件、FPS 与前台心跳；全进程扫描约每 3 秒单飞，过慢时跳过而不积压。" },
    { title: "保留来源差异", detail: "NVML、PDH、LibreHardwareMonitor 与 Win32 各守边界；帧率先读 RTSS，只在其映射不可用时启用 PresentMon 后备。新鲜的明确空闲可以等待，已检测渲染却收不到帧、旧数据和采集错误必须分别说明。" },
    { title: "写入分区数据库", detail: "点采样按周/月分区，前台区间另表保存；预热、时区和保留期避免长跑错位。" },
    { title: "先快查，再用问题型大盘回放", detail: "近期事件先由 timeaudit-diagnostics 用一次有界聚合确认覆盖与关键线索；需要更深细节时再框定问题时刻，跨性能、功耗、取证、资源和时间盘对齐证据。" },
    { title: "剪贴板历史走独立旁路", detail: "Windows 消息监听把新复制写入本机 SQLite；桌面查看器负责搜索和再次复制，版本化出口负责增量消费，完全不经过 PostgreSQL、Grafana 或主遥测调度。" },
    { title: "自愈、备份与恢复", detail: "心跳和 Watchdog 只恢复故障组件；数据库与大盘分层备份，并在隔离环境回读恢复结果，不用备份任务成功冒充可恢复。" }
  ],
  components: [
    { name: "Python 主调度程序", responsibility: "组织 1 秒 / 3 秒调度、连接池、单例、分区和睡眠恢复。", implementation: "全进程扫描进工作线程；慢车道未完成时不排队。" },
    { name: "四个 worker", responsibility: "分别采前台、进程资源、硬件和进程生灭。", implementation: "每层拥有独立表、节拍、来源与失败语义。" },
    { name: "AHK + ingester", responsibility: "记录前台使用区间、暂离、息屏、睡眠和锁屏。", implementation: "唯一 spool、有限超时、幂等事件 id；事务成功后删除源段。" },
    { name: "PostgreSQL 15", responsibility: "长期保存点采样、区间、维度和生命周期。", implementation: "硬件按月，进程/上下文按周分区；本地日界和时间条件支持长期查询。" },
    { name: "Grafana 13.0.2", responsibility: "提供 6 张盘、78 个面板。", implementation: "固定 datasource UID（数据源标识）和 JSON 恢复合同。" },
    { name: "Watchdog（看门狗）", responsibility: "恢复 main.py、LibreHardwareMonitor、AHK 和入库器的 native（本机代码）崩溃、假活或端点停滞。", implementation: "每分钟按精确身份、heartbeat（心跳）与端点健康串行检查；LHM 只通过独立任务恢复，hardware worker 不再拥有进程控制。" },
    { name: "backup / restore", responsibility: "备份数据库、Grafana 状态和 dashboard JSON。", implementation: "来源分叉或恢复标识不合格时失败关闭。" },
    { name: "PCConfig anomaly digest（机器配置异常摘要）", responsibility: "向 PCConfig 提供有界增量异常计数与是否建议重查稳定投影。", implementation: "窗口最长 168 小时，只返回覆盖、阈值、计数与建议；字段省略是接口范围，不是公开禁令。" },
    { name: "diagnostic summary provider（历史诊断摘要接口）", responsibility: "为 timeaudit-diagnostics Skill 汇总硬件、有效游戏帧、电脑状态、覆盖空档和阈值信号。", implementation: "`--hours 1-168` 或精确 UTC 窗口执行一次 aggregate-only 查询；schema、owner、coverage 与因果限制失败关闭。" },
    { name: "Windows 剪贴板历史 sidecar", responsibility: "保存新发生的文本、网址与普通文件路径复制，提供本机全文搜索、再次复制、只读增量出口与独立恢复。", implementation: "WM_CLIPBOARDUPDATE + SQLite WAL/FTS5；三项普通用户任务与 G 盘 nearline backup（近线备份）由 PCConfig 管理，不依赖 PostgreSQL/Grafana。" }
  ],
  usageExamples: [
    {
      "moduleSlug": "hardware-performance",
      "ask": "刚才游戏为什么卡？",
      "effect": "先说明那一刻有没有足够记录，再把帧率、硬件压力、磁盘和后台争抢放到同一条时间线上；最后给出最可疑的方向和仍不能证明的部分。"
    },
    {
      "moduleSlug": "process-forensics",
      "ask": "谁在后台写盘或联网？",
      "effect": "先确认这段时间是否有记录、磁盘或网络压力是否真的抬高；需要点名时再打开同一时段的本机明细，不凭一张摘要猜程序名。"
    },
    {
      "moduleSlug": "process-forensics",
      "ask": "程序为什么闪退？",
      "effect": "先查故障时段记录是否连续，再打开同一时间的本机详细图看程序启动、退出和资源变化；证据不足时不点名根因。"
    },
    {
      "moduleSlug": "usage-energy",
      "ask": "时间都花在哪？",
      "effect": "用前台区间、暂离、睡眠、专注块和切换趋势复盘；窗口标题与时长可按实际价值展示，只隐藏其中真正敏感的具体内容。"
    },
    {
      "moduleSlug": "runtime-reliability",
      "ask": "采集进程明明还在，为什么大盘不更新？",
      "effect": "分别核对每条采集链最后一次真正写入的时间，只恢复已经停写的那一项；其他仍健康的记录链继续运行。"
    },
    {
      "moduleSlug": "clipboard-history",
      "ask": "刚才复制的长命令被下一次复制覆盖了，怎么找回来？",
      "effect": "在本机按关键词、日期或类型找到原记录，预览无误后再次复制；系统保留这次找回来自哪条记录，但不会把“复制过”解释成“读过、同意过或执行过”。"
    },
    {
      "moduleSlug": "hardware-performance",
      "ask": "过去一小时电脑为什么偶尔卡？",
      "effect": "先用一份短摘要确认记录覆盖和压力方向；只有确实值得深挖时，才打开具体时刻与程序明细，不把一次温度或丢包信号直接写成根因。"
    },
    {
      "moduleSlug": "collection-pipeline",
      "ask": "为什么最近一段时间完全没数据？",
      "effect": "先判断那段时间是睡眠、关机，还是采集真的断了，再指出断在哪一层和可恢复入口；空白记录不会被包装成“电脑一切正常”。"
    },
    {
      "moduleSlug": "backup-recovery",
      "ask": "换电脑时，能把 TimeAudit 和以前的历史一起恢复吗？",
      "effect": "先确认这是带历史换机，再重建运行环境、恢复选定备份并逐层验收；最后我能看到旧历史、新记录继续写入，以及备份后仍然缺少的那一段。"
    },
    {
      "moduleSlug": "backup-recovery",
      "ask": "先检查备份，再在隔离环境证明能恢复，别碰现在的数据库。",
      "effect": "先核对备份清单和时间；明确选择恢复演练时才在独立环境试读历史，完成后清理这次环境，现役数据库保持不动。"
    },
    {
      "moduleSlug": "runtime-reliability",
      "ask": "昨晚卡住时记录真的在写吗？别只告诉我进程还活着。",
      "effect": "同时核对历史覆盖、当前硬件和活动写入、积压及最近守护结果；缺采与真实睡眠分开。需要时结合Windows原生内存记录和事件比较原因，阈值或相关性不直接当根因。"
    }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "截止来源为b64fafe；必要补救e5459ce已正常推送并回读默认main。现役仍为LHM独立任务、telemetry_watchdog唯一自动恢复和hardware worker（硬件采集工作单元）只读18085；新增NVML越界拒收复用原有重初始化/后备，没有新服务。", doesNotProve: "本机任务已指向这些文件、运行进程已经重新加载或故障恢复已经真实发生。" },
    { layer: "Install / task（安装 / 任务）", proves: "8月31日回读LHM任务action（动作）指向项目exe、Watchdog指向隐藏launcher（启动器）；两者均为Interactive Highest、IgnoreNew，Watchdog 每分钟 + 登录触发并保留有界重试/执行上限。", doesNotProve: "任务当前端点健康、主引擎使用新 worker，或恢复动作能成功。" },
    { layer: "Tests（测试）", proves: "8月31日001cee0完整回归182项+11子测试、LHM/Watchdog10/10、现场健康21/21、剪贴板11/11；9月8日e5459ce另通过39项相关回归，两个日期不互相替代。", doesNotProve: "真实游戏负载、LHM 故障注入、剪贴板真机消息回环、长期全库性能或浏览器用户路径。" },
    { layer: "Runtime（运行）", proves: "2026-09-08精确停止旧采集worker，既有Watchdog拉起新launcher/worker并持续入库；开始有51.03秒前沿缺口，之后三分钟180个GPU样本有效。8月31日容器/LHM/剪贴板运行与完整性记录仍按原日期保留，没有把本次GPU验收扩为全链重验。", doesNotProve: "历史无空档、LHM 死端点可恢复、样本或剪贴板正文正确，或复制代表用户意图。" },
    { layer: "Aggregate（聚合）", proves: "08:41:41Z独立重读(08:35:40Z,08:38:40Z]：180硬件样本、180秒活动覆盖、无异常信号；GPU均值52.306°C/10.05%/97.495W。133个正帧样本全部拒绝，no_game_frames，不给FPS结论。截止前一小时的3600个GPU越界样本仍保留。", doesNotProve: "内核 DPC、硬件故障、具体进程原因、网络根因或持续压力。" },
    { layer: "Gallery / dashboard contract（图片 / 大盘合同）", proves: "11 张获准截图展示真实界面；固定数据源与恢复结构有回归。", doesNotProve: "图片瞬时值可公开推广或全部 SQL 性能达标。" },
    { layer: "Recovery（恢复）", proves: "8月31日主链与剪贴板近线备份任务结果为0；SQLite Online Backup、清单校验与空目录恢复有原日期单元测试。本次没有重读这些备份或执行还原。", doesNotProve: "本次已从最新 PostgreSQL/Grafana 或 G 盘剪贴板副本完成隔离端到端恢复。" }
  ],
  evolution: [
    {
      "date": "2026-06",
      "title": "现场消失后，也能回看",
      "result": "把硬件、程序和使用时间保存为可回放记录，卡顿、发热和磁盘问题能够按同一时刻对照；空档、时钟和采样口径逐步单独说明。",
      "evidence": [
        {
          "date": "2026-06-08",
          "note": "Windows遥测、数据库和仪表盘形成。",
          "commit": "e4c49fd–bf69c85"
        },
        {
          "date": "2026-06-13—06-14",
          "note": "硬件口径、睡眠/时钟/分区边界与每日备份。",
          "commit": "a303f54–faadf31"
        }
      ]
    },
    {
      "date": "2026-07–08",
      "title": "不仅持续记录，也要知道记录可靠吗",
      "result": "隐藏启动、采集恢复与帧率归属逐步收敛，避免进程活着却没有入库、空闲被当故障或不同恢复器争抢；传感器缺失与错误值继续保持缺口。",
      "evidence": [
        {
          "date": "2026-07-03—07-27",
          "note": "启动、看门狗、入库和备份恢复。",
          "commit": "1a0c3a5–6e4c7bd"
        },
        {
          "date": "2026-07-29—08-07",
          "note": "FPS绑定前台渲染进程，并提供不含正文的异常聚合。",
          "commit": "e677ad6–5f41846"
        },
        {
          "date": "2026-08-21",
          "note": "写入缓冲、大盘数据源及恢复边界。",
          "commit": "2ec7807–de82db7"
        },
        {
          "date": "2026-08-23—08-24",
          "note": "遥测恢复串行，空闲不误报为故障。",
          "commit": "2d77616–59ecd01"
        },
        {
          "date": "2026-08-30—08-31",
          "note": "新鲜度、采样隔离与单一恢复责任，历史性能数值不冒充当前观察。",
          "commit": "44a842e–001cee0"
        }
      ]
    },
    {
      "date": "2026-07–08",
      "title": "复制历史形成独立的本机找回能力",
      "result": "新复制的文字、网址和普通文件路径可以按关键词或日期找回并再次复制；它有自己的保存、搜索、增量读取和备份，不依赖性能数据库，也不把复制解释成阅读或执行。",
      "evidence": [
        {
          "date": "2026-07-25—08-16",
          "note": "独立剪贴板历史、桌面查看、增量出口与近线备份形成完整产品轴。",
          "commit": "00d6e29–5d25379"
        }
      ]
    },
    {
      "date": "2026-08–09",
      "title": "一个普通问题能拿到有边界的诊断",
      "result": "按指定时间先汇总覆盖和关键线索，需要时再进详细大盘；不用每次翻全库，也不拿一次相关信号直接定根因。",
      "evidence": [
        {
          "date": "2026-08-29",
          "note": "有界历史诊断和自然请求快路径，仪表盘不再绑定某个硬件型号。",
          "commit": "238ea58–a5a34d6"
        }
      ]
    },
    {
      "date": "2026-09-17",
      "title": "备份和运行健康都有可核对结果",
      "commit": "cbd34b7",
      "result": "同一健康入口核对真实写入和缺口，数据备份可在隔离环境试恢复；没有值、执行失败与恢复未验仍分别说明。"
    },
    {
      "date": "2026-09-23",
      "title": "按完整时段看活动，按内容找复制记录",
      "result": "只读活动入口能把完整时段和北京时间每天的来源覆盖与空档交给本人；剪贴板同内容分组并显示真正复制次数。两者都不把设备记录解释成本人在场或已同意。",
      "evidence": [
        { "date": "2026-09-23", "note": "完整时段摘要与权限边界", "commit": "76dc57d–c317376" },
        { "date": "2026-09-23", "note": "同内容分组、复制次数和类型筛选", "commit": "622b66c" }
      ]
    }
  ],
  operationalEntrypoints: [
    { name: "打开大盘", command: "http://localhost:43000", purpose: "从时间范围进入 6 张诊断盘。" },
    { name: "启动主链", command: "schtasks /run /tn TimeAudit_AutoStart", purpose: "通过交互式提权任务拉起 AHK、Docker 与主引擎。" },
    { name: "查看 Watchdog（看门狗）", command: "Get-ScheduledTaskInfo TimeAudit_Watchdog", purpose: "确认外部恢复任务最近结果，不读遥测正文载荷。" },
    { name: "源码回归", command: "$env:PYTHONPATH='.venv\\Lib\\site-packages'; C:\\Users\\10979\\AppData\\Local\\Programs\\Python\\Python311\\python.exe -B -m pytest -q", purpose: "让本机 pytest runner 优先使用项目 `.venv` 生产依赖，验证运行、入库、仪表盘、备份、FPS 与原生隔离；pytest 不进入生产依赖。" },
    { name: "公开安全聚合", command: "python E:\\Projects\\Tools\\TimeAudit\\pcconfig_anomaly_digest.py --after-utc <UTC> --until-utc <UTC>", purpose: "只返回异常计数、覆盖和建议。" },
    { name: "快速历史诊断", command: "python -B E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py --hours <1-168>", purpose: "一次查询返回覆盖、硬件、有效游戏帧、状态时长、信号与解释限制，供 timeaudit-diagnostics Skill 使用。" },
    { name: "完整时段个人活动摘要", command: "python -B E:\\Projects\\Tools\\TimeAudit\\personal_activity_reader.py --after <含时区起点> --until <含时区终点> --summary", purpose: "经现有个人资料权限读取完整时间窗和北京时间逐日来源覆盖、空档及状态；含私人活动结果只在获准本地会话消费，不把记录等同本人在场。" },
    { name: "打开剪贴板历史", command: "开始菜单：TimeAudit 剪贴板历史", purpose: "在只读桌面查看器中搜索、筛选、预览和再次复制，不经浏览器或固定端口。" },
    { name: "剪贴板有界验收", command: "pwsh -NoProfile -File E:\\PCConfig\\tools\\Test-TimeAuditClipboardHistory.ps1", purpose: "只读检查三任务、无正文心跳、ACL、schema、计数、适配出口与近线根，不输出历史正文。" },
    { name: "备份 / 恢复预检", command: "powershell -File E:\\Projects\\Tools\\TimeAudit\\backup_all.ps1 ; python E:\\Projects\\Tools\\TimeAudit\\restore_grafana.py --dry-run", purpose: "分层备份，并在实际恢复前验证候选。" },
    {
      "name": "明确隔离恢复演练",
      "command": "timeaudit_backup.py restore-check; timeaudit_backup.py restore-status; timeaudit_backup.py finish-restore",
      "purpose": "明确请求下在独立临时数据库验证同一次恢复，完成回读后只清本次资源，不覆盖生产数据库。"
    },
    {
      "name": "共享健康与有界诊断",
      "command": "timeaudit_health.py; E:\\PCConfig\\tools\\Get-ComputerStutterDiagnostic.ps1 -Minutes 15 -Json",
      "purpose": "只读核对当前写入与历史/原生记录/事件，缺证据不当正常，不启动恢复。"
    },
  ],
  "kicker": "把过去的电脑现场找回来",
  "readerBoundary": "历史记录支持排查，不直接证明因果。缺传感器和采集空档不会被补成正常值；剪贴板正文属于独立私人数据，不随性能诊断全量读取。",
};

export const timeAuditModules = [
  {
    slug: "collection-pipeline",
    usageEntry: "日常由已安装的 TimeAudit 自动采集；要理解一段记录，在 Grafana 选择时间范围或请已接入的 AI 说明覆盖。",
    usageInputs: ["目标日期与时间段", "要看硬件、前台或进程活动"],
    productFlow: [
      { title: "确定这段时间", detail: "先看机器是否开机、睡眠以及记录有没有中断。" },
      { title: "读取对应记录", detail: "系统分别采集快速指标和较慢的进程信息，按来源写入，不把两条前台管线重复相加。" },
      { title: "交回有边界的时间线", detail: "看到真实覆盖和缺口；探针失败留空，睡眠回来从新起点算，不制造连续使用或网速尖刺。" },
    ],
    shortTitle: "采集与数据流",
    title: "双节拍采集、两条前台管线与分区写入",
    searchAliases: ["为什么最近一段时间没采集数据", "一秒采样和三秒采样有什么区别", "睡眠后使用时间为什么不连续", "AHK数据没有入库怎么办", "数据库断线后采集会怎样"],
    searchProjection: {
      intents: ["检查最近为什么没有遥测", "理解一秒与三秒采集", "确认睡眠后有没有错误尖峰", "排查 spool 没有入库"],
      entities: ["main.py", "TimeAudit.ahk", "audit-ingester", "PostgreSQL partition", "heartbeat"],
      relations: ["快车道采硬件 FPS 与前台心跳", "慢车道扫描活跃进程", "AHK spool 经事务入库", "点采样和区间事件进入不同分区表"],
      failureRecovery: ["慢扫描超时只跳慢拍", "数据库断线后退避重连", "spool 失败保留源段", "睡眠或关机空档不冒充健康"]
    },
    teaser: "用 1 秒硬件/FPS 快车道、3 秒进程慢车道和独立 AHK 区间管线，把不同频率与语义的数据写入 PostgreSQL，并保留来源、空值、睡眠和重试边界。",
    status: "8月31日001cee0全链健康21/21保留；9月8日e5459ce已部署采集worker并验证180个新GPU样本，未重验全部链路",
    statusTone: "mixed",
    value: "系统会把硬件、进程、前台和生命周期按合适节拍留底，并告诉我数据来自哪条管线、是否估算、哪里有空档。",
    why: "电脑指标、程序活动和窗口使用记录的速度不同，硬塞在一条处理线上会互相拖慢。这里分别记录，再按时间合起来看，睡眠和断线不会被编造成持续使用。",
    example: "我合盖睡了两小时再回来，时间线会把这段明确记成睡眠，网络速率也从醒来后的新起点继续；屏幕上不会凭空多出两小时“持续使用”或一根吓人的假尖刺。",
    result: "得到按时间回看的硬件、程序、前台使用和睡眠记录；每一类都说明更新到什么时候、是否有空档。",
    readerStates: {
      "pass": "相应记录持续保存时，按时间给出可对照的活动和硬件变化。",
      "problem": "某个传感器或程序扫描失败时标明这一类缺口，其他仍能继续记录。",
      "unavailable": "保存位置或必要权限不可用时停相应写入，不补造成功记录。"
    },
    decisionImpact: [
      "先分清 AHK 区间与 Python 全量遥测，避免查错表。",
      "慢扫描不阻塞 1 秒快车道；未完成就跳拍。",
      "睡眠用墙上时间，速率用单调时间。",
      "分区预热和时间下界支持长期查询。"
    ],
    problem: "解决阻塞、重复实例、跨睡眠脏会话、对时假尖刺、spool 重放、缺分区和双管线口径混淆。",
    implementation: [
      "Python 主调度程序建立连接池、单例与双节拍；慢车道在线程中单飞。",
      "四个 worker 各管前台、进程、硬件和生灭。",
      "AHK 写唯一 spool；ingest.py 事务入库并按事件 id 去重。",
      "schema.sql 定义维度、事实、周/月分区、索引与约束。",
      "硬件采样用单调时钟截止点，提前唤醒继续等待，慢处理跳过错过时隙而不追赶堆积；Windows互斥必须真实创建并取得，失败不准第二采集器启动。新行增加可空measurement_quality、collector_instance_id、collector_sample_seq，不重写旧行。",
    ],
    flow: [
      "启动单例、闭合旧会话并确认分区。",
      "每 1 秒采硬件、FPS、前台与生命周期。",
      "每约 3 秒在线程中扫描活跃进程。",
      "批量写库并更新 heartbeat。",
      "AHK spool 事务成功后删除源段。"
    ],
    concepts: [
      { term: "fast / slow lane", explanation: "高频硬件路径与昂贵进程扫描分开调度。" },
      { term: "interval event（区间事件）", explanation: "有开始和持续时间的前台、暂离或睡眠记录。" },
      { term: "partition pruning（分区裁剪）", explanation: "按时间下界只扫需要的周/月分区。" }
    ],
    boundaries: [
      "两条管线用途不同，不合成一张模糊总表。",
      "网络按连接占比估算，不是抓包精确归因。",
      "探针失败允许字段为空，不造连续真值。"
    ],
    failures: [
      { condition: "进程扫描超时", response: "跳过下一慢拍，不阻塞快车道。" },
      { condition: "数据库连接失效", response: "限时关闭连接池，超时 terminate 后退避重连。" },
      { condition: "spool 入库失败", response: "保留源段重试，事务成功后才删除。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\main.py", role: "调度、连接、睡眠与分区" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\context_worker.py", role: "前台会话" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\activity_worker.py", role: "进程资源" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\hardware_worker.py", role: "硬件与 FPS" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\lifecycle_worker.py", role: "进程生灭" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\TimeAudit.ahk", role: "简版使用区间" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\ingest.py", role: "spool 入库" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\schema.sql", role: "表、分区与索引" }
    ],
    verification: [
      "runtime hardening 与 ingest resilience 纳入 001cee0 的 182 项 + 11 个子测试完整通过结果。",
      "容器与三条 heartbeat 在观察时持续推进。",
      "未读原始表、未跑完整数据库审计，故保持 mixed。"
    ],
    relation: "为其他模块提供可信时间轴；可靠性监管它，恢复模块保存它。",
    readerStatus: "已有电脑状态持续记录与历史运行证据；本轮没有重新验收整条采集链，缺采不能算作正常或睡眠。"
  },
  {
    slug: "hardware-performance",
    usageEntry: "在 TimeAudit Grafana 的性能大盘选具体时间窗；要查异常原因可在已接入诊断的 AI 对话中说明症状。",
    usageInputs: ["卡顿发生时间", "游戏或桌面场景", "想比较的硬件指标"],
    productFlow: [
      { title: "先核对样本", detail: "诊断入口检查时间窗覆盖和最新数据，不用一条孤立数值下判断。" },
      { title: "对齐负载与帧", detail: "大盘把显卡、温度、磁盘、网络和 FPS 放在同一时段，注明帧源是否为游戏或桌面。" },
      { title: "解释异常和未知", detail: "交回可能相关的变化；越界传感器或缺帧状态明确标记，不把 0 帧和一次高温说成硬件故障。" },
    ],
    shortTitle: "硬件与流畅度",
    title: "硬件真值、FPS 回放与前台性能诊断",
    searchAliases: ["游戏卡顿先看摘要还是Grafana", "过去一小时温度磁盘有没有异常", "没有游戏帧是不是采集坏了", "1% Low为什么突然掉", "帧时尖刺和后台压力怎么对齐", "PCConfig为什么要求重新检查稳定配置", "TimeAudit异常摘要会不会直接改电脑配置"],
    searchProjection: {
      intents: ["复盘一次卡顿或掉帧", "查看温度功耗和磁盘压力", "判断没有游戏帧是否正常", "向PCConfig提供有界异常摘要", "从摘要进入具体时间线深挖"],
      entities: ["timeaudit-diagnostics", "Grafana", "FPS / 1% Low", "frametime", "RTSSSharedMemoryV2", "PresentMon", "gated_idle", "waiting_frames", "fps_capture_status", "timeaudit.pcconfig-anomaly-digest.v1", "(after, until]", "projection_recheck_recommended"],
      relations: ["有界 summary 先确认覆盖和方向", "Grafana 再对齐帧时硬件前台与后台", "RTSS共享内存优先且映射不可用才启动PresentMon", "帧源按前台最近前台桌面渲染器与唯一新鲜候选选择", "gated_idle与有负载无帧的waiting_frames分开", "PCConfig只消费聚合异常与重查建议", "异常摘要不进入稳定配置也不证明配置变化", "no_game_frames只说明摘要没有可分析帧"],
      failureRecovery: ["新鲜且明确gated_idle时正常等待", "waiting_frames或缺采集状态时不冒充健康idle", "探针掉线只留对应字段空值", "混入旧帧时拒绝性能结论", "摘要覆盖 stale 时先补现场证据", "Docker或PostgreSQL不可用时返回有界unavailable且不重启服务"]
    },
    teaser: "硬件真值与 RTSS 优先帧链对齐到同一时间轴；PresentMon 仅作后备，并明确区分正常等待、启动中、有负载无帧与采集故障。",
    status: "e5459ce已拒收NVML坏值并真实换代；180/180新GPU样本有效，133个正帧全被拒绝，游戏E2E仍未验收",
    statusTone: "mixed",
    value: "先看卡顿那段记录是否完整，再把温度、帧率、磁盘和后台活动放到同一时间线上。没开游戏、传感器读错和真正掉帧会显示不同状态，不猜根因。",
    why: "平均帧率可能掩盖两秒卡顿，桌面壁纸帧也不能当游戏成绩；一次高温还可能是传感器读错。TimeAudit 先核对这段记录是否完整，再把同一时刻的硬件、画面和程序变化放在一起解释。",
    example: "我问：“没开游戏，为什么还显示帧率，显卡温度也高得奇怪？”系统先查帧来自游戏还是桌面；明显不合理的温度改从其他真实来源核对，仍没有可靠值就留空。",
    result: "先知道这段时间记录是否足够，再看温度、帧率、磁盘和网络是否同一时刻变化；值得深查时打开详细图。给电脑配置项目的只是“是否建议再查一次”的线索，不会直接宣称硬件配置改变。",
    readerStates: {
      "pass": "取得新鲜可靠的硬件与帧记录时显示实际变化；没开游戏但记录正常时显示等待。",
      "problem": "画面确在渲染却没有对应帧、传感器读数越界或记录过期时说明具体问题，不给一个假零。",
      "unavailable": "帧来源或必要数据库不可用时保留空白；不会为看网页而启动游戏或重型采集。"
    },
    decisionImpact: [
      "先看 1% Low 与帧时，再看平均 FPS。",
      "先确认帧源及采集状态，再解释数值；RTSS 可读但没有唯一有效帧是正常等待，启动后仍收不到帧则是另一种需要排查的状态。",
      "先用 summary 确认窗口覆盖、有效游戏帧和方向；只有问题需要具体时刻、进程或跨曲线关系时才进 Grafana。",
      "只认 NVIDIA 独显，隔离核显与虚拟显示器。",
      "功耗墙、温度墙、空闲降频分开解释。",
      "只在相似负载下判断散热趋势。",
      "TimeAudit 拥有异常阈值和聚合语义；PCConfig 只消费有界 digest，不能绕过 Provider 读取原始行或自行解释阈值。",
      "只有 digest 明确建议时才值得做一次 PCConfig live stable projection recheck；摘要既不进入投影，也不等于配置已经改变。"
    ],
    problem: "解决平均值遮蔽卡顿、GPU 混淆、探针故障级联、FPS 归属错误和伪老化趋势。",
    implementation: [
      "e5459ce的hardware_worker组合NVML、PDH、LHM与RTSS优先帧链。NVML核心利用率0—100%、核心温度0—120°C、板功率0—2000W、核心/显存时钟0—100000MHz之外或非有限值均拒收；显存温度仅接受0—150°C。这些是宽泛有效性边界，不是正常负载推荐值。失败后清NVML句柄并走既有重初始化；当拍仅合并真实LHM后备，否则NULL。LHM仍只读18085，不另建进程恢复路径。",
      "`_read_rtss_fps_snapshot` 只读 `RTSSSharedMemoryV2`：先精确 Windows 前台 PID，再 RTSS 最近前台 PID，再已启用的 wallpaper32.exe / wallpaper64.exe 桌面渲染候选，最后只接受一个唯一新鲜来源；布局与关键字段双读不一致、帧龄超过 2000 ms 或候选仍多解时拒绝该帧，不按最高 FPS 猜归属。",
      "RTSS 映射可用即抑制 PresentMon 启动；映射不可用时，`_presentmon_needed` 还检查真实渲染门与最近 RTSS 帧的 3 秒抑制窗。后备由项目内单 owner 管理 `TimeAuditPresentMon` 会话，RTSS 本身只读、不由 TimeAudit 启停。",
      "`_resolve_fps_capture_state` 把 active、gated_idle、starting、waiting_frames、source_unavailable、error 六种状态及原因写进 `fact_system_hardware.fps_capture_status / fps_capture_detail`。RTSS 有帧写 rtss_shared_memory_frame、可读无帧写 rtss_no_active_frame；PresentMon 启动宽限 10 秒，过后仍无匹配帧写 waiting_frames。",
      "`_auto_prepare_lhm_async` 在项目 exe 缺失时仍可下载并解压组件文件；这是文件准备，不是运行实例 ownership（所有权）或第二条恢复路径。",
      "独立 `LibreHardwareMonitor` 计划任务是唯一运行 owner，`telemetry_watchdog.ps1` 是登记的唯一自动恢复路径；任务现场分别指向项目 exe 与隐藏 Watchdog launcher。",
      "8 月 31 日的运行回读证明当时 hardware_worker blob 与 001cee0 一致，main.py 在该文件落盘后启动；现场 1 个 LHM 活实例与 3 个零线程残影被正确区分。该历史证据不替代9月8日e5459ce的进程换代与新窗口验收。",
      "activity_worker 用 NVIDIA vendor id 锁独显 LUID。",
      "Grafana 对齐 FPS、帧时、瓶颈与前台焦点。",
      "pcconfig_anomaly_digest.py 通过现有 audit-postgres 容器的本地 PostgreSQL socket 对 fact_system_hardware 做索引聚合，窗口固定为 `(after_utc, until_utc]` 且最长 168 小时。",
      "timeaudit.pcconfig-anomaly-digest.v1 返回 Owner/Profile、next cursor、coverage、聚合异常与 `projection_recheck_recommended`；成功的空窗口也可推进，缺 Docker/PostgreSQL 或非法输出则有界 unavailable。",
      "数据库会话锁定 Asia/Shanghai 本地日界。",
      "CPU封装温度/功率与GPU hotspot只接受真实新鲜传感器或NULL，不以ACPI区域、负载公式、显存温度或核心偏移代替。RTSS current_fps是最近帧倒数，窗口均值另存；历史无来源RTSS行走明确兼容路线，合理极低帧不直接丢弃。缺磁盘/换页/频率计数留NULL，真实0仍保留。",
    ],
    flow: [
      "用 timeaudit-diagnostics 对最短够用窗口做一次有界 summary，先核对 coverage、样本数、最新年龄与最大 gap。",
      "若需要细节，再识别物理 GPU 和传感器并打开对应 Grafana 时间窗。",
      "先按 RTSS 候选优先级选择新鲜一致帧；映射不可用才允许按渲染门启用 PresentMon 后备，并将来源原因与采集状态一并保存。",
      "读取时把数据年龄与六种采集状态共同解释：gated_idle 正常等待，starting 暂等，waiting_frames / error / source_unavailable 与状态缺失单独报告。",
      "每秒采硬件、FPS、网络与系统压力，隔离单个探针失败。",
      "按时间桶对齐前台、卡顿、温度、磁盘与网络曲线。",
      "当 PCConfig 提供 exclusive after 与 inclusive until 时，只运行 aggregate filters（聚合筛选），生成不含 raw payload 的 digest；窗口超过 168 小时直接拒绝。",
      "digest 只把异常信号和重查建议交还 PCConfig；后者若决定重查，必须由自己的 live stable provider 独立裁定 no_change 或 published。",
      "把 summary 的相关信号与大盘细节、Windows 事件、驱动或 PCConfig 现场交叉判断，不由一条阈值直接给根因。"
    ],
    concepts: [
      { term: "1% Low", explanation: "最差 1% 时段帧率，揭示偶发卡顿。" },
      { term: "frametime（帧时）", explanation: "渲染一帧的毫秒数；尖刺会影响手感。" },
      { term: "RTSS（RivaTuner Statistics Server 帧率工具）", explanation: "TimeAudit 当前首选的只读共享内存帧源；选中桌面渲染器时，其 FPS 不自动等于游戏性能。" },
      { term: "LUID（图形设备标识）", explanation: "Windows 本机设备身份，用来锁目标独显。" },
      { term: "anomaly digest（异常摘要）", explanation: "给 PCConfig 的有界聚合接口：说明窗口覆盖、异常种类和是否建议重查稳定机器事实，不提供原始时序，也不签发配置变化结论。" }
    ],
    boundaries: [
      "阈值按当前个人工作站调校，不是通用标准。",
      "能耗/电源轨含估算，不是外部仪器值。",
      "空值不插成传感器真值。",
      "数据库为兼容可把缺帧数值保存成 0，消费者必须同时读取采集状态和原因；缺少状态的零值不是健康证明，no_game_frames 摘要也不能替代采集诊断。",
      "RTSS 可返回用户已启用的 Wallpaper 桌面帧；没有对应游戏与负载证据时，不用正值、历史坏例或截图推导游戏成绩。",
      "异常摘要不返回原始遥测行、温度/负载曲线、进程活动、窗口标题、网络标识、凭据或机器标识。",
      "scheduler jitter（调度抖动）是有界用户态信号，不冒充真实内核 DPC latency，也不建议稳定配置重查。"
    ],
    failures: [
      { condition: "LHM 连续不可达", response: "hardware worker 只留 CPU/GPU 对应真值字段为空；外部 telemetry_watchdog 先宽限 15 秒，再通过独立 LHM 任务做一次有界端点恢复。" },
      { condition: "NVML调用异常或核心指标越界", response: "显存温度、降频原因、PCIe等非核心读取失败局部隔离；核心利用率、温度、功率或时钟失败/越界时source_available=false并重新初始化，整组转用真实LHM或NULL，不把坏值清零伪装正常。" },
      { condition: "样本新鲜且 RTSS 映射可读、没有有效帧，或后备明确处于渲染门空闲", response: "显示 gated_idle / 正常等待；不启动第二个帧源、不造游戏负载。" },
      { condition: "后备已检测渲染但 10 秒启动宽限后仍没有匹配帧", response: "报告 waiting_frames 与 no_fresh_foreground_frame；这是收帧问题，不冒充正常桌面空闲。" },
      { condition: "帧状态缺失、采样陈旧、source_unavailable 或 error", response: "分别报告合同缺失、新鲜度、来源或具体采集错误；保留其他有效硬件字段，不以零 FPS 掩盖。" },
      { condition: "PCConfig 请求窗口超过 168 小时、时间边界非法或 Provider 输出不合约", response: "返回有界 unavailable；不查询原始行、不重启 Docker/PostgreSQL，也不提供可推进的成功窗口。" },
      { condition: "摘要命中异常但现场稳定事实没有变化", response: "保留异常作为时序信号；PCConfig 的独立重查返回 no_change，摘要不写入 stable_machine_projection。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\hardware_worker.py", role: "硬件、RTSS 共享内存候选/新鲜度、PresentMon 后备与六态入库" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\activity_worker.py", role: "独显与进程 GPU" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboard_contract.py", role: "大盘恢复合同" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboards\\b7d809e5-d072-4d24-ae23-c573bfcabc56__🖥️ 整机硬件能效与系统资源大盘.json", role: "硬件大盘 JSON" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboards\\addmc8x__🚀 前台交互与流畅度诊断舱.json", role: "流畅度大盘 JSON" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py", role: "一次查询的硬件、有效游戏帧、覆盖与信号聚合" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\TIMEAUDIT_DIAGNOSTIC_SUMMARY_CONTRACT.md", role: "诊断摘要 schema、时间窗和因果边界" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\pcconfig_anomaly_digest.py", role: "给 PCConfig 的最长 168 小时只读聚合异常 Provider" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\PCCONFIG_ANOMALY_DIGEST_CONTRACT.md", role: "窗口、coverage、异常、隐私和稳定配置重查边界" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\telemetry_watchdog.ps1", role: "LHM 端点宽限、任务恢复和 crash ghost 过滤" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_runtime_hardening.py", role: "LHM 单 owner 与外部恢复断言" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_presentmon_fps_selection.py", role: "FPS 选择回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_fps_capture_contract.py", role: "RTSS 二进制解析、过期帧、前台候选、桌面精确匹配、映射可读无帧与状态入库合同" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_health_presentmon_gate.py", role: "明确空闲、缺状态、waiting_frames 与陈旧数据不能互相冒充" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_grafana_dashboard_contract.py", role: "大盘合同回归" }
    ],
    verification: [
      "2026-09-08的e5459ce已发布并生效；39项相关回归覆盖坏值、非有限/越界、真实LHM后备、无源NULL、恢复有效读数，以及既有RTSS选择/状态和官方诊断摘要。",
      "001cee0 的 182 项 + 11 个子测试完整回归通过；LHM/Watchdog 定向断言另为 10/10。",
      "8月31日现场健康21/21：当时的单一LHM、18085、GPU电压与120/120条GPU/Vcore真值通过，不等于本批重验全链。",
      "8月31日3660样本与9月8日修复后三分钟180样本、133正帧全拒绝均保留原日期。2026-09-14另读一小时：3599硬件样本，2369有效帧、1229拒绝正帧；帧源与拒绝原因分项未返回，不能声称真实游戏或确定故障。",
      "test_pcconfig_anomaly_digest.py 覆盖窗口、聚合规则、privacy flags（载荷省略标记）与 unavailable；本页本轮没有把该单测冒充 PCConfig consumer 或 live projection E2E。",
      "Grafana 容器运行，授权截图显示真实界面。",
      "本轮未结束 LHM 或阻断 18085，不能把健康现场冒充恢复故障注入；也未启动游戏，FPS E2E 未形成。"
    ],
    relation: "读取采集时间轴并与进程资源对齐；timeaudit-diagnostics 先消费它的有界诊断聚合，必要时再进入 Grafana 深读；PCConfig 只消费另一份零原始载荷的 anomaly digest，并独立决定是否重查稳定事实。可靠性模块防止探针或 Provider 失败扩散。",
    readerStatus: "坏的显卡读数已在一次实际更新后被拒收，新硬件样本有效；游戏帧率仍未通过实际游戏验收。"
  },
  {
    slug: "process-forensics",
    usageEntry: "在已接入 timeaudit-diagnostics 的 AI 对话中先给故障时间做有界摘要；需要点名程序时打开同一时段本机 Grafana 取证盘。",
    usageInputs: ["故障时间与现象", "需要关注的程序或资源"],
    productFlow: [
      { title: "先看是否有记录", detail: "摘要说明那段覆盖是否完整、是否值得继续追查。" },
      { title: "在本机核对具体程序", detail: "把进程启停、资源变化、前台和硬件时间线对齐；PID 和名字都不单独当身份。" },
      { title: "交回线索", detail: "列出可复查的候选原因与缺失证据；它不替你杀进程，也不把无签名或端口当恶意证明。" },
    ],
    shortTitle: "进程与取证",
    title: "进程资源、生命周期与有边界的取证线索",
    searchAliases: ["谁在后台写盘", "哪个程序在联网", "哪个进程刚才闪退", "程序退出码在哪里看", "诊断Skill为什么不给进程名"],
    searchProjection: {
      intents: ["找出同一时刻谁写盘或联网", "查看某程序为什么闪退", "核对进程启动退出和父子关系", "从聚合方向进入逐进程大盘"],
      entities: ["process key", "START / EXIT", "exit code", "Grafana 资源盘", "Grafana 取证盘"],
      relations: ["Skill 聚合只给方向不返回进程名", "Grafana 把具体进程与时间窗口对齐", "生命周期把 PID 与时间身份关联", "签名路径和提权只是核查线索"],
      failureRecovery: ["进程已退出时保留已有生命周期", "未知路径保持 unknown", "逐进程入口未验收时不猜名字", "单一安全信号不自动处置"]
    },
    teaser: "保存进程资源、签名、提权、父进程、START / EXIT、退出码和卡死状态，回答谁占资源、谁闪退、哪些信号需人工核查。",
    status: "进程采集和未知路径有历史源码回归；本批仅核对采集器身份，未读取用户进程、标题或连接明细",
    statusTone: "mixed",
    value: "先判断故障时间有没有足够记录；值得深查时在本机查看具体程序怎样启动、退出、占内存或写盘，给出可复查线索，不凭程序名定罪。",
    why: "同名进程可来自不同路径，PID 会复用，退出后信息消失；单凭无签名或端口定罪又会误报。",
    example: "我问“刚才到底哪个程序在反复闪退？”摘要先确认那段记录没有断、确实值得深挖；我再打开同一时段的本机明细，把某个程序每隔几秒启动、退出和内存猛涨的变化排在一起。最后看到的是一条可复查的崩溃链，不是系统擅自删文件或给程序扣上“恶意”的帽子。",
    result: "先告诉我故障时段有没有足够记录、是否值得继续查；在本机详细图里再看具体程序的启动、退出、内存和磁盘变化。程序名缺失时不猜，也不把无签名直接判恶意。",
    readerStates: {
      "pass": "当时程序的启动、资源和退出能对应起来时，给出可核查的故障线索。",
      "problem": "程序路径或签名读不到时保留未知，结合其他变化继续分析。",
      "unavailable": "那时没有交互桌面或记录缺口太大时，不把空白写成程序正常。"
    },
    decisionImpact: [
      "高占用与恶意分开判断。",
      "timeaudit-diagnostics 只给有界聚合和方向，不从省略字段猜进程名。",
      "要回答谁闪退、写盘或联网，必须把同一时间范围带进 Grafana 资源盘 / 取证盘查看具体进程。",
      "未知路径不伪造为系统目录。",
      "PID 与时间/身份一起使用。",
      "公开页可在活动事实有决策价值时直接展示；只对实际包含个人敏感正文或凭据的具体值做隐藏。"
    ],
    problem: "解决证据消失、PID 复用、Windows 卡死误判、未知路径伪装和单一安全信号过度解释。",
    implementation: [
      "activity_worker 用同一系统快照采资源并解析父进程。",
      "IsHungAppWindow 标记用户会话窗口假死。",
      "lifecycle_worker 在出生时抓句柄，退出时读退出码。",
      "process_key 连接身份与事实表。"
    ],
    flow: [
      "先用有界摘要核对目标时间窗覆盖、磁盘/网络/资源方向；摘要不包含进程名。",
      "需要点名时，把同一窗口带入 Grafana 资源盘或取证盘。",
      "取得进程快照与稳定身份，计算资源速率并标记卡死。",
      "比较基线生成 START / EXIT，并保留退出码、父子关系、路径、签名和提权线索。",
      "把具体进程与硬件、前台和生命周期时间线对齐，再输出候选解释与未知。"
    ],
    concepts: [
      { term: "process key（进程档案键）", explanation: "稳定关联身份，不能只用会复用的 PID。" },
      { term: "signature（数字签名）", explanation: "发布者完整性线索；无签名不等于恶意。" },
      { term: "LOLBins（系统工具滥用线索）", explanation: "系统工具与可疑参数组合，需要上下文。" }
    ],
    boundaries: [
      "提供取证线索，不是杀毒或阻断系统。",
      "timeaudit-diagnostics 的 aggregate-only（仅聚合）合同不返回进程名；字段省略不能被模型补猜。",
      "网络速率近似分摊，远端信息可能不完整。",
      "字段类型不构成 blanket ban（整类禁令）；实际进程、路径、命令行、IP 和标题可在有用且具体值不含个人敏感正文或凭据时公开。"
    ],
    failures: [
      { condition: "用户只给自然问题但需要具体进程名", response: "先用摘要确认覆盖和方向，再引导到同一时间窗的本机 Grafana；当前 Skill 不从聚合输出猜名字。" },
      { condition: "进程已退出或受保护", response: "保留 unknown 与可得生命周期，不猜路径。" },
      { condition: "单进程处理抛错", response: "在 finally 推进基线，避免事件重复。" },
      { condition: "安全规则命中", response: "进入待核查表，不自动修改机器。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\activity_worker.py", role: "进程资源与卡死" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\lifecycle_worker.py", role: "生灭、退出码、签名与提权" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\context_worker.py", role: "前台关联" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_lifecycle_unknown_path.py", role: "未知路径回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_activity_collection_state_lock.py", role: "采集状态并发回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\使用手册.md", role: "资源/取证大盘说明" }
    ],
    verification: [
      "unknown path回归属于8月31日001cee0已通过的基线，本批39项并未重新覆盖该模块。",
      "未读取用户活动进程、路径、标题或连接明细；本批源修复仅核对受管采集器自身身份。",
      "进程采集、生命周期和未知路径逻辑属于8月31日完整回归；本批只核对采集器自身身份，未读用户进程明细，该产品现场仍保持mixed。"
    ],
    relation: "把进程事实转成资源与取证视角，并与硬件卡顿时间对齐。",
    readerStatus: "已有按时间查看程序资源与启动退出记录的功能；本轮只核对采集程序，没有读取个人程序活动明细。"
  },
  {
    slug: "usage-energy",
    usageEntry: "在 TimeAudit 的屏幕使用大盘选择日期或时间段看时间与能耗；若要完整时段的活动证据，可请有当前个人资料权限的 AI 使用 TimeAudit 的只读活动摘要入口，明确给出起止时间。",
    usageInputs: ["想看的日期与准确起止时间", "关注记录覆盖、应用时间、离开、睡眠还是电费估算", "是否需要完整时段及北京时间逐日摘要"],
    productFlow: [
      {
        "title": "只计算落在所选日期里的时间",
        "detail": "系统把跨过午夜的睡眠和离开时段裁到查询范围内，避免“今天用电脑超过一天”。"
      },
      {
        "title": "汇总重叠记录",
        "detail": "系统合并重复离开区间，计算屏幕使用结构与估算能耗。"
      },
      {
        "title": "看懂数字",
        "detail": "大盘交回活跃时长和估算；只读摘要另列完整时段、逐日覆盖与缺口。前台时间不等于本人在场或工作成果，电费和碳排不是账单。"
      }
    ],
    shortTitle: "时间与能耗",
    title: "屏幕使用、专注上下文与能耗成本",
    searchAliases: ["今天电脑时间都花在哪", "按完整时段看活动记录和空档", "按北京时间每天看前台和睡眠", "屏幕使用时间为什么超过查询窗口", "睡眠为什么算进活跃时间", "电脑长期发热耗电怎么复盘", "电费数字是不是插座实测"],
    searchProjection: {
      intents: ["复盘屏幕使用与专注时间", "检查区间重复或跨窗", "估算长期能耗和电费", "区分活跃暂离息屏锁屏睡眠"],
      entities: ["active", "idle", "display-off", "sleep", "focus block", "energy integration"],
      relations: ["区间先裁剪再求并集", "暂离息屏锁屏睡眠从活跃中扣除", "功率点采样积分成能耗", "电价和其他部件功耗属于估算"],
      failureRecovery: ["跨窗口只算交叠部分", "重叠 idle 先合并", "AHK 或 ingester 心跳陈旧先查管线", "来源不可读时不猜作息与费用"]
    },
    teaser: "按正确区间口径汇总前台、暂离、息屏、睡眠、切换、功率和峰谷电价；另有只读完整时段及逐日活动摘要，把记录空档也交出来。",
    status: "大盘有历史图证；只读完整时段摘要已进入正式源码，本轮未读取生产个人时间线或能耗值",
    statusTone: "mixed",
    value: "我能查看活跃、暂离、睡眠、专注和场景能耗结构；具体应用、标题和时长可在有价值时直接展示，不按字段类别一刀切隐藏。",
    why: "区间只按开始时间求和会漏算跨窗睡眠或重复 idle，甚至出现过去一小时开机 1.5 小时；估算也可能被误当账单。",
    example: "我问“从周一到周三，电脑到底记录了哪些时间，哪几段是空白？”我给出准确起止时间后，只读摘要会按完整范围及北京时间逐日列出前台和活动记录、睡眠等状态与缺口；需要电费时再看大盘估算。空白不被猜成没开机，前台时间不被猜成本人一直在做事。",
    result: "得到所选时段按来源区分的覆盖、空档、状态和应用时间线索，也可在大盘看功率估算的用电与费用。未覆盖不是设备闲置证明，估算不是账单。",
    readerStates: {
      "pass": "有记录的部分先去重叠并按本地日期裁剪，分别显示前台与 AHK 来源覆盖；有可用功率记录才估算耗电。",
      "problem": "离开记录重叠或功率缺失时把空白和估算限制写清。",
      "unavailable": "个人资料权限或来源读不到时只返回相应错误，不推断作息、具体应用或费用。"
    },
    decisionImpact: [
      "先裁剪查询窗，再合并重叠区间。",
      "睡眠、息屏、暂离从活跃中扣除。",
      "时间复盘不生成公开个人画像。",
      "电费与电源轨是估算。"
    ],
    problem: "解决跨窗漏/超算、idle 重叠、睡眠算活跃、日界偏移、估算冒充测量和标题泄露。",
    implementation: [
      "AHK 写前台和系统状态区间，ingester 幂等入库。",
      "Grafana 用区间交叠、裁剪和 gaps-and-islands（区间并集）。",
      "数据库锁定 Asia/Shanghai 本地日界。",
      "功耗点采样积分，其他部件/电价模型标为估算。",
      "写失败不推进已提交水位，保留有界待写队列；达到上限时详细事件变为明确未知区间，不推断应用使用。ahk_health.json分别记录待写、失败、溢出和分段数；正常活动约30秒或转换时封段，突然断电仍可能丢失当前未封段。",
      "活动区间统一UTC且状态串行；空闲切换不能倒退已分配区间。时钟跳变/延迟记System_CollectionGap，只有Windows挂起事件证明sleep。AHK用UTF8不可变CSV段：临时写入、flush、原子rename到buffer.csv.ahk.*.processing，现有ingester只在数据库事务提交后移除，内容去重保护重放。",
      "personal_activity_reader.py --summary 返回 timeaudit.personal-activity-summary.v1：只读现有前台和 AHK 区间，按完整查询窗及 Asia/Shanghai 日界分别求记录并集、空档、状态和每来源应用排名；开放会话不外推，已知自动化仅标注提供的时间，不给本人在场或效率分数。旧 read_activity 细目入口继续存在。",
    ],
    flow: [
      "记录并入库状态区间。",
      "筛选与窗口交叠的区间。",
      "裁剪、合并并计算使用结构。",
      "积分功率并应用峰谷模型。",
      "原始全库不镜像进网页；具体标题和个人统计只有在具备产品价值、逐值没有 L3+ 或凭据证据时才公开，否则留在本机。"
    ],
    concepts: [
      { term: "gaps-and-islands（区间并集）", explanation: "合并重叠/相接时间片后再求总时长。" },
      { term: "focus block（专注块）", explanation: "连续停留同一上下文达到阈值的行为线索。" },
      { term: "energy integration（能量积分）", explanation: "把功率按持续时间累计为 kWh。" }
    ],
    boundaries: [
      "前台焦点不等于工作成果。",
      "窗口标题与使用统计可按实际价值公开；只有具体内容真实包含个人敏感正文或凭据时才隐藏对应值。",
      "能耗/电费/碳排含估算。"
    ],
    failures: [
      { condition: "区间跨查询边界", response: "只算窗口内交叠部分。" },
      { condition: "idle 区间重叠", response: "先做区间并集。" },
      { condition: "AHK / ingester heartbeat 陈旧", response: "标记近期可能延迟，先查管线。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\TimeAudit.ahk", role: "前台/睡眠区间" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\ingest.py", role: "区间入库" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboards\\adfkm96__📊 屏幕使用时间.json", role: "使用时间大盘 JSON" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboards\\addpc9x__🔌 功耗与电费诊断舱.json", role: "功耗大盘 JSON" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py", role: "active/idle/display-off/lock/sleep 区间并集与未覆盖时间聚合" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\personal_activity_reader.py", role: "完整时段与北京时间逐日个人活动只读摘要，保留来源覆盖、空档和权限边界" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\使用手册.md", role: "时间/功耗面板说明" }
    ],
    verification: [
      "screen-time-focus、power-cost 等授权截图展示真实界面。",
      "9月8日独立摘要窗口(2026-09-08T08:35:40Z,08:38:40Z]返回active=0、idle=180秒、recorded coverage=180秒、uncovered=0、cross-state overlap=0；只说明这三分钟的记录，不推断用户意图或长期习惯。",
      "文档记录区间裁剪、并集、空集归零与日界修复。",
      "本轮未重新查询完整个人时长或能耗明细，因此这些数值没有被升级为当前验证事实。"
      ,"2026-09-24 源码 main=622b66c 已含 76dc57d 的摘要和专项测试；本轮未运行生产个人时段查询，也未把它写成 timeaudit-diagnostics Skill 已自动调用。"
    ],
    relation: "从采集取得区间/功率，借硬件解释能耗；公开边界由项目总览约束。",
    readerStatus: "时间与能耗分析界面已有历史图证；本轮没有读取个人时间线或测量值，费用仍属估算。"
  },
  {
    slug: "runtime-reliability",
    usageEntry: "TimeAudit 大盘停止更新时，在已接入本机诊断的 AI 对话中说明最后正常时间；现有看门狗负责精确组件恢复。",
    usageInputs: ["停更时间", "受影响的是采集、入库还是大盘"],
    productFlow: [
      { title: "先查最后真实写入", detail: "不要只看任务管理器里的进程，核对心跳和数据新鲜度。" },
      { title: "定位失效组件", detail: "看门狗区分启动、睡眠宽限和真停写，只恢复确认异常的一条链。" },
      { title: "验证恢复", detail: "回读新心跳与入库；恢复后的在线状态不填补过去空档，也不证明历史值都正确。" },
    ],
    shortTitle: "自愈与正确性",
    title: "单例、心跳、看门狗与长期运行不变量",
    searchAliases: ["采集进程在但没有数据", "采集器假活怎么判断", "Watchdog多久检查一次", "哪个采集组件会被自动重启", "睡眠唤醒后为什么先等一会"],
    searchProjection: {
      intents: ["判断采集器是否假活", "查看 Watchdog 最近恢复结果", "确认三条 heartbeat 与 LHM endpoint", "排查睡眠恢复后的短暂空档"],
      entities: ["TimeAudit_Watchdog", "main.py heartbeat", "AHK heartbeat", "ingester heartbeat", "bounded backoff"],
      relations: ["进程存在不等于成功推进", "Watchdog 每分钟按精确身份检查 main、LHM、AHK 与 ingester", "睡眠恢复宽限先于重启", "恢复互斥、探测与等待均有上限"],
      failureRecovery: ["native crash 按组件重启", "false alive 由陈旧 heartbeat 发现", "交互会话不可用时不伪造前台采集", "在线状态不覆盖历史缺口"]
    },
    teaser: "用单例、无 payload heartbeat、外部 Watchdog、退避、睡眠宽限和精确身份，把 native 崩溃、假活、探针掉线与数据库重连限制在受影响组件。",
    status: "8月31日容器/LHM/全链测试与9月8日受管换代180个GPU有效样本保留原日期；2026-09-14只读摘要新鲜，本轮未换代或注入故障",
    statusTone: "mixed",
    value: "系统不因进程仍显示 Running 就假定它工作，而以最近成功写入判断真假健康。",
    why: "采集程序可能真的退出，也可能还挂在任务列表里却不写数据。只看进程在不在，会留下看不见的记录空档；恢复还得避免同时启动两份。",
    example: "大盘突然停住，但任务列表里的采集进程还在。系统会看最后一次真正写入是什么时候；确认主采集已经“人还在、活不干了”后，只重启这一条，其他仍在正常记录的组件不跟着折腾。",
    result: "看到哪一条记录链还在写、哪一条停住、系统是否已尝试恢复，以及失败时还缺什么。重新启动后缺失的历史仍是缺口，不会被填成正常。",
    readerStates: {
      "pass": "对应程序真正持续写入，而且它依赖的保存服务也可用时，才说这条链活着。",
      "problem": "程序退出或假活时只恢复确认故障的部分，保留失败原因。",
      "unavailable": "自动任务或保存服务读不到时只说对应层未知，不拿其他组件仍在运行代替。"
    },
    decisionImpact: [
      "健康由成功推进证明，不由进程名决定。",
      "恢复串行，睡眠后先宽限。",
      "只恢复精确组件，不结束未知同名进程。",
      "前台采集必须在交互会话运行。"
    ],
    problem: "解决 native 崩溃、假活、多实例日志锁、计划任务 PATH、探针重启循环和恢复竞争。",
    implementation: [
      "Python 主调度程序提供单例与外层异常恢复。",
      "runtime_health.py 原子写 heartbeat，并提供路径识别与有界退避辅助。",
      "telemetry_watchdog.ps1 每分钟串行检查 main.py、LHM 18085、AHK 与 audit-ingester；全局 mutex（互斥锁）阻止恢复重叠。",
      "LHM 独立任务拥有运行实例；hardware worker 只读，Watchdog 经 15 秒宽限、20 秒启动等待和精确项目路径过滤恢复端点。",
      "start_all.bat 固定 CRLF、绝对 Python 3.11 和 WorkingDirectory。",
      "历史摘要只做有界聚合：语句8秒、锁1秒并限客户端输出，拒绝畸形/非有限/意外字段。异常v2依≤2.5秒连续观测与实际持续时间，31秒lookbehind衔接游标；PCConfig在重查下游前持久pending_projection_refresh，失败后即使无新数据也续做，不因游标推进丢掉未完动作。",
      "GUI状态、AI健康与看门狗消费同一个timeaudit_health.py；core-only排除备份/blackbox/上一守护结果，避免递归。exit2可以是有效degraded/unavailable，心跳、实际持久写入和最后守护结果独立；可选两秒overhead只看精确主采集链子进程，不含独立传感器、Docker与原生记录，RSS相加不是独占内存。",
    ],
    flow: [
      "交互用户会话提权启动。",
      "成功循环/事务写 heartbeat。",
      "Watchdog 检查身份、心跳、端点、数据库依赖和启动/睡眠宽限。",
      "异常只恢复目标；互斥、任务 IgnoreNew、探测超时、宽限和执行上限共同约束恢复。",
      "以新 heartbeat 验证恢复。"
    ],
    concepts: [
      { term: "native crash（原生崩溃）", explanation: "C 扩展访问冲突直接终止进程，Python 异常捕获无效。" },
      { term: "false alive（假活）", explanation: "进程仍在但采集/入库停止。" },
      { term: "bounded backoff（有界退避）", explanation: "连续失败延长重试并设上限。" }
    ],
    boundaries: [
      "Watchdog 只恢复 TimeAudit 精确组件。",
      "heartbeat 不含采样值、窗口、进程或凭据。",
      "在线不证明数据正确或历史无空档。"
    ],
    failures: [
      { condition: "native 崩溃或假活", response: "陈旧 heartbeat 触发精确重启。" },
      { condition: "LHM 持续故障", response: "worker 保持只读并留空；Watchdog 在端点宽限后只结束项目路径的有线程实例，再调用独立 LHM 任务并限时等待 18085。" },
      { condition: "计划任务环境不全", response: "使用绝对解释器、工作目录与 PATH bootstrap。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\main.py", role: "主循环、重连与心跳" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\runtime_health.py", role: "心跳与退避" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\telemetry_watchdog.ps1", role: "外部恢复" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\start_all.bat", role: "启动顺序与绝对路径" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_runtime_hardening.py", role: "运行回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_ingest_resilience.py", role: "入库恢复回归" }
    ],
    verification: [
      "8月31日基线：三条heartbeat新鲜、3容器运行、ingester healthy、LHM18085返回HTTP200、Watchdog结果0。",
      "8月31日运行/入库回归纳入001cee0的182项+11子测试，LHM/Watchdog定向10/10；本批e5459ce另验证39项相关回归。",
      "8月31日的hardware_worker字节/进程时序与LHM单一活实例是历史证明；9月8日e5459ce换代后的worker61904与新样本窗口另列，两个运行时代不能混用。",
      "8月31日21/21只读健康没有做故障注入；本批已真实停止旧采集worker并通过既有Watchdog恢复，但未阻断LHM18085、断库或模拟睡眠，其他恢复E2E仍缺。"
    ],
    relation: "监管采集和探针持续性；备份模块处理持久恢复。",
    readerStatus: "已有按最近实际记录判断是否卡死并恢复对应组件的机制；本轮摘要新鲜，没有重新注入故障或重验全部恢复路径。"
  },
  {
    slug: "clipboard-history",
    usageEntry: "在本机已安装的密码中心综合窗口进入剪贴板页，按记得的词、日期或类型查找；独立 TimeAudit 剪贴板历史仍是已有入口。确认正确内容后再选“再次复制”。",
    usageInputs: ["记得的文字片段、日期或内容类型", "要看相同内容被复制几次，还是要把它重新放入剪贴板"],
    productFlow: [
      { title: "找回被覆盖的内容", detail: "按关键词、日期或类型筛选本机已记录的复制，再把完全相同的内容放在一组；同一次复制的重复观察不增加次数。" },
      { title: "确认后再次复制", detail: "选择正确记录并点击“再次复制”，内容回到 Windows 剪贴板，找回动作也另记一条事件。" },
      { title: "核对范围", detail: "只说明本机实际观察到的复制；空白、跳过或采集间隙单独显示，复制事实不代表执行或同意。" },
    ],
    shortTitle: "剪贴板历史",
    title: "Windows 剪贴板历史、再次复制与增量出口",
    searchAliases: ["刚才复制的内容被覆盖了怎么找回", "怎样搜索以前复制过的网址", "剪贴板历史怎样再次复制", "复制过的文件路径在哪里找", "剪贴板历史采集器是不是还活着", "怎样增量读取电脑剪贴板历史"],
    searchProjection: {
      intents: ["找回被下一次复制覆盖的内容", "按日期类型或关键词搜索复制历史", "把历史记录再次复制到当前剪贴板", "检查剪贴板采集与近线备份状态", "让获准消费者从 checkpoint 继续增量读取"],
      entities: ["WM_CLIPBOARDUPDATE", "clipboard_history.sqlite3", "events / blobs / content_fts", "本机剪贴板历史查看器", "timeaudit.clipboard-export.response.v1", "TimeAudit_ClipboardCollector / TimeAudit_ClipboardWatchdog / TimeAudit_ClipboardNearlineBackup"],
      relations: ["Windows 消息事件进入 append-only 事件表", "相同 SHA-256 只复用 blob 而不合并复制事件", "FTS5 为桌面查看器提供全文搜索", "restore marker 把再次复制事件连接回原事件", "adapter 按 observed_at_utc 与 event_id checkpoint 增量导出"],
      failureRecovery: ["锁定或不支持的格式只写无 payload 原因事件", "陈旧无正文 heartbeat 交给独立 Watchdog 恢复", "FTS5 或 schema 不匹配时失败关闭", "SQLite Online Backup 校验后只恢复到空目录", "任务结果或备份根存在不冒充端到端恢复"]
    },
    teaser: "在当前 Windows 会话记录新复制；本机按词、日期与类型找回，相同内容分组显示实际复制次数，确认后可再次复制。增量出口和近线恢复仍独立。",
    status: "9 月 24 日正式源码已有分组/类型筛选，PCConfig 安装版综合窗口显示 50 条；8 月 31 日事件/索引计数只作历史，本轮未刷新当前总数或近线恢复",
    statusTone: "mixed",
    value: "当段落、网址或文件路径被下一次复制覆盖，我可以在本机按关键词、日期和类型找回；完全相同的内容合在一组并显示真正复制次数，再看完整内容或再次复制。私人历史不进浏览器或主遥测数据库。",
    why: "Windows 当前剪贴板只保留最新内容，临时资料很容易被覆盖；只存去重文本又会丢掉“复制了几次、何时复制、是否来自历史恢复”的真实事件。",
    example: "我复制过同一个链接好几次，现在又被别的内容盖掉了。在本机剪贴板页筛选日期或链接，查看这一组的复制次数和最近时间，确认完整内容后点“再次复制”。新复制等原采集器记录后才会更新次数，不由界面先加一。",
    result: "本机筛选后按完全相同内容显示分组、准确总数和复制次数；预览正确内容后可再次复制，也能暂停或继续记录。允许的消费者仍按独立游标取得原始新事件。",
    readerStates: {
      "pass": "查看器按筛选条件找到本机已保存内容，重复复制次数来自真实事件，再次复制后由采集器记录新时间。",
      "problem": "来源不允许记录、内容过大或剪贴板暂时被占用时留下不含正文的缺口，不编造丢失内容。",
      "unavailable": "记录停止、数据库损坏或搜索不可用时明确报告，保留已有历史，不用低效的全库翻找冒充恢复。"
    },
    decisionImpact: [
      "每次复制都是独立事件；相同内容只复用 blobs 正文对象，绝不合并 events 事实。",
      "展示时才按完全相同正文分组，空格不同仍是不同内容；复制次数排除同一来源实例、开机、会话、剪贴板序列里的重复观察。筛选先于分组与分页；疑似密钥只按特征提示，不能保证识别全部秘密。",
      "启动、解锁、恢复和暂停结束只建立新的 clipboard sequence baseline（剪贴板序列基线），不导入此前当前内容。",
      "只接收 Unicode 文本、HTTP(S) URL 和普通文件路径列表；图片、二进制、虚拟文件、私有格式与超限内容不保存正文。",
      "查看器、增量出口和备份各有只读/恢复边界；下游 checkpoint 只有在下游 writer（写入方）成功后才能推进。",
      "公开页只展示 schema、组件、任务、路径类别、状态和计数；原始正文、内容 hash、私密窗口与凭据始终不公开。"
    ],
    problem: "解决剪贴板被覆盖、重复内容事件丢失、全文搜索退化、再次复制来源无法证明、增量消费重复/漏读和在线复制数据库/WAL 导致不一致恢复。",
    implementation: [
      "collector.pyw 创建隐藏 Win32 消息窗口，以 AddClipboardFormatListener / WM_CLIPBOARDUPDATE 事件驱动采集，不轮询、不装键盘 hook（钩子）、DLL、驱动或 Session 0 服务。",
      "读取时遵守 Windows 来源格式：ExcludeClipboardContentFromMonitorProcessing 或 CanIncludeInClipboardHistory=0 会阻止本地保存；CanUploadToCloudClipboard=0 只禁止云剪贴板，不阻止本机历史。",
      "SQLite schema v1 包含 meta、blobs、events、content_fts 与 adapter_events_v1；WAL + synchronous=FULL，events/blobs 由 trigger（触发器）保持 append-only（只追加）。",
      "同一内容 SHA-256 映射到一个 blob；每次复制仍生成独立 event_id。再次复制写 versioned restore marker（版本化恢复标记），只有 marker 与原事件正文一致才记录 lineage。",
      "viewer.pyw 使用 mode=ro 与 query_only=ON，在 Tkinter 桌面窗口按关键词、UTC+8 日期、类型和分页查询；FTS5 缺失时明确失败。",
      "622b66c 的 ReadOnlyClipboardStore.search_grouped 先在全历史按词、日期、payload 类型和内容类型筛选，再按 blob_id 分组分页；同 sequence 的重复观察只算一次，真正再次复制另计。model.py 的 link/secret_like 是格式线索，独立采集器和 append-only events 不改变。PCConfig 综合桌面已接入同结果。",
      "adapter_stdio.py 提供 timeaudit.clipboard-export.request.v1 / response.v1 的 JSON/stdio 只读接口；checkpoint 是 `(observed_at_utc,event_id)`，没有 HTTP API、浏览器依赖或固定端口。",
      "backup.py 使用 SQLite Online Backup（在线一致备份），保存大小、计数、integrity 与 SHA-256 清单；恢复前验证副本，只写入空目标目录。"
    ],
    flow: [
      "启动 collector 后先记录 baseline，不读取启动前已在剪贴板中的内容。",
      "新复制触发 WM_CLIPBOARDUPDATE；读取 source policy（来源策略）与受支持格式，失败则写无正文 skip/gap。",
      "为每次观察写 events，并按内容 SHA-256 复用 blobs；content_fts 同步保存可搜索索引。",
      "用户在只读桌面查看器搜索、筛选和预览；点击再次复制时写原事件 id 与本次 request id marker。",
      "获准消费者用版本化 JSON/stdio 读取有序事件，成功提交后在自己的 owner 边界保存下一 checkpoint；sidecar 不接受消费确认或删除。",
      "每日 nearline backup（近线备份）用 SQLite Online Backup 写 G 盘；恢复先校验清单与数据库，再读回空目录，正式替换需单独停止 collector/watchdog 并保留 pre-image（替换前副本）。"
    ],
    concepts: [
      { term: "WM_CLIPBOARDUPDATE", explanation: "Windows 在剪贴板发生变化时发出的消息；事件驱动，不是轮询或键盘监听。" },
      { term: "WAL（预写日志）", explanation: "SQLite 让持续写入与只读查询并行的日志模式；恢复不能靠在线手工复制 WAL/SHM。" },
      { term: "FTS5（全文搜索索引）", explanation: "为关键词检索建立的 SQLite 虚拟表；缺失就停止查看，不长期扫描正文表。" },
      { term: "lineage（恢复来源链）", explanation: "`restored_from_event_id` 与 `restore_request_id` 把再次复制连接回原事件。" },
      { term: "checkpoint（增量游标）", explanation: "最后成功提交的观察时间与事件 id；重复读取同一 event_id 必须由下游幂等处理。" }
    ],
    boundaries: [
      "sidecar 与 PostgreSQL/Grafana 主链完全独立；主链健康不能证明剪贴板健康，反之亦然。",
      "复制事实只证明本机观察到一次复制，不证明阅读、收件、同意、执行、归属或用户意图。",
      "活动私密库在 E 盘持久数据层，G 盘只是近线恢复副本且不是查询依赖；网页、Git、日志和浏览器不接触原始正文、hash、FTS 或凭据。",
      "当前合同只覆盖 Windows 电脑；手机来源是另一 source instance（来源实例），不能在 collector 内猜测合并。",
      "clipboard_sequence 只在同一 Windows clipboard station（剪贴板站）相邻事实中解释，不能当作跨启动、会话或设备的全局顺序。",
      "增量合同存在不等于下游消费者已上线；本轮只验证无 payload 的 adapter 形状，没有验证实际下游提交。",
      "版本化恢复标记和增量合同的内部文件名不进入公开页面；它们只连接再次复制与原事件，不表示另一个中央系统是当前产品或消费者。"
    ],
    failures: [
      { condition: "来源明确禁止、格式不支持、内容超限或剪贴板暂时锁定", response: "保存无 payload 的 skip/gap 原因；不把缺失内容猜回数据库。" },
      { condition: "heartbeat 超过 30 秒或 collector 退出", response: "TimeAudit_ClipboardWatchdog 通过隐藏启动器检查并恢复；不启动第二个长期 collector。" },
      { condition: "schema 版本不支持或 FTS5 缺失", response: "viewer/adapter 失败关闭，不回退为长期全表扫描。" },
      { condition: "备份 hash、大小、计数或 integrity 不一致", response: "拒绝恢复；非空目标也拒绝覆盖，活动库原样保留。" },
      { condition: "marker 缺失、无效或正文不匹配", response: "新观察按普通 copy 保存，不靠时间窗口或 hash 猜 lineage。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\collector.pyw", role: "Win32 消息采集、baseline、边界与 heartbeat" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\storage.py", role: "SQLite schema、WAL、FTS5、只读查询与增量投影" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\model.py", role: "链接与疑似密钥内容类型提示，不保证识别全部凭据" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\viewer.pyw", role: "本机搜索、预览、暂停与再次复制" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\adapter_stdio.py", role: "版本化 JSON/stdio 只读增量出口" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\backup.py", role: "在线一致备份、校验与空目录恢复" },
      { path: "E:\\PCConfig\\tools\\Test-TimeAuditClipboardHistory.ps1", role: "任务、ACL、心跳、schema、计数与无正文 adapter 验收" },
      { path: "E:\\PCConfig\\docs\\recovery\\timeaudit_clipboard_history.md", role: "机器路径类别、三任务、近线备份与恢复顺序" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_clipboard_history.py", role: "模型、存储、查看、lineage、adapter 与备份回归" }
    ],
    verification: [
      "Source（源码）：已发布 001cee0 包含完整 clipboard_history 实现与合同；44a842e..001cee0 没有修改 clipboard_history 或 test_clipboard_history.py，LHM 收口不改变这条独立产品轴。",
      "Tests（测试）：8月31日使用Python3.11 `-B -m unittest -v test_clipboard_history.py`，11 项全部通过，用时 0.806 秒；单元测试包含 SQLite Online Backup 到空目录的合成读回。",
      "Runtime（运行）：8月31日PCConfig无正文验证status=passed；collector Running、watchdog/nearline task Ready、heartbeat age 2824 ms、state=running、integrity=ok、schema v1，5234 events / 2312 blobs / 3406 FTS rows。",
      "Contract（合同）：adapter 返回 timeaudit.clipboard-export.response.v1、source profile `src.timeaudit.windows_clipboard`、1 个事件且 payload_absent=true；这验证接口形状，不验证实际下游消费。",
      "Gap（缺口）：本次未运行会写入唯一合成内容的 smoke_test.py，未把最新 G 盘副本恢复到空目录，也未验收实际下游 writer；不能声称真机 lineage 或端到端灾难恢复已经完成。"
    ],
    relation: "这是与 PostgreSQL/Grafana 主时间线并列的独立产品轴；PCConfig 只拥有机器路径、ACL、三任务、快捷方式、Watchdog 与近线恢复，TimeAudit 拥有采集语义、SQLite schema、查看器与增量合同。它不依赖其他模块，但可把获准的版本化事件交给独立消费者。",
    readerStatus: "已有搜索、预览和再次复制的本机历史界面；运行与数据库健康保留历史验收，本轮未刷新记录数或试恢复。"
  },
  {
    slug: "backup-recovery",
    usageEntry: "在已接入 TimeAudit 的 AI 对话中明确说全新安装或带历史换机，并给出可靠备份；Grafana 页面只负责查看结果。",
    usageInputs: ["新旧机器与目标时间线", "最后可靠数据库和 Grafana 备份", "可用软件与凭据"],
    productFlow: [
      {
        "title": "核对最后真正可读的备份",
        "detail": "系统确认历史数据库备份和大盘配置分别存在且能读取，并列出备份之后可能丢失的时段。"
      },
      {
        "title": "建立并导入",
        "detail": "安装所需运行环境，空库建表或将已验 dump 恢复到干净库，再恢复大盘。"
      },
      {
        "title": "逐层验收",
        "detail": "核对采集心跳、真实入库和浏览器中的旧新记录；缺备份或大盘打不开就指出停点，不说零丢失。"
      }
    ],
    shortTitle: "安装与恢复",
    title: "安装、换机与数据恢复",
    searchAliases: ["新电脑第一次怎么装采集系统", "换机怎么带走采集历史", "系统重装后怎么恢复采集历史", "空数据库要建表还是恢复dump", "快速部署零丢失承诺还有效吗", "Watchdog到底一分钟还是五分钟"],
    searchProjection: {
      intents: ["在全新电脑安装 TimeAudit", "换机并带回历史数据", "系统重装或硬盘更换后恢复", "验证备份是否真的可恢复"],
      entities: ["WSL2", "Docker Desktop", "setup_runtime.ps1", "PostgreSQL dump", "Grafana datasource", "TimeAudit_DailyBackup"],
      relations: ["源码 checkout 后重建项目 .venv", "三容器就绪后空库建表或 dump restore 二选一", "Grafana 数据源先于 dashboard 恢复", "AutoStart Watchdog DailyBackup 连接运行与恢复", "heartbeat 入库聚合浏览器大盘组成验收链"],
      failureRecovery: ["旧快速部署整树复制不作为现行命令", "零丢失承诺改为说明备份后缺口", "Watchdog 五分钟旧说明以当前每分钟事实为准", "最新 dump 未隔离整库恢复就保持缺口"]
    },
    teaser: "把全新安装、带历史换机、系统重装 / 硬盘更换三种场景拆开：先重建 WSL、Docker、项目 .venv 和三容器，再在空库建表或 dump 恢复中二选一，接回 Grafana、三项计划任务并做真实数据链验收。",
    status: "8 月 31 日基线记录每日备份结果 0、备份/恢复定向测试通过；本次未刷新任务结果或从最新 dump 做隔离整库恢复",
    statusTone: "mixed",
    value: "新电脑从零安装、带回旧历史和灾后恢复分别选择材料；最后应在浏览器看到旧时间线与新记录继续写入，而不是只看见数据库文件。",
    why: "新电脑从零安装和带回旧历史是两件事。只复制项目文件夹会混进旧机器的运行状态；真正恢复须先验历史备份，再确认数据库、浏览器大盘和自动记录重新连上。",
    example: "我说“把旧电脑上的 TimeAudit 连历史一起搬到新机”。恢复完成后，我应该能在浏览器里打开原来的大盘、查到备份里的旧时间线，同时看到新电脑的记录继续往前走；若备份之后到故障之前有一段拿不回来，它会单独列出，而不是承诺历史零丢失。",
    result: "恢复后应能在浏览器大盘看到备份里的旧时间线，也看见新电脑继续产生记录。若只装好了程序、旧备份读不出或故障前最后一段没备到，会逐项列出，不承诺零丢失。",
    readerStates: {
      "pass": "所选备份、运行环境、旧历史和新采集都逐层读回时，才说明对应部分恢复。",
      "problem": "数据库备份读不出、大盘打不开或新记录不前进时停在那一层并保留旧备份。",
      "unavailable": "备份盘、数据库或登录条件缺失时只建立可安全准备的部分，明确旧历史目前无法找回。"
    },
    decisionImpact: [
      "全新安装、带历史换机、灾后 / 重装 / 硬盘更换先选场景，不把三套动作混成一张清单。",
      "取得现行项目源码后运行 `setup_runtime.ps1` 重建 `.venv`；不复制旧 `.venv`、整个项目运行树或未干净关闭的数据卷。",
      "先建立 WSL2、Docker Desktop、项目 `.venv` 与 PostgreSQL / ingester / Grafana 三容器。",
      "全新空库执行 `schema.sql`；带历史换机或灾后恢复使用校验过的 dump restore。两条只选一条，避免先建再清或把空库当历史。",
      "数据库 dump 优先于运行中 `postgres_data` 目录复制；Grafana 先确认固定 PostgreSQL datasource，再恢复 dashboard JSON 或完整状态。",
      "恢复 `TimeAudit_AutoStart`、每分钟 `TimeAudit_Watchdog` 与 `TimeAudit_DailyBackup` 后，依次验 heartbeat、真实入库、有界聚合和浏览器大盘。",
      "二进制库保存完整 Grafana 状态，JSON 提供版本化 dashboard 恢复；只接受精确 `.json`，不导入 `.json.bak`。",
      "任务结果 0、备份存在和源码测试都不替代最新 dump 的隔离整库恢复；历史缺口必须按最后备份时间保留。"
    ],
    problem: "解决全新安装与历史恢复混用、复制旧运行树、`.venv` 跨机器漂移、空库建表与 dump restore 重复、Grafana 数据源失配、计划任务漏装、长期膨胀、备份夹带、Git 分叉和未经真实数据链验收的恢复自信。",
    implementation: [
      "setup_runtime.ps1 从固定 Python 3.11 基座创建项目 `.venv`、安装 requirements 并运行 pip check；启动器和 Watchdog 使用其中的 pythonw。",
      "docker-compose.yml 拉起 PostgreSQL 15、audit-ingester 和 Grafana 13.0.2；schema/main 管周/月分区、预热和 1200 天默认保留。",
      "backup_db 用 pg_dump；backup_grafana 用一致快照导出 JSON。",
      "restore_grafana 只接受合同通过的 JSON，并支持 dry-run。",
      "PCConfig 重建 AutoStart 与每分钟 Watchdog；DailyBackup 每天 20:40 组合备份并轮转 14 份。",
      "README 记录当前 `.venv`、每 1 分钟 Watchdog 与运行链；`快速部署.md` 的整树复制、零丢失和每 5 分钟说法是待 Owner 修订的旧说明。",
      "timeaudit_backup.py restore-check使用已安装固定镜像、无网络/无公开端口、只读归档挂载与独立数据库，绝不导入audit-postgres。原容器完成记录可跨客户端断线保留；restore-status查看同次进度，finish-restore核对退出码、可读表、所有权标签后记录结果并清理本次容器/匿名卷。running/starting不算PASS，未知资源不盲重建或删除。",
      "backup_db.ps1以合格Python导出到唯一.partial，flush后确认PostgreSQL custom格式、列归档并算SHA-256，再发布.dump及原子.dump.json。至少保留3份完整已验证配对，失败不替换成功档案，无法证明可清理的旧原件保留。健康检查只看清单形状、长度与新鲜度，不重哈希全部载荷。",
    ],
    flow: [
      "先选场景：全新安装没有历史、换机需要带历史，或灾后 / 重装 / 硬盘更换从备份恢复；记录最后可靠备份与预期历史缺口。",
      "安装或确认 WSL2 与 Docker Desktop，取得现行项目源码，运行 `pwsh -File .\\setup_runtime.ps1` 重建项目 `.venv`。",
      "准备凭据后以 compose 拉起 PostgreSQL、audit-ingester、Grafana 三容器，并确认容器身份与 health。",
      "数据库二选一：全新空库执行 `schema.sql`；带历史或灾后候选先校验 dump，再恢复到干净目标库，不额外走空库建表路线。",
      "确认 Grafana 固定 PostgreSQL datasource，再用合同通过的 JSON 或完整 Grafana 备份恢复 dashboard，并在浏览器打开 `http://localhost:43000`。",
      "重建并回读 `TimeAudit_AutoStart`、`TimeAudit_Watchdog`、`TimeAudit_DailyBackup`，再手动触发一次受控启动或备份检查。",
      "按三条 heartbeat 推进、真实入库、`timeaudit_diagnostic_summary.py` 聚合覆盖、浏览器六张大盘可读的顺序验收。",
      "最后列出备份后到故障时刻的历史缺口、不可恢复项和未执行的演练；本轮仍未从最新 dump 做隔离整库恢复。"
    ],
    concepts: [
      { term: "dump（逻辑备份）", explanation: "由 PostgreSQL 生成、可校验恢复的文件。" },
      { term: "fresh install（全新安装）", explanation: "没有历史库的场景；在三容器就绪后用 `schema.sql` 创建空表结构。" },
      { term: "history restore（历史恢复）", explanation: "换机或灾后把校验过的 dump 恢复到干净目标库；dump 自带结构，不与空库建表步骤叠加。" },
      { term: "runtime rebuild（运行环境重建）", explanation: "从现行源码和 requirements 运行 `setup_runtime.ps1` 创建项目 `.venv`，不复制旧机器的虚拟环境。" },
      { term: "acceptance chain（验收链）", explanation: "从任务、heartbeat、真实入库、聚合摘要到浏览器大盘逐层回读；上一层成功不替代下一层。" },
      { term: "consistent snapshot（一致快照）", explanation: "同一事务视图读取 Grafana SQLite。" },
      { term: "dry-run（预检）", explanation: "只发现和验证，不修改运行实例。" }
    ],
    boundaries: [
      "数据库和二进制备份不进入 PUBLIC Git。",
      "Git JSON 不等于完整数据库或用户状态。",
      "`快速部署.md` 当前“复制整个项目树”“历史零丢失”和 Watchdog 每 5 分钟属于已识别漂移；现行事实以 README、setup_runtime.ps1 与每分钟 Watchdog 定义为准。",
      "恢复最多到最后一份可靠备份；故障前尚未备份的区间必须列为历史缺口。",
      "无恢复回读不能称灾难恢复完成，本轮也没有把定向测试或任务结果 0 冒充最新 dump 的隔离整库恢复。"
    ],
    failures: [
      { condition: "全新安装误走 dump 恢复或历史恢复先建空表", response: "停止并重新确认场景；在 `schema.sql` 建表与 dump restore 中只选正确的一条。" },
      { condition: "旧文档要求复制整个项目树或旧 `.venv`", response: "只迁移现行源码与经选择的备份，在目标机运行 `setup_runtime.ps1` 重建环境；运行卷不作为默认迁移手段。" },
      { condition: "JSON 有人工脏改", response: "失败关闭，不覆盖或夹带。" },
      { condition: "退役 UID / matcher 缺失", response: "合同失败，不能恢复。" },
      { condition: "任务显示成功但 heartbeat、入库或大盘不通", response: "只把任务层标为通过，继续定位受影响层；不宣布系统恢复。" },
      { condition: "远端领先或分叉", response: "不 push、不 force-push，保留本地备份。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\schema.sql", role: "表、分区与索引" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\docker-compose.yml", role: "数据库、ingester 与 Grafana" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\setup_runtime.ps1", role: "项目 .venv 创建、依赖安装和冲突检查" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\README.md", role: "现行每分钟 Watchdog、.venv 与运行验收事实" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\backup_all.ps1", role: "组合备份" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\backup_db.ps1", role: "数据库 dump" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\backup_grafana.py", role: "Grafana 导出与同步" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\restore_grafana.py", role: "验证与恢复" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\快速部署.md", role: "三场景旧入口；含已识别的整树复制、零丢失与五分钟 Watchdog 漂移" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_backup_all_script.py", role: "备份回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_restore_grafana.py", role: "恢复回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_sql_partition_explain.py", role: "分区查询审计" },
      {
        "path": "E:\\Projects\\Tools\\TimeAudit\\DIAGNOSTICS_OPERATIONS.md",
        "role": "质量来源、活动持久化、共享健康、数据库备份与独立恢复的当前合同"
      },
    ],
    verification: [
      "8月31日回读的DailyBackup结果为0，本批未刷新该项。",
      "备份、恢复与大盘合同纳入定向测试并通过。",
      "README 与 setup_runtime.ps1 当前证明运行环境应在目标机重建、Watchdog 为每分钟检查；它们不证明某次换机已经完成。",
      "未从最新 dump 做隔离 pg_restore，也未完整走三场景任一真实换机旅程，恢复 E2E 仍缺。"
    ],
    relation: "先重建采集模块的运行与存储底座，再恢复硬件、进程、时间和可视化所需历史；可靠性模块接回 AutoStart / Watchdog，最终由 heartbeat、入库、聚合和浏览器大盘共同验收。",
    readerStatus: "已有安装、备份和隔离恢复方法及历史测试；本轮没有用最新整库备份试恢复，不能承诺故障前记录全部找回。"
  }
];

export const project = timeAuditProject;
export const modules = timeAuditModules;
