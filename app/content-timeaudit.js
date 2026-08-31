import { createProjectSnapshot } from "./project-snapshot.js";

const timeAuditSnapshot = createProjectSnapshot({
  observedAt: "2026-08-31T11:18:10Z",
  label: "PUBLIC main、运行链、聚合 provider 与 180 项完整回归均有新鲜证据；数据库全量审计和整库恢复本次未验",
  boundary: "采集与大盘现场已核对；本次没有有效游戏帧、完整数据库审计或最新整库恢复演练",
  metrics: [
    { label: "近1小时样本", value: "3615" },
    { label: "CPU 均/峰", value: "64.5/68.8°C" },
    { label: "GPU 均/峰", value: "52.6/54°C" },
    { label: "磁盘 P95", value: "0.316 ms" }
  ],
  facts: [
    { label: "采样与保留", value: "硬件 / FPS / 前台心跳 1 秒，活跃进程 3 秒；约 2 GB/周、330 GB/三年、1200 天保留；数据库与 Grafana 每类备份轮转上限 14 份。" },
    { label: "存储与展示", value: "audit-postgres、audit-ingester、audit-grafana 三个容器运行，入库器 healthy（健康）；PostgreSQL 15 位于本机 45432，Grafana 13.0.2 位于本机 53000；产品有 6 张仪表盘、78 个面板。" },
    { label: "近一小时诊断", value: "`timeaudit_diagnostic_summary.py --hours 1` 本轮返回 status=ok、coverage=fresh、3615 个硬件样本，最新样本年龄 0.058 秒；CPU 均值/峰值 64.5/68.8°C、GPU 52.6/54°C、磁盘 p95 0.316 ms；没有有效游戏帧被正确标为 no_game_frames。" },
    { label: "运行现场", value: "遥测主链、AHK 与入库器三条无正文 heartbeat（心跳）在 02:30Z 附近刷新，观察时文件年龄约 1–2 秒；Watchdog（看门狗）与每日备份任务最近结果均为 0；packet-loss 信号 14 次、活动状态重叠 6 秒只进入复核边界。" },
    { label: "源码与回归", value: "Git Owner 确认 wlyaaaaa/TimeAudit 为 PUBLIC（公开），默认 main；观察时 HEAD 与缓存 origin/main 均为 44a842e82ea03a18174b87fe77d248f776d62eb5，工作树干净；复用项目 Python 3.11 生产依赖与临时 pytest runner 后，完整回归为 180 passed、11 subtests passed，用时 47.33 秒。" },
    { label: "已根治的采集误差", value: "本轮源码修复已消除 172 个正常系统进程误报，修正一小时窗中的 138 对重叠以避免 1 小时被算成 1.5 小时，并把占采集耗时 86% 的父进程解析替换为同一快照映射。" },
    { label: "公开安全聚合", value: "公开安全聚合 provider（提供器）在 01:00Z—02:00Z 返回 status=ok、coverage=fresh、3530 个样本；1 个 scheduler_jitter_saturation warning 涉及 110 个样本，且 projection_recheck_recommended=false。", hero: false },
    { label: "采集可靠性", value: "当前 main 使用单调时钟判断 PresentMon 新鲜度；`psutil.net_connections()` 进入可重启隔离进程，并避开 Windows `cpu_stats()` 原生崩溃路径。", hero: false },
    { label: "运行依赖", value: "生产 Python 依赖已经收敛到项目 `.venv`；启动器与 Watchdog 不依赖全局 Python 包。", hero: false },
    { label: "容量合同", value: "保留与备份审计按约 2 GB/周、330 GB/三年和 1200 天保留估算；数据库与 Grafana 每类备份轮转上限为 14 份。这是容量与轮转合同，不证明任一备份已完成隔离整库恢复。", hero: false },
    { label: "接口边界", value: "两个聚合回执为了快速、有界而不返回逐行历史、进程或窗口明细；阈值信号只表示相关与出现次数，不证明硬件故障、恶意程序或用户意图。", hero: false }
  ],
  gaps: [
    "一小时诊断窗口没有有效游戏帧，因此没有 FPS、1% Low 与 frametime 结论；no_game_frames 是有效状态，不是掉帧或采集故障。",
    "本次未查询原始数据库行、窗口标题、实际进程、远端地址或个人统计，不能证明某段具体历史已被正确解释。",
    "本轮完整源码回归已通过，但没有执行 db_audit.py 的整库数据审计，也没有对全部 Grafana SQL 做当前数据库执行计划验收；在线状态与单元测试都不能证明历史数据全绿。",
    "diagnostic summary v1 最长查询 168 小时且仅聚合；需要更长趋势或逐进程/路径/窗口明细时，应建立有明确价值并按实际值判断敏感性的另一条路线，不能把缺失字段猜出来。",
    "使用手册仍有把相关性写成查毒、黑客、键盘监听、内存泄漏确诊或精确物理归因的过强旧措辞；当前 provider 与网页继续只给候选、相关性和人工核查，源文档需由 TimeAudit Owner 单独修正。",
    "备份任务结果为 0、定向恢复测试通过，但本次未从最新 dump 和 Grafana 备份做隔离整套恢复。"
  ]
});

