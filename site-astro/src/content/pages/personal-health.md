---
{
 "title": "个人健康",
 "kind": "project",
 "url": "/projects/personal-health/",
 "tagline": "结合我的实际情况答健康问题，按需更新穿戴设备数据。",
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
  "page": "personal-health",
  "kind": "project",
  "title": "个人健康",
  "url": "/projects/personal-health/",
  "tagline": "结合我的实际情况答健康问题，按需更新穿戴设备数据。",
  "status": "常用",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "每周自动刷新 10 月 7 日跑完、正常退出，下次排在 10 月 14 日（10 月 11 日 16:3x 只读查看）；“近 7 天 AI 用了 5 次”是 10 月 3–9 日的小记录，之后未重新核对"
  },
  "public": false,
  "repo_url": null,
  "capability": "结合我的身体情况答健康问题",
  "based_on": {
   "commit": "848501a2c4934e2bd9c578878b1d098d34417444",
   "commit_time": "2026-10-07T18:31:23+08:00"
  },
  "video_prompt": "开头短视频提示词：6 秒无缝循环，白底水彩画风，纯绿主色，照开头这屏的插画出发。手腕上纤细的穿戴设备屏幕轻轻亮起一圈绿光；几片细小的绿色叶子从设备飘出，沿一条绿色细虚线经过手机，落进旁边翻开的小册子；小册子的一页缓缓翻过，页面上只有灰色横线；一只放大镜在报告纸上轻轻移动，纸上一行被绿色淡淡划亮后褪去，回到起始画面。不出现任何文字、数字、图表或人脸，镜头固定，动作轻柔。",
  "registry": {
   "groups": [
    {
     "id": "g-ask",
     "name": "问健康问题"
    },
    {
     "id": "g-records",
     "name": "报告和现状"
    },
    {
     "id": "g-device",
     "name": "更新设备数据"
    },
    {
     "id": "g-query",
     "name": "查设备记录"
    }
   ],
   "features": [
    {
     "id": "f-ask",
     "group": "g-ask",
     "name": "健康问答",
     "what": "直接问担心的事，AI 读健康现状，给判断和一个最省事的下一步",
     "how": "直接问当前担心的健康问题",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "AGENTS.md:3,7；SKILL.md:8-10；CURRENT.md 改过 40 次"
    },
    {
     "id": "f-red-flags",
     "group": "g-ask",
     "name": "急症提醒",
     "what": "说症状和什么时候开始的，先看有没有要尽快去医院的信号",
     "how": "描述症状和发生时间，请 AI 判断下一步",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "AGENTS.md:11"
    },
    {
     "id": "f-treatment",
     "group": "g-ask",
     "name": "看懂医生建议",
     "what": "查当前权威医学资料，讲清好处、风险、别的选择和什么时候停下或复查；不代替医生",
     "how": "把医生的建议告诉 AI",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "AGENTS.md:11；SKILL.md:14"
    },
    {
     "id": "f-evidence",
     "group": "g-ask",
     "name": "分清依据",
     "what": "每个结论标明靠的是报告实测、医生结论、我自己说的、AI 建议，还是不知道",
     "how": "请 AI 说明结论分别靠什么",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "AGENTS.md:10"
    },
    {
     "id": "f-new-report",
     "group": "g-records",
     "name": "新报告和纠错",
     "what": "只打开相关的那份原件，改现状里受影响的几段，记下出处；以后不再翻原件",
     "how": "交给 AI 新报告，或指出哪条不对",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "AGENTS.md:12；SOURCES.md 改过 32 次"
    },
    {
     "id": "f-writeback",
     "group": "g-records",
     "name": "新认识写回理解库",
     "what": "健康对话里出现值得以后用的本人信息，写回个人理解库；病历和设备数据不复制过去",
     "how": "AI 自己判断，不用专门说",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "AGENTS.md:5；理解库 preferences.sqlite3 的 writeback_deliveries 有 6 条 origin_ref 含 personal-health（例如 9 月 13 日 personal-health-owner-refresh 写了 3 张卡；只读元数据）"
    },
    {
     "id": "f-enroll",
     "group": "g-device",
     "name": "一次授权",
     "what": "第一次用时授权一次 Google，长期凭据直接存进密码中心，之后不用再授权",
     "how": "本人明确要开通时，AI 运行授权程序",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "google_health_enroll.py:2-8；DEVICE_WORKFLOW.md:5"
    },
    {
     "id": "f-refresh",
     "group": "g-device",
     "name": "更新设备数据",
     "what": "从上次没采完的那天补齐 21 类数据：存原件、核对、出简报，AI 审阅后再改现状",
     "how": "说“更新健康数据”，说明关心哪几天",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "DEVICE_WORKFLOW.md:5；9 次完整采集清单"
    },
    {
     "id": "f-weekly-refresh",
     "group": "g-device",
     "name": "每 7 天自动刷新",
     "what": "电脑每 7 天无人值守跑一次更新：要已登录 Windows、资料在解锁期，只拿 1 小时只读临时票；结果待 AI 审阅，不直接改现状",
     "how": "自动：PersonalHealth Weekly Refresh；跟 AI 说停掉手环每周刷新",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "E:\\PCConfig\\registries\\task_purpose_catalog.json；docs/DEVICE_WORKFLOW.md:5,14；10 月 7 日 18:23:58–18:24:59 计划任务真实成功"
    },
    {
     "id": "f-resume",
     "group": "g-device",
     "name": "中断接着采",
     "what": "断了或请求到上限被截停，下次接着同一份清单往下采，不重下、不另起",
     "how": "上次更新断了，请 AI 接着完成",
     "status": "待验收",
     "screen": "personal-health-07",
     "source": "DEVICE_WORKFLOW.md:5,11；google_health_refresh.py:385-453"
    },
    {
     "id": "f-brief",
     "group": "g-query",
     "name": "一段时间简报",
     "what": "问某段时间睡眠或活动怎么样：只用够格的记录算，不够格的说清缺在哪",
     "how": "问一段时间睡眠或活动有什么变化",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "DEVICE_WORKFLOW.md:6,9；google_health_brief.py；10 份简报"
    },
    {
     "id": "f-day",
     "group": "g-query",
     "name": "查某天记录",
     "what": "不重新采集，按那一天、那一类从原件里窄查",
     "how": "问某天有没有记录",
     "status": "待验收",
     "screen": "personal-health-07",
     "source": "DEVICE_WORKFLOW.md:9,11；google_health_import.py --query-manifest"
    },
    {
     "id": "f-freshness",
     "group": "g-query",
     "name": "记录新不新",
     "what": "只给日期：设备记录到哪天；满 7 天标“该更新”，满 10 天没更新才标“超期静默”，说清是哪边停了",
     "how": "问设备记录更新到哪天",
     "status": "在用",
     "screen": "personal-health-07",
     "source": "google_health_freshness.py；真实运行：9 月 26 日 Claude 会话 ca702b24 子代理记录（record_age_days=8、silent=true、reason=refresh_not_run，之后补采），9 月 26 日补采后 current，9 月 27 日 Codex 会话 01a0deb0 再跑一次 current；9 月 29 日 01:39 起第 7 天“该更新”、第 10 天“超期静默”（提交 8963589，改后还没见到真实运行记录）"
    },
    {
     "id": "f-partial-days",
     "group": "g-query",
     "name": "查没采全的日子",
     "what": "核对某次采集里哪几天可能没采全；只读，不补采",
     "how": "请 AI 查某次更新有没有漏的日子",
     "status": "待验收",
     "screen": "personal-health-07",
     "source": "DEVICE_WORKFLOW.md:20；google_health_history.py --audit-partial-days"
    },
    {
     "id": "f-verify",
     "group": "g-query",
     "name": "重新核对原件",
     "what": "对一份采集完的清单，重算每个原件的指纹和记录数",
     "how": "请 AI 重新核对某次采集的原件",
     "status": "说不准",
     "screen": "personal-health-07",
     "source": "google_health_import.py --verify-manifest（3960-3964 行）"
    }
   ],
   "numbers": [
    {
     "id": "n-device",
     "text": "1 台",
     "meaning": "登记的穿戴设备数：Google Fitbit Air，数据族 google-wearables",
     "as_of": "2026-10-11",
     "source": "最新采集 manifest capture.device_label（20261007T102417Z-3542e3fd）",
     "screens": [
      "personal-health-01"
     ]
    },
    {
     "id": "n-types",
     "text": "21 类",
     "meaning": "每次更新采的设备数据类别",
     "as_of": "2026-10-11",
     "source": "最新 manifest field_count=21（20261007T102417Z-3542e3fd，10 月 11 日读）",
     "screens": [
      "personal-health-01",
      "personal-health-02",
      "personal-health-04",
      "personal-health-07"
     ]
    },
    {
     "id": "n-days",
     "text": "63 天",
     "meaning": "已采下的完整中国日范围：8 月 5 日（账号起点）到 10 月 6 日；是日期范围，不是每天都有记录",
     "as_of": "2026-10-11",
     "source": "最新 manifest history.account_start_date=2026-08-05、started_utc=2026-10-07T10:24Z（北京 10 月 7 日 18:24，不算完整日）；google_health_freshness.py last_complete_china_date=2026-10-06；27+30+6",
     "screens": [
      "personal-health-01"
     ]
    },
    {
     "id": "n-captures",
     "text": "13 次",
     "meaning": "status=complete 的采集次数（另有 3 次 8 月 26 日的旧全量面停在 running）",
     "as_of": "2026-10-11",
     "source": "E:\\PersonalData\\来源原件\\健康\\fitbit-google-health\\*\\manifest.json 共 16 个，只读 status 字段",
     "screens": [
      "personal-health-01"
     ]
    },
    {
     "id": "n-full-cost",
     "text": "284 个请求，约 32 分钟",
     "meaning": "9 月 12 日 12:13 那次从 8 月 5 日整段重采",
     "as_of": "2026-09-12",
     "source": "20260912T041356Z-da8f3cc2 manifest request_count、total_elapsed_seconds=1919.3",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-week-cost",
     "text": "77 个请求、69 秒",
     "meaning": "9 月 26 日 05:45 补一周（已复用连接）",
     "as_of": "2026-09-26",
     "source": "20260925T214521Z-241e0c36 manifest",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-day-cost",
     "text": "23 个请求、39 秒",
     "meaning": "9 月 26 日 05:53 补当天",
     "as_of": "2026-09-26",
     "source": "20260925T215340Z-62563599 manifest",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-before-reuse",
     "text": "73 个请求、约 17 分半",
     "meaning": "9 月 19 日 05:03 只补一周、还没复用连接",
     "as_of": "2026-09-19",
     "source": "20260918T210318Z-2e8a5d8d manifest request_count=73、total_elapsed_seconds=1047.1",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-after-reuse",
     "text": "22 个请求、26 秒",
     "meaning": "9 月 19 日 05:41 补当天，复用连接（提交 e63d55a 北京 05:33）之后",
     "as_of": "2026-09-19",
     "source": "20260918T214108Z-b3770c70 manifest request_count=22、total_elapsed_seconds=26.2",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-gzip",
     "text": "约 0.1 MB，解开是 4.5 MB",
     "meaning": "同一次的网络传输字节和解压后字节",
     "as_of": "2026-09-26",
     "source": "同上 transport.wire_bytes=102955、decoded_bytes=4544188",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-decision",
     "text": "4 类",
     "meaning": "进简报判断部分的类别：睡眠、步数、活动分钟、运动",
     "as_of": "2026-09-28",
     "source": "google_health_brief.py:46-51",
     "screens": [
      "personal-health-04",
      "personal-health-06"
     ]
    },
    {
     "id": "n-coverage",
     "text": "80%",
     "meaning": "一段时间有记录天数占比低于它就不下结论",
     "as_of": "2026-09-28",
     "source": "google_health_brief.py:74",
     "screens": [
      "personal-health-06"
     ]
    },
    {
     "id": "n-silent",
     "text": "7 天／10 天",
     "meaning": "最新记录离今天满 7 天标“该更新”，满 10 天还没更新标“超期静默”；一周内刚更新过仍没有新记录的，直接标“静默”",
     "as_of": "2026-09-29",
     "source": "google_health_freshness.py:31–32、104–124（提交 8963589）",
     "screens": [
      "personal-health-03",
      "personal-health-06",
      "personal-health-07"
     ]
    },
    {
     "id": "n-limits",
     "text": "5000 个请求、每秒 5 个、试 3 次、16 页、5 小时",
     "meaning": "每次更新的请求上限、限速、重试、存进度间隔、看门狗",
     "as_of": "2026-09-28",
     "source": "google_health_import.py:47-59；google_health_refresh.py:33",
     "screens": [
      "personal-health-03",
      "personal-health-04"
     ]
    },
    {
     "id": "n-code",
     "text": "8,591 行",
     "meaning": "7 个 google_health_*.py 行数之和，含空行（splitlines）；不含空行 7976",
     "as_of": "2026-10-11",
     "source": "提交 848501a 的 7 个 google_health_*.py 只读行数统计",
     "screens": [
      "personal-health-05"
     ]
    },
    {
     "id": "n-tests",
     "text": "测试定义 213 个（只计数）",
     "meaning": "192 个测试函数展开后，用合成数据，不碰真实记录；10 月 11 日只清点了数量，没有重跑",
     "as_of": "2026-10-11",
     "source": "提交 848501a 的测试定义只核对了数量，没有重跑",
     "screens": [
      "personal-health-05"
     ]
    },
    {
     "id": "n-commits",
     "text": "111 次",
     "meaning": "仓库提交数，北京 8 月 25 日到 10 月 7 日",
     "as_of": "2026-10-11",
     "source": "git rev-list --count HEAD",
     "screens": [
      "personal-health-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "更新时密码中心核对采集程序的文件指纹，把 Google OAuth 授权放进它运行时的环境；回执不含明文",
     "source": "E:\\PCConfig\\registries\\password_center_machine.json:255-267；google_health_refresh.py:46-63,145-165"
    },
    {
     "id": "r-daily-preferences-up",
     "with": "daily-preferences",
     "direction": "拿来",
     "flow": "本人基本情况、生活重点、价值取舍从个人理解库取，只在会改变回答时读",
     "source": "AGENTS.md:5；SKILL.md:12"
    },
    {
     "id": "r-daily-preferences-back",
     "with": "daily-preferences",
     "direction": "交出",
     "flow": "健康对话里有依据的本人新信息写回理解库并回读；病历和设备数据不复制",
     "source": "AGENTS.md:5"
    },
    {
     "id": "r-daily-preferences-rhythm",
     "with": "daily-preferences",
     "direction": "交出",
     "flow": "理解库用本项目的离线读取程序取每天的睡眠、步数，只当作息探针；按路径读新鲜度检查，列出好久没动的来源",
     "source": "daily-preferences\\health_rhythm.py；daily_preferences.py:2822-2824"
    },
    {
     "id": "r-personal-expression",
     "with": "personal-expression",
     "direction": "拿来",
     "flow": "向本人解释健康情况时照表达库 explain-to-me.md 的讲法",
     "source": "AGENTS.md:7；SKILL.md:8"
    },
    {
     "id": "r-pcconfig-lock",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "读健康资料的每个命令先调电脑配置装好的资料锁入口 personal_data_access.py",
     "source": "AGENTS.md:17；E:\\PCConfig\\docs\\runtime\\personal-data-access.md 调用点表"
    },
    {
     "id": "r-pcconfig-backup",
     "with": "pcconfig",
     "direction": "交出",
     "flow": "E:\\PersonalData（含健康原件）每天 17:10 复制到 G:\\80_Backup\\PersonalData，再同步到 H",
     "source": "E:\\PCConfig\\registries\\core_recovery.json:9,234-237"
    },
    {
     "id": "r-personal-materials",
     "with": "personal-materials",
     "direction": "拿来",
     "flow": "来源清单里的原件位置失效时，才用个人材料查找找回原件",
     "source": "SKILL.md:20"
    },
    {
     "id": "r-google-health",
     "with": "Google Health 接口",
     "direction": "拿来",
     "flow": "health.googleapis.com/v4，9 个只读权限，按需前台读取 Fitbit Air 的 21 类数据",
     "source": "google_health_import.py:36,89-100"
    },
    {
     "id": "r-fitbit",
     "with": "Fitbit Air 和手机",
     "direction": "拿来",
     "flow": "设备记录经手机同步到 Google 账号；手机只负责同步和运动 GPS",
     "source": "DEVICE_WORKFLOW.md:5；manifest capture.gps"
    }
   ],
   "highlights": [
    {
     "id": "h-incremental",
     "title": "隔一周再更新，也只要 69 秒。",
     "screen": "personal-health-06"
    },
    {
     "id": "h-silent",
     "title": "设备停了，它分得清是哪边的问题。",
     "screen": "personal-health-06"
    },
    {
     "id": "h-decision-gate",
     "title": "有记录，不等于能下结论。",
     "screen": "personal-health-06"
    }
   ],
   "mentions": [
    {
     "target": "/how/#personal-health",
     "screen": "personal-health-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/skills/personal-health/",
     "screen": "personal-health-02",
     "text": "去技能页看"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "personal-health-03",
     "text": "个人资料锁着时"
    },
    {
     "target": "/projects/password-center/",
     "screen": "personal-health-04",
     "text": "密码中心"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "personal-health-05",
     "text": "个人理解库"
    },
    {
     "target": "/projects/personal-expression/",
     "screen": "personal-health-05",
     "text": "个人表达"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“离线简报”（问一段时间睡眠或活动）和 brief 的指定日期用法（--start/--through）合成一条“一段时间简报”。",
    "按宿主识别运行主体（Codex、Claude 都能跑）、迁盘后回执重签，是“更新设备数据”的机制，写进第 3 屏“授权或身份不对”和演进，不单列功能。"
   ],
   "dropped": [
    "google_health_import.py 的 --project-fitbit-air-manifest（把 8 月 26 日前的旧全量采集投影成 Fitbit Air 字段，现行更新链不用）、--summary-manifest（按字段和日期的普通摘要，设备约定没提到，作用和“一段时间简报”重叠）、--plan（只显示计划、不联网，属于维护调试）：不上功能表，写进 audit.md。",
    "项目规则里关于状态很差时的默认讲法、历史自述等条目属于私人内容，不上网站。",
    "CURRENT.md、SOURCES.md 的内容、任何报告结论、用药、设备数值：按公开范围不写，只写行数和改动次数。"
   ],
   "unsure": [
    "设备写成“Fitbit Air 手环”：清单 device_label 是 Google Fitbit Air；健康现状 CURRENT.md 和本人自己的观察都叫“手环”，AGENTS.md:9 和新鲜度程序注释写“手表”。到底是手环还是手表没法完全确认。",
    "“设备更新”和“一段时间简报”底稿标“待验收”，我改成“在用”：9 次完整采集、5 天真实更新（8 月 26 日到 9 月 26 日），10 份简报、1 份 Owner 审阅记录，提交 851879d 写明“真实增量更新验收”。如果“待验收”指本人还没亲自验收，请改回。",
    "“重新核对原件”标“说不准”，“中断接着采”“查某天记录”“查没采全的日子”标“待验收”：9 月 28 日资料解锁后在 Codex（7 月起）和 Claude 对话记录里找过，只有读代码和文档，没有真实执行。",
    "第 2 屏的“最近总犯困，要紧吗？”是替本人口吻编的示例问法，不是真实提问；上线前请本人过目。",
    "原来的 7 天门槛和每周更新重合的问题，修复对话已改掉：第 7 天是“该更新”，第 10 天才算“超期静默”（提交 8963589，北京 9 月 29 日 01:39）；第 3、6、7 屏已跟着改。改后还没见到真实运行记录，功能状态仍写“在用”（功能本身在用）。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/personal-health/page.json",
  "sha256": "6ff04d9daa043a7fde3a90115df1f720dadd9a1211e68cdbaba1da2a10bd1c7d",
  "converted_at_beijing": "2026-10-31T09:28:10+08:00"
 }
}
---

::screen{#personal-health-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-health-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上大标题，下面一段介绍（约四行）。右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。中间一排四张等宽数字卡，每张左上角一个小水彩图标（依次是：手腕上的设备、一叠分成几格的卡片、一本日历、一个带对勾的循环箭头），上面大号绿色粗体数字，下面一两行小字。数字卡下面右对齐一行灰色小字“截至 10 月 11 日”。最下面左对齐一个白底细浅绿描边的圆角按钮，绿色字。这个项目只有一个每 7 天的手环刷新任务，首屏不画“现在”横条。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版 9:16：标题和介绍在上；插画缩到整宽放在介绍下面；四张数字卡两行两列；“截至”一行和按钮在最下面。字和横版完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#personal-health"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-health/#ai-brief"
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
     "row": "首屏",
     "width": "42%",
     "text_ref": "个人健康"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 每周自动刷新 10 月 7 日跑完、正常退出，下次排在 10 月 14 日（10 月 11 日 16:3x 只读查看）；“近 7 天 AI 用了 5 次”是 10 月 3–9 日的小记录，之后未重新核对",
     "row": "首屏"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "row": "首屏",
     "width": "57%",
     "index": 0,
     "size": "large",
     "target_height": 360,
     "target_width": 434
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1 台"
    },
    {
     "type": "action_button",
     "align": "left",
     "columns": 2,
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "已通过 replace_images 优先。首屏标题与介绍共占左栏，右栏独立大插画；介绍节点随标题块分配。数字卡图标在左上、数字在同一行右侧，说明在下。底部两个按钮均来自定稿。插画上的“健康现状”不得当作定稿外新增文字；复用时需无字素材或由定稿来源核实。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：手表主插画等比限高360，保持右侧主图，左标题与介绍下面不再留下大白。 仅更改单页排版规格，不改定稿字句和素材文件。\n插画实际复验：target_height与target_width按素材完整自然比例成对设置，不把单独max-height压成扁图；原图字节不变。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "个人健康"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 每周自动刷新 10 月 7 日跑完、正常退出，下次排在 10 月 14 日（10 月 11 日 16:3x 只读查看）；“近 7 天 AI 用了 5 次”是 10 月 3–9 日的小记录，之后未重新核对"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1 台"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "我问健康问题时"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "size": "large"
    },
    {
     "type": "action_button",
     "align": "center",
     "columns": 1,
     "columns_v": 1,
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "原图真实顺序：标题→介绍→卡外整宽插画→数字卡2×2→右对齐截至→居中按钮。原图未画复制按钮，定稿要求两按钮，程序应补第二按钮；不新增文案。整屏宽标题按新统一标准居中。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/fix-round-2/icon-clean-b3ca5198804d6b7dcf9c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手环心形",
   "source_phrase": "手腕上的设备",
   "sha256": "a7b8917c6567212dc729ba65aa4ce31b59234784e8a5641e26c7946a8e9bba2d",
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
   "source_phrase": "一叠分成几格的卡片",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "一本日历",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一个带对勾的循环箭头",
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
   "asset": "_library/illustrations/main-personal-health.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-health",
   "source_phrase": "右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。",
   "sha256": "fbd1f2129330dd87e3d7ab7700a2905db4b046aa75907bb91bcff8cb93fdf2ca",
   "status": "ready",
   "original_elements": [
    "一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面画抽象短线的四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表"
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
   "asset": "personal-health/personal-health-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-health-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ac4c8a0e1c9a6474e7e1",
   "title_text": "个人健康",
   "sha256": "30bc1415feacf84c41d8e4cf82a4e40701793e5bef66409672b025f10480a1fe",
   "status": "ready",
   "source_box": [
    46,
    77,
    520,
    257
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 个人健康

我问健康问题时，AI 先读一份整理好的“健康现状”，结合我的实际情况直接给判断和一个最省事的下一步。有新报告，就核对一次、整理进现状，平时不再翻原件。我说“更新健康数据”，它从穿戴设备补齐上次之后的记录，先核对完整，再挑出够格拿来判断的部分。另外，手环数据每 7 天自动刷新一次，结果等 AI 审阅后才决定写不写进现状。除此之外没有定时任务，不打卡，不催。

| **1 台** | **21 类** | **63 天** | **13 次** |
|---|---|---|---|
| Fitbit Air 手环，经 Google Health 接口读；手机管同步和运动 GPS | 设备数据每次全部补齐：睡眠、步数、心率、血氧…… | 完整覆盖 8 月 5 日（账号起点）到 10 月 6 日；有的日子没有记录 | 完整采集，分在 6 个更新日；最近一次是 10 月 7 日的每周自动刷新 |

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

::screen{#personal-health-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版：左上标题，标题下一行灰色小字。中间四张大圆角卡片两行两列，每张左上角一个圆形绿色编号和一个小水彩图标（①一个对话气泡，②一张处方笺旁边一个听诊器，③一张报告纸上一支绿笔在改一行，报告纸只画灰线，④手腕上的设备连到一台电脑，电脑旁边一本小日历），卡片标题粗体，下面一段正文；④卡多一小段粗体开头的“每 7 天自动刷新”，字多了这一行两张卡一起加高，字号不缩小。四张卡片下面横跨整屏一条浅绿底细条，写那句“每个回答都分清……”。最下面左对齐一行小字，末尾是链接。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和灰色小字在上；四张卡片一行一张上下排；浅绿细条和链接在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "去技能页看",
    "href": "/skills/personal-health/"
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
     "text_ref": "平时怎么用"
    },
    {
     "type": "prose",
     "text_ref": "平时只有一件事会自动发生"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "① 问健康问题",
     "item_count": 4
    },
    {
     "type": "notice",
     "align": "left",
     "text_ref": "每个回答都分清"
    },
    {
     "type": "prose",
     "text_ref": "跟 AI 怎么说"
    }
   ],
   "notes": "四卡2×2；编号圆章左上，插画在卡内左侧，文本在右，无卡间连线。底部整宽浅绿提示条两侧叶子，再一行说明及绿色链接。章节标题按统一标准居中。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "平时怎么用"
    },
    {
     "type": "prose",
     "text_ref": "平时只有一件事会自动发生"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "① 问健康问题",
     "item_count": 2
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "③ 有新报告",
     "item_count": 2
    },
    {
     "type": "notice",
     "text_ref": "每个回答都分清"
    },
    {
     "type": "prose",
     "text_ref": "跟 AI 怎么说"
    }
   ],
   "notes": "两张原竖图合看：v含标题介绍和第1、2卡，第1、2卡插画均在卡内正文下方；v2含第3、4纯文字卡、浅绿提示条和底部链接，未画第3、4插画。bottom_inside 是原图必需但 API 未列的变体，请组件支持，不能改为 top_inside。分张不重复标题。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一个对话气泡",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "听诊器检查",
   "source_phrase": "一张处方笺旁边一个听诊器",
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
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件写作",
   "source_phrase": "一张报告纸上一支绿笔在改一行，报告纸只画灰线",
   "sha256": "28af955cf2d0855d3f91be0690a129e092af2b43346eb766b773beab8f70519b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-b3ca5198804d6b7dcf9c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手环心形",
   "source_phrase": "手腕上的设备连到一台电脑",
   "sha256": "a7b8917c6567212dc729ba65aa4ce31b59234784e8a5641e26c7946a8e9bba2d",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-health/personal-health-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-health\\img\\personal-health-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8477921ac5c65e15db4b",
   "title_text": "平时怎么用",
   "sha256": "60c9e97a88acfcedd74e9fb83b6da164baa88d0d5f92d3774c43ec4726bce7e9",
   "status": "ready",
   "source_box": [
    35,
    3,
    520,
    151
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 平时怎么用

平时只有一件事会自动发生：手环数据每 7 天无人值守刷新一次（见④），刷完就停，不做持续的后台同步。下面四件事，都是我开口就做。

**① 问健康问题**
直接问，比如（示例）“最近总犯困，要紧吗？”AI 读健康现状就答：先看有没有要尽快去医院的信号，再给判断和一个最省事的下一步。只有缺的那条事实会改变结论时，才问我一句。

**② 看懂医生的建议**
把医生的建议告诉它。它结合我的情况、查当前权威的医学资料，讲清好处、风险、还有哪些别的选择，以及什么情况该停下或复查。它不代替医生查体、诊断和开药。

**③ 有新报告，或说法对不上**
把新报告交给它，或指出哪条不对。它先查来源清单，只打开相关的那一份原件，改掉现状里受影响的那几段，并记下出处。整理过一次，以后直接用。

**④ 更新设备数据**
说“更新健康数据”，最好说一句关心哪几天。它从上次没采完的那天补起，21 类数据全部采齐、存成原件、核对完整，再出一份简报；AI 看过简报，只把够格、和现实有关的结论写进现状。　**每 7 天自动刷新**　10 月 7 日起，电脑每 7 天自己跑一次同样的更新，走的是同一个入口和同一条核对链，不用我在电脑前，但要我已登录 Windows、私人资料在解锁期；密码中心只给这个登记过的采集程序一张 1 小时内有效的只读临时票。定时任务自己不改现状：采好的结果按固定约定都要经健康项目的 AI 审阅，合格又和现实有关的才写进现状。这个约定是规矩，不是“还没人看”的提醒，也不给我添每周的手工活。资料锁着就采不了，不绕过资料锁。

每个回答都分清：哪句是报告实测，哪句是医生结论，哪句是我自己说的，哪句是 AI 的建议，哪些还不知道。

跟 AI 怎么说、一个完整的例子：〔去技能页看〕

::screen{#personal-health-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-03",
  "section": "usage",
  "title": "断了、慢了、对不上怎么办",
  "scene": "横版：左上标题。下面七张横向小卡片，左栏四张、右栏三张，每张左边一个小水彩图标（一根断开又接上的绿线、一个到顶的计数表、一个沙漏、一把挂着小锁的钥匙、一本日历上连着七格灰色、一页纸上一格打了灰叉、一把合上的小锁），右边粗体小标题加两三行正文。右栏第三张下面空出的地方画一小幅水彩插画：手腕上的设备和手机之间一条虚线断开，旁边一个问号（不写字）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题在上；七张卡片一行一张上下排；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "个人资料锁着时",
    "href": "/rules/charter/#L18"
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
     "text_ref": "断了、慢了、对不上怎么办"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "row": "左右栏",
     "width": "52%",
     "text_ref": "更新到一半断了",
     "row_fit_illustration": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "row": "左右栏",
     "width": "46%",
     "text_ref": "一周没有新记录"
    },
    {
     "type": "illustration",
     "row": "左右栏",
     "illustration": "outside",
     "index": 0,
     "target_height": 220,
     "target_width": 265,
     "align": "center"
    }
   ],
   "notes": "已通过 replace_images 优先。左栏四张从上到下：更新到一半断了、请求太多被截停、卡住不动、授权或身份不对；右栏三张：一周没有新记录、某天的记录坏了、资料锁着。独立设备—问号—手机插画位于右栏三卡下面、在卡外。tail_illustration 是构图意图，主程序未声明支持；需要右栏复合容器，不能两列按行交错。标题按整屏宽标准居中。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：故障说明右栏末尾原手表插画等比限高220，两侧四条/三条说明高度趋同。 仅更改单页排版规格，不改定稿字句和素材文件。\n插画实际复验：target_height与target_width按素材完整自然比例成对设置，不把单独max-height压成扁图；原图字节不变。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "断了、慢了、对不上怎么办"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "更新到一半断了"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "size": "medium"
    }
   ],
   "notes": "七卡按定稿顺序单列，每卡插画在内左侧，文字右侧；设备—问号—手机插画卡外置底。无卡间连接。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断线",
   "source_phrase": "一根断开又接上的绿线",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "柱状图",
   "source_phrase": "一个到顶的计数表",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一个沙漏",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把挂着小锁的钥匙",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "一本日历上连着七格灰色",
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
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "禁止文件",
   "source_phrase": "一页纸上一格打了灰叉",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把合上的小锁",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-health.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "健康设备",
   "source_phrase": "右栏第三张下面空出的地方画一小幅水彩插画：手腕上的设备和手机之间一条虚线断开，旁边一个问号（不写字）。",
   "sha256": "fbd1f2129330dd87e3d7ab7700a2905db4b046aa75907bb91bcff8cb93fdf2ca",
   "status": "ready",
   "original_elements": [
    "手腕上的设备和手机之间一条虚线断开，旁边一个问号（不写字"
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
   "asset": "personal-health/personal-health-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-health\\img\\personal-health-03-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b7fc6f903d936aa151d4",
   "title_text": "断了、慢了、对不上怎么办",
   "sha256": "22543f42f797c3cf5f9a7ae9bfbdef2302b7df673d21d9878998d6bb03f491f4",
   "status": "ready",
   "source_box": [
    37,
    10,
    910,
    169
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 断了、慢了、对不上怎么办

**更新到一半断了**
已下载的原件都留着，采集清单（记着已经下了哪些原件）每 16 页存一次进度。下次说“更新健康数据”，它接着同一份采集清单往下采，不从头重下，也不另起一份。

**请求太多被截停**
每次最多发 5000 个请求，每秒不超过 5 个。到了上限就停下记好进度；只有这份清单确实往前走了，才自动接着跑。

**卡住不动**
一次更新最长等 5 小时，超时就把整串程序停掉，告诉我“超时”。

**授权或身份不对**
密码中心拒绝时（比如要重新绑定，或调用方不是登记过的 Codex、Claude 桌面版），不重试、不换路子，直接把原因告诉我。唯一的例外是每 7 天的手环自动刷新：它不从桌面 AI 启动，密码中心只对这个登记过的采集程序免掉“必须从桌面版启动”这一条，资料仍要解锁、票仍是 1 小时只读；别的程序这样调用，照样被拒。

**一周没有新记录**
最新记录满 7 天标“该更新”，满 10 天还没更新才标“超期静默”；会说清该查电脑这边还是设备那边，见亮点。

**某天的记录坏了**
只影响那一天；定位不到是哪天，就把那一页涵盖的几天都标出来。

**资料锁着**
读健康资料的每个命令都先过资料锁；锁着就请我验证，不绕路。见约法〔个人资料锁着时〕

::screen{#personal-health-04 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-04",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版：左上标题，标题下一行小标题“更新设备数据的一条链”。上半部一张从左到右的流程图，六个节点排成一行（圆角卡片，每张一个小水彩图标：一个对话气泡、一把钥匙穿过一扇小门、一朵云往下连一个文件夹、一个放大镜照着带对勾的清单、一张只有四根柱子的小卡片、一个人坐着看卡片并在一本小册子上写），绿色箭头依次连起来；节点标题粗体，下面两三行小字。下半部左右两张说明卡：左边“东西放在哪”（小图标：一个上锁的仓库和一个文件柜），右边“采哪 21 类”（三行分类，每行前面一个小图标：跑步的人、心形、月亮）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版保留现有v/v2分张：第1张personal-health-04-v仅原标题“它是怎么搭的”、副标题“更新设备数据的一条链”和既定六步完整程序架构原字。六步整宽上下排、正文正常370px直接读，箭头向下，第3步只读采集由云朵向下到文件夹，不画上传箭头。第1张不画下一分张“东西放在哪”“采哪21类”两块或其正文/插画；第2张原范围、原文件与全部原字保持，移除第1张跨张重复不删整屏原text。不新增标题/字/装饰，不新增分张，原横scene不动。最新单图native说明与完整本张来源优先于旧泛稿的“两卡在底部”。",
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
     "text_ref": "更新设备数据的一条链"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "arrow",
     "icons": "auto",
     "text_ref": "一句话",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "底部两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "东西放在哪"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "row": "底部两卡",
     "width": "49%",
     "size": "medium",
     "text_ref": "采哪 21 类"
    }
   ],
   "notes": "六步骤横排，每步插画卡内顶部、名称与正文下方，绿色箭头从左向右依次相连。下方两卡并排，插画均内左；卡内标题为中档，分别容纳定稿清单。原横图“不采”说明在右卡底部。第3步只读采集必须是云向文件夹下载。；QA04：按审查两张底卡取消无关图标，文字保持定稿完整。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
     "type": "section_heading",
     "align": "center",
     "size": "medium",
     "text_ref": "更新设备数据的一条链"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "icons": "auto",
     "text_ref": "一句话"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "东西放在哪"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "size": "medium",
     "text_ref": "采哪 21 类"
    },
    {
     "type": "prose",
     "text_ref": "不采："
    }
   ],
   "notes": "严格保留v/v2既有分张：v仅章节标题、副标题及六步骤；步骤整宽纵排、内左插画，五支箭头向下。v2从“东西放在哪”开始，两个纯文字说明卡，卡标题中档；“不采”段在卡外底部。v不得预画v2内容，不加重复字或新分张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一个对话气泡",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "source_phrase": "一把钥匙穿过一扇小门",
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
   "asset": "_library/fix-round-2/icon-clean-f12e6ff1182222417108.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云下载",
   "source_phrase": "一朵云往下连一个文件夹",
   "sha256": "a149b95737b7aae5ced9666a2cebe730366ea2410c938467df8d9e92e9459c39",
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
   "source_phrase": "一个放大镜照着带对勾的清单",
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
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "柱状图",
   "source_phrase": "一张只有四根柱子的小卡片",
   "sha256": "3a240e74ee63c13723583aa802c342fc3f52460f04f836dca6e1890a50b9b6b3",
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
   "source_phrase": "一个人坐着看卡片并在一本小册子上写",
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件柜",
   "source_phrase": "一个上锁的仓库和一个文件柜",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
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

