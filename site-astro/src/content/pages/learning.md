---
{
 "title": "学习方法",
 "kind": "project",
 "url": "/projects/learning/",
 "tagline": "让 AI 当老师，按一条排好的路线教我、记进度、断了能接上。",
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
  "page": "learning",
  "kind": "project",
  "title": "学习方法",
  "url": "/projects/learning/",
  "tagline": "让 AI 当老师，按一条排好的路线教我、记进度、断了能接上。",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "当老师按路线带我学",
  "based_on": {
   "commit": "e6008f2ff0a9feccc7063d2b4807944e4d42cef1",
   "commit_time": "2026-10-07T13:32:11+08:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的插画出发，镜头不动：书桌上摊开的绿色讲义被一阵微风轻轻翻过一页，页面上只有浅灰短线；笔记本屏幕上的两个对话气泡一前一后轻轻闪一下；窗外小山上 小石板铺成的小路，第一块石板淡淡亮起绿色又慢慢暗下去，路边小三角旗随风轻摆；背景水彩微微流动，偶尔一片小叶子飘过书桌。画面里不出现任何文字，最后一帧回到第一帧，无缝循环。",
  "registry": {
   "groups": [
    {
     "id": "g-plan",
     "name": "排课和备课"
    },
    {
     "id": "g-class",
     "name": "上课和练习"
    },
    {
     "id": "g-feedback",
     "name": "反馈和纠错"
    },
    {
     "id": "g-continue",
     "name": "接着学"
    }
   ],
   "features": [
    {
     "id": "f-route",
     "group": "g-plan",
     "name": "排学习路线",
     "what": "定先后顺序、每段讲多深；路线分段，每课写明学完要能讲清的问题",
     "how": "说“按现在的进度排接下来怎么学”；大纲我认可了才按它讲",
     "status": "在用",
     "screen": "learning-09",
     "source": "学习路线.md:17–112；当前状态.md:8；决定记录 FY08、学习第四轮 KC3"
    },
    {
     "id": "f-real-case",
     "group": "g-plan",
     "name": "结合实际讲",
     "what": "放进一个贯穿全课的实际案例里讲：先讲谁遇到什么问题、原来怎么做，再讲怎么解决",
     "how": "说“这段没听懂，拿实际场景重讲”",
     "status": "在用",
     "screen": "learning-09",
     "source": "学习路线.md:9–11；讲义原则.md:11；决定记录 FY09"
    },
    {
     "id": "f-own-projects",
     "group": "g-plan",
     "name": "拿我的项目举例",
     "what": "用我亲手做过的项目举例，先按当时的源码重核，只读不改",
     "how": "老师自己挑；我也可以说“拿我的某个项目举个例子”",
     "status": "在用",
     "screen": "learning-09",
     "source": "学习路线.md:147、81；讲义原则.md:17；决定记录 LX0927-27；讲义 07 首课已在 9 月 29 日用过，22、27 还没上到；Claude 定稿依据：当前状态.md:44、学习进度.json:6、36、39–42"
    },
    {
     "id": "f-materials",
     "group": "g-plan",
     "name": "新资料先审再用",
     "what": "现成课程资料有更新、网上有新说法，老师先读，再定不改、换例子、调顺序还是改深度；讲错的在讲义里点破",
     "how": "说“有新的课程资料了，看看要不要改课”",
     "status": "在用",
     "screen": "learning-09",
     "source": "学习路线.md:168–188；讲义原则.md:32；当前状态.md:8、17；决定记录 LX0918-02、LX0928-02"
    },
    {
     "id": "f-lectures",
     "group": "g-plan",
     "name": "写讲义",
     "what": "每课一篇网页讲义，人话加表格，英文术语后面跟中文；每节末尾有问题和折叠答案；会变的事实查一手资料，开头写知识截至哪天；前一天下课后按反馈从 Markdown 草稿定稿成网页，同名 .json 是唯一现行讲义，旧 Markdown 只留在 Git 历史",
     "how": "上课时老师在 Chrome 打开当天网页，并给链接",
     "status": "在用",
     "screen": "learning-09",
     "source": "讲义原则.md:4、9、21、26、27、33；讲义 07 第 3 行“知识截至 2026-09-27”"
    },
    {
     "id": "f-review",
     "group": "g-plan",
     "name": "独立审稿",
     "what": "主干篇写完，请没看过前面对话的新会话复核；定稿前 Opus 和 Astra 各做一次终审",
     "how": "老师自己安排，不用我审",
     "status": "在用",
     "screen": "learning-09",
     "source": "讲义原则.md:40；当前状态.md:17"
    },
    {
     "id": "f-daily-class",
     "group": "g-class",
     "name": "每天一课",
     "what": "一天只给一篇，开头说今天解决什么，分小段讲；课末说清今天完成没有、没完成的挪到哪天",
     "how": "说“今天学哪一课”或“接着上次讲”",
     "status": "在用",
     "screen": "learning-09",
     "source": "讲义原则.md:14、39；9 月 29 日首课已上完；Claude 定稿依据：当前状态.md:44、学习进度.json:6、36、39–42"
    },
    {
     "id": "f-real-calls",
     "group": "g-class",
     "name": "练习调云端接口",
     "what": "练习程序经本机转发口调云端接口，密钥由密码中心注入，不进课程文件",
     "how": "老师课前开、下课关；练习程序连 127.0.0.1:18765",
     "status": "在用",
     "screen": "learning-09",
     "source": "工具/百炼转发/说明.md；当前状态.md:10、11、15；备课时已真实调用多次，课上还没用过"
    },
    {
     "id": "f-hands-on",
     "group": "g-class",
     "name": "亲手跑一次",
     "what": "关键处有一步我亲手跑，另有完整的小验证（跑一次、改一次）",
     "how": "讲到那一课时老师带着跑",
     "status": "待验收",
     "screen": "learning-09",
     "source": "当前状态.md:32、38；学习进度.json practice.experiments planned=9"
    },
    {
     "id": "f-exercises",
     "group": "g-class",
     "name": "配套练习",
     "what": "13 组代码练习，每组有说明、结果文件和离线测试，可以原样重跑",
     "how": "讲到对应的课时打开那一组",
     "status": "待验收",
     "screen": "learning-09",
     "source": "练习/代码/ 13 个目录；讲义原则.md:41；当前状态.md:11、17"
    },
    {
     "id": "f-java-page",
     "group": "g-class",
     "name": "每日一页",
     "what": "每天一页网页：一两个知识点和自测题",
     "how": "说“出今天的每日一页”，看完在对话里口述",
     "status": "待验收",
     "screen": "learning-09",
     "source": "当前状态.md:38；决定记录 LX0928-01；练习/笔记核对版/；学习进度.json java_review total=40"
    },
    {
     "id": "f-practice",
     "group": "g-class",
     "name": "开头抽问",
     "what": "每课开头约 10 分钟抽 3–5 道以前的题，先最近卡住的、再刚学的、再一道隔得最久的；不加课后作业，题单只记必要状态，不打分",
     "how": "老师每课开头做，也可以说“考我几道以前的题”",
     "status": "待验收",
     "screen": "learning-09",
     "source": "学习路线.md:138；当前状态.md:10；学习进度.json algorithm total=40、quiz"
    },
    {
     "id": "f-question",
     "group": "g-feedback",
     "name": "凭直觉质疑",
     "what": "说一句“感觉不对”就行；老师找到具体是哪一处，按证据判断，不因为被质疑就改口",
     "how": "直接说“这里怪怪的”",
     "status": "在用",
     "screen": "learning-10",
     "source": "讲义原则.md:12、27–29；决定记录学习终审 ZS5、LX0917-01 等多次质疑"
    },
    {
     "id": "f-fix-all",
     "group": "g-feedback",
     "name": "讲错就改、一次改齐",
     "what": "改讲法或改内容，顺着找出受影响的讲义、草稿、练习和题目一起改，在对话里说清改了什么",
     "how": "指出哪里不懂或前后矛盾",
     "status": "在用",
     "screen": "learning-10",
     "source": "讲义原则.md:27–31、34；底稿“纠正教学与材料”"
    },
    {
     "id": "f-spaced",
     "group": "g-feedback",
     "name": "隔一段再讲一遍",
     "what": "讲过的内容在后面的课换个场景再问；下次什么时候问，记在开头抽问的题单里",
     "how": "老师安排；我也可以说“先别讲新的，把上次那段再过一遍”",
     "status": "待验收",
     "screen": "learning-10",
     "source": "讲义原则.md:37–38；学习路线.md:149–160"
    },
    {
     "id": "f-feedback-log",
     "group": "g-feedback",
     "name": "记下讲了什么",
     "what": "实际讲了哪篇、我当时的反馈，简要记下来，只给 AI 看，免得重复；不记我的原话全文",
     "how": "老师记，我不用填表",
     "status": "在用",
     "screen": "learning-10",
     "source": "讲义原则.md:44–45；讲义索引.md:3、58（9/10 起有记录）"
    },
    {
     "id": "f-resume",
     "group": "g-continue",
     "name": "换对话也接着学",
     "what": "新对话先读“现在停在哪”的那份文件，从停下的地方接着讲，不照旧计划重来",
     "how": "直接说“接着上次讲”",
     "status": "在用",
     "screen": "learning-10",
     "source": "仓库 AGENTS.md:5；技能 SKILL.md；底稿“按进度继续学习”；9 月 15 日换对话后接着讲（旧账本）"
    },
    {
     "id": "f-fallback-teacher",
     "group": "g-continue",
     "name": "换老师也接着学",
     "what": "Claude 用不了时，GPT-6 Astra Max 按同一套文件接着教，不重开进度",
     "how": "在 Codex 里说“接着上次讲”",
     "status": "待验收",
     "screen": "learning-10",
     "source": "仓库 AGENTS.md:31；当前状态.md:20；决定记录学习终审 ZS1"
    },
    {
     "id": "f-progress",
     "group": "g-continue",
     "name": "学习进度",
     "what": "学完的课记日期，每个上课日记一条：我报的学习时长（没报就空着）、讲了哪几课、练习做了几道（只记数量，不算正确率）",
     "how": "老师每个上课日下课时问我学了多久，一起更新",
     "status": "在用",
     "screen": "learning-10",
     "source": "学习进度.json（9/28 新建，9/29 首课和进度已真实用过；Claude 定稿依据：第 6、36、39–42 行）；讲义原则.md:14；决定记录 LX0929-08（学习时长由本人报，没报为空，不按内容量代填）"
    }
   ],
   "numbers": [
    {
     "id": "n-files",
     "text": "7 份文件",
     "meaning": "路线、大纲、讲义、练习、讲义索引、当前状态、学习进度；谁接手都读同一套",
     "as_of": "2026-10-11",
     "source": "本项目的一组文件",
     "screens": [
      "learning-01",
      "learning-05"
     ]
    },
    {
     "id": "n-loopback",
     "text": "1 个本机转发口",
     "meaning": "练习要调云端接口时用，密钥不进课程文件",
     "as_of": "2026-10-11",
     "source": "练习调云端接口",
     "screens": [
      "learning-01",
      "learning-08"
     ]
    },
    {
     "id": "n-exercises",
     "text": "13 组练习",
     "meaning": "练习/代码 下的目录数；每组有说明、结果文件和离线测试",
     "as_of": "2026-10-11",
     "source": "练习/代码 下 13 个目录（10 月 11 日列目录）；行数不再上首屏，9 月 28 日为约 1.25 万行",
     "screens": [
      "learning-01",
      "learning-05",
      "learning-09"
     ]
    },
    {
     "id": "n-tests",
     "text": "306 项测试",
     "meaning": "练习的离线测试，内容终审时 Astra 全部跑通",
     "as_of": "2026-09-28",
     "source": "当前状态.md:17",
     "screens": [
      "learning-01",
      "learning-08"
     ]
    },
    {
     "id": "n-final-review",
     "text": "必须改 37 条、建议改 47 条；必须改 9 条",
     "meaning": "9 月 28 日内容终审：Opus 5.5 主审 37+47；Astra 核数字事实命令 9",
     "as_of": "2026-09-28",
     "source": "当前状态.md:17；提交 4375b59",
     "screens": [
      "learning-08"
     ]
    },
    {
     "id": "n-course-compare",
     "text": "约二十处缺口、十来处讲错或过时",
     "meaning": "现成课程资料逐课对照的结果（四路 Opus）",
     "as_of": "2026-09-28",
     "source": "当前状态.md:17",
     "screens": [
      "learning-08"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-claude-teacher",
     "with": "Claude（Opus 5.5）",
     "direction": "干活",
     "flow": "当老师：读学习文件，排路线、写讲义、上课、判对错，每个上课日结束写回当前状态和学习进度",
     "source": "仓库 AGENTS.md:31；讲义原则.md:14"
    },
    {
     "id": "r-astra",
     "with": "GPT-6 Astra Max（经 Codex）",
     "direction": "干活",
     "flow": "Claude 派它搭练习、复核讲义、终审给第二意见；Claude 用不了时按同一套文件接着教",
     "source": "仓库 AGENTS.md:31；当前状态.md:11、17、20"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "密码中心启动课上用的本机转发口，并把阿里云百炼的密钥只注入这个进程",
     "source": "工具/百炼转发/说明.md；登记安装.ps1"
    },
    {
     "id": "r-bailian",
     "with": "阿里云百炼（外部服务）",
     "direction": "交出",
     "flow": "转发口把练习程序的请求转到百炼北京，拿回回答和用量；只放行两类接口",
     "source": "工具/百炼转发/说明.md"
    },
    {
     "id": "r-gpu-broker",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "经电脑配置与恢复里的显卡排队服务（LocalGpuBroker）调用本机千问模型，做课上演示和测速",
     "source": "讲义/素材/07_A2_真实调用/说明.md；当前状态.md:38"
    },
    {
     "id": "r-understanding",
     "with": "daily-preferences",
     "direction": "双向",
     "flow": "老师读个人理解库里我的背景和偏好；学习中出现会改变对我理解的新结果，当轮写回理解库",
     "source": "仓库 AGENTS.md:5、7"
    },
    {
     "id": "r-decisions",
     "with": "agents",
     "direction": "交出",
     "flow": "我对学习安排的决定和更正，原话记进 AI 规则库的决定记录学习一节，学习文件只注编号",
     "source": "仓库 AGENTS.md:5、7；E:\\.agents\\docs\\owner-decisions.md 学习一节"
    },
    {
     "id": "r-cockpit",
     "with": "网站驾驶舱",
     "direction": "交出",
     "flow": "驾驶舱只读学习进度文件：学完几课、近 7 天上了几次课和我报的学习时长、练习做了几道",
     "source": "学习进度.json note；决定记录“驾驶舱里的‘学习方法’”"
    },
    {
     "id": "r-examples",
     "with": "chinese-asr、remote-control、daily-preferences、agents",
     "direction": "拿来",
     "flow": "老师只读这些项目当课上的例子（转写的模型组合、幂等、MCP 服务、跨厂商协作记录），不改不跑",
     "source": "学习路线.md:81、147；讲义原则.md:17；当前状态.md:11、18"
    },
    {
     "id": "r-report-pages",
     "with": "report-page 技能",
     "direction": "拿来",
     "flow": "Java 每日一页网页、需要时配的课上网页（推断：用的是白底绿色的本地汇报网页）",
     "source": "当前状态.md:38（只写“老师出的网页”，没写用哪个技能）"
    }
   ],
   "highlights": [
    {
     "id": "h-evidence-not-agree",
     "title": "被质疑不跟着改口",
     "screen": "learning-08"
    },
    {
     "id": "h-independent-review",
     "title": "讲义不是老师一个人说了算",
     "screen": "learning-08"
    },
    {
     "id": "h-course-as-reference",
     "title": "现成课程资料只当参考",
     "screen": "learning-08"
    },
    {
     "id": "h-key-not-in-course",
     "title": "练习调云端接口，密钥不进课程",
     "screen": "learning-08"
    }
   ],
   "mentions": [
    {
     "target": "/skills/learning/",
     "screen": "learning-02",
     "text": "学习方法技能"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "learning-05",
     "text": "个人理解库"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "learning-05",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/learning/#when-wrong",
     "screen": "learning-08",
     "text": "觉得不对怎么办"
    },
    {
     "target": "/projects/password-center/",
     "screen": "learning-08",
     "text": "密码中心"
    },
    {
     "target": "/projects/learning/#f-own-projects",
     "screen": "learning-07",
     "text": "全部功能"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“安排学习路线”→ f-route“排学习路线”（只写安排学什么、先后、多深，去掉原文里的去向说法）。",
    "底稿“按进度继续学习”→ 拆成 f-resume“换对话也接着学”和 f-fallback-teacher“换老师也接着学”：前者在用，后者还没发生过，状态不同，合在一起会把“待验收”说成“在用”。",
    "底稿“讲清业务与技术”→ f-real-case“结合实际讲”（FY09）。",
    "底稿“纠正教学与材料”→ f-fix-all“讲错就改、一次改齐”。"
   ],
   "dropped": [
    "底稿另有 4 条功能按本人决定不上网站、不提存在（名字只记在 facts.md“底稿功能去向”）。",
    "课上 AI 花费、累计上限和花费统计脚本：本人决定不上网站。转发口只写“记下用了多少词元”，不写金额。",
    "sha256:5b5bde175518604dde9ea79fc67728da6302f00d81f2bd0070d262dcc16f7d16",
    "sha256:83ea60aae62b8ff74ed3b71c4ec897a569fc63e0c880807d1cb32d93d6a06c67"
   ],
   "unsure": [
    "sha256:ecbb7bd20132a5ce4b947c9ea7536a53608d48f93f82ca9fd73e786fa984fdb4",
    "“贯穿全课的业务案例”没说是哪家公司、为什么选它：这个案例来自项目里的业务世界，细说会带出不上网站的内容；只写“先讲谁遇到什么问题、原来怎么做”。第 3 屏第三组请求的问题原文是一个汽车名词，也没写出来。",
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏“AI 当老师，按一条排好的路线教我”（10 月 31 日按本人要求只描述项目、不写学什么）；第 8 屏“我常凭直觉觉得‘怪怪的’，以前的老师一听就说‘有道理’，跟着改。可我的质疑常常只是直觉”（本人原话是“用户经常质疑老师；老师还说有道理，用户不是懂技术，是靠直觉的”）；第 11 屏“我要求先交一份我能看懂的课程大纲，再开讲”“我听不懂或觉得不对就直接说”；功能表里“我也可以说……”。",
    "sha256:18c05e47e5714b4b5050037f11eeb34ccfa88378fd643f63f02afac5e191e972",
    "多数功能标“待验收”：9 月 29 日才上第一课，上课、练习、进度这些做好了但没在真实上课里用过。“真调云端模型”标“在用”：备课时老师和 Astra 已真实调用多次、9 月 27 日验收通过，只是还没在课上用。",
    "关系 r-report-pages：当前状态只写“老师出的网页”，没写用 report-page 技能，是推断。",
    "第 8 屏写了转发口的本机端口 127.0.0.1:18765：属于本机信息（L2），按规矩可以写；它只监听本机，外面连不上。",
    "截图：旧网站和仓库里没找到能用的学习方法截图（大纲 PDF 的标题带不上网站的词，没用），全部画成插画。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/learning/page.json",
  "sha256": "540345a3940970e54b106f585d68021bbc5fe48f76453244bdcef5432c9dcc49",
  "converted_at_beijing": "2026-10-31T04:12:56+08:00"
 }
}
---

::screen{#learning-01 section="top"}

```typeset
{
 "screen": {
  "id": "learning-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“学习方法”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：一张书桌，摊开一本绿色封面的讲义（页面上只画浅灰短线，不画字），旁边一台笔记本电脑，屏幕上两个对话气泡（只画短线）；书桌后面的窗外是一座缓缓向上的绿色小山，一条由 小石板铺成的小路蜿蜒上山，路边插着小三角旗；中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一串 小石板、一叠讲义、一个带齿轮的代码窗口、一个打了绿色对勾的小试管架。数字卡右下角一行小灰字（截至那一行）。数字卡下面一个白底细绿边的圆角按钮〔在整套系统里的位置 → 怎么协作〕。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽，山和小路竖着往上走）、四张数字卡改成两行两张、截至那一行小字、驾驶舱按钮单独一行，最后协作按钮一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "看电脑和项目状态 → 驾驶舱",
    "href": "/cockpit/"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#learning"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/learning/#ai-brief"
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
     "row": "hero",
     "width": "48%",
     "text_ref": "学习方法"
    },
    {
     "type": "prose",
     "text_ref": "让 AI 当老师，按一条排好的路线教我、记进度、断了能接上。",
     "size": "large",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "AI 当老师，按一条排好的路线教我。Claude（Opus 5.5）排路线、",
     "row": "hero"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "7 份文件"
    },
    {
     "type": "prose",
     "align": "right",
     "size": "small",
     "text_ref": "数字截至"
    },
    {
     "type": "action_button",
     "text_ref": "看电脑和项目状态 → 驾驶舱"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "上方左侧标题、一句话、介绍，右侧大书桌/山路插画。四张数字卡一排，原图插画均在卡内左边、数字和说明在右，不是卡顶。现在条是三个带标签空框加驾驶舱按钮；末尾两个按钮来自最新定稿。正文不缩字。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n当前live_strip从now节点真实标签自动生成各框，已核对labels/格数；删除旧规格冗余labels/columns描述，要求仍保留在scene及本注释。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "学习方法"
    },
    {
     "type": "prose",
     "text_ref": "让 AI 当老师，按一条排好的路线教我、记进度、断了能接上。",
     "size": "large",
     "bold": true
    },
    {
     "type": "stat_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "7 份文件",
     "portrait_columns": 1
    },
    {
     "type": "prose",
     "align": "right",
     "size": "small",
     "text_ref": "数字截至"
    },
    {
     "type": "prose",
     "text_ref": "AI 当老师，按一条排好的路线教我。Claude（Opus 5.5）排路线、"
    },
    {
     "type": "illustration"
    },
    {
     "type": "action_button",
     "text_ref": "看电脑和项目状态 → 驾驶舱"
    },
    {
     "type": "action_button",
     "columns": 1,
     "text_ref": "在整套系统里的位置"
    }
   ],
   "notes": "整屏标题居中；一句话、介绍、整宽主插画后两排两张数字卡，图在左。现在改纵排三组标签/空框，驾驶舱按钮单行，随后两按钮各单行。原竖图未画复制按钮，按定稿补齐。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n当前live_strip从now节点真实标签自动生成各框，已核对labels/格数；删除旧规格冗余labels/columns描述，要求仍保留在scene及本注释。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：手机版数字卡改为单列，继续使用共享数字字号，不缩正文。"
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "28 课｜一条路线分六段：模型调用 → 做成可用 → 知识问答 → 工具与 Agent → 模型原理 → 产品判断",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "学习书笔",
   "source_phrase": "28 篇讲义｜开课前全部写好草稿，约 46 万字（含代码和表格）",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "13 组练习｜Python 和 Java，约 1.25 万行代码",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "306 项测试｜练习的离线测试，开课前终审时全部通过",
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
   "asset": "_library/round3/clean-assets/png/39-main-learning-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-learning",
   "source_phrase": "右上一幅水彩插画：一张书桌，摊开一本绿色封面的讲义（页面上只画浅灰短线，不画字），旁边一台笔记本电脑，屏幕上两个对话气泡（只画短线）；书桌后面的窗外是一座缓缓向上的绿色小山，一条由 28 块小石板铺成的小路蜿蜒上山，路边插着六面小三角旗，旗面分别写 A、B、C、D、M、P；第一块石板旁放着一双小鞋，表示还没出发。",
   "sha256": "6783142750756868f710b07ddd24707f33da4acbd83331629c187aab2a444720",
   "status": "ready",
   "original_elements": [
    "一张书桌，摊开一本绿色封面的讲义（页面上只画浅灰短线，不画字），旁边一台笔记本电脑，屏幕上两个对话气泡（只画短线）；书桌后面的窗外是一座缓缓向上的绿色小山，一条由 28 块小石板铺成的小路蜿蜒上山，路边插着六面小三角旗，旗面分别写 A、B、C、D、M、P；第一块石板旁放着一双小鞋，表示还没出发"
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
   "asset": "_library/titles/title-d6543d3bdf2eedd910d9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d6543d3bdf2eedd910d9",
   "title_text": "学习方法",
   "sha256": "1c0a097651a329c826f1555e6e4a6e99843e94dba8380a17e383338b75f4f3d8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

学习方法

让 AI 当老师，按一条排好的路线教我、记进度、断了能接上。

AI 当老师，按一条排好的路线教我。Claude（Opus 5.5）排路线、写讲义、上课、判对错；GPT-6 Astra Max 搭练习、复核讲义。路线、讲义、练习、进度和我的反馈都存在文件里，换个对话、换个老师，也从停下的地方接着学。

**7 份文件**｜路线、大纲、讲义、练习、讲义索引、当前状态、学习进度；谁接手都读同一套
**1 个本机转发口**｜练习要调云端接口时用，密钥不进课程文件
**13 组练习**｜每组有说明、结果文件和离线测试
**306 项测试**｜练习的离线测试，内容终审时全部通过

数字截至 10 月 11 日

〔看电脑和项目状态 → 驾驶舱〕

〔在整套系统里的位置 → 怎么协作〕　〔复制 AI 续作说明〕

::screen{#learning-02 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-02",
  "section": "usage",
  "title": "一天怎么学",
  "scene": "横版画面：左上标题，下面一行导语。左边约三分之二宽画一条从上到下的时间线：五个圆形节点用细绿线串起，每个节点旁一个小水彩图标（一叠讲义加一支笔、一块小黑板、一个烧瓶和一段代码、一张嘴和一个问号气泡、一本打开的日历上打着绿勾），节点右边是粗体小标题和一两行字。右边约三分之一宽上下两张浅绿边框的小卡片：上面“Java 每日一页”（画一页网页，上面两行浅灰短线和一个小方框代表自测题），下面“开头抽问”（画一个小沙漏）。最下面横跨整屏一行浅绿底小字（课程资料那一句），右端放技能链接。",
  "portrait": "竖版：标题和导语；时间线五个节点从上到下，图标在左、字在右；两张小卡片一上一下；最后浅绿底那一句和技能链接各一行。",
  "links": [
   {
    "text": "学习方法技能",
    "href": "/skills/learning/"
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
     "size": "medium",
     "text_ref": "一天怎么学"
    },
    {
     "type": "prose",
     "text_ref": "每天一课"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "line",
     "text_ref": "课前",
     "illustration_inside": false,
     "open_nodes": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "right_inside",
     "text_ref": "每日一页",
     "row": "balanced-notes",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "right_inside",
     "text_ref": "开头抽问",
     "row": "balanced-notes",
     "width": "50%"
    },
    {
     "type": "notice",
     "text_ref": "不另外去听课"
    }
   ],
   "notes": "全宽章标题居中。正文左约2/3五节点竖时间线：细绿线、圆点，节点图标在文字外左侧，无箭头也无宽丝带；右约1/3两张卡上下，卡内插画在右。现 connector=ribbon 需组件用细线表现。末尾满宽浅绿说明/技能链接条。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "一天怎么学"
    },
    {
     "type": "prose",
     "text_ref": "每天一课"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "line",
     "text_ref": "课前",
     "illustration_inside": false,
     "open_nodes": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "每日一页"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "开头抽问"
    },
    {
     "type": "notice",
     "text_ref": "不另外去听课"
    }
   ],
   "notes": "采用已通过 learning-02-v 替换图并合看 v2。第1张标题/导语及前4步，图在卡左；续图顶部是课末大插画，再第5步、Java、开头抽问和说明。五节点必须连续，不能把课末藏掉或复印标题。细绿纵线，无箭头。原 v2 的旧导语不取用，文字一律定稿。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "学习书笔",
   "source_phrase": "一叠讲义加一支笔",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/黑板流程.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "黑板流程",
   "source_phrase": "一块小黑板",
   "sha256": "6d6ab8d436b84a863059c1e39489fe50e62577873cf6aac49a57b47f8ec72510",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "代码窗口",
   "source_phrase": "一个烧瓶和一段代码",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "问号气泡",
   "source_phrase": "一张嘴和一个问号气泡",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "一本打开的日历上打着绿勾",
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
   "asset": "_library/titles/title-02aef9a5669ae1d53950.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-02aef9a5669ae1d53950",
   "title_text": "一天怎么学",
   "sha256": "4bae9e3cace1c0daa3fefc8bbd36ca094de46ab93e4365a15206a5addf2c6d11",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一天怎么学

每天一课；另有一页短练习和每课开头的抽问。

1. **课前**｜前一天下课后，老师按已有反馈把明天那篇讲义从 Markdown 草稿定稿成网页；网页同名的 .json 内容文件从此就是这篇唯一现行的讲义，旧 Markdown 移出工作区、只留在 Git 历史里。上课时只打开当天那一篇，不一次塞一整套。
2. **开讲**｜先做约 10 分钟的开头抽问（见下）；老师在 Chrome 打开当天网页、给链接；先说今天要讲清什么、接上哪一课、下次接哪里，再分小节讲。
3. **看例子、自己试**｜关键处先看一个完整的例子，再换一个条件让我自己解释；该我动手的地方，我亲手跑一次。
4. **我说，老师追**｜读完一节，移开讲义用自己的话答，课后不另写作业。老师追问、纠错：对的留着，错的直接指出来。
5. **课末**｜老师明确说今天的计划完成了没有；没完成的写清差什么、挪到哪天。学完的课记上日期，记下做了几道练习；再问我今天大概学了多久，记我报的时长（没报就空着，不按内容量代填）。

**每日一页**：每天一页网页，放一两个知识点和几道自测题；看完在对话里口述，老师追问。

**开头抽问**：每课开头约 10 分钟，问 3–5 道以前的题，不打分，只为找出漏掉的地方。先问最近卡住的，再问刚学的，再留一道隔得最久的；时间不够先去掉当天别处已经问到的，不加课后作业。题单（练习/抽问题单.json）每道题只记出处、为什么重要、最近哪天问的、独立答出还是靠提示、卡在哪、下次大约哪天；下次什么时候再问，由老师按这道题的实际回答定。不打分、不打卡。

不另外去听课：我和 AI 两个人学，现成的课程资料只给老师备课用。　跟 AI 怎么说：〔学习方法技能〕

::screen{#learning-03 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-03",
  "section": "usage",
  "title": "一课长什么样",
  "scene": "横版画面：左上标题，下面一段导语。中间一张三行两列的大表格，画成三张横向并排的对话卡片更好读：每张卡片上半是“问法”（浅绿底），下半是“模型怎么答”（白底，像聊天气泡）；第二张卡片右上角一个绿色小对勾，第三张卡片里画三个大小不一的小气泡叠在一起，表示三次回答长短不一。卡片上方画一块显卡侧面亮着绿光的小插画，旁边一个小标签“本机”。表格下面左边一块浅绿边框的小卡片“学完要能讲清”，四条带小圆点的短句；右边一段小字（调接口那段）配一幅小插画：一个代码窗口和一个 JSON 花括号用箭头来回连着。最下面一行小灰字（原件那一句）。",
  "portrait": "竖版：标题和导语；三张对话卡片从上到下排；“学完要能讲清”卡片；调接口那段和小插画；最后原件那一句。",
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
     "row": "hero",
     "width": "58%",
     "text_ref": "一课长什么样",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "一课怎么讲"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "40%"
    },
    {
     "type": "table",
     "columns": 3,
     "layout": "dialogue_cards",
     "illustration": "none",
     "text_ref": "环节"
    },
    {
     "type": "content_card",
     "columns": 1,
     "text_ref": "每课开头写明"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "bottom_inside",
     "text_ref": "例子先落到能动手的一层"
    },
    {
     "type": "prose",
     "size": "small",
     "text_ref": "课上真跑过的例子"
    }
   ],
   "notes": "左上标题/导语，右上本机显卡。中部两列表格的3条数据行必须转3张横排对话卡（每卡上问法浅绿、下模型回答气泡），不是普通表格；第2卡小对勾、第3卡三个不同大小气泡。下方左学习清单卡右接口说明/窗口与JSON来回箭头插画。右卡插画实际在说明下方。末尾灰字。table 的 dialogue_cards 是构图需求，当前族未实现该字段，必须请求。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：首行横版标题58%/插画40%；手机显卡插画按整行宽完整比例呈现。素材自身残框另交素材处理。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一课长什么样"
    },
    {
     "type": "prose",
     "text_ref": "一课怎么讲"
    },
    {
     "type": "illustration",
     "size": "large",
     "align": "center",
     "target_width": "100%"
    },
    {
     "type": "table",
     "columns": 1,
     "layout": "dialogue_cards",
     "illustration": "none",
     "text_ref": "环节"
    },
    {
     "type": "content_card",
     "columns": 1,
     "text_ref": "每课开头写明"
    },
    {
     "type": "prose",
     "text_ref": "例子先落到能动手的一层"
    },
    {
     "type": "prose",
     "size": "small",
     "text_ref": "课上真跑过的例子"
    }
   ],
   "notes": "第1张标题、导语、整宽显卡/代码/JSON插画、3张对话卡单列；第2张学习清单卡、接口说明、原件说明。续图原件说明无插画，不能额外补一幅；对话卡第二张保留对勾。合看 v/v2，不重复标题。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：首行横版标题58%/插画40%；手机显卡插画按整行宽完整比例呈现。素材自身残框另交素材处理。"
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
   "asset": "_library/round3/clean-assets/png/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "显卡计算",
   "source_phrase": "卡片上方画一块显卡侧面亮着绿光的小插画，旁边一个小标签“本机”。表格下面左边一块浅绿边框的小卡片“学完要能讲清”，四条带小圆点的短句；右边一段小字（调接口那段）配一幅小插画：一个代码窗口和一个 JSON 花括号用箭头来回连着。",
   "sha256": "a1f8f6bc994770f2e92d64d220784ac5622c33eb4375e3dd52eb6e7e14bb3285",
   "status": "ready",
   "original_elements": [
    "卡片上方画一块显卡侧面亮着绿光的小插画，旁边一个小标签抽象图形；一个代码窗口和一个 JSON 花括号用箭头来回连着"
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
   "asset": "_library/titles/title-4e550dcf435c879d785c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4e550dcf435c879d785c",
   "title_text": "一课长什么样：第一课",
   "sha256": "b5ee5f66e3eba87d4b1210150e4413e136e60982ce53c8a22175481b5879a338",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一课长什么样

一课怎么讲：开头写明今天要讲清的几个问题，中间分小节讲，每节讲完我答一遍，课末说清完成没有。拿一节课里的三个环节看：

| 环节 | 课上怎么说 |
|---|---|
| 开讲 | “今天要讲清三个问题；接上一课停下的地方，下一课从这里接着讲。” |
| 一节讲完 | 我移开讲义，用自己的话讲一遍；对的留着，漏掉的那一处老师当场补上 |
| 课末 | “今天的计划完成了；没讲完的一小节挪到下一课。”记上日期和我报的时长 |

**每课开头写明“学完要能讲清”的几个问题**：讲到我能用自己的话说清因果和取舍为止，读完一节就移开讲义答一遍。

例子先落到能动手的一层：能跑的就给一个能原样再跑的小例子，我亲手跑一次。

课上真跑过的例子都留着原件和重跑脚本，可以原样再跑一遍。

::screen{#learning-04 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-04",
  "section": "usage",
  "title": "觉得不对、断了、落后了",
  "scene": "横版画面：左上标题。左半边一张大卡片“我觉得哪里不对，但说不上来”，里面四步画成四个带编号的绿色圆点，自上而下用细线连起，每步一两行字；卡片右上角一幅小插画：一个问号气泡和一个放大镜，放大镜下是一行浅灰短线中间一小段被绿色高亮。右半边上下四张小卡片，每张左侧一个小水彩图标（断开又接上的两截绳子、两位老师交接一本书、一只慢慢走的小乌龟、一根插头和一个小循环箭头），粗体小标题后面一两行字。",
  "portrait": "竖版：标题；四步卡片在上，四步一行一步；四张小卡片一行一张。",
  "links": [],
  "anchors": [
   {
    "id": "when-wrong",
    "text": "我觉得哪里不对，但说不上来"
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
     "row": "hero",
     "width": "68%",
     "text_ref": "觉得不对",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "30%"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "我觉得哪里不对"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "illustration": "none",
     "connector": "line",
     "enclosure": "single_card",
     "text_ref": "老师拿具体"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "讲到一半断了",
     "row": "trouble-0",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "Claude 用不了",
     "row": "trouble-0",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "跟不上",
     "row": "trouble-1",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "练习调云端接口连不上",
     "row": "trouble-1",
     "width": "50%"
    }
   ],
   "notes": "标题在左，右上书本/电脑装饰插画。下方左大卡标题和4个编号圆点由细纵线连接，左卡右上问号与放大镜小插画；右4小卡上下排，插画卡内左侧。enclosure=single_card 需大卡整体围框，不是4张分离步骤卡。无箭头，无宽丝带。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：灰气泡插画位缩到30%，标题占68%；水彩替换仍需素材负责人。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：四步说明整宽；其后四个原困境卡按两行两列排，避免四步短栏下方持续空白。 仅更改单页排版规格，不改定稿字句和素材文件。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "觉得不对"
    },
    {
     "type": "illustration"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "我觉得哪里不对"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "illustration": "none",
     "connector": "line",
     "enclosure": "single_card",
     "text_ref": "老师拿具体"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "讲到一半断了"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "Claude 用不了"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "跟不上"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "练习调云端接口连不上"
    }
   ],
   "notes": "标题、整宽书本/电脑插画、一个4步大卡、4张小卡。大卡四步纵排细线连接，小卡插画在左。章标题全屏宽居中。enclosure 字段是构图需求，现组件需确认。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。"
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
   "asset": "_library/icons/共享节点.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "共享节点",
   "source_phrase": "断开又接上的两截绳子",
   "sha256": "2775e570150c9e576ad746098f9ad04499074a0b2baa88fffdfe6514b189dbdc",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "两位老师交接一本书",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
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
   "source_phrase": "一只慢慢走的小乌龟",
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
   "source_phrase": "一根插头和一个小循环箭头",
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
   "asset": "_library/illustrations/late-r3-learning-question-magnifier.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-learning-question-magnifier",
   "source_phrase": "横版画面：左上标题。左半边一张大卡片“我觉得哪里不对，但说不上来”，里面四步画成四个带编号的绿色圆点，自上而下用细线连起，每步一两行字；卡片右上角一幅小插画：一个问号气泡和一个放大镜，放大镜下是一行浅灰短线中间一小段被绿色高亮。右半边上下四张小卡片，每张左侧一个小水彩图标（断开又接上的两截绳子、两位老师交接一本书、一只慢慢走的小乌龟、一根插头和一个小循环箭头），粗体小标题后面一两行字。",
   "sha256": "9dd36a830ff84aaa11a52e03d8ed48b3c7463a9d02f4a3bea857278445e0ce8e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-ee21af1c754822e2c068.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ee21af1c754822e2c068",
   "title_text": "觉得不对、断了、落后了",
   "sha256": "2d851c093617c51d213b564d665d2ef681b8ec09e62133af9d7eb2a3a9e937c8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

觉得不对、断了、落后了

**我觉得哪里不对，但说不上来**
1. 老师拿具体的句子、例子去对，找到让我别扭的那一处；不要求我先讲清专业原因。
2. 按证据判：只是没讲明白，就换讲法；真错了，就改内容；是我想错了，就直接讲清错在哪、为什么。
3. 要改就一次改齐：用全文搜索找出受影响的地方，已经讲过的讲义、后面的草稿、练习和题目一起改。
4. 在对话里直接说改了什么、为什么；讲过的说法变了，下一课开头先讲清。不要求我重读、重做一遍才能往下学。

**讲到一半断了、换了对话**：新对话先读记着“现在停在哪”的那份文件，从停下的地方接着讲，不照旧计划重来。

**Claude 用不了**：GPT-6 Astra Max 按同一套文件接着教，不重开进度。

**跟不上**：落后就往后顺延，尽量不砍内容。

**练习调云端接口连不上**：先看本机转发口（见亮点 4）还开着没有；偶尔十几秒断一次是个别连接的问题，重试一次并记下来。

::screen{#learning-05 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-05",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题，下面一行导语。上半部分一张七行两列的表格，画成一个打开的文件夹，里面七张竖排的小文件卡片横向排开（每张卡片顶上一个小水彩图标：一条山路、一张全程表、一叠讲义、一个代码窗口、一本记事本、一个小图钉、一个小进度格子），卡片上是文件的叫法，卡片下方一两行小字是“管什么”。最后一张“学习进度”卡片用一支虚线箭头指向右边一个小网页窗口（画学习方法页首屏的小方框，框里只画几条短线）。下半部分左右两张卡片：左“一样东西只存一处”（画一把钥匙对一把锁），右“本机模型”（画一块侧面发绿光的显卡和一个排队号牌）。",
  "portrait": "竖版第1张learning-05-v：仅原标题/导语、文件/管什么表格的七条文件与完整职责说明。每条整宽上下排，缩小图标，使正常370px读得清；文件名与职责配对明确即保留，不为可读的表格字段分栏形式本身重画。驾驶舱关系由学习进度的完整原句保留，特定山路/图钉/小网页插画是AI辅助排法，不是另加生图门槛。后续正确v2只按原分张范围保留，不把后两卡或新标题搬到v。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/"
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
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "47%",
     "text_ref": "它是怎么搭的",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "除了练习用的本机转发口"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "51%"
    },
    {
     "type": "table",
     "columns": 7,
     "layout": "file_cards",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "文件"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "row": "bottom",
     "width": "49%",
     "text_ref": "一样东西只存一处"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "row": "bottom",
     "width": "49%",
     "text_ref": "本机模型"
    }
   ],
   "notes": "原图上方左标题/导语，右文件夹电脑与书本插画。中间打开的文件夹整体框里7张文件卡一排，图标在卡顶，文件名和职责在下，学习进度卡虚线箭头指向右边小网页窗口。下方左右两张卡，左钥匙锁、右显卡/排队号；右卡同时容纳本机模型和课上真调云端模型。table 的 file_cards 当前未实现，应请求。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。"
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
     "type": "prose",
     "text_ref": "除了练习用的本机转发口"
    },
    {
     "type": "table",
     "columns": 2,
     "layout": "paired_rows",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "文件",
     "page_break_after": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "一样东西只存一处"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "本机模型"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "练习调云端接口"
    }
   ],
   "notes": "v为标题/导语及7条文件名-职责对应行，左文件名加小图标、右完整职责；原 portrait 明确保持两字段配对，不为分栏本身重画。v2仅3张说明卡顺排，叶子在角部，不搬到v、不补另一标题。新版职责变长可增高，绝不缩字。paired_rows 是原图构图意图；若普通 table 竖版会额外重复表头，需比较。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。"
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
   "source_phrase": "一条山路",
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
   "source_phrase": "一张全程表",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "学习书笔",
   "source_phrase": "一叠讲义",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "代码窗口",
   "source_phrase": "一个代码窗口",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一本记事本",
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
   "source_phrase": "一个小图钉",
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
   "source_phrase": "一个小进度格子",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/文件收纳通用构图.png",
   "fallback": false,
   "semantic_status": "remaining_request_subject_reuse",
   "key": "文件收纳通用构图",
   "source_phrase": "横版画面：左上标题，下面一行导语。上半部分一张七行两列的表格，画成一个打开的文件夹，里面七张竖排的小文件卡片横向排开（每张卡片顶上一个小水彩图标：一条山路、一张全程表、一叠讲义、一个代码窗口、一本记事本、一个小图钉、一个小进度格子），卡片上是文件的叫法，卡片下方一两行小字是“管什么”。最后一张“学习进度”卡片用一支虚线箭头指向右边一个小网页窗口（画学习方法页首屏的小方框，框里只画几条短线）。下半部分左右两张卡片：左“一样东西只存一处”（画一把钥匙对一把锁），右“本机模型”（画一块侧面发绿光的显卡和一个排队号牌）。",
   "sha256": "764e9012bb1bbe7cfc27ff7639b21204558266fe15f49c6340212ad71fb8560d",
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

除了练习用的本机转发口，没有别的程序：整套学习就是一个私有仓库里的一组文件，老师按文件教，谁接手都读同一套。

| 文件 | 管什么 |
|---|---|
| 学习路线 | 先后顺序、每段讲多深；每一课“学完要能讲清的问题” |
| 课程大纲 | 给我看的一张全程表；我看过、认可了才按它讲 |
| 讲义 | 每课一篇网页讲义。网页同名的 .json 是这篇唯一现行的讲义：修讲义改它，接手的 AI 也只读它；旧 Markdown 草稿只留在 Git 历史里 |
| 练习 | 13 组代码，每组有说明、结果文件和离线测试；开头抽问的题单（抽问题单.json）也放在这里 |
| 讲义索引 | 实际讲了什么、我当时的反馈，只给 AI 看，避免重复 |
| 当前状态 | 现在停在哪、唯一的下一步 |
| 学习进度 | 学完几课、上了几次课、练习做了几道；只记事实，不算百分比 |

**一样东西只存一处**：我对学习安排的决定，原话记在 AI 规则库的决定记录里，这里只写现在怎么做、注上编号；我的背景和偏好在〔个人理解库〕，学习中出现会改变 AI 对我理解的新情况，当轮写回那里。不建打卡、积分和监督系统。

**本机模型**：练习要用本机模型时，经〔电脑配置与恢复〕里的显卡排队服务调用，和转写、识字不同时占显卡。

**练习调云端接口**：经本机转发口，做法见亮点 4。

::screen{#learning-06 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-06",
  "section": "tech",
  "title": "用了哪些模型、为什么这样设计",
  "scene": "横版画面：左上标题。左半边“谁干什么”一张四行两列的表格，每行最左画品牌小标志：Claude 标志、ChatGPT 标志（代表 GPT-6 Astra Max）、一块发绿光的小显卡（本机千问）、一朵云（阿里云百炼）。表格下面一行小字（帮手那一句）。右半边“为什么这样设计”五条短句，每条前一个小水彩图标（一条先画好的山路、一个咖啡杯、一张说话的嘴、一个日历上隔几格打一个勾、一个被划掉的打卡表）。",
  "portrait": "竖版：标题；“谁干什么”表格改成一行一个模型（标志在左）；帮手那一句；“为什么这样设计”五条一行一条。",
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
     "row": "hero",
     "width": "55%",
     "text_ref": "用了哪些模型",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "43%"
    },
    {
     "type": "table",
     "row": "body",
     "width": "48%",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "谁干什么"
    },
    {
     "type": "prose",
     "row": "body",
     "text_ref": "帮手只用"
    },
    {
     "type": "bullet_list",
     "row": "body",
     "width": "50%",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "为什么这样设计",
     "item_images": [
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    }
   ],
   "notes": "左上标题，右上书本/电脑/小白板。主体左右等宽两大卡：左谁干什么4行2列角色表，表下帮手说明及小电脑插画；右为什么这样设计5条逐行左图标右短句并细横线分隔。右卡不能改成5张独立卡，图标在卡内左侧。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "用了哪些模型"
    },
    {
     "type": "table",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "谁干什么"
    },
    {
     "type": "notice",
     "text_ref": "帮手只用"
    },
    {
     "type": "bullet_list",
     "columns": 1,
     "illustration": "none",
     "text_ref": "为什么这样设计"
    }
   ],
   "notes": "v是标题、谁干什么4模型单列（品牌/显卡/云图标在左、职责右）、帮手浅绿说明、底部5个设计图标一排；v2从为什么这样设计组标题开始，5条整宽浅绿卡顺排且没有左图标。组标题只有定稿中的一次，不补新章名。原角色名GPT/Qwen旧版本以定稿更新。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。"
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
   "source_phrase": "一条先画好的山路",
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
   "source_phrase": "一个咖啡杯",
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
   "source_phrase": "一张说话的嘴",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "一个日历上隔几格打一个勾",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个被划掉的打卡表",
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
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "学习书笔",
   "source_phrase": "先有路线再写讲义：顺序、前后依赖和深度先定下来，讲义临上课再定稿；不讲到哪算哪。",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "学习书笔",
   "source_phrase": "先有路线再写讲义：顺序、前后依赖和深度先定下来，讲义临上课再定稿；不讲到哪算哪。",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "学习书笔",
   "source_phrase": "从零讲起：Python、数学、机器学习都不预设基础；AI 概念先拿写程序时常见的东西打比方，比如调模型就像调一个传 JSON、回 JSON 的接口。",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "天平",
   "source_phrase": "学到能讲出口：一个问题讲到我能用大白话说清因果和取舍为止，不背原文。",
   "sha256": "4b72accf42775e0407daa6539d3442c05d1f7885c446c9cd1eee55c2af7077f0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "先回忆再看书，隔一段再讲一遍：核心内容在后面的课换个场景，让我先凭记忆讲，卡住再回看。依据是关于主动回忆、间隔和反馈的研究（9 月 14 日核对过）；它说明这样做有用，不说明哪个天数最好，所以间隔按我的真实表现调。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "不打卡、不打分：老师把学到哪记在文件里就够了，不让我填表，也不算百分比。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/学习模型分工.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "学习模型分工",
   "source_phrase": "横版画面：左上标题。左半边“谁干什么”一张四行两列的表格，每行最左画品牌小标志：Claude 标志、ChatGPT 标志（代表 GPT-6 Astra Max）、一块发绿光的小显卡（本机千问）、一朵云（阿里云百炼）。表格下面一行小字（帮手那一句）。右半边“为什么这样设计”五条短句，每条前一个小水彩图标（一条先画好的山路、一个咖啡杯、一张说话的嘴、一个日历上隔几格打一个勾、一个被划掉的打卡表）。",
   "sha256": "f5c8c988b429a1ec6cc2afcf9bb58be1b7aee74049e261cee94b944aa76037e2",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-67afc6595bc3bf1754f2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-67afc6595bc3bf1754f2",
   "title_text": "用了哪些模型、为什么这样设计",
   "sha256": "b4b9e8c236e16fcc53859aa7530a1a80a73585da6cae53f483ec8626117aa0aa",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

用了哪些模型、为什么这样设计

**谁干什么**
| 模型 | 干什么 |
|---|---|
| Claude Opus 5.5 | 老师：排路线、写讲义、上课、判对错，最后把关 |
| GPT-6 Astra Max | 搭练习、复核讲义、终审时给第二意见；Claude 用不了时接着教 |
| 本机模型 | 练习需要时在本机跑，经显卡排队服务调用 |
| 云端接口 | 练习需要时经本机转发口调用，密钥不进课程文件 |

帮手只用 Opus 5.5 或 GPT-6 Astra Max；独立审稿用没看过前面对话的新会话。哪个用不了就照实说，不悄悄换更弱的模型。

**为什么这样设计**
- 先有路线再写讲义：顺序、前后依赖和深度先定下来，讲义临上课再定稿；不讲到哪算哪。
- 一套文件谁接手都读：进度、断点和反馈都在文件里，换对话、换老师不靠谁记得。
- 质疑先对证据：我说“不对”，老师按证据判断，不因为被质疑就改口，也不因为我坚持就照办。
- 改就一次改齐：讲法或内容一改，受影响的讲义、草稿、练习和题目一起改，不留前后矛盾。
- 不打卡、不打分：老师把学到哪记在文件里就够了，不让我填表，也不算百分比。

::screen{#learning-07 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-07",
  "section": "tech",
  "title": "拿我自己的项目当例子",
  "scene": "横版画面：左上标题，标题右边一枚绿色小圆点加“在用”两个字。上方一幅小插画：一个书架上摆着几个贴着绿色标签的小盒子，一只手只是指着，没有拿下来。下面四个例子画成四张横向并排的小卡片，每张左上一个小水彩图标（麦克风、两张重叠的纸上盖着同一个号码章、一台远处的小电脑、两个不同颜色的对话气泡）。最下面一行浅绿底小字（最后两句），右端放链接。",
  "portrait": "竖版：标题和在用标记；插画缩成一行；四张小卡片一行一张；最后两句一行。",
  "links": [
   {
    "text": "全部功能",
    "href": "/projects/learning/#f-own-projects"
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
     "row": "hero",
     "width": "54%",
     "text_ref": "拿我自己的项目当例子",
     "row_fit_illustration": true
    },
    {
     "type": "tag",
     "row": "hero",
     "text_ref": "在用"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "备课时"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "44%"
    },
    {
     "type": "feature_card",
     "columns": 4,
     "portrait_columns": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "挑例子"
    },
    {
     "type": "notice",
     "text_ref": "老师只读这些项目"
    }
   ],
   "notes": "采用批准 replace_images 的 learning-07-h。标题右侧在用绿点小标；导语在左、指着书架盒子的手在右。4张例子卡一排，图标在卡内顶上、正文在下。末尾满宽浅绿说明条。feature_card 当前只左图布局，top_inside需请求；不能因旧竖图的还没在课上用过/待验收而改定稿。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "拿我自己的项目当例子"
    },
    {
     "type": "tag",
     "text_ref": "在用"
    },
    {
     "type": "illustration"
    },
    {
     "type": "prose",
     "text_ref": "备课时"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "挑例子"
    },
    {
     "type": "notice",
     "text_ref": "老师只读这些项目"
    }
   ],
   "notes": "标题/在用小标、书架小盒子插画整宽一行、导语、4例子卡一张一行（图标左、正文右）、说明条。旧竖图标题和状态是过时文案；文字必须更新成定稿第一课已用上和在用。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。"
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "麦克风",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "两张重叠的纸上盖着同一个号码章",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "一台远处的小电脑",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "两个不同颜色的对话气泡",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-c6715738c46fdf.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-c6715738c46fdf",
   "source_phrase": "上方一幅小插画：一个书架上摆着几个贴着绿色标签的小盒子，一只手只是指着，没有拿下来。",
   "sha256": "a486317351836d4e61b337a8bffd1e5980cfc7bae8ffaddb480b95b7f2ca6f00",
   "status": "ready",
   "original_elements": [
    "一个书架上摆着几个贴着绿色标签的小盒子，一只手只是指着，没有拿下来"
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
   "asset": "_library/titles/title-0f12b77042241fc24a2a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0f12b77042241fc24a2a",
   "title_text": "拿我自己的项目当例子（第一课已用上）",
   "sha256": "e15683337679edf7a5cd49bcde9159742d794286e07ac4cf461941038deb6df8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

拿我自己的项目当例子

在用

备课时，老师能用我亲手做过的东西举例就用：
- 挑例子：讲一个机制时，先看我自己的项目里有没有现成的做法，有就拿来讲。
- 先重核：用之前按当时的源码再核一遍，项目改过的照现在的讲。
- 用真实记录：有真实运行记录的，就用记录，不另编示例。
- 记进讲义索引：用了哪个项目、讲到哪一层，记下来，后面不重复。

老师只读这些项目，不改、不跑、不维护。现在的状态见〔全部功能〕。

::screen{#learning-08 section="highlights"}

```typeset
{
 "screen": {
  "id": "learning-08",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：左上标题。下面四张两行两列排的大卡片，每张顶上一幅小水彩插画（第一张：一个问号气泡对着一架天平；第二张：两位不同颜色的小人各拿一支红笔在同一叠讲义上圈画，旁边一排小试管都打着绿勾；第三张：一叠旧课本上放着放大镜，几处被贴上绿色小便签；第四张：一个代码窗口 → 一个小门牌写着 127.0.0.1:18765 → 一朵云（阿里云百炼），小门牌上方一把钥匙从一个带锁的保险箱（密码中心）里伸出来，只插进小门牌，代码窗口上方画一把被划掉的钥匙）。每张卡片里粗体标题，下面“麻烦”“解法”两段，“麻烦”前一个浅灰小标签，“解法”前一个绿色小标签。链接画在各自卡片里。",
  "portrait": "竖版：标题；四张卡片从上到下，每张插画在卡片顶部，第四张的小流程图改成从上到下。",
  "links": [
   {
    "text": "觉得不对怎么办",
    "href": "/projects/learning/#when-wrong"
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
     "align": "center",
     "size": "medium",
     "text_ref": "亮点（一）"
    },
    {
     "type": "content_card",
     "columns": 2,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons-r2/气泡.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/icons/文稿堆.png",
      "_library/icons/云.png"
     ],
     "text_ref": "1. 被质疑不跟着改口"
    }
   ],
   "notes": "4张大卡2×2，均卡内顶上插画、下面编号粗体标题及麻烦/解法两段。第4插画是窗口→本机转发口→云，钥匙只进入转发口；横向箭头保留。麻烦浅灰标签、解法深绿标签只标原有词。章标题整屏居中。当前卡族需要把原group后的两段留在本卡，不能拆成额外卡。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "亮点（一）"
    },
    {
     "type": "content_card",
     "text_ref": "1. 被质疑不跟着改口",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons-r2/气泡.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "2. 讲义不是老师一个人说了算",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "3. 现成课程资料只当参考",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "4. 练习调云端接口，密钥不进课程",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "合看v/v2：四卡单列。v第1、2卡卡内顶部大插画；v2第3、4卡实际无插画，仅浅绿卡头及麻烦/解法正文。已拆成4个连续group定位的块分别指定插画，不给后两卡强加卡顶图。第3/4卡标题档位中，单屏章标题只有一次。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
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
   "asset": "_library/icons/late-r3-learning-green-question-bubble.png",
   "fallback": false,
   "semantic_status": "late_round3_exact_original_theme_prepared",
   "key": "late-r3-learning-green-question-bubble",
   "source_phrase": "横版画面：左上标题。下面四张两行两列排的大卡片，每张顶上一幅小水彩插画（第一张：一个问号气泡对着一架天平；第二张：两位不同颜色的小人各拿一支红笔在同一叠讲义上圈画，旁边一排小试管都打着绿勾；第三张：一叠旧课本上放着放大镜，几处被贴上绿色小便签；第四张：一个代码窗口 → 一个小门牌写着 127.0.0.1:18765 → 一朵云（阿里云百炼），小门牌上方一把钥匙从一个带锁的保险箱（密码中心）里伸出来，只插进小门牌，代码窗口上方画一把被划掉的钥匙）。每张卡片里粗体标题，下面“麻烦”“解法”两段，“麻烦”前一个浅灰小标签，“解法”前一个绿色小标签。链接画在各自卡片里。",
   "sha256": "c28bb161940960c1db62687ec92efd4222922082224d2405f68c1857eaab3507",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "学习书笔",
   "source_phrase": "2. 讲义不是老师一个人说了算 \n麻烦：同一个AI写、同一个AI查，容易看不见自己的错。\n解法：开课前做了一次内容终审。一个没看过前面对话的全新Opus5.5通读第07–34篇，提出必须改37条、建议改47条；GPT-6AstraMax核数字、事实和命令能不能跑通，必须改9条，306项离线测试全部通过。改完才开课。平时也一样：练习由Astra搭，再请一个全新的Astra复核，老师验收。",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
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
   "source_phrase": "3. 现成课程资料只当参考 \n麻烦：现成的课程课表和讲义很全，但不一定对，也可能过时。\n解法：四个Opus分头逐课对照（课表、机器学习与NLP、RAG、Agent），补上约二十处缺口，另在讲义里点破十来处讲错或过时的说法。例如：课程里MCP用的HTTP+SSE传输早在2025年3月就弃用了，现在的标准只有stdio和StreamableHTTP；示例里的订票工具不管收到什么都回“成功”，正好拿来讲为什么真正动手前要确认、要去重。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云",
   "source_phrase": "4. 真调云端模型，密钥不进课程 \n麻烦：要真调云端模型才学得会；可密钥一旦写进练习代码或配置文件，就散得到处都是。\n解法：练习程序只连本机转发口127.0.0.1:18765，配置里的密钥一栏只填一串假字符。真密钥只在转发口那个进程里，由密码中心启动它时注入。转发口只连阿里云百炼北京，只放行两类接口；用时开、用完关，最长开5小时自动关。每次调用记下时间、模型、用了多少词元、花了多久，不记提问和回答的内容。备课搭练习时，老师和Astra已经这样真实调用过多次。",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "问号天平",
   "source_phrase": "下面四张两行两列排的大卡片，每张顶上一幅小水彩插画（第一张：一个问号气泡对着一架天平；第二张：两位不同颜色的小人各拿一支红笔在同一叠讲义上圈画，旁边一排小试管都打着绿勾；第三张：一叠旧课本上放着放大镜，几处被贴上绿色小便签；第四张：一个代码窗口 → 一个小门牌写着 127.0.0.1:18765 → 一朵云（阿里云百炼），小门牌上方一把钥匙从一个带锁的保险箱（密码中心）里伸出来，只插进小门牌，代码窗口上方画一把被划掉的钥匙）。",
   "sha256": "425fc2d20811d84d43bcd5e23cbe8b06796683cbff3e5191e3e123668f91293c",
   "status": "ready",
   "original_elements": [
    "一个问号气泡对着一架天平"
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
   "asset": "_library/illustrations/双人传稿.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "双人传稿",
   "source_phrase": "下面四张两行两列排的大卡片，每张顶上一幅小水彩插画（第一张：一个问号气泡对着一架天平；第二张：两位不同颜色的小人各拿一支红笔在同一叠讲义上圈画，旁边一排小试管都打着绿勾；第三张：一叠旧课本上放着放大镜，几处被贴上绿色小便签；第四张：一个代码窗口 → 一个小门牌写着 127.0.0.1:18765 → 一朵云（阿里云百炼），小门牌上方一把钥匙从一个带锁的保险箱（密码中心）里伸出来，只插进小门牌，代码窗口上方画一把被划掉的钥匙）。",
   "sha256": "e192b3b436c78fcf3c7021f1cb5595405515cfec389bf319a4bce97c3ab25488",
   "status": "ready",
   "original_elements": [
    "两位不同颜色的小人各拿一支红笔在同一叠讲义上圈画，旁边一排小试管都打着绿勾"
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
   "source_phrase": "下面四张两行两列排的大卡片，每张顶上一幅小水彩插画（第一张：一个问号气泡对着一架天平；第二张：两位不同颜色的小人各拿一支红笔在同一叠讲义上圈画，旁边一排小试管都打着绿勾；第三张：一叠旧课本上放着放大镜，几处被贴上绿色小便签；第四张：一个代码窗口 → 一个小门牌写着 127.0.0.1:18765 → 一朵云（阿里云百炼），小门牌上方一把钥匙从一个带锁的保险箱（密码中心）里伸出来，只插进小门牌，代码窗口上方画一把被划掉的钥匙）。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一叠旧课本上放着放大镜，几处被贴上绿色小便签"
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
   "asset": "_library/titles/title-dbffe2440b69e0eaa806.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-dbffe2440b69e0eaa806",
   "title_text": "亮点（一）",
   "sha256": "9783776acde678908a219befdc39168a28e3b89134ccd4892141e163f423ab5e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

亮点（一）

**1. 被质疑不跟着改口**
麻烦：我常凭直觉觉得“怪怪的”，以前的老师一听就说“有道理”，跟着改。可我的质疑常常只是直觉；需要的是有人按证据判断，而不是顺着我。
解法：质疑一律先对证据。对的采纳，说清改了哪；不对的直接讲清错在哪。质疑本身算好的学习材料，不算“没学懂”。具体怎么做见〔觉得不对怎么办〕。

**2. 讲义不是老师一个人说了算**
麻烦：同一个 AI 写、同一个 AI 查，容易看不见自己的错。
解法：讲义定稿前做了一次内容终审。一个没看过前面对话的全新 Opus 5.5 通读全部新讲义，提出必须改 37 条、建议改 47 条；GPT-6 Astra Max 核数字、事实和命令能不能跑通，必须改 9 条，306 项离线测试全部通过。改完才用。平时也一样：练习由 Astra 搭，再请一个全新的 Astra 复核，老师验收。

**3. 现成课程资料只当参考**
麻烦：现成的课程课表和讲义很全，但不一定对，也可能过时。
解法：四个 Opus 按主题分头逐篇对照，补上约二十处缺口，另在讲义里点破十来处讲错或过时的说法：资料里已经弃用的做法，讲义写明现在的做法是什么、从什么时候变的。

**4. 练习调云端接口，密钥不进课程**
麻烦：有的练习要真调云端接口；可密钥一旦写进练习代码或配置文件，就散得到处都是。
解法：练习程序只连本机转发口 127.0.0.1:18765，配置里的密钥一栏只填一串假字符。真密钥只在转发口那个进程里，由〔密码中心〕启动它时注入。转发口只连一家云服务的一个地域，只放行两类接口；用时开、用完关，最长开 5 小时自动关。每次调用记下时间、模型、用了多少词元、花了多久，不记提问和回答的内容。备课搭练习时，老师和 Astra 已经这样真实调用过多次。

::screen{#learning-09 section="features"}

```typeset
{
 "screen": {
  "id": "learning-09",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：左上标题，标题下面一行图例（六个小圆点和叉，颜色照图例）。下面按功能组排成宽表格：每组的组名是表格上方一行粗体绿色小标题（不单独占一列），组名左边一个小水彩图标；表格四列：功能、能帮我做什么、怎么用、状态；状态一列画对应颜色的小圆点加两个字。每行最左一个很小的水彩图标。两组上下排，组间留一点空。本屏两组：排课和备课（图标一张小山路图）、上课和练习（图标一块小黑板）。",
  "portrait": "竖版：标题和图例（图例折成两行）；每组组名一行；表格改成一行一个功能的小卡片：功能名加状态圆点一行，下面“能帮我做什么”“怎么用”各一行。",
  "links": [],
  "anchors": [
   {
    "id": "g-plan",
    "text": "排课和备课"
   },
   {
    "id": "f-route",
    "text": "排学习路线"
   },
   {
    "id": "f-real-case",
    "text": "结合实际讲"
   },
   {
    "id": "f-own-projects",
    "text": "拿我的项目举例"
   },
   {
    "id": "f-materials",
    "text": "新资料先审再用"
   },
   {
    "id": "f-lectures",
    "text": "写讲义"
   },
   {
    "id": "f-review",
    "text": "独立审稿"
   },
   {
    "id": "g-class",
    "text": "上课和练习"
   },
   {
    "id": "f-daily-class",
    "text": "每天一课"
   },
   {
    "id": "f-real-calls",
    "text": "练习调云端接口"
   },
   {
    "id": "f-hands-on",
    "text": "亲手跑一次"
   },
   {
    "id": "f-exercises",
    "text": "配套练习"
   },
   {
    "id": "f-java-page",
    "text": "每日一页"
   },
   {
    "id": "f-practice",
    "text": "开头抽问"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "learning-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "全部功能（一）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "table",
     "columns": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "排课和备课"
    },
    {
     "type": "table",
     "columns": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "上课和练习"
    }
   ],
   "notes": "标题较小档，全宽居中；一行六状态图例；2组宽表格上下，每组小绿色标题在表格上方，表4列，行首小水彩图标，状态在最右。两组各6行。旧图拿我的项目例子/每天一课状态与新定稿冲突，以定稿为准。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "全部功能（一）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例"
    },
    {
     "type": "table",
     "columns": 1,
     "layout": "feature_rows",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "排课和备课"
    },
    {
     "type": "table",
     "columns": 1,
     "layout": "feature_rows",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "上课和练习"
    }
   ],
   "notes": "合看v/v2/v3：图例两行，组名各一行；每条功能独立整宽卡，图标左、右侧功能名和状态圆点，下面能帮我做什么/怎么用。排课组6卡，上课组6卡；v3最后两卡（Java、算法）原图为大卡插画左、正文右。第一组上方原有山路插画，第二组无同类大插画；如素材未到不得冒充构图一致。table需功能名同行状态及行图标支持。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
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
   "source_phrase": "排课和备课",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "学习书笔",
   "source_phrase": "排学习路线｜定学什么、先后顺序、学多深；28 课分六段，每课写明学完要能讲清的问题｜说“按现在的进度排接下来怎么学”；大纲我认可了才开课｜在用",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "结合实际讲｜技术放进一个贯穿全课的业务案例里讲：先讲谁遇到什么问题、原来怎么做，再学用哪门技术｜说“这段没听懂，拿实际场景重讲”｜在用",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "拿我的项目举例｜用我亲手做过的项目讲原理；中文语音转写第一课已用上，个人理解库、远程电脑 MCP、AI 分工记录还没讲到｜老师自己挑，只读不改；我也可以说“拿我的某个项目举个例子”｜在用",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "学习书笔",
   "source_phrase": "新资料先审再用｜现成课程资料有更新、网上有新说法，老师先读，再定不改、换例子、调顺序还是改深度；讲错的在讲义里点破｜说“有新的课程资料了，看看要不要改课”｜在用",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "写讲义｜每课一篇网页讲义，人话加表格，英文术语后面跟中文；每节末尾有问题和折叠答案，先答再看，容易混的词配速记；会变的事实查一手资料，开头写知识截至哪天；前一天下课后按反馈定稿｜上课时老师在 Chrome 打开当天网页，并给链接｜在用",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双气泡",
   "source_phrase": "独立审稿｜新技术的主干篇写完，请没看过前面对话的新会话复核；开课前 Opus 和 Astra 各做一次终审｜老师自己安排，不用我审｜在用",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "source_phrase": "上课和练习",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "每天一课｜一天只给一篇，开头说今天解决什么，分小段讲；课末说清今天完成没有、没完成的挪到哪天｜说“今天学哪一课”或“接着上次讲”｜在用",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "真调云端模型｜课上的练习程序经本机转发口调阿里云百炼的千问，密钥由密码中心注入，不进课程文件｜老师课前开、下课关；练习程序连 127.0.0.1:18765｜在用",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
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
   "source_phrase": "亲手跑一次｜9 个动手实验：6 课各有一步我亲手跑的真实调用，1 次本机测速，2 次完整的小验证（知识问答、录音复核各一次，跑一次、改一次）｜讲到那一课时老师带着跑｜待验收",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "配套练习｜13 组代码练习，每组有说明、结果文件和离线测试，可以原样重跑｜讲到对应的课时打开那一组｜待验收",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "Java 每日一页｜每天一页网页：一两个知识点和自测题；共 40 个知识点｜说“出今天的 Java 每日一页”，看完在对话里口述｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "算法题和每周抽问｜算法题 40 道，用 Java 自己写，AI 可以讲思路；每周课上抽问 10 分钟，不打分｜10 月中旬起每天一道；说“考我几道上周学的”｜待验收",
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
   "asset": "_library/titles/title-1fa9782509dcd89fa521.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1fa9782509dcd89fa521",
   "title_text": "全部功能（一）",
   "sha256": "1e5c4bf3fc00872afca728b814f1668ab6b1e2967adb3559b022ca0afd645e7f",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（一）

图例：● 在用（绿）　● 待验收（黄，做好了、还没在真实使用里验过）　○ 待实施（空心绿圈）　● 没用过（灰）　● 说不准（浅灰）　✕ 已停用

**排课和备课**
| 功能 | 能帮我做什么 | 怎么用 | 状态 |
|---|---|---|---|
| 排学习路线 | 定先后顺序、每段讲多深；路线分段，每课写明学完要能讲清的问题 | 说“按现在的进度排接下来怎么学”；大纲我认可了才按它讲 | 在用 |
| 结合实际讲 | 放进一个贯穿全课的实际案例里讲：先讲谁遇到什么问题、原来怎么做，再讲怎么解决 | 说“这段没听懂，拿实际场景重讲” | 在用 |
| 拿我的项目举例 | 用我亲手做过的项目举例，先按当时的源码重核，只读不改 | 老师自己挑；我也可以说“拿我的某个项目举个例子” | 在用 |
| 新资料先审再用 | 现成课程资料有更新、网上有新说法，老师先读，再定不改、换例子、调顺序还是改深度；讲错的在讲义里点破 | 说“有新的课程资料了，看看要不要改课” | 在用 |
| 写讲义 | 每课一篇网页讲义，人话加表格，英文术语后面跟中文；每节末尾有问题和折叠答案；会变的事实查一手资料，开头写知识截至哪天；前一天下课后按反馈从 Markdown 草稿定稿成网页，同名 .json 是唯一现行讲义，旧 Markdown 只留在 Git 历史 | 上课时老师在 Chrome 打开当天网页，并给链接 | 在用 |
| 独立审稿 | 主干篇写完，请没看过前面对话的新会话复核；定稿前 Opus 和 Astra 各做一次终审 | 老师自己安排，不用我审 | 在用 |

**上课和练习**
| 功能 | 能帮我做什么 | 怎么用 | 状态 |
|---|---|---|---|
| 每天一课 | 一天只给一篇，开头说今天解决什么，分小段讲；课末说清今天完成没有、没完成的挪到哪天 | 说“今天学哪一课”或“接着上次讲” | 在用 |
| 练习调云端接口 | 练习程序经本机转发口调云端接口，密钥由密码中心注入，不进课程文件 | 老师课前开、下课关；练习程序连 127.0.0.1:18765 | 在用 |
| 亲手跑一次 | 关键处有一步我亲手跑，另有完整的小验证（跑一次、改一次） | 讲到那一课时老师带着跑 | 待验收 |
| 配套练习 | 13 组代码练习，每组有说明、结果文件和离线测试，可以原样重跑 | 讲到对应的课时打开那一组 | 待验收 |
| 每日一页 | 每天一页网页：一两个知识点和自测题 | 说“出今天的每日一页”，看完在对话里口述 | 待验收 |
| 开头抽问 | 每课开头约 10 分钟抽 3–5 道以前的题，先最近卡住的、再刚学的、再一道隔得最久的；不加课后作业，题单只记必要状态，不打分 | 老师每课开头做，也可以说“考我几道以前的题” | 待验收 |

::screen{#learning-10 section="features"}

```typeset
{
 "screen": {
  "id": "learning-10",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：左上标题，下面按功能组排成宽表格：每组的组名是表格上方一行粗体绿色小标题（不单独占一列），组名左边一个小水彩图标；表格四列：功能、能帮我做什么、怎么用、状态；状态一列画对应颜色的小圆点加两个字。每行最左一个很小的水彩图标。两组上下排，组间留一点空。本屏两组：反馈和纠错（图标一个问号气泡）、接着学（图标两截接上的绳子）。",
  "portrait": "竖版：标题；每组组名一行；表格改成一行一个功能的小卡片：功能名加状态圆点一行，下面“能帮我做什么”“怎么用”各一行。",
  "links": [],
  "anchors": [
   {
    "id": "g-feedback",
    "text": "反馈和纠错"
   },
   {
    "id": "f-question",
    "text": "凭直觉质疑"
   },
   {
    "id": "f-fix-all",
    "text": "讲错就改、一次改齐"
   },
   {
    "id": "f-spaced",
    "text": "隔一段再讲一遍"
   },
   {
    "id": "f-feedback-log",
    "text": "记下讲了什么"
   },
   {
    "id": "g-continue",
    "text": "接着学"
   },
   {
    "id": "f-resume",
    "text": "换对话也接着学"
   },
   {
    "id": "f-fallback-teacher",
    "text": "换老师也接着学"
   },
   {
    "id": "f-progress",
    "text": "学习进度"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "learning-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "全部功能（二）"
    },
    {
     "type": "table",
     "columns": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "反馈和纠错"
    },
    {
     "type": "table",
     "columns": 4,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "接着学"
    }
   ],
   "notes": "采用批准 learning-10-h 替换图。没有图例；2张满宽表格大卡上下，组标题在各表顶部左侧、旁边组图标，卡角叶子；表4列，功能行小图标左、状态圆点右。反馈4行，接着学3行。不要按inventory虚增status_legend。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "全部功能（二）"
    },
    {
     "type": "table",
     "columns": 1,
     "layout": "feature_rows",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "反馈和纠错"
    },
    {
     "type": "table",
     "columns": 1,
     "layout": "feature_rows",
     "illustration": "none",
     "icons": "none",
     "text_ref": "接着学"
    }
   ],
   "notes": "v标题、书桌书本/电脑插画、反馈组4卡（图标左）；v2以接着学组标题起3卡整宽，这3卡无行插画。功能名/状态在同一行，其余两字段纵排。两组图标方式不同来自原图，不能统一加图。没有图例，不能补一个。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：移除手机方向额外的书本主插画块，横竖全部功能构图保持一致；未改定稿内容。"
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
   "source_phrase": "反馈和纠错",
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
   "source_phrase": "凭直觉质疑｜说一句“感觉不对”就行；老师找到具体是哪一处，按证据判断，不因为被质疑就改口｜直接说“这里怪怪的”｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "学习书笔",
   "source_phrase": "讲错就改、一次改齐｜改讲法或改内容，顺着找出受影响的讲义、草稿、练习和题目一起改，在对话里说清改了什么｜指出哪里不懂或前后矛盾｜在用",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
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
   "source_phrase": "隔一段再讲一遍｜核心内容在后面的课换个场景让我先凭记忆讲，卡住再回看；间隔按我的真实表现调，不按固定天数｜老师安排；我也可以说“先别讲新的，把上次那段再过一遍”｜待验收",
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
   "source_phrase": "记下讲了什么｜实际讲了哪篇、我当时的反馈，简要记下来，只给 AI 看，免得重复；不记我的原话全文｜老师记，我不用填表｜在用",
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
   "source_phrase": "接着学",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双气泡",
   "source_phrase": "换对话也接着学｜新对话先读“现在停在哪”的那份文件，从停下的地方接着讲，不照旧计划重来｜直接说“接着上次讲”｜在用",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "source_phrase": "换老师也接着学｜Claude 用不了时，GPT-6 Astra Max 按同一套文件接着教，不重开进度｜在 Codex 里说“接着上次讲”｜待验收",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "学习书笔",
   "source_phrase": "学习进度｜学完的课记日期，每个上课日记一条：我报的学习时长（没报就空着）、讲了哪几课、练习做了几道（只记数量，不算正确率）；学习方法页读这一份｜老师每个上课日下课时问我学了多久，一起更新｜在用",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/39-main-learning-clean.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-learning",
   "source_phrase": "横版画面：左上标题，下面按功能组排成宽表格：每组的组名是表格上方一行粗体绿色小标题（不单独占一列），组名左边一个小水彩图标；表格四列：功能、能帮我做什么、怎么用、状态；状态一列画对应颜色的小圆点加两个字。每行最左一个很小的水彩图标。两组上下排，组间留一点空。本屏两组：反馈和纠错（图标一个问号气泡）、接着学（图标两截接上的绳子）。",
   "sha256": "6783142750756868f710b07ddd24707f33da4acbd83331629c187aab2a444720",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-6077b0983fba8f66cbc2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6077b0983fba8f66cbc2",
   "title_text": "全部功能（二）",
   "sha256": "f724d6f0a4ff0694c872b78338e32cb65ae469244152a161c7209e327a864e5c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（二）

**反馈和纠错**
| 功能 | 能帮我做什么 | 怎么用 | 状态 |
|---|---|---|---|
| 凭直觉质疑 | 说一句“感觉不对”就行；老师找到具体是哪一处，按证据判断，不因为被质疑就改口 | 直接说“这里怪怪的” | 在用 |
| 讲错就改、一次改齐 | 改讲法或改内容，顺着找出受影响的讲义、草稿、练习和题目一起改，在对话里说清改了什么 | 指出哪里不懂或前后矛盾 | 在用 |
| 隔一段再讲一遍 | 讲过的内容在后面的课换个场景再问；下次什么时候问，记在开头抽问的题单里 | 老师安排；我也可以说“先别讲新的，把上次那段再过一遍” | 待验收 |
| 记下讲了什么 | 实际讲了哪篇、我当时的反馈，简要记下来，只给 AI 看，免得重复；不记我的原话全文 | 老师记，我不用填表 | 在用 |

**接着学**
| 功能 | 能帮我做什么 | 怎么用 | 状态 |
|---|---|---|---|
| 换对话也接着学 | 新对话先读“现在停在哪”的那份文件，从停下的地方接着讲，不照旧计划重来 | 直接说“接着上次讲” | 在用 |
| 换老师也接着学 | Claude 用不了时，GPT-6 Astra Max 按同一套文件接着教，不重开进度 | 在 Codex 里说“接着上次讲” | 待验收 |
| 学习进度 | 学完的课记日期，每个上课日记一条：我报的学习时长（没报就空着）、讲了哪几课、练习做了几道（只记数量，不算正确率） | 老师每个上课日下课时问我学了多久，一起更新 | 在用 |

::screen{#learning-11 section="history"}

```typeset
{
 "screen": {
  "id": "learning-11",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左上标题。一条从左到右的水彩时间轴，像一条慢慢上坡的小路，六个节点，每个节点一个小水彩图标（一株刚冒芽的小苗、一叠讲义、一张铺开的路线图、一个工具箱、一叠整齐的讲义加一个绿色对勾、一扇打开的教室门）；节点上方是日期（粗体绿色），下方两三行字。最后一个节点比其他的大一点、颜色更亮。时间轴下面横跨整屏一行浅绿底小字（最后那一句）。",
  "portrait": "竖版：标题；时间轴改成从上到下，日期在左、字在右；最后那一句一行。",
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
     "size": "medium",
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "direction": "horizontal",
     "columns": 6,
     "illustration": "above_card",
     "connector": "ribbon",
     "highlight": [
      6
     ],
     "text_ref": "8 月 26 日",
     "open_nodes": true,
     "path": "ascending",
     "icons": [
      "_library/icons/绿叶装饰.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "讲义的毛病以后"
    }
   ],
   "notes": "采用批准 learning-11-h。6节点一排沿逐渐上坡的小路，图在文字卡外上方，日期在图下/正文上；最后课堂门图更大、圆点发亮，细绿路尾有箭头。无分卡边框，文字开放排列。整屏章标题按追加规则居中；末尾满宽浅绿条两侧叶子。timeline默认卡框需请求取消成开放节点。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮实际采用open_nodes去节点框，横版path=ascending，按原文日期顺序保留。末节点独立尺寸及路尾箭头仍待实现。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "highlight": [
      6
     ],
     "text_ref": "8 月 26 日",
     "open_nodes": true,
     "icons": [
      "_library/icons/绿叶装饰.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "讲义的毛病以后"
    }
   ],
   "notes": "6节点单列，细绿线和空心圆点在卡外左侧；每卡左小水彩图、右日期/说明，第6日期和门图稍大、底浅绿，圆点发亮。无箭头。末尾说明满宽浅绿条。日期组是stats节点，text_ref从第一日期定位，不把日期误排成普通数字卡。\n本轮复用前任看图后写出的文字构图证据，按screens.jsonl及定稿文字核对；本轮未查看图片。前任构图与scene不同处保留已有原图结论。扩展字段需逐项核对实际生效，缺素材/兜底/未实现构图不以程序pass冒充完成。\n本轮实际采用open_nodes去节点框，横版path=ascending，按原文日期顺序保留。末节点独立尺寸及路尾箭头仍待实现。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：居中章节标题统一声明medium；现标题图不消费此档位，需按实际DOM另记未完成。"
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
   "source_phrase": "一株刚冒芽的小苗",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "学习书笔",
   "source_phrase": "9 月 5–14 日 写了第 01–06 篇讲义，边读边交流。",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
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
   "source_phrase": "9 月 16–19 日 我要求先交一份我能看懂的课程大纲，再开讲；技术边学边串进实际场景。路线先定下来。",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "9 月 27 日 开课前把整个项目审了一遍；大纲改到第五版，我认可；定下从零讲起；搭好课上真调模型的本机转发口；Astra 开始搭练习。",
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
   "asset": "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "学习书笔",
   "source_phrase": "9 月 28 日 28 篇讲义全部写完；内容终审；现成课程资料逐课对照；新增学习进度，给网站驾驶舱读（10 月 1 日起改在学习方法页看）。备课完成。",
   "sha256": "ed8e762f9bcc6fd578a8f0ce9e8c5f65c8b59c9bf8551e33dfb34daebb770ff1",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "9 月 29 日 第一课。",
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

**8 月 26 日**｜建这个项目。AI 当按需的老师和协作者，不做督促打卡的教练程序。

**9 月 5–14 日**｜写了最初几篇讲义，边读边交流。

**9 月 16–19 日**｜定下先交一份我能看懂的大纲、我认可了再讲；路线先定下来。

**9 月 27 日**｜把整个项目审了一遍，大纲经我认可；搭好练习用的本机转发口；Astra 开始搭练习。

**9 月 28 日**｜讲义草稿写完并做内容终审；现成课程资料逐篇对照；新增学习进度文件。

**10 月 7 日**｜项目规则更新到现在这一版，开头抽问和题单写进规则。

讲义的毛病以后在上课时发现、当场改；我听不懂或觉得不对就直接说。
