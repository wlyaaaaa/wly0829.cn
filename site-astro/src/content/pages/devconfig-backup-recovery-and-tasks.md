---
{
 "title": "选择性换机恢复、微信回滚点与事务化任务重建",
 "kind": "project",
 "url": "/projects/devconfig-backup/recovery-and-tasks/",
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
  "page": "devconfig-backup-recovery-and-tasks",
  "kind": "project",
  "title": "选择性换机恢复、微信回滚点与事务化任务重建",
  "url": "/projects/devconfig-backup/recovery-and-tasks/",
  "parent": "devconfig-backup",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "DevConfig Backup 公开仓库 52d3356（北京时间 10 月 11 日 08:26 提交）的恢复脚本与 docs/recovery.md，北京时间 10 月 11 日 13:33 回读的计划任务，以及 9 月 18 日的真实恢复验收",
   "last": {
    "label": "快照核对",
    "at": "2026-10-11 13:33"
   }
  }
 },
 "source": {
  "page": "sources/pages/devconfig-backup-recovery-and-tasks/page.json",
  "sha256": "a9ef5c508b6a2a24d62ed55390bb446dffdb2509ef65c8debd4a920c41ddf722",
  "converted_at_beijing": "2026-10-11T19:07:10+08:00"
 }
}
---

