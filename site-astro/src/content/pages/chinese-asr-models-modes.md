---
{
 "title": "快速初稿、双模型核对和专门对齐，分别选什么",
 "kind": "project",
 "url": "/projects/chinese-asr/models-modes/",
 "tagline": "",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "usage",
   "label": "怎么用"
  },
  {
   "id": "tech",
   "label": "技术"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "chinese-asr-models-modes",
  "kind": "project",
  "title": "快速初稿、双模型核对和专门对齐，分别选什么",
  "url": "/projects/chinese-asr/models-modes/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）的模型登记、直接转写守卫与本机模型目录，于 10 月 11 日按 14:00 前状态只读核对；本轮未运行任何模型。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-models-modes/page.json",
  "sha256": "55eb259be6d67c9c3d25dfeee9267055da85f120c5c488e8bc10ebfa4065c2b3",
  "converted_at_beijing": "2026-10-11T18:50:42+08:00"
 }
}
---

::screen{#chinese-asr-models-modes-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-01",
  "section": "top",
  "title": "快速初稿、双模型核对和专门对齐，分别选什么",
  "links": [
   {
    "text": "回到项目 → 中文语音转写",
    "href": "/projects/chinese-asr/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/ChineseASR"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/chinese-asr/#ai-brief"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "快速初稿、双模型核对和专门对齐，分别选什么",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的模型登记、直接转写守卫与本机模型目录，于 10 月 11 日按 14:00 前状态只读核对；本轮未运行任何模型。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我按用途选路线：对电脑说话打字用 Qwen3-ASR-1.7B；先快速看录音内容用 SenseVoiceSmall；平常的录音默认用 Qwen 与 SenseVoice 两路严格核对；重要录音点名走高质量路线，由 FireRedASR2-LLM 主听、Qwen 校验。Fun-ASR 是可明确选择的另一中文路线；多人录音的分段可用 Paraformer，确认文案配时间用 Qwen3-ForcedAligner。本地标出疑点的文件在免费期内会再请阿里云 Qwen Audio 3.1 听一遍；普通录音不会因安装新模型而自动改路线或上传云端。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有快速初稿、日常双模型核对、重要录音高质量路线、可明确选择的其他本地路线和疑难云复核；Whisper目前只有登记，不能直接转写，也不会自动成为后备。",
     "row": "top"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "top",
     "width": "42%",
     "align": "center"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "快速初稿、双模型核对和专门对齐，分别选什么",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的模型登记、直接转写守卫与本机模型目录，于 10 月 11 日按 14:00 前状态只读核对；本轮未运行任何模型。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我按用途选路线：对电脑说话打字用 Qwen3-ASR-1.7B；先快速看录音内容用 SenseVoiceSmall；平常的录音默认用 Qwen 与 SenseVoice 两路严格核对；重要录音点名走高质量路线，由 FireRedASR2-LLM 主听、Qwen 校验。Fun-ASR 是可明确选择的另一中文路线；多人录音的分段可用 Paraformer，确认文案配时间用 Qwen3-ForcedAligner。本地标出疑点的文件在免费期内会再请阿里云 Qwen Audio 3.1 听一遍；普通录音不会因安装新模型而自动改路线或上传云端。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有快速初稿、日常双模型核对、重要录音高质量路线、可明确选择的其他本地路线和疑难云复核；Whisper目前只有登记，不能直接转写，也不会自动成为后备。"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center"
    }
   ]
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "asset": "_library/illustrations/modules/chinese-asr/models-modes/models-modes-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "d52496108c26aa7835763974babe88b9213af9d05571db3b287a447d63134a79",
   "status": "ready"
  }
 ]
}
```

# 快速初稿、双模型核对和专门对齐，分别选什么

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

我按用途选路线：对电脑说话打字用 Qwen3-ASR-1.7B；先快速看录音内容用 SenseVoiceSmall；平常的录音默认用 Qwen 与 SenseVoice 两路严格核对；重要录音点名走高质量路线，由 FireRedASR2-LLM 主听、Qwen 校验。Fun-ASR 是可明确选择的另一中文路线；多人录音的分段可用 Paraformer，确认文案配时间用 Qwen3-ForcedAligner。本地标出疑点的文件在免费期内会再请阿里云 Qwen Audio 3.1 听一遍；普通录音不会因安装新模型而自动改路线或上传云端。

**当前情况：**已有快速初稿、日常双模型核对、重要录音高质量路线、可明确选择的其他本地路线和疑难云复核；Whisper目前只有登记，不能直接转写，也不会自动成为后备。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-models-modes-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 不同用途需要不同速度和复核强度；装了新模型、有了更强的路线，不等于它该接管日常任务。固定当前默认和实际执行身份，才能知道这次结果是怎样来的。 ## 举个实际例子 “先快速知道这段语"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 不同用途需要不同速度和复核强度；装了新模型、有了更强的路线，不等于它该接管日常任务。固定当前默认和实际执行身份，才能知道这次结果是怎样来的。 ## 举个实际例子 “先快速知道这段语"
   },
   {
    "id": "module-product-title",
    "text": "这项功能怎样使用"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这项功能怎样使用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "为什么需要它",
     "columns": 3,
     "last_full_width": false,
     "icon_position": "header_left",
     "header_icon": [
      "_library/round3/clean-assets/png/05-灯泡-clean.png",
      "_library/icons/双气泡.png",
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png"
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这项功能怎样使用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "为什么需要它",
     "columns": 1,
     "icon_position": "header_left",
     "header_icon": [
      "_library/round3/clean-assets/png/05-灯泡-clean.png",
      "_library/icons/双气泡.png",
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png"
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "key": "灯泡",
   "source_phrase": "冻结页迁移固定图标：why",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/icons/双气泡.png",
   "key": "双气泡",
   "source_phrase": "冻结页迁移固定图标：example",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "key": "纸箱对勾",
   "source_phrase": "冻结页迁移固定图标：result",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "asset": "_library/hires-icons/试管对勾.png",
   "key": "绿色测试通过",
   "source_phrase": "冻结页迁移固定图标：normal",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "key": "报警灯",
   "source_phrase": "冻结页迁移固定图标：problem",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "key": "断开插头",
   "source_phrase": "冻结页迁移固定图标：unavailable",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  }
 ]
}
```

