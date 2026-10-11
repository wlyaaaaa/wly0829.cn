---
{
 "title": "拿到文字后，怎样知道读全了、读对了没有",
 "kind": "project",
 "url": "/projects/localocr/results-evidence/",
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
  "page": "localocr-results-evidence",
  "kind": "project",
  "title": "拿到文字后，怎样知道读全了、读对了没有",
  "url": "/projects/localocr/results-evidence/",
  "parent": "localocr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "LocalOCR 源码（截止前最后提交 50af3fa）、现役 9 月 24 日验收回执与任务登记字段计数，于 2026-10-11 16:30–16:48（北京时间）只读核对"
  }
 },
 "source": {
  "page": "sources/pages/localocr-results-evidence/page.json",
  "sha256": "7516a0fd71638a72ab2cf8a5251dd75bf14bd50d67ea450f144752040192816b",
  "converted_at_beijing": "2026-10-11T18:50:43+08:00"
 }
}
---

::screen{#localocr-results-evidence-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-01",
  "section": "top",
  "title": "拿到文字后，怎样知道读全了、读对了没有",
  "links": [
   {
    "text": "回到项目 → 本地文字识别",
    "href": "/projects/localocr/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/LocalOCR"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/localocr/#ai-brief"
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
     "text_ref": "拿到文字后，怎样知道读全了、读对了没有",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（截止前最后提交 50af3fa）、现役 9 月 24 日验收回执与任务登记字段计数，于 2026-10-11 16:30–16:48（北京时间）只读核对",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我既需要复制出来的文字，也需要知道它来自哪一页、哪里可能漏了、什么还不能判断。这个结果层把可读内容与检查依据一起交回来，使一份空白文件或看似很高的分数不会替我作错误结论。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有文字、结构、位置和质量说明的结果文件。实际使用里“说不准”和“无字”两类结论都已出现，截至 10 月 11 日 14:00 分别为 466 条和 3 条记录；空白或高分仍不能直接证明读全、读对。",
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
     "text_ref": "拿到文字后，怎样知道读全了、读对了没有",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（截止前最后提交 50af3fa）、现役 9 月 24 日验收回执与任务登记字段计数，于 2026-10-11 16:30–16:48（北京时间）只读核对"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我既需要复制出来的文字，也需要知道它来自哪一页、哪里可能漏了、什么还不能判断。这个结果层把可读内容与检查依据一起交回来，使一份空白文件或看似很高的分数不会替我作错误结论。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有文字、结构、位置和质量说明的结果文件。实际使用里“说不准”和“无字”两类结论都已出现，截至 10 月 11 日 14:00 分别为 466 条和 3 条记录；空白或高分仍不能直接证明读全、读对。"
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
   "asset": "_library/illustrations/modules/localocr/results-evidence/results-evidence-v01.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "4f1bf3e4605d4522bb59a69ba78b82280db87c04176951a19ff7d04ae1eaa0b3",
   "status": "ready"
  }
 ]
}
```

# 拿到文字后，怎样知道读全了、读对了没有

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

我既需要复制出来的文字，也需要知道它来自哪一页、哪里可能漏了、什么还不能判断。这个结果层把可读内容与检查依据一起交回来，使一份空白文件或看似很高的分数不会替我作错误结论。

**当前情况：**已有文字、结构、位置和质量说明的结果文件。实际使用里“说不准”和“无字”两类结论都已出现，截至 10 月 11 日 14:00 分别为 466 条和 3 条记录；空白或高分仍不能直接证明读全、读对。

项目现状截至 2026-10-11 14:00（北京时间），于同日 16:30–16:48 只读核对；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#localocr-results-evidence-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 模型可能没读出浅色小字，也可能只处理了部分页面；若最后只显示“成功”或“没有文字”，我会误用结果。这里先分清执行、覆盖、质量和文字检测，再说明各自证据，保留具体字符的复核责任。 #"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 模型可能没读出浅色小字，也可能只处理了部分页面；若最后只显示“成功”或“没有文字”，我会误用结果。这里先分清执行、覆盖、质量和文字检测，再说明各自证据，保留具体字符的复核责任。 #"
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

模型可能没读出浅色小字，也可能只处理了部分页面；若最后只显示“成功”或“没有文字”，我会误用结果。这里先分清执行、覆盖、质量和文字检测，再说明各自证据，保留具体字符的复核责任。

## 举个实际例子

我可以说：“识别分数很高，但这个型号最后一位我还是看不清。”系统会指出对应页面和区域，让我回到原图复核；若需要更正，会把更正单独记录，不改写原始识别结果。

## 最后我会得到什么

可以选便于复制的纯文字、便于看表格的排版文件，或带页码位置的结构化文件；另有说明告诉我是否读全、哪里不确定。关键字仍须对照原图。

::screen{#localocr-results-evidence-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-03",
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

内容、位置和质量说明都可读取，正式文件与输入身份一致。

## 发现问题时

低置信度、部分覆盖或关键字分歧如实保留；摘要帮助定位，不能抹掉原始错误。

## 入口不可用或证据不足时

缺少有效结果文件或证据绑定时不能宣称已验证；普通空结果保持无法判断。

::screen{#localocr-results-evidence-04 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-04",
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
     "text_ref": "拿到 LocalOCR 结果后，在同一 AI 任务中说出要核对的字段、页码或疑问。",
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
     "text_ref": "1. **先读结果状态**　分别看执行完成、覆盖页数、识别质量和空结果依据。",
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
     "text_ref": "拿到 LocalOCR 结果后，在同一 AI 任务中说出要核对的字段、页码或疑问。"
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
     "text_ref": "1. **先读结果状态**　分别看执行完成、覆盖页数、识别质量和空结果依据。",
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

拿到 LocalOCR 结果后，在同一 AI 任务中说出要核对的字段、页码或疑问。

## 需要准备什么

- 这次结果文件或任务标识

- 原图与关键字段

## 从开始到拿到结果

1. **先读结果状态**　分别看执行完成、覆盖页数、识别质量和空结果依据。

2. **对照原图定位**　按页和区域核对姓名、数字或浅色小字；必要更正独立记录。

3. **留下已确认与仍不确定的字**　交回原始识别、对照原图后的更正和未确认项；文件完整性检查或高分都不能代替关键字符复核。

::screen{#localocr-results-evidence-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 输出与客观状态合同已实现；实际记录中有字、说不准、无字三类结论都已出现 ### 关键规则与设计选择 1. 先看 display_summary（人话状态摘要"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 输出与客观状态合同已实现；实际记录中有字、说不准、无字三类结论都已出现 ### 关键规则与设计选择 1. 先看 display_summary（人话状态摘要"
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
     "text_ref": "1. 先看 display_summary（人话状态摘要），再读正文、坐标与客观文件。截至 10 月 11 日 14:00，有 15,545 条完成记录带这句摘要；它只是把已有客观字段翻成人话，不是另一个独立结论。",
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
     "text_ref": "1. 先看 display_summary（人话状态摘要），再读正文、坐标与客观文件。截至 10 月 11 日 14:00，有 15,545 条完成记录带这句摘要；它只是把已有客观字段翻成人话，不是另一个独立结论。",
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

输出与客观状态合同已实现；实际记录中有字、说不准、无字三类结论都已出现

### 关键规则与设计选择

1. 先看 display_summary（人话状态摘要），再读正文、坐标与客观文件。截至 10 月 11 日 14:00，有 15,545 条完成记录带这句摘要；它只是把已有客观字段翻成人话，不是另一个独立结论。

2. ok=true、空 TXT、空 blocks 或 cache_hit 都不能单独证明原图无字。

3. 原生视觉的场景解释和 OCR（光学字符识别）的精确文字证据独立保留，冲突时回查原图。

## 当前怎样实现

- outputs.py 输出按页 TXT、保留结构的 Markdown、含位置/顺序/类型的 JSON；display_summary 是对既有客观字段的确定性投影，不修改结论。

- objective_result.py 分开 execution.status、coverage.status、quality.status、objective_outcome 与 failure；文字检测结论只在 text_detected、no_text_detected、indeterminate 中选择。

- 生产者可以在独立检测证据成立时形成 no_text_detected；未保存时 evidence.verification_status 仍为 not_persisted。调用方只有在 completed、complete、sufficient、verified 及实际非空负向证据文件的字节和身份复验全部成立后，才采纳为已验证的持久结论或正式缓存；当前内置检测证据主要限于近乎均匀图片。

- 客观文件使用 media.objective-result.v1，复核 schema（数据结构）、size_bytes、SHA-256、原件、请求、模型、配置与所有正式输出绑定；旧式缺文件结果不能补猜成已验证。

- 输入快照、独立页/帧计数和实际运行身份约束结果提交；每页原子检查点只作部分证据。完整覆盖、无排除范围与独立负向证据全部成立才支持无字结论，图像均匀提示本身不够。

::screen{#localocr-results-evidence-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-06",
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
     "text_ref": "- 若独立视觉复核更正某个关键区域，更正单列绑定原始 source hash（原件指纹）和 rect（区域），不得覆盖 OCR（光学字符识别） 原始文件或冒充引擎自动结果。",
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
     "text_ref": "- 若独立视觉复核更正某个关键区域，更正单列绑定原始 source hash（原件指纹）和 rect（区域），不得覆盖 OCR（光学字符识别） 原始文件或冒充引擎自动结果。",
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

- 若独立视觉复核更正某个关键区域，更正单列绑定原始 source hash（原件指纹）和 rect（区域），不得覆盖 OCR（光学字符识别） 原始文件或冒充引擎自动结果。

## 执行流程

1. 先读摘要：执行到哪、覆盖怎样、是否低置信或增强。

2. 选择 TXT/Markdown/JSON 中适合下一步的文件。

3. 用页码与区域找到关键字，并核对同一原图。

4. 遇到空结果，检查独立负向证据，而不是只看文字长度。

5. 把确认、更正与未知分开，保留原始识别和实际输出路径。

::screen{#localocr-results-evidence-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-07",
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
| coverage（处理覆盖） | 本次实际页/帧是否全部处理，不是正文逐字完整。9 月 3 日采购表 1/1 页 complete 仍漏标题；9 月 17 日两页 VL 完整覆盖仍有“请/清”错字；9 月 24 日现役验收的两页 VL 案例同样 complete，字符错误率仍是 1.33%。 |
| quality（结果质量） | 依据当前证据判断是否足以解释结果；不能简单当作逐字准确率。结构块未提供可用置信度时可以保持 unknown（未验证），即使原始文字行有高分。 |
| indeterminate（无法确定） | 当前证据不能支持确定结论；失败、部分处理或普通空结果都不能伪装成无字。截至 10 月 11 日 14:00，有 466 条完成记录落在这一类。 |

## 专业定义

先看人话状态，再看正文和原图；空文本、低分与处理失败不是同一回事。

::screen{#localocr-results-evidence-08 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-08",
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

防止空结果被误报为无字、执行完成被误报为正确，以及手工更正覆盖了原始识别证据。

## 边界

- 内容正确性与字节完整性不同；哈希通过不证明文字或原件事实正确。

- 原始文字、结构化文件与另行复核更正保持独立。

- 识别到印章或姓名不证明真实性或人物身份。

## 失败与恢复

- **空 TXT 或空 blocks**：检查执行、覆盖、质量和独立证据；条件不全就保持 indeterminate。

- **模型平均分高但关键字有疑问**：回原图核对精确区域，不让平均值覆盖细小错误。

- **客观文件缺失、哈希或身份不一致**：拒绝正式复用或无字结论，保留错误与原件定位。

- **原件在处理过程中变化**：不提交旧结果；固定最终原件后再决定是否重新处理。

::screen{#localocr-results-evidence-09 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-09",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "下载 sample-table-actual.md",
    "href": "https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/releases/2h-20261007-bird-atlas/media/localocr/sample-table-actual.md"
   },
   {
    "text": "sample-table-actual.json",
    "href": "https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/releases/2h-20261007-bird-atlas/media/localocr/sample-table-actual.json"
   },
   {
    "text": "上一个模块 表格与版面",
    "href": "/projects/localocr/document-structure/"
   },
   {
    "text": "下一个模块 任务与复用",
    "href": "/projects/localocr/jobs-cache/"
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
     "text_ref": "- 内容文件与人话摘要",
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
     "text_ref": "- 内容文件与人话摘要",
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

- 内容文件与人话摘要

- 客观结果与负向证据

- 输入快照与提交检查

- 空结果、质量与证据回归

- 〔下载 sample-table-actual.md〕下载 2026 年 9 月 3 日真实 Markdown 原文件（UTF-8），保留表格与合计而未补写标题；这是历史可复核产物，不是当前版本复跑。

- 〔sample-table-actual.json〕9 月 3 日实际 JSON 原样副本，可核对 P0、被排除的标题及质量未知和页覆盖；与后来合成测试分开。

## 如何验证

- 源码审查确认人话摘要不改写客观结论，空结果条件与普通错误分开。

- 合成单元测试覆盖负向证据、损坏、缺失、低置信度和实际字节绑定；9 月 24 日现役验收的 9 个合成质量案例全部满足各自门槛。这些都不能替代原图人工复核。

::screen{#localocr-results-evidence-10 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-results-evidence-10",
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
     "text_ref": "- 截至 2026-10-11 14:00，16,074 条完成任务里有 15,665 条保存了文字检测结论：有字 15,196、说不准 466、无字 3，另有 409 条早期记录没有这个字段。完成任务数已排除项目样例和冒烟测试，但包含网站截图检查、图片压缩试验这类批量任务。这些是结果记录条数，不是原件数：三类分别涉及 14,261、446、1 份原件，同一原件的不同请求可能落在不同类别，不能相加。3 条“无字”是 9 月 29 日 20:12 到 20:21 对同一份原件的三次请求，只是机器登记的结论，没有人看图确认过。项目总览此前写的“274 份真实结果都是有字”只代表 9 月 28 日当时的统计，不是现在的情况。重要数字和小字仍须由真实样本逐区复看，没有复看的部分不能声称已经确认。",
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
     "text_ref": "- 截至 2026-10-11 14:00，16,074 条完成任务里有 15,665 条保存了文字检测结论：有字 15,196、说不准 466、无字 3，另有 409 条早期记录没有这个字段。完成任务数已排除项目样例和冒烟测试，但包含网站截图检查、图片压缩试验这类批量任务。这些是结果记录条数，不是原件数：三类分别涉及 14,261、446、1 份原件，同一原件的不同请求可能落在不同类别，不能相加。3 条“无字”是 9 月 29 日 20:12 到 20:21 对同一份原件的三次请求，只是机器登记的结论，没有人看图确认过。项目总览此前写的“274 份真实结果都是有字”只代表 9 月 28 日当时的统计，不是现在的情况。重要数字和小字仍须由真实样本逐区复看，没有复看的部分不能声称已经确认。",
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

- 截至 2026-10-11 14:00，16,074 条完成任务里有 15,665 条保存了文字检测结论：有字 15,196、说不准 466、无字 3，另有 409 条早期记录没有这个字段。完成任务数已排除项目样例和冒烟测试，但包含网站截图检查、图片压缩试验这类批量任务。这些是结果记录条数，不是原件数：三类分别涉及 14,261、446、1 份原件，同一原件的不同请求可能落在不同类别，不能相加。3 条“无字”是 9 月 29 日 20:12 到 20:21 对同一份原件的三次请求，只是机器登记的结论，没有人看图确认过。项目总览此前写的“274 份真实结果都是有字”只代表 9 月 28 日当时的统计，不是现在的情况。重要数字和小字仍须由真实样本逐区复看，没有复看的部分不能声称已经确认。

## 与其他模块的关系

这个模块解释结果能信到哪；任务复用模块据同一合同检查缓存，下游材料与文档工具只消费明确有效的内容。
