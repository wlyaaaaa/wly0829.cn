---
{
 "title": "资源紧张有记录，普通警告不弹窗",
 "kind": "project",
 "url": "/projects/ramdisk-guardian/host-memory-telemetry-and-silent-monitoring/",
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
  "page": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring",
  "kind": "project",
  "title": "资源紧张有记录，普通警告不弹窗",
  "url": "/projects/ramdisk-guardian/host-memory-telemetry-and-silent-monitoring/",
  "parent": "ramdisk-guardian",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "截止前最后一轮巡查是 10 月 11 日 13:46（WARN）；源码按 10 月 6 日最后一次提交核对，测试本轮没有运行"
  }
 },
 "source": {
  "page": "sources/pages/ramdisk-guardian-host-memory-telemetry-and-silent-monitoring/page.json",
  "sha256": "ed1e103894a258648bcadfa94e3c5a3fc97c7a86cf47b129b8825c79de985337",
  "converted_at_beijing": "2026-10-11T19:04:25+08:00"
 }
}
---

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-01 section="top"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-01",
  "section": "top",
  "title": "资源紧张有记录，普通警告不弹窗",
  "links": [
   {
    "text": "回到项目 → 内存盘守护",
    "href": "/projects/ramdisk-guardian/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/RamdiskGuardian"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/ramdisk-guardian/#ai-brief"
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
     "text_ref": "资源紧张有记录，普通警告不弹窗",
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
     "static_note": "截至 10 月 11 日 · 截止前最后一轮巡查是 10 月 11 日 13:46（WARN）；源码按 10 月 6 日最后一次提交核对，测试本轮没有运行",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 内存盘守护〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "保留排查资源问题的线索，避免普通内存波动反复打断当前工作。",
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
     "text_ref": "资源紧张有记录，普通警告不弹窗",
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
     "static_note": "截至 10 月 11 日 · 截止前最后一轮巡查是 10 月 11 日 13:46（WARN）；源码按 10 月 6 日最后一次提交核对，测试本轮没有运行"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 内存盘守护〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "保留排查资源问题的线索，避免普通内存波动反复打断当前工作。"
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
   "asset": "_library/illustrations/modules/ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-v01.png",
   "key": "main-ramdisk-guardian",
   "source_phrase": "右上一幅水彩插画：一根绿色内存条被画成一块小硬盘的样子，盘面写着“Z”，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存。",
   "sha256": "91f07fddb20d9bdc0f48421244e98683725c2dfe070bfa8abb3b979f8ee5331e",
   "status": "ready"
  }
 ]
}
```

# 资源紧张有记录，普通警告不弹窗

〔回到项目 → 内存盘守护〕　〔GitHub〕　〔复制 AI 续作说明〕

RamdiskGuardian · 功能说明

保留排查资源问题的线索，避免普通内存波动反复打断当前工作。

**当前情况：**10 月 11 日 13:46 截止前最后一轮是 WARN：和这块盘对得上的内存增长到了 8 GiB，但还要下一轮确认趋势，所以没有动盘，也没有弹窗。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 内存盘占用系统真实RAM。只看计划任务返回0会漏掉内存紧张；每次警告都弹窗又会干扰使用。项目把执行结果和健康状态分开，并保留警告日志。 举个实际例子 “我刚才看到WARN，现在还要处理吗？”先"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 内存盘占用系统真实RAM。只看计划任务返回0会漏掉内存紧张；每次警告都弹窗又会干扰使用。项目把执行结果和健康状态分开，并保留警告日志。 举个实际例子 “我刚才看到WARN，现在还要处理吗？”先"
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

内存盘占用系统真实RAM。只看计划任务返回0会漏掉内存紧张；每次警告都弹窗又会干扰使用。项目把执行结果和健康状态分开，并保留警告日志。

## 举个实际例子

“我刚才看到WARN，现在还要处理吗？”先看最近一轮：10 月 11 日 13:46 盘只用了 0.5 GiB，可用内存 13.8 GiB，提醒的原因是“和这块盘对得上的内存增长 8 GiB，超过 4 GiB 的提醒线”；守护器在等下一轮确认趋势，暂不动盘。这条提醒说明值得留意，不证明 Primo 坏了，也不是一直有效的清盘指令。

## 最后我会得到什么

最近状态和过程写入可读文件；普通内存警告不弹窗，严重错误从正常转入时才尝试提醒。AI 用一个只读入口就能告诉我：最近一轮是什么时候、新不新鲜、在跑的是不是当前版本、为什么提醒、自动恢复是被什么挡住的。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-outcome_cards-01 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-outcome_cards-01",
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
    }
   ]
  }
 },
 "images": []
}
```

