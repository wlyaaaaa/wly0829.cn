---
{
 "title": "补充参考与私有恢复",
 "kind": "project",
 "url": "/projects/personal-expression/corpus-extension-and-private-recovery/",
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
  "page": "personal-expression-corpus-extension-and-private-recovery",
  "kind": "project",
  "title": "补充参考与私有恢复",
  "url": "/projects/personal-expression/corpus-extension-and-private-recovery/",
  "parent": "personal-expression"
 },
 "source": {
  "page": "sources/pages/personal-expression-corpus-extension-and-private-recovery/page.json",
  "sha256": "af99ab0c753a0123e411982e8c5402da31f87f793a313fe1cf847d8f49c680d6",
  "converted_at_beijing": "2026-10-31T12:46:16+08:00"
 }
}
---

::screen{#personal-expression-corpus-extension-and-private-recovery-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-01",
  "section": "top",
  "title": "补充参考与私有恢复",
  "links": [
   {
    "text": "回到项目 → 个人表达",
    "href": "/projects/personal-expression/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-expression/#ai-brief"
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
     "text_ref": "补充参考与私有恢复",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人表达〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "参考资料可以随真实需求继续生长，已经保存的教训也有明确的版本来源和恢复方法。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有补充参考、读取私有版本的入口，校验时还会把四份日常资料和最近一次提交的私有快照逐份对比。主动补读、实际还原与应用效果仍需分别验收。",
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
     "text_ref": "补充参考与私有恢复",
     "align": "left",
     "size": "large"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人表达〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "参考资料可以随真实需求继续生长，已经保存的教训也有明确的版本来源和恢复方法。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有补充参考、读取私有版本的入口，校验时还会把四份日常资料和最近一次提交的私有快照逐份对比。主动补读、实际还原与应用效果仍需分别验收。"
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
   "asset": "_library/illustrations/modules/personal-expression/corpus-extension-and-private-recovery/corpus-extension-and-private-recovery-v01.png",
   "key": "main-personal-expression",
   "source_phrase": "右上一幅水彩插画：左边一个对话气泡，里面一团乱线从左往右慢慢理成一条平直的绿线；中间一本翻开的小册子，夹着几枚绿色书签；右边一支钢笔搁在一张便签上，便签上方悬着三个空白的小标签牌，其中一个是亮绿色。",
   "sha256": "44de63b7ff67d3127aaca6f015a8bbb93d725d9732f0c5da62d598bd50acf5f8",
   "status": "ready"
  }
 ]
}
```

# 补充参考与私有恢复

〔回到项目 → 个人表达〕　〔复制 AI 续作说明〕

个人表达与沟通支持 · 功能说明 · 已存档：10 月 31 日起项目不再维护，下面是存档前的样子

参考资料可以随真实需求继续生长，已经保存的教训也有明确的版本来源和恢复方法。

**当前情况：**已有补充参考、读取私有版本的入口，校验时还会把四份日常资料和最近一次提交的私有快照逐份对比。主动补读、实际还原与应用效果仍需分别验收。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-expression-corpus-extension-and-private-recovery-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 固定的一批样本不可能覆盖所有新场景；直接搬入大量聊天又未必增加价值。另一方面，备份能打开不代表与日常目录一致，需要分清读备份、核对差异和真正还原。 举个实际例子 “这类回复可以参考以前的说法。"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 固定的一批样本不可能覆盖所有新场景；直接搬入大量聊天又未必增加价值。另一方面，备份能打开不代表与日常目录一致，需要分清读备份、核对差异和真正还原。 举个实际例子 “这类回复可以参考以前的说法。"
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

固定的一批样本不可能覆盖所有新场景；直接搬入大量聊天又未必增加价值。另一方面，备份能打开不代表与日常目录一致，需要分清读备份、核对差异和真正还原。

## 举个实际例子

“这类回复可以参考以前的说法。”当前 AI 自行选择有用的会话和窗口，近期可补新表达，历史可找缺少的说法；没有值得新增的内容也算有效结果。换机时则选择已有私有备份，先检查并按方向读取，确认合适后再把选定文件还原到目标目录。

## 最后我会得到什么

需要时得到有来源、能供普通读取使用的新增参考；需要恢复时有可选择的私有版本和读取入口。是否实际补入了内容、下次是否用到、恢复是否完整，要分别回读。

::screen{#personal-expression-corpus-extension-and-private-recovery-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-03",
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
     "text_ref": "正常完成时",
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
     "text_ref": "正常完成时",
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

## 正常完成时

当前 AI 完成有用途的选择、合并、资料校验和正常调用回读，再同步私有版本；恢复则核对所选版本与实际还原结果。

## 发现问题时

没有新增价值就不重复复制。校验发现日常资料和最近快照不一致时，会列出是哪份文件、哪些带引号的原话或记录不见了；不是有意删的就补回，有意删的在提交里写明。样本数相等不能替代内容一致。

## 资料不可用时

个人资料锁着时先停下，不读私人资料；主目录文件确实缺失时，才能在获准后明确选一个备份来读，程序不会自动换路径或还原。原件或所选备份不可读时，明确缺失范围，保留现有可用资料，不把目录不可用当成已经恢复。

::screen{#personal-expression-corpus-extension-and-private-recovery-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-04",
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
     "text_ref": "有新的真实参考场景，或要核对私有表达资料的备份与恢复。",
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
     "text_ref": "1. **系统核对并处理**　只补当前需要的样本与指南，核对结构，并和最近提交的私有快照对比；读取备份不会自动覆盖现行资料。",
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
     "text_ref": "有新的真实参考场景，或要核对私有表达资料的备份与恢复。"
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
     "text_ref": "1. **系统核对并处理**　只补当前需要的样本与指南，核对结构，并和最近提交的私有快照对比；读取备份不会自动覆盖现行资料。",
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

有新的真实参考场景，或要核对私有表达资料的备份与恢复。

## 需要准备什么

- 来源清楚的参考材料

- 使用方向与适用边界

- 仅恢复时才指定备份版本

## 从开始到拿到结果

1. **系统核对并处理**　只补当前需要的样本与指南，核对结构，并和最近提交的私有快照对比；读取备份不会自动覆盖现行资料。

2. **交付与接续**　交回可用参考或精确恢复状态；结构校验和快照一致都不等于实际表达效果已获本人认可。

::screen{#personal-expression-corpus-extension-and-private-recovery-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 补充流程与备份读取已具备，主动补读及恢复结果待真实验收 关键规则与设计选择 1 当前 AI 选择相关会话和时间窗口，不要求本人逐条挑样本或反复提供已知路径。 2 最近与"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 补充流程与备份读取已具备，主动补读及恢复结果待真实验收 关键规则与设计选择 1 当前 AI 选择相关会话和时间窗口，不要求本人逐条挑样本或反复提供已知路径。 2 最近与"
   },
   {
    "id": "module-technical-title",
    "text": "技术实现与依据"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 30 日"
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
     "text_ref": "1. 当前 AI 选择相关会话和时间窗口，不要求本人逐条挑样本或反复提供已知路径。",
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
     "text_ref": "1. 当前 AI 选择相关会话和时间窗口，不要求本人逐条挑样本或反复提供已知路径。",
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

补充流程、备份读取和快照比较已具备。10 月 21 日按本人要求实际补过一次：经微信直读读 9 月 26 日以后的会话，新增 33 条本人发出的文字样本；恢复结果仍待真实验收。截至来源 cde9496（北京 10/21 15:36），data-backup 被 66 次提交改动过（3b12a803 时是 51 次）。

## 关键规则与设计选择

1. 当前 AI 选择相关会话和时间窗口，不要求本人逐条挑样本或反复提供已知路径。

2. 最近与历史按用途和信息价值选择，不设近期必先或等旧样本完全失效才补充的门槛。

3. 保留账号、会话、时间和原消息定位；他人、引用与转发只作语境，不当作本人发言。

4. 日常只编辑 E 数据目录；data-backup/ 是私有版本快照，不是自动脱敏、全账号同步或第二个日常入口。

5. 现有 78 条样本（10 月 22 日数）的来源都是微信直读（wechat-direct）；这是目前的事实，不是永久只能走这一条路。本项目程序本身不访问微信。

## 当前怎样实现

- AGENTS.md 规定选会话、读上下文、确认作者与用途、保留出处、去重合并、校验、回读和备份；两项技能承接实际任务。

- DEFAULT_DATA_ROOT=E:\PersonalData\个人表达；--data-root 可选择已存在的其他目录，包括来源仓库的 data-backup/。相对路径按当前工作目录解析，可用明确的绝对路径。

- 备份包含四份：explain-to-me.md、reply-guide.md、reply-samples.jsonl、reply-contrasts.jsonl。

::screen{#personal-expression-corpus-extension-and-private-recovery-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-06",
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
     "text_ref": "- validate 先做结构校验，再读来源仓库最近已提交（HEAD）的四份快照，按归一化文本逐份比较现役文件：返回 backup=in_sync、pending 或 unavailable；有差异时 backup_pending 列出文件，带引号的原话不见了列在 removed_quotes，记录 ID 不见了列在 removed_records。它不核验语义或作者，也不复制、不自动选版本、不还原。",
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
     "text_ref": "- validate 先做结构校验，再读来源仓库最近已提交（HEAD）的四份快照，按归一化文本逐份比较现役文件：返回 backup=in_sync、pending 或 unavailable；有差异时 backup_pending 列出文件，带引号的原话不见了列在 removed_quotes，记录 ID 不见了列在 removed_records。它不核验语义或作者，也不复制、不自动选版本、不还原。",
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

- validate 先做结构校验，再读来源仓库最近已提交（HEAD）的四份快照，按归一化文本逐份比较现役文件：返回 backup=in_sync、pending 或 unavailable；有差异时 backup_pending 列出文件，带引号的原话不见了列在 removed_quotes，记录 ID 不见了列在 removed_records。它不核验语义或作者，也不复制、不自动选版本、不还原。

- 比较的边界：--data-root 指向来源仓库自己的 data-backup 时，只做结构校验，不和自身比；Git 或 HEAD 不可用时返回 backup=unavailable，不假报一致；read_contrasts 对缺失的对照文件返回空列表；10 月 20 日（85e3797）起，现役文件不见了而最近快照里还有时，比较会把该文件列为 pending，并把快照里的原话和记录 ID 都列为不见了，两边都没有的文件才跳过。它仍只比文本，不是完整恢复器。

## 执行流程

1. 先满足资料访问保护，再按用途选择相关会话与近期或历史窗口

2. 复用微信直读与所需原话上下文，判断哪些本人表达值得保留

3. 合并有价值参考并保留出处，无新增价值则不写入

4. 校验资料并和最近快照比较，按正常命令回读受影响内容，再同步私有快照

5. 需要恢复时选定版本、检查和还原到目标，最后回读实际结果

::screen{#personal-expression-corpus-extension-and-private-recovery-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-07",
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
| 按需补读 | 由当前任务决定会话与时间范围，读上下文后选有用表达；expression.py 本身不访问微信。 |
| 版本快照 | 私有 Git 中保存的四份资料版本，更新由当前 AI 在正常收口中完成，没有后台同步器。 |
| 快照比较 | validate 把现役文件和最近提交的快照按归一化文本比较：in_sync 一致、pending 有差异待核、unavailable 无法比较。 |
| 指定读取与真正恢复 | --data-root 只让程序读选定目录；真正恢复需要将选定版本还原到目标，再检查内容与正常读取结果。 |

## 专业定义

最近与历史微信都可按需补充；日常资料与备份版本各有明确位置，校验时自动对比两者。

::screen{#personal-expression-corpus-extension-and-private-recovery-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-08",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 不扫描整个账号，不新建后台监听或采集服务。",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 不扫描整个账号，不新建后台监听或采集服务。",
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

最近消息不天然代表长期变化，旧态度和旧承诺也不默认延续到现在。原件不可用时不猜出处；备份目录可读也不自动证明内容最新，要看快照比较的结果。

## 边界

- 不扫描整个账号，不新建后台监听或采集服务。

- 不复制完整微信数据库、解密配置或未选用的临时聊天资料。

- 表达效果后续只在真实问题和真实聊天中验收，不编造试写场景证明成熟。

- 网页只说明资料类别、路径、数量和边界，不转入私人样本或反馈正文。

## 失败与恢复

- **个人资料锁着**：读取器在读私人内容前停止，由主对话请本人验证；不改读备份绕过。

- **微信来源暂不可读或作者不确定**：说明缺口，不伪造样本来源；保留当前可用参考，重要归属影响结果时才问清。

- **主数据目录不存在**：读取失败返回 unavailable；可明确选择已有备份目录用 --data-root 读取，但程序不会自动替换路径或还原。

- **backup=pending**：核对 backup_pending、removed_quotes、removed_records 列出的差异；不是有意删的就补回，有意删除在提交里说明。数量相等不能证明一致。

::screen{#personal-expression-corpus-extension-and-private-recovery-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-09",
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
     "text_ref": "- **backup=unavailable**：Git 或最近快照读不到，说明这次没能比较，不当成一致。",
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
     "text_ref": "- **backup=unavailable**：Git 或最近快照读不到，说明这次没能比较，不当成一致。",
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

- **backup=unavailable**：Git 或最近快照读不到，说明这次没能比较，不当成一致。

- **对 in_sync 期望过高**：in_sync 只证明归一化文本口径下一致，不证明原始字节、原件真实性、完整微信库、实际还原、效果或长期使用；现役文件整份不见了会报 pending，但只能对照最近一次已提交的快照，快照之前就已删掉的内容发现不了。

::screen{#personal-expression-corpus-extension-and-private-recovery-10 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-expression-corpus-extension-and-private-recovery-10",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 反馈与教训",
    "href": "/projects/personal-expression/feedback-consolidation-and-lessons-sync/"
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
     "text_ref": "- **AGENTS.md / README.md**：近期历史补读、源归属及私有备份恢复语义。",
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
     "text_ref": "- **AGENTS.md / README.md**：近期历史补读、源归属及私有备份恢复语义。",
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

- **AGENTS.md / README.md**：近期历史补读、源归属及私有备份恢复语义。

- **expression.py / DEFAULT_DATA_ROOT / --data-root**：实际目录选择（默认 E:\PersonalData\个人表达）与只读边界。

- **expression.py / validate / compare_with_backup**：结构校验和与最近已提交快照的文本比较。

- **data-backup/**：已登记的私有版本资料目录，四份文件；原冻结页那次没有读取其中私人正文，2026-10-11 只做了结构与数量统计和归一化比较。

## 如何验证

- 虚构测试实际使用独立临时资料目录，验证读取器不依赖主数据目录或微信。这是历史用例，本次没有重跑；现在测试文件有 27 个测试定义（10 月 22 日数，新增覆盖现役对照文件缺失时的快照比较）。

- 后续真实任务主动完成补读、选入、合并、下次调用用上，以及真实动画拟回复，均保留待验状态。

## 与其他模块的关系

原始微信与媒体继续由微信项目负责；表达项目保存精选参考，Git 保存四份资料的版本，不建立第二个聊天库。
