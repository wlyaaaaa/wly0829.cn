---
{
 "title": "可见暂停、会话守护与故障恢复",
 "kind": "project",
 "url": "/projects/meshclip-kit/silent-watchdog-and-session-lifecycle/",
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
  "page": "meshclip-kit-silent-watchdog-and-session-lifecycle",
  "kind": "project",
  "title": "可见暂停、会话守护与故障恢复",
  "url": "/projects/meshclip-kit/silent-watchdog-and-session-lifecycle/",
  "parent": "meshclip-kit",
  "status_line": {
   "state": "冻结",
   "as_of": "2026-10-11",
   "source": "源码核至 9 月 29 日提交 61fa792e，运行情况取北京时间 10 月 11 日 13:33 的一次主机自检；冻结依据 E279 冻结名单（停用留档），GitHub 仓库 10 月 21 日归档、本机副本已删，归档后看门狗与计划任务实际状态未查",
   "last": {
    "label": "快照核对",
    "at": "2026-10-11"
   }
  }
 },
 "source": {
  "page": "sources/pages/meshclip-kit-silent-watchdog-and-session-lifecycle/page.json",
  "sha256": "a095e91963c31c75ea30d2bb559e0092e058c91808ededcd281be71cf3d505f4",
  "converted_at_beijing": "2026-10-22T08:32:32+08:00"
 }
}
---

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-01 section="top"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-01",
  "section": "top",
  "title": "可见暂停、会话守护与故障恢复",
  "links": [
   {
    "text": "回到项目 → 双机剪贴板",
    "href": "/projects/meshclip-kit/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/meshclip-kit"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/meshclip-kit/#ai-brief"
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
     "text_ref": "可见暂停、会话守护与故障恢复",
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
       "text": "冻结 · 快照核对 10 月 11 日",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码核至 9 月 29 日提交 61fa792e，运行情况取北京时间 10 月 11 日 13:33 的一次主机自检；冻结依据 E279 冻结名单（停用留档），GitHub 仓库 10 月 21 日归档、本机副本已删，归档后看门狗与计划任务实际状态未查",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 双机剪贴板〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "常开的主机上，托盘意外退出时自动尝试拉起，控制中心同时告诉我最近心跳、下一次检查和正在等什么。暂时不想自动重开时可以暂停，而不用关闭现有KDE连接或Tailscale。副机是按需打开的，我退出 KDE 就是不用了，不会被拉起来；真正传输仍由两端应用完成。",
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
     "text_ref": "可见暂停、会话守护与故障恢复",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "冻结 · 快照核对 10 月 11 日",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码核至 9 月 29 日提交 61fa792e，运行情况取北京时间 10 月 11 日 13:33 的一次主机自检；冻结依据 E279 冻结名单（停用留档），GitHub 仓库 10 月 21 日归档、本机副本已删，归档后看门狗与计划任务实际状态未查"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 双机剪贴板〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "常开的主机上，托盘意外退出时自动尝试拉起，控制中心同时告诉我最近心跳、下一次检查和正在等什么。暂时不想自动重开时可以暂停，而不用关闭现有KDE连接或Tailscale。副机是按需打开的，我退出 KDE 就是不用了，不会被拉起来；真正传输仍由两端应用完成。"
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
   "asset": "_library/module-illustrations/meshclip-kit/silent-watchdog-and-session-lifecycle-v01.png",
   "key": "双机互传",
   "source_phrase": "右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。",
   "sha256": "c11d863f985f2abcd2961722e3837df70c06c7f16193b07c016905f4c44c560a",
   "status": "ready"
  }
 ]
}
```

# 可见暂停、会话守护与故障恢复

〔回到项目 → 双机剪贴板〕　〔GitHub〕　〔复制 AI 续作说明〕

MeshClip Kit · 功能说明（项目已冻结）

常开的主机上，托盘意外退出时自动尝试拉起，控制中心同时告诉我最近心跳、下一次检查和正在等什么。暂时不想自动重开时可以暂停，而不用关闭现有KDE连接或Tailscale。副机是按需打开的，我退出 KDE 就是不用了，不会被拉起来；真正传输仍由两端应用完成。

当前情况：这是双机剪贴板冻结前的一项功能。项目已列入冻结名单（停用留档），GitHub 仓库 10 月 21 日归档、本机副本已删；按规则冻结项目自己的计划任务要停用，但主机上的看门狗、监督任务和登录启动实际停没停，这次没查，是 Unknown。本机仓库没了，控制中心也不再有可双击的入口。冻结前最后一次核对：10 月 11 日 13:33 主机的登录启动、监督任务、单个看门狗和新鲜心跳检查通过；副机按需使用，本来就不装这条守护链。

项目快照核对于 2026-10-11（北京时间），运行情况依据当天 13:33 的主机自检；10 月 21 日归档后没有再查。具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库（已归档，只读）

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-02 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 常开的主机上托盘退出后需要恢复，但守护程序自己也可能退出。现有双层机制分别检查两类进程，不接管其他网络或应用配置；副机按需打开，不需要这套守护。 ### 举个实际例子 “今天先别自动重开KDE，"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 常开的主机上托盘退出后需要恢复，但守护程序自己也可能退出。现有双层机制分别检查两类进程，不接管其他网络或应用配置；副机按需打开，不需要这套守护。 ### 举个实际例子 “今天先别自动重开KDE，"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 ### 为什么需要它 常开的主机上托盘退出后需要恢复，但守护程序自己也可能退出。现有双层机制分别检查两类进程，不接管其他网络或应用配置；副机按需打开，不需要这套守护。 ### 举个实际例子 “今天先别自动重开KDE，"
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

### 为什么需要它

常开的主机上托盘退出后需要恢复，但守护程序自己也可能退出。这套双层机制分别检查两类进程，不接管其他网络或应用配置；副机按需打开，不需要这套守护。

### 举个实际例子

冻结前可以说：“今天先别自动重开KDE，连接还在就继续用。”打开控制中心暂停到手动恢复；这只改变下一次守护检查的拉起意图，关闭窗口不会结束既有守护。项目冻结后，AI 不再操作这套守护，也不再排查它为什么没拉起。

### 最后我会得到什么

控制中心显示最近检查、下一次检查及暂停状态；托盘意外退出时会尝试恢复，并明确显示已恢复或启动失败。持续故障仍要按原因处理。这是冻结前的表现。

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-03 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-03",
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

### 正常时

主机上当前用户已登录，守护程序与原有任务运行，最近检查有效；副机没开 KDE、没有守护也是正常状态。这只证明托盘恢复链，不证明文件传输。

### 发现问题时

托盘刚退出而下一轮尚未执行时，控制中心显示等待；若已暂停，就按本人选择保持不自动拉起。

### 入口不可用或证据不足时

电脑尚未进入本人的 Windows 桌面会话时，这条守护链不会在登录前运行。项目冻结后，守护链在主机上还在不在跑没查，不能当成仍在守护，也不能当成已确认停掉。

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-04 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-04",
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
     "text_ref": "在主机上日常双击“MeshClip控制中心.vbs”看心跳、下一检查、暂停和恢复；需要分层排障再运行 scripts/doctor.ps1 -Peer。副机要同步时手动打开 KDE，用完退出即可。",
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
     "text_ref": "1. **随登录启动**　主机上，现有入口在当前会话启动一次看门狗，重复实例会退出；副机按需部署，不随登录启动。",
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
     "text_ref": "在主机上日常双击“MeshClip控制中心.vbs”看心跳、下一检查、暂停和恢复；需要分层排障再运行 scripts/doctor.ps1 -Peer。副机要同步时手动打开 KDE，用完退出即可。"
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
     "text_ref": "1. **随登录启动**　主机上，现有入口在当前会话启动一次看门狗，重复实例会退出；副机按需部署，不随登录启动。",
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

在主机上日常双击“MeshClip控制中心.vbs”看心跳、下一检查、暂停和恢复；需要分层排障再运行 scripts/doctor.ps1 -Peer。副机要同步时手动打开 KDE，用完退出即可。（这是冻结前的入口；现在本机仓库副本已删，这些入口只在 GitHub 归档仓库里留着。）

### 需要准备什么

- 要看的是常开主机还是按需副机（副机本来就没有守护）

- 是否暂停自动重开及暂停多久

- 有故障时的大致发生时间

### 从开始到拿到结果

1. **随登录启动**　主机上，现有入口在当前会话启动一次看门狗，重复实例会退出；副机按需部署，不随登录启动。

2. **控制中心看状态**　打开“MeshClip控制中心.vbs”看最近心跳、下次检查和待恢复事项；可暂停一小时或直到手动恢复，现有 KDE 连接仍在。

3. **失踪时尝试恢复**　未暂停时它按周期检查托盘，缺失才尝试启动并记录是否真的出现。

4. **问题交回**　doctor 区分网络、配对、任务和进程状态，也认得副机的按需模式：副机 KDE 关着、没有启动入口、旧心跳过期都不算故障，反而在副机上出现看门狗或不该有的启动入口会报 FAIL。睡眠、未登录或反复崩溃不能被看门狗当作已修复。

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-05 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机登录启动、普通权限任务、单进程和新鲜心跳通过；副机按需，不在此列 ### 关键规则与设计选择 1. 只处理当前会话托盘缺"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机登录启动、普通权限任务、单进程和新鲜心跳通过；副机按需，不在此列 ### 关键规则与设计选择 1. 只处理当前会话托盘缺"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机登录启动、普通权限任务、单进程和新鲜心跳通过；副机按需，不在此列 ### 关键规则与设计选择 1. 只处理当前会话托盘缺"
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
     "text_ref": "1. 只处理当前会话托盘缺失，不改Tailscale、防火墙、配对、插件和剪贴板。",
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
     "text_ref": "1. 只处理当前会话托盘缺失，不改Tailscale、防火墙、配对、插件和剪贴板。",
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

10 月 11 日 13:33 主机登录启动、普通权限任务、单进程和新鲜心跳通过；副机按需，不在此列

### 关键规则与设计选择

1. 只处理当前会话托盘缺失，不改Tailscale、防火墙、配对、插件和剪贴板。

2. 既有VBS启动器负责隐藏控制台；普通权限任务不因故障升为Highest。

3. 同会话互斥锁避免多实例。监督任务换新实例时新旧会短暂重叠，9 月 29 日起诊断会忽略刚启动不到 5 秒的那个，避免误报多实例；两个都已运行超过 5 秒仍报歧义。

4. 已安装且未变更的启动/任务由项目管理；持续应用失败应查应用，不缩短间隔无限重启。

## 当前怎样实现

- watch-kdeconnect.ps1 依托 Mutex 与 60 秒循环实现托盘指示器单实例守护。

- watch-kdeconnect-hidden.vbs 调用 WScript.Shell Run(command, 0, False) 彻底隐窗。

- New-MeshClipWatchdogTask 注册有限权限、PT2M 重复周期的计划任务守护者。

- scripts/control-center.ps1显示守护意图、最近心跳、下次预计检查和待恢复记录；暂停一小时、暂停直到恢复和Resume共用当前用户状态，下一轮观察生效。原有低权限Task Scheduler监督器不新增副本，已经运行的旧PowerShell进程需下次启动才加载新函数。

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-06 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-06",
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
     "text_ref": "1. 主机上用户登录后由既有快捷方式或任务隐藏启动看门狗；副机按需模式没有这一步。",
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
     "text_ref": "1. 主机上用户登录后由既有快捷方式或任务隐藏启动看门狗；副机按需模式没有这一步。",
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

## 执行流程

1. 主机上用户登录后由既有快捷方式或任务隐藏启动看门狗；副机按需模式没有这一步。

2. 获取Local\MeshClipKit-KdeConnect-Watchdog互斥锁，未获得则退出。

3. 首次等待15秒；逐次检查当前SessionId的托盘进程。

4. 缺失时尝试启动，5秒后记录Restarted或StartFailed；下一轮默认等60秒。

5. 每2分钟原任务独立检查守护启动链，不唤醒睡眠电脑。

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-07 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-07",
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
| SessionId（会话标识） | Windows 系统分配给当前登录交互式桌面的唯一会话编号，确保看门狗仅管理本桌面的托盘程序。 |
| 双层自愈体系 | 看门狗守护托盘程序（分钟级），计划任务守护看门狗自身（两分钟级）的层级容错架构。 |

## 专业定义

VBS 无窗后台巡检与 Task Scheduler 双层自愈

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-08 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-08",
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
     "text_ref": "- **可信托盘无法启动**：写StartFailed，doctor据进程和心跳报告失败。",
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
     "text_ref": "- **可信托盘无法启动**：写StartFailed，doctor据进程和心跳报告失败。",
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

睡眠或尚未登录时没有可用用户会话；持续应用启动失败记录StartFailed。锁屏但仍登录不等于注销。

## 边界

- 仅在当前用户已登录的会话中运行；锁屏后会话可能仍存在，睡眠时不唤醒。

- 不提供登录前剪贴板或文件接收，也不自动修复持续应用崩溃。

## 失败与恢复

- **可信托盘无法启动**：写StartFailed，doctor据进程和心跳报告失败。

- **看门狗退出**：原有任务在后续触发时尝试恢复，调度不是120秒硬保证。

::screen{#meshclip-kit-silent-watchdog-and-session-lifecycle-09 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-silent-watchdog-and-session-lifecycle-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 设备配对与文件传输",
    "href": "/projects/meshclip-kit/kde-connect-pairing-sync/"
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
     "text_ref": "- `scripts\\watch-kdeconnect.ps1`看门狗轮询与自愈主逻辑",
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
     "text_ref": "- `scripts\\watch-kdeconnect.ps1`看门狗轮询与自愈主逻辑",
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

- `scripts\watch-kdeconnect.ps1`看门狗轮询与自愈主逻辑

- `scripts\watch-kdeconnect-hidden.vbs`无窗口隐藏唤起包装器

- `tests\RepositorySafety.Tests.ps1`看门狗生命周期与零越权安全测试

## 如何验证

- 当前测试源码覆盖计划任务有限权限契约、单实例互斥锁、新旧实例交接不误报与 WhatIf（只读预演）零写副作用；这次没有重新运行测试。

- 10 月 11 日 13:33 主机 doctor 的 KDE watchdog login startup、supervisor 与 runtime（运行环境）三行当次全 PASS。更早一次：9 月 27 日 21:24 主机强制重启，21:26 登录后看门狗把 KDE 拉起，9 月 28 日 21:45 仍在运行（按当时进程启动时间和心跳记录）。完整的双机自然重启验收还没有记录。

## 与其他模块的关系

维护登录后桌面的应用启动链；数据能否流转仍取决于网络、KDE配对和实际接收。
