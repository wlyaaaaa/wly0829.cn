---
{
 "title": "路线与断点：大纲怎么排，断了从哪接上",
 "kind": "project",
 "url": "/projects/learning/route-checkpoint/",
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
  "page": "learning-route-checkpoint",
  "kind": "project",
  "title": "路线与断点：大纲怎么排，断了从哪接上",
  "url": "/projects/learning/route-checkpoint/",
  "parent": "learning",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "项目规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲这一部分怎么运作，不展示实际主题、路线或进度"
  }
 },
 "source": {
  "page": "sources/pages/learning-route-checkpoint/page.json",
  "sha256": "87a21b0f5668fe75dff8b181494e544551fa9bd65e03d8e00922084125b0bd52",
  "converted_at_beijing": "2026-10-31T04:05:41+08:00"
 }
}
---

::screen{#learning-route-checkpoint-01 section="top"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-01",
  "section": "top",
  "title": "路线与断点：大纲怎么排，断了从哪接上",
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
     "text_ref": "路线与断点：大纲怎么排，断了从哪接上",
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
     "static_note": "截至 10 月 11 日 · 项目规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲这一部分怎么运作，不展示实际主题、路线或进度",
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
     "text_ref": "路线与断点：大纲怎么排，断了从哪接上",
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
     "static_note": "截至 10 月 11 日 · 项目规则按 10 月 7 日版本，10 月 11 日只读核对；本页只讲这一部分怎么运作，不展示实际主题、路线或进度"
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
   "asset": "_library/module-illustrations/learning/route-checkpoint-v01.png",
   "key": "main-learning",
   "source_phrase": "右上一幅水彩插画：一张书桌，摊开一本绿色封面的讲义（页面上只画浅灰短线，不画字），旁边一台笔记本电脑，屏幕上两个对话气泡（只画短线）；书桌后面的窗外是一座缓缓向上的绿色小山，一条由 28 块小石板铺成的小路蜿蜒上山，路边插着六面小三角旗，旗面分别写 A、B、C、D、M、P；第一块石板旁放着一双小鞋，表示还没出发。",
   "sha256": "ad6bbe8ff8d829385544e051c0141e461142c890b5cee905b94b12752fc54c9d",
   "status": "ready"
  }
 ]
}
```

# 路线与断点：大纲怎么排，断了从哪接上

〔回到项目 → 学习方法〕　〔复制 AI 续作说明〕

AI 协作学习 · 功能说明

这一部分管顺序和接续：AI 先按目标和材料排出一份完整、可修改的阶段大纲，说明为什么这样排、前后靠什么衔接。讲义、练习和题单可以提前写草稿，但每个上课日只交当天一篇，交之前按已有反馈改定。现在进行到哪、下一步做什么写在几份固定文件里，对话断了、换对话或换模型，都从这几份文件接着走。

**当前情况：**现行做法是先有完整、可修改的大纲，草稿可以提前备，每天只交当天一篇并按反馈定稿；Claude Opus 5.5 主讲、GPT-6 Astra Max 复核（10 月 11 日核对项目规则）。实际主题、进度和断点不在公开页展示。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#learning-route-checkpoint-02 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-02",
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

没有大纲，前置内容容易漏、同一件事容易重复讲；一次把全部课程写死，又跟不上我的反馈和材料变化。所以这里保留一份清楚的整体安排，提前备好材料不耽误上课，同时按反馈调整深度和顺序。

## 举个实际例子

我指出“上一课的某个前提和现实对不上”。AI 重查证据，说明这会不会影响前后依赖、讲解深度和下一课；前提真的变了就重排后面的路线，已经写好的后续草稿一起改。我对这一篇还没反馈时，下一篇可以先写草稿，但要等我反馈后再定稿，不自顾自往下交新课。

## 最后我会得到什么

一份写明阶段目标、前后衔接和主题安排的大纲，以及当前唯一的下一步和理由。每个上课日结束，当前状态里写明当天完成没有、差什么、挪到哪里。中断或换老师后从当前状态接着走；草稿写好、网页生成、已经交付、我已反馈、隔段时间还能答出，记成不同的状态，都不等于我已经会了。

::screen{#learning-route-checkpoint-03 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-03",
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

目标、要覆盖的范围、前后依赖、讲多深、到哪算完和当前断点都清楚时，给出唯一的下一步和理由；下课后按到那时为止的反馈，把下一课定稿成网页。

## 遇到冲突时

反馈、反证或新资料改变前提时，保留主线，说明受影响的覆盖范围、依赖、深度和后续顺序，只改受影响的部分；不悄悄改口，也不把全部重审一遍。

## 暂时无法判断时

目标、依赖或停止标准的证据不够时，路线标为待定，不猜下一步，也不恢复旧计划；可以写草稿，但草稿不记成已交付。

::screen{#learning-route-checkpoint-04 section="usage"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-04",
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
     "text_ref": "1. **AI 排路线并备稿**　先排出完整、可修改的路线；讲义、练习和题单可以提前备草稿，下课后按反馈定稿下一课；反馈推翻前提时只重排受影响的部分。",
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
     "text_ref": "1. **AI 排路线并备稿**　先排出完整、可修改的路线；讲义、练习和题单可以提前备草稿，下课后按反馈定稿下一课；反馈推翻前提时只重排受影响的部分。",
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

提出一个要持续一段时间的目标，或说“从上次停下的地方继续”。

## 需要准备什么

- 想解决的实际问题

- 新的材料或反馈（如有）

## 从开始到拿到结果

1. **AI 排路线并备稿**　先排出完整、可修改的路线；讲义、练习和题单可以提前备草稿，下课后按反馈定稿下一课；反馈推翻前提时只重排受影响的部分。

2. **交付与接续**　上课时打开当天一篇并给链接，交回当前断点和下一步的理由；当天没完成的写明差什么、挪到哪里。

::screen{#learning-route-checkpoint-05 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-05",
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
     "text_ref": "1. 先有一份唯一现行、完整而可修改的大纲和主题安排；该覆盖什么、先后怎么排由 AI 判断，不要我先把整套技术路线审一遍。",
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
     "text_ref": "1. 先有一份唯一现行、完整而可修改的大纲和主题安排；该覆盖什么、先后怎么排由 AI 判断，不要我先把整套技术路线审一遍。",
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

**10 月 11 日核对**　当前项目规则（10 月 7 日版本）写明：完整可修订的阶段大纲、允许提前写草稿、每天只交当天一篇并按反馈定稿、断点分写在几份文件里，以及现在的老师分工。9 月 22 日页面依据的旧版本 e44fb5d 只作历史。公开页不展示实际主题、课表或个人进度。

## 关键规则与设计选择

1. 先有一份唯一现行、完整而可修改的大纲和主题安排；该覆盖什么、先后怎么排由 AI 判断，不要我先把整套技术路线审一遍。

2. 讲义可以全部先写草稿，练习、题单和真实调用的素材也可以提前准备；每天只交当天一篇，交之前按已有反馈改定；总课数、学时、字数和顺序都可以变。

3. 当前只有一个下一步，明确的反馈或反证可以调整后续顺序。

4. 缺这一篇的反馈时记为“待反馈”，我没说话不等于听懂了，也不等于同意继续；下一篇可以先写草稿，等反馈后再定稿。

5. 公开页只讲这一部分怎么运作，不放实际路线、主题或个人进度。

## AI现在怎样协助

- 先做专业研究，排出唯一现行的路线、阶段大纲和主题安排；“定下来”只表示当前版本明确，有新依据或反馈仍可修订；讲义只有一份现行稿（网页同名 JSON）。

- 准备下一课前，核对已讲过的范围、依赖、反馈和当前目标；备好的内容不提前打扰我，上课时再打开当天页，先说当天要解决什么问题、需要什么前置、关键关系是什么。

- 反馈或反证改变前提时，记下原依据、新证据、受影响的范围和重排理由；重要修正还要在对话里主动告诉我。

::screen{#learning-route-checkpoint-06 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-06",
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
     "text_ref": "- 断点靠几份文件分工记，不是单独的断点数据库或自动排课程序：学习路线管顺序和深度，当前状态管现在到哪一步和唯一下一步，讲义索引管真实交付和反馈摘要，网页同名 JSON 管唯一现行讲义，抽问题单管抽问和复习。新对话先读当前状态，不从旧计划重来。",
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
     "text_ref": "- 断点靠几份文件分工记，不是单独的断点数据库或自动排课程序：学习路线管顺序和深度，当前状态管现在到哪一步和唯一下一步，讲义索引管真实交付和反馈摘要，网页同名 JSON 管唯一现行讲义，抽问题单管抽问和复习。新对话先读当前状态，不从旧计划重来。",
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

- 断点靠几份文件分工记，不是单独的断点数据库或自动排课程序：学习路线管顺序和深度，当前状态管现在到哪一步和唯一下一步，讲义索引管真实交付和反馈摘要，网页同名 JSON 管唯一现行讲义，抽问题单管抽问和复习。新对话先读当前状态，不从旧计划重来。

- 当前老师分工：Claude Opus 5.5 主讲，GPT-6 Astra Max 复核和施工；Claude 不可用时，Astra Max 读同一套现行文件接着教，不重开进度，也不要求我重读重答。这一部分的子代理只用这两个型号；型号不可用时说明缺口，不悄悄换成别的。

- 新写的主干讲义交给一个全新、没有历史上下文的会话独立审查，在旧讲义上改写的由老师自审；写稿的不能自称独立终审；纯排版和错字不专门派人审。审查做多少按风险和收益定，不固定人数和轮数。

- 公开站点只放通用机制和规则版本，不放路线内容、私人路线清单、材料清单或个人反馈。

## 这一步怎样进行

1. 明确当前目标，以及结束时要能讲清楚的问题

::screen{#learning-route-checkpoint-07 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-07",
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
     "text_ref": "2. 结合目标、现有材料和我的反馈，排出完整、可修改的阶段大纲",
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
     "text_ref": "2. 结合目标、现有材料和我的反馈，排出完整、可修改的阶段大纲",
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

2. 结合目标、现有材料和我的反馈，排出完整、可修改的阶段大纲

3. 核对前置内容和实际反馈，定下唯一的下一步

4. 提前备草稿；下课后按反馈把下一课定稿成网页

5. 上课时打开当天一篇，说明为什么现在讲它、哪些暂时不讲

6. 新证据或反馈改变前提时，修订后续安排和受影响的草稿

7. 上课日结束写明当天完成没有，更新当前状态

::screen{#learning-route-checkpoint-08 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-08",
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
| 覆盖范围 | 为了当前目标必须讲到的内容边界；不是公开的课程清单。 |
| 依赖关系 | 一项内容要在另一项之前讲的理由，用来定顺序，不是凑章节。 |
| 断点 | 接着往下走需要的目标、覆盖范围、依赖、停止标准和唯一下一步，分别写在学习路线、当前状态、讲义索引等文件里；不是进度百分比，也不是单独的数据库。 |
| 草稿／定稿 | 草稿可以提前写；定稿是按已有反馈改好、准备当天交付的那一份网页讲义。 |

## 这一步说的是什么

先说明各阶段要解决什么问题、前后怎样衔接；材料可以提前备，但按反馈逐篇定稿、每天交一篇。新资料和真实反馈可以改变大纲，这不等于没有计划、想到哪讲到哪。

::screen{#learning-route-checkpoint-09 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-09",
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
     "text_ref": "- 不公开实际主题、路线内容或个人断点",
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
     "text_ref": "- 不公开实际主题、路线内容或个人断点",
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

避免什么问题

防止没有路线导致漏掉前置和重复讲、整套课程写死导致改不动、反馈改变不了顺序、断点接错位置、换老师从头再来，以及把我没说话当成可以继续。

## 边界

- 不公开实际主题、路线内容或个人断点

- 不冻结总课程表、总课数或统一篇幅

- 不因一次反馈推翻无关的主线

- 不把我没说话、看过材料、草稿写完或一题答对写成已经会了

- 不建课程数据库、后台生成器或监督任务

## 遇到问题时怎样处理

- **反馈或反证推翻路线前提**：重查来源，说明受影响的覆盖范围、依赖和深度，再调整后续顺序和已写的草稿；不假设我会回头重读旧讲义。

::screen{#learning-route-checkpoint-10 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-10",
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
     "text_ref": "- **目标、依赖或停止标准不清楚**：保持当前断点，不知道的写明“未知”；可以备草稿，但不交付下一篇。",
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
     "text_ref": "- **目标、依赖或停止标准不清楚**：保持当前断点，不知道的写明“未知”；可以备草稿，但不交付下一篇。",
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

- **目标、依赖或停止标准不清楚**：保持当前断点，不知道的写明“未知”；可以备草稿，但不交付下一篇。

- **旧计划和当前断点冲突**：以当前状态、已确认的反馈和真实断点为准，旧计划只用来找位置。

- **主讲老师不可用**：复核老师读同一套现行文件接着教，不重开进度；型号不可用时说明缺口。

::screen{#learning-route-checkpoint-11 section="tech"}

```typeset
{
 "screen": {
  "id": "learning-route-checkpoint-11",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个方法节点 题目与验证",
    "href": "/projects/learning/questions-validation/"
   },
   {
    "text": "下一个方法节点 人做主",
    "href": "/projects/learning/human-control-simple/"
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
     "text_ref": "- 项目规则（10 月 7 日版本）：大纲、草稿与定稿、断点文件分工和老师分工的规定",
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
     "text_ref": "- 项目规则（10 月 7 日版本）：大纲、草稿与定稿、断点文件分工和老师分工的规定",
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

- 项目规则（10 月 7 日版本）：大纲、草稿与定稿、断点文件分工和老师分工的规定

- 学习路线、当前状态、讲义索引：断点实际写在这三份文件里（公开页不展示内容）

- “人做主”部分：继续、暂停还是换方向由我决定，AI 不自己往下推

## 怎样检查这一步没有跑偏

- 10 月 11 日核对当前项目规则：大纲在先、允许提前写草稿、按反馈定稿、反馈的边界和文件分工；没有读取实际课表和个人进度。

- 现行老师分工和全新会话独立审查的约定，已从当前项目规则直接核对；本次网页改稿用的模型不代表项目规则改了，实际效果本页没有重新验收。

- 公开内容里没有课程总数、路线内容、主题、私人路线清单、进度百分比或后台推进字段。

- 用没有反馈、反证推翻前提、旧计划冲突和换老师四个场景，检查什么时候停、怎样重排、从哪接上。

## 和其他步骤怎样衔接

接收“先查清楚”部分的当前来源和“继续聊”部分的真实反馈，把定稿的当天讲义交给讲义部分；“人做主”部分决定继续、暂停还是换方向。
