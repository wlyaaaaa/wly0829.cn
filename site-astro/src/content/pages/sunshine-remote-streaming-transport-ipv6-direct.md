---
{
 "title": "串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）",
 "kind": "project",
 "url": "/projects/sunshine-remote-streaming/transport-ipv6-direct/",
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
  "page": "sunshine-remote-streaming-transport-ipv6-direct",
  "kind": "project",
  "title": "串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）",
  "url": "/projects/sunshine-remote-streaming/transport-ipv6-direct/",
  "parent": "sunshine-remote-streaming",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "源码按 10 月 6 日最后一次提交、两机代理分流按电脑配置（PCConfig）10 月 8–9 日的登记（均早于 10 月 11 日 14:00 截止）；主机网络取截止前最近一次（10 月 10 日）每日检查；今天没有指定手机做路径探测"
  }
 },
 "source": {
  "page": "sources/pages/sunshine-remote-streaming-transport-ipv6-direct/page.json",
  "sha256": "a4e8be9f7e694d7887e623b0d7ccaa71a4944e4e1b53f7ff6f63e90f9d926212",
  "converted_at_beijing": "2026-10-11T19:04:26+08:00"
 }
}
---

::screen{#sunshine-remote-streaming-transport-ipv6-direct-01 section="top"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-01",
  "section": "top",
  "title": "串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）",
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
     "text_ref": "串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 6 日最后一次提交、两机代理分流按电脑配置（PCConfig）10 月 8–9 日的登记（均早于 10 月 11 日 14:00 截止）；主机网络取截止前最近一次（10 月 10 日）每日检查；今天没有指定手机做路径探测",
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
     "text_ref": "人在外面连不上时，不必把 Sunshine、光猫和 Tailscale 混成一个问题：这套入口能先定位本机有没有 IPv6、服务是否登录，再用同一台手机证明当前到底直连还是中继。",
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
     "text_ref": "串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 6 日最后一次提交、两机代理分流按电脑配置（PCConfig）10 月 8–9 日的登记（均早于 10 月 11 日 14:00 截止）；主机网络取截止前最近一次（10 月 10 日）每日检查；今天没有指定手机做路径探测"
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
     "text_ref": "人在外面连不上时，不必把 Sunshine、光猫和 Tailscale 混成一个问题：这套入口能先定位本机有没有 IPv6、服务是否登录，再用同一台手机证明当前到底直连还是中继。"
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
   "asset": "_library/illustrations/modules/sunshine-remote-streaming-transport-ipv6-direct-v6.png",
   "key": "远程主备显示屏",
   "source_phrase": "右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。",
   "sha256": "5a154fda821c2fa5d7dd730a18f634044f5917bfdebeed60585cadc0e4cd0051",
   "status": "ready"
  }
 ]
}
```

# 串流层与传输层分开诊断，用指定 peer（对端）探测确认 IPv6 直连或 DERP（中继服务器）

〔回到项目 → 远程电脑串流〕　〔复制 AI 续作说明〕

Sunshine 远程串流 · 功能说明

人在外面连不上时，不必把 Sunshine、光猫和 Tailscale 混成一个问题：这套入口能先定位本机有没有 IPv6、服务是否登录，再用同一台手机证明当前到底直连还是中继。

**当前情况：**10 月 8 日两台电脑都让 Tailscale 的 UDP 流量绕开代理直连，之后同一网络下直连约 5–9 毫秒，本人确认画面和操作正常，用手机热点连续用了 5 分钟没断。截止前最近一次每日主机检查（10 月 10 日）通过；但没有指定手机做探测，手机此刻走直连、中继还是实际延迟多少，仍然不知道。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-02 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 手机网络和家里网络可能各有阻挡。即使主机有 IPv6，也只有指定手机当次探测才能说明走的是直连、中继还是根本连不上。 举个实际例子 “我在外面连主机很慢。”先对这台手机和主机检查网络路径：若走"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 手机网络和家里网络可能各有阻挡。即使主机有 IPv6，也只有指定手机当次探测才能说明走的是直连、中继还是根本连不上。 举个实际例子 “我在外面连主机很慢。”先对这台手机和主机检查网络路径：若走"
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

手机网络和家里网络可能各有阻挡；电脑上的代理软件也可能把 Tailscale 打洞的 UDP 包带去绕远路。即使主机有 IPv6，也只有指定手机当次探测才能说明走的是直连、经另一台自己的设备中继、经官方中继，还是根本连不上。

## 举个实际例子

“我在外面连主机很慢。”先对这台手机和主机检查网络路径：若走中继，就说明这次没有直连；之后还要在 Moonlight/Artemis 真正看画面。如果主机检查通过、画面却还是卡在“阻塞”，那是抓屏那一层的问题，不是线路。

## 最后我会得到什么

能分别说明本机服务状态和指定手机的连接路径；10 月 8 日的同网和热点结果是那一次的真人记录，今天没有手机端实测，所以不承诺此刻的直连速度或延迟。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-03 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-03",
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

指定手机到主机的当次探测确实返回直连，才称这次直连；直连也可能走 IPv4，不自动等于手机公网 IPv6 直连。实际串流体验仍另验。

## 发现问题时

走中继（官方 DERP 或经另一台已登记设备）时如实报告，画质和延迟需按手机实测调整；探测失败、超时或只有协商文字，都不算直连证据。

## 入口不可用或证据不足时

家里失去网络地址或 Tailscale 没登录时先修连接；恢复后仍需重新探测同一手机。主机网络检查通过、抓屏仍阻塞时，两件事分开报。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-04 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-04",
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
     "text_ref": "在两端 Tailscale 在线后，用项目 verify-path-lite 指定真实 peer 做有界路径检查（旧的 verify-path 只是转到它的兼容入口）；之后由 Moonlight/Artemis 建立一次真实串流才验画面。",
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
     "text_ref": "1. **确认指定手机和主机**　先看两端 Tailscale 是否在线，再对这台手机做当次网络路径检查。",
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
     "text_ref": "在两端 Tailscale 在线后，用项目 verify-path-lite 指定真实 peer 做有界路径检查（旧的 verify-path 只是转到它的兼容入口）；之后由 Moonlight/Artemis 建立一次真实串流才验画面。"
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
     "text_ref": "1. **确认指定手机和主机**　先看两端 Tailscale 是否在线，再对这台手机做当次网络路径检查。",
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

在两端 Tailscale 在线后，用项目 verify-path-lite 指定真实 peer 做有界路径检查（旧的 verify-path 只是转到它的兼容入口）；之后由 Moonlight/Artemis 建立一次真实串流才验画面。

## 需要准备什么

- 要连接的手机和主机

- 想诊断直连、中继还是实际串流故障

## 从开始到拿到结果

1. **确认指定手机和主机**　先看两端 Tailscale 是否在线，再对这台手机做当次网络路径检查。

2. **分清直连和中继**　诊断会报告直连、经另一台已登记设备中继（peer-relay）、经 Tailscale 官方中继或不可达；任何一种都不能单靠主机网络配置猜出来。

3. **实际连接再验画面**　Moonlight/Artemis 连上后再看声音、画面与输入；路径通过仍不等于串流可用。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-05 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 Tailscale 1.102.2运行且无人值守；WLAN未见非链路本地IPv6，手机peer（对端）未测 关键规则与设计选择 1 明确“串流层（Sunshine）尽量"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 Tailscale 1.102.2运行且无人值守；WLAN未见非链路本地IPv6，手机peer（对端）未测 关键规则与设计选择 1 明确“串流层（Sunshine）尽量"
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
     "text_ref": "截止前最近一次每日检查（10月10日14:30）host-only通过；现装Ta"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 明确“串流层（Sunshine）尽量不换，传输层（Tailscale）随时可换”的解耦原则；未来若替换为皎月连等工具，串流配置无需推翻。",
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
     "text_ref": "截止前最近一次每日检查（10月10日14:30）host-only通过；现装Ta"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 明确“串流层（Sunshine）尽量不换，传输层（Tailscale）随时可换”的解耦原则；未来若替换为皎月连等工具，串流配置无需推翻。",
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
截止前最近一次每日检查（10 月 10 日 14:30）host-only 通过；现装 Tailscale 1.104.1，10 月 11 日 13:33 体检时 Tailscale 服务运行、自动启动；手机 peer（对端）没有请求。公网 IPv6 数量 9 月 28 日记为 4 个，之后未重新核对

## 关键规则与设计选择

1. 明确“串流层（Sunshine）尽量不换，传输层（Tailscale）随时可换”的解耦原则；未来若替换为皎月连等工具，串流配置无需推翻。

2. 光猫开启 Native（原生）IPv4/IPv6 双栈，Windows 重新启用 WLAN 的 ms_tcpip6 协议绑定并清理 DisabledComponents 注册表限制。

3. 不在 Windows 服务级别把 Tailscale 写死到固定代理端口，避免代理软件关闭后 Tailscale 持续离线。

4. 两台电脑的代理规则在原来 AI 优先规则之后加两条：tailscaled.exe 和 tailscale.exe 的 UDP 一律直连（DIRECT）。只让打洞和数据走直连，TCP 控制和中继仍按原规则，不是让全部流量绕开代理；回退只要删掉这两条。之后 FlyingBird 那套代理源也加了同样两条（电脑配置 10 月 9 日登记）。

5. 固化 Tailscale 的 unattended（无人值守）模式（ForceDaemon=true），让服务可在锁屏或注销时继续运行；这不证明登录前桌面可被 Sunshine 捕获。

## 当前怎样实现

- 通过移动光猫 PPPoE（宽带拨号协议）原生下发 IPv6 前缀，配合路由器 SLAAC（无状态地址自动配置），让 PC 获得可用于直连尝试的 IPv6 地址。

- repair-stream.ps1 默认只出修复计划；显式选了步骤并加 -Apply 才动手。清除服务级固定代理端口要选 ServiceProxy，涉及重启 Tailscale 还要另加 -AllowNetworkRestart，改网卡 IPv6 要给出精确网卡名；失败按逆序恢复并回读。

- verify-path-lite.ps1 负责日常无侵入巡检和指定 peer 的有界探测（区分 direct、DERP、peer-relay 和未知）；verify-path.ps1 现在只是转到 verify-path-lite -NoWrite 的兼容入口，不再有单独的深度诊断。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-06 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-06",
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
     "text_ref": "- 两台电脑的代理规则对 Tailscale 的 UDP 走直连，10 月 8 日加载时其余规则、DNS、监听和核心不变，只清掉 Tailscale 自己仍挂在代理上的旧 UDP 关联，不断开其他连接、不停代理。",
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
     "text_ref": "- 两台电脑的代理规则对 Tailscale 的 UDP 走直连，10 月 8 日加载时其余规则、DNS、监听和核心不变，只清掉 Tailscale 自己仍挂在代理上的旧 UDP 关联，不断开其他连接、不停代理。",
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

- 两台电脑的代理规则对 Tailscale 的 UDP 走直连，10 月 8 日加载时其余规则、DNS、监听和核心不变，只清掉 Tailscale 自己仍挂在代理上的旧 UDP 关联，不断开其他连接、不停代理。

## 执行流程

1. 手机发起串流请求，通过 Tailscale 控制面交换两端公网端点与 WireGuard 公钥。

2. 两端尝试直接发送 WireGuard UDP 探测包；两台电脑上这部分 UDP 不经过代理。

3. 协商结果可能是 IPv6/IPv4 direct、peer-relay、DERP 或不可达；必须保存当次 peer 探测分类，不能预设会升级为直连。

4. 真实串流建立后，Sunshine 才通过协商好的连接发送视频与音频；今天没有建立新的会话。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-07 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-07",
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
| CGNAT（运营商级网络地址转换） | 千百家庭共享一个公网 IPv4 地址的技术；由于没有独立公网 IPv4，外部无法主动向内部发起连接。 |
| P2P（点对点） | 两端直接通信而不是把数据交给中继；只有指定 peer 的现场探测返回 direct 时，才能确认当前走这条路径。 |
| peer-relay（设备中继） | 数据经另一台已登记在自己 Tailscale 网络里的设备转发；比官方 DERP 中继近，但仍不是直连。 |
| SLAAC（无状态地址自动配置） | IPv6 终端根据路由器通告的前缀自动生成自身公网 IPv6 地址的标准机制。 |
| Unattended Mode（无人值守模式） | Tailscale 在用户注销或未登录 Windows 桌面时仍作为后台系统服务正常工作的配置项。 |

## 专业定义

它不把“服务在线”当成“手机已直连”：先看本机网络，再对指定手机做 peer 探测，最后才说是 direct（直连）、peer-relay（设备中继）、DERP 中继还是不可达。

解决什么

解决复杂 NAT 网络环境下远程打洞困难、海外中继延迟奇高、代理软件把打洞流量带偏，以及网络配置冲突引发的掉线问题。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-08 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-08",
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
     "text_ref": "- 本项目不创建 Sunshine 公网端口映射或 Funnel。每日检查按端口归属分类，10 月 10 日那次 Sunshine 的 Funnel 入口是 0 个；旧检查记过主机另有用户配置的、不属于 Sunshine 的 Funnel。这不等于整台电脑没有任何公网暴露。",
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
     "text_ref": "- 本项目不创建 Sunshine 公网端口映射或 Funnel。每日检查按端口归属分类，10 月 10 日那次 Sunshine 的 Funnel 入口是 0 个；旧检查记过主机另有用户配置的、不属于 Sunshine 的 Funnel。这不等于整台电脑没有任何公网暴露。",
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

解决复杂 NAT 网络环境下远程打洞困难、海外中继延迟奇高、以及网络配置冲突引发的掉线问题。

## 边界

- 本项目不创建 Sunshine 公网端口映射或 Funnel。每日检查按端口归属分类，10 月 10 日那次 Sunshine 的 Funnel 入口是 0 个；旧检查记过主机另有用户配置的、不属于 Sunshine 的 Funnel。这不等于整台电脑没有任何公网暴露。

- 私网是正常连接的起点，但本轮没有读 Tailscale 的访问策略，不能说已经证明只有指定设备能连；0 个 Funnel 也不能推到所有公网 IPv6 都被防火墙挡住。

- 公开文档与脚本中绝对不出现真实的私人 Tailnet 域名或完整的个人 IPv6 地址。

- 不破坏本机其他依赖特定代理通道的日常网络需求；分流只动 Tailscale 自己的 UDP。

## 失败与恢复

- **Tailscale 陷入 NoState 掉登录状态**　先让 repair-stream.ps1 出计划，确认后选 ServiceProxy 并加 -Apply（需要重启时另加 -AllowNetworkRestart），清除固定代理端口覆盖，重新拉起服务并验证登录状态。

- **光猫重启后失去公网 IPv6 前缀**　登录网关确认 Native 双栈状态，网卡重新连接以重新获取 SLAAC 地址。

- **手机端检测到流量走 DERP 中继**　先确认两台电脑的 Tailscale UDP 直连规则还在，再排查手机蜂窝是否被限制 IPv6，重新发起连接以促进 P2P 升级。

::screen{#sunshine-remote-streaming-transport-ipv6-direct-09 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-transport-ipv6-direct-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 虚拟屏参数",
    "href": "/projects/sunshine-remote-streaming/vdd-display-settings/"
   },
   {
    "text": "下一个模块 码率与编码",
    "href": "/projects/sunshine-remote-streaming/bitrate-codec-strategy/"
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
     "text_ref": "- 10 月 8 日真人联网：两机加载 UDP 直连规则后，同一网络下直连约 5–9 毫秒，Sunshine 信息查询约 27–28 毫秒（这不是画面端到端延迟）；本人确认同网画面与操作正常，手机热点连续使用 5 分钟无断连。这不证明所有网络始终直连，也不代表手机蜂窝 IPv6 当前路线或虚拟屏故障转移。",
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
     "text_ref": "- 10 月 8 日真人联网：两机加载 UDP 直连规则后，同一网络下直连约 5–9 毫秒，Sunshine 信息查询约 27–28 毫秒（这不是画面端到端延迟）；本人确认同网画面与操作正常，手机热点连续使用 5 分钟无断连。这不证明所有网络始终直连，也不代表手机蜂窝 IPv6 当前路线或虚拟屏故障转移。",
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

传输层与服务修复入口：默认计划、显式步骤与 -Apply（repair-stream.ps1）

指定 peer 路径诊断与日常主机检查（verify-path-lite.ps1；verify-path.ps1 为兼容入口）

每日无感知路径与编码能力巡检任务

两机 Tailscale UDP 直连分流规则与回退（电脑配置 PCConfig 的串流维护与网络恢复说明）

## 如何验证

- 10 月 8 日真人联网：两机加载 UDP 直连规则后，同一网络下直连约 5–9 毫秒，Sunshine 信息查询约 27–28 毫秒（这不是画面端到端延迟）；本人确认同网画面与操作正常，手机热点连续使用 5 分钟无断连。这不证明所有网络始终直连，也不代表手机蜂窝 IPv6 当前路线或虚拟屏故障转移。

- 每日主机检查只覆盖主机：Tailscale 在线、无人值守开启；peer 未请求，路径和延迟为未知。2026-09-13 与 9 月 14 日的 Running/Auto 记录保留为历史。

- 版本：现装 Tailscale 1.104.1；9 月 4 日回读的 1.102.2 为当时版本。

- 每日巡检现在每天北京时间 14:30 运行；9 月 18 日到 10 月 10 日共 23 天日常记录都是 host-only 通过（9 月 18 日另有 4 次手工观察不计入）；它不提供 peer，所以当前直连/DERP 路线未证。

- 公开入口按端口归属分类：10 月 10 日 Sunshine 0 个；不输出端点地址。

## 与其他模块的关系

为串流链路提供可分层诊断的传输入口；它能证明服务和指定 peer 路径，但不能替代手机画面与输入 E2E（端到端验证）。
