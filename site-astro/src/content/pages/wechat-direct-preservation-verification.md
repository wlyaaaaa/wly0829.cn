---
{
 "title": "明确窗口保全、完整导出和独立验真",
 "kind": "project",
 "url": "/projects/wechat-direct/preservation-verification/",
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
  "page": "wechat-direct-preservation-verification",
  "kind": "project",
  "title": "明确窗口保全、完整导出和独立验真",
  "url": "/projects/wechat-direct/preservation-verification/",
  "parent": "wechatdirect",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；本轮没有新建保全包，也没有运行验真或测试"
  }
 },
 "source": {
  "page": "sources/pages/wechat-direct-preservation-verification/page.json",
  "sha256": "e2782a4b5f794fe33ea752a8726965493250d9ec002384a10c3006189cbd29cd",
  "converted_at_beijing": "2026-10-30T14:00:59+08:00"
 }
}
---

::screen{#wechat-direct-preservation-verification-01 section="top"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-01",
  "section": "top",
  "title": "明确窗口保全、完整导出和独立验真",
  "links": [
   {
    "text": "回到项目 → 微信聊天读取",
    "href": "/projects/wechatdirect/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/WeChatDirect"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/wechatdirect/#ai-brief"
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
     "text_ref": "明确窗口保全、完整导出和独立验真",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；本轮没有新建保全包，也没有运行验真或测试",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 微信聊天读取〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "WeChatDirect · 功能说明",
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
     "text_ref": "明确窗口保全、完整导出和独立验真",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；本轮没有新建保全包，也没有运行验真或测试"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 微信聊天读取〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "WeChatDirect · 功能说明"
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
   "asset": "_library/module-illustrations/wechat-direct/preservation-verification-v01.png",
   "key": "main-wechatdirect",
   "source_phrase": "右上一幅水彩插画：一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别写“主号”“副号”；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面写“档案”。",
   "sha256": "e8d24de048559131bde9496504991c29bb325b34b439b31648b03b976ea221f4",
   "status": "ready"
  }
 ]
}
```

# 明确窗口保全、完整导出和独立验真

〔回到项目 → 微信聊天读取〕　〔GitHub〕　〔复制 AI 续作说明〕

WeChatDirect · 功能说明

重要聊天可以留下独立可读、可核对的材料；保全包、阅读包和持续更新的档案，都能在不重新访问微信源的情况下确认没有文件被换掉或漏写。

**当前情况：**已有明确窗口保全和独立验真。同一个验真命令能核对四种材料：联系人归档、朋友圈快照、阅读包和保全包，这项支持 9 月 18 日就已实现。本轮没有新建包或重跑验真；验真通过也不证明微信未取得的远端历史已保存。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#wechat-direct-preservation-verification-02 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-02",
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

只复制屏幕截图或一堆媒体会丢失账号、对象、时间、回复与原消息关系；只有文件存在也不能证明清单、状态和媒体仍是一套。

## 举个实际例子

我明确要求“把昨晚这段聊天、回复关系和当前能打开的语音做成保全包”。完成后会得到消息、清单和媒体目录；打不开的图片、视频或文件仍留着关系和缺口。整套文件和清单写完后才一次性出现，不会把写到一半的目录交给我。

## 最后我会得到什么

得到一份包含所选聊天、回复关系和当前能打开附件的材料包，另有清单说明缺什么。以后随时可以单独核对这份包是否还完整；验真只看包里现有的文件和关系，不会把缺的附件变出来。

## 结果怎么看

## 可直接使用

包里每个文件都能和清单对上，验真才算通过；附件不全的包也能验真，结果会和缺口分开写。

## 需要确认

某张图或语音打不开时仍保留消息和缺口，不把附件空白说成整段聊天不存在。

## 当前不可用

目标已有内容或文件身份、数量不符时不覆盖，也不宣布保全成功。

::screen{#wechat-direct-preservation-verification-03 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-03",
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
     "text_ref": "1. **系统核对并处理**　按选定范围保存文字、关系、可用媒体，以及每个文件的指纹、大小和清单，写完后整个目录一次发布。保全包没有增量状态；完整验真是另一个单独的命令。",
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
     "text_ref": "1. **系统核对并处理**　按选定范围保存文字、关系、可用媒体，以及每个文件的指纹、大小和清单，写完后整个目录一次发布。保全包没有增量状态；完整验真是另一个单独的命令。",
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

要求给一段重要聊天做可核对的独立保全或验真。

## 需要准备什么

- 明确账号、对象与需要保全的时间窗口

- 是新保全、验真已有包还是补缺失媒体

## 从开始到拿到结果

1. **系统核对并处理**　按选定范围保存文字、关系、可用媒体，以及每个文件的指纹、大小和清单，写完后整个目录一次发布。保全包没有增量状态；完整验真是另一个单独的命令。

2. **交付与接续**　交回完整、部分或待恢复的真实状态；已有包可离线验真，缺媒体可定向补，不把生成成功当源内容完整。

::screen{#wechat-direct-preservation-verification-04 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-04",
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
     "text_ref": "1. preserve 只由明确保全请求触发，不把普通问答自动升级成证据包。",
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
     "text_ref": "1. preserve 只由明确保全请求触发，不把普通问答自动升级成证据包。",
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

保全包、目录发布、四种格式验真、路径 containment（隔离处置） 和媒体派生关系均有回归测试定义（当前源码 v0.2.3，最后提交 2026-10-29，共 293 个测试函数，2026-10-30 重数，本轮没有运行）

## 关键规则与设计选择

1. preserve 只由明确保全请求触发，不把普通问答自动升级成证据包。

2. 保全包与 sync 导出是两种产品：前者有界自包含，后者可持续增量。格式不同，但都能用 verify-export 独立验真。

3. 原始消息先保存；当前可打开的 SILK 语音保留原件，WAV 只是带来源哈希的派生文件。

4. preserve 只物化当前本机媒体；export-context 是另一个面向 AI 的有序阅读包。同一个 verify-export 可以分别验这两种包，但各验各的目录，一份通过不能证明另一份也通过。

5. verify-export 不需要账号配置或源数据库，可以在恢复后独立验真。

6. 任何错误都以列表返回，不能用其余文件通过来掩盖一个不一致。

## 当前怎样实现

- preserve 先调用 context 得到账号、对象、窗口、消息、引用和 gaps。

- 保全包在具名 .incomplete 候选目录写完所选消息、可用媒体、每项 hash/size 和 manifest（清单）后，一次 rename 发布成正式目录；它没有增量 state，也不在发布前自动跑整包 verify-export。两次改名与事务恢复只属于替换已有归档。packageCreated=true和exit0不等于全部所选内容可用，status=partial、delivery与hasMore必须独立读取。

::screen{#wechat-direct-preservation-verification-05 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-05",
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
     "text_ref": "- 媒体记录 messageNativeId、mediaId、kind、locatorSha256、bytes、sha256 与 derivedPaths。",
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
     "text_ref": "- 媒体记录 messageNativeId、mediaId、kind、locatorSha256、bytes、sha256 与 derivedPaths。",
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

- 媒体记录 messageNativeId、mediaId、kind、locatorSha256、bytes、sha256 与 derivedPaths。

- verify-export 接受 wechat-direct-contact-export.v1、moments-export.v1、阅读包和保全包四种 v1 格式。联系人与朋友圈核对 state 与记录；阅读包与保全包有 manifest 时核对宣告文件、hash/size、账号与对象绑定、消息/引用/媒体关系和语音派生来源（scope=declared_files_and_relations）。只有没有 manifest、但有 conversation.json 的旧阅读包才按 legacy 较窄范围检查；manifest 存在但损坏时直接失败，不退回旧格式。

- 验真限制所有相对路径留在导出根，拒绝反斜杠、冒号、..、绝对路径和符号链接逃逸。

## 执行流程

1. 确认用户明确要求保全或验证哪一个现有导出。

::screen{#wechat-direct-preservation-verification-06 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-06",
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
     "text_ref": "2. 保全先取得有界聊天和精确媒体；验证先读取导出 manifest（清单）并判断是哪一种格式。",
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
     "text_ref": "2. 保全先取得有界聊天和精确媒体；验证先读取导出 manifest（清单）并判断是哪一种格式。",
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

2. 保全先取得有界聊天和精确媒体；验证先读取导出 manifest（清单）并判断是哪一种格式。

3. 逐个核对账号、对象、范围、记录数、文件大小和 SHA-256。

4. 检查媒体文件、消息关系与语音派生来源。

5. 保全全部写入候选目录后一次改名发布；验证汇总全部错误。

6. 返回成功清单哈希，或失败字段和可恢复动作。

::screen{#wechat-direct-preservation-verification-07 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-07",
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
| Self-contained bundle（自包含保全包） | 离开源数据库后仍能理解账号、对象、时间、消息、回复、媒体与缺口。 |
| .incomplete | 尚未完成的候选目录。新保全写完后整体改名为正式目录；替换已有归档时才涉及两次改名，已知中断按事务恢复，未知旧目录不自动删除。 |
| Path containment（路径约束） | 清单里的每个文件都必须解析在导出根内，不能借相对路径或链接逃出。 |
| Independent verification（独立验真） | 不打开微信源，只依赖导出本身重算身份绑定、文件和关系；它只证明包内现有内容没被改，不证明聊天历史齐全。 |

## 专业定义

preserve 只在用户明确要求时生成自包含窗口；verify-export 不读源数据库，独立重算联系人归档、朋友圈快照、阅读包和保全包四种 v1 格式的身份、文件、数量、哈希和媒体关系。

::screen{#wechat-direct-preservation-verification-08 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-08",
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
     "text_ref": "- 保全目标必须由用户明确点名且尚不存在。",
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
     "text_ref": "- 保全目标必须由用户明确点名且尚不存在。",
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

解决什么

解决截图式保全缺关系、半完成目录冒充成品、导出文件被替换、state/manifest（清单） 串档和派生媒体失去来源。

## 边界

- 保全目标必须由用户明确点名且尚不存在。

- 保全包按自己的格式验真，不当成持续增量档案；没有清单的旧阅读包只做较窄检查。验真不读源、不修包、不补缺口。

- 媒体不可用时保留 gap，不从其他目录补同名文件。

- 保全成品含真实私人内容，只留本机，不进入网站或 PUBLIC（公开） Git。

## 失败与恢复

- **目标或 .incomplete 已存在**：拒绝覆盖并保留原目录，先由用户判断旧目录用途。

- **保全过程中出现普通错误**：清理本轮新建的 .incomplete，原目标仍不存在；进程被强制结束时无法保证完成清理，要人工查看留下的候选目录。

- **导出路径越界或符号链接逃逸**：verify-export 返回路径错误，不读取外部文件。

- **哈希、大小、数量、账号或派生关系不一致，或清单损坏**：返回 failed 和完整 errors，不局部判 PASS。

::screen{#wechat-direct-preservation-verification-09 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-preservation-verification-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 账号与只读源",
    "href": "/projects/wechat-direct/account-source-identity/"
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
     "text_ref": "- `wechat_cli.py · command_preserve`有界自包含保全和目录发布。",
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
     "text_ref": "- `wechat_cli.py · command_preserve`有界自包含保全和目录发布。",
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

- `wechat_cli.py · command_preserve`有界自包含保全和目录发布。

- `wechat_cli.py · command_verify_export`联系人、朋友圈、阅读包和保全包四种格式的独立验真合同。

- `tests/test_wechat_cli.py · preservation`消息、媒体、语音派生和 manifest（清单） 回归。

- `tests/test_public_commands.py · verify-export`路径、身份、哈希、数量和派生关系回归。

## 如何验证

- test_explicit_preservation_bundle_is_self_contained 验证保全自包含。

- test_verify_export_accepts_contact_and_moments_without_writes 验证两类持续导出；tests/test_product_completion.py 另定义阅读包、保全包和旧版阅读包的验真范围回归。

- test_verify_export_rejects_fixed_file_symlink_escape 验证路径逃逸失败。

- test_verify_export_rejects_cross_account_state 与媒体关系测试验证绑定。以上测试本轮只清点定义，没有运行。

## 与其他模块的关系

保全消费“聊天上下文”和“回复与媒体”；verify-export 验证“具名增量归档”“朋友圈缓存”的正式输出，也验证阅读包和保全包，但不替代源端读取、重核与媒体修复。
