---
{
 "title": "从干净源码到双副屏本机安装态",
 "kind": "project",
 "url": "/projects/pc-panel-hub/installation-binding-migration/",
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
  "page": "pc-panel-hub-installation-binding-migration",
  "kind": "project",
  "title": "从干净源码到双副屏本机安装态",
  "url": "/projects/pc-panel-hub/installation-binding-migration/",
  "parent": "pc-panel-hub",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "源码按 10 月 18 日最后一次提交 981d3bd 核对（10 月 20 日回读远端无新提交；手机来源改动是 10 月 14—16 日的提交）；HS2 浮层改成从永久目录发布和注册，安装位置按 9 月 28 日验收记录（1.0.0.2），10 月 20 日早上运行中的包为 1.0.0.4；新机和重装仍未走通"
  }
 },
 "source": {
  "page": "sources/pages/pc-panel-hub-installation-binding-migration/page.json",
  "sha256": "87741b189ad847b56bea36463625bc7ec8b9c66f7bb22decba8c891c08db301c",
  "converted_at_beijing": "2026-10-22T08:32:32+08:00"
 }
}
---

::screen{#pc-panel-hub-installation-binding-migration-01 section="top"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-01",
  "section": "top",
  "title": "从干净源码到双副屏本机安装态",
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
     "text_ref": "从干净源码到双副屏本机安装态",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 18 日最后一次提交 981d3bd 核对（10 月 20 日回读远端无新提交；手机来源改动是 10 月 14—16 日的提交）；HS2 浮层改成从永久目录发布和注册，安装位置按 9 月 28 日验收记录（1.0.0.2），10 月 20 日早上运行中的包为 1.0.0.4；新机和重装仍未走通",
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
     "text_ref": "换电脑、重装系统或重新布线时，我能从公开仓库重建一套属于当前机器的双副屏安装，而不用复制旧路径、旧串口和旧硬件实例号，也不会为了方便把私人配置或厂商二进制塞回 Git。",
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
     "text_ref": "从干净源码到双副屏本机安装态",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 18 日最后一次提交 981d3bd 核对（10 月 20 日回读远端无新提交；手机来源改动是 10 月 14—16 日的提交）；HS2 浮层改成从永久目录发布和注册，安装位置按 9 月 28 日验收记录（1.0.0.2），10 月 20 日早上运行中的包为 1.0.0.4；新机和重装仍未走通"
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
     "text_ref": "换电脑、重装系统或重新布线时，我能从公开仓库重建一套属于当前机器的双副屏安装，而不用复制旧路径、旧串口和旧硬件实例号，也不会为了方便把私人配置或厂商二进制塞回 Git。"
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
   "asset": "_library/illustrations/modules/pc-panel-hub-installation-binding-migration-v01.png",
   "key": "main-pc-panel-hub",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，机箱内侧竖着一条细长的小屏（上面只画浅绿色的小卡片和一条小折线，不画字），机箱顶部水冷头上一块弯弯的曲面屏（上面只画一个大号时钟形状和两三张半透明小卡片的轮廓，不画字）；机箱旁一部手机，手机和曲面屏之间一条虚线小箭头。",
   "sha256": "abf0710f318ab33a0b392e1fc66fadaf4abfff1d4b6fa22d0aa3cbbf336ae3d4",
   "status": "ready"
  }
 ]
}
```

# 从干净源码到双副屏本机安装态

〔回到项目 → 双屏信息中心〕　〔GitHub〕　〔复制 AI 续作说明〕

PC Panel Hub · 功能说明

换电脑、重装系统或重新布线时，我能从公开仓库重建一套属于当前机器的双副屏安装，而不用复制旧路径、旧串口和旧硬件实例号，也不会为了方便把私人配置或厂商二进制塞回 Git。

**当前情况：**这台电脑上，水冷屏浮层已经从容易被清掉的编译输出搬到固定的永久目录，9 月 28 日本人粗看正常、正式安装位置验收已关闭（当时包版本 1.0.0.2）；之后为接 vivo 通知和安卓调试电量又发了新包，10 月 20 日早上读到正在运行的是 1.0.0.4，没重新做安装位置验收；源码包和本机原任务重启也有验证。干净新机、重装与新硬件双屏安装仍未实际走通。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#pc-panel-hub-installation-binding-migration-02 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 公开源码能下载，不等于这台电脑已接上两块屏。厂商程序、串口、网卡、天气位置和显示器身份要在本机合法取得并重新确认；照搬旧编号可能把画面送错。 举个实际例子 我说“这台新电脑也要用上两块副屏”。"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 公开源码能下载，不等于这台电脑已接上两块屏。厂商程序、串口、网卡、天气位置和显示器身份要在本机合法取得并重新确认；照搬旧编号可能把画面送错。 举个实际例子 我说“这台新电脑也要用上两块副屏”。"
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

公开源码能下载，不等于这台电脑已接上两块屏。厂商程序、串口、网卡、天气位置和显示器身份要在本机合法取得并重新确认；照搬旧编号可能把画面送错。水冷屏浮层如果直接从编译输出运行，一次清理就可能把正在用的程序删掉。

## 举个实际例子

我说“把水冷屏浮层更新到新版”，AI 会把新版发布到一个新的永久目录、先只读检查、再注册，并回读注册位置和运行进程，旧版本目录留着等新版实体确认后再处理。我说“这台新电脑也要用上两块副屏”，安装过程会重新识别当前串口、网卡、天气位置和显示器，不照抄旧机器编号。

## 最后我会得到什么

得到在这台电脑上安装的两块副屏和自动启动设置；源码、程序运行、安装位置、机箱屏实体更新、水冷屏实际落点分别验收，缺一项只说明缺一项。

::screen{#pc-panel-hub-installation-binding-migration-03 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-03",
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

厂商文件、私有配置和两块真实设备都确认后，安装启动任务，再分别看两块实体屏。

## 发现问题时

端口、显示器或旧绑定不对时停在那一层修正，不靠整机重启碰运气。

## 入口不可用或证据不足时

合法厂商文件或唯一设备身份缺失时不能完成本机安装；软件演示仍只算演示。

::screen{#pc-panel-hub-installation-binding-migration-04 section="usage"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-04",
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
     "text_ref": "在已接入项目的本机 AI 对话中说要在这台新电脑安装双副屏，并准备合法取得的厂商程序和两块实体设备。",
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
     "text_ref": "1. **从干净源码准备**　补齐厂商文件，把示例配置复制为本机私有配置，重新发现端口和显示器。",
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
     "text_ref": "在已接入项目的本机 AI 对话中说要在这台新电脑安装双副屏，并准备合法取得的厂商程序和两块实体设备。"
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
     "text_ref": "1. **从干净源码准备**　补齐厂商文件，把示例配置复制为本机私有配置，重新发现端口和显示器。",
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

在已接入项目的本机 AI 对话中说要在这台新电脑安装双副屏，并准备合法取得的厂商程序和两块实体设备。

## 需要准备什么

- 本机串口、物理网口和天气位置

- 合法取得的厂商运行文件

- HS2 显示器和背景选择

## 从开始到拿到结果

1. **从干净源码准备**　补齐厂商文件，把示例配置复制为本机私有配置，重新发现端口和显示器。

2. **先查环境再安装**　runtime（运行环境） check 有缺项就停；确认设备身份、渲染发送和 HS2 唯一落点后才装登录任务。

3. **本人看两块实体屏**　分别确认机箱屏更新和 HS2 背景与浮层位置，再验证自然登录启动；旧机器编号不当新机事实。

::screen{#pc-panel-hub-installation-binding-migration-05 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月7日公开ZIP和本机既有任务重新启动已验证；clean clone（干净克隆）、换机、系统重装和新硬件双屏验收仍未执行 关键规则与设计选择 1 clean clon"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 9月7日公开ZIP和本机既有任务重新启动已验证；clean clone（干净克隆）、换机、系统重装和新硬件双屏验收仍未执行 关键规则与设计选择 1 clean clon"
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
     "text_ref": "HS2包1.0.0.2注册在永久目录，9月28日正式安装位置验收关闭；10月20日早上运行中进程旁AppxManifest为1.0.0.4（安装位置未重新验收）；9月7日公开ZIP和本机既有任务重新启"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. clean clone 只带公开源码、文档、脚本、测试和无真实值示例；厂商 EXE/DLL、私有 JSON、out/bin/obj、日志和设备绑定不属于 Git 交付。",
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
     "text_ref": "HS2包1.0.0.2注册在永久目录，9月28日正式安装位置验收关闭；10月20日早上运行中进程旁AppxManifest为1.0.0.4（安装位置未重新验收）；9月7日公开ZIP和本机既有任务重新启"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. clean clone 只带公开源码、文档、脚本、测试和无真实值示例；厂商 EXE/DLL、私有 JSON、out/bin/obj、日志和设备绑定不属于 Git 交付。",
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
HS2 包 1.0.0.2 注册在永久目录，9 月 28 日正式安装位置验收关闭；10 月 20 日早上运行中进程旁 AppxManifest 为 1.0.0.4（安装位置未重新验收）；9 月 7 日公开 ZIP 和本机既有任务重新启动已验证。clean clone（干净克隆）、换机、系统重装和新硬件双屏验收仍未执行

## 关键规则与设计选择

1. clean clone 只带公开源码、文档、脚本、测试和无真实值示例；厂商 EXE/DLL、私有 JSON、out/bin/obj、日志和设备绑定不属于 Git 交付。

2. RJCP.SerialPortStream.dll 与 TURZX.exe 或 TURZX.weatherfix.metrics.exe 必须由安装者从有权使用的来源取得，并放在仓库根；项目不代为分发。厂商界面不再用了，不等于这些运行依赖也不需要了。

3. config.example.json 只能作为模板；复制成 ignored（已被版本控制忽略） config.json 后再填写当前 serial.port、network.publicInterface 与 weather 经纬度，换机不沿用旧值。

4. check-runtime 只读检查 Python、按需 psutil/asyncpg、csc.exe、RJCP、TURZX 运行文件和 StartSideScreenStack；任一必需项缺失时安装器拒绝注册任务。

5. TURZX 绑定当前真实串口并在实机写入前确认唯一健康设备；COM7 只是本机默认，不是迁移常量。

6. HS2 重新发现唯一健康 8091 Hub、port 2 控制器、port 3 LED、AD23 与 MI_00 显示接口；只有连续两次健康才保存新的 ignored（已被版本控制忽略） 拓扑绑定并启用浮层。

7. HS2 浮层只从永久目录运行：先发布到一个全新目录（逐文件记哈希、目录已存在就拒绝覆盖），默认只读检查，确认后才注册；安装器拒绝把 bin、obj、临时或缓存目录当安装位置。

8. 启动任务属于当前交互用户，以 Highest 在登录时由 wscript 无窗口启动唯一长期 watchdog；旧 stock 任务被禁用而非删除。旧的“唤醒后重启”恢复脚本 9 月 29 日已删除，睡眠恢复只由长期 watchdog 负责。

::screen{#pc-panel-hub-installation-binding-migration-06 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-06",
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
     "text_ref": "9. 验收顺序固定为源码/公开包、runtime（运行环境） check、配置与绑定、HS2 安装位置回读、任务/进程/heartbeat、TURZX 实体像素、HS2 实体背景与浮层、睡眠恢复和异常断电后的自然启动；前一层不能替后一层。",
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
     "text_ref": "9. 验收顺序固定为源码/公开包、runtime（运行环境） check、配置与绑定、HS2 安装位置回读、任务/进程/heartbeat、TURZX 实体像素、HS2 实体背景与浮层、睡眠恢复和异常断电后的自然启动；前一层不能替后一层。",
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

9. 验收顺序固定为源码/公开包、runtime（运行环境） check、配置与绑定、HS2 安装位置回读、任务/进程/heartbeat、TURZX 实体像素、HS2 实体背景与浮层、睡眠恢复和异常断电后的自然启动；前一层不能替后一层。

## 当前怎样实现

- build-release.ps1 从源码构建 ZIP，只纳入 README、AGENTS、LICENSE、docs、scripts 与三套 tool source；测试会解包核对 HS2 源码和公开清单。这是公开源码包，和下面的 HS2 安装布局是两种不同的成品。

- Publish-HS2Overlay.ps1 -OutputDirectory <新的永久目录>：构建 Release 版并复制 Windows App SDK 要求的全部依赖和资源，逐文件记哈希，目录已存在就拒绝；它不注册、不启动、不改任务。

- Install-HS2Overlay.ps1 -PackageDirectory <永久目录>：默认只读检查；加 -Apply 才在目标用户会话里注册（沿用原来的包身份、权限和设置），注册后回读安装位置，读回来不一致就判失败。源码文档记的当前包版本 1.0.0.4（10 月 20 日早上运行中的也是 1.0.0.4；后续发布继续递增 Package.appxmanifest 版本号），应用基于 .NET 10 和 Windows App SDK 2.3.1，运行时要求 WindowsAppRuntime 2.3.1 以上。

- 发布规则只允许 tools/turzx_side_screen/config.example.json 这一份配置示例；真实 config.json、weather local JSON、out、bin、obj、AppPackages、厂商 EXE/DLL 和生成预览全部排除。

- config.json 保存当前机 serial、480×1920 刷新、loopback metrics（这台电脑用 18766 端口，源码默认 18765）、天气、时区、物理公网接口与 UI 选项；天气也可从显式私有路径或成对环境变量注入，未填坐标时失败关闭。

- check-runtime.ps1 发现合适 Python 与 C# 编译器，核对 RJCP/TURZX 文件和 stack 入口，并返回 ready/missing；TimeAudit 凭据存在时才要求 Python 同时具备 psutil 与 asyncpg。

- StartSideScreenWatchdog.ps1 在 ignored（已被版本控制忽略） out 中维护 hs2-usb-topology-binding.json；新机器或改线后由健康拓扑生成，旧绑定不作为跨机事实。

::screen{#pc-panel-hub-installation-binding-migration-07 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-07",
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
     "text_ref": "- install-startup-admin.ps1 先调用 runtime（运行环境） check，再把已解析 Root、Port、Interval 与 Hybrid 模式写进计划任务动作；wscript 父适配器保持无窗口长期运行。遇到旧的恢复任务仍会禁用。",
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
     "text_ref": "- install-startup-admin.ps1 先调用 runtime（运行环境） check，再把已解析 Root、Port、Interval 与 Hybrid 模式写进计划任务动作；wscript 父适配器保持无窗口长期运行。遇到旧的恢复任务仍会禁用。",
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

- install-startup-admin.ps1 先调用 runtime（运行环境） check，再把已解析 Root、Port、Interval 与 Hybrid 模式写进计划任务动作；wscript 父适配器保持无窗口长期运行。遇到旧的恢复任务仍会禁用。

- uninstall-startup-admin.ps1 可移除主任务；安装器只禁用旧 stock 任务而不删除，Hybrid 不兼容时另有显式 command-200 三秒兼容模式。旧 Resume 脚本和隐藏启动器 9 月 29 日已删除。

- 验收记录把当前主机运行证据和新机/重装 E2E（端到端验证） 分开；没有摄像头或设备 ACK 时，以人工观察两块实体屏和自然启动作为最后一层。

## 执行流程

1. 从 PUBLIC（公开） main 或公开源码 ZIP 建立 clean clone。

2. 从合法来源把 RJCP 串口库与 TURZX 运行程序放到仓库根。

3. 复制 config.example.json 为 ignored（已被版本控制忽略） config.json，填写当前串口、物理公网接口和天气；不改公开模板。

4. 运行 check-runtime，缺项时停止且不注册启动任务。

5. 确认 TURZX 当前实际串口与唯一设备身份，再做主机侧渲染/发送检查。

::screen{#pc-panel-hub-installation-binding-migration-08 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-08",
  "section": "tech",
  "title": "技术实现与依据（四）",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "6. 让 HS2 进入当前可用模式，核对唯一 8091、port 2 controller、port 3 LED、AD23/MI_00 与非主 2288×1048 显示器；连续两次健康后保存绑定。",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "6. 让 HS2 进入当前可用模式，核对唯一 8091、port 2 controller、port 3 LED、AD23/MI_00 与非主 2288×1048 显示器；连续两次健康后保存绑定。",
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

## 技术实现与依据（四）

6. 让 HS2 进入当前可用模式，核对唯一 8091、port 2 controller、port 3 LED、AD23/MI_00 与非主 2288×1048 显示器；连续两次健康后保存绑定。

7. 把 HS2 浮层发布到新的永久目录，只读检查通过后注册，回读安装位置。

8. 在 HS2 目标显示器选择 Wallpaper Engine 背景或 Windows 静态背景；浮层本身不复制或修改壁纸资产。

9. start.ps1、install-startup-admin.ps1 和 uninstall-startup-admin.ps1 在需要时自动提权；安装仍面向当前交互用户，并回读任务动作、Root、Highest 与唯一 watchdog。

10. 检查 runtime（运行环境）、唯一进程、heartbeat、HS2 落点和公开安全边界。

11. 分别观察 TURZX 实体时钟/像素、HS2 背景/透明浮层，再按需要验睡眠恢复与异常断电后的自然启动。

::screen{#pc-panel-hub-installation-binding-migration-09 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-09",
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
| source package（源码包） | 能公开克隆、构建和检查的代码/文档集合，不包含一台机器的可执行依赖、配置、绑定或运行输出。 |
| private config（私有配置） | 由 config.example.json 派生、被 Git 忽略的当前机串口、物理网卡和天气等值；可备份但不能公开提交。 |
| machine binding（机器绑定） | 当前电脑上 TURZX 串口与 HS2 Hub/controller/LED/display 的实际身份关系；换机或重接后必须重新发现。 |
| runtime gate（运行依赖门） | check-runtime 返回 ready 前不允许安装启动任务，避免把缺依赖的路径变成开机故障。 |
| 永久安装目录 | HS2 浮层发布出来的固定目录，每个版本一个新目录、不覆盖旧的；系统按这里注册和启动，清理源码编译输出不会影响正在用的浮层。这台电脑现在是 E:\Tools\PC-Panel-Hub\HS2\release-20260927-slim。 |
| layered acceptance（分层验收） | 源码、测试、安装、进程/heartbeat、实体像素、睡眠恢复和自然启动分别给结论，不能互相替代。 |

## 专业定义

把 clean clone（干净克隆）、合法取得的厂商运行文件、每台机器自己的串口/物理网卡/天气配置和双屏绑定按顺序组装；依赖未齐时不装启动任务，主机通过后仍单独看实体像素。

::screen{#pc-panel-hub-installation-binding-migration-10 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-10",
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
     "text_ref": "- 厂商 TURZX 程序、RJCP 二进制和 Wallpaper Engine 场景必须从安装者有权使用的来源取得；PUBLIC（公开） 仓库与源码 ZIP 不重新分发。",
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
     "text_ref": "- 厂商 TURZX 程序、RJCP 二进制和 Wallpaper Engine 场景必须从安装者有权使用的来源取得；PUBLIC（公开） 仓库与源码 ZIP 不重新分发。",
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

解决公开源码缺少本机私有运行态、换机误复制硬件身份、厂商文件误入 Git、依赖未齐先装任务、旧路径残留、双屏只验进程不验像素，以及安装失败后没有清晰回退的问题。

## 边界

- 厂商 TURZX 程序、RJCP 二进制和 Wallpaper Engine 场景必须从安装者有权使用的来源取得；PUBLIC（公开） 仓库与源码 ZIP 不重新分发。

- config.json、天气坐标、物理网卡名、TIMEAUDIT 凭据、设备拓扑绑定、日志和生成输出保持在 Git 外；公开示例继续为空值。

- 旧机器的 COM7、DISPLAY 编号、8091/AD23/LED 实例号和任务 Root 都不是新机器事实；迁移必须重新发现并回读。

- 内部 USB 排针改线属于实体操作，必须关机并断开整机电源；安装页面不会把源码接线说明写成已完成实测。

- 安装和卸载启动任务需要时自动提权，会改变当前用户的 Task Scheduler；repair-hs2.ps1 仅在 -Apply 且非 -WhatIf 的实际硬件修复时自动提权。网站刷新和本模块证据采集保持只读。

- 当前主机健康、公开 ZIP 回归或 source contract 都不能证明另一台机器、重装系统、睡眠或异常断电后的真实 E2E（端到端验证）。

## 失败与恢复

- **Python、csc、RJCP、TURZX 运行文件或 stack 入口缺失**　check-runtime 返回具体 missing 且非零退出；安装器立即停止，不留下半注册启动任务。

- **私有串口、物理网卡或天气值仍是旧机器内容**　保留公开示例不动，在 ignored（已被版本控制忽略） config.json 中重新发现并填写；天气坐标缺失时 shim（受保护入口垫片） 失败关闭，不回落作者位置。

::screen{#pc-panel-hub-installation-binding-migration-11 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-11",
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
     "text_ref": "- **TURZX 串口不唯一或旧 writer 仍占用**　不启动第二个 writer，不把 COM7 当常量；先确认当前设备身份和旧 Owner 退出。",
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
     "text_ref": "- **TURZX 串口不唯一或旧 writer 仍占用**　不启动第二个 writer，不把 COM7 当常量；先确认当前设备身份和旧 Owner 退出。",
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

- **TURZX 串口不唯一或旧 writer 仍占用**　不启动第二个 writer，不把 COM7 当常量；先确认当前设备身份和旧 Owner 退出。

- **HS2 绑定缺失、歧义或只出现 A108 Boot ROM**　不复制旧绑定、不发送模式命令；等待唯一完整拓扑，并在 AD23/MI_00 与 LED 连续两次健康后再保存。

- **HS2 注册后读回的安装位置不对，或新版实体没通过**　判为失败，不宣布完成；旧版本目录一直留着，直到新版实体确认通过。

- **启动任务 Root、参数或安装结果错误**　运行 uninstall-startup-admin.ps1 撤销本项目任务，修正路径/配置并重新通过 runtime（运行环境） check 后再安装。

- **1 Hz Hybrid 在目标 TURZX 上不兼容**　显式使用 `-HybridRefresh:$false` 回到已验证 command 200 三秒兼容模式；不把自动降频当修复成功。

- **主机检查通过但实体画面未更新**　把问题留在实体/设备层，不升级 PASS；观察真实 TURZX 时钟和 HS2 背景/浮层，必要时交给串口或电源恢复模块。

::screen{#pc-panel-hub-installation-binding-migration-12 section="tech"}

```typeset
{
 "screen": {
  "id": "pc-panel-hub-installation-binding-migration-12",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 2288×1048 OLED 的六类信息、事件寿命与快捷键",
    "href": "/projects/pc-panel-hub/hs2-overlay/"
   },
   {
    "text": "下一个模块 电源与自愈",
    "href": "/projects/pc-panel-hub/power-recovery/"
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
     "text_ref": "- 8 月 31 日旧验收记录：PUBLIC（公开） main=8c217eadf76e6849c382c909b407d9dc436f9005，本地 HEAD、origin/main 与实时远端 main 当时一致且源工作树干净；该次公开发布测试构建并解包 ZIP，确认 config.example、双屏源码和安装脚本存在，厂商二进制、本机 JSON 与生成目录不存在。",
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
     "text_ref": "- 8 月 31 日旧验收记录：PUBLIC（公开） main=8c217eadf76e6849c382c909b407d9dc436f9005，本地 HEAD、origin/main 与实时远端 main 当时一致且源工作树干净；该次公开发布测试构建并解包 ZIP，确认 config.example、双屏源码和安装脚本存在，厂商二进制、本机 JSON 与生成目录不存在。",
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

clean clone、本机配置、厂商运行文件、启动任务与实体验收总入口

公开源码包包含/排除与合法本地 runtime（运行环境） 边界

无真实值的 serial/network/weather 安装模板

Python、csc、RJCP、TURZX 与 stack 的只读 ready/missing 门

HS2 永久目录发布（Publish-HS2Overlay.ps1）与只读检查、注册、位置回读（Install-HS2Overlay.ps1）

Highest 登录任务、Root/Port/Hybrid 参数与旧任务收口

启动任务撤销与重装前回退入口

双屏启动、HS2 绑定、任务动作、模式回退与分层验收合同

唯一 8091/AD23/MI_00/LED 拓扑发现、读取与原子绑定规则

fresh ZIP 解包、缺厂商 runtime（运行环境） 失败和私有/二进制排除回归

## 如何验证

- 8 月 31 日旧验收记录：PUBLIC（公开） main=8c217eadf76e6849c382c909b407d9dc436f9005，本地 HEAD、origin/main 与实时远端 main 当时一致且源工作树干净；该次公开发布测试构建并解包 ZIP，确认 config.example、双屏源码和安装脚本存在，厂商二进制、本机 JSON 与生成目录不存在。

- 9月7日现有主机依赖 ready、missing=0；既有 TURZX 任务已重新启动，新隐藏入口的异常退出恢复实际执行，唯一 stream 与新鲜 Hybrid 心跳存在。a4d8e22 公开 ZIP 构建并解包通过；这些只证明现有机器与源码包。

- 9 月 28 日 13:53 正式安装位置验收关闭：本人粗看正常，AI 清掉旧的编译输出并回读位置；当时已装包版本 1.0.0.2、注册在该永久目录。10 月 20 日早上运行中进程旁的清单为 1.0.0.4，安装位置这次没重新回读验收。这项验收不覆盖每类通知、快捷键、睡眠、断电和新机。

- runtime（运行环境）checker 回归和 HS2 安装模拟测试（模拟注册定义）都还在源码里，本轮没有重跑，也没有重做公开 ZIP。本轮没有在 clean clone、另一台电脑或重装后的 Windows 上重建 private（私有） config、重新绑定两块屏、安装任务并完成自然启动；换机、HS2 当前实体画面、睡眠和异常断电仍未验收。

## 与其他模块的关系

本模块把公开源码变成当前机器可运行的前置安装态，为指标、渲染、串口和 HS2 浮层提供私有配置与双屏绑定；安装完成后的睡眠、冻结、端点消失和运行期自愈仍由电源恢复模块负责。
