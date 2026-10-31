---
{
 "title": "我开口时更新一次，另外每 7 天自动更新一次设备数据",
 "kind": "project",
 "url": "/projects/personal-health/protected-foreground-refresh/",
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
  "page": "personal-health-protected-foreground-refresh",
  "kind": "project",
  "title": "我开口时更新一次，另外每 7 天自动更新一次设备数据",
  "url": "/projects/personal-health/protected-foreground-refresh/",
  "parent": "personal-health",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "项目源码最后变更 10 月 7 日、源码按 10 月 11 日 14:00 前为准；周任务状态与凭据登记方式为 10 月 11 日只读查看，本次没有联网刷新"
  }
 },
 "source": {
  "page": "sources/pages/personal-health-protected-foreground-refresh/page.json",
  "sha256": "2f7dbbc7f3dc055d59058dba3975b86074b853a2ce3eef39a6c09fd32c1e028e",
  "converted_at_beijing": "2026-10-31T13:58:51+08:00"
 }
}
---

::screen{#personal-health-protected-foreground-refresh-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-01",
  "section": "top",
  "title": "我开口时更新一次，另外每 7 天自动更新一次设备数据",
  "links": [
   {
    "text": "回到项目 → 个人健康",
    "href": "/projects/personal-health/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-health/#ai-brief"
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
     "text_ref": "我开口时更新一次，另外每 7 天自动更新一次设备数据",
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
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 项目源码最后变更 10 月 7 日、源码按 10 月 11 日 14:00 前为准；周任务状态与凭据登记方式为 10 月 11 日只读查看，本次没有联网刷新",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人健康证据与安全决策 · 功能说明",
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
     "text_ref": "我开口时更新一次，另外每 7 天自动更新一次设备数据",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 项目源码最后变更 10 月 7 日、源码按 10 月 11 日 14:00 前为准；周任务状态与凭据登记方式为 10 月 11 日只读查看，本次没有联网刷新"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人健康证据与安全决策 · 功能说明"
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
   "asset": "_library/module-illustrations/personal-health/protected-foreground-refresh-v01.png",
   "key": "main-personal-health",
   "source_phrase": "右上一幅水彩插画：一只手腕戴着纤细的黑色穿戴设备，设备屏幕微微发绿光；手腕旁边一部手机，一条绿色细虚线从设备连到手机、再连到一本翻开的小册子；小册子封面写“健康现状”四个字；小册子旁边一只放大镜照着一张报告纸，报告纸上只画灰色横线，不画任何数字、表格或图表。",
   "sha256": "a7317da66e01e8844b34ad549d3558b962bed3187bb7e346a33710d70ebd8381",
   "status": "ready"
  }
 ]
}
```

# 我开口时更新一次，另外每 7 天自动更新一次设备数据

〔回到项目 → 个人健康〕　〔复制 AI 续作说明〕

个人健康证据与安全决策 · 功能说明

设备数据有两条更新路：我当场说“更新一次”，或者每 7 天一次的定时任务。两条路走的是同一套采集和核对流程，跑完就停，不做持续同步；长期凭据不会散落在命令参数、日志或普通文件里，采集程序每次只拿到最长 1 小时有效的只读临时票。

**当前情况：**定时任务在用，最近一次 10 月 7 日跑完、正常退出，下一次排在 10 月 14 日，没有漏跑（10 月 11 日查看）。本次没有联网重刷，也不代表账号授权现在一定有效。采到的数据要经健康项目的 AI 审阅后才可能用进当前认知，定时脚本自己不改。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-health-protected-foreground-refresh-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-02",
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

设备接口需要长期凭据。如果每次更新都重新授权、把令牌写进文件，或让脚本在后台无休止重试，既打扰人，也扩大凭据和误操作风险。可完全靠手动又容易忘，所以现在是“我随时可以要一次，平时每 7 天自动跑一次”，两条路都跑完即停。

## 举个实际例子

我说“现在更新一次 Fitbit Air”。系统先把上次已经取回、还没整理的结果在本机整理完；确需联网时才由固定凭据入口发一张 1 小时只读临时票给采集程序。如果只是这一段的请求数或临时票时间用完、同一份清单确实有进展，就接着跑下一段；账号需要重新绑定、权限或验证失败、没有进展或超时，就停下来说明，不换账号、不转后台重试。我不开口时，每 7 天的定时任务做同样的事。

## 最后我会得到什么

得到一次更新结果：取回了什么、哪些日期还缺、离线核对有没有通过。账号或权限出了问题就说明并停止。结果交给健康项目的 AI 审阅；它标着“需要审阅”只是固定规矩，不代表这份结果现在还没处理，也不会给我新增每周手工审阅的事。

::screen{#personal-health-protected-foreground-refresh-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-03",
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
     "text_ref": "可用于当前判断",
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
     "text_ref": "可用于当前判断",
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

## 可用于当前判断

本次设备记录取回并核对完整后，再转入本机离线验真；一次请求返回不等于全部完成。

## 需要复核

若上一批已经成功取回但尚未整理，先在本机完成它，不重复访问账号。

## 本轮不可用

账号需重新绑定、回执异常或本次运行超时就停止，保留已有材料并说明接续条件。

::screen{#personal-health-protected-foreground-refresh-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-04",
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
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "row": "start",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
     "width": "40%"
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
     "text_ref": "1. **系统核对并处理**　按需入口和每 7 天的定时任务调用同一个刷新程序：先收尾已取回的结果，确需联网才由受保护凭据入口发 1 小时只读临时票，凭据不落在普通文件或命令行。",
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
     "text_ref": "1. **系统核对并处理**　按需入口和每 7 天的定时任务调用同一个刷新程序：先收尾已取回的结果，确需联网才由受保护凭据入口发 1 小时只读临时票，凭据不落在普通文件或命令行。",
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

我想马上更新时直接说“更新这次 Fitbit Air 记录”；不说也会每 7 天自动跑一次。

## 需要准备什么

- 想马上更新时，一句明确的更新请求（定时任务不需要我做什么）

- 想看的日期范围（如不同于默认）

## 从开始到拿到结果

1. **系统核对并处理**　按需入口和每 7 天的定时任务调用同一个刷新程序：先收尾已取回的结果，确需联网才由受保护凭据入口发 1 小时只读临时票，凭据不落在普通文件或命令行。

2. **交付与接续**　交回本次取回、缺页和离线核对状态；连接或授权失败就停。定时任务跑完即停，最长 5 小时，不做持续同步，也不自己改当前健康认知。

::screen{#personal-health-protected-foreground-refresh-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-05",
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
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
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
     "type": "numbered_steps",
     "text_ref": "1. 首次桌面授权（OAuth）用本机回环回调和 PKCE，长期刷新凭据存进密码中心并回读确认；网页不办理授权。",
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
     "type": "numbered_steps",
     "text_ref": "1. 首次桌面授权（OAuth）用本机回环回调和 PKCE，长期刷新凭据存进密码中心并回读确认；网页不办理授权。",
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

**10 月 11 日查看**　定时任务 PersonalHealth Weekly Refresh：已启用、就绪，每 7 天一次，需登录状态下运行，整任务上限 5 小时；最近一次 10 月 7 日 18:23 开始、约 1 分钟跑完、退出码 0，下一次 10 月 14 日，漏跑 0。凭据入口现装模式是“发 1 小时只读访问票”，现装中介脚本和源码逐字节一致。本次没有调用凭据中介、没有授权、没有联网采集，也没有跑测试。

## 关键规则与设计选择

1. 首次桌面授权（OAuth）用本机回环回调和 PKCE，长期刷新凭据存进密码中心并回读确认；网页不办理授权。

2. 采集程序拿不到长期凭据，只拿最长 1 小时的只读访问票，共 9 个只读权限；把整包凭据交给进程的旧方式代码仍兼容，但不是当前在用方式。

3. 三种时间限制分开：每张票 1 小时，凭据入口单次 4 小时，项目自己的看门狗 5 小时。

4. 按需和每 7 天两条路共用同一个刷新程序，跑完即停，不建立持续同步或后台监视。

5. 只有“请求数用完”或“临时票时间用完”、同一份清单、累计请求数确实增加三者同时成立才自动续跑；重新绑定、权限、验证失败、没有进展都停止，不换路。

## 当前怎样实现

- google_health_enroll.py 验证桌面回环客户端、授权地址、回调和只读权限；授权用 state 与 S256 PKCE，回调只监听 127.0.0.1 随机端口。

- 首次登记的凭据只通过标准输入交给凭据中介，并要求事务、恢复副本和回读全部闭合才算存好。

- google_health_refresh.py 是按需和定时共用的入口；每次调用凭据中介，合并输出上限 64KiB，由项目自己的看门狗限时；超时或中断用 taskkill /T /F 终止整棵进程树。

::screen{#personal-health-protected-foreground-refresh-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-06",
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
     "text_ref": "- 每 7 天的定时任务由 PCConfig 登记（不是采集程序自己建的），跑完写一份独立回执。",
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
     "text_ref": "- 每 7 天的定时任务由 PCConfig 登记（不是采集程序自己建的），跑完写一份独立回执。",
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

- 每 7 天的定时任务由 PCConfig 登记（不是采集程序自己建的），跑完写一份独立回执。

## 执行流程

1. 首次明确授权时读取桌面客户端配置，在本机回环完成授权并存入凭据中心、回读确认。

2. 之后由我当场或每 7 天的定时任务运行刷新。

3. 有上次已取回、未整理的结果就先在本机收尾；没有才向凭据中介要一张 1 小时只读临时票。

4. 同一清单因请求数或票时间用完而停、且累计请求数增加时，接着跑下一段。

5. 拿到合法的成功回执后进入离线核对；其他结果按具体错误停止。

::screen{#personal-health-protected-foreground-refresh-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-07",
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
| OAuth（账号授权协议） | 我明确允许应用以只读权限访问设备数据的标准流程。 |
| PKCE（授权码防截获校验） | 用一次性校验值绑定授权码交换，降低授权码被截获后复用的风险。 |
| Secret Broker（本机受保护凭据中介） | 保管长期凭据的唯一入口；现在只给采集程序发 1 小时只读临时票，网页不读取任何明文。 |
| 刷新（按需／每周） | 我当场发起的一次，或 PCConfig 登记的每 7 天定时任务；两者调用同一程序、跑完即停。 |

## 专业定义

更新可以由我当场发起，也可以由每 7 天的定时任务发起；每次都在一轮里跑完，长期凭据留在受保护位置，采集程序只拿短期只读票，不建立持续同步或后台监测。

::screen{#personal-health-protected-foreground-refresh-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-08",
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
     "type": "bullet_list",
     "text_ref": "- 网页不运行授权、凭据中介、采集程序或真实设备接口。",
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
     "type": "bullet_list",
     "text_ref": "- 网页不运行授权、凭据中介、采集程序或真实设备接口。",
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

解决令牌文件散落、凭据出现在命令行或输出里、后台同步扩权、重复授权、长期不更新，以及凭据入口失败后盲目重试。

## 边界

- 网页不运行授权、凭据中介、采集程序或真实设备接口。

- 任何授权文件、令牌、客户端密钥或凭据引用结果都不公开。

- 定时任务成功只说明那一轮采集、核对和简报做完，不说明结果已被采用，也不说明账号授权会一直有效。

- 刷新失败不切换浏览器、账号、数据提供方或备用凭据路线。

## 失败与恢复

- **授权权限不完整或刷新凭据有明确期限**：拒绝登记，不把短期访问冒充长期能力。

- **凭据中介要求重新绑定**：返回 runtime_rebind_required，本轮停止，不重试。

- **凭据中介拒绝**：只在标准错误输出里的合法拒绝回执保留它自己的无秘密错误码，但那不算成功；输出超限、格式不对、标准输出和错误输出混着来，都按失败处理，不进入离线核对。

- **看门狗超时或中断**：终止整棵进程树，关闭管道，不留后台子进程。

::screen{#personal-health-protected-foreground-refresh-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-health-protected-foreground-refresh-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 平时怎么回答",
    "href": "/projects/personal-health/current-evidence-route/"
   },
   {
    "text": "下一个模块 中断后继续",
    "href": "/projects/personal-health/raw-preservation-resume/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
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
     "text_ref": "- google_health_enroll.py　桌面授权、PKCE、标准输入传凭据、恢复副本和回读",
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
     "text_ref": "- google_health_enroll.py　桌面授权、PKCE、标准输入传凭据、恢复副本和回读",
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

- google_health_enroll.py　桌面授权、PKCE、标准输入传凭据、恢复副本和回读

- google_health_refresh.py　按需和每周共用入口、有进展的续跑、输出与超时边界

- tests/test_google_health_enroll.py　授权、只读权限、凭据传输和存储回归（现有 14 个测试函数）

- tests/test_google_health_refresh.py　入口、续跑例外、离线优先、重新绑定、输出、超时和进程树回归（现有 22 个测试函数）

## 如何验证

- 全项目现有 209 个测试函数，参数展开后 254 个测试用例（10 月 31 日静态计数，本次没有运行）。

- 9 月 14 日全套 140 项通过，是当时的历史记录，不代表今天又跑过。

- 已有真实采集的记录：定时任务 10 月 7 日那一轮正常完成；本次没有授权、取票或联网采集，所以现在账号能否连通仍不知道。

## 与其他模块的关系

它是唯一的凭据和联网入口；成功后把那份清单交给原始保全和离线核对模块，自己不解释健康。结果能不能用进当前认知，由健康项目审阅决定。