# 它是怎么搭的

**更新设备数据的一条链**

1. **一句话**｜我说“更新健康数据”，AI 运行一个入口程序 google_health_refresh.py；每 7 天的定时任务（PersonalHealth Weekly Refresh）跑的也是这个入口，跑完就停
2. **放行**｜〔密码中心〕按这个采集程序的登记放行，授权对话里看不到。现在登记的是临时票方式（google-oauth-access-token-v1）：只核资料在解锁期，发一张最长 1 小时的只读临时票；长期凭据留在密码中心，不交给采集程序，这种方式按登记的程序位置认人，不核程序文件内容。代码里还留着整包方式作兼容（先核 import、history 两个程序的文件指纹 SHA-256，再把授权放进运行环境），现在没登记用它。10 月 11 日只读回读过电脑上现装的登记，和登记源一致。三个时限各管各的：每张票 1 小时，密码中心这一步最长 4 小时，整次更新最长 5 小时。票用满或请求到上限被截停时，只有同一份清单、请求确有进展才自动接着跑
3. **只读采集**｜google_health_import.py 是唯一联网、碰授权的程序：9 个只读权限，失败最多试 3 次；原样存进健康原件目录，每个文件记指纹
4. **离线核对**｜google_health_capture.py 不联网：核对清单和原件对得上，写一份核对回执
5. **出简报**｜google_health_brief.py 只读 4 类：睡眠、步数、活动分钟、运动；按最近 14、28、90 天统计
6. **AI 审阅**｜AI 看简报，只把够格、和现实有关的结论写进健康现状；程序自己从不改现状

