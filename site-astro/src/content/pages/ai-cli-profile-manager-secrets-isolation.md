---
{
 "title": "配置可以复用，明文秘密只在目标进程需要时出现",
 "kind": "project",
 "url": "/projects/ai-cli-profile-manager/secrets-isolation/",
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
  "page": "ai-cli-profile-manager-secrets-isolation",
  "kind": "project",
  "title": "配置可以复用，明文秘密只在目标进程需要时出现",
  "url": "/projects/ai-cli-profile-manager/secrets-isolation/",
  "parent": "ai-cli-profile-manager",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "父项目总览状态“常用”；事实按 10 月 11 日 14:00 前的源码（10 月 8 日提交）、9 月 28 日厂商凭据改动和 9 月 29 日代理退役记录核对；密钥统一引用密码中心、旧密文迁移和导出边界按 10 月 30 日 11:15 前读到的 10 月 28 日提交与已安装文件改写。本次没有读取任何钥匙、没有发真实请求"
  }
 },
 "source": {
  "page": "sources/pages/ai-cli-profile-manager-secrets-isolation/page.json",
  "sha256": "05cd9547a123c3d48b7799427183bfdeca1bce54649de1a898319fba0fe1ab43",
  "converted_at_beijing": "2026-10-30T13:04:15+08:00"
 }
}
---

