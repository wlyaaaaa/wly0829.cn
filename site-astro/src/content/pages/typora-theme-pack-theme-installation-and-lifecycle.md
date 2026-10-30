---
{
 "title": "安装、备份与文件核对",
 "kind": "project",
 "url": "/projects/typora-theme-pack/theme-installation-and-lifecycle/",
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
  "page": "typora-theme-pack-theme-installation-and-lifecycle",
  "kind": "project",
  "title": "安装、备份与文件核对",
  "url": "/projects/typora-theme-pack/theme-installation-and-lifecycle/",
  "parent": "typora-theme-pack",
  "status_line": {
   "state": "偶尔用",
   "as_of": "2026-10-11",
   "source": "源码按北京时间 14:00 前最后提交 f30ac9c（9 月 29 日）核对，未重装或恢复。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  },
  "based_on": {
   "commit": "f30ac9c584e6fff0abe48ebd58b119c4d3c08da8",
   "commit_time": "2026-09-28T12:36:45-05:00"
  }
 },
 "source": {
  "page": "sources/pages/typora-theme-pack-theme-installation-and-lifecycle/page.json",
  "sha256": "4bb4dbdd94b8ef45bbd0e31a332203ad3e843896085cdb9cb6cc86c267cb98f7",
  "converted_at_beijing": "2026-10-30T15:12:32+08:00"
 }
}
---