**东西放在哪**
- 健康现状（CURRENT.md）和来源清单（SOURCES.md）：私有 GitHub 仓库
- 原始报告和设备原件：电脑本地的个人资料目录，不进 Git；每天 17:10 随个人资料备份到 G 盘，再同步到外接的 H 盘

**采哪 21 类**
- 活动 11 类：步数、距离、活动分钟、活动强度分钟、总消耗、久坐时段、运动记录、最大摄氧量、每日最大摄氧量、跑步最大摄氧量、游泳趟数
- 身体 9 类：心率、静息心率、心率变异性、每日心率变异性、血氧、每日血氧、每日呼吸率、睡眠呼吸率、睡眠皮温变化
- 睡眠 1 类：睡眠

不采：食物库和计量单位表（参考资料，不是我的记录）、心电图（接口不支持）。设备自己没有 GPS，运动轨迹靠手机连着时的 GPS（connected GPS）。

**数据来源能证明到哪一层**：采集时按 google-wearables 筛，只能证明记录来自 Google/Fitbit 的穿戴设备家族，并排除手动录入和手机估算的数据；接口不逐条证明“这条一定出自这只 Fitbit Air”。设备名 Fitbit Air 来自登记，不是每条记录各自的身份证明。

::screen{#personal-health-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-05",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。左边约三分之二宽，六张横向小卡片两列三行，每张左边一个小水彩图标（一本合上的小册子、一个漏斗、一个空的量杯旁边一个问号、一只安静睡着的小铃铛、一扇只开一道的小门、一个工具箱上画一个灰色小叉），右边粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；六张卡片一行一张上下排；三张大数字卡放在最下面，一行一张。字和横版完全一样。",
  "crop_expansion": {
   "h": {
    "input_sha256": "2b69a1cbd12b31a5196fc680fb3096ee056603693c7fba23f20c322a6440cbf8",
    "crop_px": [
     0,
     69,
     1672,
     895
    ]
   }
  },
  "links": [],
  "anchors": [
   {
    "id": "design",
    "text": "为什么这样设计"
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
     "align": "left",
     "size": "large",
     "width": "64%",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "整理一次，以后直接用。"
    },
    {
     "type": "stat_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "8,591"
    }
   ],
   "notes": "真实原图：左约65%区域先标题再六卡2列3行，图标内左；右约34%三张数字卡从屏顶到屏底纵排，数字左、图标内右、说明在数字下。此处标题不整屏宽，照原图左对齐。当前基础行结构无法让右数字栏跨标题及六卡高度，需要复合左右容器或跨行能力；草案记录目的，不得伪称已复现。right_inside 原图必需，API未列该变体。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "整理一次，以后直接用。"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "8,591"
    }
   ],
   "notes": "六卡从上到下单列、插画内左；三张数字卡在下单列，数字左、插画内右、正文在数字下。无连线。right_inside 需组件支持。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一本合上的小册子",
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
   "asset": "_library/hires-icons-r2/icon-clean-4205bfa25ba5315c2689.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "漏斗",
   "source_phrase": "一个漏斗",
   "sha256": "f9da51c597ecd23a0a9b23ff5925e01976e0669282f2be48547aa707ffde018a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7079fea533a5aaa393b7.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "量杯",
   "source_phrase": "一个空的量杯旁边一个问号",
   "sha256": "e29f13f8794666e21134e5d7ace38e13b2b9461c137799996727f6af5099a732",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/铃铛.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "铃铛",
   "source_phrase": "一只安静睡着的小铃铛",
   "sha256": "56b2a813f19362acfb646d67474d0542cda7469044b3dc36dff5f80d88d1bd91",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇只开一道的小门",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "工具箱",
   "source_phrase": "一个工具箱上画一个灰色小叉",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "**8454 行**",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "**197 个**",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "**68 次**",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
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

