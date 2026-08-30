export const timeAuditProject = {
  order: 5,
  slug: "timeaudit",
  title: "TimeAudit",
  route: "/projects/timeaudit",
  visibility: "公开仓库",
  statusTone: "mixed",
  cardStatus: "本机时间线持续采集，可回放性能、进程、功耗和使用时间",
  cardStatusTone: "pass",
  snapshotBoundary: "采集与大盘现场已核对；本次没有有效游戏帧、完整数据库审计或最新整库恢复演练",
  repositoryNote: "源码位于 PUBLIC（公开）GitHub 仓库。进程名、路径、命令行、窗口标题、时间、遥测、机器与网络指标不因字段类型自动保密；本页可在有用时公开这些技术事实。只有实际包含个人敏感正文或密码、令牌、密钥、恢复码等凭据的具体值才隐藏。原始全库不镜像进网页，是因为体积、噪声和解释边界。",
  summary: "TimeAudit 给这台 Windows 工作站留下一条可以回放的本机时间线。问题发生后，只要给出大致时刻——例如“昨晚游戏为什么突然卡了两秒”——它就把流畅度、硬件压力、磁盘和网络、前后台程序以及程序生灭放到同一条时间轴上，返回有证据的候选原因、数据空档和不能下结论的部分。它也能复盘长期发热、耗电和屏幕使用时间。",
  why: "任务管理器只能看此刻，卡顿、过热、异常写盘和闪退等问题发现时现场常已消失。TimeAudit 留下同一时刻的硬件压力、前后台资源、窗口焦点和生命周期，使偶发故障可事后定位，长期散热、功耗和使用习惯也能比较。",
  plainExample: "例如我问“昨晚游戏卡了两秒，是显卡、磁盘还是后台程序？”我把时间框到那两秒，对齐 FPS、1% Low（最差 1% 时段帧率）、单帧时间、CPU/GPU 压力、磁盘延迟和前后台争抢，得到有时间依据的候选原因，而不是凭印象重启。",
  result: "我得到一套只读本机诊断面：能回看整机与进程状态、估算能耗、复盘使用时间、检查程序启动与退出，并知道数据是否仍在采、哪些字段只是估算、哪层证据还缺失。需要快速历史判断时，timeaudit-diagnostics Skill 通过一次有界查询返回覆盖、聚合、信号和因果限制；它不自动结束进程或修改系统。",
  readerStates: {
    pass: "采集器、两条数据管线、数据库和大盘在线时，按所选时间窗返回可对齐的硬件、进程、前台与生命周期视图；无正文 heartbeat（心跳）证明链路继续推进。",
    problem: "发现采样空档、指标越界、后台争抢、崩溃或查询口径异常时，指出受影响组件与恢复入口，不把异常直接解释成硬件故障或恶意行为。",
    unavailable: "Docker、数据库、大盘、采集器或探针不可用时，仅把对应层标为 Unknown（未验证）并受控恢复；不伪造传感器值，也不读取私人 payload（正文载荷）补报告。"
  },
  heroFacts: [
    { label: "采样节拍", value: "硬件 / FPS / 前台心跳 1 秒；活跃进程 3 秒；慢车道单飞" },
    { label: "存储与展示", value: "PostgreSQL 15（本机 45432）+ Grafana 13.0.2（本机 53000）" },
    { label: "产品范围", value: "6 张仪表盘、78 个面板：性能、流畅度、功耗、取证、资源和使用时间" },
    { label: "运行现场", value: "3 个容器运行；入库器 healthy（健康）；三条无正文心跳新鲜；Watchdog（看门狗）上次结果 0" },
    { label: "源码与回归", value: "PUBLIC（公开）main（默认主分支）=a5a34d61360e52c1d019833eaa424f82ba06abcb；工作树干净；45 项 Python 定向回归 + 12 项 provider 单元测试 + 2 项子测试通过" },
    { label: "本次缺口", value: "诊断摘要最长 168 小时且仅聚合；本次无有效游戏帧，也未做完整数据库审计或整库恢复演练" }
  ],
  gallery: [
    { src: "/media/timeaudit/dashboard-catalog.png", thumbnail: "/media/timeaudit/thumbs/dashboard-catalog.webp", alt: "TimeAudit 六张仪表盘目录", caption: "六张仪表盘把整机性能、流畅度、功耗、取证、后台资源和使用时间组成可回放的产品全貌。" },
    { src: "/media/timeaudit/screen-time-focus.png", thumbnail: "/media/timeaudit/thumbs/screen-time-focus.webp", alt: "屏幕使用时间与专注复盘", caption: "复盘屏幕使用、专注上下文、最近切换以及关机、睡眠和暂离边界；图中的应用、标题与时长按真实界面保留。" },
    { src: "/media/timeaudit/power-cost.png", thumbnail: "/media/timeaudit/thumbs/power-cost.webp", alt: "TimeAudit 功耗与电费诊断界面", caption: "把 CPU、GPU、其他部件、峰谷时段和电费估算放在同一视图，定位高耗能场景。" },
    { src: "/media/timeaudit/hardware-long-term.png", thumbnail: "/media/timeaudit/thumbs/hardware-long-term.webp", alt: "整机硬件与长期趋势", caption: "同看温度、功率、频率、降频原因和同负载散热趋势，区分一次高负载与持续退化。" },
    { src: "/media/timeaudit/fps-stutter.png", thumbnail: "/media/timeaudit/thumbs/fps-stutter.webp", alt: "FPS 与微观卡顿回放", caption: "把 FPS、1% Low、单帧渲染时间和微观卡顿放在同一轴，捕捉平均帧率正常时的瞬时问题。" },
    { src: "/media/timeaudit/foreground-stutter-analysis.png", thumbnail: "/media/timeaudit/thumbs/foreground-stutter-analysis.webp", alt: "前台应用卡顿与瓶颈分析", caption: "比较前台应用 FPS 和卡顿标记，并用 CPU / GPU 瓶颈时间线定位限制侧。" },
    { src: "/media/timeaudit/foreground-timeline.png", thumbnail: "/media/timeaudit/thumbs/foreground-timeline.webp", alt: "前台焦点与卡顿时间线", caption: "把微观卡顿与前台焦点对齐，回看问题发生时正在使用什么，并保留截图当时可见的真实应用上下文。" },
    { src: "/media/timeaudit/system-pressure.png", thumbnail: "/media/timeaudit/thumbs/system-pressure.webp", alt: "系统压力与上下文切换", caption: "对齐用户态调度抖动、上下文切换、内存和磁盘延迟，解释整机为什么不跟手。" },
    { src: "/media/timeaudit/resource-usage.png", thumbnail: "/media/timeaudit/thumbs/resource-usage.webp", alt: "资源大户与后台负载", caption: "按 CPU、GPU、内存、显存、磁盘和网络聚合排行，区分前台负载与后台活动。" },
    { src: "/media/timeaudit/process-forensics.png", thumbnail: "/media/timeaudit/thumbs/process-forensics.webp", alt: "进程取证与安全审计", caption: "用签名、提权、生命周期、退出码和路径异常提供线索；告警需要人工核查。" },
    { src: "/media/timeaudit/storage-scale.png", thumbnail: "/media/timeaudit/thumbs/storage-scale.webp", alt: "存储吞吐与数据库规模", caption: "展示写密集时序系统的吞吐和分区规模，判断长期保留、查询与恢复成本。" }
  ],
  productPrinciples: [
    { title: "先问什么时候发生", detail: "时间窗口是诊断入口；先定位问题时刻，再决定需要哪些硬件、进程、前台和生命周期证据。" },
    { title: "多种信号必须对齐解释", detail: "单个温度、帧率或磁盘尖峰不能直接给根因，只有同一时间轴上的关系才形成候选解释。" },
    { title: "空白也有不同原因", detail: "没有游戏帧、没有采到和采集器故障是三种状态，不能都显示成零或正常。" },
    { title: "实测、估算、推导和未知分开", detail: "能耗、电费、签名风险和因果判断都有边界，界面必须说明每个值来自哪里、能证明什么。" },
    { title: "先看有界摘要，再决定是否深挖", detail: "快速查询先确认覆盖和方向，只有真正需要时才进入详细大盘，不让每次诊断都临时拼查询。" },
    { title: "只记录和解释，不自动处置", detail: "项目不结束进程、不修改系统，也不把相关性、异常路径或无签名直接升级成安全结论。" },
    { title: "运行健康不等于数据真理", detail: "心跳证明链路继续推进，不证明每个传感器值正确，也不证明历史没有空档。" },
    { title: "备份成功不等于恢复完成", detail: "数据库、面板和任务都要在隔离环境恢复并回读结果，不能用备份任务退出码冒充可恢复。" }
  ],
  responsibilities: [
    "在本机连续采集硬件、FPS、活跃进程、前台上下文和进程生命周期",
    "用 PostgreSQL 分区表保存点采样与区间事件，并控制长期写入和查询成本",
    "用 Grafana 提供面向实际问题的诊断盘，而不是只堆原始指标",
    "区分真实传感器、估算、空值、点采样和区间事件，避免口径混写",
    "用 heartbeat（心跳）、Watchdog（看门狗）、备份和恢复维持长期可用",
    "提供机器配置异常增量与个人历史诊断两个有界聚合入口，让调用方快速取得可解释证据而不临时拼 SQL"
  ],
  exclusions: [
    "不自动结束进程、封禁网络、修改系统或把告警升级为安全结论",
    "不作为企业多机监控、远程管理、云端数据平台或告警推送服务",
    "不把连接占比分摊写成精确网络归因，也不把用户态抖动冒充内核 DPC 延迟",
    "不把无活跃 3D 负载时的 FPS 空值自动解释成采集故障",
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
    { term: "fail-closed（失败关闭）", meaning: "来源、版本或证据不一致时停止覆盖和恢复，不猜可用结果。" },
    { term: "diagnostic summary（诊断摘要）", meaning: "在最长 168 小时的窗口内用一次聚合查询返回覆盖、硬件、游戏帧、电脑状态、阈值信号和解释边界。" },
    { term: "E2E（端到端验证）", meaning: "真实采集、写库、查询到用户看图完整走通；源码测试不能替代。" }
  ],
  currentState: {
    observedAt: "2026-08-30T03:10:59Z",
    label: "PUBLIC main、运行链、两类聚合 provider 与定向回归均有新鲜证据；完整数据库审计和恢复本次未验",
    facts: [
      "Git Owner 确认 wlyaaaaa/TimeAudit 为 PUBLIC（公开），默认 main（默认主分支）；刷新远端引用后，观察时 HEAD 与 origin/main 均为 a5a34d61360e52c1d019833eaa424f82ba06abcb，工作树干净。",
      "audit-postgres、audit-ingester、audit-grafana 三个容器运行；入库器健康状态为 healthy（健康），PostgreSQL 为本机 45432，Grafana 13.0.2 为本机 53000。",
      "遥测主链、AHK 与入库器三条无正文 heartbeat（心跳）在 02:30Z 附近刷新，观察时文件年龄约 1–2 秒；Watchdog（看门狗）与每日备份任务最近结果均为 0。",
      "在干净的当前 main 中，用项目实际 Python 3.11 运行运行硬化、入库、仪表盘合同、备份恢复、PresentMon 和未知路径定向回归：45 项与 2 项子测试通过；新的 diagnostic summary provider 另有 12 项单元测试全部通过。",
      "公开安全聚合 provider（提供器）在 01:00Z—02:00Z 返回 status=ok（状态正常）、coverage=fresh（覆盖新鲜）、3530 个样本；1 个 scheduler_jitter_saturation（用户态调度抖动饱和）warning（警告）涉及 110 个样本，且 projection_recheck_recommended=false（不建议重查稳定机器投影）。",
      "新的 `timeaudit_diagnostic_summary.py --hours 1` 在 03:10Z 返回 schema=timeaudit.diagnostic-summary.v1、status=ok、coverage=fresh、3590 个硬件样本，最新样本年龄约 0.21 秒、最大空档约 2.98 秒；没有有效游戏帧被正确标为 no_game_frames，当前只有 9 次 packet-loss occurrence warning。",
      "两个聚合回执为了快速、有界而不返回逐行历史、进程或窗口明细；这是 provider（提供器）的接口范围，不代表这些字段类别禁止公开。阈值信号也只表示相关与出现次数，不证明硬件故障、恶意程序或用户意图。"
    ],
    gaps: [
      "本次未查询原始数据库行、窗口标题、实际进程、远端地址或个人统计，不能证明某段具体历史已被正确解释。",
      "未跑完整 test_telemetry_health.py、db_audit.py 或全部 Grafana SQL 执行计划；在线状态不证明字段与查询全绿。",
      "一小时诊断窗口没有有效游戏帧，因此没有 FPS、1% Low 与 frametime 结论；no_game_frames 是有效状态，不是掉帧或采集故障。",
      "diagnostic summary v1 最长查询 168 小时且仅聚合；需要更长趋势或逐进程/路径/窗口明细时，应建立有明确价值并按实际值判断敏感性的另一条路线，不能把缺失字段猜出来。",
      "备份任务结果为 0、定向恢复测试通过，但本次未从最新 dump 和 Grafana 备份做隔离整套恢复。"
    ]
  },
  operatingFlow: [
    { title: "分开两条前台记录", detail: "AHK 记录简版使用区间并经 spool 入库；Python 主引擎写硬件、进程、上下文和生命周期事实。" },
    { title: "按快慢节拍采集", detail: "每 1 秒推进硬件、FPS 与前台心跳；全进程扫描约每 3 秒单飞，过慢时跳过而不积压。" },
    { title: "保留来源差异", detail: "NVML、PDH、LibreHardwareMonitor、PresentMon 与 Win32 各守边界；估算、空值和失败不互相冒充。" },
    { title: "写入分区数据库", detail: "点采样按周/月分区，前台区间另表保存；预热、时区和保留期避免长跑错位。" },
    { title: "先快查，再用问题型大盘回放", detail: "近期事件先由 timeaudit-diagnostics 用一次有界聚合确认覆盖与关键线索；需要更深细节时再框定问题时刻，跨性能、功耗、取证、资源和时间盘对齐证据。" },
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
    { name: "diagnostic summary provider（历史诊断摘要接口）", responsibility: "为 timeaudit-diagnostics Skill 汇总硬件、有效游戏帧、电脑状态、覆盖空档和阈值信号。", implementation: "`--hours 1-168` 或精确 UTC 窗口执行一次 aggregate-only 查询；schema、owner、coverage 与因果限制失败关闭。" }
  ],
  usageExamples: [
    { ask: "刚才游戏为什么卡？", effect: "对齐 1 秒 FPS 采样、1% Low、单帧时间、瓶颈、磁盘和后台争抢。" },
    { ask: "谁在后台写盘或联网？", effect: "按后台程序对齐磁盘和网络趋势，给出最相关程序、时间段和仍缺的归因证据。" },
    { ask: "程序为什么闪退？", effect: "结合退出码、存活时间、父子关系与资源变化形成死因候选。" },
    { ask: "时间都花在哪？", effect: "用前台区间、暂离、睡眠、专注块和切换趋势复盘；窗口标题与时长可按实际价值展示，只隐藏其中真正敏感的具体内容。" },
    { ask: "采集器是不是假活？", effect: "检查三条无正文 heartbeat（心跳）、容器 health（健康状态）和任务状态，再精确恢复组件。" },
    { ask: "过去一小时电脑为什么偶尔卡？", effect: "timeaudit-diagnostics 先用一条聚合查询确认覆盖、硬件、游戏帧和状态时长，再把 occurrence 信号与 Windows、驱动、任务或 PCConfig 现场证据交叉判断。" },
    { ask: "换机或系统损坏后怎么恢复？", effect: "用数据库 dump、Grafana 备份、JSON 和计划任务步骤重建，再验整条链。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码）", proves: "main 定义了采集、表、口径、自愈、备份，以及按实际值判断个人敏感内容与凭据的边界。", doesNotProve: "本机已安装、运行或每个查询正确。" },
    { layer: "Tests（测试）", proves: "45 项 Python 定向回归、12 项 diagnostic provider 单元测试和 2 个子测试覆盖运行、入库、仪表盘合同、备份、FPS、未知路径与聚合摘要边界。", doesNotProve: "真实游戏负载、长期全库性能和任意历史问题的根因。" },
    { layer: "Runtime（运行）", proves: "观察时容器运行、入库器 healthy（健康）、heartbeat（心跳）新鲜、任务结果为 0。", doesNotProve: "样本值正确或历史无空档。" },
    { layer: "Aggregate（聚合）", proves: "PCConfig 摘要窗口有 3530 样本与一个用户态抖动 warning；诊断摘要窗口有 3590 样本、覆盖新鲜、no_game_frames 和 9 次丢包 occurrence。", doesNotProve: "内核 DPC、硬件故障、具体进程原因或持续压力。" },
    { layer: "Gallery / dashboard contract（图片 / 大盘合同）", proves: "11 张获准截图展示真实界面；固定数据源与恢复结构有回归。", doesNotProve: "图片瞬时值可公开推广或全部 SQL 性能达标。" },
    { layer: "Recovery（恢复）", proves: "备份任务最近结果 0，备份与恢复路径有定向测试。", doesNotProve: "本次已从最新备份完成隔离整库恢复。" }
  ],
  evolution: [
    { date: "2026-06-08", commit: "e4c49fd–bf69c85", result: "建立 Windows 遥测、PostgreSQL 数据仓库和多仪表盘，从一次性查看变成可回放黑匣子。" },
    { date: "2026-06-13—06-14", commit: "a303f54–faadf31", result: "修正 GPU、双显卡、CPU 归一化、睡眠/NTP/分区边界，并加入健康测试和每日备份。" },
    { date: "2026-07-03—07-27", commit: "1a0c3a5–6e4c7bd", result: "完善隐藏自启、Watchdog、入库恢复、备份同步和 PresentMon 所有权。" },
    { date: "2026-07-29—08-07", commit: "e677ad6–5f41846", result: "把 FPS 绑定前台渲染进程，加入不含正文的聚合异常接口，并加固采样与取证。" },
    { date: "2026-08-21", commit: "2ec7807–de82db7", result: "修复 spool 并建立 Grafana 13 固定数据源、备份与恢复失败关闭合同。" },
    { date: "2026-08-23—08-24", commit: "2d77616–59ecd01", result: "串行化遥测恢复并加固 FPS 数据库恢复，避免恢复器抢占与空闲误报。" },
    { date: "2026-08-29", commit: "238ea58–a5a34d6", result: "恢复 Grafana 时间轴 transformation、移除大盘硬件型号绑定，并新增一次查询即可消费的有界历史诊断 provider 与 fast path；`.agents` 同步增加 timeaudit-diagnostics Skill。" }
  ],
  operationalEntrypoints: [
    { name: "打开大盘", command: "http://localhost:53000", purpose: "从时间范围进入 6 张诊断盘。" },
    { name: "启动主链", command: "schtasks /run /tn TimeAudit_AutoStart", purpose: "通过交互式提权任务拉起 AHK、Docker 与主引擎。" },
    { name: "查看 Watchdog（看门狗）", command: "Get-ScheduledTaskInfo TimeAudit_Watchdog", purpose: "确认外部恢复任务最近结果，不读遥测正文载荷。" },
    { name: "源码回归", command: "C:\\Users\\10979\\AppData\\Local\\Programs\\Python\\Python311\\python.exe -m pytest -q <selected-tests>", purpose: "使用实际 Python 3.11 验证运行、入库、仪表盘、备份和 FPS。" },
    { name: "公开安全聚合", command: "python E:\\Projects\\Tools\\TimeAudit\\pcconfig_anomaly_digest.py --after-utc <UTC> --until-utc <UTC>", purpose: "只返回异常计数、覆盖和建议。" },
    { name: "快速历史诊断", command: "python -B E:\\Projects\\Tools\\TimeAudit\\timeaudit_diagnostic_summary.py --hours <1-168>", purpose: "一次查询返回覆盖、硬件、有效游戏帧、状态时长、信号与解释限制，供 timeaudit-diagnostics Skill 使用。" },
    { name: "备份 / 恢复预检", command: "powershell -File E:\\Projects\\Tools\\TimeAudit\\backup_all.ps1 ; python E:\\Projects\\Tools\\TimeAudit\\restore_grafana.py --dry-run", purpose: "分层备份，并在实际恢复前验证候选。" }
  ]
};

