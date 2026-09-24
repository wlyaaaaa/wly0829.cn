import { createProjectSnapshot } from "./project-snapshot.js";

const sunshineRemoteStreamingSnapshot = createProjectSnapshot({
  observedAt: "2026-09-18T12:53:00Z",
  label: "服务与守护新鲜，但本启动周期GPU证据阻断捕获切换；客户端状态Unknown",
  boundary: "9月18日只读健康：Sunshine/Tailscale运行、worker新鲜，本次启动命中20条LiveKernel图形故障记录，BlockedByGpuStability；当前VDD捕获不代表可安全切换。没有改显示、重启服务或发起手机串流；源码事务和窗口入口不抵消该阻断。",
  metrics: [
    { label: "物理主屏 / VDD（虚拟显示器）配置目标", value: "4K 240Hz / 2880×1800 HDR（高动态范围）" },
    { label: "文档上行依据 / 客户端起点", value: "约 32 Mbps / CBR（恒定码率）18–20 Mbps" },
    { label: "AV1 证据", value: "主机端能力已回读 / 手机协商未实测" },
    { label: "源码隔离测试", value: "4 套测试（101+ 断言）全部通过" }
  ],
  facts: [
    { label: "它真正解决的事", value: "为 RTX 5090 D + Ryzen 9 9950X3D 主机提供一套 Sunshine 运维层：识别应该捕获哪块屏、在主屏确实离线时规划 VDD 兜底、把漂入虚拟屏的普通窗口拉回，并把网络、编码与远程开机问题拆成可诊断的步骤。" },
    { label: "主屏优先与 VDD 兜底", value: "实现约定是 4K 240Hz 活动物理主屏优先，主屏正常时不改它的分辨率或排列。只有物理主屏稳定缺失 15 秒且串流连续空闲 5 秒时，守护器才允许把捕获目标切到唯一健康的 2880×1800 HDR MTT1337 VDD（虚拟显示驱动）并迁移普通窗口；本轮没有用真机连接或拔线验证这条生产路径。" },
    { label: "应急固定 VDD 不是日常模式", value: "人工固定VDD仍需明确预览和Apply，且消费当前GPU、会话和唯一VDD身份。配置通过共同短事务保存原值、原子写入和实际回读；回滚只碰本次postimage，不覆盖后来并发修改。配置提交不重启Sunshine或证明手机画面。" },
    { label: "捕获状态与历史故障", value: "2026-09-18只读现场属于9月16日开始的启动周期：20条LiveKernelFailure图形故障证据，状态BlockedByGpuStability，worker新鲜、capture=VDD，客户端会话Unknown。捕获切换和显示写入不放行；只有额外满足空闲和来源/目标证据的普通窗口单向拉回可独立判断。旧9月4日22条与9月14日状态各保留历史，不能跨启动周期替换。" },
    { label: "严禁拓扑联动与镜像", value: "不使用 Windows“复制显示器”，不开启 Sunshine 的 ensure_only_display（仅确保单显示器）或自动分辨率改写；VDD 参数与物理主屏分开，避免本项目因多屏联动增加黑屏或显卡驱动故障风险。" },
    { label: "水冷屏与机箱屏保护", value: "LIAN LI（联力）水冷屏与 HS2 机箱屏是本项目的禁止目标与禁止区域：捕获选择和本项目发起的窗口迁移动作不选它们。Windows 或其他应用自行放置窗口不在这项代码保证内。" },
    { label: "GPU稳定性故障关闭", value: "若当前系统启动已记录 Kernel-Power 41、BugCheck、nvlddmkm 或匹配的 WER 1001/1019 图形故障事件，系统进入 BlockedByGpuStability（因 GPU 不稳定阻断）状态，停止捕获源修改、模式切换与主屏到 VDD 的窗口迁移，只允许经严格验证的单向拉回主屏。用户实际看到黑屏或整机卡死时同样应停止操作，不能靠事件查询冒充视觉检测。" },
    { label: "传输层与直连证据", value: "Sunshine/Moonlight串流层与Tailscale传输层分别诊断。本次Tailscale仍Running（运行中）、online（在线）且unattended（无人值守）；2026-09-14T04:20:46Z回读WLAN非链路本地IPv6地址数为0。没有指定手机peer（对端）探测，当前直连或DERP（中继服务器）路线仍未验证；不能把一个接口的地址数推广成整机网络不可用。" },
    { label: "受限上行带宽建议", value: "README 以约 32 Mbps 上行为依据，建议手机客户端先从 CBR（恒定码率）18–20 Mbps 起步，并为 FEC（前向纠错）与音频留余量。这是配置建议，不是主机强制策略；本轮没有串流遥测证明 24.5 Mbps 峰值、无丢包或不卡顿。" },
    { label: "AV1 能力与真实协商", value: "RTX 5090 D 与小米 15 Pro 骁龙 8 Elite 具备 AV1 硬件能力，Sunshine 回环接口也报告 AV1 Main10（10 位色深配置）；真实会话是否协商到 AV1、画质是否优于 HEVC（高效视频编码），仍要由手机端连接与统计数据确认。" },
    { label: "远程唤醒是方案，不是现成结果", value: "纯无线 Wi-Fi WoWLAN（无线局域网唤醒）不适合作为可靠关机唤醒路径。仓库给出“智能插座 + BIOS 来电自启”与有线 Realtek 2.5GbE WoL（有线网络唤醒）两种选择，但本轮没有读取 BIOS、触发魔术包或做断电上电循环。" },
    { label: "幂等修复与每日巡检", value: "repair-stream.ps1 可在真实网络故障时恢复 IPv6 绑定、清理固定代理端口残留并固化 Tailscale 无人值守偏好；SunshineRemote-VerifyPath-Daily 最近一次自然运行返回 0，但 peer ping（对端探测）被跳过，并提示本机另有用户配置的 Funnel（公网入口），未证明它属于 Sunshine。" }
  ],
  gaps: [
    "当前启动周期已有GPU图形故障证据，捕获切换与显示写入被阻断；网页没有清事件、重启或改驱动绕过。实际手机串流和物理故障转移仍未验。",
    "本轮未发起从小米 15 Pro 手机端的真机交互式远程串流连接验收；服务常驻与编码掩码正常不代表真机操控体验。当前巡检也没有指定 peer，不能判断 direct（直连）还是 DERP 中继。",
    "未做拔掉物理显示器线缆或硬件关屏的破坏性 failover（故障转移）真实演练；去抖与窗口迁移由经过验证的 67 项自动化测试保障。",
    "未进行外网断电后通过智能插座远程冷开机的实物验证；WoL 与 AC（交流电）来电自启目前是文档方案，不能称硬件已经就绪。",
    "worker新鲜只证明循环在工作；当前会话Unknown不算空闲，不能累计空闲时间或据服务Running推断可安全切换。",
    "每日巡检看到一项用户配置的 Tailscale Funnel 公网入口；当前证据没有把它归因于 Sunshine，也不能把整台主机描述成零公网暴露。"
  ]
});

