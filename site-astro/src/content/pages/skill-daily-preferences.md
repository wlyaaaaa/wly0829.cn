---
{
 "title": "记得我是谁",
 "kind": "skill",
 "url": "/skills/daily-preferences/",
 "tagline": "带着对我的了解回答，说错了一纠正就改。",
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
  "page": "skill-daily-preferences",
  "kind": "skill",
  "title": "记得我是谁",
  "url": "/skills/daily-preferences/",
  "tagline": "带着对我的了解回答，说错了一纠正就改。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-20 17:05"
   },
   "facts": [
    "近 7 天 AI 用了 27 次"
   ],
   "as_of": "2026-10-20",
   "source": "AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "43528c3fc6b6074197a88d1ee7a5f196f7dd9db2",
   "commit_time": "2026-09-28T00:05:34+08:00",
   "file": "E:\\.agents\\skills\\daily-preferences\\SKILL.md"
  },
  "video_prompt": "",
  "registry": {
   "relations": [
    {
     "id": "r-project",
     "with": "daily-preferences",
     "direction": "拿来",
     "flow": "技能只是入口：读写的是个人理解库的同一个 SQLite 库和命令（daily-preferences.ps1）",
     "source": "SKILL.md 第 8 行"
    },
    {
     "id": "r-query-ref",
     "with": "daily-preferences",
     "direction": "拿来",
     "flow": "按意图只读对应引用：query.md（查询）、recommendations.md（推荐）、expression-and-writeback.md（记原话和回写）、source-refresh.md（更新）",
     "source": "SKILL.md“按需读取流程”"
    },
    {
     "id": "r-timeaudit",
     "with": "timeaudit-diagnostics",
     "direction": "分工",
     "flow": "电脑卡顿、性能历史直接交给查电脑卡顿的技能",
     "source": "SKILL.md“选择主路由”"
    },
    {
     "id": "r-health",
     "with": "personal-health",
     "direction": "分工",
     "flow": "医学限制、过敏、用药由健康为主，本技能只在允许范围内排序",
     "source": "SKILL.md“选择主路由”"
    },
    {
     "id": "r-secret",
     "with": "local-secret-broker",
     "direction": "分工",
     "flow": "卡号、密码、登录、真实付款归密码中心",
     "source": "SKILL.md“选择主路由”"
    },
    {
     "id": "r-media-materials",
     "with": "personal-media、personal-materials",
     "direction": "分工",
     "flow": "找照片视频录音走媒体，定位私人原件走材料；手机接入沿它们的阶段继续",
     "source": "SKILL.md“选择主路由”“未限定的个人更新”"
    }
   ],
   "mentions": [
    {
     "target": "/projects/daily-preferences/",
     "screen": "skill-daily-preferences-01",
     "text": "个人理解库"
    },
    {
     "target": "/projects/daily-preferences/#features",
     "screen": "skill-daily-preferences-03",
     "text": "项目页的全部功能"
    },
    {
     "target": "/projects/personal-health/",
     "screen": "skill-daily-preferences-04",
     "text": "个人健康"
    },
    {
     "target": "/projects/personal-formal-documents/",
     "screen": "skill-daily-preferences-04",
     "text": "个人正式文书"
    },
    {
     "target": "/projects/learning/",
     "screen": "skill-daily-preferences-04",
     "text": "学习方法"
    },
    {
     "target": "/projects/work-delivery-copilot/",
     "screen": "skill-daily-preferences-04",
     "text": "工作支持与交付"
    },
    {
     "target": "/projects/personal-media/",
     "screen": "skill-daily-preferences-04",
     "text": "个人媒体"
    },
    {
     "target": "/projects/personal-materials/",
     "screen": "skill-daily-preferences-04",
     "text": "个人材料查找"
    },
    {
     "target": "/projects/timeaudit/",
     "screen": "skill-daily-preferences-04",
     "text": "电脑使用与性能记录"
    },
    {
     "target": "/projects/password-center/",
     "screen": "skill-daily-preferences-04",
     "text": "密码中心"
    }
   ]
  },
  "notes": {
   "merged": [
    "技能源文件里“未限定的个人更新”（说“要更新了”时查全部在用的个人项目）是项目功能，家在项目页 f-personal-update，这里只放一句说法。"
   ],
   "dropped": [
    "SKILL.md 里和本人定的不上网站话题有关的路由条目不上网站。",
    "SKILL.md 的资料等级（screen、factor）和查询引用文件名是施工细节，只留在 registry 出处里。"
   ],
   "unsure": [
    "例子（赶工两周、外卖）是示意，页面上标了“示意”；本人允许虚构用例。例子没有写任何真实偏好。",
    "七句说法是替本人口吻写的（上线前请本人过目）；“9 月 20 日”只是举例的日期。",
    "“学习方法”“工作支持与交付”等链接用 manifest 里的项目 id；如果别的写稿人把这些做成技能页链接，需要对齐。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-daily-preferences/page.json",
  "sha256": "eb2185a04626f95a3cfda4672efdcfe83b4b9f2b48d1550781aadfd17c283a28",
  "converted_at_beijing": "2026-10-22T08:32:38+08:00"
 }
}
---

