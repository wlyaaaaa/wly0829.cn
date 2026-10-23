---
{
 "title": "Codex会话内容去重、点校验与 H 冷备",
 "kind": "project",
 "url": "/projects/codex-memory/content-addressed-storage-cold-sync/",
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
  "page": "codex-memory-content-addressed-storage-cold-sync",
  "kind": "project",
  "title": "Codex会话内容去重、点校验与 H 冷备",
  "url": "/projects/codex-memory/content-addressed-storage-cold-sync/",
  "parent": "codex-memory",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-12",
   "source": "机制按 2026-10-11 的 AI 备份源码（63df06c）核对，源码现为 9f56256，发布后只修测试路径；G/H 当前点指针与回执于 2026-10-22 06:50（北京时间）只读复读；新增故障路径的测试只读定义、本轮未执行"
  }
 },
 "source": {
  "page": "sources/pages/codex-memory-content-addressed-storage-cold-sync/page.json",
  "sha256": "6739fed1837d81ba9555962aa453496d652699ffb62d4a3a665556943d18f558",
  "converted_at_beijing": "2026-10-23T13:22:41+08:00"
 }
}
---

::screen{#codex-memory-content-addressed-storage-cold-sync-01 section="top"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-01",
  "section": "top",
  "title": "Codex会话内容去重、点校验与 H 冷备",
  "links": [
   {
    "text": "回到项目 → AI 备份",
    "href": "/projects/codex-memory/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/codex-memory/#ai-brief"
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
     "text_ref": "Codex会话内容去重、点校验与 H 冷备",
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
     "static_note": "截至 10 月 12 日 · 机制按 2026-10-11 的 AI 备份源码（63df06c）核对，源码现为 9f56256，发布后只修测试路径；G/H 当前点指针与回执于 2026-10-22 06:50（北京时间）只读复读；新增故障路径的测试只读定义、本轮未执行",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 备份〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "相同内容只存一份，每个历史点保留自己的文件清单；H 盘每天另行跟进并独立校验，避免复制了指针却没有完整对象。个别文件被挡住时，H 宁可先保留旧的完整点，也不拿缺文件的点冒充完整。",
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
     "text_ref": "Codex会话内容去重、点校验与 H 冷备",
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
     "static_note": "截至 10 月 12 日 · 机制按 2026-10-11 的 AI 备份源码（63df06c）核对，源码现为 9f56256，发布后只修测试路径；G/H 当前点指针与回执于 2026-10-22 06:50（北京时间）只读复读；新增故障路径的测试只读定义、本轮未执行"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 备份〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "相同内容只存一份，每个历史点保留自己的文件清单；H 盘每天另行跟进并独立校验，避免复制了指针却没有完整对象。个别文件被挡住时，H 宁可先保留旧的完整点，也不拿缺文件的点冒充完整。"
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
   "asset": "_library/illustrations/modules/codex-memory/content-addressed-storage-cold-sync/content-addressed-storage-cold-sync-v01.png",
   "key": "main-codex-memory",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱前面站着五个小工具标志排成一排（OpenAI 的 Codex 标志、Claude 标志、Google Antigravity 标志、OpenCode 标志、一只小水彩龙虾代表 OpenClaw）。",
   "sha256": "ccbb36624c3f23244fb30c8096523d726e44c45d545ed48e3b01c87527722bcb",
   "status": "ready"
  }
 ]
}
```

# Codex会话内容去重、点校验与 H 冷备

〔回到项目 → AI 备份〕　〔复制 AI 续作说明〕

相同内容只存一份，每个历史点保留自己的文件清单；H 盘每天另行跟进并独立校验，避免复制了指针却没有完整对象。个别文件被挡住时，H 宁可先保留旧的完整点，也不拿缺文件的点冒充完整。

**当前情况：**G 最新一份 2026-10-23 12:46 存好，H 最新一份 2026-10-22 15:20 完整核对完成，两边都没有被挡的文件；各自的文件数和字节数见下面的技术实现。H 每天 14:30 才由既有任务跟进，同步之前差一天本来正常；10/19 那份 H 没跟上、到 10/20 早上还停在 10/18，原因没查清，之后已重新同步。按需更新只读回执，不重新算哈希，也不演练恢复。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#codex-memory-content-addressed-storage-cold-sync-02 section="usage"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 相同附件没必要在每一份会话备份里重存；但变动的数据库仍会占新空间。冷盘上的点只有文件齐全且自己通过核对，才算一份独立副本。 举个实际例子 两份对话都用过同一张图片，G 盘可共用那张图片的保存文"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 相同附件没必要在每一份会话备份里重存；但变动的数据库仍会占新空间。冷盘上的点只有文件齐全且自己通过核对，才算一份独立副本。 举个实际例子 两份对话都用过同一张图片，G 盘可共用那张图片的保存文"
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

同一个附件没必要在每份会话备份里重存；但变动的数据库仍会占新空间。冷盘上的点要自己通过核对，才算一份独立副本；只拿到一部分文件时，也得把范围说清楚。

## 举个实际例子

两份对话都用过同一张图片，G 盘只存一份。10/11 这次 G 新写 19.5 GB、复用 19.8 GB。H 盘下午 14:30 再跟进；如果有个文件被杀毒软件挡住，H 先保留原来的完整点，等文件能读了再换新点。

## 最后我会得到什么

我知道 G 盘和 H 盘各自有哪一份点、哪天的、覆盖了多少文件。H 真实核对通过才称冷副本可用；如果只能保存一部分，回执会写明保存了多少、漏了多少、覆盖率多少。

::screen{#codex-memory-content-addressed-storage-cold-sync-03 section="usage"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-03",
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

这一点用到的文件齐全，H 再独立核对完成，各自标成功；H 比 G 晚一天属于正常节奏。

## 发现问题时

普通缺失、哈希损坏或清单错误仍按失败处理。个别文件被杀毒拦截时，新点在 H 暂缓，H 保留旧完整点；连一个可读的完整点都没有时，才另存一份标明范围的“健康子集”。

## 入口不可用或证据不足时

H 没接上就跳过并记 H_unavailable，不影响已核对的 G 点；接上盘也不会立刻触发同步，要等每天的既有任务。

::screen{#codex-memory-content-addressed-storage-cold-sync-04 section="usage"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-04",
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
     "text_ref": "在已接入的 AI 对话中查询某个 Codex 会话点是否已到 G 或 H；H 冷备由 PCConfig 的既有任务每天 14:30 处理。",
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
     "text_ref": "1. **先查 G 盘这份点是否完整**　核对这一点用到的每个文件和清单；相同内容共用一份，变动的数据库要新副本。",
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
     "text_ref": "在已接入的 AI 对话中查询某个 Codex 会话点是否已到 G 或 H；H 冷备由 PCConfig 的既有任务每天 14:30 处理。"
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
     "text_ref": "1. **先查 G 盘这份点是否完整**　核对这一点用到的每个文件和清单；相同内容共用一份，变动的数据库要新副本。",
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

在已接入的 AI 对话中查询某个 Codex 会话点是否已到 G 或 H；H 冷备由 PCConfig 的既有任务每天 14:30 处理。

## 需要准备什么

- 要找的点位或日期

- G 与 H 介质状态

## 从开始到拿到结果

1. **先查 G 盘这份点是否完整**　核对这一点用到的每个文件和清单；相同内容共用一份，变动的数据库要新副本。

2. **H 可用时再跟进**　每天 14:30 的冷任务复制所需对象，H 端校验完整才发布 H 指针；遇到单文件警告则保留旧完整点。

3. **说明真正完成到哪**　H 未接时明确跳过；只保存了部分范围就写明覆盖率，指针更新但清理没做完也只报告已完成的阶段。

::screen{#codex-memory-content-addressed-storage-cold-sync-05 section="tech"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月14日回读桌面G/H同点、两点保留与H随G收敛完成回执；9月7日合成测试保留原日期 关键规则与设计选择 1 去重粒度是完整文件；相同字节复用，变化后的大数据库会占新"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月14日回读桌面G/H同点、两点保留与H随G收敛完成回执；9月7日合成测试保留原日期 关键规则与设计选择 1 去重粒度是完整文件；相同字节复用，变化后的大数据库会占新"
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
     "text_ref": "1. 去重粒度是完整文件；相同字节复用，变化后的大数据库会占新空间。",
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
     "text_ref": "1. 去重粒度是完整文件；相同字节复用，变化后的大数据库会占新空间。",
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

G 最新热备 2026-10-23 12:46 完成：11,878 个文件、34,876,163,969 字节，回读已核对、无文件警告；H 最新冷备 2026-10-22 15:20 完成：11,600 个文件、34,397,988,346 字节，全清单核对（all_manifest_files）、partial_coverage=false、覆盖 100%、无文件警告。两盘各读自己的回执，入口只认完整、已回读、和当前指针同一点的回执；H 每天 14:30 才跟进 G，两边常差一天。按需更新不重新散列对象，也不演练恢复。此前 10/20 07:41 读到两边不同代：G 是 10/19 点，11,108 个文件、39,488,518,338 字节；H 停在 10/18 点（`20261018T041859Z-5abb3a50`），11,093 个文件、39,461,693,231 字节；10/19 那份没同步到 H，原因没查清。更早 10/12 核对时两边同为 10/11 点：10,491 个文件、39,234,419,908 字节，复用 19.8 GB、新写 19.5 GB（两个数各自四舍五入，相加 39.3 GB 与总量差 0.1 GB 是舍入）。

## 关键规则与设计选择

1. 去重粒度是完整文件；相同字节复用，变化后的大数据库会占新空间。

2. 点清单发布后正常备份不再就地修改；哈希用来发现差异，不是对所有损坏的免疫保证。

3. 无警告时 G 保留当前和上一点；H 核对完 G 的有效保留集合、发布自己的指针、清掉 H 独有的旧点和对象并回读，才写 `cold_retention_status=complete`。

4. 单文件警告时：被挡的点在 H 暂缓（`current_point_deferred=true`），H 不做跟随删除（`cold_retention_status=deferred_file_warnings`），旧完整点先保留；文件恢复后发布完整点，再按原规则清理。

5. 没有任何可读完整点时，才按已核对的 G 清单在 H 另建“健康子集”：写 `partial_coverage=true`、`verification_scope=selected_files_excluding_file_warnings`、源/已存/遗漏文件数和覆盖率；不改 G 原点，不读活动目录，不拿缺对象的旧清单当完整。

6. H 不可用就跳过；接盘本身不新增即时触发。

## 当前怎样实现

- 对象路径为 `objects\sha256\<前两位>\<完整 64 位 SHA-256>`，文件名是完整哈希。

- 点校验核对数据结构、清单和闭包哈希、文件数和字节数，以及每个引用对象。

::screen{#codex-memory-content-addressed-storage-cold-sync-06 section="tech"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-06",
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
     "text_ref": "- Validate 只查选定的 Hot 或 Cold 点，不是全盘检查；`-ReadOnly` 不写进度，都不改对象；结果另带 partial、校验范围、覆盖率和单文件警告。`pass` 只代表所选清单范围。",
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
     "text_ref": "- Validate 只查选定的 Hot 或 Cold 点，不是全盘检查；`-ReadOnly` 不写进度，都不改对象；结果另带 partial、校验范围、覆盖率和单文件警告。`pass` 只代表所选清单范围。",
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

- Validate 只查选定的 Hot 或 Cold 点，不是全盘检查；`-ReadOnly` 不写进度，都不改对象；结果另带 partial、校验范围、覆盖率和单文件警告。`pass` 只代表所选清单范围。

- FinalizeCold/SyncCold 核对 G 当前及有效点，复制缺的对象并独立核对 H；警告回执分开写实际 H 点和请求的 G 点。

## 执行流程

1. 按完整文件内容算 SHA-256。

2. 同哈希对象已存在且有效就复用，否则写新对象并回读。

3. 生成这一点的清单和闭包，引用对象完整才更新 G 当前指针。

4. PCConfig 冷任务每天 14:30 在 H 可用时增量复制，不直接复制 G 指针。

5. H 点核对通过才发布 H 指针，再清理 H 独有点并回读；有单文件警告则保留旧完整点或另建标明范围的健康子集，中途失败只报告实际完成的阶段。

::screen{#codex-memory-content-addressed-storage-cold-sync-07 section="tech"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-07",
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
| Content-Addressed Storage（内容寻址存储） | 一种数据存储模式，文件的存储路径直接由其内容的哈希值决定，内容变则路径变，内容同则天然去重。 |
| Bit Rot Defense（静默位翻转防御） | 长期冷备介质可能因磁性或电荷衰减导致个别位翻转，通过强制性的 SHA-256 闭包校验和可以在恢复前及时发现数据损坏。 |

## 专业定义

相同对象复用；H 没连接就明确冷备未完成

::screen{#codex-memory-content-addressed-storage-cold-sync-08 section="tech"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-08",
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
     "text_ref": "减少重复文件占用，避免不完整的对象集被当成可用备份点，也避免一个被挡住的文件拖垮整条冷备。"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 无警告时固定保留两点；有警告时为了保住完整旧点，可能暂时多于两点，不能说任何情况下都恰好两点。",
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
     "text_ref": "减少重复文件占用，避免不完整的对象集被当成可用备份点，也避免一个被挡住的文件拖垮整条冷备。"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 无警告时固定保留两点；有警告时为了保住完整旧点，可能暂时多于两点，不能说任何情况下都恰好两点。",
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

减少重复文件占用，避免不完整的对象集被当成可用备份点，也避免一个被挡住的文件拖垮整条冷备。

## 边界

- 无警告时固定保留两点；有警告时为了保住完整旧点，可能暂时多于两点，不能说任何情况下都恰好两点。

- 健康子集的“完成”只代表它写明的那部分范围；零个健康文件时也明确写 0。

- 指针已更新本身不证明后续清理完成。

## 失败与恢复

| 情况 | 怎么办 |
| --- | --- |
| H 不可用 | 冷任务记录 H_unavailable 并跳过；只读检查不代替任务回执。 |
| 点或对象哈希不符、普通缺失 | 返回 point_closure_invalid、content_object_invalid 等错误，不发布成功指针。 |
| 个别文件被杀毒拦截 | 新点在 H 暂缓，保留旧完整点；没有完整点时另建健康子集并写明覆盖率。 |
| 文件恢复可读 | 下次发布完整点，回到全清单核对，并按原规则清理派生点。 |

::screen{#codex-memory-content-addressed-storage-cold-sync-09 section="tech"}

```typeset
{
 "screen": {
  "id": "codex-memory-content-addressed-storage-cold-sync-09",
  "section": "tech",
  "title": "依据与来源",
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
     "text_ref": "依据与来源",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "当前（2026-10-2206:50只读）：见上方G/H同一代的点；均为生产者回执，本轮没有做全对象核对、执行冷同步或演练恢复。",
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
     "text_ref": "当前（2026-10-2206:50只读）：见上方G/H同一代的点；均为生产者回执，本轮没有做全对象核对、执行冷同步或演练恢复。",
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

tools\Invoke-CodexConversationBackup.ps1

内容寻址对象写入、闭包校验、冷备与单文件警告逻辑

CONVERSATION_BACKUP.md

对话冷热备架构、存储规范和“单文件告警与可恢复点”说明

tools\test-codex-conversation-backup.ps1

对象去重、清单原子切换与校验测试

## 如何验证

- 当前（2026-10-22 06:50 只读）：见上方 G/H 同一代的点；均为生产者回执，本轮没有做全对象核对、执行冷同步或演练恢复。

- 新增故障路径（10/1 起）有专用合成测试：`test-conversation-file-warnings.ps1`、`test-conversation-cold-file-warnings.ps1`、`test-conversation-cold-partial-point.ps1`；本轮只看定义、没有执行。

- 历史：9 月 7 日三个人工点去重与恢复测试通过；2026-09-12 13:41（北京时间）G/H 同为 `20260912T041508Z-8cec9794`，7,167 个文件、49,655,464,859 字节，H 冷备 13:22:41 完成；9 月 14 日桌面 G/H 同点、两点保留收敛。这些都是历史，之后未重新核对。

## 与其他模块的关系

负责会话点的存储与核对；PCConfig 负责跨盘调度。次机配置档另有明确的有界清理。
