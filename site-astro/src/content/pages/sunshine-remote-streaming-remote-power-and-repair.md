---
{
 "title": "比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务",
 "kind": "project",
 "url": "/projects/sunshine-remote-streaming/remote-power-and-repair/",
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
  "page": "sunshine-remote-streaming-remote-power-and-repair",
  "kind": "project",
  "title": "比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务",
  "url": "/projects/sunshine-remote-streaming/remote-power-and-repair/",
  "parent": "sunshine-remote-streaming",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "修复脚本按 10 月 6 日最后一次提交核对（10 月 20 日回读远端无新提交），远程开机按电脑配置（PCConfig）10 月 9 日的登记；服务状态取 10 月 20 日早上只读服务查询，每日检查连续天数仍截至 10 月 11 日（之后未按原口径重核）；AI 没有做断电开机试验"
  }
 },
 "source": {
  "page": "sources/pages/sunshine-remote-streaming-remote-power-and-repair/page.json",
  "sha256": "efe956918bc902dfe0be277ae1bf06caf57723b77887475e15a8b8858d0ce781",
  "converted_at_beijing": "2026-10-30T13:04:19+08:00"
 }
}
---

::screen{#sunshine-remote-streaming-remote-power-and-repair-01 section="top"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-01",
  "section": "top",
  "title": "比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务",
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
     "text_ref": "比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务",
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
     "static_note": "截至 10 月 11 日 · 修复脚本按 10 月 6 日最后一次提交核对（10 月 20 日回读远端无新提交），远程开机按电脑配置（PCConfig）10 月 9 日的登记；服务状态取 10 月 20 日早上只读服务查询，每日检查连续天数仍截至 10 月 11 日（之后未按原口径重核）；AI 没有做断电开机试验",
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
     "text_ref": "电脑已经开着但网络抽风时，有脚本帮助收敛服务与代理残留；电脑彻底关机时，靠的是现有的远程开机或智能插座，那属于电脑配置项目，不能和在线修复混成“一键修复”。",
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
     "text_ref": "比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务",
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
     "static_note": "截至 10 月 11 日 · 修复脚本按 10 月 6 日最后一次提交核对（10 月 20 日回读远端无新提交），远程开机按电脑配置（PCConfig）10 月 9 日的登记；服务状态取 10 月 20 日早上只读服务查询，每日检查连续天数仍截至 10 月 11 日（之后未按原口径重核）；AI 没有做断电开机试验"
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
     "text_ref": "电脑已经开着但网络抽风时，有脚本帮助收敛服务与代理残留；电脑彻底关机时，靠的是现有的远程开机或智能插座，那属于电脑配置项目，不能和在线修复混成“一键修复”。"
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
   "asset": "_library/illustrations/modules/sunshine-remote-streaming-remote-power-and-repair-v01.png",
   "key": "远程主备显示屏",
   "source_phrase": "右上一幅水彩插画：左边一张办公桌上放着一台笔记本，屏幕里是家里主机的桌面，屏幕角上画 Moonlight 标志；笔记本旁边一部手机，屏幕里是同一个桌面的缩小版；一条绿色丝带从笔记本和手机飘向右边，丝带中间画 Tailscale 标志；丝带落进右边一座小房子里的台式机，机箱上画 Sunshine 标志；台式机前的大显示器是暗的（关着），旁边浮着一块半透明、虚线描边的屏幕（备用屏），桌面窗口在这块虚线屏上亮着。",
   "sha256": "57e895b0d23a3a60dce86c4122539b7855f962bffc5652bcf0f3e42ce546eb01",
   "status": "ready"
  }
 ]
}
```

# 比较智能插座 AC（交流电）自启与有线 WoL（网络唤醒），并用脚本修复网络和服务

〔回到项目 → 远程电脑串流〕　〔复制 AI 续作说明〕

Sunshine 远程串流 · 功能说明

电脑已经开着但网络抽风时，有脚本帮助收敛服务与代理残留；电脑彻底关机时，靠的是现有的远程开机或智能插座，那属于电脑配置项目，不能和在线修复混成“一键修复”。

**当前情况：**本人已报告现有远程开机和智能插座开机都能用，插座和路由器都独立供电、不靠这台电脑（记在电脑配置 10 月 9 日的救援说明里）；AI 没有做过断电冷启动试验。电脑开着时，Sunshine 和 Tailscale 服务在运行（10 月 20 日读数）；每日检查最近一次是 10 月 29 日 14:30 通过，只查主机这边，10 月 11 日之后是否天天通过还没核实；软件修复默认只出计划，确认后才动。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#sunshine-remote-streaming-remote-power-and-repair-02 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 无线网卡在关机或睡眠后未必保持可唤醒供电，且 Tailscale 会随主机关机离线；因此不能仅凭在线状态假定外网 WoWLAN 可用。Windows 还可能因代理软件异常退出而留下服务环境变量"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 无线网卡在关机或睡眠后未必保持可唤醒供电，且 Tailscale 会随主机关机离线；因此不能仅凭在线状态假定外网 WoWLAN 可用。Windows 还可能因代理软件异常退出而留下服务环境变量"
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

无线网卡在关机或睡眠后未必保持可唤醒供电，且 Tailscale 会随主机关机离线；因此不能仅凭在线状态假定外网 WoWLAN 可用。Windows 还可能因代理软件异常退出而留下服务环境变量，让 Tailscale 持续停在离线状态。硬件开机与在线修复必须分开处理。

## 举个实际例子

“我想在外地把关机电脑叫醒。”用我已经在用的远程开机或智能插座（见电脑远程控制和电脑配置的救援说明）；电脑起来后，这里负责看 Tailscale 和 Sunshine 有没有起来、网络通不通。“电脑开着但连不上”，就让 AI 先出一份修复计划，我同意后才执行。

## 最后我会得到什么

开机方式的历史比较、在线故障修复脚本（默认计划、确认后执行、失败按原样退回）和每日主机检查；本仓库不实现智能插座或网络唤醒控制器，也不保证手机自动进入桌面。

::screen{#sunshine-remote-streaming-remote-power-and-repair-03 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-03",
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

10 月 20 日早上两项服务在运行、自动启动；每日检查截至 10 月 11 日天天通过，之后的连续覆盖这次没按原口径重核（目前无法证实），只知道 10 月 19 日和 10 月 29 日 14:30 这两次只查主机的检查是通过；本人报告过远程开机可用，但 AI 没有取得一次从断电到手机看到画面的完整记录。

## 发现问题时

网络设置残留或服务异常时，修复脚本只处理选定的范围并回读；失败按逆序恢复，结果不满足就报告失败和没恢复的项，不宣称远程已恢复。

## 入口不可用或证据不足时

主机没电、物理断网或硬件开机条件不存在时，需要先在现场恢复这些基础条件。

::screen{#sunshine-remote-streaming-remote-power-and-repair-04 section="usage"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-04",
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
     "text_ref": "需要远程开机时用现有的远程开机或智能插座（由电脑配置项目登记）；日常用 verify-path-lite 检查服务，故障时先让 repair-stream 出计划，确认后再加 -Apply。",
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
     "text_ref": "1. **先把电脑开起来**　用已在用的远程开机或智能插座；这一段归电脑配置项目，本页不重新替我选硬件方案。",
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
     "text_ref": "需要远程开机时用现有的远程开机或智能插座（由电脑配置项目登记）；日常用 verify-path-lite 检查服务，故障时先让 repair-stream 出计划，确认后再加 -Apply。"
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
     "text_ref": "1. **先把电脑开起来**　用已在用的远程开机或智能插座；这一段归电脑配置项目，本页不重新替我选硬件方案。",
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

需要远程开机时用现有的远程开机或智能插座（由电脑配置项目登记）；日常用 verify-path-lite 检查服务，故障时先让 repair-stream 出计划，确认后再加 -Apply。

## 需要准备什么

- 本次遇到的是开机、发现主机还是画面输入故障

- 需要修复时，同意哪些修复步骤

## 从开始到拿到结果

1. **先把电脑开起来**　用已在用的远程开机或智能插座；这一段归电脑配置项目，本页不重新替我选硬件方案。

2. **电脑启动后查服务**　再看 Tailscale 和 Sunshine 是否运行、网络能否到达；有问题先出修复计划。服务在运行不等于登录前已经有画面。

3. **最后由手机验收**　Moonlight/Artemis 要真正发现、连接、看到画面并试输入；没有完成时保持未知。

::screen{#sunshine-remote-streaming-remote-power-and-repair-05 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 每日巡检最近返回 0；修复脚本存在并有测试；BIOS、WoL 与断电冷开机未验 关键规则与设计选择 1 比较三种远程唤醒路线：优先实测“智能插座 + BIOS 来电自启"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 每日巡检最近返回 0；修复脚本存在并有测试；BIOS、WoL 与断电冷开机未验 关键规则与设计选择 1 比较三种远程唤醒路线：优先实测“智能插座 + BIOS 来电自启"
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
     "text_ref": "1. 远程开机现在用本人已在用的远程开机和智能插座，插座控制和路由器供电都独立于台式机，由电脑配置项目登记；当初比较的三条路线（智能插座 + BIOS 来电自启、有线 Realtek 2.5GbE 网络唤醒、纯无线 WoWLAN 不作默认）保留为历史依据，本仓库不实现开机控制器。",
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
     "text_ref": "1. 远程开机现在用本人已在用的远程开机和智能插座，插座控制和路由器供电都独立于台式机，由电脑配置项目登记；当初比较的三条路线（智能插座 + BIOS 来电自启、有线 Realtek 2.5GbE 网络唤醒、纯无线 WoWLAN 不作默认）保留为历史依据，本仓库不实现开机控制器。",
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

10 月 20 日早上（7:34—7:43 之间只读查询）：SunshineService 与 Tailscale 运行、自动启动；每日检查截至 10 月 11 日共 24 天通过（只查主机），之后是否天天通过没按原口径重核、目前无法证实；10 月 19 日 14:30 有一次通过回执（coverage=host-only，Tailscale Running/Online、无人值守开着，手机路径和交互 unknown）；没有新的修复回执，即没有新的实际修复记录。本人报告远程开机可用；AI 未做 BIOS、WoL 与断电冷开机试验

本轮另读到 10 月 29 日 14:30 的每日检查回执（runtime/network-health.json）：Health=pass、Coverage=host-only、退出码 0，Tailscale Running/Online、无人值守开着、HEVC 与 AV1 10 位编码可用、没有公开的 Sunshine 端口；对端路径、PeerAcceptance 和 StreamingInteraction 仍是 unknown。这只是主机这一侧的一次结果，不补算 10 月 11 日之后的连续天数，也不代替手机或笔记本实际连上看到画面

## 关键规则与设计选择

1. 远程开机现在用本人已在用的远程开机和智能插座，插座控制和路由器供电都独立于台式机，由电脑配置项目登记；当初比较的三条路线（智能插座 + BIOS 来电自启、有线 Realtek 2.5GbE 网络唤醒、纯无线 WoWLAN 不作默认）保留为历史依据，本仓库不实现开机控制器。

2. 坚决不默认开启 Windows 自动登录，守住物理主机的本地身份安全底线；串流服务本身具备系统级捕获能力。

3. repair-stream.ps1 默认只出计划，默认步骤只有服务启动和无人值守两项；清服务级代理残留（ServiceProxy）、网卡 IPv6（AdapterIPv6）、IPv6 策略（IPv6Policy）都要显式选，网卡要给精确名字，重启 Tailscale 另加 -AllowNetworkRestart，IPv6 策略可能要自然重启才生效；加 -Apply 才执行。

4. 每日检查任务现在每天北京时间 14:30 运行；注册时先预检、-Apply 才装，指定交互用户、拒绝 SYSTEM，保持原触发与用户停用意图；注册失败明确报错，不自动创建另一种调度。

## 当前怎样实现

- 远程开机：本人已报告现有远程开机及智能插座开机可用，插座控制不依赖台式机、路由器独立供电（电脑配置 10 月 9 日救援说明）；BIOS 精确设置和有线网络唤醒的当次试验没有做。

- 当初的硬件比较（BIOS 来电自启配合智能插座、有线 Realtek 2.5GbE 魔术包唤醒）记在 6 月的历史 README 里，现行 README 已不含这些章节。

- 网络修改需精确选择 ServiceProxy、AdapterIPv6 或 IPv6Policy；网卡需名称，服务代理重启 Tailscale 还需 AllowNetworkRestart。修复前在项目运行目录保存前像回执，每步更新已改项，失败逆序恢复，回滚不完整就标 rollback-incomplete，不假定恢复默认即成功；任务注册失败不改投另一种触发。

## 执行流程

1. 开机：用本人已在用的远程开机或智能插座把电脑开起来（由电脑配置项目负责）。

::screen{#sunshine-remote-streaming-remote-power-and-repair-06 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-06",
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
     "text_ref": "2. 服务启动：Windows 起来后，Tailscale 与 Sunshine 的 Auto 配置应拉起服务；Running 不等于登录前画面可捕获。",
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
     "text_ref": "2. 服务启动：Windows 起来后，Tailscale 与 Sunshine 的 Auto 配置应拉起服务；Running 不等于登录前画面可捕获。",
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

2. 服务启动：Windows 起来后，Tailscale 与 Sunshine 的 Auto 配置应拉起服务；Running 不等于登录前画面可捕获。

3. 客户端验收：Moonlight/Artemis 需要真实发现、鉴权、进入画面并测试输入；这一段每次都要实际做。

4. 日常维护：每日任务北京时间 14:30 执行 verify-path-lite.ps1，记录服务、编码、无人值守与公网入口归属；出问题时 repair-stream 先出计划。

::screen{#sunshine-remote-streaming-remote-power-and-repair-07 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-07",
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
| Restore on AC Power Loss（来电自动开机） | 主板 BIOS 的电源管理功能；当交流电插头重新通电时，主板自动触发开机信号，无需人按开机按键。 |
| 修复前像与逆序恢复 | 修复前把要改的原值存成一份回执，每改一步就记一步；失败时按相反顺序改回去，改不回的项单独报告，不假装已经恢复。 |

## 专业定义

它先讲清一个物理事实：电脑关机后，离线的 Tailscale 不能替你送入唤醒包；所以硬件开机交给本人已在用、由电脑配置项目登记的远程开机办法，这里只负责开机后的服务检查和有范围、可退回的在线修复。

解决什么

解决系统更新或网络代理异常导致的服务离线问题，并把关机后的开机和开机后的修复分清楚。

::screen{#sunshine-remote-streaming-remote-power-and-repair-08 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-08",
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
     "text_ref": "- 不强行修改或弱化 Windows 的系统登录密码与锁屏策略，也不为验证去改系统登录。",
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
     "text_ref": "- 不强行修改或弱化 Windows 的系统登录密码与锁屏策略，也不为验证去改系统登录。",
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

解决离家后电脑关机无法唤醒、以及系统更新或网络代理异常导致的服务离线问题。

## 边界

- 不强行修改或弱化 Windows 的系统登录密码与锁屏策略，也不为验证去改系统登录。

- 修复脚本的 ServiceProxy 只清注册表环境变量里 127.0.0.1:7891 这一个固定残留项，保留其余值；它不是两机代理分流的修复器（那两条 UDP 直连规则见传输模块）。

## 失败与恢复

- **远程开机后电脑没起来**　按电脑配置项目的救援说明现场确认插座供电和主板行为；不要远程反复断电尝试。

- **Tailscale 服务无法启动**　先运行 repair-stream.ps1 看计划，入口需要时自动提权（预检也一样）；确认步骤后加 -Apply 才实际修改，网络服务重启还要显式加 -AllowNetworkRestart。检查服务依赖与网络协议绑定，失败项按回执逆序恢复。

::screen{#sunshine-remote-streaming-remote-power-and-repair-09 section="tech"}

```typeset
{
 "screen": {
  "id": "sunshine-remote-streaming-remote-power-and-repair-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 码率与编码",
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
     "text_ref": "- 10 月 11 日 13:33：系统服务 SunshineService 与 Tailscale 均正在运行，启动模式为自动。",
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
     "text_ref": "- 10 月 11 日 13:33：系统服务 SunshineService 与 Tailscale 均正在运行，启动模式为自动。",
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

传输与服务修复工具：默认计划、显式步骤与 -Apply、前像回执（repair-stream.ps1）

日常轻量验证计划任务安装程序（register-sunshine-verify-task.ps1）

远程开机与救援：电脑配置（PCConfig）的桌面卡死救援说明，以及网站的电脑远程控制；WoL 与智能插座原理只在 6 月历史 README 里

串流维护小窗：9 月 26 日撤掉的是开始菜单快捷方式，程序还在，需要时可用 pwsh -NoProfile -File E:\PCConfig\tools\Show-StreamingMaintenance.ps1 -Launch 直接打开，关窗不停守护；停止/恢复监测默认预览，-Apply 才执行

## 如何验证

- 10 月 11 日 13:33：系统服务 SunshineService 与 Tailscale 均正在运行，启动模式为自动。

- 计划任务 SunshineRemote-VerifyPath-Daily 已在册；截止前最近一次 10 月 10 日 14:30，9 月 18 日到 10 月 10 日共 23 天日常记录都通过（只查主机）。旧页的 9 月 13 日 06:30Z 那次为当时记录。手机 peer 探测都被跳过，不证明冷开机或登录前捕获。

- 本人已报告现有远程开机和智能插座开机可用（电脑配置 10 月 9 日登记）；AI 没有做断电试验，也没有证明电脑完全卡死时软件救援一定能执行。

- 项目运行目录里没有新的修复回执，6 月的修复说明只代表当时；脚本和测试存在不等于今天执行过网络修复。

## 与其他模块的关系

把离线开机、Windows 服务启动和在线故障修复拆成三段：开机由电脑配置项目登记的远程开机办法负责（本人报告可用），服务启动和在线修复在本页；当前服务与每日检查有现场证据，断电冷启动和登录前画面仍没有 AI 实测。
