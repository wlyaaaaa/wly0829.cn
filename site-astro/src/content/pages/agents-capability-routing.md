---
{
 "title": "能力、方法与原生代理路由",
 "kind": "project",
 "url": "/projects/agents/capability-routing/",
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
  "page": "agents-capability-routing",
  "kind": "project",
  "title": "能力、方法与原生代理路由",
  "url": "/projects/agents/capability-routing/",
  "parent": "agents",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "按 2026-10-12 02:18 激活的活动规则 E258（10 月 12 日 04:41 核验）与 .agents 源码（截点提交 3a6a086b，另核截点后提交）核对；测试登记与使用账本为 10 月 12 日 04:33–04:41 只读观察，Hook 安装文件沿用 10 月 11 日 16:34–16:38 观察；本轮没有新派子任务、跑测试或调用云通道"
  }
 },
 "source": {
  "page": "sources/pages/agents-capability-routing/page.json",
  "sha256": "16ec6ebcc0985ad17459c6563c29c9700f9b57cc77e3b2ffaa50b02aedb6b05e",
  "converted_at_beijing": "2026-10-22T09:10:16+08:00"
 }
}
---

::screen{#agents-capability-routing-01 section="top"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-01",
  "section": "top",
  "title": "能力、方法与原生代理路由",
  "links": [
   {
    "text": "回到项目 → AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/agents/#ai-brief"
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
     "text_ref": "能力、方法与原生代理路由",
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
     "static_note": "截至 10 月 12 日 · 按 2026-10-12 02:18 激活的活动规则 E258（10 月 12 日 04:41 核验）与 .agents 源码（截点提交 3a6a086b，另核截点后提交）核对；测试登记与使用账本为 10 月 12 日 04:33–04:41 只读观察，Hook 安装文件沿用 10 月 11 日 16:34–16:38 观察；本轮没有新派子任务、跑测试或调用云通道",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我只说要完成什么，AI 在获准范围内选工具、决定要不要派子代理、派给谁，并在长任务里守住原目标；生成的文件也由它归位，不把清理留给我。",
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
     "text_ref": "能力、方法与原生代理路由",
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
     "static_note": "截至 10 月 12 日 · 按 2026-10-12 02:18 激活的活动规则 E258（10 月 12 日 04:41 核验）与 .agents 源码（截点提交 3a6a086b，另核截点后提交）核对；测试登记与使用账本为 10 月 12 日 04:33–04:41 只读观察，Hook 安装文件沿用 10 月 11 日 16:34–16:38 观察；本轮没有新派子任务、跑测试或调用云通道"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我只说要完成什么，AI 在获准范围内选工具、决定要不要派子代理、派给谁，并在长任务里守住原目标；生成的文件也由它归位，不把清理留给我。"
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
   "asset": "_library/illustrations/modules/agents/capability-routing/capability-routing-v01.png",
   "key": "main-agents",
   "source_phrase": "右上一幅水彩插画：中间一本翻开的绿色封面规则册，书脊上一把小小的金色挂锁，书页右下角盖着一枚淡绿色圆形印章（印章里不写字）；规则册两侧各飘出一条绿色丝带，左边丝带连到一个圆角小窗口（窗口左上角画 Claude 的橙色星形标志），右边丝带连到另一个圆角小窗口（窗口左上角画 OpenAI 的黑色花结标志，代表 Codex）；两条丝带上各串着三四张很小的空白卡片（代表技能），窗口下方各有两三个更小的分身小窗口（代表子代理）。",
   "sha256": "bba58a1a05b3eb9515389a09808d1282d8d183d0b85f6f4d94e9e199e20fe605",
   "status": "ready"
  }
 ]
}
```

# 能力、方法与原生代理路由

〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕

.agents · 功能说明

我只说要完成什么，AI 在获准范围内选工具、决定要不要派子代理、派给谁，并在长任务里守住原目标；生成的文件也由它归位，不把清理留给我。

**当前情况：**主持的 AI 负责想和把关，具体的活派出去做；派多少看宿主当前真实能开几个，不写死数量；选哪个型号按成品要求和公开评测数据定。九月那套“先验身份才准委派”的门禁已在 2026-09-27 删除，现在 Hook 只报告状态，不替 AI 调度。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#agents-capability-routing-02 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 任务一长，临时方案很容易被越写越像硬需求；但一味压缩实现，又可能把真正要用的功能一起删掉。这套路由只拦没有依据的新增层，保留 AI 自主研究、补功能、修复、重建和委派的空间。 举个实际例子 我"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 任务一长，临时方案很容易被越写越像硬需求；但一味压缩实现，又可能把真正要用的功能一起删掉。这套路由只拦没有依据的新增层，保留 AI 自主研究、补功能、修复、重建和委派的空间。 举个实际例子 我"
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

任务一长，临时方案容易被越写越像硬需求；一味压缩又可能把真正要用的功能删掉。另一头，工具、子代理和型号越来越多，主持的 AI 如果什么都亲手做，就没精力把关。这套规则让主持专心定方向、抽查和验收，具体批量活交给最合适、又最划算的执行者。

## 举个实际例子

我说：“把这个项目做完整。”主持先把我的目标和它自己想到的做法分开，再判断：这件成品是会被人直接看到、只能靠人眼判断好坏的（要惊艳），还是能靠测试判断的（能用就行），或者是纯机械活。要惊艳的样板交做得最好的，其余照样板铺开；能用就行的交能胜任里最便宜的。派出去后主持继续做不冲突的事。

## 最后我会得到什么

我拿到完整功能和实际验收结果。AI 会说明谁做了哪部分、用的什么型号和档位、哪些结果它亲自核对过；某个工具或子代理不可用时只停那一条路线，不把原目标交还给我。

::screen{#agents-capability-routing-03 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-03",
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

原意、授权和质量边界清楚后，主持自主拆活、派出、复核。整件事一两步就完时自己顺手做，派 0 个子代理也正常。

## 发现问题时

新加的目标或技术层没有用户意图、必要实现或真实质量依据时，只去掉那一部分换简单路线；主目标继续，自造的复杂度出错先删层。

## 入口不可用或证据不足时

宿主槽位满了、子代理报错或型号档位读不到时，如实写“未知”或换已有路线；鉴权、参数、网络这类失败不当作满槽，也不另开替身任务重复执行。

::screen{#agents-capability-routing-04 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-04",
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
     "text_ref": "在同一 AI 工作对话中说出目标，以及型号、厂商、档位或预算上的限制；实际能用什么由当前宿主决定。",
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
     "text_ref": "1. **先核对真正要交付的结果**　主持把我的要求和自己临时想到的做法分开，保留必须完成的功能与验收。",
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
     "text_ref": "在同一 AI 工作对话中说出目标，以及型号、厂商、档位或预算上的限制；实际能用什么由当前宿主决定。"
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
     "text_ref": "1. **先核对真正要交付的结果**　主持把我的要求和自己临时想到的做法分开，保留必须完成的功能与验收。",
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

在同一 AI 工作对话中说出目标，以及型号、厂商、档位或预算上的限制；实际能用什么由当前宿主决定。

## 需要准备什么

- 期望完成的结果

- 质量、时间、费用或模型限制

## 从开始到拿到结果

1. **先核对真正要交付的结果**　主持把我的要求和自己临时想到的做法分开，保留必须完成的功能与验收。

2. **决定自己做还是派出去**　看整件事的目的和总量，算自己做和委派各要花多少；派活时写清目标、已知事实、限制和验收方法，显式写出型号和档位。

3. **检查做成没有**　按风险决定不另派、聚焦还是完整复核，核对我能看到的结果、清理任务文件；不可用的部分说清缺口，不借别的路线冒充。

::screen{#agents-capability-routing-05 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 已落地；身份门禁与路由回归通过 关键规则与设计选择 1 简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。 2 ro"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 已落地；身份门禁与路由回归通过 关键规则与设计选择 1 简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。 2 ro"
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
     "text_ref": "1. **主持想和把关，活派出去做。** 主持管战略、头脑风暴、抽查、质量把关和最终以人的角度看成品；具体活派子代理做，哪怕自己做也很快。只有整段活一两步就完的小事顺手做。",
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
     "text_ref": "1. **主持想和把关，活派出去做。** 主持管战略、头脑风暴、抽查、质量把关和最终以人的角度看成品；具体活派子代理做，哪怕自己做也很快。只有整段活一两步就完的小事顺手做。",
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

当前规则依据为 E280（2026-10-22 08:43:25 激活，上一版 E279，绑定提交 9e6c296d…；本轮核验通过）。本屏和下一屏这次按 E280 核对过的是：第 4 条的型号档位（具体型号和档位现在只以模型清单为准，现场清单的数值没变）、下一屏第 10 条浏览器做法、GPT 子任务的 AppServer 接续和云端素材通道的读者状态。其余条目仍是早先的观察：源码截点 3a6a086b（10 月 11 日 13:59），当时规则为 2026-10-12 02:18 激活的 E258（绑定提交 5892e5bb…；上一版 E257 绑定 79fae9f…），那时截点之后能力上新增的只有快速电脑清理入口（下一屏第 9 条），这句只说那一段，不代表到现在为止的全部变化；第 7 条的 Stop 行为和下一屏的派活单栏位、等候方式按 E275（2026-10-17 11:38:31 生效）改写过。九月的身份门禁回归是历史，不作当前功能验收。

## 关键规则与设计选择

1. **主持想和把关，活派出去做。** 主持管战略、头脑风暴、抽查、质量把关和最终以人的角度看成品；具体活派子代理做，哪怕自己做也很快。只有整段活一两步就完的小事顺手做。

2. **容量按宿主真实情况。** 能开几个子代理看当前宿主的真实槽位和任务状态，不再写死“0–10 个”。

3. **按成品选人，能胜任的最低一档就够。** 谁能胜任、谁最好，只以厂商公布数据和权威评测为准，不在本机试跑排名；当前依据见 10 月 12 日更新的模型清单。

4. **当前型号与档位：** GPT-6.1 Sol 子代理只读、步骤简单且代码上限为 0 的小单（读一页、查一项现成数据、回读状态）用 medium；施工、要判断的分析和难活仍用 ultra（允许子代理的 xhigh），施工只接范围、文件和行数预算已定的活。GPT-6 Luna 用最高档 max，照写好的提示生图落盘用 low，不派需要判断的编码修复；要自主定方案的交有授权的 GPT-6 Astra 或 Claude Opus。每次派单都显式写型号档位，派完核对实际启动的值。

5. **按宿主分开谁能派谁。** Codex 里的 GPT 主对话优先用原生子代理；Codex 里其他公司的主对话可派 Sol、Luna，不派 Astra。Claude 可以派自己的子代理和 Sol、Luna，Astra 按对话或项目授权；Claude 派 GPT 走已有包装器。重大动作前的把关和普通分工分开，够格的主持可以自己把关。

6. **复核按风险定深浅。** 测试能证明对错、可撤回、影响小的不另派；每轮都会用到的入口和共用组件做聚焦复核；可能泄密、把本人锁在外面、丢唯一数据或不可逆的做完整复核。修好后只复查那一处。真实使用要验，提示用自然需求，客观接口用程序测。给本人拿去做决定的推荐、取舍、计划类汇报另有一条：交本人前由 Astra 独立复核断言证据和偏好外推，每次派前先问本人，本人没给长期授权，不同意就不派，也不改派 Sol 做这项复核。

7. **Hook 只提供状态，不调度。** Hook（宿主在固定时刻自动跑的小程序）报告能核实的型号和档位，读不到写“未知”，子代理档位未知不借父代理的；不选型号、不定并行数，也没有另设的派发许可登记。Claude 的 Stop 只按真实回执拦一次（资料被拦、漏挂后台盯守、验收缺口），同一回合第二次只提示；主对话还有后台任务时，它用一个会话级异步唤醒在主对话空闲 55 分钟后叫醒主持，不替主持调度。

8. **不靠堆实现。** 用户目标和方案分开；没依据的新增层不加，自造复杂度导致失败先删；依赖真有缺陷就去修；完整功能不为减代码裁掉。“基座＋AI”已能现做的独立能力可能是伪需求；要长期维护的新框架或服务先找成熟现成品、先算维护成本。

::screen{#agents-capability-routing-06 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-06",
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
     "text_ref": "9. **清理新口径。** 本任务产生、下载或确认退役的东西可以直接删除，也可以进回收站；回收不下的本任务文件也可直接删。只保护本人原件、别人的任务、归属不明和在用的内容；交付成功不冒充清理成功。",
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
     "text_ref": "9. **清理新口径。** 本任务产生、下载或确认退役的东西可以直接删除，也可以进回收站；回收不下的本任务文件也可直接删。只保护本人原件、别人的任务、归属不明和在用的内容；交付成功不冒充清理成功。",
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

9. **清理新口径。** 本任务产生、下载或确认退役的东西可以直接删除，也可以进回收站；回收不下的本任务文件也可直接删。只保护本人原件、别人的任务、归属不明和在用的内容；交付成功不冒充清理成功。E258 起（10 月 12 日 02:18 生效，来源提交 5892e5bb）能力专题另有直达快速电脑清理做法 `E:\PCConfig\docs\runtime\ai-cache-sweep.md` 的入口：先处理已核实的明显无用项和本批回收的东西、回读实际腾出的空间；疑难对象和基座源码修复并行，复用已有证据，不反复整盘扫描，也不等全量清理引擎修好。本轮没有执行清理，不报清理结果。

10. **软件与浏览器。** 版本号和安装路径不当永久身份；普通更新保留真实能力、数据和配置。访问网站一律用本人正在用的 Chrome：经 Chrome 插件在 AI 自己新开的后台标签页里做，本人已开的页只读（点名的除外），会新开页的链接先取地址再在后台页打开，不把 Chrome 弹到前台。Claude 要上网站就派 GPT 用 Codex 的 Chrome 插件做，Claude 内置浏览器只看本机文件和本机回环地址的预览。插件或 Chrome 不通时按浏览器连续性技能修一次，仍不通就停下需要网页的那一步，把卡在哪一层、实际报错和做到哪里交回根会话，其余工作照做；不改用无头浏览器、任务临时配置、内置浏览器、别的浏览器或远程浏览器去开同一个网站。无头 Chrome 只用于把本机文件或本任务在 127.0.0.1/localhost 起的服务渲染成图或 PDF 自检，外部资源默认拦截。早先“Chrome 打不开就在同一个 Chrome 用无头隔离配置继续”的做法已被 E279 取消。

## 当前怎样实现

- **GPT 子任务的生命周期（Claude 派 GPT 时）：** 包装器的 Start 和 Resume 统一走私有 AppServer，沿用原来的型号、档位和脱离方式，不再把 `-Transport Exec` 当出故障时的回退；用独立的隐藏执行者（经 WMI 启动，默认 Detached），Claude 退出也不会杀掉施工。Start 启动即返回，加 `-Wait` 才等；运行中可 Steer 追加指示，结束后可 Resume 原线程；Resume 返回后挂一个覆盖全部运行任务的后台 Watch 继续管理，不另挂兜底监看（Backstop）；Stop 默认立即返回并保留线程和成果，`-Wait` 等停完，`-DeleteThread` 才删；Accept 执行已登记的验收命令，通过后清理线程；Archive 只移动已结束的任务，失败、超时、额度耗尽的保留原线程。Archive 移动前逐个工作副本预检，异仓、锁定、Git 登记缺失或不匹配、预检失败的跳过；移动后修 Git 登记，失败就尝试移回并恢复；一个任务失败不影响其他，回执带数量、跳过原因和“带错完成”标记（提交 d1fcbd06，10 月 11 日 13:54 起；本轮没有实际归档）。Detached 执行者没有桌面祖先身份：只有真正依赖密码中心桌面身份的凭据步骤交回主对话，其余已授权步骤（包括已有的 Git、OAuth 步骤）照常做完。

- **预算与接续：** 派活单写目标、范围、授权、测试上限、时限和验收方式；出处、方案和成本估算等栏可选，包装器不因缺栏拒派；扩时、预算放行和纠错带理由。生图任务（提交 6942048d，10 月 11 日 14:13 起）开头标 `任务类型: 生图`，交回图片任务、产物路径和验证结果（本轮没有派生图任务）。同一 Codex 额度下主对话正常、只有子任务额度耗尽时，可用 ContinueOnQuota 在原线程续作；真正共同耗尽就等额度恢复。fast 快速模式只按本轮许可或保存的设置，不全局默认。启动成功不等于做完，主持仍要读汇报、核对结果。

- **Hook 现场（16:34–16:38 观察）：** Codex 挂 8 个事件，Claude 挂 7 个（没有 SubagentStart）；两份安装文件哈希与截点源码一致，Claude 端安装于 10/11 12:53:57。Hook 现在还提供北京时钟与时区换算、现行要求、项目位置、压缩预警与后台复核，以及 PCConfig 资源风险的只读摘要；资源提醒不全机扫描，不让普通工作停下。这不证明已经开着的旧对话都重载了配置。10 月 20 日上午另行核对：Claude 现用检查脚本的内容指纹（40ced3a8…）与清单和源码一致，`~/.claude/settings.json` 的 Stop 已登记异步唤醒（asyncRewake）；没有开新会话或实际触发 Hook，不证明已开着的对话都已重载，也不算一次真实运行验收。

- **云端素材通道：** 同一份文件要被 AI 反复读取时，上传到 R2（Cloudflare 的对象存储）一次，桶为 `wly-ai-assets`、地址 `https://ai.wly0829.cn/`；按内容哈希命名、不按日期过期、仍保留版本。之后核对是同一版，再让 Codex Cloud 按命令读取、只取回文字结论，用完按状态清理。不传秘密。以任务所用各文件内容版本大小之和为标尺，本机实际上传和下载的文件正文合计与它的比值目标不超过 2、超过 2.5 告警，10 GB 只是免费额度提醒。现状（按 E280）：R2 素材存储这套机制本身保留；读者这一层，换账号后新账号没有建 Codex 云端环境，云端读者暂不可用，不提交云端任务，按偶用、不维护处理，也不主动安排命令接线或模型升级。旧账号曾接通的读者和它自报 GPT-5.6 Sol 的回执，不证明当前账号可用；审图校准也没通过，网站图终审仍由 Claude Opus 做。以后真要用时，先核对当前账号的云端环境和命令接通，建环境、换账号由本人做。

