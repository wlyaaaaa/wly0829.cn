---
{
 "title": "代理与网络",
 "kind": "skill",
 "url": "/skills/proxy-network/",
 "tagline": "断网、连不上、要改代理之前，AI 先把两台电脑上的两个代理软件一起看全再动手。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "examples",
   "label": "例子"
  },
  {
   "id": "abilities",
   "label": "能做的事"
  },
  {
   "id": "limits",
   "label": "边界"
  },
  {
   "id": "tech",
   "label": "技术"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-proxy-network",
  "kind": "skill",
  "title": "代理与网络",
  "url": "/skills/proxy-network/",
  "tagline": "断网、连不上、要改代理之前，AI 先把两台电脑上的两个代理软件一起看全再动手。",
  "status": "",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次更新",
    "at": "2026-11-03 04:20"
   },
   "facts": [],
   "as_of": "2026-11-04",
   "source": "技能清单和技能源码"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "86ff7f38",
   "commit_time": "2026-10-31T06:46:44+08:00",
   "file": "E:\\.agents\\skills\\proxy-network\\SKILL.md；ProxyClean 的 AGENTS.md 与 ProxyStatus.ps1；E:\\PCConfig 的 docs/recovery/proxy_client_guard.md、network-recovery.md、tailscale_proxy_entries.md",
   "rules_release": "E331"
  },
  "video_prompt": "",
  "search_aliases": [
   "断网了",
   "网页打不开",
   "代理连不上",
   "Claude 连不上",
   "分流规则",
   "走代理还是直连",
   "飞鸟",
   "Clash",
   "TUN"
  ],
  "registry": {
   "relations": [],
   "mentions": [
    {
     "target": "/projects/proxyclean/",
     "screen": "skill-proxy-network-01",
     "text": "代理上网修复"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-proxy-network-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/proxyclean/",
     "screen": "skill-proxy-network-03",
     "text": "代理上网修复"
    },
    {
     "target": "/projects/proxyclean/",
     "screen": "skill-proxy-network-04",
     "text": "代理上网修复"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-proxy-network-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/skills/tailscale-safe-exposure/",
     "screen": "skill-proxy-network-04",
     "text": "远程只让自己连"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": []
  }
 },
 "source": {
  "page": "sources/pages/skill-proxy-network/page.json",
  "sha256": "0737bc37f6077c345b669fe136f0614bbd6f6c9d7ee28025cec6d6d4705f27b4",
  "converted_at_beijing": "2026-11-04T12:05:39+08:00"
 }
}
---

