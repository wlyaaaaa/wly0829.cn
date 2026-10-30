---
{
 "title": "不重复跑同一份材料，也不把旧结果套到新原件上",
 "kind": "project",
 "url": "/projects/localocr/jobs-cache/",
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
  "page": "localocr-jobs-cache",
  "kind": "project",
  "title": "不重复跑同一份材料，也不把旧结果套到新原件上",
  "url": "/projects/localocr/jobs-cache/",
  "parent": "localocr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "LocalOCR 源码（截止前最后提交 50af3fa）、正式任务目录登记计数与验收回执，于 2026-10-11 16:30–16:48（北京时间）只读核对"
  }
 },
 "source": {
  "page": "sources/pages/localocr-jobs-cache/page.json",
  "sha256": "16431e3d48e38cc69e2b1a21b3e3e8bc8c61392d915d5032e9f16806af05b190",
  "converted_at_beijing": "2026-10-30T11:16:50+08:00"
 }
}
---

::screen{#localocr-jobs-cache-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-01",
  "section": "top",
  "title": "不重复跑同一份材料，也不把旧结果套到新原件上",
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
     "text_ref": "不重复跑同一份材料，也不把旧结果套到新原件上",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（截止前最后提交 50af3fa）、正式任务目录登记计数与验收回执，于 2026-10-11 16:30–16:48（北京时间）只读核对",
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
     "text_ref": "同一份资料已经处理过时，能复用就不再等模型；正在处理时，我能知道它在哪一步，而不是反复按提交。这个模块把原件、请求和结果对在一起，让省时不会变成拿错旧文件。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有任务定位和结果复验功能，可避免重复提交；旧结果只有仍对应同一原件与运行条件才复用。",
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
     "text_ref": "不重复跑同一份材料，也不把旧结果套到新原件上",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（截止前最后提交 50af3fa）、正式任务目录登记计数与验收回执，于 2026-10-11 16:30–16:48（北京时间）只读核对"
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
     "text_ref": "同一份资料已经处理过时，能复用就不再等模型；正在处理时，我能知道它在哪一步，而不是反复按提交。这个模块把原件、请求和结果对在一起，让省时不会变成拿错旧文件。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有任务定位和结果复验功能，可避免重复提交；旧结果只有仍对应同一原件与运行条件才复用。"
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
   "asset": "_library/illustrations/modules/localocr/jobs-cache/jobs-cache-v01.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "abf8633198001db20cca94fb8036a5abdf276f05a7734d14a8197b78cde80631",
   "status": "ready"
  }
 ]
}
```

# 不重复跑同一份材料，也不把旧结果套到新原件上

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

同一份资料已经处理过时，能复用就不再等模型；正在处理时，我能知道它在哪一步，而不是反复按提交。这个模块把原件、请求和结果对在一起，让省时不会变成拿错旧文件。

**当前情况：**已有任务定位和结果复验功能，可避免重复提交；旧结果只有仍对应同一原件与运行条件才复用。

项目现状截至 2026-10-11 14:00（北京时间），于同日 16:30–16:48 只读核对；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#localocr-jobs-cache-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 文件同名不代表内容相同，输出还在也不代表它完整。客户端窗口超时还可能留下正在执行的工作；如果不先定位任务就重试，会重复占用显卡，还可能混淆两次结果。 ## 举个实际例子 我可以问："
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 文件同名不代表内容相同，输出还在也不代表它完整。客户端窗口超时还可能留下正在执行的工作；如果不先定位任务就重试，会重复占用显卡，还可能混淆两次结果。 ## 举个实际例子 我可以问："
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

文件同名不代表内容相同，输出还在也不代表它完整。客户端窗口超时还可能留下正在执行的工作；如果不先定位任务就重试，会重复占用显卡，还可能混淆两次结果。

## 举个实际例子

我可以问：“刚才那份扫描件等超时了，现在要不要重新提交？”系统会先查原任务：仍在处理就继续等待或由我取消，已经完成就直接读取结果，确实中断才明确说明。它不会因为窗口等超时就重复跑一份。

## 最后我会得到什么

先得到原任务现在是处理中、完成还是中断；完整旧结果能核对时直接取回，否则才决定重新识别。部分页面证据可以帮助排查，但不是任何故障都能自动续跑。

## 结果怎么看

## 正常时

旧结果与这份文件和要求确实相同、文件完整时直接复用。

## 发现问题时

等待窗口超时先查原任务，取消或中断后留下状态，不盲重交。

## 入口不可用或证据不足时

任务仍占资源或连终态都无法确认时停止新提交，先核对现场。

::screen{#localocr-jobs-cache-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-03",
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
     "text_ref": "在同一 LocalOCR 对话中提供刚才返回的任务标识，先问“现在进行到哪”；不要仅凭等待窗口超时重新提交。",
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
     "text_ref": "1. **先找原任务**　系统查询活跃状态和已保存结果，确认原件及请求是否仍相同。",
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
     "text_ref": "在同一 LocalOCR 对话中提供刚才返回的任务标识，先问“现在进行到哪”；不要仅凭等待窗口超时重新提交。"
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
     "text_ref": "1. **先找原任务**　系统查询活跃状态和已保存结果，确认原件及请求是否仍相同。",
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

在同一 LocalOCR 对话中提供刚才返回的任务标识，先问“现在进行到哪”；不要仅凭等待窗口超时重新提交。

## 需要准备什么

- 原任务标识或原件

- 本次识别要求

- 继续等待还是取消的选择

## 从开始到拿到结果

1. **先找原任务**　系统查询活跃状态和已保存结果，确认原件及请求是否仍相同。

2. **按真实状态处置**　在跑则继续查询或精确取消；正式结果完整有效则直接复用。

3. **必要时才重试**　中断或输入改变才重新执行，并区分部分证据、缓存和完整结果。

::screen{#localocr-jobs-cache-04 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 任务定位与结果复验已实现 ## 关键规则与设计选择 1. 使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。 2. "
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 任务定位与结果复验已实现 ## 关键规则与设计选择 1. 使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。 2. "
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
     "text_ref": "1. 使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。",
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
     "text_ref": "1. 使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。",
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

任务定位与结果复验已实现

## 关键规则与设计选择

1. 使用 results[].output_files 指向的正式文件，不靠同名兼容副本判断。

2. 相同请求仍需复核输出，缓存命中只代表可复用。

3. 当前已有逐页原子检查点和部分证据读取；它们不等于任意长 PDF 自动断点续跑，更不能在用户取消后自动重试。

## 当前怎样实现

- 任务身份绑定源路径/内容、请求语义、逐页路由、具体 profile、实际权重、实现/运行库和输出目录；开发源码改变不自动改变已激活冻结版本。

- service.py 在正式写盘前后维护任务状态，复用时检查客观文件及所有输出的非空大小和 SHA-256，不只判断文件存在。

- 正式文件名包含请求身份；无哈希同名 TXT/MD/JSON 仅供兼容展示，不能作为缓存或原件身份依据。

- server.py 暴露 /jobs/<job_key> 与指定 cancel 入口；active_localocr_task 返回 409，调用方应读取原任务，不隐式新建队列。

- 增强或执行失败可以保存首轮文字与 checkpoints.py 的逐页部分证据，仍是 partial 而非完整成功缓存；取消响应标 terminal/non-retryable。

::screen{#localocr-jobs-cache-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-05",
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
     "text_ref": "- observer.py 提供只读阶段、模型、页进度和耗时投影；这不是另一套任务调度，也不提供 OCR（光学字符识别） token 生成速率。",
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
     "text_ref": "- observer.py 提供只读阶段、模型、页进度和耗时投影；这不是另一套任务调度，也不提供 OCR（光学字符识别） token 生成速率。",
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

- observer.py 提供只读阶段、模型、页进度和耗时投影；这不是另一套任务调度，也不提供 OCR（光学字符识别） token 生成速率。

- OCRService 初始化调用 job_registry.recover_abandoned：复核遗留锁对应的进程身份，确认执行者已死亡才将 running 标成 failed / owner_exited 并清除占用；活任务不会仅因运行时间长被接管，不产生页级自动续跑。

- 若失败终态本身无法写入，service.py 保留恢复锁并记录 terminal_persistence_failure；health 返回 not-ready / job_state_persistence_failed，后续请求以 503 拒绝，不能把状态未落盘的服务继续当正常执行器。

## 执行流程

1. 从本次原件与请求确定任务身份。

2. 复验已有结果，完整有效时直接复用。

3. 已有活跃任务时返回明确定位，不并发重交。

4. 确需新执行时由同一服务负责处理与状态。

5. 超时或中断后先查原任务和文件，再决定等待、精确取消或有界重试。

::screen{#localocr-jobs-cache-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-06",
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
| request identity（请求身份） | 输入、模型和请求参数的组合，防止同名文件或不同模型共享错误结果。 |
| formal output（正式输出） | 本次请求完成并通过相应检查的结果路径；与兼容显示副本和 partial 初步证据不同。 |
| observer（只读观察） | 让调用方看阶段、模型与时间，不替它创建或重新执行任务。 |

## 专业定义

查询、取消、复验与结果复用有同一套身份；窗口超时不是重交信号。

::screen{#localocr-jobs-cache-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-07",
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
     "text_ref": "出问题时（一）",
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

## 出问题时（一）

解决什么

防止重复执行、旧结果错配、坏缓存被接受，以及等待期限与执行期限混为一谈。

## 边界

- 客户端 timeout（等待超时）不证明服务端任务终止。

- 不承诺永久任务档案或跨任意故障的自动续跑。

- write_outputs=false 不登记正式写盘任务与结果缓存，内存证据不能冒充已保存证据。

## 失败与恢复

- **HTTP 409 / active_localocr_task**：读取已返回的 job_key 和查询入口，不盲目重复提交。

- **输出丢失、为空或指纹不匹配**：不接受缓存命中，保留原件与请求依据后重新判断执行。

- **客户端 exit 124**：先回查服务端任务状态；不能仅凭退出码认定识别失败。

- **增强失败但有首轮文字**：明确为 partial，不把这些文件提升为正式成功结果。

::screen{#localocr-jobs-cache-08 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-08",
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
     "text_ref": "- **服务崩溃遗留 running 与锁**：下次启动核对进程身份；已死亡的执行标 owner_exited 并解除占用，活执行保留，不自动重跑。",
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
     "text_ref": "- **服务崩溃遗留 running 与锁**：下次启动核对进程身份；已死亡的执行标 owner_exited 并解除占用，活执行保留，不自动重跑。",
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

- **服务崩溃遗留 running 与锁**：下次启动核对进程身份；已死亡的执行标 owner_exited 并解除占用，活执行保留，不自动重跑。

- **任务终态无法写入**：保留恢复锁与原始/落盘错误，health 标不可继续接单；先修复实际存储问题，不以进程存在或盲重提掩盖。

::screen{#localocr-jobs-cache-09 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-jobs-cache-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 结果与复核",
    "href": "/projects/localocr/results-evidence/"
   },
   {
    "text": "下一个模块 运行与资源",
    "href": "/projects/localocr/runtime-resources/"
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
     "text_ref": "- 任务身份与缓存复验",
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
     "text_ref": "- 任务身份与缓存复验",
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

- 任务身份与缓存复验

- 正式结果提交与初步证据

- 查询和精确取消

- 只读观察

## 如何验证

- 任务、输出、观察和进程测试分别覆盖当前行为；普通测试不能证明真实长文档的恢复速度。

- 重跑同一合成请求可验证复用，但不能据此推导任意私人原件准确率。截至 2026-10-30 11:07，正式任务目录有 11,588 份登记：完成 11,514、失败 74、运行中 0；这是全部登记、不排除样例，只是写盘登记，不说明当时服务一定空闲。2026-10-11 14:00 时是 16,151 份（完成 16,107、失败 44）；那时排除项目样例、冒烟测试和 8 月 18 日开发空白图后，16,074 条完成登记都存着输出位置——这个筛选后的数和输出位置覆盖，10 月 22 日没能按同一筛选口径重数，目前 Unknown。这是“存过结果”的数量，不等于现在仍有效的缓存数：输出指纹、模型身份和负向证据没有逐条复验，有效缓存数没有核对，目前未知。缓存命中也不新增登记，所以没有历史命中次数。

- 10 月 11 日那 44 条失败登记里（10 月 22 日新增的 3 条失败还没分类，原因 Unknown）：执行超时 7 条、推理失败 4 条、执行进程已退出（owner_exited）1 条，另有 32 条旧记录没有错误码，这只是记录里缺这个字段，不代表失败没有原因；5 条带部分结果文件。现行源码含逐页检查点、取消终态和缓存工件身份合同；9 月 17 日 Windows 同源普通 OCR（光学字符识别）的首次与 cache_hit 输出哈希一致，证明的是那条已知样例的复用。9 月 24 日和现役 10 月 16 日两版验收的合成质量测试都明确关闭了缓存，不是缓存命中测试，现役也没有新的 Windows 端到端回执；这些都不代表私人长文档或自动逐页续跑已经验收。

## 与其他模块的关系

结果与复核模块定义什么才算有效结果，本模块决定是否复用；运行与资源模块负责活动执行和终止边界。