**整理一次，以后直接用。**
报告核对过就写进健康现状；平时回答只读它，不反复翻原件，也不让我把已有的情况再讲一遍。

**采到不等于拿来判断。**
逐点心率、GPS 这类量大、噪声大的只存，默认不读，问到具体哪天、哪类时才窄查那一小段；够不够格下结论，见亮点。

**没测过不等于正常。**
缺记录不当成零，也不默认是我没戴；旧报告不回答“现在怎样”，不知道就写不知道。

**不催不扰。**
不设每日打卡、健康评分、持续的后台监测；没有新情况就不来打扰。

**授权只经过一道门。**
平时只有采集程序拿得到 Google 授权，而且只是 1 小时的只读临时票；核对、简报、查询全部离线，不联网，也碰不到授权。

**不另起一套。**
不建数据库、诊断引擎，也不做持续的后台同步：手环每 7 天的定时刷新跑完就停，不常驻；我的背景从个人理解库取，讲给我听时照约法的说话规矩。

| **8,591 行** | **254 个** | **185 次** |
|---|---|---|
| Python 正式代码，7 个程序 | 自动测试用例（209 个测试函数展开后），用合成数据，不碰真实记录；10 月 31 日只清点了数量，没有重跑 | 提交，8 月 25 日起，10 月 31 日 09:26 数 |

