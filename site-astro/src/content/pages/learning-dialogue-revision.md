---
{
 "title": "搜索以后继续交流，答案怎样被补查和修正",
 "kind": "project",
 "url": "/projects/learning/dialogue-revision/",
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
  "page": "learning-dialogue-revision",
  "kind": "project",
  "title": "搜索以后继续交流，答案怎样被补查和修正",
  "url": "/projects/learning/dialogue-revision/",
  "parent": "learning",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "方法规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲方法，不含任何个人反馈或课堂内容"
  }
 },
 "source": {
  "page": "sources/pages/learning-dialogue-revision/page.json",
  "sha256": "bd1d23a687497bf8218702225918577fb7fbcdffd38addda53ae0944264d28bc",
  "converted_at_beijing": "2026-10-11T19:07:11+08:00"
 }
}
---

::screen{#learning-dialogue-revision-01 section="top"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-01",
  "section": "top",
  "title": "搜索以后继续交流，答案怎样被补查和修正",
  "links": [
   {
    "text": "回到项目 → 学习方法",
    "href": "/projects/learning/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/learning/#ai-brief"
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
     "text_ref": "搜索以后继续交流，答案怎样被补查和修正",
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
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 方法规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲方法，不含任何个人反馈或课堂内容",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 学习方法〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "AI 协作学习 · 功能说明",
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
     "text_ref": "搜索以后继续交流，答案怎样被补查和修正",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 方法规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲方法，不含任何个人反馈或课堂内容"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 学习方法〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "AI 协作学习 · 功能说明"
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
   "asset": "_library/module-illustrations/learning/dialogue-revision-v01.png",
   "key": "main-learning",
   "source_phrase": "右上一幅水彩插画：一张书桌，摊开一本绿色封面的讲义（页面上只画浅灰短线，不画字），旁边一台笔记本电脑，屏幕上两个对话气泡（只画短线）；书桌后面的窗外是一座缓缓向上的绿色小山，一条由 28 块小石板铺成的小路蜿蜒上山，路边插着六面小三角旗，旗面分别写 A、B、C、D、M、P；第一块石板旁放着一双小鞋，表示还没出发。",
   "sha256": "e3636a59729724d422c2388d641dffa34a7fab1787c3857732bc9fad7e1b7da5",
   "status": "ready"
  }
 ]
}
```

# 搜索以后继续交流，答案怎样被补查和修正

〔回到项目 → 学习方法〕　〔复制 AI 续作说明〕

AI 协作学习 · 功能说明

我可以直接指出不贴合或不理解之处，AI 承担重新研究和解释责任，而不是要求我先证明它错了。

**当前情况：**按追问重新查证、主动说明重要纠正、确定要改时把受影响的材料一次改齐，都是现行做法（10 月 11 日核对方法规则）。没有这一篇的反馈时，下一篇可以先备草稿，但等反馈后才定稿交付。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#learning-dialogue-revision-02 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "module-product-title",
    "text": "这一步怎样帮助学习"
   },
   {
    "id": "project-reading-panel-product",
    "text": "这项功能怎样使用"
   },
   {
    "id": "module-product",
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
     "text_ref": "这一步怎样帮助学习",
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
     "text_ref": "这一步怎样帮助学习",
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

## 这一步怎样帮助学习

用途与实际影响

## 为什么需要它

第一次搜索可能漏前提，第一次讲法也可能有问题；如果 AI 只维护原答案，交流会退化成反复说服。反过来，一被质疑就改口也不对。

## 举个实际例子

我只说“感觉这里不对”。老师先用具体句子或例子找到我卡在哪：只是没讲明白就换个讲法，真错了就改内容，我的质疑不成立就直接讲清为什么。确定要改时，它把路线、已经交的讲义、后面的草稿、练习和题单里受影响的地方一次改齐，并在下一课开头先讲清哪里变了。

## 最后我会得到什么

得到一条可审计的修正链：什么触发复查、查了什么、为何改口或为何不改、哪些未知仍保留，以及是否值得继续。内部改稿不要求我重读或重答才能往下走。

::screen{#learning-dialogue-revision-03 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-03",
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
     "text_ref": "证据足够时",
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
     "text_ref": "证据足够时",
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

## 证据足够时

追问或反例被准确理解，补查结果和变化理由显式呈现；受影响的材料一次改齐。

## 遇到冲突时

AI 只重复原答案、静默改口、一被质疑就附和，或把异议记成理解差时，回到来源和前提重审。

## 暂时无法判断时

无法确认原话、来源或场景时先澄清一个必要问题，不扩大推断。

::screen{#learning-dialogue-revision-04 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-04",
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
     "text_ref": "1. **系统核对并处理**　分清事实变化、场景差异、前提遗漏和讲法问题，只补会影响答案的证据。",
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
     "text_ref": "1. **系统核对并处理**　分清事实变化、场景差异、前提遗漏和讲法问题，只补会影响答案的证据。",
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

指出哪里不贴合、不懂，或给一个现实反例。

## 需要准备什么

- 具体质疑

- 能改变判断的反例或资料

## 从开始到拿到结果

1. **系统核对并处理**　分清事实变化、场景差异、前提遗漏和讲法问题，只补会影响答案的证据。

2. **交付与接续**　主动说明原说法、新依据、现结论和影响；仍不足则保留未知或做最小验证。

::screen{#learning-dialogue-revision-05 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据（一）"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据（一）"
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
     "text_ref": "1. 回答包含当前结论、依据、有效时间、适用范围、未知和改变条件。",
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
     "text_ref": "1. 回答包含当前结论、依据、有效时间、适用范围、未知和改变条件。",
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

**10 月 11 日核对**　交流被视为判断输入，不是答案后的附加客服（方法规则 10 月 7 日版本）。沉默不触发正式交付，但允许提前备草稿。

## 关键规则与设计选择

1. 回答包含当前结论、依据、有效时间、适用范围、未知和改变条件。

2. 事实可能变化、来源冲突、用户给出反例或解释依赖假设时重新查证；质疑按证据判断，不因被质疑就自动改口。

3. 之前说错或讲错时明确承认，不能静默覆盖旧结论。

4. 后来发现会改变理解的重要修正时，即使用户没有重新打开材料，也要在对话中主动告知原内容、新结论、原因和影响；已讲过的说法变了，下一课开头先讲清。

5. 没有这一篇的反馈时记为“待反馈”，不推断理解、同意或掌握；下一篇可以先备草稿，等反馈后再定稿。

## AI现在怎样协助

- 把用户问题、反例和现实经验当作新证据候选，而不是标签化学习表现。

- 只问会改变当前判断的最少澄清问题，不把专业路线审核甩回给人。

- 确定要改时，用全文搜索找出受影响的现行路线、已交付讲义、后续草稿、配套练习、题单和抽问题，一次改齐；不另建追踪系统。

::screen{#learning-dialogue-revision-06 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-06",
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
     "text_ref": "- 补查后保留原判断与新判断的差异、依据和影响。",
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
     "text_ref": "- 补查后保留原判断与新判断的差异、依据和影响。",
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

- 补查后保留原判断与新判断的差异、依据和影响。

- 简要记下真实交付和反馈的摘要、日期、已成立处和待补处，供避免重复和恢复使用；课堂原话不另存原文，也没有常驻分数。

- 可随时暂停；恢复只读最小断点，不要求重讲已知事实。

## 这一步怎样进行

1. 听取追问、反例或不理解之处。

2. 用具体句子或例子定位：是事实变化、场景差异、前提遗漏、讲法问题，还是表达被误解。

3. 只读取会改变答案的资料并重新查证。

4. 说明原依据、新发现和结论变化（或为何不改）；要改就把受影响的材料一次改齐。

5. 技术对错和改法由老师直接定并说明理由；经历、目标、花钱、授权和对外动作由人决定继续、换方向或暂停。

::screen{#learning-dialogue-revision-07 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-07",
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
     "text_ref": "说法"
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
     "text_ref": "说法"
    }
   ]
  }
 },
 "images": []
}
```

