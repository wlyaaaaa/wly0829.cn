import { createProjectSnapshot } from "./project-snapshot.js";

const baseSnapshot = createProjectSnapshot({
  "observedAt": "2026-09-08T00:21:26.3156207Z",
  "label": "设备计数误报已修复；本机网络就绪，KDE 当前没有可用对端",
  "boundary": "本轮修复本地化摘要被误计为设备的问题，66项源测试通过。一次既有 --refresh 发现刷新后，KDE仍是Known=1、Available=0：知道1台设备，但没有同时已配对且可达的对端。doctor为20 PASS、2 WARN，另一项是Including passwords（包含密码）人工检查。因缺少可用KDE对端，本轮未执行真实复制或文件传输；没有新配对、修改网络或重启设备。",
  "metrics": [
    {
      "label": "使用场景",
      "value": "不同网络 · Windows 双机"
    },
    {
      "label": "通信范围",
      "value": "只放行选定对端 · 1714–1764"
    },
    {
      "label": "共享内容",
      "value": "在线文字 · 文件单独发送"
    },
    {
      "label": "异常恢复",
      "value": "托盘定期检查 · 看门狗任务守护"
    }
  ],
  "facts": [
    {
      "label": "源与本轮测试",
      "value": "PUBLIC（公开）main f39be3f2b9471fec5750bde6f51a21cc635cc6d7已正常推送并远端回读；66项Pester测试通过，新增14项真实子进程标准输出/标准错误/退出码回归。设备计数只接收KDE合法ID；标准错误中的中文“找到 0 个设备”等本地化摘要不计为设备，畸形标准输出或失败退出返回Unknown和null计数。原有配置、规则、任务与WhatIf（变更预览）回归保持通过。"
    },
    {
      "label": "当前网络",
      "value": "Tailscale 1.102.2-t6cac91817-g6ff0ddc72，Windows 服务自动且运行中，本机在线、Run Unattended（无人值守）开启、shields-up（入站屏蔽）关闭；本轮唯一批准 Windows 对端解析成功，tailscale ping 成功。网络可达不等于 KDE 已完成应用配对。"
    },
    {
      "label": "连接可能直连也可能中继",
      "value": "Tailscale 能直连时走直连，不能直连时可由 Tailscale 中继承载加密流量；本项目不自建中继，也不承诺不经过公共服务器。GitHub 仅分发项目源码，不接收剪贴板和文件数据。"
    },
    {
      "label": "精确入站与可逆配置",
      "value": "两条项目入站规则绑定批准对端 IPv4、Tailscale 接口、可信 kdeconnectd.exe、TCP/UDP 1714-1764。本轮 Exact-peer firewall 与 Unmanaged KDE firewall 均 PASS。发现已有宽泛规则时不自动接受或改写；显式 -DisableBroadKdeFirewallRules 可预览并禁用相应冲突规则，状态保留回滚记录。"
    },
    {
      "label": "KDE 配置与人工动作",
      "value": "customDevices 已含选定对端，托盘在运行，启动快捷方式匹配。配置编辑保留注释/无关段落和原编码，备份写前状态；只有已知旧版重复 General 形态可自动修复，其他歧义报错。配对确认和 Including passwords 设置由人核对，doctor 不自动读取后者的实际开关值。"
    },
    {
      "label": "看门狗与任务",
      "value": "一个当前会话看门狗进程及新鲜健康心跳，登录快捷方式和 Limited（普通权限）计划任务匹配。默认首次延迟 15 秒、之后每 60 秒检查指示器，启动后等 5 秒验证；任务每 2 分钟尝试恢复看门狗。调度和应用启动仍有延迟，不能保证 60/120 秒内必然恢复。"
    },
    {
      "label": "诊断的两项 WARN",
      "value": "KDE peer availability现在准确报告没有同时已配对且可达的设备；Clipboard password sharing仍提示人工检查密码开关。Known=1不等于已配对，Available=0是本轮跨机传输的实际缺口。Windows云剪贴板未检测到启用；doctor只报告，不修改插件、网络或防火墙。"
    },
    {
      "label": "能力与未做的验收",
      "value": "当前产品对象是 Windows 11 双机、在线单写者文字同步与文件传输。源验收目标包括通常小于 2 秒、100 次连续复制无回环和最大 1 GB 测试文件；它们不是协议容量上限或每次保证。本轮没有获得新的真实跨机数据结果。"
    }
  ],
  "gaps": [
    "本轮已调用一次既有设备发现刷新，KDE仍无可用对端，因而无法开展真实复制或文件双向传输/哈希核对；不新建配对来绕过这个条件。自然重启也未重验。",
    "配对身份与 Including passwords 关闭仍需两端人工确认。即使关闭，也不能保证任意被复制的普通文本里没有秘密。",
    "在线尽力而为同步没有强一致顺序、离线补发、并发复制合并或文件断点续传保证。图像应作为文件发送。",
    "Android 平板是后续 P1 目标，本轮只接受 Windows 双机。Windows 登录前不支持剪贴板或收文件；已经登录后的锁屏不等于退出会话，睡眠时不唤醒设备。",
    "看门狗只处理当前会话托盘缺失；不自动修复 Tailscale、防火墙、配对、插件或持续应用崩溃。"
  ]
});

export const meshclipKitSnapshot = Object.freeze({
  ...baseSnapshot,
  ...{
  "generation": "Windows双机跨网络文字与文件协作",
  "sourceCommit": "f39be3f2b9471fec5750bde6f51a21cc635cc6d7",
  "sourceRoot": "V:\\Personal\\Projects\\meshclip-kit",
  "runtimeFacts": {
    "tailscaleVersion": "1.102.2-t6cac91817-g6ff0ddc72",
    "tailscaleUnattended": true,
    "tailscaleShieldsUp": false,
    "kdeConnectIndicatorRunning": true,
    "watchdogSupervisorInterval": "PT2M",
    "watchdogPollIntervalSeconds": 60,
    "watchdogInitialDelaySeconds": 15,
    "watchdogStatusHeartbeat": "Fresh / Healthy",
    "firewallPortRange": "TCP/UDP 1714-1764",
    "pesterTestsPassed": 66,
    "pesterTestsFailed": 0,
    "doctorPass": 20,
    "doctorWarn": 2,
    "clipboardPasswordSetting": "manual_confirmation_required",
    "freshCrossDeviceTransfer": "not_executed",
    "kdeKnownDevices": 1,
    "kdeAvailableDevices": 0,
    "deviceDiscoveryRefreshes": 1,
    "crossDeviceBlocker": "no_paired_and_reachable_kde_device"
  }
},
  gaps: baseSnapshot.currentSnapshot.gaps
});

