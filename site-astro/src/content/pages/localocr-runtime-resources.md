---
{
 "title": "识别可以重，但等待、显存和进程必须可控",
 "kind": "project",
 "url": "/projects/localocr/runtime-resources/",
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
  "page": "localocr-runtime-resources",
  "kind": "project",
  "title": "识别可以重，但等待、显存和进程必须可控",
  "url": "/projects/localocr/runtime-resources/",
  "parent": "localocr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "LocalOCR 源码（截止前最后提交 50af3fa）、现役 9 月 24 日验收回执、PCConfig 截止前提交 431ad1c1 的显卡调度规则及 10 月 11 日 13:33 的服务检查记录，于 2026-10-11 16:30–16:48（北京时间）只读核对"
  }
 },
 "source": {
  "page": "sources/pages/localocr-runtime-resources/page.json",
  "sha256": "72b442650104f652b5d34396f4161e78fe3212b21722b1798b493688889ca8c0",
  "converted_at_beijing": "2026-10-11T18:50:43+08:00"
 }
}
---

::screen{#localocr-runtime-resources-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-01",
  "section": "top",
  "title": "识别可以重，但等待、显存和进程必须可控",
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
     "text_ref": "识别可以重，但等待、显存和进程必须可控",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（截止前最后提交 50af3fa）、现役 9 月 24 日验收回执、PCConfig 截止前提交 431ad1c1 的显卡调度规则及 10 月 11 日 13:33 的服务检查记录，于 2026-10-11 16:30–16:48（北京时间）只读核对",
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
     "text_ref": "我可以连续识别几份材料而不让模型每次冷启动，也可以在明确任务卡住时让它结束。显卡、内存和等待时间都有可解释的边界，不会因为一个识别请求顺手停掉其他本地工作。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有识别进程监管、取消与资源回收；资源冲突会明确返回，不靠结束其他工作来抢占显卡。10 月 11 日 13:33 的一次检查中本机服务拒绝连接，原因没有查明，不能据此说模型或现役版本坏了。",
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
     "text_ref": "识别可以重，但等待、显存和进程必须可控",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（截止前最后提交 50af3fa）、现役 9 月 24 日验收回执、PCConfig 截止前提交 431ad1c1 的显卡调度规则及 10 月 11 日 13:33 的服务检查记录，于 2026-10-11 16:30–16:48（北京时间）只读核对"
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
     "text_ref": "我可以连续识别几份材料而不让模型每次冷启动，也可以在明确任务卡住时让它结束。显卡、内存和等待时间都有可解释的边界，不会因为一个识别请求顺手停掉其他本地工作。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有识别进程监管、取消与资源回收；资源冲突会明确返回，不靠结束其他工作来抢占显卡。10 月 11 日 13:33 的一次检查中本机服务拒绝连接，原因没有查明，不能据此说模型或现役版本坏了。"
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
   "asset": "_library/illustrations/modules/localocr/runtime-resources/runtime-resources-v01.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "4d3e2994d9026726c49080111084f57c95257f9379f810bc84d48548010be300",
   "status": "ready"
  }
 ]
}
```

# 识别可以重，但等待、显存和进程必须可控

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

我可以连续识别几份材料而不让模型每次冷启动，也可以在明确任务卡住时让它结束。显卡、内存和等待时间都有可解释的边界，不会因为一个识别请求顺手停掉其他本地工作。

**当前情况：**已有识别进程监管、取消与资源回收；资源冲突会明确返回，不靠结束其他工作来抢占显卡。10 月 11 日 13:33 的一次检查中本机服务拒绝连接，原因没有查明，不能据此说模型或现役版本坏了。

项目现状截至 2026-10-11 14:00（北京时间），于同日 16:30–16:48 只读核对；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#localocr-runtime-resources-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 只限制窗口等待会留下后台推理，只看进程存在又不知道任务是否健康。这个运行层把服务、推理进程、显卡资格和任务期限分开管理，并把冲突、超期、取消与模型错误交回调用方。 ## 举个实际例"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 只限制窗口等待会留下后台推理，只看进程存在又不知道任务是否健康。这个运行层把服务、推理进程、显卡资格和任务期限分开管理，并把冲突、超期、取消与模型错误交回调用方。 ## 举个实际例"
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

## 为什么需要它

只限制窗口等待会留下后台推理，只看进程存在又不知道任务是否健康。这个运行层把服务、推理进程、显卡资格和任务期限分开管理，并把冲突、超期、取消与模型错误交回调用方。

## 举个实际例子

我可以说：“这次识别卡住了，取消它，但别影响听写。”系统只取消这个已确认任务。PCConfig允许OCR（光学字符识别）和ASR（自动语音识别）各一份跨类并行；已有同类OCR（光学字符识别）或Ollama占用时才报告冲突，不自动排队、不结束其他程序抢资源。

## 最后我会得到什么

识别正常就交回文件；卡住、取消或显卡冲突时给出准确任务和清理状态。服务在、显卡可用、模型已加载与这份文件已读完是四件不同事。

## 结果怎么看

## 正常时

取得资源并在期限内完成后交回实际文件，同一种模型可复用已加载进程。

## 发现问题时

取消、超时或内存不足时只结束本次识别，留下具体原因。

## 入口不可用或证据不足时

显卡或本机服务不可用时停这条路线，不暗中换云端或结束其他程序。

::screen{#localocr-runtime-resources-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-03",
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
     "text_ref": "在本机 LocalOCR 对话中点名要查询或取消的识别任务；服务状态可用项目“只看服务状态”入口查看。",
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
     "text_ref": "1. **先查任务实际状态**　系统确认本次识别是否仍在运行、是否占用显卡，以及服务是否真是 LocalOCR；只看进程名不够。",
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
     "text_ref": "在本机 LocalOCR 对话中点名要查询或取消的识别任务；服务状态可用项目“只看服务状态”入口查看。"
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
     "text_ref": "1. **先查任务实际状态**　系统确认本次识别是否仍在运行、是否占用显卡，以及服务是否真是 LocalOCR；只看进程名不够。",
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

在本机 LocalOCR 对话中点名要查询或取消的识别任务；服务状态可用项目“只看服务状态”入口查看。

## 需要准备什么

- 任务标识

- 具体超时、卡住或显卡冲突现象

## 从开始到拿到结果

1. **先查任务实际状态**　系统确认本次识别是否仍在运行、是否占用显卡，以及服务是否真是 LocalOCR；只看进程名不够。

2. **只管自己的资源**　同模型可复用进程；期限、取消或故障只处理本服务对应任务。

3. **看清停止结果**　交回成功文件或精确冲突和清理状态；别的本地模型或听写任务不会因此被当成应停对象。

::screen{#localocr-runtime-resources-04 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 监督执行与回收已实现 ## 关键规则与设计选择 1. health.active_jobs 是忙碌事实源，缺失即未知。 2. 300 秒默认期限覆盖整次请求"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 监督执行与回收已实现 ## 关键规则与设计选择 1. health.active_jobs 是忙碌事实源，缺失即未知。 2. 300 秒默认期限覆盖整次请求"
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
     "text_ref": "1. health.active_jobs 是忙碌事实源，缺失即未知。",
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
     "text_ref": "1. health.active_jobs 是忙碌事实源，缺失即未知。",
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

监督执行与回收已实现

## 关键规则与设计选择

1. health.active_jobs 是忙碌事实源，缺失即未知。

2. 300 秒默认期限覆盖整次请求和加载，不是每页或每文件各给 300 秒。

3. 显卡未探测、模型未驻留和显卡不可用不能混写。

4. 当前机器调度策略允许一份OCR（光学字符识别）与一份ASR（自动语音识别）同时持有资格；两份OCR（光学字符识别）仍互斥，Ollama与这两类外部任务互斥。不据此推断任意模型都可并行或全都互斥，也不把源码策略冒充本轮真实并发验收。

## 当前怎样实现

- server.py 默认只监听 127.0.0.1:18665；18666 已有其他产品用途，不是可猜测的后备端口。9 月 24 日起还逐个检查请求：Host 只认 localhost 或 127.0.0.1，带 Origin（浏览器标明的来源网站）的跨站请求返回 403，/ocr/path 与 /ocr/file 的正文格式不对返回 415。这是把本机入口收紧，不是新增远程授权或身份层。

- runtime.py 维护一个受监督 warm worker（温热推理进程）；同模型复用，模型切换时重建，协调层不直接导入 Paddle。

- gpu_broker.py 在 GPU 探测、模型导入、加载和推理前向现有 LocalGpuBroker（本地 GPU 调度器）申请 localocr/localocr-cli 租约，失去资格只结束相应执行。按 PCConfig 在 10 月 11 日 14:00 前的最后一次提交（431ad1c1，北京时间 13:58）里的 broker.py，OCR（光学字符识别）与 ASR（自动语音识别）分成两个固定家族，跨家族可并行，同家族及 Ollama 会话/请求与外部租约互斥；这个文件最近一次相关改动是 9 月 28 日（9bf56ea），仍保留需要时先释放 OCR 的规则。核对时只读了规则，没有启动模型重测该并发路径。

- DEFAULT_TIMEOUT_SEC=300，MAX_TIMEOUT_SEC=7200；DEFAULT_MEMORY_LIMIT_BYTES=30_000_000_000，量的是本服务进程树的常驻内存（RSS），不是显存，也不管整机其他程序；一次请求的期限包含加载和全部页/文件，不按文件重新计时。

::screen{#localocr-runtime-resources-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-05",
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
     "text_ref": "- 执行监管处理明确取消、期限、进程异常和后代回收；服务重用不是新增持久队列，重复请求冲突不自动排队。",
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
     "text_ref": "- 执行监管处理明确取消、期限、进程异常和后代回收；服务重用不是新增持久队列，重复请求冲突不自动排队。",
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

- 执行监管处理明确取消、期限、进程异常和后代回收；服务重用不是新增持久队列，重复请求冲突不自动排队。

- HTTP 400 表示输入/配置错误，403 表示跨站请求被拒，409 表示活跃任务或资源冲突，415 表示请求正文格式不对，503 表示协调器或租约失败，504 表示执行期限；必须保留 detail 和任务定位。

## 执行流程

1. 读取本服务身份与 active_jobs。

2. 确认本次任务及显卡资源资格。

3. 复用同模型进程或按需切换模型。

4. 按整次请求期限与进程树内存上限监管。

5. 成功交回结果；取消或故障结束对应执行并说明原因。

::screen{#localocr-runtime-resources-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-06",
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
| lease（资源使用资格） | 现有协调器确认当前任务可使用显卡；不是永久占有权，丢失后必须停止。 |
| execution deadline（执行期限） | 服务端真正执行的总时限，与 HTTP 传输和调用脚本等待不同。 |
| loaded_models（驻留模型） | 当前进程已加载的模型，不等于所有登记模型都通过真实推理验收。 |

## 专业定义

本机服务、温热模型与显卡协调共同工作；出错时只处理本次明确任务。

::screen{#localocr-runtime-resources-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-07",
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

防止冷启动反复、模型抢资源、调用端退出后遗留推理，以及粗暴停止服务误伤其他任务。

## 边界

- 当前服务是本机入口，不是带远程访问授权的公网产品；9 月 24 日加的来源与格式检查只是拒收不合规的请求，不改变这一点。

- 只对明确本次任务和本服务进程树执行回收。

- 常规连续识别保留温热进程；确需给其他任务让资源时才释放，避免冷启动抖动。

## 失败与恢复

- **gpu_status=not_probed**：说明尚未进行显卡任务或探测，不解释成 CPU 降级或显卡故障。

- **显卡冲突或协调器不可用**：返回 409/503 与实际原因，不绕过现有资源协调。

- **执行期限、取消或内存越界**：结束相应推理进程及受管后代，保留明确错误，不把窗口退出当完成。

- **服务健康缺 active_jobs**：保持 readiness_unknown，不按空闲继续提交。

::screen{#localocr-runtime-resources-08 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-runtime-resources-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 任务与复用",
    "href": "/projects/localocr/jobs-cache/"
   },
   {
    "text": "下一个模块 安装与恢复",
    "href": "/projects/localocr/installation-recovery/"
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
     "text_ref": "- 温热进程、期限与回收",
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
     "text_ref": "- 温热进程、期限与回收",
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

- 温热进程、期限与回收

- 现有显卡协调

- 本机服务与状态

- 按需资源释放

## 如何验证

- 普通生命周期与调用入口测试验证受控的取消、期限、回收和身份行为，不冒充真实极端显卡压力测试。

- 现役版本、历史验收和服务在线是三件事。现役选中的是 9 月 24 日快照，它的合成质量验收当时测得：快模型热着每例 1.852–2.081 秒，首次含加载 17.446 秒；强模型 VL 首次 50.398 秒；加载 VL 后进程内存峰值 16.25–16.31 GiB。这些是 9 月 24 日的历史指标，不是最新测速。10 月 11 日约 13:33 的一次检查中，127.0.0.1:18665/health 拒绝连接，说明那时接口没有在监听或连不上；原因没有证据，不能推成模型、现役版本或识别能力损坏。

- 10 月 11 日核对时只读了规则、源码和回执，没有为网页验收重启电脑、启动服务补测、停止其他模型或修改常驻配置。

## 与其他模块的关系

输入模块通过本机入口进入，任务模块提供明确定位；本模块控制真正执行与资源，结果质量仍回到结果复核模块。
