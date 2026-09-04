import { createProjectSnapshot } from "./project-snapshot.js";

const sunshineRemoteStreamingSnapshot = createProjectSnapshot({
  observedAt: "2026-09-04",
  label: "现役串流服务与传输层正常常驻；捕获守护交互任务运行中；受限于当前 MTT 隔离任务持有只读避让边界，本轮未发起交互式手机端远程串流与物理插拔验证",
  boundary: "这是对 PRIVATE（私有）源码与截至 2026-09-04 的脱敏本机运行态合并快照；进程在线、服务自动启动、自动化测试和配置存在都不能替代手机真实端到端串流、弱网体验或断电唤醒验收",
  metrics: [
    { label: "主屏 / 兜底 VDD", value: "4K 240Hz / 2880×1800 HDR" },
    { label: "上行限额 / 远程码率", value: "32 Mbps / CBR 18–20 Mbps" },
    { label: "编码路线", value: "RTX 5090 D 硬编 + 骁龙 8 Elite 硬解（AV1）" },
    { label: "源码隔离测试", value: "4 套测试（101+ 断言）全部通过" }
  ],
  facts: [
    { label: "它真正解决的事", value: "把家里的高性能台式电脑（RTX 5090 D + Ryzen 9 9950X3D）变成在外面用手机（小米 15 Pro）就能随时低延迟、高画质操控的远程工作站；同时守住显示拓扑与显卡稳定，绝不让窗口漂进看不见的虚拟屏，也不碰机箱水冷屏。" },
    { label: "主屏优先与 VDD 兜底", value: "Sunshine 默认捕获 4K 240Hz HDR 活动物理主屏，画面由编码器自适应缩放；主屏正常时不改变主屏分辨率与排列。只有物理主屏稳定缺失 15 秒且串流连续空闲 5 秒时，才安全切换至唯一健康的 2880×1800 HDR MTT1337 VDD（虚拟显示驱动）兜底并迁移窗口；主屏恢复后自动拉回窗口。" },
    { label: "严禁拓扑联动与镜像", value: "坚决不使用 Windows“复制显示器”，坚决不开启 Sunshine 的 ensure_only_display（仅确保单显示器）或自动分辨率改写；VDD 参数与物理主屏完全独立，杜绝多屏模式联动导致黑屏或显卡驱动崩溃。" },
    { label: "水冷屏与机箱屏保护", value: "LIAN LI（联力）水冷屏与 HS2 机箱屏严格列为禁止目标与禁止区域；窗口迁移与 Sunshine 捕获绝对不选它们，也不允许任何远程窗口漂入这些副屏。" },
    { label: "GPU 稳定性故障关闭", value: "若当前系统启动已记录 Kernel-Power 41、nvlddmkm 或显卡 live kernel 事件，系统自动进入 BlockedByGpuStability（因 GPU 不稳定阻断）状态，停止一切捕获源修改、模式切换与主屏到 VDD 的窗口迁移，只允许单向拉回主屏。" },
    { label: "传输层解耦与 IPv6 直连", value: "串流层（Sunshine + Moonlight/Artemis）与传输层（Tailscale）彻底解耦；通过打通移动光猫与 Windows 的公网 IPv6 双栈，建立裸 WireGuard UDP P2P（点对点）直连，绕开移动三层 NAT 与海外 DERP（中继服务器），串流核心数据完全在国内骨干网、不出海。" },
    { label: "受限上行带宽码率预算", value: "家庭宽带上传带宽仅约 32 Mbps；远程蜂窝串流强制使用 CBR（恒定码率）18–20 Mbps 并留足 FEC（前向纠错）与音频开销（总计约 24.5 Mbps），坚决不用 CQP（动态画质量化）防止复杂场景爆上行导致卡死。" },
    { label: "AV1 硬编硬解优势", value: "小米 15 Pro 骁龙 8 Elite 支持 AV1 硬解，RTX 5090 D 支持 AV1 硬编；在 20 Mbps 窄带宽下 AV1 的画面纯净度与文字锐度显著优于 HEVC；局域网无限带宽下则可切换 HEVC 120Hz 享受极低解码延迟。" },
    { label: "远程唤醒可行性认知", value: "纯无线 Wi-Fi WoWLAN（无线局域网唤醒）在关机/睡眠断电后极不可靠；远程唤醒首选“智能插座 + BIOS 来电自启”，局域网唤醒则依赖插网线走 Realtek 2.5GbE 有线 WoL。" },
    { label: "幂等修复与轻量监控", value: "提供 repair-stream.ps1 幂等恢复网卡 IPv6 绑定、清理被固定端口覆盖的代理服务环境并固化 Tailscale 无人值守偏好；提供 verify-path-lite.ps1 每日无侵入验证路径与编码掩码；4 套隔离测试共 101 项以上断言已全部验证通过。" }
  ],
  gaps: [
    "当前 operations/mtt-vdd-isolation 由其他任务持有，本任务严格只读避让，未执行带 -Apply 的显示写入、服务重启或实机串流打扰。",
    "本轮未发起从小米 15 Pro 手机端的真机交互式远程串流连接验收；服务常驻与编码掩码正常不代表真机操控体验。",
    "未做拔掉物理显示器线缆或硬件关屏的破坏性 failover（故障转移）真实演练；去抖与窗口迁移由经过验证的 67 项自动化测试保障。",
    "未进行外网断电后通过智能插座远程冷开机的实物验证；WoL 与 AC 来电自启目前基于硬件驱动与网络拓扑推演。"
  ]
});

