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
   "as_of": "Unknown",
   "source": "父项目作者页 /projects/agents/ 的 status；技术证据为冻结页 2026-09-24 12:56 原快照，待按现状重取",
   "last": {
    "label": "原页核对",
    "at": "2026-09-24 12:56"
   }
  }
 },
 "source": {
  "page": "sources/pages/agents-capability-routing/page.json",
  "sha256": "9f4ce5fe1fc2ca751eb7430e69997772a549007ce20d51953833e149f161a99a",
  "converted_at_beijing": "2026-10-11T19:07:36+08:00"
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
       "text": "常用 · 原页核对 2026 年 9 月 24 日 12:56",
       "state": "ok"
      }
     ],
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "我只说要完成什么，AI 在获准范围内选工具、安排可独立验收的协作，并在长任务里守住原目标；生成文件也由它归位，不把清理留给我。",
     "row": "top"
    },
    {
     "type": "illustration",
     "row": "top",
     "width": "42%",
     "align": "center",
     "index": 0
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
       "text": "常用 · 原页核对 2026 年 9 月 24 日 12:56",
       "state": "ok"
      }
     ]
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕"
    },
    {
     "type": "prose",
     "text_ref": "我只说要完成什么，AI 在获准范围内选工具、安排可独立验收的协作，并在长任务里守住原目标；生成文件也由它归位，不把清理留给我。"
    },
    {
     "type": "illustration",
     "align": "center",
     "index": 0
    }
   ]
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "asset": "_library/illustrations/main-agents.png",
   "key": "main-agents",
   "source_phrase": "右上一幅水彩插画：中间一本翻开的绿色封面规则册，书脊上一把小小的金色挂锁，书页右下角盖着一枚淡绿色圆形印章（印章里不写字）；规则册两侧各飘出一条绿色丝带，左边丝带连到一个圆角小窗口（窗口左上角画 Claude 的橙色星形标志），右边丝带连到另一个圆角小窗口（窗口左上角画 OpenAI 的黑色花结标志，代表 Codex）；两条丝带上各串着三四张很小的空白卡片（代表技能），窗口下方各有两三个更小的分身小窗口（代表子代理）。",
   "sha256": "eb04e377b7542b657abc83412366159cb3b355864469be75c1e8a7177bd5c1a3",
   "status": "ready"
  }
 ]
}
```

# 能力、方法与原生代理路由

〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕

.agents · 功能说明

我只说要完成什么，AI 在获准范围内选工具、安排可独立验收的协作，并在长任务里守住原目标；生成文件也由它归位，不把清理留给我。

**当前情况：**已有按需求选工具、协调协作者和保留原意的机制；身份与路由检查通过，不等于每种工具的真实任务都已走通。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码

私有仓库

源码未公开；用法与技术说明可在下面阅读。

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

任务一长，临时方案很容易被越写越像硬需求；但一味压缩实现，又可能把真正要用的功能一起删掉。这套路由只拦没有依据的新增层，保留 AI 自主研究、补功能、修复、重建和委派的空间。

## 举个实际例子

我说：“把这个项目做完整；如果你想到一个新数据库，先看它是否真为这次功能所需。能各自做完并验收的部分可以并行。”AI 会保留原目标，选择现有工具或合适的协作方式，发现多余环节就纠正。

## 最后我会得到什么

我拿到完整功能和实际验收结果。AI 会说明用了什么办法、哪些并行工作已经核对；工具或协作身份缺失时只停相应路线，不把原目标交还给我自己处理。

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

原意、授权和质量边界清楚后，AI 自主完善、修复、重建并选择 0–10 个子代理；同样能完整验收时，采用总成本更低的实现。

## 发现问题时

新增目标或技术层没有用户意图、必要实现或真实质量依据时，只移除那部分并换简单路线；主目标继续，自造复杂度出错先删层。

## 入口不可用或证据不足时

可信身份缺失时只关闭委派，普通工作继续；独立审查确实不可用时明确写出未独立审查，不用自审冒充，也不另造审查平台。

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
     "text_ref": "在同一 AI 工作对话中说出目标与允许的工具或模型限制；实际工具由当前宿主可用能力决定。",
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
     "text_ref": "1. **先核对真正要交付的结果**　AI 把用户要求和自己临时提出的做法分开，保留必须完成的功能与验收。",
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
     "text_ref": "在同一 AI 工作对话中说出目标与允许的工具或模型限制；实际工具由当前宿主可用能力决定。"
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
     "text_ref": "1. **先核对真正要交付的结果**　AI 把用户要求和自己临时提出的做法分开，保留必须完成的功能与验收。",
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

在同一 AI 工作对话中说出目标与允许的工具或模型限制；实际工具由当前宿主可用能力决定。

## 需要准备什么

- 期望完成的结果

- 质量、时间、费用或模型限制

## 从开始到拿到结果

1. **先核对真正要交付的结果**　AI 把用户要求和自己临时提出的做法分开，保留必须完成的功能与验收。

2. **选择实际可用办法**　AI 核对当前工具与身份，比较自己完成和有界并行；仅在允许且值得时派子任务。

3. **检查做成没有**　完成后核对用户能看到的结果、清理任务文件；能力或独立审查不可用就说明精确缺口，不借其他路线冒充。

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
     "text_ref": "1. 简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。",
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
     "text_ref": "1. 简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。",
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

已落地；身份门禁与路由回归通过

## 关键规则与设计选择

1. 简单问题可以直接完成；稳定窄能力存在时优先走对应 Skill（能力入口）或 Owner（责任源）入口。

2. root 的 UserPromptSubmit 与 child 的 SubagentStart 在任何 0–10 判断前注入 verified model、effective effort（思考等级）、role、turn hash（内容指纹） 和当前 E identity。

3. AI 根据任务语义、独立可验性、质量、墙钟、冲突、资源和 slots 自主决定 0–10、家族与 effort（思考等级）；Hook（钩子） 不做调度。

4. PreToolUse（工具执行前复核） 只在真实创建前复核现场身份、当前候选支持、用户限制、参数和上下文继承；它不替AI选型，也不能取代判断前的可信身份。

5. 只有完全没有 Hook（钩子） 或身份注入的旧 root 才复用同一任务中用户已经给出的自然语言 model/effort（思考等级） 确认；确认层规范化别名，thread binding 只写 canonical ID，child 不继承。E identity 换代只刷新快照、重读并重派生，不重复确认。

6. 实现者知道内部答案可能污染验收时，AI 主动安排 implementation-blind fresh E2E（端到端验证），而不是等用户说出“盲测”。

7. 测试自然语言自主路由时，提示不点名 Skill、tool、plugin、provider、内部路径或预期路线，同时验 route_selected_without_hint 和用户可见结果。

8. 版本、build（构建号）和版本化安装路径用于观察、复现与已测发布，不作为一般软件更新的永久准入门。兼容判断依真实稳定产品身份、签名或主体、公开接口、配置结构、事件和实际能力；更新后只暂停实测缺失的能力，普通工作继续。API或文件格式版本、锁文件、测试夹具以及用户明确选择的固定运行版仍可以严格约束；接口未知不等于通过，也不凭新版本号判失败。

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
     "text_ref": "9. 所有项目、root、后代、新对话和压缩续作都区分用户目标/更正与可换方案；计划、代码、测试、草稿和审查不产生新需求。现行工程与交付规则明确：从用户的具体做法还原真实目标、必要约束和成功结果，比较实际效果与总成本后自主选方法，不受现有代码、计划或沉没成本锁定，也不为理论最优无限寻优。",
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
     "text_ref": "9. 所有项目、root、后代、新对话和压缩续作都区分用户目标/更正与可换方案；计划、代码、测试、草稿和审查不产生新需求。现行工程与交付规则明确：从用户的具体做法还原真实目标、必要约束和成功结果，比较实际效果与总成本后自主选方法，不受现有代码、计划或沉没成本锁定，也不为理论最优无限寻优。",
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

9. 所有项目、root、后代、新对话和压缩续作都区分用户目标/更正与可换方案；计划、代码、测试、草稿和审查不产生新需求。现行工程与交付规则明确：从用户的具体做法还原真实目标、必要约束和成功结果，比较实际效果与总成本后自主选方法，不受现有代码、计划或沉没成本锁定，也不为理论最优无限寻优。

10. 先问结果是否来自用户意图、必要实现或真实质量，再比较同一完整验收；“完善项目”包括自主补功能，实施中指出 bug 默认修复，明确只问或不改时除外。

11. 长程实质范围/方案变更、压缩后重规划、同类失败循环和阶段交付前复用一路独立子代理审查；审查指出需求来源与可删实现，不凭代码量、耗时或偏好砍功能。

12. 新增实现须对应当前具体未满足项；无依据增量属于 prohibited_unjustified_complexity（禁止的无依据复杂度），换简单路径继续，不缩权、不限制重建与委派，也不把工程选择甩给用户。

13. Agent 自造复杂度导致失败时先删层，并删改只维护废层的测试；用户已确认的删除不能被模型以恢复或安全名义撤销，整个来源根离线仍只表示本次不可用。

## 当前怎样实现

- cross_harness_common_contract（跨运行框架共同合同）要求在实际执行地点运行同一 E resolver（规则解析器），读取已验证根和目录链规则；云端客户端不把本机路径解释成云端路径，不另存手机规则。各宿主使用自己的 adapter（适配器），Codex 日志、Hook（钩子）、字段和工具名不是其他框架日常工作的前置条件。判断产物可绑定该宿主真实 assistant（助手）消息或 tool call（工具调用），不要求必须是 final（最终回复）。

- semantic_capability_mapping（能力语义映射）按当前宿主真实 shell、MCP、脚本、浏览器和协作能力完成目标。Codex 专用工具、Hook（钩子）、CODEX_* 环境和 App 任务身份不是其他宿主普通施工的前提；缺哪个能力只关闭对应动作，不静默启动 Codex 代替用户选择。

- shared_execution_resources（共享执行资源）按一次真实操作协调前台桌面、浏览器会话与鼠标键盘；开始前观察目标、结束即交还，无冲突文件工作继续。

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
     "text_ref": "- quality_first_model_routing_v1 允许在本人已授权且宿主真实支持的候选内，按质量与完成任务总成本选择型号和思考投入；必要时可高于根或父。旧模型基值加法、根/父组合分数和同型号不得升档不再作为现行准入，用户明确的型号、厂商、预算与思考限制继续传给后代。",
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
     "text_ref": "- quality_first_model_routing_v1 允许在本人已授权且宿主真实支持的候选内，按质量与完成任务总成本选择型号和思考投入；必要时可高于根或父。旧模型基值加法、根/父组合分数和同型号不得升档不再作为现行准入，用户明确的型号、厂商、预算与思考限制继续传给后代。",
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

- quality_first_model_routing_v1 允许在本人已授权且宿主真实支持的候选内，按质量与完成任务总成本选择型号和思考投入；必要时可高于根或父。旧模型基值加法、根/父组合分数和同型号不得升档不再作为现行准入，用户明确的型号、厂商、预算与思考限制继续传给后代。

- model intuition precedence 让模型根据目标、风险、信息增益、延迟、耦合、可逆性和净收益选择方法。

- task_file_lifecycle_cleanup（任务文件收口）覆盖所有项目、根和后代下载/生成/复制/解包的全部类型文件；落盘前确定用途，下载归，自产临时物归<task-id>或确需的项目工作区。归位优先移动，必须先复制时核对目标可用及引用后删除本任务可处置源副本。

- 用完、阶段结束和交付前检查本任务所有真实落点，包括Codex自有目录、工具固定输出、预览图、失败产物与空目录。只保留有明确消费者且确需本机副本的交付/维护/恢复材料，说明暂留理由与退出条件；不按年龄或目录整库清理，不动原件、其他任务和在用状态。

- 清理失败不算收口。只有进程启动前的Codex命令层blocked by policy/Rejected才沿授权合同对同一已核验路径改用Windows回收站并回读；普通占用、权限或路径失败不套用，仍受阻则说明精确残留、原因和下一处理条件，不新建后台清理器。

- Skill、Plugin、模板和计划默认只是建议性制品，不能凭正文里的 MUST 自行升级为硬门。

- 初始工具列表不是能力上限；先查 owner adapter（执行适配器）、固定 CLI（命令行工具）/API 和当前 metadata（元数据），确认实质缺口后才降级或建议插件。

- Codex UserPromptSubmit与SubagentStart在各自真实宿主上下文核对model、effective effort（思考等级）、根/父子关系、turn hash（内容指纹）、E版本及完整集合指纹。专用元数据只决定相应原生能力，不成为其他宿主普通实现的前提，不从标题或自行声明产生身份。

::screen{#agents-capability-routing-08 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-08",
  "section": "tech",
  "title": "技术实现与依据（四）",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- 同 task 的续写日志可能在原 UUID 后附第二 UUID。现行 runtime（运行环境） 按准确 session_id/turn_id 在规范会话根定位对应 turn_context（回合上下文），核对会话身份；旧 locator（原件定位记录） 缺本回合时转到匹配续写文件，不按文件时间或历史模型推断当前身份。",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- 同 task 的续写日志可能在原 UUID 后附第二 UUID。现行 runtime（运行环境） 按准确 session_id/turn_id 在规范会话根定位对应 turn_context（回合上下文），核对会话身份；旧 locator（原件定位记录） 缺本回合时转到匹配续写文件，不按文件时间或历史模型推断当前身份。",
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

## 技术实现与依据（四）

- 同 task 的续写日志可能在原 UUID 后附第二 UUID。现行 runtime（运行环境） 按准确 session_id/turn_id 在规范会话根定位对应 turn_context（回合上下文），核对会话身份；旧 locator（原件定位记录） 缺本回合时转到匹配续写文件，不按文件时间或历史模型推断当前身份。

- 收到可信身份后由 AI 按任务语义与净收益选择 0–10 个子代理，以及实际支持且获准的 GPT-6 Luna、Sol、Astra、effort（思考等级）、scope 和 fork；稳定 Hook（钩子） 只验证身份、E rules 与参数，不选择也不创建。新支路、阻塞、更正、压缩、子任务终止或槽位释放会改变选择时重判；无新证据不逐工具重算。受保护判断尚未完成时，只等待依赖它的精确敏感披露或不可逆终步，不相关的思考、可逆修复、测试、验证与恢复继续。

- 根先比较自己直接完成与根子协作：根可亲自研究、设计、实现、验证和交付。按子任务剩余难度选完整组合：GPT-6 Luna 可做范围清楚且可验证的完整实现、测试、排障或研究；GPT-6 Sol 可做复杂设计、完整子系统、跨模块调试和审查；GPT-6 Astra 用于仍需额外能力、困难支路有效并行或必要独立反证。型号与effort（思考等级）分别判断，父子可带证据双向讨论；比较交接、执行、往返、审阅、冲突、等待和返工的未来总投入，不把已花的根成本或名义 token 单价当任务费用。

- 非OpenAI根默认自行工作，不创建自身、同谱系Flash或其他第三方子代理；只有适用的用户OpenAI委派许可才进入该候选范围，仍可选择不派。普通创建与续聊直接用openai_child，显式传准确角色、模型、思考档位、任务名与正文，不传fork_turns；不能借spawn_agent、AICLI或后台任务绕行。受限桥接child继续受原父任务许可约束，需要再分工由原父任务安排。

- 受保护判断的专用桥接与普通经济委派分开：非OpenAI根缺对应资格且确需判断时，常规用GPT-6 Sol High专用角色、升级用GPT-6 Astra High专用角色，直接调用openai_child并只传agent_type/model/reasoning_effort/task_name/message五字段；两档同步返回持久判断及原生证据定位，不混入wait_ms、thread_id、reply_to、fork_turns或其null占位。旧父会话的工具定义可能尚未更新，真实不可用只局部处理；专用入口不授予普通OpenAI委派许可或实际effect（外部现实动作）权。

- 同一目标由一个主任务负责战略、关键决策与最终验收；独立顶层任务必须有可独立交付的成果、责任必要与正净收益。项目数量、工作量、槽位已满或当前不能 Claim 都不单独成立。

- time_sensitive_response_flow 在验证码或登录确认的真实短窗口内主动跟进已可读来源，按能力、成本和剩余窗口选择现成等待或有界查询；不能刚开始等待就用任意延后定时任务代替，也不推广为数小时常驻或全局轮询。

- 用户原意可从上下文可靠还原时容纳错字和转写误差；错误前提、伪需求或不合适做法须据证质疑并给替代，歧义只有影响目标/授权/结果时才问。已确认功能和本人明确更正仍保留。

::screen{#agents-capability-routing-09 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-09",
  "section": "tech",
  "title": "技术实现与依据（五）",
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
     "text_ref": "技术实现与依据（五）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- cross_owner_dependency_budget 先用最小因果证据区分 A 自身问题和依赖 B 缺陷；确有影响时沿已有授权修复 B 的精确范围或正式交接。A 局部成功不取消 B 义务，未修原因、影响和接手状态必须向本人披露，不接管无关业务。",
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
     "text_ref": "技术实现与依据（五）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- cross_owner_dependency_budget 先用最小因果证据区分 A 自身问题和依赖 B 缺陷；确有影响时沿已有授权修复 B 的精确范围或正式交接。A 局部成功不取消 B 义务，未修原因、影响和接手状态必须向本人披露，不接管无关业务。",
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

## 技术实现与依据（五）

- cross_owner_dependency_budget 先用最小因果证据区分 A 自身问题和依赖 B 缺陷；确有影响时沿已有授权修复 B 的精确范围或正式交接。A 局部成功不取消 B 义务，未修原因、影响和接手状态必须向本人披露，不接管无关业务。

- PreToolUse（工具执行前复核） 在真实 spawn（创建子代理） 或 openai_child 调用前重建现场身份，复核当前支持、适用用户许可、参数与上下文继承；SubagentStart 再以真实 child turn context 绑定结果。根/父档位不另作硬上限。

- 完全无 Hook（钩子） 的旧 root 可以把同一任务中用户已有的自然语言 model/effort（思考等级） 确认规范化为 canonical ID，写入并回读同一 CODEX_THREAD_ID 的 user_attested_verified；E identity 换代时重读、重派生并刷新快照，不重复索要确认，规则撤销该路径时失败关闭；宿主身份恢复后优先用宿主，child 从不借父绑定。

- blind acceptance detection 在内部测试不能代表自然语言、UI、provider、模型或恢复结果时，给 fresh evaluator 最小充分的用户可见目标和正常环境，不给 diff、根因、修复线索与无关项目细节。

- natural intent blind routing E2E（端到端验证） 保持正常能力 metadata（元数据） 可见，但提示只说自然用户目标；验收同时检查无提示选路和可见结果，点名路线只记录为 directed execution test。

- 版本、build（构建号）和版本化安装路径用于观察、复现与已测发布，不作为一般软件更新的永久准入门。兼容判断依真实稳定产品身份、签名或主体、公开接口、配置结构、事件和实际能力；更新后只暂停实测缺失的能力，普通工作继续。API或文件格式版本、锁文件、测试夹具以及用户明确选择的固定运行版仍可以严格约束；接口未知不等于通过，也不凭新版本号判失败。 Codex专属Hook（钩子）另外依赖稳定package family、signer/principal（受验证的执行主体）、bridge key与精确事件，当前目录缺项只停受影响委派。

- 同一官方主体更新或 optional metadata（元数据） 缺失不触发 step-up/BLOCK；只有精确 event 或 capability 现场不存在时关闭对应能力，普通项目不受影响。

- change_surface_validation 按现实风险和 diff 影响面选择 focused 或 standard 验证；E rules 快速发布目标 180 秒内并分列测试、Git、push/readback、UAC activation 墙钟。

::screen{#agents-capability-routing-10 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-10",
  "section": "tech",
  "title": "技术实现与依据（六）",
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
     "text_ref": "技术实现与依据（六）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- product_requirement_complexity_authority 与 user_intent_over_implementation 把用户结果和可换方案分开；模型自造的企业治理、安全/恢复目标、理论风险和未来需求不属于用户要求。",
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
     "text_ref": "技术实现与依据（六）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- product_requirement_complexity_authority 与 user_intent_over_implementation 把用户结果和可换方案分开；模型自造的企业治理、安全/恢复目标、理论风险和未来需求不属于用户要求。",
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

## 技术实现与依据（六）

- product_requirement_complexity_authority 与 user_intent_over_implementation 把用户结果和可换方案分开；模型自造的企业治理、安全/恢复目标、理论风险和未来需求不属于用户要求。

- requirement_inflation_review 在长程实质节点用独立子代理审查原意、更正、提议结果、自加目标/流程/假设、现有能力和可删实现；主线继续不冲突工作，审查复用，不逐工具派单或定时轮询。

- minimum_sufficient_implementation_guard 冻结完整功能和真实质量而非实现；新增结构必须对应当前未满足项，未来猜想、惯例、最佳实践、额度或审查偏好不能举证。它只约束方法，不是产品停工门；有依据且没有等价更小实现时接受必要复杂度并按实测净增量调整基线继续。

- complexity_failure_collapse 因新增层/状态/证明链失败时先删层或绕开，并同步删改只维护废实现的测试和文档；不能继续叠保护、回执和后备状态。恢复服从用户语义，不替用户撤销已确认的删除或其他操作。

- 现有项目/宿主持久状态分开保留用户结果、更正、授权、可推翻方案和完成/剩余结果。压缩、交接、更正、反复失败或扩架构前先恢复原意，再读必要代码；不保存隐藏推理或为此新建台账、服务、数据库。

## 执行流程

1. 理解自然语言目标、更正与真实质量，把它们和可替换方案分开；不把猜想写成验收

2. 查询已有 Owner、原生入口和当前能力 metadata（元数据）；实证缺口出现前不安装第二套路线

3. root 由 UserPromptSubmit、child 由 SubagentStart 在 0–10 判断前取得可信身份与当前 E identity

::screen{#agents-capability-routing-11 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-11",
  "section": "tech",
  "title": "技术实现与依据（七）",
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
     "text_ref": "技术实现与依据（七）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "4. AI 评估独立可验性、质量、墙钟、写入冲突、资源和 slots，自主决定 0–10、家族、effort（思考等级） 与 scope",
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
     "text_ref": "技术实现与依据（七）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "4. AI 评估独立可验性、质量、墙钟、写入冲突、资源和 slots，自主决定 0–10、家族、effort（思考等级） 与 scope",
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

## 技术实现与依据（七）

4. AI 评估独立可验性、质量、墙钟、写入冲突、资源和 slots，自主决定 0–10、家族、effort（思考等级） 与 scope

5. root 派出 child 后继续战略、依赖、风险和不冲突工作，不把等待冒充进展

6. 每次真实创建前由PreToolUse（工具执行前复核）复核现场身份、当前支持、用户限制和参数；事实变化则取消本次创建并重新判断，不扩大授权。

7. 能力确实缺失时才安装官方运行时或提出精确插件；任务确需新软件时，主驾驶默认装到 E 盘现有合适目录；安装器或系统组件必须使用固定位置时沿原生路线并说明，不借此迁移已有安装。官方更新只按稳定主体、事件和能力现场局部降级

8. 长程实质变更、压缩重规划、失败循环和阶段交付前独立审查：先确认是不是用户要的结果，再比较完整验收下的实现总成本

9. 短路线满足同一验收就直接采用；不满足时只增加解决已证缺口的最小技术层

10. 新增层导致失败先删层及只维护废层的测试；用户目标继续，不靠缩权、少用代理或新增审批治理复杂度

11. 实现知识可能污染验收时，另给 fresh evaluator 最小自然目标和正常环境，不暴露内部答案

::screen{#agents-capability-routing-12 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-12",
  "section": "tech",
  "title": "技术实现与依据（八）",
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
     "text_ref": "技术实现与依据（八）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "12. 最后分别验证能力可用、route_selected_without_hint、用户可见结果与剩余 Unknown（未验证）；定向测试单列，短时通过不外推长期稳定，目标完成即结束",
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
     "text_ref": "技术实现与依据（八）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "12. 最后分别验证能力可用、route_selected_without_hint、用户可见结果与剩余 Unknown（未验证）；定向测试单列，短时通过不外推长期稳定，目标完成即结束",
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

## 技术实现与依据（八）

12. 最后分别验证能力可用、route_selected_without_hint、用户可见结果与剩余 Unknown（未验证）；定向测试单列，短时通过不外推长期稳定，目标完成即结束

13. 交付前收起所需文件并清理本任务无意义落地物，回读删除源已消失且保留结果仍可用；仍需暂留或实际受阻的精确范围如实说明

::screen{#agents-capability-routing-13 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-13",
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
| Advisory artifact（建议性制品） | 提供方法和入口，但不会自动取得更高优先级、授权或施工 Owner。 |
| 能力显著性 | metadata（元数据） 先把可能相关的能力放回注意力，正文仍按当前问题的净收益渐进读取。 |
| 身份先于委派 | 代理名称和模型自报不算身份；没有可信身份时只关闭委派，主任务继续。 |
| Hook（宿主钩子） | 宿主在固定事件点注入或复核可信事实；它不调度代理、不创建 child、不产生授权。 |
| UserPromptSubmit / SubagentStart | 前者为 root 请求，后者为 child 启动；都必须在该代理进行 0–10 判断前提供自己的 verified identity。 |
| PreToolUse | 真实创建前再次核对身份、用户限制、候选支持和参数；不能代替模型判断或变成第一次取得身份。 |
| Implementation-blind fresh E2E | 让不知道 diff、根因和预期路线的新评估者，按最小用户目标走正常产品路径。 |
| Natural-intent blind routing | 提示不点名能力路线，正常 metadata（元数据） 仍可见；同时验证 AI 自己选路和最终用户结果。 |

::screen{#agents-capability-routing-14 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-14",
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
| Directed execution test | 明确告诉模型使用哪个 Skill、tool 或 provider 的定向测试，只证明该路线能执行，不证明自主路由。 |
| Official update continuity | 官方同主体更新以稳定 package family、签名、事件和当前能力发现延续，不把易变版本号或安装路径当身份。 |
| Complete acceptance floor（完整验收底线） | 固定用户结果与真实质量，不固定模型方案；功能、好用、正确、可靠、恢复、性能、可维护、现有兼容和已证扩展轴不因瘦身丢失。 |
| Requirement inflation review（反需求膨胀审查） | 长程实质节点独立检查需求来源及可删实现，只拦模型自加目标、流程和假设，不砍用户功能或收窄模型自治。 |
| Minimum sufficient implementation（最小充分实现） | 满足完整验收所需的最少技术层、节点、状态和人工步骤；不是靠删产品功能获得的表面简单，也不把必要复杂度或预算变成停工理由。 |
| Complexity failure collapse（复杂度失败收缩） | Agent 新增的层导致失败时，先删除或绕开该层再重判；不能继续给长路线叠证明和保护结构。 |
| 证据式降级 | 只有入口真实缺失、失败或策略阻断时才换路线，不因想象中的风险先降级。 |

## 专业定义

我只需说清要做成什么；AI 自己选工具、方法和并行度，既不把临时方案变成新需求，也不借“简化”砍掉产品功能。

::screen{#agents-capability-routing-15 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-15",
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
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 能力发现不会扩大用户授权",
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
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 能力发现不会扩大用户授权",
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

工具、Skills、插件和模型很多，真正困难的不只是选哪个，还要防止两种错误：借反膨胀删掉真实产品需求，或把产品复杂误当成可以无限增加技术层的理由。固定模板会让简单任务膨胀；自造层失败后继续叠门又会把工程成本和等待转嫁给用户。

## 边界

- 能力发现不会扩大用户授权

- 账号、插件、管理员权限令牌和子代理都不能绕过 Owner（责任源）或 effect（外部现实动作）边界

- 不为假想未来预装动态配置服务、兼容层或第二套 Provider（服务入口）

- 后代继承用户明确的范围、厂商、型号、预算与思考限制，并核对真实可用候选；根/父当前型号与档位不构成经济上限。原生跨型号或档位采用无历史或有限历史上下文，实际身份与档位不得按名称或比较规则改写。

- Hook（钩子） 提供可信身份、原意提醒和创建前复核；0–10、家族、方案、分工与验收由 AI 决定

- 旧 root thread binding 仅用于宿主完全无 Hook（钩子） 或注入，只保存 canonical ID；E 代际变化不使已成立的用户确认失效，child 不继承且不能覆盖冲突的宿主身份

- 不依赖 Stop Hook（钩子）；回执缺失不能阻塞普通工具或最终答复

- app version、build、versioned executable path、update epoch 和 optional metadata（元数据） 不能成为准入门

::screen{#agents-capability-routing-16 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-16",
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
     "text_ref": "- **任务文件清理失败或仍被使用**：不把主产物成功当作清理完成；保留在用和必要恢复材料，继续处理可处置项。命令层启动前明确拒绝才用同目标回收站后备，真实残留给出路径、理由与下一条件。",
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
     "text_ref": "- **任务文件清理失败或仍被使用**：不把主产物成功当作清理完成；保留在用和必要恢复材料，继续处理可处置项。命令层启动前明确拒绝才用同目标回收站后备，真实残留给出路径、理由与下一条件。",
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

- 盲测不是每次机械执行；客观需要时也不能因省上下文或反膨胀而跳过

- 测试提示点名 Skill、tool、plugin、provider、内部路径或预期路线时不得称为 blind routing E2E（端到端验证）

- 反膨胀不删除或降级用户功能、真实质量与已证扩展点；完善项目不被缩成只修 bug，也不靠缩权、限代理/对话数或逐项审批维持简单

- 无依据目标或技术层只禁止相应增量，换简单路径继续；独立审查不可用如实报告，不以自审冒充，不新建审查平台

- 入口提醒生效、当前行为与长期稳定性分别证明；字符串检查、全绿报告或短时 E2E（端到端验证） 不证明长程永不偏离

## 失败与恢复

- **任务文件清理失败或仍被使用**：不把主产物成功当作清理完成；保留在用和必要恢复材料，继续处理可处置项。命令层启动前明确拒绝才用同目标回收站后备，真实残留给出路径、理由与下一条件。

- **委派身份不可验证**：停止 spawn（创建子代理），但继续本地调查、实现、测试和答复。

- **PreToolUse（工具执行前复核） 发现身份、家族、effort（思考等级）、参数或 fork 已漂移**：取消这一次 spawn（创建子代理），回到当前身份和任务范围重判，不扩大授权。

::screen{#agents-capability-routing-17 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-17",
  "section": "tech",
  "title": "出问题时（三）",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **旧 root 没有 Hook（钩子），且同一任务中不存在用户对 model/effort（思考等级） 的明确自然语言确认**：不建立对话绑定、不猜身份；主任务继续，只有委派不可用。",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **旧 root 没有 Hook（钩子），且同一任务中不存在用户对 model/effort（思考等级） 的明确自然语言确认**：不建立对话绑定、不猜身份；主任务继续，只有委派不可用。",
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

## 出问题时（三）

- **旧 root 没有 Hook（钩子），且同一任务中不存在用户对 model/effort（思考等级） 的明确自然语言确认**：不建立对话绑定、不猜身份；主任务继续，只有委派不可用。

- **provider 缺失或账号不可用**：报告确切缺口，不伪造第二 provider 或静默换账号。

- **盲测提示泄露 Skill、工具、Provider 或预期路线**：把该结果降为定向执行证据，用新的独立上下文和纯自然意图重新验收。

- **官方更新后某个精确 event 或 capability 不存在**：只关闭受影响的 Hook（钩子） 或能力并报告缺口；不因版本号或路径变化阻塞普通项目。

- **子代理中断**：先判断旧上下文和执行状态是否仍有接续价值：同一子任务且事实仍准确时恢复原会话；旧事实失效或独立新工作更适合新上下文时，先核清并停止或交接原任务，再在原许可内新建。部分结果不冒充完成。

- **提议目标或技术层没有用户意图、必要实现或真实质量依据**：禁止无依据增量，保留完整用户目标，回到现有入口或更短路线继续；不把“还可以更全面”加入完成条件。

- **Agent 新增的服务、状态机、证明链或验证层导致任务失败**：先移除或绕开该复杂度，并删改只维护废实现的测试；恢复用户原意后仅为当前真实缺口补最小实现，不限制模型修复、重建或委派。

::screen{#agents-capability-routing-18 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-18",
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
     "text_ref": "- 活动能力与运行方式专题",
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
     "text_ref": "- 活动能力与运行方式专题",
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

- 活动能力与运行方式专题

- 活动原生身份、模型与思考选择、OpenAI许可和上下文接续

- 活动用户目标、相称实现、独立审查与交付语义

- 把活动委派门禁恢复到注意力的窄入口

- 稳定 Hook（钩子） bridge；只核对事件、受管 runtime（运行环境） 指纹和调用边界

- 原有宿主事件的身份注入、原意提醒、准确续写回合定位和创建前复核

- 准确 turn_id 续写定位、缺失身份时仍提醒原意及身份读取回归

- 实现盲测、自然意图路由、无提示选路与定向测试边界回归

::screen{#agents-capability-routing-19 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-19",
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
     "text_ref": "- 官方更新稳定主体、版本路径非准入和能力局部降级回归",
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
     "text_ref": "- 官方更新稳定主体、版本路径非准入和能力局部降级回归",
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

- 官方更新稳定主体、版本路径非准入和能力局部降级回归

- 只有实证能力缺口时读取的插件 metadata（元数据）

## 如何验证

- NativeEconomyRoutingGate 的验证对象包括判断前可信身份、同版E规则、当前候选支持与用户限制，以及PreToolUse（工具执行前复核）创建前复核；本页不把规则发布当成所有真实委派路径已经重测。

- AgentRuntimeCompatibility 验证官方同主体更新以稳定 package/signature/event/capability 连续，app version 和 versioned path 不参与准入

- AgentAutonomyPolicy 与 AttentionFidelityPolicy 验证模型主动识别盲测、提示不泄露路线、route_selected_without_hint 和 directed_execution_test 的证据边界

- 当前 E171 根规则与能力合同已在 1aa0b0a0b9dbd9f6864d9cb010c04fccdf42e372 发布激活；本轮快照重新运行活动 release validator（校验器）、合同覆盖和 Skill 供应验证。E118 曾采用四档模型与根/父双上限，E167 曾恢复质量优先的候选边界；当前 E171 延续质量优先原则，按真实支持与许可在 GPT-6 Luna、Sol、Astra 中比较剩余难度和完成总成本，受保护判断按 Sol High+ 常规、Astra High+ 升级分档。独立责任判断、局部 Owner CAS、依赖收口和短时流程继续按各自当前合同处理。历史上限与旧型号岗位不能继续当作当前规则；本次没有重跑完整 Local 回归，不把 E98 38/0 当作本代全量通过。

- 2026-09-02 安装 Inspect 回读 active_verified；runtime（运行环境） SHA-256=a67b98955b854bad5f2c22ba057d621bf6ae0e1598181bf2eaa8301002b9a530，UserPromptSubmit/SubagentStart/PreToolUse 三事件 trusted、enabled 且 additionalContextLimit=0。现有提醒已到达真实子代理，不代表所有长程任务从此不会偏离。

- implementation-blind fresh E2E（端到端验证） 只有在 fresh evaluator 未获得 diff、根因或路线提示，并真实走完用户路径后才成立

::screen{#agents-capability-routing-20 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-capability-routing-20",
  "section": "tech",
  "title": "依据与来源（三）",
  "links": [
   {
    "text": "上一个模块 规则与合同",
    "href": "/projects/agents/rules-contracts/"
   },
   {
    "text": "下一个模块 授权与 Owner",
    "href": "/projects/agents/authorization-owner/"
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
     "text_ref": "依据与来源（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- natural-intent blind routing E2E（端到端验证） 必须同时证明 AI 自己选择了正确路线和用户可见结果正确；只命中工具或只得到答案都不完整",
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
     "text_ref": "依据与来源（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- natural-intent blind routing E2E（端到端验证） 必须同时证明 AI 自己选择了正确路线和用户可见结果正确；只命中工具或只得到答案都不完整",
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

## 依据与来源（三）

- natural-intent blind routing E2E（端到端验证） 必须同时证明 AI 自己选择了正确路线和用户可见结果正确；只命中工具或只得到答案都不完整

- 聚焦 Hook（钩子）、合同和定向执行回归只能证明对应机制，不冒充某个真实自然语言任务的盲测结果

## 与其他模块的关系

能力路由决定怎样做、是否并行和怎样验收；Hook（钩子） 只为该判断提供可信身份并在创建前复核。它不产生用户授权、Execution Owner（施工责任） 或 E release，这些分别由授权和保护合同拥有。
