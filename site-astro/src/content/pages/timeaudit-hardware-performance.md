---
{
 "title": "硬件真值、FPS 回放与前台性能诊断",
 "kind": "project",
 "url": "/projects/timeaudit/hardware-performance/",
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
  "page": "timeaudit-hardware-performance",
  "kind": "project",
  "title": "硬件真值、FPS 回放与前台性能诊断",
  "url": "/projects/timeaudit/hardware-performance/",
  "parent": "timeaudit",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核）；10 月 12 日 05:36 只读汇总最近 15 分钟，未启动游戏；给电脑配置项目的异常摘要链已于 9 月 29 日删除"
  },
  "based_on": {
   "commit": "c5ca4eeb9574e72baa0dc22eb317687f7322185c",
   "commit_time": "2026-10-11T12:44:01+08:00"
  }
 },
 "source": {
  "page": "sources/pages/timeaudit-hardware-performance/page.json",
  "sha256": "88ca5a4d0c38f24a05ab8fc01f142d71b1b369b429426f89995349aae60e5bdf",
  "converted_at_beijing": "2026-10-22T07:02:38+08:00"
 }
}
---

::screen{#timeaudit-hardware-performance-01 section="top"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-01",
  "section": "top",
  "title": "硬件真值、FPS 回放与前台性能诊断",
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
     "text_ref": "硬件真值、FPS 回放与前台性能诊断",
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
     "static_note": "截至 10 月 12 日 · 源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核）；10 月 12 日 05:36 只读汇总最近 15 分钟，未启动游戏；给电脑配置项目的异常摘要链已于 9 月 29 日删除",
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
     "text_ref": "先看卡顿那段记录是否完整，再把温度、帧率、磁盘和后台活动放到同一时间线上。没开游戏、传感器读错和真正掉帧会显示不同状态，不猜根因。以前另有一条“异常摘要”专门给电脑配置项目提示要不要重查硬件配置，这条链已在 9 月 29 日删除；现在电脑配置项目诊断卡顿时，直接读 TimeAudit 的健康状态和历史诊断汇总。",
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
     "text_ref": "硬件真值、FPS 回放与前台性能诊断",
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
     "static_note": "截至 10 月 12 日 · 源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核）；10 月 12 日 05:36 只读汇总最近 15 分钟，未启动游戏；给电脑配置项目的异常摘要链已于 9 月 29 日删除"
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
     "text_ref": "先看卡顿那段记录是否完整，再把温度、帧率、磁盘和后台活动放到同一时间线上。没开游戏、传感器读错和真正掉帧会显示不同状态，不猜根因。以前另有一条“异常摘要”专门给电脑配置项目提示要不要重查硬件配置，这条链已在 9 月 29 日删除；现在电脑配置项目诊断卡顿时，直接读 TimeAudit 的健康状态和历史诊断汇总。"
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
   "asset": "_library/illustrations/modules/timeaudit-hardware-performance-v01.png",
   "key": "main-timeaudit",
   "source_phrase": "右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。",
   "sha256": "7cf37f8d0acf8f73fd90758f17f9871030bf4db3ec30e809211748d4c5142004",
   "status": "ready"
  }
 ]
}
```

# 硬件真值、FPS 回放与前台性能诊断

〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕

TimeAudit · 功能说明

先看卡顿那段记录是否完整，再把温度、帧率、磁盘和后台活动放到同一时间线上。没开游戏、传感器读错和真正掉帧会显示不同状态，不猜根因。以前另有一条“异常摘要”专门给电脑配置项目提示要不要重查硬件配置，这条链已在 9 月 29 日删除；现在电脑配置项目诊断卡顿时，直接读 TimeAudit 的健康状态和历史诊断汇总。

**当前情况：**硬件和帧率每秒照常记录；10 月 12 日 05:21—05:36 这 15 分钟有 900 条硬件样本、899 条有效帧，另有 1 条被拒收。游戏帧率仍未通过实际游戏验收。

项目源码：公开仓库

::screen{#timeaudit-hardware-performance-02 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 平均帧率可能掩盖两秒卡顿，桌面壁纸帧也不能当游戏成绩；一次高温还可能是传感器读错。TimeAudit 先核对这段记录是否完整，再把同一时刻的硬件、画面和程序变化放在一起解释。 举个实际例子 我"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 平均帧率可能掩盖两秒卡顿，桌面壁纸帧也不能当游戏成绩；一次高温还可能是传感器读错。TimeAudit 先核对这段记录是否完整，再把同一时刻的硬件、画面和程序变化放在一起解释。 举个实际例子 我"
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

平均帧率可能掩盖两秒卡顿，桌面壁纸帧也不能当游戏成绩；一次高温还可能是传感器读错。TimeAudit 先核对这段记录是否完整，再把同一时刻的硬件、画面和程序变化放在一起解释。

## 举个实际例子

我问：“没开游戏，为什么还显示帧率，显卡温度也高得奇怪？”系统先查帧来自游戏还是桌面；明显不合理的温度改从其他真实来源核对，仍没有可靠值就留空。

## 最后我会得到什么

先知道这段时间记录是否足够，再看温度、帧率、磁盘和网络是否同一时刻变化；值得深查时打开详细图。电脑配置项目要查卡顿时，拿到的是同一份健康状态和历史汇总，只是“可能相关”的线索，不会直接宣称硬件配置改变。

::screen{#timeaudit-hardware-performance-03 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-03",
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

取得新鲜可靠的硬件与帧记录时显示实际变化；没开游戏但记录正常时显示等待。

## 发现问题时

画面确在渲染却没有对应帧、传感器读数越界或记录过期时说明具体问题，不给一个假零。

## 入口不可用或证据不足时

帧来源或必要数据库不可用时保留空白；不会为看网页而启动游戏或重型采集。

::screen{#timeaudit-hardware-performance-04 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-04",
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
     "text_ref": "在 TimeAudit Grafana 的性能看板选具体时间窗，资源趋势和应用对比这些较重的图点“展开查看”才加载；要查异常原因，可在已接入诊断的 AI 对话里说明症状。",
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
     "text_ref": "1. **先核对样本**　诊断入口检查时间窗覆盖和最新数据，不用一条孤立数值下判断。",
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
     "text_ref": "在 TimeAudit Grafana 的性能看板选具体时间窗，资源趋势和应用对比这些较重的图点“展开查看”才加载；要查异常原因，可在已接入诊断的 AI 对话里说明症状。"
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
     "text_ref": "1. **先核对样本**　诊断入口检查时间窗覆盖和最新数据，不用一条孤立数值下判断。",
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

在 TimeAudit Grafana 的性能看板选具体时间窗，资源趋势和应用对比这些较重的图点“展开查看”才加载；要查异常原因，可在已接入诊断的 AI 对话里说明症状。

## 需要准备什么

- 卡顿发生时间

- 游戏或桌面场景

- 想比较的硬件指标

## 从开始到拿到结果

1. **先核对样本**　诊断入口检查时间窗覆盖和最新数据，不用一条孤立数值下判断。

2. **对齐负载与帧**　看板把显卡、温度、磁盘、网络和 FPS 放在同一时段，注明帧源是游戏还是桌面。

3. **解释异常和未知**　交回可能相关的变化；越界传感器或缺帧状态明确标记，不把 0 帧和一次高温说成硬件故障。

::screen{#timeaudit-hardware-performance-05 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 e5459ce已拒收NVML坏值并真实换代；180/180新GPU样本有效，133个正帧全被拒绝，游戏E2E（端到端验证）仍未验收 关键规则与设计选择 1 先看 1% "
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 e5459ce已拒收NVML坏值并真实换代；180/180新GPU样本有效，133个正帧全被拒绝，游戏E2E（端到端验证）仍未验收 关键规则与设计选择 1 先看 1% "
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
     "text_ref": "1. 先看 1% Low 与帧时，再看平均 FPS。",
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
     "text_ref": "1. 先看 1% Low 与帧时，再看平均 FPS。",
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

e5459ce 起拒收 NVML 坏值并已换代；10 月 11 日 22:00—23:00 共 3600 条硬件样本、3599 条有效帧、1 条拒收正帧，游戏 E2E（端到端验证）仍未验收；异常摘要链 2026-09-29 删除

## 关键规则与设计选择

1. 先看 1% Low 与帧时，再看平均 FPS。

2. 先确认帧源及采集状态，再解释数值；RTSS 可读但没有唯一有效帧是正常等待，启动后仍收不到帧则是另一种需要排查的状态。

3. 先用 summary 确认窗口覆盖、有效游戏帧和方向；只有问题需要具体时刻、进程或跨曲线关系时才进 Grafana。

4. 只认 NVIDIA 独显，隔离核显与虚拟显示器。

5. 功耗墙、温度墙、空闲降频分开解释。

6. 只在相似负载下判断散热趋势。

7. TimeAudit 拥有阈值和聚合语义；电脑配置项目读的是 TimeAudit 健康状态和有界历史 summary，不绕过它读取原始行或自行解释阈值。

8. 原先给电脑配置项目的“异常摘要”接口在 9 月 28 日失去使用方、9 月 29 日删除代码、合同和测试，现在没有这个入口，也不再有“摘要建议重查稳定配置”这一步。

::screen{#timeaudit-hardware-performance-06 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-06",
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
     "text_ref": "- e5459ce 的 hardware_worker 组合 NVML、PDH、LHM 与 RTSS 优先帧链。NVML 核心利用率 0—100%、核心温度 0—120°C、板功率 0—2000W、核心/显存时钟 0—100000MHz 之外或非有限值均拒收；显存温度只接受 0—150°C。这些是宽泛有效性边界，不是正常负载推荐值。失败后清 NVML 句柄并走既有重初始化；当拍只合并真实 LHM 后备，否则 NULL。LHM 仍只读 18085，不另建进程恢复路径。",
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
     "text_ref": "- e5459ce 的 hardware_worker 组合 NVML、PDH、LHM 与 RTSS 优先帧链。NVML 核心利用率 0—100%、核心温度 0—120°C、板功率 0—2000W、核心/显存时钟 0—100000MHz 之外或非有限值均拒收；显存温度只接受 0—150°C。这些是宽泛有效性边界，不是正常负载推荐值。失败后清 NVML 句柄并走既有重初始化；当拍只合并真实 LHM 后备，否则 NULL。LHM 仍只读 18085，不另建进程恢复路径。",
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

## 当前怎样实现

- e5459ce 的 hardware_worker 组合 NVML、PDH、LHM 与 RTSS 优先帧链。NVML 核心利用率 0—100%、核心温度 0—120°C、板功率 0—2000W、核心/显存时钟 0—100000MHz 之外或非有限值均拒收；显存温度只接受 0—150°C。这些是宽泛有效性边界，不是正常负载推荐值。失败后清 NVML 句柄并走既有重初始化；当拍只合并真实 LHM 后备，否则 NULL。LHM 仍只读 18085，不另建进程恢复路径。

- `_read_rtss_fps_snapshot` 只读 `RTSSSharedMemoryV2`：先精确 Windows 前台 PID，再 RTSS 最近前台 PID，再已启用的 wallpaper32.exe / wallpaper64.exe 桌面渲染候选，最后只接受一个唯一新鲜来源；布局与关键字段双读不一致、帧龄超过 2000 ms 或候选仍多解时拒绝该帧，不按最高 FPS 猜归属。

- RTSS 映射可用即抑制 PresentMon 启动；映射不可用时，`_presentmon_needed` 还检查真实渲染门与最近 RTSS 帧的 3 秒抑制窗。后备由项目内单 owner 管理 `TimeAuditPresentMon` 会话，RTSS 本身只读、不由 TimeAudit 启停。

- `_resolve_fps_capture_state` 把 active、gated_idle、starting、waiting_frames、source_unavailable、error 六种状态及原因写进 `fact_system_hardware.fps_capture_status / fps_capture_detail`。RTSS 有帧写 rtss_shared_memory_frame、可读无帧写 rtss_no_active_frame；PresentMon 启动宽限 10 秒，过后仍无匹配帧写 waiting_frames。

- `_auto_prepare_lhm_async` 在项目 exe 缺失时仍可下载并解压组件文件；这是文件准备，不是运行实例 ownership（所有权）或第二条恢复路径。

- 独立 `LibreHardwareMonitor` 计划任务是唯一运行 owner，`telemetry_watchdog.ps1` 是登记的唯一自动恢复路径。

- 8 月 31 日的运行回读证明当时 hardware_worker 与 001cee0 一致，现场 1 个 LHM 活实例与 3 个零线程残影被正确区分；这条历史证据不替代 9 月 8 日 e5459ce 的进程换代与新窗口验收。

- activity_worker 用 NVIDIA vendor id 锁独显 LUID；当前目标独显为 NVIDIA GeForce RTX 5090 D，另有的 AMD 核显和虚拟显示驱动不当作目标。

::screen{#timeaudit-hardware-performance-07 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-07",
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
     "text_ref": "- Grafana 对齐 FPS、帧时、瓶颈与前台焦点。10 月 11 日起看板改为按需加载：硬件看板 21 张图里“资源压力、流量与长期趋势”一组 13 张默认折叠，流畅度看板 9 张图里“应用对比与窗口分析”一组 3 张默认折叠，展开才查询；图都还在。",
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
     "text_ref": "- Grafana 对齐 FPS、帧时、瓶颈与前台焦点。10 月 11 日起看板改为按需加载：硬件看板 21 张图里“资源压力、流量与长期趋势”一组 13 张默认折叠，流畅度看板 9 张图里“应用对比与窗口分析”一组 3 张默认折叠，展开才查询；图都还在。",
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

- Grafana 对齐 FPS、帧时、瓶颈与前台焦点。10 月 11 日起看板改为按需加载：硬件看板 21 张图里“资源压力、流量与长期趋势”一组 13 张默认折叠，流畅度看板 9 张图里“应用对比与窗口分析”一组 3 张默认折叠，展开才查询；图都还在。

- 历史诊断入口是 `timeaudit_diagnostic_summary.py`：窗口固定为不含起点、含终点，最长 168 小时，只返回覆盖、样本数、有效帧和阈值线索，不含原始载荷，也不给根因。

- 异常摘要链（`pcconfig_anomaly_digest.py`、对应合同与测试）已在提交 a5a5ad9（2026-09-29 01:22）删除，只作历史记录；源码仓库里的 `DIAGNOSTICS_OPERATIONS.md` 仍留着这条链的旧说明，以实际删除的代码为准。

- 数据库会话锁定 Asia/Shanghai 本地日界。

- CPU 封装温度/功率与 GPU hotspot 只接受真实新鲜传感器或 NULL，不以 ACPI 区域、负载公式、显存温度或核心偏移代替；RTSS current_fps 是最近帧倒数，窗口均值另存；历史无来源 RTSS 行走明确兼容路线，合理极低帧不直接丢弃。缺磁盘/换页/频率计数留 NULL，真实 0 仍保留。

## 执行流程

1. 用 timeaudit-diagnostics 对最短够用窗口做一次有界 summary，先核对覆盖、样本数、最新年龄与最大空档。

2. 若需要细节，再识别物理 GPU 和传感器并打开对应 Grafana 时间窗。

3. 先按 RTSS 候选优先级选择新鲜一致帧；映射不可用才允许按渲染门启用 PresentMon 后备，并将来源原因与采集状态一并保存。

::screen{#timeaudit-hardware-performance-08 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-08",
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
     "text_ref": "4. 读取时把数据年龄与六种采集状态共同解释：gated_idle 正常等待，starting 暂等，waiting_frames / error / source_unavailable 与状态缺失单独报告。",
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
     "text_ref": "4. 读取时把数据年龄与六种采集状态共同解释：gated_idle 正常等待，starting 暂等，waiting_frames / error / source_unavailable 与状态缺失单独报告。",
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

4. 读取时把数据年龄与六种采集状态共同解释：gated_idle 正常等待，starting 暂等，waiting_frames / error / source_unavailable 与状态缺失单独报告。

5. 每秒采硬件、FPS、网络与系统压力，隔离单个探针失败。

6. 按时间桶对齐前台、卡顿、温度、磁盘与网络曲线。

7. 需要长期趋势或应用对比时，在看板里展开对应的折叠组再查询。

8. 电脑配置项目诊断卡顿时读同一份健康状态和历史 summary，自己决定是否到现场重查；不再经过已删除的异常摘要。

9. 把 summary 的相关信号与看板细节、Windows 事件、驱动或电脑配置现场交叉判断，不由一条阈值直接给根因。

::screen{#timeaudit-hardware-performance-09 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-09",
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
|---|---|
| 1% Low | 最差 1% 时段帧率，揭示偶发卡顿。 |
| frametime（帧时） | 渲染一帧的毫秒数；尖刺会影响手感。 |
| RTSS（RivaTuner Statistics Server 帧率工具） | TimeAudit 当前首选的只读共享内存帧源；选中桌面渲染器时，其 FPS 不自动等于游戏性能。 |
| LUID（图形设备标识） | Windows 本机设备身份，用来锁目标独显。 |
| anomaly digest（异常摘要，已退役） | 以前给电脑配置项目的有界聚合接口，说明窗口覆盖、异常种类和是否建议重查稳定配置；9 月 29 日已删除，现在由健康状态和历史 summary 代替。 |

## 专业定义

硬件真值与 RTSS 优先帧链对齐到同一时间轴；PresentMon 仅作后备，并明确区分正常等待、启动中、有负载无帧与采集故障。

解决什么

解决平均值遮蔽卡顿、GPU 混淆、探针故障级联、FPS 归属错误和伪老化趋势。

::screen{#timeaudit-hardware-performance-10 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-10",
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
     "text_ref": "- 阈值按当前个人工作站调校，不是通用标准。",
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
     "text_ref": "- 阈值按当前个人工作站调校，不是通用标准。",
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

## 边界

- 阈值按当前个人工作站调校，不是通用标准。

- 能耗/电源轨含估算，不是外部仪器值。

- 空值不插成传感器真值。

- 数据库为兼容可把缺帧数值保存成 0，消费者必须同时读取采集状态和原因；缺少状态的零值不是健康证明，no_game_frames 摘要也不能替代采集诊断。

- RTSS 可返回用户已启用的 Wallpaper 桌面帧；没有对应游戏与负载证据时，不用正值、历史坏例或截图推导游戏成绩。22:00—23:00 的 3599 条有效帧没有点名游戏，不能写成实际游戏已验收。

- 历史诊断 summary 不返回原始遥测行、温度/负载曲线、进程活动、窗口标题、网络标识、凭据或机器标识。

- scheduler jitter（调度抖动）是有界用户态信号，不冒充真实内核 DPC latency。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| LHM 连续不可达 | hardware worker 只把 CPU/GPU 对应真值字段留空；外部 telemetry_watchdog 先宽限 15 秒，再通过独立 LHM 任务做一次有界端点恢复。 |

::screen{#timeaudit-hardware-performance-11 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-11",
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

| 情况 | 怎么处理 |
|---|---|
| NVML 调用异常或核心指标越界 | 显存温度、降频原因、PCIe 等非核心读取失败局部隔离；核心利用率、温度、功率或时钟失败/越界时 source_available=false 并重新初始化，整组转用真实 LHM 或 NULL，不把坏值清零伪装正常。 |
| 样本新鲜且 RTSS 映射可读、没有有效帧，或后备明确处于渲染门空闲 | 显示 gated_idle / 正常等待；不启动第二个帧源、不造游戏负载。 |
| 后备已检测渲染但 10 秒启动宽限后仍没有匹配帧 | 报告 waiting_frames 与 no_fresh_foreground_frame；这是收帧问题，不冒充正常桌面空闲。 |
| 帧状态缺失、采样陈旧、source_unavailable 或 error | 分别报告合同缺失、新鲜度、来源或具体采集错误；保留其他有效硬件字段，不以零 FPS 掩盖。 |
| 历史 summary 请求窗口超过 168 小时或时间边界非法 | 有界拒绝；不查询原始行、不重启 Docker/PostgreSQL。 |
| 旧说明或旧笔记仍让人调用异常摘要 | 入口已删除，按退役处理；改用健康检查和历史 summary，不恢复旧链。 |

::screen{#timeaudit-hardware-performance-12 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-12",
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
     "text_ref": "- 硬件、RTSS 共享内存候选/新鲜度、PresentMon 后备与六态入库",
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
     "text_ref": "- 硬件、RTSS 共享内存候选/新鲜度、PresentMon 后备与六态入库",
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

- 硬件、RTSS 共享内存候选/新鲜度、PresentMon 后备与六态入库

- 独显与进程 GPU

- 大盘恢复合同

- 硬件大盘 JSON

- 流畅度大盘 JSON

- 一次查询的硬件、有效游戏帧、覆盖与信号聚合

- 诊断摘要 schema（数据结构）、时间窗和因果边界

- 给 PCConfig 的异常摘要 Provider（已于 2026-09-29 删除，仅作历史）

::screen{#timeaudit-hardware-performance-13 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-13",
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
     "text_ref": "- 异常摘要的窗口、覆盖与重查边界（已于 2026-09-29 删除，仅作历史）",
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
     "text_ref": "- 异常摘要的窗口、覆盖与重查边界（已于 2026-09-29 删除，仅作历史）",
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

- 异常摘要的窗口、覆盖与重查边界（已于 2026-09-29 删除，仅作历史）

- LHM 端点宽限、任务恢复和 crash ghost 过滤

- LHM 单 owner 与外部恢复断言

- FPS 选择回归

- RTSS 二进制解析、过期帧、前台候选、桌面精确匹配、映射可读无帧与状态入库合同

- 明确空闲、缺状态、waiting_frames 与陈旧数据不能互相冒充

- 大盘合同回归

## 如何验证

- 2026-09-08 的 e5459ce 已发布并生效；39 项相关回归覆盖坏值、非有限/越界、真实 LHM 后备、无源 NULL、恢复有效读数，以及既有 RTSS 选择/状态和官方诊断摘要。之后未重新运行。

::screen{#timeaudit-hardware-performance-14 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-hardware-performance-14",
  "section": "tech",
  "title": "依据与来源（三）",
  "links": [
   {
    "text": "上一个模块 采集与数据流",
    "href": "/projects/timeaudit/collection-pipeline/"
   },
   {
    "text": "下一个模块 进程与取证",
    "href": "/projects/timeaudit/process-forensics/"
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
     "text_ref": "- 001cee0 的 182 项 + 11 个子测试完整回归通过；LHM/Watchdog 定向断言另为 10/10（2026-08-31，历史）。",
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
     "text_ref": "- 001cee0 的 182 项 + 11 个子测试完整回归通过；LHM/Watchdog 定向断言另为 10/10（2026-08-31，历史）。",
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

- 001cee0 的 182 项 + 11 个子测试完整回归通过；LHM/Watchdog 定向断言另为 10/10（2026-08-31，历史）。

- 8 月 31 日现场健康 21/21：当时的单一 LHM、18085、GPU 电压与 120/120 条 GPU/Vcore 真值通过，不等于之后重验全链。

- 8 月 31 日 3660 样本、9 月 8 日修复后三分钟 180 样本与 133 正帧全拒绝、9 月 14 日一小时 3599 硬件样本/2369 有效帧/1229 拒绝正帧、10 月 11 日 13:00—14:00 3412 硬件样本/3399 有效帧/13 拒收正帧、10 月 11 日 22:00—23:00 3600 硬件样本/3599 有效帧/1 拒收正帧，均保留原日期。

- 2026-10-12 05:36 只读汇总 05:21:10—05:36:10（15 分钟）：900 条硬件样本、单一采集实例、0 条快速样本，最大间隔 1.033 秒；有效帧 899、拒收正帧 1，质量仍为“有效与拒收混合”；GPU 热点 900 个样本都缺测。这是有界聚合，不是实机游戏验收或根因证明，也不说明帧来自游戏。

- 当前源码有 345 个以 test_ 开头的测试函数（含类方法），这次没有运行任何测试。

- 本轮未结束 LHM 或阻断 18085，不能把健康现场冒充恢复故障注入；也未启动游戏，FPS E2E（端到端验证）未形成。

## 与其他模块的关系

读取采集时间轴并与进程资源对齐；timeaudit-diagnostics 先读它的有界诊断聚合，必要时再进 Grafana 深读；电脑配置项目读同一份健康状态和历史 summary，自己决定是否重查现场。可靠性模块防止探针失败扩散。
