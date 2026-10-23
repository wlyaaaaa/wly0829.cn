---
{
 "title": "微信先形成验真副本，再让热备、云端跟随实际原件集合",
 "kind": "project",
 "url": "/projects/devconfig-backup/wechat-native-backup/",
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
  "page": "devconfig-backup-wechat-native-backup",
  "kind": "project",
  "title": "微信先形成验真副本，再让热备、云端跟随实际原件集合",
  "url": "/projects/devconfig-backup/wechat-native-backup/",
  "parent": "devconfig-backup",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "DevConfig Backup 公开仓库 7b111d9 的微信备份源码（10 月 22 日 06:47 核对时 10 月 20 日发布后没有新提交，这次没有再查），加上北京时间 10 月 23 日 10:28 只读回读的零写入状态入口和 G 盘热备回执，PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取；未联网；只记数量和状态，不读聊天内容",
   "last": {
    "label": "快照核对",
    "at": "2026-10-23 10:28"
   }
  }
 },
 "source": {
  "page": "sources/pages/devconfig-backup-wechat-native-backup/page.json",
  "sha256": "d3d2b9edd5d9e1230465fa188c74d98cb65fc0741fb6eddca1ebde16028c9d1e",
  "converted_at_beijing": "2026-10-23T10:34:59+08:00"
 }
}
---

