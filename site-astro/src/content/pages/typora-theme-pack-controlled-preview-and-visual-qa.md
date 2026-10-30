---
{
 "title": "预览与实际页面检查",
 "kind": "project",
 "url": "/projects/typora-theme-pack/controlled-preview-and-visual-qa/",
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
  "page": "typora-theme-pack-controlled-preview-and-visual-qa",
  "kind": "project",
  "title": "预览与实际页面检查",
  "url": "/projects/typora-theme-pack/controlled-preview-and-visual-qa/",
  "parent": "typora-theme-pack",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 f30ac9c（9 月 29 日）核对，未渲染、未看图。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  },
  "based_on": {
   "commit": "f30ac9c584e6fff0abe48ebd58b119c4d3c08da8",
   "commit_time": "2026-09-28T12:36:45-05:00"
  }
 },
 "source": {
  "page": "sources/pages/typora-theme-pack-controlled-preview-and-visual-qa/page.json",
  "sha256": "d00a8efd4c96a9020ed5db3aa30f63c2f12065a0de7accaa189116e40e2f715c",
  "converted_at_beijing": "2026-10-30T15:12:32+08:00"
 }
}
---

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-01 section="top"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-01",
  "section": "top",
  "title": "预览与实际页面检查",
  "links": [
   {
    "text": "回到项目 → Typora 薄荷主题",
    "href": "/projects/typora-theme-pack/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/typora-theme-pack"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/typora-theme-pack/#ai-brief"
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
     "text_ref": "预览与实际页面检查",
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
       "text": "偶尔用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 f30ac9c（9 月 29 日）核对，未渲染、未看图。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → Typora 薄荷主题〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "修改样式后能直接对比结果，避免只看 CSS 断言就说页面正确。",
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
     "text_ref": "预览与实际页面检查",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 f30ac9c（9 月 29 日）核对，未渲染、未看图。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → Typora 薄荷主题〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "修改样式后能直接对比结果，避免只看 CSS 断言就说页面正确。"
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
   "asset": "_library/illustrations/modules/typora-theme-pack-controlled-preview-and-visual-qa-v01.png",
   "key": "typora-theme-pack-controlled-preview-and-visual-qa-hero",
   "source_phrase": "模块专属首屏插画",
   "sha256": "bba9e4f133c4bf79a4f4fb204eaf7e3661140d81890b5d73717fdd9367a2fd38",
   "status": "ready"
  }
 ]
}
```

# 预览与实际页面检查

〔回到项目 → Typora 薄荷主题〕　〔GitHub〕　〔复制 AI 续作说明〕

Typora Theme Pack · 功能说明

修改样式后能直接对比结果，避免只看 CSS 断言就说页面正确。

**当前情况：**通用样例的实际 PDF 页面在 9 月 8 日（各 1 页的短样例）和 9 月 28 日（各 2 页）检查过；9 月 29 日修了表头后，新样张还没有重新看图。新文档与原生编辑器的显示仍要分别验收。

项目源码：公开仓库

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-02 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 同一份 CSS 在模拟软件外壳、实际 PDF 和 Typora 原生窗口中的表现可能不同；截图必须说明它能证明哪一层。 举个实际例子 调整标题间距后，把三个导出版本排出来看。页面上标明这是实际"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 同一份 CSS 在模拟软件外壳、实际 PDF 和 Typora 原生窗口中的表现可能不同；截图必须说明它能证明哪一层。 举个实际例子 调整标题间距后，把三个导出版本排出来看。页面上标明这是实际"
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

同一份 CSS 在模拟软件外壳、实际 PDF 和 Typora 原生窗口中的表现可能不同；截图必须说明它能证明哪一层。

## 举个实际例子

调整标题间距后，把三个导出版本排出来看。页面上标明这是实际 PDF 渲染；软件外壳样张则保留浏览器概念预览标识。

## 最后我会得到什么

获得公开通用样例的 PNG 与联系表，辅助检查代码、表格、对比度和分页。

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-03 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-03",
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

当前样例的 PDF 或图片能逐页打开，版式和文字已实际看过。

## 发现问题时

发现裁切、错行或样式不一致时修对应版式，再看同类文档。

## 入口不可用或证据不足时

缺浏览器或渲染环境时只能保留源码检查，不能声称完成视觉验收。

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-04 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-04",
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
     "text_ref": "使用项目预览脚本和公开通用样例生成当前样式图片，再打开整页 PDF/图片检查文字、分页和层级。",
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
     "text_ref": "1. **用固定样例生成**　避免拿私人正文做公开截图，记录所用主题和模式。",
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
     "text_ref": "使用项目预览脚本和公开通用样例生成当前样式图片，再打开整页 PDF/图片检查文字、分页和层级。"
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
     "text_ref": "1. **用固定样例生成**　避免拿私人正文做公开截图，记录所用主题和模式。",
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

使用项目预览脚本和公开通用样例生成当前样式图片，再打开整页 PDF/图片检查文字、分页和层级。

## 需要准备什么

- 要检查的版式或导出结果

- 可用于预览的样文

## 从开始到拿到结果

1. **用固定样例生成**　避免拿私人正文做公开截图，记录所用主题和模式。

2. **看完整页面**　逐页检查表格、代码、字体、留白和截断，并提取文字确认正文没丢。

3. **留下可追溯对比**　保存带来源的预览图；概念图不能当 Typora 实际窗口验收。

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-05 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 实际 PDF 页面已检查 关键规则与设计选择 1 概念软件窗口、CSS 回归、安装摘要、实际 PDF 和 Typora 原生观察分开。 2 公开样例不包含真实私人文档。"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 实际 PDF 页面已检查 关键规则与设计选择 1 概念软件窗口、CSS 回归、安装摘要、实际 PDF 和 Typora 原生观察分开。 2 公开样例不包含真实私人文档。"
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
     "text_ref": "1. 概念软件窗口、CSS 回归、安装摘要、实际 PDF 和 Typora 原生观察分开。",
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
     "text_ref": "1. 概念软件窗口、CSS 回归、安装摘要、实际 PDF 和 Typora 原生观察分开。",
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

实际 PDF 页面检查是 9 月 8 日、9 月 28 日的历史结果；9 月 29 日表头修复后的样张本次只解析、未看图

## 关键规则与设计选择

1. 概念软件窗口、CSS 回归、安装摘要、实际 PDF 和 Typora 原生观察分开。

2. 公开样例不包含真实私人文档。

3. 一页或两页的实际 PDF 验收不推广成所有长文都无须检查。

## 当前怎样实现

- render_previews.py 将 Markdown 与 profile CSS 组合成 HTML；软件外壳明确标“浏览器概念预览”，代码块检查图标“Typora 1.14 CodeMirror DOM”。

- render_html_png_playwright.js 为 Node/Playwright 辅助，失败或没有这个运行时就直接用无界面 Edge 截图；缺浏览器才停相应预览层，可选助手缺依赖不等于主题失效。Pillow 生成多样式联系表，qa 为可重建中间产物。

- 现存 8 张 PNG：三种版式各 1 张（1240×1680）、版式联系表（2070×978）、软件概念图和它的同名副本（各 1500×1000）、代码块检查图（1240×920）、一张 Typora 原生实拍（1938×1950，8 月 2 日）。9 月 29 日的提交替换了公司版、个人版和联系表三张图，Git 能证明图换了，不能证明整套预览脚本完整重跑过。

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-06 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-06",
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
     "text_ref": "- 画廊里的 PDF 页面图是从实际 PDF 渲染出来的（9 月 8 日那批用 Poppler），和程序自带的概念软件图不是同一证据层。项目总览现在用的个人版截图是 9 月 28 日表头修复前的样子，继续用时要标原日期和“修复前”，不能当修复后的效果。",
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
     "text_ref": "- 画廊里的 PDF 页面图是从实际 PDF 渲染出来的（9 月 8 日那批用 Poppler），和程序自带的概念软件图不是同一证据层。项目总览现在用的个人版截图是 9 月 28 日表头修复前的样子，继续用时要标原日期和“修复前”，不能当修复后的效果。",
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

- 画廊里的 PDF 页面图是从实际 PDF 渲染出来的（9 月 8 日那批用 Poppler），和程序自带的概念软件图不是同一证据层。项目总览现在用的个人版截图是 9 月 28 日表头修复前的样子，继续用时要标原日期和“修复前”，不能当修复后的效果。

## 执行流程

1. 选择公开通用样例

2. 生成或导出当前结果

3. 渲染完整页面

4. 查看版式与提取文字

5. 保存带来源的对比图

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-07 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-07",
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
| 联系表 | 把多张页面缩略图放在一起比较，不是文档正式页面。 |

## 专业定义

看排版，同时说清它是在浏览器还是编辑器里生成的

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-08 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-08",
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
     "text_ref": "- 预览脚本按当前 Windows 字体/浏览器配置工作。",
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
     "text_ref": "- 预览脚本按当前 Windows 字体/浏览器配置工作。",
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

可选预览器缺依赖不影响已安装 CSS；不能把缺少某个开发环境写成主题本身失效。

## 边界

- 预览脚本按当前 Windows 字体/浏览器配置工作。

- 软件概念图不冒充原生进程截图。

## 失败与恢复

- **缺浏览器或辅助依赖**：报告这一层无法生成，保留其他独立证据。

::screen{#typora-theme-pack-controlled-preview-and-visual-qa-09 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-controlled-preview-and-visual-qa-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 安装与恢复",
    "href": "/projects/typora-theme-pack/theme-installation-and-lifecycle/"
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
     "text_ref": "- 预览流程",
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
     "text_ref": "- 预览流程",
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

- 预览流程

- 浏览器辅助

- 公开样例

- 历史可视化成果

## 如何验证

- 2026-09-08 07:42：三种实际 PDF 各 1 页（较短的旧样例），渲染后逐张查看，未见裁切与重叠。

- 2026-09-28：更完整的公开样例三种各 2 页，渲染报告还在；当时个人版表头发灰，9 月 29 日已在源码修复。

- 2026-10-11 16:32 只读解析仓库现存三份样张（9 月 29 日 01:32 生成）：各 2 页、可打开；这次没有渲染或看图，不能凭生成时间说修复后的视觉已经验收。

## 与其他模块的关系

检验最终排版，不能替代内容、安装和原生应用各自验收。
