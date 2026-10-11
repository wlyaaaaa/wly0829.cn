---
{
 "title": "一个已复核文件，精确进入原件中心与两套恢复计划",
 "kind": "project",
 "url": "/projects/personal-media/local-ingest/",
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
  "page": "personal-media-local-ingest",
  "kind": "project",
  "title": "一个已复核文件，精确进入原件中心与两套恢复计划",
  "url": "/projects/personal-media/local-ingest/",
  "parent": "personal-media",
  "status_line": {
   "state": "在用",
   "as_of": "2026-10-11",
   "source": "源码按 10 月 10 日版本，10 月 11 日只读核对；本次没有接入任何真实新文件、没有跑测试"
  }
 },
 "source": {
  "page": "sources/pages/personal-media-local-ingest/page.json",
  "sha256": "3e85e76939c6b6cc1978c284935770b6d92b21fef95cc75eb050679d6a9bf11f",
  "converted_at_beijing": "2026-10-11T19:07:12+08:00"
 }
}
---

::screen{#personal-media-local-ingest-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-01",
  "section": "top",
  "title": "一个已复核文件，精确进入原件中心与两套恢复计划",
  "links": [
   {
    "text": "回到项目 → 照片视频录音管理",
    "href": "/projects/personal-media/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-media/#ai-brief"
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
     "text_ref": "一个已复核文件，精确进入原件中心与两套恢复计划",
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
       "text": "在用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · 源码按 10 月 10 日版本，10 月 11 日只读核对；本次没有接入任何真实新文件、没有跑测试",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 照片视频录音管理〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人媒体整理与恢复 · 功能说明",
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
     "text_ref": "一个已复核文件，精确进入原件中心与两套恢复计划",
     "align": "left",
     "size": "large"
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
     "static_note": "截至 10 月 11 日 · 源码按 10 月 10 日版本，10 月 11 日只读核对；本次没有接入任何真实新文件、没有跑测试"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 照片视频录音管理〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "个人媒体整理与恢复 · 功能说明"
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
   "asset": "_library/module-illustrations/personal-media/local-ingest-v01.png",
   "key": "main-personal-media",
   "source_phrase": "”），左边不画竖线，〔〕里的字画成绿色链接字；为放下这一行，插画可以再略缩。",
   "sha256": "6b06e94d938065071b4402ac80cfcc94d6e5febc0ad05f46ce6d9bd56fc7f0bd",
   "status": "ready"
  }
 ]
}
```

# 一个已复核文件，精确进入原件中心与两套恢复计划

〔回到项目 → 照片视频录音管理〕　〔复制 AI 续作说明〕

个人媒体整理与恢复 · 功能说明

把已经核对并决定保留的一份本地图片、视频或录音，接入现有媒体库，同时保存恢复副本并更新查找记录，不需要把它混进一批手机文件。暂存文件只要放在 E 盘路径下就行：和原件目录在同一块真实磁盘时直接建链接，不在同一块时先复制、核对一致后再落位。

**当前情况：**单文件接入、登记已在媒体库里的原件、复用已有的同内容原件都可用；E 盘路径内跨真实磁盘的复制核对已经实现并有测试定义（10 月 11 日核对代码）。本次没有接入真实新文件。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#personal-media-local-ingest-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-02",
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

一份文件可能来自电脑，也可能是同一段画面的另一种文件封装，或者和库里已有的某份内容完全一样。全部当新作品会重复保留；还没核对就删除，又可能丢掉唯一的完整版本。

## 举个实际例子

我可以说：“这个本地 MP4 看起来只是现有视频的另一种封装，核对后再接入，别重复保存两份正式原件。”系统会比较两份文件里的首路视频流；一致就只把变体留作恢复材料并记录关系，无法确认就不动来源文件。如果这份文件和库里已有的内容字节完全相同，就直接复用现有原件，不新增条目。

## 最后我会得到什么

新的保留内容在媒体原件目录落位，并在 G 盘留下恢复副本，查找目录和后续手机、云端计划随之更新；回执写明这次是同盘链接还是跨盘复制核对。确证重复的视频变体会保留恢复副本和与主版本的对应关系，再退出原暂存位置。失败时说明已保存了哪些文件、哪一步还没完成。

::screen{#personal-media-local-ingest-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-03",
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
     "text_ref": "成功时",
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
     "text_ref": "成功时",
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

## 成功时

原文件仍是之前确认的那一份、目标也没有冲突；媒体原件与 G 盘副本检查一致，查找记录和后续恢复计划已更新，再说明原暂存文件的处理结果。

## 发现问题时

分类、时间、主版本或视频重复关系还不能确认时，先保留文件，指出需要补看的画面或信息，不猜一个归属后直接接入。

## 入口不可用时

文件直接放在 C、D 或 G 盘时拒绝，需要先经授权复制到 E 盘暂存，再只处理那份副本，原始文件不删。视频检查工具、原件目录、G 盘、目标位置或计划更新不可用时，停止对应步骤并报告已有副本；跨盘复制失败保留来源、不覆盖目标。不会临时改成手机批次处理或自动上传。

::screen{#personal-media-local-ingest-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-04",
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
     "text_ref": "1. **系统核对并处理**　核对类型和字节；已有同内容原件就复用，新原件按真实磁盘建链接或复制核对后写入正式目录，并做异卷恢复副本；容器变体先证明视频流一致才记录关系。",
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
     "text_ref": "1. **系统核对并处理**　核对类型和字节；已有同内容原件就复用，新原件按真实磁盘建链接或复制核对后写入正式目录，并做异卷恢复副本；容器变体先证明视频流一致才记录关系。",
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

点名一个已人工复核、放在 E 盘路径下的本地照片、视频或录音，请 AI 接入媒体中心。

## 需要准备什么

- 明确源文件与预期内容

- 类别和说明

- 视频容器变体才需指明既有主版本

## 从开始到拿到结果

1. **系统核对并处理**　核对类型和字节；已有同内容原件就复用，新原件按真实磁盘建链接或复制核对后写入正式目录，并做异卷恢复副本；容器变体先证明视频流一致才记录关系。

2. **交付与接续**　交回落位方式、目录、来源退休、手机与云候选的结果；哈希、目标或主版本不符时保留源文件。

::screen{#personal-media-local-ingest-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-05",
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
     "text_ref": "1. 命令必须显式 --execute；没有只写计划后自动接入的后台路径。",
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
     "text_ref": "1. 命令必须显式 --execute；没有只写计划后自动接入的后台路径。",
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

**10 月 11 日核对代码**　ingest-file 强制 --execute，源文件必须是已复核的 E 盘路径；同真实磁盘用硬链接，E 盘路径内跨真实磁盘用“复制到目标目录临时文件、落盘、核对大小和 SHA-256、不覆盖落位”，回执里写为 same_volume_hardlink 或 cross_volume_copy_readback。--register-existing 可把媒体根内漏登记的原件就地登记。本次只核对代码，没有执行真实接入。

## 关键规则与设计选择

1. 命令必须显式 --execute；没有只写计划后自动接入的后台路径。

2. 整理顺序在新增、复查和续作中相同：无意义退出，精确／高度近重复择优，再按全库统一严格标准判断精选；不因一批新媒体要交付就凑精选。

3. 裁剪、压缩、水印、边框和轻微界面变化不自动构成独立价值；不同凭据状态、重要文字或场景信息仍须保留。

4. 源文件必须在 E 盘路径下；直接给 C、D、G 盘文件拒绝。--register-existing 仅对中心内已选择原件就地登记，不移动、不退休输入，不能与等价变体并用，相同哈希但不同位置拒绝覆盖。

5. 已登记的同哈希内容先核对现有 E/G 原件，复用原分类和位置，不新增条目、序号或恢复候选，副本核对后才退休暂存输入；来源新不等于内容新。

6. 新 keeper 需要 category；日期可明确选择，也可保留时间未知。普通新增默认不进入手机包，明确 --phone-recovery 与 --phone-recovery-reason 才赋予普通内容手机资格。

7. 等价视频变体必须绑定现役 keeper SHA-256，并证明首路解复用视频流完全相同；这不说明所有音轨、字幕和封装信息都一样。

8. 音乐和铃声进音乐根，录音统一进唯一的录音目录，按个人录音、通话、应用等来源加前缀，不另建来源子目录；音频不进手机包或 Photos。

::screen{#personal-media-local-ingest-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-06",
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
     "text_ref": "9. ingest-file 刷新本地目录、手机计划和云端期望候选；这一个命令不调用云提供者，后续 cloud-sync 负责实际上传。",
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
     "text_ref": "9. ingest-file 刷新本地目录、手机计划和云端期望候选；这一个命令不调用云提供者，后续 cloud-sync 负责实际上传。",
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

9. ingest-file 刷新本地目录、手机计划和云端期望候选；这一个命令不调用云提供者，后续 cloud-sync 负责实际上传。

10. SQLite 与 E/G 文件动作不是一个跨文件系统原子事务；入口逐层回读，但中断后仍要按现存副本和回执恢复。

## 当前怎样实现

- 解析 source 并确认是 E 盘路径；普通路线拒绝原件根内文件，--register-existing 则要求原件已在媒体根内。计算大小和 SHA-256，给了 expected_sha256 时必须匹配。

- ffprobe 判断视频或音频；新 keeper 用 category、secondary 和可选 formation-date 选择正式目录。

- 新 keeper 与目标同一真实磁盘时用 os.link 建硬链接；不同真实磁盘时复制到目标目录的临时文件、fsync、核对大小与 SHA-256，再无覆盖改名落位。随后向 G 精确复制并回读，事务写入目录后退休 E 暂存名。

- 等价变体先核对 keeper 当前存在、keeper E/G SHA-256 与两边首路视频流；再把变体精确复制到 G 的变体区、记录关系、退休 source 并更新退休状态。

- 各条路线都刷新当前 seed 与产品候选，写最小接入回执（含 canonical_placement 和 storage_layout）；cloud_upload 固定为 0。

- update-entry 按单一 SHA-256 与 --execute 定位已登记 keeper，可更新具名相册（1–120 字符，只用于图片，固定的证件和特殊图片相册不能换名）、本人确认的地点和日期以及既有恢复资格；只先推进本地 seed 和候选，返回 external_provider_calls=0。云端、手机写回及新增原件保全分别处理。

::screen{#personal-media-local-ingest-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-07",
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
     "text_ref": "1. 选择一个已复核、位于 E 盘路径的 source",
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
     "text_ref": "1. 选择一个已复核、位于 E 盘路径的 source",
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

## 执行流程

1. 选择一个已复核、位于 E 盘路径的 source

2. 绑定预期哈希和说明

3. 探测媒体类型

4. 已有同内容就复用；否则选择新 keeper 或等价变体合同

5. 按真实磁盘选链接或复制核对落位

6. E/G 回读

7. 写目录与关系

8. 退休 E 暂存名

::screen{#personal-media-local-ingest-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-08",
  "section": "tech",
  "title": "技术实现与依据（四）",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "9. 刷新 seed 和两套候选",
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
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "9. 刷新 seed 和两套候选",
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

## 技术实现与依据（四）

9. 刷新 seed 和两套候选

10. 写回执

::screen{#personal-media-local-ingest-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-09",
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
| Independent local increment（独立本地增量） | 不属于手机 capture、但已经明确选择的单个媒体文件。 |
| Demuxed video stream（解复用视频流） | 从容器中抽出的实际视频流哈希；首路视频流相同才支持“只是容器不同”的判断。 |
| Content-equivalent variant（内容等价变体） | 字节和容器不同，但已证明视频流与现役 keeper 相同；保留恢复副本和关系，不再作为第二个 keeper 浏览。 |
| 落位方式 | same_volume_hardlink 是同一真实磁盘上的硬链接；cross_volume_copy_readback 是跨真实磁盘复制并核对后落位。 |

## 专业定义

手机不是唯一入口。一个已经人工看过、放在 E 盘路径下的本地照片、视频或录音，可以单独接入；同一视频流的另一种容器也能保留恢复副本后退出浏览库；已有同内容的直接复用。

::screen{#personal-media-local-ingest-10 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-10",
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
     "text_ref": "- 不批量扫描目录。",
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
     "text_ref": "- 不批量扫描目录。",
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

解决非手机本地新增、一次性脚本膨胀、同视频流容器重复、同内容重复入库、源文件退休无恢复副本、暂存和原件不在同一磁盘，以及目录／恢复计划不同步。

## 边界

- 不批量扫描目录。

- 普通暂存接入不接受原件根内文件；已在媒体中心的明确原件可以 --register-existing 就地登记，不移动原件。

- 不直接接入 C、D、G 盘文件；跨盘只在 E 盘路径之内做复制核对。

- 不靠文件名宣布视频等价。

- 不把 --execute 扩张成云上传或手机删除授权。

- 不声称跨 E/G/SQLite 的绝对原子回滚。

## 失败与恢复

- **输入 SHA-256 与预期不同**：在创建正式原件、G 副本或目录状态前失败，要求重新确认当前字节。

- **源文件在 C、D 或 G 盘**：拒绝；先经授权复制到 E 盘暂存，只处理那份副本，原始文件不删。

::screen{#personal-media-local-ingest-11 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-11",
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
     "text_ref": "- **跨盘复制或核对失败**：保留来源，不覆盖目标，不退休暂存文件。",
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
     "text_ref": "- **跨盘复制或核对失败**：保留来源，不覆盖目标，不退休暂存文件。",
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

- **跨盘复制或核对失败**：保留来源，不覆盖目标，不退休暂存文件。

- **新 keeper 没有 category 或目标已有不同字节**：拒绝接入，不覆盖目标，也不退休 source。

- **登记已有原件时相同哈希在别的位置**：拒绝覆盖。

- **等价 keeper 不存在、E/G 回读失败或视频流不同**：不建立等价关系，不复制／退休变体。

- **目录提交后 seed／候选刷新失败**：保留已经读回的正式原件与 G 字节和具名失败位置；按当前目录与回执恢复，不把部分状态冒充完整收口。

::screen{#personal-media-local-ingest-12 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-local-ingest-12",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 分类、质量与去重",
    "href": "/projects/personal-media/classification/"
   },
   {
    "text": "下一个模块 手机双盘保全",
    "href": "/projects/personal-media/phone-preservation/"
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
     "text_ref": "- personal_media.py　ingest-file、同内容复用、新 keeper、跨盘复制核对、等价容器变体、seed 与候选刷新",
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
     "text_ref": "- personal_media.py　ingest-file、同内容复用、新 keeper、跨盘复制核对、等价容器变体、seed 与候选刷新",
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

- personal_media.py　ingest-file、同内容复用、新 keeper、跨盘复制核对、等价容器变体、seed 与候选刷新

- test_personal_media.py　隔离临时根中的新 keeper、E/G、目录、来源退休、候选刷新与等价视频容器专项回归

- test_storage_compatibility.py　跨真实磁盘复制核对的测试定义

- README.md　精确命令、输入、回读、半状态恢复与依赖说明

## 如何验证

- 源码和 README 均要求 --execute、一个 source、description 与可选 expected SHA-256。

- 专项回归证明新 keeper 的正式原件、G 副本、目录、source 退休、当前 seed、手机计划和云计划同次刷新。

- 专项回归证明等价视频的 E/G keeper、相同首路视频流、G 原始容器变体、关系写回和 source 退休。

- 2026-09-05 的验收运行 55 项测试、0 失败／错误（历史记录）；最近一份本地验收回执是 9 月 24 日：186 项运行、2 项跳过、0 失败；源码现有 453 个测试函数（10 月 11 日静态计数）。跨盘复制核对有测试定义，但本次没有运行，不等于生产接入已经成功过。

## 与其他模块的关系

它是手机之外的单文件入口；完成后仍回到同一个当前目录、手机恢复候选和云端期望集合；实际云同步仍由同项目的 cloud-sync 完成，不建立第二套媒体库。
