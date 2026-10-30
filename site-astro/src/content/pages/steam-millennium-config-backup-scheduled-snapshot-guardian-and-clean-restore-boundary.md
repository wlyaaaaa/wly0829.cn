---
{
 "title": "每周采集、可见管理与可回滚恢复",
 "kind": "project",
 "url": "/projects/steam-millennium-config-backup/scheduled-snapshot-guardian-and-clean-restore-boundary/",
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
  "page": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary",
  "kind": "project",
  "title": "每周采集、可见管理与可回滚恢复",
  "url": "/projects/steam-millennium-config-backup/scheduled-snapshot-guardian-and-clean-restore-boundary/",
  "parent": "steam-millennium-config-backup",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-30",
   "source": "源仓库 10 月 20 日的最新提交（10 月 30 日回读远端无新提交，本机另有 7 个未提交的清单文件），加上北京时间 10 月 30 日 11:06 的 E/G/H 三处清单与文件指纹核对和 11:11 的零写入状态核对",
   "last": {
    "label": "快照核对",
    "at": "2026-10-30 11:11"
   }
  }
 },
 "source": {
  "page": "sources/pages/steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary/page.json",
  "sha256": "ebaccee8996221a8a19a13d0744c93672cbf8ca182a975c39f64bcff05e1cc17",
  "converted_at_beijing": "2026-10-30T13:04:19+08:00"
 }
}
---

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-01 section="top"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-01",
  "section": "top",
  "title": "每周采集、可见管理与可回滚恢复",
  "links": [
   {
    "text": "回到项目 → Steam 外观备份",
    "href": "/projects/steam-millennium-config-backup/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/steam-millennium-config-backup"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/steam-millennium-config-backup/#ai-brief"
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
     "text_ref": "每周采集、可见管理与可回滚恢复",
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
       "text": "偶尔用 · 快照核对 10 月 30 日 11:11",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 30 日 · 源仓库 10 月 20 日的最新提交（10 月 30 日回读远端无新提交，本机另有 7 个未提交的清单文件），加上北京时间 10 月 30 日 11:06 的 E/G/H 三处清单与文件指纹核对和 11:11 的零写入状态核对",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → Steam 外观备份〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "平时让原任务每周留存配置，需要时请 AI 查状态或看驾驶舱，就能知道最近成功、独立副本和下一次检查。出问题先看恢复计划，确认后仅回填支持的设置；冲突不覆盖，中断可以按原记录处理。",
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
     "text_ref": "每周采集、可见管理与可回滚恢复",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 快照核对 10 月 30 日 11:11",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 30 日 · 源仓库 10 月 20 日的最新提交（10 月 30 日回读远端无新提交，本机另有 7 个未提交的清单文件），加上北京时间 10 月 30 日 11:06 的 E/G/H 三处清单与文件指纹核对和 11:11 的零写入状态核对"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → Steam 外观备份〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "平时让原任务每周留存配置，需要时请 AI 查状态或看驾驶舱，就能知道最近成功、独立副本和下一次检查。出问题先看恢复计划，确认后仅回填支持的设置；冲突不覆盖，中断可以按原记录处理。"
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
   "asset": "_library/module-illustrations/steam-millennium-config-backup/scheduled-snapshot-guardian-and-clean-restore-boundary-v01.png",
   "key": "绿叶装饰",
   "source_phrase": "截图空位后面的水彩绿叶装饰",
   "sha256": "5f1e1d3261b0c673c23f0d1450fcf473a20483c37c7b5abb046869d2f65a63a2",
   "status": "ready"
  }
 ]
}
```

# 每周采集、可见管理与可回滚恢复

〔回到项目 → Steam 外观备份〕　〔GitHub〕　〔复制 AI 续作说明〕

Steam Millennium 配置备份 · 功能说明

平时让原任务每周留存配置，需要时请 AI 查状态或看驾驶舱，就能知道最近成功、独立副本和下一次检查。出问题先看恢复计划，确认后仅回填支持的设置；冲突不覆盖，中断可以按原记录处理。

当前情况：最近一次成功是北京时间 10 月 26 日 10:35，存出新的一代（20 个文件、无告警），同时复制到 G 盘核对通过；10 月 30 日核对 E、G、H 三处是同一代，零写入状态检查为“正常”。下一次触发时间这次没有回读计划任务，不按日历推算。已有恢复计划、回滚和中断处理。文件完成不代表 Steam 界面已经恢复。

项目快照核对于 2026-10-30 11:11（北京时间，只读核对）；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-02 section="usage"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 手工记着备份容易遗漏；采集也不能把正在修改的文件冲掉，更不能误把“有快照”当作已重装好全部程序。 ### 举个实际例子 “恢复上一份Steam配置前，先告诉我会改什么；不合适还能撤回。”先取得只"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 手工记着备份容易遗漏；采集也不能把正在修改的文件冲掉，更不能误把“有快照”当作已重装好全部程序。 ### 举个实际例子 “恢复上一份Steam配置前，先告诉我会改什么；不合适还能撤回。”先取得只"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 ### 为什么需要它 手工记着备份容易遗漏；采集也不能把正在修改的文件冲掉，更不能误把“有快照”当作已重装好全部程序。 ### 举个实际例子 “恢复上一份Steam配置前，先告诉我会改什么；不合适还能撤回。”先取得只"
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

### 为什么需要它

手工记着备份容易遗漏；采集也不能把正在修改的文件冲掉，更不能误把“有快照”当作已重装好全部程序。

### 举个实际例子

“恢复上一份Steam配置前，先告诉我会改什么；不合适还能撤回。”先取得只读计划，核对程序版本与资源，确认并退出Steam后再回填；完成后得到回滚编号，打开Steam检查实际效果。

### 最后我会得到什么

状态查询分别给出本地快照、最近尝试与成功、独立副本和任务状态，也会列出这次有没有个别文件被杀毒软件拦下。恢复只回填支持的配置，程序、主题资源和最终 Steam 界面仍要另验。

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-03 section="usage"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-03",
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
     "text_ref": "可以怎么用",
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
     "text_ref": "可以怎么用",
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

### 可以怎么用

快照文件与清单一致；恢复按已确认的计划完成并保留撤回依据，随后在 Steam 看实际效果。

### 需要处理什么

采集未完成、来源目录不全或有人改过目标时停止覆盖，保留文件和记录供恢复；只有个别文件读取时被杀毒软件拦下或移走，才按严格条件沿用上一份或跳过，并在结果里点名。

### 什么时候不可用

找不到当前安装、用户未登录或缺程序资源时，这次采集或界面恢复不能完成；旧快照仍保留。

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-04 section="usage"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-04",
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
     "text_ref": "日常让 AI 运行 tools/Invoke-MillenniumBackup.ps1 -Mode Status -Json 查状态，或直接看驾驶舱；要马上存一份用 -Mode Snapshot，自查周任务用 tools/Manage-MillenniumTask.ps1 -Mode Inspect -Json。恢复先用 -Mode RestorePlan 选版本。开始菜单里的“备份状态”入口已在 9 月 26 日撤下，原来的状态窗口脚本仍可以直接运行。",
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
     "text_ref": "1. **先看快照真的留到了哪里**　周任务或手动采集分别报告本地结果与独立副本；提交到版本库和冷备是另外的证据。",
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
     "text_ref": "日常让 AI 运行 tools/Invoke-MillenniumBackup.ps1 -Mode Status -Json 查状态，或直接看驾驶舱；要马上存一份用 -Mode Snapshot，自查周任务用 tools/Manage-MillenniumTask.ps1 -Mode Inspect -Json。恢复先用 -Mode RestorePlan 选版本。开始菜单里的“备份状态”入口已在 9 月 26 日撤下，原来的状态窗口脚本仍可以直接运行。"
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
     "text_ref": "1. **先看快照真的留到了哪里**　周任务或手动采集分别报告本地结果与独立副本；提交到版本库和冷备是另外的证据。",
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

日常让 AI 运行 tools/Invoke-MillenniumBackup.ps1 -Mode Status -Json 查状态，或直接看驾驶舱；要马上存一份用 -Mode Snapshot，自查周任务用 tools/Manage-MillenniumTask.ps1 -Mode Inspect -Json。恢复先用 -Mode RestorePlan 选版本。开始菜单里的“备份状态”入口已在 9 月 26 日撤下，原来的状态窗口脚本仍可以直接运行。

### 需要准备什么

- 这次要查状态、立即采集还是恢复

- 恢复时想选哪天的版本

- 是否已退出 Steam

### 从开始到拿到结果

1. **先看快照真的留到了哪里**　周任务或手动采集分别报告本地结果与独立副本；提交到版本库和冷备是另外的证据。

2. **恢复前看清范围**　选确实存在的日期和版本，预览要改的设置，并确认所需插件或主题已安装。

3. **合并后在 Steam 里看**　保留撤回依据，只回填支持的配置，再打开 Steam 核对外观和插件；工具不替人安装程序。

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-05 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 5 日任务成功、三处副本同代核验通过；恢复命令已实现，真实 Steam 效果另验 ### 关键规则与设计选择 1. 复用 Windows 任务计划"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 5 日任务成功、三处副本同代核验通过；恢复命令已实现，真实 Steam 效果另验 ### 关键规则与设计选择 1. 复用 Windows 任务计划"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 5 日任务成功、三处副本同代核验通过；恢复命令已实现，真实 Steam 效果另验 ### 关键规则与设计选择 1. 复用 Windows 任务计划"
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
     "text_ref": "1. 复用 Windows 任务计划与小 VBS，不增加常驻备份服务。",
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
     "text_ref": "1. 复用 Windows 任务计划与小 VBS，不增加常驻备份服务。",
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

10 月 5 日任务成功、三处副本同代核验通过；恢复命令已实现，真实 Steam 效果另验

### 关键规则与设计选择

1. 复用 Windows 任务计划与小 VBS，不增加常驻备份服务。

2. 没有七天节流和脏目标绕过；无变化仍验证，默认保留4份已验证代际。

3. 恢复是单独的RestorePlan/Restore/Rollback流程，不能反向运行采集脚本；中断用原事务Recover。

4. 恢复按现有分步规程进行，用户可选择具体快照，并核对新装程序是否与旧配置对应。

## 当前怎样实现

- PowerShell7.2+调用Python3.11+核心，显式来源或注册表/常见目录定位；只有机器名与实际仓库均匹配才消费PCConfig机器绑定，拒绝在该绑定下替换采集源。

- 目标与上一份已生成清单比较；手动、定时及其他进程受同一固定目标锁保护。未知文件、真实快照修改或Git读取失败停止覆盖，源或目标/运行根重叠、链接路径拒绝。

- 来源根目录和三个必需目录要可读，启用的插件和当前主题要存在，前后两遍读取一致才生成候选；普通读不全仍整次失败。唯一例外是读文件时遇到杀毒软件拦截或移除（Windows 错误 225/226）：必需文件（config.json、各插件 plugin.json、各主题 skin.json）只有上一份已核验快照里有同一路径时才沿用旧内容，否则整次失败；其他可选文件有旧版就留旧版，没有就这次不收，都写进告警名单。之后照旧先保存前像和计划，再逐文件写入，清单最后提交与回读。

- 现役任务固定在每周一北京时间 10:30（UTC 02:30），本机换时区或重装也不改这个时刻；Interactive/Limited、错过补跑、3次15分钟重试、10分钟上限和IgnoreNew 不变；隐藏VBS调用PowerShell7，启停只管理该任务未来触发。

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-06 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-06",
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
     "text_ref": "- RestorePlan只读验证备份和目标；Restore要求ExpectedPlan，合并支持配置并保留网络/未知字段，资源或版本不匹配停止。真实安装目标需Steam已退出，不自动结束进程、下载或运行插件。",
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
     "text_ref": "- RestorePlan只读验证备份和目标；Restore要求ExpectedPlan，合并支持配置并保留网络/未知字段，资源或版本不匹配停止。真实安装目标需Steam已退出，不自动结束进程、下载或运行插件。",
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

- RestorePlan只读验证备份和目标；Restore要求ExpectedPlan，合并支持配置并保留网络/未知字段，资源或版本不匹配停止。真实安装目标需Steam已退出，不自动结束进程、下载或运行插件。

- 恢复结果带rollback_id，Rollback只撤回仍匹配本轮postimage的修改。恢复历史默认保留4条已完成、回滚或中止记录，未完成记录不自动清掉。

- G副本先核验PCConfig卷身份和路径，再复制当前及保留历史并验证；复制后缺文件不会被猜成杀毒软件删除，必须有这次、同一路径、确实隔离或移除的记录才算。当前内容没能完整复制时，只保留可恢复的现场并标“需要重试”。G失败仍保留本地但自动任务非零。H沿用PCConfig冷备，本项目不新增H任务、不主动解锁。

## 执行流程

1. 原周任务或明确人工Snapshot进入实际来源与机器绑定。

2. 检查源稳定性、目标清单、固定锁和是否有未完成事务；个别文件被杀毒软件拦下时按上面的严格条件处理并记下。

3. 生成并验证候选，逐文件写入、最后发布清单；无变化不增加代际。

4. 独立验证G副本并分别报告最近尝试与最近成功；Git发布与H冷备另行执行。

5. 恢复先只读计划，核对版本和资源；明确执行后保留回滚点，最后在Steam内验证。

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-07 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-07",
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
| Verified generation（已验证代际） | 一组文件及对应完整性清单，验证后才成为当前；无变化不创建重复代。 |
| Interactive Logon（交互登录） | 现役任务依赖该用户已经登录；不是保证无人登录时运行的服务。 |
| staging（暂存区） | 先保存待发布文件和原值，再逐文件提交、最后发布清单；可恢复中断但不是全文件系统原子切换。 |

## 专业定义

无变化不重复留代，恢复先预检、保留原值；任务与G/H各自报告

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-08 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-08",
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
     "text_ref": "- **源与目标重叠或不同的手工改动仍未处理**：保留源与目标，处理精确冲突；当前入口不提供脏目标绕过。",
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
     "text_ref": "- **源与目标重叠或不同的手工改动仍未处理**：保留源与目标，处理精确冲突；当前入口不提供脏目标绕过。",
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

任务存在不代表采集成功，本地采集不等于 GitHub 已更新，文件复制也不等于恢复完成。

## 边界

- 不自动Git提交或推送，采集、G副本、H和实际应用分层判断；结果写“完成”时要连同“是否复制了当前数据”和“核验范围”一起看，有告警时“完成”不等于读到并复制了全部最新文件。

- 有持久前像的多文件事务不等于任意断电和硬件损坏均已验证；不抹去外部修改或未知旧记录。

- 受控恢复只回填支持的配置，不安装插件、不启停Steam、不覆盖主题程序和私有数据。

## 失败与恢复

- **源与目标重叠或不同的手工改动仍未处理**：保留源与目标，处理精确冲突；当前入口不提供脏目标绕过。

- **本次内容没有变化**：验证现有清单和文件后保持，不新建重复代；仍分开检查G副本与任务状态。

- **写入中断或恢复版本不匹配**：同一事务检查后Recover，恢复版本/资源不匹配则停止回填；已提交恢复若清理失败保持真实提交结果，不回滚掉已成功内容。

::screen{#steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-09 section="tech"}

```typeset
{
 "screen": {
  "id": "steam-millennium-config-backup-scheduled-snapshot-guardian-and-clean-restore-boundary-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 主题选项与配色",
    "href": "/projects/steam-millennium-config-backup/theme-options-palette-and-dual-baseline-tracking/"
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
     "text_ref": "- 9 月 8 日原有 19 项断言全部通过；重试参数的两项检查属于源码断言，不是实际失败重试演练。9 月 18 日已发布的洁净源码实跑 55 项 Python 测试和 11 项 Windows 检查全部通过；现在源码里共有 63 个测试定义，本轮没有重跑。",
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
     "text_ref": "- 9 月 8 日原有 19 项断言全部通过；重试参数的两项检查属于源码断言，不是实际失败重试演练。9 月 18 日已发布的洁净源码实跑 55 项 Python 测试和 11 项 Windows 检查全部通过；现在源码里共有 63 个测试定义，本轮没有重跑。",
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

tools/Invoke-MillenniumBackup.ps1 / tools/millennium_backup.py
真实采集、状态、恢复与失败处理；杀毒拦截告警的判定在 tools/backup_file_warnings.py。原 tools/snapshot-millennium-config.ps1 保留为兼容转交。

tools/Manage-MillenniumTask.ps1
安装、自查周任务及任务参数；原 register 脚本保留为兼容转交。

tools/snapshot-millennium-config-hidden.vbs
隐藏调用与退出码传递。

runtime/snapshot-state.json / README.md / tests/
现行清单、绑定成功状态、操作指南与隔离回归；9月8日19项仅是历史。

## 如何验证

- 9 月 8 日原有 19 项断言全部通过；重试参数的两项检查属于源码断言，不是实际失败重试演练。9 月 18 日已发布的洁净源码实跑 55 项 Python 测试和 11 项 Windows 检查全部通过；现在源码里共有 63 个测试定义，本轮没有重跑。

- 2026-10-30 11:11 零写入 Status：status=healthy。当前代号 20261026T023554Z-30c33dbf7922（北京时间 10 月 26 日 10:35 创建）共 20 个文件、核对通过，运行回执 complete、current_data_copied=true、无文件告警；G 回读同代通过，保留 4 代，G 副本 10 月 26 日 10:35:57 完成。11:06 另按同一份清单逐个核对 E、G、H 三处每个文件的字节数和 SHA-256，三处同代、20 个文件全部对上。这次没有回读计划任务的下一次触发时间，也没有触发真实采集、打开 Steam 或装回任何文件。

- 历史：2026-10-20 早上（7:34—7:43 之间）的零写入 Status 当时为 healthy，但范围只到本地快照、任务和 G 热备；当时当前代是 10 月 19 日 10:30 那一代，H 冷备 cold_replica=stale_or_invalid，还停在 20260928T023001Z 那一代，所以当时不能说三处同代。10 月 11 日 13:32 那次 E/G/H 三处回读的是 9 月 28 日同一代。

- 9月8日20文件隔离采集与回填字节一致，19 JSON解析成功，3个虚构已安装资源/私有设置保留；本次未做真实Steam恢复。

## 与其他模块的关系

负责前三类配置的定期留存和恢复操作；Steam、Millennium 及插件主题各自负责实际运行。
