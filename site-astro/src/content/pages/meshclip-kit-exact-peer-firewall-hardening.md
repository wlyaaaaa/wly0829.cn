---
{
 "title": "精确对端防火墙与宽泛规则防御",
 "kind": "project",
 "url": "/projects/meshclip-kit/exact-peer-firewall-hardening/",
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
  "page": "meshclip-kit-exact-peer-firewall-hardening",
  "kind": "project",
  "title": "精确对端防火墙与宽泛规则防御",
  "url": "/projects/meshclip-kit/exact-peer-firewall-hardening/",
  "parent": "meshclip-kit",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码核至 9 月 29 日提交 61fa792e（10 月 20 日回读远端无新提交），运行情况取北京时间 10 月 20 日 7:34—7:43 之间的一次主机只读自检",
   "last": {
    "label": "快照核对",
    "at": "2026-10-11"
   }
  }
 },
 "source": {
  "page": "sources/pages/meshclip-kit-exact-peer-firewall-hardening/page.json",
  "sha256": "86a273c2459ca913c74cf91ebac2c14bc3dfdc8f1ddd986d035a153b45a5e5ce",
  "converted_at_beijing": "2026-10-20T08:56:32+08:00"
 }
}
---

::screen{#meshclip-kit-exact-peer-firewall-hardening-01 section="top"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-01",
  "section": "top",
  "title": "精确对端防火墙与宽泛规则防御",
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
     "text_ref": "精确对端防火墙与宽泛规则防御",
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
     "static_note": "截至 10 月 11 日 · 源码核至 9 月 29 日提交 61fa792e（10 月 20 日回读远端无新提交），运行情况取北京时间 10 月 20 日 7:34—7:43 之间的一次主机只读自检",
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
     "text_ref": "能够说清本项目开放给谁、通过哪个接口和程序，并可逆撤销自己的配置。",
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
     "text_ref": "精确对端防火墙与宽泛规则防御",
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
     "static_note": "截至 10 月 11 日 · 源码核至 9 月 29 日提交 61fa792e（10 月 20 日回读远端无新提交），运行情况取北京时间 10 月 20 日 7:34—7:43 之间的一次主机只读自检"
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
     "text_ref": "能够说清本项目开放给谁、通过哪个接口和程序，并可逆撤销自己的配置。"
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
   "asset": "_library/module-illustrations/meshclip-kit/exact-peer-firewall-hardening-v01.png",
   "key": "双机互传",
   "source_phrase": "右上一幅水彩插画：左边一台台式机（显示器亮着），右边一台笔记本，两台隔着一段距离，中间画一张浅绿色的网（网上画 Tailscale 标志）把它们连起来；台式机屏幕上一张小便签正沿着网飞向笔记本，笔记本屏幕上出现同样一张便签；网的下面一个小文件夹也在往对面飞；两台电脑任务栏右下角各画一个小小的 KDE Connect 图标；台式机旁边蹲着一只拿着怀表的小绿狗（看门狗），笔记本旁边没有；周围水彩绿叶。",
   "sha256": "8be8d43137650c31958c6110d6a951803dcdf72b262a791c9bb0ce8c87b1ca5d",
   "status": "ready"
  }
 ]
}
```

# 精确对端防火墙与宽泛规则防御

〔回到项目 → 双机剪贴板〕　〔GitHub〕　〔复制 AI 续作说明〕

MeshClip Kit · 功能说明

能够说清本项目开放给谁、通过哪个接口和程序，并可逆撤销自己的配置。

当前情况：10 月 20 日早上（7:34—7:43 之间）主机只读自检，两条项目规则仍合规，但“别的规则有没有放行 KDE Connect”这一项失败：主机上另有不属于本项目、不限来源的入站放行指向 KDE Connect。何时、被哪个安装程序或谁加回来的没查到；这次只发现、没修，要不要按本功能先预览再停用由我决定。这是主机一端的检查，副机规则没查，两端配对和实际传输仍需自己的结果。

项目快照核对于 2026-10-20（北京时间），运行情况依据当天早上 7:34—7:43 之间的主机只读自检；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#meshclip-kit-exact-peer-firewall-hardening-02 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 只添加两条窄规则仍可能被旧宽规则抵消，所以必须同时核对现有KDE规则。变更保留原状态，以便撤销项目时恢复。 ## 举个实际例子 “我只想让这两台电脑互传，别向别的设备开放。”AI先"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 只添加两条窄规则仍可能被旧宽规则抵消，所以必须同时核对现有KDE规则。变更保留原状态，以便撤销项目时恢复。 ## 举个实际例子 “我只想让这两台电脑互传，别向别的设备开放。”AI先"
   },
   {
    "id": "module-product-title",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 只添加两条窄规则仍可能被旧宽规则抵消，所以必须同时核对现有KDE规则。变更保留原状态，以便撤销项目时恢复。 ## 举个实际例子 “我只想让这两台电脑互传，别向别的设备开放。”AI先"
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

只添加两条窄规则仍可能被旧宽规则抵消，所以必须同时核对现有KDE规则。变更保留原状态，以便撤销项目时恢复。

## 举个实际例子

“我只想让这两台电脑互传，别向别的设备开放。”AI先列出这次连接实际需要的规则和允许设备，展示调整范围；按授权处理后分别检查允许的电脑和其他设备，配对与真实传输另行确认。

## 最后我会得到什么

KDE流量的项目规则明确限定批准对端；本机其他应用与整个Windows防火墙不属于该结论。

::screen{#meshclip-kit-exact-peer-firewall-hardening-03 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-03",
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

只允许已批准的电脑进入 KDE Connect 所需范围，原有宽泛规则也已核对。

## 发现问题时

发现其他宽泛规则时先停止，展示将禁用哪些规则并等待本人明确选择。

## 入口不可用或证据不足时

修改需要管理员权限；只读检查若无法看全规则，就报告未知，不把缺证据当安全通过。

::screen{#meshclip-kit-exact-peer-firewall-hardening-04 section="usage"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-04",
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
     "text_ref": "在两台电脑分别运行 scripts/configure-peer.ps1 -Peer 指定已核实的对端；遇到宽泛旧规则先用 -WhatIf 预览，再明确允许禁用。",
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
     "text_ref": "1. **检查已有规则**　逐端核对对端地址、程序及现有入站规则；冲突先停止。",
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
     "text_ref": "在两台电脑分别运行 scripts/configure-peer.ps1 -Peer 指定已核实的对端；遇到宽泛旧规则先用 -WhatIf 预览，再明确允许禁用。"
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
     "text_ref": "1. **检查已有规则**　逐端核对对端地址、程序及现有入站规则；冲突先停止。",
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

在两台电脑分别运行 scripts/configure-peer.ps1 -Peer 指定已核实的对端；遇到宽泛旧规则先用 -WhatIf 预览，再明确允许禁用。

## 需要准备什么

- 批准互连的对端电脑

- 发现宽泛旧规则时是否接受预览后的定向禁用

## 从开始到拿到结果

1. **检查已有规则**　逐端核对对端地址、程序及现有入站规则；冲突先停止。

2. **只加精确通路**　明确同意后禁用相关宽泛规则并写入限定端口、协议、程序和接口的新规则。

3. **回读或回滚**　两端分别回读规则；失败尝试恢复本轮改动，doctor 报告未完成事务。

::screen{#meshclip-kit-exact-peer-firewall-hardening-05 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机精确入站与非项目规则检查通过；副机规则这次没查 ### 关键规则与设计选择 1. 规则同时约束协议、端口、程序、接口与单"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机精确入站与非项目规则检查通过；副机规则这次没查 ### 关键规则与设计选择 1. 规则同时约束协议、端口、程序、接口与单"
   },
   {
    "id": "module-technical-title",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 10 月 11 日 13:33 主机精确入站与非项目规则检查通过；副机规则这次没查 ### 关键规则与设计选择 1. 规则同时约束协议、端口、程序、接口与单"
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
     "text_ref": "1. 规则同时约束协议、端口、程序、接口与单对端地址，不把0.0.0.0监听地址等同于防火墙远程放行范围。",
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
     "text_ref": "1. 规则同时约束协议、端口、程序、接口与单对端地址，不把0.0.0.0监听地址等同于防火墙远程放行范围。",
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

10 月 20 日早上主机精确入站检查通过，非项目宽泛规则检查失败（另有宽泛放行指向 KDE Connect，未处理）；副机规则这次没查

### 关键规则与设计选择

1. 规则同时约束协议、端口、程序、接口与单对端地址，不把0.0.0.0监听地址等同于防火墙远程放行范围。

2. 宽泛非项目规则只在显式选项下禁用，不删除，保留恢复记录。

3. 卸载核对资源是否仍由本项目拥有且未变化，变化资源保留并报告。

## 当前怎样实现

- Get-MeshClipKdeFirewallAudit读取指向可信kdeconnectd.exe的入站规则和过滤条件。

- Disable-MeshClipBroadKdeFirewallRules禁用明确冲突规则并记录。

- New-MeshClipFirewallRules创建TCP/UDP两条精确过滤规则；事务失败按记录回滚。

::screen{#meshclip-kit-exact-peer-firewall-hardening-06 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-06",
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
     "text_ref": "- scripts/MeshClip.Transaction.ps1在集成效果前持久记录带类型恢复步骤；失败和硬中断保留待恢复。recover.ps1默认只预览，Apply反向核对实际资源再恢复；外来改动不覆盖，未完成记录不能被新安装/configure覆写。软件包与KDE配对身份不在该集成事务范围。",
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
     "text_ref": "- scripts/MeshClip.Transaction.ps1在集成效果前持久记录带类型恢复步骤；失败和硬中断保留待恢复。recover.ps1默认只预览，Apply反向核对实际资源再恢复；外来改动不覆盖，未完成记录不能被新安装/configure覆写。软件包与KDE配对身份不在该集成事务范围。",
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

- scripts/MeshClip.Transaction.ps1在集成效果前持久记录带类型恢复步骤；失败和硬中断保留待恢复。recover.ps1默认只预览，Apply反向核对实际资源再恢复；外来改动不覆盖，未完成记录不能被新安装/configure覆写。软件包与KDE配对身份不在该集成事务范围。

## 执行流程

1. 解析批准对端和可信daemon路径，读取当前规则。

2. 发现冲突时停止；显式选项下先预览，再执行可逆禁用。

3. 保存本机状态并添加精确TCP/UDP规则。

4. 回读规则；失败按原记录回滚，未完成事务由doctor报告。

::screen{#meshclip-kit-exact-peer-firewall-hardening-07 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-07",
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
| fail-closed（失败阻断） | 当安全检测发现异常或潜在漏洞时，系统默认选择关闭或拒绝执行，而非冒险放行。 |
| 端口收敛 | 将开放监听的服务端口通过防火墙策略收缩到最小必需网络接口与最小授信客户端 IP 集合。 |

## 专业定义

将 KDE 入站限定到选定对端，冲突规则可逆处理

::screen{#meshclip-kit-exact-peer-firewall-hardening-08 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-08",
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
     "text_ref": "- **存在不限来源、或地址/端口/接口过滤不精确的非项目 KDE 入站放行**：脚本立即 fail-closed 终止，提示使用 -DisableBroadKdeFirewallRules 参数进行受控加固；哪怕看起来很窄，只要还生效就挡住最终验收。",
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
     "text_ref": "- **存在不限来源、或地址/端口/接口过滤不精确的非项目 KDE 入站放行**：脚本立即 fail-closed 终止，提示使用 -DisableBroadKdeFirewallRules 参数进行受控加固；哪怕看起来很窄，只要还生效就挡住最终验收。",
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

若缺少 Windows 管理员提权，无法写入防火墙规则；若用户未明确授权加固且存在宽泛规则，脚本安全拒绝推进。

## 边界

- 只处理本项目KDE规则与明确识别的冲突规则，不代替全机网络策略。

- 卸载不自动删除第三方程序，已变化资源不强行覆盖。

## 失败与恢复

- **存在不限来源、或地址/端口/接口过滤不精确的非项目 KDE 入站放行**：脚本立即 fail-closed 终止，提示使用 -DisableBroadKdeFirewallRules 参数进行受控加固；哪怕看起来很窄，只要还生效就挡住最终验收。

- **运行缺乏管理员权限**：Test-MeshClipAdministrator 检查失败并抛出提权提示，不破坏性部分写入。

- **安装或配置中断、回滚未完成**：保留原操作记录，先只读恢复预览；按记录处理仍匹配的资源，外来修改继续待协调，不删除标记伪造通过。

::screen{#meshclip-kit-exact-peer-firewall-hardening-09 section="tech"}

```typeset
{
 "screen": {
  "id": "meshclip-kit-exact-peer-firewall-hardening-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 跨网组网与对端发现",
    "href": "/projects/meshclip-kit/tailscale-peer-reachability/"
   },
   {
    "text": "下一个模块 设备配对与文件传输",
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
     "text_ref": "- `scripts\\configure-peer.ps1`防火墙加固与规则创建入口",
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
     "text_ref": "- `scripts\\configure-peer.ps1`防火墙加固与规则创建入口",
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

- `scripts\configure-peer.ps1`防火墙加固与规则创建入口

- `scripts\uninstall.ps1`规则清理与历史宽泛规则可逆恢复

- `tests\MeshClip.Common.Tests.ps1`防火墙过滤契约等价性测试

## 如何验证

- 当前测试源码覆盖防火墙规则名哈希确定性、精准过滤契约与多余地址排除断言；这次没有重新运行测试。

- 10 月 20 日早上（7:34—7:43 之间）主机 `doctor.ps1 -AsJson` 只读检查，22 项为 20 PASS / 1 FAIL / 1 WARN：Exact-peer firewall 为 PASS；Unmanaged KDE firewall 为 FAIL（Broad non-project inbound allow rules target KDE Connect，即有不属于本项目的宽泛入站放行指向 KDE Connect）；KDE peer availability 为 WARN（此刻没有已配对且可达的设备）。10 月 11 日 13:33 那次两项防火墙检查都是 PASS，宽泛规则何时重新出现没取证。不代表副机规则或真实传输也已核过；这次没有运行 Disable 选项。

## 与其他模块的关系

让KDE网络访问范围与批准对端一致，配对仍由KDE及用户负责。
