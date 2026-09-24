import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  "observedAt": "2026-09-24T04:52:42Z",
  "label": "双击图形界面，按问题选择检查修复或关闭代理；配置与网页结果分别报告",
  "boundary": "本页依据已发布源码与隔离验证更新使用方式，未在本人当前网络执行修复、关闭客户端、网卡重置、IPv6 切换或出口探测。9 月 14 日的只读网络样本仍只属于当时。",
  "metrics": [
    {
      "label": "源项目",
      "value": "925de61 · master已回读"
    },
    {
      "label": "日常入口",
      "value": "一个双击入口 · 首页两项操作"
    },
    {
      "label": "检查边界",
      "value": "启动只查本机 · 网页测试按操作触发"
    },
    {
      "label": "源测试",
      "value": "源载 193 项回归 · PS 5.1/7"
    }
  ],
  "facts": [
    {
      "label": "它真正解决的事",
      "value": "代理客户端退出后，Windows、终端或 Git 可能还指向失效端口，TUN 也可能留下旧路由。双击 ProxyClean 后先看本机状态；需要时由本人选择检查修复或关闭某个代理。确认后才修改可安全识别的设置并回读，另报基础网页是否可访问。普通修复不会自动刷新 DNS、重启网卡或切换 IPv6。",
      "hero": true
    },
    {
      "label": "绝不焊死端口的核心安全原则",
      "value": "旧版工具曾试图把代理环境变量对齐到某个备用代理端口，导致“机场一关，命令行、Claude Code 与 git 全线瘫痪”。ProxyClean 确立铁律：环境变量 HTTP_PROXY / HTTPS_PROXY / ALL_PROXY 与 git 代理只会被【清成直连】，永不主动指向任何代理端口；备用代理配置已彻底退役仅作直连参考。",
      "hero": true
    },
    {
      "label": "物理默认路由硬保护",
      "value": "Test-HealthyPhysRoute 现在要求候选路由对应适配器明确 HardwareInterface=true、状态 Up，且 NextHop 非零、不属于198.18/198.19 fake-ip。只有虚拟、未知或缺失网卡时，不放行任何路由删除；删除后的检查复用同一函数。它依据 Windows 硬件接口标记，不额外证明网关或公网可达。"
    },
    {
      "label": "默认只清失效项；直连模式也有明确范围",
      "value": "默认仅清确认失效的本地端点，保留活、远程、未知和混合映射的其他部分。Direct明确处理手动WinINET、用户HTTP_PROXY/HTTPS_PROXY/ALL_PROXY、可安全定位的通用全局Git代理及有物理回退保护的IPv4残留路由；PAC、WinHTTP、机器变量、URL专属或来源含糊Git、Docker及其他应用不隐式改变，NO_PROXY保留。",
      "hero": true
    },
    {
      "label": "动态端点发现与零固定端口表",
      "value": "首页关闭流程按飞鸟、Clash Verge 等已识别客户端归组，并动态发现真实端口；通用核心仅在实际父子进程关系成立时归组。技术状态脚本仍能查看监听、TUN 和 Docker Desktop 的代理配置，但进程名或端口本身都不能保证兼容所有版本或证明出口健康。",
      "hero": true
    },
    {
      "label": "关闭代理先认客户端，再核对端口和设置",
      "value": "首页先显示客户端级预览：只发现一个时直接预览，多个时先选一个。先请客户端与辅助服务正常退出；仍在运行时另行确认强制关闭。退出、端口身份和配置都重新核对后，才把同一客户端多个端口的相关引用合为一次可恢复设置操作；其他客户端与未确认范围保留。技术端口脚本仍可单独按指定端口处理。",
      "hero": true
    },
    {
      "label": "WiFi分级恢复与可选报告",
      "value": "WifiRebind提供Diagnose、SoftReset、AdapterReset；默认脱敏结果不落日志，明确LogPath才保存到新文件。断线或无IPv4时也可指定网卡；静态地址不释放DHCP，释放失败仍尝试续租，禁用成功后始终尝试重新启用。网络重置会中断选中连接，不作为当前远控的无害测试。",
      "hero": true
    },
    {
      "label": "通知系统，不冒充旧进程环境已更新",
      "value": "主脚本通过 PInvoke（平台调用）调用 SendMessageTimeout 广播 WM_SETTINGCHANGE，并用 InternetSetOption 通知 WinINET 配置变化。这能避免通知过程长期挂住，但删除 HKCU 用户环境变量不会改写已经运行进程自己的环境副本；Git、终端、Node 或 Electron 应用仍可能需要重新打开。",
      "hero": true
    },
    {
      "label": "IPv6 状态与物理网卡整组切换已经归入本项目",
      "value": "IPv6状态和切换只处理明确的物理网卡，保留虚拟与Tailscale隧道；变更保存实际原值，失败分别回读恢复，不把再次整组切换当精确撤销。绑定状态、默认路由、HTTP可达与代理路径分别判断，本轮未改变任何实际网卡。",
      "hero": true
    },
    {
      "label": "已发布源码与验证证据",
      "value": "正式 master 925de61814f49f30d6e58ccb03d819c030cdab12 保留双操作首页与客户端级关停，并修复了关闭客户端后清理 WinINET 和用户代理变量时的注册表写入失败。来源变更记录载明新增 12 项隔离回归通过、整仓 193 项在 PowerShell 7.6.4 与 Windows PowerShell 5.1 通过；先前只读图形与隔离客户端关停验证保留原日期。本站没有在本人当前网络关闭代理或重演修复。"
    }
  ],
  "gaps": [
    "清理默认路由、切换 IPv6 和禁用/重新启用 WiFi 网卡依赖 Windows 管理员权限；普通权限下不能把这些动作冒充完成。",
    "基础网页测试使用微软测试站点；若宽带或物理链路断开，会单独报告失败。配置修好、网页通过与所有应用直连是三种不同结论。",
    "ProxyStatus 只判断 Docker Desktop 是否存在手工本地代理钉死或配置等待应用，不验证那个端口已经死亡，也不会改配置、Apply（应用）或重启 Docker。",
    "ProxyClean 的系统代理清理判断使用 ProxyEnable 与 ProxyServer，不移除 AutoConfigURL（自动配置脚本地址）；存在 PAC（自动代理配置）时不能只凭 ProxyEnable=0 宣称整机已纯直连。",
    "用户级环境变量清理只影响以后启动的进程；已运行的终端、Git 工具、Node 或 Electron 应用可能需要重开。",
    "2026-09-14 的只读状态看到 1 个系统代理端口与 1 条 TUN 路由，未探测出口；这些是历史现场，不代表 2026-09-22 的当前网络或真实恢复效果。"
  ]
});

