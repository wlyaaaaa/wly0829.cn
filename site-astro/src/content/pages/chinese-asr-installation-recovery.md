---
{
 "title": "安装、模型工件与离线恢复",
 "kind": "project",
 "url": "/projects/chinese-asr/installation-recovery/",
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
  "page": "chinese-asr-installation-recovery",
  "kind": "project",
  "title": "安装、模型工件与离线恢复",
  "url": "/projects/chinese-asr/installation-recovery/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）与 9 月 29 日建成的 E 盘离线备用包（提交 f4d75fc），于 10 月 11 日按 14:00 前状态只读核对文件存在与大小；离线安装自检取 9 月 29 日历史记录。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-installation-recovery/page.json",
  "sha256": "6860e0fa65c8c1d876d5d52615874ef0198ef20d242af0a3255a70b8d9fc4a6d",
  "converted_at_beijing": "2026-10-30T15:12:30+08:00"
 }
}
---

::screen{#chinese-asr-installation-recovery-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-01",
  "section": "top",
  "title": "安装、模型工件与离线恢复",
  "links": [
   {
    "text": "回到项目 → 中文语音转写",
    "href": "/projects/chinese-asr/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/ChineseASR"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/chinese-asr/#ai-brief"
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
     "text_ref": "安装、模型工件与离线恢复",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）与 9 月 29 日建成的 E 盘离线备用包（提交 f4d75fc），于 10 月 11 日按 14:00 前状态只读核对文件存在与大小；离线安装自检取 9 月 29 日历史记录。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "升级或换机前，我能分清缺的是 Python 依赖、固定权重还是 FireRed 的 WSL（Windows 的 Linux 子系统）。E 盘另存着一份当前在用模型和锁定版本依赖的离线备用包，上游撤包或暂时没网也能装回来。想换默认模型时，先用相同参考语料比较错误与复核代价，再明确切换并留回退点；不会因为下载完成、目录存在或公开分数更高，就偷偷换掉日常路线。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有模型安装、比较、切换和回退入口；9 月 29 日建好一份本机离线备用包（约 35.26 GiB），在新建的 Windows 和 Ubuntu 环境里不连软件源安装并自检通过过。真正拔网线的断网安装、新环境里的 GPU 推理和换到另一台电脑恢复，还没有验证。",
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
     "text_ref": "安装、模型工件与离线恢复",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）与 9 月 29 日建成的 E 盘离线备用包（提交 f4d75fc），于 10 月 11 日按 14:00 前状态只读核对文件存在与大小；离线安装自检取 9 月 29 日历史记录。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "升级或换机前，我能分清缺的是 Python 依赖、固定权重还是 FireRed 的 WSL（Windows 的 Linux 子系统）。E 盘另存着一份当前在用模型和锁定版本依赖的离线备用包，上游撤包或暂时没网也能装回来。想换默认模型时，先用相同参考语料比较错误与复核代价，再明确切换并留回退点；不会因为下载完成、目录存在或公开分数更高，就偷偷换掉日常路线。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有模型安装、比较、切换和回退入口；9 月 29 日建好一份本机离线备用包（约 35.26 GiB），在新建的 Windows 和 Ubuntu 环境里不连软件源安装并自检通过过。真正拔网线的断网安装、新环境里的 GPU 推理和换到另一台电脑恢复，还没有验证。"
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
   "asset": "_library/illustrations/modules/chinese-asr/installation-recovery/installation-recovery-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "54181f59cef627c095a3b26bf09f631144618efa8c9e3ed69859fafff5b84f00",
   "status": "ready"
  }
 ]
}
```

# 安装、模型工件与离线恢复

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

升级或换机前，我能分清缺的是 Python 依赖、固定权重还是 FireRed 的 WSL（Windows 的 Linux 子系统）。E 盘另存着一份当前在用模型和锁定版本依赖的离线备用包，上游撤包或暂时没网也能装回来。想换默认模型时，先用相同参考语料比较错误与复核代价，再明确切换并留回退点；不会因为下载完成、目录存在或公开分数更高，就偷偷换掉日常路线。

**当前情况：**已有模型安装、比较、切换和回退入口；9 月 29 日建好一份本机离线备用包（约 35.26 GiB），在新建的 Windows 和 Ubuntu 环境里不连软件源安装并自检通过过。真正拔网线的断网安装、新环境里的 GPU 推理和换到另一台电脑恢复，还没有验证。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-installation-recovery-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 源码、运行依赖与模型文件是三种东西；只保留其中一份，换机或断网时可能到最后才发现根本跑不起来。上游也可能撤掉某个版本的安装包。先查缺的层，再从可信的备份恢复。 ## 举个实际例子 "
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 源码、运行依赖与模型文件是三种东西；只保留其中一份，换机或断网时可能到最后才发现根本跑不起来。上游也可能撤掉某个版本的安装包。先查缺的层，再从可信的备份恢复。 ## 举个实际例子 "
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
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "asset": "_library/hires-icons/试管对勾.png",
   "key": "绿色测试通过",
   "source_phrase": "冻结页迁移固定图标：normal",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "key": "报警灯",
   "source_phrase": "冻结页迁移固定图标：problem",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "key": "断开插头",
   "source_phrase": "冻结页迁移固定图标：unavailable",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  }
 ]
}
```