::screen{#skill-proxy-network-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-proxy-network-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，〔代理上网修复〕〔电脑配置与恢复〕画成绿色下划线的链接）。左半边上“它做什么”两段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：六句说法，每句画成一个浅绿色圆角对话气泡，两列排。下面一幅水彩插画：一根木头指路柱，几块指向不同方向的木牌，其中一块是绿色，四周清新亮绿的叶子。插画里不画字。",
  "portrait": "",
  "links": [
   {
    "text": "代理上网修复",
    "href": "/projects/proxyclean/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "代理与网络",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "50%",
     "row_fit_illustration": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 11 月 3 日 04:20",
       "state": "ok"
      }
     ],
     "static_note": "截至 11 月 4 日 · 技能清单和技能源码",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "技能名",
     "row": "hero"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "我的两台电脑",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "碰到断网、网",
     "row": "hero"
    },
    {
     "type": "notice",
     "text_ref": "不用点名",
     "row": "hero"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 2,
     "split_paras": true,
     "illustration": "none",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "hero",
     "align": "center"
    }
   ],
   "notes": "照手机直取技能页第 1 屏：左栏标题、技能名、它做什么两段、不用点名；右栏六句说法，下面放插画。插画复用素材库，已看过图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "代理与网络",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 11 月 3 日 04:20",
       "state": "ok"
      }
     ],
     "static_note": "截至 11 月 4 日 · 技能清单和技能源码"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么"
    },
    {
     "type": "prose",
     "text_ref": "我的两台电脑"
    },
    {
     "type": "prose",
     "text_ref": "碰到断网、网"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "banner"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 1,
     "split_paras": true,
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    }
   ],
   "notes": "照手机直取技能页第 1 屏：左栏标题、技能名、它做什么两段、不用点名；右栏六句说法，下面放插画。插画复用素材库，已看过图。"
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/分岔指路.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-01-illustration-01",
   "source_phrase": "木头指路柱上几块指向不同方向的木牌（不画字）",
   "sha256": "1dfe279ec5b683d3ceacacf8af37000c33a04422ad35709f45cfde7f9e6e85c6",
   "status": "ready"
  }
 ]
}
```

代理与网络

技能名 proxy-network · 检查用〔代理上网修复〕，两台电脑上的代理设置记在〔电脑配置与恢复〕

**它做什么**
我的两台电脑（主机和副机）都装着两个代理软件：飞鸟和 Clash，平时只让其中一个接管网络。主机平时用 Clash，飞鸟原客户端留作备用；Clash 订阅页里的 TAG 和飞鸟是两份各自独立的订阅，在 Clash 里选飞鸟，接管网络的仍是 Clash。副机的配置按它自己实查。AI 修网络时常常只盯着正在跑的那一个：改了它，换到另一个后问题又回来；两台电脑上同一个软件的设置也不一样，凭印象猜会猜错；AI 自己上网还有一条专用的固定出口，又是另一条路。这个技能只管一件事：先看全，再动手。

碰到断网、网页打不开、连不上，只失败一次的普通错误先按原账号、原目标、原设置重试一次，成了就接着办；重试还不行、反复出现，或者我明确要查要改代理时，AI 先用代理上网修复的只读检查把两个软件一起看一遍；偏离了平时的默认设置就改回来，改分流规则两个软件都改，改完再查一遍。Claude 连不上是例外：第一次失败就不靠重试绕过去，先记下失败时刻，查当时的专用出口和守护程序在做什么。修的时候不关代理、不改走直连。

**怎么跟 AI 说**
“网又断了，查一下。”
“Claude 连不上了，看看是不是出口的问题。”
“这个网站打不开，看看它走的是代理还是直连。”
“把这个网站加进走代理的名单。”
“笔记本借主机的代理上不了网，两台一起查。”
“现在接管网络的是飞鸟还是 Clash？设置对不对？”

不用点名：说到断网、连不上、代理、分流、出口，AI 自己会用上它。

::screen{#skill-proxy-network-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-proxy-network-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（“示例”）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”五步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一个放大镜、一个岔路口指路牌、一个地球、一张带齿轮的文件、一张打钩的清单），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张两列小表格“出问题时”。",
  "portrait": "",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "sides": [
      "left"
     ],
     "illustration": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "出问题时"
    },
    {
     "type": "table",
     "text_ref": "碰到的情况"
    }
   ],
   "notes": "照手机直取技能页第 2 屏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "sides": [
      "left"
     ],
     "illustration": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "出问题时"
    },
    {
     "type": "table",
     "text_ref": "碰到的情况"
    }
   ],
   "notes": "照手机直取技能页第 2 屏。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/放大镜.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-02-icon-01",
   "source_phrase": "一个放大镜：两个软件一起查",
   "sha256": "5170ba7b5437b0953d0596c3dba4ed30724b3ab851a2269f7d412bcfab18a59b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/岔路.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-02-icon-02",
   "source_phrase": "岔路口指路牌：查命中哪条分流规则",
   "sha256": "60c8c99a88b19baf8d010994b8a9b34841a6138e79791cbeef9e79686267047a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/地球.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-02-icon-03",
   "source_phrase": "一个地球：网页其实放在国外",
   "sha256": "9a46fc8d1b8b2faecb95a29955e3420cdfcaf9b2fb9ab6a1b6573c22336c7d9c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-02-icon-04",
   "source_phrase": "带齿轮的文件：两个软件的配置都改",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-02-icon-05",
   "source_phrase": "打钩的清单：再查一遍",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "skill-md-to-pdf/skill-md-to-pdf-02-title-01.png",
   "fallback": false,
   "key": "skill-proxy-network-02-title-01",
   "sha256": "ebeedcd896facfd1af9e0b5b28e5faf151361e1fe40c83443eab292fd4e32f07",
   "status": "ready"
  }
 ]
}
```

一个完整例子

示例：照这个技能的做法写的，不是某一次的记录

我：“我网站的网页怎么打不开了？”

