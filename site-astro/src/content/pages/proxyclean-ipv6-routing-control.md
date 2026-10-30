---
{
 "title": "查清IPv6路径，再改变明确物理网卡的设置",
 "kind": "project",
 "url": "/projects/proxyclean/ipv6-routing-control/",
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
  "page": "proxyclean-ipv6-routing-control",
  "kind": "project",
  "title": "查清IPv6路径，再改变明确物理网卡的设置",
  "url": "/projects/proxyclean/ipv6-routing-control/",
  "parent": "proxyclean",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）逐项核对；没有切换真实网卡。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/proxyclean-ipv6-routing-control/page.json",
  "sha256": "b778b921e55b67d12e3e0134b1212180cae2708800695ac77723569133318dbf",
  "converted_at_beijing": "2026-10-30T15:12:31+08:00"
 }
}
---

::screen{#proxyclean-ipv6-routing-control-01 section="top"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-01",
  "section": "top",
  "title": "查清IPv6路径，再改变明确物理网卡的设置",
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
     "text_ref": "查清IPv6路径，再改变明确物理网卡的设置",
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
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）逐项核对；没有切换真实网卡。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
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
     "text_ref": "先看各网卡的IPv6绑定与路由，再决定是否改变明确的物理网卡。调整保留原值并检查结果；失败按实际前像恢复，保留虚拟与Tailscale通道。关闭IPv6不等于所有流量已经走代理。",
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
     "text_ref": "查清IPv6路径，再改变明确物理网卡的设置",
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
     "static_note": "截至 10 月 11 日 · 按北京时间 10 月 11 日 14:00 前的 ProxyClean 源码（最后提交 10 月 6 日 05:52）逐项核对；没有切换真实网卡。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
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
     "text_ref": "先看各网卡的IPv6绑定与路由，再决定是否改变明确的物理网卡。调整保留原值并检查结果；失败按实际前像恢复，保留虚拟与Tailscale通道。关闭IPv6不等于所有流量已经走代理。"
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
   "asset": "_library/module-illustrations/proxyclean/ipv6-routing-control-v01.png",
   "key": "main-proxyclean",
   "source_phrase": "右上一幅水彩插画：一台笔记本电脑，屏幕上是白底绿字的小窗口（只画色块，不画字）；电脑背后伸出四五根细线，接到一块插线板上：两根线是鲜绿色、插在亮着小绿灯的插孔里（还在工作的代理），另外两根是灰色虚线、插在已经熄灭的空插孔里（代理已经退出、设置还指着它）；一只绿色的小剪刀只剪那两根灰色虚线，绿色的线不碰。",
   "sha256": "b4ea48ec38f9492dbb7667192475e08ab9d3fcf576a70d49f6eee2b90e9238b5",
   "status": "ready"
  }
 ]
}
```

# 查清IPv6路径，再改变明确物理网卡的设置

〔回到项目 → 代理上网修复〕　〔GitHub〕　〔复制 AI 续作说明〕

ProxyClean · 功能说明

先看各网卡的IPv6绑定与路由，再决定是否改变明确的物理网卡。调整保留原值并检查结果；失败按实际前像恢复，保留虚拟与Tailscale通道。关闭IPv6不等于所有流量已经走代理。

**当前情况：**已发布实现支持查看，以及开启或关闭指定物理接口：图形维护窗口提供“查看、开启、关闭”三个按钮，整组切换只在命令行提供。变更保存本轮各网卡原值，失败尝试恢复。本页未切换真实网卡，也未验证应用最终出口。

项目快照核对于北京时间 2026-10-11（以当天 14:00 前的源码为准，最后一次提交在 10 月 6 日 05:52）；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#proxyclean-ipv6-routing-control-02 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 IPv6 与 IPv4（第四版互联网协议）有独立默认路由。只接管 IPv4 的代理可能无法解释 IPv6 路径，而一刀切禁用所有网卡又会破坏 Tailscale、WSL（Windows 的 Li"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 ### 为什么需要它 IPv6 与 IPv4（第四版互联网协议）有独立默认路由。只接管 IPv4 的代理可能无法解释 IPv6 路径，而一刀切禁用所有网卡又会破坏 Tailscale、WSL（Windows 的 Li"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 ### 为什么需要它 IPv6 与 IPv4（第四版互联网协议）有独立默认路由。只接管 IPv4 的代理可能无法解释 IPv6 路径，而一刀切禁用所有网卡又会破坏 Tailscale、WSL（Windows 的 Li"
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

IPv6 与 IPv4（第四版互联网协议）有独立默认路由。只接管 IPv4 的代理可能无法解释 IPv6 路径，而一刀切禁用所有网卡又会破坏 Tailscale、WSL（Windows 的 Linux 子系统） 或 natpierce。这个入口把只读判断和显式切换分开，并限定真实硬件接口。

### 举个实际例子

“先看看IPv6是不是另一条出口；确需调整时，只关闭我点名的物理网卡，别碰Tailscale和WSL（Windows 的 Linux 子系统）。”先查状态，再在维护窗口点开启或关闭；命令行还可以用 Toggle（整组切换）。实际修改需要时自动提权，完成后看每块网卡回读。Toggle是整组开关，不是撤销键。

### 最后我会得到什么

拿到接口绑定、默认路由与实际变更数量。查看时虚拟接口也会列出来，并标明是不是物理网卡、开着、关着还是未知；只有修改才限定物理网卡。写入失败时，工具尝试按本轮逐网卡原值恢复并核对；有残留就明确待恢复。成功后再次Toggle不能保证回到原先混合状态，常规代理设置Undo也不是IPv6的长期回滚。

::screen{#proxyclean-ipv6-routing-control-03 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-03",
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

明确目标和操作后，实际修改逐项核对身份、原值与写后结果；最终还要看真实绑定状态，不能仅凭目标值或一句成功文本推定所有网卡都变了。

### 发现问题时

默认路由存在不等于已证明应用绕过代理。改动失败会尝试恢复本轮已动字段；恢复失败或期间有并发变化时，应先核对现场，不靠再点Toggle掩盖。

### 入口不可用或证据不足时

没有合格活动物理接口、目标身份或原值变化，或自动提权失败后仍缺少实际变更所需管理员权限时，停止对应动作，保留虚拟网卡；未知绑定不当作已关闭。

::screen{#proxyclean-ipv6-routing-control-04 section="usage"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-04",
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
     "text_ref": "在 ProxyClean 的“维护工具”窗口先查看 IPv6 绑定与路由，再明确点开启或关闭；需要整组切换时用命令行 IPv6-Toggle.ps1 -Mode Toggle。"
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
     "text_ref": "1. **先只读看当前路径**　列出所有在线网卡的 IPv6 开关与路线，并标明哪些是物理网卡；配置存在不等于浏览器一定从这条路上网。",
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
     "text_ref": "在 ProxyClean 的“维护工具”窗口先查看 IPv6 绑定与路由，再明确点开启或关闭；需要整组切换时用命令行 IPv6-Toggle.ps1 -Mode Toggle。"
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
     "text_ref": "1. **先只读看当前路径**　列出所有在线网卡的 IPv6 开关与路线，并标明哪些是物理网卡；配置存在不等于浏览器一定从这条路上网。",
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

在 ProxyClean 的“维护工具”窗口先查看 IPv6 绑定与路由，再明确点开启或关闭；需要整组切换时用命令行 IPv6-Toggle.ps1 -Mode Toggle。

### 需要准备什么

- 要处理的物理网卡（不确定可先查看）

- 只查还是明确开启、关闭（整组切换走命令行）

- 需验证的应用出口

### 从开始到拿到结果

1. **先只读看当前路径**　列出所有在线网卡的 IPv6 开关与路线，并标明哪些是物理网卡；配置存在不等于浏览器一定从这条路上网。

2. **明确选网卡和目标状态**　本人在维护窗口选只查、开启或关闭，命令行另有整组切换；Tailscale 等虚拟网卡不随之改变。整组切换不记得原先每块网卡的不同状态。

3. **动手前再核对**　工具保存原设置，执行前确认仍是同一块网卡；身份或原设置变了就停。

4. **读回并处理失败**　逐项读回结果；中途失败尝试按本轮原设置恢复，无法恢复的地方单列。

5. **再看实际应用出口**　在需要的浏览器或终端里验证结果；再次切换或用代理撤销，不能保证回到原先状态。

::screen{#proxyclean-ipv6-routing-control-05 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 源项目 2737328 曾发布并通过双 PowerShell 版本测试，当前源码仍是同一关键实现；网页未执行真实 IPv6 切换 ### 关键规则与设计选择"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 源项目 2737328 曾发布并通过双 PowerShell 版本测试，当前源码仍是同一关键实现；网页未执行真实 IPv6 切换 ### 关键规则与设计选择"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 源项目 2737328 曾发布并通过双 PowerShell 版本测试，当前源码仍是同一关键实现；网页未执行真实 IPv6 切换 ### 关键规则与设计选择"
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
     "text_ref": "1. 只读IPv6-Status与显式IPv6-Toggle分开，普通代理清理不自动改IPv6。",
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
     "text_ref": "1. 只读IPv6-Status与显式IPv6-Toggle分开，普通代理清理不自动改IPv6。",
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

源项目 2737328 曾发布并通过双 PowerShell 版本测试，当前源码仍是同一关键实现；网页未执行真实 IPv6 切换

### 关键规则与设计选择

1. 只读IPv6-Status与显式IPv6-Toggle分开，普通代理清理不自动改IPv6。

2. 命令行Mode支持Toggle、Enable、Disable，图形维护窗口只有查看、开启、关闭；InterfaceAlias可限定明确候选，目标仍须Up、HardwareInterface=true并排除已知虚拟/隧道接口。

3. 每块网卡记录name、index和enabled前像；Toggle按anyOn=>全关、全关=>全开，Enable/Disable使用明确目标值。

4. 实际写入前检查管理员、接口索引/硬件身份与绑定原值；写后逐项验证。ShouldProcess拒绝或无需改变可使changed=0，返回的enabled是目标值，不能单凭它当实际全部状态。

5. catch只恢复本轮已尝试的绑定并回读，失败列为仍需恢复。该回退没有完整的并发新值CAS保护，也不是持久Undo；不承诺保住所有外来变化。

6. 配置绑定、IPv6默认路由、代理覆盖和应用出口分别验证。

## 当前怎样实现

- Get-PCIPv6Snapshot枚举全部Up接口，读取绑定与::/0，并逐个标明是否物理网卡及enabled/disabled/unknown；无法读取保留unknown（未验证），internet_reachability与proxy_routing均not_tested。

- Invoke-PCIPv6Change筛选Up且HardwareInterface=true，排除VMware/vEthernet/Loopback/Tailscale/WSL/FlyingBird/natpierce，并按可选InterfaceAlias缩小范围。

::screen{#proxyclean-ipv6-routing-control-06 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-06",
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
     "text_ref": "- 变更前为每项保存name/index/enabled。Mode显式选择目标，逐项ShouldProcess后才检查管理员并复核接口身份与当前绑定是否仍等于前像。",
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
     "text_ref": "- 变更前为每项保存name/index/enabled。Mode显式选择目标，逐项ShouldProcess后才检查管理员并复核接口身份与当前绑定是否仍等于前像。",
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

- 变更前为每项保存name/index/enabled。Mode显式选择目标，逐项ShouldProcess后才检查管理员并复核接口身份与当前绑定是否仍等于前像。

- 写入前将项加入changed列表，Enable/Disable-NetAdapterBinding后立即回读。失败时按changed列表恢复各自enabled前像并回读；无法恢复抛出明确残留，不再按整组状态反向Toggle。

- 回退分支未为并发改动建立完整CAS/持久撤销；普通代理配置Undo不能替代本次IPv6失败回退或以后明确的恢复动作。

- WhatIf（只读预演）返回preview；其余返回binding_verified、changed与目标enabled，取消项和零变化须结合实际状态解释，外网与代理路线始终not_tested。

## 执行流程

1. 先只读查看IPv6绑定和默认路由，明确需要回答的应用出口问题。

2. 选择Mode和可选InterfaceAlias，枚举合格活动物理接口并保存逐项前像。

::screen{#proxyclean-ipv6-routing-control-07 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-07",
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
     "text_ref": "3. 每个实际变更经过ShouldProcess、管理员、接口身份和绑定原值复核。",
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
     "text_ref": "3. 每个实际变更经过ShouldProcess、管理员、接口身份和绑定原值复核。",
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

3. 每个实际变更经过ShouldProcess、管理员、接口身份和绑定原值复核。

4. 写入并立即回读；途中失败恢复本次已尝试字段，回读失败保留恢复缺口。

5. 报告实际changed数量与逐项结果；目标enabled、默认路由和应用出口不互相代证。

::screen{#proxyclean-ipv6-routing-control-08 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-08",
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
| IPv6 Default Route（IPv6 默认路由） | 目的前缀为 ::/0 的路由；它与 IPv4 的 0.0.0.0/0 独立，可能形成另一条出站路径。 |
| HardwareInterface（硬件接口标记） | Windows 网卡属性，用来把真实硬件上网网卡和 Tailscale、WSL（Windows 的 Linux 子系统）、natpierce 等虚拟接口分开。 |

## 专业定义

保留 natpierce、Tailscale、WSL（Windows 的 Linux 子系统） 和其他虚拟网卡；网页刷新绝不自动切换

::screen{#proxyclean-ipv6-routing-control-09 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-09",
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
     "text_ref": "- **确需变更但不是管理员**：修改前失败，不靠cmdlet权限报错后继续；无变更或预览不等于已完成修改。",
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
     "text_ref": "- **确需变更但不是管理员**：修改前失败，不靠cmdlet权限报错后继续；无变更或预览不等于已完成修改。",
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

避免把 IPv6 绕行问题误当成代理端口故障，也避免为了排查而把私有组网和虚拟化网络一起关掉。

## 边界

- 不在网页、普通代理清理或只读状态中自动切换IPv6。

- 仅合格活动物理候选参与，虚拟网卡排除；显式别名不绕过硬件与活动条件。

- 本轮失败恢复按逐项原值，不等于持久Undo或完整并发保护；断电、驱动失败和外来修改仍可能留下需要现场处理的状态。

- 改变IPv6绑定不证明代理泄漏消失、DNS正确或公网稳定。

## 失败与恢复

- **确需变更但不是管理员**：修改前失败，不靠cmdlet权限报错后继续；无变更或预览不等于已完成修改。

- **没有合格活动物理网卡，或选择后身份/原值变化**：停止，不换成虚拟接口；重新读取准确目标后再判断。

::screen{#proxyclean-ipv6-routing-control-10 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-10",
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
     "text_ref": "- **中途写入或回读失败**：按本轮已尝试项恢复原绑定并核对；有恢复残留则报告，不能用再次整组切换替代。",
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
     "text_ref": "- **中途写入或回读失败**：按本轮已尝试项恢复原绑定并核对；有恢复残留则报告，不能用再次整组切换替代。",
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

- **中途写入或回读失败**：按本轮已尝试项恢复原绑定并核对；有恢复残留则报告，不能用再次整组切换替代。

- **期间出现其他修改或进程/电脑中断**：当前回退不保证完整保留并发新值或跨进程恢复；先查实际接口及原记录，只做明确的后续恢复。

- **切换后应用仍走意外出口**：单独检查应用、代理、DNS与路由；不能从一次配置切换推出业务结果。

::screen{#proxyclean-ipv6-routing-control-11 section="tech"}

```typeset
{
 "screen": {
  "id": "proxyclean-ipv6-routing-control-11",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 WiFi 恢复",
    "href": "/projects/proxyclean/wifi-rebind-and-recovery/"
   },
   {
    "text": "下一个模块 日常入口与故障边界",
    "href": "/projects/proxyclean/one-click-and-troubleshooting-boundaries/"
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
     "text_ref": "- **IPv6-Status.ps1**：只读 IPv6 绑定与默认路由状态",
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
     "text_ref": "- **IPv6-Status.ps1**：只读 IPv6 绑定与默认路由状态",
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

- **IPv6-Status.ps1**：只读 IPv6 绑定与默认路由状态

- **IPv6-Toggle.ps1**：物理上网网卡 IPv6 的整组切换、开启、关闭与逐项结果（-Mode Toggle|Enable|Disable）

- **旧版入口/IPv6状态.bat / 旧版入口/IPv6切换.bat**：保留兼容的旧双击入口；日常图形维护窗口提供 IPv6 查看、开启和关闭，没有整组切换按钮，旧的“切换”启动方式只会引导你选开启或关闭

## 如何验证

- 2026-09-18 网站只读检查过 Mode/InterfaceAlias、前像、管理员、身份/原值复核与恢复代码；2026-09-22 更新的是图形入口语义；2026-10-11 按当天 14:00 前的源码再核对，关键实现仍在，图形窗口实际只有查看、开启、关闭。都未执行真实 IPv6 变化。

- 历史证据：源项目已经把该能力发布到 PUBLIC（公开） master 2737328 并远端读回；双测试脚本在 Windows PowerShell 5.1 与 PowerShell 7 通过。这是当时的结果，不是本轮重跑。

- 历史证据：网站未执行真实 IPv6 切换，也没有用当前应用出口证明切换后的用户结果。

- 历史证据：源857b110移除由IPv6关闭推导代理路径或公网稳定的结论，缺失绑定显示UNKNOWN（未验证）；仅源码/隔离验证，没有切换真实网卡。

## 与其他模块的关系

从 Scripts 吸收进 ProxyClean 的网络路径能力，独立于默认代理残留清理和 WiFi 恢复。