## 这项功能怎样使用

用途与实际影响

## 为什么需要它

源码、运行依赖与模型文件是三种东西；只保留其中一份，换机或断网时可能到最后才发现根本跑不起来。上游也可能撤掉某个版本的安装包。先查缺的层，再从可信的备份恢复。

## 举个实际例子

比如我问“上游撤了一个依赖包、这台电脑又暂时没网，怎样把 ChineseASR 重新装到能跑严格转写？”系统会先核对 E 盘离线备用包里的两套依赖锁、离线轮包和校验清单，只用本地轮包重建 Windows 虚拟环境；需要 FireRed 时再验证新的 WSL 环境，并把缺失的模型和固定版本的 FireRed 源码从包里补回，已有但哈希对不上的模型不会被覆盖。最后必须跑默认 strict 冒烟；重要证据路线还要另跑 FireRed + Qwen 冒烟并人工核听。

## 最后我会得到什么

交回这台机器哪些识别路线真的能运行、缺哪些依赖或模型文件、恢复后是否通过小段真实声音检查，以及离线备用包是否还和当前配置对得上。想换默认模型时还会交回同材料比较与可回退的配置决定；只下载完成不能算可用。

## 正常时

运行依赖、对应模型文件和一次实际试跑都通过后，才把这条路线标为可用；重要录音的质量仍需单独回听。

## 发现问题时

只修好一部分时保留已经核对的结果，指出缺的层；修额外路线不会顺手改掉日常路线。

## 入口不可用或证据不足时

离线备用包、模型文件或必要系统环境缺失时，只停受影响路线，不猜版本或找相似模型顶替。离线备用只有 E 盘这一份，E 盘整盘损坏时它也一起不可用。

