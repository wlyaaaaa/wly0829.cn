---
{
 "title": "内存耗尽与突然卡住时，留下可追查的记录",
 "kind": "project",
 "url": "/projects/pcconfig/memory-diagnostics/",
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
  "page": "pcconfig-memory-diagnostics",
  "kind": "project",
  "title": "内存耗尽与突然卡住时，留下可追查的记录",
  "url": "/projects/pcconfig/memory-diagnostics/",
  "parent": "pcconfig",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "按 PCConfig 431ad1c1 源码与说明；自然开机与硬断电尾段仍未实测。"
  }
 },
 "source": {
  "page": "sources/pages/pcconfig-memory-diagnostics/page.json",
  "sha256": "13c3ab091553a3cfbbe60a4420bc3723e4abe3959900e49344a1de67f2302581",
  "converted_at_beijing": "2026-10-11T19:04:25+08:00"
 }
}
---

::screen{#pcconfig-memory-diagnostics-01 section="top"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-01",
  "section": "top",
  "title": "内存耗尽与突然卡住时，留下可追查的记录",
  "links": [
   {
    "text": "回到项目 → 电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/pcconfig/#ai-brief"
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
     "text_ref": "内存耗尽与突然卡住时，留下可追查的记录",
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
     "static_note": "截至 10 月 11 日 · 按 PCConfig 431ad1c1 源码与说明；自然开机与硬断电尾段仍未实测。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑配置与恢复〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "电脑突然卡住甚至只能断电时，事后再打开任务管理器往往已经看不到当时是谁占用了内存。这项能力让 Windows 自己记录系统内存、内核池和进程私有内存的变化，故障后按时间与当时 PID 追查。它独立于 Codex、TimeAudit、Docker 和网络，既不会杀进程，也不会为了取证重启电脑。",
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
     "text_ref": "内存耗尽与突然卡住时，留下可追查的记录",
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
     "static_note": "截至 10 月 11 日 · 按 PCConfig 431ad1c1 源码与说明；自然开机与硬断电尾段仍未实测。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑配置与恢复〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "电脑突然卡住甚至只能断电时，事后再打开任务管理器往往已经看不到当时是谁占用了内存。这项能力让 Windows 自己记录系统内存、内核池和进程私有内存的变化，故障后按时间与当时 PID 追查。它独立于 Codex、TimeAudit、Docker 和网络，既不会杀进程，也不会为了取证重启电脑。"
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
   "asset": "_library/illustrations/modules/pcconfig-memory-diagnostics-v01.png",
   "key": "main-pcconfig",
   "source_phrase": "横版：和已通过的第 1 屏（E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\pcconfig\\screen-01-desktop.png）同一版式、同一幅插画，拿它做底只改四处。",
   "sha256": "007423ece336bc581c33e684520d6ac6ab69f4caffdb53ae8bfbf3b7fbcf7186",
   "status": "ready"
  }
 ]
}
```

# 内存耗尽与突然卡住时，留下可追查的记录

〔回到项目 → 电脑配置与恢复〕　〔复制 AI 续作说明〕

PCConfig · 功能说明

电脑突然卡住甚至只能断电时，事后再打开任务管理器往往已经看不到当时是谁占用了内存。这项能力让 Windows 自己记录系统内存、内核池和进程私有内存的变化，故障后按时间与当时 PID 追查。它独立于 Codex、TimeAudit、Docker 和网络，既不会杀进程，也不会为了取证重启电脑。

**当前情况：**突然断电前最后一段和自然开机接续尚未实测。

项目事实核对截至 2026-10-11 14:00（北京时间）；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#pcconfig-memory-diagnostics-02 section="usage"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-02",
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

系统提交量耗尽可能来自某个应用、内核池或其他来源；一个进程此刻占用最多，不能证明它造成了之前的卡死。只扩大分页文件只能增加余量，持续保留故障前后的数字，才能区分真正增长的来源。

## 举个实际例子

“刚才电脑突然卡住，重开后又正常了。看看卡住前是谁的内存在涨，先别结束程序。”系统先对齐发生时间，读取上一会话留下的尾段、邻近内存记录和Windows事件，比较进程私有字节、系统提交量与内核池变化；日志缺失时说清缺口，不把当前排行榜当根因。

## 最后我会得到什么

给我故障前后能读到的内存变化、当时相关程序和仍缺的时段。它帮助缩小原因，不会自行结束程序；突然断电前尚未写下的最后一小段可能找不回来。

::screen{#pcconfig-memory-diagnostics-03 section="usage"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-03",
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

故障时段确有记录时，比较当时程序和整机内存的变化，只对证据支持的原因下结论。

## 发现问题时

日志损坏或某类内存突然增长时，说明具体疑点与接下来的检查，不靠重启掩盖。

## 入口不可用或证据不足时

没有当时记录或断电尾段丢失时直接说明，保留现有材料，不猜哪个程序造成卡顿。

::screen{#pcconfig-memory-diagnostics-04 section="usage"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-04",
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
     "text_ref": "电脑卡住后，在已接入 PCConfig 的 AI 对话中提供发生时间，要求读取“内存卡顿诊断”；这是只读分析入口。",
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
     "text_ref": "1. **圈定故障时间**　先把现象和重启时间对齐，避免拿现在的进程榜解释过去。",
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
     "text_ref": "电脑卡住后，在已接入 PCConfig 的 AI 对话中提供发生时间，要求读取“内存卡顿诊断”；这是只读分析入口。"
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
     "text_ref": "1. **圈定故障时间**　先把现象和重启时间对齐，避免拿现在的进程榜解释过去。",
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

电脑卡住后，在已接入 PCConfig 的 AI 对话中提供发生时间，要求读取“内存卡顿诊断”；这是只读分析入口。

## 需要准备什么

- 卡顿或断电的大致时间

- 是否已重启

- 希望排查的程序线索

## 从开始到拿到结果

1. **圈定故障时间**　先把现象和重启时间对齐，避免拿现在的进程榜解释过去。

2. **读当时记录**　读取上一会话尾段、内存计数和 Windows 事件，比较进程与系统内存变化。

3. **交回可能原因**　列出有证据的增长线索和缺口；未保存的断电尾段不能补猜，也不会自动结束进程。

::screen{#pcconfig-memory-diagnostics-05 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-05",
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
     "type": "prose",
     "text_ref": "这里保留实现、关键条件、精确入口、历史记录和验证结果。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 系统提交量、内核池和进程私有内存共同判断；最高占用不等于内存泄漏。",
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
     "text_ref": "1. 系统提交量、内核池和进程私有内存共同判断；最高占用不等于内存泄漏。",
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

自然开机与硬断电尾部仍未验。

## 关键规则与设计选择

1. 系统提交量、内核池和进程私有内存共同判断；最高占用不等于内存泄漏。

2. 采样在 Windows 原生性能收集器中持续进行，短脚本只做开机接续和分段后的限额清理。

3. 记录是有界故障证据，不是全机活动库；不读取命令行、窗口标题、聊天或文件正文。

4. PerfMon 停止当前记录；要重启后仍停用，使用 Stop 或同时禁用对应任务。

5. 4320 段是数量上限，不是保证保留三天；硬断电可能损坏当前段或丢失未落盘尾部。

6. 读取有预算：最多看 60 个候选段，超出预算或段数上限就返回“部分”结果；“摘要读取失败”（还不知道是否落在窗口内）和“窗口样本读取失败”（已确认落在窗口内后失败）分开报告，不混成窗口损坏。

::screen{#pcconfig-memory-diagnostics-06 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-06",
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
     "text_ref": "- tools/Invoke-MemoryFreezeDiagnostics.ps1 管理安装、启动、停止、状态和卸载；唯一原生收集器为 PCConfig-MemoryDiagnostics，根目录任务为 PCConfig Memory Diagnostics。",
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
     "text_ref": "- tools/Invoke-MemoryFreezeDiagnostics.ps1 管理安装、启动、停止、状态和卸载；唯一原生收集器为 PCConfig-MemoryDiagnostics，根目录任务为 PCConfig Memory Diagnostics。",
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

- tools/Invoke-MemoryFreezeDiagnostics.ps1 管理安装、启动、停止、状态和卸载；唯一原生收集器为 PCConfig-MemoryDiagnostics，根目录任务为 PCConfig Memory Diagnostics。

- Windows 性能日志每 5 秒记录系统提交量、提交上限、可用内存、分页池与非分页池、换页速率、分页文件使用率，以及各进程的私有字节、工作集和 PID。

- 每 60 秒或 16 MiB 封存一段，递增序号避免覆盖；同一 SYSTEM 任务在开机延迟 30 秒和分段关闭时运行维护脚本，不要求用户登录。

- 循环区按最旧优先清理，上限 1 GiB 或 4320 段；从停止状态启动前，另存上一会话最新 15 段、最多 64 MiB，只留最近三个会话。

- 日常读取用 Get-MemoryFreezeEvidence.ps1 -Minutes 15 -Json：在原生 Windows PowerShell 里先聚合再以 JSON 返回；只看覆盖范围时用 CoverageOnly。以前 Import-Counter 对有效文件报错，已查明是兼容调用把嵌套样本转成字符串所致，不是日志坏了；relog 只留给明确需要原过程的本地取证。

- 活跃段、无效计数器、滚动覆盖和旧会话尾段分开处理；活跃段明确排除并写明原因。

- Get-ComputerStutterDiagnostic.ps1 把 TimeAudit 有界摘要、原生内存记录和 Windows 事件按同一时间窗交回，保留每条来源的覆盖和未知；它只证明该时段可读，不证明某个程序造成了问题。

- Stop 先禁用维护任务再停止收集器，并保留日志；完成回调不会复活已停止的收集器。

::screen{#pcconfig-memory-diagnostics-07 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-07",
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
     "text_ref": "1. 记录异常及断电时刻，统一按同一时区对齐。",
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
     "text_ref": "1. 记录异常及断电时刻，统一按同一时区对齐。",
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

1. 记录异常及断电时刻，统一按同一时区对齐。

2. 只读确认采样状态与保存位置。

3. 选上一会话尾段和故障邻近的已关闭段。

4. 用 Get-MemoryFreezeEvidence 读取必要计数器，并结合 Windows 事件。

5. 按当时 PID 比较私有内存、系统提交与内核池趋势。

6. 交回原因排序、覆盖缺口与有依据的下一步。

::screen{#pcconfig-memory-diagnostics-08 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-08",
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
| System commit（系统提交量） | Windows已承诺提供后备存储的内存总量；应与提交上限和各来源趋势一起看。 |
| Kernel pool（内核池） | 内核和驱动使用的内存，分别查看分页池与非分页池，不能全部归因给应用。 |
| BLG（Windows二进制性能日志） | 保存计数器随时间变化的原生文件；文件存在不等于数值与故障时段可读。 |

## 专业定义

即使AI、数据库或网络不可用，Windows仍按固定间隔留下内存与进程证据；恢复后按故障时间查，而不是只看当前任务管理器。

::screen{#pcconfig-memory-diagnostics-09 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-09",
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
     "text_ref": "- 不依赖 Codex、TimeAudit、Docker 或网络，不读取私人正文",
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
     "text_ref": "- 不依赖 Codex、TimeAudit、Docker 或网络，不读取私人正文",
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

故障发生后现场容易消失；把记录放进依赖数据库、网络或 AI 的链条，还可能与业务一起停止。因此 Windows 原生收集器保留必要数字，AI 在故障发生后才读取和判断。

## 边界

- 不依赖 Codex、TimeAudit、Docker 或网络，不读取私人正文

- 不杀进程、不重启电脑、不重置显示；记录不会自动修复内存泄漏

- 硬断电的活跃段和未落盘尾部可能损坏或丢失；不承诺保住最后一秒

- 停止与卸载保留日志

- PID 与时间共同归因，进程实例后缀可能复用

- 某一次短采样的可用内存或提交量只是当时读数，不用来改容量或回写基线

::screen{#pcconfig-memory-diagnostics-10 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-10",
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
     "text_ref": "- **原生安装或配置回读失败**：按安装前像恢复原任务和收集器；回滚失败单独报告。",
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
     "text_ref": "- **原生安装或配置回读失败**：按安装前像恢复原任务和收集器；回滚失败单独报告。",
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

## 失败与恢复

- **原生安装或配置回读失败**：按安装前像恢复原任务和收集器；回滚失败单独报告。

- **收集器手动停止后收到分段完成事件**：保持停止；只有明确 Start 或仍启用的下一次开机任务才接续。

- **维护失败或任务结果非零**：保留最近错误与实际状态；没有错误文件不能反推没有丢样。

- **读取超出预算或段数上限**：返回部分结果并说明截断，不把截断说成完整覆盖。

- **非分页池突增而应用占用不解释系统提交**：转向内核池与驱动取证。

- **硬断电后最后日志不可读**：使用已关闭分段和保存的会话尾段，明确缺失范围。

::screen{#pcconfig-memory-diagnostics-11 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-11",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "上一个模块 机器事实",
    "href": "/projects/pcconfig/machine-facts/"
   },
   {
    "text": "下一个模块 运行与启动",
    "href": "/projects/pcconfig/runtime-startup/"
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 用途、数据类别、停止语义、限额、断电边界和恢复流程（docs/recovery/memory-freeze-diagnostics.md）",
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
     "text_ref": "- 用途、数据类别、停止语义、限额、断电边界和恢复流程（docs/recovery/memory-freeze-diagnostics.md）",
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

- 用途、数据类别、停止语义、限额、断电边界和恢复流程（docs/recovery/memory-freeze-diagnostics.md）

- 配置、安装回滚、状态和启停入口（Invoke-MemoryFreezeDiagnostics.ps1）

- 有界读取入口 Get-MemoryFreezeEvidence.ps1

- 卡顿联合诊断 Get-ComputerStutterDiagnostic.ps1

::screen{#pcconfig-memory-diagnostics-12 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 机器事实",
    "href": "/projects/pcconfig/machine-facts/"
   },
   {
    "text": "下一个模块 运行与启动",
    "href": "/projects/pcconfig/runtime-startup/"
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
     "text_ref": "- 本次没有结束进程、重启、断电或做启停测试",
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
     "text_ref": "- 本次没有结束进程、重启、断电或做启停测试",
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

- 本次没有结束进程、重启、断电或做启停测试

- 历史（之后未重新核对）：2026-09-14 10:55 只读状态显示已安装、运行、自动接续启用、最近维护结果 0

- 仍未验收：自然物理开机的完整接续、硬断电最后一段、新 Stop 不复活和再次 Start 保留尾段的端到端

::screen{#pcconfig-memory-diagnostics-13 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-memory-diagnostics-13",
  "section": "tech",
  "title": "依据与来源（三）",
  "links": [
   {
    "text": "上一个模块 机器事实",
    "href": "/projects/pcconfig/machine-facts/"
   },
   {
    "text": "下一个模块 运行与启动",
    "href": "/projects/pcconfig/runtime-startup/"
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

## 与其他模块的关系

机器事实模块负责硬件与配置导航；本模块拥有内存故障时序、采样生命周期及故障后读回。TimeAudit 提供更广的历史信号，电脑 MCP 的长期资源信号提供看板趋势；它们不替代本模块独立的原生记录。
