---
{
 "title": "开发配置备份",
 "kind": "project",
 "url": "/projects/devconfig-backup/",
 "tagline": "开发配置和微信原件每天备份，电脑坏了能取回。",
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
  "page": "devconfig-backup",
  "kind": "project",
  "title": "开发配置备份",
  "url": "/projects/devconfig-backup/",
  "tagline": "开发配置和微信原件每天备份，电脑坏了能取回。",
  "status": "常用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/devconfig-backup",
  "capability": "管好这台电脑：备份、恢复和自动任务",
  "based_on": {
   "commit": "52d33563e44e2dbc419dc90a6aed9161d470d1ea",
   "commit_time": "2026-10-11T08:26:11+08:00"
  },
  "video_prompt": "5–8 秒无缝循环，白底水彩风，从开头这屏的插画出发：侧透机箱里伸出的两条细绿线上，淡绿色光点缓缓流动；一叠齿轮、终端、编辑器小图标组成的文件夹卡片一张张落进打开的纸箱，箱盖合上时一个绿色对勾印章轻轻盖下；旁边相机的快门闪一下，把绿色微信聊天气泡定格成一叠照片卡片；两样东西顺着绿线流进写着 G 的固态硬盘，硬盘指示灯随之一闪；一缕光点从硬盘飘向右上角的白云，云里一个绿色循环箭头慢慢转一圈；四周水彩叶子轻轻摆动。镜头不动，除硬盘上的 G 外不出现任何文字，最后一帧回到第一帧。",
  "registry": {
   "groups": [
    {
     "id": "g-config",
     "name": "开发配置备份"
    },
    {
     "id": "g-wechat",
     "name": "微信备份"
    },
    {
     "id": "g-restore",
     "name": "恢复"
    },
    {
     "id": "g-status",
     "name": "看状态和维护"
    }
   ],
   "features": [
    {
     "id": "f-config-sources",
     "group": "g-config",
     "name": "按清单收集配置",
     "what": "70 个来源：用户目录 19 个文件夹、17 个单文件，AppData 33 项，Scoop 软件设置；去掉缓存、插件、日志、对话历史和登录凭据文件；本机没装的记为“没装”，不算失败，必需的 AI 配置目录缺了明确报缺口",
     "how": "自动：DevConfigBackup-Local；改范围改 sources.psd1",
     "status": "在用",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\sources.psd1（10 月 7 日 2cc7be0 加入代理程序 FlyingBird 的 4 项后为 70 个）；DevConfig.Sources.ps1"
    },
    {
     "id": "f-system-export",
     "group": "g-config",
     "name": "系统设置和换机清单",
     "what": "顺带导出环境变量、系统 PATH、hosts、Wi-Fi 配置、Xshell 会话、按名字挑出的 16 个计划任务的定义（其中 8 个停用），以及已装软件表、winget 和 Scoop 清单、VS Code 和 Cursor 扩展、JetBrains 插件",
     "how": "随配置备份自动做",
     "status": "在用",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\DevConfig.Sources.ps1:106-142；latest 包 _system 28 个、_manifests 7 个文件"
    },
    {
     "id": "f-locked-skip",
     "group": "g-config",
     "name": "可选来源的单个文件可跳过",
     "what": "可选来源的单文件被占用，试 3 次后跳过；拒绝访问直接跳过，都写进回执，不报“完整”；必需来源读不了或有其他读取错误，就整次失败",
     "how": "自动",
     "status": "待验收",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\DevConfig.Sources.ps1:56-91；提交 f16860f；PCConfig pending_acceptance devconfig-backup-locked-files（passed，但跳过分支没触发，回执 skipped_file_count=0）"
    },
    {
     "id": "f-package-check",
     "group": "g-config",
     "name": "打包后三道核对",
     "what": "7-Zip 自检、包里每个文件和清单逐项对上、算整包 SHA-256；有一道不过就不发布，上一个好包原样留着",
     "how": "自动",
     "status": "在用",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\Backup-DevConfig.ps1:109-126；out\\latest.zip.receipt.json archive_verification=7z_test_pass"
    },
    {
     "id": "f-content-reuse",
     "group": "g-config",
     "name": "内容没变不重打包",
     "what": "和上一个包的内容指纹一样，就直接用上一个，也不重复上传云盘",
     "how": "自动",
     "status": "说不准",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\Backup-DevConfig.ps1:103-108,55-56；现存回执没有 package=reused 的记录，旧回执已被覆盖，查不到用没用过"
    },
    {
     "id": "f-config-hot",
     "group": "g-config",
     "name": "每天存到 G 盘",
     "what": "每天 12:05 和开机登录后 20 分钟，本机和 G 各存一份，各留最近 7 份；有单文件警告时暂缓清理，10 月 11 日两处各有 8 个",
     "how": "计划任务 DevConfigBackup-Local（Local,Hot）",
     "status": "在用",
     "screen": "devconfig-backup-08",
     "source": "Get-ScheduledTask、state\\devconfig-local-last.json；10 月 11 日两处各有 8 个，有单文件警告时暂缓清理"
    },
    {
     "id": "f-config-cloud",
     "group": "g-config",
     "name": "每天传 Google 云盘",
     "what": "13:00 有网才跑，限速每秒 4 MB；传完和本机逐个比对；云端默认留最近 3 份，这一包带单文件警告时云端也先不删旧包，云上现在存着几份之后没有联网核对",
     "how": "计划任务 DevConfigBackup-Drive-Daily",
     "status": "在用",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\Backup-DevConfig.ps1:44-92；state\\devconfig-drive-last.json（9/28 13:00–13:14 complete）"
    },
    {
     "id": "f-config-plan",
     "group": "g-config",
     "name": "先预演再备份",
     "what": "只列出这次会备份哪些、比上次多了几个、改了几个、少了几个，一个字节都不写",
     "how": "让 AI 跑 Backup-DevConfig.ps1 -Plan",
     "status": "说不准",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\Backup-DevConfig.ps1:128-134；预演不留记录"
    },
    {
     "id": "f-include-history",
     "group": "g-config",
     "name": "连对话历史一起备",
     "what": "打开一个开关，把默认排除的各 AI 工具对话历史也打进包；自动任务不开",
     "how": "手动加参数；自动任务不带",
     "status": "说不准",
     "screen": "devconfig-backup-08",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\sources.psd1:131-145；Backup-DevConfig.ps1:11；手动运行不留记录"
    },
    {
     "id": "f-ai-tool-scope",
     "group": "g-config",
     "name": "AI 工具配置和记忆",
     "what": "Codex 的配置和记忆、Antigravity 和 OpenCode 的设置只由这里备；9 月 28 日晚补回被误挡的 Codex 记忆扩展笔记等，移出 OpenClaw；9 月 29 日凌晨去掉 Antigravity 命令行版的对话、标注和知识，这几个配置目录缺了会报缺口；当前包已在 10 月 3 日修复后核对，该带的配置与记忆已带上，对话与附件已排除",
     "how": "自动：随 DevConfigBackup-Local；Codex Memory Backup、Gemini Memory Backup 已禁用",
     "status": "在用",
     "screen": "devconfig-backup-08",
     "source": "提交 bd651fa（北京 9/28 23:23）；owner-decisions.md“网站：AI 备份只留该留的”；E:\\PCConfig\\registries\\pending_acceptance.json devconfig-ai-scope-first-package（北京 10/3 20:07 passed，真实修复验证 19:51:16）；Get-ScheduledTask 两个记忆任务 Disabled"
    },
    {
     "id": "f-wechat-hot",
     "group": "g-wechat",
     "name": "每天快照备份到 G",
     "what": "09:30 用 VSS 快照复制 E:\\Documents\\xwechat_files 成 G 上新的一份，整份 SHA-256 核对，写回执",
     "how": "计划任务 WeChatBackup-Hot-Daily（-UseVss，最高权限）",
     "status": "在用",
     "screen": "devconfig-backup-09",
     "source": "G:\\80_Backup\\ControlPlane\\wechat-hot-last.json（9/28 09:42 complete，146,300 个文件）；Backup-WeChat.ps1:161-175"
    },
    {
     "id": "f-wechat-generation",
     "group": "g-wechat",
     "name": "整份换、留上一份",
     "what": "新目录建好核对完才换上，上一份改名留着；同哈希文件硬链接",
     "how": "自动",
     "status": "在用",
     "screen": "devconfig-backup-09",
     "source": "E:\\Projects\\Backups\\devconfig-backup\\Backup.Common.ps1:221-272；G:\\80_Backup\\WeChat 下 previous-eb94… 存在"
    },
    {
     "id": "f-wechat-cloud",
     "group": "g-wechat",
     "name": "每周传 Google 云盘",
     "what": "每周一 11:00 只传 G 上已核验、48 小时内、VSS 采的那一份；每次最多 8 GB；copy→check→sync→check",
     "how": "计划任务 WeChatBackup-Drive-Weekly",
     "status": "在用",
     "screen": "devconfig-backup-09",
     "source": "state\\wechat-drive-success.json（9/28 12:28 complete，upload_source g_hot_verified_generation）；Backup-WeChat.ps1:69-139"
    },
    {
     "id": "f-wechat-monitor",
     "group": "g-wechat",
     "name": "云端补传监控",
     "what": "每小时核对云端和 G，缺了就启动一次上传，对上了禁用自己",
     "how": "计划任务 WeChatDrive-Monitor-Hourly，已禁用",
     "status": "已停用",
     "screen": "devconfig-backup-09",
     "source": "Get-ScheduledTask（Disabled，上次北京 7/11 01:53）；Monitor-WeChatDrive.ps1；docs/recovery.md:50"
    },
    {
     "id": "f-wechat-local",
     "group": "g-wechat",
     "name": "E 盘再存一份",
     "what": "-Target Local 写 E:\\WeChatBackup\\xwechat_files",
     "how": "任务不用",
     "status": "已停用",
     "screen": "devconfig-backup-09",
     "source": "Backup-WeChat.ps1:19,176-183；AGENTS.md:9；owner-decisions E18；E:\\WeChatBackup 下已无 xwechat_files"
    },
    {
     "id": "f-wechat-dbonly",
     "group": "g-wechat",
     "name": "云端只传数据库",
     "what": "-DbOnly 云端只传 db_storage，不删已有媒体",
     "how": "任务不用",
     "status": "已停用",
     "screen": "devconfig-backup-09",
     "source": "提交 c8ff579（6/28）→ 8b1ad30（7/8 改回整份）；Backup-WeChat.ps1:43"
    },
    {
     "id": "f-config-restore",
     "group": "g-restore",
     "name": "配置包解到单独文件夹",
     "what": "默认只核对；-Execute 解到单独文件夹、核对整树哈希，原目录改名留作退路；包里记着云盘账号选择，重新授权后手动复制到 state（docs/recovery.md:20-25）",
     "how": "跟 AI 说“恢复开发配置”；Restore-DevConfig.ps1",
     "status": "在用",
     "screen": "devconfig-backup-09",
     "source": "state\\delivery-acceptance-20260918.json configuration.real_isolated_restore=sha256_full_tree，8,640 个文件；Restore-DevConfig.ps1；docs/recovery.md:5-27"
    },
    {
     "id": "f-wechat-restore",
     "group": "g-restore",
     "name": "微信文件放回原处",
     "what": "预检不写；-Execute 要求微信已关，原目录留作退路，失败自动退回，等人打开微信确认",
     "how": "跟 AI 说“恢复微信文件”；Restore-WeChat.ps1",
     "status": "说不准",
     "screen": "devconfig-backup-09",
     "source": "Restore-WeChat.ps1；9/18 验收 official_wechat_client_restore=not_executed；之后没找到痕迹，这个程序不写回执"
    },
    {
     "id": "f-wechat-restore-cloud",
     "group": "g-restore",
     "name": "从云端取回微信",
     "what": "-DriveOnly 用 rclone 从云盘取回并单向比对",
     "how": "Restore-WeChat.ps1 -DriveOnly -Execute",
     "status": "说不准",
     "screen": "devconfig-backup-09",
     "source": "Restore-WeChat.ps1:54-103；不写回执"
    },
    {
     "id": "f-receipts",
     "group": "g-status",
     "name": "回执",
     "what": "每次运行写 run 回执和成功回执；出错写相对路径和原因",
     "how": "自动；驾驶舱和 PCConfig 读",
     "status": "在用",
     "screen": "devconfig-backup-09",
     "source": "state\\*.json；E:\\PCConfig\\registries\\dashboard_sources.json:134-160；core_recovery.json:313-341"
    },
    {
     "id": "f-status-panel",
     "group": "g-status",
     "name": "状态面板",
     "what": "WinForms 窗口，每分钟刷新，默认不联网",
     "how": "双击 Open-BackupStatus.vbs",
     "status": "说不准",
     "screen": "devconfig-backup-09",
     "source": "Backup-Status.ps1；开始菜单没有入口；面板不留使用记录"
    },
    {
     "id": "f-task-setup",
     "group": "g-status",
     "name": "一键注册自动任务",
     "what": "事务式注册 4 个任务：保存原定义、逐项回读、失败回滚",
     "how": "Setup-ScheduledTasks.ps1（PCConfig 负责实际注册）",
     "status": "说不准",
     "screen": "devconfig-backup-09",
     "source": "Setup-ScheduledTasks.ps1；docs/recovery.md:48；AGENTS.md:3；不留记录，现有任务的设置和脚本默认值不一致"
    },
    {
     "id": "f-self-tests",
     "group": "g-status",
     "name": "自检脚本",
     "what": "24 个 tests\\Assert-*.ps1，专属临时目录；Assert-NoBackupArtifacts 防止备份和密钥进仓库",
     "how": "改代码后 AI 跑受影响的那几个",
     "status": "在用",
     "screen": "devconfig-backup-09",
     "source": "tests\\ 24 个；AGENTS.md:15；提交 f16860f 新增 Assert-LockedSourceResilience"
    }
   ],
   "numbers": [
    {
     "id": "n-config-files",
     "text": "6,270 个文件",
     "meaning": "北京 10 月 10 日 12:12 完成的开发配置包里的文件数",
     "as_of": "2026-10-10",
     "source": "out\\latest.zip.receipt.json file_count（devconfig-20261009-231229-9de61253.zip）",
     "screens": [
      "devconfig-backup-01"
     ]
    },
    {
     "id": "n-config-files-0928",
     "text": "10,498 个文件",
     "meaning": "9 月 28 日 12:05 那个开发配置包里的文件数（历史快照：这些屏按当时日期写明，未随首屏刷新）",
     "as_of": "2026-09-28",
     "source": "out\\latest.zip.receipt.json file_count",
     "screens": [
      "devconfig-backup-03"
     ]
    },
    {
     "id": "n-config-size",
     "text": "压缩后 286 MiB · 压缩前 0.88 GiB",
     "meaning": "同一个包：299,791,772 字节；清单 bytes 942,360,581",
     "as_of": "2026-10-10",
     "source": "latest.zip.receipt.json package_bytes；latest.zip.manifest.json bytes",
     "screens": [
      "devconfig-backup-01"
     ]
    },
    {
     "id": "n-config-size-0928",
     "text": "压缩后 1.11 GiB · 压缩前 1.92 GiB",
     "meaning": "同一个包：1,195,940,714 字节；清单 bytes 2,061,071,802（历史快照：这些屏按当时日期写明，未随首屏刷新）",
     "as_of": "2026-09-28",
     "source": "latest.zip.receipt.json package_bytes；latest.zip.manifest.json bytes",
     "screens": [
      "devconfig-backup-03"
     ]
    },
    {
     "id": "n-sources",
     "text": "70 个来源",
     "meaning": "sources.psd1 里的文件和文件夹来源（不含系统导出和对话历史段）：用户目录 19 个文件夹、17 个单文件，AppData 33 项，Scoop 1 项；9 月 29 日为 66 个，10 月 7 日 2cc7be0 加 FlyingBird 4 项",
     "as_of": "2026-10-10",
     "source": "Import-PowerShellDataFile sources.psd1 各段计数（HEAD 2cc7be0：HomeDirs 14＋HomePreciseDirs 5＋HomeFiles 9＋HomePreciseFiles 8＋AppDataRoamingFiles 16＋AppDataRoamingDirs 11＋AppDataLocalDirs 5＋AppDataLocalFiles 1＋ExtraDirs 1）；同法数 9d35282 得 66，与旧稿一致",
     "screens": [
      "devconfig-backup-01",
      "devconfig-backup-03",
      "devconfig-backup-05",
      "devconfig-backup-08"
     ]
    },
    {
     "id": "n-wechat-files",
     "text": "148,592 个文件 · 42.8 GiB",
     "meaning": "北京 10 月 11 日 11:01 完成的那份微信备份（45,972,129,496 字节）",
     "as_of": "2026-10-11",
     "source": "G:\\80_Backup\\ControlPlane\\wechat-hot-last.json file_count、bytes",
     "screens": [
      "devconfig-backup-01"
     ]
    },
    {
     "id": "n-wechat-files-0928",
     "text": "146,300 个文件 · 42.5 GiB",
     "meaning": "9 月 28 日 09:30 那份微信备份（45,603,489,818 字节），同日上云的也是这一份（历史快照：这些屏按当时日期写明，未随首屏刷新）",
     "as_of": "2026-09-28",
     "source": "G:\\80_Backup\\ControlPlane\\wechat-hot-last.json；state\\wechat-drive-success.json",
     "screens": [
      "devconfig-backup-05",
      "devconfig-backup-07",
      "devconfig-backup-10"
     ]
    },
    {
     "id": "n-tasks",
     "text": "4 个自动任务",
     "meaning": "启用中的计划任务；另有 1 个补传监控停着",
     "as_of": "2026-10-11",
     "source": "Get-ScheduledTask（10 月 11 日 13:33–13:41 只读核对：DevConfigBackup-Local、DevConfigBackup-Drive-Daily、WeChatBackup-Hot-Daily、WeChatBackup-Drive-Weekly 启用，WeChatDrive-Monitor-Hourly 停用）",
     "screens": [
      "devconfig-backup-01"
     ]
    },
    {
     "id": "n-restore-test",
     "text": "8,640 个文件",
     "meaning": "9 月 18 日交付验收时真解开一个配置包、整树核对一致的文件数（7.95 GiB）",
     "as_of": "2026-09-18",
     "source": "state\\delivery-acceptance-20260918.json configuration.restored_files",
     "screens": [
      "devconfig-backup-04",
      "devconfig-backup-10"
     ]
    },
    {
     "id": "n-durations",
     "text": "12 分钟 · 1.5 小时 · 约 3 分钟",
     "meaning": "9 月 28 日微信存 G（09:30:01–09:42:49）、微信上云（11:00:00–12:29:04）、配置存本机和 G（12:05:01–12:07:54）",
     "as_of": "2026-09-28",
     "source": "state\\wechat-local-last.json、wechat-drive-last.json、devconfig-local-last.json",
     "screens": [
      "devconfig-backup-02",
      "devconfig-backup-05"
     ]
    },
    {
     "id": "n-task-exports",
     "text": "16 个计划任务的定义（其中 8 个停用）",
     "meaning": "bd651fa 后按 11 条名字规则会导出的任务定义个数（9/28 那个包是 21 个，含 OpenClaw 5 个）",
     "as_of": "2026-09-28",
     "source": "latest 包 _system/tasks 21 个；Get-ScheduledTask 按规则现算",
     "screens": [
      "devconfig-backup-03",
      "devconfig-backup-08"
     ]
    },
    {
     "id": "n-keep",
     "text": "各留最近 7 份；有单文件警告时暂缓清理，10 月 11 日两处各有 8 个；云端默认留最近 3 份",
     "meaning": "本机、G 的配置包各留最近 7 份；有单文件警告时暂缓清理，10 月 11 日两处各有 8 个；这一包带单文件警告时云端也先不删旧包，云上现在存着几份之后没有联网核对",
     "as_of": "2026-10-11",
     "source": "Backup-DevConfig.ps1:14 默认值；10 月 11 日只读核对：本机和 G 两处各有 8 个；云端现存份数之后没有联网核对",
     "screens": [
      "devconfig-backup-08"
     ]
    },
    {
     "id": "n-code",
     "text": "50 个文件、约 6,000 行 · 24 个自检脚本 · 79 次提交",
     "meaning": "受 Git 管的文件和行数（5,997 行）、tests 下脚本数、提交数",
     "as_of": "2026-10-11",
     "source": "git ls-files、git log",
     "screens": [
      "devconfig-backup-05",
      "devconfig-backup-09"
     ]
    },
    {
     "id": "n-codex-memory",
     "text": "84 个记忆文件 · 45 个扩展笔记",
     "meaning": "Codex 记忆文件总数和其中之前被全局 extensions 排除挡掉、这次补回的扩展笔记数（运行时源数量）",
     "as_of": "2026-09-28",
     "source": "提交 bd651fa 说明（45 个）；PCConfig pending_acceptance devconfig-ai-scope-first-package notes（84 个，与 codex-memory 最新快照一致）；写稿人未亲自数",
     "screens": [
      "devconfig-backup-03"
     ]
    },
    {
     "id": "n-openclaw-files",
     "text": "911 个",
     "meaning": "9 月 28 日包里 OpenClaw 的文件数，也是新清单预演比旧包少的数",
     "as_of": "2026-09-28",
     "source": "9/28 包清单 home/.openclaw 911 个；pending_acceptance notes“比最新已核验包少 911 个”",
     "screens": [
      "devconfig-backup-03"
     ]
    },
    {
     "id": "n-package-shrink",
     "text": "2.72 GiB → 0.88 GiB",
     "meaning": "排除 Codex 对话历史前后的配置包大小（2,917,822,761 → 944,588,519 字节）",
     "as_of": "2026-09-26",
     "source": "out\\ 目录 9/26 12:08 与 9/26 23:26 的包",
     "screens": [
      "devconfig-backup-07"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "被同步和检查",
     "flow": "电脑配置与恢复每天 14:15 查 G:\\80_Backup\\DevConfig\\current.json 和微信热备回执 36 小时内有没有成功，14:30 把 G 上配置包目录和微信那一份同步到外接盘 H；它还登记这 5 个任务的用途和重建计划、负责换机时把配置放回实际路径、实际注册计划任务",
     "source": "E:\\PCConfig\\registries\\core_recovery.json:121-137,313-341；task_purpose_catalog.json；AGENTS.md:3,13；docs/recovery.md:48-54"
    },
    {
     "id": "r-cockpit",
     "with": "pcconfig",
     "direction": "被读取",
     "flow": "驾驶舱接口读 state 下的 devconfig-drive-success、wechat-drive-success 和三份运行回执，显示这几个任务正不正常",
     "source": "E:\\PCConfig\\registries\\dashboard_sources.json:134-160"
    },
    {
     "id": "r-wechatdirect",
     "with": "wechatdirect",
     "direction": "并行",
     "flow": "两边都碰 E:\\Documents\\xwechat_files，但互不调用：本项目只复制原始文件、不开数据库；微信聊天读取读活的数据库、不读备份",
     "source": "b1\\wechatdirect\\page.json r-backup；Backup-WeChat.ps1:5；Restore-WeChat.ps1:6-8"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "分出去",
     "flow": "登录凭据文件不进配置包，由密码中心单独恢复",
     "source": "sources.psd1:108-110；提交 ebe7bdb"
    },
    {
     "id": "r-codex-conversation",
     "with": "codex-memory",
     "direction": "分出去",
     "flow": "Codex 对话历史（thread_history 数据库）不进配置包，由 Codex 对话备份（CodexConversationBackup-Hot-Daily，每天 12:15，VSS）负责",
     "source": "提交 5be7957；sources.psd1 HistoryFiles"
    },
    {
     "id": "r-ai-config-takeover",
     "with": "codex-memory",
     "direction": "接过来",
     "flow": "9 月 28 日晚起，Codex 的配置和记忆由本项目唯一备份，Codex 自己的“配置和记忆”任务（Codex Memory Backup，原每天 11:05、13:05）退役禁用；Antigravity 的设置同样只由本项目备，原“Gemini 备份”（Gemini Memory Backup，每天 13:10）退役，gemini-memory 仓库留档",
     "source": "owner-decisions.md“网站：AI 备份只留该留的”；提交 bd651fa；Get-ScheduledTask 两任务 Disabled"
    },
    {
     "id": "r-google-drive",
     "with": "Google 云盘（外部服务）",
     "direction": "交出去",
     "flow": "rclone 经电脑当前的系统代理把配置包（Backups/WLY，留 3 份＋latest）和微信那一份（Backups/WeChat/xwechat_files）传到私人 Google 云盘，传完按校验和比对",
     "source": "Backup-DevConfig.ps1:44-92；Backup-WeChat.ps1:96-139；Initialize-BackupNetwork.ps1"
    }
   ],
   "highlights": [
    {
     "id": "h-wechat-cloud-fix",
     "title": "微信上云：从“核对不上”到 146,300 个文件一次传对。",
     "screen": "devconfig-backup-07"
    },
    {
     "id": "h-locked-file",
     "title": "一个 0 字节的小文件，让配置备份两天多没出新包。",
     "screen": "devconfig-backup-07"
    },
    {
     "id": "h-package-shrink",
     "title": "配置包从 2.72 GiB 缩到 0.88 GiB。",
     "screen": "devconfig-backup-07"
    }
   ],
   "mentions": [
    {
     "target": "/how/#devconfig-backup",
     "screen": "devconfig-backup-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/cockpit/#devconfig-backup",
     "screen": "devconfig-backup-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "devconfig-backup-02",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/wechatdirect/",
     "screen": "devconfig-backup-02",
     "text": "微信聊天读取"
    },
    {
     "target": "/projects/password-center/",
     "screen": "devconfig-backup-03",
     "text": "密码中心"
    },
    {
     "target": "/projects/pcconfig/#usage",
     "screen": "devconfig-backup-04",
     "text": "电脑配置与恢复的换机指南"
    }
   ],
   "live": [
    {
     "slot": "config",
     "meaning": "开发配置备份现在正不正常：一盏灯加一句话（运行正常／有任务没按时跑／上次运行失败／暂时读不到），带上次存 G、上次上云的时间（北京时间）",
     "source": "驾驶舱接口里 \\DevConfigBackup-Local、\\DevConfigBackup-Drive-Daily 两个任务；成功回执 state\\devconfig-drive-success.json，运行回执 devconfig-local-last.json、devconfig-drive-last.json（dashboard_sources.json:134-160）"
    },
    {
     "slot": "wechat",
     "meaning": "微信备份现在正不正常：一盏灯加一句话，带上次存 G、上次上云的时间（北京时间）",
     "source": "驾驶舱接口里 \\WeChatBackup-Hot-Daily、\\WeChatBackup-Drive-Weekly；上云成功回执 state\\wechat-drive-success.json；存 G 的回执 G:\\80_Backup\\ControlPlane\\wechat-hot-last.json（目前只在 core_recovery 新鲜度检查里，dashboard_sources 没列，见 batch2.md）"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“开发配置备份” → f-config-sources、f-system-export、f-package-check、f-config-hot、f-config-cloud（按实际机制拆开）；另补 f-locked-skip、f-content-reuse、f-config-plan、f-include-history",
    "底稿“微信原件备份” → f-wechat-hot、f-wechat-generation、f-wechat-cloud；另补代码里还在、但不用的 f-wechat-monitor、f-wechat-local、f-wechat-dbonly（已停用）",
    "底稿“分层状态面板” → f-status-panel（面板本身）和 f-receipts（驾驶舱读的回执）",
    "底稿“配置隔离恢复” → f-config-restore（rclone 账号选择的带回并进这一条）",
    "底稿“微信恢复核对” → f-wechat-restore；从云端取回单列 f-wechat-restore-cloud",
    "代码里的 Initialize-BackupNetwork（代理和账号绑定）不单列功能，写在第 5、6 屏的机制里"
   ],
   "dropped": [
    "三个旧隐藏启动器 devconfig_drive_hidden.vbs、devconfig_local_hidden.vbs、wechat_backup_hidden.vbs：指向已不存在的旧任务名，没有任何任务或脚本调用，不算功能，写进 audit.md A4",
    "Monitor-WeChatDrive.ps1 的 CompletePercent 参数：代码里没用到，不上页",
    "截图：仓库里没有图片，旧网站这一页只有一张生成的插画（/images/devconfig-backup-*.webp），不是真实截图；状态面板窗口没有现成截图，本页不放截图位"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 4 屏“我决定不专门演练恢复”（依据：决定 C2“恢复演练：A 不做”）；第 7 屏“9 月 26 日凌晨我选了‘修好继续上云’”（依据：第二轮 K3，北京 9 月 26 日 04:13 答复；修复提交 c5e39e8 在 04:32）。",
    "功能状态按派活时定的口径：f-config-restore 标“在用”，依据是 9 月 18 日交付验收时真解开一个配置包核对（这是验收，不是出事时的真实恢复）；如果验收不算“真实使用”，应改“说不准”。",
    "f-wechat-monitor 标“已停用”：任务 7 月 11 日起禁用、设计上对上就自己停，代码 9 月 26 日还在维护，需要时手动开得起来；也可以理解为“没用过（新版）”。",
    "第 7 屏亮点 2“两天多没出新包”：依据是 9 月 24 日 10:09 到 9 月 26 日 12:08 之间没有新包，提交 f16860f 说明“一直失败”是 Clash Verge 锁文件；中间每次失败的回执已被覆盖，没逐次核对。",
    "第 7 屏亮点 1 原来写“19 分钟后改完”（K3 答复 04:13、提交 04:32），但答复时间是整轮的时间、代码可能之前就在改，改成了“当天就改完”。",
    "“42.5 GiB 只用 12 分钟”的原因写成硬链接复用：代码确实把同哈希文件硬链接，但 12 分钟里还有对每个文件算两遍 SHA-256，没做分项计时。",
    "第 3 屏“84 个记忆文件、45 个扩展笔记”不是我数的：45 来自提交 bd651fa 说明，84 来自 PCConfig 待验收清单 devconfig-ai-scope-first-package 的备注；9 月 29 日 12:05 的新包出来后应按包清单核一次。派活消息里的“OpenCode 现在 24 个”口径不明（24 个文件还是别的），没上页。",
    "电脑配置与恢复页写 G 上“微信 147.4 GiB”（按文件大小相加，硬链接重复计），其中两个旧目录逻辑大小约 62 GiB（audit.md A1）；修复对话 9 月 29 日查清它们大多和当前那份共用文件，实际能省的只有约 211 MiB，本人同意保留（决定记录“Codex 对话不随配置包上云盘”一节末句）。当前那一份 42.5 GiB；本页只写当前那一份。",
    "替本人口吻写的句子（9 月 29 日补，上线前请本人过目）：第 10 屏“按我的决定，Codex 对话也不随配置包上云盘”（依据：决定记录“Codex 对话不随配置包上云盘”，本人原话“codex对话目前不需要上传到drive”）。这条和第 3 屏“Codex 对话不上云盘”都不在修复对话发来的事实清单里，是写稿人按决定记录补的。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/devconfig-backup/page.json",
  "sha256": "051cb56823c3f75a97d74ee99749a2c30952f6c89a64672a0445fe1065601bf8",
  "converted_at_beijing": "2026-10-11T19:47:51+08:00"
 }
}
---

::screen{#devconfig-backup-01 section="top"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左右分栏。左边约 55%：大标题“开发配置备份”，标题右侧同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（GitHub 按钮前画 GitHub 猫头小标志）；标题下一段介绍；介绍下面四张数字卡片排成两行两列（大号绿色数字＋一行小字），卡片下沿右侧一行灰色小字“截至 10 月 11 日”。右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。两样东西再沿绿线流进旁边一块写着“G”的固态硬盘，一缕光点从硬盘飞向右上角的白云（云上画 Google 云盘三色小标志）。插画里除“G”外不写字。最下面横跨整屏一条浅绿“现在”横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 26%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边一个按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段；插画缩到屏宽（机箱、纸箱、相机和微信气泡、G 盘、云）；四张数字卡片排成两行两列；“截至 10 月 11 日”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个等宽空框上下排（每个满宽、高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#devconfig-backup"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/devconfig-backup"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#devconfig-backup"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/devconfig-backup/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "config",
   "wechat"
  ],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "action_button",
    "icon",
    "stat_card",
    "content_card",
    "illustration",
    "live_strip",
    "monospace",
    "inline_link"
   ],
   "portrait_component_order": [
    "prose",
    "action_button",
    "illustration",
    "stat_card",
    "content_card",
    "live_strip",
    "monospace",
    "chapter_title",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左右分栏。左边约 55%：大标题“开发配置备份”，标题右侧同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（GitHub 按钮前画 GitHub 猫头小标志）；标题下一段介绍；介绍下面四张数字卡片排成两行两列（大号绿色数字＋一行小字），卡片下沿右侧一行灰色小字“截至 10 月 11 日”。右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。两样东西再沿绿线流进旁边一块写着“G”的固态硬盘，一缕光点从硬盘飞向右上角的白云（云上画 Google 云盘三色小标志）。插画里除“G”外不写字。最下面横跨整屏一条浅绿“现在”横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 26%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边一个按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
    "portrait": "竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段；插画缩到屏宽（机箱、纸箱、相机和微信气泡、G 盘、云）；四张数字卡片排成两行两列；“截至 10 月 11 日”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个等宽空框上下排（每个满宽、高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     2
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边约 45% 一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左右分栏。左边约 55%：大标题“开发配置备份”，标题右侧同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（GitHub 按钮前画 GitHub 猫头小标志）；标题下一段介绍；介绍下面四张数字卡片排成两行两列（大号绿色数字＋一行小字），卡片下沿右侧一行灰色小字“截至 10 月 11 日”。右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。两样东西再沿绿线流进旁边一块写着“G”的固态硬盘，一缕光点从硬盘飞向右上角的白云（云上画 Google 云盘三色小标志）。插画里除“G”外不写字。最下面横跨整屏一条浅绿“现在”横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 26%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边一个按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "portrait": "竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段；插画缩到屏宽（机箱、纸箱、相机和微信气泡、G 盘、云）；四张数字卡片排成两行两列；“截至 10 月 11 日”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个等宽空框上下排（每个满宽、高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "55%",
     "text_ref": "开发配置备份"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain",
     "row": "hero"
    },
    {
     "type": "action_button",
     "row": "hero",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "重装系统或电脑坏了，最难重建的是各种开发软件和AI工具的设置，还有微信里的聊天记"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "icons": "none",
     "text_ref": "70个来源开发配置清单；Codex的配置和记忆、Antigravity和Open"
    },
    {
     "type": "prose",
     "align": "right",
     "text_ref": "截至10月11日"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n标题与入口按钮应横版同一行；现有 row 只能把多个独立块纵向并入同一栏，不能把标题旁按钮排到同一基线。\n定稿 **现在** 一行解析成 card；core.live_strip 只消费 now，会丢按钮。本规格先以 prose 保留该行全部文字，并用 config、wechat 两个无字 live_box 表达实时空位；原要求的‘左标签、中间两框、右按钮’一条横排与竖版‘标签、框、框、按钮’需支持 card 型实时条后接入。\n日期小字要求右对齐，prose 的 align 字段目前未消费。GitHub 按钮前品牌小标、插画中允许的 G 字和指定品牌只能按素材核对，不能据候选顺序认定已完成。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。\n资产清单的 icon 仅 1 项，文字盘点预算 4 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。 本轮主程序已支持**现在**解析为now，本轮改接live_strip并去掉临时两个独立live_box，避免重复实时空位。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。",
   "unsupported_requirements": [
    "标题与入口按钮应横版同一行；现有 row 只能把多个独立块纵向并入同一栏，不能把标题旁按钮排到同一基线。",
    "定稿 **现在** 一行解析成 card；core.live_strip 只消费 now，会丢按钮。本规格先以 prose 保留该行全部文字，并用 config、wechat 两个无字 live_box 表达实时空位；原要求的‘左标签、中间两框、右按钮’一条横排与竖版‘标签、框、框、按钮’需支持 card 型实时条后接入。",
    "日期小字要求右对齐，prose 的 align 字段目前未消费。GitHub 按钮前品牌小标、插画中允许的 G 字和指定品牌只能按素材核对，不能据候选顺序认定已完成。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
    "资产清单的 icon 仅 1 项，文字盘点预算 4 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1,
     "title": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 4,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "action_button",
    "icon",
    "stat_card",
    "content_card",
    "illustration",
    "live_strip",
    "monospace",
    "inline_link"
   ],
   "portrait_component_order": [
    "prose",
    "action_button",
    "illustration",
    "stat_card",
    "content_card",
    "live_strip",
    "monospace",
    "chapter_title",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左右分栏。左边约 55%：大标题“开发配置备份”，标题右侧同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（GitHub 按钮前画 GitHub 猫头小标志）；标题下一段介绍；介绍下面四张数字卡片排成两行两列（大号绿色数字＋一行小字），卡片下沿右侧一行灰色小字“截至 10 月 11 日”。右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。两样东西再沿绿线流进旁边一块写着“G”的固态硬盘，一缕光点从硬盘飞向右上角的白云（云上画 Google 云盘三色小标志）。插画里除“G”外不写字。最下面横跨整屏一条浅绿“现在”横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 26%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边一个按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
    "portrait": "竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段；插画缩到屏宽（机箱、纸箱、相机和微信气泡、G 盘、云）；四张数字卡片排成两行两列；“截至 10 月 11 日”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个等宽空框上下排（每个满宽、高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     2
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边约 45% 一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左右分栏。左边约 55%：大标题“开发配置备份”，标题右侧同一行两个白底细浅绿描边的圆角按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕（GitHub 按钮前画 GitHub 猫头小标志）；标题下一段介绍；介绍下面四张数字卡片排成两行两列（大号绿色数字＋一行小字），卡片下沿右侧一行灰色小字“截至 10 月 11 日”。右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。两样东西再沿绿线流进旁边一块写着“G”的固态硬盘，一缕光点从硬盘飞向右上角的白云（云上画 Google 云盘三色小标志）。插画里除“G”外不写字。最下面横跨整屏一条浅绿“现在”横条：左边“现在”两个毛笔字，接着两个等宽的浅色圆角空框（每个约占横条宽度 26%、高约横条的 70%，垂直居中，框里一个字都不画，网页程序往里填实时文字），最右边一个按钮〔现在正不正常 → 驾驶舱〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "portrait": "竖版：从上到下——大标题；标题下一行并排两个按钮〔在整套系统里的位置 → 怎么协作〕〔GitHub〕；介绍段；插画缩到屏宽（机箱、纸箱、相机和微信气泡、G 盘、云）；四张数字卡片排成两行两列；“截至 10 月 11 日”小字靠右；“现在”横条改成竖排：先“现在”二字，下面两个等宽空框上下排（每个满宽、高约一行半字），最下面是〔现在正不正常 → 驾驶舱〕按钮。 那一排按钮里同样有〔复制 AI 续作说明〕。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "开发配置备份"
    },
    {
     "type": "live_strip",
     "text_ref": "现在现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 2,
     "columns_v": 2,
     "icons": "none",
     "text_ref": "70个来源开发配置清单；Codex的配置和记忆、Antigravity和Open"
    },
    {
     "type": "prose",
     "align": "right",
     "text_ref": "截至10月11日"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    },
    {
     "type": "prose",
     "text_ref": "重装系统或电脑坏了，最难重建的是各种开发软件和AI工具的设置，还有微信里的聊天记"
    },
    {
     "type": "illustration",
     "index": 0
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n标题与入口按钮应横版同一行；现有 row 只能把多个独立块纵向并入同一栏，不能把标题旁按钮排到同一基线。\n定稿 **现在** 一行解析成 card；core.live_strip 只消费 now，会丢按钮。本规格先以 prose 保留该行全部文字，并用 config、wechat 两个无字 live_box 表达实时空位；原要求的‘左标签、中间两框、右按钮’一条横排与竖版‘标签、框、框、按钮’需支持 card 型实时条后接入。\n日期小字要求右对齐，prose 的 align 字段目前未消费。GitHub 按钮前品牌小标、插画中允许的 G 字和指定品牌只能按素材核对，不能据候选顺序认定已完成。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。\n资产清单的 icon 仅 1 项，文字盘点预算 4 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。 本轮主程序已支持**现在**解析为now，本轮改接live_strip并去掉临时两个独立live_box，避免重复实时空位。",
   "unsupported_requirements": [
    "标题与入口按钮应横版同一行；现有 row 只能把多个独立块纵向并入同一栏，不能把标题旁按钮排到同一基线。",
    "定稿 **现在** 一行解析成 card；core.live_strip 只消费 now，会丢按钮。本规格先以 prose 保留该行全部文字，并用 config、wechat 两个无字 live_box 表达实时空位；原要求的‘左标签、中间两框、右按钮’一条横排与竖版‘标签、框、框、按钮’需支持 card 型实时条后接入。",
    "日期小字要求右对齐，prose 的 align 字段目前未消费。GitHub 按钮前品牌小标、插画中允许的 G 字和指定品牌只能按素材核对，不能据候选顺序认定已完成。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
    "资产清单的 icon 仅 1 项，文字盘点预算 4 个图标位；差 3 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1,
     "title": 1
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "66 个来源　开发配置清单（9 月 29 日凌晨起）；Codex 的配置和记忆、Antigravity 和 OpenCode 的设置只有它在备",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "146,300 个文件　微信原始文件 42.5 GiB，每天拍快照复制一份到 G",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "10,498 个文件　9 月 28 日的开发配置包，压缩后 1.11 GiB（按改之前的清单）",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "4 个自动任务　配置每天存 G、每天上云；微信每天存 G、每周上云",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-devconfig-backup.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-devconfig-backup",
   "source_phrase": "右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。",
   "sha256": "02c93e4d5401230db278ed1e08517748a918e05e838da9d22eac7d1af121ec36",
   "status": "ready",
   "original_elements": [
    "一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口抽象图形、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片"
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
   "asset": "devconfig-backup/devconfig-backup-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ec96df61bbe2956d4ebe",
   "title_text": "开发配置备份",
   "sha256": "8565fe8b060182353e0d8bdc500ae0740f956619eee0473740ae2204e391022d",
   "status": "ready",
   "source_box": [
    35,
    76,
    569,
    223
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 开发配置备份

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

重装系统或电脑坏了，最难重建的是各种开发软件和 AI 工具的设置，还有微信里的聊天记录。它每天把这两样复制出来、逐个文件核对，存到机箱里的 G 盘；配置每天、微信每周再传到 Google 云盘；外接盘那一份由电脑配置与恢复同步。全程是脚本，不用 AI 模型。

- **70 个来源**　开发配置清单；Codex 的配置和记忆、Antigravity 和 OpenCode 的设置只有它在备
- **148,592 个文件**　微信原始文件 42.8 GiB，每天拍快照复制一份到 G
- **6,270 个文件**　最新一个开发配置包，压缩后 286 MiB
- **4 个自动任务**　配置每天存 G、每天上云；微信每天存 G、每周上云

10 月 11 日这一次：12:05 的配置采集没成功（Codex 的一个状态数据库没能在限定时间里做出一致的副本），没出新包，上一个好包（10 月 10 日那个）原样留着；13:00 上云照常成功，但传上去的就是这个 10 月 10 日的旧包，不是今天的新配置。微信当天 11:02 照常存进了 G。

截至 10 月 11 日

**现在**　〔现在正不正常 → 驾驶舱〕

::screen{#devconfig-backup-02 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-02",
  "section": "usage",
  "title": "每天发生什么，和两个项目怎么分工",
  "scene": "横版：上半屏是一条横向时间轴（淡绿色水彩长条，从左到右 09:30 → 11:00（只在周一）→ 12:05 → 13:00 → 14:15 → 14:30，每个时间点一个小圆点，圆点下面是对应的那条字；周一那个点画成空心，旁边一个小日历图标；14:15、14:30 两个点用灰绿色，表示是别的项目做的）。下半屏三张并排的卡片，标题“它和两个项目怎么分工”横跨在三张卡片上方：左卡“本项目”画一个纸箱加对勾；中卡画机箱连着外接硬盘，按钮〔电脑配置与恢复〕；右卡画一只微信气泡旁边一个放大镜，按钮〔微信聊天读取〕。卡片之间留一致的间距。",
  "portrait": "竖版：标题；时间轴改成从上到下的竖线，每个时间点一行（左边时间、右边一句话），周一那一行带小日历图标；下面“它和两个项目怎么分工”三张卡片上下排、满宽。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "微信聊天读取",
    "href": "/projects/wechatdirect/"
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "timeline",
    "bullet_list",
    "content_card",
    "action_button",
    "icon",
    "inline_link"
   ],
   "portrait_component_order": [
    "timeline",
    "content_card",
    "chapter_title",
    "bullet_list",
    "action_button",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：上半屏是一条横向时间轴（淡绿色水彩长条，从左到右 09:30 → 11:00（只在周一）→ 12:05 → 13:00 → 14:15 → 14:30，每个时间点一个小圆点，圆点下面是对应的那条字；周一那个点画成空心，旁边一个小日历图标；14:15、14:30 两个点用灰绿色，表示是别的项目做的）。下半屏三张并排的卡片，标题“它和两个项目怎么分工”横跨在三张卡片上方：左卡“本项目”画一个纸箱加对勾；中卡画机箱连着外接硬盘，按钮〔电脑配置与恢复〕；右卡画一只微信气泡旁边一个放大镜，按钮〔微信聊天读取〕。卡片之间留一致的间距。",
    "portrait": "竖版：标题；时间轴改成从上到下的竖线，每个时间点一行（左边时间、右边一句话），周一那一行带小日历图标；下面“它和两个项目怎么分工”三张卡片上下排、满宽。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：上半屏是一条横向时间轴（淡绿色水彩长条，从左到右 09:30 → 11:00（只在周一）→ 12:05 → 13:00 → 14:15 → 14:30，每个时间点一个小圆点，圆点下面是对应的那条字；周一那个点画成空心，旁边一个小日历图标；14:15、14:30 两个点用灰绿色，表示是别的项目做的）。下半屏三张并排的卡片，标题“它和两个项目怎么分工”横跨在三张卡片上方：左卡“本项目”画一个纸箱加对勾；中卡画机箱连着外接硬盘，按钮〔电脑配置与恢复〕；右卡画一只微信气泡旁边一个放大镜，按钮〔微信聊天读取〕。卡片之间留一致的间距。",
   "portrait": "竖版：标题；时间轴改成从上到下的竖线，每个时间点一行（左边时间、右边一句话），周一那一行带小日历图标；下面“它和两个项目怎么分工”三张卡片上下排、满宽。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "每天发生什么（北京时间）"
    },
    {
     "type": "timeline",
     "columns": 6,
     "direction": "horizontal",
     "connector": "ribbon",
     "illustration": "none",
     "text_ref": "09:30微信：先给E盘拍一张卷影快照，从快照把微信原始文件复制成G上新的一份，"
    },
    {
     "type": "prose",
     "text_ref": "关机错过了，开机后补跑；上云的两个任务有网才跑。失败了自动重试3次：存G的隔10"
    },
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它和两个项目怎么分工"
    },
    {
     "type": "comparison",
     "columns": 3,
     "columns_v": 1,
     "groups": [
      {
       "count": 1
      },
      {
       "count": 1
      },
      {
       "count": 1
      }
     ],
     "illustration": "left_inside",
     "item_cards": true,
     "text_ref": "本项目选备份哪些东西、复制、打包、核对，写本机、G和云盘；恢复时把配置包解到单独"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n时间线周一空心点、09:30/11:00 等六种节点样式、14:15/14:30 灰绿点及周一小日历未由 timeline 的通用字段实现；不得把所有节点画成同样状态。\n下方三卡中第二、第三张原开头是链接 para，comparison 依显式 count 分组三张；对应纸箱/机箱硬盘/微信放大镜需要逐卡语义图标映射，未按候选序号猜配。\n清单未登记这些完整原文的逐字一致毛笔标题图：每天发生什么（北京时间）；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 3 项，文字盘点预算 4 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "时间线周一空心点、09:30/11:00 等六种节点样式、14:15/14:30 灰绿点及周一小日历未由 timeline 的通用字段实现；不得把所有节点画成同样状态。",
    "下方三卡中第二、第三张原开头是链接 para，comparison 依显式 count 分组三张；对应纸箱/机箱硬盘/微信放大镜需要逐卡语义图标映射，未按候选序号猜配。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：每天发生什么（北京时间）；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 3 项，文字盘点预算 4 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 3,
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 4,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "timeline",
    "bullet_list",
    "content_card",
    "action_button",
    "icon",
    "inline_link"
   ],
   "portrait_component_order": [
    "timeline",
    "content_card",
    "chapter_title",
    "bullet_list",
    "action_button",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：上半屏是一条横向时间轴（淡绿色水彩长条，从左到右 09:30 → 11:00（只在周一）→ 12:05 → 13:00 → 14:15 → 14:30，每个时间点一个小圆点，圆点下面是对应的那条字；周一那个点画成空心，旁边一个小日历图标；14:15、14:30 两个点用灰绿色，表示是别的项目做的）。下半屏三张并排的卡片，标题“它和两个项目怎么分工”横跨在三张卡片上方：左卡“本项目”画一个纸箱加对勾；中卡画机箱连着外接硬盘，按钮〔电脑配置与恢复〕；右卡画一只微信气泡旁边一个放大镜，按钮〔微信聊天读取〕。卡片之间留一致的间距。",
    "portrait": "竖版：标题；时间轴改成从上到下的竖线，每个时间点一行（左边时间、右边一句话），周一那一行带小日历图标；下面“它和两个项目怎么分工”三张卡片上下排、满宽。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：上半屏是一条横向时间轴（淡绿色水彩长条，从左到右 09:30 → 11:00（只在周一）→ 12:05 → 13:00 → 14:15 → 14:30，每个时间点一个小圆点，圆点下面是对应的那条字；周一那个点画成空心，旁边一个小日历图标；14:15、14:30 两个点用灰绿色，表示是别的项目做的）。下半屏三张并排的卡片，标题“它和两个项目怎么分工”横跨在三张卡片上方：左卡“本项目”画一个纸箱加对勾；中卡画机箱连着外接硬盘，按钮〔电脑配置与恢复〕；右卡画一只微信气泡旁边一个放大镜，按钮〔微信聊天读取〕。卡片之间留一致的间距。",
   "portrait": "竖版：标题；时间轴改成从上到下的竖线，每个时间点一行（左边时间、右边一句话），周一那一行带小日历图标；下面“它和两个项目怎么分工”三张卡片上下排、满宽。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "每天发生什么（北京时间）"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "none",
     "text_ref": "09:30微信：先给E盘拍一张卷影快照，从快照把微信原始文件复制成G上新的一份，"
    },
    {
     "type": "prose",
     "text_ref": "关机错过了，开机后补跑；上云的两个任务有网才跑。失败了自动重试3次：存G的隔10"
    },
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它和两个项目怎么分工"
    },
    {
     "type": "comparison",
     "columns": 3,
     "columns_v": 1,
     "groups": [
      {
       "count": 1
      },
      {
       "count": 1
      },
      {
       "count": 1
      }
     ],
     "illustration": "left_inside",
     "item_cards": true,
     "text_ref": "本项目选备份哪些东西、复制、打包、核对，写本机、G和云盘；恢复时把配置包解到单独"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n时间线周一空心点、09:30/11:00 等六种节点样式、14:15/14:30 灰绿点及周一小日历未由 timeline 的通用字段实现；不得把所有节点画成同样状态。\n下方三卡中第二、第三张原开头是链接 para，comparison 依显式 count 分组三张；对应纸箱/机箱硬盘/微信放大镜需要逐卡语义图标映射，未按候选序号猜配。\n清单未登记这些完整原文的逐字一致毛笔标题图：每天发生什么（北京时间）；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 3 项，文字盘点预算 4 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "时间线周一空心点、09:30/11:00 等六种节点样式、14:15/14:30 灰绿点及周一小日历未由 timeline 的通用字段实现；不得把所有节点画成同样状态。",
    "下方三卡中第二、第三张原开头是链接 para，comparison 依显式 count 分组三张；对应纸箱/机箱硬盘/微信放大镜需要逐卡语义图标映射，未按候选序号猜配。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：每天发生什么（北京时间）；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 3 项，文字盘点预算 4 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 3,
     "title": 1
    },
    "inventory_illustration_slots": 0,
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "09:30　微信：先给 E 盘拍一张卷影快照，从快照把微信原始文件复制成 G 上新的一份，逐个核对（9 月 28 日用了 12 分钟）",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "每周一 11:00　微信：把 G 上核对过的那一份传到 Google 云盘，传完再逐个比对（9 月 28 日用了 1.5 小时）",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "12:05（每次开机登录后 20 分钟也跑一次）　开发配置：收集、打包、核对，本机和 G 各存一份（约 3 分钟）",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "13:00　开发配置包传 Google 云盘，传完和本机逐个比对",
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
   "asset": "_library/titles/title-44eb4812bcd4bfabe49f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-44eb4812bcd4bfabe49f",
   "title_text": "每天发生什么（北京时间）",
   "sha256": "250e914eb04313a26d5bbe6fdbd18189cb783f3c49ad9a425fbf07fae7a4babd",
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
   "asset": "_library/round3/titles/title-r3-e21982fa91062915ceb7.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-02-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-e21982fa91062915ceb7",
   "title_text": "它和两个项目怎么分工",
   "sha256": "6f19116531070eb81e4b568326d6d43bb290429042c42ce5acf1b5a7aba98c4a",
   "status": "ready",
   "source_box": [
    32,
    593,
    590,
    702
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 每天发生什么（北京时间）

- **09:30**　微信：先给 E 盘拍一张卷影快照，从快照把微信原始文件复制成 G 上新的一份，逐个核对（9 月 28 日用了 12 分钟）
- **每周一 11:00**　微信：把 G 上核对过的那一份传到 Google 云盘，传完再逐个比对（9 月 28 日用了 1.5 小时）
- **12:05**（每次开机登录后 20 分钟也跑一次）　开发配置：收集、打包、核对，本机和 G 各存一份（约 3 分钟）
- **13:00**　开发配置包传 Google 云盘，传完和本机逐个比对
- **14:15**　电脑配置与恢复检查这两类备份 36 小时内有没有成功
- **14:30**　电脑配置与恢复把 G 上这两类备份同步到外接盘 H

关机错过了，开机后补跑；上云的两个任务有网才跑。失败了自动重试 3 次：存 G 的隔 10–15 分钟，上云的隔 15–30 分钟。

## 它和两个项目怎么分工

**本项目**　选备份哪些东西、复制、打包、核对，写本机、G 和云盘；恢复时把配置包解到单独的文件夹、把微信文件放回原处。

〔电脑配置与恢复〕　外接盘同步、新鲜度检查、换机按什么顺序恢复、把配置放回各个软件的实际位置。

〔微信聊天读取〕　让 AI 读正在用的微信来回答问题。它不读备份；本项目也不打开微信数据库、不看聊天内容。

::screen{#devconfig-backup-03 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-03",
  "section": "usage",
  "title": "备份里有什么，没有什么",
  "scene": "横版：左右两栏。左栏约 60% 是“开发配置包”：画一个打开的水彩纸箱，箱里分层插着五张标签卡（用户目录、AppData、Scoop、系统、换机清单），每张卡旁边是对应那一条字；五张标签卡下面一块浅绿细框“AI 工具这一块只有它在备”：三行工具小条（Codex、Antigravity、OpenCode，各配一个小图标），下面一条更浅的细框“迁移与核对依据”，四条编号小字；纸箱下方一个灰色小垃圾桶，旁边是“不进包的”那段字；最下面一条浅黄色提醒条放“包里仍可能有密码和密钥”那段。右栏约 40% 是“微信”：画一个文件夹图标，里面露出数据库圆柱、图片、视频、文件四个小图标，旁边一个被划掉的“缓存”小篮子，下面是微信那段字。",
  "portrait": "竖版：标题；先“开发配置包”：纸箱插画缩小放在上面，五条内容一行一条往下排，接着“AI 工具这一块只有它在备”三行和“迁移与核对依据”四条，再接“不进包的”、黄色提醒条；再往下是“微信”：文件夹插画和那段字。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "comparison",
    "tag",
    "notice",
    "icon",
    "bullet_list",
    "content_card",
    "illustration",
    "inline_link",
    "prose"
   ],
   "portrait_component_order": [
    "illustration",
    "prose",
    "notice",
    "chapter_title",
    "comparison",
    "tag",
    "icon",
    "bullet_list",
    "content_card",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左右两栏。左栏约 60% 是“开发配置包”：画一个打开的水彩纸箱，箱里分层插着五张标签卡（用户目录、AppData、Scoop、系统、换机清单），每张卡旁边是对应那一条字；五张标签卡下面一块浅绿细框“AI 工具这一块只有它在备”：三行工具小条（Codex、Antigravity、OpenCode，各配一个小图标），下面一条更浅的细框“迁移与核对依据”，四条编号小字；纸箱下方一个灰色小垃圾桶，旁边是“不进包的”那段字；最下面一条浅黄色提醒条放“包里仍可能有密码和密钥”那段。右栏约 40% 是“微信”：画一个文件夹图标，里面露出数据库圆柱、图片、视频、文件四个小图标，旁边一个被划掉的“缓存”小篮子，下面是微信那段字。",
    "portrait": "竖版：标题；先“开发配置包”：纸箱插画缩小放在上面，五条内容一行一条往下排，接着“AI 工具这一块只有它在备”三行和“迁移与核对依据”四条，再接“不进包的”、黄色提醒条；再往下是“微信”：文件夹插画和那段字。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左右两栏。左栏约 60% 是“开发配置包”：画一个打开的水彩纸箱，箱里分层插着五张标签卡（用户目录、AppData、Scoop、系统、换机清单），每张卡旁边是对应那一条字；五张标签卡下面一块浅绿细框“AI 工具这一块只有它在备”：三行工具小条（Codex、Antigravity、OpenCode，各配一个小图标），下面一条更浅的细框“迁移与核对依据”，四条编号小字；纸箱下方一个灰色小垃圾桶，旁边是“不进包的”那段字；最下面一条浅黄色提醒条放“包里仍可能有密码和密钥”那段。右栏约 40% 是“微信”：画一个文件夹图标，里面露出数据库圆柱、图片、视频、文件四个小图标，旁边一个被划掉的“缓存”小篮子，下面是微信那段字。",
   "portrait": "竖版：标题；先“开发配置包”：纸箱插画缩小放在上面，五条内容一行一条往下排，接着“AI 工具这一块只有它在备”三行和“迁移与核对依据”四条，再接“不进包的”、黄色提醒条；再往下是“微信”：文件夹插画和那段字。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "备份里有什么，没有什么"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "medium",
     "text_ref": "开发配置包（现行清单：70个来源）"
    },
    {
     "type": "bullet_list",
     "columns": 1,
     "text_ref": "用户目录19个文件夹：Claude、Codex、Antigravity、Curs",
     "row": "lone-ill-2",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "lone-ill-2",
     "width": "40%"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "AI工具这一块只有它在备"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "不进包的缓存、插件本体、node_modules、日志、浏览器Cookie和历史"
    },
    {
     "type": "notice",
     "tone": "yellow",
     "text_ref": "包里仍可能有密码和密钥（Wi-Fi配置、GPG钥匙、Xshell会话、AI工具的"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "medium",
     "text_ref": "微信",
     "row": "balanced-heading",
     "width": "88%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 1,
     "target_width": "100%",
     "align": "center",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "prose",
     "text_ref": "E:\\Documents\\xwechat_files整个原样复制：数据库连同它的"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n开发配置五条需排到打开纸箱的分层标签旁，右栏微信文件夹需数据库/图片/视频/文件及划掉缓存组合图；现有 bullet_list 与 illustration 没有逐标签覆盖布局接口，先保留明确 60:40 文字栏和对应插画位。\n灰垃圾桶图标、五标签与微信目录图标未有经核对的语义映射。黄色/灰色 notice 当前沿批准浅绿视觉，原源构图指定的黄色提醒与灰色说明须样张裁定。\n清单未登记这些完整原文的逐字一致毛笔标题图：备份里有什么，没有什么、开发配置包（现行清单：70个来源）；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 illustration 仅 1 项，文字盘点需要 2 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
   "unsupported_requirements": [
    "开发配置五条需排到打开纸箱的分层标签旁，右栏微信文件夹需数据库/图片/视频/文件及划掉缓存组合图；现有 bullet_list 与 illustration 没有逐标签覆盖布局接口，先保留明确 60:40 文字栏和对应插画位。",
    "灰垃圾桶图标、五标签与微信目录图标未有经核对的语义映射。黄色/灰色 notice 当前沿批准浅绿视觉，原源构图指定的黄色提醒与灰色说明须样张裁定。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：备份里有什么，没有什么、开发配置包（现行清单：70个来源）；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 illustration 仅 1 项，文字盘点需要 2 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1,
     "icon": 1,
     "title": 1
    },
    "inventory_illustration_slots": 2,
    "inventory_icon_slots": 1,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "comparison",
    "tag",
    "notice",
    "icon",
    "bullet_list",
    "content_card",
    "illustration",
    "inline_link",
    "prose"
   ],
   "portrait_component_order": [
    "illustration",
    "prose",
    "notice",
    "chapter_title",
    "comparison",
    "tag",
    "icon",
    "bullet_list",
    "content_card",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左右两栏。左栏约 60% 是“开发配置包”：画一个打开的水彩纸箱，箱里分层插着五张标签卡（用户目录、AppData、Scoop、系统、换机清单），每张卡旁边是对应那一条字；五张标签卡下面一块浅绿细框“AI 工具这一块只有它在备”：三行工具小条（Codex、Antigravity、OpenCode，各配一个小图标），下面一条更浅的细框“迁移与核对依据”，四条编号小字；纸箱下方一个灰色小垃圾桶，旁边是“不进包的”那段字；最下面一条浅黄色提醒条放“包里仍可能有密码和密钥”那段。右栏约 40% 是“微信”：画一个文件夹图标，里面露出数据库圆柱、图片、视频、文件四个小图标，旁边一个被划掉的“缓存”小篮子，下面是微信那段字。",
    "portrait": "竖版：标题；先“开发配置包”：纸箱插画缩小放在上面，五条内容一行一条往下排，接着“AI 工具这一块只有它在备”三行和“迁移与核对依据”四条，再接“不进包的”、黄色提醒条；再往下是“微信”：文件夹插画和那段字。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左右两栏。左栏约 60% 是“开发配置包”：画一个打开的水彩纸箱，箱里分层插着五张标签卡（用户目录、AppData、Scoop、系统、换机清单），每张卡旁边是对应那一条字；五张标签卡下面一块浅绿细框“AI 工具这一块只有它在备”：三行工具小条（Codex、Antigravity、OpenCode，各配一个小图标），下面一条更浅的细框“迁移与核对依据”，四条编号小字；纸箱下方一个灰色小垃圾桶，旁边是“不进包的”那段字；最下面一条浅黄色提醒条放“包里仍可能有密码和密钥”那段。右栏约 40% 是“微信”：画一个文件夹图标，里面露出数据库圆柱、图片、视频、文件四个小图标，旁边一个被划掉的“缓存”小篮子，下面是微信那段字。",
   "portrait": "竖版：标题；先“开发配置包”：纸箱插画缩小放在上面，五条内容一行一条往下排，接着“AI 工具这一块只有它在备”三行和“迁移与核对依据”四条，再接“不进包的”、黄色提醒条；再往下是“微信”：文件夹插画和那段字。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "备份里有什么，没有什么"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "medium",
     "text_ref": "开发配置包（现行清单：70个来源）"
    },
    {
     "type": "illustration",
     "index": 0,
     "target_width": 360,
     "align": "center"
    },
    {
     "type": "bullet_list",
     "columns": 1,
     "text_ref": "用户目录19个文件夹：Claude、Codex、Antigravity、Curs"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "AI工具这一块只有它在备"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "不进包的缓存、插件本体、node_modules、日志、浏览器Cookie和历史"
    },
    {
     "type": "notice",
     "tone": "yellow",
     "text_ref": "包里仍可能有密码和密钥（Wi-Fi配置、GPG钥匙、Xshell会话、AI工具的"
    },
    {
     "type": "chapter_title",
     "align": "left",
     "size": "medium",
     "text_ref": "微信"
    },
    {
     "type": "illustration",
     "index": 1,
     "target_width": "60%",
     "align": "center"
    },
    {
     "type": "prose",
     "text_ref": "E:\\Documents\\xwechat_files整个原样复制：数据库连同它的"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n开发配置五条需排到打开纸箱的分层标签旁，右栏微信文件夹需数据库/图片/视频/文件及划掉缓存组合图；现有 bullet_list 与 illustration 没有逐标签覆盖布局接口，先保留明确 60:40 文字栏和对应插画位。\n灰垃圾桶图标、五标签与微信目录图标未有经核对的语义映射。黄色/灰色 notice 当前沿批准浅绿视觉，原源构图指定的黄色提醒与灰色说明须样张裁定。\n清单未登记这些完整原文的逐字一致毛笔标题图：备份里有什么，没有什么、开发配置包（现行清单：70个来源）；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 illustration 仅 1 项，文字盘点需要 2 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
   "unsupported_requirements": [
    "开发配置五条需排到打开纸箱的分层标签旁，右栏微信文件夹需数据库/图片/视频/文件及划掉缓存组合图；现有 bullet_list 与 illustration 没有逐标签覆盖布局接口，先保留明确 60:40 文字栏和对应插画位。",
    "灰垃圾桶图标、五标签与微信目录图标未有经核对的语义映射。黄色/灰色 notice 当前沿批准浅绿视觉，原源构图指定的黄色提醒与灰色说明须样张裁定。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：备份里有什么，没有什么、开发配置包（现行清单：70个来源）；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 illustration 仅 1 项，文字盘点需要 2 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1,
     "icon": 1,
     "title": 1
    },
    "inventory_illustration_slots": 2,
    "inventory_icon_slots": 1,
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "用户目录　19 个文件夹：Claude、Codex、Antigravity、Cursor、Cline、Copilot、OpenCode 等 AI 和编程工具的设置，GPG、Docker 上下文；17 个单文件：Git、npm、conda、WSL、WakaTime、Claude 的设置等",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/开发配置包纸箱五文件.png",
   "fallback": false,
   "semantic_status": "remaining_request_subject_reuse",
   "key": "开发配置包纸箱五文件",
   "source_phrase": "左栏约 60% 是“开发配置包”：画一个打开的水彩纸箱，箱里分层插着五张标签卡（用户目录、AppData、Scoop、系统、换机清单），每张卡旁边是对应那一条字；纸箱下方一个灰色小垃圾桶，旁边是“不进包的”那段字；最下面一条浅黄色提醒条放“包里仍可能有密码和密钥”那段。",
   "sha256": "ced1bd3dccfbe5ec4d7c3b064a258e0d3ab3ea0c13492e8311696dcc67eda12c",
   "status": "ready",
   "original_elements": [
    "打开的水彩纸箱，箱里分层插着五张卡片，纸箱下方灰色小垃圾桶"
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
   "asset": "_library/round3/clean-assets/png/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文件收纳现图小槽4比3",
   "source_phrase": "右栏约 40% 是“微信”：画一个文件夹图标，里面露出数据库圆柱、图片、视频、文件四个小图标，旁边一个被划掉的“缓存”小篮子，下面是微信那段字。",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready",
   "original_elements": [
    "文件夹里露出数据库圆柱、图片、视频、文件四类小图形，旁边被划掉的缓存小篮子"
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
   "asset": "_library/titles/title-c9ab9cfaf82902ec1e40.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c9ab9cfaf82902ec1e40",
   "title_text": "备份里有什么，没有什么",
   "sha256": "03b81e5571986e7aa2ff3a7c0ecc7652f67dba4cca97fffa7e2daa9fa2744acf",
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
   "asset": "_library/titles/title-fc3d57642e8ceb3b7d1a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fc3d57642e8ceb3b7d1a",
   "title_text": "开发配置包（9 月 29 日凌晨起的清单：66 个来源）",
   "sha256": "5f394634e34f0299b9e73df83afb2fb0c7f80ab905ea88b3ca7030d14d7161ba",
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
   "asset": "_library/round3/titles/title-r3-81b430b69643518018b5.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-devconfig-backup-03-v3.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-81b430b69643518018b5",
   "title_text": "微信",
   "sha256": "2a549ad47445ad52c8f52ff5061ed74d50ff0f4bbab240d3431a10d60e72bc02",
   "status": "ready",
   "source_box": [
    70,
    1129,
    268,
    1258
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 备份里有什么，没有什么

## 开发配置包（现行清单：70 个来源）

- **用户目录**　19 个文件夹：Claude、Codex、Antigravity、Cursor、Cline、Copilot、OpenCode 等 AI 和编程工具的设置，GPG、Docker 上下文；17 个单文件：Git、npm、conda、WSL、WakaTime、Claude 的设置等
- **AppData 里 33 项**　VS Code、Cursor、JetBrains、Typora、Apifox、OBS、PowerToys、Windows Terminal、代理程序、SignalRGB、GitHub CLI、Docker Desktop、OpenCode 桌面版、PixPin、FinalShell，还有自己装的字体
- **Scoop**　用 Scoop 装的软件各自的设置
- **系统**　用户和系统环境变量、系统 PATH、hosts、Wi-Fi 配置、Xshell 会话、按名字挑出的 16 个计划任务的定义（其中 8 个停用）
- **换机清单**　已装软件表、winget 和 Scoop 清单、VS Code 和 Cursor 扩展、JetBrains 插件，以及选的是哪个云盘账号

**AI 工具这一块只有它在备**

- **Codex**　带配置和记忆；记忆开关虽关着，旧的 84 个记忆文件照备。
- **Antigravity**　带设置；命令行版照带设置、MCP 连接和登录文件。不带对话、标注和知识（9 月 29 日起）。
- **OpenCode**　带设置。

**迁移与核对依据**
1. 9 月 28 日晚起，这三样统一由这里备；原来 Codex、Gemini 各自的记忆备份已停。
2. 统一时顺带补回了被通用排除规则误挡的文件：Codex 记忆里 45 个扩展笔记、Antigravity 的状态文件和项目、插件登记、OpenCode 的 1 个自定义插件。
3. 已冻结的 OpenClaw 不再带，旧包到期自然删掉。
4. 10 月 3 日修复后的当前包已核对清单：该带的配置和记忆都在，该排除的对话与附件均未混入。

清单里本机没装的（例如 conda 设置、Docker MCP 的 3 个文件）记为“没装”，不算失败；但 Codex、Claude、Antigravity、OpenCode 这几个必需的配置目录缺了，整次报出缺的是哪个，不当成“没装”。9 月 28 日 12:05 那份还是旧清单：10,498 个文件、压缩前 1.92 GiB，其中 911 个是 OpenClaw 的。

**不进包的**　缓存、插件本体、node_modules、日志、浏览器 Cookie 和历史；.env、auth.json、client_secret.json 这几种登录凭据文件（由〔密码中心〕单独恢复；Claude、Antigravity 自己的登录文件照原样带着）；各 AI 工具的对话历史（Codex 对话另有专门的快照备份，9 月 29 日起它的附件、听写记录、生成的图片和对话备份文件夹也不再进包，Codex 对话不上云盘；Claude 只备配置，对话和记忆都不备）。

**包里仍可能有密码和密钥**（Wi-Fi 配置、GPG 钥匙、Xshell 会话、AI 工具的登录文件），所以包只放本机、G、H 和私人云盘；公开仓库里只有脚本。

## 微信

E:\Documents\xwechat_files 整个原样复制：数据库连同它的 WAL、SHM 伴随文件（少了它们，最近的消息可能对不上）、图片、视频和文件；只去掉 7 类缓存和临时目录（缓存、临时文件、小程序运行环境、性能记录、崩溃记录、临时传输文件、推荐封面）。只复制，不打开数据库、不解密、不看内容。

::screen{#devconfig-backup-04 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-04",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版：左边约 60% 是“电脑坏了或重装”的四步竖向流程：每步一个圆形编号、左边一个小水彩图标（1 工具箱、2 纸箱和放大镜、3 微信气泡和手、4 云），步骤之间向下的细绿箭头。右边约 40% 上下两张卡：上卡“备份失败了”画一盏黄色小灯和一个窗口小图；下卡“还没真做过的”画一个空白的勾选框。",
  "portrait": "竖版：标题；四步流程从上到下、满宽；下面“备份失败了”“还没真做过的”两张卡片上下排、满宽。",
  "links": [
   {
    "text": "电脑配置与恢复的换机指南",
    "href": "/projects/pcconfig/#pcconfig-07"
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "numbered_steps",
    "flow",
    "icon",
    "content_card",
    "inline_link"
   ],
   "portrait_component_order": [
    "numbered_steps",
    "flow",
    "content_card",
    "chapter_title",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左边约 60% 是“电脑坏了或重装”的四步竖向流程：每步一个圆形编号、左边一个小水彩图标（1 工具箱、2 纸箱和放大镜、3 微信气泡和手、4 云），步骤之间向下的细绿箭头。右边约 40% 上下两张卡：上卡“备份失败了”画一盏黄色小灯和一个窗口小图；下卡“还没真做过的”画一个空白的勾选框。",
    "portrait": "竖版：标题；四步流程从上到下、满宽；下面“备份失败了”“还没真做过的”两张卡片上下排、满宽。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左边约 60% 是“电脑坏了或重装”的四步竖向流程：每步一个圆形编号、左边一个小水彩图标（1 工具箱、2 纸箱和放大镜、3 微信气泡和手、4 云），步骤之间向下的细绿箭头。右边约 40% 上下两张卡：上卡“备份失败了”画一盏黄色小灯和一个窗口小图；下卡“还没真做过的”画一个空白的勾选框。",
   "portrait": "竖版：标题；四步流程从上到下、满宽；下面“备份失败了”“还没真做过的”两张卡片上下排、满宽。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "电脑坏了或重装"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1先装好基础工具照电脑配置与恢复的换机指南装PowerShell、Git、7-Z"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "备份失败了"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "还没真做过的"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n右侧两卡需黄色小灯/窗口、空勾选框卡头图；points_card 必须有 header_left 和明确 header_icon 才出图，当前没有语义核对结果，未用 auto 假装已映射。\n清单未登记这些完整原文的逐字一致毛笔标题图：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "右侧两卡需黄色小灯/窗口、空勾选框卡头图；points_card 必须有 header_left 和明确 header_icon 才出图，当前没有语义核对结果，未用 auto 假装已映射。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 3
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "numbered_steps",
    "flow",
    "icon",
    "content_card",
    "inline_link"
   ],
   "portrait_component_order": [
    "numbered_steps",
    "flow",
    "content_card",
    "chapter_title",
    "icon",
    "inline_link"
   ],
   "source_layout": {
    "desktop": "横版：左边约 60% 是“电脑坏了或重装”的四步竖向流程：每步一个圆形编号、左边一个小水彩图标（1 工具箱、2 纸箱和放大镜、3 微信气泡和手、4 云），步骤之间向下的细绿箭头。右边约 40% 上下两张卡：上卡“备份失败了”画一盏黄色小灯和一个窗口小图；下卡“还没真做过的”画一个空白的勾选框。",
    "portrait": "竖版：标题；四步流程从上到下、满宽；下面“备份失败了”“还没真做过的”两张卡片上下排、满宽。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左边约 60% 是“电脑坏了或重装”的四步竖向流程：每步一个圆形编号、左边一个小水彩图标（1 工具箱、2 纸箱和放大镜、3 微信气泡和手、4 云），步骤之间向下的细绿箭头。右边约 40% 上下两张卡：上卡“备份失败了”画一盏黄色小灯和一个窗口小图；下卡“还没真做过的”画一个空白的勾选框。",
   "portrait": "竖版：标题；四步流程从上到下、满宽；下面“备份失败了”“还没真做过的”两张卡片上下排、满宽。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "电脑坏了或重装"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1先装好基础工具照电脑配置与恢复的换机指南装PowerShell、Git、7-Z"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "备份失败了"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "还没真做过的"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n右侧两卡需黄色小灯/窗口、空勾选框卡头图；points_card 必须有 header_left 和明确 header_icon 才出图，当前没有语义核对结果，未用 auto 假装已映射。\n清单未登记这些完整原文的逐字一致毛笔标题图：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "右侧两卡需黄色小灯/窗口、空勾选框卡头图；points_card 必须有 header_left 和明确 header_icon 才出图，当前没有语义核对结果，未用 auto 假装已映射。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：出事怎么办；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 0 项，文字盘点预算 6 个图标位；差 6 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 3
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
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "工具箱",
   "source_phrase": "工具箱",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "纸箱和放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "微信标志",
   "source_phrase": "微信气泡和手",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "云",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
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
   "asset": "devconfig-backup/devconfig-backup-04-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-63c7e5ee5827e9cd126c",
   "title_text": "电脑坏了或重装",
   "sha256": "c10cb5d24c7dfb763edc1cee1a77b39c6bb2719d1f2d24b47335204a9f87ca4f",
   "status": "ready",
   "source_box": [
    50,
    130,
    384,
    218
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "devconfig-backup/devconfig-backup-04-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-493ad3760ba7535666d5",
   "title_text": "备份失败了",
   "sha256": "be24944b9e8a14c38b67bbfd93be7919ad1bcac59f00249690fe1e377b1b0c7e",
   "status": "ready",
   "source_box": [
    1035,
    127,
    1278,
    222
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "devconfig-backup/devconfig-backup-04-title-04.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-38c57e193305946b5145",
   "title_text": "还没真做过的",
   "sha256": "e6c5ea3985a8ea293977e0c57a870d3ccd102528679d477a6b90c04c10d7289a",
   "status": "ready",
   "source_box": [
    1036,
    570,
    1337,
    663
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 出事怎么办

## 电脑坏了或重装

1. **先装好基础工具**　照〔电脑配置与恢复的换机指南〕装 PowerShell、Git、7-Zip，登录 GitHub。
2. **拿回开发配置**　跟 AI 说“恢复开发配置”。它先只读地核对包：大小、SHA-256、清单三样都对上才往下走；你同意后解到一个单独的文件夹，再逐个文件核对。它不自动导入注册表、不覆盖正在用的软件设置、不恢复登录状态；把文件放回各软件的实际位置照换机指南做（新用户名、盘符变了要重新对应）。
3. **放回微信**　先自己关掉微信，AI 把 G（或外接盘 H）上的那一份复制回 E:\Documents\xwechat_files。原来的文件夹不删，改名留着当退路；复制失败自动退回。复制完只算“文件到位”，要你自己打开微信、确认账号和聊天记录都在，才算恢复好；确认前备份和退路都留着。
4. **G 和外接盘都没了**　从 Google 云盘取回：配置包连同它的清单和回执下载回来再照第 2 步；微信那一份用同一套程序直接从云端取回并比对。

## 备份失败了

驾驶舱会变色；也可以双击仓库里的 Open-BackupStatus.vbs 打开状态面板，或直接问 AI “开发配置备份怎么了”。失败的那次不会覆盖上一个成功的版本，回执里写着停在哪一步、哪个文件出错。

例子：10 月 11 日 12:05 那次，卡在 Codex 的一个状态数据库（home/.codex/state_5.sqlite）。这类正在被写的数据库不直接拷，要先做一份一致的副本，每次限 20 秒，超时会重试；这次还是没做成，整次记为失败，没打新包，“当前包”还指着 10 月 10 日那个。13:00 的上云任务照常跑，回执写的是“沿用已核对过的旧包，上云完成”。所以这天要分开看：配置采集失败了，云盘上那份旧的好包是完好的，只是不含 10 月 10 日之后的改动。

## 还没真做过的

配置包 9 月 18 日真解开核对过一次（8,640 个文件）。微信放回原处、从云端取回都还没真做过；我决定不专门演练恢复。

::screen{#devconfig-backup-05 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-05",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：上下两条横向流水线，每条是一串圆角节点、节点之间细绿箭头，节点左边小水彩图标、右边字。上面一条标“开发配置”（节点：来源→逐个复制→再扫一遍→打包→三道核对→本机→G→云盘）；下面一条标“微信”（节点：卷影快照→复制新一份→整份核对→换上→每周一：查回执→上云）。两条线下面一排三张小卡：“用到的工具”（画 PowerShell、7-Zip、rclone、Google 云盘的小标志）、“回执”（画一张带对勾的小票）、“规模”（画一叠代码纸）。",
  "portrait": "竖版：标题；“开发配置”流水线改成从上到下的竖流程，接着“微信”竖流程；最下面三张小卡上下排、满宽。",
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "flow",
    "icon",
    "content_card",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "flow",
    "content_card",
    "chapter_title",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：上下两条横向流水线，每条是一串圆角节点、节点之间细绿箭头，节点左边小水彩图标、右边字。上面一条标“开发配置”（节点：来源→逐个复制→再扫一遍→打包→三道核对→本机→G→云盘）；下面一条标“微信”（节点：卷影快照→复制新一份→整份核对→换上→每周一：查回执→上云）。两条线下面一排三张小卡：“用到的工具”（画 PowerShell、7-Zip、rclone、Google 云盘的小标志）、“回执”（画一张带对勾的小票）、“规模”（画一叠代码纸）。",
    "portrait": "竖版：标题；“开发配置”流水线改成从上到下的竖流程，接着“微信”竖流程；最下面三张小卡上下排、满宽。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：上下两条横向流水线，每条是一串圆角节点、节点之间细绿箭头，节点左边小水彩图标、右边字。上面一条标“开发配置”（节点：来源→逐个复制→再扫一遍→打包→三道核对→本机→G→云盘）；下面一条标“微信”（节点：卷影快照→复制新一份→整份核对→换上→每周一：查回执→上云）。两条线下面一排三张小卡：“用到的工具”（画 PowerShell、7-Zip、rclone、Google 云盘的小标志）、“回执”（画一张带对勾的小票）、“规模”（画一叠代码纸）。",
   "portrait": "竖版：标题；“开发配置”流水线改成从上到下的竖流程，接着“微信”竖流程；最下面三张小卡上下排、满宽。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "开发配置"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1按清单找来源"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "微信"
    },
    {
     "type": "flow",
     "columns": 4,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1拍快照用Windows卷影快照（VSS）定格E盘那一刻，微信照常写也不影响2复"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "用到的工具PowerShell7（没有就退回5.1）、7-Zip、rclone（"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源横版开发配置流水线要求八个细节点、微信六个细节点，定稿实际是五步/四步两个不可分 steps 节点；现有 flow 每个 step 只成一个节点，本规格保留五步/四步全部原文并记录八/六节点要求，尚无步骤内部拆成子节点的接口。\n工具小卡中多个品牌小标与回执/代码纸分别需要语义图标组，自动候选列表不能证明这些对象已正确。\n清单未登记这些完整原文的逐字一致毛笔标题图：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 4 项，文字盘点预算 17 个图标位；差 13 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "源横版开发配置流水线要求八个细节点、微信六个细节点，定稿实际是五步/四步两个不可分 steps 节点；现有 flow 每个 step 只成一个节点，本规格保留五步/四步全部原文并记录八/六节点要求，尚无步骤内部拆成子节点的接口。",
    "工具小卡中多个品牌小标与回执/代码纸分别需要语义图标组，自动候选列表不能证明这些对象已正确。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 4 项，文字盘点预算 17 个图标位；差 13 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 4
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 17,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "flow",
    "icon",
    "content_card",
    "numbered_steps"
   ],
   "portrait_component_order": [
    "flow",
    "content_card",
    "chapter_title",
    "icon",
    "numbered_steps"
   ],
   "source_layout": {
    "desktop": "横版：上下两条横向流水线，每条是一串圆角节点、节点之间细绿箭头，节点左边小水彩图标、右边字。上面一条标“开发配置”（节点：来源→逐个复制→再扫一遍→打包→三道核对→本机→G→云盘）；下面一条标“微信”（节点：卷影快照→复制新一份→整份核对→换上→每周一：查回执→上云）。两条线下面一排三张小卡：“用到的工具”（画 PowerShell、7-Zip、rclone、Google 云盘的小标志）、“回执”（画一张带对勾的小票）、“规模”（画一叠代码纸）。",
    "portrait": "竖版：标题；“开发配置”流水线改成从上到下的竖流程，接着“微信”竖流程；最下面三张小卡上下排、满宽。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：上下两条横向流水线，每条是一串圆角节点、节点之间细绿箭头，节点左边小水彩图标、右边字。上面一条标“开发配置”（节点：来源→逐个复制→再扫一遍→打包→三道核对→本机→G→云盘）；下面一条标“微信”（节点：卷影快照→复制新一份→整份核对→换上→每周一：查回执→上云）。两条线下面一排三张小卡：“用到的工具”（画 PowerShell、7-Zip、rclone、Google 云盘的小标志）、“回执”（画一张带对勾的小票）、“规模”（画一叠代码纸）。",
   "portrait": "竖版：标题；“开发配置”流水线改成从上到下的竖流程，接着“微信”竖流程；最下面三张小卡上下排、满宽。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "开发配置"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1按清单找来源"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "微信"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1拍快照用Windows卷影快照（VSS）定格E盘那一刻，微信照常写也不影响2复"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "用到的工具PowerShell7（没有就退回5.1）、7-Zip、rclone（"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源横版开发配置流水线要求八个细节点、微信六个细节点，定稿实际是五步/四步两个不可分 steps 节点；现有 flow 每个 step 只成一个节点，本规格保留五步/四步全部原文并记录八/六节点要求，尚无步骤内部拆成子节点的接口。\n工具小卡中多个品牌小标与回执/代码纸分别需要语义图标组，自动候选列表不能证明这些对象已正确。\n清单未登记这些完整原文的逐字一致毛笔标题图：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 4 项，文字盘点预算 17 个图标位；差 13 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "源横版开发配置流水线要求八个细节点、微信六个细节点，定稿实际是五步/四步两个不可分 steps 节点；现有 flow 每个 step 只成一个节点，本规格保留五步/四步全部原文并记录八/六节点要求，尚无步骤内部拆成子节点的接口。",
    "工具小卡中多个品牌小标与回执/代码纸分别需要语义图标组，自动候选列表不能证明这些对象已正确。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：它是怎么搭的；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 4 项，文字盘点预算 17 个图标位；差 13 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 4
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 17,
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "按清单找来源　66 个来源写在一个清单文件里，改备份范围只改它",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "逐个复制　每个文件复制到临时区并算 SHA-256；复制前后大小或时间变了就重来",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "再扫一遍　复制完再看一遍来源：文件名单变了，整次作废；已复制的文件后来又改了，只记个数（9 月 28 日是 0）。所以它是逐个文件核对过的，不是同一瞬间的快照",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "打包、三道核对　7-Zip 打成 zip；7-Zip 自检；包里每个文件和清单逐项对上；算整包 SHA-256",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "发布　本机→G→云盘，每处复制完都比对哈希，最后才把“当前是哪个包”指过去",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "拍快照　用 Windows 卷影快照（VSS）定格 E 盘那一刻，微信照常写也不影响",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "复制新一份　在 G 上旁边建新目录；和上一份一样的文件用硬链接，不重复占空间，所以 42.5 GiB 只用 12 分钟",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
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
   "source_phrase": "整份核对、换上　每个文件的 SHA-256 都对上才换上，上一份留着",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "每周一上云　先查回执，再用 rclone 传，传完两遍比对",
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
   "slot_ordinal": 11,
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
   "slot_ordinal": 12,
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
   "slot_ordinal": 13,
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
   "slot_ordinal": 14,
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
   "slot_ordinal": 15,
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
   "slot_ordinal": 16,
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
   "slot_ordinal": 17,
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
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
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
   "asset": "_library/titles/title-46900c8b69a622112117.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-05-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-46900c8b69a622112117",
   "title_text": "开发配置",
   "sha256": "751a25ec5a47c65f59247bf1b1919e81ba7f457deffcafb7a3c8e3e4c78c8db2",
   "status": "ready",
   "source_box": [
    362,
    182,
    579,
    270
   ],
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-81b430b69643518018b5.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-81b430b69643518018b5",
   "title_text": "微信",
   "sha256": "2a549ad47445ad52c8f52ff5061ed74d50ff0f4bbab240d3431a10d60e72bc02",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 它是怎么搭的

## 开发配置
1. **按清单找来源**　70 个来源写在一个清单文件里，改备份范围只改它
2. **逐个复制**　普通文件复制到临时区并核对 SHA-256；选定的活动 SQLite 数据库先做一致副本，再核对完整性：现在登记的是 home/.codex/*.sqlite 和 FlyingBird 的 database.sqlite；用 Python 标准库开只读事务、走 SQLite 在线备份（online backup）复制，已提交的 WAL 内容也带上，做成功后才排除它旁边的侧文件；完整性检查限 15 秒，宿主等 20 秒没结束就终止自己启动的进程，忙或超时最多试 3 次；还不行就整次失败、保留旧包，不退回直接复制原文件（10 月 3 日起，DevConfig.Sources.ps1、DevConfig.Sqlite.py、docs/recovery.md）。最新成功包里 5 个 SQLite 快照的 integrity_check 都是 ok
3. **再扫一遍**　复制完再看一遍来源：文件名单变了，重新收集整份，最多 3 轮；持续变化才失败；已复制的文件后来又改了，只记个数（9 月 28 日是 0）。所以它是逐个文件核对过的，不是同一瞬间的快照
4. **打包、三道核对**　7-Zip 打成 zip；7-Zip 自检；包里每个文件和清单逐项对上；算整包 SHA-256
5. **发布**　本机→G→云盘，每处复制完都比对哈希，最后才把“当前是哪个包”指过去

## 微信
1. **拍快照**　用 Windows 卷影快照（VSS）定格 E 盘那一刻，微信照常写也不影响
2. **复制新一份**　在 G 上旁边建新目录；和上一份一样的文件用硬链接，不重复占空间，所以 9 月 28 日那次 42.5 GiB 只用了 12 分钟
3. **整份核对、换上**　每个文件的 SHA-256 都对上才换上，上一份留着
4. **每周一上云**　先查回执，再用 rclone 传，传完两遍比对

**用到的工具**　PowerShell 7（没有就退回 5.1）、7-Zip、rclone（接 Google 云盘，限速每秒 4 MB，走电脑当前的代理）、Windows 卷影快照（要管理员权限，只有微信那个任务用最高权限）、计划任务配隐藏启动器，不弹黑窗口；Python（只用标准库，给活动 SQLite 做一致副本）。

**回执**　每次运行写一份：每一步成没成、跳过了哪些文件、出错的是哪个（只写路径，不写内容）。

**规模**　50 个受 Git 管的文件、约 6,000 行，其中 24 个是自检脚本；79 次提交。

**10 月 11 日的状态**（13:33 只读查看，没重跑）　配置：本地 12:06–12:25 失败，failure=backup_sqlite_capture_failed、TimeoutException、阶段 source_capture、文件 home/.codex/state_5.sqlite（DevConfig.Sources.ps1 第 87 行），没发布新包；当前包仍是 devconfig-20261009-231229-9de61253.zip（北京 10 月 10 日 12:12 完成，6,270 个文件）。上云 13:00–13:02 package=verified_existing、drive=complete，传的是这个旧包，回执带 1 个 source_disappeared 警告。微信：G 热备 11:01:58 完成，148,592 个文件、45,972,129,496 字节；云盘最近一次成功是 10 月 5 日（147,560 个文件），本轮没联网重查，不能说云盘和今天的 G 一致。今天 14:15、14:30 的外接盘维护和同步还没到，不算失败。

::screen{#devconfig-backup-06 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：两列三行共六张卡片（最后一行两张），每张卡片左上一个小水彩图标（盾牌、相机、两条分开的路、钥匙、外接硬盘、剪刀），粗体标题一句，下面两三行字。卡片等宽等高、间距一致。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
  "portrait": "竖版：标题；六张卡片一行一张、满宽，左图标右文字。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "icon",
    "monospace",
    "bullet_list"
   ],
   "portrait_component_order": [
    "content_card",
    "chapter_title",
    "icon",
    "monospace",
    "bullet_list"
   ],
   "source_layout": {
    "desktop": "横版：两列三行共六张卡片（最后一行两张），每张卡片左上一个小水彩图标（盾牌、相机、两条分开的路、钥匙、外接硬盘、剪刀），粗体标题一句，下面两三行字。卡片等宽等高、间距一致。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
    "portrait": "竖版：标题；六张卡片一行一张、满宽，左图标右文字。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。"
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
     "左上一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：两列三行共六张卡片（最后一行两张），每张卡片左上一个小水彩图标（盾牌、相机、两条分开的路、钥匙、外接硬盘、剪刀），粗体标题一句，下面两三行字。卡片等宽等高、间距一致。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
   "portrait": "竖版：标题；六张卡片一行一张、满宽，左图标右文字。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "失败不覆盖成功的。新包、新的一份先在旁边做好、核对完才换上；中途失败，上一个好的"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "text_ref": "有单文件警告时先不删旧包。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源图六枚语义图标（盾牌、相机、分开的路、钥匙、外接硬盘、剪刀）需素材核对；本轮未看图，auto 只表示原清单顺序。\n清单未登记这些完整原文的逐字一致毛笔标题图：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 5 项，文字盘点预算 6 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "源图六枚语义图标（盾牌、相机、分开的路、钥匙、外接硬盘、剪刀）需素材核对；本轮未看图，auto 只表示原清单顺序。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 5 项，文字盘点预算 6 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 5
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 6,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "icon",
    "monospace",
    "bullet_list"
   ],
   "portrait_component_order": [
    "content_card",
    "chapter_title",
    "icon",
    "monospace",
    "bullet_list"
   ],
   "source_layout": {
    "desktop": "横版：两列三行共六张卡片（最后一行两张），每张卡片左上一个小水彩图标（盾牌、相机、两条分开的路、钥匙、外接硬盘、剪刀），粗体标题一句，下面两三行字。卡片等宽等高、间距一致。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
    "portrait": "竖版：标题；六张卡片一行一张、满宽，左图标右文字。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。"
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
     "左上一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：两列三行共六张卡片（最后一行两张），每张卡片左上一个小水彩图标（盾牌、相机、两条分开的路、钥匙、外接硬盘、剪刀），粗体标题一句，下面两三行字。卡片等宽等高、间距一致。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
   "portrait": "竖版：标题；六张卡片一行一张、满宽，左图标右文字。卡片下方接两段完整正文：有单文件警告时先不删旧包；活动数据库做不出一致副本就整次失败。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "失败不覆盖成功的。新包、新的一份先在旁边做好、核对完才换上；中途失败，上一个好的"
    },
    {
     "type": "prose",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "text_ref": "有单文件警告时先不删旧包。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源图六枚语义图标（盾牌、相机、分开的路、钥匙、外接硬盘、剪刀）需素材核对；本轮未看图，auto 只表示原清单顺序。\n清单未登记这些完整原文的逐字一致毛笔标题图：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 5 项，文字盘点预算 6 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "源图六枚语义图标（盾牌、相机、分开的路、钥匙、外接硬盘、剪刀）需素材核对；本轮未看图，auto 只表示原清单顺序。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：为什么这样设计；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 5 项，文字盘点预算 6 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 5
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
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盾牌",
   "source_phrase": "盾牌",
   "sha256": "53bd06dc245ab3fd8f472ad56e57f14d775fdac2c8fda524a89513012cafe440",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/07-相机-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "相机",
   "source_phrase": "相机",
   "sha256": "cfd6fd980c8ac0166d1d5e668fa84686c538502efb29a06bdfd9f7a0e0db5f2b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/岔路.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "岔路",
   "source_phrase": "两条分开的路",
   "sha256": "60c8c99a88b19baf8d010994b8a9b34841a6138e79791cbeef9e79686267047a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "钥匙",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
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
   "source_phrase": "外接硬盘",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/剪刀.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "剪刀",
   "source_phrase": "剪刀",
   "sha256": "18efcc5f95ce2b5b8c0939799620a9389dcc063c3e42dff881d10ecacb9d5682",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "按清单找来源　66 个来源写在一个清单文件里，改备份范围只改它",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "数据库",
   "source_phrase": "裂开的数据库圆柱",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
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

# 为什么这样设计

- **失败不覆盖成功的。**　新包、新的一份先在旁边做好、核对完才换上；中途失败，上一个好的原样留着。不这样，一次半截的备份会顶掉唯一完好的那份。
- **上云只传 G 上核对过的那一份，不读正在运行的微信目录。**　微信随时在写，边读边变就核对不上；怎么改成这样的见亮点 1。
- **存 G 和上云分成两个任务。**　断网或代理出问题，只影响上云那一步，本机和 G 照常备份。
- **云盘账号写死，不自动换。**　选定的云盘账号记在一个小文件里；它丢了或坏了就报错。早期版本找不到就退回“第一个能用的账号”，有几个账号时可能传错地方。
- **不直接写外接盘，也不在 E 盘再存一份微信。**　外接盘由电脑配置与恢复统一同步和核对，不让两个程序同时写一块盘；E 盘放的是原件，同一块盘上的副本会跟原件一起坏。
- **单文件异常分开记，来源根读不了就停。**　可选文件被占用或拒绝访问，跳过并标明不完整；被防病毒软件拦截、或扫描后已消失的单文件只记警告，其余继续。来源根不可读、写盘失败或核对不一致，整次失败。
- **有单文件警告时先不删旧包。**　被警告的那个文件不算进这一包的完整性承诺，旧包也先不按“留最近 7 份”清理，免得把还完整的旧副本删掉；恢复时先看清这一包覆盖到哪。默认留 7 份，10 月 11 日看本机和 G 各有 8 个带日期的包，不能把“7”当成现存数（Backup.Common.ps1 发布函数按 file_warnings 决定清不清理）。
- **活动数据库做不出一致副本就整次失败。**　不退回直接复制原文件：边写边拷的数据库可能根本打不开，宁可保留昨天的好包，也不把坏的当新的发布。

::screen{#devconfig-backup-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：三张竖向大卡片并排，每张上部一幅小水彩插画、下部字。卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。卡片等宽，字多的卡片可略高。",
  "portrait": "竖版：标题；三张卡片上下排、满宽，每张插画在上、字在下。",
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "flow",
    "monospace"
   ],
   "portrait_component_order": [
    "content_card",
    "illustration",
    "chapter_title",
    "flow",
    "monospace"
   ],
   "source_layout": {
    "desktop": "横版：三张竖向大卡片并排，每张上部一幅小水彩插画、下部字。卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。卡片等宽，字多的卡片可略高。",
    "portrait": "竖版：标题；三张卡片上下排、满宽，每张插画在上、字在下。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "微信上云：从“核对不上”到 146,300 个文件一次传对。",
     "一个 0 字节的小文件，让配置备份两天多没出新包。",
     "配置包从 2.72 GiB 缩到 0.88 GiB。"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "上部一幅小水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：三张竖向大卡片并排，每张上部一幅小水彩插画、下部字。卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。卡片等宽，字多的卡片可略高。",
   "portrait": "竖版：标题；三张卡片上下排、满宽，每张插画在上、字在下。",
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
      "_library/icons/云图片.png",
      "_library/icons/文件齿轮.png",
      "_library/icons/文件齿轮.png"
     ],
     "text_ref": "微信上云：从“核对不上”到146,300个文件一次传对。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n三张大卡顶部要求较大的微信快照云/零字节锁/大箱变小箱插画，content_card 只领取 icons 小图，不能把单幅 ctx.illustrations 当成三张卡的明确大图。缺逐卡大插画映射和大图尺寸接口。\n资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "三张大卡顶部要求较大的微信快照云/零字节锁/大箱变小箱插画，content_card 只领取 icons 小图，不能把单幅 ctx.illustrations 当成三张卡的明确大图。缺逐卡大插画映射和大图尺寸接口。",
    "资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1,
     "title": 1
    },
    "inventory_illustration_slots": 3,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "flow",
    "monospace"
   ],
   "portrait_component_order": [
    "content_card",
    "illustration",
    "chapter_title",
    "flow",
    "monospace"
   ],
   "source_layout": {
    "desktop": "横版：三张竖向大卡片并排，每张上部一幅小水彩插画、下部字。卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。卡片等宽，字多的卡片可略高。",
    "portrait": "竖版：标题；三张卡片上下排、满宽，每张插画在上、字在下。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "微信上云：从“核对不上”到 146,300 个文件一次传对。",
     "一个 0 字节的小文件，让配置备份两天多没出新包。",
     "配置包从 2.72 GiB 缩到 0.88 GiB。"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "上部一幅小水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：三张竖向大卡片并排，每张上部一幅小水彩插画、下部字。卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。卡片等宽，字多的卡片可略高。",
   "portrait": "竖版：标题；三张卡片上下排、满宽，每张插画在上、字在下。",
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
      "_library/icons/云图片.png",
      "_library/icons/文件齿轮.png",
      "_library/icons/文件齿轮.png"
     ],
     "text_ref": "微信上云：从“核对不上”到146,300个文件一次传对。"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n三张大卡顶部要求较大的微信快照云/零字节锁/大箱变小箱插画，content_card 只领取 icons 小图，不能把单幅 ctx.illustrations 当成三张卡的明确大图。缺逐卡大插画映射和大图尺寸接口。\n资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "三张大卡顶部要求较大的微信快照云/零字节锁/大箱变小箱插画，content_card 只领取 icons 小图，不能把单幅 ctx.illustrations 当成三张卡的明确大图。缺逐卡大插画映射和大图尺寸接口。",
    "资产清单的 illustration 仅 1 项，文字盘点需要 3 个插画位；缺 2 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "illustration": 1,
     "title": 1
    },
    "inventory_illustration_slots": 3,
    "inventory_icon_slots": 0,
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
   "asset": "_library/icons/云图片.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云图片",
   "source_phrase": "微信上云：从“核对不上”到 146,300 个文件一次传对。 \n9月21日那次每周上云，程序直接复制正在运行的微信目录，复制途中微信写了文件，核对不上，整次失败。9月26日凌晨我选了“修好继续上云”，当天就改完：上云前先查G上那一份的回执，48小时内、快照拍的、全部核对过，三样缺一样就不传；传的时候锁住它，当天的备份不能半路换掉。9月28日11:00第一次这样跑，146,300个文件和云端逐个比对一致。",
   "sha256": "57a4f020cb6007e67f4e17abbdd16d6585d8f2182143db3e6268739016385514",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "一个 0 字节的小文件，让配置备份两天多没出新包。 \nClashVerge运行时锁着自己的一个空文件，备份算指纹时读不了，整次作废，回执也不说是哪个文件；9月24日上午到9月26日中午，一个新包都没出成。现在这个文件按精确路径排除，不一刀切排除所有.lock：项目的依赖锁文件（例如package-lock）是配置的一部分，还要备份。",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "配置包从 2.72 GiB 缩到 0.88 GiB。 \n9月26日16:54，一个6GB多的Codex对话数据库在备份算指纹时被Codex改写，整次作废。对话历史本来就不该算“配置”，Codex对话另有专门的快照备份，于是把它移出配置包：下一个包从2.72GiB降到0.88GiB；之后配置慢慢变多，9月28日的包是1.11GiB，每天要存要传的仍少了一半多。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "截图聊天现图小槽4比3",
   "source_phrase": "卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾"
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
   "asset": "_library/illustrations/ill-6e251cbd0a1d06.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-6e251cbd0a1d06",
   "source_phrase": "卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。",
   "sha256": "15747f7df5e2ee49c7bd32234d4c2a8de5a9d5340ad09dab50d8e9aaed156bee",
   "status": "ready",
   "original_elements": [
    "一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上"
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
   "asset": "_library/illustrations/main-devconfig-backup.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "备份纸箱现图小槽4比3",
   "source_phrase": "卡片 1：一只微信气泡被相机快门定格，旁边一朵云上一个绿色对勾；卡片 2：一个很小的 0 字节文件被一把挂锁锁住，旁边一个纸箱卡在传送带上；卡片 3：一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头。",
   "sha256": "02c93e4d5401230db278ed1e08517748a918e05e838da9d22eac7d1af121ec36",
   "status": "ready",
   "original_elements": [
    "一个大纸箱变成一个小一圈的纸箱，中间一个向下的绿箭头"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    28,
    0,
    297,
    218
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 亮点

**微信上云：从“核对不上”到 146,300 个文件一次传对。**
9 月 21 日那次每周上云，程序直接复制正在运行的微信目录，复制途中微信写了文件，核对不上，整次失败。9 月 26 日凌晨我选了“修好继续上云”，当天就改完：上云前先查 G 上那一份的回执，48 小时内、快照拍的、全部核对过，三样缺一样就不传；传的时候锁住它，当天的备份不能半路换掉。9 月 28 日 11:00 第一次这样跑，146,300 个文件和云端逐个比对一致。

**一个 0 字节的小文件，让配置备份两天多没出新包。**
代理程序 运行时锁着自己的一个空文件，备份算指纹时读不了，整次作废，回执也不说是哪个文件；9 月 24 日上午到 9 月 26 日中午，一个新包都没出成。现在这个文件按精确路径排除，不一刀切排除所有 .lock：项目的依赖锁文件（例如 package-lock）是配置的一部分，还要备份。

**配置包从 2.72 GiB 缩到 0.88 GiB。**
9 月 26 日 16:54，一个 6 GB 多的 Codex 对话数据库在备份算指纹时被 Codex 改写，整次作废。对话历史本来就不该算“配置”，Codex 对话另有专门的快照备份，于是把它移出配置包：下一个包从 2.72 GiB 降到 0.88 GiB；之后配置慢慢变多，9 月 28 日的包是 1.11 GiB，每天要存要传的仍少了一半多。

::screen{#devconfig-backup-08 section="features"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：“全部功能”的第 1 张，顶上大标题和一行图例（图例画成六个圆点加文字）。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏只有“开发配置备份”一组 10 张卡片。",
  "portrait": "竖版：大标题和图例在最上面（图例排成两行三个）；竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。",
  "links": [],
  "anchors": [
   {
    "id": "g-config",
    "text": "开发配置备份"
   },
   {
    "id": "f-config-sources",
    "text": "按清单收集配置"
   },
   {
    "id": "f-system-export",
    "text": "系统设置和换机清单"
   },
   {
    "id": "f-locked-skip",
    "text": "可选来源的单个文件可跳过"
   },
   {
    "id": "f-package-check",
    "text": "打包后三道核对"
   },
   {
    "id": "f-content-reuse",
    "text": "内容没变不重打包"
   },
   {
    "id": "f-config-hot",
    "text": "每天存到 G 盘"
   },
   {
    "id": "f-config-cloud",
    "text": "每天传 Google 云盘"
   },
   {
    "id": "f-config-plan",
    "text": "先预演再备份"
   },
   {
    "id": "f-include-history",
    "text": "连对话历史一起备"
   },
   {
    "id": "f-ai-tool-scope",
    "text": "AI 工具配置和记忆"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
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
   ],
   "source_layout": {
    "desktop": "横版：“全部功能”的第 1 张，顶上大标题和一行图例（图例画成六个圆点加文字）。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏只有“开发配置备份”一组 10 张卡片。",
    "portrait": "竖版：大标题和图例在最上面（图例排成两行三个）；竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "开发配置备份"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩",
     "左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：“全部功能”的第 1 张，顶上大标题和一行图例（图例画成六个圆点加文字）。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏只有“开发配置备份”一组 10 张卡片。",
   "portrait": "竖版：大标题和图例在最上面（图例排成两行三个）；竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（23项）"
    },
    {
     "type": "status_legend",
     "columns": 6,
     "portrait_columns": 3,
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "开发配置备份"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "按清单收集配置",
     "item_spans": {
      "10": 3
     },
     "fill_last_row": true
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿本屏是 10 个功能条目（编号 1–10），scene 末句仍写‘9 张’；按定稿完整保留十项，不删第 10 项。\nfeature_status._status 不能识别正文尾部 〈状态〉，本屏十张卡状态均未识别；源图要求仅状态圆点，当前必须保留原状态文字以守逐字关。需要由主工程明确状态文本计入 G1 的圆点接口。\n组名横条要求左侧语义小图和下方浅绿细线，现 chapter_title 的 small 字段未消费且没有组头图标接口。\n清单未登记这些完整原文的逐字一致毛笔标题图：全部功能（23项）、开发配置备份；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 2 项，文字盘点预算 10 个图标位；差 8 个候选位（预算为盘点估计，不作已核实语义结论）。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。",
   "unsupported_requirements": [
    "定稿本屏是 10 个功能条目（编号 1–10），scene 末句仍写‘9 张’；按定稿完整保留十项，不删第 10 项。",
    "feature_status._status 不能识别正文尾部 〈状态〉，本屏十张卡状态均未识别；源图要求仅状态圆点，当前必须保留原状态文字以守逐字关。需要由主工程明确状态文本计入 G1 的圆点接口。",
    "组名横条要求左侧语义小图和下方浅绿细线，现 chapter_title 的 small 字段未消费且没有组头图标接口。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：全部功能（23项）、开发配置备份；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 2 项，文字盘点预算 10 个图标位；差 8 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 2
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 10,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
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
   ],
   "source_layout": {
    "desktop": "横版：“全部功能”的第 1 张，顶上大标题和一行图例（图例画成六个圆点加文字）。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏只有“开发配置备份”一组 10 张卡片。",
    "portrait": "竖版：大标题和图例在最上面（图例排成两行三个）；竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "开发配置备份"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩",
     "左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：“全部功能”的第 1 张，顶上大标题和一行图例（图例画成六个圆点加文字）。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏只有“开发配置备份”一组 10 张卡片。",
   "portrait": "竖版：大标题和图例在最上面（图例排成两行三个）；竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（23项）"
    },
    {
     "type": "status_legend",
     "columns": 6,
     "portrait_columns": 3,
     "text_ref": "●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "开发配置备份"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "按清单收集配置"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n定稿本屏是 10 个功能条目（编号 1–10），scene 末句仍写‘9 张’；按定稿完整保留十项，不删第 10 项。\nfeature_status._status 不能识别正文尾部 〈状态〉，本屏十张卡状态均未识别；源图要求仅状态圆点，当前必须保留原状态文字以守逐字关。需要由主工程明确状态文本计入 G1 的圆点接口。\n组名横条要求左侧语义小图和下方浅绿细线，现 chapter_title 的 small 字段未消费且没有组头图标接口。\n清单未登记这些完整原文的逐字一致毛笔标题图：全部功能（23项）、开发配置备份；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 2 项，文字盘点预算 10 个图标位；差 8 个候选位（预算为盘点估计，不作已核实语义结论）。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
   "unsupported_requirements": [
    "定稿本屏是 10 个功能条目（编号 1–10），scene 末句仍写‘9 张’；按定稿完整保留十项，不删第 10 项。",
    "feature_status._status 不能识别正文尾部 〈状态〉，本屏十张卡状态均未识别；源图要求仅状态圆点，当前必须保留原状态文字以守逐字关。需要由主工程明确状态文本计入 G1 的圆点接口。",
    "组名横条要求左侧语义小图和下方浅绿细线，现 chapter_title 的 small 字段未消费且没有组头图标接口。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：全部功能（23项）、开发配置备份；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 2 项，文字盘点预算 10 个图标位；差 8 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 2
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 10,
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "开发配置备份",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "按清单收集配置　66 个来源：用户目录 19 个文件夹、17 个单文件，AppData 29 项，Scoop 软件设置；去掉缓存、插件、日志、对话历史和登录凭据文件；本机没装的记为“没装”，不算失败，必需的 AI 配置目录缺了明确报缺口　〈在用〉",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "系统设置和换机清单　顺带导出环境变量、系统 PATH、hosts、Wi-Fi 配置、Xshell 会话、按名字挑出的 16 个计划任务的定义（其中 8 个停用），以及已装软件表、winget 和 Scoop 清单、VS Code 和 Cursor 扩展、JetBrains 插件　〈在用〉",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "可选来源的单个文件可跳过　可选来源的单文件被占用，试 3 次后跳过；拒绝访问直接跳过，都写进回执，不报“完整”；必需来源读不了或有其他读取错误，就整次失败　〈待验收〉",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "打包后三道核对　7-Zip 自检、包里每个文件和清单逐项对上、算整包 SHA-256；有一道不过就不发布，上一个好包原样留着　〈在用〉",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "内容没变不重打包　和上一个包的内容指纹一样，就直接用上一个，也不重复上传云盘　〈说不准〉",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
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
   "source_phrase": "每天存到 G 盘　每天 12:05 和开机登录后 20 分钟，本机和 G 各存一份，各留最近 7 份　〈在用〉",
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
   "source_phrase": "每天传 Google 云盘　13:00 有网才跑，限速每秒 4 MB；传完和本机逐个比对，云端留最近 3 份　〈在用〉",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "先预演再备份　只列出这次会备份哪些、比上次多了几个、改了几个、少了几个，一个字节都不写　〈说不准〉",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "开关",
   "source_phrase": "连对话历史一起备　打开一个开关，把默认排除的各 AI 工具对话历史也打进包；自动任务不开　〈说不准〉",
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
   "asset": "_library/titles/title-8ce8796469dd3341e2bd.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8ce8796469dd3341e2bd",
   "title_text": "全部功能（23 项）",
   "sha256": "89fc362f96d4c1d70b0e830cea81dbabb001b4c22adeef174b779bedc145ab87",
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
   "asset": "devconfig-backup/devconfig-backup-01-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ec96df61bbe2956d4ebe",
   "title_text": "开发配置备份",
   "sha256": "8565fe8b060182353e0d8bdc500ae0740f956619eee0473740ae2204e391022d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（23 项）
● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**开发配置备份**
1. **按清单收集配置**　70 个来源：用户目录 19 个文件夹、17 个单文件，AppData 33 项，Scoop 软件设置；去掉缓存、插件、日志、对话历史和登录凭据文件；本机没装的记为“没装”，不算失败，必需的 AI 配置目录缺了明确报缺口　〈在用〉
2. **系统设置和换机清单**　顺带导出环境变量、系统 PATH、hosts、Wi-Fi 配置、Xshell 会话、按名字挑出的 16 个计划任务的定义（其中 8 个停用），以及已装软件表、winget 和 Scoop 清单、VS Code 和 Cursor 扩展、JetBrains 插件　〈在用〉
3. **可选来源的单个文件可跳过**　可选来源的单文件被占用，试 3 次后跳过；拒绝访问直接跳过，都写进回执，不报“完整”；必需来源读不了或有其他读取错误，就整次失败　〈待验收〉
4. **打包后三道核对**　7-Zip 自检、包里每个文件和清单逐项对上、算整包 SHA-256；有一道不过就不发布，上一个好包原样留着　〈在用〉
5. **内容没变不重打包**　和上一个包的内容指纹一样，就直接用上一个，也不重复上传云盘　〈说不准〉
6. **每天存到 G 盘**　每天 12:05 和开机登录后 20 分钟，本机和 G 各存一份，各留最近 7 份；有单文件警告时暂缓清理，10 月 11 日两处各有 8 个　〈在用〉
7. **每天传 Google 云盘**　13:00 有网才跑，限速每秒 4 MB；传完和本机逐个比对；云端默认留最近 3 份，这一包带单文件警告时云端也先不删旧包，云上现在存着几份之后没有联网核对　〈在用〉
8. **先预演再备份**　只列出这次会备份哪些、比上次多了几个、改了几个、少了几个，一个字节都不写　〈说不准〉
9. **连对话历史一起备**　打开一个开关，把默认排除的各 AI 工具对话历史也打进包；自动任务不开　〈说不准〉
10. **AI 工具配置和记忆**　Codex 的配置和记忆、Antigravity 和 OpenCode 的设置只由这里备；9 月 28 日晚补回被误挡的 Codex 记忆扩展笔记等，移出 OpenClaw；9 月 29 日凌晨去掉 Antigravity 命令行版的对话、标注和知识，这几个配置目录缺了会报缺口；当前包已在 10 月 3 日修复后核对，该带的配置与记忆已带上，对话与附件已排除　〈在用〉

::screen{#devconfig-backup-09 section="features"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：“全部功能”的第 2 张，接着上一张画，不再画大标题和图例。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏三组：“微信备份”6 张、“恢复”3 张、“看状态和维护”4 张。",
  "portrait": "竖版：竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。",
  "links": [],
  "anchors": [
   {
    "id": "g-wechat",
    "text": "微信备份"
   },
   {
    "id": "f-wechat-hot",
    "text": "每天快照备份到 G"
   },
   {
    "id": "f-wechat-generation",
    "text": "整份换、留上一份"
   },
   {
    "id": "f-wechat-cloud",
    "text": "每周传 Google 云盘"
   },
   {
    "id": "f-wechat-monitor",
    "text": "云端补传监控"
   },
   {
    "id": "f-wechat-local",
    "text": "E 盘再存一份"
   },
   {
    "id": "f-wechat-dbonly",
    "text": "云端只传数据库"
   },
   {
    "id": "g-restore",
    "text": "恢复"
   },
   {
    "id": "f-config-restore",
    "text": "配置包解到单独文件夹"
   },
   {
    "id": "f-wechat-restore",
    "text": "微信文件放回原处"
   },
   {
    "id": "f-wechat-restore-cloud",
    "text": "从云端取回微信"
   },
   {
    "id": "g-status",
    "text": "看状态和维护"
   },
   {
    "id": "f-receipts",
    "text": "回执"
   },
   {
    "id": "f-status-panel",
    "text": "状态面板"
   },
   {
    "id": "f-task-setup",
    "text": "一键注册自动任务"
   },
   {
    "id": "f-self-tests",
    "text": "自检脚本"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
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
    "desktop": "横版：“全部功能”的第 2 张，接着上一张画，不再画大标题和图例。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏三组：“微信备份”6 张、“恢复”3 张、“看状态和维护”4 张。",
    "portrait": "竖版：竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "微信备份",
     "恢复",
     "看状态和维护"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩",
     "左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：“全部功能”的第 2 张，接着上一张画，不再画大标题和图例。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏三组：“微信备份”6 张、“恢复”3 张、“看状态和维护”4 张。",
   "portrait": "竖版：竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。",
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "微信备份"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "11每天快照备份到G09:30先给E盘拍卷影快照，从快照把微信原始文件复制成G上"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "恢复"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "17配置包解到单独文件夹先只读核对包，你同意后解到单独的文件夹并逐个核对；目标不"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "看状态和维护"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "20回执每次运行写一份：成功、失败、跳过了哪些、出错的是哪个文件（只写路径）；驾"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n接前屏，不新增大标题或图例；三组卡数按定稿分别 6/3/4。\nfeature_status._status 不能识别正文尾部 〈状态〉，13 项状态未识别；源图要求仅圆点，当前保持状态文字，不假报完成。\n三条组名横条要求左侧语义图标及浅绿下沿线，chapter_title.small 和组头图标未实现。\n清单未登记这些完整原文的逐字一致毛笔标题图：微信备份、恢复、看状态和维护；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 3 项，文字盘点预算 13 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
   "unsupported_requirements": [
    "接前屏，不新增大标题或图例；三组卡数按定稿分别 6/3/4。",
    "feature_status._status 不能识别正文尾部 〈状态〉，13 项状态未识别；源图要求仅圆点，当前保持状态文字，不假报完成。",
    "三条组名横条要求左侧语义图标及浅绿下沿线，chapter_title.small 和组头图标未实现。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：微信备份、恢复、看状态和维护；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 3 项，文字盘点预算 13 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 3
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 13,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
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
    "desktop": "横版：“全部功能”的第 2 张，接着上一张画，不再画大标题和图例。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏三组：“微信备份”6 张、“恢复”3 张、“看状态和维护”4 张。",
    "portrait": "竖版：竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "微信备份",
     "恢复",
     "看状态和维护"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边小水彩",
     "左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：“全部功能”的第 2 张，接着上一张画，不再画大标题和图例。和电脑配置与恢复页“全部功能”同样的卡片画法（左边小水彩图标、粗体“编号. 功能名”、下面一句话、右上角一个状态小圆点），组名不单独占左边一整列：每组先画一条横跨整屏的组名横条（左边小水彩图标、毛笔字组名，下沿一条浅绿细线），横条下面是这一组的卡片，排成三列、从左到右再换行；一组画完紧接着下一组。每行末尾〈…〉里是状态，不画成字，画成卡片右上角的圆点：在用＝绿、待验收＝黄、待实施＝空心绿圈、没用过＝灰、说不准＝浅灰、已停用＝灰色叉。卡片高度随字数自适应、同一行等高，间距一致，不留大块空白。本屏三组：“微信备份”6 张、“恢复”3 张、“看状态和维护”4 张。",
   "portrait": "竖版：竖版：每组的组名横条满宽，下面卡片一行一张（左图标、右边粗体标题和一句话、右上角状态圆点），同组卡片连续往下排，组与组之间留一点距离。",
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "微信备份"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "11每天快照备份到G09:30先给E盘拍卷影快照，从快照把微信原始文件复制成G上"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "恢复"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "17配置包解到单独文件夹先只读核对包，你同意后解到单独的文件夹并逐个核对；目标不"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "看状态和维护"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "text_ref": "20回执每次运行写一份：成功、失败、跳过了哪些、出错的是哪个文件（只写路径）；驾"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n接前屏，不新增大标题或图例；三组卡数按定稿分别 6/3/4。\nfeature_status._status 不能识别正文尾部 〈状态〉，13 项状态未识别；源图要求仅圆点，当前保持状态文字，不假报完成。\n三条组名横条要求左侧语义图标及浅绿下沿线，chapter_title.small 和组头图标未实现。\n清单未登记这些完整原文的逐字一致毛笔标题图：微信备份、恢复、看状态和维护；现 core 会用字体兜底，不能称标题素材通过。\ncore.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。\n资产清单的 icon 仅 3 项，文字盘点预算 13 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。",
   "unsupported_requirements": [
    "接前屏，不新增大标题或图例；三组卡数按定稿分别 6/3/4。",
    "feature_status._status 不能识别正文尾部 〈状态〉，13 项状态未识别；源图要求仅圆点，当前保持状态文字，不假报完成。",
    "三条组名横条要求左侧语义图标及浅绿下沿线，chapter_title.small 和组头图标未实现。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：微信备份、恢复、看状态和维护；现 core 会用字体兜底，不能称标题素材通过。",
    "core.chapter_title 未消费 size 档位，规格虽准确标中/小号，实际标题大小须接口补齐后核对。",
    "资产清单的 icon 仅 3 项，文字盘点预算 13 个图标位；差 10 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 3
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 13,
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "微信备份",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "每天快照备份到 G　09:30 先给 E 盘拍卷影快照，从快照把微信原始文件复制成 G 上新的一份，整份逐个核对 SHA-256　〈在用〉",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "整份换、留上一份　新的一份核对完才换上，上一份留着；没变的文件两份共用，不另占空间　〈在用〉",
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
   "asset": "_library/fix-round-2/icon-clean-a86c56270f7fd4b82920.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Google标志",
   "source_phrase": "每周传 Google 云盘　每周一 11:00，只传 G 上核对过的那一份（条件见亮点 1）；每次最多传 8 GB，没传完自动重试；传完两遍比对，G 上没有了的云端也删　〈在用〉",
   "sha256": "b2c5eb25686b4d888e1f384affd927ebef3b0f641d7ce74c9518a02c3933485f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "云端补传监控　每小时看一次云端和 G 对不对得上，缺了就补传，对上了自己停掉；7 月 11 日起一直停着　〈已停用〉",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "E 盘再存一份　程序还能在 E 盘另存一份微信；9 月 26 日决定清掉 E 盘旧副本，自动任务不用　〈已停用〉",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云图片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "云图片",
   "source_phrase": "云端只传数据库　6 月下旬省流量的做法（图片视频走 U 盘）；7 月 8 日改回整份上传后不再用　〈已停用〉",
   "sha256": "57a4f020cb6007e67f4e17abbdd16d6585d8f2182143db3e6268739016385514",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "恢复",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
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
   "source_phrase": "配置包解到单独文件夹　先只读核对包，你同意后解到单独的文件夹并逐个核对；目标不空时原文件夹改名留作退路；包里记着选的是哪个云盘账号，重新登录云盘后手动放回即可　〈在用〉",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "微信文件放回原处　你先关掉微信，从 G 或外接盘复制回去；原文件夹改名留着，失败自动退回；要你自己打开微信确认才算恢复好　〈说不准〉",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "从云端取回微信　G 和外接盘都没了时，从 Google 云盘直接取回并比对　〈说不准〉",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "齿轮",
   "source_phrase": "看状态和维护",
   "sha256": "46704458cae272fc381f5968dbc256759f559eb77fb13322b824065f5b41d2d1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "回执　每次运行写一份：成功、失败、跳过了哪些、出错的是哪个文件（只写路径）；驾驶舱和电脑配置与恢复都读它　〈在用〉",
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
   "asset": "_library/titles/title-a10276ae63bc16c96ec6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a10276ae63bc16c96ec6",
   "title_text": "微信备份",
   "sha256": "87ea880694d127fdffc822bf38b9c960982fa38ab42f49596c6c958724f6c1af",
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
   "asset": "_library/titles/title-e0534b8a4e46a0cb5601.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e0534b8a4e46a0cb5601",
   "title_text": "恢复",
   "sha256": "e8e761101316bab206a3b4951c52688636904578c3bd11244d37577b016819c9",
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
   "asset": "_library/titles/title-0a1984ddf011b1453e0e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0a1984ddf011b1453e0e",
   "title_text": "看状态和维护",
   "sha256": "cdb4eedcc42f1c5bc31fa2f0712e1828cb23191ba0562d78357dba6e63123360",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**微信备份**
11. **每天快照备份到 G**　09:30 先给 E 盘拍卷影快照，从快照把微信原始文件复制成 G 上新的一份，整份逐个核对 SHA-256　〈在用〉
12. **整份换、留上一份**　新的一份核对完才换上，上一份留着；没变的文件两份共用，不另占空间　〈在用〉
13. **每周传 Google 云盘**　每周一 11:00，只传 G 上核对过的那一份（条件见亮点 1）；每次最多传 8 GB，没传完自动重试；传完两遍比对，G 上没有了的云端也删　〈在用〉
14. **云端补传监控**　每小时看一次云端和 G 对不对得上，缺了就补传，对上了自己停掉；7 月 11 日起一直停着　〈已停用〉
15. **E 盘再存一份**　程序还能在 E 盘另存一份微信；9 月 26 日决定清掉 E 盘旧副本，自动任务不用　〈已停用〉
16. **云端只传数据库**　6 月下旬省流量的做法（图片视频走 U 盘）；7 月 8 日改回整份上传后不再用　〈已停用〉

**恢复**
17. **配置包解到单独文件夹**　先只读核对包，你同意后解到单独的文件夹并逐个核对；目标不空时原文件夹改名留作退路；包里记着选的是哪个云盘账号，重新登录云盘后手动放回即可　〈在用〉
18. **微信文件放回原处**　你先关掉微信，从 G 或外接盘复制回去；原文件夹改名留着，失败自动退回；要你自己打开微信确认才算恢复好　〈说不准〉
19. **从云端取回微信**　G 和外接盘都没了时，从 Google 云盘直接取回并比对　〈说不准〉

**看状态和维护**
20. **回执**　每次运行写一份：成功、失败、跳过了哪些、出错的是哪个文件（只写路径）；驾驶舱和电脑配置与恢复都读它　〈在用〉
21. **状态面板**　双击打开一个窗口，每分钟刷新：本机、G、微信各自最近一次成功，各任务上次结果和下次时间　〈说不准〉
22. **一键注册自动任务**　一次注册 4 个任务，逐个回读核对，有一个失败就全部退回原样　〈说不准〉
23. **自检脚本**　24 个自检脚本，都用专属临时目录；含公开仓库防泄漏检查：备份包、密钥文件、日志不能进仓库　〈在用〉

::screen{#devconfig-backup-10 section="history"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：一条从左上往右下蜿蜒的水彩小路，路边依次立着十一个小木牌，每个木牌上一个日期和一句话（就是 text 里的各条）；9 月 21 日那块木牌画成歪倒、旁边一个小红叉，9 月 28 日那块木牌上挂一片新绿叶。路的起点画一个 U 盘，终点画一朵带对勾的云。",
  "portrait": "竖版：标题；小路改成从上到下的竖线，十一条一行一条（左边日期、右边一句话）；起点 U 盘在最上、终点云在最下。",
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "icon",
    "timeline"
   ],
   "portrait_component_order": [
    "chapter_title",
    "icon",
    "timeline"
   ],
   "source_layout": {
    "desktop": "横版：一条从左上往右下蜿蜒的水彩小路，路边依次立着十一个小木牌，每个木牌上一个日期和一句话（就是 text 里的各条）；9 月 21 日那块木牌画成歪倒、旁边一个小红叉，9 月 28 日那块木牌上挂一片新绿叶。路的起点画一个 U 盘，终点画一朵带对勾的云。",
    "portrait": "竖版：标题；小路改成从上到下的竖线，十一条一行一条（左边日期、右边一句话）；起点 U 盘在最上、终点云在最下。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：一条从左上往右下蜿蜒的水彩小路，路边依次立着十一个小木牌，每个木牌上一个日期和一句话（就是 text 里的各条）；9 月 21 日那块木牌画成歪倒、旁边一个小红叉，9 月 28 日那块木牌上挂一片新绿叶。路的起点画一个 U 盘，终点画一朵带对勾的云。",
   "portrait": "竖版：标题；小路改成从上到下的竖线，十一条一行一条（左边日期、右边一句话）；起点 U 盘在最上、终点云在最下。",
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
     "columns": 1,
     "connector": "ribbon",
     "illustration": "none",
     "text_ref": "6月23日建库：开发配置三级备份（本机、U盘、Google云盘），当天加上微信每"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n横版要求从左上到右下蜿蜒水彩小路/十一木牌，不是直线卡片时间线；竖版才用直线。现 timeline 没有蜿蜒路径、木牌底图及九月21日歪牌/红叉、九月28日绿叶、首尾 U盘/云的节点装饰接口，已在 source_layout 原样保留。\n资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "横版要求从左上到右下蜿蜒水彩小路/十一木牌，不是直线卡片时间线；竖版才用直线。现 timeline 没有蜿蜒路径、木牌底图及九月21日歪牌/红叉、九月28日绿叶、首尾 U盘/云的节点装饰接口，已在 source_layout 原样保留。",
    "资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1,
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 2,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\page.json",
   "source_sha256": "ae7e56291cb9303a19c59cf0c4785e6b23cece609f2becb350dd1ac29a7bae40",
   "desktop_component_order": [
    "chapter_title",
    "icon",
    "timeline"
   ],
   "portrait_component_order": [
    "chapter_title",
    "icon",
    "timeline"
   ],
   "source_layout": {
    "desktop": "横版：一条从左上往右下蜿蜒的水彩小路，路边依次立着十一个小木牌，每个木牌上一个日期和一句话（就是 text 里的各条）；9 月 21 日那块木牌画成歪倒、旁边一个小红叉，9 月 28 日那块木牌上挂一片新绿叶。路的起点画一个 U 盘，终点画一朵带对勾的云。",
    "portrait": "竖版：标题；小路改成从上到下的竖线，十一条一行一条（左边日期、右边一句话）；起点 U 盘在最上、终点云在最下。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：一条从左上往右下蜿蜒的水彩小路，路边依次立着十一个小木牌，每个木牌上一个日期和一句话（就是 text 里的各条）；9 月 21 日那块木牌画成歪倒、旁边一个小红叉，9 月 28 日那块木牌上挂一片新绿叶。路的起点画一个 U 盘，终点画一朵带对勾的云。",
   "portrait": "竖版：标题；小路改成从上到下的竖线，十一条一行一条（左边日期、右边一句话）；起点 U 盘在最上、终点云在最下。",
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
     "columns": 1,
     "connector": "ribbon",
     "illustration": "none",
     "text_ref": "6月23日建库：开发配置三级备份（本机、U盘、Google云盘），当天加上微信每"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n横版要求从左上到右下蜿蜒水彩小路/十一木牌，不是直线卡片时间线；竖版才用直线。现 timeline 没有蜿蜒路径、木牌底图及九月21日歪牌/红叉、九月28日绿叶、首尾 U盘/云的节点装饰接口，已在 source_layout 原样保留。\n资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "横版要求从左上到右下蜿蜒水彩小路/十一木牌，不是直线卡片时间线；竖版才用直线。现 timeline 没有蜿蜒路径、木牌底图及九月21日歪牌/红叉、九月28日绿叶、首尾 U盘/云的节点装饰接口，已在 source_layout 原样保留。",
    "资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1,
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 2,
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "6 月 23 日　建库：开发配置三级备份（本机、U 盘、Google 云盘），当天加上微信每周备份",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云图片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "云图片",
   "source_phrase": "6 月 24–28 日　上云加预检和重试；微信上云省流量（只传数据库，图片视频走 U 盘）；改成隐藏窗口启动",
   "sha256": "57a4f020cb6007e67f4e17abbdd16d6585d8f2182143db3e6268739016385514",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "devconfig-backup/devconfig-backup-10-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\devconfig-backup\\img\\devconfig-backup-10-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "0b21217f2f4e7033e8c35aca01c83d5433f77e0d95429c80d9be39704ce3fbdc",
   "status": "ready",
   "source_box": [
    14,
    2,
    251,
    146
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 演进

- **6 月 23 日**　建库：开发配置三级备份（本机、U 盘、Google 云盘），当天加上微信每周备份
- **6 月 24–28 日**　上云加预检和重试；微信上云省流量（只传数据库，图片视频走 U 盘）；改成隐藏窗口启动
- **7 月 6–11 日**　微信上云改回整份增量，加每次上限和每小时补传监控；U 盘那份改到外接盘 H；加 Windows Terminal、Docker、SignalRGB 设置；公开仓库防泄漏检查；微信按校验和核对
- **7 月 23–28 日**　定时备份改走 G 盘，存 G 和上云拆成两个任务，微信改为每天存 G；上云走电脑代理；登录凭据文件改由密码中心单独恢复，不再进包
- **8 月 28 日–9 月 1 日**　微信恢复改成只复制原始文件、要人确认；任务注册失败能整体退回；云端逐个比对；云盘账号坏了就报错，不再退回第一个账号
- **9 月 17–18 日**　加 OBS 设置；大改：每次做出完整核对过的一份，失败不覆盖成功的；状态面板；真解开一个包核对，8,640 个文件一致
- **9 月 20–21 日**　微信改用卷影快照复制；排除 Codex 沙箱这类被锁住的运行文件
- **9 月 21 日**　微信每周上云失败：复制途中文件变了
- **9 月 26 日**　单个被占用的文件只跳过；微信上云改传 G 上核对过的那一份；E 盘旧微信副本清掉；Codex 对话历史移出配置包
- **9 月 28 日**　微信新办法第一次上云，146,300 个文件比对一致；当晚定下 AI 工具只备 Codex 的配置和记忆、Antigravity 和 OpenCode 的设置，统一由这里备，补回漏掉的 Codex 记忆扩展笔记，OpenClaw 移出
- **9 月 29 日**　AI 工具的配置目录登记为必需，缺了报缺口；Antigravity 命令行版的对话、标注、知识不再带；按我的决定，Codex 对话也不随配置包上云盘
- **10 月 1–3 日**　被杀毒软件拦下或扫描后消失的单个文件改成“完成但带警告”，有警告时先不删旧包；复制途中配置清单变了就有限次整轮重采；正在被写的 SQLite 数据库改成先做一致副本再打包，做不出来就保留旧包
- **10 月 7 日**　加上 FlyingBird 的四项配置，来源从 66 个变成 70 个