::screen{#chinese-asr-installation-recovery-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-03",
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

运行依赖、对应模型文件和一次实际试跑都通过后，才把这条路线标为可用；重要录音的质量仍需单独回听。

## 发现问题时

只修好一部分时保留已经核对的结果，指出缺的层；修额外路线不会顺手改掉日常路线。

## 入口不可用或证据不足时

离线安装材料、模型文件或必要系统环境缺失时，只停受影响路线，不猜版本或找相似模型顶替。

::screen{#chinese-asr-installation-recovery-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-04",
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
     "text_ref": "安装、升级、换机或模型加载失败时，要求核对依赖和固定模型；升级模型、依赖或默认路线时，同一轮刷新离线备用包。",
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
     "text_ref": "1. **系统核对并处理**　分清 Python、显卡、固定权重及特殊环境缺哪层，只恢复当前路线所需部分并核对真实装载；没网时从 E 盘离线备用包取依赖和缺失的模型。",
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
     "text_ref": "安装、升级、换机或模型加载失败时，要求核对依赖和固定模型；升级模型、依赖或默认路线时，同一轮刷新离线备用包。"
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
     "text_ref": "1. **系统核对并处理**　分清 Python、显卡、固定权重及特殊环境缺哪层，只恢复当前路线所需部分并核对真实装载；没网时从 E 盘离线备用包取依赖和缺失的模型。",
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

安装、升级、换机或模型加载失败时，要求核对依赖和固定模型；升级模型、依赖或默认路线时，同一轮刷新离线备用包。

## 需要准备什么

- 遇到的安装或加载故障

- 这次要使用的识别用途

## 从开始到拿到结果

1. **系统核对并处理**　分清 Python、显卡、固定权重及特殊环境缺哪层，只恢复当前路线所需部分并核对真实装载；没网时从 E 盘离线备用包取依赖和缺失的模型。

2. **交付与接续**　用小样本确认运行与回退点；下载完成、目录存在或离线安装自检通过，都不等于模型可用。

::screen{#chinese-asr-installation-recovery-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 固定模型、候选比较及配置切换/回退已实现；9 月 29 日建成 Windows＋FireRed WSL 离线备用包，新环境无索引安装与自检有历史通过，真断网"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 固定模型、候选比较及配置切换/回退已实现；9 月 29 日建成 Windows＋FireRed WSL 离线备用包，新环境无索引安装与自检有历史通过，真断网"
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
     "text_ref": "1. 桌面听写用 scripts/dictation.ps1 -Mode Install 安装额外依赖、创建 ChineseASR Dictation 登录自启并立即启动；Status/Stop/Start 读回与停启，Uninstall 移除登录自启、保留项目和模型。",
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
     "text_ref": "1. 桌面听写用 scripts/dictation.ps1 -Mode Install 安装额外依赖、创建 ChineseASR Dictation 登录自启并立即启动；Status/Stop/Start 读回与停启，Uninstall 移除登录自启、保留项目和模型。",
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

固定模型、候选比较及配置切换/回退已实现；9 月 29 日建成 Windows＋FireRed WSL 离线备用包，新环境无索引安装与自检有历史通过，真断网、新环境 GPU 和跨机恢复未验

## 关键规则与设计选择

1. 桌面听写用 scripts/dictation.ps1 -Mode Install 安装额外依赖、创建 ChineseASR Dictation 登录自启并立即启动；Status/Stop/Start 读回与停启，Uninstall 移除登录自启、保留项目和模型。

2. requirements-core.txt 固定 FunASR 1.4.14 与 NumPy 1.26.4，满足 NumPy <2；requirements-dictation.txt 增加 sounddevice 0.5.6、pystray 0.19.5、Pillow >=10。Qwen ASR（自动语音识别） 0.0.6、Torch 2.11.0+cu128、Transformers 4.57.6 维持。

3. 新机在线安装与断网恢复使用同一模型 Registry（登记清单），但依赖获取方式不同；模型、依赖或默认路线升级时同轮用 refresh-offline 刷新离线备用，没有定时任务或后台更新。

4. 项目要求 Python >=3.11；Windows 当前环境是 3.11.9，FireRed WSL（Windows 的 Linux 子系统） 固定 3.12.3。

5. Windows PyTorch/TorchAudio 从 CUDA 12.8 index 安装；在线脚本不固定精确 torch 版本，离线可复现性由健康环境导出的 lock 和 wheelhouse 承担。

6. requirements-core 固定 FunASR 1.4.14 与 NumPy 1.26.4，Qwen runtime（运行环境） 固定 qwen-asr 0.0.6；FireRed 在 WSL（Windows 的 Linux 子系统） 中使用自己的一组精确依赖和 PyTorch/TorchAudio 2.10.0+cu128。

7. Qwen 和 FireRed 只接受固定 repository/revision 与规范 MODEL_RECEIPT，文件缺失、大小或 SHA-256 漂移都在模型加载前失败关闭。

8. 离线备用分开 Windows 与 Linux 两套依赖锁和 wheelhouse，不能混装；模型权重和固定 FireRed 源码归档作为单独部分放进同一个包，私人录音、输出和虚拟环境本身不进包。

::screen{#chinese-asr-installation-recovery-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-06",
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
     "text_ref": "9. setup、download、Doctor、unit test、离线安装自检、runtime（运行环境） smoke 与真实录音 E2E（端到端验证） 是不同证据层，不能互相代替。",
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
     "text_ref": "9. setup、download、Doctor、unit test、离线安装自检、runtime（运行环境） smoke 与真实录音 E2E（端到端验证） 是不同证据层，不能互相代替。",
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

9. setup、download、Doctor、unit test、离线安装自检、runtime（运行环境） smoke 与真实录音 E2E（端到端验证） 是不同证据层，不能互相代替。

10. 模型候选先用独立配置跑同语料 baseline/high_quality 评测，比较通过且输入/代码/配置仍匹配后才明确 activate-profile；旧权重和运行依赖独立保留，回退不覆盖后来修改的默认引擎。

## 当前怎样实现

- pyproject.toml 要求 Python >=3.11；install-torch-cu128-direct.ps1 创建项目 .venv，从 CUDA 12.8 index 安装 PyTorch/TorchAudio 并现场打印 CUDA 可用性和设备。

- setup-core.ps1 安装 requirements-core.txt、editable（可编辑）项目，依次运行 pip check 和 zh_asr doctor；镜像不能满足时回退官方 PyPI。

- setup-qwen.ps1 在同一 Windows .venv 安装 qwen-asr==0.0.6；download-models.ps1 从 ModelScope 获取 Qwen/Qwen3-ASR-1.7B 固定 revision a04930dbe5419bfee073f7cade734f572689a3a8。

- qwen_identity.py 定义 13 个规范必要文件及其固定字节数/SHA-256；MODEL_RECEIPT 还绑定 schema（数据结构）、repository 和 revision，adapter（执行适配器） 在 Qwen3ASRModel.from_pretrained 前验证 runtime（运行环境）、回执与实际文件。

- setup-firered.ps1 在 Ubuntu WSL（Windows 的 Linux 子系统） 的 /opt/chineseasr/firered/.venv 建隔离环境，固定 FireRedASR2S commit 4e7d9aaf4482a47cec1724807026b9b151926eb5，验证 imports 与 CUDA 并回读 BF16 支持；Windows 默认模型配置不被改写。

- FireRed WSL（Windows 的 Linux 子系统） 依赖由 requirements-firered.txt 精确约束，含 Transformers 5.1.0、NumPy 2.4.2 等；Torch/TorchAudio 固定 2.10.0+cu128 并单独安装。

::screen{#chinese-asr-installation-recovery-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-07",
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
     "text_ref": "- download-models.ps1 从 Hugging Face 获取 FireRedTeam/FireRedASR2-LLM 固定 revision 2c5e0f415b9afb8f67cb8b00ea4c54959f70e824，并为 14 个必要文件原子生成带路径、大小和 SHA-256 的 MODEL_RECEIPT。",
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
     "text_ref": "- download-models.ps1 从 Hugging Face 获取 FireRedTeam/FireRedASR2-LLM 固定 revision 2c5e0f415b9afb8f67cb8b00ea4c54959f70e824，并为 14 个必要文件原子生成带路径、大小和 SHA-256 的 MODEL_RECEIPT。",
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

- download-models.ps1 从 Hugging Face 获取 FireRedTeam/FireRedASR2-LLM 固定 revision 2c5e0f415b9afb8f67cb8b00ea4c54959f70e824，并为 14 个必要文件原子生成带路径、大小和 SHA-256 的 MODEL_RECEIPT。

- export-lock.ps1 与 build-wheelhouse.ps1 为 Windows 和 FireRed Linux 分别导出依赖锁、下载轮包（当前 Windows 129 个、Linux 68 个），torch 系依赖走 CUDA 12.8 index，其余走 PyPI，并写出逐文件大小与 SHA-256 的清单；offline_bundle.py 管整包清单与模型选择。

- refresh-offline.ps1 串起两套依赖锁和轮包、按配置选模型、源文件与副本 SHA 校验、整包回读和新环境无索引安装自检；全部完成才把候选切成 offline/current，旧版进回收站，任何一步失败都保留旧版。

- verify-wheelhouse.ps1 逐项检查清单内文件存在与 SHA-256；install-offline.ps1 默认先验证，-Venv 用 --no-index --find-links 建 Windows 环境并运行 pip check 与 Doctor，-VerifyLinux/-LinuxVenv 验证新的 WSL 环境，-RestoreModels 补回缺失模型和固定 FireRed 源码，已有但哈希不同的模型拒绝覆盖。两种 Python 须先可用，项目源码先从可信 Git 恢复；原 .venv 丢失时可显式提供 HostPython；Windows 目标须在 E 盘，WSL 临时路径在 E 盘的 Ubuntu 虚拟磁盘内。

- runtime（运行环境）/firered_worker.py 在哈希大权重和加载前同时验证固定源码 HEAD/干净工作树、模型回执、WSL（Windows 的 Linux 子系统） 配置容量和当前可用容量；半精度与 FP32 使用不同门槛。

- model_lifecycle 的 compare 验相同音频/真值/指标、独立样本规模、无重复或无效数据；纯合成、跳过案例或未改善拒绝提升。activate-profile 用当前代码/配置身份只切 strict 两个默认引擎并保存switch.json；rollback拒绝覆盖后来改变的默认值，保留无关设置。权重、运行依赖和驻留进程仍需各自恢复。

## 执行流程

1. 联网健康环境先用 install-torch-cu128-direct.ps1、setup-core.ps1 建立 Windows 基线；需要 strict 时再 setup-qwen.ps1，需要 FireRed 时另建 WSL（Windows 的 Linux 子系统） 隔离环境。

2. 按显式 engine 下载固定模型；Qwen 和 FireRed 生成/验证 MODEL_RECEIPT，SenseVoice、Paraformer 等常规模型进入 Git 忽略的 ModelScope 缓存。

::screen{#chinese-asr-installation-recovery-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-08",
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
     "text_ref": "3. 环境通过 pip check/Doctor 后，由 refresh-offline 导出 Windows 与 Linux 两套依赖锁、下载两套轮包，并按当前配置选出要备份的模型。",
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
     "text_ref": "3. 环境通过 pip check/Doctor 后，由 refresh-offline 导出 Windows 与 Linux 两套依赖锁、下载两套轮包，并按当前配置选出要备份的模型。",
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

3. 环境通过 pip check/Doctor 后，由 refresh-offline 导出 Windows 与 Linux 两套依赖锁、下载两套轮包，并按当前配置选出要备份的模型。

4. 对模型源文件和副本做 SHA 校验，整包回读，再在新建环境里做无索引安装自检；全部通过才切成 E 盘的 offline/current，旧版进回收站。

5. Git 仓库只保存源码、脚本和小型 manifest（清单）；离线包、模型和输出都被 Git 忽略，项目源码另从可信 Git 恢复。

6. 断网时先验证清单，再由 install-offline.ps1 无索引建 Windows 环境、验证新的 WSL 环境，并按需补回缺失模型和固定 FireRed 源码；正常验收不使用 SkipVerify。

7. 恢复 Qwen 时核对固定 revision、13 项必要文件和回执；恢复 FireRed 时再核对 14 项权重、固定源码 commit、干净工作树、WSL（Windows 的 Linux 子系统） Python/CUDA 与内存门槛。

8. 同一 adapter（执行适配器） 替换模型时先更新 Registry（登记清单） 与身份合同，再下载工件；新增不同 runtime（运行环境） 时新增 adapter（执行适配器），不在旧 profile 下伪装。

9. 最后运行默认 strict 与 smoke-asr-smart；FireRed + Qwen 还运行 smoke-evidence-asr 并核对每段 verified、非空 raw、dtype、无 engine_failure，关键语句人工回听。

::screen{#chinese-asr-installation-recovery-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-09",
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
| dependency lock（依赖锁） | 从一套健康环境冻结的精确 Python 包版本；online requirements 中的下限不能替代它。 |
| wheelhouse（离线轮包仓库） | 为 lock 预下载的 Python wheel 集合；它让 pip 在断网时安装，但不含模型权重。 |
| checksum manifest（校验清单） | wheelhouse.sha256 逐文件验哈希，wheelhouse.json 另记录 lock 哈希、文件大小和 SHA-256。 |
| MODEL_RECEIPT（模型回执） | 绑定模型仓库、固定 revision、规范文件列表、字节数和 SHA-256；它验证已有工件，不负责备份工件。 |
| pinned revision（固定修订） | 精确锁定模型或源码版本，防止同一名称在恢复后实际变成另一份内容。 |
| runtime smoke（运行冒烟） | 实际加载模型并从入口生成最终制品；比安装、Doctor 和单元测试更接近可用性。 |

## 专业定义

把新机安装、断网重建与模型抢修拆成三组可核对工件：依赖包、固定模型缓存与回执、FireRed WSL（Windows Linux 子系统）运行时；E 盘再把当前在用的三者合成一份离线备用包。下载完、装完都还得跑真实冒烟。

解决什么

解决代码都在但环境跑不起来、上游撤包或断网后才发现依赖或模型没预存、模型目录部分损坏却仍被加载、FireRed WSL（Windows 的 Linux 子系统） 因版本或存储容量漂移在重载时失败，以及换模型只改配置却没有重新验收真实转写的问题。

::screen{#chinese-asr-installation-recovery-10 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-10",
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
     "text_ref": "失败与恢复",
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
     "text_ref": "失败与恢复",
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

解决代码都在但环境跑不起来、断网后才发现依赖或模型没预存、模型目录部分损坏却仍被加载、FireRed WSL（Windows 的 Linux 子系统） 因版本或存储容量漂移在重载时失败，以及换模型只改配置却没有重新验收真实转写的问题。

## 边界

- offline/current、models、输出与私人音频都被 Git 忽略；公开仓库不是灾备载体。离线备用只有 E 盘项目里这一份，按现有登记不由日常备份另复制到 G、H 盘：它防上游撤包和本机无网重装，E 盘整盘损坏时同样不可用。

- 离线备用已能重建 Windows 环境、验证新的 FireRed WSL 环境并补回缺失模型和固定源码；但真正拔网线断网安装、新 WSL 环境里的 GPU 录音推理和换到另一台电脑恢复，都还没有验证。

- MODEL_RECEIPT 不是模型文件、备份、数字签名或真实推理证明；只有工件仍在时才能逐项校验。

- verify-wheelhouse 校验清单内文件的存在与 SHA-256，不证明 Python ABI、GPU 驱动或新机器硬件兼容；必须实际 install smoke。

- FireRed 半精度至少要求 28 GiB RAM、34 GiB RAM+swap，启动时至少 18 GiB MemAvailable、22 GiB MemAvailable+SwapFree；FP32 对应 40/48 GiB 与 36/44 GiB。

- 当前 32 GiB WSL（Windows 的 Linux 子系统） RAM + 8 GiB swap（10 月 11 日 .wslconfig 仍是这组值）是这台机器的验证配置，不是所有硬件的统一承诺。

- 模型下载、环境体检、离线安装自检和源码测试都不能替代真实音频 E2E（端到端验证）；重要录音还必须人工核听。

- 模型目录缺失或损坏时先验真再修复；离线包能补回缺失的模型文件，但不覆盖哈希不同的已有文件。离线安装自检通过不能声称完整断网换机和 GPU 恢复已经验收。

## 失败与恢复

::screen{#chinese-asr-installation-recovery-11 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-11",
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
     "text_ref": "- **断网时离线备用包缺失或不完整**：明确判定无法离线重建；回到有网络且已验证的健康环境用 refresh-offline 重新制备，不从未知缓存猜版本。",
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
     "text_ref": "- **断网时离线备用包缺失或不完整**：明确判定无法离线重建；回到有网络且已验证的健康环境用 refresh-offline 重新制备，不从未知缓存猜版本。",
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

- **断网时离线备用包缺失或不完整**：明确判定无法离线重建；回到有网络且已验证的健康环境用 refresh-offline 重新制备，不从未知缓存猜版本。

- **wheel 文件缺失或 SHA-256 不一致**：verify-wheelhouse 失败并阻断安装；从可信源重新构建或恢复完整轮包，不使用 SkipVerify 绕过正常验收。

- **离线备用刷新中途失败**：候选不切成 current，原来的离线备用原样保留；排查失败那一步后重新刷新。

- **offline pip install、pip check 或 Doctor 失败**：保留失败包与错误，丢弃这次未通过的 venv，使用已验证的锁和轮包重建；不改变模型默认路由。

- **Qwen receipt（执行回执）、runtime（运行环境） 版本或 13 项必要文件漂移**：在模型 loader 前失败关闭；从固定 revision 重取或从离线备用、可信备份恢复，并重新生成/核验规范回执。

- **FireRed 模型回执、固定源码 HEAD 或干净工作树不符**：拒绝加载；恢复固定 14 项权重与 pinned checkout（本地检出目录），不在被修改源码上继续证据路线。

- **FireRed WSL（Windows 的 Linux 子系统） 配置总量不足**：先调整 .wslconfig；在没有重要 WSL（Windows 的 Linux 子系统）/Docker 任务时执行 wsl（Windows 的 Linux 子系统） --shutdown 后重新启动，再复核容量。

- **FireRed 配置足够但当前可用内存不足**：关闭或等待占用进程后重试，不把临时争用误报为模型损坏，也不让 OOM 后反复装载。

::screen{#chinese-asr-installation-recovery-12 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-12",
  "section": "tech",
  "title": "出问题时（三）",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **已有模型文件与离线包哈希不同**：-RestoreModels 拒绝覆盖，先查明是哪一份被改过，再决定从固定 revision 重取还是保留现状。",
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
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **已有模型文件与离线包哈希不同**：-RestoreModels 拒绝覆盖，先查明是哪一份被改过，再决定从固定 revision 重取还是保留现状。",
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

## 出问题时（三）

- **已有模型文件与离线包哈希不同**：-RestoreModels 拒绝覆盖，先查明是哪一份被改过，再决定从固定 revision 重取还是保留现状。

- **模型更换后 Doctor 通过但 smoke 失败**：该 profile 仍为 unavailable/provisional；回到固定工件、adapter（执行适配器） 与实际输出排查，不能把下载成功写成 ASR（自动语音识别） 场景可用。

- **E 盘整盘损坏**：项目内唯一的离线备用一起丢失；源码从可信 Git 恢复，依赖和模型只能联网重新取得。

::screen{#chinese-asr-installation-recovery-13 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-13",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "上一个模块 模型与用途",
    "href": "/projects/chinese-asr/models-modes/"
   },
   {
    "text": "下一个模块 长音频与批量",
    "href": "/projects/chinese-asr/long-batch/"
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
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- Python >=3.11 与项目安装入口",
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
     "text_ref": "- Python >=3.11 与项目安装入口",
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

- Python >=3.11 与项目安装入口

- Windows 核心依赖、FunASR 1.4.14 与 NumPy 1.26.4

- Qwen ASR（自动语音识别） runtime（运行环境） 0.0.6

- FireRed WSL（Windows 的 Linux 子系统） 精确 Python 依赖

- 六引擎 Registry（登记清单）、固定 revision 与运行门

- Windows CUDA 12.8 PyTorch/TorchAudio 安装

- Windows 核心 venv、pip check 与 Doctor

- 固定 Qwen runtime（运行环境） 安装

::screen{#chinese-asr-installation-recovery-14 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-14",
  "section": "tech",
  "title": "依据与来源（二）",
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
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- FireRed WSL（Windows 的 Linux 子系统） 隔离环境与固定源码",
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
     "text_ref": "- FireRed WSL（Windows 的 Linux 子系统） 隔离环境与固定源码",
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

- FireRed WSL（Windows 的 Linux 子系统） 隔离环境与固定源码

- 固定模型下载与 MODEL_RECEIPT 生成

- Windows/Linux 两套依赖锁导出与整包刷新

- 两套离线轮包下载与 checksum/JSON manifest（清单）

- 离线工件逐文件 SHA-256 校验

- 无索引安装、WSL 验证、模型补回、pip check 与 Doctor

- Qwen 13 项模型工件和 runtime（运行环境） 身份失败关闭

- FireRed 14 项工件、源码、容量与装载验证

::screen{#chinese-asr-installation-recovery-15 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-15",
  "section": "tech",
  "title": "依据与来源（三）",
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
     "text_ref": "依据与来源（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- setup、下载、wheelhouse、offline install、整包刷新与 smoke 脚本回归",
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
     "text_ref": "依据与来源（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- setup、下载、wheelhouse、offline install、整包刷新与 smoke 脚本回归",
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

## 依据与来源（三）

- setup、下载、wheelhouse、offline install、整包刷新与 smoke 脚本回归

- 模型身份、WSL（Windows 的 Linux 子系统） 容量、数据流与替换验收边界

## 如何验证

- 2026-08-31 安装恢复基线：当时 PUBLIC（公开） main=70e3255326ad8ba7b0e335fdf6b4a19caf0d8029，README、architecture、Registry（登记清单）、requirements 与完整安装/下载/离线脚本已逐项核对；该提交只作历史基线，现行公开 main 为 1bd5a048747392afa1eeec050a46a6146b803595，离线备用来自 9 月 29 日提交 f4d75fc。

- Unit tests：2026-08-31 本轮 .venv\Scripts\python.exe -m unittest -v tests.test_scripts 运行 18 项并全部通过；它验证脚本合同，不下载 wheel、不装模型也不跑音频。

- 2026-08-31 Full regression 历史观察：同一轮 .venv\Scripts\python.exe -m unittest discover -s tests -q 运行 345 项，用时 83.524 秒并全部通过；仍不等于真实模型 E2E（端到端验证）。

- Windows 运行环境：2026-08-31 Doctor 历史观察为 Python 3.11.9、PyTorch/TorchAudio 2.11.0+cu128、FunASR 1.4.5、Qwen ASR（自动语音识别） 0.0.6、ModelScope 1.38.1，RTX 5090 D 驱动 616.56、32607 MiB，六个引擎可枚举。2026-10-11 只读核对当前 .venv 的安装元数据：Python 3.11.9、Torch/TorchAudio 2.11.0+cu128、Transformers 4.57.6、FunASR 1.4.14、NumPy 1.26.4、qwen-asr 0.0.6、ModelScope 1.38.1、OpenCC 0.1.7 等，与 129 项 Windows 依赖锁无不一致；显卡驱动 617.14。这是安装元数据，不是新的 GPU/CUDA 验收。

- Model artifacts：Qwen receipt（执行回执） 为 1763 B / SHA-256 0c43de9dd883adefb65cfa1477ad7156f749868105a554e647b47de73c841ef9，13 项声明合计 4703115105 B；FireRed receipt（执行回执） 为 2124 B / SHA-256 c4effd6931c0e09d8b2caaf7f8b9f58bed370fa4a174edfc64b668dd0b48dd01，14 项声明合计 18870501538 B。2026-10-11 再次确认所有声明路径存在、文件大小一致，只核对回执自身哈希，未重哈希权重、未加载模型。

::screen{#chinese-asr-installation-recovery-16 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-installation-recovery-16",
  "section": "tech",
  "title": "依据与来源（四）",
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
     "text_ref": "依据与来源（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- FireRed runtime（运行环境）：WSL（Windows 的 Linux 子系统） Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0、NumPy 2.4.2 是现行固定版本和 9 月 29 日包内版本，本轮没有启动 WSL 重取已安装环境；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 仍干净。CUDA/BF16 可用、“内存高于半精度门槛”是 9 月 17 日的历史现场，10 月 11 日没有取得 WSL 可用内存。",
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
     "text_ref": "依据与来源（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- FireRed runtime（运行环境）：WSL（Windows 的 Linux 子系统） Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0、NumPy 2.4.2 是现行固定版本和 9 月 29 日包内版本，本轮没有启动 WSL 重取已安装环境；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 仍干净。CUDA/BF16 可用、“内存高于半精度门槛”是 9 月 17 日的历史现场，10 月 11 日没有取得 WSL 可用内存。",
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

## 依据与来源（四）

- FireRed runtime（运行环境）：WSL（Windows 的 Linux 子系统） Python 3.12.3、PyTorch 2.10.0+cu128、Transformers 5.1.0、NumPy 2.4.2 是现行固定版本和 9 月 29 日包内版本，本轮没有启动 WSL 重取已安装环境；固定源码 HEAD=4e7d9aaf4482a47cec1724807026b9b151926eb5 仍干净。CUDA/BF16 可用、“内存高于半精度门槛”是 9 月 17 日的历史现场，10 月 11 日没有取得 WSL 可用内存。

- 离线备用（2026-09-29 建，f4d75fc）：清单 307 个文件、37,855,429,442 字节，连同 bundle.json 共 308 个、37,855,493,658 字节（约 35.26 GiB）；其中模型 104 个文件 30,622,178,199 字节，Windows 轮包 129 个、FireRed Linux 轮包 68 个，FireRed 源码归档 8,570,880 字节。9 月 29 日在新建的 Windows/Ubuntu 环境里用 --no-index/--find-links 只从本地轮包安装，pip check、项目 Doctor 和 FireRed 源码导入通过，整包 307 项 SHA 封存后回读通过；同日离线/脚本专项 20 项通过，全量运行 531 项（20 项跳过）。2026-10-11 只核对 307 项存在且大小吻合、models.yaml 哈希与包内记录一致（bundle.json 自身 SHA-256 b223061e3b66673c309063f7e55935a12cc469718aa00c73f3004cab1aa3db3c），没有重算整包 SHA。

- Unverified：未拔网线断网安装、未在新 WSL 环境做真实 GPU 录音推理、未验证换到另一台电脑恢复；current 仍是 9 月 29 日首份副本，真实的 35 GiB 新旧版本轮换没有验收。本轮也未加载模型、未运行 strict/evidence smoke，未用私人录音做 E2E（端到端验证）。

## 与其他模块的关系

本模块承接模型与模式模块的精确 profile，把依赖、权重和 FireRed WSL（Windows 的 Linux 子系统） 恢复成可执行候选；只有再通过入口模块的真实 smoke、长音频执行与审计证据，候选环境才成为可用 ASR（自动语音识别） 路线。
