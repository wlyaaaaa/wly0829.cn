---
{
 "title": "Codex 适配",
 "kind": "rule-topic",
 "url": "/rules/codex-adapter/",
 "tagline": "只对 Codex 有用的入口、授权、派活和升级细则。",
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
  "page": "rule-codex-adapter",
  "kind": "rule-topic",
  "title": "Codex 适配",
  "url": "/rules/codex-adapter/",
  "tagline": "只对 Codex 有用的入口、授权、派活和升级细则。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E331",
   "commit": "985a1c35a97768f86014870625702364d994b55d",
   "ruleset_sha256": "ff01e695160a44b27a8164efa5a0d2b1fb53f733d0ba2a8c6a1b7da86b411103",
   "activated_at": "2026-10-31T07:37:25.088872+08:00",
   "file": "sources/rules/docs/contracts/agents.codex-adapter.md",
   "sha256": "d982f5455f63fc61c9a3fd433cab1b24c38de2b25716a4d43fd53c706377dbe7",
   "public_sha256": "ae67a463e28ac81948d3462fb90cec9ecce6087913efe01ce564109af7bfd580"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：笔记本电脑屏幕上的终端光标轻轻闪烁；上方写着“Hook”的小铃铛轻轻摇一下，垂着的两张小纸条（锁、钥匙图标）随之晃动；左边“AGENTS.md”木牌指向远处厚书的细绿箭头上，一个小光点从木牌流向书本；右边两个小 AI 助手举着的牌子微微上下晃；右下“codex-root”工牌后的细绿线从下往上依次点亮几个小方块，最后亮到电脑；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，四块牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E257（北京时间 10 月 11 日 13:02 起生效）",
     "meaning": "原文屏里留作快照的文字依据的规则版本（拼页时原文按当时生效的版本现读，版本由拼页程序标出）",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：release_id=E257，activated_at_utc=2026-10-11T05:02:36.7738409+00:00；原文 sha256=32386c32c9374a6c25bb73847baa74bbebada9d6c1f001c448143edd8e86e2f4",
     "screens": [
      "rule-codex-adapter-05"
     ]
    },
    {
     "id": "n-takeover-hours",
     "text": "0.5–72 小时，默认时长照密码中心当前的设置",
     "meaning": "无限制授权窗口里本人能填的时长范围；默认时长不写死，读密码中心当前设置",
     "as_of": "2026-09-29",
     "source": "E190 agents.authorization.md 第 37 行；E190 agents.privacy-data.md“个人资料的锁和解锁”一节（duration_policy.default_minutes）；C:\\ProgramData\\PCConfig\\AuthorityHost\\tools\\Invoke-OwnerTakeover.ps1 第 53 行 [ValidateRange(30,4320)]",
     "screens": [
      "rule-codex-adapter-02"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "原文在 AI 规则与技能基座（E:\\.agents），随规则版本发布；Codex 开工时经 Codex home 的 AGENTS.md 指路，从活动版本读它。",
     "source": "Inspect 返回的 required_rule_paths.codex_adapter_contract；C:\\Users\\10979\\.codex\\AGENTS.md"
    },
    {
     "id": "r-hook-agents",
     "with": "agents",
     "direction": "装入",
     "flow": "基座的 codex_context_install.py 把 codex_context_hook.py 装进 Codex home 的 managed-hooks/codex-context，登记到 hooks.json 的 UserPromptSubmit 和 SubagentStart；Hook 每次把资料状态、接管状态、型号档位写进对话。",
     "source": "E:\\.agents\\tools\\codex_context_install.py 第 30 行；E:\\Data\\AppData\\Codex\\hooks.json"
    },
    {
     "id": "r-takeover-pcconfig",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "接管入口 Invoke-OwnerTakeover.ps1 由电脑配置与恢复的 Install-PasswordCenterIndependent.ps1 装到 C:\\ProgramData\\PCConfig\\AuthorityHost\\tools；Hook 识别到本人直接要授权时调用它的 Open，并回读授权状态。",
     "source": "E:\\PCConfig\\tools\\Install-PasswordCenterIndependent.ps1 第 6、101–108 行；codex_context_hook.py 第 25、268–285 行"
    },
    {
     "id": "r-identity-password-center",
     "with": "password-center",
     "direction": "拿来",
     "flow": "密码中心沿 Windows 进程祖先链认出 Codex 桌面版（软件包 OpenAI.Codex_2p2nqsd0c76g0 的 app/ChatGPT.exe）记作 codex-root，Claude 桌面版记作 claude-root。",
     "source": "E:\\Projects\\Tools\\PasswordCenter\\tools\\desktop_ai_identity.py 第 17、25–54 行"
    },
    {
     "id": "r-openai-child-aicli",
     "with": "ai-cli-profile-manager",
     "direction": "拿来",
     "flow": "Codex 桌面用别家模型当主对话时，AI工具配置管理的桌面桥给这类对话（模型提供方以 aicli_ 开头）注入 openai_child 工具派 GPT 子代理，另有 Sol High、Astra High 两个把关专用角色。",
     "source": "E:\\Projects\\Tools\\ai-cli-profile-manager\\src\\AiCliProfileManager\\Support\\DesktopBridge\\RpcTransport.OpenAiChild.cs 第 6–22、33–38 行"
    },
    {
     "id": "r-roster",
     "with": "agents",
     "direction": "引用",
     "flow": "可派范围写在 E:\\.agents\\config\\model-roster.json 的 hosts.codex：GPT 主对话派 Astra、Sol、Luna；别家主对话派 Sol、Luna，不派 Astra。",
     "source": "model-roster.json（updated_beijing_date=2026-09-27，提交 cbfe6d6）"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-codex-adapter-01",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-codex-adapter-01",
     "text": "用户授权"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-codex-adapter-01",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-codex-adapter-01",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "rule-codex-adapter-01",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/rules/charter/#L16",
     "screen": "rule-codex-adapter-01",
     "text": "约法 L16"
    },
    {
     "target": "/projects/ai-cli-profile-manager/",
     "screen": "rule-codex-adapter-01",
     "text": "AI工具配置管理"
    },
    {
     "target": "/how/#ai-roles",
     "screen": "rule-codex-adapter-01",
     "text": "在整套系统里的分工 → 怎么协作"
    },
    {
     "target": "/rules/context-sources/",
     "screen": "rule-codex-adapter-02",
     "text": "共享经验的落点"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "rule-codex-adapter-02",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/ai-cli-profile-manager/",
     "screen": "rule-codex-adapter-03",
     "text": "AI工具配置管理"
    },
    {
     "target": "/rules/charter/#L23",
     "screen": "rule-codex-adapter-03",
     "text": "约法 L23"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-codex-adapter-03",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/protected-actions/#p-gate",
     "screen": "rule-codex-adapter-03",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-codex-adapter-05",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/context-sources/",
     "screen": "rule-codex-adapter-05",
     "text": "共享经验的落点"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rule-codex-adapter-06",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-codex-adapter-06",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/skills/reply-as-me/",
     "screen": "rule-codex-adapter-03",
     "text": "替我拟消息"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "标题用“Codex 适配”（照原文页名 `# Codex 适配`，和其他专题页链过来的字一致）；manifest 和规则目录里写的是“Codex适配”（没有空格）。",
    "原文“调用 MCP 不改变本机 Codex 原来的任务入口”，人话要点照写成“通过 MCP（外接工具接口）调用时，本机 Codex 原来的任务入口不变”，没敢加解释：是指别的电脑或网页 AI 通过电脑 MCP 调这台电脑，还是指 Codex 自己调用 MCP 工具，原文和代码里都没找到能定的说明。",
    "把关用不用 Astra：E190 原文已定，主对话是别家模型时把关也只从 Sol、Luna 里选，不因把关职责扩大可派型号；第 3 屏照改，并删掉了原来“AI工具配置管理备了 Sol High、Astra High 两个把关角色”那条实例。要 Claude 知道：AI工具配置管理的代码（RpcTransport.OpenAiChild.cs 第 7–10、17 行，9 月 29 日看仍在）还留着 gpt6_astra_high_protected_judgment 这个 Astra 把关角色，和 E190 规则对不上；这是代码的事，本页不写。",
    "原文四处 Markdown 链接画成〔〕链接，看得见的字没改（派活的 Claude 已定这算一字不改）。其中“共享经验的落点”原文指向 agents.context-sources.md#共享经验的落点，我链到 /rules/context-sources/ 不带锚点，因为那一页的锚点名还没定；那页定了以后补上 #锚点。",
    "开头一屏入口链到 /how/#ai-roles，和“分工与并行施工”页同一个锚点（第 2 批要建）。",
    "人话要点里的“实例”（接管请求哪些说法会弹窗、0.5–72 小时默认 8 小时、别家主对话的两个把关角色、子代理档位为什么写未知、认的是 ChatGPT.exe 本体、Stop 一栏是空的）都不是规则原文，是我读代码和配置核实过的现状，出处见 facts.md 第三节。",
    "“不派最贵的 Astra（本人定的）”：规则原文只写“不派 Astra”，“最贵、本人定”取自模型清单 not_dispatched 的 reason 和本人决定 R1（owner-decisions.md 第 65 行）。",
    "全页用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。本人示范说法“给这个对话开 8 小时无限制授权”是我举的例子，已用 Hook 程序实测会触发。",
    "第 1–3 屏于北京时间 9 月 29 日跟到 E190：删了首屏版本行；无限制授权默认时长改为“照密码中心当前的设置”（E190《用户授权》不再写死 8 小时）；把关一节改为统一指向《重大动作与本人验证》（链到它的 #p-gate）。原文屏（第 5–6 屏）改为拼页时按当时生效版本现读，text 和 based_on 仍是 E187 快照。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-codex-adapter/page.json",
  "sha256": "6f196a36f6ad457202566d9f9ff64dd86d8de26fc80c0c8c4b2bb5873a3390bc",
  "converted_at_beijing": "2026-10-31T10:23:39+08:00"
 }
}
---

