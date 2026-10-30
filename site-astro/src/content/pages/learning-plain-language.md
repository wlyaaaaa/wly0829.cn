---
{
 "title": "讲义：先写完整，定稿成网页，只留一份",
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
  "title": "讲义：先写完整，定稿成网页，只留一份",
  "url": "/projects/learning/plain-language/",
  "parent": "learning",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "项目规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲这一部分怎么运作，不含讲义原文或学习内容"
  }
 },
 "source": {
  "page": "sources/pages/learning-plain-language/page.json",
  "sha256": "f1f98b7ae9c388fa9a3b74be1c29a57265345ac8702cfa9691199e0dfbc5093f",
  "converted_at_beijing": "2026-10-31T04:02:53+08:00"
 }
}
---

::screen{#learning-plain-language-01 section="top"}

```typeset
{
 "screen": {
  "id": "learning-plain-language-01",
  "section": "top",
  "title": "讲义：先写完整，定稿成网页，只留一份",
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
     "text_ref": "讲义：先写完整，定稿成网页，只留一份",
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
     "static_note": "截至 10 月 11 日 · 项目规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲这一部分怎么运作，不含讲义原文或学习内容",
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
     "text_ref": "讲义：先写完整，定稿成网页，只留一份",
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
     "static_note": "截至 10 月 11 日 · 项目规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲这一部分怎么运作，不含讲义原文或学习内容"
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

# 讲义：先写完整，定稿成网页，只留一份

〔回到项目 → 学习方法〕　〔复制 AI 续作说明〕

AI 协作学习 · 功能说明

这一部分管讲义：AI 把一个技术主题写成离开对话也能读懂的完整讲义，上课前定稿成网页；之后修稿、换对话、换模型接手，都读同一份。

**当前情况：**草稿可以先写，上课前定稿成网页，网页同名的 JSON 是唯一现行讲义；一节对应一个小问题，我读完用自己的话答（10 月 11 日核对项目规则）。我是不是真的听懂，仍靠讨论和回答来看。

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
    "text": "这一部分做什么"
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
     "text_ref": "这一部分做什么",
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
     "text_ref": "这一部分做什么",
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

## 这一部分做什么

用途与实际影响

## 为什么需要它

讲义如果只是一页提纲，缺的部分得我自己去补；只给一段漂亮的摘要，又会丢掉做决定要用的条件和边界。同一篇如果存着好几份版本，修改的时候、换模型接手的时候都容易对不上。所以这里规定讲义写完整，而且只留一份现行稿。

## 举个实际例子

我说“先给我完整讲义再聊”。AI 不会甩来一页提纲，而是先核对资料、回看已经交过的讲义、拿反例检查自己的结论，写好草稿，上课时把当天那一篇定稿成网页发我链接。我读完某一节，移开讲义用自己的话答一句；它保留对的部分，只纠正最影响结论的一处，我卡住了就换个例子重讲这一节。

## 最后我会得到什么

每个技术主题得到一份离开对话也能读懂的网页讲义：每节开头一句要点，末尾一个问题和折叠的参考答案，最后有串起全篇的收尾题。项目交流、简短答疑和重要纠正直接在聊天里说，不另建讲义，但备课要求一样。

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
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
     "width": "40%"
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
     "text_ref": "1. **AI 核对并写稿**　先核对来源、已经交过的讲义和反例，再写草稿：从现实问题、结论和例子讲起，再补术语、取舍和必要的技术细节；上课前定稿成网页。",
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
     "text_ref": "1. **AI 核对并写稿**　先核对来源、已经交过的讲义和反例，再写草稿：从现实问题、结论和例子讲起，再补术语、取舍和必要的技术细节；上课前定稿成网页。",
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

说“把这个问题讲明白”，或者要这一课的完整讲义。

## 需要准备什么

- 当前问题或技术主题

- 哪些地方没听懂或要补完整（如有）

## 从开始到拿到结果

1. **AI 核对并写稿**　先核对来源、已经交过的讲义和反例，再写草稿：从现实问题、结论和例子讲起，再补术语、取舍和必要的技术细节；上课前定稿成网页。

2. **交付与接续**　上课时打开当天一篇并给链接；我读完复述，AI 按我的回答纠正关键缺口。资料冲突或边界说不清时先补查，不拿提纲冒充最终版。

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
     "text_ref": "1. 每节先写一句结论，再补读懂它需要的背景。",
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
     "text_ref": "1. 每节先写一句结论，再补读懂它需要的背景。",
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

**10 月 11 日核对**　讲人话和保留专业细节同时成立，是这一部分的硬规定，写完没有不按篇幅或模板算；现行讲义的载体是网页及其同名 JSON（项目规则 10 月 7 日版本）。9 月 22 日页面依据的旧版本 e44fb5d 只作历史。

## 关键规则与设计选择

1. 每节先写一句结论，再补读懂它需要的背景。

2. 讲差别用具体场景和反例，不用定义去解释定义。

3. 专业词第一次出现时跟上中文意思，之后保留英文原名，方便以后查；容易混的词只用有意义的简称，不编口诀。

4. 次要细节折叠起来，但会改变结论、风险或适用范围的事实不删；折叠处标明是“后面讲”（写出在哪讲）还是“查阅”（可查，不用背）。

5. 草稿可以先写 Markdown，上课前定稿成网页；网页同名的 JSON 是唯一现行讲义，修稿和换老师接手都读这一份，旧 Markdown 移出工作区、只留在版本历史里。

## AI现在怎样协助

- 一份讲义只解决一个明确问题，开头先说为什么值得弄懂；一节对应一个小问题。

- 第一次交的完整讲义，要等资料核验、对照已交讲义、反例检查和自审都做完才定稿；新写的主干讲义再交给一个没有历史上下文的新会话独立复核，在旧讲义上改写的由老师自审，复核做多少按风险和收益定。

- 每节开头一句要点，末尾一个问题加折叠参考答案（我先答再看），最后列本篇的必答题和收尾题；这是现在的安排，不是固定模板或字数标准。

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
     "text_ref": "- 我读完一节，移开讲义用语音或文字自己答；老师不抢答，保留对的部分，只纠正最影响结论的一处。对话里已经讲清的段落可以不读，我已经能讲出来的部分可以跳过。",
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
     "text_ref": "- 我读完一节，移开讲义用语音或文字自己答；老师不抢答，保留对的部分，只纠正最影响结论的一处。对话里已经讲清的段落可以不读，我已经能讲出来的部分可以跳过。",
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

- 我读完一节，移开讲义用语音或文字自己答；老师不抢答，保留对的部分，只纠正最影响结论的一处。对话里已经讲清的段落可以不读，我已经能讲出来的部分可以跳过。

- 按我已经知道的内容调整讲义的详略，不把一般读者会缺的东西当成我个人的短板；按内容之间的关系选短文、表格、流程图或完整讲义，不为配图而配图。

- 项目和业务上的交流，老师备好课后直接在聊天里谈，不要求我先读一份总览讲义；简短答疑和纠正不另建文档。

## 这一步怎样进行

1. 核对当前资料，对照已经交过的讲义，先消除会改变理解的矛盾。

2. 用反例和自审检查遗漏、推得过头和讲不通的地方。

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
     "text_ref": "3. 写清这篇要解决的现实问题和一句结论。",
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
     "text_ref": "3. 写清这篇要解决的现实问题和一句结论。",
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

3. 写清这篇要解决的现实问题和一句结论。

4. 补上读懂结论需要的背景，配一个具体场景。

5. 比较几种做法的代价，列出容易弄错的反例。

6. 补术语、技术细节、未知和参考来源，定稿成网页，同名 JSON 作为唯一现行讲义。

7. 上课时打开当天一篇，按我的复述纠正关键缺口。

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
| 现行讲义 | 网页同名的那份 JSON；修稿、换对话、换模型都只读这一份。 |
| 草稿／定稿 | 草稿可以提前写成 Markdown；定稿是上课前生成的网页，旧 Markdown 移出工作区。 |
| 折叠区 | 讲义里收起来的细节，标明是“后面讲”还是“查阅”。 |
| 独立复核 | 新写的主干讲义交给一个没有历史上下文的新会话检查；写稿的老师不能自称终审。 |

## 这一步说的是什么

讲义这一部分把一个技术主题写成完整的网页讲义：先讲现实问题、结论、理由和影响，再补专业名称、实现细节、反例和未知；同一篇只留一份现行稿，我读完用自己的话答。

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

防止讲义只堆术语、一次塞进太多上下文、简化以后丢了条件、例子换个场合就不成立、技术细节没法继续追问，以及同一篇存着几份版本互相打架。

## 边界

- 没有固定字数、统一模板或必须配图的要求。

- 提纲、草稿或聊天片段不能冒充第一次交的完整讲义；同一篇只有一份现行讲义。

- 讲人话不能把“必须”、例外、停止条件和未知改成模糊的建议。

- 我已经熟悉的部分，后面的讲义不再详细铺垫。

## 遇到问题时怎样处理

- **我只能复述术语**：回到现实问题、例子和选择的代价，重讲这一节。

- **简化后边界没了**：补回影响判断的条件，技术细节放到第二层。

- **讲了很长却没有结论**：先写清一句判断和为什么，再删掉无关的铺垫。

- **资料没核验或和已交讲义矛盾**：暂停定稿，回到来源、旧讲义、反例和自审补齐后再交。

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
     "text_ref": "- 项目规则（10 月 7 日版本）：讲义写法、定稿和唯一现行稿的规定",
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
     "text_ref": "- 项目规则（10 月 7 日版本）：讲义写法、定稿和唯一现行稿的规定",
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

- 项目规则（10 月 7 日版本）：讲义写法、定稿和唯一现行稿的规定

- 讲义索引：每篇真实交付的日期和我的反馈摘要

- 网页同名 JSON：每篇讲义的现行内容（公开页不展示）

## 怎样检查这一步没有跑偏

- 拿一篇讲义，看第一次读的人能不能先说出现实问题、理由和结论，再看术语。

- 用反例确认简化没有改变范围、强弱或停止条件。

- AI 讲得清楚和我自己讲得出来是两回事，不能互相证明；检查看我能不能用自己的话说出来，不只看术语和文件齐不齐。

- 确认同一篇只有网页同名 JSON 一份现行讲义。

## 和其他步骤怎样衔接

接收“先查清楚”部分核对过的事实；“继续聊”部分用我的真实追问检查讲义还缺不缺前提或边界。
