---
{
 "title": "用户授权",
 "kind": "rule-topic",
 "url": "/rules/authorization/",
 "tagline": "哪些事 AI 直接做，哪些要本人点头。",
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
  "page": "rule-authorization",
  "kind": "rule-topic",
  "title": "用户授权",
  "url": "/rules/authorization/",
  "tagline": "哪些事 AI 直接做，哪些要本人点头。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E325",
   "commit": "5fbf6a12ea23093e7b91748db9abd6866d27f9b4",
   "ruleset_sha256": "5f011f73cb5a4901f93151328d70eea6c9b9ff6d03ff596c26d7a18700a1f893",
   "activated_at": "2026-10-30T04:20:33.726689+08:00",
   "file": "sources/rules/docs/contracts/agents.authorization.md",
   "sha256": "5f8e1e95682b8c293e2f29c0f5b3dcdf3e2e6ba235847d5490c6004aaee227af",
   "public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：小路起点的 AI 助手抱着文件轻快走几步，“直接做”木牌旁的草叶轻轻摇；栅栏门前的信封、硬币和小木箱静静排着，门边的人影抬手，栅栏门缓缓打开一条缝又合上；木桩上的绿色通行证随风轻摆；小桌上的沙漏翻转一次、细沙往下流，旁边的金色钥匙闪一下光；右上角两扇小窗户里亮起柔和的光，中间的绿色盾牌徽章轻轻呼吸；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，小牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E257（北京时间 10 月 11 日 13:02 起生效）",
     "meaning": "原文屏里留作快照的文字依据的规则版本（拼页时原文按当时生效的版本现读，版本由拼页程序标出）",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：release_id=E257，activated_at_utc=2026-10-11T05:02:36.7738409+00:00；原文 sha256=ebed9a644059b0d9a4f8048cad689d58d6faf389432033d4c62178a578d83ba6",
     "screens": [
      "rule-authorization-05"
     ]
    },
    {
     "id": "n-duration",
     "text": "0.5–72 小时；0.5 到 72 小时，可以带小数",
     "meaning": "无限制授权可填的时长范围（默认时长读密码中心当前设置，页面不写具体数）",
     "as_of": "2026-09-29",
     "source": "E190 原文第 37 行；默认时长的读法见 E190 agents.privacy-data.md“个人资料的锁和解锁”一节（duration_policy.default_minutes）；E:\\Projects\\Tools\\PasswordCenter\\tools\\Invoke-OwnerTakeover.ps1 第 53 行 ValidateRange(30,4320) 分钟",
     "screens": [
      "rule-authorization-01",
      "rule-authorization-03",
      "rule-authorization-06"
     ]
    },
    {
     "id": "n-standing-count",
     "text": "现有的五项长期授权",
     "meaning": "原文“现有的长期授权”下列出的五项：Git 收尾、管理员权限、选型号和思考档位、Claude 派 GPT、已经在用的目标继续收尾",
     "as_of": "2026-10-01",
     "source": "E203 docs\\contracts\\agents.authorization.md 第 20–26 行，数列表项",
     "screens": [
      "rule-authorization-02"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Codex、Claude 和它们派出的子代理开工时从活动版本读它。",
     "source": "Invoke-EAgentRulesRelease.ps1 返回的 required_rule_paths.authorization_contract；rules-catalog.json 的 agents.authorization 条目"
    },
    {
     "id": "r-takeover-password-center",
     "with": "password-center",
     "direction": "执行",
     "flow": "无限制授权由密码中心的本人接管窗口（Invoke-OwnerTakeover.ps1 -Operation Open）落地：本人填时长、选“当前对话”或“本机全部对话”，完成一次本人验证后签发，带原截止时间。",
     "source": "E187 原文第 45 行；E:\\Projects\\Tools\\PasswordCenter\\tools\\Invoke-OwnerTakeover.ps1 第 5、53、81–91 行"
    },
    {
     "id": "r-trusted-identity",
     "with": "password-center",
     "direction": "执行",
     "flow": "“受信任的 AI”由密码中心的 SecretBroker 现场核验：沿同一 Windows 账户的父进程链找登记包族的桌面应用本体（Codex：OpenAI.Codex_2p2nqsd0c76g0 的 app/ChatGPT.exe；Claude：Claude_pzs8sxrjxfjjc 的 app/Claude.exe），认出 codex-root 或 claude-root。",
     "source": "E187 原文第 49–53 行；E:\\Projects\\Tools\\PasswordCenter\\tools\\desktop_ai_identity.py 第 17、25–53 行；registries\\highest_authority_principals.json"
    },
    {
     "id": "r-status-page",
     "with": "computer-access",
     "direction": "给出",
     "flow": "无限制授权开没开、截止到几点，个人资料锁没锁，是第 2 批“授权与状态”页要实时显示的状态；本页只讲规则，开头放入口。",
     "source": "owner-decisions.md WZ8（第 641、653 行）：看板显示“个人资料锁没锁、无限制授权开没开”"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/charter/#L15",
     "screen": "rule-authorization-01",
     "text": "L15 哪些事要我明确同意"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-authorization-01",
     "text": "L16 限时的“无限制授权”"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-authorization-01",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/charter/#L17",
     "screen": "rule-authorization-01",
     "text": "约法 L17"
    },
    {
     "target": "/computer-access/",
     "screen": "rule-authorization-01",
     "text": "现在的授权状态 → 授权与状态"
    },
    {
     "target": "/rules/charter/#L15",
     "screen": "rule-authorization-02",
     "text": "约法 L15"
    },
    {
     "target": "/rules/charter/#L10",
     "screen": "rule-authorization-02",
     "text": "约法 L10"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rule-authorization-02",
     "text": "工程与交付"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-authorization-02",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "rule-authorization-03",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-authorization-03",
     "text": "约法 L16"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-authorization-03",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-authorization-03",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/codex-adapter/",
     "screen": "rule-authorization-03",
     "text": "Codex 适配"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-authorization-04",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rule-authorization-05",
     "text": "工程与交付"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-authorization-05",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "rule-authorization-06",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-authorization-06",
     "text": "约法 L16"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-authorization-06",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-authorization-07",
     "text": "重大动作与本人验证"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "开头一屏底部入口〔现在的授权状态 → 授权与状态〕链到 /computer-access/（第 2 批才做）。规则页不强制放入口，是我加的：本人看完规则最想知道的是“现在开着没有”，那个状态的家在授权与状态页。若嫌多余，整条横条删掉即可。已写进 batch2.md。",
    "原文里 6 处 Markdown 链接（工程与交付、分工与并行施工、个人资料与数据处理×2、约法 L16、重大动作与本人验证×2）画成〔〕链接，看得见的字不变；其中“约法 L16”原链到 AGENTS.md 的“四、我的授权与安全”一节，页面上改链到 /rules/charter/#L16。按派活方的决定，这算一字不改。",
    "人话要点里的“公开分级表里的 L1、L2”：原文第 33 行写“收紧 L1/L2 公开内容的限制”，这里的 L1、L2 是个人资料专题公开分级表的等级，不是约法条号；页面上加了括注“不是约法的 L1、L2 条”，依据 agents.privacy-data.md 第 31–32、37 行。",
    "“信任根”：E190 原文加了括注“受信任 AI 的登记或本人验证依据”，第 2 屏照它写成“改信任根（受信任 AI 的登记或本人验证的依据）或授权边界”。",
    "E190 原文把“普通凭据操作”改成“已登记且不属于重大动作的凭据操作”，第 4 屏照改；重大动作能不能沿用已有验证，原文改为统一指向《重大动作与本人验证》，本页不再复述。",
    "原文“公开面”写成“公开地方”；“生成区”写成“自动生成的部分”；“定向提交”写成“只提交这次相关的改动”；“回读”写成“读回核对”；“登记包族”写成“登记过的桌面应用”（在“怎么认出”里写成“应用包”）；“桥接密钥续绑”写成“重新绑定密钥”；“电脑 MCP 登录”写成“经“电脑 MCP”远程操作电脑的登录”；“宿主真实限制”写成“所在 AI 软件（Codex 或 Claude）真实的限制”。",
    "“电脑 MCP 登录”我理解为 AI 经电脑 MCP 服务远程操作某台电脑的会话（依据 agents.privacy-data.md 第 9 行“已认证的电脑 MCP”和电脑 MCP 自带说明“MCP 登录不授予其它电脑或最高权限智能体的身份”）；页面写成“经电脑 MCP 远程操作电脑的登录”。",
    "原文“AI 审批”写成“AI 之间的审批”，“模型路由”写成“选模型的规矩”。",
    "开头“先认几个词”里“本人验证四选一”的四种方式取自约法 L17（E187 AGENTS.md 第 40 行），不在本专题原文里；“重大的事”的例子也取自 L17。",
    "全页用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。",
    "第 2–4 屏人话要点于北京时间 9 月 29 日跟到 E190；原文屏（第 5–7 屏）改为拼页时按当时生效版本现读（shape=source_text），text 里留的仍是 E187 的快照，based_on 也仍记 E187，指的是这份快照。",
    "第 3 屏新加“两样都要时一次验证开两份”一条：原文写的是全局接管入口 Invoke-OwnerTakeover.ps1 -Operation OpenGlobal -GrantPersonalAccess，页面按人话写成“全局接管窗口”，没写命令。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-authorization/page.json",
  "sha256": "110f2fe2f525d833951adc1cbb7962775dc224a2005dd751ebc2c936beb170e5",
  "converted_at_beijing": "2026-10-30T11:19:18+08:00"
 }
}
---