export const meshclipKitProject = {
  ...meshclipKitSnapshot,
  ...{
  "order": 21,
  "slug": "meshclip-kit",
  "title": "MeshClip Kit",
  "kicker": "让两台 Windows 电脑共享文字、互传文件",
  "route": "/projects/meshclip-kit",
  "visibility": "公开仓库",
  "statusTone": "accent",
  "cardStatus": "本机网络就绪；KDE 当前无可用对端，传输还不能验收",
  "cardStatusTone": "accent",
  "cardMetrics": [
    {
      "label": "使用场景",
      "value": "不同网络 · Windows 双机"
    },
    {
      "label": "通信范围",
      "value": "只放行选定对端 · 1714–1764"
    },
    {
      "label": "共享内容",
      "value": "在线文字 · 文件单独发送"
    },
    {
      "label": "异常恢复",
      "value": "托盘定期检查 · 看门狗任务守护"
    }
  ],
  "searchAliases": [
    "meshclip-kit",
    "MeshClip Kit",
    "跨网络剪贴板同步",
    "Windows剪贴板跨设备复制",
    "Tailscale局域网穿透",
    "KDE Connect防火墙收敛",
    "对端IP精准放行",
    "KDE看门狗守护",
    "watch-kdeconnect",
    "第21项目",
    "跨设备传文件",
    "剪贴板密码保护"
  ],
  "searchProjection": {
    "intents": [
      "跨网络同步两台Windows电脑剪贴板和传文件",
      "Tailscale组网下的KDE Connect防火墙端口收敛",
      "KDE Connect看门狗静默守护防止托盘进程退出",
      "Windows两台电脑不在同一WiFi怎样共享剪贴板",
      "怎样避免跨端剪贴板泄露密码和Token",
      "KDE Connect如何精确限制只允许指定Tailscale IP访问",
      "剪贴板同步断了之后怎样通过doctor诊断排查"
    ],
    "entities": [
      "Tailscale / Tailnet",
      "KDE Connect / kdeconnect-indicator / kdeconnectd",
      "install-windows.ps1",
      "configure-peer.ps1",
      "doctor.ps1",
      "watch-kdeconnect.ps1",
      "watch-kdeconnect-hidden.vbs",
      "Task Scheduler / \\MeshClip Kit\\KDE Connect Watchdog",
      "customDevices / kdeconnect config",
      "TCP/UDP 1714-1764 精确对端防火墙规则",
      "fail-closed（失败阻断）宽泛规则防御",
      "Including passwords 禁用规则"
    ],
    "relations": [
      "Tailscale提供跨网可达，能直连则直连、必要时中继",
      "configure-peer维护准确对端、customDevices与精确入站规则",
      "KDE Connect在两端已配对在线时同步纯文本和发送文件",
      "看门狗定期尝试恢复当前会话托盘，任务守护看门狗"
    ],
    "failureRecovery": [
      "存在非项目宽泛KDE入站规则时停止配置，提供显式可逆处理",
      "对端离线或选择歧义时报告，不猜测",
      "托盘缺失在下次检查时尝试启动，持续失败单独报告",
      "看门狗缺失由每2分钟既有任务尝试恢复",
      "卸载只移除项目拥有且未变更的资源"
    ]
  },
  "repositoryNote": "MeshClip Kit 是 PUBLIC（公开）脚本与文档仓库。运行配置、配对身份和回滚状态保存在本机，诊断默认对对端地址与身份脱敏；真实剪贴板和传输文件由 KDE Connect/Tailscale 处理，不进入 GitHub。",
  "summary": "台式机和笔记本不在同一个 WiFi，也可以用它复制文字、互传文件。MeshClip Kit 负责把 Tailscale（虚拟组网工具）和 KDE Connect（跨设备协作工具）配好：网络只向选定对端放行，应用意外退出后尝试自动启动，并提供可读的诊断结果。真正的文字同步和文件传输由 KDE Connect 完成；本轮检查了本机环境和对端可达，没有代替两台电脑上的实际传输验收。",
  "why": "两台电脑换网络后，局域网自动发现可能失效；KDE 托盘退出后，复制也会悄悄停住。项目把对端地址配置、专用入站规则、登录启动和故障诊断补在原有工具周围，不另造剪贴板服务或文件协议。",
  "plainExample": "我在台式机复制一段命令，想拿起笔记本直接粘贴。两端先加入同一 Tailnet（Tailscale 虚拟专用网络）并人工确认 KDE 配对；在线时由 KDE 同步文字。没有收到时先看对端、配对和进程状态；如果只是托盘程序退出，已有看门狗会在下次检查时尝试启动它。",
  "result": "获得两台 Windows 电脑之间的文字与文件通道，以及针对本机启动、对端设置和防火墙的诊断。传完重要文件后，由操作者在两端比较 SHA-256（安全哈希算法 256 位）；脚本不自动做每次文件传输的哈希验收，也不保证每次复制在两秒内完成。",
  "readerStates": {
    "pass": "实际使用成功时，两端已配对且在线，我能在另一台电脑粘贴刚复制的文字；文件则在对端收到，重要文件由我另行比较两端哈希。",
    "problem": "没有收到文字时分别检查对端是否在线、KDE 是否配对、插件是否启用；doctor 的人工提示不是自动通过。",
    "unavailable": "对端离线、任一端未登录或未配对时不能按正常流程传输；本项目不为离线设备缓存重放。"
  },
  "dataSources": {
    "title": "系统从哪里采集设备状态，如何确保网络与剪贴板安全",
    "intro": "只读取组网、进程、配置、任务和规则来解释通道状态；不读取真实剪贴板或传输文件。诊断检查 Windows 云剪贴板是否启用，而密码插件开关保留人工提示。",
    "rows": [
      {
        "source": "Tailscale 状态与首选项（tailscale status --json）",
        "data": "提取 BackendState、SelfOnline、ForceDaemon（无人值守）、shields-up（入站拦截）以及对端机器的 OS、在线状态与 Tailnet IPv4 地址。",
        "result": "严格断言对端处于在线且为 Windows 系统；在输出与日志中将真实 IP（如 100.x.y.z）完全脱敏，仅供网络解析使用。"
      },
      {
        "source": "Windows 防火墙",
        "data": "读取 KDE daemon 相关入站规则和协议、端口、对端地址、程序、接口过滤条件。",
        "result": "比较批准对端的精确规则；报告已有非项目宽泛或未知规则，不修改它们。"
      },
      {
        "source": "本机 KDE Connect config 与 MeshClipKit 状态",
        "data": "读取 General/customDevices、既有配置形态、项目资源身份与待完成事务。",
        "result": "配置时先备份并保留编码/注释；只修复已知旧版重复形态，其他歧义报错，失败回滚。"
      },
      {
        "source": "看门狗心跳与计划任务（watchdog-status.json / Get-ScheduledTask）",
        "data": "读取看门狗进程的 PID、会话 ID、运行状态（Starting/Healthy/Restarted）及计划任务 \\MeshClip Kit\\KDE Connect Watchdog 的触发间隔与权限级别。",
        "result": "断言看门狗以当前会话无窗口运行，仅以受限权限重启指示器，绝不提权，互斥锁杜绝重复多开。"
      }
    ]
  },
  "operatingFlow": [
    {
      "title": "两端准备",
      "detail": "安装脚本使用 WinGet 官方包 Tailscale.Tailscale 和 KDE.KDEConnect；登录通过官方浏览器完成，设置 Tailscale 无人值守及登录后 KDE 启动。"
    },
    {
      "title": "分别配置对端",
      "detail": "两端分别选择准确对端，检查已有规则，写入 customDevices 及精确入站规则。宽泛规则须显式预览/禁用，不能静默放行。"
    },
    {
      "title": "人工配对后使用",
      "detail": "核对两端身份并确认 KDE 配对，关闭 Including passwords；在线复制文字，文件单独发送并按需要两端验哈希。"
    },
    {
      "title": "退出时恢复，异常时诊断",
      "detail": "看门狗定期检查托盘；doctor 分开报告网络、配置、任务、心跳及人工待确认项。"
    },
    {
      "title": "不用时撤销自己的配置",
      "detail": "uninstall 默认预览；-Apply 删除未变更的项目资源，显式恢复选项用于先前禁用的宽泛规则，不卸载第三方软件。"
    }
  ],
  "productPrinciples": [
    {
      "title": "沿用现成组网和传输工具",
      "detail": "Tailscale 管跨网络可达，KDE 管配对、复制和文件发送，项目只补配置、启动与诊断。流量可能直连或通过 Tailscale 中继。"
    },
    {
      "title": "对端明确才配置",
      "detail": "自动选择仅接受唯一在线 Windows 对端；有多台就指定准确名称。配置冲突时暂停该次写入，保留原状态。"
    },
    {
      "title": "共享范围由人确认",
      "detail": "KDE 配对必须两端人工确认；Including passwords 也由人关闭。诊断会提醒但不会谎称已替人确认。"
    },
    {
      "title": "恢复日常退出，保留具体故障",
      "detail": "静默看门狗尝试拉起缺失托盘，计划任务守护看门狗。持续启动失败显示 StartFailed，不靠无限增设启动器掩盖应用故障。"
    },
    {
      "title": "配置和撤销都保留现场",
      "detail": "配置先备份、异常回滚；卸载默认预览，只移除本项目拥有且未被改动的资源。Tailscale/KDE 安装和无关配置保留。"
    }
  ],
  "components": [
    {
      "name": "MeshClip.Common.psm1",
      "responsibility": "核心函数库",
      "implementation": "实现对端解析、地址脱敏、防火墙契约审计、KDE 配置原子读写与备份、看门狗状态与互斥锁管理。"
    },
    {
      "name": "install-windows.ps1",
      "responsibility": "Windows 一键部署器",
      "implementation": "检查依赖、配置 Tailscale 无人值守、设置 KDE 启动快捷方式、部署双层静默看门狗与计划任务。"
    },
    {
      "name": "configure-peer.ps1",
      "responsibility": "精确对端配置与加固",
      "implementation": "审计并阻断宽泛防火墙规则、支持显式禁用加固、将对端写入 customDevices 并创建精确入站规则。"
    },
    {
      "name": "watch-kdeconnect.ps1",
      "responsibility": "会话级静默看门狗",
      "implementation": "单实例互斥锁运行，每 60 秒轮询当前会话 kdeconnect-indicator 进程，退出时自动拉起并更新状态。"
    },
    {
      "name": "watch-kdeconnect-hidden.vbs",
      "responsibility": "无窗口启动包装器",
      "implementation": "通过 WScript.Shell 以后台无控制台窗口样式唤起 PowerShell 7 看门狗脚本。"
    },
    {
      "name": "doctor.ps1",
      "responsibility": "项目只读诊断",
      "implementation": "本次 20 PASS/2 WARN，数量会随可用分支变化；区分网络、配对提示、插件人工提示、配置、计划任务、单进程与心跳。"
    },
    {
      "name": "uninstall.ps1",
      "responsibility": "受控清理与回滚器",
      "implementation": "安全移除项目创建的防火墙规则、快捷方式、计划任务与状态文件，支持可逆恢复原先禁用的宽泛规则。"
    }
  ],
  "technicalContracts": [
    {
      "artifact": "KDE 设备诊断计数",
      "schema": "Get-MeshClipKdeDeviceSummary: Known / Available / Status",
      "owner": "scripts/MeshClip.Common.psm1",
      "boundary": "只从 --id-only 的标准输出接受符合 KDE DeviceInfo 合同的32–38位字母、数字、下划线或连字符ID；标准错误摘要不计数。异常标准输出或失败退出返回Status=Unknown、计数null。Status=Available仅指诊断读取成功，真正可用设备数由Available字段表示，Known不等于已配对。"
    },
    {
      "artifact": "Windows 防火墙规则契约",
      "schema": "MeshClip Kit Firewall Contract",
      "owner": "configure-peer.ps1",
      "boundary": "绑定批准对端 IPv4、TCP/UDP、本地端口1714-1764、可信 kdeconnectd.exe 和 Tailscale 接口；同时检查是否存在额外非项目放行规则。"
    },
    {
      "artifact": "KDE customDevices 配置规范",
      "schema": "KDE Connect INI Format",
      "owner": "MeshClip.Common.psm1",
      "boundary": "保留现有文本编码、注释和无关段落；变更前备份，只允许唯一明确的 customDevices 形态或可识别的旧版修复。"
    },
    {
      "artifact": "看门狗计划任务契约",
      "schema": "Task Scheduler Limited Principal",
      "owner": "install-windows.ps1",
      "boundary": "\\MeshClip Kit\\KDE Connect Watchdog；当前用户 Interactive（交互式登录）+Limited，每2分钟重复、IgnoreNew、带重试策略，不唤醒睡眠电脑。"
    },
    {
      "artifact": "剪贴板数据传输边界",
      "schema": "KDE Connect Best-Effort Protocol",
      "owner": "KDE Connect Daemon",
      "boundary": "当前目标为 Windows 在线单写者纯文本；不承诺离线重放或并发顺序。文件通过 KDE 发送，操作者在两端计算 SHA-256 验收。"
    }
  ],
  "evidenceLayers": [
    {
      "layer": "66 项本地源测试",
      "proves": "配置、旧版重复修复、防火墙、任务和看门狗契约通过；新增14项真实进程回归，排除本地化摘要/标准错误误计数，并区分异常输出与真正零设备。",
      "doesNotProve": "没有真实跨机复制或文件传输，也没有自然重启结果。"
    },
    {
      "layer": "本次 doctor 20 PASS / 2 WARN",
      "proves": "本机 Tailscale、KDE、登录启动、看门狗、精确入站与待完成事务检查结果。",
      "doesNotProve": "KDE当前无可用设备，密码开关仍需人工确认；诊断成功不等于实际复制或文件送达。"
    },
    {
      "layer": "本次 tailscale ping",
      "proves": "批准 Windows 对端当前可达。",
      "doesNotProve": "不证明 KDE 应用配对、剪贴板延迟或文件完整性。"
    }
  ],
  "responsibilities": [
    "配置 Windows 双机跨网可达、准确对端与 KDE customDevices。",
    "配置 KDE daemon 的精确对端入站规则，发现宽泛冲突则停止并提供可逆处理。",
    "备份并保留已有配置，识别旧版重复 General 问题；异常时回滚自己的事务。",
    "管理 KDE 登录启动、当前会话静默看门狗与普通权限任务。",
    "提供只读诊断和人工确认提示；卸载只撤销本项目资源。"
  ],
  "exclusions": [
    "不支持 Windows 登录前（Pre-login）的系统级剪贴板或文件流转支持。",
    "不支持图像格式剪贴板同步（所有图像必须作为独立文件进行传输）。",
    "不维护离线剪贴板补发队列或多写者并发冲突解决机制（为在线尽力而为同步）。",
    "不自动或静默同意 KDE Connect 配对请求（必须由用户双向手动确认）。",
    "Android 平板目前处于 P1 阶段设计边界，受系统后台限制本轮不承诺后台自动流转。"
  ],
  "operationalEntrypoints": [
    {
      "name": "安装预览",
      "command": "pwsh -File .\\scripts\\install-windows.ps1 -WhatIf",
      "purpose": "查看官方依赖、无人值守和登录启动/看门狗变更计划；确认范围后执行同入口去掉 -WhatIf。"
    },
    {
      "name": "配置准确对端",
      "command": "pwsh -File .\\scripts\\configure-peer.ps1 -Peer <DEVICE_NAME>",
      "purpose": "在管理员窗口两端分别执行；存在宽泛规则时默认停止，不自动禁用。"
    },
    {
      "name": "宽泛规则处理预览",
      "command": "pwsh -File .\\scripts\\configure-peer.ps1 -Peer <DEVICE_NAME> -DisableBroadKdeFirewallRules -WhatIf",
      "purpose": "预览仅与 KDE 冲突的规则禁用，按相同入口明确执行后保留回滚记录。"
    },
    {
      "name": "只读检查",
      "command": "pwsh -File .\\scripts\\doctor.ps1 -AsJson",
      "purpose": "分别查看当前状态、FAIL（失败）和 WARN（待确认）；不改配对、插件或系统配置。"
    },
    {
      "name": "卸载预览与执行",
      "command": "pwsh -File .\\scripts\\uninstall.ps1 -WhatIf",
      "purpose": "默认仅预览；-Apply 撤销未变更的项目资源，第三方软件保留。"
    },
    {
      "name": "恢复先前被禁用的规则",
      "command": "pwsh -File .\\scripts\\uninstall.ps1 -Apply -RestoreDisabledBroadKdeFirewallRules",
      "purpose": "显式恢复此前记录且未被改动的规则；发生变化时保留并报告，不强行覆盖。"
    }
  ],
  "usageExamples": [
    {
      "ask": "两台电脑不在同一个 WiFi，还能复制文字过去吗？",
      "effect": "两端加入同一 Tailnet 并完成 KDE 配对后，可以在线同步。网络可能直连或中继，实际延迟需两端测量。",
      "moduleSlug": "tailscale-peer-reachability"
    },
    {
      "ask": "只让我的笔记本访问台式机的 KDE 服务。",
      "effect": "在两端配置对应的准确对端及专用入站规则；已有宽泛规则冲突先报告，经显式操作再可逆禁用。",
      "moduleSlug": "exact-peer-firewall-hardening"
    },
    {
      "ask": "传一份文件过去，帮我确认两边是同一份。",
      "effect": "KDE 发送完后，由操作者分别计算 SHA-256 对比；项目文档定义流程，脚本没有自动接管每次传输。",
      "moduleSlug": "kde-connect-pairing-sync"
    },
    {
      "ask": "托盘图标不小心退出了怎么办？",
      "effect": "已安装看门狗下次检查时尝试启动托盘，状态或启动失败可由 doctor 看见。看门狗自己退出则由原有任务下次触发恢复。",
      "moduleSlug": "silent-watchdog-and-session-lifecycle"
    }
  ],
  "evolution": [
    {
      "date": "2026-08-09—2026-08-10",
      "result": "建立 Windows 双机组网、customDevices 配置、精确对端防火墙、备份/回滚和只读诊断。"
    },
    {
      "date": "2026-08-11—2026-08-30",
      "result": "完善静默登录启动、当前会话看门狗与普通权限任务恢复，补齐 WhatIf 不写状态的行为。"
    }
  ],
  "glossary": [
    {
      "term": "Tailscale",
      "meaning": "基于 WireGuard 协议构建的安全跨设备虚拟专用组网工具（Tailnet）。"
    },
    {
      "term": "KDE Connect",
      "meaning": "开源跨设备协作系统，支持剪贴板共享、文件传输与设备配对。"
    },
    {
      "term": "fail-closed（失败阻断）",
      "meaning": "在安全前提不满足（如发现宽泛防火墙漏洞）时，立即终止后续变更以防风险放大。"
    },
    {
      "term": "customDevices",
      "meaning": "KDE Connect 用于显式指定对端 IP 列表的配置文件项，克服跨子网 UDP 广播失效问题。"
    },
    {
      "term": "Watchdog（看门狗）",
      "meaning": "在后台周期性巡检关键进程存活并在其异常退出时代为重启的轻量自愈程序。"
    },
    {
      "term": "Mutex（互斥锁）",
      "meaning": "操作系统级同步对象，用于保证看门狗进程在同一用户会话中仅存在单一活动实例。"
    }
  ]
}
};

