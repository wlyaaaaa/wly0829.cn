---
{
 "title": "内存盘守护",
 "kind": "project",
 "url": "/projects/ramdisk-guardian/",
 "tagline": "照看只放缓存的内存盘，内存被卡住时帮它腾出来。",
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
  "page": "ramdisk-guardian",
  "kind": "project",
  "title": "内存盘守护",
  "url": "/projects/ramdisk-guardian/",
  "tagline": "照看只放缓存的内存盘，内存被卡住时帮它腾出来。",
  "status": "常用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/RamdiskGuardian",
  "capability": "管好内存盘：只放缓存、卡住的内存腾回来",
  "based_on": {
   "commit": "65d02c41ed2941f7b279909e618757e42f1b5da8",
   "commit_time": "2026-09-29T01:40:34+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，白底水彩风，从开头这屏的插画出发：一根绿色内存条画成的小硬盘静静躺着，几片半透明的浏览器小图标像落叶一样慢慢飘进盘里；旁边的小园丁每隔一会儿看一眼脚边的小闹钟，拿小扫帚轻轻一扫，盘里的落叶化成一串绿色光点，沿着细光带流回主板，内存条的颜色随之变亮一点；四周水彩叶子轻轻摆动。镜头不动，不出现任何文字，最后一帧回到第一帧。",
  "registry": {
   "groups": [
    {
     "id": "g-upkeep",
     "name": "每 15 分钟的照看"
    },
    {
     "id": "g-release",
     "name": "自动腾内存"
    },
    {
     "id": "g-tools",
     "name": "查询、部署和维护"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-patrol",
     "group": "g-upkeep",
     "name": "定时巡查",
     "what": "登录时和之后每 15 分钟在后台跑一轮，不弹窗口；盘没出来最多等 150 秒；同一时间只跑一份，一轮最长 10 分钟",
     "how": "自动：计划任务 RAMDisk_Code_Backup",
     "status": "在用",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:111-128；计划任务定义；日志 6,226 轮（facts #10、#28）"
    },
    {
     "id": "f-identity",
     "group": "g-upkeep",
     "name": "认准这块盘",
     "what": "卷标必须是 RAMDISK，Primo 里正好一块盘对应 Z；对不上就报错，什么都不动",
     "how": "自动，每轮都查",
     "status": "在用",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:129-132；9/2 00:05 读不到卷标时挡下（facts #12、#33）"
    },
    {
     "id": "f-skeleton",
     "group": "g-upkeep",
     "name": "补齐文件夹和说明",
     "what": "补 12 个缓存和草稿文件夹、盘根《使用说明》（和仓库里的比对指纹，不一样就重抄）、隐藏的就绪标记",
     "how": "自动，每轮都做",
     "status": "在用",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:133-153；9/27、9/28 重启后第一轮都 OK（facts #6、#35）"
    },
    {
     "id": "f-watch",
     "group": "g-upkeep",
     "name": "空间和内存盯梢",
     "what": "五条提醒线：盘剩余少于 2 GiB、已用超过 8 GiB、可用内存少于 8 GB、提交余量少于 4 GB、不可归属内存达到 4 GB；只记不弹",
     "how": "自动；问 AI“内存盘现在健康吗”",
     "status": "在用",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:237-241；日志 1,070 条提醒（facts #14、#28）"
    },
    {
     "id": "f-alert",
     "group": "g-upkeep",
     "name": "出错弹一次",
     "what": "连续出错时只在第一轮弹一次 Windows 消息（留 60 秒）并记下。弹过 2 次：7 月 23 日改容量时、9 月 2 日读不到盘的名字时",
     "how": "自动；收到后跟 AI 说“内存盘报错了，看看”",
     "status": "在用",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:35-40；alerts.log（facts #17、#33）"
    },
    {
     "id": "f-auto-release",
     "group": "g-release",
     "name": "自动清空重建",
     "what": "盘里缓存不超过 8 GiB、又有证据像是这块盘卡着内存时，用 Primo 命令清空重建、把空盘存回镜像。共 38 次（都按 9 月 29 日以前的旧条件），前 3 次各腾出 23–30 GB",
     "how": "自动，条件够了才动手",
     "status": "在用",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:191-235；psm1:29-35；日志 38 次（facts #19、#30、#31）"
    },
    {
     "id": "f-growth-evidence",
     "group": "g-release",
     "name": "看增长才动手",
     "what": "只是可用内存低不再动手：要不可归属内存达到 8 GB，或和 24 小时基线比的相关增长达到 8 GB（可用内存低于 5 GB 时 4 GB 就够）；相关增长要隔 5 分钟以上再看到一次。9 月 29 日上线，还没触发过",
     "how": "自动",
     "status": "待验收",
     "screen": "ramdisk-guardian-08",
     "source": "提交 65d02c4；docs/memory-recovery.md“何时可以重建”；tests/Test-RamdiskHistoryReplay.ps1（3 次强信号保留、35 次仅低内存不再触发）；logs\\health.json 北京 9/29 03:31 Health=OK、MemoryBaselineStatus=ready、Decision=no-pressure"
    },
    {
     "id": "f-confirm",
     "group": "g-release",
     "name": "连续三次才算",
     "what": "连续 3 次读数（每 5 秒一次，前后至少跨 10 秒）都紧才算；两次读数隔超过 30 秒就重新数",
     "how": "自动",
     "status": "待验收",
     "screen": "ramdisk-guardian-08",
     "source": "psm1:36-62；9/18 上线后没触发过（facts #20、#24、#25）"
    },
    {
     "id": "f-cooldown",
     "group": "g-release",
     "name": "腾不出就停手",
     "what": "离上次动手至少 1 小时；失败就报错、1 小时内不试；腾出不到 1 GB 就 6 小时内不再试",
     "how": "自动",
     "status": "待验收",
     "screen": "ramdisk-guardian-08",
     "source": "psm1:59-60,86-92；zguardian.ps1:222-235（facts #22、#25）"
    },
    {
     "id": "f-recheck",
     "group": "g-release",
     "name": "动手前再核一遍",
     "what": "重建前再核 Primo 盘号、卷的身份、暂停和登记；重建后回读卷标，补文件夹和说明，Primo 命令失败就报错",
     "how": "自动",
     "status": "待验收",
     "screen": "ramdisk-guardian-08",
     "source": "zguardian.ps1:193-211；按盘号认准 9/8 上线，之后没重建过（facts #23、#24）"
    },
    {
     "id": "f-pause",
     "group": "g-release",
     "name": "暂停自动重建",
     "what": "只停“清空重建”，文件夹维护和体检照常；恢复时不清冷却",
     "how": "跟 AI 说“先暂停内存盘自动重建，跑完再恢复”",
     "status": "没用过",
     "screen": "ramdisk-guardian-08",
     "source": "Set-RamdiskRecoveryMode.ps1；logs\\recovery-control.json 从没生成过（facts #26）"
    },
    {
     "id": "f-lease",
     "group": "g-release",
     "name": "长任务登记",
     "what": "用缓存的程序登记进程号和用到几点（30 秒到 24 小时），登记有效期间不重建；进程没了或到期自动作废",
     "how": "让 AI 替长任务登记；用完释放",
     "status": "说不准",
     "screen": "ramdisk-guardian-08",
     "source": "Use-RamdiskCacheLease.ps1；用完即删不留痕，E 盘项目里找不到调用方（facts #27）"
    },
    {
     "id": "f-health",
     "group": "g-tools",
     "name": "健康体检",
     "what": "只读、不写任何文件：查盘、文件夹、说明、计划任务和最近一轮结果（怎样算正常见“为什么这样设计”第 4 条）",
     "how": "问 AI“内存盘现在健康吗”",
     "status": "在用",
     "screen": "ramdisk-guardian-09",
     "source": "Get-RamdiskHealth.ps1；9/18 旧网站采集、9/28 两次运行（facts #10、#15）"
    },
    {
     "id": "f-efficiency",
     "group": "g-tools",
     "name": "划不划算",
     "what": "只报量得到的：容量、已用、电脑内存；管理员加一项可读 Primo 的内存模式和镜像实际大小。不猜提速，驱动实际占多少读不到",
     "how": "问 AI“内存盘占了多少内存，还划算吗”",
     "status": "说不准",
     "screen": "ramdisk-guardian-09",
     "source": "Get-RamdiskEfficiency.ps1；零写入不留痕，只找到为写网页跑的记录（facts #5）"
    },
    {
     "id": "f-deploy",
     "group": "g-tools",
     "name": "部署和恢复",
     "what": "默认只出预览；确认后装计划任务、核对盘，失败按相反顺序退回；可以只恢复任务、不动别的",
     "how": "换电脑或守护丢了，跟 AI 说“先预览再恢复内存盘守护”",
     "status": "在用",
     "screen": "ramdisk-guardian-09",
     "source": "deploy.ps1；9/18 07:11、07:31 两次真部署（facts #36、#37）"
    },
    {
     "id": "f-chrome",
     "group": "g-tools",
     "name": "Chrome 缓存接进来",
     "what": "把 Chrome 的网页缓存、代码缓存、显卡缓存三个文件夹连到 Z；Chrome 开着就先不动；旧文件夹改名留着，不删",
     "how": "部署时点名要这一项",
     "status": "在用",
     "screen": "ramdisk-guardian-09",
     "source": "deploy.ps1:98-123；三个连接现在都在，共 0.43 GB（facts #7）"
    },
    {
     "id": "f-fast-startup",
     "group": "g-tools",
     "name": "关掉快速启动",
     "what": "Windows 的快速启动会打断 Primo 关机存盘、开机建盘；6 月 15 日关掉后一直关着",
     "how": "部署时点名要这一项",
     "status": "在用",
     "screen": "ramdisk-guardian-09",
     "source": "HiberbootEnabled=0；5f8cf40 README §1（facts #9）"
    },
    {
     "id": "f-custom",
     "group": "g-tools",
     "name": "换盘符和间隔",
     "what": "盘不叫 Z 时可以换盘符；巡查间隔可调 1 分钟到 1 天",
     "how": "部署时指定",
     "status": "没用过",
     "screen": "ramdisk-guardian-09",
     "source": "deploy.ps1:11-12,88-92；ramdrive.txt 从没生成过（facts #38）"
    },
    {
     "id": "f-image-compact",
     "group": "g-tools",
     "name": "镜像瘦身",
     "what": "镜像比盘里内容大很多时，用 Primo 官方命令另存成紧凑镜像，核对后替换，旧的留作退路。9 月 18 日做过一次：12 GiB 缩到 0.55 GiB",
     "how": "请 AI 按项目文档做",
     "status": "在用",
     "screen": "ramdisk-guardian-09",
     "source": "docs/cache-efficiency.md:208-216；logs\\cache-optimization-latest.json（facts #39）"
    },
    {
     "id": "f-r-backup",
     "group": "g-retired",
     "name": "正式文件备份通道",
     "what": "Z 上放项目、文档和其他文件，每 15 分钟备份到 E 盘、掉盘后自动还原。7 月 21 日退役，Z 只放缓存",
     "how": "—",
     "status": "已停用",
     "screen": "ramdisk-guardian-09",
     "source": "5f8cf40 README；ecd7111"
    },
    {
     "id": "f-r-warn-popup",
     "group": "g-retired",
     "name": "提醒也弹窗",
     "what": "内存偏紧这类普通提醒也弹窗，6 月 15 日到 8 月 13 日弹过 81 次；之后只记不弹",
     "how": "—",
     "status": "已停用",
     "screen": "ramdisk-guardian-09",
     "source": "alerts.log；0c5581e（facts #34）"
    },
    {
     "id": "f-r-window",
     "group": "g-retired",
     "name": "开始菜单维护小窗",
     "what": "开始菜单里的“RAMDisk 与远程串流维护”，能看状态、暂停重建、停守护；9 月 26 日按我的决定撤掉，改在网站看",
     "how": "—",
     "status": "已停用",
     "screen": "ramdisk-guardian-09",
     "source": "owner-decisions 第二轮 T8、第三轮 E5；PCConfig docs/recovery/streaming_maintenance.md:7"
    }
   ],
   "numbers": [
    {
     "id": "n-runs",
     "text": "7,330 轮",
     "meaning": "守护巡查轮数（日志里 guardian run 行），日志最早到北京 7/24 14:19，更早的已轮换",
     "as_of": "2026-09-28",
     "source": "logs\\guardian.log.1 + guardian.log，logstats.py 现算，截至北京 22:20",
     "screens": [
      "ramdisk-guardian-01"
     ]
    },
    {
     "id": "n-reinit",
     "text": "38 次",
     "meaning": "自动清空重建次数（EMERGENCY release 行）",
     "as_of": "2026-09-28",
     "source": "同上；最后一次北京 9/7 23:07",
     "screens": [
      "ramdisk-guardian-01",
      "ramdisk-guardian-08"
     ]
    },
    {
     "id": "n-freed",
     "text": "23–30 GB",
     "meaning": "前 3 次重建后可用内存比 15 分钟前那一轮多出的量（29.6、27.0、23.3 GB）",
     "as_of": "2026-09-28",
     "source": "日志前后行（facts #31）",
     "screens": [
      "ramdisk-guardian-01",
      "ramdisk-guardian-08",
      "ramdisk-guardian-10"
     ]
    },
    {
     "id": "n-used",
     "text": "0.5 GiB",
     "meaning": "Z 盘已用（卷已用 0.52 GiB，其中 Chrome 三类缓存 0.43 GB）",
     "as_of": "2026-09-28",
     "source": "Get-RamdiskHealth.ps1 -Json，北京 22:22；9/28 21:5x 分目录统计",
     "screens": [
      "ramdisk-guardian-01",
      "ramdisk-guardian-03",
      "ramdisk-guardian-07"
     ]
    },
    {
     "id": "n-tests",
     "text": "124 项",
     "meaning": "9 个测试脚本里计数的检查项（15+1 组+15+14+9+1 组历史回放+39+26+4）",
     "as_of": "2026-09-29",
     "source": "tests\\*.ps1 北京 9/29 03:3x 重跑输出（提交 65d02c4）",
     "screens": [
      "ramdisk-guardian-01",
      "ramdisk-guardian-06"
     ]
    },
    {
     "id": "n-recent",
     "text": "996 轮 · 990 轮正常 · 6 轮提醒",
     "meaning": "北京 9/18 15:00 到 9/28 22:20 的结果行",
     "as_of": "2026-09-28",
     "source": "logstats.py",
     "screens": [
      "ramdisk-guardian-02"
     ]
    },
    {
     "id": "n-warn-popups",
     "text": "81 次",
     "meaning": "6/15–8/13 普通提醒弹窗次数（alerts.log 的 WARN 行）",
     "as_of": "2026-09-28",
     "source": "logs\\alerts.log",
     "screens": [
      "ramdisk-guardian-06",
      "ramdisk-guardian-09"
     ]
    },
    {
     "id": "n-image",
     "text": "12 GiB → 0.55 GiB，缩小 95.4%",
     "meaning": "9/18 镜像瘦身前后大小（12,874,547,712 → 592,314,880 字节）",
     "as_of": "2026-09-18",
     "source": "logs\\cache-optimization-latest.json",
     "screens": [
      "ramdisk-guardian-07",
      "ramdisk-guardian-09",
      "ramdisk-guardian-10"
     ]
    },
    {
     "id": "n-image-now",
     "text": "0.6 GiB",
     "meaning": "现在镜像文件大小（639,500,800 字节）",
     "as_of": "2026-09-28",
     "source": "E:\\RamdiskImage\\Z.vdf 文件大小",
     "screens": [
      "ramdisk-guardian-04"
     ]
    },
    {
     "id": "n-code",
     "text": "864 行 · 35 次",
     "meaning": "程序行数（8 个文件，wc -l）；提交次数（6/15–9/29）",
     "as_of": "2026-09-29",
     "source": "提交 65d02c4 git show 逐文件 wc -l；git rev-list --count",
     "screens": [
      "ramdisk-guardian-06"
     ]
    },
    {
     "id": "n-test-lines",
     "text": "9 组 794 行",
     "meaning": "tests 下 9 个 .ps1 的行数（wc -l）",
     "as_of": "2026-09-29",
     "source": "提交 65d02c4 git show 逐文件 wc -l",
     "screens": [
      "ramdisk-guardian-06"
     ]
    },
    {
     "id": "n-replay",
     "text": "3 次仍触发、35 次不再触发",
     "meaning": "新触发条件拿 38 次旧重建记录回放的结果",
     "as_of": "2026-09-29",
     "source": "tests/Test-RamdiskHistoryReplay.ps1 输出；docs/memory-recovery.md",
     "screens": [
      "ramdisk-guardian-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-policy",
     "with": "pcconfig",
     "direction": "管规矩",
     "flow": "电脑配置与恢复持有机器级存储政策（Z 只放可重建缓存、12 GiB、8 GiB 软上限、镜像路径）和 drives.json 登记；本项目照政策照看 Z",
     "source": "PCConfig docs/governance/dev_storage_policy.md:23,104-123；registries/drives.json"
    },
    {
     "id": "r-pcconfig-tasks",
     "with": "pcconfig",
     "direction": "登记和重建",
     "flow": "电脑配置与恢复的任务说明目录把 RAMDisk_Code_Backup 显示为“内存盘维护”；换机重建计划调 deploy.ps1 -TaskOnly -Apply，再用 Get-RamdiskHealth.ps1 -Json 核对",
     "source": "PCConfig registries/task_purpose_catalog.json；tools/build_scheduled_task_rebuild_plan.mjs:518-526"
    },
    {
     "id": "r-pcconfig-window",
     "with": "pcconfig",
     "direction": "被调用",
     "flow": "电脑配置与恢复的维护窗口（Show-StreamingMaintenance.ps1，开始菜单入口 9/26 撤掉）每 30 秒读体检结果，并能调 Set-RamdiskRecoveryMode.ps1 暂停重建、停用任务",
     "source": "PCConfig docs/recovery/streaming_maintenance.md；registries/streaming_maintenance.json"
    },
    {
     "id": "r-cockpit",
     "with": "cockpit",
     "direction": "交出状态",
     "flow": "看板接口在自动任务全表里读这个计划任务的运行结果（不算备份）；接口现在不读 health.json",
     "source": "PCConfig docs/runtime/dashboard-api-contract.md:182"
    },
    {
     "id": "r-chrome",
     "with": "Chrome",
     "direction": "放缓存",
     "flow": "Chrome 的 Cache、Code Cache、GPUCache 通过目录连接写到 Z:\\Caches 下",
     "source": "deploy.ps1:98-123；9/28 只读 Get-Item"
    },
    {
     "id": "r-primo",
     "with": "Primo Ramdisk",
     "direction": "依赖",
     "flow": "Primo 建盘、开机装回镜像、关机存镜像；守护用它的命令行 ls/init/save，资源检查可选 ls/view",
     "source": "zguardian.ps1:82-109；Get-RamdiskEfficiency.ps1"
    },
    {
     "id": "r-sunshine",
     "with": "sunshine-remote-streaming",
     "direction": "共用过窗口",
     "flow": "曾和远程电脑串流共用开始菜单里的“RAMDisk 与远程串流维护”小窗，9/26 一起撤掉；现在没有数据往来",
     "source": "PCConfig docs/recovery/streaming_maintenance.md:7"
    }
   ],
   "highlights": [
    {
     "id": "h-cache-only",
     "title": "吃过一次亏，从此只放丢得起的。",
     "screen": "ramdisk-guardian-07"
    },
    {
     "id": "h-stuck-memory",
     "title": "删了文件不还内存，就帮它清零。",
     "screen": "ramdisk-guardian-07"
    },
    {
     "id": "h-image-compact",
     "title": "镜像从 12 GiB 瘦到 0.55 GiB。",
     "screen": "ramdisk-guardian-07"
    }
   ],
   "mentions": [
    {
     "target": "/how/#ramdisk-guardian",
     "screen": "ramdisk-guardian-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/projects/pcconfig/#usage",
     "screen": "ramdisk-guardian-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/cockpit/#ramdisk-guardian",
     "screen": "ramdisk-guardian-01",
     "text": "现在正不正常 → 驾驶舱"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "守护计划任务现在正不正常：运行正常／没按时跑／上次运行失败／暂时读不到",
     "source": "看板接口 automation 块里 RAMDisk_Code_Backup 那一条（上次运行时间、结果码、下次运行）"
    },
    {
     "slot": "health",
     "meaning": "最近一轮体检结果和 Z 盘已用，例如“正常 · 已用 0.5 GiB”或“有提醒：可用内存偏低”",
     "source": "E:\\Projects\\Tools\\RamdiskGuardian\\logs\\health.json 的 Health、Metrics.UsedGB、ObservedUtc（超过 33 分钟算读不到）；接口现在还不读，第 2 批要接"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“内存盘健康”→ f-health（体检入口）；每 15 分钟那一轮本身拆成 f-patrol、f-identity、f-skeleton（底稿只写了一条，这里按真实机制分开写全）",
    "底稿“空间与内存监测”→ f-watch；“按需重建缓存盘”→ f-auto-release，外加它的三道新关 f-confirm、f-cooldown、f-recheck（9/18、9/8 加的，状态不同，所以分开）",
    "底稿“长任务暂停”→ f-pause；“长任务保护”→ f-lease；“异常提醒”→ f-alert；“资源效率”→ f-efficiency；“部署恢复”→ f-deploy，部署里可选的三项另列 f-chrome、f-fast-startup、f-custom",
    "守护内部细节（互斥锁、原子写、日志轮换、空间读取重试）并进 f-patrol 和技术屏，不单列"
   ],
   "dropped": [
    "OpenClaw 网关看门狗（6/16 放进本仓库、6/19 迁出）：不是内存盘的功能，家在 OpenClaw 冻结页，本页只在 facts 记一笔，不上图",
    "开机“按新者回拉”（404a605）：随 7/21 备份通道一起退役，并进 f-r-backup",
    "旧网站和仓库里只有一张截图（docs/primo_setup.png），放在演进屏；旧网站 public/media 下没有这个项目的图",
    "原第 2 屏“什么能放、什么不能放”（能放：浏览器代码和显卡缓存、解压临时文件、小型测试草稿区；不能放：Git 仓库、只有一份的文档和数据、模型、凭据、备份、系统临时文件夹）：审稿第 13 条，Z 放什么的家在电脑配置与恢复页，本页删掉，已在 batch2.md 提请那一页补上（出处 Z_使用说明.md:21-31、PCConfig dev_storage_policy.md）"
   ],
   "unsure": [
    "功能状态和底稿不同的三条：f-pause 底稿“在用”→ 没用过（暂停会写 logs\\recovery-control.json，这个文件从没出现）；f-lease 底稿“在用”→ 说不准（登记用完即删不留痕，E:\\PCConfig、E:\\.agents 里没有调用它的程序，leases 文件夹是 9/17 部署验收那天建的）；f-efficiency 底稿“在用”→ 说不准（零写入不留痕，只找到 AI 为写网页跑的两次）。",
    "“自动清空重建”标在用，但 38 次全是 9/8 以前的旧规则做的（固定清 0 号盘、一轮读数就动手）；现行四道关从没触发过，所以关卡单列成三条“待验收”。9 月 29 日触发条件又改成要看到相关增长，单列成 f-growth-evidence“看增长才动手”（待验收）；f-auto-release 仍标在用，指的是清空重建这个动作本身。",
    "亮点 2 的“多出 23–30 GB”是和 15 分钟前那一轮的可用内存比（触发那一刻的可用内存日志没记）；较真的读者可能说这 15 分钟里别的程序也可能放了内存。第 1 次触发前一轮的不可归属是 3.5，触发时 8.2，重建后 −3.7，方向一致，我认为可信。",
    "日志时间换成北京时间靠提交时区推断：7/05–9/23 的提交都是 UTC−7，9/25 起 UTC−5。9/24 有一次 −10:00 的提交，那几天的日志本页没用到。",
    "亮点 1“把 E 上唯一的备份也删光了”出自 6/15 第一版 README 原文（“把唯一备份整盘删光……这就是历史数据丢失的真因”）；丢的是什么、多少，没有记录。旧稿写成“有隐患”，这次按 README 改成“出过事”。",
    "替本人口吻的句子：第 9 屏“开始菜单维护小窗……按我的决定撤掉”（依据：owner-decisions 第二轮 T8 原话“开始菜单窗口除了 ProxyClean 和密码中心基本不打开，都往网站上放”、第三轮 E5）；第 2、3 屏里“跟 AI 说……”的几句说法是 AI 写的示例，没有找到本人真这样说过的记录。上线前请本人过目。另有第 4 屏“AI 只在我问起或收到报错时来读结果、动手修”也是替本人口吻写的（审稿第 15 条补列）。",
    "第 5 屏“缓存超过 8 GiB 不自动清：这时内存是真内容占着、不是驱动卡着，清掉只会毁掉正在用的缓存”这条理由是 AI 按代码（psm1:31，已用超过软上限直接不算压力）和 a7aee97 提交说明归纳的，仓库没写原因。",
    "镜像“正常关机存盘、开机装回”只有 9 月 25 日 16:14（北京）一次正常重启作证（System 日志 1074/6006，Z.vdf 最后写入 16:15）；9/24–9/28 另有 6 次意外关机（Kernel-Power 41/6008），其中 9/27 21:14、9/28 22:05 两次之后盘都从 9/25 那份镜像回来。",
    "第 3 屏“换电脑”一条里“先在 Primo 里照原样建盘”的参数照 DEPLOY.md:7；Primo 本身要不要重新买授权、装哪一版，仓库里没写，未查清。",
    "维护窗口程序 Show-StreamingMaintenance.ps1 还在，可手动打开，只是开始菜单入口撤了；页面把“开始菜单维护小窗”标已停用，没写“窗口还在”，免得和网站看板的决定打架。要不要写，请 Claude 定。",
    "Z 盘根下有一个空的 Worktrees 文件夹（北京 9/17 04:10 建，不是守护建的），和“Z 不放 worktree”的规矩不符，但是空的；只记进 audit.md，页面不写。",
    "修复对话 02:03 说“基线还在预热”；我 9 月 29 日 03:31 读 logs\\health.json 时 MemoryBaselineStatus 已是 ready（MemoryTrendReady=false），页面写“基线已建好”。新触发没真重建过，按修复对话“没有做真实重建验收”标待验收。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/ramdisk-guardian/page.json",
  "sha256": "f7c872044db13947ff9f686c2f87542e2f860477076299d2029848a198a965e1",
  "converted_at_beijing": "2026-10-10T11:36:50+08:00"
 }
}
---

::screen{#ramdisk-guardian-01 section="top"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，标题右边同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（后者带 GitHub 小猫标志）。下面一段介绍，介绍下一行灰色小字（含〔电脑配置与恢复〕链接）。右上一幅水彩插画：一根绿色内存条被画成一块小硬盘的样子，盘面写着“Z”，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：一个转着的小闹钟、一把扫帚扫出一团绿色光点、一小片浏览器图标、一叠打着对勾的试卷。数字卡下沿右侧一行灰色小字“截至 10 月 10 日 05:01（北京时间）”。最下面一条细长圆角横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 30%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段和灰色小字；插画缩到屏宽；四张数字卡排成两行两列；“截至……”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个满宽空框上下排（每个高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#ramdisk-guardian"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/RamdiskGuardian"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/#pcconfig-04"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#ramdisk-guardian"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/ramdisk-guardian/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "health"
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
     "align": "left",
     "size": "large",
     "text_ref": "内存盘守护"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/文件夹.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "text_ref": "7,330轮巡查：7月24日以来每15分钟一轮，一轮不落（更早的记录已轮换掉）38次自动清空重建，9月7"
    },
    {
     "type": "prose",
     "align": "right",
     "text_ref": "截至10月10日09:32（北京时间"
    },
    {
     "type": "action_button",
     "columns": 3,
     "row": "intro",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "这台电脑有一块用内存虚拟出来的Z盘（12GiB），读写极快，只放浏览器缓存这类又碎又常用、丢了能自动再生"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "intro",
     "width": "40%"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上毛笔艺术字大标题，标题右边同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（后者带 GitHub 小猫标志）。下面一段介绍，介绍下一行灰色小字（含〔电脑配置与恢复〕链接）。右上一幅水彩插画：一根绿色内存条被画成一块小硬盘的样子，盘面写着“Z”，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：一个转着的小闹钟、一把扫帚扫出一团绿色光点、一小片浏览器图标、一叠打着对勾的试卷。数字卡下沿右侧一行灰色小字“截至 9 月 28 日 22:20（北京时间）”。最下面一条细长圆角横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 30%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "内存盘守护"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/文件夹.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "text_ref": "7,330轮巡查：7月24日以来每15分钟一轮，一轮不落（更早的记录已轮换掉）38次自动清空重建，9月7"
    },
    {
     "type": "prose",
     "align": "right",
     "text_ref": "截至10月10日09:32（北京时间"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    },
    {
     "type": "prose",
     "text_ref": "这台电脑有一块用内存虚拟出来的Z盘（12GiB），读写极快，只放浏览器缓存这类又碎又常用、丢了能自动再生"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段和灰色小字；插画缩到屏宽；四张数字卡排成两行两列；“截至……”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个满宽空框上下排（每个高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "portrait_required": true
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
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿叶装饰",
   "source_phrase": "像落叶一样轻",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-ramdisk-guardian.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-ramdisk-guardian",
   "source_phrase": "右上一幅水彩插画：一根绿色内存条被画成一块小硬盘的样子，盘面写着“Z”，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存。",
   "sha256": "b6bb5606ff04437a7a32a1afce04189883bab97d88301f4d299e9cc188f1f7d1",
   "status": "ready",
   "original_elements": [
    "一根绿色内存条被画成一块小硬盘的样子，盘面画抽象短线的，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存"
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
   "asset": "_library/titles/title-807d67167ecbc80a882d.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-807d67167ecbc80a882d",
   "title_text": "内存盘守护",
   "sha256": "2467407487e90461108c436f7f7a17f6460895007b579eb3856718a9b6a6a554",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 内存盘守护

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

这台电脑有一块用内存虚拟出来的 Z 盘（12 GiB），读写极快，只放浏览器缓存这类又碎又常用、丢了能自动再生成的东西。它有两个坑：正常关机时 Primo（建这块盘的软件）会把盘存进镜像、开机装回，可一旦死机断电、盘突然不见或被清空重建，上次存盘以后写的内容就没了；驱动删了文件也不一定把内存还回来。内存盘守护是一个每 15 分钟跑一轮的后台程序：认准这块盘、补齐盘上的文件夹，盯着空间和内存；内存像是被这块盘卡住时，清空重建，想把内存腾回来；单是电脑可用内存低不算，得同时看到和这块盘对得上的增长。

Z 盘和别的盘怎么分工、各放什么，见〔电脑配置与恢复〕；这里只讲照看 Z 盘的程序。

- **7,330 轮**　巡查：7 月 24 日以来每 15 分钟一轮，一轮不落（更早的记录已轮换掉）
- **38 次**　自动清空重建，9 月 7 日以后再没需要过
- **0.5 GiB**　Z 盘现在只用这么多，基本是 Chrome 的三类缓存
- **124 项**　隔离测试，不碰真盘，10 月 10 日重跑全部通过

截至 10 月 10 日 09:32（北京时间）

**现在**　〔现在正不正常 → 驾驶舱〕

::screen{#ramdisk-guardian-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-02",
  "section": "usage",
  "title": "怎么用",
  "scene": "横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一台安静的电脑，屏幕角落一个很小的绿色闹钟在转，旁边没有弹窗；2 一个聊天气泡里写着“内存盘现在健康吗？”，旁边一张体检单上打着绿勾；3 一个沙漏旁边立着一块“先别打扫”的小木牌。卡片标题粗体，下面正文。三张卡片占满整屏高度，插画可以画大一些，不留大块空白。",
  "portrait": "竖版：标题；三张卡片上下排、满宽（插画在上、字在下）。",
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
     "align": "center",
     "size": "large",
     "text_ref": "怎么用"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/icons/画笔调色板.png",
      "_library/hires-icons/代码窗口.png"
     ],
     "text_ref": "1.平时不用管"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一台安静的电脑，屏幕角落一个很小的绿色闹钟在转，旁边没有弹窗；2 一个聊天气泡里写着“内存盘现在健康吗？”，旁边一张体检单上打着绿勾；3 一个沙漏旁边立着一块“先别打扫”的小木牌。卡片标题粗体，下面正文。三张卡片占满整屏高度，插画可以画大一些，不留大块空白。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "怎么用"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/icons/画笔调色板.png",
      "_library/hires-icons/代码窗口.png"
     ],
     "text_ref": "1.平时不用管"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；三张卡片上下排、满宽（插画在上、字在下）。",
   "portrait_required": true
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "红色警示",
   "source_phrase": "1. 平时不用管 \n登录时和之后每15分钟，后台跑一轮，不弹窗口：认准盘、补文件夹和盘根的《使用说明》、记下空间和内存，一轮几秒钟。9月18日15:00到28日22:20记了996轮结果：990轮正常，6轮只是内存偏紧的提醒。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "画笔调色板",
   "source_phrase": "2. 想知道好不好，问 AI \n“看看内存盘现在健康吗？”AI跑一次只读体检，不写任何文件。怎样才算“正常”，见“为什么这样设计”第4条。",
   "sha256": "e753d6f0c05218dbfce4f65f119025ccc453dd77a5da6fb2551f53410cfd3cce",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "3. 跑长任务前打个招呼 \n“我要跑几个小时的任务，先暂停内存盘自动重建，跑完再恢复。”暂停只停清空重建，文件夹维护和体检照常。也可以让用缓存的程序登记“我在用、用到几点”，登记有效期间不会被清盘。这两样做好了，还找不到真用过的记录。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/电脑后台闹钟.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电脑后台闹钟",
   "source_phrase": "三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一台安静的电脑，屏幕角落一个很小的绿色闹钟在转，旁边没有弹窗；2 一个聊天气泡里写着“内存盘现在健康吗？",
   "sha256": "c155d8a2bf784ad7b0218af0170e04d661735982253bcc04341949a31c9f9a4e",
   "status": "ready",
   "original_elements": [
    "一台安静的电脑，屏幕角落一个很小的绿色闹钟在转，旁边没有弹窗"
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
   "asset": "_library/icons/气泡.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "对话气泡",
   "source_phrase": "三张竖向大卡片横排，每张顶部一幅小水彩插画：1 一台安静的电脑，屏幕角落一个很小的绿色闹钟在转，旁边没有弹窗；2 一个聊天气泡里写着“内存盘现在健康吗？",
   "sha256": "4ffd11a1805d6fcd443e6d721ff92690ba8469f4bbdb231be34373895d4565ac",
   "status": "ready",
   "original_elements": [
    "一个聊天气泡里写着“内存盘现在健康吗？"
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
   "asset": "_library/illustrations/main-ramdisk-guardian.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "内存盘第三槽待定位",
   "source_phrase": "3 一个沙漏旁边立着一块“先别打扫”的小木牌。",
   "sha256": "b6bb5606ff04437a7a32a1afce04189883bab97d88301f4d299e9cc188f1f7d1",
   "status": "ready",
   "original_elements": [
    "三张卡片占满整屏高度，插画可以画大一些，不留大块空白"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\ramdisk-guardian\\img\\ramdisk-guardian-02-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9fe7ee9705091075f9a6",
   "title_text": "怎么用",
   "sha256": "c038ec3c038c442742b47f8ba4768302d518cc4ff2e1c7bab1e1aa7b318f70f6",
   "status": "ready",
   "source_box": [
    32,
    10,
    377,
    223
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 怎么用

**1. 平时不用管**
登录时和之后每 15 分钟，后台跑一轮，不弹窗口：认准盘、补文件夹和盘根的《使用说明》、记下空间和内存，一轮几秒钟。9 月 18 日 15:00 到 28 日 22:20 记了 996 轮结果：990 轮正常，6 轮只是内存偏紧的提醒。

**2. 想知道好不好，问 AI**
“看看内存盘现在健康吗？”AI 跑一次只读体检，不写任何文件。怎样才算“正常”，见“为什么这样设计”第 4 条。

**3. 跑长任务前打个招呼**
“我要跑几个小时的任务，先暂停内存盘自动重建，跑完再恢复。”暂停只停清空重建，文件夹维护和体检照常。也可以让用缓存的程序登记“我在用、用到几点”，登记有效期间不会被清盘。这两样做好了，还找不到真用过的记录。

::screen{#ramdisk-guardian-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-03",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（一个弹出的小消息框、一块虚线画的空盘位、一根被压扁的内存条、一个转回原位的循环箭头、一个搬家的纸箱、一个关掉的小开关），右边粗体一句加小字。",
  "portrait": "竖版：标题；六张卡片一行一张，左图标右字。",
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
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1弹出“RamDisk(Z:)ERROR”连续出错时只在第一轮弹一次，留60秒；普通提醒只记不弹。跟AI"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。六张横向圆角卡片排成两列三行，每张左边一个小水彩图标（一个弹出的小消息框、一块虚线画的空盘位、一根被压扁的内存条、一个转回原位的循环箭头、一个搬家的纸箱、一个关掉的小开关），右边粗体一句加小字。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1弹出“RamDisk(Z:)ERROR”连续出错时只在第一轮弹一次，留60秒；普通提醒只记不弹。跟AI"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；六张卡片一行一张，左图标右字。",
   "portrait_required": true
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
   "source_phrase": "一个弹出的小消息框",
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
   "source_phrase": "一块虚线画的空盘位",
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
   "source_phrase": "一根被压扁的内存条",
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
   "source_phrase": "一个转回原位的循环箭头",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个搬家的纸箱",
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
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "开关",
   "source_phrase": "一个关掉的小开关",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-ramdisk-guardian-03-v2.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "source_box": [
    37,
    98,
    634,
    325
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 出事怎么办

1. **弹出“RamDisk(Z:) ERROR”**｜连续出错时只在第一轮弹一次，留 60 秒；普通提醒只记不弹。跟 AI 说“内存盘报错了，看看”。最近一次是 9 月 2 日 00:05：那一刻读不到盘的名字（卷标 RAMDISK），15 分钟后下一轮就正常了。
2. **Z 盘不见了**｜守护开机后最多等 150 秒，还没有就报错、什么都不动。盘是 Primo 开机时自己建的，没建出来要去 Primo 里查。盘里只有缓存，不用找回任何东西。
3. **电脑内存很紧**｜只是可用内存跌到 5 GB 以下，守护只记提醒、不动盘：这时内存多半是别的程序吃的，要关掉那个程序才回得来。要同时看到像是这块盘卡着内存的增长，才会清空重建；清完腾不出 1 GB，6 小时内不再试（规则见“自动重建”那一屏）。
4. **重启以后**｜盘自己回来：Primo 开机时把上次存下的镜像装回；死机断电时来不及存，装回的是再上一次存的，少掉的缓存浏览器自己再生成。9 月 28 日 22:05 电脑意外关机，22:16 开机，22:18 守护第一轮就看到盘在、0.5 GiB 缓存也在。
5. **换电脑，或守护丢了**｜先在 Primo 里照原样建盘：Z、NTFS、12 GiB、卷标 RAMDISK、动态内存、开镜像。再跟 AI 说“先预览再恢复内存盘守护”：先出预览，确认才装；只恢复计划任务时不动电源设置和 Chrome。装完等下一次自然重启再核一遍。
6. **想停掉它**｜跟 AI 说“停掉内存盘维护”：只停以后的定时运行，不删盘、不删缓存、不卸 Primo。停了以后，盘掉了没人补文件夹，内存被卡住也没人腾。

::screen{#ramdisk-guardian-04 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题。上半部分一张从左到右的流程图：五个圆角节点，绿色箭头依次连起来，每个节点上面一个小水彩图标（一根变成硬盘的内存条、一个小闹钟、一个转圈的绿色循环、一张写着字的小卡片、一个聊天气泡和一个仪表盘），节点下面粗体名字加两三行小字。下半部分左右两张卡：左卡“看哪几样数”；右卡“提醒线”画成一张五行两列的小表格，表格下面一行小字“模型”。",
  "portrait": "竖版：标题；五个节点改成从上到下的竖流程（向下的绿箭头），每个节点左图标右字；然后“看哪几样数”卡、“提醒线”表格（一行一条）、“模型”一段，上下排、满宽。",
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
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "text_ref": "1PrimoRamdisk6.6.0建Z盘：12GiB是上限，“动态内存”模式按写进去的量占内存；关机时"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "看哪几样数盘的剩余空间；电脑可用内存；提交余量（Windows还能答应程序多少内存）；不可归属内存——总"
    },
    {
     "type": "table",
     "text_ref": "提醒线（只记不弹）"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。上半部分一张从左到右的流程图：五个圆角节点，绿色箭头依次连起来，每个节点上面一个小水彩图标（一根变成硬盘的内存条、一个小闹钟、一个转圈的绿色循环、一张写着字的小卡片、一个聊天气泡和一个仪表盘），节点下面粗体名字加两三行小字。下半部分左右两张卡：左卡“看哪几样数”；右卡“提醒线”画成一张五行两列的小表格，表格下面一行小字“模型”。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "1PrimoRamdisk6.6.0建Z盘：12GiB是上限，“动态内存”模式按写进去的量占内存；关机时"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "看哪几样数盘的剩余空间；电脑可用内存；提交余量（Windows还能答应程序多少内存）；不可归属内存——总"
    },
    {
     "type": "table",
     "text_ref": "提醒线（只记不弹）"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；五个节点改成从上到下的竖流程（向下的绿箭头），每个节点左图标右字；然后“看哪几样数”卡、“提醒线”表格（一行一条）、“模型”一段，上下排、满宽。",
   "portrait_required": true
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
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "外接硬盘",
   "source_phrase": "一根变成硬盘的内存条",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "时钟",
   "source_phrase": "一个小闹钟",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "一个转圈的绿色循环",
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
   "source_phrase": "一张写着字的小卡片",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一个聊天气泡和一个仪表盘",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\ramdisk-guardian\\img\\ramdisk-guardian-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "source_box": [
    24,
    2,
    571,
    199
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 它是怎么搭的

1. **Primo Ramdisk 6.6.0**　建 Z 盘：12 GiB 是上限，“动态内存”模式按写进去的量占内存；关机时把盘存成镜像（E:\RamdiskImage\Z.vdf，10 月 10 日是 0.7 GiB），开机装回
2. **计划任务**　登录时和每 15 分钟启动一次；一个小 VBScript 在后台起 PowerShell 7，不弹窗口；同一时间只跑一份，一轮最长 10 分钟。任务名还叫 RAMDisk_Code_Backup，是 6 月留下的旧名，早就不做备份
3. **守护一轮**　等盘 → 认准盘 → 补 12 个文件夹、盘根说明和隐藏的就绪标记 → 读空间和内存 → 需要时清空重建 → 写结果
4. **结果**　一份体检记录和一行状态，替换前留上一份；日志满 1 MB 换新文件
5. **读结果**　AI 用只读的体检入口；驾驶舱读计划任务的结果

**看哪几样数**　盘的剩余空间；电脑可用内存；提交余量（Windows 还能答应程序多少内存）；不可归属内存——总占用减掉各程序、内核和缓存之后剩下的差，用来猜驱动有没有卡着内存。它是估算，共享的内存会重复算，所以平时是负数（9 月 28 日 22:20 是 −6.1 GB）。

**提醒线**（只记不弹）
| 看什么 | 什么时候提醒 |
|---|---|
| 盘剩余 | 少于 2 GiB |
| 盘已用 | 超过 8 GiB（缓存的软上限） |
| 可用内存 | 少于 8 GB |
| 提交余量 | 少于 4 GB |
| 不可归属内存 | 达到 4 GB |

**模型**　运行时没有 AI 模型：守护、体检、部署都是 PowerShell 脚本。AI 只在我问起或收到报错时来读结果、动手修。

::screen{#ramdisk-guardian-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-05",
  "section": "tech",
  "title": "自动重建：动手前过四道关",
  "scene": "横版：左上标题。左边约 35% 宽一张“触发”卡片（画一根被压扁的内存条和一个指针偏红的小仪表）。中间约 40% 宽是自上而下的四道“关”：四扇依次排开的小木门，每扇门上一个编号圆牌，门旁粗体关名加一两行小字，门与门之间绿色箭头。右边约 25% 宽：上面“动手”卡片（一把扫帚扫出绿色光点，光点流回一根内存条），下面“出错”卡片（一个小红叉）。最下面一条横跨整屏的浅灰细卡片放最后一段说明。",
  "portrait": "竖版：标题；“触发”卡；四道关从上到下排，每道一张卡、中间向下箭头；“动手”卡；“出错”卡；最下面的说明卡。",
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
     "align": "center",
     "size": "large",
     "text_ref": "自动重建：动手前过四道关"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "触发盘里缓存不超过8GiB，同时有下面任何一种证据：",
     "row": "gates",
     "width": "35%"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "above_card",
     "row": "gates",
     "width": "40%",
     "text_ref": "第一关确认是持续的连续3次读数（每5秒一次，前后至少跨10秒）都这样才算；两次读数隔超过30秒就重新数。",
     "icons": [
      "_library/icons/秒表.png",
      "_library/hires-icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "row": "gates",
     "width": "25%",
     "text_ref": "动手用Primo的命令把这块盘清空重建→回读卷标→补文件夹、说明和就绪标记→把空盘存回镜像→再读一次内存"
    },
    {
     "type": "notice",
     "text_ref": "前三关是9月18日加的，第四关的“按盘号认准”是9月8日加的；这以后还没遇到过要重建的时候，所以在全部功"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。左边约 35% 宽一张“触发”卡片（画一根被压扁的内存条和一个指针偏红的小仪表）。中间约 40% 宽是自上而下的四道“关”：四扇依次排开的小木门，每扇门上一个编号圆牌，门旁粗体关名加一两行小字，门与门之间绿色箭头。右边约 25% 宽：上面“动手”卡片（一把扫帚扫出绿色光点，光点流回一根内存条），下面“出错”卡片（一个小红叉）。最下面一条横跨整屏的浅灰细卡片放最后一段说明。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "自动重建：动手前过四道关"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "触发盘里缓存不超过8GiB，同时有下面任何一种证据："
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "第一关确认是持续的连续3次读数（每5秒一次，前后至少跨10秒）都这样才算；两次读数隔超过30秒就重新数。",
     "icons": [
      "_library/icons/秒表.png",
      "_library/hires-icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "text_ref": "动手用Primo的命令把这块盘清空重建→回读卷标→补文件夹、说明和就绪标记→把空盘存回镜像→再读一次内存"
    },
    {
     "type": "notice",
     "text_ref": "前三关是9月18日加的，第四关的“按盘号认准”是9月8日加的；这以后还没遇到过要重建的时候，所以在全部功"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；“触发”卡；四道关从上到下排，每道一张卡、中间向下箭头；“动手”卡；“出错”卡；最下面的说明卡。",
   "portrait_required": true
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
   "source_phrase": "不可归属内存达到 8 GB（像是驱动卡着内存）；",
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
   "source_phrase": "相关增长达到 8 GB：和过去 24 小时的基线比，不可归属内存涨了多少、可用内存跌了多少，取小的那个。两边都得动才算：程序正常吃内存只让可用内存变少，不会让不可归属变多；",
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
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "柱状图",
   "source_phrase": "可用内存低于 5 GB，而且相关增长至少 4 GB。",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-5fde2369cff7293123bf.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\ramdisk-guardian\\img\\ramdisk-guardian-05-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-5fde2369cff7293123bf",
   "title_text": "自动重建：动手前过四道关",
   "sha256": "a0494170e71a02031e1a9c58050d4d4a10dc82ab1696d8f2befbe295b5732a79",
   "status": "ready",
   "source_box": [
    28,
    21,
    660,
    114
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 自动重建：动手前过四道关

**触发**　盘里缓存不超过 8 GiB，同时有下面任何一种证据：
- 不可归属内存达到 8 GB（像是驱动卡着内存）；
- 相关增长达到 8 GB：和过去 24 小时的基线比，不可归属内存涨了多少、可用内存跌了多少，取小的那个。两边都得动才算：程序正常吃内存只让可用内存变少，不会让不可归属变多；
- 可用内存低于 5 GB，而且相关增长至少 4 GB。
后两种要隔 5 分钟以上再看到一次（一般就是下一轮）。只是可用内存低、看不到相关增长，就只记提醒、不动盘。基线要至少 3 次读数、跨 30 分钟才建得起来，重启后重新建。
盘里缓存超过 8 GiB 时不自动清，只提醒：缓存多到这个量，内存是真内容占着、不是驱动卡着，清掉只会毁掉正在用的缓存。

**第一关 确认是持续的**　连续 3 次读数（每 5 秒一次，前后至少跨 10 秒）都这样才算；两次读数隔超过 30 秒就重新数。
**第二关 没人在用**　没被暂停；没有程序登记“我在用”；登记记录读不懂，也当有人在用。
**第三关 别太勤**　离上次动手至少 1 小时；上次腾出不到 1 GB，6 小时内不再试。
**第四关 认准再动手**　动手前再核一次：Primo 里的盘号、卷的身份、暂停和登记都没变。

**动手**　用 Primo 的命令把这块盘清空重建 → 回读卷标 → 补文件夹、说明和就绪标记 → 把空盘存回镜像 → 再读一次内存。可用内存多了 1 GB 以上，或不可归属内存少了 1 GB 以上，才算“有效”。
**出错**　任何一步失败就报错（弹一次消息），1 小时内不再试。

前三关是 9 月 18 日加的，第四关的“按盘号认准”是 9 月 8 日加的；这以后还没遇到过要重建的时候，所以在全部功能里标“待验收”。之前 38 次重建是旧规则做的：一轮读数紧就动手，而且固定清 0 号盘。
触发证据是 9 月 29 日改的：拿 38 次旧记录回放，3 次不可归属达到 8 GB 的仍会触发，35 次只是内存低的不再触发。新版已在跑，03:31 那轮正常、基线已建好，但还没真重建过一次，也标“待验收”。

::screen{#ramdisk-guardian-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一片可以随风飘走的落叶、一个装到刻度线的量杯、一个静音的小铃铛、一张盖着新鲜日期章的体检单、一把被划掉的秒表、一个往回的箭头），每张粗体一句加两三行小字；右边约三分之一宽，竖着三张大数字卡。",
  "portrait": "竖版：标题；六张卡片一行一张；三张数字卡放最下面，一行一张。",
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
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/fix-round-2/icon-clean-7079fea533a5aaa393b7.png",
      "_library/icons/铃铛.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/秒表.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "last_row_fill": true,
     "text_ref": "1只放丢得起的东西。死机断电、盘突然不见时，上次存盘以后写的内容会没，这是内存盘的本性；6月还吃过一次亏"
    },
    {
     "type": "stat_card",
     "columns": 3,
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "864行程序：PowerShell7，含10行VBScript启动器124项测试：9组794行，用假的P"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行（小水彩图标：一片可以随风飘走的落叶、一个装到刻度线的量杯、一个静音的小铃铛、一张盖着新鲜日期章的体检单、一把被划掉的秒表、一个往回的箭头），每张粗体一句加两三行小字；右边约三分之一宽，竖着三张大数字卡。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/fix-round-2/icon-clean-7079fea533a5aaa393b7.png",
      "_library/icons/铃铛.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/秒表.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "last_row_fill": true,
     "text_ref": "1只放丢得起的东西。死机断电、盘突然不见时，上次存盘以后写的内容会没，这是内存盘的本性；6月还吃过一次亏"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "864行程序：PowerShell7，含10行VBScript启动器124项测试：9组794行，用假的P"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；六张卡片一行一张；三张数字卡放最下面，一行一张。",
   "portrait_required": true
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
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿叶装饰",
   "source_phrase": "一片可以随风飘走的落叶",
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
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹",
   "source_phrase": "124 项 测试：9 组 794 行，用假的 Primo、假的内存读数和临时文件夹，不碰真盘；9 月 29 日重跑全部通过",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "35 次 提交（6 月 15 日至 9 月 29 日）",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\ramdisk-guardian\\img\\ramdisk-guardian-06-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "source_box": [
    37,
    99,
    905,
    317
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 为什么这样设计

1. **只放丢得起的东西。**｜死机断电、盘突然不见时，上次存盘以后写的内容会没，这是内存盘的本性；6 月还吃过一次亏（见亮点 1）。所以守护一样东西都不备份，盘没了只补文件夹。
2. **容量就是内存预算。**｜12 GiB 是盘的容量上限，用来管住预算；驱动实际占多少内存，现在读不到。缓存超过 8 GiB 就提醒。谁来清？7 月 25 日定下：每种缓存由写它的程序自己清，守护不整盘定时清空，也不删不认识的东西。
3. **普通提醒不打扰。**｜8 月 13 日以前，内存偏紧这类提醒也弹窗，两个月弹了 81 次。现在只有刚变成出错才弹一次。
4. **“正常”要有新鲜证据。**｜体检不认“任务在跑”：最近一轮结果要在 33 分钟内（两个周期再加 3 分钟），而且写结果的程序和仓库里现在这版是同一份（比对文件指纹）；改了程序还没跑过新一轮，就不算正常。
5. **不写快了多少。**｜没做过真实任务的计时对比，驱动实际占多少内存 Primo 也不给读数；“划不划算”只报量得到的数，不猜提速。规矩是先测真实慢任务的总耗时，有可重复的提速才往里加新缓存。
6. **改东西都能退回。**｜部署默认只出预览；真装时把原来的任务、盘符设置、电源设置记下，Chrome 旧文件夹只改名不删，失败按相反顺序退回。

**864 行**｜程序：PowerShell 7，含 10 行 VBScript 启动器
**124 项**｜测试：9 组 794 行，用假的 Primo、假的内存读数和临时文件夹，不碰真盘；10 月 10 日重跑全部通过
**37 次**｜提交（6 月 15 日至 10 月 6 日）

::screen{#ramdisk-guardian-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：和照片视频录音管理页的“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一个空文件夹被一条绿色箭头照搬到另一个文件夹，第二个文件夹里的纸一张张飞走，旁边一块写着“只放落叶”的小木牌（盘里只剩几片落叶）；2 一根内存条上压着一块大石头，一把扫帚把石头扫走，底下冒出一串绿色光点流回主板；3 一只鼓鼓的大行李箱旁边站着一只小巧的背包，背包上挂着一个绿色对勾。",
  "portrait": "竖版：标题；三张大卡片上下排、满宽（插画在上、字在下）。",
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
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/画笔调色板.png",
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/代码窗口.png"
     ],
     "text_ref": "吃过一次亏，从此只放丢得起的。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：和照片视频录音管理页的“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 一个空文件夹被一条绿色箭头照搬到另一个文件夹，第二个文件夹里的纸一张张飞走，旁边一块写着“只放落叶”的小木牌（盘里只剩几片落叶）；2 一根内存条上压着一块大石头，一把扫帚把石头扫走，底下冒出一串绿色光点流回主板；3 一只鼓鼓的大行李箱旁边站着一只小巧的背包，背包上挂着一个绿色对勾。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/画笔调色板.png",
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/代码窗口.png"
     ],
     "text_ref": "吃过一次亏，从此只放丢得起的。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；三张大卡片上下排、满宽（插画在上、字在下）。",
   "portrait_required": true
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
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "画笔调色板",
   "source_phrase": "吃过一次亏，从此只放丢得起的。 \n7月21日以前，Z盘也放项目和文档，每15分钟用“照搬式同步”备份到E盘——源头少了什么，备份也跟着删什么。6月中旬以前有一次盘突然不见，重新出来时项目文件夹是空的，照搬式同步就把E上的备份也删空了，这些文件在本机再没有别的副本。6月15日先改成只增不减，7月21日干脆不让Z盘放任何正式文件，三条备份通道全部退役。现在守护一样东西都不备份：盘没了只补文件夹，浏览器自己再生成缓存。",
   "sha256": "e753d6f0c05218dbfce4f65f119025ccc453dd77a5da6fb2551f53410cfd3cce",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "删了文件不还内存，就帮它清零。 \nPrimo的动态内存按写入量占内存，删文件时却不一定还：7月23日盘里只剩约1GiB，驱动还锁着约31GB。当天把容量从32GiB收到12GiB，并让守护盯着不可归属内存，像是驱动卡住、盘里缓存又不多时清空重建。7月29日、8月14日、8月20日凌晨三次，可用内存从16.2、12.3、9.4GB升到45.8、39.3、32.7GB（和15分钟前那一轮比）。\n也有白做的：8月20日下午和9月7日那35次，内存是别的程序吃的，重建后不见好。9月18日因此加了“腾不出就6小时不再试”；9月29日又把触发改成要看到相关增长（见“自动重建”那一屏，待验收）。",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "镜像从 12 GiB 瘦到 0.55 GiB。 \n9月18日查到，盘里真实内容只有0.5GiB，镜像文件却有12GiB：驱动的整张占用表跟着镜像来回存。用Primo官方命令另存一份紧凑镜像，核对SHA-256后替换，旧镜像先留作退路，缩小95.4%。9月25日16:14正常重启，这份小镜像照常存盘、开机装回；9月27、28日两次意外关机后，盘也从这份镜像回来了。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "插画：1 一个空文件夹被一条绿色箭头照搬到另一个文件夹，第二个文件夹里的纸一张张飞走，旁边一块写着“只放落叶”的小木牌（盘里只剩几片落叶）；2 一根内存条上压着一块大石头，一把扫帚把石头扫走，底下冒出一串绿色光点流回主板；3 一只鼓鼓的大行李箱旁边站着一只小巧的背包，背包上挂着一个绿色对勾。",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready",
   "original_elements": [
    "一个空文件夹被一条绿色箭头照搬到另一个文件夹，第二个文件夹里的纸一张张飞走，旁边一块画抽象短线的的小木牌（盘里只剩几片落叶"
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
   "asset": "_library/illustrations/main-ramdisk-guardian.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "内存条",
   "source_phrase": "插画：1 一个空文件夹被一条绿色箭头照搬到另一个文件夹，第二个文件夹里的纸一张张飞走，旁边一块写着“只放落叶”的小木牌（盘里只剩几片落叶）；2 一根内存条上压着一块大石头，一把扫帚把石头扫走，底下冒出一串绿色光点流回主板；3 一只鼓鼓的大行李箱旁边站着一只小巧的背包，背包上挂着一个绿色对勾。",
   "sha256": "b6bb5606ff04437a7a32a1afce04189883bab97d88301f4d299e9cc188f1f7d1",
   "status": "ready",
   "original_elements": [
    "一根内存条上压着一块大石头，一把扫帚把石头扫走，底下冒出一串绿色光点流回主板"
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
   "asset": "_library/illustrations/ill-ac9023a08928a4.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-ac9023a08928a4",
   "source_phrase": "插画：1 一个空文件夹被一条绿色箭头照搬到另一个文件夹，第二个文件夹里的纸一张张飞走，旁边一块写着“只放落叶”的小木牌（盘里只剩几片落叶）；2 一根内存条上压着一块大石头，一把扫帚把石头扫走，底下冒出一串绿色光点流回主板；3 一只鼓鼓的大行李箱旁边站着一只小巧的背包，背包上挂着一个绿色对勾。",
   "sha256": "c1d83b11554053e533bdcdea4db6d0205bae0f752f9e08efa28dc56a422c99b8",
   "status": "ready",
   "original_elements": [
    "一只鼓鼓的大行李箱旁边站着一只小巧的背包，背包上挂着一个绿色对勾"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b2-r12\\state\\b1-ramdisk-guardian-07-h\\round-01\\candidate-1.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    46,
    0,
    312,
    199
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 亮点

**吃过一次亏，从此只放丢得起的。**
7 月 21 日以前，Z 盘也放项目和文档，每 15 分钟用“照搬式同步”备份到 E 盘——源头少了什么，备份也跟着删什么。6 月中旬以前有一次盘突然不见，重新出来时项目文件夹是空的，照搬式同步就把 E 上的备份也删空了，这些文件在本机再没有别的副本。6 月 15 日先改成只增不减，7 月 21 日干脆不让 Z 盘放任何正式文件，三条备份通道全部退役。现在守护一样东西都不备份：盘没了只补文件夹，浏览器自己再生成缓存。

**删了文件不还内存，就帮它清零。**
Primo 的动态内存按写入量占内存，删文件时却不一定还：7 月 23 日盘里只剩约 1 GiB，驱动还锁着约 31 GB。当天把容量从 32 GiB 收到 12 GiB，并让守护盯着不可归属内存，像是驱动卡住、盘里缓存又不多时清空重建。7 月 29 日、8 月 14 日、8 月 20 日凌晨三次，可用内存从 16.2、12.3、9.4 GB 升到 45.8、39.3、32.7 GB（和 15 分钟前那一轮比）。
也有白做的：8 月 20 日下午和 9 月 7 日那 35 次，内存是别的程序吃的，重建后不见好。9 月 18 日因此加了“腾不出就 6 小时不再试”；9 月 29 日又把触发改成要看到相关增长（见“自动重建”那一屏，待验收）。

**镜像从 12 GiB 瘦到 0.55 GiB。**
9 月 18 日查到，盘里真实内容只有 0.5 GiB，镜像文件却有 12 GiB：驱动的整张占用表跟着镜像来回存。用 Primo 官方命令另存一份紧凑镜像，核对 SHA-256 后替换，旧镜像先留作退路，缩小 95.4%。9 月 25 日 16:14 正常重启，这份小镜像照常存盘、开机装回；9 月 27、28 日两次意外关机后，盘也从这份镜像回来了。

::screen{#ramdisk-guardian-08 section="features"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-08",
  "section": "features",
  "title": "全部功能（1）",
  "scene": "横版：和电脑配置与恢复页“全部功能”同样的画法：组名不单独占一整列——每组先画一条横跨整屏的组名横条（左边一个小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态小圆点。每行末尾〈…〉里是状态，不画成字，画成圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题和图例，接着往下排。这是第一张：顶上画大标题和一行图例（六个圆点加文字）。",
  "portrait": "竖版：标题和图例在最上面（图例排成两行三个）；每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排。",
  "links": [],
  "anchors": [
   {
    "id": "g-upkeep",
    "text": "每 15 分钟的照看"
   },
   {
    "id": "f-patrol",
    "text": "定时巡查"
   },
   {
    "id": "f-identity",
    "text": "认准这块盘"
   },
   {
    "id": "f-skeleton",
    "text": "补齐文件夹和说明"
   },
   {
    "id": "f-watch",
    "text": "空间和内存盯梢"
   },
   {
    "id": "f-alert",
    "text": "出错弹一次"
   },
   {
    "id": "g-release",
    "text": "自动腾内存"
   },
   {
    "id": "f-auto-release",
    "text": "自动清空重建"
   },
   {
    "id": "f-growth-evidence",
    "text": "看增长才动手"
   },
   {
    "id": "f-confirm",
    "text": "连续三次才算"
   },
   {
    "id": "f-cooldown",
    "text": "腾不出就停手"
   },
   {
    "id": "f-recheck",
    "text": "动手前再核一遍"
   },
   {
    "id": "f-pause",
    "text": "暂停自动重建"
   },
   {
    "id": "f-lease",
    "text": "长任务登记"
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
     "text_ref": "全部功能（22项）"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "每15分钟的照看"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "自动腾内存"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：和电脑配置与恢复页“全部功能”同样的画法：组名不单独占一整列——每组先画一条横跨整屏的组名横条（左边一个小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态小圆点。每行末尾〈…〉里是状态，不画成字，画成圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题和图例，接着往下排。这是第一张：顶上画大标题和一行图例（六个圆点加文字）。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（22项）"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "每15分钟的照看"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "自动腾内存"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题和图例在最上面（图例排成两行三个）；每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排。",
   "portrait_required": true
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "每 15 分钟的照看",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "定时巡查　登录时和之后每 15 分钟在后台跑一轮，不弹窗口；盘没出来最多等 150 秒；同一时间只跑一份，一轮最长 10 分钟　〈在用〉",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
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
   "source_phrase": "认准这块盘　卷标必须是 RAMDISK，Primo 里正好一块盘对应 Z；对不上就报错，什么都不动　〈在用〉",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "补齐文件夹和说明　补 12 个缓存和草稿文件夹、盘根《使用说明》（和仓库里的比对指纹，不一样就重抄）、隐藏的就绪标记　〈在用〉",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "空间和内存盯梢　五条提醒线：盘剩余少于 2 GiB、已用超过 8 GiB、可用内存少于 8 GB、提交余量少于 4 GB、不可归属内存达到 4 GB；只记不弹　〈在用〉",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "出错弹一次　连续出错时只在第一轮弹一次 Windows 消息（留 60 秒）并记下。弹过 2 次：7 月 23 日改容量时、9 月 2 日读不到盘的名字时　〈在用〉",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "自动腾内存",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "自动清空重建　盘里缓存不超过 8 GiB、又有证据像是这块盘卡着内存时，用 Primo 命令清空重建、把空盘存回镜像。共 38 次（都按 9 月 29 日以前的旧条件），前 3 次各腾出 23–30 GB　〈在用〉",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "看增长才动手　只是可用内存低不再动手：要不可归属内存达到 8 GB，或和 24 小时基线比的相关增长达到 8 GB（可用内存低于 5 GB 时 4 GB 就够）；相关增长要隔 5 分钟以上再看到一次。9 月 29 日上线，还没触发过　〈待验收〉",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "连续三次才算　连续 3 次读数（每 5 秒一次，前后至少跨 10 秒）都紧才算；两次读数隔超过 30 秒就重新数　〈待验收〉",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "腾不出就停手　离上次动手至少 1 小时；失败就报错、1 小时内不试；腾出不到 1 GB 就 6 小时内不再试　〈待验收〉",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "动手前再核一遍　重建前再核 Primo 盘号、卷的身份、暂停和登记；重建后回读卷标，补文件夹和说明，Primo 命令失败就报错　〈待验收〉",
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
   "asset": "_library/titles/title-e67ab5d2470d34ef96db.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e67ab5d2470d34ef96db",
   "title_text": "全部功能（22 项）",
   "sha256": "1720c2382378d1781e249db2405b7cccc63a1115b6460a78c726709cec7ce2a9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（22 项）
● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**每 15 分钟的照看**
1. **定时巡查**　登录时和之后每 15 分钟在后台跑一轮，不弹窗口；盘没出来最多等 150 秒；同一时间只跑一份，一轮最长 10 分钟　〈在用〉
2. **认准这块盘**　卷标必须是 RAMDISK，Primo 里正好一块盘对应 Z；对不上就报错，什么都不动　〈在用〉
3. **补齐文件夹和说明**　补 12 个缓存和草稿文件夹、盘根《使用说明》（和仓库里的比对指纹，不一样就重抄）、隐藏的就绪标记　〈在用〉
4. **空间和内存盯梢**　五条提醒线：盘剩余少于 2 GiB、已用超过 8 GiB、可用内存少于 8 GB、提交余量少于 4 GB、不可归属内存达到 4 GB；只记不弹　〈在用〉
5. **出错弹一次**　连续出错时只在第一轮弹一次 Windows 消息（留 60 秒）并记下。弹过 2 次：7 月 23 日改容量时、9 月 2 日读不到盘的名字时　〈在用〉

**自动腾内存**
6. **自动清空重建**　盘里缓存不超过 8 GiB、又有证据像是这块盘卡着内存时，用 Primo 命令清空重建、把空盘存回镜像。共 38 次（都按 9 月 29 日以前的旧条件），前 3 次各腾出 23–30 GB　〈在用〉
7. **看增长才动手**　只是可用内存低不再动手：要不可归属内存达到 8 GB，或和 24 小时基线比的相关增长达到 8 GB（可用内存低于 5 GB 时 4 GB 就够）；相关增长要隔 5 分钟以上再看到一次。9 月 29 日上线，还没触发过　〈待验收〉
8. **连续三次才算**　连续 3 次读数（每 5 秒一次，前后至少跨 10 秒）都紧才算；两次读数隔超过 30 秒就重新数　〈待验收〉
9. **腾不出就停手**　离上次动手至少 1 小时；失败就报错、1 小时内不试；腾出不到 1 GB 就 6 小时内不再试　〈待验收〉
10. **动手前再核一遍**　重建前再核 Primo 盘号、卷的身份、暂停和登记；重建后回读卷标，补文件夹和说明，Primo 命令失败就报错　〈待验收〉
11. **暂停自动重建**　只停“清空重建”，文件夹维护和体检照常；恢复时不清冷却　〈没用过〉
12. **长任务登记**　用缓存的程序登记进程号和用到几点（30 秒到 24 小时），登记有效期间不重建；进程没了或到期自动作废　〈说不准〉

::screen{#ramdisk-guardian-09 section="features"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-09",
  "section": "features",
  "title": "全部功能（2）",
  "scene": "横版：和电脑配置与恢复页“全部功能”同样的画法：组名不单独占一整列——每组先画一条横跨整屏的组名横条（左边一个小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态小圆点。每行末尾〈…〉里是状态，不画成字，画成圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题和图例，接着往下排。这是第二张：没有大标题和图例，接着上一张往下排。",
  "portrait": "竖版：标题和图例在最上面（图例排成两行三个）；每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排。",
  "links": [],
  "anchors": [
   {
    "id": "g-tools",
    "text": "查询、部署和维护"
   },
   {
    "id": "f-health",
    "text": "健康体检"
   },
   {
    "id": "f-efficiency",
    "text": "划不划算"
   },
   {
    "id": "f-deploy",
    "text": "部署和恢复"
   },
   {
    "id": "f-chrome",
    "text": "Chrome 缓存接进来"
   },
   {
    "id": "f-fast-startup",
    "text": "关掉快速启动"
   },
   {
    "id": "f-custom",
    "text": "换盘符和间隔"
   },
   {
    "id": "f-image-compact",
    "text": "镜像瘦身"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-r-backup",
    "text": "正式文件备份通道"
   },
   {
    "id": "f-r-warn-popup",
    "text": "提醒也弹窗"
   },
   {
    "id": "f-r-window",
    "text": "开始菜单维护小窗"
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
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "查询、部署和维护"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "已停用"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：和电脑配置与恢复页“全部功能”同样的画法：组名不单独占一整列——每组先画一条横跨整屏的组名横条（左边一个小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态小圆点。每行末尾〈…〉里是状态，不画成字，画成圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。两张图上下拼成一整段：同一个网格，第一张顶上有标题和图例，第二张没有标题和图例，接着往下排。这是第二张：没有大标题和图例，接着上一张往下排。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "查询、部署和维护"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "last_row_fill": true,
     "text_ref": "已停用"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题和图例在最上面（图例排成两行三个）；每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排。",
   "portrait_required": true
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
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "齿轮",
   "source_phrase": "查询、部署和维护",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
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
   "source_phrase": "健康体检　只读、不写任何文件：查盘、文件夹、说明、计划任务和最近一轮结果（怎样算正常见“为什么这样设计”第 4 条）　〈在用〉",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "划不划算　只报量得到的：容量、已用、电脑内存；管理员加一项可读 Primo 的内存模式和镜像实际大小。不猜提速，驱动实际占多少读不到　〈说不准〉",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "部署和恢复　默认只出预览；确认后装计划任务、核对盘，失败按相反顺序退回；可以只恢复任务、不动别的　〈在用〉",
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
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "Chrome 缓存接进来　把 Chrome 的网页缓存、代码缓存、显卡缓存三个文件夹连到 Z；Chrome 开着就先不动；旧文件夹改名留着，不删　〈在用〉",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
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
   "source_phrase": "关掉快速启动　Windows 的快速启动会打断 Primo 关机存盘、开机建盘；6 月 15 日关掉后一直关着　〈在用〉",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "换盘符和间隔　盘不叫 Z 时可以换盘符；巡查间隔可调 1 分钟到 1 天　〈没用过〉",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "镜像瘦身　镜像比盘里内容大很多时，用 Primo 官方命令另存成紧凑镜像，核对后替换，旧的留作退路。9 月 18 日做过一次：12 GiB 缩到 0.55 GiB　〈在用〉",
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
   "source_phrase": "已停用",
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
   "source_phrase": "正式文件备份通道　Z 上放项目、文档和其他文件，每 15 分钟备份到 E 盘、掉盘后自动还原。7 月 21 日退役，Z 只放缓存　〈已停用〉",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  }
 ]
}
```

**查询、部署和维护**
13. **健康体检**　只读、不写任何文件：查盘、文件夹、说明、计划任务和最近一轮结果（怎样算正常见“为什么这样设计”第 4 条）　〈在用〉
14. **划不划算**　只报量得到的：容量、已用、电脑内存；管理员加一项可读 Primo 的内存模式和镜像实际大小。不猜提速，驱动实际占多少读不到　〈说不准〉
15. **部署和恢复**　默认只出预览；确认后装计划任务、核对盘，失败按相反顺序退回；可以只恢复任务、不动别的　〈在用〉
16. **Chrome 缓存接进来**　把 Chrome 的网页缓存、代码缓存、显卡缓存三个文件夹连到 Z；Chrome 开着就先不动；旧文件夹改名留着，不删　〈在用〉
17. **关掉快速启动**　Windows 的快速启动会打断 Primo 关机存盘、开机建盘；6 月 15 日关掉后一直关着　〈在用〉
18. **换盘符和间隔**　盘不叫 Z 时可以换盘符；巡查间隔可调 1 分钟到 1 天　〈没用过〉
19. **镜像瘦身**　镜像比盘里内容大很多时，用 Primo 官方命令另存成紧凑镜像，核对后替换，旧的留作退路。9 月 18 日做过一次：12 GiB 缩到 0.55 GiB　〈在用〉

**已停用**
20. **正式文件备份通道**　Z 上放项目、文档和其他文件，每 15 分钟备份到 E 盘、掉盘后自动还原。7 月 21 日退役，Z 只放缓存　〈已停用〉
21. **提醒也弹窗**　内存偏紧这类普通提醒也弹窗，6 月 15 日到 8 月 13 日弹过 81 次；之后只记不弹　〈已停用〉
22. **开始菜单维护小窗**　开始菜单里的“RAMDisk 与远程串流维护”，能看状态、暂停重建、停守护；9 月 26 日按我的决定撤掉，改在网站看　〈已停用〉

::screen{#ramdisk-guardian-10 section="history"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：左边约 62% 宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一行字。右边约 36% 宽：上面一个带 1px 浅灰细边框、圆角 8px 的空白截图位，宽约屏宽 34%、高宽比 4:3（拼页时原样贴真实截图，框里什么都不画），截图位下面一行灰色小字图注；截图位下面一幅小插画：一根内存条从一块大硬盘的样子慢慢缩成一块小巧的盘，旁边一个园丁在扫落叶。",
  "portrait": "竖版：标题；一条竖向时间线从上到下排全部节点；然后是满宽的截图位（带细边框，高宽比 4:3），图注在下；小插画放最下面。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/cf3fb7ab9f792deb6b5da34af8959d8d913d6413bc61335b60eeb9e084472c6f.png",
    "where": "右边约 36% 宽的上方，带 1px 浅灰细边框、圆角 8px、高宽比 4:3 的空位",
    "caption": "6 月 14 日的 Primo 界面截图：当时这块盘还是 20 GB，红绿标注是当时写给自己看的",
    "crop_v": [
     0,
     0,
     880,
     486
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
     "align": "center",
     "size": "large",
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "text_ref": "6月15日建起来：Primo开机建盘、关机存镜像，守护每15分钟把盘上的项目和文档备份到E；查出盘老是不"
    },
    {
     "type": "screenshot",
     "ratio": "4:3",
     "indices": [
      0
     ],
     "row": "lone-shot-2",
     "width": "55%"
    },
    {
     "type": "prose",
     "text_ref": "6月14日的Primo界面截图：当时这块盘还是20GB，红绿标注是当时写给自己看的",
     "row": "lone-shot-2",
     "width": "45%"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "lone-shot-2"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版：左边约 62% 宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一行字。右边约 36% 宽：上面一个带 1px 浅灰细边框、圆角 8px 的空白截图位，宽约屏宽 34%、高宽比 4:3（拼页时原样贴真实截图，框里什么都不画），截图位下面一行灰色小字图注；截图位下面一幅小插画：一根内存条从一块大硬盘的样子慢慢缩成一块小巧的盘，旁边一个园丁在扫落叶。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "text_ref": "6月15日建起来：Primo开机建盘、关机存镜像，守护每15分钟把盘上的项目和文档备份到E；查出盘老是不"
    },
    {
     "type": "screenshot",
     "ratio": "4:3",
     "indices": [
      0
     ],
     "max_width": "100%"
    },
    {
     "type": "prose",
     "text_ref": "6月14日的Primo界面截图：当时这块盘还是20GB，红绿标注是当时写给自己看的"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "size": "small",
     "align": "center"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；一条竖向时间线从上到下排全部节点；然后是满宽的截图位（带细边框，高宽比 4:3），图注在下；小插画放最下面。",
   "portrait_required": true
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
   "source_phrase": "6 月 15 日　建起来：Primo 开机建盘、关机存镜像，守护每 15 分钟把盘上的项目和文档备份到 E；查出盘老是不见是快速启动惹的，关掉；照搬式同步删空过备份，改成只增不减",
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
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "6 月 16 日　Chrome 的代码缓存、显卡缓存搬进 Z；镜像从 C 盘挪到 E 盘",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
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
   "source_phrase": "6 月 28 日　读空间偶尔失败会误弹窗，改成重试 3 次",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "7 月 21 日　Z 只放缓存，三条备份通道退役",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "7 月 23 日　32 GiB 收到 12 GiB；盯不可归属内存，卡住就清空重建",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "7 月 25 日　缓存由写它的程序自己清，守护不整盘定时清",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "7 月 29 日—8 月 20 日　三次重建各腾出 23–30 GB",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "8 月 13 日　普通提醒不再弹窗",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "8 月 31 日　动盘前先核对卷的身份",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "9 月 7 日　一天白重建 33 次；第二天改成按 Primo 里的真实盘号动手，命令失败要报错",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "9 月 18 日　动手前四道关、暂停和登记、带退路的部署、新鲜的体检；划不划算的检查；镜像瘦身 95.4%",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
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
   "source_phrase": "9 月 25 日　正常重启，瘦身后的镜像照常存盘、装回",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 26 日　开始菜单的维护小窗撤掉，改在网站看；说明改成人话",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "9 月 29 日　触发改成要看到相关增长，单是可用内存低不再重建；拿 38 次旧记录回放核对",
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
   "asset": "_library/illustrations/main-ramdisk-guardian.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-ramdisk-guardian",
   "source_phrase": "右边约 36% 宽：上面一个带 1px 浅灰细边框、圆角 8px 的空白截图位，宽约屏宽 34%、高宽比 4:3（拼页时原样贴真实截图，框里什么都不画），截图位下面一行灰色小字图注；截图位下面一幅小插画：一根内存条从一块大硬盘的样子慢慢缩成一块小巧的盘，旁边一个园丁在扫落叶。",
   "sha256": "b6bb5606ff04437a7a32a1afce04189883bab97d88301f4d299e9cc188f1f7d1",
   "status": "ready",
   "original_elements": [
    "一根内存条从一块大硬盘的样子慢慢缩成一块小巧的盘，旁边一个园丁在扫落叶"
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
   "asset": "_library/round3/titles/title-r3-f8367a4ec7c3aa408a9e.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\ramdisk-guardian\\img\\ramdisk-guardian-10-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "source_box": [
    179,
    37,
    306,
    131
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 演进

- **6 月 15 日**　建起来：Primo 开机建盘、关机存镜像，守护每 15 分钟把盘上的项目和文档备份到 E；查出盘老是不见是快速启动惹的，关掉；照搬式同步删空过备份，改成只增不减
- **6 月 16 日**　Chrome 的代码缓存、显卡缓存搬进 Z；镜像从 C 盘挪到 E 盘
- **6 月 28 日**　读空间偶尔失败会误弹窗，改成重试 3 次
- **7 月 21 日**　Z 只放缓存，三条备份通道退役
- **7 月 23 日**　32 GiB 收到 12 GiB；盯不可归属内存，卡住就清空重建
- **7 月 25 日**　缓存由写它的程序自己清，守护不整盘定时清
- **7 月 29 日—8 月 20 日**　三次重建各腾出 23–30 GB
- **8 月 13 日**　普通提醒不再弹窗
- **8 月 31 日**　动盘前先核对卷的身份
- **9 月 7 日**　一天白重建 33 次；第二天改成按 Primo 里的真实盘号动手，命令失败要报错
- **9 月 18 日**　动手前四道关、暂停和登记、带退路的部署、新鲜的体检；划不划算的检查；镜像瘦身 95.4%
- **9 月 25 日**　正常重启，瘦身后的镜像照常存盘、装回
- **9 月 26 日**　开始菜单的维护小窗撤掉，改在网站看；说明改成人话
- **9 月 29 日**　触发改成要看到相关增长，单是可用内存低不再重建；拿 38 次旧记录回放核对

6 月 14 日的 Primo 界面截图：当时这块盘还是 20 GB，红绿标注是当时写给自己看的