::screen{#rule-codex-adapter-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-codex-adapter-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“Codex 适配”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题，再下面介绍段。介绍段下面一张浅绿细边圆角卡片“先认几个词”，六个词条竖排，词条名粗体绿色。卡片下面一行“跳到：”后面五个圆角小按钮（白底浅绿描边绿字）。右边约 45% 宽一幅水彩插画：画面中央一台打开的笔记本电脑，屏幕上是 Codex 的终端小图标（OpenAI 黑色花结标志在屏幕角上）；电脑左边一块小木牌“AGENTS.md”，一根细绿箭头从木牌指向远处一本厚书（表示只是指路、规则在别处）；电脑上方一个小铃铛挂着小牌“Hook”，铃铛下垂着两张小纸条（一张画锁的图标、一张画钥匙的图标，表示资料状态和接管状态）；电脑右边两个小小的 AI 助手，胸前是 OpenAI 黑色花结标志，合举一块小牌“GPT-6.1 Sol · GPT-6 Luna”；画面右下一块小工牌（像门禁卡）写“codex-root”，工牌后面一条细绿线沿着几个小方块往上连到电脑（表示顺着进程链认身份）。插画里只有这四块牌子上有字，text 里“AGENTS.md　Hook　GPT-6.1 Sol · GPT-6 Luna　codex-root”这一行就是这四块牌子的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是说明句，右边一个显眼的按钮〔在整套系统里的分工 → 怎么协作〕。〔〕里的字画成绿色下划线加小箭头的链接样式。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；水彩插画（同横版，缩成整宽一幅，四块牌子的字不变）；介绍段；“先认几个词”卡片（六个词条一行一条）；“跳到：”五个按钮排三行（二、二、一）；最下面“怎么协作”横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   },
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/"
   },
   {
    "text": "约法 L16",
    "href": "/rules/charter/#L16"
   },
   {
    "text": "AI工具配置管理",
    "href": "/projects/ai-cli-profile-manager/"
   },
   {
    "text": "入口和新消息",
    "href": "/rules/codex-adapter/#p-entry"
   },
   {
    "text": "无限制授权",
    "href": "/rules/codex-adapter/#p-takeover",
    "locator_instances": {
     "h": {
      "input_sha256": "23144ad12395566a90bc62a425f985f388d864e5b6fb838d9fa86f3fd6cfb7a8",
      "instances": [
       {
        "context_text": "无限制授权",
        "context_rect": [
         319,
         793,
         430,
         818
        ],
        "expected_rect": [
         322,
         796,
         428,
         817
        ]
       }
      ]
     },
     "v": {
      "input_sha256": "f1baa8dd2534480ef60bd709418d22b4144551dc10efef75dab2d56f1205db12",
      "instances": [
       {
        "context_text": "无限制授权",
        "context_rect": [
         89,
         2590,
         280,
         2625
        ],
        "expected_rect": [
         93,
         2594,
         276,
         2623
        ]
       }
      ]
     }
    }
   },
   {
    "text": "派子代理",
    "href": "/rules/codex-adapter/#p-dispatch"
   },
   {
    "text": "新消息里的状态",
    "href": "/rules/codex-adapter/#p-hook"
   },
   {
    "text": "官方升级",
    "href": "/rules/codex-adapter/#p-upgrade"
   },
   {
    "text": "在整套系统里的分工 → 怎么协作",
    "href": "/how/#ai-roles"
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
     "text_ref": "Codex 适配"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "只对 Codex 有用的细则"
    },
    {
     "type": "prose",
     "text_ref": "这个专题只补"
    },
    {
     "type": "glossary",
     "columns": 1,
     "text_ref": "先认几个词",
     "row": "terms-art",
     "width": "64%"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "terms-art",
     "width": "36%",
     "align": "center",
     "target_height": 320,
     "target_width": 386
    },
    {
     "type": "prose",
     "textless": true,
     "text_ref": "AGENTS.md",
     "illustration": "none",
     "base_asset": "none",
     "columns": 1,
     "row": "terms-art"
    },
    {
     "type": "action_button",
     "columns": 5,
     "text_ref": "跳到："
    },
    {
     "type": "notice",
     "text_ref": "Codex 在整套系统里干什么"
    }
   ],
   "notes": "主插画采用无字素材；AGENTS.md / Hook / GPT-6.1 Sol · GPT-6 Luna / codex-root 原散词段按 scene 的插画归属启用 textless，不另排文字框。词条解释及全部链接、按钮保留。",
   "prior_round_notes": "亲看原图：左55%是左对齐浓绿大题、粗副题、介绍、六词词条卡及五按钮横排；右45%卡外电脑、牌位、铃铛、厚书、双机器人及工牌。底部说明按钮条全宽。图内四处牌位文字来自末段AGENTS.md Hook GPT-6.1 Sol·GPT-6 Luna codex-root，现以document_mock保全定稿节点，必须由组件排入对应图内牌位；不能删或重复。暂无文字与插画结合能力，不把图下额外文字称构图已过；词条胶囊卡头及底栏均待组件样张。仅插画内部连线。",
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "Codex 适配"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "只对 Codex 有用的细则"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "prose",
     "text_ref": "这个专题只补"
    },
    {
     "type": "glossary",
     "columns": 1,
     "text_ref": "先认几个词"
    },
    {
     "type": "action_button",
     "columns": 1,
     "text_ref": "跳到："
    },
    {
     "type": "prose",
     "textless": true,
     "text_ref": "AGENTS.md",
     "illustration": "none",
     "base_asset": "none",
     "columns": 1
    },
    {
     "type": "notice",
     "align": "center",
     "text_ref": "Codex 在整套系统里干什么"
    }
   ],
   "notes": "主插画采用无字素材；AGENTS.md / Hook / GPT-6.1 Sol · GPT-6 Luna / codex-root 原散词段按 scene 的插画归属启用 textless，不另排文字框。词条解释及全部链接、按钮保留。",
   "prior_round_notes": "亲看v/v2：第1张整宽居中毛笔大题→三行粗副题→卡外大插画→介绍；第2张六词词条卡，卡头胶囊探出→跳到标签→一列五个整宽按钮→末说明链接卡。实际按钮一列优于portrait的2/2/1。图内牌位末段文字必须映射到前部插画且G1只出现一次；本规格先保源节点顺序，appearance为未实现要求，待主工程师接入空间定位。按两张观感分张，不缩字。",
   "pending_requirements": []
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
   "source_phrase": "OpenAI 黑色花结标志在屏幕角上",
   "sha256": "d5e37ca41dfb31132d6efa380695341971364f891ab4002f15821513909e5c0c",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-agents.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "main-agents",
   "source_phrase": "同规则基座主图；牌上文字由程序画",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-codex-adapter/rule-codex-adapter-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d24e7f63be7a65c8632c",
   "title_text": "Codex 适配",
   "sha256": "38d4374f57f5d6f76c80bc8763cddfc808a13d45dbcdc8dbbfc030a7d4d130fd",
   "status": "ready",
   "source_box": [
    30,
    5,
    631,
    173
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# Codex 适配

**只对 Codex 有用的细则：规则从哪进、无限制授权怎么开、子代理怎么派、升级后怎么认身份。**

这个专题只补 Codex 和别处不一样的地方，AI 只在用到 Codex 特有机制时才读。共同原则都在别的专题：派不派、派谁看〔分工与并行施工〕，能不能做看〔用户授权〕，重大的事动手前怎么把关看〔重大动作与本人验证〕；Claude 那边的同类细则在〔Claude 适配〕。

**先认几个词**
- **Hook**：本人每发一条新消息、Codex 每启动一个子代理时，自动运行的一小段检查程序，把当前状态写进对话给 AI 看。
- **个人资料状态**：本人的私人资料现在锁着还是在解锁期，见〔个人资料与数据处理〕。
- **无限制授权**：本人给某个对话开的限时授权，也叫本人接管，见〔约法 L16〕。
- **主对话**：本人直接对话的那个 AI，原文也叫“根会话”。Codex 的主对话可以是 GPT，也可以借〔AI工具配置管理〕换成别家模型，例如 DeepSeek、GLM、通义千问或本机模型。
- **把关**：重大的事动手前，由够格的模型确认一遍该不该做、要不要请本人验证。
- **codex-root、claude-root**：密码中心认得的两个受信任身份，分别是 Codex 桌面版和 Claude 桌面版。

跳到：〔入口和新消息〕〔无限制授权〕〔派子代理〕〔新消息里的状态〕〔官方升级〕

AGENTS.md　Hook　GPT-6.1 Sol · GPT-6 Luna　codex-root

Codex 在整套系统里干什么、和 Claude 怎么分工：〔在整套系统里的分工 → 怎么协作〕

::screen{#rule-codex-adapter-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-codex-adapter-02",
  "section": "points",
  "title": "人话要点：入口和新消息、无限制授权",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面两张圆角卡片（白底、浅绿细边）左右并排，左“入口和新消息”、右“无限制授权”，右卡略宽；小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片左上角一个小水彩图标：“入口和新消息”配一块指路木牌、“无限制授权”配一个带沙漏的小窗口。每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条放在浅绿底的小框里，和规则要点区分开。AGENTS.md、memories、generate_memories、use_memories、false 用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，先“入口和新消息”后“无限制授权”；实例小框保留。字和横版完全一样。",
  "links": [
   {
    "text": "共享经验的落点",
    "href": "/rules/context-sources/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/#p-browser"
   }
  ],
  "anchors": [
   {
    "id": "p-entry",
    "text": "入口和新消息"
   },
   {
    "id": "p-takeover",
    "text": "无限制授权"
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
     "text_ref": "人话要点 · 入口和无限制授权"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "cards",
     "width": "47%",
     "text_ref": "入口和新消息",
     "inset_prefixes": [
      "实例：",
      "Codex 的自动记忆关着："
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "cards",
     "width": "50%",
     "text_ref": "无限制授权",
     "inset_prefixes": [
      "实例：",
      "Codex 的自动记忆关着："
     ]
    }
   ],
   "notes": "亲看横图：整宽章节题按本人标准居中；左入口47%右授权50%长卡。图标卡内左上叠浅绿卡头，正文在下整宽；左第6条自动记忆小框、右第2条实例浅绿内框均不拆内部节点。无卡间箭头。图标和实例框待组件样张；额外Codex图标字不加。 本轮只依据文字核对，未重新看图。",
   "prior_round_notes": "亲看横图：整宽章节题按本人标准居中；左入口47%右授权50%长卡。图标卡内左上叠浅绿卡头，正文在下整宽；左第6条自动记忆小框、右第2条实例浅绿内框均不拆内部节点。无卡间箭头。图标和实例框待组件样张；额外Codex图标字不加。",
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 入口和无限制授权"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "page_break_after": true,
     "text_ref": "入口和新消息",
     "inset_prefixes": [
      "实例：",
      "Codex 的自动记忆关着："
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "无限制授权",
     "inset_prefixes": [
      "实例：",
      "Codex 的自动记忆关着："
     ]
    }
   ],
   "notes": "亲看批准02-v和原v2：第1张浓绿毛笔题及笔刷线，入口六条整宽卡，卡头左无字指路牌；第2张只有授权七条，卡头无图，实例为第2条浅绿嵌框。标题不重复。page_break_after是保原两张分配要求，待分页层支持。 本轮只依据文字核对，未重新看图。",
   "prior_round_notes": "亲看批准02-v和原v2：第1张浓绿毛笔题及笔刷线，入口六条整宽卡，卡头左无字指路牌；第2张只有授权七条，卡头无图，实例为第2条浅绿嵌框。标题不重复。page_break_after是保原两张分配要求，待分页层支持。",
   "pending_requirements": [
    "原竖版分张切口仍未落实，核心不消费page_break_after/item_pages；不能以总高度未超自动分张阈值称已按原图分张。"
   ]
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
   "source_phrase": "一块指路木牌、“无限制授权”配一个带沙漏的小窗口",
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
   "asset": "_library/round3/titles/title-r3-d1f790b4199487b68a87.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-codex-adapter-02-v\\round-01\\candidate-2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-d1f790b4199487b68a87",
   "title_text": "人话要点 · 入口和无限制授权",
   "sha256": "bbb5944b3eb5e593cdfe0f7f9710f66ce17d009248f80f82829ccfe43321dac2",
   "status": "ready",
   "source_box": [
    17,
    19,
    928,
    178
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 入口和无限制授权

### 入口和新消息
- Codex 自己目录里的 AGENTS.md 只是指路：叫 AI 先核验当前生效的规则版本，再从那一版读规则。
- 本人真发来的新消息，和自动续作、上下文压缩、工具返回的消息分开看；后三种不算新消息。
- 个人资料状态由 Hook 带进来；缺失或投递不明时先用 StatusPersonalEnvironment 重读。根会话需要本人资料而锁着或不明时，第一步请本人验证，之后再查资料、派活和完整作答；子代理不自己验证，只交回实际缺口。纯技术工作照常。
- 通过 MCP（外接工具接口）调用时，本机 Codex 原来的任务入口不变。新开对话、上下文压缩后和恢复时，Hook 都会从本人原话的分类里生成一张“现在有效的禁令和授权”短表带进来，所以新开的对话也能拿回当前有效的决定；派活和提问前用同一份决定投影。普通的每条回复不会自动去读决定。原生子代理压缩后没有这个接续事件时，读原任务状态。
- 技术上这是 SessionStart 的 startup、compact、resume 三种事件生成禁令和授权短表，派活、提问前的 PreToolUse 用共同决定投影。
- 新消息、Hook、子代理的真实身份和执行结果，都在本机正在用的入口核实；不凭标题、模型自称或别的 AI 留下的环境借身份。
- 上网站时，Codex 要明确点名用本人的 Chrome（`agent.browsers.get("chrome")`），不用 `getDefault()`、`getForUrl()` 或应用内浏览器（`iab`）让运行时替它挑；应用内浏览器只用来看本机文件、本地预览，或本人这一轮点名要用时。后台标签页怎么开、Chrome 插件不通时修一次再交回、只有本机渲染自检能用无头，这些共同流程见〔能力与运行方式〕专题的浏览器一节。
- Codex 的自动记忆关着：memories、generate_memories、use_memories 三个开关都是 false。当轮要留下的经验按〔共享经验的落点〕写；Codex 工具本身已核实的教训写进本专题。

### 无限制授权
- 本人要给当前 Codex 对话开无限制授权时，AI 直接打开密码中心的接管入口（由〔电脑配置与恢复〕装在本机），不先派个模型判断该不该开。
- 实例：本人打“给这个对话开 8 小时无限制授权”或只打“无限制授权”，Hook 就当场替当前对话打开窗口；问“无限制授权是什么？”或者说“你需要无限制授权”，不会弹窗。
- 只绑当前这个对话真实的编号，不借历史任务、MCP 连接或别的对话。
- 入口生成这一次的配对和请求编号，借 Windows 自带的提权弹出一个独立窗口，本人只填时长（0.5–72 小时，默认时长照密码中心当前的设置）；回执要写明这是无限制授权。
- 本人验证完成后，由 Hook 自动读回并使用这份授权；AI 不手动一步步走配置、准备、激活、查状态，也不反复开窗口。
- 确有必要的子代理沿用同一份请求和原来的截止时间；本地命令带上同一组三个接管值（会话引用、请求编号、截止时间），不改用户级或全机的环境变量。
- 回执丢了先查原请求，不自动重新弹窗、也不让本人重新验证；入口真的报错才去针对性排查。

::screen{#rule-codex-adapter-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-codex-adapter-03",
  "section": "points",
  "title": "人话要点：派子代理",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）；标题下面是不进卡片的完整导语（含桌面槽满转命令行的说明，按文字自然换行，不硬塞一行）（前面一个小绿圆点，config/model-roster.json 用等宽字体、浅绿底小框）。导语下面四张圆角卡片（白底、浅绿细边）排成两行两列：上行左“主对话是 GPT 时”（短）、右“主对话是别家模型时”（最长，可以比左边高）；下行左“重大动作前的把关”、右“新开一个顶层对话”（短）。小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片左上角一个小水彩图标：“主对话是 GPT 时”配 OpenAI 黑色花结标志牵出三根细线、“主对话是别家模型时”配两个不同颜色的小对话气泡中间一座小桥、“重大动作前的把关”配一道带小哨岗的栅栏门、“新开一个顶层对话”配一个新打开的对话气泡。每条要点前一个小绿圆点，正文深蓝灰；openai_child、openai_parent、openai_child_control、create_thread 用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。 同上：标题下面一张浅绿底圆角提示卡，“先说派谁”粗体深绿；其余版式照原图。（g4 补充）导语里“桌面槽满”那段已改成新文字（名额真满才转 GPT 包装器……），以 text 为准，按文字自然换行，排在“先说派谁”提示卡下面、四张卡上面；其余画法不变。",
  "portrait": "竖版分 2 张，仍用现有 v/v2。第 1 张画本屏标题、完整导语（含桌面槽满转命令行子代理句）及“主对话是 GPT 时”“主对话是别家模型时”两组；第 2 张画“重大动作前的把关”“新开一个顶层对话”两组，原字不变。卡片整宽上下排，插画只在第 1 张；按全文分配，不漏字、不缩正文。 根批准仅第1张当前v布局修正：完整补导语原段“桌面子代理名额真满了，才自动改用现成的 GPT 包装器接能做的活；登录、参数、网络这类故障先修真原因，不当成满了。它仍是当前主对话管的后台任务，不另开顶层对话；型号、权限和任务范围不放宽。包装器记的是 Codex 当前任务的完整编号，不借 Claude 的会话号；接着做时接回原来那一份，不重开一份。等候、额度和停止的共同办法见〔分工与并行施工〕。”在现有导语之后、第一卡之前。顶部巨大标题收为普通两行标题，小电脑装饰缩小或去掉，压合理外白腾位；现有两组正文不缩小、原字不减。原正确h/v2完全保护，不新增分张；统一全站绿白水彩标题/正文层级。（g4 补充）第 1 张里原先要求补画的导语原段“桌面子代理槽满时，转用命令行子代理……”已作废，改画 text 里新的那段（名额真满才转 GPT 包装器……）；这段比原来长，仍放在第 1 张、第一卡之前，第 1 张放不下时把“主对话是别家模型时”整组挪到第 2 张。",
  "links": [
   {
    "text": "AI工具配置管理",
    "href": "/projects/ai-cli-profile-manager/"
   },
   {
    "text": "约法 L23",
    "href": "/rules/charter/#L23"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/#p-gate"
   },
   {
    "text": "型号与派法",
    "href": "/rules/execution-coordination/#p-model-table"
   },
   {
    "text": "事实来源与任务上下文",
    "href": "/rules/context-sources/#p-compact-review"
   },
   {
    "text": "替我拟消息",
    "href": "/skills/reply-as-me/"
   }
  ],
  "anchors": [
   {
    "id": "p-dispatch",
    "text": "派子代理"
   },
   {
    "id": "p-gpt-root",
    "text": "主对话是 GPT 时"
   },
   {
    "id": "p-third-party-root",
    "text": "主对话是别家模型时"
   },
   {
    "id": "p-gate",
    "text": "重大动作前的把关"
   },
   {
    "id": "p-new-thread",
    "text": "新开一个顶层对话"
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
     "width": "100%",
     "text_ref": "人话要点 · 派子代理：Codex 的不同处"
    },
    {
     "type": "notice",
     "text_ref": "先说派谁"
    },
    {
     "type": "prose",
     "text_ref": "普通派活时，桌面子代理名额真满了"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "top",
     "width": "48%",
     "text_ref": "主对话是 GPT 时"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "top",
     "width": "48%",
     "text_ref": "主对话是别家模型时"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "bottom",
     "width": "48%",
     "text_ref": "重大动作前的把关"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "bottom",
     "width": "48%",
     "text_ref": "新开一个顶层对话"
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。03 横版移除重复绿书主插画，章节标题整行居中，卡片紧随标题与导语排列。卡内原小图标仍保留；不另提已被规格撤掉的主插画需求。",
   "prior_round_notes": "亲看h：大题左63%，右机器人小桥大插画卡外；导语在四卡前；四卡2×2上高下矮，图标卡内左，右卡头及正文。只保图标内部细连线，不加卡间连接或旧图Agents字。新构图，待样张：最新定稿有先说派谁提示及更长包装器导语，原图为旧短文，依定稿补全后高度待验。",
   "pending_requirements": [
    "新提示和更长包装器导语属于规格中新构图，待样张审定。"
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "人话要点 · 派子代理：Codex 的不同处"
    },
    {
     "type": "notice",
     "text_ref": "先说派谁"
    },
    {
     "type": "prose",
     "page_break_after": true,
     "text_ref": "普通派活时，桌面子代理名额真满了"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "主对话是 GPT 时"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "主对话是别家模型时",
     "page_break_before": true,
     "page_break_after": true
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "text_ref": "重大动作前的把关"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "text_ref": "新开一个顶层对话"
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。03 竖版移除主对话是别家模型时的 item_pages:[2,2]，该卡整卡另起一张、末尾整卡换张，四条在同一外卡完整出现。导语及其余卡仍按原顺序保留；不按条目切成无标题续框。",
   "prior_round_notes": "亲看原v与批准v2/v3：旧v有重复旧正文，按最新定稿只排一次。新构图，待样张：第1张新题及提示长导语；第2张GPT两条、别家前两条，无语义图标仅右上叶；第3张别家后两条无题续卡、把关左指路牌、新顶层左电脑。portrait残留两张与新增批准v3冲突，交Claude定。连续bullets不能内部text_ref，item_pages及分张需分页支持，不宣称已实现。",
   "pending_requirements": []
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
   "asset": "_library/icons/闸门.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "闸门",
   "source_phrase": "OpenAI 黑色花结标志牵出三根细线、“主对话是别家模型时”配两个不同颜色的小对话气泡中间一座小桥、“重大动作前的把关”配一道带小哨岗的栅栏门、“新开一个顶层对话”配一个新打开的对话气泡",
   "sha256": "eee93d6e0a2d4999039530b2ce668ce4beebb63c2370a8befee8c33aa87b4ae5",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-agents.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-agents",
   "source_phrase": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）；标题下面是不进卡片的完整导语（含桌面槽满转命令行的说明，按文字自然换行，不硬塞一行）（前面一个小绿圆点，config/model-roster.json 用等宽字体、浅绿底小框）。导语下面四张圆角卡片（白底、浅绿细边）排成两行两列：上行左“主对话是 GPT 时”（短）、右“主对话是别家模型时”（最长，可以比左边高）；下行左“重大动作前的把关”、右“新开一个顶层对话”（短）。小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片左上角一个小水彩图标：“主对话是 GPT 时”配 OpenAI 黑色花结标志牵出三根细线、“主对话是别家模型时”配两个不同颜色的小对话气泡中间一座小桥、“重大动作前的把关”配一道带小哨岗的栅栏门、“新开一个顶层对话”配一个新打开的对话气泡。每条要点前一个小绿圆点，正文深蓝灰；openai_child、openai_parent、openai_child_control、create_thread 用等宽字体、浅绿底小框。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。 同上：标题下面一张浅绿底圆角提示卡，“先说派谁”粗体深绿；其余版式照原图。（g4 补充）导语里“桌面槽满”那段已改成新文字（名额真满才转 GPT 包装器……），以 text 为准，按文字自然换行，排在“先说派谁”提示卡下面、四张卡上面；其余画法不变。",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/rule-codex-adapter-03-brush-v2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5b2d9db12c2c119eb149",
   "title_text": "人话要点 · 派子代理：Codex 的不同处",
   "sha256": "311a05806e0627b7f3bd966bbd9959de7d6b00acbfa4f202bc8e880d0c16ea56",
   "status": "ready",
   "source_box": [
    30,
    24,
    1079,
    159
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 派子代理：Codex 的不同处

**先说派谁**：主持的想和把关，具体活派出去；整段一两步小事顺手做；批量读取、摘录这类机械活和步骤简单的只读小单交 GPT-6.1 Sol medium；常规写代码、排障、调研、操作浏览器、按固定标准批量审图交 Sol ultra，更难的按场景升级；GPT-6 Luna 只照写好的提示生图、落盘，用 low；GPT-6.1 Terra 现在没有默认场景；疑难、最难、要紧审图交 GPT-6 Astra。主对话是别家模型时只派 Sol、Terra、Luna，本该交 Astra 的活改用 Sol ultra 或自己做。惊艳类的样板、关键部分交做得最好的亲手做；能力只看厂商和 AA 等权威评测。型号、档位换代时按公开数据重新评估、直接更新，不沿用旧设置。具体型号、档位和场景以模型清单为准，完整的表见〔型号与派法〕；共同原则见〔分工与并行施工〕。

普通派活时，桌面子代理名额真满了，才自动改用现成的 GPT 包装器接能做的活；登录、参数、网络这类故障先修真原因，不当成满了。唯一例外是主对话上下文压缩后自动做的那次只读复核：它是已授权的自动任务，直接用共用的 GPT 后台包装器，记真实的 Codex 父会话号，不用等名额满，也不因此让别的任务这样调用（完整流程见〔事实来源与任务上下文〕的“压缩后的后台复核”）。它仍是当前主对话管的后台任务，不另开顶层对话；型号、权限和任务范围不放宽。包装器记的是 Codex 当前任务的完整编号，不借 Claude 的会话号；接着做时接回原来那一份，不重开一份。新版包装器一次后台订阅后内部续等；Start 默认返回，要等加 -Wait；Watch 可在任一任务结束时叫醒，Resume 沿用原线程。派活单写清范围、授权、代码与测试上限、时限和验收方式；子任务要以本人身份和真人说话（客服、商家、卖家、房东、平台人工、微信联系人）或替本人拟要发出的消息时，派活单必须写一行“和真人说话按 reply-as-me”（即〔替我拟消息〕的规矩）；出处、方案和成本估算等栏可选，不因缺栏拒派；扩时和预算纠错写理由，验收后 Status -Ack。原生子代理和包装器子任务都一样：规则由根会话或包装器核验，子代理按需读给定版本的专题；出处由根会话负责，子代理不查出处、不报“无出处”，只按派单交付。等候、额度和停止的共同办法见〔分工与并行施工〕。

### 主对话是 GPT 时
- 桌面子代理有空位时，用 spawn_agent，按任务选 GPT-6 Luna、GPT-6.1 Sol 或 GPT-6 Astra，显式写 model 和 reasoning_effort：现在模型清单里，GPT-6.1 Sol 只读、步骤简单、代码上限为 0 的小单，以及给定材料的摘录对齐和调用链已定的机械流程填 medium，施工、要判断的分析和难活填 ultra（不用 high）；GPT-6 Luna 只照写好的提示生图、落盘，填 low，它以前的 max 等档位不再作为派单依据；Sol、Astra 原来派 xhigh 的改填 ultra；派完核对实际启动值。
- 跨型号、跨档位时不带或只带有限历史；只有参数相同、完整历史确有用时才全带。

### 主对话是别家模型时
- 桌面子代理有空位时，用 openai_child 只派 Sol、Terra、Luna，不派 Astra；入口由〔AI工具配置管理〕提供。
- 写明类型、型号、档位、任务名和交代，不传 fork_turns。续聊走同一入口；回话、查看、等待、停止各走它对应的控制入口。
- 子代理要再分工，回原父任务安排。Claude 派 Astra 的授权条件不套到这里，见〔约法 L23〕。
- 鉴权、参数、上下文等入口故障先修真实原因；主对话继续能做的部分，不乱换型号或绕过真实限制。

### 重大动作前的把关
- 资格与职责见〔重大动作与本人验证〕。主对话够格就自己判断；确需另派只交这次判断，不顺手实施或再委派。
- 别家主模型的可派范围仍是 Sol、Terra、Luna，不因把关职责扩大；独立复核另按共同原则安排。

### 新开一个顶层对话
- create_thread 可见时调用一次；失败或拿不到可追踪编号就说明，不盲目重试。
- 本人说联系、交给、转给某个对话（或“合适的对话”），是把事发给那个已经开着的对话或线程，不新开；确实找不到是哪个，再问本人一句。

::screen{#rule-codex-adapter-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-codex-adapter-04",
  "section": "points",
  "title": "人话要点：新消息里的状态、官方升级",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面两张圆角卡片（白底、浅绿细边）左右并排，左“新消息里的状态”、右“官方升级”；小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片左上角一个小水彩图标：“新消息里的状态”配开头插画里那个挂着两张小纸条的小铃铛、“官方升级”配一个带向上箭头的软件包盒子和一张门禁工牌。每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条放在浅绿底的小框里。codex-root、claude-root、ChatGPT.exe、OpenAI.Codex 用等宽字体、浅绿底小框。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，两张卡片从上到下一张一条、整宽，先“新消息里的状态”后“官方升级”。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "p-hook",
    "text": "新消息里的状态"
   },
   {
    "id": "p-upgrade",
    "text": "官方升级"
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
     "width": "100%",
     "text_ref": "人话要点 · 状态和升级"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "cards",
     "width": "48%",
     "text_ref": "新消息里的状态",
     "inset_prefixes": [
      "实例："
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "row": "cards",
     "width": "48%",
     "text_ref": "官方升级",
     "inset_prefixes": [
      "实例："
     ]
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。04 横版移除重复绿书主插画，章节标题整行居中，卡片紧随标题与导语排列。卡内原小图标仍保留；不另提已被规格撤掉的主插画需求。",
   "prior_round_notes": "亲看h：题在左半屏，右半卡外电脑桌面大图；下面两卡等宽。左铃铛纸条、右软件包箭头工牌，均左上叠卡头，正文整宽在下。升级第3条实例浅绿嵌框，卡间无连接。当前points_card图标及实例样式须组件支持并审样。",
   "pending_requirements": []
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点 · 状态和升级"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "page_break_after": true,
     "text_ref": "新消息里的状态",
     "inset_prefixes": [
      "实例："
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "官方升级",
     "inset_prefixes": [
      "实例："
     ]
    }
   ],
   "notes": "亲看v/v2：第1张居中毛笔题和状态整宽卡，铃铛左上探过卡顶及卡头，六条整宽；第2张只有无图居中卡头升级卡，七条及第3条例框。不加横版电脑桌面装饰，不添加原铃铛上未点名的品牌标志。分张要求待支持。 本轮只依据文字核对，未重新看图。",
   "prior_round_notes": "亲看v/v2：第1张居中毛笔题和状态整宽卡，铃铛左上探过卡顶及卡头，六条整宽；第2张只有无图居中卡头升级卡，七条及第3条例框。不加横版电脑桌面装饰，不添加原铃铛上未点名的品牌标志。分张要求待支持。",
   "pending_requirements": [
    "原竖版分张切口仍未落实，核心不消费page_break_after/item_pages；不能以总高度未超自动分张阈值称已按原图分张。"
   ]
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
   "source_phrase": "开头插画里那个挂着两张小纸条的小铃铛、“官方升级”配一个带向上箭头的软件包盒子和一张门禁工牌",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-agents.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-agents",
   "source_phrase": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面两张圆角卡片（白底、浅绿细边）左右并排，左“新消息里的状态”、右“官方升级”；小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画。卡片左上角一个小水彩图标：“新消息里的状态”配开头插画里那个挂着两张小纸条的小铃铛、“官方升级”配一个带向上箭头的软件包盒子和一张门禁工牌。每条要点前一个小绿圆点，正文深蓝灰；以“实例：”开头的那条放在浅绿底的小框里。codex-root、claude-root、ChatGPT.exe、OpenAI.Codex 用等宽字体、浅绿底小框。不画编号，不加要点以外的字。",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-codex-adapter/rule-codex-adapter-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e06583b464c3ac6a92f2",
   "title_text": "人话要点 · 状态和升级",
   "sha256": "65136208aa03449867dc41a132be52ecc0072803e6f7d3f58e61bdd1c25add87",
   "status": "ready",
   "source_box": [
    37,
    29,
    865,
    184
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 人话要点 · 状态和升级

### 新消息里的状态
- 本人每发一条真消息、Codex 每启动一个子代理，Hook 读一次当前的个人资料状态和本人接管状态，并告诉 Codex 本会话能核实的型号和思考档位。
- 这一轮读不到的就写“未知”；子代理启动时档位一律写“未知”，不借父会话的记录。为什么：派生的子代理，记录开头复制了一份父会话的设置，照着读就会把父会话的档位当成自己的。
- 资料锁着、未知或 Hook 出错时，根会话先重读状态；需要本人资料就先请本人验证，之后再查资料、派活和完整作答。子代理不自己验证，读取被拦、途中缺资料或到期时单行交回“需要本人资料：……”，根会话读报告处理；两者都不给降级回答，纯技术工作继续。
- 本人接管只认正式入口读回的那份授权和原来的截止时间。
- Hook 不替 AI 选型号和档位，不决定要不要派子代理，也不另设一本“派发许可”的登记。
- 现在有受管 Stop：从本轮真实汇报核对目标、版本、验收和缺口；有限读当前轮末尾，认真实业务的 blocked 与保护原因码，不认只读状态、子报告、源码、搜索例子或模型措辞。未实际发起解锁就拦下相应业务；普通技术任务无此信号直接放行。只向根会话给验证指令，同轮第二次只提示，最多 45 秒；解析或轮次核验失败仅放行受影响项并诊断，不输出对话、思考和报告。

### 官方升级
- Codex 的版本号、构建号、带版本号的安装目录和更新批次，都不能拿来卡“能不能用”。
- 密码中心顺着本人 Windows 账户里真实的进程祖先链往上找，找到登记过的 Codex 桌面应用本体，日常调用就自动认作 codex-root。
- 实例：认的是 OpenAI.Codex 这个软件包里的 ChatGPT.exe 本体；同一个包里的命令行程序单独跑，不算。
- 从 Claude 桌面版启动的 Codex 子进程，按它上面的 Claude 桌面版认作 claude-root，不按模型名字换身份。
- 官方更新后仍按同一账户、同一软件包和桌面本体核验，不用重新绑定密钥。
- 受管 Hook 的内容哈希只保护 Hook 自己：Hook 启动时先比对自己的哈希，对不上就只报“状态未知”，普通工作照常。
- 缺了可选的宿主信息，只让依赖它的那一项变成不明或不可用，普通项目照常。

::screen{#rule-codex-adapter-05 section="original"}

```typeset
{
 "screen": {
  "id": "rule-codex-adapter-05",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.codex-adapter.md",
   "release": "E331",
   "sha256": "d982f5455f63fc61c9a3fd433cab1b24c38de2b25716a4d43fd53c706377dbe7",
   "public_sha256": "ae67a463e28ac81948d3462fb90cec9ecce6087913efe01ce564109af7bfd580",
   "from": null,
   "to": "## 派子代理：Codex 的不同处",
   "start": 0,
   "end": 2395,
   "approved_omissions": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E187 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令、配置名和工具名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# Codex 适配”到“## 入口和新消息”一节结束（含“Codex 自动记忆的关闭配置……”那段）；右卡放“## 无限制授权”一节。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
  "links": [
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   },
   {
    "text": "共享经验的落点",
    "href": "/rules/context-sources/#共享经验的落点"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-codex-adapter/rule-codex-adapter-05",
  "source_logical_id": "codex_adapter_contract",
  "source_public_sha256": "ae67a463e28ac81948d3462fb90cec9ecce6087913efe01ce564109af7bfd580",
  "source_rule_part": "rule-codex-adapter/rule-codex-adapter-05"
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
     "columns": 1,
     "whole_block": true,
     "text_ref": "Codex 适配"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "无限制授权"
    }
   ],
   "notes": "横版按“Codex 适配及入口”和“无限制授权”使用两张全宽原文卡，保持全部原文顺序和代码链接；避免旧左右卡长度悬殊造成大块留白。",
   "prior_round_notes": "亲看h：外部小版本提示左上，下方两等宽长卡；左卡含普通Codex题、owner、入口全部，右授权整张卡。无毛笔题、笔刷线、图标或连线。内部命令浅绿等宽框按原定稿，不用活动E208替换E187正文。whole_block要求同卡多个h1/h2，当前组件分组须修复，原文卡待样张。",
   "pending_requirements": []
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
     "columns": 1,
     "whole_block": true,
     "text_ref": "Codex 适配"
    }
   ],
   "notes": "亲看v：一张整宽外卡含普通Codex题、入口、授权多个标题，外部版本提示在顶。不能机械按横版拆两卡，不加毛笔题、插画或笔刷。whole_block当前已实现，命令框可换行，正文不缩。 本轮只依据文字核对，未重新看图。",
   "prior_round_notes": "亲看v：一张整宽外卡含普通Codex题、入口、授权多个标题，外部版本提示在顶。不能机械按横版拆两卡，不加毛笔题、插画或笔刷。whole_block当前未实现，命令框可换行，正文不缩。",
   "pending_requirements": []
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
   "asset": "rule-codex-adapter/rule-codex-adapter-05-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d24e7f63be7a65c8632c",
   "title_text": "Codex 适配",
   "sha256": "f512b7a3f68a3c0149e74ecfe179f78a21be6c0f0b3adff0d11abb946a7bd9be",
   "status": "ready",
   "source_box": [
    55,
    128,
    289,
    177
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
   "asset": "rule-codex-adapter/rule-codex-adapter-05-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8350155947f7b71f7e57",
   "title_text": "入口和新消息",
   "sha256": "4c7a8e99ae60a10acf71f285cf513b5db7db157c164a84d591308dc647ea0114",
   "status": "ready",
   "source_box": [
    58,
    426,
    293,
    473
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
   "asset": "rule-codex-adapter/rule-codex-adapter-05-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7aaf9f13bf9d1731bada",
   "title_text": "无限制授权",
   "sha256": "9d8c04889eaec5fa60cdb5bdd1e79bc01fa89df04479b6dcf4a959603656985b",
   "status": "ready",
   "source_box": [
    877,
    128,
    1086,
    178
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E331 版，一字不改

# Codex 适配

owner: `E:\.agents`

只在用到 Codex 特有机制时读；共同原则见其他专题。

## 入口和新消息

Codex home 里的 `AGENTS.md` 只是入口，规则从核验过的活动版本读。真实的新消息和自动续作、上下文压缩、工具消息分开看；Hook 会把个人资料状态带进来，Hook 缺失或投递不明时，资料状态按不明处理，并先用 `StatusPersonalEnvironment` 重读。锁着或不明时不取用私人资料；根会话问到本人自己的事，第一步先请本人验证解锁，通过后再查资料、派子代理和作答，不给降级回答；纯技术工作照常。调用 MCP 不改变本机 Codex 原来的任务入口。新消息、Hook、子代理的真实身份和执行结果从本机现役入口核实，不从标题、模型自述或别的宿主遗留的环境借身份。

SessionStart 的 startup/compact/resume 按[长任务接续](/rules/context-sources/#长任务接续)执行，不注入决定短表或要求表；原生子代理压缩跳过 SessionStart 时，也按该节读原任务状态。

根会话压缩后的只读复核按[共用复核规则](/rules/context-sources/#压缩后的后台复核)执行。此项已授权自动任务使用共用 GPT 后台包装器，并保留真实 Codex 父会话号；不受普通派发的“原生满槽才转包装器”条件限制，不扩大其他任务的调用范围。程序换窗是否触发与原生压缩分开核验，具体入口见运维说明（`E:/.agents/docs/operations/context-hooks.md`）。

Codex 自动记忆的关闭配置是 `memories=false`、`generate_memories=false`、`use_memories=false`；需要留下的内容统一按[共享经验的落点](/rules/context-sources/#共享经验的落点)处理，Codex 工具的已核实教训归本专题。

**浏览器**：Codex 桌面版的主对话和它用原生机制派的子代理，访问网站、看网页、用本人登录状态，都不调用桌面自带的浏览器工具（Chrome 插件、电脑操作插件的 `cua_repl`、应用内浏览器），一律和 Claude 一样，用共用包装器（`#原生容量不足时转用共用包装器`）派 GPT 子代理去做：带 `-ParentHarness Codex` 和当前真实父任务完整编号，型号和档位按 `config/model-roster.json` 的浏览器场景；这类网页任务不受“原生满槽才转包装器”的限制，派单按“派活松紧怎么定”写目标、已知事实、底线和完成标准，页面或入口只作参考，不叫子代理改用 `cua_repl`。包装器派出的子代理用 `agent.browsers.get("chrome")` 在本人 Chrome 自己新开的后台标签页里操作，不用 `getDefault()`、`getForUrl()` 或 `iab` 让运行时代选。应用内浏览器只用于本机文件、本地预览或本人当轮点名时。本机渲染范围与子代理连不上时的处理按[浏览器规则](/rules/capabilities-runtime/#浏览器)执行。这是可由本人当场改的默认。

## 读取聊天结果

仅查看进度时优先用 `wait_threads` 的紧凑快照；确需正文才用 `read_thread`。`turnLimit` 限制轮数，`maxOutputCharsPerItem` 约束工具说明列出的单项输出或聊天消息，都不是总输出大小保证。

`read_thread` 的消息 `id` 可能与原话存档的 `uuid` 不同；登记源消息 UUID 时，按对应原话存档的 `uuid` 填写，不能直接拿读取结果的 `id` 替代。

在 `functions.exec` 内解析返回的 JSON，只输出本次所需字段或消息，并对输出设总字数上限；更多内容按游标或明确选择续取，不直接 `text` 整个结果或把原始大数组回灌上下文。调用参数以当前工具能力为准；必须完整阅读的规则或原文仍要分段取齐。

## 定时任务和收尾

- Codex 定时任务每跑一轮，同样用结论回执命令把一句人话结论写进驾驶舱，见[能力与运行方式](/rules/capabilities-runtime/#汇报网站和自动运行的东西)“定时任务的结论写进驾驶舱”。
- Codex 没有结构化的收尾工具：本轮有要本人定或做的事时，最后一条回复的最后一行写“【等你】<一句人话>”，钩子据此登记驾驶舱、本人回复后关闭；没有等本人的事就不写这一行。

## 无限制授权

本人要给当前 Codex 对话开无限制授权时，直接运行 PCConfig 安装好的 `Invoke-OwnerTakeover.ps1 -Operation Open`，不先派模型判断。`HostTaskId` 只传当前宿主真实的线程 ID，不借历史任务、MCP 连接或别的对话。Open 会生成这次的配对和请求编号，用 Windows 现有的提权能力，弹出独立窗口让本人只填时长；回执里应有 `grant_type=unrestricted`。本人验证完成后，由 Hook 自动回读并使用这份授权（`CheckHost`）；模型不手动串 `Configure/Prepare/Activate/Status/Check`，也不反复打开窗口。必要的子代理沿用同一请求和原截止；本地命令带同一组三个接管环境值，不改用户级或机器级环境变量。回执丢了先查原请求，不自动重弹窗口或重新验证。入口真的报错时才去定向诊断。

::screen{#rule-codex-adapter-06 section="original"}

```typeset
{
 "screen": {
  "id": "rule-codex-adapter-06",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.codex-adapter.md",
   "release": "E331",
   "sha256": "d982f5455f63fc61c9a3fd433cab1b24c38de2b25716a4d43fd53c706377dbe7",
   "public_sha256": "ae67a463e28ac81948d3462fb90cec9ecce6087913efe01ce564109af7bfd580",
   "from": "## 派子代理：Codex 的不同处",
   "to": null,
   "start": 2395,
   "end": 5574,
   "approved_omissions": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行画成小绿圆点列表；**…** 是粗体，星号不画；`…` 里的路径、命令、配置名和工具名用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 派子代理：Codex 的不同处”一节（导语和五条）；右卡放“## 新消息里的状态”和“## 官方升级”两节。",
  "portrait": "竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/#重大动作前的把关"
   },
   {
    "text": "分工与并行施工的共用接续",
    "href": "/rules/execution-coordination/#原生容量不足与原线程接续"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-codex-adapter/rule-codex-adapter-06",
  "source_logical_id": "codex_adapter_contract",
  "source_public_sha256": "ae67a463e28ac81948d3462fb90cec9ecce6087913efe01ce564109af7bfd580",
  "source_rule_part": "rule-codex-adapter/rule-codex-adapter-06"
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
     "columns": 1,
     "whole_block": true,
     "text_ref": "派子代理：Codex 的不同处",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "新消息里的状态",
     "body_columns": 1
    }
   ],
   "notes": "亲看h：外部小原文续提示，下方等宽两卡。左派子代理及五条，右同一张卡含状态和升级两节，普通小标题浅绿横条。无毛笔题、笔刷、插画或连接。长命令及High保原定稿。whole_block已支持右卡，保持同卡两节。 本轮只依据文字核对，未重新看图。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "prior_round_notes": "亲看h：外部小原文续提示，下方等宽两卡。左派子代理及五条，右同一张卡含状态和升级两节，普通小标题浅绿横条。无毛笔题、笔刷、插画或连接。长命令及High保原定稿。whole_block须支持右卡，不得拆成两外卡。",
   "pending_requirements": []
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
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "text_ref": "派子代理：Codex 的不同处",
     "page_break_after": true
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "新消息里的状态"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "官方升级"
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。06 竖版派子代理原文卡移除 item_pages:[4,1]，整卡另起并整卡结束换张；撤掉卡内重复绿书插画。原文各条一次保留，行内代码字号问题交 comp-text 请求，未视为已修。；page-fixer-03第二轮：派子代理首完整卡撤前换张，原文续标题与首卡同页，后换张保留。",
   "prior_round_notes": "亲看v/v2：第1张原文续、派子代理导语前四条，卡底确有手机、媒体、硬盘、云朵和虚线箭头大插画；inventory误写零。第2张最上无题续卡接第5条，随后状态和升级各整宽卡。均普通标题，不加毛笔。插画manifest缺失要补素材；bottom_inside、item_pages为真实构图要求，连续bullets不可内部text_ref，需组件分页支持并样张。",
   "pending_requirements": []
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/main-agents.png",
   "fallback": false,
   "key": "main-agents",
   "source_phrase": "派子代理：Codex的不同处\n共同原则见分工与并行施工，可派范围见config/model-roster.json。\n主对话是GPT时：用原生子代理（spawn_agent），在GPT-6Luna、Sol、Astra里按难度选，显式传model和reasoning_effort，派完核对实际启动值。跨型号或跨档位时fork_turns用none或有限轮数；只有身份参数相同、完整历史确实有用时才用all。主对话是其他公司的模型时：可以派GPT-6Sol或Luna，不派Astra。直接调用宿主工具openai_child，显式填写agent_type、model、reasoning_effort、task_name、message，不传fork_turns；续聊走同一入口，子代理回话走openai_parent，查看、等待和停止走openai_child_control。子代理要再分工时，回原父任务安排。约法L23里“实际调用按我给这个对话或项目的授权”说的是Claude调用Codex，不给Codex自己派GPT子代理另加一次授权要求。入口不可用时，主对话继续能做的部分，说清实际缺口，不悄悄换模型，也不借别的通道绕过真实限制。重大动作前的把关（见重大动作与本人验证）：用GPT-6Sol或Astra的High以上。根会话够格就自己判断；确实需要另派时，用普通子代理入口明确填写型号和思考档位，只交这一次判断，不让它顺手实施或再委派。独立复核按分工原则另行安排。AICLI配置和其他后端任务不是桌面原生子代理，不用来代替失败的openai_child。新开顶层对话时，工具可见就调用一次create_thread，不预判失败、不要求本人重说；工具报错或拿不到可追踪的编号就停下说明，不盲目重试。",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-codex-adapter/rule-codex-adapter-06-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fcd24f348b09c36fbafe",
   "title_text": "派子代理：Codex 的不同处",
   "sha256": "658e4ddf3f37d5acfa092a0a22815fa38117a89c2c87bdaf4b972aa3fb036993",
   "status": "ready",
   "source_box": [
    52,
    109,
    576,
    174
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
   "asset": "rule-codex-adapter/rule-codex-adapter-06-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-3f2f4a6c0064aa6ebdbe",
   "title_text": "新消息里的状态",
   "sha256": "29a550e54f98d0f583f4c203f267ca7645f728da75fca2a34f8c55bb8e96bc3f",
   "status": "ready",
   "source_box": [
    876,
    108,
    1179,
    174
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
   "asset": "rule-codex-adapter/rule-codex-adapter-06-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-codex-adapter\\img\\rule-codex-adapter-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-fe23a6356f7f7f4a3b82",
   "title_text": "官方升级",
   "sha256": "9f117e9da591e4806629790c0a51fbc4cc42e93b6426672d7e4601adc1838423",
   "status": "ready",
   "source_box": [
    875,
    453,
    1066,
    524
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E331 版 · 续

## 派子代理：Codex 的不同处

共同原则见[分工与并行施工](/rules/execution-coordination/)，可派范围见 `config/model-roster.json`。
原生子代理和包装器子任务统一按[子代理原则](/rules/execution-coordination/#派子代理的原则)及[派活松紧怎么定](/rules/execution-coordination/#派活松紧怎么定)交付；核验由根或包装器完成，子代理按需读给定版本的专题。

原生 GPT 的 `reasoning_effort` 按共同原则第 4 条和模型清单 `routing.effort_rule` 填写；其他厂商沿用各自设置。型号换代按[新型号怎么调研](/rules/execution-coordination/#新型号怎么调研)重评。

- **主对话是 GPT 时**：容量够用时优先用原生子代理（`spawn_agent`），按模型清单 `routing` 的场景表和难度分级（GPT 那一列）选型号和档位，可派型号、档位和适用范围见 `hosts.codex.root_openai`；表里写“交 Claude”的活怎么办见 `routing.vendor_rule`。显式传 `model` 和 `reasoning_effort`，派完核对实际启动值。跨型号或跨档位时 `fork_turns` 用 `none` 或有限轮数；只有身份参数相同、完整历史确实有用时才用 `all`。
- **主对话是其他公司的模型时**：可派型号见模型清单对应宿主的范围，不派 Astra。容量够用时优先调用宿主工具 `openai_child`，显式填写 `agent_type`、`model`、`reasoning_effort`、`task_name`、`message`，不传 `fork_turns`；续聊走同一入口，子代理回话走 `openai_parent`，查看、等待和停止走 `openai_child_control`。子代理要再分工时，回原父任务安排。约法 L23 里“实际调用按我给这个对话或项目的授权”说的是 Claude 调用 Codex，不给 Codex 自己派 GPT 子代理另加一次授权要求。入口因容量以外的原因不可用时，主对话继续能做的部分，说清实际缺口，不悄悄换模型，也不借别的通道绕过真实限制；容量不足按下面的例外办理。
- **重大动作前的把关**：型号、最低档位和职责统一见[重大动作与本人验证](/rules/protected-actions/#重大动作前的把关)。确实需要另派时，用当前宿主的普通子代理入口明确填写符合要求的型号和思考档位；主对话为其他公司的模型时仍从上面的可派范围选择，不凭把关职责扩大可派型号。独立复核按分工原则另行安排。
- AICLI 配置和其他后端任务不是桌面原生子代理，不用来代替因鉴权、参数、上下文或真实能力限制而失败的 `openai_child`。仅宿主原生容量不足时，按下面的已授权例外转用共用包装器；其他失败按真实原因修好后继续，不随意换型号或通道。
- **和真人说话**：子任务要以本人身份和真人对话（客服、商家、卖家、房东、平台人工、微信联系人）或替本人拟要发出的消息时，派单必须写一行“和真人说话按 reply-as-me”。
- **“联系某个对话”是发给已开着的那个对话**：本人说联系、交给、转给某个对话（或“合适的对话”），是把事发给那个已有对话或线程，不新开；确实找不到是哪个时再问本人一句。
- 新开有独立成果和责任的顶层对话时，工具可见就调用一次 `create_thread`，不预判失败、不要求本人重说；工具报错或拿不到可追踪的编号就停下说明，不盲目重试。原生槽满时的后台子任务仍由当前根对话管理，不用 `create_thread` 建顶层替身。

### 原生容量不足时转用共用包装器

实时确认宿主原生槽不足后，自动转用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，显式传 `-ParentHarness Codex` 和 `-SessionId '<当前真实父任务完整编号>'`。默认结果目录是 `E:\Cache\Codex\Temp\<完整SessionId>\gpt-children`，不借 Claude 会话号或截短编号。容量判断、回执不明时的核对、同额度子代理续作及后台管理统一见[分工与并行施工的共用接续](/rules/execution-coordination/#原生容量不足与原线程接续)，不因入口改变扩大授权和业务范围。

```powershell
$child = 'E:\.agents\tools\Invoke-ClaudeGptChild.ps1'
& $child -Mode Start -ParentHarness Codex -SessionId '<当前真实父任务完整编号>' -PromptFile '<任务.md绝对路径>' -Model gpt-6.1-sol -Effort ultra -NewWorktree -RepoPath '<仓库绝对路径>' -TaskName '<短名>' -ContinueOnQuota
& $child -Mode Watch -RunDirs @('<结果目录>')
& $child -Mode Resume -RunDir '<同一结果目录>' -PromptFile '<续作.md绝对路径>'
```

执行器监测、订阅、接续状态和参数用法只见派发说明（`E:/.agents/docs/claude-gpt-child-dispatch.md`），与 Claude 共用。

上例的 `-ContinueOnQuota` 只在同额度根会话仍能正常调用时启用。派活字段、预算和验收只见派发说明；修改仓库用任务专用工作树，只读用 `-WorkDir '<已有目录>'`。

## 新消息里的状态

Hook 每条真实新消息和子代理启动带来共享资料、本人接管及可核实的型号和档位；未知如实写，子代理启动不借父记录。根状态未知用 `StatusPersonalEnvironment` 回读；个人资料的判断、解锁和缺口交回按[资料锁](/rules/privacy-data/#个人资料的锁和解锁)与共同原则第 7 条，纯技术工作继续。

Stop 与 Claude 共用版本、明确 Report 目标集合、验收和资料缺口检查；首次拦截按真实原因补解锁或验收，同轮第二次只提示。边界核验失败只放行受影响检查并留诊断码。Hook 不选型号、档位或是否委派，不加派发许可、不按关键词弹验证。具体接线见状态钩子（`E:/.agents/docs/operations/context-hooks.md#个人资料先解锁与结束兜底`）。

## 官方升级

Codex 的版本号、构建号、带版本的安装目录和更新批次都不能当可用性门槛。密码中心沿本人 Windows 账户的真实祖先链识别登记包族的 Codex 桌面应用本体，日常调用自动选择 `codex-root`；从 Claude 桌面启动的 Codex 子进程按其 Claude 祖先识别为 `claude-root`，不按模型名称改换主体。官方更新后仍按同一账户、包族和桌面本体核验，无需运行时密钥续绑。受管 Hook 的内容哈希只保护 Hook 自身；缺了可选的宿主信息，只让依赖它的那项能力变成不明或不可用，普通项目照常。
