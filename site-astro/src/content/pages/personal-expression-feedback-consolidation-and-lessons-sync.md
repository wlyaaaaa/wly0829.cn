---
{
 "title": "反馈怎样留到下次",
 "kind": "project",
 "url": "/projects/personal-expression/feedback-consolidation-and-lessons-sync/",
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
  "page": "personal-expression-feedback-consolidation-and-lessons-sync",
  "kind": "project",
  "title": "反馈怎样留到下次",
  "url": "/projects/personal-expression/feedback-consolidation-and-lessons-sync/",
  "parent": "personal-expression"
 },
 "source": {
  "page": "sources/pages/personal-expression-feedback-consolidation-and-lessons-sync/page.json",
  "sha256": "4bde6f1c32990a616dbd2bb9238b42842d18767b2f51af22e987df2d0d990815",
  "converted_at_beijing": "2026-10-31T04:34:16+08:00"
 }
}
---

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-01",
  "section": "top",
  "title": "反馈怎样留到下次",
  "links": [
   {
    "text": "回到项目 → 个人表达",
    "href": "/projects/personal-expression/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-expression/#ai-brief"
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
     "text_ref": "反馈怎样留到下次",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人表达〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "让明确而有价值的表达纠正能够在以后读取资料时用上，减少反复解释同一问题。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有先改当前结果、再保留有价值教训的流程；我在任何项目里提的表达反馈，都由当场的 AI 存进表达库，AI 还会定期回扫最近的对话补漏。后续任务是否真的采用仍需真实使用验证。",
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
     "text_ref": "反馈怎样留到下次",
     "align": "left",
     "size": "large"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人表达〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "让明确而有价值的表达纠正能够在以后读取资料时用上，减少反复解释同一问题。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有先改当前结果、再保留有价值教训的流程；我在任何项目里提的表达反馈，都由当场的 AI 存进表达库，AI 还会定期回扫最近的对话补漏。后续任务是否真的采用仍需真实使用验证。"
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
   "asset": "_library/illustrations/modules/personal-expression/feedback-consolidation-and-lessons-sync/feedback-consolidation-and-lessons-sync-v01.png",
   "key": "main-personal-expression",
   "source_phrase": "右上一幅水彩插画：左边一个对话气泡，里面一团乱线从左往右慢慢理成一条平直的绿线；中间一本翻开的小册子，夹着几枚绿色书签；右边一支钢笔搁在一张便签上，便签上方悬着三个空白的小标签牌，其中一个是亮绿色。",
   "sha256": "23f344a69df982324e8873790ea40ea05c2ba5a5e4f77c1b9f97a618581ef8f2",
   "status": "ready"
  }
 ]
}
```

# 反馈怎样留到下次

〔回到项目 → 个人表达〕　〔复制 AI 续作说明〕

个人表达与沟通支持 · 功能说明 · 已存档：10 月 31 日起项目不再维护，下面是存档前的样子

让明确而有价值的表达纠正能够在以后读取资料时用上，减少反复解释同一问题。

**当前情况：**已有先改当前结果、再保留有价值教训的流程；我在任何项目里提的表达反馈，都由当场的 AI 存进表达库，AI 还会定期回扫最近的对话补漏。后续任务是否真的采用仍需真实使用验证。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 只改当次回复会丢失教训；把每次评价都追加成规则，又容易把一个场景的偏好误当成所有情况的要求。需要留下具体问题和适用范围，而不是积累越来越长的禁词清单。 举个实际例子 “这句话在当前语境不合适，"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 只改当次回复会丢失教训；把每次评价都追加成规则，又容易把一个场景的偏好误当成所有情况的要求。需要留下具体问题和适用范围，而不是积累越来越长的禁词清单。 举个实际例子 “这句话在当前语境不合适，"
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

只改当次回复会丢失教训；把每次评价都追加成规则，又容易把一个场景的偏好误当成所有情况的要求。需要留下具体问题和适用范围，而不是积累越来越长的禁词清单。好几个项目都能改同一个表达库，也要防止一处的新内容把别处刚记下的覆盖掉。

## 举个实际例子

“这句话在当前语境不合适，改回我刚才说的意思。”不管我在哪个项目里说，当场的 AI 都先调整眼前稿件；若这条反馈对以后有用，就记录实际语境、本人指出的问题、当前改法和适用范围。若新句子是 AI 的建议，会保留这个区别，不将它冒充本人定稿；被我评价过的 AI 稿另存为对照。

## 最后我会得到什么

当前问题得到处理，有价值的教训进入对应指南；只有来源可靠、值得参考的本人文字或本人修订才补入样本。更新后校验并重读，确认下一次普通读取确实能带出变化。我不用管表达库是否完整，也不用逐条审维护细节；日常用法变了才告诉我。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-03",
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
     "text_ref": "正常完成时",
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
     "text_ref": "正常完成时",
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

## 正常完成时

先交付改好的当前内容，再说明实际合入了哪项有价值教训；校验和受影响方向回读完成。

## 发现问题时

本人评价、本人给出的改法和 AI 未获认可的建议分清；没有新价值就不加记录。新反馈和旧教训冲突时，看实际场景收窄范围或补例外，真正更正才改旧结论。

## 资料不可用时

三种结果分开说：资料锁着或不可写，就是没有保存；只在当前对话里记住了，不算长期资料已更新；已经写回并重读到变化，才算存好。本人明确只讨论时也不保存。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-04",
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
     "text_ref": "指出这次解释或草稿哪里不好，并希望下次避免同类问题；在哪个项目里说都可以。",
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
     "text_ref": "1. **系统核对并处理**　先改当前答复，再判断这条教训是否稳定有用；有价值时按原句小范围合入对应指南，只补不减，再校验读取。",
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
     "text_ref": "指出这次解释或草稿哪里不好，并希望下次避免同类问题；在哪个项目里说都可以。"
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
     "text_ref": "1. **系统核对并处理**　先改当前答复，再判断这条教训是否稳定有用；有价值时按原句小范围合入对应指南，只补不减，再校验读取。",
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

指出这次解释或草稿哪里不好，并希望下次避免同类问题；在哪个项目里说都可以。

## 需要准备什么

- 这次解释或草稿的具体问题

- 教训只适用于某个场景时的说明

## 从开始到拿到结果

1. **系统核对并处理**　先改当前答复，再判断这条教训是否稳定有用；有价值时按原句小范围合入对应指南，只补不减，再校验读取。

2. **交付与接续**　交回当前修订及实际保存结果；未保存或只在本轮改好时不声称长期已学会。之后的个人增量里，AI 回扫最近几天我的真实输入补漏，并逐项复核这段时间表达库的全部改动。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 流程与读取接口已具备，跨任务执行随真实使用验收 关键规则与设计选择 1 说明反馈进入 explain-to-me.md，代拟反馈进入 reply-guide.md，样本"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 流程与读取接口已具备，跨任务执行随真实使用验收 关键规则与设计选择 1 说明反馈进入 explain-to-me.md，代拟反馈进入 reply-guide.md，样本"
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
     "type": "prose",
     "text_ref": "这里保留实现、关键条件、精确入口、历史记录和验证结果。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 说明反馈进入 explain-to-me.md，代拟反馈进入 reply-guide.md，样本只收有来源的表达参考；被本人评价过的 AI 稿进入 reply-contrasts.jsonl，保留草稿、评价、反馈、教训和出处，与本人原话和本人修订分开，发出去了也不自动变成本人样本。",
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
     "type": "prose",
     "text_ref": "这里保留实现、关键条件、精确入口、历史记录和验证结果。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 说明反馈进入 explain-to-me.md，代拟反馈进入 reply-guide.md，样本只收有来源的表达参考；被本人评价过的 AI 稿进入 reply-contrasts.jsonl，保留草稿、评价、反馈、教训和出处，与本人原话和本人修订分开，发出去了也不自动变成本人样本。",
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

流程与读取接口已具备，跨任务执行随真实使用验收。现役资料是四份：说明指南、拟稿指南、本人样本、AI 稿对照。截至来源 cde9496（北京 10/21 15:36），私有快照目录 data-backup 被 66 次提交改动过（仓库共 83 次提交；3b12a803 时分别是 51、66 次）；9 月 29 日和 10 月 3 日都有真实的指南新增入库，10 月 21 日补入 33 条本人样本。有提交只说明保存流程产生了结果，不证明后续 AI 都主动用上、大合并流程已执行过或效果获本人认可。

## 关键规则与设计选择

1. 说明反馈进入 explain-to-me.md，代拟反馈进入 reply-guide.md，样本只收有来源的表达参考；被本人评价过的 AI 稿进入 reply-contrasts.jsonl，保留草稿、评价、反馈、教训和出处，与本人原话和本人修订分开，发出去了也不自动变成本人样本。

2. 同类教训合并，保留足够语境与适用范围，不把一个例子推成永久全场景偏好。

3. 标签格式检查和实际作者判断分开：程序无法识别一条被错误标成 self_message 的 AI 文字。样本和对照都必须写接收对象和关系，不知道就写 unknown，不猜。

4. 更新后在当前任务重新读取受影响资料，并在正常私有 Git 收口时同步备份。

5. 任何项目遇到表达反馈都当场改。小改先查同类（说明指南日常读取不带案例，查重前用 explain --with-cases 读全文）、按原句小范围修改，只补不减，保留原话、来源、语境和范围；真正的新反馈更正了旧做法，才改旧结论并补来源。多条重排不在当场做，避免把别的对话刚写入的内容整份覆盖或把旧限定改弱。

6. 回扫：做个人增量时，AI 读最近几天的真人输入（包括在 Claude 里中途说的话），排除子代理提示和 AI 转发、粘贴的内容，找出表达反馈，核对是否已经收进来，没收的合并并重读。不建后台或队列。

7. 增量复核：个人增量时逐项看上次以来 data-backup 的全部提交，两个方向一起查原意有没有变、方向放错、重复，或者混进了对人物的评价。

8. 大合并：先出方案，交独立审查逐条核对；写回前核对原件哈希，如果期间有新内容先并进来，再写回、校验、重读、快照、提交。本人不用逐条对照。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-06",
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
     "text_ref": "- 反馈处理是 AGENTS.md、docs/feedback-workflow.md 和两项技能交给当前 AI 的工作流程；expression.py 没有写入或反馈同步命令，没有后台、队列。",
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
     "text_ref": "- 反馈处理是 AGENTS.md、docs/feedback-workflow.md 和两项技能交给当前 AI 的工作流程；expression.py 没有写入或反馈同步命令，没有后台、队列。",
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

## 当前怎样实现

- 反馈处理是 AGENTS.md、docs/feedback-workflow.md 和两项技能交给当前 AI 的工作流程；expression.py 没有写入或反馈同步命令，没有后台、队列。

- read_samples 校验对象、唯一 id、作者与状态允许值、必要字段及非空文字列表；不核验事实归属或反馈含义。现役样本 78 条（10 月 22 日数）全部是 self_message/reference。

- read_contrasts 校验 AI 稿对照的格式：评价只能是认可、勉强接受或否定，否定必须有原因；对照走单独结构，不借 author/status 混进本人样本。

- available_samples 排除 AI 草稿，即便其 status 为 reference 也不进入正式参考；新建议不能仅靠改标签变成本人原话。

- compare_with_backup 让 validate 把现役文件和最近已提交的快照按文本对比，列出有差异的文件、不见了的带引号原话和记录 ID；现役文件整份不见了而快照里还有时，也列为差异并列出快照里的全部原话和记录（10 月 20 日起）；它只比文本，不判断语义。

## 执行流程

1. 先按反馈改当前回答或草稿

2. 区分所属方向、本人原话、本人修订、AI 建议与被评价的 AI 稿

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-07",
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
     "text_ref": "3. 先查同类，按原句小范围把有价值教训合入现行说明，只补不减",
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
     "text_ref": "3. 先查同类，按原句小范围把有价值教训合入现行说明，只补不减",
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

3. 先查同类，按原句小范围把有价值教训合入现行说明，只补不减

4. 必要时增补有来源的本人文字或修订

5. 校验并重读受影响方向，再同步既有私有备份

6. 个人增量时回扫最近几天的真人输入，补收漏掉的反馈

7. 逐项复核上次以来的全部快照提交；需要重排或大合并时先出方案、交独立审查，写回前核对原件哈希

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-08",
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
| 作者与状态 | author 记录本人原话、本人修订或 AI 草稿；status 记录参考、待定或退出参考。两类字段服务不同判断。 |
| 就地合并 | 修改现行相关说明、补充例外和范围；不为每次反馈新增一篇日志。 |
| 只补不减 | 当场的小改只增加或收窄，不删别处已有的内容、不改弱旧限定；真要更正旧结论要有新反馈作依据。 |
| 回扫 | 个人增量时回看最近几天的真人输入，找出当时没收进来的表达反馈并补收。 |
| 下一次能读到 | 文件已经编辑、校验且重新读取到变化；这仍不等于未来每个 AI 都会主动执行。 |

## 专业定义

保留反馈语境、合并同类教训，分清本人原话、本人修订、AI 建议和被评价的 AI 稿；任何项目都能当场改，靠只补不减和事后复核防止互相覆盖。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-09",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 不要求每次交流标注或审批，不为数量凑记录。",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 不要求每次交流标注或审批，不为数量凑记录。",
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

新旧反馈可能分别适用于不同情况。优先明确场景或例外；真正更正时才修改现行结论，历史由已有 Git 版本保留。几个项目同时在改时，靠只补不减、快照对比和逐项复核防止一处覆盖另一处。

## 边界

- 不要求每次交流标注或审批，不为数量凑记录。

- 不能可靠归属的文字不伪装成本人原话，AI 草稿被发送也不自动改变作者。

- 不建立反馈数据库、监听服务、队列或表达评分体系；回扫由做个人增量的 AI 完成。

## 失败与恢复

- **重复 id、非法作者或错误消息容器**：读取器拒绝该资料；CLI（命令行工具） 返回 unavailable，由当前维护者修正真实格式问题，不靠模型猜着修。

- **语义与已有教训冲突**：比较实际场景和来源，收窄范围、补例外或据真正更正更新结论；较大的调整走大合并的独立核对。

- **别的对话刚写入的内容可能被覆盖**：validate 和最近快照对比，列出不一致；当场只做小范围增补，重排等到有独立审查的大合并。

- **大合并期间原件变了**：写回前核对原件哈希，不一致就先把新内容并进来，再写回、校验、重读、提交。

- **本次更新未写入或缓存仍是旧内容**：明确未保存或重新读受影响文件，不能声称新教训已经带出。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-10 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-10",
  "section": "tech",
  "title": "依据与来源（一）",
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **AGENTS.md**：反馈处理的现有责任与顺序、多个项目都在改时的规则、个人增量回扫。",
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
     "text_ref": "- **AGENTS.md**：反馈处理的现有责任与顺序、多个项目都在改时的规则、个人增量回扫。",
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

- **AGENTS.md**：反馈处理的现有责任与顺序、多个项目都在改时的规则、个人增量回扫。

- **docs/feedback-workflow.md**：回扫、增量复核与大合并的步骤。

- **expression.py / read_samples / read_contrasts**：本人样本与 AI 稿对照的格式验证能力及局限。

- **expression.py / compare_with_backup**：现役文件和最近已提交快照的文本对比；不判断语义。

- **tests/test_expression.py**：作者标签、重复标识、错误形状和对照格式回归。

## 如何验证

- 6 项虚构回归包含错误记录对象与错误 messages 容器；格式错误不会被标为 valid，非对象记录按 unavailable 收束。这是 2026-09-22 14:51 快照（293a273）时的测试；现在测试文件有 27 个测试定义（10 月 22 日数）。没有取到当时的运行输出，本次也没有运行，不写成今天通过。

- 首次回扫在 2026-09-26 做过：发现 9 月 15 日到 25 日约 35 起表达反馈里只收进了 2 起；这是当时的结果，本次没有重新统计。

::screen{#personal-expression-feedback-consolidation-and-lessons-sync-11 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-feedback-consolidation-and-lessons-sync-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 替本人拟消息",
    "href": "/projects/personal-expression/reply-as-me/"
   },
   {
    "text": "下一个模块 语料与恢复",
    "href": "/projects/personal-expression/corpus-extension-and-private-recovery/"
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
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 原冻结页那次任务没有读取或写入私人反馈，这句保留为当时回执。",
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
     "text_ref": "- 原冻结页那次任务没有读取或写入私人反馈，这句保留为当时回执。",
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

- 原冻结页那次任务没有读取或写入私人反馈，这句保留为当时回执。

- 后续任务主动执行、大合并新流程实际跑通、长期稳定使用和本人认可分别等待真实结果，不用模拟试写证明。

## 与其他模块的关系

更新责任由处理真实事项的 AI 承担，本人不需要回到本项目另说保存；读取器不会监听其他对话或代替语义判断。