::screen{#rule-authorization-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-authorization-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“用户授权”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题。副标题下面紧接一张浅绿细边圆角大卡片“一句话答案”（卡头一条浅绿底色带，粗体深绿“一句话答案”），卡里三行，每行左边一个圆角标签、右边是这一行的说明（深蓝灰）：“直接做”标签实心绿底白字；“先要本人明确同意”标签浅琥珀底深棕字，标签旁画一个很小的停一下手势；“重大的事另有一关”标签白底深绿描边深绿字，标签旁一枚小绿盾牌。三行之间细虚线分隔。这张卡是本屏最醒目的文字块。卡片下面一行介绍句（深蓝灰，两个约法条目画成链接样式）。再下面一行“跳到：”后面五个圆角小按钮（白底浅绿描边绿字），就是五个跳转链接。右边约 45% 宽一幅水彩插画，照原图不变：一条从左往右的小路，路起点一个小小的 AI 助手（胸前是 Claude 的橙色星芒标志）抱着一叠文件轻快往前走，路边一块绿色小木牌“直接做”；小路中段一道白色小栅栏门，门前排着一个信封、一枚硬币、一只写着向上箭头的小木箱，门柱上挂小牌“要本人点头”，门边站着一个人影（只画背影）抬手示意；栅栏门旁边的木桩上挂一张绿色长条通行证，写“长期授权”；小路尽头一张小桌上立着一个沙漏，沙漏旁一把金色钥匙，沙漏底座刻“0.5–72 小时”；画面右上角两扇并排的小窗户，左窗角 OpenAI 黑色花结标志、右窗角 Claude 橙色星芒标志，中间一枚绿色盾牌徽章写“受信任”。插画里只有这五处小牌子上有字，text 里“直接做　要本人点头　长期授权　0.5–72 小时　受信任”这一行就是这五处的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“现在开没开无限制授权、个人资料锁没锁：”，右边一个显眼的按钮〔现在的授权状态 → 授权与状态〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；“一句话答案”卡片整宽（三行改成每行标签在上、说明在下）；水彩插画（同横版，缩成整宽一幅，五处小牌子的字不变）；介绍句；“跳到：”五个按钮排三行、每行两个（最后一行一个居中）；最下面“授权与状态”横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/#p-decide"
   },
   {
    "text": "L15 哪些事要我明确同意",
    "href": "/rules/charter/#L15"
   },
   {
    "text": "L16 限时的“无限制授权”",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "直接做的和要同意的",
    "href": "/rules/authorization/#p-direct"
   },
   {
    "text": "长期授权",
    "href": "/rules/authorization/#p-standing"
   },
   {
    "text": "子代理和项目规则不扩权",
    "href": "/rules/authorization/#p-no-expand"
   },
   {
    "text": "无限制授权",
    "href": "/rules/authorization/#p-unrestricted"
   },
   {
    "text": "受信任的 AI",
    "href": "/rules/authorization/#p-trusted"
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
     "text_ref": "用户授权",
     "align": "left",
     "row": "intro",
     "width": "55%",
     "size": "large",
     "asset": "rule-authorization\\rule-authorization-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-01-h.png",
     "source_box": [
      21,
      6,
      643,
      187
     ],
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "text_ref": "哪些事AI直接做、哪些要本人点头；说过一次就一直算数的授权有哪些；限时的“无限制授权”怎么开。",
     "size": "large",
     "bold": true,
     "row": "intro"
    },
    {
     "type": "points_card",
     "text_ref": "一句话答案",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "intro",
     "header_icon": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "这是Codex和Claude共用的授权规则，是约法L15哪些事要我明确同意和L16限时的“无限制授权”的细则。",
     "row": "intro"
    },
    {
     "type": "illustration",
     "row": "intro",
     "width": "45%"
    },
    {
     "type": "action_button",
     "text_ref": "跳到：直接做的和要同意的长期授权子代理和项目规则不扩权无限制授权受信任的AI",
     "columns": 5
    },
    {
     "type": "tag",
     "text_ref": "直接做要本人点头长期授权0.5–72小时受信任",
     "separator": "　",
     "columns": 5,
     "align": "center",
     "size": "small",
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "现在开没开无限制授权、个人资料锁没锁：现在的授权状态→授权与状态"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。 本轮 qa12a：介绍区保持左文右图两栏；跳转按钮移出 intro 整宽五列，定稿五短词完整保留并改成等列标签，手机两列，不删字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-01",
    "component_order": [
     "chapter_title",
     "prose",
     "content_card",
     "tag",
     "bullet_list",
     "inline_link",
     "action_button",
     "illustration"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "用户授权",
     "align": "left",
     "size": "large",
     "asset": "rule-authorization\\rule-authorization-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-01-h.png",
     "source_box": [
      21,
      6,
      643,
      187
     ]
    },
    {
     "type": "prose",
     "text_ref": "哪些事AI直接做、哪些要本人点头；说过一次就一直算数的授权有哪些；限时的“无限制授权”怎么开。",
     "size": "large",
     "bold": true
    },
    {
     "type": "points_card",
     "text_ref": "一句话答案",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "illustration"
    },
    {
     "type": "prose",
     "text_ref": "这是Codex和Claude共用的授权规则，是约法L15哪些事要我明确同意和L16限时的“无限制授权”的细则。"
    },
    {
     "type": "action_button",
     "text_ref": "跳到：直接做的和要同意的长期授权子代理和项目规则不扩权无限制授权受信任的AI",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "tag",
     "text_ref": "直接做要本人点头长期授权0.5–72小时受信任",
     "separator": "　",
     "columns": 2,
     "align": "center",
     "size": "small",
     "columns_v": 2,
     "textless": true
    },
    {
     "type": "notice",
     "text_ref": "现在开没开无限制授权、个人资料锁没锁：现在的授权状态→授权与状态"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。 本轮 qa12a：介绍区保持左文右图两栏；跳转按钮移出 intro 整宽五列，定稿五短词完整保留并改成等列标签，手机两列，不删字。\nQA12压小图复核后微调：原标点一并提升卡头、续张编号沿用卡外左侧、长按钮手机单列、边界标题栏居中，均用现有接口，不删原字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-01",
    "component_order": [
     "chapter_title",
     "content_card",
     "tag",
     "illustration",
     "action_button",
     "prose",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "source_phrase": "一句话答案\n直接做：本人给的范围内，本机普通、能撤回的读取、编辑、测试和验证；本人长期授权过的五项（Git收尾、申请管理员权限、选型号和档位、Claude派Sol和Luna、在用的目标继续收尾）也不用再问。先要本人明确同意：发消息、对外发布、花钱、删除只有一份的数据、撤不回的迁移、项目第一次公开发布。同意过的，也不自动扩到第一次新建的目标、别的账号或新的公开地方。重大的事另有一关：例如删库、查看密码明文、把私人资料发到外面，动手前先把关、看要不要请本人验证，见重大动作与本人验证。",
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
   "asset": "_library/illustrations/授权通行路径.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "授权通行路径",
   "source_phrase": "右边约 45% 宽一幅水彩插画，照原图不变：一条从左往右的小路，路起点一个小小的 AI 助手（胸前是 Claude 的橙色星芒标志）抱着一叠文件轻快往前走，路边一块绿色小木牌“直接做”；小路中段一道白色小栅栏门，门前排着一个信封、一枚硬币、一只写着向上箭头的小木箱，门柱上挂小牌“要本人点头”，门边站着一个人影（只画背影）抬手示意；栅栏门旁边的木桩上挂一张绿色长条通行证，写“长期授权”；小路尽头一张小桌上立着一个沙漏，沙漏旁一把金色钥匙，沙漏底座刻“0.5–72 小时”；画面右上角两扇并排的小窗户，左窗角 OpenAI 黑色花结标志、右窗角 Claude 橙色星芒标志，中间一枚绿色盾牌徽章写“受信任”。",
   "sha256": "d2c1840b26e431381d3ef74f34506abe810a27ce9a49d4cef5b946f1e0ef4cc5",
   "status": "ready",
   "original_elements": [
    "右边约 45% 宽一幅水彩插画，照原图不变：一条从左往右的小路，路起点一个小小的 AI 助手（胸前是 Claude 的橙色星芒标志）抱着一叠文件轻快往前走，路边一块绿色小木牌抽象图形；小路中段一道白色小栅栏门，门前排着一个信封、一枚硬币、一只写着向上箭头的小木箱，门柱上挂小牌抽象图形，门边站着一个人影（只画背影）抬手示意；栅栏门旁边的木桩上挂一张绿色长条通行证，画抽象短线的；小路尽头一张小桌上立着一个沙漏，沙漏旁一把金色钥匙，沙漏底座刻抽象图形；画面右上角两扇并排的小窗户，左窗角 OpenAI 黑色花结标志、右窗角 Claude 橙色星芒标志，中间一枚绿色盾牌徽章画抽象短线的"
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
   "asset": "rule-authorization/rule-authorization-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d23365471633404d9c55",
   "title_text": "用户授权",
   "sha256": "220adfe5e21b50085bb014d597fe03d2b046110cde3eb749782f2d89304e209c",
   "status": "ready",
   "source_box": [
    21,
    6,
    643,
    187
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 用户授权

**哪些事 AI 直接做、哪些要本人点头；说过一次就一直算数的授权有哪些；限时的“无限制授权”怎么开。**

**一句话答案**
- **直接做**：本人给的范围内，本机普通、能撤回的读取、编辑、测试和验证；本人长期授权过的五项（Git 收尾、申请管理员权限、选型号和档位、Claude 派 Sol 和 Luna、在用的目标继续收尾）也不用再问。
- **先要本人明确同意**：发消息、对外发布、花钱、删除只有一份的数据、撤不回的迁移、项目第一次公开发布。同意过的，也不自动扩到第一次新建的目标、别的账号或新的公开地方。
- **重大的事另有一关**：例如删库、查看密码明文、把私人资料发到外面，动手前先把关、看要不要请本人验证，见〔重大动作与本人验证〕。

这是 Codex 和 Claude 共用的授权规则，是约法〔L15 哪些事要我明确同意〕和〔L16 限时的“无限制授权”〕的细则。

跳到：〔直接做的和要同意的〕〔长期授权〕〔子代理和项目规则不扩权〕〔无限制授权〕〔受信任的 AI〕

直接做　要本人点头　长期授权　0.5–72 小时　受信任

现在开没开无限制授权、个人资料锁没锁：〔现在的授权状态 → 授权与状态〕

::screen{#rule-authorization-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-authorization-02",
  "section": "points",
  "title": "人话要点：直接做，还是先问本人",
  "scene": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。这一屏整屏画成“直接做 / 先要本人明确同意”的左右对照图。左上一行深绿大字是本屏的“## …”标题（井号不画）。标题下面左右两大栏等宽等高，中间一道浅绿细竖线分开、竖线正中一个小圆标“还是”（这两个字不画，竖线中间只画一个小小的岔路路标图标）：左栏卡头一条实心绿色底色带，白色粗体“直接做”，卡头左端一个白色对勾小圆章；右栏卡头一条浅琥珀色底色带，深棕粗体“先要本人明确同意”，卡头左端一道半开的白色小栅栏门图标（和开头插画同一道门）。两栏里每条要点前一个小圆点（左栏绿点、右栏琥珀点），正文深蓝灰；右栏第三条（“已经在用的目标可以继续收尾，但这些仍要本人明确同意：……”）画在右栏底部一个浅黄底小框里，框左边一个小小的停止手势图标。两栏下面一张贯通全宽的白底细浅绿描边圆角卡“怎样算同意、什么时候重新判断”（卡头浅绿底色带、深绿粗体，左上角小水彩图标：一把尺子量一张纸），四条要点排成左右两列、每列两条。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；“直接做”整宽卡（绿色卡头）；“先要本人明确同意”整宽卡（琥珀卡头，浅黄小框在卡底）；“怎样算同意、什么时候重新判断”整宽卡，四条一行一条。字和横版完全一样。字多时在完整卡片之间拆成 -v（前两张卡）、-v2（第三张卡）。",
  "links": [
   {
    "text": "约法 L10",
    "href": "/rules/charter/#L10"
   },
   {
    "text": "约法 L15",
    "href": "/rules/charter/#L15"
   }
  ],
  "anchors": [
   {
    "id": "p-direct",
    "text": "人话要点 · 直接做，还是先问本人"
   },
   {
    "id": "p-direct-do",
    "text": "直接做"
   },
   {
    "id": "p-consent",
    "text": "先要本人明确同意"
   },
   {
    "id": "p-consent-scope",
    "text": "怎样算同意、什么时候重新判断"
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
     "text_ref": "人话要点·直接做，还是先问本人",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "直接做",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "choice",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "先要本人明确同意",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "tone": "yellow",
     "row": "choice",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "怎样算同意、什么时候重新判断",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "last_inner_columns": 2
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-02",
    "component_order": [
     "chapter_title",
     "prose",
     "comparison",
     "points_card",
     "monospace",
     "section_heading",
     "bullet_list",
     "icon",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·直接做，还是先问本人",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "直接做",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "先要本人明确同意",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "tone": "yellow"
    },
    {
     "type": "points_card",
     "text_ref": "怎样算同意、什么时候重新判断",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "last_inner_columns": 2,
     "page_break_before": true
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 原竖图有指定分张/分组边界，当前核心按高度自动分张，未声称精确边界完成。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-02",
    "component_order": [
     "section_heading",
     "prose",
     "chapter_title",
     "comparison",
     "points_card",
     "monospace",
     "bullet_list",
     "icon",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "和开头插画同一道门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
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
   "asset": "_library/titles/title-6319591a9a1ce9966831.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6319591a9a1ce9966831",
   "title_text": "人话要点 · 直接做，还是先问本人",
   "sha256": "fd28077b2e2421cd1fa5e5d79490bda21828f9a50f66571140cc881cde3bba35",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 直接做，还是先问本人

### 直接做
- 在本人给的范围内，本机上普通、能撤回的读取、编辑、测试和验证，AI 直接做，不一步步问。
- 本人长期授权过的事，在原来的范围内直接做，不用本人再说一遍（五项见下一屏）。
- 授权已经覆盖、目标和前提都成立时，直接真调用一次工具，不先猜平台会拒绝就自己停下。
- 工具真的拒绝、要求再验证、用不了或报错，就照真实结果处理和报告；不假装成功，也不盲目重试。
- 没理由少做、缩小能力、反复要授权、把不归本人的问题推回给本人，和越界一样是错（〔约法 L10〕）。

### 先要本人明确同意
- 发消息、对外发布、花钱、删除只有一份的数据、做撤不回的迁移（〔约法 L15〕）。
- 项目还没发布过 Release（正式发布版本）时，第一次公开发布；本人只是让 AI 一般地更新、完善或“保持最新”，不算同意首次发布。
- 已经在用的目标可以继续收尾。下面三件也算普通 Git 收尾，核对后直接做，不用另问：新建本人 GitHub 名下的私有仓库；把远端改成本人 GitHub 账号下的仓库；先核对过旧提交都有别的分支或标签保留、不会丢的历史改写（含强制推送）。除此以外，这些仍要本人明确同意：第一次新建或选用别的外部目标、新的公开或部署目标，花钱，撤不回的迁移，可能丢提交的强制推送，改信任根（受信任 AI 的登记或本人验证的依据）或授权边界。

### 怎样算同意、什么时候重新判断
- 本人那句话已经说清对象、内容和动作，就算同意；但这份同意不会自动扩到第一次新建的目标、别的账号、新的公开地方或别的任务。
- 能调用某个工具，不等于有授权；真要扩大到新的账号、公开地方、花费或撤不回的影响时，重新判断。
- 存放位置可信，不等于可以往里写；按公开分级能公开，也不等于可以发布。
- Windows 管理员权限、个人资料解锁、几个任务之间的协调，都不是本人的授权。

::screen{#rule-authorization-08 section="points"}

```typeset
{
 "screen": {
  "id": "rule-authorization-08",
  "section": "points",
  "title": "人话要点：长期授权",
  "scene": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面两张圆角卡片（白底、浅绿细边），小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。左边约 36% 宽一张卡“长期授权怎么算”，左上角小水彩图标：一张绿色长条通行证（和开头插画木桩上那张同一张），卡片下半留一小幅水彩插画：通行证挂在木桩上随风轻摆，旁边一串挂着五把小钥匙的钥匙圈，插画里不写字。右边约 64% 宽一张卡“现有的五项长期授权”，左上角小水彩图标：一串挂着五把小钥匙的钥匙圈；卡里五项一行一条，每条开头一把小钥匙代替圆点，粗体小标题“Git 收尾”“申请管理员权限”“选型号和思考档位”“Claude 派 Sol 和 Luna”“在用的目标继续收尾”用深绿，后面说明深蓝灰。其余要点前一个小绿圆点；**…** 是粗体，星号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽（先“长期授权怎么算”，插画缩成卡底一条；后“现有的五项长期授权”）。字和横版完全一样。字多时在两张卡之间拆成 -v、-v2。",
  "links": [
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   }
  ],
  "anchors": [
   {
    "id": "p-standing",
    "text": "人话要点 · 长期授权：说过一次就一直算数"
   },
   {
    "id": "p-standing-how",
    "text": "长期授权怎么算"
   },
   {
    "id": "p-standing-list",
    "text": "现有的五项长期授权"
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
     "text_ref": "人话要点·长期授权：说过一次就一直算数",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "长期授权怎么算",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "auto",
     "icon_position": "none",
     "row": "standing",
     "width": "36%",
     "items_layout": {
      "icon_position": "upper_right_inside"
     },
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-d12f8aab81c0b535c95b.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "现有的五项长期授权",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "standing",
     "width": "64%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。 本轮 qa12a：该卡小插画改现有 items_layout.icon_position=upper_right_inside，正文整宽；审页的05受信任卡按文字定位实为当前04。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-08",
    "component_order": [
     "chapter_title",
     "illustration",
     "points_card",
     "section_heading",
     "icon",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·长期授权：说过一次就一直算数",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "长期授权怎么算",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "auto",
     "icon_position": "none",
     "items_layout": {
      "icon_position": "upper_right_inside"
     },
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-d12f8aab81c0b535c95b.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "现有的五项长期授权",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "page_break_before": true
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。 原竖图有指定分张/分组边界，当前核心按高度自动分张，未声称精确边界完成。 本轮 qa12a：该卡小插画改现有 items_layout.icon_position=upper_right_inside，正文整宽；审页的05受信任卡按文字定位实为当前04。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-08",
    "component_order": [
     "illustration",
     "chapter_title",
     "points_card",
     "section_heading",
     "icon",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "source_phrase": "一张绿色长条通行证（和开头插画木桩上那张同一张",
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
   "asset": "_library/fix-round-2/icon-clean-d12f8aab81c0b535c95b.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-ad17cb8bec4c97",
   "source_phrase": "左边约 36% 宽一张卡“长期授权怎么算”，左上角小水彩图标：一张绿色长条通行证（和开头插画木桩上那张同一张），卡片下半留一小幅水彩插画：通行证挂在木桩上随风轻摆，旁边一串挂着五把小钥匙的钥匙圈，插画里不写字。",
   "sha256": "74f7debe37628d89d9f12931a735f4e8a418a9b973c980e1fd4f4970da0b02b7",
   "status": "ready",
   "original_elements": [
    "通行证挂在木桩上随风轻摆，旁边一串挂着五把小钥匙的钥匙圈，插画里不写字"
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
   "asset": "_library/titles/title-2511a82a5300fc24b226.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-2511a82a5300fc24b226",
   "title_text": "人话要点 · 长期授权：说过一次就一直算数",
   "sha256": "1f42f9533f259df7c7f2f97631575dd4955937ea0b457795071a0362ccb35203",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 长期授权：说过一次就一直算数

### 长期授权怎么算
- 本人明确说过、长期有效的同意，在原来的范围内一直有效，直到本人撤回。
- 换一轮对话、上下文被压缩、在 Codex 和 Claude 之间、交给子代理或新任务，都照样有效；不要求本人在当前消息里再说一遍。
- AI 的推断、习惯、模板、标题、以前的做法和项目规则，都不能产生长期授权，也不能把已有的长期授权说成没有。

### 现有的五项长期授权
- **Git 收尾**：授权在仓库里干活，就包括验证后只提交这次相关的改动、正常推送（细则见〔工程与交付〕）。新建本人 GitHub 私有仓库、把远端改成本人 GitHub 账号下的仓库、核对过不丢提交的历史改写（含强制推送），也都属于这项普通收尾；可能丢提交的强制推送不在里面。
- **申请管理员权限**：需要时直接用 sudo 或 Windows 的 UAC 弹窗申请提权，时机由 AI 安排，不因此推迟已授权的工作，也不把普通的提权步骤当成产品问题请本人定；只有本人、上级规则或适用的项目规则明确说不提权时才不提。这项授权子代理也一样能用：后台没有窗口、弹不出 UAC 的任务，系统支持时直接静默提权；只有确实要本人在场点确认的那一步，才交回主对话安排，而不是整件事停下来等。提权只让命令拿到 Windows 的写权限，不产生、也不扩大做事的授权；改权限设置、撤回快照、重大的事仍按各自的规矩办。
- **选型号和思考档位**：AI 按质量和总花费自己选，质量需要时可以比主对话或派它的 AI 用更强的型号、更高的档位，不逐次问（见〔分工与并行施工〕）；本人这次明确限定的型号、档位、预算或厂商优先。
- **Claude 派 Sol 和 Luna**：GPT-6.1 Sol、GPT-6 Luna 不用本人另外授权就可以直接派；GPT-6 Astra 仍按本人给当前对话或项目的授权。派出去的只做交给它的任务。
- **在用的目标继续收尾**：本人授权前就已登记、现在仍在用的仓库、网站和发布目标，验证、发布、部署、读回核对和同步默认接着做；本人说只留本地或不发布时除外。上面三种 GitHub 普通收尾同样直接做；其余第一次新建的外部目标、新公开或部署目标、花钱、可能丢提交的强推等例外，见上一屏“先要本人明确同意”。

::screen{#rule-authorization-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-authorization-03",
  "section": "points",
  "title": "人话要点：无限制授权怎么开、开着时怎样、子代理和项目规则",
  "scene": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上一行深绿大字是本屏的“## …”标题（井号不画）。标题下面第一块是一张贯通全宽的浅绿底圆角卡“无限制授权怎么开”（卡头深绿粗体），卡里最上面把那一行带“→”的步骤画成一条从左到右的五格流程：五个白底细绿描边的圆角小格，格与格之间一支绿色箭头（“→”就画成这支箭头，不另写），每格左上一个小水彩图标：本人说要开配一个说话的小气泡；AI 打开本人接管窗口配一扇弹出的小窗口（窗口里只画一个空的时长输入框和一个指纹图标，不写字）；本人填时长、选范围配一个沙漏和一个二选一的小开关；本人验证一次配开头插画里那把金色钥匙；生效到原截止时间配一只小闹钟。流程下面是这张卡的五条要点，排成左右两列（左三右二）。全宽卡下面左右两张圆角卡片（白底、浅绿细边），小标题画在卡片顶上一条浅绿底色带里、深绿粗体：左边约 55% 宽“开着时怎样”（图标：一个沙漏和一把金色钥匙）；右边约 45% 宽“子代理和项目规则不扩权”（图标：一个大圆里套着一个小圆的同心圆，小圆只能在大圆里面）。卡片里每条要点前一个小绿圆点，正文深蓝灰；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上；“无限制授权怎么开”整宽卡，五格流程改成从上往下五格、格间向下箭头，下面五条要点一行一条；然后“开着时怎样”“子代理和项目规则不扩权”两张整宽卡。字和横版完全一样。字多时在完整卡片之间拆屏：-v 放标题和“无限制授权怎么开”，-v2 放后两张卡。",
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
    "text": "约法 L16",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/#p-classification"
   }
  ],
  "anchors": [
   {
    "id": "p-unrestricted",
    "text": "人话要点 · 无限制授权、子代理和项目规则"
   },
   {
    "id": "p-open",
    "text": "无限制授权怎么开"
   },
   {
    "id": "p-unrestricted-rules",
    "text": "开着时怎样"
   },
   {
    "id": "p-no-expand",
    "text": "子代理和项目规则不扩权"
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
     "text_ref": "人话要点·无限制授权、子代理和项目规则",
     "align": "center",
     "size": "large"
    },
    {
     "type": "section_heading",
     "text_ref": "无限制授权怎么开",
     "align": "left",
     "size": "medium",
     "frame": "authorization-opening"
    },
    {
     "type": "topology",
     "text_ref": "本人说要开→AI打开密码中心的本人接管窗口→本人填时长、选范围→本人验证一次→生效到原截止时间",
     "layout": "chain",
     "split_arrows": true,
     "connector": "none",
     "frame": "authorization-opening"
    },
    {
     "type": "bullet_list",
     "text_ref": "本人要开始、验收或重试时，AI直接打开这个窗口；打开前不需要先有别的授权、登记或模型判断。密码中心是本机管密码、凭据和本人验证的程序。时长0",
     "columns": 2,
     "frame": "authorization-opening"
    },
    {
     "type": "points_card",
     "text_ref": "开着时怎样",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "limits",
     "width": "55%"
    },
    {
     "type": "points_card",
     "text_ref": "子代理和项目规则不扩权",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "limits",
     "width": "45%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-03",
    "component_order": [
     "chapter_title",
     "prose",
     "points_card",
     "section_heading",
     "flow",
     "icon",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·无限制授权、子代理和项目规则",
     "align": "center",
     "size": "large"
    },
    {
     "type": "section_heading",
     "text_ref": "无限制授权怎么开",
     "align": "left",
     "size": "medium",
     "row": "opening-card",
     "row_v": true,
     "frame": "authorization-opening"
    },
    {
     "type": "topology",
     "text_ref": "本人说要开→AI打开密码中心的本人接管窗口→本人填时长、选范围→本人验证一次→生效到原截止时间",
     "layout": "chain",
     "split_arrows": true,
     "connector": "none",
     "row": "opening-card",
     "row_v": true,
     "frame": "authorization-opening"
    },
    {
     "type": "bullet_list",
     "text_ref": "本人要开始、验收或重试时，AI直接打开这个窗口；打开前不需要先有别的授权、登记或模型判断。密码中心是本机管密码、凭据和本人验证的程序。时长0",
     "columns": 2,
     "row": "opening-card",
     "row_v": true,
     "frame": "authorization-opening"
    },
    {
     "type": "points_card",
     "text_ref": "开着时怎样",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "page_break_before": true
    },
    {
     "type": "points_card",
     "text_ref": "子代理和项目规则不扩权",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 原竖图有指定分张/分组边界，当前核心按高度自动分张，未声称精确边界完成。 首轮G5切开链接后，将开授权的标题、五格流程、要点绑定为同一竖版行组，禁止核心在其内部寻找分张切口；不更改正文与字号。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-03",
    "component_order": [
     "flow",
     "bullet_list",
     "prose",
     "chapter_title",
     "points_card",
     "section_heading",
     "icon",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一个空的时长输入框和一个指纹图标，不写字）",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
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
   "source_phrase": "里那把金色钥匙",
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
   "asset": "_library/titles/title-ee350c3348bac7f49534.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ee350c3348bac7f49534",
   "title_text": "人话要点 · 无限制授权、子代理和项目规则",
   "sha256": "234ade6e34a1c02aa6e85e9e0ce7f94e64b1e8aa4fe86d819b59bfea6aa4bc50",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 无限制授权、子代理和项目规则

### 无限制授权怎么开
本人说要开 → AI 打开密码中心的本人接管窗口 → 本人填时长、选范围 → 本人验证一次 → 生效到原截止时间
- 本人要开始、验收或重试时，AI 直接打开这个窗口；打开前不需要先有别的授权、登记或模型判断。密码中心是本机管密码、凭据和本人验证的程序。
- 时长 0.5 到 72 小时，可以带小数；新开时默认填多久，读密码中心当前的设置，不写死出厂的 8 小时。默认只管当前对话，要全局生效须本人明确选。
- 本人验证四选一：通行密钥、手机验证码、恢复码、Google 或微软账号。验证成功前没有接管权限；成功后只用这一份授权和它原来的截止时间，不自动顺延，也不因为后来改了默认时长就跟着延长。
- 本人明确说两样都要时，全局接管窗口可以用同一次本人验证，同时开出全局的无限制授权和个人资料解锁期；两份各有各的截止时间，只成功一样或结果不明时照实分开说，不另开第二次验证。只管当前对话的接管不带这个组合。
- 新对话、别的 AI、别的电脑，不会因为共用一台设备就接手只管某个对话的授权。Codex 和 Claude 各自怎么调用，见〔Claude 适配〕和〔Codex 适配〕。

### 开着时怎样
- 无限制授权也叫紧急授权、本人接管（〔约法 L16〕）：在本人定的范围和时间里，本人的明确指令优先于 AI 自己的规则、项目限制、选模型的规矩和 AI 之间的审批；不另查厂商或型号够不够格，也不要求某个指定模型批准。
- AI 仍要说真话、提更好的方案、说清具体风险和别的任务正在做什么；本人了解后仍坚持的，就照做，AI 自己做好相称的协调、保全和恢复。
- 工具的真实能力、验证方式、期限和执行结果，都不能伪造。
- 看到无限制授权或资料解锁期的截止时间，不因此赶工或少做验证；真要用权限时已经过期，就请本人续期，续期前不用过期的权限。
- 开着它就算已经确认是本人；重大动作怎么用它，见〔重大动作与本人验证〕。
- 它和个人资料解锁期（本人验证一次后能用私人资料的那段时间）是两件独立的事：开着无限制授权不会自动打开个人资料，资料解锁期也不会带出或延长无限制授权。

### 子代理和项目规则不扩权
- 子代理和后续任务的业务范围、授权、沙箱（能碰哪些文件和命令）和资料访问，只取本人的授权、派它的 AI 的授权、适用的规则、所在 AI 软件（Codex 或 Claude）真实的限制四样都允许的部分，不能更大。
- 派出去、工具看得见、提了权，或者“子代理提议、主对话动手”，都绕不过这个动作本身要的授权。
- 交给子代理的只是完成任务要用的内容，不扩散秘密或无关资料。
- 项目规则管项目里的业务、命令、测试、兼容和自动生成的部分，可以在项目里把做法收紧。
- 但项目、AI、技能、模板和历史文档都不能产生授权，也不能把本人已有的长期授权降为没有，或要本人重说一遍。
- 公开分级表里的 L1、L2（本人的姓名、履历这类普通资料等，默认公开不设限；不是约法的 L1、L2 条），项目想给它们加公开限制，要同时有真实的项目需要，和本人对这个项目、这个范围的明确指示（分级表见〔个人资料与数据处理〕）。

::screen{#rule-authorization-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-authorization-04",
  "section": "points",
  "title": "人话要点：受信任的 AI",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“哪两个、能免什么”配两扇并排的小窗户，左窗角 OpenAI 黑色花结、右窗角 Claude 橙色星芒（和开头插画同一组），中间绿色盾牌徽章不写字；“怎么认出是桌面版”配一条从小方块一格一格往上连到一扇大窗户的虚线链条，旁边一只放大镜。卡片里每条要点前一个小绿圆点，正文深蓝灰；**…** 是粗体，星号不画。两张卡左右并排：左“哪两个、能免什么”约 45% 宽，右“怎么认出是桌面版”约 55% 宽。右卡下方留一条窄窄的水彩插画带：一串小方块（表示进程）用绿色虚线一格一格往上连，最上面是一扇画着 Claude 星芒的大窗户，链条旁边放大镜照着；插画带里不写字。codex app-server 用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，右卡下面的进程链插画带放在最后。字和横版完全一样。",
  "links": [
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/",
    "orientations": [
     "v"
    ]
   }
  ],
  "anchors": [
   {
    "id": "p-trusted",
    "text": "受信任的 AI",
    "locator_text": {
     "h": "人话要点 · 受信任的 AI",
     "v": "人话要点 · 受信任的 AI"
    }
   },
   {
    "id": "p-trusted-who",
    "text": "哪两个、能免什么"
   },
   {
    "id": "p-identity",
    "text": "怎么认出是桌面版"
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
     "text_ref": "人话要点·受信任的AI",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "哪两个、能免什么",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "trusted",
     "width": "45%"
    },
    {
     "type": "points_card",
     "text_ref": "怎么认出是桌面版",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "auto",
     "icon_position": "none",
     "row": "trusted",
     "width": "55%",
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png"
     ],
     "items_layout": {
      "icon_position": "upper_right_inside"
     }
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。 本轮 qa12a：该卡小插画改现有 items_layout.icon_position=upper_right_inside，正文整宽；审页的05受信任卡按文字定位实为当前04。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-04",
    "component_order": [
     "chapter_title",
     "prose",
     "section_heading",
     "points_card",
     "icon",
     "tag",
     "bullet_list",
     "monospace",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点·受信任的AI",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "哪两个、能免什么",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "怎么认出是桌面版",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "auto",
     "icon_position": "none",
     "illustration_asset": [
      "_library/fix-round-2/icon-clean-64b110e28ee97a9a2746.png"
     ],
     "items_layout": {
      "icon_position": "upper_right_inside"
     }
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。 本轮 qa12a：该卡小插画改现有 items_layout.icon_position=upper_right_inside，正文整宽；审页的05受信任卡按文字定位实为当前04。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-04",
    "component_order": [
     "chapter_title",
     "prose",
     "section_heading",
     "points_card",
     "icon",
     "tag",
     "bullet_list",
     "monospace",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "source_phrase": "同一组），中间绿色盾牌徽章不写字",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-18835954778f1d64c1d2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-rule-authorization-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-18835954778f1d64c1d2",
   "title_text": "人话要点 · 受信任的 AI",
   "sha256": "d29fafe104705800abd3b22b4858345dd1553898bf6678320a76c5463730b2f3",
   "status": "ready",
   "source_box": [
    20,
    50,
    814,
    231
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 受信任的 AI

### 哪两个、能免什么
- 受信任的 AI 只有两个：登记过的 Codex 桌面版和 Claude 桌面版，各自登记、各自撤销。
- 它们做密码中心里已登记、又不算重大动作的凭据操作，不用本人验证。
- 查看密码、全部 BitLocker（Windows 整盘加密）恢复密钥、改本人验证方式这类重大动作，能不能沿用已有的验证，统一按〔重大动作与本人验证〕。
- 其他 AI 或程序都没有桌面版的免验证待遇；经“电脑 MCP”远程操作电脑的登录、单独启动的命令行和 Google 的 Antigravity，也都不算桌面版身份。
- 增加新的受信任 AI，要本人明确决定。

### 怎么认出是桌面版
- 密码中心当场顺着真实的父进程链往上查：调用的程序在本人登记的 Windows 账户里，链上的进程都属于这个账户，并且能追到登记过的 Claude 或 Codex 桌面应用本体。
- 只在同一个账户里运行还不够；名字、提示词、模型的自我介绍、环境变量和管理员权限，都证明不了来自桌面版。
- 桌面版启动的工具进程、MCP 服务和子代理，按实际的桌面祖先算；例如 Claude 桌面版启动的 Codex 后台服务（codex app-server）和它的后代，都算 Claude。
- 独立的命令行、编辑器插件、云端会话和经电脑 MCP 远程操作的登录，都不能借用另一条桌面进程链。
- 日常调用由装好的入口自动认出是谁，不需要对话号、消息号、请求签名或一次性凭证。
- 软件更新后，仍按当前账户、应用包和桌面本体认，不拿版本号、带版本号的安装目录或重新绑定密钥当门槛。
- 登记、撤销和新设备恢复，仍走密码中心各自的入口。

::screen{#rule-authorization-05 section="original"}

```typeset
{
 "screen": {
  "id": "rule-authorization-05",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.authorization.md",
   "release": "E325",
   "sha256": "5f8e1e95682b8c293e2f29c0f5b3dcdf3e2e6ba235847d5490c6004aaee227af",
   "public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb",
   "from": null,
   "to": "## 子代理和项目规则不扩大授权",
   "start": 0,
   "end": 3230,
   "approved_omissions": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E187 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“-”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和名字用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 用户授权”到“## 直接做的和要本人同意的”那一节结束；右卡放“## 长期授权”到“授权已经覆盖……”那一段。",
  "portrait": "竖版 9:16：“原文 · E187 版，一字不改”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
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
  "source_excerpt_id": "rule-authorization/rule-authorization-05",
  "source_logical_id": "authorization_contract",
  "source_public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb",
  "source_rule_part": "rule-authorization/rule-authorization-05"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E325版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "用户授权",
     "whole_block": true,
     "columns": 1,
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "长期授权",
     "whole_block": true,
     "columns": 1,
     "body_columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-05",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E325版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "用户授权",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-05",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-authorization/rule-authorization-01-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d23365471633404d9c55",
   "title_text": "用户授权",
   "sha256": "220adfe5e21b50085bb014d597fe03d2b046110cde3eb749782f2d89304e209c",
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
   "asset": "rule-authorization/rule-authorization-05-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-3db26530303f56b1807c",
   "title_text": "直接做的和要本人同意的",
   "sha256": "040381fded4a16ae5c62b84a947192e1b25ed815674a1e5c3be0a27ce193e628",
   "status": "ready",
   "source_box": [
    53,
    404,
    489,
    463
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
   "asset": "rule-authorization/rule-authorization-05-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-44b383de48f031d5a8b0",
   "title_text": "长期授权",
   "sha256": "757b08dd8cdf5170917351e30367e2044a266fecfe2d3aff7c2b1a553d4a9635",
   "status": "ready",
   "source_box": [
    839,
    207,
    1011,
    262
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E325 版，一字不改

# 用户授权

owner: `E:\.agents`

这里说清哪些事 AI 可以直接做、哪些要本人明确同意、长期授权怎么用、无限制授权怎么开，以及哪两个 AI 受信任。Windows 管理员权限、个人资料解锁和多任务之间的协调都不是用户授权。

## 直接做的和要本人同意的

- 在本人给的范围内，本机普通的、能撤回的读取、编辑、测试和验证直接做，不一步步问。
- 发消息、对外发布、花钱、删除唯一的数据、做无法撤回的迁移，要本人明确同意（约法 L15）。本人这句话已经说清对象、内容和动作，就算同意；但不会自动扩到第一次新建的目标、别的账号、新的公开面或别的任务。
- 项目还没发布过 Release 时，第一次公开发布前先问本人；一般的更新、完善或“保持最新”请求不算首次发布的许可（约法 L15）。
- 可信的存放位置不等于可以往里写；公开分级也不等于可以发布。
- 能调用某个工具不等于有授权。真正扩大账号、公开面、花费或不可撤回的影响时，重新判断。
- 没理由少做、缩小能力、反复要授权、把不属于本人的问题推回本人，和越界一样是错（约法 L10）。

## 长期授权

本人明确说过、长期有效的同意，在原来的范围内跨轮次、跨上下文压缩、跨 Codex 和 Claude、跨子代理和新任务一直有效，直到本人撤回；不要求本人在当前消息里再说一遍。AI 的推断、习惯、模板、标题、历史行为和项目规则都不能产生长期授权，也不能把已有的长期授权说成没有。

现有的长期授权：

- **Git 收尾**：授权在仓库里干活，就包括验证后的定向提交和正常推送（细则见[工程与交付](/rules/engineering-delivery/)）。
- **同意网站、平台和软件协议**：本人长期授权 Claude、GPT 及它们派出的子代理，在替本人完成已授权的事情时，直接同意网站、平台、软件要求的用户协议、服务条款、使用规范、隐私政策，包括上传、发布、登录、安装页面上“继续即同意”等提示，不再为同意协议问本人（本人 2026-10-28 18:09，源 3577e088）。
- **申请管理员权限**：已授权的核对、验收或操作要管理员才能看全、做完时，主持和子代理都直接静默提权执行，不把“权限不够、读不全”记成未知，不用推断补位，也不留给根会话。首选系统 sudo 内联模式：`sudo pwsh -NoProfile -NonInteractive -File <脚本> <参数>`（或 `-Command`），直接接回输出和退出码；sudo 不存在、被关或不是内联模式时，用 `Start-Process pwsh -Verb RunAs -Wait -PassThru -WindowStyle Hidden`，管理员进程先设 `[Console]::OutputEncoding` 为 UTF-8，输出写 UTF-8 文件再读回并传回退出码，结果写明是否已提权（如 `observer_elevated`）。两条路径真的失败才如实报告；UAC 需要本人在场时明确写“需要本人在场提权”，由根会话安排，不交半成品。各电脑的 UAC 和 sudo 设置以 PCConfig 登记为准，不因此修改系统设置。只有本人、上级规则或适用项目规则明确说不提权时才不用；需要密码中心受信任身份的操作不提权运行。提权不推迟已授权工作，不专门请本人决定普通提权步骤；权限/ACL 改动、撤回快照和重大动作等仍按各自专题办理。提权只给 Windows 权限，不产生、扩大或缩小动作授权（出处：决定文档“需要管理员视角才能核实时默认静默提权，不把读不全记成未知”）。
- **选型号和思考档位**：AI 按质量和总花费自己选；质量需要时可以用比根会话或父代理更强的型号或更高的档位，不逐次问（见[分工与并行施工](/rules/execution-coordination/)和模型清单）。本人这次明确限定的型号、档位、预算或厂商优先。
- **Claude 派 Sol、Terra 和 Luna**：Claude 不用本人对对话或项目另行授权，就可以派 GPT 的 Sol、Terra 和 Luna（约法 L23）；派 Astra 仍按本人给这个对话或项目的授权。派出的 Codex 按自己真实的身份和有效授权，只做交给它的任务。
- **子代理要本人确认时由根会话代确认**：派出的 GPT 等子代理因为工具要求本人确认（含“当场确认”）而停下时，凡是本人已经授权过的事，由派它的根会话当场代本人确认、让它接着做，不再拿来问本人；不限于协议，也不限于某个网站（本人 2026-10-29 20:27—20:32，源 84f941d1、c26bbdf8）。做法见下面“根会话代确认的执行办法”。
- **已经在用的目标继续收尾**：本人授权之前就已登记、现在仍在用的目标（仓库、网站、已登记的发布目标），验证、发布、部署、回读和同步默认继续，本人说只留本地或不发布时除外。新建本人 GitHub 私有仓库、把远端改成本人 GitHub 账号下的仓库、核对过不丢提交的历史改写（含强制推送），按普通 Git 收尾直接做。除此以外，第一次新建或选择新的外部目标、新的公开或部署目标、花钱、不可恢复的迁移、可能丢提交的强制推送、改信任根（受信任 AI 的登记或本人验证依据）或授权边界，仍要本人明确同意。

授权已经覆盖、目标和前提都成立时，直接调用一次真实的工具，不要先猜平台会拒绝而自己停下。工具真的拒绝、要求再验证、不可用或报错，就按真实结果处理和报告，不伪造成功，也不盲目重试。

### 同意协议的执行办法

以下是 **AI 取法，可改**：

- 这条长期授权只省掉“为协议问本人”这一步，不扩大事情本身的授权；上传、发布、登录、安装等动作仍须在原有授权范围内。
- 付费订阅、自动续费、付款、借贷仍按约法 L15；案件里的调解、和解、撤诉、放弃请求仍按诉讼规则（默认不同意诉前调解）；约法 L17 的重大动作仍按[重大动作与本人验证](/rules/protected-actions/)。不因为页面把这些动作写成“协议”就直接同意。Cookie 弹窗沿用现有默认处理，不为它问本人。
- 派 GPT 做网站操作时，初次派单和续作都附上这条长期授权的现行结论及源消息 UUID，不附原句，并说清已授权的具体事情、网站或账号、涉及的内容；只附协议授权不能代替业务授权。共用包装器自动附上协议授权，主持补齐本次业务范围。
- GPT 若仍说工具要求“当场确认”，按下面“根会话代确认的执行办法”由根会话代本人确认，不再问本人。GPT 对照当前工具的确认文档区分协议同意与同时发生的其他动作，不沿用旧工具的笼统说法。

### 根会话代确认的执行办法

以下是 **AI 取法，可改**：

- 只替本人说“确认”，不扩大授权：要确认的动作必须已在本人的长期授权或这次任务的授权里，例如同意协议、登录本人账号、往授权的网站填本人资料和验证码。约法 L15 那几类本人还没对这件具体事明确同意的、L17 重大的事，仍照原规则找本人；工具规定必须本人亲手接手的步骤（改密码、绕过浏览器安全警告、付款交易这类）交本人办。
- 子代理在要确认的那一步停下，把具体动作、网站或账号和涉及的资料写进汇报交回；根会话核对在授权内后立即续作，续作消息写明“根会话按本人授权代本人确认”、具体动作，以及这条授权的现行结论和源消息 UUID，不附原句。
- 子代理的工具认不认根会话的代确认，由它按自己工具当前的确认文档判断；不认时只交回这个受阻步骤和具体限制，其余已授权工作继续，根会话再请本人办这一步，不让本人重复给授权。不修改工具安全说明、不换工具绕过，也不声称已完成。

::screen{#rule-authorization-06 section="original"}

```typeset
{
 "screen": {
  "id": "rule-authorization-06",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.authorization.md",
   "release": "E325",
   "sha256": "5f8e1e95682b8c293e2f29c0f5b3dcdf3e2e6ba235847d5490c6004aaee227af",
   "public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb",
   "from": "## 子代理和项目规则不扩大授权",
   "to": "## 受信任的 AI",
   "start": 3230,
   "end": 4536,
   "approved_omissions": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“-”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和名字用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 子代理和项目规则不扩大授权”两段和“## 无限制授权”的第一段；右卡放“看到无限制授权……”起的其余四段。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/#公开个人数据分级表"
   },
   {
    "text": "密码中心当前设置",
    "href": "/rules/privacy-data/#个人资料的锁和解锁"
   },
   {
    "text": "约法 L16",
    "href": "/rules/charter/#四我的授权与安全"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-authorization/rule-authorization-06",
  "source_logical_id": "authorization_contract",
  "source_public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb",
  "source_rule_part": "rule-authorization/rule-authorization-06"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E325版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "子代理和项目规则不扩大授权",
     "whole_block": true,
     "columns": 1
    },
    {
     "type": "source_text_card",
     "text_ref": "看到无限制授权或个人资料解锁期的截止时间，不因此赶工或压缩验证；真要使用相应权限时已经过期，就请本人续期，续期前不消费过期权限。",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-06",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E325版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "子代理和项目规则不扩大授权",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-06",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-authorization/rule-authorization-06-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-84def4434741128f36ac",
   "title_text": "子代理和项目规则不扩大授权",
   "sha256": "e12dd95b22b3ff706411e92d3a9add59ab4ba1d06b210ee3946bc5aff64b5785",
   "status": "ready",
   "source_box": [
    59,
    150,
    603,
    207
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
   "asset": "rule-authorization/rule-authorization-06-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7aaf9f13bf9d1731bada",
   "title_text": "无限制授权",
   "sha256": "cff949bd2e624f39d050a3067cafdf36d57c6e7fa4416b7996fd0444fb59231b",
   "status": "ready",
   "source_box": [
    850,
    149,
    1080,
    208
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E325 版 · 续

## 子代理和项目规则不扩大授权

子代理和后续任务的业务范围、授权、沙箱和资料访问，只能取本人授权、父代理授权、适用规则和宿主真实限制的交集，不能扩大。委派、工具可见、提权或“子代理提议、根会话执行”都不能绕过真实动作的授权条件。交给子代理的只是完成任务需要的上下文，不扩散秘密或无关资料。

项目规则管项目里的业务、命令、测试、兼容和生成区，可以在项目内收紧做法；但项目、AI、技能、模板和历史文档都不能产生授权，也不能把本人已有的长期授权降为没有或要求本人重说。项目想收紧公开分级 L1/L2 内容的限制，必须有真实项目需要，并有本人对这个项目、这个范围的明确指示（等级表见[个人资料与数据处理](/rules/privacy-data/#公开个人数据分级表)，不是约法条号）。

## 无限制授权

本人可以给一个对话一段限时的“无限制授权”（约法 L16；也叫紧急授权、本人接管）。时长由本人在窗口里填，0.5～72 小时，可以有小数；新请求的默认时长同样读[密码中心当前设置](/rules/privacy-data/#个人资料的锁和解锁)，不写死出厂值。默认只管当前对话，要全局生效须本人明确选择。它和个人资料解锁期是两件独立的事。已签发的授权保持原截止，不滑动续期，也不因默认设置改变而延长。

看到无限制授权或个人资料解锁期的截止时间，不因此赶工或压缩验证；真要使用相应权限时已经过期，就请本人续期，续期前不消费过期权限。

在本人定的范围和时间里，本人的明确指令优先于 AI 自己的规则、项目限制、模型路由和 AI 审批；不追加厂商或型号资格检查，也不要求指定模型批准。AI 仍要说真话、提更好的方案、说清具体风险和别的任务正在做什么；本人了解后仍然坚持的，就照做，并自己做好相称的协调、保全和恢复。真实工具能力、验证方式、期限和执行结果不能伪造。

无限制授权的本人确认效力按[约法 L16](/rules/charter/#四我的授权与安全)；重大动作如何使用该效力见[重大动作与本人验证](/rules/protected-actions/)。已有无限制授权不自动打开个人资料，已有资料期也不建立或延长无限制授权。本人明确同时要两项时，全局接管入口 `Invoke-OwnerTakeover.ps1 -Operation OpenGlobal -GrantPersonalAccess` 可在同一窗口用一次本人验证建立两份授权；按回执分别说明成功、只成功一项或状态不明，保留各自截止，不把部分成功说成全部成功，也不另开第二次验证。普通对话范围的接管不带这项组合。

本人要求开始、验收或重试无限制授权时，直接打开密码中心现役的本人接管入口 `Invoke-OwnerTakeover.ps1 -Operation Open`，由本人填时长并完成一次本人验证；不需要先有别的授权、登记或模型判断。Codex 和 Claude 的具体调用见各自适配专题。验证成功前没有接管权限；成功后只消费这一份授权和它的原截止。新对话、别的 AI 和别的电脑不会因为共用设备自动继承对话范围的授权。

::screen{#rule-authorization-07 section="original"}

```typeset
{
 "screen": {
  "id": "rule-authorization-07",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.authorization.md",
   "release": "E325",
   "sha256": "5f8e1e95682b8c293e2f29c0f5b3dcdf3e2e6ba235847d5490c6004aaee227af",
   "public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb",
   "from": "## 受信任的 AI",
   "to": null,
   "start": 4536,
   "end": 5201,
   "approved_omissions": []
  },
  "title": "原文（三）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“-”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令和名字用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。这一屏字少：左卡放“## 受信任的 AI”和第一段，右卡放后两段。卡片下方留一条窄窄的水彩叶子装饰带，和前两屏的叶子同一种画法，带里不写字。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；最下面是水彩叶子装饰带。",
  "links": [
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-authorization/rule-authorization-07",
  "source_logical_id": "authorization_contract",
  "source_public_sha256": "7d8b62328ce1f8bef36a01bf5acfc4877a0db878c3082eb7299d69335ece66eb",
  "source_rule_part": "rule-authorization/rule-authorization-07"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E325版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "受信任的AI",
     "whole_block": true,
     "columns": 1,
     "row": "original",
     "width": "50%"
    },
    {
     "type": "source_text_card",
     "text_ref": "身份由PasswordCenter的SecretBroker现场沿真实父进程链核验：调用程序在本人登记的Windows账户里，祖先链中的进程",
     "whole_block": true,
     "columns": 1,
     "row": "original",
     "width": "50%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-07",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文·E325版·续"
    },
    {
     "type": "source_text_card",
     "text_ref": "受信任的AI",
     "whole_block": true,
     "columns": 1
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "rule-authorization-07",
    "component_order": [
     "section_heading",
     "source_text_card",
     "prose",
     "inline_link",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "rule-authorization/rule-authorization-07-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-authorization\\img\\rule-authorization-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-67d07967d77ac5e58773",
   "title_text": "受信任的 AI",
   "sha256": "2139113cc5d0e36b8b1cb67e9e53e3050ff4febe480fb4e03050e47dcf301e84",
   "status": "ready",
   "source_box": [
    42,
    52,
    510,
    219
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E325 版 · 续

## 受信任的 AI

受信任的 AI 只有两个：登记过的 Codex 桌面版和 Claude 桌面版。它们可以免本人验证执行密码中心已登记且不属于重大动作的凭据操作；重大动作是否复用已有验证统一按[重大动作与本人验证](/rules/protected-actions/)。两者分别是 `codex-root`、`claude-root`，各自登记、各自撤销。其他 AI 或程序不享有桌面身份的免验证待遇；电脑 MCP 登录、独立启动的命令行和 Antigravity 也不建立这种身份。

身份由 PasswordCenter 的 SecretBroker 现场沿真实父进程链核验：调用程序在本人登记的 Windows 账户里，祖先链中的进程属于同一账户，并能追到登记包族的 Claude 或 Codex 桌面应用本体。只在同一账户里运行还不够；名称、提示词、模型自述、环境变量和管理员权限也不证明桌面来源。桌面启动的工具进程、MCP 服务器和子代理沿用实际桌面祖先的主体；例如 Claude 桌面启动的 codex app-server 及其后代统一是 `claude-root`。独立命令行、IDE 插件、云端会话和电脑 MCP 登录不能借用另一条桌面进程链。

日常调用由安装入口自动识别主体，不需要对话号、消息号、请求签名或一次性凭证。软件更新后仍按当前账户、包族和桌面本体识别，不以版本号、带版本的安装目录或桥接密钥续绑为门槛。登记、撤销和新设备恢复仍走密码中心各自的入口；增加新的受信任 AI 须由本人明确决定。
