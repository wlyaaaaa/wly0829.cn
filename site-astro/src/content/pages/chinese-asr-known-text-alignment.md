---
{
 "title": "已有音频和确认文案，只找每个词在声音中的位置",
 "kind": "project",
 "url": "/projects/chinese-asr/known-text-alignment/",
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
  "page": "chinese-asr-known-text-alignment",
  "kind": "project",
  "title": "已有音频和确认文案，只找每个词在声音中的位置",
  "url": "/projects/chinese-asr/known-text-alignment/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）的对齐合同、配置与固定对齐模型文件，于 10 月 11 日按 14:00 前状态只读核对，语义未变；本轮未调用对齐。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-known-text-alignment/page.json",
  "sha256": "cd5cad89e0f4c8c1a7b7c4c24d61a9f881531ce83aaf9dc5fb556efa06c70ca9",
  "converted_at_beijing": "2026-10-11T18:50:42+08:00"
 }
}
---

::screen{#chinese-asr-known-text-alignment-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-01",
  "section": "top",
  "title": "已有音频和确认文案，只找每个词在声音中的位置",
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
     "text_ref": "已有音频和确认文案，只找每个词在声音中的位置",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的对齐合同、配置与固定对齐模型文件，于 10 月 11 日按 14:00 前状态只读核对，语义未变；本轮未调用对齐。",
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
     "text_ref": "我不用为改动画踩点再花一次配音费用，也不用让视频项目安装另一套语音识别。把一段现成音频和已确认文案交过来，就能取得词语出现的秒数，同时知道有没有漏对齐、来源有没有变。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有把确认文案对齐到音频的入口和公开音频验收；本轮只核对模型文件，没有重新执行，对齐也不验证文案真假。",
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
     "text_ref": "已有音频和确认文案，只找每个词在声音中的位置",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的对齐合同、配置与固定对齐模型文件，于 10 月 11 日按 14:00 前状态只读核对，语义未变；本轮未调用对齐。"
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
     "text_ref": "我不用为改动画踩点再花一次配音费用，也不用让视频项目安装另一套语音识别。把一段现成音频和已确认文案交过来，就能取得词语出现的秒数，同时知道有没有漏对齐、来源有没有变。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有把确认文案对齐到音频的入口和公开音频验收；本轮只核对模型文件，没有重新执行，对齐也不验证文案真假。"
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
   "asset": "_library/illustrations/modules/chinese-asr/known-text-alignment/known-text-alignment-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "1215a2df00fedaac9ce8cc8b4a496dba33ff38ba0928b97597653e229788dd16",
   "status": "ready"
  }
 ]
}
```

# 已有音频和确认文案，只找每个词在声音中的位置

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

我不用为改动画踩点再花一次配音费用，也不用让视频项目安装另一套语音识别。把一段现成音频和已确认文案交过来，就能取得词语出现的秒数，同时知道有没有漏对齐、来源有没有变。

**当前情况：**已有把确认文案对齐到音频的入口和公开音频验收；本轮只核对模型文件，没有重新执行，对齐也不验证文案真假。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-known-text-alignment-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 重新识别可能把已经确认的名字和措辞改掉，按字数平均分配时间又会错过停顿和语速变化。这里把“说了什么”的确认与“这句话在哪一秒”分开，只处理后一个问题。 ## 举个实际例子 “这段旁"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 重新识别可能把已经确认的名字和措辞改掉，按字数平均分配时间又会错过停顿和语速变化。这里把“说了什么”的确认与“这句话在哪一秒”分开，只处理后一个问题。 ## 举个实际例子 “这段旁"
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
  }
 ]
}
```

## 这项功能怎样使用

用途与实际影响

## 为什么需要它

重新识别可能把已经确认的名字和措辞改掉，按字数平均分配时间又会错过停顿和语速变化。这里把“说了什么”的确认与“这句话在哪一秒”分开，只处理后一个问题。

## 举个实际例子

“这段旁白已经满意，请给确认过的稿子标词语时间，别重新配音。”项目将原音与文案对齐，交回每个词从哪一秒到哪一秒；单段超过五分钟就按真实声音拆分，不能按文字长度猜时间。

## 最后我会得到什么

