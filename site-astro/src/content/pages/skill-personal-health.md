---
{
 "title": "健康问题",
 "kind": "skill",
 "url": "/skills/personal-health/",
 "tagline": "问健康问题、交新报告、更新设备数据，都找它。",
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
  "page": "skill-personal-health",
  "kind": "skill",
  "title": "健康问题",
  "url": "/skills/personal-health/",
  "tagline": "问健康问题、交新报告、更新设备数据，都找它。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-07 17:18"
   },
   "facts": [
    "近 7 天 AI 用了 8 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "53da3ba51a0682d68de9be7afed1f27df5d0f872",
   "commit_time": "2026-09-25T13:01:14-05:00",
   "file": "E:\\.agents\\skills\\personal-health\\SKILL.md",
   "rules_release": "E187",
   "project_commit": "efd92031e4c304becf2f32b11d7684c4a0e96b61"
  },
  "video_prompt": "",
  "registry": {
   "relations": [
    {
     "id": "r-project",
     "with": "personal-health",
     "direction": "拿来",
     "flow": "技能按情况读健康项目的 CURRENT.md、AGENTS.md、SOURCES.md、设备约定，运行项目的更新入口",
     "source": "E:\\.agents\\skills\\personal-health\\SKILL.md 第 8–20 行"
    },
    {
     "id": "r-daily-preferences",
     "with": "daily-preferences",
     "direction": "拿来",
     "flow": "本人背景会改变回答时，按父库约定取相关内容；有依据的新本人信息回写",
     "source": "SKILL.md 第 12 行"
    },
    {
     "id": "r-personal-expression",
     "with": "personal-expression",
     "direction": "拿来",
     "flow": "讲给本人听时照 explain-to-me.md：清楚判断加一个小步骤",
     "source": "SKILL.md 第 8 行"
    }
   ],
   "mentions": [
    {
     "target": "/projects/personal-health/#features",
     "screen": "skill-personal-health-03",
     "text": "项目页的全部功能"
    },
    {
     "target": "/projects/personal-health/#design",
     "screen": "skill-personal-health-04",
     "text": "项目页的设计理由"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "skill-personal-health-04",
     "text": "个人理解库"
    }
   ]
  },
  "notes": {
   "merged": [
    "SKILL.md 里的各条能力（问答、纠错、设备更新、高风险核验）是项目功能，家在项目页全部功能，这里只链过去；第 3 屏只写技能自己的“什么时候读什么”。"
   ],
   "dropped": [
    "SKILL.md 第 8 行关于状态很差时的默认讲法属于私人内容，不上网站。",
    "sha256:649a7b71dcde0da36d73fbe5e198d9dc42e911f774a36d5a0f770b3b3daa9bf7"
   ],
   "unsure": [
    "第 1 屏六句说法、第 2 屏整段对话都是替本人和 AI 编的示例（本人允许虚构用例），不是真实对话；“这周有两天没有睡眠记录”也是编的，不是本人的真实记录。上线前请本人过目。",
    "页名用旧技能稿的“健康问题”；项目页叫“个人健康”，技能英文名 personal-health。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-personal-health/page.json",
  "sha256": "a3de3e277c2f7efbd1fc95bfac2c6c6f55dbc9c9ff6b07a638192046a6fa2c45",
  "converted_at_beijing": "2026-10-10T08:43:30+08:00"
 }
}
---