## 这项功能怎样使用

用途与实际影响

## 为什么需要它

不同用途需要不同速度和复核强度；装了新模型、有了更强的路线，不等于它该接管日常任务。固定当前默认和实际执行身份，才能知道这次结果是怎样来的。

## 举个实际例子

“先快速知道这段语音讲什么；里面要正式引用的部分按重要录音处理。”第一轮用 SenseVoiceSmall 出初稿；重要部分点名高质量路线，FireRedASR2-LLM 主听、Qwen3-ASR-1.7B 校验，把分歧连到原音。不点名的平常录音仍走 Qwen 主识别、SenseVoice 对照的日常两路，不会因为有了更强的路线就被悄悄提升。若我只要给确认过的旁白标词语秒数，则改用对齐入口，不重新识别文案。

## 最后我会得到什么

每次交回实际使用的模型、初稿或双路文字、需要回听的差异与时间位置；对齐任务另给逐词秒数。Whisper Large V3 目前只有登记，不能直接执行，也不是失败后的自动备选。云端识别分两种：本地标出疑点的文件，在免费期内由 AI 自动请云端复核；想跳过本地直接整段上云，或免费期已过，仍须我明确同意这一次。

## 正常时

所选本地模型、文件和运行条件都可用时，按这次用途执行，并在结果中写明实际用了哪一套；双路复核会保留两份结果和差异。

## 发现问题时

主识别失败而对照有结果时，只交暂定文字和失败原因，不能称为两路已经核对；重要词句仍要回听。

## 入口不可用或证据不足时

所选权重或运行环境缺失时只暂停对应路线。Whisper 当前不能直接转写，不会用相近模型顶替，也不会自行下载、换默认，或拿上传云端顶替缺失的本地模型。

