---
{
 "title": "只看要用的文字，必须取文件时再明确落盘",
 "kind": "project",
 "url": "/projects/vault-tool/view-extract/",
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
  "page": "vault-tool-view-extract",
  "kind": "project",
  "title": "只看要用的文字，必须取文件时再明确落盘",
  "url": "/projects/vault-tool/view-extract/",
  "parent": "vault-tool",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）核对；最近一次 AI 技能记录是 9 月 29 日，账本只统计到 10 月 10 日零点；只记技能名、不记结果，不能当使用证明",
   "last": {
    "label": "最近 AI 技能记录",
    "at": "2026-09-29 01:11"
   }
  },
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  }
 },
 "source": {
  "page": "sources/pages/vault-tool-view-extract/page.json",
  "sha256": "e3d0e7821c5374b84df138b57d084568aabc2252ce262bc8edd8e3f90c98d703",
  "converted_at_beijing": "2026-10-11T19:04:27+08:00"
 }
}
---

::screen{#vault-tool-view-extract-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-01",
  "section": "top",
  "title": "只看要用的文字，必须取文件时再明确落盘",
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
     "text_ref": "只看要用的文字，必须取文件时再明确落盘",
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
       "text": "偶尔用 · 最近 AI 技能记录 9 月 29 日 01:11",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）核对；最近一次 AI 技能记录是 9 月 29 日，账本只统计到 10 月 10 日零点；只记技能名、不记结果，不能当使用证明",
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
     "text_ref": "我不需要为了找一句话先解压整库。终端里能按文件名或内容搜索、显示支持的文本，并只把明确选中的文件提取出来交给外部程序；本地窗口 LocalView 则是从成员列表里选一项来看或复制。每一步都说明原文是在内存、剪贴板还是磁盘。",
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
     "text_ref": "只看要用的文字，必须取文件时再明确落盘",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 最近 AI 技能记录 9 月 29 日 01:11",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）核对；最近一次 AI 技能记录是 9 月 29 日，账本只统计到 10 月 10 日零点；只记技能名、不记结果，不能当使用证明"
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
     "text_ref": "我不需要为了找一句话先解压整库。终端里能按文件名或内容搜索、显示支持的文本，并只把明确选中的文件提取出来交给外部程序；本地窗口 LocalView 则是从成员列表里选一项来看或复制。每一步都说明原文是在内存、剪贴板还是磁盘。"
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
   "asset": "_library/illustrations/modules/vault-tool-view-extract-v01.png",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "139705701697f712ca9443a19a4322b7081f7ab4b086412bf906c85aebfb1f73",
   "status": "ready"
  }
 ]
}
```

# 只看要用的文字，必须取文件时再明确落盘

〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕

vault-tool · 功能说明

我不需要为了找一句话先解压整库。终端里能按文件名或内容搜索、显示支持的文本，并只把明确选中的文件提取出来交给外部程序；本地窗口 LocalView 则是从成员列表里选一项来看或复制。每一步都说明原文是在内存、剪贴板还是磁盘。

**当前情况：**本地文本查看、终端搜索和选择性提取都在；冲突不覆盖，部分导出与明文实际落盘分别报告。这次没有打开任何真实库。

项目源码：公开仓库

::screen{#vault-tool-view-extract-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 “解密了”没有说明内容去了哪里。临时提取文件可能在强杀后留下，复制到剪贴板的内容也不是原文缓冲区的一部分。把这些位置分清，才能决定本次查看需要哪条路线、结束后还剩什么。 举个实际例子 “找出清"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 “解密了”没有说明内容去了哪里。临时提取文件可能在强杀后留下，复制到剪贴板的内容也不是原文缓冲区的一部分。把这些位置分清，才能决定本次查看需要哪条路线、结束后还剩什么。 举个实际例子 “找出清"
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

“解密了”没有说明内容去了哪里。临时提取文件可能在强杀后留下，复制到剪贴板的内容也不是原文缓冲区的一部分。把这些位置分清，才能决定本次查看需要哪条路线、结束后还剩什么。

## 举个实际例子

“找出清单里写到打印机的那一段；然后只取出对应 PDF 给我打开。”先做文本内容搜索，PDF 则通过明确提取交给阅读器，而不是把 PDF 二进制硬显示成乱码。

## 最后我会得到什么

在本机看到真实文本或明确的文件列表；选择提取后得到 decrypted/ 内本次文件及清理说明。无法作为文本读取的成员会保留类型边界，不用替换字符假装读懂。

::screen{#vault-tool-view-extract-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-03",
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

支持的文本可显示和搜索，筛选提取只交付匹配文件；结束时说明相应缓冲区和目录处理结果。

## 发现问题时

冲突、部分导出、格式不支持、清理失败或进程中断时，分别列出已存在、已写入、冲突与保留范围；不覆盖同名文件，不用退出码代替内容完整性。

## 入口不可用或证据不足时

密码或密钥文件不匹配时不显示内容；来源不存在或格式损坏时不生成空白成功页。

::screen{#vault-tool-view-extract-04 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-04",
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
     "text_ref": "要搜索、按名称提取：在本机终端运行 vault-tool 打开库，普通关键字按文件名搜、`/关键字`按内容搜，`:copy 名字`复制第一个匹配的文本，选 [2] 后输入关键字只提取匹配的文件。只想看某一项：在已接通 vault-workflow 的 AI 对话中用 LocalView，本人仅在本地窗口解锁，从成员列表里选择显示或复制。AI 技能的 DecryptExport 会把本次打开的内容全部导出到指定目录，目前不能只导出某个成员。",
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
     "text_ref": "1. **只打开所需范围**　本人本地解锁后，在终端按名称或内容找目标，或在 LocalView 列表里选，不一次性导出整库。",
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
     "text_ref": "要搜索、按名称提取：在本机终端运行 vault-tool 打开库，普通关键字按文件名搜、`/关键字`按内容搜，`:copy 名字`复制第一个匹配的文本，选 [2] 后输入关键字只提取匹配的文件。只想看某一项：在已接通 vault-workflow 的 AI 对话中用 LocalView，本人仅在本地窗口解锁，从成员列表里选择显示或复制。AI 技能的 DecryptExport 会把本次打开的内容全部导出到指定目录，目前不能只导出某个成员。"
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
     "text_ref": "1. **只打开所需范围**　本人本地解锁后，在终端按名称或内容找目标，或在 LocalView 列表里选，不一次性导出整库。",
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

要搜索、按名称提取：在本机终端运行 vault-tool 打开库，普通关键字按文件名搜、`/关键字`按内容搜，`:copy 名字`复制第一个匹配的文本，选 [2] 后输入关键字只提取匹配的文件。只想看某一项：在已接通 vault-workflow 的 AI 对话中用 LocalView，本人仅在本地窗口解锁，从成员列表里选择显示或复制。AI 技能的 DecryptExport 会把本次打开的内容全部导出到指定目录，目前不能只导出某个成员。

## 需要准备什么

- 要查看的库和文字线索

- 若需提取文件，想要的文件名关键字和落盘位置

- 本人在本地窗口输入的解锁凭据

## 从开始到拿到结果

1. **只打开所需范围**　本人本地解锁后，在终端按名称或内容找目标，或在 LocalView 列表里选，不一次性导出整库。

2. **选择查看或提取**　支持的文本在本地界面阅读；外部程序必需的文件才在终端按名称筛选后提取。

3. **结束时核对残留**　区分内存、剪贴板与已提取文件；中断时报告实际残留，不能称自动清完。

::screen{#vault-tool-view-extract-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 查看、搜索与选择性提取已实现 关键规则与设计选择 1 内存查看不等于所有系统副本都无法恢复。 2 CLI（命令行工具） 文本显示受类型与 64 KiB 限制；外部附件应"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 查看、搜索与选择性提取已实现 关键规则与设计选择 1 内存查看不等于所有系统副本都无法恢复。 2 CLI（命令行工具） 文本显示受类型与 64 KiB 限制；外部附件应"
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
     "text_ref": "1. 内存查看不等于所有系统副本都无法恢复。",
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
     "text_ref": "1. 内存查看不等于所有系统副本都无法恢复。",
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

终端查看、搜索与选择性提取，以及 LocalView 列表查看已实现；9 月 3 日虚构样例保留原日期，本次未重新运行（源码 b884ab61，版本 2.3.1）

## 关键规则与设计选择

1. 内存查看不等于所有系统副本都无法恢复。

2. 终端文本显示受类型与 64 KiB 限制；LocalView 支持的文本总预算是 64 MiB，两者不是同一个上限。外部附件应明确提取。

3. 终端复制后的 20 秒清理需要当前进程存活；本地窗口的 15 秒规则是另一条实现，从最近一次复制算起，只清自己复制且仍在剪贴板里的内容，关窗时也清。

## 当前怎样实现

- decrypt_mode 的普通交互可选内存查看或磁盘提取；选择 [2] 后才有名称筛选。--no-disk 强制内存查看，--extract 则跳过筛选，把本次打开层的全部内容提取到工具的 decrypted/。_view_in_memory 按支持的文本扩展名和 64 KiB 限制显示。终端把明文打印到标准输出，只供本人不被模型捕获的本地终端阅读。

- 普通关键字筛文件名，/ 前缀进入文本内容搜索；:copy 使用首个名称匹配的可读文本，复制对象与多个匹配的边界要明确。

- 终端剪贴板清除由进程内守护线程等待 20 秒（CLIPBOARD_CLEAR_SECONDS）后执行，进程提前退出就不能保证该安排完成。

- LocalView 是成员下拉选择加显示/复制，没有终端那种名称/内容搜索框；AI 只拿到状态，不拿到原文。

- AI 技能的 DecryptExport 只接受明确的输出目录，当前参数里没有成员或筛选参数，会导出本次打开层的全部内容。

::screen{#vault-tool-view-extract-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-06",
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
     "text_ref": "- 提取按逐文件临时写入、长度和 SHA 核对、不覆盖提交。相同现有内容计 already_count，不同或并发新建同名目标计 conflict_count，不支持的成员单列；有冲突或不支持成员返回 partial，partial 仍可能已写出明文，完成数为 0 也不能推断没写过字节。归档成员数与声明解压总量受独立预算约束。",
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
     "text_ref": "- 提取按逐文件临时写入、长度和 SHA 核对、不覆盖提交。相同现有内容计 already_count，不同或并发新建同名目标计 conflict_count，不支持的成员单列；有冲突或不支持成员返回 partial，partial 仍可能已写出明文，完成数为 0 也不能推断没写过字节。归档成员数与声明解压总量受独立预算约束。",
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

- 提取按逐文件临时写入、长度和 SHA 核对、不覆盖提交。相同现有内容计 already_count，不同或并发新建同名目标计 conflict_count，不支持的成员单列；有冲突或不支持成员返回 partial，partial 仍可能已写出明文，完成数为 0 也不能推断没写过字节。归档成员数与声明解压总量受独立预算约束。

- 主明文缓冲区尽力 VirtualLock/mlock，结束时清零可变缓冲区并清屏；Python、tar 和界面仍可能产生其他副本。Ctrl+X 只在指定等待界面起作用。

- 终端里真正选择提取时，会先清掉已有的 decrypted/，结束时清理本次输出；强杀或断电可能留下明文。普通启动以及 info/doctor/assess/plan 这些诊断不清旧 decrypted/，旧残留需独立 clean-plaintext --confirm。清理前检查精确目标树，硬链接、符号链接、重解析点等不按普通暂存文件递归删除。

## 执行流程

1. 本人在本地提供所需凭据，实际打开相应内容。

2. 终端里用名称或内容搜索缩小要看的文本；LocalView 里从列表选择。

3. 只阅读、明确复制，或在终端按名称提取需要外部软件的文件。

4. 按内存、剪贴板和磁盘三种位置分别处理结束。

5. 意外中断时确认具体残留，不把下次清理能力冒充这次已经清理。

::screen{#vault-tool-view-extract-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-07",
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
| no-disk（不主动落盘查看） | 程序不主动把内容提取成原文文件；不保证解释器、系统或其他进程绝无副本。 |
| selective extraction（选择性提取） | 只把名称筛选命中的成员写到明确的提取目录，随后由外部程序使用。 |
| best effort（尽力处理） | 锁页、清零和某些退出清理只能在程序仍能执行相应步骤时完成，不是断电保证。 |

## 专业定义

文字先在本地内存里查看；图片、PDF 和附件按需取出，并说明清理条件。

::screen{#vault-tool-view-extract-08 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-08",
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
     "text_ref": "- 终端查看会输出明文，不应由 AI 捕获；LocalView/LocalEdit 的本地窗口才只给 AI 返回状态。不落盘与不进入模型是两条不同边界。",
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
     "text_ref": "- 终端查看会输出明文，不应由 AI 捕获；LocalView/LocalEdit 的本地窗口才只给 AI 返回状态。不落盘与不进入模型是两条不同边界。",
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

## 边界

- 终端查看会输出明文，不应由 AI 捕获；LocalView/LocalEdit 的本地窗口才只给 AI 返回状态。不落盘与不进入模型是两条不同边界。

- SSD 的覆写删除不保证物理介质上每个旧副本都被抹除。

- 没有实测强杀、断电或全部桌面程序的清理效果，就不能写成已经通过。本地窗口的查看操作不写终端日志，AI 技能账本也只记入口名、不记结果，所以最近有没有真正查看过，现有记录说明不了。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| 图片、PDF、二进制或超出显示限制的文本 | 说明不能在该文本入口完整显示，改由本人明确选择是否提取，不把部分文本当完整附件。 |
| 进程提前结束或断电 | 剪贴板计时和退出回调可能来不及执行；明文残留先定位，再用明确的清理入口处理。诊断不会自动删除，不能声称断电当场已清除。 |
| 暂存清理发现链接或删除失败 | 停止不适合的删除并报告具体范围，不顺着链接清别处文件。 |

::screen{#vault-tool-view-extract-09 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-view-extract-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 文件入库",
    "href": "/projects/vault-tool/files-encryption/"
   },
   {
    "text": "下一个模块 密码与格式",
    "href": "/projects/vault-tool/passwords-formats/"
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
     "text_ref": "- _view_in_memory、_extract_to_folder、锁页、剪贴板与清理",
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
     "text_ref": "- _view_in_memory、_extract_to_folder、锁页、剪贴板与清理",
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

- _view_in_memory、_extract_to_folder、锁页、剪贴板与清理

- 选择性提取、大小提示、清理与隔离剪贴板验证

- 与 CLI（命令行工具）区分的本地 GUI 剪贴板和内存说明

## 如何验证

- 2026-09-03 的虚构样例验证过：内存查看不创建 decrypted/，只筛选 ledger（追加式账本）时只提取对应的 47 字节 CSV，随后清理完成；这次只重读回执，没有重新运行。当前源码共有 145 个测试定义，这次没有运行。

- 测试替身只证明调用合同，不证明真实系统剪贴板计时已经完成。

- AI 技能账本里 vault-workflow 共 7 条记录，最近一条是 2026-09-29 01:11；账本只统计到 10 月 10 日零点，而且只记技能名，不记做了什么、成没成功，不能当作查看或提取的使用证明。

- 本轮不对真实原文、系统剪贴板内容、断电或强杀做验收。

## 与其他模块的关系

日常内容使用由本模块负责；本地窗口的文本编辑和它的结果状态在 AI 与本地入口模块，密码与依赖问题在密码与格式模块。
