---
{
 "title": "改密、升级和清理都要说清旧库还剩在哪里",
 "kind": "project",
 "url": "/projects/vault-tool/maintenance-recovery/",
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
  "page": "vault-tool-maintenance-recovery",
  "kind": "project",
  "title": "改密、升级和清理都要说清旧库还剩在哪里",
  "url": "/projects/vault-tool/maintenance-recovery/",
  "parent": "vault-tool",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）核对，没有维护任何真实库。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  },
  "based_on": {
   "commit": "b884ab61b8a9b62fd1412c493bff0c34a82afc06",
   "commit_time": "2026-10-01T18:22:19+08:00"
  }
 },
 "source": {
  "page": "sources/pages/vault-tool-maintenance-recovery/page.json",
  "sha256": "91900b0f3fb384379a6077ef269d4c2308771ae2e94d9aca683a05f62925ff28",
  "converted_at_beijing": "2026-10-30T15:12:32+08:00"
 }
}
---

::screen{#vault-tool-maintenance-recovery-01 section="top"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-01",
  "section": "top",
  "title": "改密、升级和清理都要说清旧库还剩在哪里",
  "links": [
   {
    "text": "回到项目 → 本地加密库",
    "href": "/projects/vault-tool/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/vault-tool"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/vault-tool/#ai-brief"
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
     "text_ref": "改密、升级和清理都要说清旧库还剩在哪里",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）核对，没有维护任何真实库。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "改密码时保留原来没改的内容，容量不够或要换密钥文件时先做另一份经过验证的库。新副本未成功前旧库不动；中途失败会说明原路径和恢复副本各是什么状态，而不是只留一句失败。",
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
     "text_ref": "改密、升级和清理都要说清旧库还剩在哪里",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 b884ab61（10 月 1 日，版本 2.3.1）核对，没有维护任何真实库。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "改密码时保留原来没改的内容，容量不够或要换密钥文件时先做另一份经过验证的库。新副本未成功前旧库不动；中途失败会说明原路径和恢复副本各是什么状态，而不是只留一句失败。"
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
   "asset": "_library/illustrations/modules/vault-tool-maintenance-recovery-v01.png",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一只绿色的密封信封（信封正面印着小字“vault.enc”），信封口被一把挂锁锁住，挂锁旁边一张写着一排小圆点的纸条（表示自己记住的密码）和一把小钥匙形状的卡片（表示可选的密钥文件）；信封后面露出两张半透明的卡片叠在一起（表示可以放两套内容）；信封右边一条细绿线连到一朵小云，云上画 GitHub 小猫标志和一把小锁（私人 Key 仓库）。",
   "sha256": "bb8fbdf1ac286d80f73038fd40f272b6921c4c1b7e1129fae48cf68263ae540a",
   "status": "ready"
  }
 ]
}
```

# 改密、升级和清理都要说清旧库还剩在哪里

〔回到项目 → 本地加密库〕　〔GitHub〕　〔复制 AI 续作说明〕

vault-tool · 功能说明

改密码时保留原来没改的内容，容量不够或要换密钥文件时先做另一份经过验证的库。新副本未成功前旧库不动；中途失败会说明原路径和恢复副本各是什么状态，而不是只留一句失败。

**当前情况：**已有只改已打开内容层、生成新副本及失败回退的维护功能；真实私人资料恢复仍需独立验证。

具体测试保留各自日期，页面不实时探测运行状态。

项目源码

公开仓库

::screen{#vault-tool-maintenance-recovery-02 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 改密码和升级都会生成新密文。操作中的临时副本、明确保留的旧库和远端备份各有不同去向；把它们都叫“自动备份”，出问题时反而可能找不到能恢复的那一份。 举个实际例子 “给这份库换密码，先确认原来能"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 改密码和升级都会生成新密文。操作中的临时副本、明确保留的旧库和远端备份各有不同去向；把它们都叫“自动备份”，出问题时反而可能找不到能恢复的那一份。 举个实际例子 “给这份库换密码，先确认原来能"
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

改密码和升级都会生成新密文。操作中的临时副本、明确保留的旧库和远端备份各有不同去向；把它们都叫“自动备份”，出问题时反而可能找不到能恢复的那一份。

## 举个实际例子

“给这份库换密码，先确认原来能打开的文件仍然在；失败时不要损坏旧库。”流程要先验证旧凭据，再核对重建范围与自检，并明确旧库副本是否会在成功后删除。

## 最后我会得到什么

得到经验证的新密码槽位、升级后的库或独立重建副本，并说明保留了哪些层、原库和恢复副本在哪里。冲突、取消和回滚失败单列；未知层的字节保留不等于已经验证其密码。

::screen{#vault-tool-maintenance-recovery-03 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-03",
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

新凭据或新格式下能取回本次明确维护的内容，并说明实际留下的旧库位置和寿命。

## 发现问题时

自检、写入、恢复或层次保留不成立时返回失败；已经发生的变化与仍可用原件分开说明。

## 入口不可用或证据不足时

旧凭据无法打开、必要密钥文件缺失或当前格式不支持该维护时停止，不把它当成新建空库。

::screen{#vault-tool-maintenance-recovery-04 section="usage"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-04",
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
     "text_ref": "改密：在已接通本机 vault-workflow 的 AI 对话中指定库，用技能的 ChangePassword，本人在本地提供旧凭据。迁移格式用核心命令 `migrate`，扩容或换密钥文件用 `rebuild --out` 生成新副本，清理旧备份用本机终端菜单；AI 技能没有这几项的模式，AI 可以帮我准备对应的本地步骤，但不会虚构一个通用维护窗口。",
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
     "text_ref": "1. **分清维护目标**　确认当前格式、层次和旧库位置，说明本次会生成哪份新库以及保留哪些旧文件。",
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
     "text_ref": "改密：在已接通本机 vault-workflow 的 AI 对话中指定库，用技能的 ChangePassword，本人在本地提供旧凭据。迁移格式用核心命令 `migrate`，扩容或换密钥文件用 `rebuild --out` 生成新副本，清理旧备份用本机终端菜单；AI 技能没有这几项的模式，AI 可以帮我准备对应的本地步骤，但不会虚构一个通用维护窗口。"
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
     "text_ref": "1. **分清维护目标**　确认当前格式、层次和旧库位置，说明本次会生成哪份新库以及保留哪些旧文件。",
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

改密：在已接通本机 vault-workflow 的 AI 对话中指定库，用技能的 ChangePassword，本人在本地提供旧凭据。迁移格式用核心命令 `migrate`，扩容或换密钥文件用 `rebuild --out` 生成新副本，清理旧备份用本机终端菜单；AI 技能没有这几项的模式，AI 可以帮我准备对应的本地步骤，但不会虚构一个通用维护窗口。

## 需要准备什么

- 要维护的库

- 本次是改密、迁移、重建还是清理

- 新库或旧备份的保留选择

- 本人在本地提供旧凭据

## 从开始到拿到结果

1. **分清维护目标**　确认当前格式、层次和旧库位置，说明本次会生成哪份新库以及保留哪些旧文件。

2. **生成并验证**　本人提供旧凭据；工具只处理可打开的范围，写出新结果并回读，失败时保留原库或恢复原状。

3. **确认后处理旧件**　逐项交代新库、临时备份和恢复位置；旧备份清理另由本人明确决定。

::screen{#vault-tool-maintenance-recovery-05 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 槽位改密、可验证新副本与事务回退已实现；真实私人恢复另验 关键规则与设计选择 1 旧版升级与当前库改密是独立操作，不需要为了普通查看先升级。 2 临时备份成功后可能删除"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 槽位改密、可验证新副本与事务回退已实现；真实私人恢复另验 关键规则与设计选择 1 旧版升级与当前库改密是独立操作，不需要为了普通查看先升级。 2 临时备份成功后可能删除"
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
     "text_ref": "1. 旧版升级与当前库改密是独立操作，不需要为了普通查看先升级。",
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
     "text_ref": "1. 旧版升级与当前库改密是独立操作，不需要为了普通查看先升级。",
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

槽位改密、可验证新副本与事务回退已实现；2026-10-11 重读源码，行为未变，真实私人恢复另验（源码 b884ab61，版本 2.3.1）

## 关键规则与设计选择

1. 旧版升级与当前库改密是独立操作，不需要为了普通查看先升级。

2. 事务里的临时回退副本成功后会清掉；独立恢复副本另有寿命。不能把“执行时有备份”当成永久恢复点。

3. VAULT03 原槽改密保留另一槽；改变共享密钥文件标志或容量必须走 rebuild 新副本。两密码重建需要两个已知密码分别打开不同槽位，不猜隐藏层是否存在；未解开的字节还在，不等于另一密码已验证。

## 当前怎样实现

- migrate_mode 识别当前格式；已有 VAULT03 则无需升级，VAULT01/02 需要原凭据解开再以当前格式重新封装。

- migrate、decoy、passwd 与本地编辑复用密文事务：候选验证、临时密文 fsync 与读回、原目标变化检查、提交、最终验证和必要回滚。失败恢复不覆盖第三方的并发变化；回滚也失败时保留 `.rollback.enc`，不报“已恢复”。迁移与双层设置保留不会覆盖已有文件的独立密文恢复副本：`.enc.bak` 已存在就另起 `.recovery.<随机>.enc`。

- passwd 对 VAULT03 只重加密当前解锁槽，原 KDF 及未解锁槽位密文字节保留。共享密钥文件标志不能在不知道另一层凭据时原地变更；credential-plan 明确引导到 rebuild --out 的新副本。

- rebuild 创建独立、读回验证的新容器，用于扩容、共享密钥文件变化或层次重建；可只复制当前已验证层而保留原库，也可显式输入第二个已知密码，在确认打开不同槽位并分别验证后保全两层。新库为后续编辑预留有界空间，旧槽不会静默扩大。

- VAULT03 改密和设置诱饵保留原 KDF 及全部编码参数，VAULT02 升级保留其 scrypt 参数；只有 VAULT01 迁移因原 PBKDF2 不在现有 V3 格式中，明确转为当前 scrypt。结构损坏或原算法不可用在密码、备份和写入前停止。

::screen{#vault-tool-maintenance-recovery-06 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-06",
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
     "text_ref": "- clean_backups_mode 枚举实际备份并要求本人明确确认；删除只针对精确备份，不等于清理全部原文、系统历史或云端版本。",
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
     "text_ref": "- clean_backups_mode 枚举实际备份并要求本人明确确认；删除只针对精确备份，不等于清理全部原文、系统历史或云端版本。",
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

- clean_backups_mode 枚举实际备份并要求本人明确确认；删除只针对精确备份，不等于清理全部原文、系统历史或云端版本。

- 恢复条件包括原库字节、对应密码、精确密钥文件及运行依赖；本机备份、私人仓库提交与另一磁盘副本分别证明各自保存状态。

## 执行流程

1. 确认是改密、升级、重建还是明确清理，不把几件事连成自动流程。

2. 核对当前库、原凭据、格式和可能的其他层。

3. 说明会保留的旧库及临时备份的实际寿命。

4. 生成并验证本次维护结果，失败保留或恢复原件。

5. 检查实际新内容与恢复位置，再由本人决定是否清理旧备份。

::screen{#vault-tool-maintenance-recovery-07 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-07",
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
| migration（格式迁移） | 先解读旧格式，再重新生成当前格式的密文；不是直接给旧文件换一个扩展名。 |
| rollback copy（回退副本） | 操作失败时用于恢复旧状态的具体文件；必须说明它何时产生、何时仍在、何时会被删除。 |
| unlocked layer（本次打开的内容层） | 当前凭据实际解出的那份内容，不自动等同双密码容器的全部内容。 |

## 专业定义

新密码能用还不够；原内容、另一层、旧库备份和失败回退必须分别核对。

::screen{#vault-tool-maintenance-recovery-08 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-08",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 恢复不是找回遗失密码，也不是把损坏的唯一密文自动修成原文。",
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
     "type": "prose",
     "text_ref": "解决什么"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 恢复不是找回遗失密码，也不是把损坏的唯一密文自动修成原文。",
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

防止维护过程假成功、丢失未核对内容，以及对旧库备份产生错误预期。

## 边界

- 恢复不是找回遗失密码，也不是把损坏的唯一密文自动修成原文。

- 不能为方便改密而静默改变原本声明的凭据、格式或层次范围。

- 没有实际私人备份或换机演练时，源码与样例只证明实现和所测试流程。

## 失败与恢复

- **旧密码或密钥文件不匹配**：停止维护，不生成替代空库，也不把旧库删掉后让本人再试。

- **新库自检或提交失败**：保留或恢复原库，明确是否产生临时文件，失败不能被命令行退出 0 隐藏。

- **无法保留其他内容层**：明确本操作的维护范围并保持可恢复原件；本地编辑入口无法保真时直接拒绝，不伪称双层完整。

::screen{#vault-tool-maintenance-recovery-09 section="tech"}

```typeset
{
 "screen": {
  "id": "vault-tool-maintenance-recovery-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 密码与格式",
    "href": "/projects/vault-tool/passwords-formats/"
   },
   {
    "text": "下一个模块 双密码容器",
    "href": "/projects/vault-tool/dual-password/"
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
     "text_ref": "- migrate_mode、change_password_mode、clean_backups_mode 与备份寿命",
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
     "text_ref": "- migrate_mode、change_password_mode、clean_backups_mode 与备份寿命",
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

- migrate_mode、change_password_mode、clean_backups_mode 与备份寿命

- 改密、旧库迁移、备份与错误分支回归

- 与私人远端密文备份区分的人工恢复流程

## 如何验证

- 2026-09-03 的虚构探针验证过旧密码拒绝、新密码往返，以及 V2→V3 内容相同并留下 .bak；这次只重读回执，没有重新运行。

- 9 月 3 日 pwbak 样例里“改密后删除旧备份”只说明当时的改密路线，不代表现在所有维护都删旧库；2.3.1 新增的槽位保全、新副本重建和不覆盖旧备份有隔离回归。9 月 28 日另有一次 144 项的历史实跑；当前源码共有 145 个测试定义，这次没有运行。

- 本轮没有清理任何真实备份、维护另一密码层或做换机恢复。

## 与其他模块的关系

日常内容追加在文件入库模块；双密码容器独立说明两层；远端密文保存与逐字节读回在密文备份模块。
