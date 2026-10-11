---
{
 "title": "唯一串口写入者、1 Hz 混合刷新与全帧恢复",
 "kind": "project",
 "url": "/projects/pc-panel-hub/serial-transport/",
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
  "page": "pc-panel-hub-serial-transport",
  "kind": "project",
  "title": "唯一串口写入者、1 Hz 混合刷新与全帧恢复",
  "url": "/projects/pc-panel-hub/serial-transport/",
  "parent": "pc-panel-hub",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "源码按 10 月 6 日最后一次提交（早于 10 月 11 日 14:00 截止）核对；发送记录和实体屏确认保留各自历史日期，之后未重新核对"
  }
 },
 "source": {
  "page": "sources/pages/pc-panel-hub-serial-transport/page.json",
  "sha256": "cfece4f849a925e668cbf12e436d6926d7b7779955e063d273febe02eae14280",
  "converted_at_beijing": "2026-10-11T19:04:25+08:00"
 }
}
---

::screen{#pc-panel-hub-serial-transport-01 section="top"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-01",
  "section": "top",
  "title": "唯一串口写入者、1 Hz 混合刷新与全帧恢复",
  "links": [
   {
    "text": "回到项目 → 双屏信息中心",
    "href": "/projects/pc-panel-hub/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/PC-Panel-Hub"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/pc-panel-hub/#ai-brief"
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
     "text_ref": "唯一串口写入者、1 Hz 混合刷新与全帧恢复",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 6 日最后一次提交（早于 10 月 11 日 14:00 截止）核对；发送记录和实体屏确认保留各自历史日期，之后未重新核对",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 双屏信息中心〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "机箱屏先收到完整画面，之后每秒更新变化；若设备漏掉一轮，就重新发送整张纠偏。主机发送记录与实体画面是否动起来分别核对。",
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
     "text_ref": "唯一串口写入者、1 Hz 混合刷新与全帧恢复",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 6 日最后一次提交（早于 10 月 11 日 14:00 截止）核对；发送记录和实体屏确认保留各自历史日期，之后未重新核对"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 双屏信息中心〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "机箱屏先收到完整画面，之后每秒更新变化；若设备漏掉一轮，就重新发送整张纠偏。主机发送记录与实体画面是否动起来分别核对。"
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
   "asset": "_library/illustrations/modules/pc-panel-hub-serial-transport-v01.png",
   "key": "main-pc-panel-hub",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，机箱内侧竖着一条细长的小屏（上面只画浅绿色的小卡片和一条小折线，不画字），机箱顶部水冷头上一块弯弯的曲面屏（上面只画一个大号时钟形状和两三张半透明小卡片的轮廓，不画字）；机箱旁一部手机，手机和曲面屏之间一条虚线小箭头。",
   "sha256": "4f3ecfdb0d090a03b13a9678c730a8c4b2868a14ce1b2bb11d1bf069b994295a",
   "status": "ready"
  }
 ]
}
```

# 唯一串口写入者、1 Hz 混合刷新与全帧恢复

〔回到项目 → 双屏信息中心〕　〔GitHub〕　〔复制 AI 续作说明〕

PC Panel Hub · 功能说明

机箱屏先收到完整画面，之后每秒更新变化；若设备漏掉一轮，就重新发送整张纠偏。主机发送记录与实体画面是否动起来分别核对。

**当前情况：**最近一段有日期的主机记录是 9 月 27 日 21:27 到 28 日 21:22 连续发了 85,063 帧、0 次失败；这只是电脑这边的发送记录，不等于每一帧都显示到了实体屏。本人确认实体屏正常和异常退出自动接回的证据仍是 9 月 7 日。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#pc-panel-hub-serial-transport-02 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 只整张刷新会太慢，只发变化部分又可能在漏了一帧后越错越多。系统先给机箱屏发完整画面，再持续更新变化，必要时重新发整张纠偏。 举个实际例子 机箱屏像是冻住了，系统会先确认旧写入者已经退出，再用一"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 只整张刷新会太慢，只发变化部分又可能在漏了一帧后越错越多。系统先给机箱屏发完整画面，再持续更新变化，必要时重新发整张纠偏。 举个实际例子 机箱屏像是冻住了，系统会先确认旧写入者已经退出，再用一"
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

只整张刷新会太慢，只发变化部分又可能在漏了一帧后越错越多。系统先给机箱屏发完整画面，再持续更新变化，必要时重新发整张纠偏。

## 举个实际例子

机箱屏像是冻住了，系统会先确认旧写入者已经退出，再用一张完整画面重新打底，之后恢复每秒更新。最后仍以实体屏上的时钟重新跳动为准，而不是看到电脑“发送成功”就宣布修好。

## 最后我会得到什么

机箱屏应恢复约每秒更新，并定期整张校正；主机记录能说明发送到哪一步，但最终仍须看实体时钟和像素真的变化。

::screen{#pc-panel-hub-serial-transport-03 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-03",
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

唯一发送程序接上正确设备并维持刷新时，主机侧状态通过；实体结果还要现场观察。

## 发现问题时

发送太慢或失败时退出这一发送程序；看门狗先确认旧程序真的退出，再重新建立完整画面。

## 入口不可用或证据不足时

旧发送者没退出或设备身份不唯一时不启动第二个程序抢屏；旧程序 30 秒内没停干净，就推迟重建、看门狗继续守着，下一轮再试。

::screen{#pc-panel-hub-serial-transport-04 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-04",
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
     "text_ref": "机箱屏冻结时，在已接入项目的本机 AI 对话中点名这块实体屏并描述最后一次变化。",
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
     "text_ref": "1. **先找到真正连着机箱屏的端口**　系统确认设备身份与旧发送程序是否退出，不沿用旧电脑的端口编号。",
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
     "text_ref": "机箱屏冻结时，在已接入项目的本机 AI 对话中点名这块实体屏并描述最后一次变化。"
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
     "text_ref": "1. **先找到真正连着机箱屏的端口**　系统确认设备身份与旧发送程序是否退出，不沿用旧电脑的端口编号。",
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

机箱屏冻结时，在已接入项目的本机 AI 对话中点名这块实体屏并描述最后一次变化。

## 需要准备什么

- 实际串口设备

- 冻结时间与现有写入进程

## 从开始到拿到结果

1. **先找到真正连着机箱屏的端口**　系统确认设备身份与旧发送程序是否退出，不沿用旧电脑的端口编号。

2. **重新建立画面**　发送完整基线，再每秒更新变化部分，定期补全帧避免漏帧长期冻结。

3. **看真实屏幕**　交回时钟是否重新跳动；主机发送成功没有设备确认时保留未知，由看门狗按实际故障恢复。

::screen{#pc-panel-hub-serial-transport-05 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月9日03:38Z继续约1 Hz发送，14,487/14,487帧、失败0；本人实体屏确认及异常退出自动接回保留9月7日实测日期 关键规则与设计选择 1 comman"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月9日03:38Z继续约1 Hz发送，14,487/14,487帧、失败0；本人实体屏确认及异常退出自动接回保留9月7日实测日期 关键规则与设计选择 1 comman"
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
     "text_ref": "1. command 200 是保守已验证全帧路径；command 204 始终标为设备特定候选：它来自厂商程序里的导出，没有设备确认回执，也不是可以复用的公开协议。",
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
     "text_ref": "1. command 200 是保守已验证全帧路径；command 204 始终标为设备特定候选：它来自厂商程序里的导出，没有设备确认回执，也不是可以复用的公开协议。",
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

9 月 27 日 21:27 至 28 日 21:22 一次会话 85,063 帧、失败 0；更早的 9 月 9 日 11:38（北京时间）曾 14,487/14,487 帧、失败 0。本人实体屏确认及异常退出自动接回保留 9 月 7 日实测日期

## 关键规则与设计选择

1. command 200 是保守已验证全帧路径；command 204 始终标为设备特定候选：它来自厂商程序里的导出，没有设备确认回执，也不是可以复用的公开协议。

2. 安装默认保持 1 Hz，不把降到 3 秒当通用稳定性修复；计划任务参数里虽然还写着 3000 毫秒，混合模式实际强制每秒一帧。

3. 增量 900 ms、全帧 10 秒上限，首次发送失败即退出。

4. heartbeat 必须包含 send_attempted 和恢复基线，不能只报进程 alive。

## 当前怎样实现

- 启动执行 vendor-shaped priming、亮度恢复和两帧 command 200。

- 稳态每秒发送 command 204 差分。

- warmup 60/120/180 帧与长期 900 帧重建 serial session 并补全帧。

::screen{#pc-panel-hub-serial-transport-06 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-06",
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
     "text_ref": "- 看门狗校验 mode、period、send_ms、last_full_frame 和 failed。",
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
     "text_ref": "- 看门狗校验 mode、period、send_ms、last_full_frame 和 failed。",
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

- 看门狗校验 mode、period、send_ms、last_full_frame 和 failed。

## 执行流程

1. 确认唯一 COM 设备和旧 owner 已退出。

2. 打开串口并发送完整基线。

3. 每秒发送有界差分。

4. 到恢复边界时重开会话并补全帧。

5. 失败退出，由长期看门狗恢复。

::screen{#pc-panel-hub-serial-transport-07 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-07",
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
| baseline（完整基线） | 设备可据此得到完整画面的 command 200 帧。 |
| delta（差分） | 只发送变化区域的 command 204 数据，主机更快但无设备 ACK。 |
| serial session（串口会话） | 一次独占打开与写入周期；重开可清除部分驱动/设备停滞。 |

## 专业定义

以 command 200 建完整画面基线、command 204 做有界增量，并用唯一写入者、发送上限、定期重开会话和 heartbeat 限制静默冻结。

::screen{#pc-panel-hub-serial-transport-08 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-08",
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
     "text_ref": "- 端口按“命令行显式指定 → 配置文件 → 兼容默认 COM7”的顺序取；COM7 是这台电脑配置里的端口，换机后必须重验身份，不是可泛化的设备事实。",
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
     "text_ref": "- 端口按“命令行显式指定 → 配置文件 → 兼容默认 COM7”的顺序取；COM7 是这台电脑配置里的端口，换机后必须重验身份，不是可泛化的设备事实。",
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

解决全帧太慢、增量静默冻结、串口双写、驱动停滞、假心跳和恢复基线长期不到达。

## 边界

- 端口按“命令行显式指定 → 配置文件 → 兼容默认 COM7”的顺序取；COM7 是这台电脑配置里的端口，换机后必须重验身份，不是可泛化的设备事实。

- 主机写成功不是 device ACK（设备确认）；每 900 帧补一次整帧只说明主机会定期尝试纠偏，不能保证实体屏最长只会停 15 分钟。

- Alt helper 仅保留隔离测试，不进入当前日常链路。

## 失败与恢复

- **旧 stream 未释放 COM**　启动失败关闭，不抢占或创建第二个 writer。

- **单次 send 超时或失败**　worker 退出；看门狗先证明旧发送者已退出再重建。停止超过 30 秒就推迟，看门狗保持运行，下一轮重新确认后再建，不出现第二个串口写入者。

- **heartbeat 新鲜但基线逾期**　判为不健康，不接受假活。

::screen{#pc-panel-hub-serial-transport-09 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-09",
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
     "text_ref": "- command 200/204、deadline、heartbeat",
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
     "text_ref": "- command 200/204、deadline、heartbeat",
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

- command 200/204、deadline、heartbeat

- 已验证 command 200/123 编码边界

- 协议观察与证据边界

- 节拍与恢复基线合同

- 唯一 writer、heartbeat 和超时回归

## 如何验证

- 9 月 27 日 21:27 至 28 日 21:22 主机记录一次会话 85,063 帧、failed=0；原始心跳已被后续写入覆盖，这次没有重新读到，保留为历史记录。

- 2026-09-07T23:24:15Z（北京时间 9 月 8 日 07:24）heartbeat 为 285/285、failed=0、period=1010 ms、send_ms=22、last_full_frame=180；晚于异常退出恢复时第 5 帧，发送继续推进。8 月 31 日 2748/2748 保留为历史。

- 9月7日 StreamCadence 与 RuntimeReliability 通过；生产链实测软件启动 31.06 秒恢复，强制结束看门狗后 63.33 秒由原 VBS 接回并确认旧 sender 退出。

::screen{#pc-panel-hub-serial-transport-sources-02 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-serial-transport-sources-02",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 机箱屏渲染",
    "href": "/projects/pc-panel-hub/case-panel-rendering/"
   },
   {
    "text": "下一个模块 2288×1048 OLED 的六类信息、事件寿命与快捷键",
    "href": "/projects/pc-panel-hub/hs2-overlay/"
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
     "text_ref": "- 套件的 TestVideoStream 当时因已有生产流而跳过，本轮没有运行；来源工程另行完成精确设备下的真实恢复，本人随后确认实体屏正常刷新。command 204 仍没有设备逐像素 ACK。",
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
     "text_ref": "- 套件的 TestVideoStream 当时因已有生产流而跳过，本轮没有运行；来源工程另行完成精确设备下的真实恢复，本人随后确认实体屏正常刷新。command 204 仍没有设备逐像素 ACK。",
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

- 套件的 TestVideoStream 当时因已有生产流而跳过，本轮没有运行；来源工程另行完成精确设备下的真实恢复，本人随后确认实体屏正常刷新。command 204 仍没有设备逐像素 ACK。

## 与其他模块的关系

安装与换机模块先确认当前串口和本地 runtime（运行环境）；本模块接收 renderer 位图，失败由电源与恢复模块处理，实体结果进入分层验收。