export const sunshineRemoteStreamingProject = {
  order: 24,
  slug: "sunshine-remote-streaming",
  technicalSections: [{"title":"来源读取与精确判定","paragraphs":["系统通过 Windows 原生活动显示快照、cfgmgr32（Windows 设备管理接口）状态、Win32 窗口位置 API、系统事件日志与 Tailscale/Sunshine 本地管理接口读取状态；只返回公开安全的判断，不输出私人网络标识。","Windows 活动显示快照与 EDID（扩展显示标识数据）：实时枚举物理主屏、MTT1337 VDD 与副屏硬件身份；绕过不稳定的管理接口，以 PnP（即插即用设备）实例 ID 与 EDID 计算 Sunshine UUIDv5（基于命名空间的稳定标识）。；按当前证据选择捕获目标，避免依赖会变化的 DISPLAY 编号，并排除 LIAN LI 水冷屏与未知虚拟屏。","Win32 窗口几何与 Placement（窗口放置）：在切换至 VDD 前保存正常窗口的 HWND（窗口句柄）、PID（进程标识）、进程启动时间与位置矩形；识别相邻屏幕 11–13 像素的不可见边框容差。；为主屏恢复时的窗口回迁提供计划，并避免把阴影边框当成真正跨屏；是否实际成功仍要写后回读。","Windows 系统事件日志（System Log）：只读查询当前开机周期内的 Kernel-Power 41、BugCheck、nvlddmkm 14/153，以及匹配图形故障特征的 WER（Windows 错误报告）1001/1019。；命中后阻断捕获修改与服务重启；用户看到黑屏或整机卡死时仍须直接停手，事件日志不能替代视觉判断。","Tailscale 本地网络探针与服务管理：只读探测 PC 本地 IPv6 能力、unattended（无人值守）偏好、后台服务和可选 peer（对端）路径；不输出真实 Tailnet（Tailscale 私有网络）与 IP。；返回本机与传输层状态；只有显式指定并验证目标 peer 后，才能区分 direct（直连）、DERP（中继服务器）或不可达。","Sunshine Loopback（本机回环）接口：通过 127.0.0.1 绕过外部代理请求 serverinfo；获取当前编码能力掩码（mask=0x1F0301（2026-09-13自然巡检））与 RTSP（实时流会话）活动状态。；为切换前的空闲门提供输入；它不证明手机已经连接、协商到哪种编码或画面可交互。","手机端输入与主机端画面：Moonlight/Artemis 接收 Sunshine 的视频与音频，并把触控、键鼠或手柄输入送回主机；手柄兼容由 Sunshine 与 ViGEmBus（虚拟手柄总线）等上游组件承担。；本项目只维护主机显示、网络和运维边界，不记录屏幕内容，也没有在本轮验证手机输入或手柄映射。","所有网络地址均以 100.x.y.z 与 2xxx:: 占位符脱敏展示；状态收集不改系统配置，verify-path-lite.ps1 只追加脱敏巡检日志。"]}],
  usageEntry: "在已配置的主机上用 Moonlight/Artemis 发起连接；先查看 Sunshine、显示目标和指定 Tailscale peer 状态，真实画面与输入仍需手机端验收。",
  usageInputs: ["要连接的主机和手机","希望的画质或远程开机方式","实际遇到的画面、声音或输入问题"],
  title: "Sunshine 远程串流",
  kicker: "用手机或笔记本看见并操作高性能主机",
  route: "/projects/sunshine-remote-streaming",
  visibility: "私有仓库",
  statusTone: "mixed",
  cardStatus: "服务正常；GPU证据阻断切换，手机结果仍未验",
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
  summary: "工作和游戏仍在主机上运行，手机或笔记本通过 Sunshine／Moonlight 接收画面和声音。平时优先使用物理主屏，主屏确实离线才考虑已核对的 MTT1337 VDD（虚拟显示器）作为兜底；项目还管理窗口回迁、虚拟屏参数和网络诊断。它不会为修远程画面就随意改主屏、重启服务或把正在使用的会话当成空闲。",
  why: "高帧率、HDR（高动态范围）和 3D 场景需要 Sunshine/Moonlight 这类低延迟串流，但多屏主机一旦把捕获目标或窗口留在虚拟屏，远程端可能只看见壁纸；反过来，为了救画面盲改主屏、镜像模式或副屏又可能破坏本地工作。这个项目把“先认准设备、再判断是否允许切换、失败时保持现场”做成脚本和可测试规则。",
  plainExample: "“人在外面想用主机玩游戏，先看看为什么只有壁纸，不要乱切家里的显示器。”先区分画面捕获、窗口位置、网络和编码问题；只有设备身份、当前会话与显卡状态允许时才走对应修复，最后用真实客户端画面确认。",
  result: "主机已有主屏优先的守护、专用虚拟屏调整、网络诊断和定期检查入口。手机能否真正直连、画面是否流畅、窗口能否回到主屏以及关机后能否远程启动，仍需要分别在真实设备上验收。",
  readerStates: {"pass":"软件能回读服务和守护状态；只有当前显示设备、显卡和串流会话都允许，才执行对应切换。真实画面仍需在手机上确认。","problem":"9 月 18 日记录了本次开机周期的图形故障，所以当时停止捕获切换和显示写入；服务仍运行，手机是否连接不明。9 月 4 日的输出不匹配只是更早的观察。","unavailable":"主屏和专用虚拟屏都辨认不清、出现其他未知虚拟屏或显卡严重故障时，停止显示改动，保留电脑当前画面和配置。"},
  dataSources: {"title":"主机怎样判断该显示什么、能否连接","intro":"它只读显示设备、窗口、图形故障、网络和串流会话，再决定是否可以修改；公开结果不包含私人网络地址。","rows":[{"source":"Windows 当前显示设备","data":"辨认主屏、专用虚拟屏及其他小屏，避免把会变化的屏幕编号当成固定身份。","result":"选择正确捕获目标；身份不清时停止切换。"},{"source":"普通窗口的位置","data":"在切换前记录符合条件的窗口及原位置。","result":"主屏回来时尝试拉回，并逐窗口检查；不碰桌面底栏、输入法或未知窗口。"},{"source":"本次开机的图形故障","data":"查看 Windows 是否记录显卡或系统图形崩溃。","result":"有严重故障就停止显示改动；本人看到黑屏时也应按实际画面停手。"},{"source":"Tailscale 网络路径","data":"查看两端服务和指定手机到主机的路径。","result":"区分直连、中继或不可达；主机一侧的检查不能代替手机串流。"},{"source":"Sunshine 当前会话","data":"读取本机视频服务是否有人正在串流及可用编码。","result":"有活动或未知会话时不贸然切捕获目标；服务在线不证明手机已看到画面。"},{"source":"手机客户端实际画面与输入","data":"由 Moonlight/Artemis 显示视频和声音，并把触控、键鼠或手柄动作送回主机。","result":"只有实测画面、声音和输入后，才认定远程使用链真正可用。"}],"note":"状态收集不改显示或网络；旧巡检只证明当时观察，不能代替本轮手机体验。"},
  productPrinciples: [{"title":"物理主屏优先，虚拟屏只兜底","detail":"电脑在正常使用时让手机看到主屏；只有主屏确实离线，才考虑专用虚拟屏。主屏回来还要核对窗口与捕获目标。"},{"title":"不为了远程画面改乱本地屏幕","detail":"远程分辨率由串流过程调整，不把 Windows 改成复制屏，也不改变实体屏幕的高刷新率和布局。"},{"title":"直连要当次证明","detail":"能否绕开中继，要看指定手机与主机当时的路径检查。本轮手机路径尚未实测，不能凭主机网络能力宣布直连。"},{"title":"先留带宽余量，再看客户端统计","detail":"从约 18–20 Mbps 试播，给声音和传输额外开销留空间；实际流畅度按手机客户端的丢包、帧率与延迟决定。"},{"title":"显卡不稳就停手","detail":"检测到本次开机中的严重图形故障，就暂停显示切换和相关服务修改，先保住电脑当前可用状态。"},{"title":"自动守护是日常，应急固定要能退回","detail":"平时由守护器决定捕获目标；本人明确要求时才能暂时固定虚拟屏。留下备份不等于已经自动恢复。"},{"title":"先看状态，明确选择后才改","detail":"专用虚拟屏入口默认只展示身份、当前值和支持的模式；本人选择应用后才预检、修改并回读。"}],
  responsibilities: ["平时让 Sunshine 捕获正在使用的物理主屏；主屏确实离线、串流空闲且电脑状态允许时，才交给专用虚拟屏。","主屏恢复后，尝试把属于本次范围的普通窗口拉回，再恢复主屏捕获，并逐项回读结果。","识别水冷屏、机箱小屏和未知虚拟屏，避免把它们误当远程桌面或搬动其窗口。","提供本人明确选择的应急固定虚拟屏入口；改配置、服务采用、手机看到画面和恢复自动守护分开核对。","分别检查 Tailscale 网络路径和 Sunshine 视频会话；“能连到电脑”不等于“手机看见画面”。","给手机客户端提供从约 18–20 Mbps 和可用时 AV1 开始的画质试验起点，再按真实卡顿和延迟调整。","在已知代理残留影响网络时，提供有界修复与再检查，不顺手改其他应用的设置。","沿用现有定期检查和本人暂停选择；任务安装、实际运行和检查结果分别报告。"],
  exclusions: ["继续使用 Sunshine 与 Moonlight/Artemis，不自造另一套远程画面软件。","不通过复制或镜像显示器来救画面；调整专用虚拟屏不改变物理主屏、水冷屏和机箱屏。","无线唤醒未经可靠验证，不把它写成外出开机保证；智能插座或有线唤醒也要实测。","公开页不展示真实家庭网络地址、设备身份或访问凭据。","不会把 Sunshine 管理入口直接无保护地暴露到公网。","显卡状态、屏幕身份、会话空闲或配置未能核对时，不继续写显示配置或重启相关服务。"],
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
  technicalOperatingFlow: [
    { title: "平时在电脑前工作", detail: "设计目标是 Sunshine 捕获活动物理主屏，普通窗口留在主屏工作区，VDD 只作为备用目标；水冷屏与机箱屏不参与。" },
    { title: "主屏确实离线", detail: "关屏不一定等于 Windows 认定显示器离线。只有实时 PnP 与活动输出证据确认主屏稳定缺失 15 秒，守护器才继续判断。" },
    { title: "空闲后允许 VDD 兜底", detail: "若 GPU 稳定门、唯一 VDD 身份和连续 5 秒串流空闲都通过，代码才允许更新捕获目标并迁移符合条件的普通窗口。" },
    { title: "手机端发起连接", detail: "Moonlight/Artemis 可以协商视频、音频和触控、键鼠或手柄输入；当前建议从 18–20 Mbps 与 AV1 起试，但本轮没有验证直连路线、实际编码、帧率或输入。" },
    { title: "用毕断开", detail: "真实客户端断开后，RTSP 会话应释放；是否保持 VDD 捕获以及窗口实际位置要由当时的状态回读决定。" },
    { title: "主屏恢复", detail: "主屏再次被证明健康且串流空闲时，守护器按记录把符合条件的普通窗口拉回并恢复物理捕获；本轮没有做这次前后对照。" }
  ],
  operatingFlow: [{"title":"先确认主机条件","detail":"检查 Sunshine、Tailscale、物理主屏和唯一虚拟屏；平时优先捕获实体主屏。"},{"title":"手机实际连接","detail":"用 Moonlight/Artemis 选择主机，从保守码率和可用编码开始试；路径诊断与画面、声音、输入分别验。"},{"title":"主屏离线才兜底","detail":"守护器满足缺屏、显卡和空闲条件才切虚拟屏，恢复主屏时再回切并核对窗口位置。"},{"title":"失败按层定位","detail":"服务在线不等于可捕获画面；直连、中继、编码、显示和开机条件分别报告，本轮未实测的不写成通过。"}],
  components: [
    { name: "捕获源与窗口故障转移守护器", responsibility: "主屏优先绑定、VDD 兜底计划、RTSP 会话空闲门与 Win32 窗口位置迁移/拉回。", implementation: "sunshine-capture-failover.psm1 与 Invoke-SunshineCaptureFailover.ps1 实现稳态轮询、身份复核和 GPU 事件门。" },
    { name: "VDD 独立显示参数适配器", responsibility: "提供 2880×1800 60Hz 150% HDR 初始配置、CDS_TEST 预检、缩放/HDR 写后回读与首选项持久化。", implementation: "Set-SunshineVddDisplayProfile.ps1 编排 Get-SetVddDisplayMode.ps1、Get-SetVddScaleHdr.ps1 与 sunshine-vdd-display-settings.psm1；真正的 Win32 调用在两个 Get-Set 脚本中。" },
    { name: "应急无头模式配置器", responsibility: "在用户明确选择时把 Sunshine output_name 指向已验证 VDD，并管理 6 个 dd_* 显示键；它不替代日常主屏优先守护。", implementation: "Set-SunshineHeadlessConfig.ps1 与 sunshine-headless-config.psm1 负责候选、提交前绑定复核、同目录原子替换、写后回读与有条件回滚；不会自动重启服务，新增 GPU、会话或身份阻断时会保留未恢复项。本轮未应用。" },
    { name: "Sunshine/Moonlight 输入输出链", responsibility: "Sunshine 输出画面与音频，Moonlight/Artemis 把触控、键鼠或手柄输入送回主机。", implementation: "由上游 Sunshine、客户端与可选 ViGEmBus 提供；本仓库只维护显示与运维边界，本轮未做手机输入 E2E。" },
    { name: "传输层验证与网络一键修复", responsibility: "探测光猫与主机 IPv6 SLAAC 状态，清除 Tailscale 服务的固定代理端口环境变量，固化无人值守模式。", implementation: "repair-stream.ps1（幂等修复）与 verify-path.ps1（深度直连与 DERP 路径诊断）。" },
    { name: "轻量计划任务巡检器", responsibility: "检查服务运行态、编码能力掩码（HEVC/AV1 Main10）、无人值守和公网入口提示并写入运行态日志。", implementation: "复用现有轻量验证任务；注册失败不静默另建触发方式，保留用户停用意图。当前每日任务历史记录不当成新版安装证明。" },
    { name: "隔离自动化验证套件", responsibility: "在内存与沙箱环境中对设备 GUID 计算、窗口搬迁、安全门禁与 AST 语法进行严谨的非破坏性回归测试。", implementation: "tests/ 目录下 4 套核心测试脚本，涵盖 101 项以上严格断言。" }
  ],
  technicalContracts: [
    { artifact: "捕获守护状态记录", schema: "sunshine.capture-failover-state.v1", owner: "Invoke-SunshineCaptureFailover.ps1", boundary: "记录当前模式（Unknown/Physical/Vdd）、主屏缺失时间点、串流空闲时间戳以及已迁移窗口的 HWND/PID/Placement 数组；禁止记录私密窗口标题。" },
    { artifact: "VDD 显示参数与回读边界", schema: "无独立 schema；PowerShell 参数、Win32 结果与 VDD XML", owner: "Set-SunshineVddDisplayProfile.ps1", boundary: "严格限定目标为唯一健康 MTT1337；Get-SetVddDisplayMode.ps1 执行 CDS_TEST，两个原生适配器负责应用/回读，持久 XML 同卷原子替换。" },
    { artifact: "Sunshine 无头配置键集合", schema: "无独立 schema；7 个受控 sunshine.conf 键", owner: "Set-SunshineHeadlessConfig.ps1", boundary: "受管配置的短事务共用互斥、同目录原子替换和写后回读；保留前像，回滚只在当前仍匹配本次postimage时执行。新GPU或会话/身份阻断会停止不安全恢复，未恢复项单独报告；不自动重启或声称手机画面已验。" },
    { artifact: "轻量巡检日志记录", schema: "verify-lite.log format", owner: "verify-path-lite.ps1", boundary: "仅输出时间戳、WLAN IPv6 计数、服务状态、Sunshine 编码掩码、unattended 状态与脱敏公共暴露提示，绝不持久化明文 IP 或凭据。" }
  ],
  usageExamples: [
    { moduleSlug: "capture-failover", ask: "如果我直接拔掉显示器线，Sunshine 会怎样？窗口会丢吗？", effect: "代码会先确认主屏持续缺失、串流空闲、GPU 稳定和 VDD 唯一，再计划切换和窗口迁移；隔离测试已过，但真实拔线后的手机画面与窗口回迁仍未验。" },
    { moduleSlug: "capture-failover", ask: "自动守护坏了，我能先让 Sunshine 固定抓 VDD 吗？", effect: "先预览唯一VDD及当前会话、GPU、配置；明确Apply后在原互斥内保存前像、原子写入并回读output_name。配置失败仅在目标仍匹配本轮结果时恢复；不自动重启Sunshine，需另行验证真实手机画面。" },
    { moduleSlug: "vdd-display-settings", ask: "我想把手机远程画质改成 2560×1440 120Hz，会影响我电脑主屏吗？", effect: "入口只接受经过身份验证的 VDD，默认先回读；只有显式 -Apply 才向 VDD 写入。代码不向物理屏发写入，但物理屏是否保持不变仍需独立前后验收。" },
    { moduleSlug: "transport-ipv6-direct", ask: "我在外面用手机移动 5G，为什么经常连不上家里的 Tailscale 串流？", effect: "先分别检查本机 IPv6、Tailscale 状态和指定手机 peer；只有 peer 探测返回 direct 才能说直连，返回 DERP 或未提供 peer 都不能说数据不出海。" },
    { moduleSlug: "bitrate-codec-strategy", ask: "我把串流码率拉到 50 Mbps 画面会不会更清楚？", effect: "按文档记录的约 32 Mbps 上行，先从 18–20 Mbps CBR 与 AV1 试起更稳妥；是否卡顿、丢包或更清楚必须看真实会话统计。" },
    { moduleSlug: "remote-power-and-repair", ask: "电脑关机了，我能直接用手机通过 Wi-Fi 把电脑叫醒吗？", effect: "Wi-Fi 网卡在关机后不一定保持可唤醒供电，WoWLAN 不作为可靠默认；可以实测有线 WoL 或“智能插座 + BIOS 来电自启”，但本轮没有证明任一路线已经完成远程物理开机。" },
    {
      "moduleSlug": "capture-failover",
      "ask": "先看看为什么不能切换，别动显示器，也别断开现在的远控。",
      "effect": "窗口只读显示服务、当前worker、GPU阻断与会话状态；Unknown不是空闲。可以明确暂停后续检查，但打开或关闭窗口不会改显示、重启网络或覆盖当前连接。"
    },
  ],
  evidenceLayers: [
    { layer: "Source（源码与配置）", proves: "PRIVATE main 与 origin/main 已对齐到 3f3ebed784cd1a7dfccabd09e1b1f7ebb3c5be55；此前 BugCheck/WER GPU 事件门仍保留，后续补齐可见健康、VDD 分阶段事务、写后回读与有条件回滚。", doesNotProve: "源码提交不证明现役 output_name 已正确、真实硬件切换成功，也不证明手机操控的延迟、画质或弱网稳定性。" },
    { layer: "Tests（隔离自动化测试）", proves: "4 套独立 PowerShell 测试套件通过全部 101 项以上断言，覆盖 GUID 唯一绑定、窗口阴影边框容差、GPU 崩溃门禁与原子写入。", doesNotProve: "测试不模拟硬件显卡真正拔线、屏幕物理掉电或真实的 Windows 蓝屏事件。" },
    { layer: "Runtime（当前系统运行态）", proves: "2026-09-18只读健康：Sunshine/Tailscale运行，worker新鲜；9月16日起本次启动周期有20条LiveKernel图形故障记录，BlockedByGpuStability，客户端会话Unknown。9月13日每日巡检与9月14日服务观察仍各保留原日期。", doesNotProve: "旧9月4日22条和9月14日状态不能替代本次启动周期证据；20条是日志记录数，不是20次独立崩溃。worker新鲜、捕获当前为VDD也不证明手机可交互或此时能安全切换。" },
    { layer: "Transport（传输与网络）", proves: "2026-09-14只读诊断确认Tailscale 1.102.2运行、在线且无人值守；WLAN非链路本地IPv6地址数为0。最新每日巡检未指定手机peer（对端）。", doesNotProve: "当前手机路线是 direct 还是 DERP、串流数据经过哪里、延迟和丢包均为 Unknown（未知）。巡检还提示另有用户配置的 Funnel，但未把它归因于 Sunshine。" }
  ],
  operationalEntrypoints: [
    { name: "只读运行态路径轻量验证", command: "pwsh -NoProfile -File .\\verify-path-lite.ps1", purpose: "以只读方式检查本机 IPv6、服务状态、Sunshine 编码能力掩码与 Tailscale 无人值守状态，写入 runtime 日志。" },
    { name: "网络与服务幂等修复入口", command: "pwsh -NoProfile -File .\\repair-stream.ps1", purpose: "重新绑定网卡 IPv6，清理服务环境变量残留的固定代理端口，固化 Tailscale 无人值守并拉起服务。" },
    { name: "深度传输路径与对端探测", command: "pwsh -NoProfile -File .\\verify-path.ps1 -PhoneTailscaleIp <peer-ip>", purpose: "仅在显式传入手机 Tailscale IP 时，验证手机与电脑之间是走公网 IPv6 直连还是海外 DERP 中继。" },
    { name: "VDD 独立显示参数回读与调整", command: "pwsh -NoProfile -File .\\Set-SunshineVddDisplayProfile.ps1 -Width 2880 -Height 1800 -RefreshRate 60 -ScalePercent 150 -HdrMode Hdr [-Apply]", purpose: "默认只读核对身份、当前值与支持模式；显式 -Apply 后的事务才先执行 CDS_TEST，再应用、回读并持久化首选项。" },
    { name: "捕获守护计划任务注册与更新", command: "pwsh -NoProfile -File .\\Install-SunshineCaptureFailoverTask.ps1 [-Apply]", purpose: "默认预检；显式加上 -Apply 在 Windows Task Scheduler 注册无窗后台守护任务。" },
    { name: "应急无头捕获模式切换", command: "pwsh -NoProfile -File .\\Set-SunshineHeadlessConfig.ps1 [-Apply]", purpose: "在极端情况下将 Sunshine 捕获源强行指向 VDD 并保持所有拓扑改动选项处于 disabled 状态。" },
    {
      "name": "只读联合维护窗口",
      "command": "E:\\PCConfig\\tools\\Show-StreamingMaintenance.ps1",
      "purpose": "查看串流与缓存守护，精确控制既有循环或未来触发；打开窗口不启工作循环、不改配置，关闭不等于停止任务。"
    },
  ],
  evolution: [
    {
      "date": "2026-06–07",
      "title": "把远程画面与网络入口接起来",
      "commit": "",
      "result": "形成已有串流工具的安装、任务和诊断路线；服务正常与真正收到画面分开。",
      "evidence": [
        {
          "date": "2026-06-26—2026-07-09",
          "note": "已有串流工具的常驻、任务与路径巡检起点。 原记录的依据标签为“基础串流与路径巡检”，未附Git提交编号。"
        }
      ]
    },
    {
      "date": "2026-08–09",
      "title": "避免修远程端却打乱本地桌面",
      "commit": "",
      "result": "物理主屏优先，虚拟屏只在明确条件下兜底；普通窗口回迁、虚拟屏参数和显卡稳定性分别检查，自动拓扑联动保持关闭。",
      "evidence": [
        {
          "date": "2026-08-05—2026-08-08",
          "note": "传输和登录前边界分开，服务正常不证明画面已经可捕获。 原记录的依据标签为“传输与登录前边界”，未附Git提交编号。"
        },
        {
          "date": "2026-08-10—2026-09-02",
          "note": "物理主屏优先、窗口恢复、GPU事件限制与VDD参数分工形成；真实手机及物理显示验收独立。 原记录的依据标签为“主屏优先、窗口恢复与 VDD 参数”，未附Git提交编号。"
        }
      ]
    },
    {
      "date": "2026-09-18",
      "title": "切换失败能回到原配置",
      "commit": "3f3ebed",
      "result": "可见健康和暂停意图与现有守护配合，配置修改前后核对身份并保留回退；客户端未知不当空闲，未验手机路线不写成保证。"
    }
  ],
  snapshotUpdateNote: "2026-09-18只读健康与正式来源3f3ebed核对：worker新鲜，GPU图形故障20条，本次会话Unknown；只更新说明，未Apply、改网络、重启或串流。",
  "readerBoundary": "服务运行和编码支持不保证手机直连、不卡顿或远程冷开机。当前会话未知或本次启动出现显卡故障时，不冒险切换显示；真实手机与物理显示恢复仍需单独验收。",
};

