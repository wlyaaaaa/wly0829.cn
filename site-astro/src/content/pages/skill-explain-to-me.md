---
{
 "title": "讲给我听",
 "kind": "skill",
 "url": "/skills/explain-to-me/",
 "tagline": "AI 向我说明时照同一本手册讲，讲到我一遍就懂。",
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
  "page": "skill-explain-to-me",
  "kind": "skill",
  "title": "讲给我听",
  "url": "/skills/explain-to-me/",
  "tagline": "AI 向我说明时照同一本手册讲，讲到我一遍就懂。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-08 22:26"
   },
   "facts": [
    "近 7 天 AI 用了 16 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "based_on": {
   "commit": "64c67cacad880fbe6c121db838db8e82bdcb3768",
   "commit_time": "2026-09-28T01:16:12+08:00",
   "file": "E:\\.agents\\skills\\explain-to-me\\SKILL.md；项目 personal-expression fb082dc"
  },
  "video_prompt": "",
  "registry": {
   "mentions": [
    {
     "target": "/projects/personal-expression/",
     "screen": "skill-explain-to-me-01",
     "text": "个人表达"
    },
    {
     "target": "/rules/charter/#L2",
     "screen": "skill-explain-to-me-01",
     "text": "约法 L2"
    },
    {
     "target": "/rules/charter/#L5",
     "screen": "skill-explain-to-me-01",
     "text": "L5"
    },
    {
     "target": "/projects/personal-expression/#usage",
     "screen": "skill-explain-to-me-01",
     "text": "个人表达项目页"
    },
    {
     "target": "/projects/personal-expression/#features",
     "screen": "skill-explain-to-me-03",
     "text": "去看全部功能"
    },
    {
     "target": "/skills/reply-as-me/",
     "screen": "skill-explain-to-me-04",
     "text": "替我拟消息"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "skill-explain-to-me-04",
     "text": "个人理解库"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-explain-to-me-04",
     "text": "个人正式文书"
    },
    {
     "target": "/skills/report-page/",
     "screen": "skill-explain-to-me-04",
     "text": "汇报网页"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能里给 AI 的命令（python expression.py explain）和资料文件路径不上页：读者要的是怎么说、会发生什么；命令在项目页技术屏。",
    "“本人状态很差时的默认做法”只在项目页写一句（f-low-mood），技能页不重复。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏“它做什么”“为什么有它”两段和七句“怎么跟 AI 说”；第 2 屏“我：……”两句；第 4 屏“管”一段。",
    "第 2 屏换成真实例子（9 月 25 日 Claude 对话 6b1e27e0，P7 待决项里的 DriveUpload）：本人两句原话、AI 查清的结果和写回手册的教训都出自讲解手册“三、来源与案例”09-25 那条；手册没记 AI 当时重讲的原文，所以页面只写 AI 做了什么，不编 AI 的话。",
    "“怎么跟 AI 说”七句都是本人原话，出自讲解手册案例：09-17 01a0abb7、09-20 01a0bf1f、09-25 01a0d813、09-25 Claude 44cdc279/dde6ffe1、09-21 01a0ba3a、09-26 Claude（媒体取舍标准卡）、09-17 至 18 理解库测试会话（“细说”“我想知道详细一点”两句合成一个气泡）。",
    "第 3 屏“能做的事”链到 #features（全站规矩要求），但讲给我听只对应其中两组；若拼页程序支持，可改链 #g-explain。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-explain-to-me/page.json",
  "sha256": "c156b7b972f58a17b92bd2c701a6e72d57ab2f7f7db9ff92e81c7961861e318a",
  "converted_at_beijing": "2026-10-10T11:55:34+08:00"
 }
}
---

::screen{#skill-explain-to-me-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-explain-to-me-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版：左上毛笔艺术字大标题，下面一行小字（技能名那一行，项目名画成链接）。左半边上下三段：“它做什么”“为什么有它”“不用点名”，链接画成绿色带小箭头。右半边一张大的水彩对话卡片“怎么跟 AI 说”：卡片标题下一行灰色小字（括号那句），下面七句说法，每句画成一个浅绿色圆角对话气泡，一列排下来，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一团乱线穿过一只小漏斗，出来变成一条平直的绿线，旁边一只耳朵。",
  "portrait": "竖版：标题和技能名一行；三段文字依次往下；插画缩成一行；灰色小字和七个对话气泡一行一个。",
  "links": [
   {
    "text": "个人表达项目页",
    "href": "/projects/personal-expression/#personal-expression-03"
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
     "text_ref": "讲给我听",
     "row": "hero",
     "width": "52%"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 8 日 22:26",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 16 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "技能名"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "46%",
     "index": 0,
     "illustration": "outside",
     "motion_asset_sha256": "45119e65957d2caee38c7f30a533e33b44f58def734b45218225885dce1fd109",
     "motion_regions": [
      {
       "kind": "dot",
       "rect": [
        0.46741573033707867,
        0.3321678321678322,
        0.010112359550561797,
        0.038461538461538464
       ]
      }
     ]
    },
    {
     "type": "content_card",
     "row": "body",
     "width": "60%",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "它做什么",
     "icons": [
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "怎么跟 AI 说",
     "size": "small",
     "columns": 1,
     "row": "body",
     "columns_v": 1,
     "width": "38%"
    },
    {
     "type": "prose",
     "text_ref": "（下面都是我真说过的话",
     "columns": 1,
     "row": "body",
     "columns_v": 1
    },
    {
     "type": "dialogue",
     "text_ref": "“我没有听得懂",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "tail": true,
     "row": "body",
     "split_paras": true,
     "whole_block": true
    }
   ],
   "notes": "横版原图上部左标题技能名、右漏斗耳朵插画，下部左三张说明卡上下叠、右七句单列气泡整卡；竖版标题技能名、三说明卡、横带插画、七句气泡。本人真说过的话只引用定稿、不重写偏好或原话；原图约法L2/L5的写法与定稿不同，按定稿L2L5保留。 本轮将七个独立段落并入一个dialogue块，使用已实现split_paras形成七泡共享外卡；不改原文。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "讲给我听"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 8 日 22:26",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 16 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "它做什么",
     "icons": [
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/fix-round-2/icon-clean-b7d80255ba1c0ec4e1b6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "size": "banner"
    },
    {
     "type": "section_heading",
     "text_ref": "怎么跟 AI 说",
     "size": "small",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "prose",
     "text_ref": "（下面都是我真说过的话",
     "columns": 1,
     "columns_v": 1
    },
    {
     "type": "dialogue",
     "text_ref": "“我没有听得懂",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "tail": true,
     "split_paras": true,
     "whole_block": true
    }
   ],
   "notes": "横版原图上部左标题技能名、右漏斗耳朵插画，下部左三张说明卡上下叠、右七句单列气泡整卡；竖版标题技能名、三说明卡、横带插画、七句气泡。本人真说过的话只引用定稿、不重写偏好或原话；原图约法L2/L5的写法与定稿不同，按定稿L2L5保留。 本轮将七个独立段落并入一个dialogue块，使用已实现split_paras形成七泡共享外卡；不改原文。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "绿封面册",
   "source_phrase": "它做什么 \nAI向我汇报、解释、请我拍板时，需要就照这本手册讲；我说没听懂、说它答偏了，它回到我原来的问题重讲，再把这次的教训写回手册，下次换哪个AI都用得上。",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "为什么有它 \n我反复要AI说人话、别当谜语人（约法L2L5），这个技能就是这条要求的落地；手册里有什么，见个人表达项目页。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "不用点名 \nAI向我说明时需要就自己读，同一件事里读过就接着用；我说哪句难懂、太绕，它也会用上。",
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
   "asset": "_library/round3/late-clean-review/funnel-ear-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-5bc42b952ffaae",
   "source_phrase": "右上角一幅小插画：一团乱线穿过一只小漏斗，出来变成一条平直的绿线，旁边一只耳朵。",
   "sha256": "45119e65957d2caee38c7f30a533e33b44f58def734b45218225885dce1fd109",
   "status": "ready",
   "original_elements": [
    "一团乱线穿过一只小漏斗，出来变成一条平直的绿线，旁边一只耳朵"
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
   "asset": "_library/titles/title-74d04bc959504c855887.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-74d04bc959504c855887",
   "title_text": "讲给我听",
   "sha256": "8a2a8ca433736a6cdbc411b8e34f6e63e10884f32cf1b1c6434129d0cf67d67a",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 讲给我听

技能名 explain-to-me · 个人表达项目的入口

**它做什么**
AI 向我汇报、解释、请我拍板时，需要就照这本手册讲；我说没听懂、说它答偏了，它回到我原来的问题重讲，再把这次的教训写回手册，下次换哪个 AI 都用得上。

**为什么有它**
我反复要 AI 说人话、别当谜语人（约法 L2L5），这个技能就是这条要求的落地；手册里有什么，见〔个人表达项目页〕。

**不用点名**
AI 向我说明时需要就自己读，同一件事里读过就接着用；我说哪句难懂、太绕，它也会用上。

**怎么跟 AI 说**
（下面都是我真说过的话，9 月 17–26 日）
“我没有听得懂，人话是为什么呢”
“不是？你去哪了？我问的是个人资料访问授权”
“人话告诉我你们两个在干什么？”
“这个窗口有什么用”
“备份和恢复给我用有什么意义？”
“你刚刚说的不太能听得懂”
“细说，我想知道详细一点”

::screen{#skill-explain-to-me-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-explain-to-me-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题，旁边一枚浅绿色小标签（真实的一次那一行）。左边约三分之二宽画成一段竖向的对话：最上面 AI 的第一版（左对齐，白底气泡，上面画一个灰色小问号），下面我的两个气泡（右对齐，浅绿底）；然后“AI 做了什么”三步画成一条细竖线串起的三个小节点（小图标依次：一个掉头的箭头、一只放大镜照着一个文件夹、一本小册子夹进一枚书签）；最后“结果”一张绿色细边框的卡片。右边约三分之一宽一张竖卡片：画一个电脑文件夹图标，文件夹下面一个空白小标签和一个灰色小叉（表示早就没用），不画文件夹里的字。",
  "portrait": "竖版：标题和标签；对话从上到下：AI 第一版、我的两个气泡、三步、结果卡片；文件夹小卡片放最后，缩小。",
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
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子",
     "row": "head",
     "width": "36%"
    },
    {
     "type": "tag",
     "row": "head",
     "width": "62%",
     "text_ref": "真事："
    },
    {
     "type": "dialogue",
     "text_ref": "AI 第一版：",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "sides": [
      "left"
     ],
     "tail": true,
     "speaker_role": "ai",
     "row": "body",
     "width": "65%",
     "row_fit_illustration": true
    },
    {
     "type": "dialogue",
     "text_ref": "我：“234",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "sides": [
      "right"
     ],
     "tail": true,
     "speaker_role": "self",
     "row": "body"
    },
    {
     "type": "dialogue",
     "text_ref": "我：“你不需要核实",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "sides": [
      "right"
     ],
     "tail": true,
     "speaker_role": "self",
     "row": "body"
    },
    {
     "type": "section_heading",
     "row": "body",
     "size": "small",
     "text_ref": "AI 做了什么"
    },
    {
     "type": "flow",
     "row": "body",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "flow_direction": "vertical",
     "items_layout": {
      "count": 3,
      "card": "open",
      "path": "thin_vertical"
     },
     "text_ref": "1认出",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "row": "body",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "结果",
     "icons": "none"
    },
    {
     "type": "illustration",
     "row": "body",
     "width": "33%",
     "index": 0,
     "illustration": "top_inside",
     "asset": "_library/illustrations/文件夹电脑专图.png",
     "size": "large",
     "align": "center"
    }
   ],
   "notes": "横版标题左、真实的一次胶囊右；下部左约2/3为AI一白气泡、本人两绿气泡、三步细竖线节点、结果卡，右约1/3文件夹电脑整幅插画；竖版同序，电脑卡最后。AI 做了什么不是毛笔章节标题，按小节标题。保持本人两句原话与引号，不添选项或取舍。 本轮三步改接flow的direction=vertical，执行原规格已要求的纵向丝带；原三步文字完整保留。；本轮审查修复：本屏专属插画显式绑定到待补文件，02文件夹电脑、03机器人读书均未在现库找到合格成品，不再沿用01漏斗耳朵；缺素材以asset未完成交回。；main-closer：接asset-round3已发布本屏同主题专图，替换不存在的规格文件。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "真事："
    },
    {
     "type": "dialogue",
     "text_ref": "AI 第一版：",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "sides": [
      "left"
     ],
     "tail": true,
     "speaker_role": "ai"
    },
    {
     "type": "dialogue",
     "text_ref": "我：“234",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "sides": [
      "right"
     ],
     "tail": true,
     "speaker_role": "self"
    },
    {
     "type": "dialogue",
     "text_ref": "我：“你不需要核实",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "sides": [
      "right"
     ],
     "tail": true,
     "speaker_role": "self"
    },
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "AI 做了什么"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "flow_direction": "vertical",
     "items_layout": {
      "count": 3,
      "card": "open",
      "path": "thin_vertical"
     },
     "text_ref": "1认出",
     "direction": "vertical"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "结果",
     "icons": "none"
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "top_inside",
     "asset": "_library/illustrations/文件夹电脑专图.png"
    }
   ],
   "notes": "横版标题左、真实的一次胶囊右；下部左约2/3为AI一白气泡、本人两绿气泡、三步细竖线节点、结果卡，右约1/3文件夹电脑整幅插画；竖版同序，电脑卡最后。AI 做了什么不是毛笔章节标题，按小节标题。保持本人两句原话与引号，不添选项或取舍。 本轮三步改接flow的direction=vertical，执行原规格已要求的纵向丝带；原三步文字完整保留。；本轮审查修复：本屏专属插画显式绑定到待补文件，02文件夹电脑、03机器人读书均未在现库找到合格成品，不再沿用01漏斗耳朵；缺素材以asset未完成交回。；main-closer：接asset-round3已发布本屏同主题专图，替换不存在的规格文件。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "source_phrase": "认出“听不懂”和“你只需要告诉我”：上一版答偏了，回到我原来的问题——这东西对我有什么用。",
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
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹链接",
   "source_phrase": "先自己查清再开口：DriveUpload 是谷歌云盘电脑版留下的上传临时文件夹，里面的链接早就没用了。",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "把教训写回手册：这类取舍用真实的文件夹、数量和日常说法讲影响；选项编号跨轮不重复；我说“最优解即可”是让 AI 去选，不等于我已经听懂。",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/scene-r3-skill-explain-to-me-02-asset-46546576.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-skill-explain-to-me-02-asset-46546576",
   "source_phrase": "一个电脑文件夹图标，文件夹下面一个空白小标签和一个灰色小叉",
   "sha256": "572df22fd7e084c6d2468bb8b5529486d6ceb5e349f56de66fa553756553caa5",
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

