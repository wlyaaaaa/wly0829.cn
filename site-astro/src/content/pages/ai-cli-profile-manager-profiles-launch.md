---
{
 "title": "先看清这次要启动谁，再打开原生 CLI（命令行工具）",
 "kind": "project",
 "url": "/projects/ai-cli-profile-manager/profiles-launch/",
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
  "page": "ai-cli-profile-manager-profiles-launch",
  "kind": "project",
  "title": "先看清这次要启动谁，再打开原生 CLI（命令行工具）",
  "url": "/projects/ai-cli-profile-manager/profiles-launch/",
  "parent": "ai-cli-profile-manager",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "父项目总览状态“常用”；事实按 10 月 11 日 14:00 前的源码（10 月 8 日提交）和 9 月 28 日厂商凭据改动核对，configure 引用、删除和 eject 导出几处按 10 月 30 日 11:15 前读到的 10 月 28 日提交改写；最近一次全量离线测试为 9 月 29 日，本次未重跑。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
  }
 },
 "source": {
  "page": "sources/pages/ai-cli-profile-manager-profiles-launch/page.json",
  "sha256": "49db0fed22fd58ad2a35238e1a806e8cd00d50edfe1abc53ca2013c9fb5b41ad",
  "converted_at_beijing": "2026-10-30T15:12:30+08:00"
 }
}
---

