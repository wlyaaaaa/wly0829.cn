---
{
 "title": "规则",
 "kind": "rules-home",
 "url": "/rules/",
 "tagline": "AI 守的两层规矩：约法和 10 个专题。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "topics",
   "label": "10 个专题"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "rules-home",
  "kind": "rules-home",
  "title": "规则",
  "url": "/rules/",
  "tagline": "AI 守的两层规矩：约法和 10 个专题。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E251",
   "commit": "042d459642b979e78ff2d34c1fe3f13099a78046",
   "ruleset_sha256": "3f0a475800e7d8e30c4e55ae38127b9245a6e5d76f16a7b041cede50a5f8e102",
   "activated_at": "2026-10-10T01:51:17.678861+08:00",
   "file": "sources/rules/release.json"
  },
  "video_prompt": "5–8 秒循环：从开头这屏的水彩书架出发，上层那本深绿精装书的丝带书签被微风轻轻吹动，下层 10 本薄册子从左到右依次微微亮起一层浅绿光再暗下去，几片水彩绿叶从画面上方缓缓飘落；画面里不出现任何字，镜头不动。",
  "registry": {
   "groups": [
    {
     "id": "g-permission",
     "name": "授权和私人资料",
     "members": [
      "/rules/authorization/",
      "/rules/protected-actions/",
      "/rules/privacy-data/"
     ]
    },
    {
     "id": "g-daily",
     "name": "日常干活",
     "members": [
      "/rules/context-sources/",
      "/rules/execution-coordination/",
      "/rules/engineering-delivery/",
      "/rules/capabilities-runtime/"
     ]
    },
    {
     "id": "g-special",
     "name": "只在特定场合读",
     "members": [
      "/rules/codex-adapter/",
      "/rules/claude-adapter/",
      "/rules/rule-release/"
     ]
    }
   ],
   "features": [],
   "numbers": [
    {
     "id": "n-topics",
     "text": "10 个专题",
     "meaning": "规则细则的专题数（约法之外）",
     "as_of": "2026-09-28",
     "source": "E187 rules-catalog.json 共 11 个文档，除 AGENTS.md 外 10 个；与 AGENTS.md 第 85–96 行“细则在哪里”表 10 行、b1 下 10 个 rule-* 目录一致",
     "screens": [
      "rules-home-01",
      "rules-home-02"
     ]
    },
    {
     "id": "n-clauses",
     "text": "30 条",
     "meaning": "约法条数 L1–L30",
     "as_of": "2026-09-28",
     "source": "E187 AGENTS.md 第 15–71 行逐条数出，与约法页 n-clauses 同一口径",
     "screens": [
      "rules-home-01"
     ]
    },
    {
     "id": "n-groups",
     "text": "分 10 组",
     "meaning": "约法分组数（一至十）",
     "as_of": "2026-09-28",
     "source": "E187 AGENTS.md 第 13–69 行的 10 个 ### 标题；组名取自约法页第 1 屏链接，脚本断言 10 个",
     "screens": [
      "rules-home-01"
     ]
    },
    {
     "id": "n-release",
     "text": "E230（北京时间 10 月 9 日 09:12 起生效）",
     "meaning": "网站这一版依据的规则版本和生效时间；规则发新版时要改，和约法页、各专题页的 n-release 一起改",
     "as_of": "2026-10-09",
     "source": "活动规则入口 Inspect：release_id=E230，activated_at_utc=2026-10-09T01:12:52.0976458+00:00；原文 sha256=d9d4cb9fab5cb45530d785e27a3abe19a158b5d43a105912d72be728c127c3c3",
     "screens": [
      "rules-home-01"
     ]
    }
   ],
   "relations": [],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/charter/#talk",
     "screen": "rules-home-01",
     "text": "一、怎样对我说话"
    },
    {
     "target": "/rules/charter/#needs",
     "screen": "rules-home-01",
     "text": "二、怎样理解我的需求、什么时候必须问我"
    },
    {
     "target": "/rules/charter/#work",
     "screen": "rules-home-01",
     "text": "三、怎样做事"
    },
    {
     "target": "/rules/charter/#authorization",
     "screen": "rules-home-01",
     "text": "四、我的授权与安全"
    },
    {
     "target": "/rules/charter/#personal-data",
     "screen": "rules-home-01",
     "text": "五、我的个人资料"
    },
    {
     "target": "/rules/charter/#backup",
     "screen": "rules-home-01",
     "text": "六、我的数据与备份"
    },
    {
     "target": "/rules/charter/#delegation",
     "screen": "rules-home-01",
     "text": "七、AI 怎么分工和花钱"
    },
    {
     "target": "/rules/charter/#projects",
     "screen": "rules-home-01",
     "text": "八、项目与维护"
    },
    {
     "target": "/rules/charter/#reports-site-pc",
     "screen": "rules-home-01",
     "text": "九、汇报、网站和我的电脑"
    },
    {
     "target": "/rules/charter/#about-rules",
     "screen": "rules-home-01",
     "text": "十、关于规则本身"
    },
    {
     "target": "/rules/charter/",
     "screen": "rules-home-01",
     "text": "约法全文"
    },
    {
     "target": "/projects/agents/#tech",
     "screen": "rules-home-01",
     "text": "怎么发布和核验 → 基座"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rules-home-02",
     "text": "用户授权"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rules-home-02",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "rules-home-02",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/rules/context-sources/",
     "screen": "rules-home-02",
     "text": "事实来源与任务上下文"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "rules-home-02",
     "text": "分工与并行施工"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "rules-home-02",
     "text": "工程与交付"
    },
    {
     "target": "/rules/capabilities-runtime/",
     "screen": "rules-home-02",
     "text": "能力与运行方式"
    },
    {
     "target": "/rules/codex-adapter/",
     "screen": "rules-home-02",
     "text": "Codex 适配"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rules-home-02",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/rule-release/",
     "screen": "rules-home-02",
     "text": "规则发布与恢复"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [
    "约法卡上不写各组的条号范围（L1–L6 这类）、不写“谁说了算”的五级顺序：两样都在约法页第 1 屏讲透，总页只放组名和入口（不重复介绍）。",
    "开头不讲规则怎么发布、核验、回退的机制，只一句话加〔怎么发布和核验 → 基座〕：家在 AI 规则与技能基座项目页。"
   ],
   "unsure": [
    "卡片入口：说明要求每张专题卡放〔进去看〕。同一屏 10 个一样的〔进去看〕，拼页程序按图上文字找链接位置时分不清哪个对哪个专题，所以改成专题名本身就是链接（画成绿色带下划线和 ↗ 的链接样式，和约法页组名链接同一画法）；如果拼页程序能按卡片顺序区分同名链接，可以在每张卡右下角加回〔进去看〕。约法卡同理，入口是〔约法全文〕按钮。",
    "替本人口吻写的句子（第 1 屏，上线前请本人过目）：①“Codex、Claude 和它们派出的子代理，守同一套规矩，分两层。”②“约法：上层，只写我的价值观、偏好和已经定下的事。”③“10 个专题：下层细则，写每件事具体怎么办；和约法对不上时，以约法为准。”④“我当下明确说的话，比这两层都优先。”依据 E187 AGENTS.md 第 3、7 行改写；第一人称照约法页开头的口吻。",
    "口吻混用：页面自己的话用“我”（和约法页一致），专题卡的一句话按要求照搬各专题页 tagline，里面写的是“本人”（例如“要本人点头”）。没有改 tagline；如果本人觉得一页里“我”和“本人”混着别扭，应改专题页的 tagline，而不是在这里改写。",
    "专题分三组（授权和私人资料 3 篇、日常干活 4 篇、只在特定场合读 3 篇）是我分的：依据 E187 AGENTS.md 第 85–96 行“什么时候读”一列——Codex 适配、Claude 适配、规则发布与恢复三行都写“只在……时”；组内顺序照该表。组说明三句是我写的。",
    "版本是快照（画进图里）。规则发布与恢复专题的 batch2.md 建议在 /rules/ 或驾驶舱放一条网页程序读的“现在生效”实时小条；按全站规矩只有项目页开头有实时横条，所以这里没留空框，留给第 2 批定。"
   ],
   "bar_labels": [
    "两层规则",
    "授权和资料",
    "日常干活",
    "特定场合"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rules-home/page.json",
  "sha256": "27b8394ead8301ebf9801ab3a3b1307acef4da0ce4c0a5c19203490be6052ac2",
  "converted_at_beijing": "2026-10-10T11:36:50+08:00"
 }
}
---

