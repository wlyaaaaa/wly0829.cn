---
{
 "title": "进程资源、生命周期与有边界的取证线索",
 "kind": "project",
 "url": "/projects/timeaudit/process-forensics/",
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
  "page": "timeaudit-process-forensics",
  "kind": "project",
  "title": "进程资源、生命周期与有边界的取证线索",
  "url": "/projects/timeaudit/process-forensics/",
  "parent": "timeaudit",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核，生命周期等改动仍是未提交候选）；生命周期估算与精确数 10 月 12 日 05:38—05:40 只读重取，未读个人程序明细"
  },
  "based_on": {
   "commit": "c5ca4eeb9574e72baa0dc22eb317687f7322185c",
   "commit_time": "2026-10-11T12:44:01+08:00"
  }
 },
 "source": {
  "page": "sources/pages/timeaudit-process-forensics/page.json",
  "sha256": "98b3a05def7c5bb0feb3f330a278b417a9962a18c2d0b9f8f98e7014641ca2bd",
  "converted_at_beijing": "2026-10-12T06:00:53+08:00"
 }
}
---

::screen{#timeaudit-process-forensics-01 section="top"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-01",
  "section": "top",
  "title": "进程资源、生命周期与有边界的取证线索",
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
     "text_ref": "进程资源、生命周期与有边界的取证线索",
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
     "static_note": "截至 10 月 12 日 · 源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核，生命周期等改动仍是未提交候选）；生命周期估算与精确数 10 月 12 日 05:38—05:40 只读重取，未读个人程序明细",
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
     "text_ref": "先判断故障时间有没有足够记录；值得深查时在本机查看具体程序怎样启动、退出、占内存或写盘，给出可复查线索，不凭程序名定罪。",
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
     "text_ref": "进程资源、生命周期与有边界的取证线索",
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
     "static_note": "截至 10 月 12 日 · 源码仍是 10 月 11 日 12:44 的提交 c5ca4eeb（10 月 12 日 05:39 复核，生命周期等改动仍是未提交候选）；生命周期估算与精确数 10 月 12 日 05:38—05:40 只读重取，未读个人程序明细"
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
     "text_ref": "先判断故障时间有没有足够记录；值得深查时在本机查看具体程序怎样启动、退出、占内存或写盘，给出可复查线索，不凭程序名定罪。"
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
   "asset": "_library/illustrations/modules/timeaudit-process-forensics-v01.png",
   "key": "main-timeaudit",
   "source_phrase": "右上一幅水彩插画：一台机箱侧透的台式电脑，旁边一卷从机箱里缓缓吐出的长纸带，纸带上画着起伏的绿色曲线和一排小刻度（像心电图，纸带上不画字）；纸带旁边一只放大镜停在曲线的一个尖峰上；机箱脚边一张小便签被一枚回形针夹着，便签上只画几道浅灰短线（代表剪贴板记录）。",
   "sha256": "9972d3e3066c185f7efe00ff912666bf845f030feba84ddb688461c6ebec1e0e",
   "status": "ready"
  }
 ]
}
```

# 进程资源、生命周期与有边界的取证线索

〔回到项目 → 电脑使用与性能记录〕　〔GitHub〕　〔复制 AI 续作说明〕

TimeAudit · 功能说明

先判断故障时间有没有足够记录；值得深查时在本机查看具体程序怎样启动、退出、占内存或写盘，给出可复查线索，不凭程序名定罪。

**当前情况：**按时间查看程序资源与启动退出记录的功能在用；取证看板较重的统计 10 月 11 日起改为点开才计算。本轮没有读取个人程序活动明细，也没有做具体某个程序的闪退或联网取证。

项目源码：公开仓库

::screen{#timeaudit-process-forensics-02 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 同名进程可来自不同路径，PID 会复用，退出后信息消失；单凭无签名或端口定罪又会误报。 举个实际例子 我问“刚才到底哪个程序在反复闪退？”摘要先确认那段记录没有断、确实值得深挖；我再打开同一时"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 同名进程可来自不同路径，PID 会复用，退出后信息消失；单凭无签名或端口定罪又会误报。 举个实际例子 我问“刚才到底哪个程序在反复闪退？”摘要先确认那段记录没有断、确实值得深挖；我再打开同一时"
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

同名进程可来自不同路径，PID 会复用，退出后信息消失；单凭无签名或端口定罪又会误报。

## 举个实际例子

我问“刚才到底哪个程序在反复闪退？”摘要先确认那段记录没有断、确实值得深挖；我再打开同一时段的本机明细，把某个程序每隔几秒启动、退出和内存猛涨的变化排在一起。最后看到的是一条可复查的崩溃链，不是系统擅自删文件或给程序扣上“恶意”的帽子。

## 最后我会得到什么

先告诉我故障时段有没有足够记录、是否值得继续查；在本机详细图里再看具体程序的启动、退出、内存和磁盘变化。程序名缺失时不猜，也不把无签名直接判恶意。

::screen{#timeaudit-process-forensics-03 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-03",
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

当时程序的启动、资源和退出能对应起来时，给出可核查的故障线索。

## 发现问题时

程序路径或签名读不到时保留未知，结合其他变化继续分析。

## 入口不可用或证据不足时

那时没有交互桌面或记录缺口太大时，不把空白写成程序正常。

::screen{#timeaudit-process-forensics-04 section="usage"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-04",
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
     "text_ref": "在已接入 timeaudit-diagnostics 的 AI 对话中先给故障时间做有界摘要；需要点名程序时打开同一时段本机 Grafana 取证看板，“组件与提权统计”“崩溃与短命进程统计”“提权、崩溃与外联明细”几组默认折叠，展开才计算。",
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
     "text_ref": "1. **先看是否有记录**　摘要说明那段覆盖是否完整、是否值得继续追查。",
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
     "text_ref": "在已接入 timeaudit-diagnostics 的 AI 对话中先给故障时间做有界摘要；需要点名程序时打开同一时段本机 Grafana 取证看板，“组件与提权统计”“崩溃与短命进程统计”“提权、崩溃与外联明细”几组默认折叠，展开才计算。"
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
     "text_ref": "1. **先看是否有记录**　摘要说明那段覆盖是否完整、是否值得继续追查。",
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

在已接入 timeaudit-diagnostics 的 AI 对话中先给故障时间做有界摘要；需要点名程序时打开同一时段本机 Grafana 取证看板，“组件与提权统计”“崩溃与短命进程统计”“提权、崩溃与外联明细”几组默认折叠，展开才计算。

## 需要准备什么

- 故障时间与现象

- 需要关注的程序或资源

## 从开始到拿到结果

1. **先看是否有记录**　摘要说明那段覆盖是否完整、是否值得继续追查。

2. **在本机核对具体程序**　把进程启停、资源变化、前台和硬件时间线对齐；PID 和名字都不单独当身份。

3. **交回线索**　列出可复查的候选原因与缺失证据；它不替你杀进程，也不把无签名或端口当恶意证明。

::screen{#timeaudit-process-forensics-05 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 进程采集和未知路径有历史源码回归；本批仅核对采集器身份，未读取用户进程、标题或连接明细 关键规则与设计选择 1 高占用与恶意分开判断。 2 timeaudit-diag"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 进程采集和未知路径有历史源码回归；本批仅核对采集器身份，未读取用户进程、标题或连接明细 关键规则与设计选择 1 高占用与恶意分开判断。 2 timeaudit-diag"
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
     "text_ref": "1. 高占用与恶意分开判断。",
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
     "text_ref": "1. 高占用与恶意分开判断。",
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

进程采集和未知路径有历史源码回归；未读取用户进程、标题或连接明细

## 关键规则与设计选择

1. 高占用与恶意分开判断。

2. timeaudit-diagnostics 只给有界聚合和方向，不从省略字段猜进程名。

3. 要回答谁闪退、写盘或联网，必须把同一时间范围带进 Grafana 资源看板 / 取证看板查看具体进程。

4. 未知路径不伪造为系统目录。

5. PID 与时间/身份一起使用。

6. 公开页可在活动事实有决策价值时直接展示；只对实际包含个人敏感正文或凭据的具体值做隐藏。

## 当前怎样实现

- activity_worker 用同一系统快照采资源并解析父进程。

- IsHungAppWindow 标记用户会话窗口假死。

::screen{#timeaudit-process-forensics-06 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-06",
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
     "text_ref": "- lifecycle_worker 在出生时抓句柄，退出时读退出码。",
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
     "text_ref": "- lifecycle_worker 在出生时抓句柄，退出时读退出码。",
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

- lifecycle_worker 在出生时抓句柄，退出时读退出码。

- process_key 连接身份与事实表。

- Grafana 取证看板和资源看板（“卡死、泄漏与应用趋势”）10 月 11 日起默认先显示轻量信息，统计和明细按需展开。源码里另有生命周期扫描、句柄回收和活动索引条件的未提交改动，只是候选，不算已发布的修复。

## 执行流程

1. 先用有界摘要核对目标时间窗覆盖、磁盘/网络/资源方向；摘要不包含进程名。

2. 需要点名时，把同一窗口带入 Grafana 资源看板或取证看板，展开对应分组。

3. 取得进程快照与稳定身份，计算资源速率并标记卡死。

4. 比较基线生成 START / EXIT，并保留退出码、父子关系、路径、签名和提权线索。

5. 把具体进程与硬件、前台和生命周期时间线对齐，再输出候选解释与未知。

::screen{#timeaudit-process-forensics-07 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-07",
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
| process key（进程档案键） | 稳定关联身份，不能只用会复用的 PID。 |
| signature（数字签名） | 发布者完整性线索；无签名不等于恶意。 |
| LOLBins（系统工具滥用线索） | 系统工具与可疑参数组合，需要上下文。 |

## 专业定义

保存进程资源、签名、提权、父进程、START / EXIT、退出码和卡死状态，回答谁占资源、谁闪退、哪些信号需人工核查。

::screen{#timeaudit-process-forensics-08 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-08",
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
     "text_ref": "- 提供取证线索，不是杀毒或阻断系统。",
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
     "text_ref": "- 提供取证线索，不是杀毒或阻断系统。",
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

解决证据消失、PID 复用、Windows 卡死误判、未知路径伪装和单一安全信号过度解释。

## 边界

- 提供取证线索，不是杀毒或阻断系统。

- timeaudit-diagnostics 的 aggregate-only（仅聚合）合同不返回进程名；字段省略不能被模型补猜。

- 网络速率近似分摊，远端信息可能不完整。

- 字段类型不构成 blanket ban（整类禁令）；实际进程、路径、命令行、IP 和标题可在有用且具体值不含个人敏感正文或凭据时公开。

## 失败与恢复

- **用户只给自然问题但需要具体进程名**：先用摘要确认覆盖和方向，再引导到同一时间窗的本机 Grafana；当前 Skill 不从聚合输出猜名字。

- **进程已退出或受保护**：保留 unknown（未验证） 与可得生命周期，不猜路径。

- **单进程处理抛错**：在 finally 推进基线，避免事件重复。

- **安全规则命中**：进入待核查表，不自动修改机器。

::screen{#timeaudit-process-forensics-09 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-09",
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
     "text_ref": "- 进程资源与卡死（activity_worker.py）",
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
     "text_ref": "- 进程资源与卡死（activity_worker.py）",
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

- 进程资源与卡死（activity_worker.py）

- 生灭、退出码、签名与提权（lifecycle_worker.py）

- 前台关联（context_worker.py）

- 未知路径回归（test_lifecycle_unknown_path.py）

- 采集状态并发回归（test_activity_collection_state_lock.py）

- 资源/取证大盘说明（Grafana 资源/取证 JSON 与使用手册.md）

## 如何验证

- unknown（未验证）path 回归属于 8 月 31 日 001cee0 已通过的基线，9 月 8 日那批 39 项并未重新覆盖该模块；当前源码里 test_lifecycle_unknown_path.py 有 3 个测试函数、test_lifecycle_pid_reuse.py 有 1 个，这次没有运行。

::screen{#timeaudit-process-forensics-10 section="tech"}

```typeset
{
 "screen": {
  "id": "timeaudit-process-forensics-10",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 硬件与流畅度",
    "href": "/projects/timeaudit/hardware-performance/"
   },
   {
    "text": "下一个模块 时间与能耗",
    "href": "/projects/timeaudit/usage-energy/"
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
     "text_ref": "- 未读取用户活动进程、路径、标题或连接明细；生命周期记录约 2820 万行、约 3.9 GiB（数据库统计估算，不是精确数）。",
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
     "text_ref": "- 未读取用户活动进程、路径、标题或连接明细；生命周期记录约 2820 万行、约 3.9 GiB（数据库统计估算，不是精确数）。",
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

- 未读取用户活动进程、路径、标题或连接明细；生命周期记录按数据库统计估算约 2820 万行、约 4.0 GiB（10 月 12 日 05:38 读，估算不是精确数）。另一份 10 月 12 日 05:40 逐条数出的精确数是 3,323 万次；估算和精确数口径不同，两者的差不是记录增长。

- 进程采集、生命周期和未知路径逻辑属于 8 月 31 日完整回归；之后未重新执行，该产品现场仍保持 mixed。

## 与其他模块的关系

把进程事实转成资源与取证视角，并与硬件卡顿时间对齐。
