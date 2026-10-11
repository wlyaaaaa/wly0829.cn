---
{
 "title": "本地模型各自验明身份，不组成自动备用链",
 "kind": "project",
 "url": "/projects/ai-cli-profile-manager/local-proxies/",
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
  "page": "ai-cli-profile-manager-local-proxies",
  "kind": "project",
  "title": "本地模型各自验明身份，不组成自动备用链",
  "url": "/projects/ai-cli-profile-manager/local-proxies/",
  "parent": "ai-cli-profile-manager",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "父项目总览状态“常用”；本地模型部分按 10 月 11 日 14:00 前的源码（10 月 8 日提交）和当天只读 Ollama 查询核对，两个 ChatGPT→Claude 代理 9 月 29 日退役、Toolkit 接线 9 月 28 日退役，未发生成请求"
  }
 },
 "source": {
  "page": "sources/pages/ai-cli-profile-manager-local-proxies/page.json",
  "sha256": "f2eb6f6a907b790892f3712bde98a25466a35736106a55bef5c6a0becb7b5131",
  "converted_at_beijing": "2026-10-11T18:50:42+08:00"
 }
}
---

::screen{#ai-cli-profile-manager-local-proxies-01 section="top"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-01",
  "section": "top",
  "title": "本地模型各自验明身份，不组成自动备用链",
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
     "text_ref": "本地模型各自验明身份，不组成自动备用链",
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
     "static_note": "截至 10 月 11 日 · 父项目总览状态“常用”；本地模型部分按 10 月 11 日 14:00 前的源码（10 月 8 日提交）和当天只读 Ollama 查询核对，两个 ChatGPT→Claude 代理 9 月 29 日退役、Toolkit 接线 9 月 28 日退役，未发生成请求",
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
     "text_ref": "本地27B、35B及两种去限制版都有明确入口，不把“本地模型”混成一件事。它们通过既有显卡协调器工作；任何一个失败都不会自动改投另一个模型，更不会改走付费云端。原来并列在这里的两个 ChatGPT 到 Claude 代理已于 9 月 29 日退役。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**4 个受管本地模型仍在，Codex 桌面版、OpenCode 和 Ollama 由一份统一配置同步；两个代理和 Toolkit 接线都已退役，相关入口已删除。配置写好、模型已下载，不等于这次真的跑通，真实调用要另看日期。",
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
     "text_ref": "本地模型各自验明身份，不组成自动备用链",
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
     "static_note": "截至 10 月 11 日 · 父项目总览状态“常用”；本地模型部分按 10 月 11 日 14:00 前的源码（10 月 8 日提交）和当天只读 Ollama 查询核对，两个 ChatGPT→Claude 代理 9 月 29 日退役、Toolkit 接线 9 月 28 日退役，未发生成请求"
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
     "text_ref": "本地27B、35B及两种去限制版都有明确入口，不把“本地模型”混成一件事。它们通过既有显卡协调器工作；任何一个失败都不会自动改投另一个模型，更不会改走付费云端。原来并列在这里的两个 ChatGPT 到 Claude 代理已于 9 月 29 日退役。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**4 个受管本地模型仍在，Codex 桌面版、OpenCode 和 Ollama 由一份统一配置同步；两个代理和 Toolkit 接线都已退役，相关入口已删除。配置写好、模型已下载，不等于这次真的跑通，真实调用要另看日期。"
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
   "asset": "_library/illustrations/modules/ai-cli-profile-manager/local-proxies/local-proxies-v02.png",
   "key": "main-ai-cli-profile-manager",
   "source_phrase": "右上一幅水彩插画：一台显示器上开着一个终端窗口和一个 Codex 桌面版窗口，桌面版窗口里展开一个模型下拉菜单，菜单每一行是一个品牌小标志加一条浅灰短线（依次画 OpenAI、智谱 GLM、DeepSeek 小鲸鱼、通义千问、Ollama 小羊驼的标志，短线处不写字）；显示器旁边一个小保险箱，伸出一把绿色小钥匙，只连向其中一个窗口；机箱侧面的显卡亮着绿光。",
   "sha256": "a2bfddf073702fde45c576f0fb3802f9f03504ed6daebdabc14bd78140dfa1e8",
   "status": "ready"
  }
 ]
}
```

# 本地模型各自验明身份，不组成自动备用链

〔回到项目 → AI 工具配置管理〕　〔GitHub〕　〔复制 AI 续作说明〕

AI CLI Profile Manager · 功能说明

本地27B、35B及两种去限制版都有明确入口，不把“本地模型”混成一件事。它们通过既有显卡协调器工作；任何一个失败都不会自动改投另一个模型，更不会改走付费云端。原来并列在这里的两个 ChatGPT 到 Claude 代理已于 9 月 29 日退役。

**当前情况：**4 个受管本地模型仍在，Codex 桌面版、OpenCode 和 Ollama 由一份统一配置同步；两个代理和 Toolkit 接线都已退役，相关入口已删除。配置写好、模型已下载，不等于这次真的跑通，真实调用要另看日期。

内容按 2026-10-11 14:00（北京时间）前的改动整理，源码对应 10 月 8 日 09:55 的提交；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#ai-cli-profile-manager-local-proxies-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 “本地”不等于一定在线，“已下载”也不等于模型和显卡此刻都就绪。自动把失败请求送到另一条路线还会改变费用、隐私和结果身份。 ## 举个实际例子 我可以说：“这次只用普通本地27B，"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 “本地”不等于一定在线，“已下载”也不等于模型和显卡此刻都就绪。自动把失败请求送到另一条路线还会改变费用、隐私和结果身份。 ## 举个实际例子 我可以说：“这次只用普通本地27B，"
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

“本地”不等于一定在线，“已下载”也不等于模型和显卡此刻都就绪。自动把失败请求送到另一条路线还会改变费用、隐私和结果身份。

## 举个实际例子

我可以说：“这次只用普通本地27B，不换去限制版，也不传云端。先看当前模型与显卡是否就绪；不可用就告诉我原因。”我得到对应入口的状态，而不是把通用Ollama端口离线误报成全部本地模型都不能用。

## 最后我会得到什么

分别知道选中的本地模型是否已安装、受管服务是否在本机运行、显卡是否正被别的任务占着；只有这一条身份成立才尝试真实调用。

## 正常时

选中服务和真实模型身份都对应时，标这条路线可进一步使用。

## 发现问题时

模型没开或显卡忙时只说明这一条的限制；显卡被听写或文字识别占着时，请求最多排队等 90 秒并提示正在等。

## 入口不可用或证据不足时

模型身份对不上、服务不在本机地址或程序不明时拒绝，不结束未知程序，也不换另一个模型顶上。

## 结果怎么看

## 正常时

选中服务和真实模型身份都对应时，标这条路线可进一步使用。

## 发现问题时

模型没开、显卡忙或代理旧了时只说明这一条的限制。

## 入口不可用或证据不足时

程序不明、监听跑到非本机地址或端口已被别人占用时拒绝，不结束未知程序。

::screen{#ai-cli-profile-manager-local-proxies-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-03",
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
     "text_ref": "在 aicli profile show/native 选择点名的本地模型，先用 Doctor 核对当前安装和服务。",
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
     "text_ref": "1. **核对选中入口而不自动换路**　系统确认这次用的是哪一个本地模型，检查它的服务身份和本机地址，不把失败送往另一家。",
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
     "text_ref": "在 aicli profile show/native 选择点名的本地模型，先用 Doctor 核对当前安装和服务。"
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
     "text_ref": "1. **核对选中入口而不自动换路**　系统确认这次用的是哪一个本地模型，检查它的服务身份和本机地址，不把失败送往另一家。",
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

在 aicli profile show/native 选择点名的本地模型，先用 Doctor 核对当前安装和服务。

## 需要准备什么

- 明确的本地模型 Profile

- 本地显卡状态

- 是否只允许本地数据

## 从开始到拿到结果

1. **核对选中入口而不自动换路**　系统确认这次用的是哪一个本地模型，检查它的服务身份和本机地址，不把失败送往另一家。

2. **核对服务身份**　检查模型标签是否真的装了、受管服务是否只在本机回环地址上监听、显卡此刻是否可用。

3. **按选定路线运行**　交回模型结果或精确不可用原因；本地入口失败不会自行切到付费或其他数据去向。

::screen{#ai-cli-profile-manager-local-proxies-04 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 受管四模型与桌面入口已建立；两个 ChatGPT→Claude 代理 9 月 29 日退役，Toolkit 接线 9 月 28 日退役；通用 11434 端"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 受管四模型与桌面入口已建立；两个 ChatGPT→Claude 代理 9 月 29 日退役，Toolkit 接线 9 月 28 日退役；通用 11434 端"
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
     "text_ref": "1. Qwen Code 与 OpenCode 当前主要是本地 machine-only 路线。",
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
     "text_ref": "1. Qwen Code 与 OpenCode 当前主要是本地 machine-only 路线。",
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

受管四模型与桌面入口已建立；两个 ChatGPT→Claude 代理 9 月 29 日退役，Toolkit 接线 9 月 28 日退役；通用 11434 端点另看日期

## 关键规则与设计选择

1. Qwen Code 与 OpenCode 当前主要是本地 machine-only 路线。

2. 已退役：ccp 和 cliproxy 两个第三方代理原本让 Claude Code 借 ChatGPT 登录使用，9 月 29 日连同路线、下载批准清单、端口分配、登录与停止入口和相关测试一起删除，现在没有替代的 ChatGPT 接入；Claude Code 可用官方、本机 Qwen 和自定义端点。删除源码不等于旧的本机登录文件已清理或远端授权已撤销，这两件事没有核实。

3. 已退役：本地模型配置原来还同步给 Toolkit，9 月 28 日删除了这条同步和跨仓库检查；现在统一配置只同步给 AICLI 自己、Codex 桌面版、OpenCode 和 Ollama。

## 当前怎样实现

- LocalGpuBrokerSession 消费既有 broker（调度服务） 的 lease/capability，证明请求命中 exact 本地模型；它不拥有 GPU 调度服务，受管端点 127.0.0.1:32100 和 GPU 服务归电脑配置（PCConfig）管理。

- OpenCode 使用一次性 pure 配置，主入口和 27B 兼容入口都保留 262144 context/input、32768 输出、reserve 20000、最近 16384 与 4 轮的边界。

- data/local-model-set.json 拥有四个受管 Profile，客户端映射现在只剩 OpenCode；当前模型标签为 qwen3.8-27b:256k、qwen3.6-35b:256k、qwen3.6-35b-abliterated:256k、qwen3.8-27b-abliterated:256k。设置先预览、明确应用后同步 AICLI、Codex 桌面版、OpenCode 和 Ollama，不创建另一份模型目录。

- 普通27B和去限制27B、普通35B采用num_batch=128；35B去限制版保留512。num_ctx=262144，draft_num_predict=0避免已复现的草稿预测崩溃，不替换原始模型权重。普通27B的256K镜像manifest（清单） SHA-256为8040835723046ec2631b64b960d44414636ea5147942a7d68eaaa7ccdb492e20，Q4_K_M，temperature=1、top_p=.95、top_k=20、min_p=0、presence_penalty=0、repeat_penalty=1。输出上限有两层：AICLI 配置里普通 35B 声明 8192、其余三个声明 32768；Ollama 的 35B 标签参数另写 num_predict=32768。实际由哪一层截断没有测过。

- 听写或文字识别占着显卡时，本地模型请求最多排队 90 秒并提示在等，不直接报错；但“听写与 AICLI 并发交接显卡”在电脑配置的待验收清单里仍是暂缓状态，还不能说真实并发交接已验收。

::screen{#ai-cli-profile-manager-local-proxies-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-05",
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
     "text_ref": "- 两个代理退役后，原来的批准版本清单（ccp 0.1.15、cliproxy 7.2.72）、首选端口 43197/43198 与 43192–43209 候选池、ProxyService 和 PortAllocator 都已删除，只作为历史技术记录，不再是现役配置。",
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
     "text_ref": "- 两个代理退役后，原来的批准版本清单（ccp 0.1.15、cliproxy 7.2.72）、首选端口 43197/43198 与 43192–43209 候选池、ProxyService 和 PortAllocator 都已删除，只作为历史技术记录，不再是现役配置。",
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

- 两个代理退役后，原来的批准版本清单（ccp 0.1.15、cliproxy 7.2.72）、首选端口 43197/43198 与 43192–43209 候选池、ProxyService 和 PortAllocator 都已删除，只作为历史技术记录，不再是现役配置。

## 执行流程

1. 选择一个本地模型。

2. 核对模型标签已安装、与受管集合一致。

3. 确认受管端点只在本机回环地址监听。

4. 显卡被占时排队等待，最多 90 秒并提示。

5. 启动并核对实际模型身份与响应。

6. 结束时只清理自己启动的进程；改模型设置时先预览，再明确应用和同步。

::screen{#ai-cli-profile-manager-local-proxies-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-06",
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
| loopback（本机回环） | 只允许本机访问的 127.0.0.1 地址；0.0.0.0、局域网与公网监听都不接受。 |
| LocalGpuBroker（本地显卡协调器） | 外部既有运行时，负责本地模型端点与资源租约；AICLI 只作为消费者。 |
| 受管模型集合 | data/local-model-set.json 里登记的 4 个本地模型及各客户端的对应关系；增删换型都改这一份，再同步出去，不另建模型目录。 |

## 专业定义

每个本地模型都是一条可选路线；任何一个离线都不会让 aicli 偷偷换到另一个。

解决什么

防止把“模型已下载”或旧的检查结果当成现在能用，防止本地失败时悄悄改走付费云端，也防止 AICLI 为抢资源结束别人的服务。

::screen{#ai-cli-profile-manager-local-proxies-07 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-07",
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

防止把安装文件、端口或旧 OAuth（账号授权协议） 当成当前可用，也防止 AICLI 为抢端口结束别人的服务。

## 边界

- 10 月 11 日的整理不启动 Ollama 或 GPU 模型，也不发生成请求。

- 不自动拉取新模型或新版 Ollama，不因上游出现新标签就扩大受管集合。

- 两个已退役代理留下的本机登录文件与远端授权要各自在本机和账号那边确认，退役本身不代表已经清理或撤销。

## 失败与恢复

- **默认 Ollama 11434 不可达**：当前公共默认路线有限制；不改投 32100 或云端，除非用户选择对应 exact Profile。这是 9 月 14 日的观察，不作为今天全部本地模型离线的结论。

- **显卡正被听写或文字识别占用**：请求最多等 90 秒并提示在等；仍不可用就说明原因，不改投云端或别的模型。

- **路线要的模型标签本机没装**：例如通用模板要的 qwen3:8b、qwen3-coder:30b 当前都没装，这些路线标为用不了，不拿已装的受管模型顶替。

::screen{#ai-cli-profile-manager-local-proxies-08 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-local-proxies-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 可恢复机器运行",
    "href": "/projects/ai-cli-profile-manager/recoverable-runs/"
   },
   {
    "text": "下一个模块 安装、退役与恢复",
    "href": "/projects/ai-cli-profile-manager/install-recovery/"
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
     "text_ref": "- `src/AiCliProfileManager/Private/LocalGpuBrokerSession.ps1`：本地模型身份与租约消费",
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
     "text_ref": "- `src/AiCliProfileManager/Private/LocalGpuBrokerSession.ps1`：本地模型身份与租约消费",
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

- `src/AiCliProfileManager/Private/LocalGpuBrokerSession.ps1`：本地模型身份与租约消费

- `data/local-model-set.json`：四个受管模型与客户端映射

- `scripts/Sync-LocalModelConfiguration.ps1`：先预览、再应用的统一同步

- `docs/user/本地模型统一配置.md`：本地模型参数、同步与历史实测记录

## 如何验证

- 9 月 29 日删除两个代理后的全量离线测试为 470/470、0 失败、0 跳过，本地模型集合、同步和受管身份都在其中；10 月 11 日未重跑。

- 9 月 14 日的 Doctor 读到 Ollama 默认端点不可达，保留为当天记录；10 月 11 日只读查询 Ollama 为 0.35.0，4 个受管标签都在，没有发生成请求，也没有调用 GPU。

- 9 月 16 日旧环境实测 35B 由每秒 62–69 个 token 提到 170–171 个，按当天记录保留，没有重跑性能。

## 与其他模块的关系

本模块提供可选运行目标；引擎模块定义 Profile，验证模块决定该目标在当前是否真正可用。
