---
{
 "title": "屏幕使用、专注上下文与能耗成本",
 "kind": "project",
 "url": "/projects/timeaudit/usage-energy/",
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
  "page": "timeaudit-usage-energy",
  "kind": "project",
  "title": "屏幕使用、专注上下文与能耗成本",
  "url": "/projects/timeaudit/usage-energy/",
  "parent": "timeaudit",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "源码为 10 月 29 日 14:24 的合并 91b7ba0（含 10 月 28 日的微信标题撤除打码 2f87949/74c6c2a 与 10 月 29 日的读取失败诊断 f62b807；10 月 30 日回读，与远端一致）；10 月 12 日 05:36 只读状态汇总、用电回执只核时间与结构，未读个人时间线和电量值"
  },
  "based_on": {
   "commit": "c5ca4eeb9574e72baa0dc22eb317687f7322185c",
   "commit_time": "2026-10-11T12:44:01+08:00"
  }
 },
 "source": {
  "page": "sources/pages/timeaudit-usage-energy/page.json",
  "sha256": "f47e99638d2deb4e185a0ceb056354bfd973fe66a5d2ddccbc1dac0ce1ee52a5",
  "converted_at_beijing": "2026-10-30T14:00:59+08:00"
 }
}
---

::screen{#timeaudit-usage-energy-01 section="top"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-01",
  "section": "top",
  "title": "屏幕使用、专注上下文与能耗成本",
  "links": [
   {
    "text": "回到项目 → 电脑使用与性能记录",
    "href": "/projects/timeaudit/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/TimeAudit"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/timeaudit/#ai-brief"
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
     "text_ref": "屏幕使用、专注上下文与能耗成本",
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
     "static_note": "截至 10 月 12 日 · 源码为 10 月 29 日 14:24 的合并 91b7ba0（含 10 月 28 日的微信标题撤除打码 2f87949/74c6c2a 与 10 月 29 日的读取失败诊断 f62b807；10 月 30 日回读，与远端一致）；10 月 12 日 05:36 只读状态汇总、用电回执只核时间与结构，未读个人时间线和电量值",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我能查看活跃、暂离、睡眠、专注和场景能耗结构；具体应用、标题和时长可在有价值时直接展示，不按字段类别一刀切隐藏。现在还有一份“今日用电”回执：看门狗最多每 10 分钟算一次今天和昨天的 CPU 与显卡用电，驾驶舱直接读它。",
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
     "text_ref": "屏幕使用、专注上下文与能耗成本",
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
     "static_note": "截至 10 月 12 日 · 源码为 10 月 29 日 14:24 的合并 91b7ba0（含 10 月 28 日的微信标题撤除打码 2f87949/74c6c2a 与 10 月 29 日的读取失败诊断 f62b807；10 月 30 日回读，与远端一致）；10 月 12 日 05:36 只读状态汇总、用电回执只核时间与结构，未读个人时间线和电量值"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我能查看活跃、暂离、睡眠、专注和场景能耗结构；具体应用、标题和时长可在有价值时直接展示，不按字段类别一刀切隐藏。现在还有一份“今日用电”回执：看门狗最多每 10 分钟算一次今天和昨天的 CPU 与显卡用电，驾驶舱直接读它。"
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
   "asset": "_library/illustrations/modules/timeaudit-usage-energy-v01.png",
   "key": "main-timeaudit",
   "source_phrase": "右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。",
   "sha256": "a165662ab90c1fb87bb74d162e51c86eb9823de7342ef0f18c7d4cc6e89fa879",
   "status": "ready"
  }
 ]
}
```

# 屏幕使用、专注上下文与能耗成本

〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕

TimeAudit · 功能说明

我能查看活跃、暂离、睡眠、专注和场景能耗结构；具体应用、标题和时长可在有价值时直接展示，不按字段类别一刀切隐藏。现在还有一份“今日用电”回执：看门狗最多每 10 分钟算一次今天和昨天的 CPU 与显卡用电，驾驶舱直接读它。

**当前情况：**时间与能耗看板在用，10 月 11 日起较重的能耗统计图改成点开才计算；这次没有读取个人时间线或电量值，费用仍是估算。

项目源码：公开仓库

::screen{#timeaudit-usage-energy-02 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 区间只按开始时间求和会漏算跨窗睡眠或重复 idle，甚至出现过去一小时开机 1.5 小时；估算也可能被误当账单。 举个实际例子 我问“从周一到周三，电脑到底记录了哪些时间，哪几段是空白？”我给"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 区间只按开始时间求和会漏算跨窗睡眠或重复 idle，甚至出现过去一小时开机 1.5 小时；估算也可能被误当账单。 举个实际例子 我问“从周一到周三，电脑到底记录了哪些时间，哪几段是空白？”我给"
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

区间只按开始时间求和会漏算跨窗睡眠或重复 idle，甚至出现过去一小时开机 1.5 小时；估算也可能被误当账单。

## 举个实际例子

我问“从周一到周三，电脑到底记录了哪些时间，哪几段是空白？”我给出准确起止时间后，只读摘要会按完整范围及北京时间逐日列出前台和活动记录、睡眠等状态与缺口；需要电费时再看看板估算。空白不被猜成没开机，前台时间不被猜成本人一直在做事。

## 最后我会得到什么

得到所选时段按来源区分的覆盖、空档、状态和应用时间线索，也可在看板看用电与费用估算，在驾驶舱看今天的 CPU 和显卡用电。未覆盖不是设备闲置证明，估算不是账单。

::screen{#timeaudit-usage-energy-03 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-03",
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

有记录的部分先去重叠并按本地日期裁剪，分别显示前台与 AHK 来源覆盖；有可用功率记录才估算耗电。

## 发现问题时

离开记录重叠或功率缺失时把空白和估算限制写清。

## 入口不可用或证据不足时

个人资料权限或来源读不到时只返回相应错误，不推断作息、具体应用或费用。

::screen{#timeaudit-usage-energy-04 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-04",
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
     "text_ref": "在 TimeAudit 的屏幕使用看板选日期或时间段看时间；用电和电费在功耗看板，“累计能耗、电费与碳排放”和“应用能耗、每日趋势与峰谷分析”两组点“展开”才计算。要完整时段的活动证据，可请有当前个人资料权限的 AI 使用 TimeAudit 的只读活动摘要入口，明确给出起止时间。",
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
     "text_ref": "1. **只计算落在所选日期里的时间**　系统把跨过午夜的睡眠和离开时段裁到查询范围内，避免“今天用电脑超过一天”。",
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
     "text_ref": "在 TimeAudit 的屏幕使用看板选日期或时间段看时间；用电和电费在功耗看板，“累计能耗、电费与碳排放”和“应用能耗、每日趋势与峰谷分析”两组点“展开”才计算。要完整时段的活动证据，可请有当前个人资料权限的 AI 使用 TimeAudit 的只读活动摘要入口，明确给出起止时间。"
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
     "text_ref": "1. **只计算落在所选日期里的时间**　系统把跨过午夜的睡眠和离开时段裁到查询范围内，避免“今天用电脑超过一天”。",
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

在 TimeAudit 的屏幕使用看板选日期或时间段看时间；用电和电费在功耗看板，“累计能耗、电费与碳排放”和“应用能耗、每日趋势与峰谷分析”两组点“展开”才计算。要完整时段的活动证据，可请有当前个人资料权限的 AI 使用 TimeAudit 的只读活动摘要入口，明确给出起止时间。

## 需要准备什么

- 想看的日期与准确起止时间

- 关注记录覆盖、应用时间、离开、睡眠还是电费估算

- 是否需要完整时段及北京时间逐日摘要

## 从开始到拿到结果

1. **只计算落在所选日期里的时间**　系统把跨过午夜的睡眠和离开时段裁到查询范围内，避免“今天用电脑超过一天”。

2. **汇总重叠记录**　系统合并重复离开区间，计算屏幕使用结构与估算能耗。

3. **看懂数字**　看板交回活跃时长和估算；只读摘要另列完整时段、逐日覆盖与缺口。前台时间不等于本人在场或工作成果，电费和碳排不是账单。

::screen{#timeaudit-usage-energy-05 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 大盘有历史图证；只读完整时段摘要已进入正式源码，本轮未读取生产个人时间线或能耗值 关键规则与设计选择 1 先裁剪查询窗，再合并重叠区间。 2 睡眠、息屏、暂离从活跃中扣"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 大盘有历史图证；只读完整时段摘要已进入正式源码，本轮未读取生产个人时间线或能耗值 关键规则与设计选择 1 先裁剪查询窗，再合并重叠区间。 2 睡眠、息屏、暂离从活跃中扣"
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
     "text_ref": "1. 先裁剪查询窗，再合并重叠区间。",
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
     "text_ref": "1. 先裁剪查询窗，再合并重叠区间。",
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

看板与只读完整时段摘要在用；今日用电回执 2026-10-11 07:57 合入；本轮未读取个人时间线或电量值

## 关键规则与设计选择

1. 先裁剪查询窗，再合并重叠区间。

2. 睡眠、息屏、暂离从活跃中扣除。

3. 时间复盘不生成公开个人画像。

4. 电费与电源轨是估算；今日用电和电费只算 CPU 与显卡，功耗图里的“整机功耗”另加外围估值，两者口径不同。

## 当前怎样实现

- AHK 写前台和系统状态区间，ingester 幂等入库。

- Grafana 用区间交叠、裁剪和 gaps-and-islands（区间并集）。10 月 11 日起功耗看板“当前功耗与电源状态”常显，“累计能耗、电费与碳排放”（3 图）和“应用能耗、每日趋势与峰谷分析”（4 图）默认折叠、展开才查询；屏幕使用时间看板没有折叠组；它 10 月 28 日起不再对微信窗口标题强制打码，和其他应用一样照实显示（提交 2f87949，运行中看板经 74c6c2a 导入）。

- 数据库锁定 Asia/Shanghai 本地日界。

- 用电按功率点采样积分，采样间隔 60 秒以上的不累计。今日累计电量和电费只算 CPU 封装加显卡板功率；功耗曲线的“整机功耗”另加外围 30W 和 CPU/GPU 功率的 12%，再估电源效率。峰电价默认 8—22 点 0.58 元/度、谷电 0.27 元/度，是可改参数，不是实际账单。

::screen{#timeaudit-usage-energy-06 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-06",
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
     "text_ref": "- 今日用电回执：既有看门狗最多每 600 秒用现有数据库容器只读查询一次，按北京时间切今天和昨天，原子写 `log/power-today.json`（timeaudit.power-today.v1）；驾驶舱读回执，不必每次显示都去查库。回执失败不影响看门狗的恢复结果，也不另起采集进程。",
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
     "text_ref": "- 今日用电回执：既有看门狗最多每 600 秒用现有数据库容器只读查询一次，按北京时间切今天和昨天，原子写 `log/power-today.json`（timeaudit.power-today.v1）；驾驶舱读回执，不必每次显示都去查库。回执失败不影响看门狗的恢复结果，也不另起采集进程。",
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

- 今日用电回执：既有看门狗最多每 600 秒用现有数据库容器只读查询一次，按北京时间切今天和昨天，原子写 `log/power-today.json`（timeaudit.power-today.v1）；驾驶舱读回执，不必每次显示都去查库。回执失败不影响看门狗的恢复结果，也不另起采集进程。

- 写失败不推进已提交水位，保留有界待写队列；达到上限时详细事件变为明确未知区间，不推断应用使用。ahk_health.json 分别记录待写、失败、溢出和分段数；正常活动约 30 秒或转换时封段，突然断电仍可能丢失当前未封段。

- 活动区间统一 UTC 且状态串行；空闲切换不能倒退已分配区间。物理空闲 60 秒算离开，系统声音播放时豁免；时钟跳变/延迟记 System_CollectionGap，只有 Windows 挂起事件证明 sleep。AHK 用 UTF8 不可变 CSV 段：临时写入、flush、原子 rename 到 buffer.csv.ahk.*.processing，现有 ingester 只在数据库事务提交后移除，内容去重保护重放。

- personal_activity_reader.py --summary 返回 timeaudit.personal-activity-summary.v1：只读现有前台和 AHK 区间，按完整查询窗及 Asia/Shanghai 日界分别求记录并集、空档、状态和每来源应用排名；开放会话不外推，已知自动化仅标注提供的时间，不给本人在场或效率分数。旧 read_activity 细目入口继续存在。读取时每条只读语句最多等锁 5 秒；读取失败时保留原因码并附分阶段诊断（调容器、连库、等锁、执行或整理结果），没读到的时段不当作没有活动，也不重启采集器（提交 f62b807，10 月 29 日）。

- 这个摘要需要当前个人资料权限才能读，没有自动接到 timeaudit-diagnostics 诊断技能里。

::screen{#timeaudit-usage-energy-07 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-07",
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
     "text_ref": "1. 记录并入库状态区间。",
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
     "text_ref": "1. 记录并入库状态区间。",
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

1. 记录并入库状态区间。

2. 筛选与窗口交叠的区间。

3. 裁剪、合并并计算使用结构。

4. 积分功率并应用峰谷模型；看门狗另按北京时间写今日用电回执。

5. 原始全库不镜像进网页；具体标题和个人统计只有在具备产品价值、逐值没有 L3+ 或凭据证据时才公开，否则留在本机。

::screen{#timeaudit-usage-energy-08 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-08",
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
| gaps-and-islands（区间并集） | 合并重叠/相接时间片后再求总时长。 |
| focus block（专注块） | 连续停留同一上下文达到阈值的行为线索。 |
| energy integration（能量积分） | 把功率按持续时间累计为 kWh。 |

## 专业定义

按正确区间口径汇总前台、暂离、息屏、睡眠、切换、功率和峰谷电价；另有只读完整时段及逐日活动摘要，把记录空档也交出来。

::screen{#timeaudit-usage-energy-09 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-09",
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
     "text_ref": "- 前台焦点不等于工作成果。",
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
     "text_ref": "- 前台焦点不等于工作成果。",
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

## 边界

- 前台焦点不等于工作成果。

- 窗口标题与使用统计可按实际价值公开；只有具体内容真实包含个人敏感正文或凭据时才隐藏对应值。

- 能耗/电费/碳排含估算；今日用电回执是 CPU 与显卡的估算，不是墙插整机电量或电费账单。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| 区间跨查询边界 | 只算窗口内交叠部分。 |
| idle 区间重叠 | 先做区间并集。 |
| AHK / ingester heartbeat 陈旧 | 标记近期可能延迟，先查管线。 |
| 今日用电回执没更新 | 只是显示支路失败，不代表采集或恢复失败；不用旧回执冒充当前电量。 |

::screen{#timeaudit-usage-energy-10 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-10",
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
     "text_ref": "- 前台/睡眠区间",
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
     "text_ref": "- 前台/睡眠区间",
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

- 前台/睡眠区间

- 区间入库

- 使用时间大盘 JSON

- 功耗大盘 JSON

- active/idle/display-off/lock/sleep 区间并集与未覆盖时间聚合

- 完整时段与北京时间逐日个人活动只读摘要，保留来源覆盖、空档和权限边界

- 时间/功耗面板说明

- 今日用电回执（telemetry_watchdog.ps1 写出的 log/power-today.json）

::screen{#timeaudit-usage-energy-11 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-usage-energy-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 进程与取证",
    "href": "/projects/timeaudit/process-forensics/"
   },
   {
    "text": "下一个模块 自愈与正确性",
    "href": "/projects/timeaudit/runtime-reliability/"
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
     "text_ref": "- screen-time-focus、power-cost 等授权截图展示真实界面（截图保留原日期，10 月 11 日改成按需展开前拍摄）。",
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
     "text_ref": "- screen-time-focus、power-cost 等授权截图展示真实界面（截图保留原日期，10 月 11 日改成按需展开前拍摄）。",
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

## 如何验证

- screen-time-focus、power-cost 等授权截图展示真实界面（截图保留原日期，10 月 11 日改成按需展开前拍摄）。

- 9 月 8 日独立摘要窗口 (2026-09-08T08:35:40Z, 08:38:40Z] 返回 active=0、idle=180 秒、recorded coverage=180 秒、uncovered=0、cross-state overlap=0；只说明这三分钟的记录，不推断用户意图或长期习惯。

- 2026-10-12 05:36 只读汇总 05:21:10—05:36:10（15 分钟）：状态区间记录覆盖 899 秒、未覆盖 1 秒、跨状态重叠 0，采集空档 0；10 月 11 日 23:54 汇总的 22:00—23:00 覆盖 3600 秒，16:33 汇总的 13:00—14:00 曾有 95 秒采集空档，均保留为历史。不推断本人在场、睡眠或工作成果。

- 本轮未重新查询完整个人时长或能耗明细；今日用电回执 10 月 12 日 05:30 写出，只核了写出时间、结构版本和 2 个日期项，没有读电量值，CPU+GPU 估算的边界不变。当前源码有 356 个以 test_ 开头的测试函数，这次没有运行，也没有把摘要写成已被 timeaudit-diagnostics 自动调用。

## 与其他模块的关系

从采集取得区间/功率，借硬件解释能耗；用电回执由可靠性模块的看门狗写出；公开边界由项目总览约束。
