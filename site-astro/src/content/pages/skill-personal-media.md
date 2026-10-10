---
{
 "title": "找照片和录音",
 "kind": "skill",
 "url": "/skills/personal-media/",
 "tagline": "说个大概，找出照片视频原件或录音里那句话。",
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
  "page": "skill-personal-media",
  "kind": "skill",
  "title": "找照片和录音",
  "url": "/skills/personal-media/",
  "tagline": "说个大概，找出照片视频原件或录音里那句话。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-07 02:29"
   },
   "facts": [
    "近 7 天 AI 用了 4 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "8672545a3cfe240a330a211f8ea57b8a624910e9",
   "commit_time": "2026-09-25T21:43:03-05:00",
   "file": "E:\\.agents\\skills\\personal-media\\SKILL.md"
  },
  "video_prompt": "",
  "registry": {
   "relations": [
    {
     "id": "r-project",
     "with": "personal-media",
     "direction": "拿来",
     "flow": "查的是照片视频录音管理的媒体记录（SQLite + FTS5），原件位置以记录里的原件路径为准",
     "source": "E:\\.agents\\skills\\personal-media\\SKILL.md 第 8 行"
    },
    {
     "id": "r-asr",
     "with": "chinese-asr",
     "direction": "拿来",
     "flow": "找录音里的某句话时读中文语音转写已有的带时间结果；没有时经同意用本机 Paraformer 补这一段",
     "source": "SKILL.md 的 Locate a recording passage 节"
    },
    {
     "id": "r-person-self",
     "with": "media-person-self",
     "direction": "交出",
     "flow": "选定的照片或录音要判断有没有本人时，交给“照片录音里有没有我”",
     "source": "SKILL.md 的 Identity and content follow-up 节"
    },
    {
     "id": "r-materials",
     "with": "personal-materials",
     "direction": "分工",
     "flow": "非媒体文件归找文件原件技能",
     "source": "SKILL.md 最后一段"
    },
    {
     "id": "r-report-page",
     "with": "report-page",
     "direction": "拿来",
     "flow": "要本人定去留时，用审批页（汇报网页技能画）摆出实物",
     "source": "SKILL.md 的 When the owner must decide keep or exit 节"
    }
   ],
   "mentions": [
    {
     "target": "/projects/personal-media/#features",
     "screen": "skill-personal-media-03",
     "text": "项目页的全部功能"
    },
    {
     "target": "/projects/personal-media/",
     "screen": "skill-personal-media-04",
     "text": "照片视频录音管理"
    },
    {
     "target": "/skills/media-person-self/",
     "screen": "skill-personal-media-04",
     "text": "照片录音里有没有我"
    },
    {
     "target": "/skills/personal-materials/",
     "screen": "skill-personal-media-04",
     "text": "找文件原件"
    }
   ]
  },
  "notes": {
   "merged": [
    "技能源文件里的“审批页”（review-page、owner-decide）是项目功能，家在项目页 f-review-page，这里不另列。"
   ],
   "dropped": [
    "SKILL.md 里 --include-private 用于理解本人时的几种场景举例不上网站（涉及不公开的事），只写“你说包括私密的才找”。"
   ],
   "unsure": [
    "说法和例子是假设的（本人：例子可以是假设）；原先的地点、日期和张数取自一次真实查询；10 月 10 日按主持决定改成不点名的通用说法（示例不用真实地点、日期和张数）。",
    "找文件原件技能页的网址按 /skills/personal-materials/ 写，要和负责那页的写稿人对齐技能页名。",
    "页名沿用旧网站和项目页第 7 屏的“找照片和录音”；技能自己的显示名是“个人媒体检索”（agents\\openai.yaml），两者不一样。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-personal-media/page.json",
  "sha256": "5b21dde262b4c29e3a93077e0ffccc5acd365f0fa3d50237bb335314d89726d5",
  "converted_at_beijing": "2026-10-10T10:58:17+08:00"
 }
}
---