**AI 做了什么**
1. 先跑只读检查，两个代理软件一起看：现在是哪一个接管着网络、虚拟网卡开没开、系统代理关没关；没在跑的那一个，保存的设置也一起看，因为一切换它就生效。
2. 查这次请求实际命中了哪条分流规则、从哪条路出去，看连接记录，不凭“已经开着代理”下结论：规则照样可能把它送去直连。
3. 找到原因：网址以 .cn 结尾，被当成国内网站直连了。可我网站的网页其实放在国外，要走代理；网站的图片和样式放在阿里云上，才要直连。
4. 两个软件的保存配置都加上这条规则：正在用的那个按它自己的方式重新载入，没在用的只改保存的配置，不启动、不切换；改之前先备份原文件，写清怎么改回。
5. 再跑一遍检查，确认网页走了代理、能打开，图片照旧直连。

**AI 交回**
“网页被当成国内网站直连了。两个代理软件都加了让它走代理的规则，现在能打开；原配置已备份，要改回跟我说。”

**出问题时**
| 碰到的情况 | AI 怎么办 |
|---|---|
| 检查发现偏离默认（两个同时接管、系统代理开着、代理关了） | 用那个软件自己的开关或保存配置改回默认，再查一遍；主机上用哪个软件由我决定，守护程序只观察、不替我切；两个绝不同时接管 |
| 只失败一次的普通连接、超时 | 按原账号、原目标、原设置重试一次，成了就接着办，不进入排查 |
| 国内直连国外的网站偶尔失败 | 先看分流是不是把它送去了直连；这种失败是线路常态，不当成电脑故障去追 |
| Claude 连不上 | 不先靠重试：记下失败时刻，查当时固定入口和专用出口的状态、守护程序刚做过什么，再从实际在用的入口测匿名出口，有需要才做对照；出口对了也不等于 Claude 恢复，以我在原应用里收到回复为准 |
| 别的 AI 应用连不上 | 先分清走的是普通代理还是 AI 专用出口；专用出口按它自己的核验办法查，不拿普通代理的结果顶替 |
| AI 专用出口不通 | 让它断开，不换别的路兜底；不切 TAG 或飞鸟订阅、不换主客户端、不换住宅线路；只允许当前订阅登记的备用中转连同一条住宅线路，切后从在用的入口复验；改完回读出口，不对立刻撤回 |
| 问题牵涉两台电脑，或手机、笔记本借主机的代理 | 两台都跑检查，再下结论 |