export const sunshineRemoteStreamingModules = [
  {
    slug: "capture-failover",
    usageEntry: "在已配置的 Sunshine 守护环境中查看当前捕获目标；实际切换由守护器在主屏确实离线且串流空闲时进行，本页不能代替真实画面验收。",
    usageInputs: ["要远程看的主机与屏幕","是否希望主屏离线时使用专用虚拟屏","窗口位置异常时指出现象"],
    productFlow: [{"title":"先读主机现场","detail":"守护器辨认物理主屏、专用虚拟屏和当前有没有人在串流；主屏正常时优先显示它，并拉回误入虚拟屏的普通窗口。"},{"title":"满足条件才兜底","detail":"主屏稳定离线、显卡状态允许且串流空闲后，才记下窗口位置并切到唯一的专用虚拟屏。"},{"title":"主屏恢复后再读回","detail":"条件允许时尝试把窗口和捕获目标拉回主屏；实际窗口位置与手机画面还要分别检查。"}],
    readerStatus: "9月18日记录中守护仍在运行，但当前开机周期的显卡故障阻止画面切换；手机画面与真实主屏故障转移仍未验收。",
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
    status: "worker新鲜但GPU证据阻断，客户端Unknown；真实切换和手机验收仍未完成",
    statusTone: "mixed",
    value: "目标体验仍很直白：在家用物理屏，主屏确实离线时才让 VDD 兜底，主屏回来后把普通窗口拉回；现在已经有实现和测试，但还不能把这段目标场景说成真机成功。",
    why: "多屏扩展下，Windows 可能把新开或失去焦点的窗口放到看不见的扩展屏；如果盲目开启“系统镜像”，又可能打乱物理屏高刷与 HDR（高动态范围）。因此需要一套先核对身份、再决定是否动作的窗口与捕获目标守护器。",
    example: "“家里的主屏真的不在线了，我想从手机继续看电脑。”守护器先确认屏幕已稳定离线、没人正在串流、显卡状态可用，才切到已认准的虚拟屏；主屏回来还要实际看窗口有没有回去。",
    result: "已经有屏幕识别、等待、空闲检查和窗口回迁的实现与测试；还没有真实证明拔线后手机画面不中断或所有窗口都能回到原处。",
    readerStates: {"pass":"代码已覆盖应当保持主屏、何时尝试虚拟屏与如何计划窗口回迁；真实手机画面和拔线前后对照仍未验收。","problem":"9 月 18 日这次开机已有图形故障记录，所以当时停止捕获和显示写入；手机是否连接仍未知，更早的画面观察不能替代本次。","unavailable":"虚拟屏不唯一或驱动身份不清时停止切换，不把画面送到猜测的屏幕。"},
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
      "tests/Test-SunshineCaptureFailover.ps1 提供 67 项自动化单元与模拟测试，覆盖已建模的身份、去抖、窗口与故障分支。",
      "会话检测Active/Idle/Unknown三态，端口随Sunshine当前base-port解析；缺监听、失败或进程身份不符为Unknown。短写操作共用互斥，runtime/worker-health.json绑定PID、创建时间、源码SHA和上次完整循环，旧心跳不能续成健康。",
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
      { term: "RTSP 空闲门（Idle Gate）", explanation: "会话须明确Idle并连续5秒才累计安全空闲；查询失败、RTSP监听缺失或进程不符为Unknown，不会当没有客户。实际端口来自当前base-port，不固定猜默认值。" }
    ],
    boundaries: [
      "不通过系统级复制/镜像显示器实现画面同步，杜绝模式冲突。",
      "不触碰 Shell 桌面底栏、输入法、全屏独占游戏或无法证明归属的未知句柄窗口。",
      "当前周期内存在显卡崩溃时，坚决禁止执行任何显示拓扑写操作。"
    ],
    failures: [
      { condition: "检测到多于一个同名 VDD 或存在未知虚拟驱动", response: "拒绝推断目标，执行失败关闭，保持当前配置不动并记录错误日志。" },
      { condition: "当前 Windows 启动发生过 Kernel-Power 41、BugCheck、nvlddmkm 或匹配 WER 图形故障", response: "保持BlockedByGpuStability，不切捕获或显示；只有空闲且证明来自VDD、目标是健康物理主屏的普通窗口单向回迁可独立处理，不任意搬窗。" },
      { condition: "单轮显示枚举瞬时失败（如驱动重置）", response: "代码把它记为 cycle-transient-failure 并留待下一轮；自动化测试覆盖了不让该异常直接终止守护器的分支。" },
      { condition: "人工无头写入前 VDD 身份或原配置变化", response: "拒绝覆盖；若已写入，仅在当前仍匹配本轮结果且 GPU、会话、身份门允许时回滚，未恢复项单独报告。工具本身不自动重启 Sunshine，也不把备份冒充恢复成功。" }
    ],
    sources: [
      { path: "sunshine-capture-failover.psm1", role: "核心状态机、窗口几何与原子配置读写引擎" },
      { path: "Invoke-SunshineCaptureFailover.ps1", role: "常驻轮询执行体与空闲门检测" },
      { path: "Set-SunshineHeadlessConfig.ps1", role: "人工应急固定 VDD 的只读预览与显式写入入口" },
      { path: "tests/Test-SunshineCaptureFailover.ps1", role: "67 项高强度自动化回归测试套件" }
    ],
    verification: [
      "自动化测试 67/67 通过（涵盖设备快照、GUID 绑定、去抖、CAS 写入、BugCheck/WER/GPU 事件门和窗口计划）；它们是合成分支，不是物理串流。",
      "历史记录：2026年9月4日曾发现 output_name 与活动输出不匹配，并被当次 GPU 稳定门阻断。这是带日期的旧故障；不能拿它替代9月18日的当前启动周期证据，也不能由后来状态文件更新推定真实捕获已通过。",
      "capture-failover-state.json沿用sunshine.capture-failover-state.v1；本次UpdatedAtUtc为2026-09-14T04:20:38.1960156Z，Mode=Vdd、PendingTargetKind=Physical。状态新鲜不证明捕获选择或窗口迁移已通过。",
      "系统计划任务 SunshineCaptureFailover-Interactive 保持 Running 状态。"
    ],
    relation: "为整个远程串流系统提供坚固的显示可用性基石；与 VDD 独立显示参数管理及传输层紧密协作。"
  },
  {
    slug: "vdd-display-settings",
    usageEntry: "用项目的 Set-SunshineVddDisplayProfile.ps1 先只读查看专用虚拟屏；确认目标模式后才显式使用 -Apply。",
    usageInputs: ["想调整专用虚拟屏的分辨率、刷新率、缩放或 HDR","只查看还是应用改变"],
    productFlow: [{"title":"只读认准虚拟屏","detail":"先看项目专用虚拟屏现在的画面大小、刷新率和可选范围；主屏和其他小屏不进入修改范围。"},{"title":"本人确认后才调整","detail":"按选定的清晰度、缩放和高动态范围设置预检，再应用；驱动不支持就停。"},{"title":"回读真实显示","detail":"分别查看虚拟屏是否达到目标、主屏是否保持原样；配置成功仍需真实串流画面验收。"}],
    readerStatus: "已有独立调整虚拟屏参数和失败回退的功能；本轮未应用设置，实际显示和手机画面仍未验收。",
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
    why: "虚拟屏重启后可能退回很小的画面；普通显示工具又容易连带改动主屏。这个入口只认项目专用的虚拟屏，先查看它支持什么，再按本人选择调整。",
    example: "“把手机用的虚拟屏调成我指定的清晰度和刷新率，别动家里主屏。”先只读查看当前值与可选模式；本人确认后才应用，并分别回读虚拟屏和主屏。",
    result: "已得到独立参数入口、写前预检、写后回读与失败回滚；实时模式、重枚举后的首选项保持和手机 HDR 画面仍未在本轮验收。",
    readerStates: {"pass":"选定模式得到实际应用和读回；物理屏确实未受影响还要比较它的前后状态。","problem":"驱动不支持所选分辨率或刷新率时在修改前停止并说明可选模式。","unavailable":"认不出唯一的项目虚拟屏就拒绝修改任何显示器。"},
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
      "tests/Test-SunshineVddDisplaySettings.ps1 与 Test-SunshineVddNativeAdapter.ps1 提供 19 项以上严格测试保障。",
      "完整VDD profile按命名参数哈希表分阶段执行实时模式、DPI/HDR及最终XML；完整预检先于效果，原值和回滚结果分别保存。独立模式/DPI适配器也按已尝试字段恢复并精确回读，XML只回滚本次postimage，保留调用方preimage路径与并发变化。回滚前重验GPU/会话/同一VDD，新增阻断保留未恢复项。",
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
    usageEntry: "在两端 Tailscale 在线后，用项目 verify-path 或 verify-path-lite 指定真实 peer 做有界路径检查；之后由 Moonlight/Artemis 建立一次真实串流才验画面。",
    usageInputs: ["要连接的手机和主机","想诊断直连、中继还是实际串流故障"],
    productFlow: [{"title":"确认指定手机和主机","detail":"先看两端 Tailscale 是否在线，再对这台手机做当次网络路径检查。"},{"title":"分清直连和中继","detail":"诊断会报告直连、经过 Tailscale 中继或不可达；任何一种都不能单靠主机网络配置猜出来。"},{"title":"实际连接再验画面","detail":"Moonlight/Artemis 连上后再看声音、画面与输入；路径通过仍不等于串流可用。"}],
    readerStatus: "主机网络服务正在运行，但没有本轮手机对端探测；目前不能确认手机走直连、中继或实际延迟。",
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
    status: "Tailscale 1.102.2运行且无人值守；WLAN未见非链路本地IPv6，手机peer（对端）未测",
    statusTone: "mixed",
    value: "人在外面连不上时，不必把 Sunshine、光猫和 Tailscale 混成一个问题：这套入口能先定位本机有没有 IPv6、服务是否登录，再用同一台手机证明当前到底直连还是中继。",
    why: "手机网络和家里网络可能各有阻挡。即使主机有 IPv6，也只有指定手机当次探测才能说明走的是直连、中继还是根本连不上。",
    example: "“我在外面连主机很慢。”先对这台手机和主机检查网络路径：若走中继，就说明这次没有直连；之后还要在 Moonlight/Artemis 真正看画面。",
    result: "能分别说明本机服务状态和指定手机的连接路径；本轮没有手机端实测回执，所以不承诺直连速度或延迟。",
    readerStates: {"pass":"指定手机到主机的当次探测确实返回直连，才称这次直连；实际串流体验仍另验。","problem":"只走中继时如实报告，画质和延迟需按手机实测调整。","unavailable":"家里失去网络地址或 Tailscale 没登录时先修连接；恢复后仍需重新探测同一手机。"},
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
      "2026-09-13T06:30:05Z自然巡检日志记录Tailscale Running、start-mode=Auto、状态命令exit=0；9月14日服务只读复核仍为Running/Auto。",
      "2026-09-04 回读 Tailscale 1.102.2 为 online，且 tailscale-unattended=true。",
      "同一每日巡检明确记录 tailscale-ping skipped，因为没有提供 peer；当前直连/DERP 路线未证。",
      "巡检提示存在用户配置的 Funnel；没有输出端点，也没有证据把它归为 Sunshine。"
    ],
    relation: "为串流链路提供可分层诊断的传输入口；它能证明服务和指定 peer 路径，但不能替代手机画面与输入 E2E。"
  },
  {
    slug: "bitrate-codec-strategy",
    usageEntry: "在 Moonlight/Artemis 的串流设置中从约 18–20 Mbps、60 FPS 和可用时 AV1 开始试播，再按真实解码与网络表现调整。",
    usageInputs: ["希望优先保证清晰、流畅还是低延迟","试播时看到的卡顿、画质或 HDR 问题"],
    productFlow: [{"title":"选起点","detail":"按约 32 Mbps 上行预算选择保守码率，不把计算预算当测量。"},{"title":"让客户端协商","detail":"Sunshine 暴露多种编码，手机客户端决定实际格式；HDR 还取决于完整链路。"},{"title":"看画面再调","detail":"实际检查延迟、卡顿、画质与音频；本轮没有真实串流，不给出已达成的帧率或码率结论。"}],
    readerStatus: "主机编码能力已有回读，手机初始码率只是建议；弱网下的画面、帧率与丢包尚未实际验证。",
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
    why: "家里上行带宽要同时装下视频、声音和传输开销。先留余量，再依据手机客户端统计调整，不能从一份旧带宽估计保证今天的帧率。",
    example: "“我先在手机端设 18–20 Mbps、60 FPS（每秒帧数）和 AV1，连接后观察丢包、网络延迟、解码耗时与实际帧率；不稳就退到 12–15 Mbps，稳定后再逐步上调。”",
    result: "已形成可解释的初始参数和回退方法，并确认主机具备 AV1 Main10 能力；当前没有真实会话数据证明零丢包、稳定 60 FPS 或 AV1 画质一定更好。",
    readerStates: {"pass":"手机真实连上后，编码、画质、丢包和延迟符合本人的使用目标，才算这一档设置可用。","problem":"画面卡顿或排队延迟变大时，先降低码率并重新看统计，不因为推荐过某个数值就坚持它。","unavailable":"手机无法解码首选格式时换一种双方支持的编码，再做同一次真实试播。"},
    decisionImpact: [
      "把 README 记录的约 32 Mbps 上行当作配置依据，而不是永不变化的带宽保证；18–20 Mbps 是带余量的起点。",
      "受限链路优先使用 CBR（恒定码率）而不是 CQP（恒定量化参数），目的是减少复杂画面的码率峰值；客户端并未被本仓库强制锁定。",
      "RTX 5090 D 负责主机端 AV1 硬件编码，骁龙 8 Elite 负责手机端 AV1 硬件解码。两端具备能力，因此建议先试 AV1；它不证明真实会话已协商成功，与 HEVC 的画质和解码延迟差异仍须同条件实测。",
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
      { condition: "手机没有可用 AV1 硬件解码，或本次 AV1 协商失败", response: "可在客户端尝试 HEVC Main10，重新连接后查看实际编码、解码和延迟统计；更换设置本身不等于串流已经恢复。" },
      { condition: "外网弱网环境下延迟波动加剧", response: "临时在手机端将码率下调至 12–15 Mbps，降低丢包几率。" }
    ],
    sources: [
      { path: "README.md", role: "带宽计算公式、码率推荐表与编解码器选型深度论证" },
      { path: "verify-path-lite.ps1", role: "主机硬件编码能力掩码只读验证" }
    ],
    verification: [
      "2026-09-13T06:30:05Z自然巡检记录编码能力掩码0x1F0301，hevc-main10=true且av1-main10=true；未建立手机会话。",
      "Sunshine 配置文件固化高质量 NVENC P5/双遍参数。"
    ],
    relation: "决定了远程可交互体验的实际质感；与下层网络通道及上层显示配置紧密相连。"
  },
  {
    slug: "remote-power-and-repair",
    usageEntry: "需要远程开机时先核对 BIOS、智能插座或有线 WoL 条件；日常用现有 verify-path-lite 检查服务，故障再明确运行 repair-stream。",
    usageInputs: ["想用智能插座还是有线 WoL 开机","本次遇到开机、发现主机还是画面输入故障"],
    productFlow: [{"title":"先选真正能开机的方式","detail":"智能插座复电要主板支持来电启动；有线网络唤醒也需硬件与路由条件。选好后用真实关机试。"},{"title":"电脑启动后查服务","detail":"再看 Tailscale 和 Sunshine 是否运行、网络能否到达；服务在运行不等于登录前已经有画面。"},{"title":"最后由手机验收","detail":"Moonlight/Artemis 要真正发现、连接、看到画面并试输入；本轮没有完成时保持未知。"}],
    readerStatus: "软件服务和日常巡检有成功记录；智能插座、主板来电启动和网络唤醒的整条远程开机路径尚未验收。",
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
    readerStates: {"pass":"上次软件侧看到两项服务在运行、巡检正常；主机从关机到手机看到画面的整条链仍未验。","problem":"网络设置残留或服务异常时，修复脚本按已识别范围处理并回读；结果不满足就报告失败，不宣称远程已恢复。","unavailable":"主机没电、物理断网或硬件开机条件不存在时，需要先在现场恢复这些基础条件。"},
    decisionImpact: [
      "比较三种远程唤醒路线：优先实测“智能插座 + BIOS 来电自启（Restore on AC Power Loss）”；有线 Realtek 2.5GbE WoL（网络唤醒）是另一候选；纯无线 WoWLAN（无线局域网唤醒）不作为可靠默认。",
      "坚决不默认开启 Windows 自动登录，守住物理主机的本地身份安全底线；串流服务本身具备系统级捕获能力。",
      "编写 repair-stream.ps1 提供完全幂等的修复流程：自动重开 WLAN 网卡 IPv6 绑定、清理被污染的环境变量、拉起服务并固化 unattended 模式。",
      "现役任务保持原触发与用户停用意图；注册失败明确报错，不自动创建另一种调度。历史每日23:30任务与未来实际安装分别回读。"
    ],
    problem: "解决离家后电脑关机无法唤醒、以及系统更新或网络代理异常导致的服务离线问题。",
    implementation: [
      "硬件候选：确认主板支持并显式启用 Restore on AC Power Loss = Power On，再用智能插座做完整断电/上电循环；本轮未验证。",
      "网卡候选：插入有线网络，确认 Realtek 2.5GbE 的魔术包与关机网络唤醒，再从家内可达设备发包；本轮未验证。",
      "网络修改需精确选择ServiceProxy、AdapterIPv6或IPv6Policy；网卡需名称，服务代理重启Tailscale还需AllowNetworkRestart。保存原值与收据，失败逆序恢复，回滚失败不假定恢复默认即成功；任务注册失败不改投另一种触发。"
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
      "每日任务最近于2026-09-13T06:30:01Z运行并返回0，同次日志06:30:05Z完成；手机peer探测被跳过，不证明冷开机或登录前捕获。"
    ],
    relation: "把离线开机、Windows 服务启动和在线故障修复拆成三段；当前只有服务与巡检段有现场证据。"
  }
];

export const project = sunshineRemoteStreamingProject;
export const modules = sunshineRemoteStreamingModules;