::screen{#skill-daily-preferences-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-daily-preferences-01",
  "section": "top",
  "title": "记得我是谁",
  "scene": "横版：左边大标题毛笔艺术字“记得我是谁”，下面一行说明（“个人理解库”画成绿色带小箭头的链接样式）；右边一幅水彩插画：一个对话框旁边，一只木质卡片盒打开着，一张索引卡被轻轻抽出一半（卡面只画浅灰短线）。下半部一排七个白底圆角对话气泡，分两行排（上四下三），每个气泡里一句跟 AI 说的话，气泡左上一个小人头像图标；气泡上方一行小标题“这样说就行”。 风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和说明在上，插画缩到整宽放在下面，七个对话气泡一行一个上下排。字和横版完全一样。",
  "links": [
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
     "align": "left",
     "size": "large",
     "row": "intro",
     "width": "60%",
     "text_ref": "记得我是谁"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 20 日 17:05",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 27 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 20 日 · AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。",
     "row": "intro"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "问题的答案取决于我是谁时"
    },
    {
     "type": "illustration",
     "row": "intro",
     "width": "40%",
     "illustration": "outside",
     "align": "center",
     "target_width": 358
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "这样说就行"
    },
    {
     "type": "dialogue",
     "columns": 4,
     "columns_v": 1,
     "row_counts": [
      4,
      3
     ],
     "icons": "auto",
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "“结合我的情况",
     "split_items": true,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "avatar_position": "outside-left"
    }
   ],
   "notes": "上部左文右图；下部七个头像对话气泡，上四下三，第二排均匀铺开。定稿句子比原图更新，逐字用定稿。；QA04 修复：按审查第4条首屏左字右图比例改60:40，插画高上限320px，消除首屏右图撑高。；QA04 二次校正：按素材自然比例以target_width限制图片，避免仅限高时被row的100%宽拉扁。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "记得我是谁"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 20 日 17:05",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 27 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 20 日 · AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。"
    },
    {
     "type": "prose",
     "text_ref": "问题的答案取决于我是谁时"
    },
    {
     "type": "illustration",
     "illustration": "outside",
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
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "“结合我的情况",
     "split_items": true,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "avatar_position": "outside-left"
    }
   ],
   "notes": "原竖图顺序为标题、说明、整宽插画、小节标题、七气泡单列；不把插画提前到说明前。"
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
   "source_phrase": "“结合我的情况，这个方案适合我吗？”",
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
   "source_phrase": "“你理解错了，我现在是这么想的：……”",
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
   "source_phrase": "“周末想吃点什么？给几个稳妥的，再给几个没试过的。”",
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
   "source_phrase": "“上个月外卖净花了多少？退款要扣掉。”",
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
   "source_phrase": "“9 月 20 日我去了哪些地方，手机主要用在哪？”",
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
   "source_phrase": "“我最近在忙什么？按记录说说你的判断。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“要更新了。”",
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
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-daily-preferences",
   "source_phrase": "横版：左边大标题毛笔艺术字“记得我是谁”，下面一行说明（“个人理解库”画成绿色带小箭头的链接样式）；右边一幅水彩插画：一个对话框旁边，一只木质卡片盒打开着，一张索引卡被轻轻抽出一半（卡面只画浅灰短线）。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一个对话框旁边，一只木质卡片盒打开着，一张索引卡被轻轻抽出一半（卡面只画浅灰短线"
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
   "asset": "_library/round3/titles/title-r3-599652b09be1c9fe8b11.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-daily-preferences\\img\\skill-daily-preferences-01-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-599652b09be1c9fe8b11",
   "title_text": "记得我是谁",
   "sha256": "39f090364eb6961d0ffe9ea28c75332683428e6fd0d9d2cbbffd31ca67efb091",
   "status": "ready",
   "source_box": [
    15,
    68,
    752,
    293
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 记得我是谁

问题的答案取决于我是谁时，个人资料锁着就先请我验证一次（解锁期内不再弹），通过后才去〔个人理解库〕读相关的认识卡，不先查再说；我纠正或说了新想法，它当场记下、改掉旧的。

**这样说就行**

- “结合我的情况，这个方案适合我吗？”
- “你理解错了，我现在是这么想的：……”
- “周末想吃点什么？给几个稳妥的，再给几个没试过的。”
- “上个月外卖净花了多少？退款要扣掉。”
- “9 月 20 日我去了哪些地方，手机主要用在哪？”
- “我最近在忙什么？按记录说说你的判断。”
- “要更新了。”

::screen{#skill-daily-preferences-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-daily-preferences-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "横版：左上标题“一个完整的例子”，旁边一个灰色小标签“示意”。下面左右两栏：左栏是一段对话（左边“我”的气泡，右边“AI”的回答卡片）；右栏是一条竖向的五步小流程，每步一个圆圈编号和一句话，说明 AI 背后做了什么，步与步之间绿色箭头；流程旁一幅小插画：一张索引卡上贴着一张黄色小便签，便签上画一个小日历角（不画字）。 风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和“示意”标签；对话在上（气泡和回答卡片上下排），五步流程在下，一步一行；插画缩小放在最下面。字和横版完全一样。",
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
     "row": "heading",
     "width": "40%",
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "row": "heading",
     "width": "60%",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "story",
     "width": "48%",
     "text_ref": "我：",
     "split_paras": true,
     "sides": [
      "left",
      "right"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/AI助手-通用.png"
     ]
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "row": "story",
     "width": "52%",
     "text_ref": "它背后做了什么"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "connector": "arrow",
     "illustration": "none",
     "row": "story",
     "text_ref": "分清这句话是哪一种",
     "icons": "none",
     "direction": "vertical"
    }
   ],
   "notes": "标题旁有“示意”标签，不是整宽独立居中标题。下方两大卡：左侧我/AI 对话上下排；右侧五步纵向箭头，右边索引盒插画，左卡底部另有餐盒手机插画。需要组件支持两幅插画的所属位置。；QA04 修复：按审查第1至3条撤下回落到首屏的重复独立插画，不改任何定稿文字。；QA04 修复：把未消费arrow的核心numbered_steps换为现有flow竖向箭头接口，保持原步骤和全文。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "large",
     "row": "heading",
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "row": "heading",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "我：",
     "split_paras": true,
     "sides": [
      "left",
      "right"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/AI助手-通用.png"
     ]
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
     "text_ref": "分清这句话是哪一种",
     "icons": "none",
     "direction": "vertical"
    }
   ],
   "notes": "原图整宽对话大卡在上；五步独立纵向编号卡在下；餐盒、手机、索引盒合成插画在最后。；QA04 修复：按审查第1至3条撤下回落到首屏的重复独立插画，不改任何定稿文字。；QA04 修复：把未消费arrow的核心numbered_steps换为现有flow竖向箭头接口，保持原步骤和全文。"
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
   "source_phrase": "我：这两周在赶工，推荐吃的先挑快的、能外卖的，下个月恢复。",
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
   "asset": "_library/avatars/AI助手-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "AI助手通用头像",
   "source_phrase": "AI：记下了，算临时说法，到下个月 1 日为止，你原来的口味不动。这两周推荐按“快、能外卖”排，还是给稳妥、相邻、新鲜三组。",
   "sha256": "9354a29ffdbaeb450c3aec3ef6d91bf2d922a42e9d3c8aefa948c5bf37d19e8b",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "卡片索引",
   "source_phrase": "下面左右两栏：左栏是一段对话（左边“我”的气泡，右边“AI”的回答卡片）；右栏是一条竖向的五步小流程，每步一个圆圈编号和一句话，说明 AI 背后做了什么，步与步之间绿色箭头；流程旁一幅小插画：一张索引卡上贴着一张黄色小便签，便签上画一个小日历角（不画字）。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一张索引卡上贴着一张黄色小便签，便签上画一个小日历角（不画字"
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

