---
{
 "title": "物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口",
 "kind": "project",
 "url": "/projects/sunshine-remote-streaming/capture-failover/",
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
  "page": "sunshine-remote-streaming-capture-failover",
  "kind": "project",
  "title": "物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口",
  "url": "/projects/sunshine-remote-streaming/capture-failover/",
  "parent": "sunshine-remote-streaming",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "（主机体检阻塞中）；源码按 10 月 6 日最后一次提交（会话判断与损坏记录处理是 10 月 3 日改的，均早于 10 月 11 日 14:00 截止）；主机体检取截止前 10 月 11 日 13:33 的结果；客户端画面未知"
  }
 },
 "source": {
  "page": "sources/pages/sunshine-remote-streaming-capture-failover/page.json",
  "sha256": "01815f93e2cf4d5981e4af24bf5fd58d10d03b559c2f5dd63fb7b8a7efaa00ef",
  "converted_at_beijing": "2026-10-11T19:04:26+08:00"
 }
}
---

::screen{#sunshine-remote-streaming-capture-failover-01 section="top"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-01",
  "section": "top",
  "title": "物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口",
  "links": [
   {
    "text": "回到项目 → 远程电脑串流",
    "href": "/projects/sunshine-remote-streaming/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/sunshine-remote-streaming/#ai-brief"
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
     "text_ref": "物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口",
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
     "static_note": "截至 10 月 11 日 · （主机体检阻塞中）；源码按 10 月 6 日最后一次提交（会话判断与损坏记录处理是 10 月 3 日改的，均早于 10 月 11 日 14:00 截止）；主机体检取截止前 10 月 11 日 13:33 的结果；客户端画面未知",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 远程电脑串流〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "目标体验仍很直白：在家用物理屏，主屏确实离线时才让 VDD 兜底，主屏回来后把普通窗口拉回；现在已经有实现和测试，但还不能把这段目标场景说成真机成功。",
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
     "text_ref": "物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口",
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
     "static_note": "截至 10 月 11 日 · （主机体检阻塞中）；源码按 10 月 6 日最后一次提交（会话判断与损坏记录处理是 10 月 3 日改的，均早于 10 月 11 日 14:00 截止）；主机体检取截止前 10 月 11 日 13:33 的结果；客户端画面未知"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 远程电脑串流〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "目标体验仍很直白：在家用物理屏，主屏确实离线时才让 VDD 兜底，主屏回来后把普通窗口拉回；现在已经有实现和测试，但还不能把这段目标场景说成真机成功。"
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
   "asset": "_library/illustrations/modules/sunshine-remote-streaming-capture-failover-v01.png",
   "key": "远程主备显示屏",
   "source_phrase": "右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。",
   "sha256": "fd4f5100be21c07252fc2f34b288729fc0c0b93dba1efba1b62d55b48e6ea65d",
   "status": "ready"
  }
 ]
}
```

# 物理主屏优先，唯一 MTT1337 VDD（虚拟显示器）兜底并守护应用窗口

〔回到项目 → 远程电脑串流〕　〔复制 AI 续作说明〕

Sunshine 远程串流 · 功能说明

目标体验仍很直白：在家用物理屏，主屏确实离线时才让 VDD 兜底，主屏回来后把普通窗口拉回；现在已经有实现和测试，但还不能把这段目标场景说成真机成功。

**当前情况：**10 月 11 日 13:33 体检报“阻塞”：显卡这关是放行的，卡住的是 Sunshine 配置里要抓的那块屏，在当前活动的屏里找不到对应的一个；当时捕获模式在虚拟屏上。因为串流会话还算“进行中”（有 3 个 UDP 串流端点），守护在等串流空闲后再处理。手机画面与真实主屏故障转移仍未验收；普通联网串流 10 月 8 日有本人实用结果。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#sunshine-remote-streaming-capture-failover-02 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 多屏扩展下，Windows 可能把新开或失去焦点的窗口放到看不见的扩展屏；如果盲目开启“系统镜像”，又可能打乱物理屏高刷与 HDR（高动态范围）。因此需要一套先核对身份、再决定是否动作的窗口与"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 多屏扩展下，Windows 可能把新开或失去焦点的窗口放到看不见的扩展屏；如果盲目开启“系统镜像”，又可能打乱物理屏高刷与 HDR（高动态范围）。因此需要一套先核对身份、再决定是否动作的窗口与"
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

多屏扩展下，Windows 可能把新开或失去焦点的窗口放到看不见的扩展屏；如果盲目开启“系统镜像”，又可能打乱物理屏高刷与 HDR（高动态范围）。另外，正在用的人不能被突然切屏踢掉，坏掉的窗口记录也不能拿来乱搬窗。因此需要一套先核对身份、再决定是否动作的窗口与捕获目标守护器。

## 举个实际例子

“家里的主屏真的不在线了，我想从手机继续看电脑。”守护器先确认屏幕已稳定离线、真的没人在串流（不光看建连通道，还看画面和声音的 UDP 通道还在不在）、近期显卡没出过故障，才切到已认准的虚拟屏；主屏回来还要实际看窗口有没有回去。

## 最后我会得到什么

已经有屏幕识别、等待、空闲检查、窗口回迁和损坏记录保护的实现与测试；还没有真实证明拔线后手机画面不中断或所有窗口都能回到原处。

::screen{#sunshine-remote-streaming-capture-failover-03 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-03",
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

代码已覆盖应当保持主屏、何时尝试虚拟屏与如何计划窗口回迁；真实手机画面和拔线前后对照仍未验收。

## 发现问题时

近 15 分钟内有显卡故障就停止捕获切换和往虚拟屏搬窗，过了这段再重新核对；窗口恢复记录损坏时停下自动切换，不拿空白记录覆盖。10 月 11 日卡住的是配置要抓的屏对不上，守护在等串流空闲，手机此刻画面未知。

## 入口不可用或证据不足时

虚拟屏不唯一或驱动身份不清时停止切换，不把画面送到猜测的屏幕。

::screen{#sunshine-remote-streaming-capture-failover-04 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-04",
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
     "text_ref": "在已配置的 Sunshine 守护环境中运行零写入体检 Get-SunshineHealth.ps1 -Json 查看当前捕获目标；实际切换由守护器在主屏确实离线且串流空闲时进行，本页不能代替真实画面验收。",
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
     "text_ref": "1. **先读主机现场**　守护器辨认物理主屏、专用虚拟屏和当前有没有人在串流；主屏正常时优先显示它，并拉回误入虚拟屏的普通窗口。",
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
     "text_ref": "在已配置的 Sunshine 守护环境中运行零写入体检 Get-SunshineHealth.ps1 -Json 查看当前捕获目标；实际切换由守护器在主屏确实离线且串流空闲时进行，本页不能代替真实画面验收。"
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
     "text_ref": "1. **先读主机现场**　守护器辨认物理主屏、专用虚拟屏和当前有没有人在串流；主屏正常时优先显示它，并拉回误入虚拟屏的普通窗口。",
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

在已配置的 Sunshine 守护环境中运行零写入体检 Get-SunshineHealth.ps1 -Json 查看当前捕获目标；实际切换由守护器在主屏确实离线且串流空闲时进行，本页不能代替真实画面验收。

## 需要准备什么

- 要远程看的主机与屏幕

- 是否希望主屏离线时使用专用虚拟屏

- 窗口位置异常时指出现象

## 从开始到拿到结果

1. **先读主机现场**　守护器辨认物理主屏、专用虚拟屏和当前有没有人在串流；主屏正常时优先显示它，并拉回误入虚拟屏的普通窗口。

2. **满足条件才兜底**　主屏稳定离线、近期显卡安静、串流明确空闲、窗口记录完好后，才记下窗口位置并切到唯一的专用虚拟屏。

3. **主屏恢复后再读回**　条件允许时尝试把窗口和捕获目标拉回主屏；实际窗口位置与手机画面还要分别检查。

::screen{#sunshine-remote-streaming-capture-failover-05 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 worker新鲜但GPU证据阻断，客户端Unknown（未验证）；真实切换和手机验收仍未完成 关键规则与设计选择 1 Sunshine 捕获源 output_name "
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 worker新鲜但GPU证据阻断，客户端Unknown（未验证）；真实切换和手机验收仍未完成 关键规则与设计选择 1 Sunshine 捕获源 output_name "
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
     "text_ref": "10月11日13:33零写入体检：blocked，原因capture-outpu"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. Sunshine 捕获源 output_name 只使用通过 PnP（即插即用设备）/EDID（扩展显示标识数据）计算的 UUIDv5（基于命名空间的稳定标识），不使用容易随热插拔改变的 DISPLAY 编号。体检按这个标识在活动屏里严格匹配，正好一个才算在线。",
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
     "text_ref": "10月11日13:33零写入体检：blocked，原因capture-outpu"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. Sunshine 捕获源 output_name 只使用通过 PnP（即插即用设备）/EDID（扩展显示标识数据）计算的 UUIDv5（基于命名空间的稳定标识），不使用容易随热插拔改变的 DISPLAY 编号。体检按这个标识在活动屏里严格匹配，正好一个才算在线。",
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
10 月 11 日 13:33 零写入体检：blocked，原因 capture-output-offline-or-ambiguous；GPU 允许（只有一次上次非正常关机记录）；会话 Active（0 个 TCP、3 个 UDP 串流端点）；守护心跳新鲜、源码一致，动作为“等待串流空闲”；客户端画面 Unknown（未验证）。真实切换和手机验收仍未完成

## 关键规则与设计选择

1. Sunshine 捕获源 output_name 只使用通过 PnP（即插即用设备）/EDID（扩展显示标识数据）计算的 UUIDv5（基于命名空间的稳定标识），不使用容易随热插拔改变的 DISPLAY 编号。体检按这个标识在活动屏里严格匹配，正好一个才算在线。

2. 物理主屏连续缺失 15 秒（排除瞬时休眠与驱动重置）且串流明确空闲 5 秒才切到 VDD，防止正常看视频时发生误切。

3. 记录普通窗口的 HWND（窗口句柄）、PID（进程标识）与真实放置矩形；11–13 像素只是当前常见观测，代码按窗口 DPI 动态计算边框容差，取不到时回退 16 像素。

4. LIAN LI 水冷屏（TUR0000）与 HS2 机箱屏严格列为本项目黑名单：捕获选择和本项目的窗口迁移动作不以它们为目标。

5. 窗口恢复记录如果是空的、全零、不是对象、格式或时间坏了，就判为 capture-state-invalid，停止自动切换，不用空白默认状态盖掉原记录；先保住现场，核对上一份有效记录（.previous）和当前窗口、屏、会话、显卡后才恢复。旧记录不会自动获得搬动当前窗口的资格。

6. 主屏优先守护是日常默认；人工无头入口只在明确应急选择时写配置并留备份，不负责重启、手机验收或恢复日常策略。

## 当前怎样实现

- sunshine-capture-failover.psm1 实现活动显示快照采集、EDID 校验、Sunshine 配置 CAS（比较并交换）原子更新与 Win32 窗口位置控制。

- Invoke-SunshineCaptureFailover.ps1 作为常驻轮询工作器（3 秒稳态轮询，等待期 250ms 快速复核），用全局互斥锁避免重复实例，并让隐藏父启动器监视生命周期。

::screen{#sunshine-remote-streaming-capture-failover-06 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-06",
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
     "text_ref": "- 提交时把 pending（待处理）与 applied（已应用）状态分开：配置 CAS 后在同一 20 秒期限内重启并检查服务；失败时只有当前文件仍是本轮写入的版本才回滚到变更前内容，缺本轮指纹或已被别处改过就拒绝覆盖并报告未恢复。窗口逐个复核身份、来源区域与写后位置，单个失败不阻塞其余窗口。",
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
     "text_ref": "- 提交时把 pending（待处理）与 applied（已应用）状态分开：配置 CAS 后在同一 20 秒期限内重启并检查服务；失败时只有当前文件仍是本轮写入的版本才回滚到变更前内容，缺本轮指纹或已被别处改过就拒绝覆盖并报告未恢复。窗口逐个复核身份、来源区域与写后位置，单个失败不阻塞其余窗口。",
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

- 提交时把 pending（待处理）与 applied（已应用）状态分开：配置 CAS 后在同一 20 秒期限内重启并检查服务；失败时只有当前文件仍是本轮写入的版本才回滚到变更前内容，缺本轮指纹或已被别处改过就拒绝覆盖并报告未恢复。窗口逐个复核身份、来源区域与写后位置，单个失败不阻塞其余窗口。

- 状态文件损坏时（空、全零、非对象、格式或时间坏）停在 capture-state-invalid；持久记录用候选文件刷新、原子替换并回读，保留一份有效的 .previous 作恢复点。

- Install-SunshineCaptureFailoverTask.ps1 将其注册为当前交互用户登录时触发的 Highest（最高权限）任务，配合 VBS（Visual Basic 脚本）启动器无窗运行并监视父进程。

- Set-SunshineHeadlessConfig.ps1 提供独立的人工应急固定 VDD 路径：默认预览、显式 Apply 才写，只改受管配置键，保留原文件备份，同样要过显卡、会话、唯一 VDD 身份和 CAS 这几关，不冒充已重载或已显示。

- tests/Test-SunshineCaptureFailover.ps1 现定义 72 个测试（9 月 18 日有回执时是 67 个，后来新增 3 个损坏状态场景等），覆盖已建模的身份、去抖、会话、窗口与故障分支。

- 会话检测 Active/Idle/Unknown 三态，端口随 Sunshine 当前 base-port 解析；缺监听、失败或进程身份不符为 Unknown（未验证）。短写操作共用互斥，runtime（运行环境）/worker-health.json 绑定 PID、创建时间、源码 SHA 和上次完整循环，旧心跳不能续成健康。

## 执行流程

1. 常驻守护器每 3 秒获取一次系统显示快照与串流会话状态（RTSP、TCP 和 UDP 端点）。

2. 若物理主屏正常在线，将任何意外漂入或新建在 VDD 区域的普通窗口持续拉回主屏。

::screen{#sunshine-remote-streaming-capture-failover-technical-03 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-technical-03",
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
     "text_ref": "3. 若物理主屏离线，启动 15 秒缺失计时器；计时满、串流明确空闲、近期显卡安静且状态记录有效后，记录主屏普通窗口几何位置，将 output_name 原子替换为 VDD GUID 并迁移窗口。",
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
     "text_ref": "3. 若物理主屏离线，启动 15 秒缺失计时器；计时满、串流明确空闲、近期显卡安静且状态记录有效后，记录主屏普通窗口几何位置，将 output_name 原子替换为 VDD GUID 并迁移窗口。",
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

3. 若物理主屏离线，启动 15 秒缺失计时器；计时满、串流明确空闲、近期显卡安静且状态记录有效后，记录主屏普通窗口几何位置，将 output_name 原子替换为 VDD GUID 并迁移窗口。

4. 主屏重新被证明健康并通过去抖后，守护程序只对符合身份与区域门的普通窗口执行拉回，再恢复物理捕获目标；实际结果需逐窗口与配置回读。

::screen{#sunshine-remote-streaming-capture-failover-07 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-07",
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
|---|---|
| EDID（扩展显示标识数据） | 显示器提供的身份信息；项目把它与同一次 PnP/活动输出证据组合为稳定标识，并在每次操作前重新核对。 |
| CAS（Compare-And-Swap） | 原子替换机制；写入配置文件前先校验原有内容是否被修改，防止多进程并发冲突覆写。回滚时也要先确认文件仍是本轮写的版本。 |
| 串流空闲判断 | 先看 RTSP（建连通道）监听、进程和 TCP 会话；TCP 没有会话时，再看同一个 Sunshine 的视频、控制、音频 UDP 端点。UDP 还在就算“进行中”，查询失败或归属冲突算 Unknown（未验证）；只有明确空闲并连续 5 秒才累计。实际端口来自当前 base-port，不固定猜默认值。 |

## 专业定义

它处理“远程端只剩壁纸、窗口落在看不见的虚拟屏”这类事故：先确认物理主屏真的离线、串流真的空闲、近期显卡安静、窗口记录完好，再决定是否允许 failover（故障转移）。

解决什么

防止多屏混用与关屏串流时，failover（故障转移）状态机出现画面丢失、窗口错位、副屏被夺取、正在串流的人被踢掉、拿损坏记录乱搬窗，或显卡驱动连锁崩溃。

::screen{#sunshine-remote-streaming-capture-failover-08 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-08",
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
     "text_ref": "- 不通过系统级复制/镜像显示器实现画面同步，杜绝模式冲突；守护本身也不改 Windows 显示拓扑。",
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
     "text_ref": "- 不通过系统级复制/镜像显示器实现画面同步，杜绝模式冲突；守护本身也不改 Windows 显示拓扑。",
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

防止多屏混用与关屏串流时，failover（故障转移）状态机出现画面丢失、窗口错位、副屏被夺取或显卡驱动连锁崩溃。

## 边界

- 不通过系统级复制/镜像显示器实现画面同步，杜绝模式冲突；守护本身也不改 Windows 显示拓扑。

- 不触碰 Shell 桌面底栏、输入法、全屏独占游戏或无法证明归属的未知句柄窗口；其他程序或 Windows 自己怎么摆窗口，不在本项目保证内。

- 近 15 分钟内有显卡故障时，停止切换捕获目标和往虚拟屏搬窗；只有从虚拟屏回到健康物理主屏的窄范围窗口恢复，可以另行核对放行。

- 只调虚拟屏参数修不了这次的阻塞：配置里记的输出在当前活动屏里找不到对应，参数入口不写 output_name。

## 失败与恢复

- **检测到多于一个同名 VDD 或存在未知虚拟驱动**　拒绝推断目标，执行失败关闭，保持当前配置不动并记录错误日志。

- **配置要抓的屏在活动屏里找不到唯一对应**　体检报 blocked（capture-output-offline-or-ambiguous），守护等待串流空闲后再处理；这只说明配置和当前活动屏对不上，不等于虚拟屏坏了，也不推断手机一定黑屏。10 月 11 日就是这种情况。

- **近 15 分钟内有 BugCheck、显示内核错误或匹配的 WER 图形故障**　保持 BlockedByGpuStability，不切捕获或往虚拟屏搬窗；只有空闲且证明来自 VDD、目标是健康物理主屏的普通窗口单向回迁可独立处理。单独一次 Kernel-Power 41（非正常关机）只记诊断，不挡整次开机；WER 按类型参数和报告编号去重，虚拟驱动自检报告不算显卡崩溃；事件查询本身出错仍挡。

- **窗口恢复记录损坏**　停在 capture-state-invalid，不自动切换、不用空白记录覆盖；核对有效的上一份记录和当前现场后再恢复。

::screen{#sunshine-remote-streaming-capture-failover-failure-02 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-failure-02",
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
     "text_ref": "- **单轮显示枚举瞬时失败（如驱动重置）**　代码把它记为 cycle-transient-failure 并留待下一轮；自动化测试覆盖了不让该异常直接终止守护器的分支。",
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
     "text_ref": "- **单轮显示枚举瞬时失败（如驱动重置）**　代码把它记为 cycle-transient-failure 并留待下一轮；自动化测试覆盖了不让该异常直接终止守护器的分支。",
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

- **单轮显示枚举瞬时失败（如驱动重置）**　代码把它记为 cycle-transient-failure 并留待下一轮；自动化测试覆盖了不让该异常直接终止守护器的分支。

- **人工无头写入前 VDD 身份或原配置变化**　拒绝覆盖；若已写入，仅在当前仍匹配本轮结果且 GPU、会话、身份门允许时回滚，未恢复项单独报告。工具本身不自动重启 Sunshine，也不把备份冒充恢复成功。

::screen{#sunshine-remote-streaming-capture-failover-09 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-capture-failover-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 虚拟屏参数",
    "href": "/projects/sunshine-remote-streaming/vdd-display-settings/"
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
     "text_ref": "- 9 月 18 日 14:07 有原始回执：当时 67/67 通过（涵盖设备快照、GUID 绑定、去抖、CAS 写入、BugCheck/WER/GPU 事件门和窗口计划）；现定义 72 个，本轮没有运行。它们是合成分支，不是物理串流。",
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
     "text_ref": "- 9 月 18 日 14:07 有原始回执：当时 67/67 通过（涵盖设备快照、GUID 绑定、去抖、CAS 写入、BugCheck/WER/GPU 事件门和窗口计划）；现定义 72 个，本轮没有运行。它们是合成分支，不是物理串流。",
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

核心状态机、窗口几何与原子配置读写引擎（sunshine-capture-failover.psm1）

常驻轮询执行体与空闲门检测（Invoke-SunshineCaptureFailover.ps1）

显卡近期故障门与串流会话判断（sunshine-safety.psm1）

零写入主机体检（Get-SunshineHealth.ps1 -Json）

人工应急固定 VDD 的只读预览与显式写入入口（Set-SunshineHeadlessConfig.ps1）

运行说明与会话判断说明（docs/operations.md、docs/stream-session-detection.md）

窗口恢复记录及其上一份有效恢复点（state 与 .previous）

自动化回归测试套件（当前定义 72 个）

## 如何验证

- 9 月 18 日 14:07 有原始回执：当时 67/67 通过（涵盖设备快照、GUID 绑定、去抖、CAS 写入、BugCheck/WER/GPU 事件门和窗口计划）；现定义 72 个，本轮没有运行。它们是合成分支，不是物理串流。

- 10 月 11 日 13:33 截止前体检：blocked，配置要抓的屏不在线或认不唯一（ConfiguredTargetOnline=false），捕获模式和待切目标都是虚拟屏；体检按配置的输出编号在活动屏里严格匹配，它没有看客户端画面，也不能证明虚拟屏驱动坏了。客户端画面和输入未知。

- 历史记录：2026年9月4日曾发现 output_name 与活动输出不匹配，并被当次 GPU 稳定门阻断；9 月 18 日那次开机又因显卡故障记录停止切换。这些是带日期的旧情况，现在的显卡门只看近 15 分钟，10 月 11 日显卡这关是放行的。

- 窗口恢复状态 9 月 14 日的记录（Mode=Vdd、PendingTargetKind=Physical）保留为历史；10 月 11 日 13:33 体检时为 Mode=Vdd、PendingTargetKind=Vdd。状态里记的上次目标不能代替配置里当前要抓的屏，状态新鲜也不证明捕获选择或窗口迁移已通过。

- 系统计划任务 SunshineCaptureFailover-Interactive 随 10 月 10 日 11:06 登录启动并常驻；10 月 11 日 13:33 体检时守护心跳新鲜、源码一致。

## 与其他模块的关系

为整个远程串流系统提供坚固的显示可用性基石；与 VDD 独立显示参数管理及传输层紧密协作。
