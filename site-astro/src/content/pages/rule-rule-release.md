---
{
 "title": "规则发布与恢复",
 "kind": "rule-topic",
 "url": "/rules/rule-release/",
 "tagline": "哪一版规则算数，怎么发布新版、退回上一版。",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "points",
   "label": "要点"
  },
  {
   "id": "original",
   "label": "原文"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "rule-rule-release",
  "kind": "rule-topic",
  "title": "规则发布与恢复",
  "url": "/rules/rule-release/",
  "tagline": "哪一版规则算数，怎么发布新版、退回上一版。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E230",
   "file": ".publish/private/rule-sources/docs/contracts/agents.rule-release.md",
   "sha256": "d958c8ba632bbfd8d471ca50a682ca10cb42d8e32f60ae23cff1704e4b0e8997",
   "commit": "4c0c4955b8b7a58d35c5576f66ea3f1d30fb279e",
   "commit_time": "2026-10-09T09:10:42+08:00",
   "activated_at": "2026-10-09T09:12:52.097645+08:00",
   "excerpt_contract": "e230-original-ranges-v1",
   "omitted_count": 0
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：玻璃柜里书架上标着 E187 的那本书轻轻发出一圈淡绿的光，路标上“当前”那块木牌微微晃动后稳稳指向它；一只手伸过来想推开玻璃柜门，黄铜锁扣上的“SYSTEM”小铜牌闪一下，门纹丝不动，手缩回；地上两只印着 Claude 和 OpenAI 标志的小信封轻轻翻开又合上；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，书脊和牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E230（北京时间 10 月 9 日 09:12 起生效）",
     "meaning": "本页人话要点对齐的规则版本和它开始生效的时间；原文区的版本标注由拼页程序按拼页时生效的版本生成",
     "as_of": "2026-10-09",
     "source": "活动规则入口 Inspect：release_id=E230，activated_at_utc=2026-10-09T01:12:52.0976458+00:00；原文 sha256=d958c8ba632bbfd8d471ca50a682ca10cb42d8e32f60ae23cff1704e4b0e8997",
     "screens": [
      "rule-rule-release-05"
     ]
    },
    {
     "id": "n-files",
     "text": "E187 这一版是 11 份规则、2 份入口模板，加 1 张由登记表生成、记着这一版有哪些文件的规则目录表，共 14 个文件",
     "meaning": "E187 同版集合里的文件数，按种类分",
     "as_of": "2026-09-28",
     "source": "Inspect 返回 verified_current.files 共 14 项：11 个 *_contract/agents_root_rules、claude_entry_template 和 codex_entry_template、rules_catalog；E:\\.agents\\releases\\E187\\release.json files 同为 14 项",
     "screens": [
      "rule-rule-release-02"
     ]
    },
    {
     "id": "n-kept",
     "text": "现在发布目录里只有 E187 和 E186 两份；E186 的 14 个文件逐个比对内容指纹，全部对得上",
     "meaning": "发布目录里留着的版本，以及上一版文件的完好情况",
     "as_of": "2026-09-28",
     "source": "ls E:\\.agents\\releases 只有 E186、E187、current-rules.json；按 E186\\release.json 逐个算 sha256，14 个全对",
     "screens": [
      "rule-rule-release-03"
     ]
    },
    {
     "id": "n-seal",
     "text": "E187 目录、指针和两个入口都是只有 SYSTEM 能改，本人账户和管理员只能读",
     "meaning": "活动规则四处位置的 Windows 权限",
     "as_of": "2026-09-28",
     "source": "icacls：E:\\.agents\\releases\\E187、E:\\.agents\\releases\\current-rules.json、C:\\Users\\10979\\.claude\\CLAUDE.md、C:\\Users\\10979\\.codex\\AGENTS.md 均为 SYSTEM:(F)，WLY\\10979:(RX)，Administrators:(RX)",
     "screens": [
      "rule-rule-release-04"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文、发布器、快速发布入口和测试都在 AI 规则与技能基座（E:\\.agents）仓库；发布器怎么实现、入口和钩子怎么接到各个 AI，在基座项目页的技术一节讲。",
     "source": "Inspect 返回的 required_rule_paths.rule_release_contract；E:\\.agents\\tools\\Invoke-EAgentRulesRelease.ps1、Invoke-EAgentRulesFastRelease.ps1"
    },
    {
     "id": "r-claude-codex-entry",
     "with": "agents",
     "direction": "交出",
     "flow": "每次发布把两份入口模板写进 Claude（~/.claude/CLAUDE.md）和 Codex（Codex 家目录 AGENTS.md），两边每次开工先经入口跑核验。",
     "source": "E187 原文第 25 行；发布器 Set-ClaudeEntry、Write-AtomicBytes $shimPath；两份入口与模板 sha256 一致（9 月 28 日现算）"
    },
    {
     "id": "r-laptop",
     "with": "pcconfig",
     "direction": "被同步",
     "flow": "约法有变化时，由笔记本在按需巡检里从主机活动规则同步约法那一段；主机不反向写。笔记本巡检属于电脑配置与恢复。",
     "source": "E187 原文第 25 行；agents/page.json 功能 f-laptop；pcconfig/page.json 功能 f-laptop-check“笔记本巡检（待验收）：平时暂停，需要时手动开”"
    },
    {
     "id": "r-pcconfig-inspect",
     "with": "pcconfig",
     "direction": "被读",
     "flow": "电脑配置与恢复的远程电脑 MCP 和看板项目阶段，都调用发布器的核验入口读活动规则（例如按活动版本的三档维护表算项目阶段）。",
     "source": "E:\\PCConfig\\tools\\remote-computer-mcp\\server.py 第 41 行、public_dashboard_projects.py 第 21 行；E:\\PCConfig\\docs\\runtime\\dashboard-api-contract.md 第 25 行"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/projects/agents/#tech",
     "screen": "rule-rule-release-01",
     "text": "怎么搭的 → AI 规则与技能基座"
    },
    {
     "target": "/projects/pcconfig/#f-laptop-check",
     "screen": "rule-rule-release-04",
     "text": "按需巡检"
    },
    {
     "target": "/rules/context-sources/#p-tiers",
     "screen": "rule-rule-release-04",
     "text": "事实来源与任务上下文"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "原文没有 Markdown 链接，原文两屏的字就是 E187 文件的逐字内容（程序从文件切出来，拼回去与原文逐字相等）；只在两屏最上面各加了一行“原文 · E187 版，一字不改”“原文 · 续”，这是版式标签，不是原文。",
    "人话要点把“校验值”统一写成“内容指纹”（与 AI 规则与技能基座页一致），开头词表注明“原文叫校验值”；把“当前指针”写成“指针”；原文部分照旧。",
    "“规则目录表”（版本文件夹里的 rules-catalog.json，发布时由登记表生成）按派活方答复和审稿意见 1、2 在第 2、3 屏写明；原文“回退把正文、目录和入口模板一起恢复”的“目录”即指它，原文屏照旧。",
    "原文“成功后只留‘当前’和‘上一版’两份可重建的目录”：要点写成“都能重新生成”，依据是发布器从 Git 提交取文件生成版本目录；没有实际重建过来验证。",
    "第 2、3、4 屏的三条“例：”是我 9 月 28 日在这台电脑上只读核对的实例（文件数、发布目录、E186 指纹、权限、入口指纹），不是原文内容；原文要点本身没有加减。",
    "仓库根 CLAUDE.md 的工作区副本是 CRLF 换行，入口模板是 LF，按字节算内容指纹不同；提交进 Git 的内容与模板完全一致（git show HEAD:CLAUDE.md 的 sha256 与模板相同）。所以要点照原文写“相同”，差异写进审计。",
    "“本人要的效果……不能随便打开文件管理器就被改掉”照原文转述；它来自本人 9 月 26 日审定约法时对 M5 的补充（决定记录“约法审定”一节）。这个故事的家在基座项目页亮点 1，本页不再讲。",
    "全页用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。",
    "第 2、3、4 屏的“例：”仍是 9 月 28 日按 E187 核对的快照（14 个文件、发布目录里只有 E187 和 E186、E187 目录的 SYSTEM 权限、入口指纹），这次只跟规则改动，没有按 E190 重新核对。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-rule-release/page.json",
  "sha256": "a20d1cc589ae2ee5ebf2a0e63993969cd94b1d7470f147ba4ddd143aa2c1116a",
  "converted_at_beijing": "2026-10-10T03:45:10+08:00"
 }
}
---

