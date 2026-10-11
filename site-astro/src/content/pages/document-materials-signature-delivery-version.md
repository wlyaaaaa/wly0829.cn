---
{
 "title": "把本人签名、无需签名和可递送版本准确分开",
 "kind": "project",
 "url": "/projects/document-materials/signature-delivery-version/",
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
  "page": "document-materials-signature-delivery-version",
  "kind": "project",
  "title": "把本人签名、无需签名和可递送版本准确分开",
  "url": "/projects/document-materials/signature-delivery-version/",
  "parent": "personal-formal-documents",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "源码按 10 月 11 日 14:00 前的版本（最后变更 10 月 9 日），当日 16:35 只读核对；本次没有真实签名或递送"
  }
 },
 "source": {
  "page": "sources/pages/document-materials-signature-delivery-version/page.json",
  "sha256": "99678c72761bce97da11f1c3c2b7036547a2dc62fd2211d78f04a85617b2578e",
  "converted_at_beijing": "2026-10-11T21:05:00+08:00"
 }
}
---

::screen{#document-materials-signature-delivery-version-01 section="top"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-01",
  "section": "top",
  "title": "把本人签名、无需签名和可递送版本准确分开",
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
     "text_ref": "把本人签名、无需签名和可递送版本准确分开",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 11 日 14:00 前的版本（最后变更 10 月 9 日），当日 16:35 只读核对；本次没有真实签名或递送",
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
     "text_ref": "把本人签名、无需签名和可递送版本准确分开",
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 11 日 14:00 前的版本（最后变更 10 月 9 日），当日 16:35 只读核对；本次没有真实签名或递送"
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
   "asset": "_library/module-illustrations/document-materials/signature-delivery-version-v02.png",
   "key": "main-personal-formal-documents",
   "source_phrase": "右上一幅水彩插画：书桌上一份摊开的两页协议（纸上只画浅灰短线，不画字），右页下方左右两个签字栏：左栏里一笔绿色签名，右栏是空的横线；旁边一台笔记本屏幕上并排两个文件图标（一个蓝色 W 形文档、一个红色 PDF 形文档，图标上不写字）；再旁边一个牛皮纸文件夹，封口贴着绿色封条和一把小锁。",
   "sha256": "3f41259126c371508aa3ded4fca182ed81ee46db8d6f6dd98ec458a594197e94",
   "status": "ready"
  }
 ]
}
```

# 把本人签名、无需签名和可递送版本准确分开

〔回到项目 → 个人正式文书〕　〔复制 AI 续作说明〕

文书和材料制作 · 功能说明

用户能知道当前版本到底是已生成、本人已签还是已经锁定可递送，而不会把一张签名图误写成外部结果。协议里每一方都有自己的签字位置，只在本人那一方放本人的签名。

**当前情况：**签署人核对、签名资产封存和协议每方独立签署位都在用（10 月 11 日核对源码）；PDF 中的签名是否清晰、位置正确仍需看真实页面，图片数量不够证明。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#document-materials-signature-delivery-version-02 section="usage"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-02",
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

签署人、签名资产、日期和最终 PDF 只要错一项，就可能用错版本；反过来，不需要签名的材料也不能伪造“本人已签”状态。协议有好几方，签名放错一方或替对方签都不行。

## 举个实际例子

我可以问：“这份协议需要我签名吗，现在能不能发？”系统会先核对接收要求和实际页面：每一方都有签字和日期位置，只有我这一方放我的签名和日期，对方处留空；无需签名的材料在内容与版面通过后可进入待递送，需要签名的还要确认签名属于本人、位置正确且清楚可见。

## 最后我会得到什么

知道这份本地文件是刚生成、无需签、待本人签、已签还是已锁定可递送；这些状态都不等于实际送出，也不代表对方已签、合同已生效或已履约。

::screen{#document-materials-signature-delivery-version-03 section="usage"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-03",
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
     "text_ref": "可以继续制作",
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
     "text_ref": "可以继续制作",
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

## 可以继续制作

不需签名的版本，或确需签名且已核对本人签名与页面的版本，完成其他检查后才标为可递送。

## 需要修正

签名人、图片来源或最终可见性对不上时保留待核，不用图片存在代替已签。

## 当前不可用

必要签名材料或页面检查不可用时暂停签名与可递送步骤，不造占位签名。

::screen{#document-materials-signature-delivery-version-04 section="usage"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-04",
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
     "text_ref": "1. **系统核对并处理**　分开无需签、待本人签、已签和锁定可递送的版本，不用一张签名图替代实际步骤。",
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
     "text_ref": "1. **系统核对并处理**　分开无需签、待本人签、已签和锁定可递送的版本，不用一张签名图替代实际步骤。",
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

说明这份文件需不需要本人签名，并问现在能否递送。

## 需要准备什么

- 这份文件需不需要本人签名

- 准备采用的递送方式（若已决定）

## 从开始到拿到结果

1. **系统核对并处理**　分开无需签、待本人签、已签和锁定可递送的版本，不用一张签名图替代实际步骤。

2. **交付与接续**　交回当前精确状态及下一步；未签或版本已改时不沿用旧的可递送结论。

::screen{#document-materials-signature-delivery-version-05 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-05",
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
     "text_ref": "1. signature.required=false 保持“已生成”，不伪造“本人已签”；通过其他检查后仍可进入可递送。",
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
     "text_ref": "1. signature.required=false 保持“已生成”，不伪造“本人已签”；通过其他检查后仍可进入可递送。",
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

**10 月 11 日核对源码**　已能核对签署人、签名资产来源与 DOCX 同图哈希，协议每方各有独立签署位；PDF 仍只有图像对象数量检查，签名最终可见性仍需逐页核对。本次没有运行测试或真实签名。

## 关键规则与设计选择

1. signature.required=false 保持“已生成”，不伪造“本人已签”；通过其他检查后仍可进入可递送。

2. required=true 必须签名配置里的姓名与请求的签署人完全一致，并封存配置和签名图快照。

3. 协议至少两方，签署人只对上其中一方；每方都有签字（盖章）和日期位置，只嵌入本人一方的签名和文书日期，其他方留空。本人不需要签名时，各方空签署位照样保留——这是协议本身的签署位，不是伪造的占位签名。

4. DOCX 要求找到精确签名图 SHA-256；PDF 当前仅要求至少有 1 个图像对象，没有把该对象与签名资产、最终位置或可见性绑定。

5. 本地签名不证明对方签名、递送、收到或处理；外部递送仍需明确对象、版本、渠道和动作授权。

## 当前怎样实现

- 签名配置与图片必须是普通可读文件，签名图按配置所在目录解析。

- 构建封存签名配置与签名图，并重算快照大小和 SHA-256；这种内容摘要不是密码学签名。

- 通用输入结构没有手印字段，不能据此说通用协议支持手印。

::screen{#document-materials-signature-delivery-version-06 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-06",
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
     "text_ref": "- DOCX 对内嵌媒体做完整 SHA-256 匹配；PDF 只合计每页图像数，要求至少 1，不检查它是否就是签名或是否实际可见。",
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
     "text_ref": "- DOCX 对内嵌媒体做完整 SHA-256 匹配；PDF 只合计每页图像数，要求至少 1，不检查它是否就是签名或是否实际可见。",
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

- DOCX 对内嵌媒体做完整 SHA-256 匹配；PDF 只合计每页图像数，要求至少 1，不检查它是否就是签名或是否实际可见。

- 备用 PDF 按签名原图宽高比放置、过宽等比缩小，每方签署块不跨页拆开；这是实现，不是看过所有真实签署页的证据。

- 渲染页的墨迹覆盖和边缘暗度检查不识别签名位置、遮挡或可读性。

- 构建状态为“已生成”或“本人已签”；材料包只把递送状态改为“已具备递送条件”，并固定“未递送”。

::screen{#document-materials-signature-delivery-version-07 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-07",
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
     "text_ref": "1. 读取签名要求",
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
     "text_ref": "1. 读取签名要求",
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

## 执行流程

1. 读取签名要求

2. 核对签名配置与签署人；协议核对各方与本人一方

3. 验证签名图片

4. 生成 DOCX/PDF，协议写出每方签署位

5. 匹配 DOCX 签名图并统计 PDF 图像对象

6. 封存签名快照

7. 完成当前机械逐页审计

8. 形成可递送材料包并说明签名可见性证据边界

::screen{#document-materials-signature-delivery-version-08 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-08",
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
| produced（已生成） | 文书已生成和核对，但没有声明本人签名已固定。 |
| signed（本人已签） | 本地成品包含核对过的本人签名资产；不表示其他人签名或外部动作。 |
| ready_for_delivery（可递送） | 确切版本、接收对象、渠道、附件和指纹已锁定，delivered仍为false。 |
| Signature asset（签名资产） | 受profile管理并以SHA-256绑定的签名图片；不是证书签名或可信时间戳。 |

## 专业定义

签名是一个独立制作步骤：需要时核对规范 profile 和图片 hash（内容指纹），不需要时明确保持 produced（已生成）；两种情况都要经过完整审计才能进入 ready_for_delivery（已具备递送条件）。

::screen{#document-materials-signature-delivery-version-09 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-09",
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
     "text_ref": "- 不生成占位签名；协议的空签署位不是占位签名",
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
     "text_ref": "- 不生成占位签名；协议的空签署位不是占位签名",
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

解决错签、漏签、签到对方位置、占位签名、无需签名却标已签和把可递送误报成已发送。

## 边界

- 不生成占位签名；协议的空签署位不是占位签名

- PDF 图像对象计数不证明签名身份、位置或最终可见性

- 不把图片哈希称为密码学签名

- 不把本人签名称为对方签回

- 不把可递送称为已递送

- 不自动执行外部动作

## 失败与恢复

- **签名配置姓名与请求不一致**：构建前失败，不选择其他签名图片。

- **协议方数不足或本人对上不止一方**：构建前失败。

::screen{#document-materials-signature-delivery-version-10 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-10",
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
     "text_ref": "- **签名图片不可读或越出配置目录**：停止签名步骤，保留请求和旧版本。",
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
     "text_ref": "- **签名图片不可读或越出配置目录**：停止签名步骤，保留请求和旧版本。",
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

- **签名图片不可读或越出配置目录**：停止签名步骤，保留请求和旧版本。

- **DOCX 没有匹配签名图，或 PDF 图像对象为 0**：当前机械检查失败，不形成材料包；PDF 对象数大于 0 也不能反向证明签名可见。

- **PDF 有图片但签名位置或可见性尚未核实**：保留渲染页供核对，明确签名视觉证据仍未闭合；现行命令行没有专门识别这一缺口的自动检查。

- **无需签名**：明确保持“已生成”；单方文书不加签名线，协议保留各方空签署位；通过审计后仍可进入可递送，但不写“已签”。

::screen{#document-materials-signature-delivery-version-11 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-11",
  "section": "tech",
  "title": "依据与来源（一）",
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- PRIVATE source · formal_documents.py　签名配置、签名图封存、协议各方签署位与状态",
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
     "text_ref": "- PRIVATE source · formal_documents.py　签名配置、签名图封存、协议各方签署位与状态",
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

- PRIVATE source · formal_documents.py　签名配置、签名图封存、协议各方签署位与状态

- PRIVATE source · signature helpers　签名图片嵌入和规范路径

- PRIVATE tests · signature/readback　签署人、图片哈希、协议签署位、已生成／已签／可递送回归

## 如何验证

- 签署人不匹配和直接注入图片路径均失败。

- 签名配置和签名图快照被纳入 v3 闭包。

- 合成签名测试核对 DOCX 签名图已验证与 PDF 图像数至少 1；这只证明当前机械条件，不证明 PDF 签名像素、身份或位置正确。

- 无需签名的单方文书保持“已生成”且不含签名线；无需签名的协议保留各方空签署位。

::screen{#document-materials-signature-delivery-version-12 section="tech"}

```typeset
{
 "screen": {
  "id": "document-materials-signature-delivery-version-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 逐页验收与材料包",
    "href": "/projects/document-materials/page-audit-release/"
   },
   {
    "text": "下一个模块 现实回读与恢复",
    "href": "/projects/document-materials/reality-readback-recovery/"
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
     "text_ref": "- 渲染器不可用的回归保持不可递送且不生成材料包。",
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
     "text_ref": "- 渲染器不可用的回归保持不可递送且不生成材料包。",
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

- 渲染器不可用的回归保持不可递送且不生成材料包。

- 测试文件现有 28 个函数、39 个用例（10 月 11 日静态计数，本次没有运行）；真实签名和外部递送端到端验证本次没有运行。

## 与其他模块的关系

本模块只负责本地签名和递送版本；递送之后的现实状态必须进入下一模块回读。