## 名词和入口

## 这里会用到的说法

| 说法 | 意思 |
| --- | --- |
| formative feedback（形成性反馈） | 根据当前真实理解给出下一步线索和修正，而不是只报对错。 |
| adaptive scaffolding（自适应支架） | 按当前问题选择提示、例子或深度，而不是固定输出一整套内容。 |
| recourse（申诉与修正） | 人可以质疑 AI 判断，并获得可解释的复查和修改路径。 |

## 这一步说的是什么

每个回答都留下依据、范围、未知和改变条件；追问、反例与现实经验出现后，AI 可以重新搜索并明确改口，或讲清为何不改；改动在所有受影响材料里保持一致。

::screen{#learning-dialogue-revision-08 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-08",
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
     "text_ref": "- 交流自然不等于有效；诊断、补查和再次尝试才是关键。",
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
     "text_ref": "- 交流自然不等于有效；诊断、补查和再次尝试才是关键。",
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

避免什么问题

解决维护第一次回答、一被质疑就附和、把异议当错误、静默改口、只改一处留下前后矛盾、表达被误解和没有反馈却自动交付新课。

## 边界

- 交流自然不等于有效；诊断、补查和再次尝试才是关键。

- 不影响理解的排版或措辞修正可留在材料中；会改变概念、边界、取舍或下一步的修正必须主动通知。

- 课堂原话不另存原文，没有个人画像或长期掌握评分；只留必要的交付与反馈摘要。

- 技术对错、改法和教学深度由老师负责并说明理由；涉及人的真实情况、目标、花钱、授权和对外动作的取舍由人决定。

## 遇到问题时怎样处理

- **AI 重复同一答案**：停止改写措辞，检查来源、假设和场景是否需要重查。

- **用户表达可能被误解，或题目没给够条件、语音转错**：先核对原意；撤掉这次的错误归因，保留有效回答、质疑和已有进度。

- **补查后证据仍不足**：保留未知或转入有权人员／最小验证，不继续推测。

- **重要修正只写回讲义**：立即在对话中补充说明原内容、新结论、证据与影响；不能把重新阅读责任推给人。

::screen{#learning-dialogue-revision-09 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-dialogue-revision-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个方法节点 讲人话",
    "href": "/projects/learning/plain-language/"
   },
   {
    "text": "下一个方法节点 题目与验证",
    "href": "/projects/learning/questions-validation/"
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
     "text_ref": "- 形成性反馈总体效应、异质性和信息内容影响",
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
     "text_ref": "- 形成性反馈总体效应、异质性和信息内容影响",
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

## 参考与依据

- 形成性反馈总体效应、异质性和信息内容影响

- 反馈应建立在对当前理解的诊断之上

- 人类能动性、可检查和可覆盖的AI教育边界

## 怎样检查这一步没有跑偏

- 用来源冲突、现实反例、模糊反馈和识别异常场景检查是否选择正确处理。

- 修正必须能指出原依据、新证据、变化结论和未解决项，并且受影响材料已一起改。

- 不能用回复更长、更像人或更快来证明交流更有效。

## 和其他步骤怎样衔接

发现需要事实复核时回到来源模块；文字仍不足时把精确问题交给题目与验证模块。