::screen{#personal-health-06 section="highlights"}

```typeset
{
 "screen": {
  "id": "personal-health-06",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：和照片视频录音管理页的“亮点”一样：左上标题，三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 两卷胶片，一卷大部分是淡淡的虚线（表示直接引用旧的），末尾一小段是实的绿色（新补的），旁边一个小秒表；2 一台电脑和手腕上的设备之间一条虚线，中间一个放大镜照着一本日历，日历上连着八格灰色；3 一个漏斗，上面落进许多杂乱的小点，下面只出来四根整齐的绿色小柱子。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；三张卡片一行一张上下排，每张插画在卡片上方。字和横版完全一样。",
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
     "columns_v": 3,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/文稿堆.png"
     ],
     "text_ref": "隔一周再更新，也只要 69 秒。"
    }
   ],
   "notes": "三张大卡横排，三幅插画真实均在卡内顶部，标题中档、正文左对齐；不是 above_card。每卡独立、无连接。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "text_ref": "隔一周再更新，也只要 69 秒。"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/icons/文稿堆.png"
     ],
     "text_ref": "设备停了，它分得清是哪边的问题。"
    }
   ],
   "notes": "真实v：章节标题→胶片秒表独立插画在第一卡上方、卡外→第一纯文字卡。v2只有第2、3纯文字卡，无它们的插画、无重复章节标题。不要套用scene所说每卡一插画。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "设备停了，它分得清是哪边的问题。 \n更新是我开口才跑，没有后台同步；设备、手机App或账号同步停了，电脑这边看不出来，只有拿日期一比才暴露。新鲜度检查只读日期、不读任何数值：最新记录离今天满7天标“该更新”，满10天电脑这边还没跑更新，才标“超期静默”。我每周更新一次，不留这3天余量，每次更新前一刻都会被误标成静默。要是一周内刚更新过、设备仍没有新记录，就不等10天，直接标“静默”，说明该查的是设备、手机App或账号同步。9月26日它查出最新记录已经8天，原因是电脑这边没跑更新；当天补采后恢复正常。个人理解库查“哪些来源好久没动”时也读它。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "有记录，不等于能下结论。 \n设备会漏记、重复，也会把一段睡眠同时标成主睡眠和小睡；直接拿来算，结论会被噪声带偏。简报只用睡眠、步数、活动分钟、运动4类；一段时间里有记录的天数不到80%，或记录有重复、残缺、归不清，就标“部分可用”，不拿来下结论。同时标了主睡眠和小睡的，时长只算一次，也不去猜它是哪种。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "时钟",
   "source_phrase": "隔一周再更新，也只要 69 秒。 \n以前每次都从8月5日整段重采：9月12日那次发了284个请求，用了约32分钟。提速分两步。9月12日起记住上次采到哪天，只从没采完的那天补起，已完成的历史直接引用旧原件、不再联网：9月19日05:03补一周，请求降到73个，但还是用了约17分半。05:33改成复用网络连接，不再每个请求重新握手：05:41补当天，22个请求、26秒。到9月26日补一周，77个请求、69秒；紧接着补当天，23个请求、39秒，传输开了gzip压缩，这次网上只走了约0.1MB，解开是4.5MB。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "设备停了，它分得清是哪边的问题。 \n更新是我开口才跑，没有后台同步；设备、手机App或账号同步停了，电脑这边看不出来，只有拿日期一比才暴露。新鲜度检查只读日期、不读任何数值：最新记录离今天满7天标“该更新”，满10天电脑这边还没跑更新，才标“超期静默”。我每周更新一次，不留这3天余量，每次更新前一刻都会被误标成静默。要是一周内刚更新过、设备仍没有新记录，就不等10天，直接标“静默”，说明该查的是设备、手机App或账号同步。9月26日它查出最新记录已经8天，原因是电脑这边没跑更新；当天补采后恢复正常。个人理解库查“哪些来源好久没动”时也读它。",
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
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "胶片媒体现图小槽4比3",
   "source_phrase": "插画：1 两卷胶片，一卷大部分是淡淡的虚线（表示直接引用旧的），末尾一小段是实的绿色（新补的），旁边一个小秒表；2 一台电脑和手腕上的设备之间一条虚线，中间一个放大镜照着一本日历，日历上连着八格灰色；3 一个漏斗，上面落进许多杂乱的小点，下面只出来四根整齐的绿色小柱子。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready",
   "original_elements": [
    "两卷胶片，一卷大部分是淡淡的虚线（表示直接引用旧的），末尾一小段是实的绿色（新补的），旁边一个小秒表"
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
   "asset": "_library/illustrations/main-personal-health.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "健康设备",
   "source_phrase": "插画：1 两卷胶片，一卷大部分是淡淡的虚线（表示直接引用旧的），末尾一小段是实的绿色（新补的），旁边一个小秒表；2 一台电脑和手腕上的设备之间一条虚线，中间一个放大镜照着一本日历，日历上连着八格灰色；3 一个漏斗，上面落进许多杂乱的小点，下面只出来四根整齐的绿色小柱子。",
   "sha256": "fbd1f2129330dd87e3d7ab7700a2905db4b046aa75907bb91bcff8cb93fdf2ca",
   "status": "ready",
   "original_elements": [
    "一台电脑和手腕上的设备之间一条虚线，中间一个放大镜照着一本日历，日历上连着八格灰色"
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
   "asset": "_library/illustrations/ill-5517e0b7749246.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-5517e0b7749246",
   "source_phrase": "插画：1 两卷胶片，一卷大部分是淡淡的虚线（表示直接引用旧的），末尾一小段是实的绿色（新补的），旁边一个小秒表；2 一台电脑和手腕上的设备之间一条虚线，中间一个放大镜照着一本日历，日历上连着八格灰色；3 一个漏斗，上面落进许多杂乱的小点，下面只出来四根整齐的绿色小柱子。",
   "sha256": "9e495e81fd1258397ef9d83b58e8fe2e3c8ac481d35c44712805cbe448d83596",
   "status": "ready",
   "original_elements": [
    "一个漏斗，上面落进许多杂乱的小点，下面只出来四根整齐的绿色小柱子"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-health\\img\\personal-health-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    19,
    0,
    246,
    205
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 亮点

**隔一周再更新，也只要 69 秒。**
以前每次都从 8 月 5 日整段重采：9 月 12 日那次发了 284 个请求，用了约 32 分钟。提速分两步。9 月 12 日起记住上次采到哪天，只从没采完的那天补起，已完成的历史直接引用旧原件、不再联网：9 月 19 日 05:03 补一周，请求降到 73 个，但还是用了约 17 分半。05:33 改成复用网络连接，不再每个请求重新握手：05:41 补当天，22 个请求、26 秒。到 9 月 26 日补一周，77 个请求、69 秒；紧接着补当天，23 个请求、39 秒，传输开了 gzip 压缩，这次网上只走了约 0.1 MB，解开是 4.5 MB。

**设备停了，它分得清是哪边的问题。**
更新原来只在我开口时跑（10 月 7 日起另有每 7 天一次的自动刷新），也没有持续的后台同步；设备、手机 App 或账号同步停了，电脑这边看不出来，只有拿日期一比才暴露。新鲜度检查只读日期、不读任何数值：最新记录离今天满 7 天标“该更新”，满 10 天电脑这边还没跑更新，才标“超期静默”。我每周更新一次，不留这 3 天余量，每次更新前一刻都会被误标成静默。要是一周内刚更新过、设备仍没有新记录，就不等 10 天，直接标“静默”，说明该查的是设备、手机 App 或账号同步。9 月 26 日它查出最新记录已经 8 天，原因是电脑这边没跑更新；当天补采后恢复正常。个人理解库查“哪些来源好久没动”时也读它。

**有记录，不等于能下结论。**
设备会漏记、重复，也会把一段睡眠同时标成主睡眠和小睡；直接拿来算，结论会被噪声带偏。简报只用睡眠、步数、活动分钟、运动 4 类；一段时间里有记录的天数不到 80%，或记录有重复、残缺、归不清，就标“部分可用”，不拿来下结论。同时标了主睡眠和小睡的，时长只算一次，也不去猜它是哪种。

::screen{#personal-health-07 section="features"}

```typeset
{
 "screen": {
  "id": "personal-health-07",
  "section": "features",
  "title": "全部功能",
  "scene": "横版：和标杆页“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；四组依次往下排。每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（“｜在用”这类字不画出来，只画圆点）。顶上标题，标题下一行图例，图例下一行小字。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。15 张卡片一屏放完。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题、图例和说明在上；组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-ask",
    "text": "问健康问题"
   },
   {
    "id": "f-ask",
    "text": "健康问答"
   },
   {
    "id": "f-red-flags",
    "text": "急症提醒"
   },
   {
    "id": "f-treatment",
    "text": "看懂医生建议"
   },
   {
    "id": "f-evidence",
    "text": "分清依据"
   },
   {
    "id": "g-records",
    "text": "报告和现状"
   },
   {
    "id": "f-new-report",
    "text": "新报告和纠错"
   },
   {
    "id": "f-writeback",
    "text": "新认识写回理解库"
   },
   {
    "id": "g-device",
    "text": "更新设备数据",
    "locator_instances": {
     "h": {
      "input_sha256": "271d2b0dd3d70514b189f46e22c8ac07064c26acda6b843e0220a00ae0a40eb5",
      "instances": [
       {
        "context_text": "更新设备数据",
        "context_rect": [
         846,
         405,
         1080,
         450
        ],
        "expected_rect": [
         846,
         405,
         1080,
         450
        ]
       }
      ]
     },
     "v": {
      "input_sha256": "e4caf2ade64e2fe2a4a5ca87ef47d0becbcfe2fbd0ea6ffa5d15351e9684f382",
      "instances": [
       {
        "context_text": "更新设备数据",
        "context_rect": [
         167,
         1664,
         526,
         1744
        ],
        "expected_rect": [
         167,
         1664,
         526,
         1744
        ]
       }
      ]
     }
    }
   },
   {
    "id": "f-enroll",
    "text": "一次授权"
   },
   {
    "id": "f-refresh",
    "text": "更新设备数据",
    "locator_text": {
     "h": "8. 更新设备数据",
     "v": "8. 更新设备数据"
    }
   },
   {
    "id": "f-weekly-refresh",
    "text": "每 7 天自动刷新"
   },
   {
    "id": "f-resume",
    "text": "中断接着采"
   },
   {
    "id": "g-query",
    "text": "查设备记录"
   },
   {
    "id": "f-brief",
    "text": "一段时间简报"
   },
   {
    "id": "f-day",
    "text": "查某天记录"
   },
   {
    "id": "f-freshness",
    "text": "记录新不新"
   },
   {
    "id": "f-partial-days",
    "text": "查没采全的日子"
   },
   {
    "id": "f-verify",
    "text": "重新核对原件"
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
     "align": "left",
     "size": "large",
     "row": "标题与图例",
     "width": "43%",
     "text_ref": "全部功能（15 项）"
    },
    {
     "type": "status_legend",
     "align": "left",
     "row": "标题与图例",
     "width": "55%",
     "text_ref": "图例："
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/心形.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/icons/盾牌对勾.png",
      "_library/round3/clean-assets/png/05-灯泡-clean.png"
     ],
     "size": "medium",
     "text_ref": "问健康问题",
     "fill_last_row": true
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/双气泡.png"
     ],
     "size": "medium",
     "text_ref": "报告和现状",
     "fill_last_row": true
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons/打勾清单.png"
     ],
     "size": "medium",
     "text_ref": "更新设备数据",
     "fill_last_row": true
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/09-时钟-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png"
     ],
     "size": "medium",
     "text_ref": "查设备记录",
     "fill_last_row": true
    }
   ],
   "notes": "以真实原图构图覆盖scene通用三列说明：主标题左、图例及说明右，共一行。第一组4卡等宽横排；第二行左“报告和现状”2卡，右“更新设备数据”3卡；第三行“查设备记录”5卡。组名中档在各组上方，插画卡内左、编号标题文本右、状态点右上。四组编号1–14不重排；没有卡间箭头。此主标题只占43%，不属于整屏宽居中标题。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：功能组短末行使用已有fill_last_row，孤卡或两卡均分整行，保留原条序和图标。 仅更改单页排版规格，不改定稿字句和素材文件。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（15 项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例："
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/心形.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/icons/盾牌对勾.png",
      "_library/round3/clean-assets/png/05-灯泡-clean.png"
     ],
     "size": "medium",
     "text_ref": "问健康问题"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/双气泡.png"
     ],
     "size": "medium",
     "text_ref": "报告和现状"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/钥匙.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons/打勾清单.png"
     ],
     "size": "medium",
     "text_ref": "更新设备数据"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons/09-时钟-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png"
     ],
     "size": "medium",
     "text_ref": "查设备记录"
    }
   ],
   "notes": "v含标题图例及第1、2组（1–6）；v2从第3组“更新设备数据”开始（7–14），不重复标题图例。组名内有一小插画在左，组名中档毛笔字；每卡插画在内左、状态圆点右上、文本右。不输出功能行“｜在用”等状态文字，保留真实圆点。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/心形.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "心形",
   "source_phrase": "健康问答｜直接问担心的事，AI 读健康现状，给判断和一个最省事的下一步｜在用",
   "sha256": "db3d0fe685ec9faa104fd819f19c021113f854175bb9db72c1d232ab24af8904",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "急症提醒｜说症状和什么时候开始的，先看有没有要尽快去医院的信号｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
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
   "source_phrase": "看懂医生建议｜查当前权威医学资料，讲清好处、风险、别的选择和什么时候停下或复查；不代替医生｜在用",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "灯泡",
   "source_phrase": "分清依据｜每个结论标明靠的是报告实测、医生结论、我自己说的、AI 建议，还是不知道｜在用",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "新报告和纠错｜只打开相关的那份原件，改现状里受影响的几段，记下出处；以后不再翻原件｜在用",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双气泡",
   "source_phrase": "新认识写回理解库｜健康对话里出现值得以后用的本人信息，写回个人理解库；病历和设备数据不复制过去｜在用",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "一次授权｜第一次用时授权一次 Google，长期凭据直接存进密码中心，之后不用再授权｜在用",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
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
   "source_phrase": "更新设备数据｜从上次没采完的那天补齐 21 类数据：存原件、核对、出简报，AI 审阅后再改现状｜在用",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "中断接着采｜断了或请求到上限被截停，下次接着同一份清单往下采，不重下、不另起｜待验收",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "一段时间简报｜问某段时间睡眠或活动怎么样：只用够格的记录算，不够格的说清缺在哪｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "查某天记录｜不重新采集，按那一天、那一类从原件里窄查｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "记录新不新｜只给日期：设备记录到哪天；满 7 天标“该更新”，满 10 天没更新才标“超期静默”，说清是哪边停了｜在用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "查没采全的日子｜核对某次采集里哪几天可能没采全；只读，不补采｜待验收",
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
   "source_phrase": "重新核对原件｜对一份采集完的清单，重算每个原件的指纹和记录数｜说不准",
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
   "asset": "_library/titles/title-d6a05c1a9e5e8bbcf9a7.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d6a05c1a9e5e8bbcf9a7",
   "title_text": "全部功能（14 项）",
   "sha256": "f217912415d125d84cd5997b99e0bcc94cdb939334451565819bed7e7505c526",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（15 项）

