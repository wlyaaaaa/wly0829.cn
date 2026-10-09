---
{
 "title": "查电脑卡顿",
 "kind": "skill",
 "url": "/skills/timeaudit-diagnostics/",
 "tagline": "说一句“刚才卡了”，AI 按时间对齐证据去查。",
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
  "page": "skill-timeaudit-diagnostics",
  "kind": "skill",
  "title": "查电脑卡顿",
  "url": "/skills/timeaudit-diagnostics/",
  "tagline": "说一句“刚才卡了”，AI 按时间对齐证据去查。",
  "status": "",
  "public": null,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "39960ed5bda31b29cd5586c68f0e495816814ac6",
   "commit_time": "2026-09-28T04:39:19+08:00",
   "file": "E:\\.agents\\skills\\timeaudit-diagnostics\\SKILL.md 及 agents\\openai.yaml"
  },
  "video_prompt": "",
  "registry": {
   "mentions": [
    {
     "target": "/projects/timeaudit/",
     "screen": "skill-timeaudit-diagnostics-01",
     "text": "电脑使用与性能记录"
    },
    {
     "target": "/projects/timeaudit/#features",
     "screen": "skill-timeaudit-diagnostics-03",
     "text": "去看全部功能"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "skill-timeaudit-diagnostics-04",
     "text": "个人理解库"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-timeaudit-diagnostics-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/password-center/",
     "screen": "skill-timeaudit-diagnostics-04",
     "text": "密码中心"
    },
    {
     "target": "/projects/timeaudit/#g-view",
     "screen": "skill-timeaudit-diagnostics-04",
     "text": "六张看板"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能里给 AI 的具体命令、schema 名和字段名（timeaudit.runtime-health.v1、--include-overhead 等）不上页：读者要的是怎么说、会发生什么。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏八句“怎么跟 AI 说”；第 2 屏两句“我：……”。",
    "第 2 屏例子的数字是真实的（9/28 17:53–20:53 的 timeaudit_diagnostic_summary.py --hours 3，和 20:35 的 timeaudit_health.py），问话和回话是编的；问话改成问一项指标（帧率），照技能规定走历史摘要；这组帧数字只放在这个例子里，项目页亮点只讲做法。",
    "标题用旧技能总表里的叫法“查电脑卡顿”，没加“技能”二字；项目页第 5 屏的链接字写的是“查电脑卡顿技能”。两处叫法要和技能总页统一。",
    "技能写“最长 168 小时”，9 月 28 日实测 24 小时的摘要就超时（见项目 audit.md）；第 3 屏两样都写了。“内存黑匣子最早能追到 13 小时前”取自 9/28 20:35 健康检查 rolling_span_hours=13.777，会随时间变。",
    "agents/openai.yaml 的中文显示名是“TimeAudit 历史诊断”，和页面标题不同。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-timeaudit-diagnostics/page.json",
  "sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
  "converted_at_beijing": "2026-10-10T05:26:53+08:00"
 }
}
---

::screen{#skill-timeaudit-diagnostics-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-timeaudit-diagnostics-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，项目名画成链接）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：八句说法，每句画成一个浅绿色圆角对话气泡，两列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一个对话气泡连着一卷心电图纸带，纸带上一个小尖峰被放大镜照着（不画字）。",
  "portrait": "竖版：标题和技能名一行；“它做什么”和浅绿小字段落；插画缩成一行；八个对话气泡一行一个。",
  "links": [
   {
    "text": "电脑使用与性能记录",
    "href": "/projects/timeaudit/"
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
   "portrait_required": true,
   "aspect": "16:9",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "查电脑卡顿",
     "align": "center",
     "size": "large",
     "row": "hero",
     "width": "50%"
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
     "text_ref": "电脑卡了",
     "row": "hero"
    },
    {
     "type": "notice",
     "text_ref": "不用点名",
     "row": "hero"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "medium",
     "row": "hero",
     "align": "center",
     "target_height": 220
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 2,
     "split_paras": true,
     "illustration": "none",
     "row": "hero",
     "width": "50%"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 qa-11 修复：插画移到左栏提示框下，用 medium/220px 上限；右栏由怎么跟 AI 说明确开启，补左下空白而保留原气泡分组。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "查电脑卡顿",
     "align": "center",
     "size": "large"
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
     "text_ref": "电脑卡了"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
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
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "asset": "_library/illustrations/main-timeaudit.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-timeaudit",
   "source_phrase": "右上角一幅小插画：一个对话气泡连着一卷心电图纸带，纸带上一个小尖峰被放大镜照着（不画字）。",
   "sha256": "47b93703a96e0317821cbacc9f4f3a2400ce5dbb94227310a4a037a8d91cd87b",
   "status": "ready",
   "original_elements": [
    "一个对话气泡连着一卷心电图纸带，纸带上一个小尖峰被放大镜照着（不画字"
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
   "asset": "_library/titles/title-93d38313e1c3ffddd596.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-93d38313e1c3ffddd596",
   "title_text": "查电脑卡顿",
   "sha256": "7fd063170e65f3ff1a5aacc52ba75d9a2347af2c6f3976dd4e8e92d832f2d3c9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

查电脑卡顿

技能名 timeaudit-diagnostics · 〔电脑使用与性能记录〕项目的入口

**它做什么**
电脑卡了、卡死过、游戏掉帧，或者想知道记录还正不正常，跟 AI 说一句，AI 就照这个技能取证据：先看那段时间记录全不全，再把硬件、帧率、内存和系统事件对到同一时刻，交回最值得查的方向和还缺什么证据。只看不修。

不用点名：说到卡顿、卡死、掉帧、电脑变慢、TimeAudit 正不正常，AI 自己会用上它。问“那天用了哪些软件”不走它，走个人理解库。

**怎么跟 AI 说**
“刚才卡了一下，看看怎么回事。”
“昨晚 11 点多电脑卡死了，重启前发生了什么？”
“过去三小时游戏帧率怎么样？”
“TimeAudit 现在还在记吗？”
“这段时间是睡着了，还是记录断了？”
“采集程序自己占了多少资源？”
“内存黑匣子记到哪了？”
“最近一份备份校验过没有？”

::screen{#skill-timeaudit-diagnostics-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-timeaudit-diagnostics-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（示例那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”四步画成一条细竖线串起的四个小节点（每个节点一个小水彩图标：一把尺子框住三小时、一张打勾的清单、一个帧数计数器旁边几个被划掉的小方块、并排的温度计和硬盘），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。",
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
   "portrait_required": true,
   "aspect": "16:9",
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
     "text_ref": "另一种问法",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "illustration": "none"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 qa-11 修复：例子主内容占全宽；另一种问法在其后独立全宽行，取消 66.7/33.3 高度悬殊的并栏。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
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
     "text_ref": "另一种问法",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "illustration": "none"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "source_phrase": "一把尺子框住三小时",
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张打勾的清单",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "柱状图",
   "source_phrase": "一个帧数计数器旁边几个被划掉的小方块",
   "sha256": "bd524c451ddd9869f223993b61adee245bf3bf8dd4a702e2728c087da609f002",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "外接硬盘",
   "source_phrase": "并排的温度计和硬盘",
   "sha256": "14193345c562f4b57eabda0a820f9da89afedd27b3445a9c74a4632eaff386e6",
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

示例：数字取自 9 月 28 日 17:53–20:53 的真实摘要和 20:35 的真实健康检查，问话和回话是编的

我：“过去三小时游戏帧率怎么样？”

**AI 做了什么**
1. 问的是一项历史指标，就用 TimeAudit 的历史诊断摘要查这三小时，一次查询，只拿汇总数字。（要是说“刚才卡了”“卡死了”，会改用电脑配置与恢复的卡顿总诊断，连内存黑匣子和系统事件一起查。）
2. 先看记录全不全：10,800 秒里有 10,800 条硬件记录，最大空档 1.2 秒，一直是同一个采集程序在记。
3. 看帧：10,800 个帧样本里 126 个帧率和帧时间对不上，剔掉；剩下平均 121 fps，1% Low 平均 99；230 个样本的帧时间达到 50 毫秒，采到的最长帧约 2 秒。
4. 看同一时段别的：CPU 最高 73.3°C，显卡 55°C，磁盘延迟 95% 在 0.26 毫秒以内，内存最高 72.8%，网络没丢包；显卡热点温度整段读不到。

**AI 交回**
“这三小时记录是完整的。平均 121 fps，1% Low 平均 99，整体流畅；但有 230 个样本的帧时间达到 50 毫秒，采到的最长帧约 2 秒，会感觉到顿一下。同一时间温度、磁盘、内存都不高，不像过热或硬盘拖慢；显卡热点温度读不到，这一项排除不了。要查这些高帧时间样本的原因，可以让我用卡顿总诊断把内存和系统事件也对一遍，或者打开‘资源大户’看板对到那几秒。现在还说不出原因。”

**另一种问法**
我：“TimeAudit 现在还在记吗？”
AI：“在记。硬件记录不到 1 秒前刚写过，窗口记录没有积压，图表正常，看门狗上一次检查也正常。CPU 温度和功率都读得到，显卡热点温度读不到。今天 11:40 的备份，数据库那步好了（3.8 GiB，清单和大小核对过），看板设置那步没备上；也还没拿真实备份做过恢复演练。”

::screen{#skill-timeaudit-diagnostics-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-timeaudit-diagnostics-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一只只看不碰的眼睛、一把尺子框住时间轴、一个“≠”号、一轮月亮和一段断开的线、一只手柄旁边一个沙漏、一张清单和一个没打勾的框、一把锁、一个“只查一次”的小计数器）。",
  "portrait": "竖版：横幅和按钮在上（按钮单独一行）；八条规矩一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/timeaudit/#features"
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
   "portrait_required": true,
   "aspect": "16:9",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "这个技能是只读诊断入口"
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
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 qa-11 修复：能做的事原词独立为章节标题；提示框从下一原段开始，去看全部功能保留为句尾行内链接，不重复标题、不改句尾。缺毛笔标题素材已另提请求。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "这个技能是只读诊断入口"
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
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 qa-11 修复：能做的事原词独立为章节标题；提示框从下一原段开始，去看全部功能保留为句尾行内链接，不重复标题、不改句尾。缺毛笔标题素材已另提请求。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一只只看不碰的眼睛",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子框住时间轴",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个“≠”号",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/月亮.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "月亮",
   "source_phrase": "一轮月亮和一段断开的线",
   "sha256": "3090c7fea0ea7b70f7c3bdb84f9b8371e7bf6d5cb3f3cfcf3bfc383c51a98c86",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一只手柄旁边一个沙漏",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张清单和一个没打勾的框",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
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
   "key": "锁",
   "source_phrase": "一把锁",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-358d5f2fde9fe1e251e1.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "柱状图",
   "source_phrase": "一个“只查一次”的小计数器",
   "sha256": "bd524c451ddd9869f223993b61adee245bf3bf8dd4a702e2728c087da609f002",
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

这个技能是只读诊断入口：查看卡顿前后的性能记录、检查记录程序是否正常、核对内存异常线索。记录、图表、剪贴板和备份等完整能力在项目页，〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 只看不修：不启动、不停止、不重启采集、Docker、网络和电源；你明确说要修，才另外去修。
- 先看记录全不全：空档、没覆盖到、读不到的读数都算缺证据，不当“正常”。
- 线索不是原因：超过阈值、调度抖动、系统事件次数都只是候选；不拿“占用最大的那个程序”点名。
- 睡眠和断档分开：“采集空档”不当成睡了；内存日志的保留时长，不等于中间每一段都有记录。
- 没有游戏帧不等于坏了：分清空闲等待、等帧和采集失败；只有真看到帧才报帧率。
- 备份清单对得上，不等于刚重新算过指纹，更不等于恢复演练过；三件事分开说。
- 不取程序名、窗口标题、命令行、IP 这类原始内容。
- 一次只查所需时段，最长 168 小时，不拆成多次绕开上限；哪一路读不到就说明证据缺口，不用它来下结论，结合其它已核实证据，不反复重试。

::screen{#skill-timeaudit-diagnostics-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-timeaudit-diagnostics-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，四行，右列的名字画成链接；表格下面一张卡片“不做”，三条短句。每块左上一个小水彩图标（一卷心电图纸带打着勾、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成四张小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”三条在最后。",
  "links": [
   {
    "text": "个人理解库",
    "href": "/skills/daily-preferences/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   },
   {
    "text": "六张看板",
    "href": "/projects/timeaudit/#g-view"
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
   "portrait_required": true,
   "aspect": "16:9",
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
      "_library/icons/代码窗口.png"
     ]
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。\n2026-10-04 空白专查追加（AI实施；本人本轮明确授权重排）：管的范围、不管事项表、不做事项按原序整宽纵排，避免短范围卡撑成左空长栏。 定稿和素材原件不改。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
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
      "_library/icons/代码窗口.png"
     ]
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-timeaudit-diagnostics\\page.json",
    "source_sha256": "12dc000bbf187f3b08e59c19ce978f0bb21c4c7aee13f969b8b5b2dffc6fced5",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "source_phrase": "一卷心电图纸带打着勾",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "不做\n不自己采集、不写数据库，也不当第二个看门狗。不下“根因已查明”的结论；证据只到“候选”。日常诊断不跑逐表校验整个数据库的审计脚本，也不去Grafana里翻原始数据。",
   "sha256": "ec06b2763c41e770bca19764b7c98dab4881a002059343decdb801f1a4f0281f",
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
电脑卡顿、卡死、掉帧、变慢的事后查证；某段时间的温度、功率、帧率等性能历史；TimeAudit 记录现在正不正常、采集程序自己占多少资源；Windows 内存黑匣子记到哪；备份校验到了哪一步。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 某天、某周用了哪些软件，屏幕时间 | 〔个人理解库〕，要先解锁个人资料 |
| 修电脑、改设置、重启服务 | 明确说要修，AI 再按〔电脑配置与恢复〕去做 |
| 找回复制过的东西 | 〔密码中心〕里的剪贴板历史标签 |
| 自己看曲线 | 本机 Grafana 看板，见〔六张看板〕 |

**不做**
- 不自己采集、不写数据库，也不当第二个看门狗。
- 不下“根因已查明”的结论；证据只到“候选”。
- 日常诊断不跑逐表校验整个数据库的审计脚本，也不去 Grafana 里翻原始数据。
