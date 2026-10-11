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
   "as_of": "Unknown",
   "source": "父项目作者页 /projects/localocr/ 的 status；技术证据为冻结页 2026-09-18 21:26 原快照，待按现状重取",
   "last": {
    "label": "原页核对",
    "at": "2026-09-18 21:26"
   }
  }
 },
 "source": {
  "page": "sources/pages/localocr-input-routing/page.json",
  "sha256": "0007a4def4a4b7f0f95675d7108098c3d4eb747859d666f60557815414a7838f",
  "converted_at_beijing": "2026-10-11T19:07:38+08:00"
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
       "text": "常用 · 原页核对 2026 年 9 月 18 日 21:26",
       "state": "ok"
      }
     ],
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
       "text": "常用 · 原页核对 2026 年 9 月 18 日 21:26",
       "state": "ok"
      }
     ]
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
   "asset": "_library/illustrations/main-localocr.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready"
  }
 ]
}
```

# 从指定原件到合适的本地识别方式

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

我不需要每次从模型名开始选择。先指定原件和想拿到的结果，普通图片、扫描 PDF 与文件夹就能进入相应本机路线；明确要求具体模型时保留我的选择，处理过程会说明实际使用了什么。

**当前情况：**已有图片、扫描PDF和文件夹的本地识别入口；会按要求说明实际路线，具体文字仍以本次原件核对。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码

公开仓库

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
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。 举个实际例子"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。 举个实际例子"
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

一律使用重模型会增加等待，一律使用普通提字又可能丢掉复杂页面结构。这个入口把输入范围、结果要求和模型选择分开，并让模型不足时的增强有迹可查，而不是用“智能识别”掩盖真实判断方式。

## 举个实际例子

我可以说：“把这份多栏 PDF 的文字读出来并保留版面，文件留在本机。”系统会固定这一个输入并选择合适路线；如果给的是文件夹，也只处理本次明确要求的范围。

## 最后我会得到什么

返回对应文件的结果路径、实际引擎与模型、选择原因，以及是否发生增强。遇到不支持的文件、模型冲突、活跃任务或服务身份不符，会说明原因，不交回来自另一条未知路线的结果。

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
     "text_ref": "1. **检查原件与可读内容**　系统核对文件类型、页数和实际内容；已有文字层先直接取用，扫描图才进入识别。",
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
     "text_ref": "1. **检查原件与可读内容**　系统核对文件类型、页数和实际内容；已有文字层先直接取用，扫描图才进入识别。",
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

在本机已接入 LocalOCR 的 AI 对话中指定原件，或用“日常本机入口” ocr_smart.ps1 传入明确路径。

## 需要准备什么

- 图片、扫描 PDF 或目录

- 递归范围

- 想要文字、复杂版面还是指定模型

## 从开始到拿到结果

1. **检查原件与可读内容**　系统核对文件类型、页数和实际内容；已有文字层先直接取用，扫描图才进入识别。

2. **选择本地路线**　AI 核对实际文件与已登记模型，普通页面先轻量提字，复杂或显式结构需求按对应路线处理。

3. **拿到可追溯结果**　交回实际用过的模型、文字及输出位置；文件不支持或本地模型不可用时说明原因，不暗中上传或全库扫描。

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
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 三条路线与统一执行已实现 关键规则与设计选择 1 普通看图不强制 OCR（光学字符识别），数字文档有文字层时优先原生读取。 2 复杂程度取实际页内容与识别证据，不由文件"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 三条路线与统一执行已实现 关键规则与设计选择 1 普通看图不强制 OCR（光学字符识别），数字文档有文字层时优先原生读取。 2 复杂程度取实际页内容与识别证据，不由文件"
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
     "text_ref": "1. 普通看图不强制 OCR（光学字符识别），数字文档有文字层时优先原生读取。",
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
     "text_ref": "1. 普通看图不强制 OCR（光学字符识别），数字文档有文字层时优先原生读取。",
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

三条路线与统一执行已实现

## 关键规则与设计选择

1. 普通看图不强制 OCR（光学字符识别），数字文档有文字层时优先原生读取。

2. 复杂程度取实际页内容与识别证据，不由文件名判断；只增强问题页，不把整份文档重跑重模型。

3. 显式模型优先；结构解析需要单独选择，不是自动增强的第三级。

4. 文件名或目录含中文、空格时仍用同一拖拽入口；它需要PowerShell 7.3+，旧Windows PowerShell 5.1不属于该入口的支持环境。入口传参已通过隔离检查，文字能否读全、读准仍需核对实际结果。

## 当前怎样实现

- router.py 枚举支持的图片和 PDF；是否递归由 recursive 参数决定，不默认扩大目录范围。

- Smart Router v5 预路由让 auto 先 OCR（光学字符识别）；difficulty.py 结合逐页空结果、低置信度及表格/公式内容信号，service.py 只增强对应问题页。

- 同一任务保留增强前文字与几何；显式模型不参加自动替换，Structure（结构化版面） 不是自动流程的隐含第三层。

- model_registry.py 解析 profile（具体模型配置），核对引擎匹配；显式模型不被自动选择覆盖。

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
     "text_ref": "- start.bat使用pwsh，start.ps1声明PowerShell 7.3+；路径回调将Windows盘符转换为/mnt/<盘符>，Git固定start.bat为CRLF，避免中文批处理被异常解析。其后的localocr.cli继续共用OCRService、增强与输出合同，模型路线没有改变。",
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
     "text_ref": "- start.bat使用pwsh，start.ps1声明PowerShell 7.3+；路径回调将Windows盘符转换为/mnt/<盘符>，Git固定start.bat为CRLF，避免中文批处理被异常解析。其后的localocr.cli继续共用OCRService、增强与输出合同，模型路线没有改变。",
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

- start.bat使用pwsh，start.ps1声明PowerShell 7.3+；路径回调将Windows盘符转换为/mnt/<盘符>，Git固定start.bat为CRLF，避免中文批处理被异常解析。其后的localocr.cli继续共用OCRService、增强与输出合同，模型路线没有改变。

- ocr_smart.ps1 预览路线并验证服务健康，以 active_jobs 作为忙碌依据；缺字段为 readiness_unknown，不能当空闲。

## 执行流程

1. 固定本次文件、目录递归范围与希望得到的结果。

2. 优先检查原生可读内容；需要图片文字证据时进入 LocalOCR。

3. 核对路径、类型、明确引擎与模型配置。

4. 普通提字或复杂文档路线执行，必要时根据首轮结果增强。

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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **输入不支持或不可读**：返回明确的输入或读取错误，不制造空白成功结果。",
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
     "text_ref": "- **输入不支持或不可读**：返回明确的输入或读取错误，不制造空白成功结果。",
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

- 2026-09-07，376a777的24项Windows调用回归通过，4.210秒；另经真实start.bat、pwsh与已确认wsl.exe替身验证中文空格路径完整传递，0.458秒。检查在模型执行前结束，没有重验OCR（光学字符识别）效果或服务在线。原CLI（命令行工具）/API共用、显式选择和增强合同继续保留。

- 模型注册、分流与调用脚本行为有独立单元测试；当前机器测试与运行证据见总览技术层。

- 9 月 17 日禁用缓存的九例质量回执包含 auto_table，实际表格关键单元格通过；这个合成案例不证明任意版面都能正确选路。

## 与其他模块的关系

这个模块决定如何进入任务；表格与版面模块解释结构需求，结果与复核模块解释如何读返回值，任务与运行模块处理复用和故障。
