---
{
 "title": "只读一个明确对象的最小有用聊天上下文",
 "kind": "project",
 "url": "/projects/wechat-direct/bounded-chat-context/",
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
  "page": "wechat-direct-bounded-chat-context",
  "kind": "project",
  "title": "只读一个明确对象的最小有用聊天上下文",
  "url": "/projects/wechat-direct/bounded-chat-context/",
  "parent": "wechatdirect",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；无正文环境体检于 10 月 11 日 16:32—16:33 重新检查，真实具名会话没有读取"
  }
 },
 "source": {
  "page": "sources/pages/wechat-direct-bounded-chat-context/page.json",
  "sha256": "7642f23a83627dec0c2880ed9cebeb0e51dc18d030cdadaa9f3f311880ad4566",
  "converted_at_beijing": "2026-10-31T13:58:52+08:00"
 }
}
---

::screen{#wechat-direct-bounded-chat-context-01 section="top"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-01",
  "section": "top",
  "title": "只读一个明确对象的最小有用聊天上下文",
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
     "text_ref": "只读一个明确对象的最小有用聊天上下文",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；无正文环境体检于 10 月 11 日 16:32—16:33 重新检查，真实具名会话没有读取",
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
     "text_ref": "只读一个明确对象的最小有用聊天上下文",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 20 日最后一次提交（v0.2.3，10 月 22 日复核；这次提交只改安装方式和语音自检用的 Python）；无正文环境体检于 10 月 11 日 16:32—16:33 重新检查，真实具名会话没有读取"
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
   "asset": "_library/module-illustrations/wechat-direct/bounded-chat-context-v01.png",
   "key": "main-wechatdirect",
   "source_phrase": "右上一幅水彩插画：一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别写“主号”“副号”；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面写“档案”。",
   "sha256": "42960faca4e29cbcb8a79b8b2c99bfc42da8c824bbcbf799fc2e1bbf2de2e78c",
   "status": "ready"
  }
 ]
}
```

# 只读一个明确对象的最小有用聊天上下文

〔回到项目 → 微信聊天读取〕　〔GitHub〕　〔复制 AI 续作说明〕

WeChatDirect · 功能说明

问一句微信事实时，不需要先导出整个账号。要补最近变化，可以先按明确账号与时间列出当前会话候选，再选要读的联系人或群；时间未知和扫描后又变化的会话也会保留，不把漏项说成无变化。要先找自己在大群说过什么，可筛本人及归属未定的发言，继续带着同一筛选翻页；需要别人的回应时再围绕命中补读。最终得到带账号、对象、时间、引用与附件关系的上下文，账号不明确或来源不可读就保留缺口。

**当前情况：**已有指定账号和对象的聊天读取、变化发现与引用处理；本轮未读取真实会话，实际缺口由所选窗口返回。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码

公开仓库

::screen{#wechat-direct-bounded-chat-context-02 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-02",
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

一条消息的含义可能取决于谁发的、回复哪条、附件是什么，以及当前窗口是不是完整历史。只按关键词抄一句，容易把群成员、本人、系统消息和引用目标混在一起。

## 举个实际例子

我问“项目群里最后是谁同意周五交付？”工具只翻这个群里够回答问题的一段，把说话人、时间和那句回复指向的原消息一起给我；主号、副号里都有同名群时，它先列候选，绝不蒙一个。

## 最后我会得到什么

交回这次确实读到的一小段聊天：账号、联系人或群、时间范围、说话人、原回复和附件可用性。若只有小窗口或有遗漏，会说明实际范围，不能当整段历史。

::screen{#wechat-direct-bounded-chat-context-03 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-03",
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
     "text_ref": "可直接使用",
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
     "text_ref": "可直接使用",
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

## 可直接使用

账号和对象唯一，窗口可读，影响问题的发送者、引用和媒体关系都已返回。

## 需要确认

对象重名、引用目标在窗口外、群成员标签不全或媒体打不开时，保留候选和缺口，并只扩大必要范围。

## 当前不可用

账号配置、身份承诺、本地消息库、时间索引或输出边界不成立时停止，不换来源补猜。

::screen{#wechat-direct-bounded-chat-context-04 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-04",
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
     "text_ref": "1. **系统核对并处理**　先从会话变化或本人参与定位小范围，再读足够前后文和原回复，不导出整个账号。",
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
     "text_ref": "1. **系统核对并处理**　先从会话变化或本人参与定位小范围，再读足够前后文和原回复，不导出整个账号。",
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

说明账号、联系人或群，以及要问的那段微信事实。

## 需要准备什么

- 微信账号和要看的联系人或群

- 时间、关键词或本人参与线索（如有）

## 从开始到拿到结果

1. **系统核对并处理**　先从会话变化或本人参与定位小范围，再读足够前后文和原回复，不导出整个账号。

2. **交付与接续**　交回说话人、时间、回复及媒体缺口；对象不唯一或范围不足时停下补线索，不猜是谁。

::screen{#wechat-direct-bounded-chat-context-05 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-05",
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
  "reuse": null,
  "derived_as_of": "数字截至 2026 年 10 月 31 日"
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
     "text_ref": "1. coverage.hasMore 与 continuation 决定是否还需续查；游标固定账号、聊天、时间范围和搜索条件，每次调用仍是独立本地快照，不宣称历史跨页永不变化。",
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
     "text_ref": "1. coverage.hasMore 与 continuation 决定是否还需续查；游标固定账号、聊天、时间范围和搜索条件，每次调用仍是独立本地快照，不宣称历史跨页永不变化。",
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

9月9日来源投影、上下文与候选发现45项及6子测试通过（之后未重新运行）；当前源码 v0.2.3（最后提交 2026-10-29）共定义 293 个测试函数（2026-10-30 重数），本轮没有运行；2026-10-11 无正文环境体检成功；真实具名会话未读取

## 关键规则与设计选择

1. coverage.hasMore 与 continuation 决定是否还需续查；游标固定账号、聊天、时间范围和搜索条件，每次调用仍是独立本地快照，不宣称历史跨页永不变化。

2. not_found_in_page 不等于请求窗口未命中；末页 not_found_in_remaining_window 只说明剩余范围，存在正文解码缺口时不能说从未说过。

3. coverage.returnedAllScanned 明确展示是否包含所有扫描消息；关键词附近的小窗口不是完整历史，continuation.purpose 分开继续找命中与普通翻页。

4. 聊天默认从最小窗口开始，不先创建全量档案。

5. auto 只有唯一匹配时才选择账号；多匹配必须由用户决定。

6. 返回窗口的 self=0 只表示这段没有观察到本人消息，不代表全历史没有。

7. 空窗口仍说明当前会话是否存在更早或更新的本地可见消息。

8. 私聊与群聊引用目标均可按原生server id精确回查；源中缺失或无法读取时仍保留缺口，不保证全部回复都能补回。

::screen{#wechat-direct-bounded-chat-context-06 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-06",
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
     "text_ref": "9. 只有会改变答案的媒体才需要进一步打开或转写。",
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
     "text_ref": "9. 只有会改变答案的媒体才需要进一步打开或转写。",
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

9. 只有会改变答案的媒体才需要进一步打开或转写。

## 当前怎样实现

- changes固定discovery.requestedWindow.untilS；按明确primary/secondary/both独立读取当前SessionTable（只查已配置的槽位），保留隐藏会话、时间未知项和observed_after_until候选。completeScope只覆盖当前表，historicalChangeDetection明确不检测已消失会话、旧消息补入/撤回、正文或标签修订。

- --self-only在fetch_messages解码前按当前分片发送者方向筛self/unknown（未验证），selectionScope与coverage.senderScope均为self_messages_and_unresolved_senders。v2游标绑定selfOnly，续查不能改变筛选；v1普通游标继续兼容。引用目标按原生ID补取，不把筛选结果当作全群上下文。

- _resolve_contact 只在已配置的一个或两个槽位中按当前联系人目录解析唯一对象，contact_ambiguous 返回公开安全候选；显式指定了未配置的账号时返回 wechat_account_not_configured，不拿另一个账号代读。

- _context_result 校验扫描与返回上限，按 since / until / lookback / around / contains 形成有界窗口。

- _sender_receipt 保留 self、other、system、unknown（未验证） 与群成员标签；文件传输助手只加标签，不改写原生角色。

- 返回 scannedSenderRoleCounts、returnedSenderRoleCounts、selfObservation、availableHistoryHint 与 gaps。

- Canonical JSON（规范 JSON）计算 manifestSha256。输出超过本次字节预算时先减少消息页数，单条长文本改为分段续读；只有极端元数据仍超预算才返回 context_metadata_too_large_use_export_context，并指向新目录阅读包这条路。

::screen{#wechat-direct-bounded-chat-context-07 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-07",
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
     "text_ref": "- context --byte-limit限制32–512KiB终端JSON，普通continuation负责其余消息；segmentedFields仅是长字段预览，message-part绑定同一显式账号/对象、偏移和whole-text hash（内容指纹）续读。source_changed要求重新context，不能跨版本拼接；便携export-context仍保存选定全文，终端预算不截断阅读包里的文件。",
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
     "text_ref": "- context --byte-limit限制32–512KiB终端JSON，普通continuation负责其余消息；segmentedFields仅是长字段预览，message-part绑定同一显式账号/对象、偏移和whole-text hash（内容指纹）续读。source_changed要求重新context，不能跨版本拼接；便携export-context仍保存选定全文，终端预算不截断阅读包里的文件。",
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

- context --byte-limit限制32–512KiB终端JSON，普通continuation负责其余消息；segmentedFields仅是长字段预览，message-part绑定同一显式账号/对象、偏移和whole-text hash（内容指纹）续读。source_changed要求重新context，不能跨版本拼接；便携export-context仍保存选定全文，终端预算不截断阅读包里的文件。

## 执行流程

1. 读取已配置账号槽位的公开安全配置结构。

2. 解析唯一联系人或群，失败时返回未命中或候选。

3. 按请求时间与上限读取一个本地快照；--around 优先取最靠近锚点的消息，再按时间排序，续查上界固定但每页快照独立。

4. 围绕关键词或时间锚点选择最多 80 条。

5. 补全发送者、回复目标和媒体缺口。

6. 写出带实际范围与哈希的 JSON，不修改任何源数据。

::screen{#wechat-direct-bounded-chat-context-08 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-08",
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
| Bounded context（有界上下文） | 账号、对象、时间和返回数量都明确的一小段消息，不代表远端或本地全历史。 |
| Sender role（发送者角色） | self、other、system 或 unknown（未验证）；群聊还单独解析成员标签。 |
| availableHistoryHint | 窗口为空时说明当前本机是否仍知道更早、更晚或不可读消息存在。 |
| manifestSha256 | 对本次规范结果计算的整体内容指纹，用于确认回执没有静默变化。 |

## 专业定义

先用changes发现当前变化候选，再对明确对象读取有界上下文；可以先筛本人参与，缺少他人回应时再补读。

::screen{#wechat-direct-bounded-chat-context-09 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-09",
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
     "text_ref": "- 最多扫描 500 条、返回 80 条，默认回看 7 天。",
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
     "text_ref": "- 最多扫描 500 条、返回 80 条，默认回看 7 天。",
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

解决错账号、错对象、截断上下文、发送者混淆、小窗口冒充全历史和附件关系丢失。

## 边界

- 最多扫描 500 条、返回 80 条，默认回看 7 天。

- 不自动把窗口扩大到整个联系人、群或账号。

- 当前设备本地可见范围不等于微信远端全历史。

- changes完整不等于历史变化完整；self-only完整不等于全群上下文完整；精确引用回查仍受本机可读范围约束。

- 不把真实联系人、聊天正文或媒体复制到网页。

## 失败与恢复

- **多个账号或对象精确匹配**：返回 contact_ambiguous 候选，等待用户选定，不取第一项。

- **关键词或时间锚点未命中**：返回明确锚点缺口；只在用户需要时调整窗口。

::screen{#wechat-direct-bounded-chat-context-10 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-10",
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
     "text_ref": "- **回复目标或媒体不在当前可见范围**：保留 quote_target_missing / media_not_openable 等 gaps，不伪造正文。",
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
     "text_ref": "- **回复目标或媒体不在当前可见范围**：保留 quote_target_missing / media_not_openable 等 gaps，不伪造正文。",
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

- **回复目标或媒体不在当前可见范围**：保留 quote_target_missing / media_not_openable 等 gaps，不伪造正文。

- **输出太大或消息库缺索引**：两件事分开处理。输出太大时先缩页、长文本分段续读，仍不够就改用 export-context 生成阅读包；缺索引才需要缩小范围或修复源级索引后重试。

::screen{#wechat-direct-bounded-chat-context-11 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-bounded-chat-context-11",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 具名增量归档",
    "href": "/projects/wechat-direct/named-chat-archive/"
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
     "text_ref": "- `README.md · context`自然语言用途、命令示例与小窗口边界。",
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
     "text_ref": "- `README.md · context`自然语言用途、命令示例与小窗口边界。",
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

- `README.md · context`自然语言用途、命令示例与小窗口边界。

- `wechat_cli.py · _resolve_contact / _context_result`唯一对象解析、窗口选择、发送者、回复和结果合同。

- `wechat_source.py · fetch_messages`分片消息读取、内容投影、索引与媒体关系。

- `tests/test_wechat_cli.py`对象歧义、窗口角色、引用目标、媒体缺口和空窗口回归。

## 如何验证

- test_exact_contact_ambiguity_never_picks_first 验证多匹配不猜。

- test_context_keeps_native_ids_quote_target_and_media_gap 验证消息、引用和媒体缺口。

- test_empty_context_reports_that_older_local_history_exists 验证空窗口不冒充全历史为空。

- 真实可用性仍需用户点名对象后的 context E2E（端到端验证），本次网页刷新未执行。

## 与其他模块的关系

这是一次性问题的默认入口；需要长期保存时进入“具名增量归档”，需要打开附件时进入“回复与媒体关系”。
