---
{
 "title": "明确账号下的当前本机朋友圈缓存",
 "kind": "project",
 "url": "/projects/wechat-direct/moments-local-cache/",
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
  "page": "wechat-direct-moments-local-cache",
  "kind": "project",
  "title": "明确账号下的当前本机朋友圈缓存",
  "url": "/projects/wechat-direct/moments-local-cache/",
  "parent": "wechatdirect",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；账号配置于 10 月 11 日 16:33 重新检查，本轮没有读取真实朋友圈缓存"
  }
 },
 "source": {
  "page": "sources/pages/wechat-direct-moments-local-cache/page.json",
  "sha256": "1e12657bd36f0e36975d532559eb09d2c3e1085b81693fca0fd6722c12520849",
  "converted_at_beijing": "2026-10-22T08:32:42+08:00"
 }
}
---

::screen{#wechat-direct-moments-local-cache-01 section="top"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-01",
  "section": "top",
  "title": "明确账号下的当前本机朋友圈缓存",
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
     "text_ref": "明确账号下的当前本机朋友圈缓存",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；账号配置于 10 月 11 日 16:33 重新检查，本轮没有读取真实朋友圈缓存",
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
     "text_ref": "明确账号下的当前本机朋友圈缓存",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；账号配置于 10 月 11 日 16:33 重新检查，本轮没有读取真实朋友圈缓存"
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
   "asset": "_library/module-illustrations/wechat-direct/moments-local-cache-v01.png",
   "key": "main-wechatdirect",
   "source_phrase": "右上一幅水彩插画：一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别写“主号”“副号”；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面写“档案”。",
   "sha256": "dcc3c1fc588ad8dad2510a4d704b44594949ec3dc003e22763eb19ff35991ae8",
   "status": "ready"
  }
 ]
}
```

# 明确账号下的当前本机朋友圈缓存

〔回到项目 → 微信聊天读取〕　〔GitHub〕　〔复制 AI 续作说明〕

WeChatDirect · 功能说明

可以把当前电脑已经看见的朋友圈内容有界交给当前工作，同时不会把主号、副号或远端完整性混在一起。

**当前情况：**已有按明确账号读取本机朋友圈缓存的功能；本轮未读真实正文，本机无缓存不代表对方没有发布。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码

公开仓库

::screen{#wechat-direct-moments-local-cache-02 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-02",
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

朋友圈不是普通聊天目录：账号自己的身份可能不在会话列表，当前缓存里的发布者也可能没有聊天会话。若只查 session 或默认 auto，容易漏人、串号并把缓存未命中误写成没有内容。

## 举个实际例子

我说“看看副号里小王最近发的朋友圈”。工具只看副号在这台电脑上已经缓存的内容；能找到人但没有正文时，它会提示我回到副号手动打开小王主页后再试，不把“本机没缓存”说成“他什么都没发”。

## 最后我会得到什么

得到这个明确账号在当前电脑已缓存的朋友圈内容、实际可见时间和缺口。没有本机缓存时会提示在同一账号手动打开目标后再试，不说对方没有发布。

## 结果怎么看

## 可直接使用

账号和发布者能唯一对应、电脑里确实有相关缓存时，交回实际可见部分。

## 需要确认

发布者重名、媒体未缓存或本机缓存变化时保留候选和缺口。

## 当前不可用

本机尚无这名发布者的缓存时说明如何手动取得，不自动打开主页或联网补历史。

::screen{#wechat-direct-moments-local-cache-03 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-03",
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
     "text_ref": "1. **系统核对并处理**　只读本机当前缓存并说明覆盖；没缓存时可在同一账号手动打开目标后再试。",
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
     "text_ref": "1. **系统核对并处理**　只读本机当前缓存并说明覆盖；没缓存时可在同一账号手动打开目标后再试。",
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

明确账号和联系人，请查看电脑当前已经缓存的朋友圈。

## 需要准备什么

- primary 或 secondary 账号

- 联系人和所需范围

## 从开始到拿到结果

1. **系统核对并处理**　只读本机当前缓存并说明覆盖；没缓存时可在同一账号手动打开目标后再试。

2. **交付与接续**　交回实际可见内容与缺口；不称远端全部历史已取得，也不混主副号。

::screen{#wechat-direct-moments-local-cache-04 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-04",
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
     "text_ref": "1. 朋友圈命令必须显式指定 primary 或 secondary，命令本身不会默认读两个号。我自然地问、没说哪个号时，是 AI 分别发出主号、副号两次明确请求，并标注各自结果；指定的号没配置就报错，不拿另一个号代读。",
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
     "text_ref": "1. 朋友圈命令必须显式指定 primary 或 secondary，命令本身不会默认读两个号。我自然地问、没说哪个号时，是 AI 分别发出主号、副号两次明确请求，并标注各自结果；指定的号没配置就报错，不拿另一个号代读。",
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

显式账号、自身身份、缓存发布者、未命中下一步和快照替换均有合成回归（当前源码 v0.2.3，最后提交 2026-10-20，共定义 225 个测试函数，2026-10-22 重数，本轮没有运行）；未读取真实朋友圈正文

## 关键规则与设计选择

1. 朋友圈命令必须显式指定 primary 或 secondary，命令本身不会默认读两个号。我自然地问、没说哪个号时，是 AI 分别发出主号、副号两次明确请求，并标注各自结果；指定的号没配置就报错，不拿另一个号代读。

2. self 使用来源账号作者身份承诺，不从昵称或头像推断；朋友圈作者只严格去掉末尾“_加四位十六进制”的存储后缀，计算承诺和实际读取共用同一条规则。

3. 发布者目录组合联系人、未登记联系人和当前缓存，不建立持久人物索引。

4. sync-moments 保存当前缓存快照，缓存已淘汰条目会从新快照移除。

5. target_not_in_current_local_cache 只触发一次同账号手动打开后重试。

## 当前怎样实现

- _resolve_moments_subject 强制显式账号，并组合 source-proven self、完整联系人目录和当前缓存发布者。

- list_moments 对指定人会扫描完整当前缓存后再应用 limit，避免目标在后部时被错误截断。

- moments 返回 target_cached / target_not_in_current_local_cache / account_cache_read。

::screen{#wechat-direct-moments-local-cache-05 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-05",
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
     "text_ref": "- sync-moments 用当前集合与旧 JSONL 比较 new / updated / removed，有变化才输出完整替换快照；文件占用和中断与联系人档案使用同一套明确错误和恢复入口。默认输出目录把本人、全缓存和指定联系人分开，联系人目录名按规范化后的请求哈希生成，避免名字转换后撞名。",
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
     "text_ref": "- sync-moments 用当前集合与旧 JSONL 比较 new / updated / removed，有变化才输出完整替换快照；文件占用和中断与联系人档案使用同一套明确错误和恢复入口。默认输出目录把本人、全缓存和指定联系人分开，联系人目录名按规范化后的请求哈希生成，避免名字转换后撞名。",
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

- sync-moments 用当前集合与旧 JSONL 比较 new / updated / removed，有变化才输出完整替换快照；文件占用和中断与联系人档案使用同一套明确错误和恢复入口。默认输出目录把本人、全缓存和指定联系人分开，联系人目录名按规范化后的请求哈希生成，避免名字转换后撞名。

- 来源指纹只覆盖 sns.db 与 contact.db 元数据；无变化时在原目录核对后只更新回执，不复制、不重新发布整包。

## 执行流程

1. 要求明确账号和 self / contact 选择。

2. 从账号身份、联系人目录和当前缓存解析唯一发布者。

3. 在请求窗口内扫描本机 sns 缓存。

4. 投影发布者标签、文字、媒体和 gaps。

5. 一次读取返回有界 JSON；同步则与旧快照比较变化。

6. 写出 current_local_cache_only 状态、清单和最近回执。

::screen{#wechat-direct-moments-local-cache-06 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-06",
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
| Explicit account（显式账号） | 朋友圈不接受 auto；每份结果必须明确属于主号或副号。 |
| targetCacheStatus | 目标已缓存、目标不在当前缓存，或正在读取账号整体缓存。 |
| Current cache replacement（当前缓存替换） | 刷新后档案准确代表当前可见集合；被缓存淘汰的旧条目不继续冒充可见。 |
| Source-proven self | 从配置绑定的账号原生身份推导本人朋友圈作者，不从显示名称猜。 |

## 专业定义

moments 与 sync-moments 只读取明确账号当前设备可见的 sns 缓存；缓存未命中不是空主页，刷新也不保留已淘汰条目。

::screen{#wechat-direct-moments-local-cache-07 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-07",
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
     "text_ref": "- 只读取当前设备缓存，不访问远端朋友圈主页或补历史。",
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
     "text_ref": "- 只读取当前设备缓存，不访问远端朋友圈主页或补历史。",
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

解决朋友圈作者目录不完整、主副号串用、缓存未命中冒充空内容和旧缓存条目长期残留。

## 边界

- 只读取当前设备缓存，不访问远端朋友圈主页或补历史。

- 不自动切号、点击、点赞、评论或输入。

- 联系人/群会话不是完整朋友圈作者目录。

- 真实朋友圈正文、发布者和媒体不进入网站。

## 失败与恢复

- **没有明确账号或用了 auto**：命令返回 moments_explicit_account_required；自然语言请求由 AI 分别对主号、副号各发一次明确请求。指定的号没有配置时返回 wechat_account_not_configured，不借另一个号。

- **同名发布者**：返回 contact_ambiguous 候选，不按第一项选择。

- **目标不在当前缓存**：提示在同一账号手动打开该目标朋友圈后重试，不宣称为空。

- **刷新期间缓存变化**：返回 source_changed_during_sync_retry，不提交新的 state。

::screen{#wechat-direct-moments-local-cache-08 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-moments-local-cache-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 回复、媒体与阅读包",
    "href": "/projects/wechat-direct/reply-media-relations/"
   },
   {
    "text": "下一个模块 账号与只读源",
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
     "text_ref": "- `README.md · moments / sync-moments`当前缓存、显式账号与手动补缓存边界。",
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
     "text_ref": "- `README.md · moments / sync-moments`当前缓存、显式账号与手动补缓存边界。",
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

- `README.md · moments / sync-moments`当前缓存、显式账号与手动补缓存边界。

- `wechat_cli.py · _resolve_moments_subject`self、联系人和缓存发布者的唯一解析。

- `wechat_cli.py · command_sync_moments`当前集合替换、增删改和导出清单。

- `tests/test_wechat_cli.py · moments`身份、缓存未命中、跨账号和淘汰回归。

## 如何验证

- test_moments_self_uses_source_account_identity 验证本人身份来自来源账号。

- test_moments_self_cache_miss_requests_same_account_profile_open 验证缓存未命中下一步。

- test_moments_rejects_implicit_cross_account_selection 验证不跨账号猜。

- test_moments_sync_replaces_items_evicted_from_current_cache 验证快照替换。

## 与其他模块的关系

朋友圈与聊天共享账号身份和媒体读取，但拥有独立的缓存范围、对象解析与同步状态，不能用聊天档案替代。
