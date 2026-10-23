---
{
 "title": "本地和 G 盘先落稳，Drive 失败不拖垮热备",
 "kind": "project",
 "url": "/projects/devconfig-backup/tiered-distribution/",
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
  "page": "devconfig-backup-tiered-distribution",
  "kind": "project",
  "title": "本地和 G 盘先落稳，Drive 失败不拖垮热备",
  "url": "/projects/devconfig-backup/tiered-distribution/",
  "parent": "devconfig-backup",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "DevConfig Backup 公开仓库 7b111d9 的源码（10 月 22 日 06:47 核对时 10 月 20 日发布后没有新提交，这次没有再查），加上北京时间 10 月 23 日 10:28 只读回读的零写入状态入口与本机/G 回执；PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取；未联网、未重读 H 介质",
   "last": {
    "label": "快照核对",
    "at": "2026-10-23 10:28"
   }
  }
 },
 "source": {
  "page": "sources/pages/devconfig-backup-tiered-distribution/page.json",
  "sha256": "07b2abe6f6b538b7c4be3a1c7d809b1820d29b9d4f0f49b6bf23830cb33aec0b",
  "converted_at_beijing": "2026-10-23T10:34:59+08:00"
 }
}
---

::screen{#devconfig-backup-tiered-distribution-01 section="top"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-01",
  "section": "top",
  "title": "本地和 G 盘先落稳，Drive 失败不拖垮热备",
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
     "text_ref": "本地和 G 盘先落稳，Drive 失败不拖垮热备",
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
     "static_note": "截至 10 月 12 日 · DevConfig Backup 公开仓库 7b111d9 的源码（10 月 22 日 06:47 核对时 10 月 20 日发布后没有新提交，这次没有再查），加上北京时间 10 月 23 日 10:28 只读回读的零写入状态入口与本机/G 回执；PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取；未联网、未重读 H 介质",
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
     "text_ref": "本机、G 盘、云端和 H 盘各有自己的成功日期。断网不抹掉本地已验副本，G 盘或冷盘暂不可用也会单独报告，不用一个绿色任务状态概括全部。",
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
     "text_ref": "本地和 G 盘先落稳，Drive 失败不拖垮热备",
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
     "static_note": "截至 10 月 12 日 · DevConfig Backup 公开仓库 7b111d9 的源码（10 月 22 日 06:47 核对时 10 月 20 日发布后没有新提交，这次没有再查），加上北京时间 10 月 23 日 10:28 只读回读的零写入状态入口与本机/G 回执；PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取；未联网、未重读 H 介质"
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
     "text_ref": "本机、G 盘、云端和 H 盘各有自己的成功日期。断网不抹掉本地已验副本，G 盘或冷盘暂不可用也会单独报告，不用一个绿色任务状态概括全部。"
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
   "asset": "_library/module-illustrations/devconfig-backup/tiered-distribution-v01.png",
   "key": "main-devconfig-backup",
   "source_phrase": "右边约 45% 一幅水彩插画：一台侧透机箱里伸出两条细绿线——一条连着一个打开的纸箱，箱里露出齿轮、终端窗口“>_”、VS Code 蓝色小图标、Claude 和 Codex 小图标组成的一叠文件夹卡片，箱盖上盖着一个绿色对勾印章；另一条连着一个相机，相机前面是一只绿色微信聊天气泡，快门闪光把气泡定格成一叠照片卡片。",
   "sha256": "a40c0d37919ce4ca754eab2e225951ed03b2693c46bc944a74329f1affb2cec8",
   "status": "ready"
  }
 ]
}
```

# 本地和 G 盘先落稳，Drive 失败不拖垮热备

〔回到项目 → 开发配置备份〕　〔GitHub〕　〔复制 AI 续作说明〕

DevConfig Backup · 功能说明

本机、G 盘、云端和 H 盘各有自己的成功日期。断网不抹掉本地已验副本，G 盘或冷盘暂不可用也会单独报告，不用一个绿色任务状态概括全部。

当前情况：配置包 10 月 22 日 12:09 在本地和 G 盘新做成并核对；微信 G 盘热备 10 月 23 日 10:16 完成，19 日那次没收尾的状态已经过去。云端这次没联网查，只看本机记录：配置 10 月 22 日 13:04 上云完成；微信最近一次是 10 月 22 日 12:10 上云完成，传的是上一代，23 日 10:16 这一代还没有上云记录；云上实际内容没有重读。H 冷盘由另一个项目的冷备任务负责：19 日 14:30 那次因微信备份不够新整次停下；最近已知的 10 月 21 日 16:47 那一轮里，配置和微信两项都已完成，整轮仍带别的项目的警告；那一轮早于现在这一代，H 有没有跟上这次没有核对。之前 10 月 11 日中午配置采集曾因一个数据库副本超时失败，当时本地、G 和云端都继续保留 10 月 10 日那一代。恢复前按介质核对日期。

项目快照核对于 2026-10-23 10:28（北京时间），只读了状态入口和本机/G 回执，PCConfig 冷备回执沿用 10 月 22 日 06:47 那次读取，没有联网、没有重读 H 介质；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#devconfig-backup-tiered-distribution-02 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 电脑本地、G 盘、Google Drive 和 H 盘各防一种故障。一次任务显示成功，不能替四处副本都作证；只有完整配置包和清单核对后才更新当前版本。上云任务成功也可能只是把上一"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 电脑本地、G 盘、Google Drive 和 H 盘各防一种故障。一次任务显示成功，不能替四处副本都作证；只有完整配置包和清单核对后才更新当前版本。上云任务成功也可能只是把上一"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 电脑本地、G 盘、Google Drive 和 H 盘各防一种故障。一次任务显示成功，不能替四处副本都作证；只有完整配置包和清单核对后才更新当前版本。上云任务成功也可能只是把上一"
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

电脑本地、G 盘、Google Drive 和 H 盘各防一种故障。一次任务显示成功，不能替四处副本都作证；只有完整配置包和清单核对后才更新当前版本。上云任务成功也可能只是把上一次的旧包再确认一遍。

### 举个实际例子

我问：“昨晚备份好了吗，哪一份现在能带去新电脑？”状态分别列出本地包、G 盘、云端的最后成功日期和最近一次尝试；比如 10 月 11 日就会看到“今天采集失败、本地和 G 仍是 10 月 10 日的包、云端刚确认过这份旧包”。微信文件另看自己的副本，H 盘要另看 PCConfig 的冷备记录。10 月 23 日早上这样问，会看到“本地和 G 是 10 月 22 日 12:09 的新包，云端这次没联网查，本机记录 10 月 22 日 13:04 上云完成”。

### 最后我会得到什么

拿到每处副本最近的完整版本、日期、最近一次尝试和缺口。较新的本地或 G 盘备份不会让云端或 H 盘自动变成同一版本；包里如果登记了个别文件的警告，那几个文件不在这一代的完整性承诺里。恢复时按实际介质选择。

::screen{#devconfig-backup-tiered-distribution-03 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-03",
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

配置包和随附清单完整后，本机、G 盘及云端各自核对并标自己的日期；没有警告时按保留份数清理旧日期包。

### 发现问题时

采集失败时不发布新包，旧成功包原样留着；云端网络中断时保留已完成的本地副本，说明云端稍后仍需重试。包里有文件警告时，暂停清理对应位置的旧日期包。

### 入口不可用或证据不足时

云端目标身份不明或 H 盘未解锁时停对应复制，不自动改投另一账号或假报完成。

::screen{#devconfig-backup-tiered-distribution-04 section="usage"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-04",
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
     "text_ref": "在本机运行 Backup-Status.ps1 或在已接入的 AI 对话中问“昨晚每一层备份到哪一步”。这个状态入口只看本机、G 盘和本机记录的云端结果，不含 H 盘。",
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
     "text_ref": "1. **看清哪份副本真的完整**　状态入口分别展示本机、G 盘、微信 G 盘副本、云端和最近一次尝试，不把一层的成功借给另一层；H 盘的同代证明要另读 PCConfig 冷备回执。",
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
     "text_ref": "在本机运行 Backup-Status.ps1 或在已接入的 AI 对话中问“昨晚每一层备份到哪一步”。这个状态入口只看本机、G 盘和本机记录的云端结果，不含 H 盘。"
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
     "text_ref": "1. **看清哪份副本真的完整**　状态入口分别展示本机、G 盘、微信 G 盘副本、云端和最近一次尝试，不把一层的成功借给另一层；H 盘的同代证明要另读 PCConfig 冷备回执。",
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

在本机运行 Backup-Status.ps1 或在已接入的 AI 对话中问“昨晚每一层备份到哪一步”。这个状态入口只看本机、G 盘和本机记录的云端结果，不含 H 盘。

### 需要准备什么

- 想看的日期或备份代

- 本地、G、Drive、H 的实际可用性

### 从开始到拿到结果

1. **看清哪份副本真的完整**　状态入口分别展示本机、G 盘、微信 G 盘副本、云端和最近一次尝试，不把一层的成功借给另一层；H 盘的同代证明要另读 PCConfig 冷备回执。

2. **核对完整版本**　本地先采集和验证整包，再复制并验 G；云端后来复制已完成的一代，采集失败那天云端确认的仍是上一代。

3. **选真正能恢复的一份**　交回每处副本的完整性、文件警告和缺口；云端故障不抹掉已验本地副本，旧云记录也不算本轮成功。

::screen{#devconfig-backup-tiered-distribution-05 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 本地/G 配置包仍是 10 月 10 日成功代（10 月 11 日采集失败）；配置云端 10 月 11 日 13:02 确认的是这份旧包，云上现存对象未联网"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 本地/G 配置包仍是 10 月 10 日成功代（10 月 11 日采集失败）；配置云端 10 月 11 日 13:02 确认的是这份旧包，云上现存对象未联网"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 本地/G 配置包仍是 10 月 10 日成功代（10 月 11 日采集失败）；配置云端 10 月 11 日 13:02 确认的是这份旧包，云上现存对象未联网"
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
     "text_ref": "1日期包及其附属清单作为一个成功代保留；current.json是完整采集与验证的指针，latest.zip只是兼容别名，不可凭修改时间挑包。当前成功代是",
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
     "text_ref": "1日期包及其附属清单作为一个成功代保留；current.json是完整采集与验证的指针，latest.zip只是兼容别名，不可凭修改时间挑包。当前成功代是",
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

本地/G 配置包是 10 月 22 日 12:09 成功代；配置云端按本机记录最近是 10 月 22 日 13:04 完成，本轮没联网重读云端；H 冷备不在本项目状态里，最近已知的 PCConfig 10 月 21 日 16:47:54 那一轮配置项 complete（整轮 complete_with_warnings，警告来自其他集合），那一轮早于现在这一代

### 关键规则与设计选择

1. 日期包及其附属清单作为一个成功代保留；current.json 是完整采集与验证的指针，latest.zip 只是兼容别名，不可凭修改时间挑包。当前成功代是 devconfig-20261021-230914-6ea337d3.zip（包名里的时间是电脑本地时区，即北京时间 10 月 22 日 12:09 生成，10 月 23 日 10:28 读到）；10 月 22 日 06:47 核对时是 devconfig-20261020-230752-4c4e7d61.zip（北京时间 10 月 21 日 12:08），10 月 20 日核对时是 devconfig-20261018-230702-098e60a2.zip（北京时间 10 月 19 日 12:07），10 月 12 日核对时还是 devconfig-20261009-231229-9de61253.zip（北京时间 10 月 10 日 12:12）。

2. 作为本机可访问的日常在线热备（每天北京时间 12:05，加上登录后 20 分钟各跑一次），该层不依赖公网；配置上云在每天 13:00。

3. 配置包按完整代发布，不做 zip 内部差量；先发布日期文件与校验依据，再更新兼容别名和 current（当前状态）。文件集合或完整性不符时拒绝把候选冒充成功代；采集失败时本地、G 和云端都继续保留旧成功代。

4. 云端复用必须针对同一完整成功代与登记目标逐项核对，不能只信本机旧 state/latest.sha256 或最近任务结果。上传后偶尔读不到云端对象信息时，单个对象最多重读 3 轮、每轮间隔 2 秒，每轮仍要真实成功，再严格比大小和 MD5。

5. 日期包、兼容别名、附属清单和 current（当前状态）指针都需匹配本地成功代；一个 zip 的大小/MD5 相同不足以单独说明完整恢复集已发布。

6. 本仓库的任务不写 H；PCConfig 的冷备日任务每天机会式检查（另有 14:15 热维护、14:30 冷同步，都归 PCConfig）。H 人工解锁后，还需 Hot context 不超过 48 小时、DevConfig/微信各不超过 36 小时、G/H 介质身份正确、H 剩余空间高于 100 GiB 并取得写锁。

7. 条件通过后 PCConfig 冷备跟随 G 当前有效保留集：先复制并核对新增变化，再清理 H 中已退出的旧副本。源根离线或读不完整不按空源删除，不自动重锁 H。DevConfig 默认本地留 7 份、G 留 7 份、云端留 3 份日期包；包里有文件警告（file_warnings）时暂停清理旧包，没有警告后恢复原规则。所以 10 月 11 日 13:33 本地和 G 各有 8 个日期包，这不是改成了留 8 份，云端也不保证恰好 3 份。

## 当前怎样实现

- G 短暂缺席沿用有界等待；独立候选、全部附属文件与成功回执验真前不替换当前指针或淘汰旧代，持续缺席保留上次成功并明确本次失败。

::screen{#devconfig-backup-tiered-distribution-06 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-06",
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
     "text_ref": "- Backup-DevConfig.ps1 通过 -Tier 参数支持 Local, Hot, Drive 组合，入口自动进行字符串切割与逗号兼容归一化。",
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
     "text_ref": "- Backup-DevConfig.ps1 通过 -Tier 参数支持 Local, Hot, Drive 组合，入口自动进行字符串切割与逗号兼容归一化。",
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

- Backup-DevConfig.ps1 通过 -Tier 参数支持 Local, Hot, Drive 组合，入口自动进行字符串切割与逗号兼容归一化。

- Initialize-BackupNetwork.ps1 自动从 Windows 系统代理读取当前已启用的代理配置，为后台无窗任务提供网络连通性。

- Resolve-ConfiguredRcloneRemote 从 state\rclone-remote-binding.json 读取用户选定的远端别名，文件损坏或不可读时直接 fail-closed（失败关闭）。

- tests/Assert-HDriveSafety.ps1 检查本仓库脚本没有 H 目标、拒绝已退役的 Usb 参数：这部分是字符串与正则合同；任务设置部分（重试、需要网络、限时）用 PowerShell AST（语法树解析）检查四个设置命令。这是脚本定义，本轮（10 月 22 日）也没有运行它。

## 执行流程

1. 计划任务（每天 12:05 和登录后 20 分钟）或手动触发 Backup-DevConfig.ps1 -Tier Local,Hot。

2. 独立 staging（临时工作区）经完整采集与 7z 测试后，生成日期包、SHA-256、成功回执、逐文件清单与包内 manifest（清单）；任何一步失败都不出新包。

3. 把成功代复制到 G 并核对，最后原子发布 current.json；之后才按保留策略清理旧成功日期代，包里有文件警告时这一步暂停。

::screen{#devconfig-backup-tiered-distribution-07 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-07",
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
     "text_ref": "4. 每天 13:00 的 Drive 任务锁定已完成的本地代，核对登记目标、完整状态与全部代文件；当天采集失败时，锁定的就是上一个成功代。",
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
     "text_ref": "4. 每天 13:00 的 Drive 任务锁定已完成的本地代，核对登记目标、完整状态与全部代文件；当天采集失败时，锁定的就是上一个成功代。",
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

4. 每天 13:00 的 Drive 任务锁定已完成的本地代，核对登记目标、完整状态与全部代文件；当天采集失败时，锁定的就是上一个成功代。本轮没联网；本机记录 10 月 22 日 13:00 那次上云完成，10 月 20、21 日两天的 13:00 结果没有核对。

5. 先上传并验真日期包及其附属文件，再发布 latest 兼容别名与 current（当前状态）；最后才写云端成功状态。

::screen{#devconfig-backup-tiered-distribution-08 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-08",
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
| Tiered Storage（分层存储） | 把同一恢复材料按本地包、G 盘在线热备、Google Drive 和 PCConfig 人工冷备分层，每层独立给出结果。 |
| Checksum Verification（校验和核验） | 比对源与目标端的内容哈希，不依赖可能产生时钟漂移的文件修改时间。 |
| Cold Backup Window（冷备窗口） | H 平时不可用；用户人工解锁后，PCConfig 日任务才有机会在新鲜度、介质、容量和写锁门通过时复制。任务不会自动解锁或重锁 H。 |

## 专业定义

先生成完整成功代，再分层发布；每层携带校验依据，失败不会把旧成功副本改成半成品。

::screen{#devconfig-backup-tiered-distribution-09 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-09",
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
     "text_ref": "- **Google Drive 远端 binding 文件损坏或格式错误**：Resolve-ConfiguredRcloneRemote 立即失败关闭，拒绝回退至第一个可用远端，防止数据错传。",
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
     "text_ref": "- **Google Drive 远端 binding 文件损坏或格式错误**：Resolve-ConfiguredRcloneRemote 立即失败关闭，拒绝回退至第一个可用远端，防止数据错传。",
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

防止网络离线或海外云盘受阻导致本地热备无法完成，同时防止冷备介质暴露在日常自动化写入中导致损坏。

## 边界

- DevConfig 仓库的日常脚本与四个任务不直接写 H；H 冷备由 PCConfig 的独立日任务在人工打开的介质窗口机会式执行。

- Google Drive 同步必须严格读取绑定的合法远端别名，禁止静默切换至未授权云盘。

- 未通过大小与 MD5 双重校验的云端对象绝不标记为同步成功；有限重试只针对“查询对象信息”这一步偶发失败，查到之后内容不符不再重试，也不跳过哈希、身份或代文件匹配，不等于云端永不失败。

## 失败与恢复

- **Google Drive 远端 binding 文件损坏或格式错误**：Resolve-ConfiguredRcloneRemote 立即失败关闭，拒绝回退至第一个可用远端，防止数据错传。

- **定时上传时网络中断、系统代理或远端预检不可用**：脚本写入本地日志并向 Task Scheduler 返回非零退出码，按任务策略重试（最多 3 次，间隔 15 分钟）；已完成的本地/G 热备不回滚。

- **上传后日期包或 latest.zip 的大小/MD5 不匹配**：要分两种情况。查询对象信息本身失败（命令非零退出或出异常）时，最多重读 3 次、每次间隔 2 秒；查询成功后，只要结果解析不出、大小或 MD5 不符，就直接判本轮 Drive 失败，不再重读。失败时保留本地包，记录失败阶段、对象类型和原因（不输出远端账号），下次继续核对或上传；不能写成云端已完成。

- **PCConfig 冷备日任务运行时 H 没有解锁或不可见**：PCConfig 写出 status=skipped 与 H_unavailable；不写 G、不写云、不自动重锁 H，也不把本轮算成完成冷备。

::screen{#devconfig-backup-tiered-distribution-10 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-10",
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
     "text_ref": "- **Backup-DevConfig.ps1**：分层备份主调度脚本，处理打包、本地保留、G 盘文件复制与 Drive 同步",
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
     "text_ref": "- **Backup-DevConfig.ps1**：分层备份主调度脚本，处理打包、本地保留、G 盘文件复制与 Drive 同步",
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

- **Backup-DevConfig.ps1**：分层备份主调度脚本，处理打包、本地保留、G 盘文件复制与 Drive 同步

- **Initialize-BackupNetwork.ps1**：代理环境继承与 rclone 远端 binding 安全解析

- **Backup-Status.ps1**：本机、G 盘、微信 G 盘副本、云端记录、最近尝试和计划任务的状态汇总；默认不联网、零写入，不含 H 盘

- **tests/Assert-HDriveSafety.ps1**：本仓库 H 目标与退役 Usb 参数的字符串合同检查，加上任务设置的语法树检查

- **PCConfig 的 Invoke-CoreRecoveryMaintenance.ps1**：H 冷备的实际负责方：机会式日任务、新鲜度/介质/容量/写锁门与验真后的有效保留集源跟随

- **Backup.Common.ps1**：稳定采集、完整集合、原子回执、受管资源锁和成功代核验

## 如何验证

- 9 月 18 日来源回归与收尾证据包含 H 职责隔离和分层发布验证；网页本轮不重跑这些源码脚本。

- 北京时间 10 月 11 日 13:33 的零写入状态：当天 12:06—12:25 的配置采集失败（读取 home/.codex/state_5.sqlite 数据库副本超时），没有发布新包。本地/G 同为 devconfig-20261009-231229-9de61253.zip，299,791,772 字节（约 286.0 MiB），回执记 6,270 个文件、原始 942,360,581 字节（约 0.88 GiB），整包 SHA-256=de16cef7554bc0b62d9911b2c0599f6ae71f02f4691dd63576f999531b18da75，带 1 条 source_disappeared（文件在扫描后消失）警告，是一份 Codex 临时执行记录。这些是生产者已验的回执，状态入口没有重新解包或重哈希。北京时间 10 月 23 日 10:28 的零写入状态：整体 receipts_current，本地/G 同为 devconfig-20261021-230914-6ea337d3.zip（10 月 22 日 12:09:54 本机、12:09:58 G 完成），449,631,558 字节（约 428.8 MiB），回执记 6,344 个文件，无文件警告；这一代的整包 SHA-256 这里不列，不能借用上面旧包的哈希。9 月 18 日旧包 devconfig-20260917-223044-15f482e1.zip、2,918,700,657 字节与 SHA-256=23175b58deb25089f07637380a99f449ead3f699cffcb83deb1bbae9255cc42c 仅是旧时点证据。

::screen{#devconfig-backup-tiered-distribution-11 section="tech"}

```typeset
{
 "screen": {
  "id": "devconfig-backup-tiered-distribution-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "下一个模块 配置精选与避坑",
    "href": "/projects/devconfig-backup/source-catalog/"
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
     "text_ref": "配置Drive任务10月19日13:00—13:03:49完成（package=verified_existing、drive=complete），本机记录对应当天12:07的新包；",
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
     "text_ref": "配置Drive任务10月19日13:00—13:03:49完成（package=verified_existing、drive=complete），本机记录对应当天12:07的新包；",
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

- 配置 Drive 任务 10 月 19 日 13:00—13:03:49 完成（package=verified_existing、drive=complete），本机记录对应当天 12:07 的新包；10 月 23 日 10:28 读本机记录：10 月 22 日 13:00—13:04:15 那次也完成（package=verified_existing、drive=complete），对应当天 12:09 的新包；没有联网重读云端（状态入口 drive=not_contacted），云上现存对象和包数都没有核对。此前 10 月 11 日 13:00—13:02 那次确认的是已有的 10 月 10 日包，不是新包上云。PCConfig 的 docs/recovery/devconfig-backup-delivery-2026-09-18.md 记录的是 9 月 18 日配置包云端同代对象回读，属历史。

- 本项目状态入口不返回 H，H 的结果来自 PCConfig 冷备回执。10 月 22 日回读 PCConfig 的 core-recovery/cold-last.json：10 月 21 日 16:47:54 那一轮整体 complete_with_warnings，20 个集合都没有 blocked，devconfig 和 wechat 两项都是 complete；警告是密码中心那一项 H 落后 G、另有四个来源新鲜度 unknown。这份回执不代表本轮重做冷备，H 上本项的包哈希本轮没有重算。10 月 20 日 07:41 曾回读到：最新一次是 10 月 19 日 14:30:11 的冷备，status=blocked，reason=required_backup_freshness_not_ready:wechat，H 写入状态 unknown_no_complete_receipt，没有完成回执，所以本轮不能说 H 与 G 当前同代；10 月 11 日之后到 19 日之间 H 是否另有完成的同步，本轮没有核对。10 月 12 日 05:40 曾回读到 10 月 11 日 18:39:26 的冷备记录：20 个集合都有结果，整体为 complete_with_warnings（其中也有别的集合的警告），本项目的配置集合 complete，37/37 核对，核对方式是元数据、身份、存在性和来源稳定性，不重新读文件内容。H 当前可读，H 上的 current.json 和回执与 G 指向同一个 devconfig-20261009-231229-9de61253.zip（SHA-256 de16cef7…da75，299,791,772 压缩字节、6,270 个文件），现场 latest.zip 长度与回执相符；本轮没有重新计算 H 包的 SHA-256。记录里有 2 条 source_disappeared，是同一个配置包警告在链路上重复出现，不是 2 个不同的警告文件。热维护和冷备两份回执引用同一个恢复上下文编号。9 月 23 日的 18 集合 complete，以及 9 月 18 日来源验收记录的 16 个冷备集合、H 配置包哈希与 G/H 微信完整核对，都保留原日期作为历史；不同集合的全量、路径/大小与抽样证据分别成立，不能互相替代。

## 与其他模块的关系

这是整套灾备的介质层：先把能离线完成的本地与 G 盘副本落稳，再单独尝试云端；H 盘冷备不归这个仓库直接写。
