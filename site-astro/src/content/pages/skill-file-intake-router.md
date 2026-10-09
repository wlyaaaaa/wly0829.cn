---
{
 "title": "一堆文件一起看",
 "kind": "skill",
 "url": "/skills/file-intake-router/",
 "tagline": "一堆杂文件，各交给最合适的读法。",
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
  "page": "skill-file-intake-router",
  "kind": "skill",
  "title": "一堆文件一起看",
  "url": "/skills/file-intake-router/",
  "tagline": "一堆杂文件，各交给最合适的读法。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "0a4276554e88f97277b991b8a47274e6241ead40",
   "commit_time": "2026-09-19T23:41:44+08:00",
   "file": "E:\\.agents\\skills\\file-intake-router\\SKILL.md、agents\\openai.yaml"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [],
   "relations": [
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "交给",
     "flow": "扫描版或只有图片的 PDF，以及成批、要逐字、要结构、只能在本机、难认的图片",
     "source": "SKILL.md:14–15"
    },
    {
     "id": "r-chinese-asr",
     "with": "chinese-asr",
     "direction": "交给",
     "flow": "中文语音",
     "source": "SKILL.md:15"
    },
    {
     "id": "r-host-readers",
     "with": "外部：AI 自带的 Word、幻灯片、表格、PDF 读写（Codex 的 documents、presentations、spreadsheets、pdf；Claude 的 docx、pptx、xlsx、pdf）",
     "direction": "交给",
     "flow": "Word、PowerPoint、表格和 CSV、电子版 PDF",
     "source": "SKILL.md:13–14；本会话 Claude 技能清单"
    },
    {
     "id": "r-google-drive",
     "with": "skill-google-workspace-direct",
     "direction": "被用于",
     "flow": "云盘下载下来的普通文件，按这里的分法交给对应读法",
     "source": "google-workspace-direct\\SKILL.md:15“普通文件用 CLI DriveDownload 后交对应读取器”"
    },
    {
     "id": "r-personal-materials",
     "with": "personal-materials",
     "direction": "分工",
     "flow": "找我的原件归找文件原件；找到后要读的杂文件再按这里分",
     "source": "personal-materials 技能描述；本页边界"
    }
   ],
   "mentions": [
    {
     "target": "/skills/localocr/",
     "screen": "skill-file-intake-router-02",
     "text": "本地文字识别"
    },
    {
     "target": "/skills/chinese-asr/",
     "screen": "skill-file-intake-router-02",
     "text": "中文语音转写"
    },
    {
     "target": "/skills/localocr/",
     "screen": "skill-file-intake-router-03",
     "text": "本地文字识别"
    },
    {
     "target": "/skills/chinese-asr/",
     "screen": "skill-file-intake-router-03",
     "text": "中文语音转写"
    },
    {
     "target": "/skills/personal-materials/",
     "screen": "skill-file-intake-router-04",
     "text": "找文件原件"
    },
    {
     "target": "/projects/agents/#f-skill-route",
     "screen": "skill-file-intake-router-04",
     "text": "AI 规则与技能基座"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "SKILL.md 里的 rg、documents、presentations、spreadsheets 这些工具名不上页面，改写成“全文搜索”“AI 自带的 Word／幻灯片／表格读写”。"
   ],
   "unsure": [
    "页面名沿用旧网站的“一堆文件一起看”（content\\skills.json）。",
    "第 2 屏是照技能规则串起来的假设例子，页面上已写明；没找到这个技能被实际调用的记录。",
    "“这台电脑现在没装 MarkItDown”是 9 月 28 日用 py -3 -m pip show markitdown 查的，只查了登记的主 Python。",
    "技能总页分组：旧稿放在“资料和媒体”；它不是某个项目的入口，请 Claude 定。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-file-intake-router/page.json",
  "sha256": "6607119272a6f4cf405b8a3eb6d49d872f7c11e6d0e70d6950b69991f19d8cca",
  "converted_at_beijing": "2026-10-10T03:45:10+08:00"
 }
}
---