::screen{#rule-rule-release-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-rule-release-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版 16:9。左边约 55% 宽是文字区：左上“规则发布与恢复”用毛笔艺术字大标题（和约法样张的“约法”两字同一种写法），下面一行粗体深绿副标题，再下面介绍段。介绍段下面一张浅绿细边圆角卡片“先认几个词”，七个词条竖排，词条名粗体绿色。卡片下面一行“跳到：”后面四个圆角小按钮（白底浅绿描边绿字），就是四个〔〕链接。右边约 45% 宽一幅水彩插画：一个木书架，架上并排立着两本绿色封皮的精装书，书脊上分别写“E186”“E187”；书架前一根小木桩路标，伸出两块箭头木牌，上面那块写“当前”指向 E187，下面那块写“上一版”指向 E186。书架整个罩在一个带黄铜锁扣的玻璃柜里，锁扣上挂一块小铜牌“SYSTEM”；玻璃柜外面地上放着两只小信封，一只印着 Claude 的橙色星芒标志、一只印着 OpenAI 的黑色花结标志，表示两份入口。插画里只有书脊和牌子上有字，text 里“E186　E187　当前　上一版　SYSTEM”这一行就是这五处的字，不要另外画成一行文字。整屏最下面一条横跨全宽的细长圆角横条（浅绿底），左边是“发布器怎么做到不出半截、不互相覆盖，入口怎么接到各个 AI：”，右边一个显眼的按钮〔怎么搭的 → AI 规则与技能基座〕。",
  "portrait": "竖版 9:16，自上而下：毛笔大标题；粗体副标题；水彩插画（同横版，缩成整宽一幅：书架和玻璃柜在上、路标在书架左前方、两只信封在下方，五处字不变）；介绍段；“先认几个词”卡片（七个词条一行一条）；“跳到：”四个按钮排两行、每行两个；最下面的横条改成上面一行说明、下面一个整宽按钮。",
  "links": [
   {
    "text": "哪一版算数",
    "href": "/rules/rule-release/#p-active"
   },
   {
    "text": "怎么读",
    "href": "/rules/rule-release/#p-read"
   },
   {
    "text": "发布和回退",
    "href": "/rules/rule-release/#p-batch"
   },
   {
    "text": "验证",
    "href": "/rules/rule-release/#p-verify"
   },
   {
    "text": "怎么搭的 → AI 规则与技能基座",
    "href": "/projects/agents/#tech"
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
   "portrait_required": true,
   "aspect": "16:9",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "规则发布与恢复",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "55%"
    },
    {
     "type": "prose",
     "text_ref": "哪一版规则算数",
     "size": "large",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "这个专题管的是",
     "row": "hero"
    },
    {
     "text_ref": "E186",
     "type": "document_mock",
     "variant": "window",
     "base_asset": "_library/illustrations/ill-r3-ec90efce29ff1bef.png",
     "label_positions": [
      {
       "x": 14.66667,
       "y": 24.68514,
       "width": 11.16667,
       "height": 37.78338,
       "align": "center"
      },
      {
       "x": 29.5,
       "y": 25.18892,
       "width": 10.0,
       "height": 36.52393,
       "align": "center"
      },
      {
       "x": 65.16667,
       "y": 18.6398,
       "width": 22.83333,
       "height": 11.33501,
       "align": "center"
      },
      {
       "x": 64.16667,
       "y": 51.88917,
       "width": 23.5,
       "height": 11.08312,
       "align": "center"
      },
      {
       "x": 31.0,
       "y": 80.85642,
       "width": 38.0,
       "height": 10.32746,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      },
      {
       "label_index": 4,
       "position_index": 4
      }
     ],
     "layout": "illustration_labels"
    },
    {
     "type": "points_card",
     "text_ref": "先认几个词",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icon_position": "none",
     "inner_columns": 2
    },
    {
     "type": "action_button",
     "text_ref": "跳到：",
     "columns": 4
    },
    {
     "type": "notice",
     "text_ref": "发布器怎么做到",
     "inline_button": true
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 原图要求五词落在书脊和木牌；现有组件未提供图内文字定位，暂完整保留为 DOM 原字，此项未完成。按钮 columns 需按实际 DOM 验收，不把字段当生效。 2026-10-03 page-fixer-09：主插画明确 large/center；五标签保留原字，精确图位仍缺，不删定稿。 第二轮：首屏名词表使用现有points_card保留原词/冒号/释义在同一原项；横版移出hero为全宽同卡两内栏，手机单栏，避免释义行首悬空冒号。\nmain-closer 2026-10-03T20:29:23+08:00：保全部图内原标签，以现有document_mock绑定唯一完整底图和final-label-geometry实测安全框；取消前置重复主体图，图解改整宽以满足长路径/小牌字高。SHA d9860df278f0ab3dd0631005d8e3c86536fdacd1adeafab43eb8a867f387ecfa。此为AI排版补充，列new-looks待验收。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "规则发布与恢复",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "哪一版规则算数",
     "size": "large",
     "bold": true
    },
    {
     "text_ref": "E186",
     "type": "document_mock",
     "variant": "window",
     "base_asset": "_library/illustrations/ill-r3-ec90efce29ff1bef.png",
     "label_positions": [
      {
       "x": 14.66667,
       "y": 24.68514,
       "width": 11.16667,
       "height": 37.78338,
       "align": "center"
      },
      {
       "x": 29.5,
       "y": 25.18892,
       "width": 10.0,
       "height": 36.52393,
       "align": "center"
      },
      {
       "x": 65.16667,
       "y": 18.6398,
       "width": 22.83333,
       "height": 11.33501,
       "align": "center"
      },
      {
       "x": 64.16667,
       "y": 51.88917,
       "width": 23.5,
       "height": 11.08312,
       "align": "center"
      },
      {
       "x": 31.0,
       "y": 80.85642,
       "width": 38.0,
       "height": 10.32746,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      },
      {
       "label_index": 4,
       "position_index": 4
      }
     ],
     "layout": "illustration_labels"
    },
    {
     "type": "prose",
     "text_ref": "这个专题管的是"
    },
    {
     "type": "points_card",
     "text_ref": "先认几个词",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icon_position": "none"
    },
    {
     "type": "action_button",
     "text_ref": "跳到：",
     "columns": 2
    },
    {
     "type": "notice",
     "text_ref": "发布器怎么做到",
     "inline_button": true
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 原图要求五词落在书脊和木牌；现有组件未提供图内文字定位，暂完整保留为 DOM 原字，此项未完成。按钮 columns 需按实际 DOM 验收，不把字段当生效。 2026-10-03 page-fixer-09：主插画明确 large/center；五标签保留原字，精确图位仍缺，不删定稿。 第二轮：首屏名词表使用现有points_card保留原词/冒号/释义在同一原项；横版移出hero为全宽同卡两内栏，手机单栏，避免释义行首悬空冒号。\nmain-closer 2026-10-03T20:29:23+08:00：保全部图内原标签，以现有document_mock绑定唯一完整底图和final-label-geometry实测安全框；取消前置重复主体图，图解改整宽以满足长路径/小牌字高。SHA d9860df278f0ab3dd0631005d8e3c86536fdacd1adeafab43eb8a867f387ecfa。此为AI排版补充，列new-looks待验收。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "asset": "_library/illustrations/ill-r3-ec90efce29ff1bef.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "ill-r3-ec90efce29ff1bef",
   "source_phrase": "右边约 45% 宽一幅水彩插画：一个木书架，架上并排立着两本绿色封皮的精装书，书脊上分别写“E186”“E187”；书架前一根小木桩路标，伸出两块箭头木牌，上面那块写“当前”指向 E187，下面那块写“上一版”指向 E186。",
   "sha256": "d9860df278f0ab3dd0631005d8e3c86536fdacd1adeafab43eb8a867f387ecfa",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-rule-release/rule-rule-release-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e64cb80820be1fddd48f",
   "title_text": "规则发布与恢复",
   "sha256": "e3c08a5035d1fdc51ee627e214af0edd3f1c9b4a022fa4ca0abc46ac0a486e44",
   "status": "ready"
  }
 ]
}
```

# 规则发布与恢复

**哪一版规则算数、AI 怎么读；改了怎么发布成新的一版，改坏了怎么退回，怎么防止被随手改掉。**

这个专题管的是规则本身的“版本”：所有 AI 开工时读的，只能是正式发布、核对过的那一版；规则要能改、有历史、改坏了能一键退回，又不能谁打开文件管理器就改掉。平时 AI 开工只跑一次核验，只有维护、发布或回退规则时才读这一页。

**先认几个词**
- **活动规则**：当前生效的那一版规则，所有 AI 开工时读的就是它。
- **代号**：每一版的编号，E 加数字，例如 E187。
- **内容指纹**：原文叫“校验值”，文件改一个字就对不上。
- **指针**：一个小文件，记着“当前”和“上一版”各是哪一版。
- **入口**：Claude 和 Codex 家目录里的那份说明，只写“先核验、再读”；它的底稿叫入口模板。
- **回读**：推送或写入以后再读一遍，确认真的到位了。
- **SYSTEM 保护**：文件归 Windows 的 SYSTEM 账户，本人账户和管理员都只能读。

跳到：〔哪一版算数〕〔怎么读〕〔发布和回退〕〔验证〕

E186　E187　当前　上一版　SYSTEM

发布器怎么做到不出半截、不互相覆盖，入口怎么接到各个 AI：〔怎么搭的 → AI 规则与技能基座〕

::screen{#rule-rule-release-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-rule-release-02",
  "section": "points",
  "title": "人话要点：什么时候读、哪一版算数、怎么读",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“这一页什么时候读”配一本翻开的小册子、“哪一版算数”配一枚刻着 E187 的小铜章（E187 已在要点里出现）、“怎么读”配一只拿着放大镜对照一张纸的小手。卡片里每条要点前一个小绿圆点，正文深蓝灰；“例：”开头的那一条画成卡片底部一个浅黄底小便签，便签左边一个小放大镜图标，表示这是 9 月 28 日在这台电脑上核对到的实例。左边一张窄卡“这一页什么时候读”（约 28% 宽）；右边上下两张宽卡：上“哪一版算数”、下“怎么读”。路径、文件名和命令（E:\\.agents、config/control-plane-contract-catalog.json、README.md、Invoke-EAgentRulesRelease.ps1 -Mode Inspect、-Mode Resolve、AGENTS.md、CLAUDE.md）用等宽字体、浅绿底小框，其余字照常。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，顺序同横版（什么时候读、哪一版算数、怎么读）；“例：”便签仍在所属卡片底部。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "p-when",
    "text": "这一页什么时候读"
   },
   {
    "id": "p-active",
    "text": "哪一版算数"
   },
   {
    "id": "p-read",
    "text": "怎么读"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点 · 哪一版算数、怎么读",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "这一页什么时候读",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-601d3d751adb3f913017.png"
     ],
     "inset_prefixes": [
      "例"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "哪一版算数",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/印章.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    },
    {
     "type": "points_card",
     "text_ref": "怎么读",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/放大镜.png"
     ],
     "inset_prefixes": [
      "例"
     ]
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 2026-10-03 page-fixer-09：三卡显式绑定库内册子、印章、放大镜；原例便签接已有黄实例接口。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点 · 哪一版算数、怎么读",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "这一页什么时候读",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-601d3d751adb3f913017.png"
     ],
     "inset_prefixes": [
      "例"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "哪一版算数",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/印章.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    },
    {
     "type": "points_card",
     "text_ref": "怎么读",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/放大镜.png"
     ],
     "inset_prefixes": [
      "例"
     ]
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 2026-10-03 page-fixer-09：三卡显式绑定库内册子、印章、放大镜；原例便签接已有黄实例接口。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一本翻开的小册子、“哪一版算数”配一枚刻着 E187 的小铜章（E187 已在要点里出现）、“怎么读”配一只拿着放大镜对照一张纸的小手",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-title-369682a53c2fcf66bb3e-f2cdf46f21bb.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-369682a53c2fcf66bb3e",
   "title_text": "人话要点 · 哪一版算数、怎么读",
   "sha256": "a49fd6b0dc4b7e242adc7f563d2c3f860bbe29dd4b9dade49cc956a0407ed357",
   "status": "ready"
  }
 ]
}
```