**我：**这两周在赶工，推荐吃的先挑快的、能外卖的，下个月恢复。

**AI：**记下了，算临时说法，到下个月 1 日为止，你原来的口味不动。这两周推荐按“快、能外卖”排，还是给稳妥、相邻、新鲜三组。

**它背后做了什么**

1. 分清这句话是哪一种：不是更正，也不是撤回，是带截止的临时说法。
2. 用原话原样记下，写上截止日期。
3. 因为不是更正，依赖长期口味的认识卡不失效、不重写。
4. 这两周的推荐先按新限制筛，再照常排三组候选，每个写一句为什么。
5. 到期后这句自动不再生效，没撤回的长期说法照常用，不用我再说一遍。

::screen{#skill-daily-preferences-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-daily-preferences-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：画面较矮的一条横幅。左上标题“能做的事”，下面一句带链接的话单独一行、字稍大，“项目页的全部功能”画成绿色带小箭头的按钮样式；右边一幅小插画：一个漏斗，上面几个对话气泡落进去，下面出来一张索引卡、一张小票和一个定位针（不画字）。 风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；那句链接的话；插画在下面占整宽。字和横版完全一样。",
  "links": [
   {
    "text": "项目页的全部功能",
    "href": "/projects/daily-preferences/#features",
    "locator_text": {
     "h": "项目页的全部功能。"
    }
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
     "row": "banner",
     "width": "62%",
     "text_ref": "能做的事",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "row": "banner",
     "text_ref": "它是个人理解库的入口",
     "size": "large",
     "link_style": "button"
    },
    {
     "type": "illustration",
     "row": "banner",
     "width": "38%",
     "illustration": "outside",
     "size": "small",
     "target_height": 260
    }
   ],
   "notes": "原图左大标题与单行链接说明、右漏斗插画，画面中段对齐、上下留白；本屏不是数字卡或普通卡网格。链接依定稿，不新增独立按钮文字。；QA04 修复：按审查第1条允许保留的小图方案收小03屏插画。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事"
    },
    {
     "type": "prose",
     "text_ref": "它是个人理解库的入口",
     "size": "large",
     "link_style": "button"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "align": "center",
     "size": "small",
     "target_height": 340
    }
   ],
   "notes": "整宽标题居中、说明在下、漏斗插画再在下，保留横幅的单块节奏。；QA04 修复：按审查第1条允许保留的小图方案收小03屏插画。"
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
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "卡片索引",
   "source_phrase": "左上标题“能做的事”，下面一句带链接的话单独一行、字稍大，“项目页的全部功能”画成绿色带小箭头的按钮样式；右边一幅小插画：一个漏斗，上面几个对话气泡落进去，下面出来一张索引卡、一张小票和一个定位针（不画字）。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一个漏斗，上面几个对话气泡落进去，下面出来一张索引卡、一张小票和一个定位针（不画字"
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
   "asset": "_library/round2/title-colors/color-skill-daily-preferences-03-title-01-c71400b33745.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-daily-preferences\\img\\skill-daily-preferences-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "3e1b1e7f7b0486348d5ac2f82ea417096517df35396e802621d852f77d194360",
   "status": "ready",
   "source_box": [
    41,
    242,
    756,
    535
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 能做的事

它是个人理解库的入口，能做的事见〔项目页的全部功能〕。

::screen{#skill-daily-preferences-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-daily-preferences-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题“边界”。下面两栏卡片：左栏绿色小勾标题“它管的”，三条；右栏灰色小叉标题“它不管的”，九条；每条一行或两行，左边一个小图标；链接的字画成绿色带小箭头。右下角一小幅水彩插画：一个书架上一排贴着不同颜色标签的盒子，中间那只卡片盒亮着（不画字）。 风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；“它管的”一栏在上，“它不管的”一栏在下，每条一行；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "个人健康",
    "href": "/projects/personal-health/"
   },
   {
    "text": "个人正式文书",
    "href": "/projects/personal-formal-documents/"
   },
   {
    "text": "学习方法",
    "href": "/projects/learning/"
   },
   {
    "text": "工作支持与交付",
    "href": "/projects/work-delivery-copilot/"
   },
   {
    "text": "个人媒体",
    "href": "/projects/personal-media/"
   },
   {
    "text": "个人材料查找",
    "href": "/projects/personal-materials/"
   },
   {
    "text": "电脑使用与性能记录",
    "href": "/projects/timeaudit/"
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
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "points_card",
     "columns": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "row": "boundaries",
     "width": "39%",
     "text_ref": "它管的"
    },
    {
     "type": "points_card",
     "columns": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "row": "boundaries",
     "width": "61%",
     "text_ref": "它不管的"
    }
   ],
   "notes": "source_image 使用 pages-approved 的通过替换图。两大卡左39%右61%，左三条右九条；右下书架盒子插画在卡片外。整屏宽章节标题依统一标准居中；原图位于左上，记录这一标准要求的对齐调整。；QA04 修复：按审查第1至3条撤下回落到首屏的重复独立插画，不改任何定稿文字。"
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
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "它管的"
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "illustration": "left_inside",
     "text_ref": "它不管的"
    }
   ],
   "notes": "两整宽大卡顺排；书架插画在第二卡下方卡外；每条的小图标留在所属条目左侧。；QA04 修复：按审查第1至3条撤下回落到首屏的重复独立插画，不改任何定稿文字。"
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "我的经历、眼下的处境、做事的取舍，和吃喝、购物、出行、娱乐、数码、工具习惯、审美这些日常偏好。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "已知的消费、行踪、手机和电脑使用这些事实。",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
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
   "source_phrase": "别的项目做事时发现的、以后还用得上的我的新情况。",
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
   "asset": "_library/icons/心形.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "心形",
   "source_phrase": "身体、看病、用药：归〔个人健康〕；这里只在它允许的范围里排推荐。",
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "合同、正式材料：归〔个人正式文书〕。",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/13-公文包清单-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "公文包清单",
   "source_phrase": "学习进度、工作资料：归〔学习方法〕和〔工作支持与交付〕；这里只给相关的经历和取舍。",
   "sha256": "6c838cf1f00338d2d467304875ffcc24263ed89010212c4d382029d3e92434fa",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "找照片录音、找文件原件：归〔个人媒体〕和〔个人材料查找〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "秒表",
   "source_phrase": "电脑卡顿、性能：归〔电脑使用与性能记录〕。",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "密码、卡号、真实付款：归〔密码中心〕。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "预算、负债、投资的规划不在这里做，这里只给消费事实和生活取舍。",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "不替我下单，也不替我只选一个（我说“直接替我选”时除外）。",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "不判断“现在用电脑的是不是本人”；资料锁着时不读，也不换个来源绕过去。",
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
   "asset": "_library/illustrations/main-daily-preferences.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "卡片索引",
   "source_phrase": "右下角一小幅水彩插画：一个书架上一排贴着不同颜色标签的盒子，中间那只卡片盒亮着（不画字）。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一个书架上一排贴着不同颜色标签的盒子，中间那只卡片盒亮着（不画字"
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

- 我的经历、眼下的处境、做事的取舍，和吃喝、购物、出行、娱乐、数码、工具习惯、审美这些日常偏好。
- 已知的消费、行踪、手机和电脑使用这些事实。
- 别的项目做事时发现的、以后还用得上的我的新情况。

**它不管的**

- 身体、看病、用药：归〔个人健康〕；这里只在它允许的范围里排推荐。
- 合同、正式材料：归〔个人正式文书〕。
- 学习进度、工作资料：归〔学习方法〕和〔工作支持与交付〕；这里只给相关的经历和取舍。
- 找照片录音、找文件原件：归〔个人媒体〕和〔个人材料查找〕。
- 电脑卡顿、性能：归〔电脑使用与性能记录〕。
- 密码、卡号、真实付款：归〔密码中心〕。
- 预算、负债、投资的规划不在这里做，这里只给消费事实和生活取舍。
- 不替我下单，也不替我只选一个（我说“直接替我选”时除外）。
- 不判断“现在用电脑的是不是本人”，也不自己解锁：资料锁着时先请我验证，验证通过前不读、不换个来源绕过去、不拿不完整的回答凑数。
