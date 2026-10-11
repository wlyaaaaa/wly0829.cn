---
{
 "title": "AI整理和核对，人做知情选择；谁都不是自动正确",
 "kind": "project",
 "url": "/projects/personal-health/health-owner-boundary/",
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
  "page": "personal-health-health-owner-boundary",
  "kind": "project",
  "title": "AI整理和核对，人做知情选择；谁都不是自动正确",
  "url": "/projects/personal-health/health-owner-boundary/",
  "parent": "personal-health",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "项目规则、设备流程与采集代码 10 月 11 日只读核对，源码最后变更 10 月 7 日；未读取任何健康正文，实际采用了哪些结果不知道"
  }
 },
 "source": {
  "page": "sources/pages/personal-health-health-owner-boundary/page.json",
  "sha256": "c7933156a0af30508a1d856c23ec8d14b225d48652232d056ad56abcb12f0f97",
  "converted_at_beijing": "2026-10-11T19:07:11+08:00"
 }
}
---

::screen{#personal-health-health-owner-boundary-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-01",
  "section": "top",
  "title": "AI整理和核对，人做知情选择；谁都不是自动正确",
  "links": [
   {
    "text": "回到项目 → 个人健康",
    "href": "/projects/personal-health/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-health/#ai-brief"
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
     "text_ref": "AI整理和核对，人做知情选择；谁都不是自动正确",
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
     "static_note": "截至 10 月 11 日 · 项目规则、设备流程与采集代码 10 月 11 日只读核对，源码最后变更 10 月 7 日；未读取任何健康正文，实际采用了哪些结果不知道",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人健康证据与安全决策 · 功能说明",
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
     "text_ref": "AI整理和核对，人做知情选择；谁都不是自动正确",
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
     "static_note": "截至 10 月 11 日 · 项目规则、设备流程与采集代码 10 月 11 日只读核对，源码最后变更 10 月 7 日；未读取任何健康正文，实际采用了哪些结果不知道"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人健康证据与安全决策 · 功能说明"
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
   "asset": "_library/module-illustrations/personal-health/health-owner-boundary-v01.png",
   "key": "main-personal-health",
   "source_phrase": "右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。",
   "sha256": "7c02ade57a165c107019352b7d9602ce11d4af40c370b0d458f2c50d1d483f42",
   "status": "ready"
  }
 ]
}
```

# AI整理和核对，人做知情选择；谁都不是自动正确

〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕

个人健康证据与安全决策 · 功能说明

让专业能力、证据和用户自主同时存在：既不让 AI 冒充医生，也不把医生、机构或设备写成无需说明依据的终局权威。

**当前情况：**设备数据现在每 7 天自动采集一次，但采集脚本从不自己改当前健康认知：结果先由健康项目的 AI 审阅，合格且和现实相关的才局部采用；真实的医疗方案仍由我在医生参与下作知情选择。哪些结果已经被采用，本页没有读健康内容，不知道。紧急情况仍回到现实医疗。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-health-health-owner-boundary-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "这项功能怎样使用"
   },
   {
    "id": "module-product",
    "text": "这项功能怎样使用"
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

医生有 AI 没有的问诊、查体、诊断和处方能力，但也可能受信息不足、时间、机构流程、资源、经验偏差或利益关系影响；AI同样会遗漏、误读和过度自信。重大决定需要校准信任，而不是更换一个盲从对象。

## 举个实际例子

医生建议一项长期、昂贵又很难撤回的治疗，我却没听懂为什么非做不可。AI 不会抢着判医生错，更不会叫我擅自停药；它会把现有依据、没讲清的前提、其他合理选择和复查条件列出来，帮助我向原医生追问，必要时准备独立专科第二意见。

## 最后我会得到什么

得到一条可追责的决定边界：报告和设备提供有限证据；医生提供临床能力并解释依据；AI交叉核对、暴露未知和保护选择空间；非紧急且本人有决定能力时，由本人作最终知情选择。

::screen{#personal-health-health-owner-boundary-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-03",
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
     "text_ref": "可用于当前判断",
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
     "text_ref": "可用于当前判断",
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

## 可用于当前判断

事实、选项、主要收益和风险、替代方案与停止条件已说清，本人理解后可以作选择；医生和 AI 都保留可被质疑和纠正的责任。

## 需要复核

意见冲突、依据不清、决定重大或可能存在利益关系时，要求解释并取得适当的独立复核，不靠身份和投票决定。

## 本轮不可用

急症不等待完整资料或第二意见；缺少查体、诊断或可靠来源时，AI明确不能判断并把用户带回现实医疗。

::screen{#personal-health-health-owner-boundary-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-04",
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
     "text_ref": "1. **系统核对并处理**　AI整理相互支持或冲突的证据，比较收益、风险、负担和退出条件；红旗情形明确提示及时求助。",
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
     "text_ref": "1. **系统核对并处理**　AI整理相互支持或冲突的证据，比较收益、风险、负担和退出条件；红旗情形明确提示及时求助。",
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

给出健康疑问或选项，请 AI 帮忙核对依据与真实取舍。

## 需要准备什么

- 本人当前目标与现实限制

- 尚未记录而会改变判断的症状或专业意见（如有）

## 从开始到拿到结果

1. **系统核对并处理**　AI整理相互支持或冲突的证据，比较收益、风险、负担和退出条件；红旗情形明确提示及时求助。

2. **交付与接续**　交回可复查的选择依据和不确定性；不把 AI、设备或医生写成无需解释的终局权威。

::screen{#personal-health-health-owner-boundary-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-05",
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
     "text_ref": "1. 高风险和不可逆决定需要更高证据门、合理替代与明确停止或复查条件。",
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
     "text_ref": "1. 高风险和不可逆决定需要更高证据门、合理替代与明确停止或复查条件。",
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

**10 月 11 日核对**　单次采集仍返回“需要健康审阅”“未更新当前依据”“未新建后台任务”三个固定字段；另有 PCConfig 登记的每 7 天刷新任务，它只做采集、核对和简报，同样不写当前依据。“需要健康审阅”是固定规矩，不代表这份结果现在还没处理；某份结果是否已被采用，以当前依据和来源记录为准，本次没有读取，所以是未知。

## 关键规则与设计选择

1. 高风险和不可逆决定需要更高证据门、合理替代与明确停止或复查条件。

2. 利益关系要被说明和纳入判断，但不能据此预设恶意或否定专业能力。

3. 第二意见是适当专科对同一原始资料的独立复核，不是再问一次 AI，也不是多数投票。

4. AI 与医生冲突时说明冲突来自哪些事实、适用范围或假设，不擅自改药。

5. 报告实测、医生解释、本人陈述、AI 分析与明确未知保持分层。

6. 采集链（含每 7 天的定时任务）只交结果、不改当前健康认知；健康项目的 AI 审阅决定是否局部采用，不给我增加每周逐份手工审阅的事；真实医疗选择仍是我的。

## 当前怎样实现

- 采集结果把“需要健康审阅”“当前依据是否更新”“这次是否新建后台工作”写成机器可验字段；后者只说明这次调用，不说明整个项目没有定时任务。

- 每 7 天的刷新任务由 PCConfig 登记，跑完写独立回执，不写当前依据。

::screen{#personal-health-health-owner-boundary-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-06",
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
     "text_ref": "- 简报的下游规则要求字段自身可用、来源说明可用、与问题相关并有现实影响，才可能进入当前依据。",
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
     "text_ref": "- 简报的下游规则要求字段自身可用、来源说明可用、与问题相关并有现实影响，才可能进入当前依据。",
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

- 简报的下游规则要求字段自身可用、来源说明可用、与问题相关并有现实影响，才可能进入当前依据。

- Health Owner（健康资料责任方）由健康项目的 AI 承担审阅：看简报、结合当前事实，只局部更新 CURRENT.md，并保留来源类型、时间和不确定性。

- 高风险或治疗判断结合当前个人事实并查询当前权威医疗指导。

- 项目明确不建设疾病本体、诊断引擎、总分、持续同步、后台监测、数据库、RAG、服务或队列。

- 网站对这一页不做自动更新：它是我点名才更新的说明页，不监听健康数据，也不因源码、测试或技能变化自动建网站任务。

::screen{#personal-health-health-owner-boundary-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-07",
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
     "text_ref": "1. 接收字段级可用／不可用结果（来自我当场的刷新或每 7 天的定时任务）。",
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
     "text_ref": "1. 接收字段级可用／不可用结果（来自我当场的刷新或每 7 天的定时任务）。",
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

## 执行流程

1. 接收字段级可用／不可用结果（来自我当场的刷新或每 7 天的定时任务）。

2. 确认当前健康问题和急症红旗。

3. 判断来源、时间、相关性与现实影响。

4. 必要时核验当前权威医学指导。

5. 决定不更新、提出一个最小问题或局部更新当前依据。

6. 保留收益、风险、替代方案和停止／复查条件。

::screen{#personal-health-health-owner-boundary-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-08",
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
| Health Owner（健康资料责任方） | 决定个人健康事实怎样被处理和局部更新的审阅环节，由健康项目的 AI 承担；它不是自动写入，也不是要我逐份手工审阅。真实医疗方案仍由我作知情选择。 |
| Clinical boundary（临床边界） | AI 和设备不能替代查体、诊断或处方；医生意见也不能替代用户的知情选择。 |
| Red flag（紧急红旗） | 可能需要及时现实医疗处理的危险信号；不等待设备采集或评分。 |
| Second opinion（第二意见） | 由另一位合适专科医生独立审阅同一原始资料；可以确认、质疑或提出其他选择。 |
| Low-burden action（低负担行动） | 在医学上安全时，优先选择能明显改变判断、又可暂停和复查的最小下一步。 |

## 专业定义

医生提供临床能力，AI 帮助核对证据和保护选择空间，报告与设备提供有限观察；任何一方都应允许质疑、解释和复核。

::screen{#personal-health-health-owner-boundary-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-09",
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
     "text_ref": "- 不公开 CURRENT.md、报告、诊断、检查结果、药物、过敏、个人指标或个体建议。",
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
     "text_ref": "- 不公开 CURRENT.md、报告、诊断、检查结果、药物、过敏、个人指标或个体建议。",
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

解决设备数据自动写入个人事实、模型建议冒充医生结论、“需要审阅”被误当成我的待办、健康项目演变成监控／评分系统，以及公开页泄露个人健康载荷。

## 边界

- 不公开 CURRENT.md、报告、诊断、检查结果、药物、过敏、个人指标或个体建议。

- 不把设备来源写成唯一具体设备证明，也不声称当前在线。

- 不使用健康数据截图、模拟指标图、风险评分或装饰性医疗图表。

- 来源项目 PRIVATE（私有），不提供猜测或不可访问的 GitHub 按钮。

## 失败与恢复

- **自动链尝试写 CURRENT.md**：阻断并交健康审阅；采集和定时任务的 current_updated 必须保持 false。

- **设备摘要被解释为诊断或处方**：退回证据层，明确它只说明字段能否用于当前问题。

- **高风险红旗存在**：停止低价值设备刷新，按当前权威指导升级现实医疗。

- **公开候选含个人健康载荷或凭据**：公开检查阻断具体值；保留公开安全的产品身份、边界和技术事实。

::screen{#personal-health-health-owner-boundary-10 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-10",
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
     "text_ref": "- AGENTS.md　Health Owner、高风险指导、低打扰与不建设边界",
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
     "text_ref": "- AGENTS.md　Health Owner、高风险指导、低打扰与不建设边界",
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

- AGENTS.md　Health Owner、高风险指导、低打扰与不建设边界

- google_health_capture.py　health_owner_review_required / current_updated / background_work_created 机器约定

- google_health_brief.py　下游规则、相关性、不可用字段与解释限制

- tests/test_google_health_capture.py　离线结果、失败重试和不自动更新回归（现有 7 个测试函数）

- 共同决策把最佳证据、临床经验与患者目标、价值和处境放在同一选择中

- 健康 AI 应保护人的自主、安全、可解释性与问责，不把医疗决定转交给机器

- 医疗利益冲突应避免、披露和管理，并说明合理替代、无行动选项及第二意见权利

- 知情同意应覆盖诊断、干预目的、所有选项的收益与风险，包括暂不治疗

::screen{#personal-health-health-owner-boundary-11 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-health-owner-boundary-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 证据三态",
    "href": "/projects/personal-health/evidence-three-state/"
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
     "text_ref": "- 第二意见由另一位医生审阅资料，可确认、质疑或提供其他治疗选择",
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
     "text_ref": "- 第二意见由另一位医生审阅资料，可确认、质疑或提供其他治疗选择",
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

- 第二意见由另一位医生审阅资料，可确认、质疑或提供其他治疗选择

（以上五条外部医学伦理依据沿用 9 月 14 日的引用，之后未重新核对。）

## 如何验证

- 采集成功的约定明确：需要健康审阅、current_updated=false、这次 background_work_created=false。

- 项目规则机械禁止诊断引擎、评分、持续同步、后台监测、数据库、服务与队列。

- 全项目现有 192 个测试函数、参数展开 213 个用例（10 月 11 日静态计数，本次没有运行）。

- 网页公开检查与内容测试要求个人健康值、报告、用药、诊断、个体建议和凭据都不出现；这次换版后的页面是否通过，以发版检查为准。

## 与其他模块的关系

它是证据路线的最后责任边界，也决定按需或每周刷新、原始保全、离线摘要和三态结果是否真的进入当前健康依据。