::screen{#skill-personal-health-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-personal-health-01",
  "section": "top",
  "title": "健康问题",
  "scene": "横版：左边大标题，下面两行说明；右边一幅水彩插画：一本翻开的小册子（封面写“健康现状”），旁边一只手腕戴着纤细的穿戴设备，一只放大镜照着一张报告纸（纸上只画灰色横线，不画数字）。下半部一排六个白底圆角对话气泡，两行三列，每个气泡里一句跟 AI 说的话，气泡左上一个小人头像图标；气泡上方一行小标题“这样说就行”。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和说明在上；插画缩到整宽放在说明下面；六个对话气泡一行一个上下排。字和横版完全一样。",
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
     "text_ref": "健康问题",
     "asset": "skill-personal-health\\skill-personal-health-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-health\\img\\skill-personal-health-01-h.png",
     "source_box": [
      29,
      78,
      596,
      287
     ],
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 7 日 17:18",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 8 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "我问和自己身体有关的问题",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "40%",
     "index": 0,
     "target_width": 386,
     "align": "center"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "这样说就行"
    },
    {
     "type": "dialogue",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "split_items": true,
     "tail": false,
     "text_ref": "“最近总犯困",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "标题与说明左、健康册手环放大镜插画右且在卡片外；下方六个头像对话气泡按定稿行序三列两排，头像在卡内左侧。插画册子上的“健康现状”不在本屏定稿，素材须去掉这四字，不能照图带入。dialogue 的 split_items 用于将一个 bullets 节点的六条拆成六张气泡，待组件支持。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；QA04 修复：按审查第5条首屏左字右图改60:40，插画高上限320px。；QA04 二次校正：按素材自然比例以target_width限制图片，避免仅限高时被row的100%宽拉扁。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "健康问题",
     "asset": "skill-personal-health\\skill-personal-health-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-health\\img\\skill-personal-health-01-h.png",
     "source_box": [
      29,
      78,
      596,
      287
     ]
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 7 日 17:18",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 8 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "我问和自己身体有关的问题"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "这样说就行"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "split_items": true,
     "tail": false,
     "text_ref": "“最近总犯困",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "原竖图：整宽居中章节标题、说明、卡外整宽主插画、“这样说就行”小标题、六张左头像右文字的气泡单列。插画“健康现状”是定稿外字，须去除。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。"
  }
 },
 "images": [
  {
   "role": "avatar",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“最近总犯困，要紧吗？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“医生建议我做这个治疗，好处和风险各是什么？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“这是新出的报告，整理进去。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“现状里那条不对，以这份报告为准。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“更新健康数据，主要看这周。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“设备记录更新到哪天了？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-health.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-health",
   "source_phrase": "横版：左边大标题，下面两行说明；右边一幅水彩插画：一本翻开的小册子（封面写“健康现状”），旁边一只手腕戴着纤细的穿戴设备，一只放大镜照着一张报告纸（纸上只画灰色横线，不画数字）。",
   "sha256": "fbd1f2129330dd87e3d7ab7700a2905db4b046aa75907bb91bcff8cb93fdf2ca",
   "status": "ready",
   "original_elements": [
    "一本翻开的小册子（封面画抽象短线的），旁边一只手腕戴着纤细的穿戴设备，一只放大镜照着一张报告纸（纸上只画灰色横线，不画数字"
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
   "asset": "skill-personal-health/skill-personal-health-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-health\\img\\skill-personal-health-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-449e49ffe10c1179bb97",
   "title_text": "健康问题",
   "sha256": "8cf8f4f946a891f21afb4c3f72f7558e8e99da3c41a27149360e3c525259d7f3",
   "status": "ready",
   "source_box": [
    29,
    78,
    596,
    287
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 健康问题

我问和自己身体有关的问题、交来新报告、要更新穿戴设备的数据时，AI 用它：先读整理好的健康现状，结合我的情况给判断和一个最省事的下一步。和我本人无关的健康常识不用它。

**这样说就行**

- “最近总犯困，要紧吗？”
- “医生建议我做这个治疗，好处和风险各是什么？”
- “这是新出的报告，整理进去。”
- “现状里那条不对，以这份报告为准。”
- “更新健康数据，主要看这周。”
- “设备记录更新到哪天了？”

::screen{#skill-personal-health-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-personal-health-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "横版：左上标题。下面左右两栏：左栏是一段对话（“我”的绿色气泡在右、“AI”的白色回答卡片在左）；右栏是一条竖向的五步小流程，每步一个绿色圆圈编号和一句话，步与步之间绿色箭头。右下角一小幅水彩插画：一个漏斗，上面落进七个小方块，其中两个是灰色空格，下面只出来五根整齐的绿色小柱子。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；对话在上（气泡和回答卡片上下排），五步流程在下，一步一行；插画缩小放在最下面。字和横版完全一样。",
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
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "tail": true,
     "illustration": "right_outside",
     "icons": "auto",
     "text_ref": "我：更新健康数据",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ]
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "tail": true,
     "illustration": "left_outside",
     "icons": "auto",
     "text_ref": "AI：更新好了"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "它背后做了什么"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "connector": "arrow",
     "illustration": "none",
     "icons": "none",
     "number_position": "left_outside",
     "text_ref": "1AI读项目规则",
     "direction": "vertical"
    }
   ],
   "notes": "横图左53%标题与对话，右47%是“它背后做了什么”及五步竖向流程；我气泡靠右、AI回答靠左，头像在气泡外，左栏底部人物桌面插画；右栏流程编号在卡外左边，箭头纵向连接编号，右下漏斗在卡外。当前素材 index 未登记语义时需主工程师按本屏两个插画定位，不能把漏斗误当头像。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；QA04 修复：按审查第1至3条删除02漏斗和04重复听诊器独立插画，去掉相应截断外框来源。；QA04 修复：将核心未支持的arrow/left_outside换成现有flow向下箭头和编号接口，保留原字与图标映射。；main-closer3：按asset-round3已ready的同字干净毛笔标题合同撤旧显式裁片，保large档、原motion与正文。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "tail": true,
     "illustration": "right_outside",
     "icons": "auto",
     "text_ref": "我：更新健康数据",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ]
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "tail": true,
     "illustration": "left_outside",
     "icons": "auto",
     "text_ref": "AI：更新好了"
    },
    {
     "type": "section_heading",
     "align": "center",
     "size": "medium",
     "text_ref": "它背后做了什么"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/文稿堆.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/icons/禁止文件.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "1AI读项目规则",
     "direction": "vertical"
    }
   ],
   "notes": "竖图：章节标题居中，我气泡右/人物卡外右、AI气泡右/机器人卡外左；中间组标题居中；五张单列步骤卡，卡内编号和图标在左、正文在右，卡间纵向绿色箭头；最下面独立漏斗插画。步骤图标和横版不同布局但字号不缩。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；QA04 修复：按审查第1至3条删除02漏斗和04重复听诊器独立插画，去掉相应截断外框来源。；QA04 修复：将核心未支持的arrow/left_outside换成现有flow向下箭头和编号接口，保留原字与图标映射。；main-closer3：按asset-round3已ready的同字干净毛笔标题合同撤旧显式裁片，保large档、原motion与正文。"
  }
 },
 "images": [
  {
   "role": "avatar",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "我：更新健康数据，主要看这周。",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "AI 读项目规则、健康现状和设备采集约定，运行更新入口；密码中心核对采集程序对得上，才放行。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "从上次没采完的那天补起，21 类数据全部采齐，原样存成原件、每个记指纹。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "离线核对清单和原件，出简报：睡眠这周有记录的天数不到 80%，标“部分可用”。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "禁止文件",
   "source_phrase": "AI 审阅简报：够格的步数、活动和现状不冲突，不改现状；缺记录不当成零。",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "只有缺的那条事实会改变结论，才问一句，而且不催。",
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
   "asset": "_library/fix-round-2/icon-clean-4205bfa25ba5315c2689.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "漏斗筛选",
   "source_phrase": "右下角一小幅水彩插画：一个漏斗，上面落进七个小方块，其中两个是灰色空格，下面只出来五根整齐的绿色小柱子。",
   "sha256": "ede7778f6db273cb31678380c9d65def129e76b30ab5223b81fec106dde796fa",
   "status": "ready",
   "original_elements": [
    "一个漏斗，上面落进七个小方块，其中两个是灰色空格，下面只出来五根整齐的绿色小柱子"
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
   "asset": "_library/round3/titles/title-r3-ffa2cdd15edd0e90e6e8.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\img\\skill-personal-materials-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ffa2cdd15edd0e90e6e8",
   "title_text": "一个完整的例子",
   "sha256": "124b2b24498ea3f5a4ab869e35efad8b281dcd8cd6557b63e9b7e3753660f0cb",
   "status": "ready",
   "source_box": [
    32,
    15,
    772,
    173
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 一个完整的例子

示例：照这个技能的做法写的，不是某一次的记录

**我：**更新健康数据，主要看这周。

**AI：**更新好了，这次从上回没采完的那天补起，21 类都采全了，原件也核对过。这周有两天没有睡眠记录，有记录的天数不到八成，睡眠这项我先不下结论，也不当成你没戴；步数和活动够格，看过了，和健康现状里写的没有冲突，现状不用改。那两天是没同步还是没戴，你愿意的话说一句，我再看睡眠。

**它背后做了什么**

1. AI 读项目规则、健康现状和设备采集约定，运行更新入口；密码中心核对采集程序对得上，才放行。
2. 从上次没采完的那天补起，21 类数据全部采齐，原样存成原件、每个记指纹。
3. 离线核对清单和原件，出简报：睡眠这周有记录的天数不到 80%，标“部分可用”。
4. AI 审阅简报：够格的步数、活动和现状不冲突，不改现状；缺记录不当成零。
5. 只有缺的那条事实会改变结论，才问一句，而且不催。

::screen{#skill-personal-health-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-personal-health-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题，下面一句带链接的话单独一行、字稍大。再下面一张小对照表“什么时候 → 读什么”，六行，左列是情况，右列是它读什么；表格右边一幅小插画：一架三级的小梯子，最低一级放着一本小册子，往上一级是一叠来源卡片，最高一级是一张报告纸（纸上只画灰线）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；那句链接的话；对照表改成六张小卡片，每张上面“什么时候”、下面“读什么”；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "项目页的全部功能",
    "href": "/projects/personal-health/#features"
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
     "row": "hero",
     "width": "68%",
     "align": "left",
     "size": "large",
     "text_ref": "能做的事",
     "asset": "skill-personal-health\\skill-personal-health-03-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-health\\img\\skill-personal-health-03-h.png",
     "source_box": [
      47,
      78,
      555,
      259
     ]
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "它是个人健康的入口",
     "size": "large"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "32%",
     "index": 0,
     "align": "center",
     "target_width": 327,
     "target_height": 205
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "什么时候 → 读什么"
    },
    {
     "type": "table",
     "columns": 2,
     "columns_v": 1,
     "illustration": "none",
     "text_ref": "什么时候读什么"
    }
   ],
   "notes": "横图左约70%：标题、独立带链接说明、组标题和两列表格，6行；右约30%三级梯子插画在表格外，纵向居中。箭头只出现在定稿组标题里，链接本身不额外补↗。 2026-10-03 本轮文字核对：独立链接说明按scene加大；未重新看图。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；QA04 修复：03独立图由现有row与blocks末位确定右栏/末尾位置，移除冗余且未支持的anchor字段。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事",
     "asset": "skill-personal-health\\skill-personal-health-03-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-health\\img\\skill-personal-health-03-h.png",
     "source_box": [
      47,
      78,
      555,
      259
     ]
    },
    {
     "type": "prose",
     "text_ref": "它是个人健康的入口",
     "size": "large"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "什么时候 → 读什么"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "portrait_mode": "cards",
     "illustration": "none",
     "text_ref": "什么时候读什么"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "small"
    }
   ],
   "notes": "原竖图章节标题原靠左，按已批准追加规则整屏宽章节大标题居中；六张上下字段对照卡，首字段“什么时候”浅绿卡头、次字段“读什么”在下，表头按定稿只出现一次，重复字段标签用 data-echo；三级梯子卡外放末尾。 2026-10-03 本轮文字核对：独立链接说明按scene加大；未重新看图。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。；QA04 修复：03独立图由现有row与blocks末位确定右栏/末尾位置，移除冗余且未支持的anchor字段。"
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
   "asset": "_library/illustrations/资料阶梯.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "资料阶梯",
   "source_phrase": "再下面一张小对照表“什么时候 → 读什么”，六行，左列是情况，右列是它读什么；表格右边一幅小插画：一架三级的小梯子，最低一级放着一本小册子，往上一级是一叠来源卡片，最高一级是一张报告纸（纸上只画灰线）。",
   "sha256": "c5d0d8b0f83837db329e945d9b5d168ee17c985e486c425d29eeecf1cd1a476d",
   "status": "ready",
   "original_elements": [
    "一架三级的小梯子，最低一级放着一本小册子，往上一级是一叠来源卡片，最高一级是一张报告纸（纸上只画灰线"
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
   "asset": "skill-personal-health/skill-personal-health-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-health\\img\\skill-personal-health-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "94b505896e546576cdddc191eff3b98b6f6eede094bd5bdcf5f6310133ee8a51",
   "status": "ready",
   "source_box": [
    47,
    78,
    555,
    259
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 能做的事

它是个人健康的入口，能做的事见〔项目页的全部功能〕。

**什么时候 → 读什么**

| 什么时候 | 读什么 |
|---|---|
| 平时问健康问题 | 只读健康现状这一份，不翻原件，也不翻旧记录 |
| 我的背景会改变答案 | 再从个人理解库取相关的那几条 |
| 交新报告、纠错、说法冲突 | 读项目规则和来源清单，只打开相关的那一份原件 |
| 更新设备数据 | 读项目规则、健康现状和设备采集约定，运行更新入口 |
| 高风险或治疗决定 | 另查当前权威的医学资料 |
| 上下文压缩之后 | 只重读健康现状 |

::screen{#skill-personal-health-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-personal-health-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题“边界”。下面两栏卡片：左栏绿色小勾标题“它管的”，三条；右栏灰色小叉标题“它不管的”，六条；每条一行或两行，左边一个小图标。右下角一小幅水彩插画：一个听诊器放在一张空白处方笺旁边，处方笺上画一个灰色小叉（表示不开药）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；“它管的”一栏在上，“它不管的”一栏在下，每条一行；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "项目页的设计理由",
    "href": "/projects/personal-health/#design",
    "locator_instances": {
     "h": {
      "input_sha256": "ddeaa185fde56082d4efbc118933985c67be942d09c78242848cb102a59a75d7",
      "fragmented": true,
      "instances": [
       {
        "context_text": "持续同步，也不打卡、不催：理由见项目页的",
        "context_rect": [
         891,
         403,
         1403,
         432
        ],
        "expected_rect": [
         1302,
         407,
         1400,
         431
        ],
        "lookup_text": "项目页的",
        "confirm_region": true
       },
       {
        "context_text": "设计理由。",
        "context_rect": [
         890,
         436,
         1040,
         471
        ],
        "expected_rect": [
         894,
         442,
         1021,
         471
        ],
        "lookup_text": "设计理由。"
       }
      ]
     },
     "v": {
      "input_sha256": "80e817d061557e56fa236d79c9c3467a4553f92f5c2fbf1df64191c43d30b3c1",
      "fragmented": true,
      "instances": [
       {
        "context_text": "持续同步，也不打卡、不催：理由见项目页的",
        "context_rect": [
         275,
         1054,
         845,
         1084
        ],
        "expected_rect": [
         734,
         1057,
         843,
         1083
        ],
        "lookup_text": "项目页的",
        "confirm_region": true
       },
       {
        "context_text": "设计理由。",
        "context_rect": [
         273,
         1089,
         439,
         1130
        ],
        "expected_rect": [
         276,
         1096,
         418,
         1130
        ],
        "lookup_text": "设计理由。"
       }
      ]
     }
    }
   },
   {
    "text": "个人理解库",
    "href": "/projects/daily-preferences/"
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
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "item_icons": [
      "_library/icons/心形.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-b3ca5198804d6b7dcf9c.png"
     ],
     "item_illustration": "left_inside",
     "text_ref": "它管的"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "item_icons": [
      "_library/icons/心形.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png",
      "_library/icons/禁止文件.png",
      "_library/icons/文稿堆.png",
      "_library/icons/身份盾牌.png",
      "_library/icons/文稿堆.png"
     ],
     "item_illustration": "left_inside",
     "text_ref": "它不管的",
     "motion_card_refs": [
      "不做健康评分"
     ]
    }
   ],
   "notes": "以 pages-approved 中 04-h 替换图为准：左40%标题及“它管的”3条卡，右60%“它不管的”6条卡，右组从标题等高位置开始；每条小图标在条目卡内左边，组标题只有勾/叉状态符号。处方笺和听诊器在右下卡外，不覆盖文字。item_icons/item_illustration 需组件支持逐条图标，不能用整个组一枚图标代替。；QA04 修复：按审查第1至3条删除02漏斗和04重复听诊器独立插画，去掉相应截断外框来源。；QA04 修复：按审查第1条边界标题独占整宽并居中，两张卡同一limits行等宽顶对齐；逐项图标字段缺口保持并如实列出，不假装已执行。；main-closer AI补充：逐项小图沿文意显式匹配心形/核验/手环/听诊器/禁止文件/资料/身份盾牌，替代语义未明叶子；保留原健康评分条目motion标记。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "item_icons": [
      "_library/icons/心形.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-b3ca5198804d6b7dcf9c.png"
     ],
     "item_illustration": "left_inside",
     "text_ref": "它管的"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "item_icons": [
      "_library/icons/心形.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png",
      "_library/icons/禁止文件.png",
      "_library/icons/文稿堆.png",
      "_library/icons/身份盾牌.png",
      "_library/icons/文稿堆.png"
     ],
     "item_illustration": "left_inside",
     "text_ref": "它不管的",
     "motion_card_refs": [
      "不做健康评分"
     ]
    }
   ],
   "notes": "原竖图标题原左，按整屏宽章节大标题居中要求调整；先“它管的”3条后“它不管的”6条，两组整宽；9个条目均图左文右，底部处方笺听诊器独立在组卡外。灰色只给叉状态点，组文字仍按批准深绿/正文深蓝灰。；QA04 修复：按审查第1至3条删除02漏斗和04重复听诊器独立插画，去掉相应截断外框来源。；QA04 修复：按审查第1条边界标题独占整宽并居中，两张卡同一limits行等宽顶对齐；逐项图标字段缺口保持并如实列出，不假装已执行。；main-closer AI补充：逐项小图沿文意显式匹配心形/核验/手环/听诊器/禁止文件/资料/身份盾牌，替代语义未明叶子；保留原健康评分条目motion标记。"
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
   "asset": "_library/icons/心形.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "心形",
   "source_phrase": "和我本人有关、要结合我的情况才答得好的健康问题。",
   "sha256": "db3d0fe685ec9faa104fd819f19c021113f854175bb9db72c1d232ab24af8904",
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
   "source_phrase": "新报告、事实纠正、来源对不上。",
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
   "asset": "_library/fix-round-2/icon-clean-b3ca5198804d6b7dcf9c.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手环心形",
   "source_phrase": "登记过的穿戴设备（现在是 Fitbit Air 手环），按我的要求更新数据。",
   "sha256": "a7b8917c6567212dc729ba65aa4ce31b59234784e8a5641e26c7946a8e9bba2d",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/心形.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "心形",
   "source_phrase": "和我本人无关的健康常识：AI 直接答，不用它。",
   "sha256": "db3d0fe685ec9faa104fd819f19c021113f854175bb9db72c1d232ab24af8904",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "不代替医生查体、诊断、开药。",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "不做健康评分、诊断引擎、数据库、后台监测、持续同步，也不打卡、不催：理由见〔项目页的设计理由〕。",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
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
   "source_phrase": "我的背景和偏好归〔个人理解库〕，它只取用，不另存一份。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "个人资料锁着时不读，先请我验证。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "原始报告留在健康原件目录，不复制进 Git。",
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
   "asset": "_library/round3/clean-assets/png/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "听诊核验",
   "source_phrase": "右下角一小幅水彩插画：一个听诊器放在一张空白处方笺旁边，处方笺上画一个灰色小叉（表示不开药）。",
   "sha256": "18d3aa616e0ec2aa16db0867599d221f862df22750e2e388ca3ad86630ecd1be",
   "status": "ready",
   "original_elements": [
    "一个听诊器放在一张空白处方笺旁边，处方笺上画一个灰色小叉（表示不开药"
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

# 边界

**它管的**

- 和我本人有关、要结合我的情况才答得好的健康问题。
- 新报告、事实纠正、来源对不上。
- 登记过的穿戴设备（现在是 Fitbit Air 手环），按我的要求更新数据。

**它不管的**

- 和我本人无关的健康常识：AI 直接答，不用它。
- 不代替医生查体、诊断、开药。
- 不做健康评分、诊断引擎、数据库、后台监测、持续同步，也不打卡、不催：理由见〔项目页的设计理由〕。
- 我的背景和偏好归〔个人理解库〕，它只取用，不另存一份。
- 个人资料锁着时不读，先请我验证。
- 原始报告留在健康原件目录，不复制进 Git。
