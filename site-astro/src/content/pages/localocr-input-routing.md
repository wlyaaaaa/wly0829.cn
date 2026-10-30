---
{
 "title": "从指定原件到合适的本地识别方式",
 "kind": "project",
 "url": "/projects/localocr/input-routing/",
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
  "page": "localocr-input-routing",
  "kind": "project",
  "title": "从指定原件到合适的本地识别方式",
  "url": "/projects/localocr/input-routing/",
  "parent": "localocr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "LocalOCR 源码（主线最后提交 d9e51bd，北京时间 10 月 26 日 04:14）、current 版本链接、现役 10 月 26 日验收回执与五个关键安装文件哈希，于 2026-10-30 11:11–11:15（北京时间）只读核对；自动选择设备、普通 OCR 回 CPU 和批量精简结果按这份已安装源码说明。9 月 24 日版本的路径传递与访问来源检查、外层 AI 技能说明沿用 2026-10-11 16:30–16:48 的旧核对；本轮没有运行识别或重做完整验收。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/localocr-input-routing/page.json",
  "sha256": "c85cd1e0382683fb80ede11f5ece874c6baad0a72946aadf6a7139a46db9d37b",
  "converted_at_beijing": "2026-10-30T15:12:31+08:00"
 }
}
---

::screen{#localocr-input-routing-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-01",
  "section": "top",
  "title": "从指定原件到合适的本地识别方式",
  "links": [
   {
    "text": "回到项目 → 本地文字识别",
    "href": "/projects/localocr/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/LocalOCR"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/localocr/#ai-brief"
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
     "text_ref": "从指定原件到合适的本地识别方式",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（主线最后提交 d9e51bd，北京时间 10 月 26 日 04:14）、current 版本链接、现役 10 月 26 日验收回执与五个关键安装文件哈希，于 2026-10-30 11:11–11:15（北京时间）只读核对；自动选择设备、普通 OCR 回 CPU 和批量精简结果按这份已安装源码说明。9 月 24 日版本的路径传递与访问来源检查、外层 AI 技能说明沿用 2026-10-11 16:30–16:48 的旧核对；本轮没有运行识别或重做完整验收。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我不需要每次从模型名开始选择。先指定原件和想拿到的结果，普通图片、扫描 PDF 与文件夹就能进入相应本机路线；明确要求具体模型时保留我的选择，处理过程会说明实际使用了什么。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有图片、扫描 PDF 和文件夹的本地识别入口；9 月 24 日起现役版本换了更稳的 Windows 路径传递，并拒收别的网站借浏览器发来的请求。会按要求说明实际路线，具体文字仍以本次原件核对。",
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
     "text_ref": "从指定原件到合适的本地识别方式",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（主线最后提交 d9e51bd，北京时间 10 月 26 日 04:14）、current 版本链接、现役 10 月 26 日验收回执与五个关键安装文件哈希，于 2026-10-30 11:11–11:15（北京时间）只读核对；自动选择设备、普通 OCR 回 CPU 和批量精简结果按这份已安装源码说明。9 月 24 日版本的路径传递与访问来源检查、外层 AI 技能说明沿用 2026-10-11 16:30–16:48 的旧核对；本轮没有运行识别或重做完整验收。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我不需要每次从模型名开始选择。先指定原件和想拿到的结果，普通图片、扫描 PDF 与文件夹就能进入相应本机路线；明确要求具体模型时保留我的选择，处理过程会说明实际使用了什么。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有图片、扫描 PDF 和文件夹的本地识别入口；9 月 24 日起现役版本换了更稳的 Windows 路径传递，并拒收别的网站借浏览器发来的请求。会按要求说明实际路线，具体文字仍以本次原件核对。"
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
   "asset": "_library/illustrations/modules/localocr/input-routing/input-routing-v01.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "bf26bccbec1d4cfc7185c8655626de1662670fcca9f8cb4affee8e7dc414a424",
   "status": "ready"
  }
 ]
}
```

# 从指定原件到合适的本地识别方式

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

我不需要每次从模型名开始选择。先指定原件和想拿到的结果，普通图片、扫描 PDF 与文件夹就能进入相应本机路线；明确要求具体模型时保留我的选择，处理过程会说明实际使用了什么。

**当前情况：**已有图片、扫描 PDF 和文件夹的本地识别入口；9 月 24 日起现役版本换了更稳的 Windows 路径传递，并拒收别的网站借浏览器发来的请求。会按要求说明实际路线，具体文字仍以本次原件核对。10 月 26 日起的现役版本还能选用显卡还是 CPU：默认自动时显卡被占，普通文字识别会把这次剩下的文件改在 CPU 上读完；截图或视频帧可以整个文件夹一次送进去，默认只交回每个文件的简要结果。

项目现状截至 2026-10-11 14:00（北京时间），于同日 16:30–16:48 只读核对；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#localocr-input-routing-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ### 为什么需要它 一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。"
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
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "asset": "_library/hires-icons/试管对勾.png",
   "key": "绿色测试通过",
   "source_phrase": "冻结页迁移固定图标：normal",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "key": "报警灯",
   "source_phrase": "冻结页迁移固定图标：problem",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "key": "断开插头",
   "source_phrase": "冻结页迁移固定图标：unavailable",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  }
 ]
}
```