## 人话要点 · 哪一版算数、怎么读

### 这一页什么时候读
- 只在维护、发布或回退规则时读这一页。
- 平时读规则只用核验入口，不跑发布流程。
- 本人要的效果：规则能改、有历史，改坏了能一键退回；而且不能随便打开文件管理器就被改掉。

### 哪一版算数
- 唯一的正本是私有仓库 E:\.agents。
- 每发布一次得到一个代号：E 加数字，只往上加，用过的不再用。
- 每个代号对应默认分支上一个已经推送、又从远端读回核对过的提交，外加这一版完整的文件清单和每个文件的内容指纹。
- 源码、候选改动、没提交的草稿都不算在用的规则；标题、AI 的记忆和旧快照也定不了哪一版在用。
- 一版有哪些文件，看登记表 config/control-plane-contract-catalog.json 里明确登记的规则和入口模板；文件夹里多出来的 Markdown 不会自动算规则，文件数也不固定。
- 每次发布都记下那一版确切的文件清单。
- 例（9 月 28 日核对时）：E187 这一版是 11 份规则、2 份入口模板，加 1 张由登记表生成、记着这一版有哪些文件的规则目录表，共 14 个文件；专题文件夹里的 README.md 没登记，就不在里面。

### 怎么读
- AI 用核验入口 Invoke-EAgentRulesRelease.ps1 -Mode Inspect 核对在用的是哪一版、每个文件的内容指纹对不对；别的程序要读规则，用 -Mode Resolve 拿到同一版、核对过的规则文件位置。
- 核验结果只列真实能读到的规则路径。
- 核验通过只说明文件没被改过，不说明 AI 读懂了，也不说明什么都能做；读多少，按当时判断需要。
- 规则仓库里的 AGENTS.md 只是待审的源稿，不能因为“目录离得更近”就盖过在用的规则。
- 仓库根放着一个很短的 CLAUDE.md 指路桩：Claude Code 在项目里找不到 CLAUDE.md 时，会把 AGENTS.md 当项目规则读，有它挡着，源稿就不会这样生效。它只指向用户级入口；用户级入口缺了，就给出核验命令，不再复制一份完整入口。
- 读取失败，只影响依赖缺的那部分内容的决定；不会因此锁住私人资料，也不触发别的保护。