## 一个完整例子

真事：9 月 25 日，一个 Claude 对话在请我定一批收尾的事（出处：讲给我听的讲解手册案例记录）

AI 第一版：列了 7 个待我定的事，其中一件是让我选一个叫 DriveUpload 的文件夹“复制还是链接”，它自己还没查清这是什么。

我：“234听不懂；要求说人话”
我：“你不需要核实谁移动的，你只需要告诉我，有什么意义”

**AI 做了什么**
1. 认出“听不懂”和“你只需要告诉我”：上一版答偏了，回到我原来的问题——这东西对我有什么用。
2. 先自己查清再开口：DriveUpload 是谷歌云盘电脑版留下的上传临时文件夹，里面的链接早就没用了。
3. 把教训写回手册：这类取舍用真实的文件夹、数量和日常说法讲影响；选项编号跨轮不重复；我说“最优解即可”是让 AI 去选，不等于我已经听懂。

**结果**
查清之后一句话就说明白了：那是早就没用的临时文件夹。这一次进了手册第 2、4、6 条原则的案例：之后哪个 AI 请我定文件去留，都要先讲清它是什么、有什么用。

::screen{#skill-explain-to-me-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-explain-to-me-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，三条短句一行一条，每条前一个小水彩图标（一个循环小箭头、一把被划掉的尺子、一个问号气泡）。",
  "portrait": "竖版：横幅在上，按钮单独一行；三条规矩一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/personal-expression/#features"
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
     "size": "medium",
     "text_ref": "能做的事",
     "row": "band",
     "width": "25%",
     "frame": "functions-banner"
    },
    {
     "type": "notice",
     "row": "band",
     "width": "73%",
     "inline_links_as_buttons": true,
     "text_ref": "这个技能能做的事",
     "inline_button": true,
     "tone": "green",
     "frame": "functions-banner"
    },
    {
     "type": "comparison",
     "row": "rules",
     "width": "58%",
     "columns": 1,
     "illustration": "left_inside",
     "text_ref": "用这个技能时",
     "layout": "item_rows",
     "item_cards": true,
     "image_mode": "item",
     "groups": [
      {
       "text_ref": "用这个技能时"
      }
     ],
     "item_icons": [
      "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
      "_library/icons/尺子.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"
     ],
     "connector": "none"
    },
    {
     "type": "illustration",
     "row": "rules",
     "width": "40%",
     "index": 0,
     "illustration": "right_inside",
     "asset": "_library/illustrations/机器人读书专图.png"
    }
   ],
   "notes": "原图有整幅机器人读书补充插画：横版在规矩卡右侧、竖版在规矩卡底部；scene未提但构图以原图为准保留。上部标题+功能说明+去看全部功能按钮合为浅绿横幅，竖版按钮另行。链接在定稿段内，要求组件支持段内链接按钮化，不能另加一遍文字。 本轮说明段接notice.inline_button，将原段尾链接提升为按钮且只出现一次；标题和说明共享外横幅仍需容器接口。 本轮主程序新增frame接口后，标题与说明已共用functions-banner外卡；最终外观仍待样张审页。；本轮审查修复：本屏专属插画显式绑定到待补文件，02文件夹电脑、03机器人读书均未在现库找到合格成品，不再沿用01漏斗耳朵；缺素材以asset未完成交回。；二轮质量关修复：旧content_card.items_layout未执行的三枚逐条图标改接comparison/item_rows，明确箭头、尺子、问号气泡图标，保留规矩卡组头与三条原文各一次。；main-closer：接asset-round3已发布本屏同主题专图，替换不存在的规格文件。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "能做的事",
     "frame": "functions-banner"
    },
    {
     "type": "notice",
     "inline_links_as_buttons": true,
     "button_separate_line": true,
     "text_ref": "这个技能能做的事",
     "inline_button": true,
     "tone": "green",
     "frame": "functions-banner"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "用这个技能时",
     "layout": "item_rows",
     "item_cards": true,
     "image_mode": "item",
     "groups": [
      {
       "text_ref": "用这个技能时"
      }
     ],
     "item_icons": [
      "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
      "_library/icons/尺子.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png"
     ],
     "connector": "none"
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "bottom_inside",
     "asset": "_library/illustrations/机器人读书专图.png"
    }
   ],
   "notes": "原图有整幅机器人读书补充插画：横版在规矩卡右侧、竖版在规矩卡底部；scene未提但构图以原图为准保留。上部标题+功能说明+去看全部功能按钮合为浅绿横幅，竖版按钮另行。链接在定稿段内，要求组件支持段内链接按钮化，不能另加一遍文字。 本轮说明段接notice.inline_button，将原段尾链接提升为按钮且只出现一次；标题和说明共享外横幅仍需容器接口。 本轮主程序新增frame接口后，标题与说明已共用functions-banner外卡；最终外观仍待样张审页。；本轮审查修复：本屏专属插画显式绑定到待补文件，02文件夹电脑、03机器人读书均未在现库找到合格成品，不再沿用01漏斗耳朵；缺素材以asset未完成交回。；二轮质量关修复：旧content_card.items_layout未执行的三枚逐条图标改接comparison/item_rows，明确箭头、尺子、问号气泡图标，保留规矩卡组头与三条原文各一次。；main-closer：接asset-round3已发布本屏同主题专图，替换不存在的规格文件。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个循环小箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "source_phrase": "一把被划掉的尺子",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "问号气泡",
   "source_phrase": "一个问号气泡",
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
   "asset": "_library/illustrations/机器人读书专图.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "机器人读书专图",
   "source_phrase": "横版：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，三条短句一行一条，每条前一个小水彩图标（一个循环小箭头、一把被划掉的尺子、一个问号气泡）。",
   "sha256": "949552ca177a232ed3b44c1317063063492f68efc7701bcfbc62ea1a57e4816f",
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

