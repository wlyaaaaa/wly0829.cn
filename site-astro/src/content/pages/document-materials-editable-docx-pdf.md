---
{
 "title": "从同一规范内容生成可编辑 DOCX、PDF 与附件",
 "kind": "project",
 "url": "/projects/document-materials/editable-docx-pdf/",
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
  "page": "document-materials-editable-docx-pdf",
  "kind": "project",
  "title": "从同一规范内容生成可编辑 DOCX、PDF 与附件",
  "url": "/projects/document-materials/editable-docx-pdf/",
  "parent": "personal-formal-documents",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "源码按 10 月 11 日 14:00 前的版本（最后变更 10 月 9 日），当日 16:35 只读核对；本次没有制作、打印或安装验证"
  }
 },
 "source": {
  "page": "sources/pages/document-materials-editable-docx-pdf/page.json",
  "sha256": "e17c56ab69fa2043a4653b5104c8c02192ccd047ff4017c84509137b3829e49c",
  "converted_at_beijing": "2026-10-31T13:58:49+08:00"
 }
}
---

::screen{#document-materials-editable-docx-pdf-01 section="top"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-01",
  "section": "top",
  "title": "从同一规范内容生成可编辑 DOCX、PDF 与附件",
  "links": [
   {
    "text": "回到项目 → 个人正式文书",
    "href": "/projects/personal-formal-documents/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-formal-documents/#ai-brief"
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
     "text_ref": "从同一规范内容生成可编辑 DOCX、PDF 与附件",
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
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按 10 月 11 日 14:00 前的版本（最后变更 10 月 9 日），当日 16:35 只读核对；本次没有制作、打印或安装验证",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人正式文书〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "文书和材料制作 · 功能说明",
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
     "text_ref": "从同一规范内容生成可编辑 DOCX、PDF 与附件",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按 10 月 11 日 14:00 前的版本（最后变更 10 月 9 日），当日 16:35 只读核对；本次没有制作、打印或安装验证"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人正式文书〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "文书和材料制作 · 功能说明"
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
   "asset": "_library/module-illustrations/document-materials/editable-docx-pdf-v01.png",
   "key": "main-personal-formal-documents",
   "source_phrase": "右上一幅水彩插画：书桌上一份摊开的两页协议（纸上只画浅灰短线，不画字），右页下方左右两个签字栏：左栏里一笔绿色签名，右栏是空的横线；旁边一台笔记本屏幕上并排两个文件图标（一个蓝色 W 形文档、一个红色 PDF 形文档，图标上不写字）；再旁边一个牛皮纸文件夹，封口贴着绿色封条和一把小锁。",
   "sha256": "b477825e715f82b80c399cbdd58b4b82f30f08946bdd2d16c14166aeb7a5b8db",
   "status": "ready"
  }
 ]
}
```

# 从同一规范内容生成可编辑 DOCX、PDF 与附件

〔回到项目 → 个人正式文书〕　〔复制 AI 续作说明〕

文书和材料制作 · 功能说明

同一份确认内容得到可编辑DOCX、固定版PDF和按序附件，电子版与打印版不各自手改内容。电子版按用途选彩色或黑白，需要快速查找的仍要有清楚的层级和导航；确有打印用途时按打印要求检查，不强制每次交付两版。

**当前情况：**同源 DOCX/PDF 生成在用，协议和单方文书按各自用途编排正文，协议每方各有签字和日期位置（10 月 11 日核对源码）。四类材料的虚构样张验收是历史记录；真实个人材料本次没有制作。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#document-materials-editable-docx-pdf-02 section="usage"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-02",
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

分别修改 Word 和 PDF 最容易让日期、请求、附件编号和签名块漂移；覆盖旧输出又会失去可恢复版本。协议和单方声明的结构也不一样，套一个模板会写乱。

## 举个实际例子

我可以说：“把核对后的退款申请做成可编辑版和打印版，两个版本内容必须一致。”系统会从同一份确认内容生成 DOCX 和 PDF；若本机缺少正常导出条件，会说明改用了什么方式以及仍需复核什么。做协议时，每一方都有自己的签字和日期位置，只在我这一方放我的签名。

## 最后我会得到什么

得到这次确认内容的可编辑 Word、同内容 PDF 和按序附件，知道使用了哪条导出路线。协议按“合同当事人、订立背景、约定条款”组织，单方文书按“致收件方、出具人与相关方、事实、声明事项”组织。新版本不覆盖旧文件；导出失败时保留已经核对的输入和旧版。

::screen{#document-materials-editable-docx-pdf-03 section="usage"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-03",
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
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "row": "start",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
     "width": "40%"
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
     "text_ref": "1. **系统核对并处理**　从同一规范内容生成两种格式，电子版核对层级与导航，确有打印需求再检查纸面效果。",
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
     "text_ref": "1. **系统核对并处理**　从同一规范内容生成两种格式，电子版核对层级与导航，确有打印需求再检查纸面效果。",
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

要求同一份内容同时得到可编辑 Word 和对应 PDF。

## 需要准备什么

- 这次已确认的内容或要改的段落

- 要附上的材料（如有）

- 主要用于屏幕阅读还是打印

## 从开始到拿到结果

1. **系统核对并处理**　从同一规范内容生成两种格式，电子版核对层级与导航，确有打印需求再检查纸面效果。

2. **交付与接续**　交回可编辑 DOCX、固定版 PDF 与附件；导出或字体有问题时保留原内容，重新核对页面。

::screen{#document-materials-editable-docx-pdf-04 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-04",
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
     "type": "numbered_steps",
     "text_ref": "1. 四类材料的输入定义都在；网站总览重点讲合同协议和通知声明两类，不代表另外两类被删掉。",
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
     "text_ref": "1. 四类材料的输入定义都在；网站总览重点讲合同协议和通知声明两类，不代表另外两类被删掉。",
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

**10 月 11 日核对源码**　版本 2.0.1；源输入结构仍覆盖四类文书，输出仍是 DOCX、PDF、附件包三种。四类材料和隔离安装后的虚构样张完成同源生成与复验，是 9 月初的历史记录；本次没有运行任何制作、Word 导出或安装验证。

## 关键规则与设计选择

1. 四类材料的输入定义都在；网站总览重点讲合同协议和通知声明两类，不代表另外两类被删掉。

2. 内部角色代码、事项编号、目的、渠道和参考号不进入对外正文；文档属性里的主题已清空，类别写人话类型。

3. 2.0.1 安装包包含唯一 Word 导出资源；兼容构建与新入口共用同一实现。

4. Word 首选路线和备用 PDF 路线在清单中分开，不能互相冒充。

5. 请求默认按电子版处理，明确标为打印才按打印验证；同一内容源，不强制两套版式。

## 当前怎样实现

- A4 DOCX：四边 25 mm、页脚 12 mm 带页码，正文宋体 12 pt、1.5 倍行距，标题黑体 18 pt、小标题 13 pt。

- 协议和单方文书按各自用途组织正文；可选的“依据”和附件随输入出现。

- 协议每方都有独立的签字（盖章）和日期位置：需要本人签名时只在本人一方嵌入签名和日期，其他方留空；不需要签名时各方签署位都留空，状态仍是“已生成”。

::screen{#document-materials-editable-docx-pdf-05 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-05",
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
     "text_ref": "- Word 导出资源随安装包提供，以无窗口方式运行、180 秒超时。Word 不可用时用本地备用引擎生成 PDF，并在清单写明原因；备用引擎必须有可嵌入的中文 TrueType 字体，缺字体直接失败，不交缺字成品，因此备用 PDF 不保证也是宋体加黑体的组合。",
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
     "text_ref": "- Word 导出资源随安装包提供，以无窗口方式运行、180 秒超时。Word 不可用时用本地备用引擎生成 PDF，并在清单写明原因；备用引擎必须有可嵌入的中文 TrueType 字体，缺字体直接失败，不交缺字成品，因此备用 PDF 不保证也是宋体加黑体的组合。",
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

- Word 导出资源随安装包提供，以无窗口方式运行、180 秒超时。Word 不可用时用本地备用引擎生成 PDF，并在清单写明原因；备用引擎必须有可嵌入的中文 TrueType 字体，缺字体直接失败，不交缺字成品，因此备用 PDF 不保证也是宋体加黑体的组合。

- 备用 PDF 按签名原图宽高比放置，过宽就等比缩小，每方签署块不跨页拆开；这是实现，不说明签名视觉已人工看过。

- DOCX 与 PDF 重新提取正文，逐项核对输出字段；旧版式的已存档成品按旧字段读回，不重写。

::screen{#document-materials-editable-docx-pdf-06 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-06",
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
     "text_ref": "- 构建和材料包都在临时目录完成后原子替换上线；同名拒绝，失败清理临时目录。附件按输入顺序编号复制，中文名片段最长 80 字，复制后哈希不符即失败。",
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
     "text_ref": "- 构建和材料包都在临时目录完成后原子替换上线；同名拒绝，失败清理临时目录。附件按输入顺序编号复制，中文名片段最长 80 字，复制后哈希不符即失败。",
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

- 构建和材料包都在临时目录完成后原子替换上线；同名拒绝，失败清理临时目录。附件按输入顺序编号复制，中文名片段最长 80 字，复制后哈希不符即失败。

## 执行流程

1. 验证计划

2. 创建唯一构建临时目录

3. 存档输入原字节与附件

4. 按文书用途生成 DOCX

5. 导出 PDF 或明确使用备用引擎

6. 重读字段、各方签署位与签名

7. 写构建清单并原子上线

::screen{#document-materials-editable-docx-pdf-07 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-07",
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
| DOCX | 可继续编辑、修订和批注的 Word 文档；结构正确仍须逐页检查。 |
| PDF | 固定版面输出；它来自同一内容源，不是另手工维护的一份正文。 |
| Build ID（构建标识） | 一次不可覆盖制作的稳定名字；同名存在就拒绝覆盖。 |
| Fallback（备用引擎） | Word 不可用时使用的本地 PDF 路线，需要可嵌入的中文字体；清单会保留引擎和警告。 |
| 签署位 | 协议里每一方的签字（盖章）和日期位置；只在本人一方嵌入本人签名。 |

## 专业定义

计划只定义制作路线；构建才生成 A4 DOCX、PDF、附件和清单，正文按文书用途编排。Word 是首选导出器，备用引擎会在清单中明确记录。

::screen{#document-materials-editable-docx-pdf-08 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-08",
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
     "text_ref": "- 只生成明确请求的当前事项",
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
     "text_ref": "- 只生成明确请求的当前事项",
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

解决电子／打印版本分叉、内部代码泄露、旧输出覆盖、协议签署位混乱、备用路线缺中文字体和安装后静默缺资源。

## 边界

- 只生成明确请求的当前事项

- 不把能打开写成内容正确

- 不覆盖既有构建或材料包

- 备用引擎不冒充 Word 输出

- 不自动执行外部递送

## 失败与恢复

- **同名构建或材料包已存在**：拒绝覆盖；使用新构建标识或继续核对既有版本。

::screen{#document-materials-editable-docx-pdf-09 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-09",
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
     "text_ref": "- **Word 导出不可用**：明确记录警告并尝试本地备用引擎；没有可嵌入中文字体或备用也失败则停止。",
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
     "text_ref": "- **Word 导出不可用**：明确记录警告并尝试本地备用引擎；没有可嵌入中文字体或备用也失败则停止。",
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

- **Word 导出不可用**：明确记录警告并尝试本地备用引擎；没有可嵌入中文字体或备用也失败则停止。

- **DOCX/PDF 缺输出字段或签署位**：正文读回失败，不形成“已具备递送条件”的材料包。

- **附件复制哈希不同**：删除本轮临时目录，原件与旧构建保持不变。

::screen{#document-materials-editable-docx-pdf-10 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-editable-docx-pdf-10",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 事项与原件",
    "href": "/projects/document-materials/current-matter-sources/"
   },
   {
    "text": "下一个模块 逐页验收与材料包",
    "href": "/projects/document-materials/page-audit-release/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
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
     "text_ref": "- PRIVATE source · formal_documents.py　按用途编排的 DOCX/PDF、各方签署位、附件、导出与不可覆盖构建",
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
     "text_ref": "- PRIVATE source · formal_documents.py　按用途编排的 DOCX/PDF、各方签署位、附件、导出与不可覆盖构建",
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

- PRIVATE source · formal_documents.py　按用途编排的 DOCX/PDF、各方签署位、附件、导出与不可覆盖构建

- PRIVATE source · packaged Word exporter　安装包内 Word 固定版导出

- PRIVATE tests · four-type build/verify　四类材料、Word/备用引擎、协议签署位与隔离安装回归（31 个测试函数、51 个用例，10 月 22 日静态计数，本次没有运行）

## 如何验证

- 四类通用材料的合成构建与复验、隔离安装包两个入口用 Microsoft Word + Poppler 的运行，都是 9 月初的历史记录。

- DOCX 不含内部角色代码、事项编号或原始渠道值。

- 本次没有运行测试，也没有确认当前 Word、字体和 Poppler 安装可用。

- 真实个人正文和真实打印验收本次没有运行。

## 与其他模块的关系

本模块形成“已生成”或“本人已签”的构建；逐页审计和自包含材料包由下一模块决定是否可进入“已具备递送条件”。