export const meshclipKitModules = [
  {
    "id": "tailscale-peer-reachability",
    "slug": "tailscale-peer-reachability",
    "order": 1,
    "title": "Tailscale 专用组网与端点精准解析",
    "shortTitle": "Tailnet组网与解析",
    "teaser": "跨网络加密隧道与单对端安全发现",
    "kicker": "跨网络加密隧道与单对端安全发现",
    "route": "/projects/meshclip-kit/tailscale-peer-reachability",
    "statusTone": "accent",
    "status": "本机网络与批准对端 ping 通过",
    "summary": "Tailscale 为两台不同网络的 Windows 电脑提供 Tailnet 可达；脚本检查本机服务/在线/无人值守/入站设置，并选出准确在线对端。能直连则直连，必要时经 Tailscale 中继；不是任意网络都保证可达。",
    "problem": "若 Tailscale 未登录、处于 Shields Up 模式，或存在多个同名/离线设备导致无法安全辨别目标，脚本拒绝盲目猜测并终止执行。",
    "why": "跨子网时 KDE 广播发现可能找不到另一台电脑。明确对端地址能让 KDE 主动探测；组网故障和应用配对仍要分开判断。",
    "example": "在笔记本上执行 configure-peer.ps1，脚本自动发现 Tailnet 中唯一在线的台式机，将对端 IP 提取并写入 KDE Connect 的 customDevices，终端日志仅显示 100.x.y.z 脱敏地址。",
    "result": "得到准确对端地址及连通性诊断，供后续配置使用；ping成功不是剪贴板和文件验收。",
    "value": "通常不需要手工路由器端口映射，通过现有 Tailscale 网络连接批准对端，避免另建中继服务。",
    "readerStates": {
      "pass": "Tailscale Windows 服务自动运行，Run Unattended 开启，shields-up 为 false，成功解析唯一在线 Windows 对端并脱敏。",
      "problem": "Tailnet 中存在多个在线 Windows 对端未指定 -Peer，或目标设备离线，触发自动解析中止。",
      "unavailable": "Tailscale 后端未运行或未通过浏览器官方流程完成身份认证，停止网络连接尝试。"
    },
    "decisionImpact": [
      "同一Tailnet中的批准设备才进入配置流程；直连失败可用Tailscale中继，不承诺零公共中继。",
      "自动选择只有一个在线Windows对端时成立；显式名称必须精确匹配。",
      "使用官方浏览器登录，不传递脚本内登录密钥；对端身份在诊断中脱敏。"
    ],
    "implementation": [
      "Get-MeshClipTailscaleStatus 安全解析 tailscale status --json 输出。",
      "Resolve-MeshClipApprovedWindowsPeer 校验对端状态、系统类型与唯一性。",
      "ConvertTo-MeshClipRedactedAddress 提供确定性单向掩码脱敏转换。"
    ],
    "flow": [
      "检查服务自动运行、BackendState=Running、本机在线。",
      "检查ForceDaemon与shields-up；不自行改动不符合条件的现状。",
      "解析明确对端，确认在线且为Windows。",
      "doctor执行一次有界tailscale ping，结果独立于KDE配对。"
    ],
    "concepts": [
      {
        "term": "Tailnet（Tailscale 虚拟网络）",
        "explanation": "Tailscale 账户下的所有授权设备组成的专属点对点加密网状网络。"
      },
      {
        "term": "Run Unattended（无人值守）",
        "explanation": "Tailscale 无人值守服务模式，无需用户手动打开客户端界面即可在后台自启保持在线。"
      }
    ],
    "boundaries": [
      "仅负责底层 Tailnet 隧道的打通与对端 IP 的精准析取，不负责上层 KDE Connect 的配对确认。",
      "严格仅支持经过官方浏览器认证的个人 Tailnet，绝不在脚本中传递明文 auth-key。"
    ],
    "failures": [
      {
        "condition": "对端设备关机或离线",
        "response": "Resolve-MeshClipApprovedWindowsPeer 抛出错误拒绝继续，提示开启对端电脑。"
      },
      {
        "condition": "Tailscale 开启了 shields-up",
        "response": "doctor 诊断标记 FAIL 并提示关闭入站拦截以允许 KDE Connect 流量进入。"
      }
    ],
    "sources": [
      {
        "path": "scripts\\MeshClip.Common.psm1",
        "role": "Tailscale 状态与对端解析核心逻辑"
      },
      {
        "path": "scripts\\configure-peer.ps1",
        "role": "对端配置入口脚本"
      },
      {
        "path": "tests\\MeshClip.Common.Tests.ps1",
        "role": "地址脱敏与对端解析单元测试"
      }
    ],
    "verification": [
      "本轮源测试验证精确名称匹配、离线/非Windows拒绝、多对端歧义与地址脱敏。",
      "本轮Tailscale服务、在线、无人值守、入站设置、批准对端与ping检查通过。"
    ],
    "relation": "为KDE对端配置提供明确的网络地址和可达证据，不替代应用层确认。",
    "searchAliases": [
      "Tailnet组网",
      "Tailscale对端解析",
      "地址脱敏",
      "Run Unattended"
    ],
    "searchProjection": {
      "intents": [
        "Tailscale如何配置跨网络双机剪贴板",
        "KDE Connect跨子网无法发现对端",
        "Tailscale自动脱敏与安全对端解析"
      ],
      "entities": [
        "Tailscale",
        "Tailnet",
        "ForceDaemon",
        "shields-up",
        "Resolve-MeshClipApprovedWindowsPeer"
      ],
      "relations": [
        "Tailnet提供跨网络点对点隧道",
        "脚本自动解析唯一在线Windows对端并脱敏"
      ],
      "failureRecovery": [
        "对端离线时终止自动解析",
        "Shields Up开启时阻断配置并提示关闭入站拦截"
      ]
    }
  },
  {
    "id": "exact-peer-firewall-hardening",
    "slug": "exact-peer-firewall-hardening",
    "order": 2,
    "title": "精确对端防火墙与宽泛规则防御",
    "shortTitle": "对端防火墙收敛",
    "teaser": "将 KDE 入站限定到选定对端，冲突规则可逆处理",
    "kicker": "只管理 KDE 项目规则",
    "route": "/projects/meshclip-kit/exact-peer-firewall-hardening",
    "statusTone": "accent",
    "status": "本轮精确入站与非项目规则检查通过",
    "summary": "两条项目规则限定协议、端口、程序、Tailscale接口和批准对端地址。已有额外宽泛KDE入站规则会阻断正常配置，必须通过显式选项预览和禁用；不会修改无关应用的规则。",
    "problem": "若缺少 Windows 管理员提权，无法写入防火墙规则；若用户未明确授权加固且存在宽泛规则，脚本安全拒绝推进。",
    "why": "只添加两条窄规则仍可能被旧宽规则抵消，所以必须同时核对现有KDE规则。变更保留原状态，以便撤销项目时恢复。",
    "example": "我只想配置自己的笔记本。脚本发现旧KDE规则允许Any来源时先停下；我查看-DisableBroadKdeFirewallRules -WhatIf的范围，再执行同一准确变更。",
    "result": "KDE流量的项目规则明确限定批准对端；本机其他应用与整个Windows防火墙不属于该结论。",
    "value": "能够说清本项目开放给谁、通过哪个接口和程序，并可逆撤销自己的配置。",
    "readerStates": {
      "pass": "项目中两条 TCP/UDP 规则狭窄收敛，未发现非项目的 Any 等宽泛规则，防火墙体检通过。",
      "problem": "检测到未受管的宽泛 KDE Connect 规则，触发 fail-closed 阻断，等待显式加固授权。",
      "unavailable": "修改规则需要管理员；只读诊断若无法完整读取会明确 UNKNOWN（未知），不把缺证据当合规。"
    },
    "decisionImpact": [
      "规则同时约束协议、端口、程序、接口与单对端地址，不把0.0.0.0监听地址等同于防火墙远程放行范围。",
      "宽泛非项目规则只在显式选项下禁用，不删除，保留恢复记录。",
      "卸载核对资源是否仍由本项目拥有且未变化，变化资源保留并报告。"
    ],
    "implementation": [
      "Get-MeshClipKdeFirewallAudit读取指向可信kdeconnectd.exe的入站规则和过滤条件。",
      "Disable-MeshClipBroadKdeFirewallRules禁用明确冲突规则并记录。",
      "New-MeshClipFirewallRules创建TCP/UDP两条精确过滤规则；事务失败按记录回滚。"
    ],
    "flow": [
      "解析批准对端和可信daemon路径，读取当前规则。",
      "发现冲突时停止；显式选项下先预览，再执行可逆禁用。",
      "保存本机状态并添加精确TCP/UDP规则。",
      "回读规则；失败按原记录回滚，未完成事务由doctor报告。"
    ],
    "concepts": [
      {
        "term": "fail-closed（失败阻断）",
        "explanation": "当安全检测发现异常或潜在漏洞时，系统默认选择关闭或拒绝执行，而非冒险放行。"
      },
      {
        "term": "端口收敛",
        "explanation": "将开放监听的服务端口通过防火墙策略收缩到最小必需网络接口与最小授信客户端 IP 集合。"
      }
    ],
    "boundaries": [
      "只处理本项目KDE规则与明确识别的冲突规则，不代替全机网络策略。",
      "卸载不自动删除第三方程序，已变化资源不强行覆盖。"
    ],
    "failures": [
      {
        "condition": "存在开放给 0.0.0.0 的 KDE 防火墙规则",
        "response": "脚本立即 fail-closed 终止，提示使用 -DisableBroadKdeFirewallRules 参数进行受控加固。"
      },
      {
        "condition": "运行缺乏管理员权限",
        "response": "Test-MeshClipAdministrator 检查失败并抛出提权提示，不破坏性部分写入。"
      }
    ],
    "sources": [
      {
        "path": "scripts\\configure-peer.ps1",
        "role": "防火墙加固与规则创建入口"
      },
      {
        "path": "scripts\\uninstall.ps1",
        "role": "规则清理与历史宽泛规则可逆恢复"
      },
      {
        "path": "tests\\MeshClip.Common.Tests.ps1",
        "role": "防火墙过滤契约等价性测试"
      }
    ],
    "verification": [
      "MeshClip.Common.Tests.ps1 验证防火墙规则名哈希确定性、精准过滤契约与多余地址排除断言。",
      "doctor.ps1 自动化验证 Exact-peer firewall 为 PASS 且 Unmanaged KDE firewall 为 PASS。"
    ],
    "relation": "让KDE网络访问范围与批准对端一致，配对仍由KDE及用户负责。",
    "searchAliases": [
      "防火墙收敛",
      "KDE防火墙加固",
      "1714-1764端口",
      "fail-closed",
      "DisableBroadKdeFirewallRules"
    ],
    "searchProjection": {
      "intents": [
        "KDE Connect防火墙端口如何精准收敛",
        "怎样防止KDE Connect被局域网扫描",
        "清理0.0.0.0宽泛防火墙规则"
      ],
      "entities": [
        "Windows Firewall",
        "Get-NetFirewallRule",
        "Disable-MeshClipBroadKdeFirewallRules",
        "TCP/UDP 1714-1764"
      ],
      "relations": [
        "防火墙审计发现宽泛规则执行fail-closed",
        "规则四重绑定协议、端口、网卡与对端IP"
      ],
      "failureRecovery": [
        "非管理员变更提示提权",
        "通过显式恢复选项恢复此前记录且未改变的规则，冲突保留"
      ]
    }
  },
  {
    "id": "kde-connect-pairing-sync",
    "slug": "kde-connect-pairing-sync",
    "order": 3,
    "title": "KDE Connect 授信配对与文本文件流转",
    "shortTitle": "KDE配对与文件流转",
    "teaser": "双向人工配对核验与尽力而为传输边界",
    "kicker": "双向人工配对核验与尽力而为传输边界",
    "route": "/projects/meshclip-kit/kde-connect-pairing-sync",
    "statusTone": "accent",
    "status": "本机KDE运行且配置存在；一次发现刷新后，可用对端仍为0",
    "summary": "customDevices帮助KDE跨子网找到对端；配对要在两端确认，Including passwords由人关闭。两端在线时同步纯文本和发送文件；通常<2秒、100次无回环、1GB文件是源验收目标，不是本轮实测。",
    "problem": "设备可ping通但未配对时仍不能正常传输；中断后要重新发送，不承诺断点续传。",
    "why": "网络在线、设备可见、人工配对、插件启用和实际收到内容是不同条件。明确区分后，才能知道复制没到时该查哪一步。",
    "example": "我传一份测试文件到另一台电脑，接收完成后两端分别用Get-FileHash计算SHA-256。只有大小/哈希相符才接受这次文件结果；本轮未执行这个跨机动作。",
    "result": "两端配置和人工配对完成后可使用KDE的在线文字与文件通道；每次重要传输的结果需要真实接收证据。",
    "value": "说明谁来配对、谁来传输、谁来核验，避免把安装完成当成文件已经送达。",
    "readerStates": {
      "pass": "两端人工配对和设置确认后，实际复制/接收成功才证明通道可用；本轮未新验。",
      "problem": "KDE知道1台设备，但没有同时已配对且可达的对端；发现刷新后仍为0，保留WARN。",
      "unavailable": "任一端未登录/离线/未配对或KDE不可用时通道不可正常使用。"
    },
    "decisionImpact": [
      "脚本不静默同意配对，双方核对设备身份后确认。",
      "Including passwords需人关闭；doctor无论实际值如何都会提醒，不能保证所有复制文本不含秘密。",
      "纯文本在线尽力而为，不解决离线补发、同时复制排序和图像剪贴板。",
      "1GB是文档测试目标，不能推出协议最大文件限制或本轮已测通过。"
    ],
    "implementation": [
      "Write-MeshClipKdeConfigChange保留编码/注释，变更前备份，异常可回滚。",
      "Repair-MeshClipLegacyDuplicateGeneralLines只接受已知旧版重复形态，其余歧义拒绝。",
      "文件发送属于KDE原生能力；Get-MeshClipFileHashSafe用于项目内部资源比对，传输验收依文档在两端人工运行Get-FileHash。"
    ],
    "flow": [
      "两端分别写customDevices并检查精确入站。",
      "用户核对设备身份并确认KDE配对。",
      "在插件中关闭Including passwords，先用非敏感测试文字。",
      "重要文件接收后，两端另算SHA-256核对；本项目没有自动劫持发送路径。"
    ],
    "concepts": [
      {
        "term": "customDevices",
        "explanation": "KDE Connect 的静态对端 IP 清单配置项，用于在无法使用 UDP 广播时主动探测目标。"
      },
      {
        "term": "在线尽力而为（Best-effort）",
        "explanation": "在两端均在线时以最优路径及时交付数据，但不保证离线持久化存储或严格时序编排。"
      }
    ],
    "boundaries": [
      "剪贴板纯文本流转不接管图像或格式化富文本（图像作为文件传输）。",
      "大文件传输不包含断点续传能力，网络中断必须重新完整发送。"
    ],
    "failures": [
      {
        "condition": "设备在线但配对待核对",
        "response": "doctor保留人工确认提示，不自动替用户接受配对。"
      },
      {
        "condition": "需要检查密码共享设置",
        "response": "doctor始终给出人工检查Including passwords的WARN；不会读取、关闭或验证实际插件开关。"
      },
      {
        "condition": "文件传输中断",
        "response": "重新发送，并在接收完成后比较哈希。"
      }
    ],
    "sources": [
      {
        "path": "scripts\\MeshClip.Common.psm1",
        "role": "customDevices 读写、配置备份与修复"
      },
      {
        "path": "docs\\PRODUCT.md",
        "role": "一致性定义与成功准则规范"
      },
      {
        "path": "tests\\MeshClip.Common.Tests.ps1",
        "role": "配置读写与多行 UTF-8 保持测试"
      }
    ],
    "verification": [
      "本轮66项源测试含配置保留、旧版修复和14项真实进程设备计数回归；本地化零设备摘要不再产生假设备。",
      "一次--refresh后仍为Known=1、Available=0，doctor明确没有同时已配对且可达的设备；该现实条件阻止本轮复制与文件验收，没有读取真实数据。"
    ],
    "relation": "这一层才是用户真正复制和发送的位置，结果不能由底层网络或脚本测试代替。",
    "searchAliases": [
      "customDevices",
      "KDE配对",
      "剪贴板密码保护",
      "SHA-256传文件",
      "尽力而为同步"
    ],
    "searchProjection": {
      "intents": [
        "KDE Connect如何关闭密码同步",
        "跨网传输大文件SHA-256校验",
        "customDevices配置自动备份与修复"
      ],
      "entities": [
        "KDE Connect",
        "customDevices",
        "Including passwords",
        "Get-FileHash",
        "SHA-256"
      ],
      "relations": [
        "人工确认KDE配对，脚本只配置对端",
        "Including passwords需要手动关闭，doctor只提醒",
        "文件接收后两端手动核对SHA-256"
      ],
      "failureRecovery": [
        "配对未确认时通道显示WARN",
        "传输中断需重新发起并比对SHA-256"
      ]
    }
  },
  {
    "id": "silent-watchdog-and-session-lifecycle",
    "slug": "silent-watchdog-and-session-lifecycle",
    "order": 4,
    "title": "静默看门狗与会话级计划任务守护",
    "shortTitle": "静默看门狗守护",
    "teaser": "VBS 无窗后台巡检与 Task Scheduler 双层自愈",
    "kicker": "VBS 无窗后台巡检与 Task Scheduler 双层自愈",
    "route": "/projects/meshclip-kit/silent-watchdog-and-session-lifecycle",
    "statusTone": "accent",
    "status": "本轮登录启动、普通权限任务、单进程和新鲜心跳通过",
    "summary": "VBS（Visual Basic 脚本）隐藏启动当前会话看门狗，Mutex（互斥锁）避免重复实例。首次延迟15秒，之后默认每60秒检查托盘；发现缺失尝试启动并等5秒回读。原有计划任务每2分钟尝试恢复看门狗。",
    "problem": "睡眠或尚未登录时没有可用用户会话；持续应用启动失败记录StartFailed。锁屏但仍登录不等于注销。",
    "why": "托盘退出后需要恢复，但守护程序自己也可能退出。现有双层机制分别检查两类进程，不接管其他网络或应用配置。",
    "example": "如果托盘意外退出，看门狗会在下次检查时尝试启动它；自身退出则等待原有任务触发。通过心跳可以确认恢复结果。本轮没有主动结束这些进程来测试。",
    "result": "得到周期性进程恢复和Starting/Healthy/Restarted/StartFailed等状态；不保证任意故障均能自动恢复。",
    "value": "在已登录桌面中减少意外退出后的手工重开；实际恢复时间受调度、首次延迟和应用启动影响。",
    "readerStates": {
      "pass": "看门狗快捷方式、每 2 分钟计划任务与活动无窗口看门狗进程三项全部正常，心跳新鲜。",
      "problem": "托盘指示器进程退出，看门狗正在处于下一次 60 秒自愈等待周期中。",
      "unavailable": "用户尚未登录 Windows 桌面，系统处于登录前状态，守护程序按设计不启动。"
    },
    "decisionImpact": [
      "只处理当前会话托盘缺失，不改Tailscale、防火墙、配对、插件和剪贴板。",
      "既有VBS启动器负责隐藏控制台；普通权限任务不因故障升为Highest。",
      "同会话互斥锁避免多实例，多次触发不会建立另一套常驻系统。",
      "已安装且未变更的启动/任务由项目管理；持续应用失败应查应用，不缩短间隔无限重启。"
    ],
    "implementation": [
      "watch-kdeconnect.ps1 依托 Mutex 与 60 秒循环实现托盘指示器单实例守护。",
      "watch-kdeconnect-hidden.vbs 调用 WScript.Shell Run(command, 0, False) 彻底隐窗。",
      "New-MeshClipWatchdogTask 注册有限权限、PT2M 重复周期的计划任务守护者。"
    ],
    "flow": [
      "用户登录后由既有快捷方式或任务隐藏启动看门狗。",
      "获取Local\\MeshClipKit-KdeConnect-Watchdog互斥锁，未获得则退出。",
      "首次等待15秒；逐次检查当前SessionId的托盘进程。",
      "缺失时尝试启动，5秒后记录Restarted或StartFailed；下一轮默认等60秒。",
      "每2分钟原任务独立检查守护启动链，不唤醒睡眠电脑。"
    ],
    "concepts": [
      {
        "term": "SessionId（会话标识）",
        "explanation": "Windows 系统分配给当前登录交互式桌面的唯一会话编号，确保看门狗仅管理本桌面的托盘程序。"
      },
      {
        "term": "双层自愈体系",
        "explanation": "看门狗守护托盘程序（分钟级），计划任务守护看门狗自身（两分钟级）的层级容错架构。"
      }
    ],
    "boundaries": [
      "仅在当前用户已登录的会话中运行；锁屏后会话可能仍存在，睡眠时不唤醒。",
      "不提供登录前剪贴板或文件接收，也不自动修复持续应用崩溃。"
    ],
    "failures": [
      {
        "condition": "可信托盘无法启动",
        "response": "写StartFailed，doctor据进程和心跳报告失败。"
      },
      {
        "condition": "看门狗退出",
        "response": "原有任务在后续触发时尝试恢复，调度不是120秒硬保证。"
      }
    ],
    "sources": [
      {
        "path": "scripts\\watch-kdeconnect.ps1",
        "role": "看门狗轮询与自愈主逻辑"
      },
      {
        "path": "scripts\\watch-kdeconnect-hidden.vbs",
        "role": "无窗口隐藏唤起包装器"
      },
      {
        "path": "tests\\RepositorySafety.Tests.ps1",
        "role": "看门狗生命周期与零越权安全测试"
      }
    ],
    "verification": [
      "MeshClip.Common.Tests.ps1 验证计划任务有限权限契约、单实例互斥锁与 WhatIf 零写副作用。",
      "doctor.ps1 验证 KDE watchdog login startup、supervisor 与 runtime 三行全 PASS。"
    ],
    "relation": "维护登录后桌面的应用启动链；数据能否流转仍取决于网络、KDE配对和实际接收。",
    "searchAliases": [
      "静默看门狗",
      "watch-kdeconnect",
      "双层自愈",
      "计划任务守护",
      "无窗口后台运行"
    ],
    "searchProjection": {
      "intents": [
        "KDE Connect托盘意外退出怎样自动重启",
        "Windows无窗口静默计划任务守护",
        "watch-kdeconnect双层自愈看门狗"
      ],
      "entities": [
        "watch-kdeconnect.ps1",
        "watch-kdeconnect-hidden.vbs",
        "Task Scheduler",
        "Mutex",
        "watchdog-status.json"
      ],
      "relations": [
        "看门狗60秒轮询托盘进程",
        "计划任务每2分钟检查看门狗自身存活"
      ],
      "failureRecovery": [
        "指示器启动失败写回StartFailed状态",
        "计划任务以有限权限运行防止提权越权"
      ]
    }
  }
];

export const project = meshclipKitProject;
export const modules = meshclipKitModules;