图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
待验收＝做好了，还没在真实使用里验过；说不准＝用的时候不留记录，也没找到用过的痕迹。

**问健康问题**
1. 健康问答｜直接问担心的事，AI 读健康现状，给判断和一个最省事的下一步｜在用
2. 急症提醒｜说症状和什么时候开始的，先看有没有要尽快去医院的信号｜在用
3. 看懂医生建议｜查当前权威医学资料，讲清好处、风险、别的选择和什么时候停下或复查；不代替医生｜在用
4. 分清依据｜每个结论标明靠的是报告实测、医生结论、我自己说的、AI 建议，还是不知道｜在用

**报告和现状**
5. 新报告和纠错｜只打开相关的那份原件，改现状里受影响的几段，记下出处；以后不再翻原件｜在用
6. 新认识写回理解库｜健康对话里出现值得以后用的本人信息，写回个人理解库；病历和设备数据不复制过去｜在用

**更新设备数据**
7. 一次授权｜第一次用时授权一次 Google，长期凭据直接存进密码中心，之后不用再授权｜在用
8. 更新设备数据｜从上次没采完的那天补齐 21 类数据：存原件、核对、出简报，AI 审阅后再改现状｜在用
9. 每 7 天自动刷新｜电脑每 7 天无人值守跑一次更新：要我已登录 Windows、资料在解锁期，只拿 1 小时只读临时票；结果待 AI 审阅，不直接改现状；10 月 7 日第一次自动跑成功｜在用
10. 中断接着采｜断了或请求到上限被截停，下次接着同一份清单往下采，不重下、不另起｜待验收