## 执行流程

1. 理解目标、更正与真实质量，和可替换的做法分开。

2. 先找已有的责任项目、原生入口和能力目录；实证缺口出现前不装第二套路线。

::screen{#agents-capability-routing-07 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-07",
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
     "text_ref": "3. 判断成品类型和总量，决定自己做还是派、派几个、派给谁、什么档位。",
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
     "text_ref": "3. 判断成品类型和总量，决定自己做还是派、派几个、派给谁、什么档位。",
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

3. 判断成品类型和总量，决定自己做还是派、派几个、派给谁、什么档位。

4. 派活时一次交代清楚，显式写型号档位；派完核对实际启动值，然后继续做不冲突的事。

5. 按风险定复核深浅；子任务报风险或卡住时连同它的进度摘要一起看。

6. 能力确实缺失时才装官方运行时或提出精确插件；新软件默认装到 E 盘现有合适目录。

7. 分别验证能力可用、自然需求下选对路线、我看到的结果和剩余未知；交付前收起文件、清理本任务落地物。

::screen{#agents-capability-routing-08 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-08",
  "section": "tech",
  "title": "名词和入口（一）",
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
     "text_ref": "名词和入口（一）",
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
     "text_ref": "名词和入口（一）",
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

## 名词和入口（一）

## 本模块用到的名词

| 名词 | 意思 |
| --- | --- |
| 主持 | 根会话里的 AI：管方向、拆活、抽查、验收，对最终成品负责。 |
| 要惊艳／能用就行／机械活 | 成品三类：靠人眼判断好坏的、靠测试判断的、纯照做的；决定派给谁。 |
| Hook（宿主钩子） | 宿主在固定时刻自动运行的小程序；现在只注入状态和提醒，不调度、不创建子代理、不产生授权。 |
| ultra / max / low | 思考档位。ultra 是允许子代理用的 xhigh，不是比 max 更高的档；Luna 没有 ultra，用 max。 |
| 包装器 | Claude 派 GPT 子任务的现成脚本，负责启动、追加指示、停止、验收和归档。 |
| Detached（脱离运行） | 子任务由独立隐藏进程执行，派它的会话退出也不影响。 |
| ContinueOnQuota | 只有子任务额度耗尽时，在原线程续作的开关。 |
| 云端素材通道 | 把要反复读的文件放到 R2 一次、让云端 AI 按命令读、只回文字结论的机制。 |

::screen{#agents-capability-routing-09 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-09",
  "section": "tech",
  "title": "名词和入口（二）",
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
     "text_ref": "名词和入口（二）",
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
     "text_ref": "名词和入口（二）",
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

## 名词和入口（二）

| 名词 | 意思 |
| --- | --- |
| 定向测试 | 明确告诉模型用哪个工具的测试，只证明那条路线能执行，不证明 AI 会自己选对。 |
| 自然需求验收 | 提示不点名路线，看 AI 能不能自己选对并交出正确结果。 |

## 专业定义

主持按成品要求和宿主真实容量决定怎样做、是否并行、派给谁；Hook 只提供可核实的状态，授权和重大动作另由授权、保护两部分规则管。

::screen{#agents-capability-routing-10 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-10",
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
     "type": "prose",
     "text_ref": "工具、技能、插件和型号很多，难的不只是选哪个，还要防两种错：借“反膨胀”删掉真实需求，或把产品复杂当成可以无限加技术层的理由；同时不让主持陷在具体活里失去把关。"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 能力发现不扩大用户授权；子代理的范围和授权只能比父代理窄。",
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
     "type": "prose",
     "text_ref": "工具、技能、插件和型号很多，难的不只是选哪个，还要防两种错：借“反膨胀”删掉真实需求，或把产品复杂当成可以无限加技术层的理由；同时不让主持陷在具体活里失去把关。"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 能力发现不扩大用户授权；子代理的范围和授权只能比父代理窄。",
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

工具、技能、插件和型号很多，难的不只是选哪个，还要防两种错：借“反膨胀”删掉真实需求，或把产品复杂当成可以无限加技术层的理由；同时不让主持陷在具体活里失去把关。

## 边界

- 能力发现不扩大用户授权；子代理的范围和授权只能比父代理窄。

- 本人限定的型号、厂商、档位或预算，子代理和后代都照样遵守。

- 账号、插件、管理员权限和子代理都不能绕过真实动作的授权条件。

- 不为假想的未来预装动态配置服务、兼容层或第二套入口。

- Hook 不选型号、不定并行数；Stop 只凭真实回执拦一次、同回合第二次只提示，回执缺失不挡普通工具或最终答复；有后台任务时的异步唤醒只负责叫醒主持，不替它收结果。

- 未经本人许可不启用 fast 快速模式。

- 旧的身份门禁、线程绑定和两个受保护判断专用角色已于 2026-09-27 删除，不再作为创建子代理的前置条件。

## 失败与恢复

- **原生槽位确实满了：** 才转用已有包装器；鉴权、参数、上下文或网络失败不误判为满槽，不新建替身任务。

::screen{#agents-capability-routing-11 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-11",
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
     "text_ref": "- **子代理中断：** 先核对它的真实状态；同一子任务且事实仍准确就在原线程续作，否则先停止或交接再新开，部分结果不冒充完成。",
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
     "text_ref": "- **子代理中断：** 先核对它的真实状态；同一子任务且事实仍准确就在原线程续作，否则先停止或交接再新开，部分结果不冒充完成。",
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

- **子代理中断：** 先核对它的真实状态；同一子任务且事实仍准确就在原线程续作，否则先停止或交接再新开，部分结果不冒充完成。

- **只有子任务额度耗尽：** 用 ContinueOnQuota 原线程续作；共同耗尽就等恢复，恢复后在原对话继续。

- **型号或档位读不到：** 写“未知”，不按名称猜，也不借父代理的值。

- **任务文件清理失败或仍被使用：** 不把主产物成功当清理完成；保留在用和必要材料，说明残留路径和原因。

- **新加的服务、状态或验证层导致失败：** 先移除或绕开，删改只维护废层的测试，再只为真实缺口补最小实现。

::screen{#agents-capability-routing-12 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-12",
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
     "text_ref": "- 活动分工与并行施工专题（execution-coordination）",
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
     "text_ref": "- 活动分工与并行施工专题（execution-coordination）",
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

- 活动分工与并行施工专题（execution-coordination）

- 活动工程与交付专题（engineering-delivery）

- 活动 Codex、Claude 适配专题（派子代理、派 GPT、原生容量不足）

- 活动能力与运行方式专题（含云端素材通道；E258 起含快速电脑清理入口）

- 模型清单 `config/model-roster.json`（10 月 8 日依据）

- Claude 派 GPT 的包装器（截点版本，含 Start/Steer/Resume/Stop/Accept/Archive；Archive 逐工作副本预检与生图例外见上一屏）

## 如何验证

- 当前规则：E280（2026-10-22 08:43:25 激活，上一版 E279，绑定提交 9e6c296d…；本轮核验通过）。这只证明 E280 规则文件完整，不等于派 GPT、AppServer 接续、Chrome 后台通道或云端读者这些真实委派路径这次都走通过；这些路径本次一条都没实际跑。

- 历史：E258 于 2026-10-12 02:18 激活，绑定提交 5892e5bb…，当时当前/上一版（E257）核验通过（10 月 12 日 04:41 观察）。

- 测试登记：`tests/test-registry.json` 10 月 22 日 06:47 重读为 89 项测试定义（只计数，本地和跨项目各几项这次没重分）；10 月 12 日 04:38 查看时是 86 项（81 本地＋5 跨项目，比截点多的一项是 10 月 11 日 14:13 加的生图子任务测试）。都是登记数，没有运行，不说通过。

::screen{#agents-capability-routing-13 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-13",
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
     "text_ref": "使用账本（完整覆盖到10月11日00:00之前，10月12日04:41聚合）：GPT包装器调用3,504次（Claude2,862、Codex642）；这是命令调用次数，不是成功任务数。10月11日零",
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
     "text_ref": "使用账本（完整覆盖到10月11日00:00之前，10月12日04:41聚合）：GPT包装器调用3,504次（Claude2,862、Codex642）；这是命令调用次数，不是成功任务数。10月11日零",
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

- 使用账本（完整覆盖到 10 月 11 日 00:00 之前，10 月 12 日 04:41 聚合）：GPT 包装器调用 3,504 次（Claude 2,862、Codex 642）；这是命令调用次数，不是成功任务数。10 月 11 日零点以后还没完整补采，之后的总量未知。fast 71 次是旧窗口（覆盖到 10/9 23:59）的数，当前 fast 次数未知。

- 历史：2026-09-27 15:12 提交 `def50d2` 删除旧模型门禁和施工登记，42 个文件、删 15,387 行。E118 的四档模型与根/父双上限、E167/E171 的旧候选边界、E98 的 38/0 回归都是历史，不作今天的路由或完整回归。

- 本轮没有新派、停止或验收任何子任务，也没有调用云通道；生命周期各路径未在本轮实际走通。

## 与其他模块的关系

本模块决定怎样做、是否并行、派给谁、怎样验收；授权范围由“授权与本人接管”管，重大动作的把关和本人验证由“保护策略”管，压缩接续与完成判断由“任务接续与完成判断”管。
