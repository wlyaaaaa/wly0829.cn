---
{
 "title": "只查状态不打开内容，要读写就明确进入本地操作",
 "kind": "project",
 "url": "/projects/vault-tool/ai-local-interface/",
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
  "page": "vault-tool-ai-local-interface",
  "kind": "project",
  "title": "只查状态不打开内容，要读写就明确进入本地操作",
  "url": "/projects/vault-tool/ai-local-interface/",
  "parent": "vault-tool",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）与技能 10 月 2 日版本核对；最近一次 AI 技能记录是 9 月 29 日，账本只统计到 10 月 10 日零点；只记技能名、不记结果，不能当使用证明；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）",
   "last": {
    "label": "最近 AI 技能记录",
    "at": "2026-10-20 13:59"
   }
  },
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  }
 },
 "source": {
  "page": "sources/pages/vault-tool-ai-local-interface/page.json",
  "sha256": "364620df2a43d7802347cdae5d814af4488935b1fb0787395968fdcfb7962dff",
  "converted_at_beijing": "2026-10-23T08:44:37+08:00"
 }
}
---

::screen{#vault-tool-ai-local-interface-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-01",
  "section": "top",
  "title": "只查状态不打开内容，要读写就明确进入本地操作",
  "links": [
   {
    "text": "回到项目 → 本地加密库",
    "href": "/projects/vault-tool/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/vault-tool"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/vault-tool/#ai-brief"
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
     "text_ref": "只查状态不打开内容，要读写就明确进入本地操作",
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
       "text": "偶尔用 · 最近 AI 技能记录 10 月 20 日 13:59",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）与技能 10 月 2 日版本核对；最近一次 AI 技能记录是 9 月 29 日，账本只统计到 10 月 10 日零点；只记技能名、不记结果，不能当使用证明；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我可以让 AI 只检查格式、环境和下一步，而不让它看到原文。真正需要查看或改一段文本时，进入明确的本地图形流程，由我输入密码、选择密钥文件并确认保存；AI 得到的是实际做了什么、没做什么的状态。",
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
     "text_ref": "只查状态不打开内容，要读写就明确进入本地操作",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 最近 AI 技能记录 10 月 20 日 13:59",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）与技能 10 月 2 日版本核对；最近一次 AI 技能记录是 9 月 29 日，账本只统计到 10 月 10 日零点；只记技能名、不记结果，不能当使用证明；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "我可以让 AI 只检查格式、环境和下一步，而不让它看到原文。真正需要查看或改一段文本时，进入明确的本地图形流程，由我输入密码、选择密钥文件并确认保存；AI 得到的是实际做了什么、没做什么的状态。"
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
   "asset": "_library/illustrations/modules/vault-tool-ai-local-interface-v01.png",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "eb0fb6d33e2dc55ec3307a07d01c2b4f57a93ff319c47f619075e5e536ae9f36",
   "status": "ready"
  }
 ]
}
```

# 只查状态不打开内容，要读写就明确进入本地操作

〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕

vault-tool · 功能说明

我可以让 AI 只检查格式、环境和下一步，而不让它看到原文。真正需要查看或改一段文本时，进入明确的本地图形流程，由我输入密码、选择密钥文件并确认保存；AI 得到的是实际做了什么、没做什么的状态。

**当前情况：**只查状态与本地查看编辑已有隔离验证；密码由本人本地输入，真实私人库与桌面操作本轮未验收。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码

公开仓库

::screen{#vault-tool-ai-local-interface-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 一个命令叫“只提示”不代表它真的只提示，一个 JSON 的 ok=true 也不代表库健康。若检查、解密、编辑和上传混在同一标签里，人和调用程序都会判断错下一步。入口需要按真实效果说明，而不是"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 一个命令叫“只提示”不代表它真的只提示，一个 JSON 的 ok=true 也不代表库健康。若检查、解密、编辑和上传混在同一标签里，人和调用程序都会判断错下一步。入口需要按真实效果说明，而不是"
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

一个命令叫“只提示”不代表它真的只提示，一个 JSON 的 ok=true 也不代表库健康。若检查、解密、编辑和上传混在同一标签里，人和调用程序都会判断错下一步。入口需要按真实效果说明，而不是靠名字制造放心感。

## 举个实际例子

我可以分别说“只检查库有没有损坏，别打开内容”，或“我要在本地看并修改这份说明，密码我输入，其他文件别动”。前一种只走元数据；后一种要明确进入查看／编辑，并保留未编辑成员、密钥文件和原参数。

## 最后我会得到什么

只读路线交回结构、环境和建议；本地路线按实际动作报告取消、查看或保存，不把原文和密码发给 AI。若编辑无法保留原库内容就停止；写后自检与恢复都失败时，明确说明目标可能已经变化，并交回实际加密恢复副本。

::screen{#vault-tool-ai-local-interface-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-03",
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

只读请求只检查元数据；本地读写按实际效果报告，保存只改变选定支持文本并核对原成员。

## 发现问题时

损坏、缺依赖、不支持或超容量先停止；若写后回退也失败，保持失败终态和加密恢复副本，不再允许继续保存。

## 入口不可用或证据不足时

本地依赖缺失、本人取消、必要密钥文件未选或正确凭据未成立时停止对应操作，不换路径猜测解锁。

::screen{#vault-tool-ai-local-interface-04 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-04",
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
     "text_ref": "在已接通的 AI 对话中调用 vault-workflow，明确说“只检查”“只给建议”“本地查看”或“本地编辑”，并指定精确库；查看/编辑需本人操作本地窗口。",
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
     "text_ref": "1. **先选效果**　只读检查和建议不弹解锁框；查看或编辑才进入本机界面。",
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
     "text_ref": "在已接通的 AI 对话中调用 vault-workflow，明确说“只检查”“只给建议”“本地查看”或“本地编辑”，并指定精确库；查看/编辑需本人操作本地窗口。"
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
     "text_ref": "1. **先选效果**　只读检查和建议不弹解锁框；查看或编辑才进入本机界面。",
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

在已接通的 AI 对话中调用 vault-workflow，明确说“只检查”“只给建议”“本地查看”或“本地编辑”，并指定精确库；查看/编辑需本人操作本地窗口。

## 需要准备什么

- 精确库与这次只查、查看或编辑的选择

- 要查看或修改的文本成员

- 实际解锁时本人在本地输入凭据

## 从开始到拿到结果

1. **先选效果**　只读检查和建议不弹解锁框；查看或编辑才进入本机界面。

2. **只处理所选内容**　本人在本地解锁，只读取或修改可保真的明确文本成员；格式或容量无法保留时停止。

3. **核对动作状态**　AI 得到取消、查看、保存和自检状态，不取得原文或密码；失败不能写成已经保存。

::screen{#vault-tool-ai-local-interface-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 元数据、本地读写与失败状态已隔离验证 关键规则与设计选择 1 info、doctor、assess、plan的文本与JSON都只读；--vault-file绑定精确目标"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 元数据、本地读写与失败状态已隔离验证 关键规则与设计选择 1 info、doctor、assess、plan的文本与JSON都只读；--vault-file绑定精确目标"
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
     "text_ref": "1. info、doctor、assess、plan 的文本与 JSON 都只读；--vault-file 绑定精确目标。清理、解密、编辑与发布必须走各自明确操作，输出格式不改变副作用。",
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
     "text_ref": "1. info、doctor、assess、plan 的文本与 JSON 都只读；--vault-file 绑定精确目标。清理、解密、编辑与发布必须走各自明确操作，输出格式不改变副作用。",
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

元数据、本地读写与失败状态有 9 月 3 日隔离验证；2026-10-11 重读源码和技能，行为未变，本次未运行

## 关键规则与设计选择

1. info、doctor、assess、plan 的文本与 JSON 都只读；--vault-file 绑定精确目标。清理、解密、编辑与发布必须走各自明确操作，输出格式不改变副作用。

2. ok 表达检查调用是否完成时，不等于库可以解密；具体风险和 decision 仍要看。

3. 保留另一未知层可能限制编辑容量；容量不足不是让工具悄悄扔掉那一层的理由。

## 当前怎样实现

- _inspect_vault_structure 有界读取魔数、长度、参数和尺寸，并跳过密文区；它不调用密码派生或解密。collect_vault_info、collect_doctor_info、collect_vault_assessment、collect_vault_plan 构成直接 JSON 接口。

- info/doctor/assess/plan 的文本和 JSON 路径均不初始化普通日志、不清旧 decrypted/、不列私人文件名、不取密码或解密；--vault-file 只评估指定目标，不存在或损坏时不回退到工具目录的默认库文件。

- assess 给出风险和建议，plan 再给 decision；损坏格式或结构须进入 manual_review（需本人核对），不能因 source/ 存在就推荐加密覆盖。检查调用成功不等于库健康。

- Invoke-VaultWorkflow.ps1 是脚本适配入口，不是 HTTP API。调用方检查 ok、self_check 和明确的原文／解密效果字段；适配脚本退出 0 可能只是成功交回一份失败结果。

- 现行技能将 PromptOnly（仅本地提示）、LocalView（本地查看）和 LocalEdit（本地编辑）分开：提示只采集并丢弃输入；查看和编辑必须给精确的库文件，不再自动寻找私人密文仓库、旧的固定默认库目录或当前目录（旧默认目录已停用，也不回退）；核心命令行仍默认用工具目录的库文件。必要密钥文件先选再解密，Required（要求密钥文件）拒绝原本只有密码的库。

::screen{#vault-tool-ai-local-interface-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-06",
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
     "text_ref": "- 编辑须保留原 tar 成员、路径、类型、必要属性及未编辑二进制，严格处理受支持 UTF-8 文本；不能把整库替换解码后拼接，再只写一个 README.md。",
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
     "text_ref": "- 编辑须保留原 tar 成员、路径、类型、必要属性及未编辑二进制，严格处理受支持 UTF-8 文本；不能把整库替换解码后拼接，再只写一个 README.md。",
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

- 编辑须保留原 tar 成员、路径、类型、必要属性及未编辑二进制，严格处理受支持 UTF-8 文本；不能把整库替换解码后拼接，再只写一个 README.md。

- 保存维持原凭据与 KDF，保护未解锁槽位；压缩后的新归档超过原槽容量时拒绝且不替换原库。本地窗口的文本预算 64 MiB、归档成员最多 10,000 个、声明解压总量最多 4 GiB，都在展开成员和显示前检查。写前解密自检、暂存字节回读、原子替换与最终文件自检分别成立；若最终自检与回退都失败，保留加密恢复副本并锁定失败状态，不能再保存或被无变化操作洗成成功。

- GUI 的密码框 IME（输入法上下文）处理、复制后 15 秒及关闭清理属于本地实现，只清自己最新复制的内容，不承诺 Python/Tk 的所有内存副本都清零。密码、密钥文件与原文不进返回给 AI 的 JSON；result、saved、save_attempted、self_check 等字段按真实动作报告，取消和未保存关闭不是保存成功。

- credential-plan 只解释下一步和明确支持原地处理的范围（原槽改密、共享密钥文件变化、迁移和重建）；recovery-check --self-test 只用一次虚构的内存内容往返，不能认证真实库。命令行、本地窗口和技能共用归档、槽位、事务与资源预算原语；VerifyPassword 只是一次本地检查，不颁发可复用会话。

## 执行流程

1. 先分清仅检查、仅提示、本地查看还是本地编辑。

::screen{#vault-tool-ai-local-interface-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-07",
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
     "text_ref": "2. 只读路线读取结构和环境，给出风险与建议但不执行。",
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
     "text_ref": "2. 只读路线读取结构和环境，给出风险与建议但不执行。",
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

2. 只读路线读取结构和环境，给出风险与建议但不执行。

3. 本地路线明确目标，由本人先提供需要的密码和密钥文件。

4. 只查看支持文本，或只修改本人选定的支持成员；不能保留的格式／容量停止。

5. 按真实效果返回取消、解锁、查看、保存与自检状态，不返回原文或凭据。

::screen{#vault-tool-ai-local-interface-08 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-08",
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
| decision（下一步建议） | 根据已读取元数据形成的建议，不是动作授权，也不是已经执行的结果。 |
| PromptOnly（仅本地密码提示） | 提示动作需要与实际查看、解密和保存分开，不能仅靠旧模式名判断效果。 |
| member fidelity（成员保真） | 不改的文件和必要属性保留，只改变本次选中的受支持内容，不要求新密文与旧密文字节相同。 |

## 专业定义

AI 可以检查和解释；密码输入、内容查看与保存分别是明确的本地动作。

::screen{#vault-tool-ai-local-interface-09 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-09",
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
     "text_ref": "- 库元数据通过--vault-file选择精确文件；VaultRoot仍表示工具目录，不把工具位置当另一份库。恢复自测只用虚构口令和内存内容，不认证真实密码。",
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
     "text_ref": "- 库元数据通过--vault-file选择精确文件；VaultRoot仍表示工具目录，不把工具位置当另一份库。恢复自测只用虚构口令和内存内容，不认证真实密码。",
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

防止状态命名掩盖真实副作用，以及本地文本保存丢失未编辑成员、凭据或其他层。

## 边界

- 库元数据通过--vault-file选择精确文件；VaultRoot仍表示工具目录，不把工具位置当另一份库。恢复自测只用虚构口令和内存内容，不认证真实密码。

- GUI 替身与真实加密回归不能冒充本人已在真实桌面输入密码并完成验收。

- Skill、独立 vault-tool 与密码中心各有来源和作用域；修网页不授权读取真实库或改全局规则。

- 不因旧接口名字含 prompt 就藏掉现有读写功能，也不为修复增加服务、密钥托管或通用文档编辑器。

## 失败与恢复

- **结构损坏但 source/ 有文件**：返回损坏与需核对，不推荐直接加密来替换未知原库。

- **需要密钥文件却尚未选定**：在实际解密前完成所需选择，取消则明确取消；不能先用空 keyfile 失败后永远回不到选择步骤。

- **文本、格式或容量不能保真保存**：拒绝保存并保留原密文；明确是支持范围或容量问题，不输出已编辑成功。

- **返回 JSON 标明失败或效果未知**：调用方检查结构化状态，不用进程退出 0 或绿色文案替代。

::screen{#vault-tool-ai-local-interface-10 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-10",
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
     "text_ref": "- 严格元数据、风险、计划与实际命令分流",
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
     "text_ref": "- 严格元数据、风险、计划与实际命令分流",
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

- 严格元数据、风险、计划与实际命令分流

- 模式分发、字段验证与结果适配

- 本人本地输入、文本查看／编辑与结果状态

- 调用方应读取的效果与失败字段

- GUI 实现范围与不能冒充的身份／系统证据

## 如何验证

- 来源独立审查从现行代码重建了本地 GUI 这条轴，修复后产品与技术说明均保留。

- 2026-09-03：41 项隔离回归、独立虚构多成员／双槽／密钥文件／KDF 复验通过；回退失败后无变化及修改重试都不再发生写入。当前 test_vault_local_ui.py 仍是 41 个测试定义，另有 final_audit 24 个、operations 10 个、protect_remote_readme 5 个，这次都没有运行，不能合起来说同一次全部通过。

- 损坏库有／无 source 均选择 manual_review，实际 info --json 仍可退出 0 但库 ok=false；这是查询与库状态的区别。

::screen{#vault-tool-ai-local-interface-11 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-ai-local-interface-11",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 图片载体",
    "href": "/projects/vault-tool/image-carrier/"
   },
   {
    "text": "下一个模块 密文备份",
    "href": "/projects/vault-tool/private-backup/"
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
     "text_ref": "- AI 技能账本里 vault-workflow 共 7 条记录，最近一条 2026-09-29 01:11；账本只统计到 10 月 10 日零点，而且只记技能名，不记模式和结果。本地窗口的查看和编辑也不写终端日志，所以现有记录说明不了最近有没有在本地查看或编辑过。",
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
     "text_ref": "- AI 技能账本里 vault-workflow 共 7 条记录，最近一条 2026-09-29 01:11；账本只统计到 10 月 10 日零点，而且只记技能名，不记模式和结果。本地窗口的查看和编辑也不写终端日志，所以现有记录说明不了最近有没有在本地查看或编辑过。",
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

- AI 技能账本里 vault-workflow 共 7 条记录，最近一条 2026-09-29 01:11；账本只统计到 10 月 10 日零点，而且只记技能名，不记模式和结果。本地窗口的查看和编辑也不写终端日志，所以现有记录说明不了最近有没有在本地查看或编辑过。

- 本轮没有真实桌面密码输入、本人私人库或系统剪贴板验收，也没有调用 LocalEdit 预演；测试与真人使用不互相替代。

## 与其他模块的关系

这里解释人与 AI 怎样进入产品；密码与格式、文件查看和库维护解释具体内容行为；私人远端动作由密文备份模块单列。