::screen{#ai-cli-profile-manager-secrets-isolation-01 section="top"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-01",
  "section": "top",
  "title": "配置可以复用，明文秘密只在目标进程需要时出现",
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
     "text_ref": "配置可以复用，明文秘密只在目标进程需要时出现",
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
     "static_note": "截至 10 月 11 日 · 父项目总览状态“常用”；事实按 10 月 11 日 14:00 前的源码（10 月 8 日提交）、9 月 28 日厂商凭据改动和 9 月 29 日代理退役记录核对；密钥统一引用密码中心、旧密文迁移和导出边界按 10 月 30 日 11:15 前读到的 10 月 28 日提交与已安装文件改写。本次没有读取任何钥匙、没有发真实请求",
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
     "text_ref": "Qwen、GLM、DeepSeek 三家的钥匙各一把，统一放在我的密码中心；配置档只记“用哪一家的钥匙”，启动选中的程序时才把值交给它。聊天、启动预览和其他终端都不出现明文。",
     "row": "top"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**9 月 28 日起三家厂商改为从密码中心按需取钥匙，配置时不再录入 Key；配置档显示“引用已配置，密钥未验证”，钥匙本身能不能用要靠真实请求判断。其他需要密钥的路线仍用本机加密保存。",
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
     "text_ref": "配置可以复用，明文秘密只在目标进程需要时出现",
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
     "static_note": "截至 10 月 11 日 · 父项目总览状态“常用”；事实按 10 月 11 日 14:00 前的源码（10 月 8 日提交）、9 月 28 日厂商凭据改动和 9 月 29 日代理退役记录核对；密钥统一引用密码中心、旧密文迁移和导出边界按 10 月 30 日 11:15 前读到的 10 月 28 日提交与已安装文件改写。本次没有读取任何钥匙、没有发真实请求"
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
     "text_ref": "Qwen、GLM、DeepSeek 三家的钥匙各一把，统一放在我的密码中心；配置档只记“用哪一家的钥匙”，启动选中的程序时才把值交给它。聊天、启动预览和其他终端都不出现明文。"
    },
    {
     "type": "prose",
     "text_ref": "**当前情况：**9 月 28 日起三家厂商改为从密码中心按需取钥匙，配置时不再录入 Key；配置档显示“引用已配置，密钥未验证”，钥匙本身能不能用要靠真实请求判断。其他需要密钥的路线仍用本机加密保存。"
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
   "asset": "_library/illustrations/modules/ai-cli-profile-manager/secrets-isolation/secrets-isolation-v02.png",
   "key": "main-ai-cli-profile-manager",
   "source_phrase": "右上一幅水彩插画：一台显示器上开着一个终端窗口和一个 Codex 桌面版窗口，桌面版窗口里展开一个模型下拉菜单，菜单每一行是一个品牌小标志加一条浅灰短线（依次画 OpenAI、智谱 GLM、DeepSeek 小鲸鱼、通义千问、Ollama 小羊驼的标志，短线处不写字）；显示器旁边一个小保险箱，伸出一把绿色小钥匙，只连向其中一个窗口；机箱侧面的显卡亮着绿光。",
   "sha256": "635306e581f66c96073a56a0bc09a6571bf3054a972ece0c572eeda5fc871ba4",
   "status": "ready"
  }
 ]
}
```

# 配置可以复用，明文秘密只在目标进程需要时出现

〔回到项目 → AI 工具配置管理〕　〔GitHub〕　〔复制 AI 续作说明〕

AI CLI Profile Manager · 功能说明

Qwen、GLM、DeepSeek 三家的钥匙各一把，统一放在我的密码中心；配置档只记“用哪一家的钥匙”，启动选中的程序时才把值交给它。聊天、启动预览和其他终端都不出现明文。10 月 28 日起，其他需要 Key 的厂商只要在密码中心登记过，也一样只记引用、每家一把，本工具不再另存副本。

**当前情况：**9 月 28 日起三家厂商改为从密码中心按需取钥匙，配置时不再录入 Key；配置档显示“引用已配置，密钥未验证”，钥匙本身能不能用要靠真实请求判断。其他需要密钥的路线仍用本机加密保存。——这是 10 月 28 日以前的做法。10 月 28 日起，所有需要 Key 的路线都改为引用密码中心：只要这家厂商已在密码中心登记、并写明了它的官方接口地址，就能配置；没登记的会用中文提示先去登记。配置时不录 Key，也不再在本机另存一份加密副本。以前留下的旧本机密文只在迁移期兼容读取，可以用专门的迁移命令先预览、再改成引用，旧密文本身原样保留，还没有清理。

内容按 2026-10-11 14:00（北京时间）前的改动整理，源码对应 10 月 8 日 09:55 的提交；密钥统一引用、旧密文迁移和导出边界几处按 10 月 30 日读到的 10 月 28 日 11:54 提交改写，当前安装的 0.3.19 模块里相关文件与这份源码一致；具体测试保留各自日期，页面不实时探测运行状态。

项目源码：公开仓库

::screen{#ai-cli-profile-manager-secrets-isolation-02 section="usage"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 把第三方密钥写进聊天、命令或全局设置，既容易泄露，也可能让官方登录误走第三方。同一家厂商的钥匙如果每个配置档各存一份，换个型号就得重录一遍，旧副本还会散落各处。现在每家只保管一把，"
   },
   {
    "id": "module-product",
    "text": "## 这项功能怎样使用 用途与实际影响 ## 为什么需要它 把第三方密钥写进聊天、命令或全局设置，既容易泄露，也可能让官方登录误走第三方。同一家厂商的钥匙如果每个配置档各存一份，换个型号就得重录一遍，旧副本还会散落各处。现在每家只保管一把，"
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

把第三方密钥写进聊天、命令或全局设置，既容易泄露，也可能让官方登录误走第三方。同一家厂商的钥匙如果每个配置档各存一份，换个型号就得重录一遍，旧副本还会散落各处。现在每家只在密码中心保管一把，所有要 Key 的配置档都只记引用，本工具不再自建钥匙仓；真正的值仅在目标程序启动时交给它。

## 举个实际例子

“用 DeepSeek 开这个项目，钥匙用密码中心里那把，别发回聊天，也别留在新开的终端里。”配置档里只有一个“DeepSeek 厂商钥匙”的引用；启动时工具向密码中心取一次值，只交给这一个程序。换成密码中心里登记过的另一家（例如一个聚合服务）也是同样的走法。钥匙交到了和任务做成了，分开核对。

## 最后我会得到什么

配置档只显示引用是否已配置，不显示也不保存钥匙；目标程序启动时拿到本次所需的值，其他终端和普通预览不出现明文。删掉某个配置档不会删掉密码中心里那家的钥匙。

## 正常时

选定程序拿到它需要的那一家钥匙，其他程序和父终端不继承。

## 发现问题时

旧环境或设置可能把请求改送别处时标出具体冲突，不替我改原文件；引用配好了但钥匙没验证过，就照实写“未验证”。这家厂商还没在密码中心登记时，配置直接停下并提示先登记，不会退而问我要 Key。

## 入口不可用或证据不足时

密码中心取不到钥匙、引用或服务身份对不上时拒绝启动，不退回读旧的本机副本，也不改用明文传递。

## 结果怎么看

## 正常时

选定程序拿到其需要的密钥，其他程序和父终端不继承。

## 发现问题时

旧环境或设置可能改送服务时标出具体冲突，不替用户改原文件。

## 入口不可用或证据不足时

密码中心引用、旧密文兼容读取或服务身份不对时拒绝，不退回明文传递。

::screen{#ai-cli-profile-manager-secrets-isolation-03 section="usage"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-03",
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
     "text_ref": "用 aicli profile configure 配置 Qwen、GLM 或 DeepSeek 的配置档：它只保存“用密码中心里哪一家的钥匙”，不会问我要 Key。自定义端点这类其他需要密钥的路线，仍在 configure 里无回显录入，由本机加密保存。",
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
     "text_ref": "1. **只配置这条线路**　选好厂商对应的配置档，保存的是厂商引用；钥匙不写进命令行、聊天或配置文件。",
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
     "text_ref": "用 aicli profile configure 配置 Qwen、GLM 或 DeepSeek 的配置档：它只保存“用密码中心里哪一家的钥匙”，不会问我要 Key。自定义端点这类其他需要密钥的路线，仍在 configure 里无回显录入，由本机加密保存。"
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
     "text_ref": "1. **只配置这条线路**　选好厂商对应的配置档，保存的是厂商引用；钥匙不写进命令行、聊天或配置文件。",
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

用 aicli profile configure 配置 Qwen、GLM 或 DeepSeek 的配置档：它只保存“用密码中心里哪一家的钥匙”，不会问我要 Key。自定义端点这类其他需要密钥的路线，仍在 configure 里无回显录入，由本机加密保存。——这是 10 月 28 日以前的做法；现在任何需要 Key 的配置档都一样只保存引用，这家厂商得先在密码中心登记并写明它的官方接口主机，没登记时 configure 会用中文提示先登记，不会改成在本机录入。以前用旧方式存过本机密文的配置档，用迁移命令改成引用。

## 需要准备什么

- 要用的厂商和配置档

- 密码中心里已登记这家厂商、并存好它的钥匙

- 有旧本机密文的配置档：先用 Invoke-AiCliSecretMigration -DryRun 预览要迁哪些

## 从开始到拿到结果

1. **只配置这条线路**　选好厂商对应的配置档，保存的是厂商引用；钥匙不写进命令行、聊天或配置文件。也不在本机另存一份加密副本。

2. **启动时才交给程序**　终端里，工具经一条只有当前 Windows 用户能连的一次性通道从密码中心收下钥匙，放进目标程序的环境；Codex 桌面版则由真正运行的 Codex 进程自己调用取钥匙的小程序，通过私有管道拿值。父终端保持原样。

3. **分开核对结果**　引用已配置、钥匙真能用、模型真正完成任务分别说明；迁移成功只说明配置档改成了引用，不说明旧密文已经删掉；卸载本地资料也不会自动撤销远程授权。

::screen{#ai-cli-profile-manager-secrets-isolation-04 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-04",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 厂商钥匙按需供应、其他路线本机加密兼容、环境重建与脱敏已实现；最近一次全量离线测试为 9 月 29 日 470/470 ## 关键规则与设计选择 1. 进程"
   },
   {
    "id": "module-technical",
    "text": "## 技术实现与依据（一） 这里保留实现、关键条件、精确入口、历史记录和验证结果。 厂商钥匙按需供应、其他路线本机加密兼容、环境重建与脱敏已实现；最近一次全量离线测试为 9 月 29 日 470/470 ## 关键规则与设计选择 1. 进程"
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
     "text_ref": "1. 进程环境隔离不是文件权限沙箱；Codex run 仍是完全访问。",
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
     "text_ref": "1. 进程环境隔离不是文件权限沙箱；Codex run 仍是完全访问。",
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

所有需要 Key 的路线统一按需从密码中心供应、旧本机密文只读兼容并可显式迁移、环境重建与脱敏已实现；最近一次全量离线测试仍是 9 月 29 日 470/470，10 月 28 日改动后没有本轮重跑的全量结果

## 关键规则与设计选择

1. 进程环境隔离不是文件权限沙箱；Codex run 仍是完全访问。

2. OpenClaw 导入脚本已经退役并从源码删除，不会再写新的 DeepSeek 本机 DPAPI 密文。它以前写下的那份副本若还在，既不覆盖厂商登记，也不是现在取钥匙的来源；DeepSeek 运行时一样用密码中心的厂商引用。旧副本有没有清理，本轮没有核实。

3. 官方 run 只在独占 CODEX_HOME 复制 auth.json，不复制用户配置、rules、skills 或其他会话。

4. 两个 ChatGPT→Claude 本地代理及其登录、退出、清理入口已于 9 月 29 日退役，AICLI 不再启动或管理任何代理的 OAuth（账号授权协议）登录。源码删除不等于旧的本机登录文件已清理、远端授权已撤销，这两件事没有核实。

5. 10 月 28 日起本工具不再写任何本机 DPAPI 密文：自建钥匙仓的写入函数已从源码删除，旧密文只在迁移期兼容读取。现役引用、旧密文兼容读取、显式迁移和旧密文清理是四件事，分开说明；迁移命令跑过也不代表旧副本都已清理。

## 当前怎样实现

- VendorCredential.ps1 负责所有需要 Key 的厂商的取用：从已安装密码中心的登记里找出写明官方接口主机（native_hosts）的厂商，配置档写成 passwordcenter:厂商名，不固定为某几家；没登记的厂商在配置时就拒绝并给中文提示。配置时只写厂商引用、不读 Key；终端启动时经仅当前用户可连的一次性管道从密码中心取值，再注入目标程序环境。桌面版的取值由 GetDesktopProviderToken.ps1 承担，作为 Codex 原生“命令取令牌”（auth.command）由实际运行的 codex 进程调用，经私有标准输出交回。

- SecretStore.ps1 现在只剩 Windows DPAPI CurrentUser 的读取：没迁移的旧配置档（引用还是 32 位十六进制编号）在迁移期照旧解密使用，不再新写。已经改成密码中心引用的配置档，取不到钥匙时不回退读旧密文。

- Invoke-AiCliSecretMigration 负责显式迁移，-DryRun 只预览：按配置档的接口主机找到唯一对应的已登记厂商；两边的值相同才把配置档改成密码中心引用，改写前备份并加锁；密码中心还缺这一条时，经标准输入存进去并回读比对；两边的值不同就保持原状、报告出来，不覆盖任何一边。旧密文一律保留，等验收后另行清理。

- ProfileService 只保存引用，并限制同 Provider/认证域复用；删除本工具的配置档不删除密码中心里的厂商钥匙，现在也不再顺手删除旧本机密文，官方登录不受影响。诊断状态写作“引用已配置，密钥未验证”。

- 原来的 Import-FromOpenClaw.ps1 只在来源主机能证明是 api.deepseek.com、目标是 codex-deepseek-flash 时才写入，默认预览零写入；这个脚本现已从源码删除（10 月 22 日 scripts 目录里没有），不再是可用入口，它当年产生的 DPAPI 副本也不是当前钥匙来源。

::screen{#ai-cli-profile-manager-secrets-isolation-05 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-05",
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
     "text_ref": "- ChildProcess 从运行所需白名单重建 machine 环境，再用 EnvironmentDelta 注入当前配置档必需项；10 月 8 日起额外保留 HTTP_PROXY、HTTPS_PROXY、NO_PROXY 和 CLAUDE_CODE_PROXY_RESOLVES_HOSTS，让子程序沿用电脑已有的网络代理设置（这不是恢复已退役的 ChatGPT 代理）。Redaction 在 JSON、异常与显示层移除已知秘密；原生命令参数使用 ArgumentList，不做 Invoke-Expression。",
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
     "text_ref": "- ChildProcess 从运行所需白名单重建 machine 环境，再用 EnvironmentDelta 注入当前配置档必需项；10 月 8 日起额外保留 HTTP_PROXY、HTTPS_PROXY、NO_PROXY 和 CLAUDE_CODE_PROXY_RESOLVES_HOSTS，让子程序沿用电脑已有的网络代理设置（这不是恢复已退役的 ChatGPT 代理）。Redaction 在 JSON、异常与显示层移除已知秘密；原生命令参数使用 ArgumentList，不做 Invoke-Expression。",
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

- ChildProcess 从运行所需白名单重建 machine 环境，再用 EnvironmentDelta 注入当前配置档必需项；10 月 8 日起额外保留 HTTP_PROXY、HTTPS_PROXY、NO_PROXY 和 CLAUDE_CODE_PROXY_RESOLVES_HOSTS，让子程序沿用电脑已有的网络代理设置（这不是恢复已退役的 ChatGPT 代理）。Redaction 在 JSON、异常与显示层移除已知秘密；原生命令参数使用 ArgumentList，不做 Invoke-Expression。10 月 28 日起普通接口地址和工作区 ID 不再遮挡、原样显示，只过滤真正的秘密。

- eject 的边界分两半：它生成的启动脚本不嵌入秘密，只保留密码中心引用或启动时再输入；但对本机已有的原生工具配置，它按原始字节复制到选定目录。那些配置里原本若写着 Key 或登录信息，副本里也会有，所以不能把导出目录当成“必然不含秘密”。

## 执行流程

1. 选择需要凭据的配置档。

2. 所有需要 Key 的路线都保存密码中心厂商引用，不录 Key、不写本机密文；厂商未登记就停下提示先登记。旧密文配置档另用迁移命令处理。

3. 配置档只保存引用，显示“引用已配置，密钥未验证”。

4. 启动计划标明数据去向和要设置的变量名，不显示值。

5. 目标进程启动时才取值并注入：终端走一次性本机管道，桌面版由 Codex 进程自己取；结束后不改父终端。

::screen{#ai-cli-profile-manager-secrets-isolation-06 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-06",
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
| 厂商引用（passwordcenter:厂商名，如 passwordcenter:qwen） | 配置档里记的不是钥匙，而是“用密码中心里哪一家的钥匙”；任何已在密码中心登记的厂商都这样记，同一家换型号不用重录。 |
| EnvironmentDelta（环境差异） | 本次目标进程明确要增加或移除的变量集合，不是全局环境副本。 |
| auth.json（官方登录副本） | 官方 Codex machine run 为独占临时 home 复制的登录材料；不进入网页或第三方 Profile。 |

## 专业定义

钥匙保管处、配置档和启动环境是三样东西：钥匙在密码中心（旧本机密文只在迁移期兼容读取，不再新写），配置档只记引用，启动环境只在这一次进程里拿到值。

解决什么

防止秘密泄露和配置串线，避免同一把钥匙散成多份副本，同时不把“隐藏所有技术细节”误当成秘密保护。

::screen{#ai-cli-profile-manager-secrets-isolation-07 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-07",
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

防止秘密泄露和配置串线，同时不把“隐藏所有技术细节”误当成秘密保护。

## 边界

- 本页不读取或发布用户配置档、Key、OAuth（账号授权协议）、私有 endpoint 或 auth.json；本次整理也没有读取任何钥匙。

- 普通卸载默认保留本工具的配置和旧 DPAPI 数据；purge 才删除本工具的本地副本，两种情况都不动密码中心里的厂商钥匙。

- 迁移命令保留旧密文，本机到底还剩多少旧副本、什么时候清理，本轮没有核实。

- eject 复制的已有配置按原样保留其内容；导出目录要按可能含秘密的文件对待，只有新生成的启动脚本保证不嵌秘密。

- 已退役代理留下的本机登录文件清理与远端授权撤销是两件事，都要在对应位置另行确认。

## 失败与恢复

- **厂商没在密码中心登记**：configure 直接拒绝并提示先登记厂商和它的官方接口主机，不改成在本机录 Key。

- **密码中心取不到这家的钥匙，或没迁移的旧密文不存在**：体检与启动返回不可用，不回退读取旧副本，也不要求把 Key 放进命令行补救。

- **迁移时两边的值不一样**：保持配置档原状并报告，不覆盖密码中心里的钥匙，也不删旧密文；由我核对哪一把是对的。

- **跨 Provider 复用秘密或 OpenClaw 来源主机不符**：拒绝，避免把一个服务的 Key 发送给另一个 host。

- **输出可能含秘密**：脱敏后再显示；结构无法确认时整项失败，不保存原始正文。

::screen{#ai-cli-profile-manager-secrets-isolation-08 section="tech"}

```typeset
{
 "screen": {
  "id": "ai-cli-profile-manager-secrets-isolation-08",
  "section": "tech",
  "title": "依据与来源",
  "links": [
   {
    "text": "上一个模块 模型引擎与服务方",
    "href": "/projects/ai-cli-profile-manager/engines-providers/"
   },
   {
    "text": "下一个模块 检查与实测",
    "href": "/projects/ai-cli-profile-manager/doctor-validation/"
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
     "text_ref": "- `src/AiCliProfileManager/Private/VendorCredential.ps1`：三家厂商钥匙的引用与一次性供应",
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
     "text_ref": "- `src/AiCliProfileManager/Private/VendorCredential.ps1`：三家厂商钥匙的引用与一次性供应",
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

- `src/AiCliProfileManager/Private/VendorCredential.ps1`：三家厂商钥匙的引用与一次性供应；10 月 28 日起扩展到所有在密码中心登记、带官方接口主机的需要 Key 的厂商

- `src/AiCliProfileManager/Support/GetDesktopProviderToken.ps1`：桌面版按需取钥匙

- `src/AiCliProfileManager/Private/SecretStore.ps1`：旧 DPAPI 密文的迁移期只读兼容

- `src/AiCliProfileManager/Public/Invoke-AiCliSecretMigration.ps1`：旧密文引用迁移到密码中心（可先 -DryRun）

- `src/AiCliProfileManager/Private/ChildProcess.ps1`：目标进程环境重建与清理

- `src/AiCliProfileManager/Private/Redaction.ps1`：显示与回执脱敏

## 如何验证

- 9 月 29 日退役两个代理后的全量离线测试为 470/470、0 失败、0 跳过，覆盖当时的厂商引用、DPAPI 兼容、跨域复用拒绝、父环境清理与秘密不进参数和 JSON；这是当天的记录。10 月 28 日撤掉自建钥匙仓那次提交的说明里记的是一次有 2 项失败的历史回归，之后的修复也没有本轮重跑的全量结果，所以不能说当前版本测试全绿。

- 10 月 30 日只读核对：当前安装的模块是 0.3.19，已安装的 SecretStore.ps1、ProfileService.ps1、VendorCredential.ps1、MachineRuntime.ps1 和 Invoke-AiCliSecretMigration.ps1 与源码逐个哈希一致。这只证明装上的是这份代码，不证明迁移已经跑过或钥匙能用。

- 配置档列表只显示引用状态，已登记厂商为“引用已配置，密钥未验证”，不显示值。

- 10 月 11 日和 10 月 30 日的整理都只读源码和状态，没有打开任何秘密、没有用真实账号取钥匙或发请求，也没有运行迁移命令。

## 与其他模块的关系

Profile 模块只保存引用；本模块定义凭据生命周期，验证和恢复模块只能消费脱敏身份。
