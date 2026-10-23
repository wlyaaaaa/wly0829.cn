---
{
 "title": "用一句自然问题，只取会改变这次选择的证据",
 "kind": "project",
 "url": "/projects/daily-preferences/evidence-query/",
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
  "page": "daily-preferences-evidence-query",
  "kind": "project",
  "title": "用一句自然问题，只取会改变这次选择的证据",
  "url": "/projects/daily-preferences/evidence-query/",
  "parent": "daily-preferences",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "来源仓库现为 4717320（北京 10/22 07:22）；实现说明沿用 b51db6d8（北京 10/19 23:40）的定位读取规则与 b334b3aa（北京 10/8 00:23）；10/11 16:35–16:39 只读 activity、device-inventory、status；10/22 06:47–06:48 另读来源类别数、Collector 事件条数与已存时期（各自注明）；本次没有新采集、没有连接手机或调用高德，历史验收保留原日期"
  }
 },
 "source": {
  "page": "sources/pages/daily-preferences-evidence-query/page.json",
  "sha256": "37cd319ba053906920415200f0fe56f6bc0d9318df58115724dee9cce74b656c",
  "converted_at_beijing": "2026-10-23T08:44:35+08:00"
 }
}
---

::screen{#daily-preferences-evidence-query-01 section="top"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-01",
  "section": "top",
  "title": "用一句自然问题，只取会改变这次选择的证据",
  "links": [
   {
    "text": "回到项目 → 个人理解库",
    "href": "/projects/daily-preferences/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/daily-preferences/#ai-brief"
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
     "text_ref": "用一句自然问题，只取会改变这次选择的证据",
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
     "static_note": "截至 10 月 11 日 · 来源仓库现为 4717320（北京 10/22 07:22）；实现说明沿用 b51db6d8（北京 10/19 23:40）的定位读取规则与 b334b3aa（北京 10/8 00:23）；10/11 16:35–16:39 只读 activity、device-inventory、status；10/22 06:47–06:48 另读来源类别数、Collector 事件条数与已存时期（各自注明）；本次没有新采集、没有连接手机或调用高德，历史验收保留原日期",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人理解库〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "让 AI 看见足够的连续性，而不是被整库订单、付款和聊天淹没。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已能按问题组合已接入来源，双设备期间活动、手机安装清单和GPS期间有专门只读入口。手机使用现在来自 Collector 采集器：完整的北京日可信，只采到一部分的日子只报已看到的部分；旧 AppUsage 已退役，它所有时期的时长都不再采信。",
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
     "text_ref": "用一句自然问题，只取会改变这次选择的证据",
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
     "static_note": "截至 10 月 11 日 · 来源仓库现为 4717320（北京 10/22 07:22）；实现说明沿用 b51db6d8（北京 10/19 23:40）的定位读取规则与 b334b3aa（北京 10/8 00:23）；10/11 16:35–16:39 只读 activity、device-inventory、status；10/22 06:47–06:48 另读来源类别数、Collector 事件条数与已存时期（各自注明）；本次没有新采集、没有连接手机或调用高德，历史验收保留原日期"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人理解库〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "让 AI 看见足够的连续性，而不是被整库订单、付款和聊天淹没。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已能按问题组合已接入来源，双设备期间活动、手机安装清单和GPS期间有专门只读入口。手机使用现在来自 Collector 采集器：完整的北京日可信，只采到一部分的日子只报已看到的部分；旧 AppUsage 已退役，它所有时期的时长都不再采信。"
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
   "asset": "_library/illustrations/modules/daily-preferences/evidence-query/evidence-query-v01.png",
   "key": "main-daily-preferences",
   "source_phrase": "右上一幅水彩插画：书桌上一只打开的木质卡片盒，里面竖着一排索引卡，每张卡顶上一个小绿色标签，卡面只画浅灰短线、不画字；几条细细的绿色虚线从卡片盒外飘进来，线头分别是一个聊天气泡、一只购物袋、一张小票、一个定位针、一部手机、一个游戏手柄、一个音符的小水彩图标；一支铅笔斜靠在最前面那张卡上，卡上一道短线被划掉、旁边写上了一道新的短线（表示更正，仍然只画线不画字）。",
   "sha256": "ad2e14054dc8746e688206b1f2d8ba201e897786d4d5d150723bf0b754cbedf3",
   "status": "ready"
  }
 ]
}
```

# 用一句自然问题，只取会改变这次选择的证据

〔回到项目 → 个人理解库〕　〔复制 AI 续作说明〕

个人理解库 · 功能说明

让 AI 看见足够的连续性，而不是被整库订单、付款和聊天淹没。

**当前情况：**已能按问题组合已接入来源，双设备期间活动、手机安装清单和GPS期间有专门只读入口。手机使用现在来自 Collector 采集器：完整的北京日可信，只采到一部分的日子只报已看到的部分；旧 AppUsage 已退役，它所有时期的时长都不再采信。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#daily-preferences-evidence-query-02 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 只看最前几个命中可能漏掉不同口味或来源；把整库记录都塞进晚餐问题，又会让无关历史压过真正相关的依据。 举个实际例子 我可以问：“最近一周手机和电脑分别用了些什么？每天有什么变化？”系统按我实际"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 只看最前几个命中可能漏掉不同口味或来源；把整库记录都塞进晚餐问题，又会让无关历史压过真正相关的依据。 举个实际例子 我可以问：“最近一周手机和电脑分别用了些什么？每天有什么变化？”系统按我实际"
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

只看最前几个命中可能漏掉不同口味或来源；把整库记录都塞进晚餐问题，又会让无关历史压过真正相关的依据。

## 举个实际例子

我可以问：“最近一周手机和电脑分别用了些什么？每天有什么变化？”系统按我实际所问区间给两台设备各自的覆盖、每天与主要应用，并说明缺失和异常：手机哪几天是 Collector 完整采到的、哪几天只采到一部分，旧 AppUsage 时长不拿来排行。它不会只给第一天，也不会把两台设备时长相加成我的净注意力。

## 最后我会得到什么

得到当前问题所需的事实、现行认识和出处：设备问题分设备与日期，软件问题给最新那份安装清单和它的采集时点，出行问题给有据停留、移动和空档。兴趣与选择问题再由AI区分行为、本人明示和推测；范围不全时明确尚缺什么。

::screen{#daily-preferences-evidence-query-03 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-03",
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
     "text_ref": "已取得相关证据",
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
     "text_ref": "已取得相关证据",
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

## 已取得相关证据

按这次主题取相关表达、仍有效的认识和来源事实；按设备或期间问题覆盖整个所问范围，说明仍有多少未展示。

## 覆盖仍有边界

某类来源覆盖不足、手机某天只采到一部分、GPS有空档时只给可复核事实；旧 AppUsage 时长全部不采信。不把有限命中、异常值或本人解释改写成全历史测量。

## 证据入口不可用

个人资料锁着时先由主对话请我验证，不用旧背景凑；已解锁而记录暂不可读时说明缺口，仍可根据本轮真实表达给临时建议，不编造旧偏好。

::screen{#daily-preferences-evidence-query-04 section="usage"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-04",
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
     "text_ref": "直接问某项经历、兴趣、手机/电脑使用、安装软件或出行事实；可给实际时间范围和想限定的来源。",
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
     "text_ref": "1. **系统核对并处理**　先用相关认识和来源发现决定查哪一部分；设备使用分手机/电脑给完整所问期间，手机按 Collector 完整日和部分日分开说明，软件取最新清单，GPS保留停留、移动和空档，必要时再查原文。",
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
     "text_ref": "直接问某项经历、兴趣、手机/电脑使用、安装软件或出行事实；可给实际时间范围和想限定的来源。"
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
     "text_ref": "1. **系统核对并处理**　先用相关认识和来源发现决定查哪一部分；设备使用分手机/电脑给完整所问期间，手机按 Collector 完整日和部分日分开说明，软件取最新清单，GPS保留停留、移动和空档，必要时再查原文。",
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

直接问某项经历、兴趣、手机/电脑使用、安装软件或出行事实；可给实际时间范围和想限定的来源。

## 需要准备什么

- 当前自然问题与实际所问期间

- 要限定的设备、来源或对象（如有）

## 从开始到拿到结果

1. **系统核对并处理**　先用相关认识和来源发现决定查哪一部分；设备使用分手机/电脑给完整所问期间，手机按 Collector 完整日和部分日分开说明，软件取最新清单，GPS保留停留、移动和空档，必要时再查原文。

2. **交付与接续**　交回答、出处、覆盖与异常；实际使用不自动代表喜欢，旧 AppUsage 时长不作排行，没命中也不写成“不喜欢”。

::screen{#daily-preferences-evidence-query-05 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 手机/电脑活动、安装软件和GPS期间已接入正常只读问题；旧9月8日190266记录/48卡仅是历史聚合，9月23日前AppUsage时长强度不再可信 关键规则与设计选择"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 手机/电脑活动、安装软件和GPS期间已接入正常只读问题；旧9月8日190266记录/48卡仅是历史聚合，9月23日前AppUsage时长强度不再可信 关键规则与设计选择"
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
     "text_ref": "1. food、shopping、payment、ride 与 Steam entertainment 有专门词、来源与权重；beverage 另有吃喝分轴。",
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
     "text_ref": "1. food、shopping、payment、ride 与 Steam entertainment 有专门词、来源与权重；beverage 另有吃喝分轴。",
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

2026-10-11 只读：正常 activity 入口已返回 phone.collector.events，9 月 28 日到 10 月 6 日九个完整北京日 trusted=true，9 月 27 日和 10 月 7 日两天是部分日、trusted=false；这是读取截至 10 月 21 日已入库的原件，本次没有新采集。device-inventory 选 10 月 7 日 07:31 的 Collector 清单，803 个包。2026-10-22 06:48 只读：Collector 已存使用事件的最后原生事件日期为 10 月 21 日（北京时间）；这是已存原件的时期，不证明之后持续或每天完整覆盖，这次没有重跑 activity 的逐日 trusted 判断，也没有重选 device-inventory 清单。旧 9 月 8 日 190266 记录/48 卡只是历史聚合；旧 AppUsage 时长在所有时期都不可信。

## 关键规则与设计选择

1. food、shopping、payment、ride 与 Steam entertainment 有专门词、来源与权重；beverage 另有吃喝分轴。

2. Steam entertainment/digital 会读取 steam_games；已分类 game 的 played 与 observed 分开保留。明确问游戏时排除 application，类型未知项不冒充游戏；明确问未玩时过滤已玩记录。

3. 哔哩哔哩 entertainment 会读取 bilibili_activity；收藏、点赞、投币、稍后看和追番强于单次播放，首页推荐不作为偏好来源。

4. travel、stay、entertainment/digital、service、tool、aesthetic等按问题组合已登记来源；旅行现在有GPS、订单与本人明示等不同口径，工具/兴趣可用实际设备活动。专门解析覆盖仍因来源而异，不能只凭域名推断全部事实已取得。

5. current（当前状态） statements/snapshots 按查询域过滤；无域问题才保留全量 current（当前状态） 上下文。

6. ai_assistant_locator 与 Gemini mixed_activity 不参与 evidence。

7. AI 平台消息保留用户/助手/平台作者边界；问题可能带真实本人背景，按原文语境判断，不把疑问、转贴、假设或为他人选择自动改成本人偏好。

8. 退款、关闭、取消、失败，以及后来被可靠同订单链全额退款覆盖的成功订单/支付，在 evidence 阶段退出普通偏好上下文、repeat_count 和快照支持；facts 仍保留先买后退的事实。

::screen{#daily-preferences-evidence-query-06 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-06",
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
     "text_ref": "9. 支付宝只归一已确认的淘宝订单号变体（T200P 与 T710P）；可靠匹配同一订单的微信/信用卡支付作旁证，不重复计权。未匹配订单但有明确品名或商户的有效支付可支持相应消费事实；泛称只支持渠道，部分退款与不唯一关联保持 Unknown（未验证）。",
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
     "text_ref": "9. 支付宝只归一已确认的淘宝订单号变体（T200P 与 T710P）；可靠匹配同一订单的微信/信用卡支付作旁证，不重复计权。未匹配订单但有明确品名或商户的有效支付可支持相应消费事实；泛称只支持渠道，部分退款与不唯一关联保持 Unknown（未验证）。",
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

9. 支付宝只归一已确认的淘宝订单号变体（T200P 与 T710P）；可靠匹配同一订单的微信/信用卡支付作旁证，不重复计权。未匹配订单但有明确品名或商户的有效支付可支持相应消费事实；泛称只支持渠道，部分退款与不唯一关联保持 Unknown（未验证）。

10. recency（近期程度）只在来源、语义和状态相当时增加最多 1 分；六年前的有效单次成功记录仍可返回，未被更正的 current（当前状态） 明示也不会因时间自动过期。

11. 次数少、长期未买或没有记录只表示证据较弱或 Unknown（未验证）；只有本人当前明确拒绝、纠正或其他直接反证才能形成负向偏好。

12. 中文查询扫描完整相关来源，>1,000 条之后的旧精确命中不会消失；此前专项观测低于 2 秒，不代表本轮每个自然问题的耗时。

13. 真实订单权重高于长 AI 文本；Steam 累计游玩时长只保留为事实，不参与偏好评分。当前免费游戏在其他条件相同时只低 0.5 分。

14. profile/evidence的source_discovery可见实际登记的逻辑来源（2026-10-22 06:48 只读为 35 类，其中 34 类有现行记录，163 个来源实例；10 月 11 日是 34 类、33 类、160 个）、本次检索范围和后续读取入口；有相关认识时不同时扫描全部原文，未匹配认识时仍能发现原文候选。

15. facts可在明确逻辑来源/平台/实例时无关键词分页浏览；长正文默认标preview_not_full，--full或original才给完整内容，不能把预览当全文已读。

16. activity按实际问句期间分别返回手机和电脑，北京时间逐日摘要、主要应用、覆盖、状态、异常与省略数量。手机优先用 Collector 系统事件：完整北京日可信，部分日只报已观察部分，有 Collector 覆盖的时段不再叠加 AppUsage。手机亮屏、应用活动和桌面前台口径不同，两设备时长不相加。phone_usage_events 的 312,150 条（2026-10-22 06:47 只读；10 月 11 日为 143,822 条）是事件记录量，不是应用打开次数。

::screen{#daily-preferences-evidence-query-07 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-07",
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
     "text_ref": "17. device-inventory比较 Collector 清单快照与 AppUsage CSV 的真实时点：先比时间，同一时间才比序号，支持换机或重装后序号重置。最新的 Collector 清单胜出时，取其包名、版本、安装/更新时间、启用和系统状态。2026-10-11 正常入口选 10 月 7 日 07:31 的 Collector 清单：803 个包、803 个已安装，包含系统组件。9 月 23 日 02:00 的 App CSV 841 行（801 已安装/40 未安装）只是历史。",
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
     "text_ref": "17. device-inventory比较 Collector 清单快照与 AppUsage CSV 的真实时点：先比时间，同一时间才比序号，支持换机或重装后序号重置。最新的 Collector 清单胜出时，取其包名、版本、安装/更新时间、启用和系统状态。2026-10-11 正常入口选 10 月 7 日 07:31 的 Collector 清单：803 个包、803 个已安装，包含系统组件。9 月 23 日 02:00 的 App CSV 841 行（801 已安装/40 未安装）只是历史。",
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

17. device-inventory比较 Collector 清单快照与 AppUsage CSV 的真实时点：先比时间，同一时间才比序号，支持换机或重装后序号重置。最新的 Collector 清单胜出时，取其包名、版本、安装/更新时间、启用和系统状态。2026-10-11 正常入口选 10 月 7 日 07:31 的 Collector 清单：803 个包、803 个已安装，包含系统组件。9 月 23 日 02:00 的 App CSV 841 行（801 已安装/40 未安装）只是历史。

18. mobility可一次读完整期间，默认紧凑保留停留、移动、空档和来源日期，端点/原件定位按--details展开；只用GPS区域级近似和本人确认解释，历史长空档技术原因未知。来源 b51db6d8（北京 10 月 19 日 23:40）起，同一天的定位原件除 GPSLogger、MacroDroid 外，还读手机采集程序 Collector 的定位文件：只收 gps、network、fused 三类、坐标和精度合法的点，按定位本身的时间（location_time）排序，坏行记缺口、不中断整天。MacroDroid 的点只有写入时间（write_time），位置可能是手机缓存的旧值，标成 location_may_be_cached、use_for_mobility=false：仍作原始记录返回，但不参与停留和移动推断。Collector 新输入不倒推历史空档的原因；本次没有连接手机，也没有实际运行这条读取。

19. 手机 AppUsage 已退役：所有时期的时长、排名和使用频次都不可信（change_date_local=null，表示没有任何可信时期），不再把 9 月 23 日以后当可信。旧原件和记录保留，应用是否出现过和独立安装清单仍可用；失真时长支撑过的旧认识已撤回或修订，独立 Steam/手游兴趣证据并未因此清空。

20. 手机事实的天然边界：双开的第二个微信在另一个用户空间，系统使用事件里没有它；系统历史通常只留约 10 天，过期补不回。总时长、打开次数和排行统一排除五个桌面/系统界面包；这不删除安装清单里的系统组件，也不影响独立的亮屏口径。

21. 缺区域缓存时，现有补全入口由密码中心批量代办高德地图调用，默认业务进程拿不到 key（AMapClient.from_password_center 是当前默认；已钉住的 from_injected_environment 兼容路径仍保留）。正常查询只读已存的区域缓存。本次没有调用高德、没读 key，也没验证外网请求。

## 当前怎样实现

- query_terms 从自然问题抽取中文片段/ASCII 词并补专门域词；扩展域没有词表时安全返回空补充而不崩溃。

- query_domains按问题识别领域，Steam/游戏进入entertainment，数字游戏也可进入digital；来源发现不再被旧白名单限制，relevant_logical_sources只选择会改变当前判断的来源类型。

- SQLite read-only URI 与 query_only 保证业务表和主文件不被查询修改；busy_timeout 只等待现有锁。只读连接仍可能更新 -shm mtime，因此不宣称严格文件系统零写。

::screen{#daily-preferences-evidence-query-08 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-08",
  "section": "tech",
  "title": "技术实现与依据（四）",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- 记录先按 effective outcome 过滤非成功与 refunded_full 订单链，再按 term match、source weight、recency、状态和饮料轴加权；recency=1/(1+age_days/365)，只加排序分，不设过期门槛。",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- 记录先按 effective outcome 过滤非成功与 refunded_full 订单链，再按 term match、source weight、recency、状态和饮料轴加权；recency=1/(1+age_days/365)，只加排序分，不设过期门槛。",
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

## 技术实现与依据（四）

- 记录先按 effective outcome 过滤非成功与 refunded_full 订单链，再按 term match、source weight、recency、状态和饮料轴加权；recency=1/(1+age_days/365)，只加排序分，不设过期门槛。

- Steam 接受已分类 played/observed，observed 在同条件下减 1 分；明确未玩查询过滤 played，明确游戏查询排除 application。playtime_minutes 不加分，同 AppID 去重并关联 store_price_class，current_free 同条件减 0.5。

- Bilibili 按行为类型增加不同排序权重，并排除已失效视频；单次播放比收藏、点赞、投币、稍后看和追番更弱。

- 当前仍保留 FTS5 表，但中文精确召回不依赖最近 1,000 条或向量库。

- 普通主题查询先缩小候选卡片，再校验相关来源；跨领域需要 source_revision 时，一次读取同一数据库快照并批量计算，保留原有修订摘要语义，减少重复查询。

- evidence_has_more 说明证据结果是否还有未展示项；facts 的 total_variant_count 与 variants_has_more 分开表示全部变体数量和本次展示范围。截断不会被解释成不存在。

- source_discovery从实际登记来源构成，标明本次检索范围、未查来源、provider/逻辑来源和正常读取入口；明确来源的facts无关键词分页，不展开所有长正文。

- activity_queries.py与phone_activity.py合成整个所问期间；phone_activity.py 的 _collector_days 按 completedThrough 覆盖区分完整日和部分日，返回 phone.collector.events 质量与 trusted。TimeAudit由现有Owner按有界批次读取并按北京时间汇总；原desktop-activity明细保持可查，工具失败保留原reason和diagnostic。

::screen{#daily-preferences-evidence-query-09 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-09",
  "section": "tech",
  "title": "技术实现与依据（五）",
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
     "text_ref": "技术实现与依据（五）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "device_inventory.py按真实时点在Collector清单与AppCSV之间选最新完整清单（先time、同time才sequence），Installed与安装/更新时间分开；mobil",
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
     "text_ref": "技术实现与依据（五）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "device_inventory.py按真实时点在Collector清单与AppCSV之间选最新完整清单（先time、同time才sequence），Installed与安装/更新时间分开；mobil",
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

## 技术实现与依据（五）

- device_inventory.py 按真实时点在 Collector 清单与 App CSV 之间选最新完整清单（先 time、同 time 才 sequence），Installed 与安装/更新时间分开；mobility.py按期间汇总GPS事件、停留、移动、空档和本人声明，默认有界输出仍包含全部已发现事件；同一天读 GPSLogger、MacroDroid 和 Collector 三处定位原件，Collector 有效点按 location_time 进入汇总，MacroDroid 点标 time_basis=write_time、use_for_mobility=false，只保留不进停留/移动计算。

- mobility.py 的 AMapClient 默认 from_password_center：tools/amap_mobility_refresh.py 只在补全缺失区域缓存时由密码中心批量代办高德调用，key 不交给默认业务进程；正常查询只读缓存。

- source_assertions.py让本人更正与来源事实一同进入正常问答；AppUsage 所有时期时长都不给排行，也不把GPSLogger当前配置或MacroDroid心跳倒推成旧空档的原因。

## 执行流程

1. 读取 CURRENT（当前状态） 快路径

::screen{#daily-preferences-evidence-query-10 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-10",
  "section": "tech",
  "title": "技术实现与依据（六）",
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
     "text_ref": "技术实现与依据（六）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "2. 识别自然问题的域和轴",
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
     "text_ref": "技术实现与依据（六）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "2. 识别自然问题的域和轴",
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

## 技术实现与依据（六）

2. 识别自然问题的域和轴

3. 选择相关来源

4. 读取 current（当前状态） 明示/有效推定

5. 扫描并排序相关记录

6. 过滤非成功订单、无关AI内容和模板

7. B站按行为强度排序

8. Steam区分游玩/库内选择并连接当前商店分类

9. 返回少量证据给 Skill/AI

::screen{#daily-preferences-evidence-query-11 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-11",
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
| domain（领域） | 本次问题属于吃喝、购物、支付、出行或扩展偏好的哪一类，用来缩小来源与 current（当前状态） 上下文。 |
| axis（选择轴） | 同一开放问题里会改变答案的独立方向，例如美食中的吃与喝。 |
| query-scoped context（按问题限定的上下文） | 只返回与当前域有关的明示和推定，再保留少量真正跨领域的交互原则。 |
| game observation（游戏行为观察） | Steam 已分类游戏的库内或游玩观察；未玩选择比实际游玩弱，启动分钟不加分，二者都不自动证明喜欢或具体历史取得方式。 |

## 专业定义

可以直接问“最近一周屏幕使用怎样”“我装过哪些软件”“这段时间到过哪里”，不用先知道来源名。系统按题找已登记材料，给完整所问范围和缺口，再决定是否需要读原文。

::screen{#daily-preferences-evidence-query-12 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-12",
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
     "text_ref": "- 不是向量检索或通用语义模型。",
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
     "text_ref": "- 不是向量检索或通用语义模型。",
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

解决来源已经接入却在普通问题里找不到、长输出截断只交第一天、无关current（当前状态）淹没有用经历、预览冒充全文，以及失真的手机时长被误当强度。

## 边界

- 不是向量检索或通用语义模型。

- 来源发现、索引短预览和完整阅读分层，未查来源不等于不存在。

- AppUsage 所有时期的时长都不用于强度/排行；Collector 部分日只报已观察部分；双开的第二个微信不在系统事件里；手机和电脑各报自己的口径，不相加为净注意力。

- GPS空档技术原因未知，当前设备配置不倒推历史设置。

- 命中顺序、播放、收藏、游玩时长和近期程度都不自动等于喜欢。

- B站首页推荐不进入偏好，平台可见窗口不等于完整历史。

- 收藏、稍后再看、追番/追剧只有完整current（当前状态） set才按缺失局部退役；播放、点赞、投币不按消失清退。

- Steam未玩但已分类游戏可作较弱选择依据；应用、类型未知项和账号引用不冒充游戏偏好。

::screen{#daily-preferences-evidence-query-13 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-13",
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
     "text_ref": "- 当前商店分类不证明历史取得方式。",
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
     "text_ref": "- 当前商店分类不证明历史取得方式。",
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

- 当前商店分类不证明历史取得方式。

- 非成功和refunded_full订单不进入普通偏好evidence、模型上下文或复购计数；partial/Unknown（未验证）不猜。

- 时间只排序，不让久远有效记录或未更正明示自动过期。

- 低频、长期未买和没有记录都不等于不喜欢。

- Gemini只让可证明作者是用户、且实际语境支持本人表达的消息进入相应证据；mixed_activity、助手和已知平台输入排除。

- 没有命中保持Unknown（未验证）。

## 失败与恢复

- **扩展域没有 DOMAIN_TERMS**：使用空补充词而不是 KeyError；仍返回该域明示/通用证据。

- **AI 消息含疑问、假设或替他人询问**：按完整语境区分已表达的本人背景和问题本身，不自动认定本人偏好；作者不明或纯助手/平台输入排除。

::screen{#daily-preferences-evidence-query-14 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-14",
  "section": "tech",
  "title": "出问题时（三）",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **订单状态表示退款、关闭、取消或失败**：保留记录供事实核对，但从普通偏好 evidence、模型上下文与 repeat_count 排除，不反推喜欢或不喜欢。",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **订单状态表示退款、关闭、取消或失败**：保留记录供事实核对，但从普通偏好 evidence、模型上下文与 repeat_count 排除，不反推喜欢或不喜欢。",
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

## 出问题时（三）

- **订单状态表示退款、关闭、取消或失败**：保留记录供事实核对，但从普通偏好 evidence、模型上下文与 repeat_count 排除，不反推喜欢或不喜欢。

- **此前成功订单后来被可靠同订单链全额退款覆盖**：原订单、支付和退款事实都保留，有效结局改为 refunded_full，并让依赖它的 current（当前状态） 推定 stale；partial/Unknown（未验证） 不传播。

- **B 站 current（当前状态） set 的账号、Schema（数据结构）、range、分页、计数或成员唯一性不完整**：本轮缺失成员不退役；只有完整集合才局部退出 current（当前状态），且移除不反推不喜欢。

- **记录很久、次数少或本轮没有命中**：降低或缺少排序证据，但保留有效成功记录与未更正明示；没有直接反证时保持 Unknown（未验证），不自动写成不喜欢。

- **Steam 项目只有库内/安装观察，或类型不能证明是游戏**：已分类游戏保留较弱的选择依据，不说成实际玩过；应用和类型未知项不混成游戏，不从未玩反推不喜欢。

- **Steam 商店当前分类存在但历史取得方式不明**：返回当前 store_price_class，同时保持历史 acquisition Unknown（未验证），不猜直购、礼物、激活码、限免或家庭共享。

- **B 站问题命中其他娱乐来源**：只保留 bilibili_activity 的 current（当前状态） 明示与记录，不用 Steam、旧失效快照或全库噪声补数量。

- **相关中文记录早于最近 1,000 条**：完整扫描相关来源并按命中排序；不以截断冒充无证据。

::screen{#daily-preferences-evidence-query-15 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-15",
  "section": "tech",
  "title": "出问题时（四）",
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
     "text_ref": "出问题时（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **数据库不可读或个人资料锁着**：锁着时先由主对话请我验证，不用旧私人背景降级回答；已解锁而入口不可用时只报告入口不可用，不修改数据库或改走中央画像。",
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
     "text_ref": "出问题时（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **数据库不可读或个人资料锁着**：锁着时先由主对话请我验证，不用旧私人背景降级回答；已解锁而入口不可用时只报告入口不可用，不修改数据库或改走中央画像。",
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

## 出问题时（四）

- **数据库不可读或个人资料锁着**：锁着时先由主对话请我验证，不用旧私人背景降级回答；已解锁而入口不可用时只报告入口不可用，不修改数据库或改走中央画像。

- **手机旧时长或旧软件清单被误用**：保留原件和真实采集时点；AppUsage 时长不进入排行，安装清单按真实时点取最新（现在是 Collector 清单），App 更新时间上界不称为清单截止。

- **完整期间的结果过长或GPS有空档**：默认按期间压缩但保留全部已发现事件和缺口，详细端点按需展开；空档不推定无出行，真正失败返回原因而不重复大结果。

::screen{#daily-preferences-evidence-query-16 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-16",
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
     "text_ref": "- **daily_preferences.py**：实现 query terms/domains/axis、只读检索、上下文过滤、排序和证据输出。",
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
     "text_ref": "- **daily_preferences.py**：实现 query terms/domains/axis、只读检索、上下文过滤、排序和证据输出。",
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

- **daily_preferences.py**：实现 query terms/domains/axis、只读检索、上下文过滤、排序和证据输出。

- **tests/test_daily_preferences.py**：覆盖订单优先、非成功证据排除、Steam 多账号/已玩和未玩/应用区分与商店关联、ASCII、中文 >1000、扩展域与 AI 本人表达过滤。

- **SKILL.md**：拥有开放题补轴、最小证据和最终推荐解释。

- **activity_queries.py / phone_activity.py / device_inventory.py / mobility.py**：提供双设备期间（手机以 Collector 完整日/部分日为准）、手机安装清单和GPS期间的有界只读结果，原件、覆盖和本人解释分开；mobility 的区域补全默认走密码中心代办。

- **source_assertions.py / tests/test_source_correction_integration.py**：将来源更正落实到正常查询与受影响认识，不把失真历史时长继续作支持性依据。

## 如何验证

- 旧专项：构造1,001条较新占位与第1,002条旧中文目标，确认旧目标仍返回；退款、Steam、B站等既有回归保留原观察日期。

- 2026-09-23来源验收：无提示读者实际取得手机与电脑整个所问期间、每日变化和排行，屏幕问题没有因工具截断只交首日；另一读者按普通兴趣/探索问题组合认识、网易云、购物和设备观察。那时的手机时长来自 AppUsage，现已不采信。

- 2026-09-24来源验收：手机清单正式快照841行，GPS两个月默认结果保留18段停留、13段移动、11段空档和33来源日期，未在6000 tokens预算内截断；历史空档原因仍未知。这些是当时的期间样本。

::screen{#daily-preferences-evidence-query-17 section="tech"}

```typeset
{
 "screen": {
  "id": "daily-preferences-evidence-query-17",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 来源与按需增量",
    "href": "/projects/daily-preferences/source-coverage/"
   },
   {
    "text": "下一个模块 具体事实与原件",
    "href": "/projects/daily-preferences/fact-verification/"
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
     "text_ref": "- 2026-10-11 16:35–16:39 只读：activity（9 月 27 日至 10 月 8 日）只看逐日来源、质量和 trusted，九个完整日 trusted=true、两个部分日 false；device-inventory 返回 10 月 7 日 07:31 的 Collector 清单 803 个包。没有输出应用名、时长或打开次数，没有读 GPS 原件或刷新区域，也没有调用高德。",
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
     "text_ref": "- 2026-10-11 16:35–16:39 只读：activity（9 月 27 日至 10 月 8 日）只看逐日来源、质量和 trusted，九个完整日 trusted=true、两个部分日 false；device-inventory 返回 10 月 7 日 07:31 的 Collector 清单 803 个包。没有输出应用名、时长或打开次数，没有读 GPS 原件或刷新区域，也没有调用高德。",
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

- 2026-10-11 16:35–16:39 只读：activity（9 月 27 日至 10 月 8 日）只看逐日来源、质量和 trusted，九个完整日 trusted=true、两个部分日 false；device-inventory 返回 10 月 7 日 07:31 的 Collector 清单 803 个包。没有输出应用名、时长或打开次数，没有读 GPS 原件或刷新区域，也没有调用高德。

- 来源最终完整Python回归542项通过，这是历史验收；本次测试 0，也不是新的无提示自然读者验收，不从有限自然题推断所有未来问答或全库全文均已正确理解。

## 与其他模块的关系

它消费来源模块的 current（当前状态） 事实，并把最小证据交给具体事实核对或推荐菜单；本模块不生成最终建议。
