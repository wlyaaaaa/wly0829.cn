---
{
 "title": "技能与基座体检",
 "kind": "skill",
 "url": "/skills/control-plane-doctor/",
 "tagline": "只读查技能装好没有，规则、配置、仓库登记坏没坏。",
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
  "page": "skill-control-plane-doctor",
  "kind": "skill",
  "title": "技能与基座体检",
  "url": "/skills/control-plane-doctor/",
  "tagline": "只读查技能装好没有，规则、配置、仓库登记坏没坏。",
  "status": "",
  "based_on": {
   "commit": "6dd21f643bef0efb33263afe9e9527bf4362879d",
   "commit_time": "2026-09-28T19:28:54+08:00",
   "file": "E:\\.agents\\skills\\control-plane-doctor\\SKILL.md；tools\\Invoke-ControlPlaneDoctor.ps1（646 行）、tools\\Test-PersonalSkillSupply.ps1（772 行）"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [
    {
     "id": "n-usage",
     "text": "读这个技能 11 次，跑检查命令 3 次",
     "meaning": "使用小记录：kind=skill 的 control-plane-doctor（Codex 8、Claude 3），name=Invoke-ControlPlaneDoctor.ps1 的命令（Codex 2、Claude 1）",
     "as_of": "2026-09-28",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl；9 月 21 日 00:29–28 日 04:14（北京）",
     "screens": [
      "skill-control-plane-doctor-01"
     ]
    },
    {
     "id": "n-skills",
     "text": "29 个技能在用，2 个是退役留下的记号",
     "meaning": "技能供应清单 catalog_counts：active 29、tombstone 2",
     "as_of": "2026-09-28",
     "source": "9 月 28 日 22:22 实跑 -SkillName mojibake-doctor 的结果",
     "screens": [
      "skill-control-plane-doctor-02"
     ]
    },
    {
     "id": "n-time",
     "text": "1.5 秒",
     "meaning": "单个技能的供应检查从启动到出结果",
     "as_of": "2026-09-28",
     "source": "同上，time 计时 1.519 秒",
     "screens": [
      "skill-control-plane-doctor-02"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-index",
     "with": "github-local-index",
     "direction": "拿来",
     "flow": "三个仓库的状态由总索引的 Get-ProjectAdmission.ps1 提供，默认缓存、零写入",
     "source": "SKILL.md；Invoke-ControlPlaneDoctor.ps1 106–108 行"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "技能运行条件由 PCConfig 的 Get-SkillRuntimeReadiness.ps1 提供（浏览器配置、Google 零联网校验、Tailscale 状态）；Google 配置接口对账用 PCConfig 的启动脚本",
     "source": "SKILL.md Scoped runtime readiness；实跑结果 evidence.provider_path"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "拿来",
     "flow": "技能供应检查是基座的 Test-PersonalSkillSupply.ps1，读技能清单和安装链接",
     "source": "SKILL.md"
    }
   ],
   "mentions": [
    {
     "target": "/projects/agents/",
     "screen": "skill-control-plane-doctor-01",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/projects/agents/#features",
     "screen": "skill-control-plane-doctor-03",
     "text": "去看全部功能"
    },
    {
     "target": "/projects/agents/",
     "screen": "skill-control-plane-doctor-04",
     "text": "AI 规则与技能基座"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "skill-control-plane-doctor-04",
     "text": "改项目前先核对"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "skill-control-plane-doctor-04",
     "text": "电脑配置与恢复"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "-Owner、-CheckId、-Freshness、-ObservedUserProfile 等参数和 status／convergence_status 字段名不上页，用人话写。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏六句“怎么跟 AI 说”；第 2 屏两句“我：……”。 9 月 29 日第一句删掉了“真用过没有？”（体检不回答），“GitHub 总索引”改成统一显示名“GitHub 项目总索引”。",
    "第 2 屏两次检查是 9 月 28 日 22:22（-SkillName mojibake-doctor）和 22:23（-SkillName google-workspace-direct -CheckRuntime）实际跑的；“AI 交回”是按结果写的话。",
    "第 3 屏“现在答不了的”：Test-PersonalSkillSupply.ps1 93–99 行把外部证据里的“通过”一律降成“不知道”，而体检入口也不传证据路径（Invoke-ControlPlaneDoctor.ps1 里没有 EvidencePath）。基座项目页第 8 屏写的是“后三样没有记录就写不知道”，比实际宽松，建议基座页改成“现在总是不知道”。见 audit.md 第 1 条。 9 月 29 日：技能说明已改成只核对源码和安装、不回答是否真用过（提交 32d9314），输出改写“未核验（本检查不记录实际使用）”；第 3 屏和基座页第 8、13 屏已跟着改。",
    "“三个基座”这个说法是本人和规则里用的；第 1 屏补了一句解释。",
    "第 3 屏按规矩只留一句加链接，原来列的“能查的六项”删了。基座项目页 f-doctor 写的是“只读查技能供应、GitHub 总索引的项目准入和几项电脑配置接口”，实际六项是：技能供应、技能运行条件、Google 配置接口对账、.agents／PCConfig／github-local-index 三个仓库的准入（Invoke-ControlPlaneDoctor.ps1 50–55 行），漏了两个仓库；请基座页作者按这个补全（那里是家）。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-control-plane-doctor/page.json",
  "sha256": "e1270125bb29a8ea33c088b4e738d60d3cb1d36a30bc9946ad384b0b4c48ad37",
  "converted_at_beijing": "2026-10-10T05:26:53+08:00"
 }
}
---

::screen{#skill-control-plane-doctor-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-control-plane-doctor-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，链接画成绿色下划线）。左半边上“它做什么”：一句开头，下面四条检查画成带小圆点的要点，再一句和两条结果要点，最后一句“它只查不修……”；再下面一段浅绿底的小字（不用点名那段）和一行灰色小字（用了多少次那行）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：每句画成一个浅绿色圆角对话气泡，一列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一只听诊器搭在三块叠起来的积木上（三块积木分别画一本规则书、一台电脑、一只 GitHub 章鱼猫标志），旁边一张体检单上画三行打钩和两个问号。",
  "portrait": "竖版：标题和技能名一行；“它做什么”；插画缩成一行；对话气泡一行一个；浅绿小字和灰色小字在最后。",
  "links": [
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/",
    "locator_instances": {
     "h": {
      "input_sha256": "0f6bc8f50851ee77d8e55a6a6ddb0778211f00ab001faef02bec631888f2b96a",
      "instances": [
       {
        "expected_rect": [
         410,
         204,
         605,
         228
        ],
        "confirm_region": true,
        "underline_rect": [
         410,
         230,
         605,
         232
        ],
        "context_text": "技能名 control-plane-doctor·Al 规则与技能基座'的检查入口",
        "context_rect": [
         40,
         197,
         760,
         230
        ]
       }
      ]
     }
    }
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
     "row": "intro",
     "width": "55%",
     "text_ref": "技能与基座体检"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "旧技能入口已退役"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "它做什么"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "intro",
     "width": "45%"
    },
    {
     "type": "notice",
     "row": "intro",
     "text_ref": "不用点名：问技能装没装好、能不能用"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "9月21–28日，AI读这个技能11次，跑检查命令3次（使用小记录）。"
    },
    {
     "type": "dialogue",
     "columns": 2,
     "split_paras": true,
     "text_ref": "怎么跟 AI 说"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "chapter_title",
    "prose",
    "inline_link",
    "dialogue",
    "content_card",
    "illustration"
   ],
   "source_layout": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，链接画成绿色下划线）。左半边上“它做什么”：一句开头，下面四条检查画成带小圆点的要点，再一句和两条结果要点，最后一句“它只查不修……”；再下面一段浅绿底的小字（不用点名那段）和一行灰色小字（用了多少次那行）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：每句画成一个浅绿色圆角对话气泡，一列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一只听诊器搭在三块叠起来的积木上（三块积木分别画一本规则书、一台电脑、一只 GitHub 章鱼猫标志），旁边一张体检单上画三行打钩和两个问号。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它做什么",
     "怎么跟 AI 说"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右上角一幅小插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。01 横版 title/它做什么/不用点名/使用记录仍同属 intro 左55%栏，主插画右45%栏；怎么跟 AI 说移到 intro 行之后独占全宽，六个原气泡按两列排，不再使右栏在左栏结束后单独延伸。",
   "prior_round_notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左55%题、技能链接、它做什么、三个基座说明、浅绿不用点名条及使用记录；右45%听诊器积木小插画及六泡对话大卡。不用点名和记录源在对话后，按视觉左右栏有意重排整节点；主插画在对话卡外右上，不拿主插画做头像。；素材登记插画0/1，必须补齐场景要求，不能删除插画位。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "技能与基座体检"
    },
    {
     "type": "prose",
     "text_ref": "旧技能入口已退役"
    },
    {
     "type": "prose",
     "text_ref": "它做什么"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "large",
     "target_width": "70%"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_paras": true,
     "text_ref": "怎么跟 AI 说"
    },
    {
     "type": "notice",
     "text_ref": "不用点名：问技能装没装好、能不能用"
    },
    {
     "type": "prose",
     "text_ref": "9月21–28日，AI读这个技能11次，跑检查命令3次（使用小记录）。"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "prose",
    "illustration",
    "dialogue",
    "chapter_title",
    "inline_link",
    "content_card"
   ],
   "source_layout": "竖版：标题和技能名一行；“它做什么”；插画缩成一行；对话气泡一行一个；浅绿小字和灰色小字在最后。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它做什么",
     "怎么跟 AI 说"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右上角一幅小插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。01 竖版主插画指定居中、banner 和100%可用宽；原顺序仍为题/技能名/它做什么/插画/对话/不用点名/记录。绿色框残边是否烘焙在素材中需主会话与素材负责人复核；未宣称裁框已修。；page-fixer-03第二轮：主图居中70%宽，撤banner的420px高上限，保自然纵横比，修首轮压扁。",
   "prior_round_notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。题、技能名、它做什么和三个基座解释→整宽插画→六泡→不用点名→使用记录。六个para各成一泡，group一次共享卡头，不将记录画成第七泡。；素材登记插画0/1，必须补齐场景要求，不能删除插画位。"
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
   "asset": "_library/round3/clean-assets/png/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "听诊核验",
   "source_phrase": "右上角一幅小插画：一只听诊器搭在三块叠起来的积木上（三块积木分别画一本规则书、一台电脑、一只 GitHub 章鱼猫标志），旁边一张体检单上画三行打钩和两个问号。",
   "sha256": "18d3aa616e0ec2aa16db0867599d221f862df22750e2e388ca3ad86630ecd1be",
   "status": "ready",
   "original_elements": [
    "一只听诊器搭在三块叠起来的积木上（三块积木分别画一本规则书、一台电脑、一只 GitHub 章鱼猫标志），旁边一张体检单上画三行打钩和两个问号"
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
   "asset": "_library/titles/title-d0fad5fdc9eeb2b960b9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d0fad5fdc9eeb2b960b9",
   "title_text": "技能与基座体检",
   "sha256": "13434d4563d931f311d681eca7266f3fb6327a3f189e72909e351ab269733304",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

技能与基座体检

旧技能入口已退役 · 检查改用〔AI 规则与技能基座〕的只读命令

**它做什么**
问“这个技能装好了没有、在这台电脑上能不能用”，或者“三个基座哪里坏了”，AI 直接用基座命令做一次只读检查，查四样：

- **技能本身**：源码和安装。
- **这台电脑**：运行条件够不够。
- **Google 工具登记**：规则与技能基座登记的 Google 工具清单，和电脑配置里实际启动 Google 工具的那份对不对得上。
- **三个基座仓库**：规则与技能基座、电脑配置与恢复、GitHub 项目总索引的状态。

结果分开说两件事，查不到的就写“不知道”：

- **坏没坏**。
- **能不能同步**：这几个仓库现在能不能把各处的改动合进主线、推上 GitHub。

它只查不修。这些检查只说明装好没有、条件够不够，不代表这个技能真用过、做成过。

这三个仓库就是“三个基座”：AI 的规则和技能、电脑配置、代码仓库登记。

**怎么跟 AI 说**
“修乱码这个技能装好了吗？”
“谷歌那个技能现在在这台电脑上能用吗？”
“查查三个基座哪里坏了。”
“只查 GitHub 项目总索引那一块。”
“Google 那边的配置接口改了，两边还对得上吗？”
“联网刷新一下再查 Git。”

不用点名：问技能装没装好、能不能用，或者基座有没有走样，AI 自己会运行基座的只读检查命令。

9 月 21–28 日，AI 读这个技能 11 次，跑检查命令 3 次（使用小记录）。

::screen{#skill-control-plane-doctor-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-control-plane-doctor-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（例子来历那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”几步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一张清单、一只放大镜、三个问号、一只指向前方的手），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。",
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
     "text_ref": "真事：北京时间9月28日22:22–22:23实际跑的两次检查"
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "columns": 1,
     "text_ref": "我：“修乱码这个技能装好了吗？能用吗？”"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "connector": "line",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png",
      "_library/icons/放大镜.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-02-icon-03.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-02-icon-04.png"
     ],
     "text_ref": "AI 做了什么"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "columns": 1,
     "text_ref": "AI 交回"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "columns": 1,
     "text_ref": "另一种问法"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "chapter_title",
    "tag",
    "dialogue",
    "icon",
    "content_card",
    "numbered_steps"
   ],
   "source_layout": "横版画面：左上标题，旁边一枚灰色小标签（例子来历那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”几步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一张清单、一只放大镜、三个问号、一只指向前方的手），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "AI 做了什么",
     "AI 交回",
     "另一种问法"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "本轮依据审查原文及素材库文本登记，未出图、未看图。AI做了什么前两步骤显式改用ready的打勾清单与放大镜，完整图标路径均存在；后三、四槽仍按当前显式映射保留。显示尺寸、完整外框和G1–G7待主会话渲染复核，未把文件存在视为图已修。",
   "prior_round_notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左2/3我泡→四图节点细竖线→AI交回泡；右1/3另一种问法一张外卡含两泡。来源灰标签只显示原文。timeline会保编号，但scene不说要删定稿编号故保；四图素材缺，不得拿两图复用四节点。右外卡用split_paras保持两个问答泡。；素材登记图标2/4，按源位置的文件号显式请求，缺图不代表可以省略图标。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。"
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
     "text_ref": "真事：北京时间9月28日22:22–22:23实际跑的两次检查"
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "columns": 1,
     "text_ref": "我：“修乱码这个技能装好了吗？能用吗？”"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "columns": 1,
     "connector": "line",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png",
      "_library/icons/放大镜.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-02-icon-03.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-02-icon-04.png"
     ],
     "text_ref": "AI 做了什么"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "columns": 1,
     "text_ref": "AI 交回"
    },
    {
     "type": "dialogue",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "columns": 1,
     "text_ref": "另一种问法"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "tag",
    "content_card",
    "chapter_title",
    "dialogue",
    "icon",
    "numbered_steps"
   ],
   "source_layout": "竖版：标题和标签；对话从上到下：我的气泡、几步、AI 的回复；“另一种问法”卡片放在最后。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "AI 做了什么",
     "AI 交回",
     "另一种问法"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "本轮依据审查原文及素材库文本登记，未出图、未看图。AI做了什么前两步骤显式改用ready的打勾清单与放大镜，完整图标路径均存在；后三、四槽仍按当前显式映射保留。显示尺寸、完整外框和G1–G7待主会话渲染复核，未把文件存在视为图已修。",
   "prior_round_notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。标题和来源标签→我泡→四步骤竖线节点→AI交回→另一种问法双泡整卡；顺序逐字保留，不重复我/AI角色。；素材登记图标2/4，按源位置的文件号显式请求，缺图不代表可以省略图标。\n本轮回读组件现已支持connector=line，采用细纵线与节点；此前不支持line的备注已过时。"
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张清单",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一只放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
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
   "source_phrase": "三个问号",
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
   "asset": "_library/icons/指向手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "指向手",
   "source_phrase": "一只指向前方的手",
   "sha256": "078174b6b61f6c5cc665cc91fea9cff5f7f02da36fbfcff6fc003c6d34599eb7",
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

真事：北京时间 9 月 28 日 22:22–22:23 实际跑的两次检查

我：“修乱码这个技能装好了吗？能用吗？”

**AI 做了什么**
1. 只点这一个技能，只跑“技能供应”这一项；用本机记录，不写任何东西，1.5 秒跑完。
2. 源码：通过。安装：通过，技能目录里是指向源码的链接，不是一份拷贝。清单里现在 29 个技能在用，2 个是退役留下的记号。
3. 这次对话用成过没有、新开的对话会不会自己用上、真实场景做成过没有：三样都是“不知道”。
4. 它给的下一步：拿一件真实的小事让这个技能正常做一次，读回结果。

**AI 交回**
“装得好好的，源码和链接都没问题。有没有真用成过，体检答不了；要真修一个乱码文件看结果，才算知道能用。”

**另一种问法**
我：“谷歌那个技能现在能用吗？”
AI：“连这台电脑的运行条件一起查了：配置在，也对得上；但没验证登录授权还有没有效，也没真去读邮件、文件和任务，日历本来就冻结着。所以只能说配置没问题，要查一封真邮件才算能用。”

::screen{#skill-control-plane-doctor-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-control-plane-doctor-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一个日历上的圆点、两个分开的天平盘、一张零字的纸、一把倒放的扳手、一个问号、一个用户小人、一只蛇形 Python 标志加问号、一个指向别处的箭头）。最下面一条灰底细横幅写“现在答不了的”那段。",
  "portrait": "竖版：横幅和按钮在上；八条规矩一行一条；灰底横幅在最后。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/agents/#features"
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
     "type": "notice",
     "text_ref": "能做的事"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 2,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-03.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-04.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-05.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-06.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-07.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-08.png"
     ],
     "text_ref": "用这个技能时，AI 守的规矩"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "现在答不了的"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "notice",
    "action_button",
    "content_card",
    "bullet_list",
    "icon",
    "inline_link"
   ],
   "source_layout": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。横幅下一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一个日历上的圆点、两个分开的天平盘、一张零字的纸、一把倒放的扳手、一个问号、一个用户小人、一只蛇形 Python 标志加问号、一个指向别处的箭头）。最下面一条灰底细横幅写“现在答不了的”那段。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "用这个技能时，AI 守的规矩"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "本轮依据审查原文及素材库文本登记，未出图、未看图。AI守的规矩前两条显式改用ready的日历与天平，路径均存在；其余六条映射及同组左图右文排法保留。实际图标显示及同组一致性待主会话渲染复核，不新增已具备图标的重复素材请求。",
   "prior_round_notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。顶部整宽浅绿能做的事横幅含原功能链接，下面一张规矩大卡内部八条横2列/竖1列，每条左图；末灰说明条。notice保前两para及原链接，不自动制造按钮文字；原〔去看全部功能〕需comp-text在横幅右侧显示按钮热区。points_card已有item_cards/inner_columns，图示仅登记2/8需补。灰底新外观先样张。；素材登记图标2/8，按源位置的文件号显式请求，缺图不代表可以省略图标。"
  },
  "v": {
   "blocks": [
    {
     "type": "notice",
     "text_ref": "能做的事"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "item_cards": true,
     "inner_columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-03.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-04.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-05.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-06.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-07.png",
      "skill-control-plane-doctor/skill-control-plane-doctor-03-icon-08.png"
     ],
     "text_ref": "用这个技能时，AI 守的规矩"
    },
    {
     "type": "notice",
     "tone": "gray",
     "text_ref": "现在答不了的"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "notice",
    "action_button",
    "content_card",
    "bullet_list",
    "icon",
    "inline_link"
   ],
   "source_layout": "竖版：横幅和按钮在上；八条规矩一行一条；灰底横幅在最后。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "用这个技能时，AI 守的规矩"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "本轮依据审查原文及素材库文本登记，未出图、未看图。AI守的规矩前两条显式改用ready的日历与天平，路径均存在；其余六条映射及同组左图右文排法保留。实际图标显示及同组一致性待主会话渲染复核，不新增已具备图标的重复素材请求。",
   "prior_round_notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。顶部整宽浅绿能做的事横幅含原功能链接，下面一张规矩大卡内部八条横2列/竖1列，每条左图；末灰说明条。notice保前两para及原链接，不自动制造按钮文字；原〔去看全部功能〕需comp-text在横幅右侧显示按钮热区。points_card已有item_cards/inner_columns，图示仅登记2/8需补。灰底新外观先样张。；素材登记图标2/8，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "一个日历上的圆点",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "天平",
   "source_phrase": "两个分开的天平盘",
   "sha256": "425fc2d20811d84d43bcd5e23cbe8b06796683cbff3e5191e3e123668f91293c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张零字的纸",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/扳手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "扳手",
   "source_phrase": "一把倒放的扳手",
   "sha256": "52f3ffa5b6e07c8b49bad87fee5c6ce6903b5deea4171b3a90eaa98cdebcc150",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个问号",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个用户小人",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一只蛇形 Python 标志加问号",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个指向别处的箭头",
   "sha256": "4c8b24f4690ddc583ca222e8084661258efa002ca92ca8c824c85bda3e179954",
   "status": "ready"
  }
 ]
}
```

能做的事

现行检查由规则与技能基座的只读命令完成：核对技能安装和三个基座登记，实际好不好用另行验证。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 按需才跑，不是每件事前的关卡；一般问一句只跑相关的一项。
- “坏没坏”和“仓库现在能不能合进主线、推上 GitHub”分开说；只有真坏了才报错退出。
- 默认用本机记录、零写入；要联网刷新 Git，会更新本地 .git 里的远端记录，结果里写明。
- 只查不修：不装链接、不改文件、不改计划任务、不提交推送；要修，去那个仓库里修。
- “不知道”不升成“通过”，装好不等于能用。
- 用系统账户跑时，按清单登记的用户目录查，不冒充用户、不改环境变量、不为消掉报警再装一份。
- 缺 Python 或验证器，算没验证，不算源码坏了。
- 真要办的事交给那件事的技能，不拿体检代替。

**现在答不了的**　“这次对话、新对话、真实场景有没有用成过”这三样，体检一律不回答，结果里写“未核验（本检查不记录实际使用）”：它只核对源码和安装，不读使用小记录；别处存的“通过”没有宿主回执也一律当“不知道”。要知道，就拿一件真事让那个技能做一次。

::screen{#skill-control-plane-doctor-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-control-plane-doctor-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一个打钩的听诊器、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”在最后。",
  "links": [
   {
    "text": "AI 规则与技能基座",
    "href": "/projects/agents/"
   },
   {
    "text": "改项目前先核对",
    "href": "/skills/project-entry-gate/"
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
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "skill-control-plane-doctor\\skill-control-plane-doctor-04-icon-01.png"
     ],
     "inset_prefixes": [],
     "row": "boundaries",
     "width": "33%",
     "text_ref": "管"
    },
    {
     "type": "table",
     "row": "boundaries",
     "width": "67%",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/钥匙.png"
     ],
     "inset_prefixes": [],
     "row": "boundaries",
     "text_ref": "不做"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "chapter_title",
    "content_card",
    "table",
    "inline_link",
    "icon",
    "bullet_list",
    "prose"
   ],
   "source_layout": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一个打钩的听诊器、一个指路牌、一个禁止小标）。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "管",
     "不管，交给谁",
     "不做"
    ],
    "table_shapes": [
     {
      "start_line": 7,
      "columns": 2,
      "data_rows": 4
     }
    ],
    "illustration_position_mentions": [
     "左上一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左1/3管卡，右2/3两列表格及下方不做卡；三处左上图标听诊器、指路牌、禁止标均scene要求，inventory图标计1不足3。table组名会作表题，但卡内左上图标接口未支持，需table族；不做卡图明确03不存在则补，不用01重复冒充。"
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
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "skill-control-plane-doctor\\skill-control-plane-doctor-04-icon-01.png"
     ],
     "inset_prefixes": [],
     "text_ref": "管"
    },
    {
     "type": "table",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/钥匙.png"
     ],
     "inset_prefixes": [],
     "text_ref": "不做"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-control-plane-doctor\\page.json",
   "source_sha256": "f1c0276874df7d8ab3659937525d78337a93a443cc02f863c9503b2c6d3c5832",
   "source_component_order": [
    "content_card",
    "table",
    "chapter_title",
    "inline_link",
    "icon",
    "bullet_list",
    "prose"
   ],
   "source_layout": "竖版：“管”卡片在上；表格改成小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”在最后。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [
     "管",
     "不管，交给谁",
     "不做"
    ],
    "table_shapes": [
     {
      "start_line": 7,
      "columns": 2,
      "data_rows": 4
     }
    ],
    "illustration_position_mentions": [
     "左上一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。管卡→不管表格四张行卡（这些事粗头、找谁正文与链接）→不做卡；表头原字只一次、其余重复标签交data-echo。三图要求不因库存1而取消。"
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
   "asset": "_library/round3/clean-assets/png/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "听诊器检查",
   "source_phrase": "一个打钩的听诊器",
   "sha256": "18d3aa616e0ec2aa16db0867599d221f862df22750e2e388ca3ad86630ecd1be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "skill-control-plane-doctor/skill-control-plane-doctor-04-icon-03.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "钥匙",
   "source_phrase": "不做\n不在后台定时跑，也不在每件事前拦一道。不为了让“用成过”变绿，去跑无关的私人任务或另建回执平台。不读邮件、文件和密钥；Google那项只比两份配置清单。",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
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
按需、只读地查：某个技能的源码和安装、它在这台电脑上的运行条件，Google 配置接口对账，三个基座仓库的状态；把“坏没坏”和“能不能合进主线、推上 GitHub”分开交代。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 修：重装技能链接、改文件、改计划任务 | 到对应仓库里办；技能装换停见〔AI 规则与技能基座〕 |
| 一个代码项目的同步、推送、公开前核对 | 〔改项目前先核对〕 |
| 电脑的备份恢复是否正常 | 〔电脑配置与恢复〕自己的检查入口 |
| 真要办的事，比如真去读一封邮件 | 那件事自己的技能 |

**不做**
- 不在后台定时跑，也不在每件事前拦一道。
- 不为了让“用成过”变绿，去跑无关的私人任务或另建回执平台。
- 不读邮件、文件和密钥；Google 那项只比两份配置清单。