::screen{#skill-file-intake-router-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-file-intake-router-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句话和一段说明。右边一幅水彩插画：一个敞开的文件夹里倒出一堆各式各样的文件（Word 蓝色文档、Excel 绿色表格、一张手机拍的收据照片、一份泛黄的扫描件、一个压缩包、一个小喇叭形状的录音），一只绿色的小手正把它们分别放进几个小筐。下半部分一张“怎么跟 AI 说”的卡片，四句话做成对话气泡，两列排开。",
  "portrait": "竖版：标题、一句话、说明在上；插画占满宽度；四个对话气泡一行一个。",
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
     "row": "hero",
     "width": "43%",
     "align": "left",
     "size": "large",
     "text_ref": "大标题：一堆文件一起看"
    },
    {
     "type": "prose",
     "row": "hero",
     "align": "left",
     "text_ref": "一句话：文件夹"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "57%",
     "illustration": "outside"
    },
    {
     "type": "dialogue",
     "columns": 2,
     "columns_v": 1,
     "bubble_per_item": true,
     "illustration": "left_inside",
     "secondary_illustration": "right_inside",
     "connector": "none",
     "text_ref": "怎么跟 AI 说",
     "split_paras": true,
     "split_items": true,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "left_inside",
     "tail": true,
     "right_images": [
      "_library/icons/文件夹.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/icons/放大镜.png"
     ],
     "right_image_source": "icons"
    }
   ],
   "notes": "已核对原图。上半左标题及两段介绍，右独立文件分拣插画，插画约57%宽；下半四条对话为2×2卡，人像在左、气泡居中、文件小图在右，均在卡片内，无卡间连接。定稿中的大标题/一句话/说明是原文标记，原图没有这些标签；应由主工程师统一解析，不改定稿。四条连续清单是一个定稿节点，bubble_per_item 为每条一气泡的构图要求，待组件支持。 本轮文字核对：四句为四个气泡，使用当前组件真实split_paras字段，不只声明列数。 本轮将原组名分给同一dialogue外卡，四个气泡共享卡头；右小图与左人像使用不同素材索引，实际语义映射仍待素材库补齐核对。；2026-10-03 本轮：独立插画的位置按现有 row/width 和块序落实，去掉重复的 placement 字段；02 筐内覆字字段仍未接入，原意及未完成状态保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "大标题：一堆文件一起看"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "一句话：文件夹"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "bleed": true
    },
    {
     "type": "dialogue",
     "columns": 1,
     "columns_v": 1,
     "bubble_per_item": true,
     "illustration": "left_inside",
     "secondary_illustration": "right_inside",
     "connector": "none",
     "text_ref": "怎么跟 AI 说",
     "split_paras": true,
     "split_items": true,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "avatar_source": "icons",
     "avatar_position": "left_inside",
     "tail": true,
     "right_images": [
      "_library/icons/文件夹.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/icons/放大镜.png"
     ],
     "right_image_source": "icons"
    }
   ],
   "notes": "已核对原图。标题和两段正文在上、满宽独立插画在其下、怎么跟AI说组名、四条横向对话卡逐条竖排。卡内人像左、气泡中、文件小图右。大标题/一句话/说明为不应上画面的编辑标记；保留定稿原文件，请主工程师统一解析。 本轮文字核对：四句为四个气泡，使用当前组件真实split_paras字段，不只声明列数。 本轮将原组名分给同一dialogue外卡，四个气泡共享卡头；右小图与左人像使用不同素材索引，实际语义映射仍待素材库补齐核对。；2026-10-03 本轮：独立插画的位置按现有 row/width 和块序落实，去掉重复的 placement 字段；02 筐内覆字字段仍未接入，原意及未完成状态保留。"
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
   "source_phrase": "“这个文件夹里有表格也有扫描件，你帮我一起看看。”",
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
   "source_phrase": "“这个压缩包里是合同附件，挑跟付款有关的看。”",
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
   "source_phrase": "“这几份附件有 Word、PDF 和照片，汇总一下要点。”",
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
   "source_phrase": "“这份 PDF 不知道是不是扫描的，帮我读出来。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹",
   "source_phrase": "“这个文件夹里有表格也有扫描件，你帮我一起看看。”",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "“这个压缩包里是合同附件，挑跟付款有关的看。”",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "照片堆",
   "source_phrase": "“这几份附件有 Word、PDF 和照片，汇总一下要点。”",
   "sha256": "ea6c42cf780bf1135d5f08a696c3a91e26537335e74a0c2165b27b44e15f09b5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "放大镜",
   "source_phrase": "“这份 PDF 不知道是不是扫描的，帮我读出来。”",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/文件收纳通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件收纳通用构图",
   "source_phrase": "右边一幅水彩插画：一个敞开的文件夹里倒出一堆各式各样的文件（Word 蓝色文档、Excel 绿色表格、一张手机拍的收据照片、一份泛黄的扫描件、一个压缩包、一个小喇叭形状的录音），一只绿色的小手正把它们分别放进几个小筐。",
   "sha256": "764e9012bb1bbe7cfc27ff7639b21204558266fe15f49c6340212ad71fb8560d",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-226ea60bb2aab8a3c92b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-226ea60bb2aab8a3c92b",
   "title_text": "一堆文件一起看",
   "sha256": "3826fc250cc31a3038b1259986b5531fa53693aa66d9042be6ef9a1f795ab8f4",
   "status": "ready"
  }
 ]
}
```

大标题：一堆文件一起看

一句话：文件夹、压缩包、类型混杂的一堆附件、说不清是不是扫描件的 PDF，先分拣，再把每一种交给最能保住原有结构的读法；分完它就退场，真正读的是各自的工具。

说明：只有一种已知类型的文件时不经过它，AI 直接用那种文件的读法。为什么要先分拣：Word 里的批注和修订、表格里的公式、幻灯片的备注，一旦截成图再认字（OCR）就全丢了；所以能直接读的先直接读，认字只留给扫描件和图片。

**怎么跟 AI 说**
- “这个文件夹里有表格也有扫描件，你帮我一起看看。”
- “这个压缩包里是合同附件，挑跟付款有关的看。”
- “这几份附件有 Word、PDF 和照片，汇总一下要点。”
- “这份 PDF 不知道是不是扫描的，帮我读出来。”

::screen{#skill-file-intake-router-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-file-intake-router-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题，下面一行“假如我说”。左边约三分之二宽，六个编号步骤排成一列，每步一个小水彩图标（一张清单、一个打开的压缩包、一份 Word 和一张表格、一叠收据、一份扫描件和一个小喇叭、一张汇总纸）和两三行字。右边约三分之一宽，一幅插画：六个贴着标签的小竹筐排成两行，筐里装着对应的文件，标签上的字见“筐上的字”。",
  "portrait": "竖版：标题和“假如我说”在上；六个步骤一行一步；六个小筐排成三行两列放在最下。",
  "links": [
   {
    "text": "本地文字识别",
    "href": "/skills/localocr/"
   },
   {
    "text": "中文语音转写",
    "href": "/skills/chinese-asr/"
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
     "text_ref": "标题：一个完整例子",
     "subtitle_from": "：照这套做法",
     "asset": "skill-md-to-pdf/skill-md-to-pdf-02-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\img\\skill-md-to-pdf-02-h.png",
     "source_box": [
      47,
      17,
      756,
      182
     ]
    },
    {
     "type": "prose",
     "text_ref": "假如我说"
    },
    {
     "type": "flow",
     "columns": 2,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "1先看清单再分组",
     "direction": "horizontal",
     "icons": "auto",
     "row": "example",
     "width": "60%"
    },
    {
     "type": "document_mock",
     "layout": "illustration_labels",
     "label_text_ref": "筐上的字",
     "label_columns": 3,
     "label_rows": 2,
     "labels": [
      "文档",
      "表格",
      "扫描件",
      "图片",
      "录音",
      "压缩包"
     ],
     "label_positions": [
      {
       "x": 9.296148738379815,
       "y": 30.843116328708643,
       "width": 14.940239043824702,
       "height": 8.964781216648879,
       "align": "center"
      },
      {
       "x": 42.76228419654714,
       "y": 30.843116328708643,
       "width": 14.873837981407704,
       "height": 8.964781216648879,
       "align": "center"
      },
      {
       "x": 76.62682602921646,
       "y": 30.843116328708643,
       "width": 14.608233731739709,
       "height": 8.964781216648879,
       "align": "center"
      },
      {
       "x": 9.229747675962816,
       "y": 82.92422625400214,
       "width": 14.873837981407704,
       "height": 8.858057630736393,
       "align": "center"
      },
      {
       "x": 42.76228419654714,
       "y": 82.92422625400214,
       "width": 14.741035856573706,
       "height": 8.858057630736393,
       "align": "center"
      },
      {
       "x": 76.82602921646746,
       "y": 82.92422625400214,
       "width": 14.342629482071715,
       "height": 8.858057630736393,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      },
      {
       "label_index": 4,
       "position_index": 4
      },
      {
       "label_index": 5,
       "position_index": 5
      }
     ],
     "base_asset": "_library/illustrations/followup-r3-intake-six-baskets-h.png",
     "text_ref": "筐上的字",
     "variant": "window",
     "size": "large",
     "row": "example",
     "width": "40%"
    },
    {
     "type": "notice",
     "text_ref": "要注意",
     "row": "example"
    }
   ],
   "notes": "已核对原图。整宽长标题原左对齐，按本人追加要求改居中，使用中档而非缩小正文；介绍横贯整宽。下方左约55%为六条编号横卡，编号最左、图标在卡内左、字在右，无步骤丝带；右约45%独立竹筐插画3×2，底部同栏提示卡。筐标签必须由定稿程序覆字，禁止带字素材加重复标签；label_text_ref/label_columns/label_rows 为构图要求，待组件接入。 本轮复用此前原图核对记录，保留55/45与竖版插画在步骤前；用flow统一实际正文24/36字号并保留六行左图右文。；2026-10-03 本轮：独立插画的位置按现有 row/width 和块序落实，去掉重复的 placement 字段；02 筐内覆字字段仍未接入，原意及未完成状态保留。\nmain-closer3：以document_mock既有真实合同一次消费六筐原标签；h保持原右45%栏3×2，v完整等比2×3，标签24/36px，不再保留不被core消费的覆字字段。\nmain-closer4：按明确裁定将02主标题拆为“一个完整例子”，原冒号及全部后半句按既有subtitle_from接口作副标题，原字原序一次；电脑版同步。复用素材库已ready/已核字同字毛笔图及其真实原图取色合同，large只缩不放大；不改核字/ready记录。\n2026-10-04 大空白专查最终排法（AI实施，本人本轮授权重排）：六个无连接线原步骤在左60%按两列三行，完整六篮图/原标签/末说明在右40%。真实源宽与Noto字体复验后，两列步骤将长链收为三排，六篮不再在下方单独撑出右侧大白；定稿原字和原序不变。\n2026-10-06 Astra复核退回：恢复721f9c5的本屏横版构图、插画大小和位置。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：一个完整例子",
     "subtitle_from": "：照这套做法",
     "asset": "skill-md-to-pdf/skill-md-to-pdf-02-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-md-to-pdf\\img\\skill-md-to-pdf-02-h.png",
     "source_box": [
      47,
      17,
      756,
      182
     ]
    },
    {
     "type": "prose",
     "text_ref": "假如我说"
    },
    {
     "type": "document_mock",
     "layout": "illustration_labels",
     "label_text_ref": "筐上的字",
     "label_columns": 2,
     "label_rows": 3,
     "labels": [
      "文档",
      "表格",
      "扫描件",
      "图片",
      "录音",
      "压缩包"
     ],
     "label_positions": [
      {
       "x": 12.079831932773109,
       "y": 22.001471670345843,
       "width": 25.945378151260506,
       "height": 4.856512141280353,
       "align": "center"
      },
      {
       "x": 61.65966386554622,
       "y": 22.001471670345843,
       "width": 25.10504201680672,
       "height": 4.856512141280353,
       "align": "center"
      },
      {
       "x": 12.394957983193278,
       "y": 56.5121412803532,
       "width": 25.42016806722689,
       "height": 4.7093451066961,
       "align": "center"
      },
      {
       "x": 61.86974789915966,
       "y": 56.5121412803532,
       "width": 24.68487394957983,
       "height": 4.7093451066961,
       "align": "center"
      },
      {
       "x": 12.184873949579831,
       "y": 90.50772626931567,
       "width": 25.630252100840334,
       "height": 4.5621780721118474,
       "align": "center"
      },
      {
       "x": 61.86974789915966,
       "y": 90.50772626931567,
       "width": 25.0,
       "height": 4.5621780721118474,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      },
      {
       "label_index": 4,
       "position_index": 4
      },
      {
       "label_index": 5,
       "position_index": 5
      }
     ],
     "base_asset": "_library/illustrations/followup-r3-intake-six-baskets-v.png",
     "text_ref": "筐上的字",
     "variant": "window",
     "size": "large"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "1先看清单再分组",
     "direction": "vertical",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "要注意"
    }
   ],
   "notes": "已核对v及v2，两张是一屏。原图第一张标题、假如我说、竹筐插画2列3行，第二张六条步骤整宽竖排、筐上的字横条、要注意横条。遵循实际原图插画在步骤前，与旧portrait文字的插画放最下不同；正文用定稿。每条编号与图标均在卡内左边，无连接。标签图内若仍有旧字必须以无字素材及程序文字覆盖处理，不能另加一份文字来凑逐字关。 本轮复用此前原图核对记录，保留55/45与竖版插画在步骤前；用flow统一实际正文24/36字号并保留六行左图右文。；2026-10-03 本轮：独立插画的位置按现有 row/width 和块序落实，去掉重复的 placement 字段；02 筐内覆字字段仍未接入，原意及未完成状态保留。\nmain-closer3：以document_mock既有真实合同一次消费六筐原标签；h保持原右45%栏3×2，v完整等比2×3，标签24/36px，不再保留不被core消费的覆字字段。\nmain-closer4：按明确裁定将02主标题拆为“一个完整例子”，原冒号及全部后半句按既有subtitle_from接口作副标题，原字原序一次；电脑版同步。复用素材库已ready/已核字同字毛笔图及其真实原图取色合同，large只缩不放大；不改核字/ready记录。"
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张清单",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个打开的压缩包",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "source_phrase": "一份 Word 和一张表格",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一叠收据",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一份扫描件和一个小喇叭",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张汇总纸",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/followup-r3-intake-six-baskets-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件筐",
   "source_phrase": "六个贴着标签的小竹筐排成两行",
   "sha256": "7ac8ddf5a1af114af336ccb45306012e6b5567b399a1916df650e87a87049909",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/followup-r3-intake-six-baskets-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件筐",
   "source_phrase": "六个小筐排成三行两列",
   "sha256": "b76aa2050969fcfda85103ee44872dc99dadb36a08c860712e136e065b435469",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-8d08639fd32dbc701685.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-8d08639fd32dbc701685",
   "title_text": "一个完整例子：照这套做法，一个杂乱的资料文件夹会这样读",
   "sha256": "92af344c46ec2a033f239acfab6c3fa80479420c640f048340f46ed7d040173d",
   "status": "ready"
  }
 ]
}
```

