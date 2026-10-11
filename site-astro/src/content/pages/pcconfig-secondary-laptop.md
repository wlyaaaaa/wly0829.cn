---
{
 "title": "副驾驶笔记本、跨设备接管与独立恢复",
 "kind": "project",
 "url": "/projects/pcconfig/secondary-laptop/",
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
  "page": "pcconfig-secondary-laptop",
  "kind": "project",
  "title": "副驾驶笔记本、跨设备接管与独立恢复",
  "url": "/projects/pcconfig/secondary-laptop/",
  "parent": "pcconfig",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "按主机账本（PCConfig 431ad1c1）。"
  }
 },
 "source": {
  "page": "sources/pages/pcconfig-secondary-laptop/page.json",
  "sha256": "82c64ada3e207adb845f531796a1d1c9fedad0b740228b4a8fcde3b1a98c34fc",
  "converted_at_beijing": "2026-10-11T19:04:25+08:00"
 }
}
---

::screen{#pcconfig-secondary-laptop-01 section="top"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-01",
  "section": "top",
  "title": "副驾驶笔记本、跨设备接管与独立恢复",
  "links": [
   {
    "text": "回到项目 → 电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/pcconfig/#ai-brief"
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
     "text_ref": "副驾驶笔记本、跨设备接管与独立恢复",
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
     "static_note": "截至 10 月 11 日 · 按主机账本（PCConfig 431ad1c1）。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑配置与恢复〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "离开家时用笔记本远控主机，日常用 Moonlight，UU 远程和 ToDesk 备用；主机负责环境和算力。主机失联时，笔记本只保证一个最小应急包：自己代理上网、读私有 Git、Codex 独立登录、本机文件备份，以及接上 H 盘由我解锁、打开离线密码中心。它有独立的文件胶囊与 Codex 历史恢复点，换机先验证旧副本，再允许新机器开始备份。",
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
     "text_ref": "副驾驶笔记本、跨设备接管与独立恢复",
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
     "static_note": "截至 10 月 11 日 · 按主机账本（PCConfig 431ad1c1）。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 电脑配置与恢复〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "离开家时用笔记本远控主机，日常用 Moonlight，UU 远程和 ToDesk 备用；主机负责环境和算力。主机失联时，笔记本只保证一个最小应急包：自己代理上网、读私有 Git、Codex 独立登录、本机文件备份，以及接上 H 盘由我解锁、打开离线密码中心。它有独立的文件胶囊与 Codex 历史恢复点，换机先验证旧副本，再允许新机器开始备份。"
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
   "asset": "_library/illustrations/modules/pcconfig-secondary-laptop-v01.png",
   "key": "main-pcconfig",
   "source_phrase": "横版：和已通过的第 1 屏（E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\pcconfig\\screen-01-desktop.png）同一版式、同一幅插画，拿它做底只改四处。",
   "sha256": "556f187f06b1a4b892b1a5ab3f257c879deb4f0d535e54467c618cae0bfff850",
   "status": "ready"
  }
 ]
}
```

# 副驾驶笔记本、跨设备接管与独立恢复

〔回到项目 → 电脑配置与恢复〕　〔复制 AI 续作说明〕

PCConfig · 功能说明

离开家时用笔记本远控主机，日常用 Moonlight，UU 远程和 ToDesk 备用；主机负责环境和算力。主机失联时，笔记本只保证一个最小应急包：自己代理上网、读私有 Git、Codex 独立登录、本机文件备份，以及接上 H 盘由我解锁、打开离线密码中心。它有独立的文件胶囊与 Codex 历史恢复点，换机先验证旧副本，再允许新机器开始备份。

**当前情况：**当天 09:19 的 Codex 对话备份已通过，但同一轮安全云阶段失败，09:00 任务最近结果为 1；外接主机原盘接管仍未实测。

项目事实核对截至 2026-10-11 14:00（北京时间）；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#pcconfig-secondary-laptop-02 section="usage"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "这项功能怎样使用"
   },
   {
    "id": "module-product",
    "text": "这项功能怎样使用"
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

主工作站一旦远控失灵、主板或电源故障，工作就可能中断；笔记本自身重装或丢盘也是另一类事故。把两台电脑做成全盘镜像，会把错误驱动、登录态和损坏状态一起复制；只靠 Git 又覆盖不了未入库文件和恢复写入门。所以副驾驶只带够应急用的东西，并有自己的健康检查和恢复流程。

## 举个实际例子

“主机现在连不上，看看我在笔记本上还能做什么。”AI 先读副机真实状态：网络能不能自己出去、私有 Git 能不能读、Codex 是否登录、本机备份到哪一天。清单以外的项目和本地模型不预装，缺什么明确列出，等主机恢复或我提出新需求再说。原台式机硬盘外置接管仍是另需真机演练的事故路线。

## 最后我会得到什么

我会知道笔记本今天能不能应急、远控和网络是否可用、本地和外接盘副本各到哪一天。10 月 11 日的记录是：对话备份当天成功，安全云当天失败，USB 最后成功在 9 月 22 日；这不等于整机换新后已经验收。

::screen{#pcconfig-secondary-laptop-03 section="usage"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-03",
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

在笔记本本机，或从主机连接并确认返回身份确为副机后，分别检查网络、工具、备份和当前文件；这些就绪后可以继续笔记本能独立做的工作。

## 发现问题时

远控、任务或恢复材料有一处不符，只停需要它的操作，保留已有文件和原恢复状态。

## 入口不可用或证据不足时

笔记本连接失败、返回身份不符、USB 未接或主机硬盘未装入时，只说明对应部分未知；账本历史和主机自身状态都不能替代缺少的副机现场。

::screen{#pcconfig-secondary-laptop-04 section="usage"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-04",
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
     "text_ref": "在已接入 PCConfig 的 AI 对话中明确说“副驾驶笔记本”，并说明是日常接续还是笔记本自身恢复。",
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
     "text_ref": "1. **确认当前电脑和用途**　先确认要处理的是哪台电脑。可以在副驾驶本机工作，也可以从主机使用已经接通的电脑连接；连接后核对返回的机器与用户身份，实际恢复和日常接续分别处理。",
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
     "text_ref": "在已接入 PCConfig 的 AI 对话中明确说“副驾驶笔记本”，并说明是日常接续还是笔记本自身恢复。"
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
     "text_ref": "1. **确认当前电脑和用途**　先确认要处理的是哪台电脑。可以在副驾驶本机工作，也可以从主机使用已经接通的电脑连接；连接后核对返回的机器与用户身份，实际恢复和日常接续分别处理。",
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

在已接入 PCConfig 的 AI 对话中明确说“副驾驶笔记本”，并说明是日常接续还是笔记本自身恢复。

## 需要准备什么

- 要继续的项目、遇到的问题或恢复目标

- 恢复时希望使用的外接介质（如果有）

## 从开始到拿到结果

1. **确认当前电脑和用途**　先确认要处理的是哪台电脑。可以在副驾驶本机工作，也可以从主机使用已经接通的电脑连接；连接后核对返回的机器与用户身份，实际恢复和日常接续分别处理。

2. **按实际机器取证**　连接可用时，直接在副机只读核对它自己的任务、文件和恢复状态。连接失败才说明本次只能参考账本的历史记录，不能拿主机状态代替副机现场，也不把两台电脑的路径套在一起。

3. **继续或恢复**　日常先做本机可做的文档与轻量工作；恢复先预览材料与冲突，再按实际目标回填并验登录，不说副机是主机完整镜像。

::screen{#pcconfig-secondary-laptop-05 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据（一）"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据（一）"
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
     "text_ref": "1. 主工作站承担正式 E/V/Z、G 在线备份和本地重型 GPU/OCR/ASR；笔记本是副驾驶和备用终端，不复制主机职责。",
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
     "text_ref": "1. 主工作站承担正式 E/V/Z、G 在线备份和本地重型 GPU/OCR/ASR；笔记本是副驾驶和备用终端，不复制主机职责。",
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

对话点 09:19 通过（170 个文件），安全云阶段 09:19 失败。

## 关键规则与设计选择

1. 主工作站承担正式 E/V/Z、G 在线备份和本地重型 GPU/OCR/ASR；笔记本是副驾驶和备用终端，不复制主机职责。

2. 日常远控以 Moonlight 为主，UU 远程和 ToDesk 备用；双机发现和精确访问走 Tailscale，不为方便开放普通局域网或公网。

3. 主机失联时只保证最小应急包：副机自己代理上网、读私有 Git、Codex 独立登录、本机文件备份，以及接 H 盘由本人解锁、打开离线密码中心。不预装所有项目或本地模型。

4. 笔记本可以有自己的 WSL2、Docker 和开发工具，但 Docker 登录自启关闭、Kubernetes 不启用，重型能力按当前宿主重新验收。

5. PCConfig 私有 Git 同步版本化账本和恢复源码，不同步实时机器状态、用户文件、登录态或秘密。

6. 普通恢复胶囊覆盖登记的 Desktop、Documents、Downloads 与窄 Codex 策略束；副机自己的 Codex 历史、附件、索引、数据库和私有配置另由 codex-memory 独立恢复点覆盖。

7. 本机回滚副本与笔记本 C 盘同一故障域，只帮助同机回滚；只有独立、已绑定且加密的 USB 世代能承担丢盘或换机的介质角色。

8. 台式机硬盘外置接管只把原盘作为数据与工作区来源；不从外置盘启动 Windows，不恢复台式机任务和驱动。

::screen{#pcconfig-secondary-laptop-06 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-06",
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
     "text_ref": "9. 需要访问公司或家庭某个服务时，给出明确目标、协议与端口，用完撤销；公司通路未启用、未实测。",
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
     "text_ref": "9. 需要访问公司或家庭某个服务时，给出明确目标、协议与端口，用完撤销；公司通路未启用、未实测。",
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

9. 需要访问公司或家庭某个服务时，给出明确目标、协议与端口，用完撤销；公司通路未启用、未实测。

10. Windows 恢复任务每天 09:00、21:00 检查：普通胶囊本地和 USB 各按 7 天周期，Codex 对话满 12 小时采集并分别执行安全云和 USB 阶段。每周语义巡检只看新问题和恢复覆盖，不触发备份。

11. 换机按新设备实际架构、用户根、项目盘和 OEM 能力重建；胶囊不是启动盘，不为重装格式化保存唯一胶囊的 U 盘。

::screen{#pcconfig-secondary-laptop-07 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-07",
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
     "text_ref": "- 只有计算机名和活动用户根都与登记一致、本地规则入口存在时，副驾驶账本才适用；其他主机返回不适用。副机规则版本为 E215，副机 PCConfig 检出为 82d2141（10 月 8 日）；这是副机自己的现场，不代表已同步到主机当前规则版本。",
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
     "text_ref": "- 只有计算机名和活动用户根都与登记一致、本地规则入口存在时，副驾驶账本才适用；其他主机返回不适用。副机规则版本为 E215，副机 PCConfig 检出为 82d2141（10 月 8 日）；这是副机自己的现场，不代表已同步到主机当前规则版本。",
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

## 当前怎样实现

- 只有计算机名和活动用户根都与登记一致、本地规则入口存在时，副驾驶账本才适用；其他主机返回不适用。副机规则版本为 E215，副机 PCConfig 检出为 82d2141（10 月 8 日）；这是副机自己的现场，不代表已同步到主机当前规则版本。

- 台式机代理两条入口：FlyingBird 7892、Clash 18091，都只经 Tailscale Serve 使用，电脑开哪个客户端就用对应入口，不开 Funnel；主机失联时用副机自己的网络。笔记本 SSH 22 和 RDP 3389 只允许登记的台式机对端，公司单服务转接默认未启用。

- 运行基线登记 Git/LFS、VS Code、Python/uv、JDK 21、Maven、psql、WSL2 Ubuntu 24.04 与 Docker Desktop；WSL 和 Docker 停止是正常状态。

- Get-SecondaryLaptopHealth.ps1 是唯一只读健康入口，不联网、不提权、不启动服务、不解锁 U 盘、不触发备份。

- 恢复任务 CodexRecovery-SecondaryLaptop 每天 09:00 和 21:00 运行，全链不得引用普通用户可写代码。

- writerState 固定为 restore_pending → restored_unaccepted → writer_activated；新机默认禁用任务，用户验收后才启用写入。

- Codex 数据：当前对话点 10 月 11 日 09:19，170 个文件、约 302 MB，VSS 一致性采集并已回读验证；安全云阶段同一轮失败，原始错误只能说明是该阶段失败，原因未查。已装 codex-memory 引擎与源码摘要一致。

- USB：最后一次冷备成功 9 月 22 日 09:00，对话点 149 个文件、约 236 MB，安全设置 16 个文件和恢复工具包 9 个文件各有回执；这些是最后成功的历史，不是本次又核过。

::screen{#pcconfig-secondary-laptop-08 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-08",
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
     "text_ref": "- 恢复先验证选定来源，物化到空的隔离目录，再检查数据库和隔离 Codex 能否列出并读取历史任务；不启动旧任务，不加载旧登录、队列或活动配置。",
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
     "text_ref": "- 恢复先验证选定来源，物化到空的隔离目录，再检查数据库和隔离 Codex 能否列出并读取历史任务；不启动旧任务，不加载旧登录、队列或活动配置。",
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

- 恢复先验证选定来源，物化到空的隔离目录，再检查数据库和隔离 Codex 能否列出并读取历史任务；不启动旧任务，不加载旧登录、队列或活动配置。

- 台式机故障接管默认由笔记本自己的 Windows 启动，原硬盘只作数据盘；启动本地模型、OCR 或 ASR 前必须对笔记本当前硬件做重型能力检查。

::screen{#pcconfig-secondary-laptop-09 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-09",
  "section": "tech",
  "title": "技术实现与依据（五）",
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
     "text_ref": "技术实现与依据（五）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 先确认现实目标：日常离开主机、笔记本自身重装或换机、笔记本磁盘故障，还是台式机故障后的临时接管。",
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
     "text_ref": "技术实现与依据（五）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 先确认现实目标：日常离开主机、笔记本自身重装或换机、笔记本磁盘故障，还是台式机故障后的临时接管。",
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

## 技术实现与依据（五）

## 执行流程

1. 先确认现实目标：日常离开主机、笔记本自身重装或换机、笔记本磁盘故障，还是台式机故障后的临时接管。

2. 在实际执行端回读计算机名和用户根；在主机上通过已登记的副机 MCP 让对端做同样的核验，连接失败才退回带日期的账本。

3. 日常使用先验证 Tailscale、Moonlight 或备用远控、精确防火墙和所需工具；台式机代理不可达时继续本地可做的工作。

4. 笔记本重装或换机时先保持任务停用与 restore_pending，从 USB 胶囊当前世代读取恢复指南和清单。

5. 生成一页恢复预览，分成自动执行、需要登录、冲突或跳过；Codex 历史另从独立恢复点隔离验证后选择性激活。

6. 从私有 PCConfig 刷新账本；有远端的项目重新 clone，无远端的项目选择私有 Git、加密导出或明确接受丢失。

7. 按目标机重装工具和远控、网络客户端；人工重建 WSL2/Docker。

8. 重新登录 Codex、Tailscale、远控、浏览器和其他身份应用；不复制旧会话。

::screen{#pcconfig-secondary-laptop-10 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-10",
  "section": "tech",
  "title": "技术实现与依据（六）",
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
     "text_ref": "技术实现与依据（六）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "9. 恢复文件后标记 restored_unaccepted；检查服务、工具、防火墙和文件，用户确认整体可用后再启用写入。",
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
     "text_ref": "技术实现与依据（六）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "9. 恢复文件后标记 restored_unaccepted；检查服务、工具、防火墙和文件，用户确认整体可用后再启用写入。",
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

## 技术实现与依据（六）

9. 恢复文件后标记 restored_unaccepted；检查服务、工具、防火墙和文件，用户确认整体可用后再启用写入。

10. 启用写入后才绑定和验证独立 USB，显式创建初始世代。

11. 台式机故障接管时用笔记本自己的 Windows 启动，取消任何初始化或格式化提示，只读识别原盘。

12. 需要 V 项目时先只读检查开发盘 VHDX，确需写入再挂载；不把临时盘符写回 PCConfig。

13. 接管结束前提交或备份新增工作，卸载并安全弹出；原盘装回后由主机重建自己的结论。

::screen{#pcconfig-secondary-laptop-11 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-11",
  "section": "tech",
  "title": "名词和入口（一）",
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
     "text_ref": "名词和入口（一）",
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
     "text_ref": "名词和入口（一）",
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

## 名词和入口（一）

## 本模块用到的名词

| 名词 | 意思 |
| --- | --- |
| Host-scoped ledger（主机限定账本） | 只有主机身份和用户根同时匹配时才解释该设备现场；在别的电脑上只能作为导航。 |
| Secondary laptop（副驾驶笔记本） | 承担远控和应急的备用 Windows 设备，不是台式机硬件、任务和盘符的镜像。 |
| 最小应急包 | 主机失联时副机保证的几样能力：自己上网、读私有 Git、Codex 登录、本机备份、接 H 盘打开离线密码中心。 |
| Recovery capsule（恢复胶囊） | 由目标状态、窄用户文件、惰性 Codex 策略、世代清单和恢复入口组成的笔记本重建包。 |
| Writer state（备份写入者状态） | 控制空白或未验收的新机何时可以开始备份；只有用户验收后才激活。 |
| USB generation（USB 恢复世代） | 写入已绑定加密介质、经完整集合、长度和 SHA-256 验证后由当前指针指向的完整版本。 |
| External NVMe takeover（原盘外置接管） | 把故障台式机的原硬盘接到笔记本，只作为数据与工作区来源。 |

::screen{#pcconfig-secondary-laptop-12 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-12",
  "section": "tech",
  "title": "名词和入口（二）",
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
     "text_ref": "名词和入口（二）",
     "align": "left",
     "size": "medium"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口（二）",
     "align": "left",
     "size": "medium"
    }
   ]
  }
 },
 "images": []
}
```

