---
{
 "title": "个人网站（总看板）",
 "kind": "project",
 "url": "/projects/wly0829-cn/",
 "tagline": "唯一总看板：有没有事、是否需要本人处理，一眼看清。",
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
  "reading_order": [
   "wly0829-cn-01",
   "wly0829-cn-02"
  ],
  "schema": "site-b1.page.v1",
  "page": "wly0829-cn",
  "kind": "project",
  "title": "个人网站（总看板）",
  "url": "/projects/wly0829-cn/",
  "tagline": "唯一总看板：有没有事、是否需要本人处理，一眼看清。",
  "status": "常用",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次更新",
    "at": "2026-10-12 04:12"
   },
   "facts": [
    "近 7 天提交 732 次"
   ],
   "as_of": "2026-10-12",
   "source": "网站仓库主线修改记录（主线 19f5bab7，近 7 天按 10 月 12 日 04:36 向前 7 天计）"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/wly0829.cn",
  "capability": "把我要知道的事都放在一个地方",
  "based_on": {
   "commit": "ef288407b21160948562616a5824b89590bfe606",
   "commit_time": "2026-10-07T06:03:28-05:00",
   "file": "网站仓库 sources/pages（cockpit、computer-access、projects-home、how-this-site）现读；owner-decisions 10 月 6–7 日网站各节；派活说明里主持已核实的事实（北京时间 10 月 7 日 17:40 本人原话）"
  },
  "video_prompt": "",
  "registry": {
   "groups": [
    {
     "id": "g-front",
     "name": "首页和驾驶舱"
    },
    {
     "id": "g-lock",
     "name": "资料锁和授权"
    },
    {
     "id": "g-read",
     "name": "读懂整套东西"
    },
    {
     "id": "g-upkeep",
     "name": "AI 怎么维护"
    },
    {
     "id": "g-paint",
     "name": "画和动效"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-home",
     "group": "g-front",
     "name": "首页总入口",
     "what": "我是谁、这套东西办过什么事、从哪进去",
     "how": "打开 wly0829.cn",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-home-time",
     "group": "g-front",
     "name": "首页的画跟着时段换",
     "what": "清晨、白天、傍晚、晚上，也能自己点着换",
     "how": "首页画旁的选项",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-home-screen",
     "group": "g-front",
     "name": "画里的电脑屏幕进驾驶舱",
     "what": "点首页画里电脑的屏幕，直接进驾驶舱",
     "how": "点首页画里的屏幕",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "D 轮真实发布验收：Chrome 1440×1000 宽屏及 390×844 手机尺寸仿真均实点进入驾驶舱成功；此入口验收不代表 C10 网络LIVE通过。"
    },
    {
     "id": "f-light",
     "group": "g-front",
     "name": "驾驶舱总灯",
     "what": "绿都正常，黄要留意，红马上处理，灰是电脑不在线",
     "how": "驾驶舱最上面",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-attention",
     "group": "g-front",
     "name": "要我处理的事",
     "what": "只列真要我管的，标题直接说出是什么问题",
     "how": "驾驶舱总灯下面",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-plain",
     "group": "g-front",
     "name": "说人话、读不到合成一行",
     "what": "驾驶舱用大白话写；读不到的几项并成一行说清",
     "how": "驾驶舱各块",
     "status": "待实施",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-refresh",
     "group": "g-front",
     "name": "一直看得见的刷新按钮",
     "what": "每分钟自动读取已在用；滚到哪里都看得见的手动刷新按钮仍在接入，常驻可点效果待验",
     "how": "驾驶舱；自动读取与手动常驻按钮分别验收",
     "status": "待实施",
     "screen": "wly0829-cn-11",
     "source": "2026-10-07 18:18–18:19线上驾驶舱JS有60秒调度；常驻按钮效果尚未完成本轮浏览器验收。"
    },
    {
     "id": "f-pc",
     "group": "g-front",
     "name": "电脑和远程",
     "what": "温度、占用、磁盘、网络，远程连接和副机在不在线，近 24 小时曲线",
     "how": "驾驶舱“电脑”",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-tasks",
     "group": "g-front",
     "name": "自动任务",
     "what": "在做什么、上次下次、有没有出错、怎么停、停了影响什么",
     "how": "驾驶舱“自动任务”",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-backup",
     "group": "g-front",
     "name": "备份和云端",
     "what": "按去处列，超期变黄，两个周期没成功变红",
     "how": "驾驶舱“备份和云端”",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-projects",
     "group": "g-front",
     "name": "项目出错和等验收",
     "what": "只列出错的和等验收的，等多久都只提醒不变色",
     "how": "驾驶舱“项目”",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-river",
     "group": "g-front",
     "name": "今天的动态和今天的河",
     "what": "按北京时间排今天有凭据的事，画成河上的船，下面是记录",
     "how": "驾驶舱最下面",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-cost",
     "group": "g-front",
     "name": "余额和花费提醒",
     "what": "阿里云可用额度低于10元的短信、邮件提醒已开启；驾驶舱余额和本月花费仍待接入，实际通知送达尚未验证",
     "how": "阿里云资金账户和消息中心；驾驶舱金额显示待接入",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "2026-10-07 10:09–10:17 已设置10元阈值并用新页面独立回读，短信邮件渠道启用；本轮没有触发或送达测试。"
    },
    {
     "id": "f-lag",
     "group": "g-front",
     "name": "电脑会不会卡的预警",
     "what": "资源预警后端已部署，AI可读取同一结论；趋势需至少25小时积累，目前在观察期，驾驶舱显示待接入",
     "how": "让AI检查电脑资源风险；驾驶舱显示待接入",
     "status": "在用",
     "screen": "wly0829-cn-11",
     "source": "PCConfig现行pcconfig.pc-health.v1合同；2026-10-07 18:14:13公开状态回读state=ok、trend_state=warming，覆盖4.08小时，样本18:13:40；当前驾驶舱JS未接pc_health字段。"
    },
    {
     "id": "f-data-lock",
     "group": "g-lock",
     "name": "个人资料锁",
     "what": "看锁没锁；验证一次，开一段我定的时长",
     "how": "授权与状态",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-takeover",
     "group": "g-lock",
     "name": "全局无限制授权",
     "what": "开启、结束、延长，和资料分开计时",
     "how": "授权与状态",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-winlock",
     "group": "g-lock",
     "name": "Windows 锁屏",
     "what": "看锁没锁，一键锁屏，不动另外两项的期限",
     "how": "授权与状态",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-unlock-jump",
     "group": "g-lock",
     "name": "解锁跳转和办理区",
     "what": "从别处点“解锁”直接落在办理那块、不弹回；办理区重排",
     "how": "授权与状态",
     "status": "待实施",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-all-projects",
     "group": "g-read",
     "name": "全部项目",
     "what": "按本事分组，每个项目一页：怎么用、怎么搭、全部功能、演进",
     "how": "全部项目",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-rules",
     "group": "g-read",
     "name": "规则",
     "what": "30 条约法和 10 个专题，始终是当前生效的版本",
     "how": "规则",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-skills",
     "group": "g-read",
     "name": "技能",
     "what": "AI 照着办的说明书，写清怎么跟 AI 说",
     "how": "技能",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-how",
     "group": "g-read",
     "name": "怎么协作",
     "what": "我、Claude、GPT 和各项目怎么接力，能点着看",
     "how": "怎么协作",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-rescue",
     "group": "g-read",
     "name": "救急先看",
     "what": "电脑卡死、连不上、代理坏了，按症状照着做",
     "how": "救急先看",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-connect",
     "group": "g-read",
     "name": "连接电脑",
     "what": "自己远程看桌面，或让 AI 用这台电脑",
     "how": "连接电脑",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-brief",
     "group": "g-read",
     "name": "复制 AI 续作说明",
     "what": "项目页一键复制，新对话照着接着干",
     "how": "各项目页开头",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-on-demand",
     "group": "g-upkeep",
     "name": "按需更新",
     "what": "我说一声或项目真有变化才改，只重出受影响的屏",
     "how": "跟 AI 说“更新网站”",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-speed-target",
     "group": "g-upkeep",
     "name": "小改 45 分钟、大批 3 小时",
     "what": "从定稿到线上核对完的目标，还要实测证明",
     "how": "AI 汇报里写实际用时",
     "status": "待验收",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-gate",
     "group": "g-upkeep",
     "name": "发布前自动检查",
     "what": "逐字、字高、出界重叠、可点区域、同页样式，过不了不发",
     "how": "AI 发布时自动跑",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-gate-layout",
     "group": "g-upkeep",
     "name": "排版和交互检查进发布门",
     "what": "按已批准的现有问题基线拦住本轮新增排版和交互问题",
     "how": "AI 发布时自动跑",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "已发布 main 5417b8b82b9827746307dab51d1fab933ed26e46；scripts/publish-typeset.ps1 发布入口调用 scripts/check-site-ui.py，本轮已实际执行新检查。"
    },
    {
     "id": "f-readback",
     "group": "g-upkeep",
     "name": "发布后回读",
     "what": "从公网读回网页和图片核对，对不上退回上一版",
     "how": "AI 发布后自动做",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-lean-publish",
     "group": "g-upkeep",
     "name": "省流量发布",
     "what": "只传、只核变了的文件，看大小和校验码，不整份下载",
     "how": "AI 发布时自动做",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-patrol",
     "group": "g-upkeep",
     "name": "驾驶舱定时巡检",
     "what": "每 15 分钟以 HTTP 检查驾驶舱页面、主接口和小对照文件；连续 10 分钟且多次失败发故障邮件，恢复再通知；本机慢或链路未确认时记未知",
     "how": "自动：Wly Cockpit Monitor；跟 AI 说停掉驾驶舱巡检，只停巡检提醒，网站和数据服务照常运行",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "PCConfig registries/task_purpose_catalog.json、registries/dashboard_sources.json、docs/runtime/cockpit-monitor.md；CockpitMonitor/latest.json 于 2026-10-12 19:08 回执 success"
    },
    {
     "id": "f-recover-first",
     "group": "g-upkeep",
     "name": "出问题先恢复",
     "what": "先退回能用的版本，根治在后台做，汇报分开写",
     "how": "AI 自己做",
     "status": "在用",
     "screen": "wly0829-cn-12",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-living",
     "group": "g-paint",
     "name": "每页的画会动",
     "what": "代码动效；连续几秒太卡，这一页自动退回静态",
     "how": "打开任意一页",
     "status": "在用",
     "screen": "wly0829-cn-13",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-bird",
     "group": "g-paint",
     "name": "贯穿全站的小鸟",
     "what": "每页都有一只；10 月 6 日夜里换上新动作配置、修好图集读取",
     "how": "打开任意一页",
     "status": "在用",
     "screen": "wly0829-cn-13",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-comic",
     "group": "g-paint",
     "name": "首页连环画",
     "what": "首页的一组画按顺序动起来",
     "how": "首页",
     "status": "在用",
     "screen": "wly0829-cn-13",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-portrait",
     "group": "g-paint",
     "name": "手机竖版",
     "what": "每屏都有手机版式；太难维护的复杂动效在手机上可以不显示",
     "how": "用手机打开",
     "status": "在用",
     "screen": "wly0829-cn-13",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-old-paint",
     "group": "g-retired",
     "name": "整屏全靠生图",
     "what": "字和画一起画进图里，改一个字要重画整张；10 月 3 日停",
     "how": "",
     "status": "已停用",
     "screen": "wly0829-cn-13",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    },
    {
     "id": "f-old-video",
     "group": "g-retired",
     "name": "开头短视频",
     "what": "Google Flow 做的 27 段，改用代码动效后留作退路",
     "how": "",
     "status": "已停用",
     "screen": "wly0829-cn-13",
     "source": "派活说明已核事实／现有页面原文；状态“待实施”的项上线并回读后改“在用”"
    }
   ],
   "numbers": [
    {
     "id": "n-minute",
     "text": "1 分钟",
     "meaning": "驾驶舱从电脑读一次状态",
     "as_of": "2026-10-01",
     "source": "sources/pages/cockpit/page.json cockpit-01 正文“数据每分钟从电脑读一次”",
     "screens": [
      "wly0829-cn-01"
     ]
    },
    {
     "id": "n-projects",
     "text": "35 个",
     "meaning": "全部项目页的项目总数，含本项目；加入前为 34 个（30 个在用、4 个冻结）",
     "as_of": "2026-10-07",
     "source": "config/final-project-order.json：target_project_count=35、projects 共35项；sources/pages 项目根页35份、模块页170份，合计205份项目及模块作者输入；北京时间2026-10-12 04:39:22核对，205不是项目身份数",
     "screens": [
      "wly0829-cn-01"
     ]
    },
    {
     "id": "n-pages",
     "text": "90 页",
     "meaning": "sources/pages 下 89 个其他页面目录、page.json 共 748 屏（10 月 11 日现读）；加本页后 90 页、762 屏。首页另算",
     "as_of": "2026-10-11",
     "source": "sources/pages/*/page.json 文件及 screens 计数：262份作者输入、2635屏，北京时间2026-10-12 04:39:22核对；含404和去向页，首页另算，不等于公网路由总数",
     "screens": [
      "wly0829-cn-01",
      "wly0829-cn-05"
     ]
    },
    {
     "id": "n-target",
     "text": "45 分钟（大批 3 小时）",
     "meaning": "小改、大批从定稿到上线核对完的目标，还没实测证明；10 月 4 日实测一批 12 页约 2 小时 40 分",
     "as_of": "2026-10-07",
     "source": "E:\\.agents\\docs\\owner-decisions.md「网站和基座都不追总行数，按“好维护”的结果管」；how-this-site n-update",
     "screens": [
      "wly0829-cn-01",
      "wly0829-cn-05",
      "wly0829-cn-07"
     ]
    },
    {
     "id": "n-commits",
     "text": "894 次",
     "meaning": "网站仓库 main 的提交数，从 8 月 7 日起",
     "as_of": "2026-10-11",
     "source": "git rev-list --count 19f5bab7b26ade821283db83ffd62f26bbd82437 = 1064；git ls-remote origin refs/heads/main 回读同一SHA，北京时间2026-10-12 04:35—04:36核对；全部可达提交含合并，累计数与近7天732次是不同口径",
     "screens": [
      "wly0829-cn-08"
     ]
    },
    {
     "id": "n-cost",
     "text": "22.43 元",
     "meaning": "10 月阿里云花费，几乎全是我们自己发布、检查时下载用掉的",
     "as_of": "2026-10-07",
     "source": "主持核实（派活说明“已查明的事实”）；owner-decisions「网站资源托管：阿里云余额用完后先省钱」",
     "screens": [
      "wly0829-cn-09",
      "wly0829-cn-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "驾驶舱的电脑状态、自动任务、备份和待验收清单，从电脑配置与恢复的只读接口读",
     "source": "cockpit page.json based_on：PCConfig dashboard-api-contract"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "拿来",
     "flow": "规则页显示当前生效的规则版本；AI 维护网站时守同一套规则",
     "source": "AGENTS.md /rules 一节"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "授权与状态页的解锁、无限制授权由电脑上的密码中心核验和计时，网页只发请求、显示结果",
     "source": "computer-access page.json"
    },
    {
     "id": "r-all",
     "with": "全部项目",
     "direction": "汇总",
     "flow": "每个项目一页；出错和等验收的项目汇总到驾驶舱“项目”一块",
     "source": "cockpit-08"
    }
   ],
   "highlights": [
    {
     "id": "h-one-board",
     "title": "一个看板，替我翻遍所有文件夹。",
     "screen": "wly0829-cn-10"
    },
    {
     "id": "h-rollback",
     "title": "发上去不对，就退回去。",
     "screen": "wly0829-cn-10"
    },
    {
     "id": "h-bill",
     "title": "22 元的账单，几乎全是自己花的。",
     "screen": "wly0829-cn-10"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L27",
     "screen": "wly0829-cn-01",
     "text": "约法 L27"
    },
    {
     "target": "/cockpit/",
     "screen": "wly0829-cn-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/how-this-site/",
     "screen": "wly0829-cn-01",
     "text": "这个网页是怎么做的"
    },
    {
     "target": "https://github.com/wlyaaaaa/wly0829.cn",
     "screen": "wly0829-cn-01",
     "text": "GitHub"
    },
    {
     "target": "/projects/wly0829-cn/#ai-brief",
     "screen": "wly0829-cn-01",
     "text": "复制 AI 续作说明"
    },
    {
     "target": "/cockpit/",
     "screen": "wly0829-cn-03",
     "text": "驾驶舱"
    },
    {
     "target": "/computer-access/",
     "screen": "wly0829-cn-03",
     "text": "授权与状态"
    },
    {
     "target": "/projects/",
     "screen": "wly0829-cn-03",
     "text": "全部项目"
    },
    {
     "target": "/rules/",
     "screen": "wly0829-cn-03",
     "text": "规则"
    },
    {
     "target": "/skills/",
     "screen": "wly0829-cn-03",
     "text": "技能"
    },
    {
     "target": "/how/",
     "screen": "wly0829-cn-03",
     "text": "怎么协作"
    },
    {
     "target": "/rescue/",
     "screen": "wly0829-cn-03",
     "text": "救急先看"
    },
    {
     "target": "/mcp/",
     "screen": "wly0829-cn-03",
     "text": "连接电脑"
    },
    {
     "target": "/how-this-site/",
     "screen": "wly0829-cn-03",
     "text": "这个网页是怎么做的"
    },
    {
     "target": "/cockpit/",
     "screen": "wly0829-cn-04",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/cockpit/#pending",
     "screen": "wly0829-cn-04",
     "text": "待验收清单"
    },
    {
     "target": "/computer-access/",
     "screen": "wly0829-cn-04",
     "text": "授权与状态"
    },
    {
     "target": "/rescue/",
     "screen": "wly0829-cn-06",
     "text": "救急先看"
    },
    {
     "target": "/mcp/",
     "screen": "wly0829-cn-06",
     "text": "连接电脑"
    },
    {
     "target": "/rules/charter/#L27",
     "screen": "wly0829-cn-07",
     "text": "约法 L27"
    },
    {
     "target": "/how-this-site/",
     "screen": "wly0829-cn-07",
     "text": "这个网页是怎么做的"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "本人北京时间 10 月 7 日 17:40：“这个网页本身就是一个项目，网页项目去哪了？……需要加一个网页项目；内容让opus写；……网页项目本身承担用户唯一看板”。据此新建本页，取代 9 月 29 日 04:0x“这个网站不适合放在项目网格里”和 remote-control 页 notes 里“本人定个人网站不写项目页”的旧安排。",
    "本页只讲“它对我是什么、怎么用、AI 怎么维护、现在的状态”；网站怎么做出来的（分工、生图、排版转折、数字口径）留在〔这个网页是怎么做的〕，本页只一句话指过去，不重复介绍。",
    "首页清晨、白天、傍晚、晚上四个时段选项保留，写进第 4 屏和 f-home-time；“一分钟循环一天”按本人 10 月 11 日 02:56 原话（“首页不要一分钟那个按钮”）去掉。",
    "本轮按现有真实回执拆分余额通知/驾驶舱金额、资源预警后端/趋势观察/驾驶舱显示，以及60秒自动读取/常驻手动刷新按钮；保留各项未完成边界。"
   ],
   "dropped": [
    "不写内部发布代号、提交号、存储桶名、接口地址；这些留在 based_on 和 numbers 的 source 里。",
    "驾驶舱各块的细节（颜色门槛、备份周期）不在本页重写，家在驾驶舱页。"
   ],
   "unsure": [
    "f-unlock-jump“从别处点‘解锁’直接落在办理那块、不弹回”是我对“解锁跳转不回弹”的理解；如实际行为不同，按实现改这一句。",
    "第 10 屏“10 月 2 日上午连发四次新版，前三次都退回”按网站仓库 10 月 2 日 09:34—11:34 的四次 Publish 和三次 Restore 提交写；退回是自动触发还是人工触发提交里看不出，所以正文只写“退回”。",
    "【语气核对已完成】第 1 屏介绍、第 2 屏“为什么只要一个看板”和第 10 屏总看板说明已改为中性描述，保留本人不逐项翻查电脑文件夹、把待验收事项与预警集中放入网页驾驶舱、由本人判断是否动手的原意。依据：本人 10 月 7 日 07:04 的相关原话。",
    "第 6 屏“该次充值后 7:14 恢复”依据 owner-decisions 10 月 7 日 07:11–07:29 的记录，保留该次事件的历史恢复时间。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/wly0829-cn/page.json",
  "sha256": "611b8b7ab2603a76bfdab6024e18639ced8e9e06737270d59a60642dfd9984f6",
  "converted_at_beijing": "2026-10-12T19:17:04+08:00"
 }
}
---

::screen{#wly0829-cn-01 section="top"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“个人网站（总看板）”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：书桌上一台显示器，屏幕里是一盏绿色圆灯和几条横向小色块（像驾驶舱，不画字），显示器旁一部手机屏幕上是同样缩小的画面；窗外一只小鸟停在窗台上（和全站那只鸟同一个样子）。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一只带秒针的小钟、一叠项目卡片、一台电脑和一部手机并排、一个沙漏。数字卡下面一行放四个白底细绿边的圆角按钮：〔查看驾驶舱〕〔这个网页是怎么做的〕〔GitHub〕（左边画 GitHub 的小猫标志）〔复制 AI 续作说明〕。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、四个按钮两行两个。",
  "links": [
   {
    "text": "约法 L27",
    "href": "/rules/charter/#L27"
   },
   {
    "text": "查看驾驶舱",
    "href": "/cockpit/"
   },
   {
    "text": "这个网页是怎么做的",
    "href": "/how-this-site/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/wly0829.cn"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/wly0829-cn/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "开头"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "个人网站（总看板）",
     "align": "left",
     "size": "large",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 10 月 12 日 04:12",
       "state": "ok"
      },
      {
       "text": "近 7 天提交 732 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 12 日 · 网站仓库主线修改记录（主线 19f5bab7，近 7 天按 10 月 12 日 04:36 向前 7 天计）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "stat_card",
     "text_ref": "1 分钟",
     "columns": 4,
     "columns_v": 2,
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/icons/文稿堆.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/沙漏.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "唯一总看板：有没有事、是否需要本人处理，一眼看清。",
     "align": "left",
     "row": "hero",
     "width": "56fr",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "asset": "wly0829-cn/wly0829-cn-12-overview-illustration-v1.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "row": "hero",
     "width": "42fr",
     "target_height": 390
    },
    {
     "type": "action_button",
     "text_ref": "查看驾驶舱",
     "columns": 4,
     "columns_v": 2,
     "brand_icons": {
      "GitHub": "wly0829-cn/github-mark-official.svg"
     }
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "个人网站（总看板）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 10 月 12 日 04:12",
       "state": "ok"
      },
      {
       "text": "近 7 天提交 732 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 12 日 · 网站仓库主线修改记录（主线 19f5bab7，近 7 天按 10 月 12 日 04:36 向前 7 天计）"
    },
    {
     "type": "stat_card",
     "text_ref": "1 分钟",
     "columns": 4,
     "columns_v": 2,
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/icons/文稿堆.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/沙漏.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "唯一总看板：有没有事、是否需要本人处理，一眼看清。",
     "align": "left"
    },
    {
     "type": "illustration",
     "asset": "wly0829-cn/wly0829-cn-12-overview-illustration-v1.png",
     "illustration": "outside",
     "align": "center",
     "size": "medium",
     "target_height": 470
    },
    {
     "type": "action_button",
     "text_ref": "查看驾驶舱",
     "columns": 2,
     "columns_v": 2,
     "brand_icons": {
      "GitHub": "wly0829-cn/github-mark-official.svg"
     }
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-12-overview-illustration-v1.png",
   "semantic_status": "scene_explicit_primary_object",
   "key": "wly0829-cn-dashboard-overview",
   "source_phrase": "横版画面：左上大标题毛笔艺术字“个人网站（总看板）”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：书桌上一台显示器，屏幕里是一盏绿色圆灯和几条横向小色块（像驾驶舱，不画字），显示器旁一部手机屏幕上是同样缩小的画面；窗外一只小鸟停在窗台上（和全站那只鸟同一个样子）。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一只带秒针的小钟、一叠项目卡片、一台电脑和一部手机并排、一个沙漏。数字卡下面一行放四个白底细绿边的圆角按钮：〔现在正不正常 → 驾驶舱〕〔这个网页是怎么做的〕〔GitHub〕（左边画 GitHub 的小猫标志）〔复制 AI 续作说明〕。",
   "sha256": "c73f9555f3ef96ffa5710468a2742056575876e84b55d8f540c073c10053782c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "wly0829-cn/wly0829-cn-01-title-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-01-title-1",
   "title_text": "个人网站（总看板）",
   "sha256": "914da6ad04ab4adba9ed7c4d95046019680808df69021022bc68648a3ea8479d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 个人网站（总看板）

**唯一总看板：有没有事、是否需要本人处理，一眼看清。**

本站 wly0829.cn 是本人的唯一总看板。电脑和各项目的状态、待验收事项、预警和超期备份都集中到网页驾驶舱。本人无需逐个翻查电脑里的文件夹、日志和回执；打开驾驶舱先看有没有事，有问题再点开条目，看清问题是什么、是否需要本人动手处理。

本站已在用。整页逐项核实仍以北京时间2026-10-09 05:49为准；之后驾驶舱新版已于 10 月 12 日上线并在公网读回通过，但本人还没验收。电脑资源预警的数据已送到驾驶舱的实时入口，最近一次分项回读为 10 月 7 日 18:14，趋势仍在观察期；驾驶舱里的余额和花费还没验收，其他进行中的功能在后文单列。

网站公开，任何人都能访问；本站首先服务于本人的日常查看，不是演示品（〔约法 L27〕）。

**1.0 分钟**｜驾驶舱开着时从电脑读一次状态，时间都按北京时间
**35 个**｜项目，连它自己在内，每个项目一页，另有分模块说明
**262 页**｜每屏都排电脑和手机两种版式
**90 分钟**｜日常更新从提出到公网核对完的目标；只改数字 60 分钟，全部更新 4 小时

〔查看驾驶舱〕　〔这个网页是怎么做的〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#wly0829-cn-02 section="usage"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-02",
  "section": "usage",
  "title": "它替我看三件事",
  "scene": "横版画面：左上标题。三张竖向大卡片横排，每张顶上一幅小水彩：1 一盏绿色圆灯旁边一盏小黄灯；2 一只手和一张写着对勾的小卡片；3 一台电脑和几张小项目卡片围成一圈。卡片下面一条横跨整屏的浅绿细卡片，写“为什么只要一个看板”那段。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "怎么用"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它替我看三件事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "有没有事",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/报警灯.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/手机电脑连接.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "为什么只要一个看板",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "none"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它替我看三件事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "有没有事",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/报警灯.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/手机电脑连接.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "为什么只要一个看板",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "none"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-02-three-things-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-02-title-1",
   "title_text": "它替我看三件事",
   "sha256": "dd5f266daba3d6b0ade3a35df277853a80b73961a463a9b4b65085145dfb661c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 它替我看三件事

**有没有事**｜驾驶舱最上面分开写三件事：要我做的事、电脑健康不健康、AI 手上待核对的事，并写明数据是几点读的。电脑资源变色不等于要我动手；AI 待核对的事也分清已经开始处理的和还没确认开始的。下面“要我处理的事”只列真要我管的，每条标题直接说出是什么问题。

**要不要我做什么**｜等我验收的、等我拍板的、要我亲手办的，都排在驾驶舱里，每条附办理入口和步骤。AI 自己能修的先修，不来烦我。

**电脑和各项目好不好**｜电脑的温度、磁盘、网络，自动任务，备份和云端，资料锁和授权，出错或等验收的项目，各占一块。读不到的写“读不到”和最近一次读到的时间，不装作正常。

**为什么只要一个看板**
过去，想知道一件事要去相应文件夹里找回执或日志；AI 把结果写在哪里，本人就得去哪里找。从 10 月 7 日起，长期需要知道的事项统一由 AI 送到网页驾驶舱，例如待验收事项、预警和超期备份。本人只需看驾驶舱这一处，再根据条目内容判断是否需要本人处理。因此驾驶舱按最高档要求维护；出错时，优先修好驾驶舱。

::screen{#wly0829-cn-03 section="usage"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-03",
  "section": "usage",
  "title": "每一页管什么",
  "scene": "横版画面：左上标题。一张三列表格占满宽度（表头浅绿底），每行左边一个小水彩图标（房子、仪表盘、锁、一叠卡片、书、工具箱、两只握着的手、急救箱、插头、画笔）。表格下面一行小字结语。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [
   {
    "text": "驾驶舱",
    "href": "/cockpit/"
   },
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   },
   {
    "text": "全部项目",
    "href": "/projects/"
   },
   {
    "text": "规则",
    "href": "/rules/"
   },
   {
    "text": "技能",
    "href": "/skills/"
   },
   {
    "text": "怎么协作",
    "href": "/how/"
   },
   {
    "text": "救急先看",
    "href": "/rescue/"
   },
   {
    "text": "连接电脑",
    "href": "/mcp/"
   },
   {
    "text": "这个网页是怎么做的",
    "href": "/how-this-site/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "怎么用"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "每一页管什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "页面 | 管什么 | 我什么时候去",
     "width": "100%",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/icons/报警灯.png",
      "_library/icons/上锁仓库箱.png",
      "_library/icons/文稿堆.png",
      "_library/icons/书签册.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/illustrations/双人传稿.png",
      "_library/illustrations/电脑故障.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/画笔调色板.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "驾驶舱只显示",
     "align": "left"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "每一页管什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "页面 | 管什么 | 我什么时候去",
     "width": "100%",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/icons/报警灯.png",
      "_library/icons/上锁仓库箱.png",
      "_library/icons/文稿堆.png",
      "_library/icons/书签册.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/illustrations/双人传稿.png",
      "_library/illustrations/电脑故障.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/画笔调色板.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "驾驶舱只显示",
     "align": "left"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-03-page-roles-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-03-title-1",
   "title_text": "每一页管什么",
   "sha256": "04b5a22c6a3869a882f97e6b8c691b546b7afaeaf3267956b3fc6f660bbe3707",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 每一页管什么

| 页面 | 管什么 | 我什么时候去 |
|---|---|---|
| 首页 | 我是谁、这套东西办过什么事、从哪进去；画里电脑的屏幕点一下即可进入驾驶舱 | 平时打开网站就是它 |
| 驾驶舱 | 电脑和各项目现在好不好、要我处理什么、今天发生了什么 | 想知道有没有事 |
| 授权与状态 | 看个人资料锁、全局无限制授权和 Windows 锁屏，也在这里解锁、开启、延长、锁定 | AI 说要用我的资料，或我想放手让 AI 干一段 |
| 全部项目 | 每个项目给 AI 补了什么本事，按本事分组；点进去看怎么用、怎么搭 | 想知道一件事能交给谁办 |
| 规则 | 我审定的 30 条约法和 10 个专题，始终是当前生效的那一版 | 想知道 AI 为什么这么做、能不能这么做 |
| 技能 | AI 碰到某类事照着办的说明书 | 想知道该怎么跟 AI 说 |
| 怎么协作 | 我、Claude、GPT 和各个项目怎么接力，能点着看 | 想看整套东西怎么转 |
| 救急先看 | 电脑卡死、远程连不上、代理坏了，先照着做的几步 | 出事了 |
| 连接电脑 | 自己远程看桌面，或让 AI 用这台电脑 | 人不在电脑前 |
| 这个网页是怎么做的 | 网站的字、图和动效怎么由 AI 做出来 | 好奇它怎么来的 |

驾驶舱只显示、不动手：要停任务、锁资料，去对应的页面办，或跟 AI 说一声。

::screen{#wly0829-cn-04 section="usage"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-04",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版画面：左上标题。一条从左到右的水彩绿色丝带，六个编号小旗，每个小旗下面一个小水彩图标（窗外的晨光、绿灯、一张带感叹号的小卡片、一把钥匙、一个对话气泡、一部手机）和两三行小字。",
  "portrait": "竖版：标题；丝带改成竖向，六个小旗从上到下，每个小旗旁边是它的那段字。",
  "links": [
   {
    "text": "查看驾驶舱",
    "href": "/cockpit/"
   },
   {
    "text": "待验收清单",
    "href": "/cockpit/#pending"
   },
   {
    "text": "授权与状态",
    "href": "/computer-access/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "怎么用"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "打开首页",
     "layout": "chain",
     "split_arrows": true,
     "columns": 6,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": [
      "_library/icons/太阳工具.png",
      "_library/icons/报警灯.png",
      "_library/icons/铃铛.png",
      "_library/icons/钥匙.png",
      "_library/icons/双气泡.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "topology",
     "text_ref": "打开首页",
     "layout": "chain",
     "split_arrows": true,
     "columns": 6,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": [
      "_library/icons/太阳工具.png",
      "_library/icons/报警灯.png",
      "_library/icons/铃铛.png",
      "_library/icons/钥匙.png",
      "_library/icons/双气泡.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "personal-health/personal-health-02-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-04-title-1",
   "title_text": "平时怎么用",
   "sha256": "60c9e97a88acfcedd74e9fb83b6da164baa88d0d5f92d3774c43ec4726bce7e9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 平时怎么用

1. **打开首页**｜首页那幅画跟着时段换成清晨、白天、傍晚、晚上，也可以点画上的时段标签自己换。点画里电脑的屏幕即可进入驾驶舱，也可以点〔查看驾驶舱〕。
2. **看最上面的结论**｜先看有没有要我做的事；电脑健康和 AI 待核对的事分开写，电脑资源变色不等于要我动手。驾驶舱开着时每分钟自动读一次最新状态；顶上一直有刷新条，点一下原地重读，读不到会写明最近一次读到的时间。这套新版 10 月 12 日已上线，本人还没验收。
3. **有要我做的事，看“要我处理的事”**｜每条标题直接说出是什么问题，点开看是哪个项目、从什么时候开始、该谁动手，以及去哪办、分几步。
4. **要我动手的，照那一条办**｜要验收的去〔待验收清单〕；要用我的资料或开授权的，去〔授权与状态〕：验证一次，开一段时间。
5. **想改网站，跟 AI 说一句**｜比如“驾驶舱这块看不懂”“更新网站”；日常更新的目标是 90 分钟内在公网核对完，只改数字的 60 分钟。
6. **手机上也一样**｜每一屏都有手机版式；手机上太难维护的复杂动效可以不显示，内容不少。

::screen{#wly0829-cn-05 section="usage"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-05",
  "section": "usage",
  "title": "现在做到哪了",
  "scene": "横版画面：左上标题。三张横向卡片从上到下：第一张浅绿底“已经在用”（左边一个绿色对勾），第二张白底细绿边“正在接入或待验”（左边一个空心绿圈），第三张浅灰底“还没做到”（左边一个小沙漏）。右下角一行小字写截至时间。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "怎么用"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "现在做到哪了",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "已经在用",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/盾牌对勾.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "正在接入或待验",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/齿轮.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "还没做到",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/沙漏.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "现在做到哪了",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "已经在用",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/盾牌对勾.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "正在接入或待验",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/齿轮.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "还没做到",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/沙漏.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-04-current-progress-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-05-title-1",
   "title_text": "现在做到哪了",
   "sha256": "86596697b5aeba09f9831a5e96cc608135302c738c0549c6eb00412496e80d28",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 现在做到哪了

**已经在用**
首页、驾驶舱、授权与状态、全部项目及其模块说明、规则、技能等页面和旧网址去向页，全站公开网址共310个（不含 404 页；北京时间 10 月 12 日 04:23 按最新发布清单数，规模和 10 月 11 日相同）；每页的画会动，一只小鸟贯穿全站，首页有连环画，驾驶舱有“今天的河”。驾驶舱的告警标题直接说出问题。网页放在 GitHub Pages，图片放在阿里云上海；发布只传、只核变了的文件。驾驶舱的实时数据经单独的实时入口送达，这个入口的程序改动推送后会自动上线，AI 更新它不用本人再登录（10 月 12 日起）。首页画里的电脑屏幕可点击进入驾驶舱。发布前扫描已接进发布入口：现行做法是只扫这次改过的页，查大块空白、压叠、裁字、空图框、404 和点不动，过不了不发；10 月初按 305 个网址登记的旧问题清单只是历史基线。每分钟自动读取已在用；阿里云低于10元的短信、邮件提醒已开启。电脑资源预警后端已部署，数据已送到实时入口，趋势需要至少25小时的积累，目前仍在观察期。技能页里，Word 文档和 PDF 读写与表单两页 10 月 12 日换成新版，技能总览也加了对应的卡；真实做文档、填表格还说不准。

驾驶舱巡检：每 15 分钟一次，连续 10 分钟打不开就发 Gmail，恢复后再发一封；已在用，巡检已发出过故障提醒与恢复提醒。

**正在接入或待验**
驾驶舱新版已上线（10 月 12 日 04:23 公网读回通过）：顶上常驻刷新条，读不到的说明和最近读数时间，要我做的事附办理入口和步骤，任务分组，手机排版修好；本人还没验收，交互也还没逐项点过。“授权与状态”不回弹：办理区重排 10 月 10 日已合入源码，线上和验收还没核实；代理流量套餐等其余部分仍在接入。新生成链（npm run build → 只扫改过的页 → 发布器传送）已是仓库里唯一的生成与发布入口，北京时间 10 月 11 日 14:05 已用它完成第一次正式发布（GitHub Pages 部署成功，公网成品清单回读一致）；10 月 12 日起没变的部分可以直接复用、只重建受影响的页，扫描也改得更快更稳。

**还没做到**
“日常更新 90 分钟（只改数字 60 分钟）、全部更新或新增项目 4 小时”：10 月 7 日用旧做法实测三次，连当时“小改 45 分钟”的旧目标都没达到；10 月 11 日 23:47 开始的第一次完整实测，到 10 月 12 日 00:59 公网核对通过，共 71 分 56 秒，但其中一步超时，构建和扫描也超出各自的时限，整体验收没过。之后已合入构建和扫描提速，还要再完整测一次。阿里云余额和本月花费在驾驶舱的显示还没验收。短信、邮件提醒的实际触发和送达尚未验证；资源趋势提示也不能保证发现所有驱动或DPC突发卡顿。

整页逐项验收仍截至北京时间2026-10-09 05:49；驾驶舱新版、生成发布链、实时入口和技能页按 10 月 12 日 04:23—04:37 的发布回读和源码核对；电脑资源预警采用 10 月 7 日 18:14 的分项回读，详细依据见“技术与依据”。

::screen{#wly0829-cn-06 section="usage"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-06",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。一张三列的表格占上面约四分之三（表头浅绿底，每行左边一个小水彩图标：问号、空白的屏幕、断了的图片、回转箭头、灰色的灯）。表格下面一张浅绿底小卡片写“恢复和根治分开说”。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [
   {
    "text": "救急先看",
    "href": "/rescue/"
   },
   {
    "text": "连接电脑",
    "href": "/mcp/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "怎么用"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "看到什么 | AI 自己会做 | 还不行，我怎么办",
     "width": "100%",
     "icons": [
      "_library/icons/气泡灯泡.png",
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/icons/断链.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/报警灯.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "恢复和根治分开说",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "none"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "看到什么 | AI 自己会做 | 还不行，我怎么办",
     "width": "100%",
     "icons": [
      "_library/icons/气泡灯泡.png",
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
      "_library/icons/断链.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/报警灯.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "恢复和根治分开说",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "none"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-06-title-1",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 出事怎么办

| 看到什么 | AI 自己会做 | 还不行，我怎么办 |
|---|---|---|
| 驾驶舱某一项写“读不到” | 不当成 0，不留旧绿灯；旁边写上次读到的值和时间 | 跟 AI 说“驾驶舱某某读不到” |
| 驾驶舱打不开、一片空白 | 巡检每 15 分钟看一次，连续 10 分钟打不开就发 Gmail 告诉我，恢复后再发一封；AI 修时先退回上一个能用的版本，再查原因 | 说“驾驶舱坏了”：它排在网站其他小问题前面修。资料锁着、我登出 Windows、整台电脑断电断网时，提醒信发不出 |
| 整个网站的图片和样式都没了 | 先查是哪一环断了，能退回就退回 | 要花钱的事由我定：10 月 7 日早上阿里云余额用完、图片全挂，该次充值后 7:14 恢复 |
| 新版本上线后检查没过 | 退回线上原来那版，线上始终是一版能用的 | 不用管 |
| 总灯是灰的 | 电脑不在线，别的项不乱报 | 看〔救急先看〕或〔连接电脑〕 |

**恢复和根治分开说**　出问题先在几分钟内让网站能用，根治在后台另做。AI 的汇报里分两行写：“已恢复能用”和“根治进度”，不拿恢复冒充修好。

::screen{#wly0829-cn-07 section="tech"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-07",
  "section": "tech",
  "title": "AI 怎么维护它",
  "scene": "横版画面：左上标题。五张横向小卡片两列排（最后一张占半幅居中），每张左边一个小水彩图标（一支笔改一个字、一个筛子、一只放大镜对着地球、一只闹钟、一个回转箭头），右边粗体一句加两三行小字。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [
   {
    "text": "约法 L27",
    "href": "/rules/charter/#L27"
   },
   {
    "text": "这个网页是怎么做的",
    "href": "/how-this-site/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "技术"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "AI 怎么维护它",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "按需更新",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/late-r3-workflow-split-merge.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/放大镜.png",
      "_library/icons/scene-r3-cloud-two-directions.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "细节和数字见",
     "align": "left"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "AI 怎么维护它",
     "align": "center",
     "size": "large"
    },
    {
     "type": "content_card",
     "text_ref": "按需更新",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/late-r3-workflow-split-merge.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/放大镜.png",
      "_library/icons/scene-r3-cloud-two-directions.png",
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "细节和数字见",
     "align": "left"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/late-r3-workflow-split-merge.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "wly0829-cn-07-rh2-2",
   "source_phrase": "取数和写稿分开",
   "sha256": "30483314566e957abb9e4c5f629bceb6629624067aa79d63b81783c2b683896e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-cloud-two-directions.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "wly0829-cn-07-rh2-5",
   "source_phrase": "实时入口另走一条线",
   "sha256": "008a140f3153a727ff401191849fe05dca0b9e36cb8e9697238f36d3342532b6",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "wly0829-cn/wly0829-cn-05-ai-maintenance-full-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-07-title-1",
   "title_text": "AI 怎么维护它",
   "sha256": "9514728635c15c8a58694a7cca1fe7b77005e086c5137f8172c10ef7f301c663",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## AI 怎么维护它

**按需更新**｜我说“更新网站”，AI 才改；不定时自动改内容（〔约法 L27〕）。只重出受影响的屏，别的一个字不动。目标：日常更新（涉及不超过 5 个项目、10 张冻结页，没有新项目或新技能页）从提出到公网核对完不超过 90 分钟，只改数字的 60 分钟；全部更新或新增项目不超过 4 小时。10 月 11—12 日第一次完整实测 71 分 56 秒公网核对通过，但分步时限没全达到，还不算达标；每次实测记在〔这个网页是怎么做的〕。

**取数和写稿分开**｜GPT 按来源清单取实时数据、快照和 Git 记录，同口径的数字由程序直接替换；用途、能力、边界或状态变了，才交 Opus 改写对应的屏。改写稿先整批校验再合入：只动指定的屏，没指定的不动，重复合入不会多出第二份改动，有一屏不合格就整批停下、不写页面。合入后仍要盘点，新页、新数字当轮补上来源绑定。

**发布前自动检查**｜现行顺序是三步：用唯一入口 npm run build 生成整站（没变的转换输入、成品资源和公开检查直接复用，可以只重建受影响的页） → 扫描（scan_glance）只扫这次改过的页 → 发布器（publish_site）传送。扫描按 1920×1080 和 3840×2160 两种分辨率，等字体、图片和网络都稳定、整页已开始加载的图片都到齐后整页看，查六类一眼能看出的错：大块空白、文字压叠、文字被裁、空图框、404 和断链、点不动的按钮。有一项不过，或要发的成品和扫描时字节对不上，发布器拒绝发布。首页已验收锁定，不参加扫描；动效和打开过程由我自己看，AI 不判断。逐屏原文对照、阅读位置、几何量测这些独立检查还保留，按具体任务单独跑，没有接回发布门。

10 月初的旧扫描曾按线上 305 个网址、手机（390 宽）和电脑（1440 宽）登记过 227 条旧问题（75 条确认、152 条量不了）作基线、只拦新增；那是当时的历史数字，不是今天还剩的缺陷数，现行门也不再按那张清单放行。扫描只看改过的页，所以这道门不等于全站没有错。程序过了，Claude 还要看电脑和手机两种宽度的整页。

**发布后回读**｜源码改动本身不会上线：发布器先传变了的图片等资源，再把成品推到单独的成品分支、触发部署，等这次部署真正成功后才回读。新传的资源只问大小和校验码，不下载；首页、驾驶舱、连接电脑页和这次变了的网页从公网整页读回，核状态和校验码。网络连接断了最多重试 3 次；内容对不上或服务器报错不重试，直接记失败，不写成功记录。发布器不会自己退回旧版：失败时回执写清卡在哪一步；要退回，就手动让同一部署流程重新部署上一个成品版本（不重建源码），再核公网清单和关键页。发布从不删线上旧图片，所以退回时旧资源都还在。

**实时入口另走一条线**｜驾驶舱的实时数据经腾讯云 EdgeOne 上的转发函数送达。函数改动推送到主线后自动部署，同样的函数不重复部署，需要时可以显式重发；AI 更新它不用本人再登录。发布器只管网页和图片，不替它发函数；工作流显示成功也不等于平台和公网都成功，失败会停在失败回执。停掉自动部署只是不再上线新版，已有的实时服务照常。

**驾驶舱巡检**｜每 15 分钟从电脑上看一次线上驾驶舱页面和实时数据接口：页面是不是完整的驾驶舱、数据新不新鲜。连续 10 分钟打不开，发 Gmail 告诉我，恢复后再发一封；电脑自己断网时只记“不确定”，不当成网站坏了。巡检只看不改。限制：资料锁着时信发不出，我登出 Windows 时不跑，整台电脑断电断网时也发不出。巡检已发出过故障提醒与恢复提醒。

**出问题先恢复**｜先退回上一个能用的版本，几分钟内让网站能用；根治在后台做。

细节和数字见〔这个网页是怎么做的〕。

::screen{#wly0829-cn-08 section="tech"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-08",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。一条从左到右的流程图，六个节点各一张圆角小卡片带小水彩图标（稿纸、排版尺、相机、两朵云、一条细细的数据线连着电脑、一只小鸟），绿色箭头相连；节点下一两行小字。流程下面一行三张小数字卡。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "技术"
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
     "text_ref": "定稿文字",
     "layout": "chain",
     "split_arrows": true,
     "columns": 6,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/尺子.png",
      "_library/icons/画笔调色板.png",
      "_library/icons/云.png",
      "_library/hires-icons/数据库.png",
      "_library/hires-icons/代码窗口.png"
     ]
    },
    {
     "type": "stat_card",
     "text_ref": "8 月 7 日",
     "columns": 3,
     "columns_v": 1,
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/云.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "“现在”框里的状态从",
     "align": "left"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
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
     "text_ref": "定稿文字",
     "layout": "chain",
     "split_arrows": true,
     "columns": 6,
     "columns_v": 1,
     "connector": "none",
     "illustration": "above_card",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/尺子.png",
      "_library/icons/画笔调色板.png",
      "_library/icons/云.png",
      "_library/hires-icons/数据库.png",
      "_library/hires-icons/代码窗口.png"
     ]
    },
    {
     "type": "stat_card",
     "text_ref": "8 月 7 日",
     "columns": 3,
     "columns_v": 2,
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/云.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "“现在”框里的状态从",
     "align": "left"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-08-title-1",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 它是怎么搭的

1. **定稿文字**｜每页一份定稿，正文、数字、按钮和链接都在里面。
2. **程序排版**｜按定稿逐字排成电脑和手机两种版式；水彩插画和毛笔标题由 AI 画。
3. **出成网页**｜文字是真文字，不再整屏截成图片：同一套区块库在浏览器里按构图排，能选、能搜、读屏能读；改一个字只动那段文字，不用重画整张图。一条唯一的构建入口（npm run build）依次把每页定稿转成内容文件、只重排改过的区块（没变的直接复用上次结果）、交 Astro 输出整站，最后统一处理资源地址并做公开内容检查；没变的转换输入、成品资源和公开检查也能复用，可以只重建受影响的页。首页、驾驶舱、授权页直接用已验收的保留源码；还没迁移的旧页沿用已有成品，普通构建不重新生成它们。
4. **放上网**｜图片和视频放阿里云上海的存储，国内打开快；网页本身放 GitHub Pages。
5. **实时数据**｜驾驶舱、授权与状态、项目页里的“现在”框，打开时从电脑的只读接口现读，经腾讯云 EdgeOne 上的转发函数送达；函数改动推送后自动上线，不用本人再登录。解锁、授权这类办理，验证码直接交给电脑核对，不经过网站的服务器。
6. **会动的部分**｜首页和各页的画、小鸟、驾驶舱“今天的河”都是代码动效；连续几秒太卡，这一页自动退回静态。

**8 月 7 日**｜开始，先放了一张占位页
**1064 次**｜提交（到 10 月 12 日）
**2 处托管**｜网页放 GitHub Pages，图片放阿里云上海

“现在”框里的状态从电脑上的只读接口现读，读不到就换备用入口。电脑资源预警只认最近 3 分钟内的数据，趋势要攒满一天多才下判断；10 月 7 日 18:14 回读时资源正常，趋势还在观察期。现在实时入口已带上这份数据，驾驶舱里的显示本人还没验收，一闪而过的卡顿也不一定抓得到。

每次发布前先扫这次改过的页：等页面稳定、已开始加载的图片都到齐后整页看，查大块空白、文字压叠、文字被裁、空图框、404 和断链、点不动的按钮；有一项不过，或要发的成品和扫描时不是同一份字节，发布器就不发。首页已验收锁定、不参加扫描，动效由我自己看。没改的页这次不重扫，所以扫过不等于全站没有错。

**两项已登记的自动运行归属**｜驾驶舱巡检 `Wly Cockpit Monitor` 与 `github:wlyaaaaa/wly0829.cn/pages.yml` 都属于个人网站（总看板），PCConfig 提供任务登记与回执。巡检每 15 分钟用 HTTP 读取驾驶舱页面、主接口和小对照文件；连续 10 分钟且多次失败才发故障邮件，恢复再通知，本机慢或链路未确认时记为未知。跟 AI 说停掉驾驶舱巡检，只会停止巡检提醒，网站和数据服务照常运行。`pages.yml` 由人工发起，部署已经构建并扫描通过的 `site-dist` 成品；源码推送本身不会触发这份工作流。停用它会阻断这条 Pages 部署入口，线上旧版继续保留。GitHub 工作流运行记录尚未接入驾驶舱，最新运行状态为 Unknown。

::screen{#wly0829-cn-09 section="tech"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-09",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。六张横向小卡片两列三行，每张左边一个小水彩图标（一扇只开一处的窗、一只先被扶起来的花盆、一盏不亮的灯旁写着问号、一幅清晰的画框、一支笔和一支画笔并排、一个只看不碰的眼睛），右边粗体一句加一两行小字。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "技术"
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
     "type": "content_card",
     "text_ref": "只看一处",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/illustrations/项目桌面盆栽.png",
      "_library/icons/气泡灯泡.png",
      "_library/icons/相机.png",
      "_library/icons/画笔调色板.png",
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
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
     "type": "content_card",
     "text_ref": "只看一处",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/illustrations/项目桌面盆栽.png",
      "_library/icons/气泡灯泡.png",
      "_library/icons/相机.png",
      "_library/icons/画笔调色板.png",
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "_library/round3/titles/title-r3-9ce99a7f5a6a4d1b80fa.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-09-title-1",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 为什么这样设计

**只看一处**｜我不翻文件夹。AI 要我知道的，必须送到驾驶舱；只写在本机某个文件里，等于没告诉我。

**驾驶舱最先修**｜它坏了，我就什么都看不见。它的问题排在网站其他小问题前面，还有每 15 分钟一次的巡检盯着，打不开就发 Gmail 告诉我。

**读不到就说读不到**｜不当成 0，不留旧绿灯，也不让呼吸点装作一切正常。

**画质不让步**｜不为加载快压图片清晰度。要省钱，就从我们自己身上省：10 月阿里云花的 22.43 元，几乎全是我们发布、检查时自己下载用掉的，所以改成只传、只核变了的文件。

**字归程序，画归 AI**｜字是程序按定稿排的，改一个字不用重画整张画。

**只显示，不代办**｜驾驶舱只告诉我怎么了；停任务、锁资料这类动作，去对应的页面办，或者跟 AI 说。

::screen{#wly0829-cn-10 section="highlights"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-10",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：和标杆页“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。插画：1 许多文件夹收拢成一扇亮着的窗；2 一根往回拐的绿色箭头，箭头尾巴上一个小对勾；3 一张小小的账单纸，旁边一只往回收的水龙头。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "亮点"
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
     "text_ref": "唯一总看板：待验收事项和预警集中查看。",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/illustrations/账本.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
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
     "text_ref": "唯一总看板：待验收事项和预警集中查看。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件夹.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/illustrations/账本.png"
     ]
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-10-title-1",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 亮点

**唯一总看板：待验收事项和预警集中查看。**
10 月 7 日早上确定的使用方式是：本人不逐个查看电脑里的文件夹、日志和回执；待验收等长期事项、预警和超期备份统一进入网页驾驶舱。需要本人处理的条目也集中显示。AI 不再只把结果留在某个电脑文件里或告知文件位置，驾驶舱让本人判断是否需要动手。

**发上去不对，就退回去。**
10 月 2 日上午连发四次新版，前三次都退回了线上原来那版，第四次才留下。10 月 6 日晚上，小鸟的配置在线上读不到，19:50 先退回上一版，修好后 22:46 再上线。线上始终是一版能用的。

**22 元的账单，几乎全是自己花的。**
10 月 7 日早上阿里云余额用完，网站的图片和样式全挂了。查下来，10 月花的 22.43 元几乎全是我们自己发布、检查时整份下载用掉的，访客用得很少。现在发布只传、只核变了的文件，画质一点没降。

::screen{#wly0829-cn-11 section="features"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-11",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法：每组先一行毛笔字组名（组名在卡片网格上方单独一行），下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉），状态文字不画出来，只画圆点。这一张顶上有标题和图例。放“首页和驾驶舱”1 组。",
  "portrait": "竖版：组名一行，卡片一行一张（左图标、中间编号功能名和一句话、右上圆点）；第一张顶上标题和图例。",
  "links": [],
  "anchors": [
   {
    "id": "g-front",
    "text": "首页和驾驶舱"
   },
   {
    "id": "f-home",
    "text": "首页总入口"
   },
   {
    "id": "f-home-time",
    "text": "首页的画跟着时段换"
   },
   {
    "id": "f-home-screen",
    "text": "画里的电脑屏幕进驾驶舱"
   },
   {
    "id": "f-light",
    "text": "驾驶舱总灯"
   },
   {
    "id": "f-attention",
    "text": "要我处理的事"
   },
   {
    "id": "f-plain",
    "text": "说人话、读不到合成一行"
   },
   {
    "id": "f-refresh",
    "text": "一直看得见的刷新按钮"
   },
   {
    "id": "f-pc",
    "text": "电脑和远程"
   },
   {
    "id": "f-tasks",
    "text": "自动任务"
   },
   {
    "id": "f-backup",
    "text": "备份和云端"
   },
   {
    "id": "f-projects",
    "text": "项目出错和等验收"
   },
   {
    "id": "f-river",
    "text": "今天的动态和今天的河"
   },
   {
    "id": "f-cost",
    "text": "余额和花费提醒"
   },
   {
    "id": "f-lag",
    "text": "电脑会不会卡的预警"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "wly0829-cn-features",
  "reuse": "",
  "nav_title": "全部功能"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（39 项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：",
     "columns": 6
    },
    {
     "type": "feature_card",
     "text_ref": "首页和驾驶舱",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/icons/太阳工具.png",
      "_library/icons/手机点桌面.png",
      "_library/icons/报警灯.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/气泡.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/秒表.png",
      "_library/icons/云对勾.png",
      "_library/icons/文件夹.png",
      "_library/illustrations/水流汇合.png",
      "_library/illustrations/账本.png",
      "_library/icons/波形照片.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（39 项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：",
     "columns": 3
    },
    {
     "type": "feature_card",
     "text_ref": "首页和驾驶舱",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/icons/太阳工具.png",
      "_library/icons/手机点桌面.png",
      "_library/icons/报警灯.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/气泡.png",
      "_library/hires-icons-r2/版本循环文件.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/秒表.png",
      "_library/icons/云对勾.png",
      "_library/icons/文件夹.png",
      "_library/illustrations/水流汇合.png",
      "_library/illustrations/账本.png",
      "_library/icons/波形照片.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-06-all-features-39-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-11-title-1",
   "title_text": "全部功能（39 项）",
   "sha256": "761604f10f7d1cfa2f1611f5cf3899e9d2781eb78682a48fa9c6bc385274e7f7",
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
   "asset": "wly0829-cn/wly0829-cn-07-home-cockpit-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-11-title-2",
   "title_text": "首页和驾驶舱",
   "sha256": "d931cb10fe19919c06a2d85bba2e2513859df156ecd705ac8265164c4f5ec6fe",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（39 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

**首页和驾驶舱**
1. 首页总入口｜我是谁、这套东西办过什么事、从哪进去｜在用
2. 首页的画跟着时段换｜清晨、白天、傍晚、晚上，也能自己点着换｜在用
3. 画里的电脑屏幕进驾驶舱｜点首页画里电脑的屏幕，直接进驾驶舱｜在用
4. 驾驶舱最上面的结论｜分开写要我做的事、电脑健康、AI 待核对的事，写明数据几点读的；10 月 12 日已上线，本人还没验收｜待验收
5. 要我处理的事｜只列真要我管的，标题直接说出是什么问题，附办理入口和步骤｜在用
6. 说人话、读不到写清楚｜驾驶舱用大白话写；读不到的说明原因和最近一次读到的时间；10 月 12 日已上线，本人还没验收｜待验收
7. 一直看得见的刷新按钮｜驾驶舱开着时每分钟自动读一次；顶上一条刷新条滚到哪里都钉在屏幕顶上，点一下立刻重读；10 月 12 日已上线，本人还没验收｜待验收
8. 电脑和远程｜温度、占用、磁盘、网络，远程连接和副机在不在线，近 24 小时曲线｜在用
9. 自动任务｜在做什么、上次下次、有没有出错、怎么停、停了影响什么｜在用
10. 备份和云端｜按去处列，超期变黄，两个周期没成功变红｜在用
11. 项目出错和等验收｜只列出错的和等验收的，等多久都只提醒不变色｜在用
12. 今天的动态和今天的河｜按北京时间排今天有凭据的事，画成河上的船，下面是记录｜在用
13. 余额和花费提醒｜阿里云可用额度低于10元的短信、邮件提醒已开启；驾驶舱余额和本月花费仍待接入，实际通知送达尚未验证｜在用
14. 电脑会不会卡的预警｜资源预警后端已部署，AI可读取同一结论，实时入口已带上这份数据；趋势需至少25小时积累，目前在观察期，驾驶舱里的显示本人还没验收｜在用

::screen{#wly0829-cn-12 section="features"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-12",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法：每组先一行毛笔字组名（组名在卡片网格上方单独一行），下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉），状态文字不画出来，只画圆点。接着上一张往下排，没有标题和图例。放“资料锁和授权”“读懂整套东西”“AI 怎么维护”3 组。",
  "portrait": "竖版：组名一行，卡片一行一张（左图标、中间编号功能名和一句话、右上圆点）；第一张顶上标题和图例。",
  "links": [],
  "anchors": [
   {
    "id": "g-lock",
    "text": "资料锁和授权"
   },
   {
    "id": "f-data-lock",
    "text": "个人资料锁"
   },
   {
    "id": "f-takeover",
    "text": "全局无限制授权"
   },
   {
    "id": "f-winlock",
    "text": "Windows 锁屏"
   },
   {
    "id": "f-unlock-jump",
    "text": "解锁跳转和办理区"
   },
   {
    "id": "g-read",
    "text": "读懂整套东西"
   },
   {
    "id": "f-all-projects",
    "text": "全部项目"
   },
   {
    "id": "f-rules",
    "text": "规则"
   },
   {
    "id": "f-skills",
    "text": "技能"
   },
   {
    "id": "f-how",
    "text": "怎么协作"
   },
   {
    "id": "f-rescue",
    "text": "救急先看"
   },
   {
    "id": "f-connect",
    "text": "连接电脑"
   },
   {
    "id": "f-brief",
    "text": "复制 AI 续作说明"
   },
   {
    "id": "g-upkeep",
    "text": "AI 怎么维护"
   },
   {
    "id": "f-on-demand",
    "text": "按需更新"
   },
   {
    "id": "f-speed-target",
    "text": "小改 45 分钟、大批 3 小时"
   },
   {
    "id": "f-gate",
    "text": "发布前自动检查"
   },
   {
    "id": "f-gate-layout",
    "text": "排版和交互检查进发布门"
   },
   {
    "id": "f-readback",
    "text": "发布后回读"
   },
   {
    "id": "f-lean-publish",
    "text": "省流量发布"
   },
   {
    "id": "f-patrol",
    "text": "驾驶舱定时巡检"
   },
   {
    "id": "f-recover-first",
    "text": "出问题先恢复"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "wly0829-cn-features",
  "reuse": "",
  "nav_title": "全部功能"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "资料锁和授权",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/上锁仓库箱.png",
      "_library/icons/双授权卡严格两张.png",
      "_library/hires-icons/开关.png",
      "_library/icons/解锁窗口手势.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    },
    {
     "type": "feature_card",
     "text_ref": "读懂整套东西",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/双气泡.png",
      "_library/illustrations/电脑故障.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/文件写作.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    },
    {
     "type": "feature_card",
     "text_ref": "AI 怎么维护",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/秒表.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/盾牌对勾.png",
      "_library/icons/浏览器标签页.png",
      "_library/icons/云对勾.png",
      "_library/illustrations/电脑后台闹钟.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "资料锁和授权",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/上锁仓库箱.png",
      "_library/icons/双授权卡严格两张.png",
      "_library/hires-icons/开关.png",
      "_library/icons/解锁窗口手势.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    },
    {
     "type": "feature_card",
     "text_ref": "读懂整套东西",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
      "_library/icons/双气泡.png",
      "_library/illustrations/电脑故障.png",
      "_library/icons/手机电脑连接.png",
      "_library/icons/文件写作.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    },
    {
     "type": "feature_card",
     "text_ref": "AI 怎么维护",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文件写作.png",
      "_library/icons/秒表.png",
      "_library/hires-icons/打勾清单.png",
      "_library/icons/盾牌对勾.png",
      "_library/icons/浏览器标签页.png",
      "_library/icons/云对勾.png",
      "_library/illustrations/电脑后台闹钟.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-08-data-lock-authorization-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-12-title-1",
   "title_text": "资料锁和授权",
   "sha256": "af0f85a732bbf37751753eff26b642926656ce1fe404933275f4be552a78e51b",
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
   "asset": "wly0829-cn/wly0829-cn-09-understand-whole-system-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-12-title-2",
   "title_text": "读懂整套东西",
   "sha256": "a1ff10e48e9488606cd493f0323dc1362358fbf1297e6dcb14ff1b72487f9ca8",
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
   "asset": "wly0829-cn/wly0829-cn-10-how-ai-maintains-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-12-title-3",
   "title_text": "AI 怎么维护",
   "sha256": "0f968c434403571f8be469ee30fb3a789b6ab23b2d234ffc92e9026891fb4ff1",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**资料锁和授权**
15. 个人资料锁｜看锁没锁；验证一次，开一段我定的时长｜在用
16. 全局无限制授权｜开启、结束、延长，和资料分开计时｜在用
17. Windows 锁屏｜看锁没锁，一键锁屏，不动另外两项的期限｜在用
18. 解锁跳转和办理区｜从别处点“解锁”直接落在办理那块、不弹回；办理区重排已于 10 月 10 日合入源码，线上和验收还没核实｜待实施

**读懂整套东西**
19. 全部项目｜按本事分组，每个项目一页：怎么用、怎么搭、全部功能、演进｜在用
20. 规则｜30 条约法和 10 个专题，跟着当前生效的版本走，换版后随下一次发布同步｜在用
21. 技能｜AI 照着办的说明书，写清怎么跟 AI 说；Word 文档、PDF 读写和表单两页 10 月 12 日换成新版，真实做文档还说不准｜在用
22. 怎么协作｜我、Claude、GPT 和各项目怎么接力，能点着看｜在用
23. 救急先看｜电脑卡死、连不上、代理坏了，按症状照着做｜在用
24. 连接电脑｜自己远程看桌面，或让 AI 用这台电脑｜在用
25. 复制 AI 续作说明｜项目页一键复制，新对话照着接着干｜在用

**AI 怎么维护**
26. 按需更新｜我说“更新网站”才改；GPT 取数、Opus 写稿，只重出受影响的屏｜在用
27. 日常 90 分钟、全部更新 4 小时｜从提出到公网核对完的目标，只改数字 60 分钟；10 月 7 日旧做法没达到旧目标，10 月 11—12 日第一次完整实测 71 分 56 秒公网核对通过，但分步时限没全达到｜待验收
28. 发布前自动检查｜生成整站（没变的部分直接复用）后只扫改过的页：空白、压叠、裁字、空图框、404、点不动，有一项不过或成品字节对不上就不发｜在用
29. 排版和交互检查进发布门｜扫描结果和要发的成品逐文件绑定；10 月初旧扫描登记的 227 条旧问题只是历史基线，不是现存缺陷数｜在用
30. 发布后回读｜等部署成功后，新传资源核大小和校验码，关键页和改过的网页从公网整页读回；对不上就报失败，不会自动退回｜在用
31. 省流量发布｜只传变了的文件；资源只问大小和校验码、不下载，只有关键页和改过的网页整页读回｜在用
32. 驾驶舱巡检｜每 15 分钟看一次线上驾驶舱页面和数据接口，连续 10 分钟打不开发 Gmail，恢复再发一封；巡检已发出过故障提醒与恢复提醒｜在用
33. 出问题先恢复｜手动重新部署上一个能用的成品版本，再核公网清单和关键页；实时入口的函数另行部署，网页发布不替它发；根治在后台做，汇报分开写｜在用

::screen{#wly0829-cn-13 section="features"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-13",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版画面：和标杆页“全部功能”一样的画法：每组先一行毛笔字组名（组名在卡片网格上方单独一行），下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉），状态文字不画出来，只画圆点。接着上一张往下排，没有标题和图例。放“画和动效”“已停用”2 组。已停用那组卡片整体颜色淡一些。",
  "portrait": "竖版：组名一行，卡片一行一张（左图标、中间编号功能名和一句话、右上圆点）；第一张顶上标题和图例。",
  "links": [],
  "anchors": [
   {
    "id": "g-paint",
    "text": "画和动效"
   },
   {
    "id": "f-living",
    "text": "每页的画会动"
   },
   {
    "id": "f-bird",
    "text": "贯穿全站的小鸟"
   },
   {
    "id": "f-comic",
    "text": "首页连环画"
   },
   {
    "id": "f-portrait",
    "text": "手机竖版"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-old-paint",
    "text": "整屏全靠生图"
   },
   {
    "id": "f-old-video",
    "text": "开头短视频"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "wly0829-cn-features",
  "reuse": "",
  "nav_title": "全部功能"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "画和动效",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/画笔调色板.png",
      "../bird/poses/sample/sprites/bird-idle.png",
      "_library/icons/小放映机.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    },
    {
     "type": "feature_card",
     "text_ref": "已停用",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/相机.png",
      "_library/icons/小放映机.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "画和动效",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/画笔调色板.png",
      "../bird/poses/sample/sprites/bird-idle.png",
      "_library/icons/小放映机.png",
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    },
    {
     "type": "feature_card",
     "text_ref": "已停用",
     "columns": 3,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/相机.png",
      "_library/icons/小放映机.png"
     ],
     "status_position": "top_right",
     "status_text": "dot_only",
     "last_row": "fill",
     "group_heading_style": "brush",
     "heading_size": "small"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "asset": "wly0829-cn/wly0829-cn-11-art-and-motion-v1.png",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-13-title-1",
   "title_text": "画和动效",
   "sha256": "3dc20ae4fe9241b720d254dfbd47175f47ed1a4cdd9c4960a311e11876b65b63",
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
   "asset": "_library/titles/title-a8c3698b5b8c485d8bd4.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "wly0829-cn-13-title-2",
   "title_text": "已停用",
   "sha256": "109419764a0213c3c797117892861b41eba1c925b8ea33a3c2d91df372cd05da",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**画和动效**
34. 每页的画会动｜代码动效；连续几秒太卡，这一页自动退回静态｜在用
35. 贯穿全站的小鸟｜每页都有一只；10 月 6 日夜里换上新动作配置、修好图集读取｜在用
36. 首页连环画｜首页的一组画按顺序动起来｜在用
37. 手机竖版｜每屏都有手机版式；太难维护的复杂动效在手机上可以不显示｜在用

**已停用**
38. 整屏全靠生图｜字和画一起画进图里，改一个字要重画整张；10 月 3 日停｜已停用
39. 开头短视频｜Google Flow 做的 27 段，改用代码动效后留作退路｜已停用

::screen{#wly0829-cn-14 section="history"}

```typeset
{
 "screen": {
  "id": "wly0829-cn-14",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左边一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边一幅大一点的水彩插画：从上到下长出一张空白的占位纸、几张项目卡片、一整幅水彩画、一台带绿灯的显示器、一只停在显示器上的小鸟，像一路长出来的样子（插画里不画字）。",
  "portrait": "竖版：按同一份文字顺序从上到下排，表格改成一行一条卡片，插画缩成一整行宽放在标题下；不缩小正文。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "nav_title": "演进"
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
     "text_ref": "8 月 7–8 日",
     "direction": "vertical",
     "columns": 2,
     "columns_v": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/icons/文稿堆.png",
      "_library/icons/钥匙.png",
      "_library/icons/画笔调色板.png",
      "_library/icons/文件齿轮.png",
      "../bird/poses/sample/sprites/bird-idle.png",
      "_library/icons/报警灯.png"
     ],
     "width": "100%"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
     "text_ref": "8 月 7–8 日",
     "direction": "vertical",
     "columns": 1,
     "columns_v": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/浏览器标签页.png",
      "_library/icons/文稿堆.png",
      "_library/icons/钥匙.png",
      "_library/icons/画笔调色板.png",
      "_library/icons/文件齿轮.png",
      "../bird/poses/sample/sprites/bird-idle.png",
      "_library/icons/报警灯.png"
     ],
     "width": "100%"
    }
   ],
   "notes": "按每屏横竖版说明组合现有章节标题、卡片、表格、流程和时间线组件。",
   "provenance": {
    "text": "sources/pages/wly0829-cn/page.json",
    "source_sha256": "07c949c827231a63e869218541546899aa33822183b32b0cd8494e36b615fd5f",
    "requirements": "派单原稿：Opus 定稿，共 14 屏、39 项。",
    "composition": "按各屏 scene 与 portrait 排列已有组件类型，没有增加渲染机制。",
    "style": "沿用现有 sources/pages/*/layout.json 结构与已登记组件。"
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
   "key": "wly0829-cn-14-title-1",
   "title_text": "演进（北京时间）",
   "sha256": "f822fd4b764807be915e72b98b9486fe72a42f3abebbb53422a5e6db514f9ee4",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 演进（北京时间）

- **8 月 7–8 日**：放上一张占位页；第二天网页上了 GitHub Pages。
- **8 月 28–31 日**：第一版个人工作台，四个项目加规则和技能；8 月 30 日我认可这一版。
- **9 月**：项目页一个个补齐；9 月 24–25 日“授权与状态”上线，在网页上就能解锁资料、开授权。
- **9 月 27–29 日**：定下白底、绿色、手绘水彩；驾驶舱要列全电脑上的任务；开始整屏生图重做全站。
- **10 月 2–3 日**：新版上线；3 日凌晨改成程序排字、AI 画图；图片搬到阿里云上海，国内打开快了。
- **10 月 5–6 日**：首页和 64 页的画动起来；小鸟贯穿全站，首页连环画、驾驶舱“今天的河”上线；比过别家托管，定下不换。
- **10 月 7 日**：我定下网站就是唯一的总看板，驾驶舱按最高档要求做；告警标题直接说出问题；发布改成只传、只核变了的文件；全站检查登记现有问题、只拦新问题；驾驶舱巡检开始每 15 分钟跑一次。
- **10 月 11–12 日**：生成和发布统一到一个入口；更新网站时按来源清单取实时和快照事实，改写稿整批校验后合入；驾驶舱的实时入口改成推送后自动上线，不用我再登录；驾驶舱新版和 Word、PDF 两页技能说明上线。按需更新的时限还没验收通过。
