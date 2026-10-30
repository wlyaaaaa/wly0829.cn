---
{
 "title": "学习方法技能",
 "kind": "skill",
 "url": "/skills/learning/",
 "tagline": "说一句“接着上次讲”，AI 老师就接着教。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "examples",
   "label": "例子"
  },
  {
   "id": "abilities",
   "label": "能做的事"
  },
  {
   "id": "limits",
   "label": "边界"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-learning",
  "kind": "skill",
  "title": "学习方法技能",
  "url": "/skills/learning/",
  "tagline": "说一句“接着上次讲”，AI 老师就接着教。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-24 12:59"
   },
   "facts": [
    "10 月 18—24 日 AI 用了 9 次"
   ],
   "as_of": "2026-10-24",
   "source": "状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 12:59取这段已完成账本中的最近事件，不限于7天。这里的次数9次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。"
  },
  "based_on": {
   "commit": "ad3980780006354b3637de3734aa7c0be2673ac2",
   "commit_time": "2026-09-26T04:00:04+08:00",
   "file": "E:\\.agents\\skills\\<学习技能>\\SKILL.md；学习仓库 3ee9d6a（2026-09-28T04:54:22+08:00）的 AGENTS.md、讲义原则.md、当前状态.md"
  },
  "video_prompt": "",
  "registry": {
   "mentions": [
    {
     "target": "/projects/learning/",
     "screen": "skill-learning-01",
     "text": "学习方法"
    },
    {
     "target": "/projects/learning/#features",
     "screen": "skill-learning-03",
     "text": "去看全部功能"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "skill-learning-03",
     "text": "资料锁的规则"
    },
    {
     "target": "/skills/work-delivery/",
     "screen": "skill-learning-04",
     "text": "工作支持与交付技能"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-learning-04",
     "text": "个人正式文书技能"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能说明里列出的其余几类用途（和学习无关的那部分）按本人决定不上网站、不提存在。",
    "技能的英文名不写：名字里带不上网站的词；页面叫“学习方法技能”。",
    "sha256:3662122ce2ccd35304dadff4db86d24d92f3efa299527e407136247735d6b7f6"
   ],
   "unsure": [
    "第 2 屏的例子是编的：两处学生错误是虚构的，用来演示做法，不点名具体讲了什么。",
    "第 4 屏“不管”里的两个技能页网址 /skills/work-delivery/、/skills/personal-formal-documents/ 是按技能名推的，请拼页时核对 slug。",
    "“怎么跟 AI 说”的十二句是按项目规则和功能写的可用说法，不是本人说过的原话；“接着上次讲”“这段没听懂”底稿里有。替本人口吻，上线前请本人过目。",
    "第 3 屏“讲课、写讲义、审稿各用哪个模型……按项目规则”：技能源文件原话是“以项目规则为准，当前宿主做不到时如实说明缺口，不静默换用别的模型”。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-learning/page.json",
  "sha256": "ac4fb18dac2275545020c5578a72d5fbc7cdd189c56c35b9d14b064f3260a6fe",
  "converted_at_beijing": "2026-10-31T04:12:54+08:00"
 }
}
---

::screen{#skill-learning-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-learning-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（入口那一行，项目名画成链接）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：十二句说法，每句画成一个浅绿色圆角对话气泡，两列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一本摊开的绿色讲义旁边一个对话气泡，气泡里一个小问号（讲义上只画浅灰短线）。",
  "portrait": "竖版：标题和入口一行；“它做什么”和浅绿小字段落；插画缩成一行；十二个对话气泡一行一个。",
  "links": [
   {
    "text": "学习方法",
    "href": "/projects/learning/"
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
     "text_ref": "学习方法技能",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "large",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 24 日 12:59",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 9 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 24 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 12:59取这段已完成账本中的最近事件，不限于7天。这里的次数9次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "prose",
     "text_ref": "学习方法",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么",
     "row": "body",
     "width": "42%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "text_ref": "我说要上课",
     "row": "body"
    },
    {
     "type": "notice",
     "text_ref": "不用点名",
     "row": "body"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "body",
     "width": "58%",
     "align": "center"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "align": "left",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "paragraph_bubbles": true,
     "container": "conversation_card",
     "tail": true,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "bubble_columns": 3,
     "split_paras": true
    }
   ],
   "notes": "已实看原图：上左浓毛笔标题和入口链接、上右书本问号大插画；下左它做什么说明卡、末段不用点名在卡内浅绿提示；下右怎么跟AI说整张大卡，十二气泡按定稿顺序两列六排，无箭头或丝带。notice_ref/paragraph_bubbles/container 为待组件承接的真实构图；现组件会把十二句并成一个气泡。提示嵌卡与两列气泡未出现在批准样板，待组件样张。 页代理一轮回修：外层只有一张对话卡，columns=1；卡内气泡分栏由bubble_columns记录横2竖1，避免当前组件把唯一大卡压到半栏。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "学习方法技能",
     "align": "center",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 24 日 12:59",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 9 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 24 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 12:59取这段已完成账本中的最近事件，不限于7天。这里的次数9次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。"
    },
    {
     "type": "prose",
     "text_ref": "学习方法",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么"
    },
    {
     "type": "prose",
     "text_ref": "我说要上课"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "align": "center"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "columns_v": 1,
     "paragraph_bubbles": true,
     "container": "conversation_card",
     "tail": true,
     "bubble_columns": 1,
     "split_paras": true
    }
   ],
   "notes": "已实看原竖图：标题、入口链接、书本大插画、它做什么卡（含不用点名浅绿提示）、怎么跟AI说卡，十二气泡逐条单列。插画在卡外，气泡无连线。整屏大标题按本人追加要求居中，原图左起位置不作为取消居中的依据。现对话组件逐句气泡与卡内提示待承接样张。 页代理一轮回修：外层只有一张对话卡，columns=1；卡内气泡分栏由bubble_columns记录横2竖1，避免当前组件把唯一大卡压到半栏。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
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
   "asset": "_library/round3/clean-assets/png/39-main-learning-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-learning",
   "source_phrase": "右上角一幅小插画：一本摊开的绿色讲义旁边一个对话气泡，气泡里一个小问号（讲义上只画浅灰短线）。",
   "sha256": "6783142750756868f710b07ddd24707f33da4acbd83331629c187aab2a444720",
   "status": "ready",
   "original_elements": [
    "一本摊开的绿色讲义旁边一个对话气泡，气泡里一个小问号（讲义上只画浅灰短线"
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
   "asset": "_library/titles/title-915c18abd56f47e782dc.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-915c18abd56f47e782dc",
   "title_text": "学习方法技能",
   "sha256": "d387a24ce60c31a59f8bfde25945ffadd42f0a6c2232a95ddcaa2879141e4ee2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

学习方法技能

〔学习方法〕项目的入口

**它做什么**
我说要上课、接着学、没听懂、觉得不对，AI 就照这个技能进入学习项目：先读项目规则和“现在停在哪”那份文件，找到今天该讲哪一课，按当天那篇讲义开讲；讲完把学到哪写回去。老师是 Claude Opus 5.5，GPT-6 Astra（max 思考档）帮忙复核和施工。

不用点名：说到学习路线、讲义、上课、练习、学到哪了，AI 自己会用上它。

**怎么跟 AI 说**
“接着上次讲。”
“今天学哪一课？”
“这段没听懂，打个比方重讲。”
“这里怪怪的，我说不上来哪里不对。”
“拿我自己的项目举个例子。”
“这一步我想自己跑一遍，带我跑。”
“出今天的每日一页。”
“考我几道上周学的。”
“先别讲新的，把上次那段再过一遍。”
“今天的课算完成了吗？没讲完的挪到哪天？”
“学到哪了？还剩几课？”
“有新的课程资料了，看看要不要改课。”

::screen{#skill-learning-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-learning-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（示例那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”四步画成一条细竖线串起的四个小节点（每个节点一个小水彩图标：一张图钉钉着的便签、一叠讲义抽出一张、一块发绿光的小显卡和三个对话气泡、一本日历打上绿勾），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。",
  "portrait": "竖版：标题和示例标签；对话从上到下：我的气泡、四步、AI 的回复；“另一种问法”卡片放在最后。",
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
     "text_ref": "一个完整例子",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "example",
     "width": "65%",
     "size": "large",
     "inline_row": "example-title",
     "inline_width": "58%"
    },
    {
     "type": "tag",
     "text_ref": "示例：",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "example",
     "tone": "gray",
     "inline_row": "example-title",
     "inline_width": "42%"
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "example",
     "sides": [
      "right"
     ],
     "tail": true
    },
    {
     "type": "section_heading",
     "text_ref": "AI 做了什么",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "example",
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "1先读学习项目",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "row": "example",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/icons/双气泡.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ],
     "container": "example_main",
     "direction": "vertical"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "row": "example",
     "sides": [
      "left"
     ],
     "tail": true
    },
    {
     "type": "dialogue",
     "text_ref": "另一种问法",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "paragraph_bubbles": true,
     "container": "alternative_card",
     "sides": [
      "right",
      "left"
     ],
     "illustration_index": 0,
     "split_paras": true
    }
   ],
   "notes": "已实看原横图：左约65%主对话整卡，右约35%另一种问法整卡从顶到底；标题与灰示例标签在左栏顶部旁排。我的气泡右齐；AI做了什么四步单列，细竖线串起左侧图标，正文右侧圆角卡；AI交回白底左气泡。右卡问答两气泡，书本插画在底部卡内。当前row只能两栏堆叠，placement/container/段落气泡/卡底插画及单列步骤左图右文待组件支持。该气泡与竖流程组合需样张。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。；主布局接任：章标题与原灰示例标签通过inline_row同高旁排；另一种问法继续位于AI交回后通栏，不恢复右侧短栏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例：",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "tone": "gray"
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "sides": [
      "right"
     ],
     "speaker_position": "right_outside"
    },
    {
     "type": "section_heading",
     "text_ref": "AI 做了什么",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "1先读学习项目",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "columns_v": 1,
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-38a3e62e6a9c7275cc49.png",
      "_library/icons/双气泡.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ],
     "direction": "vertical"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "sides": [
      "left"
     ],
     "tail": true
    },
    {
     "type": "dialogue",
     "text_ref": "另一种问法",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "paragraph_bubbles": true,
     "container": "alternative_card",
     "sides": [
      "right",
      "left"
     ],
     "tail": true,
     "split_paras": true
    }
   ],
   "notes": "已实看v和pages-approved替换v2：首张标题/灰示例条、右侧人物与我的气泡、四个左图右文整宽步骤，左侧细竖线；续张AI交回在上、另一种问法在下，两个粗体绿小标题，问答整宽气泡，无书本大插画。续张标题改粗体，按替换图不恢复旧毛笔。整屏章节标题居中。当前dialogue无法逐段问答分泡，numbered_steps左图右文与人物外置待组件样张；正文不缩字。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
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
   "source_phrase": "一张图钉钉着的便签",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "学习书笔",
   "source_phrase": "一叠讲义抽出一张",
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
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一块发绿光的小显卡和三个对话气泡",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
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
   "source_phrase": "一本日历打上绿勾",
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
   "asset": "skill-md-to-pdf/skill-md-to-pdf-02-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1bd7ab40a6647c38f32a",
   "title_text": "一个完整例子",
   "sha256": "ebeedcd896facfd1af9e0b5b28e5faf151361e1fe40c83443eab292fd4e32f07",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一个完整例子