export const timeAuditProject = {
  order: 5,
  slug: "timeaudit",
  title: "TimeAudit",
  route: "/projects/timeaudit",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "本机时间线与剪贴板历史持续采集，可回放故障、使用与复制记录",
  cardStatusTone: "pass",
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
  repositoryNote: "这是吴乐阳个人维护并集成第三方探针/库的 PUBLIC（公开）GitHub 仓库；根目录没有统一 LICENSE，不能仅因公开就称为开源，也不能把 LibreHardwareMonitor、PresentMon、Grafana 等外部组件冒充个人原创。进程名、路径、命令行、窗口标题、时间、遥测、机器与网络指标不因字段类型自动保密；本页可在有用时公开这些技术事实。只有实际包含个人敏感正文或密码、令牌、密钥、恢复码等凭据的具体值才隐藏。原始全库不镜像进网页，是因为体积、噪声和解释边界。",
  summary: "TimeAudit 给这台 Windows 工作站留下两种可找回的本机历史：一条对齐性能、程序、功耗和使用时间，解释某个时刻电脑发生了什么；另一条独立保存新发生的文本、网址与文件路径复制，供本机搜索和再次复制。两条链各自有存储、状态与恢复边界，任何记录都不自动等于用户意图。",
  why: "任务管理器只能看此刻，卡顿、过热、异常写盘和闪退等现场很快消失；剪贴板内容也会被下一次复制覆盖。TimeAudit 让偶发故障可以事后按时间对齐，让曾复制的资料可以按关键词、日期和类型找回，同时明确区分观察事实、估算、空档和未知。",
  plainExample: "例如我先问“昨晚游戏卡了两秒，是显卡、磁盘还是后台程序？”，把时间框到那两秒对齐帧率、硬件和前后台争抢；写命令时又发现刚复制的长路径已被新内容覆盖，便在本机剪贴板历史按关键词找到原记录并再次复制。两个结果都来自已有记录，不靠猜测或重启。",
  result: "我得到一套只读本机诊断面和一套独立的本机复制找回面：前者回看整机与程序状态、能耗和使用时间，后者搜索、预览、再次复制并可按版本化游标增量输出。每条链都说明记录是否继续、问题在哪里和哪些结论不能推出；它们不自动结束程序、修改系统或监控用户意图。",
  readerStates: {
    pass: "主时间线和剪贴板 sidecar 各自推进时，前者返回可对齐的硬件、程序、前台与生灭视图，后者在本机返回可搜索、可再次复制的历史；无正文心跳只证明对应记录链仍活着。",
    problem: "发现采样空档、指标越界、剪贴板跳过/缺口、后台争抢、崩溃或查询口径异常时，指出受影响组件与恢复入口，不把异常或复制动作直接解释成硬件故障、恶意行为或用户意图。",
    unavailable: "任一链的保存、展示、采集、索引或传感器入口不可用时，只把对应层写成证据不足并受控恢复；不伪造读数，不做长期全表扫描，也不读取私人正文来补一份公开报告。"
  },
  gallery: [
    { src: "/media/timeaudit/dashboard-catalog.png", thumbnail: "/media/timeaudit/thumbs/dashboard-catalog.webp", alt: "TimeAudit 六张仪表盘目录", caption: "2026-08-29 的真实 Grafana 目录：六张盘把性能、流畅度、功耗、取证、后台资源和使用时间组成可回放产品。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明六张仪表盘和 78 个面板曾在真实 Grafana 中组成完整产品入口。", doesNotProve: "不证明当前服务在线、每个查询仍正确或当前数据没有空档。" },
    { src: "/media/timeaudit/screen-time-focus.png", thumbnail: "/media/timeaudit/thumbs/screen-time-focus.webp", alt: "屏幕使用时间与专注复盘", caption: "2026-08-29 的真实界面，展示屏幕使用、专注上下文、最近切换以及睡眠和暂离边界。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明使用时间与焦点关系曾能在同一大盘阅读，普通应用和时长按真实画面保留。", doesNotProve: "不证明这些应用、标题、时长或生活规律仍是当前事实。" },
    { src: "/media/timeaudit/power-cost.png", thumbnail: "/media/timeaudit/thumbs/power-cost.webp", alt: "TimeAudit 功耗与电费诊断界面", caption: "2026-08-29 的真实功耗盘，把 CPU、GPU、其他部件、峰谷时段和费用估算放在同一视图。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明功率采样、时段和费用模型已有可用界面。", doesNotProve: "其他部件功耗、电费与碳排是模型估算，不是插座计量或账单。" },
    { src: "/media/timeaudit/hardware-long-term.png", thumbnail: "/media/timeaudit/thumbs/hardware-long-term.webp", alt: "历史旧版整机硬件长期趋势界面", caption: "历史旧版截图仍含 RTX5080 标题；当前 dashboard 已移除 SKU 绑定，因此它只作为界面演化证据。", evidenceLevel: "E0", evidenceLabel: "历史旧版界面", observedAt: "2026-08-29", sourceCommit: "pre-44a842e dashboard capture", proves: "证明长期温度、功率、频率和降频趋势的界面形态曾存在。", doesNotProve: "不代表当前硬件型号、当前 dashboard 标题或当前长期趋势。" },
    { src: "/media/timeaudit/fps-stutter.png", thumbnail: "/media/timeaudit/thumbs/fps-stutter.webp", alt: "历史 FPS 数据质量坏例", caption: "历史截图出现最高 8192 FPS 等不可信量级，现作为 PresentMon 新鲜度与一致性修复前的数据质量坏例保留。", evidenceLevel: "E0", evidenceLabel: "历史数据质量坏例", observedAt: "2026-08-29", sourceCommit: "pre-44a842e dashboard capture", proves: "证明旧链曾把异常量级带进 FPS/卡顿界面，也说明为什么需要单调时钟和新鲜度门。", doesNotProve: "不证明任何真实游戏性能、掉帧原因或当前 PresentMon 输出。" },
    { src: "/media/timeaudit/foreground-stutter-analysis.png", thumbnail: "/media/timeaudit/thumbs/foreground-stutter-analysis.webp", alt: "历史前台卡顿数据质量坏例", caption: "历史界面曾显示 Windows Terminal 平均 826 FPS 等不可信值；它用于展示旧数据问题，不作为当前性能证据。", evidenceLevel: "E0", evidenceLabel: "历史数据质量坏例", observedAt: "2026-08-29", sourceCommit: "pre-44a842e dashboard capture", proves: "证明前台应用、卡顿标记和瓶颈时间线的界面结构，以及旧数据口径曾需要修复。", doesNotProve: "不证明截图中的应用 FPS、瓶颈或任何当前卡顿结论。" },
    { src: "/media/timeaudit/foreground-timeline.png", thumbnail: "/media/timeaudit/thumbs/foreground-timeline.webp", alt: "前台焦点与卡顿时间线", caption: "2026-08-29 的真实界面，把微观卡顿与前台焦点对齐，并保留当时可见的真实应用上下文。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明焦点时间线和卡顿标记曾能在同一页面对齐。", doesNotProve: "不证明旧 FPS 点全部有效，也不代表当前使用上下文。" },
    { src: "/media/timeaudit/system-pressure.png", thumbnail: "/media/timeaudit/thumbs/system-pressure.webp", alt: "系统压力与上下文切换", caption: "2026-08-29 的真实系统压力盘，对齐用户态调度抖动、上下文切换、内存与磁盘延迟。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明多个系统压力信号可在同一时间轴比较。", doesNotProve: "不证明内核 DPC、硬件故障或任何单一根因。" },
    { src: "/media/timeaudit/resource-usage.png", thumbnail: "/media/timeaudit/thumbs/resource-usage.webp", alt: "资源大户与后台负载", caption: "2026-08-29 的真实资源盘，按 CPU、GPU、内存、显存、磁盘和网络展示程序聚合。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明本机 Grafana 可以查看具体程序的资源排行和时间变化。", doesNotProve: "不证明 timeaudit-diagnostics Skill 会自动返回程序名，也不证明资源占用就是根因。" },
    { src: "/media/timeaudit/process-forensics.png", thumbnail: "/media/timeaudit/thumbs/process-forensics.webp", alt: "进程生命周期与取证线索", caption: "2026-08-29 的真实取证盘，用签名、提权、生命周期、退出码和路径异常提供人工核查线索。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明进程生灭与路径/签名线索有可视化入口。", doesNotProve: "无签名、异常路径或同期活动都不自动证明恶意、黑客或键盘监听。" },
    { src: "/media/timeaudit/storage-scale.png", thumbnail: "/media/timeaudit/thumbs/storage-scale.webp", alt: "存储吞吐与数据库规模", caption: "2026-08-29 的真实存储盘，展示写密集时序系统的吞吐和分区规模。", evidenceLevel: "E2", evidenceLabel: "历史真实界面", observedAt: "2026-08-29", sourceCommit: "a5a34d6-era dashboard capture", proves: "证明存储吞吐、显存/网络和数据库规模有可读界面。", doesNotProve: "不证明全部 SQL 当前都已裁剪、备份可恢复或长期容量没有风险。" }
  ],
  productPrinciples: [
    { title: "先问什么时候发生", detail: "时间窗口是诊断入口；先定位问题时刻，再决定需要哪些硬件、进程、前台和生命周期证据。" },
    { title: "多种信号必须对齐解释", detail: "单个温度、帧率或磁盘尖峰不能直接给根因，只有同一时间轴上的关系才形成候选解释。" },
    { title: "空白也有不同原因", detail: "没有游戏帧、没有采到和采集器故障是三种状态，不能都显示成零或正常。" },
    { title: "实测、估算、推导和未知分开", detail: "能耗、电费、签名风险和因果判断都有边界，界面必须说明每个值来自哪里、能证明什么。" },
    { title: "先看有界摘要，再决定是否深挖", detail: "快速查询先确认覆盖和方向，只有真正需要时才进入详细大盘，不让每次诊断都临时拼查询。" },
    { title: "只记录和解释，不自动处置", detail: "项目不结束进程、不修改系统，也不把相关性、异常路径或无签名直接升级成安全结论。" },
    { title: "复制事实不等于用户意图", detail: "剪贴板 sidecar 只证明某次复制被本机观察到；它不证明用户读过、同意、执行或打算使用其中内容。" },
    { title: "私密正文留在本机", detail: "搜索、完整预览与再次复制都在桌面查看器内完成；公开面只展示 schema（结构版本）、组件、状态和计数，不展示原始正文、内容 hash（哈希）、私密窗口或凭据。" },
    { title: "独立能力独立失效", detail: "剪贴板历史不依赖 PostgreSQL、Grafana 或主采集器；一条链出问题时不把另一条链误报为不可用。" },
    { title: "运行健康不等于数据真理", detail: "心跳证明链路继续推进，不证明每个传感器值正确，也不证明历史没有空档。" },
    { title: "备份成功不等于恢复完成", detail: "数据库、面板和任务都要在隔离环境恢复并回读结果，不能用备份任务退出码冒充可恢复。" }
  ],
  responsibilities: [
    "在本机连续采集硬件、FPS、活跃进程、前台上下文和进程生命周期",
    "用 PostgreSQL 分区表保存点采样与区间事件，并控制长期写入和查询成本",
    "用 Grafana 提供面向实际问题的诊断盘，而不是只堆原始指标",
    "区分真实传感器、估算、空值、点采样和区间事件，避免口径混写",
    "独立保存当前交互会话中新发生的文本、HTTP(S) URL 和普通文件路径复制，并在本机提供全文搜索与再次复制",
    "通过版本化 JSON/stdio（JSON 标准输入输出）只读出口提供可续跑的增量消费，同时把消费 checkpoint（增量游标）留给下游 owner（事实责任方）保存",
    "用 heartbeat（心跳）、Watchdog（看门狗）、备份和恢复维持长期可用",
    "提供机器配置异常增量与个人历史诊断两个有界聚合入口，让调用方快速取得可解释证据而不临时拼 SQL"
  ],
  exclusions: [
    "不自动结束进程、封禁网络、修改系统或把告警升级为安全结论",
    "不作为企业多机监控、远程管理、云端数据平台或告警推送服务",
    "不把连接占比分摊写成精确网络归因，也不把用户态抖动冒充内核 DPC 延迟",
    "不把无活跃 3D 负载时的 FPS 空值自动解释成采集故障",
    "不采集图片、二进制、虚拟文件或私有格式，不把复制事件解释成阅读、同意、执行或任何用户意图",
    "不把原始剪贴板正文、历史载荷、私密窗口、内容 hash 或凭据带入网页、PostgreSQL、Grafana、日志或浏览器缓存",
    "不把未经筛选的整库数据当成诊断结果；只返回与当前问题相关、能解释时间范围和因果限制的信号"
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
    { title: "分开两条前台记录", detail: "AHK 记录简版使用区间并经 spool 入库；Python 主引擎写硬件、进程、上下文和生命周期事实。" },
    { title: "按快慢节拍采集", detail: "每 1 秒推进硬件、FPS 与前台心跳；全进程扫描约每 3 秒单飞，过慢时跳过而不积压。" },
    { title: "保留来源差异", detail: "NVML、PDH、LibreHardwareMonitor、PresentMon 与 Win32 各守边界；估算、空值和失败不互相冒充。" },
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
    { name: "Watchdog（看门狗）", responsibility: "恢复 native（本机代码）崩溃、假活和入库停滞。", implementation: "按精确身份与 heartbeat（心跳），只恢复故障组件。" },
    { name: "backup / restore", responsibility: "备份数据库、Grafana 状态和 dashboard JSON。", implementation: "来源分叉或恢复标识不合格时失败关闭。" },
    { name: "PCConfig anomaly digest（机器配置异常摘要）", responsibility: "向 PCConfig 提供有界增量异常计数与是否建议重查稳定投影。", implementation: "窗口最长 168 小时，只返回覆盖、阈值、计数与建议；字段省略是接口范围，不是公开禁令。" },
    { name: "diagnostic summary provider（历史诊断摘要接口）", responsibility: "为 timeaudit-diagnostics Skill 汇总硬件、有效游戏帧、电脑状态、覆盖空档和阈值信号。", implementation: "`--hours 1-168` 或精确 UTC 窗口执行一次 aggregate-only 查询；schema、owner、coverage 与因果限制失败关闭。" },
    { name: "Windows 剪贴板历史 sidecar", responsibility: "保存新发生的文本、网址与普通文件路径复制，提供本机全文搜索、再次复制、只读增量出口与独立恢复。", implementation: "WM_CLIPBOARDUPDATE + SQLite WAL/FTS5；三项普通用户任务与 G 盘 nearline backup（近线备份）由 PCConfig 管理，不依赖 PostgreSQL/Grafana。" }
  ],
  usageExamples: [
    { moduleSlug: "hardware-performance", ask: "刚才游戏为什么卡？", effect: "先用有界摘要确认覆盖、游戏帧和压力方向；需要具体时间线时，再到 Grafana 对齐 1 秒 FPS、1% Low、单帧时间、瓶颈、磁盘和后台争抢。" },
    { moduleSlug: "process-forensics", ask: "谁在后台写盘或联网？", effect: "AI先用有界聚合确认覆盖、磁盘/网络方向和是否值得深挖；当前 Skill 不返回进程名，需点名程序时再进入本机 Grafana 资源盘查看具体进程和时间段。" },
    { moduleSlug: "process-forensics", ask: "程序为什么闪退？", effect: "AI先用聚合摘要确认同窗资源与覆盖；具体退出码、存活时间、父子关系和路径明细要进入本机 Grafana 取证盘，本项目尚无已验收的自然语言逐进程查询入口。" },
    { moduleSlug: "usage-energy", ask: "时间都花在哪？", effect: "用前台区间、暂离、睡眠、专注块和切换趋势复盘；窗口标题与时长可按实际价值展示，只隐藏其中真正敏感的具体内容。" },
    { moduleSlug: "runtime-reliability", ask: "采集器是不是假活？", effect: "检查三条无正文 heartbeat（心跳）、容器 health（健康状态）和任务状态，再精确恢复组件。" },
    { moduleSlug: "clipboard-history", ask: "刚才复制的长命令被下一次复制覆盖了，怎么找回来？", effect: "打开本机 TimeAudit 剪贴板历史，按关键词、日期或类型搜索，预览后再次复制；系统会保留新事件与原事件 lineage（恢复来源链），但不会把复制事实解释成阅读、同意或执行。" },
    { moduleSlug: "hardware-performance", ask: "过去一小时电脑为什么偶尔卡？", effect: "timeaudit-diagnostics 先用一条聚合查询确认覆盖、硬件、游戏帧和状态时长，再把 occurrence 信号与 Windows、驱动、任务或 PCConfig 现场证据交叉判断；需要具体时刻或进程再打开 Grafana。" },
    { moduleSlug: "collection-pipeline", ask: "为什么最近一段时间完全没数据？", effect: "先区分睡眠、关机和采集缺口，再查快慢车道、AHK spool、入库事务、数据库分区与 heartbeat，不把空档当成电脑健康。" },
    { moduleSlug: "backup-recovery", ask: "换机或系统损坏后怎么恢复？", effect: "先判断是全新安装、带历史换机还是灾后恢复；建立 WSL / Docker / 项目 .venv 和三容器后，在空库建表与 dump 恢复中二选一，再恢复 Grafana、任务和整条验收链。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "已发布 44a842e 定义主采集、表、口径、自愈、备份与独立剪贴板 sidecar；当前 6 文件 dirty 候选另行提出 LHM 单 owner 语义。", doesNotProve: "本机已安装、运行或 dirty 候选已经发布/激活。" },
    { layer: "Tests（测试）", proves: "已发布基线 180 项测试与 11 个子测试覆盖主链；本任务另跑剪贴板专属 11 项，覆盖 schema、FTS5、独立事件与 blob 复用、只读查看、lineage、adapter checkpoint 与备份读回。", doesNotProve: "真实游戏负载、剪贴板真机消息回环、长期全库性能或 6 文件候选已经通过完整回归。" },
    { layer: "Runtime（运行）", proves: "观察时主容器运行、入库器 healthy（健康）、主 heartbeat 新鲜；剪贴板 collector Running、watchdog/backup Ready、无正文 heartbeat 新鲜且 SQLite integrity=ok。", doesNotProve: "样本或剪贴板正文正确、历史无空档，或复制代表用户意图。" },
    { layer: "Aggregate（聚合）", proves: "本轮一小时诊断摘要有 3615 个硬件样本、覆盖新鲜、no_game_frames，并保留温度、磁盘、packet-loss 与活动重叠信号。", doesNotProve: "内核 DPC、硬件故障、具体进程原因、网络根因或持续压力。" },
    { layer: "Gallery / dashboard contract（图片 / 大盘合同）", proves: "11 张获准截图展示真实界面；固定数据源与恢复结构有回归。", doesNotProve: "图片瞬时值可公开推广或全部 SQL 性能达标。" },
    { layer: "Recovery（恢复）", proves: "主链与剪贴板近线备份任务最近结果为 0，SQLite Online Backup、清单校验与空目录恢复有单元测试。", doesNotProve: "本次已从最新 PostgreSQL/Grafana 或 G 盘剪贴板副本完成隔离端到端恢复。" }
  ],
  evolution: [
    { date: "2026-06-08", commit: "e4c49fd–bf69c85", result: "建立 Windows 遥测、PostgreSQL 数据仓库和多仪表盘，从一次性查看变成可回放黑匣子。" },
    { date: "2026-06-13—06-14", commit: "a303f54–faadf31", result: "修正 GPU、双显卡、CPU 归一化、睡眠/NTP/分区边界，并加入健康测试和每日备份。" },
    { date: "2026-07-03—07-27", commit: "1a0c3a5–6e4c7bd", result: "完善隐藏自启、Watchdog、入库恢复、备份同步和 PresentMon 所有权。" },
    { date: "2026-07-25—08-16", commit: "00d6e29–5d25379", result: "新增独立 Windows 剪贴板历史 sidecar：事件监听、SQLite WAL/FTS5、本机查看与再次复制、版本化增量出口、近线备份和固定中国标准时间显示形成完整产品轴。" },
    { date: "2026-07-29—08-07", commit: "e677ad6–5f41846", result: "把 FPS 绑定前台渲染进程，加入不含正文的聚合异常接口，并加固采样与取证。" },
    { date: "2026-08-21", commit: "2ec7807–de82db7", result: "修复 spool 并建立 Grafana 13 固定数据源、备份与恢复失败关闭合同。" },
    { date: "2026-08-23—08-24", commit: "2d77616–59ecd01", result: "串行化遥测恢复并加固 FPS 数据库恢复，避免恢复器抢占与空闲误报。" },
    { date: "2026-08-29", commit: "238ea58–a5a34d6", result: "恢复 Grafana 时间轴 transformation、移除大盘硬件型号绑定，并新增一次查询即可消费的有界历史诊断 provider 与 fast path；`.agents` 同步增加 timeaudit-diagnostics Skill。" },
    { date: "2026-08-30—08-31", commit: "44a842e", result: "PresentMon 新鲜度改用单调时钟，psutil 原生网络枚举进入可重启隔离进程，生产 Python 收敛到项目独立 .venv；同时消除 172 个正常系统进程误报、修正一小时窗 138 对重叠，并把占采集耗时 86% 的父进程解析换成同快照映射。" }
  ],
  operationalEntrypoints: [
    { name: "打开大盘", command: "http://localhost:53000", purpose: "从时间范围进入 6 张诊断盘。" },
    { name: "启动主链", command: "schtasks /run /tn TimeAudit_AutoStart", purpose: "通过交互式提权任务拉起 AHK、Docker 与主引擎。" },
    { name: "查看 Watchdog（看门狗）", command: "Get-ScheduledTaskInfo TimeAudit_Watchdog", purpose: "确认外部恢复任务最近结果，不读遥测正文载荷。" },
    { name: "源码回归", command: ".venv\\Scripts\\python.exe -m pytest -q", purpose: "在项目 Python 3.11 生产依赖上临时提供测试 runner，验证运行、入库、仪表盘、备份、FPS 与原生隔离；pytest 不进入生产依赖。" },
    { name: "公开安全聚合", command: "python E:\\Projects\\Tools\\TimeAudit\\pcconfig_anomaly_digest.py --after-utc <UTC> --until-utc <UTC>", purpose: "只返回异常计数、覆盖和建议。" },
    { name: "快速历史诊断", command: "python -B E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py --hours <1-168>", purpose: "一次查询返回覆盖、硬件、有效游戏帧、状态时长、信号与解释限制，供 timeaudit-diagnostics Skill 使用。" },
    { name: "打开剪贴板历史", command: "开始菜单：TimeAudit 剪贴板历史", purpose: "在只读桌面查看器中搜索、筛选、预览和再次复制，不经浏览器或固定端口。" },
    { name: "剪贴板有界验收", command: "pwsh -NoProfile -File E:\\PCConfig\\tools\\Test-TimeAuditClipboardHistory.ps1", purpose: "只读检查三任务、无正文心跳、ACL、schema、计数、适配出口与近线根，不输出历史正文。" },
    { name: "备份 / 恢复预检", command: "powershell -File E:\\Projects\\Tools\\TimeAudit\\backup_all.ps1 ; python E:\\Projects\\Tools\\TimeAudit\\restore_grafana.py --dry-run", purpose: "分层备份，并在实际恢复前验证候选。" }
  ]
};

export const timeAuditModules = [
  {
    slug: "collection-pipeline",
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
    status: "主链运行且 heartbeat 新鲜；定向入库/运行回归通过，原始行本次未读",
    statusTone: "mixed",
    value: "系统会把硬件、进程、前台和生命周期按合适节拍留底，并告诉我数据来自哪条管线、是否估算、哪里有空档。",
    why: "把全进程扫描、传感器和窗口切换塞进一个同步循环会互相阻塞；两条历史管线边界不清又会重复统计。",
    example: "合盖两小时后，主引擎用墙上时间截断睡前会话并重置速率基线；AHK 把睡眠记为区间，醒来不会把两小时算成持续使用或网络尖刺。",
    result: "得到分表保存的硬件、进程、前台、生命周期和使用区间，每层有独立节拍、来源和失败状态。",
    readerStates: {
      pass: "快车道、慢车道、AHK spool 与当前分区持续推进。",
      problem: "单个传感器、扫描或 spool 失败时，只影响对应字段或管线并保留重试证据。",
      unavailable: "数据库或必要权限不可用时停止对应写入，不回填合成成功记录。"
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
      "schema.sql 定义维度、事实、周/月分区、索引与约束。"
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
      "runtime hardening 与 ingest resilience 纳入本次 180 项通过结果。",
      "容器与三条 heartbeat 在观察时持续推进。",
      "未读原始表、未跑完整数据库审计，故保持 mixed。"
    ],
    relation: "为其他模块提供可信时间轴；可靠性监管它，恢复模块保存它。"
  },
  {
    slug: "hardware-performance",
    shortTitle: "硬件与流畅度",
    title: "硬件真值、FPS 回放与前台性能诊断",
    searchAliases: ["游戏卡顿先看摘要还是Grafana", "过去一小时温度磁盘有没有异常", "没有游戏帧是不是采集坏了", "1% Low为什么突然掉", "帧时尖刺和后台压力怎么对齐"],
    searchProjection: {
      intents: ["复盘一次卡顿或掉帧", "查看温度功耗和磁盘压力", "判断没有游戏帧是否正常", "从摘要进入具体时间线深挖"],
      entities: ["timeaudit-diagnostics", "Grafana", "FPS", "1% Low", "frametime", "PresentMon"],
      relations: ["有界 summary 先确认覆盖和方向", "Grafana 再对齐帧时硬件前台与后台", "PresentMon 只接受新鲜一致帧", "no_game_frames 表示没有有效渲染负载"],
      failureRecovery: ["无游戏帧保持 idle 而不报掉帧", "探针掉线只留对应字段空值", "混入旧帧时拒绝性能结论", "摘要覆盖 stale 时先补现场证据"]
    },
    teaser: "组合 NVML、PDH、LibreHardwareMonitor 和 PresentMon，对齐温度、功耗、内存、磁盘、网络、FPS、1% Low 与前台焦点，形成前台卡顿分析。",
    status: "已发布 44a842e 的硬件/FPS 回归与截图可见；6 文件 dirty 候选拟把 LHM 收敛为计划任务单 owner，但尚未发布、激活或做游戏负载 E2E",
    statusTone: "mixed",
    value: "我能先用最长 168 小时的有界 summary（摘要）确认覆盖、硬件、有效游戏帧和压力方向，再在需要具体时刻、程序或曲线时进入 Grafana，把“感觉卡”追到同刻的低帧、帧时、CPU/GPU、磁盘、网络和后台压力。",
    why: "平均 FPS 会掩盖短暂卡顿；混入核显/虚拟显示器会错报显存，跨不同负载比较温度也会制造伪老化。",
    example: "平均 120 FPS 但 1% Low 掉到 30、单帧超过 50ms；瓶颈线显示后台 CPU 争抢而非 GPU 温度墙，于是先处理后台负载。",
    result: "先得到一份覆盖质量、硬件聚合、有效游戏帧、状态时长和解释限制清楚的摘要；若它指出值得深挖，再得到 Grafana 中的硬件时间线、FPS 对比、卡顿标记、CPU/GPU 瓶颈、网络/磁盘压力和同负载散热趋势。摘要不返回具体进程，也不替代大盘。",
    readerStates: {
      pass: "传感器与渲染负载可用时，按同一时刻显示硬件、FPS、帧时和前台关系。",
      problem: "单一来源掉线或越界时保留空值，其他来源继续。",
      unavailable: "无活跃 3D 程序时 FPS 可为空或 0，不造负载。"
    },
    decisionImpact: [
      "先看 1% Low 与帧时，再看平均 FPS。",
      "先用 summary 确认窗口覆盖、有效游戏帧和方向；只有问题需要具体时刻、进程或跨曲线关系时才进 Grafana。",
      "只认 NVIDIA 独显，隔离核显与虚拟显示器。",
      "功耗墙、温度墙、空闲降频分开解释。",
      "只在相似负载下判断散热趋势。"
    ],
    problem: "解决平均值遮蔽卡顿、GPU 混淆、探针故障级联、FPS 归属错误和伪老化趋势。",
    implementation: [
      "已发布 44a842e 的 hardware_worker 组合 NVML、PDH、LHM 与 PresentMon，并仍可能在 LHM 端点故障时自行拉起/结束项目实例后退避。",
      "当前 6 文件 dirty 候选删除 hardware_worker 的 LHM 进程控制，只读 18085；候选指定 `LibreHardwareMonitor` 计划任务为唯一运行 owner、`telemetry_watchdog.ps1` 为唯一恢复路径，但尚未发布或激活。",
      "activity_worker 用 NVIDIA vendor id 锁独显 LUID。",
      "Grafana 对齐 FPS、帧时、瓶颈与前台焦点。",
      "数据库会话锁定 Asia/Shanghai 本地日界。"
    ],
    flow: [
      "用 timeaudit-diagnostics 对最短够用窗口做一次有界 summary，先核对 coverage、样本数、最新年龄与最大 gap。",
      "若需要细节，再识别物理 GPU 和传感器并打开对应 Grafana 时间窗。",
      "每秒采硬件、FPS、网络与系统压力，隔离单个探针失败。",
      "按时间桶对齐前台、卡顿、温度、磁盘与网络曲线。",
      "把 summary 的相关信号与大盘细节、Windows 事件、驱动或 PCConfig 现场交叉判断，不由一条阈值直接给根因。"
    ],
    concepts: [
      { term: "1% Low", explanation: "最差 1% 时段帧率，揭示偶发卡顿。" },
      { term: "frametime（帧时）", explanation: "渲染一帧的毫秒数；尖刺会影响手感。" },
      { term: "LUID（图形设备标识）", explanation: "Windows 本机设备身份，用来锁目标独显。" }
    ],
    boundaries: [
      "阈值按当前个人工作站调校，不是通用标准。",
      "能耗/电源轨含估算，不是外部仪器值。",
      "空值不插成传感器真值。"
    ],
    failures: [
      { condition: "LHM 连续不可达", response: "已发布 44a842e 仍会结束/拉起项目实例并退避；dirty 候选改为只留真值字段为空并等待外部计划任务 + telemetry_watchdog 恢复，二者不得混写为同一 active 行为。" },
      { condition: "单个 NVML 调用异常", response: "隔离字段，不清零整块 GPU。" },
      { condition: "无渲染目标", response: "保持 FPS 空闲，不报故障。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\hardware_worker.py", role: "硬件、网络与 PresentMon" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\activity_worker.py", role: "独显与进程 GPU" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboard_contract.py", role: "大盘恢复合同" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboards\\b7d809e5-d072-4d24-ae23-c573bfcabc56__🖥️ 整机硬件能效与系统资源大盘.json", role: "硬件大盘 JSON" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\grafana_dashboards\\addmc8x__🚀 前台交互与流畅度诊断舱.json", role: "流畅度大盘 JSON" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py", role: "一次查询的硬件、有效游戏帧、覆盖与信号聚合" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\TIMEAUDIT_DIAGNOSTIC_SUMMARY_CONTRACT.md", role: "诊断摘要 schema、时间窗和因果边界" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_presentmon_fps_selection.py", role: "FPS 选择回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_grafana_dashboard_contract.py", role: "大盘合同回归" }
    ],
    verification: [
      "PresentMon 选择与 dashboard contract 纳入本次 180 项通过结果。",
      "180 项完整回归证明的是已发布 44a842e，不覆盖随后出现的 6 文件 LHM 单 owner 候选；候选测试文件存在不等于候选已通过、发布或激活。",
      "diagnostic summary provider 合同进入完整回归；一小时真实窗口 coverage=fresh、3615 样本，且 no_game_frames 没有被误报成掉帧。",
      "Grafana 容器运行，授权截图显示真实界面。",
      "本轮已查询 3615 个样本的一小时真实聚合，但未启动游戏且窗口内没有有效游戏帧，因此 FPS E2E 未形成。"
    ],
    relation: "读取采集时间轴并与进程资源对齐；timeaudit-diagnostics 先消费它的有界聚合，必要时再进入 Grafana 深读；可靠性防止探针失败扩散。"
  },
  {
    slug: "process-forensics",
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
    status: "进程采集和未知路径有源码/回归；本次刷新未读取实际进程、标题或连接",
    statusTone: "mixed",
    value: "我能回答“谁刚才闪退、谁在写盘、谁在联网”这类自然问题，但分两步：timeaudit-diagnostics 只先确认窗口覆盖和资源方向，不返回进程名；需要点名时再进入本机 Grafana 的资源盘或取证盘，回看具体程序、启动/退出、提权、退出码与路径。",
    why: "同名进程可来自不同路径，PID 会复用，退出后信息消失；单凭无签名或端口定罪又会误报。",
    example: "我问“刚才哪个程序一直闪退？”摘要先证明这段时间有覆盖并指出同窗资源变化，但不会给出名字；我再把相同时间范围打开到 Grafana 取证盘，看到某程序每几秒 START 后 EXIT、退出码为内存访问异常且同刻内存快速上升。系统给出崩溃链，但不自动删文件或宣判恶意。",
    result: "先得到是否有足够覆盖、是否值得深挖的聚合方向；再按需得到具体进程身份、写盘/联网资源、前后台、生灭、退出码、卡死、签名和提权线索，以及待人工核查列表。当前 Skill 本身不返回进程名，本项目也没有已验收的自然语言逐进程查询入口。",
    readerStates: {
      pass: "进程可访问或已持句柄时，保存身份、资源与真实退出码。",
      problem: "路径、签名或父进程不可读时保留 unknown 并组合其他线索。",
      unavailable: "交互会话不可用时，不把空前台结果冒充正常采集。"
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
      "unknown path 回归纳入本次定向测试并通过。",
      "没有读取任何实际进程、路径、标题或连接。",
      "进程采集、生命周期和未知路径逻辑进入本次完整回归；本轮没有读取实际进程明细，因此产品现场仍保持 mixed。"
    ],
    relation: "把进程事实转成资源与取证视角，并与硬件卡顿时间对齐。"
  },
  {
    slug: "usage-energy",
    shortTitle: "时间与能耗",
    title: "屏幕使用、专注上下文与能耗成本",
    searchAliases: ["今天电脑时间都花在哪", "屏幕使用时间为什么超过查询窗口", "睡眠为什么算进活跃时间", "电脑长期发热耗电怎么复盘", "电费数字是不是插座实测"],
    searchProjection: {
      intents: ["复盘屏幕使用与专注时间", "检查区间重复或跨窗", "估算长期能耗和电费", "区分活跃暂离息屏锁屏睡眠"],
      entities: ["active", "idle", "display-off", "sleep", "focus block", "energy integration"],
      relations: ["区间先裁剪再求并集", "暂离息屏锁屏睡眠从活跃中扣除", "功率点采样积分成能耗", "电价和其他部件功耗属于估算"],
      failureRecovery: ["跨窗口只算交叠部分", "重叠 idle 先合并", "AHK 或 ingester 心跳陈旧先查管线", "来源不可读时不猜作息与费用"]
    },
    teaser: "按正确区间口径汇总前台、暂离、息屏、睡眠、切换、功率和峰谷电价，回答时间花在哪里以及重负载成本。",
    status: "产品与截图可见；本次未读取个人时间线或实际能耗值",
    statusTone: "mixed",
    value: "我能查看活跃、暂离、睡眠、专注和场景能耗结构；具体应用、标题和时长可在有价值时直接展示，不按字段类别一刀切隐藏。",
    why: "区间只按开始时间求和会漏算跨窗睡眠或重复 idle，甚至出现过去一小时开机 1.5 小时；估算也可能被误当账单。",
    example: "睡眠从查询窗前延续进来，系统先裁剪到窗口，再合并重叠 idle，保证活跃时长不超过墙钟。",
    result: "得到开机、活跃、睡眠、专注、切换、应用类别、能耗、电费与趋势，并标明实测/聚合/估算。",
    readerStates: {
      pass: "区间完整且功率可用时，输出不重叠的时间与能耗聚合。",
      problem: "区间重叠、spool 延迟或功率空值时显示缺口。",
      unavailable: "来源不可读时不推断具体应用、标题、作息或费用。"
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
      "功耗点采样积分，其他部件/电价模型标为估算。"
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
      { path: "E:\\Projects\\Tools\\TimeAudit\\使用手册.md", role: "时间/功耗面板说明" }
    ],
    verification: [
      "screen-time-focus、power-cost 等授权截图展示真实界面。",
      "一小时 diagnostic summary 返回 active=2417 秒、idle=1114 秒、recorded coverage=3531 秒、uncovered=69 秒且 cross-state overlap=0；这些是 03:10Z 快照，不是永久使用习惯。",
      "文档记录区间裁剪、并集、空集归零与日界修复。",
      "本轮未重新查询完整个人时长或能耗明细，因此这些数值没有被升级为当前验证事实。"
    ],
    relation: "从采集取得区间/功率，借硬件解释能耗；公开边界由项目总览约束。"
  },
  {
    slug: "runtime-reliability",
    shortTitle: "自愈与正确性",
    title: "单例、心跳、看门狗与长期运行不变量",
    searchAliases: ["采集进程在但没有数据", "采集器假活怎么判断", "Watchdog多久检查一次", "哪个采集组件会被自动重启", "睡眠唤醒后为什么先等一会"],
    searchProjection: {
      intents: ["判断采集器是否假活", "查看 Watchdog 最近恢复结果", "确认三个组件 heartbeat", "排查睡眠恢复后的短暂空档"],
      entities: ["TimeAudit_Watchdog", "main.py heartbeat", "AHK heartbeat", "ingester heartbeat", "bounded backoff"],
      relations: ["进程存在不等于成功推进", "Watchdog 每分钟按精确身份检查三个组件", "睡眠恢复宽限先于重启", "连续故障触发有界退避"],
      failureRecovery: ["native crash 按组件重启", "false alive 由陈旧 heartbeat 发现", "交互会话不可用时不伪造前台采集", "在线状态不覆盖历史缺口"]
    },
    teaser: "用单例、无 payload heartbeat、外部 Watchdog、退避、睡眠宽限和精确身份，把 native 崩溃、假活、探针掉线与数据库重连限制在受影响组件。",
    status: "容器/heartbeat/任务现场可见；180 项运行硬化回归属于已发布 44a842e，LHM 单 owner dirty 候选未发布未激活，也未做完整故障注入",
    statusTone: "mixed",
    value: "系统不因进程仍显示 Running 就假定它工作，而以最近成功写入判断真假健康。",
    why: "native 崩溃会带走进程，进程也可能仍在却停写；仅检查存在会留下静默空档或双写。",
    example: "Python 主调度进程仍在但 heartbeat 超期，Watchdog 过睡眠宽限后只重启主引擎，健康 AHK 与 ingester 不动。",
    result: "得到组件健康、最近成功、恢复动作和退避；恢复不把缺失数据升级为正常。",
    readerStates: {
      pass: "精确组件在线、heartbeat 新鲜、容器健康且任务结果为 0。",
      problem: "死亡、假活、探针或连接故障按组件退避恢复。",
      unavailable: "任务、Docker 或交互会话不可用时明确影响层，不用部分可见性覆盖。"
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
      "runtime_health.py 原子写 heartbeat，并提供路径识别/退避。",
      "telemetry_watchdog.ps1 每分钟查三个组件。",
      "start_all.bat 固定 CRLF、绝对 Python 3.11 和 WorkingDirectory。"
    ],
    flow: [
      "交互用户会话提权启动。",
      "成功循环/事务写 heartbeat。",
      "Watchdog 检查身份、心跳和宽限。",
      "异常只恢复目标，连续故障退避。",
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
      { condition: "LHM 持续故障", response: "已发布 44a842e 仍含 worker 内拉起/结束与退避；dirty 候选拟交给独立计划任务和 telemetry_watchdog 唯一恢复，当前页面不把候选冒充 active。" },
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
      "三条 heartbeat 新鲜、容器运行、ingester healthy、Watchdog 结果 0。",
      "运行与入库回归纳入 180 项通过结果。",
      "该 180 项结果绑定已发布 44a842e；当前 6 文件 dirty 候选中的 LHM owner 测试尚未形成发布或运行时证据。",
      "未主动杀进程、断库或模拟睡眠。"
    ],
    relation: "监管采集和探针持续性；备份模块处理持久恢复。"
  },
  {
    slug: "clipboard-history",
    shortTitle: "剪贴板历史",
    title: "Windows 剪贴板历史、再次复制与增量出口",
    searchAliases: ["刚才复制的内容被覆盖了怎么找回", "怎样搜索以前复制过的网址", "剪贴板历史怎样再次复制", "复制过的文件路径在哪里找", "剪贴板历史采集器是不是还活着", "怎样增量读取电脑剪贴板历史"],
    searchProjection: {
      intents: ["找回被下一次复制覆盖的内容", "按日期类型或关键词搜索复制历史", "把历史记录再次复制到当前剪贴板", "检查剪贴板采集与近线备份状态", "让获准消费者从 checkpoint 继续增量读取"],
      entities: ["WM_CLIPBOARDUPDATE", "clipboard_history.sqlite3", "events / blobs / content_fts", "PersonalOS 剪贴板历史查看器", "timeaudit.clipboard-export.response.v1", "TimeAudit_ClipboardCollector / Watchdog / NearlineBackup"],
      relations: ["Windows 消息事件进入 append-only 事件表", "相同 SHA-256 只复用 blob 而不合并复制事件", "FTS5 为桌面查看器提供全文搜索", "restore marker 把再次复制事件连接回原事件", "adapter 按 observed_at_utc 与 event_id checkpoint 增量导出"],
      failureRecovery: ["锁定或不支持的格式只写无 payload 原因事件", "陈旧无正文 heartbeat 交给独立 Watchdog 恢复", "FTS5 或 schema 不匹配时失败关闭", "SQLite Online Backup 校验后只恢复到空目录", "任务结果或备份根存在不冒充端到端恢复"]
    },
    teaser: "在当前 Windows 交互会话监听新复制，把文本、HTTP(S) URL 和普通文件路径写入带 WAL/FTS5 的私密 SQLite；桌面查看器可搜索与再次复制，版本化出口可增量消费。",
    status: "PCConfig 有界验收通过：collector Running、heartbeat 新鲜、SQLite integrity ok；5168 事件 / 2289 blob / 3376 FTS 行可计数，真机回环和最新近线恢复本次未做",
    statusTone: "mixed",
    value: "当刚复制的段落、网址或文件路径被下一次复制覆盖，我可以在本机按关键词、日期和类型找回，查看完整内容并再次复制；不需要把私人历史放进浏览器或主遥测数据库。",
    why: "Windows 当前剪贴板只保留最新内容，临时资料很容易被覆盖；只存去重文本又会丢掉“复制了几次、何时复制、是否来自历史恢复”的真实事件。",
    example: "我复制了一条长命令，随后为了粘贴文件名把它覆盖了。我打开“TimeAudit 剪贴板历史”，搜索命令中的关键词，确认时间与类型后点“再次复制”；系统保留这次找回与原记录之间的来源关系，原事件也不被覆盖。",
    result: "得到可分页搜索的本机复制历史、完整预览、暂停/继续状态与再次复制；获准的独立消费者还能从上次成功位置继续读取新事件。结果只说明复制被观察到，不说明我阅读、同意、执行或打算使用内容。",
    readerStates: {
      pass: "collector 在当前交互会话监听新事件，heartbeat 新鲜，数据库与 FTS5 可只读查询，查看器可搜索、预览和再次复制。",
      problem: "来源禁止保存、格式不支持、内容过大、剪贴板被占用或更新竞态时，留下不含正文的跳过、缺口或边界原因，不伪造丢失内容。",
      unavailable: "heartbeat 陈旧、schema 不支持、FTS5 缺失、数据库损坏或恢复校验失败时，对应入口明确不可用；不退化为长期全表扫描，也不覆盖现有历史。"
    },
    decisionImpact: [
      "每次复制都是独立事件；相同内容只复用 blobs 正文对象，绝不合并 events 事实。",
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
      "同一内容 SHA-256 映射到一个 blob；每次复制仍生成独立 event_id。再次复制写 `PersonalOS.ClipboardHistory.RestoreV1` marker（标记），只有 marker 与原事件正文一致才记录 lineage。",
      "viewer.pyw 使用 mode=ro 与 query_only=ON，在 Tkinter 桌面窗口按关键词、UTC+8 日期、类型和分页查询；FTS5 缺失时明确失败。",
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
      "增量合同存在不等于下游消费者已上线；本轮只验证无 payload 的 adapter 形状，没有验证实际下游提交。"
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
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\viewer.pyw", role: "本机搜索、预览、暂停与再次复制" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\adapter_stdio.py", role: "版本化 JSON/stdio 只读增量出口" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\backup.py", role: "在线一致备份、校验与空目录恢复" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\PERSONALOS_ADAPTER_CONTRACT.md", role: "source identity、事件映射、checkpoint 与 lineage 合同" },
      { path: "E:\\PCConfig\\tools\\Test-TimeAuditClipboardHistory.ps1", role: "任务、ACL、心跳、schema、计数与无正文 adapter 验收" },
      { path: "E:\\PCConfig\\docs\\recovery\\timeaudit_clipboard_history.md", role: "机器路径类别、三任务、近线备份与恢复顺序" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_clipboard_history.py", role: "模型、存储、查看、lineage、adapter 与备份回归" }
    ],
    verification: [
      "Source（源码）：已发布 44a842e 包含完整 clipboard_history 实现与合同；当前 6 个 dirty 文件均不在该目录或 test_clipboard_history.py。",
      "Tests（测试）：本任务使用 Python 3.11 `-B -m unittest -v test_clipboard_history.py`，11 项全部通过，用时 2.381 秒；单元测试包含 SQLite Online Backup 到空目录的合成读回。",
      "Runtime（运行）：PCConfig 无正文验证 status=passed；collector Running、watchdog/nearline task Ready、heartbeat age 2496 ms、state=running、integrity=ok、schema v1，5168 events / 2289 blobs / 3376 FTS rows。",
      "Contract（合同）：adapter 返回 timeaudit.clipboard-export.response.v1、source profile `src.timeaudit.windows_clipboard`、1 个事件且 payload_absent=true；这验证接口形状，不验证实际下游消费。",
      "Gap（缺口）：本次未运行会写入唯一合成内容的 smoke_test.py，未把最新 G 盘副本恢复到空目录，也未验收实际下游 writer；不能声称真机 lineage 或端到端灾难恢复已经完成。"
    ],
    relation: "这是与 PostgreSQL/Grafana 主时间线并列的独立产品轴；PCConfig 只拥有机器路径、ACL、三任务、快捷方式、Watchdog 与近线恢复，TimeAudit 拥有采集语义、SQLite schema、查看器与增量合同。它不依赖其他模块，但可把获准的版本化事件交给独立消费者。"
  },
  {
    slug: "backup-recovery",
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
    status: "每日备份最近结果 0，备份/恢复定向测试通过；未从最新 dump 做隔离整库恢复",
    statusTone: "mixed",
    value: "无论是新电脑第一次装、换机要带走历史，还是重装 / 硬盘更换后从备份回来，我都能沿同一条可验收旅程恢复到真正可用：运行环境、数据库、Grafana、自动任务、心跳、入库、聚合查询和浏览器大盘逐层回读，而不是看见几个文件就说完成。",
    why: "全新空库与带历史恢复不是同一动作：前者需要 `schema.sql` 建表，后者应从 PostgreSQL dump 恢复并让 dump 自带结构，两者不能机械叠加。数据库卷、Grafana 二进制库和 JSON 的一致性风险也不同；直接复制整个项目树会夹带 `.venv`、运行卷和旧机器状态。现有 `快速部署.md` 仍有“复制整个树”“历史数据零丢失”和 Watchdog 每 5 分钟等漂移说法，不能继续当现行命令。",
    example: "新机没有历史时，我安装 WSL / Docker，取得当前项目源码，用 `setup_runtime.ps1` 重建项目 `.venv`，拉起 PostgreSQL、ingester、Grafana 三容器并执行 `schema.sql`。如果是带历史换机，则前半段相同，但空库不再先建表，而是校验并恢复选定 dump；随后恢复固定 Grafana 数据源与 dashboard，重建 AutoStart、Watchdog、DailyBackup，直到 heartbeat 推进、数据入库、摘要可查、浏览器大盘能读。",
    result: "得到一份按场景可复述的安装 / 恢复结果：源码和项目 `.venv` 已重建，三容器状态明确，空库建表或 dump restore 的唯一选择有记录，Grafana 数据源与 dashboard 可读，TimeAudit_AutoStart、TimeAudit_Watchdog、TimeAudit_DailyBackup 已接回，三条 heartbeat、真实入库、有界聚合和浏览器大盘逐层验收；备份之后到故障时刻之间的历史缺口、未恢复项和本轮未做的最新 dump 隔离整库恢复仍单独列出。",
    readerStates: {
      pass: "选定场景、源码、运行环境和恢复来源都明确时，完成环境、数据库、Grafana、任务与数据链验收；只有每层回读通过才称该层恢复。",
      problem: "dump 不可读、空库动作选错、数据源 / dashboard 合同失败、任务漂移、heartbeat 不前进或摘要无覆盖时停在对应层，保留已完成结果和旧备份。",
      unavailable: "备份介质、Docker、数据库、账号因子或当前源码不可用时，只建立能安全建立的空环境并标明历史不可恢复；不删除旧备份、不复制可疑运行卷、不声称零丢失。"
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
      "README 记录当前 `.venv`、每 1 分钟 Watchdog 与运行链；`快速部署.md` 的整树复制、零丢失和每 5 分钟说法是待 Owner 修订的旧说明。"
    ],
    flow: [
      "先选场景：全新安装没有历史、换机需要带历史，或灾后 / 重装 / 硬盘更换从备份恢复；记录最后可靠备份与预期历史缺口。",
      "安装或确认 WSL2 与 Docker Desktop，取得现行项目源码，运行 `pwsh -File .\\setup_runtime.ps1` 重建项目 `.venv`。",
      "准备凭据后以 compose 拉起 PostgreSQL、audit-ingester、Grafana 三容器，并确认容器身份与 health。",
      "数据库二选一：全新空库执行 `schema.sql`；带历史或灾后候选先校验 dump，再恢复到干净目标库，不额外走空库建表路线。",
      "确认 Grafana 固定 PostgreSQL datasource，再用合同通过的 JSON 或完整 Grafana 备份恢复 dashboard，并在浏览器打开 `http://localhost:53000`。",
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
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_sql_partition_explain.py", role: "分区查询审计" }
    ],
    verification: [
      "DailyBackup 最近结果为 0。",
      "备份、恢复与大盘合同纳入定向测试并通过。",
      "README 与 setup_runtime.ps1 当前证明运行环境应在目标机重建、Watchdog 为每分钟检查；它们不证明某次换机已经完成。",
      "未从最新 dump 做隔离 pg_restore，也未完整走三场景任一真实换机旅程，恢复 E2E 仍缺。"
    ],
    relation: "先重建采集模块的运行与存储底座，再恢复硬件、进程、时间和可视化所需历史；可靠性模块接回 AutoStart / Watchdog，最终由 heartbeat、入库、聚合和浏览器大盘共同验收。"
  }
];

export const project = timeAuditProject;
export const modules = timeAuditModules;
