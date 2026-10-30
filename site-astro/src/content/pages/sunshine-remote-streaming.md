---
{
 "title": "远程电脑串流",
 "kind": "project",
 "url": "/projects/sunshine-remote-streaming/",
 "tagline": "人不在电脑前，也能看着桌面直接操作。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "usage",
   "label": "怎么用"
  },
  {
   "id": "tech",
   "label": "技术"
  },
  {
   "id": "highlights",
   "label": "亮点"
  },
  {
   "id": "features",
   "label": "全部功能"
  },
  {
   "id": "history",
   "label": "演进"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "sunshine-remote-streaming",
  "kind": "project",
  "title": "远程电脑串流",
  "url": "/projects/sunshine-remote-streaming/",
  "tagline": "人不在电脑前，也能看着桌面直接操作。",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "远程看和操作电脑画面",
  "based_on": {
   "commit": "ec5b2b0acc563209c578afd2bd8d5ebd47114188",
   "commit_time": "2026-10-06T05:52:26+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，白底水彩风格，从开头这屏的插画出发：办公桌上的笔记本屏幕亮起家里的桌面，一颗绿色光点沿 Tailscale 丝带飞向小房子里的台式机，再带着一小块画面飞回笔记本；接着台式机前的大显示器慢慢暗下去，旁边虚线描边的备用屏亮起，两三个小窗口沿弧线从暗屏飘到备用屏；片刻后大显示器重新亮起，窗口又飘回原位，备用屏淡下去。背景叶子缓慢飘落，其余画面静止。",
  "registry": {
   "groups": [
    {
     "id": "g-connect",
     "name": "连接和画面"
    },
    {
     "id": "g-fallback",
     "name": "主屏不在时"
    },
    {
     "id": "g-guard",
     "name": "安全规矩"
    },
    {
     "id": "g-check",
     "name": "体检和修复"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-desktop",
     "group": "g-connect",
     "name": "远程桌面",
     "what": "笔记本用 Moonlight、手机用 Moonlight 或 Artemis 连主机，看整个桌面、直接操作；10 月 8 日同一网络和手机热点下真人用过，画面和操作正常",
     "how": "客户端里点“桌面”这一个应用",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "README.md:3–4；apps.json 只有 Desktop；owner-decisions.md:382,387（CP3“目前主要是用moonlight”）；desired.yaml:3,6"
    },
    {
     "id": "f-tailnet",
     "group": "g-connect",
     "name": "只走自己的私网",
     "what": "在外面经 Tailscale 连回家，只有加进我这个网络的设备进得来；Tailscale 的公开功能（Funnel）没公开 Sunshine",
     "how": "什么都不用做；每天体检顺带查 Funnel 有没有公开它",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "sunshine-network.psm1:5–32,118–125；runtime/network-health.json SunshinePublicPorts=[]"
    },
    {
     "id": "f-ipv6-direct",
     "group": "g-connect",
     "name": "手机在外直连",
     "what": "两边都用公网 IPv6 直接连，不绕海外中转；6 月打通，10 月 8 日让 Tailscale 的 UDP 绕开代理；手机在外用流量时实际走哪条没有记录",
     "how": "打通是 6 月一次性的网络设置；要确认走没走直连，连着时让 AI 查线路",
     "status": "说不准",
     "screen": "sunshine-remote-streaming-08",
     "source": "提交 35f6a9c README §1–3；10 月 11 日主机以太网有 4 个公网 IPv6；verify-lite.log 没有一次指定手机的线路记录"
    },
    {
     "id": "f-codec",
     "group": "g-connect",
     "name": "高画质编码",
     "what": "RTX 5090 D 硬件编码，HEVC、AV1 都支持 10 位画面（HDR）；预设 P5，开空间自适应量化",
     "how": "客户端里选编码；主机这边已设好",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "sunshine.conf nvenc_preset=5、nvenc_spatial_aq=enabled；network-health.json Codecs HevcMain10/Av1Main10=true"
    },
    {
     "id": "f-always-on",
     "group": "g-connect",
     "name": "开机就能连",
     "what": "Sunshine、Tailscale 开机自动启动；Tailscale 设成没登录 Windows 也在线",
     "how": "无需操作；体检每天核对",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "Get-SunshineHealth 9 月 28 日：两服务 Running/Auto；network-health.json Unattended=true"
    },
    {
     "id": "f-vdd",
     "group": "g-fallback",
     "name": "虚拟备用屏",
     "what": "MTT 虚拟显示驱动造的一块屏：2880×1800、60 Hz、150% 缩放，默认请求开 HDR（Windows 这边实际开没开，截止前没有新的回读）；主屏关着时它就是桌面",
     "how": "装好就在；主屏关着时 Windows 自动用它",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "AGENTS.md:5；known_issues.md:101（9 月 26 日本人：主屏关着，只用 MTT1337）；9 月 28 日在线屏只有备用屏和机箱屏"
    },
    {
     "id": "f-capture-switch",
     "group": "g-fallback",
     "name": "自动换画面",
     "what": "主屏消失满 15 秒、又连续 5 秒没人连着，才把 Sunshine 换去抓备用屏；主屏回来满 5 秒再换回",
     "how": "守护自动做；要停跟 AI 说",
     "status": "待验收",
     "screen": "sunshine-remote-streaming-08",
     "source": "Invoke-SunshineCaptureFailover.ps1:6–9,260–623；Sunshine 配置目录 31 份 capture-*.bak（8 月 12 日—9 月 3 日 27 份，9 月 29 日 01:27 1 份，10 月 8 日 12:58 1 份，10 月 10 日 01:15 2 份；10 月 11 日 16:08 只读计数）；AGENTS.md:8 要求本人连一次断一次才算验收，没有记录"
    },
    {
     "id": "f-window-move",
     "group": "g-fallback",
     "name": "窗口搬过去",
     "what": "换到备用屏时，主屏上的普通窗口按原来的相对位置搬过去，并记下每个窗口的原位",
     "how": "随自动换画面一起做",
     "status": "待验收",
     "screen": "sunshine-remote-streaming-08",
     "source": "sunshine-capture-failover.psm1:908–940,998–1072"
    },
    {
     "id": "f-window-return",
     "group": "g-fallback",
     "name": "窗口搬回来",
     "what": "主屏回来满 1 秒就把窗口搬回原位；备用屏期间新开的窗口也挪到主屏",
     "how": "随主屏回来自动做",
     "status": "待验收",
     "screen": "sunshine-remote-streaming-08",
     "source": "Invoke-SunshineCaptureFailover.ps1:187–258；提交 46574b2 至 5d134b0（8 次）；capture-failover.log 有 19 次单个窗口搬不动的记录（9 月 17 日前）和 9 月 19–25 日的 6 次"
    },
    {
     "id": "f-vdd-settings",
     "group": "g-fallback",
     "name": "备用屏设置",
     "what": "改分辨率、刷新率、缩放、HDR；默认只预览，确认才改；上次真改是 9 月 2 日",
     "how": "跟 AI 说要改成什么，先看预览再同意",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "Set-SunshineVddDisplayProfile.ps1:1–30；C:\\VirtualDisplayDriver 下 9 月 2 日 17:36 的备份；提交 50a5352"
    },
    {
     "id": "f-vdd-bind",
     "group": "g-fallback",
     "name": "备用屏接进 Sunshine",
     "what": "按备用屏的硬件身份算出 Sunshine 认的屏编号写进配置；8 月 11 日装备用屏时用过",
     "how": "只在第一次装或重装备用屏时用",
     "status": "在用",
     "screen": "sunshine-remote-streaming-08",
     "source": "Set-SunshineHeadlessConfig.ps1；Sunshine 配置目录 codex-before-headless 两份备份（北京 8 月 11 日）"
    },
    {
     "id": "f-hands-off",
     "group": "g-guard",
     "name": "不碰真显示器",
     "what": "连上、断开、换屏，都不关、不停用、不重排物理显示器；水冷屏和机箱小屏一概不碰",
     "how": "规矩写在项目里，程序照做",
     "status": "在用",
     "screen": "sunshine-remote-streaming-09",
     "source": "AGENTS.md:3–4；sunshine.conf 五个 dd_* 全部 disabled；sunshine-capture-failover.psm1:151–159"
    },
    {
     "id": "f-idle-gate",
     "group": "g-guard",
     "name": "有人连着不换",
     "what": "换屏要重启 Sunshine；写配置前、重启后、搬窗口前各查一次连接（RTSP 的 TCP 和串流的 UDP 端点都看，查不清也不换），有人连进来就撤回、等下一轮",
     "how": "随自动换画面一起做",
     "status": "待验收",
     "screen": "sunshine-remote-streaming-09",
     "source": "Invoke-SunshineCaptureFailover.ps1:318–356,450–508,562–587；sunshine-safety.psm1:232–260"
    },
    {
     "id": "f-gpu-gate",
     "group": "g-guard",
     "name": "显卡安全闸",
     "what": "最近 15 分钟有显卡驱动出错、内核错误或蓝屏就不自动换屏，安静满 15 分钟自己恢复；单凭上次没正常关机不挡；查询出错也挡",
     "how": "自动；连续 15 分钟没有新故障、屏的身份和连接核对通过后自己恢复",
     "status": "在用",
     "screen": "sunshine-remote-streaming-09",
     "source": "sunshine-safety.psm1 Resolve-SunshineGpuStabilityGate、Get-SunshineGpuStabilityGate（提交 bcfa359，RecoveryQuietMinutes=15，Kernel-Power 41 只计数不挡）；AGENTS.md:7；9 月 29 日 03:28 worker-health.json Action=StayVdd、BlockedReason 为空"
    },
    {
     "id": "f-rollback",
     "group": "g-guard",
     "name": "改坏能退",
     "what": "改配置前先比对指纹、整份替换并留备份；Sunshine 重启失败就换回原样再启动，但换回前再比一次指纹，中途被别人改过就拒绝覆盖、报错；窗口恢复记录损坏时停住，不拿默认值覆盖",
     "how": "自动",
     "status": "在用",
     "screen": "sunshine-remote-streaming-09",
     "source": "sunshine-capture-failover.psm1:550–675；Invoke-SunshineCaptureFailover.ps1:129–178,466–487；27 份 capture-*.bak"
    },
    {
     "id": "f-watchdog",
     "group": "g-guard",
     "name": "守护自己拉起",
     "what": "我登录后启动，每 10 秒写一次心跳；挂了 1 分钟后自己重开，同一时间只跑一份",
     "how": "自动；体检看心跳新不新鲜",
     "status": "在用",
     "screen": "sunshine-remote-streaming-09",
     "source": "Install-SunshineCaptureFailoverTask.ps1:37–46；Invoke-SunshineCaptureFailover.ps1:626–716；worker-health.json 9 月 28 日 21:09 新鲜"
    },
    {
     "id": "f-daily-check",
     "group": "g-check",
     "name": "每天体检",
     "what": "14:30 查 Tailscale 在线、无人值守、编码能力、Funnel 有没有公开 Sunshine；9 月 18 日—10 月 10 日共 23 天天天通过（只查主机这边）",
     "how": "自动；结果写一行回执",
     "status": "在用",
     "screen": "sunshine-remote-streaming-09",
     "source": "verify-path-lite.ps1；sunshine-network.psm1；计划任务 SunshineRemote-VerifyPath-Daily；verify-lite.log；owner-decisions.md:75（T4 保留）"
    },
    {
     "id": "f-host-health",
     "group": "g-check",
     "name": "主机端体检",
     "what": "只读：两个服务、配置、安全闸、有没有人连着、守护心跳、现在抓主屏还是备用屏",
     "how": "跟 AI 说“查一下串流主机这边”",
     "status": "在用",
     "screen": "sunshine-remote-streaming-09",
     "source": "Get-SunshineHealth.ps1；9 月 28 日 21:11 现跑；streaming_maintenance.md 分层验收表"
    },
    {
     "id": "f-path-check",
     "group": "g-check",
     "name": "查线路",
     "what": "指定手机后 ping 5 次，看走直连、Tailscale 公共中转还是自己设备中转，报延迟",
     "how": "跟 AI 说“串流有点卡，查一下走的哪条路”",
     "status": "说不准",
     "screen": "sunshine-remote-streaming-09",
     "source": "sunshine-network.psm1:79–100；sunshine-safety.psm1:327–344；只读模式不留记录，日志里没有一次指定手机的结果"
    },
    {
     "id": "f-repair",
     "group": "g-check",
     "name": "串流修复",
     "what": "服务改回自动、开无人值守、清写死的代理、开网卡 IPv6；默认只出计划，改前存原样，失败倒着退回",
     "how": "跟 AI 说“串流连不上，修一下”，看过计划再同意",
     "status": "说不准",
     "screen": "sunshine-remote-streaming-09",
     "source": "repair-stream.ps1；6 月 26 日手册写过当时修过网络；9 月 18 日改成留回执后 runtime 里没有一份回执"
    },
    {
     "id": "f-pause",
     "group": "g-check",
     "name": "停和恢复画面切换",
     "what": "跟 AI 说“停掉串流画面切换”，先等正在做的一步做完再停，不直接停 Sunshine",
     "how": "跟 AI 说停或恢复",
     "status": "说不准",
     "screen": "sunshine-remote-streaming-09",
     "source": "E:\\PCConfig\\tools\\Invoke-StreamingMaintenanceControl.ps1；streaming_maintenance.md:9；task_purpose_catalog.json 的 stop 说明"
    },
    {
     "id": "f-maint-window",
     "group": "g-retired",
     "name": "维护小窗的开始菜单入口",
     "what": "开始菜单里的“RAMDisk 与远程串流维护”快捷方式，9 月 26 日按我的决定撤掉，平时改在网站看；小窗程序本身还在，需要时可以让 AI 直接打开",
     "how": "已撤；窗口脚本还在，要用时让 AI 打开",
     "status": "已停用",
     "screen": "sunshine-remote-streaming-09",
     "source": "streaming_maintenance.md:7,23–25；owner-decisions.md T8、E5"
    },
    {
     "id": "f-proxy-pin",
     "group": "g-retired",
     "name": "Tailscale 写死代理",
     "what": "6 月为了不掉登录给它配死了代理端口，8 月 6 日去掉，改跟着系统当前的网络走",
     "how": "已去掉；修复脚本里的一步会清掉残留",
     "status": "已停用",
     "screen": "sunshine-remote-streaming-09",
     "source": "提交 35f6a9c README §2.3；提交 7c7de55"
    }
   ],
   "numbers": [
    {
     "id": "n-tasks",
     "text": "2 个自动任务",
     "meaning": "本项目在 Windows 计划任务里的任务：串流画面切换、远程串流体检",
     "as_of": "2026-10-11",
     "source": "Get-ScheduledTask 现查；PCConfig registries/task_purpose_catalog.json 两条 group=remote",
     "screens": [
      "sunshine-remote-streaming-01",
      "sunshine-remote-streaming-04"
     ]
    },
    {
     "id": "n-switches",
     "text": "31 份配置备份",
     "meaning": "每次改 Sunshine 要抓哪块屏都先留一份，自动换屏、我手动改、改坏换回都会留（8 月 12 日起）；份数不等于成功换屏的次数",
     "as_of": "2026-10-12",
     "source": "C:\\Program Files\\Sunshine\\config 下 sunshine.conf.capture-*.bak 计数；截止 10 月 11 日 14:00 前",
     "screens": [
      "sunshine-remote-streaming-01",
      "sunshine-remote-streaming-06"
     ]
    },
    {
     "id": "n-public-ports",
     "text": "0 个 Sunshine 端口经 Tailscale 的公开功能（Funnel）放到互联网上",
     "meaning": "Tailscale Funnel 里指向 Sunshine 端口的公网入口个数；只覆盖 Funnel 这条路，不代表主机公网 IPv6 上查过",
     "as_of": "2026-10-29",
     "source": "截止前最近一次（10 月 10 日）每日体检；Exposure.SunshinePublicPorts；只覆盖 Funnel 这条路",
     "screens": [
      "sunshine-remote-streaming-01"
     ]
    },
    {
     "id": "n-test-groups",
     "text": "6 组源码测试",
     "meaning": "6 组源码测试；最近有回执的是 9 月 18 日六组全部通过",
     "as_of": "2026-10-30",
     "source": "9 月 18 日原始回执；“10 月 10 日重跑全部通过”没找到原始记录，本轮没有重跑",
     "screens": [
      "sunshine-remote-streaming-01",
      "sunshine-remote-streaming-05"
     ]
    },
    {
     "id": "n-tests-counted",
     "text": "测试定义 194 个（只计数）",
     "meaning": "6 组测试，现在的写法展开后共 194 项（只计数）",
     "as_of": "2026-10-11",
     "source": "“10 月 10 日重跑全部通过”没找到原始记录，本轮没有重跑，最近有回执的是 9 月 18 日",
     "screens": [
      "sunshine-remote-streaming-05"
     ]
    },
    {
     "id": "n-test-lines",
     "text": "1,962 行测试",
     "meaning": "测试不含空行，分 6 组",
     "as_of": "2026-10-12",
     "source": "按 10 月 6 日最后一次提交统计，不含空行；本轮没有重跑",
     "screens": [
      "sunshine-remote-streaming-05"
     ]
    },
    {
     "id": "n-code-lines",
     "text": "5,657 行程序",
     "meaning": "PowerShell，含内嵌 C# 和小启动脚本；不含空行；按 10 月 6 日最后一次提交统计",
     "as_of": "2026-10-12",
     "source": "提交 ec5b2b0；按 10 月 6 日最后一次提交统计，不含空行",
     "screens": [
      "sunshine-remote-streaming-05"
     ]
    },
    {
     "id": "n-commits",
     "text": "38 次提交",
     "meaning": "6 月 26 日至 10 月 6 日（北京时间）",
     "as_of": "2026-10-12",
     "source": "git -C E:\\Projects\\Tools\\sunshine-remote-streaming rev-list --count HEAD；提交 ec5b2b0；北京时间 2026-10-11 13:32 只读统计",
     "screens": [
      "sunshine-remote-streaming-05"
     ]
    },
    {
     "id": "n-clients",
     "text": "记着 4 个配对客户端",
     "meaning": "Sunshine 的已配对设备记录数",
     "as_of": "2026-10-11",
     "source": "sunshine_state.json named_devices 计数（名字不上网站）",
     "screens": [
      "sunshine-remote-streaming-04"
     ]
    },
    {
     "id": "n-ipv6",
     "text": "4 个公网 IPv6",
     "meaning": "主机的公网 IPv6 9 月 28 日记为 4 个，之后未重新核对",
     "as_of": "2026-09-28",
     "source": "9 月 28 日 Get-NetIPAddress 只读记录，只数不记地址值；之后未重新核对",
     "screens": [
      "sunshine-remote-streaming-06"
     ]
    },
    {
     "id": "n-false-reports",
     "text": "14 份 / 18 份",
     "meaning": "9 月 18 日数出 14 份“显卡故障报告”；截至 9 月 28 日 21:11，9 月 27 日晚这次开机以来的 18 份这类报告都被正确略过",
     "as_of": "2026-09-28",
     "source": "9 月 18 日、9 月 28 日 21:11 的历史记录；与保留的“亮点”正文一致",
     "screens": [
      "sunshine-remote-streaming-07"
     ]
    },
    {
     "id": "n-daily-pass",
     "text": "9 月 18 日—10 月 10 日天天通过",
     "meaning": "每日定时体检 23 次都是 pass，只查主机这边",
     "as_of": "2026-10-11",
     "source": "runtime/verify-lite.log；截止前最近一次是 10 月 10 日每日检查，覆盖 host-only",
     "screens": [
      "sunshine-remote-streaming-09"
     ]
    },
    {
     "id": "n-window-fixes",
     "text": "窗口搬回主屏改了 8 次",
     "meaning": "8 月 12 日至 9 月 2 日讲窗口搬回的修复提交",
     "as_of": "2026-09-28",
     "source": "提交 46574b2、6e3aac7、7c0a70e、60ed0f4、3b18d4d、5458b85、9d9ae11、5d134b0",
     "screens": [
      "sunshine-remote-streaming-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "登记和控制",
     "flow": "电脑配置与恢复登记两个自动任务的机器路径和人话说明（换机时都列为必须重建）；停和恢复画面切换的控制脚本、已撤下开始菜单的维护小窗在它的仓库；主屏黑幕（Ctrl+Win+R）是它的功能，串流时照样看得到桌面",
     "source": "E:\\PCConfig\\registries\\streaming_maintenance.json；task_purpose_catalog.json；docs/recovery/streaming_maintenance.md；b1/pcconfig/page.json r-streaming"
    },
    {
     "id": "r-remote-control",
     "with": "remote-control",
     "direction": "分工",
     "flow": "AI 连进电脑办事归电脑远程控制，人看画面、自己动手归这里；两边都走同一个 Tailscale 私网、都用那台笔记本",
     "source": "b1/remote-control/page.json 第 1、3 屏"
    },
    {
     "id": "r-codex-remote",
     "with": "codex-local-remote",
     "direction": "取代",
     "flow": "Codex 远程 8 月 3 日停止修补、之后冻结，在外面管 Codex 改成串流看整个桌面（本人：被远程桌面替代）",
     "source": "owner-decisions.md:1597,1607；b1/codex-local-remote/page.json"
    },
    {
     "id": "r-tailscale-skill",
     "with": "skill tailscale-safe-exposure",
     "direction": "被调用",
     "flow": "查线路时 AI 用这个技能；技能要求先读本项目规则，只跑本项目的只读体检，不改分辨率、HDR、刷新率",
     "source": "E:\\.agents\\skills\\tailscale-safe-exposure\\SKILL.md:73–83"
    },
    {
     "id": "r-laptop",
     "with": "笔记本",
     "direction": "客户端",
     "flow": "笔记本平时用 Moonlight 远控主机，UU 远程、ToDesk 备用；新装时才重新配对",
     "source": "E:\\PCConfig\\tools\\secondary-laptop-recovery\\config\\desired.yaml:3,6,314–315"
    },
    {
     "id": "r-cockpit",
     "with": "网站驾驶舱",
     "direction": "提供",
     "flow": "驾驶舱读的是守护心跳新不新鲜，以及守护自己报出的几种阻断原因；它不等于主机体检的全部结论，也看不到手机或笔记本上实际的画面",
     "source": "守护心跳及守护自身报告的阻断原因"
    },
    {
     "id": "r-tailscale",
     "with": "Tailscale（外部服务）",
     "direction": "依赖",
     "flow": "连接走 Tailscale 私网；它的登录服务器在国外，画面流量能直连时不经它",
     "source": "提交 35f6a9c README §3"
    }
   ],
   "highlights": [
    {
     "id": "h-false-alarm",
     "title": "一份被反复重交的报告，把自动换屏锁了近三周",
     "screen": "sunshine-remote-streaming-07"
    }
   ],
   "mentions": [
    {
     "target": "/projects/remote-control/",
     "screen": "sunshine-remote-streaming-01",
     "text": "让手机或笔记本上的 AI 直接在电脑上办事，是另一个项目：电脑远程控制"
    },
    {
     "target": "/projects/codex-local-remote/",
     "screen": "sunshine-remote-streaming-02",
     "text": "以前为这件事专门做过 Codex 远程"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "sunshine-remote-streaming-02",
     "text": "主屏黑幕是电脑配置与恢复的功能"
    },
    {
     "target": "/projects/remote-control/#usage",
     "screen": "sunshine-remote-streaming-03",
     "text": "开机办法见电脑远程控制的“出事怎么办”"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "sunshine-remote-streaming-03",
     "text": "Windows 远程桌面、ToDesk 看门狗见电脑配置与恢复"
    },
    {
     "target": "/rules/charter/#L28",
     "screen": "sunshine-remote-streaming-04",
     "text": "后台运行，不弹窗口，约法 L28"
    },
    {
     "target": "/skills/tailscale-safe-exposure/",
     "screen": "sunshine-remote-streaming-04",
     "text": "查线路时用远程只让自己连技能"
    },
    {
     "target": "/projects/codex-local-remote/",
     "screen": "sunshine-remote-streaming-10",
     "text": "8 月 3 日 Codex 远程停止修补"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "驾驶舱读的是守护心跳新不新鲜，以及守护自己报出的几种阻断原因；它不等于主机体检的全部结论，也看不到手机或笔记本上实际的画面",
     "source": "守护心跳是否新鲜及守护自身报告的阻断原因"
    }
   ]
  },
  "notes": {
   "merged": [
    "按本人新定的规矩（亮点只收已经在用的做法），原亮点“换屏不踢掉正在用的人”（待验收）和“三层地址转换下，手机在外面直连回家”（说不准）挪进技术一节的“还在等核对的两招”一屏；编号 h-no-interrupt、h-ipv6-direct 从 registry.highlights 撤下，验过后再以原编号加回。",
    "底稿“健康检查”就是“主机端体检”（改名）；底稿“画面来源检查”并进它：两者是同一个 Get-SunshineHealth.ps1，画面来源就是它报的 Capture.Mode。",
    "底稿“远程桌面”“连接路径检查”“备用画面切换”“备用屏设置”“远程窗口回迁”“串流修复”分别是“远程桌面”“查线路”“自动换画面”“备用屏设置”“窗口搬回来”“串流修复”。"
   ],
   "dropped": [
    "6 月手册里的远程唤醒方案（网络唤醒、智能插座加 BIOS 来电开机、只睡不关）：只是方案对比，这个项目没做成功能；远程开机的家在电脑远程控制页的“出事怎么办”。",
    "旧的 verify-path.ps1 完整诊断：现在只是转到 verify-path-lite.ps1 的兼容入口，不单列。",
    "守护的内部细节（进程父子存活看门、全局互斥锁、状态文件原子写）并进“守护自己拉起”“改坏能退”，不单列。"
   ],
   "unsure": [
    "功能状态和底稿不一样的两条：“查线路”底稿是在用，我改成说不准——只读模式不留记录，日志里没有一次指定手机的结果；“串流修复”底稿是在用，我改成说不准——6 月手册写过当时修过网络，但 9 月 18 日改成每次都留回执以后，runtime 里一份回执都没有。",
    "替本人口吻的句子：“在公司，接着用家里的主机”“平时远控主要用它；UU 远程和 ToDesk 也装着，当备用”（依据：本人 CP3 原话“目前主要是用moonlight”，“在公司”出自 PCConfig 副驾驶登记，是 AI 写的）；“这一套还在等我实际连一次核对”；“维护小窗……按我的决定撤掉”。上线前请本人过目。",
    "第 2 屏手机场景“看看 Codex 桌面版上的任务跑到哪了、给它补一句要求”是照 Codex 远程页的对照表写的用法，没有找到本人真这样用的记录。",
    "“显卡刚出过错，就不自动动显示”的理由是 AI 按项目规则（AGENTS.md 第 6 条）归纳的，规则本身没写为什么。",
    "现状（9 月 29 日 03:28 查 worker-health.json）：新安全闸 01:27 生效后，守护已让 Sunshine 改抓备用屏（Action=StayVdd、CaptureKind=Vdd、配置指向的屏在线），搬过去 9 个窗口；ClientAcceptance 仍是 unknown，手机或笔记本连进来实际看到什么，待本人连一次。",
    "Kernel-Power 41 是 Windows 在“上次没正常关机”后的下一次开机时记的。9 月 28 日前它会让强制重启后的整次开机都不换屏；9 月 29 日提交 bcfa359 起只计数、不挡（修复对话按审计改的），页面按新做法写。",
    "每日体检的触发时间带固定的 -05:00 偏移，不随本机夏令时变（docs/operations.md 引微软文档），一直是北京 14:30；冬令时本机钟面会显示 00:30。页面写 14:30。",
    "第 1 屏“0 个 Sunshine 端口经 Tailscale 的公开功能（Funnel）放到互联网上”只覆盖 Funnel 这条路：主机有公网 IPv6，Sunshine 能不能从 IPv6 公网直接访问没人查过（见 audit.md A3），所以没写成“不对公网开放”。",
    "旧网站和仓库里都没有这个项目的截图；本人如有手机或笔记本上 Moonlight 连着桌面的截图，可以放在第 2 屏。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/sunshine-remote-streaming/page.json",
  "sha256": "865f7bdfc16a1270888c8262eb7292200fa0d0b9ff630cd57cb7fde2a3bef9c7",
  "converted_at_beijing": "2026-10-30T13:04:19+08:00"
 }
}
---

::screen{#sunshine-remote-streaming-01 section="top"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，下面一段介绍。右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：两个小齿轮、两块屏幕之间一个来回箭头、一把锁住的小门、一叠打着对勾的试卷。数字卡下面一个白底描边按钮〔在整套系统里的位置 → 怎么协作〕，按钮下面一行灰色小字（含〔电脑远程控制〕链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着两个留空的浅色圆角框（左框约占横条宽度 30%，右框约 30%，高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：大标题和介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；入口按钮一行；灰色小字一行；最下面“现在”横条：上面“现在”两个字，下面两个空框上下排、各占满宽度，再下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#sunshine-remote-streaming"
   },
   {
    "text": "电脑远程控制",
    "href": "/projects/remote-control/"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#sunshine-remote-streaming"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/sunshine-remote-streaming/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "capture"
  ],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "illustration",
    "stat_card",
    "action_button",
    "inline_link",
    "live_strip",
    "content_card",
    "icon",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "illustration",
    "stat_card",
    "prose",
    "action_button",
    "live_strip",
    "chapter_title",
    "inline_link",
    "content_card",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上毛笔艺术字大标题，下面一段介绍。右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：两个小齿轮、两块屏幕之间一个来回箭头、一把锁住的小门、一叠打着对勾的试卷。数字卡下面一个白底描边按钮〔在整套系统里的位置 → 怎么协作〕，按钮下面一行灰色小字（含〔电脑远程控制〕链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着两个留空的浅色圆角框（左框约占横条宽度 30%，右框约 30%，高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
    "portrait": "竖版：大标题和介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；入口按钮一行；灰色小字一行；最下面“现在”横条：上面“现在”两个字，下面两个空框上下排、各占满宽度，再下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右上一幅水彩插画",
     "上面小插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上毛笔艺术字大标题，下面一段介绍。右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：两个小齿轮、两块屏幕之间一个来回箭头、一把锁住的小门、一叠打着对勾的试卷。数字卡下面一个白底描边按钮〔在整套系统里的位置 → 怎么协作〕，按钮下面一行灰色小字（含〔电脑远程控制〕链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着两个留空的浅色圆角框（左框约占横条宽度 30%，右框约 30%，高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "portrait": "竖版：大标题和介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；入口按钮一行；灰色小字一行；最下面“现在”横条：上面“现在”两个字，下面两个空框上下排、各占满宽度，再下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "60%",
     "text_ref": "大标题：远程电脑串流"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "介绍：人不在家里那台主机前，也能用笔记本或手机看到它的桌面、直接操作。主机上的S"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "hero",
     "width": "40%"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "截至10月2"
    },
    {
     "type": "feature_card",
     "columns": 4,
     "portrait_columns": 2,
     "illustration": "left_inside",
     "text_ref": "12个自动任务：画面切换每3秒看一次，体检每天14:30234份配置备份：每次改"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作复制AI续作说明"
    },
    {
     "type": "prose",
     "text_ref": "让手机或笔记本上的AI直接在电脑上办事，是另一个项目：电脑远程控制"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n四张数字卡原文解析成一组 steps（每项还有定稿编号），stat_card 只消费 stats；当前用 feature_card 保留完整编号和内容。数字/单位与说明拆分并放大数字、顶上独立插画的统计卡接口尚缺。\n横版 now 两框各约30%、竖版标签/两框/按钮顺排：live_strip 当前固定自己的栏宽及竖布局，比例和独立按钮位置未消费。\n清单未登记这些完整原文的逐字一致毛笔标题图：大标题：远程电脑串流；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 2 项，文字盘点预算 4 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "四张数字卡原文解析成一组 steps（每项还有定稿编号），stat_card 只消费 stats；当前用 feature_card 保留完整编号和内容。数字/单位与说明拆分并放大数字、顶上独立插画的统计卡接口尚缺。",
    "横版 now 两框各约30%、竖版标签/两框/按钮顺排：live_strip 当前固定自己的栏宽及竖布局，比例和独立按钮位置未消费。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：大标题：远程电脑串流；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 2 项，文字盘点预算 4 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1,
     "icon": 2
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 4,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "illustration",
    "stat_card",
    "action_button",
    "inline_link",
    "live_strip",
    "content_card",
    "icon",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "illustration",
    "stat_card",
    "prose",
    "action_button",
    "live_strip",
    "chapter_title",
    "inline_link",
    "content_card",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上毛笔艺术字大标题，下面一段介绍。右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：两个小齿轮、两块屏幕之间一个来回箭头、一把锁住的小门、一叠打着对勾的试卷。数字卡下面一个白底描边按钮〔在整套系统里的位置 → 怎么协作〕，按钮下面一行灰色小字（含〔电脑远程控制〕链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着两个留空的浅色圆角框（左框约占横条宽度 30%，右框约 30%，高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
    "portrait": "竖版：大标题和介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；入口按钮一行；灰色小字一行；最下面“现在”横条：上面“现在”两个字，下面两个空框上下排、各占满宽度，再下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右上一幅水彩插画",
     "上面小插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上毛笔艺术字大标题，下面一段介绍。右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：两个小齿轮、两块屏幕之间一个来回箭头、一把锁住的小门、一叠打着对勾的试卷。数字卡下面一个白底描边按钮〔在整套系统里的位置 → 怎么协作〕，按钮下面一行灰色小字（含〔电脑远程控制〕链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着两个留空的浅色圆角框（左框约占横条宽度 30%，右框约 30%，高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "portrait": "竖版：大标题和介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；入口按钮一行；灰色小字一行；最下面“现在”横条：上面“现在”两个字，下面两个空框上下排、各占满宽度，再下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "大标题：远程电脑串流"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "prose",
     "text_ref": "介绍：人不在家里那台主机前，也能用笔记本或手机看到它的桌面、直接操作。主机上的S"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "截至10月2"
    },
    {
     "type": "feature_card",
     "columns": 4,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "12个自动任务：画面切换每3秒看一次，体检每天14:30234份配置备份：每次改"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作复制AI续作说明"
    },
    {
     "type": "prose",
     "text_ref": "让手机或笔记本上的AI直接在电脑上办事，是另一个项目：电脑远程控制"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n四张数字卡原文解析成一组 steps（每项还有定稿编号），stat_card 只消费 stats；当前用 feature_card 保留完整编号和内容。数字/单位与说明拆分并放大数字、顶上独立插画的统计卡接口尚缺。\n横版 now 两框各约30%、竖版标签/两框/按钮顺排：live_strip 当前固定自己的栏宽及竖布局，比例和独立按钮位置未消费。\n清单未登记这些完整原文的逐字一致毛笔标题图：大标题：远程电脑串流；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 2 项，文字盘点预算 4 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "四张数字卡原文解析成一组 steps（每项还有定稿编号），stat_card 只消费 stats；当前用 feature_card 保留完整编号和内容。数字/单位与说明拆分并放大数字、顶上独立插画的统计卡接口尚缺。",
    "横版 now 两框各约30%、竖版标签/两框/按钮顺排：live_strip 当前固定自己的栏宽及竖布局，比例和独立按钮位置未消费。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：大标题：远程电脑串流；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 2 项，文字盘点预算 4 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1,
     "icon": 2
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 4,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "2 个｜自动任务：画面切换每 3 秒看一次，体检每天 14:30",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "28 次｜自动换画面：主屏不在换到备用屏，回来再换回（8 月 12 日至 9 月 29 日）",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f988c873ff55203c1761.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "多设备同步",
   "source_phrase": "0 个｜Sunshine 端口经 Tailscale 的公开功能（Funnel）放到互联网上，每天体检都查",
   "sha256": "ac23e54a628d0076b51a402e1aca264e55fc7c31b44e4dd9558380bdd878105a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "6 组｜源码测试，9 月 29 日重跑全部通过",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/远程主备显示屏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "远程主备显示屏",
   "source_phrase": "右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。",
   "sha256": "f0c9f635bf341d663736af34b221cffe82521a671a9b14feba70978209dfaae4",
   "status": "ready",
   "original_elements": [
    "左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-3049ff19fb625c7b1507.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-3049ff19fb625c7b1507",
   "title_text": "远程电脑串流",
   "sha256": "50704cf4bfae06352fdea3c0417fb9b18d423e008a84ac07707b9fd839ecd45a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

大标题：远程电脑串流

介绍：人不在家里那台主机前，也能用笔记本或手机看到它的桌面、直接操作。主机上的 Sunshine（开源的串流服务端）用显卡把画面编码发出去，笔记本和手机上的 Moonlight（开源的串流客户端）接收，路走 Tailscale（只连自己设备的私人网络）。10 月 8 日我在同一网络和手机热点下实际连过：画面和操作正常，热点连续用 5 分钟没断。主屏关着时，电脑会换去抓一块虚拟的备用屏，让串流照样有画面——这一套还在等我实际连一次核对。10 月 30 日 11:10 换屏守护最近一轮的记录：现在抓的是虚拟备用屏，守护这一轮决定“留在备用屏”，Sunshine 配置要抓的那块屏在线、对得上，没有报任何阻断原因，这一轮没有要搬或搬失败的窗口；10 月 11 日 13:33 主机体检报过的“阻塞”（配置要抓的屏在当时活动的屏里找不到对应的一个）已经不是现状。现在跑着的守护是 10 月 26 日 10:30 启动的，它报出的四个程序文件指纹和当前源码逐个相同，所以 10 月 21—25 日源码里的几处改动已经在用：往备用屏搬窗只认证明过的主屏区域，找不到就不新搬窗（照样抓备用屏，不是停止串流）；后台启动器起不来时写日志、报失败；心跳写不出去单独记错，不再连带打断换屏判断。以前写的“修复还没加载”已经不是现状。10 月 29 日 14:30 的每天体检通过，只查主机这边：Tailscale 在线、无人值守开着、编码能力在、Sunshine 端口没有公开到互联网；Sunshine 服务本身在跑是 10 月 20 日的读数，这次没重查。守护报正常、服务在跑，都不等于这会儿手机或笔记本上的画面是好的：客户端画面这一栏仍是“不知道”。

数字卡片（截至 10 月 29 日 14:30）：
1. **2 个**｜自动任务：画面切换每 3 秒看一次，体检每天 14:30
2. **34 份**｜配置备份：每次改 Sunshine 要抓哪块屏都先留一份，自动换屏、我手动改、改坏换回都会留（8 月 12 日起）；份数不等于成功换屏的次数
3. **0 个**｜Sunshine 端口经 Tailscale 的公开功能（Funnel）放到互联网上，每天体检都查
4. **6 组**｜源码测试；页面以前写的“10 月 10 日重跑全部通过”没找到原始记录，本轮没有重跑，最近有回执的是 9 月 18 日六组全部通过

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

让手机或笔记本上的 AI 直接在电脑上办事，是另一个项目：〔电脑远程控制〕

现在　〔现在正不正常 → 驾驶舱〕

驾驶舱读的是守护心跳新不新鲜，以及守护自己报出的几种阻断原因；它不等于上面主机体检的全部结论，也看不到手机或笔记本上实际的画面。

::screen{#sunshine-remote-streaming-02 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-02",
  "section": "usage",
  "title": "怎么用",
  "scene": "横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。卡片标题粗体，下面正文。卡片下面一条横跨整屏的浅绿细卡片，左边画一只手按着键盘上高亮的 Ctrl、Win、R 三个键帽，右边一行字（含链接）。",
  "portrait": "竖版：标题在上；三张场景卡一行一张，插画在每张卡片顶部；浅绿细卡片在最下，键帽插画放在字的上面。",
  "links": [
   {
    "text": "Codex 远程",
    "href": "/projects/codex-local-remote/",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose",
    "notice",
    "inline_link",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "prose",
    "illustration",
    "content_card",
    "notice",
    "chapter_title",
    "inline_link",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。卡片标题粗体，下面正文。卡片下面一条横跨整屏的浅绿细卡片，左边画一只手按着键盘上高亮的 Ctrl、Win、R 三个键帽，右边一行字（含链接）。",
    "portrait": "竖版：标题在上；三张场景卡一行一张，插画在每张卡片顶部；浅绿细卡片在最下，键帽插画放在字的上面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "顶部一幅小水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。卡片标题粗体，下面正文。卡片下面一条横跨整屏的浅绿细卡片，左边画一只手按着键盘上高亮的 Ctrl、Win、R 三个键帽，右边一行字（含链接）。",
   "portrait": "竖版：标题在上；三张场景卡一行一张，插画在每张卡片顶部；浅绿细卡片在最下，键帽插画放在字的上面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：怎么用"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "row": "use-cards",
     "width": "33%",
     "text_ref": "1在公司，接着用家里的主机",
     "illustration_asset": [
      "_library/illustrations/电脑远程.png"
     ],
     "row_card_notes": true,
     "row_equal_height": true
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "row": "use-cards",
     "width": "34%",
     "text_ref": "2人在外面，手机上看一眼",
     "illustration_asset": [
      "_library/illustrations/手机远程.png"
     ],
     "row_card_notes": true,
     "row_equal_height": true
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "row": "use-cards",
     "width": "33%",
     "text_ref": "3主屏关着，照样有画面",
     "illustration_asset": [
      "_library/illustrations/显示屏切换.png"
     ],
     "row_card_notes": true,
     "row_equal_height": true,
     "row_note_from": "这一套还在等我实际连一次核对"
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "人在家、主屏开着又不想让它亮：按Ctrl+Win+R给主屏盖一层黑幕，串流照样看"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n三张场景卡顶部插画及底部 Ctrl/Win/R 键帽插画必须在卡内；source_text_card 普通模式只有 bottom_inside 已实现，top_inside 字段目前不会输出对应插画，需三张具体插画映射与顶部模式。\n三张卡头是单条 steps 后跟 para，不是 card/group；whole_block 保证每个场景完整放一外卡，但把单步名称提升为独立卡头尚未实现。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：怎么用；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 3 个插画位；缺 3 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "三张场景卡顶部插画及底部 Ctrl/Win/R 键帽插画必须在卡内；source_text_card 普通模式只有 bottom_inside 已实现，top_inside 字段目前不会输出对应插画，需三张具体插画映射与顶部模式。",
    "三张卡头是单条 steps 后跟 para，不是 card/group；whole_block 保证每个场景完整放一外卡，但把单步名称提升为独立卡头尚未实现。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：怎么用；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 3 个插画位；缺 3 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 3,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose",
    "notice",
    "inline_link",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "prose",
    "illustration",
    "content_card",
    "notice",
    "chapter_title",
    "inline_link",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。卡片标题粗体，下面正文。卡片下面一条横跨整屏的浅绿细卡片，左边画一只手按着键盘上高亮的 Ctrl、Win、R 三个键帽，右边一行字（含链接）。",
    "portrait": "竖版：标题在上；三张场景卡一行一张，插画在每张卡片顶部；浅绿细卡片在最下，键帽插画放在字的上面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "顶部一幅小水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。卡片标题粗体，下面正文。卡片下面一条横跨整屏的浅绿细卡片，左边画一只手按着键盘上高亮的 Ctrl、Win、R 三个键帽，右边一行字（含链接）。",
   "portrait": "竖版：标题在上；三张场景卡一行一张，插画在每张卡片顶部；浅绿细卡片在最下，键帽插画放在字的上面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：怎么用"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "text_ref": "1在公司，接着用家里的主机",
     "illustration_asset": [
      "_library/illustrations/电脑远程.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "text_ref": "2人在外面，手机上看一眼",
     "illustration_asset": [
      "_library/illustrations/手机远程.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "text_ref": "3主屏关着，照样有画面",
     "illustration_asset": [
      "_library/illustrations/显示屏切换.png"
     ]
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "人在家、主屏开着又不想让它亮：按Ctrl+Win+R给主屏盖一层黑幕，串流照样看"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n三张场景卡顶部插画及底部 Ctrl/Win/R 键帽插画必须在卡内；source_text_card 普通模式只有 bottom_inside 已实现，top_inside 字段目前不会输出对应插画，需三张具体插画映射与顶部模式。\n三张卡头是单条 steps 后跟 para，不是 card/group；whole_block 保证每个场景完整放一外卡，但把单步名称提升为独立卡头尚未实现。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：怎么用；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 3 个插画位；缺 3 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "三张场景卡顶部插画及底部 Ctrl/Win/R 键帽插画必须在卡内；source_text_card 普通模式只有 bottom_inside 已实现，top_inside 字段目前不会输出对应插画，需三张具体插画映射与顶部模式。",
    "三张卡头是单条 steps 后跟 para，不是 card/group；whole_block 保证每个场景完整放一外卡，但把单步名称提升为独立卡头尚未实现。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：怎么用；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 3 个插画位；缺 3 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 3,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/电脑远程.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电脑远程",
   "source_phrase": "三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。",
   "sha256": "3562cf4060ee36240ac08e8255aab66764cf19b17484987d2137b4d3a1dc64c5",
   "status": "ready",
   "original_elements": [
    "一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/手机远程.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "手机远程",
   "source_phrase": "三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready",
   "original_elements": [
    "一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/显示屏切换.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "显示屏切换",
   "source_phrase": "三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一间办公室，桌上笔记本屏幕里是家里主机的桌面，窗外远处一座小房子；2 一只手拿着手机，手机屏幕里是电脑桌面，桌面上一个 Codex 窗口，背景是街道；3 一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏。",
   "sha256": "72aae5dbbea0dc2a8697b682451f4455c6a9ba63b3df152af71e551d9c96022b",
   "status": "ready",
   "original_elements": [
    "一台关着的暗色大显示器，旁边一块虚线描边、半透明的备用屏亮着，几个小窗口正沿着弧线从暗屏飘到备用屏"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/电脑远程.png",
   "fallback": false,
   "key": "电脑远程",
   "source_phrase": "1在公司，接着用家里的主机\n笔记本上打开Moonlight，点“桌面”，家里主机的整个桌面就出现在笔记本上，键盘鼠标直接操作。程序、文件和RTX5090D显卡的算力都是主机的，笔记本只负责看和按。平时远控主要用它；UU远程和ToDesk也装着，当备用。",
   "sha256": "3562cf4060ee36240ac08e8255aab66764cf19b17484987d2137b4d3a1dc64c5",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/手机远程.png",
   "fallback": false,
   "key": "手机远程",
   "source_phrase": "2人在外面，手机上看一眼\n手机用Moonlight或Artemis（安卓上的Moonlight改版）连回同一个桌面，比如看看Codex桌面版上的任务跑到哪了、给它补一句要求。以前为这件事专门做过Codex远程，现在直接看整个桌面，不用再单独维护一条路。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/显示屏切换.png",
   "fallback": false,
   "key": "显示屏切换",
   "source_phrase": "3主屏关着，照样有画面\n主屏关着时，Windows的桌面落在一块虚拟的备用屏上（2880×1800、HDR）。后台的守护程序等没人连着的时候，把串流换成抓备用屏、把主屏上的窗口搬过去；主屏打开后再换回来，把窗口搬回原位。这一套还在等我实际连一次核对，所以在“全部功能”里标着待验收。",
   "sha256": "72aae5dbbea0dc2a8697b682451f4455c6a9ba63b3df152af71e551d9c96022b",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/电脑远程.png",
   "fallback": false,
   "key": "电脑远程",
   "source_phrase": "1在公司，接着用家里的主机\n笔记本上打开Moonlight，点“桌面”，家里主机的整个桌面就出现在笔记本上，键盘鼠标直接操作。程序、文件和RTX5090D显卡的算力都是主机的，笔记本只负责看和按。平时远控主要用它；UU远程和ToDesk也装着，当备用。",
   "sha256": "3562cf4060ee36240ac08e8255aab66764cf19b17484987d2137b4d3a1dc64c5",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/手机远程.png",
   "fallback": false,
   "key": "手机远程",
   "source_phrase": "2人在外面，手机上看一眼\n手机用Moonlight或Artemis（安卓上的Moonlight改版）连回同一个桌面，比如看看Codex桌面版上的任务跑到哪了、给它补一句要求。以前为这件事专门做过Codex远程，现在直接看整个桌面，不用再单独维护一条路。",
   "sha256": "3317f722ba53b862b350f39fe53147912db4d115fd2e82e9f181c1023b9d7054",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/显示屏切换.png",
   "fallback": false,
   "key": "显示屏切换",
   "source_phrase": "3主屏关着，照样有画面\n主屏关着时，Windows的桌面落在一块虚拟的备用屏上（2880×1800、HDR）。后台的守护程序等没人连着的时候，把串流换成抓备用屏、把主屏上的窗口搬过去；主屏打开后再换回来，把窗口搬回原位。这一套还在等我实际连一次核对，所以在“全部功能”里标着待验收。",
   "sha256": "72aae5dbbea0dc2a8697b682451f4455c6a9ba63b3df152af71e551d9c96022b",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-9fe7ee9705091075f9a6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9fe7ee9705091075f9a6",
   "title_text": "怎么用",
   "sha256": "c038ec3c038c442742b47f8ba4768302d518cc4ff2e1c7bab1e1aa7b318f70f6",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：怎么用

1. **在公司，接着用家里的主机**
笔记本上打开 Moonlight，点“桌面”，家里主机的整个桌面就出现在笔记本上，键盘鼠标直接操作。程序、文件和 RTX 5090 D 显卡的算力都是主机的，笔记本只负责看和按。平时远控主要用它；UU 远程和 ToDesk 也装着，当备用。

2. **人在外面，手机上看一眼**
手机用 Moonlight 或 Artemis（安卓上的 Moonlight 改版）连回同一个桌面，比如看看 Codex 桌面版上的任务跑到哪了、给它补一句要求。以前为这件事专门做过〔Codex 远程〕，现在直接看整个桌面，不用再单独维护一条路。

3. **主屏关着，照样有画面**
主屏关着时，Windows 的桌面落在一块虚拟的备用屏上（2880×1800，默认请求开 HDR；Windows 这边 HDR 实际开没开，截止前没有新的回读）。后台的守护程序等没人连着的时候，把串流换成抓备用屏、把主屏上的窗口搬过去；主屏打开后再换回来，把窗口搬回原位。这一套还在等我实际连一次核对：10 月 8 日那次真人联网验的是连得上、用得顺，没有验主屏关掉后的换屏和窗口搬回，所以在“全部功能”里仍标着待验收。

人在家、主屏开着又不想让它亮：按 Ctrl+Win+R 给主屏盖一层黑幕，串流照样看得到桌面，这是〔电脑配置与恢复〕的功能。

::screen{#sunshine-remote-streaming-03 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-03",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（断开的绿色丝带、一只蜗牛、一块屏幕上一个问号、一个被卡住的小窗口、一个合上的闸门、一只手拿着手机连一下又断开），右边粗体一句加小字。最下面一条横跨整屏的浅灰细卡片，写“不归它管”。",
  "portrait": "竖版：标题在上；六张卡片一行一张；“不归它管”在最下。",
  "links": [
   {
    "text": "电脑远程控制",
    "href": "/projects/remote-control/#remote-control-03",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/",
    "orientations": [
     "v"
    ]
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "icon",
    "notice",
    "inline_link",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "chapter_title",
    "icon",
    "notice",
    "inline_link",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（断开的绿色丝带、一只蜗牛、一块屏幕上一个问号、一个被卡住的小窗口、一个合上的闸门、一只手拿着手机连一下又断开），右边粗体一句加小字。最下面一条横跨整屏的浅灰细卡片，写“不归它管”。",
    "portrait": "竖版：标题在上；六张卡片一行一张；“不归它管”在最下。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（断开的绿色丝带、一只蜗牛、一块屏幕上一个问号、一个被卡住的小窗口、一个合上的闸门、一只手拿着手机连一下又断开），右边粗体一句加小字。最下面一条横跨整屏的浅灰细卡片，写“不归它管”。",
   "portrait": "竖版：标题在上；六张卡片一行一张；“不归它管”在最下。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：出事怎么办"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1连不上电脑关机、睡着或断网时，串流也连不上，得先把电脑弄起来（办法见电脑远程控"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "不归它管：Windows远程桌面、ToDesk看门狗，见电脑配置与恢复。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n六卡源语义图标（断带、蜗牛、问号屏、卡住窗口、闸门、手机）须核对，未按现有候选顺序当成事实。灰 notice 当前沿浅绿，源灰底需样张。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 4 项，文字盘点预算 6 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "六卡源语义图标（断带、蜗牛、问号屏、卡住窗口、闸门、手机）须核对，未按现有候选顺序当成事实。灰 notice 当前沿浅绿，源灰底需样张。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 4 项，文字盘点预算 6 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 4
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "icon",
    "notice",
    "inline_link",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "chapter_title",
    "icon",
    "notice",
    "inline_link",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（断开的绿色丝带、一只蜗牛、一块屏幕上一个问号、一个被卡住的小窗口、一个合上的闸门、一只手拿着手机连一下又断开），右边粗体一句加小字。最下面一条横跨整屏的浅灰细卡片，写“不归它管”。",
    "portrait": "竖版：标题在上；六张卡片一行一张；“不归它管”在最下。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（断开的绿色丝带、一只蜗牛、一块屏幕上一个问号、一个被卡住的小窗口、一个合上的闸门、一只手拿着手机连一下又断开），右边粗体一句加小字。最下面一条横跨整屏的浅灰细卡片，写“不归它管”。",
   "portrait": "竖版：标题在上；六张卡片一行一张；“不归它管”在最下。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：出事怎么办"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1连不上电脑关机、睡着或断网时，串流也连不上，得先把电脑弄起来（办法见电脑远程控"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "不归它管：Windows远程桌面、ToDesk看门狗，见电脑配置与恢复。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n六卡源语义图标（断带、蜗牛、问号屏、卡住窗口、闸门、手机）须核对，未按现有候选顺序当成事实。灰 notice 当前沿浅绿，源灰底需样张。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 4 项，文字盘点预算 6 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "六卡源语义图标（断带、蜗牛、问号屏、卡住窗口、闸门、手机）须核对，未按现有候选顺序当成事实。灰 notice 当前沿浅绿，源灰底需样张。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 4 项，文字盘点预算 6 个图标位；差 2 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 4
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "断开的绿色丝带",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一只蜗牛",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显示器",
   "source_phrase": "一块屏幕上一个问号",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个被卡住的小窗口",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "一个合上的闸门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "一只手拿着手机连一下又断开",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：出事怎么办

1. **连不上**｜电脑关机、睡着或断网时，串流也连不上，得先把电脑弄起来（办法见〔电脑远程控制〕的“出事怎么办”）。电脑开着还连不上，就跟 AI 说“串流连不上”：它先做只读体检，看 Sunshine、Tailscale 两个服务、无人值守（没登录 Windows 也保持在线）、编码能力；要改才出一份计划，我同意后才动。
2. **卡、糊、延迟高**｜常见原因是没走直连，也可能是编码或客户端那头的问题，先查线路。告诉 AI 查哪一部手机，它来查：它 ping 5 次，看最后一次走的是直连、Tailscale 的公共中转服务器（最近的在东京、香港），还是经自己的另一台设备中转，并报延迟。
3. **画面不对**｜黑屏、看到的是备用屏、分辨率不对时，让 AI 查“现在抓的是哪块屏”：主机端体检会报当前抓主屏还是备用屏、有没有换到一半、被什么挡住。10 月 11 日 13:33 就报过这种阻塞：Sunshine 配置要抓的那块屏，在当时活动的屏里找不到对应的一个；10 月 22 日 07:22 守护的记录里没有阻塞，配置要抓的屏在线。这些只说明主机这边绑的是哪块屏，客户端实际看到什么，都还不知道。
4. **断开后窗口不在原位**｜主屏回来满 1 秒，守护就把窗口搬回原位；个别窗口 Windows 不让挪（报“拒绝访问”），会记进日志，其余照搬。往备用屏搬窗时，新源码只认“现在证明在线的主屏区域”或上次记下的主屏区域；两样都没有，就不再新搬窗，已记的窗口原位照样留着，备用屏照样抓。这条 10 月 22 日进了源码，10 月 26 日起跑着的守护已经是这一版。
5. **自动换屏停了**｜多半是安全闸关了：最近 15 分钟里出过显卡错误或蓝屏，就先不自动换屏；连续 15 分钟没有新故障、屏的身份和有没有人连着再核对一遍，就自己恢复，不用重启（为什么见“为什么这样设计”第 4 条）。单凭“上次没正常关机”（比如卡死后强制重启）不会挡；查不了 Windows 的事件记录时也挡着，要先让 AI 把查询修好。守护根本没起来时，新版隐藏启动器会把启动、守护退出和启动出错分开记进 runtime/capture-launcher.log，出错时返回失败码，方便 AI 查；这份日志只从新版开始记，查不清以前的故障。另外两种情况也会停：看不准有没有人在串（查询失败、端口归属冲突），当“说不准”不换；窗口恢复记录坏了（空、全零、格式不对），也停住不换，不拿空白记录顶替，要先留住现场再核对。
6. **电脑这边全正常，还是不能用**｜主机端检查全通过，只说明电脑这边准备好了；真算修好，要拿笔记本或手机实际连一次、断一次，再看主屏和窗口是不是原样。

**不归它管**：Windows 远程桌面、ToDesk 看门狗，见〔电脑配置与恢复〕。

::screen{#sunshine-remote-streaming-04 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题。上半部分一张从左到右的流程图：四个圆角节点（笔记本和手机并排、画 Moonlight 标志；一张绿色网、画 Tailscale 标志；一台机箱、画 Sunshine 标志和一块显卡；两块屏幕，一块实线的物理屏、一块虚线的备用屏），绿色箭头依次连起来，每个节点下面粗体名字加两三行小字。下半部分左边一张卡片“两个自动任务”，画一个小齿轮和一个听诊器；右边一张卡片“模型”，画一个写着 PS 的小方块。",
  "portrait": "竖版：流程图改成从上往下，四个节点一行一个，箭头朝下；“两个自动任务”卡片和“模型”卡片在下面，一行一张。",
  "links": [
   {
    "text": "L28",
    "href": "/rules/charter/#L28",
    "orientations": [
     "v"
    ],
    "locator_instances": {
     "v": {
      "input_sha256": "53b3324d36e8e6dca3bd52b141901f3516a715e49781689930a5d59143cd020a",
      "instances": [
       {
        "context_text": "(后台运行，不弹窗口，约法L28)",
        "context_rect": [
         76,
         1797,
         737,
         1842
        ],
        "expected_rect": [
         597,
         1804,
         720,
         1837
        ],
        "lookup_text": "L28",
        "confirm_region": true,
        "underline_rect": [
         597,
         1844,
         720,
         1849
        ]
       }
      ]
     }
    }
   },
   {
    "text": "远程只让自己连",
    "href": "/skills/tailscale-safe-exposure/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "flow",
    "content_card",
    "bullet_list",
    "icon",
    "inline_link",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "flow",
    "content_card",
    "chapter_title",
    "bullet_list",
    "icon",
    "inline_link",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。上半部分一张从左到右的流程图：四个圆角节点（笔记本和手机并排、画 Moonlight 标志；一张绿色网、画 Tailscale 标志；一台机箱、画 Sunshine 标志和一块显卡；两块屏幕，一块实线的物理屏、一块虚线的备用屏），绿色箭头依次连起来，每个节点下面粗体名字加两三行小字。下半部分左边一张卡片“两个自动任务”，画一个小齿轮和一个听诊器；右边一张卡片“模型”，画一个写着 PS 的小方块。",
    "portrait": "竖版：流程图改成从上往下，四个节点一行一个，箭头朝下；“两个自动任务”卡片和“模型”卡片在下面，一行一张。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "一次连接走的路"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。上半部分一张从左到右的流程图：四个圆角节点（笔记本和手机并排、画 Moonlight 标志；一张绿色网、画 Tailscale 标志；一台机箱、画 Sunshine 标志和一块显卡；两块屏幕，一块实线的物理屏、一块虚线的备用屏），绿色箭头依次连起来，每个节点下面粗体名字加两三行小字。下半部分左边一张卡片“两个自动任务”，画一个小齿轮和一个听诊器；右边一张卡片“模型”，画一个写着 PS 的小方块。",
   "portrait": "竖版：流程图改成从上往下，四个节点一行一个，箭头朝下；“两个自动任务”卡片和“模型”卡片在下面，一行一张。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：它是怎么搭的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "一次连接走的路"
    },
    {
     "type": "flow",
     "columns": 4,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1客户端笔记本：Moonlight；手机：Moonlight或Artemis。配"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "row": "tasks",
     "width": "50%",
     "text_ref": "两个自动任务（后台运行，不弹窗口，约法L28）"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "row": "tasks",
     "width": "50%",
     "text_ref": "模型：运行时没有AI模型，守护、体检、修复都是PowerShell脚本（改窗口和"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n下方两卡标题‘两个自动任务’与‘模型’是 para 中原文，panel 保全文字但尚未从 para 拆出卡头。齿轮/听诊器多图组合与 PS 方块须明确 header_icon 映射。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "下方两卡标题‘两个自动任务’与‘模型’是 para 中原文，panel 保全文字但尚未从 para 拆出卡头。齿轮/听诊器多图组合与 PS 方块须明确 header_icon 映射。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "flow",
    "content_card",
    "bullet_list",
    "icon",
    "inline_link",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "flow",
    "content_card",
    "chapter_title",
    "bullet_list",
    "icon",
    "inline_link",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。上半部分一张从左到右的流程图：四个圆角节点（笔记本和手机并排、画 Moonlight 标志；一张绿色网、画 Tailscale 标志；一台机箱、画 Sunshine 标志和一块显卡；两块屏幕，一块实线的物理屏、一块虚线的备用屏），绿色箭头依次连起来，每个节点下面粗体名字加两三行小字。下半部分左边一张卡片“两个自动任务”，画一个小齿轮和一个听诊器；右边一张卡片“模型”，画一个写着 PS 的小方块。",
    "portrait": "竖版：流程图改成从上往下，四个节点一行一个，箭头朝下；“两个自动任务”卡片和“模型”卡片在下面，一行一张。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "一次连接走的路"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。上半部分一张从左到右的流程图：四个圆角节点（笔记本和手机并排、画 Moonlight 标志；一张绿色网、画 Tailscale 标志；一台机箱、画 Sunshine 标志和一块显卡；两块屏幕，一块实线的物理屏、一块虚线的备用屏），绿色箭头依次连起来，每个节点下面粗体名字加两三行小字。下半部分左边一张卡片“两个自动任务”，画一个小齿轮和一个听诊器；右边一张卡片“模型”，画一个写着 PS 的小方块。",
   "portrait": "竖版：流程图改成从上往下，四个节点一行一个，箭头朝下；“两个自动任务”卡片和“模型”卡片在下面，一行一张。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：它是怎么搭的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "一次连接走的路"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1客户端笔记本：Moonlight；手机：Moonlight或Artemis。配"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "两个自动任务（后台运行，不弹窗口，约法L28）"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "模型：运行时没有AI模型，守护、体检、修复都是PowerShell脚本（改窗口和"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n下方两卡标题‘两个自动任务’与‘模型’是 para 中原文，panel 保全文字但尚未从 para 拆出卡头。齿轮/听诊器多图组合与 PS 方块须明确 header_icon 映射。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "下方两卡标题‘两个自动任务’与‘模型’是 para 中原文，panel 保全文字但尚未从 para 拆出卡头。齿轮/听诊器多图组合与 PS 方块须明确 header_icon 映射。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "客户端｜笔记本：Moonlight；手机：Moonlight 或 Artemis。配对一次就记住，Sunshine 里现在记着 4 个",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/46-地球-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "地球",
   "source_phrase": "Tailscale 私网｜只有加进我这个 Tailscale 网络的设备进得来；能直连就直连，不行才绕中转",
   "sha256": "7569432760a1d9470b9f37fd397942d19413825986d0ccc36764d8012b1325fa",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "Sunshine 2026.516｜开机自启；用 RTX 5090 D 硬件编码，HEVC、AV1 都支持 10 位画面（HDR）；编码预设 P5（7 档里偏画质的一档），开了空间自适应量化（暗部和细节更干净）；它自带的“连上时自动改显示设置”全部关掉",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "抓哪块屏｜配置里只写一块。主屏：真显卡输出、带显示器身份信息的物理屏；备用屏：MTT 虚拟显示驱动造的屏，默认 2880×1800、60 Hz、150% 缩放、HDR",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "串流画面切换：我登录后启动，一直跑，每 3 秒看一次屏幕和连接，每 10 秒写一次心跳（证明自己还活着的记录）；挂了 1 分钟后自己重开，同一时间只跑一份",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "远程串流体检：每天 14:30，查 Tailscale 在不在线、无人值守开没开、编码能力、Tailscale 的公开功能（Funnel，能把本机服务公开到互联网）有没有公开 Sunshine；3 分钟内做完，写一行回执",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：它是怎么搭的

**一次连接走的路**
1. **客户端**｜笔记本：Moonlight；手机：Moonlight 或 Artemis。配对一次就记住，Sunshine 里现在记着 5 个（10 月 22 日读，只数配对记录，不列设备名）
2. **Tailscale 私网**｜只有加进我这个 Tailscale 网络的设备进得来；能直连就直连，不行才绕中转
3. **Sunshine 2026.516**｜开机自启；用 RTX 5090 D 硬件编码，HEVC、AV1 都支持 10 位画面（HDR）；编码预设 P5（7 档里偏画质的一档），开了空间自适应量化（暗部和细节更干净）；它自带的“连上时自动改显示设置”全部关掉
4. **抓哪块屏**｜配置里只写一块。主屏：真显卡输出、带显示器身份信息的物理屏；备用屏：MTT 虚拟显示驱动造的屏，默认 2880×1800、60 Hz、150% 缩放、HDR

**两个自动任务**（后台运行，不弹窗口，约法〔L28〕）
- **串流画面切换**：我登录后启动，一直跑，每 3 秒看一次屏幕和连接，每 10 秒写一次心跳（证明自己还活着的记录）；挂了 1 分钟后自己重开，同一时间只跑一份
- **远程串流体检**：每天 14:30，查 Tailscale 在不在线、无人值守开没开、编码能力、Tailscale 的公开功能（Funnel，能把本机服务公开到互联网）有没有公开 Sunshine；3 分钟内做完，写一行回执

**模型**：运行时没有 AI 模型，守护、体检、修复都是 PowerShell 脚本（改窗口和显示设置用内嵌的 C# 调 Windows 接口）。AI 只在我说“串流有问题”时来查、来修；查线路时用〔远程只让自己连〕技能，它先读这个项目的规矩再动手。

::screen{#sunshine-remote-streaming-05 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-05",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一个挂在门把手上的小牌子、一枚指纹、一块被玻璃罩罩住的显示器、一个合上的闸门、一个往回的箭头、一本合上的日志本），每张粗体一句＋两三行小字；右边约三分之一宽，竖着三张大数字卡。",
  "portrait": "竖版：标题在上；六张卡片一行一张；三张数字卡在最下，一行一张。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "icon",
    "stat_card",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "stat_card",
    "chapter_title",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一个挂在门把手上的小牌子、一枚指纹、一块被玻璃罩罩住的显示器、一个合上的闸门、一个往回的箭头、一本合上的日志本），每张粗体一句＋两三行小字；右边约三分之一宽，竖着三张大数字卡。",
    "portrait": "竖版：标题在上；六张卡片一行一张；三张数字卡在最下，一行一张。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之二宽，六张横向小卡片两列三行（小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一个挂在门把手上的小牌子、一枚指纹、一块被玻璃罩罩住的显示器、一个合上的闸门、一个往回的箭头、一本合上的日志本），每张粗体一句＋两三行小字；右边约三分之一宽，竖着三张大数字卡。",
   "portrait": "竖版：标题在上；六张卡片一行一张；三张数字卡在最下，一行一张。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：为什么这样设计"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1只在没人连着时换屏。换屏要重启Sunshine，连着的人会被踢掉，所以只在没人",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "大数字卡："
    },
    {
     "type": "stat_card",
     "columns": 3,
     "columns_v": 1,
     "icons": "none",
     "text_ref": "5,815行程序（PowerShell，含内嵌C#和小启动脚本；不含空行"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n左六卡/右三张数字卡保持 67:33；六张卡的门牌/指纹/玻璃罩屏/闸门/回箭/日志本需要语义素材映射。原‘大数字卡：’节点是正文，不能为版式删掉。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 1 项，文字盘点预算 6 个图标位；差 5 个候选位（预算为盘点估计，不作已核实语义结论）。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "左六卡/右三张数字卡保持 67:33；六张卡的门牌/指纹/玻璃罩屏/闸门/回箭/日志本需要语义素材映射。原‘大数字卡：’节点是正文，不能为版式删掉。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 1 项，文字盘点预算 6 个图标位；差 5 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "icon",
    "stat_card",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "stat_card",
    "chapter_title",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一个挂在门把手上的小牌子、一枚指纹、一块被玻璃罩罩住的显示器、一个合上的闸门、一个往回的箭头、一本合上的日志本），每张粗体一句＋两三行小字；右边约三分之一宽，竖着三张大数字卡。",
    "portrait": "竖版：标题在上；六张卡片一行一张；三张数字卡在最下，一行一张。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之二宽，六张横向小卡片两列三行（小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一个挂在门把手上的小牌子、一枚指纹、一块被玻璃罩罩住的显示器、一个合上的闸门、一个往回的箭头、一本合上的日志本），每张粗体一句＋两三行小字；右边约三分之一宽，竖着三张大数字卡。",
   "portrait": "竖版：标题在上；六张卡片一行一张；三张数字卡在最下，一行一张。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：为什么这样设计"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1只在没人连着时换屏。换屏要重启Sunshine，连着的人会被踢掉，所以只在没人"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "大数字卡："
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "icons": "none",
     "text_ref": "5,815行程序（PowerShell，含内嵌C#和小启动脚本；不含空行"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n左六卡/右三张数字卡保持 67:33；六张卡的门牌/指纹/玻璃罩屏/闸门/回箭/日志本需要语义素材映射。原‘大数字卡：’节点是正文，不能为版式删掉。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 1 项，文字盘点预算 6 个图标位；差 5 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "左六卡/右三张数字卡保持 67:33；六张卡的门牌/指纹/玻璃罩屏/闸门/回箭/日志本需要语义素材映射。原‘大数字卡：’节点是正文，不能为版式删掉。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 1 项，文字盘点预算 6 个图标位；差 5 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "一个挂在门把手上的小牌子",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一枚指纹",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显示器",
   "source_phrase": "一块被玻璃罩罩住的显示器",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "一个合上的闸门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个往回的箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "一本合上的日志本",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-9ce99a7f5a6a4d1b80fa.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：为什么这样设计

1. **只在没人连着时换屏。**｜换屏要重启 Sunshine，连着的人会被踢掉，所以只在没人连着时换；具体怎么等、怎么撤回，见下一屏。“没人连着”不只看 TCP 连接：Moonlight 建好连接后可以关掉 RTSP 的 TCP，画面照走 UDP，所以视频、控制、音频的 UDP 端点还在也算有人在串；查不清就当说不准，不换。
2. **认屏靠硬件身份，不靠“第几块屏”。**｜Windows 给显示器排的 1、2、3 号会变。主屏要有真显卡输出和显示器身份信息；备用屏必须正好是那一块虚拟驱动造的屏。认不准就不动，也不猜。往备用屏搬窗也一样：只用当前证明在线的主屏区域，或之前记下的主屏区域当“从哪搬”；都没有就不搬，不拿备用屏自己的区域冒充主屏（10 月 22 日源码，10 月 26 日起运行的守护已加载）。
3. **真显示器一概不碰。**｜连上、断开、换屏，都不关、不停用、不重排任何物理显示器，也不碰水冷屏和机箱小屏；能动的只有“Sunshine 抓哪块屏”和普通窗口的位置。
4. **显卡刚出过错，就不自动动显示。**｜最近 15 分钟里有显卡驱动出错、显卡内核错误或蓝屏的记录，就不自动换屏、不改备用屏设置；查询出错也当有记录。连续 15 分钟没有新故障，再核对一遍屏的身份和连接，就自己恢复。“上次没正常关机”只记下来备查、不挡：Windows 要到下一次开机才记它，拿它挡，一次强制重启就会让整次开机都不换屏。只放行一种动作：把窗口从备用屏搬回主屏，免得窗口困在虚拟屏上。
5. **能退回，但不硬退。**｜改配置先比对文件指纹（确认没被别人改过）再整份替换，留一份备份；Sunshine 重启失败要换回原配置时，再比一次：文件还是这次写进去的那份才换回，中途被别人改过就拒绝覆盖、报错留给人看，所以不是任何情况都能自动退回。窗口恢复记录也这样：先写候选文件、读回验证再替换，旁边留一份上一次的有效记录；记录坏了就停住自动切换，不拿默认值盖掉。修网络、改备用屏也一样：默认只出计划，改前存原样，失败倒着退回。
6. **日志不记私事，凭据不进仓库。**｜窗口出错只记窗口编号、进程号和错误码，不记窗口标题和程序路径；凭据只放密码中心，不进仓库也不进日志。10 月 27 日起项目规矩改了：私有仓库可以原样保存普通的网络配置和设备信息，不必为隐私删掉；这些仍然不放到公开网站上。

大数字卡：
**5,815 行**｜程序（PowerShell，含内嵌 C# 和小启动脚本；不含空行；10 月 30 日 11:06 统计）
**2,113 行**｜测试（不含空行，10 月 22 日早上统计），分 6 组；“展开后共 194 项”是 10 月 10 日前的数，这次没重数；“10 月 10 日重跑全部通过”没找到原始记录，本轮没有重跑，最近有回执的是 9 月 18 日
**48 次**｜提交（6 月 26 日起，10 月 30 日 11:06 数）

::screen{#sunshine-remote-streaming-06 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-06",
  "section": "tech",
  "title": "还在等核对的两招",
  "scene": "横版：左上标题，标题下一行说明小字。两张竖向大卡片左右并排，每张上面一幅小水彩插画，卡片标题用大字，标题右边一个黄色或浅灰小圆点加状态字，下面一段正文。插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
  "portrait": "竖版：标题和说明在上；两张卡片上下排，一行一张，插画在每张卡片顶部。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "content_card",
    "illustration",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "illustration",
    "chapter_title",
    "prose",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题，标题下一行说明小字。两张竖向大卡片左右并排，每张上面一幅小水彩插画，卡片标题用大字，标题右边一个黄色或浅灰小圆点加状态字，下面一段正文。插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
    "portrait": "竖版：标题和说明在上；两张卡片上下排，一行一张，插画在每张卡片顶部。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左右并排，每张上面一幅小水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题，标题下一行说明小字。两张竖向大卡片左右并排，每张上面一幅小水彩插画，卡片标题用大字，标题右边一个黄色或浅灰小圆点加状态字，下面一段正文。插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
   "portrait": "竖版：标题和说明在上；两张卡片上下排，一行一张，插画在每张卡片顶部。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：还在等核对的两招"
    },
    {
     "type": "prose",
     "text_ref": "说明：这两件都做成了，还没在真实使用里完整验过：换屏要等我实际连一次、断一次；直连要等手机在外面用流量时查一次线路。验过再挪进亮点。"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "row": "pending",
     "width": "50%",
     "text_ref": "1换屏不踢掉正在用的人●待验收",
     "illustration_asset": [
      "_library/illustrations/显示屏切换.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "row": "pending",
     "width": "50%",
     "text_ref": "2三层地址转换下，给手机打通IPv6这条路●说不准",
     "illustration_asset": [
      "_library/illustrations/三层网络墙.png"
     ]
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n两张大卡的 top_inside 大插画未由普通 source_text_card 支持；要求暗屏/备用屏/连线门牌及三墙/IPv6丝带/问号两图。\n单条 steps 的功能名/状态标记需提升为卡头同行（待验收黄点、说不准浅灰点加状态字）；source_text_card 不支持步骤卡头提取，先保留所有原字。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：还在等核对的两招；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 2 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "两张大卡的 top_inside 大插画未由普通 source_text_card 支持；要求暗屏/备用屏/连线门牌及三墙/IPv6丝带/问号两图。",
    "单条 steps 的功能名/状态标记需提升为卡头同行（待验收黄点、说不准浅灰点加状态字）；source_text_card 不支持步骤卡头提取，先保留所有原字。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：还在等核对的两招；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 2 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 2,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "content_card",
    "illustration",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "content_card",
    "illustration",
    "chapter_title",
    "prose",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：左上标题，标题下一行说明小字。两张竖向大卡片左右并排，每张上面一幅小水彩插画，卡片标题用大字，标题右边一个黄色或浅灰小圆点加状态字，下面一段正文。插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
    "portrait": "竖版：标题和说明在上；两张卡片上下排，一行一张，插画在每张卡片顶部。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左右并排，每张上面一幅小水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题，标题下一行说明小字。两张竖向大卡片左右并排，每张上面一幅小水彩插画，卡片标题用大字，标题右边一个黄色或浅灰小圆点加状态字，下面一段正文。插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
   "portrait": "竖版：标题和说明在上；两张卡片上下排，一行一张，插画在每张卡片顶部。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：还在等核对的两招"
    },
    {
     "type": "prose",
     "text_ref": "说明：这两件都做成了，还没在真实使用里完整验过：换屏要等我实际连一次、断一次；直连要等手机在外面用流量时查一次线路。验过再挪进亮点。"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "text_ref": "1换屏不踢掉正在用的人●待验收",
     "illustration_asset": [
      "_library/illustrations/显示屏切换.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "text_ref": "2三层地址转换下，给手机打通IPv6这条路●说不准",
     "illustration_asset": [
      "_library/illustrations/三层网络墙.png"
     ]
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n两张大卡的 top_inside 大插画未由普通 source_text_card 支持；要求暗屏/备用屏/连线门牌及三墙/IPv6丝带/问号两图。\n单条 steps 的功能名/状态标记需提升为卡头同行（待验收黄点、说不准浅灰点加状态字）；source_text_card 不支持步骤卡头提取，先保留所有原字。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：还在等核对的两招；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 2 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "两张大卡的 top_inside 大插画未由普通 source_text_card 支持；要求暗屏/备用屏/连线门牌及三墙/IPv6丝带/问号两图。",
    "单条 steps 的功能名/状态标记需提升为卡头同行（待验收黄点、说不准浅灰点加状态字）；source_text_card 不支持步骤卡头提取，先保留所有原字。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：还在等核对的两招；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 2 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 2,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/显示屏切换.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "显示屏切换",
   "source_phrase": "插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
   "sha256": "72aae5dbbea0dc2a8697b682451f4455c6a9ba63b3df152af71e551d9c96022b",
   "status": "ready",
   "original_elements": [
    "一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/三层网络墙.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "三层网络墙",
   "source_phrase": "插画：1 一块暗掉的显示器和一块虚线备用屏，几个小窗口沿弧线飘过去，旁边门把手上挂着一块画着手机的小牌子（表示有人连着就不动）；2 三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条）。",
   "sha256": "ea00de849fd65ee377bbd06e6a3af4056c076d73e0d8f0fe1c7415f1d429a3f0",
   "status": "ready",
   "original_elements": [
    "三道叠在一起的小墙（三层地址转换），一条绿色丝带从墙顶上越过，一头连手机、一头连小房子，丝带中间画一个小问号（还没查过手机走不走这条"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/显示屏切换.png",
   "fallback": false,
   "key": "显示屏切换",
   "source_phrase": "1换屏不踢掉正在用的人●待验收\n主屏一关，Windows的桌面就落到别的屏上，Sunshine却还按配置去抓主屏；可要换，就得重启Sunshine，正连着的人会被踢掉。做法：主屏消失满15秒才算真的不在；再等连续5秒没人连着，才让Sunshine改抓备用屏，把主屏上的普通窗口按原来的相对位置搬过去、记下原位；写配置前、重启后、搬窗口前还要各查一次，中途有人连进来就撤回、等下一轮。主屏回来满1秒先把窗口搬回，满5秒再换回抓主屏。8月12日至9月3日它自动换了27次；9月29日01:27新的安全闸一生效，它又自己换到备用屏、搬过去9个窗口。主机这边查过是好的，但哪一次都没有我连着手机核对过的记录，客户端看到的画面还待我连一次。",
   "sha256": "72aae5dbbea0dc2a8697b682451f4455c6a9ba63b3df152af71e551d9c96022b",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/三层网络墙.png",
   "fallback": false,
   "key": "三层网络墙",
   "source_phrase": "2三层地址转换下，给手机打通IPv6这条路●说不准\n家里是移动宽带：运营商、光猫、路由器三层地址转换，没有公网IPv4，手机在外面用流量时两边打不通，只能绕Tailscale在东京、香港的中转服务器，又卡又容易断。6月26日的做法：光猫改成IPv4、IPv6双栈并重启重新拨号，主机重新打开网卡的IPv6，两边都拿到公网IPv6，Tailscale就能直接连上，占带宽的画面在国内网里走。打通后又踩一坑：Tailscale改走IPv6去连它在国外的登录服务器，被挡，掉了登录；当时给它单独配了代理，8月6日改成跟着系统当前的网络走。家里上行约32Mbps，当时定下在外面用1080p或1440p、60帧、18–20Mbps、AV1、固定码率。\n现在：9月28日主机有4个公网IPv6；手机实际走不走直连，没有查过的记录。",
   "sha256": "ea00de849fd65ee377bbd06e6a3af4056c076d73e0d8f0fe1c7415f1d429a3f0",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/显示屏切换.png",
   "fallback": false,
   "key": "显示屏切换",
   "source_phrase": "1换屏不踢掉正在用的人●待验收\n主屏一关，Windows的桌面就落到别的屏上，Sunshine却还按配置去抓主屏；可要换，就得重启Sunshine，正连着的人会被踢掉。做法：主屏消失满15秒才算真的不在；再等连续5秒没人连着，才让Sunshine改抓备用屏，把主屏上的普通窗口按原来的相对位置搬过去、记下原位；写配置前、重启后、搬窗口前还要各查一次，中途有人连进来就撤回、等下一轮。主屏回来满1秒先把窗口搬回，满5秒再换回抓主屏。8月12日至9月3日它自动换了27次；9月29日01:27新的安全闸一生效，它又自己换到备用屏、搬过去9个窗口。主机这边查过是好的，但哪一次都没有我连着手机核对过的记录，客户端看到的画面还待我连一次。",
   "sha256": "72aae5dbbea0dc2a8697b682451f4455c6a9ba63b3df152af71e551d9c96022b",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/三层网络墙.png",
   "fallback": false,
   "key": "三层网络墙",
   "source_phrase": "2三层地址转换下，给手机打通IPv6这条路●说不准\n家里是移动宽带：运营商、光猫、路由器三层地址转换，没有公网IPv4，手机在外面用流量时两边打不通，只能绕Tailscale在东京、香港的中转服务器，又卡又容易断。6月26日的做法：光猫改成IPv4、IPv6双栈并重启重新拨号，主机重新打开网卡的IPv6，两边都拿到公网IPv6，Tailscale就能直接连上，占带宽的画面在国内网里走。打通后又踩一坑：Tailscale改走IPv6去连它在国外的登录服务器，被挡，掉了登录；当时给它单独配了代理，8月6日改成跟着系统当前的网络走。家里上行约32Mbps，当时定下在外面用1080p或1440p、60帧、18–20Mbps、AV1、固定码率。\n现在：9月28日主机有4个公网IPv6；手机实际走不走直连，没有查过的记录。",
   "sha256": "ea00de849fd65ee377bbd06e6a3af4056c076d73e0d8f0fe1c7415f1d429a3f0",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-1251a0366d197dc70ab3.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-1251a0366d197dc70ab3",
   "title_text": "还在等核对的两招",
   "sha256": "8846ad26f75e4aeb104d53299b7a25637fc0222a6accc57543018d50b3b2be0a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：还在等核对的两招

说明：这两件都做成了，还没在真实使用里完整验过：换屏要等我实际连一次、断一次；直连要等手机在外面用流量时查一次线路。验过再挪进亮点。

1. **换屏不踢掉正在用的人**　● 待验收
主屏一关，Windows 的桌面就落到别的屏上，Sunshine 却还按配置去抓主屏；可要换，就得重启 Sunshine，正连着的人会被踢掉。做法：主屏消失满 15 秒才算真的不在；再等连续 5 秒没人连着，才让 Sunshine 改抓备用屏，把主屏上的普通窗口按原来的相对位置搬过去、记下原位；写配置前、重启后、搬窗口前还要各查一次，中途有人连进来就撤回、等下一轮。“有人连着”看 RTSP 的 TCP 连接和 Sunshine 的 UDP 串流端点两样，10 月 3 日起 UDP 也算；查询失败或认不准就不换。主屏回来满 1 秒先把窗口搬回，满 5 秒再换回抓主屏。8 月 12 日至 9 月 3 日它自动换了 27 次；9 月 29 日 01:27 新的安全闸一生效，它又自己换到备用屏、搬过去 9 个窗口；之后又多出 3 份配置备份（文件名上的日期是 10 月 7 日到 9 日），不一定都是自动换屏。主机这边查过是好的，但哪一次都没有我连着手机核对过的记录，客户端看到的画面还待我连一次。10 月 11 日 13:33 主机体检报过阻塞：配置要抓的屏在当时活动的屏里找不到对应的一个，守护在等串流空闲（当时主机侧看到 3 个 UDP 串流端点、0 个 TCP 连接，3 个端点不是 3 个客户端）。10 月 20 日 7:35—7:38 和 10 月 30 日 11:10 守护的记录都是：当前抓虚拟备用屏、配置要抓的屏在线、没有阻塞；这只是主机这边的状态，不是一次换屏验收，客户端画面仍是“不知道”。

2. **三层地址转换下，给手机打通 IPv6 这条路**　● 说不准
家里是移动宽带：运营商、光猫、路由器三层地址转换，没有公网 IPv4，手机在外面用流量时两边打不通，只能绕 Tailscale 在东京、香港的中转服务器，又卡又容易断。6 月 26 日的做法：光猫改成 IPv4、IPv6 双栈并重启重新拨号，主机重新打开网卡的 IPv6，两边都拿到公网 IPv6，Tailscale 就能直接连上，占带宽的画面在国内网里走。打通后又踩一坑：Tailscale 改走 IPv6 去连它在国外的登录服务器，被挡，掉了登录；当时给它单独配了代理，8 月 6 日改成跟着系统当前的网络走。家里上行约 32 Mbps，当时定下在外面用 1080p 或 1440p、60 帧、18–20 Mbps、AV1、固定码率。
现在：10 月 8 日两台电脑的代理软件都让 Tailscale 的 UDP 流量绕开代理直连，之后同一网络下直连约 5–9 毫秒，我确认画面和操作正常，用手机热点连续用了 5 分钟没断。手机在外面用流量时实际走不走 IPv6 直连、延迟多少，还没查过；主机的公网 IPv6 9 月 28 日记为 4 个，之后未重新核对。

::screen{#sunshine-remote-streaming-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：左上标题。一张横跨整屏的大卡片：左边约三分之一一幅水彩插画——一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门；右边约三分之二是卡片标题（大字）和正文。",
  "portrait": "竖版：标题在上；插画在卡片顶部占满宽度，下面卡片标题和正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose"
   ],
   "portrait_component_order": [
    "illustration",
    "content_card",
    "prose",
    "chapter_title"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。一张横跨整屏的大卡片：左边约三分之一一幅水彩插画——一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门；右边约三分之二是卡片标题（大字）和正文。",
    "portrait": "竖版：标题在上；插画在卡片顶部占满宽度，下面卡片标题和正文。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "一份被反复重交的报告，把自动换屏锁了近三周。"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之一一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。一张横跨整屏的大卡片：左边约三分之一一幅水彩插画——一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门；右边约三分之二是卡片标题（大字）和正文。",
   "portrait": "竖版：标题在上；插画在卡片顶部占满宽度，下面卡片标题和正文。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：亮点"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "text_ref": "一份被反复重交的报告，把自动换屏锁了近三周。",
     "illustration_asset": [
      "_library/illustrations/文稿核验通用构图-bright-green-20261022.png"
     ]
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n亮点要求一张大外卡、左1/3插画右2/3全文，竖版图在卡顶；普通 source_text_card 目前 only bottom_inside，left_inside/top_inside 没有相应主图实现。需报告纸/开闸钥匙的明确大插画，不能静默认作已复原。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：亮点；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "亮点要求一张大外卡、左1/3插画右2/3全文，竖版图在卡顶；普通 source_text_card 目前 only bottom_inside，left_inside/top_inside 没有相应主图实现。需报告纸/开闸钥匙的明确大插画，不能静默认作已复原。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：亮点；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose"
   ],
   "portrait_component_order": [
    "illustration",
    "content_card",
    "prose",
    "chapter_title"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。一张横跨整屏的大卡片：左边约三分之一一幅水彩插画——一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门；右边约三分之二是卡片标题（大字）和正文。",
    "portrait": "竖版：标题在上；插画在卡片顶部占满宽度，下面卡片标题和正文。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "一份被反复重交的报告，把自动换屏锁了近三周。"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之一一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。一张横跨整屏的大卡片：左边约三分之一一幅水彩插画——一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门；右边约三分之二是卡片标题（大字）和正文。",
   "portrait": "竖版：标题在上；插画在卡片顶部占满宽度，下面卡片标题和正文。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：亮点"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "text_ref": "一份被反复重交的报告，把自动换屏锁了近三周。",
     "illustration_asset": [
      "_library/illustrations/文稿核验通用构图-bright-green-20261022.png"
     ]
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n亮点要求一张大外卡、左1/3插画右2/3全文，竖版图在卡顶；普通 source_text_card 目前 only bottom_inside，left_inside/top_inside 没有相应主图实现。需报告纸/开闸钥匙的明确大插画，不能静默认作已复原。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：亮点；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "亮点要求一张大外卡、左1/3插画右2/3全文，竖版图在卡顶；普通 source_text_card 目前 only bottom_inside，left_inside/top_inside 没有相应主图实现。需报告纸/开闸钥匙的明确大插画，不能静默认作已复原。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：亮点；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {},
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/文稿核验通用构图-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文稿核验通用构图",
   "source_phrase": "一张横跨整屏的大卡片：左边约三分之一一幅水彩插画——一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门；右边约三分之二是卡片标题（大字）和正文。",
   "sha256": "5ab5d727ebd3989c5b1e52da63351021f9c6dfb0807578c5e82d78525913a406",
   "status": "ready",
   "original_elements": [
    "一沓一模一样的纸（同一份报告被一次次重交），上面盖着红色印章，旁边一把钥匙正在打开一个闸门"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/文稿核验通用构图-bright-green-20261022.png",
   "fallback": false,
   "key": "文稿核验通用构图",
   "source_phrase": "一份被反复重交的报告，把自动换屏锁了近三周。\n9月4日补全显卡安全闸时，把Windows错误报告里正文带“BugCheck”（蓝屏的代号）字样的也算成显卡出错。从那天到9月26日，自动换屏一次都没再发生。9月18日查到闸关着、数出14份“显卡故障报告”，当时只记下“14份不等于崩了14次”。\n9月26日查清：备用屏驱动有一份自检失败的报告，一直排在Windows错误报告等着上交的队列里，它记的源文件名里带bugcheck；每当别的程序崩溃、Windows往上交报告时，这份旧报告也跟着再交一次，每交一次就被当成一次新的显卡故障。\n改法：只看报告里写明类型的那几栏（是蓝屏、显卡驱动出错，还是驱动自检），不再搜正文里有没有某个词；同一份报告按编号只算一次；驱动自检报告不算。截至9月28日21:11，9月27日晚这次开机以来的18份这类报告都被正确略过。\n不过9月27日晚电脑卡死、强制重启后，“上次没正常关机”的记录又让闸关了整整一次开机。9月29日再改：这条记录只留作备查，闸只看最近15分钟有没有真的显卡或显示故障，安静满15分钟自己恢复；改完当晚01:27，守护就自己换到了备用屏。",
   "sha256": "5ab5d727ebd3989c5b1e52da63351021f9c6dfb0807578c5e82d78525913a406",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/文稿核验通用构图-bright-green-20261022.png",
   "fallback": false,
   "key": "文稿核验通用构图",
   "source_phrase": "一份被反复重交的报告，把自动换屏锁了近三周。\n9月4日补全显卡安全闸时，把Windows错误报告里正文带“BugCheck”（蓝屏的代号）字样的也算成显卡出错。从那天到9月26日，自动换屏一次都没再发生。9月18日查到闸关着、数出14份“显卡故障报告”，当时只记下“14份不等于崩了14次”。\n9月26日查清：备用屏驱动有一份自检失败的报告，一直排在Windows错误报告等着上交的队列里，它记的源文件名里带bugcheck；每当别的程序崩溃、Windows往上交报告时，这份旧报告也跟着再交一次，每交一次就被当成一次新的显卡故障。\n改法：只看报告里写明类型的那几栏（是蓝屏、显卡驱动出错，还是驱动自检），不再搜正文里有没有某个词；同一份报告按编号只算一次；驱动自检报告不算。截至9月28日21:11，9月27日晚这次开机以来的18份这类报告都被正确略过。\n不过9月27日晚电脑卡死、强制重启后，“上次没正常关机”的记录又让闸关了整整一次开机。9月29日再改：这条记录只留作备查，闸只看最近15分钟有没有真的显卡或显示故障，安静满15分钟自己恢复；改完当晚01:27，守护就自己换到了备用屏。",
   "sha256": "5ab5d727ebd3989c5b1e52da63351021f9c6dfb0807578c5e82d78525913a406",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：亮点

**一份被反复重交的报告，把自动换屏锁了近三周。**
9 月 4 日补全显卡安全闸时，把 Windows 错误报告里正文带“BugCheck”（蓝屏的代号）字样的也算成显卡出错。从那天到 9 月 26 日，自动换屏一次都没再发生。9 月 18 日查到闸关着、数出 14 份“显卡故障报告”，当时只记下“14 份不等于崩了 14 次”。
9 月 26 日查清：备用屏驱动有一份自检失败的报告，一直排在 Windows 错误报告等着上交的队列里，它记的源文件名里带 bugcheck；每当别的程序崩溃、Windows 往上交报告时，这份旧报告也跟着再交一次，每交一次就被当成一次新的显卡故障。
改法：只看报告里写明类型的那几栏（是蓝屏、显卡驱动出错，还是驱动自检），不再搜正文里有没有某个词；同一份报告按编号只算一次；驱动自检报告不算。截至 9 月 28 日 21:11，9 月 27 日晚这次开机以来的 18 份这类报告都被正确略过。
不过 9 月 27 日晚电脑卡死、强制重启后，“上次没正常关机”的记录又让闸关了整整一次开机。9 月 29 日再改：这条记录只留作备查，闸只看最近 15 分钟有没有真的显卡或显示故障，安静满 15 分钟自己恢复；改完当晚 01:27，守护就自己换到了备用屏。

::screen{#sunshine-remote-streaming-08 section="features"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
  "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
  "links": [],
  "anchors": [
   {
    "id": "g-connect",
    "text": "连接和画面"
   },
   {
    "id": "f-desktop",
    "text": "远程桌面"
   },
   {
    "id": "f-tailnet",
    "text": "只走自己的私网"
   },
   {
    "id": "f-ipv6-direct",
    "text": "手机在外直连"
   },
   {
    "id": "f-codec",
    "text": "高画质编码"
   },
   {
    "id": "f-always-on",
    "text": "开机就能连"
   },
   {
    "id": "g-fallback",
    "text": "主屏不在时"
   },
   {
    "id": "f-vdd",
    "text": "虚拟备用屏"
   },
   {
    "id": "f-capture-switch",
    "text": "自动换画面"
   },
   {
    "id": "f-window-move",
    "text": "窗口搬过去"
   },
   {
    "id": "f-window-return",
    "text": "窗口搬回来"
   },
   {
    "id": "f-vdd-settings",
    "text": "备用屏设置"
   },
   {
    "id": "f-vdd-bind",
    "text": "备用屏接进 Sunshine"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "srs-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "status_legend",
    "section_heading",
    "feature_card",
    "icon"
   ],
   "portrait_component_order": [
    "section_heading",
    "status_legend",
    "chapter_title",
    "feature_card",
    "icon"
   ],
   "source_layout": {
    "desktop": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
    "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "连接和画面",
     "主屏不在时"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
   "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：全部功能（23项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用",
     "align": "left",
     "size": "small"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "连接和画面",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1远程桌面笔记本用Moonlight、手机用Moonlight或Artemis连"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "主屏不在时",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "6虚拟备用屏MTT虚拟显示驱动造的一块屏：2880×1800、60Hz、150%"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n状态列已解析为 cols、颜色可识别；源图要求仅圆点，当前 feature_card 仍画原状态文字。需明确 data-text 圆点模式通过逐字关后再落实。\n连续两张拼成同一个无上下边框网格；主引擎没有跨逻辑屏共享网格/省略上下卡边接口。小号毛笔组名的 size 字段 core 不消费。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：全部功能（23项）、连接和画面、主屏不在时；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 5 项，文字盘点预算 11 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "状态列已解析为 cols、颜色可识别；源图要求仅圆点，当前 feature_card 仍画原状态文字。需明确 data-text 圆点模式通过逐字关后再落实。",
    "连续两张拼成同一个无上下边框网格；主引擎没有跨逻辑屏共享网格/省略上下卡边接口。小号毛笔组名的 size 字段 core 不消费。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：全部功能（23项）、连接和画面、主屏不在时；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 5 项，文字盘点预算 11 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 5
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 11,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "chapter_title",
    "status_legend",
    "section_heading",
    "feature_card",
    "icon"
   ],
   "portrait_component_order": [
    "section_heading",
    "status_legend",
    "chapter_title",
    "feature_card",
    "icon"
   ],
   "source_layout": {
    "desktop": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
    "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "连接和画面",
     "主屏不在时"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
   "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：全部功能（23项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用",
     "align": "left",
     "size": "small"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "连接和画面",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "1远程桌面笔记本用Moonlight、手机用Moonlight或Artemis连"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "主屏不在时",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "6虚拟备用屏MTT虚拟显示驱动造的一块屏：2880×1800、60Hz、150%"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n状态列已解析为 cols、颜色可识别；源图要求仅圆点，当前 feature_card 仍画原状态文字。需明确 data-text 圆点模式通过逐字关后再落实。\n连续两张拼成同一个无上下边框网格；主引擎没有跨逻辑屏共享网格/省略上下卡边接口。小号毛笔组名的 size 字段 core 不消费。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：全部功能（23项）、连接和画面、主屏不在时；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 5 项，文字盘点预算 11 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "状态列已解析为 cols、颜色可识别；源图要求仅圆点，当前 feature_card 仍画原状态文字。需明确 data-text 圆点模式通过逐字关后再落实。",
    "连续两张拼成同一个无上下边框网格；主引擎没有跨逻辑屏共享网格/省略上下卡边接口。小号毛笔组名的 size 字段 core 不消费。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：全部功能（23项）、连接和画面、主屏不在时；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 5 项，文字盘点预算 11 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 5
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 11,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机点桌面.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机点桌面",
   "source_phrase": "远程桌面｜笔记本用 Moonlight、手机用 Moonlight 或 Artemis 连主机，看整个桌面、直接操作｜在用",
   "sha256": "619cf0826fbe681d5a6ba825c5cd8caff76ae282f27a3fbde93602d3fa956fb1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/46-地球-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "地球",
   "source_phrase": "只走自己的私网｜在外面经 Tailscale 连回家，只有加进我这个网络的设备进得来；Tailscale 的公开功能（Funnel）没公开 Sunshine｜在用",
   "sha256": "7569432760a1d9470b9f37fd397942d19413825986d0ccc36764d8012b1325fa",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "手机在外直连｜两边都用公网 IPv6 直接连，不绕海外中转；6 月打通，现在手机实际走哪条没有记录｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "高画质编码｜RTX 5090 D 硬件编码，HEVC、AV1 都支持 10 位画面（HDR）；预设 P5，开空间自适应量化｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "开机就能连｜Sunshine、Tailscale 开机自动启动；Tailscale 设成没登录 Windows 也在线｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显示器",
   "source_phrase": "虚拟备用屏｜MTT 虚拟显示驱动造的一块屏：2880×1800、60 Hz、150% 缩放、HDR；主屏关着时它就是桌面｜在用",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "自动换画面｜主屏消失满 15 秒、又连续 5 秒没人连着，才把 Sunshine 换去抓备用屏；主屏回来满 5 秒再换回｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "窗口搬过去｜换到备用屏时，主屏上的普通窗口按原来的相对位置搬过去，并记下每个窗口的原位｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "窗口搬回来｜主屏回来满 1 秒就把窗口搬回原位；备用屏期间新开的窗口也挪到主屏｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "备用屏设置｜改分辨率、刷新率、缩放、HDR；默认只预览，确认才改；上次真改是 9 月 2 日｜在用",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "备用屏接进 Sunshine｜按备用屏的硬件身份算出 Sunshine 认的屏编号写进配置；8 月 11 日装备用屏时用过｜在用",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-410efe73a6bd515b74d2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-410efe73a6bd515b74d2",
   "title_text": "主屏不在时",
   "sha256": "49a33b9237c16d769b1ac822e9d538789fd4cf6e90f917b69f63b46442175b72",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-8dee835cbf8f2e59c8ed.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-8dee835cbf8f2e59c8ed",
   "title_text": "全部功能（23 项）",
   "sha256": "c8d9777168b4d357cd37a882f4977a943f63200cdbda6a8ae47b03eb6a1b7935",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-30cbcef1875f1224a51f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-30cbcef1875f1224a51f",
   "title_text": "连接和画面",
   "sha256": "df50eb62ad739c7b23883d3beead72e02419323cb0de4a0a7a4c5e31e6cdd1af",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：全部功能（23 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**连接和画面**
1. 远程桌面｜笔记本用 Moonlight、手机用 Moonlight 或 Artemis 连主机，看整个桌面、直接操作；10 月 8 日同一网络和手机热点下真人用过，画面和操作正常｜在用
2. 只走自己的私网｜在外面经 Tailscale 连回家，只有加进我这个网络的设备进得来；Tailscale 的公开功能（Funnel）没公开 Sunshine｜在用
3. 手机在外直连｜两边都用公网 IPv6 直接连，不绕海外中转；6 月打通，10 月 8 日让 Tailscale 的 UDP 绕开代理；手机在外用流量时实际走哪条没有记录｜说不准
4. 高画质编码｜RTX 5090 D 硬件编码，HEVC、AV1 都支持 10 位画面（HDR）；预设 P5，开空间自适应量化｜在用
5. 开机就能连｜Sunshine、Tailscale 开机自动启动；Tailscale 设成没登录 Windows 也在线｜在用

**主屏不在时**
6. 虚拟备用屏｜MTT 虚拟显示驱动造的一块屏：2880×1800、60 Hz、150% 缩放，默认请求开 HDR（Windows 这边实际开没开，截止前没有新的回读）；主屏关着时它就是桌面｜在用
7. 自动换画面｜主屏消失满 15 秒、又连续 5 秒没人连着，才把 Sunshine 换去抓备用屏；主屏回来满 5 秒再换回｜待验收
8. 窗口搬过去｜换到备用屏时，主屏上的普通窗口按原来的相对位置搬过去，并记下每个窗口的原位；10 月 22 日起源码规定“从哪搬”只认证明过的主屏区域或上次记下的主屏区域，都没有就不新搬（10 月 26 日起运行的守护已加载）｜待验收
9. 窗口搬回来｜主屏回来满 1 秒就把窗口搬回原位；备用屏期间新开的窗口也挪到主屏｜待验收
10. 备用屏设置｜改分辨率、刷新率、缩放、HDR；默认只预览，确认才改；上次真改是 9 月 2 日｜在用
11. 备用屏接进 Sunshine｜按备用屏的硬件身份算出 Sunshine 认的屏编号写进配置；8 月 11 日装备用屏时用过｜在用

::screen{#sunshine-remote-streaming-09 section="features"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
  "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
  "links": [],
  "anchors": [
   {
    "id": "g-guard",
    "text": "安全规矩"
   },
   {
    "id": "f-hands-off",
    "text": "不碰真显示器"
   },
   {
    "id": "f-idle-gate",
    "text": "有人连着不换"
   },
   {
    "id": "f-gpu-gate",
    "text": "显卡安全闸"
   },
   {
    "id": "f-rollback",
    "text": "改坏能退"
   },
   {
    "id": "f-watchdog",
    "text": "守护自己拉起"
   },
   {
    "id": "g-check",
    "text": "体检和修复"
   },
   {
    "id": "f-daily-check",
    "text": "每天体检"
   },
   {
    "id": "f-host-health",
    "text": "主机端体检"
   },
   {
    "id": "f-path-check",
    "text": "查线路"
   },
   {
    "id": "f-repair",
    "text": "串流修复"
   },
   {
    "id": "f-pause",
    "text": "停和恢复画面切换"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-maint-window",
    "text": "维护小窗"
   },
   {
    "id": "f-proxy-pin",
    "text": "Tailscale 写死代理"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "srs-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "status_legend",
    "section_heading",
    "feature_card",
    "icon"
   ],
   "portrait_component_order": [
    "section_heading",
    "status_legend",
    "feature_card",
    "icon"
   ],
   "source_layout": {
    "desktop": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
    "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "安全规矩",
     "体检和修复",
     "已停用"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
   "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "安全规矩",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "12不碰真显示器连上、断开、换屏，都不关、不停用、不重排物理显示器；水冷屏和机箱",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "体检和修复",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "17每天体检14:30查Tailscale在线、无人值守、编码能力、Funnel",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "已停用",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "22维护小窗的开始菜单入口开始菜单里的“RAMDisk与远程串流维护”快捷方式，",
     "fill_last_row": true
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n接前屏不新增大标题/图例；仅状态圆点、跨屏同网格无上下边框和小号毛笔组标题仍缺对应消费接口。当前保留全部原状态文字。\n清单未登记这些完整原文的逐字一致毛笔标题图：安全规矩、体检和修复、已停用；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 9 项，文字盘点预算 12 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "接前屏不新增大标题/图例；仅状态圆点、跨屏同网格无上下边框和小号毛笔组标题仍缺对应消费接口。当前保留全部原状态文字。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：安全规矩、体检和修复、已停用；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 9 项，文字盘点预算 12 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 9
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 12,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "status_legend",
    "section_heading",
    "feature_card",
    "icon"
   ],
   "portrait_component_order": [
    "section_heading",
    "status_legend",
    "feature_card",
    "icon"
   ],
   "source_layout": {
    "desktop": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
    "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "安全规矩",
     "体检和修复",
     "已停用"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：和照片视频录音管理页的“全部功能”一样的画法：组名是卡片区上方一行毛笔小标题（不单独占一整列），每组卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画，状态只画圆点）。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题、没有图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。图例里 6 种都画出来，本页只用到其中 5 种。",
   "portrait": "竖版：组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）；图例在第一张顶上排成两行。",
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "安全规矩",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "12不碰真显示器连上、断开、换屏，都不关、不停用、不重排物理显示器；水冷屏和机箱"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "体检和修复",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "17每天体检14:30查Tailscale在线、无人值守、编码能力、Funnel"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "已停用",
     "heading_style": "sans"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "22维护小窗的开始菜单入口开始菜单里的“RAMDisk与远程串流维护”快捷方式，"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n接前屏不新增大标题/图例；仅状态圆点、跨屏同网格无上下边框和小号毛笔组标题仍缺对应消费接口。当前保留全部原状态文字。\n清单未登记这些完整原文的逐字一致毛笔标题图：安全规矩、体检和修复、已停用；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 9 项，文字盘点预算 12 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "接前屏不新增大标题/图例；仅状态圆点、跨屏同网格无上下边框和小号毛笔组标题仍缺对应消费接口。当前保留全部原状态文字。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：安全规矩、体检和修复、已停用；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 9 项，文字盘点预算 12 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 9
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 12,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显示器",
   "source_phrase": "不碰真显示器｜连上、断开、换屏，都不关、不停用、不重排物理显示器；水冷屏和机箱小屏一概不碰｜在用",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "有人连着不换｜换屏要重启 Sunshine；写配置前、重启后、搬窗口前各查一次连接，有人连进来就撤回、等下一轮｜待验收",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "显卡安全闸｜最近 15 分钟有显卡驱动出错、内核错误或蓝屏就不自动换屏，安静满 15 分钟自己恢复；单凭上次没正常关机不挡；查询出错也挡｜在用",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "改坏能退｜改配置前先比对指纹、整份替换并留备份；Sunshine 重启失败就换回原样再启动｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "守护自己拉起｜我登录后启动，每 10 秒写一次心跳；挂了 1 分钟后自己重开，同一时间只跑一份｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "每天体检｜14:30 查 Tailscale 在线、无人值守、编码能力、Funnel 有没有公开 Sunshine；9 月 18—28 日天天通过｜在用",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "主机端体检｜只读：两个服务、配置、安全闸、有没有人连着、守护心跳、现在抓主屏还是备用屏｜在用",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "查线路｜指定手机后 ping 5 次，看走直连、Tailscale 公共中转还是自己设备中转，报延迟｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "串流修复｜服务改回自动、开无人值守、清写死的代理、开网卡 IPv6；默认只出计划，改前存原样，失败倒着退回｜说不准",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "停和恢复画面切换｜跟 AI 说“停掉串流画面切换”，先等正在做的一步做完再停，不直接停 Sunshine｜说不准",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "维护小窗｜开始菜单里的“RAMDisk 与远程串流维护”，9 月 26 日按我的决定撤掉，改在网站看｜已停用",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "Tailscale 写死代理｜6 月为了不掉登录给它配死了代理端口，8 月 6 日去掉，改跟着系统当前的网络走｜已停用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-eb724d0c04bb230bc0d5.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-eb724d0c04bb230bc0d5",
   "title_text": "体检和修复",
   "sha256": "1ed2f2c793974f67f3a5718c817d409abd0bae5681857f14842d51c766528f01",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-84c0dc75bffc77e73c4a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-84c0dc75bffc77e73c4a",
   "title_text": "安全规矩",
   "sha256": "3547513fdbe29338db9bb147013c1a554ab327fbb133e4503e677592f8dd82a4",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-a8c3698b5b8c485d8bd4.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a8c3698b5b8c485d8bd4",
   "title_text": "已停用",
   "sha256": "109419764a0213c3c797117892861b41eba1c925b8ea33a3c2d91df372cd05da",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**安全规矩**
12. 不碰真显示器｜连上、断开、换屏，都不关、不停用、不重排物理显示器；水冷屏和机箱小屏一概不碰｜在用
13. 有人连着不换｜换屏要重启 Sunshine；写配置前、重启后、搬窗口前各查一次连接（RTSP 的 TCP 和串流的 UDP 端点都看，查不清也不换），有人连进来就撤回、等下一轮｜待验收
14. 显卡安全闸｜最近 15 分钟有显卡驱动出错、内核错误或蓝屏就不自动换屏，安静满 15 分钟自己恢复；单凭上次没正常关机不挡；查询出错也挡｜在用
15. 改坏能退｜改配置前先比对指纹、整份替换并留备份；Sunshine 重启失败就换回原样再启动，但换回前再比一次指纹，中途被别人改过就拒绝覆盖、报错；窗口恢复记录损坏时停住，不拿默认值覆盖｜在用
16. 守护自己拉起｜我登录后启动，每 10 秒写一次心跳；挂了 1 分钟后自己重开，同一时间只跑一份；隐藏启动器把启动、退出和启动出错记进日志，出错返回失败码；心跳写不出去单独记错，不打断换屏判断，一直写不出去会显示过期（10 月 21—25 日源码；10 月 26 日 10:30 起运行的守护，四个程序文件指纹和源码一致）｜在用

**体检和修复**
17. 每天体检｜14:30 查 Tailscale 在线、无人值守、编码能力、Funnel 有没有公开 Sunshine；9 月 18 日—10 月 10 日共 23 天天天通过（只查主机这边）｜在用
18. 主机端体检｜只读：两个服务、配置、安全闸、有没有人连着、守护心跳、现在抓主屏还是备用屏｜在用
19. 查线路｜指定手机后 ping 5 次，看走直连、Tailscale 公共中转还是自己设备中转，报延迟｜说不准
20. 串流修复｜服务改回自动、开无人值守、清写死的代理、开网卡 IPv6；默认只出计划，改前存原样，失败倒着退回｜说不准
21. 停和恢复画面切换｜跟 AI 说“停掉串流画面切换”，先等正在做的一步做完再停，不直接停 Sunshine｜说不准

**已停用**
22. 维护小窗的开始菜单入口｜开始菜单里的“RAMDisk 与远程串流维护”快捷方式，9 月 26 日按我的决定撤掉，平时改在网站看；小窗程序本身还在，需要时可以让 AI 直接打开｜已停用
23. Tailscale 写死代理｜6 月为了不掉登录给它配死了代理端口，8 月 6 日去掉，改跟着系统当前的网络走｜已停用

::screen{#sunshine-remote-streaming-10 section="history"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子。",
  "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。",
  "links": [
   {
    "text": "Codex 远程",
    "href": "/projects/codex-local-remote/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "timeline",
    "icon",
    "illustration",
    "inline_link"
   ],
   "portrait_component_order": [
    "timeline",
    "illustration",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子。",
    "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左侧），每个节点一个小水彩",
     "右侧一幅大一点的水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子。",
   "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：演进（北京时间）"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "6月26日：搭起来：Sunshine＋Moonlight＋Tailscale；打",
     "width": "100%"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n时间线各节点与右侧一幅‘手机到小房子、细线长成丝带、备用屏/听诊器/闸门’大插画需语义素材；不是把首屏串流插画自动拿来替代本屏演进图。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：演进（北京时间）；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。\n资产清单的 icon 仅 1 项，文字盘点预算 11 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "时间线各节点与右侧一幅‘手机到小房子、细线长成丝带、备用屏/听诊器/闸门’大插画需语义素材；不是把首屏串流插画自动拿来替代本屏演进图。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：演进（北京时间）；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
    "资产清单的 icon 仅 1 项，文字盘点预算 11 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 11,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\sunshine-remote-streaming\\page.json",
   "source_sha256": "8bba71fa969575cbee679222bdde72d94c77e272213f63a480c8db41b3a2f5c2",
   "desktop_component_order": [
    "timeline",
    "icon",
    "illustration",
    "inline_link"
   ],
   "portrait_component_order": [
    "timeline",
    "illustration",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子。",
    "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左侧），每个节点一个小水彩",
     "右侧一幅大一点的水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：一条竖向时间线（左侧），每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子。",
   "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：演进（北京时间）"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "6月26日：搭起来：Sunshine＋Moonlight＋Tailscale；打",
     "width": "100%"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。\n时间线各节点与右侧一幅‘手机到小房子、细线长成丝带、备用屏/听诊器/闸门’大插画需语义素材；不是把首屏串流插画自动拿来替代本屏演进图。\n清单未登记这些完整原文的逐字一致毛笔标题图：标题：演进（北京时间）；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。\n资产清单的 icon 仅 1 项，文字盘点预算 11 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "unsupported_requirements": [
    "定稿‘大标题：/标题：/说明：/图例：’属于普通 para 的正文，现解析器不把这些词当排版记号；本规格逐字保留，不擅删。合格标题素材需与完整节点逐字匹配。",
    "时间线各节点与右侧一幅‘手机到小房子、细线长成丝带、备用屏/听诊器/闸门’大插画需语义素材；不是把首屏串流插画自动拿来替代本屏演进图。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：标题：演进（北京时间）；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
    "资产清单的 icon 仅 1 项，文字盘点预算 11 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 11,
    "semantic_image_reviewed": false
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "6 月 26 日：搭起来：Sunshine＋Moonlight＋Tailscale；打通 IPv6 直连；写下编码和手机端参数、修复脚本",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "7 月 5–9 日：每天自动体检，后台不弹窗；加查有没有把服务放到公网",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "8 月 3 日：〔Codex 远程〕停止修补，在外面管 Codex 改成串流看桌面",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 6 日：去掉给 Tailscale 写死的代理端口",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "8 月 9 日：加固没登录时的串流和 HDR 检查",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 11–12 日：接上虚拟备用屏；主屏优先的自动换屏上线，有人连着不换",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "8 月 12 日—9 月 2 日：窗口搬回主屏改了 8 次；9 月 2 日恢复备用屏的 HDR 设置",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "9 月 4 日：显卡安全闸补全（后来发现误伤，见亮点）",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "9 月 18 日：守护心跳和主机端体检；备用屏设置改成整套可退回；修复开始写回执",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "9 月 26 日：修好安全闸的误判；开始菜单的维护小窗撤掉，改在网站看；说明文档改成人话",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "9 月 29 日：安全闸不再单凭“上次没正常关机”挡一整次开机，只看最近 15 分钟的显卡和显示故障，安静后自己恢复",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "asset": "_library/icons/盾牌对勾.png",
   "key": "盾牌对勾",
   "source_phrase": "10 月 3 日：判断“有没有人在串”时，UDP 串流端点也算；窗口恢复记录坏了就停住，不拿空白记录顶替。",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "key": "双屏同步",
   "source_phrase": "10 月 8 日：两台电脑让 Tailscale 的 UDP 流量绕开代理直连；同一网络和手机热点下真人连过，画面和操作正常。",
   "sha256": "80a56ba92e42aa6b9141a824b64cb9208b1b2f37b20bc0d462f04e3e15410ca4",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/远程主备显示屏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "远程主备显示屏",
   "source_phrase": "右侧一幅大一点的水彩插画：先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子。",
   "sha256": "f0c9f635bf341d663736af34b221cffe82521a671a9b14feba70978209dfaae4",
   "status": "ready",
   "original_elements": [
    "先是一部手机和一座小房子之间一条细线，接着细线变成绿色丝带，房子里长出一块虚线的备用屏，最后丝带边上多了一个小听诊器和一个闸门，像一路长出来的样子"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7d359dfee0bedd68127f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7d359dfee0bedd68127f",
   "title_text": "演进（北京时间）",
   "sha256": "f822fd4b764807be915e72b98b9486fe72a42f3abebbb53422a5e6db514f9ee4",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：演进（北京时间）

- **6 月 26 日**：搭起来：Sunshine＋Moonlight＋Tailscale；打通 IPv6 直连；写下编码和手机端参数、修复脚本
- **7 月 5–9 日**：每天自动体检，后台不弹窗；加查有没有把服务放到公网
- **8 月 3 日**：〔Codex 远程〕停止修补，在外面管 Codex 改成串流看桌面
- **8 月 6 日**：去掉给 Tailscale 写死的代理端口
- **8 月 9 日**：加固没登录时的串流和 HDR 检查
- **8 月 11–12 日**：接上虚拟备用屏；主屏优先的自动换屏上线，有人连着不换
- **8 月 12 日—9 月 2 日**：窗口搬回主屏改了 8 次；9 月 2 日恢复备用屏的 HDR 设置
- **9 月 4 日**：显卡安全闸补全（后来发现误伤，见亮点）
- **9 月 18 日**：守护心跳和主机端体检；备用屏设置改成整套可退回；修复开始写回执
- **9 月 26 日**：修好安全闸的误判；开始菜单里的维护小窗入口撤掉，改在网站看；说明文档改成人话
- **9 月 29 日**：安全闸不再单凭“上次没正常关机”挡一整次开机，只看最近 15 分钟的显卡和显示故障，安静后自己恢复
- **10 月 3 日**：判断“有没有人在串”时，UDP 串流端点也算；窗口恢复记录坏了就停住，不拿空白记录顶替
- **10 月 8 日**：两台电脑让 Tailscale 的 UDP 流量绕开代理直连；同一网络和手机热点下真人连过，画面和操作正常
