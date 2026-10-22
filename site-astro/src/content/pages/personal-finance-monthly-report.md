---
{
 "title": "月度报数：先问清楚，再算能撑多久",
 "kind": "project",
 "url": "/projects/personal-finance/monthly-report/",
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
  "page": "personal-finance-monthly-report",
  "kind": "project",
  "title": "月度报数：先问清楚，再算能撑多久",
  "url": "/projects/personal-finance/monthly-report/",
  "parent": "personal-finance",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-22",
   "source": "财务私有仓库最近提交北京 10 月 21 日 17:58；10 月 22 日只读核对规则，没有读出任何金额"
  }
 },
 "source": {
  "page": "sources/pages/personal-finance-monthly-report/page.json",
  "sha256": "dc02b53ca97eeb945e6e42e6f1914f1f9f5624137b72ac641072e179afcc9957",
  "converted_at_beijing": "2026-10-22T09:26:43+08:00"
 }
}
---

::screen{#personal-finance-monthly-report-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-01",
  "section": "top",
  "title": "月度报数：先问清楚，再算能撑多久",
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
     "text_ref": "月度报数：先问清楚，再算能撑多久",
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
     "static_note": "截至 10 月 22 日 · 财务私有仓库最近提交北京 10 月 21 日 17:58；10 月 22 日只读核对规则，没有读出任何金额",
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
     "text_ref": "月度报数：先问清楚，再算能撑多久",
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
     "static_note": "截至 10 月 22 日 · 财务私有仓库最近提交北京 10 月 21 日 17:58；10 月 22 日只读核对规则，没有读出任何金额"
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
   "asset": "_library/module-illustrations/personal-finance/monthly-report-v01.png",
   "semantic_status": "scene_explicit_primary_object",
   "key": "monthly-report",
   "source_phrase": "模块首屏插画（待生成）：白底水彩，纯绿主色。一本翻开的小账册，左页只有灰色横线，右页一个空白的小日历；账册旁一只绿色存钱罐和一个沙漏，存钱罐上方一个绿色对话气泡（气泡里不写字）。不画任何数字、货币符号、表格、银行或商家标志、文字和人脸。",
   "sha256": "5c72d158370afa5f2dc17cef177d3a8a405e4c374f9b3cedb888e32d480876cf",
   "status": "ready"
  }
 ]
}
```

# 月度报数：先问清楚，再算能撑多久

〔回到项目 → 个人财务〕　〔复制 AI 续作说明〕

个人财务 · 功能说明

不靠一张卡的余额猜家底。几项算不出来的数每月直接问我，算得出来的 AI 先核，不让我重报。

**当前情况：**项目 10 月 20 日建立，10 月 21 日写出第一份余额快照和新的报数格式；还没经历一次完整的月度更新。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-finance-monthly-report-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-02",
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

只看一张储蓄卡，看不到别处的钱和在途的钱，也看不到信用卡和先用后付的全部欠款；拿它算“还能撑多久”，结论会差很远。

## 举个实际例子

（示例）我问“按现在的花法，手头的钱能撑几个月？”AI 读财务现状：能马上用的钱加上在途的，减掉全部欠款，再除以最近三个完整月的月均消费；同时把“下个月要还的”和“手头能马上用的”比一比。哪一项没报，就写待报，不给月数。

## 最后我会得到什么

一份带快照日、币种和出处的财务现状：余额快照、月均消费、现金跑道、下个月压力、应收应付和“下一次要补齐什么”。

## 结果怎么看

## 成功时

每个数注明是我报的、账单推算的，还是 AI 推算的。

## 发现问题时

两个来源说法不一样：两边都记下、写出处，问我一次，不挑一个。

## 做不了时

余额或欠款未知：写“待本人报数”，不报能撑几个月。

::screen{#personal-finance-monthly-report-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-03",
  "section": "usage",
  "title": "从哪里开始",
  "links": [
   {
    "text": "对账",
    "href": "/projects/personal-finance/reconciliation/"
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
     "text_ref": "1. **先核能核的**　账单上能确定的数 AI 先核，不让我重报。",
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
     "text_ref": "1. **先核能核的**　账单上能确定的数 AI 先核，不让我重报。",
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

7 号月度更新时一起做；平时也可以随时报一个新数，比如“信用卡这期已经还了”。

## 需要准备什么

- 回信里的报数：资产合计和其中不能马上取的部分；信用卡、花呗、电商先用后付各自的全部欠款和下个月要还；在途资金；潜在未来资金
- 个人理解库最近三个完整月的消费净额（见〔对账〕）
- 有投资账户的话，在回信里附持仓截图：AI 据此算出持仓市值和杠杆倍数，写进现状，只陈述，不给买卖建议

## 从开始到拿到结果

1. **先核能核的**　账单上能确定的数 AI 先核，不让我重报。

2. **算月均**　最近三个完整自然月的消费净额合计除以 3，币种分开。

3. **算跑道和下月压力**　（能马上用 + 在途 − 全部欠款）÷ 月均消费；另看下个月要还的和手头能马上用的。商户储值和购物金不算能马上用的钱，信用额度和没到账的应收也不算。

4. **交付与接续**　只改财务现状受影响的段落，记日期和出处；未知项写进“下一次补齐”。

::screen{#personal-finance-monthly-report-04 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-04",
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
     "text_ref": "1. 可动用余额只算当时就能取的本人资金；信用额度、商户储值、没到账的应收都不算。",
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
     "text_ref": "1. 可动用余额只算当时就能取的本人资金；信用额度、商户储值、没到账的应收都不算。",
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

**10 月 22 日核对**　私有仓库 wlyaaaaa/personal-finance，默认分支 main，最新提交 45254b3（北京 10 月 22 日 07:13）；只入库 AGENTS.md 和 CURRENT.md，没有程序和测试。技能 personal-finance 10 月 22 日早上已装进 AI 的技能发现目录：问到余额快照、现金跑道、应收应付、信用卡欠款和财务规划时，AI 会按技能找到这里。

## 关键规则与设计选择

1. 可动用余额只算当时就能取的本人资金；信用额度、商户储值、没到账的应收都不算。

2. 负债另列；不把信用卡剩余额度当资产；同一笔钱不重复加减。

3. 现金跑道（月）＝（可动用余额 ＋ 在途资金 − 全部欠款）÷ 近三个月月均净消费：分期迟早要从这笔钱里还，所以全部欠款都减；分母只算消费、不含还款，分期不重复扣；潜在未来资金单列，不计入。

4. 月均消费不为正、月份缺失或余额未知时，不报月数；缺记录不填零。

5. 应收应付每条记对象、方向、状态、日期和出处；到账并入新快照后不再加一次。

6. 投资账户按回信附的持仓截图算市值和杠杆倍数，只陈述，不给买卖建议；截图和结果都不上网页。

## 当前怎样实现

- 全部由 AI 按 AGENTS.md 手工更新 CURRENT.md：余额快照、现金跑道、应收应付、下一次补齐、来源五节；只改受影响的段落。

- 月均消费只读调用个人理解库 spending 的 consumption_net，保留 total_interpretation 和 uncertainty；不复制逐笔交易、不另写聚合器。

- 持仓截图是 6 号提醒回信模板的最后一项（registries/monthly_export_checklist.json）；每月手册第 6 步由 AI 读图算市值和杠杆倍数，写进 CURRENT.md。没有专门程序；没附截图或读不清时，这一项写未知，不沿用旧数。

- 读之前先按 PCConfig docs/runtime/personal-data-access.md 的无代码项目入口查个人资料锁。

::screen{#personal-finance-monthly-report-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-05",
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
     "text_ref": "- 跑道口径在规则 AGENTS.md、技能说明和财务现状里一致：（可动用余额 ＋ 在途资金 − 全部欠款）÷ 近三个月月均净消费，潜在未来资金不计入（规则 10 月 22 日对齐，提交 03c092f）。",
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
     "text_ref": "- 跑道口径在规则 AGENTS.md、技能说明和财务现状里一致：（可动用余额 ＋ 在途资金 − 全部欠款）÷ 近三个月月均净消费，潜在未来资金不计入（规则 10 月 22 日对齐，提交 03c092f）。",
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

- 跑道口径在规则 AGENTS.md、技能说明和财务现状里一致：（可动用余额 ＋ 在途资金 − 全部欠款）÷ 近三个月月均净消费，潜在未来资金不计入（规则 10 月 22 日对齐，提交 03c092f）。

- 逐笔对账的中间结果不在任何仓库里，事后没法回查某次对账是怎么归并的。

- 共同的本人背景按个人理解库 DOMAIN_CONTRACT.md 按需取用；余额、债务和财务判断只留在本项目。

## 执行流程

1. 过个人资料锁。

2. 读本人回信和已收账单。

3. 从理解库取近三个完整月消费净额。

4. 核余额、欠款和在途，分清我报的和账单推算的。

5. 算跑道和下月压力；不满足条件就不报月数。

6. 改 CURRENT.md 受影响段落，提交私有仓库。

7. 驾驶舱登记当月回执。

::screen{#personal-finance-monthly-report-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-06",
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
| 余额快照 | 某一天各类资金和欠款的数，注明是我报的还是账单推算 |
| 能马上用 | 当天就能取出来花的本人资金 |
| 在途资金 | 已经付出或应到、但还没到账的钱 |
| 潜在未来资金 | 可能会有、但还不确定的钱，单列不进跑道 |
| 现金跑道 | 按现在的花法，手头的钱扣掉全部欠款后能撑几个月 |
| 下月压力 | 下个月要还的钱和手头能马上用的钱比一比 |

## 专业定义

跑道只是按最近三个月花法的推算，不是预测；任何一项未知，就不给月数。

::screen{#personal-finance-monthly-report-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-07",
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
     "text_ref": "- 不给投资买卖建议，不预测收入。",
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
     "text_ref": "- 不给投资买卖建议，不预测收入。",
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

解决拿一张卡的余额当家底、把信用额度当钱、未知当零、旧账单当现在的欠款。

## 边界

- 不给投资买卖建议，不预测收入。

- 不登录银行和支付平台。

- 网页上不放任何金额、余额或账单。

## 失败与恢复

- **没回信**：能做的照做，驾驶舱挂一条请我补报

- **两个来源说法不一样**：两边都记、写出处，问我一次

- **余额未知**：写待本人报数，不报月数

- **售后退款没证据**：写待核，不当成应收

::screen{#personal-finance-monthly-report-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-monthly-report-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 对账",
    "href": "/projects/personal-finance/reconciliation/"
   },
   {
    "text": "对账",
    "href": "/projects/personal-finance/reconciliation/"
   },
   {
    "text": "账单每月收一次",
    "href": "/projects/personal-finance/bill-collection/"
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
     "text_ref": "- wlyaaaaa/personal-finance AGENTS.md　口径和规则",
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
     "text_ref": "- wlyaaaaa/personal-finance AGENTS.md　口径和规则",
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

- wlyaaaaa/personal-finance AGENTS.md　口径和规则

- wlyaaaaa/personal-finance CURRENT.md　财务现状（不公开）

- 规则源码仓库 skills/personal-finance/SKILL.md　技能说明（10 月 22 日早上已装进技能发现目录）

- PCConfig 每月手册第 6 步　月度更新本项目时做什么

## 如何验证

- 本项目没有自动测试；每次更新核对：每个数有日期、币种、出处，未知、事实、推算和 AI 建议分开。

## 与其他模块的关系

月均消费来自〔对账〕；需要的回信和账单来自〔账单每月收一次〕。