::screen{#skill-proxy-network-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-proxy-network-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句。横幅下一张两列六行的小表格“六件事”。再下面一张大卡片“用这个技能时，AI 守的规矩”，六条短句两列排，每条前一个小水彩图标（一个开关、一道栏杆闸门、一个放大镜照着对勾、一个循环的硬盘、一面打钩的盾牌、一条断开的线）。",
  "portrait": "",
  "links": [
   {
    "text": "代理上网修复",
    "href": "/projects/proxyclean/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "它管两台电脑"
    },
    {
     "type": "section_heading",
     "text_ref": "七件事"
    },
    {
     "type": "table",
     "text_ref": "事"
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1,
     "item_cards": true,
     "inner_columns": 2,
     "icons": "auto",
     "illustration": "left_inside"
    }
   ],
   "notes": "照手机直取技能页第 3 屏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "size": "large",
     "align": "center"
    },
    {
     "type": "notice",
     "text_ref": "它管两台电脑"
    },
    {
     "type": "section_heading",
     "text_ref": "七件事"
    },
    {
     "type": "table",
     "text_ref": "事"
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1,
     "item_cards": true,
     "inner_columns": 1,
     "icons": "auto",
     "illustration": "left_inside"
    }
   ],
   "notes": "照手机直取技能页第 3 屏。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/开关.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-03-icon-01",
   "source_phrase": "一个开关：不关代理",
   "sha256": "d7379969d06251f4fe56604d5ab78861ce0838ed74f1b9ea998d74ea26a6a2a9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/闸门.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-03-icon-02",
   "source_phrase": "一道闸门：只走登记的出口",
   "sha256": "eee93d6e0a2d4999039530b2ce668ce4beebb63c2370a8befee8c33aa87b4ae5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/scene-r3-magnifier-on-check.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-03-icon-03",
   "source_phrase": "放大镜照着对勾：改完回读",
   "sha256": "b93ee737217a6315944e92ad5dd4e2941234f62467fc928e3b988c51a6e60e41",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/硬盘循环.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-03-icon-04",
   "source_phrase": "循环的硬盘：先备份",
   "sha256": "0684abe6ca8acb20d34fd7053f7feb74499d5651e267a8c28a352779b689b5b9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-03-icon-05",
   "source_phrase": "打钩的盾牌：公开仓库不放私人配置",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-03-icon-06",
   "source_phrase": "一条断开的线：直连偶尔失败",
   "sha256": "2688e27cd119e922f2bf91c47cc822e4158fcc2dc56dddc34e97327a184bd6f1",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7dadc2c869cdb800f4de.png",
   "fallback": false,
   "key": "skill-proxy-network-03-title-01",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready"
  }
 ]
}
```

能做的事

它管两台电脑上两个代理软件的检查、纠偏和分流规则，断网和连不上的排查，以及 AI 的专用出口走没走对。修残留设置、关闭或切换代理这些动手的工具在〔代理上网修复〕项目里。

**七件事**
| 事 | 怎么做 |
|---|---|
| 两个一起看 | 只读检查两个代理软件：谁在接管网络、虚拟网卡和系统代理的状态、哪个端口归谁；没在跑的那个也算数 |
| 纠正偏离 | 默认是虚拟网卡接管全部网络、系统代理关着、代理一直开着；偏离了就用那个软件自己的开关或保存配置改回，改完再查 |
| 查断网先看分流 | 先确认这次请求命中哪条规则、走哪条路，再下结论 |
| 改分流两个都改 | 正在用的重新载入；没在用的只改保存的配置，不启动、不切换 |
| 两台一起查 | 牵涉两台电脑互相访问，或手机、笔记本借主机的代理时，两台都检查 |
| 分清 AI 专用出口 | AI 应用连不上时，先分清走的是普通代理还是专用出口，分开核验 |
| 更新飞鸟订阅 | 平时在 Clash 订阅页点更新；本机的订阅桥用飞鸟已有的登录信息、验原厂签名、解密后交给 Clash，飞鸟客户端可以关着；原厂材料换版要重新提取时按恢复文档办，带令牌的内容不写进技能和输出 |

**用这个技能时，AI 守的规矩**（我定的底线）
- 修网络、修出口时不关代理，不改走直连。
- Claude 的出口只能是登记好的那一条专用出口：它不通就断开，不换别的路兜底，也不改指别的地址；为了快修也不切订阅、不换主客户端、不换住宅线路。
- 改完回读出口，不对立刻撤回。
- 查 Claude 的问题，交回时说清失败时刻入口和守护程序做了什么、证实了哪一层、恢复和复验的结果、还缺什么；匿名探针通过只算出口核验过，Claude 恢复没恢复，以我在原应用里收到实际回复为准。
- 改之前先备份原文件，写清怎么改回；订阅地址里带着令牌，不写进输出、汇报或仓库。
- 公开的代理上网修复仓库里，不放我的地址、订单、订阅和专用出口的配置。
- 从国内直连国外偶尔失败是线路常态：先看分流是不是把它送去了直连，不当成本机故障去追。

::screen{#skill-proxy-network-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-proxy-network-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一个工具箱、一个指路牌、一个禁止小标）。",
  "portrait": "",
  "links": [
   {
    "text": "代理上网修复",
    "href": "/projects/proxyclean/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "远程只让自己连",
    "href": "/skills/tailscale-safe-exposure/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      0
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "照手机直取技能页第 4 屏。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      0
     ]
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/禁止文件.png"
     ]
    }
   ],
   "notes": "照手机直取技能页第 4 屏。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/工具箱.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-04-icon-01",
   "source_phrase": "管",
   "sha256": "1f27e2e5b55499cd52cec4a8b7fe253b3b84c0357e9939f1039619291f43461a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "skill-proxy-network-04-icon-02",
   "source_phrase": "不做",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-7a7e13ca96796233d6be.png",
   "fallback": false,
   "key": "skill-proxy-network-04-title-01",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready"
  }
 ]
}
```

边界

**管**
两台电脑（主机和副机）上飞鸟和 Clash 两个代理软件的检查、纠偏和分流规则；断网、网页打不开、AI 应用连不上的排查；AI 专用出口走没走对。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 修代理软件留下的残留设置、关闭或切换代理的工具本身 | 〔代理上网修复〕 |
| 两台电脑上的代理配置、守护程序（对主客户端只观察，专用出口的恢复另按登记办）、借给手机和笔记本用的入口 | 〔电脑配置与恢复〕 |
| 只让自己的设备连进来的私人网络 | 〔远程只让自己连〕 |

**不做**
- 不靠关代理、改走直连把网络“修好”。
- 不让两个代理软件同时接管网络；切换主客户端由我决定，AI 不替我切。
- 不把订阅地址、令牌写进任何输出。
- 页面和公开仓库里不写具体端口、地址、出口所在地和账号。

