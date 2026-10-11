---
{
 "title": "怎样把专业资料讲明白，而不是删掉细节",
 "kind": "project",
 "url": "/projects/learning/plain-language/",
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
  "page": "learning-plain-language",
  "kind": "project",
  "title": "怎样把专业资料讲明白，而不是删掉细节",
  "url": "/projects/learning/plain-language/",
  "parent": "learning",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "方法规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲方法，不含任何讲义原文或个人学习内容"
  }
 },
 "source": {
  "page": "sources/pages/learning-plain-language/page.json",
  "sha256": "c4989bec6896508b3ec5db83a8f45d22c576bee972e58ebf05cf125d4bb62c67",
  "converted_at_beijing": "2026-10-11T19:07:11+08:00"
 }
}
---

::screen{#learning-plain-language-01 section="top"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-01",
  "section": "top",
  "title": "怎样把专业资料讲明白，而不是删掉细节",
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
     "text_ref": "怎样把专业资料讲明白，而不是删掉细节",
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
     "static_note": "截至 10 月 11 日 · 方法规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲方法，不含任何讲义原文或个人学习内容",
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
     "text_ref": "怎样把专业资料讲明白，而不是删掉细节",
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
     "static_note": "截至 10 月 11 日 · 方法规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲方法，不含任何讲义原文或个人学习内容"
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
   "asset": "_library/module-illustrations/learning/plain-language-v01.png",
   "key": "main-learning",
   "source_phrase": "右上一幅水彩插画：一张书桌，摊开一本绿色封面的讲义（页面上只画浅灰短线，不画字），旁边一台笔记本电脑，屏幕上两个对话气泡（只画短线）；书桌后面的窗外是一座缓缓向上的绿色小山，一条由 28 块小石板铺成的小路蜿蜒上山，路边插着六面小三角旗，旗面分别写 A、B、C、D、M、P；第一块石板旁放着一双小鞋，表示还没出发。",
   "sha256": "604f1f68fc621b3ef4bded0b2db3e49f0cdc2332fc96b89ea3b7b947e7f4475c",
   "status": "ready"
  }
 ]
}
```

# 怎样把专业资料讲明白，而不是删掉细节

〔回到项目 → 学习方法〕　〔复制 AI 续作说明〕

AI 协作学习 · 功能说明

我不必先掌握术语才有资格理解问题，同时仍能在需要时进入足够准确的专业层。

**当前情况：**正式技术单元先交一份能独立阅读的完整讲义，上课前定稿成网页，网页同名的 JSON 是唯一现行讲义；一节对应一个小问题，读完用自己的话答（10 月 11 日核对方法规则）。是否真正听懂仍通过讨论与回答检验。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#learning-plain-language-02 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-02",
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

把术语、字段和框架直接堆给人会增加无关负担；只给营销式摘要又会删掉作决定所需的条件和边界。讲义如果同时有好几份版本，修改和换老师接手时也容易对不上。

## 举个实际例子

当我说“先给我完整讲义再聊”，AI 不会甩来一页提纲，让我替它补齐专业路线。它会先核验资料、回看前文、拿反例拷问自己的结论，然后在上课时打开当天那篇网页讲义。我读完一节，移开讲义用自己的话答一句，它保留对的部分，只纠正最影响结论的一处，卡住就换个例子重讲。

## 最后我会得到什么

正式技术单元得到一份离开对话也能读懂的网页讲义：每节开头一句该记住的话，末尾有问题和折叠的参考答案，最后有串起全课的收尾题。项目交流、短答和重要纠正可直接在聊天中说明，充分备课的要求不会因换成聊天而降低。

::screen{#learning-plain-language-03 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-03",
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
     "text_ref": "1. **系统核对并处理**　先核对来源、旧单元和反例，再从现实问题、结论和例子讲到术语、取舍与必要技术细节；草稿可以先写，上课前定稿成网页。",
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
     "text_ref": "1. **系统核对并处理**　先核对来源、旧单元和反例，再从现实问题、结论和例子讲到术语、取舍与必要技术细节；草稿可以先写，上课前定稿成网页。",
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

说“把这个问题讲明白”，或要求当前单元的完整讲义。

## 需要准备什么

- 当前问题或技术单元

- 哪些地方没听懂或要补完整（如有）

## 从开始到拿到结果

1. **系统核对并处理**　先核对来源、旧单元和反例，再从现实问题、结论和例子讲到术语、取舍与必要技术细节；草稿可以先写，上课前定稿成网页。

2. **交付与接续**　上课时打开当天一篇并给链接；按我自己的复述纠正关键缺口。资料冲突或边界说不清时补查，不拿提纲冒充最终版。

::screen{#learning-plain-language-04 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-04",
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
     "text_ref": "1. 先给一句可行动的结论，再补理解它所需的最少背景。",
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
     "text_ref": "1. 先给一句可行动的结论，再补理解它所需的最少背景。",
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

**10 月 11 日核对**　人话优先和专业细节并存是方法硬边界，不以固定篇幅或模板衡量完成；当前讲义载体是网页及其同名 JSON（方法规则 10 月 7 日版本）。9 月 22 日页面依据的旧方法版本 e44fb5d 只作历史。

## 关键规则与设计选择

1. 先给一句可行动的结论，再补理解它所需的最少背景。

2. 用具体场景和反例解释差异，不靠定义互相解释。

3. 专业词第一次出现时紧跟中文意思，之后保留英文锚点；容易混的术语只用有意义的速记，不编无意义口诀。

4. 把次要细节折叠，但不删除会改变结论、风险或适用范围的事实；折叠区分“后面讲”（标出在哪讲）和“查阅”（可查不用背）。

5. 草稿可以先写 Markdown，上课前定稿成网页；网页同名的 JSON 是唯一现行讲义，修稿和换老师接手都读这一份，旧 Markdown 移出工作区、只留在版本历史里。

## AI现在怎样协助

- 每个内容单元只解决一个明确问题，并先回答为什么值得理解；正式讲义一节对应一个有意义的小问题。

- 首次完整讲义在资料核验、既有单元反查、反例检查和自审完成后才定稿；新技术主干篇再用全新、无历史上下文的独立复核，复用旧讲义改写的由老师自审，审查按风险与净收益安排。

- 每节开头一句应记住的话，末尾问题加折叠参考答案（先答再看），最后按本课主线列必答题和收尾题；这是当前安排，不是固定模板或字数标准。

::screen{#learning-plain-language-05 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-05",
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
     "text_ref": "- 读完一节，人移开讲义用语音或文字自己答；老师不抢答，保留正确部分，只纠正最影响结论的一处。对话里已经讲清的段落不用再读，学过的核心能解释就可跳过。3—5 分钟、30—60 秒是参考负担，不是计时考试。",
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
     "text_ref": "- 读完一节，人移开讲义用语音或文字自己答；老师不抢答，保留正确部分，只纠正最影响结论的一处。对话里已经讲清的段落不用再读，学过的核心能解释就可跳过。3—5 分钟、30—60 秒是参考负担，不是计时考试。",
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

- 读完一节，人移开讲义用语音或文字自己答；老师不抢答，保留正确部分，只纠正最影响结论的一处。对话里已经讲清的段落不用再读，学过的核心能解释就可跳过。3—5 分钟、30—60 秒是参考负担，不是计时考试。

- 按读者已有信息调整支架；不把通用读者缺口自动当成个人短板。根据关系复杂度选择短文、表格、流程图或完整讲义，不机械配图。

- 项目和业务交流充分备课后直接聊天，不要求先读项目总览讲义才有资格讨论；简短答疑和纠正不另建文档。

## 这一步怎样进行

1. 核验当前资料并反查既有单元，先消除会改变理解的矛盾。

2. 用反例和自审检查遗漏、过度外推与讲解断点。

::screen{#learning-plain-language-06 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-06",
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
     "text_ref": "3. 写清现实问题和一句结论。",
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
     "text_ref": "3. 写清现实问题和一句结论。",
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

3. 写清现实问题和一句结论。

4. 补足理解结论所需的最少背景，给出可迁移的心智模型和具体场景。

5. 比较选择、代价与容易犯错的反例。

6. 补术语、技术细节、未知和参考来源，定稿成网页，同名 JSON 作为唯一现行讲义。

7. 上课时打开当天一篇，按人的自然复述纠正关键缺口。

::screen{#learning-plain-language-07 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-07",
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

## 这里会用到的说法

| 名词 | 意思 |
| --- | --- |
| scaffolding（学习支架） | 在需要时提供提示、例子和结构，理解增加后逐步撤掉。 |
| cognitive load（认知负荷） | 减少与当前理解无关的负担，不是减少必要事实。 |
| self-explanation（自我解释） | 人用自己的话说明理由和关系；AI输出不替代这一步。 |

## 这一步说的是什么

先讲现实问题、结论、理由和影响，再补专业名称、实现细节、反例和未知；简单不等于含糊。

::screen{#learning-plain-language-08 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-08",
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
     "text_ref": "- 没有固定字数、统一模板或必须配图的要求。",
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
     "text_ref": "- 没有固定字数、统一模板或必须配图的要求。",
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

解决术语先行、上下文过载、简单化失真、例子不能迁移、技术细节无法继续追问，以及多份讲义版本互相打架。

## 边界

- 没有固定字数、统一模板或必须配图的要求。

- 提纲、草稿或聊天片段不能冒充首次完整讲义最终版；同一篇只有一份现行讲义。

- 人话不能把必须、例外、停止条件和未知改成模糊建议。

- 适合新手的详细支架不应永久保留给已经熟悉的人。

## 遇到问题时怎样处理

- **读者只能复述术语**：回到现实问题、例子和选择代价，重新建立意思。

- **简化后边界消失**：恢复影响判断的条件，并把技术细节放到第二层。

- **解释很长但没有结论**：先写清一句判断和为什么，再裁掉无关铺垫。

- **资料未核验或与既有单元矛盾**：暂停定稿，回到来源、旧单元、反例和自审链补齐后再交付。

::screen{#learning-plain-language-09 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个方法节点 先查清楚",
    "href": "/projects/learning/authoritative-research/"
   },
   {
    "text": "下一个方法节点 继续聊",
    "href": "/projects/learning/dialogue-revision/"
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
     "text_ref": "- 自我解释平均效应与适用条件",
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
     "text_ref": "- 自我解释平均效应与适用条件",
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

- 自我解释平均效应与适用条件

- 认知科学课堂落地证据与限制

- 例题、练习和认知负荷相关实践指南

## 怎样检查这一步没有跑偏

- 让不熟悉主题的读者先复述现实问题、理由和结果，再检查术语。

- 用反例确认简化没有改变范围、强度或停止条件。

- 区分 AI 解释得清楚和人真正完成自我解释，两者不能互证；审查要看人能否理解和表达，不能只查术语和文件齐全。

- 确认同一篇只有网页同名 JSON 一份现行讲义。

## 和其他步骤怎样衔接

消费来源模块提供的可信事实；交流模块用真实追问检查讲法是否仍缺前提或边界。
