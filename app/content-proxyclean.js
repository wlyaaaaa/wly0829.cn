import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  "observedAt": "2026-09-08T00:13:09.891Z",
  "label": "物理网卡保护已修复并发布；本轮双 PowerShell 回归通过，现有代理保持开启",
  "boundary": "本轮只读检查保持系统代理开启：1个WinINET发布本地端口、1条fake-ip TUN默认路由、2条IPv4默认路由；独立TCP连接确认18091可连接，独立进程调用的ProxyStatus看到4个监听候选与单一ClashVerge家族。未执行网络清理、关代理、网卡/IPv6切换或公网出口探测。 本轮另完成物理路由判定与IPv6输出的源代码修复和隔离测试；修复前后网络状态指纹一致，实机网络没有被重置。",
  "metrics": [
    {
      "label": "源项目",
      "value": "857b110 · master 已远端读回"
    },
    {
      "label": "当前代理路径",
      "value": "1 个系统端口 · 1 条 TUN 路由"
    },
    {
      "label": "Docker 当前模式",
      "value": "桌面/容器均跟随系统"
    },
    {
      "label": "源测试",
      "value": "2 个脚本 · PS 5.1/7"
    }
  ],
  "facts": [
    {
      "label": "它真正解决的事",
      "value": "许多代理客户端在异常退出或切换时会留下四类问题：默认路由指向已经失效的 TUN 网关、WinINET 系统代理指向没有监听的本地端口、HTTP_PROXY 等用户环境变量或 Git 代理仍指着死端口，以及整份本机 DNS（域名解析系统）缓存里还留着 fake-ip 结果。ProxyClean 检查这些特定状态，并在满足前置条件时清配置、执行完整 DNS flush（缓存刷新）；它不是选择性只删 fake-ip，也不是一键重置整个 Windows 网络栈。",
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
      "label": "默认模式保留活与远程代理；Direct 是强制清空",
      "value": "默认模式会区分本地回环（127.0.0.1、localhost、::1）与远程代理：只清没有监听的本地端点，活端口、远程端点和无法安全解析的混合配置保持原样。显式 -Direct 不走这条保留逻辑：它关闭 WinINET ProxyEnable，清空所列用户代理环境变量，并对 Git http.proxy/https.proxy 执行 --unset-all，活或远程值也会被移除；NO_PROXY 仍不动。",
      "hero": true
    },
    {
      "label": "动态端点发现与零固定端口表",
      "value": "ProxyStatus.ps1 不维护硬编码的客户端端口表，而是通过 Get-NetTCPConnection 动态嗅探正在监听的代理核心（mihomo、clash、sing-box、xray 等）与 WinINET 发布端点。同时专项审计 Docker Desktop（Docker 桌面版）的 settings-store.json 与 httpproxy.log，排查是否因本地端口钉死导致容器与后台守护进程联网超时。",
      "hero": true
    },
    {
      "label": "按端口停止进程与联动清残留",
      "value": "Stop-ProxyPort.ps1 接受一个明确端口，只采纳回环地址或通配地址上的 TCP（传输控制协议）监听 PID（进程标识符），逐个调用 Stop-Process -Force，并按端口映射和额外参数再尝试关闭客户端 GUI（图形界面）进程。随后它清理指向该端口的 WinINET、用户环境变量与 Git 代理并调用主清理脚本。每一步都是尽力执行，失败后可能仍有监听，最终输出会明确写 STILL listening，而不是把它包装成原子事务或进程树必然清空。",
      "hero": true
    },
    {
      "label": "WiFi 分级恢复与桌面报告",
      "value": "WifiRebind.ps1 提供 Diagnose（只诊断）、SoftReset（刷新 DNS 并释放/重新获取 DHCP 租约）和 AdapterReset（管理员权限下先 Disable-NetAdapter，再在 finally 中尝试 Enable-NetAdapter）三种模式。每次运行在桌面生成时间戳日志；禁用失败返回 4，重新启用失败返回 5 并给出手工 Enable-NetAdapter 命令。",
      "hero": true
    },
    {
      "label": "通知系统，不冒充旧进程环境已更新",
      "value": "主脚本通过 PInvoke（平台调用）调用 SendMessageTimeout 广播 WM_SETTINGCHANGE，并用 InternetSetOption 通知 WinINET 配置变化。这能避免通知过程长期挂住，但删除 HKCU 用户环境变量不会改写已经运行进程自己的环境副本；Git、终端、Node 或 Electron 应用仍可能需要重新打开。",
      "hero": true
    },
    {
      "label": "IPv6 状态与物理网卡整组切换已经归入本项目",
      "value": "2737328 新增只读 IPv6-Status.ps1 和需要管理员权限的 IPv6-Toggle.ps1。状态入口展示活动网卡的 IPv6 绑定与 ::/0 默认路由；切换入口只选择 HardwareInterface=true 的物理上网网卡并排除虚拟网卡。候选中任一网卡 IPv6 开启时，本次目标是整组关闭；全部关闭时才整组开启。它不保存每块网卡的混合前像，中途失败可能留下部分状态，网页本轮没有实际切换。 本轮修复后，IPv6 状态/切换输出只报告绑定与路由；读不到绑定显示 UNKNOWN，不从关闭 IPv6 推断“流量都走代理”或“Google/VPN稳定”。",
      "hero": true
    },
    {
      "label": "本轮真实源修复与验证",
      "value": "源 master 857b1104cb30897da8f755ef2dbb25fbe1eeea69 已正常推送并远端回读。原实现的 virtual-up 用例先失败；修复后9个物理/虚拟/未知路由用例和3个实际清理分支用例通过。ProxyClean.test.ps1与Test-WifiRebind.ps1均在PowerShell7及WindowsPowerShell5.1通过。网络状态指纹前后一致，ProxyEnable仍为1；没有执行真实网络清理、代理停止或IPv6切换。"
    }
  ],
  "gaps": [
    "清理默认路由、切换 IPv6 和禁用/重新启用 WiFi 网卡依赖 Windows 管理员权限；普通权限下不能把这些动作冒充完成。",
    "连通性探测依赖目标探测端点（如 Google generate_204 或微软 connecttest.txt）；若上游宽带或物理网线脱机，脚本会给出连通性失败告警，不能把直连清理成功冒充公网已可达。",
    "ProxyStatus 只判断 Docker Desktop 是否存在手工本地代理钉死或配置等待应用，不验证那个端口已经死亡，也不会改配置、Apply（应用）或重启 Docker。",
    "ProxyClean 的系统代理清理判断使用 ProxyEnable 与 ProxyServer，不移除 AutoConfigURL（自动配置脚本地址）；存在 PAC（自动代理配置）时不能只凭 ProxyEnable=0 宣称整机已纯直连。",
    "用户级环境变量清理只影响以后启动的进程；已运行的终端、Git 工具、Node 或 Electron 应用可能需要重开。",
    "本轮只读状态检查跳过了出口 IP 和公网连通性探测；当前 1 个系统代理端口、1 条 TUN 路由和多路径提示只说明配置形态，不证明代理出口健康、直连成功或没有泄漏。"
  ]
});