示例：照这个技能的做法写的，不是某一次的记录

我：“接着上次讲。”

**AI 做了什么**
1. 先读学习项目的规则，再完整读“现在停在哪”那份文件：今天从上次停下的那一节接着讲；不从旧计划恢复，也不把整套讲义一次读进来。
2. 拿出当天那一篇讲义（前一天下课后已按反馈定稿），打开讲义所在的文件夹。
3. 开讲：先说今天要讲清什么问题，再拿一个能原样重跑的小例子讲清这一节的关键机制；讲一小段，停下来让我用自己的话说一遍，再追问。
4. 下课前说清今天完成没有，把这一课记上日期，记下上了多少分钟。

**AI 交回**
“今天这一课讲完了，计划完成。你刚才把两个相近的概念说混了，我已经指出差在哪；下一课开头我再用一个例子帮你对一遍。下次接着讲下一课。”

**另一种问法**
我：“这里怪怪的，我说不上来。”
AI：“我拿讲义里这一句去对，你别扭的是不是这里？这句确实说得不准，原因写错了。我改成了准确的说法，并把讲义和后面两篇里的同一种说法一起改掉了。”

::screen{#skill-learning-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-learning-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，七条短句两列排，每条前一个小水彩图标（一张图钉便签、一只按住整叠纸的手、一把钥匙、两个模型标志、一架天平、一个对话气泡里一个“改”字、一只小乌龟）。",
  "portrait": "竖版：横幅和按钮在上（按钮单独一行）；七条规矩一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/learning/#features"
   },
   {
    "text": "资料锁的规则",
    "href": "/rules/privacy-data/"
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
     "type": "notice",
     "text_ref": "能做的事",
     "align": "left",
     "columns": 3,
     "illustration": "none",
     "connector": "none",
     "size": "medium",
     "layout": "inline_title_prose_button",
     "button_align": "right",
     "inline_button": true
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "item_layout": "individual_cards",
     "item_columns": 2,
     "column_fill": "column",
     "column_counts": [
      4,
      3
     ],
     "container": "rules_card",
     "card_title_size": "medium",
     "item_cards": true,
     "inner_columns": 2
    }
   ],
   "notes": "已实看批准横图：顶部浅绿整宽横幅，左为中档毛笔能做的事，中间介绍段，最右去看全部功能按钮；下方整张规则卡，大绿卡头下七条小卡左四右三，按列顺序，每条小图标在左、正文在右。不能改成Z字两列或七条裸清单。title_strip 当前仅竖向输出节点；item_columns/column_fill/column_counts 记录构图但现points_card未实现逐项图标小卡。此横幅和内嵌七小卡需组件样张。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
  },
  "v": {
   "blocks": [
    {
     "type": "notice",
     "text_ref": "能做的事",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "medium",
     "layout": "stack_title_prose_button",
     "button_align": "center",
     "button_outside": true,
     "inline_button": true
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "align": "left",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "icons": "none",
     "item_layout": "individual_cards",
     "item_columns": 1,
     "container": "rules_card",
     "card_title_size": "medium",
     "item_cards": true,
     "inner_columns": 1
    }
   ],
   "notes": "已实看原竖图：上方整宽浅绿介绍横幅，能做的事标题居左且属于横幅，按钮在横幅外独立居中一行；下方整张规矩卡，卡头下七条左图右文小卡单列。嵌在para中的链接仍只出现一次，不从定稿另造按钮字。button_outside 与逐项小卡当前未消费，待组件样张。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
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
   "source_phrase": "一张图钉便签",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只按住整叠纸的手",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一把钥匙",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
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
   "source_phrase": "两个模型标志",
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
   "asset": "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "天平",
   "source_phrase": "一架天平",
   "sha256": "4b72accf42775e0407daa6539d3442c05d1f7885c446c9cd1eee55c2af7077f0",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "双气泡",
   "source_phrase": "一个对话气泡里一个“改”字",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一只小乌龟",
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
   "asset": "_library/round3/titles/title-r3-7dadc2c869cdb800f4de.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事

这个技能能做的事，就是学习方法项目的全部功能：排课和备课、上课和练习、反馈和纠错、接着学。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 先读项目规则和“现在停在哪”那份文件，从那里接着做；不从旧计划恢复任务。
- 只按当前问题读需要的文件，不把整套讲义和资料一次灌进来。
- 读我的学习记录前，先核对个人资料的解锁状态：〔资料锁的规则〕。
- 讲课、写讲义、审稿各用哪个模型、多深的思考，按项目规则；当前环境做不到就照实说，不悄悄换别的模型。
- 技术上的对错和改法老师直接定、改完给我看；只有涉及我的经历、目标、花钱、授权和对外动作，才请我定。
- 我凭直觉质疑时，先按证据判断，不因为被质疑就改口。
- 慢慢来：给我看的讲义第一稿就按终稿的质量准备，不为赶时间先交半成品。

::screen{#skill-learning-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-learning-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左右两张卡片：左“管”（卡片顶上一个绿色对勾），右“不管”（卡片顶上一个浅灰小叉）；每张卡片里带小圆点的短句。“不管”那几条后面的链接画成白底细绿边的小按钮。最下面一行浅绿底小字（最后一句）。",
  "portrait": "竖版：标题；“管”卡片在上、“不管”卡片在下；最后一句一行。",
  "links": [
   {
    "text": "工作支持与交付技能",
    "href": "/skills/work-delivery/"
   },
   {
    "text": "个人正式文书技能",
    "href": "/skills/personal-formal-documents/"
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
     "text_ref": "边界",
     "align": "center",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "limits",
     "width": "50%",
     "icons": "auto",
     "item_layout": "individual_cards",
     "heading_icon": "check",
     "inline_links": "button",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/代码窗口.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "不管",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "row": "limits",
     "width": "50%",
     "icons": "auto",
     "item_layout": "individual_cards",
     "heading_icon": "cross",
     "inline_links": "button",
     "icon_position": "header_left",
     "header_icon": [
      1
     ]
    },
    {
     "type": "notice",
     "text_ref": "老师只读",
     "align": "center",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "已实看原横图：全宽章节标题按本人追加要求居中；下方管/不管各50%整卡，两卡组名居中，旁有对勾/灰叉；各三条左图右文小卡、绿点。右卡两技能链接为白底细绿边小按钮；底部满宽浅绿提醒，乌龟在左。heading_icon/item_layout/inline_links 图形与按钮只改变已定文字呈现，不加字。现points_card未支持内嵌条卡/图标/链接按钮，notice未支持左图；需样张。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "columns": 1,
     "illustration": "none",
     "connector": "none",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "item_layout": "individual_cards",
     "heading_icon": "check",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/代码窗口.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "不管",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "item_layout": "individual_cards",
     "heading_icon": "cross",
     "inline_links": "button",
     "icon_position": "header_left",
     "header_icon": [
      1
     ]
    },
    {
     "type": "notice",
     "text_ref": "老师只读",
     "align": "left",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "已实看原竖图：标题、管整宽卡、不管整宽卡、最下浅绿提醒；每组内部三条单列左图右文卡，对勾/灰叉在卡头，技能按钮在各条内；末句乌龟在左。整屏章节标题按本人要求居中。没有流程线；嵌卡/卡头图标/内联小按钮/乌龟提示条待组件样张。；本轮仅文字续审：对话逐段拆泡、横2列竖1列，示例4步改纵向timeline，规则逐条两列，图标按实际映射核验。"
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
   "source_phrase": "管\n我自己的学习：路线、讲义、上课、练习、学到哪了。课上要用的真实调用、练习代码和配套材料。我对学习安排的决定和更正：原话记进AI规则库的决定记录，学习文件只写现在怎么做。",
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
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "禁止文件",
   "source_phrase": "老师只读我的其他项目当例子，不改、不跑、不维护它们。",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "禁止文件",
   "source_phrase": "老师只读我的其他项目当例子，不改、不跑、不维护它们。",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7a7e13ca96796233d6be.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7a7e13ca96796233d6be",
   "title_text": "边界",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

边界

**管**
- 我自己的学习：路线、讲义、上课、练习、学到哪了。
- 课上要用的真实调用、练习代码和配套材料。
- 我对学习安排的决定和更正：原话记进 AI 规则库的决定记录，学习文件只写现在怎么做。

**不管**
- 工作上的真实事项和交付：〔工作支持与交付技能〕。
- 合同、协议、通知这类正式文书：〔个人正式文书技能〕。
- 别人的学习问题：它只为我一个人排课。

老师只读我的其他项目当例子，不改、不跑、不维护它们。
