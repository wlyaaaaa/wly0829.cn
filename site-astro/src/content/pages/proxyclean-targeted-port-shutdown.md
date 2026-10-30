---
{
 "title": "首页按客户端关闭代理，维护时可单独按端口处理",
 "kind": "project",
 "url": "/projects/proxyclean/targeted-port-shutdown/",
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
  "page": "proxyclean-targeted-port-shutdown",
  "kind": "project",
  "title": "首页按客户端关闭代理，维护时可单独按端口处理",
  "url": "/projects/proxyclean/targeted-port-shutdown/",
  "parent": "proxyclean",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）逐项核对；没有实关客户端"
  }
 },
 "source": {
  "page": "sources/pages/proxyclean-targeted-port-shutdown/page.json",
  "sha256": "d49781e9499b172c0080094947b27947e7d8dee145c7365833e6c45507f926f1",
  "converted_at_beijing": "2026-10-30T13:04:18+08:00"
 }
}
---

::screen{#proxyclean-targeted-port-shutdown-01 section="top"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-01",
  "section": "top",
  "title": "首页按客户端关闭代理，维护时可单独按端口处理",
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
     "text_ref": "首页按客户端关闭代理，维护时可单独按端口处理",
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
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）逐项核对；没有实关客户端",
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
     "text_ref": "不想继续用代理时在首页点“关闭代理，恢复普通上网”。程序把飞鸟及其辅助进程、可识别的 Clash Verge/Clash/Mihomo 按真实关系归组；两个各自独立运行的同类核心会分开列出，用进程号区别。只运行一个时点一下就开始关闭，多于一个时先让我选。这一下已经包括请它正常退出和有限度地收尾，不会再另问一次“要不要强制结束”。",
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
     "text_ref": "首页按客户端关闭代理，维护时可单独按端口处理",
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
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）逐项核对；没有实关客户端"
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
     "text_ref": "不想继续用代理时在首页点“关闭代理，恢复普通上网”。程序把飞鸟及其辅助进程、可识别的 Clash Verge/Clash/Mihomo 按真实关系归组；两个各自独立运行的同类核心会分开列出，用进程号区别。只运行一个时点一下就开始关闭，多于一个时先让我选。这一下已经包括请它正常退出和有限度地收尾，不会再另问一次“要不要强制结束”。"
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
   "asset": "_library/module-illustrations/proxyclean/targeted-port-shutdown-v01.png",
   "key": "main-proxyclean",
   "source_phrase": "右上一幅水彩插画：一台笔记本电脑，屏幕上是白底绿字的小窗口（只画色块，不画字）；电脑背后伸出四五根细线，接到一块插线板上：两根线是鲜绿色、插在亮着小绿灯的插孔里（还在工作的代理），另外两根是灰色虚线、插在已经熄灭的空插孔里（代理已经退出、设置还指着它）；一只绿色的小剪刀只剪那两根灰色虚线，绿色的线不碰。",
   "sha256": "b6ed15c41eb19ae560120f6282b85e74ab045f3749741d972d097cb523e4f972",
   "status": "ready"
  }
 ]
}
```

# 首页按客户端关闭代理，维护时可单独按端口处理

〔回到项目 → 代理上网修复〕　〔GitHub〕　〔复制 AI 续作说明〕

ProxyClean · 功能说明

不想继续用代理时在首页点“关闭代理，恢复普通上网”。程序把飞鸟及其辅助进程、可识别的 Clash Verge/Clash/Mihomo 按真实关系归组；两个各自独立运行的同类核心会分开列出，用进程号区别。只运行一个时点一下就开始关闭，多于一个时先让我选。这一下已经包括请它正常退出和有限度地收尾，不会再另问一次“要不要强制结束”。

**当前情况：**飞鸟现在也包括极速版：它的窗口、安装缓存里用一串哈希当名字的核心、辅助服务，以及本机登记过的 AI 入口小程序合成一个“飞鸟”，按安装路径认，不看端口；路径不同的同类核心仍分开列。新版点一次完成整个关闭：先请客户端正常退出，4 秒后仍没退的只结束身份没变的那几个进程，同一核心路径上主程序已经没了、自己还在跑的“孤儿”残留一起结束；关闭期间临时停下的辅助服务，结束后按原样开回来并至少复查 10 秒，保证下次还能手动开代理；最后只清相关设置。停辅助服务等 20 秒仍没停下、或核心“应该在运行”的标记清不掉时，不自动开回服务，也不报关闭成功。当前网页没有实关任何客户端，也没有测过关闭后重新启动；识别按已知安装路径和进程名，不保证支持任意版本或插件。

项目快照核对于北京时间 2026-10-11（以当天 14:00 前的源码为准，最后一次提交在 10 月 6 日 05:52）；客户端归组、关闭后的服务恢复和撤销记录按 10 月 30 日只读核对的源码更新，相关的最近一次提交在 10 月 28 日 02:10。具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#proxyclean-targeted-port-shutdown-02 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 只结束进程会留下失效代理配置，只改配置又不能关闭卡住的监听。因此先核对并停止本次目标，确认端口关闭后才清对应引用；进程结束不能撤销，设置修改则按本轮原值有条件回退，两类结果分别说明。 ### 举"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 只结束进程会留下失效代理配置，只改配置又不能关闭卡住的监听。因此先核对并停止本次目标，确认端口关闭后才清对应引用；进程结束不能撤销，设置修改则按本轮原值有条件回退，两类结果分别说明。 ### 举"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 ### 为什么需要它 只结束进程会留下失效代理配置，只改配置又不能关闭卡住的监听。因此先核对并停止本次目标，确认端口关闭后才清对应引用；进程结束不能撤销，设置修改则按本轮原值有条件回退，两类结果分别说明。 ### 举"
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

只结束进程会留下失效代理配置，只改配置又不能关闭卡住的监听。因此先核对并停止本次目标，确认端口关闭后才清对应引用；进程结束不能撤销，设置修改则按本轮原值有条件回退，两类结果分别说明。

### 举个实际例子

“我想关飞鸟，保留另一个代理。”首页若只见飞鸟，点关闭就直接开始；有多个客户端时先选飞鸟。程序先请它正常退出，等 4 秒还有残留，只结束刚才核对过身份的飞鸟进程（包括同一安装位置上主程序已经退了、自己还在跑的核心），不碰另一个代理。相关端口全关且身份未变，才一次清理飞鸟留下的设置，再把飞鸟原来在跑的辅助服务开回来待命，并至少复查 10 秒。

### 最后我会得到什么

分别看到客户端是否退出、辅助服务开回来后是在待命还是自己退出了、相关端口是否关闭、配置是否回读、基础网页检查是否通过（不走显式代理，用 IPv4 依次请求百度和微软的连通性测试页，任一正常返回就算通过；它不代表海外或 AI 服务可用）。旧版在清理 Windows 和用户代理设置时可能写入失败，9 月 24 日已修复并有隔离回归，真实使用仍以当次回读为准。其他客户端、PAC、活 TUN 和应用独立代理保留，不能宣布所有流量直连。

::screen{#proxyclean-targeted-port-shutdown-03 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-03",
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

所选客户端退出、辅助服务恢复待命（开回来后至少复查 10 秒）、相关端口关闭并完成设置回读后，才报告“已关闭”和处理过的范围；2026-09-22 的隔离验证不等于本站关闭了本人当前代理。

### 发现问题时

正常退出后 4 秒仍有残留，只结束原计划里身份没变的进程；身份对不上的不动，并停止设置清理。客户端重启、端口被未知程序接走、进程身份变化或配置冲突时不沿用旧计划继续清理；辅助服务没恢复或核心又冒出来，不报“已关闭”；辅助服务开回来后自己退出了，单独说明。停辅助服务等 20 秒仍没停下，或核心“应该在运行”的标记清不掉时，不自动开回服务，也不报“已关闭”；之后服务开回来了，也不把此前“核心还在”的结论改成成功。

### 入口不可用或证据不足时

受保护进程或服务的操作需要时自动提权，系统需要确认时才显示 UAC（管理员确认）；随后程序带着已选客户端和同一 Windows 用户重新核对原身份再执行，不再另外确认。拿不到权限就停下，不重弹、不按不完整的状态继续；仍无法安全识别时不结束未知进程。

::screen{#proxyclean-targeted-port-shutdown-04 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-04",
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
     "text_ref": "在 ProxyClean 首页点“关闭代理，恢复普通上网”；若发现多个客户端，先选具体客户端，点下去就开始关闭。单端口维护走独立维护窗口，那里仍先预览再确认。",
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
     "text_ref": "1. **选准客户端**　首页列出可识别目标；两个独立运行的同类核心分开列、用进程号区别，多客户端先选一个。",
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
     "text_ref": "在 ProxyClean 首页点“关闭代理，恢复普通上网”；若发现多个客户端，先选具体客户端，点下去就开始关闭。单端口维护走独立维护窗口，那里仍先预览再确认。"
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
     "text_ref": "1. **选准客户端**　首页列出可识别目标；两个独立运行的同类核心分开列、用进程号区别，多客户端先选一个。",
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

在 ProxyClean 首页点“关闭代理，恢复普通上网”；若发现多个客户端，先选具体客户端，点下去就开始关闭。单端口维护走独立维护窗口，那里仍先预览再确认。

### 需要准备什么

- 想关闭的代理客户端

- 受保护进程或服务需要时，在 Windows 的 UAC 弹窗上点同意

### 从开始到拿到结果

1. **选准客户端**　首页列出可识别目标；两个独立运行的同类核心分开列、用进程号区别，多客户端先选一个。

2. **一次完成关闭**　先请求正常退出，4 秒后只结束身份没变的残留和同一核心路径上的孤儿残留；临时停下的辅助服务结束后开回来并至少复查 10 秒，不需要再点第二次。

3. **只清相关引用**　端口确实不再由目标占用后才清其系统引用；被另一个代理客户端接手的端口保留，重启、未知接管或核对失败时停止并保留其他代理。

::screen{#proxyclean-targeted-port-shutdown-05 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 日常关闭改为一次点击完成、辅助服务关后恢复、同类核心分开处理；本站未关闭本人当前真实代理 ### 关键规则与设计选择 1. 技术端口入口的地址门接受 127"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 日常关闭改为一次点击完成、辅助服务关后恢复、同类核心分开处理；本站未关闭本人当前真实代理 ### 关键规则与设计选择 1. 技术端口入口的地址门接受 127"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 日常关闭改为一次点击完成、辅助服务关后恢复、同类核心分开处理；本站未关闭本人当前真实代理 ### 关键规则与设计选择 1. 技术端口入口的地址门接受 127"
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
     "text_ref": "1. 技术端口入口的地址门接受 127.0.0.1、::1、0.0.0.0 与 ::；只绑定特定局域网地址的监听不处理，但通配监听覆盖所有接口，仍需用户先确认端口身份。",
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
     "text_ref": "1. 技术端口入口的地址门接受 127.0.0.1、::1、0.0.0.0 与 ::；只绑定特定局域网地址的监听不处理，但通配监听覆盖所有接口，仍需用户先确认端口身份。",
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

日常关闭一次点击完成；按安装路径归组（含飞鸟极速版）、同路径孤儿一起关、辅助服务关后恢复并复查、路径不同的同类核心分开处理；本站未关闭本人当前真实代理

### 关键规则与设计选择

1. 技术端口入口的地址门接受 127.0.0.1、::1、0.0.0.0 与 ::；只绑定特定局域网地址的监听不处理，但通配监听覆盖所有接口，仍需用户先确认端口身份。

2. 首页按客户端动态识别进程与多个端口，不依赖旧固定端口表；核心只在真实父子关系、会话和启动时间都对得上时才归给客户端，逐级上溯时父进程不能比子进程启动得晚。飞鸟极速版的界面、辅助服务、安装缓存里以哈希命名的核心和登记路径的 AI 入口侧车（附带的小程序），按已知安装路径归为同一个“飞鸟”，旧版飞鸟识别继续兼容，不写死端口。父进程已退出的核心，只有可执行路径与所选实例已识别的核心路径相同时才作为孤儿残留一起处理；路径不同的同类核心保持独立。动手前按真实路径、PID、启动时间、会话和端口重新核对。技术端口脚本仍仅在显式 ExtraProcessName 时追加所列进程。

3. 仅移除已确认目标端点，混合映射中的其他协议或远程端点保留，不整串清空；已确认被另一个代理客户端接手的端口标为“已转交”，保留它的引用。

4. 受保护进程/服务需要提权时，保留已选客户端、实例身份记录和同一 Windows 用户，UAC 回来后重核原身份再执行，不在程序里再确认一次；普通修复和维护工具仍各有预览确认。

5. 点一次关闭就包括正常退出和有限度的收尾，默认等 4 秒；底层保留显式 Force/DisconnectForce 参数供兼容，但日常不再分两次确认。同客户端多个端口相关引用合为一次可恢复配置操作。技术端口入口不会在处理后调用通用主清理。

## 当前怎样实现

- ProxyClean.Clients.ps1 按可识别客户端及实际父子关系归组控制器、核心和辅助服务；动态发现端口，两个独立的同类核心分开为两个实例，不把另一个恰好运行的 GUI 误认作核心父进程。

- 点关闭即开始：先请求窗口和核心正常退出，并临时停下已识别的辅助服务（代理程序自带的 Windows 后台服务，打开代理时要用，它本身不代理上网）；默认 4 秒后只结束原计划里身份仍一致的残留。停辅助服务时最多等 20 秒；等到超时或核心运行标记清不掉时，不自动开回服务，也不报关闭成功。其余情况下，关闭前在跑的辅助服务，成功和失败两条路都会尝试开回来，开回后至少复查 10 秒，仍在运行和自己退出分别说明；服务开回来不覆盖此前“核心仍在”的真实结论。它的管理监听不是代理端口，允许留着待命。不复活独立核心，不改服务启动类型和依赖服务。

- 动手前再复核进程身份、端口与配置；重启、未知接管或查询失败即停止清理。多个端口对应设置合成一次可恢复事务，原值以 UTF-8 JSON 写进本机 last-operation.json，并与 .previous 两个位置轮换保存（写完、落盘、回读后才退役旧槽；不另加密，旧的 DPAPI 记录仍能读来恢复）。可确认的 Clash Verge 2.x 会在记录文件里写“核心应该在运行”，服务恢复后可能据此把核心拉起来；程序只在核心已停、文件属于当前 Windows 用户且核心路径与所选进程相符时，把这一项从“是”改成“否”，其余内容不动，改前存原样、改后读回；确认不了就失败，不猜；恢复上次修改也不会把它改回“是”。

::screen{#proxyclean-targeted-port-shutdown-06 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-06",
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
     "text_ref": "- Stop-ProxyPort.ps1 保留技术端口级预览，旧快捷方式只操作名称中的端口并核对预期客户端；不会调用全机通用清理。",
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
     "text_ref": "- Stop-ProxyPort.ps1 保留技术端口级预览，旧快捷方式只操作名称中的端口并核对预期客户端；不会调用全机通用清理。",
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

- Stop-ProxyPort.ps1 保留技术端口级预览，旧快捷方式只操作名称中的端口并核对预期客户端；不会调用全机通用清理。

## 执行流程

1. 首页发现一个已识别客户端时点关闭就开始；多个时先选一个，未识别时引导检查设置。

2. 先请所选客户端正常退出，并临时停下它在跑的辅助服务（最多等 20 秒）；记下哪些辅助服务原本在跑。停服务超时或核心运行标记清不掉，就不自动开回服务、不报成功。

3. 4 秒后仍有残留，只结束重新核实身份的原计划进程及同一已识别核心路径上的孤儿残留；端口被未知程序接走或客户端重启即停止后续设置清理，被另一个代理客户端接手的端口保留引用、其余端口照常处理。

4. 相关端口确认关闭后，一次清理仅指向它们的设置并回读，把原来在跑的辅助服务开回来并至少复查 10 秒（待命和自行退出分别说明），再做基础网页检查；PAC、活 TUN、其他客户端及应用独立代理列为保留范围。

5. 技术维护按明确端口可单独预览和关闭；进程不能由配置撤销复活，设置冲突与恢复待处理分别报告。

::screen{#proxyclean-targeted-port-shutdown-07 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-07",
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
| Client Group（客户端归组） | 日常关闭按实际进程父子关系把控制器、核心和辅助服务归于同一客户端；两个独立运行的同类核心按“类型、进程号、启动时间”分成两个实例，同名 GUI 恰好在运行不构成归组证据，多个端口的引用在一次可恢复配置操作中处理。 |
| Sequenced Port Cleanup（顺序端口清理） | 进程停止与配置修复是两种效果：设置有本轮原值和条件撤销，进程不能自动复活；最终分别核对而非合称原子成功。 |
| Listen Address Gate（监听地址门） | 只采纳回环或通配监听，拒绝只绑定特定局域网地址的服务；通配地址不是回环，不能替代用户对目标端口身份的确认。 |

## 专业定义

按客户端一次点击完成有限度关闭，辅助服务关后恢复；身份或端口变化就停止设置清理

解决什么

防止代理客户端挂死后难以精确定位进程，防止杀掉进程后留下指向死端口的系统代理导致立即断网，也防止关完代理后辅助服务停着、下次开不起来。

::screen{#proxyclean-targeted-port-shutdown-08 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-08",
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
     "text_ref": "- **正常退出后仍有成员在运行，或端口被占用**：4 秒后只结束身份没变的原计划成员；仍有残留或身份对不上就不清理可能仍在使用的设置，报告未完成范围，并返回客户端自身退出指引。",
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
     "text_ref": "- **正常退出后仍有成员在运行，或端口被占用**：4 秒后只结束身份没变的原计划成员；仍有残留或身份对不上就不清理可能仍在使用的设置，报告未完成范围，并返回客户端自身退出指引。",
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

防止代理客户端挂死后难以精确定位进程，防止杀掉进程后留下指向死端口的系统代理导致立即断网。

## 边界

- 端口预览遇到系统进程（PID 不大于 4）或本脚本自己时直接拒绝整个计划；客户端关闭在第一个动作前也拒绝不合格的成员，不是跳过后继续处理别的。

- 只绑定在局域网特定地址上的服务不处理；0.0.0.0/:: 通配监听仍会处理，因为它也是源码的现行地址门。

- 旧 18090、18091 与 7892 端口快捷方式已移入旧版入口；日常关闭使用按客户端动态发现的首页流程。维护窗口或 PowerShell 可显式指定其他端口。

- 首页只处理所选客户端实例、同一已识别核心路径上的孤儿残留及其已核实端口，已经独立在跑、路径不同的其他实例保留，事后重启出来的新进程也不追着结束；技术端口入口只处理所选端口的监听者与对应引用，额外进程仅来自显式 ExtraProcessName。两者都不默认关闭其他客户端或清空混合字符串。

## 失败与恢复

- **正常退出后仍有成员在运行，或端口被占用**：4 秒后只结束身份没变的原计划成员；仍有残留或身份对不上就不清理可能仍在使用的设置，报告未完成范围，并返回客户端自身退出指引。

- **进程身份、端口或配置在关闭过程中变化**：停止沿用旧计划，保留后续修改；已确认被另一个代理客户端接手的端口列为“已转交”，接手者不明就列为未知并停止设置清理。已退出进程不会由配置恢复记录重新启动。

- **停辅助服务 20 秒仍没停下，或核心运行标记清不掉**：不自动开回服务，也不报“已关闭”，说明卡在哪一项。

- **辅助服务没能恢复、恢复后自己退出，或核心又冒出来**：开回后至少复查 10 秒，仍在待命和自己退出分别说明；核心还在就不报“已关闭”，服务开回来也不改写这个结论；不为此去改服务启动类型。

::screen{#proxyclean-targeted-port-shutdown-09 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-09",
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
     "text_ref": "- **查询后进程自行退出或端口原本没有监听**：报告没有监听或原本关闭，不结束旧映射客户端；仅执行仍明确授权的目标配置计划，其他端点和路由保持。",
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
     "text_ref": "- **查询后进程自行退出或端口原本没有监听**：报告没有监听或原本关闭，不结束旧映射客户端；仅执行仍明确授权的目标配置计划，其他端点和路由保持。",
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

- **查询后进程自行退出或端口原本没有监听**：报告没有监听或原本关闭，不结束旧映射客户端；仅执行仍明确授权的目标配置计划，其他端点和路由保持。

- **用户给出的通配监听端口属于非代理服务**：源码无法从地址门证明身份；因此产品入口要求用户先确认端口所属进程，网页不会建议盲目试端口。

::screen{#proxyclean-targeted-port-shutdown-10 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-targeted-port-shutdown-10",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 动态状态",
    "href": "/projects/proxyclean/dynamic-proxy-status/"
   },
   {
    "text": "下一个模块 WiFi 恢复",
    "href": "/projects/proxyclean/wifi-rebind-and-recovery/"
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
     "text_ref": "- **Stop-ProxyPort.ps1**：维护时的指定端口预览、身份复核与精确关闭入口；不承担首页客户端归组。",
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
     "text_ref": "- **Stop-ProxyPort.ps1**：维护时的指定端口预览、身份复核与精确关闭入口；不承担首页客户端归组。",
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

- **Stop-ProxyPort.ps1**：维护时的指定端口预览、身份复核与精确关闭入口；不承担首页客户端归组。

- **ProxyClean.Clients.ps1 / ProxyClean.ClientPolicy.ps1 / ProxyClean.Workflow.ps1 / ControlCenter.ps1**：日常客户端归组、一次点击关闭、辅助服务恢复、配置事务和结果显示

## 如何验证

- 当前源码的 12 个测试文件共展开 319 个用例，其中客户端相关 53 个、关闭回归 29 个（北京时间 10 月 22 日 06:47—06:48 只静态数出，没有运行；10 月 11 日总数是 317 个，两类分项没变）；9 月 25 日版本的 277 项在两版 PowerShell 通过是历史记录，当前 319 项的全套运行结果未知。

- 2026-09-24 当时的变更记录载明客户端关停后的注册表写入缺陷已修并有新增隔离回归（该记录文件 9 月 26 日已从仓库删除，可在 Git 历史查到）；9 月 22 日正常与强制关停隔离验证保留原日期。本站没有关闭本人当前代理、没有触发 UAC，也没有测关闭后重新启动，不把隔离结果称为真实网络恢复。

## 与其他模块的关系

日常关闭代理的客户端级流程；Stop-ProxyPort.ps1 是维护时针对明确端口的独立技术入口。配置撤销不能复活进程。