::screen{#skill-personal-media-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-personal-media-01",
  "section": "top",
  "title": "找照片和录音",
  "scene": "横版：左边大标题毛笔艺术字“找照片和录音”，下面一行说明；右边一幅水彩插画：一台电脑屏幕上一排照片缩略图和一条录音波形，一只放大镜照着其中一张，旁边一个小对话气泡。下半部一排五个白底圆角对话气泡，每个气泡里一句跟 AI 说的话，气泡左上一个小人头像图标；气泡上方一行小标题“这样说就行”。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和说明在上，插画缩到整宽放在下面，五个对话气泡一行一个上下排。字和横版完全一样。",
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
     "text_ref": "找照片和录音",
     "align": "left",
     "size": "large",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 7 日 02:29",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 4 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "illustration",
     "row": "k1a-head",
     "align": "right",
     "width": "auto"
    },
    {
     "type": "prose",
     "text_ref": "说个大概"
    },
    {
     "type": "section_heading",
     "text_ref": "这样说就行",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“找那次下雪",
     "columns": 3,
     "columns_v": 5,
     "split_items": true,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "row_counts": [
      3,
      2
     ]
    }
   ],
   "notes": "横版左标题说明、右独立显示器放大镜插画；下面组名和五张等宽气泡一排，每张左侧头像，文字在右气泡。竖版标题居中、说明、整宽插画、组名、五张左头像右气泡依次整宽。无连接箭头和丝带。引号完全照定稿，原图省略引号不沿用。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；2026-10-03 本轮按审查第3项：横版介绍行左60%右40%，压低右侧插画占比，文字原字与顺序不变。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。",
   "dependencies": [
    "五句话同属一个bullets节点，dialogue需split_items逐条气泡+头像；现组件只会同一气泡内列表，split_items尚未支持。",
    "5个头像不是当前清单抽取的icon资产，需补足无字头像位。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-01-review.png"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "找照片和录音",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 7 日 02:29",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 4 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "说个大概"
    },
    {
     "type": "illustration"
    },
    {
     "type": "section_heading",
     "text_ref": "这样说就行",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“找那次下雪",
     "columns": 1,
     "split_items": true,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "横版左标题说明、右独立显示器放大镜插画；下面组名和五张等宽气泡一排，每张左侧头像，文字在右气泡。竖版标题居中、说明、整宽插画、组名、五张左头像右气泡依次整宽。无连接箭头和丝带。引号完全照定稿，原图省略引号不沿用。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。",
   "dependencies": [
    "五句话同属一个bullets节点，dialogue需split_items逐条气泡+头像；现组件只会同一气泡内列表，split_items尚未支持。",
    "5个头像不是当前清单抽取的icon资产，需补足无字头像位。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-01-review.png"
   }
  }
 },
 "images": [
  {
   "role": "avatar",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“找 1 月下雪那天在洞山公园拍的照片。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“找我毕业那天拍的照片。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“有段录音里说过‘周五前交表’，在第几分钟？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“把这些放进一个文件夹给我翻翻，看完帮我清掉。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“找以前拍的检查报告，包括私密的。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“找 1 月下雪那天在洞山公园拍的照片。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“找我毕业那天拍的照片。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“有段录音里说过‘周五前交表’，在第几分钟？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“把这些放进一个文件夹给我翻翻，看完帮我清掉。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 10,
   "orientations": [
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "“找以前拍的检查报告，包括私密的。”",
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
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-media",
   "source_phrase": "横版：左边大标题毛笔艺术字“找照片和录音”，下面一行说明；右边一幅水彩插画：一台电脑屏幕上一排照片缩略图和一条录音波形，一只放大镜照着其中一张，旁边一个小对话气泡。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "一台电脑屏幕上一排照片缩略图和一条录音波形，一只放大镜照着其中一张，旁边一个小对话气泡"
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
   "asset": "skill-personal-media/skill-personal-media-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-media\\img\\skill-personal-media-01-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4e6127dc90b95b817e10",
   "title_text": "找照片和录音",
   "sha256": "8f204868b4bdb0924c673ebe380142fd531ec71ed5baa6eea4820be35ae66293",
   "status": "ready",
   "source_box": [
    42,
    17,
    812,
    241
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 找照片和录音

说个大概，它在已登记的照片、视频、录音里找出原件，告诉你文件在哪；录音还能找到某句话在第几分第几秒。

**这样说就行**

- “找那次下雪去公园拍的照片。”
- “找我毕业那天拍的照片。”
- “有段录音里说过‘周五前交表’，在第几分钟？”
- “把这些放进一个文件夹给我翻翻，看完帮我清掉。”
- “找以前拍的检查报告，包括私密的。”

::screen{#skill-personal-media-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-personal-media-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "横版：左上标题“一个完整的例子”。下面左右两栏：左栏是一段对话（左边“我”的气泡，右边“AI”的回答卡片，回答卡片里有一个小小的结果列表，每行一个小照片图标加日期和路径的字）；右栏是一条竖向的四步小流程，每步一个圆圈编号和一句话，说明 AI 背后做了什么，步与步之间绿色箭头。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；对话在上（气泡和回答卡片上下排），四步流程在下，一步一行。字和横版完全一样。",
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
     "text_ref": "一个完整的例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：找那次下雪",
     "columns": 1,
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "AI：（几秒）先给 8 张",
     "columns": 1,
     "sides": [
      "right"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "我：要全部",
     "columns": 1,
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "AI：一共一百多张",
     "columns": 1,
     "sides": [
      "right"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "它背后做了什么",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "把我的话拆成条件",
     "columns": 1,
     "columns_v": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文稿堆.png",
      "_library/icons/文件夹链接.png",
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "原图横版左54%是一张对话组框，四次我/AI对话分别成气泡，头像在我左侧、机器人在AI右侧；右46%为组框内小节标题和四张左图右文卡，圆编号在各卡左上，三支向下绿箭头卡间连接。竖版标题居中，上方对话组框、下方同样向下四步。照片日期与原件路径小结果清单不在定稿，不新增那些可读字；仅允许无字照片装饰，不生成假数据。标题原图横版靠左，本次全屏按追加要求居中。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。",
   "dependencies": [
    "dialogue四块文字能精确定位，但组框、左右头像需支持。",
    "流程需要4个小插画，当前本屏未抽取icon；flow应只分steps，不能从组名开始以免头部被排到步骤后。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-02-review.png"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整的例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：找那次下雪",
     "columns": 1,
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "AI：（几秒）先给 8 张",
     "columns": 1,
     "sides": [
      "right"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "我：要全部",
     "columns": 1,
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "AI：一共一百多张",
     "columns": 1,
     "sides": [
      "right"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "它背后做了什么",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "把我的话拆成条件",
     "columns": 1,
     "columns_v": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文稿堆.png",
      "_library/icons/文件夹链接.png",
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "原图横版左54%是一张对话组框，四次我/AI对话分别成气泡，头像在我左侧、机器人在AI右侧；右46%为组框内小节标题和四张左图右文卡，圆编号在各卡左上，三支向下绿箭头卡间连接。竖版标题居中，上方对话组框、下方同样向下四步。照片日期与原件路径小结果清单不在定稿，不新增那些可读字；仅允许无字照片装饰，不生成假数据。标题原图横版靠左，本次全屏按追加要求居中。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。",
   "dependencies": [
    "dialogue四块文字能精确定位，但组框、左右头像需支持。",
    "流程需要4个小插画，当前本屏未抽取icon；flow应只分steps，不能从组名开始以免头部被排到步骤后。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-02-review.png"
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "key": "日历",
   "source_phrase": "把我的话拆成条件：地点“洞山公园”（我确认过的现场地点）、日期 1 月 21 日、只要照片；不自己加猜的条件。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "在媒体记录里查，先取 8 张；每张先确认原件还在硬盘上，再拿给我。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "key": "文件夹链接",
   "source_phrase": "我要文件夹，就在同一块盘上建一个临时文件夹，用硬链接放进去，不多占空间、不复制原件。",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "我说看完了，只清掉这一个文件夹，原件不动。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "key": "日历",
   "source_phrase": "把我的话拆成条件：地点“洞山公园”（我确认过的现场地点）、日期 1 月 21 日、只要照片；不自己加猜的条件。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "在媒体记录里查，先取 8 张；每张先确认原件还在硬盘上，再拿给我。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "key": "文件夹链接",
   "source_phrase": "我要文件夹，就在同一块盘上建一个临时文件夹，用硬链接放进去，不多占空间、不复制原件。",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "我说看完了，只清掉这一个文件夹，原件不动。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
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

**我：**找那次下雪去公园拍的照片。

**AI：**（几秒）先给 8 张，至少这么多：都是下雪那天在那个公园拍的，每张附原件在硬盘上的位置。要全部吗？

**我：**要全部，放进一个文件夹给我翻。

**AI：**一共一百多张，大多在“生活与回忆”，几张在“精选”，都放进临时文件夹了，看完告诉我清掉。

**它背后做了什么**

1. 把我的话拆成条件：地点是那个公园（我确认过的现场地点）、日期是下雪那天、只要照片；不自己加猜的条件。
2. 在媒体记录里查，先取 8 张；每张先确认原件还在硬盘上，再拿给我。
3. 我要文件夹，就在同一块盘上建一个临时文件夹，用硬链接放进去，不多占空间、不复制原件。
4. 我说看完了，只清掉这一个文件夹，原件不动。

::screen{#skill-personal-media-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-personal-media-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题“能做的事”，下面一句带链接的话单独一行、字稍大。再下面是一张小对照表“你说的 → 它查的”，四行，左列是人话，右列是它换成的查询条件；表格右边一幅小插画：一个漏斗，上面几句话落进去，下面出来几张照片和一条录音波形。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；那句链接的话；对照表改成四张小卡片，每张上面“你说的”、下面“它查的”；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "项目页的全部功能",
    "href": "/projects/personal-media/#features"
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
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "68%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "text_ref": "它是照片视频录音管理",
     "row": "hero"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "32%",
     "align": "center",
     "target_width": 378,
     "target_height": 140
    },
    {
     "type": "table",
     "text_ref": "你说的 → 它怎么查",
     "columns": 2,
     "columns_v": 2,
     "variant": "table"
    }
   ],
   "notes": "横版左63%上方章节标题和带链接说明，下面浅绿外框内组名和2列表格4行；右37%独立漏斗插画，整幅与左文字+表对齐。竖图章节标题居中，说明为左头像右气泡，组名在下；四张行卡纵排，每卡左边你说的/例句+图，中间箭头，右边它查的/机器人+条件，两个字段保留左右关系；漏斗插画在四卡下方。table只分真实table节点；重复表头需data-echo，不能自行加冒号。漏斗采用无字气泡，不额外重复原图上4句文字。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；2026-10-03 本轮按审查第2项：横版左栏75%右图25%；table 不另加 width，保留同 row 无 width 合入左栏的真实父布局，避免创建第三栏。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。",
   "dependencies": [
    "竖版paired_rows不等于现table的上下字段卡，需左右字段+中心箭头+左右插画行卡，variant/row_cards_columns是待接入意图。",
    "仅1幅无字漏斗素材存在，竖卡所需人像/机器人与四主题小图未抽取。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-03-review.png"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "illustration",
     "size": "large",
     "align": "center",
     "target_width": "100%"
    },
    {
     "type": "dialogue",
     "text_ref": "它是照片视频录音管理",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "你说的 → 它怎么查",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "你说的",
     "columns": 2,
     "columns_v": 2,
     "variant": "paired_rows",
     "row_cards_columns": 1,
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "横版左63%上方章节标题和带链接说明，下面浅绿外框内组名和2列表格4行；右37%独立漏斗插画，整幅与左文字+表对齐。竖图章节标题居中，说明为左头像右气泡，组名在下；四张行卡纵排，每卡左边你说的/例句+图，中间箭头，右边它查的/机器人+条件，两个字段保留左右关系；漏斗插画在四卡下方。table只分真实table节点；重复表头需data-echo，不能自行加冒号。漏斗采用无字气泡，不额外重复原图上4句文字。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；2026-10-03 本轮按审查第2项：竖版漏斗插画移到章节标题后整宽独立展示；后续说明、组名、四行表格保持原序，图不嵌入表格。",
   "dependencies": [
    "竖版paired_rows不等于现table的上下字段卡，需左右字段+中心箭头+左右插画行卡，variant/row_cards_columns是待接入意图。",
    "仅1幅无字漏斗素材存在，竖卡所需人像/机器人与四主题小图未抽取。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-03-review.png"
   }
  }
 },
 "images": [
  {
   "role": "avatar",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "key": "本人通用头像",
   "source_phrase": "它是照片视频录音管理的查找入口，能做的事见项目页的全部功能。",
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
   "asset": "_library/illustrations/ill-82e7c8289b7209.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-82e7c8289b7209",
   "source_phrase": "再下面是一张小对照表“你说的 → 它查的”，四行，左列是人话，右列是它换成的查询条件；表格右边一幅小插画：一个漏斗，上面几句话落进去，下面出来几张照片和一条录音波形。",
   "sha256": "92f5a00e81d0ccb9ad639057731b3c87048d60d68e919cadf4209a2718515d3b",
   "status": "ready",
   "original_elements": [
    "一个漏斗，上面几句话落进去，下面出来几张照片和一条录音波形"
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
   "asset": "skill-personal-media/skill-personal-media-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-media\\img\\skill-personal-media-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "0eca472ffd5c3869cf38ff7bf4c6df1873d836d768164ec9c8e2a5e2c829a4e8",
   "status": "ready",
   "source_box": [
    40,
    65,
    636,
    254
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 能做的事

它是照片视频录音管理的查找入口，能做的事见〔项目页的全部功能〕。

**你说的 → 它怎么查**

| 你说的 | 它查的 |
|---|---|
| “在那个公园拍的” | 照片自带 GPS 登记的地点；地点没登记就直说，不改成按字搜 |
| “写着‘毕业典礼’的” | 画面里认出的字、描述、录音转成的文字，只挑 1–4 个关键词 |
| “上个月”“只要视频” | 日期范围、照片或视频或录音，你说了才加 |
| “那句话在第几分钟” | 先选定那段录音，再读它已有的带时间的转写 |

::screen{#skill-personal-media-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-personal-media-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题“边界”。下面两栏卡片：左栏绿色小勾标题“它管的”，四条；右栏灰色小叉标题“它不管的”，六条；每条一行或两行，左边一个小图标。右下角一小幅水彩插画：一个书架上贴着“照片”“录音”标签的盒子。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；“它管的”一栏在上，“它不管的”一栏在下，每条一行；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "照片视频录音管理",
    "href": "/projects/personal-media/"
   },
   {
    "text": "照片录音里有没有我",
    "href": "/skills/media-person-self/"
   },
   {
    "text": "找文件原件",
    "href": "/skills/personal-materials/"
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
     "type": "comparison",
     "text_ref": "它管的",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "row": "limits",
     "width": "47%",
     "item_cards": true,
     "illustration": "left_inside",
     "group_markers": [
      "check"
     ],
     "item_icons": [
      "_library/icons/波形照片.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
      "_library/icons/版本循环文件.png"
     ],
     "image_mode": "item",
     "source_prose": true,
     "align_items": "start"
    },
    {
     "type": "illustration",
     "size": "small",
     "align": "center",
     "row": "limits",
     "target_width": 235,
     "target_height": 210
    },
    {
     "type": "comparison",
     "text_ref": "它不管的",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "row": "limits",
     "width": "53%",
     "item_cards": true,
     "illustration": "left_inside",
     "group_markers": [
      "cross"
     ],
     "item_icons": [
      "_library/icons/波形照片.png",
      "_library/icons/波形照片.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/icons/文稿堆.png"
     ],
     "image_mode": "item",
     "source_prose": true,
     "align_items": "start"
    }
   ],
   "notes": "横版左47%它管的外框，组头绿勾，内含4张左图右文卡；右53%它不管的外框，组头灰叉，内含6张更密的左图右文卡。书架插画独立在右下，贴近右卡底角但不遮字。竖版两组先4条后6条上下排，书架在最底右侧。所有链接完整保留定稿词，原图额外↗不新增。原图书架照片/录音标签不另生成字。标题整屏按追加要求居中；组头灰只给叉圆点，文字统一深绿。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；本轮已改为现有 comparison 的逐条内行与勾叉接口；条目语义图标未绑定，继续列未完成。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；2026-10-03 本轮：使用真实 comparison.item_cards/image_mode:item/illustration:left_inside/group_markers/item_icons 实现原逐条白内卡、左图和组头勾叉，移除重复旧别名；不取消构图要求。；按审查第4项：横版书架置于两组之后居中，使用 core 真正消费的 target_width:25%，不写无 row 时不生效的 width。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。",
   "dependencies": [
    "content_card需bullets每条内卡、逐条小图和组头勾叉支持，现只会一张组卡里列普通清单。",
    "目前只抽取4/10图标，书架与边界标题未抽取合格素材；小插画右贴定位placement尚未支持。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-04-review.png"
   }
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
     "type": "comparison",
     "text_ref": "它管的",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "item_cards": true,
     "illustration": "left_inside",
     "group_markers": [
      "check"
     ],
     "item_icons": [
      "_library/icons/波形照片.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
      "_library/icons/版本循环文件.png"
     ],
     "image_mode": "item"
    },
    {
     "type": "comparison",
     "text_ref": "它不管的",
     "columns": 1,
     "columns_v": 1,
     "icons": "auto",
     "item_cards": true,
     "illustration": "left_inside",
     "group_markers": [
      "cross"
     ],
     "item_icons": [
      "_library/icons/波形照片.png",
      "_library/icons/波形照片.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/icons/文稿堆.png"
     ],
     "image_mode": "item"
    },
    {
     "type": "illustration",
     "size": "small",
     "align": "right"
    }
   ],
   "notes": "横版左47%它管的外框，组头绿勾，内含4张左图右文卡；右53%它不管的外框，组头灰叉，内含6张更密的左图右文卡。书架插画独立在右下，贴近右卡底角但不遮字。竖版两组先4条后6条上下排，书架在最底右侧。所有链接完整保留定稿词，原图额外↗不新增。原图书架照片/录音标签不另生成字。标题整屏按追加要求居中；组头灰只给叉圆点，文字统一深绿。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。；本轮已改为现有 comparison 的逐条内行与勾叉接口；条目语义图标未绑定，继续列未完成。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；2026-10-03 本轮：使用真实 comparison.item_cards/image_mode:item/illustration:left_inside/group_markers/item_icons 实现原逐条白内卡、左图和组头勾叉，移除重复旧别名；不取消构图要求。",
   "dependencies": [
    "content_card需bullets每条内卡、逐条小图和组头勾叉支持，现只会一张组卡里列普通清单。",
    "目前只抽取4/10图标，书架与边界标题未抽取合格素材；小插画右贴定位placement尚未支持。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-personal-media-04-review.png"
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
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "在已登记的照片、视频、录音里找原件，给出文件在硬盘上的位置。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
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
   "source_phrase": "结果数正好等于要的张数时，说“至少这么多”，不说“全部”。",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "找不到时说明用了哪些条件、是不是日期不确定、私密的或地点没登记挡住了，不去扫整块硬盘。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "私密的默认不出现；你说“包括私密的”，或 AI 更新对你的理解、私密的会改变结论时才带上，只拿出需要的那几件。",
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
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "不改、不删、不上传，也不连手机：整理和删除归〔照片视频录音管理〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "不按人找：照片里有没有我，用〔照片录音里有没有我〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "不找文档、合同这类非媒体文件：归〔找文件原件〕。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "录音没有带时间的转写时，只说缺什么；你同意了，才在本机补这一段的时间，不上传录音。",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "视频里的某句话在第几分钟，它找不了。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "不另建索引、不复制原件进别的库。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "在已登记的照片、视频、录音里找原件，给出文件在硬盘上的位置。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "结果数正好等于要的张数时，说“至少这么多”，不说“全部”。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "key": "问号气泡",
   "source_phrase": "找不到时说明用了哪些条件、是不是日期不确定、私密的或地点没登记挡住了，不去扫整块硬盘。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "key": "版本循环文件",
   "source_phrase": "私密的默认不出现；你说“包括私密的”，或 AI 更新对你的理解、私密的会改变结论时才带上，只拿出需要的那几件。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "不改、不删、不上传，也不连手机：整理和删除归〔照片视频录音管理〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "不按人找：照片里有没有我，用〔照片录音里有没有我〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "key": "文件夹放大镜",
   "source_phrase": "不找文档、合同这类非媒体文件：归〔找文件原件〕。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 18,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "key": "文件夹上传",
   "source_phrase": "录音没有带时间的转写时，只说缺什么；你同意了，才在本机补这一段的时间，不上传录音。",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 19,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "key": "时钟",
   "source_phrase": "视频里的某句话在第几分钟，它找不了。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 20,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "不另建索引、不复制原件进别的库。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 21,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "在已登记的照片、视频、录音里找原件，给出文件在硬盘上的位置。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 22,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "结果数正好等于要的张数时，说“至少这么多”，不说“全部”。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 23,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "key": "问号气泡",
   "source_phrase": "找不到时说明用了哪些条件、是不是日期不确定、私密的或地点没登记挡住了，不去扫整块硬盘。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 24,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "key": "版本循环文件",
   "source_phrase": "私密的默认不出现；你说“包括私密的”，或 AI 更新对你的理解、私密的会改变结论时才带上，只拿出需要的那几件。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 25,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "不改、不删、不上传，也不连手机：整理和删除归〔照片视频录音管理〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 26,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "不按人找：照片里有没有我，用〔照片录音里有没有我〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 27,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "key": "文件夹放大镜",
   "source_phrase": "不找文档、合同这类非媒体文件：归〔找文件原件〕。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 28,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "key": "文件夹上传",
   "source_phrase": "录音没有带时间的转写时，只说缺什么；你同意了，才在本机补这一段的时间，不上传录音。",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 29,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "key": "时钟",
   "source_phrase": "视频里的某句话在第几分钟，它找不了。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 30,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "不另建索引、不复制原件进别的库。",
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
   "source_phrase": "右下角一小幅水彩插画：一个书架上贴着“照片”“录音”标签的盒子。",
   "sha256": "61d407568e0f51a69ee50eb21b68d0d0d2b7b9c130c66133ed524db22ba3efe7",
   "status": "ready",
   "original_elements": [
    "一个书架上画抽象短线的抽象图形标签的盒子"
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

- 在已登记的照片、视频、录音里找原件，给出文件在硬盘上的位置。
- 结果数正好等于要的张数时，说“至少这么多”，不说“全部”。
- 找不到时说明用了哪些条件、是不是日期不确定、私密的或地点没登记挡住了，不去扫整块硬盘。
- 私密的默认不出现；你说“包括私密的”，或 AI 更新对你的理解、私密的会改变结论时才带上，只拿出需要的那几件。

**它不管的**

- 不改、不删、不上传，也不连手机：整理和删除归〔照片视频录音管理〕。
- 不按人找：照片里有没有我，用〔照片录音里有没有我〕。
- 不找文档、合同这类非媒体文件：归〔找文件原件〕。
- 录音没有带时间的转写时，只说缺什么；你同意了，才在本机补这一段的时间，不上传录音。
- 视频里的某句话在第几分钟，它找不了。
- 不另建索引、不复制原件进别的库。
