---
{
 "title": "代理上网修复",
 "kind": "project",
 "url": "/projects/proxyclean/",
 "tagline": "代理退出后上不了网，查出残留设置、只修失效的。",
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
  },
  {
   "id": "gallery",
   "label": "画廊"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "proxyclean",
  "kind": "project",
  "title": "代理上网修复",
  "url": "/projects/proxyclean/",
  "tagline": "代理退出后上不了网，查出残留设置、只修失效的。",
  "status": "常用",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次更新",
    "at": "2026-10-06 05:52"
   },
   "facts": [],
   "as_of": "2026-10-11",
   "source": "按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）核对修复和关闭流程；没有实际修复或关闭客户端"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/ProxyClean",
  "capability": "查清代理留下的断网，只修失效项",
  "based_on": {
   "commit": "8915589d7b7d00adecf1039a6c856cf231b9360b",
   "commit_time": "2026-10-06T05:52:20+08:00"
  },
  "video_prompt": "6 秒循环，白底水彩风，从开头这屏的插画出发：笔记本电脑背后的几根线接在插线板上，两根鲜绿的线插在亮着小绿灯的插孔里，小绿灯轻轻呼吸；两根灰色虚线插在熄灭的空插孔里。一把绿色小剪刀从右上飘进来，只把两根灰色虚线轻轻剪断，断线化成几片绿色小叶子飘落；绿色的线一直不动。电脑屏幕上的小窗口从浅灰慢慢变成白底绿边。结尾回到开头画面，形成循环。画面里不出现任何文字。",
  "registry": {
   "groups": [
    {
     "id": "g-home",
     "name": "首页两件事"
    },
    {
     "id": "g-proxy",
     "name": "代理和端口（维护工具）"
    },
    {
     "id": "g-network",
     "name": "网卡与连接（维护工具）"
    },
    {
     "id": "g-see",
     "name": "看清楚、交给 AI"
    },
    {
     "id": "g-legacy",
     "name": "旧入口和旧做法"
    }
   ],
   "features": [
    {
     "id": "f-status",
     "group": "g-home",
     "name": "打开就查",
     "what": "8 层只读检查，首页一句话说出 Windows 当前代理是谁；可以中途取消",
     "how": "从开始菜单打开 ProxyClean",
     "status": "在用",
     "screen": "proxyclean-07",
     "source": "AGENTS.md 第 4 行；Common.psm1 第 217–254 行；Clients.ps1 第 58–72 行；owner-decisions T8（9 月 26 日）"
    },
    {
     "id": "f-repair",
     "group": "g-home",
     "name": "检查并修复上网问题",
     "what": "列出失效设置，确认后存原样、修、读回核对，再测网页",
     "how": "首页点“检查并修复上网问题”，再点“开始修复”",
     "status": "说不准",
     "screen": "proxyclean-07",
     "source": "Operations.ps1 第 29–111、232–274 行；Workflow.ps1 第 127–172 行；%LOCALAPPDATA%\\ProxyClean 不存在"
    },
    {
     "id": "f-close",
     "group": "g-home",
     "name": "关闭代理，恢复普通上网",
     "what": "请它正常退出，4 秒没退再结束核对过的残留进程，清它的设置，保住下次启动",
     "how": "首页点“关闭代理，恢复普通上网”；多个代理时先选一个",
     "status": "说不准",
     "screen": "proxyclean-07",
     "source": "Clients.ps1 第 73–243 行；已删 docs/verification-2026-09-25.md“未执行”节"
    },
    {
     "id": "f-undo",
     "group": "g-home",
     "name": "恢复上次修改",
     "what": "只改回仍是上次改动结果的设置；不重启已结束的程序",
     "how": "首页点“恢复上次修改”（有记录时才出现）",
     "status": "没用过",
     "screen": "proxyclean-07",
     "source": "Operations.ps1 第 210–231、275–290 行；恢复记录文件夹不存在"
    },
    {
     "id": "f-direct",
     "group": "g-proxy",
     "name": "关闭手动代理",
     "what": "不管端口死活，关掉当前用户的手动代理、代理变量和 Git 代理，并删掉隧道的默认路线；不退出代理程序",
     "how": "维护工具点“关闭手动代理…”",
     "status": "说不准",
     "screen": "proxyclean-07",
     "source": "AGENTS.md 第 9 行；Operations.ps1 第 45–89 行；Workflow.ps1 第 76 行"
    },
    {
     "id": "f-stop-port",
     "group": "g-proxy",
     "name": "结束占用端口的程序",
     "what": "选客户端的端口或手输端口，先看要结束哪些进程，端口关了才清只指向它的设置",
     "how": "维护工具“结束占用端口的程序”；或让 AI 跑 Stop-ProxyPort.ps1",
     "status": "在用",
     "screen": "proxyclean-07",
     "source": "Network.ps1 第 23–80 行；PCConfig flyingbird_autostart.md 第 72–75 行（9 月 10 日关 7892）"
    },
    {
     "id": "f-connectivity",
     "group": "g-proxy",
     "name": "检查联网情况",
     "what": "分别测国内、海外和 AI 服务，IPv4、IPv6 和开着的 HTTP 代理都测；解析失败和连不上分开报",
     "how": "维护工具点“检查联网情况”",
     "status": "说不准",
     "screen": "proxyclean-07",
     "source": "Operations.ps1 第 308–324 行"
    },
    {
     "id": "f-exit",
     "group": "g-proxy",
     "name": "比较联网出口",
     "what": "问一个公开的查 IP 网站，几条路各从哪出去，只说相同还是不同，不显示 IP",
     "how": "维护工具点“比较联网出口…”",
     "status": "说不准",
     "screen": "proxyclean-07",
     "source": "Network.ps1 第 187–214 行"
    },
    {
     "id": "f-wifi-soft",
     "group": "g-network",
     "name": "刷新连接",
     "what": "给选定网卡刷新域名缓存、释放再续租地址；固定地址的网卡不动",
     "how": "维护工具选网卡，点“刷新连接…”",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "Network.ps1 第 106–123 行"
    },
    {
     "id": "f-wifi-reset",
     "group": "g-network",
     "name": "重启网卡",
     "what": "禁用再启用选定网卡，出错也会尝试重新启用",
     "how": "维护工具选网卡，点“重启网卡…”",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "Network.ps1 第 124–134 行"
    },
    {
     "id": "f-dns",
     "group": "g-network",
     "name": "刷新域名缓存",
     "what": "只清缓存，不换 DNS 服务器",
     "how": "维护工具点“刷新域名缓存…”",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "Workflow.ps1 第 219–226 行"
    },
    {
     "id": "f-ipv6",
     "group": "g-network",
     "name": "IPv6 查看和开关",
     "what": "看各网卡的 IPv6 和默认路线；只改物理网卡，Tailscale、虚拟机网卡不动",
     "how": "维护工具点“查看 IPv6 状态”“启用 IPv6…”“禁用 IPv6…”",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "Network.ps1 第 141–185 行"
    },
    {
     "id": "f-details",
     "group": "g-see",
     "name": "检查详情",
     "what": "分层列出查了什么、哪个端口在跑、保留了什么，还有这次每一步的时间",
     "how": "首页右下角点“查看详情”",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "Details.xaml；Workflow.ps1 第 88–115 行"
    },
    {
     "id": "f-copy-diag",
     "group": "g-see",
     "name": "复制脱敏诊断",
     "what": "复制一份给 AI 看的技术数据，不含代理密码、公网 IP 和设置原值",
     "how": "检查详情里点“复制脱敏诊断”",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "Details.xaml 第 14 行；ControlCenter.ps1 第 155 行"
    },
    {
     "id": "f-cli",
     "group": "g-see",
     "name": "让 AI 在命令行跑",
     "what": "同一套程序的命令行版，结果整理成 AI 直接能读的格式：状态报告、预览和修复、撤销、按端口关、网卡、IPv6",
     "how": "跟 AI 说“查一下是不是代理没关干净”",
     "status": "在用",
     "screen": "proxyclean-08",
     "source": "ProxyStatus.ps1、ProxyClean.ps1、Stop-ProxyPort.ps1、WifiRebind.ps1、IPv6-*.ps1；PCConfig flyingbird_autostart.md 第 72–75 行"
    },
    {
     "id": "f-legacy",
     "group": "g-legacy",
     "name": "旧版入口",
     "what": "11 个旧快捷方式（一键修复网络、关闭 7892 上的代理程序等）还能用，现在只打开窗口预览",
     "how": "打开“旧版入口”文件夹双击",
     "status": "说不准",
     "screen": "proxyclean-08",
     "source": "旧版入口/ 11 个文件；CHANGELOG 9 月 22 日节"
    },
    {
     "id": "f-fallback",
     "group": "g-legacy",
     "name": "常驻兜底层",
     "what": "开机在后台跑一个隐藏的代理内核兜底，把全机代理都指到它；6 月 29 日起不再启用，8 月 6 日退役；9 月 29 日连留作参考的配置和两个小脚本也删了",
     "how": "不再使用",
     "status": "已停用",
     "screen": "proxyclean-08",
     "source": "fallback/config.yaml 第 6 行（18099 端口；北京 9/29 01:39 提交 5d54c40 连同 start-hidden.vbs、代理状态.bat 删除）；git show 972bcc4^:README.md 第 127–134 行"
    }
   ],
   "numbers": [
    {
     "id": "n-layers",
     "text": "8 层",
     "meaning": "打开就查的层数：本机代理进程、网卡、默认路由、Windows 手动代理、终端代理变量、Git、WinHTTP、Docker",
     "as_of": "2026-10-11",
     "source": "ProxyClean.Common.psm1 $availability 8 个键现查",
     "screens": [
      "proxyclean-01",
      "proxyclean-02",
      "proxyclean-04",
      "proxyclean-07"
     ]
    },
    {
     "id": "n-tests",
     "text": "测试定义 317 个（只计数）",
     "meaning": "仓库全部 Pester 测试用例数（只做发现、不运行统计）；9 月 25 日那版 277 项在 PS 7 和 5.1 各跑一遍全过，新增 40 项后的整套本轮没重跑",
     "as_of": "2026-10-11",
     "source": "Invoke-Pester -Configuration (Run.SkipRun=true, Run.Path=tests) 现算：HEAD 8915589 为 317，f26ded7 为 277（同法复核原数）",
     "screens": [
      "proxyclean-01",
      "proxyclean-05",
      "proxyclean-09"
     ]
    },
    {
     "id": "n-bg-tasks",
     "text": "0 个",
     "meaning": "本项目的计划任务、服务、开机自启",
     "as_of": "2026-10-11",
     "source": "本机计划任务动作、服务、开机启动项里都没有 ProxyClean（10 月 11 日现查）",
     "screens": [
      "proxyclean-01"
     ]
    },
    {
     "id": "n-home-buttons",
     "text": "2 个",
     "meaning": "首页操作按钮",
     "as_of": "2026-10-11",
     "source": "ControlCenter.xaml 首页两颗主按钮现查",
     "screens": [
      "proxyclean-01"
     ]
    },
    {
     "id": "n-code",
     "text": "约 2,500.0 行程序、2,300.0 行测试",
     "meaning": "git 跟踪的 ps1/psm1/xaml/vbs（去掉 tests、旧版入口、fallback）2,471 行非空行；tests/ 12 个文件 2,334 行非空行",
     "as_of": "2026-10-11",
     "source": "git ls-files + PowerShell Measure-Object -Line 现算（HEAD 8915589）",
     "screens": [
      "proxyclean-05"
     ]
    },
    {
     "id": "n-legacy",
     "text": "11 个",
     "meaning": "旧版入口文件夹里的旧快捷方式",
     "as_of": "2026-10-11",
     "source": "git ls-files 旧版入口/ 共 11 个",
     "screens": [
      "proxyclean-06",
      "proxyclean-08",
      "proxyclean-09"
     ]
    },
    {
     "id": "n-features",
     "text": "17 项",
     "meaning": "本页全部功能条数",
     "as_of": "2026-09-28",
     "source": "本页 registry.features",
     "screens": [
      "proxyclean-07"
     ]
    },
    {
     "id": "n-commits",
     "text": "37 次",
     "meaning": "仓库全部提交，6 月 24 日–10 月 6 日（北京时间）",
     "as_of": "2026-10-11",
     "source": "git rev-list --count HEAD（HEAD 8915589，北京 10/6 05:52）",
     "screens": [
      "proxyclean-09"
     ]
    },
    {
     "id": "n-wait",
     "text": "4 秒",
     "meaning": "关闭代理时等正常退出的时间，超时才结束残留进程",
     "as_of": "2026-10-11",
     "source": "ProxyClean.Clients.ps1 WaitSeconds=4 现查",
     "screens": [
      "proxyclean-03",
      "proxyclean-07"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-clients",
     "with": "pcconfig",
     "direction": "配合",
     "flow": "电脑配置与恢复管代理程序的开机自启（9 月 25 日起它是唯一开机代理）；ProxyClean 关客户端时把原本在跑的启动辅助服务开回来、不改服务启动方式，下次登录照样能自启",
     "source": "PCConfig docs/recovery/known_issues.md 第 143–149 行；ProxyClean AGENTS.md 第 7 行"
    },
    {
     "id": "r-pcconfig-acceptance",
     "with": "pcconfig",
     "direction": "被拿来用",
     "flow": "9 月 10 日验收现在手动开的那个代理程序开机自启时，AI 用 ProxyClean 关掉回环 7892，看自启任务会不会重拉",
     "source": "PCConfig docs/recovery/flyingbird_autostart.md 第 72–75 行"
    },
    {
     "id": "r-pcconfig-card",
     "with": "pcconfig",
     "direction": "被登记",
     "flow": "项目卡登记入口、验证命令和恢复记录路径；换电脑只从 Git 恢复程序，不带恢复记录和旧代理值",
     "source": "PCConfig registries/project_cards.json（project_id proxy_clean）"
    },
    {
     "id": "r-tailscale-entries",
     "with": "pcconfig",
     "direction": "受影响",
     "flow": "手机和副机经 Tailscale 用电脑的代理入口（7892 给手动开的那个、18091 给开机自启的那个）；ProxyClean 关掉对应代理后入口随之不通，属预期",
     "source": "PCConfig docs/recovery/tailscale_proxy_entries.md 第 9–10、43 行；owner-decisions 第 210–211 行"
    },
    {
     "id": "r-proxy-clients",
     "with": "外部：各家代理程序、通用代理内核",
     "direction": "管理",
     "flow": "识别进程和端口，请求退出、结束残留、停和恢复辅助服务；不改它们的配置",
     "source": "ProxyClean.Clients.ps1 第 3–14、142–243 行"
    },
    {
     "id": "r-docker",
     "with": "外部：Docker Desktop",
     "direction": "只读",
     "flow": "读 settings-store.json 和 httpproxy.log 最近 300 行，只提示钉住的本机代理",
     "source": "ProxyClean.Common.psm1 第 159–197 行"
    },
    {
     "id": "r-git",
     "with": "外部：Git",
     "direction": "读写",
     "flow": "读、按需清全局 http.proxy、https.proxy（lock 文件原子替换）",
     "source": "ProxyClean.Operations.ps1 第 325–368 行"
    },
    {
     "id": "r-web-probes",
     "with": "外部：百度、微软联网测试页、ipify",
     "direction": "发请求",
     "flow": "修复或关闭后测两个网页；用户点“比较联网出口”才问 ipify，只保留分组号",
     "source": "Operations.ps1 第 308–324 行；Network.ps1 第 187–214 行"
    },
    {
     "id": "r-ai-cli",
     "with": "Claude、Codex",
     "direction": "被调用",
     "flow": "AI 跑 ProxyStatus.ps1、ProxyClean.ps1、Stop-ProxyPort.ps1 等，拿 JSON 结果",
     "source": "各脚本 -Json 参数；AI 使用小记录"
    },
    {
     "id": "r-github-index",
     "with": "github-local-index",
     "direction": "被登记",
     "flow": "公开仓库的路径和可见性登记",
     "source": "E:\\GitHub总索引\\config\\repository-paths.json 第 196–197 行"
    }
   ],
   "highlights": [
    {
     "id": "h-process-tree",
     "title": "认代理靠进程关系，不靠端口表",
     "screen": "proxyclean-06"
    },
    {
     "id": "h-read-only-open",
     "title": "打开只看，不动手",
     "screen": "proxyclean-06"
    }
   ],
   "mentions": [
    {
     "target": "/projects/pcconfig/",
     "screen": "proxyclean-03",
     "text": "手机和副机经这台电脑用代理的入口也会一起停（入口归〔电脑配置与恢复〕管）"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“网络状态检查”→ f-status；“一键检查修复”→ f-repair；“关闭代理”→ f-close；“关闭指定代理”→ f-stop-port；“IPv6状态”→ f-ipv6（查看和开关合一）；“上次修改恢复”→ f-undo；“技术详情”→ f-details。",
    "底稿“清理失效代理”并入 f-repair：同一个 ProxyClean.ps1 流程，窗口按钮和 AI 命令行只是两个入口；AI 入口写在 f-cli。",
    "底稿“无线网重连”拆成 f-wifi-soft（刷新连接）和 f-wifi-reset（重启网卡）：维护窗口是两个按钮，影响不同；WifiRebind.ps1 的只读诊断模式归进 f-cli。",
    "底稿没有、按代码补上的：f-direct、f-connectivity、f-exit、f-dns、f-copy-diag、f-cli、f-legacy、f-fallback。"
   ],
   "dropped": [
    "旧站截图 checking.png（检查中）信息量小；no-fix-found.png 上的文案已被现代码改掉（现为“基础网页测试未能确认连通……”），放上去和现状对不上。",
    "6 月 28 日订阅 403 排查的细节（服务商域名、端口、宽带地址段）：属于代理服务的事，也涉及订阅，只在演进里留一句结论。",
    "Claude Code 与浏览器泄露的取舍文档（9 月 26 日已删）：本人决定“优先保障日常 AI 应用连通，不为浏览器泄露评分改坏可用的上网路径”（AGENTS.md 第 15 行），属于上网策略而非本工具功能，页上只在演进写“Claude Code 走 TUN，终端不设代理变量”。",
    "取消检查、授权后继续、单实例互斥锁等交互细节：并进 f-status、第 5 屏“要管理员权限的”和第 3 屏流程，不单列功能。"
   ],
   "unsure": [
    "已定（审稿第 1 条，Claude 口径）：f-repair、f-close、f-direct 标“说不准”。恢复记录文件夹不存在只能证明 9 月 18 日以来没真改过设置；没找到可修的项、关代理时没有指向它的设置、手动代理本来就关着时，这几项都不写记录，用没用过查不到。6 月–9 月 17 日的旧版一键修复网络、恢复直连也没有记录。",
    "f-stop-port 和 f-cli 标“在用”依据的是 9 月 10 日 PCConfig 记录的一次 AI 真实调用，那时是旧版脚本（按写死的端口表连带结束整个飞鸟，没有身份核对）；现版本（9 月 18 日起核对身份）没有真实调用记录。",
    "f-status 标“在用”依据 T8 本人原话（9 月 26 日 03:09）“开始菜单窗口除了 ProxyClean 和密码中心基本不打开”；每次打开不留记录，最近一次什么时候打开不知道。两条亮点都建立在“打开就查”在用这一点上。",
    "第 2 屏“电脑上现在装着两个代理：Clash Verge 开机自己启动，飞鸟要用时手动开，两个会交替用”是按本人 9 月 26 日“用户有可能用clash有可能有fly”和 PCConfig 记录写的，替本人描述了用法，上线前请本人过目。",
    "亮点二“有一次删路线时把 WLAN 的默认路线也删了，网彻底断掉”来自 6 月 29 日版脚本头注释“绝不会再像旧版那样误删 WLAN/以太网,把你彻底搞断网”，没找到当时的现场记录；“整机断网，前后两次”来自 6 月 30 日 README“本项目实测踩过两次”。",
    "亮点一里“飞鸟内核的监听端口每次启动都可能不同”依据 PCConfig flyingbird_autostart.md 第 68–69 行（说的是开机自启方案下的 Core 监听），普通手动开飞鸟时 7892 是固定的混合端口；写法已限定为“内核的监听端口”。",
    "第 2 屏“开始菜单 9 月 28 日刚加回去”依据快捷方式文件修改时间（北京时间 9 月 28 日 00:54）和 ZS26 决定；没找到执行这件事的回执。",
    "没有“现在”横条和驾驶舱入口：项目自己没有计划任务或服务。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/proxyclean/page.json",
  "sha256": "724c1438475500351c12c99e7e80031560e0acda2a8e1569e7e1dd36f1be4759",
  "converted_at_beijing": "2026-10-12T00:29:47+08:00"
 }
}
---

::screen{#proxyclean-01 section="top"}

```typeset
{
 "screen": {
  "id": "proxyclean-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段介绍。右上一幅水彩插画：一台笔记本电脑，屏幕上是白底绿字的小窗口（只画色块，不画字）；电脑背后伸出四五根细线，接到一块插线板上：两根线是鲜绿色、插在亮着小绿灯的插孔里（还在工作的代理），另外两根是灰色虚线、插在已经熄灭的空插孔里（代理已经退出、设置还指着它）；一只绿色的小剪刀只剪那两根灰色虚线，绿色的线不碰。插画里不写任何字。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：1 一叠分层的透明纸（8 层），2 一张打满勾的清单，3 一个空的闹钟（没有后台任务），4 两个并排的圆角按钮。卡片下面右对齐一行灰色小字截至日期。最下面一行两个白底细绿边圆角按钮。没有“现在”横条（这个项目没有自动任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：大标题、副标题、介绍从上往下；插画放在介绍下面，占满宽；四张数字卡两行两列；截至日期；两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#proxyclean"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/ProxyClean"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/proxyclean/#ai-brief"
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
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "代理上网修复",
     "row": "hero",
     "width": "49%",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次更新 10 月 6 日 05:52",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）核对修复和关闭流程；没有实际修复或关闭客户端",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "代理程序退出后上不了网",
     "row": "hero",
     "align": "left"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "51%",
     "index": 0,
     "illustration": "outside"
    },
    {
     "type": "stat_card",
     "text_ref": "8 层",
     "columns": 4,
     "icons": "auto",
     "illustration": "top_inside"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置",
     "columns": 3,
     "align": "right"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 首屏横版：左标题/粗体副标题/介绍，右电脑剪灰线插画；4卡一行；截至日期右对齐；底3个同级按钮。有效新图有复制AI续作说明。组件依赖：8层/277项/0个/2个是4个para节点，core.stat_card仅取stats，须按原竖线拆数字与说明，不能降级成正文；副标题为group节点，不得当普通卡头缩小。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "代理上网修复",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次更新 10 月 6 日 05:52",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）核对修复和关闭流程；没有实际修复或关闭客户端"
    },
    {
     "type": "stat_card",
     "text_ref": "8 层",
     "columns": 2,
     "columns_v": 2,
     "illustration": "top_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "代理程序退出后上不了网",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "常见的代理程序",
     "align": "left"
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置",
     "columns_v": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 竖版v标题/浅绿副标题框/介绍/整宽电脑插画，v2四数字卡2×2、居中日期、整宽按钮上下排。通过v2参考仍漏复制AI续作说明，按定稿补第三按钮，不删除。数字para解析依赖同横版。副标题框是原构图新增样式，待样张；参考底按钮为圆角细绿边。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "portrait_parts": [
    {
     "part": 1,
     "source_file": "proxyclean-01-v.png",
     "content": "标题、副标题、介绍、主插画"
    },
    {
     "part": 2,
     "source_file": "proxyclean-01-v2.png",
     "content": "4数字卡、日期、3按钮"
    }
   ]
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "8 层｜打开就查：代理程序、网卡、默认路线、Windows 代理、终端变量、Git、系统服务代理、Docker",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "277 项｜自动测试，Windows 自带的 PowerShell 5.1 和 PowerShell 7 都全过（9 月 25 日）",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "0 个｜后台任务：不开机自启，不自动清理，要用时自己打开",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "2 个｜首页按钮：检查并修复上网问题；关闭代理，恢复普通上网",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-proxyclean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-proxyclean",
   "source_phrase": "右上一幅水彩插画：一台笔记本电脑，屏幕上是白底绿字的小窗口（只画色块，不画字）；电脑背后伸出四五根细线，接到一块插线板上：两根线是鲜绿色、插在亮着小绿灯的插孔里（还在工作的代理），另外两根是灰色虚线、插在已经熄灭的空插孔里（代理已经退出、设置还指着它）；一只绿色的小剪刀只剪那两根灰色虚线，绿色的线不碰。",
   "sha256": "019f54c30ab70337943a5737509908b1294f194b4d7bb04e4b0aac93021dedf1",
   "status": "ready",
   "original_elements": [
    "一台笔记本电脑，屏幕上是白底绿字的小窗口（只画色块，不画字）；电脑背后伸出四五根细线，接到一块插线板上：两根线是鲜绿色、插在亮着小绿灯的插孔里（还在工作的代理），另外两根是灰色虚线、插在已经熄灭的空插孔里（代理已经退出、设置还指着它）；一只绿色的小剪刀只剪那两根灰色虚线，绿色的线不碰"
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
   "asset": "proxyclean/proxyclean-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-proxyclean-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-46d81a290a1174cb7ad6",
   "title_text": "代理上网修复",
   "sha256": "2542736434a7d0b4b0c5942162562ba528c72a54f319f706ef20d370fded5d7d",
   "status": "ready",
   "source_box": [
    35,
    25,
    732,
    199
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 代理上网修复
**代理程序退出后上不了网：找出哪几项设置还指着已经没了的代理，只修那几项。**

常见的代理程序退出不干净时，Windows 的代理开关、终端里的代理变量、Git 的代理设置，甚至上网的默认路线，都可能还指着它留下的旧地址，浏览器、终端、git 于是一起连不上。ProxyClean 是一个小窗口：打开先把这些地方查一遍，只看不改；点“检查并修复上网问题”，列出哪几项已经失效，确认后先存好原样、再改、再读回来核对；点“关闭代理，恢复普通上网”，只关你选的那个代理。它不自动运行，也不用任何 AI 模型，判断全靠本机规则。

8 层｜打开就查：代理程序、网卡、默认路线、Windows 代理、终端变量、Git、系统服务代理、Docker
317 项｜自动测试：用假进程、假服务和临时设置测，不碰正在用的代理
0 个｜后台任务：不开机自启，不自动清理，要用时自己打开
2 个｜首页按钮：检查并修复上网问题；关闭代理，恢复普通上网

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#proxyclean-02 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-02",
  "section": "usage",
  "title": "什么时候打开它",
  "scene": "横版：左上标题，下面一段引子。左边约 55% 宽，三张竖排的场景卡（左侧一个小水彩图标：1 一个断开的插头，2 一只合上的开关，3 一个小机器人拿着放大镜），每张卡粗体标题加两三行正文。右边约 40% 宽，一个带细灰边框的空截图位，比例 1092:876（约 520×417 像素），框里什么都不画，拼页时贴首页截图；框下一行灰色小字说明。",
  "portrait": "竖版：标题、引子；截图位占满宽（比例 1092:876），下面一行说明；三张场景卡一行一张。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/09dbb7f83989655361ebb01f0e473d35f55de5001b08f7bad01bcd7bf290598b.png",
    "where": "右侧约 40% 宽的细边框空位，比例 1092:876",
    "caption": "首页（9 月 22 日截图）：一句话说出当前用的是哪个代理；这次没发现失效设置",
    "crop_h": [
     40,
     65,
     650,
     625
    ]
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "什么时候打开它",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "平时不用管它",
     "align": "left"
    },
    {
     "type": "content_card",
     "text_ref": "关掉代理后",
     "row": "usage",
     "width": "55%",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/hires-icons/打勾清单.png"
     ],
     "row_fit_illustration": true
    },
    {
     "type": "screenshot",
     "text_ref": "首页（9 月 22 日截图）",
     "row": "usage",
     "width": "40%",
     "columns": 1,
     "ratio": "1092:876",
     "columns_v": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版引子整宽；下方左3张场景卡纵排，每卡左图右文字，右纯白细绿边截图框和图注；比例严格1092:876（原图框外观近正方形，但定稿比例优先）。截图框不模拟UI。3个图标依次断插头、开关、拿放大镜机器人。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "什么时候打开它",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "平时不用管它"
    },
    {
     "type": "screenshot",
     "text_ref": "首页（9 月 22 日截图）",
     "columns_v": 1,
     "ratio": "1092:876",
     "columns": 1
    },
    {
     "type": "content_card",
     "text_ref": "关掉代理后",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/hires-icons/打勾清单.png"
     ]
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 实际通过v：标题/引子/第一张断插头场景卡，插画在卡顶；v2顶部整宽截图和图注，下面第2、3场景卡无插画。与portrait文字“截图先于三卡”不同，本稿按通过图视觉顺序记录。组件依赖：caption在定稿最后，视觉前移导致当前assign_by_spec报顺序位置提醒，G1按DOM逐字顺序时需保持定稿DOM顺序、用视觉布局排序；不得复制图注或删其文字。后两卡无图与第一卡带图为原构图差异，不统一套一种卡。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "portrait_parts": [
    {
     "part": 1,
     "source_file": "proxyclean-02-v.png",
     "content": "标题、引子、第一场景卡"
    },
    {
     "part": 2,
     "source_file": "proxyclean-02-v2.png",
     "content": "截图/图注、第2及第3场景卡"
    }
   ]
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
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断开插头",
   "source_phrase": "一个断开的插头",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "不想用代理了，要把飞鸟或 Clash Verge 关掉 \n点“关闭代理，恢复普通上网”。只开着一个代理就直接关它；两个都开着，先让你选一个，另一个保留。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "让 AI 查网络问题或做验收 \nAI用命令行跑同一套程序：读一份去掉了地址和密码的状态报告，或按端口关掉指定代理。9月10日给飞鸟的开机自启做验收时，AI就用它关掉了本机7892端口上的飞鸟，确认自启任务不会把它自己拉起来。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "proxyclean/proxyclean-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r2\\state\\b1-proxyclean-02-v\\round-01\\candidate-1.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9c89b638cb4fccecaf20",
   "title_text": "什么时候打开它",
   "sha256": "f31c207fe1b0e79594a28c92b57340d223e8d5b59508fb0e30952f30b4d4b97d",
   "status": "ready",
   "source_box": [
    14,
    87,
    577,
    226
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 什么时候打开它
平时不用管它。电脑上现在装着两个代理程序：一个开机自己启动，另一个要用时手动开，两个会交替用。上不了网、或者不想再走代理时，从开始菜单点“ProxyClean”（9 月 28 日刚加回去），或双击文件夹里的“00-打开 ProxyClean.vbs”。窗口一打开就把 8 层查一遍，首页一句话说出 Windows 当前的代理是谁；这一步只读本机，不连外网、不改设置，没问题直接关掉就行。

**关掉代理后，网页或终端连不上**
点“检查并修复上网问题”。它先列出哪几项还指着已经关掉的代理，例如“Windows 手动代理设置”“终端代理变量 HTTPS_PROXY”，你确认后才修。什么都没找到，就测一下测试网页打不打得开，再给下一步。

**不想用代理了，要把正在开的代理程序关掉**
点“关闭代理，恢复普通上网”。只开着一个代理就直接关它；两个都开着，先让你选一个，另一个保留。

**让 AI 查网络问题或做验收**
AI 用命令行跑同一套程序：读一份去掉了地址和密码的状态报告，或按端口关掉指定代理。9 月 10 日验收“手动开的那个代理能不能开机自启”时，AI 就用它按端口关掉了这个代理，再看自启任务会不会把它重新拉起来。

首页（9 月 22 日截图）：一句话说出当前用的是哪个代理；这次没发现失效设置

::screen{#proxyclean-03 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-03",
  "section": "usage",
  "title": "点下去之后，出事怎么办",
  "scene": "横版：左上标题。上半部两列并排的流程卡：左列“检查并修复上网问题”，右列“关闭代理，恢复普通上网”；每列 5 个带绿色圆圈序号的小步骤，步骤之间用水彩小箭头往下连。下半部一个浅绿底圆角框“出事怎么办”，里面 5 条带小圆点的短句，两列排。框的右下角画一只小小的水彩撤销箭头。",
  "portrait": "竖版：标题；“检查并修复”五步；“关闭代理”五步；“出事怎么办”五条，一行一条。",
  "links": [
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
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "点下去之后会发生什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "检查并修复上网问题",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none",
     "row": "flows",
     "width": "50%"
    },
    {
     "type": "flow",
     "text_ref": "关闭代理，恢复普通上网",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none",
     "row": "flows",
     "width": "50%"
    },
    {
     "type": "bullet_list",
     "text_ref": "出事怎么办",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版两列大流程卡，每列5步绿色序号，左侧小图标、右正文，小箭头向下；底部整宽“出事怎么办”框，5条按左3右2排列，右下回退插画。flow需把group标题和steps置同一大卡、步骤横向行内排，不把5步拆成5列。bullet_list当前core忽略columns，也不支持底部回退插画定位，待组件接入。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "portrait_parts": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "点下去之后会发生什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "检查并修复上网问题",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "flow",
     "text_ref": "关闭代理，恢复普通上网",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "bullet_list",
     "text_ref": "出事怎么办",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 竖版v第一流程5步＋第二流程5步，每列序号在左、正文整宽条，箭头向下，均省图标；v2毛笔“出事怎么办”标题和5张独立整宽圆点卡。此group标题属于定稿，按原正常层级排，不凭空新增h2。core.bullet_list不能将无lead的5条各拆独立卡，须支持该构图。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "portrait_parts": [
    {
     "part": 1,
     "source_file": "proxyclean-03-v.png",
     "content": "标题、两个完整5步流程"
    },
    {
     "part": 2,
     "source_file": "proxyclean-03-v2.png",
     "content": "出事怎么办、5条独立卡"
    }
   ]
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "重新读一遍设置，列出要改的几项和原因",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-title-58500a6ad9eea0669b2f-a1f04e0b6b91.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-58500a6ad9eea0669b2f",
   "title_text": "点下去之后会发生什么",
   "sha256": "95476cc3a9702333cf1bcca0d35907b525f0e17feadfae0637c4a2f6cd772028",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 点下去之后会发生什么

**检查并修复上网问题**
1. 重新读一遍设置，列出要改的几项和原因
2. 你点“开始修复”后再核一遍：设置没被别人改过、那个代理也没重新开起来；有变化就停
3. 先把原样加密存在本机，再一项一项改，每改一项读回来对一下
4. 改到一半失败，把这次已经改的倒着改回去
5. 通知 Windows 用新设置，再做一次基础网页检查：不走代理、只用 IPv4，依次打开百度和微软的测试页，任一打开就算通过（这不代表海外或 AI 服务能用）。修复不会顺手刷新域名缓存；要分国内、海外、AI 逐站看、区分 IPv4 和 IPv6，另点“检查联网情况”。“设置改好了”和“网页打得开”分两行报

**关闭代理，恢复普通上网**
1. 先请它正常退出，再停它的辅助服务（代理程序自带的 Windows 后台服务，打开代理时要用它，它本身不代理上网；先停掉，免得它把代理重新拉起来）
2. 等 4 秒还没退，只结束刚才核对过身份的那几个进程
3. 代理退干净后，先把原来在跑的辅助服务开回来，再连查几次、确认代理没有自己又起来，下次手动开代理才不会失败
4. 确认端口没被别的程序接走，才清掉指向它的设置，再刷新域名缓存，并做同样的基础网页检查
5. 没退干净或又冒出来，就不说“已关闭”

**出事怎么办**
- 修完不对劲：点首页的“恢复上次修改”，只改回仍是这次改动结果的设置，别人后来又改过的保留；已结束的程序不会被重新打开。
- 上次修改没恢复完：新的修改会被挡住，先恢复。
- 还是上不了网：别反复点修复。窗口会分开说是域名解析失败还是网页连不上；想知道国内、海外、AI 哪一路不通，点“检查联网情况”逐站看，也可以把“复制脱敏诊断”的内容交给 AI 看。
- 关掉代理后，原来要靠代理才打得开的网站仍然打不开，这是正常的；手机和副机经这台电脑用代理的入口也会一起停（入口归〔电脑配置与恢复〕管）。
- 没有自动提醒：失败只显示在窗口里，出问题直接跟 AI 说。

::screen{#proxyclean-04 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-04",
  "section": "tech",
  "title": "它查什么、怎么算失效",
  "scene": "横版：左上标题。左边约 58% 宽一张三列表格（查的地方｜看什么｜默认会不会改），8 行，行首一个小水彩图标（插头、网卡、路标、地球、终端、Git 分叉、齿轮、鲸鱼形的集装箱船但不画 Docker 标志）。表格下面一个浅绿底圆角框“什么算失效”。右边约 38% 宽一个带细灰边框的空截图位，比例 1122:936（约 480×400 像素），框里不画东西，拼页时贴检查详情截图；框下一行灰色小字说明。",
  "portrait": "竖版：标题；表格改成一行一条（粗体地方名，下面“看什么”，再下面“会不会改”）；“什么算失效”框；截图位占满宽和说明。\n本轮仅指定本张排版恢复（其它分张原约定保护）：只本屏第2分张941×1760：保留本张现有原重复标题“它查什么、怎么算“失效””，标题缩到正常层级。表头保留一次；只Git、Windows服务代理、Docker三条整宽上下排，各条名字、看什么、默认会不会改依原顺序，上下排不留窄文字栏。什么算失效全文整宽排。下方纯白截图框约860×717，1122:936原比例，细浅绿边框，无模拟UI，原图注在下。小水彩图标只靠卡名，绿白水彩不改；画布只自然加高约5%，正文约36源像素、行距44、净宽860，不靠过长画布和缩正文塞图。第1分张不动。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/ef31359cc1f89d37144196b5f9a5cf90ec1ae397826b7dfd1e2028b6fa2cbf97.png",
    "where": "右侧约 38% 宽的细边框空位，比例 1122:936",
    "caption": "检查详情（9 月 22 日截图）：8 层逐层列出；还在工作的代理端口和隧道路线都保留",
    "frame_bindings": {
     "v": {
      "EEFB36BCA9786CB8E66130D2B3F1B7FF1A919D9BDE7EE4B33EDB0E5170689485": [
       35,
       1190,
       861,
       1654
      ],
      "157BA171AB03D9F1BE61CAADD7085428878C6A7C5888FA217BE917F86F6202BF": [
       37,
       2883,
       905,
       3371
      ]
     }
    },
    "crop_h": [
     72,
     0,
     597,
     492
    ],
    "crop_v": [
     50,
     166,
     620,
     484
    ]
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它查什么、怎么算",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "查的地方",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "什么算失效",
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "screenshot",
     "text_ref": "检查详情（9 月 22 日截图）",
     "ratio": "1122:936",
     "columns": 1,
     "columns_v": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版左8行3列表（行首小图标），右纯白截图和图注，底部“什么算失效”卡实际整宽，左清单齿轮插画。定稿scene说此框在左表下，本稿按实际横图记录整宽。notice文本是一个para含粗体名，core.content_card不识别该标题并不会拆左图右文；table现组件未使用icons；截图图注视觉在notice前、定稿在notice后，需保持DOM原序而调整视觉。截图1122:936。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它查什么、怎么算",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "查的地方",
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "什么算失效"
    },
    {
     "type": "screenshot",
     "text_ref": "检查详情（9 月 22 日截图）",
     "columns_v": 1,
     "ratio": "1122:936",
     "max_width_v": 860,
     "columns": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 竖版保护约定：第1分张保留不改；只有第2分张941×1760自然增高约5%，原重复标题保留、降到正常层级；表头一次；Git、Windows服务代理、Docker三条整宽上下排，名字/看什么/默认会不会改按原序；“什么算失效”整宽全文；底部纯白860×717截图框按1122:936、细浅绿边和原图注。参考v2目前三条为无图长段，显式portrait要求小水彩图标靠卡名，按该追加要求补位置。组件依赖：8行是单table节点，text_ref不能拆到Git；需在完整行之间按5＋3分张，重复题与表头用data-echo，且第1分张保护。表格转竖卡现有窄label栏不满足第2分张“整宽上下排”。正文约36源像素、行距44，不靠缩正文或拉长画布塞图。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "portrait_parts": [
    {
     "part": 1,
     "source_file": "proxyclean-04-v.png",
     "content": "原标题＋前5表格行",
     "protected": true
    },
    {
     "part": 2,
     "source_file": "proxyclean-04-v2.png",
     "content": "正常层级重复标题/表头、后3整宽条、什么算失效、截图和图注",
     "only_requested_restoration": true
    }
   ]
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
   "source_phrase": "查的地方｜看什么｜默认会不会改",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "本机代理程序｜哪些程序在本机端口上监听，是飞鸟、Clash Verge、Clash for Windows、TAG，还是单独的代理内核｜只在关闭代理时动",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "齿轮",
   "source_phrase": "网卡｜哪些是真的物理网卡、连没连上｜只在维护工具里点名才动",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "默认路线｜上网默认走哪块网卡；网关是 198.18、198.19 开头的，是代理的隧道（TUN）｜只删指向已断开网卡的那条",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "开关",
   "source_phrase": "Windows 手动代理｜代理开关和地址，浏览器和多数桌面程序用它｜指向的本机端口没人在听才关",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "终端代理变量｜HTTP_PROXY、HTTPS_PROXY、ALL_PROXY｜同上，只动当前用户的；系统级的只看",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "Git｜全局 http.proxy、https.proxy｜同上；来源说不清的保留",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "Windows 服务代理｜系统服务用的那套代理（WinHTTP）｜只看不改",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-5ff9913ca695a98ad690.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\proxyclean\\img\\proxyclean-04-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-5ff9913ca695a98ad690",
   "title_text": "它查什么、怎么算“失效”",
   "sha256": "b19eda92ad19de5b3d43444d5708546b8e21117f61e12e0faffb43e23b705ada",
   "status": "ready",
   "source_box": [
    85,
    26,
    853,
    178
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 它查什么、怎么算“失效”

| 查的地方 | 看什么 | 默认会不会改 |
|---|---|---|
| 本机代理程序 | 哪些程序在本机端口上监听，是各家代理程序，还是单独的代理内核 | 只在关闭代理时动 |
| 网卡 | 哪些是真的物理网卡、连没连上 | 只在维护工具里点名才动 |
| 默认路线 | 上网默认走哪块网卡；网关是 198.18、198.19 开头的，是代理的隧道（TUN） | 只删指向已断开网卡的那条 |
| Windows 手动代理 | 代理开关和地址，浏览器和多数桌面程序用它 | 指向的本机端口没人在听才关 |
| 终端代理变量 | HTTP_PROXY、HTTPS_PROXY、ALL_PROXY | 同上，只动当前用户的；系统级的只看 |
| Git | 全局 http.proxy、https.proxy | 同上；来源说不清的保留 |
| Windows 服务代理 | 系统服务用的那套代理（WinHTTP） | 只看不改 |
| Docker | Docker Desktop 自己钉住的代理、最近的运行记录 | 只提示，不改也不重启 |

**什么算失效**：一个代理地址要同时满足两条才算：指向本机（127.0.0.1、::1、localhost），而且那个端口此刻没有程序在听。远程代理、还在工作的、看不清的、一行里混着好几个代理的，都保留。删默认路线前，先确认电脑还有一条正常的物理上网路线；没有这条退路，一条都不删。

检查详情（9 月 22 日截图）：8 层逐层列出；还在工作的代理端口和隧道路线都保留

::screen{#proxyclean-05 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-05",
  "section": "tech",
  "title": "怎么搭的、为什么这样设计",
  "scene": "横版：左上标题。下面两列共 8 张小卡片（左侧一个小水彩图标，粗体小标题，下面两三行正文）：图标依次是 PowerShell 蓝色小窗口（可以画 PowerShell 标志）、一个划掉的小芯片（不用模型）、一把锁和一张纸、一个指向空插孔的箭头被打叉、一面盾牌、一圈围栏、一张没写字的纸、一排打勾的试管。卡片之间留适当空白，不画边框线。",
  "portrait": "竖版：标题；8 张卡片一行一张。",
  "links": [
   {
    "text": "演进",
    "href": "/projects/proxyclean/#history"
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
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎么搭的、为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "一个 PowerShell 小程序",
     "columns": 2,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版8卡按2列4行、顺序逐行左后右；小图左内、卡名粗绿右上，正文右下。原图有细边卡框，而scene说不画边框，风格按批准样板柔和描边统一，具体冲突留根复核。PowerShell标志已点名许可，Docker不画品牌标志。原样存在哪长路径完整可换行。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎么搭的、为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "一个 PowerShell 小程序",
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 竖版v标题＋前3卡（PowerShell、不用模型、原样存在哪），插画左内；v2后5段原图为无边框、无图标的毛笔子标题＋整宽正文，并非5张同款卡。与portrait“8卡一行一张”有差异，按实际图记录。section_heading现组件是否支持精确毛笔子标题图和浓度需主工程师确认，此样式为新构图待样张，不可把所有段统一成一类卡。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。",
   "portrait_parts": [
    {
     "part": 1,
     "source_file": "proxyclean-05-v.png",
     "content": "标题、前3卡"
    },
    {
     "part": 2,
     "source_file": "proxyclean-05-v2.png",
     "content": "后5子标题和正文，无插画无边框"
    }
   ]
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
   "source_phrase": "",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-9a4dc2c50ca35317e642.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9a4dc2c50ca35317e642",
   "title_text": "怎么搭的、为什么这样设计",
   "sha256": "7283eca70e5761921969ea5bb7ff693b30e3a8d8cfadd479ad7649a8ec1c0aec",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 怎么搭的、为什么这样设计

**一个 PowerShell 小程序**
用 PowerShell 写，界面是 Windows 自己的 WPF 窗口：首页、检查详情、维护工具各一个。约 2,500.0 行程序、2,300.0 行测试。Windows 自带的 PowerShell 5.1 和 PowerShell 7 都能跑，装了 7 就用 7。检查在后台跑，窗口不卡，进度条上的字就是正在做的那一步。

**不用 AI 模型**
判断全靠本机规则：读注册表、端口监听表、路由表、进程和服务列表。打开窗口的检查不连外网。会主动连外网的只有三处，都在你点了按钮之后：修复或关闭代理以后的基础网页检查（不走代理、只用 IPv4，依次打开百度和微软的测试页，任一打开就算通过，不代表海外或 AI 服务能用）；你点“检查联网情况”时，才逐站测国内、海外和 AI 服务（不设代理时分 IPv4、IPv6，另测设置里存着、正在监听的 HTTP 代理）；点“比较联网出口”时，问一个公开的查 IP 网站，只说几条路出口相同还是不同。

**原样存在哪**
改之前，原值用 Windows 自带的账户加密，存在本机这个账户的应用数据文件夹里，只有这台电脑、这个 Windows 账户能解开。它只管撤销最近这一次，不是备份，换电脑不带走。

**只清掉，不改成指向别的代理**
失效的设置只清成直连，从不改成指向另一个代理端口：那个端口哪天一关，设置又成了新的残留。6 月为这个断过网，见〔演进〕。

**要管理员权限的**
删默认路线、刷新或重启网卡、改 IPv6、结束以系统身份运行的代理进程。会弹一次 Windows 授权，新窗口用同一个账户、带着你刚才的选择接着做，不用再确认一遍。

**特意不碰的**
自动代理脚本（PAC）、Windows 服务代理、系统级变量、NO_PROXY、Docker 和各个应用自己的代理设置、Tailscale 和虚拟机网卡。普通修复也不刷新域名缓存、不重启网卡、不换 DNS 服务器。

**诊断不落盘**
默认不写日志。“复制脱敏诊断”不带代理密码、公网 IP 和设置原值；远程代理只写成“远程”。

**317 项测试怎么测**
用临时注册表子键、临时 Git 配置和假进程、假服务，不碰正在用的代理。9 月 25 日那一版的 277 项，两种 PowerShell 都全过；9 月 30 日起又补了 40 项，补完后的整套还没在本机重跑过。真的关掉开机自启的那个代理、再把它打开，也还没测过。

::screen{#proxyclean-06 section="highlights"}

```typeset
{
 "screen": {
  "id": "proxyclean-06",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：左上标题。下面左右两张大卡片，每张卡片上方一幅小水彩插画，下面粗体标题，再下面“麻烦”“解法”两小段（“麻烦”两字灰色、“解法”两字绿色）。左卡插画：一棵小树，树根处是一个带窗口的小方块，树干上是一颗齿轮（内核），树枝上挂一个小扳手（辅助服务），树旁边有一个长得很像但没连在树上的小方块。右卡插画：一只放大镜罩在一个白底绿边的小窗口上，窗口旁一把扳手静静放在盒子里、盒盖合着。",
  "portrait": "竖版：标题；两张卡片上下排，插画在每张卡上方。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "认代理靠进程关系",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "none",
     "row": "highlights",
     "illustration_source": "illustration",
     "illustration_index": 0,
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "打开只看，不动手",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "none",
     "row": "highlights",
     "illustration_source": "illustration",
     "illustration_index": 1,
     "width": "50%"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版左右2大卡，竖版上下2大卡。左树根/窗口/齿轮/扳手插画跨出卡顶；右放大镜罩窗口和合盒扳手插画在卡上半部。每卡标题下“麻烦”灰、“解法”绿、其余正文蓝灰。组件依赖：core.content_card只取小icons、忽略above_card/outside的大illustration索引与跨卡顶位置；不能通过icons=none把两幅必要插画丢掉，需支持两卡分别绑定主插画0/1并处理跨卡顶。label颜色需只处理定稿已有“麻烦”“解法”，不加字。 本稿单列illustration节点0/1，使主插画确实分配在两卡各自上方；图卡交叠和麻烦/解法着色仍需组件或布局支持。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。",
   "illustration_bindings": [
    {
     "text_ref": "认代理靠进程关系",
     "index": 0,
     "position": "above_card",
     "overlap_card_top": true
    },
    {
     "text_ref": "打开只看，不动手",
     "index": 1,
     "position": "top_inside"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "认代理靠进程关系",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "none",
     "illustration_source": "illustration",
     "illustration_index": 0
    },
    {
     "type": "content_card",
     "text_ref": "打开只看，不动手",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "none",
     "illustration_source": "illustration",
     "illustration_index": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版左右2大卡，竖版上下2大卡。左树根/窗口/齿轮/扳手插画跨出卡顶；右放大镜罩窗口和合盒扳手插画在卡上半部。每卡标题下“麻烦”灰、“解法”绿、其余正文蓝灰。组件依赖：core.content_card只取小icons、忽略above_card/outside的大illustration索引与跨卡顶位置；不能通过icons=none把两幅必要插画丢掉，需支持两卡分别绑定主插画0/1并处理跨卡顶。label颜色需只处理定稿已有“麻烦”“解法”，不加字。 本稿单列illustration节点0/1，使主插画确实分配在两卡各自上方；图卡交叠和麻烦/解法着色仍需组件或布局支持。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。",
   "illustration_bindings": [
    {
     "text_ref": "认代理靠进程关系",
     "index": 0,
     "position": "above_card",
     "overlap_card_top": true
    },
    {
     "text_ref": "打开只看，不动手",
     "index": 1,
     "position": "top_inside"
    }
   ]
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
   "asset": "_library/illustrations/树枝索引.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "树枝索引",
   "source_phrase": "左卡插画：一棵小树，树根处是一个带窗口的小方块，树干上是一颗齿轮（内核），树枝上挂一个小扳手（辅助服务），树旁边有一个长得很像但没连在树上的小方块。",
   "sha256": "afe98924e00cbe34c88815a7c2e8b9195ae2737f0b90d323144026d20d396946",
   "status": "ready",
   "original_elements": [
    "一棵小树，树根处是一个带窗口的小方块，树干上是一颗齿轮（内核），树枝上挂一个小扳手（辅助服务），树旁边有一个长得很像但没连在树上的小方块"
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
   "asset": "_library/illustrations/main-ai-cli-profile-manager.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "窗口菜单现图小槽4比3",
   "source_phrase": "右卡插画：一只放大镜罩在一个白底绿边的小窗口上，窗口旁一把扳手静静放在盒子里、盒盖合着。",
   "sha256": "005ecff58d5a9fe61cfb8ef593a20e6374a4e41c601c4c1fe98e8841d0f94dea",
   "status": "ready",
   "original_elements": [
    "一只放大镜罩在一个白底绿边的小窗口上，窗口旁一把扳手静静放在盒子里、盒盖合着"
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
   "asset": "_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png",
   "fallback": false,
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

## 亮点

**认代理靠进程关系，不靠端口表**
麻烦：代理的端口会变。6 月的脚本里写死了一张端口表，比如把 7892 当成手动开的那个代理。后来开机自启的那个改用 18091，第三家的旧快捷方式写的又是 18090；手动开的那个，内核端口每次启动都可能不同。通用的代理内核，光看名字也认不出是谁开的。照旧表去认，就会把甲的端口当成乙的。
解法：每次打开都现查哪个程序在本机哪个端口上听，再顺着进程的父子关系往上找：内核是谁启动的就归谁。名字像但不是它启动的，不归过去。首页因此能直接说出 Windows 当前用的是哪个代理。

**打开只看，不动手**
麻烦：第一版双击“一键修复网络”就要管理员权限，马上改路线、代理和变量；有一次删路线时把 WLAN 的默认路线也删了，网彻底断掉。修网的工具反而断了网。
解法：现在打开窗口只读本机：不连外网、不改设置、不要管理员权限，看完没问题直接关掉就行。

::screen{#proxyclean-07 section="features"}

```typeset
{
 "screen": {
  "id": "proxyclean-07",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和电脑配置与恢复页“全部功能”一样的画法，组名不单独占一整列：每组组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下一行小字，第二张没有标题和图例，接着往下排。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：第一张顶上标题、图例和说明；组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）。",
  "links": [],
  "anchors": [
   {
    "id": "g-home",
    "text": "首页两件事"
   },
   {
    "id": "f-status",
    "text": "打开就查"
   },
   {
    "id": "f-repair",
    "text": "检查并修复上网问题"
   },
   {
    "id": "f-close",
    "text": "关闭代理，恢复普通上网"
   },
   {
    "id": "f-undo",
    "text": "恢复上次修改"
   },
   {
    "id": "g-proxy",
    "text": "代理和端口（维护工具）"
   },
   {
    "id": "f-direct",
    "text": "关闭手动代理"
   },
   {
    "id": "f-stop-port",
    "text": "结束占用端口的程序"
   },
   {
    "id": "f-connectivity",
    "text": "检查联网情况"
   },
   {
    "id": "f-exit",
    "text": "比较联网出口"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "proxyclean-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（17 项）",
     "align": "left",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "prose",
     "text_ref": "在用＝至少真用过一次",
     "size": "small"
    },
    {
     "type": "section_heading",
     "text_ref": "首页两件事",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1打开就查",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1,
     "columns_v": 1
    },
    {
     "type": "section_heading",
     "text_ref": "代理和端口（维护工具）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "5关闭手动代理",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1,
     "columns_v": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 通过07-h实际顶左题/单行图例/说明、顶右电脑＋路由器＋地球插画；其下两个组，每组4卡一行，图在卡左内，状态圆点右上，组名毛笔左对齐。scene写三列，本稿以通过图4列记录，根复核后定。须保留全部定稿状态词（原图某些只画圆点），不用旧图删状态文字。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（17 项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例",
     "row_v": true
    },
    {
     "type": "prose",
     "text_ref": "在用＝至少真用过一次",
     "size": "small"
    },
    {
     "type": "section_heading",
     "text_ref": "首页两件事",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1打开就查",
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1,
     "columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "代理和端口（维护工具）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "5关闭手动代理",
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1,
     "columns": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 v顶标题、图例3行2项在左，路由器电脑插画在右；说明整宽；首页组4卡一列。v2代理端口组4卡一列，组名毛笔顶部，每卡左图右文、右上状态点。图例/功能卡新外观待样张；不要为旧图无状态词而删掉定稿文字。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "portrait_parts": [
    {
     "part": 1,
     "source_file": "proxyclean-07-v.png",
     "content": "标题、图例、插画、说明、首页4卡"
    },
    {
     "part": 2,
     "source_file": "proxyclean-07-v2.png",
     "content": "端口组名和4卡"
    }
   ]
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "打开就查｜8 层只读检查，首页一句话说出 Windows 当前代理是谁；可以中途取消｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "检查并修复上网问题｜列出失效设置，确认后存原样、修、读回核对，再测网页｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "关闭代理，恢复普通上网｜请它正常退出，4 秒没退再结束核对过的残留进程，清它的设置，保住下次启动｜说不准",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "恢复上次修改｜只改回仍是上次改动结果的设置；不重启已结束的程序｜没用过",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "关闭手动代理｜不管端口死活，关掉当前用户的手动代理、代理变量和 Git 代理，并删掉隧道的默认路线；不退出代理程序｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "结束占用端口的程序｜选客户端的端口或手输端口，先看要结束哪些进程，端口关了才清只指向它的设置｜在用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "检查联网情况｜分别测国内、海外和 AI 服务，IPv4、IPv6 和开着的 HTTP 代理都测；解析失败和连不上分开报｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "比较联网出口｜问 ipify 几条路各从哪出去，只说相同还是不同，不显示 IP｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-b97dc51af18801a6558a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b97dc51af18801a6558a",
   "title_text": "全部功能（17 项）",
   "sha256": "5a37cda99b5e726c7700d3c6cce4043cfc18590b5e8c45cc17258a27621c1b17",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 全部功能（17 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
在用＝至少真用过一次；待验收＝做好了，还没在真实使用里验过；没用过＝每用一次都会留下记录，现在一份都没有；说不准＝用了不一定留记录，也没找到真实调用。

**首页两件事**
1. 打开就查｜8 层只读检查，首页一句话说出 Windows 当前代理是谁；可以中途取消｜在用
2. 检查并修复上网问题｜列出失效设置，确认后存原样、修、读回核对，再测网页｜说不准
3. 关闭代理，恢复普通上网｜请它正常退出，4 秒没退再结束核对过的残留进程，清它的设置，保住下次启动｜说不准
4. 恢复上次修改｜只改回仍是上次改动结果的设置；不重启已结束的程序｜没用过

**代理和端口（维护工具）**
5. 关闭手动代理｜不管端口死活，关掉当前用户的手动代理、代理变量和 Git 代理，并删掉隧道的默认路线；不退出代理程序｜说不准
6. 结束占用端口的程序｜选客户端的端口或手输端口，先看要结束哪些进程，端口关了才清只指向它的设置｜在用
7. 检查联网情况｜分别测国内、海外和 AI 服务，IPv4、IPv6 和开着的 HTTP 代理都测；解析失败和连不上分开报｜说不准
8. 比较联网出口｜问一个公开的查 IP 网站，几条路各从哪出去，只说相同还是不同，不显示 IP｜说不准

::screen{#proxyclean-08 section="features"}

```typeset
{
 "screen": {
  "id": "proxyclean-08",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：和电脑配置与恢复页“全部功能”一样的画法，组名不单独占一整列：每组组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下一行小字，第二张没有标题和图例，接着往下排。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。这一张右下角另留一个带细灰边框的空截图位，比例 1208:979（约 400×324 像素），框里不画东西，拼页时贴维护工具截图；框下一行灰色小字说明。“旧入口和旧做法”一组的卡片底色比其他组淡一点。",
  "portrait": "竖版：接着上一张往下排，卡片一行一张；最后放截图位（占满宽，比例 1208:979）和说明。",
  "links": [],
  "anchors": [
   {
    "id": "g-network",
    "text": "网卡与连接（维护工具）"
   },
   {
    "id": "f-wifi-soft",
    "text": "刷新连接"
   },
   {
    "id": "f-wifi-reset",
    "text": "重启网卡"
   },
   {
    "id": "f-dns",
    "text": "刷新域名缓存"
   },
   {
    "id": "f-ipv6",
    "text": "IPv6 查看和开关"
   },
   {
    "id": "g-see",
    "text": "看清楚、交给 AI"
   },
   {
    "id": "f-details",
    "text": "检查详情"
   },
   {
    "id": "f-copy-diag",
    "text": "复制脱敏诊断"
   },
   {
    "id": "f-cli",
    "text": "让 AI 在命令行跑"
   },
   {
    "id": "g-legacy",
    "text": "旧入口和旧做法"
   },
   {
    "id": "f-legacy",
    "text": "旧版入口"
   },
   {
    "id": "f-fallback",
    "text": "常驻兜底层"
   }
  ],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/0578a570cb624aecd8bd0c14b9c028eb02e1d3668b9310d36357a12573e8a34c.png",
    "where": "右下角细边框空位，比例 1208:979",
    "caption": "维护工具（9 月 22 日截图）：代理设置、结束占用端口的程序、网卡与连接三组",
    "crop_v": [
     40,
     202,
     870,
     782
    ]
   }
  ],
  "chain": "proxyclean-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "网卡与连接（维护工具）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9刷新连接",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "看清楚、交给 AI",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "13检查详情",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "旧入口和旧做法",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "16旧版入口",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "screenshot",
     "text_ref": "维护工具（9 月 22 日截图）",
     "ratio": "1208:979",
     "columns_v": 1,
     "columns": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版不重复章节标题/图例；首组卡9/10/11三列，12整宽一行；第二组13/14/15三列；末组16/17两卡约占2列，第三列为纯白截图和图注。旧组卡面更淡。组件依赖：首4项同一个steps节点，text_ref不能从编号12拆块，需feature_card支持最后项跨3列，不可假装3列网格自动符合原图；旧组淡卡面也需组件支持。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。",
   "item_layout_intent": {
    "feature_9_to_12": {
     "columns": 3,
     "rows": [
      [
       9,
       10,
       11
      ],
      [
       12
      ]
     ],
     "item_12_span": 3
    },
    "feature_13_to_15": {
     "columns": 3,
     "rows": [
      [
       13,
       14,
       15
      ]
     ]
    },
    "legacy_row": {
     "columns": 3,
     "items": [
      16,
      17,
      "screenshot"
     ]
    }
   }
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "网卡与连接（维护工具）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9刷新连接",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "看清楚、交给 AI",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "13检查详情",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "旧入口和旧做法",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "16旧版入口",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "screenshot",
     "text_ref": "维护工具（9 月 22 日截图）",
     "ratio": "1208:979",
     "columns_v": 1,
     "columns": 1
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 竖版v先组9–12共4卡，再组13–15共3卡；v2旧组16/17共2卡，最后整宽截图和图注。原v2“已停用”为红圆点，定稿scene要求灰叉，按scene灰叉，不用红色。其余状态只给状态点颜色，不染正文。截图1208:979，不模拟UI。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "item_layout_intent": {
    "rows": "one_card_per_row",
    "part_item_counts": [
     7,
     2
    ],
    "last": "screenshot_and_caption"
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
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "刷新连接｜给选定网卡刷新域名缓存、释放再续租地址；固定地址的网卡不动｜说不准",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "重启网卡｜禁用再启用选定网卡，出错也会尝试重新启用｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "刷新域名缓存｜只清缓存，不换 DNS 服务器｜说不准",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "开关",
   "source_phrase": "IPv6 查看和开关｜看各网卡的 IPv6 和默认路线；只改物理网卡，Tailscale、虚拟机网卡不动｜说不准",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "检查详情｜分层列出查了什么、哪个端口在跑、保留了什么，还有这次每一步的时间｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "复制脱敏诊断｜复制一份给 AI 看的技术数据，不含代理密码、公网 IP 和设置原值｜说不准",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "让 AI 在命令行跑｜同一套程序的命令行版，结果输出成 JSON：状态报告、预览和修复、撤销、按端口关、网卡、IPv6｜在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "旧版入口｜11 个旧快捷方式（一键修复网络、关闭 7892 飞鸟等）还能用，现在只打开窗口预览｜说不准",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "常驻兜底层｜开机在后台跑一个隐藏的代理内核兜底，把全机代理都指到它；6 月 29 日起不再启用，8 月 6 日退役；9 月 29 日连留作参考的配置和两个小脚本也删了｜已停用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  }
 ]
}
```

**网卡与连接（维护工具）**
9. 刷新连接｜给选定网卡刷新域名缓存、释放再续租地址；固定地址的网卡不动｜说不准
10. 重启网卡｜禁用再启用选定网卡，出错也会尝试重新启用｜说不准
11. 刷新域名缓存｜只清缓存，不换 DNS 服务器｜说不准
12. IPv6 查看和开关｜看各网卡的 IPv6 和默认路线；只改物理网卡，Tailscale、虚拟机网卡不动｜说不准

**看清楚、交给 AI**
13. 检查详情｜分层列出查了什么、哪个端口在跑、保留了什么，还有这次每一步的时间｜说不准
14. 复制脱敏诊断｜复制一份给 AI 看的技术数据，不含代理密码、公网 IP 和设置原值｜说不准
15. 让 AI 在命令行跑｜同一套程序的命令行版，结果整理成 AI 直接能读的格式：状态报告、预览和修复、撤销、按端口关、网卡、IPv6｜在用

**旧入口和旧做法**
16. 旧版入口｜11 个旧快捷方式（一键修复网络、关闭 7892 上的代理程序等）还能用，现在只打开窗口预览｜说不准
17. 常驻兜底层｜开机在后台跑一个隐藏的代理内核兜底，把全机代理都指到它；6 月 29 日起不再启用，8 月 6 日退役；9 月 29 日连留作参考的配置和两个小脚本也删了｜已停用

维护工具（9 月 22 日截图）：代理设置、结束占用端口的程序、网卡与连接三组

::screen{#proxyclean-09 section="history"}

```typeset
{
 "screen": {
  "id": "proxyclean-09",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。一条从上往下弯曲的水彩绿色丝带时间线，左侧是日期（粗体绿色），右侧一两行说明；6 月 29 日那一格旁边画一个小小的断开的插头和一片落叶，表示那次断网之后的转折；9 月 22 日那一格旁边画一个白底绿边的小窗口。时间线分左右两栏排，上半年在左、9 月在右，不挤。",
  "portrait": "竖版：时间线一条竖下来，日期在上、说明在下，一行一条。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进（北京时间）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "6 月 24 日",
     "direction": "vertical",
     "columns": 2,
     "connector": "ribbon",
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "6月24日–10月6日共",
     "align": "center",
     "size": "small"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 横版两栏连续时间线，左7条6/24–8/31，右9条9/5–9/29；每项小图左、日期上、说明下；绿色弯曲丝带位于两栏之间带圆点和向下箭头；底汇总居中。组件依赖：单stats节点含16项，text_ref不能从9月5日拆；timeline.direction=vertical固定一列，columns=2目前无效，需内部按7＋9分栏而非均分8＋8，丝带仍中央连接；日期num作为日期排，不放大成统计数字。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "item_layout_intent": {
    "columns": 2,
    "column_item_counts": [
     7,
     9
    ],
    "ribbon_position": "between_columns"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进（北京时间）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "timeline",
     "text_ref": "6 月 24 日",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "6月24日–10月6日共",
     "align": "center",
     "size": "small"
    }
   ],
   "notes": "实际查看全部有效横竖图；replace_images 的6张通过新图优先。文字只取定稿page.json，不复刻旧图错字、漏字、额外符号；所有新外观先出组件样张。全宽章节标题按追加要求居中，栏内标题保持原对齐；毛笔字保持原浓度。 竖版一条左侧水彩弯曲丝带，圆点对齐整宽卡，日期上说明下；v4条6/24–6/29有左插画，v2六条7/1–9/18无插画，v3六条9/22–9/29无插画，末汇总居中。组件依赖：timeline只能整组插画/整组无图，需每项可用插画，前4项插画保留，后12项不补；单stats节点须按4＋6＋6完整节点分张，不从项目中间切断；丝带圆点与卡对齐且分张接续。；本轮核对：纵向流程显式direction=vertical，双插画显式index=0/1，竖数字卡补columns_v。；二轮续审按文字纠正：02竖版截图先于全部场景卡、04横版失效说明归表格左栏、05竖版8卡统一、07功能横3列，删除原图未要求的独立插画/步骤图标。",
   "item_layout_intent": {
    "columns": 1,
    "part_item_counts": [
     4,
     6,
     6
    ],
    "illustrated_items": [
     1,
     2,
     3,
     4
    ],
    "ribbon_position": "left"
   }
  }
 },
 "images": [
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

## 演进（北京时间）

- **6 月 24 日**｜第一版：双击“一键修复网络”自动提权，清四类残留（隧道留下的默认路线、指着死端口的系统代理和终端变量、假地址的域名缓存），并把设置对齐到“正在跑的那个代理”。
- **6 月 26 日**｜加“常驻兜底层”：后台跑一个隐藏的代理内核，把系统代理、终端变量、Git 都指到它。
- **6 月 28 日**｜顺带记下一次“家里 Wi-Fi 上更新不了节点”的排查：是代理服务商拒绝了家里宽带的地址，不是电脑网络坏了。
- **6 月 29 日**｜吃了亏以后改成“安全版”：兜底的隐藏进程没起来时，全机设置都指着一个死端口，整机断网，前后两次；旧版删路线时还误删过 WLAN 的默认路线。从此只清掉、不改成指向别的代理，没有物理上网路线就一条路线都不删；兜底层不再启用。
- **7 月 1 日**｜删掉“把终端变量对齐到正在跑的代理”的脚本；加按端口关代理的快捷方式；定下 Claude Code 走 TUN，终端不设代理变量。
- **8 月 6 日**｜检查和清理不再写死端口表，每次现查哪个端口在听（按端口关代理的脚本还留着旧表）；兜底层正式退役。
- **8 月 31 日**｜按端口关代理时，只关在本机地址上监听的程序。
- **9 月 5–8 日**｜并入 IPv6 查看和开关（只动物理网卡）；删路线前必须有物理网卡兜底。
- **9 月 10 日**｜AI 验收手动开的那个代理能不能开机自启时，用它关掉 7892 端口上的这个代理。
- **9 月 18 日**｜加恢复记录：改前加密存原值，失败倒着改回，能“恢复上次修改”；按端口关代理先核对进程身份，不再按旧端口表连带结束整个客户端。
- **9 月 22 日**｜重做成中文窗口：首页只留两件事，维护工具和检查详情各开一个窗口；11 个旧快捷方式挪进“旧版入口”，也只打开预览。
- **9 月 24 日**｜修两个毛病：关闭代理后清设置时注册表写不进去；系统代理关着时，关闭代理的预览会报错。
- **9 月 25 日**｜关闭代理改成一次点击，保住下次启动要用的辅助服务，域名解析失败单独报；277 项测试全过。
- **9 月 26 日**｜说明精简成 10 行，过程文档删掉（留在 Git 历史里）。
- **9 月 28 日**｜开始菜单加回“ProxyClean”。
- **9 月 29 日**｜常驻兜底层留作参考的配置和两个小脚本也删了，它早就没人用。
- **9 月 30 日**｜关闭代理和中途失败后的恢复更稳；同一类代理内核开了好几个时分开认、分开关；联网测试按网站分别报，国内网页通了不再算作全都通。

6 月 24 日–10 月 6 日共 37 次提交。

::screen{#proxyclean-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "proxyclean-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/proxyclean/checking.png",
    "caption": "检查中（9 月 24 日旧网站用的截图）：打开程序先查当前代理，能看到正在做哪一步，也可以取消；这一步还不改网络。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/proxyclean/home.png",
    "caption": "首页（9 月 24 日旧网站用的截图）：显示 Windows 当前用的代理和检查结论；能正常上网就不用操作，需要时再选检查修复或关闭代理。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/proxyclean/no-fix-found.png",
    "caption": "没找到可修的项（9 月 24 日旧网站用的截图）：测试网页也没确认连通，程序给出下一步，并说明没有重启网卡、没改无线设置。这页的提示文字后来改过，以现在的程序为准。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "text_ref": "画廊",
     "type": "chapter_title",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "text_ref": "检查中（9月24日旧网站用的截图）：打开程序先查当前代理，能看到正在做哪一步，也可",
     "indices": [
      0,
      1,
      2
     ],
     "columns": 3,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "1092:876",
      "1092:876",
      "1092:876"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      },
      {
       "index": 1,
       "node_indices": [
        1
       ]
      },
      {
       "index": 2,
       "node_indices": [
        2
       ]
      }
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "text_ref": "画廊",
     "type": "chapter_title",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "text_ref": "检查中（9月24日旧网站用的截图）：打开程序先查当前代理，能看到正在做哪一步，也可",
     "indices": [
      0,
      1,
      2
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "1092:876",
      "1092:876",
      "1092:876"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      },
      {
       "index": 1,
       "node_indices": [
        1
       ]
      },
      {
       "index": 2,
       "node_indices": [
        2
       ]
      }
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-media/personal-media-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6f966a995ad3884757df",
   "title_text": "画廊",
   "sha256": "684661ca34ff0c625b805441d00e0e5836abb3717728e32fde7a67139c618a97",
   "status": "ready",
   "source_box": [
    47,
    0,
    352,
    185
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 画廊

点击图片，可以查看完整原图。

检查中（9 月 24 日旧网站用的截图）：打开程序先查当前代理，能看到正在做哪一步，也可以取消；这一步还不改网络。

首页（9 月 24 日旧网站用的截图）：显示 Windows 当前用的代理和检查结论；能正常上网就不用操作，需要时再选检查修复或关闭代理。

没找到可修的项（9 月 24 日旧网站用的截图）：测试网页也没确认连通，程序给出下一步，并说明没有重启网卡、没改无线设置。这页的提示文字后来改过，以现在的程序为准。
