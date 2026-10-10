---
{
 "title": "本地文字识别",
 "kind": "skill",
 "url": "/skills/localocr/",
 "tagline": "要逐字准确、成批或只在本机时，交给本地识字。",
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
  "page": "skill-localocr",
  "kind": "skill",
  "title": "本地文字识别",
  "url": "/skills/localocr/",
  "tagline": "要逐字准确、成批或只在本机时，交给本地识字。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-08 10:13"
   },
   "facts": [
    "近 7 天 AI 用了 4 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/LocalOCR",
  "capability": "",
  "based_on": {
   "file": "E:\\.agents\\skills\\localocr\\SKILL.md",
   "rules_release": "E187",
   "project_commit": "d47d48822760918ee4895750ba8cfa851be7af32"
  },
  "video_prompt": "5 秒无缝循环，白底水彩：对话气泡旁的路口，一张截图从气泡里飘出，在路牌前停一下，然后沿通向放大镜的小路滑向本机显卡；另一张风景照片沿通向眼睛的小路滑走。镜头不动，没有文字。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-features-link",
     "text": "六组共 28 项",
     "meaning": "项目页 registry.features 条数和组数",
     "as_of": "2026-09-28",
     "source": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\localocr\\page.json",
     "screens": [
      "skill-localocr-04"
     ]
    },
    {
     "id": "n-example-pages",
     "text": "16 页只重读第 15 页",
     "meaning": "9 月 26 日 17:09 一份 16 页 PDF 的 escalated_page_indices=[14]",
     "as_of": "2026-09-28",
     "source": "LocalOCR 任务登记（见 localocr/facts.md 第三节）",
     "screens": [
      "skill-localocr-02"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-project",
     "with": "localocr",
     "direction": "入口",
     "flow": "技能是本地文字识别项目给 AI 的入口：AI 读技能决定何时调用 ocr_smart.ps1",
     "source": "E:\\.agents\\skills\\localocr\\SKILL.md“Normal entry”"
    },
    {
     "id": "r-file-intake",
     "with": "当时的 AI（按文件类型选读法）",
     "direction": "被调用",
     "flow": "一堆杂文件里，当时的 AI 把扫描件和要逐字的图片交给本技能",
     "source": "E:\\.agents\\skills\\localocr\\SKILL.md 第 8–17 行（提交 99e1da5）；file-intake-router 10 月 2 日退役"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/projects/localocr/",
     "screen": "skill-localocr-01",
     "text": "本地文字识别项目页"
    },
    {
     "target": "/projects/localocr/#features",
     "screen": "skill-localocr-04",
     "text": "看全部功能"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能源文件里的运行细节（HTTP 错误码、期限参数、缓存字段、端口 18666 不能当备用）：给 AI 的操作说明，读者不关心；机制在项目页讲。",
    "旧技能稿 content/skills.json 名字叫“图片识字”，本页改用项目的对外名“本地文字识别”，与项目页一致。"
   ],
   "unsure": [
    "第 2 屏 AI 的回复是示意措辞（事实：9 月 26 日那份 16 页扫描件确实只重读了第 15 页；那份材料有没有表格、我当时原话怎么说，本轮没读内容，不知道）。图上已写“AI 的回复措辞是示意”。如果本人觉得示意例子不合适，可以换成项目自带的合成采购单例子。",
    "第 1 屏五句“可以这样说”是替本人口吻写的，上线前请本人过目。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-localocr/page.json",
  "sha256": "1a43b19b43358cc669cbb755aa15e1d9b6e1af08cbf88ddea0657ab14a01f999",
  "converted_at_beijing": "2026-10-10T09:06:30+08:00"
 }
}
---