::screen{#chinese-asr-models-modes-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-03",
  "section": "usage",
  "title": "结果怎么看",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "结果怎么看",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "正常时",
     "columns": 3,
     "last_full_width": false,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons/试管对勾.png",
      "_library/round3/clean-assets/png/31-报警灯-clean.png",
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png"
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "结果怎么看",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "正常时",
     "columns": 1,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons/试管对勾.png",
      "_library/round3/clean-assets/png/31-报警灯-clean.png",
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png"
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/试管对勾.png",
   "key": "绿色测试通过",
   "source_phrase": "冻结页迁移固定图标：normal",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "key": "报警灯",
   "source_phrase": "冻结页迁移固定图标：problem",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "key": "断开插头",
   "source_phrase": "冻结页迁移固定图标：unavailable",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  }
 ]
}
```

## 结果怎么看

## 正常时

所选本地模型、文件和运行条件都可用时，按这次用途执行，并在结果中写明实际用了哪一套；双路复核会保留两份结果和差异。

## 发现问题时

Qwen 主识别失败而 SenseVoice 有结果时，只交暂定文字和失败原因，不能称为两路已经核对；重要词句仍要回听。

## 入口不可用或证据不足时

所选权重或运行环境缺失时只暂停对应路线。Whisper 当前不能直接转写，不会用相近模型顶替，也不会自行下载、换默认或上传。

::screen{#chinese-asr-models-modes-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-04",
  "section": "usage",
  "title": "从哪里开始",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "从哪里开始",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "说明是快速初稿、平常录音转写、重要录音复核、说话打字还是已有文案对齐。",
     "row": "start",
     "width": "40%"
    },
    {
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "row": "start",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
    },
    {
     "type": "section_heading",
     "text_ref": "从开始到拿到结果",
     "row": "start",
     "width": "60%",
     "heading_icon": "_library/icons/scene-r3-exact-three-stairs.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. **先说要做什么**　听写、快速初稿、日常严格转写、重要录音高质量复核、多人分段和已知文案对齐的输入与输出不同；先按真实请求选择路线。",
     "row": "start",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "从哪里开始",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "说明是快速初稿、平常录音转写、重要录音复核、说话打字还是已有文案对齐。"
    },
    {
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
    },
    {
     "type": "section_heading",
     "text_ref": "从开始到拿到结果",
     "heading_icon": "_library/icons/scene-r3-exact-three-stairs.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. **先说要做什么**　听写、快速初稿、日常严格转写、重要录音高质量复核、多人分段和已知文案对齐的输入与输出不同；先按真实请求选择路线。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "key": "工具箱",
   "source_phrase": "冻结页迁移固定图标：inputs",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/icons/scene-r3-exact-three-stairs.png",
   "key": "上升台阶",
   "source_phrase": "冻结页迁移固定图标：steps",
   "sha256": "b2d695badac77b03b32249a3a6f83eaf9888916136a8657c0f6845b726f4f5a2",
   "status": "ready"
  }
 ]
}
```

## 从哪里开始

说明是快速初稿、平常录音转写、重要录音复核、说话打字还是已有文案对齐。

## 需要准备什么

- 音频或实时场景

- 所需复核强度和时间线

- 跳过本地整段上云时的单次同意（疑难复核在免费期内自动进行）

## 从开始到拿到结果

1. **先说要做什么**　听写、快速初稿、日常严格转写、重要录音高质量复核、多人分段和已知文案对齐的输入与输出不同；先按真实请求选择路线。

2. **公开实际模型选择**　听写用 Qwen；快速初稿用 SenseVoice；日常严格文件转写用 Qwen 与 SenseVoice；重要录音点名高质量时 FireRed 主听、Qwen 校验。Fun-ASR 与 Paraformer 仅在相应用途明确选择且依赖可用时运行；疑难文件的云复核用阿里云 Qwen Audio 3.1 两款模型，不算进本地路线。

