---
{
 "title": "电脑使用与性能记录",
 "kind": "project",
 "url": "/projects/timeaudit/",
 "tagline": "事后查电脑为什么卡，也能看时间花在哪。",
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
  "page": "timeaudit",
  "kind": "project",
  "title": "电脑使用与性能记录",
  "url": "/projects/timeaudit/",
  "tagline": "事后查电脑为什么卡，也能看时间花在哪。",
  "status": "常用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/TimeAudit",
  "capability": "记得电脑发生过什么",
  "based_on": {
   "commit": "c5ca4eeb9574e72baa0dc22eb317687f7322185c",
   "commit_time": "2026-10-11T12:44:01+08:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的插画出发，镜头不动：机箱侧透里的风扇慢慢转，机箱吐出的心电图纸带缓缓向外移动，纸带上的绿色曲线平稳起伏，偶尔冒出一个小尖峰，放大镜随之轻轻挪过去停在尖峰上；机箱脚边夹着回形针的便签轻轻翻起一角又落下；背景水彩微微流动，偶尔一片小叶子飘过。画面里不出现任何文字，最后一帧回到第一帧，无缝循环。",
  "registry": {
   "groups": [
    {
     "id": "g-record",
     "name": "记录"
    },
    {
     "id": "g-view",
     "name": "看图"
    },
    {
     "id": "g-ask",
     "name": "问 AI"
    },
    {
     "id": "g-clip",
     "name": "剪贴板历史"
    },
    {
     "id": "g-keep",
     "name": "保底"
    }
   ],
   "features": [
    {
     "id": "f-hardware",
     "group": "g-record",
     "name": "整机硬件",
     "what": "每秒记 CPU 和显卡的温度、功率、频率、电压、占用，内存和换页，磁盘延迟和读写，网速、网络延迟和丢包",
     "how": "不用做什么，登录后自动记",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "hardware_worker.py；fact_system_hardware 540 万行，最晚 9/28 20:39"
    },
    {
     "id": "f-fps",
     "group": "g-record",
     "name": "游戏帧率",
     "what": "每秒记前台游戏的帧率、1% Low 和帧时间；先读 RTSS，读不到才开 PresentMon；没开游戏记“空闲等待”",
     "how": "开着游戏就在记；在流畅度看板看",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "hardware_worker.py:94-113；health fps_state=active；9/28 3 小时 10,800 个帧样本"
    },
    {
     "id": "f-process-usage",
     "group": "g-record",
     "name": "每个程序占多少",
     "what": "每 3 秒清点所有在跑的程序各占多少 CPU、显卡、内存、显存、磁盘和网络；网络按连接数估算分摊",
     "how": "在资源大户看板看",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "activity_worker.py；ARCHITECTURE.md；fact_process_activity 约 1.5 亿行"
    },
    {
     "id": "f-lifecycle",
     "group": "g-record",
     "name": "程序启动和退出",
     "what": "记每个程序何时启动、何时退出、退出码和活了多久，还有路径、签名、是否提权",
     "how": "在进程取证看板看",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "lifecycle_worker.py；2,610 万次事件"
    },
    {
     "id": "f-hung",
     "group": "g-record",
     "name": "程序无响应",
     "what": "用 Windows 自己的“未响应”判断，记哪个窗口卡成“未响应”、卡了多久",
     "how": "在资源大户看板的卡死时间线看",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "AGENTS.md；提交 d52e21d；context_worker.py:49"
    },
    {
     "id": "f-foreground",
     "group": "g-record",
     "name": "前台窗口",
     "what": "记前台是哪个程序、全屏还是窗口、聚焦了多久",
     "how": "在屏幕使用时间看板看",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "context_worker.py；fact_process_context"
    },
    {
     "id": "f-presence",
     "group": "g-record",
     "name": "离开、锁屏、息屏、睡眠",
     "what": "人离开、锁屏、息屏、睡眠各记各的；计时被耽误的单独记成采集空档",
     "how": "不用做什么",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "TimeAudit.ahk:9,57-75,151-173；app_usage_logs 207,579 段；health activity_persistence healthy"
    },
    {
     "id": "f-dash-hardware",
     "group": "g-view",
     "name": "整机硬件大盘",
     "what": "21 个图：温度功率、降频原因、内存和换页、磁盘延迟、网络、散热有没有变差",
     "how": "在这台电脑或外网打开图表网页，选时间范围",
     "status": "说不准",
     "screen": "timeaudit-14",
     "source": "grafana_dashboards/b7d809e5…json；使用手册 4.1；看板被看不留记录"
    },
    {
     "id": "f-dash-smooth",
     "group": "g-view",
     "name": "流畅度诊断",
     "what": "9 个图：帧率、1% Low、卡顿时刻、CPU 还是显卡拖后腿、全屏和窗口对比",
     "how": "同上",
     "status": "说不准",
     "screen": "timeaudit-14",
     "source": "addmc8x…json；使用手册 4.2"
    },
    {
     "id": "f-dash-power",
     "group": "g-view",
     "name": "功耗和电费",
     "what": "11 个图：今天几度电、按峰谷电价折多少钱、月底预计、最费电的程序；电量只按 CPU 和显卡功率算",
     "how": "同上；顶上可改电价",
     "status": "说不准",
     "screen": "timeaudit-14",
     "source": "addpc9x…json 各面板 SQL；使用手册 4.3"
    },
    {
     "id": "f-dash-forensics",
     "group": "g-view",
     "name": "进程取证",
     "what": "16 个图：提权、没签名、崩溃退出码、短时间反复启动、悄悄联网、命令行开出的子进程；只给核查线索",
     "how": "同上",
     "status": "说不准",
     "screen": "timeaudit-14",
     "source": "addforex…json；使用手册 4.4"
    },
    {
     "id": "f-dash-resource",
     "group": "g-view",
     "name": "资源大户",
     "what": "10 个图：占用前 25 名、后台高占用、写盘和联网大户、内存只涨不跌、各软件按小时和按天的 CPU、内存趋势",
     "how": "同上",
     "status": "说不准",
     "screen": "timeaudit-14",
     "source": "addrd7x…json；9/27 新增两图（PROCESS_ACTIVITY_RETENTION.md）"
    },
    {
     "id": "f-dash-screen",
     "group": "g-view",
     "name": "屏幕使用时间",
     "what": "13 个图：开机多久、人在电脑前多久、各软件时长和分类、专注时段、每天几点活跃、本周比上周",
     "how": "同上",
     "status": "说不准",
     "screen": "timeaudit-14",
     "source": "adfkm96…json；使用手册 4.6"
    },
    {
     "id": "f-public",
     "group": "g-view",
     "name": "外网打开图表",
     "what": "经 Cloudflare 隧道用 grafana.wly0829.cn 打开完整看板要登录；另有 3 张公开状态小看板免登录；电脑关机时都打不开",
     "how": "浏览器打开 grafana.wly0829.cn",
     "status": "在用",
     "screen": "timeaudit-14",
     "source": "PCConfig remote_computer_cloudflare_tunnel.json；提交 c5b8c2a；9/28 health grafana healthy"
    },
    {
     "id": "f-stutter",
     "group": "g-ask",
     "name": "刚才卡了",
     "what": "AI 用电脑配置与恢复的卡顿总诊断，把这里的历史摘要和运行健康、内存黑匣子、系统事件对到同一段时间，刚发生的再加几秒现场采样",
     "how": "跟 AI 说“刚才卡了”",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "E:\\PCConfig\\tools\\Get-ComputerStutterDiagnostic.ps1；9/28 实跑 status=partial；技能 SKILL.md"
    },
    {
     "id": "f-diag-summary",
     "group": "g-ask",
     "name": "历史诊断摘要",
     "what": "按时间段一次汇总记录覆盖、空档、温度功率、帧率和超阈值次数，不回程序名和窗口标题；9 月 29 日查 24 小时约 2.5 秒、168 小时约 6.4 秒，都能出结果",
     "how": "跟 AI 说时间段",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "timeaudit_diagnostic_summary.py（提交 a5a5ad9：查询上限 12 秒、进程 14 秒，硬件按请求时段直接聚合）；9/28 实测 24 小时 query_failed；修复对话 9/29 实测 24 小时约 2.5 秒、168 小时约 6.4 秒"
    },
    {
     "id": "f-health",
     "group": "g-ask",
     "name": "现在正不正常",
     "what": "一次查齐：在不在写、入库积压、传感器、图表、备份、看门狗上次结果；双击“检查运行状态.vbs”也是它",
     "how": "问 AI“TimeAudit 正常吗”，或双击检查入口",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "timeaudit_health.py；check_status_gui.ps1；9/28 20:35 healthy"
    },
    {
     "id": "f-usage-qa",
     "group": "g-ask",
     "name": "某天用了哪些软件",
     "what": "经个人理解库、个人资料解锁后，按完整时段和北京时间每天给出各软件前台时长、离开和空档；设备记录不等于人在场",
     "how": "问 AI“那天我都用了什么软件”",
     "status": "说不准",
     "screen": "timeaudit-15",
     "source": "personal_activity_reader.py；daily-preferences activity_queries.py；结果只写私有位置，看不到用了几次"
    },
    {
     "id": "f-anomaly-digest",
     "group": "g-ask",
     "name": "给电脑配置项目的异常摘要",
     "what": "只给持续高温、内存和磁盘压力这类次数，提示那边复查配置；9 月 28 日那边退役综合自查后没人再调用，29 日代码也删了",
     "how": "已停用",
     "status": "已停用",
     "screen": "timeaudit-15",
     "source": "pcconfig_anomaly_digest.py；PCConfig 提交 348632a2；PCConfig 里 grep 不到调用方；提交 a5a5ad9 删除 pcconfig_anomaly_digest.py 和 PCCONFIG_ANOMALY_DIGEST_CONTRACT.md"
    },
    {
     "id": "f-clip-record",
     "group": "g-clip",
     "name": "记下复制",
     "what": "新复制的文字、链接、文件路径；图片和太大的内容只记“复制过一次”",
     "how": "不用做什么，登录后自动记",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "clipboard_history/README.md；9/28 共 10,344 次、心跳新鲜"
    },
    {
     "id": "f-clip-search",
     "group": "g-clip",
     "name": "搜索和再次复制",
     "what": "在密码中心的剪贴板历史标签里按关键词、日期、类型筛，点一下再次复制；资料锁着时不显示",
     "how": "开始菜单点“TimeAudit 剪贴板历史”",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "快捷方式 → PasswordCenter.Desktop.exe --clipboard；password_center_clipboard.py；密码中心页 f 在用"
    },
    {
     "id": "f-clip-group",
     "group": "g-clip",
     "name": "同样内容合一条",
     "what": "同样的内容合成一条，写真正复制了几次；同一次复制被看到两遍不重复算",
     "how": "在剪贴板历史标签里看",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "提交 622b66c"
    },
    {
     "id": "f-clip-secret",
     "group": "g-clip",
     "name": "疑似密钥归类",
     "what": "看着像 API 密钥、令牌、恢复码的单独一类，提醒小心；只看格式",
     "how": "在剪贴板历史标签选“疑似密钥”",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "password_center_clipboard.py:214 secret_like；提交 cad00fd、6e7150b"
    },
    {
     "id": "f-clip-skip",
     "group": "g-clip",
     "name": "不存标了“不进历史”的复制",
     "what": "复制时带了 Windows 专用标记的一律不存，比如从密码中心复制的密码",
     "how": "不用做什么",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "clipboard_history/README.md 不变量第 4 条；密码中心页“复制不进剪贴板历史”"
    },
    {
     "id": "f-clip-pause",
     "group": "g-clip",
     "name": "暂停记录",
     "what": "在剪贴板历史标签里暂停，恢复后从当下重新算起",
     "how": "在剪贴板历史标签里点暂停",
     "status": "说不准",
     "screen": "timeaudit-15",
     "source": "control.py；password_center_clipboard.py set_paused；暂停不留历史记录"
    },
    {
     "id": "f-clip-export",
     "group": "g-clip",
     "name": "给别的工具的增量出口",
     "what": "别的程序可以从上次读到的位置接着取新复制；现在有没有程序在用没有核对",
     "how": "给获准的程序调用",
     "status": "说不准",
     "screen": "timeaudit-15",
     "source": "adapter_stdio.py；grep 只有 PCConfig 验收脚本调用"
    },
    {
     "id": "f-clip-backup",
     "group": "g-clip",
     "name": "剪贴板每天备份",
     "what": "每天 18:25 一致备份到 G 盘并核对条数和完整性",
     "how": "不用做什么",
     "status": "在用",
     "screen": "timeaudit-15",
     "source": "TimeAudit_ClipboardNearlineBackup 9/28 结果 0；dashboard_sources.json"
    },
    {
     "id": "f-autostart",
     "group": "g-keep",
     "name": "登录自动开始",
     "what": "登录后自动拉起数据库、图表、采集主程序和窗口记录器",
     "how": "不用做什么",
     "status": "在用",
     "screen": "timeaudit-16",
     "source": "TimeAudit_AutoStart 上次结果 0"
    },
    {
     "id": "f-watchdog",
     "group": "g-keep",
     "name": "看门狗",
     "what": "采集主程序、窗口记录器、入库程序卡住或退出，自动重启那一个（怎么做见“亮点”）；另外最多每 10 分钟写一份今天、昨天的用电回执给驾驶舱，只算 CPU 和显卡，不是整机电费",
     "how": "不用做什么；看 telemetry_watchdog.log",
     "status": "在用",
     "screen": "timeaudit-16",
     "source": "telemetry_watchdog.ps1；日志 842 次重启主程序（6/23 起）"
    },
    {
     "id": "f-retention",
     "group": "g-keep",
     "name": "明细 60 天、汇总长期",
     "what": "逐程序明细只留 60 天，删之前先汇总成按小时、按天的统计并核对条数",
     "how": "不用做什么",
     "status": "在用",
     "screen": "timeaudit-16",
     "source": "activity_retention_state enabled=true、raw_since 7/27；本人 DU3"
    },
    {
     "id": "f-db-backup",
     "group": "g-keep",
     "name": "数据库每日备份",
     "what": "每天 11:40 整库备份到 G 盘，校验、记指纹后才算数，留 14 天；哪一步出错就整次记失败，只有杀毒软件拦下或删掉文件、文件清点后自己没了这几种记成告警并接着备份",
     "how": "不用做什么",
     "status": "在用",
     "screen": "timeaudit-16",
     "source": "log/backup.log 9/28 pass；health 12 份"
    },
    {
     "id": "f-dash-backup",
     "group": "g-keep",
     "name": "看板设置备份到 GitHub",
     "what": "最近一次自然备份中，数据库和看板设置两项均已通过",
     "how": "不用做什么；失败看项目里的备份日志",
     "status": "在用",
     "screen": "timeaudit-16",
     "source": "backup_grafana.py（提交 a5a5ad9 先按解析后的内容比对）；log/backup.log 9/28 same-version divergence；修复对话：原因是 JSON 排版差异，下次 11:40 自然运行后才算恢复"
    },
    {
     "id": "f-restore-drill",
     "group": "g-keep",
     "name": "隔离恢复演练",
     "what": "在不联网的临时数据库里把备份恢复一遍再读回，不碰正在用的库；还没拿真实备份跑过",
     "how": "跟 AI 说“在隔离环境试恢复一次备份”",
     "status": "待验收",
     "screen": "timeaudit-16",
     "source": "timeaudit_backup.py restore-check；log/restore_check.json 9/17 用 2,317 字节合成样例；health full_restore_verified=false"
    },
    {
     "id": "f-db-audit",
     "group": "g-keep",
     "name": "整库数据审计",
     "what": "逐表逐字段检查数据对不对：各表行数、数值有没有越界、该有的是不是空的、有没有孤儿记录和时间倒退；只打印到屏幕，不留记录，日常查卡顿不用它",
     "how": "请 AI 跑一次 db_audit.py",
     "status": "说不准",
     "screen": "timeaudit-16",
     "source": "db_audit.py 第 3 行及 [1]–[5] 各段；test_db_audit_report.py；输出只到屏幕，找不到运行记录；旧网站写 8/31 前没跑过整库审计"
    },
    {
     "id": "f-rebuild",
     "group": "g-keep",
     "name": "换电脑重装",
     "what": "照《快速部署》装回运行环境、容器和计划任务，再从 G 盘备份恢复历史",
     "how": "跟 AI 说要换电脑",
     "status": "说不准",
     "screen": "timeaudit-16",
     "source": "快速部署.md；7/8 迁移项目目录（cf4d000）"
    }
   ],
   "numbers": [
    {
     "id": "n-hw-samples",
     "text": "749 万条",
     "meaning": "fact_system_hardware 行数，每秒一条",
     "as_of": "2026-10-23",
     "source": "见来源记录 timeaudit-n-hw-samples-home，观察于 2026-10-23T10:25:50+08:00",
     "screens": [
      "timeaudit-01",
      "timeaudit-10"
     ]
    },
    {
     "id": "n-lifecycle",
     "text": "3,899 万次",
     "meaning": "程序启动和退出事件行数",
     "as_of": "2026-10-22",
     "source": "本轮只读来源记录 timeaudit-n-lifecycle-0，观察于 2026-10-22T08:06:54+08:00",
     "screens": [
      "timeaudit-01",
      "timeaudit-10"
     ]
    },
    {
     "id": "n-panels",
     "text": "6 张看板 · 80 个图",
     "meaning": "仓库看板快照里的图数（不计分组行）",
     "as_of": "2026-10-11",
     "source": "grafana_dashboards/*.json 解析：21+9+11+16+10+13（北京 2026-10-11 16:12 在 c5ca4ee 复数不变）",
     "screens": [
      "timeaudit-01",
      "timeaudit-03",
      "timeaudit-14"
     ]
    },
    {
     "id": "n-clip",
     "text": "12,005 次",
     "meaning": "剪贴板 events 表行数；blobs 表行数",
     "as_of": "2026-10-22",
     "source": "本轮只读来源记录 timeaudit-n-clip-0，观察于 2026-10-22T08:06:20+08:00",
     "screens": [
      "timeaudit-01",
      "timeaudit-06"
     ]
    },
    {
     "id": "n-db",
     "text": "71.0 GiB",
     "meaning": "pg_database_size",
     "as_of": "2026-10-22",
     "source": "本轮只读来源记录 timeaudit-n-db-0，观察于 2026-10-22T08:06:23+08:00",
     "screens": [
      "timeaudit-10"
     ]
    },
    {
     "id": "n-activity",
     "text": "1.78 亿条、53.4 GiB",
     "meaning": "逐程序明细的精确行数、体积",
     "as_of": "2026-10-11",
     "source": "fact_process_activity 精确 COUNT 177,877,951 条（北京时间 2026-10-11 16:06:20–16:08:51 BEGIN READ ONLY；GPT 15:54–15:58 同法 177,844,782）；含分区 57,291,014,144 字节；第 14 屏“约 1.78 亿条、53 GiB、八成多”同源",
     "screens": [
      "timeaudit-10",
      "timeaudit-13"
     ]
    },
    {
     "id": "n-backup",
     "text": "约 4.7 GiB 一份，留 14 天，现有 12 份",
     "meaning": "每日数据库备份",
     "as_of": "2026-10-12",
     "source": "timeaudit_health.py completed_archives=12、daily_backup_status=complete、size_mib 4808.33；最新 time_audit_20261011_040756_473912.dump 为 5,041,899,358 字节；backup_db.ps1 RetentionDays=14；北京时间 2026-10-11 13:29–13:33 只读回读",
     "screens": [
      "timeaudit-10"
     ]
    },
    {
     "id": "n-watchdog",
     "text": "8 月尝试 696 次、成功 581 次 → 9 月 2 日 2 点–27 日 8 次",
     "meaning": "看门狗日志里尝试重启主程序的次数（北京时间）",
     "as_of": "2026-09-28",
     "source": "telemetry_watchdog.log；日志是本机时间，按提交记录的时区（7/3–9/23 −07、9/24 −10、9/25 起 −05）换成北京时间后计数；8 月 RESTART OK 581、FAILED 112；9 月 2–27 日共 14 次，其中 6 次在 9/2 00:11–01:45（帧率修复提交 00:57 前后）",
     "screens": [
      "timeaudit-12"
     ]
    },
    {
     "id": "n-code",
     "text": "约 2.4 万行、332 个测试定义（只计数）、234 次提交（其中 47 次看板自动快照）",
     "meaning": "代码行数、测试函数数（静态声明数，不是通过数）、提交数",
     "as_of": "2026-10-23",
     "source": "提交 a5a5ad9：git ls-files wc -l 合计 22,511（Python 20,084＋pyw 757、PowerShell 804、AHK 472、SQL 227、bat 105、VBS 62）；所有 .py 里 def test_ 303 个（同一数法 fc4882d 是 306，原稿的 300 复现不了）；git rev-list --count 210。2026-10-11 刷新于 c5ca4ee：已跟踪代码 23,566 行（GPT 计数）；所有 .py 中 def test_ 共 332 个（行首顶层 87 个）；rev-list --count 234；标题含 chore(grafana): 自动备份仪表盘快照 的提交 47 次",
     "screens": [
      "timeaudit-11"
     ]
    },
    {
     "id": "n-overhead",
     "text": "0.18 个核、61 MiB",
     "meaning": "采集主程序自身平均 CPU（1=一个逻辑核）和最大工作集",
     "as_of": "2026-10-12",
     "source": "诊断摘要 observer_cost，2026-10-10 02:17–05:17（北京时间）",
     "screens": [
      "timeaudit-11"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-stutter",
     "with": "pcconfig",
     "direction": "拿去",
     "flow": "电脑配置与恢复的卡顿总诊断读本项目的历史诊断摘要和运行健康，再加它自己的内存黑匣子和 Windows 事件；本项目的运行健康也反过来读它的黑匣子覆盖情况",
     "source": "DIAGNOSTICS_OPERATIONS.md；timeaudit_health.py blackbox_health"
    },
    {
     "id": "r-pcconfig-tasks",
     "with": "pcconfig",
     "direction": "托管",
     "flow": "看门狗、剪贴板三个任务的定义由电脑配置与恢复登记和重建；任务用途和结果进它的任务总表",
     "source": "PCConfig task_purpose_catalog.json、Install-TimeAuditRuntimeWatchdog.ps1"
    },
    {
     "id": "r-pcconfig-anomaly",
     "with": "pcconfig",
     "direction": "给过（已停用）",
     "flow": "不含内容的硬件异常次数，供那边决定要不要复查稳定配置；9/28 那边退役综合自查后无人调用；9/29 代码、合同和测试已删除（a5a5ad9）",
     "source": "PCCONFIG_ANOMALY_DIGEST_CONTRACT.md；PCConfig 348632a2"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿去",
     "flow": "密码中心的剪贴板历史标签只读本项目的剪贴板 SQLite，受个人资料解锁期管；从密码中心复制的密码带标记，本项目不存",
     "source": "password_center_clipboard.py；clipboard_history/README.md"
    },
    {
     "id": "r-personal-access",
     "with": "pcconfig",
     "direction": "借用",
     "flow": "个人活动读取和剪贴板查看每次都查电脑配置与恢复的共享个人资料解锁期，不另设验证",
     "source": "PERSONAL_ACTIVITY_READER.md；clipboard_history/README.md"
    },
    {
     "id": "r-daily-preferences",
     "with": "daily-preferences",
     "direction": "拿去",
     "flow": "个人理解库的 desktop-activity 查询调用 personal_activity_reader.py，拿各软件时长、离开和空档的汇总",
     "source": "V:\\Personal\\Projects\\daily-preferences\\activity_queries.py；daily-preferences SKILL.md:37"
    },
    {
     "id": "r-remote-control",
     "with": "remote-control",
     "direction": "借路",
     "flow": "Grafana 图表经同一条 Cloudflare 隧道开放为 grafana.wly0829.cn",
     "source": "PCConfig remote_computer_cloudflare_tunnel.json additional_public_services"
    },
    {
     "id": "r-skill",
     "with": "timeaudit-diagnostics",
     "direction": "入口",
     "flow": "技能按问法选健康检查、历史摘要或卡顿总诊断，只读解释证据",
     "source": "E:\\.agents\\skills\\timeaudit-diagnostics\\SKILL.md"
    },
    {
     "id": "r-github",
     "with": "GitHub",
     "direction": "送去",
     "flow": "每日备份把看板设置 JSON 提交推送到本仓库",
     "source": "backup_grafana.py；backup_all.ps1"
    },
    {
     "id": "r-g-drive",
     "with": "G 盘备份",
     "direction": "送去",
     "flow": "数据库每日整库备份到 G:\\80_Backup\\TimeAudit\\postgresql；剪贴板一致备份到 G:\\80_Backup\\TimeAudit\\ClipboardHistory",
     "source": "backup_db.ps1；TimeAudit_ClipboardNearlineBackup"
    },
    {
     "id": "r-cockpit",
     "with": "网站驾驶舱",
     "direction": "拿去",
     "flow": "驾驶舱按 PCConfig 的看板来源登记读本项目任务结果和剪贴板备份回执",
     "source": "PCConfig dashboard_sources.json cockpit.grafana_project、backup_tasks"
    }
   ],
   "highlights": [
    {
     "id": "h-heartbeat",
     "title": "程序活着，不等于还在记。",
     "screen": "timeaudit-12"
    },
    {
     "id": "h-null-not-fake",
     "title": "读不到就留空，不补一个像样的数。",
     "screen": "timeaudit-12"
    },
    {
     "id": "h-no-double-count",
     "title": "一小时不会算成一个半小时。",
     "screen": "timeaudit-13"
    },
    {
     "id": "h-60-day-summary",
     "title": "明细只留 60 天，一年后的峰值照样查得到。",
     "screen": "timeaudit-13"
    }
   ],
   "mentions": [
    {
     "target": "/projects/pcconfig/",
     "screen": "timeaudit-05",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/skills/timeaudit-diagnostics/",
     "screen": "timeaudit-05",
     "text": "查电脑卡顿技能"
    },
    {
     "target": "/projects/password-center/",
     "screen": "timeaudit-06",
     "text": "密码中心"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "timeaudit-07",
     "text": "个人理解库"
    },
    {
     "target": "/projects/remote-control/",
     "screen": "timeaudit-09",
     "text": "远程控制电脑"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "现在在不在记：采集、窗口记录、入库、数据库最新一条是否新鲜。填“正在记录／有一段停了（写哪段）／暂时读不到”",
     "source": "timeaudit_health.py 的 status 和 components（telemetry、activity_persistence、ingester、database）；看门狗写的 log/watchdog_outcome.json"
    },
    {
     "slot": "backup",
     "meaning": "最近一次每日备份：两步都成功写“今天 11:40 备份好了”，有一步失败写“数据库备好了，看板设置没备上”这类，没跑写“今天还没备份”",
     "source": "计划任务 TimeAudit_DailyBackup 的 LastRunTime / LastTaskResult，加 timeaudit_health.py 的 backup 块（age_hours、manifest 核对）"
    },
    {
     "slot": "grafana",
     "meaning": "图表网页在不在线：在线时框里写“在线”并给一个可点的入口到 https://grafana.wly0829.cn，读不到电脑时写“电脑不在线，最后一次读到是几点”，不给链接",
     "source": "timeaudit_health.py 的 grafana 块（本机 /api/health）；外网可达另由隧道检查"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“进程追踪”（回看进程启动、退出和资源占用）拆成 f-process-usage“每个程序占多少”和 f-lifecycle“程序启动和退出”：两者是不同的表、不同的看板。",
    "底稿“本机图表”展开成 g-view 组的 6 个看板加 f-public“外网打开图表”：本人要的是能看出哪些该退役，按看板列更有用。",
    "底稿“功耗估计”写成 f-dash-power“功耗和电费”。",
    "底稿“采集健康”写成 f-health“现在正不正常”；“异常摘要”写成 f-diag-summary“历史诊断摘要”，卡顿总诊断单列 f-stutter。",
    "底稿“自动恢复”写成 f-watchdog；“数据备份”拆成 f-db-backup、f-dash-backup、f-restore-drill（三件事状态不同）。",
    "底稿“剪贴板历史”展开成 g-clip 组 8 项。旧稿“长期资源统计”写成 f-retention。"
   ],
   "dropped": [
    "旧网站 11 张截图用了 4 张；screen-time-focus、foreground-timeline、resource-usage、process-forensics 带窗口标题或程序明细，派活要求不读这类具体使用内容，我没打开看，也就没用；hardware-long-term 标题还是旧显卡型号；foreground-stutter-analysis 和 fps-stutter 同是坏数据例；storage-scale 没用。",
    "使用手册里 PSU 各轨电流、碳排放种树、5V 轨健康等估算卡片不单列功能，算在 f-dash-power 里。",
    "仓库根目录里 2026 年 6 月的历史归档（time_audit_perfect_archive.sql 等）、WCS 仿真报告的旧提交，不是本项目功能，不上页。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 13 屏“按我 9 月 27 日定的”。第 6 屏、第 7 屏“那天我都用了哪些软件”是问法示例。",
    "每日备份时间写“11:40”：计划任务触发时间是 2026-07-05T22:40:00-05:00，带固定偏移，换成北京时间一直是 11:40；9 月 29 日使用手册已把旧的“20:40”改掉（手册说冬令时要重新换算，按固定偏移的规则其实不变）。",
    "6 个看板都标“说不准”：Grafana 看了哪张不留记录，我没法判断本人实际看哪几张。本人专门要回过 Grafana 入口，说明在看，但分不到哪张。",
    "“现在”横条的 grafana 槽位：按 9 月 27 日“读不到电脑时不给链接”，入口放在槽位里由网页程序在线时才显示，页面正文里只写了域名不做链接；第 3 屏、第 9 屏正文写了 grafana.wly0829.cn 这个地址，是否也要去掉请 Claude 定。",
    "f-diag-summary 原写“查 24 小时会超时”（9 月 28 日两次实测）；9 月 29 日提交 a5a5ad9 后，修复对话实测 24 小时约 2.5 秒、168 小时约 6.4 秒，页面按此改。我没有自己重跑。",
    "f-anomaly-digest 标“已停用”：不是本人决定停的，是 PCConfig 9 月 28 日退役综合自查后没了调用方；9 月 29 日提交 a5a5ad9 把代码和接口说明也删了（修复对话的事实清单里没提，是我查仓库发现的）。",
    "f-usage-qa 标“说不准”：旧稿和底稿都写“在用”，但结果只写到私有位置，我按规矩不读，看不出用过几次。",
    "第 12 屏“9 月 2 日 2 点到 27 日只重启过 8 次”说的是时间上的先后（9 月 2 日凌晨修复上线前后另有 6 次）；这几处修复是不是降下来的全部原因，没有单独验证，所以写“之后”，没写“因为”。日志时间按提交时区换算成北京时间，日志本身没写时区。",
    "第 1 屏数字只写到 9 月 28 日 20:39。“10,800 个帧样本里 126 个对不上”这组数字只留在技能页的例子里（例子的家），项目页亮点只讲做法。",
    "剪贴板“8 月 31 日 5,234 次”取自旧网站记录，我没有重读当时的原件。",
    "项目 capability 写“记得电脑发生过什么”，和别的项目的叫法要在项目首页统一。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/timeaudit/page.json",
  "sha256": "8b8ad125da56257477de116e72965de3f4d55461d35b1cdfebdd5e11b3efe9da",
  "converted_at_beijing": "2026-10-23T10:39:13+08:00"
 }
}
---

::screen{#timeaudit-01 section="top"}

```typeset
{
 "screen": {
  "id": "timeaudit-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“电脑使用与性能记录”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一条心电图般的曲线、一扇开关的小门（程序进出）、一块带六个小格的仪表盘、一枚回形针夹着的便签。数字卡下面一条细长的圆角横条：最左写“现在”，接着依次是小字“记录”加一个留空的浅色圆角小框、小字“备份”加同样大小的空框、小字“图表网页”加同样大小的空框（三个空框各约横条宽度的 18%），最右一个按钮〔现在正不正常 → 驾驶舱〕；三个空框里什么都不画，网页程序会往里填字。横条下面一行放两个白底细绿边的圆角按钮：〔在整套系统里的位置 → 怎么协作〕、〔GitHub〕（GitHub 按钮左边画 GitHub 的小猫标志）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、“现在”横条改成竖排四行（“现在”一行，“记录”加空框一行，“备份”加空框一行，“图表网页”加空框一行，空框占整行宽约 70%），驾驶舱按钮单独一行，最后两个按钮上下各一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#timeaudit"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#timeaudit"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/TimeAudit"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/timeaudit/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "backup",
   "grafana"
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
     "size": "large",
     "align": "left",
     "row": "hero",
     "width": "49%",
     "text_ref": "电脑使用与性能记录"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "事后查电脑为什么卡，也能看时间花在哪。",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "text_ref": "现在记录备份图表网页现在正不正常→驾驶舱",
     "frame_mode": "plain",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "这台电脑从登录起就在后台一直记：每秒一条硬件和游戏帧率，每3"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "51%"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "749万条每秒一条的硬件记录（6月16日起）3,998万次记下的程序启动和退出（同一时段）6张看板·80个图本机Grafana，按问题分好12,134次记下的复制"
    },
    {
     "type": "action_button",
     "columns": 3,
     "columns_v": 1,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "横版以pages-approved已通过修正图为准：49%左题+副标题+介绍、51%右侧机箱纸带插画，4数字卡一排，带3名称的实时条，页脚3按钮。竖版原图标题/副标题/介绍在插画之前，2×2数字卡；实时条左名称右留空框，驾驶舱按钮独占行。旧图未有复制AI按钮，按定稿补齐；不烘焙实时数值。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n当前live_strip从now节点真实标签自动生成各框，已核对labels/格数；删除旧规格冗余labels/columns描述，要求仍保留在scene及本注释。",
   "dependencies": [
    "最新parse已能识别数字卡与带名称实时条，渲染需确认4卡和3个空框前名称逐字完整。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-01-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "电脑使用与性能记录"
    },
    {
     "type": "prose",
     "text_ref": "事后查电脑为什么卡，也能看时间花在哪。",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "text_ref": "现在记录备份图表网页现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "749万条每秒一条的硬件记录（6月16日起）3,998万次记下的程序启动和退出（同一时段）6张看板·80个图本机Grafana，按问题分好12,134次记下的复制",
     "portrait_columns": 1
    },
    {
     "type": "prose",
     "text_ref": "这台电脑从登录起就在后台一直记：每秒一条硬件和游戏帧率，每3"
    },
    {
     "type": "illustration"
    },
    {
     "type": "action_button",
     "columns": 1,
     "columns_v": 1,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "横版以pages-approved已通过修正图为准：49%左题+副标题+介绍、51%右侧机箱纸带插画，4数字卡一排，带3名称的实时条，页脚3按钮。竖版原图标题/副标题/介绍在插画之前，2×2数字卡；实时条左名称右留空框，驾驶舱按钮独占行。旧图未有复制AI按钮，按定稿补齐；不烘焙实时数值。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n当前live_strip从now节点真实标签自动生成各框，已核对labels/格数；删除旧规格冗余labels/columns描述，要求仍保留在scene及本注释。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "最新parse已能识别数字卡与带名称实时条，渲染需确认4卡和3个空框前名称逐字完整。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-01-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "540 万秒｜每秒一条的硬件记录（6 月 16 日–9 月 28 日）",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "2,610 万次｜记下的程序启动和退出（同一时段）",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "6 张看板 · 80 个图｜本机 Grafana，按问题分好",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "10,344 次｜记下的复制（截至 9 月 28 日）",
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
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-timeaudit",
   "source_phrase": "右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready",
   "original_elements": [
    "一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录"
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
   "asset": "_library/titles/title-e6d3981fff7ce4844fde.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e6d3981fff7ce4844fde",
   "title_text": "电脑使用与性能记录",
   "sha256": "966cd716e01fb5a839602e35bff0a201706e9c96b893de9390a1bf032e602d50",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

电脑使用与性能记录

事后查电脑为什么卡，也能看时间花在哪。

这台电脑从登录起就在后台一直记：每秒一条硬件和游戏帧率，每 3 秒清点一次所有程序各占多少资源，还记前台是哪个窗口、人在不在电脑前、有没有锁屏和睡眠。卡过、热过、掉过帧，等打开任务管理器时现场早没了；有了这份记录，可以按时间倒回去看图，也可以直接问 AI。另有一条独立的剪贴板记录，复制过的文字、链接和文件路径被覆盖了也找得回来。

**749 万条**｜每秒一条的硬件记录（6 月 16 日起）
**3,998 万次**｜记下的程序启动和退出（同一时段）
**6 张看板 · 80 个图**｜本机 Grafana，按问题分好
**12,134 次**｜记下的复制

截至 10 月 12 日（复制次数本轮已重读；硬件记录在 10 月 23 日 10:25、程序启动和退出在 10 月 23 日 10:26 重新做了精确计数；看板数量本轮未取得同口径新值，保留 10 月 12 日的旧数，当前为 Unknown）

现在　记录　备份　图表网页　〔现在正不正常 → 驾驶舱〕

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#timeaudit-18 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-18",
  "section": "usage",
  "title": "想查什么，从哪进",
  "scene": "横版：左上标题（毛笔艺术字加绿色笔刷线）。下面三张同样大小的竖向大卡片横排、占满宽度，每张顶上一幅小水彩插画：①一台显示器上一只转圈的小沙漏，旁边一个对话气泡（只画三个小点）；②一张一周的热力格子（深浅不一的小绿方格，不画字）加一个小沙漏；③一个剪贴板夹着几张便签（便签只画浅灰短线），一枚回形针。插画下面粗体卡片标题，再下面两段或一段正文，每段开头的“问 AI：”“自己看图：”“看图：”画成绿色小标签；卡片底部一个白底细浅绿描边的圆角按钮，写卡片末尾〔〕里的字。三张卡片高度一致、内容上对齐，不留空格子。风格照本页已通过各屏（白底、纯绿主色、水彩插画、细浅绿描边圆角卡）。",
  "portrait": "竖版：标题；三张卡片上下排、各占满宽，每张插画在左上、缩小，标题和正文在下，按钮在卡片底部右对齐。字和横版完全一样。",
  "links": [
   {
    "text": "卡了，问 AI",
    "href": "/projects/timeaudit/#stutter"
   },
   {
    "text": "时间花在哪",
    "href": "/projects/timeaudit/#screen-time"
   },
   {
    "text": "找回复制过的东西",
    "href": "/projects/timeaudit/#clipboard"
   }
  ],
  "anchors": [
   {
    "id": "entry",
    "text": "想查什么，从哪进"
   }
  ],
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
     "size": "medium",
     "align": "center",
     "text_ref": "想查什么，从哪进"
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/笔记本电脑.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/icons/人物.png"
     ],
     "equal_height": true,
     "button_align": "bottom_right",
     "text_ref": "电脑卡了"
    }
   ],
   "notes": "横版以已批准candidate-2为构图来源：整宽章节标题按本次要求居中；下面3张等宽等高卡一排，插画在卡内上方，标题和说明左齐，按钮卡底。竖版没有原图，参照同页07竖版逐卡顺排，左上插画、下方标题正文、卡底按钮；新构图，待样张。问AI/看图的标签只来自定稿，不增加文字。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "3张卡顶插画须单独无字素材；当前本屏未有合格素材。",
    "paragraph开头问AI/自己看图/看图标签需保持原词逐字且不重复。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-18-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "medium",
     "align": "center",
     "text_ref": "想查什么，从哪进"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/笔记本电脑.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/icons/人物.png"
     ],
     "equal_height": true,
     "button_align": "bottom_right",
     "text_ref": "电脑卡了"
    }
   ],
   "notes": "横版以已批准candidate-2为构图来源：整宽章节标题按本次要求居中；下面3张等宽等高卡一排，插画在卡内上方，标题和说明左齐，按钮卡底。竖版没有原图，参照同页07竖版逐卡顺排，左上插画、下方标题正文、卡底按钮；新构图，待样张。问AI/看图的标签只来自定稿，不增加文字。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "3张卡顶插画须单独无字素材；当前本屏未有合格素材。",
    "paragraph开头问AI/自己看图/看图标签需保持原词逐字且不重复。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-18-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   },
   "reference_screen": "timeaudit-07",
   "reference_source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\timeaudit\\img\\timeaudit-07-v.png"
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "笔记本电脑",
   "source_phrase": "电脑卡了 \n问AI：说一句“刚才卡了”。AI用卡顿总诊断把这里的历史、Windows内存黑匣子和系统事件对到同一段时间，交回结论、出事的时间段、最关键的几个数和哪里没有证据。\n自己看图：“前台交互与流畅度诊断舱”看帧率和卡顿时刻，“整机硬件能效与系统资源大盘”看温度、降频、内存和磁盘延迟。\n卡了，问AI",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "时钟",
   "source_phrase": "时间花在哪 \n看图：“屏幕使用时间”看板，每天开机多久、人在电脑前多久、各软件用了多久。\n问AI：“那天我都用了哪些软件”，由个人理解库来答；这属于个人资料，要先验证解锁才读。\n时间花在哪",
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
   "asset": "_library/icons/人物.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "人物",
   "source_phrase": "找复制过的东西 \n开始菜单点“TimeAudit剪贴板历史”，打开密码中心里的“剪贴板历史”标签；按关键词、日期、类型筛，点一下再次复制。个人资料锁着时列表是空的，验证解锁后才显示。\n找回复制过的东西",
   "sha256": "221ee5da99dd4bcd2d636a62584d34405663986eebdce306093f0944b39360be",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "显示器等待",
   "source_phrase": "下面三张同样大小的竖向大卡片横排、占满宽度，每张顶上一幅小水彩插画：①一台显示器上一只转圈的小沙漏，旁边一个对话气泡（只画三个小点）；②一张一周的热力格子（深浅不一的小绿方格，不画字）加一个小沙漏；③一个剪贴板夹着几张便签（便签只画浅灰短线），一枚回形针。",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready",
   "original_elements": [
    "一台显示器上一只转圈的小沙漏，旁边一个对话气泡（只画三个小点"
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
   "asset": "_library/illustrations/热力格子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "热力格子",
   "source_phrase": "下面三张同样大小的竖向大卡片横排、占满宽度，每张顶上一幅小水彩插画：①一台显示器上一只转圈的小沙漏，旁边一个对话气泡（只画三个小点）；②一张一周的热力格子（深浅不一的小绿方格，不画字）加一个小沙漏；③一个剪贴板夹着几张便签（便签只画浅灰短线），一枚回形针。",
   "sha256": "4efb691c4acee75f1102bffb14d87f50e8975eea509921c9e67327e7266ea597",
   "status": "ready",
   "original_elements": [
    "一张一周的热力格子（深浅不一的小绿方格，不画字）加一个小沙漏"
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
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "性能证据现图小槽4比3",
   "source_phrase": "下面三张同样大小的竖向大卡片横排、占满宽度，每张顶上一幅小水彩插画：①一台显示器上一只转圈的小沙漏，旁边一个对话气泡（只画三个小点）；②一张一周的热力格子（深浅不一的小绿方格，不画字）加一个小沙漏；③一个剪贴板夹着几张便签（便签只画浅灰短线），一枚回形针。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready",
   "original_elements": [
    "一个剪贴板夹着几张便签（便签只画浅灰短线），一枚回形针"
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
   "asset": "_library/titles/title-693d1b1487ac54839d16.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-693d1b1487ac54839d16",
   "title_text": "想查什么，从哪进",
   "sha256": "0c063d46ed5d59b8f08892c60855ffd3b4436bce55957364a8dab246647b1686",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

想查什么，从哪进

**电脑卡了**
问 AI：说一句“刚才卡了”。AI 用卡顿总诊断把这里的历史、Windows 内存黑匣子和系统事件对到同一段时间，交回结论、出事的时间段、最关键的几个数和哪里没有证据。
自己看图：“前台交互与流畅度诊断舱”看帧率和卡顿时刻，“整机硬件能效与系统资源大盘”看温度、降频、内存和磁盘延迟。
〔卡了，问 AI〕

**时间花在哪**
看图：“屏幕使用时间”看板，每天开机多久、人在电脑前多久、各软件用了多久。
问 AI：“那天我都用了哪些软件”，由个人理解库来答；这属于个人资料，要先验证解锁才读。
〔时间花在哪〕

**找复制过的东西**
开始菜单点“TimeAudit 剪贴板历史”，打开密码中心里的“剪贴板历史”标签；按关键词、日期、类型筛，点一下再次复制。个人资料锁着时列表是空的，验证解锁后才显示。
〔找回复制过的东西〕

::screen{#timeaudit-03 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-03",
  "section": "usage",
  "title": "六张看板",
  "scene": "横版画面：左上标题。上半部分一张横跨整屏宽约 62% 的水彩表格（三列七行：看板、回答什么、图；表头浅绿底；“回答什么”一列最宽，“图”一列窄、数字右对齐；每行最左边一个小水彩图标：一块主板、一只游戏手柄、一个电表、一把放大镜照着指纹、一只小老鼠抱着内存条、一个沙漏），表格下面“每个图分别画什么”那句。右边约 38% 宽：上部画一个浏览器小窗口的轮廓和 Grafana 的橙色标志，下面一个带细绿边框的截图空位（宽高比约 4:1，横着放），截图位下面一行灰色小字（截图说明那句）。最下面横跨整屏两段小字（打开方式、“内鬼”说明）。",
  "portrait": "竖版：标题；表格改成六张卡片一行一张：卡片粗体写看板名，右上角小字写“几个图”，下面一行写“回答什么”；“每个图分别画什么”那句紧跟；截图位占满宽度，说明在下；两段小字在最后。",
  "links": [
   {
    "text": "全部功能",
    "href": "/projects/timeaudit/#g-view"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/d7e90c337e9509efc5b9c5f18ecf14cbcc3cfaaaeb2a3f2ae63c65325b82984c.webp",
    "where": "右半边中部的细边框截图位",
    "caption": "8 月 29 日的真实看板目录",
    "crop_h": [
     246,
     0,
     2730,
     976
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
     "size": "large",
     "align": "left",
     "row": "catalog",
     "width": "44%",
     "text_ref": "六张看板"
    },
    {
     "type": "table",
     "row": "catalog",
     "columns": 3,
     "column_widths": [
      "38%",
      "55%",
      "7%"
     ],
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "看板回答什么图整机硬件能效与系统资源大盘电脑热不热、有没有降"
    },
    {
     "type": "prose",
     "row": "catalog",
     "text_ref": "每个图分别画什么，见全部功能的“看图”一组。"
    },
    {
     "type": "illustration",
     "row": "catalog",
     "width": "56%"
    },
    {
     "type": "screenshot",
     "row": "catalog",
     "indices": [
      0
     ],
     "ratio": "4:1",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "row": "catalog",
     "align": "center",
     "text_ref": "8月29日的真实看板目录"
    },
    {
     "type": "prose",
     "text_ref": "打开：在这台电脑的浏览器里打开图表网页，人在外面用grafa"
    }
   ],
   "notes": "横图真实左表约44%右浏览器插画及留空截图56%，不是scene所写62/38；表内原图缺回答什么列，须补定稿完整3列同时保留左表右截图布局。竖图6行卡依次：左图/看板名/右数字，定稿补充回答什么，不删字；截图及其日期说明后再页底3段说明。浏览器插画在框外上方，截图只留空。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "screenshot须可shot_indices选单槽并按来源框比例输出。",
    "竖表卡应保留右上图数、左看板名与回答什么说明，不简单左右窄格强塞。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-03-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "六张看板"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "variant": "row_cards",
     "illustration": "left_inside",
     "icons": "auto",
     "value_align": "top_right",
     "text_ref": "看板回答什么图整机硬件能效与系统资源大盘电脑热不热、有没有降"
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "4:1",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "align": "center",
     "text_ref": "8月29日的真实看板目录"
    },
    {
     "type": "prose",
     "text_ref": "每个图分别画什么，见全部功能的“看图”一组。"
    }
   ],
   "notes": "横图真实左表约44%右浏览器插画及留空截图56%，不是scene所写62/38；表内原图缺回答什么列，须补定稿完整3列同时保留左表右截图布局。竖图6行卡依次：左图/看板名/右数字，定稿补充回答什么，不删字；截图及其日期说明后再页底3段说明。浏览器插画在框外上方，截图只留空。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "screenshot须可shot_indices选单槽并按来源框比例输出。",
    "竖表卡应保留右上图数、左看板名与回答什么说明，不简单左右窄格强塞。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-03-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一块主板、一只游戏手柄、一个电表、一把放大镜照着指纹、一只小老鼠抱着内存条、一个沙漏",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-timeaudit",
   "source_phrase": "横版画面：左上标题。上半部分一张横跨整屏宽约 62% 的水彩表格（三列七行：看板、回答什么、图；表头浅绿底；“回答什么”一列最宽，“图”一列窄、数字右对齐；每行最左边一个小水彩图标：一块主板、一只游戏手柄、一个电表、一把放大镜照着指纹、一只小老鼠抱着内存条、一个沙漏），表格下面“每个图分别画什么”那句。右边约 38% 宽：上部画一个浏览器小窗口的轮廓和 Grafana 的橙色标志，下面一个带细绿边框的截图空位（宽高比约 4:1，横着放），截图位下面一行灰色小字（截图说明那句）。最下面横跨整屏两段小字（打开方式、“内鬼”说明）。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e4282fe1da346c845a99.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e4282fe1da346c845a99",
   "title_text": "六张看板",
   "sha256": "aca3dbf797712c7515fba18f8690b05665a84c2b90f03d15dd82bf561bdb6f18",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

六张看板

| 看板 | 回答什么 | 图 |
|---|---|---|
| 整机硬件能效与系统资源大盘 | 电脑热不热、有没有降频，内存、磁盘、网络哪里吃紧，散热有没有变差 | 21 |
| 前台交互与流畅度诊断舱 | 游戏和前台卡不卡：帧率、1% Low、卡顿时刻，是 CPU 还是显卡拖后腿 | 9 |
| 功耗与电费诊断舱 | 今天用了几度电、按峰谷电价折多少钱、月底预计多少、哪个程序最费电 | 11 |
| 进程取证与安全审计舱 | 有没有要核查的程序：提权、没签名、崩溃退出、反复启动、悄悄联网 | 16 |
| 资源大户与后台内鬼 | 谁在占资源：占用前 25 名、后台高占用、写盘和联网大户、内存只涨不跌 | 10 |
| 屏幕使用时间 | 时间花在哪：开机多久、人在电脑前多久、各软件用了多久、专注时段 | 13 |

每个图分别画什么，见〔全部功能〕的“看图”一组。

打开：在这台电脑的浏览器里打开图表网页，人在外面用 grafana.wly0829.cn（完整看板要登录；另有 3 张免登录的公开状态小看板；电脑关机时都打不开）。打开先看到的是当前状态；累计电量、每日趋势这类要翻长历史的图收在标着“展开”的折叠行里，点开才去查（10 月 11 日起），不会一打开就把全部历史跑一遍。右上角选时间范围，在曲线上横着拖一下就放大那一段。
“内鬼”只是后台占用排行的外号，没签名、路径怪也只是要核查的线索，都不等于有毒。

8 月 29 日的真实看板目录

::screen{#timeaudit-04 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-04",
  "section": "usage",
  "title": "看板长这样",
  "scene": "横版画面：左上标题。左右两个带细绿边框的截图空位，各占约一半宽：左边截图位宽高比约 16:9（功耗盘），右边截图位宽高比约 2.4:1（系统压力盘），右边截图位下方空出的地方放一张浅绿边框的小卡片“电费怎么算的”。每个截图位下面一行灰色小字说明。左上角标题旁画一只小电表插画。",
  "portrait": "竖版：标题；两个截图位上下排，各占满宽度，各自说明紧跟在下；“电费怎么算的”卡片在最后。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/a496ee151170e7a4f8eeab030c57a6ccc7143afb1ae7bd1dfbfb6a78af37b83f.webp",
    "where": "左半边的细边框截图位（约 16:9）",
    "caption": "8 月 29 日的功耗与电费诊断舱：上排是今天的电量、电费和峰谷分布，中间是整机功耗曲线，下面是最费电的程序榜。"
   },
   {
    "file": "sources/assets/_references/ab139fae52d022c9eb9e4224a8c7590d22537213c159ec02b3c95de25e5f6d14.webp",
    "where": "右半边上部的细边框截图位（约 2.4:1）",
    "caption": "8 月 29 日的系统压力：调度抖动、内存和换页、磁盘最高延迟、网络延迟画在同一条时间轴上，一眼看出是不是同一刻一起变坏。"
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
     "row": "heading",
     "width": "18%",
     "index": 0,
     "row_fit_illustration": true
    },
    {
     "type": "chapter_title",
     "size": "medium",
     "align": "left",
     "row": "heading",
     "width": "82%",
     "text_ref": "看板长这样"
    },
    {
     "type": "screenshot",
     "row": "shots",
     "width": "50%",
     "indices": [
      0
     ],
     "ratio": "3840:2146",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "row": "shots",
     "text_ref": "8月29日的功耗与电费诊断舱：上排是今天的电量、电费和峰谷分"
    },
    {
     "type": "screenshot",
     "row": "shots",
     "width": "50%",
     "indices": [
      1
     ],
     "ratio": "3840:1589",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "row": "shots",
     "text_ref": "8月29日的系统压力：调度抖动、内存和换页、磁盘最高延迟、网"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "电费怎么算的",
     "last_full_width": true
    }
   ],
   "notes": "标题旁电表占左，标题在右照原图，不能居中成无插画整宽标题。横版49/51左右截图；左16:9下跟说明，右约2.4:1下跟说明及电费怎么算卡；卡内左计算器插画右4点文字。竖版两槽和各自说明依次，再整宽电费卡。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。",
   "dependencies": [
    "单个screenshot块需只输出指定截图，否则两次调用重复全部截图/热区。",
    "电表主插画与计算器卡插画须分配不同素材，不能重复主图。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-04-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "illustration",
     "row": "heading",
     "row_v": true,
     "width": "32%",
     "index": 0
    },
    {
     "type": "chapter_title",
     "size": "medium",
     "align": "left",
     "row": "heading",
     "row_v": true,
     "width": "68%",
     "text_ref": "看板长这样"
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "3840:2146",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "8月29日的功耗与电费诊断舱：上排是今天的电量、电费和峰谷分"
    },
    {
     "type": "screenshot",
     "indices": [
      1
     ],
     "ratio": "3840:1589",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "8月29日的系统压力：调度抖动、内存和换页、磁盘最高延迟、网"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "电费怎么算的",
     "last_full_width": true
    }
   ],
   "notes": "标题旁电表占左，标题在右照原图，不能居中成无插画整宽标题。横版49/51左右截图；左16:9下跟说明，右约2.4:1下跟说明及电费怎么算卡；卡内左计算器插画右4点文字。竖版两槽和各自说明依次，再整宽电费卡。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。",
   "dependencies": [
    "单个screenshot块需只输出指定截图，否则两次调用重复全部截图/热区。",
    "电表主插画与计算器卡插画须分配不同素材，不能重复主图。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-04-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "电费怎么算的 \n电量＝CPU功率＋显卡功率，按实际采样间隔累加；中间断了超过60秒的不往里算。不含主板、风扇、灯、显示器和电源自己的损耗，所以比插座上的实际用电少。看板上的“整机功耗”是估算：在CPU和显卡之外加一条“外设/主板”（30瓦加上CPU和显卡功率的12%），插座那头再按电源效率折算；不是电表实测，和上面的电量、电费不是一个口径，两边的数不能直接比。电价默认峰段8–22点0.58元/度、谷段0.27元/度，看板顶上可以改。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/电表.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电表",
   "source_phrase": "左上角标题旁画一只小电表插画。",
   "sha256": "994d98ed1be64be3b5cca46723ad45aeeebb385c62d93d3276ccdd44a9cdd27e",
   "status": "ready",
   "original_elements": [
    "左上角标题旁画一只小电表插画"
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
   "asset": "_library/titles/title-97563dd8028280141660.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-97563dd8028280141660",
   "title_text": "看板长这样",
   "sha256": "26d021704e81ced022b0247e3385be9d99596cc05a22f864b35b5d2ae9d4911a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

看板长这样

8 月 29 日的功耗与电费诊断舱：上排是今天的电量、电费和峰谷分布，中间是整机功耗曲线，下面是最费电的程序榜。

8 月 29 日的系统压力：调度抖动、内存和换页、磁盘最高延迟、网络延迟画在同一条时间轴上，一眼看出是不是同一刻一起变坏。

**电费怎么算的**
- 电量＝CPU 功率＋显卡功率，按实际采样间隔累加；中间断了超过 60 秒的不往里算。
- 不含主板、风扇、灯、显示器和电源自己的损耗，所以比插座上的实际用电少。
- 看板上的“整机功耗”是估算：在 CPU 和显卡之外加一条“外设/主板”（30 瓦加上 CPU 和显卡功率的 12%），插座那头再按电源效率折算；不是电表实测，和上面的电量、电费不是一个口径，两边的数不能直接比。
- 电价默认峰段 8–22 点 0.58 元/度、谷段 0.27 元/度，看板顶上可以改。

::screen{#timeaudit-05 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-05",
  "section": "usage",
  "title": "卡了，问 AI",
  "scene": "横版画面：左上标题。左边约 40% 宽一幅水彩插画：一个对话气泡（里面只画三个小点）连到一张桌子，桌上摊着五张半透明的小卡片叠在同一条时间线上（一张画曲线、一张画内存条、一张画 Windows 小窗、一张画心跳线、一张画秒表），一把放大镜压在它们重叠的地方；桌子右下角一个“只看”的小眼睛图标。右边约 60% 宽：上面五个带小图标的来源条目（曲线、黑匣子、事件本子、脉搏、秒表），下面一张浅绿边框卡片“交回什么”，再下面“只给汇总”一句，最下面一行链接。",
  "portrait": "竖版：标题；插画缩成一行宽在上；五个来源一行一个；“交回什么”“只给汇总”依次在下；链接在最后。",
  "links": [
   {
    "text": "查电脑卡顿技能",
    "href": "/skills/timeaudit-diagnostics/"
   }
  ],
  "anchors": [
   {
    "id": "stutter",
    "text": "卡了，问 AI"
   }
  ],
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
     "size": "large",
     "align": "left",
     "row": "diagnosis-heading",
     "text_ref": "卡了，问AI",
     "width": "70%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "row": "diagnosis-heading",
     "text_ref": "说一句“刚才卡了”，AI用电脑配置与恢复的卡顿总诊断，把这几"
    },
    {
     "type": "illustration",
     "row": "diagnosis-heading",
     "width": "30%",
     "target_width": "100%",
     "align": "right"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "icons": "auto",
     "text_ref": "这里的历史摘要：那段时间记录全不全、最长空档多久，温度、功率",
     "illustration": "left_inside",
     "last_full_width": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "text_ref": "交回什么：结论、出事的时间段、最关键的几个数、哪里没有证据、",
     "row": "diagnosis-result",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ],
     "text_ref": "只给汇总：查卡顿用的这几个入口只回数字，从不返回程序名、窗口",
     "row": "diagnosis-result",
     "width": "50%"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、一个用真实数字的完整例子：查电脑卡顿技能"
    }
   ],
   "notes": "横图标题/导语/大桌面插画同在左46%，右54%五来源横条+交回什么卡+只给汇总卡+链接卡从顶部依次；插画在卡外，来源小图在卡内左。竖原图是标题→大插画→导语→5来源→交回→只给汇总→链接；导语不是放插画前。原图眼睛下面只看字不在定稿，不能保留带字插画。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "bullets五项需分5张左图右文横条；当前all-lead为False时只成一整组清单。",
    "交回什么/只给汇总段为para，卡头须从定稿原词识别，不新增字。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-05-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "卡了，问AI"
    },
    {
     "type": "illustration"
    },
    {
     "type": "prose",
     "text_ref": "说一句“刚才卡了”，AI用电脑配置与恢复的卡顿总诊断，把这几"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "text_ref": "这里的历史摘要：那段时间记录全不全、最长空档多久，温度、功率",
     "illustration": "left_inside"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "text_ref": "交回什么：结论、出事的时间段、最关键的几个数、哪里没有证据、"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ],
     "text_ref": "只给汇总：查卡顿用的这几个入口只回数字，从不返回程序名、窗口"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "跟AI怎么说、一个用真实数字的完整例子：查电脑卡顿技能"
    }
   ],
   "notes": "横图标题/导语/大桌面插画同在左46%，右54%五来源横条+交回什么卡+只给汇总卡+链接卡从顶部依次；插画在卡外，来源小图在卡内左。竖原图是标题→大插画→导语→5来源→交回→只给汇总→链接；导语不是放插画前。原图眼睛下面只看字不在定稿，不能保留带字插画。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "bullets五项需分5张左图右文横条；当前all-lead为False时只成一整组清单。",
    "交回什么/只给汇总段为para，卡头须从定稿原词识别，不新增字。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-05-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "这里的历史摘要：那段时间记录全不全、最长空档多久，温度、功率、内存、磁盘延迟、网络的范围，帧率和超过 50 毫秒的卡顿帧有几次。",
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
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "秒表",
   "source_phrase": "Windows 内存黑匣子：系统自带的性能日志，看内存是不是吃紧到卡死。",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
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
   "source_phrase": "系统事件：那段时间有没有程序崩溃、驱动或磁盘报错。",
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
   "asset": "_library/icons/心形.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "心形",
   "source_phrase": "运行健康：记录现在还在不在写，每次都查。",
   "sha256": "db3d0fe685ec9faa104fd819f19c021113f854175bb9db72c1d232ab24af8904",
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
   "source_phrase": "现场采样：只在查的时间段 2 分钟内刚结束时才采，几秒钟的整机 CPU、内存、换页和磁盘延迟；只说明现在，不证明刚才为什么卡。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "时钟",
   "source_phrase": "交回什么：结论、出事的时间段、最关键的几个数、哪里没有证据、下一步值得查什么。",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "只给汇总：查卡顿用的这几个入口只回数字，从不返回程序名、窗口标题、命令行和网址。",
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
   "asset": "_library/illustrations/性能证据通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "性能证据通用构图",
   "source_phrase": "左边约 40% 宽一幅水彩插画：一个对话气泡（里面只画三个小点）连到一张桌子，桌上摊着五张半透明的小卡片叠在同一条时间线上（一张画曲线、一张画内存条、一张画 Windows 小窗、一张画心跳线、一张画秒表），一把放大镜压在它们重叠的地方；桌子右下角一个“只看”的小眼睛图标。",
   "sha256": "2e7d2b561c1c035b6d6af2ae285947564c16c067fb16ac18cd0fb7d5e3e0f0b1",
   "status": "ready",
   "original_elements": [
    "一个对话气泡（里面只画三个小点）连到一张桌子，桌上摊着五张半透明的小卡片叠在同一条时间线上（一张画曲线、一张画内存条、一张画 Windows 小窗、一张画心跳线、一张画秒表），一把放大镜压在它们重叠的地方；桌子右下角一个抽象图形的小眼睛图标"
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
   "asset": "_library/titles/title-f26a006fb9e334ec321d.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f26a006fb9e334ec321d",
   "title_text": "卡了，问 AI",
   "sha256": "a0bf5bb2765e90c50299483f3c5b4bf8026be84321d1f2c5530d3a426b86bc78",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

卡了，问 AI

说一句“刚才卡了”，AI 用电脑配置与恢复的卡顿总诊断，把这几路证据对到同一段时间：
- **这里的历史摘要**：那段时间记录全不全、最长空档多久，温度、功率、内存、磁盘延迟、网络的范围，帧率和超过 50 毫秒的卡顿帧有几次。
- **Windows 内存黑匣子**：系统自带的性能日志，看内存是不是吃紧到卡死。
- **系统事件**：那段时间有没有程序崩溃、驱动或磁盘报错。
- **运行健康**：记录现在还在不在写，每次都查。
- **现场采样**：只在查的时间段 2 分钟内刚结束时才采，几秒钟的整机 CPU、内存、换页和磁盘延迟；只说明现在，不证明刚才为什么卡。

**交回什么**：结论、出事的时间段、最关键的几个数、哪里没有证据、下一步值得查什么。
**只给汇总**：查卡顿用的这几个入口只回数字，从不返回程序名、窗口标题、命令行和网址。

跟 AI 怎么说、一个用真实数字的完整例子：〔查电脑卡顿技能〕

::screen{#timeaudit-06 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-06",
  "section": "usage",
  "title": "找回复制过的东西",
  "scene": "横版画面：左上标题。左边约 45% 宽一幅水彩插画：一个剪贴板上夹着几张便签，便签上只画浅灰短线；一只手从一叠便签里抽出一张；旁边一枚回形针、一只放大镜；剪贴板夹子上挂着一个小标签（标签上画一把小锁，不画字）。右边约 55% 宽六条带小水彩图标的条目（通知铃、筛子、放大镜、钥匙形警示牌、硬盘、暂停键），每条粗体小标题加一两行小字。最下面一条浅绿底细长卡片放数字那句，右端画成链接的按钮。",
  "portrait": "竖版：标题；插画在上缩成一行宽；六条一行一条；数字卡片和链接在最后。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   }
  ],
  "anchors": [
   {
    "id": "clipboard",
    "text": "找回复制过的东西"
   }
  ],
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
     "size": "large",
     "align": "left",
     "row": "clipboard-heading",
     "text_ref": "找回复制过的东西",
     "width": "70%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "clipboard-heading",
     "width": "30%",
     "target_width": "100%",
     "align": "right"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "怎么记Windows一有新复制就通知它，不轮询、不装键盘钩子"
    },
    {
     "type": "notice",
     "tone": "green",
     "link_style": "button",
     "text_ref": "8月31日记下5,234次复制，到10月23日10:25累计12,134次。不同的内容4,631份，同样的内容只存一份。密码中心"
    }
   ],
   "notes": "横版39%左标题+剪贴板大图，61%右六条单列图文卡，图在卡内左，最下数字和密码中心链接一条窄卡；竖原图先标题大图，首张含怎么记/不记什么2卡，v2接其余4卡和数字窄卡；续图不重复标题。6条不得合为一张长卡，数字和链接不可重复。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "六条**标题**｜正文是para，每条规格独立卡；须识别卡头但保留原逐字文本。",
    "notice需原单段链接按钮化，只输出1次。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-06-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "找回复制过的东西"
    },
    {
     "type": "illustration"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "怎么记Windows一有新复制就通知它，不轮询、不装键盘钩子"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "不记什么复制时带了“不进剪贴板历史”标记的一律不存，比如从密"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "怎么找开始菜单点“TimeAudit剪贴板历史”，打开的是密"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "疑似密钥看着像API密钥、令牌、恢复码的单独归一类，提醒小心"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "存在哪E盘一个私有的SQLite数据库（带全文搜索），和性能"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "暂停在同一个标签里可以暂停记录，恢复后从当下重新算起。"
    },
    {
     "type": "notice",
     "tone": "green",
     "link_style": "button",
     "text_ref": "8月31日记下5,234次复制，到10月23日10:25累计12,134次。不同的内容4,631份，同样的内容只存一份。密码中心"
    }
   ],
   "notes": "横版39%左标题+剪贴板大图，61%右六条单列图文卡，图在卡内左，最下数字和密码中心链接一条窄卡；竖原图先标题大图，首张含怎么记/不记什么2卡，v2接其余4卡和数字窄卡；续图不重复标题。6条不得合为一张长卡，数字和链接不可重复。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "六条**标题**｜正文是para，每条规格独立卡；须识别卡头但保留原逐字文本。",
    "notice需原单段链接按钮化，只输出1次。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-06-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "怎么记｜Windows 一有新复制就通知它，不轮询、不装键盘钩子。只存文字、http(s) 链接和普通文件路径；图片、二进制、太大的内容只记“这时复制过一次”，不存内容。开机、解锁后从当下算起，不把之前留在剪贴板里的补进来。",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "不记什么｜复制时带了“不进剪贴板历史”标记的一律不存，比如从密码中心复制的密码。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "怎么找｜开始菜单点“TimeAudit 剪贴板历史”，打开的是密码中心里的“剪贴板历史”标签。个人资料锁着时列表是空的，验证解锁后才显示。按关键词、日期、类型（文字、链接、文件路径、疑似密钥）筛，同样的内容合成一条并写复制了几次，点一下再次复制。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "疑似密钥｜看着像 API 密钥、令牌、恢复码的单独归一类，提醒小心；只看格式，不保证都认得出。",
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "存在哪｜E 盘一个私有的 SQLite 数据库（带全文搜索），和性能数据库、图表完全分开；每天 18:25 一致备份到 G 盘。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "暂停｜在同一个标签里可以暂停记录，恢复后从当下重新算起。",
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
   "asset": "_library/illustrations/性能证据通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "性能证据通用构图",
   "source_phrase": "左边约 45% 宽一幅水彩插画：一个剪贴板上夹着几张便签，便签上只画浅灰短线；一只手从一叠便签里抽出一张；旁边一枚回形针、一只放大镜；剪贴板夹子上挂着一个小标签（标签上画一把小锁，不画字）。",
   "sha256": "2e7d2b561c1c035b6d6af2ae285947564c16c067fb16ac18cd0fb7d5e3e0f0b1",
   "status": "ready",
   "original_elements": [
    "一个剪贴板上夹着几张便签，便签上只画浅灰短线；一只手从一叠便签里抽出一张；旁边一枚回形针、一只放大镜；剪贴板夹子上挂着一个小标签（标签上画一把小锁，不画字"
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
   "asset": "_library/titles/title-4dc1add24e1dfa4a3a95.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4dc1add24e1dfa4a3a95",
   "title_text": "找回复制过的东西",
   "sha256": "1c3297434a874fd99116915e89162416bb9a1d2fb47dc23e650116e2449e8bb5",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

找回复制过的东西

**怎么记**｜Windows 一有新复制就通知它，不轮询、不装键盘钩子。只存文字、http(s) 链接和普通文件路径；图片、二进制、太大的内容只记“这时复制过一次”，不存内容。开机、解锁后从当下算起，不把之前留在剪贴板里的补进来。
**不记什么**｜复制时带了“不进剪贴板历史”标记的一律不存，比如从密码中心复制的密码。
**怎么找**｜开始菜单点“TimeAudit 剪贴板历史”，打开的是密码中心里的“剪贴板历史”标签。个人资料锁着时列表是空的，验证解锁后才显示。按关键词、日期、类型（文字、链接、文件路径、疑似密钥）筛，同样的内容合成一条并写复制了几次，点一下再次复制。
**疑似密钥**｜看着像 API 密钥、令牌、恢复码的单独归一类，提醒小心；只看格式，不保证都认得出。
**存在哪**｜E 盘一个私有的 SQLite 数据库（带全文搜索），和性能数据库、图表完全分开；每天 18:25 一致备份到 G 盘。
**暂停**｜在同一个标签里可以暂停记录，恢复后从当下重新算起。

8 月 31 日记下 5,234 次复制，到 10 月 23 日 10:25 累计 12,134 次。不同的内容 4,631 份，同样的内容只存一份。〔密码中心〕

::screen{#timeaudit-07 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-07",
  "section": "usage",
  "title": "时间花在哪",
  "scene": "横版画面：左上标题。左边约一半宽一幅水彩插画：一张一周的热力格子（七列、二十四行的小方格，深浅不一的绿色，格子里不画字），格子上方一个小沙漏，旁边一个人离开椅子的剪影和一只放在桌上的耳机（表示放声音不算离开）。右边约一半宽三块带标题的小卡片从上到下排。",
  "portrait": "竖版：标题；插画缩成一行宽；三块卡片一行一块。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/skills/daily-preferences/"
   }
  ],
  "anchors": [
   {
    "id": "screen-time",
    "text": "时间花在哪"
   }
  ],
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
     "size": "large",
     "align": "left",
     "text_ref": "时间花在哪"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "text_ref": "看图：“屏幕使用时间”看板，每天开机多久（去掉睡眠）、人在电",
     "row": "lone-ill-1",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "lone-ill-1",
     "width": "40%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png"
     ],
     "text_ref": "问AI：“那天我都用了哪些软件”由个人理解库来答：它按完整时"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "口径"
    }
   ],
   "notes": "横原图左49%标题和热力格子/椅子耳机大图，右51%看图、问AI、口径3卡纵排，每卡左小图右字；竖原图标题、大图、同3卡依次；口径的4点完整保留。无卡间丝带/箭头。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "看图和问AI为para须识别卡头，口径group+bullets同卡；不能新增看图/问AI重复标签。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-07-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "时间花在哪"
    },
    {
     "type": "illustration"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "text_ref": "看图：“屏幕使用时间”看板，每天开机多久（去掉睡眠）、人在电"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png"
     ],
     "text_ref": "问AI：“那天我都用了哪些软件”由个人理解库来答：它按完整时"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "口径"
    }
   ],
   "notes": "横原图左49%标题和热力格子/椅子耳机大图，右51%看图、问AI、口径3卡纵排，每卡左小图右字；竖原图标题、大图、同3卡依次；口径的4点完整保留。无卡间丝带/箭头。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "看图和问AI为para须识别卡头，口径group+bullets同卡；不能新增看图/问AI重复标签。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-07-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "时钟",
   "source_phrase": "看图：“屏幕使用时间”看板，每天开机多久（去掉睡眠）、人在电脑前多久、各软件用了多久和分类占比、连续5分钟以上的专注时段、每天几点最活跃、本周比上周。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "问AI：“那天我都用了哪些软件”由个人理解库来答：它按完整时段和北京时间每一天，交回各软件前台时长、离开、锁屏、睡眠和没记到的空档。这属于个人资料，要先验证解锁才读。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/热力格子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "热力格子",
   "source_phrase": "左边约一半宽一幅水彩插画：一张一周的热力格子（七列、二十四行的小方格，深浅不一的绿色，格子里不画字），格子上方一个小沙漏，旁边一个人离开椅子的剪影和一只放在桌上的耳机（表示放声音不算离开）。",
   "sha256": "4efb691c4acee75f1102bffb14d87f50e8975eea509921c9e67327e7266ea597",
   "status": "ready",
   "original_elements": [
    "一张一周的热力格子（七列、二十四行的小方格，深浅不一的绿色，格子里不画字），格子上方一个小沙漏，旁边一个人离开椅子的剪影和一只放在桌上的耳机（表示放声音不算离开"
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
   "asset": "_library/titles/title-dd00907c6539fea8f3b2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-dd00907c6539fea8f3b2",
   "title_text": "时间花在哪",
   "sha256": "df3efdfd926ae0884f090701b90c52b37ad08302d4f90f107781077ce0ce711e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

时间花在哪

**看图**：“屏幕使用时间”看板，每天开机多久（去掉睡眠）、人在电脑前多久、各软件用了多久和分类占比、连续 5 分钟以上的专注时段、每天几点最活跃、本周比上周。

**问 AI**：“那天我都用了哪些软件”由〔个人理解库〕来答：它按完整时段和北京时间每一天，交回各软件前台时长、离开、锁屏、睡眠和没记到的空档。这属于个人资料，要先验证解锁才读。

**口径**
- 两条记录各管各的：采集主程序记前台窗口，窗口记录器记人在不在；两边不相加。
- 同一段时间只算一次，重叠的先合并（为什么见“亮点”）。
- 怎么算“离开”见“亮点”；这是设备观察，不等于人在不在场、在不在工作。
- 窗口记录器正常时最多约 30 秒封存一段再写进数据库，所以最新的记录会落后几十秒；突然断电可能丢掉最后这一小段。

::screen{#timeaudit-08 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-08",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。一张两列八行的水彩表格（左列“遇到”，右列“怎么办”），左列每格前一个小水彩图标（空白的曲线图、一只躺着不动的小狗、一轮月亮、一只手柄上画着问号、一支温度计上画着空圈、一张打叉的纸、一朵断开的云、两台电脑）。右上角画一只小急救箱。",
  "portrait": "竖版：标题；表格改成八张小卡片一行一张：粗体写“遇到”那一格，下面一段写“怎么办”。",
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
     "size": "large",
     "align": "left",
     "row": "rescue-head",
     "width": "64%",
     "text_ref": "出事怎么办",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "rescue-head",
     "width": "36%"
    },
    {
     "type": "table",
     "columns": 2,
     "columns_v": 1,
     "variant": "table",
     "illustration": "left_inside",
     "icons": "auto",
     "column_widths": [
      "38%",
      "62%"
     ],
     "icon_items": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7
     ],
     "text_ref": "遇到怎么办看板没有新数据先看右上角时间范围选对没有；再双击项"
    }
   ],
   "notes": "横图标题左上、急救箱图独立右上，下面两列8行表，左列小图与遇到，右怎么办。竖原图标题下面独立故障拼图，第1续图4张左图右文卡，v2其余4张无图卡；按定稿保留全部表头原文一次，不自行重复字段字。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "竖table需前4有图后4无图的逐项方式；当前只有统一show_icons。",
    "竖主拼图不是横版单急救箱，要有对应方向独立无字素材。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-08-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "出事怎么办"
    },
    {
     "type": "illustration"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "variant": "row_cards",
     "illustration": "left_inside",
     "icons": "auto",
     "column_widths": [
      "38%",
      "62%"
     ],
     "icon_items": [
      0,
      1,
      2,
      3
     ],
     "text_ref": "遇到怎么办看板没有新数据先看右上角时间范围选对没有；再双击项"
    }
   ],
   "notes": "横图标题左上、急救箱图独立右上，下面两列8行表，左列小图与遇到，右怎么办。竖原图标题下面独立故障拼图，第1续图4张左图右文卡，v2其余4张无图卡；按定稿保留全部表头原文一次，不自行重复字段字。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "竖table需前4有图后4无图的逐项方式；当前只有统一show_icons。",
    "竖主拼图不是横版单急救箱，要有对应方向独立无字素材。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-08-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "source_phrase": "空白的曲线图",
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
   "source_phrase": "一只躺着不动的小狗",
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
   "asset": "_library/icons/月亮.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "月亮",
   "source_phrase": "一轮月亮",
   "sha256": "3090c7fea0ea7b70f7c3bdb84f9b8371e7bf6d5cb3f3cfcf3bfc383c51a98c86",
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
   "source_phrase": "一只手柄上画着问号",
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
   "source_phrase": "一支温度计上画着空圈",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张打叉的纸",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一朵断开的云",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "两台电脑",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-timeaudit",
   "source_phrase": "横版画面：左上标题。一张两列八行的水彩表格（左列“遇到”，右列“怎么办”），左列每格前一个小水彩图标（空白的曲线图、一只躺着不动的小狗、一轮月亮、一只手柄上画着问号、一支温度计上画着空圈、一张打叉的纸、一朵断开的云、两台电脑）。右上角画一只小急救箱。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
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
  }
 ]
}
```

出事怎么办

| 遇到 | 怎么办 |
|---|---|
| 看板没有新数据 | 先看右上角时间范围选对没有；再双击项目里的“检查运行状态.vbs”，或问 AI“TimeAudit 现在正常吗”，看是哪一段停了 |
| 程序还在，图不动了 | 不用管，看门狗会自己重启它（见“亮点”） |
| 睡了一觉，图上空一段 | 睡眠、关机那段本来就没有数据，不补；分不清是睡着还是断了，问 AI |
| 游戏没有帧率 | 没开游戏时显示“空闲等待”是正常的；开着游戏也没有，才是采集的问题 |
| 显卡热点温度一直空着 | 不是图坏了：这张 RTX 5090 D 的传感器只给核心温度和显存温度，不给核心热点，看板上算“不支持”；也不拿显存温度顶替（见“亮点”） |
| 每日备份报失败 | 看项目里的备份日志：数据库和看板设置是两步，一步失败不影响另一步 |
| 外网图表打不开 | 电脑关机或 Docker 没起来时打不开；Docker 整个退出时，看门狗按原来的开机任务把它拉起来；Docker 开着却明确显示“已停止”满 10 分钟，看门狗会试一次限时重启，同一次故障只试一次（10 月 20 日加的，还没演练过） |
| 换电脑、重装系统 | 照仓库里的《快速部署》重装，再从 G 盘备份恢复数据库；可以先在隔离的临时库里演练一遍 |

::screen{#timeaudit-02 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-02",
  "section": "usage",
  "title": "每天在后台发生什么",
  "scene": "横版画面：左上标题。中间一条从左到右的水彩时间带（像一天的日程条，左端画一个登录的钥匙、右端画一轮小月亮），时间带上方和下方交错挂着八张小卡片，每张卡片用细线连到时间带上，卡片里粗体小标题（“登录时”“每 1 秒”这类）加一两行小字，左上角一个小水彩图标（依次：一把钥匙、一只秒表、一个放大镜照着一排小方块、一扇窗户和一个离开的小人、一只守门的小狗、一个整理抽屉的手、一个硬盘和 GitHub 小猫、一枚回形针和硬盘）。最下面一条浅绿底的小结横跨整屏。",
  "portrait": "竖版：标题；时间带改成竖的，从上到下，八张卡片一行一张挂在右侧；小结在最后。",
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
     "size": "medium",
     "align": "center",
     "text_ref": "每天在后台发生什么"
    },
    {
     "type": "timeline",
     "columns": 4,
     "columns_v": 1,
     "variant": "day_band",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      4,
      4
     ],
     "band_placement": "between_rows",
     "text_ref": "登录时计划任务悄悄拉起Docker里的数据库和图表、采集主程"
    },
    {
     "type": "notice",
     "tone": "green",
     "illustration": "left_inside",
     "text_ref": "平时什么都不用管。想看就打开图表；想问就直接跟AI说。",
     "icons": [
      "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png"
     ]
    }
   ],
   "notes": "实看横图是4卡在日程横带上方、4卡在下方，分别上下细线接绿色时间带，顺序前4再后4；末尾整宽提示条。竖图左绿点时间带、右单列8卡，v首3项有左图，v2后5项无图；标题整宽按追加要求居中。不能按scene含糊说明改成8卡同一排。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "timeline需支持8个para作为独立时间卡与4/4挂卡；现节点不是steps/bullets。",
    "各项名称已在定稿粗体里，不加时间点或编号。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-02-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "medium",
     "align": "center",
     "text_ref": "每天在后台发生什么"
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "variant": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "band_placement": "left",
     "text_ref": "登录时计划任务悄悄拉起Docker里的数据库和图表、采集主程",
     "direction": "vertical"
    },
    {
     "type": "notice",
     "tone": "green",
     "illustration": "left_inside",
     "text_ref": "平时什么都不用管。想看就打开图表；想问就直接跟AI说。",
     "icons": [
      "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png"
     ]
    }
   ],
   "notes": "实看横图是4卡在日程横带上方、4卡在下方，分别上下细线接绿色时间带，顺序前4再后4；末尾整宽提示条。竖图左绿点时间带、右单列8卡，v首3项有左图，v2后5项无图；标题整宽按追加要求居中。不能按scene含糊说明改成8卡同一排。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮修正row_counts为八排一项，防止显式分排覆盖竖向单列。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "timeline需支持8个para作为独立时间卡与4/4挂卡；现节点不是steps/bullets。",
    "各项名称已在定稿粗体里，不加时间点或编号。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-02-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "依次：一把钥匙",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "秒表",
   "source_phrase": "一只秒表",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
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
   "source_phrase": "一个放大镜照着一排小方块",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一扇窗户和一个离开的小人",
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
   "source_phrase": "一只守门的小狗",
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件柜",
   "source_phrase": "一个整理抽屉的手",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "GitHub标志",
   "source_phrase": "一个硬盘和 GitHub 小猫",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "外接硬盘",
   "source_phrase": "一枚回形针和硬盘",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "柱状图",
   "source_phrase": "平时什么都不用管。想看就打开图表；想问就直接跟AI说。",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "柱状图",
   "source_phrase": "平时什么都不用管。想看就打开图表；想问就直接跟AI说。",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-0b60834985c2a3a3693c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0b60834985c2a3a3693c",
   "title_text": "每天在后台发生什么",
   "sha256": "c9337d89b03b00345e1efdede6ef3c924a0db1c177a22c72807381910921f549",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

每天在后台发生什么

**登录时**｜计划任务悄悄拉起 Docker 里的数据库和图表、采集主程序、窗口记录器；硬件传感器 LibreHardwareMonitor 和剪贴板记录器也各自随登录启动。
**每 1 秒**｜记一条整机硬件：CPU 和显卡的温度、功率、频率、电压、占用，内存和换页，磁盘延迟和读写，网速、网络延迟和丢包，还有前台游戏的帧率。
**每 3 秒**｜清点所有在跑的程序：各占多少 CPU、显卡、内存、显存、磁盘和网络；谁启动、谁退出另外随时记。这一拍慢了就跳过，不拖住每秒那条。
**一直**｜窗口记录器记前台是哪个程序，人离开、锁屏、息屏、睡眠各记各的。
**每分钟**｜两只看门狗分别照看采集和剪贴板记录（怎么照看见“亮点”）。
**每 10 分钟**｜采集看门狗顺手把今天、昨天 CPU 和显卡大约用了几度电写成一份小回执，给驾驶舱读；只算这两样，不是整机电费。
**每 12 小时**｜采集程序自己整理数据库：提前建好下一段时间的存储分格（大表按周、按月分格存）；超过 60 天的逐程序明细，先汇总成按小时、按天的统计再删。
**每天 11:40**｜整个数据库备份到 G 盘，看板设置导出存进 GitHub 仓库（6 张主看板，加 3 张公开状态小看板）。
**每天 18:25**｜剪贴板记录备份到 G 盘。

平时什么都不用管。想看就打开图表；想问就直接跟 AI 说。

::screen{#timeaudit-09 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-09",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
  "portrait": "竖版：标题；六个节点改成从上到下排，箭头向下，看门狗节点放在最后并写明它照看前面几个；剪贴板记录单独一块；给 AI 的入口卡片；最后一行小字。",
  "links": [
   {
    "text": "远程控制电脑",
    "href": "/projects/remote-control/",
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
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "branches": [
      {
       "item": 6,
       "placement": "below",
       "connector": "dashed_arrow",
       "targets": [
        1,
        2,
        3,
        4
       ]
      }
     ],
     "text_ref": "1. **窗口记录器**｜一个 AutoHotkey 小脚本：记前台程序、离开、锁屏、息屏、睡眠，写成一个个小文件；Docker 里的入库程序整批写进数据库，写成功才删文件。",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "variant": "isolated_dashed",
     "connector": "none",
     "text_ref": "剪贴板记录是单独一条：Python小程序写自己的SQLite"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "footer",
     "width": "68%",
     "text_ref": "给AI的三个只读入口：现在正不正常（运行健康）、某段时间怎么"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "footer",
     "width": "32%",
     "text_ref": "代码、看板设置都在公开的GitHub仓库；数据库、剪贴板和日"
    }
   ],
   "notes": "横图标题居中；上5圆角节点横排有绿实箭头，6看门狗居下方用虚线回接前面；剪贴板独立右下虚线框，绝不能连到主流程。下方给AI入口宽卡68%、GitHub说明32%同排。竖图标题下先无字主流程2排小示意（4上2下＋独立剪贴板），再节点文字单列6卡、剪贴板卡、AI入口卡、仓库说明。所有编号与标签来自定稿；图里不重复写编号/说明。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "flow steps同一节点需内部5+1并带回接箭头；不能拆steps内部text_ref。",
    "竖版顶部无字概览插画需另素材，不重复带字节点。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-09-contact.png",
    "scope": "前任遗留证据，本轮未看图"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "size": "large",
     "align": "center",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "illustration",
     "size": "banner"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "branches": [
      {
       "item": 6,
       "placement": "below",
       "connector": "dashed_arrow",
       "targets": [
        1,
        2,
        3,
        4
       ]
      }
     ],
     "text_ref": "1. **窗口记录器**｜一个 AutoHotkey 小脚本：记前台程序、离开、锁屏、息屏、睡眠，写成一个个小文件；Docker 里的入库程序整批写进数据库，写成功才删文件。",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "variant": "isolated_dashed",
     "connector": "none",
     "text_ref": "剪贴板记录是单独一条：Python小程序写自己的SQLite"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "给AI的三个只读入口：现在正不正常（运行健康）、某段时间怎么"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "代码、看板设置都在公开的GitHub仓库；数据库、剪贴板和日"
    }
   ],
   "notes": "横图标题居中；上5圆角节点横排有绿实箭头，6看门狗居下方用虚线回接前面；剪贴板独立右下虚线框，绝不能连到主流程。下方给AI入口宽卡68%、GitHub说明32%同排。竖图标题下先无字主流程2排小示意（4上2下＋独立剪贴板），再节点文字单列6卡、剪贴板卡、AI入口卡、仓库说明。所有编号与标签来自定稿；图里不重复写编号/说明。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。；diagram_overview由现成banner独立总览图层落实。",
   "dependencies": [
    "flow steps同一节点需内部5+1并带回接箭头；不能拆steps内部text_ref。",
    "竖版顶部无字概览插画需另素材，不重复带字节点。"
   ],
   "visual_review": {
    "method": "view_image逐屏横竖及全部续图构图核验",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\timeaudit-09-contact.png",
    "scope": "前任遗留证据，本轮未看图"
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
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "数据库",
   "source_phrase": "回形针和一个小数据库",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-timeaudit-window-person.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-timeaudit-window-person",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "284af24ff9885a93ab5672c8cc32d9a1dcd44edc3debc2ec020d8fbbc3fc0c35",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-timeaudit-four-gear-machine.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-timeaudit-four-gear-machine",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "35fde0803039e4e9aff7d09f49fb4c83893aaf46d396ccbe3ba3a9b8aaa2ce51",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-timeaudit-board-thermometer-gpu.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-timeaudit-board-thermometer-gpu",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "3d2deba60ccedb33bd3c1925453d3c1b6eb3da2759e930a05c84bb35e10426c6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-timeaudit-database.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-timeaudit-database",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "4b10cd1b4a0a464ebe9c66a037c5a1d5fdae0049634660c22d100bd0f311e142",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-timeaudit-chart-grafana.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-timeaudit-chart-grafana",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "c2916fff473d4818405c18813fcdf01c089e7510abc9a58137cdfb66b0d32dfb",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-timeaudit-watchdog.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-timeaudit-watchdog",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "98faba89bb68499312f8b034d7a46a8670378e643cc266d9b1ce7505fbc9c96c",
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
    "v"
   ],
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-timeaudit",
   "source_phrase": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一扇窗户和一个小人、一台带四个小齿轮的机器、一块主板上插着温度计和显卡、一个圆柱形数据库、一块画着曲线的屏幕和 Grafana 橙色标志、一只守门的小狗），绿色箭头依次连起来；看门狗节点画在流程下方，用虚线箭头指向前面几个节点。流程下方另起一条细虚线框，里面一个节点“剪贴板记录”（图标：回形针和一个小数据库），和上面的流程不相连。下半部分一张浅绿底卡片“给 AI 的三个只读入口”。最下面一行小字，左边画 GitHub 小猫标志。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
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
  }
 ]
}
```

它是怎么搭的

1. **窗口记录器**｜一个 AutoHotkey 小脚本：记前台程序、离开、锁屏、息屏、睡眠，写成一个个小文件；Docker 里的入库程序整批写进数据库，写成功才删文件。
2. **采集主程序**｜Python 写的，分四个小工：整机硬件和帧率、每个程序的资源、前台窗口、程序启停。同一时间只准跑一个。
3. **数据从哪来**｜CPU 温度、功率、电压读 LibreHardwareMonitor 的本机接口（它是单独的登录任务，这里只读）；显卡读 NVIDIA NVML；磁盘延迟读 Windows 性能计数器；网络延迟轮流测国内外三个公共 DNS 服务器；帧率先读 RTSS（RivaTuner 的帧率统计），读不到才开微软的 PresentMon。
4. **数据库**｜PostgreSQL 15，跑在 Docker 里，大表按周或按月分区。本机端口默认 45432，10 月 20 日起特意仍对所有网卡开放，留着经 Tailscale 从别的设备连库的入口；防火墙怎么挡这次没核对。
5. **图表**｜Grafana 13.0.2，也跑在 Docker 里，经〔远程控制电脑〕那条 Cloudflare 隧道开放成 grafana.wly0829.cn；本机端口 43000 从 10 月 20 日起只绑本机回环地址，局域网里别的设备直连不到。六张主看板 10 月 16 日起存成 Grafana 的 V2 新格式（共 80 个图），备份和恢复都按这种格式处理。硬件、流畅度、功耗、取证、资源这五张主看板默认只查当前状态的那几行，累计和历史图放在标着“展开”的折叠行里，展开才发查询；屏幕使用时间看板没有折叠行，照旧一打开全部显示。公开状态小看板的查询也精简了，例如网络曲线只查最近 24 小时，时间粒度到一小时以上时改读小时汇总，不逐条扫原始明细（提交 d4cb949，10 月 11 日）。
6. **看门狗**｜PowerShell 计划任务，每分钟照看前面几样；Docker 明确显示“已停止”连续满 10 分钟，才试一次限时重启，同一次故障不重复。另外最多每 10 分钟用只读查询，把今天和昨天的 CPU package 功率加显卡板卡功率按时间积分成度数（两条记录间隔 60 秒以上的那段不算），按北京时间切日，写成 `log/power-today.json`（格式 timeaudit.power-today.v1）；驾驶舱那边的 PCConfig 只读这份回执，不再自己调 Docker 查库（提交 ca3e2db）。它是 CPU 和显卡的估算，不是整机墙插电费。

**剪贴板记录**是单独一条：Python 小程序写自己的 SQLite，不经过上面任何一环，坏了也互不影响。

**给 AI 的三个只读入口**：现在正不正常（运行健康）、某段时间怎么样（历史诊断摘要）、某天用了什么（个人活动读取，要先解锁个人资料）。前两个只回数字，不回程序名和窗口标题。

代码、看板设置都在公开的 GitHub 仓库；数据库、剪贴板和日志只在本机。

::screen{#timeaudit-10 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-10",
  "section": "tech",
  "title": "存多久、占多大",
  "scene": "横版画面：左上标题。左边约 60% 宽一张水彩表格（四列八行，表头浅绿底，每行左边一个小水彩图标：秒表、一叠小方块、一本按月装订的账本、一扇进出的门、一本登记册、一扇窗户、一个离开的小人、一个圆柱数据库）。右边约 40% 宽一幅插画：一排按周分隔的抽屉，最左边几格已经抽空，只剩一张写满短线的小卡片（汇总），抽屉下方一块硬盘，旁边标着 G（只画字母 G）；插画下面一张浅绿边框卡片“备份”，三条短句。",
  "portrait": "竖版：标题；表格改成八张小卡片一行一张（粗体写“记录”，下面三行“多少”“占多大”“留多久”）；插画缩小；备份卡片在最后。",
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
     "connector": "none",
     "row": "storage",
     "width": "58%",
     "size": "medium",
     "illustration": "none",
     "text_ref": "存多久、占多大"
    },
    {
     "type": "table",
     "align": "left",
     "connector": "none",
     "row": "storage",
     "columns": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "记录"
    },
    {
     "type": "prose",
     "align": "left",
     "connector": "none",
     "row": "storage",
     "illustration": "none",
     "text_ref": "表里的大小都是10月23日10:25同一次读取的；条数是另外几次分开数的，各有各的时点，不是和大小同一次读的。按小时汇总、前台窗口会话、窗口记录器的区间这三项是10月23日10:25重新数的精确数。整"
    },
    {
     "type": "illustration",
     "align": "left",
     "connector": "none",
     "row": "storage",
     "width": "42%",
     "index": 0
    },
    {
     "type": "bullet_list",
     "align": "left",
     "connector": "none",
     "row": "storage",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "备份",
     "item_images": [
      "_library/fix-round-2/icon-clean-2db81b37cc1897643c6f.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "左栏标题、四列八行表格、数字说明依次纵排；右栏顶部抽屉和G盘插画在卡外，下面整张备份卡，卡头小云在左。原图标题只占左栏，不作为整屏标题居中。表格与备份卡均不得缩字。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "缺合格抽屉/G盘大插画：资产清单 extracted illustration=0。",
    "表格每行小图标仅提取5/8；备份卡头图标不应挤占正文。"
   ],
   "visual_layout": {
    "columns": [
     58,
     42
    ],
    "left": [
     "title",
     "table 8 rows",
     "caption"
    ],
    "right": [
     "outside illustration",
     "backup card"
    ],
    "connectors": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 5,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "存多久、占多大"
    },
    {
     "type": "illustration",
     "align": "left",
     "connector": "none",
     "index": 0
    },
    {
     "type": "table",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "portrait_mode": "row_cards",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "记录",
     "columns_v": 1
    },
    {
     "type": "prose",
     "align": "left",
     "connector": "none",
     "illustration": "none",
     "text_ref": "表里的大小都是10月23日10:25同一次读取的；条数是另外几次分开数的，各有各的时点，不是和大小同一次读的。按小时汇总、前台窗口会话、窗口记录器的区间这三项是10月23日10:25重新数的精确数。整"
    },
    {
     "type": "bullet_list",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "备份",
     "columns_v": 1
    }
   ],
   "notes": "实际竖图顺序：居中大标题、卡外抽屉/G盘插画、七张左图标右键值记录卡；续图第八张整个数据库卡+数字说明+备份卡。表格整体仅一个text_ref，不在各行内部拆定位。原表头记录/多少/占多大/留多久仅完整出现一次，逐卡重复表头用data-echo。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "table竖版需保留八个记录、四列语义与每行图标；当前缺插画与3个图标。"
   ],
   "visual_layout": {
    "columns": 1,
    "portrait_segments": [
     "title+art+rows 1–7",
     "row 8+caption+backup"
    ],
    "art": "outside top under title"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 5,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "秒表、一叠小方块、一本按月装订的账本、一扇进出的门、一本登记册、一扇窗户、一个离开的小人、一个圆柱数据库",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
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
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "纸箱对勾",
   "source_phrase": "每天 11:40 把整个数据库压缩备份到 G:\\80_Backup\\TimeAudit\\postgresql，一份约 3.8 GiB，留 14 天（现在 12 份）。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "纸箱对勾",
   "source_phrase": "每天 11:40 把整个数据库压缩备份到 G:\\80_Backup\\TimeAudit\\postgresql，一份约 3.8 GiB，留 14 天（现在 12 份）。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "先写成“半成品”文件，校验能读、记下 SHA-256 指纹后才改名成正式备份；写到一半断电，不会把坏的当成好的。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "旧备份要删，至少留 3 份校验过的。",
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
   "asset": "_library/illustrations/锁抽屉柜.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "锁抽屉柜",
   "source_phrase": "右边约 40% 宽一幅插画：一排按周分隔的抽屉，最左边几格已经抽空，只剩一张写满短线的小卡片（汇总），抽屉下方一块硬盘，旁边标着 G（只画字母 G）；插画下面一张浅绿边框卡片“备份”，三条短句。",
   "sha256": "3bc7ab81fe67babd0f71db9d6da0e720473458604b0ffe325e38006d94879cd9",
   "status": "ready",
   "original_elements": [
    "一排按周分隔的抽屉，最左边几格已经抽空，只剩一张写满短线的小卡片（汇总），抽屉下方一块硬盘，旁边标着 G（只画字母 G"
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
   "asset": "_library/titles/title-329ff84c0c5023ba9bf8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-329ff84c0c5023ba9bf8",
   "title_text": "存多久、占多大",
   "sha256": "3bba79e726df92714526d62649d621b09659c3d27b8cba5708baadffd6765713",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

存多久、占多大

| 记录 | 多少 | 占多大 | 留多久 |
|---|---|---|---|
| 每秒一条的整机硬件 | 749 万条 | 2.6 GiB | 1200 天 |
| 每 3 秒一次的逐程序明细 | 1.80 亿条（10 月 12 日 05:43 数） | 54.2 GiB | 60 天（10 月 12 日看是从 8 月 10 日起） |
| 各软件按小时、按天的汇总 | 按小时 49.9 万条（6 月 16 日起） | 0.7 GiB | 一直留 |
| 程序启动和退出 | 3,998 万次 | 4.8 GiB | 1200 天 |
| 程序登记（路径、签名、是否提权） | 359 万个 | 4.8 GiB | 一直留 |
| 前台窗口会话 | 14.7 万段 | 不到 0.1 GiB | 1200 天 |
| 窗口记录器的区间 | 29.0 万段 | 不到 0.1 GiB | 1200 天 |
| 整个数据库 | — | 67.2 GiB | — |

表里的大小都是 10 月 23 日 10:25 同一次读取的；条数是另外几次分开数的，各有各的时点，不是和大小同一次读的。按小时汇总、前台窗口会话、窗口记录器的区间这三项是 10 月 23 日 10:25 重新数的精确数。整机硬件、程序启动和退出、程序登记这三项是 10 月 23 日 10:25 起重新做的全表精确计数；逐程序明细的精确数这次没有重数，表里仍是 10 月 12 日 05:43 数完的 1.80 亿条（10 月 11 日 16:04 那次数是 1.78 亿条）。所以逐程序明细这一行的精确条数和大小不是同一时点读的，不能拿来算每条占多大。逐程序明细另有数据库自带的估算：10 月 12 日 05:37 约 1.72 亿条，10 月 22 日 06:47 约 1.86 亿条；估算和精确数不是一个口径，不能拿来比多了还是少了。60 天留存是滚动的，“从 8 月 10 日起”是 10 月 12 日看到的起点，之后没有重看。这些只是现在库里留着多少条，不说明人在不在、睡没睡。大小按 1024 进位（GiB）。1200 天约 3 年 3 个月。

**备份**
- 每天 11:40 把整个数据库压缩备份到 G 盘的备份文件夹，最近一份约 5.2 GiB（10 月 22 日 06:47 看），留 14 天。最近一次是 10 月 21 日 11:40 开始、12:03 完成，本地和云端都成功。
- 10 月 22 日 06:47 再看：现有 14 份完整备份（只数文件，没有逐份复核）。10 月 12 日 05:40 看时是 12 份，缺 10 月 1 日和 8 日两天——8 日那次备份时电脑意外重启，没备成；1 日的日志已被覆盖，原因查不到。
- 先写成“半成品”文件，校验能读、记下 SHA-256 指纹后才改名成正式备份；写到一半断电，不会把坏的当成好的。
- 什么算失败：数据库或看板设置哪一步出错，整次就记失败，并记下卡在哪一步。只有三种情况记成“文件告警”、接着备份其余部分：杀毒软件拦下某个文件、杀毒软件删掉某个文件、清点后文件自己没了；告警会出现在运行健康里。其他读写错误照样算失败。这条是 10 月 1 日加的，到现在还没真遇到过杀毒拦截。
- 旧备份要删，至少留 3 份校验过的。

::screen{#timeaudit-11 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-11",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。左边约三分之二宽，五张横向小卡片两列三行（最后一格空出来画一小幅水彩：一卷心电图纸带），每张左边一个小水彩图标（两条不相交的平行线、一块手表和一个秒表、一把尺子框住一段时间轴、一个“≈”号、一把小锁挂在一张空白卡片上），右边粗体一句加一两行小字。右边约三分之一宽，竖着四张大数字卡（大号绿色数字，下面一行小字）。",
  "portrait": "竖版：标题；五张卡片一行一张；四张大数字卡改成两行两张放在最后。",
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
     "connector": "none",
     "size": "medium",
     "illustration": "none",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "两条前台记录不合并。",
     "last_full_width": true
    },
    {
     "type": "stat_card",
     "align": "left",
     "connector": "none",
     "columns": 4,
     "icons": "none",
     "illustration": "none",
     "text_ref": "约2.4万行"
    }
   ],
   "notes": "实际横图左65%五张横卡单列纵排，右35%四张数字卡纵排；纸带插画从左下卡角探出，右数字栏上方有仪表盘小插画。竖图五张左图标右文字卡单列，四数字卡在末尾2×2，不带插画。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。",
   "dependencies": [
    "解析器将“约 2.3 万行”保持为card，其余三数字合为stats；core stat_card只把stats作数字卡，须支持首张数字card，不能把首项降为正文。",
    "横版纸带/仪表盘两处装饰未独立提取；需要独立装饰槽保持卡外位置。"
   ],
   "visual_layout": {
    "principle_rows": 5,
    "principle_columns": 1,
    "stat_rows": 4,
    "stat_columns": 1
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 8,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "两条前台记录不合并。",
     "columns_v": 1
    },
    {
     "type": "stat_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "text_ref": "约2.4万行",
     "columns_v": 1,
     "portrait_columns": 1
    }
   ],
   "notes": "标题居中大号；五张原则卡各有左内图标、右粗体标题与正文；四数字卡末尾2×2。保留约2.4万行、332个、234次、0.18个核全部数字和解释。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "解析器将“约 2.3 万行”保持为card，其余三数字合为stats；core stat_card只把stats作数字卡，须支持首张数字card，不能把首项降为正文。"
   ],
   "visual_layout": {
    "principle_rows": 5,
    "principle_columns": 1,
    "stat_rows": 2,
    "stat_columns": 2
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 8,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "source_phrase": "两条不相交的平行线",
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
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "秒表",
   "source_phrase": "一块手表和一个秒表",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子框住一段时间轴",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
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
   "source_phrase": "一个“≈”号",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把小锁挂在一张空白卡片上",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
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

为什么这样设计

**两条前台记录不合并。**｜窗口记录器管“人在不在”，采集主程序管“前台是谁、占多少资源”，节奏和用途不同；硬塞成一张表，谁错了都分不清。
**睡眠用墙上时间，速率用秒表。**｜睡眠和落库看钟表时间；算网速、磁盘速率用不会倒退的计时器。对时、改时区时不会冒出一根吓人的假尖刺。
**查询一定带时间范围。**｜大表按周、按月分区，查询带上时间，只翻相关的几格；不带，三年的数据会整库扫一遍。
**算出来的写明是估算。**｜网络流量按连接数分摊到各程序、电费不含外设、累计读写量是速率乘间隔，都在看板上注明。
**给 AI 的只有汇总。**｜诊断入口只回数字；剪贴板内容不进性能数据库和图表。

**约 2.4 万行**｜代码（Python 约 2.2 万行，其余是 PowerShell、AutoHotkey、SQL）
**347 个**｜测试定义（只计数：源码里数的 def test_，不是通过数）
**255 次**｜提交（6 月 8 日起；数到 10 月 11 日的 234 次里有 47 次是看板自动快照，之后的没再分；以上三项 10 月 23 日 10:25 重取）
**0.18 个核**｜采集主程序自己平均占用的逻辑核，内存最多 59 MiB（10 月 10 日 02:17–05:17 这段，10 月 12 日重新读的）

::screen{#timeaudit-12 section="highlights"}

```typeset
{
 "screen": {
  "id": "timeaudit-12",
  "section": "highlights",
  "title": "亮点（一）",
  "scene": "横版画面：和标杆页“亮点”一样的大卡片，这屏两张横排，每张上面一幅小水彩插画，卡片标题用大字，下面“麻烦”“解法”两段正文（“麻烦：”“解法：”四个字用绿色粗体）。插画：1 一只守门的小狗趴在一台机箱旁，机箱上方飘着一条跳动的心跳线，其中一小段变成平线，小狗正抬头看着那段平线；2 右边这张卡片的插画位换成一个带细绿边框的截图空位（宽高比约 2:1），截图位下面一行灰色小字（截图说明）。",
  "portrait": "竖版：标题；两张卡片上下排，每张插画或截图在上、字在下；截图说明紧跟截图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/29428e91beed03c45a9632296ba260c5a74da36336f5bd77a1fd2ea80a974c5d.webp",
    "where": "第二张卡片插画位的细边框截图位（约 2:1）",
    "caption": "8 月 29 日的旧版帧率图：上到几千 fps 的点都是坏数据"
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
     "connector": "none",
     "size": "medium",
     "illustration": "none",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "top_inside",
     "icons": "none",
     "row": "highlights",
     "width": "49%",
     "text_ref": "程序活着，不等于还在记。",
     "illustration_source": "illustration",
     "illustration_index": 0
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "2:1",
     "columns": 1,
     "columns_v": 1,
     "row": "highlights",
     "width": "49%"
    },
    {
     "type": "prose",
     "text_ref": "8月29日的旧版帧率图",
     "row": "highlights"
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "top_inside",
     "icons": "none",
     "screenshot_index": 0,
     "media_order": [
      "screenshot",
      "caption",
      "title",
      "body"
     ],
     "row": "highlights",
     "text_ref": "读不到就留空，不补一个像样的数。"
    }
   ],
   "notes": "横版两张等宽大卡并排，左狗/心跳图在卡内顶部、标题和麻烦/解法在下；右卡2:1截图槽在卡内最上，图注紧跟槽，之后标题/麻烦/解法。章节标题整屏居中（原图左上，以统一明确要求为准）。\n截图绑定已补，当前截图/图注/右侧文字同栏；卡内媒体一体外框尚需组件实现，不能报构图完成。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "content_card当前用小图标而非独立插画，需要亮点卡内/卡外媒体槽。",
    "第二卡分配含结尾图注节点；视觉上图注提前至截图下，需用视觉重排保持DOM定稿顺序，不能复制图注导致G1重复。",
    "screenshots元数据所给真实图仅登记热区，此稿不读私人V盘原图；出图画空槽。"
   ],
   "visual_layout": {
    "columns": 2,
    "row_widths": [
     49,
     49
    ],
    "media": "first illustration, second screenshot 2:1",
    "connector": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 8,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "outside",
     "icons": "none",
     "art_role": "illustration",
     "art_index": 0,
     "media_order": [
      "title",
      "illustration",
      "body"
     ],
     "text_ref": "程序活着，不等于还在记。",
     "columns_v": 1
    },
    {
     "type": "screenshot",
     "indices": [
      0
     ],
     "ratio": "2:1",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "8月29日的旧版帧率图"
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "top_inside",
     "icons": "none",
     "screenshot_index": 0,
     "media_order": [
      "screenshot",
      "caption",
      "title",
      "body"
     ],
     "text_ref": "读不到就留空，不补一个像样的数。",
     "columns_v": 1
    }
   ],
   "notes": "竖版第一张：亮点居中标题、第一卡大标题、卡外狗/心跳插画、正文卡。第二张：整张外卡，截图槽在上、图注紧跟、第二卡大标题、麻烦与解法。图注仅出现一次。\n截图绑定已补，当前截图/图注/右侧文字同栏；卡内媒体一体外框尚需组件实现，不能报构图完成。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "content_card当前用小图标而非独立插画，需要亮点卡内/卡外媒体槽。",
    "第二卡分配含结尾图注节点；视觉上图注提前至截图下，需用视觉重排保持DOM定稿顺序，不能复制图注导致G1重复。",
    "screenshots元数据所给真实图仅登记热区，此稿不读私人V盘原图；出图画空槽。"
   ],
   "visual_layout": {
    "columns": 1,
    "row_widths": [
     100
    ],
    "media": "first illustration, second screenshot 2:1",
    "connector": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 8,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "asset": "_library/illustrations/ill-4084221892ddb5.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-4084221892ddb5",
   "source_phrase": "插画：1 一只守门的小狗趴在一台机箱旁，机箱上方飘着一条跳动的心跳线，其中一小段变成平线，小狗正抬头看着那段平线；2 右边这张卡片的插画位换成一个带细绿边框的截图空位（宽高比约 2:1），截图位下面一行灰色小字（截图说明）。",
   "sha256": "4322a88db44cd63bfde38d1ceddf51070d2d2f1ba809071acfc3c8d9bd3a195b",
   "status": "ready",
   "original_elements": [
    "守门小狗趴在机箱旁，机箱上方心跳线中一段变平，小狗抬头看平线"
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

亮点

**程序活着，不等于还在记。**
麻烦：采集程序会“假活”：任务管理器里还在，循环却卡死了，图上从某一刻起一片空白，过几天才发现。8 月最严重，看门狗那个月尝试重启主程序 696 次，成功 581 次。
解法：采集主程序、窗口记录器、入库程序每一拍都更新一个不含任何内容的“心跳”文件；看门狗每分钟看心跳新不新，主程序 90 秒没动就只重启它，刚睡醒先等 45 秒再判断。8 月 30 日到 9 月 2 日凌晨接连上线几处修复（会带崩整个程序的网络连接统计挪进可以单独重启的子进程、硬件传感器只由一个程序管、帧率改法）之后，9 月 2 日 2 点到 27 日只重启过 8 次。

**读不到就留空，不补一个像样的数。**
麻烦：旧版帧率记出过 8192 fps，显卡驱动出错时温度也会读成离谱的值；这种数进了图，要么吓人，要么被平均掉看不出来。
解法：温度、功率只收真实传感器的新鲜读数，读不到就存空，不拿别的温度顶替（这张显卡不提供核心热点温度，就一直空着、标“不支持”，不拿显存温度顶替）；显卡驱动返回越界值时重连驱动，这一拍留空。诊断时每个帧样本的帧率和帧时间要对得上才算数，对不上的单独计数，不算进平均。

8 月 29 日的旧版帧率图：上到几千 fps 的点都是坏数据

::screen{#timeaudit-13 section="highlights"}

```typeset
{
 "screen": {
  "id": "timeaudit-13",
  "section": "highlights",
  "title": "亮点（二）",
  "scene": "横版画面：接着上一屏的亮点卡片样式，这屏两张大卡片横排。插画：1 两段半透明的绿色时间条互相重叠，重叠处颜色更深，上方一只手把它们压成一条（旁边一只合上的笔记本电脑和一轮小月亮表示睡眠）；2 一排按周分隔的小抽屉，最左边几格空了，每个空抽屉前放着一张薄薄的汇总卡片，卡片上画一根小柱状图。",
  "portrait": "竖版：两张卡片上下排，每张插画在上、字在下。",
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
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "icons": "none",
     "illustration": "top_inside",
     "row": "highlights",
     "width": "49%",
     "text_ref": "一小时不会算成一个半小时。",
     "illustration_source": "illustration",
     "illustration_index": 0
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "icons": "none",
     "illustration": "top_inside",
     "row": "highlights",
     "width": "49%",
     "text_ref": "明细只留 60 天，一年后的峰值照样查得到。",
     "illustration_source": "illustration",
     "illustration_index": 1
    }
   ],
   "notes": "没有亮点章节标题；两张49%大卡并排，各图在卡内顶部，卡标题与麻烦/解法依次在下。左图重叠时间条内部含箭头（属插画，不是卡间connector）；右图周抽屉。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "content_card需支持一个外卡内两张正文内卡及媒体顺序。",
    "横版需要第二张抽屉插画，资产仅提取1/2；不能以首张时间条重复代替。"
   ],
   "visual_layout": {
    "columns": 2,
    "nested_cards": false,
    "second_portrait_art": "none in actual v2"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 6,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "icons": "none",
     "illustration": "top_inside",
     "art_role": "illustration",
     "art_index": 0,
     "media_order": [
      "title",
      "illustration",
      "body"
     ],
     "text_ref": "一小时不会算成一个半小时。",
     "columns_v": 1
    },
    {
     "type": "content_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "text_ref": "明细只留 60 天，一年后的峰值照样查得到。",
     "columns_v": 1
    }
   ],
   "notes": "没有新增亮点章节标题。首卡：大标题在图上方，插画在外卡内、麻烦和解法各一张内卡；续图次卡没有抽屉插画，大标题浅绿底，麻烦/解法各一内卡。若恢复定稿scene所述次卡插画应标新构图待样张，不得谎称原竖图有。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "content_card需支持一个外卡内两张正文内卡及媒体顺序。"
   ],
   "visual_layout": {
    "columns": 1,
    "nested_cards": true,
    "second_portrait_art": "none in actual v2"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 6,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "ill-c1d850f44e8d3e",
   "source_phrase": "插画：1 两段半透明的绿色时间条互相重叠，重叠处颜色更深，上方一只手把它们压成一条（旁边一只合上的笔记本电脑和一轮小月亮表示睡眠）；2 一排按周分隔的小抽屉，最左边几格空了，每个空抽屉前放着一张薄薄的汇总卡片，卡片上画一根小柱状图。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready",
   "original_elements": [],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-timeaudit",
   "source_phrase": "横版画面：接着上一屏的亮点卡片样式，这屏两张大卡片横排。插画：1 两段半透明的绿色时间条互相重叠，重叠处颜色更深，上方一只手把它们压成一条（旁边一只合上的笔记本电脑和一轮小月亮表示睡眠）；2 一排按周分隔的小抽屉，最左边几格空了，每个空抽屉前放着一张薄薄的汇总卡片，卡片上画一根小柱状图。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready"
  }
 ]
}
```

**一小时不会算成一个半小时。**
麻烦：切窗口时记下的区间会互相重叠，直接相加，6 月里曾把 1 小时算成 1.5 小时；合上盖睡 8 小时，也可能被当成“在用电脑”。
解法：同一段时间只算一次，先把重叠的合并、再按查询的时间段裁剪；键鼠 60 秒不动算离开，但在放声音（看视频、开会）时不算；锁屏、息屏、睡眠各记各的；睡眠只认 Windows 发来的睡眠通知，计时器被耽误造成的空档单独记成“采集空档”，不冒充睡眠。

**明细只留 60 天，一年后的峰值照样查得到。**
麻烦：每 3 秒记一次每个程序的占用，光最近两个月就约 1.80 亿条（10 月 12 日 05:43 数的）、54.0 GiB，占整个数据库的八成多（10 月 12 日 05:37），照这样三年要几百 GiB。
解法：按我 9 月 27 日定的：逐程序明细只留最近 60 天，删之前先汇总成按小时、按天的统计，核对汇总里的样本数和原始条数一致才删那一周。汇总按“应用合计”算：同一时刻同一个应用的几个进程先相加，A 的两个进程同时 40% 和 30%，A 的峰值记 70%；错开时间出现的不相加。那一周正被人查着、锁不上，就整周回滚、下一轮再试，不跳过它去删后面的。

::screen{#timeaudit-14 section="features"}

```typeset
{
 "screen": {
  "id": "timeaudit-14",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准，灰色小叉＝已停用）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框；这是第一张：顶上有标题（毛笔艺术字加绿色笔刷线）和图例，图例下一行小字说明两种状态的判定；图例五个记号分别画成绿点、黄点、灰点、浅灰点、灰色小叉。各卡状态：1 绿；2 绿；3 绿；4 绿；5 绿；6 绿；7 绿；8 浅灰；9 浅灰；10 浅灰；11 浅灰；12 浅灰；13 浅灰；14 绿。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。第一张顶上保留标题、图例和说明。",
  "links": [],
  "anchors": [
   {
    "id": "g-record",
    "text": "记录"
   },
   {
    "id": "f-hardware",
    "text": "整机硬件"
   },
   {
    "id": "f-fps",
    "text": "游戏帧率"
   },
   {
    "id": "f-process-usage",
    "text": "每个程序占多少"
   },
   {
    "id": "f-lifecycle",
    "text": "程序启动和退出"
   },
   {
    "id": "f-hung",
    "text": "程序无响应"
   },
   {
    "id": "f-foreground",
    "text": "前台窗口"
   },
   {
    "id": "f-presence",
    "text": "离开、锁屏、息屏、睡眠"
   },
   {
    "id": "g-view",
    "text": "看图"
   },
   {
    "id": "f-dash-hardware",
    "text": "整机硬件大盘"
   },
   {
    "id": "f-dash-smooth",
    "text": "流畅度诊断"
   },
   {
    "id": "f-dash-power",
    "text": "功耗和电费"
   },
   {
    "id": "f-dash-forensics",
    "text": "进程取证"
   },
   {
    "id": "f-dash-resource",
    "text": "资源大户"
   },
   {
    "id": "f-dash-screen",
    "text": "屏幕使用时间"
   },
   {
    "id": "f-public",
    "text": "外网打开图表"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "timeaudit-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "connector": "none",
     "size": "medium",
     "illustration": "none",
     "row": "header",
     "width": "48%",
     "text_ref": "全部功能（35 项）"
    },
    {
     "type": "status_legend",
     "align": "left",
     "connector": "none",
     "columns": 5,
     "illustration": "none",
     "row": "header",
     "width": "52%",
     "text_ref": "● 在用"
    },
    {
     "type": "prose",
     "align": "left",
     "connector": "none",
     "illustration": "none",
     "row": "header",
     "text_ref": "没用过＝"
    },
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "记录"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      3,
      3,
      1
     ],
     "statuses": [
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green"
     ],
     "status_position": "top_right",
     "text_ref": "整机硬件"
    },
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "看图"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      3,
      3,
      1
     ],
     "statuses": [
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "green"
     ],
     "status_position": "top_right",
     "text_ref": "整机硬件大盘"
    }
   ],
   "notes": "横图标题在左半、五状态图例和定义说明在右半同排；记录7卡、看图7卡各3/3/1且尾卡保持三列标准宽度左对齐。组名独占组上方。三屏功能链条不另加上下框。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "feature_card尚未注册，必须有编号名称/正文分隔、右上状态点，不用numbered_steps圆编号替代。",
    "图例五状态颜色须按scene顺序映射，所有●不能统一绿。",
    "14屏仅提取10/14图标；补图前先逐卡确认不能错配。"
   ],
   "visual_layout": {
    "chain": "timeaudit-features",
    "feature_rows": [
     3,
     3,
     1,
     3,
     3,
     1
    ],
    "group_heading": "above each group",
    "footer_border": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 7,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "connector": "none",
     "size": "medium",
     "illustration": "none",
     "text_ref": "全部功能（35 项）"
    },
    {
     "type": "status_legend",
     "align": "left",
     "connector": "none",
     "columns": 5,
     "illustration": "none",
     "text_ref": "● 在用",
     "columns_v": 5
    },
    {
     "type": "prose",
     "align": "left",
     "connector": "none",
     "illustration": "none",
     "text_ref": "没用过＝"
    },
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "记录"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "statuses": [
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green"
     ],
     "status_position": "top_right",
     "text_ref": "整机硬件",
     "columns_v": 1
    },
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "看图"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "statuses": [
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "pale_gray",
      "green"
     ],
     "status_position": "top_right",
     "text_ref": "整机硬件大盘",
     "columns_v": 1
    }
   ],
   "notes": "标题全宽居中；图例与状态定义说明在同张浅色细框；记录组7卡在v，续图v2看图组7卡，不重复全局标题图例。每卡左内图标、右字、状态点右上。第8–13项按定稿为说不准浅灰，第14项绿。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。；AI补充：当前合格102px标题只缩不放大，功能目录改中档，保原毛笔图/笔画；审查要求缩小过大标题，不要求此屏大档。",
   "dependencies": [
    "feature_card尚未注册，必须有编号名称/正文分隔、右上状态点，不用numbered_steps圆编号替代。",
    "图例五状态颜色须按scene顺序映射，所有●不能统一绿。",
    "14屏仅提取10/14图标；补图前先逐卡确认不能错配。"
   ],
   "visual_layout": {
    "chain": "timeaudit-features",
    "feature_rows": [
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1
    ],
    "group_heading": "above each group",
    "footer_border": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 7,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "source_phrase": "整机硬件｜每秒记 CPU 和显卡的温度、功率、频率、电压、占用，内存和换页，磁盘延迟和读写，网速、网络延迟和丢包",
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "游戏帧率｜每秒记前台游戏的帧率、1% Low 和帧时间；先读 RTSS，读不到才开 PresentMon；没开游戏记“空闲等待”",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
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
   "source_phrase": "每个程序占多少｜每 3 秒清点所有在跑的程序各占多少 CPU、显卡、内存、显存、磁盘和网络；网络按连接数估算分摊",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "程序启动和退出｜记每个程序何时启动、何时退出、退出码和活了多久，还有路径、签名、是否提权",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "程序无响应｜用 Windows 自己的判断（IsHungAppWindow）记哪个窗口卡成“未响应”、卡了多久",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "前台窗口｜记前台是哪个程序、全屏还是窗口、聚焦了多久",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "离开、锁屏、息屏、睡眠｜人离开、锁屏、息屏、睡眠各记各的；计时被耽误的单独记成采集空档",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "外接硬盘",
   "source_phrase": "整机硬件大盘｜21 个图：温度功率、降频原因、内存和换页、磁盘延迟、网络、散热有没有变差",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
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
   "source_phrase": "流畅度诊断｜9 个图：帧率、1% Low、卡顿时刻、CPU 还是显卡拖后腿、全屏和窗口对比",
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
   "asset": "_library/round3/clean-assets/png/45-钱包-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钱包",
   "source_phrase": "功耗和电费｜11 个图：今天几度电、按峰谷电价折多少钱、月底预计、最费电的程序；电量只按 CPU 和显卡功率算",
   "sha256": "cb2bc88524ac3d8fbe65a63f4fc3dc1dd41c818d31beab524c8112b9bad9ef00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "进程取证｜16 个图：提权、没签名、崩溃退出码、短时间反复启动、悄悄联网、命令行开出的子进程；只给核查线索",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/趋势图.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "趋势图",
   "source_phrase": "资源大户｜10 个图：占用前 25 名、后台高占用、写盘和联网大户、内存只涨不跌、各软件按小时和按天的 CPU、内存趋势",
   "sha256": "840e34005f97891bcc6f8b0621a1e081cfae3d452a215b4eb6a9efa57ae723ab",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "屏幕使用时间｜13 个图：开机多久、人在电脑前多久、各软件时长和分类、专注时段、每天几点活跃、本周比上周",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "外网打开图表｜经 Cloudflare 隧道用 grafana.wly0829.cn 打开同一套看板，要登录；电脑关机时打不开",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-media/personal-media-11-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-532b0a5a67ef64bb6401",
   "title_text": "全部功能（35 项）",
   "sha256": "1fa57c2d0712191d862d1797bcaa2d858bb69d0595e25d547f53f42ff4578c71",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（35 项）
● 在用　● 待验收　● 没用过　● 说不准　✕ 已停用
没用过＝每用一次都会留下记录，现在一条也找不到；说不准＝用了不留痕（比如看了哪张看板），没法判断

**记录**
1. 整机硬件｜每秒记 CPU 和显卡的温度、功率、频率、电压、占用，内存和换页，磁盘延迟和读写，网速、网络延迟和丢包
2. 游戏帧率｜每秒记前台游戏的帧率、1% Low 和帧时间；先读 RTSS，读不到才开 PresentMon；没开游戏记“空闲等待”
3. 每个程序占多少｜每 3 秒清点所有在跑的程序各占多少 CPU、显卡、内存、显存、磁盘和网络；网络按连接数估算分摊
4. 程序启动和退出｜记每个程序何时启动、何时退出、退出码和活了多久，还有路径、签名、是否提权
5. 程序无响应｜用 Windows 自己的“未响应”判断，记哪个窗口卡成“未响应”、卡了多久
6. 前台窗口｜记前台是哪个程序、全屏还是窗口、聚焦了多久
7. 离开、锁屏、息屏、睡眠｜人离开、锁屏、息屏、睡眠各记各的；计时被耽误的单独记成采集空档

**看图**
8. 整机硬件大盘｜21 个图：温度功率、降频原因、内存和换页、磁盘延迟、网络、散热有没有变差
9. 流畅度诊断｜9 个图：帧率、1% Low、卡顿时刻、CPU 还是显卡拖后腿、全屏和窗口对比
10. 功耗和电费｜11 个图：今天几度电、按峰谷电价折多少钱、月底预计、最费电的程序；电量只按 CPU 和显卡功率算
11. 进程取证｜16 个图：提权、没签名、崩溃退出码、短时间反复启动、悄悄联网、命令行开出的子进程；只给核查线索
12. 资源大户｜10 个图：占用前 25 名、后台高占用、写盘和联网大户、内存只涨不跌、各软件按小时和按天的 CPU、内存趋势
13. 屏幕使用时间｜13 个图：开机多久、人在电脑前多久、各软件时长和分类、专注时段、每天几点活跃、本周比上周
14. 外网打开图表｜经 Cloudflare 隧道用 grafana.wly0829.cn 打开完整看板要登录；公开状态小看板免登录，电脑关机时都打不开

::screen{#timeaudit-15 section="features"}

```typeset
{
 "screen": {
  "id": "timeaudit-15",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准，灰色小叉＝已停用）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框；这是第二张：没有标题、没有图例，直接接着排。各卡状态：15 绿；16 绿；17 绿；18 浅灰；19 灰色小叉；20 绿；21 绿；22 绿；23 绿；24 绿；25 浅灰；26 浅灰；27 绿。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-ask",
    "text": "问 AI"
   },
   {
    "id": "f-stutter",
    "text": "刚才卡了"
   },
   {
    "id": "f-diag-summary",
    "text": "历史诊断摘要"
   },
   {
    "id": "f-health",
    "text": "现在正不正常"
   },
   {
    "id": "f-usage-qa",
    "text": "某天用了哪些软件"
   },
   {
    "id": "f-anomaly-digest",
    "text": "给电脑配置项目的异常摘要"
   },
   {
    "id": "g-clip",
    "text": "剪贴板历史"
   },
   {
    "id": "f-clip-record",
    "text": "记下复制"
   },
   {
    "id": "f-clip-search",
    "text": "搜索和再次复制"
   },
   {
    "id": "f-clip-group",
    "text": "同样内容合一条"
   },
   {
    "id": "f-clip-secret",
    "text": "疑似密钥归类"
   },
   {
    "id": "f-clip-skip",
    "text": "不存标了“不进历史”的复制"
   },
   {
    "id": "f-clip-pause",
    "text": "暂停记录"
   },
   {
    "id": "f-clip-export",
    "text": "给别的工具的增量出口"
   },
   {
    "id": "f-clip-backup",
    "text": "剪贴板每天备份"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "timeaudit-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "问 AI"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      3,
      2
     ],
     "fill_last_row": true,
     "statuses": [
      "green",
      "green",
      "green",
      "pale_gray",
      "cross_gray"
     ],
     "status_position": "top_right",
     "text_ref": "刚才卡了"
    },
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "剪贴板历史"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      3,
      3,
      2
     ],
     "fill_last_row": true,
     "statuses": [
      "green",
      "green",
      "green",
      "green",
      "green",
      "pale_gray",
      "gray",
      "green"
     ],
     "status_position": "top_right",
     "text_ref": "记下复制"
    }
   ],
   "notes": "无章节标题、无重复图例。横版问AI卡3/2，末排18/19各约半屏宽；剪贴板历史卡3/3/2，末排26/27各约半屏宽。各卡图标左内、状态右上。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "feature_card未注册；变宽末排row_counts/fill_last_row需组件内部实现，steps节点不能规格内按18/19或26/27拆节点。",
    "15屏仅提取10/13图标。"
   ],
   "visual_layout": {
    "chain": "timeaudit-features",
    "ask_rows": [
     3,
     2
    ],
    "clipboard_rows": [
     3,
     3,
     2
    ],
    "clipboard_portrait_icons": false
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 4,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "问 AI"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      1,
      1,
      1,
      1,
      1
     ],
     "fill_last_row": false,
     "statuses": [
      "green",
      "green",
      "green",
      "pale_gray",
      "cross_gray"
     ],
     "status_position": "top_right",
     "text_ref": "刚才卡了",
     "columns_v": 1
    },
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "剪贴板历史"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "row_counts": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "fill_last_row": false,
     "statuses": [
      "green",
      "green",
      "green",
      "green",
      "green",
      "pale_gray",
      "gray",
      "green"
     ],
     "status_position": "top_right",
     "text_ref": "记下复制",
     "columns_v": 1
    }
   ],
   "notes": "v问AI5卡有左图标，v2剪贴板历史8卡实际无图标；续图组名保留。每卡状态右上。编号15–27连续，不能把一整个steps节点按中间项text_ref拆分。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "feature_card未注册；变宽末排row_counts/fill_last_row需组件内部实现，steps节点不能规格内按18/19或26/27拆节点。"
   ],
   "visual_layout": {
    "chain": "timeaudit-features",
    "ask_rows": [
     1,
     1,
     1,
     1,
     1
    ],
    "clipboard_rows": [
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1
    ],
    "clipboard_portrait_icons": false
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 4,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "source_phrase": "刚才卡了｜AI 用电脑配置与恢复的卡顿总诊断，把这里的历史摘要和运行健康、内存黑匣子、系统事件对到同一段时间，刚发生的再加几秒现场采样",
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
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "历史诊断摘要｜按时间段一次汇总记录覆盖、空档、温度功率、帧率和超阈值次数，摘要不含程序名和窗口标题；9 月 29 日查 24 小时约 2.5 秒、168 小时约 6.4 秒，都能出结果",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "现在正不正常｜一次查齐：在不在写、入库积压、传感器、图表、备份、看门狗上次结果；双击“检查运行状态.vbs”也是它",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "某天用了哪些软件｜经个人理解库、个人资料解锁后，按完整时段和北京时间每天给出各软件前台时长、离开和空档；设备记录不等于人在场",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "给电脑配置项目的异常摘要｜只给持续高温、内存和磁盘压力这类次数，提示那边复查配置；9 月 28 日那边退役综合自查后没人再调用，29 日代码也删了",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "记下复制｜新复制的文字、链接、文件路径；图片和太大的内容只记“复制过一次”",
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "搜索和再次复制｜在密码中心的剪贴板历史标签里按关键词、日期、类型筛，点一下再次复制；资料锁着时不显示",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
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
   "source_phrase": "同样内容合一条｜同样的内容合成一条，写真正复制了几次；同一次复制被看到两遍不重复算",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "疑似密钥归类｜看着像 API 密钥、令牌、恢复码的单独一类，提醒小心；只看格式",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "不存标了“不进历史”的复制｜复制时带了 Windows 专用标记的一律不存，比如从密码中心复制的密码",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "暂停记录｜在剪贴板历史标签里暂停，恢复后从当下重新算起",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "给别的工具的增量出口｜别的程序可以从上次读到的位置接着取新复制；现在没有程序在用",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "剪贴板每天备份｜每天 18:25 一致备份到 G 盘并核对条数和完整性",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  }
 ]
}
```

**问 AI**
15. 刚才卡了｜AI 用电脑配置与恢复的卡顿总诊断，把这里的历史摘要和运行健康、内存黑匣子、系统事件对到同一段时间，刚发生的再加几秒现场采样
16. 历史诊断摘要｜按时间段一次汇总记录覆盖、空档、温度功率、帧率和超阈值次数，摘要不含程序名和窗口标题；9 月 29 日查 24 小时约 2.5 秒、168 小时约 6.4 秒，都能出结果
17. 现在正不正常｜一次查齐：在不在写、入库积压、传感器、图表、备份、看门狗上次结果；双击“检查运行状态.vbs”也是它
18. 某天用了哪些软件｜经个人理解库、个人资料解锁后，按完整时段和北京时间每天给出各软件前台时长、离开和空档；设备记录不等于人在场
19. 给电脑配置项目的异常摘要｜只给持续高温、内存和磁盘压力这类次数，提示那边复查配置；9 月 28 日那边退役综合自查后没人再调用，29 日代码也删了。现在电脑配置项目查卡顿，直接读上面的运行健康和历史诊断摘要

**剪贴板历史**
20. 记下复制｜新复制的文字、链接、文件路径；图片和太大的内容只记“复制过一次”
21. 搜索和再次复制｜在密码中心的剪贴板历史标签里按关键词、日期、类型筛，点一下再次复制；资料锁着时不显示
22. 同样内容合一条｜同样的内容合成一条，写真正复制了几次；同一次复制被看到两遍不重复算
23. 疑似密钥归类｜看着像 API 密钥、令牌、恢复码的单独一类，提醒小心；只看格式
24. 不存标了“不进历史”的复制｜复制时带了 Windows 专用标记的一律不存，比如从密码中心复制的密码
25. 暂停记录｜在剪贴板历史标签里暂停，恢复后从当下重新算起
26. 给别的工具的增量出口｜别的程序可以从上次读到的位置接着取新复制；密码中心的查看标签不走这条路。现在有没有程序在用、用过几次，没有核对
27. 剪贴板每天备份｜每天 18:25 一致备份到 G 盘并核对条数和完整性

::screen{#timeaudit-16 section="features"}

```typeset
{
 "screen": {
  "id": "timeaudit-16",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准，灰色小叉＝已停用）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框；这是第三张：没有标题、没有图例，接着排；卡片排完后下方留出的空白里画一幅浅浅的水彩小插画（一卷心电图纸带绕着一只小狗和一枚回形针，不画字），不要画边框。各卡状态：28 绿；29 绿；30 绿；31 绿；32 绿；33 黄；34 浅灰；35 浅灰。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-keep",
    "text": "保底"
   },
   {
    "id": "f-autostart",
    "text": "登录自动开始"
   },
   {
    "id": "f-watchdog",
    "text": "看门狗"
   },
   {
    "id": "f-retention",
    "text": "明细 60 天、汇总长期"
   },
   {
    "id": "f-db-backup",
    "text": "数据库每日备份"
   },
   {
    "id": "f-dash-backup",
    "text": "看板设置备份到 GitHub"
   },
   {
    "id": "f-restore-drill",
    "text": "隔离恢复演练"
   },
   {
    "id": "f-db-audit",
    "text": "整库数据审计"
   },
   {
    "id": "f-rebuild",
    "text": "换电脑重装"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "timeaudit-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "small",
     "illustration": "none",
     "text_ref": "保底"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      2,
      3,
      3
     ],
     "fill_first_row": true,
     "statuses": [
      "green",
      "green",
      "green",
      "green",
      "green",
      "yellow",
      "pale_gray",
      "pale_gray"
     ],
     "status_position": "top_right",
     "text_ref": "登录自动开始"
    },
    {
     "type": "illustration",
     "align": "left",
     "connector": "none",
     "index": 0,
     "size": "banner"
    }
   ],
   "notes": "无章节标题、无图例。横图实际保底第一排28/29两张半宽卡，第二排30/31/32三卡，第三排33/34/35三卡；下方整宽纸带/狗/回形针插画在卡外。第32项原图黄，定稿scene明确绿，按定稿标绿。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "feature_card未注册；横排2/3/3与竖31后插画需内部布局能力，不能用text_ref定位steps中间项。",
    "原图第32项为黄与定稿状态冲突，稿已采用定稿绿；不要从图取色覆盖定稿。",
    "第32图标原图含GitHub品牌标志；定稿功能名点名GitHub而scene没有点名标志，复审时需核对品牌资产是否适用标准，勿自动引入。"
   ],
   "visual_layout": {
    "chain": "timeaudit-features",
    "rows": [
     2,
     3,
     3
    ],
    "art": "outside bottom",
    "connector": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 2,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "保底"
    },
    {
     "type": "feature_card",
     "align": "left",
     "connector": "none",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row_counts": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "fill_first_row": false,
     "statuses": [
      "green",
      "green",
      "green",
      "green",
      "green",
      "yellow",
      "pale_gray",
      "pale_gray"
     ],
     "status_position": "top_right",
     "text_ref": "登录自动开始",
     "inline_illustration_after_number": 31,
     "inline_illustration_index": 0,
     "columns_v": 1
    }
   ],
   "notes": "v保底标题与28–31四卡，下面卡外纸带/狗/回形针插画；续图v2直接32–35四卡，没有重复保底标题。插画实际在31和32之间，不能挪至35后；整组只有一个steps节点，需组件内部按编号31插入无字图。32状态按定稿scene绿，33黄，34/35浅灰。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。",
   "dependencies": [
    "feature_card未注册；横排2/3/3与竖31后插画需内部布局能力，不能用text_ref定位steps中间项。",
    "原图第32项为黄与定稿状态冲突，稿已采用定稿绿；不要从图取色覆盖定稿。",
    "第32图标原图含GitHub品牌标志；定稿功能名点名GitHub而scene没有点名标志，复审时需核对品牌资产是否适用标准，勿自动引入。"
   ],
   "visual_layout": {
    "chain": "timeaudit-features",
    "rows": [
     1,
     1,
     1,
     1,
     1,
     1,
     1,
     1
    ],
    "art": "outside after feature 31",
    "connector": "none"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 2,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库",
   "source_phrase": "登录自动开始｜登录后自动拉起数据库、图表、采集主程序和窗口记录器",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
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
   "source_phrase": "看门狗｜采集主程序、窗口记录器、入库程序卡住或退出，自动重启那一个（怎么做见“亮点”）",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "明细 60 天、汇总长期｜逐程序明细只留 60 天，删之前先汇总成按小时、按天的统计并核对条数",
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
   "source_phrase": "数据库每日备份｜每天 11:40 整库备份到 G 盘，校验、记指纹后才算数，留 14 天",
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
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "看板设置备份到 GitHub｜每天导出 6 张看板的设置存进仓库；同一版本内容不一样就拒绝覆盖。9 月 28 日报失败只是排版不同、内容一样，已改成按内容比对，等 9 月 29 日 11:40 自然跑一次才算恢复",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "隔离恢复演练｜在不联网的临时数据库里把备份恢复一遍再读回，不碰正在用的库；还没拿真实备份跑过",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "整库数据审计｜逐表逐字段检查数据对不对：各表行数、数值有没有越界、该有的是不是空的、有没有孤儿记录和时间倒退；只打印到屏幕，不留记录，日常查卡顿不用它",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "换电脑重装｜照《快速部署》装回运行环境、容器和计划任务，再从 G 盘备份恢复历史",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-timeaudit",
   "source_phrase": "三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框；这是第三张：没有标题、没有图例，接着排；卡片排完后下方留出的空白里画一幅浅浅的水彩小插画（一卷心电图纸带绕着一只小狗和一枚回形针，不画字），不要画边框。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready",
   "original_elements": [
    "一卷心电图纸带绕着一只小狗和一枚回形针，不画字），不要画边框"
   ],
   "hidden": false
  }
 ]
}
```

**保底**
28. 登录自动开始｜登录后自动拉起数据库、图表、采集主程序和窗口记录器
29. 看门狗｜采集主程序、窗口记录器、入库程序卡住或退出，自动重启那一个（怎么做见“亮点”）；Docker 明确停止满 10 分钟时试一次限时重启，同一次故障不重复；另外最多每 10 分钟写一份今天、昨天的用电回执给驾驶舱，只算 CPU 和显卡，不是整机电费
30. 明细 60 天、汇总长期｜逐程序明细只留 60 天，删之前先汇总成按小时、按天的统计并核对条数
31. 数据库每日备份｜每天 11:40 整库备份到 G 盘，校验、记指纹后才算数，留 14 天；哪一步出错就整次记失败，只有杀毒软件拦下或删掉文件、文件清点后自己没了这几种记成告警并接着备份
32. 看板设置备份到 GitHub｜每天导出全部 9 张看板的设置存进仓库（6 张主看板，加 3 张公开状态小看板）；同一版本内容不一样就拒绝覆盖。9 月 28 日报失败只是排版不同、内容一样，已改成按内容比对；最近一次自然备份中，数据库和看板设置两项均已通过
33. 隔离恢复演练｜在不联网的临时数据库里把备份恢复一遍再读回，不碰正在用的库；还没拿真实备份跑过
34. 整库数据审计｜逐表逐字段检查数据对不对：各表行数、数值有没有越界、该有的是不是空的、有没有孤儿记录和时间倒退；只打印到屏幕，不留记录，日常查卡顿不用它
35. 换电脑重装｜照《快速部署》装回运行环境、容器和计划任务，再从 G 盘备份恢复历史

::screen{#timeaudit-17 section="history"}

```typeset
{
 "screen": {
  "id": "timeaudit-17",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左边约 65% 宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边一幅大一点的水彩插画：一卷心电图纸带从上往下展开，纸带旁依次长出一块仪表盘、一只守门的小狗、一枚回形针、一个放大镜、一朵云和一排抽屉，像一路长出来的样子（插画里不画字）。",
  "portrait": "竖版：时间线占满宽度从上到下；插画缩小放在最上面。",
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
     "connector": "none",
     "size": "medium",
     "illustration": "none",
     "text_ref": "演进",
     "row": "balanced-heading",
     "width": "88%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "align": "right",
     "connector": "none",
     "index": 0,
     "target_width": "100%",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "timeline",
     "align": "left",
     "connector": "line",
     "columns": 2,
     "direction": "vertical",
     "illustration": "left_inside",
     "icons": "auto",
     "column_flow": "top_to_bottom",
     "items_per_column": 7,
     "text_ref": "6 月 8 日"
    }
   ],
   "notes": "横图左66%为标题+两列竖时间线（每列7项，先左列从上到下，再右列从上到下），各列左边竖绿细线/节点点，卡内左图标右日期和正文；右34%一幅纵向演进纸带插画，卡外且顶对齐。时间线有竖细线不画箭头/丝带。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。\npage-fixer-06：按 2026-10-03 审查意见调整规格；当前 blocks 为本轮构图，前文旧栏宽/列数说明仅为此前构图证据。截图位保持定稿规定的运行时空槽。",
   "dependencies": [
    "解析器把日期bullets识别为stats；timeline支持stats，不可按stat_card输出大数字。",
    "现有timeline direction=vertical会强制columns=1；横版需支持两列独立竖线、每列7项、列优先阅读顺序，不能用水平两列Z形替代。",
    "connector只允许ribbon/arrow/none，竖细线是时间线节点轨道；需要组件轨道能力，不用箭头或丝带。",
    "14节点图标和演进插画须逐项确认资产不缺，短名和日期均由程序排字。"
   ],
   "visual_layout": {
    "timeline_columns": 2,
    "timeline_items": 14,
    "reading_order": "column-major",
    "timeline_line": "thin vertical green with dots",
    "art": "outside right"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 2,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "connector": "none",
     "size": "large",
     "illustration": "none",
     "text_ref": "演进"
    },
    {
     "type": "illustration",
     "align": "left",
     "connector": "none",
     "index": 0
    },
    {
     "type": "timeline",
     "align": "left",
     "connector": "line",
     "columns": 1,
     "direction": "vertical",
     "illustration": "left_inside",
     "icons": "auto",
     "column_flow": "top_to_bottom",
     "items_per_column": 7,
     "text_ref": "6 月 8 日",
     "columns_v": 1
    }
   ],
   "notes": "竖图左对齐小章节标题演进（原图同顶部插画并列，稿建议保持标题左对齐）；插画缩为横长条置顶卡外；14张节点卡单列，v前7项、v2后7项。左侧细绿竖线/节点点跨卡保持，时间按定稿顺序。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。",
   "dependencies": [
    "解析器把日期bullets识别为stats；timeline支持stats，不可按stat_card输出大数字。",
    "现有timeline direction=vertical会强制columns=1；横版需支持两列独立竖线、每列7项、列优先阅读顺序，不能用水平两列Z形替代。",
    "connector只允许ribbon/arrow/none，竖细线是时间线节点轨道；需要组件轨道能力，不用箭头或丝带。",
    "14节点图标和演进插画须逐项确认资产不缺，短名和日期均由程序排字。"
   ],
   "visual_layout": {
    "timeline_columns": 1,
    "timeline_items": 14,
    "reading_order": "top-to-bottom",
    "timeline_line": "thin vertical green with dots",
    "art": "outside top"
   },
   "style_status": "依批准样板；样板未出现的表格、功能状态卡、时间线、亮点媒体嵌套均待组件样张",
   "text_allocation_verified": {
    "node_count": 2,
    "each_node_once": true,
    "warnings": []
   },
   "prior_visual_verified": true
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
   "source_phrase": "6 月 8 日：第一次提交：采集主程序、PostgreSQL 数据库和 Grafana 看板一起搭起来。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "6 月 14–15 日：加功耗电费、进程取证两张看板；无响应改用 Windows 自己的判断；所有查询带上时间范围，为三年的数据做准备。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "6 月 23 日：外部看门狗上线；修掉“1 小时算成 1.5 小时”。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "7 月 26 日：独立的剪贴板记录上线。",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "7 月 31 日：给电脑配置项目提供不含内容的异常摘要（9 月 28 日那边退役后停用，29 日删掉）。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 8 日：帧率只算前台正在画面的那个程序。",
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
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "8 月 30 日–9 月 2 日：给 AI 的历史诊断摘要；会带崩程序的网络统计挪进子进程；硬件传感器只由一个程序管；帧率改为先读 RTSS。",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
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
   "source_phrase": "9 月 8 日：显卡驱动返回坏值时不再照记。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 15 日：图表经 grafana.wly0829.cn 对外开放。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "9 月 17 日：运行健康、卡顿证据、校验过的备份统一成一套。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "9 月 20–24 日：剪贴板历史挪进密码中心、跟个人资料解锁走，同样内容合并计次；AI 能读完整时段的使用记录。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "9 月 25 日：图表端口从 53000 改到 43000（原端口落在 Windows 保留的范围里，起不来）。",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "9 月 27 日：备份写到一半中断也认得出来；逐程序明细只留 60 天，另存长期汇总。",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
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
   "source_phrase": "9 月 29 日：长时段诊断摘要不再超时；看板设置备份改成按内容比对；显卡热点明确标“不支持”。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "key": "文件核验",
   "source_phrase": "10 月 1–8 日：每日备份分清失败和告警",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "key": "打勾清单",
   "source_phrase": "10 月 11 日：看板展开再查；用电回执给驾驶舱读",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-timeaudit-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-timeaudit",
   "source_phrase": "横版画面：左边约 65% 宽一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边一幅大一点的水彩插画：一卷心电图纸带从上往下展开，纸带旁依次长出一块仪表盘、一只守门的小狗、一枚回形针、一个放大镜、一朵云和一排抽屉，像一路长出来的样子（插画里不画字）。",
   "sha256": "f73ac554816451c19f7f2b18a5db3cd977e4ece9045508df29abc9b0c0cc3d4f",
   "status": "ready",
   "original_elements": [
    "一卷心电图纸带从上往下展开，纸带旁依次长出一块仪表盘、一只守门的小狗、一枚回形针、一个放大镜、一朵云和一排抽屉，像一路长出来的样子（插画里不画字"
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
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

演进

- **6 月 8 日**：第一次提交：采集主程序、PostgreSQL 数据库和 Grafana 看板一起搭起来。
- **6 月 14–15 日**：加功耗电费、进程取证两张看板；无响应改用 Windows 自己的判断；所有查询带上时间范围，为三年的数据做准备。
- **6 月 23 日**：外部看门狗上线；修掉“1 小时算成 1.5 小时”。
- **7 月 26 日**：独立的剪贴板记录上线。
- **7 月 31 日**：给电脑配置项目提供不含内容的异常摘要（9 月 28 日那边退役后停用，29 日删掉）。
- **8 月 8 日**：帧率只算前台正在画面的那个程序。
- **8 月 30 日–9 月 2 日**：给 AI 的历史诊断摘要；会带崩程序的网络统计挪进子进程；硬件传感器只由一个程序管；帧率改为先读 RTSS。
- **9 月 8 日**：显卡驱动返回坏值时不再照记。
- **9 月 15 日**：图表经 grafana.wly0829.cn 对外开放。
- **9 月 17 日**：运行健康、卡顿证据、校验过的备份统一成一套。
- **9 月 20–24 日**：剪贴板历史挪进密码中心、跟个人资料解锁走，同样内容合并计次；AI 能读完整时段的使用记录。
- **9 月 25 日**：图表端口从 53000 改到 43000（原端口落在 Windows 保留的范围里，起不来）。
- **9 月 27 日**：备份写到一半中断也认得出来；逐程序明细只留 60 天，另存长期汇总。
- **9 月 29 日**：长时段诊断摘要不再超时；看板设置备份改成按内容比对；显卡热点明确标“不支持”。
- **10 月 1–8 日**：每日备份分清失败和告警：只有杀毒软件拦下或删掉文件、文件清点后自己没了这几种记告警、接着备份，其他错误照样整次算失败；备份开跑和结束都写一份回执，上一份还没备完不会再叠着起一份。
- **10 月 11 日**：五张主看板里要翻长历史的图改成点“展开”才查；看门狗顺手写今天、昨天 CPU 和显卡大约用了几度电的回执，给驾驶舱读。
- **10 月 16–20 日**：看板改用 Grafana V2 新格式，备份和恢复跟着支持，网站公开的三张状态小看板只认仓库里的文件、不再重复导出；Docker 明确停止约 10 分钟后，看门狗有限地自愈一次；读使用记录时遇到 Docker 卡住，直接报“不可用”，不再拆成小时间段空等；图表端口只对本机开放，数据库端口为 Tailscale 访问保留；每次备份的结果多留一份最近 30 次的记录。

::screen{#timeaudit-gallery section="gallery"}

```typeset
{
 "screen": {
  "id": "timeaudit-gallery",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/timeaudit/screen-time-focus.webp",
    "caption": "8 月 29 日的真实界面：屏幕使用时间、专注时段、最近的切换，以及睡眠和离开的分界。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/timeaudit/hardware-long-term.webp",
    "caption": "旧版界面，标题里还写着显卡型号；现在的看板已不绑定具体显卡，这张只用来看界面是怎么变过来的。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/timeaudit/foreground-stutter-analysis.webp",
    "caption": "旧版界面曾把终端窗口算成平均 826 帧，这种数不可信；这张只说明当时的数据问题，不代表现在的性能。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/timeaudit/foreground-timeline.webp",
    "caption": "8 月 29 日的真实界面：把细小的卡顿和当时前台在用的程序对到同一条时间轴上。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/timeaudit/resource-usage.webp",
    "caption": "8 月 29 日的真实资源看板：按 CPU、显卡、内存、显存、磁盘和网络，看各个程序占了多少。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/timeaudit/process-forensics.webp",
    "caption": "8 月 29 日的真实取证看板：从签名、提权、启动退出、退出码和路径异常里找要人工核查的线索。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/timeaudit/storage-scale.webp",
    "caption": "8 月 29 日的真实存储看板：这套记录每秒写进多少数据、各个分区有多大。",
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
     "text_ref": "8月29日的真实界面：屏幕使用时间、专注时段、最近的切换，以及睡眠和离开的分界。",
     "indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "columns": 3,
     "columns_v": 1,
     "equal_row_height": true,
     "ratios": [
      "3814:2050",
      "3840:2147",
      "3840:1807",
      "3840:2028",
      "3685:2146",
      "3840:2044",
      "3840:2057"
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
      },
      {
       "index": 3,
       "node_indices": [
        3
       ]
      },
      {
       "index": 4,
       "node_indices": [
        4
       ]
      },
      {
       "index": 5,
       "node_indices": [
        5
       ]
      },
      {
       "index": 6,
       "node_indices": [
        6
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
     "text_ref": "8月29日的真实界面：屏幕使用时间、专注时段、最近的切换，以及睡眠和离开的分界。",
     "indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "3814:2050",
      "3840:2147",
      "3840:1807",
      "3840:2028",
      "3685:2146",
      "3840:2044",
      "3840:2057"
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
      },
      {
       "index": 3,
       "node_indices": [
        3
       ]
      },
      {
       "index": 4,
       "node_indices": [
        4
       ]
      },
      {
       "index": 5,
       "node_indices": [
        5
       ]
      },
      {
       "index": 6,
       "node_indices": [
        6
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

8 月 29 日的真实界面：屏幕使用时间、专注时段、最近的切换，以及睡眠和离开的分界。

旧版界面，标题里还写着显卡型号；现在的看板已不绑定具体显卡，这张只用来看界面是怎么变过来的。

旧版界面曾把终端窗口算成平均 826 帧，这种数不可信；这张只说明当时的数据问题，不代表现在的性能。

8 月 29 日的真实界面：把细小的卡顿和当时前台在用的程序对到同一条时间轴上。

8 月 29 日的真实资源看板：按 CPU、显卡、内存、显存、磁盘和网络，看各个程序占了多少。

8 月 29 日的真实取证看板：从签名、提权、启动退出、退出码和路径异常里找要人工核查的线索。

8 月 29 日的真实存储看板：这套记录每秒写进多少数据、各个分区有多大。
