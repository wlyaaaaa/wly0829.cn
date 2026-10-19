---
{
 "title": "改项目前先核对",
 "kind": "skill",
 "url": "/skills/project-entry-gate/",
 "tagline": "动代码之前，先认准仓库、查清同步。",
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
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-project-entry-gate",
  "kind": "skill",
  "title": "改项目前先核对",
  "url": "/skills/project-entry-gate/",
  "tagline": "动代码之前，先认准仓库、查清同步。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-10 23:39"
   },
   "facts": [
    "近 7 天 AI 用了 743 次"
   ],
   "as_of": "2026-10-11",
   "source": "AI 使用小记录（10 月 3–9 日，记到 10 月 9 日）；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）"
  },
  "based_on": {
   "commit": "8244785b97b2e5cecdb62e2a0d933467e57eb66b",
   "commit_time": "2026-10-02T01:01:18+08:00",
   "file": "E:\\.agents\\skills\\project-entry-gate\\SKILL.md；GitHub总索引 56ceea70f4a128955676d828ac45c4a29054bde3 的 tools\\Get-ProjectAdmission.ps1、Get-ProjectPrivateCompanion.ps1"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [
    {
     "id": "n-reads",
     "text": "Codex 读这个技能 604 次，Claude 4 次",
     "meaning": "使用小记录里 kind=skill、name=project-entry-gate 的条数",
     "as_of": "2026-10-08",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl；Codex 9 月 16 日 22:15–10 月 8 日 23:49，Claude 9 月 27 日–10 月 2 日（北京），记录记到 10 月 8 日 23:59",
     "screens": [
      "skill-project-entry-gate-01"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-index",
     "with": "github-local-index",
     "direction": "拿来",
     "flow": "调用总索引的 Get-ProjectAdmission.ps1（仓库身份、公开性、分支、工作目录、同步）和 Get-ProjectPrivateCompanion.ps1（私有配套说明）",
     "source": "SKILL.md 第 12–23 行（提交 8244785）"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "只有迁移、计划任务、端口、本机数据、备份恢复、开机启动、运行环境、快捷方式、共享目录这类决定才去查电脑配置的登记",
     "source": "SKILL.md 第 25 行"
    },
    {
     "id": "r-rules",
     "with": "agents",
     "direction": "拿来",
     "flow": "配套说明的读改收尾按当前生效的工程与交付专题；内容处理和权限仍按上层的个人资料、用户授权专题，技能里不再逐条写",
     "source": "SKILL.md 第 22 行；上层活动规则"
    }
   ],
   "mentions": [
    {
     "target": "/projects/github-local-index/",
     "screen": "skill-project-entry-gate-01",
     "text": "GitHub 项目总索引"
    },
    {
     "target": "/projects/github-local-index/#features",
     "screen": "skill-project-entry-gate-03",
     "text": "去看全部功能"
    },
    {
     "target": "/projects/github-local-index/#g-major",
     "screen": "skill-project-entry-gate-04",
     "text": "仓库大动作入口"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "skill-project-entry-gate-04",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/authorization/",
     "screen": "skill-project-entry-gate-04",
     "text": "用户授权"
    },
    {
     "target": "/rules/engineering-delivery/",
     "screen": "skill-project-entry-gate-04",
     "text": "工程与交付"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-project-entry-gate-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/agents/#f-doctor",
     "screen": "skill-project-entry-gate-04",
     "text": "只读体检脚本"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "-LiveMetadata、-RefreshRefs、-ForPublication、-TargetWorktree 等参数名不上页，用人话写成“只问公开性／连远端分支一起刷新／准备公开两样都要”。",
    "准入结果里的 push_strategy 等字段名不上页。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏六句“怎么跟 AI 说”；第 2 屏两句“我：……”。",
    "第 2 屏例子的数据是 9 月 28 日 22:23 对 wlyaaaaa/.agents 实际跑出的结果（缓存模式，fetch 0 次）；“AI 交回”那段话是按结果写的，不是 AI 当时的原话。那个没被 Git 管的新文件是什么没查（与页面无关）。",
    "“另一种问法”是 9 月 28 日对 wlyaaaaa/LocalOCR 实际跑的配套说明查询（status=registered_unmapped）。页面把 LocalOCR 写成“文字识别那个公开项目”，要和总索引页、文字识别项目页的叫法对齐。",
    "第 3 屏按规矩只写一句并链到总索引项目页 #features；那句里“认仓库、查同步、找配套说明、公开前核对”是我概括的，总索引页上的组名以那一页为准。",
    "页上把本技能叫“改项目前先核对”（旧网站的叫法）。第 4 屏原来链到的“技能与基座体检”10 月 2 日退役，改指基座项目的只读体检脚本（/projects/agents/#f-doctor）。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-project-entry-gate/page.json",
  "sha256": "fa42b9954e7d773604e1560dbbb18dd8cfe81ac2200976197294ac0cea506b1d",
  "converted_at_beijing": "2026-10-20T07:45:06+08:00"
 }
}
---

::screen{#skill-project-entry-gate-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-project-entry-gate-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，链接画成绿色下划线）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）和一行灰色小字（用了多少次那行）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：每句画成一个浅绿色圆角对话气泡，一列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一扇半开的小门，门口立着一块写着仓库名的木牌，门边一只放大镜照着一根分出两个杈的树枝（像 Git 分支）。",
  "portrait": "竖版：标题和技能名一行；“它做什么”；插画缩成一行；对话气泡一行一个；浅绿小字和灰色小字在最后。",
  "links": [
   {
    "text": "GitHub 项目总索引",
    "href": "/projects/github-local-index/"
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
     "align": "left",
     "size": "large",
     "text_ref": "改项目前先核对",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 10 日 23:39",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 743 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用小记录（10 月 3–9 日，记到 10 月 9 日）；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "align": "right",
     "row": "k1a-head",
     "width": "auto"
    },
    {
     "type": "prose",
     "text_ref": "技能名project-entry-gate·GitHub项目总索引的入口"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "它做什么"
    },
    {
     "type": "notice",
     "text_ref": "不用点名：说到改哪个项目、同步、推送、公开、换电脑恢复代码，AI自己会用上它。"
    },
    {
     "type": "prose",
     "text_ref": "使用小记录开始记以来"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 2,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "text_ref": "怎么跟AI说"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。；page-fixer-07：首屏对话独立全宽2列，说明不挤在左右长栏；章节标题统一居中。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "改项目前先核对"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 10 日 23:39",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 743 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用小记录（10 月 3–9 日，记到 10 月 9 日）；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）"
    },
    {
     "type": "prose",
     "text_ref": "技能名project-entry-gate·GitHub项目总索引的入口"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "它做什么"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "text_ref": "怎么跟AI说"
    },
    {
     "type": "notice",
     "text_ref": "不用点名：说到改哪个项目、同步、推送、公开、换电脑恢复代码，AI自己会用上它。"
    },
    {
     "type": "prose",
     "text_ref": "使用小记录开始记以来"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。；page-fixer-07：章节标题统一居中。"
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
   "asset": "_library/illustrations/仓库入口分支.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "仓库入口分支",
   "source_phrase": "右上角一幅小插画：一扇半开的小门，门口立着一块写着仓库名的木牌，门边一只放大镜照着一根分出两个杈的树枝（像 Git 分支）。",
   "sha256": "fb8713f1caaf2aa08ba6baf5aebe1db8c945d387bfdf3d92ed485a8ab116ca5d",
   "status": "ready",
   "original_elements": [
    "一扇半开的小门，门口立着一块写着仓库名的木牌，门边一只放大镜照着一根分出两个杈的树枝（像 Git 分支"
   ],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-ac5fa6b95fb3139da85a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ac5fa6b95fb3139da85a",
   "title_text": "改项目前先核对",
   "sha256": "52cee192fcc1c315989578a8aee1ba04f37b6f94642e25eb5061e3635ad94eb2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

改项目前先核对

技能名 project-entry-gate · 〔GitHub 项目总索引〕的入口

**它做什么**
要改、要推送、要公开一个代码项目，而“是哪个仓库、公开还是私有、本机和 GitHub 同步没有、有没有别的工作目录”这些事可能改变做法时，AI 先用总索引的入口把事实查清，再动手；收尾时把这次真正改过的每个仓库再查一遍。有的仓库在总索引里登记了私有的配套说明，维护时按登记找出来，只读这次用得着的；本机没有指针，不等于没有。

平常改一个已经认准的项目、改动随时能撤回，AI 看一眼 git status、照项目自己的规矩办就够，不走这一套。

**怎么跟 AI 说**
“改这个项目之前，先看看是哪个仓库、同步没有。”
“这个文件夹是不是我要改的那个项目？”
“这次改完真的推上去了吗？几个工作目录都查一下。”
“这个项目准备公开，先看看有没有该放私有仓库的东西。”
“维护文字识别之前，把它的私有配套说明找出来。”
“联网刷新一下，看 GitHub 上它现在是公开还是私有。”

不用点名：说到改哪个项目、同步、推送、公开、换电脑恢复代码，AI 自己会用上它。

使用小记录开始记以来，Codex 读这个技能 604 次，Claude 4 次。

::screen{#skill-project-entry-gate-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-project-entry-gate-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（例子来历那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”几步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一本登记簿、一棵分两个杈的小树、一个黄色的注意牌、一只捏着一张纸的手），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。",
  "portrait": "竖版：标题和标签；对话从上到下：我的气泡、几步、AI 的回复；“另一种问法”卡片放在最后。",
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
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "真事：对规则与技能基座的仓库实际跑了一次，北京时间9月28日22:23"
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "text_ref": "我：“要在.agents里改点东西，先看看这个仓库现在什么情况。”"
    },
    {
     "type": "section_heading",
     "text_ref": "AI做了什么"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1用总索引的入口查wlyaaaaa/.agents；默认不联网，GitHub那边用上次记下的情况"
    },
    {
     "type": "dialogue",
     "whole_block": true,
     "sides": [
      "left"
     ],
     "text_ref": "AI交回",
     "row": "final-dialogues",
     "width": "50%"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "text_ref": "另一种问法",
     "row": "final-dialogues",
     "width": "50%"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。；page-fixer-07：步骤占全宽；AI交回和另一种问法最后单独50%/50%并排；章节标题统一居中。；视觉回读：标题解除heading行80%宽占位，真实性标签独立下一行，整屏标题实际居中。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "text_ref": "真事：对规则与技能基座的仓库实际跑了一次，北京时间9月28日22:23"
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "text_ref": "我：“要在.agents里改点东西，先看看这个仓库现在什么情况。”"
    },
    {
     "type": "section_heading",
     "text_ref": "AI做了什么"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1用总索引的入口查wlyaaaaa/.agents；默认不联网，GitHub那边用上次记下的情况"
    },
    {
     "type": "dialogue",
     "whole_block": true,
     "sides": [
      "left"
     ],
     "text_ref": "AI交回"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "text_ref": "另一种问法"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。；page-fixer-07：章节标题统一居中。"
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一本登记簿",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一棵分两个杈的小树",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个黄色的注意牌",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只捏着一张纸的手",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1bd7ab40a6647c38f32a",
   "title_text": "一个完整例子",
   "sha256": "ebeedcd896facfd1af9e0b5b28e5faf151361e1fe40c83443eab292fd4e32f07",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一个完整例子

真事：对规则与技能基座的仓库实际跑了一次，北京时间 9 月 28 日 22:23

我：“要在 .agents 里改点东西，先看看这个仓库现在什么情况。”

**AI 做了什么**
1. 用总索引的入口查 wlyaaaaa/.agents；默认不联网，GitHub 那边用上次记下的情况，远端分支也不刷新。
2. 读到：私有；默认分支 main；本机只有 E:\.agents 这一个工作目录，main 和 GitHub 上的 main 一致；目录里有 1 个 Git 还没管的新文件。
3. 另外两个本地分支：archive/lockdown-review-notes-20260926 有 1 个提交不在 main 里；codex/threebase-continue-20260927 已经全部并进 main，可以收掉。
4. 结论是“注意”，建议的提交方式是“先收拾干净，或只挑自己的文件提交”。这个结论只是事实，不是推送许可。

**AI 交回**
“可以改。仓库是私有的，本机 main 和网上一致（按上次记录，这次没联网）。三件事要注意：
有 1 个没被 Git 管的新文件，还没查是谁的；提交时只挑自己的改动，不用 git add .，查清之前不动它；
一个存档分支上有 1 个提交没进 main，先留着；
一个已经并进 main 的旧分支可以收掉，要收我再单独办。”

**另一种问法**
我：“文字识别那个公开项目，有没有私下的说明文档？”
AI：“登记了私有去处：私有仓库 public-project-private-backup，但还没对上具体文件，所以这次没有要读的。以后要往里写，得先联网再确认一次它还是私有。”

::screen{#skill-project-entry-gate-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-project-entry-gate-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一个小门、一张写着“证据”的纸、一个问号、一朵云和一条虚线、一串三个仓库小方块、一本夹着书签的登记簿、一把锁、一个保险箱）。",
  "portrait": "竖版：横幅和按钮在上（按钮单独一行）；八条规矩一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/github-local-index/#features"
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
     "align": "center",
     "size": "large",
     "text_ref": "能做的事"
    },
    {
     "type": "notice",
     "link_style": "button",
     "text_ref": "这个技能能做的事，就是GitHub项目总索引的“认仓库、查同步、找配套说明、公开前核对”那几组功"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "list_columns": 2,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用这个技能时，AI守的规矩"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。原八条规矩在一张外卡内横两列/竖单列、各条前小图；原链接须成为横幅按钮。；page-fixer-07：规矩外卡占全宽，卡内仍2列；章节标题统一居中。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "能做的事"
    },
    {
     "type": "notice",
     "link_style": "button",
     "text_ref": "这个技能能做的事，就是GitHub项目总索引的“认仓库、查同步、找配套说明、公开前核对”那几组功"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "list_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用这个技能时，AI守的规矩"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。原八条规矩在一张外卡内横两列/竖单列、各条前小图；原链接须成为横幅按钮。；page-fixer-07：章节标题统一居中。"
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
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "一个小门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张写着“证据”的纸",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个问号",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一朵云和一条虚线",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件柜",
   "source_phrase": "一串三个仓库小方块",
   "sha256": "5175a67856332d2607ebee3d06e3cb1dc3ee89bb1a730da21084cf5d7ebd3cb5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/书签册.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "书签册",
   "source_phrase": "一本夹着书签的登记簿",
   "sha256": "c363edd0cb76d7fcdcf03abae41e213c92ebca7b434076607db2620e00e62e33",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把锁",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/保险箱.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "保险箱",
   "source_phrase": "一个保险箱",
   "sha256": "baacc4cbdc7cafb6288f2b13ebc8132f8f9800fa156d3b11e3135a48fadc9efd",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round2/title-colors/color-skill-daily-preferences-03-title-01-c71400b33745.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "3e1b1e7f7b0486348d5ac2f82ea417096517df35396e802621d852f77d194360",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事

这个技能能做的事，就是 GitHub 项目总索引的“认仓库、查同步、找配套说明、公开前核对”那几组功能。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 只在事实会改变做法时才查：目标不清、有好几个工作目录、恢复或迁移、合并分支、推送、公开。
- 查出的结论是证据，不是许可：写着“可以推送”也不等于能推送，推送和发布照授权规矩办。
- Git 没读出来算“不知道”，不算“对不上”；不为这个去改远端地址、放宽 Git 的信任设置。
- 默认用本机记录、不联网；要最新情况才联网：只问 GitHub 的公开性，或连远端分支一起刷新；准备公开时两样都要。
- 收尾把这次真正改过的每个仓库都查一遍，经链接改到的配套说明仓库也算；有没提交的改动不等于有人正在写，先看是谁的；提交照常挑文件、推送、读回默认分支。
- 配套说明按总索引的登记找，只读用得着的；仓库改公开前，先查它登记的私有去处，还没对上具体文件也要查。
- 只有换电脑、计划任务、端口、本机数据、备份恢复、开机启动、运行环境、快捷方式、共享目录这类要看电脑实际情况的事，才去查电脑配置；看到一个本机路径不算。
- 放加密文件的 wlyaaaaa/Key 仓库，克隆前先认清放到哪里：只能放进授权的私有位置，里面只有加密包和能公开的说明，不能把解密后的内容、密码和密钥文件带进去。

::screen{#skill-project-entry-gate-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-project-entry-gate-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一个打钩的小门、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”在最后。",
  "links": [
   {
    "text": "仓库大动作入口",
    "href": "/projects/github-local-index/#g-major",
    "locator_text": {
     "h": "总索引的【仓库大动作入口】；"
    }
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/",
    "locator_text": {
     "h": "哪些要我验证见【重大动作与本人验证】"
    },
    "locator_instances": {
     "v": {
      "input_sha256": "bb0b2dad4ff600b306a15190de7e9cf1445e7c47cada6b965add3addf9f85eb5",
      "instances": [
       {
        "context_text": "总索引的【仓库大动作入口】；哪些要我验证见【重大动作与本人验证】",
        "context_rect": [
         67,
         749,
         874,
         776
        ],
        "expected_rect": [
         591,
         751,
         834,
         776
        ],
        "confirm_region": true
       }
      ]
     }
    }
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "只读体检脚本",
    "href": "/projects/agents/#f-doctor"
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
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "管",
     "row": "limits",
     "width": "34%"
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁",
     "row": "limits",
     "width": "66%"
    },
    {
     "type": "table",
     "portrait_mode": "rows",
     "text_ref": "这些事找谁删库、改名、改公开范围、转移仓库总索引的仓库大动作入口；哪些要我验证见重大动作与本人验",
     "row": "limits"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "不做",
     "row": "limits"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。；page-fixer-07：章节标题统一居中。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "管"
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "portrait_mode": "rows",
     "text_ref": "这些事找谁删库、改名、改公开范围、转移仓库总索引的仓库大动作入口；哪些要我验证见重大动作与本人验"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "不做"
    }
   ],
   "notes": "按清点 source_layout 与定稿 scene/portrait 的文字构图补齐；本轮未看图。；page-fixer-07：章节标题统一居中。"
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
   "asset": "_library/icons/门.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "门",
   "source_phrase": "一个打钩的小门",
   "sha256": "3ab9f96b6f336d0805dc4e100796be10bcdeb8ab52f29e58c48a682f23de2674",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7a7e13ca96796233d6be",
   "title_text": "边界",
   "sha256": "b65d0a46c467818fe1a33aae6516226038c04b5e42477682f1438a11a0bb38ad",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

边界

**管**
进一个代码项目时，认准是哪个仓库、公开还是私有、本机和 GitHub 同步没有、有几个工作目录和分支；推送、公开前把这些再核一次；找出仓库登记过的私有配套说明、按需读，改公开前查它登记的私有去处；收尾时查每个改过的仓库。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 删库、改名、改公开范围、转移仓库 | 总索引的〔仓库大动作入口〕；哪些要我验证见〔重大动作与本人验证〕 |
| 哪些事要我点头 | 〔用户授权〕 |
| 配套说明怎么读、怎么改、怎么收尾 | 〔工程与交付〕 |
| 电脑上的计划任务、端口、备份恢复 | 〔电脑配置与恢复〕 |
| 技能装没装、三个基座的登记坏没坏 | 基座的〔只读体检脚本〕；它说明不了技能好不好用 |

**不做**
- 不给每一次小改动加一道“准入”手续。
- 不把“注意”“可以推送”这类结论当成我的同意。
- 不改远端地址、不放宽 Git 全局信任来绕过读不出的情况。
- 默认不联网拉远端分支，需要时才刷新。
