---
{
 "title": "Steam 外观备份",
 "kind": "project",
 "url": "/projects/steam-millennium-config-backup/",
 "tagline": "存下调好的 Steam 皮肤，换电脑照着装回来。",
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
  "page": "steam-millennium-config-backup",
  "kind": "project",
  "title": "Steam 外观备份",
  "url": "/projects/steam-millennium-config-backup/",
  "tagline": "存下调好的 Steam 皮肤，换电脑照着装回来。",
  "status": "偶尔用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/steam-millennium-config-backup",
  "capability": "留住并装回软件的外观设置",
  "based_on": {
   "commit": "9185673e6f27c9efb3d05a2f3362d82b3b193dce",
   "commit_time": "2026-09-26T17:23:08+08:00"
  },
  "video_prompt": "6 秒无缝循环，白底水彩风格，从开头这屏的插画出发：画面中央一个浅色的 Steam 窗口草图，右上角的按钮慢慢染成绿色，右侧一条滚动条收细成一根发丝般的细线；窗口里飘出一张写满小格子的清单纸，纸上五块小拼图和两块调色板依次亮起（其中三块拼图变成实心绿）；清单纸对折，沿一条绿色箭头滑进三块排成一列的硬盘，每块硬盘落定时亮一下小小的绿色对勾；最后一片绿叶从右上角飘下，画面回到起点。镜头不动，没有文字，不出现任何游戏画面或头像。",
  "registry": {
   "groups": [
    {
     "id": "g-snapshot",
     "name": "存一份"
    },
    {
     "id": "g-copies",
     "name": "多存几处"
    },
    {
     "id": "g-check",
     "name": "查和管"
    },
    {
     "id": "g-restore",
     "name": "装回"
    },
    {
     "id": "g-upkeep",
     "name": "兼容"
    }
   ],
   "features": [
    {
     "id": "f-core-settings",
     "group": "g-snapshot",
     "name": "核心设置",
     "what": "只存 21 个认得的字段，能装回",
     "how": "自动；也可以让 AI 马上存",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 40–51、229–267 行；runtime/last-run.json 9 月 28 日 complete"
    },
    {
     "id": "f-quick-css",
     "group": "g-snapshot",
     "name": "自写样式",
     "what": "quick.css 原样存，只统一换行",
     "how": "自动",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 280–285 行；仓库 config/quick.css"
    },
    {
     "id": "f-plugin-list",
     "group": "g-snapshot",
     "name": "插件清单",
     "what": "名字、版本、上游提交号、开着哪几个",
     "how": "换电脑时让 AI 列出来",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "仓库 plugins/*/plugin.json、metadata.json；config.json plugins.enabledPlugins"
    },
    {
     "id": "f-theme-list",
     "group": "g-snapshot",
     "name": "主题清单",
     "what": "主题定义、选项和配色，记下在用哪套",
     "how": "换电脑时让 AI 核对",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "仓库 themes/*/；config.json themes.activeTheme、conditions、themeColors"
    },
    {
     "id": "f-weekly",
     "group": "g-snapshot",
     "name": "每周自动存",
     "what": "每周一 10:30（北京），错过补跑，失败隔 15 分钟重试 3 次，窗口隐藏",
     "how": "不用管",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "计划任务 \\SteamMillenniumConfigSnapshot：上次 9 月 28 日 10:30（北京）结果 0；Manage-MillenniumTask.ps1 第 36–41 行"
    },
    {
     "id": "f-manual",
     "group": "g-snapshot",
     "name": "马上存一份",
     "what": "不等周一，现在就存",
     "how": "“Steam 外观备份一下”",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "runtime/acceptance-latest.json：9 月 18 日 13:26（北京）非计划时间的一次运行，结果 unchanged"
    },
    {
     "id": "f-nochange",
     "group": "g-snapshot",
     "name": "没变化不重复",
     "what": "文件和软件版本都没变，只核对、不新增一代",
     "how": "自动",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 669–678 行；9 月 21 日那次成功但没多出一代（旧账本记录＋三处历史代号）"
    },
    {
     "id": "f-privacy-filter",
     "group": "g-snapshot",
     "name": "公开前过滤",
     "what": "白名单之外不收；查 SteamID、令牌、私钥，命中整次拒绝",
     "how": "自动",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 37–38、213–226、248–251 行；每次快照都跑"
    },
    {
     "id": "f-uninstall-follow",
     "group": "g-snapshot",
     "name": "卸载跟着删",
     "what": "目录读全、两遍一致时，卸掉的插件主题也从备份删；读不全不删",
     "how": "自动",
     "status": "没用过",
     "screen": "steam-millennium-config-backup-08",
     "source": "AGENTS.md 第 22–23 行；测试 test_valid_uninstall_propagates；仓库历史和三代快照里插件主题文件数一直是 18，没发生过卸载"
    },
    {
     "id": "f-keep-generations",
     "group": "g-copies",
     "name": "留最近几代",
     "what": "E 盘项目里留最近 4 代，可调 2–32",
     "how": "自动",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 700–708 行；runtime/snapshots 现有 3 代"
    },
    {
     "id": "f-g-copy",
     "group": "g-copies",
     "name": "复制到 G 盘",
     "what": "先认盘再复制当前和历史各代，逐份核对",
     "how": "自动",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "Invoke-MillenniumBackup.ps1 第 87–108 行；G:\\80_Backup\\SteamMillennium\\replica-receipt.json 9 月 28 日 complete"
    },
    {
     "id": "f-h-copy",
     "group": "g-copies",
     "name": "同步到 H 盘",
     "what": "电脑配置与恢复每天同步外接盘时一起同步、核对",
     "how": "自动",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "H:\\80_自动备份区\\SteamMillennium\\replica-receipt.json 9 月 28 日 15:03（北京）complete；PCConfig docs/recovery/steam_millennium_backup.md"
    },
    {
     "id": "f-github",
     "group": "g-copies",
     "name": "公开到 GitHub",
     "what": "看过差异后手动提交推送",
     "how": "跟 AI 说“把 Steam 备份推上去”",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "git log：8 月 16 日 c65bb36、9 月 18 日 32ad4fb 带快照内容；AGENTS.md 第 25 行不自动推送"
    },
    {
     "id": "f-adopt",
     "group": "g-copies",
     "name": "接管旧备份",
     "what": "升级到 2.0 时，先把旧的无清单备份核对、存档，再接管",
     "how": "一次性",
     "status": "在用",
     "screen": "steam-millennium-config-backup-08",
     "source": "runtime/snapshots/20260918T044108Z-3fcfb3cea9d8 的 coverage.legacy_adopted=true；E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 648–658 行"
    },
    {
     "id": "f-status",
     "group": "g-check",
     "name": "备份状态",
     "what": "只读：核对指纹、G 和 H 是不是同一代、任务上次结果、设置有没有改过没存",
     "how": "“Steam 外观备份正常吗”",
     "status": "在用",
     "screen": "steam-millennium-config-backup-09",
     "source": "Invoke-MillenniumBackup.ps1 -Mode Status；acceptance-latest.json 9 月 18 日 live_status；本次 9 月 28 日 21:52 实测 healthy"
    },
    {
     "id": "f-verify",
     "group": "g-check",
     "name": "核对一份备份",
     "what": "只读核对任意一份备份的清单和每个文件指纹",
     "how": "AI 查状态时顺带做",
     "status": "在用",
     "screen": "steam-millennium-config-backup-09",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 384–416 行；Status 每次都用它回读 G 和 H"
    },
    {
     "id": "f-status-window",
     "group": "g-check",
     "name": "状态窗口",
     "what": "刷新状态、立即备份、停止或启用自动备份、打开任务计划程序",
     "how": "运行 show-millennium-backup-status.vbs",
     "status": "说不准",
     "screen": "steam-millennium-config-backup-09",
     "source": "Show-MillenniumBackupStatus.ps1；开始菜单入口 9 月 26 日按决定撤掉；打开窗口不留记录，对话记录里也没找到"
    },
    {
     "id": "f-task-setup",
     "group": "g-check",
     "name": "装好和自查任务",
     "what": "装计划任务并回读；自查任务定义有没有走样。自查按同一时刻（北京周一 10:30）比；9 月 28 日因电脑时区改了误报过“时间不符”，9 月 29 日修好后自查通过",
     "how": "“Steam 备份任务查一下”",
     "status": "在用",
     "screen": "steam-millennium-config-backup-09",
     "source": "Manage-MillenniumTask.ps1；acceptance-latest.json task_definition verified；9 月 28 日 Inspect 报 schedule_mismatch（见 audit）；提交 382d52f（北京 9/29 01:39）改按 UTC 02:30 比、安装不再建开始菜单快捷方式；北京 9/29 03:5x Inspect 只读回读 status=verified、issues 空、下次运行北京 10/5 10:30"
    },
    {
     "id": "f-task-toggle",
     "group": "g-check",
     "name": "停止或恢复自动存",
     "what": "只停以后的触发，不打断正在存的那次",
     "how": "状态窗口按钮，或跟 AI 说",
     "status": "说不准",
     "screen": "steam-millennium-config-backup-09",
     "source": "Manage-MillenniumTask.ps1 -Mode Disable/Enable；停启不留回执，对话记录里没找到"
    },
    {
     "id": "f-restore-plan",
     "group": "g-restore",
     "name": "装回前预览",
     "what": "不写任何东西，列出要改什么、哪些版本或资源对不上",
     "how": "“先给我看会改什么”",
     "status": "在用",
     "screen": "steam-millennium-config-backup-09",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 841–901 行；acceptance-latest.json prior_restore_rehearsal.live_preflight=ready（9 月 18 日，本机真实 Steam 目录）"
    },
    {
     "id": "f-restore",
     "group": "g-restore",
     "name": "装回设置",
     "what": "带预览编号，只合并认得的字段和自写样式，先留底",
     "how": "退出 Steam 后说“可以”",
     "status": "待验收",
     "screen": "steam-millennium-config-backup-09",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 945–972 行；只在隔离目录演练过（isolated_restore passed，live_restore_performed false）"
    },
    {
     "id": "f-rollback",
     "group": "g-restore",
     "name": "撤回装回",
     "what": "按撤回编号改回装回前的样子；文件被再改过就不动",
     "how": "“刚才的装回撤掉”",
     "status": "待验收",
     "screen": "steam-millennium-config-backup-09",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 975–1000 行；隔离演练 isolated_rollback byte_identical"
    },
    {
     "id": "f-recover",
     "group": "g-restore",
     "name": "中断后收尾",
     "what": "断电或出错后按留底退回或补完；有外来改动就停",
     "how": "自动；也可以让 AI 单独跑",
     "status": "待验收",
     "screen": "steam-millennium-config-backup-09",
     "source": "E:\\Projects\\Tools\\steam-millennium-config-backup\\tools\\millennium_backup.py 第 481–527 行；每次快照先查一遍，至今都是 not_needed，没遇到过真中断"
    },
    {
     "id": "f-old-entry",
     "group": "g-upkeep",
     "name": "旧入口照样能用",
     "what": "旧脚本名转给新入口，旧的跳过核对开关不再生效",
     "how": "不用管",
     "status": "说不准",
     "screen": "steam-millennium-config-backup-09",
     "source": "tools/snapshot-millennium-config.ps1 第 7–8 行；没查到有东西还在调它"
    }
   ],
   "numbers": [
    {
     "id": "n-files",
     "text": "20 个文件",
     "meaning": "一份备份的文件数：2 个设置文件＋18 个插件和主题清单文件",
     "as_of": "2026-09-28",
     "source": "snapshot-manifest.json 的 files 数组计数（9 月 28 日这一代）",
     "screens": [
      "steam-millennium-config-backup-01",
      "steam-millennium-config-backup-02",
      "steam-millennium-config-backup-05",
      "steam-millennium-config-backup-07"
     ]
    },
    {
     "id": "n-size",
     "text": "52 KB",
     "meaning": "一份备份 20 个文件的字节数之和 53,573 B",
     "as_of": "2026-09-28",
     "source": "snapshot-manifest.json files[].bytes 求和",
     "screens": [
      "steam-millennium-config-backup-01"
     ]
    },
    {
     "id": "n-copies",
     "text": "3 处",
     "meaning": "自动保存的位置：E 盘项目文件夹、G 盘、外接 H 盘（GitHub 手动，不算）",
     "as_of": "2026-09-28",
     "source": "runtime/replica-last.json、G 和 H 的 replica-receipt.json 都是同一代",
     "screens": [
      "steam-millennium-config-backup-01",
      "steam-millennium-config-backup-05"
     ]
    },
    {
     "id": "n-plugins",
     "text": "5 个插件 · 2 套主题",
     "meaning": "清单里记着的插件和主题数",
     "as_of": "2026-09-28",
     "source": "仓库 plugins/、themes/ 子目录计数",
     "screens": [
      "steam-millennium-config-backup-01",
      "steam-millennium-config-backup-02"
     ]
    },
    {
     "id": "n-enabled",
     "text": "3 个插件、1 套主题在用",
     "meaning": "config.json 里启用的插件和当前主题",
     "as_of": "2026-09-28",
     "source": "config.json plugins.enabledPlugins、themes.activeTheme",
     "screens": [
      "steam-millennium-config-backup-01",
      "steam-millennium-config-backup-02",
      "steam-millennium-config-backup-04"
     ]
    },
    {
     "id": "n-schedule",
     "text": "每周一 10:30（北京时间）",
     "meaning": "自动快照的触发时间，StartBoundary 带时区、按 UTC 02:30 固定",
     "as_of": "2026-09-28",
     "source": "Export-ScheduledTask 的 StartBoundary 2026-09-17T21:30:00-05:00；PCConfig tasks.json schedule_zh",
     "screens": [
      "steam-millennium-config-backup-01",
      "steam-millennium-config-backup-03",
      "steam-millennium-config-backup-08"
     ]
    },
    {
     "id": "n-core-fields",
     "text": "21 个字段",
     "meaning": "核心设置白名单字段数（6 节）",
     "as_of": "2026-09-28",
     "source": "millennium_backup.py CORE_FIELDS 计数",
     "screens": [
      "steam-millennium-config-backup-02",
      "steam-millennium-config-backup-05",
      "steam-millennium-config-backup-07",
      "steam-millennium-config-backup-08"
     ]
    },
    {
     "id": "n-theme-options",
     "text": "42 个选项、62 个配色值",
     "meaning": "两套主题 conditions 和 themeColors 的条目数",
     "as_of": "2026-09-28",
     "source": "config.json 现算：Adwaita 17＋Zehn 25；Adwaita 48＋Zehn 14",
     "screens": [
      "steam-millennium-config-backup-02"
     ]
    },
    {
     "id": "n-css",
     "text": "4 条样式",
     "meaning": "quick.css 里的 CSS 规则数",
     "as_of": "2026-09-28",
     "source": "仓库 config/quick.css",
     "screens": [
      "steam-millennium-config-backup-02"
     ]
    },
    {
     "id": "n-generations",
     "text": "3 代",
     "meaning": "runtime、G、H 现有的历史代数",
     "as_of": "2026-09-28",
     "source": "runtime/snapshots、G 和 H 的 history 目录列表",
     "screens": [
      "steam-millennium-config-backup-05"
     ]
    },
    {
     "id": "n-keep",
     "text": "最多 4 代 / 最近 4 次",
     "meaning": "runtime 默认留的快照代数；装回留底记录最多留的次数",
     "as_of": "2026-09-28",
     "source": "millennium_backup.py keep=4、prune_restore_history [3:]",
     "screens": [
      "steam-millennium-config-backup-04",
      "steam-millennium-config-backup-05",
      "steam-millennium-config-backup-08"
     ]
    },
    {
     "id": "n-code",
     "text": "Python 1,056 行；PowerShell 347 行",
     "meaning": "tools 下代码行数",
     "as_of": "2026-09-28",
     "source": "wc -l tools/*",
     "screens": [
      "steam-millennium-config-backup-05"
     ]
    },
    {
     "id": "n-tests",
     "text": "55 项＋11 项",
     "meaning": "Python 测试用例数和 Windows 入口检查数，9 月 18 日对已发布源码全过",
     "as_of": "2026-09-18",
     "source": "grep -c 'def test_' tests/test_backup.py；run-windows-tests.ps1 的 Assert-Case；acceptance-latest.json tests",
     "screens": [
      "steam-millennium-config-backup-05",
      "steam-millennium-config-backup-10"
     ]
    },
    {
     "id": "n-stale",
     "text": "9 天",
     "meaning": "最近成功超过 216 小时状态就变“要处理”",
     "as_of": "2026-09-28",
     "source": "millennium_backup.py 第 743 行 age > 216",
     "screens": [
      "steam-millennium-config-backup-03"
     ]
    },
    {
     "id": "n-commits",
     "text": "18 个提交",
     "meaning": "仓库全部提交数，6 月 20 日—9 月 29 日（含北京 9/29 的 382d52f）",
     "as_of": "2026-09-29",
     "source": "git log --oneline | wc -l",
     "screens": [
      "steam-millennium-config-backup-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-binding",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "电脑配置与恢复登记这台电脑的 Steam 目录、Python 位置、G 和 H 路径、G 盘身份指纹；只有机器名和仓库位置都对上才用",
     "source": "E:\\PCConfig\\registries\\steam_millennium_backup.json；core_recovery.json 的 steam_millennium"
    },
    {
     "id": "r-pcconfig-cold",
     "with": "pcconfig",
     "direction": "交出",
     "flow": "G 盘上这份快照交给电脑配置与恢复的冷备入口，每天同步外接盘时同步到 H 并核对",
     "source": "E:\\PCConfig\\docs\\recovery\\steam_millennium_backup.md“G/H 联动”；H 回执 9 月 28 日 15:03"
    },
    {
     "id": "r-pcconfig-tasks",
     "with": "pcconfig",
     "direction": "交出",
     "flow": "计划任务登记在电脑配置与恢复的任务总表（每周一 10:30），换机重建时是“可选重建”",
     "source": "E:\\PCConfig\\registries\\tasks.json；docs\\governance\\scheduled_task_purpose_catalog.md 第 133 行"
    },
    {
     "id": "r-steam",
     "with": "Steam / Millennium（外部软件）",
     "direction": "拿来",
     "flow": "从 C:\\Program Files (x86)\\Steam\\millennium 读设置、自写样式和插件主题清单；读 millennium.dll 和 steam.exe 的版本号",
     "source": "steam_millennium_backup.json source_root；Invoke-MillenniumBackup.ps1 Snapshot 分支"
    },
    {
     "id": "r-github",
     "with": "GitHub（外部服务）",
     "direction": "交出",
     "flow": "手动提交推送公开的配置投影（设置、样式、清单、清单指纹），不含运行记录和装回留底",
     "source": ".gitignore；AGENTS.md 第 12–14、25 行"
    },
    {
     "id": "r-upstream",
     "with": "主题和插件的上游仓库（外部）",
     "direction": "拿来",
     "flow": "清单记下各插件主题的上游提交号（Adwaita 来自 tkashkin/Adwaita-for-Steam，Zehn 来自 yurisuika/Zehn），换电脑时照着装同一版",
     "source": "仓库 themes/*/metadata.json、plugins/*/metadata.json"
    },
    {
     "id": "r-cockpit",
     "with": "网站驾驶舱（第 2 批）",
     "direction": "交出",
     "flow": "开头“现在”横条和驾驶舱读 Status 的结果：状态、最近成功时间、任务上次结果和下次时间、G/H 是否同一代",
     "source": "Invoke-MillenniumBackup.ps1 -Mode Status -Json 输出字段"
    }
   ],
   "highlights": [
    {
     "id": "h-public-safe",
     "title": "公开仓库，也不漏私事",
     "screen": "steam-millennium-config-backup-07"
    },
    {
     "id": "h-no-false-delete",
     "title": "读不全，不算删了",
     "screen": "steam-millennium-config-backup-07"
    },
    {
     "id": "h-version-record",
     "title": "软件升级也记一笔",
     "screen": "steam-millennium-config-backup-07"
    }
   ],
   "mentions": [
    {
     "target": "/projects/pcconfig/",
     "screen": "steam-millennium-config-backup-03",
     "text": "每天 14:30 起〔电脑配置与恢复〕把 G 同步到外接 H 盘"
    },
    {
     "target": "/cockpit/#steam-millennium-config-backup",
     "screen": "steam-millennium-config-backup-03",
     "text": "网站〔驾驶舱〕上也看得到"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "steam-millennium-config-backup-05",
     "text": "按〔电脑配置与恢复〕里的本机登记"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "steam-millennium-config-backup-06",
     "text": "由〔电脑配置与恢复〕登记"
    },
    {
     "target": "/rules/charter/#L21",
     "screen": "steam-millennium-config-backup-07",
     "text": "我定过备份要跟着原件删（〔约法 L21〕）"
    },
    {
     "target": "/rules/charter/#L25",
     "screen": "steam-millennium-config-backup-10",
     "text": "出了报错才修，不再加功能（〔约法 L25〕）"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "每周自动快照现在正不正常：运行正常／有任务没按时跑／上次运行失败／暂时读不到",
     "source": "Invoke-MillenniumBackup.ps1 -Mode Status -Json 的 status（healthy／source_changed／needs_attention）、task.last_result、task.next_run、last_success_utc、replica_readback.status、cold_replica.status"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“核心设置快照”→ f-core-settings；“快捷样式备份”→ f-quick-css（改名“自写样式”，文件是本人自己写的 4 条滚动条样式）；“自动快照”→ f-weekly；“备份状态”→ f-status；“恢复预览”→ f-restore-plan；“设置恢复”→ f-restore。",
    "底稿“核心设置快照”的“或请AI手动备份”拆成单独的 f-manual（马上存一份）。"
   ],
   "dropped": [],
   "unsure": [
    "截图：仓库和旧网站都没有截图。开头一屏用的是 Adwaita 主题作者随主题附带的官方样张 light.png（本机 C:\\Program Files (x86)\\Steam\\millennium\\themes\\Adwaita-for-Steam\\screenshots\\，MIT 许可），不是本人的 Steam；图里是作者的游戏列表和一张游戏宣传图，强调色也不是本人调的绿。已在截图说明里写明。要不要换成本人自己的 Steam 截图（需本人截，且要避开好友和游戏库），请 Claude 定。",
    "f-restore（装回设置）底稿写“在用”，我改成“待验收”：只在隔离目录演练过，没在真的 Steam 上装回过（acceptance-latest.json live_restore_performed=false）。",
    "f-restore-plan（装回前预览）标“在用”，依据是 9 月 18 日验收时在本机真实 Steam 目录上跑过一次、结果 ready；那是 AI 验收时跑的，不是换电脑时本人要求的。如果“在用”只认本人真实需要时的调用，应改成“待验收”。",
    "自动快照时间：旧账本写“9 月 20 日 21:30（北京时间）”，实为电脑本地时间；换成北京时间是周一 10:30。任务起始时间带时区，按 UTC 02:30 固定，所以北京时间一直是周一 10:30；README 和状态窗口里的“每周日 19:30”是当初太平洋时间的本地写法（9 月 29 日提交 382d52f 已把 README 和状态窗口改成“每周一 10:30（北京时间）”，重装也固定 UTC 02:30）。页面写“每周一 10:30（北京时间）”。9 月 27 日有过“功能文字里不手写频率、以看板为准”的做法（旧稿 notes.sources），新规矩要求写清细节，我按新规矩写了具体时间。",
    "9 月 21 日那次“成功但没多出一代”是推断：旧账本记着那次成功，三处历史都没有那天的代号；last-run 只留最近一次，没有那次的单独回执。亮点第 3 张和 f-nochange 用到了它。",
    "替本人口吻写的句子（上线前请本人过目）：开头“我的 Steam 用 Millennium……换了一身外观”；第 3 屏“9 月 26 日按我的决定撤掉了”；第 4 屏“我退出 Steam，说‘可以’”；第 7 屏“我定过备份要跟着原件删”；第 10 屏“HLTB 插件被我关掉了”（依据只是 7 月 5 日快照里启用列表少了它，是不是本人关的、为什么关，未查清）。",
    "两个绿：Millennium 本身的 accentColor 是 #00ff00，Adwaita 配色表 themeColors 里的强调色是 RGB 39,168,100；Adwaita 的选项“Accent color”又设成 System。Steam 界面上最终显示哪一个，没有在 Steam 里核对（个人资料锁着，也不截本人的 Steam），页面只写“由主题决定、没逐个核对过”。",
    "f-uninstall-follow 标“没用过”：卸载会产生一代文件更少的快照，仓库历史和三代快照都一直是 20 个文件（插件主题 18 个），一次都没发生过。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/steam-millennium-config-backup/page.json",
  "sha256": "737a689a30e03794b0c8f88cfdd8c7d04963ac2dc82f53e2c9599ef80271958f",
  "converted_at_beijing": "2026-10-10T10:13:23+08:00"
 }
}
---

::screen{#steam-millennium-config-backup-01 section="top"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左边约 55% 宽：左上毛笔艺术字大标题，标题左边一个小的 Steam 官方标志（圆形活塞图标，灰蓝色）；标题下一句粗体副标题，再下面一段介绍。右边约 40% 宽留一个带细浅绿边框、圆角的空位，比例 16:9（贴 1600×900 的主题样张截图），空位里什么都不画；空位下面两行灰色小字截图说明；空位后面垫一片淡淡的水彩绿叶，只露出边缘。中间一排四张数字卡（上面小水彩插画、大号绿色数字、下面一两行小字）：1 一小叠 20 张纸片被绿色回形针夹着；2 三块硬盘（一根内置固态、一块装在机箱里的固态、一块连着线的外接固态）之间两条绿色箭头；3 五块小拼图（插件）和两块调色板（主题）；4 一页日历翻在“周一”，旁边一只小闹钟指着 10:30。卡片下面右对齐一行灰色小字“截至……”。再下面一条横跨整屏的细长圆角横条：左边写“现在”，接着一个留空的浅色圆角长框（约占横条 55% 宽，高度和横条一样，网页程序会往里填运行状态灯和一句话，框里不画任何字），横条最右边是链接按钮〔现在正不正常 → 驾驶舱〕。最下面一行两个白底细绿边圆角按钮。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：Steam 标志和大标题、副标题、介绍从上往下；截图空位占满宽（16:9），下面说明小字；四张数字卡两行两列；截至日期；“现在”横条占满宽，“现在”和空框在一行，驾驶舱按钮换到下一行；最后两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#steam-millennium-config-backup"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#steam-millennium-config-backup"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/steam-millennium-config-backup"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/steam-millennium-config-backup/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run"
  ],
  "screenshots": [
   {
    "file": "sources/assets/_references/5a6fb5933e83aa21fe0b3231bbd2b2c9031255a5378fc3ec2410768678236de0.png",
    "where": "右边约 40% 宽、16:9 的空位",
    "caption": "截图说明：Adwaita 主题作者随主题附带的官方样张（浅色）。我用的就是这套主题，但强调色和配色是自己调的绿；图里的游戏列表是作者的示例，不是我的。",
    "crop_h": [
     0,
     0,
     854,
     380
    ],
    "crop_v": [
     0,
     0,
     621,
     310
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
     "type": "illustration",
     "asset": "steam-millennium-config-backup/steam-millennium-config-backup-01-icon-03.png",
     "size": "small",
     "align": "left",
     "target_width": 72,
     "target_height": 72,
     "inline_row": "steam-brand-title",
     "inline_width": "72px",
     "row": "k1a-title"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "Steam 外观备份",
     "inline_row": "steam-brand-title",
     "inline_width": "1fr",
     "row": "k1a-title"
    },
    {
     "type": "live_strip",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "现在",
     "empty_slots": 1,
     "slot_width": "55%",
     "button_position": "right",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "align": "left",
     "size": "medium",
     "columns": 4,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "20 个文件",
     "icons": "auto",
     "item_count": 4
    },
    {
     "type": "prose",
     "align": "right",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "截至 2026 年"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "调好的 Steam 皮肤",
     "row": "hero",
     "width": "55%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "我的 Steam 用 Millennium",
     "row": "hero"
    },
    {
     "type": "screenshot",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "hero",
     "width": "45%",
     "aspect_ratio": "16:9",
     "decoration": "leaf_edges"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "截图说明：",
     "row": "hero"
    },
    {
     "type": "action_button",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "实查 01-h。左侧标题/副标题/介绍，右侧叶子探边截图槽和图注；四张数字卡横排，图在卡内上方；截至日期右齐；底部一条现在槽和三按钮。标题与截图同排，故标题左齐。Steam 标志为定稿 scene 点名。截图槽内留空。stat_card 现仅支持 stats 节点，本页四条数字是 para；需组件适配逐行｜，不能当前兜底当已表达。"
  },
  "v": {
   "blocks": [
    {
     "type": "illustration",
     "asset": "steam-millennium-config-backup/steam-millennium-config-backup-01-icon-03.png",
     "size": "small",
     "align": "left",
     "target_width": 72,
     "target_height": 72,
     "inline_row": "steam-brand-title",
     "inline_width": "72px",
     "row_v": true,
     "row": "k1a-title"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "Steam 外观备份",
     "inline_row": "steam-brand-title",
     "inline_width": "1fr",
     "row_v": true,
     "row": "k1a-title"
    },
    {
     "type": "live_strip",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "现在",
     "empty_slots": 1,
     "button_position": "below",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "20 个文件",
     "columns_v": 1,
     "icons": "none",
     "item_count": 4
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "截至 2026 年"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "调好的 Steam 皮肤"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "我的 Steam 用 Millennium"
    },
    {
     "type": "screenshot",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "aspect_ratio": "16:9",
     "decoration": "leaf_edges"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "截图说明："
    },
    {
     "type": "action_button",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "实查 01-v/v2。首张是标题/副标题/介绍→整宽截图槽/图注→2×2纯插画，续张四张整宽数字说明卡无插画，再截至日期、现在槽、驾驶舱链接和按钮。按实际图，不将数字文本塞回首张插画格。续张缺复制 AI 续作说明按钮，按定稿补齐，沿已批准按钮风格。现 illustration 无四图格支持，stat_card 无 para 数字卡支持；这些结构字段是待实现的构图意图。分张边界在20个文件之前，插画不带字。；QA04：01v孤立苗由独立four_stat_art_only插画块产生，块无text_ref/定稿节点；按审查取消该额外装饰，统计原字全部保留。"
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
   "source_phrase": "20 个文件｜一份备份：2 个能装回的设置文件，加 18 个插件和主题清单，共 52 KB",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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
   "source_phrase": "3 处｜E 盘项目文件夹、G 盘、外接 H 盘各一份，每份都逐个文件比对指纹",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "5 个插件 · 2 套主题｜清单记下名字、版本和上游提交号；正在用其中 3 个插件、1 套主题",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "每周一 10:30｜自动存一次（北京时间）；9 月 28 日这次 20 个文件全部核对通过",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "绿叶装饰",
   "source_phrase": "截图空位后面的水彩绿叶装饰",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-0d293ec5d94972ae8bb5.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-01-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-0d293ec5d94972ae8bb5",
   "title_text": "Steam 外观备份",
   "sha256": "837f8f4ac44e46767d355bef3fbba3f598df82f4024009af054ea0dee70c27f4",
   "status": "ready",
   "source_box": [
    172,
    49,
    921,
    223
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# Steam 外观备份
**调好的 Steam 皮肤，换电脑也能照着装回来。**

我的 Steam 用 Millennium（给 Steam 换皮肤、装插件的开源工具）换了一身外观：Adwaita 主题配绿色强调色，滚动条收成 4 像素细线，另装了 5 个插件。这个项目每周把能装回去的设置和我自己写的样式存一份，再记下装了哪些插件、主题和版本号；换电脑时先照清单把软件装好，再让 AI 预览、我确认后把设置填回去。游戏、账号和插件程序都不在里面。

截图说明：Adwaita 主题作者随主题附带的官方样张（浅色）。我用的就是这套主题，但强调色和配色是自己调的绿；图里的游戏列表是作者的示例，不是我的。

20 个文件｜一份备份：能装回的设置，加上插件和主题清单，一共 52 KB
3 处｜E 盘项目文件夹、G 盘、外接 H 盘各存一份，逐个文件比对指纹，三处现在一字不差
5 个插件｜连同 2 套主题记进清单：名字、版本、从哪下的；平时开着其中 3 个
每周一 10:30｜自动存一次（北京时间）；最近一次是 10 月 5 日，全部文件核对通过

截至 2026 年 10 月 10 日 05:20（北京时间）

现在　〔现在正不正常 → 驾驶舱〕

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#steam-millennium-config-backup-02 section="usage"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-02",
  "section": "usage",
  "title": "存了什么、没存什么",
  "scene": "横版：左上标题，下面一行说明小字。三张竖向大卡片横排：左卡（绿色细边，标签“能装回的：2 个文件”）顶部一幅小水彩插画：一个浅色的 Steam 窗口草图，右上角一个绿色按钮，右侧一条极细的滚动条被一枚放大镜照着；下面两段（粗体小标题＋正文）。中卡（浅绿细边，标签“只记清单：18 个文件”）：先是 5 行插件，每行左边一块小拼图图标、粗体名字和版本、括号里一句用途，前三行拼图涂成实心绿（开着），后两行只描边；再 2 行主题，左边小调色板图标，Adwaita 那行旁边一个小绿点；最下面一段小字。右卡（灰色细边，标签“不碰的”）：一排被淡灰斜线划掉的小图标（游戏光盘、程序齿轮、钥匙、一叠日志纸、一个地球代表网络），下面一段正文。三张卡等高，字不挤。",
  "portrait": "竖版：标题、说明小字；三张卡上下排，每张占满宽，插画和图标照画；插件和主题清单一行一条。",
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
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "存了什么、没存什么",
     "row": "hero",
     "width": "55%"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "一份备份 20 个文件",
     "row": "hero"
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "medium",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "asset_role": "monitor_checklist",
     "row": "hero",
     "width": "45%",
     "target_height": 230,
     "target_width": 362
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "能装回的：2 个文件",
     "icons": [
      "_library/icons/绿叶装饰.png",
      "_library/hires-icons/开关.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "grouped_items": true,
     "last_full_width": true,
     "row": "contents",
     "width": "40%",
     "icon_size": 96
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "只记清单：18 个文件",
     "icons": [
      "_library/hires-icons/打勾清单.png"
     ],
     "list_layout": "seven_plugin_theme_rows",
     "active_icon_rows": [
      1,
      2,
      3,
      6
     ],
     "last_full_width": true,
     "row": "contents",
     "width": "60%",
     "icon_size": 96
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "不碰的",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ],
     "tone": "gray",
     "last_full_width": true,
     "icon_size": 96
    }
   ],
   "notes": "实查 02-h。横版顶部标题介绍左、显示器清单插画右；三卡等高，左卡图在卡内上方，中央七行插件主题图标清单，右卡灰面、划掉的图标组合在上。原图章标题前 Steam 标志未在该屏 scene 点名，不额外保留。列表的实心/空心插件图标、七行插件主题小卡、两段小标题｜与主体嵌套，现 content_card 仅能保留文字，不能表达全部细节；需组件样张。带菜单字的插画必须先做无字资产。；QA04：只记清单图标置于卡顶，避免中部悬图。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "存了什么、没存什么"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "一份备份 20 个文件"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "能装回的：2 个文件",
     "icons": [
      "_library/icons/绿叶装饰.png",
      "_library/hires-icons/开关.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "illustration_order": "before_heading"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "只记清单：18 个文件",
     "icons": [
      "_library/hires-icons/打勾清单.png"
     ],
     "list_layout": "seven_plugin_theme_rows",
     "active_icon_rows": [
      1,
      2,
      3,
      6
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "不碰的",
     "icons": "auto",
     "illustration_order": "after_heading",
     "tone": "gray"
    }
   ],
   "notes": "实查 02-v/v2。首张标题介绍、整宽能装回卡，卡内先显示器放大镜插画再卡头和两段；续张只记清单七行全宽小卡，再不碰的无插画灰卡。列表的实心/空心插件图标、七行插件主题小卡、两段小标题｜与主体嵌套，现 content_card 仅能保留文字，不能表达全部细节；需组件样张。带菜单字的插画必须先做无字资产。"
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
   "source_phrase": "游戏光盘",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "自写样式 我自己写的 4 条样式：所有滚动条收成 4 像素细线，平时半透明淡灰，鼠标移上去才加深，轨道透明。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "开关",
   "source_phrase": "核心设置 只收 21 个认得的字段：Millennium 本身的强调色 #00ff00，更新和通知开关，启用哪 3 个插件，当前主题 Adwaita，两套主题的 42 个选项（圆角、配色方案、窗口按钮样式等）和 62 个配色值（Adwaita 配色表里另有一组强调色 RGB 39,168,100，也是绿；界面上最终用哪一个由主题决定，没在 Steam 里逐个核对过）。",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-080add9cd0030c.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-080add9cd0030c",
   "source_phrase": "三张竖向大卡片横排：左卡（绿色细边，标签“能装回的：2 个文件”）顶部一幅小水彩插画：一个浅色的 Steam 窗口草图，右上角一个绿色按钮，右侧一条极细的滚动条被一枚放大镜照着；下面两段（粗体小标题＋正文）。",
   "sha256": "a9f8b16c6185ffdf792475613ab2868f8164ee2f2ceef9eedc843e171aee4a55",
   "status": "ready",
   "original_elements": [
    "一个浅色的 Steam 窗口草图，右上角一个绿色按钮，右侧一条极细的滚动条被一枚放大镜照着"
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
   "asset": "steam-millennium-config-backup/steam-millennium-config-backup-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0edf304366fc91280fb9",
   "title_text": "存了什么、没存什么",
   "sha256": "a43b33e108825d9b5270daf9a63ee0fc9b205b524490cbb904fa63ea35fe5e97",
   "status": "ready",
   "source_box": [
    168,
    51,
    893,
    196
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 存了什么、没存什么
一份备份 20 个文件，分两类：能装回的、只记清单的；还有一些东西根本不碰。

**能装回的：2 个文件**
**核心设置**｜只收 21 个认得的字段：Millennium 本身的强调色 #00ff00，更新和通知开关，启用哪 3 个插件，当前主题 Adwaita，两套主题的 42 个选项（圆角、配色方案、窗口按钮样式等）和 62 个配色值（Adwaita 配色表里另有一组强调色 RGB 39,168,100，也是绿；界面上最终用哪一个由主题决定，没在 Steam 里逐个核对过）。
**自写样式**｜我自己写的 4 条样式：所有滚动条收成 4 像素细线，平时半透明淡灰，鼠标移上去才加深，轨道透明。

**只记清单：18 个文件**
每个插件存 2–3 个说明文件（共 11 个），每套主题存定义和选项文件（共 7 个）：
**Extendium 2.0.4**（让 Steam 装 Chrome 扩展）
**Size on Disk 1.1.0**（显示游戏占多大）
**Easy SteamGrid 4.1.0**（换游戏封面）
**HLTB for Steam 2.1.0**（显示通关要多久）
**Taskbar Download progress 2.3.0**（任务栏显示下载进度）
**Adwaita 4.4**（仿 GNOME 桌面，在用）
**Zehn 2026.9.7**（仿 Windows 10）
插件前三个开着。每个都记下名字、版本和上游仓库的提交号。程序和图片随时能从上游重新下，难重做的是自己调的选择，所以只存选择；清单用来照着装同一版，并在装回前核对版本对不对得上。

**不碰的**
Steam 和 Millennium 本体、插件程序、主题的图片和字体；各插件自己的设置；账号登录状态、游戏库缓存、日志；代理地址和代理账号（网络设置不存）。

::screen{#steam-millennium-config-backup-03 section="usage"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-03",
  "section": "usage",
  "title": "平时怎么用、出事怎么办",
  "scene": "横版：左上标题“平时怎么用”，左半边三张横向卡片从上往下（每张左边一个小水彩图标：一台安静的电脑旁边一只小闹钟；一只手按下一个绿色的“存”按钮；一个对话气泡里一枚放大镜照着一张打勾的清单），右边粗体一句加正文；第 1、3 张里的〔电脑配置与恢复〕〔驾驶舱〕画成绿色链接样式。右半边小标题“出事怎么办”，下面四张小卡片 2×2（小图标：一个半开的文件夹带问号、一块拔掉线的硬盘、一道闪电劈在一张写了一半的纸上、一张日历上 9 天被圈起来），每张粗体一句加小字。左右两半中间一条淡绿细竖线分开。",
  "portrait": "竖版：先“平时怎么用”三张卡上下排，再“出事怎么办”四张卡一行一张。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/",
    "orientations": [
     "h"
    ]
   },
   {
    "text": "驾驶舱",
    "href": "/cockpit/#steam-millennium-config-backup",
    "orientations": [
     "h"
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
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "平时怎么用"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "平时不用管",
     "icons": "auto",
     "item_count": 3,
     "last_full_width": true
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "出事怎么办"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "读不全",
     "icons": [
      "_library/icons/绿叶装饰.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/hires-icons/打勾清单.png"
     ],
     "item_count": 4
    }
   ],
   "notes": "实查 03-h。两个半屏章节左齐，中间浅绿细竖线；左列三张横卡，左图右字，第一第三卡较高；右侧四卡2×2，图在卡内上部。两标题共排，均非整屏独占。当前parser已将粗体标题｜说明识别为card，左3/右4卡可分配；右侧2×2可由columns表达。中央浅绿分隔线尚无规格字段支持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "平时怎么用"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "平时不用管",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "想马上存一份",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "想知道备份好不好",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "出事怎么办"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "读不全",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "G 盘没接上或认不出",
     "icons": [
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "存到一半断电",
     "icons": [
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "好久没存上",
     "icons": [
      "_library/hires-icons/打勾清单.png"
     ]
    }
   ],
   "notes": "实查 03-v/v2。首张标题→大卡（电脑闹钟图上、字下）→马上存的左图右字卡；续张先想知道备份好不好纯文字卡，再出事怎么办容器内四张无图整宽小卡。四卡外层容器与内卡双层边框需样张。分张边界在想知道备份好不好之前。"
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
   "source_phrase": "成绿色链接样式",
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
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "红色警示",
   "source_phrase": "G 盘没接上或认不出 E 盘这份照样存好，但这次记为失败，不冒充成功；下次 G 在了再补上。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "工具箱",
   "source_phrase": "存到一半断电 每次写之前先留底；下次运行先把没写完的那次退回或补完，再开始新的。有人手改过的文件不覆盖，停下来等处理。",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "好久没存上 最近一次成功超过 9 天，状态检查就从“正常”变成“要处理”。",
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
   "asset": "_library/round3/titles/title-r3-8477921ac5c65e15db4b.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-03-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-8477921ac5c65e15db4b",
   "title_text": "平时怎么用",
   "sha256": "120ccf74245896faf26f89084cffa6406560b108b3388c1c2296cb6611897e8b",
   "status": "ready",
   "source_box": [
    28,
    86,
    697,
    310
   ],
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "source_box": [
    878,
    11,
    1338,
    192
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 平时怎么用
**平时不用管**｜每周一 10:30（北京时间）电脑自动存一次，窗口隐藏、不弹黑框。设置和软件版本都没变，就只把现有这份重新核对一遍，不多存一份；变了就存成新的一代（一份完整的备份叫一代）。这个时间是当初在美国太平洋时区按本地“周日 19:30”装任务定下的；现在换电脑或重装任务也固定在同一时刻，不随电脑时区变，项目说明也改写成北京时间周一 10:30。E 盘存好马上复制到 G 盘并核对；每天 14:30 起〔电脑配置与恢复〕把 G 同步到外接 H 盘时，这一份也跟着同步、核对。

**想马上存一份**｜跟 AI 说：“Steam 外观备份一下。”刚换了主题、装了插件时用。

**想知道备份好不好**｜跟 AI 说：“Steam 外观备份正常吗？”AI 只读不写：核对最近一份每个文件的指纹，看 G、H 上是不是同一份，看自动任务上次的结果，再拿现在的 Steam 设置和备份比，告诉我有没有改过还没存的。网站〔驾驶舱〕上也看得到。原来开始菜单里有个“备份状态”小窗口，9 月 26 日按我的决定撤掉了，状态改到网站上看；重装任务也不会再把这个入口装回来。

## 出事怎么办
**读不全**｜Steam 正在更新、某个插件目录读不到、启用的插件找不到：这次整次不存，旧备份原样留着，报出原因。读不全不当成我删了。
**G 盘没接上或认不出**｜E 盘这份照样存好，但这次记为失败，不冒充成功；下次 G 在了再补上。
**存到一半断电**｜每次写之前先留底；下次运行先把没写完的那次退回或补完，再开始新的。有人手改过的文件不覆盖，停下来等处理。
**好久没存上**｜最近一次成功超过 9 天，状态检查就从“正常”变成“要处理”。

::screen{#steam-millennium-config-backup-04 section="usage"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-04",
  "section": "usage",
  "title": "换电脑怎么装回",
  "scene": "横版：左上标题，下面一行说明小字。中间四个编号步骤沿一条弯弯的水彩小路从左到右排开，每步一个小水彩图标（一个打开的软件包盒子和一张清单；一枚放大镜照着一张列了几行的预览单，单子边上一个小红叉和几个绿勾；一只手点在 Steam 托盘图标的“退出”上，旁边一个绿色对勾；一只眼睛看着一个浅色 Steam 窗口，窗口角上一个弯弯的“撤回”箭头），图标下面粗体一句加两三行小字；第 3、4 步旁边各画一只小手，表示要我亲手做。最下面一条横跨整屏的浅黄底便签条，写“实际用过多少”那段。",
  "portrait": "竖版：标题、说明小字；四步从上往下排，小路改成竖向；便签条在最下面。",
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
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "换电脑怎么装回",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "装回只动两样",
     "row": "hero"
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "hero",
     "width": "55%",
     "asset_role": "new_computer_path",
     "textless": true
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "above_card",
     "connector": "ribbon",
     "text_ref": "先装软件",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/icons/指向手.png",
      "_library/hires-icons/代码窗口.png"
     ],
     "name_in_card": true,
     "item_illustration_v": [
      "left_inside",
      "top_inside",
      "left_inside",
      "none"
     ],
     "human_action_items": [
      3,
      4
     ],
     "page_break_after_item": null,
     "direction": "horizontal",
     "open_nodes": true
    },
    {
     "type": "notice",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "实际用过多少",
     "tone": "yellow",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "实查 04-h。横版标题介绍左、电脑小路插画右；四步一行，小图在文字卡外上方，编号圆徽卡外，卡头在文字卡内；3/4步手势在卡角，弯曲小路连图；底部满宽黄便签。steps 是完整节点，text_ref 只定位第一步；不得将第4步另写 ref。item_illustration_v、page_break_after_item、人手指示与小路弯曲连接是现 numbered_steps 未支持的精确构图字段。电脑路标若裁切不能保留定稿外“新电脑”字。notice 黄色便签属于批准三图未覆盖的新样式，待样张。 本轮按实测 G3 横向溢出，将四步交给同族 flow 组件保持四列与图在卡外；不缩字，仍须核验编号卡外、手势、小路细节。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "换电脑怎么装回"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "装回只动两样"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "text_ref": "先装软件",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "_library/icons/指向手.png",
      "_library/hires-icons/代码窗口.png"
     ],
     "name_in_card": true,
     "item_illustration_v": [
      "left_inside",
      "top_inside",
      "left_inside",
      "none"
     ],
     "human_action_items": [
      3,
      4
     ],
     "page_break_after_item": 3,
     "direction": "vertical"
    },
    {
     "type": "notice",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "实际用过多少",
     "tone": "yellow"
    }
   ],
   "notes": "实查 04-v/批准替换04-v2。首张标题介绍和1/2/3步，依次左图/上图/左图；弯曲丝带向下连。续张第4步为无插画整宽文字卡，下面是整宽黄卡。steps 是完整节点，text_ref 只定位第一步；不得将第4步另写 ref。item_illustration_v、page_break_after_item、人手指示与小路弯曲连接是现 numbered_steps 未支持的精确构图字段。电脑路标若裁切不能保留定稿外“新电脑”字。notice 黄色便签属于批准三图未覆盖的新样式，待样张。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一个打开的软件包盒子和一张清单",
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
   "asset": "_library/icons/scene-r3-steam-millennium-config-backup-04-icons-1-074999a9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-steam-millennium-config-backup-04-icons-1-074999a9",
   "source_phrase": "一枚放大镜照着一张列了几行的预览单，单子边上一个小红叉和几个绿勾",
   "sha256": "4b3459bcde0267aec366bca97d577b6137c4b06e489e33cb437b9d5f64a4afed",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一只手点在 Steam 托盘图标的“退出”上，旁边一个绿色对勾",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "一只眼睛看着一个浅色 Steam 窗口，窗口角上一个弯弯的“撤回”箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "实际用过多少预览9月18日在这台电脑真的Steam目录上跑过一次，结果“可以装、没有阻碍”。真正的装回和撤回只在隔离的测试目录里演练过（装回再撤回，文件逐字节还原），还没在真的Steam上做过，也还没换过电脑。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "实际用过多少预览9月18日在这台电脑真的Steam目录上跑过一次，结果“可以装、没有阻碍”。真正的装回和撤回只在隔离的测试目录里演练过（装回再撤回，文件逐字节还原），还没在真的Steam上做过，也还没换过电脑。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-steam-millennium-config-backup.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-steam-millennium-config-backup",
   "source_phrase": "横版：左上标题，下面一行说明小字。中间四个编号步骤沿一条弯弯的水彩小路从左到右排开，每步一个小水彩图标（一个打开的软件包盒子和一张清单；一枚放大镜照着一张列了几行的预览单，单子边上一个小红叉和几个绿勾；一只手点在 Steam 托盘图标的“退出”上，旁边一个绿色对勾；一只眼睛看着一个浅色 Steam 窗口，窗口角上一个弯弯的“撤回”箭头），图标下面粗体一句加两三行小字；第 3、4 步旁边各画一只小手，表示要我亲手做。最下面一条横跨整屏的浅黄底便签条，写“实际用过多少”那段。",
   "sha256": "09e81e5d964d5be93cc847398fffa8780bb6580ac64059e1ec0c9e4d01fada24",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "steam-millennium-config-backup/steam-millennium-config-backup-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-cfc4e91cd52655c5f83d",
   "title_text": "换电脑怎么装回",
   "sha256": "582ef28d675d1b9f8201a4753d9d3151ea53730955d5a1dc360ed37ced2f0992",
   "status": "ready",
   "source_box": [
    53,
    35,
    703,
    187
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 换电脑怎么装回
装回只动两样：核心设置和自写样式。插件、主题要先自己装好；工具不下载、不安装、也不运行任何插件。

1. **先装软件**｜装好 Steam 和 Millennium，照清单装同一版本的插件和主题。
2. **先看预览**｜跟 AI 说：“把 Steam 外观装回来，先给我看会改什么。”AI 出一份预览，不写任何东西：要改的 2 个文件改前改后的指纹；3 个开着的插件，和设置里存了选项的 2 套主题（在用的 Adwaita、备用的 Zehn），清单是不是和备份一字不差；主题要用的图片等资源在不在。有一项对不上就停下，列出来。
3. **退出 Steam，确认后填回**｜我退出 Steam，说“可以”。AI 带着这份预览的编号去装，预览之后有任何变化就拒绝；Steam 还开着也拒绝，不替我关。只合并认得的字段，新电脑的网络设置和不认得的字段原样保留。
4. **打开 Steam 看效果**｜看主题、颜色、滚动条和插件。不满意，AI 用这次的撤回编号改回去；改之前的原文件留在新电脑的 Millennium 目录里，最多留最近 4 次。各插件自己的设置不在备份里，要在插件里重新设。

**实际用过多少**｜预览 9 月 18 日在这台电脑真的 Steam 目录上跑过一次，结果“可以装、没有阻碍”。真正的装回和撤回只在隔离的测试目录里演练过（装回再撤回，文件逐字节还原），还没在真的 Steam 上做过，也还没换过电脑。

::screen{#steam-millennium-config-backup-05 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-05",
  "section": "tech",
  "title": "一次备份经过哪几步",
  "scene": "横版：左上标题。上半部分六个圆角节点排成两行、每行三个，绿色箭头按 1→2→3、换行 4→5→6 相连（第 3 到第 4 用一条拐弯的箭头），每个节点左上角一个小水彩图标（一张写着路径的小地图、一把只开特定格子的钥匙串、两只并排的放大镜、一枚盾牌下压着一张被拦住的纸、一张新旧两页对比的纸和一个小天平、一块内置固态硬盘上盖着对勾），节点里粗体一句加两三行小字；第 1 个节点里〔电脑配置与恢复〕画成绿色链接样式。下半部分左边约 60% 宽一张四行小表“三处各存在哪”，右边约 40% 宽一张小卡片“代码”。",
  "portrait": "竖版：标题；六个节点从上往下排，箭头向下；小表一行一条（位置粗体，下面路径和留几代）；代码卡片在最下面。",
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
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "一次备份经过哪几步"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "arrow",
     "text_ref": "找到目录",
     "direction": "horizontal",
     "icons": "auto",
     "page_break_after_item": null,
     "last_item_illustration": "left_inside",
     "row_order": "1-2-3 / 4-5-6"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "三处各存在哪"
    },
    {
     "type": "table",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "text_ref": "位置",
     "portrait_layout": "preserve_three_columns",
     "column_widths": [
      "18%",
      "51%",
      "31%"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "right_inside",
     "connector": "none",
     "text_ref": "代码",
     "icons": "auto"
    }
   ],
   "notes": "实查 05-h。六节点2×3，图左字右；1→2→3后从右外侧向下绕回第4，再4→5→6；下部左61%表格、右39%代码卡带右侧电脑插画。flow 主体可接完整 steps，精确3→4回折、每项左右图位置需样张；竖第6去图、节点间分张目前不支持。table 竖默认逐行卡，preserve_three_columns为构图意图且字号不准缩；若组件不能实现需正式适配。代码卡 right_inside 现core无此变体。流程和表格属新样式，待样张。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "一次备份经过哪几步"
    },
    {
     "type": "flow",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "text_ref": "找到目录",
     "direction": "vertical",
     "icons": "auto",
     "page_break_after_item": 5,
     "last_item_illustration": "left_inside",
     "row_order": "1-2-3 / 4-5-6"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "三处各存在哪"
    },
    {
     "type": "table",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "text_ref": "位置",
     "portrait_layout": "preserve_three_columns",
     "column_widths": [
      "18%",
      "51%",
      "31%"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "代码",
     "icons": "auto"
    }
   ],
   "notes": "实查 05-v/v2。首张1–5节点左图右字整宽，向下绿箭头；续张第6纯字卡，下面三列四行表，底部无图代码卡。按实际原图保留窄三列表，不凭scene变逐行卡。flow 主体可接完整 steps，精确3→4回折、每项左右图位置需样张；竖第6去图、节点间分张目前不支持。table 竖默认逐行卡，preserve_three_columns为构图意图且字号不准缩；若组件不能实现需正式适配。代码卡 right_inside 现core无此变体。流程和表格属新样式，待样张。"
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
   "asset": "_library/hires-icons-r2/icon-clean-efc86be6e153919921f8.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "地图定位",
   "source_phrase": "一张写着路径的小地图",
   "sha256": "d5f6c48bfe0e0fd7dc64c01839a98a5065656cccc64f8b997bfeab91cff020a8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一把只开特定格子的钥匙串",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "两只并排的放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盾牌",
   "source_phrase": "一枚盾牌下压着一张被拦住的纸",
   "sha256": "53bd06dc245ab3fd8f472ad56e57f14d775fdac2c8fda524a89513012cafe440",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张新旧两页对比的纸和一个小天平",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一块内置固态硬盘上盖着对勾",
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
   "asset": "_library/titles/title-a9ef7c14972894e60892.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a9ef7c14972894e60892",
   "title_text": "一次备份经过哪几步",
   "sha256": "25f70f4eda66d32fcadd83ebf60c585ed9a4f087f19c420aa225105b048e4994",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 一次备份经过哪几步
1. **找到目录**｜按〔电脑配置与恢复〕里的本机登记，读 C:\Program Files (x86)\Steam\millennium；没有登记时从注册表找 Steam 装在哪。
2. **按白名单读**｜只读 20 个认得名字的文件；JSON 严格解析，重复的键、非数字、类型不对都拒绝；核心设置只留 21 个字段，新冒出来的字段只报名字、不存值。
3. **查全、读两遍**｜目录和该有的文件都在、两遍读一样才往下走（见亮点“读不全，不算删了”）。
4. **查私事**｜按字段名和内容查一遍能认出人的东西，命中整次拒绝（见亮点“公开仓库，也不漏私事”）。
5. **比上一份再写**｜文件和软件版本都没变：只核对、不新增。有变化：先在项目的运行记录文件夹（runtime）里写好完整一代并核对，再留底、逐个替换，最后写清单（每个文件的字节数和 SHA-256 指纹）并读回来核对。
6. **复制到 G 盘**｜先核对 G 盘身份（卷号指纹、文件系统、卷标都要和登记一致），再复制当前和历史各代，逐份核对。

**三处各存在哪**
| 位置 | 路径 | 留几代 |
|---|---|---|
| E 盘（原地） | E:\Projects\Tools\steam-millennium-config-backup | 当前一份；runtime 里最多 4 代 |
| G 盘 | G:\80_Backup\SteamMillennium | 和 runtime 里的各代一样，现在 3 代 |
| 外接 H 盘 | H:\80_自动备份区\SteamMillennium | 和 G 一样，由电脑配置与恢复同步 |
| GitHub（公开） | 本仓库 | 手动提交，现在停在 9 月 18 日那一代 |

**代码**｜Python 核心 1,212 行，另有一个 74 行的读文件告警模块，都只用标准库；PowerShell 入口 4 个共 339 行；隐藏启动用的 VBS 2 个。
**测试**｜Python 测试 63 项，10 月 10 日重跑全过；另有 Windows 检查 11 项，最近一次全过是 9 月 18 日。

::screen{#steam-millennium-config-backup-06 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。五张横向圆角卡片排成两列（左列三张、右列两张，右列下方空位放一小片水彩绿叶），每张左边一个小水彩图标（一个云朵旁边一只犹豫的手和一张写着差异的纸；一把挂锁锁着一扇门，门外一张小纸条写着“忙”；一张带编号的小票；一个只有 Python 标志的小盒子；一台电脑旁边一本登记簿，登记簿上一枚小硬盘图标），右边粗体一句加小字；最后一张里〔电脑配置与恢复〕画成绿色链接样式。",
  "portrait": "竖版：标题；五张卡片一行一张。",
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
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "不自动推到 GitHub",
     "icons": "auto",
     "row": "cards-1",
     "width": "50%"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "一把锁",
     "icons": "auto",
     "row": "cards-1",
     "width": "50%"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "装回要带预览编号",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "row": "cards-2",
     "width": "50%"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "Python 只用标准库",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ],
     "row": "cards-2",
     "width": "50%"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "这台电脑的事归电脑配置管",
     "icons": [
      "_library/fix-round-2/icon-clean-6f03b8cd4ae25eb62ff9.png"
     ],
     "row": "cards-3",
     "width": "100%"
    }
   ],
   "notes": "实查 06-h。五张左图右字横卡按先左后右2/2/1排列，右下卡外叶子补白。与正文顺序一致：不自动推、一把锁、预览号、Python、电脑配置。小票内001/002/003、门上“忙”等字不在本屏逐字定稿，不可直接裁切进插画。；QA04：按审查移除末行独立大绿苗装饰，末张内容卡通栏。；QA04：预览编号与Python两卡改用现有已发布文件核验、代码窗口图标，不再自动领取重复绿苗。；QA04：末卡也显式绑定外接硬盘，避免前两卡显式图标令auto游标移位。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "不自动推到 GitHub",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "一把锁",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "装回要带预览编号",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "Python 只用标准库",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ]
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "这台电脑的事归电脑配置管",
     "icons": [
      "_library/fix-round-2/icon-clean-6f03b8cd4ae25eb62ff9.png"
     ]
    }
   ],
   "notes": "实查 06-v。五卡整宽单列，均左小图右字；上右角及下边叶子不挤正文。小票内001/002/003、门上“忙”等字不在本屏逐字定稿，不可直接裁切进插画。；QA04：预览编号与Python两卡改用现有已发布文件核验、代码窗口图标，不再自动领取重复绿苗。；QA04：末卡也显式绑定外接硬盘，避免前两卡显式图标令auto游标移位。"
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
   "source_phrase": "一个云朵旁边一只犹豫的手和一张写着差异的纸",
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
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一把挂锁锁着一扇门，门外一张小纸条写着“忙”",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
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
   "source_phrase": "一张带编号的小票",
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
   "source_phrase": "一个只有 Python 标志的小盒子",
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
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "外接硬盘",
   "source_phrase": "一台电脑旁边一本登记簿，登记簿上一枚小硬盘图标",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": false,
   "semantic_status": "round2_explicit_leaf_cluster_reuse",
   "key": "绿叶装饰-illustration-round2",
   "source_phrase": "横版：左上标题。五张横向圆角卡片排成两列（左列三张、右列两张，右列下方空位放一小片水彩绿叶），每张左边一个小水彩图标（一个云朵旁边一只犹豫的手和一张写着差异的纸；一把挂锁锁着一扇门，门外一张小纸条写着“忙”；一张带编号的小票；一个只有 Python 标志的小盒子；一台电脑旁边一本登记簿，登记簿上一枚小硬盘图标），右边粗体一句加小字；最后一张里〔电脑配置与恢复〕画成绿色链接样式。",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-06-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "source_box": [
    24,
    10,
    738,
    227
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 为什么这样设计
**不自动推到 GitHub**｜仓库是公开的，每次提交前要有人看一眼改了什么。自动任务只存 E、G、H 三处，推送另外手动做。
**一把锁**｜手动和自动同时去存时，后来的那个直接报“忙”，不会两边一起写坏同一份。
**装回要带预览编号**｜防止“预览时是一个样，真装的时候文件已经变了”：编号对不上就不装。
**Python 只用标准库**｜换电脑装个 Python 3.11 以上就能跑，不用装第三方包；核心不联网。
**这台电脑的事归电脑配置管**｜项目只管怎么存、怎么装；Steam 目录、G 和 H 盘的身份、计划任务由〔电脑配置与恢复〕登记。别的电脑上拿到这个仓库，只会存在本地，不会误写到这台电脑的 G、H。

::screen{#steam-millennium-config-backup-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：左上标题。三张竖向大卡片横排，每张上面一幅水彩插画（1 一个敞开的公开书架，书架上的文件夹里有一张被小剪刀剪掉一角的纸，剪下的一角上画着一串打了马赛克的数字；2 一只手正要把一张纸放进碎纸机，另一只手挡住了它，旁边一个半开、里面有空格的文件夹；3 两张一模一样的纸并排，第二张右上角贴着一枚写着“3.5.0”的小邮票），插画下面粗体标题，再下面“麻烦”“解法”两段，“麻烦”“解法”四个字用绿色小标签。第 2 张里〔约法 L21〕画成绿色链接样式。",
  "portrait": "竖版：标题；三张卡上下排，每张插画在上、字在下。",
  "links": [
   {
    "text": "约法 L21",
    "href": "/rules/charter/#L21"
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
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "公开仓库，也不漏私事",
     "icons": [
      "_library/fix-round-2/icon-clean-267cc9c529fc1d472fde.png"
     ],
     "row": "highlights",
     "width": "33.333%",
     "paragraph_labels": "麻烦/解法",
     "label_style": "green_tag"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "读不全，不算删了",
     "icons": [
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png"
     ],
     "row": "highlights",
     "width": "33.333%",
     "paragraph_labels": "麻烦/解法",
     "label_style": "green_tag"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "软件升级也记一笔",
     "icons": "auto",
     "row": "highlights",
     "width": "33.333%",
     "paragraph_labels": "麻烦/解法",
     "label_style": "green_tag"
    }
   ],
   "notes": "实查 07-h。三张等宽长卡并排，卡内插画在上，粗体卡头下两段麻烦/解法；绿色小标签位于各段左边，不能补重复字。group 节点可定位完整各卡；绿色麻烦/解法标签目前content_card无精确字段支持，须组件样张。第二竖图卡内书架/空文件夹与横图碎纸机不同，资产按方向指定；第三竖插画内3.4.1/3.5.0只能由定稿程序覆盖不能裁字复用。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "公开仓库，也不漏私事",
     "icons": [
      "_library/fix-round-2/icon-clean-267cc9c529fc1d472fde.png"
     ],
     "paragraph_labels": "麻烦/解法",
     "label_style": "green_tag"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "读不全，不算删了",
     "icons": [
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png"
     ],
     "paragraph_labels": "麻烦/解法",
     "label_style": "green_tag"
    },
    {
     "type": "content_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "软件升级也记一笔",
     "icons": "auto",
     "paragraph_labels": "麻烦/解法",
     "label_style": "green_tag"
    }
   ],
   "notes": "实查 07-v/v2。首张只有第一亮点长卡，续张第二、第三卡上下；每卡上插画下正文，续张标签浅绿胶囊。分张边界在读不全，不算删了之前。group 节点可定位完整各卡；绿色麻烦/解法标签目前content_card无精确字段支持，须组件样张。第二竖图卡内书架/空文件夹与横图碎纸机不同，资产按方向指定；第三竖插画内3.4.1/3.5.0只能由定稿程序覆盖不能裁字复用。"
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件柜",
   "source_phrase": "公开仓库，也不漏私事 \n麻烦Millennium的设置文件里不只有外观，还有代理地址、代理账号、代理密码三栏，也可能夹带能认出账号的SteamID。仓库是公开的，整份照搬就等于把这些一起公开。\n解法只收21个认得的外观和开关字段，代理这三栏有值就不收；收下的再扫一遍：字段名像password、token、cookie、steamid64且有值，或内容里有SteamID、私钥、GitHub令牌、带账号密码的网址，命中就整次不写。新版Millennium冒出新字段时只报名字，不悄悄公开。6月20日第一版是手动剔掉SteamID，现在每周自动做。",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "绿封面册",
   "source_phrase": "读不全，不算删了 \n麻烦我定过备份跟着原件走，但没读全不能当成我删了（约法L21）。Steam更新到一半、某个插件目录暂时读不到时，如果照常存，这次读到的残缺版就会盖掉上一份完整的备份，读不到的那些插件主题清单跟着没了。\n解法每次存之前都查：三个目录都在、每个已装插件和主题的主文件都在、开着的插件和当前主题真的装着，读完再读一遍结果一样；差一样就整次不存，旧备份原样留着，报出原因。",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文件收纳现图小槽4比3",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅水彩插画（1 一个敞开的公开书架，书架上的文件夹里有一张被小剪刀剪掉一角的纸，剪下的一角上画着一串打了马赛克的数字；2 一只手正要把一张纸放进碎纸机，另一只手挡住了它，旁边一个半开、里面有空格的文件夹；3 两张一模一样的纸并排，第二张右上角贴着一枚写着“3.5.0”的小邮票），插画下面粗体标题，再下面“麻烦”“解法”两段，“麻烦”“解法”四个字用绿色小标签。",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready",
   "original_elements": [
    "一个敞开的公开书架，书架上的文件夹里有一张被小剪刀剪掉一角的纸，剪下的一角上画着一串抽象的小方块"
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
   "asset": "_library/illustrations/ill-e16ee295d00f1b.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-e16ee295d00f1b",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅水彩插画（1 一个敞开的公开书架，书架上的文件夹里有一张被小剪刀剪掉一角的纸，剪下的一角上画着一串打了马赛克的数字；2 一只手正要把一张纸放进碎纸机，另一只手挡住了它，旁边一个半开、里面有空格的文件夹；3 两张一模一样的纸并排，第二张右上角贴着一枚写着“3.5.0”的小邮票），插画下面粗体标题，再下面“麻烦”“解法”两段，“麻烦”“解法”四个字用绿色小标签。",
   "sha256": "5781931ba047d6d25589f5b153128d3c05fa831873b0980e62fe199fdbec1bb1",
   "status": "ready",
   "original_elements": [
    "一只手正要把一张纸放进碎纸机，另一只手挡住了它，旁边一个半开、里面有空格的文件夹"
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
   "asset": "_library/illustrations/纸张复本.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "纸张复本",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅水彩插画（1 一个敞开的公开书架，书架上的文件夹里有一张被小剪刀剪掉一角的纸，剪下的一角上画着一串打了马赛克的数字；2 一只手正要把一张纸放进碎纸机，另一只手挡住了它，旁边一个半开、里面有空格的文件夹；3 两张一模一样的纸并排，第二张右上角贴着一枚写着“3.5.0”的小邮票），插画下面粗体标题，再下面“麻烦”“解法”两段，“麻烦”“解法”四个字用绿色小标签。",
   "sha256": "6b9c4edb8919ba0d45d5fae517282bf21192273f7d7baa00e470beb72deb3c7c",
   "status": "ready",
   "original_elements": [
    "两张一模一样的纸并排，第二张右上角贴着一枚画抽象短线的的小邮票"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    27,
    10,
    295,
    216
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 亮点

**公开仓库，也不漏私事**
麻烦｜Millennium 的设置文件里不只有外观，还有代理地址、代理账号、代理密码三栏，也可能夹带能认出账号的 SteamID。仓库是公开的，整份照搬就等于把这些一起公开。
解法｜只收 21 个认得的外观和开关字段，代理这三栏有值就不收；收下的再扫一遍：字段名像 password、token、cookie、steamid64 且有值，或内容里有 SteamID、私钥、GitHub 令牌、带账号密码的网址，命中就整次不写。新版 Millennium 冒出新字段时只报名字，不悄悄公开。6 月 20 日第一版是手动剔掉 SteamID，现在每周自动做。

**读不全，不算删了**
麻烦｜我定过备份跟着原件走，但没读全不能当成我删了（〔约法 L21〕）。Steam 更新到一半、某个插件目录暂时读不到时，如果照常存，这次读到的残缺版就会盖掉上一份完整的备份，读不到的那些插件主题清单跟着没了。
解法｜每次存之前都查：三个目录都在、每个已装插件和主题的主文件都在、开着的插件和当前主题真的装着，读完再读一遍结果一样；差一样就整次不存，旧备份原样留着，报出原因。

**软件升级也记一笔**
麻烦｜只存文件不存版本，就看不出这套设置是在哪一版 Millennium 上存下的；换电脑装了新版出了问题，没处对照。
解法｜每一代都记下当时的 Millennium 和 Steam 版本，文件和版本都没变才算“没变化”。9 月 28 日这一代的 20 个文件和上一代一个字节都没差，只因为 Millennium 从 3.4.1 升到 3.5.0，就单独存了一代；9 月 21 日那次什么都没变，就没多出一代。

::screen{#steam-millennium-config-backup-08 section="features"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：左上标题，标题下一行图例：每个状态前画对应的小符号（在用＝实心绿圆点、待验收＝实心黄圆点、待实施＝空心绿圈、没用过＝实心灰圆点、说不准＝实心浅灰圆点、已停用＝小叉），括号里的颜色说明不画成字、只用符号表示。下面两组功能：每组一个带小水彩图标的组名标题横在组上方（“存一份”配一张被绿色回形针夹着的纸，“多存几处”配三块用箭头连起来的硬盘），组下面是功能小卡片，每行三张；每张卡片：粗体功能名，下面一两行小字说明，右下角是状态圆点加状态字。“存一份”9 张卡片排三行，“多存几处”5 张卡片排两行。组名不单独占一整列。",
  "portrait": "竖版保留现有v/v2分张：第1张08-v仅原标题、完整原图例、“存一份”组名及从“核心设置”到“公开前过滤”8项全部功能/说明/原状态；每项整宽上下排。第1张不重复下一分张“卸载跟着删”功能卡/说明/状态/插画，删除该跨张重复后底部正常白边由crop_box处理，不补空卡/新字。第2张原范围、原文件和全部原字不变，完整屏text不减少。不新增分张或装饰，原横scene不动；以实际完整单张gen_prompt分配为唯一手机范围。",
  "links": [],
  "anchors": [
   {
    "id": "g-snapshot",
    "text": "存一份"
   },
   {
    "id": "g-copies",
    "text": "多存几处"
   },
   {
    "id": "f-core-settings",
    "text": "核心设置"
   },
   {
    "id": "f-quick-css",
    "text": "自写样式"
   },
   {
    "id": "f-plugin-list",
    "text": "插件清单"
   },
   {
    "id": "f-theme-list",
    "text": "主题清单"
   },
   {
    "id": "f-weekly",
    "text": "每周自动存"
   },
   {
    "id": "f-manual",
    "text": "马上存一份"
   },
   {
    "id": "f-nochange",
    "text": "没变化不重复"
   },
   {
    "id": "f-privacy-filter",
    "text": "公开前过滤"
   },
   {
    "id": "f-uninstall-follow",
    "text": "卸载跟着删"
   },
   {
    "id": "f-keep-generations",
    "text": "留最近几代"
   },
   {
    "id": "f-g-copy",
    "text": "复制到 G 盘"
   },
   {
    "id": "f-h-copy",
    "text": "同步到 H 盘"
   },
   {
    "id": "f-github",
    "text": "公开到 GitHub"
   },
   {
    "id": "f-adopt",
    "text": "接管旧备份"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "全部功能",
     "row": "head",
     "width": "34%"
    },
    {
     "type": "status_legend",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "none",
     "connector": "none",
     "text_ref": "图例：",
     "row": "head",
     "width": "66%"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "存一份",
     "icons": "auto",
     "heading_icon": "_library/icons/文稿堆.png"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "核心设置",
     "icons": "auto",
     "status_position": "bottom_right",
     "item_count": 9
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "多存几处",
     "icons": "auto",
     "heading_icon": "_library/icons/followup-r3-steam08-three-drives.png"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "留最近几代",
     "icons": "auto",
     "status_position": "bottom_right",
     "item_count": 5,
     "row_counts": [
      3,
      2
     ],
     "last_row_widths": [
      "34%",
      "66%"
     ]
    }
   ],
   "notes": "实查08-h。标题左、完整六状态图例右，共占一行；实际组名占左侧图文窄栏，不按scene改成上方跨行。存一份右侧3×3卡；多存几处上行3卡、下行2卡（接管旧备份较宽）。卡内图左、字右、状态右下。现feature_card不把含｜para当功能卡；status_legend不将括号颜色说明替换成符号，G1与图例隐去括号要求需组件契约统一。状态色只能赋给状态符号。功能卡/图例属于新样式，待样张。；QA04：所有功能组统一标签18%、功能卡82%，保持上下列起点一致。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "全部功能"
    },
    {
     "type": "status_legend",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "text_ref": "图例："
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "存一份",
     "icons": "auto",
     "heading_icon": "_library/icons/文稿堆.png"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "核心设置",
     "portrait_columns": 1,
     "icons": [
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/icons/文件齿轮.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png"
     ],
     "item_count": 8,
     "status_position": "right"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "卸载跟着删",
     "portrait_columns": 1,
     "icons": [
      "_library/hires-icons/01-绿叶装饰-clean.png"
     ],
     "item_count": 1,
     "status_position": "bottom_right",
     "page_break_before": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "多存几处"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "留最近几代",
     "portrait_columns": 1,
     "icons": [
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
      "_library/icons/followup-r3-steam08-three-drives.png",
      "_library/hires-icons/01-绿叶装饰-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png"
     ],
     "item_count": 5,
     "status_position": "bottom_right"
    }
   ],
   "notes": "实查08-v/v2。首张仅原标题、完整六项图例、存一份组标题及8项核心设置至公开前过滤；小图在左，字在右，状态右端。续张先卸载跟着删（无组名重复），再多存几处标题及5卡，均无插画、整宽、状态右下。08-v没有卸载跟着删重复，定稿portrait明确不补卡、新字和装饰。page_break_before引擎目前未执行；需确保分张正好一次。功能普通para的｜拆卡及状态定位当前未支持；待样张。"
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
   "source_phrase": "存一份",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "核心设置｜只存 21 个认得的字段，能装回｜在用",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "自写样式｜quick.css 原样存，只统一换行｜在用",
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
   "source_phrase": "插件清单｜名字、版本、上游提交号、开着哪几个｜在用",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "主题清单｜主题定义、选项和配色，记下在用哪套｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "每周自动存｜每周一 10:30（北京），错过补跑，失败隔 15 分钟重试 3 次，窗口隐藏｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
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
   "source_phrase": "马上存一份｜不等周一，现在就存｜在用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "没变化不重复｜文件和软件版本都没变，只核对、不新增一代｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "公开前过滤｜白名单之外不收；查 SteamID、令牌、私钥，命中整次拒绝｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "卸载跟着删｜目录读全、两遍一致时，卸掉的插件主题也从备份删；读不全不删｜没用过",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/followup-r3-steam08-three-drives.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "外接硬盘",
   "source_phrase": "三块用箭头连起来的硬盘",
   "sha256": "1f09f097bf57549d9bfbc2ef4cb1fe1882953823e9feec66deecff4ecf9c4eff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "留最近几代｜E 盘项目里留最近 4 代，可调 2–32｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "复制到 G 盘｜先认盘再复制当前和历史各代，逐份核对｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "同步到 H 盘｜电脑配置与恢复每天同步外接盘时一起同步、核对｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-6c8f61c25046fd4ea548.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\steam-millennium-config-backup\\img\\steam-millennium-config-backup-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-6c8f61c25046fd4ea548",
   "title_text": "全部功能",
   "sha256": "27ad83b63427e81b39c96b361d36d65c691830f0816342473621fb722be9ef3c",
   "status": "ready",
   "source_box": [
    60,
    3,
    427,
    129
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 全部功能
图例：在用（绿圆点）　待验收（黄圆点）　待实施（空心绿圈）　没用过（灰圆点）　说不准（浅灰圆点）　已停用（叉）

**存一份**
核心设置｜只存 21 个认得的字段，能装回｜在用
自写样式｜quick.css 原样存，只统一换行｜在用
插件清单｜名字、版本、上游提交号、开着哪几个｜在用
主题清单｜主题定义、选项和配色，记下在用哪套｜在用
每周自动存｜每周一 10:30（北京），错过补跑，失败隔 15 分钟重试 3 次，窗口隐藏｜在用
马上存一份｜不等周一，现在就存｜在用
没变化不重复｜文件和软件版本都没变，只核对、不新增一代｜在用
公开前过滤｜白名单之外不收；查 SteamID、令牌、私钥，命中整次拒绝｜在用
卸载跟着删｜目录读全、两遍一致时，卸掉的插件主题也从备份删；读不全不删｜没用过

**多存几处**
留最近几代｜E 盘项目里留最近 4 代，可调 2–32｜在用
复制到 G 盘｜先认盘再复制当前和历史各代，逐份核对｜在用
同步到 H 盘｜电脑配置与恢复每天同步外接盘时一起同步、核对｜在用
公开到 GitHub｜看过差异后手动提交推送｜在用
接管旧备份｜升级到 2.0 时，先把旧的无清单备份核对、存档，再接管｜在用

::screen{#steam-millennium-config-backup-09 section="features"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：和上一屏同样的卡片样式，接着排三组：“查和管”（组名旁小图标：放大镜照着一张清单）5 张卡片、“装回”（小图标：一个弯弯的回家箭头）4 张卡片、“兼容”（小图标：新旧两个插头接在一起）1 张卡片；每行三张，组名横在组上方，不单独占一整列。卡片右下角照样是状态圆点加状态字（颜色同上一屏图例）。",
  "portrait": "竖版仅09-v一张：全部功能续标题、查和管/装回/兼容三组及原10项完整说明/状态。每项整宽，一行一张；缩小图标和标题占位，名称与正文使用整宽，不让左右大插画挤正文。状态可在标题行右上清楚展示，状态名及颜色含义保持，不按横版scene的右下位置判手机错。36源像素正文/44行高、总1534源像素是已批准可行参考，以370px实际可直接读懂为准。保留白底、绿组名和清楚卡片层次，不为特定水彩图标或状态圆点/胶囊形式本身重画。",
  "links": [],
  "anchors": [
   {
    "id": "g-check",
    "text": "查和管"
   },
   {
    "id": "g-restore",
    "text": "装回"
   },
   {
    "id": "g-upkeep",
    "text": "兼容"
   },
   {
    "id": "f-status",
    "text": "备份状态"
   },
   {
    "id": "f-verify",
    "text": "核对一份备份"
   },
   {
    "id": "f-status-window",
    "text": "状态窗口"
   },
   {
    "id": "f-task-setup",
    "text": "装好和自查任务"
   },
   {
    "id": "f-task-toggle",
    "text": "停止或恢复自动存"
   },
   {
    "id": "f-restore-plan",
    "text": "装回前预览"
   },
   {
    "id": "f-restore",
    "text": "装回设置"
   },
   {
    "id": "f-rollback",
    "text": "撤回装回"
   },
   {
    "id": "f-recover",
    "text": "中断后收尾"
   },
   {
    "id": "f-old-entry",
    "text": "旧入口照样能用"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "全部功能（续）"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "查和管",
     "icons": "auto"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "text_ref": "备份状态",
     "icons": "none",
     "item_count": 5,
     "row_counts": [
      3,
      2
     ],
     "last_row_widths": [
      "65%",
      "35%"
     ],
     "status_position": "bottom_right"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "装回",
     "icons": "auto"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 4,
     "illustration": "none",
     "connector": "none",
     "text_ref": "装回前预览",
     "icons": "none",
     "item_count": 4,
     "status_position": "bottom_right"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "text_ref": "兼容",
     "icons": "auto"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "旧入口照样能用",
     "icons": "none",
     "item_count": 1,
     "status_position": "bottom_right"
    }
   ],
   "notes": "实查09-h。整屏章节标题按追加要求居中；三组均组插画左栏、功能卡右栏。查和管3+2卡，第二行装好和自查任务约占2/3；装回实际一排4卡；兼容1整宽卡。按原图，不统一套三列。无单卡插画、状态在右下。section_heading带组图和feature_card普通para拆卡/非等宽最后行目前未表达，待组件样张。；QA04：所有功能组统一标签18%、功能卡82%，保持上下列起点一致。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "全部功能（续）"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "查和管",
     "background": "pale_green"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "备份状态",
     "portrait_columns": 1,
     "icons": "none",
     "item_count": 5,
     "status_position": "top_right",
     "status_style": "pill"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "装回",
     "background": "pale_green"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "装回前预览",
     "portrait_columns": 1,
     "icons": "none",
     "item_count": 4,
     "status_position": "top_right",
     "status_style": "pill"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "兼容",
     "background": "pale_green"
    },
    {
     "type": "feature_card",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "旧入口照样能用",
     "portrait_columns": 1,
     "icons": "none",
     "item_count": 1,
     "status_position": "top_right",
     "status_style": "pill"
    }
   ],
   "notes": "实查09-v，仅一张。三组10项全宽单列，绿色整宽组名条，卡内名称与说明充满宽，右上清楚状态胶囊；没有组或卡的大插画。原标题普通粗体现已批准手机结构，但新程序毛笔章节字仍须合格标题图，不能拿字体兜底冒充通过。定稿portrait已确认36源像素正文/44行高/总1534源像素参考，以实际370px可读为准。状态词与含义保留；不为圆点胶囊本身重画。现feature_card对para不拆功能卡，status_style等未执行；待接入。"
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜照着一张清单",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个弯弯的回家箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/插头.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "插头",
   "source_phrase": "新旧两个插头接在一起",
   "sha256": "9f19b0993d47ecb67a994c3988d36efb98a1b9dca540cacc914abb5755b33ebe",
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
   "role": "icon",
   "slot_ordinal": 9,
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
   "slot_ordinal": 10,
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
   "asset": "_library/titles/title-8344610235166dbb1b95.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8344610235166dbb1b95",
   "title_text": "全部功能（续）",
   "sha256": "a477fe5c5f4e2dd6de8bb2ec910a2ee46bd3cd38fafaf792ecf3815cdea111fd",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 全部功能（续）
**查和管**
备份状态｜只读：核对指纹、G 和 H 是不是同一代、任务上次结果、设置有没有改过没存｜在用
核对一份备份｜只读核对任意一份备份的清单和每个文件指纹｜在用
状态窗口｜刷新状态、立即备份、停止或启用自动备份、打开任务计划程序｜说不准
装好和自查任务｜装计划任务并回读；自查任务定义有没有走样。自查按同一时刻（北京周一 10:30）比；9 月 28 日因电脑时区改了误报过“时间不符”，9 月 29 日修好后自查通过｜在用
停止或恢复自动存｜只停以后的触发，不打断正在存的那次｜说不准

**装回**
装回前预览｜不写任何东西，列出要改什么、哪些版本或资源对不上｜在用
装回设置｜带预览编号，只合并认得的字段和自写样式，先留底｜待验收
撤回装回｜按撤回编号改回装回前的样子；文件被再改过就不动｜待验收
中断后收尾｜断电或出错后按留底退回或补完；有外来改动就停｜待验收

**兼容**
旧入口照样能用｜旧脚本名转给新入口，旧的跳过核对开关不再生效｜说不准

::screen{#steam-millennium-config-backup-10 section="history"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。中间一条从左到右的水彩绿丝带时间轴，上面九个小旗（日期粗体绿色，下面一两行小字），相邻的上下错开不挤；9 月 18 日那面旗画得大一点、旁边一个小徽章写“2.0”。时间轴下面一条横跨整屏的细卡片，写最后那段“现在”；卡片里〔约法 L25〕画成绿色链接样式。",
  "portrait": "竖版：标题；时间轴改成从上往下，小旗一行一个；最下面的细卡片占满宽。",
  "links": [
   {
    "text": "约法 L25",
    "href": "/rules/charter/#L25",
    "orientations": [
     "h"
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
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "演进（北京时间）"
    },
    {
     "type": "timeline",
     "align": "left",
     "size": "medium",
     "columns": 5,
     "illustration": "below_card",
     "connector": "ribbon",
     "text_ref": "6 月 20 日",
     "direction": "horizontal",
     "icons": [
      "_library/icons/文件齿轮.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文件齿轮.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "item_count": 9,
     "stagger": true,
     "emphasis_item": 6,
     "emphasis_badge": "2.0",
     "row_counts": [
      5,
      4
     ]
    },
    {
     "type": "notice",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "现在",
     "icons": [
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png"
     ]
    }
   ],
   "notes": "实查10-h。九旗一行上下错落，日期旗文字上、插画在旗脚外，下方连续绿丝带；9月18日大旗突出2.0；底部满宽现在细卡，左边纸张对勾小图，右端叶子。章节独占整屏按追加要求居中。当前parser将九个日期识别成一个完整stats节点，timeline可接整节点；below_card、错落旗、变宽重点旗/2.0徽章均无现有精确支持。2.0是9月18日正文已有片段，徽章不得重复生成可计文字。旗式时间线是新样式，待样张。；QA04：按审查将九列改为两排5+4，不缩字号、不改原文。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "演进（北京时间）"
    },
    {
     "type": "timeline",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "ribbon",
     "text_ref": "6 月 20 日",
     "direction": "vertical",
     "icons": "none",
     "item_count": 9,
     "item_variants": [
      "flags_connected",
      "flags_connected",
      "flags_connected",
      "flags_connected",
      "flags_connected",
      "flags_connected",
      "flags_connected",
      "flags_connected",
      "flags_connected"
     ],
     "item_connectors": [
      "ribbon",
      "ribbon",
      "ribbon",
      "ribbon",
      "ribbon",
      "ribbon",
      "ribbon",
      "ribbon",
      "ribbon"
     ],
     "emphasis_item": 6,
     "emphasis_badge": "2.0",
     "page_break_after_item": 5
    },
    {
     "type": "notice",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "text_ref": "现在",
     "date_flag": true
    }
   ],
   "notes": "实查10-v/v2。首张电脑/日历/闹钟插画在章标题之前，下面前5日期单列旗卡，左外有竖丝带圆节点；续张剩4日期每卡日期竖旗在左、说明右，无外连线；最后现在也用左旗卡样式。分张边界9月18日前，不能重复标题或日期。当前parser将九个日期合并成完整stats节点，必须只以6月20日定位整个节点；不能拿9月18日另定位stats内项。每项变体/连接/分张字段表达目标，当前组件未执行，待样张；只有无字插画可复用。；QA04：按审查移除标题前错放的独立电脑/游戏机插画块。；main-closer3：按wave2b复查要求，九日期全部统一flags_connected/ribbon，仍由同一组件实例在第5项后切片，原字与编号不变。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "6 月 20 日 第一版：手动把设置、自写样式和插件主题清单存进仓库，剔掉 SteamID；附一份 PDF 说明。那时开着 4 个插件。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "7 月 5–6 日 变成每周自动存，窗口隐藏不闪黑框。这次自动存就记下了一个变化：HLTB 插件被我关掉了，开着的剩 3 个。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "红色警示",
   "source_phrase": "7 月 23 日 自动存更稳：失败隔 15 分钟重试，最多 3 次。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "8 月 16 日 Adwaita 和 Zehn 升级后，存了一次新的主题定义和选项。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "8 月 31 日 拒绝“备份目录套在 Steam 目录里”这类互相套叠的设置。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "9 月 18 日 2.0：每份带指纹清单、写入可留底恢复、G 和 H 两处副本、装回预览、装回和撤回、任务自查和状态窗口；55 项测试。同一天 2.0.1：装回记录不全时也不丢撤回编号。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "绿封面册",
   "source_phrase": "9 月 26 日 状态窗口的开始菜单入口按我的决定撤掉；说明书精简成一屏人话。",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "9 月 28 日 最近一次自动存：Millennium 升到 3.5.0，存了新的一代（还没推到 GitHub）。",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "9 月 29 日 自查改成按同一时刻核对，不再因电脑时区误报；重装任务固定北京周一 10:30，也不再装回开始菜单入口。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "工具箱",
   "source_phrase": "现在18个提交。属于“偶尔用”的项目：出了报错才修，不再加功能（约法L25）。",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "绿封面册",
   "source_phrase": "现在18个提交。属于“偶尔用”的项目：出了报错才修，不再加功能（约法L25）。",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/main-steam-millennium-config-backup.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-steam-millennium-config-backup",
   "source_phrase": "横版：左上标题。中间一条从左到右的水彩绿丝带时间轴，上面九个小旗（日期粗体绿色，下面一两行小字），相邻的上下错开不挤；9 月 18 日那面旗画得大一点、旁边一个小徽章写“2.0”。时间轴下面一条横跨整屏的细卡片，写最后那段“现在”；卡片里〔约法 L25〕画成绿色链接样式。",
   "sha256": "09e81e5d964d5be93cc847398fffa8780bb6580ac64059e1ec0c9e4d01fada24",
   "status": "ready"
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

## 演进（北京时间）
**6 月 20 日**｜第一版：手动把设置、自写样式和插件主题清单存进仓库，剔掉 SteamID；附一份 PDF 说明。那时开着 4 个插件。
**7 月 5–6 日**｜变成每周自动存，窗口隐藏不闪黑框。这次自动存就记下了一个变化：HLTB 插件被我关掉了，开着的剩 3 个。
**7 月 23 日**｜自动存更稳：失败隔 15 分钟重试，最多 3 次。
**8 月 16 日**｜Adwaita 和 Zehn 升级后，存了一次新的主题定义和选项。
**8 月 31 日**｜拒绝“备份目录套在 Steam 目录里”这类互相套叠的设置。
**9 月 18 日**｜2.0：每份带指纹清单、写入可留底恢复、G 和 H 两处副本、装回预览、装回和撤回、任务自查和状态窗口；55 项测试。同一天 2.0.1：装回记录不全时也不丢撤回编号。
**9 月 26 日**｜状态窗口的开始菜单入口按我的决定撤掉；说明书精简成一屏人话。
**9 月 28 日**｜最近一次自动存：Millennium 升到 3.5.0，存了新的一代（还没推到 GitHub）。
**9 月 29 日**｜自查改成按同一时刻核对，不再因电脑时区误报；重装任务固定北京周一 10:30，也不再装回开始菜单入口。

**现在**｜20 个提交（截至 10 月 10 日）。属于“偶尔用”的项目：出了报错才修，不再加功能（〔约法 L25〕）。
