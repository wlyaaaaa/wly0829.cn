---
{
 "title": "图片后面带一份密文，取回时核对的是密文",
 "kind": "project",
 "url": "/projects/vault-tool/image-carrier/",
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
  "page": "vault-tool-image-carrier",
  "kind": "project",
  "title": "图片后面带一份密文，取回时核对的是密文",
  "url": "/projects/vault-tool/image-carrier/",
  "parent": "vault-tool",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）核对；9 月 29 日起写入改为一律不覆盖已有文件。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  },
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  }
 },
 "source": {
  "page": "sources/pages/vault-tool-image-carrier/page.json",
  "sha256": "1ef58dca178e56c07f5087551e523adb75dec6e9ba6a6fbbe65282266494c484",
  "converted_at_beijing": "2026-10-30T15:12:32+08:00"
 }
}
---

::screen{#vault-tool-image-carrier-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-01",
  "section": "top",
  "title": "图片后面带一份密文，取回时核对的是密文",
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
     "text_ref": "图片后面带一份密文，取回时核对的是密文",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）核对；9 月 29 日起写入改为一律不覆盖已有文件。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
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
     "text_ref": "我可以让一个图片文件同时携带已有的加密库，之后用工具把密文原样取回。判断是否成功要比较提取后的密文，而不是只看图片仍能显示。现在不管是做载体还是取回，目标位置已有文件就直接拒绝，不会覆盖。",
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
     "text_ref": "图片后面带一份密文，取回时核对的是密文",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）核对；9 月 29 日起写入改为一律不覆盖已有文件。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
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
     "text_ref": "我可以让一个图片文件同时携带已有的加密库，之后用工具把密文原样取回。判断是否成功要比较提取后的密文，而不是只看图片仍能显示。现在不管是做载体还是取回，目标位置已有文件就直接拒绝，不会覆盖。"
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
   "asset": "_library/illustrations/modules/vault-tool-image-carrier-v01.png",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "2a56321e6b2117c12e115adac824fef442b00c3f84f87eee692d8c9e788c3aaf",
   "status": "ready"
  }
 ]
}
```

# 图片后面带一份密文，取回时核对的是密文

〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕

vault-tool · 功能说明

我可以让一个图片文件同时携带已有的加密库，之后用工具把密文原样取回。判断是否成功要比较提取后的密文，而不是只看图片仍能显示。现在不管是做载体还是取回，目标位置已有文件就直接拒绝，不会覆盖。

**当前情况：**在图片尾部携带和提取密文的功能在；9 月 29 日起输出一律不覆盖已有文件。平台重编码可能破坏载荷，图片能看不代表密文仍完整。

项目源码：公开仓库

::screen{#vault-tool-image-carrier-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 图片查看器可能忽略尾部字节，但分享平台可能重新编码整张图，把尾部丢掉。把“封面能打开”和“保险库仍完整”混成一件事，会让损坏的载体看起来一切正常。 举个实际例子 “把这份已经加密的文件放在这张"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 图片查看器可能忽略尾部字节，但分享平台可能重新编码整张图，把尾部丢掉。把“封面能打开”和“保险库仍完整”混成一件事，会让损坏的载体看起来一切正常。 举个实际例子 “把这份已经加密的文件放在这张"
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

图片查看器可能忽略尾部字节，但分享平台可能重新编码整张图，把尾部丢掉。把“封面能打开”和“保险库仍完整”混成一件事，会让损坏的载体看起来一切正常。

## 举个实际例子

“把这份已经加密的文件放在这张封面图片后面，再取出来确认没有改变。”工具建立载体并提取，比较密文大小与哈希；如果准备经过会压缩图片的平台，先明确这种传递方式不保证保留载荷。

## 最后我会得到什么

得到携带密文的图片文件，以及提取后的 vault.recovered.enc 或本人指定路径；成功取回需要字节一致。没有重新提供密码时只能证明密文保留，不能证明里面内容已恢复。

::screen{#vault-tool-image-carrier-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-03",
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

密文被追加并可从完整载体中提取，取回字节与原密文一致。

## 发现问题时

图片重编码、转存或尾部长度异常时，外观可能仍正常，但提取失败或哈希不符。

## 入口不可用或证据不足时

不是带本工具标记的载体、文件不可读或目标不明确时停止，不猜图里藏了什么。

::screen{#vault-tool-image-carrier-04 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-04",
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
     "text_ref": "在本机 vault-tool 使用 hide，把已有密文与封面图片写成新的载体；取回时用 unhide 指定独立输出路径。也可以在已接通 vault-workflow 的 AI 对话里用技能的 Hide/Unhide，精确指定密文、载体和输出位置，这一步不需要密码。原密文和原封面都会保留，做完载体不代表可以清理它们。",
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
     "text_ref": "1. **选定已有密文和封面**　这是给密文加图片载体，先确认密文本身已生成且另有恢复条件。",
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
     "text_ref": "在本机 vault-tool 使用 hide，把已有密文与封面图片写成新的载体；取回时用 unhide 指定独立输出路径。也可以在已接通 vault-workflow 的 AI 对话里用技能的 Hide/Unhide，精确指定密文、载体和输出位置，这一步不需要密码。原密文和原封面都会保留，做完载体不代表可以清理它们。"
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
     "text_ref": "1. **选定已有密文和封面**　这是给密文加图片载体，先确认密文本身已生成且另有恢复条件。",
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

在本机 vault-tool 使用 hide，把已有密文与封面图片写成新的载体；取回时用 unhide 指定独立输出路径。也可以在已接通 vault-workflow 的 AI 对话里用技能的 Hide/Unhide，精确指定密文、载体和输出位置，这一步不需要密码。原密文和原封面都会保留，做完载体不代表可以清理它们。

## 需要准备什么

- 已有密文和封面图片

- 新载体及提取文件的保存位置（必须是还不存在的文件）

## 从开始到拿到结果

1. **选定已有密文和封面**　这是给密文加图片载体，先确认密文本身已生成且另有恢复条件。

2. **写入并取回**　工具把密文附在图片字节后，再从载体提取到独立文件；目标已存在就停下。

3. **比较密文字节**　核对原密文与提取物完全相同；图片能打开不等于密文可恢复，重编码也可能破坏尾部。

::screen{#vault-tool-image-carrier-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 图片尾部追加与密文提取已实现 关键规则与设计选择 1 这里是文件尾部封装，不是像素级隐写，也不增加一道加密。 2 传递原文件与发送经过图片压缩的照片不同。 3 应保留独"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 图片尾部追加与密文提取已实现 关键规则与设计选择 1 这里是文件尾部封装，不是像素级隐写，也不增加一道加密。 2 传递原文件与发送经过图片压缩的照片不同。 3 应保留独"
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
     "text_ref": "1. 这里是文件尾部封装，不是像素级隐写，也不增加一道加密。",
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
     "text_ref": "1. 这里是文件尾部封装，不是像素级隐写，也不增加一道加密。",
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

图片尾部追加与密文提取已实现；2026-09-29 起 hide/unhide 不覆盖任何已有输出（提交 015fb14），当前源码 b884ab61

## 关键规则与设计选择

1. 这里是文件尾部封装，不是像素级隐写，也不增加一道加密。

2. 传递原文件与发送经过图片压缩的照片不同。

3. 应保留独立密文副本和原封面，不能只靠封面显示正常判断恢复。

## 当前怎样实现

- hide_in_image 顺序写入封面原字节、密文、8 字节长度和尾标 VLTSTEG1；不解密密文、不修改像素或加入新的密码派生。

- extract_from_image 从文件末尾检查标记和长度，再截取对应载荷；标记错误或长度范围不成立时拒绝。

- 命令行 hide 默认用工具目录的默认库文件，--cover 选封面，--out 指定载体；unhide 默认输出为 vault.recovered.enc。两者都先检查输出目标，已有文件直接拒绝，不再询问是否覆盖；先写同目录私有候选、完整读回字节，再以不覆盖方式提交，失败清理候选。保护靠这一步，而不是靠默认文件名。

- AI 技能的 Hide 会取回候选并与原密文逐字节比较；Unhide 会检查提取物的容器结构再不覆盖发布（10 月 1 日修了候选路径冲突）。核心命令行的提取只检查尾标、长度和写回字节，不能说它同样自动证明内容可恢复。

- 扩展名、查看器能显示和实际图片格式有效是不同问题；实现没有对所有图片软件、社交平台或重编码器做兼容保证。

::screen{#vault-tool-image-carrier-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-06",
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
     "text_ref": "- 应对提取结果检查尺寸和 SHA-256，必要时再由本人用正确凭据实际打开；两步分别证明密文保全和内容可恢复。",
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
     "text_ref": "- 应对提取结果检查尺寸和 SHA-256，必要时再由本人用正确凭据实际打开；两步分别证明密文保全和内容可恢复。",
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

- 应对提取结果检查尺寸和 SHA-256，必要时再由本人用正确凭据实际打开；两步分别证明密文保全和内容可恢复。

## 执行流程

1. 明确已有密文、封面与输出路径（输出不能已存在）。

2. 把密文和长度标记追加到封面字节之后。

3. 用 unhide 提取到独立路径。

4. 比较原密文与取回密文的字节或哈希。

5. 如需确认内容恢复，再由本人本地提供对应凭据；不把图片外观当验收。

::screen{#vault-tool-image-carrier-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-07",
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
| carrier（文件载体） | 携带另一段数据的完整文件；这里靠保留文件尾部字节实现。 |
| steganography（隐写） | 本工具使用这个命名，但实现是图片尾部追加，不应让读者误以为修改像素或不可检测。 |
| re-encoding（重新编码） | 图片平台或软件重新生成图像字节，可能保留外观却删除追加密文。 |

## 专业定义

不改照片像素来藏字；用完整图片文件携带已有密文，并验证可原样取回。

::screen{#vault-tool-image-carrier-08 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-08",
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
     "text_ref": "- 没有证明所有 JPEG/PNG 查看器均接受载体，或所有平台传递后仍能恢复。",
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
     "text_ref": "- 没有证明所有 JPEG/PNG 查看器均接受载体，或所有平台传递后仍能恢复。",
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

- 没有证明所有 JPEG/PNG 查看器均接受载体，或所有平台传递后仍能恢复。

- 坏载体不能凭原来的图片外观补回丢失密文。

- 本功能不自动上传、分享或公开任何图片；隐写成功也不授权清理原密文或原封面。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| 只是普通封面，没有尾标 | 拒绝提取，不把任意尾部字节当成密文。 |
| 载体被截断或长度超出范围 | 报告载体不完整，保留原文件，不输出伪造恢复成功。 |
| 图片仍可显示但提取哈希不符 | 密文保全未通过，应回到独立原密文副本，而不是继续尝试猜密码。 |
| 输出位置已有文件 | 直接拒绝，已有载体或密文按字节保持原样；换一个新路径再做。 |

::screen{#vault-tool-image-carrier-09 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-image-carrier-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 双密码容器",
    "href": "/projects/vault-tool/dual-password/"
   },
   {
    "text": "下一个模块 AI 与本地入口",
    "href": "/projects/vault-tool/ai-local-interface/"
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
     "text_ref": "- hide_in_image、extract_from_image 与命令行参数",
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
     "text_ref": "- hide_in_image、extract_from_image 与命令行参数",
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

- hide_in_image、extract_from_image 与命令行参数

- 载体往返、普通封面与错误输入回归

## 如何验证

- 2026-09-03 的虚构载体为 65,619 B，取回的密文哈希与原 65,536 B 容器一致，普通封面被拒绝；这次只核对了回执文件，没有重新运行。

- 9 月 29 日新增回归 test_cli_hide_and_unhide_keep_existing_outputs_byte_for_byte，验证已有输出逐字节不变；当前源码共有 145 个测试定义，这次没有运行。

- 以上只证明原样文件的封装与提取，没有实际分享平台或图片重编码验收。

## 与其他模块的关系

这里保存和取回的是已经加密的字节；密码、内容查看和远端备份仍由各自模块承担。