## 这项功能怎样使用

用途与实际影响

### 为什么需要它

一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。

### 举个实际例子

我可以说：“把这份扫描版多栏 PDF 的文字读出来并保留版面，文件留在本机。”系统会固定这一个输入并选择合适路线；如果给的是文件夹，也只处理本次明确要求的范围。要是这份 PDF 本来就是电子版、能直接选中文字，AI 会先直接读它自带的文字，不必交给 LocalOCR。

### 最后我会得到什么

返回对应文件的结果路径、实际引擎与模型、选择原因，以及是否发生增强。遇到不支持的文件、模型冲突、活跃任务或服务身份不符，会说明原因，不交回来自另一条未知路线的结果。

### 正常时

输入范围与路线明确，按请求执行并返回实际模型和输出。

### 发现问题时

自动提字不足时可以本地增强；增强失败保留首轮初步证据，但不标完成。

### 入口不可用或证据不足时

原件不可读、模型冲突或服务不是 LocalOCR 时停止相应请求，不抢端口、不换云服务；别的网页想借浏览器调用本机服务，或请求格式不对，服务直接拒收。

::screen{#localocr-input-routing-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-03",
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

输入范围与路线明确，按请求执行并返回实际模型和输出。

## 发现问题时

自动提字不足时可以本地增强；增强失败保留首轮初步证据，但不标完成。

## 入口不可用或证据不足时

原件不可读、模型冲突或服务不是 LocalOCR 时停止相应请求，不抢端口、不换云服务。

::screen{#localocr-input-routing-04 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-04",
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
     "text_ref": "在本机已接入 LocalOCR 的 AI 对话中指定原件，或用“日常本机入口” ocr_smart.ps1 传入明确路径。",
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
     "text_ref": "1. **检查原件与可读内容**　AI 先核对文件类型、页数和实际内容：电子版 PDF、Office 文件本身带文字，由 AI 直接读取；扫描件和图片才交给 LocalOCR。交给 LocalOCR 的 PDF 一律逐页转成图片再识别，它自己不会去取文字层。",
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
     "text_ref": "在本机已接入 LocalOCR 的 AI 对话中指定原件，或用“日常本机入口” ocr_smart.ps1 传入明确路径。"
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
     "text_ref": "1. **检查原件与可读内容**　AI 先核对文件类型、页数和实际内容：电子版 PDF、Office 文件本身带文字，由 AI 直接读取；扫描件和图片才交给 LocalOCR。交给 LocalOCR 的 PDF 一律逐页转成图片再识别，它自己不会去取文字层。",
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

在本机已接入 LocalOCR 的 AI 对话中指定原件，或用“日常本机入口” ocr_smart.ps1 传入明确路径。截图或视频帧可以把整个文件夹一次传入。

### 需要准备什么

- 图片、扫描 PDF 或目录

- 递归范围（要不要连子文件夹一起读）

- 想要文字、复杂版面还是指定模型；要不要限定只用显卡或只用 CPU（不说就是自动）

### 从开始到拿到结果

1. **检查原件与可读内容**　AI 先核对文件类型、页数和实际内容：电子版 PDF、Office 文件本身带文字，由 AI 直接读取；扫描件和图片才交给 LocalOCR。交给 LocalOCR 的 PDF 一律逐页转成图片再识别，它自己不会去取文字层。

2. **选择本地路线**　AI 核对实际文件与已登记模型，普通页面先轻量提字，复杂或显式结构需求按对应路线处理。设备默认自动：每个文件先申请显卡，显卡被占时，普通文字识别把这次剩下的文件都改在 CPU 上读，不在每张之间反复抢显卡；强模型 VL 和结构解析只能用显卡。

3. **拿到可追溯结果**　交回实际用过的模型、文字及输出位置；文件不支持或本地模型不可用时说明原因，不暗中上传或全库扫描。日常入口默认只给每个文件的简要结果（读全没有、质量状态、走了哪条路线、输出在哪），逐页文字和坐标在输出文件里，要完整 JSON 时加 -Full；本该交给强模型重读、却因为显卡被占没做的页会单独标出来。

::screen{#localocr-input-routing-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 三条路线与统一执行已实现；9 月 24 日起现役版本补上路径传递与请求检查 ### 关键规则与设计选择 1. 普通看图不强制 OCR（光学字符识别）；数字文"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 三条路线与统一执行已实现；9 月 24 日起现役版本补上路径传递与请求检查 ### 关键规则与设计选择 1. 普通看图不强制 OCR（光学字符识别）；数字文"
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
     "type": "numbered_steps",
     "text_ref": "1. 普通看图不强制 OCR（光学字符识别）；数字文档有文字层时由外层 AI 优先原生读取。这一步不在 LocalOCR 里，交给 LocalOCR 的 PDF 总是逐页渲染成图片后识别。",
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
     "type": "numbered_steps",
     "text_ref": "1. 普通看图不强制 OCR（光学字符识别）；数字文档有文字层时由外层 AI 优先原生读取。这一步不在 LocalOCR 里，交给 LocalOCR 的 PDF 总是逐页渲染成图片后识别。",
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

三条路线与统一执行已实现；9 月 24 日起现役版本补上路径传递与请求检查，10 月 26 日起加了设备选择与视频帧提速

### 关键规则与设计选择

1. 普通看图不强制 OCR（光学字符识别）；数字文档有文字层时由外层 AI 优先原生读取。这一步不在 LocalOCR 里，交给 LocalOCR 的 PDF 总是逐页渲染成图片后识别。

2. 复杂程度取实际页内容与识别证据，不由文件名判断；只增强问题页，不把整份文档重跑重模型。显卡被占、改在 CPU 上读时不做 VL 增强：需要增强的页保留首轮结果，写明跳过原因（gpu_unavailable）和页码并带质量警告，不算质量充分。

3. 显式模型优先；结构解析需要单独选择，不是自动增强的第三级。

4. 文件名或目录含中文、空格时仍用同一拖拽入口；它需要 PowerShell 7.3+，旧 Windows PowerShell 5.1 不属于该入口的支持环境。9 月 24 日起，路径交给所选 Ubuntu 自己换算，参数逐个原样传进 WSL（Windows 的 Linux 子系统），不再拼成一整条命令；文字能否读全、读准仍需核对实际结果。

## 当前怎样实现

- router.py 枚举支持的图片和 PDF；是否递归由 recursive 参数决定，不默认扩大目录范围。

- Smart Router v5 预先选路，让 auto 先走 OCR（光学字符识别）；difficulty.py 结合逐页空结果、低置信度及表格/公式内容信号，service.py 只增强对应问题页。10 月 26 日起（提交 985d750）表格线判断只认细线，先去掉字幕条、标题栏和暗角这类整块深色区域，视频帧和截图不再因此被当成表格整批交给 VL；普通平面截图也不默认开文档矫正（UVDoc）。

- 同一任务保留增强前文字与几何；显式模型不参加自动替换，Structure（结构化版面）不是自动流程的隐含第三层。

- model_registry.py 解析 profile（具体模型配置），核对引擎匹配；显式模型不被自动选择覆盖。设备另由 device=auto|gpu|cpu 选（命令行 --device，Windows 脚本 -Device，也可写 gpu:N 指定某张显卡）；目前只有普通文字识别的 ppocrv6-medium 配置带 CPU 参数，VL 和 Structure 不走 CPU。

::screen{#localocr-input-routing-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-06",
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
     "text_ref": "- start.bat 使用 pwsh，start.ps1 声明 PowerShell 7.3+，Git 固定 start.bat 为 CRLF，避免中文批处理被异常解析。9 月 24 日（提交 cd2e1b9）起，scripts/windows_paths.ps1 用所选 Ubuntu 发行版的 `wslpath -a -u` 换算路径，非默认挂载位置也能认；start、start_server、stop_server 都从脚本自身所在目录（$PSScriptRoot）找项目，不再写死项目位置；输入参数作为独立参数传给 WSL，不拼 `bash -c` 字符串。其后的 localocr.cli 继续共用 OCRService、增强与输出合同，模型路线没有改变。",
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
     "text_ref": "- start.bat 使用 pwsh，start.ps1 声明 PowerShell 7.3+，Git 固定 start.bat 为 CRLF，避免中文批处理被异常解析。9 月 24 日（提交 cd2e1b9）起，scripts/windows_paths.ps1 用所选 Ubuntu 发行版的 `wslpath -a -u` 换算路径，非默认挂载位置也能认；start、start_server、stop_server 都从脚本自身所在目录（$PSScriptRoot）找项目，不再写死项目位置；输入参数作为独立参数传给 WSL，不拼 `bash -c` 字符串。其后的 localocr.cli 继续共用 OCRService、增强与输出合同，模型路线没有改变。",
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

- start.bat 使用 pwsh，start.ps1 声明 PowerShell 7.3+，Git 固定 start.bat 为 CRLF，避免中文批处理被异常解析。9 月 24 日（提交 cd2e1b9）起，scripts/windows_paths.ps1 用所选 Ubuntu 发行版的 `wslpath -a -u` 换算路径，非默认挂载位置也能认；start、start_server、stop_server 都从脚本自身所在目录（$PSScriptRoot）找项目，不再写死项目位置；输入参数作为独立参数传给 WSL，不拼 `bash -c` 字符串。其后的 localocr.cli 继续共用 OCRService、增强与输出合同，模型路线没有改变。

- ocr_smart.ps1 预览路线并验证服务健康，以 active_jobs 作为忙碌依据；缺字段为 readiness_unknown，不能当空闲。ocr_smart.ps1 和 ocr_once.ps1 默认只返回每个文件的精简摘要（覆盖与质量状态、路线、输出路径），加 -Full 才给完整 JSON；视频帧建议整个文件夹一次送入，复用同一个温热进程。服务端 server.py 从 9 月 24 日起逐个检查请求：Host 只认 localhost 或 127.0.0.1；带 Origin（浏览器标明的来源网站）的请求必须同源，否则返回 403，上传和取消也一样；/ocr/path 只收 JSON，/ocr/file 只收表单上传，格式不对返回 415。命令行等原生客户端不带 Origin，照常可用。

## 执行流程

1. 固定本次文件、目录递归范围与希望得到的结果。

2. 外层 AI 先检查原生可读内容，电子版文字直接读；需要图片文字证据时才交给 LocalOCR。

3. 核对路径、类型、明确引擎、模型配置与设备选择（auto、gpu 或 cpu）。

4. 普通提字或复杂文档路线执行，必要时根据首轮结果增强；auto 下显卡被占时，普通提字把本次剩余文件改在 CPU 上做，不做增强并注明跳过。

5. 交回实际路线与文件，不把预检建议当最终模型身份。

::screen{#localocr-input-routing-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-07",
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
| auto（自动选择） | 按当前可解释规则选 ocr（光学字符识别） 或 vl；不是无条件选择最重模型，也不包含 structure（结构化版面）。 |
| explicit model（明确模型） | 用户明确指定某个配置时按它执行；冲突要说明，不能静默改写。 |
| route（实际识别路线） | 记录最终引擎、原因、信号与增强过程，方便解释与复核。 |

## 专业定义

明确读哪个文件、要文字还是结构；普通内容先提字，不够再本地增强。

::screen{#localocr-input-routing-08 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-08",
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
     "type": "bullet_list",
     "text_ref": "失败与恢复",
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
     "type": "bullet_list",
     "text_ref": "失败与恢复",
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

防止范围不明的批处理、轻重模型误用、显式选择被改写，以及客户端调用脚本与真实服务行为不一致。

## 边界

- 支持的是明确文件和目录，不是私人库后台扫描。

- 仅需场景描述时由原生视觉处理；全本地要求下不向外部视觉服务发送像素。

- 普通 OCR（光学字符识别）、VL 和 Structure（结构化版面） 的适用范围不能互相冒充。

## 失败与恢复

- **输入不支持或不可读**：返回明确的输入或读取错误，不制造空白成功结果。

- **显式引擎与模型不匹配**：拒绝该组合，让调用方修正配置；不私自换模型。

- **本地增强失败**：保留首轮 partial（初步结果）与失败原因，整体仍为失败，不能写入成功缓存。

- **显卡被占或显卡调度器不可用**：默认自动时，普通文字识别把这次剩下的文件改在 CPU 上读完；需要增强的页保留首轮结果，标明因显卡不可用跳过增强和页码，不算质量充分。明确要求只用显卡，或选了只支持显卡的 VL、Structure，则直接返回冲突（409 或 503）；运行中途失去显卡资格仍算失败，不中途改用 CPU。

- **端口是另一个服务**：报告 non-LocalOCR service，停止提交；不把 18666 当自动后备。

::screen{#localocr-input-routing-09 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-input-routing-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 表格与版面",
    "href": "/projects/localocr/document-structure/"
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
     "text_ref": "- 支持类型与输入枚举",
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
     "text_ref": "- 支持类型与输入枚举",
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

- 支持类型与输入枚举

- 自动与显式路线

- 困难度依据

- 实际增强与统一执行

- Windows 有界入口与服务识别

## 如何验证

- 2026-09-07，376a777 的 24 项 Windows 调用回归通过，4.210 秒；另经真实 start.bat、pwsh 与已确认 wsl.exe 替身验证中文空格路径完整传递，0.458 秒。这两个耗时是当时发表的记录，运行回执原件之后没有再找到；24 项测试定义和对应提交仍可核对。检查在模型执行前结束，没有重验 OCR（光学字符识别）效果或服务在线。

- 模型注册、分流与调用脚本行为有独立单元测试。9 月 24 日快照（当时现役）的验收回执记录 181 项单元测试 165 项通过、16 项按条件跳过、0 项失败；9 月 24 日加入的路径与请求检查已在那一版快照里（对应文件与开发源码一致）。现役已是 10 月 26 日快照，验收为 206 项、19 项按条件跳过、0 项失败，并带上 10 月 14—16 日的 Windows 入口修复（输出回传与临时路径、输出收集受同一期限约束、输入路径不存在时明确报失败）；它同样没有新的 Windows 端到端演练回执。

- 9 月 17 日禁用缓存的九例质量回执包含 auto_table，实际表格关键单元格通过。9 月 24 日那版验收的同名案例里（10 月 16 日现役验收也一样升级到 VL），auto_table 确实由快模型升级到强模型 VL，起因是检测到表格线：快读 9 个文字块的平均把握分高达 0.999949，照样升级，最终满足门槛。真实使用中，9 月 26 日一份 16 页扫描 PDF 只把第 15 页交给强模型重读（表格信号，平均把握分 0.997081）。这些案例不证明任意版面都能正确选路。

## 与其他模块的关系

这个模块决定如何进入任务；表格与版面模块解释结构需求，结果与复核模块解释如何读返回值，任务与运行模块处理复用和故障。