这个技能能做的事，就是个人表达项目里“讲给我听”和“记住纠正”两组功能。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 同一件事里读过手册、上下文也够，就直接用，不为每次回答再查一遍，也不另开一个模型改写。
- 没有固定的字数和顺序，也不是非举例不可；目标是我一遍能懂。
- 我到底喜欢哪种讲法拿不准时，问我一个具体问题，或者先不定。

::screen{#skill-explain-to-me-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-explain-to-me-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的名字画成链接；表格下面一张卡片“不做”，三条短句。每块左上一个小水彩图标（一只打钩的耳朵、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写这些事，下面写找谁）；“不做”三条放最后。",
  "links": [
   {
    "text": "替我拟消息",
    "href": "/skills/reply-as-me/"
   },
   {
    "text": "个人理解库",
    "href": "/skills/daily-preferences/"
   },
   {
    "text": "个人正式文书",
    "href": "/skills/personal-formal-documents/",
    "locator_text": {
     "h": "个人正式文书按文书规范写；向我解释文书时才用这里",
     "v": "个人正式文书按文书规范写；向我解释文书时才用这里"
    }
   },
   {
    "text": "汇报网页",
    "href": "/skills/report-page/",
    "locator_text": {
     "h": "汇报网页；它的写法来自这本手册",
     "v": "汇报网页；它的写法来自这本手册"
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
     "text_ref": "边界",
     "row": "head",
     "width": "31%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "head",
     "width": "67%",
     "index": 0,
     "illustration": "outside",
     "size": "small",
     "asset": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-assets\\skill-explain-to-me\\skill-explain-to-me-04-icon-01.png"
    },
    {
     "type": "content_card",
     "row": "limits",
     "width": "31%",
     "columns": 1,
     "illustration": "top_inside",
     "text_ref": "管",
     "icons": "none"
    },
    {
     "type": "table",
     "row": "limits",
     "width": "67%",
     "columns": 2,
     "illustration": "none",
     "table_header": true,
     "portrait_mode": "row_cards",
     "items_layout": {
      "rows": 5
     },
     "text_ref": "不管，交给谁"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "不做",
     "icons": "none"
    }
   ],
   "notes": "标题旁有指路牌大插画，保留原图标题左、插画右（不属整屏宽居中情形）。横版左1/3管卡，右2/3两列表格，下方不做整宽卡；竖版管卡、五张表格行卡、最后不做卡。表头重复只能 data-echo，每条正文和链接保留一次。 图中指路牌从本屏已裁 icon 明确指定到标题右侧，不能让 auto 把指路牌错配给管卡；管/不做耳朵与禁止图标缺素材，待补。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "size": "banner",
     "asset": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-assets\\skill-explain-to-me\\skill-explain-to-me-04-icon-01.png",
     "align": "center"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "管",
     "icons": "none"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "portrait_mode": "row_cards",
     "items_layout": {
      "rows": 5,
      "echo_headers": true
     },
     "text_ref": "不管，交给谁"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "不做",
     "icons": "none"
    }
   ],
   "notes": "标题旁有指路牌大插画，保留原图标题左、插画右（不属整屏宽居中情形）。横版左1/3管卡，右2/3两列表格，下方不做整宽卡；竖版管卡、五张表格行卡、最后不做卡。表头重复只能 data-echo，每条正文和链接保留一次。 图中指路牌从本屏已裁 icon 明确指定到标题右侧，不能让 auto 把指路牌错配给管卡；管/不做耳朵与禁止图标缺素材，待补。；本轮审查修复：手机标题整行居中，指路牌改独立居中横带，避免和标题并排被压成小污点。",
   "verification_basis": "2026-10-03 文字核对：screens.jsonl、定稿scene/portrait及上一批规格；本轮未查看原图。"
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
   "source_phrase": "一只打钩的耳朵",
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
   "asset": "_library/round3/titles/title-r3-7a7e13ca96796233d6be.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-explain-to-me\\img\\skill-explain-to-me-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7a7e13ca96796233d6be",
   "title_text": "边界",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready",
   "source_box": [
    42,
    66,
    282,
    266
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 边界

**管**
AI 向我汇报、解释、请我拍板时怎么讲；我说难懂、太绕、答偏了时，重讲并把教训记进手册。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 替我给别人写消息 | 〔替我拟消息〕 |
| 我的背景、经历和偏好 | 〔个人理解库〕 |
| 专业判断和具体办法 | 当前处理这件事的 AI 和对应的项目 |
| 合同、协议、通知这类正式文书的正文 | 〔个人正式文书〕按文书规范写；向我解释文书时才用这里 |
| 汇报网页长什么样 | 〔汇报网页〕；它的写法来自这本手册 |

**不做**
- 不模仿我给别人发消息的口吻。
- 不替当前的事拿主意，也不替别的项目改结论。
- 不把 AI 自己的猜测写成我的偏好。
