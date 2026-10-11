---
{
 "title": "Tailscale 专用组网与端点精准解析",
 "kind": "project",
 "url": "/projects/meshclip-kit/tailscale-peer-reachability/",
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
  "page": "meshclip-kit-tailscale-peer-reachability",
  "kind": "project",
  "title": "Tailscale 专用组网与端点精准解析",
  "url": "/projects/meshclip-kit/tailscale-peer-reachability/",
  "parent": "meshclip-kit",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码核至 9 月 29 日提交 61fa792e，运行情况取北京时间 10 月 11 日 13:33 的一次主机自检",
   "last": {
    "label": "快照核对",
    "at": "2026-10-11"
   }
  }
 },
 "source": {
  "page": "sources/pages/meshclip-kit-tailscale-peer-reachability/page.json",
  "sha256": "2a763a98827c000b84f4613b6e12cf0a5fcd95a3d2330be5d84eb44af1efdc6e",
  "converted_at_beijing": "2026-10-11T19:07:11+08:00"
 }
}
---

::screen{#meshclip-kit-tailscale-peer-reachability-01 section="top"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-01",
  "section": "top",
  "title": "Tailscale 专用组网与端点精准解析",
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
     "text_ref": "Tailscale 专用组网与端点精准解析",
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
       "text": "偶尔用 · 快照核对 10 月 11 日",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码核至 9 月 29 日提交 61fa792e，运行情况取北京时间 10 月 11 日 13:33 的一次主机自检",
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
     "text_ref": "通常不需要手工路由器端口映射，通过现有 Tailscale 网络连接批准对端，避免另建中继服务。",
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
     "text_ref": "Tailscale 专用组网与端点精准解析",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 快照核对 10 月 11 日",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码核至 9 月 29 日提交 61fa792e，运行情况取北京时间 10 月 11 日 13:33 的一次主机自检"
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
     "text_ref": "通常不需要手工路由器端口映射，通过现有 Tailscale 网络连接批准对端，避免另建中继服务。"
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
   "asset": "_library/module-illustrations/meshclip-kit/tailscale-peer-reachability-v01.png",
   "key": "双机互传",
   "source_phrase": "右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。",
   "sha256": "e1afeb0741e51e0ae9cfe8d0b0cdcf730bce4027c1f7cbb4e3d656e3095ad409",
   "status": "ready"
  }
 ]
}
```

# Tailscale 专用组网与端点精准解析

〔回到项目 → 双机剪贴板〕　〔GitHub〕　〔复制 AI 续作说明〕

MeshClip Kit · 功能说明

通常不需要手工路由器端口映射，通过现有 Tailscale 网络连接批准对端，避免另建中继服务。

当前情况：10 月 11 日 13:33 主机这一端的网络检查通过，那次 ping 到了批准的对端电脑；这只证明能联系到那台电脑，不证明两台已配对，也不证明剪贴板或文件已经传到。

项目快照核对于 2026-10-11（北京时间），运行情况依据当天 13:33 的主机自检；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#meshclip-kit-tailscale-peer-reachability-02 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 跨子网时 KDE 广播发现可能找不到另一台电脑。明确对端地址能让 KDE 主动探测；组网故障和应用配对仍要分开判断。 ## 举个实际例子 “帮我确认这两台已登记的电脑能不能联系到，"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 跨子网时 KDE 广播发现可能找不到另一台电脑。明确对端地址能让 KDE 主动探测；组网故障和应用配对仍要分开判断。 ## 举个实际例子 “帮我确认这两台已登记的电脑能不能联系到，"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 跨子网时 KDE 广播发现可能找不到另一台电脑。明确对端地址能让 KDE 主动探测；组网故障和应用配对仍要分开判断。 ## 举个实际例子 “帮我确认这两台已登记的电脑能不能联系到，"
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

跨子网时 KDE 广播发现可能找不到另一台电脑。明确对端地址能让 KDE 主动探测；组网故障和应用配对仍要分开判断。

## 举个实际例子

“帮我确认这两台已登记的电脑能不能联系到，先不要传文件。”AI核对选中的两台设备和它们的连接地址，再检查指定连接；交回哪一端可达、哪一段失败和依据。能联系到电脑还不代表剪贴板或文件传输已成功。

## 最后我会得到什么

得到准确对端地址及连通性诊断，供后续配置使用；ping成功不是剪贴板和文件验收。

::screen{#meshclip-kit-tailscale-peer-reachability-03 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-03",
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

两台指定电脑都已加入同一 Tailscale 网络并在线，诊断确认能找到对方；文件传输和 KDE 配对仍另验。

## 发现问题时

有多台可能的电脑却没指定目标，或对端离线时停止自动选择，请本人确认要连哪台。

## 入口不可用或证据不足时

Tailscale 未运行或本人尚未通过官方网页登录时，先完成这一步，不尝试绕过身份。

::screen{#meshclip-kit-tailscale-peer-reachability-04 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-04",
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
     "text_ref": "两台电脑开始的方式不一样。常开的主机运行 scripts/install-windows.ps1 做完整部署；按需打开的副机先用 scripts/recover.ps1 -AsJson 查有没有上次没收完尾的改动，再用 scripts/deploy-on-demand.ps1 按核准的提交号（Git 里标记某个版本的 40 位编号）部署，先加 -WhatIf（只预览、不真改）看一遍。两端都经官方浏览器登录 Tailscale，再各自运行 scripts/configure-peer.ps1 -Peer 指定准确对端，用 scripts/doctor.ps1 查可达性。",
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
     "text_ref": "1. **两端上线**　主机核对 Tailscale 服务、本机在线和无人值守设置。副机按需部署时保留已有配对和精确放行，不装看门狗、不自动启动 KDE；发现旧看门狗或被外部改过的设置就先停下。脚本都不会替人登录。",
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
     "text_ref": "两台电脑开始的方式不一样。常开的主机运行 scripts/install-windows.ps1 做完整部署；按需打开的副机先用 scripts/recover.ps1 -AsJson 查有没有上次没收完尾的改动，再用 scripts/deploy-on-demand.ps1 按核准的提交号（Git 里标记某个版本的 40 位编号）部署，先加 -WhatIf（只预览、不真改）看一遍。两端都经官方浏览器登录 Tailscale，再各自运行 scripts/configure-peer.ps1 -Peer 指定准确对端，用 scripts/doctor.ps1 查可达性。"
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
     "text_ref": "1. **两端上线**　主机核对 Tailscale 服务、本机在线和无人值守设置。副机按需部署时保留已有配对和精确放行，不装看门狗、不自动启动 KDE；发现旧看门狗或被外部改过的设置就先停下。脚本都不会替人登录。",
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

两台电脑开始的方式不一样。常开的主机运行 scripts/install-windows.ps1 做完整部署；按需打开的副机先用 scripts/recover.ps1 -AsJson 查有没有上次没收完尾的改动，再用 scripts/deploy-on-demand.ps1 按核准的提交号（Git 里标记某个版本的 40 位编号）部署，先加 -WhatIf（只预览、不真改）看一遍。两端都经官方浏览器登录 Tailscale，再各自运行 scripts/configure-peer.ps1 -Peer 指定准确对端，用 scripts/doctor.ps1 查可达性。

### 需要准备什么

- 要互连的两台 Windows 电脑：一台常开的主机，一台按需打开的副机

- 本人通过官方浏览器完成 Tailnet 登录

### 从开始到拿到结果

1. **两端上线**　主机核对 Tailscale 服务、本机在线和无人值守设置。副机按需部署时保留已有配对和精确放行，不装看门狗、不自动启动 KDE；发现旧看门狗或被外部改过的设置就先停下。脚本都不会替人登录。

2. **选准对端**　两端各自输入准确设备名并检查它在线，避免把相似设备当目标；副机要和主机同步时，再手动打开 KDE。

3. **单独测网络**　doctor 只做 1 次、最多等 5 秒的 ping，结果只有“通了”或“没通／超时”两种，不告诉你这次走的是直连还是中继；网络通过仍要另做 KDE 配对。

::screen{#meshclip-kit-tailscale-peer-reachability-05 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机网络层检查通过；同一次 KDE 应用状态读不出，另算 ### 关键规则与设计选择 1. 同一Tailnet中的批准设备才"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机网络层检查通过；同一次 KDE 应用状态读不出，另算 ### 关键规则与设计选择 1. 同一Tailnet中的批准设备才"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机网络层检查通过；同一次 KDE 应用状态读不出，另算 ### 关键规则与设计选择 1. 同一Tailnet中的批准设备才"
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
     "text_ref": "1. 同一Tailnet中的批准设备才进入配置流程；直连失败可用Tailscale中继，不承诺零公共中继。",
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
     "text_ref": "1. 同一Tailnet中的批准设备才进入配置流程；直连失败可用Tailscale中继，不承诺零公共中继。",
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

10 月 11 日 13:33 主机网络层检查通过；同一次 KDE 应用状态读不出，另算

### 关键规则与设计选择

1. 同一Tailnet中的批准设备才进入配置流程；直连失败可用Tailscale中继，不承诺零公共中继。

2. 自动选择只有一个在线Windows对端时成立；显式名称必须精确匹配。

3. 使用官方浏览器登录，不传递脚本内登录密钥；诊断里的对端地址只露出第一段，其余打码。

## 当前怎样实现

- Get-MeshClipTailscaleStatus 安全解析 tailscale status --json 输出。

- Resolve-MeshClipApprovedWindowsPeer 校验对端状态、系统类型与唯一性。

- ConvertTo-MeshClipRedactedAddress 给地址打码：IPv4 只留第一段、后面写成 x.x.x，IPv6 只留第一段，无效地址整段隐藏；这是固定截断，不是哈希（把内容换算成一串摘要码）。

## 执行流程

1. 检查服务自动运行、BackendState=Running、本机在线。

::screen{#meshclip-kit-tailscale-peer-reachability-06 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-06",
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
     "text_ref": "2. 检查ForceDaemon与shields-up；不自行改动不符合条件的现状。",
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
     "text_ref": "2. 检查ForceDaemon与shields-up；不自行改动不符合条件的现状。",
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

2. 检查ForceDaemon与shields-up；不自行改动不符合条件的现状。

3. 解析明确对端，确认在线且为Windows。

4. doctor执行一次有界tailscale ping（1 次、5 秒超时），只报通或不通，不回传直连还是中继；结果独立于KDE配对。

::screen{#meshclip-kit-tailscale-peer-reachability-07 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-07",
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
| Tailnet（Tailscale 虚拟网络） | Tailscale 账户下的所有授权设备组成的专属点对点加密网状网络。 |
| Run Unattended（无人值守） | Tailscale 无人值守服务模式，无需用户手动打开客户端界面即可在后台自启保持在线。 |

## 专业定义

跨网络加密隧道与单对端安全发现

::screen{#meshclip-kit-tailscale-peer-reachability-08 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-08",
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
     "text_ref": "- **对端设备关机或离线**：Resolve-MeshClipApprovedWindowsPeer 抛出错误拒绝继续，提示开启对端电脑。",
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
     "text_ref": "- **对端设备关机或离线**：Resolve-MeshClipApprovedWindowsPeer 抛出错误拒绝继续，提示开启对端电脑。",
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

若 Tailscale 未登录、处于 Shields Up 模式，或存在多个同名/离线设备导致无法安全辨别目标，脚本拒绝盲目猜测并终止执行。

## 边界

- 仅负责底层 Tailnet 隧道的打通与对端 IP 的精准析取，不负责上层 KDE Connect 的配对确认。

- 严格仅支持经过官方浏览器认证的个人 Tailnet，绝不在脚本中传递明文 auth-key。

## 失败与恢复

- **对端设备关机或离线**：Resolve-MeshClipApprovedWindowsPeer 抛出错误拒绝继续，提示开启对端电脑。

- **Tailscale 开启了 shields-up**：doctor 诊断标记 FAIL 并提示关闭入站拦截以允许 KDE Connect 流量进入。

::screen{#meshclip-kit-tailscale-peer-reachability-09 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-tailscale-peer-reachability-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 对端防火墙收敛",
    "href": "/projects/meshclip-kit/exact-peer-firewall-hardening/"
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
     "text_ref": "- `scripts\\MeshClip.Common.psm1`Tailscale 状态与对端解析核心逻辑",
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
     "text_ref": "- `scripts\\MeshClip.Common.psm1`Tailscale 状态与对端解析核心逻辑",
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

- `scripts\MeshClip.Common.psm1`Tailscale 状态与对端解析核心逻辑

- `scripts\configure-peer.ps1`对端配置入口脚本

- `tests\MeshClip.Common.Tests.ps1`地址脱敏与对端解析单元测试

## 如何验证

- 当前测试源码覆盖精确名称匹配、离线/非 Windows 拒绝、多对端歧义与地址打码；这次没有重新运行测试，9 月 8 日那次 66 项历史回归保留原日期。

- 10 月 11 日 13:33 主机自检：Tailscale 1.104.1 服务自动运行、本机在线、无人值守开启、入站拦截（shields-up）关闭、唯一批准对端和 ping 当次通过；同一次读不出 KDE 应用状态（记为未知），不能据此说两台已配对或能传。

## 与其他模块的关系

为KDE对端配置提供明确的网络地址和可达证据，不替代应用层确认。