得到每个词在现成音频中的起止时间，附音频与文案的版本依据。覆盖不全或输入中途变化时保留旧结果；对齐成功仍不证明文案本身说得对。

::screen{#chinese-asr-known-text-alignment-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-03",
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

原音和文案对应、时间顺序与覆盖都核对后，交回完整词语时间轴。

## 发现问题时

词语漏对、秒数异常或输入变了时不覆盖旧成果，说明具体缺口。

## 入口不可用或证据不足时

模型或显卡不可用、任务取消或超时，只停本次对齐；不下载、不上传或改走听写。

::screen{#chinese-asr-known-text-alignment-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-04",
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
     "text_ref": "给已有音频和确认文案，要求标出逐词起止时间。",
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
     "text_ref": "1. **系统核对并处理**　核对输入对应后只按声音找词语时间，检查覆盖、顺序与输入是否变化，不重新判断文案真假。",
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
     "text_ref": "给已有音频和确认文案，要求标出逐词起止时间。"
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
     "text_ref": "1. **系统核对并处理**　核对输入对应后只按声音找词语时间，检查覆盖、顺序与输入是否变化，不重新判断文案真假。",
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

给已有音频和确认文案，要求标出逐词起止时间。

## 需要准备什么

- 现成音频

- 对应且已确认的文案

## 从开始到拿到结果

1. **系统核对并处理**　核对输入对应后只按声音找词语时间，检查覆盖、顺序与输入是否变化，不重新判断文案真假。

2. **交付与接续**　交回词语秒数及原件身份；超长、覆盖不全或模型不可用时保留旧输出。

::screen{#chinese-asr-known-text-alignment-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 固定对齐器与共享入口已实现，来源有公开音频验收；本轮只读确认工件存在，未运行模型 ## 关键规则与设计选择 1. 这个入口接收已给出的文字，不负责证明声音逐"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 固定对齐器与共享入口已实现，来源有公开音频验收；本轮只读确认工件存在，未运行模型 ## 关键规则与设计选择 1. 这个入口接收已给出的文字，不负责证明声音逐"
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
     "text_ref": "1. 这个入口接收已给出的文字，不负责证明声音逐字对应；重要内容仍要另行识别或人工核听。",
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
     "text_ref": "1. 这个入口接收已给出的文字，不负责证明声音逐字对应；重要内容仍要另行识别或人工核听。",
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

固定对齐器与共享入口已实现，来源有公开音频验收；本轮只读确认工件存在，未运行模型

## 关键规则与设计选择

1. 这个入口接收已给出的文字，不负责证明声音逐字对应；重要内容仍要另行识别或人工核听。

2. 单场最长 300 秒，超长按已审阅分镜拆分，不能按字符比例猜时间。

3. 默认 cuda:0 与既有GPU协调器；CPU必须显式 --device cpu，仍有子进程期限和清理。

4. 输出不能指向音频或文案原件；失败与取消不覆盖上份成功结果。

## 当前怎样实现

- 命令 python -B -m zh_asr alignment-info 只读配置与路径，不加载模型；align 接收一个音频、UTF-8 --text-file、--output 与 --timeout-sec。

- 当前 Qwen/Qwen3-ForcedAligner-0.6B 固定 revision=c7cbfc2048c462b0d63a45797104fc9db3ad62b7，模型位于 models/aligner 对应版本目录，artifact_lock=configs/model-locks/qwen3-forced-aligner-0.6b.json，runtime（运行环境） qwen-asr=0.0.6。

- 现有音频前处理在本任务临时目录转 PCM，沿用受监督可终止 worker 和 GPU 短租约，不建立新监听口、后台服务或双模型转写任务。

- 先核验模型及对齐覆盖/时间范围，写入前重新核对音频与文本 SHA-256；只有完整成功才原子替换输出。

::screen{#chinese-asr-known-text-alignment-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-06",
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
     "text_ref": "- fetch-aligner/verify-aligner 由既有 model_lifecycle 明确执行：只从不可变锁恢复缺文件，异常已安装字节不被重新生成哈希批准。",
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
     "text_ref": "- fetch-aligner/verify-aligner 由既有 model_lifecycle 明确执行：只从不可变锁恢复缺文件，异常已安装字节不被重新生成哈希批准。",
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

- fetch-aligner/verify-aligner 由既有 model_lifecycle 明确执行：只从不可变锁恢复缺文件，异常已安装字节不被重新生成哈希批准。

## 执行流程

1. 确认已经接受的文案和对应音频，单场不超过 300 秒。

2. 用 alignment-info 查看当前适配和工件；文件存在不等于此次推理通过。

3. 明确调用 align，取得原件指纹并在独立临时目录准备 PCM。

4. 核验固定模型，取得合法进程租约，执行有期限的对齐。

5. 核对覆盖、秒数和两份原件仍未变化，再原子交回 JSON。

6. 消费者按词轴做预览、动画或字幕，重要词句仍听音验收；失败保留旧成果。

::screen{#chinese-asr-known-text-alignment-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-07",
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
| forced alignment（强制对齐） | 给模型声音和已知文字，找文字的位置；不是重新识别，更不认证文字真伪。 |
| lexical_truth_verified=false | 这份结果没有证明词汇本身正确，哪怕覆盖完整、哈希一致、时间单调。 |
| 原子交付 | 完整结果先核对，最后一次替换目标；半成品、超时或被修改的输入不能覆盖旧成功文件。 |

## 专业定义

视频已经配好旁白，或手头已有确认文本时，只借用一个共享对齐器找踩点。它找位置，不证明稿子真的说对了。

::screen{#chinese-asr-known-text-alignment-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-08",
  "section": "tech",
  "title": "出问题时",
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
     "text_ref": "出问题时",
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
     "text_ref": "出问题时",
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

## 出问题时

解决什么

解决视频重复安装语音模型、只改时间却重新付费配音、按字数猜踩点，以及半份或错误来源时间轴覆盖已接受成果的问题。

## 边界

- 不重新生成配音、不启动双模型或桌面听写，不增加另一套模型清单。

- 不自动下载或升级权重、不上传音频，不把CPU当GPU失败后的静默退路。

- 对齐不替代Paraformer的匿名说话人分离，也不构成人物身份确认。

- 模型锁不是权重备份，完整新机恢复仍需相应依赖与模型工件。

## 失败与恢复

- **模型或权重缺失**：本次对齐不可用，按现有固定锁恢复流程处理；原音频、文案和旧词轴保持不变。

- **单场超过300秒**：明确拒绝，按审阅后的分镜切成真实音频段，不从文字长度伪造分段位置。

- **输入改变、覆盖不全或时间异常**：不替换输出，报告具体覆盖/身份问题并保留上次成功成果。

- **取消、超时或租约丢失**：终止本次受管worker与相关临时物，不自动重试或占用他人资源。

::screen{#chinese-asr-known-text-alignment-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-known-text-alignment-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 运行与边界",
    "href": "/projects/chinese-asr/runtime-privacy/"
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
     "text_ref": "依据与来源",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 输入、原子输出、词汇真值与300秒边界的当前产品合同",
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
     "text_ref": "依据与来源",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 输入、原子输出、词汇真值与300秒边界的当前产品合同",
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

## 依据与来源

## 真实入口

- 输入、原子输出、词汇真值与300秒边界的当前产品合同

- 对齐模型生命周期、固定锁、质量与实际验收分层

- 唯一模型、运行时、对齐目录和时长配置

## 如何验证

- 2026-09-18 21:30:47（北京时间）那次 alignment-info 为 read_only=true，返回固定Qwen对齐器目录、weights_present=true、max_audio_sec=300；未加载或重哈希权重。2026-10-11 只读核对：固定版本仍为 c7cbfc20…，8 项必要文件存在且大小吻合（声明 1,840,013,484 字节）；没有调用 alignment-info、align 或 verify-aligner，也没有重算权重哈希。

- 9月17日来源收尾记录真实公开音频Qwen3-ForcedAligner和文件流程验收通过；本轮没有重跑，也不把该短样例视作任意旁白零误差保证。

- 取消、输入变化、覆盖检查和进程清理的源码合同与真实音频证据分别成立，最终消费者仍需听音预览。

## 与其他模块的关系

本模块让 video-scaffold 等已有音频与确认文案的调用方复用 ChineseASR 对齐能力；模型、原件与时间证据留在此处，画面编排和最终成片验收仍归视频工程。
