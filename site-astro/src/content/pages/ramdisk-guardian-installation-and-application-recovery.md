---
{
 "title": "安装、应用接入和重启恢复分别确认",
 "kind": "project",
 "url": "/projects/ramdisk-guardian/installation-and-application-recovery/",
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
  "page": "ramdisk-guardian-installation-and-application-recovery",
  "kind": "project",
  "title": "安装、应用接入和重启恢复分别确认",
  "url": "/projects/ramdisk-guardian/installation-and-application-recovery/",
  "parent": "ramdisk-guardian",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "部署流程按现行源码重写（最后提交 10 月 6 日，早于 10 月 11 日 14:00 截止）：默认只预检、显式范围、初始化不重建、PowerShell 7、失败回滚；任务定义、Chrome 连接、快速启动设置和镜像文件按现存静态配置核对；Primo 运行设置需管理员，之后未重新核对"
  }
 },
 "source": {
  "page": "sources/pages/ramdisk-guardian-installation-and-application-recovery/page.json",
  "sha256": "d6f60b34de1eb1daa6906b11f4a1b66a09656dfdcdc7452c3efaa07353ed966d",
  "converted_at_beijing": "2026-10-12T00:29:47+08:00"
 }
}
---

::screen{#ramdisk-guardian-installation-and-application-recovery-01 section="top"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-01",
  "section": "top",
  "title": "安装、应用接入和重启恢复分别确认",
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
     "text_ref": "安装、应用接入和重启恢复分别确认",
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
     "static_note": "截至 10 月 11 日 · 部署流程按现行源码重写（最后提交 10 月 6 日，早于 10 月 11 日 14:00 截止）：默认只预检、显式范围、初始化不重建、PowerShell 7、失败回滚；任务定义、Chrome 连接、快速启动设置和镜像文件按现存静态配置核对；Primo 运行设置需管理员，之后未重新核对",
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
     "text_ref": "重装系统或任务丢失后，知道需要恢复哪些组件，也知道哪些结果还没有证明。",
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
     "text_ref": "安装、应用接入和重启恢复分别确认",
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
     "static_note": "截至 10 月 11 日 · 部署流程按现行源码重写（最后提交 10 月 6 日，早于 10 月 11 日 14:00 截止）：默认只预检、显式范围、初始化不重建、PowerShell 7、失败回滚；任务定义、Chrome 连接、快速启动设置和镜像文件按现存静态配置核对；Primo 运行设置需管理员，之后未重新核对"
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
     "text_ref": "重装系统或任务丢失后，知道需要恢复哪些组件，也知道哪些结果还没有证明。"
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
   "asset": "_library/illustrations/modules/ramdisk-guardian-installation-and-application-recovery-v01.png",
   "key": "main-ramdisk-guardian",
   "source_phrase": "右上一幅水彩插画：一根绿色内存条被画成一块小硬盘的样子，盘面写着“Z”，盘里飘着几片半透明的浏览器小图标（像落叶一样轻）；旁边一位小小的园丁拿着水壶和一把小扫帚照看它，园丁脚边一个小闹钟指着一刻钟；内存条下方一条细细的绿色光带流回主板，表示腾回来的内存。",
   "sha256": "b56b8893906fb68001b30e964b768c901b361d1118a447044ed8c6cb45bb46e8",
   "status": "ready"
  }
 ]
}
```

# 安装、应用接入和重启恢复分别确认

〔回到项目 → 内存盘守护〕　〔GitHub〕　〔复制 AI 续作说明〕

RamdiskGuardian · 功能说明

重装系统或任务丢失后，知道需要恢复哪些组件，也知道哪些结果还没有证明。

**当前情况：**部署现在默认只出一份只读计划，加 -Apply 才动手，关快速启动和接 Chrome 缓存要各自点名；任务用 PowerShell 7 隐藏运行。现存配置：任务启用、每 15 分钟一轮，Chrome 三类缓存都接在 Z 上，快速启动关着。驱动开机加载、应用缓存的实际收益和下次自然重启仍分别待确认。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#ramdisk-guardian-installation-and-application-recovery-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 脚本能运行不代表驱动已建盘；空文件夹存在也不代表Chrome已经接入。把驱动、定时任务、目录连接和自然重启分别检查，才能恢复完整使用路径。 举个实际例子 “重装后恢复 Z 盘缓存用途。”先按既"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 脚本能运行不代表驱动已建盘；空文件夹存在也不代表Chrome已经接入。把驱动、定时任务、目录连接和自然重启分别检查，才能恢复完整使用路径。 举个实际例子 “重装后恢复 Z 盘缓存用途。”先按既"
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

脚本能运行不代表驱动已建盘；空文件夹存在也不代表Chrome已经接入。把驱动、定时任务、目录连接和自然重启分别检查，才能恢复完整使用路径；部署本身也要先看清会改什么，再决定改不改。

## 举个实际例子

“重装后恢复 Z 盘缓存用途。”先按既有指南在 Primo 建盘，再让 AI 跑一遍部署预检，看它打算改哪些东西；确认后再执行，需要时另外点名“顺便关快速启动”“把 Chrome 缓存接过去”。Chrome 还开着就先不改它的缓存连接，完成后等一次自然重启验证盘是否自动回来。

## 最后我会得到什么

交回盘、任务、目录和应用缓存连接各自是否就绪，以及这次部署具体改了什么；中途失败会按原样退回。自然重启后的自动加载仍需实际观察。

::screen{#ramdisk-guardian-installation-and-application-recovery-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-03",
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

内存盘出现、任务按计划运行、选定应用真的把可丢缓存放进去，才算日常路径就绪。

## 发现问题

应用仍开着就暂缓改它的缓存位置；盘未出现先完成建盘，再重跑对应部署步骤；部署中途失败按逆序退回原来的任务、盘符覆盖、电源设置和 Chrome 目录。

## 暂不可用

Primo 未安装、盘没挂上或没有管理员 PowerShell 7 时不能完成部署；正式资料始终不能把内存盘当唯一来源。

::screen{#ramdisk-guardian-installation-and-application-recovery-04 section="usage"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-04",
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
     "text_ref": "先按 DEPLOY.md 配好 Primo 盘和镜像，再运行 deploy.ps1 -Json 看只读计划；确认后用管理员 PowerShell 7 加 -Apply 执行。应用缓存连接和自然重启验收分别做。",
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
     "text_ref": "1. **先有正确 RAM 盘**　在 Primo 配置目标盘，不由守护器猜盘或创建唯一数据。",
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
     "text_ref": "先按 DEPLOY.md 配好 Primo 盘和镜像，再运行 deploy.ps1 -Json 看只读计划；确认后用管理员 PowerShell 7 加 -Apply 执行。应用缓存连接和自然重启验收分别做。"
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
     "text_ref": "1. **先有正确 RAM 盘**　在 Primo 配置目标盘，不由守护器猜盘或创建唯一数据。",
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

先按 DEPLOY.md 配好 Primo 盘和镜像，再运行 deploy.ps1 -Json 看只读计划；确认后用管理员 PowerShell 7 加 -Apply 执行。应用缓存连接和自然重启验收分别做。

## 需要准备什么

- 要在这台电脑部署守护

- 准备把哪个应用的可丢缓存接到内存盘

- 是否需要下次自然重启后验收

## 从开始到拿到结果

1. **先有正确 RAM 盘**　在 Primo 配置目标盘，不由守护器猜盘或创建唯一数据。

2. **先看计划，再部署**　默认只读预检；-Apply 才建立基础目录和计划任务，初始化时禁止重建真实盘；关快速启动、接 Chrome 缓存各自显式选。

3. **分层验收**　读任务、STATUS、目录与应用状态；下次自然重启再看镜像加载，部署通过不等于冷启动通过。

::screen{#ramdisk-guardian-installation-and-application-recovery-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 安装状态已回读 关键规则与设计选择 1 当前配置为12GiB，不沿用旧截图或提示中的32GiB；Primo镜像当前为Compact Image（紧凑镜像）和Shutdo"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 安装状态已回读 关键规则与设计选择 1 当前配置为12GiB，不沿用旧截图或提示中的32GiB；Primo镜像当前为Compact Image（紧凑镜像）和Shutdo"
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
     "text_ref": "1. 当前配置为12GiB，不沿用旧截图或提示中的32GiB。9 月 18 日记录的 Primo 设置是配置为 DMM Compact、运行为 DMM、紧凑镜像、关机保存；10 月 11 日普通权限读不到运行设置，之后未重新核对。",
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
     "text_ref": "1. 当前配置为12GiB，不沿用旧截图或提示中的32GiB。9 月 18 日记录的 Primo 设置是配置为 DMM Compact、运行为 DMM、紧凑镜像、关机保存；10 月 11 日普通权限读不到运行设置，之后未重新核对。",
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

现存静态配置：任务启用、交互用户、Highest，登录触发加独立 15.0 分钟周期，经 run_hidden.vbs 调 PowerShell 7；Chrome Default 三类缓存为指向 Z 的连接；快速启动关闭；镜像文件 0.68 GiB、最后写入 10 月 1 日。Primo 运行设置因需管理员未读到

## 关键规则与设计选择

1. 当前配置为12GiB，不沿用旧截图或提示中的32GiB。9 月 18 日记录的 Primo 设置是配置为 DMM Compact、运行为 DMM、紧凑镜像、关机保存；10 月 11 日普通权限读不到运行设置，之后未重新核对。

2. deploy.ps1 默认只出只读计划；-Apply 才写；-TaskOnly -Apply 只装任务；-DisableFastStartup、-WireChromeCaches 各自显式选择，且不能和 -TaskOnly 混用。

3. 默认-RamDrive Z、-IntervalMinutes 15；非默认盘符写ramdrive.txt，回Z时清除旧覆盖；-TaskOnly 不允许借机改已配置的盘符。

4. 只有选了 -WireChromeCaches 且 Chrome 关闭时，才处理 Default 配置的 Cache、Code Cache、GPUCache：旧目录先改名保留，建连接后精确回读；不强关浏览器、不删旧内容，不宣称自动覆盖所有浏览器Profile。

5. 撤销RAMDisk_Code_Backup只删除计划任务，不删Primo盘、镜像或缓存；任务名里的“Backup”是旧名字，它早就不做备份了。

## 当前怎样实现

- deploy.ps1 默认预检普通权限可跑；完整 -Apply 需要已挂载的 RAMDISK 和管理员 PowerShell 7，初次安装必须选真实交互用户，拒绝 SYSTEM 或服务账号。只有选 -DisableFastStartup 时才写 HiberbootEnabled=0。

- 注册 Interactive/Highest 任务：登录触发加独立的周期触发（部署后不必等下次登录就开始巡检），当前 PT15M、IgnoreNew、10 分钟执行时限；原本被禁用的任务保持禁用。

- 任务调用 wscript.exe 与仓库 run_hidden.vbs，并把 PowerShell 7 路径（默认 C:\Program Files\PowerShell\7\pwsh.exe）传给 VBS；VBS 从自身目录定位 zguardian.ps1，隐藏窗口运行，等待实际退出码并 WScript.Quit 传回。

::screen{#ramdisk-guardian-installation-and-application-recovery-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-06",
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
     "text_ref": "- 完整 -Apply 的初始化调用 zguardian.ps1 -NoRecovery -WaitSeconds 0：只验证骨架和健康，禁止重建真实盘；-TaskOnly 不跑初始化。360解压临时目录由用户在其设置中指定。",
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
     "text_ref": "- 完整 -Apply 的初始化调用 zguardian.ps1 -NoRecovery -WaitSeconds 0：只验证骨架和健康，禁止重建真实盘；-TaskOnly 不跑初始化。360解压临时目录由用户在其设置中指定。",
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

- 完整 -Apply 的初始化调用 zguardian.ps1 -NoRecovery -WaitSeconds 0：只验证骨架和健康，禁止重建真实盘；-TaskOnly 不跑初始化。360解压临时目录由用户在其设置中指定。

- 回滚先保存原任务 XML、盘符覆盖、电源设置前值和 Chrome 改名记录，失败时按逆序恢复；初始化失败会重新拿到同一把互斥锁再走生产回滚，拿不到锁就明确留下材料并报未完成。明确停用守护器时，回退命令为 Unregister-ScheduledTask -TaskName RAMDisk_Code_Backup -Confirm:$false。

- 镜像压缩不是一个可直接调用的命令，而是文档里的人工维护步骤：rxprd save <实际编号> -a <候选> -F COMPACT -s，核对身份、大小、哈希和回执后原子替换，保留 1 份可用回退；不为压缩重建实际驱动。自然重启能否采用新镜像仍需另验。

- 电脑配置（PCConfig）的 Show-StreamingMaintenance 小窗显示状态、下次检查、使用者和冷却，关闭窗口不停止任务。9 月 26 日撤掉的是它的开始菜单快捷方式，程序本身还在，需要时可用 pwsh -NoProfile -File E:\PCConfig\tools\Show-StreamingMaintenance.ps1 -Launch 直接打开；换机时不自动重建快捷方式。

## 执行流程

1. 按DEPLOY.md先设置Primo驱动盘和镜像。

::screen{#ramdisk-guardian-installation-and-application-recovery-technical-03 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-technical-03",
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
     "text_ref": "2. 运行 deploy.ps1 -Json 看只读计划，选定范围（完整、仅任务、是否关快速启动、是否接 Chrome）。",
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
     "text_ref": "2. 运行 deploy.ps1 -Json 看只读计划，选定范围（完整、仅任务、是否关快速启动、是否接 Chrome）。",
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

2. 运行 deploy.ps1 -Json 看只读计划，选定范围（完整、仅任务、是否关快速启动、是否接 Chrome）。

3. 管理员 PowerShell 7 加 -Apply 部署任务和基础目录，初始化不重建真实盘；失败按逆序回滚。

4. 读任务结果、健康日志、目录和连接；下一次自然启动再确认加载。

5. 若停用，仅按需要撤销任务，盘与应用连接另行处理。

::screen{#ramdisk-guardian-installation-and-application-recovery-07 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-07",
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
| 非临时盘与镜像 | Primo保存磁盘配置，并按所选模式加载/保存镜像。缓存可能跨启动保留，但项目仍要求内容可丢。 |
| 部署预检 | 不加 -Apply 运行部署脚本，只列出它会改哪些东西，不写任何设置；普通权限就能跑。 |
| 隐藏启动器 | VBS以隐藏窗口方式启动 PowerShell 7，等待结束后将退出码交回计划任务，不常驻另一个守护服务；找不到 PowerShell 7 时返回 127。 |

## 专业定义

先只读预检，再按显式范围恢复12GiB Primo配置下的任务、基础目录和选定的缓存链接，失败按逆序回滚，最后验证下一次自然启动。

解决什么

部署一旦执行会注册任务，选了的话还会改快速启动、替换Chrome的缓存目录；所以默认只预检，改什么要点名。普通权限、目标卷不符或Primo未建盘时，不能把部分完成报告成整套恢复。

::screen{#ramdisk-guardian-installation-and-application-recovery-08 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-08",
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
     "text_ref": "- 本轮没有运行 deploy.ps1、关闭 Chrome、改快速启动或重启系统；只读回看了任务、连接、注册表和镜像文件。",
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
     "text_ref": "- 本轮没有运行 deploy.ps1、关闭 Chrome、改快速启动或重启系统；只读回看了任务、连接、注册表和镜像文件。",
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

部署会修改快速启动、注册任务并可能替换Chrome的缓存目录；它不是只读查询。普通权限、目标卷不符或Primo未建盘时，不能把部分完成报告成整套恢复。

## 边界

- 本轮没有运行 deploy.ps1、关闭 Chrome、改快速启动或重启系统；只读回看了任务、连接、注册表和镜像文件。

- Primo配置检查、自然周期执行和冷启动验收是不同证据；Primo 6.6.0 安装文件、12GiB 卷和现有镜像文件，都不能代替对运行设置的核对。

## 失败与恢复

- **任务存在但Z尚未创建**　部署会说明部分完成；先恢复Primo配置，再执行所需后续步骤。

- **部署中途失败**　按逆序退回原任务、盘符覆盖、电源设置和 Chrome 目录改名；锁拿不到时留下回滚材料并明确报未完成。

- **Chrome正使用缓存目录**　跳过连接调整；不要为了网页展示关闭用户浏览器。

- **任务返回0但健康ERROR**　以STATUS具体故障为准排查，不能只验任务返回值。

::screen{#ramdisk-guardian-installation-and-application-recovery-09 section="tech"}

```typeset
{
 "screen": {
  "id": "ramdisk-guardian-installation-and-application-recovery-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 驱动内存恢复",
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
     "text_ref": "- 9月8日已回读Primo为0号Z、12288MB、非临时、镜像启用、快速启动关闭及三个Chrome连接；9月14日仅重证卷、目录、说明、镜像大小与自然任务状态。",
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
     "text_ref": "- 9月8日已回读Primo为0号Z、12288MB、非临时、镜像启用、快速启动关闭及三个Chrome连接；9月14日仅重证卷、目录、说明、镜像大小与自然任务状态。",
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

当前12GiB部署、预检范围、检查与回退说明（DEPLOY.md，PDF 版 9 月 26 日已删除，以 Markdown 为准）。

实际安装、回滚与调用链（deploy.ps1、run_hidden.vbs）。

历史界面参考，容量以当前文档和实机为准。

## 如何验证

- 9月8日已回读Primo为0号Z、12288MB、非临时、镜像启用、快速启动关闭及三个Chrome连接；9月14日仅重证卷、目录、说明、镜像大小与自然任务状态。

- 现存静态配置核对：任务启用、每 15 分钟一轮、调用 PowerShell 7；Chrome 三类缓存连接分别指向 Z:\Caches 下的三个目录；快速启动关闭（这只说明现在是关的，不证明 6 月 15 日以来从没变过）；镜像文件 732,168,704 字节、最后写入 10 月 1 日 03:53；Primo 已装版本 6.6.0。Primo 当前编号、运行模式和镜像格式需要管理员才能读，之后未重新核对。

- README/DEPLOY 曾生成 3 页/2 页 PDF 并核对过，这些 PDF 已于 9 月 26 日删除，现在只保留 Markdown 和网站入口。

- 完整自然重启恢复和部署实跑本轮都没有做，保留该边界。

## 与其他模块的关系

这是其余四个模块的实际运行入口，也界定驱动、脚本和应用分别负责的恢复步骤。