## 名词和入口（二）

## 专业定义

为副驾驶笔记本划清远控、最小应急和原硬盘接管路线，并给它自己的健康检查、恢复胶囊和防覆盖流程。

::screen{#pcconfig-secondary-laptop-13 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-13",
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

副驾驶不是“装了几个软件的第二台电脑”。它涉及两台主机的事实隔离、日常远控、端口和防火墙、应急工具、笔记本自身灾备、空白新机防覆盖，以及台式机故障时的临时接管。漏掉任一层，都可能把远控可用误写成可恢复，或让新机第一次备份覆盖唯一旧世代。

::screen{#pcconfig-secondary-laptop-14 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-14",
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
     "text_ref": "- 不后台同步两台电脑的完整磁盘、AppData、任务、驱动、登录态或秘密",
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
     "text_ref": "- 不后台同步两台电脑的完整磁盘、AppData、任务、驱动、登录态或秘密",
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

## 边界

- 不后台同步两台电脑的完整磁盘、AppData、任务、驱动、登录态或秘密

- 不把 PCConfig Git 检出或源码测试冒充笔记本当前服务、任务、USB 或远控健康

- 不为 7892 或 18091 开 Funnel，不把 SSH/RDP 放宽到局域网、公网、整个 tailnet 或公司网段

- 不让 restore_pending 或 restored_unaccepted 的新机运行备份

- 不把同盘本机副本称为换机备份；不把安全云失败写成对话备份也失败，也不用旧成功遮掉任务返回 1

- 不从外置原盘启动 Windows，不初始化、格式化或修复分区

- 不假定硬盘盒已购入或已演练，不假定笔记本能挂 ReFS VHDX 或解锁跨机 BitLocker

::screen{#pcconfig-secondary-laptop-15 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-15",
  "section": "tech",
  "title": "出问题时（三）",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **在非目标主机调用健康入口**：返回不适用，只报告当前主机名。",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **在非目标主机调用健康入口**：返回不适用，只报告当前主机名。",
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

## 出问题时（三）

## 失败与恢复

- **在非目标主机调用健康入口**：返回不适用，只报告当前主机名。

- **远控或 Tailscale 不可用**：区分双机发现、远控和本地工作；不开放局域网或公网，本地工作按实际继续。

- **安全云阶段失败**：对话本地备份结果保留，任务记为需要关注，不推进安全云成功时间；原因未查前不猜是网络、认证还是额度。

- **恢复 U 盘未接入、未解锁或未绑定**：正常等待，不告警、不自动解锁、不推进 USB 成功时间。

- **新机数据已复制但尚未整体验收**：保持 restored_unaccepted 和任务停用，不提前启用写入。

- **胶囊清单、闭合清单或载荷不一致**：停止恢复或激活，保留旧世代与来源。

- **外接硬盘出现初始化或格式化提示**：取消写入，只读核对；无法确认就停止接管。

- **笔记本不满足重型 GPU 能力门**：本地模型、OCR 和 ASR 不启动；普通 Codex、Git 和文档继续。

::screen{#pcconfig-secondary-laptop-16 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-16",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "上一个模块 换机与恢复",
    "href": "/projects/pcconfig/recovery-backup/"
   },
   {
    "text": "下一个模块 秘密与服务入口",
    "href": "/projects/pcconfig/secrets-providers/"
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 副驾驶角色、日常能力、网络边界和最小应急包（主机账本“副驾驶笔记本账本”）",
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 副驾驶角色、日常能力、网络边界和最小应急包（主机账本“副驾驶笔记本账本”）",
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

## 依据与来源（一）

## 真实入口

- 副驾驶角色、日常能力、网络边界和最小应急包（主机账本“副驾驶笔记本账本”）

- 副驾驶只读健康入口 Get-SecondaryLaptopHealth.ps1

- 受保护安装、任务、writer 状态机、USB 世代和恢复命令合同

- 副机 Codex 数据备份的只读状态入口（Manage-CodexDataBackup.ps1 -Mode Status -ReadOnly）

- 隔离恢复的数据库、路径重映射和旧任务读取验收

- 台式机代理入口登记（tailscale_proxy_entries.md）

- 台式机故障时的原硬盘外置接管与结束流程

::screen{#pcconfig-secondary-laptop-17 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-17",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 换机与恢复",
    "href": "/projects/pcconfig/recovery-backup/"
   },
   {
    "text": "下一个模块 秘密与服务入口",
    "href": "/projects/pcconfig/secrets-providers/"
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
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 副机 PCConfig 检出 82d2141（10 月 8 日 10:03），已装 codex-memory 引擎源码摘要一致",
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
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 副机 PCConfig 检出 82d2141（10 月 8 日 10:03），已装 codex-memory 引擎源码摘要一致",
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

## 依据与来源（二）

## 如何验证

- 副机 PCConfig 检出 82d2141（10 月 8 日 10:03），已装 codex-memory 引擎源码摘要一致

- 主机账本（截止提交 431ad1c1）：Moonlight 主用、UU 远程/ToDesk 备用；代理 7892 与 18091；周检登记为暂停

- 历史（之后未重新核对）：9 月 22 日 USB 冷备成功；9 月 22 日笔记本接 H 盘解密镜像并提取文件成功，这是另一条链，不等于原硬盘外置接管通过；9 月 10 日隔离恢复读出历史任务；9 月 10 日健康入口 Audit 正常

- 仍未验收：安全云失败原因、170 个文件的重新全量散列、当前 USB 载荷、周检何时为何变为 ACTIVE、新机物理冷启动、原硬盘经硬盘盒的端到端接管

::screen{#pcconfig-secondary-laptop-18 section="tech"}

```typeset
{
 "screen": {
  "id": "pcconfig-secondary-laptop-18",
  "section": "tech",
  "title": "依据与来源（三）",
  "links": [
   {
    "text": "上一个模块 换机与恢复",
    "href": "/projects/pcconfig/recovery-backup/"
   },
   {
    "text": "下一个模块 秘密与服务入口",
    "href": "/projects/pcconfig/secrets-providers/"
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
     "text_ref": "依据与来源（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
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

## 依据与来源（三）

## 与其他模块的关系

机器事实模块保留主机身份与盘符事实，运行与启动模块解释单机软件和任务，换机与恢复模块负责主工作站重装链，电脑 MCP 模块负责双机维护连接；本模块独立拥有副驾驶角色、双机网络、笔记本恢复胶囊和原硬盘临时接管。
