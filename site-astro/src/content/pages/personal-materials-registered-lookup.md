---
{
 "title": "先查已登记的非媒体原件，不先遍历文件目录",
 "kind": "project",
 "url": "/projects/personal-materials/registered-lookup/",
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
  "page": "personal-materials-registered-lookup",
  "kind": "project",
  "title": "先查已登记的非媒体原件，不先遍历文件目录",
  "url": "/projects/personal-materials/registered-lookup/",
  "parent": "personal-materials",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-22",
   "source": "10 月 22 日 06:47 计数入口正常返回（55 个来源、166 份登记、4 条关系、161 份有文字）；源码按 10 月 21 日版本（48b539d），本次没有跑测试、没有打开原件"
  },
  "status": "在用",
  "based_on": {
   "commit": "17efb2e02b775b924e7272b06dbb46475f04b0e2",
   "commit_time": "2026-10-06T13:07:15-05:00"
  },
  "public": false,
  "repo_url": null
 },
 "source": {
  "page": "sources/pages/personal-materials-registered-lookup/page.json",
  "sha256": "db4d3db83fb0fcafaa16c2a81907bdd73d67debbcb7be3f7857481ed29469624",
  "converted_at_beijing": "2026-10-23T14:53:35+08:00"
 }
}
---

::screen{#personal-materials-registered-lookup-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-01",
  "section": "top",
  "title": "先查已登记的非媒体原件，不先遍历文件目录",
  "links": [
   {
    "text": "回到项目 → 个人材料查找",
    "href": "/projects/personal-materials/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-materials/#ai-brief"
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
     "text_ref": "先查已登记的非媒体原件，不先遍历文件目录",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true,
     "subtitle_from": "不先遍历文件目录"
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
     "static_note": "截至 10 月 22 日 · 10 月 22 日 06:47 计数入口正常返回（55 个来源、166 份登记、4 条关系、161 份有文字）；源码按 10 月 21 日版本（48b539d），本次没有跑测试、没有打开原件",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人材料查找〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人材料查找 · 功能说明",
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
     "text_ref": "先查已登记的非媒体原件，不先遍历文件目录",
     "align": "left",
     "size": "large",
     "subtitle_from": "不先遍历文件目录"
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
     "static_note": "截至 10 月 22 日 · 10 月 22 日 06:47 计数入口正常返回（55 个来源、166 份登记、4 条关系、161 份有文字）；源码按 10 月 21 日版本（48b539d），本次没有跑测试、没有打开原件"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 个人材料查找〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人材料查找 · 功能说明"
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
   "asset": "_library/module-illustrations/personal-materials/registered-lookup-v01.png",
   "key": "main-personal-materials",
   "source_phrase": "右上一幅水彩插画：一个半开的木制文件柜抽屉，几页纸从里面微微探出；一只放大镜照在其中一页上，放大镜里那一行被绿色荧光笔划亮；这页纸右边一条绿色细虚线连到一个挂在纸角的小标签，标签上只画一个绿色对勾。",
   "sha256": "9bff548d3181037e481f7d61147aab370d9744836c8b837dd708832a7c9ca466",
   "status": "ready"
  }
 ]
}
```

# 先查已登记的非媒体原件，不先遍历文件目录

〔回到项目 → 个人材料查找〕　〔复制 AI 续作说明〕

个人材料查找 · 功能说明

绝大多数已接入材料不需要扫描目录：先从小索引拿到可区分候选，再决定是否验真打开。

**当前情况：**登记了 166 份原件，来自 55 个来源，其中 161 份有可搜的文字（10 月 22 日 06:47 计数）。10 月 11 日上午计数入口报过一次错，之后没有再出现，原因还没查清。登记状态不代表本轮逐件重新验证过原件。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-materials-registered-lookup-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-02",
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

同一材料可能有草稿、签字版、交付版、回执或完全相同的副本。只按文件名排序会把版本混在一起；直接公开路径又会在尚未选择时暴露不必要的私人位置。登记查找先把候选缩小，并保留来源原生差异。

## 举个实际例子

我说“找一下那份延保合同”，页面只给出几份能看出来源、日期和“草稿、签字版、回执”等角色的候选。两份内容完全相同可以标成重复，但桌面上有签字包，绝不等于平台已经收到。

## 最后我会得到什么

得到少量可比较候选和明确的登记搜索范围。候选还不是最终原件证明；选中后继续进入重新验真，零命中则说明哪些来源和材料记录确实被查询。

::screen{#personal-materials-registered-lookup-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-03",
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
     "text_ref": "有清晰登记候选时",
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
     "text_ref": "有清晰登记候选时",
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

## 有清晰登记候选时

从已登记材料交回少量能分清来源、日期和版本的候选；这一步还不是最终原件证明。

## 零命中或版本仍歧义时

只有旧文字或来源记录能提示候选时，明确证据较弱；本人已删除的文件不会作为可用候选。

## 登记索引不可读取时

索引不能安全读取时停止查找，不从陌生数据库猜答案。

**现在的局限**　166 份登记里有 161 份有可搜的文字，但只有 32 份是原件自带的完整文字，其余 129 份是部分文字（115 份提取、14 份扫描件认字），没覆盖到的段落仍可能搜不到；另有 5 份没有文字，只能靠标题、来源和版本对上（10 月 22 日数）。

::screen{#personal-materials-registered-lookup-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-04",
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
     "text_ref": "1. **系统核对并处理**　从登记记录和绑定文字里挑少量（通常 4 个以内）能区分版本、来源与状态的候选；候选不等于当前原件已验真。",
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
     "text_ref": "1. **系统核对并处理**　从登记记录和绑定文字里挑少量（通常 4 个以内）能区分版本、来源与状态的候选；候选不等于当前原件已验真。",
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

用自然话描述那份非媒体材料，先查已登记来源。

## 需要准备什么

- 标题、用途、日期或来源线索

- 可选的明确来源限定

## 从开始到拿到结果

1. **系统核对并处理**　从登记记录和绑定文字里挑少量（通常 4 个以内）能区分版本、来源与状态的候选；候选不等于当前原件已验真。

2. **交付与接续**　交回候选和实际搜索范围；零命中说明登记范围，选中后再进入验真。

**登记没对上，自动查清单**　登记里没有严格对上时（哪怕已有模糊候选），它会自动只读查一遍范围内登记文件夹每天记的文件名清单，不现场扫目录，配上的一并给出；蓝湖产品资料那一个文件夹要现场找，得明确说“再找一次”。

**有路径不等于读得到**　放在加密文件夹里的原件，登记的是“门牌”入口。门牌关着或指向不对，就说明卡在门牌，不当成文件没了。

**登记错了可以只撤一份**　不想再找到某一份时，只撤这一条登记，原件和来源都不动：先预演看清撤的是哪份、写明原因，确认后才真撤。这项已经做好，还在等真实使用验收。

**删了的不挡路**　我已经删掉的文件，查找时直接跳过、接着找真的还在的，不占候选名额；登记里那一条留到每天 17:10 的维护再去掉，查找本身从不改登记。

::screen{#personal-materials-registered-lookup-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-05",
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
     "text_ref": "1. 用户不用先回忆绝对路径或内部材料 ID，只需描述目标。",
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
     "text_ref": "1. 用户不用先回忆绝对路径或内部材料 ID，只需描述目标。",
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

**10 月 22 日 06:47 计数**　只返回计数的 status 入口正常：55 个来源、166 条精确登记、4 条关系、161 份有绑定文字（按不同 material_key 去重）；保存的打开状态 166 条都是 verified，这只是已保存的状态，不是本次逐件重算或打开过。10 月 11 日上午同一入口曾返回 materials_database_not_initialized，之后未复现，原因没有调查。

**历史测试记录**　2026-09-07 有 66 项合成回归与 Ruff 通过，9 月 28 日有 106 项通过，都是当时的回执，不覆盖后来新增的门牌和撤登记。当前测试文件 74 个测试函数、收集到 123 个用例（10 月 23 日 12:38 只收集计数，没有运行）。

## 关键规则与设计选择

1. 用户不用先回忆绝对路径或内部材料 ID，只需描述目标。

2. 登记候选与发现候选分开：已有定位优先，不为每次查询遍历文件系统。

3. 查找阶段本身表达证据强度：verified、未验证来源证据（来源／材料元数据、search_text 或绑定文字）和已知定位缺口不会混在同一个“已找到”标签里。

4. 完全相同字节、逻辑版本和来源原生关系分别表达，不把“相似”写成“同一份”。

5. 零命中自动携带已搜索与未搜索范围，不能被解释成其他设备或位置不存在。

6. 来源根可访问而已登记原件确切不存在时，查询只读跳过该 occurrence（出现记录），不把它作为 known_locator_gap 恢复候选；现有日常维护调用 sync-current，在事务重检后才退出该记录及级联文字／关系。

## 当前怎样实现

- 从 sources、materials、material_relations 和 material_text 读取登记事实；媒体历史行在查询前过滤。

- 先按 verified_locator 查找，确切缺失候选不占 limit；该阶段没有有效结果才回退 unverified_source_evidence，再回退已记录问题。不能因为一个已删文件挡住后面的真实原件。

::screen{#personal-materials-registered-lookup-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-06",
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
     "text_ref": "- 没有 verified 匹配时才查 open_state=unverified 的来源名、标题、原生 ID、版本字段、材料 search_text 与 material_text，并标为 unverified_source_evidence；即使没有 material_text，来源原生元数据仍可形成未验证候选。",
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
     "text_ref": "- 没有 verified 匹配时才查 open_state=unverified 的来源名、标题、原生 ID、版本字段、材料 search_text 与 material_text，并标为 unverified_source_evidence；即使没有 material_text，来源原生元数据仍可形成未验证候选。",
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

- 没有 verified 匹配时才查 open_state=unverified 的来源名、标题、原生 ID、版本字段、材料 search_text 与 material_text，并标为 unverified_source_evidence；即使没有 material_text，来源原生元数据仍可形成未验证候选。

- material_text 只接收 native、ocr（光学字符识别）或 extracted 三类可重建文字；目前（10 月 23 日）32 份 native 完整文字，115 份 extracted、14 份 ocr 部分文字；10 月 11 日时还没有 ocr。它们可以帮助召回，但不能替代当前原件验真。

- 查询文本去除常见请求词，并结合完整短语、拉丁词和中文二元片段计算有界匹配分。

- find 命令默认返回 5 个、允许 1–10 个；个人技能为减少选择成本固定请求最多 4 个。

- 已登记元数据没有严格匹配时（即使已有模糊候选），find 自动只读查询范围内全部目录的文件名清单，不现场扫目录；清单范围写在 search_scope.filename_index_search，主候选可直接包含发现 token。

- 候选卡提供来源、标题、容器、逻辑与版本身份、时间、指纹、大小、状态、精确重复次数和原生关系，但不包含 locator（原件定位记录）。不读原件正文（original_body_text_read=false）。

- 搜索范围记录已查非媒体材料数、来源样本、未搜索来源数和实际命中来源。

## 执行流程

1. 确认请求属于非媒体原件且没有可靠 locator（原件定位记录）；否则直接分流或绕过。

2. 把用户原话规范为搜索签名，不要求用户翻译成内部字段。

::screen{#personal-materials-registered-lookup-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-07",
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
     "text_ref": "3. 查询按 verified_locator → unverified_source_evidence → known_locator_gap 逐阶段返回仍可核对的候选，不写数据库或触发同步；候选数量上限只计算有效项。",
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
     "text_ref": "3. 查询按 verified_locator → unverified_source_evidence → known_locator_gap 逐阶段返回仍可核对的候选，不写数据库或触发同步；候选数量上限只计算有效项。",
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

3. 查询按 verified_locator → unverified_source_evidence → known_locator_gap 逐阶段返回仍可核对的候选，不写数据库或触发同步；候选数量上限只计算有效项。

4. 按分数、来源时间和稳定材料身份排序，只保留最多 4 个候选。

5. 返回候选、查找阶段、搜索范围与零命中说明；不在这一步打开原件。

**门牌**　位置存门牌入口路径；按门牌表最长前缀配对并核对门牌开着、是真目录联接、指向一致，不符返回 folder_door_closed_or_mismatched / folder_door_not_registered，门牌表本身无效返回 folder_door_registry_invalid。旧记录读出时才换成门牌，不批量改写。

**只读**　find、status、inventory 都不写库、不触发每天的同步；撤一份登记是单独的 unregister 命令，默认只预演，同样参数加 --apply 才真撤，只删这一条和它的可重建文字、关系。

**配对不用模型**　中文按相邻两个字切片：三个字以内要整段出现；更长的至少对上 2 片且找到六成，或对上 3 片且找到三成五。再按分数、来源时间和材料身份排序。

::screen{#personal-materials-registered-lookup-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-08",
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
| Registered index（登记索引） | 只包含明确接入的来源和非媒体原件定位，不是整盘文件清单；现在 55 个来源、166 份登记。 |
| Logical family（逻辑版本族） | 同一现实材料的多个来源原生版本；它与相同字节副本不是同一概念。 |
| Exact duplicate（精确重复） | 只有完整 SHA-256 相同才成立；标题相同或迁移回执不能证明。 |
| Hash-bound text（哈希绑定文字） | OCR（光学字符识别）、提取或原生文字与一份精确原件身份绑定；只帮助召回，引用仍回到原件。 |
| Search scope（搜索范围） | 本次实际查询的登记材料与来源，以及未查询部分；零命中必须与它一起解释。 |
| Lookup stage（查找阶段） | verified_locator 只含 verified；unverified_source_evidence 只含 unverified 的来源元数据或绑定文字证据；known_locator_gap 只保留 hash_mismatch、not_openable 等仍可复核问题，本人已删的 missing occurrence 已先退出。 |
| 门牌 | 加密文件夹的登记入口；门牌开着、指向一致才读，关着或错配只说明访问受阻，不说明原件被删。 |

## 专业定义

用一句普通描述匹配已登记来源、标题、原生标识、版本角色和绑定文字，优先返回已有可靠定位的少量候选。

::screen{#personal-materials-registered-lookup-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-09",
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
     "text_ref": "- 已有可靠路径直接打开，不先经过登记查找。",
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
     "text_ref": "- 已有可靠路径直接打开，不先经过登记查找。",
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

解决路径遗忘、同名文件、版本混淆、旧定位优先级和候选阶段不必要暴露真实位置。

## 边界

- 已有可靠路径直接打开，不先经过登记查找。

- 只查询非媒体原件；照片、视频、音频和录音始终由 personal-media 处理。

- 候选不向用户暴露真实路径、内部 ID 或内部选择凭据。

- 绑定文字不拥有高于原件的证据地位，也不进入人物、事件或领域判断。

- 来源覆盖是 complete、partial 或 unknown（未验证）的登记声明，不等于整台电脑；目前 4 个来源声明完整、51 个部分。

## 失败与恢复

- **零命中**：返回 not_found、登记搜索阶段、实际材料数量、来源样本、未搜索来源与缺口；只说明本轮登记索引没有合适候选。

- **指定来源没有可用登记项**：不静默扩大到其他来源；显示空范围并等待更正来源或明确进入发现。

- **只有旧的未验证文字命中**：明确标为派生文字召回，不能跳过原件验真，也不能把文字内容直接当当前原件。

::screen{#personal-materials-registered-lookup-10 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-10",
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
     "text_ref": "- **门牌关着、错配或未登记**：返回对应门牌缺口，不猜替代位置，也不当成原件已删。",
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
     "text_ref": "- **门牌关着、错配或未登记**：返回对应门牌缺口，不猜替代位置，也不当成原件已删。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 出问题时（二）

- **门牌关着、错配或未登记**：返回对应门牌缺口，不猜替代位置，也不当成原件已删。

- **本人已从可信文件管理器删除登记原件**：查询跳过缺失项并继续找有效候选，不删除索引或原件；现有每日 17:10 维护调用 sync-current 后再移除该 occurrence 与级联文字／关系，保留来源及其他副本。根不可读、其他读取错误或文件还在但内容变了，都不算删除。

- **只有仍可核对的定位缺口命中**：hash_mismatch、not_openable 等返回 known_locator_gap 和原 open_state，不能称 verified_locator。

- **数据库身份不符或未初始化**：拒绝连接，不初始化或覆盖外部字节；由项目入口恢复正确的最小 SQLite。

::screen{#personal-materials-registered-lookup-11 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-11",
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
     "text_ref": "- `README.md`定义普通请求、候选路径隐藏、find 优先、门牌和零命中范围。",
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
     "text_ref": "- `README.md`定义普通请求、候选路径隐藏、find 优先、门牌和零命中范围。",
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

- `README.md`定义普通请求、候选路径隐藏、find 优先、门牌和零命中范围。

- `README.md`还规定 find 没有严格命中时自动查范围内全部文件名清单，不现场扫目录。

- `materials.py`实现查询签名、匹配评分、候选卡、来源范围和 find 命令（共 4,126 行）。

- `schema.sql`定义来源、材料、原生关系、绑定文字、文件名清单和可打开状态。

- `tests/test_materials.py`覆盖自然查询、版本区分、路径隐藏、零命中、媒体历史行过滤、门牌和撤登记（当前测试文件 74 个测试函数、收集到 123 个用例，10 月 23 日 12:38 只收集计数，没有运行）。

## 如何验证

- 用虚构临时材料验证普通长描述能命中正确版本，并确认候选 JSON 不含 locator（原件定位记录）。

- 验证完全相同 SHA-256 与同逻辑版本族分别统计，不互相冒充。

- 分别构造 verified、unverified、missing、hash_mismatch、not_openable，确认三个 lookup_stage 严格分层且缺口从不标成 verified_locator。

- 验证零命中返回来源范围、未搜索数量与缺口，而不是空对象或绝对不存在。

::screen{#personal-materials-registered-lookup-12 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-registered-lookup-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "下一个模块 有界发现",
    "href": "/projects/personal-materials/bounded-discovery/"
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
     "text_ref": "- 验证媒体历史行既不能成为来源，也不能通过 find 返回或打开。",
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
     "text_ref": "- 验证媒体历史行既不能成为来源，也不能通过 find 返回或打开。",
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

- 验证媒体历史行既不能成为来源，也不能通过 find 返回或打开。

- 隔离回归覆盖查询／状态／检查不改库，缺失项不占 limit，verified 全失效后正确回退，单文件来源删除可同步，以及维护仅级联移除失效项的独有关系／文字。

- 真实产品验收必须从自然请求开始，并最终选中、重新验真、打开一份真实原件；单元测试不能替代，本次也没有做这样的验收。

## 与其他模块的关系

这是主入口。候选清楚时进入“验真与内容定位”；登记没有严格对上时 find 先自动查文件名清单；仍没有合适候选、位置真正未知时才进入“有界发现”。“精确接入”持续为本模块提供小而可信的来源与版本事实。项目源码：私有仓库，当前提交 48b539d（10 月 21 日）；10 月 7 日的版本是 17efb2e。