export const proxycleanSnapshot = Object.freeze({
  ...baseSnapshot,
  sourceCommit: "925de61814f49f30d6e58ccb03d819c030cdab12",
  sourceRoot: "E:\\Projects\\Tools\\ProxyClean",
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const proxycleanProject = {
  galleryPresentation: {
    kicker: "本人提供的五张实际界面",
    title: "从本机检查到修复结果、详情与维护",
    description: "截图展示已出现的窗口和状态；每张保留原观察范围。截图未绑定源码提交，也不证明本站在当前网络执行过修复或已恢复所有应用联网。"
  },
  "gallery": [
    {
      "src": "/media/proxyclean/checking.png",
      "thumbnail": "/media/proxyclean/checking.png",
      "alt": "ProxyClean启动后的只读检查",
      "caption": "打开程序先检查当前代理，检查过程中能看到真实步骤，也可以取消。此时还没有修改网络。",
      "evidenceLevel": "E2",
      "evidenceLabel": "本人提供的实际界面",
      "observedAt": "2026-09-22",
      "sourceCommit": "截图未绑定源码提交",
      "proves": "展示检查中的窗口与可取消状态。",
      "doesNotProve": "不证明检查已完成、配置已修改或网络已恢复。",
      "sourceSha256": "70062412d56d7c8ce0cc1d267d6bbdc447dd6f94e22140f3b5e4a0ed7568c642"
    },
    {
      "src": "/media/proxyclean/home.png",
      "thumbnail": "/media/proxyclean/home.png",
      "alt": "ProxyClean日常首页与两个主要操作",
      "caption": "首页显示当前Windows代理和检查结论；能正常上网就不用操作。需要时选择检查修复，或明确关闭代理。",
      "evidenceLevel": "E2",
      "evidenceLabel": "本人提供的实际界面",
      "observedAt": "2026-09-22",
      "sourceCommit": "截图未绑定源码提交",
      "proves": "展示实际首页、当前代理名称与两种日常选择。",
      "doesNotProve": "不证明所有程序都能联网，也不代表打开窗口会自动修复。",
      "sourceSha256": "7cb3f2e7dc7171939a3b1e030c12828eafc5b4d5d8d7d21ea4c6a2d2c061398c"
    },
    {
      "src": "/media/proxyclean/no-fix-found.png",
      "thumbnail": "/media/proxyclean/no-fix-found.png",
      "alt": "没有发现可自动修复配置时的结果",
      "caption": "本次没找到可自动修复的代理问题，测试网页也未确认连通。程序给出下一步，并明确没有重启网卡或修改无线设置。",
      "evidenceLevel": "E2",
      "evidenceLabel": "本人提供的实际界面",
      "observedAt": "2026-09-22",
      "sourceCommit": "截图未绑定源码提交",
      "proves": "展示“未找到可修复问题”和“尚未确认连通”分别表达。",
      "doesNotProve": "不能当作修复成功、网络正常或所有问题已经排除的证据。",
      "sourceSha256": "00d4a9f298cf25e14a6c206ddaad341f729ee98f1403b331c40e86ba71438c59"
    },
    {
      "src": "/media/proxyclean/inspection-details.png",
      "thumbnail": "/media/proxyclean/inspection-details.png",
      "alt": "ProxyClean检查详情与真实过程",
      "caption": "详情分别列出已检查的设置、正在运行的本地代理与保留范围。需要排查时可复制不含秘密的诊断。",
      "evidenceLevel": "E2",
      "evidenceLabel": "本人提供的实际界面",
      "observedAt": "2026-09-22",
      "sourceCommit": "截图未绑定源码提交",
      "proves": "展示可展开的诊断范围、保留说明和本次过程。",
      "doesNotProve": "不证明每个被检查对象都正常；截图中的本地端口只对应这一刻。",
      "sourceSha256": "3eca8e14587f625138ec57dc6b4cec02fc30e3b8dfdb9ec0db77e5e842c76b6f"
    },
    {
      "src": "/media/proxyclean/maintenance.png",
      "thumbnail": "/media/proxyclean/maintenance.png",
      "alt": "ProxyClean手动维护工具",
      "caption": "手动维护保留代理、端口、网卡、DNS和IPv6等入口。先查看影响或结束范围，再决定操作；不是日常修复必须逐个点击的清单。",
      "evidenceLevel": "E2",
      "evidenceLabel": "本人提供的实际界面",
      "observedAt": "2026-09-22",
      "sourceCommit": "截图未绑定源码提交",
      "proves": "展示维护入口以及网卡操作可能中断连接的界面说明。",
      "doesNotProve": "不证明任何维护动作已执行，也不证明这些动作都能由撤销代理设置恢复。",
      "sourceSha256": "5755c136f7e279da86b84061578a1891729658bddbd98266a50f548825ba3d93"
    }
  ],
  ...proxycleanSnapshot,
  ...{
  "cardMetrics": [
    {
      "label": "日常首页",
      "value": "检查修复 · 关闭代理"
    },
    {
      "label": "修复结果",
      "value": "原设置可恢复 · 配置回读"
    },
    {
      "label": "关闭代理",
      "value": "按客户端归组 · 动态端口"
    },
    {
      "label": "高级维护",
      "value": "独立窗口 · 按需操作"
    }
  ],
  "order": 20,
  "slug": "proxyclean",
  technicalSections: [{"title":"来源读取与精确判定","paragraphs":["读取Windows代理、分作用域环境变量、Git配置、监听器、路由和必要Docker配置/日志。动态监听只是候选，不能见到代理进程名就认为每个端口都是HTTP代理；明确关端口时重新核对实际目标，不使用旧端口到整类客户端的隐式映射。","WinINET 注册表设置（Internet Settings）：清理决策读取 HKCU 下 ProxyEnable 与 ProxyServer，解析本地端口并检测 TCP（传输控制协议）监听；WiFi 诊断日志会另外展示 AutoConfigURL。；端口存活时保持不动交由客户端管理；仅当端口已死或加 -Direct 时关闭 ProxyEnable。主清理脚本不移除 AutoConfigURL。","Windows IPv4（第四版互联网协议）路由表（Get-NetRoute）：枚举 0.0.0.0/0 默认路由，匹对 fake-ip 范围与网卡 Status（状态）。；删除前要求至少一条 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由；否则阻断全部路由删除。HardwareInterface 是 Windows 报告的硬件接口标记；该条件仍不主动探测网关或公网是否可达。","用户环境变量（HKCU:\\Environment）：检查 HTTP_PROXY、HTTPS_PROXY、ALL_PROXY 及其小写变体。；只处理本次计划中的用户代理项与来源可定位的通用全局Git代理；Direct也不扩大到机器变量或URL专属/含糊来源配置，NO_PROXY保持。混合配置中的非目标映射保留。","全局 Git 代理配置（git config --global）：检查 http.proxy 与 https.proxy 配置端点。；默认模式只清可安全判为本地死端点的项，混合远程配置保留；-Direct 对两个键执行 --unset-all。","Docker Desktop 配置文件（settings-store.json）：审计 OverrideProxyHTTP 等本地端点覆盖项与 httpproxy.log 最近运行态代理模式。；发现手工本地端点或配置等待应用时输出提示；不判断该端口已死，也不修改或重启 Docker。","活动网卡 IPv6 绑定与 ::/0 默认路由：IPv6 状态入口只读展示；切换入口筛选 HardwareInterface=true 的物理上网网卡，并排除 natpierce、Tailscale、WSL 和其他虚拟网卡。；交回查看结果或显式切换结果；网页刷新不会执行切换。","工具读取本机代理、监听、路由、网卡、Docker 与环境配置，不抓取浏览内容或网络流量。变更范围按入口分别限定：代理配置/候选默认路由、明确端口进程、选定 WiFi 网卡或筛选后的物理 IPv6 网卡。"]}],
  "usageEntry": "双击根目录“00-打开 ProxyClean.vbs”；先看首页状态，故障时点“检查并修复上网问题”读预览，确认后才执行。",
  "usageInputs": ["遇到的联网问题","是否还要使用代理","需要关停的客户端或需要操作的网卡（如适用）"],
  "title": "ProxyClean",
  "kicker": "上不了网先检查；不用代理时再明确关闭",
  "route": "/projects/proxyclean",
  "visibility": "公开仓库",
  "statusTone": "accent",
  "cardStatus": "图形首页两项日常操作已发布；当前网络效果未复测",
  "cardStatusTone": "accent",
  "searchAliases": [
    "proxyclean",
    "ProxyClean",
    "代理断开后网页打不开",
    "清理死端口",
    "WinINET代理关闭",
    "TUN虚拟网卡断开残留路由",
    "fake-ip黑洞路由清理",
    "备用默认路由前置条件",
    "清空HTTP_PROXY环境变量",
    "恢复直连",
    "00-打开 ProxyClean.vbs",
    "检查并修复上网问题",
    "关闭代理，恢复普通上网",
    "Docker代理设置审计",
    "Stop-ProxyPort",
    "WifiRebind"
  ],
  "searchProjection": {
    "intents": [
      "代理软件关闭后浏览器和终端都连不上网怎么修复",
      "怎样清理TUN模式残留的198.18黑洞默认路由",
      "排查环境变量里残留的本地死代理端口",
      "Docker容器拉取镜像因代理死端口超时怎么排查",
      "关闭正在运行的代理客户端并清理对应残留设置",
      "WiFi连着但无法上网时怎样按需刷新DNS和DHCP",
      "怎样查看或切换物理网卡IPv6而不动Tailscale和WSL"
    ],
    "entities": [
      "00-打开 ProxyClean.vbs",
      "ControlCenter.ps1 / ProxyClean.Workflow.ps1 / ProxyClean.Clients.ps1",
      "ProxyClean.ps1",
      "ProxyStatus.ps1",
      "Stop-ProxyPort.ps1",
      "WifiRebind.ps1",
      "WinINET ProxyServer / ProxyEnable",
      "198.18.0.0/15 fake-ip 默认路由",
      "SendMessageTimeout / WM_SETTINGCHANGE",
      "InternetSetOption",
      "Docker Desktop settings-store.json",
      "手动维护中的 ipconfig /flushdns",
      "Get-NetTCPConnection",
      "IPv6-Status.ps1 / IPv6-Toggle.ps1"
    ],
    "relations": [
      "ProxyClean在存在HardwareInterface=true且Up且非零非fake-ip物理默认路由时处理候选孤儿路由并清理死端口",
      "ProxyStatus动态发现监听端口并审计Docker本地手动代理钉死",
      "指定端口核对实际进程，只清目标端点；可撤销配置与进程停止分别处理",
      "WifiRebind提供诊断、轻量刷新与网卡禁用再启用；明确LogPath才保存排错报告",
      "首页关闭流程按客户端归组并动态核实多个端口，正常退出未完成时另行确认强制关闭",
      "IPv6入口只查看或切换真实硬件网卡并排除natpierce、Tailscale和WSL"
    ],
    "failureRecovery": [
      "没有HardwareInterface=true且Up且NextHop非零非fake-ip的物理默认路由时不删除任何路由",
      "默认模式仅清本地死端口并保留活或远程代理，显式Direct会清空列出的代理设置",
      "环境变量与git代理仅清空为直连且绝不焊死新代理端口",
      "缺少管理员权限时安全跳过网卡重置并提示提权"
    ]
  },
  "repositoryNote": "ProxyClean 是 PUBLIC（公开）工具仓库，不包含可复用订阅链接、令牌或节点凭据。两份历史故障文档保留了已脱敏的设备、端口、拓扑与测量背景；网页只采用会改变产品理解的方法、边界和结论，不把历史现场当成当前运行状态。",
  "summary": "双击根目录的“00-打开 ProxyClean.vbs”，先看当前 Windows 代理。上不了网时点“检查并修复上网问题”；不想再用代理时点“关闭代理，恢复普通上网”。程序先展示要改什么，确认后才保存原设置、执行并回读，另测基础网页。端口、网卡、DNS、IPv6 和出口比较留在独立维护窗口。",
  "why": "代理程序退出后，浏览器、终端和某些应用可能还在尝试连接它留下的旧地址。ProxyClean 先找出哪些设置已经失效，再让本人预览并确认修复；仍在工作的代理和判断不清的设置会保留。",
  "plainExample": "我关掉代理后网页打不开：双击“00-打开 ProxyClean.vbs”，在首页点“检查并修复上网问题”。它先告诉我找到哪些失效设置；我确认后才修复，并分别告诉我设置是否改好、微软测试网页是否可访问。若没有可自动修复的设置，也会给出下一步。",
  "result": "窗口分别告诉我本机设置是否修好、基础网页能否访问，以及哪些应用或代理路径仍未处理。关闭客户端时还会显示它是否退出、相关端口是否关闭；本轮撤销能恢复仍未被别人改动的设置，不能重新打开已结束的程序。",
  "readerStates": {"pass":"确认后，窗口分别显示设置回读、保留范围和基础网页测试；原来已经打开的终端可能需要重开。","problem":"找不到可安全修复的失效项、客户端没完全退出、端口换了主人或设置被别人改过时，停止相应动作并说明下一步。","unavailable":"路由、网卡或受保护进程需要管理员权限时，窗口保留原选择并重新检查；权限或恢复条件不满足就报告未完成。"},
  "dataSources": {"title":"它从哪里判断网络出了什么问题","intro":"程序读取电脑已有的代理、网络和应用设置；看到一个端口或进程名只是线索，关闭或清理前还要重新核对。","rows":[{"source":"Windows 系统代理","data":"查看浏览器等程序正在使用的手动代理地址，以及本机是否还有程序在对应端口提供服务。","result":"端口仍在正常使用就保留；确认失效时才按预览关闭相关手动设置。自动代理脚本另行报告。"},{"source":"Windows 网络路线","data":"查看上网默认路线是否指向已消失的虚拟网卡，同时确认有没有物理路线可以接替。","result":"没有可靠退路就不删路线；改完设置仍要另测基础网页。"},{"source":"终端环境设置","data":"查看以后新开的终端会继承哪些代理地址。","result":"只清本次能确认失效的用户设置；已经打开的终端可能需要重开。"},{"source":"Git 的代理设置","data":"查看 Git 是否另有指向旧本机端口的全局代理。","result":"只处理本次确认的目标，远程地址和不明来源保持原样。"},{"source":"Docker Desktop","data":"查看容器工具是否保存了独立代理设置，以及最近运行记录是否仍在用旧模式。","result":"说明可能的下载超时原因，不在此处替 Docker 应用设置或重启。"},{"source":"物理网卡与 IPv6","data":"读取选定网卡的当前连接和 IPv6 路线。","result":"先把状态交给本人；只有明确选择维护动作才修改对应物理网卡。"}],"note":"只检查本机配置，不读取浏览内容；不同应用可能各用自己的代理，基础网页通过也不证明所有应用都已恢复。"},
  "responsibilities": ["检查系统代理、终端和 Git 是否还指向已经停止的本机代理，只清能确认失效的引用。","检查代理退出后留下的虚拟网络路线；只有确认还有可用的物理上网路线，才删除孤儿路线。","从当前运行中的程序发现代理端口，不用旧端口号猜今天的状态。","提示 Docker Desktop 是否另有自己的代理设置或等待应用的改动；这里先给诊断，不替它重启。","按本人选定的客户端预览、正常退出；必要时另问是否强制关闭，确认端口关闭后只清相关设置。","为指定 WiFi 网卡提供先查、再刷新或重启的维护入口，结果与日志保存分开。","先查看物理网卡的 IPv6 状态；本人明确选择后才改变，虚拟网卡不跟着切换。"],
  "exclusions": ["不会把系统长期指向另一个可能消失的代理端口。","找不到可靠的物理上网路线时，所有默认路线保持原样。","正在工作的、远程的和归属不明的代理设置默认保留；手动直连也不改变每个应用自己的代理或自动配置脚本。","不会自动修改或重启 Docker Desktop。","关闭客户端只针对经过身份核对的目标；一个端口或进程名不能代替目标确认。","只读查看和网页刷新不会触发 IPv6、网卡或路线修改。"],
  "productPrinciples": [{"title":"失效代理只清理，不换一个固定端口","detail":"代理退了，就把确认失效的本机引用清掉；不会为了眼前上网，把浏览器和终端长期改指另一个可能再消失的端口。"},{"title":"没有可靠的物理路线就不删","detail":"修旧虚拟路线前先确认电脑仍有一条物理上网路线；没有这个退路，宁可保留原设置并说明原因。"},{"title":"看当前是谁在监听","detail":"客户端端口会变。工具每次重新查看正在运行的程序和端口，不能拿旧端口表判断今天该关谁。"},{"title":"日常修复与高级维护分开","detail":"首页只处理“检查修复”和“关闭代理”。刷新域名缓存、重启网卡与切换 IPv6 在维护窗口由本人另选。"},{"title":"先预览，冲突时保留现场","detail":"修改前保存原值，修改后重新检查；若期间有人改了同一设置，撤销不会覆盖对方的新结果。"}],
  "glossary": [
    {
      "term": "TUN（虚拟网络设备）",
      "meaning": "在操作系统内核层创建的虚拟三层网络设备；代理软件利用它截获整机 IP 数据包并转发至代理内核。"
    },
    {
      "term": "WinINET（Windows 互联网配置）",
      "meaning": "Windows 系统内置的高层网络组件，存储 IE、Edge、Chrome 及多数桌面应用使用的系统代理注册表项。"
    },
    {
      "term": "fake-ip（伪造 IP 地址）",
      "meaning": "TUN 代理为避免本地 DNS 解析污染而分配的虚拟网段（通常为 198.18.0.0/15），请求流量由代理内核劫持还原。"
    },
    {
      "term": "DNS（域名解析系统）",
      "meaning": "将人类可读的域名转换为网络 IP 地址的服务；代理关闭后若残留 fake-ip 缓存会导致域名解析到无效黑洞。"
    },
    {
      "term": "DHCP（动态主机配置协议）",
      "meaning": "路由器为局域网设备自动分配 IP 地址和网关的协议；WifiRebind 通过 release/renew 重新获取有效租约。"
    },
    {
      "term": "PInvoke（平台调用）",
      "meaning": "PowerShell / .NET 调用 Windows 原生 C/C++ 动态链接库（如 User32.dll、wininet.dll）的底层互操作技术。"
    },
    {
      "term": "Docker Desktop（Docker 桌面版）",
      "meaning": "Windows 上的容器化开发环境；其 settings-store.json 中若锁定了失效的本地代理会导致镜像拉取挂死。"
    },
    {
      "term": "fail-closed（失败关闭）",
      "meaning": "某个动作缺少明确前置条件时停止该动作并告警；例如没有符合谓词的备用默认路由时不删路由。"
    }
  ],
  "technicalOperatingFlow": [
    {
      "title": "双击入口先看本机",
      "detail": "根目录 00-打开 ProxyClean.vbs 检查完整运行文件并显示中文错误。窗口启动后只读检查 Windows 手动代理和简短结论，不自动访问公网。能正常上网时可以直接关闭窗口。"
    },
    {
      "title": "上不了网时先预览修复",
      "detail": "点击检查并修复后重新读取设置；找到可安全修复的失效项，就用中文列出范围。点击开始修复才保存原值、执行、回读并测试微软基础网页。没有可修复项时仍可测试网页并给出下一步。"
    },
    {
      "title": "不用代理时选择关闭客户端",
      "detail": "只发现一个已识别客户端时直接预览；同时发现多个时先选择。UAC 窗口保留所选客户端，重新检查后仍要再确认。先请求正常退出，未完全退出时另行预览并确认强制关闭。"
    },
    {
      "title": "只清已退出客户端的相关引用",
      "detail": "重新核对进程身份和所有相关端口；若客户端重启、端口被接管或检查失败，就不清设置。多个端口的相关引用合为一次可恢复配置事务。PAC、活 TUN、其他客户端和应用独立代理保留并报告。"
    },
    {
      "title": "高级诊断另开窗口",
      "detail": "查看详情和维护工具各有独立窗口；详细过程默认折叠，只在点击“复制脱敏诊断”时复制不含备份原值、密码和客户端完整路径的技术数据。只读检查可取消，修改或恢复中不能强制关闭。DNS、网卡、IPv6、手动代理和公网出口比较按需操作；出口比较请求 ipify 前另行确认。"
    }
  ],
  "operatingFlow": [{"title":"打开首页看当前状态","detail":"双击“00-打开 ProxyClean.vbs”，先看系统代理和简短结论；正常时直接关闭即可。"},{"title":"故障先看预览","detail":"点“检查并修复上网问题”，确认哪些死端口或设置会改变；关闭代理客户端、网卡和 IPv6 有各自明确入口。"},{"title":"确认执行并读回","detail":"点“开始修复”后看配置读回与基础网页测试；仍断网时按详情定位，Undo 只撤回本轮可逆配置。"}],
  "usageExamples": [
    {
      "ask": "代理软件退出后，网页和命令行都连不上网，怎样一键恢复？",
      "effect": "双击唯一日常入口，点检查并修复；先看中文预览再确认。工具保留仍在工作的代理，保存原设置，修复后回读并测试微软基础网页；不会自动刷新 DNS 或重启网卡。",
      "moduleSlug": "dead-port-and-route-cleanup"
    },
    {
      "ask": "想知道当前系统代理到底是开是关，有哪些代理端口在监听，Docker 是否被卡住？",
      "effect": "直接告诉你系统代理现在是否开启、哪些本机端口正在提供代理、这些端口由谁占用，以及 Docker 当前是跟随系统代理、单独配置还是没有代理；这里只查看状态，不顺手清理或改配置。",
      "moduleSlug": "dynamic-proxy-status"
    },
    {
      "ask": "我不用代理了，能把飞鸟关掉并恢复普通上网吗？",
      "effect": "首页选择关闭代理。只运行飞鸟时直接看它的预览；多客户端时先选飞鸟。正常退出未完成才单独确认强制关闭；端口关闭后只清飞鸟相关引用，其他客户端和 PAC 等未处理范围会明说。",
      "moduleSlug": "targeted-port-shutdown"
    },
    {
      "ask": "WiFi断了，先查指定网卡，必要时再恢复；别自动改其他网络。",
      "effect": "先在维护窗口查看网卡，再按需要选择刷新或重启；首页修复不会自动触碰网卡。断线或无 IPv4 时也可明确指定网卡；结果直接返回，只有指定 LogPath 才保存新日志。",
      "moduleSlug": "wifi-rebind-and-recovery"
    },
    {
      "ask": "先看IPv6出口，需要调整时只改我点名的物理网卡。",
      "effect": "先读绑定与路由，再明确开启、关闭或整组切换；实际修改核对管理员、网卡身份及原值，失败按本轮前像尝试恢复。Tailscale与虚拟网卡保留；Toggle不是撤销，配置成功不证明应用出口正确。",
      "moduleSlug": "ipv6-routing-control"
    },
    {
      "ask": "订阅更新失败但已有节点还能上网，我该先修代理、换热点，还是检查浏览器？",
      "effect": "先用状态入口取得本机代理、监听和路由事实；订阅控制面的 :5413/:443 仍要按长期文档执行独立请求，不能由 ProxyStatus 代测。热点恢复、远程观测盲区和浏览器 DNS/WebRTC 与 Codex/Claude App 连通性继续分开。",
      "moduleSlug": "one-click-and-troubleshooting-boundaries"
    },
    {
      "moduleSlug": "one-click-and-troubleshooting-boundaries",
      "ask": "先让我看看会清什么，改完不合适还能撤回吗？",
      "effect": "控制中心先显示准确计划，执行前再核对现场并保存受保护原值；Undo只撤回仍与本轮结果一致的设置。别人后来改过的内容会保留，进程停止与网卡重置不能靠撤销复活。"
    }
  ],
  "components": [
    {
      "name": "ProxyClean.ps1（命令行清理入口）",
      "responsibility": "保留可脚本化的失效代理清理、显式直连、预览与撤销；日常用户从图形入口开始。",
      "implementation": "包含 PInvoke NativeMethods（User32 + WinINet）、Get-ProxyEndpoints 解析器，以及 HardwareInterface=true/Up/非零/非 fake-ip 物理默认路由前置条件。"
    },
    {
      "name": "ProxyStatus.ps1（动态状态发现器）",
      "responsibility": "动态嗅探系统代理端点、活动代理进程与 TUN 默认路由，审计 Docker 本地代理钉死风险。",
      "implementation": "读取 WinINET 注册表、Get-NetTCPConnection 与 Docker settings-store.json，支持 -Json 结构化输出。"
    },
    {
      "name": "Stop-ProxyPort.ps1（技术端口入口）",
      "responsibility": "维护场景可按已确认端口预览、结束监听并只清该端点引用；首页另有按客户端归组的正常退出和单独强制确认流程。",
      "implementation": "明确端口先预览，再按当前监听与进程身份执行；只清目标端点配置，ExtraProcessName才追加进程。配置使用共享持久前像与恢复原语，不调用通用主清理扩大范围；进程停止不能由配置Undo撤销。"
    },
    {
      "name": "WifiRebind.ps1（WiFi 分级修复与排错器）",
      "responsibility": "WiFi 只读诊断、DNS/DHCP 软刷新和网卡禁用后重新启用；默认不落盘，显式 LogPath 才保存脱敏报告。",
      "implementation": "实现 Get-TargetWifiConfig、Add-NetworkSnapshot、ipconfig /renew，以及 Disable-NetAdapter 后在 finally 中尝试 Enable-NetAdapter 的恢复流程。"
    },
    {
      "name": "IPv6-Status.ps1 / IPv6-Toggle.ps1（IPv6 查看与切换）",
      "responsibility": "查看活动网卡的 IPv6 绑定和 ::/0 默认路由；在显式管理员入口中只切换真实硬件上网网卡。",
      "implementation": "2737328 从 Scripts 吸收该能力，选择 HardwareInterface=true 的网卡并排除 natpierce、Tailscale、WSL 与其他虚拟网卡；日常图形界面的维护窗口保留查看与明确切换。"
    },
    {
      "name": "ControlCenter.ps1 / ProxyClean.Workflow.ps1 / ProxyClean.Clients.ps1（图形与客户端流程）",
      "responsibility": "承接日常两项意图、中文预览、客户端归组与分步关闭，分别回报设置和网页结果。",
      "implementation": "WPF 首页、独立详情/维护窗口共用工作流；后台检查可取消，关闭客户端时进程与端口身份重新核对，多个相关端口进入一次可恢复设置事务。"
    },
    {
      "name": "ProxyClean.test.ps1 与 tests/（回归测试）",
      "responsibility": "隔离验证端点、配置回滚、启动器、图形状态、客户端关停及并发变化等路径。",
      "implementation": "2026-09-24 源变更记录载明注册表写入修复后新增 12 项隔离回归通过、整仓 193 项在 PowerShell 7.6.4 与 Windows PowerShell 5.1 通过；实际本人网络恢复不由回归测试证明。"
    }
  ],
  "technicalContracts": [
    {
      "artifact": "WinINET 注册表系统代理状态",
      "schema": "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
      "owner": "ProxyClean.ps1 / ProxyStatus.ps1",
      "boundary": "仅在代理端口确已死亡或传 -Direct 时将 ProxyEnable 置 0；绝不向 ProxyServer 写入任何新代理端口。"
    },
    {
      "artifact": "用户级环境代理变量",
      "schema": "HKCU:\\Environment (HTTP_PROXY, HTTPS_PROXY, ALL_PROXY, etc.)",
      "owner": "ProxyClean.ps1 / Stop-ProxyPort.ps1",
      "boundary": "确认方案并在效果前复核死端口与原值，写后回读并广播；冲突时停止或恢复，不主动设置新的代理 URL。"
    },
    {
      "artifact": "Docker 桌面代理配置文件",
      "schema": "%APPDATA%\\Docker\\settings-store.json",
      "owner": "ProxyStatus.ps1 (Read-only Audit)",
      "boundary": "只读匹配 OverrideProxyHTTP 等项中的 127.0.0.1 端口，只报不改，严禁盲目静默修改用户 Docker 配置。"
    },
    {
      "artifact": "可选 WiFi 诊断日志文件",
      "schema": "WifiRebind.ps1 -LogPath <新文件>",
      "owner": "WifiRebind.ps1",
      "boundary": "默认不保存日志；显式给出新路径时才写脱敏摘要，不覆盖已有文件。"
    },
    {
      "artifact": "物理网卡 IPv6 绑定",
      "schema": "活动 HardwareInterface=true 网卡的 ms_tcpip6 绑定与 ::/0 默认路由",
      "owner": "IPv6-Status.ps1 / IPv6-Toggle.ps1",
      "boundary": "状态入口只读；切换入口需要管理员权限，并排除 natpierce、Tailscale、WSL 和其他虚拟网卡。网页刷新不执行切换。"
    }
  ],
  "evidenceLayers": [
    {
      "layer": "源码与核心原则断言",
      "proves": "修复后的Test-HealthyPhysRoute明确要求HardwareInterface=true，虚拟/未知/缺失网卡不能放行删除；后置检查复用相同判定，默认保留活代理与活TUN。",
      "doesNotProve": "不证明外部任意第三方机场客户端未来版本不会采用更为特殊的网络劫持方式。"
    },
    {
      "layer": "2026-09-24 注册表修复与既有图形验证",
      "proves": "源 CHANGELOG 记录新增 12 项隔离注册表回归通过、整仓 193 项在 PowerShell 7.6.4 与 Windows PowerShell 5.1 通过；旧写入器在新增测试中曾失败 10 项。9 月 22 日 WPF 只读烟测、六条只读导航及隔离客户端关停验证仍属当日证据。",
      "doesNotProve": "隔离注册表与客户端测试不证明本人当前代理已关闭、网络已恢复、所有应用已直连，也不覆盖物理断线。"
    },
    {
      "layer": "WiFi 重绑测试（Test-WifiRebind.ps1）",
      "proves": "证明 WiFi 脚本可解析，并以静态合同检查三种模式、禁用后必试图重新启用、失败退出码、日志路径和批处理接线。",
      "doesNotProve": "不证明无线路由器信号弱或欠费导致的宽带中断能通过本地网卡重启自愈。"
    },
    {
      "layer": "2026-09-14 只读运行状态",
      "proves": "2026-09-14T04:23:52Z 独立 ProxyStatus 只读看到系统代理开启、1 个发布本地端口、3 个监听候选、1 条 TUN 和 2 条默认路由；进程分组为 tailscaled 与 FlyingBird。Docker 运行日志为 system；当时未探公网出口。",
      "doesNotProve": "没有运行任何清理、关端口、WiFi、IPv6 切换或外网探测，不证明当前代理出口健康、直连成功、WiFi 恢复或 IPv6 没有绕行。"
    }
  ],
  "operationalEntrypoints": [
    {
      "name": "唯一日常图形入口",
      "command": "双击 00-打开 ProxyClean.vbs",
      "purpose": "首页先只读检查本机代理；需要时选择检查并修复上网问题，或关闭代理、恢复普通上网。完整文件夹必须保留，不需预先以管理员身份启动。"
    },
    {
      "name": "网络自愈与对齐（默认模式）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\ProxyClean.ps1",
      "purpose": "保留的命令行维护入口：按条件清理失效本地代理与候选孤儿默认路由；默认不刷新 DNS。可加 -Quiet 精简输出；支持 Windows PowerShell 5.1 与 PowerShell 7。"
    },
    {
      "name": "强制直连清理模式",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\ProxyClean.ps1 -Direct",
      "purpose": "命令行的显式直连设置清理，不负责关闭客户端进程或活 TUN；需要关客户端时使用首页关闭流程。"
    },
    {
      "name": "代理状态与 Docker 审计",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\ProxyStatus.ps1",
      "purpose": "查看当前系统代理、监听进程、TUN 默认路由及 Docker 本地代理钉死风险。"
    },
    {
      "name": "IPv6 状态（只读）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\IPv6-Status.ps1",
      "purpose": "查看活动网卡 IPv6 绑定与 ::/0 默认路由，不改变网络状态。"
    },
    {
      "name": "IPv6 物理网卡整组切换（需管理员）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\IPv6-Toggle.ps1",
      "purpose": "只在真实硬件上网网卡上切换 IPv6，保留 natpierce、Tailscale、WSL 与其他虚拟网卡。"
    },
    {
      "name": "指定端口强杀与清理",
      "command": "pwsh -File Stop-ProxyPort.ps1 -Port <已确认端口> -Preview",
      "purpose": "先看具体监听进程和目标配置，确认后去掉Preview；只处理该端口，额外进程须明确指定，旧端口不顺带结束客户端。"
    },
    {
      "name": "WiFi 软刷新（轻量自愈）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\WifiRebind.ps1 -Mode SoftReset",
      "purpose": "对明确网卡刷新DNS/DHCP，静态地址不释放DHCP；默认返回脱敏结果，LogPath才写新文件。操作可能断开网络，不能只看命令结束就认定已恢复。"
    },
    {
      "name": "WiFi 网卡禁用再启用（需管理员）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\WifiRebind.ps1 -Mode AdapterReset",
      "purpose": "先禁用再重新启用选定 WiFi 网卡；禁用或启用失败会返回明确退出码和手工恢复提示。"
    },
    {
      "name": "图形窗口的命令行启动方式",
      "command": "pwsh -NoProfile -STA -File .\\ControlCenter.ps1",
      "purpose": "打开与双击入口相同的界面；入口本身只检查本机。旧 ProxyClean控制中心.vbs 已移至旧版入口，仅为兼容保留。"
    },
    {
      "name": "修复预览与撤销",
      "command": "pwsh -File ProxyClean.ps1 -Preview -Json; pwsh -File ProxyClean.ps1 -Undo -Preview",
      "purpose": "两种预览均不改配置、不生成撤销文件。实际操作使用同一正式入口；恢复待处理时先处理原记录，不覆盖它。"
    },
  ],
  "snapshotUpdateNote": "本页现对齐 2026-09-24 已发布源 925de61814f49f30d6e58ccb03d819c030cdab12：修复客户端退出后 WinINET/用户代理变量的注册表写入，新增隔离回归。9 月 22 日图形入口、9 月 18 日路由/撤销和 9 月 14 日网络样本保留原证据日期；五张本人截图未绑定源码提交，也不证明当前网络修复。",
},
  "kicker": "一个双击入口，先看本机状态，再按需要修复或关闭",
  "readerBoundary": "配置已清理、端口已关闭和应用真的联网是不同结果。网卡重置会中断连接；撤销不复活已结束进程，也不保证所有应用已改走直连。",
  "evolution": [
    {
      "date": "2026-06–07",
      "title": "先停止把代理端口写死",
      "commit": "",
      "result": "从固定备用代理转向只处理确认失效的本地配置；正常工作的代理和远程设置保留，避免为了能上网制造另一套长期残留。",
      "evidence": [
        {
          "date": "2026-06-30",
          "note": "去掉强制写入备用代理端口的旧行为。",
          "commit": "972bcc4"
        },
        {
          "date": "2026-07-04",
          "note": "旧固定后备代理路径退出活动实现。",
          "commit": "0ad93df"
        }
      ]
    },
    {
      "date": "2026-08–09",
      "title": "不同网络问题用不同入口",
      "commit": "",
      "result": "动态发现监听与Docker配置，把指定端口、WiFi和IPv6操作分开；没有可靠物理回退路由时不删除默认路由。",
      "evidence": [
        {
          "date": "2026-08-05",
          "note": "动态发现监听与Docker代理配置。",
          "commit": "a888416"
        },
        {
          "date": "2026-08-17",
          "note": "缺少有效回退路由时不删除路由。",
          "commit": "096437a"
        },
        {
          "date": "2026-08-30",
          "note": "监听地址只能限制候选，不能代替确认所选端口所属进程。",
          "commit": "2b46807"
        },
        {
          "date": "2026-09-04",
          "note": "IPv6参数入口收紧到物理上网网卡，保留虚拟接口。",
          "commit": "2737328"
        }
      ]
    },
    {
      "date": "2026-09-18",
      "title": "修之前能预览，修错了有条件撤回",
      "commit": "be5d3f5",
      "result": "控制中心展示计划与结果，原值在动作前保存；关一个端口不再顺带清整机或终止其他客户端，冲突保留现场，诊断默认不落日志。"
    },
    {
      "date": "2026-09-22",
      "title": "日常只需打开一个窗口并选择真实意图",
      "commit": "cd54f2c",
      "result": "根目录保留一个双击入口；首页只突出检查修复与关闭代理。关闭按客户端归组，先尝试正常退出，强制关闭需另行确认；确认后回读设置并测试基础网页。技术工具和历史快捷方式分别留在维护窗口与旧版入口。"
    }
  ],
};

export const proxycleanModules = [
  {
    "slug": "dead-port-and-route-cleanup",
    "usageEntry": "双击根目录“00-打开 ProxyClean.vbs”，在首页点“检查并修复上网问题”，读中文预览后才点“开始修复”。",
    "usageInputs": ["网页或命令行出现的故障","是否还需要正在运行的代理","预览后是否同意执行"],
    "productFlow": [{"title":"先检查","detail":"窗口读取系统代理、端口和路由；仍活着的代理路径会保留。"},{"title":"预览后修复","detail":"只对预览中符合失效条件的配置保存原值并修改；没有可修项时不强行清理。"},{"title":"回读并试网页","detail":"回读实际设置并测试微软基础网页；失败或其他应用仍断网时看明确未处理范围，必要时用撤销恢复本轮可逆设置。"}],
    "shortTitle": "死端口与路由",
    "title": "代理退出后，只修理失效设置",
    "subtitle": "默认保留活代理，只清死本地端口；备用默认路由条件不成立时不删路由",
    "teaser": "区分本地死端口、活代理与远程配置；PInvoke（平台调用）负责通知，清理后分别回读路由和连通性",
    "order": 1,
    "status": "物理默认路由保护已修复；隔离回归通过，真实网络未改动",
    "statusTone": "accent",
    "relation": "首页“检查并修复上网问题”的配置修复核心，也是命令行默认清理与显式直连的技术依据；普通修复不自动刷新 DNS。",
    "value": "代理异常退出后，不必先重启电脑：脚本会把死本地端口和不能继续工作的配置指出来，只在实际条件满足时执行相应清理。",
    "why": "系统代理、环境变量、Git 与路由表各自保存状态。只修其中一处可能仍然断网；盲目删默认路由又可能雪上加霜。因此主入口先判断活监听与 TUN，再对每类配置分别决定保留、清理或拒绝动作。",
    "example": "“代理退了，网页还报连接旧代理失败。”我在首页点检查并修复，先看到失效设置的中文预览；确认后才关闭指向死端口的系统代理并清理相关用户/Git 设置。界面分别显示配置回读与微软基础网页结果；旧终端可能要重开。",
    "result": "窗口逐项告诉我哪些失效代理设置已清、哪些仍在工作的设置被保留、旧网络路线是否因为缺少安全退路而没有动，以及基础网页是否真的打开。",
    "problem": "防止代理崩溃后因残留系统代理和孤儿 fake-ip 路由导致全机断网，防止网络修复工具误删物理路由引发二次灾难。",
    "readerStates": {"pass":"确认失效的本机设置已清，仍在工作的代理保持原样；设置与网页测试分别报告，旧终端可能要重开。","problem":"找不到可靠的物理上网路线时，所有默认路线都保持原样；其他可安全处理的设置仍按预览逐项说明。","unavailable":"需要删除系统路线却没有管理员权限时停止这一步，明确提示如何在同一用户的管理员窗口继续。"},
    "decisionImpact": [
      "不写入新的代理端点。默认只清失效本地项，Direct也仅处理手动WinINET、用户代理变量、来源明确的通用全局Git代理和满足物理回退条件的IPv4残留路由。",
      "删除候选默认路由前必须至少看到一条 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由；否则本轮不删除任何路由。",
      "系统代理仅在指向的本地端口已死或显式传 -Direct 时才关闭；活代理只在默认模式交由客户端维护。",
      "PInvoke（平台调用）广播 WM_SETTINGCHANGE（超时 200ms）与 InternetSetOption 负责通知配置变化；已经运行的进程仍可能需要重开才能取得新的用户环境变量。"
    ],
    "implementation": [
      "User32Sig 声明 SendMessageTimeout(HWND_BROADCAST, WM_SETTINGCHANGE, 'Environment', timeout=200ms)。",
      "WinINet 声明 InternetSetOption(SETTINGS_CHANGED 39, REFRESH 37)。",
      "Test-PortAlive 通过 IPGlobalProperties.GetActiveTcpListeners 严格检验回环与通配地址监听状态。",
      "Test-HealthyPhysRoute 检查网卡 Status 为 Up 且 NextHop 非 0.0.0.0 且非 198.18/198.19 fake-ip 网段。",
      "Test-LocalProxyDead 解析代理端点，仅在全部端点为本地回环且无活跃监听时才断定为死代理。",
      "Test-HealthyPhysRoute在删除前与删除后共同检查HardwareInterface=true；信息未知不充当物理路由证据。",
      "ProxyClean.Operations.ps1在效果前将原值和步骤存入当前用户DPAPI保护的last-operation.dpapi；临写比较preimage，写后回读，失败逆序恢复。外来修改保留为recovery_required并阻止新配置写入；只处理当前轮可撤销对象，文件不是跨设备恢复包。",
    ],
    "flow": [
      "读取 WinINET 注册表与 Get-NetAdapter，检测系统代理发布端口与处于 Up 状态的 fake-ip TUN 路由。",
      "依据现场判定目标：默认模式若有 WinINET 活端口或活动 TUN 就保留活路径，仅清死项；两者同时存在只告警。传 -Direct 则清空列出的代理设置，但仍不结束客户端进程或切 TUN。",
      "执行默认路由条件扫描：备用候选少于 1 条就跳过全部删除；否则处理已消失/Down 网卡路由与直连目标下的 fake-ip 默认路由。",
      "逐项审计用户环境变量与 Git 代理，判定为本地死端口则清空为直连，调用 User32 广播变更。",
      "审计 WinINET 系统代理：若开着却指向死端口，则将 ProxyEnable 置 0 关停恢复直连。",
      "仅在命令行显式 -FlushDns 或维护窗口明确选择时刷新 DNS；普通修复不会自动执行。配置变更仍通知 WinINET。",
      "GUI 已确认修复后回读配置，并单独请求微软基础测试网页；脚本化探测与公网出口比较各按入口说明，网页成功不证明所有应用直连。"
    ],
    "concepts": [
      {
        "term": "Orphan Route Precondition（孤儿路由前置条件）",
        "explanation": "在删除候选默认路由前，源码要求至少存在一条 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由；它明确要求 Windows 标记为物理接口，仍不等于主动测得网关或公网可达。"
      },
      {
        "term": "Direct Mode（强制直连模式）",
        "explanation": "显式 -Direct 会关闭 WinINET、清空列出的用户代理变量并 unset Git 代理，即使值仍活跃或指向远程；它不结束客户端进程或切 TUN。"
      },
      {
        "term": "Loopback Dead Discrimination（本地死端口鉴别）",
        "explanation": "严格区分 127.0.0.1 本地回环与远程代理服务器，只清已死的本地端口，避免误伤正常的远程代理配置。"
      }
    ],
    "boundaries": [
      "若当前没有符合源码谓词的备用默认路由，无论是否指定 -Direct，本轮都不删除任何路由条目。",
      "Direct不是所有应用直连保证：PAC、WinHTTP、机器变量、URL专属/含糊Git配置、Docker与其他应用不隐式修改；混合映射中的其他端点保留。",
      "NO_PROXY 环境变量包含用户白名单配置，脚本绝对不碰、不清空。",
      "普通用户权限下无法修改系统内核路由表，必须提升为管理员才能执行路由删除动作。"
    ],
    "failures": [
      {
        "condition": "现场没有符合条件的备用默认路由",
        "response": "脚本打印黄色警告并跳过全部路由删除，提示先确认 WLAN 或以太网；其余代理配置清理仍按各自条件继续。"
      },
      {
        "condition": "系统代理指向的端口正在正常监听",
        "response": "脚本认定为活动代理，不关闭系统代理，仅提示交由客户端维护，保持现场不动。"
      },
      {
        "condition": "默认模式下 Git 代理同时包含有效远程代理与本地死端口",
        "response": "默认保留无法安全定位的配置，Direct也不越过Git来源边界；先明确可写的通用全局配置，不删除含糊或URL专属项。"
      },
      {
        "condition": "WinINET 活端口与活动 fake-ip TUN 同时存在",
        "response": "默认模式只告警多路径，不替用户选择或关闭客户端；用户先决定保留哪一条，或明确选择 -Direct。"
      }
    ],
    "sources": [
      {
        "path": "ProxyClean.ps1",
        "role": "主清理脚本，实现死端口鉴别、候选孤儿默认路由条件处理与系统广播"
      },
      {
        "path": "ProxyClean.test.ps1",
        "role": "自动化测试套件，验证回环解析与死端口逻辑"
      }
    ],
    "verification": [
      "ProxyClean.test.ps1 验证本地/远程/混合代理解析、活/死本地端口、隔离 Git 配置和只读状态 JSON。",
      "2026-09-24 来源记录 12 项新增注册表回归及整仓 193 项通过；9 月 22 日隔离客户端流程验证保留原日期。两者都未在本人当前网络关闭代理，也不证明公网或所有应用恢复。",
      "源857b110的新增回归包含9个判定场景与3个实际清理条件分支：只有虚拟备用时零删除、活动TUN保留、Direct模式下符合条件的孤儿清理。旧实现先失败，新实现双PowerShell通过。"
    ],
    "searchAliases": [
      "死端口清理",
      "孤儿路由硬保护",
      "ProxyClean.ps1",
      "清空代理环境变量",
      "系统代理恢复直连"
    ],
    "searchProjection": {
      "intents": [
        "代理软件退出后系统代理关不掉怎么解决",
        "怎样安全清理198.18开头的黑洞默认路由",
        "为什么网络修复工具不能随便删默认路由"
      ],
      "entities": [
        "ProxyClean.ps1",
        "Test-HealthyPhysRoute",
        "Test-LocalProxyDead",
        "User32.NativeMethods::SendMessageTimeout",
        "WinINet.NativeMethods::InternetSetOption"
      ],
      "relations": [
        "ProxyClean只有在存在符合谓词的备用默认路由时才处理候选孤儿TUN默认路由",
        "死端口检测仅针对127.0.0.1回环无监听状态进行安全清理"
      ],
      "failureRecovery": [
        "找不到符合条件的备用默认路由时不执行任何路由删除",
        "提升为管理员权限以解锁内核路由表修改权限"
      ]
    },
    readerStatus: "已发布图形入口提供检查、中文修复预览、确认后修改与网页测试。仍工作的代理会保留；本轮只核源码和截图，没有对当前网络执行修复。"
  },
  {
    "slug": "dynamic-proxy-status",
    "usageEntry": "双击“00-打开 ProxyClean.vbs”先看首页状态；需要端口、Docker 和路由细节时点“查看详情”。",
    "usageInputs": ["想弄清系统代理、端口还是某个应用的连接问题"],
    "productFlow": [{"title":"打开即读状态","detail":"显示 Windows 手动代理是否开启和简短结论，不自动访问公网。"},{"title":"查看具体占用","detail":"详情区分监听端口、对应进程、默认路由和 Docker 独立设置。"},{"title":"按事实决定下一步","detail":"活端口、未覆盖的应用配置和未知范围会明说；只读查看不改变网络。"}],
    "shortTitle": "动态状态",
    "title": "先查当前代理，以及哪些程序还在用它",
    "subtitle": "枚举系统代理、实际监听、fake-ip 路由与 Docker 手工代理状态，可选比较出口 IP",
    "teaser": "只读看清当前代理路径和 Docker 配置，不把监听、路由或本地端点自动判成健康/死亡",
    "order": 2,
    "status": "动态发现与 Docker 审计就绪；无硬编码端口表，支持 JSON 结构化输出",
    "statusTone": "accent",
    "relation": "默认清理前的只读观察入口，也可单独用于解释为什么不同应用走了不同出口。",
    "value": "看清 Windows 当前有没有使用代理、哪些本地程序正在提供代理服务，以及 Docker 是跟随系统还是单独设置。先分清每条路径，就能避免修错地方；这里的状态检查本身不修改设置。",
    "why": "代理端口会变，浏览器、终端、TUN 和 Docker 又可能各走一条路径。先把这些当前事实分开列出，才能判断是多路径、手工钉死、旧环境变量，还是别的问题；仅看到一个端点字符串不能证明端口已死。",
    "example": "“网页能打开，但 Docker 下载镜像一直超时，帮我先查当前设置。”AI查看系统代理、实际监听程序和 Docker 的配置与近期日志，指出两者是否使用不同路径。需要修改 Docker 时再进入它自己的设置确认，不把看到一个地址就当成代理已经失效。",
    "result": "得到系统代理状态、实际提供代理的程序、当前网络路径，以及 Docker 的独立设置和未确认项。需要比较公网出口时另行确认；某个端口在运行不等于它能正常联网。",
    "problem": "避免把固定端口表、一个监听记录、一个 fake-ip 路由或一条 Docker 配置各自误当成完整网络结论。",
    "readerStates": {"pass":"分别读到系统代理、提供端口的程序、网络路线和 Docker 自己的设置；查看本身不改网络。","problem":"Docker 保存了独立本地代理，或设置已改但运行记录仍沿用旧值时，提示要到 Docker 里另行核对。","unavailable":"没有安装 Docker 时只把该项写成未安装，其余网络状态仍可查看。"},
    "decisionImpact": [
      "坚持零固定端口表：完全根据系统的 Get-NetTCPConnection 动态判定哪些代理进程在监听。",
      "将 Docker Desktop 纳入只读代理审计，但不把本地端点字符串升级成死端口或容器断网根因。",
      "支持 -Json 参数，便于将网络拓扑与代理状态对接给自动化运维工具或上层脚本。",
      "未加 -SkipExitProbe 时仅采集默认路径和 WinINET 发布端口的出口 IP；不测延迟，也不证明端到端稳定性。"
    ],
    "implementation": [
      "Get-LocalProxyPorts 使用正规表达式提取 127.0.0.1、localhost 与 [::1] 端口，过滤合法范围 1-65535。",
      "Get-DockerProxySnapshot 检查 %APPDATA%\\Docker\\settings-store.json 中的 OverrideProxyHTTP 等覆盖项。",
      "读取 %LOCALAPPDATA%\\Docker\\log\\host\\httpproxy.log 最近 10 分钟运行态日志，核验 Docker 运行时代理模式。",
      "匹配常见代理核心进程名正则（clash|mihomo|sing-box|xray|v2ray|flyingbird|tag 等）。",
      "分层诊断默认不写日志，Docker只读有界尾部且要求事件本身属于当前运行，文件mtime不替旧事件续期。出口比较只给匿名相同出口分组，不公开出口地址；同出口不证明同一客户端，HTTP成功也不证明绕过TUN。",
    ],
    "flow": [
      "读取注册表获取 WinINET 当前系统代理端点与开启状态。",
      "扫描 Get-NetTCPConnection 获取所有监听中的 TCP 连接，结合进程表识别代理核心进程名与 PID。",
      "检查 IPv4 默认路由并列出 NextHop 落在 198.18/198.19 的条目；该状态脚本不判定这些路由生死。",
      "读取 Docker Desktop 配置文件与日志，判定是否存在本地手动代理钉死或配置未生效挂起。",
      "如果未加 -SkipExitProbe，发起网络探测检验出口连通性；最后汇总输出控制台表格或 JSON 对象。"
    ],
    "concepts": [
      {
        "term": "Dynamic Port Sniffing（动态端口嗅探）",
        "explanation": "放弃静态配置列表，直接在系统 TCP 协议栈中按监听状态和进程签名动态发现活动代理端点。"
      },
      {
        "term": "Docker Manual Pin（Docker 手工代理钉死）",
        "explanation": "Docker 桌面版处于 manual 模式并保存了本地代理端点；这值得排查，但状态脚本不会进一步探测该端口是否已经死亡。"
      }
    ],
    "boundaries": [
      "仅审计 Docker 配置文件与只读日志，绝不静默改写 settings-store.json 或强制重启 Docker Desktop。",
      "监听候选来自实际 TCP Listen 记录；只发布 WinINET 端口或由代理进程名匹配且监听在回环/通配地址的记录，不枚举没有监听端口的进程。",
      "出口探测只比较返回的 IP 字符串，不测延迟、速度、丢包或 DNS/WebRTC（网页实时通信）泄露。"
    ],
    "failures": [
      {
        "condition": "Docker 配置文件存在但格式损坏或无法读取",
        "response": "返回 exists=true 与具体 error（错误）信息，不中断其余网络发现逻辑。"
      },
      {
        "condition": "使用 -SkipExitProbe 或外部 IP 服务不可达",
        "response": "current_default 保持 not_probed 或 unknown；本地配置清单仍可读，但不能推断真实出口。"
      }
    ],
    "sources": [
      {
        "path": "ProxyStatus.ps1",
        "role": "动态状态探测与 Docker 审计脚本"
      }
    ],
    "verification": [
      "ProxyClean.test.ps1 会运行 ProxyStatus -SkipExitProbe -Json，确认 schema 与 Docker 节点存在。",
      "2026-09-14 当时的只读状态检查看到 Docker 桌面/容器均为 System、无手工本地钉死且近期 runtime mode 为 system；未执行出口探测。此结论不描述当前 Docker 状态。"
    ],
    "searchAliases": [
      "ProxyStatus.ps1",
      "动态代理探测",
      "Docker代理排查",
      "排查Docker拉取镜像超时"
    ],
    "searchProjection": {
      "intents": [
        "怎样查看当前正在运行的代理客户端监听了哪些端口",
        "排查Docker拉取镜像一直超时是不是本地代理被卡死了",
        "查看系统当前默认路由指向哪个网关"
      ],
      "entities": [
        "ProxyStatus.ps1",
        "Get-DockerProxySnapshot",
        "settings-store.json",
        "Get-LocalProxyPorts"
      ],
      "relations": [
        "ProxyStatus动态列出本地代理监听并审计Docker本地手动端口钉死"
      ],
      "failureRecovery": [
        "在Docker设置中将桌面和容器代理模式切回System并按界面提示Apply"
      ]
    },
    readerStatus: "本机代理与 Docker 诊断入口已实现；自动打开首页不会访问公网。网页保留带日期的旧网络样本，没有把它当成当前所有应用可用的证明。"
  },
  {
    "slug": "targeted-port-shutdown",
    "usageEntry": "在 ProxyClean 首页选择“关闭代理，恢复普通上网”；若发现多个客户端，先选具体客户端，再看预览并确认。单端口维护走独立维护窗口。",
    "usageInputs": ["想关闭的代理客户端","正常退出失败时是否允许另行强制关闭"],
    "productFlow": [{"title":"选准客户端","detail":"首页列出可识别目标；多客户端先选一个，管理员窗口会重新核对同一身份。"},{"title":"分段关闭","detail":"先请求正常退出；仍未退出时另给强制关闭预览，不能把两次选择合并。"},{"title":"只清相关引用","detail":"端口确实不再由目标占用后才清其系统引用；重启、接管或核对失败时停止并保留其他代理。"}],
    "shortTitle": "关闭代理",
    "title": "首页按客户端关闭代理，维护时可单独按端口处理",
    "subtitle": "先识别所选客户端及真实端口；正常退出未完成才另行确认强制关闭，端口技术入口保留精确范围。",
    "teaser": "按客户端预览、正常退出与独立强制确认；身份或端口变化就停止设置清理",
    "order": 3,
    "status": "客户端关停后的设置写入缺陷已修并有隔离回归；本站未关闭本人当前真实代理",
    "statusTone": "accent",
    "relation": "日常关闭代理的客户端级流程；Stop-ProxyPort.ps1 是维护时针对明确端口的独立技术入口。配置撤销不能复活进程。",
    "value": "不想继续用代理时在首页选择关闭。程序把飞鸟及其辅助进程、可识别的 Clash Verge/Clash/Mihomo 按真实关系归组；只运行一个时直接预览，多于一个时先让我选。它先请客户端正常退出，仍有进程时才询问是否强制结束。",
    "why": "只结束进程会留下失效代理配置，只改配置又不能关闭卡住的监听。因此先核对并停止本次目标，确认端口关闭后才清对应引用；进程结束不能撤销，设置修改则按本轮原值有条件回退，两类结果分别说明。",
    "example": "“我想关飞鸟，保留另一个代理。”首页若只见飞鸟便直接显示预览；有多个客户端时先选飞鸟。确认后先正常退出，仍未退出时另看强制范围。相关端口全关且身份未变，才一次清理飞鸟留下的设置。",
    "result": "分别看到客户端是否退出、相关端口是否关闭、配置是否回读、微软基础网页是否可访问。旧版在清理 Windows 和用户代理设置时可能写入失败；当前正式源码已修复并通过隔离回归，真实使用仍以当次回读为准。其他客户端、PAC、活 TUN 和应用独立代理保留，不能宣布所有流量直连。",
    "problem": "防止代理客户端挂死后难以精确定位进程，防止杀掉进程后留下指向死端口的系统代理导致立即断网。",
    "readerStates": {
      "pass": "所选客户端与辅助服务退出、相关端口关闭并完成设置回读后，才报告已处理的范围；2026-09-22 的隔离验证不等于本站关闭了本人当前代理。",
      "problem": "正常退出不完整时先停止设置清理并展示强制关闭范围；客户端重启、端口换主人、进程身份变化或配置冲突时不沿用旧预览继续清理。",
      "unavailable": "受保护进程或服务需要 UAC 时保留客户端选择，管理员窗口重新检查并要求再确认；仍无法安全识别时不结束未知进程。"
    },
    "decisionImpact": [
      "技术端口入口的地址门接受 127.0.0.1、::1、0.0.0.0 与 ::；只绑定特定局域网地址的监听不处理，但通配监听覆盖所有接口，仍需用户先确认端口身份。",
      "首页按客户端动态识别进程与多个端口，不依赖旧固定端口表；技术端口脚本仍仅在显式 ExtraProcessName 时追加所列进程。",
      "仅移除已确认目标端点，混合映射中的其他协议或远程端点保留，不整串清空。",
      "受保护进程/服务需要提权时保留客户端选择；新窗口重新检查并再确认，不在 UAC 后立刻断开。",
      "首页先正常退出再单独确认强制关闭；同客户端多个端口相关引用合为一次可恢复配置操作。技术端口入口不会在处理后调用通用主清理。"
    ],
    "implementation": ["ProxyClean.Clients.ps1 按可识别客户端及实际父子关系归组控制器、核心和辅助服务；动态发现端口，不把另一个恰好运行的 GUI 误认作核心父进程。","Get-PCClientClosePreview 保存当前进程、端口和所选客户端；Invoke-PCClientClose 先请求窗口/服务正常退出，剩余进程须新的强制预览与确认。","临效果复核进程身份、端口与配置；重启、接管或查询失败即停止清理。多个端口对应设置合成一次受 DPAPI 保护的可恢复事务。","Stop-ProxyPort.ps1 保留技术端口级预览，旧快捷方式只操作名称中的端口并核对预期客户端；不会调用全机通用清理。"],
    "flow": ["首页发现一个已识别客户端时直接进入其预览；多个时先选一个，未识别时引导检查设置。","确认后先请所选客户端和辅助服务正常退出；未完全退出时保留设置，另行展示强制关闭范围。","明确再确认后才结束重新核实身份的剩余进程；端口换主人或客户端重启即停止后续设置清理。","相关端口确认关闭后，一次清理仅指向它们的设置并回读，另测微软基础网页；PAC、活 TUN、其他客户端及应用独立代理列为保留范围。","技术维护按明确端口可单独预览和关闭；进程不能由配置撤销复活，设置冲突与恢复待处理分别报告。"],
    "concepts": [
      {
        "term": "Client Group（客户端归组）",
        "explanation": "日常关闭按实际进程父子关系把控制器、核心和辅助服务归于同一客户端；同名 GUI 恰好在运行不构成归组证据，多个端口的引用在一次可恢复配置操作中处理。"
      },
      {
        "term": "Sequenced Port Cleanup（顺序端口清理）",
        "explanation": "进程停止与配置修复是两种效果：设置有本轮原值和条件撤销，进程不能自动复活；最终分别核对而非合称原子成功。"
      },
      {
        "term": "Listen Address Gate（监听地址门）",
        "explanation": "只采纳回环或通配监听，拒绝只绑定特定局域网地址的服务；通配地址不是回环，不能替代用户对目标端口身份的确认。"
      }
    ],
    "boundaries": [
      "若监听进程的 PID 等于当前脚本自身 PID，自动跳过防止自杀。",
      "只绑定在局域网特定地址上的服务不处理；0.0.0.0/:: 通配监听仍会处理，因为它也是源码的现行地址门。",
      "旧 18090、18091 与 7892 端口快捷方式已移入旧版入口；日常关闭使用按客户端动态发现的首页流程。维护窗口或 PowerShell 可显式指定其他端口。",
      "首页只处理所选客户端及其已核实端口；技术端口入口只处理所选端口的监听者与对应引用，额外进程仅来自显式 ExtraProcessName。两者都不默认关闭其他客户端或清空混合字符串。"
    ],
    "failures": [
      {
        "condition": "正常退出后仍有成员在运行，或端口被占用",
        "response": "不清理可能仍在使用的设置；先显示未完成范围，另行预览并确认强制关闭，仍不成功就返回客户端自身退出指引。"
      },
      {
        "condition": "进程身份、端口或配置在预览后变化",
        "response": "停止沿用旧预览，保留后续修改，重新检查所选客户端；已退出进程不会由配置恢复记录重新启动。"
      },
      {
        "condition": "未能停止一个监听 PID 或附加进程",
        "response": "报告哪个目标未能关闭，保留当前真实监听与设置结果；配置失败按前像恢复，不把继续运行的监听者冒称已结束。"
      },
      {
        "condition": "查询后进程自行退出或端口原本没有监听",
        "response": "报告没有监听或原本关闭，不结束旧映射客户端；仅执行仍明确授权的目标配置计划，其他端点和路由保持。"
      },
      {
        "condition": "用户给出的通配监听端口属于非代理服务",
        "response": "源码无法从地址门证明身份；因此产品入口要求用户先确认端口所属进程，网页不会建议盲目试端口。"
      }
    ],
    "sources": [
      {
        "path": "Stop-ProxyPort.ps1",
        "role": "维护时的指定端口预览、身份复核与精确关闭入口；不承担首页客户端归组。"
      },
      {
        "path": "ProxyClean.Clients.ps1 / ProxyClean.Workflow.ps1 / ControlCenter.ps1",
        "role": "日常客户端归组、正常/强制分步关闭、配置事务和结果显示"
      }
    ],
    "verification": [
      "ProxyClean.test.ps1 验证回环、通配、特定局域网地址的采纳边界和多 PID 去重。",
      "源 2026-09-24 变更记录载明客户端关停后的注册表写入缺陷已修并有新增隔离回归；9 月 22 日正常与强制关停隔离验证保留原日期。本站未关闭本人当前代理，不把隔离结果称为真实网络恢复。"
    ],
    "searchAliases": [
      "按客户端关闭代理",
      "关闭飞鸟",
      "关闭 Clash Verge",
      "Stop-ProxyPort.ps1",
      "强杀代理端口",
      "关闭卡死代理",
      "清理端口监听"
    ],
    "searchProjection": {
      "intents": [
        "怎样只关闭飞鸟而保留其他客户端",
        "一个客户端时直接预览、多个客户端时怎样选择",
        "怎样强杀占用7890端口的代理客户端并关掉系统代理",
        "代理软件无响应时怎样按已确认端口停止监听并清掉残留"
      ],
      "entities": [
        "ProxyClean.Clients.ps1",
        "Stop-ProxyPort.ps1",
        "Get-ListeningPids",
        "Test-LocalListenAddress"
      ],
      "relations": [
        "首页按客户端实际进程关系和端口归组，正常退出未完成才另行确认强制关闭",
        "Stop-ProxyPort按端口逐项停止监听PID和附加进程并联动清理指向该端口的设置"
      ],
      "failureRecovery": [
        "受保护客户端请求 UAC，保留选择后重新检查并确认；身份或端口变化时停止设置清理"
      ]
    },
    readerStatus: "新版已按实际客户端识别和分组关闭，保留先正常退出、另行确认强制结束、最后只清相关设置的流程。当前网页没有实关任何客户端；名称识别不保证支持任意版本或插件。"
  },
  {
    "slug": "wifi-rebind-and-recovery",
    "usageEntry": "在 ProxyClean 的“维护工具”窗口选定网卡，先查看，再明确点刷新或重启；首页普通修复不会自动操作网卡。",
    "usageInputs": ["要检查的 WiFi 网卡（只有一块时可让工具识别）","只看状态、刷新还是重启","是否需要保存诊断日志"],
    "shortTitle": "WiFi 恢复",
    "title": "WiFi连不上时，先查清楚，再恢复指定网卡",
    "subtitle": "从只读快照到 DNS/DHCP（动态主机配置协议）刷新，再到管理员权限下禁用并重新启用选定 WiFi 网卡",
    "teaser": "先只读诊断，再按明确网卡恢复；默认不留日志，重置可能中断连接",
    "order": 4,
    "status": "诊断、软刷新和网卡重置入口保留；本站未操作本人当前 WiFi 网卡",
    "statusTone": "accent",
    "relation": "代理残留清理之外的独立 WiFi 入口，用于区分配置故障和无线网卡/DHCP/DNS 问题。",
    "value": "先判断故障在代理、DNS还是网卡，再决定是否刷新或禁用重启那块网卡。即使断线或没有IPv4，也可以指定目标；诊断默认只返回结果，需要保存时才生成脱敏新文件。",
    "why": "网络重置本身会中断连接，不能把所有失败都变成重启网卡。先核对网卡、地址类型和当前远程依赖，再选择必要动作，失败要尽力恢复已禁用网卡并说清未完成项。",
    "example": "“WiFi断了，先看这块网卡哪里不对，别自动改其他网络。”AI先指定并检查目标；需要重置时说明会暂时断开这条连接，在同一Windows用户的管理员窗口选择刷新或重启网卡。默认直接交回结果；我确实需要保存时才指定一份新日志。",
    "result": "得到指定网卡处理前后的状态、这次动作是否完成以及单独的连通性检查。没有要求保存就不生成桌面文件；指定日志时写一份脱敏新文件，已有文件不覆盖。重新获得地址、能访问测试站点和所有应用可用分别说明。",
    "problem": "防止物理网卡假死或 DHCP 租约过期时误判为代理故障，提供开箱即用的结构化排错依据。",
    "readerStates": {
      "pass": "只读诊断返回当前网卡与代理状态；实际重置后再看网卡是否启用、有没有地址，并另看连接测试。需要日志且明确指定新路径时才保存。",
      "problem": "两种重置都需要同一用户的管理员窗口。SoftReset遇静态IPv4配置就保留原样并停止；网卡身份变化或重置失败时不继续扩大动作，禁用过的网卡会尝试重新启用。",
      "unavailable": "多张候选未能唯一选定、目标不是物理网卡、权限或回读失败时，只说明该步未完成。断线或没有IPv4本身不排除目标；不偷偷改用另一张网卡。"
    },
    "decisionImpact": [
      "Diagnose只读；SoftReset与AdapterReset是分别明确选择的动作，不按失败自动升级。",
      "默认不写日志。只有显式LogPath且确认创建时才写脱敏摘要，拒绝覆盖既有文件；WhatIf不写日志。",
      "未指定别名时从物理无线特征选唯一候选；明确InterfaceAlias时从物理网卡按名称选择，不要求Up或已有IPv4。",
      "两种reset拒绝SYSTEM，并在真实修改前要求同一Windows用户提升权限。SoftReset只接受DHCP Enabled的IPv4接口，静态配置保留。",
      "选定后再次核对接口索引；SoftReset按/flushdns、/release、finally /renew执行。AdapterReset仅在禁用成功后于finally尝试启用。",
      "网卡Up且有IPv4时为adapter_ready，否则needs_attention；连接探针另报，SkipConnectivityChecks或WhatIf为not_tested。"
    ],
    "implementation": [
      "WifiRebind.ps1参数为Mode=Diagnose/SoftReset/AdapterReset、InterfaceAlias、WaitSeconds(0–120)、SkipConnectivityChecks、Json及LogPath；默认Diagnose。",
      "Get-PCWifiAdapter枚举物理网卡，默认按NdisPhysicalMedium或名称/描述识别无线；别名显式选择不依赖在线或地址。Get-PCWifiSnapshot只输出地址数、DHCP与观察状态，不暴露实际地址。",
      "Invoke-PCWifiReset先拒绝SYSTEM，复核接口索引，ShouldProcess确认后检查管理员。SoftReset在任何刷新前拒绝非DHCP接口，release失败也进入renew。",
      "AdapterReset在Disable-NetAdapter成功后，finally中尝试Enable-NetAdapter；未完成就抛出错误，不推断网卡已恢复。",
      "主脚本失败返回status=failed与通用恢复提示、退出码1；needs_attention使用退出码2。不是旧实现的权限3/禁用4/启用5分类。",
      "仅显式LogPath且非WhatIf时在动作之后创建JSON摘要，已存在文件拒绝覆盖。日志失败可能发生在网络动作之后，不构成网络回滚。"
    ],
    "flow": [
      "解析模式和明确网卡；Get-PCWifiAdapter不把断线/缺IPv4当作排除条件。",
      "记录处理前Get-PCWifiSnapshot；Diagnose不修改配置。",
      "需重置时复核同一网卡身份、同用户非SYSTEM与管理员条件，并按ShouldProcess执行。",
      "SoftReset确认DHCP后刷新DNS、释放并在finally续租；AdapterReset禁用成功后在finally启用。",
      "WaitSeconds后回读网卡；可选连接探针独立返回，不由adapter_ready推出公网恢复。",
      "只有LogPath显式选择才创建脱敏新日志；失败保留实际动作状态，不自动重复重置。"
    ],
    "concepts": [
      {
        "term": "Tiered Recovery（分级恢复）",
        "explanation": "由只读诊断到 DNS/DHCP 刷新，再到网卡禁用/重新启用；每个等级都是独立显式选择，不是脚本自动升级。"
      },
      {
        "term": "可选诊断日志",
        "explanation": "只在显式LogPath下创建的脱敏新摘要，默认不落盘；它与网卡动作是否发生是两件事。"
      }
    ],
    "boundaries": [
      "默认诊断不改设置；两种reset均可能中断选定连接，必须明确选择。",
      "SYSTEM不是此入口的运行身份；实际重置要求同一Windows用户管理员，静态IPv4不进入SoftReset。",
      "显式物理网卡选择允许断线和无IPv4；默认自动选择仍必须唯一，不能猜目标。",
      "网络重置不属于代理设置Undo，重新启用也不能保证公网、DNS或全部应用恢复。",
      "SkipConnectivityChecks不做DNS/HTTP探测；日志不是默认结果，也不能作为再次重置的理由。"
    ],
    "failures": [
      {
        "condition": "未获得同用户管理员权限，或以SYSTEM运行重置",
        "response": "在修改前停止并返回失败；Diagnose仍是独立只读入口，不将SoftReset当作无权限例外。"
      },
      {
        "condition": "没有唯一物理目标",
        "response": "请明确InterfaceAlias并重新核对；断线或地址缺失不作为自行换网卡的理由。"
      },
      {
        "condition": "SoftReset目标使用静态IPv4",
        "response": "保留静态配置，不释放地址或把它改成DHCP。"
      },
      {
        "condition": "网卡禁用后重新启用失败",
        "response": "报告未恢复，按Windows网络设置或同一明确网卡的启用入口接续；不以脚本结束冒充网络恢复。"
      },
      {
        "condition": "DHCP释放失败或操作后仍无地址",
        "response": "释放失败仍尝试续租；回读后保持failed或needs_attention，连接探针结果另报，不自动改代理或删路由。"
      },
      {
        "condition": "日志路径已存在或保存失败",
        "response": "不覆盖旧文件；网络动作可能已发生，先回读实际状态，不为日志重置第二次。"
      }
    ],
    "sources": [
      {
        "path": "WifiRebind.ps1",
        "role": "WiFi 修复与诊断报告主脚本"
      },
      {
        "path": "Test-WifiRebind.ps1",
        "role": "自动化测试套件，验证参数与报告生成"
      }
    ],
    "verification": [
      "2026-09-18 网站只读检查过当时的 WifiRebind.ps1 与 ProxyClean.Network.ps1；2026-09-22 更新的是已发布图形入口语义，本页仍未操作真实 WiFi 网卡。",
      "历史记录（不描述现行实现保证）：Test-WifiRebind.ps1 在 Windows PowerShell 5.1 与 PowerShell 7 通过，检查语法、模式、关键命令、退出码和日志路径；旧批处理接线现留在旧版入口。",
      "历史记录（不描述现行实现保证）：测试没有执行 Diagnose、SoftReset、AdapterReset、DHCP 续租或真实网卡禁用/启用；这些保持未做 E2E。"
    ],
    "searchAliases": [
      "WifiRebind.ps1",
      "WiFi网络修复",
      "重启无线网卡",
      "刷新DHCP租约",
      "WiFi诊断日志"
    ],
    "searchProjection": {
      "intents": [
        "WiFi连上但是打不开网页怎么刷新网络",
        "怎样重启无线网卡驱动排查网络假死",
        "生成一份详细的Windows网络配置排错报告"
      ],
      "entities": [
        "WifiRebind.ps1",
        "Get-PCWifiAdapter",
        "Get-PCWifiSnapshot",
        "Invoke-PCWifiReset",
        "LogPath"
      ],
      "relations": [
        "先只读诊断，必要时在同用户管理员窗口恢复指定物理网卡",
        "断线或无IPv4也可明确指定",
        "默认不落日志，保存与网络动作分别报告"
      ],
      "failureRecovery": [
        "静态IP拒绝SoftReset",
        "禁用后尝试重新启用，失败保留恢复缺口",
        "日志失败不自动重跑网络动作"
      ]
    },
    readerStatus: "已发布实现提供只读诊断、DNS/DHCP刷新和网卡重启；断线或没有IPv4也能明确选网卡。本页未执行真实重置或连通性探针，实际恢复效果仍要当次确认。",
    productFlow: [{"title":"先找准要检查的网卡","detail":"只有一块可辨认的物理 WiFi 时可直接选；多块就请本人点名。即使已断线也能检查，正在用它远程连接时先说明可能中断。"},{"title":"只读看当前问题","detail":"先查地址、域名解析和代理状态；查看不会自动重启网卡。"},{"title":"明确选一种恢复动作","detail":"需要时选择温和刷新或禁用后重启指定网卡；两种都可能短暂断线，静态地址不走自动续租。"},{"title":"回读是否真的恢复","detail":"检查网卡是否重新启用、有没有地址以及基础连接结果；仍失败就交回具体缺口，不改别的网卡。"},{"title":"日志单独决定","detail":"结果默认直接显示；本人确实要留一份时才保存脱敏报告。保存失败不等于网络动作没发生，不为补日志再重置。"}]
  },
  {
    "slug": "ipv6-routing-control",
    "usageEntry": "在 ProxyClean 的“维护工具”窗口先查看 IPv6 绑定与路由，再明确选择物理网卡和开启、关闭或切换。",
    "usageInputs": ["要处理的物理网卡（不确定可先查看）","只查还是明确开启、关闭或切换 IPv6","需验证的应用出口"],
    "shortTitle": "IPv6 查看与切换",
    "title": "查清IPv6路径，再改变明确物理网卡的设置",
    "subtitle": "先只读判断 IPv6 是否可能绕过 IPv4（第四版互联网协议）代理，需要时只切换真实硬件上网网卡",
    "teaser": "保留 natpierce、Tailscale、WSL 和其他虚拟网卡；网页刷新绝不自动切换",
    "order": 5,
    "status": "源项目 2737328 已发布并通过双 PowerShell 版本测试；网页未执行真实 IPv6 切换",
    "statusTone": "accent",
    "relation": "从 Scripts 吸收进 ProxyClean 的网络路径能力，独立于默认代理残留清理和 WiFi 恢复。",
    "value": "先看明确物理网卡的IPv6绑定与路由，再决定是否改变。调整保留原值并检查结果；失败按实际前像恢复，保留虚拟与Tailscale通道。关闭IPv6不等于所有流量已经走代理。",
    "why": "IPv6 与 IPv4（第四版互联网协议）有独立默认路由。只接管 IPv4 的代理可能无法解释 IPv6 路径，而一刀切禁用所有网卡又会破坏 Tailscale、WSL 或 natpierce。这个入口把只读判断和显式切换分开，并限定真实硬件接口。",
    "example": "“先看看IPv6是不是另一条出口；确需调整时，只关闭我点名的物理网卡，别碰Tailscale和WSL。”先查状态，再选择Disable、Enable或Toggle及目标；实际修改需要管理员权限，完成后看每块网卡回读。Toggle是整组开关，不是撤销键。",
    "result": "拿到接口绑定、默认路由与实际变更数量。写入失败时，工具尝试按本轮逐网卡原值恢复并核对；有残留就明确待恢复。成功后再次Toggle不能保证回到原先混合状态，常规代理设置Undo也不是IPv6的长期回滚。",
    "problem": "避免把 IPv6 绕行问题误当成代理端口故障，也避免为了排查而把私有组网和虚拟化网络一起关掉。",
    "readerStates": {
      "pass": "明确目标和操作后，实际修改逐项核对身份、原值与写后结果；最终还要看真实绑定状态，不能仅凭目标值或一句成功文本推定所有网卡都变了。",
      "problem": "默认路由存在不等于已证明应用绕过代理。改动失败会尝试恢复本轮已动字段；恢复失败或期间有并发变化时，应先核对现场，不靠再点Toggle掩盖。",
      "unavailable": "没有合格活动物理接口、目标身份或原值变化、缺少实际变更所需管理员权限时，停止对应动作，保留虚拟网卡；未知绑定不当作已关闭。"
    },
    "decisionImpact": [
      "只读IPv6-Status与显式IPv6-Toggle分开，普通代理清理不自动改IPv6。",
      "Mode支持Toggle、Enable、Disable，InterfaceAlias可限定明确候选；目标仍须Up、HardwareInterface=true并排除已知虚拟/隧道接口。",
      "每块网卡记录name、index和enabled前像；Toggle按anyOn=>全关、全关=>全开，Enable/Disable使用明确目标值。",
      "实际写入前检查管理员、接口索引/硬件身份与绑定原值；写后逐项验证。ShouldProcess拒绝或无需改变可使changed=0，返回的enabled是目标值，不能单凭它当实际全部状态。",
      "catch只恢复本轮已尝试的绑定并回读，失败列为仍需恢复。该回退没有完整的并发新值CAS保护，也不是持久Undo；不承诺保住所有外来变化。",
      "配置绑定、IPv6默认路由、代理覆盖和应用出口分别验证。"
    ],
    "implementation": [
      "Get-PCIPv6Snapshot读取Up接口的绑定与::/0；无法读取保留unknown，internet_reachability与proxy_routing均not_tested。",
      "Invoke-PCIPv6Change筛选Up且HardwareInterface=true，排除VMware/vEthernet/Loopback/Tailscale/WSL/FlyingBird/natpierce，并按可选InterfaceAlias缩小范围。",
      "变更前为每项保存name/index/enabled。Mode显式选择目标，逐项ShouldProcess后才检查管理员并复核接口身份与当前绑定是否仍等于前像。",
      "写入前将项加入changed列表，Enable/Disable-NetAdapterBinding后立即回读。失败时按changed列表恢复各自enabled前像并回读；无法恢复抛出明确残留，不再按整组状态反向Toggle。",
      "回退分支未为并发改动建立完整CAS/持久撤销；普通代理配置Undo不能替代本次IPv6失败回退或以后明确的恢复动作。",
      "WhatIf返回preview；其余返回binding_verified、changed与目标enabled，取消项和零变化须结合实际状态解释，外网与代理路线始终not_tested。"
    ],
    "flow": [
      "先只读查看IPv6绑定和默认路由，明确需要回答的应用出口问题。",
      "选择Mode和可选InterfaceAlias，枚举合格活动物理接口并保存逐项前像。",
      "每个实际变更经过ShouldProcess、管理员、接口身份和绑定原值复核。",
      "写入并立即回读；途中失败恢复本次已尝试字段，回读失败保留恢复缺口。",
      "报告实际changed数量与逐项结果；目标enabled、默认路由和应用出口不互相代证。"
    ],
    "concepts": [
      {
        "term": "IPv6 Default Route（IPv6 默认路由）",
        "explanation": "目的前缀为 ::/0 的路由；它与 IPv4 的 0.0.0.0/0 独立，可能形成另一条出站路径。"
      },
      {
        "term": "HardwareInterface（硬件接口标记）",
        "explanation": "Windows 网卡属性，用来把真实硬件上网网卡和 Tailscale、WSL、natpierce 等虚拟接口分开。"
      }
    ],
    "boundaries": [
      "不在网页、普通代理清理或只读状态中自动切换IPv6。",
      "仅合格活动物理候选参与，虚拟网卡排除；显式别名不绕过硬件与活动条件。",
      "本轮失败恢复按逐项原值，不等于持久Undo或完整并发保护；断电、驱动失败和外来修改仍可能留下需要现场处理的状态。",
      "改变IPv6绑定不证明代理泄漏消失、DNS正确或公网稳定。"
    ],
    "failures": [
      {
        "condition": "确需变更但不是管理员",
        "response": "修改前失败，不靠cmdlet权限报错后继续；无变更或预览不等于已完成修改。"
      },
      {
        "condition": "没有合格活动物理网卡，或选择后身份/原值变化",
        "response": "停止，不换成虚拟接口；重新读取准确目标后再判断。"
      },
      {
        "condition": "中途写入或回读失败",
        "response": "按本轮已尝试项恢复原绑定并核对；有恢复残留则报告，不能用再次整组切换替代。"
      },
      {
        "condition": "期间出现其他修改或进程/电脑中断",
        "response": "当前回退不保证完整保留并发新值或跨进程恢复；先查实际接口及原记录，只做明确的后续恢复。"
      },
      {
        "condition": "切换后应用仍走意外出口",
        "response": "单独检查应用、代理、DNS与路由；不能从一次配置切换推出业务结果。"
      }
    ],
    "sources": [
      {
        "path": "IPv6-Status.ps1",
        "role": "只读 IPv6 绑定与默认路由状态"
      },
      {
        "path": "IPv6-Toggle.ps1",
        "role": "物理上网网卡 IPv6 整组开关与逐项结果"
      },
      {
        "path": "旧版入口/IPv6状态.bat / 旧版入口/IPv6切换.bat",
        "role": "保留兼容的旧双击入口；日常图形维护窗口也提供 IPv6 查看与明确切换"
      }
    ],
    "verification": [
      "2026-09-18 网站只读检查过 Mode/InterfaceAlias、前像、管理员、身份/原值复核与恢复代码；2026-09-22 更新的是图形入口语义，仍未执行真实 IPv6 变化。",
      "历史证据：源项目已经把该能力发布到 PUBLIC master 2737328 并远端读回；双测试脚本在 Windows PowerShell 5.1 与 PowerShell 7 通过。",
      "历史证据：网站未执行真实 IPv6 切换，也没有用当前应用出口证明切换后的用户结果。",
      "历史证据：源857b110移除由IPv6关闭推导代理路径或公网稳定的结论，缺失绑定显示UNKNOWN；仅源码/隔离验证，没有切换真实网卡。"
    ],
    "searchAliases": [
      "IPv6状态",
      "IPv6切换",
      "IPv6-Status.ps1",
      "IPv6-Toggle.ps1",
      "Tailscale和WSL不要关",
      "IPv6绕过代理"
    ],
    "searchProjection": {
      "intents": [
        "怎样查看IPv6会不会绕过只接管IPv4的代理",
        "只切换物理网卡IPv6但保留Tailscale和WSL",
        "查看系统有没有IPv6默认路由"
      ],
      "entities": [
        "IPv6-Status.ps1",
        "IPv6-Toggle.ps1",
        "HardwareInterface=true",
        "::/0",
        "natpierce / Tailscale / WSL"
      ],
      "relations": [
        "IPv6状态入口先只读判断再由显式管理员入口切换真实硬件网卡",
        "IPv6切换保留natpierce、Tailscale、WSL和其他虚拟网卡"
      ],
      "failureRecovery": [
        "没有管理员权限或真实硬件候选时不执行IPv6切换",
        "切换后仍需按具体应用验证出口并可再次显式恢复"
      ]
    },
    readerStatus: "已发布实现支持查看，以及显式切换、开启或关闭指定物理接口；变更保存本轮各网卡原值，失败尝试恢复。本页未切换真实网卡，也未验证应用最终出口。",
    productFlow: [{"title":"先只读看当前路径","detail":"检查选定物理网卡的 IPv6 开关与路线；配置存在不等于浏览器一定从这条路上网。"},{"title":"明确选网卡和目标状态","detail":"本人选只查、开启、关闭或整组切换；Tailscale 等虚拟网卡不随之改变。整组切换不记得原先每块网卡的不同状态。"},{"title":"动手前再核对","detail":"工具保存原设置，执行前确认仍是同一块网卡；身份或原设置变了就停。"},{"title":"读回并处理失败","detail":"逐项读回结果；中途失败尝试按本轮原设置恢复，无法恢复的地方单列。"},{"title":"再看实际应用出口","detail":"在需要的浏览器或终端里验证结果；再次点击切换或用代理撤销，不能保证回到原先状态。"}]
  },
  {
    "slug": "one-click-and-troubleshooting-boundaries",
    "usageEntry": "日常从“00-打开 ProxyClean.vbs”进入；高级诊断点“查看详情”，网络专项动作点“维护工具”。",
    "usageInputs": ["具体断网或订阅症状","是否还需要代理","是否同意额外网页或公网出口测试"],
    "productFlow": [{"title":"先区分故障","detail":"首页给出本机代理与简短结论；订阅、热点、浏览器和应用连通性是不同问题。"},{"title":"选相应窗口","detail":"普通修复先预览；高级窗口才处理 DNS、网卡、IPv6 和可选出口比较。"},{"title":"确认结果与撤销边界","detail":"技术诊断仅主动复制脱敏版本；Undo 只撤回仍与本轮结果一致的配置，不能复活已关闭进程。"}],
    "shortTitle": "日常入口与故障边界",
    "title": "一个日常图形入口、独立维护与网络观测边界",
    "subtitle": "双击后先查本机，再选择检查修复或关闭代理；历史排障仍区分订阅、代理数据路径、浏览器和应用",
    "teaser": "保留历史更正和 Unknown，不把一次旧故障、UI（界面）测速或远程幸存者样本套到当前现场",
    "order": 6,
    "status": "双操作图形首页已发布，旧快捷方式归入旧版入口；历史测量不冒充当前网络状态",
    "statusTone": "accent",
    "relation": "负责唯一日常启动、两种用户意图与详情/维护分层，同时保留两类长期故障诊断方法。",
    "value": "日常双击唯一入口就能先看状态，再选择检查修复或关闭代理。订阅更新失败、浏览器打不开和命令行断网会分别定位；历史网络样本只解释当时发生过什么。",
    "why": "不同程序可能用不同代理路径。若把订阅获取失败当成全部网页流量失败，或让依赖当前网络的远程 AI 只看自己幸存的连接，就容易修错地方。",
    "example": "“我不知道为何上不了网。”先双击唯一入口；若发现失效设置，界面给出中文预览，确认后保存原值、修复并分别报告配置与微软网页结果。若未发现可修复设置，仍给出下一步。若是订阅更新失败而现有节点可用，则另按历史方法分开检验订阅和网页流量。",
    "result": "先得到本机检查与下一步入口；执行后分别看到客户端是否退出、设置是否改变、基础网页是否可访问，以及没有覆盖的应用。历史端口与热点经验保留原日期，不当作今天的检测结果。",
    "problem": "避免把订阅控制面故障、节点数据面、DNS/TUN、浏览器 WebRTC（网页实时通信）/时区信号和 Codex/Claude App（应用）连通性揉成一个“代理坏了”。",
    "readerStates": {"pass":"唯一双击入口能打开首页；只读检查后，选择的修复或关闭动作都有预览、确认和回读。","problem":"远程 AI 可能看不到真正断线的那一刻；此时以本人现场描述和本机独立检查为准。","unavailable":"需要账号、订阅凭据或客户端私有配置时，网页不能代读；在本人本地客户端处理。"},
    "decisionImpact": [
      "打开窗口不要求预先提权；只有所选受保护动作需要时才请求 UAC，并保留选择、重查现场、再次确认。旧快捷方式保留在旧版入口。",
      "日常预防姿态是只保留一个主要代理路径：客户端 TUN/虚拟网卡负责出站，终端和项目不固定 HTTP_PROXY/HTTPS_PROXY/ALL_PROXY 或第三方 API 端点；System Proxy 默认关闭。",
      "DNS 覆写默认关闭；只有另行证明 Codex/Claude App 连通性不受影响时才逐项试验，不为浏览器泄露分数牺牲 App 路径。",
      "控制面负责取得订阅/节点列表，数据面负责实际代理流量；一个失败不能自动证明另一个失败。",
      "历史 :5413 RST 来源在本地残留、光猫或机场策略之间保持 Unknown；:443 链接与手机热点是当时验证过的绕行/恢复，不是所有故障通用答案。",
      "浏览器 DNS/WebRTC（网页实时通信）/时区信号只说明浏览器环境，不等于 Codex App、Claude Code 或终端拥有同样路径。",
      "fallback 只剩 DIRECT-only（仅直连）参考、历史手工启动和历史状态入口；没有安装、自启或现役上游。"
    ],
    "implementation": [
      "根目录唯一 VBS 检查完整文件包并启动 ControlCenter.ps1；首页只做本机只读检查，异常启动有中文提示。旧批处理及重复 VBS 移到旧版入口并修正相对路径。",
      "主清理发现 WinINET 活端口与活动 fake-ip TUN 同时存在时只输出多路径告警，不替用户选择或关闭客户端。",
      "2026-06-28 故障文档保存同一订阅在不同出口的 HTTP（网页传输协议）状态/字节证据、:5413 与 :443 分层、手机热点恢复和观测盲区。",
      "Claude Code / Codex App 文档把 TUN/App 连通性和浏览器 DNS/WebRTC（网页实时通信）/时区测试分开，明确不要用终端代理变量修浏览器信号。",
      "fallback/config.yaml 为 DIRECT-only（仅直连）参考，start-hidden.vbs 与代理状态.bat 仅作历史材料，没有任务或启动项调用。",
      "ControlCenter.ps1 和共享 Workflow/Clients 模块提供双意图首页、后台检查、修复/关闭确认、设置回读与基础网页核验；Details.xaml 与 Maintenance.xaml 分别承接折叠日志和技术操作，无常驻修复服务。",
    ],
    "flow": [
      "双击 00-打开 ProxyClean.vbs，先看本机代理结论；若 WinINET 与 TUN 同时活跃，界面只说明多路径。需要时选检查修复或关闭代理，后者按客户端动态归组，技术操作进入独立维护窗口。",
      "把失败拆为控制面、数据面、DNS/路由、浏览器环境和具体 App 路径。",
      "使用对应证据验证一层，不用 UI 测速、单个 200 或 AI 在线状态证明全链。",
      "保留后续更正和 Unknown，交回当前可用恢复点及下一次应由用户现场验证的步骤。"
    ],
    "concepts": [
      {
        "term": "Control Plane（控制面）",
        "explanation": "负责登录、取订阅和更新节点列表的路径；它可以失败而已有代理节点的数据流仍可用。"
      },
      {
        "term": "Data Plane（数据面）",
        "explanation": "实际承载浏览器、终端或 App 流量的代理路径；需要用真实请求判断，不能只看客户端测速颜色。"
      },
      {
        "term": "Observation Blind Spot（观测盲区）",
        "explanation": "远程 AI 依赖代理在线才能对话，因此采到的状态天然偏向“已经能连”的幸存样本。"
      },
      {
        "term": "WebRTC（网页实时通信）",
        "explanation": "浏览器可暴露候选网络地址的一类网页能力；它的结果不能直接外推到本地 App 或终端。"
      }
    ],
    "boundaries": [
      "历史案例是方法和已脱敏证据，不是当前账号、节点、家庭网络或端口状态。",
      "日常不把代理端口写进终端环境、项目配置或 shell profile（终端启动配置），也不把第三方 API 地址冒充官方端点。",
      "网页不公开订阅 token、账号密码、完整公网 IP、客户端私密配置或节点明细。",
      "首页关闭客户端先尝试正常退出，未完成才另行确认强制关闭；旧按端口快捷方式是维护兼容入口，不能替代当前客户端归组判断。网站刷新和启动只读检查都不执行关闭。",
      "浏览器侧治理只应作用于浏览器，不为追求泄露测试结果破坏已验证的 App/TUN 连通性。"
    ],
    "failures": [
      {
        "condition": "客户端 UI 显示所有节点 Timeout",
        "response": "先用小请求/真实数据面测试，不把批量测速误报直接当成节点全坏。"
      },
      {
        "condition": "WinINET 活端口与活动 fake-ip TUN 同时存在",
        "response": "主清理只告警多路径，不自动停任何客户端；用户先明确哪条是主路径，再用客户端界面或显式关停入口处理。"
      },
      {
        "condition": "订阅更新失败但已有节点仍能上网",
        "response": "分开测试订阅控制面与数据面；保留 :5413 RST 来源 Unknown，并使用已验证的 :443 或热点恢复思路。"
      },
      {
        "condition": "AI 在线时看见所有探测都正常",
        "response": "标注幸存者偏差，不能用在线样本证伪用户真正断线时的观察。"
      },
      {
        "condition": "DNS/WebRTC 检测与 Codex/Claude App 结果不一致",
        "response": "分别处理浏览器和 App 路径，不用一个表面的泄露分数牺牲工作连接。"
      }
    ],
    "sources": [
      {
        "path": "00-打开 ProxyClean.vbs / ControlCenter.ps1 / ControlCenter.xaml",
        "role": "唯一日常双击入口及双意图图形首页"
      },
      {
        "path": "ProxyClean.Workflow.ps1 / ProxyClean.Clients.ps1 / Details.xaml / Maintenance.xaml",
        "role": "共享修复与客户端关闭流程，以及独立详情、维护窗口"
      },
      {
        "path": "旧版入口/",
        "role": "旧批处理和重复 VBS 的兼容位置；不是当前日常入口"
      },
      {
        "path": "docs/2026-06-28-wifi-subscription-403-troubleshooting.md",
        "role": "订阅控制面、数据面、:5413/:443、热点恢复与观测盲区证据"
      },
      {
        "path": "docs/claude-code-tun-browser-leaks.md",
        "role": "TUN/App 连通性与浏览器 DNS/WebRTC/时区边界"
      },
      {
        "path": "fallback/config.yaml / fallback/start-hidden.vbs / fallback/代理状态.bat",
        "role": "DIRECT-only 与无自启的退役参考"
      }
    ],
    "verification": [
      "2026-09-24 源 CHANGELOG 记录新增 12 项注册表隔离回归、整仓 193 项双 PowerShell 通过；9 月 22 日 WPF 只读烟测、六条导航与隔离客户端关停仍是原日期证据。本站未复跑真实网络效果。",
      "公开文档保留同一历史排查中前后推翻的结论、HTTP 状态/字节证据与明确 Unknown；网页按最终更正而不是早期猜测解释。",
      "本轮没有复现 2026-06-28 的订阅、热点、光猫、浏览器泄露或真实 App 故障，不能把历史数据升级成当前 E2E。"
    ],
    "searchAliases": [
      "一键修复网络",
      "订阅更新失败",
      "控制面和数据面",
      "5413和443",
      "手机热点恢复节点",
      "浏览器WebRTC泄露",
      "fallback DIRECT-only"
    ],
    "searchProjection": {
      "intents": [
        "代理订阅更新失败但现有节点还能上网怎么区分",
        "为什么客户端测速全红不等于代理数据面全坏",
        "家庭WiFi更新节点失败为什么热点可以恢复",
        "浏览器WebRTC泄露是否等于Codex App也泄露",
        "图形界面何时需要管理员权限"
      ],
      "entities": [
        "00-打开 ProxyClean.vbs",
        "旧版入口/",
        "ControlCenter.ps1",
        "Control Plane / Data Plane",
        ":5413 / :443",
        "WebRTC",
        "fallback/config.yaml"
      ],
      "relations": [
        "订阅控制面失败可以与已有节点数据面可用同时发生",
        "远程AI在线状态存在幸存者观测盲区",
        "浏览器环境信号不能外推到Codex App或终端",
        "唯一日常图形入口只读启动，受保护操作保留选择并在新窗口重查后确认"
      ],
      "failureRecovery": [
        "订阅控制面失败时保留当前节点并使用已验证的443导入或热点恢复思路",
        "强制动作前先确认目标端口和UAC边界",
        "历史结论被新证据推翻时保留更正与Unknown"
      ]
    },
    readerStatus: "日常入口已统一为根目录的“00-打开 ProxyClean.vbs”，详情与维护在独立窗口，旧快捷方式保留兼容。五张图展示本人提供的实际界面，没有绑定源码提交或证明本轮网络已恢复。"
  }
];

export const project = proxycleanProject;
export const modules = proxycleanModules;
