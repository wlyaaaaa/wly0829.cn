---
{
 "title": "个人资料与数据处理",
 "kind": "rule-topic",
 "url": "/rules/privacy-data/",
 "tagline": "私人资料什么时候能用、放哪里、能公开多少。",
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
  "page": "rule-privacy-data",
  "kind": "rule-topic",
  "title": "个人资料与数据处理",
  "url": "/rules/privacy-data/",
  "tagline": "私人资料什么时候能用、放哪里、能公开多少。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E259",
   "commit": "2d764224dfda1d65ee065ce4d1f590c598b19850",
   "ruleset_sha256": "eefcc585ae714fd4ecdf99c64c750ad47d4ddd35a80fe05de2e7203cba01291f",
   "activated_at": "2026-10-12T05:01:29.265252+08:00",
   "file": "sources/rules/docs/contracts/agents.privacy-data.md",
   "sha256": "5ae76cc061bae9b3fcc92b5fe0c446f978ac4d5db68d286684841fa3986e37db",
   "public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：一只手把验证卡轻轻贴到小木柜的绿色挂锁上，挂锁“咔”地弹开，旁边的小沙漏翻转、细沙开始往下流；中间五级石台阶从 L1 到 L5 依次微微亮一下，L4 台阶上的小保险箱始终关着；下面 G、H 两块硬盘之间一道细绿光从左流到右，H 盘旁小木箱上的日历牌翻过一页；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，小牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E257（北京时间 10 月 11 日 13:02 起生效）",
     "meaning": "本页人话要点对齐的规则版本和它开始生效的时间；原文区的版本标注由拼页程序按拼页时生效的版本生成",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：release_id=E257，activated_at_utc=2026-10-11T05:02:36.7738409+00:00；原文 sha256=5ae76cc061bae9b3fcc92b5fe0c446f978ac4d5db68d286684841fa3986e37db",
     "screens": [
      "rule-privacy-data-07"
     ]
    },
    {
     "id": "n-grant-default",
     "text": "9 月 28 日读到密码中心现在的默认是 24 小时，预设 0.5、1、2、4、8、24、72 小时七档",
     "meaning": "个人资料解锁期当前的默认时长和预设档位（密码中心的设置快照，不是规则原文；原文写明程序出厂的 8 小时不算当前设置）",
     "as_of": "2026-09-28",
     "source": "Invoke-SecretBroker.ps1 -Action StatusPersonalEnvironment 的 duration_policy：default_minutes=1440、preset_minutes=[30,60,120,240,480,1440,4320]、minimum_minutes=30、maximum_minutes=4320",
     "screens": [
      "rule-privacy-data-02"
     ]
    },
    {
     "id": "n-hook-timeout",
     "text": "20 秒内查不到，就当“未知”",
     "meaning": "Claude 的 Hook 查个人资料状态的超时",
     "as_of": "2026-09-28",
     "source": "E:\\Data\\AppData\\Claude\\managed-hooks\\claude-root\\runtimes\\3db4ee1f…\\claude_root_runtime.py 第 29 行 PERSONAL_STATUS_TIMEOUT_SECONDS = 20、第 404–408 行查不到时返回“未知（status_unavailable），不取用私人资料”",
     "screens": [
      "rule-privacy-data-02"
     ]
    },
    {
     "id": "n-quarantine",
     "text": "9 月 28 日 17:11 跑完的每日热备之后，G 盘待删区里还留着 132 个文件、约 27.7 GB",
     "meaning": "G 盘 30 天待删区当时还保留的文件数和字节数（27,682,052,314 字节，按 1 GB = 10^9 字节算）",
     "as_of": "2026-09-28",
     "source": "G:\\80_Backup\\ControlPlane\\personal-replica-hot-last.json：completed_utc=2026-09-28T09:11:16Z、status=complete、deletion_quarantine.purge.retained_files=132、retained_bytes=27682052314、retained_directories=3",
     "screens": [
      "rule-privacy-data-06"
     ]
    },
    {
     "id": "n-regret-days",
     "text": "30 天后悔期",
     "meaning": "备份删除后悔期天数（规则原文，也是 PCConfig 登记值）",
     "as_of": "2026-09-28",
     "source": "原文第 47 行；E:\\PCConfig\\registries\\core_recovery.json 的 maintenance.deletion_quarantine.retention_days=30",
     "screens": [
      "rule-privacy-data-01",
      "rule-privacy-data-06",
      "rule-privacy-data-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Codex、Claude 和子代理用私人资料、判断公开内容、处理备份删除前从活动版本读它。",
     "source": "Invoke-EAgentRulesRelease.ps1 返回的 required_rule_paths.privacy_data_contract；rules-catalog.json 的 agents.privacy-data 条目"
    },
    {
     "id": "r-password-center-lock",
     "with": "password-center",
     "direction": "依靠",
     "flow": "资料锁的唯一状态和截止时间由密码中心的 SecretBroker 保存；查状态、检查、锁定、验证、续期都经 C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-SecretBroker.ps1。",
     "source": "原文第 9、16 行；Invoke-SecretBroker.ps1 第 4 行 ValidateSet 含这五个动作名"
    },
    {
     "id": "r-claude-hook",
     "with": "claude",
     "direction": "被读",
     "flow": "Claude 桌面版的 UserPromptSubmit Hook（claude_root_runtime.py）每条消息调用 StatusPersonalEnvironment，把“共享个人资料状态：…”写进这一轮的上下文。",
     "source": "C:\\Users\\10979\\.claude\\settings.json 第 14–25 行；claude_root_runtime.py 第 26–29、390–418 行"
    },
    {
     "id": "r-backup-pcconfig",
     "with": "pcconfig",
     "direction": "被落实",
     "flow": "“备份跟着原件走”和 30 天后悔期由电脑配置与恢复落实：热备 PersonalDataReplica-Hot-Daily 管 G、冷备 AIRecoveryColdSync-Daily 管 H，待删区根和天数登记在 core_recovery.json。",
     "source": "E:\\PCConfig\\docs\\recovery\\core_recovery_maintenance.md 第 97–108、112 行；E:\\PCConfig\\registries\\core_recovery.json maintenance.deletion_quarantine"
    },
    {
     "id": "r-companion-index",
     "with": "github-local-index",
     "direction": "被落实",
     "flow": "“公开仓库里的私密东西挪到私人配套仓库”由 GitHub 总索引的 Get-ProjectPrivateCompanion.ps1 查登记，公开项目的配套仓库是私有的 wlyaaaaa/public-project-private-backup。",
     "source": "运行 E:\\GitHub总索引\\tools\\Get-ProjectPrivateCompanion.ps1 -Repo wlyaaaaa/ChineseASR -Json（9 月 28 日）；project-entry-gate SKILL.md 第 10 行"
    },
    {
     "id": "r-skills",
     "with": "local-secret-broker、vault-workflow",
     "direction": "引用",
     "flow": "解锁和续期、SecretRef 的用法归 local-secret-broker 技能；Key 仓库和 Vault 加密库归 vault-workflow 技能。",
     "source": "原文第 16、23 行"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/charter/#L14",
     "screen": "rule-privacy-data-01",
     "text": "L14 我的电脑可信"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "rule-privacy-data-01",
     "text": "L18 个人资料锁着时"
    },
    {
     "target": "/rules/charter/#L19",
     "screen": "rule-privacy-data-01",
     "text": "L19 可信位置里原样保存"
    },
    {
     "target": "/rules/charter/#L20",
     "screen": "rule-privacy-data-01",
     "text": "L20 公开内容怎么看"
    },
    {
     "target": "/rules/charter/#L21",
     "screen": "rule-privacy-data-01",
     "text": "L21 备份跟着原件走"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-privacy-data-01",
     "text": "用户授权"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-privacy-data-01",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/projects/password-center/",
     "screen": "rule-privacy-data-01",
     "text": "密码中心项目页"
    },
    {
     "target": "/computer-access/",
     "screen": "rule-privacy-data-01",
     "text": "现在的资料状态 → 授权与状态"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "rule-privacy-data-02",
     "text": "约法 L17"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "rule-privacy-data-03",
     "text": "约法 L18"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-privacy-data-03",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/skills/local-secret-broker/",
     "screen": "rule-privacy-data-03",
     "text": "local-secret-broker"
    },
    {
     "target": "/rules/charter/#L19",
     "screen": "rule-privacy-data-04",
     "text": "约法 L19"
    },
    {
     "target": "/rules/charter/#L14",
     "screen": "rule-privacy-data-04",
     "text": "约法 L14"
    },
    {
     "target": "/skills/local-secret-broker/",
     "screen": "rule-privacy-data-04",
     "text": "local-secret-broker"
    },
    {
     "target": "/skills/vault-workflow/",
     "screen": "rule-privacy-data-04",
     "text": "vault-workflow"
    },
    {
     "target": "/rules/charter/#L20",
     "screen": "rule-privacy-data-05",
     "text": "约法 L20"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-privacy-data-05",
     "text": "用户授权"
    },
    {
     "target": "/rules/charter/#L21",
     "screen": "rule-privacy-data-06",
     "text": "约法 L21"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-privacy-data-06",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-privacy-data-09",
     "text": "用户授权"
    },
    {
     "target": "/rules/execution-coordination/#p-cite-rules",
     "screen": "rule-privacy-data-03",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/authorization/#p-unrestricted",
     "screen": "rule-privacy-data-03",
     "text": "用户授权"
    },
    {
     "target": "/skills/authorization-file-broker/",
     "screen": "rule-privacy-data-04",
     "text": "加密文件"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "分级表 L3、L4 的举例里有“没公开的纠纷材料”“亲密信息”两处字眼。它们是给所有公开内容分级用的泛指类别，不透露本人任何纠纷或私人关系，我按原文保留（原文屏和人话要点都照写）。旧稿（E184 时的 content\\rules\\privacy-data.json）把它们改成了“未公开的私人事务”“私生活信息”；我没照旧稿，理由是本人 9 月 28 日定“公开范围只按约法 L20 和分级表，不另立、不收紧”，且决定记录第 730 行说这个专题没有要删的字样。若 Claude 认为要删，删法是：原文屏删“没公开的纠纷材料、”和“或亲密”，最后一屏加一句说明，notes.dropped 改写。",
    "原文里唯一的 Markdown 链接 [用户授权](agents.authorization.md)（第 37 行）画成〔用户授权〕，链到 /rules/authorization/，看得见的字没变；按派活方的决定算一字不改。",
    "“开多久”：E190 原文改成“当前默认时长读密码中心的 duration_policy.default_minutes，不把程序出厂的 8 小时当成当前设置”，和 9 月 28 日读到的 24 小时不再矛盾；要点照新原文写，实例便签照旧写 24 小时（没有重新读密码中心）。",
    "开头一屏底部入口〔现在的资料状态 → 授权与状态〕链到 /computer-access/（第 2 批才做，没带锚点）。个人资料的锁开着还是关着、开到几点，最自然的家在“授权与状态”页；那页要不要显示资料状态、锚点叫什么，由第 2 批定。若嫌多余，整条横条删掉即可。已写进 batch2.md。",
    "BitLocker：E190 原文写明唯一例外是“BitLocker 恢复密钥的专用本机全量查看”，要点写成“本机专用的 BitLocker 恢复密钥全量查看”；原文的“标准输出”写成“命令输出”。",
    "“本机四种方式任选一种”：原文没列四种；页面按约法 L17 列出通行密钥、手机验证码、恢复码、Google 或微软账号，与 local-secret-broker SKILL.md 的 four-choice（Recovery、Passkey、TOTP、Account）对得上。",
    "开头词表里 SecretRef 的解释“登记过的程序凭它拿到密钥，规则、聊天和配置里都不出现密钥本身”依据 local-secret-broker 的 references\\credential-operations.md 第 108–114 行（AgentSecretRef 只给登记过的目标程序注入凭据，明文不输出）；Hook 和电脑 MCP 的一句话解释是我写的。",
    "人话翻译的取舍：“资料期”写成“解锁期”并在词表注明；“回读”类词本页没有；“图形界面”照写；“目录外的文件”照写（指当前工作目录以外）；“挪位解释”写成“挪位原因”；“生成物”照写；“活数据库”照写（指正在被程序使用的数据库）。",
    "三处实例便签（Hook 20 秒超时、默认 24 小时、G 盘待删区 132 个文件约 27.7 GB）和私人配套仓库名是本机现算的快照，不是规则原文；registry.numbers 记了屏号，更新网站时要重读。若认为规则页不该夹快照，删掉带“实例：”的几条即可，不影响要点。",
    "锚点给别的页用：〔私人仓库收口〕用 /rules/privacy-data/#p-private-repo，公开分级表用 #p-classification，资料锁用 #p-lock。“工程与交付”页现在只链到本页本身、“用户授权”页两处也只链到本页，它们可以补上这些锚点。",
    "全页都用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。",
    "第 3 屏“锁着的时候”里“由主对话请本人验证”的“主对话”即原文的“根会话”，本页开头词表没有定义这个词，沿用《分工与并行施工》页的叫法。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-privacy-data/page.json",
  "sha256": "ff3a2f3f8127dce37aad35293e890fbc920911d7cfbb31de38845f1d34e9495e",
  "converted_at_beijing": "2026-10-12T05:45:50+08:00"
 }
}
---

