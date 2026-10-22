---
{
 "title": "账单每月收一次，AI 自己去取",
 "kind": "project",
 "url": "/projects/personal-finance/bill-collection/",
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
  "page": "personal-finance-bill-collection",
  "kind": "project",
  "title": "账单每月收一次，AI 自己去取",
  "url": "/projects/personal-finance/bill-collection/",
  "parent": "personal-finance",
  "status_line": {
   "state": "待验收",
   "as_of": "2026-10-22",
   "source": "每月手册和提醒任务 10 月 21 日建成；提醒任务从未运行，第一次排在 11 月 6 日 09:00（10 月 22 日只读查看）"
  }
 },
 "source": {
  "page": "sources/pages/personal-finance-bill-collection/page.json",
  "sha256": "fffdcbc5379b9070255c26820209f64554d34addb774b8b408efc931c218e2df",
  "converted_at_beijing": "2026-10-22T09:26:41+08:00"
 }
}
---

::screen{#personal-finance-bill-collection-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-01",
  "section": "top",
  "title": "账单每月收一次，AI 自己去取",
  "links": [
   {
    "text": "回到项目 → 个人财务",
    "href": "/projects/personal-finance/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-finance/#ai-brief"
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
     "text_ref": "账单每月收一次，AI 自己去取",
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
       "text": "待验收",
       "state": "waiting"
      }
     ],
     "static_note": "截至 10 月 22 日 · 每月手册和提醒任务 10 月 21 日建成；提醒任务从未运行，第一次排在 11 月 6 日 09:00（10 月 22 日只读查看）",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人财务〕　〔复制 AI 续作说明〕",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "个人财务 · 功能说明",
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
     "text_ref": "账单每月收一次，AI 自己去取",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "待验收",
       "state": "waiting"
      }
     ],
     "static_note": "截至 10 月 22 日 · 每月手册和提醒任务 10 月 21 日建成；提醒任务从未运行，第一次排在 11 月 6 日 09:00（10 月 22 日只读查看）"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人财务〕　〔复制 AI 续作说明〕"
    },
    {
     "type": "prose",
     "text_ref": "个人财务 · 功能说明"
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
   "asset": "_library/illustrations/水流汇合.png",
   "semantic_status": "scene_explicit_primary_object",
   "key": "水流汇合",
   "source_phrase": "几条溪流从不同方向汇入一个小水池（不画字）：各家账单汇到一处。",
   "sha256": "101a6e8234c72d6ea3180ef0a1c34e92a9e0710fed25c6f164d6b71d5e786926",
   "status": "ready"
  }
 ]
}
```

# 账单每月收一次，AI 自己去取

〔回到项目 → 个人财务〕　〔复制 AI 续作说明〕

个人财务 · 功能说明

我每月只负责点导出、回一封信；取文件、核对、放好、导入都由 AI 做，缺哪家写清楚，不让一家拖住整轮。

**当前情况：**提醒任务 10 月 21 日已注册，还没正式发过一次；取回和导入的做法已写进每月手册和个人理解库的来源规则，还没完整跑过一轮月度更新。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-finance-bill-collection-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-02",
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

各家账单散在 App、邮箱和手机里，有的要申请、要等一天、还带解压码。我自己去收，总会漏一两家；漏了，这个月的花费就偏低，而且看不出来。

## 举个实际例子

（示例）6 号早上收到“导出日”邮件，我在支付宝申请交易流水、在微信支付下载账单、在银行 App 申请储蓄卡流水，回信写上解压码和几项余额。7 号说“开始月度总更新”，AI 把邮箱附件、手机下载目录里的账单、电脑下载目录里的电商订单表都取回来，核对后导入。

## 最后我会得到什么

一个按来源和批次日期分好的原件目录、一次增量导入，以及驾驶舱里一行当月回执：哪几家到了、哪家缺了、为什么。

## 结果怎么看

## 成功时

原件指纹核对过、已经导入：这个月的对账可以开始。

## 发现问题时

某家没到、解压失败或手机没连上：回执里写明缺哪家，其余来源照常往下走。

## 做不了时

资料锁着：先挂驾驶舱请我解锁，这一轮记“没做成”；我还没回信：能做的照做，最后挂一条请我补报。

::screen{#personal-finance-bill-collection-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-03",
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
     "text_ref": "1. **取回**　AI 从邮箱附件、手机 Download 目录、电脑下载目录拿到当月文件；要登录的网页在我已登录的 Chrome 后台标签页里操作。",
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
     "text_ref": "1. **取回**　AI 从邮箱附件、手机 Download 目录、电脑下载目录拿到当月文件；要登录的网页在我已登录的 Chrome 后台标签页里操作。",
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

6 号收到提醒邮件后点好导出；7 号跟 AI 说“开始月度总更新”。平时想补一次账单，也可以直接说“把这个月的账单取回来”。

## 需要准备什么

- 在各 App 点好导出：支付宝交易流水、微信支付账单、银行储蓄卡流水、银行信用卡账单、电商订单表、出行记录导出
- 回信里的解压码；没写的，AI 从手机通知或短信里读
- 手机开着无线调试（只有微信支付账单和出行导出需要）

## 从开始到拿到结果

1. **取回**　AI 从邮箱附件、手机 Download 目录、电脑下载目录拿到当月文件；要登录的网页在我已登录的 Chrome 后台标签页里操作。

2. **放好**　按来源和批次日期放进私有来源投递区，核对 SHA-256；手机副本两端一致后才删，电脑下载副本进回收站。

3. **导入**　个人理解库按原来源编号增量导入；电商订单和售后、外卖记录由 AI 用浏览器采集。

4. **交付与接续**　驾驶舱登记当月回执；缺的来源写明，下次补上后按同一来源编号接着导入。

::screen{#personal-finance-bill-collection-04 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-04",
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
     "type": "numbered_steps",
     "text_ref": "1. 不设 AI 自动开工的定时任务：6 号只提醒，7 号由我开口（本人 10 月 21 日 15:17 定）。",
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
     "text_ref": "1. 不设 AI 自动开工的定时任务：6 号只提醒，7 号由我开口（本人 10 月 21 日 15:17 定）。",
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

**10 月 22 日核对**　计划任务 PCConfig Monthly Export Reminder 状态 Ready、从未运行，下次运行折合北京时间 11 月 6 日 09:00。提醒脚本的测试 tools/monthly_export_reminder.test.ps1 只测 -DryRun 渲染，这次没有运行。

## 关键规则与设计选择

1. 不设 AI 自动开工的定时任务：6 号只提醒，7 号由我开口（本人 10 月 21 日 15:17 定）。

2. 一次做完：开工后不为每一步找我确认，要我补的集中问一次或挂驾驶舱。

3. 一次性解压码只在本轮用，不写进文件、日志或回执。

4. 缺一家不阻塞其余来源。

5. 账单文件取回后不留在手机：两端 SHA-256 一致才删手机副本。

## 当前怎样实现

- PCConfig tools/Send-MonthlyExportReminder.ps1：经已绑定的 Google 账号给本人发信，并登记驾驶舱待办；-DryRun、-WhatIf 只把邮件渲染到文件，不发送、不写回执。

- registries/monthly_export_checklist.json：导出清单（各项账单，外加一项 AI 对话导出）和回信模板；templates/monthly-export-reminder.html 是邮件样式。

- tools/Register-MonthlyExportReminderTask.ps1 -Execute -Json 注册任务：短锁、XML 备份和回滚、完整回读；运行时刻按北京时间 6 号 09:00 换算成本机日期。

::screen{#personal-finance-bill-collection-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-05",
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
     "text_ref": "- 发送前检查个人资料期；同月已是 sent、sending 或 unknown 就不重发，文件锁阻止并发发送。",
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
     "text_ref": "- 发送前检查个人资料期；同月已是 sent、sending 或 unknown 就不重发，文件锁阻止并发发送。",
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

- 发送前检查个人资料期；同月已是 sent、sending 或 unknown 就不重发，文件锁阻止并发发送。

- 退出码：0 表示邮件和待办都已确认，3 表示资料锁，2 表示待核实或失败；回执格式 pcconfig.monthly-export-reminder.v1。sent 只证明 Gmail 收下了，不证明我看到了。

- 取回规则写在个人理解库 docs/source-rules.md；手机取回按 phone-direct 技能的 pull --delete-after-verify，没连上时 ensure --unattended，驾驶舱挂“手机连一下”。

- 月度回执用 Set-OwnerItem.ps1 -Mode Add -Kind know 在驾驶舱登记一行，下个月总更新时退场，不另写文件。

## 执行流程

1. 读 6 号提醒的回信。

2. 取回人工快照，放进投递区并核对指纹。

3. 刷新理解库已接入的来源（含电商订单和售后）。

4. 查重复扣款。

5. 理解库读进本月新材料。

6. 更新各个人项目，其中本项目改余额快照、月均、跑道和应收应付。

7. 收尾：关闭当月待办、登记回执、各仓库提交、清理临时文件。

::screen{#personal-finance-bill-collection-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-06",
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
| 人工快照 | 要我在 App 里点导出才拿得到的账单文件 |
| 来源投递区 | 个人资料目录下按来源、批次日期放原件的地方，不进 Git |
| 增量导入 | 按原来源编号只导入新内容；同一份文件按内容指纹认出，不重复 |
| 驾驶舱回执 | 驾驶舱里一行“这个月更新了什么、缺什么” |

## 专业定义

人工快照只证明“当月拿到了这份文件”，不证明它覆盖了全部消费；覆盖缺口写进回执，在对账时继续保留。

::screen{#personal-finance-bill-collection-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-07",
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
     "text_ref": "- 不登录银行或支付平台，不读密码明文。",
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
     "text_ref": "- 不登录银行或支付平台，不读密码明文。",
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

解决账单收不齐、手机里留一堆账单副本、解压码到处散落，以及缺一家就整轮卡住。

## 边界

- 不登录银行或支付平台，不读密码明文。

- 只收我导出的文件，不建自动采集或常驻同步。

- 提醒发出不等于我看到了，也不等于导出已完成。

## 失败与恢复

- **提醒没发出**：回执写 blocked（资料锁）或 failed；同月已发不重发，待核实的不自动重发

- **某家没导出**：回执写缺哪家，下次补上用原来源编号接着导入

- **手机没连上**：驾驶舱挂“手机连一下”，先做其余来源

- **解压码不对**：问我一次，不反复猜

::screen{#personal-finance-bill-collection-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-bill-collection-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 对账",
    "href": "/projects/personal-finance/reconciliation/"
   },
   {
    "text": "对账",
    "href": "/projects/personal-finance/reconciliation/"
   },
   {
    "text": "月度报数",
    "href": "/projects/personal-finance/monthly-report/"
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
     "text_ref": "- PCConfig docs/runtime/monthly-personal-update-runbook.md　每月总更新手册",
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
     "text_ref": "- PCConfig docs/runtime/monthly-personal-update-runbook.md　每月总更新手册",
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

- PCConfig docs/runtime/monthly-personal-update-runbook.md　每月总更新手册

- PCConfig tools/Send-MonthlyExportReminder.ps1、registries/monthly_export_checklist.json　提醒邮件和回信模板

- 个人理解库 docs/source-rules.md　各来源的取回和导入规则

## 如何验证

- 提醒：-DryRun 渲染样例；正式运行看任务的上次结果和回执状态。

- 取回：投递区每个批次的 SHA-256 和导入结果对得上。

- 第一次正式提醒在 11 月 6 日；在那之前没有真实运行记录。

## 与其他模块的关系

取回并导入后交给〔对账〕；对账结果和我的回信一起进〔月度报数〕。