::screen{#devconfig-backup-wechat-native-backup-01 section="top"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-01",
  "section": "top",
  "title": "微信先形成验真副本，再让热备、云端跟随实际原件集合",
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
     "text_ref": "微信先形成验真副本，再让热备、云端跟随实际原件集合",
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
       "text": "常用 · 快照核对 10 月 23 日 10:28",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 12 日 · DevConfig Backup 公开仓库 7b111d9 的微信备份源码（10 月 22 日 06:47 核对时 10 月 20 日发布后没有新提交，这次没有再查），加上北京时间 10 月 23 日 10:28 只读回读的零写入状态入口和 G 盘热备回执，PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取；未联网；只记数量和状态，不读聊天内容",
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
     "text_ref": "不必每次把几十 GB 重新压成一个大包；没变化的文件会跳过，单次云传输也有上限。代价是文件级副本仍需官方客户端做最终可用性验收。",
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
     "text_ref": "微信先形成验真副本，再让热备、云端跟随实际原件集合",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 快照核对 10 月 23 日 10:28",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 12 日 · DevConfig Backup 公开仓库 7b111d9 的微信备份源码（10 月 22 日 06:47 核对时 10 月 20 日发布后没有新提交，这次没有再查），加上北京时间 10 月 23 日 10:28 只读回读的零写入状态入口和 G 盘热备回执，PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取；未联网；只记数量和状态，不读聊天内容"
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
     "text_ref": "不必每次把几十 GB 重新压成一个大包；没变化的文件会跳过，单次云传输也有上限。代价是文件级副本仍需官方客户端做最终可用性验收。"
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
   "asset": "_library/module-illustrations/devconfig-backup/wechat-native-backup-v01.png",
   "key": "main-devconfig-backup",
   "source_phrase": "右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。",
   "sha256": "d0d0df6a9a5a463b3cbbbb0deecf80a1820eec1323a16474b1620b056058bc60",
   "status": "ready"
  }
 ]
}
```

# 微信先形成验真副本，再让热备、云端跟随实际原件集合

〔回到项目 → 开发配置备份〕　〔GitHub〕　〔复制 AI 续作说明〕

DevConfig Backup · 功能说明

不必每次把几十 GB 重新压成一个大包；没变化的文件会跳过，单次云传输也有上限。代价是文件级副本仍需官方客户端做最终可用性验收。

当前情况：10 月 23 日 10:16 的 G 盘热备已完成：154,912 个文件，每个文件都核对过，删除也跟着原件走了，没有文件警告。前几天 19 日 09:30 那次卡在“进行中”、当天上云和 H 冷备都跟着停下，这个状态已经过去；最近已知的 10 月 21 日下午那一轮 H 冷备里微信这项已完成，那一轮早于现在这一份。云端这次没联网查，最近一次本机记录的上云是 10 月 22 日 12:10，传的是上一代（22 日 10:14 那份）；新一代还没有上云记录。官方客户端恢复未验。

项目快照核对于 2026-10-23 10:28（北京时间），只读回执，没有修复、重跑或联网；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#devconfig-backup-wechat-native-backup-02 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 微信图片视频很大，不必每次整包重压；直接一边读正在变化的微信目录、一边上传又可能混进不同时间的文件。先在 G 盘建立一份可逐文件核对的副本，云端只从这份已核对的副本复制。 ###"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 微信图片视频很大，不必每次整包重压；直接一边读正在变化的微信目录、一边上传又可能混进不同时间的文件。先在 G 盘建立一份可逐文件核对的副本，云端只从这份已核对的副本复制。 ###"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 微信图片视频很大，不必每次整包重压；直接一边读正在变化的微信目录、一边上传又可能混进不同时间的文件。先在 G 盘建立一份可逐文件核对的副本，云端只从这份已核对的副本复制。 ###"
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

微信图片视频很大，不必每次整包重压；直接一边读正在变化的微信目录、一边上传又可能混进不同时间的文件。先在 G 盘建立一份可逐文件核对的副本，云端只从这份已核对的副本复制。

### 举个实际例子

我问“哪些微信文件已经在 G，旧文件会不会自己又回来”：工具回报已验的当前代与前一代，只有源根可访问且完整枚举时才传播精确删除；整个盘不见了则保留旧副本，不按空库清理。某个文件被杀毒软件拦下或扫描后消失时，会单独列出来，并保住它的旧副本。

### 最后我会得到什么

最近一次完成的 G 盘记录（10 月 23 日 10:16）说明已保存微信数据库、图片和音视频约 46.83 GB。要是某次热备没收尾（比如 19 日那次），工具会如实说当前副本“说不准”，不拿前一次的旧成功顶替。按本机记录，云端最近一次成功是 10 月 22 日 12:10，传的是上一代（22 日 10:14 那份），这一份还没有上云记录；最近已知的 10 月 21 日那一轮 H 冷备里微信这项已完成，那一轮早于这一份；云端实际最新内容尚未联网确认。文件齐全不等于微信客户端一定能读回聊天。

::screen{#devconfig-backup-wechat-native-backup-03 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-03",
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

文件完整核对后才设为当前备份，留一份前一版本；云端另从这份已验材料复制。

### 发现问题时

只有登记过的单文件例外，比如被杀毒软件拦下或扫描后消失，才把这几个文件记成警告、保留旧副本，其余文件继续核对，必要时多留一代；普通占用、空间不足、内容对不上等其他读取问题，仍然算这次失败。云端单次流量达到上限时报告未传完，等后续任务或明确补齐。

### 入口不可用或证据不足时

来源磁盘读不全或目标不可达时不按空目录传播删除，也不把这次复制说成完整成功；G 盘副本缺失、过旧或损坏时，云端拒绝上传，不改读正在使用的微信原件。

::screen{#devconfig-backup-wechat-native-backup-04 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-04",
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
     "text_ref": "在已接入的 AI 对话中明确提出微信原生数据备份或查询 Hot 状态；实际动作由项目已安装的微信备份任务执行。",
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
     "text_ref": "1. **先核对微信原件是否读得全**　系统按现有清单检查应用目录和图片视频是否可读；常规任务始终备完整数据，不再只备数据库。",
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
     "text_ref": "在已接入的 AI 对话中明确提出微信原生数据备份或查询 Hot 状态；实际动作由项目已安装的微信备份任务执行。"
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
     "text_ref": "1. **先核对微信原件是否读得全**　系统按现有清单检查应用目录和图片视频是否可读；常规任务始终备完整数据，不再只备数据库。",
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

在已接入的 AI 对话中明确提出微信原生数据备份或查询 Hot 状态；实际动作由项目已安装的微信备份任务执行。

### 需要准备什么

- 当前微信原件目录是否可读

- G 盘最近一次已核对副本的日期

- G 或 Drive 目标状态

### 从开始到拿到结果

1. **先核对微信原件是否读得全**　系统按现有清单检查应用目录和图片视频是否可读；常规任务始终备完整数据，不再只备数据库。

2. **先形成独立可核对副本**　从受约束的同一时间点复制文件，并逐个核对内容；整份成功（或只差登记了警告的个别文件）后才把它设为当前备份。

3. **按源集合同步与报告**　源可完整读取时传播实际删除，整根离线则保留旧副本；云端流量上限或上传未完时不报告完整成功。

::screen{#devconfig-backup-wechat-native-backup-05 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 G 盘回执 148,592 文件、45.97 GB，无警告；微信云端最近成功为 10 月 5 日；H 冷备 9 月 23 日之后未重新核"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 G 盘回执 148,592 文件、45.97 GB，无警告；微信云端最近成功为 10 月 5 日；H 冷备 9 月 23 日之后未重新核"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 G 盘回执 148,592 文件、45.97 GB，无警告；微信云端最近成功为 10 月 5 日；H 冷备 9 月 23 日之后未重新核"
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
     "text_ref": "110月23日G盘这一代约46.83GB，仍采用文件级候选，不为每次增量重新压缩整个媒体库。",
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
     "text_ref": "110月23日G盘这一代约46.83GB，仍采用文件级候选，不为每次增量重新压缩整个媒体库。",
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

当前 G 回执是 10 月 23 日 10:16:05 完成，154,912 文件、46.83 GB，sha256_full_tree、source_follow_verified、无文件警告；10 月 19 日卡住的事务（backup_tree_transaction_pending）已不再出现；云端本轮未联网，本机记录最近成功为 10 月 22 日 12:10，传的是上一代，这一代还没有上云记录；最近已知的 PCConfig 10 月 21 日那一轮 H 冷备微信项 complete，早于这一代；客户端恢复未验（10 月 23 日 10:28 回读）

### 关键规则与设计选择

1. 10 月 23 日 G 盘这一代约 46.83 GB，仍采用文件级候选，不为每次增量重新压缩整个媒体库。

2. G 盘先建立独立候选再校验切换，旧成功代保留；可复用的硬链接只来自已验备份，不能把活动原件硬链接进去。个别文件有警告时保留它的旧文件或登记的旧一代，可恢复的前代可以多于一份。

3. Drive 只消费 G 盘当前已核对的一代：回执不超过 48 小时、目标匹配、整树哈希和 VSS 时点都已确认，上传全程锁住 G 盘副本；缺失、过旧、损坏或不是 VSS 时点就拒绝，不读活动原件补传。复制、核对后在相同过滤范围删除旧对象并严格复验，警告文件的云端旧副本不删。

4. 默认 -MaxTransfer 8G 只限制一次 rclone 进程；WeChatBackup-Drive-Weekly 任务级最多重试 3 次、间隔 30 分钟、最长运行 4 小时，每次重新获得自己的单次额度，所以累计流量和云空间仍要另看。rclone 自己的内部重试和任务级重试不是一回事。

5. WAL、SHM 和 journal 继续随数据库保留。默认隐藏 Hot 带 UseVss，只有快照真实创建并按它取数才写 vss_crash_consistent；手动不带该参数明确写 live_source，二者都不宣称应用一致性。

6. Hot 成功后原子写入并回读有界 JSON 回执；PCConfig 只在回执目标匹配且不超过 36 小时时接受微信热备前置条件。

7. 云端补传监控（WeChatDrive-Monitor-Hourly）已停用，最后一次运行是北京时间 7 月 11 日 01:53；正常运行依赖每天 09:30 的 G 盘任务和每周一 11:00 的云端任务。

## 当前怎样实现

- Backup-WeChat.ps1 常规任务用 -Target Hot（G 盘）和 Drive（云端）；“E 盘再存一份”（-Target Local）和“云端只传数据库”（-DbOnly）已停用，源码里只留兼容实现，-DriveFull 可覆盖 DbOnly 回到完整范围。

::screen{#devconfig-backup-wechat-native-backup-06 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-06",
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
     "text_ref": "- -MaxTransfer 0 会关闭单次 8G 上限，只适合明确的一次性补齐并由人持续看进度；常规定时任务保持默认上限。",
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
     "text_ref": "- -MaxTransfer 0 会关闭单次 8G 上限，只适合明确的一次性补齐并由人持续看进度；常规定时任务保持默认上限。",
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

- -MaxTransfer 0 会关闭单次 8G 上限，只适合明确的一次性补齐并由人持续看进度；常规定时任务保持默认上限。

- wechat.hot-backup-receipt.v2 绑定完整 manifest（清单）、generation（代际）、数量/字节、sha256_full_tree 与 source_follow_verified；有警告时额外列出警告文件的相对路径、原因和错误码，核对范围标为“除警告文件外的所选文件”。状态读取回执而非重新哈希整库；10 月 21 日这一代的回执就是这样读到的。

- WeChat-Recovery.Common.ps1 负责路径规范化、目标/进程检查、复制与回滚；WAL/SHM/journal 的保留来自备份过滤规则，而不是这个恢复模块定位数据库。

- Monitor-WeChatDrive.ps1 是首次补齐时用的续传监控，对应计划任务已停用；源码还在，重装任务时保持停用，只有显式启用才会运行。

- tests/Assert-WeChatIncrementalIntegrity.ps1 验证 checksum 内容变化用例，并静态检查流量上限、WAL/SHM 不被过滤和 Hot 回执字段。

## 执行流程

1. 微信 Hot 隐藏任务每天 09:30 以当前用户 Highest 启动，并传入 -Target Hot -UseVss；先创建受约束的时点副本，再从该副本捕获。

2. 复制到独立候选，逐个文件复制并核对 SHA-256，已验同内容的文件从旧备份做硬链接，两阶段切换后再读回确认；个别文件被杀毒软件拦下或扫描后消失记警告，其余照常完成。

3. 源根仍可用且集合完整时切换当前与前一成功代，发布 v2 Hot 回执；读不完整或切换失败保留旧成功状态。

::screen{#devconfig-backup-wechat-native-backup-07 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-07",
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
     "text_ref": "4每周一11:00启动WeChatBackup-Drive-Weekly（10月19日周一那次因热备事务没收尾而失败；",
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
     "text_ref": "4每周一11:00启动WeChatBackup-Drive-Weekly（10月19日周一那次因热备事务没收尾而失败；",
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

4. 每周一 11:00 启动 WeChatBackup-Drive-Weekly（10 月 19 日周一那次因热备事务没收尾而失败；本机记录 10 月 22 日 11:00—12:10 那次完成，本轮没联网重读云端）。

5. 按远端 binding 锁定 G 盘当前已核对的一代，复制、核对后在同过滤范围清旧并复验；不直接边读活动微信边上传，警告文件的云端旧副本不清。

6. 默认传完整原应用目录；只传 db_storage 的 -DbOnly 已停用，常规任务不用。仅明确人工补齐时可用 -MaxTransfer 0 关闭单次上限。

7. 达到单次流量上限时记录未完成，不发布全量成功；正常完成还需严格集合/内容比对并上传可携带清单，之后的任务重试仍单独累计流量。

::screen{#devconfig-backup-wechat-native-backup-08 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-08",
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
| File-by-File Incremental（逐文件增量） | 针对已压缩的多媒体大目录，按单个文件比对哈希只传变动文件，避免整包重新打包。 |
| Transfer Fuse（流量保险丝） | 限制一次 rclone 进程的传输量；它不限制多次计划任务重试的累计流量，也不保证云盘总空间够用。 |
| WAL Co-preservation（预写式日志伴生保全） | SQLite WAL 模式下可能有已提交事务尚未合并进主库，因此 -wal、-shm 和 journal 不应被备份过滤；一起复制仍不保证运行中快照一致。 |
| Bounded Hot Receipt（有界热备回执） | 用完整集合清单、代号、数量与全树哈希验真状态说明这次保全边界（例如 10 月 21 日那份记 collection complete、sha256_full_tree、source_follow_verified）；从不读取或解释聊天内容，没有警告时也不列文件名，有警告时只列警告文件的相对路径和原因；不证明微信已成功登录。 |

## 专业定义

几十 GB 不反复压成整包；先复制验真，再切换当前/前一代。本人从可信原件中删除的文件可以同步退出，整根离线不会当空库。

::screen{#devconfig-backup-wechat-native-backup-09 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-09",
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
     "text_ref": "- **单次上传达到 -MaxTransfer 8G 上限**：rclone 停止本轮继续传输并把非完成结果交给任务；后续任务可继续，但总云空间与累计流量仍需单独观察。",
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
     "text_ref": "- **单次上传达到 -MaxTransfer 8G 上限**：rclone 停止本轮继续传输并把非完成结果交给任务；后续任务可继续，但总云空间与累计流量仍需单独观察。",
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

避免大体积微信数据阻塞配置包，也避免每次全量重传；同时防止只看任务名称或目录存在就误以为最近热备一定完成。

## 边界

- 原应用数据采用文件级增量；源可用且集合完整时传播实际删除，源根离线、无法读全或身份不符不当作空源。扫描后消失的文件只在本轮保留旧副本，下次源正常且仍不在才按我删除处理；被杀毒软件拦下的文件一直保留旧副本，直到重新可读。

- 默认单次调用设置 8G 传输上限；任务重试的累计流量另算，-MaxTransfer 0 仅供人工看守的一次性补齐。

- -DbOnly 已停用，只保留兼容代码；它只含 db_storage，不能冒充包含图片、视频等媒体的完整原应用备份，也不会删云端已有媒体。

- 伴随保留 SQLite WAL 与 SHM；VSS 只证明文件系统时点，手动 live_source 还可能跨时刻读取。两条路线均需实际微信客户端恢复验收。

## 失败与恢复

- **单次上传达到 -MaxTransfer 8G 上限**：rclone 停止本轮继续传输并把非完成结果交给任务；后续任务可继续，但总云空间与累计流量仍需单独观察。

- **复制时遇到占用、目标空间不足、来源根不可读或内容核对不一致**：本轮 Hot 失败且不发布新的 complete 回执；旧热备不删除，下一次任务再补。只有单个文件被杀毒软件拦下或扫描后消失时才记警告继续。

- **云端目标路径不可达或网络中断**：保留 G 盘副本并让 Drive 任务返回失败；补传监控已停用，正常重试来自已登记的任务策略。

::screen{#devconfig-backup-wechat-native-backup-10 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-10",
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
     "text_ref": "- **Backup-WeChat.ps1**：微信原生应用数据增量备份主流水线",
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
     "text_ref": "- **Backup-WeChat.ps1**：微信原生应用数据增量备份主流水线",
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

- **Backup-WeChat.ps1**：微信原生应用数据增量备份主流水线

- **G:\80_Backup\ControlPlane\wechat-hot-last.json**：微信 Hot 完成回执，供 PCConfig 冷备前置检查；不含聊天内容，有警告时列出警告文件路径

- **WeChat-Recovery.Common.ps1**：微信恢复路径、客户端状态、本地复制与失败回滚通用模块

- **Monitor-WeChatDrive.ps1**：首次云端补齐期间的临时续传监控；对应任务已停用，当前并非常规运行任务

- **tests/Assert-WeChatIncrementalIntegrity.ps1**：checksum 内容变化 fixture、Hot 回执字段和部分静态接线检查

- **tests/Assert-CloudBackupIntegrity.ps1**：远端对象核对与 WAL/SHM/journal 未被过滤的静态合同

## 如何验证

- 当前来源回归覆盖微信候选、保留与同名内容漂移；网页本轮（10 月 22 日）没有重新执行源测试或修改原应用数据。

- 8G 上限、DbOnly/DriveFull 范围、警告文件保旧与 WAL/SHM 保留只有脚本/静态合同证据；本轮没有真的传满 8G，没有触发过警告场景，也没有运行 SQLite 一致性测试。

::screen{#devconfig-backup-wechat-native-backup-11 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-wechat-native-backup-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 配置精选与避坑",
    "href": "/projects/devconfig-backup/source-catalog/"
   },
   {
    "text": "下一个模块 重装恢复与调度",
    "href": "/projects/devconfig-backup/recovery-and-tasks/"
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
     "text_ref": "9月18日历史Hot为145,307文件、45,218,959,121字节，当时PCConfig对G/H全量验真并修复53个同大小/时间的冷备差异；9月22日145,473文件、45,413,770,",
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
     "text_ref": "9月18日历史Hot为145,307文件、45,218,959,121字节，当时PCConfig对G/H全量验真并修复53个同大小/时间的冷备差异；9月22日145,473文件、45,413,770,",
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

- 9 月 18 日历史 Hot 为 145,307 文件、45,218,959,121 字节，当时 PCConfig 对 G/H 全量验真并修复 53 个同大小/时间的冷备差异；9 月 22 日 145,473 文件、45,413,770,744 字节，9 月 24 日 145,544 文件、45,422,871,529 字节，9 月 28 日 146,300 文件、45,603,489,818 字节，都保留原日期。北京时间 10 月 11 日 09:30—11:02 的自然运行在 G 盘生成 148,592 文件、45,972,129,496 字节的一代，生产者报告 VSS 与全树验真、无警告。H 盘（历史）：10 月 12 日 05:40 回读 PCConfig 10 月 11 日 18:39:26 的冷备记录，H 微信完成 148,592 文件、45,972,129,496 字节，sha256_full_tree 全树核对，修复 16 个文件，0 文件警告，清单哈希与 G 当前回执一致；这是冷备生产者当时的验真，本轮只读取、没有重算。热维护和冷备两份回执引用同一个恢复上下文编号；整次冷备结果为 complete_with_warnings，警告来自其他集合，微信集合本身是 complete。

- 10 月 23 日 10:28 的 Backup-Status -NoDrive -Json（零写入，退出码 0）：整体 receipts_current。G 微信热备 10 月 23 日 10:16:05 完成，154,912 文件、46,826,139,227 字节，collection complete、sha256_full_tree、source_follow_verified、无文件警告；这是生产者的验真，本轮只读取、没有重算。本机最近一次微信上云记录是 10 月 22 日 11:00—12:10:58 drive=complete，上传来源是上一代（22 日 10:14:14 那份 G 热备，gate passed）；23 日 10:16:05 这一代还没有上云记录；Drive 本轮 not_contacted，没有联网重读云端。PCConfig 冷备本轮没有新读：10 月 22 日 06:47 读到的 core-recovery/cold-last.json 记 10 月 21 日 16:47:54 那一轮整体 complete_with_warnings、20 个集合没有 blocked，wechat 集合 complete，警告来自密码中心那一项 H 落后 G 和四个来源新鲜度 unknown；那一轮早于现在这一代。

- 历史：10 月 20 日 07:41 的 Backup-Status -NoDrive（零写入）：微信 verification=unknown，reason=backup_tree_transaction_pending。10 月 19 日 09:30 启动的热备尝试回执仍是 running，计划任务上次结果 125；当天 11:00 上云失败，原因相同。G 上最近的成功回执仍记 10 月 18 日 10:14，153,226 文件、46,623,230,809 字节，但事务门没放行前不能凭这份旧回执说当前完整。微信 Drive 最近成功为 10 月 12 日 12:18，148,878 文件、46,034,606,676 字节，完整原应用数据、经 rclone 校验（不含有文件警告的文件）。PCConfig 10 月 19 日 14:30:11 冷备 status=blocked、reason=required_backup_freshness_not_ready:wechat，H 写入状态 unknown_no_complete_receipt。本轮没有修复事务、启动备份或改 PCConfig。10 月 12 日那次状态曾显示微信 Drive 最近成功为 10 月 5 日 12:17，147,560 文件、45,777,553,213 字节。没有读取聊天内容、访问云端或把生产者此前验真冒充这次重新计算。

- 云端最后成功采用本机已有回执；网页没有重列微信远端对象、执行 rclone check 或登录客户端。

## 与其他模块的关系

把体积大、变化快的微信原应用目录从配置包里拆出来单独维护；热备结果再用有界回执交给 PCConfig 判断冷备前置条件。
