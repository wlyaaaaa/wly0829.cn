---
{
 "title": "重大动作与本人验证",
 "kind": "rule-topic",
 "url": "/rules/protected-actions/",
 "tagline": "哪些事算重大，动手前怎么把关、怎么请本人验证。",
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
  "page": "rule-protected-actions",
  "kind": "rule-topic",
  "title": "重大动作与本人验证",
  "url": "/rules/protected-actions/",
  "tagline": "哪些事算重大，动手前怎么把关、怎么请本人验证。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E331",
   "commit": "985a1c35a97768f86014870625702364d994b55d",
   "ruleset_sha256": "ff01e695160a44b27a8164efa5a0d2b1fb53f733d0ba2a8c6a1b7da86b411103",
   "activated_at": "2026-10-31T07:37:25.088872+08:00",
   "file": "sources/rules/docs/contracts/agents.protected-actions.md",
   "sha256": "03675781035e4fd1942f4f45b9f7a8c910c94421cd21e9a414e0fa1198046f73",
   "public_sha256": "941bf9f832b34c8aaf2a4088613a950112b7d8dd5f9466ade6d5b706d42939f3"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：推小推车的小 AI 助手走到白绿木栏杆前停下；岗亭里戴眼镜的小 AI 助手抬头看一眼单子、点点头；桌上四选一托盘里的黄铜钥匙轻轻亮一下，手机屏幕上的六个圆点依次亮起又熄灭；木栏杆缓缓抬起一半又落回原位；远处 GitHub 小木屋的烟囱冒出一缕淡绿的烟；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，小牌子和纸条上的字保持不动、不变形，手机屏幕上不出现数字。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E259（网页来源快照，北京时间 10 月 12 日 05:01 起生效）",
     "meaning": "本页原文采用的网站来源快照；AI 实际开工以活动规则入口核验结果为准",
     "as_of": "2026-10-12",
     "source": "sources/rules/current-rules.json 与 release.json：网页来源快照 release_id=E259，activated_at_utc=2026-10-11T21:01:29.2652522+00:00；2026-10-12 19:12（北京时间）正式 Inspect：pass/e_rules_active_verified，活动 release_id=E268；protected_actions_contract 作者 sha256=5928788380abde6b5ffb7111367e8b57c8c7b6a9545123e3e18713c9deb75caa，与本页 E259 作者源一致；公开源 sha256=29781dbb14f188cfc5763e5d6c76b49d595a2c52aed80af98f17fbfcc9d1fdb1，公开字节也一致",
     "screens": [
      "rule-protected-actions-07"
     ]
    },
    {
     "id": "n-takeover-hours",
     "text": "0.5–72 小时，默认时长照密码中心当前设置",
     "meaning": "无限制授权可以开多久（本人在窗口里填）",
     "as_of": "2026-10-01",
     "source": "E203 docs\\contracts\\agents.authorization.md 第 38 行；同版 agents.privacy-data.md“个人资料的锁和解锁”时长条目",
     "screens": [
      "rule-protected-actions-01"
     ]
    },
    {
     "id": "n-major-kinds",
     "text": "七类",
     "meaning": "约法 L17 和本专题列出的“重大的事”种类数",
     "as_of": "2026-09-28",
     "source": "E187 原文第 11–17 行；E187 AGENTS.md 第 40 行 L17",
     "screens": [
      "rule-protected-actions-01",
      "rule-protected-actions-02"
     ]
    },
    {
     "id": "n-github-verify",
     "text": "要本人验证的四种动作；入口一共能做 10 种 Git 和 GitHub 动作",
     "meaning": "GitHub 动作里要本人验证的情形数，和执行入口支持的动作总数",
     "as_of": "2026-09-28",
     "source": "E187 原文第 35 行；E:\\GitHub总索引\\tools\\Invoke-ProtectedGitHubMajorAction.ps1 第 4–6 行 ValidateSet（10 个 Operation）、第 344–358 行 Get-GitHubAuthorizationRequirement（只有 delete-repository、transfer-repository、set-visibility 改 PUBLIC、create-repository 建 PUBLIC 要验证）；仓库提交 56ceea70",
     "screens": [
      "rule-protected-actions-04",
      "rule-protected-actions-05"
     ]
    },
    {
     "id": "n-factors",
     "text": "四种",
     "meaning": "本人验证方式的种数：通行密钥、手机验证码、恢复码、Google 或微软账号",
     "as_of": "2026-09-28",
     "source": "E187 原文第 43 行；E:\\Projects\\Tools\\PasswordCenter\\docs\\contracts\\pcconfig.secret-broker.md 第 49 行",
     "screens": [
      "rule-protected-actions-01",
      "rule-protected-actions-06"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Codex、Claude 和它们派出的子代理每次开工都从活动版本读它。",
     "source": "Invoke-EAgentRulesRelease.ps1 返回的 required_rule_paths.protected_actions_contract；rules-catalog.json 的 agents.protected-actions 条目"
    },
    {
     "id": "r-verify-password-center",
     "with": "password-center",
     "direction": "调用",
     "flow": "要本人验证时（例如没开无限制授权时的 GitHub 删库），调用方调密码中心的 Invoke-SecretBroker.ps1 -Action VerifyAuthority，带上动作和目标的说明；密码中心弹四选一窗口，回执给 highest_authority_verified（权限核验过没有）和 human_factor_performed（这次是不是本人真做了验证）。",
     "source": "E187 原文第 39 行；GitHub总索引 tools\\Invoke-ProtectedGitHubMajorAction.ps1 第 149–165、840–857 行；PasswordCenter docs\\contracts\\pcconfig.secret-broker.md 第 68、74 行"
    },
    {
     "id": "r-takeover-check",
     "with": "password-center",
     "direction": "查询",
     "flow": "GitHub 重大动作执行前先调 C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-OwnerTakeover.ps1 -Operation Check，看有没有有效的无限制授权（状态 active、类型 unrestricted、本人验证过、没过期）；有就不弹验证，执行前再核一次没过期。",
     "source": "Invoke-ProtectedGitHubMajorAction.ps1 第 103–147、840–866 行；GitHub总索引 docs\\contracts\\git.protected-major-actions.md 第 50 行"
    },
    {
     "id": "r-github-executor",
     "with": "github-local-index",
     "direction": "被执行",
     "flow": "GitHub 删库、转移、改公开、新建公开仓库和各种普通收尾，都由 GitHub 项目总索引的 Invoke-ProtectedGitHubMajorAction.ps1 执行：先核对仓库身份和前提、删库转移前拉全分支标签并列出网页独有内容、需要时请本人验证、执行后读回确认。",
     "source": "E:\\GitHub总索引\\docs\\contracts\\git.protected-major-actions.md 全文；E187 原文第 39 行“执行入口归 GitHub 总索引”"
    },
    {
     "id": "r-skill-local-secret-broker",
     "with": "skill-local-secret-broker",
     "direction": "指向",
     "flow": "原文第 52 行：请本人验证、锁定资料等具体操作走 local-secret-broker 技能的现行入口；技能 references\\authority-and-trust.md 第 147–165 行写了 VerifyAuthority 的调用和 GitHub 重大动作的分工。",
     "source": "E187 原文第 52 行；E:\\.agents\\skills\\local-secret-broker\\references\\authority-and-trust.md 第 147–165 行"
    },
    {
     "id": "r-gatekeeper-subagent",
     "with": "agents",
     "direction": "落地",
     "flow": "把关的最低档在两家各有落地：Claude 的 opus-medium 子代理定义写明“重大动作前把关的最低合格档”；模型清单 owner_decisions 里写“Claude 用 Opus 5.5 的 medium 以上；Codex 用 GPT-6 Sol 或 Astra 的 High 以上”。",
     "source": "C:\\Users\\10979\\.claude\\agents\\opus-medium.md 第 3 行；E:\\.agents\\config\\model-roster.json 第 131 行；E187 agents.claude-adapter.md 第 33 行、agents.codex-adapter.md 第 23 行"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-protected-actions-01",
     "text": "L16 限时的“无限制授权”"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "rule-protected-actions-01",
     "text": "L17 重大的事"
    },
    {
     "target": "/computer-access/",
     "screen": "rule-protected-actions-01",
     "text": "现在的授权状态 → 授权与状态"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "rule-protected-actions-02",
     "text": "L17"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-protected-actions-02",
     "text": "约法 L16"
    },
    {
     "target": "/rules/authorization/#p-trusted",
     "screen": "rule-protected-actions-02",
     "text": "用户授权"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "rule-protected-actions-02",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/projects/password-center/#f-retired-disklock",
     "screen": "rule-protected-actions-02",
     "text": "起疑就锁盘"
    },
    {
     "target": "/rules/charter/#L22",
     "screen": "rule-protected-actions-03",
     "text": "约法 L22"
    },
    {
     "target": "/rules/execution-coordination/#p-review",
     "screen": "rule-protected-actions-03",
     "text": "分工与并行施工"
    },
    {
     "target": "/projects/password-center/#f-four-factors",
     "screen": "rule-protected-actions-06",
     "text": "密码中心的四选一验证"
    },
    {
     "target": "/skills/local-secret-broker/",
     "screen": "rule-protected-actions-06",
     "text": "local-secret-broker"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-protected-actions-07",
     "text": "用户授权"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "rule-protected-actions-07",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-protected-actions-07",
     "text": "分工与并行施工"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-protected-actions-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "rule-protected-actions-05",
     "text": "改项目前先核对"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "原文里的三处 Markdown 链接（第 24 行 [用户授权](agents.authorization.md)、第 25 行 [个人资料与数据处理](agents.privacy-data.md)、第 31 行 [分工与并行施工](agents.execution-coordination.md)）画成〔〕链接，看得见的字一字没改，改链到对应专题页。按派活方的决定，这算一字不改。",
    "sha256:81b2fa7cc105a3f0dd0154f0fcd534acfd4ee41394f813a88610a71adefe7877",
    "替本人转述的两处（不是第一人称，但属于“本人原话翻成人话”，上线前请本人过目）：第 2 屏“本人 9 月 26 日答复：不能莫名其妙锁屏，个人资料解锁期内发邮件本来很正常”（原话见 owner-decisions.md 第 102 行 E2 的本人说明，第 124 行 F1）；第 4 屏“本人 9 月 27 日说，把删分支、合进主线也当成要验证的动作太严了，让 AI 找个最优解”（原话见第 457–463 行；随后的“落实含义”写明是 Claude 按本人授权定的最优解、本人未否决前照此执行，第 465 行）。",
    "第 2 屏“起疑”一段的细节：“停手、请本人验证，还一度要锁屏、锁整块硬盘”依据 owner-decisions.md 第 14 行 A1（起疑时锁整盘，本人选了降级为停止取用加本人验证）和第 56 行 P1–P7（所有 AI 一起停、每次锁屏……）；这些是当时的候选设计和讨论，不一定都实现过。密码中心项目页把“起疑就锁盘”列为已停用功能（锚点 f-retired-disklock），所以用“一度要”的说法。",
    "第 3 屏“打个比方：要删一个旧仓库……”是我举的说明性例子，不是原文，也不是真实发生过的事；用来分清把关和独立复核。若嫌多余可删。",
    "第 5 屏“普通清理核对不过时，不会自动改走销毁这条路”是对原文“不作为普通清理的自动回退”的理解：依据 GitHub总索引 git.protected-major-actions.md 第 18 行“保全检查失败就停下并说明原因，不转为本人验证，也不自动丢弃唯一数据”。",
    "第 5 屏两条是原文之外的实例：“执行入口具体这样做（拉全分支标签、另存保留点、列 issue/PR/Release/发布包，Wiki 等只列入口，不备份网页内容）”和“验证完重新读一遍仓库现状”“入口一共能做 10 种 Git 和 GitHub 动作”、“Git 副本不包括 LFS、子模块、Actions 产物和包”“不能在技术上挡住已登录 GitHub 的程序”，都出自 E:\\GitHub总索引 的 docs\\contracts\\git.protected-major-actions.md（第 5、9–18、58、60 行）和 tools\\Invoke-ProtectedGitHubMajorAction.ps1（第 4–6、344–358、595–670、860 行），提交 56ceea70。",
    "第 6 屏“四种都在同一个四选一窗口里选、选账号时再选 Google 还是微软、四种地位平等、任一种都能重新登记其余三种”不是原文，出自 PasswordCenter docs\\contracts\\pcconfig.secret-broker.md 第 49、113 行（提交 d167b07a）；“指纹、人脸”是我给原文“生物识别”加的例子。",
    "开头词表“无限制授权 0.5–72 小时，默认 8 小时”取自用户授权专题第 37 行，不在本专题原文里；“受信任的 AI 只有 Codex 桌面版和 Claude 桌面版”取自同专题第 49 行。",
    "开头一屏底部入口〔现在的授权状态 → 授权与状态〕链到 /computer-access/（第 2 批才做），和用户授权页用的是同一个按钮字样、同一个去处；本人看完这页最想知道的是“现在开着没有、锁着没有”。若嫌两页重复，删掉本页这条即可。",
    "第 2 屏〔用户授权〕链到 /rules/authorization/#p-trusted、第 3 屏〔分工与并行施工〕链到 /rules/execution-coordination/#p-review、第 6 屏〔密码中心的四选一验证〕链到 /projects/password-center/#f-four-factors、第 2 屏〔起疑就锁盘〕链到 #f-retired-disklock：这些锚点取自那几页已交的 page.json，那边改锚点这里要跟着改。",
    "人话翻译的取舍：“根会话”→“主对话”（词表注明原文叫法）；“定向提交”→“只提交这次相关的改动”；“指针改写”→“改写分支指向的提交”；“远端 tip 另由 refs/backup/… 持久保留”→“另外各留一个备份记号”；“现役”→“现在在用的”；“回读”→“读回”；原文“验证因子”写成“四种验证方式本身”；“Hook”括注为“AI 程序在固定时机自动跑的检查脚本”。",
    "开头插画里没有画具体型号牌子，避免让人以为规则定死某一档；岗亭里的小助手画了 Claude 标志，只是示意。",
    "全页都用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-protected-actions/page.json",
  "sha256": "487e4240d549a138fb86169632fb1e0e9cbaf786bbcbc8f15ede5ca8f7508f6f",
  "converted_at_beijing": "2026-10-31T10:23:43+08:00"
 }
}
---

