import { createProjectSnapshot } from "./project-snapshot.js";

const sunshineRemoteStreamingSnapshot = createProjectSnapshot({
  observedAt: "2026-09-04",
  label: "Sunshine 与 Tailscale 服务和捕获守护任务在线；每日巡检最近一次返回 0。当前启动周期的 GPU 稳定门已阻断配置修复，本轮没有发起手机串流、显示器插拔或断电开机验收",
  boundary: "这是 PRIVATE（私有）源码、2026-09-03 23:30 每日巡检和 2026-09-04 现场只读回读的合并快照。服务在线、配置存在、编码能力和自动化测试都不能替代手机端到端串流、当前 peer（对端）直连、弱网、物理故障转移或冷开机实测",
  metrics: [
    { label: "物理主屏 / VDD（虚拟显示器）配置目标", value: "4K 240Hz / 2880×1800 HDR（高动态范围）" },
    { label: "文档上行依据 / 客户端起点", value: "约 32 Mbps / CBR（恒定码率）18–20 Mbps" },
    { label: "AV1 证据", value: "主机端能力已回读 / 手机协商未实测" },
    { label: "源码隔离测试", value: "4 套测试（101+ 断言）全部通过" }
  ],
  facts: [
    { label: "它真正解决的事", value: "为 RTX 5090 D + Ryzen 9 9950X3D 主机提供一套 Sunshine 运维层：识别应该捕获哪块屏、在主屏确实离线时规划 VDD 兜底、把漂入虚拟屏的普通窗口拉回，并把网络、编码与远程开机问题拆成可诊断的步骤。" },
    { label: "主屏优先与 VDD 兜底", value: "实现约定是 4K 240Hz 活动物理主屏优先，主屏正常时不改它的分辨率或排列。只有物理主屏稳定缺失 15 秒且串流连续空闲 5 秒时，守护器才允许把捕获目标切到唯一健康的 2880×1800 HDR MTT1337 VDD（虚拟显示驱动）并迁移普通窗口；本轮没有用真机连接或拔线验证这条生产路径。" },
    { label: "应急固定 VDD 不是日常模式", value: "Set-SunshineHeadlessConfig.ps1 只在本人明确决定暂时固定 VDD 时使用。默认只生成候选；-Apply 前再次核对唯一 VDD，再原子替换 7 个受管配置键并留下备份。它不重启 Sunshine、不做写后回读，也不证明手机看见画面；恢复日常使用要重新运行主屏优先守护。" },
    { label: "当前捕获配置不一致", value: "2026-09-04 只读选择器只找到一个健康 VDD，但现役 sunshine.conf 的 output_name 与该 VDD、也与当时所有活动输出都不匹配；旧状态文件仍为 Mode=Vdd、PendingTargetKind=Physical。修复范围已经正规接管，但当前启动周期有 22 条匹配的 WER 图形故障记录，GPU 稳定门拒绝写入，因此配置和服务保持原样。" },
    { label: "严禁拓扑联动与镜像", value: "不使用 Windows“复制显示器”，不开启 Sunshine 的 ensure_only_display（仅确保单显示器）或自动分辨率改写；VDD 参数与物理主屏分开，避免本项目因多屏联动增加黑屏或显卡驱动故障风险。" },
    { label: "水冷屏与机箱屏保护", value: "LIAN LI（联力）水冷屏与 HS2 机箱屏是本项目的禁止目标与禁止区域：捕获选择和本项目发起的窗口迁移动作不选它们。Windows 或其他应用自行放置窗口不在这项代码保证内。" },
    { label: "GPU（图形处理器）稳定性故障关闭", value: "若当前系统启动已记录 Kernel-Power 41、BugCheck、nvlddmkm 或匹配的 WER 1001/1019 图形故障事件，系统进入 BlockedByGpuStability（因 GPU 不稳定阻断）状态，停止捕获源修改、模式切换与主屏到 VDD 的窗口迁移，只允许经严格验证的单向拉回主屏。用户实际看到黑屏或整机卡死时同样应停止操作，不能靠事件查询冒充视觉检测。" },
    { label: "传输层与直连证据", value: "Sunshine/Moonlight 串流层与 Tailscale 传输层可以分别替换和诊断。当前 Tailscale 为 Running（运行中）、online（在线）、unattended（无人值守）且本机网络探针报告 IPv6 可用；每日任务没有传入手机 peer，因此当前究竟是 IPv6 直连还是 DERP（中继服务器）仍未验证。" },
    { label: "受限上行带宽建议", value: "README 以约 32 Mbps 上行为依据，建议手机客户端先从 CBR（恒定码率）18–20 Mbps 起步，并为 FEC（前向纠错）与音频留余量。这是配置建议，不是主机强制策略；本轮没有串流遥测证明 24.5 Mbps 峰值、无丢包或不卡顿。" },
    { label: "AV1 能力与真实协商", value: "RTX 5090 D 与小米 15 Pro 骁龙 8 Elite 具备 AV1 硬件能力，Sunshine 回环接口也报告 AV1 Main10（10 位色深配置）；真实会话是否协商到 AV1、画质是否优于 HEVC（高效视频编码），仍要由手机端连接与统计数据确认。" },
    { label: "远程唤醒是方案，不是现成结果", value: "纯无线 Wi-Fi WoWLAN（无线局域网唤醒）不适合作为可靠关机唤醒路径。仓库给出“智能插座 + BIOS 来电自启”与有线 Realtek 2.5GbE WoL（有线网络唤醒）两种选择，但本轮没有读取 BIOS、触发魔术包或做断电上电循环。" },
    { label: "幂等修复与每日巡检", value: "repair-stream.ps1 可在真实网络故障时恢复 IPv6 绑定、清理固定代理端口残留并固化 Tailscale 无人值守偏好；SunshineRemote-VerifyPath-Daily 最近一次自然运行返回 0，但 peer ping（对端探测）被跳过，并提示本机另有用户配置的 Funnel（公网入口），未证明它属于 Sunshine。" }
  ],
  gaps: [
    "配置修复已经取得精确执行范围，但当前 GPU 稳定门为 BlockedByGpuStability；没有执行 -Apply、服务重启或实机串流。",
    "本轮未发起从小米 15 Pro 手机端的真机交互式远程串流连接验收；服务常驻与编码掩码正常不代表真机操控体验。当前巡检也没有指定 peer，不能判断 direct（直连）还是 DERP 中继。",
    "未做拔掉物理显示器线缆或硬件关屏的破坏性 failover（故障转移）真实演练；去抖与窗口迁移由经过验证的 67 项自动化测试保障。",
    "未进行外网断电后通过智能插座远程冷开机的实物验证；WoL 与 AC（交流电）来电自启目前是文档方案，不能称硬件已经就绪。",
    "捕获守护任务显示 Running，但状态文件与日志最后更新于 2026-09-03；它证明任务仍在，不证明循环刚刚完成了一轮健康决策。",
    "每日巡检看到一项用户配置的 Tailscale Funnel 公网入口；当前证据没有把它归因于 Sunshine，也不能把整台主机描述成零公网暴露。"
  ]
});

