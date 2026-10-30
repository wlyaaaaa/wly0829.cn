---
{
 "title": "连续时间线、长音频断点续跑与文件夹批量",
 "kind": "project",
 "url": "/projects/chinese-asr/long-batch/",
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
  "page": "chinese-asr-long-batch",
  "kind": "project",
  "title": "连续时间线、长音频断点续跑与文件夹批量",
  "url": "/projects/chinese-asr/long-batch/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）的切片、续跑与批量配置和实现，于 10 月 11 日按 14:00 前状态只读核对，语义未变；本轮未执行任何模型。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-long-batch/page.json",
  "sha256": "9c70b4ee50896cfb3ef27fd25e912cc419ee126f005d3888008b85a01ffd8a2c",
  "converted_at_beijing": "2026-10-30T13:04:15+08:00"
 }
}
---

::screen{#chinese-asr-long-batch-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-01",
  "section": "top",
  "title": "连续时间线、长音频断点续跑与文件夹批量",
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
     "text_ref": "连续时间线、长音频断点续跑与文件夹批量",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的切片、续跑与批量配置和实现，于 10 月 11 日按 14:00 前状态只读核对，语义未变；本轮未执行任何模型。",
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
     "text_ref": "两小时录音跑到一半中断，不必把前面全部推倒重来；文件夹批量里即使有一个坏文件，其他已经完成的结果也不会跟着消失。我还能看见时间线有没有漏段，而不是只拿到一篇看似完整的长文。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有长录音分段续作和逐文件处理；公开短样例走通过两段，不代表两小时录音的质量已经验收。",
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
     "text_ref": "连续时间线、长音频断点续跑与文件夹批量",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）的切片、续跑与批量配置和实现，于 10 月 11 日按 14:00 前状态只读核对，语义未变；本轮未执行任何模型。"
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
     "text_ref": "两小时录音跑到一半中断，不必把前面全部推倒重来；文件夹批量里即使有一个坏文件，其他已经完成的结果也不会跟着消失。我还能看见时间线有没有漏段，而不是只拿到一篇看似完整的长文。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有长录音分段续作和逐文件处理；公开短样例走通过两段，不代表两小时录音的质量已经验收。"
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
   "asset": "_library/illustrations/modules/chinese-asr/long-batch/long-batch-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "926d7f670e795caa691d7e6d22c413e9679b348ec7fb7057cbba26c32283f9f1",
   "status": "ready"
  }
 ]
}
```

# 连续时间线、长音频断点续跑与文件夹批量

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

两小时录音跑到一半中断，不必把前面全部推倒重来；文件夹批量里即使有一个坏文件，其他已经完成的结果也不会跟着消失。我还能看见时间线有没有漏段，而不是只拿到一篇看似完整的长文。

**当前情况：**已有长录音分段续作和逐文件处理；公开短样例走通过两段，不代表两小时录音的质量已经验收。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-long-batch-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 一段过长的声音可能超过模型能一次处理的范围，随意切开又会断句或漏掉交界。逐段记录时间和完成状态，才能从中断处可靠继续。 ## 举个实际例子 比如我说“把这段两小时录音从中断处接着跑"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 一段过长的声音可能超过模型能一次处理的范围，随意切开又会断句或漏掉交界。逐段记录时间和完成状态，才能从中断处可靠继续。 ## 举个实际例子 比如我说“把这段两小时录音从中断处接着跑"
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

一段过长的声音可能超过模型能一次处理的范围，随意切开又会断句或漏掉交界。逐段记录时间和完成状态，才能从中断处可靠继续。

## 举个实际例子

比如我说“把这段两小时录音从中断处接着跑”。假设第 17 段失败，系统会保留前面已经通过和后续已成功的片段；修复原因后，它认准同一录音与配置，只补失效片段，再重新生成整体正文与覆盖证据，不把旧配置的片段混进来。

## 最后我会得到什么

交回连续录音哪些时间段已经完成、哪些还缺，及可以阅读的合并正文。只有时间覆盖和各段身份都核对完，才称整段完成。文件夹里以前已经批量转过的录音，之后可以按原音指纹找回那份稿和原来的质量结论，不必为了取稿再转一遍；找回的稿没有可用时间段时，会说明是缺时间，不等于没转过。

## 结果怎么看

## 正常时

每段都属于同一录音和设置、时间没有空洞时，交回完整合并结果。

## 发现问题时

个别段失败时保留其余成功内容和缺口，整段仍标为部分完成。

## 入口不可用或证据不足时

原音、时长或旧分段身份对不上时不拿旧结果拼接，先恢复正确任务。

::screen{#chinese-asr-long-batch-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-03",
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
     "text_ref": "提交长录音或明确文件夹，要求连续转写或批量处理。",
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
     "text_ref": "1. **系统核对并处理**　按原音时间连续分段，在同一身份下复用已验片段；坏文件单独记录，不拖掉其他完成结果。",
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
     "text_ref": "提交长录音或明确文件夹，要求连续转写或批量处理。"
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
     "text_ref": "1. **系统核对并处理**　按原音时间连续分段，在同一身份下复用已验片段；坏文件单独记录，不拖掉其他完成结果。",
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

提交长录音或明确文件夹，要求连续转写或批量处理。

只是想拿回以前批量转过的稿，按原音指纹取回即可，不用重新提交。

## 需要准备什么

- 要处理的长录音或文件夹范围

- 是否需要连续时间线与重要复核

## 从开始到拿到结果

1. **系统核对并处理**　按原音时间连续分段，在同一身份下复用已验片段；坏文件单独记录，不拖掉其他完成结果。

2. **交付与接续**　交回完成、漏段、失败和待续范围；一篇拼接长文不充当覆盖证明。

::screen{#chinese-asr-long-batch-04 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 VAD（语音活动检测） 边界、局部恢复与逐文件隔离已实现；来源已验 42 秒两片，未以此宣称两小时质量通过 ## 关键规则与设计选择 1. 续跑前验证输入、"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 VAD（语音活动检测） 边界、局部恢复与逐文件隔离已实现；来源已验 42 秒两片，未以此宣称两小时质量通过 ## 关键规则与设计选择 1. 续跑前验证输入、"
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
     "text_ref": "1. 续跑前验证输入、模型和分段计划是否相同。",
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
     "text_ref": "1. 续跑前验证输入、模型和分段计划是否相同。",
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

VAD（语音活动检测） 边界、局部恢复与逐文件隔离已实现；来源已验 42 秒两片，未以此宣称两小时质量通过

## 关键规则与设计选择

1. 续跑前验证输入、模型和分段计划是否相同。

2. 分段必须从 0 连续覆盖到音频结束。

3. 局部失败不会被整体成功状态吞掉。

4. 批量共享模型，不共享文件结果和错误。

5. 聚合负向结论要求所有 child 证据都闭合。

## 当前怎样实现

- long_audio.py 按 VAD（语音活动检测） 附近边界形成连续时间线；general quality 默认最长 60 秒、最短 20 秒、边界搜索 5 秒，FireRed 建议 35 秒、硬上限 40 秒且包含重叠，不删掉未检测到语音的原区间。

- arbitration.py 聚合双模型结果与分段风险。

- batch.py 复用 Qwen 批量输入能力并隔离失败项；短音频正常批处理，长文件转可恢复分段，坏文件不会吞掉邻居结果。每个文件另写一份 batch-item.json，记下原音 SHA-256 以及正文、objective 和 raw 结果的路径、大小与 SHA-256，供以后按原音指纹回读（512f443）。

::screen{#chinese-asr-long-batch-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-05",
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
     "text_ref": "- chunk overlap 可配置，但覆盖与边界必须进入结果证据。",
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
     "text_ref": "- chunk overlap 可配置，但覆盖与边界必须进入结果证据。",
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

- chunk overlap 可配置，但覆盖与边界必须进入结果证据。

- 复用绑定输入、模型锁、代码、配置与调用身份；单引擎失败保留 provisional 内容，但不作为完整 strict 缓存。只在文本与重叠音频时间共同支持时去重，不删除真实重复说话。

- transcript_readback 按原音指纹回读批量稿时，逐个核对 batch-item.json 引用文件的大小、SHA-256 和原音身份，对不上就拒收；回传的稿保留原质量，needs_review 和 conflict 照留，不因读到了稿就改成已核对。

## 执行流程

1. 读取音频总时长和目标模型上限。

::screen{#chinese-asr-long-batch-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-06",
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
     "text_ref": "2. 生成连续 chunk 与必要 overlap。",
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
     "text_ref": "2. 生成连续 chunk 与必要 overlap。",
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

2. 生成连续 chunk 与必要 overlap。

3. 写入任务 manifest（清单） 和每段预期身份。

4. 按顺序或受控队列运行每段主/对照引擎。

5. 失败时记录分段终态，不删除已完成内容。

6. 续跑时验证旧制品后只补缺失段。

7. 重新合并各段正文和审计，并检查 0 到结尾覆盖。

::screen{#chinese-asr-long-batch-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-07",
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
| chunk | 长音频中的连续时间区间，带开始、结束和输入身份。 |
| overlap（重叠） | 相邻分段共享的一小段音频，用于减少切断语句；聚合时必须去重。 |
| manifest | 分段计划、状态、模型与输出的唯一恢复清单。 |
| partial（部分完成） | 有可用分段，但整体覆盖或证据未闭合。 |

## 专业定义

长录音切成连续片段稳稳跑完并支持断点续作；批量转写复用已加载模型，但每个文件各算各的，坏一个不拖垮整批。

::screen{#chinese-asr-long-batch-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-08",
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

解决模型时长上限、长任务中断重做、切片交界漏字、旧分段错复用、批量重复加载模型，以及单个文件失败拖垮整个批次的问题。

## 边界

- 断点续跑只接受同一输入和配置身份。

- 成功分段不自动让整体任务变成成功。

- 重叠区不应在最终正文中重复。

- 批量模型复用不允许一个文件读取另一个文件的私人正文。

## 失败与恢复

- **某个 chunk 模型失败**：保留其他段，标出时间区间和引擎错误，整体降为 partial。

- **manifest（清单） 与当前输入不一致**：拒绝复用旧段，防止把另一文件或旧模型结果拼入。

- **时间线出现 gap 或越界**：客观覆盖验证失败，不得输出 no_speech_detected 或完整成功。

- **批量中的一个文件损坏**：该文件单独失败，其余文件继续并保留独立结果。

- **按原音指纹找批量稿却没有时间段**：返回 gap / timestamps_unavailable 并给出稿件路径，表示有稿、缺可回放的时间，不当成没转过，也不为此重转；真要逐句时间再另外补。

::screen{#chinese-asr-long-batch-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-long-batch-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 安装与恢复",
    "href": "/projects/chinese-asr/installation-recovery/"
   },
   {
    "text": "下一个模块 疑点与回听",
    "href": "/projects/chinese-asr/audit-evidence/"
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
     "text_ref": "- 分段、manifest（清单）、续跑和覆盖",
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
     "text_ref": "- 分段、manifest（清单）、续跑和覆盖",
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

- 分段、manifest（清单）、续跑和覆盖

- 分段和双模型合并（原来可选的大模型仲裁 10 月 20 日已删）

- 批量模型复用与逐文件隔离

- Windows 文件夹批量入口

- 长音频边界、恢复和覆盖回归

## 如何验证

- long_audio、arbitration、batch 进入2026-08-31 的 345 项通过的全量单测（arbitration 及其测试 10 月 20 日已删，这条只是历史）。

- 覆盖验证测试包含 gap、overlap、子证据和旧 manifest（清单） 身份场景。

- 9 月 17 日来源 42 秒两切片 FireRed+Qwen、Qwen 对齐与正常 API 有真实公开音频验收（10 月 11 日重读原始回执：42.039375 秒、两段与两次对齐均成功）；旧四切片结果保留历史，长篇个人录音与准确率仍未由本轮验证。

## 与其他模块的关系

本模块复用入口模块的 job（任务记录） 和模型模块的 profile；最终分段结果必须交给审计证据模块，涉及说话人时再交给归属模块。