3. **交回文字、时间与疑点**　结果记录实际模型和完成层级。双路有分歧就给回听位置；对齐只给确认文案在声音中的词语时间，不证明文案本身正确。

::screen{#chinese-asr-models-modes-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 Registry（登记清单） 登记 6 个 Profile，直接转写闭集 5 个（10 月 11 日重读仍相同）；quick/strict 固定，重要录音 "
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 Registry（登记清单） 登记 6 个 Profile，直接转写闭集 5 个（10 月 11 日重读仍相同）；quick/strict 固定，重要录音 "
   },
   {
    "id": "module-technical-title",
    "text": "技术实现与依据"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 桌面听写只用原有 Qwen3-ASR-1.7B，不做双模型复核或自动润色，也没有更换或下载另一 ASR（自动语音识别） 模型；文件 quick/strict 默认角色维持。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 桌面听写只用原有 Qwen3-ASR-1.7B，不做双模型复核或自动润色，也没有更换或下载另一 ASR（自动语音识别） 模型；文件 quick/strict 默认角色维持。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/打勾清单.png",
   "key": "打勾清单",
   "source_phrase": "冻结页迁移固定图标：rules",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  }
 ]
}
```

## 技术实现与依据（一）

这里保留实现、关键条件、精确入口、历史记录和验证结果。

Registry（登记清单） 登记 6 个 Profile，直接转写闭集 5 个（10 月 11 日重读仍相同）；quick/strict 固定，重要录音 high_quality 显式选择；Whisper Large V3 仅 fallback（后备路线）/comparison、当前不可直接执行

## 关键规则与设计选择

1. 桌面听写只用原有 Qwen3-ASR-1.7B，不做双模型复核或自动润色，也没有更换或下载另一 ASR（自动语音识别） 模型；文件 quick/strict 默认角色维持。

2. 兼容依赖可由 AI 自主更新；新增或替换模型需要可靠、明确的中文效果、速度与兼容改进证据，不因新版本或宣传换模，没有定时模型下载服务。

3. 普通默认不因新模型安装而漂移。

4. quick 与 strict 的质量和成本边界明确；重要录音的 high_quality（FireRedASR2-LLM 主听、Qwen3-ASR 校验）只按用途显式选择，不改全局 strict、quick 或桌面听写。

5. 证据级、时间线和备用模型必须显式选择。

6. Registry（登记清单） 当前登记 6 个 Profile，但 list_transcription_engine_names 只返回 5 个可直接执行引擎；数量不能互相冒充，云模型也不算在内。

7. Whisper Large V3 是 fallback（后备路线）/comparison 设计记录，当前 pipeline 看到 is_whisper=true 会在模型加载前明确拒绝。

8. 每次结果记录实际引擎，而不是只记录模式名。

::screen{#chinese-asr-models-modes-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-06",
  "section": "tech",
  "title": "技术实现与依据（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "9. 模型失败影响状态和证据等级，不只影响一段错误文本。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "9. 模型失败影响状态和证据等级，不只影响一段错误文本。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（二）

9. 模型失败影响状态和证据等级，不只影响一段错误文本。

## 当前怎样实现

- configs/models.yaml 声明本地模型 id、适配器、版本、能力和设备要求；另有独立的 cloud_review 段登记两款 Qwen Audio 3.1 云模型（`qwen-audio-3.1-asr-flash`、`qwen-audio-3.1-asr-flash-message`）及只作 Legacy 后备的 3.0，云模型不计入本地 6 个 Profile。

- config.py 读取并验证模型配置；未知引擎直接失败。

- config.py 分开 list_engine_names（全部登记）与 list_transcription_engine_names（排除 is_whisper 的直接转写闭集）。

- pipeline.py 按 quick、strict、high_quality 和显式参数组织主/对照引擎；build_model 在加载前拒绝 is_whisper Profile。

- adapters 分离 Qwen、FunASR 与 FireRed 的运行差异。

- fun-asr-nano 使用 ModelScope hub、funasr-automodel、GPU 与 trust_remote_code=true，固定 revision 05201c46…；Paraformer 固定 v2.0.4，并显式携带 VAD（语音活动检测）/PUNC/CAM++ aliases。

- qwen_identity.py 对 Qwen runtime（运行环境） 与模型身份做精确约束。

::screen{#chinese-asr-models-modes-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-07",
  "section": "tech",
  "title": "技术实现与依据（三）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 解析模式和显式引擎参数。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 解析模式和显式引擎参数。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（三）

## 执行流程

1. 解析模式和显式引擎参数。

2. 从 Registry（登记清单） 取得精确 profile。

3. 检查 Profile 是否进入 direct transcription 闭集；Whisper registered-only 请求在加载前停止。

4. 检查依赖、权重、设备和输入能力。

5. 为主引擎和对照引擎创建独立原始输出。

6. 把实际身份和执行状态写入结果。

7. 交给仲裁与审计层生成正文和复核结论。

::screen{#chinese-asr-models-modes-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-08",
  "section": "tech",
  "title": "名词和入口",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  }
 },
 "images": []
}
```