export const sunshineRemoteStreamingProject = {
  order: 22,
  slug: "sunshine-remote-streaming",
  title: "Sunshine 远程串流",
  kicker: "高性能电脑远程运维层 · 主屏优先与 VDD（虚拟显示器）兜底 · 2026-09-04 核对",
  route: "/projects/sunshine-remote-streaming",
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "服务与任务在线、源码测试通过；捕获目标不匹配且被 GPU 门阻断，手机与硬件 E2E 未测",
  cardStatusTone: "mixed",
  ...sunshineRemoteStreamingSnapshot,
  searchAliases: [
    "sunshine-remote-streaming",
    "Sunshine 远程串流",
    "远程使用高性能电脑",
    "Moonlight 串流",
    "Artemis",
    "MTT1337 VDD",
    "虚拟显示器兜底",
    "Tailscale IPv6 直连",
    "串流不出海",
    "RTX 5090D 远程工作站",
    "CBR 20Mbps",
    "AV1 远程串流",
    "远程开机"
  ],
  searchProjection: {
    intents: [
      "在外用手机低延迟访问家里电脑",
      "避免远程串流把窗口丢进壁纸虚拟屏",
      "保护联力水冷屏不被远程串流抓取",
      "解决移动三层NAT蜂窝网络连不上串流",
      "配置受限32Mbps上行下的最佳画质与码率",
      "选择远程开机方案（智能插座与WoL）",
      "排查Tailscale掉登录与IPv6直连状态",
      "独立调整虚拟显示器分辨率而不影响物理主屏"
    ],
    entities: [
      "Sunshine 2026.516",
      "Moonlight / Artemis",
      "MTT1337 VDD",
      "RTX 5090 D",
      "Ryzen 9 9950X3D",
      "小米 15 Pro（骁龙 8 Elite）",
      "Tailscale 1.102.2",
      "CBR 18-20 Mbps",
      "AV1 / HEVC Main10",
      "Kernel-Power 41 保护",
      "LIAN LI 水冷屏",
      "repair-stream.ps1"
    ],
    relations: [
      "物理主屏在线时Sunshine捕获主屏并拉回漂移窗口",
      "主屏缺失15秒且串流空闲5秒切到VDD并迁入窗口",
      "端到端IPv6让WireGuard UDP在运营商内直连避开DERP",
      "受限上行以CBR和AV1作为手机客户端配置起点",
      "GPU不稳定时失败关闭阻止任何显示拓扑修改"
    ],
    failureRecovery: [
      "物理主屏恢复时窗口自动安全拉回主屏",
      "GPU崩溃后禁止修改拓扑，失败关闭",
      "Tailscale掉登录时清除固定代理端口覆盖并设unattended",
      "避免使用CQP动态码率防止打爆上行",
      "GPU 稳定门阻断时保持只读，不用强行修复扩大故障"
    ]
  },
  repositoryNote: "sunshine-remote-streaming 是 PRIVATE（私有）运维项目。公开页面只保留系统架构、产品逻辑、配置原则与脱敏回执，不包含真实内网 IP、Tailnet（Tailscale 私有网络）名称、设备名称、家庭网段、Funnel 真实端点或任何凭据。",
  summary: "这是给 RTX 5090 D + 9950X3D 台式机配的一层远程串流运维工具。它不重做 Sunshine 或 Moonlight，而是把最容易出事故的几件事管清楚：优先捕获物理主屏、主屏真正离线时才允许 MTT1337 VDD 兜底、把普通窗口从虚拟屏拉回、拒绝碰水冷屏，并把网络、编码与开机方案的证据分开。",
  why: "高帧率、HDR（高动态范围）和 3D 场景需要 Sunshine/Moonlight 这类低延迟串流，但多屏主机一旦把捕获目标或窗口留在虚拟屏，远程端可能只看见壁纸；反过来，为了救画面盲改主屏、镜像模式或副屏又可能破坏本地工作。这个项目把“先认准设备、再判断是否允许切换、失败时保持现场”做成脚本和可测试规则。",
  plainExample: "我人在外面准备打开 Artemis（阿西西）前，可以先确认服务、网络和编码能力；如果物理主屏确实离线，守护器只有在身份唯一、GPU（图形处理器）稳定且串流空闲时才允许 VDD 接手。等我回家，普通窗口应被拉回物理主屏。最后两步仍需要一次真实连接、断开和显示器前后对照才能算验收。",
  result: "已经得到可运行的主屏/VDD 守护、独立 VDD 参数入口、网络诊断修复和每日巡检；当前还没有把它们提升为“手机一定直连、一定不卡、窗口一定回迁或一定能远程冷开机”的现实保证。",
  readerStates: {
    pass: "当前已证的是 Sunshine/Tailscale 服务保持 Auto（自动启动）并处于 Running（运行中）、捕获守护任务在运行、每日巡检最近返回 0、配置保持自动显示联动关闭，四套源码测试通过。",
    problem: "当前已发现 Sunshine output_name 与唯一健康 VDD/活动输出不匹配；执行范围已接管，但本次启动有 22 条匹配 WER 图形故障记录，GPU 门拒绝写入和重启。网络代理残留另有修复入口。",
    unavailable: "当物理主屏与 VDD 均无法证明健康、出现未识别的虚拟显示器、或检测到严重显卡崩溃时，执行 fail-closed（失败关闭），严禁盲目写入配置破坏现场。"
  },
  dataSources: {
    title: "系统从哪里采集状态，如何保障边界安全",
    intro: "系统通过 Windows 原生活动显示快照、cfgmgr32（Windows 设备管理接口）状态、Win32 窗口位置 API、系统事件日志与 Tailscale/Sunshine 本地管理接口读取状态；只返回公开安全的判断，不输出私人网络标识。",
    rows: [
      { source: "Windows 活动显示快照与 EDID（扩展显示标识数据）", data: "实时枚举物理主屏、MTT1337 VDD 与副屏硬件身份；绕过不稳定的管理接口，以 PnP（即插即用设备）实例 ID 与 EDID 计算 Sunshine UUIDv5（基于命名空间的稳定标识）。", result: "按当前证据选择捕获目标，避免依赖会变化的 DISPLAY 编号，并排除 LIAN LI 水冷屏与未知虚拟屏。" },
      { source: "Win32 窗口几何与 Placement（窗口放置）", data: "在切换至 VDD 前保存正常窗口的 HWND（窗口句柄）、PID（进程标识）、进程启动时间与位置矩形；识别相邻屏幕 11–13 像素的不可见边框容差。", result: "为主屏恢复时的窗口回迁提供计划，并避免把阴影边框当成真正跨屏；是否实际成功仍要写后回读。" },
      { source: "Windows 系统事件日志（System Log）", data: "只读查询当前开机周期内的 Kernel-Power 41、BugCheck、nvlddmkm 14/153，以及匹配图形故障特征的 WER（Windows 错误报告）1001/1019。", result: "命中后阻断捕获修改与服务重启；用户看到黑屏或整机卡死时仍须直接停手，事件日志不能替代视觉判断。" },
      { source: "Tailscale 本地网络探针与服务管理", data: "只读探测 PC 本地 IPv6 能力、unattended（无人值守）偏好、后台服务和可选 peer（对端）路径；不输出真实 Tailnet（Tailscale 私有网络）与 IP。", result: "返回本机与传输层状态；只有显式指定并验证目标 peer 后，才能区分 direct（直连）、DERP（中继服务器）或不可达。" },
      { source: "Sunshine Loopback（本机回环）接口", data: "通过 127.0.0.1 绕过外部代理请求 serverinfo；获取当前编码能力掩码（mask=0x70301）与 RTSP（实时流会话）活动状态。", result: "为切换前的空闲门提供输入；它不证明手机已经连接、协商到哪种编码或画面可交互。" },
      { source: "手机端输入与主机端画面", data: "Moonlight/Artemis 接收 Sunshine 的视频与音频，并把触控、键鼠或手柄输入送回主机；手柄兼容由 Sunshine 与 ViGEmBus（虚拟手柄总线）等上游组件承担。", result: "本项目只维护主机显示、网络和运维边界，不记录屏幕内容，也没有在本轮验证手机输入或手柄映射。" }
    ],
    note: "所有网络地址均以 100.x.y.z 与 2xxx:: 占位符脱敏展示；状态收集不改系统配置，verify-path-lite.ps1 只追加脱敏巡检日志。"
  },
  productPrinciples: [
    { title: "物理主屏优先，虚拟屏仅作兜底", detail: "平时远程目标是活动物理主屏，不让用户对着只有壁纸的虚拟扩展屏；只有主屏经实时证据确认缺失时才考虑 VDD，并在主屏恢复后规划拉回窗口。" },
    { title: "不碰物理硬件拓扑，严禁系统镜像", detail: "远程无论需要何种分辨率，均通过 Sunshine 编码器缩放；绝不使用 Windows 复制模式，绝不修改物理屏、机箱屏与水冷屏的硬件分辨率与刷新率。" },
    { title: "直连是目标，路径只认现场探测", detail: "IPv6 P2P 直连建立后可以绕开 DERP 中继；但本机 IPv6 可用不等于指定手机已经直连。页面必须保留 peer ping 被跳过这一事实。" },
    { title: "带宽建议先留余量，再看客户端统计", detail: "以文档记录的约 32 Mbps 上行为起点，先试 CBR 18–20 Mbps，并为 FEC 与音频留空间；真实丢包、帧率和延迟由客户端会话决定。" },
    { title: "硬件不稳定即失败关闭（Fail-Closed）", detail: "一旦显卡驱动出现过崩溃记录，停止本项目的捕获改动和服务重启，宁可暂时无法远程，也不继续增加系统蓝屏或本地工作受扰的风险。" },
    { title: "自动守护是默认，应急固定必须能退回", detail: "日常由主屏优先守护决定目标；只有本人明确选择时才把 Sunshine 暂时固定到 VDD。备份只提供恢复材料，不等于自动回滚或配置已经生效。" },
    { title: "变更默认只读，生产写入必须显式 Apply（应用）", detail: "VDD 入口默认回读身份、当前值和支持模式，显式 -Apply 的事务内才执行 CDS_TEST（显示设置预检）；无头入口在 -Apply 前重验 VDD 并生成同目录候选。" }
  ],
  responsibilities: [
    "在物理主屏经实时身份判断为稳定缺失时，等待串流空闲后才允许把捕获目标交给 2880×1800 HDR 虚拟显示屏，并记录普通窗口位置。",
    "在物理主屏重新被证明健康后，规划把迁走、新开或漂入 VDD 的普通窗口拉回主屏，再恢复物理捕获目标。",
    "把 LIAN LI 水冷屏、HS2 机箱副屏和未经验证的虚拟驱动排除在本项目的捕获选择与窗口迁移动作之外。",
    "提供人工应急固定 VDD 的配置入口，并明确它只改配置文件、保留备份；服务重载、手机画面和恢复日常守护仍是独立步骤。",
    "把 Tailscale 传输层与 Sunshine 串流层分开诊断，并提供 IPv6、direct/DERP 与无人值守状态的验证入口。",
    "针对小米 15 Pro 手机与 RTX 5090 D 显卡，给出约 32 Mbps 上行环境下 CBR 18–20 Mbps 与 AV1 的客户端配置起点。",
    "提供一键排查与幂等修复脚本，快速消除固定代理环境变量对 Tailscale 服务的负面干扰，固化无人值守守护态势。",
    "提供轻量验证计划任务，记录服务、编码能力、无人值守和公网入口提示；当前机器使用每日 23:30 的回退任务。"
  ],
  exclusions: [
    "不重复开发新的远程串流协议客户端；继续使用优秀的开源生态 Sunshine 与 Moonlight/Artemis。",
    "不替代 Windows 系统原本的显示设置；VDD 分辨率调整走受控独立接口，不干涉物理主屏的全局拓扑。",
    "不使用未经证明可靠的纯无线 Wi-Fi WoWLAN 作为生产级开机依赖；坚持插网线或智能插座硬件自启方案。",
    "不公开包含真实公网 IP、家庭宽带地址、Tailnet 域名、机器名称、Token（访问令牌）或私钥的明文信息。",
    "不将 Sunshine 管理控制台直接无防护暴露给公共互联网；公网访问必须经过受控鉴权与网络隧道。",
    "GPU 稳定门、唯一设备身份、无活跃串流或配置 CAS 任一失败时，不执行配置、服务、显示拓扑或显卡驱动变更。"
  ],
  glossary: [
    { term: "Sunshine", meaning: "安装在 PC 上的自建游戏与桌面串流服务端，支持 NVENC 高性能低延迟硬件编码。" },
    { term: "Moonlight / Artemis", meaning: "运行在手机或客户端上的开源串流接收器，支持超低延迟硬解与手柄触控模拟；Artemis 为国内优秀定制版。" },
    { term: "VDD（Virtual Display Driver）", meaning: "基于 Windows 间接显示驱动架构的虚拟显示器；本项目使用经过硬件 ID 严格验证的 MTT1337 VDD。" },
    { term: "Failover（故障转移）", meaning: "当物理主屏失效且身份、GPU 与串流空闲门都通过时，受控切到备用虚拟屏；是否平滑仍需真实手机与显示器 E2E。" },
    { term: "P2P 直连（Peer-to-Peer）", meaning: "两台设备直接建立点对点通信，数据包不经过第三方服务器中转，延迟最低且带宽最大。" },
    { term: "DERP（Designated Encrypted Relay for Packets）", meaning: "Tailscale 的中继节点；海外 DERP 延迟高且易受网络抖动干扰，直连成功后应绕开 DERP。" },
    { term: "CBR（Constant Bitrate，恒定码率）", meaning: "将网络传输速率牢牢锁定在固定值的编码模式，避免因复杂动态场景导致码率突增打爆上行。" },
    { term: "CQP（Constant Quantization Parameter，恒定量化参数）", meaning: "追求恒定画质的动态码率模式；在网络带宽受限的远程场景下极易引发剧烈丢包与卡顿。" },
    { term: "WoL（Wake-on-LAN）", meaning: "网络唤醒技术；通过向有线网卡发送特定魔术包实现远程开机。" },
    { term: "WoWLAN（Wake on Wireless LAN）", meaning: "无线网络唤醒；受限于无线网卡关机省电机制，在实际生产环境中极不可靠。" },
    { term: "ViGEmBus（虚拟手柄总线）", meaning: "Sunshine 客户端输入链可能使用的上游 Windows 虚拟手柄驱动；本项目不实现或记录用户的手柄输入。" }
  ],
  operatingFlow: [
    { title: "平时在电脑前工作", detail: "设计目标是 Sunshine 捕获活动物理主屏，普通窗口留在主屏工作区，VDD 只作为备用目标；水冷屏与机箱屏不参与。" },
    { title: "主屏确实离线", detail: "关屏不一定等于 Windows 认定显示器离线。只有实时 PnP 与活动输出证据确认主屏稳定缺失 15 秒，守护器才继续判断。" },
    { title: "空闲后允许 VDD 兜底", detail: "若 GPU 稳定门、唯一 VDD 身份和连续 5 秒串流空闲都通过，代码才允许更新捕获目标并迁移符合条件的普通窗口。" },
    { title: "手机端发起连接", detail: "Moonlight/Artemis 可以协商视频、音频和触控、键鼠或手柄输入；当前建议从 18–20 Mbps 与 AV1 起试，但本轮没有验证直连路线、实际编码、帧率或输入。" },
    { title: "用毕断开", detail: "真实客户端断开后，RTSP 会话应释放；是否保持 VDD 捕获以及窗口实际位置要由当时的状态回读决定。" },
    { title: "主屏恢复", detail: "主屏再次被证明健康且串流空闲时，守护器按记录把符合条件的普通窗口拉回并恢复物理捕获；本轮没有做这次前后对照。" }
  ],
  components: [
    { name: "捕获源与窗口故障转移守护器", responsibility: "主屏优先绑定、VDD 兜底计划、RTSP 会话空闲门与 Win32 窗口位置迁移/拉回。", implementation: "sunshine-capture-failover.psm1 与 Invoke-SunshineCaptureFailover.ps1 实现稳态轮询、身份复核和 GPU 事件门。" },
    { name: "VDD 独立显示参数适配器", responsibility: "提供 2880×1800 60Hz 150% HDR 初始配置、CDS_TEST 预检、缩放/HDR 写后回读与首选项持久化。", implementation: "Set-SunshineVddDisplayProfile.ps1 编排 Get-SetVddDisplayMode.ps1、Get-SetVddScaleHdr.ps1 与 sunshine-vdd-display-settings.psm1；真正的 Win32 调用在两个 Get-Set 脚本中。" },
    { name: "应急无头模式配置器", responsibility: "在用户明确选择时把 Sunshine output_name 指向已验证 VDD，并管理 6 个 dd_* 显示键；它不替代日常主屏优先守护。", implementation: "Set-SunshineHeadlessConfig.ps1 与 sunshine-headless-config.psm1 负责候选、提交前绑定复核、同目录原子替换和备份；没有服务重启、写后回读或自动回滚，本轮未应用。" },
    { name: "Sunshine/Moonlight 输入输出链", responsibility: "Sunshine 输出画面与音频，Moonlight/Artemis 把触控、键鼠或手柄输入送回主机。", implementation: "由上游 Sunshine、客户端与可选 ViGEmBus 提供；本仓库只维护显示与运维边界，本轮未做手机输入 E2E。" },
    { name: "传输层验证与网络一键修复", responsibility: "探测光猫与主机 IPv6 SLAAC 状态，清除 Tailscale 服务的固定代理端口环境变量，固化无人值守模式。", implementation: "repair-stream.ps1（幂等修复）与 verify-path.ps1（深度直连与 DERP 路径诊断）。" },
    { name: "轻量计划任务巡检器", responsibility: "检查服务运行态、编码能力掩码（HEVC/AV1 Main10）、无人值守和公网入口提示并写入运行态日志。", implementation: "注册器优先尝试登录后延迟触发；当前机器运行的是每日 23:30 的 SunshineRemote-VerifyPath-Daily 回退任务。" },
    { name: "隔离自动化验证套件", responsibility: "在内存与沙箱环境中对设备 GUID 计算、窗口搬迁、安全门禁与 AST 语法进行严谨的非破坏性回归测试。", implementation: "tests/ 目录下 4 套核心测试脚本，涵盖 101 项以上严格断言。" }
  ],
  technicalContracts: [
    { artifact: "捕获守护状态记录", schema: "sunshine.capture-failover-state.v1", owner: "Invoke-SunshineCaptureFailover.ps1", boundary: "记录当前模式（Unknown/Physical/Vdd）、主屏缺失时间点、串流空闲时间戳以及已迁移窗口的 HWND/PID/Placement 数组；禁止记录私密窗口标题。" },
    { artifact: "VDD 显示参数与回读边界", schema: "无独立 schema；PowerShell 参数、Win32 结果与 VDD XML", owner: "Set-SunshineVddDisplayProfile.ps1", boundary: "严格限定目标为唯一健康 MTT1337；Get-SetVddDisplayMode.ps1 执行 CDS_TEST，两个原生适配器负责应用/回读，持久 XML 同卷原子替换。" },
    { artifact: "Sunshine 无头配置键集合", schema: "无独立 schema；7 个受控 sunshine.conf 键", owner: "Set-SunshineHeadlessConfig.ps1", boundary: "更新 output_name、5 个 disabled 的自动显示键与 dd_config_revert_delay=3000；写前复核、原子替换并保留备份，但不自动重启、回读或回滚。本轮没有运行 -Apply。" },
    { artifact: "轻量巡检日志记录", schema: "verify-lite.log format", owner: "verify-path-lite.ps1", boundary: "仅输出时间戳、WLAN IPv6 计数、服务状态、Sunshine 编码掩码、unattended 状态与脱敏公共暴露提示，绝不持久化明文 IP 或凭据。" }
  ],
  usageExamples: [
    { moduleSlug: "capture-failover", ask: "如果我直接拔掉显示器线，Sunshine 会怎样？窗口会丢吗？", effect: "代码会先确认主屏持续缺失、串流空闲、GPU 稳定和 VDD 唯一，再计划切换和窗口迁移；隔离测试已过，但真实拔线后的手机画面与窗口回迁仍未验。" },
    { moduleSlug: "capture-failover", ask: "自动守护坏了，我能先让 Sunshine 固定抓 VDD 吗？", effect: "可以先用应急无头入口预览候选；本人明确 -Apply 后只原子更新配置并留下备份。随后仍要自行重载并验证手机画面；恢复日常时重新运行主屏优先守护。" },
    { moduleSlug: "vdd-display-settings", ask: "我想把手机远程画质改成 2560×1440 120Hz，会影响我电脑主屏吗？", effect: "入口只接受经过身份验证的 VDD，默认先回读；只有显式 -Apply 才向 VDD 写入。代码不向物理屏发写入，但物理屏是否保持不变仍需独立前后验收。" },
    { moduleSlug: "transport-ipv6-direct", ask: "我在外面用手机移动 5G，为什么经常连不上家里的 Tailscale 串流？", effect: "先分别检查本机 IPv6、Tailscale 状态和指定手机 peer；只有 peer 探测返回 direct 才能说直连，返回 DERP 或未提供 peer 都不能说数据不出海。" },
    { moduleSlug: "bitrate-codec-strategy", ask: "我把串流码率拉到 50 Mbps 画面会不会更清楚？", effect: "按文档记录的约 32 Mbps 上行，先从 18–20 Mbps CBR 与 AV1 试起更稳妥；是否卡顿、丢包或更清楚必须看真实会话统计。" },
    { moduleSlug: "remote-power-and-repair", ask: "电脑关机了，我能直接用手机通过 Wi-Fi 把电脑叫醒吗？", effect: "Wi-Fi 网卡在关机后不一定保持可唤醒供电，WoWLAN 不作为可靠默认；可以实测有线 WoL 或“智能插座 + BIOS 来电自启”，但本轮没有证明任一路线已经完成远程物理开机。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码与配置）", proves: "PRIVATE main 与 origin/main 已对齐到 70d65059ce122b5a872b97c2f5130ab3e824fab7；该提交补齐 BugCheck 与匹配 WER 1019 的 GPU 事件门，并保留捕获守护、VDD 原生适配器、网络修复与测试。", doesNotProve: "源码提交不证明现役 output_name 已正确、真实硬件切换成功，也不证明手机操控的延迟、画质或弱网稳定性。" },
    { layer: "Tests（隔离自动化测试）", proves: "4 套独立 PowerShell 测试套件通过全部 101 项以上断言，覆盖 GUID 唯一绑定、窗口阴影边框容差、GPU 崩溃门禁与原子写入。", doesNotProve: "测试不模拟硬件显卡真正拔线、屏幕物理掉电或真实的 Windows 蓝屏事件。" },
    { layer: "Runtime（当前系统运行态）", proves: "2026-09-04 回读 Sunshine 2026.516.143833 与 Tailscale 1.102.2；两项服务均为 Auto 自动启动并处于 Running，捕获守护任务为 Running，每日巡检最近返回 0；编码掩码 0x70301 支持 HEVC/AV1 Main10。只读选择器发现唯一健康 VDD，但现役 output_name 不匹配任何活动输出；当前 GPU 门因 22 条匹配 WER 记录返回 BlockedByGpuStability。", doesNotProve: "22 是匹配日志记录数，不等于 22 次独立崩溃；状态文件最后更新于 2026-09-03，也不证明手机会话可交互。门已阻断写入，本轮配置哈希与服务状态保持不变。" },
    { layer: "Transport（传输与网络）", proves: "2026-09-04 本机 netcheck 报告 IPv6 可用，Tailscale 1.102.2 为 Running、online 且 unattended=true；每日巡检没有指定 peer。", doesNotProve: "当前手机路线是 direct 还是 DERP、串流数据经过哪里、延迟和丢包均为 Unknown（未知）。巡检还提示另有用户配置的 Funnel，但未把它归因于 Sunshine。" }
  ],
  operationalEntrypoints: [
    { name: "只读运行态路径轻量验证", command: "pwsh -NoProfile -File .\\verify-path-lite.ps1", purpose: "以只读方式检查本机 IPv6、服务状态、Sunshine 编码能力掩码与 Tailscale 无人值守状态，写入 runtime 日志。" },
    { name: "网络与服务幂等修复入口", command: "pwsh -NoProfile -File .\\repair-stream.ps1", purpose: "重新绑定网卡 IPv6，清理服务环境变量残留的固定代理端口，固化 Tailscale 无人值守并拉起服务。" },
    { name: "深度传输路径与对端探测", command: "pwsh -NoProfile -File .\\verify-path.ps1 -PhoneTailscaleIp <peer-ip>", purpose: "仅在显式传入手机 Tailscale IP 时，验证手机与电脑之间是走公网 IPv6 直连还是海外 DERP 中继。" },
    { name: "VDD 独立显示参数回读与调整", command: "pwsh -NoProfile -File .\\Set-SunshineVddDisplayProfile.ps1 -Width 2880 -Height 1800 -RefreshRate 60 -ScalePercent 150 -HdrMode Hdr [-Apply]", purpose: "默认只读核对身份、当前值与支持模式；显式 -Apply 后的事务才先执行 CDS_TEST，再应用、回读并持久化首选项。" },
    { name: "捕获守护计划任务注册与更新", command: "pwsh -NoProfile -File .\\Install-SunshineCaptureFailoverTask.ps1 [-Apply]", purpose: "默认预检；显式加上 -Apply 在 Windows Task Scheduler 注册无窗后台守护任务。" },
    { name: "应急无头捕获模式切换", command: "pwsh -NoProfile -File .\\Set-SunshineHeadlessConfig.ps1 [-Apply]", purpose: "在极端情况下将 Sunshine 捕获源强行指向 VDD 并保持所有拓扑改动选项处于 disabled 状态。" }
  ],
  evolution: [
    { date: "2026-06-26—2026-07-09", commit: "基础串流与路径巡检", result: "建立 Sunshine + Moonlight/Tailscale 运维手册，随后加入任务调度安全、静默启动、Funnel 提示与只读路径检查。" },
    { date: "2026-08-05—2026-08-08", commit: "传输与登录前边界", result: "移除固定 Tailscale 代理端口，补强无人值守、HDR 与登录前检查；同时明确服务 Running 不等于登录前画面可捕获。" },
    { date: "2026-08-10—2026-09-02", commit: "主屏优先、窗口恢复与 VDD 参数", result: "从 VDD 隔离演进为物理主屏优先的捕获守护，连续补齐空闲门、普通窗口恢复、边框容差、GPU 事件门和 VDD 独立首选参数；真实手机与物理显示 E2E 仍单列。" }
  ],
  snapshotUpdateNote: "本页绑定 2026-09-04 的 PRIVATE 源提交 70d65059ce122b5a872b97c2f5130ab3e824fab7、脱敏服务/任务/配置回读与测试结果；运行态时间分别标注，Unknown 不从旧日志补齐。后续仅在串流拓扑、显示边界、传输合同或核心参数发生实质变化时刷新；不采集私人聊天、屏幕画面或凭据。"
};

