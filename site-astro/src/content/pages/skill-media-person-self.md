---
{
 "title": "照片录音里有没有我",
 "kind": "skill",
 "url": "/skills/media-person-self/",
 "tagline": "看指定的照片或录音里有没有我，不认别人。",
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
  "page": "skill-media-person-self",
  "kind": "skill",
  "title": "照片录音里有没有我",
  "url": "/skills/media-person-self/",
  "tagline": "看指定的照片或录音里有没有我，不认别人。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-09-29 03:04"
   },
   "facts": [
    "近 7 天没用过"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "f76f9a4e010366035636cefe098b9720e3b66a92",
   "commit_time": "2026-08-30T14:49:08-07:00",
   "file": "E:\\.agents\\skills\\media-person-self\\SKILL.md"
  },
  "video_prompt": "",
  "registry": {
   "relations": [
    {
     "id": "r-personal-media",
     "with": "personal-media",
     "direction": "拿来",
     "flow": "要判断的照片、录音通常先由找照片和录音挑出来，只交选中的几件",
     "source": "E:\\.agents\\skills\\media-person-self\\SKILL.md 第 13–17 行"
    },
    {
     "id": "r-chinese-asr",
     "with": "chinese-asr",
     "direction": "拿来",
     "flow": "录音和视频的声音判断整段交给中文语音转写：Paraformer 句子时间、CAM++ 匿名分簇、本人声音样本比对（阈值 0.31）",
     "source": "E:\\.agents\\skills\\chinese-asr\\references\\speaker-attribution.md；E:\\Projects\\Tools\\ChineseASR\\configs\\models.yaml speaker_verification"
    }
   ],
   "mentions": [
    {
     "target": "/projects/chinese-asr/",
     "screen": "skill-media-person-self-02",
     "text": "中文语音转写"
    },
    {
     "target": "/skills/personal-media/",
     "screen": "skill-media-person-self-04",
     "text": "找照片和录音"
    },
    {
     "target": "/projects/localocr/",
     "screen": "skill-media-person-self-04",
     "text": "本地文字识别"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "模板和声音样本在本机的具体路径不上网站（按公开范围可以写，但对读者没用）。"
   ],
   "unsure": [
    "页名改成“照片录音里有没有我”（旧稿叫“照片里有没有我”，但这个技能也管录音和视频）。",
    "第 2 屏“一例”来自资料解锁后按技能跑的一次（7 张同一相册照片：6 张判为我、1 张没检出脸）；页上不写相册名和日期。以前用过几次没查。",
    "声纹阈值 0.31、CAM++ 模型出自 ChineseASR 的 configs\\models.yaml，属于中文语音转写的家，本页只写到“CAM++ 声纹”，不写阈值。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-media-person-self/page.json",
  "sha256": "de7a644ef36cf6abe865be5534528667aa7a2ac738484cc2ae99897abff5ef01",
  "converted_at_beijing": "2026-10-10T08:43:30+08:00"
 }
}
---

::screen{#skill-media-person-self-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-media-person-self-01",
  "section": "top",
  "title": "照片录音里有没有我",
  "scene": "横版：左边大标题毛笔艺术字“照片录音里有没有我”，下面两行说明；右边一幅水彩插画：一张合影照片上一张脸被绿色细框框住，旁边一条录音波形，其中一段标成绿色。下半部一排四个白底圆角对话气泡，上方小标题“这样说就行”。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和说明在上；插画缩到整宽；四个气泡一行一个。字和横版完全一样。",
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
     "text_ref": "照片录音里有没有我",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 9 月 29 日 03:04",
       "state": "ok"
      },
      {
       "text": "近 7 天没用过",
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
     "text_ref": "指定一张照片",
     "width": "47%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "53%",
     "index": 0,
     "illustration": "outside"
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
     "split_items": true,
     "illustration": "bottom_inside",
     "icons": "auto",
     "text_ref": "“这张照片里有我吗？”",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "已查看原横图。标题和介绍占左半，合影、声波及麦克风在右上卡片外。下部四张等宽气泡卡一排；文字气泡在各卡上部，照片/照片组/手机波形/视频插画在下部。无卡间连线。bottom_inside 与 split_items 表达原图要求，现组件接口尚未实现，待组件样张；不可把四条清单合成一个气泡。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "照片录音里有没有我"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 9 月 29 日 03:04",
       "state": "ok"
      },
      {
       "text": "近 7 天没用过",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "指定一张照片"
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "bleed": true
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
     "split_items": true,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "“这张照片里有我吗？”",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "已查看原竖图，单张。整宽大标题居中；介绍在插画前，和批准样板 agents-01-v 的先图后文不同，应照本屏。主插画整宽位于卡外。四张气泡横卡自上而下，左插画右气泡；气泡尾巴朝左。无连接。split_items 与各卡插画待组件接入和样张。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
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
   "source_phrase": "“这张照片里有我吗？”",
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
   "source_phrase": "“这 5 张里哪几张有我？”",
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
   "source_phrase": "“这段通话录音里，哪几句是我说的？”",
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
   "source_phrase": "“这个视频里说话的是不是我？”",
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
   "asset": "_library/illustrations/手机照片通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "手机照片通用构图",
   "source_phrase": "横版：左边大标题毛笔艺术字“照片录音里有没有我”，下面两行说明；右边一幅水彩插画：一张合影照片上一张脸被绿色细框框住，旁边一条录音波形，其中一段标成绿色。",
   "sha256": "753312b6e6ed1ff47c67a989c96803d31f85ce2566a2b45440dfb21a9af85169",
   "status": "ready",
   "original_elements": [
    "一张合影照片上一张脸被绿色细框框住，旁边一条录音波形，其中一段标成绿色"
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
   "asset": "skill-media-person-self/skill-media-person-self-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-media-person-self\\img\\skill-media-person-self-01-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-cc709d5c86101ecee93a",
   "title_text": "照片录音里有没有我",
   "sha256": "d483a5dcad75da069e848da42e9cabfdfcb82b3bb0e9f7b77a14977cc405db48",
   "status": "ready",
   "source_box": [
    50,
    16,
    865,
    179
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 照片录音里有没有我

指定一张照片、几张照片、一段录音或一个视频，它判断里面有没有我：照片里指出是哪张脸，录音里逐句标出哪几句是我说的。只回答“有没有我”，不认别人是谁。

**这样说就行**

- “这张照片里有我吗？”
- “这 5 张里哪几张有我？”
- “这段通话录音里，哪几句是我说的？”
- “这个视频里说话的是不是我？”

::screen{#skill-media-person-self-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-media-person-self-02",
  "section": "examples",
  "title": "怎么判断",
  "scene": "横版：左上标题“怎么判断”。下面左右两栏，各是一条从上到下的三步小流程，每步一个圆圈编号、粗体小标题和一两行小字，步与步之间绿色箭头：左栏顶上一个照片图标和小标题“照片”，右栏顶上一个麦克风图标和小标题“录音和视频”。最下面横跨两条细长圆角卡片：上面一条是“一例”（左边一个小雪景相册图标），下面一条放最后那句话。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；“照片”三步在上，“录音和视频”三步在下；最下面那条。字和横版完全一样。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/",
    "locator_text": {
     "h": "没有就交给中文语音转写",
     "v": "没有就交给中文语音转写"
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
     "align": "center",
     "size": "large",
     "text_ref": "怎么判断"
    },
    {
     "type": "section_heading",
     "row": "methods",
     "width": "49%",
     "align": "left",
     "text_ref": "照片"
    },
    {
     "type": "flow",
     "row": "methods",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "text_ref": "找脸：",
     "enclosure": "single_card",
     "open_nodes": true
    },
    {
     "type": "section_heading",
     "row": "methods",
     "width": "51%",
     "align": "left",
     "text_ref": "录音和视频"
    },
    {
     "type": "flow",
     "row": "methods",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "text_ref": "先看有没有现成的：",
     "enclosure": "single_card",
     "open_nodes": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/snow-album-icon.png"
     ],
     "text_ref": "一例（真事"
    },
    {
     "type": "notice",
     "align": "center",
     "text_ref": "“没检出我”不等于"
    }
   ],
   "notes": "已查看原横图。按统一标准整屏大标题居中；下方照片左栏、录音和视频右栏各一张外框大卡，内部均为纵向三步，左侧圆编号和向下箭头，正文在右；每步不是另画一个封闭卡。照片组头旁左置照片组图；右组头上麦克风/胶片/波形图从大卡顶边探出。两栏下方先整宽一例卡，再整宽结论提示条。当前 flow 缺整组三步的大卡外框与组头插画，需组件/主工程师接入；illustration:none 仅表示步骤自身无插画，组头插画不得省略。 本轮 qa12a：照片与录音视频组头统一左对齐。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "怎么判断"
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "照片"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "connector": "arrow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": "auto",
     "text_ref": "找脸：",
     "enclosure": "single_card",
     "open_nodes": true
    },
    {
     "type": "section_heading",
     "align": "left",
     "text_ref": "录音和视频"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "connector": "arrow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "right_inside",
     "icons": "auto",
     "text_ref": "先看有没有现成的：",
     "enclosure": "single_card",
     "open_nodes": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/snow-album-icon.png"
     ],
     "text_ref": "一例（真事"
    },
    {
     "type": "notice",
     "align": "center",
     "text_ref": "“没检出我”不等于"
    }
   ],
   "notes": "已查看原竖图，单张。标题左、相册与手机主插画右并排；照片大卡在上，录音视频大卡在下。各大卡左侧三步圆编号向下箭头，步骤文字在中，对应照片比对/录音结果插画在右侧卡内。一例卡左相册右文字；结论条在最下。right_inside 表达原图，不允许退成所有图在左；现组件不支持且真实组头与六步插画资产不足，待样张。 本轮 qa12a：按审页移除复用首屏合照的独立主插画；标题改整宽居中，流程/六功能卡直接接在标题之后。保留各条已有图位，语义图标缺口另交素材，不更改定稿。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
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
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "找脸：本机用 YuNet 找出照片里每一张脸。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/人脸比对.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "人脸比对",
   "source_phrase": "横版：左上标题“怎么判断”。下面左右两栏，各是一条从上到下的三步小流程，每步一个圆圈编号、粗体小标题和一两行小字，步与步之间绿色箭头：左栏顶上一个照片图标和小标题“照片”，右栏顶上一个麦克风图标和小标题“录音和视频”。最下面横跨两条细长圆角卡片：上面一条是“一例”（左边一个小雪景相册图标），下面一条放最后那句话。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "sha256": "db8e1104077244a09831ca1c3146f1a0c0535090ee87225a7fe33c86b137e692",
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
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "问号气泡",
   "source_phrase": "给结论：有我（指出第几张脸、框在哪）／没检出我／判断不了（没脸、太小、太糊）。",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "先看有没有现成的：这段录音以前查过、结果还有效，就直接用。",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/波形.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "波形",
   "source_phrase": "没有就交给〔中文语音转写〕：本机 Paraformer 分出带时间的句子，每个说话人挑一两句清楚的，用 CAM++ 声纹和我的声音样本比，再结合声道、通话里谁是谁、说了什么。",
   "sha256": "31f0f14bae9218df618102a98136ddafd52cb593a5474a0425248c78e85a9f14",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "问号气泡",
   "source_phrase": "逐句给结论：每句标成我、别人或判断不了；没比过声音的句子靠上下文判，判不了就标判断不了；视频只听声音，不看画面。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/手机照片通用构图.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "手机照片通用构图",
   "source_phrase": "横版：左上标题“怎么判断”。下面左右两栏，各是一条从上到下的三步小流程，每步一个圆圈编号、粗体小标题和一两行小字，步与步之间绿色箭头：左栏顶上一个照片图标和小标题“照片”，右栏顶上一个麦克风图标和小标题“录音和视频”。最下面横跨两条细长圆角卡片：上面一条是“一例”（左边一个小雪景相册图标），下面一条放最后那句话。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "sha256": "753312b6e6ed1ff47c67a989c96803d31f85ce2566a2b45440dfb21a9af85169",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-bdc2a6c905c0aca904ca.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-media-person-self\\img\\skill-media-person-self-02-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-bdc2a6c905c0aca904ca",
   "title_text": "怎么判断",
   "sha256": "5c6579dd04b812d51696a0f1189df47ecc0ab80587b5db32e91621bd2998675f",
   "status": "ready",
   "source_box": [
    10,
    0,
    473,
    204
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 怎么判断

**照片**

1. **找脸：**本机用 YuNet 找出照片里每一张脸。
2. **比一比：**用 SFace 把每张脸和我的人脸模板比，门槛是官方给的固定值 0.363，不按这张图调。
3. **给结论：**有我（指出第几张脸、框在哪）／没检出我／判断不了（没脸、太小、太糊）。

**录音和视频**

1. **先看有没有现成的：**这段录音以前查过、结果还有效，就直接用。
2. **没有就交给〔中文语音转写〕：**本机 Paraformer 分出带时间的句子，每个说话人挑一两句清楚的，用 CAM++ 声纹和我的声音样本比，再结合声道、通话里谁是谁、说了什么。
3. **逐句给结论：**每句标成我、别人或判断不了；没比过声音的句子靠上下文判，判不了就标判断不了；视频只听声音，不看画面。

**一例（真事，9 月底写这页时按技能实跑的）：**拿同一次出游的 7 张照片试，6 张各检出 1 张脸，都判为我；1 张没检出能比的脸，结论是判断不了。

“没检出我”不等于“一定没有我”；结果随时可以推翻。

::screen{#skill-media-person-self-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-media-person-self-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题“能做的事”。下面六张同样大小的圆角小卡片，两行三列，每张左边一个小水彩图标，粗体一句，下面一行小字。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；六张卡片一行一张。字和横版完全一样。",
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
     "text_ref": "能做的事"
    },
    {
     "type": "content_card",
     "columns": 3,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "照片里指出哪张脸是我"
    }
   ],
   "notes": "已查看原横图。大标题左上、照片手机笔记本录音机的大幅水彩在右上卡外。六张等宽功能卡两行三列，逐行顺序 1–3、4–6；每张上部左图右粗体标题，下部整宽一行说明，不加定稿没有的状态文字。无连接。需六张语义对应小图标及主插画；当前 manifest 只有一张第二项图标，不能配给第一项。 本轮 qa12a：按审页移除复用首屏合照的独立主插画；标题改整宽居中，流程/六功能卡直接接在标题之后。保留各条已有图位，语义图标缺口另交素材，不更改定稿。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
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
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "照片里指出哪张脸是我"
    }
   ],
   "notes": "已查看原竖图，单张。标题左、主插画右并排，非整宽标题。六张横卡按定稿顺序单列；左图右标题及说明，图约卡宽三分之一。无连接。图标与主插画不足须补素材；不因缺图改成全页无图。 本轮 qa12a：按审页移除复用首屏合照的独立主插画；标题改整宽居中，流程/六功能卡直接接在标题之后。保留各条已有图位，语义图标缺口另交素材，不更改定稿。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
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
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "照片里指出哪张脸是我｜给出脸的编号和框的位置",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "一次查一小批照片｜一次最多 20 张，要一张张点名",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "录音逐句分出我和别人｜每句标我、别人或判断不了，带时间",
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
   "asset": "_library/illustrations/波形.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "波形",
   "source_phrase": "视频只听声音｜一次一个，只看音轨里有没有我在说话",
   "sha256": "31f0f14bae9218df618102a98136ddafd52cb593a5474a0425248c78e85a9f14",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "问号气泡",
   "source_phrase": "看不清就说判断不了｜没脸、太小、太糊、太短、太吵，都不硬判",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "查过的不重跑｜同一段录音已有有效结果，直接复用",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/手机照片通用构图.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "手机照片通用构图",
   "source_phrase": "横版：左上标题“能做的事”。下面六张同样大小的圆角小卡片，两行三列，每张左边一个小水彩图标，粗体一句，下面一行小字。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "sha256": "753312b6e6ed1ff47c67a989c96803d31f85ce2566a2b45440dfb21a9af85169",
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-media-person-self\\img\\skill-media-person-self-03-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready",
   "source_box": [
    26,
    50,
    588,
    338
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 能做的事

- **照片里指出哪张脸是我**｜给出脸的编号和框的位置
- **一次查一小批照片**｜一次最多 20 张，要一张张点名
- **录音逐句分出我和别人**｜每句标我、别人或判断不了，带时间
- **视频只听声音**｜一次一个，只看音轨里有没有我在说话
- **看不清就说判断不了**｜没脸、太小、太糊、太短、太吵，都不硬判
- **查过的不重跑**｜同一段录音已有有效结果，直接复用

::screen{#skill-media-person-self-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-media-person-self-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题“边界”。下面两栏卡片：左栏绿色小勾标题“它管的”，三条；右栏灰色小叉标题“它不管的”，六条；每条左边一个小图标。右下角一小幅水彩插画：一把小锁挂在一张人脸轮廓卡片上。风格照照片视频录音管理页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；“它管的”在上，“它不管的”在下，每条一行；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "找照片和录音",
    "href": "/skills/personal-media/"
   },
   {
    "text": "本地文字识别",
    "href": "/projects/localocr/"
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
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "它管的"
      }
     ],
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "它管的",
     "item_icons": [
      "_library/icons/波形照片.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "align_items": "start",
     "row": "limits",
     "width": "48%",
     "source_prose": true,
     "image_mode": "item",
     "item_cards": true
    },
    {
     "type": "illustration",
     "row": "limits",
     "index": 0,
     "illustration": "outside",
     "align": "center",
     "target_height": 230,
     "target_width": 246
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "它不管的"
      }
     ],
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "它不管的",
     "item_icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/波形照片.png",
      "_library/icons/麦克风.png",
      "_library/icons/文稿堆.png",
      "_library/icons/身份盾牌.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png"
     ],
     "align_items": "start",
     "row": "limits",
     "width": "52%",
     "source_prose": true,
     "image_mode": "item",
     "item_cards": true
    }
   ],
   "notes": "已查看原横图。左大标题，右上照片/手机/录音机整幅插画在卡外。下部两张大卡等宽，左组3条、右组6条，各条白色内行左图右文字，组头各带勾/叉图形。沿统一标准两侧正文均深蓝灰、标题深绿，状态色只用于符号；不沿原图灰黑大标题与整栏改字色。人脸卡小锁插画从右栏右下边探出，不在组内上方。当前 comparison 仅组级一图，逐条图与外置小锁定位待组件/主工程师。 本轮 qa12a：移除末尾孤立带残框的小锁人脸裁片；横版标题/主插画改60/40并限制插画高260px，降低左空白。左右比较卡按内容收高需组件 align-start 接口，已另提请求。\nQA12压小图复核后微调：原标点一并提升卡头、续张编号沿用卡外左侧、长按钮手机单列、边界标题栏居中，均用现有接口，不删原字。；blank-audit末组实际看图修复：仅本横屏按原图自然比例限装饰图、独立原文纵链自然高度/整宽长卡；每句定稿与素材保留，竖版不改。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
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
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "它管的"
      },
      {
       "text_ref": "它不管的"
      }
     ],
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "它管的",
     "item_icons": [
      "_library/icons/波形照片.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/波形照片.png",
      "_library/icons/麦克风.png",
      "_library/icons/文稿堆.png",
      "_library/icons/身份盾牌.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png"
     ]
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "bleed": true
    }
   ],
   "notes": "已查看原竖图，单张。整宽大标题居中；它管的3条大卡在上、它不管的6条大卡在下，内部各行左图右文字。底部主插画在卡外整宽，小锁人脸在右下相邻探出，应组成同一底部画面；现主插画被 manifest 错认成竖图右上小插画，需正确资产。comparison 逐条白色内行和各行图标待组件样张。 本轮 qa12a：移除末尾孤立带残框的小锁人脸裁片；横版标题/主插画改60/40并限制插画高260px，降低左空白。左右比较卡按内容收高需组件 align-start 接口，已另提请求。",
   "verification_notes": "本轮 qa12a 依据当前审页原文、规格、素材记录和 report 数值修改；没有查看图片，旧 notes 中“已查看原图”仅指上轮记录。最终构图与素材干净程度仍须审页员视觉核对。"
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
   "source_phrase": "只回答“这张照片、这段录音里有没有我”。",
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
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "照片和声音分开判断：可能出现了没说话，也可能说了话没入镜，不合成一个结论。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
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
   "source_phrase": "我的人脸模板和声音样本只在本机，只有一份；删掉或换掉，以后的判断就跟着变，旧结果不再作数。",
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
   "source_phrase": "不认别人是谁，也不数一共有几个人。",
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
   "source_phrase": "不扫相册、文件夹：先用〔找照片和录音〕挑出几件，再交给它。",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "不从要判断的那段录音里学我的声音。",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "不读照片上的字（那是〔本地文字识别〕的事）。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "身份盾牌",
   "source_phrase": "结果只是本机的推断，不当身份证明用。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "不把模板、声纹、比对分数传出去或写进别的库。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "只回答“这张照片、这段录音里有没有我”。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "key": "照片堆",
   "source_phrase": "照片和声音分开判断：可能出现了没说话，也可能说了话没入镜，不合成一个结论。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
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
   "source_phrase": "我的人脸模板和声音样本只在本机，只有一份；删掉或换掉，以后的判断就跟着变，旧结果不再作数。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "不认别人是谁，也不数一共有几个人。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "不扫相册、文件夹：先用〔找照片和录音〕挑出几件，再交给它。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "key": "麦克风",
   "source_phrase": "不从要判断的那段录音里学我的声音。",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "不读照片上的字（那是〔本地文字识别〕的事）。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "key": "身份盾牌",
   "source_phrase": "结果只是本机的推断，不当身份证明用。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 18,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "不把模板、声纹、比对分数传出去或写进别的库。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 19,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "只回答“这张照片、这段录音里有没有我”。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 20,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "key": "照片堆",
   "source_phrase": "照片和声音分开判断：可能出现了没说话，也可能说了话没入镜，不合成一个结论。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 21,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "我的人脸模板和声音样本只在本机，只有一份；删掉或换掉，以后的判断就跟着变，旧结果不再作数。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
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
   "source_phrase": "不认别人是谁，也不数一共有几个人。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 23,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "key": "波形照片",
   "source_phrase": "不扫相册、文件夹：先用〔找照片和录音〕挑出几件，再交给它。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 24,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "key": "麦克风",
   "source_phrase": "不从要判断的那段录音里学我的声音。",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 25,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "不读照片上的字（那是〔本地文字识别〕的事）。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 26,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/身份盾牌.png",
   "fallback": false,
   "key": "身份盾牌",
   "source_phrase": "结果只是本机的推断，不当身份证明用。",
   "sha256": "b790d221cc6a4f38c4b7fc2dd839a84c7b54faecd903de73bcd5d02b76939897",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 27,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "不把模板、声纹、比对分数传出去或写进别的库。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/人脸卡挂锁.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "人脸卡挂锁",
   "source_phrase": "右下角一小幅水彩插画：一把小锁挂在一张人脸轮廓卡片上。",
   "sha256": "427737a88fea1ea2d691255a3bde21982799b31cbb4c87ff4b24e0000d0759b4",
   "status": "ready",
   "original_elements": [
    "一把小锁挂在一张人脸轮廓卡片上"
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

- 只回答“这张照片、这段录音里有没有我”。
- 照片和声音分开判断：可能出现了没说话，也可能说了话没入镜，不合成一个结论。
- 我的人脸模板和声音样本只在本机，只有一份；删掉或换掉，以后的判断就跟着变，旧结果不再作数。

**它不管的**

- 不认别人是谁，也不数一共有几个人。
- 不扫相册、文件夹：先用〔找照片和录音〕挑出几件，再交给它。
- 不从要判断的那段录音里学我的声音。
- 不读照片上的字（那是〔本地文字识别〕的事）。
- 结果只是本机的推断，不当身份证明用。
- 不把模板、声纹、比对分数传出去或写进别的库。