标题：一个完整例子：照这套做法，一个杂乱的资料文件夹会这样读

假如我说：“‘项目资料’这个文件夹帮我看一下，汇总跟付款有关的要点。”文件夹里有 1 个压缩包、3 份 Word、2 张 Excel 表、5 张手机拍的收据、1 份扫描版 PDF 和 1 段中文录音。

1. **先看清单再分组**：列出有哪些文件、各是什么类型，够分组就停，不一上来把每个文件都打开。
2. **压缩包先列目录**：先列出里面有哪些文件，只挑跟付款有关的，再按类型分下去。
3. **Word 和 Excel 直接读**：Word 连批注、修订一起读；Excel 读到公式，而不只是算出来的数。
4. **5 张收据交本地识字**：一两张普通照片 AI 自己看就行；5 张、金额要一字不差，就交〔本地文字识别〕成批逐字读。
5. **扫描件交识字，录音交转写**：先确认那份 PDF 里没有能直接取出的文字，才交本地文字识别；录音交〔中文语音转写〕。
6. **汇总时只报要紧的路线**：走了哪条路，只在影响可靠性、隐私、花费或耗时时才告诉我，例如“收据在本机识别，没传出去”。

**筐上的字**：文档｜表格｜扫描件｜图片｜录音｜压缩包

