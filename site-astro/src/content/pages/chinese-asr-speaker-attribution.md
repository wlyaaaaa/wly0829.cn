---
{
 "title": "区分不同声音，并允许以后纠正归属",
 "kind": "project",
 "url": "/projects/chinese-asr/speaker-attribution/",
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
  "page": "chinese-asr-speaker-attribution",
  "kind": "project",
  "title": "区分不同声音，并允许以后纠正归属",
  "url": "/projects/chinese-asr/speaker-attribution/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）的说话人分段、本人声音线索规则与配置，于 10 月 11 日按 14:00 前状态只读核对；未读取私人声纹档案或录音。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-speaker-attribution/page.json",
  "sha256": "a1451bcbcb4d699285e8724a5512ebb20c0d9e4814bde11a2925524a4202642c",
  "converted_at_beijing": "2026-10-30T15:12:31+08:00"
 }
}
---

::screen{#chinese-asr-speaker-attribution-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-01",
  "section": "top",
  "title": "区分不同声音，并允许以后纠正归属",
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
     "text_ref": "区分不同声音，并允许以后纠正归属",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的说话人分段、本人声音线索规则与配置，于 10 月 11 日按 14:00 前状态只读核对；未读取私人声纹档案或录音。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
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
     "text_ref": "把不同声音的发言按时间组织，帮助阅读多人讨论；匿名分组与本人明确确认的归属分开，错误归属可撤回。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有匿名声音分组和可撤回归属线索；当前证据仍是推断，不能证明说话人的真实身份。",
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
     "text_ref": "区分不同声音，并允许以后纠正归属",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的说话人分段、本人声音线索规则与配置，于 10 月 11 日按 14:00 前状态只读核对；未读取私人声纹档案或录音。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
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
     "text_ref": "把不同声音的发言按时间组织，帮助阅读多人讨论；匿名分组与本人明确确认的归属分开，错误归属可撤回。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有匿名声音分组和可撤回归属线索；当前证据仍是推断，不能证明说话人的真实身份。"
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
   "asset": "_library/illustrations/modules/chinese-asr/speaker-attribution/speaker-attribution-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "7bfe288eaa13b9cbc288e9f767f5d34106eff36f3e3a374c007c0890e313895f",
   "status": "ready"
  }
 ]
}
```

# 区分不同声音，并允许以后纠正归属

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

把不同声音的发言按时间组织，帮助阅读多人讨论；匿名分组与本人明确确认的归属分开，错误归属可撤回。

**当前情况：**已有匿名声音分组和可撤回归属线索；当前证据仍是推断，不能证明说话人的真实身份。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-speaker-attribution-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 不同声音的分组不能告诉人名；同一个人换麦克风或环境，声音特征也会变。要把匿名发言、声音线索和现实归属分开。 ## 举个实际例子 “把会议按不同发言人分段，先叫说话人1、2，不要猜你"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 不同声音的分组不能告诉人名；同一个人换麦克风或环境，声音特征也会变。要把匿名发言、声音线索和现实归属分开。 ## 举个实际例子 “把会议按不同发言人分段，先叫说话人1、2，不要猜你"
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

不同声音的分组不能告诉人名；同一个人换麦克风或环境，声音特征也会变。要把匿名发言、声音线索和现实归属分开。

## 举个实际例子

“把会议按不同发言人分段，先叫说话人1、2，不要猜你不知道的名字。”系统给匿名声音分组和相应文字，后续明确修正只影响已指定的归属。如果我确知是两个人打电话，可以直接告诉它“两个人”，它就按两组来分；不说就自动判断分几组。

## 最后我会得到什么

得到分段时间线、匿名声音组和有来源的归属记录；不是自动识别人名或证明身份。告诉它的人数只决定分几组，也可能把一个人拆开或把两个人并在一起，不代表认出了谁。

## 正常时

能确定声音片段和可靠上下文时，交回带理由、允许纠正的暂定归属；匿名分组仍保留。要判断哪几句是我说的、而现有的“我的声音参考”还没确认过时，会在那次需要时请我听一下参考样本确认；平时不主动打扰。

## 发现问题时

声音线索和聊天语境不一致时说明各自依据，不能只靠一个相似分数猜姓名。

## 入口不可用或证据不足时

时间段或来源证据不能对应原音时只保留匿名组，无法确定的人保持未知。

::screen{#chinese-asr-speaker-attribution-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-03",
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

能确定声音片段和可靠上下文时，交回带理由、允许纠正的暂定归属；匿名分组仍保留。

## 发现问题时

声音线索和聊天语境不一致时说明各自依据，不能只靠一个相似分数猜姓名。

## 入口不可用或证据不足时

时间段或来源证据不能对应原音时只保留匿名组，无法确定的人保持未知。

::screen{#chinese-asr-speaker-attribution-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-04",
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
     "text_ref": "多人录音要求区分发言段；标本人时再明确提出。",
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
     "text_ref": "1. **系统核对并处理**　先把不同声音按时间组成匿名组，真实身份另取证；相似声音不等于本人已确认。",
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
     "text_ref": "多人录音要求区分发言段；标本人时再明确提出。"
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
     "text_ref": "1. **系统核对并处理**　先把不同声音按时间组成匿名组，真实身份另取证；相似声音不等于本人已确认。",
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

多人录音要求区分发言段；标本人时再明确提出。

## 需要准备什么

- 要区分发言人的录音（确知几个人时可一并说明，不是必填）

- 是否还要判断其中有无本人（如需要）

## 从开始到拿到结果

1. **系统核对并处理**　先把不同声音按时间组成匿名组，真实身份另取证；相似声音不等于本人已确认。

2. **交付与接续**　交回分组与不确定性；证据不足保持匿名，后来纠正可撤回归属。

::screen{#chinese-asr-speaker-attribution-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 说话人投影与 2–3 来源本人档案单测通过；它仍是推断线索，不是身份认证 ## 关键规则与设计选择 1. Speaker 编号永远不是人物姓名。 2. 同原"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 说话人投影与 2–3 来源本人档案单测通过；它仍是推断线索，不是身份认证 ## 关键规则与设计选择 1. Speaker 编号永远不是人物姓名。 2. 同原"
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
     "text_ref": "1. Speaker 编号永远不是人物姓名。",
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
     "text_ref": "1. Speaker 编号永远不是人物姓名。",
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

说话人投影与 2–3 来源本人档案单测通过；它仍是推断线索，不是身份认证

## 关键规则与设计选择

1. Speaker 编号永远不是人物姓名。

2. 同原件 enrollment 不参与对外自证。

3. 本人 profile 只允许一个当前版本，替换后旧证据失效。

4. 单声道混音使用更宽风险带。

5. 有具体理由且彼此一致的上下文可暂时压过相反声学线索，必须同时保留反对依据并说明原因，结论仍为 inferred。

6. 无法消解的冲突、零长度时间或缺少时间戳时保持 unknown（未验证）；不能把所有声学冲突一律写成不可归属。

## 当前怎样实现

- Paraformer 可输出逐句时间和 CAM++ 匿名聚类。单文件 transcribe 在调用方确知人数时可显式传 --preset-spk-num N，结果记录分组方式是 automatic 还是 preset；省略则自动聚类。这个参数只在 Paraformer 单文件路径接受，其他引擎和 quick/strict/batch 路径不接受也不传递。

- Paraformer 固定 `iic/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-pytorch@v2.0.4`；按需 person:self speaker verification 固定 CAM++ model revision v1.0.0、文件 campplus_cn_common.bin、阈值 0.31。

::screen{#chinese-asr-speaker-attribution-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-06",
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
     "text_ref": "- speaker_evidence.py 建立唯一、私有、可替换的 person:self profile，并区分 enrollment 与 held-out。",
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
     "text_ref": "- speaker_evidence.py 建立唯一、私有、可替换的 person:self profile，并区分 enrollment 与 held-out。",
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

- speaker_evidence.py 建立唯一、私有、可替换的 person:self profile，并区分 enrollment 与 held-out。

- 多参考模式只接受 2–3 个不同来源，生成有界质心而不是无限画像库。

- speaker_attribution.py 组合声学、声道、联系人、角色和句义依据；方向一致可给 inferred，方向冲突时仅在 contextual roles 唯一且有具体理由时采用上下文，否则 unknown（未验证）。一般歧义带 ±0.02，单声道混音放宽到 ±0.04。

- profile 指纹进入证据；删除或替换后旧声学证据不再参与归属。

## 执行流程

1. 取得带时间位置的匿名说话人片段。

2. 按需加载当前 person:self profile，不扫描媒体库。

::screen{#chinese-asr-speaker-attribution-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-07",
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
     "text_ref": "3. 判断当前片段是否与 enrollment 同源。",
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
     "text_ref": "3. 判断当前片段是否与 enrollment 同源。",
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

3. 判断当前片段是否与 enrollment 同源。

4. 计算声学分数和歧义带。

5. 合并调用方提供的声道、联系人、对话角色和句义依据。

6. 记录支持、反对与未知。

7. 输出可解释的 inferred 或 unknown（未验证）；使用声纹证据时另绑定当前 profile 指纹。

::screen{#chinese-asr-speaker-attribution-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-08",
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
| diarization | 把声音聚成匿名说话人；它回答“声音是否像不同人”，不回答姓名。 |
| person:self | 本机唯一、可替换的本人声纹线索档案。 |
| held-out | 来自另一原件的留出样本，用于避免同源自证。 |
| ambiguity band（歧义带） | 阈值附近不稳定的分数范围，落入时不做确定归属。 |

## 专业定义

先把不同声音匿名分开，再结合声道、声纹、联系人和上下文做有理由、可撤销的本人推断；证据打架时就保留未知。

::screen{#chinese-asr-speaker-attribution-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-09",
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

解决匿名聚类被误当身份、拿同一录音建立和验证声纹、profile 撤销后旧结论继续有效、单声道边界分数强行归属，以及不同证据冲突却没有解释的问题。

## 边界

- 只处理具名录音任务，不扫描整个个人媒体库。

- 声纹向量和私人上下文永不进入公开仓库或网页。

- 归属是可撤销推断，不是生物识别认证；预设人数也只控制分几组，不认证任何人的身份。

- 不能识别其他未知人物，也不建设中央人脸/声纹服务。

## 失败与恢复

- **只有 Speaker 编号**：保持匿名，不映射真实姓名。

- **profile 已撤销或指纹变化**：旧声学证据失效，其他独立上下文证据单独保留。

- **单声道混音分数接近阈值**：该分数进入更宽歧义带，不单独支持归属；仍可使用其他具体、有效的上下文，全部依据不足时才 unknown（未验证）。

- **声学与具体上下文冲突**：同时记录两侧证据；只有上下文本身具体且一致时才说明为何暂时压过声学，并标为可撤销 inferred，否则 unknown（未验证）。

::screen{#chinese-asr-speaker-attribution-10 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-speaker-attribution-10",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 疑点与回听",
    "href": "/projects/chinese-asr/audit-evidence/"
   },
   {
    "text": "下一个模块 运行与边界",
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
     "text_ref": "- person:self profile、留出证据和撤销",
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
     "text_ref": "- person:self profile、留出证据和撤销",
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

- person:self profile、留出证据和撤销

- 上下文与声学证据组合投影

- profile、同源、留出和撤销回归

- 双声道、单声道、时间线和冲突回归

## 如何验证

- speaker evidence 与 attribution 回归包含在2026-08-31 的 345 项全量通过结果中；之后各次全量运行保留各自日期，不合并成新的全量通过。

- configs/models.yaml 静态回读（2026-10-11）确认 Paraformer revision=v2.0.4、CAM++ speaker verification revision=v1.0.0、threshold=0.31；本轮未加载真实私人 profile，也未把阈值冒充身份认证。

- fixtures 覆盖双声道、单声道 unknown（未验证）、无时间戳、零长度时间和冲突证据；另有具体对话理由覆盖弱声纹反证、单声道歧义分数仍可由上下文判断，以及上下文本身冲突必须 unknown（未验证） 的用例。

- 本次没有读取任何私人声纹档案或录音，也没有执行人物身份判断。现有本人声音参考仍是推断、可替换，没有经本人听参考样本确认；按现行规则，下次确实需要判断本人声音时再安排本人确认，代码单测不能代替这一步。

## 与其他模块的关系

本模块消费模型或 Paraformer 的时间线和审计结果；它只增加可解释人物线索，不能提高原转写文本本身的准确性。
