---
{
 "title": "两个隔离账号、来源身份承诺与只读数据库快照",
 "kind": "project",
 "url": "/projects/wechat-direct/account-source-identity/",
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
  "page": "wechat-direct-account-source-identity",
  "kind": "project",
  "title": "两个隔离账号、来源身份承诺与只读数据库快照",
  "url": "/projects/wechat-direct/account-source-identity/",
  "parent": "wechatdirect",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "来源代码核对到 10 月 7 日最后一次提交（v0.2.3）；无正文环境体检和账号配置于 10 月 11 日 16:32—16:33 重新检查，没有实际读取聊天"
  }
 },
 "source": {
  "page": "sources/pages/wechat-direct-account-source-identity/page.json",
  "sha256": "30910c3a8fd8e03a740acb09486b71ffeb470f0221ed49bbae923f1543647f00",
  "converted_at_beijing": "2026-10-31T12:46:24+08:00"
 }
}
---

::screen{#wechat-direct-account-source-identity-01 section="top"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-01",
  "section": "top",
  "title": "两个隔离账号、来源身份承诺与只读数据库快照",
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
     "text_ref": "两个隔离账号、来源身份承诺与只读数据库快照",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 7 日最后一次提交（v0.2.3）；无正文环境体检和账号配置于 10 月 11 日 16:32—16:33 重新检查，没有实际读取聊天",
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
     "text_ref": "两个隔离账号、来源身份承诺与只读数据库快照",
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
     "static_note": "截至 10 月 11 日 · 来源代码核对到 10 月 7 日最后一次提交（v0.2.3）；无正文环境体检和账号配置于 10 月 11 日 16:32—16:33 重新检查，没有实际读取聊天"
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
   "asset": "_library/module-illustrations/wechat-direct/account-source-identity-v01.png",
   "key": "main-wechatdirect",
   "source_phrase": "右上一幅水彩插画：一台电脑屏幕上并排两个聊天窗口，窗口顶上的小名牌分别写“主号”“副号”；一只放大镜照着其中一小段聊天气泡，一条细绿线从一句回复连到它引用的原句；屏幕旁一个数据库圆柱，上面贴一把小锁（表示只读）；再旁边一个文件夹，封面写“档案”。",
   "sha256": "5006e17b7471c08cb35cce7c319d2d65b472518fcf58806eba6b6e42100650b9",
   "status": "ready"
  }
 ]
}
```

# 两个隔离账号、来源身份承诺与只读数据库快照

〔回到项目 → 微信聊天读取〕　〔GitHub〕　〔复制 AI 续作说明〕

WeChatDirect · 功能说明

同名联系人、双开微信和本机加密数据库不会因为“看起来像”而串到另一个账号；源数据库也不会为了读取而被改写。

**当前情况：**已有分开主号、副号并核对来源的机制，只配一个账号也能用；读取时微信可以照常写入，文字、图片与语音依赖分别检查，账号不明确时不猜。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#wechat-direct-account-source-identity-02 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-02",
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

主号、副号可能有相同昵称和联系人；真实数据库仍在写入，直接解密查询也可能得到不一致页面。若身份和快照不先闭合，后面的消息再完整也可能来自错账号或半写状态。

## 举个实际例子

主号和副号里都有人叫“小王”，我只说一句“别拿错”。工具会先让我确定账号，再核对这个账号与本地资料确实是一套；身份有一点对不上就停，不会因为头像和昵称很像便把两边聊天拼起来。

## 最后我会得到什么

得到已核对的微信账号和一份稳定、只读的本机资料副本，后续查询才会使用它。账号或来源对不上时停下，不泄露账号解密信息，也不混主副号。

::screen{#wechat-direct-account-source-identity-03 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-03",
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

账号和本机来源能唯一对应，临时读取副本完整，才开始读消息。

## 需要确认

依赖或语音解码器缺失时分别报告；只影响相关功能，不说全部微信读取都坏了。

## 当前不可用

账号目录不唯一、配置不可读，或本机资料在复制时一直在变（自动重试 3 次仍不稳定）时先停，不能猜一个相似账号。

::screen{#wechat-direct-account-source-identity-04 section="usage"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-04",
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
     "text_ref": "1. **系统核对并处理**　核对账号来源，把本机加密库复制到临时位置做只读快照和完整性检查；复制时微信照常写入也不影响，文件在复制前后对不上就自动重取，最多 3 次，仍不稳定才停。",
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
     "text_ref": "1. **系统核对并处理**　核对账号来源，把本机加密库复制到临时位置做只读快照和完整性检查；复制时微信照常写入也不影响，文件在复制前后对不上就自动重取，最多 3 次，仍不稳定才停。",
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

读取微信前先指明主号或副号与对象，或让 auto 只在唯一匹配时选。

## 需要准备什么

- 指定主号、副号，或允许唯一匹配时自动选定

- 要读的联系人或群

## 从开始到拿到结果

1. **系统核对并处理**　核对账号来源，把本机加密库复制到临时位置做只读快照和完整性检查；复制时微信照常写入也不影响，文件在复制前后对不上就自动重取，最多 3 次，仍不稳定才停。

2. **交付与接续**　交回与正确账号绑定的上下文；多匹配、解密或快照失败时不借另一账号补空。

::screen{#wechat-direct-account-source-identity-05 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-05",
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
  "derived_as_of": "数字截至 2026 年 10 月 30 日"
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
     "text_ref": "1. primary / secondary 是配置身份，不从窗口、头像或昵称推断和修复。",
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
     "text_ref": "1. primary / secondary 是配置身份，不从窗口、头像或昵称推断和修复。",
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

环境检查可独立于账号运行；文字/图片与Python3.11语音分别验收。当前源码 v0.2.3（最后提交 2026-10-07）

## 关键规则与设计选择

1. primary / secondary 是配置身份，不从窗口、头像或昵称推断和修复。

2. 配置不保存微信密钥明文，真实路径与承诺值只留本机。

3. 源数据库与 WAL 不被写入；所有查询发生在临时快照。

4. Doctor 不打开数据库正文，也不输出路径或密钥。

5. 某个依赖缺失只影响对应能力，例如 voiceDecoder unavailable 不等于文字上下文不可用。

## 当前怎样实现

- accounts.json 只允许 primary / secondary 两个槽位名，但至少配置一个即可，不要求必须双号；本机当前配置了 2 个。每个已配置槽位提供 config_path、local_state_path 和两个来源身份承诺；identity-commitments 可从本人有权读取的这两份已有保护载体计算出这两个承诺，只输出承诺，不输出账号原生 ID 或密钥。这两份载体由哪个程序、哪个版本生成，目前未核实。

- Windows DPAPI 解开 Local State 中的本机 AES key，再解开 dbPath、decryptKey 与 myWxid。

- load_direct_source_identity 只接受一个与原生身份匹配的 db_storage 账号根。

::screen{#wechat-direct-account-source-identity-06 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-06",
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
     "text_ref": "- EncryptedPageCodec验证加密页面与WAL校验和，只合并已提交WAL前缀，保留源数据库/WAL只读；不以临时快照成功推断原会话或远端内容完整。",
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
     "text_ref": "- EncryptedPageCodec验证加密页面与WAL校验和，只合并已提交WAL前缀，保留源数据库/WAL只读；不以临时快照成功推断原会话或远端内容完整。",
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

- EncryptedPageCodec验证加密页面与WAL校验和，只合并已提交WAL前缀，保留源数据库/WAL只读；不以临时快照成功推断原会话或远端内容完整。

- 源数据库和 WAL 只以读权限打开，同时允许微信继续读写、删除或改名；结构探测和快照复制前后都比较文件身份、大小和 mtime，各最多 3 次，持续不稳才失败，不混用两代文件；通过 PRAGMA quick_check 后只读 query_only。

## 执行流程

1. 解析命令行、环境、本地设置或默认 accounts.json。

2. 校验已配置的账号槽位和每个槽位必需的两个身份承诺。

3. 使用当前 Windows 用户的 DPAPI 解开本机保护配置。

4. 锁定唯一账号目录并生成身份承诺。

5. 复制或解密数据库，合并 WAL，比较前后签名；签名不一致时有界重取。

6. quick_check 通过后以 query_only 打开；任务结束清理临时目录。

::screen{#wechat-direct-account-source-identity-07 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-07",
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
| DPAPI（Windows 数据保护接口） | 让配置载荷只能由当前 Windows 用户在本机解开，不把密钥明文写入项目。 |
| Account identity commitment（账号身份承诺） | 原生微信身份的 SHA-256；验证同一来源而不公开真实 wxid。 |
| WAL（数据库预写日志） | SQLite 尚未合并进主文件的已提交页面；快照需要一并处理才能保持一致。 |
| query_only | SQLite 连接明确禁止写入，所有查询都针对临时快照。 |

## 专业定义

primary / secondary 是两个严格隔离的配置槽位，可以只配一个；每次读取先核对来源身份承诺，再在临时目录准备通过完整性检查的只读快照。

::screen{#wechat-direct-account-source-identity-08 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-08",
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
     "text_ref": "- 真实 config、Local State、数据库路径、wxid、解密 key 和承诺值不进入网页或 Git。",
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
     "text_ref": "- 真实 config、Local State、数据库路径、wxid、解密 key 和承诺值不进入网页或 Git。",
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

解决双账号串源、凭据明文、读写源数据库、活动 WAL 导致不一致和把体检冒充真实读取。

## 边界

- 真实 config、Local State、数据库路径、wxid、解密 key 和承诺值不进入网页或 Git。

- 只有当前 Windows 用户有权访问的本人设备数据属于来源。

- Doctor 证明文件和依赖入口存在，不证明数据库身份或聊天读取成功。

- 主 CLI（命令行工具） 只支持 Windows 和 Python 3.14+。

## 失败与恢复

- **配置或 Local State 不可解密**：DirectCredentialError，读取前停止，不输出值。

- **账号目录零个或多个匹配**：local source account directory is ambiguous，不猜目录。

- **页面、HMAC、WAL 或 quick_check 失败**：SnapshotCopyError / EncryptedPageError，不查询部分快照。

- **源在三次快照期间持续变化**：bounded snapshot retries 失败，稍后重试，不写源。

::screen{#wechat-direct-account-source-identity-09 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-09",
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
     "text_ref": "- **微信窗口退回扫码页、提示重新登录**：之前出现过这个问题，10 月 7 日我确认已经恢复。当时同时做了两项调整：读取方式的兼容修复，以及让一个屏幕叠加工具不再挂接微信主程序。两项一起做、没有分开试，所以真正原因还不确定，也不能保证以后不会再掉登录；那项工具设置由电脑配置项目维护。",
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
     "text_ref": "- **微信窗口退回扫码页、提示重新登录**：之前出现过这个问题，10 月 7 日我确认已经恢复。当时同时做了两项调整：读取方式的兼容修复，以及让一个屏幕叠加工具不再挂接微信主程序。两项一起做、没有分开试，所以真正原因还不确定，也不能保证以后不会再掉登录；那项工具设置由电脑配置项目维护。",
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

- **微信窗口退回扫码页、提示重新登录**：之前出现过这个问题，10 月 7 日我确认已经恢复。当时同时做了两项调整：读取方式的兼容修复，以及让一个屏幕叠加工具不再挂接微信主程序。两项一起做、没有分开试，所以真正原因还不确定，也不能保证以后不会再掉登录；那项工具设置由电脑配置项目维护。

::screen{#wechat-direct-account-source-identity-10 section="tech"}

```typeset
{
 "screen": {
  "id": "wechat-direct-account-source-identity-10",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 朋友圈缓存",
    "href": "/projects/wechat-direct/moments-local-cache/"
   },
   {
    "text": "下一个模块 保全与验真",
    "href": "/projects/wechat-direct/preservation-verification/"
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
     "text_ref": "- `accounts.example.json`隔离槽位和身份承诺的公开结构（可只配一个槽位）。",
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
     "text_ref": "- `accounts.example.json`隔离槽位和身份承诺的公开结构（可只配一个槽位）。",
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

- `accounts.example.json`隔离槽位和身份承诺的公开结构（可只配一个槽位）。

- `wechat_source.py · load_direct_source_identity`DPAPI、配置解密和唯一账号根。

- `wechat_source.py · EncryptedPageCodec / DirectWeChatReader`页面解密、WAL、临时快照与只读连接。

- `wechat_cli.py · command_doctor / identity-commitments`无正文环境体检、局部可用状态，以及从已有载体计算身份承诺。

## 如何验证

- 2026-10-11 16:33 普通 Doctor 返回 success、configuredAccounts=2、所需文件 2/2、依赖与 voiceDecoder available；16:32 的仅环境检查各项能力也可用（它不检查账号，所以那里的账号数 0 不代表没有账号）。两次都没有测试实际读取，sourceAccess=not_tested。

- test_reader_rejects_wrong_source_identity_commitment_before_reads 验证身份不匹配在正文前失败。

- test_account_config_requires_both_identity_commitments 验证每个槽位两个承诺必需。

- test_doctor_is_body_free_and_requires_windows 验证 Doctor 不打开正文且限制平台。

## 与其他模块的关系

所有聊天、朋友圈、媒体和归档模块都以这里的账号身份与稳定快照为前提；它只建立可信来源，不拥有聊天语义。
