---
{
 "title": "看驾驶舱",
 "kind": "skill",
 "url": "/skills/cockpit/",
 "tagline": "问电脑和项目现在好不好、要我做什么，AI 读驾驶舱讲给我听；新东西顺手加进去。",
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
  "page": "skill-cockpit",
  "kind": "skill",
  "title": "看驾驶舱",
  "url": "/skills/cockpit/",
  "tagline": "问电脑和项目现在好不好、要我做什么，AI 读驾驶舱讲给我听；新东西顺手加进去。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-24 21:54"
   },
   "facts": [],
   "as_of": "2026-10-20",
   "source": "状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 21:54取这段已完成账本中的最近事件，不限于7天。本页不显示近7天次数，本轮也未重取该次数；不能从最近事件时间推算用量。次数和时间只表示已记录调用，不证明业务效果。"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "e692a58e450b3482f11300e4ebd0542aa0d3e0c3",
   "commit_time": "2026-10-09T08:07:40+08:00",
   "file": "E:\\.agents\\skills\\cockpit\\SKILL.md（3,364 字节，10 月 11 日读）；网站 sources/pages/cockpit/page.json 的栏目名和链接",
   "rules_release": "E257"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [
    {
     "id": "n-usage",
     "text": "读这个技能 14 次，都是 Codex",
     "meaning": "使用小记录里 kind=skill、name=cockpit 的条目数",
     "as_of": "2026-10-08",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl；北京时间 10 月 7 日 22:35 至 10 月 8 日 23:43，记录本身记到 10 月 8 日 23:59",
     "screens": [
      "skill-cockpit-01"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-cockpit",
     "with": "cockpit",
     "direction": "入口",
     "flow": "技能读的就是驾驶舱页背后的状态数据；驾驶舱每一块显示什么，家在驾驶舱页",
     "source": "SKILL.md 开头：状态入口和页面"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "驾驶舱的数据投影和“要本人做”条目的登记命令在电脑配置与恢复（PCConfig 看板）",
     "source": "SKILL.md“往驾驶舱里加东西”"
    }
   ],
   "mentions": [
    {
     "target": "/cockpit/",
     "screen": "skill-cockpit-01",
     "text": "驾驶舱"
    },
    {
     "target": "/cockpit/",
     "screen": "skill-cockpit-03",
     "text": "去看驾驶舱"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-cockpit-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/skills/timeaudit-diagnostics/",
     "screen": "skill-cockpit-04",
     "text": "查电脑卡顿"
    },
    {
     "target": "/computer-access/",
     "screen": "skill-cockpit-04",
     "text": "授权与状态"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "状态接口网址、PowerShell 命令、字段名（cockpit.summary、need_you、source_gaps、ai_hint 等）和登记脚本参数：是给 AI 的操作说明，用人话写成规矩，不上页。"
   ],
   "unsure": [
    "第 1 屏六句“怎么跟 AI 说”和第 2 屏两句“我：……”是替本人口吻写的示例说法。",
    "第 2 屏整屏是示例，已写明；H 盘那条和“AI 在跟 3 条”都是编的。",
    "不是任何项目的入口：驾驶舱是网站自己的页，不是项目，所以技能总页卡片不带“属于”，“属于”的个数仍是 18。",
    "使用次数只有 Codex 的记录；Claude 那几天有没有读，记录里没有，不写。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-cockpit/page.json",
  "sha256": "20ab563e48c96edd7c87e4897fbf810b0d24d073baacbce416a9f662ee224a11",
  "converted_at_beijing": "2026-10-30T14:00:58+08:00"
 }
}
---

::screen{#skill-cockpit-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-cockpit-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，〔驾驶舱〕画成绿色下划线的链接）。左半边上“它做什么”两段，下面一段浅绿底的小字（不用点名那段）和一行灰色小字（读了多少次那行）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：六句说法，每句画成一个浅绿色圆角对话气泡，一列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一块圆角仪表盘，上面一盏绿灯、一盏黄灯，旁边一张小便签上画一个打钩的方框；一只小手正往仪表盘边上再贴一张新便签。插画里不画字。",
  "portrait": "竖版：标题和技能名一行；“它做什么”两段；插画缩成一行；六个对话气泡一行一个；浅绿小字和灰色小字在最后。",
  "links": [
   {
    "text": "驾驶舱",
    "href": "/cockpit/"
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
     "text_ref": "看驾驶舱",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "50%",
     "row_fit_illustration": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 24 日 21:54",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 20 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 21:54取这段已完成账本中的最近事件，不限于7天。本页不显示近7天次数，本轮也未重取该次数；不能从最近事件时间推算用量。次数和时间只表示已记录调用，不证明业务效果。",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "技能名",
     "row": "hero"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "驾驶舱是",
     "row": "hero"
    },
    {
     "type": "notice",
     "text_ref": "不用点名",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "10 月 7–8 日",
     "row": "hero"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 2,
     "split_paras": true,
     "illustration": "none",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "align": "center"
    }
   ],
   "notes": "新页，照结构相同的“查电脑卡顿”技能页第 1 屏写：左栏标题、技能名、它做什么、不用点名、使用小记录；右栏六句说法，下面放插画，按右栏空出来的高度放（主持 10 月 10 日 07:18）。插画暂用驾驶舱页主插画（素材库没有画面描述里的仪表盘小插画，新图另做）。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "看驾驶舱",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 24 日 21:54",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 20 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 21:54取这段已完成账本中的最近事件，不限于7天。本页不显示近7天次数，本轮也未重取该次数；不能从最近事件时间推算用量。次数和时间只表示已记录调用，不证明业务效果。"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么"
    },
    {
     "type": "prose",
     "text_ref": "驾驶舱是"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "banner"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 1,
     "split_paras": true,
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    },
    {
     "type": "prose",
     "text_ref": "10 月 7–8 日"
    }
   ],
   "notes": "竖版照画面描述：标题和技能名、它做什么两段、插画一行、六个气泡一行一个，浅绿小字和灰色小字在最后。"
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
   "asset": "_library/illustrations/skill-cockpit-dashboard-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "explicit_owner_selected_asset",
   "key": "skill-cockpit-01-illustration-01",
   "source_phrase": "总灯与红黄绿指示、贴入新便签",
   "sha256": "ec5e593739cbfdbd44b558627e9a5e48ffa043c82b13c05f17e9809b627a83a6",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/skill-cockpit-dashboard-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "explicit_owner_selected_asset",
   "key": "skill-cockpit-01-illustration-01",
   "source_phrase": "总灯与红黄绿指示、贴入新便签",
   "sha256": "ec5e593739cbfdbd44b558627e9a5e48ffa043c82b13c05f17e9809b627a83a6",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/看驾驶舱.png",
   "fallback": false,
   "semantic_status": "explicit_owner_selected_asset",
   "title_exact_match": true,
   "text_verified": true,
   "key": "skill-cockpit-01-title-01",
   "title_text": "看驾驶舱",
   "source_phrase": "看驾驶舱",
   "sha256": "5e9d16a8303a684be85a2e813db3945177181d1d54f2ce8e5bb613f02ed323db",
   "status": "ready"
  }
 ]
}
```

看驾驶舱

技能名 cockpit · 读〔驾驶舱〕，也往里加东西

**它做什么**
驾驶舱是我看电脑和项目状态的那一页：总灯、要我做的事、知道就行的事、AI 正在跑和在跟的事。我问“电脑现在怎么样”“有没有要我处理的”，AI 先读驾驶舱背后的数据，几句话答清四件事：有没有出偏差、要我做什么、我问的那件现在怎样、今天该知道的变化。要看细节，它只调出相关的那一块，比如备份或自动任务。

驾驶舱分两版：我配对过的浏览器（电脑和手机上的 Chrome）看本人版，写的是原话，每张卡上有三个按钮：“复制给 AI”把这件事的来龙去脉复制下来，我粘到对话里交给 AI 办；“知道了”当场收起这条；“晚点提醒”选个时间再提醒我。后两个点完都能撤回。驾驶舱不在卡片上派 AI，也不在卡片上答题或回话。别人看到的是公开版，只能看，私人的事只显示一句不带细节的话。

另一半是往里加东西：AI 做一件事时，如果它带来了我以后要一直知道的东西（新的自动任务、新的数据来源、项目的新状态），就在同一次改动里顺手登记进驾驶舱。一页放不下，就拆成驾驶舱下面的二级页，不另开新的顶层页面。

**怎么跟 AI 说**
“电脑现在怎么样？”
“驾驶舱上有要我做的事吗？”
“备份那块为什么是黄的？”
“今天电脑上发生了什么？”
“这个新的自动任务也放进驾驶舱。”
“驾驶舱上那条我做完了，你核一下关掉。”

不用点名：问电脑和项目现在好不好、要我做什么，AI 自己去读驾驶舱。

10 月 7–8 日，AI 读这个技能 14 次，都是 Codex（使用小记录）。

::screen{#skill-cockpit-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-cockpit-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（“示例”）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”四步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一块小仪表盘、一只放大镜、一个时钟、一张对话纸），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“往里加东西”，里面一问一答两个气泡。",
  "portrait": "竖版：标题和标签；对话从上到下：我的气泡、四步、AI 的回复；“往里加东西”卡片放在最后。",
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
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "sides": [
      "left"
     ],
     "illustration": "none"
    },
    {
     "type": "dialogue",
     "text_ref": "往里加东西",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "illustration": "none"
    }
   ],
   "notes": "照查电脑卡顿第 2 屏：我的问话、AI 做了什么四步（各一个小图标）、AI 交回，最后“往里加东西”一问一答。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "sides": [
      "left"
     ],
     "illustration": "none"
    },
    {
     "type": "dialogue",
     "text_ref": "往里加东西",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "illustration": "none"
    }
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
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "skill-cockpit-02-icon-01",
   "source_phrase": "一块屏幕：先读驾驶舱的摘要",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-02-icon-02",
   "source_phrase": "一只放大镜：只调出备份和云端那一块核对",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-02-icon-03",
   "source_phrase": "一个时钟：核对数据什么时候读到的",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-02-icon-04",
   "source_phrase": "一张对话纸：AI 在跟的只报个数",
   "sha256": "a58ff382f40a593b35aed5fb214cfba69d55f1157e3ea7db20331bee0b345d24",
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
   "key": "skill-cockpit-02-title-01",
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

我：“驾驶舱上有要我做的事吗？”

**AI 做了什么**
1. 先读驾驶舱的摘要：总灯、“要你做”、“知道就行”，以及“AI 在跟”有几条。
2. “要你做”里有一条：外接的 H 盘备份超过期限没成功，要我把盘接上。它只调出“备份和云端”那一块核对，别的不翻。
3. 核对这条数据是什么时候读到的；来源中断超过十分钟的，单独说是缺口，不说成故障。
4. “AI 在跟”的几条只报个数，它们不影响总灯。

**AI 交回**
“有一件要你做：把 H 盘接上，今天的备份就能补上。另外两件知道就行，AI 在跟的有 3 条，不用你管。”

**往里加东西**
我：“这个新的每周整理任务也放进驾驶舱。”
AI：“已经在这次改动里登记好了。驾驶舱的自动任务里多了一条，写清它在做什么、上次和下次什么时候跑、怎么停。正常时折起来，出错才排到最上面。”

::screen{#skill-cockpit-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-cockpit-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看驾驶舱〕）。横幅下一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一块小仪表盘、一张写着三行的便签、一把尺子、一个时钟、一枚火箭打了问号、一张带勾的待办卡、一把小锁、一个三层的小按钮）。",
  "portrait": "竖版：横幅和按钮在上；八条规矩一行一条。",
  "links": [
   {
    "text": "去看驾驶舱",
    "href": "/cockpit/"
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
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "读驾驶舱、讲清结论"
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1,
     "item_cards": true,
     "inner_columns": 2,
     "icons": "auto",
     "illustration": "left_inside"
    }
   ],
   "notes": "照查电脑卡顿第 3 屏：一句能做的事（带去看驾驶舱的链接），下面八条规矩两列小卡，每条一个小图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "读驾驶舱、讲清结论"
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1,
     "item_cards": true,
     "inner_columns": 1,
     "icons": "auto",
     "illustration": "left_inside"
    }
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
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "skill-cockpit-03-icon-01",
   "source_phrase": "一块屏幕：先读摘要，只讲四件事",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "skill-cockpit-03-icon-02",
   "source_phrase": "一张三行的清单：要你做、知道就行、AI 在跟",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "skill-cockpit-03-icon-03",
   "source_phrase": "一把尺子：只认登记的标准",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "skill-cockpit-03-icon-04",
   "source_phrase": "一个时钟：同一问题只说一次，旧数写明什么时候读到",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/火箭问号.png",
   "fallback": false,
   "semantic_status": "explicit_owner_selected_asset",
   "key": "skill-cockpit-03-icon-05",
   "source_phrase": "火箭打了问号",
   "sha256": "ca398b39da7e61a76a4e47a112604038277f7bc375d382f82dae5649472cf200",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/火箭问号.png",
   "fallback": false,
   "semantic_status": "explicit_owner_selected_asset",
   "key": "skill-cockpit-03-icon-05",
   "source_phrase": "火箭打了问号",
   "sha256": "ca398b39da7e61a76a4e47a112604038277f7bc375d382f82dae5649472cf200",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打钩协议.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-03-icon-06",
   "source_phrase": "一张带勾的待办卡：要我做的事登记成一条",
   "sha256": "38bfbb0b14144de8d31dae2c44e827fb5c523a9d66355d5385fd91ec86487061",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-03-icon-07",
   "source_phrase": "一把小锁：给 AI 的细节只放在本机",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-exact-three-stairs.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-03-icon-08",
   "source_phrase": "三级小台阶：复制给 AI 分三级",
   "sha256": "b2d695badac77b03b32249a3a6f83eaf9888916136a8657c0f6845b726f4f5a2",
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
   "key": "skill-cockpit-03-title-01",
   "title_text": "能做的事",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事

读驾驶舱、讲清结论、按来源看明细，并把新的长期事项登记进去；驾驶舱每一块显示什么，见驾驶舱页本身。〔去看驾驶舱〕

**用这个技能时，AI 守的规矩**
- 先读摘要，回答只讲四件事：有没有偏差、要我做什么、我问的那件、今天该知道的变化；要细节时只调相关那一块。
- “要你做”写清具体做什么、去哪做，以及在手机上怎么办（能直接办的给去处，要动电脑的给一句让手机上的 AI 借电脑去办的话，真要人在电脑前才标出来）；“知道就行”是一行事实；“AI 在跟”在 AI 自己定的期限内只报条数，不算进总灯，过期就逐条列出。AI 自己暂缓的也算在内，从第一次登记起计时，顺延不清零。满 14 天还没了结的技术项，由 AI 直接定怎么收：影响我用电脑的给明确期限根治，已恢复正常、查尽了的结束并写清排除了什么，同一原因的并成一条，只差我自然用一用才能验的不为验收催我；驾驶舱“AI 已定”列一行结果，我不同意说一声就改。要花钱、删唯一的数据、要我亲手做或涉及我的取舍的，才转成我的事项。
- “AI 正在跑”每一行的主行写这件活此刻在做哪一步，取的是任务单上的当前步，没有就用最近一次收尾回顾或回复的第一句，都没有写“还没写进展”；对话标题只做灰色小标签。所以 AI 干长活要随进度更新任务单，不然这里会停在旧步骤上。
- 一项算不算正常，只认登记的标准；没设标准、还没接上、资料锁着，各说各的，不当成故障。
- 同一个问题只说一次；某个来源断了十分钟以上，单独说是缺口；旧数写明是什么时候读到的。
- 今天有提交不等于已经上线，上没上线要看发布回执。
- 要我做、要我选、容易漏看的事，登记成一条：写清人话、谁处理、什么时候、做到什么算完。要我亲自办的，还必须写清为什么非我不可、1—3 步怎么做、不做有什么影响，以及怎样算完成；归属填网站上登记的项目，个人事务明确留空，不按文件在哪个仓库去猜。一条事项默认写两句：给我看的原话，和公开版显示的一句；私人类的事（打官司、健康、感情、求职、行踪、详细财务这类）必须另写一句不带这些内容的公开句。卡片上只有“复制给 AI”“知道了”“晚点提醒”三个按钮；要 AI 办的事，我把复制的内容粘到对话里交代，驾驶舱不在卡片上派 AI。
- 普通单选题（例如汇报页里请我定的事）会连题目和具体选项一起登进来，驾驶舱把题目、选项和 AI 的建议写成普通文字，我点“复制给 AI”带到对话里回答；题太多、有多选或要看电脑上的原件才能答的，引导我回汇报页答。AI 读完答复、处理好才关这一条，截止时间到了不算完成。
- 手机通知只推两种：新出现要我做或选的事、AI 等我回话满 10 分钟；不按钟点静音，推不到就发邮件。
- 出错的条目，给我一句看着舒服的人话；给 AI 的细节（任务名、错误原文、日志在哪）只放在电脑本机，公开的网页上不显示。
- 出了错要 AI 处理时，“复制给 AI”分三级：每一条、每一块、整页；复制出来的提示词只指向本机里的条目编号，不贴日志原文。
- 修由 AI 做（技能里写的要求）：每周的基座治理读驾驶舱背后的接口，一条一条处理，修好的那条变绿；驾驶舱上“AI 会在每周基座治理里处理（下次……）”那句话就是指它。现在的情况（10 月 11 日核对）：每周体检的 Codex 自动任务已经设好，10 月 5 日第一次跑完并留了回执，下一次是 10 月 12 日；但这件事本身还在待验收，“逐条处理、修好变绿”还没有哪次运行被验收过，不算已经做到的能力。

::screen{#skill-cockpit-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-cockpit-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一块打钩的小仪表盘、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”在最后。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "查电脑卡顿",
    "href": "/skills/timeaudit-diagnostics/"
   },
   {
    "text": "授权与状态",
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
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      0
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "照查电脑卡顿第 4 屏：管、不管交给谁（表格）、不做。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      0
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/禁止文件.png"
     ]
    }
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
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-cockpit-04-icon-01",
   "source_phrase": "管",
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
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "skill-cockpit-04-icon-02",
   "source_phrase": "不做",
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
   "key": "skill-cockpit-04-title-01",
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
读驾驶舱、讲清现在的结论、按来源看明细；做一件事时，把它带来的新的长期事项顺手登记进驾驶舱。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 修好出错的备份、自动任务或项目 | 那个项目自己，比如备份去〔电脑配置与恢复〕 |
| 电脑刚才为什么卡 | 〔查电脑卡顿〕 |
| 锁资料、结束授权、锁屏 | 〔授权与状态〕 |

**不做**
- 不做全机巡检；问到哪一块，只读哪一块。
- 不为驾驶舱另开专门的网站完善任务：新东西在做那件事的同一次改动里加。
- 顶层只有一个驾驶舱；放不下先拆二级页，确有独立长期用途、二级页说不清时，才由 AI 判断要不要另开顶层（我可以改）。
- 正常的状态一句话带过，不刷没意义的内容。
- 网页只显示，不在网页上停任务、删条目。