::screen{#rule-rule-release-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-rule-release-03",
  "section": "points",
  "title": "人话要点：一次一批、一个入口、同时发布、失败和回退",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“一次发布一批”配一个扎好的小包裹、“只用一个发布入口”配一扇只有一个门把手的小木门、“同时有人发布”配两只小手同时伸向一本书、“失败和回退”配一个往回绕的绿色箭头。卡片里每条要点前一个小绿圆点，正文深蓝灰；“例：”开头的那一条画成卡片底部一个浅黄底小便签，便签左边一个小放大镜图标，表示这是 9 月 28 日在这台电脑上核对到的实例。四张卡排成两行两列，先左后右、先上后下：上行“一次发布一批”“只用一个发布入口”，下行“同时有人发布”“失败和回退”（这张最长，可以比左边高）。路径、文件名和命令（Invoke-EAgentRulesRelease.ps1 -Mode Activate、-Mode Rollback）用等宽字体、浅绿底小框，其余字照常。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版；“例：”便签仍在“失败和回退”卡片里原来的位置。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "p-batch",
    "text": "一次发布一批"
   },
   {
    "id": "p-one-entry",
    "text": "只用一个发布入口"
   },
   {
    "id": "p-concurrent",
    "text": "同时有人发布"
   },
   {
    "id": "p-rollback",
    "text": "失败和回退"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "aspect": "16:9",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点 · 发布和回退",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "一次发布一批",
     "columns": 2,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/纸箱.png",
      "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
      "_library/icons/共享节点.png",
      "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 2026-10-03 page-fixer-09：四卡显式绑定纸箱、打开门、共享节点、绿色箭头，不沿缺义叶子槽；原例接已有黄实例。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点 · 发布和回退",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "一次发布一批",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/纸箱.png",
      "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
      "_library/icons/共享节点.png",
      "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 2026-10-03 page-fixer-09：四卡显式绑定纸箱、打开门、共享节点、绿色箭头，不沿缺义叶子槽；原例接已有黄实例。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一个扎好的小包裹、“只用一个发布入口”配一扇只有一个门把手的小木门、“同时有人发布”配两只小手同时伸向一本书、“失败和回退”配一个往回绕的绿色箭头",
   "sha256": "852456776417cc516beae0cdfd5902ea8ffca347edec2806254ff247171b1766",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-c749bac959be45238a1e.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c749bac959be45238a1e",
   "title_text": "人话要点 · 发布和回退",
   "sha256": "f4f1ecba3ee688b33d7c13ebccb2e319d6bf16767afbe3963f5870eca31674ab",
   "status": "ready"
  }
 ]
}
```

## 人话要点 · 发布和回退

### 一次发布一批
- 同一件事的相关修改合在一起测试、一次发布。
- 已经造成实际错误的修复，不为凑批而等。
- 发布前跑完相关测试，只提交这次相关的文件，推到默认分支，再从远端读回核对。

### 只用一个发布入口
- 发布只用 Invoke-EAgentRulesRelease.ps1 -Mode Activate，回退只用 -Mode Rollback。
- 发布器从选定的提交取文件，生成这一版的文件清单和内容指纹，切换“当前”和“上一版”，再读回核对。
- 只查真正参与发布的文件有没有没提交的改动：别的项目或技能正改着东西，不拦发布，也不把别人没做完的改动混进来。

### 同时有人发布
- 发布器先核对指针的内容指纹；别的任务刚发布过，就先重读，把它的结果并进来，不覆盖。
- 新的一版必须包含当前在用的那次提交。
- 不为发布另建排队系统、后台服务或全局的施工平台。

### 失败和回退
- 发布失败，就把原来的指针和入口恢复原样，旧版照常能用。
- 发布成功后只留“当前”和“上一版”两份目录，都能重新生成；更早的历史由私有 Git 保存。
- 例（9 月 28 日核对时）：当时发布目录里只有 E187 和 E186 两份；E186 的 14 个文件逐个比对内容指纹，全部对得上。
- 回退把规则正文、规则目录表和入口模板一起恢复到上一版。
- 回退不改写已有的代号，也不重新生成同一个代号来冒充回退。

::screen{#rule-rule-release-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-rule-release-04",
  "section": "points",
  "title": "人话要点：入口、防随手改、验证、快速还是标准",
  "scene": "横版 16:9。这屏中间有一个“## 人话要点 · 验证”标题，画成深绿大字（井号不画），把屏分成左右两半：左半是“入口跟着版本走”“防随手改”两张卡上下排；右半顶上是“人话要点 · 验证”标题，下面“发布前后核对什么”“快速发布还是标准发布”两张卡上下排。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“入口跟着版本走”配两只小信封（一只印 Claude 橙色星芒、一只印 OpenAI 黑色花结）、“防随手改”配一个挂着小铜牌的黄铜锁扣（同开头插画）、“发布前后核对什么”配一张打了几个绿勾的小清单、“快速发布还是标准发布”配一条岔路口的两块路牌（不写字）。卡片里每条要点前一个小绿圆点，正文深蓝灰；“例：”开头的那一条画成卡片底部一个浅黄底小便签，便签左边一个小放大镜图标，表示这是 9 月 28 日在这台电脑上核对到的实例。路径、文件名和命令（templates/codex-home/AGENTS.md、AGENTS.md、templates/claude-home/CLAUDE.md、~/.claude/CLAUDE.md、Invoke-EAgentRulesFastRelease.ps1、-VerifyPrevious、verified_previous、rule-dashboard-consumer）用等宽字体、浅绿底小框，其余字照常。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：从上到下：“入口跟着版本走”“防随手改”两张卡；“人话要点 · 验证”标题；“发布前后核对什么”“快速发布还是标准发布”两张卡。每张卡整宽，“例：”便签仍在所属卡片底部。字和横版完全一样。",
  "links": [
   {
    "text": "按需巡检",
    "href": "/projects/pcconfig/#f-laptop-check"
   },
   {
    "text": "事实来源与任务上下文",
    "href": "/rules/context-sources/#p-tiers"
   }
  ],
  "anchors": [
   {
    "id": "p-entry",
    "text": "入口跟着版本走"
   },
   {
    "id": "p-seal",
    "text": "防随手改"
   },
   {
    "id": "p-verify",
    "text": "发布前后核对什么"
   },
   {
    "id": "p-fast",
    "text": "快速发布还是标准发布"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "aspect": "16:9",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点 · 验证",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "入口跟着版本走",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/盖章信封.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png",
     "row": "verification-0",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "防随手改",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png",
     "row": "verification-0",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "发布前后核对什么",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/打勾清单.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png",
     "row": "verification-1",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "快速发布还是标准发布",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/岔路.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png",
     "row": "verification-1",
     "width": "50%"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 2026-10-03 page-fixer-09：按本轮授权标题首块全宽居中，四卡保持原字原相对顺序，横版2×2；卡头显式绑定库内信封、锁、清单、岔路。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "人话要点 · 验证",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "入口跟着版本走",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/盖章信封.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    },
    {
     "type": "points_card",
     "text_ref": "防随手改",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    },
    {
     "type": "points_card",
     "text_ref": "发布前后核对什么",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/打勾清单.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    },
    {
     "type": "points_card",
     "text_ref": "快速发布还是标准发布",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/岔路.png"
     ],
     "inset_prefixes": [
      "例"
     ],
     "inset_tone": "yellow",
     "inset_icon": "_library/icons/放大镜.png"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 2026-10-03 page-fixer-09：按本轮授权标题首块全宽居中，四卡保持原字原相对顺序，横版2×2；卡头显式绑定库内信封、锁、清单、岔路。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
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
   "asset": "_library/icons/Claude标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "Claude标志",
   "source_phrase": "两只小信封（一只印 Claude 橙色星芒、一只印 OpenAI 黑色花结）、“防随手改”配一个挂着小铜牌的黄铜锁扣（同开头插画）、“发布前后核对什么”配一张打了几个绿勾的小清单、“快速发布还是标准发布”配一条岔路口的两块路牌（不写字）",
   "sha256": "0e6f72d3f1cee7a82969c2dace6f680c240133ea4f5698eef851d87db5349619",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/title-r005-v2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-04-v2.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-c6b1d1451bace51148bc",
   "title_text": "人话要点 · 验证",
   "sha256": "91fb1d8bbab53ba1d60cf3d18e9a0bf2247bf5304ab81df6467beba8ef7156d4",
   "status": "ready"
  }
 ]
}
```

