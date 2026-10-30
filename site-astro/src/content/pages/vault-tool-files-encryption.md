---
{
 "title": "把明确文件装进库，先分清追加与替换",
 "kind": "project",
 "url": "/projects/vault-tool/files-encryption/",
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
  "page": "vault-tool-files-encryption",
  "kind": "project",
  "title": "把明确文件装进库，先分清追加与替换",
  "url": "/projects/vault-tool/files-encryption/",
  "parent": "vault-tool",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）核对，没有处理任何真实库。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  },
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  }
 },
 "source": {
  "page": "sources/pages/vault-tool-files-encryption/page.json",
  "sha256": "415c872b5ea2e496de0decc0da74b2155560453e754631cab02572175013564a",
  "converted_at_beijing": "2026-10-30T15:12:32+08:00"
 }
}
---

::screen{#vault-tool-files-encryption-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-01",
  "section": "top",
  "title": "把明确文件装进库，先分清追加与替换",
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
     "text_ref": "把明确文件装进库，先分清追加与替换",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）核对，没有处理任何真实库。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
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
     "text_ref": "我把一组明确文件交给工具，它把相对目录与内容放进同一个加密库。已有库时用终端菜单“添加文件”追加，新文件和本次打开的旧内容在内存里合并；直接 encrypt 和 AI 技能的加密都是新建或整体替换，不是追加。",
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
     "text_ref": "把明确文件装进库，先分清追加与替换",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日）核对，没有处理任何真实库。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
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
     "text_ref": "我把一组明确文件交给工具，它把相对目录与内容放进同一个加密库。已有库时用终端菜单“添加文件”追加，新文件和本次打开的旧内容在内存里合并；直接 encrypt 和 AI 技能的加密都是新建或整体替换，不是追加。"
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
   "asset": "_library/illustrations/modules/vault-tool-files-encryption-v01.png",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "96999bc55e06bfd2cc94f6e38944feb0ea9f51a1b845e05140475c638f331951",
   "status": "ready"
  }
 ]
}
```

# 把明确文件装进库，先分清追加与替换

〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕

vault-tool · 功能说明

我把一组明确文件交给工具，它把相对目录与内容放进同一个加密库。已有库时用终端菜单“添加文件”追加，新文件和本次打开的旧内容在内存里合并；直接 encrypt 和 AI 技能的加密都是新建或整体替换，不是追加。

**当前情况：**文件打包、追加及同名新版保留的机制没变，原件默认保留；这次只重读了源码，没有处理任何真实库。

项目源码：公开仓库

::screen{#vault-tool-files-encryption-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 “把文件放进去”不等于“原来的都还在”。直接重建 source/ 可能遗漏旧文件，错误的同名合并次序又会把刚准备的新版本换回旧版。产品需要先说明这两个不同问题，再执行加密。 举个实际例子 “给"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 “把文件放进去”不等于“原来的都还在”。直接重建 source/ 可能遗漏旧文件，错误的同名合并次序又会把刚准备的新版本换回旧版。产品需要先说明这两个不同问题，再执行加密。 举个实际例子 “给"
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

“把文件放进去”不等于“原来的都还在”。直接重建 source/ 可能遗漏旧文件，错误的同名合并次序又会把刚准备的新版本换回旧版。产品需要先说明这两个不同问题，再执行加密。

## 举个实际例子

“给原来的库加一份新清单，保留里面的附件；若暂存区已有新版同名清单，不要用旧库的版本把它盖回去。”入口先解开本次有权打开的旧内容，再按明确规则合并。

## 最后我会得到什么

得到一个 vault.enc 与实际处理结果；来源副本、source/ 暂存、合并后的内容和本次能保留的层次分别说明。不能仅凭新库存在就声称整份旧库都保留了。

::screen{#vault-tool-files-encryption-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-03",
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

范围明确，合并次序与内容核对正确，密文经过写入和读回验证；原件默认保留，明确选择的清理另报结果。

## 发现问题时

同名、新旧版本、另一层或写入结果无法保持时先说明，不悄悄丢文件。

## 入口不可用或证据不足时

没有文件、路径不可读或本人取消密码输入时停止本次操作，不把空库或取消当成完成。

::screen{#vault-tool-files-encryption-04 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-04",
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
     "text_ref": "已有库要追加，在本机终端运行 vault-tool，选菜单“加密 / 添加文件”，本人在本地输入凭据。AI 技能里的 Encrypt 只会把指定输入新建成一个独立的加密输出（本地确认两次密码、原件保留），没有“追加”模式；AI 可以帮我准备菜单步骤，但不会凭空开一个追加窗口。",
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
     "text_ref": "1. **先核对输入和库结构**　工具检查选定原件、目标库格式和追加或替换的影响；旧成员的同名关系要在本地解锁后才能确认。",
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
     "text_ref": "已有库要追加，在本机终端运行 vault-tool，选菜单“加密 / 添加文件”，本人在本地输入凭据。AI 技能里的 Encrypt 只会把指定输入新建成一个独立的加密输出（本地确认两次密码、原件保留），没有“追加”模式；AI 可以帮我准备菜单步骤，但不会凭空开一个追加窗口。"
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
     "text_ref": "1. **先核对输入和库结构**　工具检查选定原件、目标库格式和追加或替换的影响；旧成员的同名关系要在本地解锁后才能确认。",
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

已有库要追加，在本机终端运行 vault-tool，选菜单“加密 / 添加文件”，本人在本地输入凭据。AI 技能里的 Encrypt 只会把指定输入新建成一个独立的加密输出（本地确认两次密码、原件保留），没有“追加”模式；AI 可以帮我准备菜单步骤，但不会凭空开一个追加窗口。

## 需要准备什么

- 要加入的文件或目录

- 现有库或新库目标

- 追加、替换及同名文件的选择

- 需要解锁时本人在本地掌握的凭据

## 从开始到拿到结果

1. **先核对输入和库结构**　工具检查选定原件、目标库格式和追加或替换的影响；旧成员的同名关系要在本地解锁后才能确认。

2. **本地解锁并装入**　本人只在本机提供凭据，工具在内存中打开相应层，按“旧成员在前、新成员在后，同名以新版为准”合并后加密；其他打不开的层保持原密文。

3. **核对再交付**　读回新容器中的预期文件并报告成功或失败；原件默认仍在原处，清理要另行明确。

::screen{#vault-tool-files-encryption-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 打包、合并与同名新版优先已验证 关键规则与设计选择 1 已有库要追加时用菜单添加；encrypt 和启动脚本不会自动合并。 2 source/和复制前的原路径都默认保留"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 打包、合并与同名新版优先已验证 关键规则与设计选择 1 已有库要追加时用菜单添加；encrypt 和启动脚本不会自动合并。 2 source/和复制前的原路径都默认保留"
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
     "text_ref": "1. 已有库要追加时用菜单添加；encrypt、启动脚本和 AI 技能的 Encrypt 都不会自动合并。",
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
     "text_ref": "1. 已有库要追加时用菜单添加；encrypt、启动脚本和 AI 技能的 Encrypt 都不会自动合并。",
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

打包、合并与同名新版优先已实现；9 月 3 日的虚构样例验证保留原日期，本次未重新运行（源码 b884ab61，版本 2.3.1）

## 关键规则与设计选择

1. 已有库要追加时用菜单添加；encrypt、启动脚本和 AI 技能的 Encrypt 都不会自动合并。

2. source/ 和复制前的原路径都默认保留；--cleanup-source 只处理本次已归档且仍完全相符的文件，不清理新增、变化、占用、硬链接或无法确认的对象。

3. 菜单追加只修改当前解锁层，未解锁槽位保留密文字节；直接 encrypt 是另一种重建意图，已有目标要本人确认整体替换，不把一个密码可打开误认为整库所有层都已验证。

## 当前怎样实现

- BASE 取 vault_tool.py 所在目录；普通入口使用其 source/、默认库文件与日志路径，不随当前终端工作目录任意变化。

- 直接 encrypt 和菜单添加都用 `archive_explicit_inputs` 对明确输入做稳定快照：检查原路径、链接/重解析点、对象身份、大小、修改时间和 SHA-256，确认读取中没有变化，再按相对路径构造 gzip/tar（gzip 头时间固定为 0）。菜单新增的路径直接归档，没有先复制到 source/ 的步骤；`_make_tar` 只用于设置双密码等其他路径。

- add_files_mode 在内存中展开当前密码对应层，按原成员→新增成员次序合并，同名（忽略大小写比较）以新版为准，不把旧库内容先写进 source/；未解锁槽位保持原密文字节。

- encrypt_mode 只打包当前 source/；已有目标需本人确认整体替换，并留下独立的 `.replaced.<随机>.enc` 恢复副本。仓库附带的启动加密脚本先把 AddPath 复制进 source/，再调用直接 encrypt，不走菜单的合并步骤。

- 普通符号链接仍然拒绝；电脑配置项目（PCConfig）登记过、且实际指向相符的目录门牌（mount point/junction）可以作为输入。登记只在门开且指向相符时提供，关门或失败不登记占位目标。这不是自动加密全部私人目录。

::screen{#vault-tool-files-encryption-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-06",
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
     "text_ref": "- 候选密文先在内存中验证，再写同目录临时密文并刷新落盘，读回重新验证；提交前核对原目标未变，提交后再校验。失败与回滚分别报告。",
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
     "text_ref": "- 候选密文先在内存中验证，再写同目录临时密文并刷新落盘，读回重新验证；提交前核对原目标未变，提交后再校验。失败与回滚分别报告。",
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

- 候选密文先在内存中验证，再写同目录临时密文并刷新落盘，读回重新验证；提交前核对原目标未变，提交后再校验。失败与回滚分别报告。

- 默认保留 source/ 和原路径文件。只有 --cleanup-source 才清理本次快照；Windows 在同一个独占句柄里比较文件身份与 SHA-256 并执行逻辑删除，变化、链接、硬链接或无法核对的保留。无法取得这一保护的平台保留原件，不退回存在竞态的覆写删除。

## 执行流程

1. 固定文件与目录范围，区分保留原库、追加与整库替换。

2. 已有库追加时先由本人提供对应凭据，并说明只能打开相应层。

3. 在内存中按“旧成员在前、新成员在后”合并，同名以新版为准；本次明确的新路径直接归档。

4. 打包、压缩、加密并核对新容器可解回预期内容。

5. 核对密文写入和读回；默认保留原件，若明确选择清理，另报实际删除、保留与未确认项。

::screen{#vault-tool-files-encryption-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-07",
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
| source（明文暂存目录） | 入库前打包的工作目录，不能因为名字像来源就默认它是永不删除的原件库。 |
| merge（合并） | 把旧库本次打开的成员与新文件放在一起；不是恢复另一未打开层，也不是自动版本管理。 |
| round trip（加密再解密往返） | 对同一份明确输入比较取回内容，用于证明这一次容器处理与预期一致。 |

## 专业定义

保存哪几个文件、旧库是否合并、同名以谁为准，都在加密前说明。

::screen{#vault-tool-files-encryption-08 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-08",
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
     "text_ref": "- 任意文件类型可以作为字节入库，不代表任意文件都能在内存文本界面直接阅读。",
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
     "text_ref": "- 任意文件类型可以作为字节入库，不代表任意文件都能在内存文本界面直接阅读。",
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

- 任意文件类型可以作为字节入库，不代表任意文件都能在内存文本界面直接阅读。

- 没有后台目录监听、全盘扫描或自动上传；目录门牌兼容只是允许登记过的入口作为输入。

- 合并的旧库内容只在内存处理；内存合并不等于整个程序或操作系统没有其他内存副本。菜单追加不写终端日志，所以日志里没有记录不能说明没追加过。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| 准备区已有同名新版 | 按明确的新旧优先顺序保留预期版本，并用实际内容回归；不能只验证成员数量。 |
| 取消、没有输入或新库自检失败 | 返回未完成或失败，保留尚未成功提交时需要的原文与原库，不输出完成证据。 |
| 旧库可能含另一密码对应的层 | 菜单追加和 VAULT03 槽位改密保留未解锁槽位的密文字节，不声称已经打开它。共享密钥文件、容量或格式需要变化时生成新副本，不能静默覆盖未知层。 |

::screen{#vault-tool-files-encryption-09 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-files-encryption-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下载 synthetic-roundtrip.json",
    "href": "https://wly0829-img-media-shanghai.oss-cn-shanghai.aliyuncs.com/releases/2h-20261007-bird-atlas/media/vault-tool/synthetic-roundtrip.json"
   },
   {
    "text": "下一个模块 查看与提取",
    "href": "/projects/vault-tool/view-extract/"
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
     "text_ref": "- 文件枚举、相对路径打包、加密与引导式添加",
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
     "text_ref": "- 文件枚举、相对路径打包、加密与引导式添加",
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

- 文件枚举、相对路径打包、加密与引导式添加

- 本地终端与 AddPath 到直接 encrypt 的真实路线

- 虚构文件往返、追加与同名内容回归

- 2026-09-03 虚构文件实际算法验证原始 JSON；含很小的测试参数，不能作为真实资料配置建议

## 如何验证

- 来源独立审查分别读取了加密、合并和启动脚本，没有把这些入口混成一条。

- 2026-09-03 的虚构样例：3 个文件（61 + 47 + 2057 = 2165 字节）装进 65,536 字节的容器后实际取回，同名内容以新版为准；这次只重读了这份回执并核对指纹一致，没有重新运行。当前源码共有 145 个测试定义，这次没有运行。

- 没有对本人真实的暂存目录、库文件或私人文件执行这些操作，原件清理的真实验收也没有做。

## 与其他模块的关系

这里决定什么进入库；密码与格式模块解释怎样打开，查看与提取模块解释怎样使用，库维护模块解释后续重建及旧库。