::screen{#devconfig-backup-recovery-and-tasks-01 section="top"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-01",
  "section": "top",
  "title": "选择性换机恢复、微信回滚点与事务化任务重建",
  "links": [
   {
    "text": "回到项目 → 开发配置备份",
    "href": "/projects/devconfig-backup/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/devconfig-backup"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/devconfig-backup/#ai-brief"
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
     "text_ref": "选择性换机恢复、微信回滚点与事务化任务重建",
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
       "text": "常用 · 快照核对 10 月 11 日 13:33",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · DevConfig Backup 公开仓库 52d3356（北京时间 10 月 11 日 08:26 提交）的恢复脚本与 docs/recovery.md，北京时间 10 月 11 日 13:33 回读的计划任务，以及 9 月 18 日的真实恢复验收",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 开发配置备份〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "真正出事时，包旁边的回执与清单就能帮助检查，不必再找丢失电脑里的 state。先预览恢复计划，再解到空目录或明确替换并留回滚点，随后按 PCConfig 重建机器路径和任务；状态窗口能看过程，但关闭窗口不算取消实际备份。",
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
     "text_ref": "选择性换机恢复、微信回滚点与事务化任务重建",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 快照核对 10 月 11 日 13:33",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · DevConfig Backup 公开仓库 52d3356（北京时间 10 月 11 日 08:26 提交）的恢复脚本与 docs/recovery.md，北京时间 10 月 11 日 13:33 回读的计划任务，以及 9 月 18 日的真实恢复验收"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 开发配置备份〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "真正出事时，包旁边的回执与清单就能帮助检查，不必再找丢失电脑里的 state。先预览恢复计划，再解到空目录或明确替换并留回滚点，随后按 PCConfig 重建机器路径和任务；状态窗口能看过程，但关闭窗口不算取消实际备份。"
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
   "asset": "_library/module-illustrations/devconfig-backup/recovery-and-tasks-v01.png",
   "key": "main-devconfig-backup",
   "source_phrase": "右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。",
   "sha256": "f5f72c35e65c02acfaf757f61735643837637dee4da4f7c3794932afa65ddd82",
   "status": "ready"
  }
 ]
}
```

# 选择性换机恢复、微信回滚点与事务化任务重建

〔回到项目 → 开发配置备份〕　〔GitHub〕　〔复制 AI 续作说明〕

DevConfig Backup · 功能说明

真正出事时，包旁边的回执与清单就能帮助检查，不必再找丢失电脑里的 state。先预览恢复计划，再解到空目录或明确替换并留回滚点，随后按 PCConfig 重建机器路径和任务；状态窗口能看过程，但关闭窗口不算取消实际备份。

当前情况：配置包在独立目录还原并逐文件核对已有 9 月 18 日验收；恢复的是清单实际收录的文件，包里登记了警告的文件不会自动从旧包补回。完整新机、软件登录、带警告的微信副本恢复和微信实际使用仍未验收。

项目快照核对于 2026-10-11 13:33（北京时间）；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#devconfig-backup-recovery-and-tasks-02 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 新装机最容易乱的是恢复顺序，以及旧配置仍指向原机器的位置。新用户名、Documents 目录或盘符不同本身不是故障，直接照搬旧绝对路径才会让软件读错位置；微信覆盖非空目标还可能冲"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 新装机最容易乱的是恢复顺序，以及旧配置仍指向原机器的位置。新用户名、Documents 目录或盘符不同本身不是故障，直接照搬旧绝对路径才会让软件读错位置；微信覆盖非空目标还可能冲"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 新装机最容易乱的是恢复顺序，以及旧配置仍指向原机器的位置。新用户名、Documents 目录或盘符不同本身不是故障，直接照搬旧绝对路径才会让软件读错位置；微信覆盖非空目标还可能冲"
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

### 为什么需要它

新装机最容易乱的是恢复顺序，以及旧配置仍指向原机器的位置。新用户名、Documents 目录或盘符不同本身不是故障，直接照搬旧绝对路径才会让软件读错位置；微信覆盖非空目标还可能冲掉新数据。

### 举个实际例子

比如我换到一台干净电脑：AI 先按清单补软件，并和 PCConfig 核对新机实际用户、Documents 与应用目录，再把兼容配置映射过去并检查是否加载。只有我选择沿用原布局才恢复 E 盘指向；微信仍先预检、保留目标，实际登录后验收，旧任务逐项重建。

### 最后我会得到什么

得到一份先检查、再选择、最后逐应用试用的换机恢复计划。包能解开只证明清单里的文件在：比如 10 月 10 日这一代有 1 个文件只记了警告，它不在承诺范围里，要的话得自己去旧包找。也不代表新机登录、微信历史和自动任务都已恢复。

::screen{#devconfig-backup-recovery-and-tasks-03 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-03",
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

### 正常时

选中配置包先按同代回执和清单核对，再恢复到独立目录；应用与自动任务实际可用另行确认。

### 发现问题时

旧路径指向不存在的用户或目录时按新电脑实际位置调整；微信目标有文件先保留可回退副本；包里有警告文件时先看清范围，再决定是否另选旧一代。

### 入口不可用或证据不足时

清单缺失、文件损坏、来源与目标重叠或微信仍在运行时停止写入，不暗中换包、拼包或覆盖。

::screen{#devconfig-backup-recovery-and-tasks-04 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-04",
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
     "text_ref": "在已接入的 AI 对话中说“先预检这份 DevConfig 包恢复到新电脑”；微信恢复须另外指明原件和目标。",
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
     "text_ref": "1. **确认这份包能用在新电脑**　先只读核对包与随附回执、清单，看清有没有只记警告的文件，再将旧机路径映射到新机真实用户和软件目录。",
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
     "text_ref": "在已接入的 AI 对话中说“先预检这份 DevConfig 包恢复到新电脑”；微信恢复须另外指明原件和目标。"
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
     "text_ref": "1. **确认这份包能用在新电脑**　先只读核对包与随附回执、清单，看清有没有只记警告的文件，再将旧机路径映射到新机真实用户和软件目录。",
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

在已接入的 AI 对话中说“先预检这份 DevConfig 包恢复到新电脑”；微信恢复须另外指明原件和目标。

### 需要准备什么

- 完整日期包及附属清单

- 新机用户名和应用目录

- 目标已有文件及想恢复的范围

### 从开始到拿到结果

1. **确认这份包能用在新电脑**　先只读核对包与随附回执、清单，看清有没有只记警告的文件，再将旧机路径映射到新机真实用户和软件目录。

2. **保留当前目标后选择回填**　明确执行和覆盖范围时解到独立目录，再逐项映射配置；微信目标非空须有回滚副本并确认客户端关闭。

3. **逐应用重建**　按当前 PCConfig 手册重建任务并检查软件加载和微信登录；包完整不证明任务或应用已经可用。

::screen{#devconfig-backup-recovery-and-tasks-05 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 配置包隔离解包全树哈希已由 9 月 18 日来源验收；默认预检与任务恢复边界已实现，恢复器不自动补警告文件；完整新机和微信应用仍未验收 ### 关键规则与设"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 配置包隔离解包全树哈希已由 9 月 18 日来源验收；默认预检与任务恢复边界已实现，恢复器不自动补警告文件；完整新机和微信应用仍未验收 ### 关键规则与设"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 配置包隔离解包全树哈希已由 9 月 18 日来源验收；默认预检与任务恢复边界已实现，恢复器不自动补警告文件；完整新机和微信应用仍未验收 ### 关键规则与设"
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
     "text_ref": "1. 恢复说明的正式版本在 docs/recovery.md，分四部分：配置恢复、微信原应用恢复、单文件警告与旧副本、任务/网络/H 盘。README 自 9 月 26 日起只留入口和指向，不再写七个阶段；机器层面的恢复指南归 PCConfig。",
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
     "text_ref": "1. 恢复说明的正式版本在 docs/recovery.md，分四部分：配置恢复、微信原应用恢复、单文件警告与旧副本、任务/网络/H 盘。README 自 9 月 26 日起只留入口和指向，不再写七个阶段；机器层面的恢复指南归 PCConfig。",
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

配置包隔离解包全树哈希已由 9 月 18 日来源验收；默认预检与任务恢复边界已实现，恢复器不自动补警告文件；完整新机和微信应用仍未验收

### 关键规则与设计选择

1. 恢复说明的正式版本在 docs/recovery.md，分四部分：配置恢复、微信原应用恢复、单文件警告与旧副本、任务/网络/H 盘。README 自 9 月 26 日起只留入口和指向，不再写七个阶段；机器层面的恢复指南归 PCConfig。

2. 原机微信数据位于 E:\Documents\xwechat_files，这是备份事实；原机整个“文档”目录当前指向哪里本轮没有另行核对。新机先读取实际 Documents 位置并映射配置，只有明确保留旧布局时才重定向到 E，不能把旧盘符当作恢复前提。

3. 新机可以采用和原机不同的用户名。AI 按实际用户根有界更新已知旧路径并回读，保留原文件和未解决映射，不要求本人逐条手改。

4. Restore-WeChat.ps1 默认只读预检，显式执行时目标非空必须强制生成 .pre-restore-* 回滚目录。

5. 复制完成后状态记为 copy_complete_awaiting_human_acceptance（复制完成、等人确认），由用户登录官方客户端确认历史，绝不用脚本退出码冒充恢复。脚本不读账号、不打开数据库；它查不到微信进程，只说明这些进程没在运行，不证明没有别的文件占用。

6. 四个常规任务的 Action 固定为 wscript.exe；隐藏 VBS 优先 PowerShell 7，找不到才用 Windows PowerShell 5.1。独立临时监控安装器才固定 5.1。

## 当前怎样实现

- Restore-DevConfig 默认 Plan，读取 package-receipt.v2、payload-manifest.v1，自己计算包的 SHA-256，并核对内部路径和 manifest（清单）；它不单独读随包的 .sha256 文件，那份留给人用外部工具核对。Execute 先解到独立 incoming 并对所选文件全树核对，才保留旧目标并切换；结果不自动列出警告文件，也不从旧包合并。Restore-WeChat 另有客户端与原生目录约束，DriveOnly 仍需真实联网恢复验收。

- 路径检查拒绝盘符根目录、source/target 相同或互为父子目录，以及任一路径或父级上的 reparse point（重解析点）。

::screen{#devconfig-backup-recovery-and-tasks-06 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-06",
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
     "text_ref": "- Setup-ScheduledTasks.ps1 与 ScheduledTask-Registration.Common.ps1 支持只收敛选定的已登记任务（-TaskName），保留既有时序和设置；四个正式任务都启用、失败最多重试 3 次（配置本地间隔 10 分钟、配置云端 15 分钟、微信 G 盘 15 分钟、微信云端 30 分钟）；微信 Hot 使用当前交互用户 Highest，其余 Limited。临时小时监控仍由独立安装器管理，本轮未重装任何任务。",
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
     "text_ref": "- Setup-ScheduledTasks.ps1 与 ScheduledTask-Registration.Common.ps1 支持只收敛选定的已登记任务（-TaskName），保留既有时序和设置；四个正式任务都启用、失败最多重试 3 次（配置本地间隔 10 分钟、配置云端 15 分钟、微信 G 盘 15 分钟、微信云端 30 分钟）；微信 Hot 使用当前交互用户 Highest，其余 Limited。临时小时监控仍由独立安装器管理，本轮未重装任何任务。",
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

- Setup-ScheduledTasks.ps1 与 ScheduledTask-Registration.Common.ps1 支持只收敛选定的已登记任务（-TaskName），保留既有时序和设置；四个正式任务都启用、失败最多重试 3 次（配置本地间隔 10 分钟、配置云端 15 分钟、微信 G 盘 15 分钟、微信云端 30 分钟）；微信 Hot 使用当前交互用户 Highest，其余 Limited。临时小时监控仍由独立安装器管理，本轮未重装任何任务。

- 注册器先拒绝别人的同名任务，保存精确 XML、动作与启停前像；任何更新或回读失败按原定义恢复，用户原来暂停的任务不能被重新启用。

- Hidden VBS 启动脚本（Backup-DevConfig-Hidden.vbs 等）隐藏黑框并完整保留并透传退出码。

- 恢复测试分别验证包哈希/清单、危险路径、替换前像、逐文件内容与应用验收状态；源码回归、9 月 18 日隔离恢复和网页本轮只读状态三个证据层互不替代。

## 执行流程

1. 先准备 Git 与 DevConfig 源码，再按 Git 总索引和目标机器找到 PCConfig 的实际位置（原机是 E:\PCConfig），取得获准的恢复指南；暂时缺这份资料只暂停依赖它的机器配置、任务与 H 冷备步骤。

2. 选择带对应 .sha256、.receipt.json、.manifest.json 的成功日期包；运行 Restore-DevConfig 默认只读核验（它读回执和清单、自算包哈希），不再依赖原电脑 state/latest.sha256，散失附属文件的旧包不能冒充完整恢复集。回执里有警告文件时，先决定是否另选旧一代。

3. 明确 Execute 后解到独立目录并逐文件核对；需要替换非空目标时先指定 ReplaceExisting，原目标保留。再按软件清单补齐可下载组件，不自动导入所有旧系统配置。

4. 按新系统和应用版本，把 home/、appdata-roaming/、appdata-local/ 与 extra/Scoop-persist/ 映射到目标机器实际目录；AI 核对 Documents、用户名和盘符差异，处理已知引用后再看应用是否正常加载。

::screen{#devconfig-backup-recovery-and-tasks-07 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-07",
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
     "text_ref": "5. 环境变量、Xshell、Wi-Fi、hosts 和任务按实际 PCConfig 根内 docs/recovery/START_RECOVERY.md 与 scheduled_tasks_rebuild.md 逐项处理；先运行现有任务重建计划检查，不通配导入旧 XML，也不照搬原机盘符。",
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
     "text_ref": "5. 环境变量、Xshell、Wi-Fi、hosts 和任务按实际 PCConfig 根内 docs/recovery/START_RECOVERY.md 与 scheduled_tasks_rebuild.md 逐项处理；先运行现有任务重建计划检查，不通配导入旧 XML，也不照搬原机盘符。",
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

5. 环境变量、Xshell、Wi-Fi、hosts 和任务按实际 PCConfig 根内 docs/recovery/START_RECOVERY.md 与 scheduled_tasks_rebuild.md 逐项处理；先运行现有任务重建计划检查，不通配导入旧 XML，也不照搬原机盘符。

6. 先用默认 G 源或明确的 -BackupRoot 本地/USB 目录做只读预检；确认路径与客户端状态后才 Execute，最后登录官方客户端验收。源目录里如果保留着带警告的旧文件，整树哈希可能与清单对不上而被拒绝（读代码可见，没有实际跑过）。-DriveOnly 仍是未完成真实联网验收的兼容路径。

7. Local 打包时会把已有的 state/rclone-remote-binding.json 复制进包内 _manifests（只含非秘密别名，不含 OAuth/token）。新机重新执行 rclone config 后，再把这份别名选择回填到 state，运行 Setup-ScheduledTasks.ps1 并逐项查看四任务状态。

::screen{#devconfig-backup-recovery-and-tasks-08 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-08",
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
| Idempotent Task Registration（幂等任务注册） | 无论运行多少次，只更新或确保计划任务处于正确配置，不产生重复实例或脏状态。 |
| Human Acceptance Gate（人工在场验收门） | 对于专有通讯软件，文件拷贝完成不等于数据可用，必须由真人登录官方应用最终确认。 |
| Pre-restore Rollback（恢复前回滚隔离） | 在写入前把已有目标移到 .pre-restore-*；若复制失败，部分结果再移到 .failed-restore-*，随后尽力把原目录恢复。 |

## 专业定义

配置包先核验再隔离解包，微信先预检再明确回填；已有目标和任务定义都留恢复前像，应用登录另验。

::screen{#devconfig-backup-recovery-and-tasks-09 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-09",
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
     "text_ref": "- **恢复目标目录已存在非空 xwechat_files 且未传 -ReplaceExisting**：脚本立即拒绝写入并 fail-closed（失败关闭），防止意外覆盖现有聊天记录。",
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
     "text_ref": "- **恢复目标目录已存在非空 xwechat_files 且未传 -ReplaceExisting**：脚本立即拒绝写入并 fail-closed（失败关闭），防止意外覆盖现有聊天记录。",
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

防止重装新系统后盲目覆盖导致已有数据丢失，防止因 Documents 路径或用户名不一致导致软件配置失效。

## 边界

- 新电脑恢复先核对实际用户、Documents 与应用目录；原机 E 盘和原用户名作为旧路径线索，恢复任务负责映射与回读，不能把保持旧布局设为默认要求。

- 严禁通配批量导入历史任务计划 XML，必须按 PCConfig 重建手册逐项核对。

- Restore-WeChat.ps1 在未经用户显式确认官方微信关闭前严禁写入，目标非空必须保留回滚副本。

- 备份源与目标不能是盘根、同一路径、互为父子目录或经过重解析点；这些条件任何一个不清楚就不执行。

- -DriveOnly 只说明存在兼容实现，本轮没有真实联网下载恢复证据，不能替代已验的本地/G 路线。

- 恢复者必须带走同一代必要文件；恢复器核验回执、清单和包哈希，.sha256 文件供人工对照。7z CRC、文件名或单份旧 state 不代替成功回执与全树清单；警告文件不在承诺内，恢复器也不会自动从旧包补齐。

- 文件复制完成仅标记 copy_complete_awaiting_human_acceptance，严禁冒充微信恢复成功。

## 失败与恢复

- **恢复目标目录已存在非空 xwechat_files 且未传 -ReplaceExisting**：脚本立即拒绝写入并 fail-closed（失败关闭），防止意外覆盖现有聊天记录。

::screen{#devconfig-backup-recovery-and-tasks-10 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-10",
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
     "text_ref": "- **源与目标重叠、互为父子目录、指向盘根或路径链包含重解析点**：预检直接拒绝；不会靠猜测选择 USB、Drive 或另一个目录。",
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
     "text_ref": "- **源与目标重叠、互为父子目录、指向盘根或路径链包含重解析点**：预检直接拒绝；不会靠猜测选择 USB、Drive 或另一个目录。",
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

- **源与目标重叠、互为父子目录、指向盘根或路径链包含重解析点**：预检直接拒绝；不会靠猜测选择 USB、Drive 或另一个目录。

- **已把旧目标移到 .pre-restore-* 后复制失败**：部分结果移到 .failed-restore-*，再恢复原目录；若回滚自身也失败，同时报告原始错误和回滚错误。

- **微信备份目录里保留着带警告的旧文件**：本地恢复会对整个来源目录算哈希并和清单比对，目前没有按警告范围过滤，可能被拒绝；这个场景没有实际跑过，先看覆盖范围、保留的旧一代和来源证据再决定，不把“完成但有警告”当成已验的全量恢复。

- **旧配置引用的用户名或 Documents 路径在目标机器上不可用**：当前恢复任务通过 PCConfig 确认实际路径并处理已知引用，回读应用加载情况；不要求改成旧盘符，未能确定的精确目标才交本人决定。

- **目标同名任务不是本项目的隐藏启动器**：注册器拒绝覆盖；不会为了让测试变绿接管别人的任务。

- **四个任务更新到一半失败或最终回读不一致**：注册器用执行前抓取的精确 XML 恢复原任务；新建任务也只有在仍匹配本次定义时才撤销。

- **PowerShell 7 不在 Program Files 固定路径**：隐藏 VBS 在启动前选择 Windows PowerShell 5.1；这是真实启动分支，不是任务运行失败后的二次重试。

::screen{#devconfig-backup-recovery-and-tasks-11 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-11",
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
     "text_ref": "- **docs/recovery.md**：正式恢复说明：配置恢复、微信原应用恢复、单文件警告与旧副本、任务/网络/H 盘",
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
     "text_ref": "- **docs/recovery.md**：正式恢复说明：配置恢复、微信原应用恢复、单文件警告与旧副本、任务/网络/H 盘",
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

- **docs/recovery.md**：正式恢复说明：配置恢复、微信原应用恢复、单文件警告与旧副本、任务/网络/H 盘

- **Restore-WeChat.ps1**：微信灾难恢复总线，提供只读预检与回滚保护

- **WeChat-Recovery.Common.ps1**：路径规范化、盘根/重叠/重解析点拒绝、客户端进程检查、复制与失败回滚

- **Setup-ScheduledTasks.ps1**：Windows 任务计划程序常规任务幂等注册器

- **ScheduledTask-Registration.Common.ps1**：任务计划 XML 解析与安全注册通用逻辑

- **tests/Assert-WeChatNativeRecovery.ps1**：预检、回滚与人工验收状态断言自动化测试

- **tests/Assert-ScheduledTaskRegistrationSafety.ps1**：任务注册事务性与执行器路径安全测试

- **Restore-DevConfig.ps1**：可携带恢复集只读核验、独立目标解包、所选文件全树比对与原目标保留

::screen{#devconfig-backup-recovery-and-tasks-12 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-recovery-and-tasks-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 微信原生增量",
    "href": "/projects/devconfig-backup/wechat-native-backup/"
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
     "text_ref": "- 9 月 18 日来源验收已执行配置包隔离恢复，8,640 文件、8,531,705,353 字节的全树 SHA-256 一致；当时 15 个检查脚本在 PowerShell 7 和 5.1 下共 30 组全部通过。没有据此声称微信官方客户端已恢复。",
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
     "text_ref": "- 9 月 18 日来源验收已执行配置包隔离恢复，8,640 文件、8,531,705,353 字节的全树 SHA-256 一致；当时 15 个检查脚本在 PowerShell 7 和 5.1 下共 30 组全部通过。没有据此声称微信官方客户端已恢复。",
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

- 9 月 18 日来源验收已执行配置包隔离恢复，8,640 文件、8,531,705,353 字节的全树 SHA-256 一致；当时 15 个检查脚本在 PowerShell 7 和 5.1 下共 30 组全部通过。没有据此声称微信官方客户端已恢复。

- 现在源码里有 24 个 Assert 检查脚本和 1 个 Python 测试文件，覆盖任务所有权、精确前像、失败回滚和恢复合同；本轮运行 0 个测试、0 次恢复，不重新注册或启停任何生产任务，只在 13:33 只读回读了四个任务的设置和时间。

- 本轮没有在干净 Windows 上导入注册表、Wi-Fi 或整套任务，没有恢复过带警告的微信副本，也没有测量恢复耗时。

## 与其他模块的关系

把备份材料变成一套可以逐层检查的恢复顺序；它负责工具脚本，机器路径、任务恢复次序和 H 盘冷备仍由 PCConfig 决定。