::screen{#rule-privacy-data-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“个人资料与数据处理”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题。副标题下面紧接一张浅绿细边圆角大卡片“先看是哪种情况”（卡头一条浅绿底色带，粗体深绿），是本屏最醒目的文字块：卡里三行，每行左边一个圆形小水彩图标、右边粗体情况名加说明：“只是普通技术工作”配一台屏幕上有绿色对勾的小笔记本电脑；“要用本人的私人资料”配一只挂着绿色挂锁的小木柜（和右边插画同一只）；“准备公开”配一级浅绿小石台阶上放着一个小喇叭。三行之间细虚线分隔，行里的〔〕画成链接样式。卡片下面是介绍段（字小一号，五个约法条目画成链接样式），再下面“跳到：”后面四个圆角小按钮（白底浅绿描边绿字）。右边约 45% 宽：上面约 62% 高是原来那幅水彩插画，照原图不变——上段私人资料小木柜挂绿色挂锁、锁上小牌“资料锁”、柜旁小沙漏、一只手递来验证卡；中段五级浅石台阶侧面刻“L1”到“L5”、L4 上一只关着的小保险箱；下段两块水彩硬盘贴“G”“H”、H 盘旁小木箱挂日历牌“30 天”。插画里只有这些小牌和标签上有字，text 里“资料锁　L1　L2　L3　L4　L5　G　H　30 天”这一行就是它们的字，不要另外画成一行文字。插画下面放一张浅绿细边小卡“先认几个词”，四个词条竖排，词条名粗体绿色，字小一号。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“本人的资料现在锁着还是开着、开到几点：”，右边一个显眼的按钮〔现在的资料状态 → 授权与状态〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；“先看是哪种情况”卡片整宽（三行，图标在左）；水彩插画（同横版，缩成整宽一幅，小牌上的字不变）；介绍段；“先认几个词”卡片（四个词条一行一条）；“跳到：”四个按钮排两行、每行两个；最下面横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "资料锁怎么走",
    "href": "/rules/privacy-data/#p-flow"
   },
   {
    "text": "五级怎么分",
    "href": "/rules/privacy-data/#p-levels"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/#p-direct"
   },
   {
    "text": "L14 我的电脑可信",
    "href": "/rules/charter/#L14"
   },
   {
    "text": "L18 个人资料锁着时",
    "href": "/rules/charter/#L18"
   },
   {
    "text": "L19 可信位置里原样保存",
    "href": "/rules/charter/#L19"
   },
   {
    "text": "L20 公开内容怎么看",
    "href": "/rules/charter/#L20"
   },
   {
    "text": "L21 备份跟着原件走",
    "href": "/rules/charter/#L21"
   },
   {
    "text": "密码中心项目页",
    "href": "/projects/password-center/"
   },
   {
    "text": "资料的锁和解锁",
    "href": "/rules/privacy-data/#p-lock"
   },
   {
    "text": "可信位置和秘密",
    "href": "/rules/privacy-data/#p-trusted"
   },
   {
    "text": "公开分级表",
    "href": "/rules/privacy-data/#p-classification"
   },
   {
    "text": "私人仓库和备份",
    "href": "/rules/privacy-data/#p-private-repo"
   },
   {
    "text": "现在的资料状态 → 授权与状态",
    "href": "/computer-access/"
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
     "text_ref": "个人资料与数据处理"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "本人的私人资料什么时候能用、放在哪里算可信、公开到哪一步、备份怎么跟着原件删。"
    },
    {
     "type": "points_card",
     "row": "privacy-intro",
     "width": "55%",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/icons/身份盾牌.png",
      "_library/icons/文稿堆.png"
     ],
     "text_ref": "先看是哪种情况"
    },
    {
     "type": "document_mock",
     "row": "privacy-intro",
     "width": "45%",
     "variant": "window",
     "text_ref": "资料锁L1L2L3L4L5GH30天",
     "base_asset": "_library/illustrations/ill-r3-313baf1d2fe281cb.png",
     "label_positions": [
      {
       "x": 20.0,
       "y": 4.51128,
       "width": 23.33333,
       "height": 6.51629,
       "align": "center"
      },
      {
       "x": 60.16667,
       "y": 53.88471,
       "width": 18.66667,
       "height": 5.76441,
       "align": "center"
      },
      {
       "x": 66.66667,
       "y": 42.85714,
       "width": 16.5,
       "height": 5.26316,
       "align": "center"
      },
      {
       "x": 73.16667,
       "y": 32.33083,
       "width": 15.66667,
       "height": 4.7619,
       "align": "center"
      },
      {
       "x": 79.16667,
       "y": 23.30827,
       "width": 12.66667,
       "height": 4.26065,
       "align": "center"
      },
      {
       "x": 84.16667,
       "y": 13.03258,
       "width": 10.5,
       "height": 4.26065,
       "align": "center"
      },
      {
       "x": 12.83333,
       "y": 73.43358,
       "width": 7.83333,
       "height": 10.27569,
       "align": "center"
      },
      {
       "x": 34.0,
       "y": 73.18296,
       "width": 8.83333,
       "height": 10.77694,
       "align": "center"
      },
      {
       "x": 64.16667,
       "y": 71.17794,
       "width": 18.66667,
       "height": 15.03759,
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
      },
      {
       "label_index": 5,
       "position_index": 5
      },
      {
       "label_index": 6,
       "position_index": 6
      },
      {
       "label_index": 7,
       "position_index": 7
      },
      {
       "label_index": 8,
       "position_index": 8
      }
     ],
     "layout": "illustration_labels"
    },
    {
     "type": "prose",
     "text_ref": "这是Codex、Claude和它们派出的子代理共用的专题，是约法L14我的电脑可信、"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "跳到：资料的锁和解锁可信位置和秘密公开分级表私人仓库和备份"
    },
    {
     "type": "glossary",
     "columns": 1,
     "text_ref": "先认几个词"
    },
    {
     "type": "notice",
     "text_ref": "本人的资料现在锁着还是开着、开到几点：现在的资料状态→授权与状态"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "prose",
    "content_card",
    "icon",
    "illustration",
    "inline_link",
    "bullet_list",
    "action_button",
    "segmented_band",
    "tag",
    "glossary"
   ],
   "source_layout": "横版 16:9。左边约 55% 宽是文字区：左上“个人资料与数据处理”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题。副标题下面紧接一张浅绿细边圆角大卡片“先看是哪种情况”（卡头一条浅绿底色带，粗体深绿），是本屏最醒目的文字块：卡里三行，每行左边一个圆形小水彩图标、右边粗体情况名加说明：“只是普通技术工作”配一台屏幕上有绿色对勾的小笔记本电脑；“要用本人的私人资料”配一只挂着绿色挂锁的小木柜（和右边插画同一只）；“准备公开”配一级浅绿小石台阶上放着一个小喇叭。三行之间细虚线分隔，行里的〔〕画成链接样式。卡片下面是介绍段（字小一号，五个约法条目画成链接样式），再下面“跳到：”后面四个圆角小按钮（白底浅绿描边绿字）。右边约 45% 宽：上面约 62% 高是原来那幅水彩插画，照原图不变——上段私人资料小木柜挂绿色挂锁、锁上小牌“资料锁”、柜旁小沙漏、一只手递来验证卡；中段五级浅石台阶侧面刻“L1”到“L5”、L4 上一只关着的小保险箱；下段两块水彩硬盘贴“G”“H”、H 盘旁小木箱挂日历牌“30 天”。插画里只有这些小牌和标签上有字，text 里“资料锁　L1　L2　L3　L4　L5　G　H　30 天”这一行就是它们的字，不要另外画成一行文字。插画下面放一张浅绿细边小卡“先认几个词”，四个词条竖排，词条名粗体绿色，字小一号。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“本人的资料现在锁着还是开着、开到几点：”，右边一个显眼的按钮〔现在的资料状态 → 授权与状态〕。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1,
     2
    ],
    "card_groups": [
     "本人的私人资料什么时候能用、放在哪里算可信、公开到哪一步、备份怎么跟着原件删。",
     "先看是哪种情况",
     "先认几个词"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边一个圆形小水彩",
     "右边插画",
     "右边约 45% 宽：上面约 62% 高是原来那幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。首屏左55%标题、副题、三行情况卡、介绍和四跳转；右45%主插画及四词词条卡；底部状态横条整宽。右图的资料锁/L1-L5/G/H/30天须以末段原文填入图内牌位；当前document_mock只是保文样稿，待comp-slots插画标签定位，不能额外画成一行字。三个情况图标的库存预算仅1个不足scene明确3个，须补真实三图；四跳转带“跳到：”的para尚未成为按钮网格，待comp-text保前缀并把原链接排成按钮。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标0/1，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：首屏标题与主体占全宽；四跳转按钮排2列；词条55%和唯一插画标签块45%并排；删除单独插画块，document_mock保留唯一插画。\nmain-closer：图内标签接final-label-geometry实测唯一bindings；当前完整底图SHA fb3f09fde58e2ce0f944bfc6c6f0f6bc528a886b74b21db8b9ff371d8af076d9；保原字与motion，最终安全框包容由DOM复核。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "illustration",
     "asset": "_library/illustrations/ill-r3-313baf1d2fe281cb.png",
     "size": "large",
     "align": "center",
     "target_width": "100%"
    },
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "个人资料与数据处理"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "本人的私人资料什么时候能用、放在哪里算可信、公开到哪一步、备份怎么跟着原件删。"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/盾牌对勾.png",
      "_library/icons/身份盾牌.png",
      "_library/icons/文稿堆.png"
     ],
     "text_ref": "先看是哪种情况"
    },
    {
     "type": "prose",
     "text_ref": "这是Codex、Claude和它们派出的子代理共用的专题，是约法L14我的电脑可信、"
    },
    {
     "type": "glossary",
     "columns": 1,
     "text_ref": "先认几个词"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "跳到：资料的锁和解锁可信位置和秘密公开分级表私人仓库和备份"
    },
    {
     "type": "prose",
     "text_ref": "资料锁L1L2L3L4L5GH30天",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "本人的资料现在锁着还是开着、开到几点：现在的资料状态→授权与状态"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "content_card",
    "illustration",
    "prose",
    "glossary",
    "action_button",
    "icon",
    "inline_link",
    "bullet_list",
    "segmented_band",
    "tag"
   ],
   "source_layout": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；“先看是哪种情况”卡片整宽（三行，图标在左）；水彩插画（同横版，缩成整宽一幅，小牌上的字不变）；介绍段；“先认几个词”卡片（四个词条一行一条）；“跳到：”四个按钮排两行、每行两个；最下面横条改成上面一行说明、下面一个整宽按钮。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1,
     2
    ],
    "card_groups": [
     "本人的私人资料什么时候能用、放在哪里算可信、公开到哪一步、备份怎么跟着原件删。",
     "先看是哪种情况",
     "先认几个词"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边一个圆形小水彩",
     "右边插画",
     "右边约 45% 宽：上面约 62% 高是原来那幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。标题→副题→三行情况卡→整宽插画→介绍→四词卡→跳转2×2→状态说明及整宽按钮。图内九处标签只映射到插画不另列；当前独立mock未实现空间叠合。副标题与词条不加外部大章题。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标0/1，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：删除单独插画块，document_mock保留唯一插画。\nmain-closer：图内标签接final-label-geometry实测唯一bindings；当前完整底图SHA fb3f09fde58e2ce0f944bfc6c6f0f6bc528a886b74b21db8b9ff371d8af076d9；保原字与motion，最终安全框包容由DOM复核。\nmain-closer 2026-10-03T20:36:28+08:00：实际文字Range超出真实安全牌框，竖版撤下坐标绑定，恢复原合法保字＋composition incomplete；不把单靠固定.tb框的旧机器pass当通过。safe DOM证据 main-closer/family-label-dom.json；横版实测安全绑定保留。\nmain-closer5 2026-10-04T07:00:58.635971+08:00：按Claude本轮裁定，手机首屏采用插画上、文字下；复用01-h既有无字插画，整幅100%宽等比缩放，不裁物件。原五/九标签改既有prose顺排于文字区，全部原字、motion及其它屏保全；不再请求插画牌面净区，也不更改任何素材ready。"
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
   "source_phrase": "只是普通技术工作：代码、天气、学习和项目实施、电脑配置、性能排查照常做，不用解锁；普通的业务和技术事实，不因为属于本人就升级保护。",
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
   "asset": "rule-privacy-data/rule-privacy-data-01-icon-02.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "身份盾牌",
   "source_phrase": "要用本人的私人资料 ：偏好、履历、通信、健康、财务、私人关系、以前的个人经历。资料锁开着才用；锁着就请本人验证一次，不换来源绕过，也不拿缩水的回答凑。资料锁怎么走",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-privacy-data/rule-privacy-data-01-icon-03.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "准备公开 ：姓名、生日、照片、履历这类普通资料不设限，不因为是个人资料就删改；能用的密码和凭据永远不公开；只有真会招来诈骗、骚扰、被追踪的才谨慎。按五级怎么分判断；定了等级不等于可以发布，发布另看用户授权。",
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
   "asset": "_library/illustrations/ill-r3-313baf1d2fe281cb.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "ill-r3-313baf1d2fe281cb",
   "source_phrase": "右边约 45% 宽：上面约 62% 高是原来那幅水彩插画，照原图不变——上段私人资料小木柜挂绿色挂锁、锁上小牌“资料锁”、柜旁小沙漏、一只手递来验证卡；中段五级浅石台阶侧面刻“L1”到“L5”、L4 上一只关着的小保险箱；下段两块水彩硬盘贴“G”“H”、H 盘旁小木箱挂日历牌“30 天”。",
   "sha256": "fb3f09fde58e2ce0f944bfc6c6f0f6bc528a886b74b21db8b9ff371d8af076d9",
   "status": "ready",
   "original_elements": [
    "右边约 45% 宽：上面约 62% 高是原来那幅水彩插画，照原图不变——上段私人资料小木柜挂绿色挂锁、锁上小牌抽象图形、柜旁小沙漏、一只手递来验证卡；中段五级浅石台阶侧面刻抽象图形到抽象图形、L4 上一只关着的小保险箱；下段两块水彩硬盘贴抽象图形抽象图形、H 盘旁小木箱挂日历牌抽象图形"
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
   "asset": "rule-privacy-data/rule-privacy-data-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-114b2984bb76abfd8650",
   "title_text": "个人资料与数据处理",
   "sha256": "2e412fcb966f9f6b24fddcc638fb5737acd88777530bd3b856b0f2c94c0a1aad",
   "status": "ready",
   "source_box": [
    32,
    37,
    793,
    174
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 个人资料与数据处理

**本人的私人资料什么时候能用、放在哪里算可信、公开到哪一步、备份怎么跟着原件删。**

**先看是哪种情况**
- **只是普通技术工作**：不依赖本人情况的通用讲解、代码、天气、项目实施、电脑配置、性能排查和规则维护照常做，不用解锁；普通的业务和技术事实，不因为属于本人就升级保护。
- **要用本人的私人资料**：问的是本人自己的情况（身体、心理、生活等），或回答要用到本人的偏好、履历、通信、健康、财务、私人关系、以前的个人经历；拿不准按需要处理。资料锁开着才用；锁着就先请本人验证一次，通过后再查资料、派活和作答，不换来源绕过，也不拿缩水的回答凑。〔资料锁怎么走〕
- **准备公开**：姓名、生日、照片、履历这类普通资料不设限，不因为是个人资料就删改；能用的密码和凭据永远不公开；只有真会招来诈骗、骚扰、被追踪的才谨慎。按〔五级怎么分〕判断；定了等级不等于可以发布，发布另看〔用户授权〕。

这是 Codex、Claude 和它们派出的子代理共用的专题，是约法〔L14 我的电脑可信〕、〔L18 个人资料锁着时〕、〔L19 可信位置里原样保存〕、〔L20 公开内容怎么看〕、〔L21 备份跟着原件走〕的细则。

**先认几个词**
- **密码中心**：本机管密码、密钥和本人验证的程序（〔密码中心项目页〕），其中的 SecretBroker 管资料锁。
- **SecretRef**：密码中心里的一条取用登记，登记过的程序凭它拿到密钥，规则、聊天和配置里都不出现密钥本身。
- **Hook、电脑 MCP**：Hook 是 Codex、Claude 每收到一条消息先自动跑的一小段程序；电脑 MCP 让别处的 AI 经网络操作这台电脑。
- **L1–L5**：公开内容的五个等级，和约法的 L1–L30 条号不是一回事。

跳到：〔资料的锁和解锁〕〔可信位置和秘密〕〔公开分级表〕〔私人仓库和备份〕

资料锁　L1　L2　L3　L4　L5　G　H　30 天

本人的资料现在锁着还是开着、开到几点：〔现在的资料状态 → 授权与状态〕

::screen{#rule-privacy-data-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-02",
  "section": "points",
  "title": "人话要点：锁和解锁（一）——一张流程图",
  "scene": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上一行深绿大字是本屏的“## …”标题（井号不画）。左边约 62% 宽是一张大圆角卡“一张图：这次能不能用私人资料”（卡头浅绿底色带、深绿粗体），卡里画成从上往下的流程图：最上面一个浅绿底圆角起点框，写“每条新消息先读一次资料状态”那一句，框左一个小图标（挂锁旁一块小表盘）；向下箭头接问题框“这次要用私人资料吗？”；从它向左伸出写着“不用”的绿色箭头，指向实心绿底白字的终点框“照常做：……”；向下写着“要用”的箭头接问题框“状态开着吗？”，箭头旁用小号灰字写“用私人资料不等于要先把隐私盘点一遍。”（“往下看状态”就是这支箭头，不另写）；“状态开着吗？”向左伸出写着“开着”的箭头，指向实心绿底白字终点框“直接用，到截止时间为止。”；向下写着“锁着、过期或说不清”的箭头，接一个浅琥珀底的步骤框“请本人验证一次：……”，框左一个小图标（一张验证卡和一把钥匙）；再向下接问题框“验证结果”，向左写着“通过、资料读得到”的箭头指向实心绿底终点框“接着处理原来的问题。”；向右写着“本人取消、拒绝或超时”的箭头指向浅灰底终点框“只结束这一次：……”，框左一个小图标（一张被轻轻划掉的小票），框里的〔锁着的时候〕画成链接样式。text 里每个“→”就是对应的那支箭头，“→”左边的字写在箭头上，右边的字写在框里；问题框是浅绿底圆角框、粗体深绿字。右边约 38% 宽上下两张白底细浅绿描边圆角卡：上“只有一份状态”（图标：挂锁旁边一块小表盘），下“开多久”（图标：一个小沙漏）；以“实例：”开头的那条画成各自卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。卡片里每条要点前一个小绿圆点，正文深蓝灰；`…` 里的名字用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；流程卡整宽，流程从上往下，左右分支改成在问题框下面并排的两个小框（窄时一行一个），箭头上的字照写；然后“只有一份状态”“开多久”两张整宽卡，实例便签跟在各自卡片底部。字和横版完全一样。字多时在完整卡片之间拆屏：-v 放标题和流程卡，-v2 放后两张卡。",
  "links": [
   {
    "text": "约法 L17",
    "href": "/rules/charter/#L17"
   },
   {
    "text": "锁着的时候",
    "href": "/rules/privacy-data/#p-locked"
   }
  ],
  "anchors": [
   {
    "id": "p-lock",
    "text": "人话要点 · 个人资料的锁和解锁"
   },
   {
    "id": "p-flow",
    "text": "一张图：这次能不能用私人资料"
   },
   {
    "id": "p-one-state",
    "text": "只有一份状态"
   },
   {
    "id": "p-duration",
    "text": "开多久"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 个人资料的锁和解锁"
    },
    {
     "type": "topology",
     "columns": 2,
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "一张图：这次能不能用私人资料",
     "layout": "graph",
     "columns_v": 1,
     "size": "medium",
     "graph_nodes": [
      {
       "id": "heading",
       "count": 1,
       "row": 1,
       "column": 1,
       "row_v": 1,
       "column_v": 1,
       "shape": "context",
       "column_span": 2
      },
      {
       "id": "start",
       "count": 1,
       "row": 2,
       "column": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png",
       "column_span": 2,
       "segment_refs": [
        "Codex"
       ],
       "prefix_end": "：",
       "prefix_role": "title"
      },
      {
       "id": "need",
       "count": 1,
       "row": 3,
       "column": 1,
       "row_v": 3,
       "column_v": 1,
       "column_span": 2
      },
      {
       "id": "no-need",
       "count": 1,
       "row": 4,
       "column": 1,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/icons/钥匙.png"
      },
      {
       "id": "need-yes",
       "count": 1,
       "row": 4,
       "column": 2,
       "row_v": 5,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "state",
       "count": 1,
       "row": 5,
       "column": 2,
       "row_v": 6,
       "column_v": 1
      },
      {
       "id": "open",
       "count": 1,
       "row": 6,
       "column": 1,
       "row_v": 7,
       "column_v": 1,
       "icon": "_library/icons/沙漏.png"
      },
      {
       "id": "locked",
       "count": 1,
       "row": 6,
       "column": 2,
       "row_v": 8,
       "column_v": 1,
       "icon": "_library/icons/身份盾牌.png"
      },
      {
       "id": "result",
       "count": 1,
       "row": 7,
       "column": 2,
       "row_v": 9,
       "column_v": 1
      },
      {
       "id": "passed",
       "count": 1,
       "row": 8,
       "column": 1,
       "row_v": 10,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "cancelled",
       "count": 1,
       "row": 8,
       "column": 2,
       "row_v": 11,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      }
     ],
     "edges": [
      {
       "from": "start",
       "to": "need",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "need",
       "to": "no-need",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "need",
       "to": "need-yes",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "need-yes",
       "to": "state",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "state",
       "to": "open",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "state",
       "to": "locked",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "locked",
       "to": "result",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "result",
       "to": "passed",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "result",
       "to": "cancelled",
       "from_side": "bottom",
       "to_side": "top"
      }
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-02-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "只有一份状态",
     "header_icon_motion_dots": {
      "asset_sha256": "dd5edf7b9984e271a1241436e0530a2907cc18e3ccd30607230bf29655f1ceb0",
      "dots": [
       [
        0.7777777777777778,
        0.6341463414634146,
        0.02666666666666667,
        0.04878048780487805
       ]
      ]
     }
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-02-icon-02.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "开多久"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "prose",
    "points_card",
    "section_heading",
    "flow",
    "icon",
    "inline_link",
    "quote",
    "notice",
    "bullet_list",
    "monospace"
   ],
   "source_layout": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上一行深绿大字是本屏的“## …”标题（井号不画）。左边约 62% 宽是一张大圆角卡“一张图：这次能不能用私人资料”（卡头浅绿底色带、深绿粗体），卡里画成从上往下的流程图：最上面一个浅绿底圆角起点框，写“每条新消息先读一次资料状态”那一句，框左一个小图标（挂锁旁一块小表盘）；向下箭头接问题框“这次要用私人资料吗？”；从它向左伸出写着“不用”的绿色箭头，指向实心绿底白字的终点框“照常做：……”；向下写着“要用”的箭头接问题框“状态开着吗？”，箭头旁用小号灰字写“用私人资料不等于要先把隐私盘点一遍。”（“往下看状态”就是这支箭头，不另写）；“状态开着吗？”向左伸出写着“开着”的箭头，指向实心绿底白字终点框“直接用，到截止时间为止。”；向下写着“锁着、过期或说不清”的箭头，接一个浅琥珀底的步骤框“请本人验证一次：……”，框左一个小图标（一张验证卡和一把钥匙）；再向下接问题框“验证结果”，向左写着“通过、资料读得到”的箭头指向实心绿底终点框“接着处理原来的问题。”；向右写着“本人取消、拒绝或超时”的箭头指向浅灰底终点框“只结束这一次：……”，框左一个小图标（一张被轻轻划掉的小票），框里的〔锁着的时候〕画成链接样式。text 里每个“→”就是对应的那支箭头，“→”左边的字写在箭头上，右边的字写在框里；问题框是浅绿底圆角框、粗体深绿字。右边约 38% 宽上下两张白底细浅绿描边圆角卡：上“只有一份状态”（图标：挂锁旁边一块小表盘），下“开多久”（图标：一个小沙漏）；以“实例：”开头的那条画成各自卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。卡片里每条要点前一个小绿圆点，正文深蓝灰；`…` 里的名字用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "这次要用私人资料吗？",
     "状态开着吗？",
     "验证结果"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": true
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左62%一个从上到下的判断大卡，起点→问题→左右分支→验证结果；右38%两规则卡上下。当前flow会把bullets各自线性成链，不支持问题/结果回接分支与箭头上的标签；需要comp-diagram分支流程布局，全文仍保留。实例便签用inset_prefixes已支持嵌框，黄底是未批准样式需样张。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 个人资料的锁和解锁"
    },
    {
     "type": "topology",
     "columns": 2,
     "connector": "arrow",
     "illustration": "left_inside",
     "page_break_after": true,
     "text_ref": "一张图：这次能不能用私人资料",
     "layout": "graph",
     "columns_v": 1,
     "size": "medium",
     "graph_nodes": [
      {
       "id": "heading",
       "count": 1,
       "row": 1,
       "column": 1,
       "row_v": 1,
       "column_v": 1,
       "shape": "context",
       "column_span": 2
      },
      {
       "id": "start",
       "count": 1,
       "row": 2,
       "column": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png",
       "column_span": 2,
       "segment_refs": [
        "Codex"
       ],
       "prefix_end": "：",
       "prefix_role": "title"
      },
      {
       "id": "need",
       "count": 1,
       "row": 3,
       "column": 1,
       "row_v": 3,
       "column_v": 1,
       "column_span": 2
      },
      {
       "id": "no-need",
       "count": 1,
       "row": 4,
       "column": 1,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/icons/钥匙.png"
      },
      {
       "id": "need-yes",
       "count": 1,
       "row": 4,
       "column": 2,
       "row_v": 5,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "state",
       "count": 1,
       "row": 5,
       "column": 2,
       "row_v": 6,
       "column_v": 1
      },
      {
       "id": "open",
       "count": 1,
       "row": 6,
       "column": 1,
       "row_v": 7,
       "column_v": 1,
       "icon": "_library/icons/沙漏.png"
      },
      {
       "id": "locked",
       "count": 1,
       "row": 6,
       "column": 2,
       "row_v": 8,
       "column_v": 1,
       "icon": "_library/icons/身份盾牌.png"
      },
      {
       "id": "result",
       "count": 1,
       "row": 7,
       "column": 2,
       "row_v": 9,
       "column_v": 1
      },
      {
       "id": "passed",
       "count": 1,
       "row": 8,
       "column": 1,
       "row_v": 10,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "cancelled",
       "count": 1,
       "row": 8,
       "column": 2,
       "row_v": 11,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      }
     ],
     "edges": [
      {
       "from": "start",
       "to": "need",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "need",
       "to": "no-need",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "need",
       "to": "need-yes",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      },
      {
       "from": "need-yes",
       "to": "state",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "state",
       "to": "open",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "state",
       "to": "locked",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      },
      {
       "from": "locked",
       "to": "result",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "result",
       "to": "passed",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "result",
       "to": "cancelled",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      }
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-02-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "只有一份状态"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-02-icon-02.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "开多久"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "flow",
    "prose",
    "notice",
    "chapter_title",
    "points_card",
    "section_heading",
    "icon",
    "inline_link",
    "quote",
    "bullet_list",
    "monospace"
   ],
   "source_layout": "竖版 9:16：标题在上；流程卡整宽，流程从上往下，左右分支改成在问题框下面并排的两个小框（窄时一行一个），箭头上的字照写；然后“只有一份状态”“开多久”两张整宽卡，实例便签跟在各自卡片底部。字和横版完全一样。字多时在完整卡片之间拆屏：-v 放标题和流程卡，-v2 放后两张卡。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "这次要用私人资料吗？",
     "状态开着吗？",
     "验证结果"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": true
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。第一张标题和完整流程，第二张只有一份状态、开多久；分支窄时一行一个。page_break_after仅规格意图，flow/核心尚不消费该标记；需comp-diagram分支布局和main卡间分页，不能说已按v/v2分好。"
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
   "source_phrase": "挂锁旁一块小表盘",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一张验证卡和一把钥匙",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一张被轻轻划掉的小票",
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "沙漏",
   "source_phrase": "开着 → **直接用**，到截止时间为止。",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "身份盾牌",
   "source_phrase": "锁着、过期或说不清 → **请本人验证一次**：本机四种方式任选一种（通行密钥、手机验证码、恢复码、Google 或微软账号，同〔约法 L17〕），手机上用现有的验证器；不先派别的模型批准，也不让本人验证两次。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "通过、资料读得到 → **接着处理原来的问题**。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "本人取消、拒绝或超时 → **只结束这一次**：锁着的还锁着，已开的照样有效，不连带锁别的；不自动重试，也不换个入口重来，本人之后明确再要才重新办。缺资料的部分不换来源凑，见〔锁着的时候〕；普通工作照做。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-2562c2b6911b2e5437d5.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-02-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-2562c2b6911b2e5437d5",
   "title_text": "人话要点 · 个人资料的锁和解锁",
   "sha256": "a0dd205ba0e931d06d774bbd1864f60b48a36c3cf0f87c22ec7dc9420fa08731",
   "status": "ready",
   "source_box": [
    34,
    94,
    934,
    245
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 个人资料的锁和解锁

### 一张图：这次能不能用私人资料
**每条新消息先读一次资料状态**：Codex、Claude 由 Hook 读，电脑 MCP 由它自带的状态查询 `ComputerContext` 读。
**这次要用私人资料吗？**
- 不用 → **照常做**：不依赖本人情况的通用讲解、代码、天气、项目实施、电脑配置（PCConfig）、性能排查和规则维护不用解锁。问本人自己的身体、心理、生活、学习等，就需要。
- 要用，或拿不准 → 根会话先看状态；锁着时先验证，先于检索、派活和回答。用私人资料不等于要先把隐私盘点一遍。
**状态开着吗？**
- 开着 → **直接用**，到截止时间为止。
- 锁着、过期或说不清 → **请本人验证一次**：本机四种方式任选一种（通行密钥、手机验证码、恢复码、Google 或微软账号，同〔约法 L17〕），手机上用现有的验证器；不先派别的模型批准，也不让本人验证两次。
**验证结果**
- 通过、资料读得到 → **再查资料、派活，完整处理原来的问题**；锁着时不给降级答案。
- 本人取消、拒绝或超时 → **只结束这一次**：锁着的还锁着，已开的照样有效，不连带锁别的；不自动重试，也不换个入口重来，本人之后明确再要才重新办。缺资料的部分不换来源凑，见〔锁着的时候〕；普通工作照做。

### 只有一份状态
- 本人的资料只有一份解锁状态和截止时间，由密码中心的 SecretBroker 管；本机、图形界面、所有 AI 和已认证的电脑 MCP 共用这一份。
- MCP 连上了、文件读得到、硬盘加密了，都不等于资料已经解锁。
- 不先翻私人库、索引或摘要来判断要不要解锁，也不按关键词自动弹验证窗口；普通技术事实不因为属于本人就升级保护。
- 实例：Claude 桌面版每收到本人一条消息，Hook 就向密码中心查一次状态；20 秒内查不到，就当“未知”，这一轮不取用私人资料。

### 开多久
- 默认时长以密码中心里当前的设置为准，程序出厂的 8 小时不算当前设置；本人可以填 0.5～72 小时，可以带小数。
- 只改这一次不改默认；改了默认，也不影响已经开着的这一次。
- 电脑重启、到期或本人明确锁定，这一次就结束。
- 重开窗口、新消息、子代理、换模型、续作，都不会延长它。
- 实例：9 月 28 日读到密码中心现在的默认是 24 小时，预设 0.5、1、2、4、8、24、72 小时七档。

::screen{#rule-privacy-data-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-03",
  "section": "points",
  "title": "人话要点：锁和解锁（二）",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 卡片左上角各一个小水彩图标：“锁着的时候”配一把关着的挂锁挡在几条岔路前、“各管各的权限”配三把不同颜色的钥匙各挂一个钩、“入口”配一扇半开的小木门。三张卡排成三列、顶边对齐：左“锁着的时候”、中“各管各的权限”、右“入口”（最宽，约占 40%）。右卡里五个英文名字都用等宽小框，一个名字不折行。",
  "portrait": "竖版 9:16：本屏没有大标题；三张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样；等宽小框里的英文名字太长时可以单独占一行。",
  "links": [
   {
    "text": "约法 L18",
    "href": "/rules/charter/#L18"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/#p-cite-rules"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/#p-unrestricted"
   },
   {
    "text": "local-secret-broker",
    "href": "/skills/local-secret-broker/"
   }
  ],
  "anchors": [
   {
    "id": "p-locked",
    "text": "锁着的时候"
   },
   {
    "id": "p-separate",
    "text": "各管各的权限"
   },
   {
    "id": "p-entry",
    "text": "入口"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-03-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "three-cards",
     "width": "30%",
     "text_ref": "锁着的时候"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-03-icon-02.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "three-cards",
     "width": "30%",
     "text_ref": "各管各的权限"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data/rule-privacy-data-03-icon-03.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "three-cards",
     "width": "40%",
     "text_ref": "入口"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "monospace",
    "inline_link",
    "icon"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 卡片左上角各一个小水彩图标：“锁着的时候”配一把关着的挂锁挡在几条岔路前、“各管各的权限”配三把不同颜色的钥匙各挂一个钩、“入口”配一扇半开的小木门。三张卡排成三列、顶边对齐：左“锁着的时候”、中“各管各的权限”、右“入口”（最宽，约占 40%）。右卡里五个英文名字都用等宽小框，一个名字不折行。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角各一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。本屏无大标题；锁着的时候/各管各的权限/入口三卡横30%/30%/40%、竖同序整宽。每卡左上图标、浅绿卡头；英文标识不缩字，竖可独占一行。header_icon逐卡按原序显式文件，避免缺03时拿02冒充入口。；素材登记图标2/3，按源位置的文件号显式请求，缺图不代表可以省略图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-03-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "锁着的时候"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-03-icon-02.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "各管各的权限"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data/rule-privacy-data-03-icon-03.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "入口"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "monospace",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "inline_link",
    "icon"
   ],
   "source_layout": "竖版 9:16：本屏没有大标题；三张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样；等宽小框里的英文名字太长时可以单独占一行。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角各一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。本屏无大标题；锁着的时候/各管各的权限/入口三卡横30%/30%/40%、竖同序整宽。每卡左上图标、浅绿卡头；英文标识不缩字，竖可独占一行。header_icon逐卡按原序显式文件，避免缺03时拿02冒充入口。；素材登记图标2/3，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "source_phrase": "一把关着的挂锁挡在几条岔路前、“各管各的权限”配三把不同颜色的钥匙各挂一个钩、“入口”配一扇半开的小木门",
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
  }
 ]
}
```

### 锁着的时候
- 这是〔约法 L18〕的细则。
- 不用私人资料回答，也不换来源绕过去：目录外的文件、云盘、已登录的网站、索引和记忆、以前的聊天内容都不行。
- 不拿降级的、不完整的回答糊弄本人；需要资料就请本人验证。
- 资料需求和解锁由根会话在派活前处理。解锁后，子代理按正式入口读取共享资料期内的资料；不重新判断要不要解锁，也不自己验证。读取被拦、途中缺资料或到期时，在汇报单列“需要本人资料：……”交回；根会话先解锁后按缺口补做，不拿已记下的事实凑，见〔分工与并行施工〕。
- 本人明确要通用版本时，可以只用通用知识回答。
- 普通工程、规则维护、不私密的状态，以及必要的验证和恢复，照常做。
- 已经交给别的应用、模型或外人的明文追不回来，不假装能追回。

### 各管各的权限
- 重大动作能不能复用还有效的解锁期、GitHub 的重大动作怎么验证，统一见〔重大动作与本人验证〕。
- 资料解锁、无限制授权、Windows 锁屏和新设备恢复，各有各的状态，不能从一个推出另一个；资料解锁也代替不了新设备恢复时的本人验证。
- 本人要同时开无限制授权和资料解锁时，用〔用户授权〕里的全局接管入口，一次验证开两份，但仍分别读回各自的状态和截止时间。
- 本人在别的可信设备上自己用已经允许的副本，本机锁定不会远程收回。

### 入口
- 查状态、业务检查、锁定，分别是密码中心的 `StatusPersonalEnvironment`、`CheckPersonalDataAccess`、`LockPersonalEnvironment`，都经本机已安装的 `Invoke-SecretBroker.ps1` 调用。
- 状态未知先用 `StatusPersonalEnvironment` 重读。需要验证时，`VerifyPersonalEnvironment` 不预选因子，由本人选四选一；命令等待实际终态后再回读状态。窗口首次出现起最多等 5 分钟，外层命令至少留 360 秒；启动不算通过。已有资料期时复用原截止，取消、拒绝和超时不自动重试。
- 本人明确要解锁或续期时，用 `EnrollPersonalPrivacyWaiver`，用法见〔local-secret-broker〕技能。
- 查资料状态直接读共用的那一份，不需要对话号、消息号或对话记录；只读地查一下，不算用掉无限制授权。
- 本人说“锁定个人资料”“冻结个人资料”，就把资料锁上；“冻结项目”“冻结设计”说的是项目，不是锁资料。
- Hook、技能和电脑 MCP 只读这份状态，不另建权限记录。

::screen{#rule-privacy-data-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-04",
  "section": "points",
  "title": "人话要点：可信位置和原样保存",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 卡片左上角各一个小水彩图标：“可信位置”配一台电脑、一块硬盘和一朵小云围成一圈、“原样保存”配一本摊开的账本上一张没被涂黑的纸条、“本机安全就这几样”配一面小盾牌上挂一把小钥匙、“秘密放在哪里”配一只关着的小保险箱。四张卡排成两行两列：上行左“可信位置”、右“原样保存”；下行左“本机安全就这几样”（最长，可以比右边高）、右“秘密放在哪里”。“本机安全就这几样”卡片里提到的 ToDesk、Sunshine/Moonlight、KDE Connect、小米妙享只写字，不画品牌标志。",
  "portrait": "竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L19",
    "href": "/rules/charter/#L19"
   },
   {
    "text": "约法 L14",
    "href": "/rules/charter/#L14"
   },
   {
    "text": "local-secret-broker",
    "href": "/skills/local-secret-broker/"
   },
   {
    "text": "vault-workflow",
    "href": "/skills/vault-workflow/",
    "orientations": [
     "v"
    ],
    "locator_instances": {
     "v": {
      "input_sha256": "21f8835e488e0b3a192de5e2b691ff620dd31e7233680b32a8e39d5f370b50b7",
      "instances": [
       {
        "expected_rect": [
         200,
         4147,
         508,
         4178
        ],
        "context_rect": [
         200,
         4147,
         508,
         4178
        ],
        "lookup_text": "vault-workflow",
        "confirm_region": true,
        "context_ocr_missing": true,
        "green_code_frame_rect": [
         182,
         4134,
         526,
         4192
        ]
       }
      ]
     }
    }
   },
   {
    "text": "加密文件",
    "href": "/skills/authorization-file-broker/"
   }
  ],
  "anchors": [
   {
    "id": "p-trusted",
    "text": "人话要点 · 可信位置和原样保存"
   },
   {
    "id": "p-trusted-places",
    "text": "可信位置"
   },
   {
    "id": "p-exact",
    "text": "原样保存"
   },
   {
    "id": "p-local-security",
    "text": "本机安全就这几样"
   },
   {
    "id": "p-secrets",
    "text": "秘密放在哪里"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 可信位置和原样保存"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/privacy-trusted-position-icon.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "cards-0",
     "width": "50%",
     "text_ref": "可信位置"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "cards-0",
     "width": "50%",
     "text_ref": "原样保存"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-a49a00a56102f5cd2d4b.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "cards-1",
     "width": "50%",
     "text_ref": "本机安全就这几样"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-c5b32376bb2aca42c7fc.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "cards-1",
     "width": "50%",
     "text_ref": "秘密放在哪里"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "monospace",
    "inline_link",
    "icon"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 卡片左上角各一个小水彩图标：“可信位置”配一台电脑、一块硬盘和一朵小云围成一圈、“原样保存”配一本摊开的账本上一张没被涂黑的纸条、“本机安全就这几样”配一面小盾牌上挂一把小钥匙、“秘密放在哪里”配一只关着的小保险箱。四张卡排成两行两列：上行左“可信位置”、右“原样保存”；下行左“本机安全就这几样”（最长，可以比右边高）、右“秘密放在哪里”。“本机安全就这几样”卡片里提到的 ToDesk、Sunshine/Moonlight、KDE Connect、小米妙享只写字，不画品牌标志。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角各一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。四卡横2×2、竖一列，可信位置→原样保存→本机安全→秘密；图标在卡头左，不画ToDesk等正文品牌标志。外层卡间无连接。；素材登记图标3/4，按源位置的文件号显式请求，缺图不代表可以省略图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 可信位置和原样保存"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/privacy-trusted-position-icon.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "可信位置"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "原样保存"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-a49a00a56102f5cd2d4b.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "本机安全就这几样"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-c5b32376bb2aca42c7fc.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "秘密放在哪里"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "monospace",
    "inline_link",
    "icon"
   ],
   "source_layout": "竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角各一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。四卡横2×2、竖一列，可信位置→原样保存→本机安全→秘密；图标在卡头左，不画ToDesk等正文品牌标志。外层卡间无连接。；素材登记图标3/4，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "source_phrase": "一台电脑、一块硬盘和一朵小云围成一圈、“原样保存”配一本摊开的账本上一张没被涂黑的纸条、“本机安全就这几样”配一面小盾牌上挂一把小钥匙、“秘密放在哪里”配一只关着的小保险箱",
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
   "asset": "_library/round3/titles/title-r3-777546ef0acd4d4c12d6.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-777546ef0acd4d4c12d6",
   "title_text": "人话要点 · 可信位置和原样保存",
   "sha256": "82046e28d4686b50dfa300018295ac9bee0b1b6e7af99bb908ee9d4852888c82",
   "status": "ready",
   "source_box": [
    28,
    56,
    886,
    223
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 可信位置和原样保存

### 可信位置
- 本机、工作区、BitLocker 加密的本地硬盘和 U 盘，以及本人自己账号下默认私有的空间（例如 Google Drive、Notion、私有 GitHub、Dropbox、OneDrive），都是可信位置；不因为联网或在云上就降级。
- 账号归属不明、共享范围不明或可见性对不上时，按“不明”处理，不靠推测越过证据；确定要公开的地方，另按公开分级办。

### 原样保存
- 这是〔约法 L19〕的细则。
- 在可信位置里读、改、复制、备份、恢复或输出时，`.env`、令牌、密码、私钥、OAuth 文件按任务需要原样保留：不遮盖、不删、不截断，也不拿别的字代替。
- 手机号这类私人联系方式，在本机和私有仓库里也照原样记、不打码；只有要公开时，才按公开分级判断。
- 可信不等于可以往里写，写入授权另看。

### 本机安全就这几样
- 这是〔约法 L14〕的细则：本机安全靠 BitLocker、开机和 Windows 登录密码、密码中心，以及本人明确选用的加密技能。
- 本机当前用户、文件、进程、软件和本人的私人账号空间默认可信。
- 本人的远程访问工具（如 ToDesk、Sunshine/Moonlight、Windows 远程桌面）和跨设备同步工具（如 KDE Connect、小米妙享、手机连接）连着的设备也可信；经它们查看、串流或同步密码是正常用法。
- 不为想象中的本地攻击者加遮盖、防截屏、防同步、定时清理、身份层、审计链或安全流程。
- 误删、损坏、失败和回滚，按做得对不对、能不能恢复来处理；“安全”不能当成加流程或逃避验收的理由。
- 例外：本人明确要求的具体安全任务，或外部平台对这次动作真实提出的条件。

### 秘密放在哪里
- 密码、令牌、密钥和 SecretRef 只放在密码中心、SecretBroker 或加密技能里，不写进规则、聊天或普通配置。
- 私密内容和凭据不拿去网上搜，搜索只用去掉敏感信息的关键词。
- SecretRef 归〔local-secret-broker〕技能管；Key 仓库和 Vault 加密库（VAULT03、vault-tool）走〔vault-workflow〕技能；普通文件加解密走〔加密文件〕技能。
- 唯一能一次批量显示秘密明文的，是本机专用的 BitLocker 恢复密钥全量查看；它的结果不进模型、聊天、命令输出、JSON、剪贴板或文件。

::screen{#rule-privacy-data-05 section="points"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-05",
  "section": "points",
  "title": "人话要点：公开分级表",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 布局：左边约 35% 宽上下两张卡：上“这张表怎么用”（图标：一把尺子量一张纸）、下“L3 以下不设限”（图标：一道敞开的小栅栏门，带实例便签）。右边约 65% 宽是“五个等级”大卡，里面画成五行表格，表头“等级 / 是什么 / 公开时”三列；每行最左边的等级格画成一级小石台阶（和开头插画的五级台阶同一套颜色，L1 最浅、L5 最深），“公开时”一列的底色也随等级从很浅的绿渐到浅橙灰。表格线用浅绿细线。",
  "portrait": "竖版 9:16：标题在上；“这张表怎么用”卡片整宽；“五个等级”改成五张小卡、一级一张、一行一条，每张卡左上角是等级小台阶，卡里先写“是什么”、再写“公开时”（两行各带小标签“是什么”“公开时”，这两个标签就是表头的字）；最后“L3 以下不设限”卡片整宽。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L20",
    "href": "/rules/charter/#L20",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   }
  ],
  "anchors": [
   {
    "id": "p-classification",
    "text": "人话要点 · 公开个人数据分级表"
   },
   {
    "id": "p-how-to-grade",
    "text": "这张表怎么用"
   },
   {
    "id": "p-levels",
    "text": "五个等级"
   },
   {
    "id": "p-below-l3",
    "text": "L3 以下不设限"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 公开个人数据分级表"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-a0bd87bc3fa1f18e5282.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "这张表怎么用"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-eee93d6e0a2d49990395.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "L3 以下不设限"
    },
    {
     "type": "table",
     "text_ref": "五个等级"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "monospace",
    "inline_link",
    "table",
    "icon"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 布局：左边约 35% 宽上下两张卡：上“这张表怎么用”（图标：一把尺子量一张纸）、下“L3 以下不设限”（图标：一道敞开的小栅栏门，带实例便签）。右边约 65% 宽是“五个等级”大卡，里面画成五行表格，表头“等级 / 是什么 / 公开时”三列；每行最左边的等级格画成一级小石台阶（和开头插画的五级台阶同一套颜色，L1 最浅、L5 最深），“公开时”一列的底色也随等级从很浅的绿渐到浅橙灰。表格线用浅绿细线。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1,
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [
     {
      "start_line": 11,
      "columns": 3,
      "data_rows": 5
     }
    ],
    "illustration_position_mentions": [
     "左边的等级格画成一级小石台阶（和开头插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左35%表用法、L3以下上下两卡；右65%五级三列表格为一张大卡。五级等级格需小石台阶及层级底色；points_card内table目前普通保文表格，未调用table族逐行手机转换，需comp-text嵌套table并由table族支持等级阶梯。两左卡与右表全文节点有意按视觉列重排。；素材登记图标1/3，按源位置的文件号显式请求，缺图不代表可以省略图标。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。；独立复核：原文中的短键长值表改现役table组件按内容列宽，全部原字和顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 公开个人数据分级表"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-a0bd87bc3fa1f18e5282.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "这张表怎么用"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "五个等级"
    },
    {
     "type": "table",
     "text_ref": "等级是什么公开时L1非个人、虚构、匿名的内容，或本人已经主动公开、再公开也不加伤害的"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-eee93d6e0a2d49990395.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "L3 以下不设限"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "prose",
    "chapter_title",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "monospace",
    "inline_link",
    "table",
    "icon"
   ],
   "source_layout": "竖版 9:16：标题在上；“这张表怎么用”卡片整宽；“五个等级”改成五张小卡、一级一张、一行一条，每张卡左上角是等级小台阶，卡里先写“是什么”、再写“公开时”（两行各带小标签“是什么”“公开时”，这两个标签就是表头的字）；最后“L3 以下不设限”卡片整宽。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1,
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [
     {
      "start_line": 11,
      "columns": 3,
      "data_rows": 5
     }
    ],
    "illustration_position_mentions": [
     "左边的等级格画成一级小石台阶（和开头插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。顺序为标题→表用法→五等级五张行卡→L3以下；table已能一行一卡并完整保表头一次，但等级石阶图、卡头装饰、深浅分级底色需table族样张。五等级外卡包裹也需嵌套，不能拿五个普通白卡称完全照原图。；素材登记图标1/3，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子量一张纸",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/闸门.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "闸门",
   "source_phrase": "一道敞开的小栅栏门，带实例便签",
   "sha256": "eee93d6e0a2d4999039530b2ce668ce4beebb63c2370a8befee8c33aa87b4ae5",
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
   "asset": "_library/round3/titles/title-r3-9ea70b9708a82b4a2556.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-privacy-data-05-v\\round-01\\candidate-1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ea70b9708a82b4a2556",
   "title_text": "人话要点 · 公开个人数据分级表",
   "sha256": "225ad32cf71d95686b364eccc09505941d37a5f8df9ba39697549e3b097b63f2",
   "status": "ready",
   "source_box": [
    27,
    53,
    909,
    205
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 公开个人数据分级表

### 这张表怎么用
- 判断公开内容只用这一张分级表；只在目标已经确定公开、或正在决定公开什么时才读它。
- 别的规则、项目和 Git 流程不另建、不照抄，也不自行收紧这张表。
- 写要公开的内容时，写的 AI 和它派的子代理都读这张表的原文来判断；派活说明只指到这里，不写摘要或改写版。
- 看最终公开的整体：各项单独的等级，和合在一起实际可能造成伤害的等级，取高的那个。
- 只是能认出本人、字段变多或凭空猜测，都不算升级；想升到 L3 以上要有正面证据，没有就按 L2。

### 五个等级
| 等级 | 是什么 | 公开时 |
|---|---|---|
| L1 | 非个人、虚构、匿名的内容，或本人已经主动公开、再公开也不加伤害的普通事实 | 不受个人数据的公开限制 |
| L2 | 本人的普通资料：姓名、年龄、生日、性别、普通照片、城市、教育和工作经历、兴趣、普通公开账号、本人指定的公开联系方式；姓名、生日和履历放在一起仍是 L2 | 不设限，不能只因为是个人资料就审查、打码、删改、缩减、反复确认或保守过滤 |
| L3 | 有正面证据表明公开后可能招来诈骗、信用或名誉或关系受损、持续骚扰、精准追踪的内容，如私人联系方式、精确住址、详细个人财务、没公开的纠纷材料、可预测的行踪；别人没公开的资料至少 L3 | 可以进入敏感性判断，但不自动拦下 |
| L4 | 可能造成严重人身、财产、身份或重大隐私伤害的内容，如身份证件、银行卡或账户、生物识别、实时精确位置、完整的健康或亲密信息、原始私人聊天，以及能用的密码、令牌、私钥、OAuth 私密内容、恢复码、Cookie；秘密和凭据至少 L4 | 能用的秘密明文不得公开；其他 L4 只按上级授权和领域边界发布必要的非秘密结果 |
| L5 | 大规模多人数据、机构关键数据，或可能影响国家安全、公共利益、系统运行的重要数据；本人单条的自身数据一般不算 | 按对应的上级规则处理 |

### L3 以下不设限
- 这是〔约法 L20〕的细则：L1、L2 和没有 L3 以上正面证据的内容，在个人数据这条线上都不受限制；不要太保守，没证据时也不推定要保守。
- 任何项目都不能拿“不明”“来源是个人”“能认出本人”“谨慎起见”把它们升级。
- 发布授权、核实目标、禁止公开秘密、第三方授权、许可和外部平台的真实限制都和等级无关：不能拿等级冒充授权，也不能把这些上级限制说成项目自己定的低等级限制。
- 项目想收紧 L1、L2 的公开，要有真实的项目需要，并有本人对这个项目、这个范围的明确指示，见〔用户授权〕。
- 实例：这个网站的公开范围就按这张表和约法 L20 判断，不另立、不收紧（本人 9 月 28 日定）。

::screen{#rule-privacy-data-06 section="points"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-06",
  "section": "points",
  "title": "人话要点：私人仓库和备份",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 两张卡左右并排：左“私人仓库收口”约 42% 宽（图标：一个上了小锁的 GitHub 八爪猫标志旁边一只装满的纸箱）、右“备份跟着原件走”约 58% 宽（图标：三块硬盘 E、G、H 用细绿箭头依次连起来，H 盘旁一个挂“30 天”日历牌的小木箱，和开头插画同一只）。两张卡各自底部有实例便签。可以画 GitHub 标志。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，先“私人仓库收口”后“备份跟着原件走”，实例便签跟在各自卡片底部。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L21",
    "href": "/rules/charter/#L21",
    "locator_text": {
     "h": "【约法L21]"
    }
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/",
    "orientations": [
     "v"
    ]
   }
  ],
  "anchors": [
   {
    "id": "p-private-repo",
    "text": "私人仓库收口"
   },
   {
    "id": "p-backup",
    "text": "备份跟着原件走"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 私人仓库收口、备份跟着原件走"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-06-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "storage",
     "width": "42%",
     "text_ref": "私人仓库收口"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-06-icon-02.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "storage",
     "width": "58%",
     "text_ref": "备份跟着原件走"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "notice",
    "monospace",
    "inline_link",
    "icon"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画，没有就不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片里每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条画成卡片底部一个浅黄底的小便签（字照写），表示这是本机现在的真实例子、不是规则原文。`…` 里的名字和路径用等宽字体、浅绿底小框，反引号不画。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。 两张卡左右并排：左“私人仓库收口”约 42% 宽（图标：一个上了小锁的 GitHub 八爪猫标志旁边一只装满的纸箱）、右“备份跟着原件走”约 58% 宽（图标：三块硬盘 E、G、H 用细绿箭头依次连起来，H 盘旁一个挂“30 天”日历牌的小木箱，和开头插画同一只）。两张卡各自底部有实例便签。可以画 GitHub 标志。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。私人仓库42%、备份58%两卡横并排、竖上下，实例各自卡底嵌框；备份图标里的E/G/H/30天仅scene描述，定稿正文已有相应字，不能擅自复制到插画；若有字图需素材去字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 私人仓库收口、备份跟着原件走"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-06-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "私人仓库收口"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-privacy-data\\rule-privacy-data-06-icon-02.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "备份跟着原件走"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "notice",
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "quote",
    "monospace",
    "inline_link",
    "icon"
   ],
   "source_layout": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，先“私人仓库收口”后“备份跟着原件走”，实例便签跟在各自卡片底部。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。私人仓库42%、备份58%两卡横并排、竖上下，实例各自卡底嵌框；备份图标里的E/G/H/30天仅scene描述，定稿正文已有相应字，不能擅自复制到插画；若有字图需素材去字。"
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
   "asset": "_library/icons/上锁仓库箱.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "上锁仓库箱",
   "source_phrase": "一个上了小锁的 GitHub 八爪猫标志旁边一只装满的纸箱",
   "sha256": "129f6c7d1d5d7e246d8186598fa05e48c0c8598a47724a2fa2a50888d0914282",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-rule-privacy-data-06-header-icon-0-bf8eed6c.png",
   "fallback": false,
   "semantic_status": "independent_actual_indeterminate",
   "key": "外接硬盘",
   "source_phrase": "三块硬盘 E、G、H 用细绿箭头依次连起来，H 盘旁一个挂“30 天”日历牌的小木箱",
   "sha256": "ef3fa480458ad0f0b5a321ddb5e01cfb5254d857fe22f80401ddccbcdac9e28b",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-264e15c95b9cbdb79092.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-06-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-264e15c95b9cbdb79092",
   "title_text": "人话要点 · 私人仓库收口、备份跟着原件走",
   "sha256": "101a420a04ecd7be52b963f3ca0a9ded1b076f1e8e58f25a16232285191f3a96",
   "status": "ready",
   "source_box": [
    26,
    11,
    1307,
    159
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 私人仓库收口、备份跟着原件走

### 私人仓库收口
- GitHub 总索引确认是私有、又有写入授权的仓库，远端默认分支要完整同步该入库的内容；不因为私密就打码，也不悄悄漏传。
- 可以不入库的只有五类：明文秘密或 SecretRef；能重建的缓存和生成物；活数据库和频繁变动的大文件；受格式、加密或许可限制的内容；本人说只留本地的内容。不入库要说明原因。
- 不完整的副本不能叫完整备份，也不等于整盘镜像。
- 公开仓库里的私密东西，挪到对应的私人配套仓库。
- 实例：GitHub 总索引给公开项目登记的私人配套仓库是私有的 `public-project-private-backup`（9 月 28 日查“中文语音转写”的登记）。

### 备份跟着原件走
- 这是〔约法 L21〕的细则：G 盘受管备份跟着各自登记的来源，H 盘受管备份跟着 G 盘；新增、修改、删除都同步，不再“只加不删”。
- 照片、视频、音乐、个人资料，以及 G 盘上只有一份原件的项目和软件文件夹（`G:\20_Projects`、`G:\70_Software`），删掉后在备份里留 30 天后悔期；具体范围以〔电脑配置与恢复〕（PCConfig）的登记为准。
- 备份里还有、原件里已经没有的，不往回拷到原件。
- 在已授权同步的范围内，盘和源目录都正常可读、又没有已知的挪位原因时，源里消失的东西按本人删了处理，不逐件追问。
- 盘没接上、被锁、读取失败或备份不完整，都不算“源是空的”：先完整读到该保留的内容，新增和修改复制核验后，才清理备份里的旧副本；失败时留在能恢复的状态。
- PCConfig 管机器对应关系、计划任务配置和恢复路线；各来源项目自己决定该保留什么。
- 只按登记的范围同步：不盲目镜像整盘，不误删独立的原件，不新增后台服务。
- 实例：有后悔期的文件删掉后先挪进待删区：照片、视频、音乐、个人资料在 G、H 盘各有一个（`G:\80_Backup\_quarantine`、`H:\80_自动备份区\_quarantine`），G 盘的项目和软件文件夹在 G 上没有待删区、只有 H 上那份进 H 的待删区；满 30 天由下一次备份整批清掉，其他受管备份跟着直接删。9 月 28 日 17:11 跑完的每日热备之后，G 盘待删区里还留着 132 个文件、约 27.7 GB。

::screen{#rule-privacy-data-07 section="original"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-07",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.privacy-data.md",
   "release": "E259",
   "sha256": "5ae76cc061bae9b3fcc92b5fe0c446f978ac4d5db68d286684841fa3986e37db",
   "public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
   "from": null,
   "to": "- **入口。**",
   "start": 0,
   "end": 1622,
   "approved_omissions": []
  },
  "title": "原文（一）：开头和个人资料的锁和解锁",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 个人资料与数据处理”到“怎么解锁”那条结束；右卡放“时长”“取消只结束这一次”“锁着的时候”“各管各的权限”四条。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/#重大的事"
   },
   {
    "text": "用户授权的全局接管入口",
    "href": "/rules/authorization/#无限制授权"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-privacy-data/rule-privacy-data-07",
  "source_logical_id": "privacy_data_contract",
  "source_public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
  "source_rule_part": "rule-privacy-data/rule-privacy-data-07"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版，一字不改"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "个人资料与数据处理"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E221 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 个人资料与数据处理”到“怎么解锁”那条结束；右卡放“时长”“取消只结束这一次”“锁着的时候”“各管各的权限”四条。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。横版要求两大卡连续排原文；07在单一bullets中的“怎么解锁”之后换右卡，08在另一单一bullets的“可信位置”之后换右卡。当前text_ref不能在bullets内部拆分，whole_block只生成一外卡；columns=2是目标列数，待main增加原节点条目范围切片再交comp-text，不得用重复同节点造两卡。；page-fixer-07：原文单卡占满全宽。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版，一字不改"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "个人资料与数据处理"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。竖版整篇同一张整宽外卡，内表格应逐行小卡；source_text_card内table当前普通表格，09须comp-text转交table族，不能缩字号。"
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
   "asset": "rule-privacy-data/rule-privacy-data-07-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-114b2984bb76abfd8650",
   "title_text": "个人资料与数据处理",
   "sha256": "c7d72b54a10917d976de904e7d05d27972b024b4599a991ef97c59254b0f84ca",
   "status": "ready",
   "source_box": [
    37,
    50,
    803,
    184
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
   "asset": "rule-privacy-data/rule-privacy-data-07-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-86814cb01f9c94f989bc",
   "title_text": "个人资料的锁和解锁",
   "sha256": "966c035d590733ce9f813c23c5a3fbe419f536e35e42d23b33bcfc13b1032e97",
   "status": "ready",
   "source_box": [
    53,
    390,
    424,
    451
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E259 版，一字不改

# 个人资料与数据处理

owner: `E:\.agents`

这里说清什么时候能用本人的私人资料、资料锁着时怎么办、哪些位置可信、公开内容怎么分级、私人仓库怎么收口，以及备份怎么跟着原件走。用私人资料不等于要做隐私盘点；公开分级不等于可以发布；普通的业务和技术事实不因为属于本人就升级保护。

## 个人资料的锁和解锁

- **只有一份状态。** 本人资料只有一份解锁状态和截止时间，由 PasswordCenter 的 SecretBroker 管理；本机、图形界面、所有 AI 和已认证的电脑 MCP 共用它。每条真实的新消息开始时，从 Hook（Codex、Claude）或 `ComputerContext`（电脑 MCP）读当前状态；状态缺失、过期或不明时，不取用私人资料，需要资料时按下面的解锁顺序办理。MCP 连上了、文件能读或磁盘加密了，都不等于资料已解锁。
- **什么时候需要解锁。** 问的是本人自己的情况（身体、心理、生活、学习求职、感情等），就算需要；回答要用到本人的偏好、履历、通信、健康、财务、私人关系或以前的个人经历时也需要。拿不准按需要处理。不依赖本人情况的通用讲解、代码、天气和项目实施、PCConfig 配置、性能排查、规则维护照常做，不需要。不先读私人库、索引或摘要来判断要不要解锁，也不按关键词自动弹验证窗口；普通技术事实不因为属于本人就升级保护。
- **怎么解锁。** 判断资料需求和发起解锁只由根会话做；根会话在派活前判断，需要就先解锁再派。解锁是第一步，先于检索、派子代理和作答：需要资料就直接走现有解锁入口，请本人验证一次（本机四选一，手机用现有验证器），不先派别的模型批准，也不验证两次。验证真正通过、资料能读之后，再查资料、派活并完整处理原来的问题；锁着时不给降级回答。
- **时长。** 当前默认时长读密码中心的 `duration_policy.default_minutes`，不把程序出厂的 8 小时当成当前设置；本人可填 0.5～72 小时，可以有小数。改这一次不改默认；改默认不影响已开的这一次。电脑重启、到期或本人明确锁定，这一次就结束；重开窗口、新消息、子代理、换模型和续作都不延长它。
- **取消只结束这一次。** 本人取消、拒绝或超时，只结束这一次验证：锁着的还锁着，已开的照样有效；不连带锁别的，也不自动重试或换个入口重来。本人之后明确再要，才重新办。
- **锁着的时候**（约法 L18）：不用私人资料回答，也不换来源绕过去（目录外的文件、云盘、已登录的网站、索引和记忆、以前的聊天内容都不行）；不拿降级的、不完整的回答糊弄本人，需要资料就请本人验证。资料期全机共用，解锁后派出的子代理直接按正式取用入口读资料；子代理不重新判断要不要解锁，也不发起验证。只在读取被拦、执行中才发现缺资料或资料期到期时，它在汇报单列“需要本人资料：<缺什么、为什么>”交回，由根会话按缺口先解锁后重派或补做，不让它用已记下的事实凑（见[分工与并行施工](/rules/execution-coordination/)）。本人明确要通用版本时，可以只用通用知识回答。普通工程、规则维护、非私密状态和必要的验证与恢复照常。已经交给别的应用、模型或外人的明文追不回来，不假装能追回。
- **各管各的权限。** 重大动作复用资料期和 GitHub 的专门验证要求统一见[重大动作与本人验证](/rules/protected-actions/#重大的事)。资料解锁、无限制授权、Windows 锁屏和新设备恢复各有自己的状态，不相互推定；资料解锁不替代新设备恢复的本人验证。要同时建立两份授权时用[用户授权的全局接管入口](/rules/authorization/#无限制授权)，仍分别回读状态和截止。本人在其他可信设备上自己使用已经允许的副本，不会被本机锁定远程撤回。

::screen{#rule-privacy-data-08 section="original"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-08",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.privacy-data.md",
   "release": "E259",
   "sha256": "5ae76cc061bae9b3fcc92b5fe0c446f978ac4d5db68d286684841fa3986e37db",
   "public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
   "from": "- **入口。**",
   "to": "## 公开个人数据分级表",
   "start": 1622,
   "end": 3202,
   "approved_omissions": []
  },
  "title": "原文（二）：入口、可信位置和原样保存",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“入口”那一条和“## 可信位置和原样保存”下的“可信位置”一条；右卡放“原样保存”“本机安全就这几样”“秘密放哪里”三条。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-privacy-data/rule-privacy-data-08",
  "source_logical_id": "privacy_data_contract",
  "source_public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
  "source_rule_part": "rule-privacy-data/rule-privacy-data-08"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "入口。查状态、业务检查和锁定分别是密码中心的StatusPersonalEnviro"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“入口”那一条和“## 可信位置和原样保存”下的“可信位置”一条；右卡放“原样保存”“本机安全就这几样”“秘密放哪里”三条。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。横版要求两大卡连续排原文；07在单一bullets中的“怎么解锁”之后换右卡，08在另一单一bullets的“可信位置”之后换右卡。当前text_ref不能在bullets内部拆分，whole_block只生成一外卡；columns=2是目标列数，待main增加原节点条目范围切片再交comp-text，不得用重复同节点造两卡。；page-fixer-07：原文单卡占满全宽。；续屏版本标签明确 E214，标签不属于规则正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "入口。查状态、业务检查和锁定分别是密码中心的StatusPersonalEnviro"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。竖版整篇同一张整宽外卡，内表格应逐行小卡；source_text_card内table当前普通表格，09须comp-text转交table族，不能缩字号。；续屏版本标签明确 E214，标签不属于规则正文。"
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
   "asset": "rule-privacy-data/rule-privacy-data-08-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-eedd8f221b5ce38d13c7",
   "title_text": "可信位置和原样保存",
   "sha256": "502d90226c8c9af5625cdfd1324d88174c8109f04a30d1a1694326c3841e00c5",
   "status": "ready",
   "source_box": [
    55,
    510,
    424,
    582
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E259 版 · 续

- **入口。** 查状态、业务检查和锁定分别是密码中心的 `StatusPersonalEnvironment`、`CheckPersonalDataAccess`、`LockPersonalEnvironment`，经已安装的 `C:\ProgramData\PCConfig\AuthorityHost\tools\Invoke-SecretBroker.ps1` 调用。状态未知时先用 `StatusPersonalEnvironment` 重读。`VerifyPersonalEnvironment` 在已有资料期内复用原截止；需要验证时不传 `-AuthorityFactor`，由本人选四选一验证。命令同步等验证终态，窗口首次可见起最长等 5 分钟；模型用宿主后台命令运行，外层超时至少 360 秒，等终态后回读状态，不能把命令启动当验证成功。取消、拒绝和超时按上面的取消规则处理。本人明确要解锁或续期时用 `EnrollPersonalPrivacyWaiver`，用法见 `local-secret-broker` 技能。资料检查直接读共享状态，不需要对话号、消息号或宿主对话记录；只读检查也不消费无限制授权。本人说“锁定个人资料”“冻结个人资料”就走锁定；“冻结项目”“冻结设计”不是资料操作。Hook、技能和电脑 MCP 只读这份状态，不另建权限记录。

## 可信位置和原样保存

- **可信位置。** 本机、工作区、BitLocker 保护的本地硬盘和 U 盘，以及本人自己账号下默认私有的空间（例如 Google Drive、Notion、私有 GitHub、Dropbox、OneDrive）都是可信位置，不因为联网或在云上就降级。账号归属不明、共享范围不明或可见性有冲突时，按“不明”处理，不靠推定越过证据；确定公开的目标另按公开分级办。
- **原样保存**（约法 L19）：在可信位置里读取、编辑、复制、备份、恢复或输出时，`.env`、令牌、密码、私钥、OAuth 文件按任务需要原样保留，不遮盖、删除、截断或换成占位符。手机号这类私人联系方式在本机和私有仓库里也照原样记，不打码；只有要公开时才按公开分级判断。可信不等于可以写入，写入授权另看。
- **本机安全就这几样**（约法 L14）：BitLocker、开机和 Windows 登录密码、密码中心（SecretBroker）和本人明确选用的加密技能。本机当前用户、文件、进程、软件和私人账号空间默认可信；本人的远程访问工具（如 ToDesk、Sunshine/Moonlight、Windows 远程桌面）和跨设备同步工具（如 KDE Connect、小米妙享、手机连接）连着的设备也可信，经它们查看、串流或同步密码是正常用法。不为想象中的本地攻击者加遮盖、防截屏、防同步、定时清理、身份层、审计链或安全流程；误删、损坏、失败和回滚按正确性和可恢复性处理，“安全”不是加流程或逃避验收的理由。本人明确要求的具体安全任务，或外部平台对这次动作真实提出的条件除外。
- **秘密放哪里。** 密码、令牌、密钥和 SecretRef 只放在密码中心、SecretBroker 或加密技能里，不写进规则、聊天或普通配置。私密内容和凭据不上网搜索，只用脱敏的关键词。`local-secret-broker` 管 SecretRef；`wlyaaaaa/Key` 仓库和 Vault（VAULT03、vault-tool）走 `vault-workflow`，普通文件加解密走 `authorization-file-broker`。BitLocker 恢复密钥的专用本机全量查看，是批量显示秘密明文的唯一例外；结果不进模型、聊天、标准输出、JSON、剪贴板或文件。

::screen{#rule-privacy-data-09 section="original"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-09",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.privacy-data.md",
   "release": "E259",
   "sha256": "5ae76cc061bae9b3fcc92b5fe0c446f978ac4d5db68d286684841fa3986e37db",
   "public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
   "from": "## 公开个人数据分级表",
   "to": "## 私人仓库收口",
   "start": 3202,
   "end": 4397,
   "approved_omissions": []
  },
  "title": "原文（三）：公开个人数据分级表",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。这屏不分两卡：上面一张整宽卡片放“## 公开个人数据分级表”和它下面的那段话；中间是原文表格，画成三列表格（表头“等级 / 含义和典型内容 / 公开时默认”，“|---|”那一行是 Markdown 的表格分隔线，画成表头下的一条细线、不画成字），每行最左格等级字加粗；下面一张整宽卡片放“`below_l3_publication_default`”开头那一段。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；表格改成一行一张小卡：每张卡先写等级，再写“含义和典型内容”和“公开时默认”两段（这两个小标签就是表头的字）。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-privacy-data/rule-privacy-data-09",
  "source_logical_id": "privacy_data_contract",
  "source_public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
  "source_rule_part": "rule-privacy-data/rule-privacy-data-09"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "公开个人数据分级表"
    },
    {
     "type": "table",
     "text_ref": "公开等级含义和典型内容公开时默认",
     "source_prose": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "below_l3_publication_default：L1、L2以及没有L3以上"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "inline_link",
    "monospace",
    "table"
   ],
   "source_layout": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。这屏不分两卡：上面一张整宽卡片放“## 公开个人数据分级表”和它下面的那段话；中间是原文表格，画成三列表格（表头“等级 / 含义和典型内容 / 公开时默认”，“|---|”那一行是 Markdown 的表格分隔线，画成表头下的一条细线、不画成字），每行最左格等级字加粗；下面一张整宽卡片放“`below_l3_publication_default`”开头那一段。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [
     {
      "start_line": 7,
      "columns": 3,
      "data_rows": 5
     }
    ],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。横版上段整宽原文卡→三列表格五行→below_l3整宽原文卡。；续屏版本标签明确 E214，标签不属于规则正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "公开个人数据分级表"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "table",
    "prose",
    "section_heading",
    "source_text_card",
    "inline_link",
    "monospace"
   ],
   "source_layout": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；表格改成一行一张小卡：每张卡先写等级，再写“含义和典型内容”和“公开时默认”两段（这两个小标签就是表头的字）。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     3
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [
     {
      "start_line": 7,
      "columns": 3,
      "data_rows": 5
     }
    ],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。竖版整篇同一张整宽外卡，内表格应逐行小卡；source_text_card内table当前普通表格，09须comp-text转交table族，不能缩字号。；续屏版本标签明确 E214，标签不属于规则正文。"
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
   "asset": "rule-privacy-data/rule-privacy-data-09-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-09-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a316a5ebdecd321a3fbf",
   "title_text": "公开个人数据分级表",
   "sha256": "797b84ed506e1c68681eced60c4352858c47f567af60c88d275077fb086e81f0",
   "status": "ready",
   "source_box": [
    54,
    61,
    415,
    113
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E259 版 · 续

## 公开个人数据分级表

`public_personal_data_classification` 是判断公开内容的唯一分级表，下面的“公开 L1～L5”是内容等级，与约法 L1～L30 的条号不同。只在目标已经确定公开、或正在决定公开什么时读；其他规则、项目和 Git 流程不另建、不复制、也不自行收紧这张表。写要公开的内容时，写的 AI 和它派的子代理都读这里的原文判断；派活说明只指到这里，不写摘要或改写版。分级看最终公开的整体内容：取各字段等级和组合后现实伤害等级中较高的那个。只是能认出本人、字段变多或抽象的猜测都不算升级；想升到公开 L3 以上，要有正面证据，否则按公开 L2。

| 公开等级 | 含义和典型内容 | 公开时默认 |
|---|---|---|
| L1 | 非个人、虚构、匿名，或本人已经主动公开、再公开一次也不增加伤害的普通事实。 | 不受个人数据公开限制。 |
| L2 | 本人的普通资料：姓名、年龄、生日、性别、普通照片、城市、教育和工作经历、兴趣、普通公开账号或本人指定的公开联系方式。姓名、生日和普通履历放在一起仍是 L2。 | 不设限：不能只因为是个人资料就审查、脱敏、删改、缩减、反复确认或保守过滤。 |
| L3 | 有正面证据表明公开后可能造成诈骗、信用或名誉或关系损害、持续骚扰或精准追踪的内容，如私人联系方式、精确住址、详细个人财务、没公开的纠纷材料、可预测的行踪。别人没公开的资料至少 L3。 | 可以进入敏感性判断，但不自动拦下。 |
| L4 | 可能造成严重人身、财产、身份或重大隐私伤害的内容，如身份证件、银行卡或账户、生物识别、实时精确位置、完整的健康或亲密信息、原始私人聊天、能用的密码、令牌、私钥、OAuth 私密内容、恢复码、Cookie。秘密和凭据至少 L4。 | 能用的秘密明文不得公开；其他 L4 只按上级授权和领域边界发布必要的非秘密结果。 |
| L5 | 大规模多人数据、机构关键数据，或可能影响国家安全、公共利益、系统运行的重要数据。本人单条自身数据一般不适用。 | 按对应的上级规则处理。 |

`below_l3_publication_default`：L1、L2 以及没有 L3 以上正面证据的内容，在个人数据这条线上都不受限制（约法 L20）；不要太保守，也不在没有证据时推定要保守，任何项目都不能用“不明”“来源是个人”“能认出本人”或“谨慎起见”把它们升级。发布授权、目标核实、秘密禁止、第三方授权、许可和外部平台的真实限制与等级无关，不能用等级伪造授权，也不能把这些上级限制说成项目自设的低等级限制。`project_publication_restriction_authority`：项目收紧 L1/L2 的条件见[用户授权](/rules/authorization/)。

::screen{#rule-privacy-data-10 section="original"}

```typeset
{
 "screen": {
  "id": "rule-privacy-data-10",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.privacy-data.md",
   "release": "E259",
   "sha256": "5ae76cc061bae9b3fcc92b5fe0c446f978ac4d5db68d286684841fa3986e37db",
   "public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
   "from": "## 私人仓库收口",
   "to": null,
   "start": 4397,
   "end": 5049,
   "approved_omissions": []
  },
  "title": "原文（四）：私人仓库收口、备份跟着原件走",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 私人仓库收口”和它下面两段；右卡放“## 备份跟着原件走”和它下面那一大段。字少，行距和卡片留白放宽，卡片下方画一条水彩叶子装饰带。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-privacy-data/rule-privacy-data-10",
  "source_logical_id": "privacy_data_contract",
  "source_public_sha256": "0703c6df83175b150417115b761d9874963802679c331d4c7e58f114a01ae9b5",
  "source_rule_part": "rule-privacy-data/rule-privacy-data-10"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "row": "original",
     "width": "50%",
     "text_ref": "私人仓库收口"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "row": "original",
     "width": "50%",
     "text_ref": "备份跟着原件走"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排（另有说明的照说明）。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的是列表，画小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和英文标识用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 私人仓库收口”和它下面两段；右卡放“## 备份跟着原件走”和它下面那一大段。字少，行距和卡片留白放宽，卡片下方画一条水彩叶子装饰带。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。横版仓库/备份两等宽卡，下方叶子装饰带须补资产并由包装层放置；inventory插画预算0不抹掉scene要求。；续屏版本标签明确 E214，标签不属于规则正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E259版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "私人仓库收口"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\page.json",
   "source_sha256": "434bb605f668cd0372a9565435d16e97f81bf3d74e32cd1682652efa3c0bfe48",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，普通深绿小节标题，不用毛笔大标题、图标或连线。竖版整篇同一张整宽外卡，内表格应逐行小卡；source_text_card内table当前普通表格，09须comp-text转交table族，不能缩字号。；续屏版本标签明确 E214，标签不属于规则正文。"
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
   "asset": "rule-privacy-data/rule-privacy-data-10-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-10-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0fbbdff035ced24e62d6",
   "title_text": "私人仓库收口",
   "sha256": "2739efc4fc2d12999ffecb4cdfe3efd33b7d771cb7f6d326e429af2ffeae5638",
   "status": "ready",
   "source_box": [
    71,
    114,
    508,
    262
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
   "asset": "rule-privacy-data/rule-privacy-data-10-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-privacy-data\\img\\rule-privacy-data-10-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a6cd4d09c37c002e5c0a",
   "title_text": "备份跟着原件走",
   "sha256": "8625eebae9f1f1a0a6088c7bb4efa572b12891c3515cd887b639e5ae81d16012",
   "status": "ready",
   "source_box": [
    776,
    115,
    1249,
    258
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E259 版 · 续

## 私人仓库收口

GitHub 总索引确认是私有、并且有写入授权的仓库，远端默认分支要完整同步应当入库的内容，不因为私密就脱敏或悄悄漏传。只有明文秘密或 SecretRef、能重建的缓存和生成物、活数据库和高频大文件、格式或加密或许可限制，以及本人说只留本地的内容可以不入库，并说明原因；不完整的副本不能叫完整备份，也不等于整盘镜像。

公开仓库里的私密东西挪到对应的私人配套仓库。

## 备份跟着原件走

`backup_source_follow_deletion`（约法 L21）：G 盘受管备份跟随各自登记的上游，H 盘受管备份跟随 G 盘，新增、修改、删除都同步，不再“只加不删”。照片、视频、音乐、个人资料，以及 G 盘上只有一份原件的项目和软件文件夹（`G:\20_Projects`、`G:\70_Software`）删掉后，在备份里留 30 天后悔期；具体范围以 PCConfig 的登记为准。下游备份里的东西不会自动复活到上游：备份里还有、原件里已经没有的，不往回拷。已授权同步的范围内，卷和源根正常可读、又没有已知的挪位解释时，源里消失的东西按本人删除处理，不逐件追问。卷没接上、被锁、读取失败或备份不完整，都不是“源为空”；先完整读到当前应保留的内容，新增和修改复制核验后才清理目标里的旧副本，失败时保留可恢复的状态。PCConfig 管机器映射、计划任务配置和恢复路线，各上游项目决定自己应保留什么。只按登记的边界同步，不盲目镜像整盘，不误删独立的原件，不新增后台服务。