## 结果怎么看

## 正常工作

本轮空间和内存读数没有触发警告，记录正常；而且这份记录够新（默认 15 分钟一轮时，不超过 33 分钟），在跑的也是当前源码。

## 发现问题

资源紧张、内存增长对得上这块盘或部分读数失败时留下具体警告，不自动结束应用；该恢复但被暂停、使用者、冷却或趋势确认挡住时，也写明是哪一项挡住了。

## 暂不可用

某项读数缺失、重复、失败或算出不合理的数时，写成“不可用”并保留上一份有效基线，不拿 0 补齐，不能把缺值解释成一切正常。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-03",
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
     "text_ref": "在已接通这台电脑的 AI 对话中问“Z 盘最近空间和内存巡检怎样”；AI 运行零写入体检入口 Get-RamdiskHealth.ps1 -Json，普通 WARN 不会弹窗。",
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
     "text_ref": "1. **守护器定期读取**　每 15 分钟查看内存盘空间和主机内存，判断是否出现值得提醒的问题。",
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
     "text_ref": "在已接通这台电脑的 AI 对话中问“Z 盘最近空间和内存巡检怎样”；AI 运行零写入体检入口 Get-RamdiskHealth.ps1 -Json，普通 WARN 不会弹窗。"
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
     "text_ref": "1. **守护器定期读取**　每 15 分钟查看内存盘空间和主机内存，判断是否出现值得提醒的问题。",
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

在已接通这台电脑的 AI 对话中问“Z 盘最近空间和内存巡检怎样”；AI 运行零写入体检入口 Get-RamdiskHealth.ps1 -Json，普通 WARN 不会弹窗。

## 需要准备什么

- 想查看哪台电脑最近的巡检

- 遇到的内存或缓存症状

## 从开始到拿到结果

1. **守护器定期读取**　每 15 分钟查看内存盘空间和主机内存，判断是否出现值得提醒的问题。

2. **把结果留在状态里**　最近一轮和过程可回看；体检入口同时核对任务是否启用、周期和上次结果，记录新不新鲜，主脚本和模块指纹是否为当前版本，暂停、恢复状态和使用登记。

3. **按时间解释**　这不是实时监控；电脑关机或任务没运行时，上次正常不代表此刻正常。巡查时刻和体检查询时刻分开写。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-04 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月14日04:03Z自然巡检OK；WARN仍按设计静默 关键规则与设计选择 1 可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。 2 "
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月14日04:03Z自然巡检OK；WARN仍按设计静默 关键规则与设计选择 1 可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。 2 "
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
     "text_ref": "1. 可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。",
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
     "text_ref": "1. 可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。",
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

截止前最后一轮 10 月 11 日 13:46:24 为 WARN，相关增长 8 GiB、趋势待确认、未重建；WARN 仍按设计静默

## 关键规则与设计选择

1. 可用内存<8GiB、提交余量<4GiB、Z空闲<2GiB或已用>8GiB会提醒。

2. 原始不可归属残差≥4GiB、和这块盘对得上的相关增长≥4GiB也会提醒；自动恢复有候选却被暂停、使用者、冷却或趋势确认挡住，以及残差采样不可用，都记为 WARN 并写明原因。

3. WARN写STATUS、.lasthealth和guardian.log；只有进入ERROR才写alerts.log并调用msg.exe。

4. 不自动关闭高内存应用，不调整分页文件；提醒和允许动盘分开判断，满足恢复条件时另进入驱动重建分支。

## 当前怎样实现

- Win32_PerfFormattedData_PerfOS_Memory提供AvailableMBytes、CommitLimit、CommittedBytes；计数缺失、重复、失败、为负或不是有限数时，残差记为不可用并保留最后有效基线。

- Read-RamDiskSpace优先Get-Volume，必要时用System.IO.DriveInfo，最多尝试3次。

- guardian.log超过1MiB时轮换到guardian.log.1；这是运行日志，不是用户文件备份。

- Get-RamdiskHealth.ps1 -Json 是零写入体检：默认 15 分钟任务时观察年龄必须小于 33 分钟且不在未来（一般按“两倍周期加 180 秒”），并核对主脚本和模块两个哈希；暂停、历史恢复失败、恢复进行中、使用者未知、任务失败或缺周期都另报 attention。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-05",
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
     "text_ref": "- 10 月 11 日 13:46:24 记录：Z 已用 0.5 GiB/空闲 11.5 GiB，可用内存 13.8 GiB、提交余量 63.5 GiB、原始残差 -5 GiB，基线就绪，相关增长 8 GiB，自动恢复因“确认趋势中”延后。",
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
     "text_ref": "- 10 月 11 日 13:46:24 记录：Z 已用 0.5 GiB/空闲 11.5 GiB，可用内存 13.8 GiB、提交余量 63.5 GiB、原始残差 -5 GiB，基线就绪，相关增长 8 GiB，自动恢复因“确认趋势中”延后。",
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

