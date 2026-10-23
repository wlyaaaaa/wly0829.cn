---
{
 "title": "Refresh（刷新）、看板与导航写入和中断恢复",
 "kind": "project",
 "url": "/projects/github-index/snapshot-recovery/",
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
  "page": "github-index-snapshot-recovery",
  "kind": "project",
  "title": "Refresh（刷新）、看板与导航写入和中断恢复",
  "url": "/projects/github-index/snapshot-recovery/",
  "parent": "github-local-index",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "GitHub 总索引源码（提交 e792eda，10 月 7 日）与 git.refresh-consistency 合同；八文档公开代际已于 9 月 26 日（提交 bfa2e7f）退役，现在是私有单页看板加统一导航逐个文件替换。"
  }
 },
 "source": {
  "page": "sources/pages/github-index-snapshot-recovery/page.json",
  "sha256": "7f9419bb449563d3ba63b9ca922ad112ae1d331aa312228c55f801329db73252",
  "converted_at_beijing": "2026-10-23T12:22:40+08:00"
 }
}
---

::screen{#github-index-snapshot-recovery-01 section="top"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-01",
  "section": "top",
  "title": "Refresh（刷新）、看板与导航写入和中断恢复",
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
     "text_ref": "Refresh（刷新）、看板与导航写入和中断恢复",
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
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（提交 e792eda，10 月 7 日）与 git.refresh-consistency 合同；八文档公开代际已于 9 月 26 日（提交 bfa2e7f）退役，现在是私有单页看板加统一导航逐个文件替换。",
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
     "text_ref": "Refresh（刷新）、看板与导航写入和中断恢复",
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
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（提交 e792eda，10 月 7 日）与 git.refresh-consistency 合同；八文档公开代际已于 9 月 26 日（提交 bfa2e7f）退役，现在是私有单页看板加统一导航逐个文件替换。"
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
   "asset": "_library/module-illustrations/github-index/snapshot-recovery-v01.png",
   "key": "main-github-local-index",
   "source_phrase": "右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。",
   "sha256": "5ec12764458eb7fe8314dd6eff31bf47f469d0dd59ada30cd945f54fe72817ee",
   "status": "ready"
  }
 ]
}
```

# Refresh（刷新）、看板与导航写入和中断恢复

〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕

GitHub 总索引 · 功能说明

完整更新总索引的私有看板和统一导航：两份文件逐个用写好的完整内容替换，中途失败会如实说哪一份已换、哪一份没换；需要旧版时从 Git 历史恢复。

**当前情况：**原来“八份公开文档组成一代、全部核对齐才切换当前指针”的做法已于 9 月 26 日退役；现在只生成一页私有看板和一份导航，不是跨文件的整体切换。10 月 11 日没有重新运行一致性检查，两份文件此刻是否一致未重新核对。

项目事实核对截至 2026-10-11 14:00（北京时间）；14:00 后的现场读数单独注明时间；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#github-index-snapshot-recovery-02 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-02",
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

仓库集合变了，看板和导航都得跟上；但两份文件不是一次整体切换，中断时可能一份新一份旧。所以每份文件都先写好完整内容再替换，失败时说清停在哪一层，旧版本从 Git 历史找回。

## 举个实际例子

我说：“新增仓库后完整更新索引。”系统先读完 GitHub 和本机现场，再先写导航、后写看板，最后推进身份基线。如果看板写入失败，它会告诉我：导航已经是新的，看板还是旧的，基线没有推进，而不是说“整体回滚了”。

## 最后我会得到什么

成功时得到更新后的私有看板、统一导航和推进后的身份基线；失败时知道哪一层已完成、哪一层没完成，以及旧版本该从哪个 Git 提交找回。不把一次中断说成“自动回滚成功”，也不把来历不明的文件拼进来。

::screen{#github-index-snapshot-recovery-03 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-03",
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

两份文件都写完并回读、基线推进成功，才算这次刷新完成。

## 发现问题时

某份文件写入失败就直接报错，并分别报告导航、看板、基线三层各自的结果。

## 入口不可用或证据不足时

现有文件和 Git 历史都读不到时先说明缺口，不拼接来历不明的文件。

::screen{#github-index-snapshot-recovery-04 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-04",
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
     "text_ref": "1. **先核对现有版本**　AI 读取现有看板、导航和身份基线，确认是否只需查差异。",
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
     "text_ref": "1. **先核对现有版本**　AI 读取现有看板、导航和身份基线，确认是否只需查差异。",
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

在已接入 GitHub 总索引的 AI 对话中说“新增仓库后刷新索引”或要求检查现有索引是否完整。

## 需要准备什么

- 已确认的仓库及远端身份

- 希望刷新或恢复的索引范围

## 从开始到拿到结果

1. **先核对现有版本**　AI 读取现有看板、导航和身份基线，确认是否只需查差异。

2. **生成并验新版本**　确有变化时先取完全部观察，再先写导航、后写看板；每份都先写完整临时内容，再原子替换。

3. **报告分层结果**　分别交回导航、看板和私有基线的状态；任何一层失败都单独说明，旧版本从 Git 历史恢复。

::screen{#github-index-snapshot-recovery-05 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-05",
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
     "text_ref": "1. 只有仓库 identity、visibility（公开或私有属性）、remote（远端仓库）、clone、默认分支或长期治理等 Owner 事实变化才重建。",
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
     "text_ref": "1. 只有仓库 identity、visibility（公开或私有属性）、remote（远端仓库）、clone、默认分支或长期治理等 Owner 事实变化才重建。",
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

八文档公开代际已于 9 月 26 日退役（提交 bfa2e7f），9 月 8 日的完整性验收只作退役代际的历史；10 月 23 日 10:26 身份状态为基线 48／现场 48、差异 1、问题 0（10 月 11 日 16:32 时是基线 45／现场 47、差异 2）；10 月 23 日查明当时那 1 处差异是一个仓库由公开改为私有；身份状态也不代表两份生成物已重新核对一致

## 关键规则与设计选择

1. 只有仓库 identity、visibility（公开或私有属性）、remote（远端仓库）、clone、默认分支或长期治理等 Owner 事实变化才重建。

2. 普通业务 commit、格式、时间戳或没有改变用户判断的 drift 不触发连锁 refresh。

3. 两份生成物一致只证明看板和导航互相对得上，不证明动态事实仍最新。

4. 正常full refresh自动推进已有有效v3基线；零写status、Fast和CheckOnly都不因此变成基线写入口，首次bootstrap/repair仍须显式处理。

5. 导航和看板逐个文件替换，不是跨文件事务：可能一份已换、另一份失败，必须报告哪一层实际完成。

6. **暂存代际已退役。**`.incoming` 暂存、全局互斥和过期暂存清理随八文档代际一起删除；现在没有需要回收的暂存代际。

## 当前怎样实现

- 完整刷新先检查Owner基线：invalid在任何写入前拒绝；missing允许写看板和导航，但后续baseline阶段只返回skipped/owner_baseline_missing_requires_explicit_bootstrap，不伪造首次历史。

- **八文档公开代际已退役（2026-09-26）。**原来写入同卷 `<id>.incoming`、校验 hash（内容指纹）/bytes/provenance（来源说明）、固定八份投影、current-generation.json 原子切指针并保留 current+previous；这些文件和代码已从当前受控树删除，不再是现行命令、验证入口或恢复点。

::screen{#github-index-snapshot-recovery-06 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-06",
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
     "text_ref": "- 现在只生成两份文件：私有单页看板 `00_总览/当前同步看板.md`（展开全部登记仓库和本地路径）和统一导航 `config/repository-paths.json`。",
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
     "text_ref": "- 现在只生成两份文件：私有单页看板 `00_总览/当前同步看板.md`（展开全部登记仓库和本地路径）和统一导航 `config/repository-paths.json`。",
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

- 现在只生成两份文件：私有单页看板 `00_总览/当前同步看板.md`（展开全部登记仓库和本地路径）和统一导航 `config/repository-paths.json`。

- 写入方式：先取完全部观察，再对每份文件写临时完整文本后移动替换；导航自身仍验证 schema（数据结构）、仓库集合并回读，但没有跨文档的 manifest（清单）/hash 闭包。

- 看板和导航写完后，同一full refresh调用Invoke-RefreshGitOwnerBaselineAdvance：重新读取Owner inventory，事实完整且无issue才自动advance，回读domain=current（当前状态）、delta=0、issue=0。导航、看板和基线各自写入，不是一次跨层事务。

- 一致性检查 Test-GitHubLocalIndexConsistency.ps1 只比较 2 份生成物：在 system temp 生成对照，通常清理到回收站；`-ReceiptPath` 可明确写私有回执；默认不 stage、commit 或 push。

- `Refresh -CheckOnly` 关闭刷新日志、不改看板和导航，但会生成并清理临时对照，和真正零写的 compact status 不同。合同里仍有 hidden 兼容回执的说明，本轮没有核验这条宿主调用。

- full refresh（完整刷新）复用共享 Admission（仓库准入检查） 的 fetch：仅退出128且命中 SSL_read/TLS connect 的 unexpected eof 时以同一参数重试一次，最多两次；其他失败不自动重试，失败保留 fetch_failed。固定提交快照只刷新 metadata（元数据），不声称普通工作树已同步。

## 执行流程

1. 读取并验证现有 v3 基线；invalid 在任何写入前停止

2. 获取 GitHub inventory、统一导航和已声明 clone 的现场事实

::screen{#github-index-snapshot-recovery-07 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-07",
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
     "text_ref": "3. 取完全部观察后再开始写文件",
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
     "text_ref": "3. 取完全部观察后再开始写文件",
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

3. 取完全部观察后再开始写文件

4. 写统一导航：临时完整文本→原子替换，验证 schema（数据结构） 和集合并回读

5. 写单页看板：临时完整文本→原子替换

6. 任一文件写入失败直接报错，说明哪一份已换、哪一份没换

7. 原来的“发布兼容投影”“切 current 指针并清理旧代际”两步已随代际退役；需要旧版本时从 Git 历史恢复

8. 重新读取Owner inventory，自动推进已有有效v3基线，再回读current（当前状态）、delta=0、issue=0；无变化返回current（当前状态），有变化返回advanced，缺失返回skipped

9. 一致性检查发现 drift 时只报告；是否 refresh 由 Owner 事实变化决定

::screen{#github-index-snapshot-recovery-08 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-08",
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
| immutable generation（不可变代际，已退役） | 旧做法：一代内容和清单固定，下一次变化建新 id；2026-09-26 起不再使用。 |
| current pointer（当前指针，已退役） | 旧的 current-generation.json；已删除，现在没有“切指针”这一步。 |
| generated files（生成物） | 现在只有两份：单页看板和统一导航；都是派生快照，authoritative=false。 |
| stable / volatile drift（稳定 / 易变漂移） | 身份、visibility（公开或私有属性） 等稳定事实影响一致性；dirty、ahead/behind（领先/落后提交数） 等易变状态可报告但不默认否决。 |
| recovery material（恢复材料） | Git 历史里的旧看板/导航、checkpoint（续作检查点） refs 和 unreachable objects 等可能保存中断前唯一内容，未证明前不清理。 |

## 专业定义

总账有实质变化时，先取完现场，再逐个文件写入导航和看板；中途失败如实报告哪一层完成，旧版本从 Git 历史恢复，不说成整体回滚。

::screen{#github-index-snapshot-recovery-09 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-09",
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
     "text_ref": "- 单页看板和统一导航标注 authoritative=false",
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
     "text_ref": "- 单页看板和统一导航标注 authoritative=false",
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

看板既要易读，又不能把 generated Markdown 升级成动态权威。一次 refresh 会读 GitHub、扫描已声明 clone、写导航和看板，再推进基线；这几步不是一个整体事务，中断、网络失败时必须说清每一层到了哪里。

## 边界

- 单页看板和统一导航标注 authoritative=false

- Fast 兼容模式和 CheckOnly 会生成临时对照或写私有状态，不等于 zero-write Owner status

- refresh 或 consistency PASS 都不证明 publication 完成

- 不引入数据库；未来 cache 必须可删除、可重建且不能替代 Git/GitHub/registry

- 不创建 watcher、后台自动 refresh、自动 commit 或自动 push

## 失败与恢复

- **导航或看板写入失败**：直接报错，说明哪一份已换、哪一份没换；需要旧版时从 Git 历史恢复，不拼接。

- **导航 schema（数据结构）、仓库集合或回读校验失败**：停止，不把它当作当前导航使用。

- **fetch 在适用的一次重试后仍失败，或错误不适合重试**：保留 fetch_failed、实际次数与有界诊断；不把旧 refs 冒充 live，不自动 push。

::screen{#github-index-snapshot-recovery-10 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-10",
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
     "text_ref": "- **一致性检查发现两份生成物不一致**：只报告漂移文件；是否刷新由 Owner 事实变化决定。",
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
     "text_ref": "- **一致性检查发现两份生成物不一致**：只报告漂移文件；是否刷新由 Owner 事实变化决定。",
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

- **一致性检查发现两份生成物不一致**：只报告漂移文件；是否刷新由 Owner 事实变化决定。

- **Owner baseline与现场不同**：零写status报告review_needed；正常完整refresh会自动收敛有效基线。若基线阶段失败，保留真实已写的看板/导航与实际基线，明确未收口层，不假称整体回滚或成功。

::screen{#github-index-snapshot-recovery-11 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-11",
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
     "text_ref": "- 单页看板和统一导航的写入（Update-GitHubIndex.ps1）",
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
     "text_ref": "- 单页看板和统一导航的写入（Update-GitHubIndex.ps1）",
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

- 单页看板和统一导航的写入（Update-GitHubIndex.ps1）

- Git/GitHub 事实到看板的生成器

- 两份生成物的只读一致性比较（Test-GitHubLocalIndexConsistency.ps1）

- owner status、refresh、consistency 与恢复边界（git.refresh-consistency 合同）

- 已退役、只作历史：mutex、incoming、代际发布、指针切换和保留策略（2026-09-26 删除）

## 如何验证

- current-generation.json 当时声明 schema（数据结构） v1、manifest（清单） SHA-256、八份 documents、current（当前状态）+previous 和 pointer-after-readback；该文件已删除，这是退役代际的历史。

- 单元测试曾注入 projection 中途失败，验证旧 pointer 保持有效；这属于退役代际的历史测试，不证明现在的两文件写入。

- 2026-10-11 只读核对当前源码（提交 e792eda）与 git.refresh-consistency 合同：顺序为导航→看板→基线推进，invalid 基线在写入前拒绝。本次没有执行刷新、迁移或测试。

::screen{#github-index-snapshot-recovery-12 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-snapshot-recovery-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 重大变更保护",
    "href": "/projects/github-index/protected-major-actions/"
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
     "text_ref": "- 旧测试曾拒绝越界 projection、额外文件、unknown（未验证）/case-variant schema（数据结构） 字段和 reparse-point 父目录；这些检查随代际一起退役。",
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
     "text_ref": "- 旧测试曾拒绝越界 projection、额外文件、unknown（未验证）/case-variant schema（数据结构） 字段和 reparse-point 父目录；这些检查随代际一起退役。",
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

- 旧测试曾拒绝越界 projection、额外文件、unknown（未验证）/case-variant schema（数据结构） 字段和 reparse-point 父目录；这些检查随代际一起退役。

- 2026-09-08T08:11:28Z 直接回读代际 284f02f94edf4c5584c4f51f680d4f7a：manifest（清单） hash、8份文档和兼容投影全部一致，总计25235字节；这是已退役代际的历史验收，没有换日期重验。

- 2026-10-11 16:32 身份状态：基线 45、现场 47、delta 2、issue 0、attention 1、review_needed；身份状态不证明两份生成物现场一致，也不证明正常推送已完成。

- 现行两文件一致性检查本轮没有运行（Unknown）；本机现存的一致性回执是 7 月、8 月和 9 月 5 日的旧记录，不套用到现在。

## 与其他模块的关系

它把总账和诊断保存成可重建快照，但不替 Admission（仓库准入检查） 判断单仓库现场，也不替 Publication Gate 批准外部发布。