::screen{#ai-cli-profile-manager-profiles-launch-01 section="top"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-01",
  "section": "top",
  "title": "先看清这次要启动谁，再打开原生 CLI（命令行工具）",
  "links": [
   {
    "text": "回到项目 → AI 工具配置管理",
    "href": "/projects/ai-cli-profile-manager/"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/ai-cli-profile-manager"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/ai-cli-profile-manager/#ai-brief"
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
     "text_ref": "先看清这次要启动谁，再打开原生 CLI（命令行工具）",
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
     "static_note": "截至 10 月 11 日 · 父项目总览状态“常用”；事实按 10 月 11 日 14:00 前的源码（10 月 8 日提交）和 9 月 28 日厂商凭据改动核对，configure 引用、删除和 eject 导出几处按 10 月 30 日 11:15 前读到的 10 月 28 日提交改写；最近一次全量离线测试为 9 月 29 日，本次未重跑。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 工具配置管理〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "把“这次开哪个 AI 编程工具、用哪个模型、请求去哪里”保存成能预览的配置档。确认后启动原来的工具；必要时可删除配置或导出不含密码的启动说明。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有选择配置、查看启动计划并打开原生程序的功能，具体模型任务仍按实际运行确认；三家厂商的配置档只保存密码中心里的钥匙引用，不再录 Key。想在同一家换型号要另存一个配置档，启动时直接加 --model 目前仍会被拒绝。",
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
     "text_ref": "先看清这次要启动谁，再打开原生 CLI（命令行工具）",
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
     "static_note": "截至 10 月 11 日 · 父项目总览状态“常用”；事实按 10 月 11 日 14:00 前的源码（10 月 8 日提交）和 9 月 28 日厂商凭据改动核对，configure 引用、删除和 eject 导出几处按 10 月 30 日 11:15 前读到的 10 月 28 日提交改写；最近一次全量离线测试为 9 月 29 日，本次未重跑。使用档沿用既有类别，本轮分类依据 Unknown；其余事实按各自注明日期。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → AI 工具配置管理〕　〔GitHub〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "把“这次开哪个 AI 编程工具、用哪个模型、请求去哪里”保存成能预览的配置档。确认后启动原来的工具；必要时可删除配置或导出不含密码的启动说明。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**已有选择配置、查看启动计划并打开原生程序的功能，具体模型任务仍按实际运行确认；三家厂商的配置档只保存密码中心里的钥匙引用，不再录 Key。想在同一家换型号要另存一个配置档，启动时直接加 --model 目前仍会被拒绝。"
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
   "asset": "_library/illustrations/modules/ai-cli-profile-manager/profiles-launch/profiles-launch-v02.png",
   "key": "main-ai-cli-profile-manager",
   "source_phrase": "右上一幅水彩插画：一台显示器上开着一个终端窗口和一个 Codex 桌面版窗口，桌面版窗口里展开一个模型下拉菜单，菜单每一行是一个品牌小标志加一条浅灰短线（依次画 OpenAI、智谱 GLM、DeepSeek 小鲸鱼、通义千问、Ollama 小羊驼的标志，短线处不写字）；显示器旁边一个小保险箱，伸出一把绿色小钥匙，只连向其中一个窗口；机箱侧面的显卡亮着绿光。",
   "sha256": "fe4d8816ac97da49532e843c7d964ed9e717ebbcdc1c961de0b2fb1e609a323f",
   "status": "ready"
  }
 ]
}
```

# 先看清这次要启动谁，再打开原生 CLI（命令行工具）

〔回到项目 → AI 工具配置管理〕　〔GitHub〕　〔复制 AI 续作说明〕

AI CLI Profile Manager · 功能说明

把“这次开哪个 AI 编程工具、用哪个模型、请求去哪里”保存成能预览的配置档。确认后启动原来的工具；必要时可删除配置或导出不含密码的启动说明。一起导出的本机原有配置按原样复制，可能本来就含秘密。

**当前情况：**已有选择配置、查看启动计划并打开原生程序的功能，具体模型任务仍按实际运行确认；三家厂商的配置档只保存密码中心里的钥匙引用，不再录 Key。想在同一家换型号要另存一个配置档，启动时直接加 --model 目前仍会被拒绝。10 月 28 日起其他需要 Key 的厂商也一样只存引用，须先在密码中心登记。导出时生成的启动脚本不含钥匙，但本机已有的原生配置会按原样复制过去，那部分可能本来就含秘密。

内容按 2026-10-11 14:00（北京时间）前的改动整理，源码对应 10 月 8 日 09:55 的提交；配置引用和导出几处按 10 月 30 日读到的 10 月 28 日 11:54 提交改写；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#ai-cli-profile-manager-profiles-launch-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 电脑上多个 AI 编程工具和模型服务可能互相串线，官方登录也可能被旧设置送到第三方。启动前先看清要开哪个程序、模型和请求去向，选择只影响这次新进程。 ## 举个实际例子 “这个项目"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 电脑上多个 AI 编程工具和模型服务可能互相串线，官方登录也可能被旧设置送到第三方。启动前先看清要开哪个程序、模型和请求去向，选择只影响这次新进程。 ## 举个实际例子 “这个项目"
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

电脑上多个 AI 编程工具和模型服务可能互相串线，官方登录也可能被旧设置送到第三方。启动前先看清要开哪个程序、模型和请求去向，选择只影响这次新进程。

## 举个实际例子

“这个项目继续用我已经选好的配置，不要改我的全局默认；先让我知道会启动哪个程序、请求去哪里。”先预览实际入口，再启动相同配置。进入原生程序后，权限与任务行为仍由它自己的真实能力决定。

## 最后我会得到什么

拿到清楚的启动预览，确认后在指定项目打开原来的 AI 编程工具；也可以导出不含密钥的独立启动说明。本工具不接管原工具的聊天历史。

## 结果怎么看

## 正常时

项目目录和配置档有效，启动计划显示的程序与实际启动一致。

## 发现问题时

旧环境可能把官方请求改送别处时，体检会指出冲突，不偷偷改原配置。

## 入口不可用或证据不足时

配置档损坏、目录不存在或参数要偷换模型时拒绝启动，不猜替代路线。

::screen{#ai-cli-profile-manager-profiles-launch-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-03",
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
     "text_ref": "在可信项目目录打开 PowerShell，先运行 aicli profile list/show，再用 aicli native 预览、aicli start 启动。",
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
     "text_ref": "1. **把配置档展开为真实程序**　工具显示这次会启动 Codex、Claude 等哪一个原生程序、选哪个模型、请求送到哪里。Qwen、GLM、DeepSeek 的配置档只记“用密码中心里哪一家的钥匙”，配置时不会问我要 Key。",
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
     "text_ref": "在可信项目目录打开 PowerShell，先运行 aicli profile list/show，再用 aicli native 预览、aicli start 启动。"
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
     "text_ref": "1. **把配置档展开为真实程序**　工具显示这次会启动 Codex、Claude 等哪一个原生程序、选哪个模型、请求送到哪里。Qwen、GLM、DeepSeek 的配置档只记“用密码中心里哪一家的钥匙”，配置时不会问我要 Key。",
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

在可信项目目录打开 PowerShell，先运行 aicli profile list/show，再用 aicli native 预览、aicli start 启动。

## 需要准备什么

- 项目目录

- 要用的引擎和 Profile

- 模型与数据去向偏好

## 从开始到拿到结果

1. **把配置档展开为真实程序**　工具显示这次会启动 Codex、Claude 等哪一个原生程序、选哪个模型、请求送到哪里。Qwen、GLM、DeepSeek 的配置档只记“用密码中心里哪一家的钥匙”，配置时不会问我要 Key。

2. **看清启动计划**　native 展示真正要启动的程序和环境差异，避免官方登录误走第三方。同一家想换型号，就另存一个自定义配置档（例如在 configure 里给新 ID 指定 --model），钥匙沿用原来那把。

3. **进入原生工具**　aicli start 在当前项目启动原来的 AI 编程工具；启动时在参数里直接带 --model 或 -m 换型号，目前仍会在启动前被拒绝。若配置有问题，先查看启动预览或运行静态体检（Doctor）。

::screen{#ai-cli-profile-manager-profiles-launch-04 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 命令、Profile 与启动计划已实现；最近一次全量离线测试为 9 月 29 日 470/470，10 月 11 日未重跑 ## 关键规则与设计选择 1. "
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 命令、Profile 与启动计划已实现；最近一次全量离线测试为 9 月 29 日 470/470，10 月 11 日未重跑 ## 关键规则与设计选择 1. "
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
     "text_ref": "1. 切换 Profile 只对新进程生效，不能在已经打开的会话中热换 Provider。同一家换型号走“另存自定义配置档”；启动参数里的 --model/-m 仍被上层拦下，见下方失败与恢复。",
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
     "text_ref": "1. 切换 Profile 只对新进程生效，不能在已经打开的会话中热换 Provider。同一家换型号走“另存自定义配置档”；启动参数里的 --model/-m 仍被上层拦下，见下方失败与恢复。",
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

命令、Profile 与启动计划已实现；最近一次全量离线测试为 9 月 29 日 470/470，10 月 11 日和 10 月 28 日改动后都未重跑

## 关键规则与设计选择

1. 切换 Profile 只对新进程生效，不能在已经打开的会话中热换 Provider。同一家换型号走“另存自定义配置档”；启动参数里的 --model/-m 仍被上层拦下，见下方失败与恢复。

2. profile remove 默认确认。需要 Key 的配置档只保存密码中心引用，删除它不会删除密码中心里的厂商钥匙；10 月 28 日起删除配置档也不再顺手删除旧本机 DPAPI 密文，旧密文留给迁移验收后另行清理。两种情况都不会删除上游官方登录。

3. 原来的 OpenClaw 导入入口已经退役、脚本从源码删除，现在没有这条导入路。新配置直接用 configure 保存厂商引用即可，DeepSeek 也一样引用密码中心里的厂商钥匙。

4. machine-only 的 Qwen Code / OpenCode 路线不提供交互式 start。

5. eject 生成的启动脚本不嵌入 Key 或 OAuth（账号授权协议），只保留密码中心引用或运行前再输入；但本机已有的原生配置按原始字节复制，原文里有什么，副本里就有什么，所以导出目录不能当作必然无秘密。它给的是理解和迁移入口，不是秘密备份。

## 当前怎样实现

- CommandRouter.ps1 严格解析命令、值选项和双横线后的原生参数。

- ProfileService 实现 list/show/configure/set-default/remove。所有需要 Key 的配置档都保存 passwordcenter:厂商名 引用（如 passwordcenter:qwen），厂商必须已在密码中心登记并写明官方接口主机，没登记就停下并用中文提示先登记；configure 不询问、不录入也不复制 Key，不再为任何路线写本机密文。用自定义 ID 加 --model 可保存或合并一个独立型号（modelOverride），已有的预设 ID 不会被改绑，没见过的型号也不沿用旧型号的上下文大小和目录信息。损坏对象不会回退到同名模板。

- Import-FromOpenClaw.ps1 已退役：源码变更记录（尚未正式发行的“未发布/移除”段落）写明删除，10 月 22 日 scripts 目录里已没有这个文件。它以前读取一个明确 JSON 并验证来源，默认预览，-Apply 只导入 codex-deepseek-flash，并会留下一份旧式 DPAPI 副本；那份副本若还在，也不是现在取钥匙的来源。更早的 Codex Flash/Pro、Claude、OI 四目标导入在它之前就已被替代。

::screen{#ai-cli-profile-manager-profiles-launch-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-05",
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
     "text_ref": "- OpenClaw 导入只接受能由 api.deepseek.com 主机名证明的 DeepSeek 来源；Qwen3.7、未知或 OpenAI Base URL 被拒绝。",
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
     "text_ref": "- OpenClaw 导入只接受能由 api.deepseek.com 主机名证明的 DeepSeek 来源；Qwen3.7、未知或 OpenAI Base URL 被拒绝。",
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

- OpenClaw 导入只接受能由 api.deepseek.com 主机名证明的 DeepSeek 来源；Qwen3.7、未知或 OpenAI Base URL 被拒绝。这个导入入口现已退役、脚本已从源码删除，这里只记它当年的规则。

- LaunchPlan.ps1 使用 ProcessStartInfo.ArgumentList 形态组织可执行文件、参数、工作目录和环境差异；native 只遮真实秘密，普通接口地址和工作区 ID 原样显示。eject 拒绝覆盖已有目录，产物分两类：生成的 start.ps1 等启动脚本不嵌秘密，运行时向密码中心取值，其他凭据要在运行前自己设好；本机已有的原生配置文件按原始字节复制，不改写也不过滤。生成计划前先检查型号锁：三家云端厂商的配置清单都标为“型号固定”，所以原生参数里的 --model/-m 在这里被拒绝；下层 Codex 适配器其实已能处理同一家的显式型号，但公共入口还没放开。

## 执行流程

1. 运行 setup 或 profile list --available。

2. 用 configure 配置要用的路线：需要 Key 的路线只选厂商引用，不录 Key；厂商没在密码中心登记时先去登记。以前用本机密文存过的配置档，用 Invoke-AiCliSecretMigration 先预览再迁成引用。

3. 用 profile show 核对引擎、模型、数据去向和状态，并按需运行 profile set-default；要换同一家的型号，就另存一个自定义 ID 的配置档。

4. 用 native 查看本次启动计划。

5. 用 start 在可信项目目录启动原生 CLI（命令行工具），或用 eject 导出；导出目录里复制来的原配置要按可能含秘密的文件保管。

6. 不再需要某个用户 Profile 时运行 profile remove，确认会保留或删除什么；密码中心里的厂商钥匙不随之删除。

::screen{#ai-cli-profile-manager-profiles-launch-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-06",
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
| LaunchPlan（启动计划） | 本次进程的可执行文件、参数、工作目录和环境增删；不是永久全局配置。 |
| OpenClaw preview/apply（导入预览/应用） | 已退役的旧入口：当年先只显示将生成哪些 DeepSeek Profile，显式 -Apply 后才写入；不会导入 Qwen3.7。 |
| native（原生计划查看） | 展示 aicli 最终要怎样启动上游，但不执行模型请求。 |
| eject（导出脱离） | 生成不嵌秘密的启动脚本，并把本机已有的原生配置按原样复制一份，让用户不依赖 aicli 也能重建入口；复制件可能含原配置里的秘密。 |

## 专业定义

Profile 保存选择，LaunchPlan 只服务本次进程；聊天仍在原生工具里。

::screen{#ai-cli-profile-manager-profiles-launch-07 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-07",
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
     "text_ref": "出问题时",
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

## 出问题时

解决什么

防止官方登录与第三方 API 串线，也让用户在使用前能回答“到底会启动什么、数据去哪”。

## 边界

- 不提供自己的聊天 UI 或会话数据库。

- 不覆盖上游基础 config.toml、settings.json 或官方登录。

- OpenClaw 导入不读取任意 Provider；默认预览不写入，同名 Profile 不带 -Force 不替换。

- 不把 machine-only Profile 伪装成交互式入口。

## 失败与恢复

- **用户 Profile JSON 损坏或根节点不是对象**：当前 main 失败关闭并返回不可用；不静默使用同名内置模板。

- **OpenClaw 来源不是 api.deepseek.com、结构未知或是 Qwen3.7**：拒绝导入，不把一个服务的 Key 发给另一个 host，也不生成假 Profile。

- **原生参数覆盖 Provider、模型或配置**：在启动前拒绝，并保留 Profile 的精确身份。三家厂商路线带 --model/-m 同样被拒；要换型号请另存自定义配置档。手册里“启动时显式传 --model”的写法与当前公共入口不一致，以实际拒绝为准。

- **eject 目标已有内容**：拒绝覆盖，要求选择一个新目录。

::screen{#ai-cli-profile-manager-profiles-launch-08 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-profiles-launch-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "下一个模块 模型引擎与服务方",
    "href": "/projects/ai-cli-profile-manager/engines-providers/"
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
     "text_ref": "- `src/AiCliProfileManager/Private/CommandRouter.ps1`：命令解析与退出码",
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
     "text_ref": "- `src/AiCliProfileManager/Private/CommandRouter.ps1`：命令解析与退出码",
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

- `src/AiCliProfileManager/Private/CommandRouter.ps1`：命令解析与退出码

- `src/AiCliProfileManager/Private/ProfileService.ps1`：用户 Profile、厂商引用、SecretRef 与删除生命周期

- `scripts/Import-FromOpenClaw.ps1`：已退役并从源码删除，只作为 DeepSeek 旧配置导入的历史记录

- `src/AiCliProfileManager/Private/LaunchPlan.ps1`：计划、型号锁、native 与 eject

## 如何验证

- 9 月 3 日 385 项 Pester 覆盖当时的命令解析、Profile 生命周期、参数和导出；9 月 17 日又完成 442 项源码回归；9 月 29 日退役两个代理后的全量离线测试为 470/470、0 失败、0 跳过。三次都按当天记录保存，10 月 11 日没有重跑。10 月 28 日改了配置引用和导出方式，那次提交说明里的历史回归有 2 项失败，之后也没有本轮重跑的全量结果，不能算全绿。

- 离线发行检查实际执行 version、list/show、native、eject 和错误退出码；自定义型号配置档的保存和默认启动计划只在源码与离线层面成立，还没有用真实账号调用新型号。按原字节复制的新导出方式只有源码依据，本轮没有实际导出核对。

- 10 月 11 日和 10 月 30 日的整理都没有用 start 打开交互会话，也没有对真实私有配置执行导入或导出。

## 与其他模块的关系

本模块决定怎样进入原生工具；引擎模块定义可选身份，秘密模块定义凭据怎样到达目标进程。