::screen{#skill-localocr-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-localocr-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：AI 的对话气泡旁边分出两条小路，一条通向一只眼睛（AI 自己看），一条通向本机显卡上的放大镜（本地文字识别），路口立一块小路牌。下半部分五个浅绿底对话气泡，两列排开，每个气泡里一句引号里的话。最下面一行小字带一个链接。",
  "portrait": "竖版：标题、副标题、说明；插画占满宽；五个气泡一行一个；链接小字在最下面。",
  "links": [
   {
    "text": "本地文字识别项目页",
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
     "text_ref": "本地文字识别",
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
       "text": "偶尔用 · 上次使用 10 月 8 日 10:13",
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
     "type": "prose",
     "text_ref": "要逐字准确",
     "row": "intro",
     "width": "49%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "intro",
     "width": "51%",
     "target_width": "80%",
     "align": "right"
    },
    {
     "type": "section_heading",
     "text_ref": "可以这样说",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“把这几张截图",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "row": "quotes-1",
     "width": "50%",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“这份扫描件",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "row": "quotes-1",
     "width": "50%",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“这一文件夹",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "row": "quotes-2",
     "width": "50%",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“描述一下这张照片",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "row": "quotes-2",
     "width": "50%",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“识别完把显卡",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "row": "quotes-3",
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "prose",
     "text_ref": "它背后的项目",
     "align": "left",
     "size": "small"
    }
   ],
   "notes": "原图横版顶部为左侧大标题、副标题和介绍，右侧独立分岔路插画；五个示例带左图标、右气泡，横版两列三排，最后一张只占左半。竖版先标题/副标题/介绍，再整宽插画、五张逐行示例、末尾链接。无流程丝带；分岔虚线箭头属于无字主插画。链接只保留定稿链接词，原图额外↗不新增。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10第4条：首屏右图在原栏内缩至80%并靠右，降低首排高度，让示例紧接简介。",
   "dependencies": [
    "五个para节点可分为五个dialogue块，但现有dialogue缺左侧小插画/头像位；5个示例图标未提供。",
    "横版末行单张50%宽需实现，当前row只有单块会直接整宽。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-01-review.png"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "本地文字识别",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 8 日 10:13",
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
     "text_ref": "要逐字准确"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "section_heading",
     "text_ref": "可以这样说",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“把这几张截图",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“这份扫描件",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“这一文件夹",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“描述一下这张照片",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "dialogue",
     "text_ref": "“识别完把显卡",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "sides": [
      "left"
     ],
     "avatars": [
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "outside-left"
    },
    {
     "type": "prose",
     "text_ref": "它背后的项目",
     "align": "left",
     "size": "small"
    }
   ],
   "notes": "原图横版顶部为左侧大标题、副标题和介绍，右侧独立分岔路插画；五个示例带左图标、右气泡，横版两列三排，最后一张只占左半。竖版先标题/副标题/介绍，再整宽插画、五张逐行示例、末尾链接。无流程丝带；分岔虚线箭头属于无字主插画。链接只保留定稿链接词，原图额外↗不新增。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。",
   "dependencies": [
    "五个para节点可分为五个dialogue块，但现有dialogue缺左侧小插画/头像位；5个示例图标未提供。",
    "横版末行单张50%宽需实现，当前row只有单块会直接整宽。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-01-review.png"
   }
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
   "source_phrase": "“把这几张截图里的字读出来，要一字不差。”",
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
   "key": "本人通用头像",
   "source_phrase": "“这份扫描件转成文字，表格保留行和列。”",
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
   "key": "本人通用头像",
   "source_phrase": "“这一文件夹的课程截图全部识别一遍。”",
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
   "key": "本人通用头像",
   "source_phrase": "“描述一下这张照片，再把招牌上的字原样抄下来。”",
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
   "key": "本人通用头像",
   "source_phrase": "“识别完把显卡腾出来，我要跑别的。”",
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
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-localocr",
   "source_phrase": "右边一幅水彩插画：AI 的对话气泡旁边分出两条小路，一条通向一只眼睛（AI 自己看），一条通向本机显卡上的放大镜（本地文字识别），路口立一块小路牌。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "AI 的对话气泡旁边分出两条小路，一条通向一只眼睛（AI 自己看），一条通向本机显卡上的放大镜（本地文字识别），路口立一块小路牌"
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
   "asset": "localocr/localocr-01-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6077f34d4f3fa1ff31ba",
   "title_text": "本地文字识别",
   "sha256": "84b6833b60f41aa68e46393d7023d3a48e8487a764c7da9e071ad183b89d3bed",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 本地文字识别
**要逐字准确、成批处理或者只在本机时，AI 把图交给本地识字，而不是自己看。**

AI 自己能看图：一两张普通截图、只想知道大意或画面里有什么，它自己看就行。这个技能告诉 AI 什么时候该换成本机显卡上的文字识别：要一字不差、要读一大批、要表格坐标公式印章、字很小很淡，或者我要求图片不出电脑。两种都用时，AI 把两边结果分开摆给我，不拿一边悄悄盖掉另一边。

可以这样说：
“把这几张截图里的字读出来，要一字不差。”
“这份扫描件转成文字，表格保留行和列。”
“这一文件夹的课程截图全部识别一遍。”
“描述一下这张照片，再把招牌上的字原样抄下来。”
“识别完把显卡腾出来，我要跑别的。”

它背后的项目、用的模型和机制：〔本地文字识别项目页〕

::screen{#skill-localocr-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-localocr-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），AI 的回复分成几行；右边约 45% 宽一幅水彩插画：一叠 16 页的扫描讲义摊成扇形，第 15 页被抽出来放在望远镜下，旁边三个小文件图标（TXT、MD、JSON）。最下面一张横向浅灰卡片写“背后发生了什么”四步。",
  "portrait": "竖版：标题；对话气泡上下排；插画在对话下面；背后四步一行一条。",
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
     "size": "large",
     "row": "example-top",
     "width": "55%"
    },
    {
     "type": "tag",
     "text_ref": "示例：",
     "row": "example-top"
    },
    {
     "type": "dialogue",
     "text_ref": "我：“这份扫描讲义",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "right"
     ],
     "row": "example-top"
    },
    {
     "type": "dialogue",
     "text_ref": "AI：“16 页都读完了",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "left"
     ],
     "row": "example-top"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "example-top",
     "width": "45%"
    },
    {
     "type": "section_heading",
     "text_ref": "背后发生了什么",
     "align": "left",
     "size": "medium",
     "frame": "behind"
    },
    {
     "type": "bullet_list",
     "text_ref": "AI 看出这是扫描件",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "none",
     "icons": "none",
     "frame": "behind",
     "item_cards": false,
     "bare": true
    },
    {
     "type": "prose",
     "text_ref": "（9 月 26 日真有",
     "align": "left",
     "size": "small",
     "frame": "behind"
    }
   ],
   "notes": "横版参考采用pages-approved通过的candidate-2；标题和两气泡在左55%栏、讲义放大镜插画在右45%栏。下方一张满宽灰蓝浅卡，组名、四条圆编号紧凑纵排和示意说明同卡；没有箭头/丝带。竖图旧标题不是毛笔，按标准改为同浓度毛笔并居中；对话后整宽插画，再组名和四张左图右文横条，说明在卡外页尾。插画中的TXT/MD/JSON标签未另分配定稿节点，不新增这些字。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10质量关修复：横版四条编号改用现有bullet_list，和小节标题/尾注共享frame=behind单外框；竖版item_cards逐条左图卡，原编号/文字完整。",
   "dependencies": [
    "横版编号条目需单外框紧凑列表，现numbered_steps是四张独立卡；container_id/variant仅表达构图意图，主程序未支持。",
    "第2屏标题与独立插画均未抽取；竖版四个步骤图标缺失。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-02-review.png"
   }
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
     "text_ref": "我：“这份扫描讲义",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "right"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "AI：“16 页都读完了",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "left"
     ]
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "section_heading",
     "text_ref": "背后发生了什么",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "bullet_list",
     "text_ref": "AI 看出这是扫描件",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-abb681c78df7ffa17f9a.png",
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ],
     "item_cards": true,
     "bare": true
    },
    {
     "type": "prose",
     "text_ref": "（9 月 26 日真有",
     "align": "left",
     "size": "small"
    }
   ],
   "notes": "横版参考采用pages-approved通过的candidate-2；标题和两气泡在左55%栏、讲义放大镜插画在右45%栏。下方一张满宽灰蓝浅卡，组名、四条圆编号紧凑纵排和示意说明同卡；没有箭头/丝带。竖图旧标题不是毛笔，按标准改为同浓度毛笔并居中；对话后整宽插画，再组名和四张左图右文横条，说明在卡外页尾。插画中的TXT/MD/JSON标签未另分配定稿节点，不新增这些字。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10质量关修复：横版四条编号改用现有bullet_list，和小节标题/尾注共享frame=behind单外框；竖版item_cards逐条左图卡，原编号/文字完整。",
   "dependencies": [
    "横版编号条目需单外框紧凑列表，现numbered_steps是四张独立卡；container_id/variant仅表达构图意图，主程序未支持。",
    "第2屏标题与独立插画均未抽取；竖版四个步骤图标缺失。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-02-review.png"
   }
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "AI 看出这是扫描件、要逐字，不自己看图，交给本地文字识别，走自动路线。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "它先给原件留一份只读副本，等显卡空出来，再一页页快读。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "听诊器检查",
   "source_phrase": "逐页体检，只有第 15 页不过关，单独交给强模型；其余页保留快读结果。",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "双机器人",
   "source_phrase": "AI 读结果里每一页用的模型和客观结论，照实告诉我，不把“整份读完”说成“每个字都对”。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/识别纸张通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "识别纸张通用构图",
   "source_phrase": "左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色），AI 的回复分成几行；右边约 45% 宽一幅水彩插画：一叠 16 页的扫描讲义摊成扇形，第 15 页被抽出来放在望远镜下，旁边三个小文件图标（TXT、MD、JSON）。",
   "sha256": "f9df63d5f9169507df5d49cc657a281a8cf6f4a6c22bd301d70545b1e78f3991",
   "status": "ready",
   "original_elements": [
    "一叠 16 页的扫描讲义摊成扇形，第 15 页被抽出来放在望远镜下，旁边三个小文件图标（TXT、MD、JSON"
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

示例：照这个技能的做法写的，不是某一次的记录

我：“这份扫描讲义转成文字。”

AI：“16 页都读完了。第 1–14 页和第 16 页用快模型读，把握分都正常；第 15 页平均把握分 0.997，但查到了表格线，已换强模型重读。全文、带格式的版本和带坐标的数据各一份。第 15 页的表格建议你对照原图看一眼，把握分高不等于每格都对。”

**背后发生了什么**
1. AI 看出这是扫描件、要逐字，不自己看图，交给本地文字识别，走自动路线。
2. 它先给原件留一份只读副本，等显卡空出来，再一页页快读。
3. 逐页体检，只有第 15 页不过关，单独交给强模型；其余页保留快读结果。
4. AI 读结果里每一页用的模型和客观结论，照实告诉我，不把“整份读完”说成“每个字都对”。

（9 月 26 日真有这样一份 16 页扫描件：第 15 页平均把握分 0.997，因查到表格线只重读了这一页。AI 的回复措辞是示意。）

::screen{#skill-localocr-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-localocr-03",
  "section": "examples",
  "title": "又看画面又抄字",
  "scene": "横版：左上标题。中间一幅水彩插画：一张街景照片，店门上方一块招牌；照片左边伸出一只眼睛的图标，右边伸出放大镜的图标。下面并排两张卡片（左“AI 自己看到的”、右“本地文字识别读出的”），最下面一张横向浅黄便签写冲突时怎么办。",
  "portrait": "竖版：标题；插画；两张卡片上下排；便签在最下面。",
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
     "text_ref": "又看画面又抄字",
     "align": "left",
     "size": "large",
     "row": "mixed-top",
     "width": "65%"
    },
    {
     "type": "dialogue",
     "text_ref": "我：“描述一下这张照片",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "left"
     ],
     "row": "mixed-top"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "mixed-top",
     "width": "35%",
     "target_width": "100%",
     "align": "right"
    },
    {
     "type": "content_card",
     "text_ref": "AI 自己看到的",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/相机.png"
     ],
     "row": "results",
     "width": "50%"
    },
    {
     "type": "content_card",
     "text_ref": "本地文字识别读出的",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/放大镜.png"
     ],
     "row": "results",
     "width": "50%"
    },
    {
     "type": "notice",
     "text_ref": "AI 回我时分四块",
     "columns": 1,
     "columns_v": 1,
     "tone": "yellow",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "横版标题和我说的话占左上，街景照片、眼睛和放大镜插画独立占右上；下方两张50%卡并排，各为左插画/右标题正文，满宽浅黄提醒放最下面。竖版标题居中，其次我气泡、主插画、两张左图右文卡上下排、最下面浅黄提醒。眼睛和放大镜的虚线引箭头在插画中，文字卡之间没有丝带。提醒包括末句本机要求，不另遗漏。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10第1条：对话和插画同排，左文65%、右图35%，两张结果卡紧接首排。 qa-10第2条：两张结果卡明确绑定既有相机、放大镜图标，区分画面观察和逐字识别，不再取通用门图。",
   "dependencies": [
    "两张**名称**｜正文为para节点，已用两独立content_card块保证不并成一张；卡内标题需识别粗体名称并提为卡头。",
    "主插画及两卡/提醒左图缺合格素材；notice当前不支持左图，黄色底也待组件样张。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-03-review.png"
   }
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "又看画面又抄字",
     "align": "center",
     "size": "large"
    },
    {
     "type": "dialogue",
     "text_ref": "我：“描述一下这张照片",
     "columns": 1,
     "columns_v": 1,
     "sides": [
      "left"
     ]
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "content_card",
     "text_ref": "AI 自己看到的",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/相机.png"
     ]
    },
    {
     "type": "content_card",
     "text_ref": "本地文字识别读出的",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/放大镜.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "AI 回我时分四块",
     "columns": 1,
     "columns_v": 1,
     "tone": "yellow",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "横版标题和我说的话占左上，街景照片、眼睛和放大镜插画独立占右上；下方两张50%卡并排，各为左插画/右标题正文，满宽浅黄提醒放最下面。竖版标题居中，其次我气泡、主插画、两张左图右文卡上下排、最下面浅黄提醒。眼睛和放大镜的虚线引箭头在插画中，文字卡之间没有丝带。提醒包括末句本机要求，不另遗漏。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10第2条：两张结果卡明确绑定既有相机、放大镜图标，区分画面观察和逐字识别，不再取通用门图。",
   "dependencies": [
    "两张**名称**｜正文为para节点，已用两独立content_card块保证不并成一张；卡内标题需识别粗体名称并提为卡头。",
    "主插画及两卡/提醒左图缺合格素材；notice当前不支持左图，黄色底也待组件样张。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-03-review.png"
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
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "门",
   "source_phrase": "AI 自己看到的 画面：街边、店门、天气、人在做什么。它管“拍了什么”，不保证每个字都对。",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
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
   "source_phrase": "AI回我时分四块：画面、原字、识别状态、有疑问的地方。两边对同一个字说法不一样，就把原图那一块放大再看，不拿一边悄悄改掉另一边；AI自己看出的更正单独标明，不改识别的原始结果。\n我要求图片不出电脑时，AI不把图交给自己的视觉，只用本地识别。",
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
   "source_phrase": "AI回我时分四块：画面、原字、识别状态、有疑问的地方。两边对同一个字说法不一样，就把原图那一块放大再看，不拿一边悄悄改掉另一边；AI自己看出的更正单独标明，不改识别的原始结果。\n我要求图片不出电脑时，AI不把图交给自己的视觉，只用本地识别。",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/文稿核验宽构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文稿核验宽构图",
   "source_phrase": "中间一幅水彩插画：一张街景照片，店门上方一块招牌；照片左边伸出一只眼睛的图标，右边伸出放大镜的图标。",
   "sha256": "f81b524f5a7b0c318f72027080dcae982dfd16482b93718d8dad52de517849e9",
   "status": "ready",
   "original_elements": [
    "一张街景照片，店门上方一块招牌；照片左边伸出一只眼睛的图标，右边伸出放大镜的图标"
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
   "asset": "_library/titles/title-e07205a96e4bb967e9d6.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-localocr\\img\\skill-localocr-03-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e07205a96e4bb967e9d6",
   "title_text": "又看画面又抄字",
   "sha256": "e59bfa5efc552466c8fc31903a08f1d404298f0ce2e6796260f2ac23ca21adfe",
   "status": "ready",
   "source_box": [
    19,
    8,
    761,
    234
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 又看画面又抄字

我：“描述一下这张照片，再把招牌上的字原样抄下来。”

**AI 自己看到的**｜画面：街边、店门、天气、人在做什么。它管“拍了什么”，不保证每个字都对。
**本地文字识别读出的**｜招牌上的原字、每行字的位置和把握分。它管“写了什么”，不负责描述画面。

AI 回我时分四块：画面、原字、识别状态、有疑问的地方。两边对同一个字说法不一样，就把原图那一块放大再看，不拿一边悄悄改掉另一边；AI 自己看出的更正单独标明，不改识别的原始结果。
我要求图片不出电脑时，AI 不把图交给自己的视觉，只用本地识别。

::screen{#skill-localocr-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-localocr-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题，下面一张横向大卡片：左边一幅小水彩插画（一张功能清单，28 个小圆点），右边一句话和一个按钮样式的链接。留白处画几片水彩叶子，不加别的字。",
  "portrait": "竖版：标题；插画在上；一句话和链接在下。",
  "links": [
   {
    "text": "看全部功能",
    "href": "/projects/localocr/#features"
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
     "align": "center",
     "size": "large",
     "row": "balanced-heading",
     "width": "88%"
    },
    {
     "type": "illustration",
     "asset": "skill-localocr/skill-localocr-04-illustration-01.png",
     "align": "center",
     "target_width": "100%",
     "frame": "capability",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "notice",
     "text_ref": "读字、选模型",
     "whole_block": true,
     "variant": "source_note",
     "inline_button": "看全部功能",
     "button_placement": "below",
     "button_align": "left",
     "align": "left",
     "frame": "capability"
    }
   ],
   "notes": "原图是一张整宽大卡：横版左48%为28圆点清单插画，右侧完整说明、下方独立胶囊描边按钮；竖版同一卡内插画置顶，说明在下，按钮居中。卡右下/页边叶子仅装饰，不增加字。标题原图横版靠左，但本次整屏章节标题按本人追加要求居中，毛笔浓度保持。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10质量关修复：复用frame共同外卡+illustration/notice，横版48%左图52%右文、竖版上图下文；原看全部功能链接由现有inline_button变为原词按钮，手机居中。",
   "dependencies": [
    "content_card需让指定illustration素材按半卡宽显示，不能缩成小图标；illustration_width仅表达待接入意图。",
    "链接嵌在单para中，不能把看全部功能另写text_ref；link_style需仅把原有链接呈为卡内独立按钮且文字只出现一次。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-04-review.png"
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
     "asset": "skill-localocr/skill-localocr-04-illustration-01.png",
     "align": "center",
     "target_width": "100%",
     "frame": "capability"
    },
    {
     "type": "notice",
     "text_ref": "读字、选模型",
     "whole_block": true,
     "variant": "source_note",
     "inline_button": "看全部功能",
     "button_placement": "below",
     "button_align": "center",
     "align": "left",
     "frame": "capability"
    }
   ],
   "notes": "原图是一张整宽大卡：横版左48%为28圆点清单插画，右侧完整说明、下方独立胶囊描边按钮；竖版同一卡内插画置顶，说明在下，按钮居中。卡右下/页边叶子仅装饰，不增加字。标题原图横版靠左，但本次整屏章节标题按本人追加要求居中，毛笔浓度保持。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10质量关修复：复用frame共同外卡+illustration/notice，横版48%左图52%右文、竖版上图下文；原看全部功能链接由现有inline_button变为原词按钮，手机居中。",
   "dependencies": [
    "content_card需让指定illustration素材按半卡宽显示，不能缩成小图标；illustration_width仅表达待接入意图。",
    "链接嵌在单para中，不能把看全部功能另写text_ref；link_style需仅把原有链接呈为卡内独立按钮且文字只出现一次。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-04-review.png"
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
   "asset": "_library/illustrations/ill-185afc142d9ee9.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-185afc142d9ee9",
   "source_phrase": "横版：左上标题，下面一张横向大卡片：左边一幅小水彩插画（一张功能清单，28 个小圆点），右边一句话和一个按钮样式的链接。",
   "sha256": "eaec202faa47cebc15e0b952d347c345cba97b75360f811ec07fa326350842bc",
   "status": "ready",
   "original_elements": [
    "一张功能清单，28 个小圆点"
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
   "asset": "_library/round3/titles/title-r3-7dadc2c869cdb800f4de.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-localocr\\img\\skill-localocr-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready",
   "source_box": [
    37,
    60,
    692,
    350
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 能做的事

读字、选模型、表格和位置、结果靠得住、运行和显卡、版本和换模型，六组共 28 项，每项写了能做什么和用没用过：〔看全部功能〕

::screen{#skill-localocr-05 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-localocr-05",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“交给它”，右栏“不交给它 / 它不做”，每栏一组带小图标的短句卡片；最下面一条横跨整屏的浅绿提示条写最后两句话。",
  "portrait": "竖版：标题；两栏改成上下两组，卡片一行一条；提示条在最下面。",
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
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "交给它",
     "columns": 1,
     "columns_v": 1,
     "row": "limits",
     "width": "50%",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "item_images": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-ea93827b93a1f34e4c58.png"
     ],
     "icon_position": "none",
     "illustration": "left_inside"
    },
    {
     "type": "points_card",
     "text_ref": "不交给它 / 它不做",
     "columns": 1,
     "columns_v": 1,
     "row": "limits",
     "width": "50%",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "item_images": [
      "_library/icons/相机.png",
      "_library/icons/文稿堆.png",
      "_library/icons/身份盾牌.png",
      "_library/icons/禁止文件.png"
     ],
     "icon_position": "none",
     "illustration": "left_inside"
    },
    {
     "type": "notice",
     "text_ref": "取消了就不再自动重试",
     "columns": 1,
     "columns_v": 1,
     "tone": "green",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "横版两张组框并排，每框标题下面四张左图右文短句卡；竖版两组上下顺排，四条仍每条一张内卡。底部整宽绿提示左插画右正文，两句话完整。无箭头或丝带。原图正文前后额外装饰绿圆点仅装饰，不应当作语义状态字；标题全屏按追加要求居中。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10质量关修复：边界两组换成现有points_card的逐条内卡与明确item_images左图，保持两组横版并列/竖版顺排；不以未知list_layout字段冒充完成。",
   "dependencies": [
    "每组bullets是一个节点，不可用text_ref按条分；content_card需提供bullets逐条内卡与左图能力，list_layout/item_illustration目前未支持。",
    "8条图标与提示图不足（目前只抽取1个）；边界毛笔标题缺合格抽取。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-05-review.png"
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
     "type": "points_card",
     "text_ref": "交给它",
     "columns": 1,
     "columns_v": 1,
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "item_images": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-ea93827b93a1f34e4c58.png"
     ],
     "icon_position": "none",
     "illustration": "left_inside"
    },
    {
     "type": "points_card",
     "text_ref": "不交给它 / 它不做",
     "columns": 1,
     "columns_v": 1,
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "item_images": [
      "_library/icons/相机.png",
      "_library/icons/文稿堆.png",
      "_library/icons/身份盾牌.png",
      "_library/icons/禁止文件.png"
     ],
     "icon_position": "none",
     "illustration": "left_inside"
    },
    {
     "type": "notice",
     "text_ref": "取消了就不再自动重试",
     "columns": 1,
     "columns_v": 1,
     "tone": "green",
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "横版两张组框并排，每框标题下面四张左图右文短句卡；竖版两组上下顺排，四条仍每条一张内卡。底部整宽绿提示左插画右正文，两句话完整。无箭头或丝带。原图正文前后额外装饰绿圆点仅装饰，不应当作语义状态字；标题全屏按追加要求居中。 新外观（对话气泡、条目小卡、未批准的底色、复合卡内图文）均需组件样张确认；普通卡面和字体沿用已批准样板。 qa-10质量关修复：边界两组换成现有points_card的逐条内卡与明确item_images左图，保持两组横版并列/竖版顺排；不以未知list_layout字段冒充完成。",
   "dependencies": [
    "每组bullets是一个节点，不可用text_ref按条分；content_card需提供bullets逐条内卡与左图能力，list_layout/item_illustration目前未支持。",
    "8条图标与提示图不足（目前只抽取1个）；边界毛笔标题缺合格抽取。"
   ],
   "visual_review": {
    "method": "view_image 实际查看横竖并排缩略图；本屏两方向均已查看",
    "evidence_image": "E:\\Cache\\Codex\\Temp\\01a0fe5a-8517-7651-8beb-230970450899\\skill-localocr-05-review.png"
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "要一字不差的文字，尤其是很小、很淡的关键字",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "一大批图片或整份扫描件",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "取消了就不再自动重试；AI那边等不及先退出，不等于识别失败，先回查任务，不盲目重交。把握分高、结论“有字”都不等于每个字都对，关键内容回原图核对。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "取消了就不再自动重试；AI那边等不及先退出，不等于识别失败，先回查任务，不盲目重交。把握分高、结论“有字”都不等于每个字都对，关键内容回原图核对。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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

## 边界

**交给它**
- 要一字不差的文字，尤其是很小、很淡的关键字
- 一大批图片或整份扫描件
- 要表格结构、公式、印章或每行字的位置
- 要求图片只在本机处理

**不交给它 / 它不做**
- 只想知道画面里有什么：AI 自己看
- 电子版 PDF、Word、Excel 这类本来就有文字的文件：用各自的读取工具
- 认人：它只读字，不做人脸识别
- 把私人图片发到外部的识别网站：不做

取消了就不再自动重试；AI 那边等不及先退出，不等于识别失败，先回查任务，不盲目重交。把握分高、结论“有字”都不等于每个字都对，关键内容回原图核对。
