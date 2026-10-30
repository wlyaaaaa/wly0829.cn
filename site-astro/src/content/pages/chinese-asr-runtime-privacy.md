---
{
 "title": "本地运行、GPU 协调、专业云入口与公开边界",
 "kind": "project",
 "url": "/projects/chinese-asr/runtime-privacy/",
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
  "page": "chinese-asr-runtime-privacy",
  "kind": "project",
  "title": "本地运行、GPU 协调、专业云入口与公开边界",
  "url": "/projects/chinese-asr/runtime-privacy/",
  "parent": "chinese-asr",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "ChineseASR 公开仓库 main（1bd5a04）按 10 月 11 日 14:00 前的源码与配置只读核对；云端调用统计取保留的结果元数据（云结果时间 8 月 1 日至 9 月 27 日），本轮未调用云端。"
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr-runtime-privacy/page.json",
  "sha256": "8e76f923ce61bc27fd66ae333b9c5831ef4d1b7ecd608c1aef09d6237c3862d2",
  "converted_at_beijing": "2026-10-30T13:04:15+08:00"
 }
}
---

::screen{#chinese-asr-runtime-privacy-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-01",
  "section": "top",
  "title": "本地运行、GPU 协调、专业云入口与公开边界",
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
     "text_ref": "本地运行、GPU 协调、专业云入口与公开边界",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）按 10 月 11 日 14:00 前的源码与配置只读核对；云端调用统计取保留的结果元数据（云结果时间 8 月 1 日至 9 月 27 日），本轮未调用云端。",
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
     "text_ref": "普通清楚的录音和桌面听写一律留在本机。本地转写标出疑点的文件，在云端免费期内由处理它的 AI 接手，送阿里云再听一遍，云端稿和本地稿并排放、本地稿不动；免费期外，或想不经本地转写直接把整段送上云，仍要我明确点头。每一次有没有离开本机、为什么停，我都能看清。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有本地运行、显卡协调、免费期内的疑难自动云复核和点名上云入口；两款云模型的免费期配置到北京时间 2026-12-21 00:00（日期是我记下的，没在阿里云控制台核对）。本轮未运行模型、未上传录音。",
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
     "text_ref": "本地运行、GPU 协调、专业云入口与公开边界",
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
     "static_note": "截至 10 月 11 日 · ChineseASR 公开仓库 main（1bd5a04）按 10 月 11 日 14:00 前的源码与配置只读核对；云端调用统计取保留的结果元数据（云结果时间 8 月 1 日至 9 月 27 日），本轮未调用云端。"
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
     "text_ref": "普通清楚的录音和桌面听写一律留在本机。本地转写标出疑点的文件，在云端免费期内由处理它的 AI 接手，送阿里云再听一遍，云端稿和本地稿并排放、本地稿不动；免费期外，或想不经本地转写直接把整段送上云，仍要我明确点头。每一次有没有离开本机、为什么停，我都能看清。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有本地运行、显卡协调、免费期内的疑难自动云复核和点名上云入口；两款云模型的免费期配置到北京时间 2026-12-21 00:00（日期是我记下的，没在阿里云控制台核对）。本轮未运行模型、未上传录音。"
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
   "asset": "_library/illustrations/modules/chinese-asr/runtime-privacy/runtime-privacy-v01.png",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "b90aa012fa444982b520fda025abb1ca358d139e6508fe6d26fe0520e32f8c48",
   "status": "ready"
  }
 ]
}
```

# 本地运行、GPU 协调、专业云入口与公开边界

〔回到项目 → 中文语音转写〕　〔GitHub〕　〔复制 AI 续作说明〕

ChineseASR · 功能说明

普通清楚的录音和桌面听写一律留在本机。本地转写标出疑点的文件，在云端免费期内由处理它的 AI 接手，送阿里云再听一遍，云端稿和本地稿并排放、本地稿不动；免费期外，或想不经本地转写直接把整段送上云，仍要我明确点头。每一次有没有离开本机、为什么停，我都能看清。

**当前情况：**已有本地运行、显卡协调、免费期内的疑难自动云复核和点名上云入口；两款云模型的免费期配置到北京时间 2026-12-21 00:00（日期是我记下的，没在阿里云控制台核对）。本轮未运行模型、未上传录音。

项目技术事实核对于 2026-10-11（北京时间），采用当天 14:00 前的源码状态；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#chinese-asr-runtime-privacy-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 录音可能含私人对话，几个本地模型也会争用同一块显卡，云端复核还可能产生费用。项目分清本地处理、显卡等待、哪些文件会被送去复核以及凭什么送，避免悄悄换路线、重复计费或泄露凭据。 ##"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 录音可能含私人对话，几个本地模型也会争用同一块显卡，云端复核还可能产生费用。项目分清本地处理、显卡等待、哪些文件会被送去复核以及凭什么送，避免悄悄换路线、重复计费或泄露凭据。 ##"
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

录音可能含私人对话，几个本地模型也会争用同一块显卡，云端复核还可能产生费用。项目分清本地处理、显卡等待、哪些文件会被送去复核以及凭什么送，避免悄悄换路线、重复计费或泄露凭据。

## 举个实际例子

我问“普通录音会上传吗？”答案是不会。一段会议录音本地转完，两个模型对一个数字听得不一样，正文里出现 [疑似]：本地服务只记一笔“等 AI 接手”，自己不上传；处理这段录音的 AI 在免费期内把它送阿里云百炼再听一遍，云端稿和本地稿并排存，标出哪里不一样。免费期过了、我手动暂停了，或者我想跳过本地直接整段上云，就要我明确同意这一次。

## 最后我会得到什么

交回这次音频留在本机还是已实际上传、用了哪条本地路线和哪个云模型、结果放在哪里，以及云复核是成功、还在等 AI 接手，还是停在哪一步、为什么。云端不可用不会抹掉已保存的本地转写。

## 正常时

本地运行条件满足时按本地路线处理；本地标出疑点的文件，在免费期内、没有被暂停时自动交给 AI 补跑云复核；点名上云在用途和这次上传许可都明确时执行。

## 发现问题时

显卡忙、网络失败、超时或限流时保留已有本地结果和具体原因，只算这一次失败；阿里云报额度用完、欠费、余额不足、没权限或模型下线时，记下原因并停掉以后的自动上传。

## 入口不可用或证据不足时

免费期已过、被手动暂停、凭据或运行环境不可用时，只阻断受影响的云路线并在结果里写明原因；不露出秘密，也不自行换到别的服务。

::screen{#chinese-asr-runtime-privacy-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-03",
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

本地运行条件满足时按本地路线处理；只有本次云用途和上传许可都明确时才执行云候选。

## 发现问题时

显卡忙、网络失败或云端限流时保留已有本地结果和具体原因，按可行条件再继续。

## 入口不可用或证据不足时

凭据、模型或运行环境不可用时只阻断受影响路线，不露出秘密或自行换到别的服务。

::screen{#chinese-asr-runtime-privacy-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-04",
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
     "text_ref": "普通录音照常交给本地处理；疑难文件在免费期内由 AI 自动复核；免费期外或想整段直接上云时，逐次明确这一次的上传。",
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
     "text_ref": "1. **系统核对并处理**　日常录音在本地受管运行；本地标出疑点后只记“等 AI 接手”，由 AI 在免费期内补跑云复核；录音更长不会自动触发上传，每次云请求单独记录。",
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
     "text_ref": "普通录音照常交给本地处理；疑难文件在免费期内由 AI 自动复核；免费期外或想整段直接上云时，逐次明确这一次的上传。"
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
     "text_ref": "1. **系统核对并处理**　日常录音在本地受管运行；本地标出疑点后只记“等 AI 接手”，由 AI 在免费期内补跑云复核；录音更长不会自动触发上传，每次云请求单独记录。",
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

普通录音照常交给本地处理；疑难文件在免费期内由 AI 自动复核；免费期外或想整段直接上云时，逐次明确这一次的上传。

## 需要准备什么

- 本次原音和用途

- 本地转写结果（疑难复核时由系统自动带上）

- 点名上云时的单次同意

## 从开始到拿到结果

1. **系统核对并处理**　日常录音在本地受管运行；本地标出疑点后只记“等 AI 接手”，由 AI 在免费期内补跑云复核；录音更长不会自动触发上传，每次云请求单独记录。

2. **交付与接续**　说明这次是否离开本机、本地和云端模型是否真运行、复核成功还是待接手，以及失败位置；不把本地失败静默改成云处理，云端稿也不覆盖本地稿。

::screen{#chinese-asr-runtime-privacy-05 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 短进程租约与异常 worker 回收有来源真实验收；云复核已改为免费期内由 AI 接手、密钥由密码中心送出；本轮不运行 GPU、云调用或壁纸观测 ## 关键"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 短进程租约与异常 worker 回收有来源真实验收；云复核已改为免费期内由 AI 接手、密钥由密码中心送出；本轮不运行 GPU、云调用或壁纸观测 ## 关键"
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
     "text_ref": "1. 普通清楚录音、批量和长音频默认不上传，桌面听写永不上传；只有本地标出 needs_review、引擎分歧、[疑似]、provisional 或 Important 的文件，才在免费期内、未暂停时进入自动复核。",
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
     "text_ref": "1. 普通清楚录音、批量和长音频默认不上传，桌面听写永不上传；只有本地标出 needs_review、引擎分歧、[疑似]、provisional 或 Important 的文件，才在免费期内、未暂停时进入自动复核。",
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

短进程租约与异常 worker 回收有来源真实验收；云复核已改为免费期内由 AI 接手、密钥由密码中心送出；本轮不运行 GPU、云调用或壁纸观测

## 关键规则与设计选择

1. 普通清楚录音、批量和长音频默认不上传，桌面听写永不上传；只有本地标出 needs_review、引擎分歧、[疑似]、provisional 或 Important 的文件，才在免费期内、未暂停时进入自动复核。

2. Important 与 QualityReview 必须且只能选一个；上传依据是显式 CloudUploadAuthorized，或带本地结果目录和疑难证据的 AutomaticReview。Important 单独不是上传许可，也不会把普通 strict 自动改成 FireRed。

3. 密钥不进入 ASR 命令行、请求文件、日志和转写结果；项目只准备请求，由密码中心送出。

4. OCR（光学字符识别） 与 ASR（自动语音识别） 可以各持一份租约并行；同类任务仍串行，Ollama 活跃请求或会话与二者互斥，不绕过 Broker（代理服务） 抢占未知工作负载。

5. 网络和云失败不会污染本地证据链；云端稿与本地稿并排存放，差异另列。

6. 公开仓库只保留源码、测试与文档。

## 当前怎样实现

- 听写采用常驻受监督模型子进程，空闲权重留 RAM，录音与推理申请自己的 GPU 租约；加载 180 秒、激活/推理 60 秒、预热 40 秒、停车 20 秒均有上限。准备失败可点麦克风重试，不要求重启 Windows。

- 听写音频与识别结果不保存为历史文件；outputs/dictation/runtime.log 只记运行错误、耗时与字数，最近完整文本仅供本次托盘主动复制。

::screen{#chinese-asr-runtime-privacy-06 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-06",
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
     "text_ref": "- 默认 pipeline 和 Smart API 使用本机模型与本机回环服务（127.0.0.1:18666）；本地服务对疑难文件只写 pending_ai_session 和下一步命令，不后台取密、不自行上传。",
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
     "text_ref": "- 默认 pipeline 和 Smart API 使用本机模型与本机回环服务（127.0.0.1:18666）；本地服务对疑难文件只写 pending_ai_session 和下一步命令，不后台取密、不自行上传。",
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

- 默认 pipeline 和 Smart API 使用本机模型与本机回环服务（127.0.0.1:18666）；本地服务对疑难文件只写 pending_ai_session 和下一步命令，不后台取密、不自行上传。

- ASR（自动语音识别） 租约最多 120 秒并每 20 秒续租；真实模型 worker 接管 PID/创建时间身份，监督进程消失时 watchdog 清理本任务 WSL（Windows 的 Linux 子系统） 后代。无法查询进程不是已死证明，旧六小时请求也不能重新占用数小时。

- OCR（光学字符识别）/ASR（自动语音识别） 可跨族并行、同族串行，Ollama 重型请求与二者互斥（GPU Broker 端口 32100）；合法文件作业占用时听写保留内存音频并显示真实阻断，可 Esc 取消。辅助进程隐藏，不暂停 Wallpaper Engine 或创建广泛 Python/WSL（Windows 的 Linux 子系统） 播放规则。

- FireRed worker 隔离在专用运行环境，不改变默认模型。

- asr-professional-cloud.ps1 在读音频前要求 Important / QualityReview 二选一，以及 CloudUploadAuthorized 或带本地结果目录和疑难证据的 AutomaticReview；原来的 -Legacy 开关 10 月 20 日已删，现在可用 -ResumeJobId 沿用原云请求和检查点续作。重要路线写 importance=important，质量复核写 purpose=quality_review 且不写 importance。

- 云 provider 仍是 Alibaba Cloud Model Studio（阿里云百炼）北京区：`qwen-audio-3.1-asr-flash` 走 HTTPS Base64、每段不超过 120 秒，用于短录音、说话人和方言；`qwen-audio-3.1-asr-flash-message` 走 WebSocket、每段不超过 30 秒 PCM，用于较长录音和热词。两者免费期配置都到北京时间 2026-12-21 00:00（不含截止点）。`qwen-audio-3.0-asr-flash` 的 180 秒路线原来只作显式 Legacy 后备（免费期配置已于北京时间 2026-09-27 02:00 过期），10 月 20 日连同 -Legacy 开关一起删除；filetrans 仍未接入，不借公网 URL。

- 项目流水线只准备 HTTP 请求体或 WebSocket 帧，用 SecretRefRequestPath 把精确请求交给密码中心的 vendor_api_worker 发送，PCConfig 管它的安装路径和固定哈希；原来不持钥的兼容入口 qwen_audio3_broker_worker.py（9 月 28 日迁移，49b7d76）10 月 20 日已删除。续作保留 intent、unclaimed、provider 与 checkpoint：已成功的 operation 不重发；结果不明（previous_outcome_unknown）不自动另开作业，只有明确允许后在原请求加 retry_uncertain=true，且请求体、模型和音频摘要必须一致；批量补跑先 dry-run，按原音哈希、用途和声道复用已有成功。

- transcript_readback.py 按原音 SHA-256 只读检索三处：已保留本地 job（任务记录）、完成态云结果，以及 jobs 快照所属 outputs/batch 下的 batch-item.json（文件夹批量结果，10 月 29 日 512f443 补上）。云结果核对 schema（数据结构）、purpose、成功状态、原音哈希、每块范围和输出字节；完整云块只形成 chunk 时间粒度，quality 保持 unknown（未验证）。批量稿逐个核对正文引用、objective 结果、raw 结果的大小与 SHA-256 和原音身份，才回传 artifact.transcript 稿件路径、原质量和覆盖：quality.review 保留 needs_review，quality.audit 保留 conflict，不因读到了稿就把质量改好。几处都有时沿原优先规则选一份，不因更新日期更近就优先，其余列在 lookup_scope.alternatives；只有稿件、没有可回读时间段时返回 gap / timestamps_unavailable，不当作没转写；jobs 快照读不了也继续查它的批量目录，快照缺口照实留在 lookup_scope。本轮只读源码，没有执行回读。

::screen{#chinese-asr-runtime-privacy-07 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-07",
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
     "text_ref": "- 自动停止与恢复（cloud_review.py、scripts/cloud-review-state.py）：免费期过期不自动上传并写原因；额度耗尽、欠费、余额不足、无权限、模型下线等持久停用；网络、超时、限流、5xx 只影响本次。可用 pause --reason 手动暂停，只有本人要求 resume 才解除；更换模型、新免费期或新额度周期只解除供应商停用，不解除手动暂停，点名上云不受暂停影响。阿里云“免费额度用完即停”开关没开、本地也不计用量，余额为零时仍可能后付费欠费。",
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
     "text_ref": "- 自动停止与恢复（cloud_review.py、scripts/cloud-review-state.py）：免费期过期不自动上传并写原因；额度耗尽、欠费、余额不足、无权限、模型下线等持久停用；网络、超时、限流、5xx 只影响本次。可用 pause --reason 手动暂停，只有本人要求 resume 才解除；更换模型、新免费期或新额度周期只解除供应商停用，不解除手动暂停，点名上云不受暂停影响。阿里云“免费额度用完即停”开关没开、本地也不计用量，余额为零时仍可能后付费欠费。",
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

- 自动停止与恢复（cloud_review.py、scripts/cloud-review-state.py）：免费期过期不自动上传并写原因；额度耗尽、欠费、余额不足、无权限、模型下线等持久停用；网络、超时、限流、5xx 只影响本次。可用 pause --reason 手动暂停，只有本人要求 resume 才解除；更换模型、新免费期或新额度周期只解除供应商停用，不解除手动暂停，点名上云不受暂停影响。阿里云“免费额度用完即停”开关没开、本地也不计用量，余额为零时仍可能后付费欠费。

- outputs、models、私人评测、wheelhouse 和录音由 Git ignore 与公开门排除。

## 执行流程

1. 根据请求和本地结果选择路线：本地处理、疑难自动复核或点名上云。

2. 本地路线检查代理、GPU、依赖和模型。

3. 重模型取得 GPU 租约并启动受管进程。

4. 本地任务完成后，有疑难证据就写 pending_ai_session 交 AI 接手；云路线在读取音频前验证唯一用途、上传依据、免费期和暂停/停用状态。

5. 本地切片：短录音按不超过 120 秒走 `qwen-audio-3.1-asr-flash` 的 HTTPS Base64，较长录音或需热词时按不超过 30 秒 PCM 走 `qwen-audio-3.1-asr-flash-message` 的 WebSocket；3.0 Legacy 路线 10 月 20 日已删，filetrans 路线保持未接入。

::screen{#chinese-asr-runtime-privacy-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-08",
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
     "text_ref": "6. 项目只准备请求，经 SecretRefRequestPath 交密码中心发送；密钥不经过 ASR 进程。",
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
     "text_ref": "6. 项目只准备请求，经 SecretRefRequestPath 交密码中心发送；密钥不经过 ASR 进程。",
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

6. 项目只准备请求，经 SecretRefRequestPath 交密码中心发送；密钥不经过 ASR 进程。

7. 执行结果写入被 Git 忽略的本地输出，云端稿与本地稿并排保存。

8. 失败后返回本地结果和精确原因：一次性故障只记本次，持久故障停掉后续自动上传，结果不明的请求不盲目重发。

::screen{#chinese-asr-runtime-privacy-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-09",
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
| local-first（本地优先） | 默认音频和模型推理都留在本机；云是独立路线，只由本地疑难证据或明确点名触发。 |
| GPU lease（显卡租约） | 绑定工作类型、持有者和有效期的可回收许可；同类互斥，OCR（光学字符识别）/ASR（自动语音识别） 可共存，Ollama 与两者互斥。 |
| SecretRef | 引用密钥而不让模型、命令或 ASR 项目得到明文；现在由 SecretRefRequestPath 把准备好的请求交给密码中心发送。 |
| cloud upload authorization（云上传依据） | 点名上云时，是针对当前录音、明确用途的单次许可；疑难自动复核则依据免费期内的既有自动许可加本地疑难证据。两者都不是对所有录音的长期默认同意。 |

## 专业定义

普通录音默认留在本机，GPU 协调器按工作类型安排租约：OCR（光学字符识别） 与 ASR（自动语音识别） 可并行，Ollama 与两者互斥，同类仍串行。本地标出疑点的文件在免费期内由 AI 接手送云复核；免费期外或整段直接上云，须明确选择重要录音或质量复核用途并同意这一次上传。

解决什么

解决音频隐私边界不清、云上传被默认触发、疑难结果没人复核、费用和重复计费失控、密钥泄露、GPU 并发冲突、服务进程失控，以及公开仓库误纳入模型权重、用户音频和生成结果的问题。

::screen{#chinese-asr-runtime-privacy-10 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-10",
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

解决音频隐私边界不清、云上传被默认触发、密钥泄露、GPU 并发冲突、服务进程失控，以及公开仓库误纳入模型权重、用户音频和生成结果的问题。

## 边界

- 云复核不能由普通模式、文件夹批量或音频长度隐式触发；只由本地疑难证据（免费期内、未暂停）或我点名触发。

- 云入口的精确数据目的地是阿里云百炼北京区 `qwen-audio-3.1-asr-flash` 与 `qwen-audio-3.1-asr-flash-message`；3.0 Legacy 后备 10 月 20 日已删，需要公网 URL 的 filetrans 不属于当前能力。

- 任何输出都不能包含 API Key。

- 本地 API 只监听 127.0.0.1。

- 项目不结束未知 GPU 任务，也不通过强占资源制造成功。

- 公开仓库不包含私人 payload 与模型权重。

## 失败与恢复

- **缺少用途、同时选两个用途或缺少上传依据**：在读取和上传前返回 blocked，不发出请求；普通质量复核不能通过假报重要性绕过用途检查。

- **密码中心或请求发送路径失败**：不取得密钥、不上传，本地结果保留；按原请求续作，不另开一份。

::screen{#chinese-asr-runtime-privacy-11 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-11",
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
     "text_ref": "- **同类 GPU 租约占用或 Ollama 活跃请求/会话冲突**：受影响任务保持 blocked 或等待；OCR（光学字符识别） 与 ASR（自动语音识别） 的允许共存不被当成冲突，也不绕过租约。",
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
     "text_ref": "- **同类 GPU 租约占用或 Ollama 活跃请求/会话冲突**：受影响任务保持 blocked 或等待；OCR（光学字符识别） 与 ASR（自动语音识别） 的允许共存不被当成冲突，也不绕过租约。",
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

- **同类 GPU 租约占用或 Ollama 活跃请求/会话冲突**：受影响任务保持 blocked 或等待；OCR（光学字符识别） 与 ASR（自动语音识别） 的允许共存不被当成冲突，也不绕过租约。

- **云网络、超时、限流或 5xx**：保留已成功块与本地证据，只记这一次失败；先区分未发出、明确失败和结果不明，结果不明不自动另开作业，只有明确允许后才在原请求上重试。

- **按原音指纹回读已有稿时校验不过或缺时间**：大小或 SHA-256 对不上的稿不回传，只记进拒收原因；有稿但没有可回读时间段时返回 gap / timestamps_unavailable 并给出稿件路径和原质量，不当作没转写，也不为此重转或上传；jobs 快照读不了时继续查批量目录，并留下快照缺口。

- **免费期已过或被手动暂停**：不自动上传，结果里写明“免费期已到期，云端未跑”或暂停原因；手动暂停只有本人说恢复才解除，点名上云照常可用。

- **额度用完、欠费、余额不足、没权限或模型下线**：记下原因并停掉以后的自动上传；本人要求恢复，或换了模型、新免费期、新额度周期后才重新开启。

::screen{#chinese-asr-runtime-privacy-12 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-12",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [
   {
    "text": "上一个模块 发言人与时间",
    "href": "/projects/chinese-asr/speaker-attribution/"
   },
   {
    "text": "下一个模块 文案与音频对齐",
    "href": "/projects/chinese-asr/known-text-alignment/"
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
     "text_ref": "- GPU 租约与服务协调",
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
     "text_ref": "- GPU 租约与服务协调",
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

- GPU 租约与服务协调

- OCR（光学字符识别）/ASR（自动语音识别） 分类共存、同类串行与 Ollama 互斥的所属实现；本轮只读源码，未调用服务

- 代理环境与本地请求边界

- 重要录音与疑难复核云入口、免费期与停用/暂停状态

- 云请求准备、密码中心发送与续作

- 公开仓库内容与生成物边界

## 如何验证

- 2026-08-31 Doctor 确认 GPU、代理、FunASR、Qwen ASR（自动语音识别）、PyTorch 和模型目录可读；GPU broker（代理服务）、proxy guard、professional cloud script 和当时的 broker（代理服务） worker 回归包含在同日 345 项通过结果中。

- 现行源码与配置（10 月 11 日只读核对）固定阿里云百炼北京区两款 3.1 模型、120 秒 HTTPS Base64 与 30 秒 WebSocket 切片、免费期和停用/暂停规则；对应提交为疑难自动复核 6e59631、AI 交接 1014970、密码中心发送 49b7d76、手动暂停 05fa586、状态投影 809145d、续作边界 8ba0d62。这些静态事实不证明本轮云调用成功，也不证明云服务可用或额度充足。

::screen{#chinese-asr-runtime-privacy-13 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-runtime-privacy-13",
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
     "text_ref": "- 9 月 17 日来源回归运行 482 项（0 失败、0 错误，1 项可选公开 VAD 样例缺失而跳过），真实监督进程异常退出后 worker 与租约约 1.39 秒回收；PCConfig 64 项 Broker（代理服务） 与 63 项配置恢复测试分别通过。未把静态壁纸配置审计称为逐帧连续播放证明。",
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
     "text_ref": "- 9 月 17 日来源回归运行 482 项（0 失败、0 错误，1 项可选公开 VAD 样例缺失而跳过），真实监督进程异常退出后 worker 与租约约 1.39 秒回收；PCConfig 64 项 Broker（代理服务） 与 63 项配置恢复测试分别通过。未把静态壁纸配置审计称为逐帧连续播放证明。",
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

- 9 月 17 日来源回归运行 482 项（0 失败、0 错误，1 项可选公开 VAD 样例缺失而跳过），真实监督进程异常退出后 worker 与租约约 1.39 秒回收；PCConfig 64 项 Broker（代理服务） 与 63 项配置恢复测试分别通过。未把静态壁纸配置审计称为逐帧连续播放证明。

- 云端调用历史（云结果时间北京 8 月 1 日至 9 月 27 日，含点名上云和 9 月 26 日以前的 3.0 旧模型，10 月 11 日统计）：尝试 68 次、成功 54 次、失败 14 次，成功涉及 51 段不同录音；本地疑难复核记录中 25 份已写回成功、31 份仍在等 AI 接手，后者不算已复核。

- 本次没有调用云端、没有上传音频、没有消费密钥或额度，也没有运行重模型真实 smoke。

## 与其他模块的关系

安装与恢复模块先提供可执行依赖和模型工件；本模块再为所有路线施加 GPU、进程、网络与隐私边界。它不决定正文质量，但决定某条处理路线是否允许执行、数据去了哪里。