- 10 月 11 日 13:46:24 记录：Z 已用 0.5 GiB/空闲 11.5 GiB，可用内存 13.8 GiB、提交余量 63.5 GiB、原始残差 -5 GiB，基线就绪，相关增长 8 GiB，自动恢复因“确认趋势中”延后。

## 执行流程

1. 任务进入一轮巡检并采集空间。

2. 读取系统内存、残差和相关增长，汇总触发的提醒线和挡住恢复的原因。

3. 写入最近健康与日志，仅按ERROR状态变化发出提醒。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-06",
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
| 提交余量 | CommitLimit减CommittedBytes，是新内存申请的剩余预算，不等同于磁盘空闲或物理可用内存。 |
| 相关增长 | 和过去 24 小时的参照相比，“说不清去向的内存”涨了多少、同时可用内存少了多少，取两者较小的那个；两边一起变才算和内存盘对得上。它不等于 Primo 泄漏的量。 |
| 状态变化提醒 | 上次不是ERROR、本次是ERROR才尝试提醒，包括WARN转ERROR；持续同一ERROR不重复弹。 |

## 专业定义

记录空间、内存、提交余量、不可归属残差和相关增长，并给出新鲜度与版本核对；WARN静默，进入ERROR时提醒。

解决什么

任务返回0只能表明脚本结束。当前版本成功和 WARN 返回 0，ERROR 和恢复失败都返回 1；即便如此，返回 0 也不等于健康，必须同时读取健康状态。早期版本曾有 ERROR 路径返回 0，那是旧版本的历史。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-07 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-07",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 定期采样不是实时监控，电脑关机或未满足用户会话条件时不会照常执行。",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 定期采样不是实时监控，电脑关机或未满足用户会话条件时不会照常执行。",
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

任务返回0只能表明脚本结束。已有部分早期ERROR路径也会返回0，必须同时读取健康状态；新修复的紧急恢复失败明确返回非零。

## 边界

- 定期采样不是实时监控，电脑关机或未满足用户会话条件时不会照常执行。

- 无窗启动代码和日志不单独证明每次实际桌面都从未出现窗口。

## 失败与恢复

- **长期提交余量偏低或相关增长持续偏高**　结合其他系统工具查实际占用；守护器不从一个数值猜进程，也不能把增长唯一归因到 Primo，不自行改系统内存配置。

- **采样返回未知**　保留采集失败与缺值，记 WARN 并保留最后有效基线，不能把旧数或0顶上去宣称健康；盘或骨架的关键错误另走 ERROR 并返回非零。

::screen{#ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-08 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-host-memory-telemetry-and-silent-monitoring-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 目录与说明恢复",
    "href": "/projects/ramdisk-guardian/drive-arrival-sensing-and-skeleton-healing/"
   },
   {
    "text": "下一个模块 驱动内存恢复",
    "href": "/projects/ramdisk-guardian/unaccounted-watchdog-and-driver-auto-release/"
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
     "text_ref": "- 旧页记载的 03:43Z 已验收 15 项静态检查保留 WARN 静默断言；当前源码仍定义 15 条具名断言，本轮没有运行。",
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
     "text_ref": "- 旧页记载的 03:43Z 已验收 15 项静态检查保留 WARN 静默断言；当前源码仍定义 15 条具名断言，本轮没有运行。",
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

空间采样、内存与残差提醒线、Set-Health（zguardian.ps1）。

零写入体检：新鲜度、版本指纹、任务、暂停与恢复状态（Get-RamdiskHealth.ps1 -Json）。

最近一次健康快照。

隐藏运行并等待退出。

## 如何验证

- 旧页记载的 03:43Z 已验收 15 项静态检查保留 WARN 静默断言；当前源码仍定义 15 条具名断言，本轮没有运行。

- 9月14日04:03Z（北京时间 12:03）自然任务返回0，STATUS另行回读为OK；9月8日03:37Z曾返回0但STATUS为WARN，任务结果与健康状态分别判断。

- 只读统计现存日志：截至 10 月 11 日 14:00 共 7,444 轮巡查，健康结果 OK 6,351、WARN 1,091、ERROR 1；相邻巡查间隔超过 15.5 分钟的有 59 段，最长约 29 小时，原因没有逐段查。

## 与其他模块的关系

这些读数既用于日常解释，也为下一模块的有条件驱动恢复提供输入。