## 名词和入口

## 本模块用到的名词

| 名词 | 意思 |
| --- | --- |
| Registry | 模型配置的唯一登记表，决定 id、角色、适配器和边界。 |
| primary engine（主引擎） | 严格模式主要正文候选的来源。 |
| secondary engine（对照引擎） | 独立转写同一输入，用于发现分歧和疑似幻觉。 |
| profile | 一个精确模型及其运行合同，不是模糊产品别名。 |
| registered-only profile（仅登记配置） | 为了记录备用/对照身份而保留在 Registry（登记清单），但当前没有直接转写执行路径；Whisper Large V3 属于这一类。 |

## 专业定义

把每个模型的身份、版本、能力与分工集中登记；日常快慢路线保持稳定，重要录音按用途点名更强的本地路线，新装更强模型也不会暗中改掉默认结果。

解决什么

解决模型配置漂移、默认路线暗改、同名模型版本不清、主/对照角色混乱，以及模型失败后仍被显示为完整双模型成功的问题。

::screen{#chinese-asr-models-modes-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-09",
  "section": "tech",
  "title": "出问题时（一）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "失败与恢复",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "失败与恢复",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons-r2/扳手.png",
   "key": "扳手",
   "source_phrase": "冻结页迁移固定图标：failure",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  }
 ]
}
```

## 出问题时（一）

解决什么

解决模型配置漂移、默认路线暗改、同名模型版本不清、主/对照角色混乱，以及模型失败后仍被显示为完整双模型成功的问题。

## 边界

- Fun-ASR-Nano、FireRed 和 Paraformer 可按各自显式路线执行但不会接管 quick/strict；FireRed 只在重要录音点名 high_quality 时担任主听。Whisper 仅登记为备用/对照，当前不能直接转写。

- Fun-ASR-Nano 精确身份为 FunAudioLLM/Fun-ASR-Nano-2512@05201c46f1c38592b1567f857c0d56eab3d0d8ef；Paraformer 精确身份为 iic/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-pytorch@v2.0.4。

- 模型安装成功不等于真实音频 E2E（端到端验证） 通过。

- 对照模型不是投票多数，也不自动证明主模型错误。

- 云模型与本地模型分属不同授权和证据边界：疑难文件在免费期内自动复核，整段直接上云或免费期外须显式同意；云模型不与本地 6 个登记 Profile、5 个直接执行引擎混算。

## 失败与恢复

- **未知模型或配置字段错误**：启动前失败并指出精确 profile，不选择相近模型。

::screen{#chinese-asr-models-modes-10 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-10",
  "section": "tech",
  "title": "出问题时（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **用户直接请求 Whisper Large V3**：返回 fallback（后备路线）/comparison only 的明确不可用结果；不加载模型、不生成假转写，也不静默改走另一个引擎。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **用户直接请求 Whisper Large V3**：返回 fallback（后备路线）/comparison only 的明确不可用结果；不加载模型、不生成假转写，也不静默改走另一个引擎。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons-r2/扳手.png",
   "key": "扳手",
   "source_phrase": "冻结页迁移固定图标：failure",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  }
 ]
}
```

