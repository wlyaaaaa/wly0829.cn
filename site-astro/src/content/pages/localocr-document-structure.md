---
{
 "title": "把行列、公式与页面位置一起保留下来",
 "kind": "project",
 "url": "/projects/localocr/document-structure/",
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
  "page": "localocr-document-structure",
  "kind": "project",
  "title": "把行列、公式与页面位置一起保留下来",
  "url": "/projects/localocr/document-structure/",
  "parent": "localocr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "LocalOCR 源码（主线最后提交 d9e51bd，北京时间 10 月 26 日 04:14）、current 版本链接、现役 10 月 26 日验收回执与五个关键安装文件哈希，于 2026-10-30 11:11–11:15（北京时间）只读核对；日常结构路线使用情况按 2026-10-30 11:07 的现存任务登记聚合。9 月 24 日旧验收与其余结构说明沿用 2026-10-11 16:30–16:48 的核对；本轮没有运行 Structure 模型，结构路线仍只支持显卡。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/localocr-document-structure/page.json",
  "sha256": "961253c4004792a6db99e4c68fbe4730332e212d1611a25ab791b1ced319505d",
  "converted_at_beijing": "2026-10-30T15:12:31+08:00"
 }
}
---

::screen{#localocr-document-structure-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-01",
  "section": "top",
  "title": "把行列、公式与页面位置一起保留下来",
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
     "text_ref": "把行列、公式与页面位置一起保留下来",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（主线最后提交 d9e51bd，北京时间 10 月 26 日 04:14）、current 版本链接、现役 10 月 26 日验收回执与五个关键安装文件哈希，于 2026-10-30 11:11–11:15（北京时间）只读核对；日常结构路线使用情况按 2026-10-30 11:07 的现存任务登记聚合。9 月 24 日旧验收与其余结构说明沿用 2026-10-11 16:30–16:48 的核对；本轮没有运行 Structure 模型，结构路线仍只支持显卡。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
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
     "text_ref": "当一行文字必须和另一列数字对应时，只把字读出来还不够。结构解析保留表格、公式、区域和阅读顺序，让我能继续整理材料，并按同一页的图像位置核对每一处内容。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "当前情况：已有保留表格、公式、区域和阅读顺序的解析功能，现役10月26日版本（和此前10月16日版本）的合成验收通过；截至10月30日11:07，日常任务里还没用过这条结构路线。行列与关键数字仍需回到原",
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
     "text_ref": "把行列、公式与页面位置一起保留下来",
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
     "static_note": "截至 10 月 11 日 · LocalOCR 源码（主线最后提交 d9e51bd，北京时间 10 月 26 日 04:14）、current 版本链接、现役 10 月 26 日验收回执与五个关键安装文件哈希，于 2026-10-30 11:11–11:15（北京时间）只读核对；日常结构路线使用情况按 2026-10-30 11:07 的现存任务登记聚合。9 月 24 日旧验收与其余结构说明沿用 2026-10-11 16:30–16:48 的核对；本轮没有运行 Structure 模型，结构路线仍只支持显卡。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
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
     "text_ref": "当一行文字必须和另一列数字对应时，只把字读出来还不够。结构解析保留表格、公式、区域和阅读顺序，让我能继续整理材料，并按同一页的图像位置核对每一处内容。"
    },
    {
     "type": "prose",
     "text_ref": "当前情况：已有保留表格、公式、区域和阅读顺序的解析功能，现役10月26日版本（和此前10月16日版本）的合成验收通过；截至10月30日11:07，日常任务里还没用过这条结构路线。行列与关键数字仍需回到原"
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
   "asset": "_library/illustrations/modules/localocr/document-structure/document-structure-v01.png",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "111172d26483212e5d0b62751f4532acda772f541db6131183c38cc552a1b4cc",
   "status": "ready"
  }
 ]
}
```

# 把行列、公式与页面位置一起保留下来

〔回到项目 → 本地文字识别〕　〔GitHub〕　〔复制 AI 续作说明〕

LocalOCR · 功能说明

当一行文字必须和另一列数字对应时，只把字读出来还不够。结构解析保留表格、公式、区域和阅读顺序，让我能继续整理材料，并按同一页的图像位置核对每一处内容。

**当前情况：**已有保留表格、公式、区域和阅读顺序的解析功能，现役 10 月 26 日版本（和此前 10 月 16 日版本）的合成验收通过；截至 10 月 30 日 11:07，日常任务里还没用过这条结构路线。行列与关键数字仍需回到原页检查。结构解析只能用显卡：普通文字识别在显卡被占时可以改用 CPU，这条路线不会，显卡不可用时直接报冲突。

项目现状截至 2026-10-11 14:00（北京时间），于同日 16:30–16:48 只读核对；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#localocr-document-structure-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 采购表、双栏文档和公式页容易被普通提字打散。这个模块把结构作为明确结果需求：模型负责还原可见关系，原图负责最终复核，不把一段流畅文本当作表格已经准确恢复。 ## 举个实际例子 我可"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 采购表、双栏文档和公式页容易被普通提字打散。这个模块把结构作为明确结果需求：模型负责还原可见关系，原图负责最终复核，不把一段流畅文本当作表格已经准确恢复。 ## 举个实际例子 我可"
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

采购表、双栏文档和公式页容易被普通提字打散。这个模块把结构作为明确结果需求：模型负责还原可见关系，原图负责最终复核，不把一段流畅文本当作表格已经准确恢复。

## 举个实际例子

我可以说：“把采购订单的商品、型号、数量、单价和金额按行列保留下来。”系统会检查列数、商品与数字对应关系和合计；识别出来的数字仍要回到原图核对，不能直接当成正确业务金额。

## 最后我会得到什么

拿到可阅读的表格、公式和页面位置，也有供程序处理的结构化文件；商品与金额关系可回原页核对。它不直接生成 Excel，也不能凭识别到印章就判断真假。

## 结果怎么看

## 正常时

结构与文字一起返回，可以按页和区域核对。

## 发现问题时

行列、阅读顺序、公式或坐标有误时保留原始输出并回原图检查，不静默改写。

## 入口不可用或证据不足时

结构模型或输入不支持时返回明确失败；普通提字的结果不能冒充结构解析成功。

::screen{#localocr-document-structure-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-03",
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
     "text_ref": "在 LocalOCR 请求中明确说“保留表格行列、公式或区域”，并指定原件。",
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
     "text_ref": "1. **识别哪些关系不能丢**　系统从页面找出表头、行列、公式和区域，再选择能保留这些关系的识别路线。",
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
     "text_ref": "在 LocalOCR 请求中明确说“保留表格行列、公式或区域”，并指定原件。"
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
     "text_ref": "1. **识别哪些关系不能丢**　系统从页面找出表头、行列、公式和区域，再选择能保留这些关系的识别路线。",
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

在 LocalOCR 请求中明确说“保留表格行列、公式或区域”，并指定原件。

## 需要准备什么

- 有结构的图片或扫描 PDF

- 需保留的列、公式、印章区域或页码

## 从开始到拿到结果

1. **识别哪些关系不能丢**　系统从页面找出表头、行列、公式和区域，再选择能保留这些关系的识别路线。

2. **逐页还原可见关系**　系统按实际模型解析页面，保存表格块、文字行、顺序和位置。

3. **回到原页核对**　取得可读和结构文件后核对关键单元格；不把整齐排版当金额正确，也不宣称生成 Excel。

::screen{#localocr-document-structure-04 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 结构字段与解析路线已实现，合成验收通过；日常任务尚未使用 ### 关键规则与设计选择 1. 表格和版面必须明确提出，auto 不自动进入 structure"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 结构字段与解析路线已实现，合成验收通过；日常任务尚未使用 ### 关键规则与设计选择 1. 表格和版面必须明确提出，auto 不自动进入 structure"
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
     "text_ref": "1. 表格和版面必须明确提出，auto 不自动进入 structure（结构化版面）。",
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
     "text_ref": "1. 表格和版面必须明确提出，auto 不自动进入 structure（结构化版面）。",
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

结构字段与解析路线已实现，合成验收通过；日常任务尚未使用

### 关键规则与设计选择

1. 表格和版面必须明确提出，auto 不自动进入 structure（结构化版面）。

2. PDF 坐标属于实际渲染像素，按对应页的比例与尺寸核对；做过非线性矫正时不能伪称可以直接映射原图。

3. 图表识别当前关闭；印章区域识别不证明印章真伪。

## 当前怎样实现

- pp-structure-v3 profile 使用 PP-StructureV3 + PP-OCRv5；当前 PaddleOCR 结构接口不能把普通 OCRv6 配置直接套入该路线。

- use_table_recognition、use_formula_recognition、use_seal_recognition、use_region_detection 与 format_block_content 已开启，use_chart_recognition=false。

- engines/structure.py 保留版面、表格 HTML、公式、印章、区域和原始 OCR（光学字符识别） 行，避免只保留展示文本而丢掉独立位置证据。

- engines/vl.py 为复杂 PDF 提供视觉语言解析；VL 与显式 Structure（结构化版面） 是不同选择，不用一个模型名称覆盖所有文档场景。

- 正常 iter_input_pages 采用 216 DPI 和 24M 像素上限逐页渲染并删除上一临时页，独立 input_page_count 验 PDF 页/TIFF 帧；旧显式物化函数默认 scale=2.0，不能当当前所有结果的固定比例。

::screen{#localocr-document-structure-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-05",
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
     "text_ref": "- 普通 OCR（光学字符识别） 对平面截图默认关闭文档形变矫正；VL 与 Structure（结构化版面） 的文档配置仍开启，复核时应核对实际坐标所属图像空间。",
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
     "text_ref": "- 普通 OCR（光学字符识别） 对平面截图默认关闭文档形变矫正；VL 与 Structure（结构化版面） 的文档配置仍开启，复核时应核对实际坐标所属图像空间。",
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

- 普通 OCR（光学字符识别） 对平面截图默认关闭文档形变矫正；VL 与 Structure（结构化版面） 的文档配置仍开启，复核时应核对实际坐标所属图像空间。

- 保留的 9 月 3 日采购表 figure_title 因 figure 标签进入 excluded_regions，Markdown 漏标题且 text_lines 把 PO 读成 P0；当前标签过滤代码仍有该条件，新的表格合成测试没有证明这张旧图已修复。

## 执行流程

1. 说明需要表格、公式、印章区域或复杂版面，而不只说提字。

2. 选择 VL 或显式 Structure（结构化版面），核对实际 profile。

3. PDF 逐页渲染，图片按其对应输入空间处理。

4. 保留结构块、原始文字行、顺序与位置，生成可读和结构化输出。

5. 按原页核对行列、公式、边界与坐标，不以表格看着整齐代替正确性。

::screen{#localocr-document-structure-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-06",
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
| table HTML（表格结构标记） | 保存行列关系的模型输出，可供后续转换；格式存在不代表单元格内容正确。 |
| reading order（阅读顺序） | 文档块应按什么顺序阅读；多栏和复杂布局下仍需核对。 |
| rendered pixels（渲染像素） | PDF 被转成图片后的坐标单位，与原 PDF 的点坐标不同。 |

## 专业定义

提取文字之外，还要保留表格行列、阅读顺序、公式和原图位置。

::screen{#localocr-document-structure-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-07",
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

防止表格行列被拼成无关系的文本、公式信息被过度简化，以及把不同坐标空间混用导致复核指错区域。

## 边界

- 只有输出中实际存在的结构才可宣称提取成功，不能从模型能力标签猜结果。

- 不保证恢复任意复杂表格，也不代替公式推导或印章鉴真。

- 没有直接生成 Word、Excel 或可搜索 PDF 的现行导出入口。

## 失败与恢复

- **表格合并或阅读顺序错误**：保留原始结构与文字行，按原图校对；下游转换不得掩盖不确定性。

- **框的位置对不上 PDF**：先核对页码、render_scale、渲染尺寸和矫正空间，不直接把像素框作为 PDF 点坐标。

- **模型未加载或结构解析失败**：保留明确错误；若另选普通提字，应注明能力降级和本次实际输出。

::screen{#localocr-document-structure-08 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-document-structure-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 输入与识别路线",
    "href": "/projects/localocr/input-routing/"
   },
   {
    "text": "下一个模块 结果与复核",
    "href": "/projects/localocr/results-evidence/"
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
     "text_ref": "- 结构与原始文字保留",
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
     "text_ref": "- 结构与原始文字保留",
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

- 结构与原始文字保留

- 复杂文档路线

- 页面渲染与坐标

- 实际结构选项

- 结构字段回归

## 如何验证

- 源码与配置已核对表格、公式、印章、区域开启而图表关闭的实际状态；截至 10 月 30 日，三个默认模型配置和这些开关都没有变化。结构解析配置不带 CPU 参数：10 月 26 日起普通文字识别在显卡被占时可改用 CPU，这条路线不跟着改，显卡被占时返回冲突（409），调度器不可用时返回 503。

- test_structure.py 与相关输出测试验证字段、文字行和坐标保留，不代表真实模型对任意文档准确。

- 9 月 3 日采购表保留六列五条商品和合计，却漏标题并有 PO/P0 错字；9 月 17 日结构表格的九个单元格及自动表格案例通过；9 月 24 日验收的 structure_table 九个关键单元格也通过，10 月 16 日（上一版现役）验收的同一案例关键单元格同样通过；现役 10 月 26 日快照的验收（北京时间 10 月 26 日 04:05:49 开始）依赖、单元、质量三步都正常结束，本轮没有逐项读它的结构案例单元格。不同样例不能相互改写结果：新案例通过，不证明 9 月 3 日那张旧图的漏标题和错字已经修好。截至 10 月 30 日 11:07 的完成任务里没有一条走结构路线，所以这条能力照样保留，只是还没在真实材料上验过。

## 与其他模块的关系

输入路线决定何时选择结构解析；本模块拥有结构含义，结果模块拥有输出身份与质量解释，后续文档排版由独立工具完成。
