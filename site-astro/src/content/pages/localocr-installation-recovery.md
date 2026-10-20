---
{
 "title": "升级先验候选，出问题能回到真正验证过的旧版本",
 "kind": "project",
 "url": "/projects/localocr/installation-recovery/",
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
  "page": "localocr-installation-recovery",
  "kind": "project",
  "title": "升级先验候选，出问题能回到真正验证过的旧版本",
  "url": "/projects/localocr/installation-recovery/",
  "parent": "localocr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "LocalOCR 源码（最后提交 62a2c9b，北京时间 10 月 16 日 12:26）、current/previous 两个版本链接、现役 10 月 16 日与上一版 10 月 12 日的验收回执，于 2026-10-20 07:41（北京时间）只读核对；9 月 17 日与 9 月 24 日回执为历史"
  }
 },
 "source": {
  "page": "sources/pages/localocr-installation-recovery/page.json",
  "sha256": "63b65e1fbb28077f890b71b2e7d9f3864d5df48289cc6da5d710049107784dfb",
  "converted_at_beijing": "2026-10-20T08:56:32+08:00"
 }
}
---

::screen{#localocr-installation-recovery-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-01",
  "section": "top",
  "title": "升级先验候选，出问题能回到真正验证过的旧版本",
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
     "text_ref": "升级先验候选，出问题能回到真正验证过的旧版本",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（最后提交 62a2c9b，北京时间 10 月 16 日 12:26）、current/previous 两个版本链接、现役 10 月 16 日与上一版 10 月 12 日的验收回执，于 2026-10-20 07:41（北京时间）只读核对；9 月 17 日与 9 月 24 日回执为历史",
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
     "text_ref": "升级识别引擎不应顺手改坏正在工作的环境。我先得到一份独立候选，确认依赖、逻辑和实际合成识别都合格才切换；旧环境保留自己的代码和验收依据，失败时能检查后回退，而不是只留一个不知道能否运行的目录。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**9 月 17 日那次演练实际验过新旧识别环境之间的切换、回退和恢复；9 月 24 日起现役换成新快照，它有自己的验收，但还没有同样的 Windows 端到端演练（从 Windows 入口真实走一遍识别、切换和回退）；完全离线的新电脑安装仍未验证。",
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
     "text_ref": "升级先验候选，出问题能回到真正验证过的旧版本",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（最后提交 62a2c9b，北京时间 10 月 16 日 12:26）、current/previous 两个版本链接、现役 10 月 16 日与上一版 10 月 12 日的验收回执，于 2026-10-20 07:41（北京时间）只读核对；9 月 17 日与 9 月 24 日回执为历史"
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
     "text_ref": "升级识别引擎不应顺手改坏正在工作的环境。我先得到一份独立候选，确认依赖、逻辑和实际合成识别都合格才切换；旧环境保留自己的代码和验收依据，失败时能检查后回退，而不是只留一个不知道能否运行的目录。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**9 月 17 日那次演练实际验过新旧识别环境之间的切换、回退和恢复；9 月 24 日起现役换成新快照，它有自己的验收，但还没有同样的 Windows 端到端演练（从 Windows 入口真实走一遍识别、切换和回退）；完全离线的新电脑安装仍未验证。"
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
   "asset": "_library/illustrations/modules/localocr/installation-recovery/installation-recovery-v01.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "1562b9810d7d3ccea7385e06e32def5794bc98b94eb6b7e12aaf7bb1585e55d3",
   "status": "ready"
  }
 ]
}
```

# 升级先验候选，出问题能回到真正验证过的旧版本

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

升级识别引擎不应顺手改坏正在工作的环境。我先得到一份独立候选，确认依赖、逻辑和实际合成识别都合格才切换；旧环境保留自己的代码和验收依据，失败时能检查后回退，而不是只留一个不知道能否运行的目录。

**当前情况：**9 月 17 日那次演练实际验过新旧识别环境之间的切换、回退和恢复；现役已是 10 月 16 日验收的快照（上一版是 10 月 12 日验收的一版），它们各有自己的验收，但都还没有同样的 Windows 端到端演练（从 Windows 入口真实走一遍识别、切换和回退）；完全离线的新电脑安装仍未验证。

现役与上一版的身份和验收于 2026-10-20 07:41（北京时间）只读核对，其余项目现状截至 2026-10-11 14:00；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#localocr-installation-recovery-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 能克隆源码不代表能加载模型，模型目录存在也不代表依赖兼容；一个可响应的服务甚至可能尚未运行过显卡任务。恢复必须回到真实文件与样例，不能用“安装成功”三个字代替可用结果。 ## 举个"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 能克隆源码不代表能加载模型，模型目录存在也不代表依赖兼容；一个可响应的服务甚至可能尚未运行过显卡任务。恢复必须回到真实文件与样例，不能用“安装成功”三个字代替可用结果。 ## 举个"
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

能克隆源码不代表能加载模型，模型目录存在也不代表依赖兼容；一个可响应的服务甚至可能尚未运行过显卡任务。恢复必须回到真实文件与样例，不能用“安装成功”三个字代替可用结果。

## 举个实际例子

我说“试试新版本，但别把能用的旧版弄坏”：系统创建候选并给出质量与身份回执，通过后才停原服务切换；旧版有有效回执才能回滚。网络或模型不足时停在候选阶段，现役环境不被覆盖。

## 最后我会得到什么

知道当前哪一版实际能识别、上一版能否回退，以及新版本在真实样例上是否通过。已有切换和回退验收仍按原日期说明；全新离线电脑从零恢复还需要另备系统与模型文件。

::screen{#localocr-installation-recovery-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-03",
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

新版本在独立环境里通过实际样例，旧版也确实可回退后才切换，并用 Windows 入口再读一次文件。

## 发现问题时

候选失败就保留现役版本；旧目录没有有效验证时不宣称可回滚。

## 入口不可用或证据不足时

缺依赖、模型文件或显卡条件时停在相应步骤，源码目录存在不等于恢复成功。

::screen{#localocr-installation-recovery-04 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-04",
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
     "text_ref": "在已接入 LocalOCR 的本机 AI 对话中明确提出升级或换机恢复，并说明现役版本与可用模型材料；这属于维护流程。",
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
     "text_ref": "1. **保留可用现役**　先检查当前运行版、模型和已验旧版；候选没有独立通过、或还有正在处理的文件，就不动现役，也不在现役环境里原地升级。",
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
     "text_ref": "在已接入 LocalOCR 的本机 AI 对话中明确提出升级或换机恢复，并说明现役版本与可用模型材料；这属于维护流程。"
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
     "text_ref": "1. **保留可用现役**　先检查当前运行版、模型和已验旧版；候选没有独立通过、或还有正在处理的文件，就不动现役，也不在现役环境里原地升级。",
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

在已接入 LocalOCR 的本机 AI 对话中明确提出升级或换机恢复，并说明现役版本与可用模型材料；这属于维护流程。

### 需要准备什么

- 当前安装状态与候选版本

- 可用模型、网络和旧版回执

- 要验证的实际样例

### 从开始到拿到结果

1. **保留可用现役**　先检查当前运行版、模型和已验旧版；候选没有独立通过、或还有正在处理的文件，就不动现役，也不在现役环境里原地升级。

2. **在独立候选里试新版本**　先验依赖和真实合成样例；缺模型文件就停在候选，不覆盖现在可用的版本。

3. **切换后做一次真实请求**　确认没有正在处理的文件后切换，再从 Windows 入口真实识别一份文件看结果；失败只回到确实通过检查的旧版。

::screen{#localocr-installation-recovery-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 现役是 9 月 24 日验收的快照；Paddle 3.4.0 与 3.3.1 之间的真实切换、回滚、恢复是 9 月 17 日上一版的演练，现役还没有同等的 "
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 现役是 9 月 24 日验收的快照；Paddle 3.4.0 与 3.3.1 之间的真实切换、回滚、恢复是 9 月 17 日上一版的演练，现役还没有同等的 "
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
     "text_ref": "1. 开发源码与已激活 app 分离，不在 current（当前版本）中 pip upgrade 或覆盖仍被旧版本引用的权重；需要改动就创建新候选。",
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
     "text_ref": "1. 开发源码与已激活 app 分离，不在 current（当前版本）中 pip upgrade 或覆盖仍被旧版本引用的权重；需要改动就创建新候选。",
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

现役是 10 月 16 日验收的快照；Paddle 3.4.0 与 3.3.1 之间的真实切换、回滚、恢复是 9 月 17 日那一版的演练，此后各版（含现役）还没有同等的 Windows 端到端回执；全离线新机仍未验

### 关键规则与设计选择

1. 开发源码与已激活 app 分离，不在 current（当前版本）中 pip upgrade 或覆盖仍被旧版本引用的权重；需要改动就创建新候选。

2. 模型全部预热是重型动作，不是普通健康检查。

3. 完全离线恢复需要提前保留完整工件；当前脚本本身要联网。

## 当前怎样实现

- pyproject.toml 为 localocr 0.7.0，声明 Python >=3.10，实际运行环境是 Python 3.12.3，安装器固定调用 python3.12；GPU 依赖允许 >=3.3.1,<3.5，而当前锁定和实装为 Paddle 3.4.0/cu129、PaddleOCR 3.7.0、PaddleX 3.7.2，声明和安装分别核对。

- install_wsl.sh 创建 /root/localocr-runtimes/<unique-candidate>，按运行锁文件装依赖并固定源码快照；9 月 24 日后的快照除 app 外也固定 LICENSE、AGENTS 和 scripts/*.ps1（尤其负责路径换算的 windows_paths.ps1）。Python safe-path 与该版本 PYTHONPATH 隔离开发目录，数据 cwd 和输出位置仍保留原项目。

- 安装不加载 GPU 模型也不自动激活。缺模型时明确 download_models.py --allow-heavy，再 validate --allow-heavy 分别验依赖、逻辑和禁用缓存的合成质量；任何源码/依赖/权重变化使验收失效。

- 权重不重复复制到每个 venv，profile 的实际 artifact_paths 参与指纹。新权重独立版本目录，不覆盖仍被 current（当前版本）/previous（上一版本）引用的文件；模型缓存存在、成功加载和实际识别分开。

- manage_runtime.py inspect 返回真实代码和解释器；activate/rollback 在服务停止且接收方自己的回执仍匹配时切换 current/previous 原子链接。现在 current 指向 batch-results-20261016，previous 指向 memory-fix-20261012-1522，两个链接都在北京时间 10 月 16 日 12:33 前后切换（10 月 20 日只读核对）；9 月 24 日的 audit-fixes 快照和 9 月 17 日的 Paddle 3.4.0 版本仍留在目录里，但不再被 current/previous 引用。9 月 24 日之后，开发提交 be4d584（9 月 29 日，只改说明文档）和 50af3fa（10 月 1 日，删掉没用到的辅助代码）只是小改；10 月 12 日到 16 日的 54d8505、b5243c0（强模型内存与整机内存预算）、b647551、4937e0d、e52de0f（Windows 入口输出、期限和缺失输入）、0749391（批量中途出错保留已完成结果）随新快照装进现役。Windows 入口仍为 PowerShell 7.3+ 和同一有界 wrapper，旧的可编辑开发安装不能冒充现役版本。

::screen{#localocr-installation-recovery-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-06",
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
     "text_ref": "- 当前没有能由已有证据证明的完整离线重建包，也没有把所有 Python 依赖、WSL（Windows 的 Linux 子系统）系统和模型权重打成已验收的单个恢复工件。10 月 11 日只读统计本机模型缓存为 18 个目录、共 3.9 GiB，只说明文件还在，不证明今天全部能重新加载。",
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
     "text_ref": "- 当前没有能由已有证据证明的完整离线重建包，也没有把所有 Python 依赖、WSL（Windows 的 Linux 子系统）系统和模型权重打成已验收的单个恢复工件。10 月 11 日只读统计本机模型缓存为 18 个目录、共 3.9 GiB，只说明文件还在，不证明今天全部能重新加载。",
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

- 当前没有能由已有证据证明的完整离线重建包，也没有把所有 Python 依赖、WSL（Windows 的 Linux 子系统）系统和模型权重打成已验收的单个恢复工件。10 月 11 日只读统计本机模型缓存为 18 个目录、共 3.9 GiB，只说明文件还在，不证明今天全部能重新加载。

## 执行流程

1. 先 inspect 当前与 previous、实际代码/依赖/模型，不按最新修改时间猜版本。

2. 确需升级时创建唯一候选，保留现役环境与原件，不向 current（当前状态） 原地安装。

3. 按需要准备独立权重，分别验证依赖、普通测试和真实合成质量；缺工件就停在候选。

4. 无在途任务后停止自己的服务，验当前候选回执再原子切换；真实 Windows 请求和缓存结果另外核对。

5. 需要回滚则由旧版自身验收依据批准切换，再核对实际运行；没有证据的旧目录不能当恢复保证。

::screen{#localocr-installation-recovery-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-07",
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
| venv（Python 独立环境） | 隔离项目依赖的现有运行目录，不是模型权重的替代品。 |
| model cache（模型缓存） | 本机保存的模型文件；存在性、可加载与识别效果是三层不同证据。 |
| smoke test（小样例运行检查） | 让指定文件经真实入口走到结果，验证一条具体路线；不是全面准确率基准。 |

## 专业定义

把代码、依赖和模型身份作为同一运行版本管理；能回滚升级，不等于已有断网新机的一键恢复包。

::screen{#localocr-installation-recovery-08 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-08",
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

防止把源码、依赖、模型缓存、服务在线和实际识别合并成一个失真的恢复结论。

## 边界

- 不因为网站内容建设就运行 install_wsl.sh 或重型全模型预热。

- 已缓存模型的本地推理不等于断网新机可以从零安装。

- 恢复版本以项目配置与兼容证据为准，不无依据永久钉死其他机器配置。

## 失败与恢复

- **Python 包或模型配置不兼容**：保留实际版本与异常，定位对应依赖/适配器，不盲目批量升级。

- **模型缓存缺失**：按已选模型定位所需工件；取得模型与是否运行重型预热分开判断。

- **服务在线但模型任务没跑通**：仅报告服务可达，继续把模型路线标成未验收。

- **只有源码却要求完全离线恢复**：明确还缺依赖、WSL（Windows 的 Linux 子系统） 和模型工件，不虚构已存在的恢复包。

::screen{#localocr-installation-recovery-09 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-09",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "上一个模块 运行与资源",
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 当前依赖声明",
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
     "text_ref": "- 当前依赖声明",
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

- 当前依赖声明

- 联网安装路径

- 显式重型预热

- WSL（Windows 的 Linux 子系统） 运行入口

- 具体模型与选项

- 真实解释器/源码身份与 validate、activate、rollback 入口

- 独立候选、验收、原子激活与由旧版本自证的回滚合同

## 如何验证

- 现役 10 月 16 日快照验收：北京时间 10 月 16 日 12:29:59 开始、用时约 179 秒，依赖、单元测试、质量三步退出码都是 0；187 项单元测试 170 项通过、17 项按条件跳过、0 项失败；禁用缓存的 9 个合成质量案例全部满足各自门槛，两页 VL 案例字符错误率仍是 1.33%。现役验收目录里同样没有 Windows 端到端回执。上一版 10 月 12 日快照验收：183 项单元测试、16 项按条件跳过、0 项失败。

- 9 月 24 日快照（当时现役）验收：181 项单元测试 165 项通过、16 项按条件跳过、0 项失败；禁用缓存的 9 个合成质量案例全部满足各自门槛，其中两页 VL 案例字符错误率仍是 1.33%，质量通过不等于零错。回执 SHA-256：acceptance 为 b8108918f6dd6e1d198d994650ac878adc67b0827d8142f15c0d0affd808e084，quality 为 f6b2992b585be305e4641d03dcc5dbbb0ff2dd2ed02955ec66d78a0514fe7070，单元测试日志为 1c65c402192327e844e00338300d1eb52a0489bad40bfbf2f2f3e679dca7368d。它的验收目录里也没有 Windows 端到端回执。

::screen{#localocr-installation-recovery-10 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-installation-recovery-10",
  "section": "tech",
  "title": "依据与来源（二）",
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
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 上一版 9 月 17 日：冻结环境验收 174 普通通过/1 跳过、九个合成质量案例全部满足各自门槛。它的 windows-end-to-end.json 绑定 3a4bf13，真实走过 Paddle 3.4.0→3.3.1→3.4.0 切换及代码身份核对，普通 OCR（光学字符识别）首次 27.951 秒/缓存 1.284 秒，停止和重启通过，最终按需停止；回执也如实保留了第一次发布脚本退出码 1、修正后退出码 0 的过程。演练里的 3.3.1 是当时保留的旧环境，不是现在的 previous；从现役 9 月 24 日版到现在 previous 的同等演练还没有做过。",
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
     "text_ref": "- 上一版 9 月 17 日：冻结环境验收 174 普通通过/1 跳过、九个合成质量案例全部满足各自门槛。它的 windows-end-to-end.json 绑定 3a4bf13，真实走过 Paddle 3.4.0→3.3.1→3.4.0 切换及代码身份核对，普通 OCR（光学字符识别）首次 27.951 秒/缓存 1.284 秒，停止和重启通过，最终按需停止；回执也如实保留了第一次发布脚本退出码 1、修正后退出码 0 的过程。演练里的 3.3.1 是当时保留的旧环境，不是现在的 previous；从现役 9 月 24 日版到现在 previous 的同等演练还没有做过。",
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

- 9 月 17 日那一版（当时的上一版，现已不是 previous）：冻结环境验收 174 普通通过/1 跳过、九个合成质量案例全部满足各自门槛。它的 windows-end-to-end.json 绑定 3a4bf13，真实走过 Paddle 3.4.0→3.3.1→3.4.0 切换及代码身份核对，普通 OCR（光学字符识别）首次 27.951 秒/缓存 1.284 秒，停止和重启通过，最终按需停止；回执也如实保留了第一次发布脚本退出码 1、修正后退出码 0 的过程。演练里的 3.3.1 是当时保留的旧环境，不是现在的 previous；从 9 月 24 日版起，包括现役 10 月 16 日版和上一版 10 月 12 日版，都还没有做过同等演练。

- 9 月 17 日那一版的 acceptance/quality/Windows 端到端回执 SHA-256 分别为 4204f7d2291f205c799dfb6fc6a016cdfb06c2b365a1eeff682bec823ea7b757、a34aef982c321e28e951afa9d0efea815632f4d1050018d08e635332c3c88953、55156bed06e712ad3c87d3f1c99241046e4341204c057c3c1f55199cabf98d62；它们只证明 9 月 17 日那一版，不能当作现役的验证，也不证明干净断网新机或任意真实文档质量。

## 与其他模块的关系

本模块恢复可执行环境；输入路线决定实际任务，运行层管理资源，最终仍由输出与原图复核证明用户拿到了什么。