### 入口跟着版本走
- 每次发布，把 templates/codex-home/AGENTS.md 写到 Codex 家目录的 AGENTS.md，把 templates/claude-home/CLAUDE.md 写到当前用户的 ~/.claude/CLAUDE.md。
- 这样 Claude 不管在哪个项目里干活，都先经这个入口核验在用的版本。
- 例（9 月 28 日核对时）：这台电脑上两份入口和 E187 的入口模板内容指纹一致。
- 约法有变化时，发布汇报里要提醒本人去笔记本（平时用来远控主机、主机坏了时顶上的那台）上启动一次〔按需巡检〕：它平时暂停，需要时手动开一次。
- 由笔记本自己从主机（本人的主力台式机）的活动规则同步约法那一段；主机不反向写笔记本；连不上时，笔记本保留现有规则。

### 防随手改
- 活动规则目录、指针和两个入口，保留现有的 SYSTEM 保护；不换成只设文件只读属性。
- 发布器需要时临时提权，做完恢复保护并读回核对。
- 例（9 月 28 日核对时）：E187 目录、指针和两个入口都是只有 SYSTEM 能改，本人账户和管理员只能读。
- 发布不动用本人的秘密，也不要本人验证，不新建一套授权。

## 人话要点 · 验证

### 发布前后核对什么
- 发布前后都要核对：测试、Git 读回、实际装上的文件和内容指纹、回退能用、入口模板到位。
- 核验时加 -VerifyPrevious，会连上一版的全部文件一起核对，发布回执里也带着这项结果（verified_previous）；上一版的内容指纹完好，不等于真的回退过一次。
- 文件改好了不等于入口接通了；测试通过也不等于回退和实际安装验证过。
- 结构测试查真实的字段、来源、同版文件清单、引用和回退；不逐字锁句子，也不锁文件数量或固定编号。
- 改〔事实来源与任务上下文〕里的冻结名单或三档维护表时，发布前要跑专门的测试 rule-dashboard-consumer：直接调用驾驶舱正在用的解析函数去读这次的候选文件，不另抄一份解析规则；快速发布也跑这一项。
- 解析程序找不到、或候选表读不出来，就如实报失败，不把跳过说成通过。

