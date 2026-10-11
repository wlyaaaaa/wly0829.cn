---
{
 "title": ".agents 工作树 E→G 热镜像与恢复",
 "kind": "project",
 "url": "/projects/agents/working-tree-hot-mirror/",
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
  "page": "agents-working-tree-hot-mirror",
  "kind": "project",
  "title": ".agents 工作树 E→G 热镜像与恢复",
  "url": "/projects/agents/working-tree-hot-mirror/",
  "parent": "agents",
  "status_line": {
   "state": "已退役",
   "as_of": "2026-10-11",
   "source": "按 2026-10-11 14:00（北京时间）的 .agents 源码核对：热镜像脚本、计划任务安装器和测试已于 2026-09-27 删除；历史实现取自删除前的 Git 记录"
  }
 },
 "source": {
  "page": "sources/pages/agents-working-tree-hot-mirror/page.json",
  "sha256": "2fb44f383eca74a266ca6874cd010c50113d95a41bccc5c59a7f5017f5dd64cf",
  "converted_at_beijing": "2026-10-11T18:59:05+08:00"
 }
}
---

::screen{#agents-working-tree-hot-mirror-01 section="top"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-01",
  "section": "top",
  "title": ".agents 工作树 E→G 热镜像与恢复",
  "links": [
   {
    "text": "回到项目 → AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/agents/#ai-brief"
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
     "text_ref": ".agents 工作树 E→G 热镜像与恢复",
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
       "text": "已退役",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 按 2026-10-11 14:00（北京时间）的 .agents 源码核对：热镜像脚本、计划任务安装器和测试已于 2026-09-27 删除；历史实现取自删除前的 Git 记录",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "这是一项已经退役的能力。它曾经把规则仓库里还没提交的文件，额外复制一份到 G 盘；现在这条复制线已经拆掉，不再提供。已提交的规则历史由私有 GitHub 仓库保存，整台机器的故障恢复由 PCConfig 的每日系统镜像负责。",
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
     "text_ref": ".agents 工作树 E→G 热镜像与恢复",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "已退役",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 按 2026-10-11 14:00（北京时间）的 .agents 源码核对：热镜像脚本、计划任务安装器和测试已于 2026-09-27 删除；历史实现取自删除前的 Git 记录"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "这是一项已经退役的能力。它曾经把规则仓库里还没提交的文件，额外复制一份到 G 盘；现在这条复制线已经拆掉，不再提供。已提交的规则历史由私有 GitHub 仓库保存，整台机器的故障恢复由 PCConfig 的每日系统镜像负责。"
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
   "asset": "_library/illustrations/modules/agents/working-tree-hot-mirror/working-tree-hot-mirror-v01.png",
   "key": "main-agents",
   "source_phrase": "右上一幅水彩插画：中间一本翻开的绿色封面规则册，书脊上一把小小的金色挂锁，书页右下角盖着一枚淡绿色圆形印章（印章里不写字）；规则册两侧各飘出一条绿色丝带，左边丝带连到一个圆角小窗口（窗口左上角画 Claude 的橙色星形标志），右边丝带连到另一个圆角小窗口（窗口左上角画 OpenAI 的黑色花结标志，代表 Codex）；两条丝带上各串着三四张很小的空白卡片（代表技能），窗口下方各有两三个更小的分身小窗口（代表子代理）。",
   "sha256": "430c735d3d357670d1b13cb64dd1a5f3c07d0c93ddb1fcca7d58dc5f849cee7e",
   "status": "ready"
  }
 ]
}
```

# .agents 工作树 E→G 热镜像与恢复

〔回到项目 → AI 规则与技能基座〕　〔复制 AI 续作说明〕

.agents · 功能说明

这是一项已经退役的能力。它曾经把规则仓库里还没提交的文件，额外复制一份到 G 盘；现在这条复制线已经拆掉，不再提供。已提交的规则历史由私有 GitHub 仓库保存，整台机器的故障恢复由 PCConfig 的每日系统镜像负责。

**当前情况：**不再提供。热镜像脚本、每日任务的安装器和对应测试已在 2026-09-27 从源码删除（这是清理残留的时间；这条镜像线早在 8 月初就已停用）。还没提交的修改，现在没有这项自动副本兜底。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#agents-working-tree-hot-mirror-02 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 私有代码仓库能找回已经提交的规则，但救不了还在写、没提交的修改。G 盘这份工作文件副本为故障恢复提供另一条线索；它只是某次复制的结果，不能当成当前规则或实时备份。 举个实际例子 遇到故障，我会"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 私有代码仓库能找回已经提交的规则，但救不了还在写、没提交的修改。G 盘这份工作文件副本为故障恢复提供另一条线索；它只是某次复制的结果，不能当成当前规则或实时备份。 举个实际例子 遇到故障，我会"
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

私有代码仓库只能找回已经提交的规则，救不了还在写、没提交的修改。这项能力当年就是为这一点补的一份 G 盘副本。它现在已经退役：读这页是为了知道它曾经做什么、为什么不能再指望它。

## 举个实际例子

遇到故障，我问：“我那批还没提交的规则修改还能找回吗？”现在 AI 会先从私有仓库取回已提交的历史，再说明：未提交的部分没有这条热镜像可用，只能看 PCConfig 的系统镜像那次实际备份到了什么；能不能找回，要按那次备份的回执说，不能保证。

## 最后我会得到什么

我会得到一个清楚的答复：已提交的部分从私有仓库恢复；未提交的部分这项能力已不再保护，能否找回取决于系统镜像，结论不确定时直接写“不确定”。旧的 G 盘镜像回执只算历史，不当作现在还有备份的证明。

::screen{#agents-working-tree-hot-mirror-03 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-03",
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

AI 不再运行这项镜像，也不把它当作恢复来源。已提交的规则从私有仓库取，机器层面的恢复看 PCConfig 系统镜像的当次回执。

## 发现问题时

如果有人照旧页去找“每天 20:30 的镜像”或旧脚本，AI 会说明它们已在 2026-09-27 删除，改从私有仓库和系统镜像两条现役来源核对，不重装旧任务。

## 入口不可用或证据不足时

未提交的文件在系统镜像里有没有、是哪一天的，没有当次回执就写“不确定”，不拿 G 盘旧镜像目录或 7 月的旧回执冒充最新备份。

::screen{#agents-working-tree-hot-mirror-04 section="usage"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-04",
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
     "text_ref": "这项能力已经退役，不能再调用。需要找回规则文件时，直接在 AI 对话里说要恢复什么，AI 会走下面的现役来源。",
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
     "text_ref": "1. **先取已提交历史**　AI 从私有 GitHub 仓库取回已提交的规则，这是最可靠的一层。",
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
     "text_ref": "这项能力已经退役，不能再调用。需要找回规则文件时，直接在 AI 对话里说要恢复什么，AI 会走下面的现役来源。"
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
     "text_ref": "1. **先取已提交历史**　AI 从私有 GitHub 仓库取回已提交的规则，这是最可靠的一层。",
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

这项能力已经退役，不能再调用。需要找回规则文件时，直接在 AI 对话里说要恢复什么，AI 会走下面的现役来源。

## 需要准备什么

- 故障前的大致时间

- 要找的规则文件或修改

- 私有仓库可访问；需要机器层恢复时，PCConfig 系统镜像可用

## 从开始到拿到结果

1. **先取已提交历史**　AI 从私有 GitHub 仓库取回已提交的规则，这是最可靠的一层。

2. **再查系统镜像**　未提交的文件，只看 PCConfig 每日系统镜像那次实际备份和回执，不再查已退役的 G 盘热镜像。

3. **如实交回**　交回能恢复的文件和找不回、说不准的部分；不重装已删除的镜像任务，也不保证未提交修改一定在。

::screen{#agents-working-tree-hot-mirror-05 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 可选热镜像源码与历史状态存在；受管任务当前无此入口，最新这份镜像覆盖未证 关键规则与设计选择 1 固定 source/destination 之外不允许 /MIR。 2"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 可选热镜像源码与历史状态存在；受管任务当前无此入口，最新这份镜像覆盖未证 关键规则与设计选择 1 固定 source/destination 之外不允许 /MIR。 2"
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
     "text_ref": "这里保留退役事实和旧实现的历史说明，方便以后查 Git 记录时看懂。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 现在不提供未提交文件的自动副本；已提交历史由私有 Git 保存，机器恢复由 PCConfig 系统镜像负责。",
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
     "text_ref": "这里保留退役事实和旧实现的历史说明，方便以后查 Git 记录时看懂。"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 现在不提供未提交文件的自动副本；已提交历史由私有 Git 保存，机器恢复由 PCConfig 系统镜像负责。",
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

这里保留退役事实和旧实现的历史说明，方便以后查 Git 记录时看懂。

已退役：2026-09-27 21:56（北京时间）提交 `337ca156` 删除了 `Sync-AgentsHotMirror.ps1`、隐藏启动脚本、计划任务安装器和测试；按 2026-10-11 14:00 的源码核对，三者都不存在。

## 关键规则与设计选择

1. 现在不提供未提交文件的自动副本；已提交历史由私有 Git 保存，机器恢复由 PCConfig 系统镜像负责。

2. 旧镜像回执、旧 G 盘目录只算历史，不能证明今天有备份，也不能从旧任务定义推出“下次 20:30 会跑”。

3. 不按旧安装器重建这项任务；要重新提供这类保护，须本人另提需求。

4. 下面“旧实现”只是历史说明：原地镜像没有上一代、没有原子切换、失败不回滚，这也是它不适合当可靠恢复层的原因之一。

5. 页面不把 9 月 27 日的清理时间说成首次停用时间；首次停用在 8 月初，按项目总览的原日期记。

## 当前怎样实现

现在没有对应实现。下面是删除前的旧实现，取自 `git show 337ca156^:tools/Sync-AgentsHotMirror.ps1`，只读历史、没有执行：

- 只接受固定源和目标：`E:\.agents` → `G:\80_Backup\ControlPlane\.agents`；先查 G 卷健康，再取全局互斥锁，最多等 30 分钟。

- 用 robocopy（Windows 自带的目录复制工具）/MIR 原地镜像，参数 /COPY:DAT、/DCOPY:DAT、/XJ、/R:2、/W:3、/MT:8；排除 .git、临时目录、pytest 缓存和附件；退出码 ≥8 算失败。

- 成功且不是只列清单时才写 status v1 回执；失败时旧回执可能还在，G 盘也可能已被改了一部分。

::screen{#agents-working-tree-hot-mirror-06 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-06",
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
     "text_ref": "- 可选的每日任务 AgentsHotMirror-Daily：每天 20:30、错过补跑、隐藏窗口、3 次 10 分钟重试、最长 2 小时、不唤醒电脑、不写 H 盘。安装器已删除。",
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
     "text_ref": "- 可选的每日任务 AgentsHotMirror-Daily：每天 20:30、错过补跑、隐藏窗口、3 次 10 分钟重试、最长 2 小时、不唤醒电脑、不写 H 盘。安装器已删除。",
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

- 可选的每日任务 AgentsHotMirror-Daily：每天 20:30、错过补跑、隐藏窗口、3 次 10 分钟重试、最长 2 小时、不唤醒电脑、不写 H 盘。安装器已删除。

## 执行流程

1. 需要找回规则时，先从私有 Git 取已提交历史。

2. 未提交文件只查 PCConfig 系统镜像的当次备份和回执。

3. 交回能恢复的范围和不确定项；不运行已删除的镜像入口。

::screen{#agents-working-tree-hot-mirror-07 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-07",
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
| 工作树热镜像（已退役） | 曾经把规则仓库当前文件和未提交修改复制到 G 盘的固定镜像；2026-09-27 源码已删除。 |
| 热镜像状态回执（历史） | 旧镜像每次成功后写的记录，含时间、提交号、未提交文件数；现在只算历史，不证明今天有备份。 |
| robocopy /MIR（目录镜像） | 让目标目录和源完全一致，会覆盖并删除多余文件；没有回滚，中途失败会留下一半变化。 |

## 专业定义

已提交的规则历史由私有 Git 保存；未提交的工作树现在没有这项自动副本。机器整体故障时，能恢复什么以 PCConfig 系统镜像的当次回执为准。

::screen{#agents-working-tree-hot-mirror-08 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-08",
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
     "text_ref": "这页现在要解决的是：别再把一条已经拆掉的备份线当成还在跑。读者、AI 或旧笔记提到“G 盘热镜像”时，先认出它已退役，再去现役来源找文件。"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 不重装、不运行已删除的镜像脚本和每日任务",
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
     "text_ref": "这页现在要解决的是：别再把一条已经拆掉的备份线当成还在跑。读者、AI 或旧笔记提到“G 盘热镜像”时，先认出它已退役，再去现役来源找文件。"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 不重装、不运行已删除的镜像脚本和每日任务",
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

这页现在要解决的是：别再把一条已经拆掉的备份线当成还在跑。读者、AI 或旧笔记提到“G 盘热镜像”时，先认出它已退役，再去现役来源找文件。

## 边界

- 不重装、不运行已删除的镜像脚本和每日任务

- 不把 G 盘旧镜像目录或旧回执当作当前备份

- 不从旧任务定义推算“下一次 20:30”

- 已提交规则以私有 Git 为准，机器恢复以 PCConfig 系统镜像为准

- 未提交修改能否找回，没有当次证据就写不确定

## 失败与恢复

| 情况 | 怎么办 |
| --- | --- |
| 有人照旧页要运行热镜像 | 说明已于 2026-09-27 删除，改走私有 Git 和系统镜像；不重建旧任务。 |

::screen{#agents-working-tree-hot-mirror-09 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-09",
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

| 情况 | 怎么办 |
| --- | --- |
| 需要找回未提交的规则修改 | 查 PCConfig 系统镜像那次备份；没有就如实说找不回或不确定。 |
| 发现 G 盘还留着旧镜像目录 | 只当历史材料，先核对时间和内容再决定是否参考，不直接覆盖回 E 盘。 |
| 旧回执和现在的规则冲突 | 以私有 Git 和活动规则版本为准，旧回执不参与判断。 |

::screen{#agents-working-tree-hot-mirror-10 section="tech"}

```typeset
{
 "screen": {
  "id": "agents-working-tree-hot-mirror-10",
  "section": "tech",
  "title": "依据与来源",
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
     "text_ref": "依据与来源",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 已提交规则：私有 GitHub 仓库的提交历史",
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
     "text_ref": "- 已提交规则：私有 GitHub 仓库的提交历史",
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

- 已提交规则：私有 GitHub 仓库的提交历史

- 机器层恢复：PCConfig 每日系统镜像及其当次回执

- 旧实现查阅：`git show 337ca156^:tools/Sync-AgentsHotMirror.ps1`（只读历史）

## 如何验证

- 退役核对：提交 `337ca156`（2026-09-27 21:56:51，北京时间）删除镜像脚本、隐藏启动脚本、安装器和测试；按 2026-10-11 14:00 的源码，三者都不存在。

- 历史记录：2026-09-08 曾做过一次零写入核对，G 卷健康、PCConfig 当时 89 个登记任务里没有这项任务（原观察 08:12:57Z，即北京 16:12:57）。这是历史，之后未重新核对。

- 历史回执：最后一次镜像在 2026-07-30（提交 c96dbf1，未提交文件 21 个）。这只是旧记录，不代表今天能恢复；本轮没有读取 G 盘旧回执原件，也没有检查旧文件能否恢复。

## 与其他模块的关系

已提交历史由私有仓库负责；机器备份由 PCConfig 负责。任务接续与完成判断模块现在不再把这份镜像当作可恢复层。