::screen{#skill-proxy-network-05 section="tech"}

```typeset
{
 "screen": {
  "id": "skill-proxy-network-05",
  "section": "tech",
  "title": "技术实现与依据",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {},
 "images": []
}
```

## 技术实现与依据

这里保留入口、检查命令、改配置的做法和来源；具体端口、地址、出口所在地、订阅和账号不上页。

**11 月 4 日核对**　技能 E:\.agents\skills\proxy-network\SKILL.md（.agents 75884335 于北京时间 10 月 31 日 05:58 新建；eb173a05 06:03 改为以 ProxyClean 为检查入口并补上 AI 专用出口；86ff7f38 06:46 加入本人禁令：修网络不关代理、Claude 不改指别的地址、不回落直连；之后补上重试、Claude 例外和诊断隔离）。

## 东西在哪

- **ProxyClean**（公开仓库，网站上的“代理上网修复”）：识别两家客户端、只读检查、修复残留、关闭或切换代理；规则见它的 AGENTS.md。主机的检出位置以电脑配置与恢复的仓库登记为准，副机在 V:\GitHub\ProxyClean。
- **PCConfig**（私有，网站上的“电脑配置与恢复”）：主机代理守护 docs/recovery/proxy_client_guard.md（对主客户端只观察，住宅侧车另按登记管）；飞鸟订阅桥 docs/recovery/flyingbird_subscription_bridge.md；AI 专用出口、两家的规则脚本和出口节点替换记录在 docs/recovery/network-recovery.md；借给手机和副机的入口 docs/recovery/tailscale_proxy_entries.md；副机账本。默认“开 TUN、关系统代理、代理常开”写在 PCConfig 的 AGENTS.md。

## 检查

- `ProxyStatus.ps1 -Summary -ExpectMode TunOnly`，要看全加 `-Json`；副机经远程工具在它自己的检出里跑。
- 问题牵涉两台（双机互访、手机或副机借主机代理）时两台都跑。
- 端口、TUN 网卡、系统代理归哪家，以检查结果为准，不按端口号猜归属。

## 查断网

- 先从 Clash 连接记录或内核日志确认这次请求命中的分流规则和出口；显式连代理端口不等于走代理。
- “.cn 结尾不等于在国内”：wly0829.cn 的网页、live、mcp 托管在国外，走代理；网站图片和样式在阿里云 OSS（aliyuncs.com），直连。
- AI 专用出口的核验和切换按 network-recovery.md 的两节办，不拿普通代理的结果顶替。

## Claude 连不上时的顺序

1. 记下失败的北京时间、表现和已知阶段，不为取证操作 Claude Code 或读它的目录、设置、会话；只读核对固定入口的监听归属、控制器规则和登记的住宅出口，再读 ProxyClientGuard 的任务或进程、部署版本、状态时间和失败时刻的探针记录、启停动作。
2. 先测生产入口：`Invoke-AnthropicRouteProbe.ps1 -ConfigPath <守护实际部署的 config.json> -Mode ExistingEntry`，只向登记的匿名核验域名请求；要分清侧车、中转和外部网络，再用 `Relay`、`Candidate` 和普通路径对照，不拿 Claude 的网页、登录或模型接口探网。
3. 恢复沿现有守护：只允许当前订阅登记的备用中转连同一住宅，先有备用路径和完整出口证明，切后从生产入口复验；没登记、两条都失败或证据不足，就保持选择并报告，不启动第二份守护。
4. 探针通过只写链路核验通过；Claude 恢复没恢复，以本人原应用的实际回复为准。

**诊断隔离**：不从生产安装路径启动与生产同名的网络内核做测试；证明不了诊断程序、端口和守护身份都隔离开，就只用现有接口和匿名探针，不为测试停守护或生产代理。

## 改分流

- 两家的保存配置都改：正在用的按客户端原生方式重载，没在用的只改保存配置。
- Clash 改当前订阅挂的规则附加文件（prepend），不直接改生成的运行配置；飞鸟的偏好文件含秘密，只读写目标字段。
- 先备份原文件，写清怎么改回；订阅地址带令牌，不写进输出、汇报或仓库。

## 实测和缺口

技能 10 月 31 日才建，这页没有查到经它完成的排障记录，使用次数没取到；11 月 4 日只核对了入口文件存在，没跑探针、没改代理，守护此刻的状态没有核。页面只按技能和配套文档的做法写。
