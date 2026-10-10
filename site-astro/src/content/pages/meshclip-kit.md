---
{
 "title": "双机剪贴板",
 "kind": "project",
 "url": "/projects/meshclip-kit/",
 "tagline": "两台电脑互相粘贴复制的文字，也能互传文件",
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
  "page": "meshclip-kit",
  "kind": "project",
  "title": "双机剪贴板",
  "url": "/projects/meshclip-kit/",
  "tagline": "两台电脑互相粘贴复制的文字，也能互传文件",
  "status": "偶尔用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/meshclip-kit",
  "capability": "两台电脑共用剪贴板、互传文件",
  "based_on": {
   "commit": "61fa792e13b586d6e9dae14b99cf99dc4d423a93",
   "commit_time": "2026-09-29T01:16:49+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，白底水彩风格，从开头这屏的插画出发，镜头不动：台式机屏幕上浮起一张绿色小便签，沿着两台电脑之间那张浅绿色的网滑过去，落进笔记本屏幕，笔记本键盘上的 Ctrl 和 V 两个键帽轻轻按下一次；接着一个小文件夹从笔记本飞回台式机；台式机旁的小绿狗低头看一眼怀表，尾巴摇一下；两台电脑任务栏的小图标轻轻呼吸；周围水彩叶子微微摇动，最后回到起始画面，首尾无缝。不出现任何文字。",
  "registry": {
   "groups": [
    {
     "id": "g-share",
     "name": "同步和传输"
    },
    {
     "id": "g-link",
     "name": "连接和放行"
    },
    {
     "id": "g-recover",
     "name": "自动恢复"
    },
    {
     "id": "g-control",
     "name": "看和管"
    },
    {
     "id": "g-setup",
     "name": "安装和收尾"
    }
   ],
   "features": [
    {
     "id": "f-text-sync",
     "group": "g-share",
     "name": "文字同步",
     "what": "在一台复制文字，另一台直接粘贴；在线、尽力同步；9 月 29 日 01:25 两个方向实测通过",
     "how": "这台复制，那台粘贴",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\PRODUCT.md:19,32-35；修复对话：9/29 01:25 主机、副机互发剪贴板真实测试通过（没走验收向导，主机没有 acceptance 目录）"
    },
    {
     "id": "f-file-transfer",
     "group": "g-share",
     "name": "文件互传",
     "what": "在两台之间发文件，收进对方“下载”文件夹",
     "how": "在任务栏的 KDE Connect 里选文件发过去",
     "status": "说不准",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\PRODUCT.md:20；只有 8/15 两端插件目录变动和 9/18 电脑使用记录里打开过 KDE Connect 窗口，分不出是不是真用"
    },
    {
     "id": "f-android",
     "group": "g-share",
     "name": "安卓平板",
     "what": "平板连上同一张私有网络后一起同步剪贴板和文件",
     "how": "还没做",
     "status": "待实施",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\ANDROID.md:1-17；README.md:3"
    },
    {
     "id": "f-cross-network",
     "group": "g-link",
     "name": "跨网连接",
     "what": "不在同一个网络，经 Tailscale 私有网络互通；无人值守，没登录也在线",
     "how": "自动，不用管",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\WINDOWS.md:14-16；9/28 21:53 自检 Tailscale 在线、无人值守、ping 通对面"
    },
    {
     "id": "f-exact-peer",
     "group": "g-link",
     "name": "只认那一台",
     "what": "每台两条入站规则只放对面；配对要两边人确认",
     "how": "安装时配好，之后不用管",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\SECURITY.md:27-47；两台防火墙组 MeshClip Kit 各 2 条规则启用；自检 Exact-peer firewall PASS"
    },
    {
     "id": "f-tighten-broad",
     "group": "g-link",
     "name": "收紧宽泛规则",
     "what": "发现放得太宽的 KDE Connect 旧规则，先预览，确认后停用并记下，能还原",
     "how": "让 AI 配置对端时按提示确认",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\WINDOWS.md:54-65；主机 %LOCALAPPDATA%\\MeshClipKit\\user-state.json disabledBroadFirewallRules 2 条"
    },
    {
     "id": "f-login-start",
     "group": "g-recover",
     "name": "登录自动启动",
     "what": "登录后 KDE Connect 和看门狗各自启动；只在主机上，副机按需手动打开",
     "how": "自动",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\WINDOWS.md:23-27；主机开机启动文件夹两个快捷方式；9/27 21:24 重启后托盘程序在跑"
    },
    {
     "id": "f-watchdog",
     "group": "g-recover",
     "name": "自动拉起",
     "what": "看门狗每 60 秒看托盘程序在不在，不在就拉起来；只在主机上",
     "how": "自动；要停用控制中心暂停",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\watch-kdeconnect.ps1:5-72；9/27 21:26 拉起托盘程序（心跳 restartCount=1）"
    },
    {
     "id": "f-supervisor",
     "group": "g-recover",
     "name": "看门狗的看门狗",
     "what": "计划任务每 2 分钟看看门狗在不在；只在主机上",
     "how": "自动",
     "status": "在用",
     "screen": "meshclip-kit-07",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\MeshClip.Common.psm1:10-13,1035；任务 \\MeshClip Kit\\KDE Connect Watchdog 9/28 21:43 运行结果 0"
    },
    {
     "id": "f-control-center",
     "group": "g-control",
     "name": "控制中心",
     "what": "看守护开没开、上次心跳、下次检查、有没有做了一半的操作",
     "how": "双击仓库根目录的 MeshClip控制中心.vbs",
     "status": "说不准",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\control-center.ps1；打开不留记录；副机版本没有它"
    },
    {
     "id": "f-pause",
     "group": "g-control",
     "name": "暂停自动拉起",
     "what": "暂停一小时、暂停直到恢复、恢复守护；不关正在跑的 KDE Connect",
     "how": "控制中心里点按钮",
     "status": "没用过",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\MeshClip.Transaction.ps1:285-296；会写 watchdog-control.json，两台都没有"
    },
    {
     "id": "f-doctor",
     "group": "g-control",
     "name": "自检",
     "what": "22 项分层检查，不打印地址和设备编号；副机按需模式下 KDE Connect 关着也算正常；严格模式把提醒也算不过",
     "how": "跟 AI 说查一下，或控制中心点“完整诊断”",
     "status": "在用",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\doctor.ps1；旧网站 9/18 刷新时调用过（wly0829.cn\\.panel-refresh\\source-evidence\\collector-meshclip-kit.json）；提交 61fa792 删掉“包含密码”提醒、加按需模式判断；9/29 03:42 主机实跑 22 项 21 PASS 1 WARN"
    },
    {
     "id": "f-acceptance",
     "group": "g-control",
     "name": "双机验收向导",
     "what": "生成 100 条测试字串和测试文件，收到后比内容指纹；只认人实测",
     "how": "控制中心点“双机验收向导”，或让 AI 带着做",
     "status": "没用过",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\acceptance.ps1:22-49；Prepare 必建 %LOCALAPPDATA%\\MeshClipKit\\acceptance，两台都没有"
    },
    {
     "id": "f-install",
     "group": "g-setup",
     "name": "一键安装",
     "what": "装官方包、开无人值守、建登录启动、看门狗和计划任务",
     "how": "让 AI 在新电脑上装",
     "status": "在用",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\install-windows.ps1；两台 8/11 装过（本地状态文件）"
    },
    {
     "id": "f-on-demand",
     "group": "g-setup",
     "name": "副机按需部署",
     "what": "先核对提交号；装两个官方包，保留配对和放行规则，只删项目建的登录启动，不装看门狗，记成按需模式",
     "how": "让 AI 在副机上先预览再部署",
     "status": "在用",
     "screen": "meshclip-kit-08",
     "source": "scripts/deploy-on-demand.ps1（提交 61fa792）；修复对话：副机已部署为按需开关"
    },
    {
     "id": "f-configure-peer",
     "group": "g-setup",
     "name": "指定对端",
     "what": "把对面写进 KDE Connect 设置，建两条只认它的规则",
     "how": "让 AI 配置，配对由我在两边点",
     "status": "在用",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\configure-peer.ps1；两台 customDevices 各 1 项"
    },
    {
     "id": "f-recover",
     "group": "g-setup",
     "name": "中断恢复",
     "what": "装到一半断了，先看预览再倒着撤回；别的程序改过的不动",
     "how": "跟 AI 说装到一半断了",
     "status": "说不准",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\docs\\RECOVERY-AND-CONTROL.md:9-18；9/18 才加，之后两台都没再装或配置过，从没出现待恢复"
    },
    {
     "id": "f-uninstall",
     "group": "g-setup",
     "name": "卸载还原",
     "what": "撤掉项目加的规则、快捷方式和计划任务；可选还原停用的旧规则和无人值守",
     "how": "让 AI 卸载，先预览再加 -Apply",
     "status": "说不准",
     "screen": "meshclip-kit-08",
     "source": "V:\\Personal\\Projects\\meshclip-kit\\scripts\\uninstall.ps1:1-150；没有用过的记录"
    }
   ],
   "numbers": [
    {
     "id": "n-machines",
     "text": "2 台",
     "meaning": "主机和副机，互为唯一的 MeshClip 对端",
     "as_of": "2026-09-28",
     "source": "两台 KDE config 的 customDevices 各 1 项；防火墙组 MeshClip Kit 各 2 条",
     "screens": [
      "meshclip-kit-01"
     ]
    },
    {
     "id": "n-rules",
     "text": "2 条",
     "meaning": "每台电脑上项目建的放行规则（TCP、UDP 各一条）",
     "as_of": "2026-09-28",
     "source": "Get-NetFirewallRule -Group 'MeshClip Kit'，两台各 2 条",
     "screens": [
      "meshclip-kit-01",
      "meshclip-kit-04",
      "meshclip-kit-06",
      "meshclip-kit-07"
     ]
    },
    {
     "id": "n-interval",
     "text": "每 60 秒 / 每 2 分钟",
     "meaning": "看门狗检查间隔 / 计划任务检查看门狗的间隔",
     "as_of": "2026-09-28",
     "source": "watch-kdeconnect.ps1:6；MeshClip.Common.psm1:13（PT2M）",
     "screens": [
      "meshclip-kit-01",
      "meshclip-kit-03",
      "meshclip-kit-04",
      "meshclip-kit-06",
      "meshclip-kit-07"
     ]
    },
    {
     "id": "n-checks",
     "text": "22 项；21 项通过、1 项要人确认",
     "meaning": "主机自检项数和结果",
     "as_of": "2026-09-29",
     "source": "北京 9/29 03:42 实跑 doctor.ps1 -Summary -AsJson：21 PASS、1 WARN（配对要人确认）",
     "screens": [
      "meshclip-kit-01",
      "meshclip-kit-03",
      "meshclip-kit-08"
     ]
    },
    {
     "id": "n-broad",
     "text": "2 条",
     "meaning": "主机上停用的放得太宽的 KDE Connect 旧入站规则",
     "as_of": "2026-09-28",
     "source": "%LOCALAPPDATA%\\MeshClipKit\\user-state.json 的 disabledBroadFirewallRules 条数",
     "screens": [
      "meshclip-kit-06"
     ]
    },
    {
     "id": "n-lines",
     "text": "3138 行",
     "meaning": "14 个脚本文件总行数（PowerShell、VBScript，不算测试，含空行注释）",
     "as_of": "2026-09-29",
     "source": "wc -l scripts/* MeshClip控制中心.vbs",
     "screens": [
      "meshclip-kit-05"
     ]
    },
    {
     "id": "n-tests",
     "text": "85 条",
     "meaning": "Pester 自动测试用例（It 块）",
     "as_of": "2026-09-29",
     "source": "grep -c '^\\s*It ' tests/*.ps1：50＋24＋11",
     "screens": [
      "meshclip-kit-05",
      "meshclip-kit-09"
     ]
    },
    {
     "id": "n-commits",
     "text": "10 次",
     "meaning": "全部提交，8 月 11 日–9 月 29 日（北京时间）",
     "as_of": "2026-09-29",
     "source": "git log --oneline | wc -l",
     "screens": [
      "meshclip-kit-05"
     ]
    },
    {
     "id": "n-features",
     "text": "18 项",
     "meaning": "全部功能条数",
     "as_of": "2026-09-29",
     "source": "registry.features",
     "screens": [
      "meshclip-kit-07"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-remote-control",
     "with": "remote-control",
     "direction": "分工",
     "flow": "AI 到另一台电脑办事（包括读写那台的剪贴板）归电脑远程控制；人自己在两台之间复制粘贴、传文件归这里。两者都连着同一对主机和副机，但走不同的路：远程控制走 Cloudflare 隧道和副机入口，这里走 Tailscale 上的 KDE Connect",
     "source": "b1\\remote-control\\page.json remote-control-08 第 16 项“系统小工具”含剪贴板；本项目 README.md:3"
    },
    {
     "id": "r-timeaudit",
     "with": "timeaudit",
     "direction": "分工",
     "flow": "本机复制过什么、再次复制归电脑使用与性能记录的剪贴板历史；这里只管两台之间同步",
     "source": "E:\\Projects\\Tools\\TimeAudit\\clipboard_history\\README.md；PCConfig task_purpose_catalog.json:491"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "登记在",
     "flow": "看门狗计划任务的用途和换机重建（序号 500）、项目恢复入口、副机恢复清单里要拉的仓库都登记在电脑配置与恢复",
     "source": "PCConfig docs/governance/scheduled_task_purpose_catalog.md:71；docs/recovery/scheduled_tasks_rebuild.md:94；registries/project_restore_anchors.json:212；tools/secondary-laptop-recovery/config/desired.yaml:194"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "被用到",
     "flow": "从密码中心查看窗口复制的密码会经这里同步到另一台；规则认定这是正常用法，不加防同步",
     "source": "E:\\.agents\\skills\\local-secret-broker\\references\\credential-operations.md:28-34"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "受管",
     "flow": "维护档“偶用”和“可信的同步设备可以同步密码”都写在规则里",
     "source": "E187 agents.context-sources.md:50；agents.privacy-data.md:22"
    },
    {
     "id": "r-tailscale-skill",
     "with": "skill:tailscale-safe-exposure",
     "direction": "被参考",
     "flow": "Tailscale 开放和双机互通的技能把这里的自检、恢复和控制中心当参考入口",
     "source": "E:\\.agents\\skills\\tailscale-safe-exposure\\SKILL.md:93"
    },
    {
     "id": "r-tailscale",
     "with": "ext:tailscale",
     "direction": "用它",
     "flow": "两台连进同一张私有网络；无人值守，没登录也在线",
     "source": "docs/PRODUCT.md:5；THIRD_PARTY_NOTICES.md:8"
    },
    {
     "id": "r-kdeconnect",
     "with": "ext:kde-connect",
     "direction": "用它",
     "flow": "剪贴板文字同步、文件传输、配对和加密",
     "source": "docs/PRODUCT.md:5；THIRD_PARTY_NOTICES.md:9"
    },
    {
     "id": "r-winget",
     "with": "ext:winget",
     "direction": "用它",
     "flow": "安装 Tailscale.Tailscale、KDE.KDEConnect 官方包",
     "source": "scripts/install-windows.ps1:34-36"
    },
    {
     "id": "r-github",
     "with": "ext:github",
     "direction": "发布到",
     "flow": "公开仓库只放脚本和说明，不接收剪贴板和文件",
     "source": "docs/PRODUCT.md:6-7"
    }
   ],
   "highlights": [
    {
     "id": "h-reboot-recovery",
     "title": "强制重启以后，它自己回来了",
     "screen": "meshclip-kit-06"
    },
    {
     "id": "h-narrow-firewall",
     "title": "放得太宽的旧规则，收成只认一台",
     "screen": "meshclip-kit-06"
    },
    {
     "id": "h-localized-count",
     "title": "对面明明不在线，自检却数出 1 台",
     "screen": "meshclip-kit-06"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L25",
     "screen": "meshclip-kit-01",
     "text": "偶尔用 · 只修报错，不加新功能〔约法 L25〕"
    },
    {
     "target": "/projects/remote-control/",
     "screen": "meshclip-kit-01",
     "text": "想让 AI 到另一台电脑上办事……是另一个项目：〔电脑远程控制〕"
    },
    {
     "target": "/projects/timeaudit/",
     "screen": "meshclip-kit-02",
     "text": "要找以前复制过的东西，是〔电脑使用与性能记录〕的剪贴板历史"
    },
    {
     "target": "/rules/charter/#L14",
     "screen": "meshclip-kit-03",
     "text": "密码跟着同步是正常用法〔约法 L14〕"
    },
    {
     "target": "/rules/charter/#L28",
     "screen": "meshclip-kit-06",
     "text": "屏幕上什么都不弹〔约法 L28〕"
    },
    {
     "target": "/how/#meshclip-kit",
     "screen": "meshclip-kit-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/cockpit/#meshclip-kit",
     "screen": "meshclip-kit-01",
     "text": "现在正不正常 → 驾驶舱"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "主机看门狗现在正不正常：计划任务有没有按时跑、心跳新不新鲜（副机没装看门狗，只能显示“副机未装”）",
     "source": "主机计划任务 \\MeshClip Kit\\KDE Connect Watchdog 的 LastRunTime、LastTaskResult、NextRunTime；%LOCALAPPDATA%\\MeshClipKit\\watchdog-status.json 的 status、observedUtc、nextCheckUtc；或 control-center.ps1 -AsJson"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“配对与防火墙”拆成 f-exact-peer（只认那一台）和 f-tighten-broad（收紧宽泛规则）：后者是单独的开关，主机真用过一次，前者是常态。",
    "底稿“自动恢复”拆成 f-login-start、f-watchdog、f-supervisor 三条：三层各自启动、各自有证据，副机只剩第一层。",
    "底稿“控制中心”拆成 f-control-center（看状态）和 f-pause（暂停／恢复）：暂停会留文件、能判“没用过”，看状态不留痕只能判“说不准”。",
    "底稿之外补了 6 条现役代码里有的：f-doctor、f-acceptance、f-install、f-configure-peer、f-recover、f-uninstall；底稿 future_scope 的“安卓平板同步”按“待实施”列为 f-android（旧稿曾放进 dropped）。"
   ],
   "dropped": [
    "旧稿亮点“密码管理器里复制的密码，配对时就设成不同步到另一台”没上：主机上没保存过剪贴板插件设置，没有证据真关了；而且现行规则（E187 privacy-data:22）认定经可信同步设备同步密码是正常用法，这条已和规则相反。",
    "test-repository.ps1（解析、秘密扫描、跑 Pester）不算功能，没单列；自动测试数字放在“为什么这样设计”。",
    "configure-peer 的“修复旧版重复的 General 段”只是配置兼容细节，并进 f-configure-peer，没单列。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏“这里只管我自己在两台之间复制粘贴、传文件”；第 2 屏“两台开机、我登录 Windows 后……”和“跟 AI 这样说就行”三句；第 3 屏“现在的规则认定两台都是我的可信电脑”；第 4、5 屏“都用我自己的账号”“要我在两台上各点一次确认”。都是按项目文档和规则改写的，没有本人原话。",
    "“包含密码”：9 月 29 日提交 61fa792 已删掉自检里要求关它的提醒和文档里的要求，页面按此改；开关本身现在是开是关没查（按规则开着也正常）。",
    "文字同步改标“在用”：修复对话报 9 月 29 日 01:25 两台互发剪贴板真实测试通过（我没有自己在两台上复核）。文件互传仍标“说不准”：没有实测记录；8/15 两端插件目录有变动，分不出是测试还是真用。",
    "副机看门狗 8/12 后没再跑：已按“副机按需开关”定下，9 月 29 日副机用 deploy-on-demand.ps1 部署成按需模式（修复对话报的，我没有上副机核对登录启动是否真删掉）。",
    "副机 KDE Connect 还配对着一台 type=phone 的设备，不在本项目范围（项目只管两台 Windows），页面没写；是不是本人的手机、要不要留，未查。",
    "“2 秒内到”是项目的设计目标（PRODUCT.md:47），从没实测过；页面写成“设计目标”。",
    "第 6 屏“9 月 27 日 21:26 看门狗把托盘程序拉起来”是按进程启动时间（看门狗 21:26:01、托盘 21:26:23）和心跳 restartCount=1 推的，没有逐条日志；也可能 KDE 自己的开机快捷方式同时在启动，只是看门狗先到。9 月 28 日写完稿后电脑又重启了一次，页面数字截至重启前 21:53。",
    "主机时区设成美国中部时间（-05:00），控制中心截图里心跳那两行时间带 -05:00；截图说明没提时区，读者可能看不懂那两行。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/meshclip-kit/page.json",
  "sha256": "33bc59575239882b74ba5810b3b9414de3431d4ec3849524f0e79da7589b25f9",
  "converted_at_beijing": "2026-10-10T10:13:22+08:00"
 }
}
---

::screen{#meshclip-kit-01 section="top"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，标题下一枚浅绿底小圆角标签写状态那一行（“约法 L25”画成链接样式），下面一段介绍。右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。中间一排四张数字卡片（上面小插画、大号绿色数字、下面一两行小字，右下角浅灰小字写截至日期）：卡 1 两台电脑并排，卡 2 一扇只开了一条缝的小门，卡 3 一只怀表，卡 4 一张打了很多勾、最后两格是黄色感叹号的清单。数字卡片下面一行两个按钮：白底细绿边长按钮写“在整套系统里的位置 → 怎么协作”，带 GitHub 小猫标志的按钮写“GitHub”。再下面一行灰色小字（其中“电脑远程控制”画成绿色链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着一个留空的浅色圆角长框（约占横条宽度的 55%、高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮“现在正不正常 → 驾驶舱”。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：大标题、状态标签、介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；两个按钮各占一行；灰色小字一段；最下面“现在”横条：上面“现在”和空框（占满宽度），下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "约法 L25",
    "href": "/rules/charter/#L25"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#meshclip-kit"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/meshclip-kit"
   },
   {
    "text": "电脑远程控制",
    "href": "/projects/remote-control/"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#meshclip-kit"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/meshclip-kit/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run"
  ],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "大标题：双机剪贴板",
     "align": "left",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "偶尔用·只修报错、不加新功能（约法L2"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "prose",
     "text_ref": "介绍：主机（台式机）和副机（笔记本）不在同一个网络，",
     "row": "hero",
     "width": "55%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%",
     "asset": "_library/illustrations/双机互传-活画空场-20261004.png"
    },
    {
     "type": "prose",
     "text_ref": "截至10月10"
    },
    {
     "type": "feature_card",
     "text_ref": "12台主机和副机，互为唯一的对端22条每台电脑上的放",
     "columns": 4,
     "portrait_columns": 2,
     "illustration": "top_inside",
     "icons": "auto",
     "variant": "stat"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作"
    },
    {
     "type": "prose",
     "text_ref": "想让AI到另一台电脑上办事（读写文件、跑命令，也能直"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上毛笔艺术字大标题，标题下一枚浅绿底小圆角标签写状态那一行（“约法 L25”画成链接样式），下面一段介绍。右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。中间一排四张数字卡片（上面小插画、大号绿色数字、下面一两行小字，右下角浅灰小字写截至日期）：卡 1 两台电脑并排，卡 2 一扇只开了一条缝的小门，卡 3 一只怀表，卡 4 一张打了很多勾、最后两格是黄色感叹号的清单。数字卡片下面一行两个按钮：白底细绿边长按钮写“在整套系统里的位置 → 怎么协作”，带 GitHub 小猫标志的按钮写“GitHub”。再下面一行灰色小字（其中“电脑远程控制”画成绿色链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着一个留空的浅色圆角长框（约占横条宽度的 55%、高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮“现在正不正常 → 驾驶舱”。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
     "portrait": "竖版：大标题、状态标签、介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；两个按钮各占一行；灰色小字一段；最下面“现在”横条：上面“现在”和空框（占满宽度），下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。"
    },
    "desktop_component_order": [
     "chapter_title",
     "tag",
     "prose",
     "inline_link",
     "illustration",
     "notice",
     "stat_card",
     "content_card",
     "action_button",
     "live_strip",
     "icon",
     "numbered_steps"
    ],
    "portrait_component_order": [
     "tag",
     "illustration",
     "stat_card",
     "prose",
     "action_button",
     "live_strip",
     "chapter_title",
     "inline_link",
     "notice",
     "content_card",
     "icon",
     "numbered_steps"
    ]
   },
   "pending_requirements": [
    "数字卡定稿解析为steps；应4张大号绿色数字卡，当前feature_card能保字而未提供steps→stat视觉，交comp-hub。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "大标题：双机剪贴板",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "偶尔用·只修报错、不加新功能（约法L2"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "prose",
     "text_ref": "介绍：主机（台式机）和副机（笔记本）不在同一个网络，"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/双机互传-活画空场-20261004.png"
    },
    {
     "type": "prose",
     "text_ref": "截至10月10"
    },
    {
     "type": "feature_card",
     "text_ref": "12台主机和副机，互为唯一的对端22条每台电脑上的放",
     "columns": 4,
     "portrait_columns": 2,
     "illustration": "top_inside",
     "icons": "auto",
     "variant": "stat"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作"
    },
    {
     "type": "prose",
     "text_ref": "想让AI到另一台电脑上办事（读写文件、跑命令，也能直"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上毛笔艺术字大标题，标题下一枚浅绿底小圆角标签写状态那一行（“约法 L25”画成链接样式），下面一段介绍。右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。中间一排四张数字卡片（上面小插画、大号绿色数字、下面一两行小字，右下角浅灰小字写截至日期）：卡 1 两台电脑并排，卡 2 一扇只开了一条缝的小门，卡 3 一只怀表，卡 4 一张打了很多勾、最后两格是黄色感叹号的清单。数字卡片下面一行两个按钮：白底细绿边长按钮写“在整套系统里的位置 → 怎么协作”，带 GitHub 小猫标志的按钮写“GitHub”。再下面一行灰色小字（其中“电脑远程控制”画成绿色链接）。最下面一条细长圆角横条“现在”：左边“现在”两个字，接着一个留空的浅色圆角长框（约占横条宽度的 55%、高度和按钮一样，网页程序往里填字，框里不画任何字），最右边按钮“现在正不正常 → 驾驶舱”。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
     "portrait": "竖版：大标题、状态标签、介绍在上；插画放在介绍下面，占满宽度；四张数字卡两两一行共两行；两个按钮各占一行；灰色小字一段；最下面“现在”横条：上面“现在”和空框（占满宽度），下面按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。"
    },
    "desktop_component_order": [
     "chapter_title",
     "tag",
     "prose",
     "inline_link",
     "illustration",
     "notice",
     "stat_card",
     "content_card",
     "action_button",
     "live_strip",
     "icon",
     "numbered_steps"
    ],
    "portrait_component_order": [
     "tag",
     "illustration",
     "stat_card",
     "prose",
     "action_button",
     "live_strip",
     "chapter_title",
     "inline_link",
     "notice",
     "content_card",
     "icon",
     "numbered_steps"
    ]
   },
   "pending_requirements": [
    "数字卡定稿解析为steps；应4张大号绿色数字卡，当前feature_card能保字而未提供steps→stat视觉，交comp-hub。"
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
   "source_phrase": "2 台｜主机和副机，互为唯一的对端",
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
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "2 条｜每台电脑上的放行规则：只认那一台，只开 KDE Connect 的端口",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "每 60 秒｜主机上的看门狗查一次 KDE Connect 在不在，不在就拉起来",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "22 项｜自检；9 月 29 日 03:42 查：21 项通过、1 项要人确认",
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
   "asset": "_library/illustrations/双机互传.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双机互传",
   "source_phrase": "右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。",
   "sha256": "3f61967dde6017572aaecfa5de1dffeda67f7735d0849312a76ae9567aef86ba",
   "status": "ready",
   "original_elements": [
    "左边一台台式机（显示器亮着"
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
   "asset": "_library/round3/titles/title-r3-b0cc204ea4e3cde95f30.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b0cc204ea4e3cde95f30",
   "title_text": "双机剪贴板",
   "sha256": "f19bedbcf242d19d9a1131077151df0bacd33882119c721966bce1ed816ed987",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

大标题：双机剪贴板

偶尔用 · 只修报错、不加新功能（〔约法 L25〕）

介绍：主机（台式机）和副机（笔记本）不在同一个网络，也能共用剪贴板：在一台复制文字，到另一台直接粘贴；文件也能互相发。干活的是两个现成的开源软件——Tailscale 把两台连进同一张私有网络，KDE Connect 同步剪贴板、传文件；这个项目是一套脚本，负责把它们装好、只对那一台放行、断了自己拉起来。

数字卡片（截至 10 月 10 日）：
1. **2 台**｜主机和副机，互为唯一的对端
2. **2 条**｜每台电脑上的放行规则：只认那一台，只开 KDE Connect 的端口
3. **每 60 秒**｜主机上的看门狗查一次 KDE Connect 在不在，不在就拉起来
4. **22 项**｜自检；10 月 10 日 05:20 查，21 项通过；剩下那项只是副机此刻没开 KDE Connect，副机本来就按需才开

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

想让 AI 到另一台电脑上办事（读写文件、跑命令，也能直接读写那台的剪贴板），是另一个项目：〔电脑远程控制〕；这里只管我自己在两台之间复制粘贴、传文件。

现在　〔现在正不正常 → 驾驶舱〕

::screen{#meshclip-kit-02 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-02",
  "section": "usage",
  "title": "怎么用",
  "scene": "横版：左上标题。左边约五分之三宽，上下三张横向卡片，每张左边一幅小水彩插画：1 两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽；2 一个文件夹从一台电脑飞进另一台的“下载”文件夹，旁边一张照片也被装进文件夹里一起飞；3 一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签。卡片标题粗体，下面正文或列表。右边约五分之二宽，上面一张便签样式的小卡片，标题“跟 AI 这样说就行”，下面三句话各带一个对话气泡小图标；下面一行小字（“电脑使用与性能记录”画成链接）。",
  "portrait": "竖版：标题在上；三张卡片一行一张，插画在卡片顶部；“跟 AI 这样说就行”卡片在下，占满宽度；最后一行小字。",
  "links": [
   {
    "text": "电脑使用与性能记录",
    "href": "/projects/timeaudit/"
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
     "text_ref": "怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "平时什么都不用管",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside"
    },
    {
     "type": "dialogue",
     "text_ref": "跟AI这样说就行",
     "columns": 3,
     "split_items": true,
     "icons": "auto",
     "illustration": "left_inside"
    },
    {
     "type": "prose",
     "text_ref": "要找以前复制过的东西，是电脑使用与性能记录的剪贴板历"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。\n2026-10-04 空白专查追加（AI实施；本人本轮明确授权重排）：三种使用说明整宽三列，三句既有问法整宽三列，保持文字和图标的原次序，收掉右短左长白区。 定稿和素材原件不改。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左边约五分之三宽，上下三张横向卡片，每张左边一幅小水彩插画：1 两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽；2 一个文件夹从一台电脑飞进另一台的“下载”文件夹，旁边一张照片也被装进文件夹里一起飞；3 一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签。卡片标题粗体，下面正文或列表。右边约五分之二宽，上面一张便签样式的小卡片，标题“跟 AI 这样说就行”，下面三句话各带一个对话气泡小图标；下面一行小字（“电脑使用与性能记录”画成链接）。",
     "portrait": "竖版：标题在上；三张卡片一行一张，插画在卡片顶部；“跟 AI 这样说就行”卡片在下，占满宽度；最后一行小字。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "notice",
     "prose",
     "inline_link",
     "bullet_list"
    ],
    "portrait_component_order": [
     "content_card",
     "prose",
     "illustration",
     "chapter_title",
     "icon",
     "notice",
     "inline_link",
     "bullet_list"
    ]
   },
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "平时什么都不用管",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside"
    },
    {
     "type": "dialogue",
     "text_ref": "跟AI这样说就行",
     "columns": 1,
     "split_items": true,
     "icons": "auto",
     "illustration": "left_inside"
    },
    {
     "type": "prose",
     "text_ref": "要找以前复制过的东西，是电脑使用与性能记录的剪贴板历"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左边约五分之三宽，上下三张横向卡片，每张左边一幅小水彩插画：1 两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽；2 一个文件夹从一台电脑飞进另一台的“下载”文件夹，旁边一张照片也被装进文件夹里一起飞；3 一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签。卡片标题粗体，下面正文或列表。右边约五分之二宽，上面一张便签样式的小卡片，标题“跟 AI 这样说就行”，下面三句话各带一个对话气泡小图标；下面一行小字（“电脑使用与性能记录”画成链接）。",
     "portrait": "竖版：标题在上；三张卡片一行一张，插画在卡片顶部；“跟 AI 这样说就行”卡片在下，占满宽度；最后一行小字。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "notice",
     "prose",
     "inline_link",
     "bullet_list"
    ],
    "portrait_component_order": [
     "content_card",
     "prose",
     "illustration",
     "chapter_title",
     "icon",
     "notice",
     "inline_link",
     "bullet_list"
    ]
   },
   "pending_requirements": []
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
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "两台都登录着、KDE Connect 在跑时才同步；睡着的电脑不会被叫醒，没登录也收不了文件",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
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
   "source_phrase": "离线时复制的，对方上线后不补发",
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
   "source_phrase": "两台几乎同时复制，谁盖过谁不保证",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/双机互传.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双机互传",
   "source_phrase": "左边约五分之三宽，上下三张横向卡片，每张左边一幅小水彩插画：1 两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽；2 一个文件夹从一台电脑飞进另一台的“下载”文件夹，旁边一张照片也被装进文件夹里一起飞；3 一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签。",
   "sha256": "3f61967dde6017572aaecfa5de1dffeda67f7735d0849312a76ae9567aef86ba",
   "status": "ready",
   "original_elements": [
    "两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽"
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
   "asset": "_library/illustrations/双机互传.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双机互传",
   "source_phrase": "左边约五分之三宽，上下三张横向卡片，每张左边一幅小水彩插画：1 两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽；2 一个文件夹从一台电脑飞进另一台的“下载”文件夹，旁边一张照片也被装进文件夹里一起飞；3 一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签。",
   "sha256": "3f61967dde6017572aaecfa5de1dffeda67f7735d0849312a76ae9567aef86ba",
   "status": "ready",
   "original_elements": [
    "一个文件夹从一台电脑飞进另一台的抽象图形文件夹，旁边一张照片也被装进文件夹里一起飞"
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
   "asset": "_library/illustrations/双机互传.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双机互传",
   "source_phrase": "左边约五分之三宽，上下三张横向卡片，每张左边一幅小水彩插画：1 两台电脑之间一张便签飞过去，笔记本键盘上按着 Ctrl 和 V 两个键帽；2 一个文件夹从一台电脑飞进另一台的“下载”文件夹，旁边一张照片也被装进文件夹里一起飞；3 一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签。",
   "sha256": "3f61967dde6017572aaecfa5de1dffeda67f7735d0849312a76ae9567aef86ba",
   "status": "ready",
   "original_elements": [
    "一台合上盖子睡着的笔记本（头顶画 Zz）和一张没飞出去的便签"
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
   "asset": "_library/round3/titles/title-r3-9fe7ee9705091075f9a6.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\meshclip-kit\\img\\meshclip-kit-02-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9fe7ee9705091075f9a6",
   "title_text": "怎么用",
   "sha256": "c038ec3c038c442742b47f8ba4768302d518cc4ff2e1c7bab1e1aa7b318f70f6",
   "status": "ready",
   "source_box": [
    29,
    0,
    388,
    206
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 怎么用

**平时什么都不用管**
主机开机、我登录 Windows 后，KDE Connect 自己在任务栏右下角启动；笔记本要同步时打开 KDE Connect，不用就退出。在主机上复制一段字，到笔记本上按 Ctrl+V 就是它；反过来也一样。设计目标是 2 秒内到。

**传文件**
在任务栏的 KDE Connect 里选文件发给另一台，收到的放进对方的“下载”文件夹。图片也当文件发：复制的图片不会同步。

**什么时候不同步**
- 两台都登录着、KDE Connect 在跑时才同步；睡着的电脑不会被叫醒，没登录也收不了文件
- 离线时复制的，对方上线后不补发
- 两台几乎同时复制，谁盖过谁不保证
- 只同步文字

**跟 AI 这样说就行**
- “两台电脑的剪贴板不同步了，查一下”
- “笔记本收不到主机发的文件”
- “刚才装到一半断了，先看看要恢复什么”

要找以前复制过的东西，是〔电脑使用与性能记录〕的剪贴板历史，不归这里。

::screen{#meshclip-kit-03 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-03",
  "section": "usage",
  "title": "出事怎么办，现在能不能用",
  "scene": "横版：左上标题。左右两栏。左栏“出事怎么办”：五张横向小卡片，每张左边一个小水彩图标（静音的铃铛、一叠从下往上打勾的清单、一只小狗叼回一个托盘图标、一支倒着走的箭头绕回原点、一个暂停按钮），粗体一句加一两行小字。右栏上半留一个带细浅绿边框的截图空位（宽高比约 5:4，占右栏宽度的全部），截图下面一行小字是截图说明；右栏下半一张浅绿细卡片，标题“现在能不能用”，里面三行，每行左边一个小图标（台式机、笔记本、两台之间一条虚线），“约法 L14”画成链接样式。 本轮根已实际看1600px现役contain真实控制中心截图：主题/控制按钮/诊断结构清楚，正常左右白边保留；截图自身比例由编译完整保持，不以空框数学比例差再重画。左侧五个困境与大标题关系清楚，不为重复“出事怎么办”辅助组名另画。本轮仅清写原“现在的规则”的在字，其他原文/图面保持。",
  "portrait": "竖版：标题在上；“出事怎么办”五张卡一行一张；截图占满宽度，下面截图说明；“现在能不能用”卡片在最下，三行上下排。",
  "links": [
   {
    "text": "约法 L14",
    "href": "/rules/charter/#L14"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/ea4f08c6059e94037efde44a3670b8c046f9ba4afd2ce669c54533ea5270328a.png",
    "where": "右栏上半，宽高比约 5:4 的细浅绿边框空位（竖版在“出事怎么办”下面占满宽度）",
    "caption": "控制中心（9 月 28 日 21:52 截图）：上面一排是暂停、诊断和验收的按钮，下面是原样的状态——守护开着、心跳新鲜、看门狗 1 个、没有待恢复的操作；最后几行写着文字同步和传文件都还没验收（这是前一晚的状态，第二天已测通双向文字）",
    "portrait_locator_text": "控制中心（9 月 28 日 21:52 截图）：上面一排是暂停、诊断"
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
     "text_ref": "出事怎么办，现在能不能用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "出事怎么办",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "feature_card",
     "text_ref": "KDE Connect 自己退出了",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "screenshot",
     "ratio": "1223:964"
    },
    {
     "type": "prose",
     "text_ref": "控制中心（9月28日21:52截图）：上面一排是暂停"
    },
    {
     "type": "points_card",
     "text_ref": "现在能不能用（主机10月10",
     "whole_block": true,
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "none",
     "paragraph_header_prefix": "**现在能不能用**",
     "item_images": [
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/icons/笔记本电脑.png",
      "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png"
     ],
     "inner_columns": 3
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。\n2026-10-04 大空白专查最终排法（AI实施，本人本轮授权重排）：五条处理办法分为38%前两卡、37%后三卡两列，右25%完整截图与紧接图注；三条现状在下方整宽三列。所有定稿字句、五条办法/图标及说明的DOM次序原样保留。截图框用1223:964完整自然比例，不硬裁，图标不删。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左右两栏。左栏“出事怎么办”：五张横向小卡片，每张左边一个小水彩图标（静音的铃铛、一叠从下往上打勾的清单、一只小狗叼回一个托盘图标、一支倒着走的箭头绕回原点、一个暂停按钮），粗体一句加一两行小字。右栏上半留一个带细浅绿边框的截图空位（宽高比约 5:4，占右栏宽度的全部），截图下面一行小字是截图说明；右栏下半一张浅绿细卡片，标题“现在能不能用”，里面三行，每行左边一个小图标（台式机、笔记本、两台之间一条虚线），“约法 L14”画成链接样式。 本轮根已实际看1600px现役contain真实控制中心截图：主题/控制按钮/诊断结构清楚，正常左右白边保留；截图自身比例由编译完整保持，不以空框数学比例差再重画。左侧五个困境与大标题关系清楚，不为重复“出事怎么办”辅助组名另画。本轮仅清写原“现在的规则”的在字，其他原文/图面保持。",
     "portrait": "竖版：标题在上；“出事怎么办”五张卡一行一张；截图占满宽度，下面截图说明；“现在能不能用”卡片在最下，三行上下排。"
    },
    "desktop_component_order": [
     "chapter_title",
     "comparison",
     "content_card",
     "icon",
     "action_button",
     "section_heading",
     "screenshot",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ],
    "portrait_component_order": [
     "content_card",
     "chapter_title",
     "comparison",
     "icon",
     "action_button",
     "section_heading",
     "screenshot",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ]
   },
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办，现在能不能用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "出事怎么办",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "screenshot",
     "ratio": "1223:964"
    },
    {
     "type": "prose",
     "text_ref": "控制中心（9月28日21:52截图）：上面一排是暂停"
    },
    {
     "type": "points_card",
     "text_ref": "现在能不能用（主机10月10",
     "whole_block": true,
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "none",
     "paragraph_header_prefix": "**现在能不能用**",
     "item_images": [
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/icons/笔记本电脑.png",
      "_library/fix-round-2/icon-clean-52188346609616ef9b0b.png"
     ]
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左右两栏。左栏“出事怎么办”：五张横向小卡片，每张左边一个小水彩图标（静音的铃铛、一叠从下往上打勾的清单、一只小狗叼回一个托盘图标、一支倒着走的箭头绕回原点、一个暂停按钮），粗体一句加一两行小字。右栏上半留一个带细浅绿边框的截图空位（宽高比约 5:4，占右栏宽度的全部），截图下面一行小字是截图说明；右栏下半一张浅绿细卡片，标题“现在能不能用”，里面三行，每行左边一个小图标（台式机、笔记本、两台之间一条虚线），“约法 L14”画成链接样式。 本轮根已实际看1600px现役contain真实控制中心截图：主题/控制按钮/诊断结构清楚，正常左右白边保留；截图自身比例由编译完整保持，不以空框数学比例差再重画。左侧五个困境与大标题关系清楚，不为重复“出事怎么办”辅助组名另画。本轮仅清写原“现在的规则”的在字，其他原文/图面保持。",
     "portrait": "竖版：标题在上；“出事怎么办”五张卡一行一张；截图占满宽度，下面截图说明；“现在能不能用”卡片在最下，三行上下排。"
    },
    "desktop_component_order": [
     "chapter_title",
     "comparison",
     "content_card",
     "icon",
     "action_button",
     "section_heading",
     "screenshot",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ],
    "portrait_component_order": [
     "content_card",
     "chapter_title",
     "comparison",
     "icon",
     "action_button",
     "section_heading",
     "screenshot",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ]
   },
   "pending_requirements": []
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
   "asset": "_library/icons/铃铛.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "铃铛",
   "source_phrase": "静音的铃铛",
   "sha256": "56b2a813f19362acfb646d67474d0542cda7469044b3dc36dff5f80d88d1bd91",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一叠从下往上打勾的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "一只小狗叼回一个托盘图标",
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
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一支倒着走的箭头绕回原点",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "source_phrase": "一个暂停按钮",
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
   "asset": "_library/round3/titles/title-r3-040a79d0da21f03a3d5c.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\meshclip-kit\\img\\meshclip-kit-03-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-040a79d0da21f03a3d5c",
   "title_text": "出事怎么办，现在能不能用",
   "sha256": "dbcf59e7fdec31c4f8e352ead22e01c7e0445d41efc49579e50add72b94239b9",
   "status": "ready",
   "source_box": [
    24,
    64,
    919,
    212
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 出事怎么办，现在能不能用

**出事怎么办**
- **没有自动提醒。** 粘贴不出来就是信号，直接跟 AI 说。
- **AI 先跑自检。** 22 项从下往上查：Tailscale 在不在线、对面 ping 不 ping 得通，KDE Connect 在不在跑、放行规则对不对，看门狗每分钟写一次的心跳（一行时间和状态）新不新鲜。结果只写“通过、提醒、失败、不知道”，不写对面的地址和设备编号。9 月 29 日修掉一个误报：计划任务每 2 分钟新起一个看门狗，它见已有一个就退出，退出前那一秒左右会被多数一个、报“没在跑”；现在已有老的在跑时，刚起不到 5 秒的那个不算。
- **KDE Connect 自己退出了。** 主机上的看门狗 1 分钟内把它拉起来；看门狗自己没了，计划任务 2 分钟内再把看门狗拉起来。
- **装到一半断了。** 先看恢复预览，列出哪几步做了一半；确认后倒着撤回，别的程序改过的地方留着不动。
- **想让它暂时别自己拉起来。** 双击仓库里的“MeshClip控制中心”，点“暂停一小时”或“暂停直到恢复”；暂停不会关掉正在跑的 KDE Connect。

控制中心（9 月 28 日 21:52 截图）：上面一排是暂停、诊断和验收的按钮，下面是原样的状态——守护开着、心跳新鲜、看门狗 1 个、没有待恢复的操作；最后几行写着文字同步和传文件都还没验收（这是前一晚的状态，第二天已测通双向文字）

**现在能不能用**（主机 10 月 10 日查，其余 9 月 29 日查）
- **主机**：10 月 10 日 05:20 自检，21 项通过；唯一的提醒是此刻连不上副机的 KDE Connect，因为副机按需才开。9 月 29 日那次的提醒是两边配对要人确认是同一台，程序看得到对面在线，确认配对只能人做。以前还有一条要求关掉 KDE Connect 的“包含密码”（同步剪贴板时带不带上从密码管理器复制的密码），9 月 29 日删了：现在的规则认定两台都是我的可信电脑，密码跟着同步是正常用法〔约法 L14〕。
- **副机**：按需开关，要和主机同步剪贴板时才打开 KDE Connect，关着是正常的（原因见“为什么这样设计”第 7 条），所以用不着自动拉起。9 月 29 日副机换成新版本、登记成按需模式：不随登录启动、不装看门狗，KDE Connect 关着时自检也不报错；放行规则在。
- **两台之间**：Tailscale 能 ping 通对面，KDE Connect 也看得到它。9 月 29 日 01:25 主机、副机互相复制粘贴，两个方向都到了；传文件还没找到实测记录，验收单的 100 条测试字串也还没跑。

::screen{#meshclip-kit-04 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题。上半屏一幅示意图：左边一台台式机、右边一台笔记本，中间一张浅绿色的网（画 Tailscale 标志），写着“主机 ⇄ Tailscale 私有网络 ⇄ 副机”那一行。主机电脑下面竖着叠四块积木，从下往上：Tailscale、KDE Connect（画 KDE Connect 标志）、看门狗（一只小绿狗）、计划任务（一个小日历）；每块积木旁是对应那行字；积木外面围一圈篱笆，篱笆上一扇小门，表示防火墙那一句。笔记本只画 Tailscale 和 KDE Connect 两块，不画看门狗和计划任务，也不画虚线空框或手动打开它们的标签。下半屏一张三列表格（圆角外框、浅绿表头），六行，每行最左一个小水彩图标（网、两个互传的便签、一扇门、一只小狗、一个包裹、一个打叉的芯片）。表格下面一行灰色小字。",
  "portrait": "竖版：标题在上；示意图改成上下排：台式机和它的积木在上，中间那张网，笔记本和积木在下；主机四层说明和防火墙那句一行一条；表格改成一行一条（环节粗体，下面“用的什么”和“细节”）；最后一行灰色小字。",
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
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "主机⇄Tailscale私有网络⇄副机",
     "layout": "layers",
     "layers": [
      {
       "count": 1
      },
      {
       "count": 1
      },
      {
       "count": 4,
       "columns": 4,
       "columns_v": 1
      },
      {
       "count": 1
      }
     ],
     "connector": "bidirectional",
     "illustration": "above_card",
     "icons": [
      "_library/icons/地球.png",
      "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
      "_library/icons/地球.png",
      "_library/icons/共享节点.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/icons/日历时钟.png",
      "_library/icons/门.png"
     ]
    },
    {
     "type": "table",
     "text_ref": "环节用的什么细节连通Tailscale（主机装的1.",
     "variant": "row_cards",
     "row_icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "副机按需开关，用不着自动拉起（见“为什么这样设计”第"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。上半屏一幅示意图：左边一台台式机、右边一台笔记本，中间一张浅绿色的网（画 Tailscale 标志），写着“主机 ⇄ Tailscale 私有网络 ⇄ 副机”那一行。主机电脑下面竖着叠四块积木，从下往上：Tailscale、KDE Connect（画 KDE Connect 标志）、看门狗（一只小绿狗）、计划任务（一个小日历）；每块积木旁是对应那行字；积木外面围一圈篱笆，篱笆上一扇小门，表示防火墙那一句。笔记本只画 Tailscale 和 KDE Connect 两块，不画看门狗和计划任务，也不画虚线空框或手动打开它们的标签。下半屏一张三列表格（圆角外框、浅绿表头），六行，每行最左一个小水彩图标（网、两个互传的便签、一扇门、一只小狗、一个包裹、一个打叉的芯片）。表格下面一行灰色小字。",
     "portrait": "竖版：标题在上；示意图改成上下排：台式机和它的积木在上，中间那张网，笔记本和积木在下；主机四层说明和防火墙那句一行一条；表格改成一行一条（环节粗体，下面“用的什么”和“细节”）；最后一行灰色小字。"
    },
    "desktop_component_order": [
     "chapter_title",
     "topology",
     "prose",
     "tag",
     "table",
     "icon",
     "illustration",
     "numbered_steps"
    ],
    "portrait_component_order": [
     "topology",
     "prose",
     "table",
     "chapter_title",
     "tag",
     "icon",
     "illustration",
     "numbered_steps"
    ]
   },
   "pending_requirements": [
    "主机4层、副机仅2层的双机网图及篱笆门；现有topology将文字单元排成层，不能把主副机各自积木与图正确绑定。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "主机⇄Tailscale私有网络⇄副机",
     "layout": "layers",
     "layers": [
      {
       "count": 1
      },
      {
       "count": 1
      },
      {
       "count": 4,
       "columns": 4,
       "columns_v": 1
      },
      {
       "count": 1
      }
     ],
     "connector": "bidirectional",
     "illustration": "above_card",
     "icons": [
      "_library/icons/地球.png",
      "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
      "_library/icons/地球.png",
      "_library/icons/共享节点.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/icons/日历时钟.png",
      "_library/icons/门.png"
     ]
    },
    {
     "type": "table",
     "text_ref": "环节用的什么细节连通Tailscale（主机装的1.",
     "variant": "row_cards",
     "row_icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "副机按需开关，用不着自动拉起（见“为什么这样设计”第"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。上半屏一幅示意图：左边一台台式机、右边一台笔记本，中间一张浅绿色的网（画 Tailscale 标志），写着“主机 ⇄ Tailscale 私有网络 ⇄ 副机”那一行。主机电脑下面竖着叠四块积木，从下往上：Tailscale、KDE Connect（画 KDE Connect 标志）、看门狗（一只小绿狗）、计划任务（一个小日历）；每块积木旁是对应那行字；积木外面围一圈篱笆，篱笆上一扇小门，表示防火墙那一句。笔记本只画 Tailscale 和 KDE Connect 两块，不画看门狗和计划任务，也不画虚线空框或手动打开它们的标签。下半屏一张三列表格（圆角外框、浅绿表头），六行，每行最左一个小水彩图标（网、两个互传的便签、一扇门、一只小狗、一个包裹、一个打叉的芯片）。表格下面一行灰色小字。",
     "portrait": "竖版：标题在上；示意图改成上下排：台式机和它的积木在上，中间那张网，笔记本和积木在下；主机四层说明和防火墙那句一行一条；表格改成一行一条（环节粗体，下面“用的什么”和“细节”）；最后一行灰色小字。"
    },
    "desktop_component_order": [
     "chapter_title",
     "topology",
     "prose",
     "tag",
     "table",
     "icon",
     "illustration",
     "numbered_steps"
    ],
    "portrait_component_order": [
     "topology",
     "prose",
     "table",
     "chapter_title",
     "tag",
     "icon",
     "illustration",
     "numbered_steps"
    ]
   },
   "pending_requirements": [
    "主机4层、副机仅2层的双机网图及篱笆门；现有topology将文字单元排成层，不能把主副机各自积木与图正确绑定。"
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
   "source_phrase": "网",
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
   "source_phrase": "两个互传的便签",
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
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇门",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
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
   "source_phrase": "一只小狗",
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
   "asset": "_library/icons/纸箱.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "纸箱",
   "source_phrase": "一个包裹",
   "sha256": "37f5c6a705967fa0907c2069cc8f4398087977585b3ac6c9ec9fa9bf20e095d7",
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
   "source_phrase": "一个打叉的芯片",
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
   "asset": "_library/round3/clean-assets/png/46-地球-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "地球",
   "source_phrase": "主机⇄Tailscale私有网络⇄副机\n主机上四层，各管各的：\nTailscale  Windows 服务，开机就在线，没登录 Windows 也在（“无人值守”）\n\nKDE Connect  登录后启动：任务栏里一个托盘程序，加一个后台程序收发数据\n\n看门狗  登录后隐藏启动，每 60 秒看一眼托盘程序，不在就拉起来\n\n计划任务  每 2 分钟看一眼看门狗，不在就拉起来\n\n外面再加一道门：防火墙只放两条规则进来。",
   "sha256": "7569432760a1d9470b9f37fd397942d19413825986d0ccc36764d8012b1325fa",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/网络篱笆.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "网络篱笆",
   "source_phrase": "上半屏一幅示意图：左边一台台式机、右边一台笔记本，中间一张浅绿色的网（画 Tailscale 标志），写着“主机 ⇄ Tailscale 私有网络 ⇄ 副机”那一行。",
   "sha256": "f5c152bbda27a0828f447a8ff362e0070a75d9c53bbbf45e804a2c4a272a9e0e",
   "status": "ready",
   "original_elements": [
    "台式机与笔记本电脑之间浅绿网，网中Tailscale标志；台式机下方四块积木分别画Tailscale、KDE Connect标志、小绿狗、小日历，外圈篱笆和小门；笔记本下方仅两块积木画Tailscale和KDE Connect标志，不画看门狗或计划任务"
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
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\meshclip-kit\\img\\meshclip-kit-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "source_box": [
    26,
    0,
    522,
    126
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 它是怎么搭的

主机 ⇄ Tailscale 私有网络 ⇄ 副机

主机上四层，各管各的：
1. **Tailscale**｜Windows 服务，开机就在线，没登录 Windows 也在（“无人值守”）
2. **KDE Connect**｜登录后启动：任务栏里一个托盘程序，加一个后台程序收发数据
3. **看门狗**｜登录后隐藏启动，每 60 秒看一眼托盘程序，不在就拉起来
4. **计划任务**｜每 2 分钟看一眼看门狗，不在就拉起来

外面再加一道门：**防火墙**只放两条规则进来。

| 环节 | 用的什么 | 细节 |
|---|---|---|
| 连通 | Tailscale（主机装的 1.102.2） | 能直连就直连，连不上走 Tailscale 的中转；一路加密 |
| 同步和传文件 | KDE Connect（主机装的 26.04.2） | 开源的跨设备工具；两台配对后才交换数据，用配对时互换的证书加密 |
| 放行 | Windows 防火墙 | 每台两条入站规则，TCP、UDP 各一条，端口 1714–1764；只认对面的 Tailscale 地址、Tailscale 网卡和 KDE Connect 的后台程序 |
| 主机自动恢复 | PowerShell 7 看门狗、计划任务 | 都用我自己的账号、普通权限；副机没有看门狗和计划任务 |
| 安装 | WinGet | 只装两个软件的官方包，项目自己不打包别人的软件 |
| AI 模型 | 不用 | 同步和传文件都不经过 AI；AI 只在安装、自检、修的时候出场 |

副机按需开关，用不着自动拉起（见“为什么这样设计”第 7 条）：只有 Tailscale 和防火墙常在，KDE Connect 要用时手动打开、不随登录启动，没有看门狗和计划任务。

::screen{#meshclip-kit-05 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-05",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，七张横向小卡片两列四行（第 7 张在最后一行左边），每张左边一个小水彩图标（一管胶水粘着两块现成积木、四块各自立着的积木、一把普通的钥匙和一个小锁着的房门、两只手分别按在两台电脑上、一支倒着走的箭头绕回原点、一只只看表盘不看信纸的眼睛、一台亮着屏的台式机旁边一台合上盖子的笔记本），粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。",
  "portrait": "竖版：标题在上；七张卡片一行一张；三张数字卡在最下，一行一张。",
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
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "1用现成的，只写胶水。剪贴板同步、传文件、加密交给K",
     "columns": 2,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "why",
     "width": "68%"
    },
    {
     "type": "stat_card",
     "text_ref": "3138行脚本（PowerShell和VBScrip",
     "columns": 1,
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "row": "why",
     "width": "32%"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左边约三分之二宽，七张横向小卡片两列四行（第 7 张在最后一行左边），每张左边一个小水彩图标（一管胶水粘着两块现成积木、四块各自立着的积木、一把普通的钥匙和一个小锁着的房门、两只手分别按在两台电脑上、一支倒着走的箭头绕回原点、一只只看表盘不看信纸的眼睛、一台亮着屏的台式机旁边一台合上盖子的笔记本），粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。",
     "portrait": "竖版：标题在上；七张卡片一行一张；三张数字卡在最下，一行一张。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "stat_card",
     "bullet_list",
     "numbered_steps"
    ],
    "portrait_component_order": [
     "content_card",
     "stat_card",
     "chapter_title",
     "icon",
     "bullet_list",
     "numbered_steps"
    ]
   },
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large"
    },
    {
     "type": "feature_card",
     "text_ref": "1用现成的，只写胶水。剪贴板同步、传文件、加密交给K",
     "columns": 2,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "stat_card",
     "text_ref": "3138行脚本（PowerShell和VBScrip",
     "columns": 1,
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ]
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左边约三分之二宽，七张横向小卡片两列四行（第 7 张在最后一行左边），每张左边一个小水彩图标（一管胶水粘着两块现成积木、四块各自立着的积木、一把普通的钥匙和一个小锁着的房门、两只手分别按在两台电脑上、一支倒着走的箭头绕回原点、一只只看表盘不看信纸的眼睛、一台亮着屏的台式机旁边一台合上盖子的笔记本），粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。",
     "portrait": "竖版：标题在上；七张卡片一行一张；三张数字卡在最下，一行一张。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "stat_card",
     "bullet_list",
     "numbered_steps"
    ],
    "portrait_component_order": [
     "content_card",
     "stat_card",
     "chapter_title",
     "icon",
     "bullet_list",
     "numbered_steps"
    ]
   },
   "pending_requirements": []
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
   "asset": "_library/fix-round-2/icon-clean-7556509cef8e1a23cce4.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "拼图",
   "source_phrase": "一管胶水粘着两块现成积木",
   "sha256": "eb5bd3b49ee6cee6b96c2cabcda8131cdc0731548b49996f155f0e94842cc94f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7556509cef8e1a23cce4.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "拼图",
   "source_phrase": "四块各自立着的积木",
   "sha256": "eb5bd3b49ee6cee6b96c2cabcda8131cdc0731548b49996f155f0e94842cc94f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ee82f5d373ca916b8dad.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁门钥匙",
   "source_phrase": "一把普通的钥匙和一个小锁着的房门",
   "sha256": "b57ea8a1f2c4ebd2aca55472a96f982be8baef2d32704628b79ce3c6765c310d",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "两只手分别按在两台电脑上",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "source_phrase": "一支倒着走的箭头绕回原点",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只只看表盘不看信纸的眼睛",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一台亮着屏的台式机旁边一台合上盖子的笔记本",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "3138 行 脚本（PowerShell 和 VBScript，14 个文件，不算测试）",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "85 条 自动测试",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "10 次 提交（8 月 11 日–9 月 29 日）",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\meshclip-kit\\img\\meshclip-kit-05-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "source_box": [
    63,
    93,
    888,
    299
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 为什么这样设计

1. **用现成的，只写胶水。**｜剪贴板同步、传文件、加密交给 KDE Connect，跨网交给 Tailscale，都是用的人多、有人维护的开源软件。项目只写“装好、放对、看住”这一层；公开仓库里只有脚本和说明，不经手任何剪贴板和文件。
2. **四层各自启动，看门狗只管一件事。**｜哪一层坏了，别的层照样在。看门狗只拉起 KDE Connect：Tailscale 有 Windows 服务自带的故障恢复，不再叠一层；防火墙和配对的改动按规矩要人点头，所以不让程序自己动。
3. **用普通权限，换来登录后才工作。**｜看门狗和计划任务都用我自己的账号、普通权限跑，不用系统最高身份或管理员。代价是登录前收不了文件、睡着的电脑不会被叫醒，这是有意的取舍。
4. **配对只能人点。**｜脚本只把对面的名字写进 KDE Connect 的设置，配对请求要我在两台上各点一次确认；程序看到对面在线，也不算配对完成。
5. **装到一半断了，能倒回去。**｜每改一处，先把原样记下来再动手；恢复时先对照现状，别的程序改过的地方留着、标成待处理；没收拾完就不清掉记录，不为让自检变绿假装完成。
6. **只看状态，不看内容。**｜看门狗的心跳只有时间、状态和重启次数；自检不打印对面的地址和设备编号；验收只用程序生成的测试字串和测试文件，不碰真的剪贴板。
7. **主机常开，副机按需开。**｜小米妙享一直开着、连着手机，副机开着 KDE Connect 时手机那边就同步不了。所以副机只在要和主机同步时打开 KDE Connect，不用就关掉，不装自动拉起。

- **3138 行**｜脚本（PowerShell 和 VBScript，14 个文件，不算测试）
- **85 条**｜自动测试
- **10 次**｜提交（8 月 11 日–9 月 29 日）

::screen{#meshclip-kit-06 section="highlights"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-06",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：和照片视频录音管理页的“亮点”一样：左上标题，三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：卡 1 一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏；卡 2 一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门；卡 3 一只放大镜照着一行设备清单，清单是空的，却有一个小小的“1”被红笔划掉、改成问号。三张卡下面一条横跨整屏的浅绿细卡片，标题“小巧思”，里面三条并排，每条一个小图标（一朵带斜杠的小云、一个没有窗口的空白屏幕、一只小狗只叼起贴着绿色标签的那个托盘图标）加粗体短标题和一两行字，“约法 L28”画成链接样式。插画里不写字。",
  "portrait": "竖版：三张卡片上下排，一行一张，插画在每张卡片顶部；“小巧思”三条上下排。",
  "links": [
   {
    "text": "约法 L28",
    "href": "/rules/charter/#L28"
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
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "强制重启以后，它自己回来了。",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside"
    },
    {
     "type": "points_card",
     "text_ref": "小巧思",
     "columns": 1,
     "whole_block": true,
     "last_inner_columns": 3,
     "illustration": "left_inside",
     "icon_position": "header_left"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：和照片视频录音管理页的“亮点”一样：左上标题，三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：卡 1 一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏；卡 2 一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门；卡 3 一只放大镜照着一行设备清单，清单是空的，却有一个小小的“1”被红笔划掉、改成问号。三张卡下面一条横跨整屏的浅绿细卡片，标题“小巧思”，里面三条并排，每条一个小图标（一朵带斜杠的小云、一个没有窗口的空白屏幕、一只小狗只叼起贴着绿色标签的那个托盘图标）加粗体短标题和一两行字，“约法 L28”画成链接样式。插画里不写字。",
     "portrait": "竖版：三张卡片上下排，一行一张，插画在每张卡片顶部；“小巧思”三条上下排。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ],
    "portrait_component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "icon",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ]
   },
   "pending_requirements": [
    "三张亮点主插画须逐卡绑定；小巧思三条横排带各自图标，points_card last_inner_columns 仅认2且仅最后卡，不等价于本要求。"
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
     "text_ref": "强制重启以后，它自己回来了。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside"
    },
    {
     "type": "points_card",
     "text_ref": "小巧思",
     "columns": 1,
     "whole_block": true,
     "last_inner_columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：和照片视频录音管理页的“亮点”一样：左上标题，三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：卡 1 一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏；卡 2 一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门；卡 3 一只放大镜照着一行设备清单，清单是空的，却有一个小小的“1”被红笔划掉、改成问号。三张卡下面一条横跨整屏的浅绿细卡片，标题“小巧思”，里面三条并排，每条一个小图标（一朵带斜杠的小云、一个没有窗口的空白屏幕、一只小狗只叼起贴着绿色标签的那个托盘图标）加粗体短标题和一两行字，“约法 L28”画成链接样式。插画里不写字。",
     "portrait": "竖版：三张卡片上下排，一行一张，插画在每张卡片顶部；“小巧思”三条上下排。"
    },
    "desktop_component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "illustration",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ],
    "portrait_component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "icon",
     "prose",
     "notice",
     "inline_link",
     "bullet_list"
    ]
   },
   "pending_requirements": [
    "三张亮点主插画须逐卡绑定；小巧思三条横排带各自图标，points_card last_inner_columns 仅认2且仅最后卡，不等价于本要求。"
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一朵带斜杠的小云",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显示器",
   "source_phrase": "一个没有窗口的空白屏幕",
   "sha256": "93ece86ae3430d3926e30507db377cf3b9b75e709d2985119e6f937755addddf",
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
   "source_phrase": "一只小狗只叼起贴着绿色标签的那个托盘图标",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-cc4a1402ccae14.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-cc4a1402ccae14",
   "source_phrase": "插画：卡 1 一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏；卡 2 一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门；卡 3 一只放大镜照着一行设备清单，清单是空的，却有一个小小的“1”被红笔划掉、改成问号。",
   "sha256": "e26d430dae2e9fb28c1e0e75e695ed58b80fed0538b6456e7c1f6ac4f4722973",
   "status": "ready",
   "original_elements": [
    "一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏"
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
   "asset": "_library/illustrations/网络篱笆.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "网络篱笆",
   "source_phrase": "插画：卡 1 一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏；卡 2 一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门；卡 3 一只放大镜照着一行设备清单，清单是空的，却有一个小小的“1”被红笔划掉、改成问号。",
   "sha256": "f5c152bbda27a0828f447a8ff362e0070a75d9c53bbbf45e804a2c4a272a9e0e",
   "status": "ready",
   "original_elements": [
    "一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门"
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
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文稿核验现图小槽4比3",
   "source_phrase": "插画：卡 1 一台刚亮起的台式机，屏幕角上一个转圈的重启箭头，旁边一只小绿狗把一个托盘图标叼回任务栏；卡 2 一圈篱笆上原来两扇大敞的门被打了叉、关上，旁边新开一扇只容一台笔记本通过的小门；卡 3 一只放大镜照着一行设备清单，清单是空的，却有一个小小的“1”被红笔划掉、改成问号。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一只放大镜照着一行设备清单，清单是空的，却有一个小小的抽象图形被红笔划掉、改成问号"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\meshclip-kit\\img\\meshclip-kit-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    37,
    36,
    247,
    206
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 亮点

**强制重启以后，它自己回来了。**
9 月 27 日 21:24 主机强制重启。21:26 看门狗随登录启动，等了 15 秒没看到 KDE Connect 的托盘程序，就把它拉了起来；到 9 月 28 日 21:45 它还在跑，心跳每分钟一次。看门狗靠一把互斥锁保证一直只有一个在跑：计划任务每 2 分钟再启动一个，发现已经有了就立刻退出（退出前那一瞬以前会被多数一个，9 月 29 日已修，见“出事怎么办”）。这一层现在只在主机上有。

**放得太宽的旧规则，收成只认一台。**
主机上原来有 2 条放行 KDE Connect 的入站规则，不限来源，谁都能连到它的端口。配置脚本发现后先停下、给出预览；确认后只停用这 2 条并记下来以便还原，再建 2 条只认副机的规则。现在自检每次都查“还有没有别的规则放行 KDE Connect”，有就判失败。

**对面明明不在线，自检却数出 1 台。**
KDE Connect 的命令行在中文系统上会多打一行中文的设备统计。旧自检把这一行也当成一台设备，一台都没连上时也报 1 台；查询出错又记成 0 台，像是对面掉线。9 月 8 日改成只数设备编号，出错就写“不知道”，还补了专门的测试。

**小巧思**
- **查微软云剪贴板开没开**：Windows 自带的云剪贴板要是开着，KDE Connect 写进来的字会再被同步到微软云。自检专门查这一项，现在没开。
- **后台不弹黑窗口**：看门狗经 wscript 隐藏启动，屏幕上什么都不弹〔约法 L28〕。
- **只拉起认得的那个程序**：看门狗要启动时，只运行 KDE Connect 安装位置里的那个托盘程序，不按名字随便找一个；判断它在不在跑，也只看我这次登录里的。

::screen{#meshclip-kit-07 section="features"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-07",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：左上标题（毛笔字）和同一行右边的图例条；图例下面一行浅灰小字写“怎么判的”。下面按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。三组各 3 张，正好一行。组“同步和传输”第 3 张“安卓平板”卡片画得淡一些。这一张和下一张（没有标题和图例）上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
  "portrait": "竖版：标题在上，图例排成两行，“怎么判的”一段；组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）。",
  "links": [],
  "anchors": [
   {
    "id": "g-share",
    "text": "同步和传输"
   },
   {
    "id": "f-text-sync",
    "text": "文字同步"
   },
   {
    "id": "f-file-transfer",
    "text": "文件互传"
   },
   {
    "id": "f-android",
    "text": "安卓平板"
   },
   {
    "id": "g-link",
    "text": "连接和放行"
   },
   {
    "id": "f-cross-network",
    "text": "跨网连接"
   },
   {
    "id": "f-exact-peer",
    "text": "只认那一台"
   },
   {
    "id": "f-tighten-broad",
    "text": "收紧宽泛规则"
   },
   {
    "id": "g-recover",
    "text": "自动恢复"
   },
   {
    "id": "f-login-start",
    "text": "登录自动启动"
   },
   {
    "id": "f-watchdog",
    "text": "自动拉起"
   },
   {
    "id": "f-supervisor",
    "text": "看门狗的看门狗"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "mc-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（18项）",
     "align": "center",
     "size": "large",
     "row": "heading",
     "width": "60%"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用",
     "row": "heading",
     "width": "40%"
    },
    {
     "type": "prose",
     "text_ref": "怎么判的：主机上正在跑、或者有记录用过一次的，标“在"
    },
    {
     "type": "feature_card",
     "text_ref": "同步和传输",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：左上标题（毛笔字）和同一行右边的图例条；图例下面一行浅灰小字写“怎么判的”。下面按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。三组各 3 张，正好一行。组“同步和传输”第 3 张“安卓平板”卡片画得淡一些。这一张和下一张（没有标题和图例）上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
     "portrait": "竖版：标题在上，图例排成两行，“怎么判的”一段；组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）。"
    },
    "desktop_component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "status_legend",
     "section_heading",
     "chapter_title",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "组名须毛笔字和左笔刷线；状态词只留右上圆点，当前普通组头和状态文字仍未完成。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（18项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "prose",
     "text_ref": "怎么判的：主机上正在跑、或者有记录用过一次的，标“在"
    },
    {
     "type": "feature_card",
     "text_ref": "同步和传输",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：左上标题（毛笔字）和同一行右边的图例条；图例下面一行浅灰小字写“怎么判的”。下面按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。三组各 3 张，正好一行。组“同步和传输”第 3 张“安卓平板”卡片画得淡一些。这一张和下一张（没有标题和图例）上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
     "portrait": "竖版：标题在上，图例排成两行，“怎么判的”一段；组名一行，卡片一行一张（编号功能名粗体，下面一句话，状态圆点在右上）。"
    },
    "desktop_component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "status_legend",
     "section_heading",
     "chapter_title",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "组名须毛笔字和左笔刷线；状态词只留右上圆点，当前普通组头和状态文字仍未完成。"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "文字同步｜在一台复制文字，另一台直接粘贴；两台都在线时尽力同步；9 月 29 日 01:25 两个方向实测通过｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f12e6ff1182222417108.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云下载",
   "source_phrase": "文件互传｜在任务栏的 KDE Connect 里选文件发过去，对方收进“下载”文件夹｜说不准",
   "sha256": "1c603627d116f903dd0148f2befe4ca071a81c48dd15f3542fd34ce8ea256685",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "安卓平板｜平板连上同一张私有网络后一起同步；步骤写好了，还没做｜待实施",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/46-地球-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "地球",
   "source_phrase": "跨网连接｜不在同一个网络，经 Tailscale 私有网络互通；没登录 Windows 也在线｜在用",
   "sha256": "7569432760a1d9470b9f37fd397942d19413825986d0ccc36764d8012b1325fa",
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
   "source_phrase": "只认那一台｜每台两条规则，只放对面进来；配对要两边各点一次确认｜在用",
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
   "source_phrase": "收紧宽泛规则｜发现别的规则放得太宽，先预览，确认后停用并记下，能还原｜在用",
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
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "登录自动启动｜登录后 KDE Connect 和看门狗各自启动；只在主机上，副机按需手动打开｜在用",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "自动拉起｜看门狗每 60 秒看 KDE Connect 在不在，不在就拉起来；只在主机上｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "看门狗的看门狗｜计划任务每 2 分钟看看门狗在不在，不在就拉起来；只在主机上｜在用",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-bdd68a3fea1a9e251e72.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-bdd68a3fea1a9e251e72",
   "title_text": "全部功能（18 项）",
   "sha256": "4bf33bfa5cee1cc0ec24549a9e0c1fd26aa00b98bfc77a331695191e36e8521f",
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
   "asset": "_library/titles/title-312573512f3a4e29cb0d.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-312573512f3a4e29cb0d",
   "title_text": "同步和传输",
   "sha256": "da0ecdd34476ff6ed44de0365d9894dc8dc9c53ddd59b20336739f33c035d25b",
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
   "asset": "_library/titles/title-d4670a4c4f0fa3ab9929.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d4670a4c4f0fa3ab9929",
   "title_text": "自动恢复",
   "sha256": "7713d4b103dcee0af42a5961b4ffc529505d29b56730a2c6c72ef42af584b12d",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-509d3f0fdfa38b9e15da.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-509d3f0fdfa38b9e15da",
   "title_text": "连接和放行",
   "sha256": "6e368f37fc5151ea9d0b83e805059f98bb7c4cea432ee9618abca3aaa7a1434e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（18 项）

● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

怎么判的：主机上正在跑、或者有记录用过一次的，标“在用”；同步和传文件本身不留记录，又找不到真用过的证据，标“说不准”；每用一次都会留下文件、现在一件都找不到的，标“没用过”。

**同步和传输**
1. 文字同步｜在一台复制文字，另一台直接粘贴；两台都在线时尽力同步；9 月 29 日 01:25 两个方向实测通过｜在用
2. 文件互传｜在任务栏的 KDE Connect 里选文件发过去，对方收进“下载”文件夹｜说不准
3. 安卓平板｜平板连上同一张私有网络后一起同步；步骤写好了，还没做｜待实施

**连接和放行**
4. 跨网连接｜不在同一个网络，经 Tailscale 私有网络互通；没登录 Windows 也在线｜在用
5. 只认那一台｜每台两条规则，只放对面进来；配对要两边各点一次确认｜在用
6. 收紧宽泛规则｜发现别的规则放得太宽，先预览，确认后停用并记下，能还原｜在用

**自动恢复**
7. 登录自动启动｜登录后 KDE Connect 和看门狗各自启动；只在主机上，副机按需手动打开｜在用
8. 自动拉起｜看门狗每 60 秒看 KDE Connect 在不在，不在就拉起来；只在主机上｜在用
9. 看门狗的看门狗｜计划任务每 2 分钟看看门狗在不在，不在就拉起来；只在主机上｜在用

::screen{#meshclip-kit-08 section="features"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-08",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：接上一张往下排，没有标题、没有图例。按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。组“看和管”4 张（第二行一张靠左，右边空出的两格画一小幅水彩插画：一块带几个按钮的小面板和一张打勾的清单）；组“安装和收尾”4 张（同样第二行一张靠左，右边两格画一个工具箱和一支绕回原点的箭头）。这一张和上一张上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
  "portrait": "竖版：接上一张，没有标题和图例；组名一行，卡片一行一张。",
  "links": [],
  "anchors": [
   {
    "id": "g-control",
    "text": "看和管"
   },
   {
    "id": "f-control-center",
    "text": "控制中心"
   },
   {
    "id": "f-pause",
    "text": "暂停自动拉起"
   },
   {
    "id": "f-doctor",
    "text": "自检"
   },
   {
    "id": "f-acceptance",
    "text": "双机验收向导"
   },
   {
    "id": "g-setup",
    "text": "安装和收尾"
   },
   {
    "id": "f-install",
    "text": "一键安装"
   },
   {
    "id": "f-on-demand",
    "text": "副机按需部署"
   },
   {
    "id": "f-configure-peer",
    "text": "指定对端"
   },
   {
    "id": "f-recover",
    "text": "中断恢复"
   },
   {
    "id": "f-uninstall",
    "text": "卸载还原"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "mc-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "看和管",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only",
     "tail_illustrations": {
      "看和管": {
       "asset": "_library/icons/代码窗口.png"
      },
      "安装和收尾": {
       "asset": "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png"
      }
     }
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：接上一张往下排，没有标题、没有图例。按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。组“看和管”4 张（第二行一张靠左，右边空出的两格画一小幅水彩插画：一块带几个按钮的小面板和一张打勾的清单）；组“安装和收尾”4 张（同样第二行一张靠左，右边两格画一个工具箱和一支绕回原点的箭头）。这一张和上一张上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
     "portrait": "竖版：接上一张，没有标题和图例；组名一行，卡片一行一张。"
    },
    "desktop_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "组名须毛笔字和左笔刷线；状态词只留右上圆点，当前普通组头和状态文字仍未完成。",
    "末行空两格指定工具面板/工具箱小插画；本组定稿安装和收尾实际5项，以定稿保全，4张描述与定稿冲突须审页员判断。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "看和管",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "group_heading": "brush",
     "status_text": "dot_only"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：接上一张往下排，没有标题、没有图例。按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。组“看和管”4 张（第二行一张靠左，右边空出的两格画一小幅水彩插画：一块带几个按钮的小面板和一张打勾的清单）；组“安装和收尾”4 张（同样第二行一张靠左，右边两格画一个工具箱和一支绕回原点的箭头）。这一张和上一张上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
     "portrait": "竖版：接上一张，没有标题和图例；组名一行，卡片一行一张。"
    },
    "desktop_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ],
    "portrait_component_order": [
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ]
   },
   "pending_requirements": [
    "组名须毛笔字和左笔刷线；状态词只留右上圆点，当前普通组头和状态文字仍未完成。",
    "末行空两格指定工具面板/工具箱小插画；本组定稿安装和收尾实际5项，以定稿保全，4张描述与定稿冲突须审页员判断。"
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "控制中心｜看守护开没开、上次心跳、下次检查、有没有做了一半的操作；只在主机上｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "暂停自动拉起｜暂停一小时、暂停直到恢复、恢复守护｜没用过",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "自检｜22 项分层检查，不打印地址和设备编号；副机按需模式下 KDE Connect 关着也算正常；严格模式把“提醒”也算不过｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "双机验收向导｜生成 100 条测试字串和 1 MB、100 MB、1 GB 测试文件，收到后逐个比内容指纹｜没用过",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "一键安装｜用 WinGet 装两个官方包，开无人值守，建登录启动、看门狗和计划任务｜在用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "副机按需部署｜先核对提交号；装两个官方包，保留配对和放行规则，只删项目建的登录启动，不装看门狗，记成按需模式；9 月 29 日在副机上用过｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "指定对端｜把对面写进 KDE Connect 的设置，建两条只认它的规则｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "中断恢复｜装到一半断了，先看预览再倒着撤回；别的程序改过的不动｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "卸载还原｜撤掉项目加的规则、快捷方式和计划任务；可选把停用的旧规则和无人值守改回去｜说不准",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/代码窗口.png",
   "fallback": false,
   "key": "代码窗口",
   "source_phrase": "看和管 横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：接上一张往下排，没有标题、没有图例。按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。组“看和管”4 张（第二行一张靠左，右边空出的两格画一小幅水彩插画：一块带几个按钮的小面板和一张打勾的清单）；组“安装和收尾”4 张（同样第二行一张靠左，右边两格画一个工具箱和一支绕回原点的箭头）。这一张和上一张上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "key": "工具箱",
   "source_phrase": "安装和收尾 横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：接上一张往下排，没有标题、没有图例。按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）；状态文字不画出来，只画圆点。组“看和管”4 张（第二行一张靠左，右边空出的两格画一小幅水彩插画：一块带几个按钮的小面板和一张打勾的清单）；组“安装和收尾”4 张（同样第二行一张靠左，右边两格画一个工具箱和一支绕回原点的箭头）。这一张和上一张上下拼成一整段：同一个网格，上下边都不画边框。插画不写字。",
   "sha256": "1f27e2e5b55499cd52cec4a8b7fe253b3b84c0357e9939f1039619291f43461a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-36324886ebb698ec7f55.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-36324886ebb698ec7f55",
   "title_text": "安装和收尾",
   "sha256": "c871d8cced2a018c685d2a73dedf67639f06108bd9bb1a9a37f3fd8400217c29",
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
   "asset": "_library/titles/title-bc84aa14b9f37f92326c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bc84aa14b9f37f92326c",
   "title_text": "看和管",
   "sha256": "e81686ec6cd15587a3cc66311d75755dc31ec63862c48f187e51347c24b0254c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**看和管**
10. 控制中心｜看守护开没开、上次心跳、下次检查、有没有做了一半的操作；只在主机上｜说不准
11. 暂停自动拉起｜暂停一小时、暂停直到恢复、恢复守护｜没用过
12. 自检｜22 项分层检查，不打印地址和设备编号；副机按需模式下 KDE Connect 关着也算正常；严格模式把“提醒”也算不过｜在用
13. 双机验收向导｜生成 100 条测试字串和 1 MB、100 MB、1 GB 测试文件，收到后逐个比内容指纹｜没用过

**安装和收尾**
14. 一键安装｜用 WinGet 装两个官方包，开无人值守，建登录启动、看门狗和计划任务｜在用
15. 副机按需部署｜先核对提交号；装两个官方包，保留配对和放行规则，只删项目建的登录启动，不装看门狗，记成按需模式；9 月 29 日在副机上用过｜在用
16. 指定对端｜把对面写进 KDE Connect 的设置，建两条只认它的规则｜在用
17. 中断恢复｜装到一半断了，先看预览再倒着撤回；别的程序改过的不动｜说不准
18. 卸载还原｜撤掉项目加的规则、快捷方式和计划任务；可选把停用的旧规则和无人值守改回去｜说不准

::screen{#meshclip-kit-09 section="history"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-09",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。左侧一条竖向时间线，七个节点，每个节点一个小水彩图标、粗体日期、一两行字（节点图标：两台电脑之间拉起一张网、一只睡着的小狗、一面小镜子、一个放大镜照着设备清单、一支绕回原点的箭头和一块小面板、一本变薄的小册子、一个转圈的重启箭头）。右侧约三分之一宽一幅大一点的水彩插画：一台笔记本先亮起，旁边长出一台台式机，两台之间长出一张网，台式机旁最后出现一只小绿狗，像一路长出来的样子；插画里不写字。",
  "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。",
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
     "text_ref": "8月11日在副机上建库：Tailscale连通、KD",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside"
    },
    {
     "type": "illustration",
     "size": "small",
     "align": "center"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左侧一条竖向时间线，七个节点，每个节点一个小水彩图标、粗体日期、一两行字（节点图标：两台电脑之间拉起一张网、一只睡着的小狗、一面小镜子、一个放大镜照着设备清单、一支绕回原点的箭头和一块小面板、一本变薄的小册子、一个转圈的重启箭头）。右侧约三分之一宽一幅大一点的水彩插画：一台笔记本先亮起，旁边长出一台台式机，两台之间长出一张网，台式机旁最后出现一只小绿狗，像一路长出来的样子；插画里不写字。",
     "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。"
    },
    "desktop_component_order": [
     "chapter_title",
     "timeline",
     "icon",
     "illustration"
    ],
    "portrait_component_order": [
     "timeline",
     "illustration",
     "chapter_title",
     "icon"
    ]
   },
   "pending_requirements": []
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
     "text_ref": "8月11日在副机上建库：Tailscale连通、KD",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside"
    },
    {
     "type": "illustration",
     "size": "small",
     "align": "center"
    }
   ],
   "notes": "文字构图依据：screens.jsonl source_layout 与定稿 scene/portrait；本轮未看图。新补规格，组件新外观待样张。",
   "layout_requirements": {
    "source_layout": {
     "desktop": "横版：左上标题。左侧一条竖向时间线，七个节点，每个节点一个小水彩图标、粗体日期、一两行字（节点图标：两台电脑之间拉起一张网、一只睡着的小狗、一面小镜子、一个放大镜照着设备清单、一支绕回原点的箭头和一块小面板、一本变薄的小册子、一个转圈的重启箭头）。右侧约三分之一宽一幅大一点的水彩插画：一台笔记本先亮起，旁边长出一台台式机，两台之间长出一张网，台式机旁最后出现一只小绿狗，像一路长出来的样子；插画里不写字。",
     "portrait": "竖版：时间线占满宽度，一个节点一段；插画缩小放在标题下面。"
    },
    "desktop_component_order": [
     "chapter_title",
     "timeline",
     "icon",
     "illustration"
    ],
    "portrait_component_order": [
     "timeline",
     "illustration",
     "chapter_title",
     "icon"
    ]
   },
   "pending_requirements": []
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
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "两台电脑之间拉起一张网",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "source_phrase": "一只睡着的小狗",
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
   "source_phrase": "一面小镜子",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一个放大镜照着设备清单",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
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
   "source_phrase": "一支绕回原点的箭头和一块小面板",
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一本变薄的小册子",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个转圈的重启箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/双机互传.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双机互传",
   "source_phrase": "右侧约三分之一宽一幅大一点的水彩插画：一台笔记本先亮起，旁边长出一台台式机，两台之间长出一张网，台式机旁最后出现一只小绿狗，像一路长出来的样子；插画里不写字。",
   "sha256": "3f61967dde6017572aaecfa5de1dffeda67f7735d0849312a76ae9567aef86ba",
   "status": "ready",
   "original_elements": [
    "一台笔记本先亮起，旁边长出一台台式机，两台之间长出一张网，台式机旁最后出现一只小绿狗，像一路长出来的样子；插画里不写字"
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

# 演进（北京时间）

- **8 月 11 日**　在副机上建库：Tailscale 连通、KDE Connect 同步、防火墙只放那一台；写好一份给主机上 Codex 的部署说明，它先核对提交号再装。当天加上看门狗和守看门狗的计划任务，两台装好、配对
- **8 月 12 日**　副机看门狗最后一次心跳；此后副机按需开关 KDE Connect，不再自动拉起
- **8 月 31 日**　看门狗的预演模式不再真的动手
- **9 月 8 日**　修好中文系统下数错设备
- **9 月 18 日**　装到一半断了能倒回去；加上控制中心、分层自检、双机验收向导，测试补到 81 条
- **9 月 26 日**　说明精简到五句话，删掉重复的交接说明
- **9 月 27 日**　主机强制重启后，看门狗把 KDE Connect 拉了起来
- **9 月 29 日**　副机部署成按需模式，关着不算故障；修掉主机看门狗交接时的误报；不再要求关“包含密码”；01:25 两台互发剪贴板实测通过