export const proxycleanSnapshot = Object.freeze({
  ...baseSnapshot,
  sourceCommit: "857b1104cb30897da8f755ef2dbb25fbe1eeea69",
  sourceRoot: "E:\\Projects\\Tools\\ProxyClean",
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const proxycleanProject = {
  ...proxycleanSnapshot,
  ...{
  "cardMetrics": [
    {
      "label": "死端口清理",
      "value": "直连恢复 · 绝不焊死"
    },
    {
      "label": "孤儿路由前置条件",
      "value": "无备用默认路由不删"
    },
    {
      "label": "端点发现机制",
      "value": "动态审计 · 零固定表"
    },
    {
      "label": "网络恢复维度",
      "value": "DNS · 路由 · 网卡 · IPv6"
    }
  ],
  "order": 19,
  "slug": "proxyclean",
  "title": "ProxyClean",
  "kicker": "代理退出后，找回正常上网状态",
  "route": "/projects/proxyclean",
  "visibility": "公开仓库",
  "statusTone": "accent",
  "cardStatus": "诊断和修复入口可用；本轮保持代理开启，只检查状态",
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
    "第19项目",
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
      "强杀占用某个代理端口的进程并清空残留设置",
      "WiFi连着但无法上网时怎样刷新DNS和DHCP",
      "怎样查看或切换物理网卡IPv6而不动Tailscale和WSL"
    ],
    "entities": [
      "ProxyClean.ps1",
      "ProxyStatus.ps1",
      "Stop-ProxyPort.ps1",
      "WifiRebind.ps1",
      "WinINET ProxyServer / ProxyEnable",
      "198.18.0.0/15 fake-ip 默认路由",
      "SendMessageTimeout / WM_SETTINGCHANGE",
      "InternetSetOption",
      "Docker Desktop settings-store.json",
      "ipconfig /flushdns",
      "Get-NetTCPConnection",
      "IPv6-Status.ps1 / IPv6-Toggle.ps1"
    ],
    "relations": [
      "ProxyClean在存在HardwareInterface=true且Up且非零非fake-ip物理默认路由时处理候选孤儿路由并清理死端口",
      "ProxyStatus动态发现监听端口并审计Docker本地手动代理钉死",
      "Stop-ProxyPort按端口逐项停止监听PID和已知外壳并联动清理配置",
      "WifiRebind提供轻量刷新与网卡禁用再启用并在桌面生成排错报告",
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
  "summary": "关掉代理后，浏览器或终端还在找已经不存在的本地端口时，用它检查并清理残留设置。默认入口保留仍在工作的代理，只处理确认失效的本地配置和符合条件的残留路由。另有单独的定向关端口、WiFi诊断/恢复与IPv6查看/切换入口。它会说明做了什么、保留什么，并把“设置已清理”和“公网真的恢复”分开报告。",
  "why": "很多基于 TUN 的代理客户端（如 Clash Verge、Sing-box 等）在强退或断网时，会留下几套彼此独立的状态：路由表可能指着旧网关，注册表可能指着死端口，旧环境变量又只影响部分应用。反复拔网线解决不了这些配置残留。ProxyClean 把诊断、条件清理和最终回读放在同一组明确入口里，让用户知道修了什么、没修什么。",
  "plainExample": "我关掉代理后，浏览器打不开网页，终端也一直报连接旧端口失败。让工具检查后，它会清掉确认失效的本地代理设置；仍在工作的代理保持原样。必要的路由条件不满足时就跳过删除，最后再报告连通性。旧终端可能仍需要重新打开。",
  "result": "得到一份带结论的处理结果：默认模式下哪些死配置已清、哪些活/远程设置被保留；Direct 模式下哪些代理设置被强制移除；路由删除是否因前置条件而跳过；最终路由与连通性探测怎样。定向关端口、WiFi 恢复和 IPv6 切换各有单独入口，不会被默认清理悄悄触发。",
  "readerStates": {
    "pass": "我会看到哪些失效设置已清除、哪些活代理被保留、最终路由还剩什么，以及连通性探测是否成功；需要重新打开的旧终端也会得到明确提示。",
    "problem": "若当前找不到一条 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由，孤儿路由清理将跳过全部删除并打印黄色警告。",
    "unavailable": "普通权限不能完成 Remove-NetRoute、IPv6 切换或 WiFi AdapterReset；需要使用各自的管理员入口，不能把注册表/DNS 部分成功冒充整条动作完成。"
  },
  "dataSources": {
    "title": "系统从哪里采集网络事实，如何保障清理安全",
    "intro": "工具通过 Windows 原生 CIM/WMI（Windows 管理接口）、网络注册表与 Win32 API 采集网络状态。自动清理和状态发现不维护客户端固定端口表；显式关端口入口则保留三组批处理端口和对应外壳名称映射。动作前置条件按每个入口分别说明。",
    "rows": [
      {
        "source": "WinINET 注册表设置（Internet Settings）",
        "data": "清理决策读取 HKCU 下 ProxyEnable 与 ProxyServer，解析本地端口并检测 TCP（传输控制协议）监听；WiFi 诊断日志会另外展示 AutoConfigURL。",
        "result": "端口存活时保持不动交由客户端管理；仅当端口已死或加 -Direct 时关闭 ProxyEnable。主清理脚本不移除 AutoConfigURL。"
      },
      {
        "source": "Windows IPv4（第四版互联网协议）路由表（Get-NetRoute）",
        "data": "枚举 0.0.0.0/0 默认路由，匹对 fake-ip 范围与网卡 Status（状态）。",
        "result": "删除前要求至少一条 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由；否则阻断全部路由删除。HardwareInterface 是 Windows 报告的硬件接口标记；该条件仍不主动探测网关或公网是否可达。"
      },
      {
        "source": "用户环境变量（HKCU:\\Environment）",
        "data": "检查 HTTP_PROXY、HTTPS_PROXY、ALL_PROXY 及其小写变体。",
        "result": "默认模式只在整项可安全判为本地死端点时清空；-Direct 清空所有列出的值，包括活/远程配置。NO_PROXY 与非代理变量不碰。"
      },
      {
        "source": "全局 Git 代理配置（git config --global）",
        "data": "检查 http.proxy 与 https.proxy 配置端点。",
        "result": "默认模式只清可安全判为本地死端点的项，混合远程配置保留；-Direct 对两个键执行 --unset-all。"
      },
      {
        "source": "Docker Desktop 配置文件（settings-store.json）",
        "data": "审计 OverrideProxyHTTP 等本地端点覆盖项与 httpproxy.log 最近运行态代理模式。",
        "result": "发现手工本地端点或配置等待应用时输出提示；不判断该端口已死，也不修改或重启 Docker。"
      },
      {
        "source": "活动网卡 IPv6 绑定与 ::/0 默认路由",
        "data": "IPv6 状态入口只读展示；切换入口筛选 HardwareInterface=true 的物理上网网卡，并排除 natpierce、Tailscale、WSL 和其他虚拟网卡。",
        "result": "交回查看结果或显式切换结果；网页刷新不会执行切换。"
      }
    ],
    "note": "工具读取本机代理、监听、路由、网卡、Docker 与环境配置，不抓取浏览内容或网络流量。变更范围按入口分别限定：代理配置/候选默认路由、明确端口进程、选定 WiFi 网卡或筛选后的物理 IPv6 网卡。"
  },
  "responsibilities": [
    "负责鉴别并清理指向死本地端口的 WinINET 系统代理、用户环境变量与全局 Git 代理；默认保留活代理和不能安全判断的配置。",
    "负责带硬保护地清理残留的 fake-ip（198.18.x.x / 198.19.x.x）或已 Down 虚拟网卡的孤儿 TUN 默认路由。",
    "负责在清理孤儿路由前检查至少一条 HardwareInterface=true、Up、非零、非 fake-ip 的物理默认路由；没有候选时不删任何路由。",
    "负责动态发现本地活动的代理监听进程（mihomo、clash 等）与 TUN 路由，不依赖硬编码端口表。",
    "负责审计 Docker Desktop 的代理固定配置，识别容器拉取超时风险并提供操作指引。",
    "负责提供单端口监听 PID 与附加进程名的逐项强制停止，并在尝试停止后清理命中该端口的代理配置；随后调用通用 ProxyClean，因此还可能处理其他死本地代理项和符合前置条件的候选孤儿路由，最终明确报告目标端口是否仍在监听。",
    "负责提供 WiFi 软刷新与网卡禁用/重新启用，并在桌面生成网络诊断报告。",
    "负责只读查看 IPv6 绑定与默认路由，并在显式管理员入口中只切换真实硬件网卡的 IPv6，保留 natpierce、Tailscale、WSL 和其他虚拟网卡。"
  ],
  "exclusions": [
    "绝不主动把持久网络设置焊死到某个会消失的端口上，不设全局固定重定向代理。",
    "不删除符合 HardwareInterface=true、Up、非零、非 fake-ip 谓词的物理默认路由；如果一条这样的候选都没有，则不删任何默认路由。",
    "默认模式不清理远程代理或无法安全解析的混合配置；显式 -Direct 是例外，会清空列出的用户/Git代理并关闭 WinINET。",
    "不自动修改或重启正在运行的 Docker Desktop 容器与服务，仅执行只读配置审计。",
    "定向关端口只应在用户明确知道目标端口属于代理时使用；通配监听 0.0.0.0/:: 也会被采纳，不能仅凭地址门把目标身份说成已证明。",
    "IPv6 切换、WiFi AdapterReset 和路由删除都不会由网页刷新或只读状态检查触发。"
  ],
  "productPrinciples": [
    {
      "title": "绝不把持久设置焊到一个会消失的端口上",
      "detail": "这是 ProxyClean 最核心的设计哲学。旧版网络工具曾在代理崩溃后把系统代理对齐到另一个固定端口，一旦备用端口也停止，浏览器、终端和 Git 仍会继续撞向死端口。ProxyClean 规定：环境变量与代理配置在异常时【只能清成直连】，坚决不把持久设置焊到任何脆弱的代理端口上。"
    },
    {
      "title": "没有物理默认路由就不删",
      "detail": "删除默认路由前必须看到明确属于物理网卡、状态Up且网关非零/非fake-ip的默认路由。只有虚拟或信息不明的适配器时，本轮所有删除都跳过；代码不把“另一个虚拟路由还在”当成物理通路兜底。"
    },
    {
      "title": "自动发现不依赖静态端口表",
      "detail": "现代代理生态多样，不同客户端与内核使用的端口各异（7890、7897、18090 等）。ProxyClean 不维护脆弱的固定端口清单，而是以 Get-NetTCPConnection 动态查询实际监听，以系统注册表与日志作为动态事实来源，具备普适的适应力。"
    },
    {
      "title": "分级阶梯自愈，最小干扰优先",
      "detail": "网络恢复按干扰程度分开：主入口按条件清代理配置与 DNS；WiFi SoftReset 刷新 DNS/DHCP；AdapterReset 只有用户明确选择且具备管理员权限时才禁用再启用网卡。用户环境变量变化仍要求旧进程重开。"
    }
  ],
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
  "operatingFlow": [
    {
      "title": "目标与环境自动判定",
      "detail": "检测 WinINET 是否开启系统代理且端口是否存活，并检查处于 Up 状态的 fake-ip TUN 路由。默认模式存在任一活路径就保留；WinINET 活端口与 TUN 同时存在时只告警多路径，不替用户选择或关闭客户端。显式 -Direct 才要求清空列出的代理设置。"
    },
    {
      "title": "孤儿路由条件检查",
      "detail": "扫描所有 0.0.0.0/0 默认路由；若没有 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由，本轮不删任何路由。条件成立后才处理已消失/Down 网卡路由，以及直连目标下的残留 fake-ip 默认路由。"
    },
    {
      "title": "环境变量与系统代理清洗",
      "detail": "默认模式发现整项为本地死端点时才清空，并通过 User32 PInvoke 快速通知；-Direct 则清空列出的用户代理变量、关闭 WinINET 并 unset 两个 Git 代理键，活/远程值也不保留。"
    },
    {
      "title": "Git 代理与 DNS 缓存对齐",
      "detail": "检查 git config --global 的代理设置，死端口执行 unset 清理；执行 ipconfig /flushdns 清空本地污染缓存，并调用 wininet.dll 刷新网络设置。"
    },
    {
      "title": "按 targetPort 选择探测并输出拓扑",
      "detail": "只有选到 WinINET 发布的活本地 targetPort 时，才显式经 127.0.0.1 探测 Google 204；没有 targetPort 时请求微软连接测试端点并沿当前默认路由出站，因此 TUN-only 并不等于纯直连。最后输出当前默认路由。"
    }
  ],
  "usageExamples": [
    {
      "ask": "代理软件退出后，网页和命令行都连不上网，怎样一键恢复？",
      "effect": "运行 .\\ProxyClean.ps1：默认模式只清本地死端点并保留活/远程路径；明确要清空列出的代理设置时才加 -Direct。两者都按备用默认路由条件处理候选路由、刷新整份 DNS 缓存并报告探测结果。",
      "moduleSlug": "dead-port-and-route-cleanup"
    },
    {
      "ask": "想知道当前系统代理到底是开是关，有哪些代理端口在监听，Docker 是否被卡住？",
      "effect": "运行 .\\ProxyStatus.ps1，列出 WinINET 发布端点以及命中代理进程名的回环/通配监听候选、当前 WinINET 状态，并审计 Docker settings-store.json 的代理模式。",
      "moduleSlug": "dynamic-proxy-status"
    },
    {
      "ask": "某个代理客户端卡死在 7890 端口退不出来，怎样强行关掉它并清理设置？",
      "effect": "运行 .\\Stop-ProxyPort.ps1 -Port 7890，脚本从回环或通配监听反查 PID（进程标识符），逐项尝试停止监听进程与已知 GUI（图形界面）外壳，再清理命中该端口的代理设置；随后通用 ProxyClean 还可能处理其他死本地代理项和符合前置条件的候选孤儿路由，最后明确报告目标端口已关闭、原本已关闭或仍在监听。",
      "moduleSlug": "targeted-port-shutdown"
    },
    {
      "ask": "WiFi 显示已连接但无法访问任何网站，怀疑网卡或 DHCP（动态主机配置协议）租约故障？",
      "effect": "先运行 .\\WifiRebind.ps1 -Mode SoftReset 刷新 DNS 并重签租约，这个批处理不请求 UAC（用户账户控制）；仍需网卡禁用/启用时，再使用管理员 AdapterReset 入口。两种模式都在桌面生成报告。",
      "moduleSlug": "wifi-rebind-and-recovery"
    },
    {
      "ask": "我想确认 IPv6 会不会绕过只接管 IPv4（第四版互联网协议）的代理；需要时只切物理网卡，不要动 Tailscale、WSL（Windows 的 Linux 子系统）或 natpierce。",
      "effect": "先运行 .\\IPv6-Status.ps1 只读查看活动绑定和 ::/0 默认路由；确认需要改变后，再以管理员身份运行 .\\IPv6-Toggle.ps1。脚本只选择 HardwareInterface=true 的物理上网网卡并排除已知虚拟网卡。",
      "moduleSlug": "ipv6-routing-control"
    },
    {
      "ask": "订阅更新失败但已有节点还能上网，我该先修代理、换热点，还是检查浏览器？",
      "effect": "先用状态入口取得本机代理、监听和路由事实；订阅控制面的 :5413/:443 仍要按长期文档执行独立请求，不能由 ProxyStatus 代测。热点恢复、远程观测盲区和浏览器 DNS/WebRTC 与 Codex/Claude App 连通性继续分开。",
      "moduleSlug": "one-click-and-troubleshooting-boundaries"
    }
  ],
  "components": [
    {
      "name": "ProxyClean.ps1（主自愈总线）",
      "responsibility": "网络状态清理与条件直连对齐核心脚本，执行死端口判断、候选孤儿默认路由处理与 User32 广播通知。",
      "implementation": "包含 PInvoke NativeMethods（User32 + WinINet）、Get-ProxyEndpoints 解析器，以及 HardwareInterface=true/Up/非零/非 fake-ip 物理默认路由前置条件。"
    },
    {
      "name": "ProxyStatus.ps1（动态状态发现器）",
      "responsibility": "动态嗅探系统代理端点、活动代理进程与 TUN 默认路由，审计 Docker 本地代理钉死风险。",
      "implementation": "读取 WinINET 注册表、Get-NetTCPConnection 与 Docker settings-store.json，支持 -Json 结构化输出。"
    },
    {
      "name": "Stop-ProxyPort.ps1（单端口强杀器）",
      "responsibility": "按端口反查监听 PID，逐项强制停止目标进程和按名称匹配的附加 GUI，再清理命中该端口的残留配置、调用通用主清理并回读目标端口。",
      "implementation": "通过 Get-NetTCPConnection 只采纳回环或通配监听，Stop-Process 逐项尽力停止，联动处理 WinINET、环境变量、Git 与 DNS；最终调用 ProxyClean -Quiet，所以作用域可能扩到其他死项和候选孤儿路由。"
    },
    {
      "name": "WifiRebind.ps1（WiFi 分级修复与排错器）",
      "responsibility": "WiFi 只读诊断、DNS/DHCP 软刷新和网卡禁用后重新启用，并在用户桌面生成多段落网络诊断日志。",
      "implementation": "实现 Get-TargetWifiConfig、Add-NetworkSnapshot、ipconfig /renew，以及 Disable-NetAdapter 后在 finally 中尝试 Enable-NetAdapter 的恢复流程。"
    },
    {
      "name": "IPv6-Status.ps1 / IPv6-Toggle.ps1（IPv6 查看与切换）",
      "responsibility": "查看活动网卡的 IPv6 绑定和 ::/0 默认路由；在显式管理员入口中只切换真实硬件上网网卡。",
      "implementation": "2737328 从 Scripts 吸收该能力，选择 HardwareInterface=true 的网卡并排除 natpierce、Tailscale、WSL 与其他虚拟网卡；两个批处理文件提供双击入口。"
    },
    {
      "name": "ProxyClean.test.ps1 & Test-WifiRebind.ps1（自动化测试集）",
      "responsibility": "对解析、本地/远程端点、监听地址、隔离 Git 配置、只读状态和 WiFi 静态合同进行回归检查。",
      "implementation": "PowerShell 原生测试脚本，覆盖端点函数、监听地址门、隔离 Git 配置、只读状态 JSON 和 WiFi 静态合同；不执行真实异常网络拓扑修复。"
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
      "boundary": "死端口立即删除该注册表项并向 HWND_BROADCAST 广播；永不主动设置新的代理 URL。"
    },
    {
      "artifact": "Docker 桌面代理配置文件",
      "schema": "%APPDATA%\\Docker\\settings-store.json",
      "owner": "ProxyStatus.ps1 (Read-only Audit)",
      "boundary": "只读匹配 OverrideProxyHTTP 等项中的 127.0.0.1 端口，只报不改，严禁盲目静默修改用户 Docker 配置。"
    },
    {
      "artifact": "桌面 WiFi 诊断日志文件",
      "schema": "Desktop\\WiFi网络-<模式>-<yyyyMMdd-HHmmss>.txt",
      "owner": "WifiRebind.ps1",
      "boundary": "记录网络连接概况、网卡状态、IP 配置、DNS 解析与路由表，不输出密码或凭据，完全透明落盘。"
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
      "layer": "自动化单元测试（ProxyClean.test.ps1）",
      "proves": "本轮新增9个实际函数判定用例及3个实际清理条件分支用例，先确认旧实现会在virtual-up场景失败，再确认修复后通过。两个源测试脚本在WindowsPowerShell5.1与PowerShell7通过；不触真实网络。",
      "doesNotProve": "不证明在真实物理网线被拔掉、路由器死机等极端硬件断线情况下系统能连通公网。"
    },
    {
      "layer": "WiFi 重绑测试（Test-WifiRebind.ps1）",
      "proves": "证明 WiFi 脚本可解析，并以静态合同检查三种模式、禁用后必试图重新启用、失败退出码、日志路径和批处理接线。",
      "doesNotProve": "不证明无线路由器信号弱或欠费导致的宽带中断能通过本地网卡重启自愈。"
    },
    {
      "layer": "2026-09-07 只读运行状态",
      "proves": "独立 ProxyStatus 进程看到系统代理开启、1个发布本地端口、4个监听候选、1条fake-ip TUN默认路由和2条IPv4默认路由；ClashVerge单一客户端家族，系统代理与TUN同时存在。Docker没有本地手工钉死或待应用提示。",
      "doesNotProve": "没有运行任何清理、关端口、WiFi、IPv6 切换或外网探测，不证明当前代理出口健康、直连成功、WiFi 恢复或 IPv6 没有绕行。"
    }
  ],
  "operationalEntrypoints": [
    {
      "name": "网络自愈与对齐（默认模式）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\ProxyClean.ps1",
      "purpose": "自动探测活动代理；无活路径时按条件清理死端口与候选孤儿默认路由。可加 -Quiet 精简输出；运行边界为 Windows PowerShell 5.1+。"
    },
    {
      "name": "强制直连清理模式",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\ProxyClean.ps1 -Direct",
      "purpose": "要求转向直连：关闭系统代理、清空代理环境变量，并在备用默认路由条件成立时清理符合规则的残留 TUN 默认路由；不会结束代理进程或切换客户端 TUN 开关。"
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
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\Stop-ProxyPort.ps1 -Port 7890",
      "purpose": "尽力停止 7890 监听进程与映射的 GUI 外壳，联动清理系统代理并回读端口；-Label 只改显示名，-ExtraProcessName 增加显式附加进程。"
    },
    {
      "name": "WiFi 软刷新（轻量自愈）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\WifiRebind.ps1 -Mode SoftReset",
      "purpose": "清空 DNS 缓存并重新获取 DHCP 租约，在桌面生成诊断报告；-WaitSeconds 调整等待，-SkipConnectivityChecks 跳过 DNS/HTTP 检查。"
    },
    {
      "name": "WiFi 网卡禁用再启用（需管理员）",
      "command": "powershell -NoProfile -ExecutionPolicy Bypass -File E:\\Projects\\Tools\\ProxyClean\\WifiRebind.ps1 -Mode AdapterReset",
      "purpose": "先禁用再重新启用选定 WiFi 网卡；禁用或启用失败会返回明确退出码和手工恢复提示。"
    }
  ],
  "snapshotUpdateNote": "本页绑定2026-09-07完成的源修复857b1104cb30897da8f755ef2dbb25fbe1eeea69及master远端回读。物理默认路由条件、IPv6事实输出与隔离回归已更新；此前IPv6入口来源的2737328作为历史保留。实际网络保持原状，未把测试当网络恢复E2E。",
  "evolution": [
    {
      "date": "2026-06-30",
      "commit": "972bcc4",
      "result": "确立安全版原则：移除将环境变量强制对齐到备用端口的旧逻辑，明确环境变量只清成直连、绝不焊死端口。"
    },
    {
      "date": "2026-07-04",
      "commit": "0ad93df",
      "result": "清理重复过时的代理脚本，彻底废弃 fallback 固化代理写入路径，全面拥抱按需直连恢复。"
    },
    {
      "date": "2026-08-05",
      "commit": "a888416",
      "result": "ProxyStatus 转向动态端点发现，消除静态端口硬编码表；增加 Docker Desktop settings-store 悬挂代理审计。"
    },
    {
      "date": "2026-08-17",
      "commit": "096437a",
      "result": "强化孤儿路由前置条件：没有 Up、NextHop 非零且非 fake-ip 的备用默认路由时不删任何路由；完善本地死端口鉴别与远程代理保留。"
    },
    {
      "date": "2026-08-30",
      "commit": "2b46807",
      "result": "Stop-ProxyPort 只采纳回环或通配监听，拒绝只绑定特定局域网地址的监听；通配监听仍覆盖所有接口，因此必须由用户明确确认目标端口。"
    },
    {
      "date": "2026-09-04",
      "commit": "2737328",
      "result": "从 Scripts 吸收 IPv6 状态与切换入口；切换目标收紧为 HardwareInterface=true 的真实硬件上网网卡，并保留 natpierce、Tailscale、WSL 与其他虚拟网卡。"
    }
  ]
}
};

export const proxycleanModules = [
  {
    "slug": "dead-port-and-route-cleanup",
    "shortTitle": "死端口与路由",
    "title": "死端口清理、孤儿默认路由条件门与直连对齐",
    "subtitle": "默认保留活代理，只清死本地端口；备用默认路由条件不成立时不删路由",
    "teaser": "区分本地死端口、活代理与远程配置；PInvoke（平台调用）负责通知，清理后分别回读路由和连通性",
    "order": 1,
    "status": "物理默认路由保护已修复；隔离回归通过，真实网络未改动",
    "statusTone": "accent",
    "relation": "ProxyClean 的默认修复入口，负责判断当前应保留活路径还是对齐直连，再处理死代理、候选默认路由与 DNS。",
    "value": "代理异常退出后，不必先重启电脑：脚本会把死本地端口和不能继续工作的配置指出来，只在实际条件满足时执行相应清理。",
    "why": "系统代理、环境变量、Git 与路由表各自保存状态。只修其中一处可能仍然断网；盲目删默认路由又可能雪上加霜。因此主入口先判断活监听与 TUN，再对每类配置分别决定保留、清理或拒绝动作。",
    "example": "比如我关掉代理后看到 ERR_PROXY_CONNECTION_FAILED：运行 ProxyClean.ps1 后，它确认本地端口已无监听，关闭对应 ProxyEnable、清理指向它的用户环境变量和 Git 代理，并在备用默认路由条件成立时处理残留 fake-ip 默认路由。旧终端需要重开；外网探测失败时结果仍是告警，不冒充恢复。",
    "result": "交回逐项结果和最终路由表：死配置是否已清、哪些活或远程设置被保留、路由删除是否因前置条件而跳过，以及选定连通路径的探测是否成功。",
    "problem": "防止代理崩溃后因残留系统代理和孤儿 fake-ip 路由导致全机断网，防止网络修复工具误删物理路由引发二次灾难。",
    "readerStates": {
      "pass": "确认失效的本地代理设置已清除，仍在工作的代理保持原样；输出逐项处理结果、最终路由和连通性探测，旧终端需要时重新打开。",
      "problem": "若找不到 HardwareInterface=true、Up、NextHop 非零且非 fake-ip 的物理默认路由，脚本保持所有路由不动并输出告警。",
      "unavailable": "若在普通权限终端运行且需要删除系统路由表条目，Remove-NetRoute 将抛出权限异常，需以管理员权限重试。"
    },
    "decisionImpact": [
      "铁律 1：工具不会写入新的代理端点。默认模式只清本地死端点；显式 -Direct 会清空全部列出的用户/Git代理并关闭 WinINET，包括活或远程值。",
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
      "Test-HealthyPhysRoute在删除前与删除后共同检查HardwareInterface=true；信息未知不充当物理路由证据。"
    ],
    "flow": [
      "读取 WinINET 注册表与 Get-NetAdapter，检测系统代理发布端口与处于 Up 状态的 fake-ip TUN 路由。",
      "依据现场判定目标：默认模式若有 WinINET 活端口或活动 TUN 就保留活路径，仅清死项；两者同时存在只告警。传 -Direct 则清空列出的代理设置，但仍不结束客户端进程或切 TUN。",
      "执行默认路由条件扫描：备用候选少于 1 条就跳过全部删除；否则处理已消失/Down 网卡路由与直连目标下的 fake-ip 默认路由。",
      "逐项审计用户环境变量与 Git 代理，判定为本地死端口则清空为直连，调用 User32 广播变更。",
      "审计 WinINET 系统代理：若开着却指向死端口，则将 ProxyEnable 置 0 关停恢复直连。",
      "调用 ipconfig /flushdns 清除 DNS 缓存，触发 InternetSetOption 通知系统刷新网络设置。",
      "延时 2 秒后发起连通性测试探针（Google 204 或微软 connecttest），输出最终路由表。"
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
      "默认模式保留远程代理和无法安全解析的混合设置；-Direct 是显式例外，会整项清空对应用户/Git配置并关闭 WinINET。",
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
        "response": "脚本打印警告并保持配置不动；若用户改用 -Direct，整个 http.proxy/https.proxy 键会被 unset。"
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
      "测试不会执行 Remove-NetRoute、清理真实代理、刷新真实环境或验证公网恢复；路由条件仅由源码与静态合同证明存在。",
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
    }
  },
  {
    "slug": "dynamic-proxy-status",
    "shortTitle": "动态状态",
    "title": "动态端点发现、Docker 本地端口审计与多出口对比",
    "subtitle": "枚举系统代理、实际监听、fake-ip 路由与 Docker 手工代理状态，可选比较出口 IP",
    "teaser": "只读看清当前代理路径和 Docker 配置，不把监听、路由或本地端点自动判成健康/死亡",
    "order": 2,
    "status": "动态发现与 Docker 审计就绪；无硬编码端口表，支持 JSON 结构化输出",
    "statusTone": "accent",
    "relation": "默认清理前的只读观察入口，也可单独用于解释为什么不同应用走了不同出口。",
    "value": "不用背端口表：直接看到 WinINET 发布了哪些本地端口、哪些代理相关进程正在监听、有哪些 fake-ip 默认路由、环境变量怎样，以及 Docker 当前跟随系统还是手工指定本地端点。",
    "why": "代理端口会变，浏览器、终端、TUN 和 Docker 又可能各走一条路径。先把这些当前事实分开列出，才能判断是多路径、手工钉死、旧环境变量，还是别的问题；仅看到一个端点字符串不能证明端口已死。",
    "example": "比如我发现 Docker pull（镜像拉取）超时：运行 ProxyStatus.ps1 后，先看 Docker 是 System、manual 还是 disabled，再看是否存在本地覆盖项和近期运行日志。若显示手工本地钉死，我再到 Docker 设置里切回 System 并 Apply；这个脚本不会替我改配置，也不会凭字符串断言端口已死。",
    "result": "输出当前 WinINET 状态、实际监听 PID（进程标识符）候选、fake-ip IPv4（第四版互联网协议）默认路由条目、环境变量、Docker 配置/近期日志状态和可选出口 IP 对比。",
    "problem": "避免把固定端口表、一个监听记录、一个 fake-ip 路由或一条 Docker 配置各自误当成完整网络结论。",
    "readerStates": {
      "pass": "成功枚举当前 TCP（传输控制协议）监听、WinINET 配置、系统默认路由、环境变量与 Docker Desktop settings-store.json/近期日志；字段保持分层。",
      "problem": "发现 Docker Desktop 使用 manual（手工）模式并写有本地端点，或配置已改回 System 但近期日志仍显示旧 manual 状态时，输出钉死/待 Apply 提示。",
      "unavailable": "若系统未安装 Docker Desktop，相关审计节点优雅返回 exists=false，不影响其余网络状态报告。"
    },
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
      "匹配常见代理核心进程名正则（clash|mihomo|sing-box|xray|v2ray|flyingbird|tag 等）。"
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
      "本轮额外只读状态检查看到 Docker 桌面/容器均为 System、无手工本地钉死且近期 runtime mode 为 system；没有执行出口探测。"
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
    }
  },
  {
    "slug": "targeted-port-shutdown",
    "shortTitle": "定向关端口",
    "title": "单端口监听进程停止、客户端外壳退出与残留联动清理",
    "subtitle": "先按明确端口停止监听 PID（进程标识符）和已知外壳，再调用通用 ProxyClean 清理其他死项与候选孤儿路由",
    "teaser": "显式强制入口：接受回环或通配监听，尽力停止后回读端口是否仍在监听",
    "order": 3,
    "status": "源码与监听地址筛选测试通过；本轮没有终止真实进程，通配监听不能证明目标身份",
    "statusTone": "accent",
    "relation": "显式强制入口；默认 ProxyClean 不杀进程，只有用户明确选择端口时才进入。停止目标后会继续调用通用主清理，因此副作用范围不只一个端口。",
    "value": "当我已经确认某个端口属于卡死的代理客户端时，用端口找到监听 PID（进程标识符），逐项尝试停止核心和已知外壳，再清指向该端口的设置。即使端口没有监听，映射/额外进程名仍会被尝试停止；最后的 ProxyClean -Quiet 还可能处理其他本地死代理项和符合条件的候选默认路由。",
    "why": "只杀进程会留下死系统代理，只清配置又不会结束卡死监听。这个入口把步骤顺序串起来，但不是事务：任何一步都可能失败，最后必须以端口回读和逐项日志判断结果。",
    "example": "比如我已确认 7890 属于要关闭的代理：运行 Stop-ProxyPort.ps1 -Port 7890。脚本只采纳回环或通配监听，逐个 Stop-Process，再无条件按 7890 的名称映射尝试关闭 TAG 的 GUI（图形界面）外壳；随后若代理字符串包含目标本地端点就整项关闭/清空，刷新 DNS，并调用通用主清理。它可能继续清其他死代理项和候选孤儿默认路由，最多等 8 秒后回读目标端口。",
    "result": "目标端口结论明确为已关闭、原本已关闭或 STILL listening（仍在监听），并保留每个进程和配置步骤的成功/失败日志；主清理的其他死代理/候选路由结果也一并输出。不保证同名/子进程全部退出，也不保留一个被命中混合字符串里的远程部分。",
    "problem": "防止代理客户端挂死后难以精确定位进程，防止杀掉进程后留下指向死端口的系统代理导致立即断网。",
    "readerStates": {
      "pass": "只有真实执行后端口回读为空，才能说目标监听已关闭；当前页面只证明地址筛选与代理字符串匹配的隔离测试通过。",
      "problem": "指定端口没有监听时仍会执行内置映射或 -ExtraProcessName 的同名进程停止，再继续配置与通用主清理；no listener（没有监听）不等于无副作用。",
      "unavailable": "若目标进程属于具有高权限保护的系统服务且当前运行在普通权限下，Stop-Process 将报错拒绝。"
    },
    "decisionImpact": [
      "地址门接受 127.0.0.1、::1、0.0.0.0 与 ::；只绑定特定局域网地址的监听不处理，但通配监听覆盖所有接口，仍需用户先确认端口身份。",
      "附加进程联动：按常见端口映射 Clash Verge、FlyingBird、TAG 等进程名，也允许 -ExtraProcessName；它按名称逐项停止，不遍历父子进程树。",
      "代理字符串只要包含目标 localhost/127.0.0.1/[::1]:port，WinINET 会整体关闭，对应用户环境变量和 Git 键会整项清空；混合字符串里的远程部分不单独保留。",
      "支持 -ExtraProcessName 允许用户额外指定要停止的同名进程；即使目标端口没有 listener，这一步仍执行。",
      "端口专用清理结束后无条件调用 ProxyClean -Quiet，可能继续清其他死本地代理项与符合前置条件的候选孤儿默认路由。"
    ],
    "implementation": [
      "Test-LocalListenAddress 确保仅在回环地址或通配地址监听时才采纳 OwningProcess。",
      "Get-ListeningPids 通过 Get-NetTCPConnection 提取指定端口上、且地址满足回环或通配门的唯一监听 PID。",
      "Stop-Process -Id $pid -Force 终止目标进程，并在外壳进程列表中循环关闭伴生应用。",
      "依次处理 WinINET、用户环境变量、当前脚本进程环境、Git 代理和 DNS，再调用 ProxyClean -Quiet；过程无事务或回滚。"
    ],
    "flow": [
      "输入目标端口号，调用 Get-ListeningPids 查询正在监听该端口的本地进程 PID。",
      "若找到监听 PID，逐个调用 Stop-Process -Force 并打印成功或失败；随后最多等待 8 秒观察端口是否消失。",
      "无论有没有 listener，都根据预设端口映射表或 ExtraProcessName 检查并尝试终止同名 GUI 外壳进程。",
      "检查 WinINET、用户/当前脚本进程环境与 Git 代理；整串只要命中目标本地端口就关闭或清空对应项。",
      "刷新整份 DNS 缓存并调用通用 ProxyClean -Quiet；它按主入口规则处理其他死项与候选默认路由，随后再回读目标监听 PID。"
    ],
    "concepts": [
      {
        "term": "Sequenced Port Cleanup（顺序端口清理）",
        "explanation": "先尝试停止监听和已知外壳，再清除指向该端口的配置，最后回读端口；步骤相关但没有原子提交或失败回滚。"
      },
      {
        "term": "Listen Address Gate（监听地址门）",
        "explanation": "只采纳回环或通配监听，拒绝只绑定特定局域网地址的服务；通配地址不是回环，不能替代用户对目标端口身份的确认。"
      }
    ],
    "boundaries": [
      "若监听进程的 PID 等于当前脚本自身 PID，自动跳过防止自杀。",
      "只绑定在局域网特定地址上的服务不处理；0.0.0.0/:: 通配监听仍会处理，因为它也是源码的现行地址门。",
      "默认快捷入口只有 18090、18091 与 7892；任意其他端口需要用户在 PowerShell 中显式给出 -Port。",
      "该入口不是严格单端口作用域：最后的通用主清理可能改变其他死本地代理配置和候选默认路由。"
    ],
    "failures": [
      {
        "condition": "未能停止一个监听 PID 或附加进程",
        "response": "打印黄色警告后继续后续配置清理，最终若端口仍存在就输出 STILL listening；没有自动回滚。"
      },
      {
        "condition": "查询后进程自行退出或端口原本没有监听",
        "response": "保留 no listener（没有监听）/ already closed（原本已关闭）语义，但仍尝试停止映射/额外同名进程，清目标配置并运行通用主清理。"
      },
      {
        "condition": "用户给出的通配监听端口属于非代理服务",
        "response": "源码无法从地址门证明身份；因此产品入口要求用户先确认端口所属进程，网页不会建议盲目试端口。"
      }
    ],
    "sources": [
      {
        "path": "Stop-ProxyPort.ps1",
        "role": "端口起点、同名进程停止、整项配置清理、通用主清理与最终回读实现"
      }
    ],
    "verification": [
      "ProxyClean.test.ps1 验证回环、通配、特定局域网地址的采纳边界和多 PID 去重。",
      "测试不执行真实 Stop-Process、不验证 GUI 关闭、配置清理或最终端口结果；这些保持未做 E2E。"
    ],
    "searchAliases": [
      "Stop-ProxyPort.ps1",
      "强杀代理端口",
      "关闭卡死代理",
      "清理端口监听"
    ],
    "searchProjection": {
      "intents": [
        "怎样强杀占用7890端口的代理客户端并关掉系统代理",
        "代理软件无响应时怎样按已确认端口停止监听并清掉残留"
      ],
      "entities": [
        "Stop-ProxyPort.ps1",
        "Get-ListeningPids",
        "Test-LocalListenAddress"
      ],
      "relations": [
        "Stop-ProxyPort按端口逐项停止监听PID和附加进程并联动清理指向该端口的设置"
      ],
      "failureRecovery": [
        "使用管理员身份重新运行以终止受保护的高权限进程"
      ]
    }
  },
  {
    "slug": "wifi-rebind-and-recovery",
    "shortTitle": "WiFi 恢复",
    "title": "WiFi 诊断、软刷新、网卡禁用再启用与桌面报告",
    "subtitle": "从只读快照到 DNS/DHCP（动态主机配置协议）刷新，再到管理员权限下禁用并重新启用选定 WiFi 网卡",
    "teaser": "每次先留桌面日志；动作失败保留退出码，启用失败给出立即恢复命令",
    "order": 4,
    "status": "三种模式与失败恢复已实现；测试为语法/静态合同，本轮没有操作真实 WiFi 网卡",
    "statusTone": "accent",
    "relation": "代理残留清理之外的独立 WiFi 入口，用于区分配置故障和无线网卡/DHCP/DNS 问题。",
    "value": "代理清理后仍不通时，先只诊断，再选择 DNS/DHCP（动态主机配置协议）软刷新；最后才在管理员权限下禁用并重新启用 WiFi 网卡。每一步都把现场写进桌面日志。",
    "why": "有些网络故障不仅是代理层的问题，还可能伴随 WiFi 网卡驱动假死、DHCP（动态主机配置协议）租约失效或本地 DNS 解析器死锁。用户需要有一套递进的排错手段，先做不伤大雅的软刷新，不行再重启网卡，同时把网络状态白纸黑字写到桌面日志里。",
    "example": "比如我退出代理后 WiFi 仍显示无网络：先运行 WifiRebind.ps1 -Mode Diagnose 看处理前快照；再运行 -Mode SoftReset 刷新 DNS 并重签 DHCP（动态主机配置协议），这个批处理入口不请求 UAC（用户账户控制）。只有需要 AdapterReset 时才用自动提权的批处理禁用并重新启用网卡。",
    "result": "脚本把桌面日志作为主要交付，并用退出状态区分前置失败；动作成功时再从处理后快照、DNS/HTTP（网页传输协议）检查和 IPv4（第四版互联网协议）是否恢复判断结果，不能仅凭脚本结束就说网络已修好。",
    "problem": "防止物理网卡假死或 DHCP 租约过期时误判为代理故障，提供开箱即用的结构化排错依据。",
    "readerStates": {
      "pass": "桌面生成带时间的网络报告。诊断模式交回当前快照；恢复模式说明是否重新获取 IPv4、DNS/HTTP 检查怎样，以及网卡是否重新启用，便于我判断网络有没有回来。",
      "problem": "执行 AdapterReset 时若未检测到管理员权限，脚本安全终止并明确提示提权要求。",
      "unavailable": "若找不到同时满足 Up、有 IPv4 且名称/描述命中 WiFi 正则的网卡，返回 2；-InterfaceAlias 只在这批候选里继续筛选，不能绕过前置类型条件。"
    },
    "decisionImpact": [
      "明确分级机制：Diagnose（只生成处理前快照）-> SoftReset（DNS + DHCP）-> AdapterReset（禁用后在 finally（收尾块）中尝试重新启用网卡）。",
      "每次执行均在用户桌面生成以时间戳命名的完整排错日志，便于事后对照处理前后的状态差异。",
      "基础快照覆盖连接概况、网卡、IP、DNS、IPv4（第四版互联网协议）默认路由、系统代理与 WinHTTP（Windows 服务代理）；未加 -SkipConnectivityChecks 时再追加 DNS 与 B 站等连通性检查。",
      "针对无线特殊环境，提供通过特定 WiFi 网卡 IP 绑定解析阿里公共 DNS 的针对性旁路测试。"
    ],
    "implementation": [
      "Get-TargetWifiConfig 自动匹配名称或驱动描述包含 WLAN/Wi-Fi/Wireless/802.11 的活动网卡。",
      "SoftReset 模式执行 ipconfig /flushdns、ipconfig /release 与 ipconfig /renew。",
      "AdapterReset 先要求管理员权限，再调用 Disable-NetAdapter；禁用成功后，无论后续怎样都在 finally（收尾块）中尝试 Enable-NetAdapter。",
      "Add-NetworkSnapshot 统一采集连接概况、网卡表、路由表与 WinHTTP 配置。"
    ],
    "flow": [
      "解析运行模式（Diagnose / SoftReset / AdapterReset），创建桌面排错日志文件。",
      "查找当前处于 Up 状态且具备有效 IPv4 的 WiFi 网卡，提取别名与 IP 地址。",
      "生成【处理前】完整的系统网络快照，写入排错日志。",
      "根据模式执行动作：SoftReset 清空 DNS 并重签 DHCP；AdapterReset 检查管理员权限后禁用再启用无线网卡。",
      "Diagnose 到处理前快照即结束；另两种模式等待后重新寻找网卡并生成处理后快照，最后提示日志位置。"
    ],
    "concepts": [
      {
        "term": "Tiered Recovery（分级恢复）",
        "explanation": "由只读诊断到 DNS/DHCP 刷新，再到网卡禁用/重新启用；每个等级都是独立显式选择，不是脚本自动升级。"
      },
      {
        "term": "Desktop Diagnostic Artifact（桌面诊断报告）",
        "explanation": "将处理前后的详细系统状态直接以纯文本落盘到桌面，为用户提供透明无隐藏的排错证据。"
      }
    ],
    "boundaries": [
      "AdapterReset 会短暂断网；若无 Windows 管理员权限返回 3，不执行网卡禁用。",
      "候选网卡必须先满足 Up、有 IPv4 且名称/描述命中 WiFi/WLAN/Wireless/802.11/FastConnect；-InterfaceAlias 只是二次筛选。",
      "-SkipConnectivityChecks 可跳过 DNS/HTTP 检查，-WaitSeconds 控制动作后的等待；跳过或失败时不能宣称外网恢复。"
    ],
    "failures": [
      {
        "condition": "未以管理员身份运行 AdapterReset",
        "response": "返回 3，在控制台和日志中说明需要管理员权限。"
      },
      {
        "condition": "找不到符合前置条件的无线网卡",
        "response": "返回 2 并提示可在候选范围内用 -InterfaceAlias 指定网卡。"
      },
      {
        "condition": "Disable-NetAdapter 失败",
        "response": "返回 4，不继续冒充重启成功。"
      },
      {
        "condition": "禁用成功但 Enable-NetAdapter 失败",
        "response": "返回 5，并在日志中给出立即手工运行 Enable-NetAdapter -Name '<别名>' 的恢复命令。"
      },
      {
        "condition": "DHCP/DNS/HTTP 检查失败或动作后仍没有 IPv4",
        "response": "错误写入分段日志；脚本不会据此自动改代理、DNS 服务器或删除路由。"
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
      "Test-WifiRebind.ps1 在 Windows PowerShell 5.1 与 PowerShell 7 通过，检查语法、模式、关键命令、exit 5、桌面路径与批处理接线。",
      "测试没有执行 Diagnose、SoftReset、AdapterReset、DHCP 续租或真实网卡禁用/启用；这些保持未做 E2E。"
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
        "Get-TargetWifiConfig",
        "Add-NetworkSnapshot",
        "Disable-NetAdapter / Enable-NetAdapter"
      ],
      "relations": [
        "WifiRebind提供只读诊断、DNS和DHCP刷新、网卡禁用再启用并在桌面生成排错报告"
      ],
      "failureRecovery": [
        "AdapterReset需要管理员权限且启用失败时按日志中的Enable-NetAdapter命令立即恢复"
      ]
    }
  },
  {
    "slug": "ipv6-routing-control",
    "shortTitle": "IPv6 查看与切换",
    "title": "IPv6（第六版互联网协议）绑定、默认路由查看与物理网卡整组切换",
    "subtitle": "先只读判断 IPv6 是否可能绕过 IPv4（第四版互联网协议）代理，需要时只切换真实硬件上网网卡",
    "teaser": "保留 natpierce、Tailscale、WSL 和其他虚拟网卡；网页刷新绝不自动切换",
    "order": 5,
    "status": "源项目 2737328 已发布并通过双 PowerShell 版本测试；网页未执行真实 IPv6 切换",
    "statusTone": "accent",
    "relation": "从 Scripts 吸收进 ProxyClean 的网络路径能力，独立于默认代理残留清理和 WiFi 恢复。",
    "value": "当应用明明走了 IPv4（第四版互联网协议）代理却仍出现出口不一致时，先看活动网卡 IPv6 绑定和 ::/0 默认路由；确认需要改变后，再只对筛选出的物理上网网卡做整组开/关。这个入口不是逐网卡前像恢复器。",
    "why": "IPv6 与 IPv4（第四版互联网协议）有独立默认路由。只接管 IPv4 的代理可能无法解释 IPv6 路径，而一刀切禁用所有网卡又会破坏 Tailscale、WSL 或 natpierce。这个入口把只读判断和显式切换分开，并限定真实硬件接口。",
    "example": "比如我怀疑浏览器走了 IPv6、代理只接管 IPv4：先运行 IPv6-Status.ps1 查看活动绑定和 ::/0；若确实要试验，再以管理员身份运行 IPv6-Toggle.ps1。它只选择 HardwareInterface=true（Windows 标记为真实硬件接口）的物理上网网卡；只要候选中有一块开启就尝试全部关闭，全部关闭才尝试全部开启。",
    "result": "状态入口交回当前绑定和 IPv6 默认路由；切换入口逐网卡交回结果。没有真实执行回执时不声称 IPv6 已关闭、泄漏已消失或网络仍可用；执行中失败时以逐网卡回读为准，不能保证保留原混合状态。",
    "problem": "避免把 IPv6 绕行问题误当成代理端口故障，也避免为了排查而把私有组网和虚拟化网络一起关掉。",
    "readerStates": {
      "pass": "只读状态脚本正常列出活动绑定与 ::/0；显式切换仅在管理员权限和真实硬件网卡候选成立时执行。",
      "problem": "看到 IPv6 默认路由不等于已经证明泄漏；应结合具体应用出口与代理覆盖范围判断。",
      "unavailable": "没有符合 HardwareInterface=true 的活动物理上网网卡或缺少管理员权限时，不把切换冒充成功。"
    },
    "decisionImpact": [
      "IPv6-Status.ps1 是只读入口，可先判断是否值得改变状态。",
      "IPv6-Toggle.ps1 是显式管理员动作，不属于 ProxyClean 默认清理流程。",
      "目标限定 HardwareInterface=true 的真实硬件上网网卡，并排除 natpierce、Tailscale、WSL 与其他虚拟网卡。",
      "整组算法是 anyOn => 全部 OFF；全部 OFF => 全部 ON。它不保存每块网卡的原始混合状态，再运行一次也不保证精确还原前像。",
      "一次切换结果不证明特定浏览器、终端或代理节点的最终出口；需要另行做应用层验证。"
    ],
    "implementation": [
      "IPv6-Status.ps1 读取活动网卡 IPv6 绑定与 ::/0 默认路由，不改变配置。",
      "IPv6-Toggle.ps1 逐个处理筛选后的物理上网网卡：任一候选开启就以整组关闭为目标，否则以整组开启为目标；没有跨网卡事务或回滚。",
      "IPv6状态.bat 提供只读双击入口；IPv6切换.bat 负责管理员权限入口。",
      "状态文本只解释实际绑定和默认路由；切换脚本仍无独立管理员前置检查，权限失败由cmdlet报告，不能把结尾文本当成功。"
    ],
    "flow": [
      "先运行状态入口，区分接口绑定和系统 IPv6 默认路由。",
      "结合具体代理是否只接管 IPv4，决定是否需要一次受控试验。",
      "显式运行切换入口，筛选 HardwareInterface=true 的活动物理上网网卡并排除虚拟网卡，再决定整组 OFF 或 ON。",
      "逐网卡读取结果；中途失败可能留下部分状态。若要判断应用出口，再单独验证该应用，不用绑定存在性冒充 E2E。"
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
      "网页、测试和普通 ProxyClean 默认入口都不会自动切换 IPv6。",
      "虚拟网卡保持原状；切换范围不因名称相似扩大，但多个物理候选作为一组处理。",
      "没有保存逐网卡前像、事务或自动回滚；再次执行只是按当前整组状态反向，不是精确恢复原混合状态。",
      "IPv6 开启/关闭只是网络配置事实，不自动证明代理泄漏、DNS 问题或公网质量。"
    ],
    "failures": [
      {
        "condition": "以非管理员身份运行 IPv6 切换",
        "response": "脚本没有独立管理员前置检查，Enable/Disable-NetAdapterBinding 可能逐项报权限错误；必须检查每块目标网卡的实际绑定，不能由命令尝试或结尾文案推断已完成切换。"
      },
      {
        "condition": "没有符合条件的物理上网网卡",
        "response": "不把虚拟网卡当替代目标，不执行无关切换。"
      },
      {
        "condition": "逐网卡执行中途失败",
        "response": "可能留下部分开启、部分关闭；没有自动回滚。先用状态入口逐项回读，再由用户决定是否重新执行整组动作或手工修正。"
      },
      {
        "condition": "切换后应用仍走意外出口",
        "response": "回到应用、代理覆盖和 DNS/路由证据继续诊断；再次整组切换不保证恢复原混合状态。"
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
        "path": "IPv6状态.bat / IPv6切换.bat",
        "role": "普通只读与管理员切换双击入口"
      }
    ],
    "verification": [
      "源项目已经把该能力发布到 PUBLIC master 2737328 并远端读回；双测试脚本在 Windows PowerShell 5.1 与 PowerShell 7 通过。",
      "网站未执行真实 IPv6 切换，也没有用当前应用出口证明切换后的用户结果。",
      "源857b110移除由IPv6关闭推导代理路径或公网稳定的结论，缺失绑定显示UNKNOWN；仅源码/隔离验证，没有切换真实网卡。"
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
    }
  },
  {
    "slug": "one-click-and-troubleshooting-boundaries",
    "shortTitle": "一键入口与故障边界",
    "title": "一键入口、控制面/数据面分诊与网络观测边界",
    "subtitle": "先用正确入口收集事实，再区分订阅更新、代理数据路径、浏览器信号和 App（应用）连通性",
    "teaser": "保留历史更正和 Unknown，不把一次旧故障、UI（界面）测速或远程幸存者样本套到当前现场",
    "order": 6,
    "status": "一键批处理和两份故障手册保留；历史测量不冒充 2026-09-07 当前网络状态",
    "statusTone": "accent",
    "relation": "把 PowerShell 技术入口变成普通用户可双击的动作，并保存两类容易混淆的长期诊断方法。",
    "value": "用户不需要先记命令：修复、强制直连、状态、WiFi 和三个常见客户端关停都有明确批处理；平时由一个主要客户端的 TUN/虚拟网卡接管，不给终端和项目固定代理或第三方 API 端点。遇到更新订阅或网页登录问题时，再分清控制面、数据面与浏览器侧信号。",
    "why": "代理故障最容易因错误观测绕远路：客户端测速全红不等于节点数据面坏，订阅获取失败也不等于网页流量断；而 AI 只能在代理可用时在线，更容易只看到幸存状态。把入口、证据层和盲区写在一起，能避免用错误测试证明错误结论。",
    "example": "比如我发现客户端在家庭 WiFi 更新订阅失败，但现有节点还能上网：先用状态入口看当前路径，再把订阅控制面与网页数据面分开测试。历史案例最终定位到客户端访问非标准端口 :5413 的失败，而 :443 订阅链接仍可用；RST（连接重置）来自本地残留、光猫还是机场侧保持 Unknown，手机热点只是经过实测的恢复入口，不被写成普遍根因。",
    "result": "得到正确的一键入口、是否需要 UAC（用户账户控制）和一份分层诊断结论：哪条路径当前有证据、哪些历史方案已被推翻、哪些来源仍未知，以及失败时能回到哪个可用恢复点。",
    "problem": "避免把订阅控制面故障、节点数据面、DNS/TUN、浏览器 WebRTC（网页实时通信）/时区信号和 Codex/Claude App（应用）连通性揉成一个“代理坏了”。",
    "readerStates": {
      "pass": "一键修复、直连、状态和 WiFi 入口可以分别启动拥有的脚本；历史文档保留了被后续证据推翻的假设和最终更正。",
      "problem": "当远程 AI 依赖当前代理才能连接时，它结构性看不到真正断线现场；页面要求以用户现场和独立命令为准。",
      "unavailable": "需要真实订阅 token（订阅令牌）、账号或本地客户端密文配置时，网页不读取也不公开；只能在用户自己的本地客户端中验证。"
    },
    "decisionImpact": [
      "一键修复网络、恢复直连、三个客户端关停入口请求 UAC；状态和轻量 WiFi 刷新不把提权作为默认。",
      "日常预防姿态是只保留一个主要代理路径：客户端 TUN/虚拟网卡负责出站，终端和项目不固定 HTTP_PROXY/HTTPS_PROXY/ALL_PROXY 或第三方 API 端点；System Proxy 默认关闭。",
      "DNS 覆写默认关闭；只有另行证明 Codex/Claude App 连通性不受影响时才逐项试验，不为浏览器泄露分数牺牲 App 路径。",
      "控制面负责取得订阅/节点列表，数据面负责实际代理流量；一个失败不能自动证明另一个失败。",
      "历史 :5413 RST 来源在本地残留、光猫或机场策略之间保持 Unknown；:443 链接与手机热点是当时验证过的绕行/恢复，不是所有故障通用答案。",
      "浏览器 DNS/WebRTC（网页实时通信）/时区信号只说明浏览器环境，不等于 Codex App、Claude Code 或终端拥有同样路径。",
      "fallback 只剩 DIRECT-only（仅直连）参考、历史手工启动和历史状态入口；没有安装、自启或现役上游。"
    ],
    "implementation": [
      "根目录批处理分别调用 ProxyClean、ProxyStatus、WifiRebind 与 Stop-ProxyPort，并由需要变更系统状态的入口请求 UAC。",
      "主清理发现 WinINET 活端口与活动 fake-ip TUN 同时存在时只输出多路径告警，不替用户选择或关闭客户端。",
      "2026-06-28 故障文档保存同一订阅在不同出口的 HTTP（网页传输协议）状态/字节证据、:5413 与 :443 分层、手机热点恢复和观测盲区。",
      "Claude Code / Codex App 文档把 TUN/App 连通性和浏览器 DNS/WebRTC（网页实时通信）/时区测试分开，明确不要用终端代理变量修浏览器信号。",
      "fallback/config.yaml 为 DIRECT-only（仅直连）参考，start-hidden.vbs 与代理状态.bat 仅作历史材料，没有任务或启动项调用。"
    ],
    "flow": [
      "先选择最小入口：查看当前走哪个；若 WinINET 与 TUN 同时活跃，先由用户决定保留哪条主路径，工具只告警不代选。需要时再修复、直连、WiFi 或明确客户端关停。",
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
      "一键关端口是显式强制动作，必须先确认目标客户端；普通网站刷新和状态检查不执行。",
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
        "path": "一键修复网络.bat / 恢复直连.bat / 查看当前走哪个.bat",
        "role": "主修复、强制直连与只读状态的人类入口"
      },
      {
        "path": "一键刷新WiFi.bat / 一键重启WiFi网卡.bat",
        "role": "不提权软刷新与管理员网卡重启入口"
      },
      {
        "path": "关闭18090-TAG.bat / 关闭18091-ClashVerge.bat / 关闭7892-飞鸟.bat",
        "role": "三个明确客户端端口的管理员关停入口"
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
        "哪个一键脚本需要管理员权限"
      ],
      "entities": [
        "一键修复网络.bat",
        "恢复直连.bat",
        "查看当前走哪个.bat",
        "Control Plane / Data Plane",
        ":5413 / :443",
        "WebRTC",
        "fallback/config.yaml"
      ],
      "relations": [
        "订阅控制面失败可以与已有节点数据面可用同时发生",
        "远程AI在线状态存在幸存者观测盲区",
        "浏览器环境信号不能外推到Codex App或终端",
        "一键批处理按动作范围决定是否请求UAC"
      ],
      "failureRecovery": [
        "订阅控制面失败时保留当前节点并使用已验证的443导入或热点恢复思路",
        "强制动作前先确认目标端口和UAC边界",
        "历史结论被新证据推翻时保留更正与Unknown"
      ]
    }
  }
];

export const project = proxycleanProject;
export const modules = proxycleanModules;