### 快速发布还是标准发布
- 普通文字和已知的局部改动，走现有的快速发布入口 Invoke-EAgentRulesFastRelease.ps1。
- 身份、授权、保护、发布器本身，或者影响范围说不清的改动，走标准发布。
- 快速入口核对时说“这条路径有测试”，只表示有对应的测试；走不走快速路径，仍由 AI 判断。

::screen{#rule-rule-release-05 section="original"}

```typeset
{
 "screen": {
  "id": "rule-rule-release-05",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.rule-release.md",
   "from": 1,
   "to": 17,
   "release": "E230",
   "sha256": "d958c8ba632bbfd8d471ca50a682ca10cb42d8e32f60ae23cff1704e4b0e8997",
   "omit": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行是列表，画成小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和字段名用等宽字体、浅绿底小框，反引号不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 规则发布与恢复”到“## 什么算活动规则”这一节结束；右卡放“## 读规则”这一节。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-rule-release/rule-rule-release-05",
  "display_replace": {
   "一字不改": "公开副本"
  }
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "aspect": "16:9",
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "规则发布与恢复",
     "whole_block": true,
     "row": "original",
     "width": "50%"
    },
    {
     "type": "source_text_card",
     "text_ref": "读规则",
     "whole_block": true,
     "row": "original",
     "width": "50%"
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版，一字不改"
    },
    {
     "type": "source_text_card",
     "text_ref": "规则发布与恢复",
     "whole_block": true
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  }
 },
 "images": [
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-rule-release/rule-rule-release-05-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e64cb80820be1fddd48f",
   "title_text": "规则发布与恢复",
   "sha256": "b0f70e1a4148a88a72b1f8979e33f1f582ecf5750c59cc7791f46a66d81affb6",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-rule-release/rule-rule-release-05-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0bb559512fc577708440",
   "title_text": "什么算活动规则",
   "sha256": "db98351c1b0f768dfd619911a53d4c950fb022ea54ec58af54da7759ca5a0fbb",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-rule-release/rule-rule-release-05-title-03.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-05-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6faf6ffbd68dd23745d2",
   "title_text": "读规则",
   "sha256": "790082acdbdc4f013d8914310e85f712de4bae3a20d7109020a441c792bceca3",
   "status": "ready"
  }
 ]
}
```

原文 · E230 版，一字不改

# 规则发布与恢复

owner: `E:\.agents`

只在维护、发布或回退规则时读。平时读规则只用核验入口，不跑发布流程。本人要的是：规则能改、有历史、改坏了能一键退回，而且不能随便打开文件管理器就被改掉。

## 什么算活动规则

唯一的规范源是私有仓库 `E:\.agents`。每一次发布有一个递增、不重复使用的代号（E 加数字），对应默认分支上已推送并回读过的一个提交，以及这一版的完整文件集合和每个文件的校验值。源码、候选改动和没提交的工作区都不是活动规则；标题、记忆和旧快照不决定哪一版在用。

这一版包含哪些文件，由 `config/control-plane-contract-catalog.json` 里显式登记的规则条目和入口模板决定；文件夹里多出来的 Markdown 不会自动变成规则，文件数量也不固定。每次发布的记录保存那一版的精确集合。

## 读规则

`tools/Invoke-EAgentRulesRelease.ps1 -Mode Inspect -Json` 核对当前在用的版本和每个文件的校验值；`-Mode Resolve` 给现有的读取方提供同一个已核对的引用。返回的 `required_rule_paths` 只列真实可读的规则路径。核对通过只说明文件没被改过，不代表已经读懂或可以做所有动作；读多少由当前判断需要决定。

规则源仓库里的 `AGENTS.md` 只是待审材料，不能靠“目录更近”盖过活动规则。仓库根的 `CLAUDE.md` 是一个短的指路桩：Claude Code 在项目没有 `CLAUDE.md` 时会把 `AGENTS.md` 当项目规则加载，这个桩防止候选源码因此生效；它只指向用户级入口，并在用户级入口缺失时给出核验命令，不再复制一份完整入口。读取失败只影响依赖缺失内容的决定，不触发锁资料或其他保护。

::screen{#rule-rule-release-06 section="original"}

```typeset
{
 "screen": {
  "id": "rule-rule-release-06",
  "section": "original",
  "shape": "source_text",
  "source": {
   "continued": true,
   "file": "docs/contracts/agents.rule-release.md",
   "from": 19,
   "to": 34,
   "release": "E230",
   "sha256": "d958c8ba632bbfd8d471ca50a682ca10cb42d8e32f60ae23cff1704e4b0e8997",
   "omit": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“- ”开头的行是列表，画成小绿圆点；**…** 是粗体，星号不画；`…` 里的路径、命令和字段名用等宽字体、浅绿底小框，反引号不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“## 发布和回退”和它下面的前四条（到“失败和回退”这一条）；右卡放“入口模板随版本部署”“防随手改”两条和“## 验证”这一节。字多，行距紧一点但不挤。",
  "portrait": "竖版 9:16：“原文 · E230 版 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-rule-release/rule-rule-release-06"
 },
 "layout": {
  "h": {
   "portrait_required": true,
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "text_ref": "发布和回退",
     "columns": 1,
     "whole_block": true,
     "body_columns": 1
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 横版原构图要求一个连续 bullets 节点在第4项后跨卡续排；现有分块接口只能按节点开头定位，缺条目级切分，已提 main 请求，不能声称原构图完成。 2026-10-03 page-fixer-09：接 source_text_card 已有精确切口，第4原bullet后拆两外卡，原文保全。；续屏版本标签明确 E214，标签不属于规则正文。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  },
  "v": {
   "portrait_required": true,
   "aspect": "9:16",
   "blocks": [
    {
     "type": "prose",
     "text_ref": "原文 · E230 版 · 续"
    },
    {
     "type": "source_text_card",
     "text_ref": "发布和回退",
     "columns": 1,
     "whole_block": true
    }
   ],
   "notes": "依据 screens.jsonl 的 source_layout、desktop/portrait_component_order、layout_variants 与定稿 scene/portrait/text 核对；仅文字审查，未查看原图或成图。 横版原构图要求一个连续 bullets 节点在第4项后跨卡续排；现有分块接口只能按节点开头定位，缺条目级切分，已提 main 请求，不能声称原构图完成。；续屏版本标签明确 E214，标签不属于规则正文。",
   "layout_basis": {
    "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\page.json",
    "source_sha256": "7526bc6f8a8fa17aaf70cb770570720519c4321e9bc63ab5dabe895548e4f4bd",
    "inventory": "typeset-inventory/screens.jsonl"
   }
  }
 },
 "images": [
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-rule-release/rule-rule-release-06-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-3d838a8f9c63308625b6",
   "title_text": "发布和回退",
   "sha256": "05bf81e8b8050f097f783127b544859d384e53f0624618a41977c6f20a9a9e22",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-rule-release/rule-rule-release-06-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-rule-release\\img\\rule-rule-release-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-154723a1aa0a09a4c3f2",
   "title_text": "验证",
   "sha256": "c66ada4a4f0c06614511597689738cfa010e58602ba0f7ebeba1fb37a96d908b",
   "status": "ready"
  }
 ]
}
```

原文 · E230 版 · 续

## 发布和回退

- **一次发布一批。** 同一件事的相关修改合在一起测试、一次发布；已经造成实际错误的修复不为凑批等待。发布前跑完相关测试，定向提交，推送到默认分支并回读远端。
- **只用一个发布入口。** 发布用 `Invoke-EAgentRulesRelease.ps1 -Mode Activate`，回退用 `-Mode Rollback`。发布器从选定的提交取文件，生成这一版的集合和校验值，切换“当前”和“上一版”，再回读核对。只检查真正参与发布的文件有没有未提交的改动，不因为无关项目或技能的改动停下，也不把别人没做完的修改混进来。
- **并发。** 发布器会核对当前指针的校验值；如果别的任务刚发布过，先重读并把它的结果并进来，不覆盖。新的发布必须包含当前在用的那次提交。不为发布新建队列、后台服务或全局施工平台。
- **失败和回退。** 发布失败时恢复原来的指针和入口，旧版本照常可用。成功后只留“当前”和“上一版”两份可重建的目录，历史由私有 Git 保存。回退把正文、目录和入口模板一起恢复到上一版；不改写历史代号，也不重建同一个代号来冒充回退。
- **入口模板随版本部署。** `templates/codex-home/AGENTS.md` 写到 Codex home 的 `AGENTS.md`；`templates/claude-home/CLAUDE.md` 写到当前用户的 `~/.claude/CLAUDE.md`，这样 Claude 在任何项目里都先经这个入口核验活动版本。约法有变化时，在发布汇报里提醒本人启动一次笔记本的按需巡检；由笔记本从主机当前活动规则同步约法段，主机不反向写笔记本，连不上时保留笔记本现有规则。
- **防随手改。** 活动规则目录、指针和两个入口保留现有 SYSTEM 保护；发布器按需提权，完成后恢复保护并回读，不换成只有文件只读属性。发布不调用本人的秘密或本人验证，也不新增授权体系。

## 验证

发布前后分别核对：测试、Git 回读、实际安装的文件和校验值、回退能用、入口模板到位。`Inspect -VerifyPrevious` 同时核验上一版完整文件，发布回执也带 `verified_previous`；核验指纹完好不冒充实际执行过回退。文件改好不等于入口已接通，测试通过也不等于回退和实际安装已验证。结构测试检查真实字段、来源、同版集合、引用和回退，不逐字锁句子、文件数量或固定编号。

修改《事实来源与任务上下文》的冻结和维护档位表时，发布前运行 `tests/Invoke-AllTests.ps1 -TestId rule-dashboard-consumer`：它直接调用 PCConfig 驾驶舱正在用的解析函数读取本次候选文件，不复制解析规则；快速发布也包含这项检查。解析器来源缺失或候选表读不出时如实报失败，不把跳过说成通过。

普通文字和已知的局部改动走现有的快速发布入口 `Invoke-EAgentRulesFastRelease.ps1`；身份、授权、保护、发布器本身或影响范围不清的改动走标准发布。快速入口 `Inspect` 返回的 `path_supported` 只说明路径有对应测试，要不要走快速路径仍由模型判断。