::screen{#rules-home-01 section="top"}

```typeset
{
 "screen": {
  "id": "rules-home-01",
  "section": "top",
  "title": "两层规则和约法",
  "scene": "横版 16:9。风格照已通过的规则原文样张 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png（白底、纯绿、深蓝灰正文、细浅绿描边圆角卡），和约法页开头一屏同一种毛笔标题写法。上半部分左右分栏。左边约占 52%：左上毛笔艺术字大标题“规则”，下面一道绿色笔刷线；笔刷线下一行粗体深绿小标题（Codex、Claude……分两层。）；再下面画成上下叠放的两块圆角色块，表示两层：上块深绿底白字写“约法”那一行，下块浅绿底深蓝灰字写“10 个专题”那一行，两块之间一个向下的小箭头；色块下面一行灰绿色小字（我当下明确说的话，比这两层都优先。）。左边色块下方留出的位置画一幅水彩插画：一个两层的小木书架，上层只放一本厚厚的精装书，封面深绿，垂一条绿色丝带书签，书旁一枚绿色印章（印面朝下，看不到印文）；下层整齐竖着 10 本薄册子，书脊从深绿到浅绿渐变；书架旁几片水彩绿叶。插画里不出现任何字，书脊和封面都不写字。右边约占 48% 是一张大圆角卡（约法卡），白底细绿描边、卡头一条浅绿底色带：卡头左边粗体深绿“约法”，下面一行深蓝灰常规字写约法的一句话；再下面“30 条，分 10 组”粗体深绿，下面 10 个组名排成两列五行（左列一至五、右列六至十），每个组名画成链接样式（绿色字、细下划线、末尾小 ↗），行与行之间细虚线分隔；卡片底部居中一个实心绿底白字的大圆角按钮〔约法全文〕。整屏最下面一条贯通全宽的细长浅绿圆角横条，里面是版本说明那一段，行末〔怎么发布和核验 → 基座〕画成白底细绿描边的圆角按钮。",
  "portrait": "竖版 9:16，字完全一样，从上往下排：毛笔大标题“规则”和笔刷线；粗体小标题；上下叠放的两块色块（约法、10 个专题）和中间的小箭头；灰绿色小字一行；水彩书架插画缩成宽约 70% 居中；约法大卡占满宽度，10 个组名改成一列十行，〔约法全文〕按钮在卡底居中；最下面版本横条，文字在上，〔怎么发布和核验 → 基座〕按钮换到文字下面单独一行居中。",
  "links": [
   {
    "text": "一、怎样对我说话",
    "href": "/rules/charter/#talk"
   },
   {
    "text": "二、怎样理解我的需求、什么时候必须问我",
    "href": "/rules/charter/#needs"
   },
   {
    "text": "三、怎样做事",
    "href": "/rules/charter/#work"
   },
   {
    "text": "四、我的授权与安全",
    "href": "/rules/charter/#authorization"
   },
   {
    "text": "五、我的个人资料",
    "href": "/rules/charter/#personal-data"
   },
   {
    "text": "六、我的数据与备份",
    "href": "/rules/charter/#backup"
   },
   {
    "text": "七、AI 怎么分工和花钱",
    "href": "/rules/charter/#delegation"
   },
   {
    "text": "八、项目与维护",
    "href": "/rules/charter/#projects"
   },
   {
    "text": "九、汇报、网站和我的电脑",
    "href": "/rules/charter/#reports-site-pc"
   },
   {
    "text": "十、关于规则本身",
    "href": "/rules/charter/#about-rules"
   },
   {
    "text": "约法全文",
    "href": "/rules/charter/"
   },
   {
    "text": "怎么发布和核验 → 基座",
    "href": "/projects/agents/#agents-06"
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
     "row": "top",
     "width": "52%",
     "text_ref": "规则"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "row": "top",
     "text_ref": "Codex、Claude"
    },
    {
     "type": "segmented_band",
     "columns": 1,
     "direction": "vertical",
     "variant": "stack",
     "connector": "arrow",
     "illustration": "none",
     "row": "top",
     "text_ref": "约法：上层"
    },
    {
     "type": "prose",
     "row": "top",
     "text_ref": "我当下明确说的话"
    },
    {
     "type": "illustration",
     "row": "top",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "comparison",
     "columns": 1,
     "groups": [
      14
     ],
     "illustration": "none",
     "layout": "single_panel",
     "inner_link_columns": 2,
     "inner_link_order": "column_major",
     "row": "top",
     "width": "48%",
     "text_ref": "约法"
    },
    {
     "type": "notice",
     "columns": 1,
     "align": "left",
     "text_ref": "当前生效版本"
    }
   ],
   "notes": "已看批准 replace_images 新图：左52%标题、两层色块、优先说明、书架；右48%单张约法总卡。规则标题在左栏，约法卡头较小。右卡十组链接按左一至五、右六至十两列五行；底部约法全文按钮居中。版本条贯通全宽。书架在卡片外；仅两层色块之间有向下箭头。single_panel/inner_link_columns为构图要求，当前组件支持不足须看对比核验；不得拆成多张约法卡。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "规则"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "Codex、Claude"
    },
    {
     "type": "segmented_band",
     "columns": 1,
     "direction": "vertical",
     "variant": "stack",
     "connector": "arrow",
     "illustration": "none",
     "text_ref": "约法：上层"
    },
    {
     "type": "prose",
     "text_ref": "我当下明确说的话"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      14
     ],
     "illustration": "none",
     "layout": "single_panel",
     "inner_link_columns": 2,
     "inner_link_order": "column_major",
     "text_ref": "约法"
    },
    {
     "type": "notice",
     "columns": 1,
     "text_ref": "当前生效版本"
    }
   ],
   "notes": "已看批准竖图：两层色块→优先说明→书架→一张整宽约法卡→版本条。批准图的十组链接仍两列五行，优先于portrait所说一列十行；两列按1至5/6至10。约法全文在卡底，版本链接另起一行。整宽主标题按STANDARDS居中，正文左对齐。不加实时留空框。"
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
   "asset": "_library/illustrations/ill-4bce9731581bc2.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-4bce9731581bc2",
   "source_phrase": "左边色块下方留出的位置画一幅水彩插画：一个两层的小木书架，上层只放一本厚厚的精装书，封面深绿，垂一条绿色丝带书签，书旁一枚绿色印章（印面朝下，看不到印文）；下层整齐竖着 10 本薄册子，书脊从深绿到浅绿渐变；书架旁几片水彩绿叶。",
   "sha256": "421c6aa8d646e894c5b62de75e129b60646020d72acece8b84a5ebe155efb705",
   "status": "ready",
   "original_elements": [
    "一个两层的小木书架，上层只放一本厚厚的精装书，封面深绿，垂一条绿色丝带书签，书旁一枚绿色印章（印面朝下，看不到印文）；下层整齐竖着 10 本薄册子，书脊从深绿到浅绿渐变；书架旁几片水彩绿叶"
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
   "asset": "rules-home/rules-home-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\hub-local\\b1-rules-home-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1123245d1bed08b2722d",
   "title_text": "规则",
   "sha256": "ba17c50d535d6b4856c59eee91105a04e280d2e1c43feb765e57a1177a9d9011",
   "status": "ready",
   "source_box": [
    32,
    8,
    307,
    171
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
   "asset": "rules-home/rules-home-01-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\hub-local\\b1-rules-home-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-00267a7b08c70dd214ad",
   "title_text": "约法",
   "sha256": "faa1270e33a9a453dafe203de8fbc9f71e6351b3906b35878af76d0a6526148b",
   "status": "ready",
   "source_box": [
    865,
    81,
    1053,
    179
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 规则

**Codex、Claude 和它们派出的子代理，守同一套规矩，分两层。**

- **约法**：上层，只写我的价值观、偏好和已经定下的事。
- **10 个专题**：下层细则，写每件事具体怎么办；和约法对不上时，以约法为准。

我当下明确说的话，比这两层都优先。

## 约法

我逐条审定的 30 条总纲，AI 做任何事都先守它

**30 条，分 10 组**

- 〔一、怎样对我说话〕
- 〔二、怎样理解我的需求、什么时候必须问我〕
- 〔三、怎样做事〕
- 〔四、我的授权与安全〕
- 〔五、我的个人资料〕
- 〔六、我的数据与备份〕
- 〔七、AI 怎么分工和花钱〕
- 〔八、项目与维护〕
- 〔九、汇报、网站和我的电脑〕
- 〔十、关于规则本身〕

〔约法全文〕

当前生效版本 E251（北京时间 10 月 10 日 01:51 起）。改过的规则要发布成新的版本号才生效，AI 开工前先核对哪一版在生效、只读那一版。哪一版算数、怎么发布和退回的规矩，见下面的“规则发布与恢复”专题；发布器怎么搭、怎么做到不出半截，在“AI 规则与技能基座”项目里讲。〔怎么发布和核验 → 基座〕

::screen{#rules-home-03 section="top"}

```typeset
{
 "screen": {
  "id": "rules-home-03",
  "section": "top",
  "title": "派谁：什么活交哪个 AI",
  "scene": "横版：保留原标题，下面只排一条现行分工入口，链接到“怎么协作”。沿用白底、绿色与已有标题图。",
  "portrait": "竖版：原标题下接同一条现行分工入口，文字不缩小。",
  "links": [
   {
    "text": "现行型号、档位和分工 → 怎么协作",
    "href": "/how/#ai-roles"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "",
  "shape": "strip"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "派谁：什么活"
    },
    {
     "type": "prose",
     "text_ref": "Claude Opus 当主持"
    },
    {
     "type": "action_button",
     "text_ref": "现行型号、档位和分工 → 怎么协作",
     "align": "left"
    }
   ],
   "notes": "沿用原标题；现行型号、档位和分工由“怎么协作”承接，本页只保留入口。",
   "shape": "strip"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "派谁：什么活"
    },
    {
     "type": "prose",
     "text_ref": "Claude Opus 当主持"
    },
    {
     "type": "action_button",
     "text_ref": "现行型号、档位和分工 → 怎么协作",
     "align": "left"
    }
   ],
   "notes": "沿用原标题；现行型号、档位和分工由“怎么协作”承接，本页只保留入口。",
   "shape": "strip"
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
   "asset": "_library/icons/月亮.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "月亮",
   "source_phrase": "一弯浅绿月牙挂着一只小齿轮",
   "sha256": "3090c7fea0ea7b70f7c3bdb84f9b8371e7bf6d5cb3f3cfcf3bfc383c51a98c86",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/太阳工具.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "太阳工具",
   "source_phrase": "一轮绿色小太阳，前面一把小扳手和一只放大镜",
   "sha256": "bbdfe8fe41505397c63194c6f9cfabc10d17a761fae560518d6a66d1f3549adb",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "Claude 的橙色星芒标志，旁边一支笔压着一张纸",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "Claude 橙色星芒标志和 ChatGPT 标志并排、中间一架小木天平",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "一个小一号、颜色偏灰的 Claude 星芒标志",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "画笔调色板",
   "source_phrase": "一支画笔和一块调色板，旁边一个小 ChatGPT 标志",
   "sha256": "e753d6f0c05218dbfce4f65f119025ccc453dd77a5da6fb2551f53410cfd3cce",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "ClaudeFable5.1现在不如Opus5.5，不派。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "ClaudeFable5.1现在不如Opus5.5，不派。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rules-home/rules-home-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-rules-home-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-aa17a270b4aa01ce7c57",
   "title_text": "派谁：什么活交哪个 AI",
   "sha256": "34ed6b13888a6deb51e5fd240baca2a03b45fa96697bfc31278b5e40ef98de54",
   "status": "ready",
   "source_box": [
    404,
    6,
    1280,
    154
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 派谁：什么活交哪个 AI

Claude Opus 当主持：想方案、把关、抽查，也亲手写给我看的成品、网站文字和正式文书。范围写死、有验收办法的施工、修复和核对，派给 GPT-6.1 Sol；批量读取、摘录、格式转换这类机械活交给 GPT-6 Luna，它不花额度。最贵的 GPT-6 Astra 要我给这个对话或项目授权才派。谁能胜任只看厂商公布的数据和 AA 这类权威评测，不在本机自己测。

〔现行型号、档位和分工 → 怎么协作〕

::screen{#rules-home-04 section="top"}

```typeset
{
 "screen": {
  "id": "rules-home-04",
  "section": "top",
  "title": "碰到一件事，AI 怎么判断",
  "scene": "横版 16:9。风格照规则总页第一屏和规则原文样张（白底、纯绿主色、深绿毛笔标题、深蓝灰正文、水彩插画、细浅绿描边圆角卡）。左上毛笔艺术字大标题“碰到一件事，AI 怎么判断”，下面一道绿色笔刷线；笔刷线下一行粗体深绿字（“大多数事直接做……”那一句）。主体是一张从上往下的判断流程图，占画面左边约 86% 宽，四个判断各占一行、从上往下排：每行左边是一个浅绿底圆角问题框，框里先是带圈数字和粗体问题，①②两个问题框里问题下面再有一行深蓝灰小字说明（①是“本人的偏好……才算。”，②是那串七类动作加“看实际后果，不看字眼”），③④没有说明行；问题框右边一支向右的绿色粗箭头，箭头上方写一个“是”字，指向右边的结果卡（白底、细浅绿描边、圆角），结果卡里写 text 中“是 →”后面的那段字，“是 →”本身就画成这支箭头，不在卡里重复写。②③两张结果卡左边缘加一道细细的浅琥珀色竖条，表示要先停一下；①④的结果卡左边缘是浅绿竖条。每张结果卡左上角一个小水彩图标（不带字）：①一只挂着绿色挂锁的小木柜；②一只浅绿托盘里放着黄铜钥匙、手机、折起的纸条和一张画着 Google 彩色 G 与微软四色方块的小卡（和重大动作页开头插画同一只托盘，这里不写字）；③一个信封、一枚硬币和一只画着向上箭头的小木箱并排（和用户授权页开头插画同一组）；④一个带问号的小对话气泡。相邻两个问题框之间用一支向下的细灰绿箭头连起来，箭头旁不写字。第④个问题框下面一支向下箭头，接到一条贯通左边流程区全宽的实心绿底圆角横条，横条里白字：“四样都不是 → 直接做。”加粗放大，后面接那一段说明。画面右边约 14% 宽是一条竖长的水彩插画带：一条小路从上往下蜿蜒，路边依次立着四块不写字的小木路牌，一个小 AI 助手抱着文件沿路往下走，路的尽头插一面小绿旗；几片水彩绿叶点缀。整屏最下面一行四个白底细绿描边的圆角按钮并排居中，就是那四个〔〕链接，按钮末尾小 ↗。插画和图标里不出现任何别的字，不画编号以外的序号。",
  "portrait": "竖版 9:16，字完全一样，从上往下：毛笔大标题（可以折成两行），笔刷线，粗体那一行；四个判断依次往下，每个判断先是整宽的问题框（带说明行的照横版），下面一支写着“是”的向下绿色箭头接整宽的结果卡，图标在结果卡左上角，左边缘竖条颜色同横版；判断与判断之间用细灰绿竖线连起来；然后整宽的“四样都不是 → 直接做。”绿色横条；最后四个按钮排两行、每行两个。右边那条插画带改成放在标题右侧的一小幅（小路、四块路牌、小 AI 助手、小绿旗）。字多时在完整的判断之间拆屏：-v 放标题到②，-v2 放③到最后。",
  "links": [
   {
    "text": "要不要同意 → 用户授权",
    "href": "/rules/authorization/#p-direct"
   },
   {
    "text": "要不要验证 → 重大动作与本人验证",
    "href": "/rules/protected-actions/#p-decide"
   },
   {
    "text": "资料锁 → 个人资料与数据处理",
    "href": "/rules/privacy-data/#p-flow"
   },
   {
    "text": "什么时候问 → 约法 L8",
    "href": "/rules/charter/#L8"
   }
  ],
  "anchors": [
   {
    "id": "decide",
    "text": "碰到一件事，AI 怎么判断"
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
     "align": "center",
     "size": "large",
     "text_ref": "碰到一件事",
     "row": "balanced-heading",
     "width": "92%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "row": "balanced-heading",
     "width": "8%"
    },
    {
     "type": "prose",
     "text_ref": "大多数事直接做"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      2,
      1,
      2,
      1,
      1,
      1,
      1,
      1
     ],
     "connector": "arrow",
     "layout": "judgement_rows",
     "question_result_columns": [
      42,
      58
     ],
     "illustration": "left_inside",
     "text_ref": "① 要用本人的私人资料吗"
    },
    {
     "type": "notice",
     "columns": 1,
     "text_ref": "四样都不是"
    },
    {
     "type": "action_button",
     "columns": 4,
     "text_ref": "要不要同意"
    }
   ],
   "notes": "新构图，待样张：此屏横竖均无原图，按同页淡绿卡/毛笔标题及本屏定稿scene/portrait拟。横版左86%四行问→答，右14%小路插画带；竖版每题问题→向下是箭头→结果卡，题间细竖线，插画缩到标题旁。①②的问题带解释，③④只有题目；②③结果卡浅琥珀竖条须样张批准。四样都不是整宽总结，底部按钮横4个/竖2×2。judgement_rows及有字箭头当前未证实支持，不得把通用两栏称原构图已过。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "碰到一件事"
    },
    {
     "type": "prose",
     "text_ref": "大多数事直接做"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      2,
      1,
      2,
      1,
      1,
      1,
      1,
      1
     ],
     "connector": "arrow",
     "layout": "judgement_rows",
     "question_result_columns": [
      42,
      58
     ],
     "illustration": "left_inside",
     "row": null,
     "width": null,
     "text_ref": "① 要用本人的私人资料吗"
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "row": null,
     "width": null,
     "size": "small",
     "align": "center",
     "target_width": "60%",
     "target_height": 300
    },
    {
     "type": "notice",
     "columns": 1,
     "text_ref": "四样都不是"
    },
    {
     "type": "action_button",
     "columns": 2,
     "text_ref": "要不要同意"
    }
   ],
   "notes": "新构图，待样张：此屏横竖均无原图，按同页淡绿卡/毛笔标题及本屏定稿scene/portrait拟。横版左86%四行问→答，右14%小路插画带；竖版每题问题→向下是箭头→结果卡，题间细竖线，插画缩到标题旁。①②的问题带解释，③④只有题目；②③结果卡浅琥珀竖条须样张批准。四样都不是整宽总结，底部按钮横4个/竖2×2。judgement_rows及有字箭头当前未证实支持，不得把通用两栏称原构图已过。；qa-10第1条：手机路标插画宽60%、高度上限300px，沿用原卡外位置；箭头问题另交comp-diagram。"
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
   "asset": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "木匣锁",
   "source_phrase": "一只挂着绿色挂锁的小木柜",
   "sha256": "7d2d9db7dc508562b6bc40ca9a8ddb33765e7a694539a6e19dcd6cd2839ac50e",
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
   "source_phrase": "托盘里的钥匙、手机、纸条和Google及微软卡片",
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
   "asset": "_library/icons/信封硬币箱.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "信封硬币箱",
   "source_phrase": "③一个信封、一枚硬币和一只画着向上箭头的小木箱并排（和用户授权页开头插画同一组）",
   "sha256": "b92f8dd992cb8b9102ca3b443b0c2131b447e3fc36229606c1166c3368e8fd37",
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
   "semantic_status": "scene_explicit_budget_correction",
   "key": "问号气泡",
   "source_phrase": "④一个带问号的小对话气泡。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/判断小路.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "判断小路",
   "source_phrase": "画面右边约 14% 宽是一条竖长的水彩插画带：一条小路从上往下蜿蜒，路边依次立着四块不写字的小木路牌，一个小 AI 助手抱着文件沿路往下走，路的尽头插一面小绿旗；几片水彩绿叶点缀。",
   "sha256": "4756515562a0a1a6378db21ccb7016e398f3cb56206672c9e6576e5eed6fb825",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-28c5d7872f811b188340.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-28c5d7872f811b188340",
   "title_text": "碰到一件事，AI 怎么判断",
   "sha256": "db3dbf6af13e9c0c1b35094422ba089d04d40dfa48403b68cc58bee61606c209",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 碰到一件事，AI 怎么判断

**大多数事直接做；只有下面四种情况先停一下，碰到几样就过几关。**

**① 要用本人的私人资料吗？**
问的是本人自己的情况（身体、心理、生活、学习等），或答案要用本人的偏好、履历、通信、健康、财务、私人关系和以前经历时就需要；拿不准按需要处理。
是 → 根会话先看共享资料状态：开着就取用；锁着或不明，第一步请本人验证，通过后再查资料、派活和作答。子代理不自己验证，读取被拦、途中缺资料或到期时单行交回“需要本人资料：……”。不换来源绕过，也不拿缩水回答凑。普通代码、项目实施、电脑配置、排障照常。

**② 是“重大的事”吗？**
批量导出私人资料、把私人资料发到外面、看密码明文或银行卡、改验证或恢复方式、关掉保护、删库、转移仓库或把私人仓库改公开、删只有一份的数据；看实际后果，不看字眼。
是 → 开着无限制授权就不弹验证；没开、资料在解锁期内也不打断；都没有就先请本人验证一次（四选一）。GitHub 删库、转移、改公开、新建公开仓库不看解锁期：没开无限制授权就验证一次。只有 Codex、Claude 桌面版能免验证。

**③ 要发消息、对外发布、花钱、删唯一的数据、做撤不回的迁移吗？**
是 → 要本人明确同意，说清对象、内容和动作才算；项目第一次公开发布前也要先问。本人长期授权过的范围不用每次重说。验证和解锁只证明是本人，不等于同意。

**④ 需求、做不做、怎么取舍、和价值观有关的事拿不准吗？**
是 → 先查本人记过的，仍不清楚就问本人。技术实现 AI 自己定，说清定了什么、怎么改回。

**四样都不是 → 直接做。** 本人给的范围内，普通的、能撤回的读、改、测试和验证不一步步问；验证后提交推送，做完才停。没理由少做、反复要授权，和越界一样是错。

〔要不要同意 → 用户授权〕〔要不要验证 → 重大动作与本人验证〕〔资料锁 → 个人资料与数据处理〕〔什么时候问 → 约法 L8〕

::screen{#rules-home-02 section="topics"}

```typeset
{
 "screen": {
  "id": "rules-home-02",
  "section": "topics",
  "title": "10 个专题",
  "scene": "横版 16:9，同一风格。左上一行粗体深绿标题“10 个专题”，右上角画一小簇水彩绿叶作点缀。下面分三条横带，每条是一组，从上到下：每条横带顶上一行：组名粗体深绿，后面隔一个空格跟灰绿色小字的一句组说明（组名不单独占一列）；这一行下面是这组的卡片，一行排开：第一组 3 张、第二组 4 张、第三组 3 张，同一行卡片等宽等高。每张卡白底、细浅绿描边、圆角，卡左上角一个小小的水彩图标（不带字）：用户授权画一道半开的白色小栅栏门；重大动作与本人验证画一面绿色盾牌；个人资料与数据处理画一只带小锁的木匣；事实来源与任务上下文画一个放大镜压在一叠文件上；分工与并行施工画两个小机器人一起搬积木；工程与交付画一张打了勾的清单；能力与运行方式画一只打开的工具箱；Codex 适配画 OpenAI 的黑色花结标志；Claude 适配画 Claude 的橙色星芒标志；规则发布与恢复画一摞叠起的书页加一个绕回的圆箭头。图标右边是专题名，画成链接样式（粗体绿色字、细下划线、末尾小 ↗）；名字下面一两行深蓝灰常规字写这篇的一句话。三条横带之间用很淡的水彩绿色笔刷线分隔。",
  "portrait": "竖版 9:16，字完全一样：标题“10 个专题”在最上；三组从上往下排，每组先是组名加一句组说明（说明可以换到组名下一行），下面卡片一行一张、占满宽度，图标在卡片左边，专题名和一句话在右边。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/"
   },
   {
    "text": "事实来源与任务上下文",
    "href": "/rules/context-sources/"
   },
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   },
   {
    "text": "能力与运行方式",
    "href": "/rules/capabilities-runtime/"
   },
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/"
   },
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   },
   {
    "text": "规则发布与恢复",
    "href": "/rules/rule-release/"
   }
  ],
  "anchors": [
   {
    "id": "g-permission",
    "text": "授权和私人资料"
   },
   {
    "id": "topic-authorization",
    "text": "用户授权"
   },
   {
    "id": "topic-protected-actions",
    "text": "重大动作与本人验证"
   },
   {
    "id": "topic-privacy-data",
    "text": "个人资料与数据处理"
   },
   {
    "id": "g-daily",
    "text": "日常干活"
   },
   {
    "id": "topic-context-sources",
    "text": "事实来源与任务上下文"
   },
   {
    "id": "topic-execution-coordination",
    "text": "分工与并行施工"
   },
   {
    "id": "topic-engineering-delivery",
    "text": "工程与交付"
   },
   {
    "id": "topic-capabilities-runtime",
    "text": "能力与运行方式"
   },
   {
    "id": "g-special",
    "text": "只在特定场合读"
   },
   {
    "id": "topic-codex-adapter",
    "text": "Codex 适配"
   },
   {
    "id": "topic-claude-adapter",
    "text": "Claude 适配"
   },
   {
    "id": "topic-rule-release",
    "text": "规则发布与恢复"
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
     "align": "center",
     "size": "medium",
     "text_ref": "10 个专题"
    },
    {
     "type": "directory_tile",
     "columns": [
      3,
      4,
      3
     ],
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "授权和私人资料",
     "icon_map": {
      "用户授权": "_library/icons/闸门.png",
      "重大动作与本人验证": "_library/round3/clean-assets/png/08-盾牌-clean.png",
      "个人资料与数据处理": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png",
      "事实来源与任务上下文": "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "分工与并行施工": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
      "工程与交付": "_library/icons/打勾清单.png",
      "能力与运行方式": "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
      "Codex 适配": "_library/icons/OpenAI标志.png",
      "Claude 适配": "_library/icons/Claude标志.png",
      "规则发布与恢复": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png"
     },
     "group_illustrations": [
      "left_inside",
      "left_inside",
      "left_inside"
     ]
    }
   ],
   "notes": "横版三组横带，网格每排3/4/3张；组名与一句说明在卡组上方，图标在卡内左侧，链接名在图标右边。竖版v与v2合看，前两组各卡一行一张；第三组续图省掉图标，只保留卡内文字，须逐组控制素材。组间浅绿笔刷线，右上叶枝。实际原图为毛笔10个专题，整屏标题按STANDARDS居中；没有合格标题图须报字体兜底。 已有语义图标路径列在icon_map；工程清单与最后3组图标未齐。装饰叶枝icon-01不可作为专题图标。当前目录组件未消费icon_map，已挂comp-hub请求。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "10 个专题"
    },
    {
     "type": "directory_tile",
     "columns": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "授权和私人资料",
     "icon_map": {
      "用户授权": "_library/icons/闸门.png",
      "重大动作与本人验证": "_library/round3/clean-assets/png/08-盾牌-clean.png",
      "个人资料与数据处理": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png",
      "事实来源与任务上下文": "_library/round3/clean-assets/png/03-放大镜-clean.png",
      "分工与并行施工": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
      "工程与交付": "_library/icons/打勾清单.png",
      "能力与运行方式": "_library/fix-round-2/icon-clean-0432a3e02a060c22b01c.png",
      "Codex 适配": "_library/icons/OpenAI标志.png",
      "Claude 适配": "_library/icons/Claude标志.png",
      "规则发布与恢复": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png"
     },
     "group_illustrations": [
      "left_inside",
      "left_inside",
      "none"
     ]
    }
   ],
   "notes": "原v与v2合看：授权和私人资料3卡、日常干活4卡在v；只在特定场合读3卡在v2。每组组说明随组名，卡片一行一张。前7卡图标卡内左，最后3卡原续图无图标，勿机械补图。整宽毛笔10个专题居中，中档。 已有语义图标路径列在icon_map；工程清单与最后3组图标未齐。装饰叶枝icon-01不可作为专题图标。当前目录组件未消费icon_map，已挂comp-hub请求。"
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
   "source_phrase": "一道半开的白色小栅栏门",
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
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盾牌",
   "source_phrase": "一面绿色盾牌",
   "sha256": "53bd06dc245ab3fd8f472ad56e57f14d775fdac2c8fda524a89513012cafe440",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6afd7a4832cdf576ac2f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "木匣锁",
   "source_phrase": "一只带小锁的木匣",
   "sha256": "7d2d9db7dc508562b6bc40ca9a8ddb33765e7a694539a6e19dcd6cd2839ac50e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一个放大镜压在一叠文件上",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "双机器人",
   "source_phrase": "两个小机器人一起搬积木",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张打了勾的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "工具箱",
   "source_phrase": "一只打开的工具箱",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/OpenAI标志.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "OpenAI标志",
   "source_phrase": "OpenAI 的黑色花结标志",
   "sha256": "d5e37ca41dfb31132d6efa380695341971364f891ab4002f15821513909e5c0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "Claude标志",
   "source_phrase": "Claude 的橙色星芒标志",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "翻开册子",
   "source_phrase": "一摞叠起的书页加一个绕回的圆箭头",
   "sha256": "443a1e26f04d1a582103f4475c613c05b9c1f1c9e854081d0d14073fc8e51894",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-affcb0a1678abce5ccb8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-affcb0a1678abce5ccb8",
   "title_text": "10 个专题",
   "sha256": "38a0e937f9bc2af7475951b58300ffba01f60353837232745b1d4f9f81977185",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 10 个专题

**授权和私人资料**　三篇一起划出 AI 的权限边界。

- 〔用户授权〕哪些事 AI 直接做，哪些要本人点头。
- 〔重大动作与本人验证〕哪些事算重大，动手前怎么把关、怎么请本人验证。
- 〔个人资料与数据处理〕私人资料什么时候能用、放哪里、能公开多少。

**日常干活**　平常干活最常用到，碰到对应的事就读。

- 〔事实来源与任务上下文〕事实找谁、哪些项目冻结、长任务怎么接着做。
- 〔分工与并行施工〕派不派子代理、派谁，多个任务同时施工怎么不打架。
- 〔工程与交付〕做到什么程度、怎样才算验过、做完怎么收尾。
- 〔能力与运行方式〕用哪个工具和入口，浏览器、更新、装哪、网站和自动任务，给本人登记要做或要选的事。

**只在特定场合读**　平时不用读，用到 Codex 或 Claude 特有的机制、或者改规则本身时才读。

- 〔Codex 适配〕只对 Codex 有用的入口、授权、派活和升级细则。
- 〔Claude 适配〕只对 Claude 桌面版有用的身份、派活和接线规矩。
- 〔规则发布与恢复〕哪一版规则算数，怎么发布新版、退回上一版。