export const sunshineRemoteStreamingProject = {
  order: 22,
  slug: "sunshine-remote-streaming",
  title: "Sunshine 远程串流",
  kicker: "高性能电脑远程工作站运维层 · 主屏优先与VDD兜底 · 2026-09-04 核对",
  route: "/projects/sunshine-remote-streaming",
  visibility: "私有仓库",
  statusTone: "pass",
  cardStatus: "串流与传输层健康常驻；测试全通；严格避让受保护的显示拓扑与现役配置",
  cardStatusTone: "pass",
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
      "Tailscale 1.98.4",
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
      "受限上行使用CBR和AV1保障窄带不卡顿",
      "GPU不稳定时失败关闭阻止任何显示拓扑修改"
    ],
    failureRecovery: [
      "物理主屏恢复时窗口自动安全拉回主屏",
      "GPU崩溃后禁止修改拓扑，失败关闭",
      "Tailscale掉登录时清除固定代理端口覆盖并设unattended",
      "避免使用CQP动态码率防止打爆上行",
      "只读避让现役显示隔离任务防止串流干扰"
    ]
  },
  repositoryNote: "sunshine-remote-streaming 是 PRIVATE（私有）运维项目。公开页面严密脱敏，只阐明系统架构、产品逻辑、算法机制、配置原则与脱敏后的技术回执，绝不包含真实内网 IP、Tailnet 名称、设备名称、家庭网段、Funnel 真实端点或任何私密凭据。",
  summary: "这是把顶级硬件台式机（RTX 5090 D + 9950X3D）打造成手机端低延迟、可交互远程工作站的运维控制层。通过 Sunshine + Moonlight/Artemis 与解耦的 Tailscale 传输层，配合创新的“物理主屏优先、MTT1337 虚拟显示器（VDD）安全兜底”与 Win32 窗口位置守护机制，彻底解决远程桌面看不见窗口、虚拟屏黑屏、误抓机箱副屏、移动网络穿透失败及上行带宽卡死等核心痛点。",
  why: "普通远程桌面（如 RDP、ToDesk）在游戏、3D 建模或高帧率 HDR 场景画质与延迟不足；而原生 Moonlight 串流通常要求直连物理屏，关屏或拔线即失效。市面常见的虚拟屏扩展方案又极易将应用窗口遗失在壁纸扩展区，甚至在显卡驱动更新或多屏混用时破坏物理屏排布、打乱副屏显示。本项目通过自研守护逻辑与严密边界，让高性能主机无论亮屏还是关屏都能随时安全交付远程交互能力。",
  plainExample: "我在外面拿出小米 15 Pro 手机打开 Artemis（阿西西），点进家里电脑就能直接以 2880×1800 60Hz HDR 操控桌面或运行大型任务。回到家坐到电脑前，显示器亮起，所有窗口已经整整齐齐回到 4K 240Hz 物理主屏上，机箱水冷屏始终显示硬件监控，没有任何错位或残留。",
  result: "获得随时随地可用的毫秒级延迟远程操控能力；网络走国内端到端 IPv6 直连，不依赖海外中继，码率稳稳控制在家庭上行限度以内；主机显示拓扑与多屏环境坚固安全，绝不因远程访问而发生排布混乱或显卡驱动异常。",
  readerStates: {
    pass: "串流服务常驻运行，端到端网络路径与编码器就绪，主屏/VDD 状态机与窗口守护规则闭环验证通过。",
    problem: "若遇到家庭宽带 IPv6 前缀变化、服务代理配置残留或出现 GPU 异常事件，系统安全回退至保护模式并提供明确幂等修复入口。",
    unavailable: "当物理主屏与 VDD 均无法证明健康、出现未识别的虚拟显示器、或检测到严重显卡崩溃时，执行 fail-closed（失败关闭），严禁盲目写入配置破坏现场。"
  },
  dataSources: {
    title: "系统从哪里采集状态，如何保障边界安全",
    intro: "系统通过 Windows 原生活动显示快照、cfgmgr32 设备状态、Win32 窗口位置 API、系统事件日志与 Tailscale/Sunshine 本地管理接口读取状态；严格保护用户私人网络与多屏环境。",
    rows: [
      { source: "Windows 活动显示快照与 EDID", data: "实时枚举物理主屏、MTT1337 VDD 与副屏硬件身份；绕过易报错的 CIM/WMI，直接以 PnP 实例 ID 与 EDID 计算 Sunshine UUIDv5 标识。", result: "精准锁定捕获目标；严防 DISPLAY 编号飘移，坚决剔除 LIAN LI 水冷屏与未知虚拟屏。" },
      { source: "Win32 窗口几何与放置（Placement）", data: "在切换至 VDD 前保存正常窗口的 HWND、PID、进程启动时间与窗口位置矩形；监听相邻屏幕不可见边框容差（11–13 像素）。", result: "确保主屏恢复时精准无损回迁窗口；避免因微小阴影边框触碰而产生误判迁移。" },
      { source: "Windows 系统事件日志（System Log）", data: "只读查询当前开机周期内是否存在 Kernel-Power 41、nvlddmkm 14/153 或 NVIDIA LiveKernelEvent 等严重硬件故障。", result: "检测到不稳定信号立即阻断拓扑切换与服务重启，确保硬件与系统高可用。" },
      { source: "Tailscale 本地网络探针与服务管理", data: "只读探测 PC 本地 IPv6 端点、是否处于 unattended（无人值守）模式以及后台服务状态；严禁输出真实 Tailnet 与 IP。", result: "保证 WireGuard UDP 走运营商骨干直连；排查代理劫持与离线隐患。" },
      { source: "Sunshine 本机回环（Loopback）接口", data: "通过 127.0.0.1 绕过外部代理请求 serverinfo；获取当前编码能力掩码（mask=0x70301）与 RTSP 会话活动状态。", result: "在串流空闲时才允许切换显示源，绝不中途踢掉正在进行的用户会话。" }
    ],
    note: "所有网络地址均以 100.x.y.z 与 2xxx:: 占位符脱敏展示；测试与状态收集均在严格只读模式下运行。"
  },
  productPrinciples: [
    { title: "物理主屏绝对优先，虚拟屏仅作无感兜底", detail: "平时远程就是看主屏，不让用户对着只有一张壁纸的虚拟扩展屏发愣；只有主屏彻底断开时才由 VDD 顶上，并在主屏归来后迅速清账拉回窗口。" },
    { title: "不碰物理硬件拓扑，严禁系统镜像", detail: "远程无论需要何种分辨率，均通过 Sunshine 编码器缩放；绝不使用 Windows 复制模式，绝不修改物理屏、机箱屏与水冷屏的硬件分辨率与刷新率。" },
    { title: "串流数据不出海，流量守在骨干网", detail: "依托端到端 IPv6 直连实现大流量视频与音频的纯国内点对点传输，海外服务器仅用于最初的轻量握手，保障极低延迟与绝对隐私。" },
    { title: "带宽受限必用 CBR，严控码率余量", detail: "家庭上行 32 Mbps 是硬红线；用恒定码率（CBR 18–20 Mbps）加 FEC 余量封顶带宽消耗，坚决抵制 CQP 带来的瞬时带宽爆炸卡顿。" },
    { title: "硬件不稳定即失败关闭（Fail-Closed）", detail: "一旦显卡驱动出现过崩溃记录，停止一切自动拓扑改动和重启，宁可暂时无法远程，也绝不加剧系统蓝屏或破坏正在运行的本地工作。" },
    { title: "变更默认预检，生产写入必须显式 Apply", detail: "所有显示模式与无头配置脚本默认只读验证并给出 Win32 预检回执；没有明确的 -Apply 参数绝不落盘，保障运维操作可控可撤销。" }
  ],
  responsibilities: [
    "在物理主屏关机或拔线时，自动无缝将串流接管至 2880×1800 HDR 虚拟显示屏，并记录普通窗口位置完成几何搬迁。",
    "在物理主屏重新点亮后，自动将之前迁走的及新打开的窗口拉回主屏，并将 Sunshine 捕获源切回物理主屏。",
    "对 LIAN LI 水冷屏、HS2 机箱副屏以及未经验证的虚拟驱动提供严格排除保护，防止其被 Sunshine 误捕获或被窗口遮挡。",
    "实现 Tailscale 传输层与 Sunshine 串流层的解耦治理，指导打通光猫与系统的 IPv6 双栈直连，彻底规避三层 NAT 限制。",
    "针对小米 15 Pro 手机与 RTX 5090 D 显卡，制定受限上行（32 Mbps）环境下的 CBR 18–20 Mbps 与 AV1 硬解最佳实践。",
    "提供一键排查与幂等修复脚本，快速消除固定代理环境变量对 Tailscale 服务的负面干扰，固化无人值守守护态势。",
    "提供轻量日常验证计划任务，对服务健康、编码能力掩码与公网暴露态势进行无感持续巡检。"
  ],
  exclusions: [
    "不重复开发新的远程串流协议客户端；继续使用优秀的开源生态 Sunshine 与 Moonlight/Artemis。",
    "不替代 Windows 系统原本的显示设置；VDD 分辨率调整走受控独立接口，不干涉物理主屏的全局拓扑。",
    "不使用未经证明可靠的纯无线 Wi-Fi WoWLAN 作为生产级开机依赖；坚持插网线或智能插座硬件自启方案。",
    "不公开包含真实公网 IP、家庭宽带地址、Tailnet 域名、机器名称、Token 或私钥的明文信息。",
    "不将 Sunshine 管理控制台直接无防护暴露给公共互联网；公网访问必须经过受控鉴权与网络隧道。",
    "不在当前显示隔离运维任务持有期间擅自执行写入式拓扑修改或重启显卡驱动。"
  ],
  glossary: [
    { term: "Sunshine", meaning: "安装在 PC 上的自建游戏与桌面串流服务端，支持 NVENC 高性能低延迟硬件编码。" },
    { term: "Moonlight / Artemis", meaning: "运行在手机或客户端上的开源串流接收器，支持超低延迟硬解与手柄触控模拟；Artemis 为国内优秀定制版。" },
    { term: "VDD（Virtual Display Driver）", meaning: "基于 Windows 间接显示驱动架构的虚拟显示器；本项目使用经过硬件 ID 严格验证的 MTT1337 VDD。" },
    { term: "Failover（故障转移）", meaning: "当主工作路径（物理主屏）失效时，自动、平滑地切换至备用路径（虚拟屏）的容灾机制。" },
    { term: "P2P 直连（Peer-to-Peer）", meaning: "两台设备直接建立点对点通信，数据包不经过第三方服务器中转，延迟最低且带宽最大。" },
    { term: "DERP（Designated Encrypted Relay for Packets）", meaning: "Tailscale 的中继节点；海外 DERP 延迟高且易受网络抖动干扰，直连成功后应绕开 DERP。" },
    { term: "CBR（Constant Bitrate，恒定码率）", meaning: "将网络传输速率牢牢锁定在固定值的编码模式，避免因复杂动态场景导致码率突增打爆上行。" },
    { term: "CQP（Constant Quantization Parameter，恒定量化参数）", meaning: "追求恒定画质的动态码率模式；在网络带宽受限的远程场景下极易引发剧烈丢包与卡顿。" },
    { term: "WoL（Wake-on-LAN）", meaning: "网络唤醒技术；通过向有线网卡发送特定魔术包实现远程开机。" },
    { term: "WoWLAN（Wake on Wireless LAN）", meaning: "无线网络唤醒；受限于无线网卡关机省电机制，在实际生产环境中极不可靠。" }
  ],
  operatingFlow: [
    { title: "平时在电脑前工作", detail: "物理主屏以 4K 240Hz HDR 正常工作，Sunshine 默认绑定物理主屏，普通窗口在物理屏内自由排列，水冷屏常显硬件监控。" },
    { title: "离家外出，电脑黑屏/熄屏", detail: "物理主屏断开或关机休眠。守护程序检测到物理主屏稳定缺失达到 15 秒，且串流处于空闲状态。" },
    { title: "安全触发 VDD 兜底", detail: "守护程序保存当前主屏窗口的句柄与几何位置，将捕获源原子切换为 MTT1337 VDD，并平滑将窗口迁移至 2880×1800 虚拟工作区。" },
    { title: "手机端随时发起连接", detail: "在外通过小米 15 Pro 打开 Artemis，经 IPv6 直连快速接入主机；以 20 Mbps AV1 CBR 顺畅操控已就绪的桌面应用。" },
    { title: "用毕断开，等待主人回家", detail: "手机端断开串流，Sunshine 会话释放；系统保持 VDD 捕获状态，继续守护窗口。" },
    { title: "回家开机点亮物理屏", detail: "物理显示器重新上线；守护程序检测到主屏连续健康且串流空闲，迅速切回主屏并按照历史位置清账拉回所有应用窗口，恢复原貌。" }
  ],
  components: [
    { name: "捕获源与窗口故障转移守护器", responsibility: "主屏优先绑定、VDD 安全兜底、RTSP 会话空闲门禁与 Win32 窗口位置几何无损搬迁拉回。", implementation: "sunshine-capture-failover.psm1 与 Invoke-SunshineCaptureFailover.ps1 实现 3 秒低频轮询 + GPU 崩溃保护。" },
    { name: "VDD 独立显示参数适配器", responsibility: "提供 2880×1800 60Hz 150% HDR 独立配置，负责 Win32 CDS_TEST 预检与首选项持久化，防 800×600 回退。", implementation: "Set-SunshineVddDisplayProfile.ps1 与 sunshine-vdd-display-settings.psm1 实现原子模式修改。" },
    { name: "应急无头模式配置器", responsibility: "在极端需要下安全把 Sunshine 强制锁死在 VDD，同时保持所有拓扑切换与镜像选项处于 disabled 禁用态。", implementation: "Set-SunshineHeadlessConfig.ps1 与 sunshine-headless-config.psm1 负责安全配置更新。" },
    { name: "传输层验证与网络一键修复", responsibility: "探测光猫与主机 IPv6 SLAAC 状态，清除 Tailscale 服务的固定代理端口环境变量，固化无人值守模式。", implementation: "repair-stream.ps1（幂等修复）与 verify-path.ps1（深度直连与 DERP 路径诊断）。" },
    { name: "轻量计划任务巡检器", responsibility: "每日无感知检查服务运行态、编码能力掩码（HEVC/AV1 Main10）与公网暴露风险并写入运行态日志。", implementation: "verify-path-lite.ps1 由计划任务 SunshineRemote-VerifyPath-Daily 自动调度。" },
    { name: "隔离自动化验证套件", responsibility: "在内存与沙箱环境中对设备 GUID 计算、窗口搬迁、安全门禁与 AST 语法进行严谨的非破坏性回归测试。", implementation: "tests/ 目录下 4 套核心测试脚本，涵盖 101 项以上严格断言。" }
  ],
  technicalContracts: [
    { artifact: "捕获守护状态记录", schema: "sunshine.capture-failover-state.v1", owner: "Invoke-SunshineCaptureFailover.ps1", boundary: "记录当前模式（Main/Vdd）、主屏缺失时间点、串流空闲时间戳以及已迁移窗口的 HWND/PID/Placement 数组；禁止记录私密窗口标题。" },
    { artifact: "VDD 显示配置合同", schema: "vdd-display-profile.v1", owner: "Set-SunshineVddDisplayProfile.ps1", boundary: "严格限定目标设备为 MTT1337 硬件 ID；执行 CDS_TEST 预检通过后才应用；持久化首选项 XML 必须同卷原子替换。" },
    { artifact: "Sunshine 无头安全配置", schema: "sunshine.headless-config.v1", owner: "Set-SunshineHeadlessConfig.ps1", boundary: "仅修改 output_name GUID；强行锁定 dd_configuration_option、dd_resolution_option 等 6 项关键参数为 disabled，杜绝自动拓扑切换。" },
    { artifact: "轻量巡检日志记录", schema: "verify-lite.log format", owner: "verify-path-lite.ps1", boundary: "仅输出时间戳、WLAN IPv6 计数、服务状态、Sunshine 编码掩码、unattended 状态与脱敏公共暴露提示，绝不持久化明文 IP 或凭据。" }
  ],
  usageExamples: [
    { moduleSlug: "capture-failover", ask: "如果我直接拔掉显示器线，Sunshine 会怎样？窗口会丢吗？", effect: "系统在连续 15 秒确认物理屏缺失且无活跃串流时，将 output_name 原子指向 MTT1337 VDD，并将主屏普通窗口平滑挪入 VDD；插回线缆后窗口自动复原。" },
    { moduleSlug: "vdd-display-settings", ask: "我想把手机远程画质改成 2560×1440 120Hz，会影响我电脑主屏吗？", effect: "运行 Set-SunshineVddDisplayProfile.ps1 仅调整 VDD 的 Win32 显示模式与 XML 首选项，物理主屏的 4K 240Hz 与 HDR 状态完全不受影响。" },
    { moduleSlug: "transport-ipv6-direct", ask: "我在外面用手机移动 5G，为什么经常连不上家里的 Tailscale 串流？", effect: "移动家宽存在三层 NAT，无法通过 IPv4 P2P 打洞；打通光猫与电脑的公网 IPv6 双栈后，两端直连 WireGuard UDP，延迟降至最低且不经过海外中继。" },
    { moduleSlug: "bitrate-codec-strategy", ask: "我把串流码率拉到 50 Mbps 画面会不会更清楚？", effect: "由于家里宽带上行极限约为 32 Mbps，超过 25 Mbps 会直接撑爆上行导致剧烈卡顿、花屏与断连；应使用 20 Mbps CBR 配合 AV1 编码获得最高画质。" },
    { moduleSlug: "remote-power-and-repair", ask: "电脑关机了，我能直接用手机通过 Wi-Fi 把电脑叫醒吗？", effect: "Wi-Fi 网卡在关机后供电断开，WoWLAN 极不可靠；建议插上 2.5G 网线使用有线 WoL，或采用最省事的“智能插座 + BIOS 来电自启”实现远程物理开机。" }
  ],
  evidenceLayers: [
    { layer: "Source（源码与配置）", proves: "PRIVATE main 分支拥有完整的捕获守护模块、VDD 显示模式驱动适配器、网络与服务修复脚本及全套自动化测试。", doesNotProve: "真实硬件环境下手机操控的体感延迟、画质体验或特定异常弱网下的稳定性。" },
    { layer: "Tests（隔离自动化测试）", proves: "4 套独立 PowerShell 测试套件通过全部 101 项以上断言，覆盖 GUID 唯一绑定、窗口阴影边框容差、GPU 崩溃门禁与原子写入。", doesNotProve: "测试不模拟硬件显卡真正拔线、屏幕物理掉电或真实的 Windows 蓝屏事件。" },
    { layer: "Runtime（当前系统运行态）", proves: "SunshineService 与 Tailscale 服务均为 Auto 自动启动并处于 Running 状态；捕获守护计划任务处于 Running 活跃状态；编码能力掩码 0x70301 支持 HEVC/AV1 Main10。", doesNotProve: "当前处于只读避让状态，未执行破坏性拓扑改动，不代表当前瞬间正处于手机串流会话中。" },
    { layer: "Transport（传输与网络）", proves: "光猫支持 Native IPv6，Windows 网卡绑定正常；Tailscale 固化 unattended 无人值守模式，串流数据路径直连不出海。", doesNotProve: "移动运营商未来在特定基站下是否会瞬时封锁 UDP 端口或 IPv6 前缀重新下发带来的短时重连。" }
  ],
  operationalEntrypoints: [
    { name: "只读运行态路径轻量验证", command: "pwsh -NoProfile -File .\\verify-path-lite.ps1", purpose: "以只读方式检查本机 IPv6、服务状态、Sunshine 编码能力掩码与 Tailscale 无人值守状态，写入 runtime 日志。" },
    { name: "网络与服务幂等修复入口", command: "pwsh -NoProfile -File .\\repair-stream.ps1", purpose: "重新绑定网卡 IPv6，清理服务环境变量残留的固定代理端口，固化 Tailscale 无人值守并拉起服务。" },
    { name: "深度传输路径与对端探测", command: "pwsh -NoProfile -File .\\verify-path.ps1 -PhoneTailscaleIp <peer-ip>", purpose: "仅在显式传入手机 Tailscale IP 时，验证手机与电脑之间是走公网 IPv6 直连还是海外 DERP 中继。" },
    { name: "VDD 独立显示参数预检与调整", command: "pwsh -NoProfile -File .\\Set-SunshineVddDisplayProfile.ps1 -Width 2880 -Height 1800 -RefreshRate 60 -ScalePercent 150 -HdrMode Hdr [-Apply]", purpose: "默认只读预检并验证 CDS_TEST；显式加上 -Apply 才真实修改 VDD 模式并持久化首选项。" },
    { name: "捕获守护计划任务注册与更新", command: "pwsh -NoProfile -File .\\Install-SunshineCaptureFailoverTask.ps1 [-Apply]", purpose: "默认预检；显式加上 -Apply 在 Windows Task Scheduler 注册无窗后台守护任务。" },
    { name: "应急无头捕获模式切换", command: "pwsh -NoProfile -File .\\Set-SunshineHeadlessConfig.ps1 [-Apply]", purpose: "在极端情况下将 Sunshine 捕获源强行指向 VDD 并保持所有拓扑改动选项处于 disabled 状态。" }
  ],
  evolution: [
    { date: "2026-07-04—2026-07-06", commit: "初始提交与路径探索", result: "建立 Sunshine + Moonlight 基础串流框架；发现移动三层 NAT 导致外网蜂窝无法直连的核心痛点，完成光猫与 PC 端 IPv6 基础改造。" },
    { date: "2026-08-10", commit: "传输层与配置固化", result: "将串流层与传输层彻底解耦；修复 IPv6 启用后 Tailscale 掉登录问题，确立 CBR 18–20 Mbps 与 AV1 编码的受限上行带宽实践。" },
    { date: "2026-09-01—2026-09-02", commit: "自研守护与多屏安全", result: "引入 MTT1337 专用 VDD 独立显示参数适配器；建立物理主屏优先、VDD 兜底、窗口位置几何自动回迁拉回、联力水冷屏排除以及 GPU 崩溃阻断的完整工业级容灾体系。" }
  ],
  snapshotUpdateNote: "本页代表截至 2026-09-04 对 PRIVATE 仓库最新源码、脱敏运行状态、服务事实与测试套件的严谨快照。后续仅在串流拓扑规则、显示安全边界、传输层协议或核心参数发生重大改变时由 AI 刷新；不采集任何私人聊天记录、屏幕图像或私密凭据。"
};

