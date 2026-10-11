---
{
 "title": "缓存放在哪里，哪些东西不能进Z",
 "kind": "project",
 "url": "/projects/ramdisk-guardian/volatile-cache-contract-and-backup-retirement/",
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
  "page": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement",
  "kind": "project",
  "title": "缓存放在哪里，哪些东西不能进Z",
  "url": "/projects/ramdisk-guardian/volatile-cache-contract-and-backup-retirement/",
  "parent": "ramdisk-guardian",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "缓存边界按现行源码和电脑配置（PCConfig）截止前的存放策略核对（均早于 10 月 11 日 14:00）；盘占用取截止前最后一轮巡查，提速仍未实测"
  }
 },
 "source": {
  "page": "sources/pages/ramdisk-guardian-volatile-cache-contract-and-backup-retirement/page.json",
  "sha256": "fb6f8cbbc6f667a08f49006bc3c499e301e16be5f257d523005b2c02f5fde96e",
  "converted_at_beijing": "2026-10-11T19:04:26+08:00"
 }
}
---

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-01 section="top"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-01",
  "section": "top",
  "title": "缓存放在哪里，哪些东西不能进Z",
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
     "text_ref": "缓存放在哪里，哪些东西不能进Z",
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
     "static_note": "截至 10 月 11 日 · 缓存边界按现行源码和电脑配置（PCConfig）截止前的存放策略核对（均早于 10 月 11 日 14:00）；盘占用取截止前最后一轮巡查，提速仍未实测",
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
     "text_ref": "避免为了读写速度，把唯一资料的生存时间绑在内存盘上。",
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
     "text_ref": "缓存放在哪里，哪些东西不能进Z",
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
     "static_note": "截至 10 月 11 日 · 缓存边界按现行源码和电脑配置（PCConfig）截止前的存放策略核对（均早于 10 月 11 日 14:00）；盘占用取截止前最后一轮巡查，提速仍未实测"
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
     "text_ref": "避免为了读写速度，把唯一资料的生存时间绑在内存盘上。"
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
   "asset": "_library/illustrations/modules/ramdisk-guardian-volatile-cache-contract-and-backup-retirement-v01.png",
   "key": "main-ramdisk-guardian",
   "source_phrase": "右上一幅水彩插画：一根绿色内存条被画成一块小硬盘的样子，盘面写着“Z”，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存。",
   "sha256": "a5c93832f0028270cb160284146b7e67bbc984beb7a8e4cfb3c758d8b2c3a250",
   "status": "ready"
  }
 ]
}
```

# 缓存放在哪里，哪些东西不能进Z

〔回到项目 → 内存盘守护〕　〔GitHub〕　〔复制 AI 续作说明〕

RamdiskGuardian · 功能说明

避免为了读写速度，把唯一资料的生存时间绑在内存盘上。

**当前情况：**当前只允许有界、可重建缓存使用内存盘；截止前最后一轮巡查（10 月 11 日 13:46）12 GiB 的盘只用了 0.5 GiB，基本是 Chrome 的三类缓存。它没有替唯一文件备份或自动识别误放资料的功能，用它到底快了多少也一直没实测。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 历史镜像备份曾在空源时覆盖目标；继续给RAM Disk补备份并不能消除它承担唯一数据的风险。当前做法直接让正式文件退出Z，只保留丢后可重建的内容。 举个实际例子 “我要跑一个临时测试，能用Z吗"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 历史镜像备份曾在空源时覆盖目标；继续给RAM Disk补备份并不能消除它承担唯一数据的风险。当前做法直接让正式文件退出Z，只保留丢后可重建的内容。 举个实际例子 “我要跑一个临时测试，能用Z吗"
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

历史镜像备份曾在空源时覆盖目标；继续给RAM Disk补备份并不能消除它承担唯一数据的风险。当前做法直接让正式文件退出Z，只保留丢后可重建的内容。

## 举个实际例子

“我要跑一个临时测试，能用Z吗？”如果输入和代码已在E或V，Z里只是可再生成且有上限的中间输出，可以评估；如果它会成为唯一一份未提交代码，就留在持久磁盘。

## 最后我会得到什么

得到一块容量受限、只放可重建缓存的内存盘；每个应用仍负责清自己的旧缓存。它不再承担正式文件的备份来源。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-outcome_cards-01 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-outcome_cards-01",
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

选中的内容能完整重建、体积有界，并有真实使用收益，才适合迁入。

## 发现问题

缓存过多时提醒对应应用清理自己的过期内容，不由守护器盲删。

## 暂不可用

资料丢了不能重建，或内存盘没有实测收益，就继续放在持久磁盘。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-03",
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
     "text_ref": "在为应用配置缓存目录时，先读项目 Z_使用说明，只把可再生缓存指向 Z 盘；正式文件留持久磁盘。",
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
     "text_ref": "1. **核对应用的数据去向**　AI 或维护入口对照应用设置，确认选中的缓存能重建；任何唯一正文仍留在持久磁盘。",
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
     "text_ref": "在为应用配置缓存目录时，先读项目 Z_使用说明，只把可再生缓存指向 Z 盘；正式文件留持久磁盘。"
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
     "text_ref": "1. **核对应用的数据去向**　AI 或维护入口对照应用设置，确认选中的缓存能重建；任何唯一正文仍留在持久磁盘。",
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

在为应用配置缓存目录时，先读项目 Z_使用说明，只把可再生缓存指向 Z 盘；正式文件留持久磁盘。

## 需要准备什么

- 要接入的应用

- 确认可丢且能重建的缓存

- 正式文件要保留在哪里

## 从开始到拿到结果

1. **核对应用的数据去向**　AI 或维护入口对照应用设置，确认选中的缓存能重建；任何唯一正文仍留在持久磁盘。

2. **只迁指定缓存**　按应用自己的设置把可丢内容指到 Z，不把盘镜像当备份。

3. **按应用核对恢复**　重启或清空后检查应用能重建；重建会影响当时正在使用缓存的程序。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-04 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 当前使用约定 关键规则与设计选择 1 E保留既有项目和恢复锚点；新个人项目默认，而不是把现有项目强制全迁到V。 2 不放正式Git仓库、唯一资料、数据库、模型和凭据；不"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 当前使用约定 关键规则与设计选择 1 E保留既有项目和恢复锚点；新个人项目默认，而不是把现有项目强制全迁到V。 2 不放正式Git仓库、唯一资料、数据库、模型和凭据；不"
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
     "text_ref": "1. E保留既有项目和恢复锚点；新个人项目默认放 V:\\Personal\\Projects，而不是把现有项目强制全迁到V；新 worktree 按 V 下的 Personal/Work 分；任何正式 Git 仓库或 worktree 都不放 Z。",
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
     "text_ref": "1. E保留既有项目和恢复锚点；新个人项目默认放 V:\\Personal\\Projects，而不是把现有项目强制全迁到V；新 worktree 按 V 下的 Personal/Work 分；任何正式 Git 仓库或 worktree 都不放 Z。",
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

当前使用约定；截止前最后一轮巡查 Z 已用 0.5 GiB、空闲 11.5 GiB；驱动实际分配和提速仍为空值

## 关键规则与设计选择

1. E保留既有项目和恢复锚点；新个人项目默认放 V:\Personal\Projects，而不是把现有项目强制全迁到V；新 worktree 按 V 下的 Personal/Work 分；任何正式 Git 仓库或 worktree 都不放 Z。

2. 不放正式Git仓库、唯一资料、数据库、模型和凭据；不迁系统全局TEMP/TMP、Docker/WSL（Windows 的 Linux 子系统）或无界包缓存。

3. Personal/Work仅是组织分区，共享内存盘不产生账号或数据隔离。

## 当前怎样实现

- 源目录数组只包含Caches、Scratch、TEMP及既有子目录，不包含退役的projects/docs/others。

- README（现在只留简短入口）与Z_使用说明.md解释准入；静态测试防止旧robocopy和Z_Drive_Backup逻辑重回现役。

- 不实现内容分类器或全盘清空计划，8GiB是告警/恢复条件的一部分，不是自动逐文件配额；自动重建现在要看到和这块盘对得上的内存证据，低内存单独不会清盘，详见驱动恢复模块。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-05",
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
     "text_ref": "- 效率查询入口 Get-RamdiskEfficiency.ps1 -Json 把逻辑容量、已用、镜像逻辑/实际分配与DriverAllocatedBytes分开；可选的 -IncludePrimo 只读 Primo 列表和设置，需要管理员。无法取得可靠驱动计数时为null，SpeedupPercent没有同条件计时则为空（未实测），不从镜像大小推内存或编造性能倍数。",
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
     "text_ref": "- 效率查询入口 Get-RamdiskEfficiency.ps1 -Json 把逻辑容量、已用、镜像逻辑/实际分配与DriverAllocatedBytes分开；可选的 -IncludePrimo 只读 Primo 列表和设置，需要管理员。无法取得可靠驱动计数时为null，SpeedupPercent没有同条件计时则为空（未实测），不从镜像大小推内存或编造性能倍数。",
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

- 效率查询入口 Get-RamdiskEfficiency.ps1 -Json 把逻辑容量、已用、镜像逻辑/实际分配与DriverAllocatedBytes分开；可选的 -IncludePrimo 只读 Primo 列表和设置，需要管理员。无法取得可靠驱动计数时为null，SpeedupPercent没有同条件计时则为空（未实测），不从镜像大小推内存或编造性能倍数。

## 执行流程

1. 确定正式输入与可再生成输出分别在哪里。

2. 检查体积上限、失效恢复方式和实际I/O收益。

3. 只让选中的输出使用Z；生产者结束时清理自己的失效内容。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-06",
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
| cache-only（仅缓存） | 丢失可以接受，而且应用能重新生成。不是把文件改名叫缓存就满足条件。 |
| 缓存生产者 | 实际创建缓存的应用或工具；由它判断哪些代已过期，任务成功、失败或接管时完成清理。 |

## 专业定义

先判断值得加速的对象，再给缓存设置体积和生命周期边界。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-07 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-07",
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
     "text_ref": "- Primo可能保存镜像，但任何Z内容都不能因此成为唯一可靠副本。",
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
     "text_ref": "- Primo可能保存镜像，但任何Z内容都不能因此成为唯一可靠副本。",
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

这些规则不会自动阻止文件写入。误放进去的唯一资料仍可能在驱动重建时丢失，所以不能把使用约定写成自动数据保护能力。

## 边界

- Primo可能保存镜像，但任何Z内容都不能因此成为唯一可靠副本。

- 缓存重建可能影响正在使用缓存的应用，不能承诺无感。

## 失败与恢复

- **发现Z里放了唯一文件**：在任何重置前转存并验证持久副本；守护器没有文件版本恢复能力。

- **长期超过8GiB软上限**：检查各生产者自己的有效缓存和清理规则，不按目录外观盲目整盘删除。

::screen{#ramdisk-guardian-volatile-cache-contract-and-backup-retirement-08 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-volatile-cache-contract-and-backup-retirement-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 目录与说明恢复",
    "href": "/projects/ramdisk-guardian/drive-arrival-sensing-and-skeleton-healing/"
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
     "text_ref": "- 只读核对当前代码：没有 robocopy、Z_Drive_Backup 或旧 projects/docs/others 通道；静态检查仍定义 15 条断言，本轮没有运行（旧页“本轮静态检查通过”是 9 月 18 日那次）。",
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
     "text_ref": "- 只读核对当前代码：没有 robocopy、Z_Drive_Backup 或旧 projects/docs/others 通道；静态检查仍定义 15 条断言，本轮没有运行（旧页“本轮静态检查通过”是 9 月 18 日那次）。",
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

盘根使用约定（Z_使用说明.md）。

角色与历史退役背景：当前 README 只保留短入口，缓存原件误删的历史在 git 提交 5f8cf40，旧备份通道 7 月 21 日退役的证据在 ecd7111。

机器级E/V/Z放置策略。

## 如何验证

- 只读核对当前代码：没有 robocopy、Z_Drive_Backup 或旧 projects/docs/others 通道；静态检查仍定义 15 条断言，本轮没有运行（旧页“本轮静态检查通过”是 9 月 18 日那次）。

- 效率查询把容量、卷已用、镜像长度、SSD 实际分配和驱动分配分开，互相不能顶替；驱动实际分配仍为 null，提速没做同条件测试，镜像小也不证明内存已等量释放或业务变快。Primo 部分要管理员才能读。

- 未全盘审查缓存内容，因此不宣称所有使用者都始终遵守准入。

## 与其他模块的关系

这条边界使后续缓存盘恢复可接受，但它本身不是自动拦截或备份系统。
