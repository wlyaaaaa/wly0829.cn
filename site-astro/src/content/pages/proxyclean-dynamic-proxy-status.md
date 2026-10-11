---
{
 "title": "先查当前代理，以及哪些程序还在用它",
 "kind": "project",
 "url": "/projects/proxyclean/dynamic-proxy-status/",
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
  "page": "proxyclean-dynamic-proxy-status",
  "kind": "project",
  "title": "先查当前代理，以及哪些程序还在用它",
  "url": "/projects/proxyclean/dynamic-proxy-status/",
  "parent": "proxyclean",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）和当天 13:41 的一次本机只读状态核对"
  }
 },
 "source": {
  "page": "sources/pages/proxyclean-dynamic-proxy-status/page.json",
  "sha256": "d4a24fe4e72068dc97c1e0559e0e5162f57c56e0ec75fcc24c9d992a9f5dbea3",
  "converted_at_beijing": "2026-10-11T19:07:12+08:00"
 }
}
---

::screen{#proxyclean-dynamic-proxy-status-01 section="top"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-01",
  "section": "top",
  "title": "先查当前代理，以及哪些程序还在用它",
  "links": [
   {
    "text": "回到项目 → 代理上网修复",
    "href": "/projects/proxyclean/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/ProxyClean"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/proxyclean/#ai-brief"
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
     "text_ref": "先查当前代理，以及哪些程序还在用它",
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
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）和当天 13:41 的一次本机只读状态核对",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 代理上网修复〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "看清 Windows 当前有没有使用代理、哪些本地程序正在提供代理服务，以及 Docker 是跟随系统还是单独设置。先分清每条路径，就能避免修错地方；这里的状态检查本身不修改设置。",
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
     "text_ref": "先查当前代理，以及哪些程序还在用它",
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
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）和当天 13:41 的一次本机只读状态核对"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 代理上网修复〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "看清 Windows 当前有没有使用代理、哪些本地程序正在提供代理服务，以及 Docker 是跟随系统还是单独设置。先分清每条路径，就能避免修错地方；这里的状态检查本身不修改设置。"
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
   "asset": "_library/module-illustrations/proxyclean/dynamic-proxy-status-v01.png",
   "key": "main-proxyclean",
   "source_phrase": "右上一幅水彩插画：一台笔记本电脑，屏幕上是白底绿字的小窗口（只画色块，不画字）；电脑背后伸出四五根细线，接到一块插线板上：两根线是鲜绿色、插在亮着小绿灯的插孔里（还在工作的代理），另外两根是灰色虚线、插在已经熄灭的空插孔里（代理已经退出、设置还指着它）；一只绿色的小剪刀只剪那两根灰色虚线，绿色的线不碰。",
   "sha256": "432b5390314e7a14fc8b4bc10be71849d686c48d408c833a0a6c82c7bef196ba",
   "status": "ready"
  }
 ]
}
```

# 先查当前代理，以及哪些程序还在用它

〔回到项目 → 代理上网修复〕　〔GitHub〕　〔复制 AI 续作说明〕

ProxyClean · 功能说明

看清 Windows 当前有没有使用代理、哪些本地程序正在提供代理服务，以及 Docker 是跟随系统还是单独设置。先分清每条路径，就能避免修错地方；这里的状态检查本身不修改设置。

**当前情况：**本机代理与 Docker 诊断入口已实现；自动打开首页、以及不加 -ProbeExit 的命令行检查都不访问公网。想知道国内、海外、AI 网站分别通不通，要自己点联网检查。网页保留带日期的旧网络样本，没有把它当成当前所有应用可用的证明。

项目快照核对于北京时间 2026-10-11（以当天 14:00 前的源码为准，最后一次提交在 10 月 6 日 05:52；本机只读状态取自当天 13:41）；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#proxyclean-dynamic-proxy-status-02 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 代理端口会变，浏览器、终端、TUN 和 Docker 又可能各走一条路径。先把这些当前事实分开列出，才能判断是多路径、手工钉死、旧环境变量，还是别的问题；仅看到一个端点字符串不能证明端口已死。 "
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 代理端口会变，浏览器、终端、TUN 和 Docker 又可能各走一条路径。先把这些当前事实分开列出，才能判断是多路径、手工钉死、旧环境变量，还是别的问题；仅看到一个端点字符串不能证明端口已死。 "
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 ### 为什么需要它 代理端口会变，浏览器、终端、TUN 和 Docker 又可能各走一条路径。先把这些当前事实分开列出，才能判断是多路径、手工钉死、旧环境变量，还是别的问题；仅看到一个端点字符串不能证明端口已死。 "
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

代理端口会变，浏览器、终端、TUN 和 Docker 又可能各走一条路径。先把这些当前事实分开列出，才能判断是多路径、手工钉死、旧环境变量，还是别的问题；仅看到一个端点字符串不能证明端口已死。

### 举个实际例子

“网页能打开，但 Docker 下载镜像一直超时，帮我先查当前设置。”AI查看系统代理、实际监听程序和 Docker 的配置与近期日志，指出两者是否使用不同路径。需要修改 Docker 时再进入它自己的设置确认，不把看到一个地址就当成代理已经失效。

### 最后我会得到什么

得到系统代理状态、实际提供代理的程序、当前网络路径，以及 Docker 的独立设置和未确认项。主动点联网检查时，还会逐站看到百度、Google、ChatGPT 在 IPv4 和 IPv6 下各通不通：某个网站没有 IPv6 地址就写“这一路没测”；返回 403 这类只说明到达了服务器，不证明功能正常。需要比较公网出口时另行确认；某个端口在运行不等于它能正常联网。

::screen{#proxyclean-dynamic-proxy-status-03 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-03",
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

分别读到系统代理、提供端口的程序、网络路线和 Docker 自己的设置；查看本身不改网络。

### 发现问题时

Docker 保存了独立本地代理，或设置已改但运行记录仍沿用旧值时，提示要到 Docker 里另行核对。

### 入口不可用或证据不足时

没有安装 Docker 时只把该项写成未安装，其余网络状态仍可查看；Docker 配置读不了时该项写成“未知”，其余照常。

::screen{#proxyclean-dynamic-proxy-status-04 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-04",
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
     "text_ref": "双击“00-打开 ProxyClean.vbs”先看首页状态；需要端口、Docker 和路由细节时点“查看详情”。",
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
     "text_ref": "1. **打开即读状态**　显示 Windows 手动代理是否开启和简短结论，不自动访问公网。",
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
     "text_ref": "双击“00-打开 ProxyClean.vbs”先看首页状态；需要端口、Docker 和路由细节时点“查看详情”。"
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
     "text_ref": "1. **打开即读状态**　显示 Windows 手动代理是否开启和简短结论，不自动访问公网。",
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

双击“00-打开 ProxyClean.vbs”先看首页状态；需要端口、Docker 和路由细节时点“查看详情”。

## 需要准备什么

- 想弄清系统代理、端口还是某个应用的连接问题

## 从开始到拿到结果

1. **打开即读状态**　显示 Windows 手动代理是否开启和简短结论，不自动访问公网。

2. **查看具体占用**　详情区分监听端口、对应进程、默认路由和 Docker 独立设置。

3. **按事实决定下一步**　活端口、未覆盖的应用配置和未知范围会明说；只读查看不改变网络。

::screen{#proxyclean-dynamic-proxy-status-05 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 动态发现与 Docker 审计就绪；无硬编码端口表，支持 JSON 结构化输出；默认不连公网 ### 关键规则与设计选择 1. 坚持零固定端口表：完全根据系"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 动态发现与 Docker 审计就绪；无硬编码端口表，支持 JSON 结构化输出；默认不连公网 ### 关键规则与设计选择 1. 坚持零固定端口表：完全根据系"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 动态发现与 Docker 审计就绪；无硬编码端口表，支持 JSON 结构化输出；默认不连公网 ### 关键规则与设计选择 1. 坚持零固定端口表：完全根据系"
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
     "text_ref": "1. 坚持零固定端口表：完全根据系统的 Get-NetTCPConnection 动态判定哪些代理进程在监听。",
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
     "text_ref": "1. 坚持零固定端口表：完全根据系统的 Get-NetTCPConnection 动态判定哪些代理进程在监听。",
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

动态发现与 Docker 审计就绪；无硬编码端口表，支持 JSON 结构化输出；默认不连公网

### 关键规则与设计选择

1. 坚持零固定端口表：完全根据系统的 Get-NetTCPConnection 动态判定哪些代理进程在监听。

2. 将 Docker Desktop 纳入只读代理审计，但不把本地端点字符串升级成死端口或容器断网根因。

3. 支持 -Json 参数，便于将网络拓扑与代理状态对接给自动化运维工具或上层脚本。

4. 默认不探出口：只有显式加 -ProbeExit 且没加 -SkipExitProbe 时，才请求 ipify（返回公网 IP 的公共服务）比较默认路径和 WinINET 发布端口的出口，结果只给匿名的“相同出口”分组；不测延迟，也不证明端到端稳定性。

## 当前怎样实现

- 本地端口不再用单条正则提取：先交给 Get-ProxyEndpoints 按分号和协议映射、URI、1-65535 范围、IP 地址族与是否回环逐项解析，再取已解析本地端口的唯一集合；监听按地址族和回环/通配判断，只有 IPv6 通配而 IPv4 双栈情况不明时保留“未知”。

- Get-PCDockerSnapshot 检查 %APPDATA%\Docker\settings-store.json 中的 OverrideProxyHTTP 等覆盖项。

- 读取 %LOCALAPPDATA%\Docker\log\host\httpproxy.log 尾部 300 行里最近的模式事件；事件须在最近 600 秒内、且不早于当前 Docker 后台启动，才算当前运行时代理模式。

- 匹配常见代理核心进程名正则（clash|mihomo|sing-box|xray|v2ray|flyingbird|tag 等）。

::screen{#proxyclean-dynamic-proxy-status-06 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-06",
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
     "text_ref": "- 分层诊断默认不写日志，Docker只读有界尾部且要求事件本身属于当前运行，文件mtime不替旧事件续期。出口比较只给匿名相同出口分组，不公开出口地址；同出口不证明同一客户端，HTTP成功也不证明绕过TUN。",
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
     "text_ref": "- 分层诊断默认不写日志，Docker只读有界尾部且要求事件本身属于当前运行，文件mtime不替旧事件续期。出口比较只给匿名相同出口分组，不公开出口地址；同出口不证明同一客户端，HTTP成功也不证明绕过TUN。",
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

- 分层诊断默认不写日志，Docker只读有界尾部且要求事件本身属于当前运行，文件mtime不替旧事件续期。出口比较只给匿名相同出口分组，不公开出口地址；同出口不证明同一客户端，HTTP成功也不证明绕过TUN。

## 执行流程

1. 读取注册表获取 WinINET 当前系统代理端点与开启状态。

2. 扫描 Get-NetTCPConnection 获取所有监听中的 TCP 连接，结合进程表识别代理核心进程名与 PID。

3. 检查 IPv4 默认路由并列出 NextHop 落在 198.18/198.19 的条目；另外记下 IPv4/IPv6 各条默认路由和分流路由的地址族、路由与接口优先级、是否直连网段、是否隧道接口，只用来解释，实际去往目标的路由写“未探测”。该状态脚本不判定这些路由生死，也不据此扩大删路由范围。

4. 读取 Docker Desktop 配置文件与日志，判定是否存在本地手动代理钉死或配置未生效挂起。

5. 只有显式加 -ProbeExit 时才发起出口比较；用户在界面点联网检查时，另按国内百度、海外 Google generate_204、AI ChatGPT 逐站检查：不走显式代理时分 IPv4/IPv6 各测一次，设置里存着、正在监听、能解析且不带凭据的 HTTP(S) 代理端点另外测（系统代理关着也会测），这一路用哪个地址族由代理决定。最后汇总输出控制台表格或 JSON 对象。

::screen{#proxyclean-dynamic-proxy-status-07 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-07",
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
| Dynamic Port Sniffing（动态端口嗅探） | 放弃静态配置列表，直接在系统 TCP 协议栈中按监听状态和进程签名动态发现活动代理端点。 |
| Docker Manual Pin（Docker 手工代理钉死） | Docker 桌面版处于 manual 模式并保存了本地代理端点；这值得排查，但状态脚本不会进一步探测该端口是否已经死亡。 |

## 专业定义

只读看清当前代理路径和 Docker 配置，不把监听、路由或本地端点自动判成健康/死亡

::screen{#proxyclean-dynamic-proxy-status-08 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-08",
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
     "text_ref": "- **Docker 配置文件存在但格式损坏或无法读取**：Docker 这一层写成 unknown（未知），Docker 代理明细留空，其余网络发现照常继续；不会输出具体错误明细。只有配置文件不存在时才写“未安装”。",
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
     "text_ref": "- **Docker 配置文件存在但格式损坏或无法读取**：Docker 这一层写成 unknown（未知），Docker 代理明细留空，其余网络发现照常继续；不会输出具体错误明细。只有配置文件不存在时才写“未安装”。",
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

避免把固定端口表、一个监听记录、一个 fake-ip 路由或一条 Docker 配置各自误当成完整网络结论。

## 边界

- 仅审计 Docker 配置文件与只读日志，绝不静默改写 settings-store.json 或强制重启 Docker Desktop。

- 监听候选来自实际 TCP Listen 记录；只发布 WinINET 端口或由代理进程名匹配且监听在回环/通配地址的记录，不枚举没有监听端口的进程。

- 出口探测只比较返回的 IP 字符串，不测延迟、速度、丢包或 DNS/WebRTC（网页实时通信）泄露。

## 失败与恢复

- **Docker 配置文件存在但格式损坏或无法读取**：Docker 这一层写成 unknown（未知），Docker 代理明细留空，其余网络发现照常继续；不会输出具体错误明细。只有配置文件不存在时才写“未安装”。

- **没加 -ProbeExit、加了 -SkipExitProbe 或外部 IP 服务不可达**：current_default 保持 not_probed 或 unknown（未验证）；本地配置清单仍可读，但不能推断真实出口。

::screen{#proxyclean-dynamic-proxy-status-09 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-dynamic-proxy-status-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 死端口与路由",
    "href": "/projects/proxyclean/dead-port-and-route-cleanup/"
   },
   {
    "text": "下一个模块 关闭代理",
    "href": "/projects/proxyclean/targeted-port-shutdown/"
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
     "text_ref": "- `ProxyStatus.ps1`动态状态探测与 Docker 审计脚本",
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
     "text_ref": "- `ProxyStatus.ps1`动态状态探测与 Docker 审计脚本",
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

- `ProxyStatus.ps1`动态状态探测与 Docker 审计脚本

## 如何验证

- 北京时间 2026-10-11 13:41 的一次只读状态检查（ProxyStatus -SkipExitProbe -Json）：8 层都读到，系统已发布代理端点 0 个、正在工作的 0 个，活动 TUN 路由 1 条；没有做出口和网页探测。这不说明“代理全关”或“已经直连”，网络恢复和桌面应用结果仍未知。当前源码共 317 个测试用例（只静态数出，没有运行）。

- 2026-09-14 当时的只读状态检查看到 Docker 桌面/容器均为 System、无手工本地钉死且近期 runtime（运行环境） mode 为 system；未执行出口探测。此结论不描述当前 Docker 状态。

## 与其他模块的关系

默认清理前的只读观察入口，也可单独用于解释为什么不同应用走了不同出口。