**查设备记录**
11. 一段时间简报｜问某段时间睡眠或活动怎么样：只用够格的记录算，不够格的说清缺在哪｜在用
12. 查某天记录｜不重新采集，按那一天、那一类从原件里窄查｜待验收
13. 记录新不新｜只给日期：设备记录到哪天；满 7 天标“该更新”，满 10 天没更新才标“超期静默”，说清是哪边停了｜在用
14. 查没采全的日子｜核对某次采集里哪几天可能没采全；只读，不补采｜待验收
15. 重新核对原件｜对一份采集完的清单，重算每个原件的指纹和记录数｜说不准

::screen{#personal-health-08 section="history"}

```typeset
{
 "screen": {
  "id": "personal-health-08",
  "section": "history",
  "title": "演进",
  "scene": "横版：左侧一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字。右侧一幅大一点的水彩插画：从左下到右上依次是一张报告纸（只画灰线）、一本小册子、手腕上的设备、一台电脑，像一路长出来的样子，中间用绿色细藤蔓连起来。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；时间线一行一个节点上下排；插画缩小放在最下面。字和横版完全一样。",
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
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": "auto",
     "row": "演进左右",
     "width": "100%",
     "text_ref": "8 月 25 日",
     "direction": "vertical",
     "connector_style": "thin_line",
     "split_at": 4
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": [
      8,
      "_library/icons/日历时钟.png"
     ],
     "width": "100%",
     "text_ref": "9 月 27 日",
     "direction": "vertical",
     "connector_style": "thin_line"
    }
   ],
   "notes": "原标题与10节点时间线共在左约47%，右约52%独立大插画自下向上贯通。时间线节点卡内左图标、右日期及正文；左外一条绿色竖线与10圆点相连。整屏标题按新标准居中；左右构图依原图。插画藤蔓由左下纸张向右上设备及电脑生长；不另加文字。；QA04：按审查时间线整宽双列竖排，固定5+4分界，取消同行手表独立插画。\n2026-10-06 Astra复核退回：恢复原双栏，仅拆出末节点为整行；前段保持双栏，末图标明确使用本屏原序列的最后一个。\n本轮十节点配套：前段8个，末段9月27日与10月7日2个；保留既有分栏与末段单列样式。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/icons/断线.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/hires-icons/09-时钟-clean.png",
      "_library/hires-icons/打勾清单.png",
      "_library/round3/clean-assets/png/12-文件核验-clean.png",
      "_library/icons/文稿堆.png",
      "_library/icons/日历时钟.png"
     ],
     "text_ref": "8 月 25 日",
     "direction": "vertical",
     "connector_style": "thin_line"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "size": "medium"
    }
   ],
   "notes": "10节点单列；每节点左内图标右日期及正文，节点左外竖线圆点贯通。卡外插画置底，保持纸张→册子→设备→电脑顺序。整屏标题按新标准居中。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "8 月 25 日：建项目：整理好的健康现状为准；能把 Fitbit 数据原样存下来；一次授权，凭据存进受保护的凭据中心",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "8 月 26 日：更新可以断点接着来；加离线简报，只有够格的记录才拿来判断；只取 Fitbit Air 设备自己的数据，不要手动录入和手机估算的",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
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
   "source_phrase": "8 月 31 日：采集结果不完整，就整份不接受",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "9 月 5 日：能按指定日期区间统计；中断后的恢复更稳",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 12 日：改成只补新的：从上次没采完的那天补起；传输开 gzip 压缩",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "9 月 19 日：复用网络连接，补当天从几分钟降到半分钟以内",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "9 月 24 日：写下设备采集约定；修正一天从哪算到哪、断了以后怎么接着采，以及资料锁检查",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "9 月 25–26 日：数据换盘后核对回执照样有效；Codex、Claude 都能跑更新；加新鲜度检查",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "9 月 27 日：资料锁改用统一接法",
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
   "asset": "_library/illustrations/main-personal-health.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-health",
   "source_phrase": "右侧一幅大一点的水彩插画：从左下到右上依次是一张报告纸（只画灰线）、一本小册子、手腕上的设备、一台电脑，像一路长出来的样子，中间用绿色细藤蔓连起来。",
   "sha256": "fbd1f2129330dd87e3d7ab7700a2905db4b046aa75907bb91bcff8cb93fdf2ca",
   "status": "ready",
   "original_elements": [
    "从左下到右上依次是一张报告纸（只画灰线）、一本小册子、手腕上的设备、一台电脑，像一路长出来的样子，中间用绿色细藤蔓连起来"
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

# 演进

- **8 月 25 日**：建项目：整理好的健康现状为准；能把 Fitbit 数据原样存下来；一次授权，凭据存进受保护的凭据中心
- **8 月 26 日**：更新可以断点接着来；加离线简报，只有够格的记录才拿来判断；只取 Google/Fitbit 穿戴设备的数据，不要手动录入和手机估算的
- **8 月 31 日**：采集结果不完整，就整份不接受
- **9 月 5 日**：能按指定日期区间统计；中断后的恢复更稳
- **9 月 12 日**：改成只补新的：从上次没采完的那天补起；传输开 gzip 压缩
- **9 月 19 日**：复用网络连接，补当天从几分钟降到半分钟以内
- **9 月 24 日**：写下设备采集约定；修正一天从哪算到哪、断了以后怎么接着采，以及资料锁检查
- **9 月 25–26 日**：数据换盘后核对回执照样有效；Codex、Claude 都能跑更新；加新鲜度检查
- **9 月 27 日**：资料锁改用统一接法
- **10 月 7 日**：手环每 7 天无人值守刷新；密码中心只对这个采集程序免掉“必须从桌面版启动”，资料仍要解锁、只给 1 小时只读票；当天 18:24 第一次自动跑成功，用时约 1 分钟
