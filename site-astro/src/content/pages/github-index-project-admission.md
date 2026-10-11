---
{
 "title": "单仓库 Admission（入场检查）与精确目标判断",
 "kind": "project",
 "url": "/projects/github-index/project-admission/",
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
  "page": "github-index-project-admission",
  "kind": "project",
  "title": "单仓库 Admission（入场检查）与精确目标判断",
  "url": "/projects/github-index/project-admission/",
  "parent": "github-local-index",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "GitHub 总索引源码（提交 e792eda，10 月 7 日）现行准入合同，以及 10 月 11 日 16:34 对总索引自身的只读元数据检查。"
  }
 },
 "source": {
  "page": "sources/pages/github-index-project-admission/page.json",
  "sha256": "6926cf47d87bccca314bfea4022148ff68b4c63c4d6e66bcb70cfc1dd7e3bd3d",
  "converted_at_beijing": "2026-10-11T21:05:00+08:00"
 }
}
---

::screen{#github-index-project-admission-01 section="top"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-01",
  "section": "top",
  "title": "单仓库 Admission（入场检查）与精确目标判断",
  "links": [
   {
    "text": "回到项目 → GitHub 项目总索引",
    "href": "/projects/github-index/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/github-index/#ai-brief"
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
     "text_ref": "单仓库 Admission（入场检查）与精确目标判断",
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
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（提交 e792eda，10 月 7 日）现行准入合同，以及 10 月 11 日 16:34 对总索引自身的只读元数据检查。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "GitHub 总索引 · 功能说明",
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
     "text_ref": "单仓库 Admission（入场检查）与精确目标判断",
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
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（提交 e792eda，10 月 7 日）现行准入合同，以及 10 月 11 日 16:34 对总索引自身的只读元数据检查。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "GitHub 总索引 · 功能说明"
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
   "asset": "_library/module-illustrations/github-index/project-admission-v01.png",
   "key": "main-github-local-index",
   "source_phrase": "右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。",
   "sha256": "5a93ef319333a47ed48daa71f243223cdfad0eecabca807a6939e755d9b12ea6",
   "status": "ready"
  }
 ]
}
```

# 单仓库 Admission（入场检查）与精确目标判断

〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕

GitHub 总索引 · 功能说明

在真正改文件或推送前确认“我站在正确的仓库、正确的工作树和正确的远端前”，并把继续、警告和阻断原因说清。

**当前情况：**已有核对仓库、目录、远端与分支的检查入口；10 月 11 日 16:34 用它只读核对总索引自己：私有仓库、默认分支 main，本地领先远端 2 个提交，结论是“警告”。实时信息读取失败会保留未知，检查通过本身不授予发布权限。

项目事实核对截至 2026-10-11 14:00（北京时间）；14:00 后的现场读数单独注明时间；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#github-index-project-admission-02 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-02",
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

目录名、旧文档和缓存路径都可能过期；多工作树仓库里，另一个临时目录的未提交修改或无上游状态，也可能被误算到当前目标。这个入口既核实真实仓库身份，也能只判断点名的工作树，同时把其他工作树作为证据保留下来。

## 举个实际例子

比如我问：“总索引这个仓库现在是什么身份，公开还是私有？只看，别拉取。”系统会现场对照 Git 共享目录、origin 与 GitHub 上的仓库身份，告诉我目标确实是总索引自己的仓库，现在是私有、默认分支 main。GitHub 信息是刚读的，但远端分支位置用的是本机缓存，所以它只说“本地领先 2 个提交，推送前要先拉取再核对”，不说已经同步。目录名即使相同，只要 origin 对不上，就只做定位排查，绝不继续写。

## 最后我会得到什么

得到这次要改的真实仓库和远端、正在使用的目录是否有别人修改、分支是否落后，以及能否安全开始。它只帮我认准目标，不自动给出提交或发布许可。

::screen{#github-index-project-admission-03 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-03",
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

项目目录和远端身份都确认后，说明这次没有仓库层阻碍；实际修改仍按本轮授权。

## 发现问题时

有并发修改、分支落后或目标不对时指出应先处理的文件与分支。

## 入口不可用或证据不足时

远端暂时读不到时可继续安全的本地工作，推送和发布结论须等真实远端证据。

::screen{#github-index-project-admission-04 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-04",
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
     "text_ref": "1. **核对正在使用的工作目录**　AI 检查指定仓库这份目录的修改、关联分支和目标远端，避免把其他目录的状态混进来。",
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
     "text_ref": "1. **核对正在使用的工作目录**　AI 检查指定仓库这份目录的修改、关联分支和目标远端，避免把其他目录的状态混进来。",
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

在 AI 项目对话中点名一个仓库，要求“先检查能否在这里改或发布”；需要最新远端引用时再明确提出。

## 需要准备什么

- 目标仓库或工作树

- 要改动或发布的分支

- 是否需要刷新远端引用

## 从开始到拿到结果

1. **核对正在使用的工作目录**　AI 检查指定仓库这份目录的修改、关联分支和目标远端，避免把其他目录的状态混进来。

2. **做入场检查**　读取未提交改动、上游和已知远端；只有需要真实领先落后时才刷新引用。

3. **说明可做范围**　交回当前阻碍和下一步；只是只读元数据的结果不能证明远端已经同步。

::screen{#github-index-project-admission-05 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-05",
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
     "text_ref": "1. 普通已知仓库的可逆小改可只用 git status（Git 状态命令）；Admission（仓库准入检查） 不是固定打卡。",
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
     "text_ref": "1. 普通已知仓库的可逆小改可只用 git status（Git 状态命令）；Admission（仓库准入检查） 不是固定打卡。",
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

项目入场事实入口可用；实时元数据、远端引用和精确目标的回归为 8 月 29 日历史结果，之后未重新运行

## 关键规则与设计选择

1. 普通已知仓库的可逆小改可只用 git status（Git 状态命令）；Admission（仓库准入检查） 不是固定打卡。

2. 准备创建但远端还不存在时，不拿要求远端已存在的普通 Admission（仓库准入检查） 伪造 identity；先通过重大动作入口建一个空仓库（私有的直接建，公开的要按重大动作验证和首次公开授权），再回来做 live Admission（仓库准入检查）。

3. 只需要 GitHub 可见性时用 LiveMetadata：它会联网读取 GitHub 现场元数据，但不会执行 git fetch，也不会刷新远端跟踪引用。

4. 需要真实 ahead/behind（领先/落后提交数） 时用 RefreshRefs；准备发布判断时用 ForPublication 同时要求两类 live 证据。

5. TargetWorktree/TargetRef 只改变顶层 transport 判断，其他工作树仍保留在 evidence 中。

6. decision=block 关闭依赖不足证据的写入和直接 transport，但不关闭只读诊断。

7. Git命令失败、超时或无法完整读回时是证据未知，不是自动证明remote（远端仓库）或身份冲突。普通dirty只说明未提交内容，不能代替Execution Owner（施工责任）的活动施工登记。

## 当前怎样实现

- 入口先规范化 owner/name；显式 RepoPath 或 TargetWorktree 可直接作为定位提示，不需要先被导航收录，但最终必须回读 remote.origin.url 与 git-common-dir。

::screen{#github-index-project-admission-06 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-06",
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
     "text_ref": "- 无显式路径时读取统一受控导航 `config/repository-paths.json`；候选 identity 不符时丢弃，并返回 remote_mismatch 或 bootstrap_required。",
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
     "text_ref": "- 无显式路径时读取统一受控导航 `config/repository-paths.json`；候选 identity 不符时丢弃，并返回 remote_mismatch 或 bootstrap_required。",
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

- 无显式路径时读取统一受控导航 `config/repository-paths.json`；候选 identity 不符时丢弃，并返回 remote_mismatch 或 bootstrap_required。

- visibility（公开或私有属性） 只接受 PUBLIC（公开）、PRIVATE（私有）、INTERNAL；非法值或 unknown（未验证） 都进入 blocking reasons。

- LiveMetadata 调用 GitHub metadata（元数据） 且 never fetch；RefreshRefs 才执行 `git fetch --prune origin`；ForPublication 同时要求两者成功。记录里的 fetch_attempts 为 0、1 或 2：只有退出码 128 且是 SSL_read/TLS connect 的意外 EOF 时，用相同参数重试一次；其他失败不重试，也不改代理、TLS 或凭据，从不重试 push。

- 顶层 evidence_source、freshness（证据新鲜度） 与 live_checked 明示 local_git、github_metadata、remote_refs 的来源；异常记录保留类别和 exit code，并可附一段诊断：优先取 stderr，没有再取 stdout，最多 3 条非空信息、512 个字符；疑似凭据或含异常控制字符时省略诊断正文。

- New-ProjectAdmissionRecord 让正常和异常路径保持同一 schema（数据结构），不因 internal_error 丢字段。

- Get-ProjectPrivateCompanion.ps1按已确认repo与RepoPath读取现有私有配套登记，区分mapped、unregistered、registered_unmapped和conflict；只返回匹配路径/链接/恢复关系元数据，不扫描其他项目、不读正文、不创建文件或网络请求，也不改变普通准入结论。进入项目或公开前按需读取已找到的最近规则，私有配套仍由原Owner管理。

## 执行流程

1. 规范化预期 repo identity 和可选 target

2. 解析候选路径并回读 `.git` origin/common-dir

::screen{#github-index-project-admission-07 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-07",
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
     "text_ref": "3. 枚举全部 worktree（Git 工作树） 并读取 branch（分支）、HEAD、upstream（上游分支）、dirty 和 sync",
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
     "text_ref": "3. 枚举全部 worktree（Git 工作树） 并读取 branch（分支）、HEAD、upstream（上游分支）、dirty 和 sync",
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

3. 枚举全部 worktree（Git 工作树） 并读取 branch（分支）、HEAD、upstream（上游分支）、dirty 和 sync

4. 按调用模式读取 live GitHub metadata（元数据） 和/或刷新 refs

5. 计算默认分支整合、branch（分支） inventory 与治理 registry（登记清单） 命中

6. 限定 decision worktree（Git 工作树），生成 reasons、decision 和 push guidance

7. 调用者结合项目规则、候选内容和授权决定下一步

::screen{#github-index-project-admission-08 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-08",
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
| evidence_source（证据来源） | 分别标出 local Git、GitHub metadata（元数据） 和 remote（远端仓库） refs 是 live、cached 还是 unavailable。 |
| freshness（综合新鲜度） | 三类来源全 live 才是 live；只现场读取一部分为 mixed；都未刷新为 cached。 |
| decision（入场结论） | proceed、warn 或 block，描述事实充分程度和本地风险，不等于授权。 |
| push_decision（传输建议） | 根据 dirty、behind、diverged（本地与远端双向分叉）、upstream（上游分支） 和 remote（远端仓库） mode 给出 transport readiness。 |
| target scope（目标范围） | 精确到一个 worktree（Git 工作树）、branch（分支） ref 或 40 位 commit；目标冲突或多义时失败关闭。 |

## 专业定义

当路径、远端、公开属性或同步状态会改变做法时，先给这个项目做一次精确现场体检。

::screen{#github-index-project-admission-09 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-09",
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
     "text_ref": "- V1 不输出 publication_decision，也不扫描实际候选内容",
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
     "text_ref": "- V1 不输出 publication_decision，也不扫描实际候选内容",
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

单仓库判断同时依赖本地 `.git`、GitHub metadata（元数据） 和 remote-tracking refs。把它们混成一个 `fetch=true` 黑盒会让调用者不知道什么是现场、什么是缓存；只聚合所有工作树又会让无关临时目录阻断精确目标。

## 边界

- V1 不输出 publication_decision，也不扫描实际候选内容

- push_decision=proceed 不授予 edit、commit、push 或公开发布权限

- 不靠项目名称硬编码治理例外；只读精确 artifact/retention registry（登记清单）

- 无 target 时保留全 worktree（Git 工作树） 聚合兼容语义

- 异常诊断有上限（3 条、512 字符），疑似秘密值或异常控制字符时不回显正文，只保留稳定错误类别和 exit code

## 失败与恢复

- **repo、路径或 origin identity 无法唯一确定**：decision=block；读取 `.git`、remote（远端仓库） 和 Owner 证据继续定位。

- **LiveMetadata 或 RefreshRefs 失败**：加入 live_evidence_unavailable，ForPublication 保持 block，不把缓存冒充现场；读失败只算未知，不猜成身份冲突，更不去改远端补救。

- **target worktree（Git 工作树）/ref 不存在、冲突或不可用**：返回精确 target reason，不退回任意工作树。

::screen{#github-index-project-admission-10 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-10",
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
     "text_ref": "- **PUBLIC（公开） 工作树命中敏感路径**：block 并给出 resolve_public_exposure；pure delete 和安全 rename 按实际目标判断。",
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
     "text_ref": "- **PUBLIC（公开） 工作树命中敏感路径**：block 并给出 resolve_public_exposure；pure delete 和安全 rename 按实际目标判断。",
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

- **PUBLIC（公开） 工作树命中敏感路径**：block 并给出 resolve_public_exposure；pure delete 和安全 rename 按实际目标判断。

- **任一可达 worktree（Git 工作树） 检查失败**：worktree_inspection_error 失败关闭；其他只读诊断仍可继续。

::screen{#github-index-project-admission-11 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-11",
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
     "text_ref": "- CLI（命令行工具）、模式参数、统一导航与有上限的诊断输出",
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
     "text_ref": "- CLI（命令行工具）、模式参数、统一导航与有上限的诊断输出",
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

- CLI（命令行工具）、模式参数、统一导航与有上限的诊断输出

- Admission（仓库准入检查） record、worktree（Git 工作树）、branch（分支）、target 与 push guidance 核心

- v1 schema（数据结构）、新鲜度、target 与失败语义

- 真实 Git fixture 和失败关闭回归

- 精确配套发现、读失败与实际身份冲突分层；Get-ProjectPrivateCompanion.ps1为现行入口

## 如何验证

- 2026-08-29 完整运行 Test-ProjectAdmission.ps1，exit 0，并以 `All project admission tests passed.` 收口；这是历史源码回归，不冒充本次现场。10 月 11 日只静态核对了当前测试定义，没有重新运行。

- 2026-08-31 对总索引直接运行 ForPublication：当时为 PUBLIC（公开）/main、freshness（证据新鲜度）=live、clean、0/0、decision=proceed，这是旧日期历史。2026-10-11 16:34 只读运行 LiveMetadata：PRIVATE（私有）/main、freshness=mixed、fetch_attempts=0、remote_refs=cached、live_checked=false、decision=warn、push_strategy=fetch_recheck；唯一 main 工作树 dirty 0、ahead 2、behind 0。这次只读元数据，不能算发布前现场检查通过；另用 ls-remote 现场确认远端 main 仍等于缓存值。

- 测试覆盖正常/异常记录同 shape、visibility（公开或私有属性） 闭集、LiveMetadata never fetch、RefreshRefs、ForPublication 和兼容 Fetch。

::screen{#github-index-project-admission-12 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-project-admission-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 仓库总账",
    "href": "/projects/github-index/repository-ledger/"
   },
   {
    "text": "下一个模块 工作树同步",
    "href": "/projects/github-index/worktree-sync/"
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
     "text_ref": "- 真实 fixture 覆盖 primary、linked、detached（分离提交状态）、prunable、no-upstream、ahead、behind、diverged（本地与远端双向分叉） 和 inspection failure。",
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
     "text_ref": "- 真实 fixture 覆盖 primary、linked、detached（分离提交状态）、prunable、no-upstream、ahead、behind、diverged（本地与远端双向分叉） 和 inspection failure。",
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

- 真实 fixture 覆盖 primary、linked、detached（分离提交状态）、prunable、no-upstream、ahead、behind、diverged（本地与远端双向分叉） 和 inspection failure。

- target fixture 验证无关工作树不会污染顶层判断，但仍完整出现在 worktrees evidence。

## 与其他模块的关系

它是总账落到单个项目的现场入口；Worktree（Git 工作树） Sync 解释它怎样判断分支完成，Publication Gate 再解释为什么 transport 仍不等于公开。
