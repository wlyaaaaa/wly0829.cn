---
{
 "title": "事实来源与任务上下文",
 "kind": "rule-topic",
 "url": "/rules/context-sources/",
 "tagline": "事实找谁、哪些项目冻结、长任务怎么接着做。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "points",
   "label": "要点"
  },
  {
   "id": "original",
   "label": "原文"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "rule-context-sources",
  "kind": "rule-topic",
  "title": "事实来源与任务上下文",
  "url": "/rules/context-sources/",
  "tagline": "事实找谁、哪些项目冻结、长任务怎么接着做。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E331",
   "commit": "985a1c35a97768f86014870625702364d994b55d",
   "ruleset_sha256": "ff01e695160a44b27a8164efa5a0d2b1fb53f733d0ba2a8c6a1b7da86b411103",
   "activated_at": "2026-10-31T07:37:25.088872+08:00",
   "file": "sources/rules/docs/contracts/agents.context-sources.md",
   "sha256": "6f9ecadfa0079f844e8e90a19715675acf569f483042af5b515d131fd18497c8",
   "public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3"
  },
  "explanation_based_on": {
   "release": "E331",
   "sha256": "6f9ecadfa0079f844e8e90a19715675acf569f483042af5b515d131fd18497c8"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：林间小路上几片叶子缓缓飘落；三座小木屋的窗子依次亮起暖光又暗下；路口三叉指路牌的三只箭头轮流微微发亮；路边贴着雪花封条的小木箱上，霜花轻轻闪一下；摊开的厚书被风翻过两页，绿色书签始终夹在原处、尾巴轻轻摆动；背景淡水彩纸纹缓慢流动。全程不出现任何新文字，小牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "highlights": [],
   "live": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E257（北京时间 10 月 11 日 13:02 起生效）",
     "meaning": "本页人话要点对齐的规则版本和它开始生效的时间；原文区的版本标注由拼页程序按拼页时生效的版本生成",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：release_id=E257，activated_at_utc=2026-10-11T05:02:36.7738409+00:00；原文 sha256=c6dd00ecb9cba5da30911d74f0cc72ee651435dc1307a3bcbdf9b3d1e8679d30",
     "screens": [
      "rule-context-sources-08"
     ]
    },
    {
     "id": "n-frozen-tasks",
     "text": "7 个计划任务，9 月 28 日现场查都是“已停用”",
     "meaning": "冻结项目（OpenClaw 网关、OpenClaw 备份、微信历史桥）在 Windows 计划任务里的任务数和状态",
     "as_of": "2026-09-28",
     "source": "写稿时 Get-ScheduledTask 现场读：OpenClaw Gateway / Heartbeat / Memory Backup / Update、OpenClawGateway AutoPush、WeFlow Watchdog、WeFlow Secondary Watchdog 共 7 个，State 全是 Disabled；E:\\PCConfig\\registries\\tasks.json 同样 7 个 enabled=false",
     "screens": [
      "rule-context-sources-03"
     ]
    },
    {
     "id": "n-hidden-frozen",
     "text": "11 个冻结项目或备份仓库；保留各自实际名称",
     "meaning": "当前 E221 冻结名单的完整条目数",
     "as_of": "2026-10-07",
     "source": "sources/rules/docs/contracts/agents.context-sources.md 的冻结名单表，共 11 行",
     "screens": [
      "rule-context-sources-03",
      "rule-context-sources-08"
     ]
    },
    {
     "id": "n-occasional",
     "text": "11 项：10 个仓库加 1 个功能",
     "meaning": "偶用档名单的项数；曲面屏叠加层是 PC-Panel-Hub 仓库里的一个功能",
     "as_of": "2026-09-29",
     "source": "E190 原文第 52 行按“、”切分共 11 项，其中 10 项带仓库名，1 项写“仓库里的一个功能，仓库本身按日用”（Gemini 记忆备份已从偶用移进冻结名单）",
     "screens": [
      "rule-context-sources-04"
     ]
    },
    {
     "id": "n-decisions",
     "text": "9 月 28 日已有 98 节",
     "meaning": "决定文档《本人的决定原话》里二级小节（## 开头）的个数",
     "as_of": "2026-09-28",
     "source": "grep -c \"^## \" E:\\.agents\\docs\\owner-decisions.md = 98（北京时间 9 月 28 日写稿时，文件 2,239 行）",
     "screens": [
      "rule-context-sources-07"
     ]
    },
    {
     "id": "n-weekly",
     "text": "北京时间每周一 13:00",
     "meaning": "现在排着的每周基座体检的时间",
     "as_of": "2026-10-11",
     "source": "E:\\Data\\AppData\\Codex\\automations\\github\\automation.toml：rrule=RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=5;BYMINUTE=0;BYSECOND=0;DTSTART=20261005T050000Z（无 COUNT），model=gpt-6.1-sol，reasoning_effort=ultra，status=ACTIVE；北京时间 2026-10-11 13:35:19 核指纹 SHA256=e991091ccbed1d7098176e85638f194276ced5ddb8e52860164336dc3141c417；运行件非 Git，登记来源 PCConfig HEAD=2b74c12183b3bdb202b30e1d3ede0e93ff848dee；任务 name/prompt 仍保留四周稳定期与 Astra 文句，和实际字段存在冲突，未当成本次运行验收",
     "screens": [
      "rule-context-sources-07"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Codex、Claude 和它们派出的子代理开工核验后从活动版本读它。",
     "source": "Invoke-EAgentRulesRelease.ps1 返回的 required_rule_paths.context_sources_contract；rules-catalog.json 的 agents.context-sources 条目"
    },
    {
     "id": "r-index-frozen",
     "with": "github-local-index",
     "direction": "被读",
     "flow": "GitHub 项目总索引的生成器从活动版本的“冻结的项目”一节读冻结名单，给仓库标冻结状态；总索引里的身份和同步状态不授予维护许可。",
     "source": "E:\\GitHub总索引\\AGENTS.md 第 15 行"
    },
    {
     "id": "r-cockpit-tiers",
     "with": "pcconfig",
     "direction": "被读",
     "flow": "电脑配置与恢复里的驾驶舱程序先核对活动规则文件的 sha256，再解析“冻结的项目”和“三档维护”两张表，给每个项目标日用、偶用或存档；冻结的项目不去读它的仓库。",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\public_dashboard_projects.py 第 24–58、594–598 行；public_dashboard_sources.py 第 62–65 行；test_public_dashboard.py 第 1025–1092 行"
    },
    {
     "id": "r-rescue-source",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "急救步骤的来源在电脑配置与恢复，网站照它生成，电脑离线时网站上的急救页也要能读。",
     "source": "E187 原文第 64 行；E:\\PCConfig\\docs\\recovery\\desktop-freeze-rescue.md；决定文档“个人网站：电脑离线不出 502”一节"
    },
    {
     "id": "r-site",
     "with": "remote-control",
     "direction": "交给",
     "flow": "给本人看的说明、指南和急救步骤统一由网站 wly0829.cn 从各自唯一来源生成，仓库 README 只给 AI 看。",
     "source": "E187 原文第 58、64 行（决定 FZ7）；manifest 里 remote-control 的仓库是 wlyaaaaa/wly0829.cn"
    },
    {
     "id": "r-aicli",
     "with": "ai-cli-profile-manager",
     "direction": "交给",
     "flow": "第三方 AI 命令行工具的长任务由 AICLI 和具体项目负责接续，不交给个人技能。",
     "source": "E187 原文第 60 行；E:\\Projects\\Tools\\ai-cli-profile-manager\\README.md 第 1 行（AICLI 是 AI 命令行启动与配置工具）"
    },
    {
     "id": "r-explain",
     "with": "personal-expression",
     "direction": "交给",
     "flow": "怎么跟本人说话的教训，经 explain-to-me 技能按个人表达项目的流程维护。",
     "source": "E187 原文第 74 行；manifest 里 personal-expression 的 skills 含 explain-to-me"
    },
    {
     "id": "r-weekly",
     "with": "agents",
     "direction": "执行",
     "flow": "Codex 自动任务“三基座治理（4 周稳定期每周体检）”按本专题做每周查漏：挪记忆区、补漏记的纠正、改掉抄原话和旧编号、用 Find-DuplicateContent.ps1 查重。",
     "source": "E:\\Data\\AppData\\Codex\\automations\\github\\automation.toml 的 prompt 第 4、5 步"
    },
    {
     "id": "r-dedupe",
     "with": "agents",
     "direction": "引用",
     "flow": "原文两处指向基座的查重工具 E:\\.agents\\tools\\Find-DuplicateContent.ps1。",
     "source": "E187 原文第 64、80 行"
    },
    {
     "id": "r-memory-off",
     "with": "agents",
     "direction": "引用",
     "flow": "两边记忆关闭的具体配置写在 Claude 适配（autoMemoryEnabled=false）和 Codex 适配（memories、generate_memories、use_memories=false）专题。",
     "source": "E187 agents.claude-adapter.md 第 62 行；agents.codex-adapter.md 第 11 行；C:\\Users\\10979\\.claude\\settings.json 第 31 行；C:\\Users\\10979\\.codex\\config.toml 第 69、2764–2765 行"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L24",
     "screen": "rule-context-sources-01",
     "text": "L24 冻结的项目"
    },
    {
     "target": "/rules/charter/#L25",
     "screen": "rule-context-sources-01",
     "text": "L25 三档维护"
    },
    {
     "target": "/rules/charter/#L30",
     "screen": "rule-context-sources-01",
     "text": "L30 决定写在找得到的地方"
    },
    {
     "target": "/projects/agents/",
     "screen": "rule-context-sources-01",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-context-sources-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/agents/",
     "screen": "rule-context-sources-02",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-context-sources-02",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/rules/charter/#L21",
     "screen": "rule-context-sources-02",
     "text": "约法 L21"
    },
    {
     "target": "/rules/charter/#L24",
     "screen": "rule-context-sources-03",
     "text": "约法 L24"
    },
    {
     "target": "/projects/codex-local-remote/",
     "screen": "rule-context-sources-03",
     "text": "Codex 远程"
    },
    {
     "target": "/projects/codex-agent-model-benchmark/",
     "screen": "rule-context-sources-03",
     "text": "CACB 模型评测"
    },
    {
     "target": "/projects/wechat-history-ai-bridge/",
     "screen": "rule-context-sources-03",
     "text": "微信历史桥 WeFlowBridge"
    },
    {
     "target": "/projects/openclaw/",
     "screen": "rule-context-sources-03",
     "text": "OpenClaw 网关"
    },
    {
     "target": "/projects/video-scaffold/",
     "screen": "rule-context-sources-03",
     "text": "视频制作"
    },
    {
     "target": "/rules/charter/#L25",
     "screen": "rule-context-sources-04",
     "text": "约法 L25"
    },
    {
     "target": "/projects/emerald-veil/",
     "screen": "rule-context-sources-04",
     "text": "emerald-veil"
    },
    {
     "target": "/projects/steam-millennium-config-backup/",
     "screen": "rule-context-sources-04",
     "text": "Steam 皮肤备份"
    },
    {
     "target": "/projects/typora-theme-pack/",
     "screen": "rule-context-sources-04",
     "text": "Typora 主题"
    },
    {
     "target": "/projects/meshclip-kit/",
     "screen": "rule-context-sources-04",
     "text": "meshclip-kit"
    },
    {
     "target": "/projects/pc-panel-hub/",
     "screen": "rule-context-sources-04",
     "text": "PC-Panel-Hub"
    },
    {
     "target": "/projects/work-delivery-copilot/",
     "screen": "rule-context-sources-04",
     "text": "工作交付"
    },
    {
     "target": "/projects/video-scaffold/",
     "screen": "rule-context-sources-04",
     "text": "视频制作"
    },
    {
     "target": "/projects/vault-tool/",
     "screen": "rule-context-sources-04",
     "text": "vault 加密工具"
    },
    {
     "target": "/cockpit/",
     "screen": "rule-context-sources-04",
     "text": "驾驶舱"
    },
    {
     "target": "/rules/charter/#L30",
     "screen": "rule-context-sources-05",
     "text": "约法 L30"
    },
    {
     "target": "/projects/ai-cli-profile-manager/",
     "screen": "rule-context-sources-05",
     "text": "AICLI"
    },
    {
     "target": "/projects/agents/#f-decisions",
     "screen": "rule-context-sources-06",
     "text": "决定文档"
    },
    {
     "target": "/projects/agents/#f-dedupe",
     "screen": "rule-context-sources-06",
     "text": "查重复段落"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-context-sources-07",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/codex-adapter/",
     "screen": "rule-context-sources-07",
     "text": "Codex 适配"
    },
    {
     "target": "/projects/agents/#f-weekly",
     "screen": "rule-context-sources-07",
     "text": "每周基座体检"
    },
    {
     "target": "/projects/agents/#f-dedupe",
     "screen": "rule-context-sources-10",
     "text": "Find-DuplicateContent.ps1"
    },
    {
     "target": "/rules/charter/#L30",
     "screen": "rule-context-sources-10",
     "text": "约法 L30"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-context-sources-10",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/codex-adapter/",
     "screen": "rule-context-sources-10",
     "text": "Codex 适配"
    },
    {
     "target": "/projects/github-index/",
     "screen": "rule-context-sources-01",
     "text": "GitHub 项目总索引"
    },
    {
     "target": "/how/#bases",
     "screen": "rule-context-sources-01",
     "text": "两个基座怎么配合 → 怎么协作"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "rule-context-sources-02",
     "text": "改项目前先核对"
    },
    {
     "target": "/projects/github-index/",
     "screen": "rule-context-sources-02",
     "text": "GitHub 项目总索引"
    },
    {
     "target": "/projects/personal-expression/",
     "screen": "rule-context-sources-03",
     "text": "个人表达"
    },
    {
     "target": "/projects/github-index/",
     "screen": "rule-context-sources-03",
     "text": "GitHub 项目总索引"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "rule-context-sources-03",
     "text": "改项目前先核对"
    },
    {
     "target": "/cockpit/",
     "screen": "rule-context-sources-03",
     "text": "驾驶舱"
    },
    {
     "target": "/cockpit/",
     "screen": "rule-context-sources-05",
     "text": "驾驶舱"
    },
    {
     "target": "/rules/capabilities-runtime/",
     "screen": "rule-context-sources-05",
     "text": "能力与运行方式"
    },
    {
     "target": "/rules/charter/#talk",
     "screen": "rule-context-sources-07",
     "text": "约法 L1–L6"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "sha256:aeb3e808d12ee5f91ccfae891f63d25f3950b552f57e0b42584ed44355913970"
   ],
   "unsure": [
    "冻结名单少放 4 行：Claude 9 月 28 日已定游戏求解、对齐数据集的名字在规则表里也不放，保持从严；表下说明已写进第 8 屏 text。",
    "原文里的 5 处 Markdown 链接画成〔〕链接、看得见的字不改：约法 L30 → /rules/charter/#L30；Claude 适配、Codex 适配 → 对应专题页；Find-DuplicateContent.ps1（两处）原文指向本机文件，E:\\.agents 是私有仓库、没有公开网址，改链到 AI 规则与技能基座项目页的功能锚点 /projects/agents/#f-dedupe（该页 registry 里有 f-dedupe“查重复段落”）。",
    "开头一屏的入口〔三个基座怎么配合 → 怎么协作〕链到 /how/#bases，这个锚点名是我起的，第 2 批要在“怎么协作”页建它（已写进 batch2.md）。",
    "原文“本人自己的事实存理解库明示”：“明示”按个人理解库里本人明确说过的那部分理解（理解库 AGENTS.md 里有“纯明示卡”“现行明示”的说法），写成“个人理解库里本人明确说过的那部分”；第 7 屏照原文另一句写“记在个人理解库”。",
    "原文“第三方 CLI 长任务由 AICLI 和具体项目负责接续”：写成“第三方 AI 命令行工具的长任务”，AICLI 按其 README 注成“本人的 AI 命令行启动与配置工具”。“第三方 CLI”具体指哪些工具，原文没列，我没展开。",
    "原文“生成区”写成“程序自动生成的文件”；“能力路由”写成“该用哪个能力”；“不建全景个人库”写成“不建包罗一切的个人资料库”；“checkpoint”写成“接续点”；“被机器的备份覆盖”写成“跟着整台电脑一起备份”。",
    "E190 原文已写明三基座治理只排四周稳定期（10 月 5–26 日共 4 次，第 4 次交本人评审，不自动续排），和实际排着的自动任务一致；第 7 屏照新原文写，“例：”只留每次的时间。audit.md 里记的“10 月 26 日以后规则和实际对不上”已不成立，audit.md 没改。",
    "要点屏里以“例：”开头的 5 句（45 个仓库、7 个停用的计划任务、总索引和驾驶舱读名单、视频制作放在 Archives 却是偶用、每周基座体检的排期）是原文没有、我核实过的实例，出处见 facts.md。",
    "第 4 屏“所以表里除了只写到一个功能的那一项，每一项后面都写着仓库名，程序才认得出是哪个仓库”：依据是驾驶舱解析代码要求每项有且只有一个反引号仓库名，和 9 月 28 日 07:19 的提交 216a17d“annotate occasional maintenance repository identities”；规则原文本身没说为什么写仓库名，这是我的推断性说明。",
    "全页都用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。",
    "sha256:465bb311414fd2d9c6c775a10617030f3bf507aa98f7ffb5fbb3b84964f2061a",
    "冻结名单新加的 Gemini 记忆备份、Claude 记忆备份没有自己的项目页，所以没加链接。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-context-sources/page.json",
  "sha256": "4d9f638c1b2470348f848948856769f79932c5dffb132c7ee2fa7c3cd72a1fab",
  "converted_at_beijing": "2026-10-31T11:19:47+08:00"
 }
}
---