export const timeAuditModules = [
  {
    slug: "collection-pipeline",
    shortTitle: "采集与数据流",
    title: "双节拍采集、两条前台管线与分区写入",
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
      "runtime hardening 与 ingest resilience 纳入本次 45 项通过结果。",
      "容器与三条 heartbeat 在观察时持续推进。",
      "未读原始表、未跑完整数据库审计，故保持 mixed。"
    ],
    relation: "为其他模块提供可信时间轴；可靠性监管它，恢复模块保存它。"
  },
  {
    slug: "hardware-performance",
    shortTitle: "硬件与流畅度",
    title: "硬件真值、FPS 回放与前台性能诊断",
    teaser: "组合 NVML、PDH、LibreHardwareMonitor 和 PresentMon，对齐温度、功耗、内存、磁盘、网络、FPS、1% Low 与前台焦点，形成前台卡顿分析。",
    status: "硬件采集与 FPS 选择有源码/回归；真实截图可见，本次未跑游戏负载 E2E",
    statusTone: "mixed",
    value: "我能从“感觉卡”追到同刻的低帧、帧时、CPU/GPU、磁盘、网络和后台压力。",
    why: "平均 FPS 会掩盖短暂卡顿；混入核显/虚拟显示器会错报显存，跨不同负载比较温度也会制造伪老化。",
    example: "平均 120 FPS 但 1% Low 掉到 30、单帧超过 50ms；瓶颈线显示后台 CPU 争抢而非 GPU 温度墙，于是先处理后台负载。",
    result: "得到硬件时间线、FPS 对比、卡顿标记、CPU/GPU 瓶颈、网络/磁盘压力和同负载散热趋势。",
    readerStates: {
      pass: "传感器与渲染负载可用时，按同一时刻显示硬件、FPS、帧时和前台关系。",
      problem: "单一来源掉线或越界时保留空值，其他来源继续。",
      unavailable: "无活跃 3D 程序时 FPS 可为空或 0，不造负载。"
    },
    decisionImpact: [
      "先看 1% Low 与帧时，再看平均 FPS。",
      "只认 NVIDIA 独显，隔离核显与虚拟显示器。",
      "功耗墙、温度墙、空闲降频分开解释。",
      "只在相似负载下判断散热趋势。"
    ],
    problem: "解决平均值遮蔽卡顿、GPU 混淆、探针故障级联、FPS 归属错误和伪老化趋势。",
    implementation: [
      "hardware_worker 组合 NVML、PDH、LHM 与 PresentMon。",
      "activity_worker 用 NVIDIA vendor id 锁独显 LUID。",
      "Grafana 对齐 FPS、帧时、瓶颈与前台焦点。",
      "数据库会话锁定 Asia/Shanghai 本地日界。"
    ],
    flow: [
      "识别物理 GPU 和传感器。",
      "每秒采硬件、FPS、网络与系统压力。",
      "隔离单个探针失败。",
      "按时间桶对齐前台和卡顿。"
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
      { condition: "LHM 连续不可达", response: "只恢复本项目实例并退避；真值字段为空。" },
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
      "PresentMon 选择与 dashboard contract 纳入 45 项定向通过结果。",
      "diagnostic summary provider 的 12 项 unittest 通过；一小时真实窗口 coverage=fresh、3590 样本，且 no_game_frames 没有被误报成掉帧。",
      "Grafana 容器运行，授权截图显示真实界面。",
      "未启动游戏或查询真实时序值，FPS E2E 仍 Unknown。"
    ],
    relation: "读取采集时间轴并与进程资源对齐；timeaudit-diagnostics 先消费它的有界聚合，必要时再进入 Grafana 深读；可靠性防止探针失败扩散。"
  },
  {
    slug: "process-forensics",
    shortTitle: "进程与取证",
    title: "进程资源、生命周期与有边界的取证线索",
    teaser: "保存进程资源、签名、提权、父进程、START / EXIT、退出码和卡死状态，回答谁占资源、谁闪退、哪些信号需人工核查。",
    status: "进程采集和未知路径有源码/回归；本次刷新未读取实际进程、标题或连接",
    statusTone: "mixed",
    value: "我能回看哪类程序占资源、何时启动/退出、是否提权、退出码是什么，而不只知道“电脑很忙”。",
    why: "同名进程可来自不同路径，PID 会复用，退出后信息消失；单凭无签名或端口定罪又会误报。",
    example: "程序每几秒 START 后 EXIT，退出码为内存访问异常，同刻内存快速上升。系统给出崩溃链，但不自动删文件或宣判恶意。",
    result: "得到进程身份、资源、前后台、生灭、卡死、签名和提权线索，以及待人工核查列表。",
    readerStates: {
      pass: "进程可访问或已持句柄时，保存身份、资源与真实退出码。",
      problem: "路径、签名或父进程不可读时保留 unknown 并组合其他线索。",
      unavailable: "交互会话不可用时，不把空前台结果冒充正常采集。"
    },
    decisionImpact: [
      "高占用与恶意分开判断。",
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
      "取得进程快照与身份。",
      "计算资源速率并标记卡死。",
      "比较基线生成 START / EXIT。",
      "按时间窗聚合资源与待核查信号。"
    ],
    concepts: [
      { term: "process key（进程档案键）", explanation: "稳定关联身份，不能只用会复用的 PID。" },
      { term: "signature（数字签名）", explanation: "发布者完整性线索；无签名不等于恶意。" },
      { term: "LOLBins（系统工具滥用线索）", explanation: "系统工具与可疑参数组合，需要上下文。" }
    ],
    boundaries: [
      "提供取证线索，不是杀毒或阻断系统。",
      "网络速率近似分摊，远端信息可能不完整。",
      "字段类型不构成 blanket ban（整类禁令）；实际进程、路径、命令行、IP 和标题可在有用且具体值不含个人敏感正文或凭据时公开。"
    ],
    failures: [
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
      "更广泛进程测试本次未全跑，故保持 mixed。"
    ],
    relation: "把进程事实转成资源与取证视角，并与硬件卡顿时间对齐。"
  },
  {
    slug: "usage-energy",
    shortTitle: "时间与能耗",
    title: "屏幕使用、专注上下文与能耗成本",
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
      "具体标题和个人统计只在本机显示。"
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
    teaser: "用单例、无 payload heartbeat、外部 Watchdog、退避、睡眠宽限和精确身份，把 native 崩溃、假活、探针掉线与数据库重连限制在受影响组件。",
    status: "容器/heartbeat/任务现场可见，运行硬化回归通过；未做完整故障注入",
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
      { condition: "LHM 持续故障", response: "只重启本项目实例并退避。" },
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
      "运行与入库回归纳入 45 项通过结果。",
      "未主动杀进程、断库或模拟睡眠。"
    ],
    relation: "监管采集和探针持续性；备份模块处理持久恢复。"
  },
  {
    slug: "backup-recovery",
    shortTitle: "存储与恢复",
    title: "分区规模、备份同步与灾难恢复",
    teaser: "分层保存时序数据库、Grafana 状态、dashboard JSON 和任务；备份拒绝脏改/分叉，恢复只接受固定数据源与完整结构。",
    status: "每日备份最近结果 0，备份/恢复定向测试通过；未从最新 dump 做隔离整库恢复",
    statusTone: "mixed",
    value: "我能知道数据在哪、占多少、哪份能恢复；换机或损坏时不靠复制可能未干净关闭的数据卷碰运气。",
    why: "数据库卷、Grafana 二进制库和 JSON 的一致性风险不同；直接覆盖会倒退 UI，自动 Git 也可能夹带脏改。",
    example: "每日备份先取 Grafana 一致快照并导出 JSON，再检查仓库、运行实例与远端；脏改、落后或分叉即失败关闭。",
    result: "得到数据库 dump、Grafana 备份、可审计 JSON、轮转、预检和安装/迁移/容灾步骤。",
    readerStates: {
      pass: "来源一致、合同有效、目标可写且远端未分叉时生成并回读备份。",
      problem: "脏改、版本落后、分叉、非法 JSON 或退役 UID 时停止并保留原因。",
      unavailable: "介质、Docker 或数据库不可用时不删旧备份、不覆盖现状。"
    },
    decisionImpact: [
      "数据库 dump 优先于运行中数据目录复制。",
      "二进制库保存完整状态，JSON 提供版本化恢复。",
      "只接受精确 .json，不导入 .json.bak。",
      "任务结果 0 不替代隔离恢复。"
    ],
    problem: "解决长期膨胀、备份夹带、Git 分叉、运行实例倒退、数据源失配和未经演练的恢复自信。",
    implementation: [
      "schema/main 管周/月分区、预热和 1200 天默认保留。",
      "backup_db 用 pg_dump；backup_grafana 用一致快照导出 JSON。",
      "restore_grafana 只接受合同通过的 JSON，并支持 dry-run。",
      "DailyBackup 每天 20:40 组合备份并轮转 14 份。"
    ],
    flow: [
      "检查来源、目标和仓库。",
      "生成数据库 dump 与 Grafana 快照。",
      "导出并验证 JSON/UID/matcher。",
      "定向提交并正常推送回读。",
      "恢复先 dry-run，再导入并验全链。"
    ],
    concepts: [
      { term: "dump（逻辑备份）", explanation: "由 PostgreSQL 生成、可校验恢复的文件。" },
      { term: "consistent snapshot（一致快照）", explanation: "同一事务视图读取 Grafana SQLite。" },
      { term: "dry-run（预检）", explanation: "只发现和验证，不修改运行实例。" }
    ],
    boundaries: [
      "数据库和二进制备份不进入 PUBLIC Git。",
      "Git JSON 不等于完整数据库或用户状态。",
      "无恢复回读不能称灾难恢复完成。"
    ],
    failures: [
      { condition: "JSON 有人工脏改", response: "失败关闭，不覆盖或夹带。" },
      { condition: "退役 UID / matcher 缺失", response: "合同失败，不能恢复。" },
      { condition: "远端领先或分叉", response: "不 push、不 force-push，保留本地备份。" }
    ],
    sources: [
      { path: "E:\\Projects\\Tools\\TimeAudit\\schema.sql", role: "表、分区与索引" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\docker-compose.yml", role: "数据库、ingester 与 Grafana" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\backup_all.ps1", role: "组合备份" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\backup_db.ps1", role: "数据库 dump" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\backup_grafana.py", role: "Grafana 导出与同步" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\restore_grafana.py", role: "验证与恢复" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\快速部署.md", role: "安装、迁移与容灾" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_backup_all_script.py", role: "备份回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_restore_grafana.py", role: "恢复回归" },
      { path: "E:\\Projects\\Tools\\TimeAudit\\test_sql_partition_explain.py", role: "分区查询审计" }
    ],
    verification: [
      "DailyBackup 最近结果为 0。",
      "备份、恢复与大盘合同纳入定向测试并通过。",
      "未从最新 dump 做隔离 pg_restore，恢复 E2E 仍缺。"
    ],
    relation: "保存其他模块的数据与可视化，并提供迁移/回滚。"
  }
];

export const project = timeAuditProject;
export const modules = timeAuditModules;
