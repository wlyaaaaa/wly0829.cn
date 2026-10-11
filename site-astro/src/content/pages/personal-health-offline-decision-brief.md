---
{
 "title": "先检查数据是否完整，再只取与问题有关的部分",
 "kind": "project",
 "url": "/projects/personal-health/offline-decision-brief/",
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
  "page": "personal-health-offline-decision-brief",
  "kind": "project",
  "title": "先检查数据是否完整，再只取与问题有关的部分",
  "url": "/projects/personal-health/offline-decision-brief/",
  "parent": "personal-health",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "源码最后变更 10 月 7 日，10 月 11 日只读核对；真实采集链已有完成记录，本次未打开任何简报健康内容"
  }
 },
 "source": {
  "page": "sources/pages/personal-health-offline-decision-brief/page.json",
  "sha256": "8616dc41b0fd924d52d15b4c336f99d7d87da14d5885db3273f008c74e2e1e1a",
  "converted_at_beijing": "2026-10-11T21:05:00+08:00"
 }
}
---

::screen{#personal-health-offline-decision-brief-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-01",
  "section": "top",
  "title": "先检查数据是否完整，再只取与问题有关的部分",
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
     "text_ref": "先检查数据是否完整，再只取与问题有关的部分",
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
     "static_note": "截至 10 月 11 日 · 源码最后变更 10 月 7 日，10 月 11 日只读核对；真实采集链已有完成记录，本次未打开任何简报健康内容",
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
     "text_ref": "先检查数据是否完整，再只取与问题有关的部分",
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
     "static_note": "截至 10 月 11 日 · 源码最后变更 10 月 7 日，10 月 11 日只读核对；真实采集链已有完成记录，本次未打开任何简报健康内容"
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
   "asset": "_library/module-illustrations/personal-health/offline-decision-brief-v01.png",
   "key": "main-personal-health",
   "source_phrase": "右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。",
   "sha256": "2c2c471962a5bade690db4b82bc8aa9122c6d4b6855ec4f8994e129f72bff367",
   "status": "ready"
  }
 ]
}
```

# 先检查数据是否完整，再只取与问题有关的部分

〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕

个人健康证据与安全决策 · 功能说明

保全数据与采用数据是两件事。这次只联网补了新日期，也能继续比较已经保存的完整历史，长期趋势不会缩成最近一次下载。默认摘要比较最近14/28/90天；我指定完整中国日起止范围时，就离线统计这一段并判断其覆盖和质量。只查某一天是否保存记录，也可沿相应原件窄查，不必重新同步全部设备数据。

**当前情况：**这条离线核对和简报链已经在真实数据上跑过：每次成功的刷新都要先做完离线核对和简报才算完成，已有 13 份完成的采集清单，最近一次 10 月 7 日。本页没有打开任何简报的健康内容，也不知道健康项目实际采用了哪份结果。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-health-offline-decision-brief-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-02",
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

设备 API 能读的字段很多。若把高频心率、位置、营养目录、空日志和估算噪声全部常驻，不仅扩大私人数据面，也会让低质量信号压过真正相关证据。

## 举个实际例子

我问“上周三的步数有没有保存？不用重新同步。”系统只在已经完成的那份导出里查这一天，告诉我找到几条、覆盖到什么时间；没找到只代表这份记录里没有，不能顺手说成那天一步都没走。

## 最后我会得到什么

得到所选日期里睡眠、步数、活动或已记录运动的变化、覆盖和缺口，知道每项记录目前能不能用于眼前问题。只问某一天时只读那天已保存的字段；查到记录不等于能作医学判断。

::screen{#personal-health-offline-decision-brief-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-03",
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

所选日期和字段的来源、完整性与质量都过关时，才交健康项目负责人用于当前问题；单日查询只说明这一天保存了什么。

## 需要复核

重叠、缺页或覆盖不足会明确列出。某日没查到记录不等于真实数值为零，也不重新下载整段历史。

## 本轮不可用

选中的导出或文件无法核对时，先停在证据层，不根据残缺摘要解释身体状况。

::screen{#personal-health-offline-decision-brief-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-04",
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
     "text_ref": "1. **系统核对并处理**　先离线核对原始页与覆盖，再按所选范围汇总相关字段；指定长范围就按该范围自身的质量判断。",
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
     "text_ref": "1. **系统核对并处理**　先离线核对原始页与覆盖，再按所选范围汇总相关字段；指定长范围就按该范围自身的质量判断。",
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

问近两周变化，或明确指定已采集的完整中国日期范围。

## 需要准备什么

- 要比较的睡眠、步数或活动等问题

- 想看的日期范围（如指定）

## 从开始到拿到结果

1. **系统核对并处理**　先离线核对原始页与覆盖，再按所选范围汇总相关字段；指定长范围就按该范围自身的质量判断。

2. **交付与接续**　交回变化、缺记录和可用性；保存了数据不等于这一字段足以支持健康结论。

::screen{#personal-health-offline-decision-brief-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-05",
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
     "text_ref": "1. 默认判断范围只有睡眠、步数、活动分钟和已记录运动事件。",
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
     "text_ref": "1. 默认判断范围只有睡眠、步数、活动分钟和已记录运动事件。",
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

**10 月 11 日核对**　采集结果和简报仍不走网络和凭据；新版加入：核对回执可合法重签后完整重验、迁到别的磁盘不误判为数据被改、读取预算按每份采集分别计算、库存计数注明只覆盖本次网络窗口、完整日期上界按采集开始那天算。算法版本由 7 升到 9，简报格式仍是 v4，离线验真格式仍是 v3。9 月 14 日全套 140 项离线合成测试通过是当时的历史记录；本次没有运行测试，也没有读个人健康数值。

## 关键规则与设计选择

1. 默认判断范围只有睡眠、步数、活动分钟和已记录运动事件。

2. 默认最近 14 天至少 80% 日期有可解释记录是数据覆盖门，不是健康目标；运动事件是否可用也按最近 14 天自己的质量判断，历史上的坏记录不会永久挡住今天；全历史问题仍单独保留。指定日期使用 requested_period 自己的覆盖与 decision_ready。

3. 用户指定范围时使用 brief --start / --through，含首尾且只接受已采集的完整中国日；完整日的上界按采集开始那天算，续跑拖过午夜也不扩大。

4. 质量按字段、日期和可回答的量分别判断；坏记录日期明确就只影响该日，日期不明才保守影响整页对应日期。

5. 已处理成功且时长／区间可信的主睡眠加小睡双标签记录归入 multiple_roles，时长只计一次，不参与主睡眠起止推断；不重复计算、不擅自归类。

6. 比较窗口为 14、28、90 天，并保留长期 90 天块与时间边界。

7. inventory_only 只读清单里的库存，不读取原始内容；计数注明 record_count_scope=this_capture_network_window_only，只代表本次网络窗口，这个窗口里没记录不等于历史上从没记录。

8. 具体日期仍未回答时，用精确清单、一个 --field 与日期离线窄查；不扫描目录、不重新下载。

::screen{#personal-health-offline-decision-brief-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-06",
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
     "text_ref": "9. 日期有两种角色：统计归属按北京时间——睡眠按醒来日，带明确时区的运动按开始日，日步数允许恰好到次日 00:00 的整日区间；历史分段归属按数据提供方给的日历结束日。没有时区的值不猜。",
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
     "text_ref": "9. 日期有两种角色：统计归属按北京时间——睡眠按醒来日，带明确时区的运动按开始日，日步数允许恰好到次日 00:00 的整日区间；历史分段归属按数据提供方给的日历结束日。没有时区的值不猜。",
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

9. 日期有两种角色：统计归属按北京时间——睡眠按醒来日，带明确时区的运动按开始日，日步数允许恰好到次日 00:00 的整日区间；历史分段归属按数据提供方给的日历结束日。没有时区的值不猜。

10. query/summary 的默认和硬上限均为 100 页、32 MiB、10,000 条，可按问题缩小，不能靠调大越过上限；这与简报的预算是两套不同限制。

## 当前怎样实现

- capture --latest 读取最多 16 KiB 的固定指针，要求同一采集目录下的规范清单、验证回执与简报，并核对格式、complete 状态和文件 SHA-256；缺失或越界返回 latest_capture_*，不扫描替代目录。验证回执被合法重签时，在同一份清单上完整重验通过才接受，并标出 verification_receipt_reissued=true，不是跳过核验。

- 原件状态承诺升到第 2 版，绑定相对路径、大小和修改时间；旧第 1 版仍兼容。整份采集拷到别的磁盘，不会因为磁盘编号变了被误判成数据变了。简报仍按 SHA-256 绑定，不偷偷改固定指针。

- google_health_capture.py 只读固定成功交接，验证精确清单路径、状态与 SHA-256。

- google_health_brief.py 只选择 DECISION_CONTEXT_FIELDS；256 页、64 MiB、50 万条记录的预算按每份不可变采集分别计算，不让多年增量历史共用一份终身额度，总用量仍汇总列出。

- _verified_history_segments 核对扁平历史段、对应清单哈希和既有验真回执；build_health_brief 从各有效分段选四类低噪声判断字段，按分段边界裁剪日期，排除已由新采集替代的旧当天。query_manifest 同样把字段与日期路由到对应原件。

- 数值和事件字段分别处理真实零、重复、歧义、格式错误、无记录和来源缺失。

::screen{#personal-health-offline-decision-brief-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-07",
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
     "text_ref": "- 简报输出 decision_context 与 inventory_only 两个不混用区域，并显式写出 completed_history_counted（旧完整历史是否计入）。",
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
     "text_ref": "- 简报输出 decision_context 与 inventory_only 两个不混用区域，并显式写出 completed_history_counted（旧完整历史是否计入）。",
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

- 简报输出 decision_context 与 inventory_only 两个不混用区域，并显式写出 completed_history_counted（旧完整历史是否计入）。

- resource_usage 明确 api_access=false、credential_access=false、full_raw_payloads_scanned=false。

- google_health_import.py 的 query_manifest 按字段与日期相交范围选择页面，核对每页字节与 SHA-256，再按字段专用日期解析记录并去重；清单元数据字节与原始页预算分开计数。

- --query-manifest 返回 records 及 summary；--summary-manifest 调用同一查询但不带记录。summary 包含记录数、无日期资源数、重复数、页数和天数，不计算数值总和与最值。

- 查询结果单列清单指纹、页数、读取字节、记录数、重复数、缺口、是否截断和用时；api_elapsed_seconds 恒为 0，不代表在线账号或设备当前可用。

## 执行流程

1. 读取有界成功交接并解析精确清单。

2. 验证 complete 状态与清单指纹。

3. 生成或加载离线验证回执；回执被重签时完整重验。

::screen{#personal-health-offline-decision-brief-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-08",
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
     "text_ref": "4. 核对当前清单与扁平历史分段；从各有效日期段只选择四类判断字段页面，排除已由新采集替代的旧当天。",
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
     "text_ref": "4. 核对当前清单与扁平历史分段；从各有效日期段只选择四类判断字段页面，排除已由新采集替代的旧当天。",
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

4. 核对当前清单与扁平历史分段；从各有效日期段只选择四类判断字段页面，排除已由新采集替代的旧当天。

5. 计算字段质量、近期窗口和不可用原因。

6. 生成判断区、仅库存区和下游使用规则。

7. 本地清单、验证回执与简报闭合并保存后消费交接指针；健康项目随后审阅最小结果并决定是否局部采用。

8. 另有未回答的具体日期问题时，复用已完成的精确清单，以一个字段和日期执行查询或摘要；交回记录与缺口，不启动新的采集。

::screen{#personal-health-offline-decision-brief-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-09",
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
| decision_ready（可用于当前判断） | 字段证据质量足以支持一个明确问题，不代表身体正常或临床结论。 |
| inventory_only（仅清单） | 只知道资料类型存在，不读取正文、不进入判断。 |
| Coverage gate（覆盖门） | 检查近期可解释日期占比；80% 是数据完整性要求，不是医学阈值。 |
| Downstream contract（下游使用合同） | 只有相关字段自身 ready、来源 ready 且会改变判断时才能被 Health Owner（健康资料责任源） 采用。 |

## 专业定义

设备能提供很多数据，但当前判断只采用来源清楚、质量足够、确实相关的最小部分；其余只记录存在或暂时不用。

::screen{#personal-health-offline-decision-brief-10 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-10",
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
     "text_ref": "- 不读取高频心率原始数据、GPS/TCX、营养参考和其他仅库存字段的正文。",
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
     "text_ref": "- 不读取高频心率原始数据、GPS/TCX、营养参考和其他仅库存字段的正文。",
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

解决“API 能读就全部进模型”、高频／高隐私字段常驻、空日志被解释、摘要读取全库、局部网络计数被当成完整历史、迁盘被当成内容损坏，以及技术覆盖率冒充医学标准。

## 边界

- 不读取高频心率原始数据、GPS/TCX、营养参考和其他仅库存字段的正文。

- 没有记录不证明没有运动、症状或疾病；本次网络窗口没记录也不代表历史为空。

- 80% 覆盖不表示健康，也不是目标分数。

- 简报输出不包含授权文件、令牌、客户端或实时网络状态。

- 普通查询通过不是 decision_ready，也不自动更新 CURRENT.md；字段质量、来源与现实相关性仍由健康项目审阅判断。

## 失败与恢复

- **混合第一方来源无法证明设备家族**：四类默认字段全部 provenance_blocked，只保留库存。

- **选中原始页哈希或分页链变化**：验证过期，简报在读取健康解释前失败；仅是合法重签的回执则完整重验后才接受。

- **字段为空、缺失或格式错误**：列入 blocked_fields，不把缺失转成零或正常。

::screen{#personal-health-offline-decision-brief-11 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-11",
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
     "text_ref": "- **简报选择页／字节／记录预算超限**：返回 health_brief_budget_exceeded，不扩大读取范围。",
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
     "text_ref": "- **简报选择页／字节／记录预算超限**：返回 health_brief_budget_exceeded，不扩大读取范围。",
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

- **简报选择页／字节／记录预算超限**：返回 health_brief_budget_exceeded，不扩大读取范围。

- **某日查询达到页数、字节或记录上限**：保留已读结果并返回 partial、truncated=true 与对应的预算缺口；缩小字段或日期后再查，不隐去截断。

- **某日查询页面缺失、哈希漂移或记录日期不明**：返回 partial，并分别记录 page_unreadable、manifest_page_hash_mismatch 或 record_date_unavailable；未覆盖日期仍列为缺口，不补猜数值。

- **查询字段不在清单、日期范围非法或预算参数非法**：分别返回 query_field_not_in_manifest、invalid_query_date_range 或 query_budget_invalid；不回退到全字段或在线查询。

::screen{#personal-health-offline-decision-brief-12 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-12",
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
     "text_ref": "- google_health_capture.py　有界成功交接、离线验证、回执重签重验、简报保存与指针清理",
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
     "text_ref": "- google_health_capture.py　有界成功交接、离线验证、回执重签重验、简报保存与指针清理",
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

- google_health_capture.py　有界成功交接、离线验证、回执重签重验、简报保存与指针清理

- google_health_brief.py　字段解析、窗口、质量门、仅库存区、库存计数范围和下游规则

- google_health_history.py　扁平历史段身份、连续日期、完整日上界与清单哈希核对

- tests/test_google_health_incremental.py　跨采集历史、旧未完整日替代与离线无重计合成验证

- google_health_import.py · query_manifest / summarize_manifest　精确字段日期查询、独立读取预算、记录／摘要／缺口与零 API 耗时

- tests/test_google_health_capture.py　离线无凭据／网络、错误交接和安全重试回归（现有 7 个测试函数）

- tests/test_google_health_brief.py　来源、哈希、覆盖、字段三态、仅库存区与命令行回归（现有 42 个测试函数）

- tests/test_google_health_import.py · offline query tests　按日期过滤、跨午夜睡眠、重复记录、缺页和预算截断的合成用例

::screen{#personal-health-offline-decision-brief-13 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-offline-decision-brief-13",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 中断后继续",
    "href": "/projects/personal-health/raw-preservation-resume/"
   },
   {
    "text": "下一个模块 证据三态",
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
     "text_ref": "- capture 测试证明入口没有授权、客户端或联网路线，失败保留成功指针供离线重试。",
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
     "text_ref": "- capture 测试证明入口没有授权、客户端或联网路线，失败保留成功指针供离线重试。",
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

- capture 测试证明入口没有授权、客户端或联网路线，失败保留成功指针供离线重试。

- brief 测试覆盖混合来源、真实零、空字段、哈希漂移、分页链、覆盖和仅库存区。

- 全项目现有 192 个测试函数、参数展开 213 个用例（10 月 11 日静态计数，本次没有运行）；9 月 14 日 140 项通过是历史记录。

- 本次没有读取任何真实健康数值，也没有生成个人趋势。

## 与其他模块的关系

它消费原始保全模块的完成证据，向证据三态和健康审阅模块提供字段级可用／不可用结果。
