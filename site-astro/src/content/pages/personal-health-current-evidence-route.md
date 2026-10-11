---
{
 "title": "平时提问，先用已经整理好的当前信息",
 "kind": "project",
 "url": "/projects/personal-health/current-evidence-route/",
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
  "page": "personal-health-current-evidence-route",
  "kind": "project",
  "title": "平时提问，先用已经整理好的当前信息",
  "url": "/projects/personal-health/current-evidence-route/",
  "parent": "personal-health",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "项目规则与 personal-health 技能 10 月 11 日只读核对，源码最后变更 10 月 7 日；网页未读取任何健康正文"
  }
 },
 "source": {
  "page": "sources/pages/personal-health-current-evidence-route/page.json",
  "sha256": "f8e2f77427360bbc85bca5df713bdaf5d573e1a9eef027d55898f3ac1961f4c9",
  "converted_at_beijing": "2026-10-11T21:05:00+08:00"
 }
}
---

::screen{#personal-health-current-evidence-route-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-01",
  "section": "top",
  "title": "平时提问，先用已经整理好的当前信息",
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
     "text_ref": "平时提问，先用已经整理好的当前信息",
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
     "static_note": "截至 10 月 11 日 · 项目规则与 personal-health 技能 10 月 11 日只读核对，源码最后变更 10 月 7 日；网页未读取任何健康正文",
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
     "text_ref": "平时提问，先用已经整理好的当前信息",
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
     "static_note": "截至 10 月 11 日 · 项目规则与 personal-health 技能 10 月 11 日只读核对，源码最后变更 10 月 7 日；网页未读取任何健康正文"
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
   "asset": "_library/module-illustrations/personal-health/current-evidence-route-v01.png",
   "key": "main-personal-health",
   "source_phrase": "右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。",
   "sha256": "03af6fcf60576672e89d9f341d6b99c32d6b09dae39fa584a5f1bc3001b81060",
   "status": "ready"
  }
 ]
}
```

# 平时提问，先用已经整理好的当前信息

〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕

个人健康证据与安全决策 · 功能说明

不用每次健康提问都重新扫描报告、历史项目和材料库，也不会让旧资料因为数量多就抢答当前问题。

**当前情况：**这条回答路线在用：先完整读一遍整理好的当前依据，够用就直接给判断和一个省事的下一步，确实缺关键证据才回到一份原件（10 月 11 日核对规则和技能）。本页没有读取任何个人健康内容，不能代替一次实际健康咨询。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-health-current-evidence-route-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-02",
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

原始报告、本人陈述、医生结论和模型解释有不同证据强度。若每次都把它们重新混在一起，旧报告可能被当成现在，模型建议也可能被误写成报告结论。

## 举个实际例子

我问“现有材料够不够判断这件事？”AI 先把整理好的当前依据完整读一遍，够用就直接回答；只有出现新报告、事实纠正、来源打架，或确实少了一项会改变答案的证据，才去打开那一份最相关的原件。

## 最后我会得到什么

先得到判断和一个负担小的下一步；已经知道的事不再重复问我，只有缺的那件事真会改变结论时才问一个最小的问题。我的一般背景在会影响答案时从个人理解库取；有依据的新认识写回那里并回读确认，不整份复制病历或设备数据。缺少当前证据时明确保留未知。

::screen{#personal-health-current-evidence-route-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-03",
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
     "text_ref": "1. **系统核对并处理**　先完整读一遍整理好的当前依据，够用就直接答；只有缺少会改变判断的细节，才回到一份报告或某日设备字段核对。",
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
     "text_ref": "1. **系统核对并处理**　先完整读一遍整理好的当前依据，够用就直接答；只有缺少会改变判断的细节，才回到一份报告或某日设备字段核对。",
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

直接描述当前健康问题，先用已整理的当前依据回答。

## 需要准备什么

- 当前健康问题

- 新的本人描述或更正（如有）

## 从开始到拿到结果

1. **系统核对并处理**　先完整读一遍整理好的当前依据，够用就直接答；只有缺少会改变判断的细节，才回到一份报告或某日设备字段核对。

2. **交付与接续**　交回判断、依据、未知和一个下一步；旧材料多不代表比当前更可信，来源冲突先标明。资料锁着时只说明这次没能结合个人资料，不拿旧摘要凑。

::screen{#personal-health-current-evidence-route-04 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-04",
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
     "text_ref": "1. 普通健康问题完整读一次整理好的当前依据，够用就直接回答，不再翻来源清单、原件、旧项目或记忆。",
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
     "text_ref": "1. 普通健康问题完整读一次整理好的当前依据，够用就直接回答，不再翻来源清单、原件、旧项目或记忆。",
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

**10 月 11 日核对**　项目规则与 personal-health 技能仍固定这条路线；源码最后变更 10 月 7 日。网页未读取任何当前依据正文或个人事实。

## 关键规则与设计选择

1. 普通健康问题完整读一次整理好的当前依据，够用就直接回答，不再翻来源清单、原件、旧项目或记忆。

2. 报告实测、医生或报告结论、本人陈述、模型解释与未知分开。

3. 旧报告不能回答现在怎样，未测也不等于阴性。

4. 来源维护只打开会改变答案的最小原件和字段；原件位置失效时才借个人材料查找。

5. 处理后局部更新，不复制报告正文或另建事件库；一般背景和纠正走个人理解库，写回后回读。

## 当前怎样实现

- personal-health 技能把普通回答、来源维护和注册设备刷新分成独立触发。

- CURRENT.md 作为整理好的当前依据，普通回答完整读取它，够用就不再打开 SOURCES.md。

- 只有新报告、纠正、来源冲突、完整性存疑或答案关键的来源缺口才进入维护。

::screen{#personal-health-current-evidence-route-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-05",
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
     "text_ref": "- Health Owner（健康资料责任方）只修改 CURRENT.md 中受影响段落和对应来源记录。",
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
     "text_ref": "- Health Owner（健康资料责任方）只修改 CURRENT.md 中受影响段落和对应来源记录。",
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

- Health Owner（健康资料责任方）只修改 CURRENT.md 中受影响段落和对应来源记录。

- 原始报告留在健康原件目录，不复制进 Git 或网页。

## 执行流程

1. 明确当前健康问题和是否存在急症红旗。

2. 完整读取当前依据。

3. 区分已测事实、结论、本人陈述、解释与未知。

4. 够用就给判断和一个下一步；会改变结论的事实缺了才问一个最小问题。

5. 必要时只读最小来源并解决冲突。

6. 局部更新受影响事实，后续直接复用处理结果。

::screen{#personal-health-current-evidence-route-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-06",
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
| 现行健康底色 | 处理过、可直接用于普通回答的当前事实集合，不是原始资料库。 |
| 来源维护触发 | 新报告、纠正、冲突、审计、完整性问题或答案关键缺口。 |
| 明确未知 | 当前没有足够事实；不会被旧报告、空记录或模型猜测填满。 |
| 最小原件读取 | 只打开会改变当前答案的那份来源、页面和字段。 |

## 专业定义

同一份资料只处理一次；只有新报告、事实纠正、来源冲突或会改变答案的缺口，才重新打开最小相关来源。

::screen{#personal-health-current-evidence-route-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-07",
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
     "text_ref": "- 网页不读取或公开 CURRENT.md、SOURCES.md 与任何健康原件正文。",
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
     "text_ref": "- 网页不读取或公开 CURRENT.md、SOURCES.md 与任何健康原件正文。",
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

解决每次提问都翻全量原件、旧证据覆盖当前状态、证据类型互相冒充、重复追问已知事实和健康资料越积越重。

## 边界

- 网页不读取或公开 CURRENT.md、SOURCES.md 与任何健康原件正文。

- 普通回答不使用 Codex 记忆、旧健康项目或中央知识库。

- 高风险问题核验当前权威医学指导，但不自动诊断或处方。

- 具体健康事实未知时保持未知，不用旧报告补猜；资料锁着时停止依赖个人资料的回答，不降级凑答。

## 失败与恢复

- **当前依据缺少答案关键事实**：只问一个低负担、高价值问题，或进入最小来源复核。

- **新旧来源冲突**：分开记录时间、来源和结论，解决后只更新受影响段落。

- **原件路径失效**：仅此时使用个人材料定位入口找回并核对，不扫描中央库。

- **旧报告无法证明当前状态**：保留 Unknown（未验证），不把历史值外推到现在。

::screen{#personal-health-current-evidence-route-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-current-evidence-route-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 主动更新设备",
    "href": "/projects/personal-health/protected-foreground-refresh/"
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
     "text_ref": "- `AGENTS.md`普通回答、来源维护、高风险问题和低打扰原则的项目合同",
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
     "text_ref": "- `AGENTS.md`普通回答、来源维护、高风险问题和低打扰原则的项目合同",
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

- `AGENTS.md`普通回答、来源维护、高风险问题和低打扰原则的项目合同

- 个人健康问题和维护触发的唯一能力入口

- `CURRENT.md`处理后的现行健康底色；公开页只引用角色，不读取内容

- `SOURCES.md`来源定位与已处理范围；公开页不复制其路径、哈希或健康事实

## 如何验证

- 项目 AGENTS 和 personal-health Skill 同时要求普通回答只读现行底色

- Source audit 本轮未读取 CURRENT.md、原始健康报告或 Codex 记忆

- 网页内容测试阻断任何健康数值、诊断、药物、个体建议和凭据进入 PUBLIC（公开）

## 与其他模块的关系

它定义整个项目从哪里开始；设备刷新和离线摘要只有产生新的合格证据后，才可能回到这条现行底色路线。