**要注意**：这是照技能写的规则串起来的例子，不是某一次的记录。

::screen{#skill-file-intake-router-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-file-intake-router-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题。左边约五分之三宽是一张两列的分拣表（左列“文件”，右列“交给谁”），每行左边一个小文件图标。右边五分之二宽竖着三张小卡片（文件夹只取需要的、版式要紧时再看一眼、统一文字稿），每张一个小图标。",
  "portrait": "竖版第1张03-v：仅原标题和11项文件到读取工具的完整对应，不夹后续分张的三张说明卡。每项整宽，上文件类型、下交给谁，图标靠标题/行首并缩小；实际370px路由关系和正文清楚。标题和上下配对结构已说清什么文件交给谁时，不以额外重复文件/交给谁表头作为单独重画门槛。后续正确v2路径/原字/范围保持。",
  "links": [
   {
    "text": "本地文字识别",
    "href": "/skills/localocr/",
    "locator_instances": {
     "h": {
      "input_sha256": "6f60f53c31c9d3cad6f95411bee2ba03475fabe340138cd05f54a5ce01b8edde",
      "instances": [
       {
        "context_text": "本地文字识别",
        "context_rect": [
         536,
         481,
         705,
         508
        ],
        "expected_rect": [
         539,
         484,
         703,
         507
        ]
       },
       {
        "context_text": "本地文字识别",
        "context_rect": [
         537,
         603,
         705,
         631
        ],
        "expected_rect": [
         539,
         606,
         704,
         629
        ]
       }
      ]
     }
    }
   },
   {
    "text": "中文语音转写",
    "href": "/skills/chinese-asr/"
   }
  ],
  "anchors": [
   {
    "id": "a-table",
    "text": "什么文件交给谁"
   },
   {
    "id": "a-folder",
    "text": "文件夹只取需要的"
   },
   {
    "id": "a-visual",
    "text": "版式要紧时再看一眼"
   },
   {
    "id": "a-markitdown",
    "text": "统一文字稿（备用）"
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
     "text_ref": "标题：能做的事",
     "row": "routing",
     "width": "58%"
    },
    {
     "type": "table",
     "row": "routing",
     "columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "文件",
     "column_widths": [
      52,
      48
     ]
    },
    {
     "type": "content_card",
     "row": "routing",
     "width": "42%",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "文件夹只取需要的"
    }
   ],
   "notes": "已核对原图。左58%标题和双列表，12项路由逐行，图标在每行左侧；右42%三张说明卡竖排，图标左、文字右。标题在左栏内居中。第三卡较长可占较高，不缩字。table column_widths/每行图标为构图要求；定稿12行完整保留，不能照portrait旧11项遗漏SVG行。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：能做的事"
    },
    {
     "type": "table",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "portrait_mode": "paired_rows",
     "echo_headers": false,
     "text_ref": "文件"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "text_ref": "文件夹只取需要的"
    }
   ],
   "notes": "已核对v及v2，两张一屏：标题、12项文件→读法上下配对卡、3张说明卡。前11项在v、第12项SVG在v2顶部，之后说明卡无图标、满宽正文。第一张行卡小图标左、文件类型在上、读法在下，表头不用每卡重复；定稿表头可只出现一次。不按旧portrait“11项”删掉定稿第12项。paired_rows/echo_headers 为需表格组件接入的构图要求。"
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
   "source_phrase": "文件｜交给谁",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "文字、代码、JSON、YAML、XML、日志｜直接读，或用解析器、全文搜索",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "Word｜AI 自带的 Word 读写",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "PowerPoint｜AI 自带的幻灯片读写",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "表格、CSV｜AI 自带的表格读写",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "电子版 PDF｜AI 自带的 PDF 读写",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "source_phrase": "扫描版、只有图片的 PDF｜〔本地文字识别〕",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "一两张普通图片、截图｜AI 自己看",
   "sha256": "ea6c42cf780bf1135d5f08a696c3a91e26537335e74a0c2165b27b44e15f09b5",
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
   "source_phrase": "成批、要逐字、要表格结构、只能在本机、字难认的图片｜本地文字识别",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "中文语音｜〔中文语音转写〕",
   "sha256": "94119402f1f4bebbe169fbe11dd19fe64801a8a7f555c2b7a08353103aa64bf9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "压缩包｜先列出里面有哪些文件，再把相关的按上面分",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "数据库、Jupyter 笔记本｜数据库、数据表或笔记本工具，绝不认字",
   "sha256": "761f14c1bca2c5744a2525af6bcaa8a4384d6a9473430d2d060d98b7c7ac1328",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7eba73556ace94c31498.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7eba73556ace94c31498",
   "title_text": "能做的事：什么文件交给谁",
   "sha256": "c49d0964a70a9e1ab260a954d2a49662dc1df4bfb5b70eb06cf8e1d1560ad672",
   "status": "ready"
  }
 ]
}
```

标题：能做的事：什么文件交给谁

| 文件 | 交给谁 |
|---|---|
| 文字、代码、JSON、YAML、XML、日志 | 直接读，或用解析器、全文搜索 |
| Word | AI 自带的 Word 读写 |
| PowerPoint | AI 自带的幻灯片读写 |
| 表格、CSV | AI 自带的表格读写 |
| 电子版 PDF | AI 自带的 PDF 读写 |
| 扫描版、只有图片的 PDF | 〔本地文字识别〕 |
| 一两张普通图片、截图 | AI 自己看 |
| 成批、要逐字、要表格结构、只能在本机、字难认的图片 | 本地文字识别 |
| 中文语音 | 〔中文语音转写〕 |
| 压缩包 | 先列出里面有哪些文件，再把相关的按上面分 |
| 数据库、Jupyter 笔记本 | 数据库、数据表或笔记本工具，绝不认字 |
| SVG、drawio、mermaid 图 | 先读源码，要看画面效果时才渲染 |

- **文件夹只取需要的**：看够清单能分组就行；问题只涉及一部分，就只处理那一部分。
- **版式要紧时再看一眼**：排版和位置影响意思时，除了读文字，再看一眼渲染出来的画面。
- **统一文字稿（备用）**：一批杂文件确实需要统一成 Markdown 文字稿时，才考虑 MarkItDown（把各种文件转成 Markdown 的小工具）；不自动安装（这台电脑现在没装），不排在 Word、幻灯片、表格、PDF 的专门读法前面；原件永远作准，Markdown 只是分析用的副本。

::screen{#skill-file-intake-router-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-file-intake-router-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“管”画一个分拣用的小竹筐，下面两条；右栏“不管”画一个淡灰色的叉，下面三条。最下面一张宽卡片写“它不会做的事”，卡片下一行小字带一个链接。",
  "portrait": "竖版：“管”一栏在上、“不管”一栏在下，一条一行；最下面宽卡片和一行小字。",
  "links": [
   {
    "text": "找文件原件",
    "href": "/skills/personal-materials/"
   },
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/#f-skill-route"
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
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "groups": [
      {
       "text_ref": "管"
      },
      {
       "text_ref": "不管"
      }
     ],
     "text_ref": "管",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "它不会做的事",
     "icons": [
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "已核对原图。整宽章节标题按本人要求居中。下方管/不管两栏同高，栏内左有组名和插画、右有条目；没有箭头连接，不管只用状态叉的灰，不将整段正文染灰。最下满宽说明卡，盾牌图标左、它不会做的事和正文右，卡底分隔线下居中原定稿链接行。定稿原文件不改。；2026-10-03 本轮：章节标题改 medium；现有标题图不受 size 控制，真实尺寸待 main 提供图像档位，未删“标题：”原字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "groups": [
      {
       "text_ref": "管"
      },
      {
       "text_ref": "不管"
      }
     ],
     "text_ref": "管",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "它不会做的事",
     "icons": [
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "已核对原图。标题、管满宽卡、不管满宽卡、它不会做的事满宽卡上下排。前两卡插画和组名在左、条目在右，最后一张盾牌图标在左上、卡名在右上，长正文在下面满宽，链接在最底。没有卡间连接。最后卡内上部图标/标题并排与正文贯通为原图构图，若core统一左图右字使正文过窄，应由组件修正。；2026-10-03 本轮：章节标题改 medium；现有标题图不受 size 控制，真实尺寸待 main 提供图像档位，未删“标题：”原字。"
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "它不会做的事：不把私人文件默认传到搜索引擎或外面的识字服务（AI自己看图、读文档时，内容会发给它所在的云端模型；要求只在本机的，交本地文字识别）；不把MarkItDown做成必装的依赖或常驻服务；Word、表格、PDF能直接读时，不先截图再认字；不把每一步走了哪条路都汇报一遍。\nAI怎么凭“说事”挑中这个技能，见AI规则与技能基座。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "管",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
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
   "source_phrase": "管",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "不管",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
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
   "status": "ready"
  }
 ]
}
```

标题：边界

**管**
- 输入杂、类型不明时，怎么分、分给谁
- 文件夹和压缩包里挑哪些要看

**不管**
- 真正的阅读和识别：归各自的读法（本地文字识别、中文语音转写、AI 自带的文档读写）
- 只有一种已知类型的文件：直接交给那种读法
- 在电脑里找我的某份文件：归〔找文件原件〕

**它不会做的事**：不把私人文件默认传到搜索引擎或外面的识字服务（AI 自己看图、读文档时，内容会发给它所在的云端模型；要求只在本机的，交本地文字识别）；不把 MarkItDown 做成必装的依赖或常驻服务；Word、表格、PDF 能直接读时，不先截图再认字；不把每一步走了哪条路都汇报一遍。

AI 怎么凭“说事”挑中这个技能，见〔AI 规则与技能基座〕。