::screen{#rule-protected-actions-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“重大动作与本人验证”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题，再下面介绍段。介绍段下面一张浅绿细边圆角卡片“先认几个词”，七个词条竖排，词条名粗体绿色。卡片下面一行“跳到：”后面六个圆角小按钮（白底浅绿描边绿字），就是那六个〔〕链接。右边约 45% 宽一幅水彩插画：一条林间小路上横着一道漆成白绿两色的木栏杆，栏杆旁一个小木岗亭，岗亭檐下挂小木牌“把关”，亭里坐一个戴眼镜的小 AI 助手，胸前是 Claude 的橙色星芒标志，正低头看一张单子。路上另一个小 AI 助手推着一辆小推车走到栏杆前停下，车上一只纸箱，箱侧贴着纸条“删库”。栏杆这一侧放一张小木桌，桌上一只浅绿托盘，托盘沿上刻着“四选一”，盘里并排四样东西：一把系着小牌“通行密钥”的黄铜钥匙、一部屏幕朝上的手机（屏幕上只画代表验证码的圆点，不画数字；这些圆点仅作插画示意，不规定验证码位数）旁边小牌“手机验证码”、一张折起的纸条上写“恢复码”、一张小卡片上并排画 Google 的彩色 G 标志和微软的四色方块标志。栏杆另一侧小路尽头一间小木屋，屋顶上画 GitHub 的黑色章鱼猫标志。插画里只有这六处小牌子和纸条有字，text 里“删库　把关　四选一　通行密钥　手机验证码　恢复码”这一行就是它们的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“现在开没开无限制授权、个人资料解没解锁：”，右边一个显眼的按钮〔现在的授权状态 → 授权与状态〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；水彩插画（同横版，缩成整宽一幅：上半是岗亭、栏杆和推车，下半是小木桌上的四选一托盘，远处小木屋和 GitHub 标志放在右上角；六处小牌子的字不变）；介绍段；“先认几个词”卡片（七个词条一行一条）；“跳到：”六个按钮排三行、每行两个；最下面“授权与状态”横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "L16 限时的“无限制授权”",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "L17 重大的事",
    "href": "/rules/charter/#L17"
   },
   {
    "text": "哪些算重大",
    "href": "/rules/protected-actions/#p-major"
   },
   {
    "text": "什么时候请本人验证",
    "href": "/rules/protected-actions/#p-when"
   },
   {
    "text": "动手前的把关",
    "href": "/rules/protected-actions/#p-gate"
   },
   {
    "text": "GitHub 重大动作",
    "href": "/rules/protected-actions/#p-github"
   },
   {
    "text": "本人验证的四种方式",
    "href": "/rules/protected-actions/#p-factors"
   },
   {
    "text": "各管各的",
    "href": "/rules/protected-actions/#p-separate"
   },
   {
    "text": "现在的授权状态 → 授权与状态",
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
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "55%",
     "text_ref": "重大动作与本人验证",
     "row_fit_illustration": true
    },
    {
     "type": "section_heading",
     "size": "medium",
     "row": "hero",
     "text_ref": "哪些事算重大，动手前怎么把关，什么时候、用什么方式请本人验证。"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "这是Codex和Claude共用的规则，管四件事：哪些动作算“重大的事”；这类事动手"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "glossary",
     "columns": 1,
     "text_ref": "先认几个词"
    },
    {
     "type": "action_button",
     "columns": 3,
     "text_ref": "跳到：哪些算重大什么时候请本人验证动手前的把关GitHub重大动作本人验证的四种方式"
    },
    {
     "type": "prose",
     "text_ref": "删库把关四选一通行密钥手机验证码恢复码",
     "align": "left",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "现在开没开无限制授权、个人资料解没解锁：现在的授权状态→授权与状态"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "content_card",
    "glossary",
    "action_button",
    "inline_link",
    "illustration",
    "bullet_list"
   ],
   "source_layout": "横版 16:9。左边约 55% 宽是文字区：左上“重大动作与本人验证”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题，再下面介绍段。介绍段下面一张浅绿细边圆角卡片“先认几个词”，七个词条竖排，词条名粗体绿色。卡片下面一行“跳到：”后面六个圆角小按钮（白底浅绿描边绿字），就是那六个〔〕链接。右边约 45% 宽一幅水彩插画：一条林间小路上横着一道漆成白绿两色的木栏杆，栏杆旁一个小木岗亭，岗亭檐下挂小木牌“把关”，亭里坐一个戴眼镜的小 AI 助手，胸前是 Claude 的橙色星芒标志，正低头看一张单子。路上另一个小 AI 助手推着一辆小推车走到栏杆前停下，车上一只纸箱，箱侧贴着纸条“删库”。栏杆这一侧放一张小木桌，桌上一只浅绿托盘，托盘沿上刻着“四选一”，盘里并排四样东西：一把系着小牌“通行密钥”的黄铜钥匙、一部屏幕朝上的手机（屏幕上只画代表验证码的圆点，不画数字；这些圆点仅作插画示意，不规定验证码位数）旁边小牌“手机验证码”、一张折起的纸条上写“恢复码”、一张小卡片上并排画 Google 的彩色 G 标志和微软的四色方块标志。栏杆另一侧小路尽头一间小木屋，屋顶上画 GitHub 的黑色章鱼猫标志。插画里只有这六处小牌子和纸条有字，text 里“删库　把关　四选一　通行密钥　手机验证码　恢复码”这一行就是它们的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“现在开没开无限制授权、个人资料解没解锁：”，右边一个显眼的按钮〔现在的授权状态 → 授权与状态〕。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1,
     2
    ],
    "card_groups": [
     "哪些事算重大，动手前怎么把关，什么时候、用什么方式请本人验证。",
     "先认几个词"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边约 45% 宽一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。首屏左55%题、副题、介绍、七词卡、六跳转；右45%岗亭推车/四选一托盘插画，底部整宽状态条。末段六词只在图内小牌显示一次，当前window样稿不能定位标签；交comp-slots做图文融合。带跳到前缀的para须comp-text按钮布局支持；章副题保持深绿粗体。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。；页修复08第二轮视觉补验：进一步收齐首屏留白，补充通用明确图标映射，保留全量源字。；第二轮发现columns作用于外卡，单个词表组误占半栏；第三轮明确单列通栏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "重大动作与本人验证"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "哪些事算重大，动手前怎么把关，什么时候、用什么方式请本人验证。"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "prose",
     "text_ref": "这是Codex和Claude共用的规则，管四件事：哪些动作算“重大的事”；这类事动手"
    },
    {
     "type": "glossary",
     "columns": 1,
     "text_ref": "先认几个词"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "跳到：哪些算重大什么时候请本人验证动手前的把关GitHub重大动作本人验证的四种方式"
    },
    {
     "type": "prose",
     "text_ref": "删库把关四选一通行密钥手机验证码恢复码",
     "align": "left",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "现在开没开无限制授权、个人资料解没解锁：现在的授权状态→授权与状态"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "illustration",
    "prose",
    "glossary",
    "content_card",
    "action_button",
    "inline_link",
    "bullet_list"
   ],
   "source_layout": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；水彩插画（同横版，缩成整宽一幅：上半是岗亭、栏杆和推车，下半是小木桌上的四选一托盘，远处小木屋和 GitHub 标志放在右上角；六处小牌子的字不变）；介绍段；“先认几个词”卡片（七个词条一行一条）；“跳到：”六个按钮排三行、每行两个；最下面“授权与状态”横条改成上面一行说明、下面一个整宽按钮。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1,
     2
    ],
    "card_groups": [
     "哪些事算重大，动手前怎么把关，什么时候、用什么方式请本人验证。",
     "先认几个词"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边约 45% 宽一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。标题→副题→完整岗亭托盘插画→介绍→七词卡→六按钮2×3→底部说明按钮。六图内标签不另作末行字，独立mock仅保文待空间定位，资料与授权不生成假状态。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "asset": "_library/illustrations/验证关卡托盘.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "验证关卡托盘",
   "source_phrase": "右边约 45% 宽一幅水彩插画：一条林间小路上横着一道漆成白绿两色的木栏杆，栏杆旁一个小木岗亭，岗亭檐下挂小木牌“把关”，亭里坐一个戴眼镜的小 AI 助手，胸前是 Claude 的橙色星芒标志，正低头看一张单子。路上另一个小 AI 助手推着一辆小推车走到栏杆前停下，车上一只纸箱，箱侧贴着纸条“删库”。栏杆这一侧放一张小木桌，桌上一只浅绿托盘，托盘沿上刻着“四选一”，盘里并排四样东西：一把系着小牌“通行密钥”的黄铜钥匙、一部屏幕朝上的手机（屏幕上只画代表验证码的圆点，不画数字；这些圆点仅作插画示意，不规定验证码位数）旁边小牌“手机验证码”、一张折起的纸条上写“恢复码”、一张小卡片上并排画 Google 的彩色 G 标志和微软的四色方块标志。",
   "sha256": "397cade96ab3c8ab3861ef3a0e56f799eba6e2aba903efadd06e873df3bc2fb9",
   "status": "ready",
   "original_elements": [
    "一条林间小路上横着一道漆成白绿两色的木栏杆，栏杆旁一个小木岗亭，岗亭檐下挂小木牌抽象图形，亭里坐一个戴眼镜的小 AI 助手，胸前是 Claude 的橙色星芒标志，正低头看一张单子；栏杆这一侧放一张小木桌，桌上一只浅绿托盘，托盘沿上画抽象短线的，盘里并排四样东西：一把系着小牌抽象图形的黄铜钥匙、一部屏幕朝上的手机（屏幕上只画代表验证码的圆点，不画数字；这些圆点仅作插画示意，不规定验证码位数）旁边小牌抽象图形、一张折起的纸条上画抽象短线的、一张小卡片上并排画 Google 的彩色 G 标志和微软的四色方块标志"
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
   "asset": "rule-protected-actions/rule-protected-actions-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fbcb5d6d6e0c008057dc",
   "title_text": "重大动作与本人验证",
   "sha256": "7b9d977d99e7b4ba2f503940b16558b1655f3a436f62c771341bf1a8c12a6ac5",
   "status": "ready",
   "source_box": [
    27,
    10,
    829,
    163
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 重大动作与本人验证

**哪些事算重大，动手前怎么把关，什么时候、用什么方式请本人验证。**

这是 Codex 和 Claude 共用的规则，管四件事：哪些动作算“重大的事”；这类事动手前由谁把一遍关；什么时候必须请本人验证、有哪几种验证方式；GitHub 上删库、转移、改公开这类动作怎么办。它是约法〔L16 限时的“无限制授权”〕和〔L17 重大的事〕的细则。平时干活不因为这份规则多一道审批。

**先认几个词**
- **重大的事**：约法 L17 列出的七类高风险动作，例如删库、把私人资料发到外面、删掉只有一份的数据。
- **本人验证**：在密码中心弹出的窗口里，用四种方式之一证明“现在点头的是本人”。
- **无限制授权**：本人给某个对话开的一段限时授权（0.5–72 小时，默认时长照密码中心当前设置）；开着时本人的明确指令优先于 AI 自己的规则，也算已经确认是本人。
- **个人资料解锁期**：本人验证一次后开的一段时间，时长本人定；期间 AI 可以用本人的私人资料。
- **受信任的 AI**：只有登记过的 Codex 桌面版和 Claude 桌面版两个。
- **把关**：重大的事动手前，由够格的模型再确认一遍：做不做、要不要先请本人验证。
- **主对话**：本人直接对话的那个 AI，原文叫“根会话”；它派出去单独干一段活的叫子代理。

跳到：〔哪些算重大〕〔什么时候请本人验证〕〔动手前的把关〕〔GitHub 重大动作〕〔本人验证的四种方式〕〔各管各的〕

删库　把关　四选一　通行密钥　手机验证码　恢复码

现在开没开无限制授权、个人资料解没解锁：〔现在的授权状态 → 授权与状态〕。网页原文来源快照为 E331（北京时间 10 月 31 日 07:37 起生效），本页讲解与同版专题对应；当前生效版本以 AI 开工时核验的活动入口为准。

::screen{#rule-protected-actions-09 section="points"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-09",
  "section": "points",
  "title": "一张图：这件事要不要请本人验证",
  "scene": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上一行深绿大字是本屏的“## …”标题（井号不画），标题左边画开头插画里那座小木岗亭的小图标。左边约 64% 宽是一张从上往下的判断流程图，四个判断依次往下：每个判断是一个浅绿底圆角问题框（粗体深绿问题），问题框之间用向下的细灰绿箭头连起来，箭头旁不写字。第一个问题框下面挂一张浅灰绿底的小清单卡，写那七类动作，排两三行。每个判断右边伸出绿色细箭头，text 里“→”左边的字（“不是”“是”“开着”“没开，个人资料在解锁期内”等）就写在箭头上，“→”画成箭头本身；箭头指向圆角结果小胶囊：结果是“普通干活，不打断”“不弹验证”“不再打断”的胶囊实心绿底白字；结果是“先请本人验证”“验证一次”“先请本人验证一次”的胶囊浅琥珀底深棕字，胶囊左端一把小黄铜钥匙；“往下看”的分支不画胶囊，箭头直接接回下一个问题框。胶囊后面的补充短句（如“带‘密码’‘删除’‘私人’的字眼不算数。”“个人资料解没解锁都一样。”“对话里一句‘别验证了’代替不了。”）用小号深蓝灰字写在胶囊右边或下面。“谁在做？”问题框旁画两个很小的桌面窗口图标（左窗角 OpenAI 黑色花结、右窗角 Claude 橙色星芒）；GitHub 那个问题框旁画 GitHub 黑色章鱼猫小标志。右边约 36% 宽上下两张白底细浅绿描边圆角卡：上卡“怎么验证”，卡左上角是开头插画里那只四选一浅绿托盘的小图标（托盘和东西都不写字）；下卡“验证过不等于可以做”，卡左上角一枚小绿盾牌加一个对勾，卡底色浅黄。整屏最下面一行四个白底细绿描边的圆角按钮并排居中，就是那四个〔〕链接，按钮末尾小 ↗。不画编号，插画和图标里不出现别的字。",
  "portrait": "竖版 9:16，字完全一样：标题在上；四个判断从上往下，每个问题框整宽，分支箭头改成在问题框下面向下伸出，结果胶囊一行一个；七类清单卡跟在第一个问题框下面；然后“怎么验证”“验证过不等于可以做”两张整宽卡；最后四个按钮排两行、每行两个。字多时在完整的判断之间拆屏：-v 放标题到“是 GitHub……吗？”，-v2 放“开着无限制授权吗？”到最后。",
  "links": [
   {
    "text": "七类的细节 → 哪些算重大",
    "href": "/rules/protected-actions/#p-major"
   },
   {
    "text": "把关 → 动手前的把关",
    "href": "/rules/protected-actions/#p-gate"
   },
   {
    "text": "GitHub 细则 → GitHub 重大动作",
    "href": "/rules/protected-actions/#p-github"
   },
   {
    "text": "四种方式 → 本人验证的四种方式",
    "href": "/rules/protected-actions/#p-factors"
   }
  ],
  "anchors": [
   {
    "id": "p-decide",
    "text": "一张图：这件事要不要请本人验证"
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
     "text_ref": "一张图：这件事要不要请本人验证"
    },
    {
     "type": "topology",
     "columns": 3,
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "先看实际后果：是不是这七类？",
     "layout": "graph",
     "columns_v": 1,
     "graph_nodes": [
      {
       "id": "major",
       "count": 2,
       "row": 1,
       "column": 1,
       "column_span": 3,
       "row_v": 1,
       "column_v": 1
      },
      {
       "id": "ordinary",
       "count": 1,
       "row": 2,
       "column": 1,
       "column_span": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/hires-icons/打勾清单.png"
      },
      {
       "id": "executor",
       "count": 1,
       "row": 3,
       "column": 1,
       "column_span": 3,
       "row_v": 3,
       "column_v": 1
      },
      {
       "id": "desktop",
       "count": 1,
       "row": 4,
       "column": 1,
       "column_span": 2,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
      },
      {
       "id": "other-ai",
       "count": 1,
       "row": 4,
       "column": 3,
       "column_span": 1,
       "row_v": 5,
       "column_v": 1,
       "icon": "_library/icons/身份盾牌.png"
      },
      {
       "id": "github",
       "count": 1,
       "row": 5,
       "column": 1,
       "column_span": 3,
       "row_v": 6,
       "column_v": 1
      },
      {
       "id": "github-yes",
       "count": 1,
       "row": 6,
       "column": 1,
       "column_span": 2,
       "row_v": 7,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "github-no",
       "count": 1,
       "row": 6,
       "column": 3,
       "column_span": 1,
       "row_v": 8,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
      },
      {
       "id": "authorization",
       "count": 1,
       "row": 7,
       "column": 1,
       "column_span": 3,
       "row_v": 9,
       "column_v": 1
      },
      {
       "id": "waiver",
       "count": 1,
       "row": 8,
       "column": 1,
       "column_span": 1,
       "row_v": 10,
       "column_v": 1,
       "icon": "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
      },
      {
       "id": "unlocked",
       "count": 1,
       "row": 8,
       "column": 2,
       "column_span": 1,
       "row_v": 11,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "locked",
       "count": 1,
       "row": 8,
       "column": 3,
       "column_span": 1,
       "row_v": 12,
       "column_v": 1,
       "icon": "_library/icons/身份盾牌.png"
      }
     ],
     "edges": [
      {
       "from": "major",
       "to": "ordinary",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "major",
       "to": "executor",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "executor",
       "to": "desktop",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "executor",
       "to": "other-ai",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "desktop",
       "to": "github",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "github",
       "to": "github-yes",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "github",
       "to": "github-no",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "github-no",
       "to": "authorization",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "authorization",
       "to": "waiver",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "authorization",
       "to": "unlocked",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "authorization",
       "to": "locked",
       "from_side": "bottom",
       "to_side": "top"
      }
     ]
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "text_ref": "怎么验证：通行密钥、手机验证码、恢复码、Google或微软账号四选一，任一种成功就算",
     "icons": "none"
    },
    {
     "type": "notice",
     "tone": "yellow",
     "text_ref": "验证过不等于可以做：动手前还要由够格的模型把一遍关；对外发布、第一次公开发布、真正删"
    },
    {
     "type": "action_button",
     "columns": 4,
     "text_ref": "七类的细节→哪些算重大把关→动手前的把关GitHub细则→GitHub重大动作四种方"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "illustration",
    "icon",
    "flow",
    "tag",
    "bullet_list",
    "action_button",
    "inline_link",
    "content_card"
   ],
   "source_layout": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上一行深绿大字是本屏的“## …”标题（井号不画），标题左边画开头插画里那座小木岗亭的小图标。左边约 64% 宽是一张从上往下的判断流程图，四个判断依次往下：每个判断是一个浅绿底圆角问题框（粗体深绿问题），问题框之间用向下的细灰绿箭头连起来，箭头旁不写字。第一个问题框下面挂一张浅灰绿底的小清单卡，写那七类动作，排两三行。每个判断右边伸出绿色细箭头，text 里“→”左边的字（“不是”“是”“开着”“没开，个人资料在解锁期内”等）就写在箭头上，“→”画成箭头本身；箭头指向圆角结果小胶囊：结果是“普通干活，不打断”“不弹验证”“不再打断”的胶囊实心绿底白字；结果是“先请本人验证”“验证一次”“先请本人验证一次”的胶囊浅琥珀底深棕字，胶囊左端一把小黄铜钥匙；“往下看”的分支不画胶囊，箭头直接接回下一个问题框。胶囊后面的补充短句（如“带‘密码’‘删除’‘私人’的字眼不算数。”“个人资料解没解锁都一样。”“对话里一句‘别验证了’代替不了。”）用小号深蓝灰字写在胶囊右边或下面。“谁在做？”问题框旁画两个很小的桌面窗口图标（左窗角 OpenAI 黑色花结、右窗角 Claude 橙色星芒）；GitHub 那个问题框旁画 GitHub 黑色章鱼猫小标志。右边约 36% 宽上下两张白底细浅绿描边圆角卡：上卡“怎么验证”，卡左上角是开头插画里那只四选一浅绿托盘的小图标（托盘和东西都不写字）；下卡“验证过不等于可以做”，卡左上角一枚小绿盾牌加一个对勾，卡底色浅黄。整屏最下面一行四个白底细绿描边的圆角按钮并排居中，就是那四个〔〕链接，按钮末尾小 ↗。不画编号，插画和图标里不出现别的字。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     2
    ],
    "card_groups": [
     "先看实际后果：是不是这七类？",
     "谁在做？",
     "是 GitHub 删库、转移仓库、非公开改公开吗？",
     "开着无限制授权吗？"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边画开头插画",
     "上下两张白底细浅绿描边圆角卡：上卡“怎么验证”，卡左上角是开头插画"
    ],
    "portrait_split_or_protection": true
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。四个问题纵向判断占左64%，右36%验证卡和浅黄说明；七类清单接首问题，问题右侧标签箭头通结果胶囊，继续分支回下一问题。flow当前只具线性链，无法问题/结果分支、实心结果胶囊、图标跨问题定位；需comp-diagram分支专用布局与样张。标题左岗亭、第二问题桌面窗及GitHub小标仍需资产方补，不能按inventory两个图标预算隐藏。底四按钮并排居中，↗不在定稿中不新增。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标0/2，按源位置的文件号显式请求，缺图不代表可以省略图标。新构图，待样张：库存没有09原图，source_images仅借同页02作为风格参考；09的四判断与分支布局仍完全按本屏scene/portrait，不把参考卡片结构当09原图。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一张图：这件事要不要请本人验证"
    },
    {
     "type": "topology",
     "columns": 3,
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "先看实际后果：是不是这七类？",
     "layout": "graph",
     "columns_v": 1,
     "graph_nodes": [
      {
       "id": "major",
       "count": 2,
       "row": 1,
       "column": 1,
       "column_span": 3,
       "row_v": 1,
       "column_v": 1
      },
      {
       "id": "ordinary",
       "count": 1,
       "row": 2,
       "column": 1,
       "column_span": 1,
       "row_v": 2,
       "column_v": 1,
       "icon": "_library/hires-icons/打勾清单.png"
      },
      {
       "id": "executor",
       "count": 1,
       "row": 3,
       "column": 1,
       "column_span": 3,
       "row_v": 3,
       "column_v": 1
      },
      {
       "id": "desktop",
       "count": 1,
       "row": 4,
       "column": 1,
       "column_span": 2,
       "row_v": 4,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
      },
      {
       "id": "other-ai",
       "count": 1,
       "row": 4,
       "column": 3,
       "column_span": 1,
       "row_v": 5,
       "column_v": 1,
       "icon": "_library/icons/身份盾牌.png"
      },
      {
       "id": "github",
       "count": 1,
       "row": 5,
       "column": 1,
       "column_span": 3,
       "row_v": 6,
       "column_v": 1
      },
      {
       "id": "github-yes",
       "count": 1,
       "row": 6,
       "column": 1,
       "column_span": 2,
       "row_v": 7,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "github-no",
       "count": 1,
       "row": 6,
       "column": 3,
       "column_span": 1,
       "row_v": 8,
       "column_v": 1,
       "icon": "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
      },
      {
       "id": "authorization",
       "count": 1,
       "row": 7,
       "column": 1,
       "column_span": 3,
       "row_v": 9,
       "column_v": 1
      },
      {
       "id": "waiver",
       "count": 1,
       "row": 8,
       "column": 1,
       "column_span": 1,
       "row_v": 10,
       "column_v": 1,
       "icon": "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
      },
      {
       "id": "unlocked",
       "count": 1,
       "row": 8,
       "column": 2,
       "column_span": 1,
       "row_v": 11,
       "column_v": 1,
       "icon": "_library/icons/文稿堆.png"
      },
      {
       "id": "locked",
       "count": 1,
       "row": 8,
       "column": 3,
       "column_span": 1,
       "row_v": 12,
       "column_v": 1,
       "icon": "_library/icons/身份盾牌.png"
      }
     ],
     "edges": [
      {
       "from": "major",
       "to": "ordinary",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "major",
       "to": "executor",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      },
      {
       "from": "executor",
       "to": "desktop",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "executor",
       "to": "other-ai",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      },
      {
       "from": "desktop",
       "to": "github",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 42
      },
      {
       "from": "github",
       "to": "github-yes",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "github",
       "to": "github-no",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      },
      {
       "from": "github-no",
       "to": "authorization",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "authorization",
       "to": "waiver",
       "from_side": "bottom",
       "to_side": "top"
      },
      {
       "from": "authorization",
       "to": "unlocked",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 20
      },
      {
       "from": "authorization",
       "to": "locked",
       "from_side": "left",
       "to_side": "left",
       "return": true,
       "offset": 42
      }
     ]
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "illustration": "none",
     "text_ref": "怎么验证：通行密钥、手机验证码、恢复码、Google或微软账号四选一，任一种成功就算",
     "icons": "none"
    },
    {
     "type": "notice",
     "tone": "yellow",
     "text_ref": "验证过不等于可以做：动手前还要由够格的模型把一遍关；对外发布、第一次公开发布、真正删"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "七类的细节→哪些算重大把关→动手前的把关GitHub细则→GitHub重大动作四种方"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "tag",
    "prose",
    "action_button",
    "chapter_title",
    "illustration",
    "icon",
    "flow",
    "bullet_list",
    "inline_link",
    "content_card"
   ],
   "source_layout": "竖版 9:16，字完全一样：标题在上；四个判断从上往下，每个问题框整宽，分支箭头改成在问题框下面向下伸出，结果胶囊一行一个；七类清单卡跟在第一个问题框下面；然后“怎么验证”“验证过不等于可以做”两张整宽卡；最后四个按钮排两行、每行两个。字多时在完整的判断之间拆屏：-v 放标题到“是 GitHub……吗？”，-v2 放“开着无限制授权吗？”到最后。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     2
    ],
    "card_groups": [
     "先看实际后果：是不是这七类？",
     "谁在做？",
     "是 GitHub 删库、转移仓库、非公开改公开吗？",
     "开着无限制授权吗？"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边画开头插画",
     "上下两张白底细浅绿描边圆角卡：上卡“怎么验证”，卡左上角是开头插画"
    ],
    "portrait_split_or_protection": true
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。第一张到GitHub判断，第二张从无限制授权判断到末尾；原四判断必须完整，在判断组之间拆，分支结果一行一个、末按钮2×2。同一flow块尚无分组页界，需main/comp-diagram在完整group之间分张，不以自动等高切图冒充v/v2。各结果箭头原字完整保留。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标0/2，按源位置的文件号显式请求，缺图不代表可以省略图标。新构图，待样张：库存没有09原图，source_images仅借同页02作为风格参考；09的四判断与分支布局仍完全按本屏scene/portrait，不把参考卡片结构当09原图。；2026-10-03 页修复08：按当轮审查调整规格；具体差异及未处理依赖见本页.fix.md，旧notes不是本轮验收记录。"
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
   "asset": "_library/icons/OpenAI标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "OpenAI标志",
   "source_phrase": "左窗角 OpenAI 黑色花结",
   "sha256": "d5e37ca41dfb31132d6efa380695341971364f891ab4002f15821513909e5c0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "右窗角 Claude 橙色星芒",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "身份盾牌",
   "source_phrase": "别的 AI 或程序 → **先请本人验证**。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "是 → 开着有效的无限制授权：**不弹验证**；没开：**验证一次**。个人资料解没解锁都一样。",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "不是 → 往下看。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "开着 → **不弹验证**。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "没开，个人资料在解锁期内 → **不再打断**。",
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
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "身份盾牌",
   "source_phrase": "没开，资料也锁着 → **先请本人验证一次**。对话里一句“别验证了”代替不了。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/验证关卡托盘.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "ill-d6d27a8e43661b",
   "source_phrase": "左上一行深绿大字是本屏的“## …”标题（井号不画），标题左边画开头插画里那座小木岗亭的小图标。",
   "sha256": "397cade96ab3c8ab3861ef3a0e56f799eba6e2aba903efadd06e873df3bc2fb9",
   "status": "ready",
   "original_elements": [],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-58dac56a0f27f959ebdc.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-58dac56a0f27f959ebdc",
   "title_text": "一张图：这件事要不要请本人验证",
   "sha256": "dadff3d733e75bb612012587d0cb1ad3507097a39bb875bfab9064e20d0d826a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 一张图：这件事要不要请本人验证

**先看实际后果：是不是这七类？**
批量导出私人资料或聊天记录；把私人资料发到外面；查看或导出密码明文、银行卡；改本人验证方式或恢复方式；关掉或绕过保护；删库、转移仓库、把私人仓库改成公开；删除只有一份的数据。
- 不是 → **普通干活，不打断**。带“密码”“删除”“私人”的字眼不算数。新建公开仓库不在这七类里：它算对外发布，只要本人明确同意，不验证身份。

**谁在做？**
- Codex 桌面版或 Claude 桌面版 → 往下看。
- 别的 AI 或程序 → **先请本人验证**。

**是 GitHub 删库、转移仓库或非公开改公开吗？**
- 是 → 开着有效的无限制授权：**不弹验证**；没开：**验证一次**。个人资料解没解锁都一样。
- 不是 → 往下看。

**开着无限制授权吗？**
- 开着 → **不弹验证**。
- 没开，个人资料在解锁期内 → **不再打断**。
- 没开，资料也锁着 → **先请本人验证一次**。对话里一句“别验证了”代替不了。

**怎么验证**：通行密钥、手机验证码、恢复码、Google 或微软账号四选一，任一种成功就算；取消、拒绝或超时只结束这一次，不自动重试。

**验证过不等于可以做**：动手前还要由够格的模型把一遍关；对外发布、第一次公开发布、真正删掉只有一份的数据，仍要本人明确同意；新建公开仓库也只要这份明确同意。

〔七类的细节 → 哪些算重大〕〔把关 → 动手前的把关〕〔GitHub 细则 → GitHub 重大动作〕〔四种方式 → 本人验证的四种方式〕

::screen{#rule-protected-actions-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-02",
  "section": "points",
  "title": "人话要点：哪些算重大、什么时候验证、清单怎么来的",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“哪些算重大的事”配一只贴着红封条的小纸箱、“什么时候请本人验证”配一个小沙漏旁边立着一把黄铜钥匙、“这份清单怎么来的”配一页被划掉一半的旧草稿纸。排法：左边一张高卡“哪些算重大的事”占约 40% 宽，七类动作一行一条，下面那段“算不算重大看实际后果……”接在同一张卡里、和七类之间隔一条浅绿细线；右边上面一张卡“什么时候请本人验证”；右下一张窄一点的浅绿底小卡“这份清单怎么来的”。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版（哪些算重大 → 什么时候验证 → 清单怎么来的）。字和横版完全一样。",
  "links": [
   {
    "text": "L17",
    "href": "/rules/charter/#L17",
    "locator_instances": {
     "h": {
      "input_sha256": "9e129cbb647760fcd3ff61b05b69e5635248e6abd8ea2dcf7e7776d0a3a86f04",
      "instances": [
       {
        "expected_rect": [
         114,
         326,
         155,
         346
        ],
        "confirm_region": true,
        "underline_rect": [
         114,
         352,
         155,
         354
        ],
        "context_text": "约法L17列了七类：",
        "context_rect": [
         58,
         322,
         289,
         347
        ]
       },
       {
        "expected_rect": [
         1284,
         813,
         1314,
         827
        ],
        "confirm_region": true,
        "underline_rect": [
         1284,
         831,
         1314,
         833
        ],
        "context_text": "于是起疑整套删掉，这份高风险动作清单留了下来，成了约法L17，只用来回答",
        "context_rect": [
         810,
         808,
         1439,
         829
        ]
       }
      ]
     },
     "v": {
      "input_sha256": "0b138f40dbcadbebb5386bd14642f644d0c597a4a94d962373a79ad0526d272f",
      "instances": [
       {
        "expected_rect": [
         168,
         464,
         230,
         495
        ],
        "confirm_region": true,
        "underline_rect": [
         168,
         501,
         230,
         505
        ],
        "context_text": "约法L17列了七类：",
        "context_rect": [
         64,
         457,
         485,
         501
        ]
       }
      ]
     }
    }
   },
   {
    "text": "约法 L16",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/#p-trusted"
   },
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/"
   },
   {
    "text": "起疑就锁盘",
    "href": "/projects/password-center/#f-retired-disklock"
   }
  ],
  "anchors": [
   {
    "id": "p-major",
    "text": "哪些算重大的事"
   },
   {
    "id": "p-when",
    "text": "什么时候请本人验证"
   },
   {
    "id": "p-origin",
    "text": "这份清单怎么来的"
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
     "text_ref": "人话要点 · 重大的事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-0400995e5d5fc6cc69e3.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "major-cards",
     "width": "40%",
     "text_ref": "哪些算重大的事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-13257ae877bb3fbc6e7f.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "major-cards",
     "width": "60%",
     "text_ref": "什么时候请本人验证"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions/rule-protected-actions-02-icon-03.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "major-cards",
     "text_ref": "这份清单怎么来的"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“哪些算重大的事”配一只贴着红封条的小纸箱、“什么时候请本人验证”配一个小沙漏旁边立着一把黄铜钥匙、“这份清单怎么来的”配一页被划掉一半的旧草稿纸。排法：左边一张高卡“哪些算重大的事”占约 40% 宽，七类动作一行一条，下面那段“算不算重大看实际后果……”接在同一张卡里、和七类之间隔一条浅绿细线；右边上面一张卡“什么时候请本人验证”；右下一张窄一点的浅绿底小卡“这份清单怎么来的”。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左40%七类大高卡与后果说明同卡、两者间细线；右60%验证卡与较窄清单来历卡上下。后果说明节点保留于左卡；底来历不误拆为外部正文。小绿圆点来自原清单，来历卡浅绿新样式需样张。；素材登记图标2/3，按源位置的文件号显式请求，缺图不代表可以省略图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 重大的事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-0400995e5d5fc6cc69e3.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "哪些算重大的事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-13257ae877bb3fbc6e7f.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "什么时候请本人验证"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions/rule-protected-actions-02-icon-03.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "这份清单怎么来的"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon"
   ],
   "source_layout": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版（哪些算重大 → 什么时候验证 → 清单怎么来的）。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。三卡同序整宽：七类、什么时候验证、清单来历；没有横版左右列，前卡后果说明仍在同卡。；素材登记图标2/3，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "身份盾牌",
   "source_phrase": "一只贴着红封条的小纸箱、“什么时候请本人验证”配一个小沙漏旁边立着一把黄铜钥匙、“这份清单怎么来的”配一页被划掉一半的旧草稿纸",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
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
   "asset": "_library/round3/titles/title-r3-620256d530d5a056c3ae.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-02-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-620256d530d5a056c3ae",
   "title_text": "人话要点 · 重大的事",
   "sha256": "4aac686c7c7c3f916762a94f9df2ee6625cdf74425481933748936a7f15432f9",
   "status": "ready",
   "source_box": [
    0,
    89,
    939,
    359
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 重大的事

### 哪些算重大的事
约法〔L17〕列了七类：
- 批量导出私人资料或聊天记录；
- 把私人资料发到外面：上传、发邮件、发消息；
- 查看或导出密码明文、银行卡；
- 改本人的验证方式或恢复方式；
- 关掉或绕过保护；
- 删库、转移仓库、把私人仓库改成公开；
- 删除只有一份的数据。

算不算重大看实际后果，不看字眼：带“密码”“删除”“私人”的动作不一定重大。普通改代码、跑测试、只提交这次相关的改动并正常推送、发布规则、清理能重新生成的东西，都不算。

### 什么时候请本人验证
- 开着无限制授权：已经算确认是本人，重大的事不再弹验证（〔约法 L16〕）。
- 没开无限制授权、个人资料也不在解锁期内：先请本人验证一次。解锁期内不再为此打断。
- 没开无限制授权时，对话里的一句话，包括“别验证了”，都不能代替验证。
- 上面这些免验证只给受信任的 AI（见〔用户授权〕）；别的 AI 做重大的事，一律先请本人验证。
- 普通聊天、普通干活、查本人的资料来回答问题，都不打断。
- 个人资料锁着时，查资料仍要先请本人解锁，见〔个人资料与数据处理〕。

### 这份清单怎么来的
早先设计过“起疑”：AI 发现可疑的动作就停手、请本人验证，还一度要锁屏、锁整块硬盘。本人 9 月 26 日答复：不能莫名其妙锁屏，个人资料解锁期内发邮件本来很正常。于是起疑整套删掉，这份高风险动作清单留了下来，成了约法 L17，只用来回答“什么时候必须请本人验证”。密码中心页的已停用功能里还能看到当年的〔起疑就锁盘〕。

::screen{#rule-protected-actions-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-03",
  "section": "points",
  "title": "人话要点：动手前的把关",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“谁来把关、把什么”配开头插画里那座小木岗亭（同一座）、“把关不是独立复核”配一只放大镜照着一页纸。排法：左边约 60% 宽一张大卡“谁来把关、把什么”；右边约 40% 宽一张卡“把关不是独立复核”，卡里最后一条“打个比方……”放在一个浅绿底小框里。两张卡下面留一条窄窄的水彩装饰带：左边岗亭的小栏杆抬起一半，右边一条小路通向远处，路边几片叶子。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“谁来把关”，后“把关不是独立复核”），“打个比方”小框留在第二张卡里；最下面水彩装饰带。字和横版完全一样。",
  "links": [
   {
    "text": "约法 L22",
    "href": "/rules/charter/#L22"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/#p-review"
   }
  ],
  "anchors": [
   {
    "id": "p-gate",
    "text": "动手前的把关"
   },
   {
    "id": "p-gate-who",
    "text": "谁来把关、把什么"
   },
   {
    "id": "p-gate-vs-review",
    "text": "把关不是独立复核"
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
     "text_ref": "人话要点 · 动手前的把关"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions\\rule-protected-actions-03-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "judgement",
     "width": "60%",
     "text_ref": "谁来把关、把什么"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-ef36f925fb2dac51e0c0.png"
     ],
     "inset_prefixes": [
      "打个比方："
     ],
     "row": "judgement",
     "width": "40%",
     "text_ref": "把关不是独立复核"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "judgement",
     "width": "30%"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“谁来把关、把什么”配开头插画里那座小木岗亭（同一座）、“把关不是独立复核”配一只放大镜照着一页纸。排法：左边约 60% 宽一张大卡“谁来把关、把什么”；右边约 40% 宽一张卡“把关不是独立复核”，卡里最后一条“打个比方……”放在一个浅绿底小框里。两张卡下面留一条窄窄的水彩装饰带：左边岗亭的小栏杆抬起一半，右边一条小路通向远处，路边几片叶子。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩图标：“谁来把关、把什么”配开头插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横60%/40%两卡、竖上下；末条打比方浅绿内框由inset_prefixes实现。底部岗亭半抬栏杆及通远处小路装饰带是scene明确要求，inventory插画计0；规格保留banner插画位，素材需补。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 动手前的把关"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions\\rule-protected-actions-03-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "谁来把关、把什么"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-ef36f925fb2dac51e0c0.png"
     ],
     "inset_prefixes": [
      "打个比方："
     ],
     "text_ref": "把关不是独立复核"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "banner"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon"
   ],
   "source_layout": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“谁来把关”，后“把关不是独立复核”），“打个比方”小框留在第二张卡里；最下面水彩装饰带。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩图标：“谁来把关、把什么”配开头插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横60%/40%两卡、竖上下；末条打比方浅绿内框由inset_prefixes实现。底部岗亭半抬栏杆及通远处小路装饰带是scene明确要求，inventory插画计0；规格保留banner插画位，素材需补。"
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
   "source_phrase": "开头插画里那座小木岗亭（同一座）、“把关不是独立复核”配一只放大镜照着一页纸",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/验证关卡托盘.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "验证关卡托盘",
   "source_phrase": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“谁来把关、把什么”配开头插画里那座小木岗亭（同一座）、“把关不是独立复核”配一只放大镜照着一页纸。排法：左边约 60% 宽一张大卡“谁来把关、把什么”；右边约 40% 宽一张卡“把关不是独立复核”，卡里最后一条“打个比方……”放在一个浅绿底小框里。两张卡下面留一条窄窄的水彩装饰带：左边岗亭的小栏杆抬起一半，右边一条小路通向远处，路边几片叶子。",
   "sha256": "397cade96ab3c8ab3861ef3a0e56f799eba6e2aba903efadd06e873df3bc2fb9",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-a5ba03a8cb9c5498b080.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-03-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-a5ba03a8cb9c5498b080",
   "title_text": "人话要点 · 动手前的把关",
   "sha256": "96fee7228dc8812ed14f844bd76710b1433b45de0365428b98e2085cb7897196",
   "status": "ready",
   "source_box": [
    32,
    32,
    947,
    189
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 动手前的把关

### 谁来把关、把什么
- 重大的事动手前，由一个够格的模型把一遍关，确认三件事：这确实是本人要的；目标和影响都对；需要本人验证的，先请本人验证。
- 够格的模型：Claude 使用 Claude Opus 5.5，至少 medium；Codex 按现行模型清单使用 GPT-6.1 Sol 或 GPT-6 Astra，至少 high。
- 主对话自己够格，就自己判断；不够格，就派一个够格的子代理只做这一次判断：它不动手，也不再往下派。Claude 可选 medium 或更高档的子代理；具体把关资格以现行专题为准。
- 把关没做完时，只停那一步撤不回的最后动作；其余思考、能撤回的工作、修复和测试照常做。

### 把关不是独立复核
- 把关只管动手前这一步：做不做、要不要请本人验证。
- 独立复核（〔约法 L22〕）管一项重大改动或决定本身对不对：交给另一个独立的上下文，看原始材料重新检查，做法见〔分工与并行施工〕。
- 打个比方：要删一个旧仓库，把关看“是不是本人要删、删的是不是这个库、要不要先验证”；独立复核看“这个库该不该删、删了会丢什么”。

::screen{#rule-protected-actions-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-04",
  "section": "points",
  "title": "人话要点：GitHub 上哪些要验证、哪些是普通收尾",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画），标题左边画 GitHub 的黑色章鱼猫小标志。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“要本人验证的四种动作”配一把黄铜钥匙插在小锁上、“普通收尾，不验证”配一个装好的小纸箱贴着绿色对勾。排法：左边约 40% 宽一张卡“要本人验证的四种动作”，卡头下第一条的四种动作画成四个并排的小标签（删除仓库、转移仓库、非公开改公开、新建公开仓库），标签下面接着画其余要点；右边约 60% 宽一张卡“普通收尾，不验证”，最后一条“由来：……”放在卡片底部一个浅绿底小框里。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“要本人验证的四种动作”，四个小标签排成两行两个；后“普通收尾，不验证”，由来小框在卡底）。字和横版完全一样。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [
   {
    "id": "p-github",
    "text": "GitHub 重大动作"
   },
   {
    "id": "p-github-major",
    "text": "要本人验证的三种动作"
   },
   {
    "id": "p-github-normal",
    "text": "普通收尾，不验证"
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
     "text_ref": "人话要点 · GitHub 重大动作"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions\\rule-protected-actions-04-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "github",
     "width": "40%",
     "text_ref": "要本人验证的三种动作"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions/rule-protected-actions-04-icon-02.png"
     ],
     "inset_prefixes": [
      "由来："
     ],
     "row": "github",
     "width": "60%",
     "text_ref": "普通收尾，不验证"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "icon",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "tag"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画），标题左边画 GitHub 的黑色章鱼猫小标志。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“要本人验证的三种动作”配一把黄铜钥匙插在小锁上、“普通收尾，不验证”配一个装好的小纸箱贴着绿色对勾。排法：左边约 40% 宽一张卡“要本人验证的三种动作”，卡头下第一条的三种动作画成三个并排的小标签（删除仓库、转移仓库、非公开改公开），标签下面接着画其余要点；右边约 60% 宽一张卡“普通收尾，不验证”，最后一条“由来：……”放在卡片底部一个浅绿底小框里。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左40%四种动作卡，右60%普通收尾，竖上下。左第一bullet一行含四个动作，需在原标点位置拆四个标签，横4个、竖2×2；现points_card不做清单内标签拆分，交comp-text。标题左GitHub小标是额外图像需求，chapter_title未支持标题内图标，需core/素材方接入；不增文字。右由来浅绿内框已用inset_prefixes。；素材登记图标1/2，按源位置的文件号显式请求，缺图不代表可以省略图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · GitHub 重大动作"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions\\rule-protected-actions-04-icon-01.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "要本人验证的三种动作"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions/rule-protected-actions-04-icon-02.png"
     ],
     "inset_prefixes": [
      "由来："
     ],
     "text_ref": "普通收尾，不验证"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "tag",
    "chapter_title",
    "prose",
    "icon",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“要本人验证的三种动作”，四个小标签排成两行两个；后“普通收尾，不验证”，由来小框在卡底）。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左40%四种动作卡，右60%普通收尾，竖上下。左第一bullet一行含四个动作，需在原标点位置拆四个标签，横4个、竖2×2；现points_card不做清单内标签拆分，交comp-text。标题左GitHub小标是额外图像需求，chapter_title未支持标题内图标，需core/素材方接入；不增文字。右由来浅绿内框已用inset_prefixes。；素材登记图标1/2，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "source_phrase": "一把黄铜钥匙插在小锁上、“普通收尾，不验证”配一个装好的小纸箱贴着绿色对勾",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-52625320a1f020dd1434-oneline.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-04-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-52625320a1f020dd1434",
   "title_text": "人话要点 · GitHub 重大动作",
   "sha256": "cc11e0901835d2a1d57145d7c30045fccb57cdf35cee804502d1aa381e896b13",
   "status": "ready",
   "source_box": [
    19,
    82,
    926,
    284
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · GitHub 重大动作

### 要本人验证的三种动作
- 删除仓库、转移仓库、把非公开仓库改成公开。
- 开着有效的无限制授权：不重复弹验证；没开：验证一次。
- 这一条不看个人资料解没解锁：解锁期代替不了这次验证。
- 验证过不等于可以发布：对外发布和第一次公开发布，仍要本人明确同意。
- 新建公开仓库不在这三种里：它等于对外发布，只核本人有没有明确同意，不另做一次身份验证。往已经在用的公开仓库正常推送，按 Git 收尾的长期授权直接做，不重复请示。

### 普通收尾，不验证
- 合并进主线、分支或仓库改名、新建本人 GitHub 私有仓库、公开仓库改成私有、改默认分支、把远端改成本人 GitHub 账号下的仓库。
- 删除分支和标签、改写分支指向的提交（含强制推送）：只要先核对过旧提交还在别的分支或标签里留着、不会丢，也算普通收尾。
- 普通收尾不请本人验证，也不逐项向本人报告技术细节。
- 删除或改写前，程序自动核对旧提交还被别的本地或 GitHub 分支、标签留着；核对不过就停下说原因，不改成找本人验证。可能丢提交的强制推送仍要本人明确同意。
- 仓库改名时，一并更新〔电脑配置与恢复〕里的仓库位置登记，和真正调用这个仓库的地方。
- 由来：本人 9 月 27 日说，把删分支、合进主线也当成要验证的动作太严了，让 AI 找个最优解。Claude 按本人授权定下：要本人验证的只留约法 L17 的删库、转移、私有改公开，加上新建公开仓库（等于对外发布）和真正删掉只有一份的数据；合进主线、删内容已在别处保存的分支、改名、改默认分支这些都归普通收尾。本人未否决前照此执行。现行规则又把新建公开仓库移出本人验证：它按对外发布处理，只核本人明确同意；核对过不丢提交的历史改写也明确归入普通收尾。

::screen{#rule-protected-actions-05 section="points"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-05",
  "section": "points",
  "title": "人话要点：删库和转移前的准备、谁来执行、回执怎么写",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“删库和转移前先备好”配一摞装订好的文件夹和一只打开的小木箱、“谁来执行、回执怎么写”配一张盖了绿色圆章的小收据。排法：两张卡左右并排、等宽。左卡“删库和转移前先备好”里，第三条“现在的执行入口具体这样做……”放在一个浅绿底小框里，框里右上角画一张小清单纸，纸上只画几条横线、不写字。右卡“谁来执行、回执怎么写”里，“回执分开写两件事”那一条旁边画一张小收据，收据上两行小勾选框，框旁不写字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“删库和转移前先备好”，后“谁来执行、回执怎么写”）。字和横版完全一样。",
  "links": [
   {
    "text": "改项目前先核对",
    "href": "/skills/project-entry-gate/"
   }
  ],
  "anchors": [
   {
    "id": "p-github-prepare",
    "text": "删库和转移前先备好"
   },
   {
    "id": "p-github-run",
    "text": "谁来执行、回执怎么写"
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
     "text_ref": "人话要点 · 删库和转移"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions/rule-protected-actions-05-icon-01.png"
     ],
     "inset_prefixes": [
      "现在的执行入口具体这样做："
     ],
     "row": "delete",
     "width": "50%",
     "text_ref": "删库和转移前先备好"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/沙漏.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "row": "delete",
     "width": "50%",
     "text_ref": "谁来执行、回执怎么写"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon",
    "monospace"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“删库和转移前先备好”配一摞装订好的文件夹和一只打开的小木箱、“谁来执行、回执怎么写”配一张盖了绿色圆章的小收据。排法：两张卡左右并排、等宽。左卡“删库和转移前先备好”里，第三条“现在的执行入口具体这样做……”放在一个浅绿底小框里，框里右上角画一张小清单纸，纸上只画几条横线、不写字。右卡“谁来执行、回执怎么写”里，“回执分开写两件事”那一条旁边画一张小收据，收据上两行小勾选框，框旁不写字。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。两卡横等宽、竖上下；左第三条浅绿内框，右回执两项旁小收据。卡头图标按01/02显式映射；左内框右上清单小纸与右条目小收据也是scene要求，points_card尚无指定某bullet附图接口，需comp-text与素材方补位。；素材登记图标0/2，按源位置的文件号显式请求，缺图不代表可以省略图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 删库和转移"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "rule-protected-actions/rule-protected-actions-05-icon-01.png"
     ],
     "inset_prefixes": [
      "现在的执行入口具体这样做："
     ],
     "text_ref": "删库和转移前先备好"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/沙漏.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "谁来执行、回执怎么写"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon",
    "monospace"
   ],
   "source_layout": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“删库和转移前先备好”，后“谁来执行、回执怎么写”）。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。两卡横等宽、竖上下；左第三条浅绿内框，右回执两项旁小收据。卡头图标按01/02显式映射；左内框右上清单小纸与右条目小收据也是scene要求，points_card尚无指定某bullet附图接口，需comp-text与素材方补位。；素材登记图标0/2，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "source_phrase": "一摞装订好的文件夹和一只打开的小木箱、“谁来执行、回执怎么写”配一张盖了绿色圆章的小收据",
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
   "asset": "_library/round3/titles/title-r3-7cd24cf36b4ef5b6ba56.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-05-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7cd24cf36b4ef5b6ba56",
   "title_text": "人话要点 · 删库和转移",
   "sha256": "4001ccfd7739f7065bad3d7669e7820e40be7204b9151b2849f3048d1c0efb06",
   "status": "ready",
   "source_box": [
    162,
    37,
    1075,
    231
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 删库和转移

### 删库和转移前先备好
- AI 先自动确认本地副本是全的：GitHub 上的所有分支都在本地，缺的先拉下来。
- 把只在 GitHub 网页上、不在 Git 里的东西（例如 issue、发布包）列给本人看。
- 现在的执行入口具体这样做：把所有分支和标签拉到本地，另外各留一个备份记号，免得以后清理本地时顺手丢掉；列出全部 issue、PR、Release 和发布包的标题和链接；Wiki、讨论区、项目看板、Actions 只列入口和开没开。这份清单只是列出来，不会替本人备份网页上的内容。拉到本地的 Git 副本也不自动包括 Git LFS 大文件、子模块仓库、Actions 产物和软件包仓库里的包；删的仓库用到这些时，由动手的 AI 另外保全，并说清保住了哪些。
- **先看损失，再动手**：删库和转移固定分两次调用。第一次加 `-DryRun` 预览：检查目标、需要时拉全本地副本、生成上面那份清单，不请本人验证、不改 GitHub；AI 拿到后先把要动的仓库、网页独有内容清单、没列出来的类别和可能丢掉什么讲给本人听（转移就讲归属和以后的访问会怎么变）。第二次再依据已经拿到的授权去掉 `-DryRun` 正式执行，入口会重新读现场、照样打印清单；正式执行前已知仓库内容或去向变了，就重新预览、重新讲。
- 预览会拉取分支、新建本地备份记号，所以不算严格只读；工具把清单打印出来，也不等于本人已经看到。

### 谁来执行、回执怎么写
- 执行入口是〔改项目前先核对〕技能自带的 GitHub 重大动作入口：有有效的无限制授权，就直接执行已授权的动作；没有，就调用密码中心验证一次。普通 Git 收尾不找密码中心。
- 这个入口一共能做 10 种 Git 和 GitHub 动作（有的只动本地分支），只有删库、转移、改公开这三种情形要本人验证，其余只做自动核对。
- 本人验证可能要等一会儿；验证完，入口会重新读一遍仓库现状，这期间仓库变了就停下。
- 回执分开写两件事：权限核验过没有；这次是本人真做了一次验证，还是复用了已有的授权。复用不能说成刚验证过。
- 真要销毁只有一份的数据，仍要本人明确同意、按重大的事办；普通清理核对不过时，不会自动改走销毁这条路。
- 这道验证靠 AI 按规矩走入口：入口负责核对、请本人验证和事后读回，并不能在技术上挡住已经登录 GitHub 的程序直接删库。

::screen{#rule-protected-actions-06 section="points"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-06",
  "section": "points",
  "title": "人话要点：本人验证的四种方式、各产品各管各的",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“本人验证的四种方式”配开头插画里那只四选一托盘（同一只，四样东西不变，但这里托盘和小牌子都不写字）、“各产品各管各的”配三个并排的小木柜，柜门上分别画一把钥匙、一个对勾盾牌、一块硬盘。排法：左边约 62% 宽一张大卡“本人验证的四种方式”；右边约 38% 宽一张卡“各产品各管各的”，卡片下面留一块水彩小插画：三个小木柜前各站一个小 AI 助手，各看各的柜子。local-secret-broker 用等宽字体。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“本人验证的四种方式”，后“各产品各管各的”），三个小木柜的插画放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "密码中心的四选一验证",
    "href": "/projects/password-center/#f-four-factors"
   },
   {
    "text": "local-secret-broker",
    "href": "/skills/local-secret-broker/"
   }
  ],
  "anchors": [
   {
    "id": "p-factors",
    "text": "本人验证的四种方式"
   },
   {
    "id": "p-separate",
    "text": "各产品各管各的"
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
     "text_ref": "人话要点 · 本人验证方式"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-b939a47c15f4e73feeb0.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "本人验证的四种方式"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "各产品各管各的",
     "row": "lone-ill-3",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "lone-ill-3",
     "width": "40%"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon",
    "monospace"
   ],
   "source_layout": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“本人验证的四种方式”配开头插画里那只四选一托盘（同一只，四样东西不变，但这里托盘和小牌子都不写字）、“各产品各管各的”配三个并排的小木柜，柜门上分别画一把钥匙、一个对勾盾牌、一块硬盘。排法：左边约 62% 宽一张大卡“本人验证的四种方式”；右边约 38% 宽一张卡“各产品各管各的”，卡片下面留一块水彩小插画：三个小木柜前各站一个小 AI 助手，各看各的柜子。local-secret-broker 用等宽字体。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩图标：“本人验证的四种方式”配开头插画",
     "下面留一块水彩小插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左62%验证大卡，右38%产品卡及卡下三柜小AI插画；小插画在卡外下方。inventory主插画预算0不能抹掉scene明确三柜图，需要补资产。四选一图不带旧标签字。；素材登记图标1/2，按源位置的文件号显式请求，缺图不代表可以省略图标。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。；独立复核收敛：装饰图按自然比例限高，截图与统计并排，避免仅消白却增大页面。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 本人验证方式"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-b939a47c15f4e73feeb0.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "本人验证的四种方式"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png"
     ],
     "inset_prefixes": [
      "实例："
     ],
     "text_ref": "各产品各管各的"
    },
    {
     "type": "illustration",
     "index": 0
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "chapter_title",
    "prose",
    "section_heading",
    "points_card",
    "bullet_list",
    "inline_link",
    "icon",
    "monospace"
   ],
   "source_layout": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“本人验证的四种方式”，后“各产品各管各的”），三个小木柜的插画放在最下面。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左上角一个小水彩图标：“本人验证的四种方式”配开头插画",
     "下面留一块水彩小插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。标题→四种方式整宽卡→各产品整宽卡→三柜小AI整宽插画。卡头图标与底主插画分开，不把四选一托盘拿来冒充三柜。；素材登记图标1/2，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "source_phrase": "开头插画里那只四选一托盘（同一只，四样东西不变，但这里托盘和小牌子都不写字）、“各产品各管各的”配三个并排的小木柜，柜门上分别画一把钥匙、一个对勾盾牌、一块硬盘",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/验证关卡托盘.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "验证关卡托盘",
   "source_phrase": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片里每条要点前一个小绿圆点，正文深蓝灰。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。卡片左上角一个小水彩图标：“本人验证的四种方式”配开头插画里那只四选一托盘（同一只，四样东西不变，但这里托盘和小牌子都不写字）、“各产品各管各的”配三个并排的小木柜，柜门上分别画一把钥匙、一个对勾盾牌、一块硬盘。排法：左边约 62% 宽一张大卡“本人验证的四种方式”；右边约 38% 宽一张卡“各产品各管各的”，卡片下面留一块水彩小插画：三个小木柜前各站一个小 AI 助手，各看各的柜子。local-secret-broker 用等宽字体。",
   "sha256": "397cade96ab3c8ab3861ef3a0e56f799eba6e2aba903efadd06e873df3bc2fb9",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-2869461b916c6926d9ff.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-06-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-2869461b916c6926d9ff",
   "title_text": "人话要点 · 本人验证方式",
   "sha256": "b97045ed628b52818a0244010aa192b466853b5ecb6ee0a2c23817a2e66a9d54",
   "status": "ready",
   "source_box": [
    34,
    40,
    961,
    223
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 本人验证方式

### 本人验证的四种方式
- 通行密钥（Passkey）、手机验证码（TOTP）、恢复码、Google 或微软账号；任一种已登记、能用的验证成功就算完成。
- 四种都在密码中心同一个“四选一”窗口里选，选账号时再在窗口里选 Google 还是微软；四种地位平等，用任一种都能重新登记其余三种，见〔密码中心的四选一验证〕。
- 本人没指定方式时，一种坏了不挡住其他能用的方式，坏的照实说明。
- 本人指定的方式坏了，就修好它；暂时修不好就说清原因，不擅自换别的方式。
- 本人取消、拒绝或超时，只结束这一次，不自动重试；软件故障要和这几种情况分开说。
- 四种都丢了时，AI 不自己建立新的验证方式。
- Windows 登录密码、PIN 和指纹、人脸这类生物识别，都不算这四种。
- 改了本人验证的方式（四种验证方式本身、请求验证的窗口或相关入口），就请本人实际验证一次；代码测试和模拟不能冒充本人验证。
- 请本人验证、锁定资料这些具体操作，走〔local-secret-broker〕技能里现行的入口。

### 各产品各管各的
- 密码中心、本人验证和 BitLocker（Windows 整盘加密）各按自己现在在用的入口办。
- 规则读取、发布、校验或 Hook（AI 程序在固定时机自动跑的检查脚本）出了故障：不自动锁任何东西，也不去读秘密。
- 规则核验通过，只说明规则文件是对的；不说明操作的人可信，也不说明这个动作已经被允许。

::screen{#rule-protected-actions-07 section="original"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-07",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.protected-actions.md",
   "release": "E331",
   "sha256": "03675781035e4fd1942f4f45b9f7a8c910c94421cd21e9a414e0fa1198046f73",
   "public_sha256": "941bf9f832b34c8aaf2a4088613a950112b7d8dd5f9466ade6d5b706d42939f3",
   "from": null,
   "to": "## GitHub 重大动作",
   "start": 0,
   "end": 1019,
   "approved_omissions": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 重大动作与本人验证”到“什么时候请本人验证：”下面五条结束；右卡放“## 重大动作前的把关”和它下面两段。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-protected-actions/rule-protected-actions-07",
  "source_logical_id": "protected_actions_contract",
  "source_public_sha256": "941bf9f832b34c8aaf2a4088613a950112b7d8dd5f9466ade6d5b706d42939f3",
  "source_rule_part": "rule-protected-actions/rule-protected-actions-07"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E331版，一字不改"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "重大动作与本人验证",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "重大动作前的把关",
     "body_columns": 1
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "inline_link",
    "monospace"
   ],
   "source_layout": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E221 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 重大动作与本人验证”到“什么时候请本人验证：”下面五条结束；右卡放“## 重大动作前的把关”和它下面两段。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，不换成活动E210；上方版本小字；横等宽两大卡，07左到验证五条、右把关两段，08左GitHub三段、右验证方式和各产品同卡；竖整篇一张外卡。whole_block现已实现内h1/h2小题不拆卡、不画毛笔章题。无插画、图标或连线。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E331版，一字不改"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "重大动作与本人验证"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "inline_link",
    "monospace"
   ],
   "source_layout": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，不换成活动E210；上方版本小字；横等宽两大卡，07左到验证五条、右把关两段，08左GitHub三段、右验证方式和各产品同卡；竖整篇一张外卡。whole_block现已实现内h1/h2小题不拆卡、不画毛笔章题。无插画、图标或连线。"
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
   "asset": "rule-protected-actions/rule-protected-actions-01-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fbcb5d6d6e0c008057dc",
   "title_text": "重大动作与本人验证",
   "sha256": "7b9d977d99e7b4ba2f503940b16558b1655f3a436f62c771341bf1a8c12a6ac5",
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
   "asset": "rule-protected-actions/rule-protected-actions-07-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a49e660271673a587392",
   "title_text": "重大的事",
   "sha256": "47a297aa774e48595b7b876ece224d2dbaee53edca585bc51f93471573d1266c",
   "status": "ready",
   "source_box": [
    45,
    324,
    221,
    385
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
   "asset": "rule-protected-actions/rule-protected-actions-07-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-da8469347307d5e61bd2",
   "title_text": "重大动作前的把关",
   "sha256": "cfcdb62992a0656d623fa09eaa20fda68fcf683e3496c201326d4b960bef5ab8",
   "status": "ready",
   "source_box": [
    896,
    328,
    1222,
    390
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E331 版，一字不改

# 重大动作与本人验证

owner: `E:\.agents`

这里说清哪些事算重大、做之前怎么把关、本人验证有哪几种方式，以及 GitHub 重大动作怎么办。平时干活不因为有这份专题而多一道审批。

## 重大的事

高风险动作就是“重大的事”（约法 L17）：

- 批量导出私人资料或聊天记录；
- 把私人资料发到外面（上传、发邮件、发消息）；
- 查看或导出密码明文、银行卡；
- 改本人验证方式或恢复方式；
- 关掉或绕过保护；
- 删库、转移仓库、把私人仓库改成公开；
- 删除只有一份的数据。

什么时候请本人验证：

- 本人开着无限制授权，就算已经确认是本人，重大的事不再弹验证（约法 L16）。
- 没开无限制授权、而且个人资料不在解锁期内，就先请本人验证一次；解锁期内不再打断。
- 没开无限制授权时，对话里的一句话（包括“别验证了”）不能代替验证。
- 这里说的免验证只适用于受信任的 AI（见[用户授权](/rules/authorization/)）；其他 AI 做重大的事一律先请本人验证。
- 普通聊天、普通干活、查本人的资料来回答问题都不打断；个人资料锁着时，查资料仍要先按[个人资料与数据处理](/rules/privacy-data/)请本人解锁。是不是重大看实际后果，不按“密码”“删除”“私人”这类字眼判断：普通源码编辑、测试、定向提交和正常推送、规则发布、能重建的生成物清理都不算。

## 重大动作前的把关

重大的事动手前，由够格的模型把一遍关：确认这确实是本人要的、目标和影响都对、需要本人验证时先请本人验证。够格的模型：Claude 用 Opus 的中档（medium）以上；GPT 用模型清单（`E:/.agents/config/model-roster.json`）中 Sol、Astra 的 high 及以上档，具体型号见清单。根会话够格就自己判断；不够格就派一个够格的子代理只做这一次判断，不实施、也不再委派。把关没完成时，只停这一个不可撤回的最后一步，其他思考、可撤回的工作、修复和测试照常。

把关和“重大的事要独立复核”（约法 L22）是两回事：把关只管动手前这一步做不做、要不要请本人验证；独立复核管一项重大改动或决定本身对不对，由另一个独立的上下文看原始材料重新检查，做法见[分工与并行施工](/rules/execution-coordination/)。

::screen{#rule-protected-actions-08 section="original"}

```typeset
{
 "screen": {
  "id": "rule-protected-actions-08",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.protected-actions.md",
   "release": "E331",
   "sha256": "03675781035e4fd1942f4f45b9f7a8c910c94421cd21e9a414e0fa1198046f73",
   "public_sha256": "941bf9f832b34c8aaf2a4088613a950112b7d8dd5f9466ade6d5b706d42939f3",
   "from": "## GitHub 重大动作",
   "to": null,
   "start": 1019,
   "end": 2376,
   "approved_omissions": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## GitHub 重大动作”和它下面三段；右卡放“## 本人验证方式”“## 各产品各管各的”两节。",
  "portrait": "竖版 9:16：“原文 · E230 版 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-protected-actions/rule-protected-actions-08",
  "source_logical_id": "protected_actions_contract",
  "source_public_sha256": "941bf9f832b34c8aaf2a4088613a950112b7d8dd5f9466ade6d5b706d42939f3",
  "source_rule_part": "rule-protected-actions/rule-protected-actions-08"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E331版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "GitHub 重大动作"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "本人验证方式"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和技能名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## GitHub 重大动作”和它下面三段；右卡放“## 本人验证方式”“## 各产品各管各的”两节。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，不换成活动E210；上方版本小字；横等宽两大卡，07左到验证五条、右把关两段，08左GitHub三段、右验证方式和各产品同卡；竖整篇一张外卡。whole_block现已实现内h1/h2小题不拆卡、不画毛笔章题。无插画、图标或连线。；续屏版本标签明确 E214，标签不属于规则正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "原文·E331版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "GitHub 重大动作"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\page.json",
   "source_sha256": "8bc1977d436a73cebb618fb2762303a3ccf5345022fe1673ca71ee2cfe52a81e",
   "source_component_order": [
    "section_heading",
    "source_text_card",
    "prose",
    "monospace"
   ],
   "source_layout": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。E214原文，不换成活动E210；上方版本小字；横等宽两大卡，07左到验证五条、右把关两段，08左GitHub三段、右验证方式和各产品同卡；竖整篇一张外卡。whole_block现已实现内h1/h2小题不拆卡、不画毛笔章题。无插画、图标或连线。；续屏版本标签明确 E214，标签不属于规则正文。"
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
   "asset": "rule-protected-actions/rule-protected-actions-08-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-51022da84156910de666",
   "title_text": "GitHub 重大动作",
   "sha256": "28879893def69a0560438515a128b797df05b1b260fd651a46bab33fb0888842",
   "status": "ready",
   "source_box": [
    44,
    84,
    522,
    168
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
   "asset": "rule-protected-actions/rule-protected-actions-08-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4f37d5aa8678360fc289",
   "title_text": "本人验证方式",
   "sha256": "f02bd064e735f9f840ee1339adac273039b8849f9e7161e56ac447138b12801d",
   "status": "ready",
   "source_box": [
    853,
    86,
    1211,
    168
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
   "asset": "rule-protected-actions/rule-protected-actions-08-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-protected-actions\\img\\rule-protected-actions-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-21fa38b90b2251dc944d",
   "title_text": "各产品各管各的",
   "sha256": "2aa33f39d1e29569b9960ff6edc0b35305151c1d98ef9681dc08d224f2791ab3",
   "status": "ready",
   "source_box": [
    855,
    682,
    1263,
    766
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E331 版 · 续

## GitHub 重大动作

GitHub 的删除仓库、转移仓库、把非公开仓库改成公开，按约法 L17 的专门规则执行：开着有效无限制授权时不重复弹本人验证，否则验证一次，个人资料是否解锁不影响这一条。新建公开仓库只需本人明确同意，不另做一次身份验证；对外发布和第一次公开发布仍须本人明确同意。向已有公开仓库正常推送按 Git 收尾长期授权直接做，不重复请示。

合并主线、内容已有保留的本地或远端分支和标签删除、核对过不丢提交的历史改写（含强制推送）、分支或仓库改名、新建本人 GitHub 私有仓库、把公开仓库改为私有、改默认分支、把远端改成本人 GitHub 账号下的仓库，都是普通收尾，直接做，不请本人验证，也不逐项向本人报告技术细节。程序在删除或改写前自动核对旧提交仍由其他本地或 GitHub 分支、标签保留；检查不过就停止并说明原因，不改成找本人验证。可能丢提交的强制推送仍须本人明确同意。改名时一并更新 PCConfig 的仓库位置登记（`registries/repository-paths.json`）和真实调用方。

删库和转移前，AI 先自动确认本地副本是全的：所有分支都在本地，缺的先拉下来；并把只在 GitHub 网页上的东西（例如 issue、发布包）列给本人看。执行入口是 `project-entry-gate` 技能的 `Invoke-ProtectedGitHubMajorAction.ps1`：有有效无限制授权时直接执行已授权的动作，否则调用密码中心的 `Invoke-SecretBroker.ps1 -Action VerifyAuthority` 验证一次；普通 Git 收尾不调用密码中心。回执的 `highest_authority_verified` 表示权限核验结果，`human_factor_performed` 如实区分本次真人验证和复用授权，不能把复用说成刚做过一次真人验证。真正销毁唯一数据仍按明确同意和重大动作的规则处理，不作为普通清理的自动回退。

## 本人验证方式

一共四种：通行密钥（Passkey）、手机验证码（TOTP）、恢复码、Google 或微软账号。任一种已登记、能正常用的方式成功就算完成。

- 本人没指定方式时，一种坏了不挡住其他正常的方式，坏的如实说明。
- 本人指定了某种方式而它坏了，就修好这种方式；暂时修不好就说清原因，不擅自换别的方式。
- 取消、拒绝或超时只结束这一次，不自动重试；软件故障和这些情况分开说。
- 四种都丢了时，AI 不自己建立新的验证方式。
- Windows 登录密码、PIN 和生物识别不是这四种之一。
- 改了本人验证的方式（验证因子、请求窗口或相关入口），就请本人实际验证一次；代码测试和模拟不能冒充本人验证。

请本人验证、锁定资料等具体操作，走 `local-secret-broker` 技能里的现行入口。

## 各产品各管各的

密码中心（SecretBroker）、本人验证和 BitLocker 各按自己的现役入口办。规则读取、发布、哈希校验或 Hook 出故障，不自动锁任何东西，也不读取秘密。规则核验通过只说明规则文件是对的，不说明操作者可信或动作已获允许。