export const sunshineRemoteStreamingModules = [
  {
    slug: "capture-failover",
    shortTitle: "主屏优先与兜底",
    title: "物理主屏优先，唯一 MTT1337 VDD 兜底并守护应用窗口",
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
        "主屏回来时窗口自动拉回，无残留",
        "GPU崩溃后禁止修改拓扑，失败关闭",
        "无法证明唯一健康VDD时拒绝盲目切换"
      ]
    },
    teaser: "它解决“远程连上去只有一张壁纸、窗口不知道丢哪去了”的常见灾难，通过 failover（故障转移）让亮屏与关屏无缝衔接。",
    status: "守护程序计划任务在线；隔离测试 67/67 通过；只读避让当前运行态",
    statusTone: "pass",
    value: "我在家坐着就用物理屏，出门关屏后手机串流自动无感走 VDD；回家显示器一点亮，所有窗口各就各位，不用手动拖拽排列。",
    why: "多屏扩展下，Windows 往往把新开窗口或失去焦点的窗口扔到看不见的扩展屏上；如果盲目开启“系统镜像”，又极易打乱物理屏高刷与 HDR，甚至引发显卡死机。必须有一套严谨的窗口与显示目标守护状态机。",
    example: "“我在手机上通过串流办公，回家按电源键唤醒显示器；守护程序检测到主屏恢复且串流结束，把我在手机上操作的所有应用平滑拉回 4K 主屏原位，水冷屏自始至终正常运行。”",
    result: "远程画面永远有内容、有焦点；不丢窗口、不黑屏、不干扰机箱副屏；显卡不稳定时立即熔断保护现场。",
    readerStates: {
      pass: "主屏与 VDD 身份明确，去抖计时器与 RTSP 会话空闲门工作正常，窗口按几何记录精准搬迁与拉回。",
      problem: "若当前启动周期记录了显卡崩溃事件，守护程序自动锁定为 BlockedByGpuStability，停止拓扑写入并告警。",
      unavailable: "若系统中出现多个无法区分的虚拟屏、或未能检测到健康的 MTT1337 驱动实例，系统失败关闭，拒绝盲目绑定。"
    },
    decisionImpact: [
      "Sunshine 捕获源 output_name 仅使用通过 PnP/EDID 严格计算的 UUIDv5，绝不使用容易随热插拔改变的 \\\\.\\DISPLAYN 编号。",
      "物理主屏连续缺失 15 秒（排除瞬时休眠与驱动重置）且串流空闲 5 秒才切到 VDD，防止正常看视频时发生误切。",
      "记录普通窗口的 HWND、PID 与真实窗口放置矩形，同时容忍相邻屏幕 11–13 像素的不可见阴影边框，避免误判搬移。",
      "LIAN LI 水冷屏（TUR0000）与 HS2 机箱屏严格列为黑名单，既不能成为串流捕获源，也不能有任何窗口落入其区域。"
    ],
    problem: "防止多屏混用与关屏串流时，failover（故障转移）状态机出现画面丢失、窗口错位、副屏被夺取或显卡驱动连锁崩溃。",
    implementation: [
      "sunshine-capture-failover.psm1 实现活动显示快照采集、EDID 校验、Sunshine 配置 CAS（比较并交换）原子更新与 Win32 窗口位置控制。",
      "Invoke-SunshineCaptureFailover.ps1 作为常驻轮询工作器（3 秒稳态轮询，等待期 250ms 快速复核），负责触发切换与恢复。",
      "Install-SunshineCaptureFailoverTask.ps1 将其注册为当前交互用户的 Highest 权限开机任务，配合 VBS 启动器实现完全静默无弹窗运行。",
      "tests/Test-SunshineCaptureFailover.ps1 提供 67 项自动化单元与模拟测试，覆盖全部边界与容灾路径。"
    ],
    flow: [
      "常驻守护器每 3 秒获取一次系统显示快照与 RTSP 串流会话状态。",
      "若物理主屏正常在线，将任何意外漂入或新建在 VDD 区域的普通窗口持续拉回主屏。",
      "若物理主屏离线，启动 15 秒缺失计时器；计时满且串流空闲后，记录主屏普通窗口几何位置，将 output_name 原子替换为 VDD GUID 并迁移窗口。",
      "主屏重新点亮并稳定 5 秒后，守护程序将窗口从 VDD 原样无损拉回物理主屏，再将 output_name 切回物理主屏。"
    ],
    concepts: [
      { term: "EDID（扩展显示标识数据）", explanation: "显示器硬件自带的只读身份信息，用于生成永不漂移的 Sunshine 唯一设备标识。" },
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
      { condition: "当前 Windows 启动发生过 Kernel-Power 41 或 nvlddmkm 崩溃", response: "状态置为 BlockedByGpuStability，禁止切换，仅允许单向将窗口收回物理主屏。" },
      { condition: "单轮显示枚举瞬时失败（如驱动重置）", response: "作为 cycle-transient-failure 记录并在下一轮重试，绝不导致常驻守护进程异常崩溃退出。" }
    ],
    sources: [
      { path: "sunshine-capture-failover.psm1", role: "核心状态机、窗口几何与原子配置读写引擎" },
      { path: "Invoke-SunshineCaptureFailover.ps1", role: "常驻轮询执行体与空闲门检测" },
      { path: "tests/Test-SunshineCaptureFailover.ps1", role: "67 项高强度自动化回归测试套件" }
    ],
    verification: [
      "自动化测试 67/67 完整通过（涵盖 CIM 绕过、GUID 绑定、去抖、CAS 写入、窗口拉回与 GPU 稳定性门禁）。",
      "运行态 capture-failover-state.json 正常记录当前状态与窗口映射列表。",
      "系统计划任务 SunshineCaptureFailover-Interactive 保持 Running 状态。"
    ],
    relation: "为整个远程串流系统提供坚固的显示可用性基石；与 VDD 独立显示参数管理及传输层紧密协作。"
  },
  {
    slug: "vdd-display-settings",
    shortTitle: "VDD 独立显示配置",
    title: "专用虚拟显示屏 2880×1800 60Hz 150% HDR 独立可调，主屏不受联动干扰",
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
    teaser: "它让虚拟屏精准契合手机高分屏与 HDR 需求，同时保证台式机物理主屏的原生参数丝毫不受牵连。",
    status: "脚本与测试 19/19 通过；默认预检保护已就绪；只读避让",
    statusTone: "pass",
    value: "我可以为手机串流设定专属的 2880×1800 150% HDR 显示环境，而不用担心回家后物理主屏的分辨率、刷新率或缩放比例被改得面目全非。",
    why: "虚拟显示驱动在 Windows 重启或显卡重新枚举时，常常由于缺乏硬件握手而自动回退到厂家列表第一项（通常是 800×600），导致串流画面极小且模糊；同时第三方工具修改显示模式往往全局联动，容易破坏主屏的 4K 240Hz 配置。",
    example: "“我想把 VDD 调整为 2560×1440 144Hz 并在手机上看 HDR；我运行调整脚本，脚本自动完成 Win32 预检与持久化首选项写入，主屏毫无闪烁或改变。”",
    result: "获得独立、稳定的虚拟屏高分高刷与 HDR 体验；驱动重置后依然记忆正确分辨率，物理主屏零干扰。",
    readerStates: {
      pass: "VDD 模式成功应用并通过精确回读，持久化 XML 完成原子替换，物理屏与副屏状态保持原样不变。",
      problem: "若请求的分辨率或刷新率未被 VDD 驱动声明支持，脚本在 CDS_TEST 阶段主动拦截并报错，不执行实际改动。",
      unavailable: "若未能通过硬件 ID 匹配到真正的 MTT1337 虚拟设备，脚本拒绝执行任何 Win32 改动。"
    },
    decisionImpact: [
      "默认初始关键项设为 2880×1800、60 Hz、150% 缩放与 HDR，精准适配现代高素质智能手机屏幕比例。",
      "持久化首选项会将选定模式写在 VDD 驱动模式列表首位，从根源上杜绝驱动重新枚举时回退到 800×600。",
      "严格区分 Windows 高级颜色（Advanced Color / HDR 开关）与 VDD 驱动内部的 12-bit HDRPlus 能力开关，避免概念混淆造成色彩异常。",
      "脚本默认仅做纯内存预检与状态回读；只有管理员显式传入 -Apply 参数才会执行 Win32 变更与文件原子落盘。"
    ],
    problem: "杜绝虚拟显示器分辨率异常回退、HDR 色彩发灰以及多屏显示模式相互污染。",
    implementation: [
      "Set-SunshineVddDisplayProfile.ps1 作为原生适配器入口，封装参数校验、Win32 模式探测与持久化编排。",
      "sunshine-vdd-display-settings.psm1 提供设备硬件 ID 过滤、CDS_TEST 模式前检与 XML 原子替换算法。",
      "tests/Test-SunshineVddDisplaySettings.ps1 与 Test-SunshineVddNativeAdapter.ps1 提供 19 项以上严格测试保障。"
    ],
    flow: [
      "用户或上层脚本调用入口并传入期望的宽高、刷新率、缩放与 HDR 模式。",
      "脚本扫描系统显示设备，严格通过 MTT1337 硬件 ID 锁定专用虚拟屏，拒绝物理屏与水冷屏。",
      "调用 Win32 ChangeDisplaySettingsEx 执行 CDS_TEST 纯逻辑前检，验证系统与驱动是否接受该模式。",
      "若包含 -Apply，则正式提交模式变更、调用 DisplayConfigSetDeviceInfo 应用缩放与 HDR，并原子更新持久化 XML 文件。",
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
      { path: "sunshine-vdd-display-settings.psm1", role: "显示模式设置核心支持库" },
      { path: "tests/Test-SunshineVddDisplaySettings.ps1", role: "显示设置安全性与预检测试套件" }
    ],
    verification: [
      "自动化测试 19/19 全部 PASS（覆盖参数校验、黑名单设备拦截、CDS_TEST 预检与原子持久化）。",
      "静态适配器测试 Test-SunshineVddNativeAdapter.ps1 验证 Win32 API 签名一致性。"
    ],
    relation: "为主屏离线时的远程串流提供高质量的像素与色彩源泉；与捕获守护程序共同构成显示层护城河。"
  },
  {
    slug: "transport-ipv6-direct",
    shortTitle: "传输解耦与 IPv6 直连",
    title: "串流层与传输层彻底解耦，端到端 IPv6 直连绕开 NAT 与海外中继",
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
        "Tailscale 1.98.4",
        "移动光猫 GM220-S",
        "SLAAC / IPv6 双栈",
        "DERP (tok / hkg)",
        "repair-stream.ps1",
        "verify-path.ps1"
      ],
      relations: [
        "端到端IPv6让手机与PC直接建立WireGuard UDP直连",
        "串流大流量完全在国内运营商骨干网内传输",
        "清除代理端口环境变量恢复Tailscale控制面心跳"
      ],
      failureRecovery: [
        "掉登录时运行repair-stream清除固定代理并重启服务",
        "若直连失效Tailscale自动降级DERP兜底但会提示告警"
      ]
    },
    teaser: "它击碎国内移动“三层 NAT + 无公网 IPv4”的枷锁，让手机在外随时直连家里 PC，数据全程不出海。",
    status: "Tailscale 服务正常且设为无人值守；IPv6 端点就绪；只读避让",
    statusTone: "pass",
    value: "我在任何地方用手机流量都能秒连家里电脑，操作跟在局域网一样顺滑跟手，不被海外中继掐断，也不用担心隐私数据流向境外。",
    why: "国内移动家宽普遍采用“移动城域网 CGNAT + 光猫 NAT + 路由器 NAT”的三层极其恶劣的网络环境，IPv4 几乎不可能打洞；若走 Tailscale 默认中继，会被路由到香港或东京 DERP（中继服务器）节点，延迟高达 200ms 以上且极不稳定。必须打通 IPv6 建立原生 P2P（点对点）直连。",
    example: "“我在外用 5G 手机连上 Moonlight，PC 执行 tailscale ping，显示 via 2xxx:... IPv6 直连；大流量串流数据完全在移动骨干网内高速飞驰，控制面心跳极小，毫秒级响应。”",
    result: "彻底解决“在家里 Wi-Fi 能连、出门用蜂窝数据连不上”的致命痛点；实现超低延迟、超高画质且绝对私密的点对点直连。",
    readerStates: {
      pass: "PC 与手机均拥有公网 IPv6 地址，WireGuard 握手成功并升为直连通道，延迟稳定在 15–30ms 极低区间。",
      problem: "若两端未成功建立 IPv6 直连，流量暂时回退至 DERP 中继，ping 出现 via DERP 提示，画质与延迟有所下降。",
      unavailable: "若光猫掉拨号失去 IPv6 前缀、或 Tailscale 服务掉登录变为 NoState，系统提供明确脚本进行一键修复。"
    },
    decisionImpact: [
      "明确“串流层（Sunshine）尽量不换，传输层（Tailscale）随时可换”的解耦原则；未来若替换为皎月连等工具，串流配置无需推翻。",
      "光猫开启 Native IPv4/IPv6 双栈，Windows 重新启用 WLAN 的 ms_tcpip6 协议绑定并清理 DisabledComponents 注册表限制。",
      "严禁在 Windows 服务级别将 Tailscale 写死绑定到固定的代理端口，防止代理软件关闭后 Tailscale 掉登录失去状态；通过 TUN 统一管理网络。",
      "固化 Tailscale 的 unattended（无人值守）模式（ForceDaemon=true），确保锁屏或注销状态下依然能正常提供远程连接。"
    ],
    problem: "解决复杂 NAT 网络环境下远程打洞困难、海外中继延迟奇高、以及网络配置冲突引发的掉线问题。",
    implementation: [
      "通过移动光猫 PPPoE 原生下发 IPv6 前缀，配合下游路由器 SLAAC 自动下发，让 PC 获得真正公网 IPv6 地址。",
      "repair-stream.ps1 提供一键幂等修复：清除残存的服务级代理端口环境变量，重启服务并强制固化 unattended 偏好。",
      "verify-path.ps1 与 verify-path-lite.ps1 分别提供深度路径诊断与日常无侵入巡检。"
    ],
    flow: [
      "手机发起串流请求，通过 Tailscale 控制面交换两端公网 IPv6 端点与 WireGuard 公钥。",
      "两端尝试在运营商骨干网内直接发送 WireGuard UDP 探测包。",
      "初始几包可能经由最近的 DERP 中继过渡，随后链路迅速升级为端到端原生 IPv6 P2P 直连。",
      "Sunshine 服务将编码视频流通过本地 47998 等 UDP 端口直接推送给手机端。"
    ],
    concepts: [
      { term: "CGNAT（运营商级网络地址转换）", explanation: "千百家庭共享一个公网 IPv4 地址的技术；由于没有独立公网 IPv4，外部无法主动向内部发起连接。" },
      { term: "SLAAC（无状态地址自动配置）", explanation: "IPv6 终端根据路由器通告的前缀自动生成自身公网 IPv6 地址的标准机制。" },
      { term: "Unattended Mode（无人值守模式）", explanation: "Tailscale 在用户注销或未登录 Windows 桌面时仍作为后台系统服务正常工作的配置项。" }
    ],
    boundaries: [
      "不将 Sunshine 管理网页或未授权端口直接通过公网端口映射暴露，所有流量牢牢限制在 Tailnet 内网中。",
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
      "运行态 verify-lite.log 明确证实 Tailscale 处于 Running 且 start-mode=Auto。",
      "tailscale-unattended=true 由官方接口精准回读，证明无人值守守护生效。",
      "Sunshine 串流端口在 loopback 与内网正常监听。"
    ],
    relation: "为整个串流链路提供高可靠、低延迟、零出海的纯净网络通道；上承编码码率预算，下接服务常驻。"
  },
  {
    slug: "bitrate-codec-strategy",
    shortTitle: "码率预算与编码策略",
    title: "受限 32 Mbps 上行带宽严控 CBR 18–20 Mbps，AV1 硬编硬解拒绝卡顿",
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
        "CBR强制锁定码率防止突发峰值打爆带宽"
      ],
      failureRecovery: [
        "若出现丢包立即在手机端下调码率至15-18Mbps",
        "复杂画面坚决不使用CQP防止网络队列阻塞"
      ]
    },
    teaser: "它算清了家庭宽带的真实物理极限，用恒定码率加次时代编码，在有限水管里榨出极致清晰度。",
    status: "RTX 5090 D 编码预设已调优；手机端配置规范已固化；只读避让",
    statusTone: "pass",
    value: "我在外远程玩 3D 大作或快速滚动复杂文档时，画面清晰稳定，绝不因为复杂场景突然“爆上行”而引发断崖式卡顿或马赛克。",
    why: "家庭宽带的真实瓶颈永远在“上传”（通常仅 30–40 Mbps）。Sunshine 在传输视频时还会追加约 20% 的 FEC（前向纠错）数据包和音频流；若使用追求画质的 CQP（动态量化参数），激烈战斗或复杂草地场景码率瞬间可能冲破 50 Mbps，直接导致路由器发送队列堆死、丢包率飙升至 100%。",
    example: "“在手机 Moonlight 设置中将码率滑块固定在 18–20 Mbps，编码器选择 AV1；即使在游戏里激烈甩枪，网络延迟曲线依然平直如画，帧率稳定 60 FPS。”",
    result: "在受限带宽下获得最高的信息密度与锐利画质；丢包率趋近于零，操控跟手，观感细腻。",
    readerStates: {
      pass: "网络码率严格限制在上行安全水位（约 24.5 Mbps 综合峰值）以内，AV1 硬编硬解正常工作，无丢包与卡顿。",
      problem: "若用户在手机端手动拉高码率超过 25 Mbps 或误选了 CQP，画面在复杂场景下将出现明显抖动与积压延时。",
      unavailable: "若客户端设备不支持 AV1 硬解，链路可无缝平滑回退至 HEVC Main10 编码，保障基础可用性。"
    },
    decisionImpact: [
      "把家庭宽带 32 Mbps 上行作为最高硬约束：视频码率严格定为 18–20 Mbps，预留 20% FEC + 音频（合计约 24.5 Mbps），留足安全余量。",
      "严禁在远程场景使用 CQP（动态量化参数）/ CQT 动态码率，强制要求使用 CBR（恒定码率），将每一帧的数据大小牢牢钉在预算之内。",
      "充分发挥 RTX 5090 D 与骁龙 8 Elite 的前沿硬件红利：远程优先采用 AV1 编码，同等码率下文字清晰度与暗部噪点控制远超 HEVC。",
      "局域网环境无带宽瓶颈时，可放开至 1440p/4K 120Hz、100–150 Mbps 并选择 HEVC，以获得更低的微秒级解码耗时。"
    ],
    problem: "防止因码率设置不当导致家庭宽带上行被撑爆、画面严重卡死或编码资源浪费。",
    implementation: [
      "Sunshine 主机端配置 sunshine.conf：启用 nvenc_preset = 5（高画质预设）、nvenc_twopass = full_res（全分辨率两遍编码）与 nvenc_spatial_aq = enabled（空间自适应量化）。",
      "手机端 Moonlight / Artemis 客户端固定参数推荐：分辨率 1080p/1440p、帧率 60fps、码率 18–20 Mbps、CBR 模式、强制优先 AV1。",
      "通过 verify-path-lite.ps1 验证主机端当前编码器能力掩码，确保 hevc-main10=true 与 av1-main10=true 均正常支持。"
    ],
    flow: [
      "手机客户端向 Sunshine 发送包含目标码率（如 20 Mbps）、编码格式（AV1）与帧率的协商请求。",
      "Sunshine 调用 NVIDIA NVENC API，以 P5 预设和全分辨率双遍算法开始压制视频流。",
      "编码器实时注入 FEC 冗余校验包，并通过 UDP 恒速发出，整体网络流量平稳运行在 24.5 Mbps 左右。",
      "手机端骁龙 8 Elite 硬件解码器直接接管画面渲染并呈现 HDR 色彩。"
    ],
    concepts: [
      { term: "FEC（Forward Error Correction，前向纠错）", explanation: "发送方主动在数据包中附加的冗余纠错码；当网络偶发微小丢包时，接收方无需重传即可直接恢复画面。" },
      { term: "NVENC 两遍编码（Twopass）", explanation: "显卡编码器先快速分析整帧复杂度再精准分配码率的技术，能大幅提升受限带宽下的有效画质。" }
    ],
    boundaries: [
      "不在主机端强制锁死单一编码器，具体编码格式由手机客户端根据硬件解码能力自主选择协商。",
      "不为了盲目追求 4K 240Hz 远程传输而牺牲网络稳定性，远程始终以稳定流畅的 60fps 为第一优先。"
    ],
    failures: [
      { condition: "手机端未开启 HDR 导致画面色彩发灰发白", response: "在手机客户端开启 HDR 并重新建立连接，确保客户端色彩空间与主机 VDD HDR 一致。" },
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
    shortTitle: "远程开机与系统运维",
    title: "智能插座 AC 自启结合有线 WoL 远程开机，幂等脚本一键修复掉线与服务故障",
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
        "PC断电关机后Wi-Fi断电故WoWLAN不可行",
        "智能插座通电触发BIOS来电自启是最稳单机方案",
        "repair-stream幂等修复网络绑定与服务代理残留"
      ],
      failureRecovery: [
        "遇到网络或服务故障时执行repair-stream一键收敛",
        "计划任务每日无侵入记录verify-lite日志"
      ]
    },
    teaser: "它讲透了远程开机的真正物理限制，并为这套串流系统配备了防呆、幂等、可回退的运维急救箱。",
    status: "每日巡检任务就绪；修复脚本验证通过；只读避让",
    statusTone: "pass",
    value: "即使我把电脑关了，在外面也能通过手机米家 App 一键上电自动开机并连上串流；遇到网络抽风时，有一键脚本快速复原，不用抓瞎排查。",
    why: "许多用户以为只要开了魔术包就能随时随地开机，却忽视了“电脑关机后无线网卡随之断电、Tailscale 也随之下线”的物理事实，在外根本发不进魔术包；同时 Windows 偶尔会由于代理软件异常退出而在注册表残留服务环境变量，导致 Tailscale 永远连不上。必须有针对性的软硬结合方案。",
    example: "“我在外地想用电脑，先用米家 App 关闭再开启智能插座，主板检测到通电触发 BIOS 来电自启，Tailscale 与 Sunshine 随系统静默拉起；打开手机串流直接进桌面。”",
    result: "获得绝对可靠的远程硬核开机能力；服务配置健康透明，拥有随时可执行的自愈与日常巡检保障。",
    readerStates: {
      pass: "BIOS 来电自启与网卡驱动层 WoL 均已就绪；服务保持 Auto 自启，日常计划任务持续输出正常回执。",
      problem: "若遇到网卡协议解绑或代理配置残留，执行 repair-stream.ps1 即可自动修复并使退出码归零。",
      unavailable: "若主机物理断网或硬件电源故障，需待现场物理连接恢复后再行介入。"
    },
    decisionImpact: [
      "客观分析三种远程唤醒路线：首推“智能插座 + BIOS 来电自启（Restore on AC Power Loss）”，次选“插网线走有线 Realtek 2.5GbE WoL（网络唤醒）”，彻底放弃虚幻的纯无线 WoWLAN（无线局域网唤醒）。",
      "坚决不默认开启 Windows 自动登录，守住物理主机的本地身份安全底线；串流服务本身具备系统级捕获能力。",
      "编写 repair-stream.ps1 提供完全幂等的修复流程：自动重开 WLAN 网卡 IPv6 绑定、清理被污染的环境变量、拉起服务并固化 unattended 模式。",
      "部署 SunshineRemote-VerifyPath-Daily 计划任务，每日定时以轻量、无超时风险的方式记录运行态日志，不增加系统额外负担。"
    ],
    problem: "解决离家后电脑关机无法唤醒、以及系统更新或网络代理异常导致的服务离线问题。",
    implementation: [
      "硬件层：在主板 BIOS 中开启“Restore on AC Power Loss = Power On”，配合智能插座远程断电通电。",
      "驱动层：Realtek 2.5GbE 网卡高级设置中开启“魔术封包唤醒”与“关机网络唤醒”。",
      "脚本层：repair-stream.ps1 幂等修复注册表与服务状态；register-sunshine-verify-task.ps1 注册每日只读轻量巡检计划任务。"
    ],
    flow: [
      "远程发起开机：手机操作智能插座通电，电脑主机自动触发冷启动并进入 Windows 登录界面。",
      "服务自启：Tailscale 与 Sunshine 作为后台服务自动加载，建立网络端点与串流监听。",
      "手机端 Moonlight 发现主机在线，发起连接并输入 PIN 码或直接鉴权进入会话。",
      "日常维护：计划任务每日无感执行 verify-path-lite.ps1，持续记录服务与编码健康度。"
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
      { condition: "智能插座通电后电脑未开机", response: "确认 BIOS 中的 AC 恢复选项未因主板电池耗尽而重置；插座保持通电 5 秒后再开。" },
      { condition: "Tailscale 服务无法启动", response: "以管理员权限运行 repair-stream.ps1，检查服务依赖与网络协议绑定。" }
    ],
    sources: [
      { path: "repair-stream.ps1", role: "传输与服务一键幂等修复工具" },
      { path: "register-sunshine-verify-task.ps1", role: "日常轻量验证计划任务安装程序" },
      { path: "README.md", role: "WoL 与智能插座开机原理深度解析" }
    ],
    verification: [
      "系统服务 SunshineService、Tailscale 与 ToDesk_Service 全部正常运行且 StartType=Auto。",
      "计划任务 SunshineRemote-VerifyPath-Daily 正常存在且状态为 Ready。",
      "每日日志 verify-lite.log 持续留存健康回执。"
    ],
    relation: "为全套远程工作站方案提供冷启动与高可用自愈护航，闭环解决全生命周期运维难题。"
  }
];

export const project = sunshineRemoteStreamingProject;
export const modules = sunshineRemoteStreamingModules;
