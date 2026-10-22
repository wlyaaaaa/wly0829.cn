---
{
 "title": "每帧按时间算出来，中断后也不能把新旧画面混在一起",
 "kind": "project",
 "url": "/projects/video-scaffold/deterministic-render/",
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
  "page": "video-scaffold-deterministic-render",
  "kind": "project",
  "title": "每帧按时间算出来，中断后也不能把新旧画面混在一起",
  "url": "/projects/video-scaffold/deterministic-render/",
  "parent": "video-scaffold",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "内容按北京时间 14:00 前最后一次提交 cc41e514（13:57）核对，未出片、未测速度"
  },
  "based_on": {
   "commit": "cc41e514b2886fff8e04b1883562d25bd59089ef",
   "commit_time": "2026-10-11T13:57:49+08:00"
  },
  "public": false,
  "repo_url": null
 },
 "source": {
  "page": "sources/pages/video-scaffold-deterministic-render/page.json",
  "sha256": "b416ca48bc00e3b5a4aa355856492ff1b4163374263ef042761bc845617ca579",
  "converted_at_beijing": "2026-10-22T08:32:42+08:00"
 }
}
---

::screen{#video-scaffold-deterministic-render-01 section="top"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-01",
  "section": "top",
  "title": "每帧按时间算出来，中断后也不能把新旧画面混在一起",
  "links": [
   {
    "text": "回到项目 → 本地视频制作",
    "href": "/projects/video-scaffold/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/video-scaffold/#ai-brief"
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
     "text_ref": "每帧按时间算出来，中断后也不能把新旧画面混在一起",
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
     "static_note": "截至 10 月 11 日 · 内容按北京时间 14:00 前最后一次提交 cc41e514（13:57）核对，未出片、未测速度",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地视频制作〕　**私有**　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "每一帧都按视频时间算出来，机器快慢不改动画节奏；中断可从可靠片段接着做，换过的素材不会沿用旧画面。现在有三种出片方式：分镜路线默认 4K60 AV1；图文页默认出 1080p 的 H.264 可播放副本，全机自动排队；独立网页作品能直接按时间求画面，整屏画布还能走显卡快路。",
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
     "text_ref": "每帧按时间算出来，中断后也不能把新旧画面混在一起",
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
     "static_note": "截至 10 月 11 日 · 内容按北京时间 14:00 前最后一次提交 cc41e514（13:57）核对，未出片、未测速度"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地视频制作〕　**私有**　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "每一帧都按视频时间算出来，机器快慢不改动画节奏；中断可从可靠片段接着做，换过的素材不会沿用旧画面。现在有三种出片方式：分镜路线默认 4K60 AV1；图文页默认出 1080p 的 H.264 可播放副本，全机自动排队；独立网页作品能直接按时间求画面，整屏画布还能走显卡快路。"
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
   "asset": "_library/illustrations/modules/video-scaffold-deterministic-render-v01.png",
   "key": "main-video-scaffold",
   "source_phrase": "右上一幅水彩插画：一台宽屏显示器，屏幕里是浅绿色流动的毛玻璃背景，上面一行深绿大字“核心结论”正在逐字打出（最后一个字半透明）；（text 里单独一行的“核心结论”就是屏幕上这四个字，不另画别处。",
   "sha256": "b851ec32c99ea091a9bf3732e32580a54718d3cdc51d15cdd433a2a8a8dfc86f",
   "status": "ready"
  }
 ]
}
```

# 每帧按时间算出来，中断后也不能把新旧画面混在一起

〔回到项目 → 本地视频制作〕　**私有**　〔复制 AI 续作说明〕

video-scaffold · 功能说明

每一帧都按视频时间算出来，机器快慢不改动画节奏；中断可从可靠片段接着做，换过的素材不会沿用旧画面。现在有三种出片方式：分镜路线默认 4K60 AV1；图文页默认出 1080p 的 H.264 可播放副本，全机自动排队；独立网页作品能直接按时间求画面，整屏画布还能走显卡快路。

**当前情况：**三种出片方式、片段续作、少帧拒绝和全机排队都在源码里；这次网页核对没有出片，不公布速度、显存或稳定时长。

项目源码：公开仓库

::screen{#video-scaffold-deterministic-render-02 section="usage"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 渲染可能中断，也可能遇到编码退出正常却少帧的异常。只看文件存在或帧数都识别不了同样长度的旧内容；现在既核对分片来源与输出字节，也数帧，局部场景更新不必令完全无关的正确分片全部报废。 举个实际例"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 渲染可能中断，也可能遇到编码退出正常却少帧的异常。只看文件存在或帧数都识别不了同样长度的旧内容；现在既核对分片来源与输出字节，也数帧，局部场景更新不必令完全无关的正确分片全部报废。 举个实际例"
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

出片可能中断，也可能遇到编码器正常退出却少帧。只看文件在不在或帧数够不够，认不出同样长度的旧内容；现在既核对片段的来源和输出字节，也数帧，局部更新不必让无关的正确片段全部作废。几个出片任务同时开时，全机排队避免把内存挤爆。

## 举个实际例子

我可以说：“昨晚完成了前 20 段，今天继续；但我换了一张图，用过旧图的段必须重做。另一个视频也在出，别两边一起抢内存。”系统识别素材变化，不把新旧画面拼进同一成片；第二个任务按顺序等名额。

## 最后我会得到什么

得到核对过长度与来源的画面轨或可播放副本。每个可继续使用的片段保留到我明确清理；有缺帧或来源不明就不拼成成片。

::screen{#video-scaffold-deterministic-render-03 section="usage"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-03",
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

全部片段属于当前脚本与素材，帧数完整，再拼成画面轨或可播放副本。

## 发现问题时

一段失败可重试；某页或某场变化只重做受影响的片段，公共背景或模板变化会影响更多片段。

## 入口不可用或证据不足时

素材、背景、浏览器或编码器不可用，旧的错误片段没法确认已移进回收站，或颜色信息不明时停止，不拼不可信的画面。

::screen{#video-scaffold-deterministic-render-04 section="usage"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-04",
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
     "text_ref": "分镜路线：预览确认后在视频工程运行 `run.ps1 render`。图文页：`python -m pipeline.pages <表.json> render`，会自动排队。独立网页作品：`webfilm/run.ps1 render <作品目录>`，默认 4K60、20 秒。",
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
     "text_ref": "1. **锁定本次输入**　按画面、素材和时长计算身份、帧数与分段。",
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
     "text_ref": "分镜路线：预览确认后在视频工程运行 `run.ps1 render`。图文页：`python -m pipeline.pages <表.json> render`，会自动排队。独立网页作品：`webfilm/run.ps1 render <作品目录>`，默认 4K60、20 秒。"
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
     "text_ref": "1. **锁定本次输入**　按画面、素材和时长计算身份、帧数与分段。",
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

分镜路线：预览确认后在视频工程运行 `run.ps1 render`。图文页：`python -m pipeline.pages <表.json> render`，会自动排队。独立网页作品：`webfilm/run.ps1 render <作品目录>`，默认 4K60、20 秒。

## 需要准备什么

- 已确认可出片的工程、分镜表或网页作品

- 输出目标

## 从开始到拿到结果

1. **锁定本次输入**　按画面、素材和时长计算身份、帧数与分段。

2. **逐段生成和复用**　只复用身份和输出字节都匹配的片段；中断后重做缺失或受影响的片段。

3. **核对整轨**　拼接后比对总帧与来源；没有完整跑过本片时，不声称成片已通过。

::screen{#video-scaffold-deterministic-render-05 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 分片来源、输出哈希与少帧保护已实现；本轮未做生产编码探针 关键规则与设计选择 1 video_track.mp4 设计上无声，声音在 merge 后的 final_ou"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 分片来源、输出哈希与少帧保护已实现；本轮未做生产编码探针 关键规则与设计选择 1 video_track.mp4 设计上无声，声音在 merge 后的 final_ou"
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
     "text_ref": "1. 分镜路线的 video_track.mp4 设计上无声，声音在合成后的 final_output.mp4；图文页的可播放副本直接带原配音和字幕。分镜路线的 4K60 AV1 设置不套用到图文页和网页作品。",
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
     "text_ref": "1. 分镜路线的 video_track.mp4 设计上无声，声音在合成后的 final_output.mp4；图文页的可播放副本直接带原配音和字幕。分镜路线的 4K60 AV1 设置不套用到图文页和网页作品。",
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

三种出片方式、片段来源与输出哈希、少帧保护和全机排队已在源码中；本次未做任何编码（内容截止北京时间 2026-10-11 14:00，提交 cc41e514）

## 关键规则与设计选择

1. 分镜路线的 video_track.mp4 设计上无声，声音在合成后的 final_output.mp4；图文页的可播放副本直接带原配音和字幕。分镜路线的 4K60 AV1 设置不套用到图文页和网页作品。

2. 静态 doctor 不证明编码可用；单次短片也不证明所有长时间出片稳定。

3. 片段身份保护同一项目续作，不是跨项目缓存或通用媒体数据库；全机排队管同时出片的人数和内存，显卡租约管显卡编码，两者不是一回事，也不会暂停或终止别人的任务。

## 当前怎样实现

- `build_timeline` 按时长累加全局起止时间，seekTime 接收当前场景内的相对秒数。

- 分镜路线：3840×2160、60fps，av1_nvenc（p6/hq/constqp、CQ22、lookahead 32、yuv420p10le）；每段最多 300 帧，每路最多缓存 6 个页面，失败最多重试 2 次（共 3 次尝试）。背景循环并按起点裁切，前景叠加后可加暗角和颗粒。

- 图文页：坐标仍按 3840×2160，捕获高度只支持 1080 或 2160，浏览器整体缩放不改构图；旧表未填时默认 2160，新开场模板已填 1080。默认用 CPU 的 libx264（medium、质量值 12、yuv420p），关闭胶片效果，最后给 H.264/AAC 的 1080p 可播放副本。

- 图文页出片路数自动选 1—4 路：参考可用内存、留 14 GiB 余量、全机 2 个名额、每路估 3 GiB；`VIDEO_RENDER_WORKERS` 可手动指定。这是资源估计，不保证别的程序不占内存。

- 全机排队：图文页 render 和 stills 内置先来先出队列，旧的 `python -m pipeline.render_queue -- <命令>` 仍兼容，嵌套调用借用同一名额。默认最多 2 个出片任务同时跑；已有任务在跑时，新任务需要至少 14 GiB 可用内存，没人在跑时先放行一个。队列目录固定在本机，用系统锁判断谁还活着，进程退出名额就作废；票号、到达、放行、等待、内存和路数都写日志。

::screen{#video-scaffold-deterministic-render-06 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-06",
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
     "text_ref": "- 显卡协调保留：登记在本机 127.0.0.1:32100，租约 120 秒，约 40 秒续一次。",
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
     "text_ref": "- 显卡协调保留：登记在本机 127.0.0.1:32100，租约 120 秒，约 40 秒续一次。",
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

- 显卡协调保留：登记在本机 127.0.0.1:32100，租约 120 秒，约 40 秒续一次。

- `_render_identity.json` 绑定场景 HTML、其中素材、时长、背景 SHA、画布、转场、成片效果、编码参数与实际分段边界；复用前逐段回验来源和输出哈希，再用 ffprobe 数帧。

- 陈旧的受管片段、身份记录和拼接列表改为移进回收站，失败或有残留就不更新身份、不继续拼接，不降级成永久删除；编码先暂存，验证完整后才接受，成功片段保留到明确清理。

- 网页作品：`render(t)` 在 Canvas、SVG、WebGL 或网页元素上按绝对时间求帧，声音用 `audio(ctx)` 从 0 秒排好全部音符；默认 4K60、20 秒、上限 120 秒，可明示 1080p 或更高上限；输出名已存在就拒绝覆盖。普通网页抓取是附加路线，不承诺任意网页都能做到确定性。

- 网页作品显卡快路：完整全屏的 Canvas2D/WebGL 请求浏览器硬件编码（质量优先、120Mbps），最终用 h264_nvenc（p7/hq、QP10、High 5.2、无 B 帧、yuv420p）；可见的网页元素、交互光标或无法确认完整画面时继续 PNG 截图，`--renderer png` 用 x264 fast CRF18，显式 `--renderer webcodecs` 不满足条件就失败。快路先读颜色信息，按实际范围转成 BT.709 有限范围，颜色不明就拒绝；`.webfilm-cache` 存完整成功的段，每段最长 2 秒，按声明的场景边界切；默认只抽首、中、末帧核对，`--verify-frames` 才全部核对。

## 执行流程

1. 读取画面、时长与背景；图文页先领出片名额。

::screen{#video-scaffold-deterministic-render-07 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-07",
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
     "text_ref": "2. 计算总帧、分段边界和完整输入身份。",
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
     "text_ref": "2. 计算总帧、分段边界和完整输入身份。",
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

2. 计算总帧、分段边界和完整输入身份。

3. 逐段核对输入、输出哈希和帧数，不因同名或同长度就复用。

4. 多路只处理缺失或错误的片段。

5. 全部正确后无损拼接并核对整轨总帧。

6. 保留已验证的片段和画面轨，直到明确清理；不是成功后立即丢掉全部可复用成果。

::screen{#video-scaffold-deterministic-render-08 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-08",
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
|---|---|
| chunk（渲染分片） | 一段固定帧范围的临时视频；它覆盖的输入、输出字节与帧数都匹配才可复用。 |
| deterministic（确定性） | 同一画面在同一 t 秒按同一规则求状态，不依赖当时浏览器跑了多久。 |
| AV1（视频编码格式） | 分镜路线的硬件编码格式；图文页和网页作品快路用的是 H.264，不能都叫 AV1。4K60 单帧可用不等于整条长视频已验收。 |

## 专业定义

出片速度不改动画时间；只重做受影响的画面，但每段都必须证明来源正确。

解决什么

防止出片速度影响动画时间、显卡少帧造成持续音画漂移、中断恢复把旧内容混进新版本，以及几个任务同时出片把内存挤爆。

::screen{#video-scaffold-deterministic-render-09 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-09",
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
     "text_ref": "- 这次网页核对没有出片，不公布整片速度、显存峰值或稳定时长；本期影片已审定、网页作品 2026-10-04 彩排里 20 秒/1200 帧两次一致，都不能证明新快路、长视频或所有编码分支已验收。",
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
     "text_ref": "- 这次网页核对没有出片，不公布整片速度、显存峰值或稳定时长；本期影片已审定、网页作品 2026-10-04 彩排里 20 秒/1200 帧两次一致，都不能证明新快路、长视频或所有编码分支已验收。",
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

- 这次网页核对没有出片，不公布整片速度、显存峰值或稳定时长；本期影片已审定、网页作品 2026-10-04 彩排里 20 秒/1200 帧两次一致，都不能证明新快路、长视频或所有编码分支已验收。

- 背景可以循环覆盖任意时长，但接缝是否看不出仍需实际看。

- 同一路径素材的字节受身份保护；网页作品漏报跨场景的文件依赖时，程序无法证明局部复用正确。

## 失败与恢复

| 情况 | 怎么处理 |
|---|---|
| 片段少帧或 FFmpeg 非零退出 | 把该段移进回收站并有限次重试；仍失败就停止整轨拼接。 |
| 输入身份变化 | 只作废受该输入影响的片段，公共背景或编码变更可能影响全部；不把陈旧内容拼进新成片。 |
| 陈旧片段没能确认移进回收站，或素材缺失 | 直接失败并列出问题文件，不先写新身份掩盖旧文件。 |

::screen{#video-scaffold-deterministic-render-10 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-deterministic-render-10",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 构建与预览",
    "href": "/projects/video-scaffold/preflight-preview/"
   },
   {
    "text": "下一个模块 成片与交付",
    "href": "/projects/video-scaffold/delivery-verify/"
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
     "text_ref": "- 时间线、逐帧抓取、分片、身份、重试与帧数验证",
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
     "text_ref": "- 时间线、逐帧抓取、分片、身份、重试与帧数验证",
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

- 时间线、逐帧抓取、分片、身份、重试与帧数验证

- seekTime(t) 画面状态

- 当前 4K60 AV1 背景资产

## 如何验证

- 2026-09-03 历史回归验证旧身份保护，之后未重新运行；cc41e514 源码共有 216 个测试定义，这次没有运行，也没有做整轨制作。

- 2026-09-18 的静态 doctor 只确认协调登记，不调用 NVENC；2026-09-03 单帧编码结果保留历史日期，不升级为现在通过。

- 网页作品 2026-10-04 彩排的 20 秒/1200 帧重复渲染一致回执只覆盖那台机器那段样片；这次只重读回执，没有重播或重核哈希。

## 与其他模块的关系

本模块产出画面轨或可播放副本；交付模块负责把旁白、音乐、封面和章节合入并做结构验收，图文页的分段整片也在那里装配。