::screen{#rule-context-sources-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“事实来源与任务上下文”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题，再下面介绍段。介绍段下面一张浅绿细边圆角卡片“先认几个词”，六个词条竖排，词条名粗体绿色，路径用等宽字体浅绿底小框。卡片下面一行“跳到：”后面六个圆角小按钮（白底浅绿描边绿字），排成一行或两行。右边约 45% 宽一幅水彩插画：一条林间小路通向三座并排的小木屋，屋檐下各挂一块木牌，分别写“E:\\.agents”“E:\\GitHub总索引”“E:\\PCConfig”；路口立着一块三叉指路牌（牌上不写字，只画箭头）。小路边一只盖着薄薄一层霜、贴着雪花小封条的木箱，箱上小牌“冻结”；木箱旁一本摊开的厚书，书页间夹一条绿色书签，书签尾巴上的小牌写“接续点”。插画里只有这五块小牌子上有字，text 里“E:\\.agents　E:\\GitHub总索引　E:\\PCConfig　冻结　接续点”这一行就是这五块牌子的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“三个基座之间谁把什么交给谁：”，右边一个显眼的按钮〔三个基座怎么配合 → 怎么协作〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；水彩插画（同横版，缩成整宽一幅，三座小木屋在上半、冻结木箱和夹书签的书在下半，五块小牌子的字不变）；介绍段；“先认几个词”卡片（六个词条一行一条）；“跳到：”六个按钮排三行、每行两个；最下面“怎么协作”横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "L24 冻结的项目",
    "href": "/rules/charter/#L24"
   },
   {
    "text": "L25 三档维护",
    "href": "/rules/charter/#L25"
   },
   {
    "text": "L30 决定写在找得到的地方",
    "href": "/rules/charter/#L30"
   },
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "事实找谁",
    "href": "/rules/context-sources/#p-sources"
   },
   {
    "text": "冻结的项目",
    "href": "/rules/context-sources/#p-frozen"
   },
   {
    "text": "三档维护",
    "href": "/rules/context-sources/#p-tiers"
   },
   {
    "text": "长任务接续",
    "href": "/rules/context-sources/#p-handoff"
   },
   {
    "text": "一样东西只存一处",
    "href": "/rules/context-sources/#p-single"
   },
   {
    "text": "纠正和经验记在哪",
    "href": "/rules/context-sources/#p-lessons"
   },
   {
    "text": "GitHub 项目总索引",
    "href": "/projects/github-index/"
   },
   {
    "text": "两个基座怎么配合 → 怎么协作",
    "href": "/how/#bases"
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
     "text_ref": "事实来源与任务上下文",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "55%"
    },
    {
     "type": "prose",
     "text_ref": "遇到一件事该去哪查；哪些项目冻结不碰、哪些只修报错；长任务停了怎么接着做；本人的原话和以后要遵守的做法各记在哪。",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "这是Codex和Claude共用的规则，管四件事：一是查一件事实该找哪个仓库，按需要一步步读，不乱翻也不瞎猜；二是哪些项",
     "row": "hero"
    },
    {
     "type": "glossary",
     "text_ref": "先认几个词",
     "whole_block": true,
     "columns": 1,
     "row": "hero"
    },
    {
     "type": "action_button",
     "text_ref": "跳到：",
     "columns": 3,
     "columns_v": 2,
     "row": "hero"
    },
    {
     "text_ref": "E:\\.agents",
     "type": "document_mock",
     "variant": "window",
     "base_asset": "_library/illustrations/事实来源五牌.png",
     "label_positions": [
      {
       "x": 12.508,
       "y": 26.561,
       "width": 14.342,
       "height": 6.244,
       "align": "center"
      },
      {
       "x": 43.353,
       "y": 24.281,
       "width": 13.621,
       "height": 5.253,
       "align": "center"
      },
      {
       "x": 73.674,
       "y": 26.561,
       "width": 14.014,
       "height": 6.541,
       "align": "center"
      },
      {
       "x": 15.652,
       "y": 70.466,
       "width": 18.009,
       "height": 7.532,
       "align": "center"
      },
      {
       "x": 71.84,
       "y": 88.404,
       "width": 18.664,
       "height": 7.334,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      },
      {
       "label_index": 4,
       "position_index": 4
      }
     ],
     "layout": "illustration_labels"
    },
    {
     "type": "notice",
     "text_ref": "两个基座与具体项目如何分工"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；QA04 修复：按审查第5条把跳转按钮改3列2行，保留原按钮全称和原字序。第4条路牌标签是定稿文字，不直接删去；图内定位缺口另提组件请求。\nmain-closer 2026-10-03T20:29:23+08:00：保全部图内原标签，以现有document_mock绑定唯一完整底图和final-label-geometry实测安全框；取消前置重复主体图，图解改整宽以满足长路径/小牌字高。SHA 04f59cba42618413fec0975b0425b266e64ec9443ad24d3c458cfbd0d28aaf65。此为AI排版补充，列new-looks待验收。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "illustration",
     "asset": "_library/illustrations/事实来源五牌.png",
     "size": "large",
     "align": "center",
     "target_width": "100%"
    },
    {
     "type": "chapter_title",
     "text_ref": "事实来源与任务上下文",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "遇到一件事该去哪查；哪些项目冻结不碰、哪些只修报错；长任务停了怎么接着做；本人的原话和以后要遵守的做法各记在哪。",
     "bold": true
    },
    {
     "type": "prose",
     "text_ref": "这是Codex和Claude共用的规则，管四件事：一是查一件事实该找哪个仓库，按需要一步步读，不乱翻也不瞎猜；二是哪些项"
    },
    {
     "type": "glossary",
     "text_ref": "先认几个词",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "action_button",
     "text_ref": "跳到：",
     "columns": 2,
     "columns_v": 2
    },
    {
     "type": "prose",
     "text_ref": "E:\\.agents",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "两个基座与具体项目如何分工"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。\nmain-closer 2026-10-03T20:29:23+08:00：保全部图内原标签，以现有document_mock绑定唯一完整底图和final-label-geometry实测安全框；取消前置重复主体图，图解改整宽以满足长路径/小牌字高。SHA 04f59cba42618413fec0975b0425b266e64ec9443ad24d3c458cfbd0d28aaf65。此为AI排版补充，列new-looks待验收。\nmain-closer 2026-10-03T20:36:28+08:00：实际文字Range超出真实安全牌框，竖版撤下坐标绑定，恢复原合法保字＋composition incomplete；不把单靠固定.tb框的旧机器pass当通过。safe DOM证据 main-closer/family-label-dom.json；横版实测安全绑定保留。\nmain-closer5 2026-10-04T07:00:58.635971+08:00：按Claude本轮裁定，手机首屏采用插画上、文字下；复用01-h既有无字插画，整幅100%宽等比缩放，不裁物件。原五/九标签改既有prose顺排于文字区，全部原字、motion及其它屏保全；不再请求插画牌面净区，也不更改任何素材ready。"
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
   "asset": "_library/illustrations/事实来源五牌.png",
   "fallback": false,
   "semantic_status": "context_five_original_targets_required",
   "key": "事实来源五牌",
   "source_phrase": "右边约 45% 宽一幅水彩插画：一条林间小路通向三座并排的小木屋，屋檐下各挂一块木牌，分别写“E:\\.agents”“E:\\GitHub总索引”“E:\\PCConfig”；路口立着一块三叉指路牌（牌上不写字，只画箭头）。",
   "sha256": "04f59cba42618413fec0975b0425b266e64ec9443ad24d3c458cfbd0d28aaf65",
   "status": "ready",
   "original_elements": [
    "一条林间小路通向三座并排的小木屋，屋檐下各挂一块木牌，分别画抽象短线的抽象图形抽象图形；路口立着一块三叉指路牌（牌上不写字，只画箭头"
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
   "asset": "rule-context-sources/rule-context-sources-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-01-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5c3f32ee791fa12cb29c",
   "title_text": "事实来源与任务上下文",
   "sha256": "67cc6133908c0f0885ab0b0a2ebe414dd0dd9766d5c4e1c1c5d76799a9872caa",
   "status": "ready",
   "source_box": [
    14,
    88,
    941,
    272
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 事实来源与任务上下文

**遇到一件事该去哪查；哪些项目冻结不碰、哪些只修报错；长任务停了怎么接着做；本人的原话和以后要遵守的做法各记在哪。**

这是 Codex 和 Claude 共用的规则，管四件事：一是查一件事实该找哪个仓库，按需要一步步读，不乱翻也不瞎猜；二是哪些项目冻结、AI 不主动碰，其余项目分“日用”“偶用”两档维护；三是上下文被压缩或换人接手后，长任务怎么接着做；四是本人的原话、以后要遵守的做法和本人自己的事实各只记一处，记在别的 AI 找得到的地方。它是约法〔L24 冻结的项目〕〔L25 三档维护〕和〔L30 决定写在找得到的地方〕的细则；授权、施工和执行结果不归这里管，各有专题。

**先认几个词**
- **两个基座**：整套系统最底下的两个仓库：〔AI 规则与技能基座〕（E:\.agents）管 AI 怎么做事，〔电脑配置与恢复〕（E:\PCConfig）管这台电脑和本机仓库的登记。原来的第三个〔GitHub 项目总索引〕已经冻结，有用的数据和程序并进了这两个基座。
- **冻结**：本人定了 AI 不主动看、不维护的项目；三档维护里叫“存档”。
- **原话存档**：Codex 和 Claude 的钩子把本人每条消息原样自动存下的地方；它不进对话上下文，要核对当时怎么说的，才按那条消息的编号（源消息 UUID）去查。以前按月分卷的《本人的决定原话》（E:\.agents\docs\owner-decisions\）现在只作历史，不再新增，也不当规则读。
- **副本**：同一段规则、事实或原话，在另一个文件里又抄了一遍。
- **接续点**：长任务做到一个自然段落时留下的状态，写清在哪、做到哪、还差什么；原文叫 checkpoint。
- **记忆区**：Codex 和 Claude 各自自动记笔记的地方，现在两边都已关闭。

跳到：〔事实找谁〕〔冻结的项目〕〔三档维护〕〔长任务接续〕〔一样东西只存一处〕〔纠正和经验记在哪〕

E:\.agents　E:\PCConfig　具体项目　冻结　接续点

两个基座与具体项目如何分工、谁把什么交给谁：〔两个基座怎么配合 → 怎么协作〕

::screen{#rule-context-sources-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-02",
  "section": "points",
  "title": "人话要点：事实找谁",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“四个家，各管各的事实”配一块三叉指路牌、“按需要一步步读”配一串由近到远的脚印、“基座的日常治理：修问题，不补跑备份”配一把扳手压着一张打了勾的回执。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画；以“例：”开头的句子用浅绿底的小条衬着，和规则本身区分开。左边一张大卡“四个家，各管各的事实”占约一半宽，四个“家”各占一行，名字粗体绿色；右边上下两张卡“按需要一步步读”“基座的日常治理：修问题，不补跑备份”。路径（E:\\ 开头的）和英文命令、配置名用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版（先左后右上、再右下）。字和横版完全一样。",
  "links": [
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "约法 L21",
    "href": "/rules/charter/#L21"
   },
   {
    "text": "改项目前先核对",
    "href": "/skills/project-entry-gate/"
   },
   {
    "text": "GitHub 项目总索引",
    "href": "/projects/github-index/"
   }
  ],
  "anchors": [
   {
    "id": "p-sources",
    "text": "事实找谁"
   },
   {
    "id": "p-homes",
    "text": "两个基座和具体项目"
   },
   {
    "id": "p-read-order",
    "text": "按需要一步步读"
   },
   {
    "id": "p-base-upkeep",
    "text": "基座治理：修问题，不补跑备份"
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
     "text_ref": "人话要点·事实找谁",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "两个基座和具体项目",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "按需要一步步读",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "基座治理：修问题，不补跑备份",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·事实找谁",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "两个基座和具体项目",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "按需要一步步读",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "基座治理：修问题，不补跑备份",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "纸箱对勾",
   "source_phrase": "一块三叉指路牌、“按需要一步步读”配一串由近到远的脚印、“基座的日常治理：修问题，不补跑备份”配一把扳手压着一张打了勾的回执",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-80377ea1c28c68982dc0.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-02-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-80377ea1c28c68982dc0",
   "title_text": "人话要点 · 事实找谁",
   "sha256": "8a1d4beaaad7c0312c86cd0311d4d8af41c750d3071816ab065afc0bf7b5de64",
   "status": "ready",
   "source_box": [
    94,
    50,
    846,
    189
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 事实找谁

### 两个基座和具体项目
- **〔AI 规则与技能基座〕**（E:\.agents）：AI 的行为规则、授权、该用哪个能力、规则发布、本人的技能和插件、项目之间怎么协作。动一个仓库前要做的核对也归这里：推送前的检查、找公开仓库配的私人配套库、GitHub 上删库、转移和改公开的执行入口，都在它的〔改项目前先核对〕技能里。
- **〔电脑配置与恢复〕**（E:\PCConfig）：机器上的路径、端口、计划任务、运行环境、数据从哪来、迁移、备份和恢复；本机每个仓库放在哪个文件夹、网站上显示哪些项目、公开仓库配哪个私人配套库，也登记在这里。
- **具体项目**：业务是什么意思、领域数据、兼容、怎么启动、测试、部署，以及程序自动生成的文件。
- 原来专管仓库事实的〔GitHub 项目总索引〕已经冻结，不再算基座：它有用的登记和程序已经分别并进上面两处。
- 例：想知道某个仓库公开还是私有，直接在仓库里用 Git 和 GitHub 的命令现查；想知道它在本机哪个文件夹，查电脑配置与恢复的仓库位置登记；想知道某个计划任务停没停，查电脑配置与恢复的计划任务登记。

### 按需要一步步读
- 看到一个绝对路径，不等于要把两个基座全扫一遍。
- 普通项目先读从它所在文件夹一路往上的规则，和它自己的状态。
- 仓库公开还是私有、远端、分支、同步这类 Git 上的事实，在仓库里用 Git 和 GitHub 的命令现查；要推送、公开或删库，动手前按〔改项目前先核对〕技能检查。
- 只有机器上的事实会改变决定时，才问电脑配置与恢复；只有规则、能力或授权会改变决定时，才读规则与技能基座里对应的专题。
- 不知道就说不知道，不拿别处的资料去猜。

### 基座治理：修问题，不补跑备份
- 两个基座平时要做的，是发现并修好有事实依据的问题，不是去补跑备份。
- 计划任务机制正常时，只看它有没有按时跑、回执对不对（〔约法 L21〕）；不为了刷新“上次成功”的时间、让报表变绿，去额外跑一次备份。
- 已经证实的机制缺陷，在原项目里修好，再做对应的局部验证。
- 本人暂停的任务，保持暂停。
- 基座治理里说的“流量”，指代理用掉的流量；网站在阿里云上的流量归网站那边管。聊视频时说的“流量”，另按视频的意思理解。

::screen{#rule-context-sources-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-03",
  "section": "points",
  "title": "人话要点：冻结的项目",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“冻结了，AI 就不主动碰”配一只贴着雪花封条的小木箱（和开头插画同一只）、“冻结名单”配一张夹在小木板上的清单、“冻结不等于删”配一个上了霜的箱子旁边照常亮着绿灯的小备份硬盘。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画；以“例：”开头的句子用浅绿底的小条衬着，和规则本身区分开。左边一张大卡“冻结了，AI 就不主动碰”占约一半宽；右边上下两张卡“冻结名单”“冻结不等于删”。路径（E:\\ 开头的）和英文命令、配置名用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L24",
    "href": "/rules/charter/#L24"
   },
   {
    "text": "Codex 远程",
    "href": "/projects/codex-local-remote/",
    "locator_instances": {
     "h": {
      "input_sha256": "074124f2f2718b18a51d554311dfcd583897f2aafd4e1c9ee368dbafd0345005",
      "instances": [
       {
        "expected_rect": [
         1071,
         279,
         1210,
         308
        ],
        "confirm_region": true,
        "context_rect": [
         1071,
         279,
         1210,
         308
        ],
        "context_ocr_missing": true
       }
      ]
     }
    }
   },
   {
    "text": "CACB 模型评测",
    "href": "/projects/codex-agent-model-benchmark/",
    "locator_instances": {
     "h": {
      "input_sha256": "074124f2f2718b18a51d554311dfcd583897f2aafd4e1c9ee368dbafd0345005",
      "instances": [
       {
        "context_text": "全o业话",
        "context_rect": [
         1077,
         281,
         1415,
         304
        ],
        "expected_rect": [
         1245,
         284,
         1371,
         302
        ],
        "confirm_region": true,
        "underline_rect": [
         1245,
         306,
         1371,
         307
        ]
       }
      ]
     }
    }
   },
   {
    "text": "微信历史桥 WeFlowBridge",
    "href": "/projects/wechat-history-ai-bridge/",
    "locator_instances": {
     "h": {
      "input_sha256": "074124f2f2718b18a51d554311dfcd583897f2aafd4e1c9ee368dbafd0345005",
      "instances": [
       {
        "expected_rect": [
         1071,
         310,
         1358,
         338
        ],
        "confirm_region": true,
        "context_rect": [
         1071,
         310,
         1358,
         338
        ],
        "context_ocr_missing": true
       }
      ]
     }
    }
   },
   {
    "text": "OpenClaw 网关",
    "href": "/projects/openclaw/",
    "locator_instances": {
     "v": {
      "input_sha256": "d72e0bc48d86509ebe3dda9000c1cc30978905d1175a9e132020cca2127dd17f",
      "instances": [
       {
        "context_text": "微信历史桥 WeFlowBridge 、OpenClaw 网关",
        "context_rect": [
         108,
         1808,
         830,
         1846
        ],
        "expected_rect": [
         577,
         1813,
         793,
         1844
        ]
       }
      ]
     },
     "h": {
      "input_sha256": "074124f2f2718b18a51d554311dfcd583897f2aafd4e1c9ee368dbafd0345005",
      "instances": [
       {
        "expected_rect": [
         1385,
         310,
         1572,
         338
        ],
        "confirm_region": true,
        "context_rect": [
         1385,
         310,
         1572,
         338
        ],
        "context_ocr_missing": true
       }
      ]
     }
    }
   },
   {
    "text": "视频制作",
    "href": "/projects/video-scaffold/"
   },
   {
    "text": "个人表达",
    "href": "/projects/personal-expression/"
   },
   {
    "text": "GitHub 项目总索引",
    "href": "/projects/github-index/"
   },
   {
    "text": "改项目前先核对",
    "href": "/skills/project-entry-gate/"
   },
   {
    "text": "驾驶舱",
    "href": "/cockpit/"
   }
  ],
  "anchors": [
   {
    "id": "p-frozen",
    "text": "冻结的项目",
    "locator_text": {
     "h": "人话要点 · 冻结的项目",
     "v": "人话要点 · 冻结的项目"
    }
   },
   {
    "id": "p-frozen-rules",
    "text": "冻结了，AI 就不主动碰",
    "locator_text": {
     "h": "本人没主动提这个项目的具体需求时，AI 不主动看它的代码，也不研究、审计、修复、升级或优化（约法 L24）。"
    }
   },
   {
    "id": "p-frozen-list",
    "text": "冻结名单",
    "locator_instances": {
     "h": {
      "input_sha256": "074124f2f2718b18a51d554311dfcd583897f2aafd4e1c9ee368dbafd0345005",
      "instances": [
       {
        "context_text": "冻结名单",
        "context_rect": [
         1066,
         219,
         1206,
         258
        ],
        "expected_rect": [
         1066,
         219,
         1206,
         258
        ]
       }
      ]
     }
    }
   },
   {
    "id": "p-frozen-not-deleted",
    "text": "冻结不等于删"
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
     "text_ref": "人话要点·冻结的项目",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "冻结了，AI就不主动碰",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "冻结名单",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "冻结不等于删",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·冻结的项目",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "冻结了，AI就不主动碰",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "冻结名单",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "冻结不等于删",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "纸箱对勾",
   "source_phrase": "一只贴着雪花封条的小木箱（和开头插画同一只）、“冻结名单”配一张夹在小木板上的清单、“冻结不等于删”配一个上了霜的箱子旁边照常亮着绿灯的小备份硬盘",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-3261cfac23cf368bbc75.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-context-sources-03-v\\round-01\\candidate-1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-3261cfac23cf368bbc75",
   "title_text": "人话要点 · 冻结的项目",
   "sha256": "67bd8c0d4dc03ed61b366693cffa85cae4b3fb5c51086d8ce092e65a079ecc97",
   "status": "ready",
   "source_box": [
    60,
    120,
    877,
    316
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 冻结的项目

### 冻结了，AI 就不主动碰
- 本人没主动提这个项目的具体需求时，AI 不主动看它的代码，也不研究、审计、修复、升级或优化（〔约法 L24〕）。
- 冻结项目的计划任务停用，换电脑时也不重建。例：OpenClaw 网关、它的备份和微信历史桥的 7 个计划任务，9 月 28 日现场查都是“已停用”。
- 本人说“全部项目”“全局完善”这类话时，默认不包括冻结项目，也不先读它们的代码再决定包不包括。
- 本人点名提了具体需求，就只按这次需求取材和处理；不用本人说“解冻”，处理完也不因此恢复日常维护。只提到项目名字，不算提需求。
- 别的项目引用了它、模型升级了、发现它能优化，都不是去碰它的理由；真需要改它时，说清依赖和缺口，等本人提出。
- 要认出和排除冻结项目时，只读最少的身份和状态信息。

### 冻结名单
- 〔Codex 远程〕、〔CACB 模型评测〕（整个项目）、〔微信历史桥 WeFlowBridge〕、〔OpenClaw 网关〕和它的备份仓库、两台电脑的剪贴板同步 MeshClip Kit（停用留档，原来在偶用名单里）、已经退役留档的 Gemini 记忆备份和 Claude 记忆备份，以及〔个人表达〕（怎么跟本人说话的规矩已经分别归进约法、个人理解库和各个技能，原始样本另外留着）和〔GitHub 项目总索引〕（仓库事实改成现查，本机仓库位置登记并进电脑配置与恢复，删库改公开的核对并进〔改项目前先核对〕技能）；冻结名单和仓库标识见本页的活动规则公开副本。
- 名单只在这一处维护，本人新增或更正时改这里；别的基座都来这里读，不另存第二份。仓库名比对不分大小写。
- 冻结一个项目要说清真实的理由：为什么不值得再单独维护（被什么替代了、依赖没了、AI 现查就能做到、单独维护反而添乱、实际没人用），以及它原来的用处现在由谁承担。“已存档”“内容已归位”“不再维护”只说了结果，不算理由；说不清就问本人。网站项目总页上冻结卡片的“停下原因”也照这个写。
- 例：〔驾驶舱〕读这份名单，冻结的项目只标“冻结”，不去读它的仓库。

### 冻结不等于删
- 冻结管的只是 AI 维护范围，和文件在哪、跑没跑、能不能恢复、有没有备份是两回事。
- 电脑配置里写着在用、还被别的东西依赖、文件夹还在、Git 能正常同步，都不说明可以维护；反过来，放在备份仓库或 Archives 文件夹里，也不说明已经冻结。例：〔视频制作〕的仓库放在 E:\Projects\Archives 下，却是偶用档，不是冻结。
- 冻结不删资料：冻结项目的数据照常留在备份里，也照常跟着整台电脑一起备份；停用的只是它自己的计划任务。

::screen{#rule-context-sources-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-04",
  "section": "points",
  "title": "人话要点：三档维护",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“三档各怎么维护”配三级小木台阶（最高一级插一片新绿叶、中间一级放一把小扳手、最低一级放那只冻结小木箱）、“偶用名单”配一个半开的工具抽屉、“谁在读这张表”配一块小仪表盘。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画；以“例：”开头的句子用浅绿底的小条衬着，和规则本身区分开。上行两张卡：左“三档各怎么维护”，三档各一行，“日用”“偶用”“存档”三个词前分别画实心绿圆点、半实心绿圆点、带叉的灰圆点；右“偶用名单”，四行名单。下行一张横跨全宽的窄卡“谁在读这张表”。路径（E:\\ 开头的）和英文命令、配置名用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L25",
    "href": "/rules/charter/#L25"
   },
   {
    "text": "emerald-veil",
    "href": "/projects/emerald-veil/"
   },
   {
    "text": "Steam 皮肤备份",
    "href": "/projects/steam-millennium-config-backup/"
   },
   {
    "text": "Typora 主题",
    "href": "/projects/typora-theme-pack/"
   },
   {
    "text": "meshclip-kit",
    "href": "/projects/meshclip-kit/"
   },
   {
    "text": "PC-Panel-Hub",
    "href": "/projects/pc-panel-hub/"
   },
   {
    "text": "工作交付",
    "href": "/projects/work-delivery-copilot/"
   },
   {
    "text": "视频制作",
    "href": "/projects/video-scaffold/"
   },
   {
    "text": "vault 加密工具",
    "href": "/projects/vault-tool/"
   },
   {
    "text": "驾驶舱",
    "href": "/cockpit/"
   }
  ],
  "anchors": [
   {
    "id": "p-tiers",
    "text": "三档维护"
   },
   {
    "id": "p-tier-rules",
    "text": "三档各怎么维护"
   },
   {
    "id": "p-occasional",
    "text": "偶用名单"
   },
   {
    "id": "p-tier-readers",
    "text": "谁在读这张表"
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
     "text_ref": "人话要点·三档维护",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "三档各怎么维护",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "row": "topcards",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "偶用名单（10项：9个仓库加1个功能）",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "row": "topcards",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "谁在读这张表",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·三档维护",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "三档各怎么维护",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "偶用名单（10项：9个仓库加1个功能）",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "谁在读这张表",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。"
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
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "三级小木台阶（最高一级插一片新绿叶、中间一级放一把小扳手、最低一级放那只冻结小木箱）、“偶用名单”配一个半开的工具抽屉、“谁在读这张表”配一块小仪表盘",
   "sha256": "fb447e90e43d25696e5e3b5a53d4c4c3c9227bdd19db3c5ee3776fb2938cdb17",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-3e2890b7063e976f7a0b.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-3e2890b7063e976f7a0b",
   "title_text": "人话要点 · 三档维护",
   "sha256": "2b5f8303c70731f5a0c0ca0eede5a3436c17867172f4f1fbae92c6aec4105673",
   "status": "ready",
   "source_box": [
    34,
    93,
    810,
    269
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 三档维护

### 三档各怎么维护
- **日用**：出错就修，也可以改进。
- **偶用**：只修报错，不加功能。
- **存档**：不维护，就是冻结名单里的全部项目。
- 这三档是〔约法 L25〕定的。新项目默认是日用，本人另说的除外；没列进偶用和存档的，其余全是日用。

### 偶用名单（10 项：9 个仓库加 1 个功能）
- 屏保〔emerald-veil〕、〔Steam 皮肤备份〕、〔Typora 主题〕
- 机箱小屏的曲面屏叠加层：只是〔PC-Panel-Hub〕仓库里的一个功能，仓库本身按日用
- 〔工作交付〕、〔视频制作〕、〔vault 加密工具〕
- GitHub 个人主页、公开项目的私有配套库、Key 仓库
- 两台电脑的剪贴板同步 meshclip-kit 已经移进冻结名单（停用留档），不再算偶用。

### 表外还有两件按偶用对待的
- `aicli run` 命令保留，按偶用处理、不主动维护；真要用时坏了再修。
- Codex 云端读者也先放着，偶用、不维护：换账号后新账号没建云端环境，现在不可用，不提交云端任务；具体状态见“能力与运行方式”里的云端素材通道。
- 这两件是规则正文另外写明的维护说明，不在下面这张表里，也不计进上面的 10 项。

### 谁在读这张表
- 〔驾驶舱〕直接读活动规则里的冻结名单和这张表，给每个项目标上日用、偶用或存档，不另存名单；所以表里除了只写到一个功能的那一项，每一项后面都写着仓库名，程序才认得出是哪个仓库。

::screen{#rule-context-sources-05 section="points"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-05",
  "section": "points",
  "title": "人话要点：长任务接续",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“先分清几类东西”配几个贴了不同颜色标签的小抽屉、“经验当场写进文件，不写进记忆区”配一支笔正往一本登记簿上写字、“说明文档只给 AI，给本人看的都在网站”配一块小屏幕上一片绿叶图案、“第三方 AI 命令行工具的长任务”配夹着绿书签的书（和开头插画同一本）。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画；以“例：”开头的句子用浅绿底的小条衬着，和规则本身区分开。四张卡排成两行两列：上行左“先分清几类东西”、右“经验当场写进文件，不写进记忆区”；下行左“说明文档只给 AI，给本人看的都在网站”、右“第三方 AI 命令行工具的长任务”。路径（E:\\ 开头的）和英文命令、配置名用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版（先左后右、先上后下）。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L30",
    "href": "/rules/charter/#L30"
   },
   {
    "text": "AICLI",
    "href": "/projects/ai-cli-profile-manager/"
   },
   {
    "text": "驾驶舱",
    "href": "/cockpit/"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/"
   }
  ],
  "anchors": [
   {
    "id": "p-handoff",
    "text": "长任务接续"
   },
   {
    "id": "p-sort",
    "text": "先分清几类东西"
   },
   {
    "id": "p-write-down",
    "text": "经验按时写进文件，不写进记忆区"
   },
   {
    "id": "p-docs-site",
    "text": "说明文档只给 AI，给本人看的都在网站"
   },
   {
    "id": "p-cli",
    "text": "第三方 AI 命令行工具的长任务"
   },
   {
    "id": "p-compact-review",
    "text": "压缩后的后台复核：防止长任务漏掉要求"
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
     "text_ref": "人话要点·长任务接续",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "先分清几类东西",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "row": "topcards",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "经验按时写进文件，不写进记忆区",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "row": "topcards",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "说明文档只给AI，给本人看的都在网站",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "row": "bottomcards",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "第三方AI命令行工具的长任务",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      3
     ],
     "row": "bottomcards",
     "width": "50%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "压缩后的后台复核：防止长任务漏掉要求",
     "columns": 1,
     "inner_columns": 2,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "row": "reviewcard",
     "width": "100%"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·长任务接续",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "先分清几类东西",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "经验按时写进文件，不写进记忆区",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "说明文档只给AI，给本人看的都在网站",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "第三方AI命令行工具的长任务",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      3
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "压缩后的后台复核：防止长任务漏掉要求",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。"
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
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件写作",
   "source_phrase": "几个贴了不同颜色标签的小抽屉、“经验当场写进文件，不写进记忆区”配一支笔正往一本登记簿上写字、“说明文档只给 AI，给本人看的都在网站”配一块小屏幕上一片绿叶图案、“第三方 AI 命令行工具的长任务”配夹着绿书签的书（和开头插画同一本）",
   "sha256": "28af955cf2d0855d3f91be0690a129e092af2b43346eb766b773beab8f70519b",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-91ae045e625790f75d4a.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-05-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-91ae045e625790f75d4a",
   "title_text": "人话要点 · 长任务接续",
   "sha256": "2c488f67efa006f70abdfe35b38f1dbd564059eaeea708579ee560d15e2c2114",
   "status": "ready",
   "source_box": [
    54,
    18,
    886,
    181
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 长任务接续

### 先分清几类东西
- 开对话、压缩和恢复时，不往对话里塞决定短表或要求表；AI 读的是全局规则和当前项目的规则。
- 任务状态按这个顺序接：本人要的产出、最近几条更正和它们的出处、已经定下的事实和授权；再往下是还不知道的、可以换掉的方案、真正做完的和还剩的、下一步和证据放在哪。需要核对本人当时怎么说的，再按源消息 UUID 去原话存档查那一条。
- 原生子代理跳过开场钩子时，从派单和原任务的接续状态接着做，不额外去读原话；不改全局窗口，也不强制换对话。
- 摘要和计划不产生新需求；转述会改掉意思的关键原话，保留原句。

### 经验按时写进文件，不写进记忆区
- 会影响其他 AI 做决定、理解情况的经验、教训、本人以后要遵守的做法和必要事实，写进对应的项目或基座文件（例如项目的 AGENTS.md、说明文档、登记表），不写进 Codex 或 Claude 自己的记忆区（〔约法 L30〕）。
- 本人的原话由钩子自动原样存档，AI 不用手抄；禁令、长期授权和长期要求当场写进对应的规则，只管这一次的留在对话和任务状态里（怎么分、写到哪见下面〔纠正和经验记在哪〕）。
- 写的是结论，不是日志和过程记录。
- 简单任务不机械地建文档；不建包罗一切的个人资料库或新的记忆服务；不记录隐藏的推理过程。
- 停下时还有没做完的，留下接续点：在哪、做到哪、还差什么。
- 通过电脑 MCP（从手机或别处遥控电脑的连接）操作项目时，后续事项和提醒写进电脑端对应项目现有的需求、待办或接续入口，由之后读取上下文的电脑 AI 承接；不在 ChatGPT 里新增任务或定时提醒来代替，本人另行指定提醒方式时照新的办。记下后续条件不等于马上执行，也不等于可以给另一个现有会话派活。

### 说明文档只给 AI，给本人看的都在网站
- 仓库的 README 只给 AI 和维护用，简短列出现在的入口；不再另写一份给本人看的长文档。
- 给本人看的说明、指南和急救步骤，统一由网站 wly0829.cn 从各自唯一的来源生成（急救步骤的来源在电脑配置与恢复）；电脑离线时，网站上的急救页也必须能读。
- 不过网站上本人日常只看〔驾驶舱〕（见〔能力与运行方式〕里的“本人只看驾驶舱”）：说明页留着备查，要本人知道、做或选的事，得写进驾驶舱才算告诉了他。
- 项目的 AGENTS.md 只写这个项目真正和别处不同的地方；实现或入口变了、影响到它写的承诺时同步改。

### 第三方 AI 命令行工具的长任务
- 由〔AICLI〕（本人的 AI 命令行启动与配置工具）和具体项目负责接续，不再交给个人技能。
- 做到一个自然段落，先存接续点再压缩上下文；恢复时先接上当前的产出和没结的事，再按下一步需要读项目规则、git status／git diff 和要改的代码，摘要只当线索。

### 压缩后的后台复核：防止长任务漏掉要求
- **防什么**：长任务的上下文一压缩，交接摘要容易漏掉本人顺口提的小要求，或者以前没办完的事。
- **平时准备**：主对话一直维护一份短任务状态（本人要的产出、最近的更正和出处、已定的事实和授权、做完的和没完的、下一步、证据放在哪），压缩前更新；没有现成的地方就记在本任务的 `work/task-state.md`，不抄整段历史。压缩恢复后先接这几样，不默认重读清单或原话；用到哪条，当场按出处读哪条。
- **什么时候跑**：Claude、Codex 的主对话每压缩一次，后台自动排一次复核；同一个主对话同时最多一批在跑。普通的新消息不触发，子代理自己压缩也不再往下派。
- **查什么**：复核者在后台只读检查，正常工作不等它：从原话存档里取这一批新增的本人消息，对照交接和待办有没有漏记的小要求，对照仍有效的旧未结要求，再看真做完的证据、有没有擅自改决定。本人原话的出处由主对话认定，复核者不另查出处、不报“无出处”；分类只有在禁令边界上有分歧时作为提醒交回，不挡工作。现在用 GPT-6.1 Sol、ultra 档，资料定位优先用脚本。
- **结果怎么回来**：短结果在主对话下一次能收消息时送回。主对话先对照当前版本，已经修好的不再打扰；影响当前决定或交付的问题由主对话核实处理，普通提醒不挡主任务。
- **没查完怎么办**：失败、超时、缺资料、没检查到的部分都如实列成“未覆盖”，不写成通过；中断了在原批次接着做，不另开替身。
- **资料锁着时**：纯技术工作本来就不需要解锁。到了压缩预警、整个会话确认是纯技术时，AI 可以登记“这段属于技术范围”让复核照跑；这个登记不解锁资料，混有私人内容或说不清的就不登记，没读的部分照样列为未覆盖。
- **参数**：每批有效工作时间现在是 8 分钟，短回报目标 500 字；这是可调的实现参数，不拿它当删掉关键问题的理由。

::screen{#rule-context-sources-06 section="points"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-06",
  "section": "points",
  "title": "人话要点：一样东西只存一处",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“每样东西只有一个家”配一只小鸟站在唯一的一个鸟窝上、“发现副本怎么收”配两张叠在一起的纸被一只手合成一张、旁边一张小便签画着箭头。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画；以“例：”开头的句子用浅绿底的小条衬着，和规则本身区分开。两张卡左右并排，左“每样东西只有一个家”窄一些（约 40% 宽），右“发现副本怎么收”宽一些。两张卡下面留一条窄窄的水彩叶子装饰带。路径（E:\\ 开头的）和英文命令、配置名用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，最下面水彩叶子装饰带。字和横版完全一样。",
  "links": [
   {
    "text": "决定文档",
    "href": "/projects/agents/#f-decisions"
   },
   {
    "text": "查重复段落",
    "href": "/projects/agents/#f-dedupe"
   }
  ],
  "anchors": [
   {
    "id": "p-single",
    "text": "一样东西只存一处"
   },
   {
    "id": "p-one-home",
    "text": "每样东西只有一个家"
   },
   {
    "id": "p-copies",
    "text": "发现副本怎么收"
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
     "text_ref": "人话要点·一样东西只存一处",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "每样东西只有一个家",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "发现副本怎么收",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left",
     "motion_icon_arrow": true
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；QA04 修复：按审查第7条将两张要点卡改为50:50等宽。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·一样东西只存一处",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "每样东西只有一个家",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "发现副本怎么收",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "icon_position": "header_left",
     "motion_icon_arrow": true
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只小鸟站在唯一的一个鸟窝上、“发现副本怎么收”配两张叠在一起的纸被一只手合成一张、旁边一张小便签画着箭头",
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
   "asset": "_library/round3/titles/title-r3-93dd018dfe3eae286f84.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-context-sources-06-h\\round-01\\candidate-2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-93dd018dfe3eae286f84",
   "title_text": "人话要点 · 一样东西只存一处",
   "sha256": "f5afcbb50d709002e0ddfe6c433f85bef1ada78a6dad4daec1a44a85cbb601f8",
   "status": "ready",
   "source_box": [
    30,
    42,
    997,
    206
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 一样东西只存一处

### 每样东西只有一个家
- 规则、事实、决定和本人原话，各只存一处，就是“事实找谁”分给它的家：本人的原话存原话存档，本人以后要遵守的做法存规则，本人自己的事实存个人理解库里本人明确说过的那部分。
- 别处用到时，写一句现在的结论，并指向那一处（路径、章节或编号），不整段抄。
- 把几处现行结论合成一段的汇总也算引用，例如个人理解库的核心画像和当前处境卡、驾驶舱条目的标题、项目首页：每条注明是哪天的情况，并指回它的家；计划、金额这类会变的状态，只写它意味着什么、去哪看，不写成现在时。改了家的任务，在同一个任务里找出直接引用它的汇总一起改；做不到的，由下次全量更新收尾时补上。能用程序查的交给程序查，查出来的就算待处理，不能只列出来了事。
- 会变的数（版本、数量、剩余空间、第几行、运行状态）以能查到它的命令、配置或系统为准：长期说明只写去哪查，非写不可就注明哪天看到的；带日期的决定记录、汇报和计划保留当时的值，不回头改。

### 发现副本怎么收
- 先把副本里更新或多出来的内容并回它的家，再把副本改成指路的一句。
- 由工具从唯一来源生成、并核对过一致的，不算副本：例如规则发布快照、装到用户目录的入口文件、网站生成的说明页。
- 给本人看的内容，不再在仓库 README 或另一份长指南里手写维护。
- 过时的历史报告和设计稿不改写，没人再用就移出工作区。
- 跨文件查重有专门的〔查重复段落〕工具，查出来的逐组判断，再把副本收成一处。

::screen{#rule-context-sources-07 section="points"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-07",
  "section": "points",
  "title": "人话要点：纠正和经验记在哪",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“当轮就记，记完说一句”配一个小对话气泡里画一支笔、“决定原话只存一处”配一本封面写着书名号的厚本子（封面不写字）、“什么写到哪”配一排贴着标签的小信箱、“每周一次查漏”配一本台历翻在星期一。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画；以“例：”开头的句子用浅绿底的小条衬着，和规则本身区分开。左列上下两张卡：“当轮就记，记完说一句”（矮）、“决定原话只存一处”；右列上面是“什么写到哪”卡，里面画成两列细线表格（表头浅绿底，“|---|”那一行不画成字，竖线不画成字），下面是“每周一次查漏”卡。路径（E:\\ 开头的）和英文命令、配置名用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：本屏没有别的装饰；四张卡片从上到下一张一条、整宽，顺序：当轮就记、决定原话只存一处、什么写到哪（表格改成一行一条：“内容”粗体在上，“写到哪里”在下）、每周一次查漏。字和横版完全一样。",
  "links": [
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   },
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/"
   },
   {
    "text": "每周基座体检",
    "href": "/projects/agents/#f-weekly"
   },
   {
    "text": "约法 L1–L6",
    "href": "/rules/charter/#talk"
   }
  ],
  "anchors": [
   {
    "id": "p-lessons",
    "text": "纠正和经验记在哪"
   },
   {
    "id": "p-record-now",
    "text": "按时点记，记完说一句"
   },
   {
    "id": "p-decisions",
    "text": "决定原话只存一处"
   },
   {
    "id": "p-where",
    "text": "什么写到哪"
   },
   {
    "id": "p-weekly",
    "text": "每周一次查漏"
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
     "text_ref": "人话要点·纠正和经验记在哪",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "按时点记，记完说一句",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      0
     ],
     "row": "body",
     "width": "44%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "旧决定月卷只作历史，原话只存一处",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      1
     ],
     "row": "body",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "什么写到哪",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      2
     ],
     "row": "body",
     "width": "56%",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "每周一次查漏",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "header_icon": [
      3
     ],
     "row": "body",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·纠正和经验记在哪",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "按时点记，记完说一句",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "header_icon": [
      0
     ],
     "table_mobile": "row_cards",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "旧决定月卷只作历史，原话只存一处",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "header_icon": [
      1
     ],
     "table_mobile": "row_cards",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "什么写到哪",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "header_icon": [
      2
     ],
     "table_mobile": "row_cards",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "每周一次查漏",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "header_icon": [
      3
     ],
     "table_mobile": "row_cards",
     "icon_position": "header_left"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。"
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
   "source_phrase": "一个小对话气泡里画一支笔、“决定原话只存一处”配一本封面写着书名号的厚本子（封面不写字）、“什么写到哪”配一排贴着标签的小信箱、“每周一次查漏”配一本台历翻在星期一",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-70a88267df4ed076c946.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-07-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-70a88267df4ed076c946",
   "title_text": "人话要点 · 纠正和经验记在哪",
   "sha256": "45e9fdfaca0d62486006d83d8546519f7adfb5235b7a5a599df71ddbdcce3598",
   "status": "ready",
   "source_box": [
    30,
    18,
    836,
    150
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 纠正和经验记在哪

### 按时点记，记完说一句
- 本人的每条原话由 Codex、Claude 的钩子自动原样存进原话存档；资料锁着时，后台在解锁后补存。AI 不手抄原话，引用时写源消息 UUID。
- 主对话当场分一下这句话：只管这一次的（提问、好奇、这次的安排和选项回答、当场改了就完的纠正、“这次先别……”），留在对话和任务状态里，不写任何地方；规则里就算没有这一句、AI 也不会做错的，只当本人当时提个醒，不写进规则。
- 以后还要遵守的（禁令、长期授权、长期要求和偏好），当场写进规则，提交说明写源消息 UUID，回复里用一句话说明写在哪。有期限的写明“至某天”，到期由每周治理删掉；跟型号换代有关的写进模型清单，随换代更新。
- 两边的自动记忆都已关闭，但不能因为记忆关了就不记。

### 旧决定月卷只作历史，原话只存一处
- 本人原话只存原话存档一处，别处（项目说明、AGENTS.md、技能、网站文档、登记表、进度文档、汇报页）只写现在的做法并注上源消息 UUID，不抄原话。
- 以前按月分卷的决定原话（`docs/owner-decisions/YYYY-MM.md`）现在只是历史：不再新增、不往对话里注入，也不当规则读；跟现行规则冲突时以规则为准。
- 写进哪一层：话里提到某个项目自己的东西（这个视频、这份案卷、这个网站、这个仓库），写进那个项目的 AGENTS.md 或项目文档；只讲 AI 怎么说话、怎么干活、怎么用工具和模型的，写进基座对应的专题，随规则发布；要改约法的先问本人。拿不准就放说这句话的那个项目；第二个项目又说到，或本人说了“所有项目”“以后都”，再挪进全局规则，同时删掉项目里那条。
- 出了错默认查清根因修掉，不另记错误：能在系统里修的改代码、工具或配置并加测试；是 AI 做某件事漏了一步的，写进那件事的做法文档或技能；模型判断上的事交给模型当场判断，不加规则文字。本人说“只需要快速恢复”时才只做恢复。向本人提修复办法时，先说清是根治还是缓解；要先做缓解的，说明为什么值得先做。
- 照原话的意思、条件和范围写，不把当时那件事的具体做法升格成通用原则；禁令写明是禁令，附时间和源消息 UUID；先查有没有同一件事的旧规则，有就改那一条，新旧冲突以本人最新的话为准。
- 子代理不改规则、不记原话，照派单做。本人自己的事实、偏好和价值，记在个人理解库。

### 什么写到哪
| 内容 | 写到哪里 |
|---|---|
| 怎么跟本人说话 | 通用的说话规矩在〔约法 L1–L6〕；只和本人有关的（例如本人状态很差时怎么说）记进个人理解库；某个技能或项目自己的写法（汇报页、驾驶舱、拟消息这类）记进那个技能或项目。新增前先查同类并合并，写清本人要的结果和适用范围，保留源消息 UUID 以便按需查原文 |
| Claude 或 Codex 自己工具的坑 | 〔Claude 适配〕或〔Codex 适配〕专题 |
| 某个项目的事 | 这个项目的 AGENTS.md 或相关文档 |
| 本人的原话 | 原话存档，钩子自动存，AI 不手抄 |
| 本人以后要遵守的做法 | 按上面“写进哪一层”，放进项目规则或全局规则 |
| 拿不准放哪里 | 先写进最接近的那份规则，发布规则时再挪；以后要遵守的做法不放待办 |

### 每周一次查漏
- 两基座治理长期每周跑一次，没有结束日期；具体做什么以 Codex 自动任务的定义为准。
- 按规则，每周治理由 GPT 执行（换一家模型来看），扫这一周的原话存档：找出本人说了以后要遵守、规则里却没有的，规则写得比原话宽或放错了层的，以及反复出问题、根因还没修掉的地方，交对应会话处理；同时删掉已经到期的条目，把两边记忆区又冒出来的内容挪进共享文件，把又抄了原话的现行文档改成现在的做法加出处，再扫一遍两个基座和各日用项目（冻结的不扫）里跨文件重复的段落，长期文档里写死、已经或快要过时的数也改成指向能查到它的地方。
- 取用私人内容仍按当时的个人资料状态；合并同类时保留原话语境，不把 AI 的猜测写成本人的决定。
- 网站不另设每周复核；网站那个暂停着的手动更新入口，只在本人启动时才跑，不算在定时更新。
- 例：排着的是 Codex 的自动任务〔每周基座体检〕，每次在北京时间周一 13:00 跑，排程不带结束次数。任务名称里还留着早先“4 周稳定期”的字样，是没跟着改的旧名，以排程和规则为准。

::screen{#rule-context-sources-08 section="original"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-08",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.context-sources.md",
   "release": "E331",
   "sha256": "6f9ecadfa0079f844e8e90a19715675acf569f483042af5b515d131fd18497c8",
   "public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3",
   "from": null,
   "to": "## 三档维护",
   "start": 0,
   "end": 2147,
   "approved_omissions": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体（### 比 ## 小一号）、井号不画；“-”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和名字用等宽字体、浅绿底小框，反引号不画；“|”开头的几行是表格，画成细线表格（第一行是表头，浅绿底；“|---|”那一行只是分隔，不画成字），竖线不画成字；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 事实来源与任务上下文”到“## 冻结的项目”下面第一段（“冻结的项目（约法 L24）……”）结束；右卡放“冻结名单只维护在这里……”、冻结名单表格、表下那行说明和“冻结管的是 AI 维护范围……”一段。表下那行“（表中另有 4 行是本人定了不在网站上出现的旧项目，没有放上来。）”不是原文，用小一号的浅灰斜体，和原文区分开。",
  "portrait": "竖版 9:16：“原文 · E230 版，一字不改”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；表格照样是两列细线表格；字多，行距紧一点但不挤。表下那行说明照横版用小一号浅灰斜体。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "source_excerpt_id": "rule-context-sources/rule-context-sources-08",
  "source_logical_id": "context_sources_contract",
  "source_public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3",
  "source_rule_part": "rule-context-sources/rule-context-sources-08"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E331版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "事实来源与任务上下文",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "冻结名单只维护在这里",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "冻结管的是AI维护范围",
     "body_columns": 1
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；既有4行省略的人工说明独立在原文卡外显示，不标source_prose、不计入原文摘要。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E331版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "事实来源与任务上下文",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "冻结管的是AI维护范围"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；既有4行省略的人工说明独立在原文卡外显示，不标source_prose、不计入原文摘要。"
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
   "asset": "rule-context-sources/rule-context-sources-01-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5c3f32ee791fa12cb29c",
   "title_text": "事实来源与任务上下文",
   "sha256": "67cc6133908c0f0885ab0b0a2ebe414dd0dd9766d5c4e1c1c5d76799a9872caa",
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
   "asset": "_library/titles/title-ebc6931a168640665ce1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ebc6931a168640665ce1",
   "title_text": "事实找谁",
   "sha256": "996061fc25d6eb90af67c2c0588b1c5073181f98810aba36f606c60219fbe0fb",
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
   "asset": "_library/titles/title-adb88e3a2ebbe5d2924e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-adb88e3a2ebbe5d2924e",
   "title_text": "冻结的项目",
   "sha256": "1123035185746c639fbed1a163c433473d62745b5e47d01e350ddd1b2b2f4f6e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

原文 · E331 版，一字不改

# 事实来源与任务上下文

owner: `E:\.agents`

这里说清事实找谁、哪些项目冻结、项目分几档维护，以及长任务怎么接续。授权、施工和执行结果由各自专题负责。

## 事实找谁

- `E:\.agents`：AI 的行为规则、授权、能力路由、规则发布、个人技能和插件、跨项目协作；推送前检查、私人配套库查询和 GitHub 删库、转移、改公开的执行入口在 `project-entry-gate` 技能里。
- `E:\PCConfig`：机器路径、端口、计划任务、运行环境、数据源、迁移、备份和恢复事实；本机每个仓库在哪个文件夹、网站显示哪些项目、公开仓库配哪个私人配套库，也登记在它的 `registries/` 里。
- 具体项目：业务含义、领域数据、兼容、启动、测试、部署和生成区。

按需要一步步读：看到绝对路径不等于要把两个基座全扫一遍。普通项目先读目录链上的规则和本地状态；公开或私有、远端、分支、同步这类 Git 事实在仓库里用 `git`、`gh` 现查，推送、公开、删库这类动作前按 `project-entry-gate` 技能检查；只有机器事实会改变决定时才问 PCConfig，只有规则、能力或授权会改变决定时才读本仓库对应的专题。不知道的就说不知道，不从别的来源猜。

两个基座的日常治理是发现并修好有事实依据的问题，不是补跑备份。计划任务机制正常时，只看它有没有按时跑、回执对不对（约法 L21）；不为了刷新成功时间或让报表变绿去额外运行备份。已经证实的机制缺陷在原项目里修好并做相应的局部验证；本人暂停的任务保持暂停。基座治理里说的“流量”指代理流量，阿里云的流量归网页治理（本人 2026-10-07 22:47 更正；视频语境里的“流量”另按视频理解）。

## 冻结的项目

冻结的项目（约法 L24）：本人没主动提这个项目的具体需求时，AI 不主动看代码、研究、审计、修复、升级或优化；它们的计划任务停用，换电脑时也不重建。本人说“全部项目”“全局完善”这类批量指令时，默认不包括冻结项目，也不先读它们的代码再决定。本人点名提具体需求时，只按这次需求取材和处理，不需要说“解冻”，也不因此恢复日常维护；只提到名字不算需求。活动项目引用了它、模型升级了或发现能优化，都不是去碰它的理由；真需要改冻结项目时，说清依赖和缺口，等本人提出。识别和排除冻结项目时，只读最小的身份和状态信息。

冻结名单只维护在这里。仓库标识都是 `wlyaaaaa/<repo>`，名字比对不分大小写。

冻结一个项目要说清真实理由：为什么不值得再单独维护（被什么替代了、依赖没了、AI 现查就能做到、单独维护反而添乱、实际没人用等），以及原来的用处现在由谁承担。“已存档”“内容已归位”“不再维护”只说了结果，不算理由；说不清就问本人。网站项目总页冻结卡上的“停下原因”照这个写，规矩在网站仓库 `docs/design/panel-content-contract.md`“退役内容的去处”。

| 项目 | 仓库 |
|---|---|
| PersonalOS（含退役留档） | `PersonalOS-Retired` |
| 个人知识库 | `PersonalKnowledgeBase` |
| Codex 远程 | `codex-local-remote` |
| CACB 模型评测（整个项目） | `codex-agent-model-benchmark` |
| 微信历史桥 WeFlowBridge | `wechat-history-ai-bridge` |
| OpenClaw 网关 | `OpenClawGateway` |
| OpenClaw 备份 | `openclaw-backup` |
| 游戏求解 | `md-triple-tactics-talent-solver` |
| 对齐数据集 | `human-alignment-dataset-001` |
| Gemini 记忆备份（退役留档） | `gemini-memory` |
| Claude 记忆备份（退役留档） | `claude-memory` |
| MeshClip Kit 两机剪贴板（停用留档） | `meshclip-kit` |
| 个人表达库（内容已归位，原始样本留在 `E:\PersonalData\个人表达\`） | `personal-expression` |
| GitHub 总索引（有用的数据和程序已并进 PCConfig 和 `.agents`） | `github-local-index` |

冻结管的是 AI 维护范围，和路径、运行、恢复或备份状态是两回事：PCConfig 里写着在用、还有依赖、目录还在或 Git 能正常同步，都不说明可以维护；放在备份仓库或 `Archives` 目录里也不单独说明已冻结。冻结不删资料：冻结项目的数据照常留在备份里，也照常被机器的备份覆盖，不因冻结而删除或停止备份；停用的只是冻结项目自己的计划任务。本人新增或更正名单时改这里，其他基座引用这里，不另存第二份名单。

::screen{#rule-context-sources-09 section="original"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-09",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.context-sources.md",
   "release": "E331",
   "sha256": "6f9ecadfa0079f844e8e90a19715675acf569f483042af5b515d131fd18497c8",
   "public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3",
   "from": "## 三档维护",
   "to": "### 一样东西只存一处",
   "start": 2147,
   "end": 4589,
   "approved_omissions": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体（### 比 ## 小一号）、井号不画；“-”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和名字用等宽字体、浅绿底小框，反引号不画；“|”开头的几行是表格，画成细线表格（第一行是表头，浅绿底；“|---|”那一行只是分隔，不画成字），竖线不画成字；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 三档维护”一整节（含档位表格；表格“偶用”那一格字多，格子里自动换行）；右卡放“## 长任务接续”和它下面的三段。",
  "portrait": "竖版 9:16：“原文 · E230 版 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；表格照样是两列细线表格；字多，行距紧一点但不挤。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "source_excerpt_id": "rule-context-sources/rule-context-sources-09",
  "source_logical_id": "context_sources_contract",
  "source_public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3",
  "source_rule_part": "rule-context-sources/rule-context-sources-09"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E331版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "三档维护",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "body_columns": 1
    },
    {
     "type": "table",
     "text_ref": "档位"
    },
    {
     "type": "source_text_card",
     "text_ref": "长任务接续",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "body_columns": 1
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；续屏版本标签明确 E214，标签不属于规则正文。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。；独立复核：原文中的短键长值表改现役table组件按内容列宽，全部原字和顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E331版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "三档维护",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；续屏版本标签明确 E214，标签不属于规则正文。"
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
   "asset": "rule-context-sources/rule-context-sources-09-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-09-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6695ff3efba21312206f",
   "title_text": "三档维护",
   "sha256": "4b8c48b815471ee427852a5ba41a0e40f0639fe29351576aed2f6a49ba70ee56",
   "status": "ready",
   "source_box": [
    56,
    115,
    239,
    170
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-context-sources/rule-context-sources-09-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-context-sources\\img\\rule-context-sources-09-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bf56ba49ad98cdbc0892",
   "title_text": "长任务接续",
   "sha256": "1fd8264f0ca5bb4fcfefc90490f42c27f4c4120525986cf2e1c48d987521e9b2",
   "status": "ready",
   "source_box": [
    874,
    117,
    1098,
    170
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E331 版 · 续

## 三档维护

项目分三档（约法 L25）：

- **日用**：出错就修，也可以改进。
- **偶用**：只修报错，不加功能。
- **存档**：不维护，也就是上面的冻结名单。

新项目默认是日用，本人另说的除外。

`aicli run` 保留，按偶用处理，不主动维护；真要用时坏了再修。Codex 云端读者也先放着，偶用、不维护；换账号后新账号没建云端环境，暂不可用，具体状态见[云端素材通道](/rules/capabilities-runtime/#云端素材通道)。

| 档位 | 项目 |
|---|---|
| 偶用 | 屏保 emerald-veil（`emerald-veil`）、Steam 皮肤备份（`steam-millennium-config-backup`）、Typora 主题（`typora-theme-pack`）、机箱小屏的曲面屏叠加层（PC-Panel-Hub 仓库里的一个功能，仓库本身按日用）、工作交付（`work-delivery-copilot`）、视频制作（`video-scaffold`）、vault 加密工具（`vault-tool`）、GitHub 个人主页（`wlyaaaaa`）、公开项目的私有配套库（`public-project-private-backup`）、Key 仓库（`Key`） |
| 存档 | 冻结名单里的全部项目 |
| 日用 | 其余所有项目 |

## 长任务接续

开对话、压缩和恢复时不注入决定短表或要求表，AI 读的是全局规则和当前项目的规则。原生子代理跳过 SessionStart 时从派单和原任务状态接续，不额外读原话。不改全局窗口、不强制换对话。

现有任务状态依次放本人要的产出、最近几条更正及出处、已定事实和授权，再写未知、可替换的方案、已完成与未结事项、下一步和证据位置。摘要和计划不产生新需求；需要核对当时怎么说的，再按源消息 UUID 查原话。经验、决定和必要事实按共享经验的落点（`#共享经验的落点`）归位。简单任务不机械建文档，不建全景个人库或新的记忆服务，不记录隐藏推理；未做完时留下能接着做的状态。

README 只给 AI 和维护使用，简短列出现行入口，不再另写一份给本人看的长文档。给本人看的说明、指南和急救步骤统一由网站 `wly0829.cn` 从各自唯一来源生成；电脑离线时，网站的急救页也必须可读。本人日常只看驾驶舱，见[能力与运行方式](/rules/capabilities-runtime/#汇报网站和自动运行的东西)“本人只看驾驶舱”。项目的 AGENTS 只写这个项目真正不同的地方；实现或入口变了、影响到它写的承诺时同步更新。网站取材和去副本按下一节执行。

第三方 CLI 长任务由 AICLI 和具体项目负责接续，不再交给个人技能；到自然边界保存检查点，恢复时先接当前产出和未结事项，再按下一步需要读取项目规则、Git 状态和源码。

通过电脑 MCP 操作项目，以及个人项目中需要电脑智能体执行的后续事项，归入电脑端对应项目现有需求、待办或接续入口，由电脑 Codex／Claude 在相应操作时承接并提醒。无论本人从手机还是通过 MCP 发起，包括媒体库按需更新，都不在 ChatGPT 新增任务，也不另建 ChatGPT 定时提醒来代替项目接续；本人另行明确指定提醒方式时按新指示。记录后续条件不等于立即执行，也不等于获准向另一个现有会话发送任务。

### 压缩后的后台复核

压缩恢复先接本人要的产出、最近几条更正和已定事实，不默认重读清单或决定原文；需要哪条，当场按出处读哪条。根会话在压缩前更新项目已有的短任务状态，没有入口时用本任务 `work/task-state.md`，内容按上一节，不复制整段历史。

Claude、Codex 根会话的增量复核复用原话存档和 GPT 后台任务，不阻塞正常工作。当前用 Sol ultra，资料定位优先脚本；Luna 初筛不能代替最终复核。

纯技术工作不依赖资料解锁（约法 L18）。资料锁着或未知、又到了压缩预警时，根会话若已确认整个现有会话确为纯技术，可用技术范围登记（`E:/.agents/docs/operations/context-hooks.md#锁定时的技术复核`）记录当前原话边界及确为技术资料的证据位置，命令见该运维文档。登记由 AI 做，不请本人另行批准；新增或改写的真人消息不继承旧判断。旧历史混有私人内容或范围不明时不登记整段技术，仍走原资料入口，不先读私人历史来补这个判断。该登记不解锁资料、不放行私人库；未读取的部分继续列为未覆盖。

- 每个新增压缩边界只排一次，同根会话最多一批；普通新消息和子代理压缩不新开复核，中断在原批次接续，未覆盖部分保留。
- 只读本批新增消息和旧未结项，分段核对漏记要求、完成证据、擅改决定和接续。出处由根认定，复核者不另查；按[分类表](/rules/engineering-delivery/#本人的话怎么分类怎么对待ai-写的稿子可以改)核对，禁令边界上的分歧交根，不产生用户决定。
- 覆盖位置、未结项及失败、超时、资料缺口落在现有任务状态；只有有效覆盖回执才推进，未检查的摘要不报通过。短结果在原根会话下一可投递边界送回，根对照当前版本处理仍存在的实质问题；普通提醒不阻塞主任务，重大动作仍按原把关规则。
- 每批有效工作预算 8 分钟、短回报目标 500 字，均为可调的 AI 参数，不以此牺牲覆盖或删关键问题；排队、重试和收尾宽限单列，不自动无限延时。

程序入口、暂停开关和两宿主实际支持的事件见上下文 Hook 运维（`E:/.agents/docs/operations/context-hooks.md`）。纯模型主动换窗与原生压缩分别验收，不能从一种事件的成功推定另一种也已接通。

::screen{#rule-context-sources-10 section="original"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-10",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.context-sources.md",
   "release": "E331",
   "sha256": "6f9ecadfa0079f844e8e90a19715675acf569f483042af5b515d131fd18497c8",
   "public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3",
   "from": "### 一样东西只存一处",
   "to": null,
   "start": 4589,
   "end": 7600,
   "approved_omissions": []
  },
  "title": "原文（三）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”“###”开头的行是节标题，画成深绿粗体（### 比 ## 小一号）、井号不画；“-”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和名字用等宽字体、浅绿底小框，反引号不画；“|”开头的几行是表格，画成细线表格（第一行是表头，浅绿底；“|---|”那一行只是分隔，不画成字），竖线不画成字；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“### 一样东西只存一处”一整节和“### 共享经验的落点”下面的前两段；右卡放“内容／写到哪里”表格和最后“每周的三基座治理任务……”一段。",
  "portrait": "竖版 9:16：“原文 · E230 版 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；表格照样是两列细线表格；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "Find-DuplicateContent.ps1",
    "href": "/source-tools/Find-DuplicateContent.ps1"
   },
   {
    "text": "约法 L30",
    "href": "/rules/charter/#十关于规则本身"
   },
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   },
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "source_excerpt_id": "rule-context-sources/rule-context-sources-10",
  "source_logical_id": "context_sources_contract",
  "source_public_sha256": "8fab647f710d95ff2d829139f9a6ae9b47be3af10527f36869ed9977846ff9d3",
  "source_rule_part": "rule-context-sources/rule-context-sources-10"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E331版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "一样东西只存一处",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "source_text_card",
     "text_ref": "内容写到哪里",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；续屏版本标签明确 E214，标签不属于规则正文。",
   "aspect": "16:9"
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E331版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "一样东西只存一处",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "构图依据：typeset-inventory/screens.jsonl 的 source_layout 与本屏定稿 scene/portrait；未查看图片。 卡头图标及插画内五块文字牌的位置需组件/素材承接；原文屏为正文卡，不把卡内节标题误作毛笔标题。；续屏版本标签明确 E214，标签不属于规则正文。"
  }
 },
 "images": []
}
```

原文 · E331 版 · 续

### 一样东西只存一处

规则、事实、决定和本人原话各只存一处，就是上面“事实找谁”分给它的家；本人原话存原话存档，本人以后要遵守的做法存规则，本人自己的事实存理解库明示。别处用到时，写一句现行结论并指向那一处（路径、章节或编号），不整段抄。会变的数（版本、数量、剩余空间、“第几行”、部署或运行状态）的家是能查到它的命令、配置或系统本身：说明、规则、手册这类长期文档写去哪查，非写不可就注明是哪天看到的；带日期的决定记录、汇报、计划和评测保留当时的值，不回头改。发现副本时，先把副本里更新或多出来的内容并回它的家，再把副本改成指针。由工具从唯一来源生成、并核对一致的副本（例如规则发布快照、装到用户目录的入口文件、网站生成的说明页面）不算副本。急救步骤的来源在 PCConfig，网站照它生成，并保证电脑离线时仍能在网站读到急救页；给本人看的内容不再在仓库 README 或另一份长指南里手写维护。过时的历史报告和设计稿不改写，没人再用就移出工作区。跨文件查重用 [Find-DuplicateContent.ps1](/source-tools/Find-DuplicateContent.ps1)，结果逐组判断后再收副本。

把几处现行结论合成一段的汇总（例如理解库核心画像、当前处境卡、驾驶舱条目标题、项目首页）也算引用：每条带“截至哪天”并指向家；案件阶段、计划、用药、金额这类会变的状态只写意义和指向，不写成现在时。改了家的任务负责找出直接引用它的汇总，在同一任务里更新；做不到的由下次全量更新的收尾核对补上。能用程序查的交给程序（例如理解库 `card-lint` 的 h、i 类），查出来就算待处理，不能只列出来不算数。

### 共享经验的落点

记忆的使用边界按[约法 L30](/rules/charter/#十关于规则本身)，两个宿主的关闭配置见各自适配专题。进上下文的只有全局规则和项目规则；原话存档和旧决定月卷都不注入，只在要查当时怎么说的时候按编号翻。

**原话。** 本人的每条原话由两个宿主的钩子自动原样存进原话存档，资料锁着时由后台在解锁后补存；位置、格式和补存见运维说明（`E:/.agents/docs/operations/context-hooks.md`）。AI 不手抄原话，引用时写源消息 UUID。

**长期的写进规则，只管这一次的不写。** 根会话当场判断：
- 只管这一次的：提问、好奇、本次安排和选项回答、当场改了就完的纠正、“这次先别……”。留在对话和任务状态里，不写任何地方。
- AI 本来就会做对的：假如规则里没有这一句，AI 在这件事上也不会做错（常识，或者现有规则已经能推出来），那它只是本人当时提醒注意，不写进规则；反复出错的不算这一类，按下面“出了错修根因”办。
- 以后还要遵守的：禁令、长期授权、长期要求和偏好。写进规则，提交说明写源消息 UUID，回复里一句话说明写在哪。
- 有期限的写明“至 YYYY-MM-DD”，到期由每周治理删掉；跟型号代际有关的写进模型清单，随换代更新。

**写进哪一层：**
- 话里提到某个项目自己的东西（这个视频、这份案卷、这个网站、这个仓库），写进那个项目的 AGENTS.md 或项目文档。
- 只讲 AI 怎么说话、怎么干活、怎么用工具和模型，不涉及哪个项目的东西，写进本仓库对应专题：改源码，随任务收尾按[规则发布](/rules/rule-release/)发布；要改约法的先问本人。
- 拿不准就放说这句话的那个项目。放窄了，别的项目最多再犯一次、本人再说一次；放宽了，所有项目都会被误伤。同一件事在第二个项目又说到，或者本人说了“所有项目”“以后都”，再挪进全局规则，同时删掉项目里那条。

**出了错修根因，不记错误。** 出了错默认查清根因并修掉，本人说“只需要快速恢复”这类话时才只做恢复；向本人提修复办法时先说是根治还是缓解，缓解要说为什么值得先做。本人的纠正和抱怨（“怎么又出问题了”）、具体出了什么错，都不另外记录，原话存档里有。防再犯按下面的顺序找最强的一种：
- 能在系统里修掉的（工具的错、缺自动化、默认值不对、少一步检查）：改代码、工具或配置，加测试防回归。修好了就不用谁记住。
- 是 AI 做某件事漏了一步：把这一步写进那件事的做法文档或技能，做那件事时才读到。这是改流程，不是记错误。
- 是模型判断上的事（说到多具体、怎么取舍主次）：该不该说得具体要看场合，交给模型自己判断，不加规则文字，也不默认加复核流程。本人当场说“似是而非”“答偏了”，就在当前对话里把问题拆开、查清楚再答；同一件事反复做不好，才换做法（换作者、换模型或提高档位）。
- 一直加载的全局和项目规则只放几乎每次都用得上的，不往里堆场景细节和错误清单。

**不错误抽象：**
- 照原话的意思、条件和范围写。原话里有“因为……”“除非……”“……的时候”，规则里保留；不把当时那件事的具体做法升格成通用原则。
- 禁令写明是禁令，附时间和源消息 UUID 备查，不附原句；偏离前先问本人。
- 先查有没有同一件事的旧规则，有就改那一条，不另加一条；新旧冲突以本人最新的话为准，删掉旧的。
- 每周治理任务（由 GPT 执行，换一家模型看）扫这一周的原话存档，找出说了以后要遵守、规则里却没有的，规则写得比原话宽或放错层的，以及反复出问题、根因还没修掉的地方，交对应会话处理。

**旧决定月卷只是历史。** `docs/owner-decisions/` 不再新增，不注入，也不当规则读；跟现行规则冲突时以规则为准。子代理不改规则、不记原话，照派单做。

| 内容 | 写到哪里 |
|---|---|
| 怎么跟本人说话 | 通用说话规矩在约法 L1–L6；只和本人有关的（例如本人状态很差时怎么说）进理解库；某个技能或项目的写法（汇报页、驾驶舱、拟消息等）进那个技能或项目。新增时先查同类并合并，写清本人要的结果和适用范围，保留源消息 UUID 以便按需查原文。 |
| Claude 或 Codex 自己工具的坑 | 对应的[Claude 适配](/rules/claude-adapter/)或[Codex 适配](/rules/codex-adapter/)。 |
| 某个项目的事 | 该项目的 AGENTS.md 或相关文档。 |
| 本人的原话 | 原话存档，钩子自动存，AI 不手抄。 |
| 本人以后要遵守的做法 | 按上面“写进哪一层”，放进项目规则或全局规则。 |
| 拿不准放哪里 | 先写进最接近的那份规则，发布规则时再挪；本人以后要遵守的做法不放待办。 |

两基座周治理长期每周运行，做什么以自动任务定义为准；现役定义为 Codex 自动化 `github` 的 `E:\Data\AppData\Codex\automations\github\automation.toml`，定位见 `E:\PCConfig\registries\task_purpose_catalog.json`。仍按现行个人资料状态取用私人内容，合并同类并保留原话语境，不把 AI 的猜测写成本人决定。网站不单设每周复核；暂停的手动入口仅在本人启动时运行，不算正在定时更新。