## 出问题时（二）

- **用户直接请求 Whisper Large V3**：返回 fallback（后备路线）/comparison only 的明确不可用结果；不加载模型、不生成假转写，也不静默改走另一个引擎。

- **主引擎失败、对照成功**：保留对照文本但标为 provisional，并记录主引擎错误。

- **两路都失败**：输出听不清或失败状态，不生成貌似完整正文。

- **结果声明的模型与实际 runtime（运行环境） 不同**：证据回执验证失败，结果不能升级为 verified。

::screen{#chinese-asr-models-modes-11 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-11",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "上一个模块 入口与任务",
    "href": "/projects/chinese-asr/task-routing/"
   },
   {
    "text": "下一个模块 安装与恢复",
    "href": "/projects/chinese-asr/installation-recovery/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 模型 Registry（登记清单） 与默认角色",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 模型 Registry（登记清单） 与默认角色",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/数据库.png",
   "key": "数据库",
   "source_phrase": "冻结页迁移固定图标：sources",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  }
 ]
}
```

## 依据与来源（一）

## 真实入口

- 模型 Registry（登记清单） 与默认角色

- 配置加载与验证

- quick / strict 流水线

- Whisper fallback-only标记与直接转写闭集回归

- Qwen ASR（自动语音识别） 适配器

- SenseVoice、Paraformer 与 FunASR 适配

- FireRed 隔离 worker 适配

## 如何验证

- 2026-08-31 Doctor 枚举六个登记 Profile，并确认 FunASR、Qwen ASR（自动语音识别）、PyTorch 已安装；登记数量不等于可直接执行数量。

::screen{#chinese-asr-models-modes-12 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-models-modes-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 2026-10-11 重读配置与直接转写守卫：仍登记 6 个 Profile、直接转写闭集 5 个；test_config 验证 whisper-large-v3 带 is_whisper 且不进入该闭集，pipeline 在加载前拒绝它（本轮只读测试定义，未执行）。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 2026-10-11 重读配置与直接转写守卫：仍登记 6 个 Profile、直接转写闭集 5 个；test_config 验证 whisper-large-v3 带 is_whisper 且不进入该闭集，pipeline 在加载前拒绝它（本轮只读测试定义，未执行）。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/数据库.png",
   "key": "数据库",
   "source_phrase": "冻结页迁移固定图标：sources",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  }
 ]
}
```

## 依据与来源（二）

- 2026-10-11 重读配置与直接转写守卫：仍登记 6 个 Profile、直接转写闭集 5 个；test_config 验证 whisper-large-v3 带 is_whisper 且不进入该闭集，pipeline 在加载前拒绝它（本轮只读测试定义，未执行）。

- config、pipeline、Qwen identity、FireRed worker 等单元回归包含在 2026-08-31 的 345 项通过结果中；之后各次全量运行保留各自日期，不合并成新的全量通过。

- Registry（登记清单） 静态回读确认 Fun-ASR-Nano revision=05201c46…、Paraformer revision=v2.0.4、Qwen revision=a04930db…（runtime qwen-asr 0.0.6）、FireRed 源码 4e7d9aaf…/权重 2c5e0f41…。10 月 11 日本机 9 个模型目录合计 30,645,308,894 字节（约 28.54 GiB，含辅助模型、对齐器和目录里的源码/元数据/样例，不是 6 个引擎体积相加）；目录存在只算“在、未验证”，精确配置不冒充推理E2E（端到端验证）。

- 本次没有对六个 profile 分别运行真实录音，实际速度与准确率仍以具名 benchmark 为准。

## 与其他模块的关系

模型与模式模块声明要运行的精确 profile；安装与恢复模块负责让对应依赖、模型工件和隔离运行时可重建，入口、长音频、审计和说话人模块只能在这两层共同成立的能力范围内工作。
