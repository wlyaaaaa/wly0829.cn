---
{
 "title": "远端保存同一份密文，和真正能恢复分开验",
 "kind": "project",
 "url": "/projects/vault-tool/private-backup/",
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
  "page": "vault-tool-private-backup",
  "kind": "project",
  "title": "远端保存同一份密文，和真正能恢复分开验",
  "url": "/projects/vault-tool/private-backup/",
  "parent": "vault-tool",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）与技能 10 月 2 日版本核对，16:31—16:33 只读查询私人目标的仓库元数据，没有读取或上传任何密文"
  },
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  }
 },
 "source": {
  "page": "sources/pages/vault-tool-private-backup/page.json",
  "sha256": "dede7230e03d99d197fd2eb8dabdd863b010cdf9ab332ebfb8b86aa6a3c80734",
  "converted_at_beijing": "2026-10-11T19:04:27+08:00"
 }
}
---

::screen{#vault-tool-private-backup-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-01",
  "section": "top",
  "title": "远端保存同一份密文，和真正能恢复分开验",
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
     "text_ref": "远端保存同一份密文，和真正能恢复分开验",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）与技能 10 月 2 日版本核对，16:31—16:33 只读查询私人目标的仓库元数据，没有读取或上传任何密文",
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
     "text_ref": "我可以把一份明确密文保存在自己的私人仓库，并让工具确认远端保存的正是那份字节。真正恢复时再用原密码、密钥文件和兼容环境打开；这两层分别给出结论，不用一次上传提示包办所有证明。",
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
     "text_ref": "远端保存同一份密文，和真正能恢复分开验",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）与技能 10 月 2 日版本核对，16:31—16:33 只读查询私人目标的仓库元数据，没有读取或上传任何密文"
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
     "text_ref": "我可以把一份明确密文保存在自己的私人仓库，并让工具确认远端保存的正是那份字节。真正恢复时再用原密码、密钥文件和兼容环境打开；这两层分别给出结论，不用一次上传提示包办所有证明。"
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
   "asset": "_library/illustrations/modules/vault-tool-private-backup-v01.png",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "ccaa257f453fcd424bf009000e525f92dc320809fa0294556150e102f1353ecd",
   "status": "ready"
  }
 ]
}
```

# 远端保存同一份密文，和真正能恢复分开验

〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕

vault-tool · 功能说明

我可以把一份明确密文保存在自己的私人仓库，并让工具确认远端保存的正是那份字节。真正恢复时再用原密码、密钥文件和兼容环境打开；这两层分别给出结论，不用一次上传提示包办所有证明。

**当前情况：**密文上传与远端字节核对接口有历史隔离验证；10 月 11 日只读确认私人目标仍是私有仓库、默认分支不变，远端最后一次推送是 7 月 27 日。这次没有写入或读回密文，真正解密恢复仍要另验。

项目源码：公开仓库

::screen{#vault-tool-private-backup-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 发布命令失败却仍打印成功，或只确认某个路径存在，都可能留下假的备份安心感。另一个“把远端 README 正文移进密文”的动作又会改变远端当前内容，需要与普通密文上传分开解释和确认。 举个实际例"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 发布命令失败却仍打印成功，或只确认某个路径存在，都可能留下假的备份安心感。另一个“把远端 README 正文移进密文”的动作又会改变远端当前内容，需要与普通密文上传分开解释和确认。 举个实际例"
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

发布命令失败却仍打印成功，或只确认某个路径存在，都可能留下假的备份安心感。另一个“把远端 README 正文移进密文”的动作又会改变远端当前内容，需要与普通密文上传分开解释和确认。

## 举个实际例子

普通备份：“把这份明确的 vault.enc 备份到我指定的私人路径，再读回来确认大小和哈希。”独立的正文保护：“我明确要把当前远端 README 的内容转成密文，先预演，密码我在本机确认。”后一句不是前一句默认附带的动作。

## 最后我会得到什么

普通上传与README保护都分别报告实际写入和远端回读。README保护还核对当前说明及密文字节，响应丢失时只回读原操作；仍不能确定就保留效果未知。字节一致不证明密码可恢复，也不表示旧历史已清除或既有保险库已合并。

::screen{#vault-tool-private-backup-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-03",
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

普通备份必须从私人目标读回同一份密文；单独保护远端说明时，也要核对当前说明与新密文。两者都不代表已经凭密码恢复原文。

## 发现问题时

目标或远端内容在操作中改变、写入结果不明或读回不符时，分别说清是否已经写入，不给笼统成功提示。

## 入口不可用或证据不足时

私人目标、权限或本人本地确认不成立时停止写入；预演和只读检查仍不算发布。

::screen{#vault-tool-private-backup-04 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-04",
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
     "text_ref": "在已接通本机 vault-workflow 的 AI 对话中明确要求“把这份密文备份到已核准的私人密文仓库”，或单独要求保护远端 README；两件事分别确认。",
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
     "text_ref": "1. **确认目标与动作**　现场核对仓库私有状态、默认分支、路径及本次究竟上传密文还是处理 README。",
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
     "text_ref": "在已接通本机 vault-workflow 的 AI 对话中明确要求“把这份密文备份到已核准的私人密文仓库”，或单独要求保护远端 README；两件事分别确认。"
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
     "text_ref": "1. **确认目标与动作**　现场核对仓库私有状态、默认分支、路径及本次究竟上传密文还是处理 README。",
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

在已接通本机 vault-workflow 的 AI 对话中明确要求“把这份密文备份到已核准的私人密文仓库”，或单独要求保护远端 README；两件事分别确认。

## 需要准备什么

- 要备份的密文或要保护的 README

- 已核准的私人目标和路径

- 本次只做哪一种动作

## 从开始到拿到结果

1. **确认目标与动作**　现场核对仓库私有状态、默认分支、路径及本次究竟上传密文还是处理 README。

2. **写入并远端读回**　按明确选择执行，然后从默认分支核对对应密文字节和分支；效果不明时停在未知。

3. **分开报告恢复条件**　字节一致只证明密文备份；真正取回内容还要密码、密钥文件和实际恢复演练。

::screen{#vault-tool-private-backup-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 上传与回读接口已验证；未操作私人远端 关键规则与设计选择 1 公开的是 vault-tool 工具仓库；Key 是独立私人密文目标，没有公开正文入口。 2 WhatIf"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 上传与回读接口已验证；未操作私人远端 关键规则与设计选择 1 公开的是 vault-tool 工具仓库；Key 是独立私人密文目标，没有公开正文入口。 2 WhatIf"
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
     "text_ref": "1. 公开的是 vault-tool 工具仓库；私人密文仓库是独立目标，没有公开正文入口。",
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
     "text_ref": "1. 公开的是 vault-tool 工具仓库；私人密文仓库是独立目标，没有公开正文入口。",
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

上传与回读接口有历史隔离验证；2026-10-11 只读确认私人目标为私有、默认分支一致，未写入、未读密文

## 关键规则与设计选择

1. 公开的是 vault-tool 工具仓库；私人密文仓库是独立目标，没有公开正文入口。

2. WhatIf（只读预演）只预演，不上传；VerifyRemote（远端核验）的树检查只证明路径存在。

3. README 保护改变当前版本而不重写历史，也不自动合并已有加密库。

## 当前怎样实现

- 仓库附带的发布脚本通过现有 gh（GitHub 命令行工具）使用 Contents API；先解析实际仓库私有状态与默认分支，检查明确输入、非空字节和许可扩展名（.enc/.age/.gpg，或明确允许的图片载体）。扩展名许可不是加密真实性证明。WhatIf 不写入，但会读取本地密文字节来计算待传指纹，不是“完全不读文件”。

- 更新已有路径需带当前文件 SHA；只有真实不存在（404）才按创建处理，权限或网络错误不能静默当成没有文件。PUT 的退出码和返回结构必须被核对，失败不能继续输出 Uploaded。

- 实际成功还需从默认分支读取目标 blob（Git 文件内容对象）身份，再读取 base64 编码字节，与本次上传同一缓冲区的长度和 SHA-256 比较；提交存在与当前分支路径一致分别核对。

- 远端响应和临时请求文件包含的是密文；对调用方只返回目标、提交和指纹等元数据，不打印密文大正文，也不建立计划任务。上传程序本身不克隆私人仓库；但现行技能允许一份只含密文和安全说明的受管本地副本，并不是全系统都没有本地副本。

- VerifyRemote（远端核验）的树路径检查仍只证明路径存在，safe_readme_present 不是正文安全证明。ProtectRemoteReadme 另按完整字节核验受管占位说明，不接受仅含标记；existing_stub_verified 不表示检验过已有密文或密码。

::screen{#vault-tool-private-backup-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-06",
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
     "text_ref": "- ProtectRemoteReadme 是独立精确动作：WhatIf（只读预演）不读正文、不取密码、不写远端；真实执行由本地辅助进程读取固定 source_head_sha 的 README，要求两次本地密码一致，打包单个 README 并自检。",
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
     "text_ref": "- ProtectRemoteReadme 是独立精确动作：WhatIf（只读预演）不读正文、不取密码、不写远端；真实执行由本地辅助进程读取固定 source_head_sha 的 README，要求两次本地密码一致，打包单个 README 并自检。",
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

- ProtectRemoteReadme 是独立精确动作：WhatIf（只读预演）不读正文、不取密码、不写远端；真实执行由本地辅助进程读取固定 source_head_sha 的 README，要求两次本地密码一致，打包单个 README 并自检。

- 正文保护写入前重新核对私有状态、固定 source_head_sha 的完整树和目标。截断树不能证明文件不存在；远端已有密文而 README 仍为普通正文时拒绝覆盖密文。非强制提交后回读分支头、README 与密文并比较 SHA-256；响应丢失只核对原结果，不盲重放，无法确定时 effect（外部现实动作）为 null。正常换行 Base64 及固定 blob 读取均受支持。

- 恢复还需要对应密码、密钥文件、容器版本与依赖。本地备份、远端密文、程序测试和真正打开原文是不同恢复证据。

## 执行流程

1. 明确普通密文备份，或另行明确远端 README 保护；不自动合并两种意图。

2. 现场解析目标、私有状态、默认分支和精确路径，必要时先预演。

3. 普通备份上传明确密文，再从默认分支读取 blob 字节和指纹。

4. README 保护在本地确认后处理固定来源，自检候选，非强制写入后回读 README、密文和分支；已经保护、实际写入和效果未知分别报告。

5. 分别交回写入、字节核对与仍未进行的密码恢复，不把三层合称都已验收。

::screen{#vault-tool-private-backup-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-07",
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
| PRIVATE（私有仓库） | 本次远端访问范围，必须由真实目标元数据确认；它不是来自文件名或 README 的自称。 |
| WhatIf（只预演） | 检查并说明计划动作，不上传、不替换远端正文，也不能作为已有备份证据。 |
| read-back（从目标重新读取） | 写入后重新取实际保存的内容并核对，区别于只相信发送请求前的本地字节。 |
| safe_readme_present（README 路径存在字段） | 现有名字容易误解；它只检查树路径，不证明正文安全或已经被替换。 |

## 专业定义

先确认私人目标，再上传和逐字节回读；密文还在，不代表解锁条件一定齐全。

::screen{#vault-tool-private-backup-08 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-08",
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
     "text_ref": "- 网站建设不授权向私人密文仓库写入虚构样例，所有发布接口测试均与真实远端隔离。",
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
     "text_ref": "- 网站建设不授权向私人密文仓库写入虚构样例，所有发布接口测试均与真实远端隔离。",
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

- 网站建设不授权向私人密文仓库写入虚构样例，所有发布接口测试均与真实远端隔离。

- 密文读回可证明字节一致，不能确认遗失的密码或密钥文件，也不能替代真实恢复演练。

- 不创建定时备份服务、公开分享链接、第二个远端或全历史改写流程。

- 不能用一个 README 保护结果推断整个仓库及全部历史都没有原文；这次没有读 README，不据路径存在或历史提交判断现在的历史都安全。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| 目标不是现场确认的私有仓库 | 拒绝密文发布；不会为了完成脚本而改变仓库可见性。 |
| 读取旧路径或 PUT 失败 | 保留明确错误，停止后续成功标记；非 404 错误不被当成新文件。 |
| 远端回读失败或字节不同 | 说明可能已写入但尚未完成验证，不把失败自动重试成多次未知提交。 |
| 正文保护被取消或远端版本变化 | 取消就不写，版本冲突不强推；固定来源与尚未执行的动作分别保留。 |

::screen{#vault-tool-private-backup-09 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-09",
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
     "text_ref": "- 私人密文上传与目标字节核对",
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
     "text_ref": "- 私人密文上传与目标字节核对",
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

- 私人密文上传与目标字节核对

- 人工准备、密文与恢复条件

- VerifyRemote（远端核验）、PublishVault、预演与结果适配

- 固定远端版本、两次本地确认与单提交正文保护

- 发布、读取与真实效果字段

- GitHub 官方文件对象读取合同；base64 字节与接口容量边界

## 如何验证

- 发布脚本已通过九类隔离 mock gh（模拟 GitHub 命令）验证：PUT 失败、非 404 错误、404 创建、正常回读、回读失败、字节不符、预演、非私人目标和扩展名拒绝（历史，这次没有重新运行；当前源码共有 145 个测试定义）。

- 工具源仓库自身曾 normal-push 并从真实 main 读回，但这不是向私人密文仓库上传的结果。

::screen{#vault-tool-private-backup-10 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-private-backup-10",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "GitHub REST API：文件内容与 blob",
    "href": "https://docs.github.com/en/rest/git/blobs#get-a-blob"
   },
   {
    "text": "上一个模块 AI 与本地入口",
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
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 私人密文仓库的 Git 记录里，密文文件有 4 次内容变更：北京时间 7 月 7 日、7 月 8 日、7 月 23 日和 7 月 27 日 04:06；最后一次推送是 7 月 27 日 23:16，之后同日两次提交没有改动密文文件，不能算成 6 个版本。Git 记录不自动证明当时做过远端字节回读、密码验证或恢复。",
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
     "text_ref": "- 私人密文仓库的 Git 记录里，密文文件有 4 次内容变更：北京时间 7 月 7 日、7 月 8 日、7 月 23 日和 7 月 27 日 04:06；最后一次推送是 7 月 27 日 23:16，之后同日两次提交没有改动密文文件，不能算成 6 个版本。Git 记录不自动证明当时做过远端字节回读、密码验证或恢复。",
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

- 私人密文仓库的 Git 记录里，密文文件有 4 次内容变更：北京时间 7 月 7 日、7 月 8 日、7 月 23 日和 7 月 27 日 04:06；最后一次推送是 7 月 27 日 23:16，之后同日两次提交没有改动密文文件，不能算成 6 个版本。Git 记录不自动证明当时做过远端字节回读、密码验证或恢复。

- 2026-10-11 16:31—16:33 只读查询：目标仍是私有仓库、默认分支 main，远端分支头与本地一致；只验证目标身份，没有读取密文或 README，也没有上传。

- 当前远端密文与本地字节是否一致、真实密码能否恢复、换机恢复都没有核对。

## 与其他模块的关系

本模块保存密文与解释远端材料保护；具体加密、密码和本机取回仍由前面的模块负责。实际使用例子：本人明确采用 VAULT03 与独立密码，把恢复材料分两处保管，分别解锁、互不替代，单边不能代表完整材料。这次没有读取真实密文、密码或恢复码，也没有试解密，现在两处材料是否仍齐全、能否恢复没有核对。它与 AI 工作区中的配置和记忆备份分别使用。
