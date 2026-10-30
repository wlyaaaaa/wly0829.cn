---
{
 "title": "录音文件入口与可恢复任务",
 "kind": "project",
 "url": "/projects/chinese-asr/task-routing/",
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
  "page": "chinese-asr-task-routing",
  "kind": "project",
  "title": "录音文件入口与可恢复任务",
  "url": "/projects/chinese-asr/task-routing/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）的本地任务服务与入口脚本，于 10 月 11 日按 14:00 前状态只读核对；服务健康取 10 月 11 日 13:33 记录，历史测试保留各自日期。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-task-routing/page.json",
  "sha256": "845081e10f7313ccfa23ba22015cec1056c4fc0aadf423a56643bafed7db4d1e",
  "converted_at_beijing": "2026-10-30T15:12:31+08:00"
 }
}
---

::screen{#chinese-asr-task-routing-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-01",
  "section": "top",
  "title": "录音文件入口与可恢复任务",
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
     "text_ref": "录音文件入口与可恢复任务",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的本地任务服务与入口脚本，于 10 月 11 日按 14:00 前状态只读核对；服务健康取 10 月 11 日 13:33 记录，历史测试保留各自日期。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
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
     "text_ref": "已有短语音、长录音或文件夹先返回稳定任务身份，后续按同一项查进度、恢复或取消，不因等待超时另开重复任务。本地转完若发现疑点，还会留下一笔“等 AI 接手云复核”的标记，本地稿照样先交。桌面听写有独立的小窗和输入流程，不进入这里的文件任务队列。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有录音任务提交、进度查询、取消与结果复用功能；任务历史写不进去时会先停收新任务，而不是假装成功。能否成功转写仍要看这份录音和本次实际结果。",
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
     "text_ref": "录音文件入口与可恢复任务",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的本地任务服务与入口脚本，于 10 月 11 日按 14:00 前状态只读核对；服务健康取 10 月 11 日 13:33 记录，历史测试保留各自日期。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
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
     "text_ref": "已有短语音、长录音或文件夹先返回稳定任务身份，后续按同一项查进度、恢复或取消，不因等待超时另开重复任务。本地转完若发现疑点，还会留下一笔“等 AI 接手云复核”的标记，本地稿照样先交。桌面听写有独立的小窗和输入流程，不进入这里的文件任务队列。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有录音任务提交、进度查询、取消与结果复用功能；任务历史写不进去时会先停收新任务，而不是假装成功。能否成功转写仍要看这份录音和本次实际结果。"
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
   "asset": "_library/illustrations/modules/chinese-asr/task-routing/task-routing-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "87594158fc48a6e00d19d522ef3460fc5968245040ffb7329f9f4d604123a74d",
   "status": "ready"
  }
 ]
}
```

# 录音文件入口与可恢复任务

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

已有短语音、长录音或文件夹先返回稳定任务身份，后续按同一项查进度、恢复或取消，不因等待超时另开重复任务。本地转完若发现疑点，还会留下一笔“等 AI 接手云复核”的标记，本地稿照样先交。桌面听写有独立的小窗和输入流程，不进入这里的文件任务队列。

**当前情况：**已有录音任务提交、进度查询、取消与结果复用功能；任务历史写不进去时会先停收新任务，而不是假装成功。能否成功转写仍要看这份录音和本次实际结果。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-task-routing-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 录音处理可能需要几分钟；如果一次等待结束就重交同一文件，会有两份任务抢资源、覆盖结果。项目先保存这次任务，再让人按原任务查进度。结果文件写出来了，也不代表这次任务记录已经安全存下，"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 录音处理可能需要几分钟；如果一次等待结束就重交同一文件，会有两份任务抢资源、覆盖结果。项目先保存这次任务，再让人按原任务查进度。结果文件写出来了，也不代表这次任务记录已经安全存下，"
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

录音处理可能需要几分钟；如果一次等待结束就重交同一文件，会有两份任务抢资源、覆盖结果。项目先保存这次任务，再让人按原任务查进度。结果文件写出来了，也不代表这次任务记录已经安全存下，两件事要分开看。

## 举个实际例子

比如我问“服务重启后，这段录音会不会自己重新跑？”系统会明确告诉我：原来排队或运行中的任务会留下“服务已重启”的失败终态，不会在后台偷偷复活。我确认需要继续后再显式重试，新任务仍按同一音频内容与请求指纹找到稳定输出目录，并复用长音频里已经验证有效的分段。

## 最后我会得到什么

得到这段录音当前在等、在跑、已完成还是失败，以及已经生成的文件和继续入口。服务重启不会偷偷重跑；本次等待超时也不代表底层任务已结束。本地标出疑点的文件另有云复核状态：已复核、等 AI 接手，或者没排上及原因。

## 正常时

录音和服务可用时返回一个可继续查询的任务，完成后交回正文及对应证据；有疑点时另留“等 AI 接手”的云复核提示。

## 发现问题时

等待结束时先查原任务；任务本身失败则保留真实错误和已完成部分。任务历史写不进去时，服务先拒收新任务、健康检查标成降级，直到写入恢复；模型跑完但终态存不下，不报告成功（结果文件可能已经在）。

## 入口不可用或证据不足时

音频、服务或指定模型无法启动时说明原因，不生成假任务，也不暗换另一模型。

::screen{#chinese-asr-task-routing-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-03",
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

录音和服务可用时返回一个可继续查询的任务，完成后交回正文及对应证据。

## 发现问题时

等待结束时先查原任务；任务本身失败则保留真实错误和已完成部分。

## 入口不可用或证据不足时

音频、服务或指定模型无法启动时说明原因，不生成假任务，也不暗换另一模型。

::screen{#chinese-asr-task-routing-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-04",
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
     "text_ref": "把已有录音文件交给 ChineseASR，并按同一任务查看进度。",
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
     "text_ref": "1. **系统核对并处理**　核对音频与请求，同一任务复用身份；短音频等待结果，长音频复用已验片段。",
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
     "text_ref": "把已有录音文件交给 ChineseASR，并按同一任务查看进度。"
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
     "text_ref": "1. **系统核对并处理**　核对音频与请求，同一任务复用身份；短音频等待结果，长音频复用已验片段。",
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

把已有录音文件交给 ChineseASR，并按同一任务查看进度。

## 需要准备什么

- 要转写的音频或文件夹

- 快看或重要复核等用途

## 从开始到拿到结果

1. **系统核对并处理**　核对音频与请求，同一任务复用身份；短音频等待结果，长音频复用已验片段。

2. **交付与接续**　交回状态和输出位置；本次等待结束不等于任务超时，服务重启后的失败须明确重试。本地成功不等于疑难云复核已完成，交接提示写不出时本地稿照样保留。

::screen{#chinese-asr-task-routing-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 文件 Smart API（智能任务接口）、任务生命周期和缓存完整性保留既有证据；已补任务历史写入失败时停收、本机请求检查和疑难云交接；真实转写仍按具体输入验"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 文件 Smart API（智能任务接口）、任务生命周期和缓存完整性保留既有证据；已补任务历史写入失败时停收、本机请求检查和疑难云交接；真实转写仍按具体输入验"
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
     "text_ref": "1. 先查询任务状态，再决定等待、恢复或重新提交。",
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
     "text_ref": "1. 先查询任务状态，再决定等待、恢复或重新提交。",
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

文件 Smart API（智能任务接口）、任务生命周期和缓存完整性保留既有证据；已补任务历史写入失败时停收、本机请求检查和疑难云交接；真实转写仍按具体输入验收

## 关键规则与设计选择

1. 先查询任务状态，再决定等待、恢复或重新提交。

2. request fingerprint（请求指纹）包含音频内容 SHA-256 与请求语义；只改修改时间不改变它，内容改变即使大小和时间相同也会改变它。

3. 相同输入和请求复用验证过的结果；输入内容、模型或请求身份改变时必须新建任务。

4. 客户端 Timeout（等待超时）与服务端失败分开表达；本地任务成功与疑难云复核完成也分开表达。

5. terminal（终态）任务写入持久历史，最多保留 200 条终态加活动/排队任务，裁剪不删转写输出；历史写不进去时拒收新任务。重启时未完成记录被标成 interrupted / service_restarted，不自动重新排队。

6. long-strict 失败或取消后的显式重试产生新 job（任务记录） id，但复用同一稳定输出目录，让 manifest（清单） 验证后只补缺失分段。

7. 取消、期限和租约丢失会回收完整子进程树。

8. 外部观察只返回有界状态，不公开私人正文或内部目录扫描结果。

## 当前怎样实现

::screen{#chinese-asr-task-routing-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-06",
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
     "text_ref": "- scripts/asr-smart.ps1 负责本地入口、轻量健康检查、提交和有界等待，并把云复核状态投影给调用方。",
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
     "text_ref": "- scripts/asr-smart.ps1 负责本地入口、轻量健康检查、提交和有界等待，并把云复核状态投影给调用方。",
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

- scripts/asr-smart.ps1 负责本地入口、轻量健康检查、提交和有界等待，并把云复核状态投影给调用方。

- src/zh_asr/service.py 维护 job（任务记录） 状态、队列、期限、状态查询与 observer projection；serve 只允许 127.0.0.1，HTTP Host 必须是本机，带 Origin 时必须同源，提交任务必须是 application/json。

- job（任务记录） key 绑定音频绝对路径、内容 SHA-256、模式、已解析引擎、模型配置、设备、切片参数和调用方绑定，缓存命中前验证关键制品。

- jobs.json 持久化有界任务历史（最多 200 条终态加活动/排队任务）；服务启动时保留已完成终态，把遗留 queued / running 记录转换为明确的 service_restarted 失败。历史写入失败时 /health 的 persistence.status=degraded、ready=false，拒收新任务直到后续写入恢复；模型命令完成但终态不能落盘时不报告 job 成功（9 月 24 日修复，666d06d）。

- long-strict 输出目录由稳定 request fingerprint 派生；失败或取消后的显式重试不会换目录，旧 manifest（清单） 和收据仍须重新验证。

- process_control.py 维护子进程树和终止边界，避免只结束父进程留下 GPU worker。

- 状态投影不反射调用方任意标识，也不暴露提示、音频或转写正文。

- 任务成功且有疑难证据时，service.py 写 cloud.review.json（pending_ai_session 和 next_command），由 AI 接手跑自动云复核，本地服务自己不上传。提示准备或写入失败时 cloud_review 记为 failed/cloud_review_not_scheduled，主本地结果照常保留；即使提示文件写不出，这条失败也随 jobs.json 保存、重启后可查；之后恢复的有效提示文件胜过旧失败记录，新旧按文件身份判断而不是只看时间（1014970、024a212、73fdfda）。

::screen{#chinese-asr-task-routing-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-07",
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
     "text_ref": "1. 规范并验证输入路径，计算输入身份和请求语义。",
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
     "text_ref": "1. 规范并验证输入路径，计算输入身份和请求语义。",
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

1. 规范并验证输入路径，计算输入身份和请求语义。

2. 检查服务健康和当前活跃任务，不以进程名代替 job（任务记录） 状态。

3. 计算 job（任务记录） key；命中已验证完成结果时返回 cache hit。

4. 未命中则先把新 job（任务记录） 写入持久任务历史（写不进就拒收），再启动对应 CLI（命令行工具） 子进程。

5. 调用方在 WaitSec 内轮询，超时只返回 job（任务记录） 身份。

6. 服务持续监管期限、取消和子进程退出。

7. 完成后校验输出并把 succeeded、failed、canceled 或 blocked 原子写入历史，写不进不报成功；有疑难证据时另写云复核交接提示，写不出也只把云复核记为失败，本地结果照常保留。

8. 若服务重启，回读终态供查询；遗留未完成记录只标 interrupted，不恢复执行，长音频必须由调用方显式重试后在稳定目录内续跑。

::screen{#chinese-asr-task-routing-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-08",
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
| Smart API | 把预检、任务提交、短等待和状态观察组合成一个稳定入口。 |
| job key | 绑定输入与请求语义的幂等键，防止同一重任务重复运行。 |
| request fingerprint（请求指纹） | 由音频内容 SHA-256、模型与请求参数等组成；不是只看文件大小或修改时间。 |
| terminal history（终态历史） | 把 succeeded、failed、canceled、blocked 等任务保存到 jobs.json 供重启后查询（最多 200 条终态加活动任务），但不把旧队列重新执行。 |
| stable recovery directory（稳定恢复目录） | long-strict 按请求指纹固定的输出目录；显式重试可验证并复用其中已完成分段。 |
| observer projection | 只返回上层决策所需状态，不暴露私人正文和内部实现细节。 |
| lease（租约） | 证明当前 worker 仍拥有任务的短时状态；丢失后不能继续写结果。 |

## 专业定义

已有录音把提交、查进度、取消、超时和服务重启后的续作收进同一任务入口，避免因为等得久就把一段大录音重复跑好几份；任务记录存不下时宁可停收，也不报假成功。

解决什么

解决重模型任务阻塞调用方、重复提交、任务身份丢失、缓存错配、调用端超时被误判为服务端失败、结果文件已在但任务记录没存下却报成功、可选的云复核交接失败连带丢掉本地稿，以及后台进程失联后无法恢复的问题。

::screen{#chinese-asr-task-routing-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-09",
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

解决重模型任务阻塞调用方、重复提交、任务身份丢失、缓存错配、调用端超时被误判为服务端失败，以及后台进程失联后无法恢复的问题。

## 边界

- 只监听 127.0.0.1；Host 必须是本机，带 Origin 时必须同源，提交任务必须是 application/json。这些只是本机防误用条件，不是带认证的远程服务。

- cache hit 只复用相同输入与请求的已验证制品。

- 调用端超时不自动复制任务。

- 状态接口不返回私人转写正文或声纹数据；本地服务自己从不上传，云复核只留交接提示给 AI。

## 失败与恢复

- **客户端等待超时**：返回 job（任务记录） id 和查询入口；先读任务状态，不立即重发。

- **服务在 queued 或 running 时重启**：持久记录转成 service_restarted 终态并注明自动重跑关闭；用户或调用方核对后才显式提交新的 job（任务记录）。

- **long-strict 失败或取消后重试**：创建新 job（任务记录） id，但复用同一 request fingerprint 对应的稳定输出目录；manifest（清单） 与收据验证通过的分段才跳过。

- **缓存文件缺失或指纹不一致**：缓存失效并重新执行，不返回部分旧结果。

::screen{#chinese-asr-task-routing-10 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-10",
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
     "text_ref": "- **worker 超期、取消或租约丢失**：结束任务进程树并记录终态，保留可安全恢复的任务证据。",
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
     "text_ref": "- **worker 超期、取消或租约丢失**：结束任务进程树并记录终态，保留可安全恢复的任务证据。",
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

- **worker 超期、取消或租约丢失**：结束任务进程树并记录终态，保留可安全恢复的任务证据。worker 自己先退出（不论退出码）后，显卡服务按设计回收租约，之后查不到租约（lease_not_found）算正常回收，不再盖掉真实错因：命令行保留 worker 的 stdout/stderr，服务失败记录保留 returncode、stdout_tail、stderr_tail，失败提示带退出码和报错末行，asr-smart.ps1 直接显示，能说出音频解码失败这类实际原因；只有运行中真丢租约才停掉 worker 并报租约丢失（10 月 28 日 8b6980c；本轮只读源码，未执行）。

- **服务端口被其他程序占用**：明确报告身份冲突，不结束未知进程也不抢端口。

- **任务历史写不进去**：健康检查标成 degraded、ready=false，拒收新任务；已跑完但终态存不下的任务不报成功，结果文件可能已经在，写入恢复后再继续。

- **云复核交接提示写不出**：本地结果照常交付，云复核记为 failed/cloud_review_not_scheduled 并随任务历史保存；之后补上有效提示即以新提示为准。

::screen{#chinese-asr-task-routing-11 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-task-routing-11",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 说话打字",
    "href": "/projects/chinese-asr/desktop-dictation/"
   },
   {
    "text": "下一个模块 模型与用途",
    "href": "/projects/chinese-asr/models-modes/"
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
     "text_ref": "- 日常智能提交、短等待、状态与云复核状态入口",
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
     "text_ref": "- 日常智能提交、短等待、状态与云复核状态入口",
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

- 日常智能提交、短等待、状态与云复核状态入口

- 异步 job（任务记录）、状态、期限、缓存、历史写入状态和 observer projection

- 子进程树生命周期与终止

- 服务、缓存、状态、本机请求检查和失败路径回归

## 如何验证

- 2026-08-31 的全量 345 项单元测试通过，其中 service、process control、observer projection 和 scripts 均进入回归；之后另有 9 月 17 日运行 482 项（1 跳过）、9 月 24 日运行 495 项（1 跳过）、9 月 29 日运行 531 项（20 跳过）的具名历史记录，各自保留日期。

- service 回归明确覆盖终态 jobs.json 持久化、遗留未完成任务转 service_restarted 且不自动重跑、long-strict 失败/取消后复用稳定目录，以及同大小同修改时间但内容不同仍产生不同 fingerprint；历史写入失败停收与本机请求检查另有 test_service.py、test_service_http_guard.py 的测试定义（本轮只读，未执行）。

- 2026-10-11 13:33 记录本机服务健康检查为 ok，当时没有记下历史写入状态字段，截至 14:00 没有它是否就绪的记录。

- 本次未运行真实 strict smoke，因此模块保持 mixed，不把单测冒充 E2E（端到端验证）。

## 与其他模块的关系

本模块决定任务是否被正确创建和监管；模型与模式模块决定跑什么，长音频模块决定怎样分段，审计模块决定怎样解释结果。
