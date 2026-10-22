---
{
 "title": "先分清消费和还款，再算花了多少",
 "kind": "project",
 "url": "/projects/personal-finance/reconciliation/",
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
  "page": "personal-finance-reconciliation",
  "kind": "project",
  "title": "先分清消费和还款，再算花了多少",
  "url": "/projects/personal-finance/reconciliation/",
  "parent": "personal-finance",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-22",
   "source": "理解库消费统计程序最后变更北京 10 月 21 日 17:51，当天用于重算月均；10 月 22 日只读核对，没有重跑测试"
  }
 },
 "source": {
  "page": "sources/pages/personal-finance-reconciliation/page.json",
  "sha256": "e8f8a81b7704b0a373553f7d4afdbfc3d215ddd85ccfe9384261e52ba921d69e",
  "converted_at_beijing": "2026-10-22T08:32:33+08:00"
 }
}
---

::screen{#personal-finance-reconciliation-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-01",
  "section": "top",
  "title": "先分清消费和还款，再算花了多少",
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
     "text_ref": "先分清消费和还款，再算花了多少",
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
     "static_note": "截至 10 月 22 日 · 理解库消费统计程序最后变更北京 10 月 21 日 17:51，当天用于重算月均；10 月 22 日只读核对，没有重跑测试",
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
     "text_ref": "先分清消费和还款，再算花了多少",
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
     "static_note": "截至 10 月 22 日 · 理解库消费统计程序最后变更北京 10 月 21 日 17:51，当天用于重算月均；10 月 22 日只读核对，没有重跑测试"
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
   "asset": "_library/illustrations/购物退款.png",
   "semantic_status": "scene_explicit_primary_object",
   "key": "购物退款",
   "source_phrase": "一个绿色购物袋旁边一张空白退款单（不画字）：订单、支付和退款对成一笔。",
   "sha256": "4de62e8a3415e96a8b8a6d8fd62e8b554c31777decc10068955b2f6f3665771c",
   "status": "ready"
  }
 ]
}
```

# 先分清消费和还款，再算花了多少

〔回到项目 → 个人财务〕　〔复制 AI 续作说明〕

个人财务 · 功能说明

我在意的是“真花掉了多少”，不是“钱进进出出了多少”。同一笔钱在几个账单里出现好几次，只算一次；还款和倒钱不算花。

**当前情况：**消费统计在个人理解库里实现，有专项自动测试；10 月 21 日储蓄卡流水分类和美元结算核对已用于重算月均消费。重复扣款由程序先列出疑似，AI 再逐条核对。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-finance-reconciliation-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-02",
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
     "columns": 1,
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

同一笔钱在账单里会出现好几次：支付宝付一次、信用卡记一次，月底还信用卡又出现一次，退款再回来一次。直接加起来会多算；只看一个来源，又会漏掉先用后付和储蓄卡直接扣的。

## 举个实际例子

（示例）在电商平台用支付宝绑的信用卡买了件东西，后来退了一部分。支付宝、信用卡账单、电商订单里各有一条，月底还款又有一条。对完只剩一笔消费：实付减成功退款；还款那条不算；三条记录合成一笔，不重复。

（示例）上个月买的东西，这个月才退货到账。退款算回买它的那个月：上个月的消费净额被这笔已确认的退款改小，这个月不会冒出一笔“负的消费”。这个月实际收进的那笔退款另记在“期间资金流”里，用来对照银行卡和钱包当月的真实进出。月均消费和现金跑道只用前一种，按买东西的月份算。

（示例）在某家店充了储值卡或买了购物金。钱确实付出去了，但这时还没买到任何东西，所以它不进消费净额，单列成“商户预付”；它也不是能马上取出来花的钱，不算进余额。普通订阅、游戏或 AI 服务的充值，以及别人替我代充值的服务，照样算消费，不因为带“充值”两个字就排除。

## 最后我会得到什么

按月、按币种的消费净额，加上单列的“待归并”和“币种不明”金额，单列的“商户预付”，按收付日期另记的“期间资金流”，以及一句覆盖说明：哪些算进去了、哪些没算、为什么。

## 结果怎么看

## 成功时

对清的进消费净额，附覆盖说明。

## 发现问题时

证据不够合并的放进待归并，不算也不丢；真的重复扣款挂驾驶舱请我处理。

## 做不了时

某个来源这个月缺了：结果只叫“已识别小计”，不说成全部花费。

::screen{#personal-finance-reconciliation-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-03",
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
     "text_ref": "1. **归并同一笔**　订单、支付、信用卡记录按订单号、商户和品名对上，不只看日期和金额；拿不准的留成候选，不强行合并。",
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
     "text_ref": "1. **归并同一笔**　订单、支付、信用卡记录按订单号、商户和品名对上，不只看日期和金额；拿不准的留成候选，不强行合并。",
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

月度总更新导入完成后接着做；平时问“这个月实际花了多少”“上个月比这个月多花在哪”也走这一步。

## 需要准备什么

- 已导入的账单和订单（见〔账单每月收一次〕）
- 要看的日期区间；不说就按完整自然月

## 从开始到拿到结果

1. **归并同一笔**　订单、支付、信用卡记录按订单号、商户和品名对上，不只看日期和金额；拿不准的留成候选，不强行合并。

2. **分出不是消费的**　信用卡还款、先用后付还款、转到自己的账户、收入和退款单独分开。

3. **扣退款**　同一交易链的成功退款，从买东西那个月的消费里扣掉，跨月退货也回扣到购买月；外币退款按实际退回的人民币扣。退款到账那天另记进期间资金流；不知道哪天到账的，不替它编一个日期。

4. **交付与接续**　按币种出消费净额，附商户预付、期间资金流、待归并、币种不明和覆盖说明；发现重复扣款挂驾驶舱。

::screen{#personal-finance-reconciliation-04 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-04",
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
     "text_ref": "1. 还款和本人转账不是消费，也不和原来那笔消费重复算。",
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
     "text_ref": "1. 还款和本人转账不是消费，也不和原来那笔消费重复算。",
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

**10 月 22 日核对**　实现都在个人理解库（另一个私有仓库，相关程序最后变更在北京 10 月 22 日 07:19）：spending.py 的 aggregate_spending、debit_sources.py 的 classify_debit、commerce_records.py（订单与售后状态）、gmail_sources.py（信用卡月单和每日通知邮件）。tests/test_spending.py 是专项测试，只用合成数据（这次没有运行）。

## 关键规则与设计选择

1. 还款和本人转账不是消费，也不和原来那笔消费重复算。

2. 订单只证明买过；支付宝、微信、信用卡和同一订单可靠对上时只作支付旁证，不重复计。没有详细订单的有效支付照样算消费。

3. 同日同额不自动合并；候选和金额冲突都保留。

4. 不同币种不相加；币种不明单列。

5. 替我代付、代充值买的服务照样算消费；几块钱的零碎不追，不影响结论。

## 当前怎样实现

- aggregate_spending 把同一笔消费的订单、支付、卡记录归成一组（并查集）；只有候选关联的不强行合并。

- _notice_matches_statement 把信用卡每日通知和月单对上：同一张卡、同一商户、同金额或原币金额一致；外币时日期可差一天。

- _duplicate_charge_alerts 找疑似重复扣款，结果放在 duplicate_charges：同一商户、同一币种、扣掉已关联退款后还剩同样金额的几笔独立扣款才列出；分期、预授权、冲正、撤销、失败、取消、关闭的不列，退款状态说不清的不列，商户只写成支付宝、微信支付这类泛称的也不列。它只提示，不改任何一笔的消费归属；列出来的由 AI 逐条核对，真重复才挂驾驶舱。

- classify_debit 把储蓄卡流水分成本人操作、还款借贷、收入、退款、消费五类，按配置的还款关键词和本人名称判断。

::screen{#personal-finance-reconciliation-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-05",
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
     "text_ref": "- 输出字段：按币种的 consumption_net；total_interpretation 默认是“已识别消费小计，不含待归并和商户预付”；uncertainty 写候选组数和是否证明完整；unresolved_amounts、unknown_currency_amounts 单列。",
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
     "text_ref": "- 输出字段：按币种的 consumption_net；total_interpretation 默认是“已识别消费小计，不含待归并和商户预付”；uncertainty 写候选组数和是否证明完整；unresolved_amounts、unknown_currency_amounts 单列。",
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

- 输出字段：按币种的 consumption_net；total_interpretation 默认是“已识别消费小计，不含待归并和商户预付”；uncertainty 写候选组数和是否证明完整；unresolved_amounts、unknown_currency_amounts 单列。

- 两套日期口径：consumption_net 按购买归属记账，日期取这一笔最早的付款或订单时间，已关联的成功退款（含跨月退款）在这一笔里扣掉；observed_flow_net 是期间资金流，付款按付款时间加、退款按退款时间减。退款没有真实时间的，不进资金流，也不补造日期。personal-finance 的月均和跑道只取 consumption_net（AGENTS.md 指定）。

- 只有本人确认账本基本覆盖、又没有待归并和币种不明时，total_interpretation 才改成“扣退款后的消费净额”。

- 商户预付：品名里明确写着购物金、储值卡、储值金、储值余额、储值充值或预付余额的，单列 merchant_prepayment_net（另有 merchant_prepayment_gross 和 merchant_prepayment_refunds），不进 consumption_net；付款仍记进期间资金流。merchant_prepayment_net 是本期购买的预付扣掉已关联退款，不等于商户那边的余额净增；找不到原购买的预付退款另列 unattributed_merchant_prepayment_refunds。普通 AI、游戏、通信充值不凭“充值”二字排除。personal-finance 把商户储值排除在可动用余额之外。

- 命令：daily_preferences.py spending --from --to --as-of --group-by month --json（--to 不含当天）。

## 执行流程

1. 读区间内全部已导入记录。

2. 规范化金额、币种和角色。

3. 归并同一笔。

4. 剔除还款与本人转账；把明确的商户预付单列。

5. 扣关联退款，按购买归属记进消费净额；付款和退款再按各自时间记进期间资金流。

6. 输出净额、待归并和覆盖说明。

7. 程序列出疑似重复扣款（duplicate_charges），AI 按来源规则逐条核对。

::screen{#personal-finance-reconciliation-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-06",
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
| 消费净额 | 实付减去同一交易链的成功退款 |
| 待归并 | 可能是同一笔、但证据不够合并的记录，单列不算 |
| 本人操作 | 在自己的账户和钱包之间倒钱 |
| 先用后付 | 花呗、电商平台自带的那一类；还它不是新消费 |
| 重复扣款 | 同一订单真被扣了两次；钱包和信用卡各记一次、分期、预授权、退款冲正都不算 |

## 专业定义

消费净额是已识别的小计；覆盖不全时，它是下限的一种说法，不是全部花费。

::screen{#personal-finance-reconciliation-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-07",
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
     "text_ref": "- 网页上不放任何金额、商家或账单条目。",
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
     "text_ref": "- 网页上不放任何金额、商家或账单条目。",
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

解决还款被算成消费、退款没扣、跨平台重复算、外币按错金额、先用后付的消费漏掉。

## 边界

- 网页上不放任何金额、商家或账单条目。

- 不从消费倒推余额。

- 订单和支付只证明钱的事实；偏好由个人理解库另按规则判断，退款单不拿来猜喜好。

## 失败与恢复

- **关联不确定**：待归并单列，等更多来源再归

- **币种不明**：单列，不相加

- **退款状态不明**：先核订单最终状态；没证据写待核

- **真的重复扣款**：挂驾驶舱“需要你”；分期、预授权、冲正不提

::screen{#personal-finance-reconciliation-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-finance-reconciliation-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 账单每月收一次",
    "href": "/projects/personal-finance/bill-collection/"
   },
   {
    "text": "下一个模块 月度报数",
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
     "text_ref": "- 个人理解库 spending.py、debit_sources.py、commerce_records.py、gmail_sources.py　消费统计、储蓄卡分类、订单与售后、信用卡邮件",
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
     "text_ref": "- 个人理解库 spending.py、debit_sources.py、commerce_records.py、gmail_sources.py　消费统计、储蓄卡分类、订单与售后、信用卡邮件",
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

- 个人理解库 spending.py、debit_sources.py、commerce_records.py、gmail_sources.py　消费统计、储蓄卡分类、订单与售后、信用卡邮件

- tests/test_spending.py　跨月退款、日报让位月单、外币日期相邻、同日同额不合并、未知币种不相加、还款与重复行、重复扣款候选（专项测试，只用合成数据）

- 个人理解库 docs/source-rules.md　重复扣款、先用后付、储蓄卡五类和交叉核对规则

## 如何验证

- 测试只用合成数据，不碰真实账单。

- 真实月度结果靠覆盖说明和驾驶舱回执核对；这次没有重跑测试。

## 与其他模块的关系

输入来自〔账单每月收一次〕；输出的月度消费净额进〔月度报数〕算月均和跑道。
