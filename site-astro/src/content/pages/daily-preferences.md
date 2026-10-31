---
{
 "title": "个人理解库",
 "kind": "project",
 "url": "/projects/daily-preferences/",
 "tagline": "让 AI 了解我的背景和偏好，说错了一纠正就改。",
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
  "page": "daily-preferences",
  "kind": "project",
  "title": "个人理解库",
  "url": "/projects/daily-preferences/",
  "tagline": "让 AI 了解我的背景和偏好，说错了一纠正就改。",
  "status": "常用",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-24 02:15"
   },
   "facts": [
    "技能调用已记 11 次",
    "命令行调用另记 346 次"
   ],
   "as_of": "2026-10-11",
   "source": "AI 使用记录（10 月 5 日起，记到 10 月 9 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "了解我这个人",
  "based_on": {
   "commit": "b334b3aa73d388ab74db0bd63a69911bfacea13d",
   "commit_time": "2026-10-08T00:23:47+08:00",
   "scope": "受影响模块和总览按 v0.18.1 更新；历史验收保留原日期"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的插画出发，镜头不动：书桌上打开的木质卡片盒，几条细细的绿色虚线从画面边缘缓缓飘进来，线头的小图标（聊天气泡、购物袋、定位针、手机、音符）依次轻轻落进卡片盒；最前面一张索引卡被铅笔划掉一道短线、旁边长出一道新的短线，后面相连的两张卡随之微微翘起又落下；卡片顶上的小绿标签像呼吸一样明暗；背景水彩微微流动，偶尔一片小叶子飘过。画面里不出现任何文字，最后一帧回到第一帧，无缝循环。",
  "registry": {
   "groups": [
    {
     "id": "g-know",
     "name": "认识我"
    },
    {
     "id": "g-correct",
     "name": "记下和纠正"
    },
    {
     "id": "g-check",
     "name": "检查写得对不对"
    },
    {
     "id": "g-facts",
     "name": "查事实"
    },
    {
     "id": "g-choose",
     "name": "帮我选"
    },
    {
     "id": "g-share",
     "name": "给别的项目和设备"
    },
    {
     "id": "g-sources",
     "name": "接新材料"
    },
    {
     "id": "g-guard",
     "name": "保护和修复"
    }
   ],
   "features": [
    {
     "id": "f-background",
     "group": "g-know",
     "name": "问我的情况",
     "what": "经历、处境、做事的取舍：先读相关卡的摘要索引，够了直接答",
     "how": "直接问，不用点名这个库",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:41、74；inventory“本人背景”；ledger last_used 9/27"
    },
    {
     "id": "f-topic-card",
     "group": "g-know",
     "name": "按主题细看",
     "what": "一张卡的完整详述、相关原话和全部证据；要核当时的语境，连原话一起展开",
     "how": "让 AI 查某件事的来龙去脉",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:74；DOMAIN_CONTRACT.md:113；inventory“认知详卡”"
    },
    {
     "id": "f-evidence",
     "group": "g-know",
     "name": "带依据回答",
     "what": "日常问题把相关卡和依据一起拿出来，还列出没写进卡的原文候选，说清查了哪些来源",
     "how": "问问题时说“说说依据”",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:70、78；inventory“证据提问”；ledger last_used 9/26"
    },
    {
     "id": "f-recent",
     "group": "g-know",
     "name": "最近在做什么",
     "what": "近况卡：这段时间主要在哪、时间花在哪、和之前比变了什么、推断在忙什么",
     "how": "问“我最近在忙什么”",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:25–38；status：现行近况卡 snapshot 972（9/27 生成）"
    },
    {
     "id": "f-recent-expiry",
     "group": "g-know",
     "name": "近况过期提醒",
     "what": "窗口结束超过 7 天或之后有新记录就标过期；回答时说明截至哪天，只补读之后的记录",
     "how": "不用做什么，读近况时自动判断",
     "status": "待验收",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:38；owner-decisions.md“理解库的记录功能：本人补充”（3fc5263）；9/28 资料开着时复查：status 在报 needs_update=true；Claude、Codex 会话记录里 9/27 23:48 近况卡生成后没有 AI 按“截至某日”作答的记录；库里 ChatGPT 对话只到 9/27 15:44，早于近况卡"
    },
    {
     "id": "f-ask-one",
     "group": "g-know",
     "name": "拿不准先问一个",
     "what": "一种解释会影响以后的理解、材料又答不了时，先问我一个具体问题；我没回不算认可",
     "how": "AI 自己判断什么时候问",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:40–44；原话 241（9/24）是回答 AI 追问“常驻通知哪天开的”（答 9.23）"
    },
    {
     "id": "f-record",
     "group": "g-correct",
     "name": "记下我的原话",
     "what": "分补充、临时、更正、撤回四种记；回顾过去的话按当时的日期记",
     "how": "直接说“我现在是这么想的”",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:168；数据库原话 375 条"
    },
    {
     "id": "f-correct",
     "group": "g-correct",
     "name": "纠正后旧卡退场",
     "what": "更正让引用旧说法的卡（包括别的项目引用的）退出当前结果，复核重写后才回来",
     "how": "告诉 AI 哪里理解错了",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:94；inventory“纠正认识”；数据库 48 个卡版本因原话变化失效"
    },
    {
     "id": "f-temporary",
     "group": "g-correct",
     "name": "临时说法会到期",
     "what": "带截止的说法到期作废，没撤回的长期说法照常用",
     "how": "说“这两周先……”",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:88；DOMAIN_CONTRACT.md:168；数据库 temporary 2 条"
    },
    {
     "id": "f-write-card",
     "group": "g-correct",
     "name": "写认识卡",
     "what": "摘要、详述、检索别名、证据一起写，证据分支持、反例、语境；多张卡先全部校验再一次写入",
     "how": "AI 自己做",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:84；DOMAIN_CONTRACT.md:170–198；数据库 993 个卡版本"
    },
    {
     "id": "f-change-report",
     "group": "g-check",
     "name": "讲清认识变了什么",
     "what": "每次实质更新后说清新增、更正、增强、减弱了什么和依据；只报条数不算",
     "how": "更新完 AI 主动讲",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:142–146；SKILL.md 第 57 行；owner-decisions.md 9/27 近况后照常汇报"
    },
    {
     "id": "f-card-lint",
     "group": "g-check",
     "name": "检查卡片写法",
     "what": "只读查 7 类毛病：新原话没引用、追加式补充、人称混用、统计缺时间范围、限定语过密、引用的附件变了、卡里写了来源状态",
     "how": "说“检查一下写得对不对”",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "README.md:66；DOMAIN_CONTRACT.md:130–132；inventory“卡片检查”；FY07；数据库复核标记 6 条"
    },
    {
     "id": "f-cognition-audit",
     "group": "g-check",
     "name": "跨项目认知审计",
     "what": "给我看的分析按日期存档；下次审计时先对照上次哪些问题解决了",
     "how": "说“审一下你对我的认识”",
     "status": "在用",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:13；给本人看的分析目录 6 份（9/13 两份、9/26 四份）"
    },
    {
     "id": "f-monthly",
     "group": "g-check",
     "name": "每月一页汇总",
     "what": "每月第一次相关长谈时，顺手汇总本月认识变化和还待纠正的",
     "how": "不用做什么",
     "status": "没用过",
     "screen": "daily-preferences-12",
     "source": "DOMAIN_CONTRACT.md:144；9/28 查会话记录和“给本人看的分析”目录都没有月度汇总；9 月是第一个月，还没到“每月第一次相关长谈”"
    },
    {
     "id": "f-facts",
     "group": "g-facts",
     "name": "查记录和出处",
     "what": "按词、平台、来源、材料类型查已存记录；不给关键词也能按来源翻页",
     "how": "问“买过什么”“这条从哪来”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "README.md:68–70；inventory“事实检索”；ledger last_used 9/27"
    },
    {
     "id": "f-statements",
     "group": "g-facts",
     "name": "核对原话",
     "what": "按编号读原话全文、说的时间和语境",
     "how": "问“这句话我当时怎么说的”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "README.md:76；inventory“原话核对”；ledger last_used 9/27"
    },
    {
     "id": "f-original",
     "group": "g-facts",
     "name": "回查原件",
     "what": "先核原件还在、SHA-256 对得上再给原文；对不上就不拿旧片段冒充",
     "how": "要看原文时 AI 自己调",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "README.md:94；DOMAIN_CONTRACT.md:224；ledger 查记录出处含 original"
    },
    {
     "id": "f-spending",
     "group": "g-facts",
     "name": "花钱核对",
     "what": "任意日期区间按日或按月汇总；净消费＝实付扣成功退款，订单和支付不重复算，币种分开",
     "how": "问“上个月花了多少、退了多少”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "DOMAIN_CONTRACT.md:320–332；FY05；inventory“消费核对”；ledger last_used 9/26"
    },
    {
     "id": "f-activity",
     "group": "g-facts",
     "name": "手机电脑用在哪",
     "what": "一段时间里手机、电脑各自的总量、主要应用和每天变化；两台设备的时长不相加",
     "how": "问“这周手机主要用在哪”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "README.md:72；FY06；inventory“设备使用”；ledger last_used 9/27"
    },
    {
     "id": "f-mobility",
     "group": "g-facts",
     "name": "去过哪",
     "what": "某天或一段时间的停留和移动；停留点用高德接口起区域名，定位空档不猜",
     "how": "问“那天去了哪些地方”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "mobility.py 第 1–7、634–672 行；FY06；inventory“行程观察”；ledger last_used 9/27"
    },
    {
     "id": "f-device-inventory",
     "group": "g-facts",
     "name": "手机装了什么",
     "what": "按导出时间取最新的已装应用清单，能搜能翻页",
     "how": "问“手机上还装着某个应用吗”",
     "status": "没用过",
     "screen": "daily-preferences-13",
     "source": "CURRENT_ACCEPTANCE.md:8；9/28 查 Claude、Codex 会话记录，没有一次 device-inventory 调用"
    },
    {
     "id": "f-records",
     "group": "g-facts",
     "name": "按编号读回记录",
     "what": "把一次导入改动的记录分页读回，写明只读了存档、没读原件正文；几个只读查询可以合成一次",
     "how": "AI 更新时自己用",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "DOMAIN_CONTRACT.md:268；source-refresh.md“当前快照、导出与阅读进度入口”"
    },
    {
     "id": "f-recommend",
     "group": "g-choose",
     "name": "日常推荐菜单",
     "what": "吃、买、玩：稳妥、相邻、新鲜三组各至少 3 个，每个写为什么；不替我只选一个",
     "how": "说想吃、买或玩什么和有什么限制",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "recommendations.md 第 6–7 条；原话 9–14（9/1）是看过推荐输出后的验收意见（如“候选可以比当前版本再详细一档”）；卡 778"
    },
    {
     "id": "f-search-relay",
     "group": "g-choose",
     "name": "搜索接力",
     "what": "要实时价格、菜单、评价时，建议去哪一两个平台，给能复制的搜索词",
     "how": "推荐时 AI 主动给",
     "status": "说不准",
     "screen": "daily-preferences-13",
     "source": "recommendations.md 第 8–9 条；原话 6–8（9/1）定下规矩；9/28 查会话记录和库里 AI 对话，没找到 AI 实际给出平台和搜索词的回答"
    },
    {
     "id": "f-writeback",
     "group": "g-share",
     "name": "别的项目写回来",
     "what": "带投递编号、来源项目、出处和读到的版本号；重试不重复写，迟到的旧版本盖不掉新更正",
     "how": "别的项目的 AI 自己做",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "DOMAIN_CONTRACT.md:160–202；数据库 writeback_deliveries 556 次"
    },
    {
     "id": "f-personal-update",
     "group": "g-share",
     "name": "更新个人",
     "what": "不限定来源时，把全部在用的个人项目都查一遍，逐项说处理了、没变化、缺材料还是冻结",
     "how": "说“要更新了”或“更新个人”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "SKILL.md“未限定的个人更新”；DOMAIN_CONTRACT.md:9–11；FY04"
    },
    {
     "id": "f-phone-cloud",
     "group": "g-share",
     "name": "手机和云端同一份",
     "what": "手机、云端的 AI 经电脑 MCP 调同样的命令，不另存副本",
     "how": "在手机上照常问",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "DOMAIN_CONTRACT.md:334–340；owner-decisions.md“理解库手机与云端共用入口”"
    },
    {
     "id": "f-export",
     "group": "g-share",
     "name": "导出成文件",
     "what": "给没接电脑的 AI 或离线用，从同一个库导出两份独立可读的文件",
     "how": "说“导出一份给别的设备用”",
     "status": "在用",
     "screen": "daily-preferences-13",
     "source": "DOMAIN_CONTRACT.md:344–350；手机交付\\交付回执.json 9/8 真实交付一次；9/9 改成按需后，会话记录里没有再调用"
    },
    {
     "id": "f-ingest",
     "group": "g-sources",
     "name": "导入新导出",
     "what": "原件先挪进来源投递区保全，按内容去重，默认增量导入；只有完整快照才全量",
     "how": "把导出的文件交给 AI",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "README.md:100、108；inventory“来源增量”；数据库 6,127 次导入"
    },
    {
     "id": "f-chatgpt",
     "group": "g-sources",
     "name": "ChatGPT 只读新增",
     "what": "按消息编号增量导入，只读新增或有新消息的对话；让 ChatGPT 操作电脑的对话整段跳过",
     "how": "新导出放进下载目录，说一声",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "docs/source-rules.md:13；owner-decisions.md 9/28；9/28 16:59 有 AI 对话导入"
    },
    {
     "id": "f-refresh",
     "group": "g-sources",
     "name": "本机来源刷新",
     "what": "Chrome、Steam 直接读本机；B站用这次在 Chrome 里采到的结果",
     "how": "说“更新一下浏览器和 B站”",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "README.md:112；source-refresh.md“Chrome、Steam 与哔哩哔哩”；9/26 导入"
    },
    {
     "id": "f-refresh-sources",
     "group": "g-sources",
     "name": "已连接来源刷新",
     "what": "Gmail、Tasks、Keep、手机上传、电脑软件清单、电脑使用、网易云快照，一条命令更新",
     "how": "说“更新最近的个人资料”",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "DOMAIN_CONTRACT.md:17；inventory“来源刷新”；9/27 导入"
    },
    {
     "id": "f-page-collect",
     "group": "g-sources",
     "name": "在已登录网页里采集",
     "what": "B站、京东、美团、饿了么：在我已登录的 Chrome 里跑只读脚本，不读 cookie 和密码，不点按钮不下单",
     "how": "说“把京东订单更新一下”",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "tools/claude_page_collect/README.md；source-refresh.md“已支持的网页增量”；9/26 美团、京东真实跑通"
    },
    {
     "id": "f-wechat",
     "group": "g-sources",
     "name": "读微信新消息",
     "what": "比对每个会话读到哪，只收新的一段；读完、改完卡才推进阅读位置",
     "how": "说“更新微信”",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "DOMAIN_CONTRACT.md:276–312；微信阅读目录 9 个"
    },
    {
     "id": "f-citations",
     "group": "g-sources",
     "name": "引用别处原文",
     "what": "读过的微信原文、转写片段、附件存成已核对引用；被引用的那一版按 SHA-256 冻结一份",
     "how": "AI 写卡时自己做",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "DOMAIN_CONTRACT.md:204–222；数据库 reviewed_citations 1,202 条；引用快照 39 份"
    },
    {
     "id": "f-silence",
     "group": "g-sources",
     "name": "来源静默提醒",
     "what": "每类来源有应有的节奏，超期在给 AI 读的首页（CURRENT.md）顶部标“静默”；停了的几个手动导出来源并成一个问题一次问我",
     "how": "更新时 AI 先看",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "daily_preferences.py 第 2778–2810 行；DOMAIN_CONTRACT.md:15；status 现有 4 个静默"
    },
    {
     "id": "f-source-review",
     "group": "g-sources",
     "name": "记下读到哪",
     "what": "每次导入的阅读和整合进度分开记：未知、部分、完成",
     "how": "AI 读完后自己记",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "source-refresh.md“当前快照、导出与阅读进度入口”；status source_review"
    },
    {
     "id": "f-snapshots",
     "group": "g-sources",
     "name": "该导出哪一段",
     "what": "列出每个来源实际覆盖到哪天，建议从哪天开始重叠导出",
     "how": "说“准备投递增量”",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "source-refresh.md“准备人工投递”；会话记录：9/27 16:02–16:20（北京）为 ChatGPT 新导出调用 snapshots --source-id chatgpt.account-a，同一时段原话 354“ChatGPT 我现在导出”"
    },
    {
     "id": "f-owner-check",
     "group": "g-sources",
     "name": "别的项目有新结果吗",
     "what": "比对引用过的别项目文件变没变，变了才去读",
     "how": "更新时 AI 自己查",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "DOMAIN_CONTRACT.md:288；会话记录：9/27 23:01（北京）更新个人时真实调用 status --check-owner-results"
    },
    {
     "id": "f-audio-cloud",
     "group": "g-sources",
     "name": "存疑录音再请云端听",
     "what": "本库挑的录音本地转写存疑时，经中文语音转写的阿里云入口复核",
     "how": "AI 自己判断",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "docs/source-rules.md:23；库里 7 段已核对引用的转写片段取自 ChineseASR 云端任务结果（outputs\\cloud-jobs，9/6 写入）"
    },
    {
     "id": "f-privacy-gate",
     "group": "g-guard",
     "name": "读之前先过资料锁",
     "what": "每条命令写明要读的等级；锁着就拒绝，一批请求整批拒绝",
     "how": "不用做什么",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "AGENTS.md:8；DOMAIN_CONTRACT.md:101–107；CURRENT_ACCEPTANCE.md:13"
    },
    {
     "id": "f-status",
     "group": "g-guard",
     "name": "看整体状态",
     "what": "来源、缺口、静默、近况、待复核的导入一次看；待复核＝阅读状态未知或只读了一部分，不等于没读",
     "how": "说“理解库现在什么状态”",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "README.md:110；status 实际输出（9/28）；9 月 29 日修复对话：status 的 164 是待复核导入（48 次阅读状态未知、116 次部分阅读），不是 164 份没读"
    },
    {
     "id": "f-views",
     "group": "g-guard",
     "name": "两份视图自动重建",
     "what": "给 AI 的首页和完整详档，每次写入都在同一把数据库锁里重建",
     "how": "不用做什么",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "README.md:86；CURRENT.md、PROFILE.md 9/28 05:35 更新"
    },
    {
     "id": "f-repair-regression",
     "group": "g-guard",
     "name": "撤回错误的 B站 导入",
     "what": "先出只读方案，核对方案指纹、备份数据库后才执行",
     "how": "AI 发现退回旧版本时用",
     "status": "在用",
     "screen": "daily-preferences-14",
     "source": "README.md:106；DOMAIN_CONTRACT.md:244–250；数据库 meta import_current_repair.v1.5495"
    },
    {
     "id": "f-repair-locators",
     "group": "g-guard",
     "name": "原件搬家后改指向",
     "what": "核对大小和 SHA-256 后改原件位置，不重新导入",
     "how": "原件挪动后 AI 用",
     "status": "没用过",
     "screen": "daily-preferences-14",
     "source": "DOMAIN_CONTRACT.md:234；会话记录里只有 9/27 一次 --help，没有真实执行"
    }
   ],
   "numbers": [
    {
     "id": "n-cards",
     "text": "78 张",
     "meaning": "现行认识卡（preference_snapshots status=current，78 个键）",
     "as_of": "2026-10-12",
     "source": "只读查询 preferences.sqlite3",
     "screens": [
      "daily-preferences-01",
      "daily-preferences-07"
     ]
    },
    {
     "id": "n-statements",
     "text": "423 条",
     "meaning": "记下的本人原话（current 134、historical 289）",
     "as_of": "2026-10-12",
     "source": "preference_statements 计数",
     "screens": [
      "daily-preferences-01",
      "daily-preferences-07"
     ]
    },
    {
     "id": "n-records",
     "text": "52.0 万条 / 519,707 条",
     "meaning": "现行原始记录（records is_current=1），非现行 73,921，总版本 593,628",
     "as_of": "2026-10-12",
     "source": "records 计数",
     "screens": [
      "daily-preferences-01",
      "daily-preferences-07",
      "daily-preferences-08"
     ]
    },
    {
     "id": "n-sources",
     "text": "33 类",
     "meaning": "有现行记录的逻辑来源数（登记 34 类，另明确排除 5 类）",
     "as_of": "2026-10-12",
     "source": "records join source_instances 按 logical_source 分组",
     "screens": [
      "daily-preferences-01",
      "daily-preferences-05",
      "daily-preferences-07",
      "daily-preferences-08"
     ]
    },
    {
     "id": "n-stale",
     "text": "301 个",
     "meaning": "因来源变化（250）或本人原话变化（51）失效、退出当前结果的卡版本",
     "as_of": "2026-10-12",
     "source": "preference_snapshots status=stale 按 invalidation_reason 分组",
     "screens": [
      "daily-preferences-01"
     ]
    },
    {
     "id": "n-stale-statement",
     "text": "51 个",
     "meaning": "因本人原话变化或被更正而失效的卡版本",
     "as_of": "2026-10-12",
     "source": "原话变化 37＋引用原话更正 13＋引用原话变化 1",
     "screens": [
      "daily-preferences-11"
     ]
    },
    {
     "id": "n-card-versions",
     "text": "1,011 个",
     "meaning": "非现行卡版本（historical 710＋stale 301）",
     "as_of": "2026-10-12",
     "source": "preference_snapshots 计数",
     "screens": [
      "daily-preferences-07"
     ]
    },
    {
     "id": "n-evidence",
     "text": "支持 48,405 条、语境 14,645 条、反例 282 条",
     "meaning": "所有卡版本的关系计数（记录 36,348/10,776/282＋原话 12,057/3,869/0），不是独立证据数或当前卡专属数量",
     "as_of": "2026-10-12",
     "source": "snapshot_evidence、snapshot_statement_evidence 按角色计数",
     "screens": [
      "daily-preferences-07"
     ]
    },
    {
     "id": "n-per-source",
     "text": "表中各来源条数",
     "meaning": "33 类逻辑来源的现行记录条数",
     "as_of": "2026-10-11",
     "source": "records join source_instances 按 logical_source 计数",
     "screens": [
      "daily-preferences-08"
     ]
    },
    {
     "id": "n-amap",
     "text": "18 个停留点",
     "meaning": "上次高德区域查询覆盖 7 月 25 日–9 月 23 日，18 个停留点全部起了名",
     "as_of": "2026-09-23",
     "source": "E:\\PersonalData\\保留记录\\私密回执\\M1-位置数据源\\高德GeoAPI-GPSLogger-运行验证.json（只读计数字段）",
     "screens": [
      "daily-preferences-06"
     ]
    },
    {
     "id": "n-frozen",
     "text": "43 个",
     "meaning": "引用快照目录的冻结副本文件，只数文件，未逐个校验",
     "as_of": "2026-10-12",
     "source": "E:\\PersonalData\\日常偏好\\引用快照 文件数",
     "screens": [
      "daily-preferences-10"
     ]
    },
    {
     "id": "n-code",
     "text": "28,018 行",
     "meaning": "Git 跟踪的正式 Python 与 .mjs 代码，排除 tests；45 个文件（39 个 Python、6 个 .mjs），按换行符计数。",
     "as_of": "2026-10-30",
     "source": "见来源记录 daily-preferences-n-code-0，观察于 2026-10-30T11:06:32+08:00",
     "screens": [
      "daily-preferences-10"
     ]
    },
    {
     "id": "n-tests",
     "text": "测试定义 793 个（只计数）",
     "meaning": "仅静态清点测试定义，本轮没有重跑；历史实跑保持原日期。",
     "as_of": "2026-10-22",
     "source": "本轮只读来源记录 daily-preferences-n-tests-0，观察于 2026-10-22T08:06:26+08:00",
     "screens": [
      "daily-preferences-10"
     ]
    },
    {
     "id": "n-commits",
     "text": "258 次",
     "meaning": "截至本轮观察时刻的 HEAD 可达提交总数，含合并。",
     "as_of": "2026-10-22",
     "source": "本轮只读来源记录 daily-preferences-n-commits-0，观察于 2026-10-22T08:06:26+08:00",
     "screens": [
      "daily-preferences-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-learning",
     "with": "learning",
     "direction": "拿走",
     "flow": "学习方法排路线、讲课前读和学习有关的经历与取舍；学习里得到的本人新情况按可靠投递写回",
     "source": "AGENTS.md:18；writeback_deliveries 里有学习项目的投递"
    },
    {
     "id": "r-media",
     "with": "personal-media",
     "direction": "交来",
     "flow": "手机接入和电脑整理时发现的可复用本人事实（例如截图里有用的事实先记成文字）写回；手机接入也触发一次理解库更新",
     "source": "SKILL.md“未限定的个人更新”；owner-decisions.md 第 1701 行；writeback_deliveries 里有个人媒体的投递"
    },
    {
     "id": "r-materials",
     "with": "personal-materials",
     "direction": "分工",
     "flow": "下载目录里投递的原件先进材料库或来源投递区；本库只存事实索引、证据引用和认知版本，不改原件",
     "source": "SKILL.md 边界第 1 条；AGENTS.md:32"
    },
    {
     "id": "r-expression",
     "with": "personal-expression",
     "direction": "平级",
     "flow": "理解库管对本人的认识，表达库管说明和代拟消息的教训；更新时互相传会改变共同背景的结果",
     "source": "DOMAIN_CONTRACT.md:9；SKILL.md 第 28 行"
    },
    {
     "id": "r-health",
     "with": "personal-health",
     "direction": "拿来",
     "flow": "近况里读健康项目只读工具给的睡眠、步数，只当作息探针；手环数据新鲜度由健康项目的读取器提供；医学限制以健康项目为主",
     "source": "health_rhythm.py；daily_preferences.py 第 2819–2823 行；SKILL.md 选择主路由"
    },
    {
     "id": "r-timeaudit",
     "with": "timeaudit",
     "direction": "拿来",
     "flow": "电脑使用区间（desktop.activity）由 TimeAudit 记录，activity 入口实时读；卡顿诊断归 TimeAudit",
     "source": "timeaudit_sources.py；SKILL.md 选择主路由"
    },
    {
     "id": "r-wechat",
     "with": "wechatdirect",
     "direction": "拿来",
     "flow": "微信增量用微信直读公开的 changes 发现新消息、context 补上下文，读过的原文存成已核对引用",
     "source": "DOMAIN_CONTRACT.md:280"
    },
    {
     "id": "r-asr",
     "with": "chinese-asr",
     "direction": "拿来",
     "flow": "录音先复用已有转写；本库选的存疑录音经 ChineseASR 的阿里云入口复核，转写片段可作为已核对引用",
     "source": "docs/source-rules.md:23；DOMAIN_CONTRACT.md:213"
    },
    {
     "id": "r-ocr",
     "with": "localocr",
     "direction": "拿来",
     "flow": "图片按需要用原生视觉或本地文字识别复核",
     "source": "docs/source-rules.md:23"
    },
    {
     "id": "r-password",
     "with": "password-center",
     "direction": "拿来",
     "flow": "每次读之前查资料锁状态；高德接口的 key 由密码中心注入给区域查询程序",
     "source": "AGENTS.md:8；E:\\PCConfig\\registries\\password_center_machine.json 第 226 行"
    },
    {
     "id": "r-remote",
     "with": "remote-control",
     "direction": "拿来",
     "flow": "手机和云端的 AI 经电脑 MCP 在电脑上运行同一套命令",
     "source": "DOMAIN_CONTRACT.md:334–340"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "交出",
     "flow": "E:\\PersonalData（含日常偏好库）由 PersonalDataReplica-Hot-Daily 每天 17:10（北京时间） 同步到 G:\\80_Backup\\PersonalData；资料锁的统一接法文档在 PCConfig",
     "source": "E:\\PCConfig\\tools\\Sync-PersonalReplicasToG.ps1 第 28–31 行；AGENTS.md:8"
    },
    {
     "id": "r-work",
     "with": "work-delivery-copilot",
     "direction": "拿走",
     "flow": "工作支持读相关真实经历和协作取舍，不在这里维护工作事实",
     "source": "AGENTS.md:19；SKILL.md 选择主路由"
    },
    {
     "id": "r-formal",
     "with": "personal-formal-documents",
     "direction": "分工",
     "flow": "合同、正式材料归正式文书；本库只提供相关本人背景",
     "source": "SKILL.md 选择主路由"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "拿来",
     "flow": "技能 daily-preferences 放在规则与技能基座；本人决定原话在 owner-decisions.md",
     "source": "E:\\.agents\\skills\\daily-preferences\\SKILL.md；AGENTS.md:3"
    },
    {
     "id": "r-google",
     "with": "Google（Gmail、Tasks、Keep、Takeout）",
     "direction": "拿来",
     "flow": "Gmail、Tasks 走已有 Google 连接；Keep 在已登录 Chrome 里读；Google Play、Gemini 用 Takeout 导出",
     "source": "DOMAIN_CONTRACT.md:17；daily_preferences.py SOURCE_RHYTHMS"
    },
    {
     "id": "r-phone-upload",
     "with": "手机（FolderSync、GPSLogger、应用使用记录）",
     "direction": "拿来",
     "flow": "小米 15 Pro 上 FolderSync 每小时单向上传手机日志（短信、通话、定位、亮屏、应用使用）到电脑",
     "source": "DOMAIN_CONTRACT.md:19；SOURCE_RHYTHMS"
    },
    {
     "id": "r-sites",
     "with": "B站、京东、美团、饿了么",
     "direction": "拿来",
     "flow": "在本人已登录的 Chrome 里只读采集订单、观看和收藏，经页面下载交给导入工具",
     "source": "tools/claude_page_collect/README.md；source-refresh.md"
    },
    {
     "id": "r-exports",
     "with": "ChatGPT、Gemini、支付宝、微信支付、淘宝、招行、滴滴、航旅纵横、网易云、Steam、Chrome",
     "direction": "拿来",
     "flow": "本人导出或本机读取的原件，保全后增量导入",
     "source": "README.md:110"
    },
    {
     "id": "r-amap",
     "with": "高德地图 Web 服务",
     "direction": "拿来",
     "flow": "停留点坐标反查区域名，结果存进本地小缓存，查询时只读缓存",
     "source": "mobility.py 第 28–29、634–672 行"
    }
   ],
   "highlights": [
    {
     "id": "h-correction",
     "title": "说错了一纠正，旧结论自己退场",
     "screen": "daily-preferences-11"
    },
    {
     "id": "h-refund",
     "title": "退了的单不算喜欢，很久没买也不算讨厌",
     "screen": "daily-preferences-11"
    }
   ],
   "mentions": [
    {
     "target": "/how/#daily-preferences",
     "screen": "daily-preferences-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/how/#daily-preferences",
     "screen": "daily-preferences-02",
     "text": "怎么协作"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "daily-preferences-02",
     "text": "记得我是谁（技能）"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "daily-preferences-06",
     "text": "约法 L18"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "daily-preferences-06",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/remote-control/",
     "screen": "daily-preferences-07",
     "text": "电脑远程控制"
    },
    {
     "target": "/projects/password-center/",
     "screen": "daily-preferences-07",
     "text": "密码中心"
    },
    {
     "target": "/projects/timeaudit/",
     "screen": "daily-preferences-08",
     "text": "电脑使用与性能记录"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "daily-preferences-14",
     "text": "中文语音转写"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“来源刷新”拆成 f-refresh（Chrome、Steam、B站）和 f-refresh-sources（已连接来源）：两条命令、两类来源，本人说法也不同。",
    "底稿“纠正认识”拆成 f-record（记原话，分四种）和 f-correct（旧卡退场），外加 f-temporary：同一个 record 入口，但对读者是三件不同的事。",
    "底稿“事实检索”写成 f-facts；它提到的 original 回查另列 f-original，原话按编号读另列 f-statements（底稿“原话核对”）。",
    "命令 desktop-activity（电脑使用完整分组证据）并进 f-activity：同一件事的明细版。",
    "命令 read-batch（几个只读查询合一次）并进 f-records。",
    "命令 freeze-cited-files（补存旧引用的冻结副本）并进 f-citations。",
    "命令 card-lint --ack（标记已复核的提示）并进 f-card-lint。",
    "命令 profile --pending-review（读待复核的旧卡）并进 f-correct。",
    "tools/wechat_update.py 的 seed-history、status 并进 f-wechat。",
    "tools/amap_mobility_broker_worker.py（高德区域查询）并进 f-mobility，出事怎么办里单列一行。",
    "tools/claude_page_collect、claude_page_import.mjs 和 Codex 的 cdp 采集器（bilibili_browser_collect.mjs、commerce_browser_collect.mjs、takeaway_browser_collect.mjs）都写成 f-page-collect：读者看来是同一件事，差别是哪个 AI 在采。"
   ],
   "dropped": [
    "命令 init（建库）：技术步骤，本人不会用到。",
    "12306 不再单独网页采集；车票、改签和退票由 AI 按需读取 Gmail 中的 12306 邮件，既有 rail_history 快照仍可查询与重解析。",
    "README 里本人手机号的查询入口（personal.basics）：手机号是私人联系方式（分级表 L3），这页讲功能用不到它。",
    "sha256:f983c51cc9d65d2c9a1037f84287f5222891cbe0acc7ad18d1b9932f1b086717",
    "旧网站 ai-cli-profile-manager 画廊里那张“问偏好”的截图不放：属于别的项目。本项目在旧网站和仓库里没有自己的截图。",
    "调用项目逐个的投递次数不展开：只写总数 556，写进 registry 的出处里，页面不写。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏一句话和介绍段（“我的经历”“我说哪里理解错了”“我最近在忙什么”）；第 2 屏四段（“问到我”“我说一句”“我说一声”）；第 1 屏“真实的一次”；第 3 屏四个场景、第 4 屏四张卡的转述（卡原文是 AI 用“本人”写的，改成了第一人称）；第 6 屏“请我验证”“我回到电脑说一声”；第 9、10 屏“我清楚说出的喜好”“我删了原件”；第 11 屏两张亮点和例子、第 10 屏近况一条；第 15 屏“我纠正之后”；功能表里“问我的情况”“记下我的原话”“我没回不算认可”“给我看的分析”等。",
    "功能状态是 9 月 28 日资料开着时用真实资料复查的（Claude、Codex 会话记录里的命令调用，库里的原话、卡、引用和 ChatGPT 对话）：日常推荐、拿不准先问、导出成文件、该导出哪一段、别的项目有新结果吗、录音云复核 6 条恢复“在用”；手机装了什么、原件搬家改指向、每月一页汇总 3 条查清是“没用过”；只有搜索接力仍“说不准”；近况过期提醒仍“待验收”（近况卡 9/27 23:48 生成后还没有 AI 按“截至某日”作答过），亮点也仍不放它。依据写在各功能的 source。",
    "没有“现在”横条：这个项目自己没有计划任务（按名字、路径、命令搜过全部计划任务）。手机每小时上传靠 FolderSync（手机上），备份靠 PCConfig 的 PersonalDataReplica-Hot-Daily；如果驾驶舱想给它一格“来源静默”，要第 2 批接 status 的 source_freshness（见 batch2.md）。",
    "例子：本人 9/28 定的是例子可以是假设，页面不标“真实”。第 3 屏外卖、定位两段是假设的（“比如……”）；其余几处例子出自库里的原话和卡（黄油啤酒原话 142、推荐验收原话 9–14、不推荐酒原话 193、高刷原话 160、手机使用记录更正原话 241、退款凑单原话 18、四张卡 806、836、872、825），页面没写成“真实”。“付 1000、退 900，只记 100”是本人 9 月 19 日的原话（FY05）。",
    "第 6 屏写了“区域未知”这一行：高德区域查询只在 9 月 23 日跑过一次，之后的新地点在查询时会显示区域未知，技能说明里没写什么时候补跑（见 audit.md 第 1 条）。写的是现状，不是承诺会自动补。",
    "第 9 屏“GPT-6 Astra”照项目 AGENTS.md:44 写（gpt-6-astra）。",
    "“学习、整理照片、工作支持这些项目要用我的背景”（第 2 屏）：学习和个人媒体有真实回写记录；工作支持只有 1 次投递，说法较弱但成立。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/daily-preferences/page.json",
  "sha256": "d151c2946bef7e7f7da4e3daf111bfc5fa9cfa7dec25a5c7c10b2523b70c6fc4",
  "converted_at_beijing": "2026-10-31T08:33:23+08:00"
 }
}
---

::screen{#daily-preferences-01 section="top"}

```typeset
{
 "screen": {
  "id": "daily-preferences-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“个人理解库”，下面一行一句话（绿色、比正文大一号），再下面介绍段（“认识卡”三个字加粗）。右上一幅水彩插画：书桌上一只打开的木质卡片盒，里面竖着一排索引卡，每张卡顶上一个小绿色标签，卡面只画浅灰短线、不画字；几条细细的绿色虚线从卡片盒外飘进来，线头分别是一个聊天气泡、一只购物袋、一张小票、一个定位针、一部手机、一个游戏手柄、一个音符的小水彩图标；一支铅笔斜靠在最前面那张卡上，卡上一道短线被划掉、旁边写上了一道新的短线（表示更正，仍然只画线不画字）。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一叠索引卡、一个对话气泡、一摞小文件夹、一张卡片上带一个绕回来的箭头。介绍段和数字卡之间放一张浅绿底的横向小卡片（“比如”那段），左边一个小对话气泡图标，里面画一个小黄油啤酒杯。数字卡下方一行灰色小字“10 月 11 日查看”。最下面一行放一个白底细绿边的圆角按钮〔在整套系统里的位置 → 怎么协作〕。这个项目没有自己的自动任务，不画“现在”横条；私有仓库，不放 GitHub 按钮。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、“比如”小卡片、插画（缩成一整行宽）、四张数字卡改成两行两张、“10 月 11 日查看”一行、按钮单独一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#daily-preferences"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/daily-preferences/#ai-brief"
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
     "text_ref": "个人理解库",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero",
     "width": "48%"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次使用 10 月 24 日 02:15",
       "state": "ok"
      },
      {
       "text": "技能调用已记 11 次",
       "state": "fact"
      },
      {
       "text": "命令行调用另记 346 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用记录（10 月 5 日起，记到 10 月 9 日）",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "让 AI 了解",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "hero"
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "hero",
     "width": "52%"
    },
    {
     "type": "stat_card",
     "text_ref": "85张现",
     "align": "left",
     "size": "medium",
     "columns": 4,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "比如",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "85张现在生效的认识卡",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "none",
     "connector": "none"
    }
   ],
   "notes": "实看横原图：左上标题与一句话/介绍，右上卡片盒大插画；例子横卡贯通；4 张数字横卡内图在左、数字和说明在右。原图只有协作链接，定稿新加续作说明按钮须完整排入。统计四行实际解析为 para，当前 core.stat_card 只处理 stats，能保字但无法复原数字卡；需组件适配/样张。数字横卡的新变体未出现在批准样板，待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "个人理解库",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次使用 10 月 24 日 02:15",
       "state": "ok"
      },
      {
       "text": "技能调用已记 11 次",
       "state": "fact"
      },
      {
       "text": "命令行调用另记 346 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用记录（10 月 5 日起，记到 10 月 9 日）"
    },
    {
     "type": "stat_card",
     "text_ref": "85张现",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "top_inside",
     "connector": "none",
     "columns_v": 2,
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "让 AI 了解",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "比如",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "outside",
     "connector": "none"
    },
    {
     "type": "prose",
     "text_ref": "85张现在生效的认识卡",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    }
   ],
   "notes": "实看 v/v2：v 为标题、包含一句话与介绍的整宽卡、大插画；v2 从例子左图右字横卡开始，再 2×2 数字卡、截至与协作按钮。原竖图实际例子在大插画之后，按图落位。定稿新增第二按钮，依批准样板竖版单列。统计 para 节点适配及首段有边卡均待样张。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "76 张｜现在生效的认识卡",
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
   "source_phrase": "375 条｜记下的我的原话",
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
   "source_phrase": "36 万条｜原始记录，来自 30 类来源",
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
   "source_phrase": "282 次｜旧认识因来源或原话变了而退场复核",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-daily-preferences",
   "source_phrase": "右上一幅水彩插画：书桌上一只打开的木质卡片盒，里面竖着一排索引卡，每张卡顶上一个小绿色标签，卡面只画浅灰短线、不画字；几条细细的绿色虚线从卡片盒外飘进来，线头分别是一个聊天气泡、一只购物袋、一张小票、一个定位针、一部手机、一个游戏手柄、一个音符的小水彩图标；一支铅笔斜靠在最前面那张卡上，卡上一道短线被划掉、旁边写上了一道新的短线（表示更正，仍然只画线不画字）。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "书桌上一只打开的木质卡片盒，里面竖着一排索引卡，每张卡顶上一个小绿色标签，卡面只画浅灰短线、不画字；几条细细的绿色虚线从卡片盒外飘进来，线头分别是一个聊天气泡、一只购物袋、一张小票、一个定位针、一部手机、一个游戏手柄、一个音符的小水彩图标；一支铅笔斜靠在最前面那张卡上，卡上一道短线被划掉、旁边写上了一道新的短线（表示更正，仍然只画线不画字"
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
   "asset": "_library/titles/title-2c093b1f4da8de523a6a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2c093b1f4da8de523a6a",
   "title_text": "个人理解库",
   "sha256": "c15654139d5f7327273eac58db94631baaec16e4d6931b1ae5c07c6fa1b83972",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

个人理解库

让 AI 了解我的背景和偏好，说错了一纠正就改。

AI 每开一个新对话都不认识我。这个库把我的经历、眼下的处境、做事的取舍、说话的口吻，和吃喝、购物、出行、娱乐这些偏好，整理成一张张**认识卡**：每张有一句摘要、一段详述，挂着出处（我的原话或原始记录）。各个项目的 AI 要了解我时来这里读；我说哪里理解错了，当场改。订单、支付、银行流水、行程、手机和电脑使用这些原始记录另放一层，问到时现查，也用来推断我最近在忙什么。

**比如**：9 月 9 日我在 ChatGPT 里问自己爱喝什么，它经电脑 MCP 读了饮品卡作答。我让它详细说说，它把新加坡哈利波特体验里那杯黄油啤酒算成了喝酒的偏好；我回了一句纠正，提醒它黄油啤酒未必是啤酒。它当场把这句原话记进库里，饮品卡复核后改写：那杯只说明我喜欢黄油味，不拿来推断我喝酒。

**85 张**｜现在生效的认识卡
**552 条**｜记下的我的原话
**79.0 万条**｜原始记录，来自 34 类来源
**328 个**｜旧卡版本因来源或原话变了而退场复核
10 月 30 日只读数的（手机采集程序的使用事件已存到 10 月 21 日；各类来源截止日不同，这次没逐类重读）

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

::screen{#daily-preferences-02 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版画面：左上标题。下面 2×2 四张大圆角卡片，每张左上一幅小水彩插画、右边粗体小标题和一段字。插画：1 一个对话框旁边，一只手从卡片盒里抽出一张卡（卡面只画短线）；2 一个说话的气泡，气泡旁一张卡被轻轻翻到背面、盖上一个灰色小圆章（不画字）；3 一本台历翻到新的一页，旁边一个带循环箭头的小篮子装着聊天气泡、小票、定位针；4 三个小房子图标（代表别的项目）各伸出一条双向箭头连到中间的卡片盒。四张卡下面一行浅绿底小字，放技能页链接。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；四张卡一行一张，插画在卡片顶部；最下面一行链接。",
  "links": [
   {
    "text": "怎么协作",
    "href": "/how/#daily-preferences"
   },
   {
    "text": "记得我是谁（技能）",
    "href": "/skills/daily-preferences/"
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
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "问到我，AI 自己来查",
     "align": "left",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/共享节点.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "跟 AI 怎么说",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/人物.png"
     ]
    }
   ],
   "notes": "实看：横为 2×2 四卡，竖为四张整宽卡；两个方向的插画都在卡内左侧，非 portrait 描述的顶部。末尾整宽浅绿技能链接条，左侧小书图。notice 当前不消费插画字段，末条左图需样张/组件适配。整屏章节标题按追加标准居中。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "问到我，AI 自己来查",
     "align": "left",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/共享节点.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "跟 AI 怎么说",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/人物.png"
     ]
    }
   ],
   "notes": "实看：横为 2×2 四卡，竖为四张整宽卡；两个方向的插画都在卡内左侧，非 portrait 描述的顶部。末尾整宽浅绿技能链接条，左侧小书图。notice 当前不消费插画字段，末条左图需样张/组件适配。整屏章节标题按追加标准居中。",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "问到我，AI 自己来查 \n该学什么、今晚吃什么、这个方案适不适合我——只要答案取决于我是谁，AI先读相关认识卡的摘要，够了直接答；不够再读详述、原话和原始记录。不用点名这个库，也不用记命令。",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "我说一句，当场改 \nAI把原话记下，分清是补充、临时、更正还是撤回；更正立刻用在这次回答里。依赖旧说法的卡怎么退场，见亮点。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
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
   "source_phrase": "“要更新了”，大约每周一次 \n我说一声，AI把各来源拉新、读完、改卡，最后写一段“最近在做什么”，再告诉我对我的认识变了什么。",
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
   "asset": "_library/icons/共享节点.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "共享节点",
   "source_phrase": "别的项目也来读、来写 \n学习、整理照片、工作支持这些项目要用我的背景时来这里读，只取和手头这件事有关的几张卡；它们做事时发现我的新情况，也在同一个任务里写回来。谁和谁怎么配合见怎么协作。",
   "sha256": "2775e570150c9e576ad746098f9ad04499074a0b2baa88fffdfe6514b189dbdc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/人物.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "人物",
   "source_phrase": "跟AI怎么说、有哪些说法：记得我是谁（技能）",
   "sha256": "221ee5da99dd4bcd2d636a62584d34405663986eebdce306093f0944b39360be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/人物.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "人物",
   "source_phrase": "跟AI怎么说、有哪些说法：记得我是谁（技能）",
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
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "卡片索引",
   "source_phrase": "插画：1 一个对话框旁边，一只手从卡片盒里抽出一张卡（卡面只画短线）；2 一个说话的气泡，气泡旁一张卡被轻轻翻到背面、盖上一个灰色小圆章（不画字）；3 一本台历翻到新的一页，旁边一个带循环箭头的小篮子装着聊天气泡、小票、定位针；4 三个小房子图标（代表别的项目）各伸出一条双向箭头连到中间的卡片盒。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一个对话框旁边，一只手从卡片盒里抽出一张卡（卡面只画短线"
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
   "source_phrase": "插画：1 一个对话框旁边，一只手从卡片盒里抽出一张卡（卡面只画短线）；2 一个说话的气泡，气泡旁一张卡被轻轻翻到背面、盖上一个灰色小圆章（不画字）；3 一本台历翻到新的一页，旁边一个带循环箭头的小篮子装着聊天气泡、小票、定位针；4 三个小房子图标（代表别的项目）各伸出一条双向箭头连到中间的卡片盒。",
   "sha256": "4ffd11a1805d6fcd443e6d721ff92690ba8469f4bbdb231be34373895d4565ac",
   "status": "ready",
   "original_elements": [
    "一个说话的气泡，气泡旁一张卡被轻轻翻到背面、盖上一个灰色小圆章（不画字"
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
   "asset": "_library/illustrations/ill-12682716eb7b18.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "日历记录",
   "source_phrase": "插画：1 一个对话框旁边，一只手从卡片盒里抽出一张卡（卡面只画短线）；2 一个说话的气泡，气泡旁一张卡被轻轻翻到背面、盖上一个灰色小圆章（不画字）；3 一本台历翻到新的一页，旁边一个带循环箭头的小篮子装着聊天气泡、小票、定位针；4 三个小房子图标（代表别的项目）各伸出一条双向箭头连到中间的卡片盒。",
   "sha256": "f2bb549f0d3d498ab16f4cb19931375a02c28e596e518f3ba7363e45c2063e60",
   "status": "ready",
   "original_elements": [
    "一本台历翻到新的一页，旁边一个带循环箭头的小篮子装着聊天气泡、小票、定位针"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "卡片索引",
   "source_phrase": "插画：1 一个对话框旁边，一只手从卡片盒里抽出一张卡（卡面只画短线）；2 一个说话的气泡，气泡旁一张卡被轻轻翻到背面、盖上一个灰色小圆章（不画字）；3 一本台历翻到新的一页，旁边一个带循环箭头的小篮子装着聊天气泡、小票、定位针；4 三个小房子图标（代表别的项目）各伸出一条双向箭头连到中间的卡片盒。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "三个小房子图标（代表别的项目）各伸出一条双向箭头连到中间的卡片盒"
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
   "asset": "personal-health/personal-health-02-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8477921ac5c65e15db4b",
   "title_text": "平时怎么用",
   "sha256": "60c9e97a88acfcedd74e9fb83b6da164baa88d0d5f92d3774c43ec4726bce7e9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

平时怎么用

**问到我，AI 自己来查**
该学什么、今晚吃什么、这个方案适不适合我——只要答案取决于我是谁，AI 先读相关认识卡的摘要，够了直接答；不够再读详述、原话和原始记录。不用点名这个库，也不用记命令。

**我说一句，当场改**
AI 把原话记下，分清是补充、临时、更正还是撤回；更正立刻用在这次回答里。依赖旧说法的卡怎么退场，见亮点。

**“要更新了”，大约每周一次**
我说一声，AI 把各来源拉新、读完、改卡，最后写一段“最近在做什么”，再告诉我对我的认识变了什么。每月要手动导出的账单和记录，我只在 App 或网页里点一下导出，AI 自己从电脑下载目录、邮件附件或手机下载目录取回保全；手机上的那份核对无误后才删。

**别的项目也来读、来写**
学习、整理照片、工作支持这些项目要用我的背景时来这里读，只取和手头这件事有关的几张卡；它们做事时发现我的新情况，也在同一个任务里写回来。谁和谁怎么配合见〔怎么协作〕。

跟 AI 怎么说、有哪些说法：〔记得我是谁（技能）〕

::screen{#daily-preferences-03 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-03",
  "section": "usage",
  "title": "几个典型场景",
  "scene": "横版画面：左上标题。下面四张横排的竖长卡片，每张顶上一个白底圆角标签（粗体小标题），标签下面一幅小插画，再下面一段字；每张右下角一行灰色小字写日期。插画：1 一张外卖小票旁边一只小鸡汤碗和一杯拿铁，一个绿色小算盘（票上只画短线和一个“−”号）；2 一张三栏的菜单卡，三栏顶上分别是绿色、浅绿、黄绿的小圆点，栏里只画浅灰短线；旁边一只酒杯上画一个灰色小叉；3 一部手机屏幕上一个“60Hz”小标签，旁边一张截图卡片和一个放大镜；4 一张小地图上一大段虚线空白，两端各一个定位针，中间一个问号气泡变成一个绿色小勾。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；四张卡一行一张，每张里标签在上、插画在中、字在下。",
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
     "text_ref": "几个典型场景",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "外卖点了什么",
     "align": "left",
     "columns": 4,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/气泡.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png"
     ]
    }
   ],
   "notes": "实看横图：四张竖长卡均分整行，卡头小浅绿标签，下方插画，再下方正文；四卡顶齐。标签式卡头是批准样板外变体，待样张；不从 scene 补写未在定稿的日期。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "几个典型场景",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "外卖点了什么",
     "align": "left",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons/打勾清单.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "“这句话我当时怎么说的？”",
     "align": "left",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons-r2/气泡.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png"
     ]
    }
   ],
   "notes": "实看 v 为前两张卡：大卡头、插画、正文。替换 v2 为后两张整宽卡，仅大卡头与正文，没有插画；不补原横图的手机/地图插画。卡头浅绿标签与无插画续卡变体待样张。",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "外卖点了什么、花了多少 \n比如我问“这个夏天外卖都点了什么”：AI按外卖订单去重，没完成的单不算，列出最常点的几家和各点了几单。AI同时写明这只是外卖，在家吃的不在里面。花多少按实付扣成功退款：付1000、退900，只记100。",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "推荐吃什么、喝什么 \n9月1日我看过推荐后定下：不替我只选一个，熟悉稳妥、相邻新口味、大胆但合理的新尝试都要有，没有新尝试就不合格；每个候选比一句话再详细一档。9月14日我试过啤酒、红酒、白酒和一瓶荔枝味甜酒后说不喜欢酒精饮料，之后推荐默认不放酒。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons-r2/气泡.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "气泡",
   "source_phrase": "“这句话我当时怎么说的？” \n问到手机高刷，AI按编号取出原话：“我用了6年。感觉省电模式的60hz我觉得没有任何区别”，并注明它来自2025年12月保存的一张对话截图、说话时间不详。卡上的结论也就收在“手机省电模式下没感觉出差别”，不推到所有屏幕。",
   "sha256": "a58ff382f40a593b35aed5fb214cfba69d55f1157e3ea7db20331bee0b345d24",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹放大镜",
   "source_phrase": "定位断了，不瞎猜 \n比如手机好几周没留定位点：AI不编中间的行程，也不直接认定是软件坏了或我出了门；我说一句“其实就是没怎么动”，它记下这句当作事实，没点的技术原因单独待查。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/餐食.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "餐食",
   "source_phrase": "插画：1 一张外卖小票旁边一只小鸡汤碗和一杯拿铁，一个绿色小算盘（票上只画短线和一个“−”号）；2 一张三栏的菜单卡，三栏顶上分别是绿色、浅绿、黄绿的小圆点，栏里只画浅灰短线；旁边一只酒杯上画一个灰色小叉；3 一部手机屏幕上一个“60Hz”小标签，旁边一张截图卡片和一个放大镜；4 一张小地图上一大段虚线空白，两端各一个定位针，中间一个问号气泡变成一个绿色小勾。",
   "sha256": "373eaad494ca5d385bb6023a6158f59917739095371ca1e9e8a76d3ca1e87b64",
   "status": "ready",
   "original_elements": [
    "一张外卖小票旁边一只小鸡汤碗和一杯拿铁，一个绿色小算盘（票上只画短线和一个抽象图形号"
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
   "asset": "_library/illustrations/菜单卡.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "菜单卡",
   "source_phrase": "插画：1 一张外卖小票旁边一只小鸡汤碗和一杯拿铁，一个绿色小算盘（票上只画短线和一个“−”号）；2 一张三栏的菜单卡，三栏顶上分别是绿色、浅绿、黄绿的小圆点，栏里只画浅灰短线；旁边一只酒杯上画一个灰色小叉；3 一部手机屏幕上一个“60Hz”小标签，旁边一张截图卡片和一个放大镜；4 一张小地图上一大段虚线空白，两端各一个定位针，中间一个问号气泡变成一个绿色小勾。",
   "sha256": "892d9ee2be26b5b195b945e291b5e1b46a0640c044c360dd8540fcf867aeca52",
   "status": "ready",
   "original_elements": [
    "一张三栏的菜单卡，三栏顶上分别是绿色、浅绿、黄绿的小圆点，栏里只画浅灰短线；旁边一只酒杯上画一个灰色小叉"
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
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机照片现图小槽4比3",
   "source_phrase": "插画：1 一张外卖小票旁边一只小鸡汤碗和一杯拿铁，一个绿色小算盘（票上只画短线和一个“−”号）；2 一张三栏的菜单卡，三栏顶上分别是绿色、浅绿、黄绿的小圆点，栏里只画浅灰短线；旁边一只酒杯上画一个灰色小叉；3 一部手机屏幕上一个“60Hz”小标签，旁边一张截图卡片和一个放大镜；4 一张小地图上一大段虚线空白，两端各一个定位针，中间一个问号气泡变成一个绿色小勾。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "一部手机屏幕上一个抽象图形小标签，旁边一张截图卡片和一个放大镜"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-efc86be6e153919921f8.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "地图定位",
   "source_phrase": "插画：1 一张外卖小票旁边一只小鸡汤碗和一杯拿铁，一个绿色小算盘（票上只画短线和一个“−”号）；2 一张三栏的菜单卡，三栏顶上分别是绿色、浅绿、黄绿的小圆点，栏里只画浅灰短线；旁边一只酒杯上画一个灰色小叉；3 一部手机屏幕上一个“60Hz”小标签，旁边一张截图卡片和一个放大镜；4 一张小地图上一大段虚线空白，两端各一个定位针，中间一个问号气泡变成一个绿色小勾。",
   "sha256": "15e471af4ca157edb410cb0bea1e97937c52cc3f22a9fb052fd9396c8c59d844",
   "status": "ready",
   "original_elements": [
    "一张小地图上一大段虚线空白，两端各一个定位针，中间一个问号气泡变成一个绿色小勾"
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
   "asset": "_library/titles/title-7885d427a96e92ad6e4a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7885d427a96e92ad6e4a",
   "title_text": "几个典型场景",
   "sha256": "5c41b4cb70ec6a8fa844099076eca4dc966be4caca1c6eae0c2ab4a3ceb67eeb",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

几个典型场景

**外卖点了什么、花了多少**
比如我问“这个夏天外卖都点了什么”：AI 按外卖订单去重，没完成的单不算，列出最常点的几家和各点了几单。AI 同时写明这只是外卖，在家吃的不在里面。花多少按实付扣成功退款：付 1000、退 900，只记 100。

**推荐吃什么、喝什么**
9 月 1 日我看过推荐后定下：不替我只选一个，熟悉稳妥、相邻新口味、大胆但合理的新尝试都要有，没有新尝试就不合格；每个候选比一句话再详细一档。9 月 14 日我试过啤酒、红酒、白酒和一瓶荔枝味甜酒后说不喜欢酒精饮料，之后推荐默认不放酒。

**“这句话我当时怎么说的？”**
问到手机高刷，AI 按编号取出原话：“我用了6年。感觉省电模式的60hz我觉得没有任何区别”，并注明它来自 2025 年 12 月保存的一张对话截图、说话时间不详。卡上的结论也就收在“手机省电模式下没感觉出差别”，不推到所有屏幕。

**定位断了，不瞎猜**
比如手机好几周没留定位点：AI 不编中间的行程，也不直接认定是软件坏了或我出了门；我说一句“其实就是没怎么动”，它记下这句当作事实，没点的技术原因单独待查。

::screen{#daily-preferences-04 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-04",
  "section": "usage",
  "title": "几张认识卡",
  "scene": "横版画面：左上标题，旁边一行灰色小字“摘自 9 月 28 日的现行卡，原文较长，这里只摘摘要”。下面 2×2 四张索引卡样式的大卡片（米白卡纸、顶上一条绿色标签条），标签条上写卡名，右上角一个小徽章写“证据强度”；卡面是摘要正文；卡片底部一行灰色小字写“依据”。每张卡左上角一个小水彩图：一瓶苏打水和一杯拿铁；一袋牛肉脆片；一部手机；一座观景台和一片彩色湖水。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题和灰色小字；四张卡一行一张。",
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
     "text_ref": "几张认识卡",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "head",
     "width": "34%"
    },
    {
     "type": "prose",
     "text_ref": "摘自",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "head",
     "width": "66%"
    },
    {
     "type": "content_card",
     "text_ref": "主要饮品",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ],
     "row": "cards-0",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "零食：喜欢脆口，嫌贵",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ],
     "row": "cards-0",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "手机高刷新率",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ],
     "row": "cards-1",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "看风景和场馆",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ],
     "row": "cards-1",
     "width": "50%"
    }
   ],
   "notes": "实看替换横图：2×2 卡，每卡左图、右侧绿卡名条和证据徽章、摘要、底部灰依据。v 前两卡保留左图，v2 后两卡无插画；竖版卡名与证据徽章并排或自然折行，依据在底部浅绿条。四张卡名+证据均解析为 para，须同块收其摘要/依据，不能让三段各自变成卡。当前 core.content_card 对无 group 的 para 会形成一个匿名卡，保字但不生成卡头/证据徽章/依据条；这些变体是新样式，待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "几张认识卡",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "prose",
     "text_ref": "摘自",
     "align": "center",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "主要饮品",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "零食：喜欢脆口，嫌贵",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "手机高刷新率",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "看风景和场馆",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/绿叶装饰.png"
     ]
    }
   ],
   "notes": "实看替换横图：2×2 卡，每卡左图、右侧绿卡名条和证据徽章、摘要、底部灰依据。v 前两卡保留左图，v2 后两卡无插画；竖版卡名与证据徽章并排或自然折行，依据在底部浅绿条。四张卡名+证据均解析为 para，须同块收其摘要/依据，不能让三段各自变成卡。当前 core.content_card 对无 group 的 para 会形成一个匿名卡，保字但不生成卡头/证据徽章/依据条；这些变体是新样式，待样张。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "主要饮品｜证据：强",
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
   "source_phrase": "零食：喜欢脆口，嫌贵｜证据：明确说过",
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
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "手机高刷新率｜证据：中等",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "看风景和场馆｜证据：明确说过",
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
   "asset": "_library/titles/title-243f39ea53b149605fb2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-243f39ea53b149605fb2",
   "title_text": "几张认识卡",
   "sha256": "c913e6647f893660b7673fae9f855a4b6e41d9819eb175fb00cfe252ff81605a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

几张认识卡
摘自 9 月 28 日的现行卡，只摘摘要

**主要饮品**｜证据：强
农夫山泉苏打天然水（不是泛称的矿泉水）是长期熟悉的日常饮品；小黄油拿铁是 2025 年 12 月以来反复选的风味，常点特大杯。奶茶和黄油拿铁喜欢热的，或冰镇但不加冰块——不喜欢冰块化了冲淡、搅不匀。
依据：淘宝订单、外卖订单、我的原话

**零食：喜欢脆口，嫌贵**｜证据：明确说过
我说不集的牛肉脆片“味道不错。像薯片。但是太贵了”，想找好吃又便宜的替代。也买过一次鸡肉脆片，没评价过，只算试过的候选，还不算找到平替。
依据：我的原话、两条订单

**手机高刷新率**｜证据：中等
用了 6 年 120Hz 手机，切到省电模式的 60Hz 也感觉不到区别。判断手机屏幕值不值得多花钱，先看实际体验，不默认高刷一定值得。
依据：一张对话截图里的原话

**看风景和场馆**｜证据：明确说过
喜欢高空观景，喜欢九寨沟那种“绿加别的颜色”；对历史有些兴趣，艺术和天文说不好谁更喜欢。展品好不好看、人多不多、能不能看懂会影响体验。九寨沟只是 8 月讨论过的候选，没有去过的证据。
依据：香港、新加坡、上海的实际游览和我的评价

::screen{#daily-preferences-05 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-05",
  "section": "usage",
  "title": "说“要更新了”之后",
  "scene": "横版画面：左上标题。一条从左到右、分两行的流程图，七个节点，每个节点一个小水彩图标、粗体小标题、两三行小字，节点之间绿色箭头。图标：1 一排小信号灯，其中一盏亮黄灯；2 一只手机、一朵云、一个浏览器窗口、一个文件袋朝同一个方向汇过来；3 一个带锁的抽屉；4 一副眼镜压在一叠纸上；5 一张卡被铅笔改写；6 一本小日历上画着一个绿色的圈；7 一个对话气泡。流程图下方一行浅灰底小字（最后两段）。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；七个节点从上到下排成一列，箭头朝下；最后两段小字在底部。",
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
     "text_ref": "说“要更新了”之后",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "flow",
     "text_ref": "1先看谁停了",
     "align": "left",
     "columns": 4,
     "illustration": "top_inside",
     "connector": "arrow",
     "direction": "horizontal",
     "icons": "auto",
     "text_layout": "inline"
    },
    {
     "type": "notice",
     "text_ref": "不限定来源时",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    }
   ],
   "notes": "实看：横为上4下3节点，第二排三节点各占1/3，箭头只在同排节点间；纵为向下7节点。v 的1–3有左侧插画，v2 的4–7没有插画；每项小标题浅绿底。7步是一个 steps 节点，text_ref 含编号只能定位第一项，不能用4.读拆块；现有 flow 仅整组插画模式，不能表达前三项有图/后四项无图。底部两段提示横图左右并列、竖图上下分条；两段各是 para，可由 notice 完整消费，灰提示新变体待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "说“要更新了”之后",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "flow",
     "text_ref": "1先看谁停了",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "arrow",
     "direction": "vertical",
     "icons": "auto",
     "text_layout": "inline"
    },
    {
     "type": "notice",
     "text_ref": "不限定来源时",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    }
   ],
   "notes": "实看：横为上4下3节点，第二排三节点各占1/3，箭头只在同排节点间；纵为向下7节点。v 的1–3有左侧插画，v2 的4–7没有插画；每项小标题浅绿底。7步是一个 steps 节点，text_ref 含编号只能定位第一项，不能用4.读拆块；现有 flow 仅整组插画模式，不能表达前三项有图/后四项无图。底部两段提示横图左右并列、竖图上下分条；两段各是 para，可由 notice 完整消费，灰提示新变体待样张。",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "先看谁停了：30 类来源各有应有的节奏——定位每小时、短信每天、支付宝每月、网易云每半年。超期的标“静默”：停了的几个手动导出来源并成一个问题，一次问我，写清要哪份、从哪天开始重叠；自动来源停了，有我的说明就按说明，没有就照实报，不认定是故障，也不认定我没活动。",
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
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "拉新：手机上传的直接读；Gmail、Tasks 走已有的 Google 连接；B站、京东、美团、饿了么、12306 在我已登录的 Chrome 里只读采集；ChatGPT、支付宝这类，我导出后交给它。",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "导入：原件先挪进 E:\\PersonalData 下的来源投递区保全（这个目录每天有备份），按内容指纹去重，默认增量导入。",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "读：导入会列出这次新增、改动了哪些记录，AI 按编号去读；ChatGPT 只读有新消息的对话，微信只读每个会话新的一段。",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "改卡：新材料影响哪张卡就改哪段；因来源变化退场的卡，复核后重写。",
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
   "source_phrase": "写近况：最后重写“最近在做什么”（怎么过期见“为什么这样设计”）。",
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
   "source_phrase": "汇报：告诉我认识新增、更正、增强、减弱了什么，依据是什么，哪里还拿不准。只报“导入了多少条”不算完。",
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
   "asset": "_library/titles/title-df0c10ae3a402242dda6.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-df0c10ae3a402242dda6",
   "title_text": "说“要更新了”之后",
   "sha256": "a1458622500da15cdf0d116267bb710ba7d5eba0e36ebc02288ee14e87b3bc88",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

说“要更新了”之后

1. **先看谁停了**：34 类来源各有应有的节奏——定位每小时、短信每天、支付宝每月、网易云每半年。每类来源算到哪天，按材料自己的观察时间算：重新导入同一份旧文件、或者只是刚刷新过，都不会把截止日往后推。Chrome、B站、Steam、电脑软件清单和京东、美团、饿了么是“按需来源”，用到时才采，过了参考节奏只单列成“按需来源（用时才采，不算静默）”，不催我；其余来源超期才标“静默”：停了的几个手动导出来源并成一个问题，一次问我，写清要哪份、从哪天开始重叠；自动来源停了，有我的说明就按说明，没有就照实报，不认定是故障，也不认定我没活动。
2. **拉新**：手机日志在家时由电脑经无线调试（无线 adb）直接收到本地，直接读；不在家时手机先存着，回家后补收；Gmail 走已有的 Google 连接（Google Tasks 10 月 21 日起不再采，旧记录照样能查，任务安排改看驾驶舱）；车票、改签和退票由 AI 按需读取 Gmail 中的 12306 邮件；B站、京东、美团、饿了么 在我已登录的 Chrome 里只读采集（B站在后台开一个接口 JSON 页来读，采完就关，不再开普通历史页，免得页面一直加载把采集卡住）；每月的人工快照我只管点导出，AI 自己取回：淘宝从电脑下载目录拿，支付宝流水证明从 Gmail 附件下，ChatGPT 从导出邮件下载，微信支付账单和滴滴导出从手机下载目录取回，两端 SHA-256 对上才删手机里的副本；招行储蓄卡流水按年取一次基线、以后按月取。
3. **导入**：原件先挪进 E:\PersonalData 下的来源投递区保全（这个目录每天有备份），按内容指纹去重，默认增量导入；手机备份里已经用同一版解析器导过的原件不再重扫，短信、通话仍会把每份内容不同的备份都看一遍，免得漏掉新备份里已经删掉的旧记录，和同一台设备更新备份里一模一样的条目不再重复解析。导入后顺手查一遍重复扣款，有才提醒我（同一订单在钱包和信用卡各记一次、分期、预授权、退款冲正都不算重复）。
4. **读**：导入会列出这次新增、改动了哪些记录，AI 按编号去读；ChatGPT 只读有新消息的对话，微信只读每个会话新的一段。
5. **改卡**：新材料影响哪张卡就改哪段；因来源变化退场的卡，复核后重写。
6. **写近况**：最后重写“最近在做什么”（怎么过期见“为什么这样设计”）。判断近况新不新，也按材料自己的观察时间，不按这次刷新的时间。
7. **汇报**：告诉我认识新增、更正、增强、减弱了什么，依据是什么，哪里还拿不准。只报“导入了多少条”不算完。每个来源采完、导完就单独留一份回执，写明各自和整轮花了多少秒。

不限定来源时，还会把其他在用的个人项目（照片、材料、学习、健康等）的新变化一起查一遍，逐项说处理了、没变化还是缺材料。
只到了一个导出包、或手机刚接上时，只做导入和阅读，不重写近况。

::screen{#daily-preferences-06 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-06",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。左边三分之二是一张两列表格（左列“情况”、右列“它怎么办”），七行，每行左边一个小图标（锁、暂停的信号灯、手机带感叹号、倒转的箭头、搬家的纸箱、问号定位针、裂开的数据库圆柱）。右边三分之一一幅水彩插画：一个带锁的抽屉柜（代表数据库），旁边一条绿色箭头指向另一块硬盘，硬盘上贴一张小日历标着一个圈；插画里不写字。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；表格改成一行一张小卡片，每张上面“情况”加粗、下面“它怎么办”；插画缩小放在最下面。",
  "links": [
   {
    "text": "约法 L18",
    "href": "/rules/charter/#L18"
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
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "table",
     "text_ref": "情况",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "target_height": 230,
     "target_width": 465
    }
   ],
   "notes": "实看替换横图：左约68%两列表7行，首列图标与情况，右列正文，右约32%数据库抽屉→备份硬盘插画。表格整个节点起点为情况。现有 table 未使用 icons/illustration，行图标需适配；表格外观未在批准样板，待样张。；blank-audit：撤无效固定高、图文顺序整宽及末行卡填满，截图沿完整图比例；定稿不改。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "table",
     "text_ref": "情况",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "outside",
     "connector": "none"
    }
   ],
   "notes": "实看 v 为表前4行整宽卡，卡内左图右文字，情况与它怎么办分别浅绿卡头；第4行后放数据库备份插画。v2 为后3行纯文字卡，无插画。全表只有一个 table 节点，当前 blocks 不能在第4行之后插入独立 illustration；草稿插画块先放全表后，准确位置由本 notes 指明，尚不能表达原图。现有 table 也未实现前4行图标/后3行无图与每字段浅绿卡头，待组件样张。",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "锁",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
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
   "source_phrase": "暂停的信号灯",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机带感叹号",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
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
   "source_phrase": "倒转的箭头",
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
   "source_phrase": "搬家的纸箱",
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
   "asset": "_library/hires-icons-r2/icon-clean-efc86be6e153919921f8.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "地图定位",
   "source_phrase": "问号定位针",
   "sha256": "d5f6c48bfe0e0fd7dc64c01839a98a5065656cccc64f8b997bfeab91cff020a8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
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
   "source_phrase": "右边三分之一一幅水彩插画：一个带锁的抽屉柜（代表数据库），旁边一条绿色箭头指向另一块硬盘，硬盘上贴一张小日历标着一个圈；插画里不写字。",
   "sha256": "3bc7ab81fe67babd0f71db9d6da0e720473458604b0ffe325e38006d94879cd9",
   "status": "ready",
   "original_elements": [
    "一个带锁的抽屉柜（代表数据库），旁边一条绿色箭头指向另一块硬盘，硬盘上贴一张小日历标着一个圈；插画里不写字"
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

| 情况 | 它怎么办 |
|---|---|
| 个人资料锁着（密码中心管的开关，锁着时任何 AI 都不能读我的私人资料） | 不读库，也不换个来源绕过去；请我验证一次再接着做（〔约法 L18〕） |
| 某个来源好几天没新数据 | 按需来源（Chrome、B站、Steam、电脑软件清单、京东、美团、饿了么）用到才采，超期只列为“按需来源”，不算静默、不催；其余来源有我的说明就按说明，没有就照实报“静默”，不认定是故障，也不认定我没活动 |
| 手机上的 AI 调命令失败 | 说清哪一步失败、已经做完什么；我回到电脑说一声，从断点接着做，不重来 |
| 一次 B站导入把记录退回了旧版本 | 修复命令先只读出方案，核对方案指纹、备份数据库后才执行；9 月 26 日用过一次 |
| 从手机取回导出的账单文件 | 手机和电脑两边的 SHA-256 对上才删手机上的副本；对不上就不删，照实告诉我卡在哪 |
| 储蓄卡和支付宝、微信钱包里像是同一笔钱 | 能明确对上的只算一次；对不上或有几种可能时分开列出，不硬合并；导入后发现可能的重复扣款才提醒我 |
| 原件换了位置 | 核对大小和 SHA-256 后改指向，记录编号和卡都不变，不重新导入 |
| 新去的地方显示“区域未知” | 区域名来自高德接口查过的缓存，最近一次在 10 月 7 日更新；之后的新地方还不会自动补，需要时让 AI 经密码中心再跑一次查询 |
| 数据库坏了 | 数据只有一个 SQLite 库；〔电脑配置与恢复〕每天 17:10（北京时间） 把 E:\PersonalData 同步到 G 盘，删掉的留 30 天。给 AI 读的首页和完整详档随时能从库重建 |

::screen{#daily-preferences-07 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-07",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：一张从上到下的架构图，占画面左边三分之二：最上一排“来源原件”小图标（手机、云、电脑、浏览器、文件袋），箭头向下到“导入”方框，再向下到一个大的数据库圆柱（圆柱上分四格写那四行），圆柱右侧伸出两张纸（两份视图），再向下到一排查询入口的小胶囊（每个胶囊一个命令名和中文），最下面是 Codex 和 Claude 的标志，旁边一部手机和一朵云用虚线经一台电脑连过来。整张架构图外面围一圈淡绿色虚线框，框的左上角一个小锁图标，旁边写“每一次读都先过资料锁”那段。右边三分之一放“写入口”和最后一段说明，用两张小卡片。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；架构图照原样从上到下，宽度占满；“写入口”“资料锁”“说明”三张小卡片依次排在下面。",
  "links": [
   {
    "text": "电脑远程控制",
    "href": "/projects/remote-control/"
   },
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
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "topology",
     "text_ref": "来源原件",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "layout": "graph",
     "columns_v": 1,
     "graph_nodes": [
      {
       "id": "source",
       "count": 2,
       "row": 1,
       "column": 1,
       "row_v": 1,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
      },
      {
       "id": "import",
       "count": 2,
       "row": 2,
       "column": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/icons/笔记本电脑.png"
      },
      {
       "id": "database",
       "count": 6,
       "row": 1,
       "column": 2,
       "row_v": 3,
       "column_v": 1,
       "icon": "_library/hires-icons/数据库.png",
       "row_span": 2
      },
      {
       "id": "views",
       "count": 2,
       "row": 1,
       "column": 3,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png"
      },
      {
       "id": "query",
       "count": 2,
       "row": 2,
       "column": 3,
       "row_v": 5,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png"
      }
     ],
     "edges": [
      {
       "from": "source",
       "to": "import",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "import",
       "to": "database",
       "from_side": "right",
       "to_side": "left"
      },
      {
       "from": "database",
       "to": "views",
       "from_side": "right",
       "to_side": "left"
      },
      {
       "from": "views",
       "to": "query",
       "from_side": "bottom",
       "to_side": "top"
      }
     ]
    },
    {
     "type": "content_card",
     "text_ref": "写入口",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "row": "architecture-footer",
     "width": "33.333%"
    },
    {
     "type": "content_card",
     "text_ref": "每一次读都先过资料锁",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "row": "architecture-footer",
     "width": "33.333%"
    },
    {
     "type": "content_card",
     "text_ref": "Python 标准库为主",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "row": "architecture-footer",
     "width": "33.333%"
    }
   ],
   "notes": "实看替换横图：左70%标题和架构，右30%三张纵卡；左主图绿色虚线框，来源横排5图→内容指纹条→导入条→数据库四行；数据库右伸两张视图纸；下接7个查询胶囊，再接手机云端经电脑至Codex/Claude的虚线链。右卡依次写入口、资料锁、技术说明且上图下字。定稿架构14个节点按 layers 的2/2/5/2/3消费，保留原文↓/→，不再增程序箭头。当前 topology 的单列分层卡不能表达数据库圆柱、侧伸视图、7胶囊和虚线终端链，也未给合格无字专用底图；这是新架构样式，待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。",
   "fix_notes": "按 qa-11 第1、2项将14个原文单元按2/2/6/2/2分成来源、导入、数据库、视图、查询5节点；横三列、竖单列、卡内小图。原箭头文字仍在所属节点，不生成纯箭头独立卡；侧卡改至下方。原文无改动，待独立视觉复查。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么搭的",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "topology",
     "text_ref": "来源原件",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "layout": "graph",
     "columns_v": 1,
     "graph_nodes": [
      {
       "id": "source",
       "count": 2,
       "row": 1,
       "column": 1,
       "row_v": 1,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
      },
      {
       "id": "import",
       "count": 2,
       "row": 1,
       "column": 2,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/icons/笔记本电脑.png"
      },
      {
       "id": "database",
       "count": 6,
       "row": 1,
       "column": 3,
       "row_v": 3,
       "column_v": 1,
       "icon": "_library/hires-icons/数据库.png"
      },
      {
       "id": "views",
       "count": 2,
       "row": 2,
       "column": 1,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png"
      },
      {
       "id": "query",
       "count": 2,
       "row": 2,
       "column": 2,
       "row_v": 5,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png"
      }
     ],
     "edges": [
      {
       "from": "source",
       "to": "import",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "import",
       "to": "database",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "database",
       "to": "views",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "views",
       "to": "query",
       "from_side": "bottom",
       "to_side": "top"
      }
     ]
    },
    {
     "type": "content_card",
     "text_ref": "写入口",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "每一次读都先过资料锁",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "Python 标准库为主",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none"
    }
   ],
   "notes": "实看 v：顶端它是怎么搭的为卡内普通小标题，非毛笔大标题；来源卡、指纹卡、导入卡、数据库卡、写入后重建条、两份视图卡按向下链。v2 查询入口及调用说明一张卡，然后写入口、资料锁、技术说明三张纯文字卡。当前 chapter_title 用 small/medium 仅记录目标但仍会找毛笔图，不能复原卡内小标题；topology 分层未能正确合并数据库内容及浅绿卡头与视图图标，需样张，不报还原完成。 页代理复核：原竖图为卡内小标题，最终用section_heading的小档表达，避免chapter_title误用毛笔大标题。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。",
   "fix_notes": "按 qa-11 第1、2项将14个原文单元按2/2/6/2/2分成来源、导入、数据库、视图、查询5节点；横三列、竖单列、卡内小图。原箭头文字仍在所属节点，不生成纯箭头独立卡；侧卡改至下方。原文无改动，待独立视觉复查。"
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
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
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "电脑",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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
   "source_phrase": "浏览器",
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
   "asset": "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "白纸",
   "source_phrase": "文件袋",
   "sha256": "e010ca7001948622ae4e18db3eea512568d933314d2ef2a8d4249bdb31d7d41e",
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
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "来源原件：30类，手机自动上传、已连接的账号、本机、已登录的网页、我手动导出\n↓原件先放进来源投递区，按内容指纹（SHA-256）认出同一份\n导入：每类来源一个解析器（当前v0.18.1），默认增量\n↓\n一个SQLite库\n原始记录359,694条，带FTS5全文检索\n我的原话375条\n认识卡76张现行，历史版本917个\n证据关联：支持42,860条、语境12,731条、反例249条\n↓每次写入后，在同一把数据库锁里重建\n两份视图：CURRENT.md，给AI的首页，核心画像在最前（约76KB）；PROFILE.md，完整详档（约1.1MB）\n↓\n查询入口：profile认识卡evidence带依据回答facts、original查记录和原件spending花钱activity设备使用mobility行踪recent-activity近况材料\n→Codex、Claude直接调；手机和云端经电脑远程控制的电脑MCP调同一套命令",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "来源原件：30类，手机自动上传、已连接的账号、本机、已登录的网页、我手动导出\n↓原件先放进来源投递区，按内容指纹（SHA-256）认出同一份\n导入：每类来源一个解析器（当前v0.18.1），默认增量\n↓\n一个SQLite库\n原始记录359,694条，带FTS5全文检索\n我的原话375条\n认识卡76张现行，历史版本917个\n证据关联：支持42,860条、语境12,731条、反例249条\n↓每次写入后，在同一把数据库锁里重建\n两份视图：CURRENT.md，给AI的首页，核心画像在最前（约76KB）；PROFILE.md，完整详档（约1.1MB）\n↓\n查询入口：profile认识卡evidence带依据回答facts、original查记录和原件spending花钱activity设备使用mobility行踪recent-activity近况材料\n→Codex、Claude直接调；手机和云端经电脑远程控制的电脑MCP调同一套命令",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "来源原件：30类，手机自动上传、已连接的账号、本机、已登录的网页、我手动导出\n↓原件先放进来源投递区，按内容指纹（SHA-256）认出同一份\n导入：每类来源一个解析器（当前v0.18.1），默认增量\n↓\n一个SQLite库\n原始记录359,694条，带FTS5全文检索\n我的原话375条\n认识卡76张现行，历史版本917个\n证据关联：支持42,860条、语境12,731条、反例249条\n↓每次写入后，在同一把数据库锁里重建\n两份视图：CURRENT.md，给AI的首页，核心画像在最前（约76KB）；PROFILE.md，完整详档（约1.1MB）\n↓\n查询入口：profile认识卡evidence带依据回答facts、original查记录和原件spending花钱activity设备使用mobility行踪recent-activity近况材料\n→Codex、Claude直接调；手机和云端经电脑远程控制的电脑MCP调同一套命令",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "来源原件：30类，手机自动上传、已连接的账号、本机、已登录的网页、我手动导出\n↓原件先放进来源投递区，按内容指纹（SHA-256）认出同一份\n导入：每类来源一个解析器（当前v0.18.1），默认增量\n↓\n一个SQLite库\n原始记录359,694条，带FTS5全文检索\n我的原话375条\n认识卡76张现行，历史版本917个\n证据关联：支持42,860条、语境12,731条、反例249条\n↓每次写入后，在同一把数据库锁里重建\n两份视图：CURRENT.md，给AI的首页，核心画像在最前（约76KB）；PROFILE.md，完整详档（约1.1MB）\n↓\n查询入口：profile认识卡evidence带依据回答facts、original查记录和原件spending花钱activity设备使用mobility行踪recent-activity近况材料\n→Codex、Claude直接调；手机和云端经电脑远程控制的电脑MCP调同一套命令",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "来源原件：30类，手机自动上传、已连接的账号、本机、已登录的网页、我手动导出\n↓原件先放进来源投递区，按内容指纹（SHA-256）认出同一份\n导入：每类来源一个解析器（当前v0.18.1），默认增量\n↓\n一个SQLite库\n原始记录359,694条，带FTS5全文检索\n我的原话375条\n认识卡76张现行，历史版本917个\n证据关联：支持42,860条、语境12,731条、反例249条\n↓每次写入后，在同一把数据库锁里重建\n两份视图：CURRENT.md，给AI的首页，核心画像在最前（约76KB）；PROFILE.md，完整详档（约1.1MB）\n↓\n查询入口：profile认识卡evidence带依据回答facts、original查记录和原件spending花钱activity设备使用mobility行踪recent-activity近况材料\n→Codex、Claude直接调；手机和云端经电脑远程控制的电脑MCP调同一套命令",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "来源原件：30类，手机自动上传、已连接的账号、本机、已登录的网页、我手动导出\n↓原件先放进来源投递区，按内容指纹（SHA-256）认出同一份\n导入：每类来源一个解析器（当前v0.18.1），默认增量\n↓\n一个SQLite库\n原始记录359,694条，带FTS5全文检索\n我的原话375条\n认识卡76张现行，历史版本917个\n证据关联：支持42,860条、语境12,731条、反例249条\n↓每次写入后，在同一把数据库锁里重建\n两份视图：CURRENT.md，给AI的首页，核心画像在最前（约76KB）；PROFILE.md，完整详档（约1.1MB）\n↓\n查询入口：profile认识卡evidence带依据回答facts、original查记录和原件spending花钱activity设备使用mobility行踪recent-activity近况材料\n→Codex、Claude直接调；手机和云端经电脑远程控制的电脑MCP调同一套命令",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h"
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

**来源原件**：34 类，手机日志（在家时电脑经无线 adb 收到本地）、已连接的账号、本机、已登录的网页、我点导出后 AI 取回的人工快照
↓ 原件先放进来源投递区，按内容指纹（SHA-256）认出同一份
**导入**：每类来源一个解析器（当前 v0.19.6），默认增量
↓
**一个 SQLite 库**
原始记录 788,456 条，带 FTS5 全文检索
我的原话 541 条（现行 152 条）
认识卡 85 张现行，另有 1,166 个旧版本（不是现行卡）
证据关联：支持 56,250 条、语境 17,437 条、反例 294 条（以上为 10 月 30 日只读数；手机采集程序的使用事件已存到 10 月 29 日，其余来源各有截止）
↓ 每次写入后，在同一把数据库锁里重建
**两份视图**：CURRENT.md，给 AI 的首页，核心画像在最前（约 106.0 KB）；PROFILE.md，完整详档（约 1.5 MB）
↓
**查询入口**：profile 认识卡｜evidence 带依据回答｜facts、original 查记录和原件（通话可按号码和北京时间段查）｜spending 花钱（储蓄卡和钱包对账，还款不算消费）｜activity 设备使用｜mobility 行踪｜recent-activity 近况材料
→ Codex、Claude 直接调；手机和云端经〔电脑远程控制〕的电脑 MCP 调同一套命令

**写入口**：record 记原话；snapshot、snapshot-batch 写卡，带投递编号、来源项目、出处和读到的版本号

**每一次读都先过资料锁**：只看技术状态时不打开库；要读认识卡、记录或原件，命令在内部统一检查全机共用的那一段解锁期，不再要求调用时声明读哪一档（旧的等级参数照样接收，但绕不过锁），锁着就拒绝。锁由〔密码中心〕管。

Python 标准库为主（信用卡 PDF 用 pypdf），网页采集用 JavaScript；没有向量库、第二个数据库或后台服务。

::screen{#daily-preferences-08 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-08",
  "section": "tech",
  "title": "材料从哪来（33 类）",
  "scene": "横版画面：左上标题。主体是一张三列表格（怎么进来｜来源和条数｜应有节奏），七行，每行最左边一个小水彩图标（手机、Google 的彩色 G 标志、笔记本电脑、Chrome 标志、文件袋、放大镜压着一页纸）；“来源和条数”一格里各来源之间用细竖线隔开，数字用绿色。表格下面两行小字。右上角一小幅插画：几条溪流从不同方向汇入一个小水池（不画字）。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；表格改成一行一张卡片：卡片顶上是图标和“怎么进来”，中间逐条列来源和条数（一行一个），底部一行“应有节奏”；两行小字放在最后。",
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
     "text_ref": "材料从哪来（34类）",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "head",
     "width": "56%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "head",
     "width": "44%"
    },
    {
     "type": "table",
     "text_ref": "怎么进来",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "条数是",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "prose",
     "text_ref": "明确不接4类",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    }
   ],
   "notes": "实看替换横图：左标题右浅溪汇流插画；三列表6行整宽，首列行图标，来源和数字在中列，节奏在右列，数字绿；底部两段小字。中列各来源之间保留定稿分隔的语义，不画排版用｜。table 当前未消费行图标/数字绿/原列宽，须组件样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "材料从哪来（34类）",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "table",
     "text_ref": "怎么进来",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    },
    {
     "type": "prose",
     "text_ref": "条数是",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "prose",
     "text_ref": "明确不接4类",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    }
   ],
   "notes": "实看 v 首3行卡，左大插画，右栏依次怎么进来/来源和条数/应有节奏三条浅绿卡头，来源数字逐条竖排；v2 后3行纯文字整宽卡且无插画，末尾两说明框。没有横图溪流插画。单 table 节点无法用 text_ref 分成前三行有图/后三行无图；行内数字与各段卡头未由当前 table 复现，新样式待样张。",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-a86c56270f7fd4b82920.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Google标志",
   "source_phrase": "Google 的彩色 G 标志",
   "sha256": "b2c5eb25686b4d888e1f384affd927ebef3b0f641d7ce74c9518a02c3933485f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "笔记本电脑",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Chrome标志",
   "source_phrase": "Chrome 标志",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "白纸",
   "source_phrase": "文件袋",
   "sha256": "e010ca7001948622ae4e18db3eea512568d933314d2ef2a8d4249bdb31d7d41e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜压着一页纸",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/水流汇合.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "水流汇合",
   "source_phrase": "右上角一小幅插画：几条溪流从不同方向汇入一个小水池（不画字）。",
   "sha256": "101a6e8234c72d6ea3180ef0a1c34e92a9e0710fed25c6f164d6b71d5e786926",
   "status": "ready",
   "original_elements": [
    "几条溪流从不同方向汇入一个小水池（不画字"
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
   "asset": "_library/titles/title-06df90208ea84033456a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-06df90208ea84033456a",
   "title_text": "材料从哪来（30 类）",
   "sha256": "2b4325fef6bc3907ec642c315639e6b96b3ef742bac2aa21796bf958a42a0d3b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

材料从哪来（34 类）

| 怎么进来 | 来源和条数 | 应有节奏 |
|---|---|---|
| 手机日志（在家时电脑经无线调试直接收到本地；不在家时手机先存着，回家后补收。原来 FolderSync 每小时传到云盘的那个目录已停更，只作历史副本。手机采集程序 Collector 记下的定位按真实定位时间和自己的来源身份导入） | 手机使用事件 381,916（手机采集程序 Collector，9 月 27 日起，已存到 10 月 29 日）｜短信 17,586｜通话 15,771｜亮屏解锁 9,801｜定位 5,736｜安装记录和已装应用清单 1,189（10 月 7 日那份清单是 803 个应用；之后有没有更新的清单这次没重读）｜安装卸载 416｜采集运行记录 1490 | 定位、亮屏每小时；短信、通话、手机使用每天（离家期间到家后一并补收） |
| 已退役，只留旧记录 | 应用使用 109,118（AppUsage：手机后台全放开也会被系统停掉，所有时期的时长都不可信；10 月 8 日退役，不再采） | 不再更新 |
| Google 账号 | Gmail 5,861（走已有的 Google 连接；招行“每日信用管家”邮件另派生信用卡交易和额度观察）｜Keep 5（在 Chrome 里读）｜Tasks 12（10 月 21 日起停采，任务安排改看驾驶舱，只留旧记录） | Gmail、Keep 每天；Tasks 不再更新 |
| 本机直接读 | Chrome 浏览记录 137,496｜Steam 游戏 160、商店信息 132｜电脑软件 779｜电脑使用 109（来自〔电脑使用与性能记录〕） | 按需，参考每周（超期不算静默）；电脑使用随查随读 |
| 在我已登录的 Chrome 里采集 | B站 8,474｜饿了么 1,418｜京东 177｜美团 25 | 按需，参考 B站每周、其余每月（超期不算静默） |
| 铁路历史快照与邮件 | 12306 9（既有快照记录保留查询与重解析）；车票、改签和退票由 AI 按需读取 Gmail 中的 12306 邮件 | 按需读邮件，不单独网页采集 |
| 我点导出，AI 取回（淘宝在电脑下载目录，支付宝流水证明经 Gmail 附件，ChatGPT 从导出邮件下载，微信支付账单和滴滴导出从手机下载目录取回，两端 SHA-256 对上才删手机副本） | ChatGPT、Gemini 对话 63,400｜支付宝 18,873｜淘宝 2,237｜微信支付 1,791｜信用卡账单 1,618｜招行储蓄卡流水 572（10 月 21 日接入；10 月 22 日 07:35 只读计数）｜Google Play 546｜网易云喜欢 199｜滴滴 224｜航旅纵横 8 | 每月；储蓄卡按年取一次基线、以后按月；航旅纵横每季度，网易云每半年 |
| 读过的外部原文 | 微信原文、录音转写片段、附件 1,299 | 随阅读 |

条数是 10 月 30 日只读数到的现行记录，合计 788,456 条（另有通用订单 9 条，没单列）；这是库里已存的数，不是当天新采的，各来源截止日不同（手机采集程序的使用事件已存到 10 月 29 日）。每个来源的截止日按材料自己的观察时间算，重新导入或刷新不会把旧材料的截止日推到今天。微信聊天不整库导入：按会话读新消息，有用的原文存成“已核对引用”。
明确不接 4 类：YouTube、Google Maps（我很少用）；拼多多订单、菜鸟物流（10 月 7 日我选了不接，不再补包）。另有 Google Tasks 10 月 21 日起停采，旧记录保留。银行流水 10 月 7 日也选过不接，10 月 21 日起改为接入招行储蓄卡：分本人操作、还款借贷、收入、退款、消费五类，只有消费进花钱合计，信用卡还款和转到自己钱包都不算消费。

::screen{#daily-preferences-09 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-09",
  "section": "tech",
  "title": "材料怎么变成认识",
  "scene": "横版画面：左上标题。左半边一幅竖向的三层示意图：最下层一叠小票、定位针、聊天气泡（原始记录），中层一个说话的气泡（我的原话），最上层一张索引卡（认识卡）；卡片背面伸出三种颜色的细线连回下面：绿线（支持）、灰线（语境）、橙线（反例），线旁各一个小色块图例。右半边两张卡片：上面“几条判断规矩”（带小圆点的列表），下面“谁来写”（画 Claude 和 ChatGPT 的小标志）。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；三层示意图在上（宽度占满），“几条判断规矩”一张卡、“谁来写”一张卡依次在下。",
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
     "text_ref": "材料怎么变成认识",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "topology",
     "text_ref": "三层分开放",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "layout": "layers",
     "layers": [
      {
       "count": 2,
       "columns": 1
      }
     ],
     "icons": [
      "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
      "_library/hires-icons-r2/气泡.png"
     ]
    },
    {
     "type": "bullet_list",
     "text_ref": "几条判断规矩",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "谁来写",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ]
    }
   ],
   "notes": "实看横图左48%为标题和三层图，左下原始记录、气泡、上层认识卡；三层说明位于图右上；绿支持/灰语境/橙反例线连回来源。右52%上判断规则整卡、下谁来写整卡（左Claude/ChatGPT标志）。三层只有组名+一段para，不可凭 scene 补额外标签；现有 topology 均为卡层，无法实现插画中的三色关系线与说明相对位置；原图已有＝支持/＝语境/＝反例小图例，定稿没有独立重复图例，不得补字。新图形/图例样式待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "材料怎么变成认识",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "topology",
     "text_ref": "三层分开放",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "layout": "layers",
     "layers": [
      {
       "count": 2,
       "columns": 1
      }
     ],
     "icons": [
      "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
      "_library/hires-icons-r2/气泡.png"
     ]
    },
    {
     "type": "bullet_list",
     "text_ref": "几条判断规矩",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "谁来写",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ]
    }
   ],
   "notes": "实看竖图：标题居中；三层图上方区域中左侧约40%为三层说明、右侧及下方为层图；之后规则满宽卡、谁来写卡（两标志在左）。需专门层图排版，不把解释段拆成新三层文字；目前 topology 样式只能保内容，三色线/示意图未复现，新样式待样张。",
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
   "asset": "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "天平",
   "source_phrase": "三层分开放\n原始记录（发生了什么）",
   "sha256": "4b72accf42775e0407daa6539d3442c05d1f7885c446c9cd1eee55c2af7077f0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/气泡.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "气泡",
   "source_phrase": "我的原话（我怎么说）",
   "sha256": "a58ff382f40a593b35aed5fb214cfba69d55f1157e3ea7db20331bee0b345d24",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "天平",
   "source_phrase": "三层分开放\n原始记录（发生了什么）",
   "sha256": "4b72accf42775e0407daa6539d3442c05d1f7885c446c9cd1eee55c2af7077f0",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e3659099e1a17587c74d.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e3659099e1a17587c74d",
   "title_text": "材料怎么变成认识",
   "sha256": "d8eb2c720d691a2f90b5e4ef34b148750f656bd7c0eff44b861fa8adb993713e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

材料怎么变成认识

**三层分开放**
原始记录（发生了什么）→ 我的原话（我怎么说）→ 认识卡（AI 读懂后写下的理解）。卡上每条证据都标明是支持、反例还是语境。

**几条判断规矩**
- 我清楚说出的喜好是很强的证据，但分得清当下口味和长期喜好，一次选择不当成永久。
- 事实、我的解释、AI 的推断分开写，推断标“AI 判断：”。可以大胆推定，但要写主要依据和会推翻它的反例。
- 电子记录只是生活的一部分：没记录不等于没发生；约好的事到点了、没有变故，就按大概率已经发生来理解。
- 同一件事在几个平台说了几遍，不算几份独立证据。
- 订单、退款、很久没买怎么算，见亮点。

**谁来写**
认识默认由 Claude Opus 5.5 或 GPT-6 Astra 写；在 Claude 里做时，Claude 对照我的原话把关；在 Codex 里由 GPT 做时，它自己把关，我授权了才请 Claude 复核。对我的认识有实质变化时，AI 主动讲清改了什么、请我抽查，不算 AI 自己验收；我没回不算认可。程序只管记录、检索、让旧卡失效和生成视图，不替 AI 下结论。

::screen{#daily-preferences-10 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-10",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左边六张横向小卡片上下排，每张一个小图标、粗体一句原则、一行小字说明；第六张卡片右上角一个黄色小圆点（待验收）。右边一列四个大数字（大号绿色数字，下面一行小字）。图标依次：一个卡片盒被几只手同时指着；一叠纸和一张卡分开放；两张快照叠在一起，新的一张在上面；一个带锁的小玻璃罐里装着一页纸；一部手机和一朵云用虚线连到同一台电脑；一本小日历一页角上贴着黄色小便签，旁边一个小沙漏。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；六张原则卡一行一张；四个大数字改成两行两个，放在最下面。",
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
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "stat_card",
     "text_ref": "**64 个**｜冻结的引用副本文件",
     "align": "left",
     "size": "medium",
     "columns": 4,
     "illustration": "none",
     "connector": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "一处维护",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto"
    }
   ],
   "notes": "实看横图：左78%为标题及2列3排六原则卡，非 scene 所述一列六卡；每卡图在左正文右，第6卡右上黄点；右22%有竖分隔线，4个大数字无图无边卡。原则为单 bullets 节点；数字为4个para，当前 core.stat_card无法将其变成数字卡。右侧无边数字/细分隔线/第6卡状态点均是批准样板外变体，待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "一处维护",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "columns_v": 1,
     "icons": "auto"
    },
    {
     "type": "stat_card",
     "text_ref": "**64 个**｜冻结的引用副本文件",
     "align": "left",
     "size": "medium",
     "columns": 2,
     "illustration": "none",
     "connector": "none",
     "columns_v": 2,
     "icons": "none"
    }
   ],
   "notes": "实看 v 前5原则单列横卡、图左文右；v2 第6原则卡为顶部大插画、下方大粗标题和较长正文，右上黄点，之后4数字2×2。六原则是一个bullets节点，当前整组统一 illustration 无法表达末项改top_inside；不能用第6项text_ref另切。数字para需组件适配。整张第6卡新样式待样张。",
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
   "asset": "_library/icons/齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "齿轮",
   "source_phrase": "一处维护，大家来读来写。 不在每个项目各存一份“我是谁”，免得几份各说各话、越改越偏。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "原始记录不塞进卡。 卡上写的是这些记录对理解我意味着什么；记录再多，卡也不会变成流水账。",
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
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "旧观察盖不掉新观察。 B站、Chrome、Steam 按采集时间排先后，不按导入顺序或文件名，补导一份旧包也不会把新记录退回去。",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "引用别的项目时冻结那一版。 别的项目的文件会一直更新，被引用的那一版按 SHA-256 存一份副本，以后照样能回查；我删了原件，副本一起删。",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
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
   "source_phrase": "手机和云端不另存一份。 它们经电脑 MCP 调同一套命令；原来放在 Google Drive 的两份快照已停更。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "近况会自己标过期（9 月 27 日做好，还没在真实使用里验过）。 每次“要更新了”整段重写近况卡，旧版留历史；窗口结束超过 7 天、或之后又有新记录，程序就标过期，AI 读到时先说“这是截至某日的近况”，只补读之后那几天。睡眠、步数（由个人健康项目的只读工具提供，不存进本库）、亮屏、定位在这里只当作息的线索，不当健康结论。",
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

- **一处维护，大家来读来写。** 不在每个项目各存一份“我是谁”，免得几份各说各话、越改越偏。
- **原始记录不塞进卡。** 卡上写的是这些记录对理解我意味着什么；记录再多，卡也不会变成流水账。
- **旧记录盖不掉新记录。** B站、Chrome、Steam 按采集时间排先后，不按导入顺序或文件名，补导一份旧包也不会把新记录退回去。
- **引用别的项目时冻结那一版。** 别的项目的文件会一直更新，被引用的那一版按 SHA-256 存一份副本，原文件变了只提示“有新材料”，旧引用照样能回查；我删了原件，副本一起删。
- **手机和云端不另存一份。** 它们经电脑 MCP 调同一套命令；原来放在 Google Drive 的两份快照已停更。
- **近况会自己标过期（9 月 27 日做好，还没在真实使用里验过）。** 每次“要更新了”整段重写近况卡，旧版留历史；窗口结束超过 7 天、或之后又有新记录，程序就标过期，AI 读到时先说“这是到某日为止的近况”，只补读之后那几天。睡眠、步数（由个人健康项目的只读工具提供，不存进本库）、亮屏、定位在这里只当作息的线索，不当健康结论。

**64 个**｜冻结的引用副本文件（只数了文件，没逐个校验）
**28,018 行**｜Python 和 JavaScript 正式代码（48 个文件，10 月 30 日 11:06 计数）
**840 个**｜测试定义（只计数，10 月 30 日 11:06 没有重跑）
**279 次**｜提交（9 月 1 日起，10 月 30 日 11:06 数）

::screen{#daily-preferences-11 section="highlights"}

```typeset
{
 "screen": {
  "id": "daily-preferences-11",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：和标杆页“亮点”一样：两张大卡片横排（各占一半宽），每张上面一幅小水彩插画，卡片标题用大字，下面“麻烦”“解法”两段正文（“麻烦：”“解法：”四个字用绿色粗体）。插画：1 一张卡片被一只手从卡片盒里抽出，同时后面几张相连的卡也被一根细线带着微微翘起（不画字）；2 一个购物袋旁边一张退款单，购物袋上一个小天平两边持平。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：标题；两张卡片上下排，每张插画在上、字在下。",
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
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "说错了一纠正",
     "align": "left",
     "columns": 2,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
      "_library/icons/日历时钟.png"
     ]
    }
   ],
   "notes": "实看横图两张各半宽的大卡，上方插画在卡内且上沿局部探出，下面大粗标题，再麻烦/解法/例子（标签粗绿）。每个group+3para整体一张卡，原定稿顺序保留。麻烦/解法/例子未由core自动加绿粗，只能以定稿原文排入，样张需表现标签角色；插画探出卡上沿的新变体待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "content_card",
     "text_ref": "说错了一纠正",
     "align": "left",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "退了的单不算喜欢",
     "align": "left",
     "columns": 1,
     "illustration": "top_inside",
     "connector": "none",
     "icons": [
      "_library/icons/日历时钟.png"
     ]
    }
   ],
   "notes": "实看 v 第一亮点卡上图下标题正文，v2 第二亮点卡无插画、纯标题/麻烦/解法/例子。用第二个group真实起点拆，原文不重复。第二卡标签换行独占段首，标签粗绿属组件待样张。",
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "手机",
   "source_phrase": "说错了一纠正，旧结论自己退场 \n麻烦：AI的“记忆”改了一处，别处还在用旧结论；过几天旧说法又冒出来。\n解法：我的每句原话按补充、临时、更正、撤回分开记。更正当场用在这次回答；引用旧说法的卡——包括别的项目引用的——自动退出当前结果。AI复核时必须重新写详述，不能悄悄带回旧的；临时说法到期作废，也不会反过来改掉长期喜好。到9月28日，有48个卡版本因为我的原话变了而退场复核。\n例子：9月24日我说手机上的使用记录软件后台保不住活，之前的屏幕时长失真，9月23日起开了常驻通知。引用旧说法的“手机使用怎么理解”那张卡当场退场；复核后的新卡写明9月23日以前的时长和排名不作依据，之后的默认可信。",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "退了的单不算喜欢，很久没买也不算讨厌 \n麻烦：照订单猜喜好，凑单后退掉的东西会被当成爱买，好久没买的会被当成不喜欢了。\n解法：退掉、取消、关闭的订单只留交易事实，不进偏好，也不算复购。订单只证明买过，跨时间一再买才加强“喜欢”；耐用品、一次性的行程买一次也算正面证据。时间只管排序，旧的不作废；只有我明确说不要，才算负面。B站取消收藏也只算“不再是重点”。\n例子：9月4日我说“退款大概率是为了凑单，不能反推个人偏好”，从那天起退款单不进偏好；不集牛肉脆片只买过一次、没复购，卡上照样记着我说它好吃。",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "卡片索引",
   "source_phrase": "插画：1 一张卡片被一只手从卡片盒里抽出，同时后面几张相连的卡也被一根细线带着微微翘起（不画字）；2 一个购物袋旁边一张退款单，购物袋上一个小天平两边持平。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一张卡片被一只手从卡片盒里抽出，同时后面几张相连的卡也被一根细线带着微微翘起（不画字"
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
   "asset": "_library/illustrations/购物退款.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "购物退款",
   "source_phrase": "插画：1 一张卡片被一只手从卡片盒里抽出，同时后面几张相连的卡也被一根细线带着微微翘起（不画字）；2 一个购物袋旁边一张退款单，购物袋上一个小天平两边持平。",
   "sha256": "4de62e8a3415e96a8b8a6d8fd62e8b554c31777decc10068955b2f6f3665771c",
   "status": "ready",
   "original_elements": [
    "一个购物袋旁边一张退款单，购物袋上一个小天平两边持平"
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

**说错了一纠正，旧结论自己退场**
麻烦：AI 的“记忆”改了一处，别处还在用旧结论；过几天旧说法又冒出来。
解法：我的每句原话按补充、临时、更正、撤回分开记。更正当场用在这次回答；引用旧说法的卡——包括别的项目引用的——自动退出当前结果。AI 复核时必须重新写详述，不能悄悄带回旧的；临时说法到期作废，也不会反过来改掉长期喜好。到 10 月 30 日只读数时，有 55 个卡版本因为我的原话变了而退场复核。
例子：9 月 24 日我说手机上的使用记录软件（AppUsage）后台保不住活，之前的屏幕时长失真，9 月 23 日起开了常驻通知。引用旧说法的“手机使用怎么理解”那张卡当场退场，复核后一度改成只信 9 月 23 日之后。10 月 6 日我又更正：后台全放开也照样会被系统停掉。按这条更正，现在的说法是 AppUsage 所有时期的时长、排名和使用次数都不作依据，只能证明某个应用出现过；由它撑着的旧数字撤回，但我本人的解释和真实兴趣不跟着清空。手机时长改看 9 月 27 日起接上的手机采集程序 Collector，那是另一个来源：覆盖完整的那几天时长和排行可信，只覆盖一部分的日子会标出来。

**退了的单不算喜欢，很久没买也不算讨厌**
麻烦：照订单猜喜好，凑单后退掉的东西会被当成爱买，好久没买的会被当成不喜欢了。
解法：退掉、取消、关闭的订单只留交易事实，不进偏好，也不算复购。订单只证明买过，跨时间一再买才加强“喜欢”；耐用品、一次性的行程买一次也算正面证据。时间只管排序，旧的不作废；只有我明确说不要，才算负面。B站取消收藏也只算“不再是重点”。
例子：9 月 4 日我说“退款大概率是为了凑单，不能反推个人偏好”，从那天起退款单不进偏好；不集牛肉脆片只买过一次、没复购，卡上照样记着我说它好吃。

::screen{#daily-preferences-12 section="features"}

```typeset
{
 "screen": {
  "id": "daily-preferences-12",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，浅灰＝说不准，灰＝没用过）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框。这是第一张：顶上有标题（毛笔艺术字加绿色笔刷线）和图例，图例下一行小字说明两种状态的判定；图例四个圆点分别画成绿、黄、浅灰、灰。各卡状态：1 绿；2 绿；3 绿；4 绿；5 黄；6 绿；7 绿；8 绿；9 绿；10 绿；11 绿；12 绿；13 绿；14 灰。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。第一张顶上保留标题、图例和说明。",
  "links": [],
  "anchors": [
   {
    "id": "g-know",
    "text": "认识我"
   },
   {
    "id": "f-background",
    "text": "问我的情况"
   },
   {
    "id": "f-topic-card",
    "text": "按主题细看"
   },
   {
    "id": "f-evidence",
    "text": "带依据回答"
   },
   {
    "id": "f-recent",
    "text": "最近在做什么"
   },
   {
    "id": "f-recent-expiry",
    "text": "近况过期提醒"
   },
   {
    "id": "f-ask-one",
    "text": "拿不准先问一个"
   },
   {
    "id": "g-correct",
    "text": "记下和纠正"
   },
   {
    "id": "f-record",
    "text": "记下我的原话"
   },
   {
    "id": "f-correct",
    "text": "纠正后旧卡退场"
   },
   {
    "id": "f-temporary",
    "text": "临时说法会到期"
   },
   {
    "id": "f-write-card",
    "text": "写认识卡"
   },
   {
    "id": "g-check",
    "text": "检查写得对不对"
   },
   {
    "id": "f-change-report",
    "text": "讲清认识变了什么"
   },
   {
    "id": "f-card-lint",
    "text": "检查卡片写法"
   },
   {
    "id": "f-cognition-audit",
    "text": "跨项目认知审计"
   },
   {
    "id": "f-monthly",
    "text": "每月一页汇总"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "daily-preferences-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（45 项）",
     "align": "left",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "head",
     "width": "42%"
    },
    {
     "type": "status_legend",
     "text_ref": "● 在用",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "head",
     "width": "58%"
    },
    {
     "type": "prose",
     "text_ref": "待验收＝",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "head"
    },
    {
     "type": "section_heading",
     "text_ref": "认识我",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "1问我的情况",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "记下和纠正",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "7记下我的原话",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "检查写得对不对",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "11讲清认识变了什么",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    }
   ],
   "notes": "实看横图：顶栏标题左42%/图例与说明右58%；认识我6项3列2排，记下和纠正4项一排4列，检查写得对不对4项一排4列。v 首6项左插画右文，v2 7–14无插画；每组小毛笔标题在上方，无重复大标题/图例。状态1–4绿、5黄、6–13绿、14灰。状态只在scene/registry中，steps文本没有状态列；feature_card通过status_source按当前屏同名登记项读取准确状态点，不复制状态、不补字。毛笔组标题及状态点需样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（45 项）",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "status_legend",
     "text_ref": "● 在用",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "prose",
     "text_ref": "待验收＝",
     "align": "left",
     "size": "small",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "认识我",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "1问我的情况",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "记下和纠正",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "7记下我的原话",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "检查写得对不对",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "11讲清认识变了什么",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    }
   ],
   "notes": "实看横图：顶栏标题左42%/图例与说明右58%；认识我6项3列2排，记下和纠正4项一排4列，检查写得对不对4项一排4列。v 首6项左插画右文，v2 7–14无插画；每组小毛笔标题在上方，无重复大标题/图例。状态1–4绿、5黄、6–13绿、14灰。状态只在scene/registry中，steps文本没有状态列；feature_card通过status_source按当前屏同名登记项读取准确状态点，不复制状态、不补字。毛笔组标题及状态点需样张。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "问我的情况｜经历、处境、做事的取舍：先读相关卡的摘要索引，够了直接答",
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
   "source_phrase": "按主题细看｜一张卡的完整详述、相关原话和全部证据；要核当时的语境，连原话一起展开",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "带依据回答｜日常问题把相关卡和依据一起拿出来，还列出没写进卡的原文候选，说清查了哪些来源",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "最近在做什么｜近况卡：这段时间主要在哪、时间花在哪、和之前比变了什么、推断在忙什么",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "近况过期提醒｜窗口结束超过 7 天或之后有新记录就标过期；回答时说明截至哪天，只补读之后的记录",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "拿不准先问一个｜一种解释会影响以后的理解、材料又答不了时，先问我一个具体问题；我没回不算认可",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "记下我的原话｜分补充、临时、更正、撤回四种记；回顾过去的话按当时的日期记",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "纠正后旧卡退场｜更正让引用旧说法的卡（包括别的项目引用的）退出当前结果，复核重写后才回来",
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "临时说法会到期｜带截止的说法到期作废，没撤回的长期说法照常用",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
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
   "source_phrase": "写认识卡｜摘要、详述、检索别名、证据一起写，证据分支持、反例、语境；多张卡先全部校验再一次写入",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "讲清认识变了什么｜每次实质更新后说清新增、更正、增强、减弱了什么和依据；只报条数不算",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "检查卡片写法｜只读查 7 类毛病：新原话没引用、追加式补充、人称混用、统计缺时间范围、限定语过密、引用的附件变了、卡里写了来源状态",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "跨项目认知审计｜给我看的分析按日期存档；复核时先对照上次哪些问题解决了",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "每月一页汇总｜每月第一次相关长谈时，顺手汇总本月认识变化和还待纠正的",
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
   "asset": "_library/titles/title-0fbf7978fe7727d2a856.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0fbf7978fe7727d2a856",
   "title_text": "全部功能（45 项）",
   "sha256": "0b693a08b3f738b30b19d6ceea442d63ef6991b6fb85f79cfdca9fee578ac355",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（45 项）
● 在用　● 待验收　● 说不准　● 没用过
待验收＝做好了，还没在真实使用里验过；说不准＝用了不一定留下记录，查过会话记录和库也没找到；没用过＝该留记录的地方都没有

**认识我**
1. 问我的情况｜经历、处境、做事的取舍：先读相关卡的摘要索引，够了直接答
2. 按主题细看｜一张卡的完整详述、相关原话和全部证据；要核当时的语境，连原话一起展开
3. 带依据回答｜日常问题把相关卡和依据一起拿出来，还列出没写进卡的原文候选，说清查了哪些来源
4. 最近在做什么｜近况卡：这段时间主要在哪、时间花在哪、和之前比变了什么、推断在忙什么
5. 近况过期提醒｜窗口结束超过 7 天或之后有新记录就标过期；回答时说明截至哪天，只补读之后的记录
6. 拿不准先问一个｜一种解释会影响以后的理解、材料又答不了时，先问我一个具体问题；我没回不算认可

**记下和纠正**
7. 记下我的原话｜分补充、临时、更正、撤回四种记；回顾过去的话按当时的日期记
8. 纠正后旧卡退场｜更正让引用旧说法的卡（包括别的项目引用的）退出当前结果，复核重写后才回来
9. 临时说法会到期｜带截止的说法到期作废，没撤回的长期说法照常用
10. 写认识卡｜摘要、详述、检索别名、证据一起写，证据分支持、反例、语境；多张卡先全部校验再一次写入

**检查写得对不对**
11. 讲清认识变了什么｜每次实质更新后说清新增、更正、增强、减弱了什么和依据；只报条数不算
12. 检查卡片写法｜只读查 7 类毛病：新原话没引用、追加式补充、人称混用、统计缺时间范围、限定语过密、引用的附件变了、卡里写了来源状态
13. 跨项目认知审计｜给我看的分析按日期存档；下次审计时先对照上次哪些问题解决了
14. 每月一页汇总｜每月第一次相关长谈时，顺手汇总本月认识变化和还待纠正的

::screen{#daily-preferences-13 section="features"}

```typeset
{
 "screen": {
  "id": "daily-preferences-13",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按实际项数灵活排满各行；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，浅灰＝说不准，灰＝没用过）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框。这是第二张：没有标题、没有图例，直接接着排。各卡状态：15 绿；16 绿；17 绿；18 绿；19 绿；20 绿；21 灰；22 绿；23 绿；24 浅灰；25 绿；26 绿；27 绿；28 绿。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。 本张已批准横排纠正：查事实组21/22两卡均分整行，或按已有八项灵活排满；不补空卡。各条原状态保持，尤其21灰表示没用过、24浅灰表示说不准，二者仍须分清。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-facts",
    "text": "查事实"
   },
   {
    "id": "f-facts",
    "text": "查记录和出处"
   },
   {
    "id": "f-statements",
    "text": "核对原话"
   },
   {
    "id": "f-original",
    "text": "回查原件"
   },
   {
    "id": "f-spending",
    "text": "花钱核对"
   },
   {
    "id": "f-activity",
    "text": "手机电脑用在哪"
   },
   {
    "id": "f-mobility",
    "text": "去过哪"
   },
   {
    "id": "f-device-inventory",
    "text": "手机装了什么"
   },
   {
    "id": "f-records",
    "text": "按编号读回记录"
   },
   {
    "id": "g-choose",
    "text": "帮我选"
   },
   {
    "id": "f-recommend",
    "text": "日常推荐菜单"
   },
   {
    "id": "f-search-relay",
    "text": "搜索接力"
   },
   {
    "id": "g-share",
    "text": "给别的项目和设备"
   },
   {
    "id": "f-writeback",
    "text": "别的项目写回来"
   },
   {
    "id": "f-personal-update",
    "text": "更新个人"
   },
   {
    "id": "f-phone-cloud",
    "text": "手机和云端同一份"
   },
   {
    "id": "f-export",
    "text": "导出成文件"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "daily-preferences-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "查事实",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "15查记录和出处",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "帮我选",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "23日常推荐菜单",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "给别的项目和设备",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "25别的项目写回来",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto",
     "last_row": "fill"
    }
   ],
   "notes": "实看横图查事实15–20为3列2排，21/22两卡各半宽均分第三行；帮我选23/24半宽一排；给别的项目和设备25–28一排4列。查事实8项整体是一个steps节点，当前columns=3最后两卡只占2/3，无法表达同节点最后行扩展半宽，不能用21内部项另开text_ref；须组件行跨度适配。v 15–22保左插画，v2 23–28无插画。21灰＝没用过，24浅灰＝说不准，其余绿。状态点与组毛笔标题需组件适配/样张；没有整屏大标题或新图例。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "查事实",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "15查记录和出处",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "帮我选",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "23日常推荐菜单",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "给别的项目和设备",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "25别的项目写回来",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    }
   ],
   "notes": "实看横图查事实15–20为3列2排，21/22两卡各半宽均分第三行；帮我选23/24半宽一排；给别的项目和设备25–28一排4列。查事实8项整体是一个steps节点，当前columns=3最后两卡只占2/3，无法表达同节点最后行扩展半宽，不能用21内部项另开text_ref；须组件行跨度适配。v 15–22保左插画，v2 23–28无插画。21灰＝没用过，24浅灰＝说不准，其余绿。状态点与组毛笔标题需组件适配/样张；没有整屏大标题或新图例。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "查记录和出处｜按词、平台、来源、材料类型查已存记录；不给关键词也能按来源翻页",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "核对原话｜按编号读原话全文、说的时间和语境",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "回查原件｜先核原件还在、SHA-256 对得上再给原文；对不上就不拿旧片段冒充",
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
   "asset": "_library/round3/clean-assets/png/45-钱包-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钱包",
   "source_phrase": "花钱核对｜任意日期区间按日或按月汇总；净消费＝实付扣成功退款，订单和支付不重复算，币种分开",
   "sha256": "cb2bc88524ac3d8fbe65a63f4fc3dc1dd41c818d31beab524c8112b9bad9ef00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "手机电脑用在哪｜一段时间里手机、电脑各自的总量、主要应用和每天变化；两台设备的时长不相加",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
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
   "source_phrase": "去过哪｜某天或一段时间的停留和移动；停留点用高德接口起区域名，定位空档不猜",
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
   "source_phrase": "手机装了什么｜按导出时间取最新的已装应用清单，能搜能翻页",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "按编号读回记录｜把一次导入改动的记录分页读回，写明只读了存档、没读原件正文；几个只读查询可以合成一次",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "日常推荐菜单｜吃、买、玩：稳妥、相邻、新鲜三组各至少 3 个，每个写为什么；不替我只选一个",
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "搜索接力｜要实时价格、菜单、评价时，建议去哪一两个平台，给能复制的搜索词",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
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
   "source_phrase": "别的项目写回来｜带投递编号、来源项目、出处和读到的版本号；重试不重复写，迟到的旧版本盖不掉新更正",
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
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "更新个人｜不限定来源时，把全部在用的个人项目都查一遍，逐项说处理了、没变化、缺材料还是冻结",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "手机和云端同一份｜手机、云端的 AI 经电脑 MCP 调同样的命令，不另存副本",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
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
   "source_phrase": "导出成文件｜给没接电脑的 AI 或离线用，从同一个库导出两份独立可读的文件",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
   "status": "ready"
  }
 ]
}
```

**查事实**
15. 查记录和出处｜按词、平台、来源、材料类型查已存记录；不给关键词也能按来源翻页；通话可按号码查（空格、横线、+86、区号前的 0 这些写法都认）并按北京时间段筛，同一次电话在换机迁移后的重复记录查次数时合并，原记录不改
16. 核对原话｜按编号读原话全文、说的时间和语境
17. 回查原件｜先核原件还在、SHA-256 对得上再给原文；对不上就不拿旧片段冒充
18. 花钱核对｜任意日期区间按日或按月汇总；净消费＝实付扣成功退款，订单和支付不重复算，币种分开；储蓄卡和支付宝、微信钱包里同一笔钱对上后只算一次，信用卡还款、转到自己钱包或账户不算消费
19. 手机电脑用在哪｜一段时间里手机、电脑各自的总量、主要应用和每天变化；两台设备的时长不相加
20. 去过哪｜某天或一段时间的停留和移动；停留点用高德接口起区域名，定位空档不猜。算停留和移动只用带真实定位时间的点（GPS 记录和手机采集程序 Collector 记下的定位）；MacroDroid 只记了写入时间、位置可能是手机缓存旧值的点，照样留作记录，但不拿来算停留和移动
21. 手机装了什么｜按真实时间取最新的已装应用清单（来自手机采集程序），能搜能翻页
22. 按编号读回记录｜把一次导入改动的记录分页读回，写明只读了存档、没读原件正文；几个只读查询可以合成一次

**帮我选**
23. 日常推荐菜单｜吃、买、玩：稳妥、相邻、新鲜三组各至少 3 个，每个写为什么；不替我只选一个
24. 搜索接力｜要实时价格、菜单、评价时，建议去哪一两个平台，给能复制的搜索词

**给别的项目和设备**
25. 别的项目写回来｜带投递编号、来源项目、出处和读到的版本号；重试不重复写，迟到的旧版本盖不掉新更正
26. 更新个人｜不限定来源时，把全部在用的个人项目都查一遍，逐项说处理了、没变化、缺材料还是冻结
27. 手机和云端同一份｜手机、云端的 AI 经电脑 MCP 调同样的命令，不另存副本
28. 导出成文件｜给没接电脑的 AI 或离线用，从同一个库导出两份独立可读的文件

::screen{#daily-preferences-14 section="features"}

```typeset
{
 "screen": {
  "id": "daily-preferences-14",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片排成三列；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，浅灰＝说不准，灰＝没用过）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：同一个网格、同样的卡片宽高和间距，上下边都不画边框。这是第三张：没有标题、没有图例，直接接着排。各卡状态：29 绿；30 绿；31 绿；32 绿；33 绿；34 绿；35 绿；36 绿；37 绿；38 绿；39 绿；40 绿；41 绿；42 绿；43 绿；44 绿；45 灰。“中文语音转写”几个字画成绿色带小箭头的链接样式。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
   }
  ],
  "anchors": [
   {
    "id": "g-sources",
    "text": "接新材料"
   },
   {
    "id": "f-ingest",
    "text": "导入新导出"
   },
   {
    "id": "f-chatgpt",
    "text": "ChatGPT 只读新增"
   },
   {
    "id": "f-refresh",
    "text": "本机来源刷新"
   },
   {
    "id": "f-refresh-sources",
    "text": "已连接来源刷新"
   },
   {
    "id": "f-page-collect",
    "text": "在已登录网页里采集"
   },
   {
    "id": "f-wechat",
    "text": "读微信新消息"
   },
   {
    "id": "f-citations",
    "text": "引用别处原文"
   },
   {
    "id": "f-silence",
    "text": "来源静默提醒"
   },
   {
    "id": "f-source-review",
    "text": "记下读到哪"
   },
   {
    "id": "f-snapshots",
    "text": "该导出哪一段"
   },
   {
    "id": "f-owner-check",
    "text": "别的项目有新结果吗"
   },
   {
    "id": "f-audio-cloud",
    "text": "存疑录音再请云端听"
   },
   {
    "id": "g-guard",
    "text": "保护和修复"
   },
   {
    "id": "f-privacy-gate",
    "text": "读之前先过资料锁"
   },
   {
    "id": "f-status",
    "text": "看整体状态"
   },
   {
    "id": "f-views",
    "text": "两份视图自动重建"
   },
   {
    "id": "f-repair-regression",
    "text": "撤回错误的 B站 导入"
   },
   {
    "id": "f-repair-locators",
    "text": "原件搬家后改指向"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "daily-preferences-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "接新材料",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "29导入新导出",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "保护和修复",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "41读之前先过资料锁",
     "align": "left",
     "size": "medium",
     "columns": 3,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    }
   ],
   "notes": "实看横图接新材料12项3列4排，保护和修复先41–43三列一排、44/45各半宽均分末行；该5项是单steps节点，最后行半宽不能用44内部项text_ref切块，需组件行跨度适配。v 29–35，v2 36–45，所有卡保留左图右字、右上状态点；45灰，其余绿；40中文语音转写为定稿链接，完整保留。无新增大标题或图例。准确状态点及毛笔组标题待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "接新材料",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "29导入新导出",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "保护和修复",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "feature_card",
     "status_source": "page.registry.features",
     "text_ref": "41读之前先过资料锁",
     "align": "left",
     "size": "medium",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "portrait_columns": 1,
     "icons": "auto"
    }
   ],
   "notes": "实看横图接新材料12项3列4排，保护和修复先41–43三列一排、44/45各半宽均分末行；该5项是单steps节点，最后行半宽不能用44内部项text_ref切块，需组件行跨度适配。v 29–35，v2 36–45，所有卡保留左图右字、右上状态点；45灰，其余绿；40中文语音转写为定稿链接，完整保留。无新增大标题或图例。准确状态点及毛笔组标题待样张。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "导入新导出｜原件先挪进来源投递区保全，按内容去重，默认增量导入；只有完整快照才全量",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双气泡",
   "source_phrase": "ChatGPT 只读新增｜按消息编号增量导入，只读新增或有新消息的对话；让 ChatGPT 操作电脑的对话整段跳过",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "本机来源刷新｜Chrome、Steam 直接读本机；B站用这次在 Chrome 里采到的结果",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "已连接来源刷新｜Gmail、Tasks、Keep、手机上传、电脑软件清单、电脑使用、网易云快照，一条命令更新",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
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
   "source_phrase": "在已登录网页里采集｜B站、京东、美团、饿了么、12306：在我已登录的 Chrome 里跑只读脚本，不读 cookie 和密码，不点按钮不下单",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "读微信新消息｜比对每个会话读到哪，只收新的一段；读完、改完卡才推进阅读位置",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "引用别处原文｜读过的微信原文、转写片段、附件存成已核对引用；被引用的那一版按 SHA-256 冻结一份",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "来源静默提醒｜每类来源有应有的节奏，超期在给 AI 读的首页（CURRENT.md）顶部标“静默”；停了的几个手动导出来源并成一个问题一次问我",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "记下读到哪｜每次导入的阅读和整合进度分开记：未知、部分、完成",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "灯泡",
   "source_phrase": "该导出哪一段｜列出每个来源实际覆盖到哪天，建议从哪天开始重叠导出",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "别的项目有新结果吗｜比对引用过的别项目文件变没变，变了才去读",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "存疑录音再请云端听｜本库挑的录音本地转写存疑时，经〔中文语音转写〕的阿里云入口复核",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "读之前先过资料锁｜每条命令写明要读的等级；锁着就拒绝，一批请求整批拒绝",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "看整体状态｜来源、缺口、静默、近况、待复核的导入一次看；待复核＝阅读状态未知或只读了一部分，不等于没读",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "锁",
   "source_phrase": "两份视图自动重建｜给 AI 的首页和完整详档，每次写入都在同一把数据库锁里重建",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "撤回错误的 B站 导入｜先出只读方案，核对方案指纹、备份数据库后才执行",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "原件搬家后改指向｜核对大小和 SHA-256 后改原件位置，不重新导入",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  }
 ]
}
```

**接新材料**
29. 导入新导出｜我点导出，AI 从电脑下载目录、Gmail 附件或手机下载目录取回（手机上的副本核对两端 SHA-256 后才删）；原件先挪进来源投递区保全，按内容去重，默认增量导入；只有完整快照才全量
30. ChatGPT 只读新增｜按消息编号增量导入，只读新增或有新消息的对话；让 ChatGPT 操作电脑的对话整段跳过
31. 本机来源刷新｜Chrome、Steam 直接读本机；B站用这次在 Chrome 里采到的结果，没有就说明要先实时采，不拿磁盘上的旧快照顶替
32. 已连接来源刷新｜Gmail（含招行每日信用管家邮件）、Keep、手机日志（在家无线收到本地的原件）、电脑软件清单、电脑使用、网易云快照，一条命令更新；手机备份只处理没导过的内容；每个来源完成就写一份回执、带耗时；Google Tasks 10 月 21 日起不再采，旧记录照样能查
33. 在已登录网页里采集｜B站、京东、美团、饿了么：在我已登录的 Chrome 里跑只读脚本，不读 cookie 和密码，不点按钮不下单；B站在后台开接口 JSON 页读，采完就关
34. 读微信新消息｜比对每个会话读到哪，只收新的一段；读完、改完卡才推进阅读位置
35. 引用别处原文｜读过的微信原文、转写片段、附件存成已核对引用；被引用的那一版按 SHA-256 冻结一份
36. 来源静默提醒｜每类来源有应有的节奏，非按需来源超期才在给 AI 读的首页（CURRENT.md）顶部标“静默”；按需来源超期单列一行“用时才采，不算静默”；停了的几个手动导出来源并成一个问题一次问我
37. 记下读到哪｜每次导入的阅读和整合进度分开记：未知、部分、完成
38. 该导出哪一段｜列出每个来源实际覆盖到哪天（按材料自己的观察时间封顶，重导旧文件不往后推），建议从哪天开始重叠导出
39. 别的项目有新结果吗｜比对引用过的别项目文件变没变，变了才去读
40. 存疑录音再请云端听｜本库挑的录音本地转写存疑时，经〔中文语音转写〕的阿里云入口复核

**保护和修复**
41. 读之前先过资料锁｜命令在内部统一检查资料锁，不用调用者声明等级；锁着就拒绝，一批请求整批拒绝
42. 看整体状态｜来源、缺口、静默、近况、待复核的导入一次看；待复核＝阅读状态未知或只读了一部分，不等于没读
43. 两份视图自动重建｜给 AI 的首页和完整详档，每次写入都在同一把数据库锁里重建
44. 撤回错误的 B站 导入｜先出只读方案，核对方案指纹、备份数据库后才执行
45. 原件搬家后改指向｜核对大小和 SHA-256 后改原件位置，不重新导入

::screen{#daily-preferences-15 section="history"}

```typeset
{
 "screen": {
  "id": "daily-preferences-15",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左边一条十五个节点的竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边一幅大一点的水彩插画：一只卡片盒从一张购物小票旁边长出来，越往上卡片越多，周围依次长出聊天气泡、手机、定位针、日历和一把小锁，像一路长出来的样子（插画里不画字）。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
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
     "text_ref": "演进",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "history-head",
     "width": "78%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "align": "right",
     "size": "small",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "row": "history-head",
     "width": "22%",
     "target_height": 220
    },
    {
     "type": "timeline",
     "text_ref": "8 月 31 日",
     "align": "left",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "ribbon",
     "direction": "vertical",
     "icons": "auto",
     "width": "100%",
     "text_layout": "inline"
    }
   ],
   "notes": "实看横图：左68%为两条并排竖时间线，各7节点，先左列8/31–9/14再右列9/15–9/28；每节点小图左、日期正文右，绿线与圆点在左边缘；右32%成长卡片盒大插画。日期清单实际为单stats节点，timeline可消费stats，但direction=vertical当前固定单列、忽略columns=2，无法把单节点分为左右各7项；不能用9/15内部条目text_ref拆块。左右按列顺序的新时间线变体待样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "large",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "illustration",
     "align": "center",
     "size": "small",
     "columns": 1,
     "illustration": "outside",
     "connector": "none",
     "target_height": 360
    },
    {
     "type": "timeline",
     "text_ref": "8 月 31 日",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "direction": "vertical",
     "icons": "auto",
     "text_layout": "inline"
    }
   ],
   "notes": "实看 v 为顶部成长插画、演进标题、第一列7节点，v2续后7节点；竖版14节点连续单列，每项小图左日期正文右、左绿线圆点。日期stats节点完整分给timeline，不误用stat_card，不重复标题或插画。时间线外观不在3张批准样板，待样张。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 31 日：第一版：把订单、支付、行程和 AI 对话整理成带出处的证据，维护一份很小的偏好快照；推荐时就给稳妥、相邻、新鲜三组，不替我只选一个。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 4 日：退款和零元订单不再算进偏好。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 5 日：从“日常偏好”扩成各项目共用的个人理解库，别的项目能可靠地写回来；优先读完整的原对话。",
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
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "9 月 6 日：认识卡可以引用读过的微信原文和录音转写片段。",
   "sha256": "fa9ca45e53800105388a3bcbd68b78fc3f7c835737907cbc037d32337e8166b3",
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
   "source_phrase": "9 月 8–9 日：手机和云端改用同一份库，经电脑 MCP 直接调命令。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 12 日：我纠正之后，AI 必须讲清认识变了什么。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "9 月 14 日：打开数据之前先查资料锁。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "9 月 15 日：要求有想象力地推定，不因为单份材料证明不了就悬着不下判断。",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "9 月 18 日：网页订单增量更新、净消费核对。",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 22–23 日：接入 Google Keep 和手机日志（短信、通话、定位、亮屏、应用使用）。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 25 日：给 AI 读的首页（CURRENT.md）改成核心画像打头；来源超期标“静默”。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "9 月 26 日：旧观察不再覆盖新记录；Claude 也能在网页里采集 B站、京东、美团、12306；被引用的别处原文按 SHA-256 冻结一份。",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "9 月 27 日：“最近在做什么”近况卡和过期提醒。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 28 日：ChatGPT 只读新增，让 ChatGPT 操作电脑的对话不读。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "10 月 6–8 日：我更正 AppUsage 的时长全都不可信，它退役，手机使用改由手机采集程序 Collector 导入（数据从 9 月 27 日起）；拼多多、银行流水、菜鸟三类来源按我的选择不再接；查区域名改由密码中心代办高德调用。",
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
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-daily-preferences",
   "source_phrase": "横版画面：左边一条十五个节点的竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边一幅大一点的水彩插画：一只卡片盒从一张购物小票旁边长出来，越往上卡片越多，周围依次长出聊天气泡、手机、定位针、日历和一把小锁，像一路长出来的样子（插画里不画字）。 风格照两个标杆页：白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边，大标题用毛笔艺术字加绿色笔刷线。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一只卡片盒从一张购物小票旁边长出来，越往上卡片越多，周围依次长出聊天气泡、手机、定位针、日历和一把小锁，像一路长出来的样子（插画里不画字"
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
- **8 月 31 日**：第一版：把订单、支付、行程和 AI 对话整理成带出处的证据，维护一份很小的偏好快照；推荐时就给稳妥、相邻、新鲜三组，不替我只选一个。
- **9 月 4 日**：退款和零元订单不再算进偏好。
- **9 月 5 日**：从“日常偏好”扩成各项目共用的个人理解库，别的项目能可靠地写回来；优先读完整的原对话。
- **9 月 6 日**：认识卡可以引用读过的微信原文和录音转写片段。
- **9 月 8–9 日**：手机和云端改用同一份库，经电脑 MCP 直接调命令。
- **9 月 12 日**：我纠正之后，AI 必须讲清认识变了什么。
- **9 月 14 日**：打开数据之前先查资料锁。
- **9 月 15 日**：要求有想象力地推定，不因为单份材料证明不了就悬着不下判断。
- **9 月 18 日**：网页订单增量更新、净消费核对。
- **9 月 22–23 日**：接入 Google Keep 和手机日志（短信、通话、定位、亮屏、应用使用）。
- **9 月 25 日**：给 AI 读的首页（CURRENT.md）改成核心画像打头；来源超期标“静默”。
- **9 月 26 日**：旧观察不再覆盖新记录；Claude 也能在网页里采集 B站、京东、美团、12306；被引用的别处原文按 SHA-256 冻结一份。
- **9 月 27 日**：“最近在做什么”近况卡和过期提醒。
- **9 月 28 日**：ChatGPT 只读新增，让 ChatGPT 操作电脑的对话不读。
- **10 月 6–8 日**：我更正 AppUsage 的时长全都不可信，它退役，手机使用改由手机采集程序 Collector 导入（数据从 9 月 27 日起）；拼多多、银行流水、菜鸟三类来源按我的选择不再接；查区域名改由密码中心代办高德调用。
- **10 月 19–21 日**：手机日志改由电脑在家经无线调试直接收，不再经云盘中转；接入招行储蓄卡流水，储蓄卡和钱包里的同一笔钱只算一次，信用卡还款和转给自己不算消费；每月的人工导出改成我点导出、AI 取回，手机上的副本核对后才删；Google Tasks 停采，旧记录保留，要我做的事改看驾驶舱。
- **10 月 22–29 日**：通话能按号码和北京时间段查；资料锁改为命令内部统一检查，不再要求声明等级；来源截止按材料自己的观察时间封顶，按需来源和真正静默分开；Collector 定位按真实定位时间导入；手机备份只处理新内容，每个来源完成就写回执；B站改从后台接口 JSON 页采集。
