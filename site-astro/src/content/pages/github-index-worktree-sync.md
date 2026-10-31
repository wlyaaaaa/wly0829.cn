---
{
 "title": "Worktree（工作树）、分支同步与默认分支收敛",
 "kind": "project",
 "url": "/projects/github-index/worktree-sync/",
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
  "page": "github-index-worktree-sync",
  "kind": "project",
  "title": "Worktree（工作树）、分支同步与默认分支收敛",
  "url": "/projects/github-index/worktree-sync/",
  "parent": "github-local-index"
 },
 "source": {
  "page": "sources/pages/github-index-worktree-sync/page.json",
  "sha256": "a27a36ad220b98253ab67b9d91644ffe4e4041d5be9574478495f618426df5a0",
  "converted_at_beijing": "2026-10-31T13:58:50+08:00"
 }
}
---

::screen{#github-index-worktree-sync-01 section="top"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-01",
  "section": "top",
  "title": "Worktree（工作树）、分支同步与默认分支收敛",
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
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "Worktree（工作树）、分支同步与默认分支收敛",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true
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
     "text_ref": "Worktree（工作树）、分支同步与默认分支收敛",
     "align": "left",
     "size": "large"
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
   "asset": "_library/module-illustrations/github-index/worktree-sync-v01.png",
   "key": "main-github-local-index",
   "source_phrase": "右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。",
   "sha256": "9415e4b5e68931033f5b6d51d72549122d1b067690a54c4dd5f30b2e9ce9274f",
   "status": "ready"
  }
 ]
}
```

# Worktree（工作树）、分支同步与默认分支收敛

〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕

GitHub 总索引 · 功能说明 · 已冻结：10 月 31 日起项目不再维护。这项功能现在：改完的东西传没传到 GitHub，AI 收尾时当场就查得到。下面是冻结前的样子。

防止“当前分支已 push（推送）”掩盖另一个工作树的未提交修改、独有提交或没有进入 main（默认主分支）的 feature（功能分支）历史。

**当前情况：**已有查清各份工作副本、分支和默认主线差异的功能；发现独有修改时保留它，不自动删除或宣布已经交付。10 月 11 日 16:34 看总索引自己：唯一的 main 工作树没有未提交修改，但有 2 个提交还没进入远端 main，所以当时不算已交付。10 月 22 日 06:48 再只读数：本地相对本机缓存的远端 main 领先 0 个提交；没有拉取远端，所以只说明按缓存没有待推送的提交。

项目事实核对截至 2026-10-11 14:00（北京时间）；14:00 后的现场读数单独注明时间；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#github-index-worktree-sync-02 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-02",
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

同一仓库可能在多个文件夹里同时有人工作；只看眼前文件夹干净，会漏掉其他目录没保存的修改和只存在那里的提交。

## 举个实际例子

比如我问“这个功能分支已经推了，算完成吗？”它即使和自己的远端分支完全同步，目标提交也可能还没进入 origin/main。系统会直说“默认分支还缺这些提交”，而不会因为功能分支自己推成功了就冒充交付完成。

## 最后我会得到什么

得到每个工作目录仍有什么未提交修改、哪些分支已进入远端主分支、哪些目录有唯一内容要保留。清理只是候选，系统不会自动删。

::screen{#github-index-worktree-sync-03 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-03",
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

所有相关目录和远端主分支都查清时，说明哪些工作已合并、哪些仍在使用。

## 发现问题时

某处还有未保存修改、独有提交或未进入主分支时保留它，不宣布整仓已交付。

## 入口不可用或证据不足时

目录或远端暂时读不到时不猜同步状态，更不删除可能是唯一副本的文件。

::screen{#github-index-worktree-sync-04 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-04",
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
     "text_ref": "1. **找全同仓库的工作目录**　AI 查看每份工作目录的未保存修改、关联远端分支和只存在本地的提交。",
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
     "text_ref": "1. **找全同仓库的工作目录**　AI 查看每份工作目录的未保存修改、关联远端分支和只存在本地的提交。",
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

在 AI 项目对话中说明哪个分支或工作树想收口，要求检查默认分支是否真正收到修改。

## 需要准备什么

- 仓库和目标提交或分支

- 保留中的其他工作树

## 从开始到拿到结果

1. **找全同仓库的工作目录**　AI 查看每份工作目录的未保存修改、关联远端分支和只存在本地的提交。

2. **比较默认分支**　判断目标提交是否进入真实远端默认分支，识别仍需整合或有唯一内容的分支。

3. **决定后续动作**　给出可保留、待整合或待复查项；删除候选仍需确认没有活动使用，不因当前目录干净就清理其他工作树。

::screen{#github-index-worktree-sync-05 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-05",
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
     "text_ref": "1. behind 或 diverged（本地与远端双向分叉） 时先 update/reconcile 并复查，不能直接 push。",
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
     "text_ref": "1. behind 或 diverged（本地与远端双向分叉） 时先 update/reconcile 并复查，不能直接 push。",
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

工作树与远端默认分支收敛检查可用

## 关键规则与设计选择

1. behind 或 diverged（本地与远端双向分叉） 时先 update/reconcile 并复查，不能直接 push。

2. detached（分离提交状态） HEAD（游离提交）没有一个可以设置 upstream（上游）的当前分支；此时明确返回 choose_branch_or_refspec，先选择分支或显式 refspec（推送目标映射），不误导用户设置不存在的上游。

3. dirty 时只允许显式限定候选，不能 `git add .` 吞入其他任务。

4. 分支对自身 upstream（上游分支） 同步但缺于远端默认分支时，仍需 integrate default branch（分支）。

5. 已被默认分支吸收且无保护的 clean 残留只成为 retirement candidate，不自动删除。

6. unknown（未验证） 只作删除前瞬时保护；无法查清 owner、独有内容和依赖时 closeout 必须 BLOCK。

7. 已登记的副机安全备份分支与制品按其恢复用途核对，不强迫当普通feature并回main；身份、分支用途和实际恢复完整性各自有来源。

## 当前怎样实现

- `git worktree list --porcelain` 枚举全部工作树；每个存在路径单独回读 HEAD、branch（分支）、upstream（上游分支）、ahead/behind（领先/落后提交数） 和 NUL-delimited（以空字符分隔） status。

::screen{#github-index-worktree-sync-06 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-06",
  "section": "tech",
  "title": "技术实现与依据（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
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
     "text_ref": "- dirty summary 分开计 staged、unstaged、untracked 和 conflicted，文件名含中文、空格或换行也不误解析。",
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
     "text_ref": "- dirty summary 分开计 staged、unstaged、untracked 和 conflicted，文件名含中文、空格或换行也不误解析。",
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

- dirty summary 分开计 staged、unstaged、untracked 和 conflicted，文件名含中文、空格或换行也不误解析。

- local_root 优先取 git rev-parse --show-toplevel 的真实根目录，精确 TargetWorktree 保持调用目标；从子目录进入不会把子目录误登记为根。失败 errors 保留 category/exit_code，并可附最多3行、512字符的诊断；含疑似凭据或控制字符的正文省略，但不吞掉原错误和阻断。

- fetch_attempts 明示0/1/2次；LiveMetadata（只读远端元数据）保持0次。只对已观察到的退出128与 TLS EOF 做一次同参数重试，不重试 push，不改代理、TLS、认证或凭据配置。

- 默认分支完成证据只接受 `refs/remotes/origin/<default>`；远端 ref 缺失就 unknown（未验证），不回退同名本地 branch（分支）。

- branch（分支） inventory 枚举无 worktree（Git 工作树） 的本地 refs 和 remote-tracking refs；用 ancestry 与 `git cherry` 区分 unmerged、merged_ancestry 和 patch_equivalent。

- artifact governance 只对 exact repo/ref 生效；必要 retention 必须同时匹配 repo、绝对 path 与 HEAD，并带 Owner、用途、exit condition。当前登记 3 条专门治理项、1 个冻结历史仓库例外，必要保留项 0 个（10 月 22 日 06:48 数的登记项；10 月 11 日时必要保留项还是 1 个。只数了登记条目，不代表每项的使用方都已重新验收）。

- frozen_history 保留冻结仓库的非默认 refs 与独有提交，不回灌默认分支，也不把它们当普通清理候选。

## 执行流程

1. 枚举 common-dir 下全部 worktree（Git 工作树） 与 refs

::screen{#github-index-worktree-sync-07 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-07",
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
     "text_ref": "2. 逐工作树读取文件状态、upstream（上游分支） 和 ahead/behind（领先/落后提交数）",
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
     "text_ref": "2. 逐工作树读取文件状态、upstream（上游分支） 和 ahead/behind（领先/落后提交数）",
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

2. 逐工作树读取文件状态、upstream（上游分支） 和 ahead/behind（领先/落后提交数）

3. 按调用模式决定是否刷新远端引用，再读取远端默认分支 HEAD；只读元数据查询不刷新，用的是本机缓存就照实标 cached

4. 比较每个 HEAD 与默认分支的 ancestry、距离和 patch equivalence

5. 附加 exact governance、historical retention 与 necessary retention

6. 生成整合、复查、保留或可退役结论

7. 删除前由任务 Owner（任务责任方） 再确认没有活动依赖或唯一内容

::screen{#github-index-worktree-sync-08 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-08",
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
| sync_state（同步状态） | in_sync、ahead、behind、diverged（本地与远端双向分叉）、no_upstream 或 unknown（未验证），只描述 HEAD 与 upstream（上游分支）。 |
| integration_state（整合状态） | default、merged_ancestry、patch_equivalent、unmerged 或 unknown（未验证），描述 HEAD 相对远端默认分支。 |
| patch equivalent（补丁等价） | 提交哈希不同，但同一补丁已经以另一提交进入默认分支。 |
| prunable（可修剪记录） | Git 记录了一个已不存在或失效的 worktree（Git 工作树）；它仍是异常证据，不自动视为 clean。 |
| necessary retention（必要保留） | 当前确有消费者的固定工作树例外；条件漂移后立即失效。 |

## 专业定义

提交真正进入远端默认分支才叫交付；没查清是否有独有内容，就绝不删工作树。

::screen{#github-index-worktree-sync-09 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-09",
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
     "text_ref": "- retirement candidate 不等于删除授权，也不证明没有运行中消费者",
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
     "text_ref": "- retirement candidate 不等于删除授权，也不证明没有运行中消费者",
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

Git 的“同步”至少包含工作文件、当前 upstream（上游分支） 和默认分支整合三层。任何一层被省略，都会把未提交、只推到 feature、patch-equivalent 或残留 worktree（Git 工作树） 混成一个模糊的“已同步”。

## 边界

- retirement candidate 不等于删除授权，也不证明没有运行中消费者

- locked、prunable、dirty、ahead、普通 no-upstream 或证据矛盾不能被 snapshot 规则压掉

- 普通未来 branch（分支） 不因名称模式自动成为专门 Owner 或历史保留

- 未证明前不得 gc、prune 或删除内部 checkpoint（续作检查点） refs（检查点引用）与 unreachable objects（不可达对象）

- 项目业务决定 merge、rebase、PR 或 release 方式；总索引只提供 Git 事实

## 失败与恢复

- **任一可达 worktree（Git 工作树） status 或 refs 检查失败**：该状态为 unknown（未验证），并阻止依赖它的收敛/删除结论。

- **远端默认分支 ref 不存在**：不退回本地 main；标记 default_branch_integration_unknown 并刷新/补证。

::screen{#github-index-worktree-sync-10 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-10",
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
     "text_ref": "- **branch（分支） ahead+behind**：push_decision=block、strategy=reconcile_then_recheck。",
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
     "text_ref": "- **branch（分支） ahead+behind**：push_decision=block、strategy=reconcile_then_recheck。",
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

- **branch（分支） ahead+behind**：push_decision=block、strategy=reconcile_then_recheck。

- **已整合残留仍有 lock、dirty 或必要 retention**：保持 evidence 和警告，不列为自动清理。

- **retention path 或 HEAD 改变**：exact match 失效，恢复普通 dirty/sync/retirement 判断。

::screen{#github-index-worktree-sync-11 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-11",
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
     "text_ref": "- 全部 worktree（Git 工作树）、默认分支完成与必要保留合同",
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
     "text_ref": "- 全部 worktree（Git 工作树）、默认分支完成与必要保留合同",
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

- 全部 worktree（Git 工作树）、默认分支完成与必要保留合同

- worktree（Git 工作树）/status/branch/default integration 实现

- exact governance、frozen history 与 retention schema（数据结构）

- 多 worktree（Git 工作树）、branch（分支） inventory 与 retention fixture

## 如何验证

- 2026-08-29 完整 Admission（仓库准入检查） 回归 exit 0，覆盖本模块的 worktree（Git 工作树）、branch（分支）、default-ref、target 和 retention 路径。

- 测试 fixture 真实创建 primary、linked、detached（分离提交状态）、prunable、ahead 与 no-upstream 工作树。

- 回归覆盖 remote-only branch（分支）、已推送但未进默认分支、merged ancestry、patch equivalence 和 retirement candidate。

- registry（登记清单） 测试验证 missing/wrong schema（数据结构）、重复 ref、未知 override 和不完整 retention 全部失败关闭。

::screen{#github-index-worktree-sync-12 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-worktree-sync-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 项目入场",
    "href": "/projects/github-index/project-admission/"
   },
   {
    "text": "下一个模块 公开发布",
    "href": "/projects/github-index/publication-gate/"
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
     "text_ref": "- 2026-08-29 两个 PUBLIC（公开） 仓库现场均确认 main/default integration=default、0/0，但 dirty 仍单独保留为 warning；这是历史现场。",
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
     "text_ref": "- 2026-08-29 两个 PUBLIC（公开） 仓库现场均确认 main/default integration=default、0/0，但 dirty 仍单独保留为 warning；这是历史现场。",
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

- 2026-08-29 两个 PUBLIC（公开） 仓库现场均确认 main/default integration=default、0/0，但 dirty 仍单独保留为 warning；这是历史现场。

- 2026-08-31 总索引的 live Admission（仓库准入检查） 回读唯一 main worktree（Git 工作树） 为 clean、0/0、integration_state=default，这是历史。2026-10-11 16:34 只读复查：dirty 0、ahead 2、behind 0、integration_state=unmerged、missing_default_commits=2；远端引用为本机缓存，另用 ls-remote 确认远端 main 未变。本次未重跑多 worktree（Git 工作树） fixture，也没有扫描其他仓库，结论不外推到全部 47 个仓库。

## 与其他模块的关系

它把 Admission（仓库准入检查） 的 worktrees/branches 证据解释为真实收敛状态；Publication Gate 在此基础上继续审查候选内容和授权。
