---
{
 "title": "三态判断的是证据，不是身体分数",
 "kind": "project",
 "url": "/projects/personal-health/evidence-three-state/",
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
  "page": "personal-health-evidence-three-state",
  "kind": "project",
  "title": "三态判断的是证据，不是身体分数",
  "url": "/projects/personal-health/evidence-three-state/",
  "parent": "personal-health",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "源码最后变更 10 月 7 日，10 月 11 日只读核对；本次没有跑测试、没有打开任何健康内容"
  }
 },
 "source": {
  "page": "sources/pages/personal-health-evidence-three-state/page.json",
  "sha256": "5a3a90b43f8cb4768fbc1e7176c0c9bb7153f77391d06063886d02324ffafa42",
  "converted_at_beijing": "2026-10-31T12:46:16+08:00"
 }
}
---

::screen{#personal-health-evidence-three-state-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-01",
  "section": "top",
  "title": "三态判断的是证据，不是身体分数",
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
     "text_ref": "三态判断的是证据，不是身体分数",
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
     "static_note": "截至 10 月 11 日 · 源码最后变更 10 月 7 日，10 月 11 日只读核对；本次没有跑测试、没有打开任何健康内容",
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
     "text_ref": "三态判断的是证据，不是身体分数",
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
     "static_note": "截至 10 月 11 日 · 源码最后变更 10 月 7 日，10 月 11 日只读核对；本次没有跑测试、没有打开任何健康内容"
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
   "asset": "_library/module-illustrations/personal-health/evidence-three-state-v01.png",
   "key": "main-personal-health",
   "source_phrase": "右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。",
   "sha256": "893e00541cedba3151a39b3a8676c2f71fc44321bb351446fc269117bbdefc01",
   "status": "ready"
  }
 ]
}
```

# 三态判断的是证据，不是身体分数

〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕

个人健康证据与安全决策 · 功能说明

页面不会把技术状态伪装成健康结论，也不会用一个总分或连续天数制造健康焦虑。

**当前情况：**区分可判断、待复核与证据不足的状态在用，真实采集链和每 7 天的定时刷新都已有成功记录；它评价的是资料，不是身体正常、健康得分或诊断。现在按“这次问的那段日期”单独判断，旧历史的毛病不会自动拖垮当前这段。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-health-evidence-three-state-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-02",
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

“数据可用”和“身体正常”完全不同。若界面只用红绿状态，读者容易把 coverage、同步或 schema（数据结构） 状态误解成疾病风险。

## 举个实际例子

步数文件确实存在，最近几天却断断续续。页面会显示“需要复核：覆盖不足”，并紧跟一句“这不能证明活动不足或身体异常”；这项数据不会悄悄混进后续结论。

## 最后我会得到什么

得到三个语义稳定的证据状态，每个状态都同时说明能证明什么、不能证明什么和下一步，不产生健康总分。

## 结果怎么看

## 可用于当前判断

可用于当前问题：来源和质量都核对过，仍不代表身体正常或已得到诊断。

## 需要复核

仅已保存或需要复核：资料存在，但覆盖、结构或来源不足以支持这次判断。

## 本轮不可用

暂不能用：入口或原始记录无法核对；保留未知并说明怎么补证据。

::screen{#personal-health-evidence-three-state-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-03",
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
     "text_ref": "1. **系统核对并处理**　逐字段区分可用于当前问题、仅有库存记录、或因质量与冲突被阻断，不把状态合成身体分数。",
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
     "text_ref": "1. **系统核对并处理**　逐字段区分可用于当前问题、仅有库存记录、或因质量与冲突被阻断，不把状态合成身体分数。",
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

查看一次健康摘要时，要求说明每项证据能不能用于决定。

## 需要准备什么

- 要判断的健康问题或想看的设备字段

## 从开始到拿到结果

1. **系统核对并处理**　逐字段区分可用于当前问题、仅有库存记录、或因质量与冲突被阻断，不把状态合成身体分数。

2. **交付与接续**　交回可采用项与缺口；被阻断的数据留作原件，不进入当前建议。

::screen{#personal-health-evidence-three-state-04 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-04",
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
     "text_ref": "1. 真实数值零可以是有效观察；没有记录不等于零。",
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
     "text_ref": "1. 真实数值零可以是有效观察；没有记录不等于零。",
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

**10 月 11 日核对**　字段级可用／部分／不可用、真实零与没记录的区分仍在源码；新增按默认最近 14 天或我指定的日期段各自判断，以及库存“没记录”只代表本次网络窗口。全项目现有 192 个测试函数、参数展开 213 个用例（静态计数，本次没有运行）。医学正常性不属于这套状态。

## 关键规则与设计选择

1. 真实数值零可以是有效观察；没有记录不等于零。

2. 无事件记录不能证明事件或疾病没有发生。

3. 字段级问题不把整个项目变红，只阻断对应证据；按问题的日期段判断，旧历史缺陷不无条件拖垮当前这段，全历史质量另外保留。

4. 颜色只作辅助，文本状态、原因和限制始终显示。

5. 没有健康评分、连续天数、目标环或风险刻度。

## 当前怎样实现

- _field_quality_issues 分开 field_missing、no_records、duplicate_records 和 malformed_or_partial_records。

- 数值字段通过每日歧义、观察到零的天数和近期覆盖形成字段状态。

- 判断窗口是默认 last_14_days 或指定的 requested_period，各自形成 decision_ready；事件字段在零事件时要求复核，不推断事件缺席。

::screen{#personal-health-evidence-three-state-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-05",
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
     "text_ref": "- 库存计数注明只覆盖本次网络窗口；完整日期范围 63 天也不代表这 63 天每天都有观察。",
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
     "text_ref": "- 库存计数注明只覆盖本次网络窗口；完整日期范围 63 天也不代表这 63 天每天都有观察。",
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

- 库存计数注明只覆盖本次网络窗口；完整日期范围 63 天也不代表这 63 天每天都有观察。

- decision_ready_fields 与 blocked_fields 分开输出，blocked_fields_must_not_be_consumed=true。

- 网页的证据表和三态摘要显式展示能证明／不能证明。

## 执行流程

1. 确认字段来源是否存在且可用于判断（来源筛选只到 Google/Fitbit 穿戴设备家族，不证明唯一一台设备）。

2. 检查清单、页面、结构、重复和聚合歧义。

3. 按问题的日期段计算覆盖与观察状态。

4. 生成可用或不可用原因。

5. 把限制和下一步一起交给健康项目审阅。

::screen{#personal-health-evidence-three-state-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-06",
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
| Evidence state（证据状态） | 一条材料能否安全支持当前问题的技术与语义状态。 |
| Real zero（真实零） | provider 明确记录的零值；它和没有记录、缺字段、解析失败不同。 |
| Partial（部分可用） | 资料存在，但一个或多个质量条件不足，禁止直接进入判断。 |
| Blocked field（被阻断字段） | 保留字段身份和原因，但 downstream 不能消费其内容。 |

## 专业定义

可用于判断、需要复核、本轮不可用只描述证据状态；不画健康分数、目标环或风险仪表盘。

::screen{#personal-health-evidence-three-state-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-07",
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
     "text_ref": "- 证据三态不映射成身体风险、疾病概率或治疗等级。",
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
     "text_ref": "- 证据三态不映射成身体风险、疾病概率或治疗等级。",
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

解决同步绿灯冒充健康、空数据冒充零、一个坏字段拖垮全部证据，以及总分制造焦虑和假精确。

## 边界

- 证据三态不映射成身体风险、疾病概率或治疗等级。

- 网页不显示任何个人数值或仿真健康趋势。

- 技术 PASS 不能替代真实 provider E2E（端到端验证） 或 Health Owner（健康资料责任源） 采用。

- 高风险症状的紧急处理不等待设备状态机给分。

## 失败与恢复

- **UI 只剩颜色没有文字**：验收失败；三态名称、原因、限制和下一步必须可读。

- **把 no_records 显示为 0 或正常**：阻断字段并修正解释，不生成趋势。

- **把 decision_ready 写成健康达标**：降回证据语义，明确只适用于当前问题。

- **单字段 partial 被升级为全局故障**：只阻断受影响字段，其他证据独立判断。

::screen{#personal-health-evidence-three-state-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-evidence-three-state-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 筛选可用信息",
    "href": "/projects/personal-health/offline-decision-brief/"
   },
   {
    "text": "下一个模块 谁做决定",
    "href": "/projects/personal-health/health-owner-boundary/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 30 日"
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
     "text_ref": "- google_health_brief.py　字段质量、可用／不可用、真实零、窗口与下游使用规则",
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
     "text_ref": "- google_health_brief.py　字段质量、可用／不可用、真实零、窗口与下游使用规则",
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

- google_health_brief.py　字段质量、可用／不可用、真实零、窗口与下游使用规则

- tests/test_google_health_brief.py　空字段、真实零、格式错误、混合来源与三态回归（现有 42 个测试函数）

- AGENTS.md　未测／未见／阴性区分、未知保留和低健康焦虑边界

## 如何验证

- brief 测试覆盖“零仍可用”“空字段挡住判断”“格式错误挡住事件”“缺区间算部分可用”。

- 网页三态需要同时显示自定义标签和“非诊断”说明，手机宽度下三卡文字顺序正确、不横向溢出、不只靠颜色区分；这些是验收要求，这次换版后的页面是否通过，以发版检查为准。

## 与其他模块的关系

它把离线简报的字段结果翻译成不会误导的用户状态；健康项目审阅只在这个边界之后决定是否采用。