export const sunshineRemoteStreamingModules = [
  {
    slug: "capture-failover",
    shortTitle: "主屏与兜底",
    title: "物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口",
    searchAliases: [
      "物理主屏优先",
      "VDD 兜底",
      "虚拟显示器窗口迁移",
      "联力水冷屏排除",
      "HS2 副屏排除",
      "GPU 不稳定阻断",
      "BlockedByGpuStability",
      "窗口拉回物理屏",
      "不可见边框阴影容差"
    ],
    searchProjection: {
      intents: [
        "为什么远程时不直接用虚拟屏",
        "物理显示器关掉后远程画面怎么办",
        "如何防止远程窗口漂进壁纸虚拟屏",
        "如何保护水冷屏和机箱屏不被串流抓取",
        "显卡崩溃时系统如何安全回退"
      ],
      entities: [
        "物理主屏（4K 240Hz）",
        "MTT1337 VDD",
        "LIAN LI 水冷屏",
        "HS2 机箱屏",
        "sunshine-capture-failover.psm1",
        "Kernel-Power 41",
        "BlockedByGpuStability"
      ],
      relations: [
        "主屏在线时串流抓主屏且普通窗口禁入VDD",
        "主屏缺失15秒且串流空闲5秒切到VDD并迁入窗口",
        "主屏恢复后去抖防抖并将窗口恢复至原位",
        "水冷屏与副屏绝对禁止作为捕获目标"
      ],
      failureRecovery: [
        "主屏回来后对符合门禁的普通窗口执行拉回并逐项回读",
        "GPU崩溃后禁止修改拓扑，失败关闭",
        "无法证明唯一健康VDD时拒绝盲目切换"
      ]
    },
    teaser: "它处理“远程端只剩壁纸、窗口落在看不见的虚拟屏”这类事故：先确认物理主屏真的离线，再决定是否允许 failover（故障转移）。",
    status: "守护任务 Running、测试 67/67；现役 output_name 不匹配活动输出，真实切换未验",
    statusTone: "mixed",
    value: "目标体验仍很直白：在家用物理屏，主屏确实离线时才让 VDD 兜底，主屏回来后把普通窗口拉回；现在已经有实现和测试，但还不能把这段目标场景说成真机成功。",
    why: "多屏扩展下，Windows 可能把新开或失去焦点的窗口放到看不见的扩展屏；如果盲目开启“系统镜像”，又可能打乱物理屏高刷与 HDR（高动态范围）。因此需要一套先核对身份、再决定是否动作的窗口与捕获目标守护器。",
    example: "“我拔掉主屏线后想从手机继续工作。”系统应先等 15 秒确认主屏缺失，再等串流空闲，验证唯一 MTT1337 VDD 与 GPU 事件后才切换；插回线后还要用前后快照确认窗口确实回到主屏。",
    result: "已交付身份校验、去抖、空闲门、窗口迁移计划和失败关闭；尚未证明真实拔线后手机画面不中断、窗口全部回迁或水冷屏视觉状态不变。",
    readerStates: {
      pass: "源码测试已证明主屏/VDD 身份、去抖、RTSP（实时流会话）空闲门与窗口几何计划按预期分支；真实生产通过仍需连接/断开和显示器前后对照。",
      problem: "当前现场问题是 output_name 与唯一健康 VDD/活动输出不匹配；执行范围已接管，但 GPU 门因 22 条匹配 WER 图形故障记录阻止写入。",
      unavailable: "若系统中出现多个无法区分的虚拟屏、或未能检测到健康的 MTT1337 驱动实例，系统失败关闭，拒绝盲目绑定。"
    },
    decisionImpact: [
      "Sunshine 捕获源 output_name 只使用通过 PnP（即插即用设备）/EDID（扩展显示标识数据）计算的 UUIDv5（基于命名空间的稳定标识），不使用容易随热插拔改变的 \\\\.\\DISPLAYN 编号。",
      "物理主屏连续缺失 15 秒（排除瞬时休眠与驱动重置）且串流空闲 5 秒才切到 VDD，防止正常看视频时发生误切。",
      "记录普通窗口的 HWND（窗口句柄）、PID（进程标识）与真实放置矩形；11–13 像素只是当前常见观测，代码按窗口 DPI 动态计算边框容差，取不到时回退 16 像素。",
      "LIAN LI 水冷屏（TUR0000）与 HS2 机箱屏严格列为本项目黑名单：捕获选择和本项目的窗口迁移动作不以它们为目标。",
      "主屏优先守护是日常默认；人工无头入口只在明确应急选择时写配置并留备份，不负责重启、手机验收或恢复日常策略。"
    ],
    problem: "防止多屏混用与关屏串流时，failover（故障转移）状态机出现画面丢失、窗口错位、副屏被夺取或显卡驱动连锁崩溃。",
    implementation: [
      "sunshine-capture-failover.psm1 实现活动显示快照采集、EDID 校验、Sunshine 配置 CAS（比较并交换）原子更新与 Win32 窗口位置控制。",
      "Invoke-SunshineCaptureFailover.ps1 作为常驻轮询工作器（3 秒稳态轮询，等待期 250ms 快速复核），用全局互斥锁避免重复实例，并让隐藏父启动器监视生命周期。",
      "提交时把 pending（待处理）与 applied（已应用）状态分开：配置 CAS 后在同一 20 秒期限内重启并检查服务，失败恢复配置 preimage（变更前内容）；窗口逐个复核身份、来源区域与写后位置，单个失败不阻塞其余窗口。",
      "Install-SunshineCaptureFailoverTask.ps1 将其注册为当前交互用户登录时触发的 Highest（最高权限）任务，配合 VBS（Visual Basic 脚本）启动器无窗运行并监视父进程。",
      "Set-SunshineHeadlessConfig.ps1 提供独立的人工应急固定 VDD 路径：只改受管配置键，保留原文件备份，不冒充已重载或已显示。",
      "tests/Test-SunshineCaptureFailover.ps1 提供 67 项自动化单元与模拟测试，覆盖已建模的身份、去抖、窗口与故障分支。"
    ],
    flow: [
      "常驻守护器每 3 秒获取一次系统显示快照与 RTSP 串流会话状态。",
      "若物理主屏正常在线，将任何意外漂入或新建在 VDD 区域的普通窗口持续拉回主屏。",
      "若物理主屏离线，启动 15 秒缺失计时器；计时满且串流空闲后，记录主屏普通窗口几何位置，将 output_name 原子替换为 VDD GUID 并迁移窗口。",
      "主屏重新被证明健康并通过去抖后，守护程序只对符合身份与区域门的普通窗口执行拉回，再恢复物理捕获目标；实际结果需逐窗口与配置回读。"
    ],
    concepts: [
      { term: "EDID（扩展显示标识数据）", explanation: "显示器提供的身份信息；项目把它与同一次 PnP/活动输出证据组合为稳定标识，并在每次操作前重新核对。" },
      { term: "CAS（Compare-And-Swap）", explanation: "原子替换机制；写入配置文件前先校验原有内容是否被修改，防止多进程并发冲突覆写。" },
      { term: "RTSP 空闲门（Idle Gate）", explanation: "在串流正在进行时禁止切屏或重启服务，必须等到客户端主动断开串流且连续空闲 5 秒后才操作。" }
    ],
    boundaries: [
      "不通过系统级复制/镜像显示器实现画面同步，杜绝模式冲突。",
      "不触碰 Shell 桌面底栏、输入法、全屏独占游戏或无法证明归属的未知句柄窗口。",
      "当前周期内存在显卡崩溃时，坚决禁止执行任何显示拓扑写操作。"
    ],
    failures: [
      { condition: "检测到多于一个同名 VDD 或存在未知虚拟驱动", response: "拒绝推断目标，执行失败关闭，保持当前配置不动并记录错误日志。" },
      { condition: "当前 Windows 启动发生过 Kernel-Power 41、BugCheck、nvlddmkm 或匹配 WER 图形故障", response: "状态置为 BlockedByGpuStability，禁止切换，仅允许单向将窗口收回物理主屏。" },
      { condition: "单轮显示枚举瞬时失败（如驱动重置）", response: "代码把它记为 cycle-transient-failure 并留待下一轮；自动化测试覆盖了不让该异常直接终止守护器的分支。" },
      { condition: "人工无头写入前 VDD 身份或原配置变化", response: "拒绝覆盖；若原子替换发生则返回备份路径。工具本身不自动重启 Sunshine，也不把备份冒充自动回滚。" }
    ],
    sources: [
      { path: "sunshine-capture-failover.psm1", role: "核心状态机、窗口几何与原子配置读写引擎" },
      { path: "Invoke-SunshineCaptureFailover.ps1", role: "常驻轮询执行体与空闲门检测" },
      { path: "Set-SunshineHeadlessConfig.ps1", role: "人工应急固定 VDD 的只读预览与显式写入入口" },
      { path: "tests/Test-SunshineCaptureFailover.ps1", role: "67 项高强度自动化回归测试套件" }
    ],
    verification: [
      "自动化测试 67/67 通过（涵盖设备快照、GUID 绑定、去抖、CAS 写入、BugCheck/WER/GPU 事件门和窗口计划）；它们是合成分支，不是物理串流。",
      "capture-failover-state.json 使用 sunshine.capture-failover-state.v1，并保留 Mode=Vdd、PendingTargetKind=Physical 的最后状态；更新时间为 2026-09-03，不冒充当前一轮健康回读。",
      "系统计划任务 SunshineCaptureFailover-Interactive 保持 Running 状态。"
    ],
    relation: "为整个远程串流系统提供坚固的显示可用性基石；与 VDD 独立显示参数管理及传输层紧密协作。"
  },
  {
    slug: "vdd-display-settings",
    shortTitle: "虚拟屏参数",
    title: "专用虚拟显示屏 2880×1800 60Hz 150% HDR（高动态范围）独立可调，主屏不受联动干扰",
    searchAliases: [
      "VDD 独立分辨率",
      "2880x1800 HDR",
      "防 800x600 回退",
      "Win32 CDS_TEST",
      "Set-SunshineVddDisplayProfile.ps1",
      "HDRPlus",
      "Advanced Color",
      "虚拟显示器缩放"
    ],
    searchProjection: {
      intents: [
        "单独修改虚拟显示器分辨率而不影响物理主屏",
        "为什么虚拟屏重启后会变成800x600",
        "Windows HDR与虚拟屏HDR设置",
        "安全的Win32显示模式修改预检机制",
        "手机屏幕比例适配"
      ],
      entities: [
        "2880×1800",
        "HDR / Advanced Color",
        "Set-SunshineVddDisplayProfile.ps1",
        "sunshine-vdd-display-settings.psm1",
        "CDS_TEST"
      ],
      relations: [
        "VDD模式修改完全独立于物理主屏",
        "显式Apply前必须通过CDS_TEST预检",
        "首选模式持久化防止驱动重枚举回落"
      ],
      failureRecovery: [
        "模式不支持时回滚到应用前状态",
        "预检失败绝不写入系统显示拓扑"
      ]
    },
    teaser: "它把虚拟屏参数从物理主屏中拆开：先认准唯一 MTT1337，再回读，只在显式 Apply（应用）事务中预检并向 VDD 写入；物理屏不变要另做前后验收。",
    status: "脚本与隔离测试通过；本轮只读，未执行 Apply（应用）或实时显示回读",
    statusTone: "mixed",
    value: "需要时可以单独给 VDD 设 2880×1800、缩放与 HDR，不应该顺手改掉物理主屏；本轮证明的是入口和保护逻辑，不是这次已经修改成功。",
    why: "虚拟显示驱动在 Windows 重启或显卡重新枚举时，常常由于缺乏硬件握手而自动回退到厂家列表第一项（通常是 800×600），导致串流画面极小且模糊；同时第三方工具修改显示模式往往全局联动，容易破坏主屏的 4K 240Hz 配置。",
    example: "“我想把 VDD 调为 2560×1440 144Hz。”先不带 -Apply 查看目标身份、当前值和驱动公布的支持模式；确认后显式应用，事务先跑 CDS_TEST（显示设置预检）再回读 VDD。物理屏不变要单独比较前后快照。",
    result: "已得到独立参数入口、写前预检、写后回读与失败回滚；实时模式、重枚举后的首选项保持和手机 HDR 画面仍未在本轮验收。",
    readerStates: {
      pass: "VDD 模式成功应用并通过精确回读，持久化 XML 完成原子替换；物理屏与副屏状态不变只有在独立前后快照一致时才成立。",
      problem: "若请求的分辨率或刷新率未被 VDD 驱动声明支持，脚本在 CDS_TEST 阶段主动拦截并报错，不执行实际改动。",
      unavailable: "若未能通过硬件 ID 匹配到真正的 MTT1337 虚拟设备，脚本拒绝执行任何 Win32 改动。"
    },
    decisionImpact: [
      "项目初始 profile（配置组合）保留 2880×1800、60 Hz、150% 缩放与 HDR；后续显式调整可以覆盖。",
      "持久化首选项会把选定模式写在 VDD 驱动模式列表首位，目的是减少驱动重枚举时回退到 800×600；本轮未做重枚举实测。",
      "严格区分 Windows Advanced Color（高级颜色）/HDR 开关与 VDD 驱动内部的 12-bit HDRPlus 能力开关，避免概念混淆造成色彩异常。",
      "脚本默认仅做纯内存预检与状态回读；只有管理员显式传入 -Apply 参数才会执行 Win32 变更与文件原子落盘。"
    ],
    problem: "降低虚拟显示器分辨率回退、HDR 色彩异常和多屏设置互相影响的风险。",
    implementation: [
      "Set-SunshineVddDisplayProfile.ps1 负责参数校验与事务编排；sunshine-vdd-display-settings.psm1 负责身份、计划与 XML 候选。",
      "Get-SetVddDisplayMode.ps1 实现 ChangeDisplaySettingsEx/CDS_TEST 与模式回读；Get-SetVddScaleHdr.ps1 实现缩放和 Advanced Color（高级颜色）应用/回读。",
      "tests/Test-SunshineVddDisplaySettings.ps1 与 Test-SunshineVddNativeAdapter.ps1 提供 19 项以上严格测试保障。"
    ],
    flow: [
      "用户或上层脚本调用入口并传入期望的宽高、刷新率、缩放与 HDR 模式。",
      "脚本扫描系统显示设备，严格通过 MTT1337 硬件 ID 锁定专用虚拟屏，拒绝物理屏与水冷屏。",
      "默认路径只回读身份、当前模式、支持模式、缩放与 HDR，不调用显示写 API。",
      "若包含 -Apply，事务先调用 ChangeDisplaySettingsEx/CDS_TEST，随后才提交模式、用 DisplayConfigSetDeviceInfo 应用缩放与 HDR，并原子更新持久化 XML。",
      "执行写后回读，确认生效参数与请求完全一致。"
    ],
    concepts: [
      { term: "CDS_TEST（显示设置预检）", explanation: "Win32 API 的安全测试标志；只验证系统能否接受该模式，不产生真实的屏幕闪烁或参数改动。" },
      { term: "Advanced Color（高级颜色）", explanation: "Windows 官方的 HDR 渲染控制架构；只有在此处开启 HDR，系统才会向串流客户端输出宽色域信号。" }
    ],
    boundaries: [
      "入口绝不改写 Sunshine 的 output_name GUID 标识。",
      "绝对不触碰物理主屏（PHLC34B 等）、LIAN LI 水冷屏或 HS2 机箱副屏。",
      "不强行写入未经驱动支持的非标非常规显示模式。"
    ],
    failures: [
      { condition: "传入非法或未经支持的分辨率/刷新率", response: "预检直接报错退出，不调用 Win32 写入 API，保持现有显示模式。" },
      { condition: "设备名被模拟或重命名为非安全格式", response: "安全过滤层拒绝执行并抛出异常，防止向错误显示设备发送指令。" },
      { condition: "XML 配置文件写入中途失败", response: "原子事务机制回滚至原文件镜像，不留下损坏的截断配置。" }
    ],
    sources: [
      { path: "Set-SunshineVddDisplayProfile.ps1", role: "原生显示模式适配器入口" },
      { path: "sunshine-vdd-display-settings.psm1", role: "设备身份、事务计划与 VDD XML 候选" },
      { path: "Get-SetVddDisplayMode.ps1", role: "分辨率/刷新率 CDS_TEST、应用与回读" },
      { path: "Get-SetVddScaleHdr.ps1", role: "缩放和 Windows HDR 原生应用与回读" },
      { path: "tests/Test-SunshineVddDisplaySettings.ps1", role: "显示设置安全性与预检测试套件" }
    ],
    verification: [
      "自动化测试 19/19 全部 PASS（覆盖参数校验、黑名单设备拦截、CDS_TEST 预检与原子持久化）。",
      "Test-SunshineVddNativeAdapter.ps1 静态核对预期 API 名称、禁止项与调用顺序；它没有真实调用 Win32 或改变显示。"
    ],
    relation: "为 VDD 兜底提供独立、可回读的像素与色彩参数；是否真的改善手机画面仍由真实串流验收决定。"
  },
  {
    slug: "transport-ipv6-direct",
    shortTitle: "传输路径",
    title: "串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）",
    searchAliases: [
      "Tailscale IPv6 直连",
      "串流不出海",
      "三层 NAT 穿透",
      "光猫 IPv6 双栈",
      "绕开 DERP 中继",
      "Tailscale unattended 模式",
      "修复 NoState 掉登录",
      "WireGuard UDP 直连"
    ],
    searchProjection: {
      intents: [
        "在外蜂窝网络连不上家里电脑",
        "串流延迟高卡顿走海外中继排查",
        "Tailscale开启IPv6后掉登录修复",
        "确认串流数据面是否出海",
        "局域网与蜂窝网络切换体验"
      ],
      entities: [
        "Tailscale 1.102.2",
        "移动光猫 GM220-S",
        "SLAAC / IPv6 双栈",
        "DERP (tok / hkg)",
        "repair-stream.ps1",
        "verify-path.ps1"
      ],
      relations: [
        "端到端IPv6让手机与PC直接建立WireGuard UDP直连",
        "只有指定peer实测为direct时才可判断直连路径",
        "清除代理端口环境变量恢复Tailscale控制面心跳"
      ],
      failureRecovery: [
        "掉登录时运行repair-stream清除固定代理并重启服务",
        "显式peer探测才能把当前路径分类为direct或DERP；未探测保持Unknown"
      ]
    },
    teaser: "它不把“服务在线”当成“手机已直连”：先看本机网络，再对指定手机做 peer 探测，最后才说是 direct（直连）、DERP 中继还是不可达。",
    status: "Tailscale 1.102.2 正在运行且无人值守；本机 IPv6 可用；手机 peer 本轮未测",
    statusTone: "mixed",
    value: "人在外面连不上时，不必把 Sunshine、光猫和 Tailscale 混成一个问题：这套入口能先定位本机有没有 IPv6、服务是否登录，再用同一台手机证明当前到底直连还是中继。",
    why: "移动家宽与蜂窝网络可能叠加 CGNAT（运营商级网络地址转换）和多层 NAT，IPv4 打洞并不稳定；IPv6 让点对点直连成为可能，但最终路线仍受手机当时网络、UDP（用户数据报协议）可达性与 Tailscale 协商影响，不能从本机一侧提前宣布成功。",
    example: "“我在外用 5G 手机连 Moonlight 很慢。”先从已验证的手机 peer 运行 tailscale ping：输出 direct 才记录直连与延迟，输出 DERP 就记录中继；像本轮这样没有 peer 参数，只能停在 Unknown（未知）。",
    result: "已交付传输层状态、无人值守、代理残留修复和 peer 路径分类入口；当前没有手机 peer 回执，不能声称秒连、不出海或 15–30 ms。",
    readerStates: {
      pass: "只有 PC 与已验证手机的现场探测明确返回 direct，并记录当次延迟后，才把该次路径称为直连；延迟数值不预设。",
      problem: "若两端未成功建立 IPv6 直连，流量暂时回退至 DERP 中继，ping 出现 via DERP 提示，画质与延迟有所下降。",
      unavailable: "若光猫掉拨号失去 IPv6 前缀、或 Tailscale 服务掉登录变为 NoState，系统提供明确脚本进行一键修复。"
    },
    decisionImpact: [
      "明确“串流层（Sunshine）尽量不换，传输层（Tailscale）随时可换”的解耦原则；未来若替换为皎月连等工具，串流配置无需推翻。",
      "光猫开启 Native（原生）IPv4/IPv6 双栈，Windows 重新启用 WLAN 的 ms_tcpip6 协议绑定并清理 DisabledComponents 注册表限制。",
      "不在 Windows 服务级别把 Tailscale 写死到固定代理端口，避免代理软件关闭后 Tailscale 持续离线。",
      "固化 Tailscale 的 unattended（无人值守）模式（ForceDaemon=true），让服务可在锁屏或注销时继续运行；这不证明登录前桌面可被 Sunshine 捕获。"
    ],
    problem: "解决复杂 NAT 网络环境下远程打洞困难、海外中继延迟奇高、以及网络配置冲突引发的掉线问题。",
    implementation: [
      "通过移动光猫 PPPoE（宽带拨号协议）原生下发 IPv6 前缀，配合路由器 SLAAC（无状态地址自动配置），让 PC 获得可用于直连尝试的 IPv6 地址。",
      "repair-stream.ps1 提供一键幂等修复：清除残存的服务级代理端口环境变量，重启服务并强制固化 unattended 偏好。",
      "verify-path.ps1 与 verify-path-lite.ps1 分别提供深度路径诊断与日常无侵入巡检。"
    ],
    flow: [
      "手机发起串流请求，通过 Tailscale 控制面交换两端公网 IPv6 端点与 WireGuard 公钥。",
      "两端尝试在运营商骨干网内直接发送 WireGuard UDP 探测包。",
      "协商结果可能是 IPv6/IPv4 direct、DERP 或不可达；必须保存当次 peer 探测分类，不能预设会升级为直连。",
      "真实串流建立后，Sunshine 才通过协商好的连接发送视频与音频；本轮没有建立该会话。"
    ],
    concepts: [
      { term: "CGNAT（运营商级网络地址转换）", explanation: "千百家庭共享一个公网 IPv4 地址的技术；由于没有独立公网 IPv4，外部无法主动向内部发起连接。" },
      { term: "P2P（点对点）", explanation: "两端直接通信而不是把数据交给中继；只有指定 peer 的现场探测返回 direct 时，才能确认当前走这条路径。" },
      { term: "SLAAC（无状态地址自动配置）", explanation: "IPv6 终端根据路由器通告的前缀自动生成自身公网 IPv6 地址的标准机制。" },
      { term: "Unattended Mode（无人值守模式）", explanation: "Tailscale 在用户注销或未登录 Windows 桌面时仍作为后台系统服务正常工作的配置项。" }
    ],
    boundaries: [
      "本项目不创建 Sunshine 公网端口映射或 Funnel；当前主机另有用户配置的 Funnel，现有证据没有把它归因于 Sunshine，需按对应服务单独判断。",
      "公开文档与脚本中绝对不出现真实的私人 Tailnet 域名或完整的个人 IPv6 地址。",
      "不破坏本机其他依赖特定代理通道的日常网络需求。"
    ],
    failures: [
      { condition: "Tailscale 陷入 NoState 掉登录状态", response: "运行 repair-stream.ps1 清除固定代理端口覆盖，重新拉起服务并验证登录状态。" },
      { condition: "光猫重启后失去公网 IPv6 前缀", response: "登录网关确认 Native 双栈状态，网卡重新连接以重新获取 SLAAC 地址。" },
      { condition: "手机端检测到流量走 DERP 中继", response: "排查手机蜂窝是否被限制 IPv6，重新发起连接以促进 P2P 升级。" }
    ],
    sources: [
      { path: "repair-stream.ps1", role: "传输层与服务幂等修复入口" },
      { path: "verify-path.ps1", role: "端到端网络路径与 DERP 诊断工具" },
      { path: "verify-path-lite.ps1", role: "每日无感知路径与编码能力巡检任务" }
    ],
    verification: [
      "2026-09-03 23:30 的 verify-lite.log 证明 Tailscale 为 Running、start-mode=Auto，状态命令 exit=0。",
      "2026-09-04 回读 Tailscale 1.102.2 为 online，且 tailscale-unattended=true。",
      "同一每日巡检明确记录 tailscale-ping skipped，因为没有提供 peer；当前直连/DERP 路线未证。",
      "巡检提示存在用户配置的 Funnel；没有输出端点，也没有证据把它归为 Sunshine。"
    ],
    relation: "为串流链路提供可分层诊断的传输入口；它能证明服务和指定 peer 路径，但不能替代手机画面与输入 E2E。"
  },
  {
    slug: "bitrate-codec-strategy",
    shortTitle: "码率与编码",
    title: "以约 32 Mbps 上行为依据，从 CBR（恒定码率）18–20 Mbps 与 AV1 编码开始实测",
    searchAliases: [
      "受限上行码率预算",
      "CBR 18-20Mbps",
      "拒绝 CQP 动态码率",
      "AV1 远程串流",
      "RTX 5090D AV1 硬编",
      "小米15 Pro 骁龙 8 Elite",
      "FEC 冗余开销",
      "避免打爆上行带宽"
    ],
    searchProjection: {
      intents: [
        "远程串流画质糊或卡顿如何设置码率",
        "为什么不能用CQP或CQT动态码率",
        "AV1相比HEVC在远程场景下的优势",
        "家庭宽带上传带宽瓶颈计算",
        "手机端Moonlight与Artemis最佳设置"
      ],
      entities: [
        "32 Mbps 上行极限",
        "CBR 18–20 Mbps",
        "RTX 5090 D (Blackwell NVENC)",
        "骁龙 8 Elite (小米 15 Pro)",
        "AV1 / HEVC",
        "FEC 前向纠错"
      ],
      relations: [
        "上行32M减去FEC和音频后视频极限约为20M",
        "受限窄带下AV1画质优于HEVC",
        "CBR建议为FEC和音频预留带宽"
      ],
      failureRecovery: [
        "若出现丢包立即在手机端下调码率至15-18Mbps",
        "复杂画面坚决不使用CQP防止网络队列阻塞"
      ]
    },
    teaser: "它把“码率越高越清楚”换成一笔能复核的账：先给视频、FEC 和音频都留位置，再用手机统计决定继续加还是往下调。",
    status: "NVENC（NVIDIA 硬件编码器）配置与 AV1 Main10（10 位色深配置）能力已回读；18–20 Mbps 是客户端建议，弱网会话未测",
    statusTone: "mixed",
    value: "在外玩游戏或滚动复杂文档时，可以先用 18–20 Mbps 与 AV1 做稳妥起点；如果统计里仍有丢包或排队延迟，就降码率，而不是拿推荐值冒充必然流畅。",
    why: "README 记录的家庭上行约为 32 Mbps。按文档估算，20 Mbps 视频再加约 20% FEC（前向纠错）与音频约为 24.5 Mbps；这给其他流量留出余量。具体 FEC、瞬时峰值与链路可用带宽仍由真实客户端会话决定。",
    example: "“我先在手机端设 18–20 Mbps、60 FPS（每秒帧数）和 AV1，连接后观察丢包、网络延迟、解码耗时与实际帧率；不稳就退到 12–15 Mbps，稳定后再逐步上调。”",
    result: "已形成可解释的初始参数和回退方法，并确认主机具备 AV1 Main10 能力；当前没有真实会话数据证明零丢包、稳定 60 FPS 或 AV1 画质一定更好。",
    readerStates: {
      pass: "真实会话只有在协商到预期编码、综合流量没有压满上行，并且客户端统计显示可接受的丢包、延迟和帧率时才算通过。",
      problem: "若用户在手机端手动拉高码率超过 25 Mbps 或误选了 CQP，画面在复杂场景下将出现明显抖动与积压延时。",
      unavailable: "若客户端没有 AV1 硬解或协商失败，可改用 HEVC（高效视频编码）Main10；是否平滑和可用仍由重新连接后的统计确认。"
    },
    decisionImpact: [
      "把 README 记录的约 32 Mbps 上行当作配置依据，而不是永不变化的带宽保证；18–20 Mbps 是带余量的起点。",
      "受限链路优先使用 CBR（恒定码率）而不是 CQP（恒定量化参数），目的是减少复杂画面的码率峰值；客户端并未被本仓库强制锁定。",
      "RTX 5090 D 与骁龙 8 Elite 都具备 AV1 硬件能力，因此先试 AV1；与 HEVC 的画质和解码延迟差异要看同一会话对照。",
      "局域网可以尝试更高分辨率、刷新率和码率，但仍以客户端解码能力、显示刷新率与实时统计为准。"
    ],
    problem: "防止因码率设置不当导致家庭宽带上行被撑爆、画面严重卡死或编码资源浪费。",
    implementation: [
      "Sunshine 主机端配置 sunshine.conf：启用 nvenc_preset = 5（高画质预设）、nvenc_twopass = full_res（全分辨率两遍编码）与 nvenc_spatial_aq = enabled（空间自适应量化）。",
      "手机端 Moonlight / Artemis 建议起点：1080p/1440p、60 FPS、18–20 Mbps、CBR，并优先试 AV1；不是自动下发或强制配置。",
      "通过 verify-path-lite.ps1 验证主机端当前编码器能力掩码，确保 hevc-main10=true 与 av1-main10=true 均正常支持。"
    ],
    flow: [
      "手机客户端向 Sunshine 发送包含目标码率（如 20 Mbps）、编码格式（AV1）与帧率的协商请求。",
      "Sunshine 调用 NVIDIA NVENC API，以 P5 预设和全分辨率双遍算法开始压制视频流。",
      "传输协议可能加入 FEC 与音频开销；24.5 Mbps 只是按文档比例计算的预算，不是本轮流量测量。",
      "如果会话协商到 AV1，手机硬件解码器会参与渲染；HDR 还需要客户端、系统、显示与编码链共同满足。"
    ],
    concepts: [
      { term: "FEC（Forward Error Correction，前向纠错）", explanation: "发送方主动在数据包中附加的冗余纠错码；当网络偶发微小丢包时，接收方无需重传即可直接恢复画面。" },
      { term: "NVENC 两遍编码（Twopass）", explanation: "显卡编码器先快速分析整帧复杂度再精准分配码率的技术，能大幅提升受限带宽下的有效画质。" }
    ],
    boundaries: [
      "不在主机端强制锁死单一编码器；Sunshine 暴露 H.264、HEVC 与 AV1 能力，具体格式由手机客户端按解码能力协商。",
      "不把本地主屏 4K 240Hz 直接当作远程目标；手机客户端从 60 FPS 起测，再按网络与解码能力调整。"
    ],
    failures: [
      { condition: "手机画面发灰发白", response: "先核对客户端 HDR 与编码协商；保持物理主屏现状，只有在已授权的 VDD 独立路径中才调整其 HDR。" },
      { condition: "外网弱网环境下延迟波动加剧", response: "临时在手机端将码率下调至 12–15 Mbps，降低丢包几率。" }
    ],
    sources: [
      { path: "README.md", role: "带宽计算公式、码率推荐表与编解码器选型深度论证" },
      { path: "verify-path-lite.ps1", role: "主机硬件编码能力掩码只读验证" }
    ],
    verification: [
      "主机运行态编码能力掩码 0x70301，回读确认 hevc-main10=true 且 av1-main10=true。",
      "Sunshine 配置文件固化高质量 NVENC P5/双遍参数。"
    ],
    relation: "决定了远程可交互体验的实际质感；与下层网络通道及上层显示配置紧密相连。"
  },
  {
    slug: "remote-power-and-repair",
    shortTitle: "远程开机与修复",
    title: "比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务",
    searchAliases: [
      "远程开机方案",
      "智能插座来电自启",
      "有线网卡 WoL",
      "Wi-Fi WoWLAN 不可靠",
      "repair-stream.ps1",
      "verify-path-lite 计划任务",
      "Tailscale 掉登录一键修复",
      "系统运维手册"
    ],
    searchProjection: {
      intents: [
        "远程电脑关机了怎么开机",
        "为什么无线Wi-Fi无法稳定唤醒电脑",
        "使用智能插座实现远程开机",
        "有线网卡Wake-on-LAN配置",
        "排查和修复Tailscale网络连接问题",
        "日常轻量验证计划任务"
      ],
      entities: [
        "Restore on AC Power Loss",
        "Realtek 2.5GbE",
        "WoL / WoWLAN",
        "米家 / 涂鸦智能插座",
        "repair-stream.ps1",
        "SunshineRemote-VerifyPath-Daily"
      ],
      relations: [
        "关机或睡眠后的无线可唤醒供电与驱动支持未证，外网WoWLAN不作为可靠默认",
        "智能插座加BIOS来电自启是待实测的单机方案",
        "repair-stream幂等修复网络绑定与服务代理残留"
      ],
      failureRecovery: [
        "遇到网络或服务故障时执行repair-stream一键收敛",
        "计划任务每日无侵入记录verify-lite日志"
      ]
    },
    teaser: "它先讲清一个物理事实：电脑关机后，离线的 Tailscale 不能替你送入唤醒包；然后再把硬件开机方案与在线后的软件修复分开。",
    status: "每日巡检最近返回 0；修复脚本存在并有测试；BIOS、WoL 与断电冷开机未验",
    statusTone: "mixed",
    value: "电脑已经开着但网络抽风时，有脚本帮助收敛服务与代理残留；电脑彻底关机时，则要从智能插座 + BIOS 或有线 WoL 中选一条并做实物验收，不能把两件事混成“一键修复”。",
    why: "无线网卡在关机或睡眠后未必保持可唤醒供电，且 Tailscale 会随主机关机离线；因此不能仅凭在线状态假定外网 WoWLAN 可用。Windows 还可能因代理软件异常退出而留下服务环境变量，让 Tailscale 持续停在离线状态。硬件开机与在线修复必须分开处理。",
    example: "“我想在外地把关机电脑叫醒。”候选流程是智能插座重新上电、BIOS 来电自启、Windows 启动服务，再由手机连接；每一段都要实测。本轮只确认服务与巡检，不代表这条链已经跑通。",
    result: "已交付远程开机选择依据、在线故障修复脚本和当前每日巡检；尚未交付经过实物验证的远程冷启动或手机自动进入桌面。",
    readerStates: {
      pass: "当前只通过了软件侧：Sunshine 与 Tailscale 服务为自动启动且正在运行，每日巡检最近一次返回 0。BIOS 与 WoL 状态没有在本轮读取。",
      problem: "若遇到网卡协议解绑或代理配置残留，repair-stream.ps1 会尝试收敛；后置条件未满足时退出码为 1，并保留明确告警。",
      unavailable: "若主机物理断网或硬件电源故障，需待现场物理连接恢复后再行介入。"
    },
    decisionImpact: [
      "比较三种远程唤醒路线：优先实测“智能插座 + BIOS 来电自启（Restore on AC Power Loss）”；有线 Realtek 2.5GbE WoL（网络唤醒）是另一候选；纯无线 WoWLAN（无线局域网唤醒）不作为可靠默认。",
      "坚决不默认开启 Windows 自动登录，守住物理主机的本地身份安全底线；串流服务本身具备系统级捕获能力。",
      "编写 repair-stream.ps1 提供完全幂等的修复流程：自动重开 WLAN 网卡 IPv6 绑定、清理被污染的环境变量、拉起服务并固化 unattended 模式。",
      "注册器优先创建登录后延迟 3 分钟的任务；若创建失败则退到 SunshineRemote-VerifyPath-Daily。当前机器实际运行每日 23:30 回退任务。"
    ],
    problem: "解决离家后电脑关机无法唤醒、以及系统更新或网络代理异常导致的服务离线问题。",
    implementation: [
      "硬件候选：确认主板支持并显式启用 Restore on AC Power Loss = Power On，再用智能插座做完整断电/上电循环；本轮未验证。",
      "网卡候选：插入有线网络，确认 Realtek 2.5GbE 的魔术包与关机网络唤醒，再从家内可达设备发包；本轮未验证。",
      "软件层：repair-stream.ps1 修复注册表与服务状态；register-sunshine-verify-task.ps1 优先注册登录后任务，失败才注册每日回退任务。"
    ],
    flow: [
      "候选冷启动：手机操作智能插座重新上电；只有 BIOS 已正确配置时主板才应启动。",
      "服务启动：Windows 起来后，Tailscale 与 Sunshine 的 Auto 配置应拉起服务；Running 不等于登录前画面可捕获。",
      "客户端验收：Moonlight/Artemis 需要真实发现、鉴权、进入画面并测试输入；本轮没有执行。",
      "日常维护：当前每日任务执行 verify-path-lite.ps1，记录服务、编码、无人值守与公网入口提示。"
    ],
    concepts: [
      { term: "Restore on AC Power Loss（来电自动开机）", explanation: "主板 BIOS 的电源管理功能；当交流电插头重新通电时，主板自动触发开机信号，无需人按开机按键。" },
      { term: "幂等修复（Idempotent Repair）", explanation: "无论运行一次还是多次，最终系统的状态都收敛到一致的健康配置，不产生重复副作用。" }
    ],
    boundaries: [
      "不强行修改或弱化 Windows 的系统登录密码与锁屏策略。",
      "修复脚本只清理有明确故障特征的固定代理端口环境变量，不随意删除用户的正常应用配置。"
    ],
    failures: [
      { condition: "智能插座通电后电脑未开机", response: "现场确认 BIOS 的 AC 恢复选项、插座供电和主板行为；不要远程反复断电尝试。" },
      { condition: "Tailscale 服务无法启动", response: "以管理员权限运行 repair-stream.ps1，检查服务依赖与网络协议绑定。" }
    ],
    sources: [
      { path: "repair-stream.ps1", role: "传输与服务一键幂等修复工具" },
      { path: "register-sunshine-verify-task.ps1", role: "日常轻量验证计划任务安装程序" },
      { path: "README.md", role: "WoL 与智能插座开机原理深度解析" }
    ],
    verification: [
      "系统服务 SunshineService 与 Tailscale 均正在运行，启动模式为自动。",
      "计划任务 SunshineRemote-VerifyPath-Daily 正常存在且状态为 Ready。",
      "2026-09-03 23:30 的 verify-lite.log 完成且任务结果为 0；它没有运行 peer ping，也不证明冷开机或登录前捕获。"
    ],
    relation: "把离线开机、Windows 服务启动和在线故障修复拆成三段；当前只有服务与巡检段有现场证据。"
  }
];

export const project = sunshineRemoteStreamingProject;
export const modules = sunshineRemoteStreamingModules;
