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
   "release": "E258",
   "commit": "5892e5bbaf0da52aedc49f24427710eac3bfd133",
   "ruleset_sha256": "7e0bae30083b4835a961149047e6c159529240896c4fdc55511bc6d6eaefb2d7",
   "activated_at": "2026-10-12T02:18:26.216182+08:00",
   "file": "sources/rules/docs/contracts/agents.context-sources.md",
   "sha256": "c6dd00ecb9cba5da30911d74f0cc72ee651435dc1307a3bcbdf9b3d1e8679d30",
   "public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e"
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
     "id": "n-repos",
     "text": "9 月 28 日 01:40 那次登记着 45 个仓库",
     "meaning": "GitHub 项目总索引的仓库登记里的条目数",
     "as_of": "2026-09-28",
     "source": "E:\\GitHub总索引\\config\\repository-paths.json 的 entries 共 45 条，observed_at=2026-09-27T17:40:56Z（北京时间 9 月 28 日 01:40）",
     "screens": [
      "rule-context-sources-02"
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
     "target": "/projects/github-local-index/",
     "screen": "rule-context-sources-01",
     "text": "GitHub 项目总索引"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-context-sources-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/how/#bases",
     "screen": "rule-context-sources-01",
     "text": "三个基座怎么配合 → 怎么协作"
    },
    {
     "target": "/projects/agents/",
     "screen": "rule-context-sources-02",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/projects/github-local-index/",
     "screen": "rule-context-sources-02",
     "text": "GitHub 项目总索引"
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
     "target": "/skills/explain-to-me/",
     "screen": "rule-context-sources-07",
     "text": "explain-to-me"
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
  "sha256": "40f55b34f10ed20c235c348b00abc494466e716dcd5b3fd16b3599f5eb92b5b5",
  "converted_at_beijing": "2026-10-12T05:03:49+08:00"
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
    "text": "GitHub 项目总索引",
    "href": "/projects/github-local-index/"
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
    "text": "三个基座怎么配合 → 怎么协作",
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
     "text_ref": "遇到一件事该去哪查；哪些项目冻结不碰、哪些只修报错；长任务停了怎么接着做；本人的决定和纠正记在哪。",
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
     "text_ref": "三个基座之间谁把什么交给谁"
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
     "text_ref": "遇到一件事该去哪查；哪些项目冻结不碰、哪些只修报错；长任务停了怎么接着做；本人的决定和纠正记在哪。",
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
     "text_ref": "三个基座之间谁把什么交给谁"
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

**遇到一件事该去哪查；哪些项目冻结不碰、哪些只修报错；长任务停了怎么接着做；本人的决定和纠正记在哪。**

这是 Codex 和 Claude 共用的规则，管四件事：一是查一件事实该找哪个仓库，按需要一步步读，不乱翻也不瞎猜；二是哪些项目冻结、AI 不主动碰，其余项目分“日用”“偶用”两档维护；三是上下文被压缩或换人接手后，长任务怎么接着做；四是本人的决定、纠正和踩过的坑只记一处，记在别的 AI 找得到的地方。它是约法〔L24 冻结的项目〕〔L25 三档维护〕和〔L30 决定写在找得到的地方〕的细则；授权、施工和执行结果不归这里管，各有专题。

**先认几个词**
- **三个基座**：整套系统最底下的三个仓库：〔AI 规则与技能基座〕（E:\.agents）、〔GitHub 项目总索引〕（E:\GitHub总索引）、〔电脑配置与恢复〕（E:\PCConfig）。
- **冻结**：本人定了 AI 不主动看、不维护的项目；三档维护里叫“存档”。
- **决定文档**：E:\.agents\docs\owner-decisions\YYYY-MM.md，书名《本人的决定原话》，本人对 AI、项目和电脑的现行决定原话存在这里；被取代或已办完的整节原样移进归档（同仓库的 docs/archive/），默认搜索不命中，只供审查。
- **副本**：同一段规则、事实或原话，在另一个文件里又抄了一遍。
- **接续点**：长任务做到一个自然段落时留下的状态，写清在哪、做到哪、还差什么；原文叫 checkpoint。
- **记忆区**：Codex 和 Claude 各自自动记笔记的地方，现在两边都已关闭。

跳到：〔事实找谁〕〔冻结的项目〕〔三档维护〕〔长任务接续〕〔一样东西只存一处〕〔纠正和经验记在哪〕

E:\.agents　E:\GitHub总索引　E:\PCConfig　冻结　接续点

三个基座之间谁把什么交给谁：〔三个基座怎么配合 → 怎么协作〕

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
    "text": "GitHub 项目总索引",
    "href": "/projects/github-local-index/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "约法 L21",
    "href": "/rules/charter/#L21"
   }
  ],
  "anchors": [
   {
    "id": "p-sources",
    "text": "事实找谁"
   },
   {
    "id": "p-homes",
    "text": "四个家，各管各的事实"
   },
   {
    "id": "p-read-order",
    "text": "按需要一步步读"
   },
   {
    "id": "p-base-upkeep",
    "text": "基座的日常治理：修问题，不补跑备份"
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
     "text_ref": "四个家，各管各的事实",
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
     "text_ref": "基座的日常治理：修问题，不补跑备份",
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
     "text_ref": "四个家，各管各的事实",
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
     "text_ref": "基座的日常治理：修问题，不补跑备份",
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

### 四个家，各管各的事实
- **〔AI 规则与技能基座〕**（E:\.agents）：AI 的行为规则、授权、该用哪个能力、规则发布、本人的技能和插件、项目之间怎么协作。
- **〔GitHub 项目总索引〕**（E:\GitHub总索引）：仓库是哪个、公开还是私有、远端、分支和工作副本、同步、恢复和发布。它只报事实；能公开到什么程度、能不能做，按 E:\.agents 的规则判断，它不自己另定等级。
- **〔电脑配置与恢复〕**（E:\PCConfig）：机器上的路径、端口、计划任务、运行环境、数据从哪来、迁移、备份和恢复。
- **具体项目**：业务是什么意思、领域数据、兼容、怎么启动、测试、部署，以及程序自动生成的文件。
- 例：想知道某个仓库公开还是私有，查 GitHub 项目总索引的仓库登记（9 月 28 日 01:40 那次登记着 45 个仓库）；想知道某个计划任务停没停，查电脑配置与恢复的计划任务登记。

### 按需要一步步读
- 看到一个绝对路径，不等于要把三个基座全扫一遍。
- 普通项目先读从它所在文件夹一路往上的规则，和它自己的状态。
- 只有 Git 上的事实会改变决定时，才问 GitHub 项目总索引；只有机器上的事实会改变决定时，才问电脑配置与恢复；只有规则、能力或授权会改变决定时，才读 E:\.agents 里对应的专题。
- 不知道就说不知道，不拿别处的资料去猜。

### 基座的日常治理：修问题，不补跑备份
- 三个基座平时要做的，是发现并修好有事实依据的问题，不是去补跑备份。
- 计划任务机制正常时，只看它有没有按时跑、回执对不对（〔约法 L21〕）；不为了刷新“上次成功”的时间、让报表变绿，去额外跑一次备份。
- 已经证实的机制缺陷，在原项目里修好，再做对应的局部验证。
- 本人暂停的任务，保持暂停。

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
- 〔Codex 远程〕、〔CACB 模型评测〕（整个项目）、〔微信历史桥 WeFlowBridge〕、〔OpenClaw 网关〕和它的备份仓库，以及已经退役留档的 Gemini 记忆备份、Claude 记忆备份；冻结名单和仓库标识见本页的活动规则公开副本。
- 名单只在这一处维护，本人新增或更正时改这里；别的基座都来这里读，不另存第二份。仓库名比对不分大小写。
- 例：GitHub 项目总索引按这份名单给仓库标“冻结”；驾驶舱也读它，冻结的项目只标“冻结”，不去读它的仓库。

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
     "text_ref": "偶用名单（11项：10个仓库加1个功能）",
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
     "text_ref": "偶用名单（11项：10个仓库加1个功能）",
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

### 偶用名单（11 项：10 个仓库加 1 个功能）
- 屏保〔emerald-veil〕、〔Steam 皮肤备份〕、〔Typora 主题〕、两台电脑的剪贴板同步〔meshclip-kit〕
- 机箱小屏的曲面屏叠加层：只是〔PC-Panel-Hub〕仓库里的一个功能，仓库本身按日用
- 〔工作交付〕、〔视频制作〕、〔vault 加密工具〕
- GitHub 个人主页、公开项目的私有配套库、Key 仓库

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
    "text": "经验当场写进文件，不写进记忆区"
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
     "text_ref": "经验当场写进文件，不写进记忆区",
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
     "text_ref": "经验当场写进文件，不写进记忆区",
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
- 用任务现有的状态分清：本人原话和更正、已确认的结果和授权、现场查到的事实和还不知道的、可以换掉的方案、真正做完的和还剩的。
- 派活、向本人提问或请本人决定前，按任务来源取回必要的现行决定；普通回复不自动注入。压缩或恢复后，两宿主从同一决定表接回目标和更正；原生子代理缺恢复事件时读原任务接续状态，不扩大窗口、不强制换对话。做取舍前先查现行决定索引，详情按出处读。
- 摘要和计划不产生新需求；转述会改掉意思的关键原话，保留原句。

### 经验当场写进文件，不写进记忆区
- 会影响其他 AI 做决定、理解情况的经验、教训、本人决定和必要事实，当场写进对应的项目或基座文件（例如项目的 AGENTS.md、说明文档、登记表），不写进 Codex 或 Claude 自己的记忆区（〔约法 L30〕）。
- 写的是结论，不是日志和过程记录。
- 简单任务不机械地建文档；不建包罗一切的个人资料库或新的记忆服务；不记录隐藏的推理过程。
- 停下时还有没做完的，留下接续点：在哪、做到哪、还差什么。

### 说明文档只给 AI，给本人看的都在网站
- 仓库的 README 只给 AI 和维护用，简短列出现在的入口；不再另写一份给本人看的长文档。
- 给本人看的说明、指南和急救步骤，统一由网站 wly0829.cn 从各自唯一的来源生成（急救步骤的来源在电脑配置与恢复）；电脑离线时，网站上的急救页也必须能读。
- 项目的 AGENTS.md 只写这个项目真正和别处不同的地方；实现或入口变了、影响到它写的承诺时同步改。

### 第三方 AI 命令行工具的长任务
- 由〔AICLI〕（本人的 AI 命令行启动与配置工具）和具体项目负责接续，不再交给个人技能。
- 做到一个自然段落，先存接续点再压缩上下文；恢复时重读项目规则、当前状态、git status／git diff 和要改的代码，摘要只当线索。

### 压缩后的后台复核：防止长任务漏掉要求
- **防什么**：长任务的上下文一压缩，交接摘要容易漏掉本人顺口提的小要求，或者以前没办完的事。
- **平时准备**：主对话一直维护一份短任务状态（当前目标、每条要求出自哪、做完的和没完的、下一步、证据放在哪），压缩前更新；没有现成的地方就记在本任务的 `work/task-state.md`，不抄整段历史。
- **什么时候跑**：Claude、Codex 的主对话每压缩一次，后台自动排一次复核；同一个主对话同时最多一批在跑。普通的新消息不触发，子代理自己压缩也不再往下派。
- **查什么**：复核者在后台只读检查，正常工作不等它：拿这一批新增的全部本人原话，对照交接和待办有没有漏记的小要求，对照仍有效的旧未结要求，再看事实出处、真做完的证据、有没有擅自改决定。现在用 GPT-6.1 Sol、ultra 档。
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
- 规则、事实、决定和本人原话，各只存一处，就是“事实找谁”分给它的家：本人的决定原话存〔决定文档〕，本人自己的事实存个人理解库里本人明确说过的那部分。
- 别处用到时，写一句现在的结论，并指向那一处（路径、章节或编号），不整段抄。
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
    "text": "explain-to-me",
    "href": "/skills/explain-to-me/"
   },
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
   }
  ],
  "anchors": [
   {
    "id": "p-lessons",
    "text": "纠正和经验记在哪"
   },
   {
    "id": "p-record-now",
    "text": "当轮就记，记完说一句"
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
     "text_ref": "当轮就记，记完说一句",
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
     "text_ref": "决定原话只存一处",
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
     "text_ref": "当轮就记，记完说一句",
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
     "text_ref": "决定原话只存一处",
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

### 当轮就记，记完说一句
- 本人的纠正、新定的规矩和踩过的坑，当轮写到下表对应的共享位置，写完在回复里用一句话说明写在哪。
- 两边的自动记忆都已关闭，但不能因为记忆关了就不记。

### 决定原话只存一处
- 本人对 AI、项目和电脑的现行决定原话，存决定文档一处，按月分卷：每月一卷 `docs/owner-decisions/YYYY-MM.md`，总索引 `docs/owner-decisions.md` 只管导航；新原话用 `owner_decision_store.py append` 写进当月那一卷。索引区分建议、要求、禁令、技术授权与 AI 补全，并标来源、范围和取代关系，不把 AI 补全倒写成本人禁令。
- AI 按本人要求新加或大改一个功能、本人新定或推翻一个决定时，当场把原话原样连同北京时间日期记进去，不靠事后翻对话记录。
- 每条原话整条原样放进引用块，连着发的各占一块，写明来自哪个会话、哪条消息；下面一行写分类，每个分类单元都标范围（本次、某个项目或主题、长期、到某天为止），并引一小段和原话一字不差的片段。
- 记原话的主对话当轮自己分类，Codex 和 Claude 一样，不设审批；子代理不记原话，也不改分类。
- 别处（项目说明、AGENTS.md、技能、网站文档、登记表、进度文档、汇报页）只写现在的做法并注上出处编号，不抄原话。
- 同一主题新决定默认覆盖旧决定。被取代或已办完的一次性原话整节移进归档，默认搜索不命中、只供审查，历史另在 Git。移动时标取代关系，搜旧编号和节名同步引用，行号改为节标题；不归自己管的交对应负责人，拿不准留现行请本人定。
- 本人自己的事实、偏好和价值，记在个人理解库。

### 什么写到哪
| 内容 | 写到哪里 |
|---|---|
| 怎么跟本人说话 | 经〔explain-to-me〕技能，按个人表达项目的流程维护；新增前先查同类并合并，保留本人原话和适用范围 |
| Claude 或 Codex 自己工具的坑 | 〔Claude 适配〕或〔Codex 适配〕专题 |
| 某个项目的事 | 这个项目的 AGENTS.md 或相关文档 |
| 本人的决定原话 | 决定月卷 `docs/owner-decisions/YYYY-MM.md`（索引 `docs/owner-decisions.md`）；别处写现在的做法加出处编号 |
| 拿不准放哪里 | 先写进现有共享文档的待办，发布规则时归位 |

### 每周一次查漏
- 三基座治理长期每周跑一次，没有结束日期；具体做什么以 Codex 自动任务的定义为准。
- 按现在的任务定义，用 GPT-6.1 Sol 模型、ultra 思考档，每次顺带：把两边记忆区又冒出来的内容挪进共享文件；补上本周本人纠正和新规矩还没落地的；把又抄了原话、或还在引用已被取代的决定编号的现行文档，改成现在的做法加出处编号；再扫一遍三个基座和各日用项目（冻结的不扫）里跨文件重复的段落，收成一处；长期文档里写死、已经或快要过时的数，也改成指向能查到它的地方。
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
   "release": "E258",
   "sha256": "c6dd00ecb9cba5da30911d74f0cc72ee651435dc1307a3bcbdf9b3d1e8679d30",
   "public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e",
   "from": null,
   "to": "## 三档维护",
   "start": 0,
   "end": 1597,
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
  "source_public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e",
  "source_rule_part": "rule-context-sources/rule-context-sources-08"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E258版，一字不改"
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
     "text_ref": "原文·E258版，一字不改"
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

原文 · E258 版，一字不改

# 事实来源与任务上下文

owner: `E:\.agents`

这里说清事实找谁、哪些项目冻结、项目分几档维护，以及长任务怎么接续。授权、施工和执行结果由各自专题负责。

## 事实找谁

- `E:\.agents`：AI 的行为规则、授权、能力路由、规则发布、个人技能和插件、跨项目协作。
- `E:\GitHub总索引`：仓库身份、公开或私有、远端、分支和工作副本、同步、恢复和发布事实。它只提供事实，公开分级和授权结论用本仓库的规则，不自己另定等级。
- `E:\PCConfig`：机器路径、端口、计划任务、运行环境、数据源、迁移、备份和恢复事实。
- 具体项目：业务含义、领域数据、兼容、启动、测试、部署和生成区。

按需要一步步读：看到绝对路径不等于要把三个基座全扫一遍。普通项目先读目录链上的规则和本地状态；只有 Git 事实会改变决定时才问 GitHub 总索引，只有机器事实会改变决定时才问 PCConfig，只有规则、能力或授权会改变决定时才读本仓库对应的专题。不知道的就说不知道，不从别的来源猜。

三个基座的日常治理是发现并修好有事实依据的问题，不是补跑备份。计划任务机制正常时，只看它有没有按时跑、回执对不对（约法 L21）；不为了刷新成功时间或让报表变绿去额外运行备份。已经证实的机制缺陷在原项目里修好并做相应的局部验证；本人暂停的任务保持暂停。

## 冻结的项目

冻结的项目（约法 L24）：本人没主动提这个项目的具体需求时，AI 不主动看代码、研究、审计、修复、升级或优化；它们的计划任务停用，换电脑时也不重建。本人说“全部项目”“全局完善”这类批量指令时，默认不包括冻结项目，也不先读它们的代码再决定。本人点名提具体需求时，只按这次需求取材和处理，不需要说“解冻”，也不因此恢复日常维护；只提到名字不算需求。活动项目引用了它、模型升级了或发现能优化，都不是去碰它的理由；真需要改冻结项目时，说清依赖和缺口，等本人提出。识别和排除冻结项目时，只读最小的身份和状态信息。

冻结名单只维护在这里。仓库标识都是 `wlyaaaaa/<repo>`，名字比对不分大小写。

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
   "release": "E258",
   "sha256": "c6dd00ecb9cba5da30911d74f0cc72ee651435dc1307a3bcbdf9b3d1e8679d30",
   "public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e",
   "from": "## 三档维护",
   "to": "### 一样东西只存一处",
   "start": 1597,
   "end": 4051,
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
  "source_public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e",
  "source_rule_part": "rule-context-sources/rule-context-sources-09"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E258版·续"
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
     "text_ref": "原文·E258版·续"
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

原文 · E258 版 · 续

## 三档维护

项目分三档（约法 L25）：

- **日用**：出错就修，也可以改进。
- **偶用**：只修报错，不加功能。
- **存档**：不维护，也就是上面的冻结名单。

新项目默认是日用，本人另说的除外。

| 档位 | 项目 |
|---|---|
| 偶用 | 屏保 emerald-veil（`emerald-veil`）、Steam 皮肤备份（`steam-millennium-config-backup`）、Typora 主题（`typora-theme-pack`）、两台电脑的剪贴板同步 meshclip-kit（`meshclip-kit`）、机箱小屏的曲面屏叠加层（PC-Panel-Hub 仓库里的一个功能，仓库本身按日用）、工作交付（`work-delivery-copilot`）、视频制作（`video-scaffold`）、vault 加密工具（`vault-tool`）、GitHub 个人主页（`wlyaaaaa`）、公开项目的私有配套库（`public-project-private-backup`）、Key 仓库（`Key`） |
| 存档 | 冻结名单里的全部项目 |
| 日用 | 其余所有项目 |

## 长任务接续

派活、向本人提问或请本人决定之前，按本次任务的来源取回必要的现行决定；普通回复不自动注入。Claude、Codex 压缩或恢复后由同一 `tools/current_decision_context.py` 投影现行决定表；原生子代理压缩跳过 SessionStart 时，从原任务接续状态读取目标、原话、更正和未结事项。相同边界的重复投递去重，不改全局窗口、不强制换对话。

用现有的任务状态分清：本人原话和更正、已确认的结果和授权、现场事实和未知、可替换的方案、真正做完的和还剩的。做取舍前先看现行决定索引，详情按出处查。摘要和计划不产生新需求；转述会改变意思的关键原话保留原句。会影响其他 AI 做决定或理解情况的经验、教训、本人决定和必要事实，当场写进对应的项目或基座文件（例如项目的 AGENTS.md、说明文档、登记表），不写进 Codex 或 Claude 自己的记忆区；写的是结论，不是日志和过程记录（约法 L30）。简单任务不机械建文档，不建全景个人库或新的记忆服务，不记录隐藏推理。停下时还有没做完的，留下能接着做的状态：在哪里、做到哪、还差什么。

README 只给 AI 和维护使用，简短列出现行入口，不再另写一份给本人看的长文档。给本人看的说明、指南和急救步骤统一由网站 `wly0829.cn` 从各自唯一来源生成；电脑离线时，网站的急救页也必须可读。项目的 AGENTS 只写这个项目真正不同的地方；实现或入口变了、影响到它写的承诺时同步更新。网站取材和去副本按下一节执行（出处：决定 FZ7）。

第三方 CLI 长任务由 AICLI 和具体项目负责接续，不再交给个人技能。到自然边界保存压缩前 checkpoint；恢复时重读项目规则、当前状态、`git status` / `git diff` 和待改源码，摘要只作线索。

### 压缩后的后台复核

Claude、Codex 根会话压缩后，复用现有原话存档和 GPT 后台任务做增量复核；正常工作不等它。根会话持续维护并在压缩前更新项目已有的短任务状态；没有现成入口时用本任务 `work/task-state.md`，保留当前目标、要求出处、已完成与未结事项、下一步和证据位置，不再复制整段历史。当前用 Sol ultra，资料定位优先脚本；不让 Luna 的初筛成为跳过最终复核的唯一依据。（出处：决定文档“压缩后增量复核与汇报提问”）

纯技术工作不依赖资料解锁（约法 L18）。资料锁着或未知、又到了压缩预警时，根会话若已确认整个现有会话确为纯技术，可用技术范围登记（`../operations/context-hooks.md#锁定时的技术复核`）记录当前原话边界及确为技术资料的证据位置，命令见该运维文档。登记由 AI 做，不请本人另行批准；新增或改写的真人消息不继承旧判断。旧历史混有私人内容或范围不明时不登记整段技术，仍走原资料入口，不先读私人历史来补这个判断。该登记不解锁资料、不放行私人库；未读取的部分继续列为未覆盖。

- 每个新压缩边界只排一次，同根会话最多一批在跑；普通新消息不新开复核，子代理的压缩不递归派发。未覆盖部分保留，不把重复恢复当成新一批。
- 对照本批全部新增用户原话，查交接或待办漏记的小要求，并对照仍有效的旧未结要求；检查事实出处、实际完成证据、擅改决定及压缩接续。按[原话分类表](/rules/engineering-delivery/#本人的话怎么分类怎么对待ai-写的稿子可以改)核对，分类分歧只把禁令边界上的作为提醒交回，不阻塞工作；审查意见不产生用户决定。
- 按原文和产物位置分段读取，不把整个窗口塞给复核者。覆盖位置和未结项落在现有任务状态，只有有效覆盖回执才推进；失败、超时、资料缺口和未检查的摘要如实列明，不写成通过。
- 复核只读，短结果在原根会话下一可投递的工具或消息边界送回，详细证据按需读取。根先对照当前版本，再处理仍存在的问题；已经修好的不重复打扰。普通提醒不阻塞主任务，影响当前决定或交付的实质问题由根核实处理，重大动作仍按原把关规则。
- 每批有效工作预算当前为 8 分钟，正常短回报目标 500 字；这是可调的 AI 实现参数，不是牺牲覆盖或删除关键问题的理由。排队、重试和收尾宽限单列；不自动无限延时。中断在原批次接续，不反复新建替身。

程序入口、暂停开关和两宿主实际支持的事件见上下文 Hook 运维（`../operations/context-hooks.md`）。纯模型主动换窗与原生压缩分别验收，不能从一种事件的成功推定另一种也已接通。

::screen{#rule-context-sources-10 section="original"}

```typeset
{
 "screen": {
  "id": "rule-context-sources-10",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.context-sources.md",
   "release": "E258",
   "sha256": "c6dd00ecb9cba5da30911d74f0cc72ee651435dc1307a3bcbdf9b3d1e8679d30",
   "public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e",
   "from": "### 一样东西只存一处",
   "to": null,
   "start": 4051,
   "end": 6253,
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
  "source_public_sha256": "9a41b24a4f69f30687d9c26edc0157e154c37d09a90ce50ca77a435eed5c894e",
  "source_rule_part": "rule-context-sources/rule-context-sources-10"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E258版·续"
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
     "text_ref": "内容写到哪里怎么跟本人说话经skills/explain-to-me按个人表达项目的流程维护；新增时先查同类并合并，保留",
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
     "text_ref": "原文·E258版·续"
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

原文 · E258 版 · 续

### 一样东西只存一处

规则、事实、决定和本人原话各只存一处，就是上面“事实找谁”分给它的家；本人的决定原话存决定文档，本人自己的事实存理解库明示。别处用到时，写一句现行结论并指向那一处（路径、章节或编号），不整段抄。会变的数（版本、数量、剩余空间、“第几行”、部署或运行状态）的家是能查到它的命令、配置或系统本身：说明、规则、手册这类长期文档写去哪查，非写不可就注明是哪天看到的；带日期的决定记录、汇报、计划和评测保留当时的值，不回头改。发现副本时，先把副本里更新或多出来的内容并回它的家，再把副本改成指针。由工具从唯一来源生成、并核对一致的副本（例如规则发布快照、装到用户目录的入口文件、网站生成的说明页面）不算副本。急救步骤的来源在 PCConfig，网站照它生成，并保证电脑离线时仍能在网站读到急救页；给本人看的内容不再在仓库 README 或另一份长指南里手写维护。过时的历史报告和设计稿不改写，没人再用就移出工作区。跨文件查重用 [Find-DuplicateContent.ps1](/source-tools/Find-DuplicateContent.ps1)，结果逐组判断后再收副本。

### 共享经验的落点

记忆的使用边界按[约法 L30](/rules/charter/#十关于规则本身)，两个宿主的关闭配置见各自适配专题。本人纠正、本人新定的规矩和踩过的坑，当轮写到下面对应的共享位置，写完在回复里一句话说明写在哪；不能因为记忆关了就不记。

本人对 AI、项目和电脑的决定原话，现行存 `docs/owner-decisions/YYYY-MM.md`，分卷索引为 `docs/owner-decisions.md`。新增原话用 `python -B -X utf8 tools/owner_decision_store.py append --input <原话节.md>` 写入月卷，分卷索引只作导航。新增或大改功能、新定或推翻决定时，当场原样记原话与北京时间；分类含义、混合消息拆分、AI 取法、哪些消息不进决定文档和索引、本人改分类，按[工程与交付的唯一分类表](/rules/engineering-delivery/#本人的话怎么分类怎么对待ai-写的稿子可以改)。决定索引另标来源、性质、范围和取代关系。同一主题新决定默认覆盖旧决定；被取代或已办完的一次性记录整节原样移入 `docs/archive/`，默认搜索不命中，只供审查；历史另在 Git。别处只写现行做法与出处，不抄原话。移动时标取代关系，搜旧编号和节名改引用，行号改节标题；别的负责人管的发给对应会话。拿不准的留现行交本人定。编号和引用写法见决定文档分卷索引。本人自己的事实、偏好和价值记在理解库明示。

原话整条原样放引用块，连发各占一块，写来源（会话、源消息 UUID）；分类行写 `- 分类：①类别〔范围·修饰〕「片段」；②…`，每单元带范围（本次、项目或主题名、长期、至 YYYY-MM-DD，可组合），片段必须是同节某个引用块一字不差的子串，尽量在 20 字以内。选项、纠正、询问或回答 AI 请示的，写回答对象；新主题新开带北京时间的节，不追加到按会话命名的节。

记录原话的根会话当轮分类，两个宿主一致，不设审批；子代理不记原话、不改分类。“性质和范围／性质与范围”等旧段落原样保留。按类别搜 `rg -n "^- 分类：.*禁令〔" E:\.agents\docs\owner-decisions -g "*.md"`，换类别词即可。

| 内容 | 写到哪里 |
|---|---|
| 怎么跟本人说话 | 经 `skills/explain-to-me` 按个人表达项目的流程维护；新增时先查同类并合并，保留本人原话和适用范围。 |
| Claude 或 Codex 自己工具的坑 | 对应的[Claude 适配](/rules/claude-adapter/)或[Codex 适配](/rules/codex-adapter/)。 |
| 某个项目的事 | 该项目的 AGENTS.md 或相关文档。 |
| 本人的决定原话 | 决定月卷 `docs/owner-decisions/YYYY-MM.md`（索引 `docs/owner-decisions.md`）；别处写现行做法加出处编号。 |
| 拿不准放哪里 | 先写进现有共享文档的待办，发布规则时归位。 |

三基座周治理长期每周运行，做什么以自动任务定义为准；现役定义为 Codex 自动化 `github` 的 `E:\Data\AppData\Codex\automations\github\automation.toml`，定位见 `E:\PCConfig\registries\task_purpose_catalog.json`（出处：决定月卷 `docs/owner-decisions/2026-10.md`“驾驶舱与每周治理”“本轮基座完善范围”）。仍按现行个人资料状态取用私人内容，合并同类并保留原话语境，不把 AI 的猜测写成本人决定。网站不单设每周复核；暂停的手动入口仅在本人启动时运行，不算正在定时更新（出处：决定文档“网站：设计稿逐项审定、单层分工、留锚点、不重复介绍”）。