::screen{#typora-theme-pack-theme-installation-and-lifecycle-01 section="top"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-01",
  "section": "top",
  "title": "安装、备份与文件核对",
  "links": [
   {
    "text": "回到项目 → Typora 薄荷主题",
    "href": "/projects/typora-theme-pack/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/typora-theme-pack"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/typora-theme-pack/#ai-brief"
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
     "text_ref": "安装、备份与文件核对",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 f30ac9c（9 月 29 日）核对，未重装或恢复。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → Typora 薄荷主题〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "更新主题时留下原先版本，避免影响自己安装的其他主题。",
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
     "text_ref": "安装、备份与文件核对",
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
     "static_note": "截至 10 月 11 日 · 源码按北京时间 14:00 前最后提交 f30ac9c（9 月 29 日）核对，未重装或恢复。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → Typora 薄荷主题〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "更新主题时留下原先版本，避免影响自己安装的其他主题。"
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
   "asset": "_library/illustrations/modules/typora-theme-pack-theme-installation-and-lifecycle-v01.png",
   "key": "typora-theme-pack-theme-installation-and-lifecycle-hero",
   "source_phrase": "模块专属首屏插画",
   "sha256": "3fbd7411b9bd8792d1841b2a556974836056a839ef6f6e566f101cb8e600ade5",
   "status": "ready"
  }
 ]
}
```

# 安装、备份与文件核对

〔回到项目 → Typora 薄荷主题〕　〔GitHub〕　〔复制 AI 续作说明〕

Typora Theme Pack · 功能说明

更新主题时留下原先版本，避免影响自己安装的其他主题。

**当前情况：**两份主题文件里，入口文件和源码一致，共享样式文件不一致（verify 结果为未通过），重新运行一次安装即可收敛；更新会保留旧文件，但恢复旧版仍需明确选择备份。

项目源码：公开仓库

::screen{#typora-theme-pack-theme-installation-and-lifecycle-02 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 整个 themes 目录可能还有其他主题，直接覆盖或清空很容易误伤；同名 Verdant 文件也可能有手工修改。 举个实际例子 把主题更新为当前版，但留下旧的 Verdant。脚本比较摘要，有"
   },
   {
    "id": "module-product",
    "text": "用途与实际影响 这项功能怎样使用 为什么需要它 整个 themes 目录可能还有其他主题，直接覆盖或清空很容易误伤；同名 Verdant 文件也可能有手工修改。 举个实际例子 把主题更新为当前版，但留下旧的 Verdant。脚本比较摘要，有"
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

整个 themes 目录可能还有其他主题，直接覆盖或清空很容易误伤；同名 Verdant 文件也可能有手工修改。

## 举个实际例子

把主题更新为当前版，但留下旧的 Verdant。脚本比较摘要，有差异就先复制到 old-themes，随后只更新两份专属 CSS。

## 最后我会得到什么

得到安装与核对报告，能找到旧文件备份；恢复旧版需要明确选择备份并恢复，脚本没有独立 restore 命令。

::screen{#typora-theme-pack-theme-installation-and-lifecycle-03 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-03",
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

两份本项目主题文件都与当前源版本一致。现在只有一份一致。

## 发现问题时

旧版本与当前版不同时先留备份，再逐份更新并核对；verify 报不一致就重跑 install。

## 入口不可用或证据不足时

找不到默认主题目录时请本人指定；目录不可写则说明原因，不清空其他主题。

::screen{#typora-theme-pack-theme-installation-and-lifecycle-04 section="usage"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-04",
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
     "text_ref": "运行 python tools/install_theme.py install，可用 --theme-dir 指定 Typora 主题目录；随后运行 python tools/install_theme.py verify 并在 Typora 切换检查。",
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
     "text_ref": "1. **比较原有文件**　只看本项目文件的摘要与差异，不覆盖无关主题。",
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
     "text_ref": "运行 python tools/install_theme.py install，可用 --theme-dir 指定 Typora 主题目录；随后运行 python tools/install_theme.py verify 并在 Typora 切换检查。"
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
     "text_ref": "1. **比较原有文件**　只看本项目文件的摘要与差异，不覆盖无关主题。",
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

运行 python tools/install_theme.py install，可用 --theme-dir 指定 Typora 主题目录；随后运行 python tools/install_theme.py verify 并在 Typora 切换检查。

## 需要准备什么

- 是否安装或核对 Verdant Mint

- 使用非默认主题目录时给出目标目录

## 从开始到拿到结果

1. **比较原有文件**　只看本项目文件的摘要与差异，不覆盖无关主题。

2. **备份再安装**　差异旧版先留备份，新文件再原子替换。

3. **核对安装与显示**　verify 查文件；Typora 中仍要手动选择和看页面，想撤回需用对应备份。

::screen{#typora-theme-pack-theme-installation-and-lifecycle-05 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 两文件安装摘要通过 关键规则与设计选择 1 默认目录来自 Windows APPDATA/Typora/themes，也接受明确 --theme-dir。 2 不触碰无"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据 这里保留实现、关键条件、精确入口、历史记录和验证结果。 两文件安装摘要通过 关键规则与设计选择 1 默认目录来自 Windows APPDATA/Typora/themes，也接受明确 --theme-dir。 2 不触碰无"
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
     "text_ref": "1. 默认目录来自 Windows APPDATA/Typora/themes，也接受明确 --theme-dir。",
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
     "text_ref": "1. 默认目录来自 Windows APPDATA/Typora/themes，也接受明确 --theme-dir。",
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

2026-10-11 verify：入口 CSS 一致、共享 CSS 不一致，verified=false；本次没有重装

## 关键规则与设计选择

1. 默认目录来自 Windows APPDATA/Typora/themes，也接受明确 --theme-dir。

2. 不触碰无关主题、程序、注册表或许可。

3. verify 只读；安装成功和当前选中主题分别判断。

## 当前怎样实现

- install_theme.py 只管 verdant-mint.css 和 verdant/base.css 两份文件，对每份算源码和安装摘要，不同则 backup_existing 到 old-themes 的对应子目录并使用时间戳后缀。现在还留着一份 2026-08-02 07:02 的共享样式备份，不是这次新增的。

- atomic_copy 先写同目录临时文件，copy2 后 os.replace；verify 返回 typora-theme-pack.install.v1 和逐文件 matches。脚本只有 install 和 verify 两个动作，没有 restore。

::screen{#typora-theme-pack-theme-installation-and-lifecycle-06 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-06",
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
     "text_ref": "- 导出菜单和项目路径绑定：项目搬家后要重跑 configure_typora_menu.py；菜单启动器每次按 PCConfig 登记读取 Python。开发配置备份仍登记了 Typora 的整个用户配置目录（含主题、旧主题备份和菜单配置）。",
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
     "text_ref": "- 导出菜单和项目路径绑定：项目搬家后要重跑 configure_typora_menu.py；菜单启动器每次按 PCConfig 登记读取 Python。开发配置备份仍登记了 Typora 的整个用户配置目录（含主题、旧主题备份和菜单配置）。",
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

- 导出菜单和项目路径绑定：项目搬家后要重跑 configure_typora_menu.py；菜单启动器每次按 PCConfig 登记读取 Python。开发配置备份仍登记了 Typora 的整个用户配置目录（含主题、旧主题备份和菜单配置）。

## 执行流程

1. 定位明确主题目录

2. 逐文件比对摘要

3. 差异旧版先备份

4. 原子替换本项目文件

5. verify 核对

::screen{#typora-theme-pack-theme-installation-and-lifecycle-07 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-07",
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
| 幂等安装 | 重复执行同一版本不会要求用户清空目录。 |

## 专业定义

只动自己的两份 CSS，替换前保留旧版

::screen{#typora-theme-pack-theme-installation-and-lifecycle-08 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-08",
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
     "text_ref": "- 默认目录为 Windows 路线；显式目录不等于完整跨平台产品验收。",
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
     "text_ref": "- 默认目录为 Windows 路线；显式目录不等于完整跨平台产品验收。",
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

每个文件原子替换，不代表两份文件是一次整体事务；中断后可再次运行安装与 verify 收敛。

## 边界

- 默认目录为 Windows 路线；显式目录不等于完整跨平台产品验收。

- 没有自动激活主题或专门回滚命令。

## 失败与恢复

- **写入中断或两文件不一致**：保留可用旧版/备份，按逐文件结果重跑收敛。

::screen{#typora-theme-pack-theme-installation-and-lifecycle-09 section="tech"}

```typeset
{
 "screen": {
  "id": "typora-theme-pack-theme-installation-and-lifecycle-09",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 PDF 导出",
    "href": "/projects/typora-theme-pack/transactional-pdf-export-pipeline/"
   },
   {
    "text": "下一个模块 视觉验证",
    "href": "/projects/typora-theme-pack/controlled-preview-and-visual-qa/"
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
     "text_ref": "- 精确安装与核对",
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
     "text_ref": "- 精确安装与核对",
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

- 精确安装与核对

## 如何验证

- 2026-10-11 16:31 只读 verify：入口 CSS 源码与已装 SHA-256 一致，共享 CSS 不一致，verified=false；当前主题配置指向 verdant-mint.css，这和 verify 结果是两件事。没有重装、恢复或清理备份。

- 隔离安装测试确认无关主题保留（历史）；该测试仍在源码里，2026-09-29 01:51 GitHub 自动测试日志显示它通过，这次没有运行。开发配置备份和新电脑恢复这次也没有执行。

## 与其他模块的关系

负责文件到位，编辑器负责选择并加载主题。
