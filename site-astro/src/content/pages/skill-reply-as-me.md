---
{
 "title": "替我拟消息",
 "kind": "skill",
 "url": "/skills/reply-as-me/",
 "tagline": "意思我定，AI 看发给谁、什么关系，写得自然。",
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
  "page": "skill-reply-as-me",
  "kind": "skill",
  "title": "替我拟消息",
  "url": "/skills/reply-as-me/",
  "tagline": "意思我定，AI 看发给谁、什么关系，写得自然。",
  "status": "",
  "based_on": {
   "commit": "64c67cacad880fbe6c121db838db8e82bdcb3768",
   "commit_time": "2026-09-28T01:16:12+08:00",
   "file": "E:\\.agents\\skills\\reply-as-me\\SKILL.md；项目 personal-expression fb082dc"
  },
  "video_prompt": "",
  "registry": {
   "mentions": [
    {
     "target": "/projects/personal-expression/",
     "screen": "skill-reply-as-me-01",
     "text": "个人表达"
    },
    {
     "target": "/projects/personal-expression/#features",
     "screen": "skill-reply-as-me-03",
     "text": "去看全部功能"
    },
    {
     "target": "/projects/personal-expression/#usage",
     "screen": "skill-reply-as-me-03",
     "text": "从意思到一条消息"
    },
    {
     "target": "/skills/wechat-direct/",
     "screen": "skill-reply-as-me-04",
     "text": "微信直读"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "skill-reply-as-me-04",
     "text": "个人理解库"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-reply-as-me-04",
     "text": "个人正式文书"
    },
    {
     "target": "/skills/explain-to-me/",
     "screen": "skill-reply-as-me-04",
     "text": "讲给我听"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能里的命令（scenes、reply --relationship）、字段名（prior、stage、outcome、ai_draft_contrasts）和资料锁的 screen/factor 分类不上页；命令在项目页技术屏。",
    "技能原文里有一条场合限制涉及不上网站的场合，页面改写成“办事的消息写得清楚得体，不套亲近的口吻”。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏两段和七句“怎么跟 AI 说”；第 2 屏“我：……”和 AI 交回里对“你”说的话；第 4 屏“管”一段。",
    "第 2 屏换成真实例子：reply-contrasts.jsonl 两条 friend 对照（friend-decline-dinner-first-draft 被否、friend-decline-dinner-approved 认可，任务 01a07e82，9 月 8 日）。场景本身是当时的虚构试写，图上照实写明；稿子是 AI 起草的，评价是本人原话；本人认可那条评价的后半句涉及不上网站的话题，已截掉。没有出现任何别人说的话。",
    "sha256:219ddd6a3e37f27d1dc32e1bfa82c8d9cef3b60afaf457a6ba9cb3e3394d235d",
    "第 3 屏“能做的事”链到 #features；若拼页程序支持，可改链 #g-reply。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-reply-as-me/page.json",
  "sha256": "989d3980eed6ab1e854890263e7c0c43b0b1013d973a5afe09855efd0b14bb83",
  "converted_at_beijing": "2026-10-10T05:26:53+08:00"
 }
}
---

::screen{#skill-reply-as-me-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-reply-as-me-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版：左上毛笔艺术字大标题，下面一行小字（技能名那一行，项目名画成链接）。左半边上下两段：“它做什么”“不用点名”。右半边一张大的水彩对话卡片“怎么跟 AI 说”：七句说法，每句一个浅绿色圆角对话气泡，一列排下来，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上。",
  "portrait": "竖版：标题和技能名一行；两段文字依次往下；插画缩成一行；七个对话气泡一行一个。",
  "links": [
   {
    "text": "个人表达",
    "href": "/projects/personal-expression/"
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "inline_link",
    "dialogue",
    "content_card",
    "illustration",
    "notice",
    "tag"
   ],
   "portrait_component_order": [
    "prose",
    "illustration",
    "dialogue",
    "chapter_title",
    "inline_link",
    "content_card",
    "notice",
    "tag"
   ],
   "source_layout": {
    "desktop": "横版：左上毛笔艺术字大标题，下面一行小字（技能名那一行，项目名画成链接）。左半边上下两段：“它做什么”“不用点名”。右半边一张大的水彩对话卡片“怎么跟 AI 说”：七句说法，每句一个浅绿色圆角对话气泡，一列排下来，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上。",
    "portrait": "竖版：标题和技能名一行；两段文字依次往下；插画缩成一行；七个对话气泡一行一个。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它做什么",
     "不用点名",
     "怎么跟 AI 说"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右上角一幅小插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上毛笔艺术字大标题，下面一行小字（技能名那一行，项目名画成链接）。左半边上下两段：“它做什么”“不用点名”。右半边一张大的水彩对话卡片“怎么跟 AI 说”：七句说法，每句一个浅绿色圆角对话气泡，一列排下来，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上。",
   "portrait": "竖版：标题和技能名一行；两段文字依次往下；插画缩成一行；七个对话气泡一行一个。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "替我拟消息"
    },
    {
     "type": "prose",
     "text_ref": "技能名reply-as-me·个人表达项目的入口"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "row": "intro",
     "width": "50%",
     "text_ref": "它做什么"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "row": "intro",
     "text_ref": "不用点名"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "intro",
     "width": "50%",
     "align": "center"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 2,
     "tail": true,
     "text_ref": "怎么跟AI说",
     "bubble_columns": 2
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n横版右侧一大‘怎么跟AI说’外卡内七个气泡：dialogue.split_paras 已支持七句、一列、组名一次；钢笔便签/三个空白标签/未封信封插画在右上，当前没有与该外卡顶部绑定的 overlay 位置接口。竖版插画在两段说明后、七泡前。\n当前该屏 manifest 没有 illustration 记录，不能由现有其他页的小图标替代。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "横版右侧一大‘怎么跟AI说’外卡内七个气泡：dialogue.split_paras 已支持七句、一列、组名一次；钢笔便签/三个空白标签/未封信封插画在右上，当前没有与该外卡顶部绑定的 overlay 位置接口。竖版插画在两段说明后、七泡前。",
    "当前该屏 manifest 没有 illustration 记录，不能由现有其他页的小图标替代。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "prose",
    "inline_link",
    "dialogue",
    "content_card",
    "illustration",
    "notice",
    "tag"
   ],
   "portrait_component_order": [
    "prose",
    "illustration",
    "dialogue",
    "chapter_title",
    "inline_link",
    "content_card",
    "notice",
    "tag"
   ],
   "source_layout": {
    "desktop": "横版：左上毛笔艺术字大标题，下面一行小字（技能名那一行，项目名画成链接）。左半边上下两段：“它做什么”“不用点名”。右半边一张大的水彩对话卡片“怎么跟 AI 说”：七句说法，每句一个浅绿色圆角对话气泡，一列排下来，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上。",
    "portrait": "竖版：标题和技能名一行；两段文字依次往下；插画缩成一行；七个对话气泡一行一个。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它做什么",
     "不用点名",
     "怎么跟 AI 说"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右上角一幅小插画"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上毛笔艺术字大标题，下面一行小字（技能名那一行，项目名画成链接）。左半边上下两段：“它做什么”“不用点名”。右半边一张大的水彩对话卡片“怎么跟 AI 说”：七句说法，每句一个浅绿色圆角对话气泡，一列排下来，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上。",
   "portrait": "竖版：标题和技能名一行；两段文字依次往下；插画缩成一行；七个对话气泡一行一个。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "替我拟消息"
    },
    {
     "type": "prose",
     "text_ref": "技能名reply-as-me·个人表达项目的入口"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "它做什么"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "不用点名"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "target_width": "100%"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "tail": true,
     "text_ref": "怎么跟AI说"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n横版右侧一大‘怎么跟AI说’外卡内七个气泡：dialogue.split_paras 已支持七句、一列、组名一次；钢笔便签/三个空白标签/未封信封插画在右上，当前没有与该外卡顶部绑定的 overlay 位置接口。竖版插画在两段说明后、七泡前。\n当前该屏 manifest 没有 illustration 记录，不能由现有其他页的小图标替代。\n资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。",
   "unsupported_requirements": [
    "横版右侧一大‘怎么跟AI说’外卡内七个气泡：dialogue.split_paras 已支持七句、一列、组名一次；钢笔便签/三个空白标签/未封信封插画在右上，当前没有与该外卡顶部绑定的 overlay 位置接口。竖版插画在两段说明后、七泡前。",
    "当前该屏 manifest 没有 illustration 记录，不能由现有其他页的小图标替代。",
    "资产清单的 illustration 仅 0 项，文字盘点需要 1 个插画位；缺 1 个候选位，且已有候选未做图像语义验收。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 1,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
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
   "asset": "_library/round3/clean-assets/png/48-main-personal-expression-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-personal-expression",
   "source_phrase": "右上角一幅小插画：一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上。",
   "sha256": "bd2a55824d3c0d660ba3ec66f21d697f621eaa21cb14c7fc62a0c8f0eec1ca44",
   "status": "ready",
   "original_elements": [
    "一支钢笔在便签上写字，便签上方三个空白小标签牌，其中一个亮绿，旁边一个信封口朝下、没封上"
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
   "asset": "skill-reply-as-me/skill-reply-as-me-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\img\\skill-reply-as-me-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a7004192c7864b550388",
   "title_text": "替我拟消息",
   "sha256": "ba8ddde12932654b4728e6553b2810883a67d3cfed1e3148bb054d60a6a9b0e0",
   "status": "ready",
   "source_box": [
    23,
    21,
    739,
    254
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 替我拟消息

技能名 reply-as-me · 〔个人表达〕项目的入口

**它做什么**
我已经想好要说什么，AI 先看这条发给谁、我们什么关系，参考我平时对这类人怎么说，写成一条自然、合适、不别扭的消息。可以比我以前说得好，不追求像我。它不替我定说什么，也不替我发。

**不用点名**
说“帮我回”“帮我写自然点”，AI 自己会用上；别的项目定好了意思、只差写成话时，也在原来的对话里直接用。

**怎么跟 AI 说**
“帮我按平时的口吻回这条，意思是：今晚不去了，硬盘我叫跑腿送过去。”
“给二姨回个消息，说国庆回不去，语气软一点。”
“给银行客服回一句，把问题说清楚就行。”
“这句帮我写自然一点，意思别变。”
“这稿人机味道太冲，重写。”
“微信消息要分条，别写成一整段。”
“拆成两条发，第一条先答对方问的。”

::screen{#skill-reply-as-me-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-reply-as-me-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题，旁边一枚浅绿色小标签（真实的一次那一行）。左右两栏对照：左栏标题“被我否掉的一稿”，三个左对齐的白底短气泡（第三个是一整块灰色长气泡，里面只画几道浅灰短线表示一整段说明），下面一张灰底小卡片放我的评价，右上角一个红色小叉；右栏标题“我认可的一稿”，三个短气泡，下面一张浅绿底小卡片放我的评价，右上角一个绿色小对勾。两栏下面一条横跨整屏的细卡片“学到的”，左端一本小册子夹进一枚书签。",
  "portrait": "竖版：标题和标签；“被我否掉的一稿”和评价在上，“我认可的一稿”和评价在下；“学到的”放最后。",
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "tag",
    "comparison",
    "dialogue",
    "content_card",
    "notice"
   ],
   "portrait_component_order": [
    "tag",
    "chapter_title",
    "comparison",
    "dialogue",
    "content_card",
    "notice"
   ],
   "source_layout": {
    "desktop": "横版：左上标题，旁边一枚浅绿色小标签（真实的一次那一行）。左右两栏对照：左栏标题“被我否掉的一稿”，三个左对齐的白底短气泡（第三个是一整块灰色长气泡，里面只画几道浅灰短线表示一整段说明），下面一张灰底小卡片放我的评价，右上角一个红色小叉；右栏标题“我认可的一稿”，三个短气泡，下面一张浅绿底小卡片放我的评价，右上角一个绿色小对勾。两栏下面一条横跨整屏的细卡片“学到的”，左端一本小册子夹进一枚书签。",
    "portrait": "竖版：标题和标签；“被我否掉的一稿”和评价在上，“我认可的一稿”和评价在下；“学到的”放最后。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "被我否掉的一稿",
     "我认可的一稿"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题，旁边一枚浅绿色小标签（真实的一次那一行）。左右两栏对照：左栏标题“被我否掉的一稿”，三个左对齐的白底短气泡（第三个是一整块灰色长气泡，里面只画几道浅灰短线表示一整段说明），下面一张灰底小卡片放我的评价，右上角一个红色小叉；右栏标题“我认可的一稿”，三个短气泡，下面一张浅绿底小卡片放我的评价，右上角一个绿色小对勾。两栏下面一条横跨整屏的细卡片“学到的”，左端一本小册子夹进一枚书签。",
   "portrait": "竖版：标题和标签；“被我否掉的一稿”和评价在上，“我认可的一稿”和评价在下；“学到的”放最后。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "真实的一次：9月8日的一次试写（场景是编的，两版稿子和我的评价是真的）。意思已经"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "tail": false,
     "row": "drafts",
     "width": "50%",
     "text_ref": "被我否掉的一稿"
    },
    {
     "type": "notice",
     "tone": "gray",
     "row": "drafts",
     "text_ref": "我的评价：“这个回答验收不通过，人机味道太冲；微信消息也没有分条”"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "tail": false,
     "row": "drafts",
     "width": "50%",
     "text_ref": "我认可的一稿"
    },
    {
     "type": "notice",
     "tone": "green",
     "row": "drafts",
     "text_ref": "我的评价（转述）：验收通过；表达虽然还不够热情，但至少自然，比上一版少了多余的话。"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "学到的（写进了拟消息指南和AI稿对照）"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源左侧第三个长泡只画灰线，但定稿明确包含‘（后面还有一整段，说明地点可以选、我在家能交件）’，按逐字标准保留原句，不能画灰线删字。\n左泡白底/第三泡灰底、左评价灰底加红叉、右评价绿底加勾、底部册子书签缺逐泡色/角标/卡头图标接口和明确素材映射。tag 应在标题旁，同 row 的序列节点不能指定同一标题基线。",
   "unsupported_requirements": [
    "源左侧第三个长泡只画灰线，但定稿明确包含‘（后面还有一整段，说明地点可以选、我在家能交件）’，按逐字标准保留原句，不能画灰线删字。",
    "左泡白底/第三泡灰底、左评价灰底加红叉、右评价绿底加勾、底部册子书签缺逐泡色/角标/卡头图标接口和明确素材映射。tag 应在标题旁，同 row 的序列节点不能指定同一标题基线。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "tag",
    "comparison",
    "dialogue",
    "content_card",
    "notice"
   ],
   "portrait_component_order": [
    "tag",
    "chapter_title",
    "comparison",
    "dialogue",
    "content_card",
    "notice"
   ],
   "source_layout": {
    "desktop": "横版：左上标题，旁边一枚浅绿色小标签（真实的一次那一行）。左右两栏对照：左栏标题“被我否掉的一稿”，三个左对齐的白底短气泡（第三个是一整块灰色长气泡，里面只画几道浅灰短线表示一整段说明），下面一张灰底小卡片放我的评价，右上角一个红色小叉；右栏标题“我认可的一稿”，三个短气泡，下面一张浅绿底小卡片放我的评价，右上角一个绿色小对勾。两栏下面一条横跨整屏的细卡片“学到的”，左端一本小册子夹进一枚书签。",
    "portrait": "竖版：标题和标签；“被我否掉的一稿”和评价在上，“我认可的一稿”和评价在下；“学到的”放最后。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "被我否掉的一稿",
     "我认可的一稿"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题，旁边一枚浅绿色小标签（真实的一次那一行）。左右两栏对照：左栏标题“被我否掉的一稿”，三个左对齐的白底短气泡（第三个是一整块灰色长气泡，里面只画几道浅灰短线表示一整段说明），下面一张灰底小卡片放我的评价，右上角一个红色小叉；右栏标题“我认可的一稿”，三个短气泡，下面一张浅绿底小卡片放我的评价，右上角一个绿色小对勾。两栏下面一条横跨整屏的细卡片“学到的”，左端一本小册子夹进一枚书签。",
   "portrait": "竖版：标题和标签；“被我否掉的一稿”和评价在上，“我认可的一稿”和评价在下；“学到的”放最后。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "真实的一次：9月8日的一次试写（场景是编的，两版稿子和我的评价是真的）。意思已经"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "tail": false,
     "text_ref": "被我否掉的一稿"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "我的评价：“这个回答验收不通过，人机味道太冲；微信消息也没有分条”"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "tail": false,
     "text_ref": "我认可的一稿"
    },
    {
     "type": "notice",
     "tone": "green",
     "text_ref": "我的评价（转述）：验收通过；表达虽然还不够热情，但至少自然，比上一版少了多余的话。"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "学到的（写进了拟消息指南和AI稿对照）"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源左侧第三个长泡只画灰线，但定稿明确包含‘（后面还有一整段，说明地点可以选、我在家能交件）’，按逐字标准保留原句，不能画灰线删字。\n左泡白底/第三泡灰底、左评价灰底加红叉、右评价绿底加勾、底部册子书签缺逐泡色/角标/卡头图标接口和明确素材映射。tag 应在标题旁，同 row 的序列节点不能指定同一标题基线。",
   "unsupported_requirements": [
    "源左侧第三个长泡只画灰线，但定稿明确包含‘（后面还有一整段，说明地点可以选、我在家能交件）’，按逐字标准保留原句，不能画灰线删字。",
    "左泡白底/第三泡灰底、左评价灰底加红叉、右评价绿底加勾、底部册子书签缺逐泡色/角标/卡头图标接口和明确素材映射。tag 应在标题旁，同 row 的序列节点不能指定同一标题基线。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 0,
    "semantic_image_reviewed": false
   }
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
   "asset": "_library/round3/titles/title-r3-1bd7ab40a6647c38f32a.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\img\\skill-reply-as-me-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-1bd7ab40a6647c38f32a",
   "title_text": "一个完整例子",
   "sha256": "2304e84af71ae809ed22525bb17a83cdc977e8073e268216601e3a099b2b6fc4",
   "status": "ready",
   "source_box": [
    38,
    9,
    540,
    112
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 一个完整例子

真实的一次：9 月 8 日的一次试写（场景是编的，两版稿子和我的评价是真的）。意思已经定了：今晚不去朋友的饭局；答应过的硬盘，今晚叫跑腿送过去，要对方给个地址。

**被我否掉的一稿**
“吃饭唱歌都别算我”
“费用我出，省得你绕一趟”
（后面还有一整段，说明地点可以选、我在家能交件）
我的评价：“这个回答验收不通过，人机味道太冲；微信消息也没有分条”

**我认可的一稿**
“今晚不去了，今天不想出门”
“硬盘我叫个跑腿给你送过去”
“你发个地址给我”
我的评价（转述）：验收通过；表达虽然还不够热情，但至少自然，比上一版少了多余的话。

**学到的**（写进了拟消息指南和 AI 稿对照）
朋友之间的拒绝和交接，直接讲决定、安排和要对方给什么；主动解释费用、强调替对方省事，是这种场合不会说的多余话。微信按自然的消息分条，换行就是一条，不编号。这一条只管这类场合：真有费用分歧时，费用照样要说清。

::screen{#skill-reply-as-me-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-reply-as-me-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下面一行字，里面的链接画成绿色带小箭头；再下面一张卡片“另外两条”，两条短句，每条前一个小水彩图标（一个公文包、一只手把一张纸递回对话框）。",
  "portrait": "竖版：横幅在上，按钮单独一行；那行字；两条一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/personal-expression/#features",
    "locator_text": {
     "h": "去看全部功能>"
    }
   },
   {
    "text": "从意思到一条消息",
    "href": "/projects/personal-expression/#personal-expression-04"
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "notice",
    "action_button",
    "inline_link",
    "content_card",
    "bullet_list",
    "icon"
   ],
   "portrait_component_order": [
    "notice",
    "action_button",
    "chapter_title",
    "inline_link",
    "content_card",
    "bullet_list",
    "icon"
   ],
   "source_layout": {
    "desktop": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下面一行字，里面的链接画成绿色带小箭头；再下面一张卡片“另外两条”，两条短句，每条前一个小水彩图标（一个公文包、一只手把一张纸递回对话框）。",
    "portrait": "竖版：横幅在上，按钮单独一行；那行字；两条一行一条。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "另外两条"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "下面一张卡片“另外两条”，两条短句，每条前一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下面一行字，里面的链接画成绿色带小箭头；再下面一张卡片“另外两条”，两条短句，每条前一个小水彩图标（一个公文包、一只手把一张纸递回对话框）。",
   "portrait": "竖版：横幅在上，按钮单独一行；那行字；两条一行一条。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事"
    },
    {
     "type": "notice",
     "tone": "green",
     "inline_button": "去看全部功能",
     "text_ref": "这个技能能做的事，就是个人表达项目里“替我拟消息”和“记住纠正”两组功能。去看全"
    },
    {
     "type": "prose",
     "text_ref": "拟稿的五步和规矩（先看关系、没样本照写、意思不变、不搬旧事、拿不准就问）见从意思"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "另外两条"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源‘能做的事’正文横幅与句末原链接提升为按钮已用 notice.inline_button 表达；竖版按钮另行由组件处理。下卡两条需要公文包/递纸回对话小图，未有明确逐项图标映射。\n源文字链接只按原定稿渲染，不额外添加箭头字符；是否需要该页链接小箭头须整合按‘本页其它链接也带’规则核对。\n清单未登记这些完整原文的逐字一致毛笔标题图：能做的事；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "源‘能做的事’正文横幅与句末原链接提升为按钮已用 notice.inline_button 表达；竖版按钮另行由组件处理。下卡两条需要公文包/递纸回对话小图，未有明确逐项图标映射。",
    "源文字链接只按原定稿渲染，不额外添加箭头字符；是否需要该页链接小箭头须整合按‘本页其它链接也带’规则核对。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：能做的事；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 2,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "notice",
    "action_button",
    "inline_link",
    "content_card",
    "bullet_list",
    "icon"
   ],
   "portrait_component_order": [
    "notice",
    "action_button",
    "chapter_title",
    "inline_link",
    "content_card",
    "bullet_list",
    "icon"
   ],
   "source_layout": {
    "desktop": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下面一行字，里面的链接画成绿色带小箭头；再下面一张卡片“另外两条”，两条短句，每条前一个小水彩图标（一个公文包、一只手把一张纸递回对话框）。",
    "portrait": "竖版：横幅在上，按钮单独一行；那行字；两条一行一条。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "另外两条"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "下面一张卡片“另外两条”，两条短句，每条前一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下面一行字，里面的链接画成绿色带小箭头；再下面一张卡片“另外两条”，两条短句，每条前一个小水彩图标（一个公文包、一只手把一张纸递回对话框）。",
   "portrait": "竖版：横幅在上，按钮单独一行；那行字；两条一行一条。",
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事"
    },
    {
     "type": "notice",
     "tone": "green",
     "inline_button": "去看全部功能",
     "text_ref": "这个技能能做的事，就是个人表达项目里“替我拟消息”和“记住纠正”两组功能。去看全"
    },
    {
     "type": "prose",
     "text_ref": "拟稿的五步和规矩（先看关系、没样本照写、意思不变、不搬旧事、拿不准就问）见从意思"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "另外两条"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n源‘能做的事’正文横幅与句末原链接提升为按钮已用 notice.inline_button 表达；竖版按钮另行由组件处理。下卡两条需要公文包/递纸回对话小图，未有明确逐项图标映射。\n源文字链接只按原定稿渲染，不额外添加箭头字符；是否需要该页链接小箭头须整合按‘本页其它链接也带’规则核对。\n清单未登记这些完整原文的逐字一致毛笔标题图：能做的事；现 core 会用字体兜底，不能称标题素材通过。\n资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "源‘能做的事’正文横幅与句末原链接提升为按钮已用 notice.inline_button 表达；竖版按钮另行由组件处理。下卡两条需要公文包/递纸回对话小图，未有明确逐项图标映射。",
    "源文字链接只按原定稿渲染，不额外添加箭头字符；是否需要该页链接小箭头须整合按‘本页其它链接也带’规则核对。",
    "清单未登记这些完整原文的逐字一致毛笔标题图：能做的事；现 core 会用字体兜底，不能称标题素材通过。",
    "资产清单的 icon 仅 1 项，文字盘点预算 2 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "icon": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 2,
    "semantic_image_reviewed": false
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
   "asset": "_library/round3/clean-assets/png/13-公文包清单-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "公文包清单",
   "source_phrase": "一个公文包",
   "sha256": "6c838cf1f00338d2d467304875ffcc24263ed89010212c4d382029d3e92434fa",
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
   "source_phrase": "一只手把一张纸递回对话框",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-skill-daily-preferences-03-title-01-c71400b33745.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "3e1b1e7f7b0486348d5ac2f82ea417096517df35396e802621d852f77d194360",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 能做的事

这个技能能做的事，就是个人表达项目里“替我拟消息”和“记住纠正”两组功能。〔去看全部功能〕

拟稿的五步和规矩（先看关系、没样本照写、意思不变、不搬旧事、拿不准就问）见〔从意思到一条消息〕。

**另外两条**
- 办事的消息写得清楚得体，不套跟熟人聊天的口吻。
- 复用当前对话读过的资料，不另开一个模型改写。

::screen{#skill-reply-as-me-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-reply-as-me-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一支打钩的钢笔、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写这些事，下面写找谁）；“不做”四条放最后。",
  "links": [
   {
    "text": "微信直读",
    "href": "/skills/wechat-direct/"
   },
   {
    "text": "个人理解库",
    "href": "/skills/daily-preferences/"
   },
   {
    "text": "个人正式文书",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "讲给我听",
    "href": "/skills/explain-to-me/"
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
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "table",
    "inline_link",
    "bullet_list",
    "icon",
    "prose"
   ],
   "portrait_component_order": [
    "content_card",
    "table",
    "chapter_title",
    "inline_link",
    "bullet_list",
    "icon",
    "prose"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一支打钩的钢笔、一个指路牌、一个禁止小标）。",
    "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写这些事，下面写找谁）；“不做”四条放最后。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "管",
     "不管，交给谁",
     "不做"
    ],
    "table_shapes": [
     {
      "start_line": 7,
      "columns": 2,
      "data_rows": 5
     }
    ],
    "illustration_position_mentions": [
     "左上一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一支打钩的钢笔、一个指路牌、一个禁止小标）。",
   "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写这些事，下面写找谁）；“不做”四条放最后。",
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
     "whole_block": true,
     "text_ref": "管"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事找谁这条该不该发、说什么、怎么应对当前对话或对应的项目先定好读微信聊天、取"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "不做"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n保持左‘管’1/3、右表格及‘不做’2/3；竖表格由 table 族按五行转五卡，表头原字完整一次。钢笔勾/指路牌/禁标三个块卡头图需要明确 header_icon，当前没有语义映射。\n表格标题与表格现在是独立块，源要求同一右侧表格外卡；当前 row 只做列，未提供共同外卡 wrapper 字段。\n资产清单的 icon 仅 0 项，文字盘点预算 1 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "保持左‘管’1/3、右表格及‘不做’2/3；竖表格由 table 族按五行转五卡，表头原字完整一次。钢笔勾/指路牌/禁标三个块卡头图需要明确 header_icon，当前没有语义映射。",
    "表格标题与表格现在是独立块，源要求同一右侧表格外卡；当前 row 只做列，未提供共同外卡 wrapper 字段。",
    "资产清单的 icon 仅 0 项，文字盘点预算 1 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 1,
    "semantic_image_reviewed": false
   }
  },
  "v": {
   "portrait_required": true,
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\page.json",
   "source_sha256": "d707eb83d0810cc6deeaeda3be0cf4aeae42c6a556e032c9c46804c43b61c346",
   "desktop_component_order": [
    "chapter_title",
    "content_card",
    "table",
    "inline_link",
    "bullet_list",
    "icon",
    "prose"
   ],
   "portrait_component_order": [
    "content_card",
    "table",
    "chapter_title",
    "inline_link",
    "bullet_list",
    "icon",
    "prose"
   ],
   "source_layout": {
    "desktop": "横版：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一支打钩的钢笔、一个指路牌、一个禁止小标）。",
    "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写这些事，下面写找谁）；“不做”四条放最后。"
   },
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "管",
     "不管，交给谁",
     "不做"
    ],
    "table_shapes": [
     {
      "start_line": 7,
      "columns": 2,
      "data_rows": 5
     }
    ],
    "illustration_position_mentions": [
     "左上一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "scene": "横版：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一支打钩的钢笔、一个指路牌、一个禁止小标）。",
   "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写这些事，下面写找谁）；“不做”四条放最后。",
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
     "whole_block": true,
     "text_ref": "管"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事找谁这条该不该发、说什么、怎么应对当前对话或对应的项目先定好读微信聊天、取"
    },
    {
     "type": "points_card",
     "columns": 1,
     "whole_block": true,
     "text_ref": "不做"
    }
   ],
   "notes": "本轮仅读取定稿、文字盘点和组件字段，不读图片、不出图。构图依据以 source_layout 的完整 scene/portrait 为准，组件顺序列表仅供交叉核对。定稿文字和编号完整保留；未支持的源构图要求如下，不能据规格保存成功宣称视觉验收通过。\n保持左‘管’1/3、右表格及‘不做’2/3；竖表格由 table 族按五行转五卡，表头原字完整一次。钢笔勾/指路牌/禁标三个块卡头图需要明确 header_icon，当前没有语义映射。\n表格标题与表格现在是独立块，源要求同一右侧表格外卡；当前 row 只做列，未提供共同外卡 wrapper 字段。\n资产清单的 icon 仅 0 项，文字盘点预算 1 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。",
   "unsupported_requirements": [
    "保持左‘管’1/3、右表格及‘不做’2/3；竖表格由 table 族按五行转五卡，表头原字完整一次。钢笔勾/指路牌/禁标三个块卡头图需要明确 header_icon，当前没有语义映射。",
    "表格标题与表格现在是独立块，源要求同一右侧表格外卡；当前 row 只做列，未提供共同外卡 wrapper 字段。",
    "资产清单的 icon 仅 0 项，文字盘点预算 1 个图标位；差 1 个候选位（预算为盘点估计，不作已核实语义结论）。"
   ],
   "asset_evidence": {
    "manifest_records": {
     "title": 1
    },
    "inventory_illustration_slots": 0,
    "inventory_icon_slots": 1,
    "semantic_image_reviewed": false
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
   "asset": "_library/round3/late-clean-review/pen-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钢笔",
   "source_phrase": "一支打钩的钢笔",
   "sha256": "6c4493be74e722fa3e8f1c2c95574768fe9c5da8b6afa27a3f66406d68c9a6a8",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-reply-as-me\\img\\skill-reply-as-me-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7a7e13ca96796233d6be",
   "title_text": "边界",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready",
   "source_box": [
    29,
    58,
    269,
    259
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 边界

**管**
意思定好之后，把给别人的消息写自然、改自然；我纠正后当场改稿，把教训记下来；眼前的事确实需要时，从微信里补我以前的说法。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 这条该不该发、说什么、怎么应对 | 当前对话或对应的项目先定好 |
| 读微信聊天、取聊天里的图片和表情 | 〔微信直读〕 |
| 我的背景、经历和偏好 | 〔个人理解库〕 |
| 合同、协议、通知这类正式文书的正文 | 〔个人正式文书〕 |
| AI 向我解释事情 | 〔讲给我听〕 |

**不做**
- 不发送。
- 不追求复刻我，不堆我的口头禅；我以前的说法也可以改好。
- 不用“像不像我”的打分代替我的认可。
- 我的说法样本只用来参考口吻，不拿来判断正在用电脑的是不是我本人。
