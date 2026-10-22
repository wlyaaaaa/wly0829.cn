---
{
 "title": "分工与并行施工",
 "kind": "rule-topic",
 "url": "/rules/execution-coordination/",
 "tagline": "派不派子代理、派谁，多个任务同时施工怎么不打架。",
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
  "page": "rule-execution-coordination",
  "kind": "rule-topic",
  "title": "分工与并行施工",
  "url": "/rules/execution-coordination/",
  "tagline": "派不派子代理、派谁，多个任务同时施工怎么不打架。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E280",
   "commit": "9e6c296def23c918a78334b02c597da68efd0233",
   "ruleset_sha256": "33c65cb3c6152825d5fb89b7be9688f534ab9ebe6ffa1841358b315b98b0b87f",
   "activated_at": "2026-10-22T08:43:25.661700+08:00",
   "file": "sources/rules/docs/contracts/agents.execution-coordination.md",
   "sha256": "4a769967b758b3c674f6ad8ad4dff87c16430c4942e98b168d4bbaa5620e2197",
   "public_sha256": "b3f5f48f7a5e267c2b79bd5d7e9f5739321e5df9c3406bfb789071589fb3f928"
  },
  "video_prompt": "5–8 秒循环，从开头一屏的水彩插画出发：左边小绿树的三根细绿丝带轻轻飘动，丝带上各有一张小任务卡顺着滑到三张小书桌上，桌前的小 AI 助手接过卡片低头写几笔；右边三张工作台上的蓝图各自被添上几条绿色线条；墙上挂钩里的黄铜钥匙被一只手取下、沙漏翻转一次、钥匙又挂回原处；背景淡水彩纸纹上几片叶子缓慢飘落。全程不出现任何新文字，小牌子上的字保持不动、不变形。",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-release",
     "text": "E257（北京时间 10 月 11 日 13:02 起生效）",
     "meaning": "本页人话要点对齐的规则版本和它开始生效的时间；原文区的版本标注由拼页程序按拼页时生效的版本生成",
     "as_of": "2026-10-11",
     "source": "活动规则入口 Inspect：release_id=E257，activated_at_utc=2026-10-11T05:02:36.7738409+00:00；原文 sha256=7fe5424191c0ee8c2533613895892a2fc88731756d611572015f436a79d3ad3c",
     "screens": [
      "rule-execution-coordination-06"
     ]
    },
    {
     "id": "n-lock-minutes",
     "text": "原文示例领 30 分钟，工具默认也是 30 分钟",
     "meaning": "原文示例命令里领锁的时长（-Minutes 30），也是短锁工具的默认值",
     "as_of": "2026-09-28",
     "source": "E190 原文第 30 行；E:\\.agents\\tools\\Invoke-ShortLock.ps1 第 23 行 [int] $Minutes = 30",
     "screens": [
      "rule-execution-coordination-05"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-home-agents",
     "with": "agents",
     "direction": "归属",
     "flow": "这份规则的原文在 AI 规则与技能基座（E:\\.agents）仓库，随规则版本发布；Codex、Claude 和它们派出的子代理每次开工都从活动版本读它。",
     "source": "Invoke-EAgentRulesRelease.ps1 返回的 required_rule_paths.execution_coordination_contract；rules-catalog.json 的 agents.execution-coordination 条目"
    },
    {
     "id": "r-roster",
     "with": "agents",
     "direction": "引用",
     "flow": "原文第 9 条指向 E:\\.agents\\config\\model-roster.json：规则定“怎么选”，清单写“现在能派谁”；清单不在规则版本的同版集合里，随时可改。",
     "source": "E190 原文第 17 行；Inspect 返回的 input_paths 里没有 config/model-roster.json"
    },
    {
     "id": "r-shortlock-pcconfig",
     "with": "pcconfig",
     "direction": "被用",
     "flow": "电脑配置与恢复的两个脚本动手前向基座的短锁工具领锁：密码中心仓库切换（锁名 password-center-repository-cutover，30 分钟）和 Edge 更新任务恢复（10 分钟）。",
     "source": "E:\\PCConfig\\tools\\Invoke-PasswordCenterRepositoryCutover.ps1 第 102–103、298 行；E:\\PCConfig\\tools\\Restore-EdgeUpdateTasks.ps1 第 21、148、201 行"
    },
    {
     "id": "r-shortlock-codex-install",
     "with": "agents",
     "direction": "被用",
     "flow": "基座自己的 Codex 上下文安装脚本在安装、回退、退役前领锁 codex-context-install（30 分钟），做完在 finally 里释放。",
     "source": "E:\\.agents\\tools\\codex_context_install.py 第 489–491 行"
    },
    {
     "id": "r-claude-gpt",
     "with": "codex",
     "direction": "派出",
     "flow": "本人授权 Claude 调用 Codex 时，Claude 经 E:\\.agents\\tools\\Invoke-ClaudeGptChild.ps1 派 GPT-6 子代理（Astra、Sol、Luna），显式传型号和档位；入口细节归 Claude 适配专题。",
     "source": "model-roster.json 的 hosts.claude.authorized_codex_collaboration；E190 原文第 21 行"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/charter/#L22",
     "screen": "rule-execution-coordination-01",
     "text": "L22 质量优先，不浪费额度"
    },
    {
     "target": "/rules/charter/#L23",
     "screen": "rule-execution-coordination-01",
     "text": "L23 可派模型清单"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-execution-coordination-01",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/codex-adapter/",
     "screen": "rule-execution-coordination-01",
     "text": "Codex 适配"
    },
    {
     "target": "/how/#ai-roles",
     "screen": "rule-execution-coordination-01",
     "text": "现行型号、档位和分工 → 怎么协作"
    },
    {
     "target": "/rules/charter/#L22",
     "screen": "rule-execution-coordination-02",
     "text": "约法 L22"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-execution-coordination-02",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-execution-coordination-03",
     "text": "用户授权"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-execution-coordination-04",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/protected-actions/",
     "screen": "rule-execution-coordination-06",
     "text": "重大动作与本人验证"
    },
    {
     "target": "/rules/authorization/",
     "screen": "rule-execution-coordination-06",
     "text": "用户授权"
    },
    {
     "target": "/rules/claude-adapter/",
     "screen": "rule-execution-coordination-07",
     "text": "Claude 适配"
    },
    {
     "target": "/rules/privacy-data/#p-classification",
     "screen": "rule-execution-coordination-03",
     "text": "公开分级表"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "rule-execution-coordination-03",
     "text": "约法 L18"
    },
    {
     "target": "/rules/charter/#L23",
     "screen": "rule-execution-coordination-03",
     "text": "约法 L23"
    },
    {
     "target": "/rules/engineering-delivery/#p-cleanup",
     "screen": "rule-execution-coordination-05",
     "text": "工程与交付"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [],
   "unsure": [
    "开头一屏的入口链到 /how/#ai-roles：“怎么协作”页第 2 批才做，这个锚点名是我起的，第 2 批要在那页建这个锚点（或统一改这里的 href）。已写进 batch2.md。",
    "原文里的三处 Markdown 链接（[重大动作与本人验证](agents.protected-actions.md)、[用户授权](agents.authorization.md)、[Claude 适配](agents.claude-adapter.md)）画成〔〕链接，看得见的字一字没改，只是不显示 .md 文件名，改成链到对应专题页。我认为这仍算“一字不改”，请 Claude 定。",
    "第 3 屏“清单现在写的（9 月 27 日版）”取自 config/model-roster.json，不是规则原文、也不在 E187 同版集合里；放这里是因为原文第 9 条指向它、读者会问“现在到底能派谁”。它只列可派型号，不讲实际怎么分工（那归怎么协作页）。若认为越界，整段删掉即可，不影响要点。",
    "人话要点把原文“根会话”统一写成“主对话”，开头词表里注明“原文叫根会话”；原文部分照旧写“根会话”。",
    "原文“质量需要时可以比根会话更强，不用逐次问本人”：理解为子代理可以用比主对话更强的型号或更高的档位，不用每次问本人。",
    "原文“对本人个人经历、价值和认知的深度理解”写成“深度理解本人的经历、价值和想法”，“Astra 也可以写认知”写成“写理解本人的内容”：“认知”按对本人的理解类内容理解。",
    "原文“实质反证”写成“有分量的反面证据”；“回读之后”写成“读回确认以后”；“活动检出”写成“计划任务或技能直接在用的那份目录”并括注原词。",
    "开头插画里的三块立牌“Opus 5.5 · high”“Astra · max”“Luna · low”只是示意“每次写明型号和档位”，不是规则规定的固定搭配。",
    "全页都用“本人”第三人称，照原文口吻；没有替本人第一人称写的句子。",
    "E190 新加的第 7 条写成第 3 屏的“全局规则只引用，资料锁着时不凑”一卡；派活说明里那句固定的话照原文一字不改地引用。第 3 屏的“清单现在写的（9 月 27 日版）”没有重新核对 model-roster.json 的现状。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/rule-execution-coordination/page.json",
  "sha256": "55a9607bad1d8d10da5f4212ab7221161d73b6ce3d690d4970ea2bd47d699938",
  "converted_at_beijing": "2026-10-22T09:10:17+08:00"
 }
}
---

::screen{#rule-execution-coordination-01 section="top"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-01",
  "section": "top",
  "title": "开头：这个专题管什么",
  "scene": "横版16:9，白底绿色。顶上毛笔标题、副标题和一段职责说明。中间主要区域为五行型号表：左列完整型号显示名，右列任务场景及档位；每行铺满，不补空行，所有文字完整清楚。表下左卡“怎么搭配”，右卡“三种宿主怎样派”；职责、条件和三条派法都保留。页底四个跳转按钮与协作链接。用少量绿色细线连接两个小助手的水彩图标，不再画带模型名牌的大插画，不额外写口号。Markdown标记不画，〔〕链接画绿色下划线、小箭头；英文档位用清楚的等宽字体。",
  "portrait": "竖版9:16按正文顺序分张：标题和职责在前；型号表改成一张整宽模型卡一条，每条完整显示型号、任务和档位，不能左右挤排；“怎么搭配”和三种宿主说明依次整宽；链接放末尾。完整保留实义，不加空卡、空框，不把横版缩小塞入竖画布。",
  "links": [
   {
    "text": "要不要派",
    "href": "/rules/execution-coordination/#p-whether"
   },
   {
    "text": "派谁、花多少",
    "href": "/rules/execution-coordination/#p-choose"
   },
   {
    "text": "按风险定复核深浅",
    "href": "/rules/execution-coordination/#p-review"
   },
   {
    "text": "多个任务同时改东西",
    "href": "/rules/execution-coordination/#p-parallel"
   },
   {
    "text": "在整套系统里的分工 → 怎么协作",
    "href": "/how/#ai-roles"
   },
   {
    "text": "现行型号、档位和分工 → 怎么协作",
    "href": "/how/#ai-roles"
   }
  ],
  "anchors": [
   {
    "id": "p-model-table",
    "text": "型号与派法"
   }
  ],
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
     "text_ref": "分工与并行施工"
    },
    {
     "type": "section_heading",
     "text_ref": "主持的想和把关，具体活派出去"
    },
    {
     "type": "prose",
     "text_ref": "主对话管战略、头脑风暴、抽查、QA",
     "row": "lone-ill-3",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/motion-rule-execution-coordination-01-legacy-video.png",
     "row": "lone-ill-3",
     "width": "40%"
    },
    {
     "type": "table",
     "text_ref": "型号与派法（北京时间2026-10-08）"
    },
    {
     "type": "notice",
     "row": "host",
     "width": "50%",
     "text_ref": "怎么搭配：Sol用ultra，Luna用max"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "row": "host",
     "width": "50%",
     "text_ref": "三种宿主怎样派",
     "header_icon": [
      "_library/icons/双气泡.png"
     ]
    },
    {
     "type": "action_button",
     "linkrow_from_para": true,
     "text_ref": "跳到：要不要派派谁、花多少按风险定复核深浅多个任务同时改东西"
    },
    {
     "type": "prose",
     "text_ref": "Claude和GPT在整套系统里的搭配：在整套系统里的分"
    },
    {
     "type": "action_button",
     "text_ref": "现行型号、档位和分工 → 怎么协作",
     "align": "left"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版16:9，白底绿色。顶上毛笔标题、副标题和一段职责说明。中间主要区域为五行型号表：左列完整型号显示名，右列任务场景及档位；每行铺满，不补空行，所有文字完整清楚。表下左卡“怎么搭配”，右卡“三种宿主怎样派”；职责、条件和三条派法都保留。页底四个跳转按钮与协作链接。用少量绿色细线连接两个小助手的水彩图标，不再画带模型名牌的大插画，不额外写口号。Markdown标记不画，〔〕链接画绿色下划线、小箭头；英文档位用清楚的等宽字体。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "分工与并行施工"
    },
    {
     "type": "section_heading",
     "text_ref": "主持的想和把关，具体活派出去"
    },
    {
     "type": "prose",
     "text_ref": "主对话管战略、头脑风暴、抽查、QA"
    },
    {
     "type": "illustration",
     "asset": "_library/illustrations/motion-rule-execution-coordination-01-legacy-video.png",
     "align": "center",
     "target_width": "100%",
     "target_height": 560
    },
    {
     "type": "table",
     "text_ref": "型号与派法（北京时间2026-10-08）"
    },
    {
     "type": "notice",
     "row": "host",
     "width": "50%",
     "text_ref": "怎么搭配：Sol用ultra，Luna用max"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "row": "host",
     "width": "50%",
     "text_ref": "三种宿主怎样派",
     "header_icon": [
      "_library/icons/双气泡.png"
     ]
    },
    {
     "type": "action_button",
     "linkrow_from_para": true,
     "text_ref": "跳到：要不要派派谁、花多少按风险定复核深浅多个任务同时改东西"
    },
    {
     "type": "prose",
     "text_ref": "Claude和GPT在整套系统里的搭配：在整套系统里的分"
    },
    {
     "type": "action_button",
     "text_ref": "现行型号、档位和分工 → 怎么协作",
     "align": "left"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版9:16按正文顺序分张：标题和职责在前；型号表改成一张整宽模型卡一条，每条完整显示型号、任务和档位，不能左右挤排；“怎么搭配”和三种宿主说明依次整宽；链接放末尾。完整保留实义，不加空卡、空框，不把横版缩小塞入竖画布。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "key": "双气泡",
   "source_phrase": "Claude：自己的子代理用 Agent 类型选档；Sol、Luna 无需另授权；Astra 按对话或项目授权，GPT 都经包装器写明型号和档位。\nCodex 的 GPT 主对话：用原生子代理，写明型号和档位，核对实际启动值。\nCodex 的别家主模型：用 openai_child，只派 Sol、Luna，不派 Astra。",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/双气泡.png",
   "fallback": false,
   "key": "双气泡",
   "source_phrase": "Claude：自己的子代理用 Agent 类型选档；Sol、Luna 无需另授权；Astra 按对话或项目授权，GPT 都经包装器写明型号和档位。\nCodex 的 GPT 主对话：用原生子代理，写明型号和档位，核对实际启动值。\nCodex 的别家主模型：用 openai_child，只派 Sol、Luna，不派 Astra。",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/motion-rule-execution-coordination-01-legacy-video.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-execution-coordination\\img\\rule-execution-coordination-01-h.png",
   "fallback": false,
   "semantic_status": "legacy_same_screen_original_rgb_original_mask_only",
   "key": "motion-rule-execution-coordination-01-legacy-video",
   "source_phrase": "旧HTML同屏首屏原video.rect及原mask对应主体，原文字与截图位由新DOM独立保留",
   "sha256": "2b4e5675eaddd4e52542adafa9b24b6290fdf90b556e64d79a1498fd054bd19d",
   "status": "ready",
   "source_box": [
    1032,
    3,
    1672,
    360
   ]
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-5002849d46891c01a050.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5002849d46891c01a050",
   "title_text": "分工与并行施工",
   "sha256": "23b61c8358a5a092232dbf3bef0bae942902a222680a49f50cca19c3658baff4",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 分工与并行施工

**主持的想和把关，具体活派出去；几路一起干，改动不互相覆盖。**

主对话管战略、头脑风暴、抽查、QA（质量检查）和最终把关；具体活派出去，只有整段一两步的小事顺手做。型号和档位按成品要求、厂商数据和权威评测选，惊艳类的样板与关键部分交做得最好的亲手做。多任务施工各用工作副本；共用设置的单点动作领短锁，做完释放。

### 型号与派法（北京时间 2026-10-08）
| 型号 | 任务场景与档位 |
|---|---|
| GPT-6 Luna | 机械调用、逐字摘录、理解材料和跨材料对齐都用 max；纯机械改名、套已定补丁可以派，需要判断的写代码和修复不派；照写好的提示生图、落盘用 low |
| GPT-6.1 Sol | 照已定方案的代码修改、常规排障、综合调研、批量审图用 ultra；只读、步骤简单、代码上限为 0 的小单（读一页、查一项现成数据、回读状态）用 medium（这一条按 2026-10-22 读到的模型清单补齐）。根因不明时先收材料。只接方案、范围、文件和预算都写死的施工，要自己定方案的（架构、跨模块、开放问题、取舍）先交 Claude Opus 或有授权的 Astra；做不对先纠正，同一关键错再犯才换 Astra high 或 Opus high |
| GPT-6 Astra | 要紧审图、密集图表 high；疑难、重大改动复核、并发和安全这类难测的路径 ultra；不为生图派它 |
| Claude Opus 5.5 | 小判断 low；整理初稿 medium；完整分析、方案、程序根因、正式文书 high；疑难 xhigh |
| Claude Sonnet 5.5 | 只在 GPT 不可用时接机械活，用 low；GPT 能用时不派 |

**怎么搭配**：Sol 用 ultra，Luna 用 max（最高档）；Sol 只读、步骤简单、代码上限为 0 的小单例外用 medium，照写好的提示生图、落盘交 Luna low；其他型号选能胜任的最低档。做错先按验收事实补材料、退回改，同一关键错再犯，或方案走不通、活变难，就重选执行者；两家同档都做不对，才最后用一次 max，同一个模型不把从 xhigh 加到 max 当默认的下一步。Opus 与 Astra 的高档活选一家实施，可交叉独立复核。给本人看的成品、分析和价值取舍优先 Opus，主对话最终把关。具体型号和档位以模型清单为准。

**三种宿主怎样派**
- Claude：自己的子代理用 Agent 类型选档；Sol、Luna 无需另授权；Astra 按对话或项目授权，GPT 都经包装器写明型号和档位。
- Codex 的 GPT 主对话：用原生子代理，写明型号和档位，核对实际启动值。
- Codex 的别家主模型：用 openai_child，只派 Sol、Luna，不派 Astra。

跳到：〔要不要派〕〔派谁、花多少〕〔按风险定复核深浅〕〔多个任务同时改东西〕

Claude 和 GPT 在整套系统里的搭配：〔在整套系统里的分工 → 怎么协作〕

〔现行型号、档位和分工 → 怎么协作〕

::screen{#rule-execution-coordination-02 section="points"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-02",
  "section": "points",
  "title": "人话要点：要不要派、派谁、复核深浅",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“要不要派”配一只举起又放下的手、“派谁、花多少”配一架小天平一边是齿轮一边是硬币、“按风险决定复核深浅”配一只放大镜照着一页纸，纸边画三格由浅到深的绿色小刻度。卡片里每条要点前一个小绿圆点，正文深蓝灰。三张卡排成三列等宽，高度按内容；三张卡底边对齐，卡片下方留一条窄窄的水彩叶子装饰带。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，卡片内文字和横版完全一样；最下面水彩叶子装饰带。",
  "links": [
   {
    "text": "约法 L22",
    "href": "/rules/charter/#L22"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   }
  ],
  "anchors": [
   {
    "id": "p-whether",
    "text": "要不要派"
   },
   {
    "id": "p-choose",
    "text": "派谁、花多少"
   },
   {
    "id": "p-review",
    "text": "按风险决定复核深浅"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点·派子代理的原则"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "要不要派"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“要不要派”配一只举起又放下的手、“派谁、花多少”配一架小天平一边是齿轮一边是硬币、“重大的事独立复核”配一只放大镜照着一页纸。卡片里每条要点前一个小绿圆点，正文深蓝灰。三张卡排成三列等宽，高度按内容；三张卡底边对齐，卡片下方留一条窄窄的水彩叶子装饰带。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点·派子代理的原则"
    },
    {
     "type": "points_card",
     "columns": 3,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "要不要派"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版 9:16：标题在上，三张卡片从上到下一张一条、整宽，卡片内文字和横版完全一样；最下面水彩叶子装饰带。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
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
   "source_phrase": "一只举起又放下的手、“派谁、花多少”配一架小天平一边是齿轮一边是硬币、“重大的事独立复核”配一只放大镜照着一页纸",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
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
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-3d5456ab77b501b1bfa1.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-rule-execution-coordination-02-h\\round-01\\candidate-1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-3d5456ab77b501b1bfa1",
   "title_text": "人话要点 · 派子代理的原则",
   "sha256": "4e37331bf0d9de9695c7a6dcb112cbe15d6711e1289e0c47802f1013c1734535",
   "status": "ready",
   "source_box": [
    37,
    22,
    1002,
    182
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 派子代理的原则

### 要不要派
- 主对话管想和把关：战略、头脑风暴、抽查、质量检查和最终成品。
- 具体活派出去做完送回来；只有整段一两步的小事顺手做。
- 看整段目的和总量，不看每次操作多容易；50 张截图不能拆成 50 件小事。
- 相关动作合成一单，一次交代清楚；只有判断或一两步的整件事，零个子代理也正常。

### 派谁、花多少
- 先按成品选人：能用就行的，交能胜任里最划算的；要惊艳的，样板和关键部分交做得最好的亲手做。
- 谁能胜任、谁做得最好，只看厂商数据和 AA（权威评测）；不自己测，也不拿本人说的强弱作证。
- 档位按剩下的真实难点选；质量需要时，子代理可以比主对话更强，不用每次问本人。
- 算今后的总投入：自己做要花的执行、验证和返工，对比派出去要花的交代、重建上下文、来回沟通、审阅整合和返工；已经花掉的不算。
- 每次派都写明型号和档位，不让子代理悄悄沿用主对话的设置；GPT-6.1 Sol 只读、步骤简单、代码上限为 0 的小单用 medium，施工、要判断的分析和难活用 ultra；Luna 用最高 max，照写好的提示生图、落盘才用 low；派完核对实际启动的型号和档位。

### 按风险决定复核深浅
- 主持先看改动、测试和实际使用结果，判断坏了会怎样、能否撤回、测试能证明多少、影响面多大（〔约法 L22〕）。
- 小而可撤回、测试与实际运行能证明对错的改动，由主持验收；每轮都用的 Hook、入口、共用组件或难发现的故障，聚焦查本次风险。
- 会泄密、把本人锁在外面、丢唯一数据或产生不可逆后果的改动，以及重大设计和决定，完整独立复核。计划写一行本次档次和理由；本人随时可改。
- 给本人拿去做决定的推荐、取舍、计划类汇报，交本人前用 Astra 独立复核断言有没有证据撑住、偏好有没有推过头；派 Astra 前每次先问本人，本人没给长期授权，不同意就不派，也不改派 Sol 做这项复核。
- 给复核者本单必要的事实、约束和改动本身；主持先理解本人原话，分清哪些是已核实的事实、未知和派活一方的推断，不附原话清单，不预设结论。
- 复核者先独立形成意见，给出证据、反例或会失败的路径；没有实质问题就直说，不为凑问题去改东西。
- 复核问题修好，只复查受影响处；后续按这次风险和已有测试决定范围，不每次重审全项目。
- 复核不是重大动作前的“把关”：把关只管动手前这一步做不做、要不要请本人验证，见〔重大动作与本人验证〕。

::screen{#rule-execution-coordination-03 section="points"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-03",
  "section": "points",
  "title": "人话要点：交代与交付、全局规则只引用、本人的限制、模型清单",
  "scene": "横版 16:9。本屏没有“## …”大标题，直接从卡片开始。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“怎么交代、怎么交付”配一张写满字的任务卡和一支笔、“全局规则只引用，资料锁着时不凑”配一本合着的规则书上夹一张指路小纸条、“本人的限制优先”配一道小栅栏门、“可派模型清单”配一块挂着几个名牌的小木板、“改动与花费成比例”配一把小尺子旁边一只小沙漏。卡片里每条要点前一个小绿圆点，正文深蓝灰，“够用就停”四个字照原样粗体。五张卡排成两行：第一行三张“怎么交代、怎么交付”“全局规则只引用，资料锁着时不凑”“本人的限制优先”等宽；第二行两张“可派模型清单”“改动与花费成比例”等宽，占满整行，不留空位。“型号与派法”链接和“本网站专用分工”这两段放在五张卡片下面一个浅绿底的小框里，框左边画三个品牌标志：Claude 的橙色星芒、OpenAI 的黑色花结、Codex 的终端小图标。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：本屏没有大标题；五张卡片从上到下一张一条、整宽，顺序：怎么交代、怎么交付；全局规则只引用，资料锁着时不凑；本人的限制优先；可派模型清单；改动与花费成比例。“型号与派法”链接和“本网站专用分工”小框放最后，三个品牌标志排在小框上沿。字和横版完全一样；字多时在完整卡片之间拆屏：-v 放前三张卡，-v2 放后两张卡和小框。",
  "links": [
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   },
   {
    "text": "公开分级表",
    "href": "/rules/privacy-data/#p-classification",
    "locator_instances": {
     "v": {
      "input_sha256": "e64ddd7aa89901c7845dbf358c35baa137da4fe48b3c26eb97673d98ba6a7657",
      "instances": [
       {
        "context_text": "对外发布）的，交代子代理先读公开分级表",
        "context_rect": [
         109,
         2265,
         829,
         2303
        ],
        "expected_rect": [
         616,
         2268,
         829,
         2302
        ]
       }
      ]
     }
    },
    "orientations": [
     "v"
    ]
   },
   {
    "text": "约法 L18",
    "href": "/rules/charter/#L18",
    "locator_instances": {
     "v": {
      "input_sha256": "e64ddd7aa89901c7845dbf358c35baa137da4fe48b3c26eb97673d98ba6a7657",
      "instances": [
       {
        "context_text": "交回，主对话按约法L18请本人验证，解锁后",
        "context_rect": [
         109,
         2547,
         867,
         2584
        ],
        "expected_rect": [
         370,
         2550,
         543,
         2584
        ]
       },
       {
        "context_text": "缺什么交回，不用已知事实凑、不降级回答（约法L18。",
        "context_rect": [
         94,
         3016,
         758,
         3048
        ],
        "expected_rect": [
         604,
         3020,
         735,
         3048
        ]
       }
      ]
     }
    },
    "orientations": [
     "v"
    ]
   },
   {
    "text": "约法 L23",
    "href": "/rules/charter/#L23"
   },
   {
    "text": "型号与派法",
    "href": "/rules/execution-coordination/#p-model-table"
   }
  ],
  "anchors": [
   {
    "id": "p-brief",
    "text": "怎么交代、怎么交付"
   },
   {
    "id": "p-cite-rules",
    "text": "全局规则只引用，资料锁着时不凑"
   },
   {
    "id": "p-owner-limits",
    "text": "本人的限制优先"
   },
   {
    "id": "p-roster",
    "text": "可派模型清单"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "怎么交代、怎么交付",
     "header_icon": [
      "_library/fix-round-2/icon-clean-2d7996732dca21311fe1.png"
     ],
     "row": "cards",
     "width": "33.33%"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "全局规则只引用，资料锁着时不凑",
     "header_icon": [
      "_library/fix-round-2/icon-clean-335cc1ba09973e3c57cd.png"
     ],
     "row": "cards"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "本人的限制优先",
     "header_icon": [
      "_library/fix-round-2/icon-clean-f007fef9844a5e7dde84.png"
     ],
     "row": "cards",
     "width": "33.33%"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "可派模型清单",
     "header_icon": [
      "_library/fix-round-2/icon-clean-b9fb21fad9f1e0ed18a6.png"
     ],
     "row": "cards"
    },
    {
     "type": "notice",
     "text_ref": "完整型号、按场景的档位与三种宿主派法，统一见本页型号与派",
     "row": "cards"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "改动与花费成比例",
     "header_icon": [
      "_library/icons/秒表.png"
     ],
     "row": "cards",
     "width": "33.33%"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版 16:9。本屏没有“## …”大标题，直接从卡片开始。圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“怎么交代、怎么交付”配一张写满字的任务卡和一支笔、“全局规则只引用，资料锁着时不凑”配一本合着的规则书上夹一张指路小纸条、“本人的限制优先”配一道小栅栏门、“可派模型清单”配一块挂着几个名牌的小木板、“改动与花费成比例”配已有秒表图标。卡片里每条要点前一个小绿圆点，正文深蓝灰，“够用就停”四个字照原样粗体。五张卡排成三列：左列上下两张“怎么交代、怎么交付”“全局规则只引用，资料锁着时不凑”；中列上下两张“本人的限制优先”“可派模型清单”；右列一张高卡“改动与花费成比例”。“型号与派法”链接和“本网站专用分工”这两段放在中列卡片下面一个浅绿底的小框里，框左边画三个品牌标志：Claude 的橙色星芒、OpenAI 的黑色花结、Codex 的终端小图标。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。；五卡显式绑定真实资产，前四张沿用原图标，第五张使用已有秒表；同名row按width开启三栏，仅各栏首卡为33.33%，后续无width块在本栏纵排，中栏说明框紧接模型清单；右栏独立卡使用现有等高行。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "怎么交代、怎么交付",
     "header_icon": [
      "_library/fix-round-2/icon-clean-2d7996732dca21311fe1.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "全局规则只引用，资料锁着时不凑",
     "header_icon": [
      "_library/fix-round-2/icon-clean-335cc1ba09973e3c57cd.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "本人的限制优先",
     "header_icon": [
      "_library/fix-round-2/icon-clean-f007fef9844a5e7dde84.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "可派模型清单",
     "header_icon": [
      "_library/fix-round-2/icon-clean-b9fb21fad9f1e0ed18a6.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "改动与花费成比例",
     "header_icon": [
      "_library/icons/秒表.png"
     ]
    },
    {
     "type": "notice",
     "text_ref": "完整型号、按场景的档位与三种宿主派法，统一见本页型号与派"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版 9:16：本屏没有大标题；五张卡片从上到下一张一条、整宽，顺序：怎么交代、怎么交付；全局规则只引用，资料锁着时不凑；本人的限制优先；可派模型清单；改动与花费成比例。“型号与派法”链接和“本网站专用分工”小框放最后，三个品牌标志排在小框上沿。字和横版完全一样；字多时在完整卡片之间拆屏：-v 放前三张卡，-v2 放后两张卡和小框。；五卡显式绑定真实资产，前四张沿用原图标，第五张使用已有秒表；去掉旧row/50%压列，逐卡整宽，沿用split_cards=false和现有完整卡边界自然分页，不新增分页功能。"
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
   "asset": "_library/icons/闸门.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "闸门",
   "source_phrase": "一张写满字的任务卡和一支笔、“全局规则只引用，资料锁着时不凑”配一本合着的规则书上夹一张指路小纸条、“本人的限制优先”配一道小栅栏门、“可派模型清单”配一块挂着几个名牌的小木板",
   "sha256": "eee93d6e0a2d4999039530b2ce668ce4beebb63c2370a8befee8c33aa87b4ae5",
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
   "source_phrase": "",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  }
 ]
}
```

### 怎么交代、怎么交付
- 一次交代清楚：只给本单必要的目标、事实、授权范围、测试上限和怎么验收，用中文、说人话；所有型号用同一标准。
- 出处由主对话负责：写派单时分清本人原话和 AI 补充，本会话已存下的原话也算出处，标“本人原话（待归位）”；派活不附原话清单、要求表或相关决定。子代理照派单做，不查出处、不报“无出处”，只交回任务里的实质冲突和未知。
- 子代理只按授权、派单范围、测试上限和验收方式交付，做完就汇报结束；不额外加检查、诊断、扩展取证、原话审计、重复改写或无关汇报。测试上限为 0 就不写测试，已有验证够用就停；范围外的发现只写一句建议。派单里的动作可能删数据、越权或造成损失时，停下这一步交回主对话。
- 不灌全部历史，也不替子代理写死每一步；它只查派单要求的内容。
- 遇到关键事实冲突或超出范围的决定，子代理带着证据回来问。
- 交付时分清已核实的事实和推断，带上结果、实际做过的验证、有分量的反面证据和没解决的风险。
- 用了什么型号、别人说了“同意”，都证明不了结果是对的。

### 全局规则只引用，资料锁着时不凑
- 派活说明和项目说明里，公开范围、个人资料锁、授权这类全局规则只写引用，例如“公开范围按约法 L20 和《个人资料与数据处理》的公开分级表”，让子代理自己去读原文。
- 不写自己的摘要或改写版，也不照抄决定记录里的旧说法：旧决定可能已被取代，以现行规则为准。
- 要写成公开内容（网站、GitHub 主页、公开仓库、对外发布）的，交代子代理先读〔公开分级表〕原文再判断。
- 规则由根会话核验：原生派发前根核验，经包装器派的在启动和续作时由包装器自动核验；派单给出通过的版本和专题路径，子代理按需读专题，不自己核验、不通读根规则。
- 资料需求判断和解锁只由根会话负责：派活前需要资料就先请本人验证，解锁后再派。子代理不自己判断或发起验证；只在读取被拦、途中缺资料或到期时，单行交回“需要本人资料：……”，由根会话补解锁、按缺口重派或补做。
- 只为举例不算需要：公开内容里的例子可以是假设的，或直接用亮点，不为找真实例子去读私人资料；假设的例子也不写成真发生过。
- 派活说明里固定写这一句：“需要本人私人资料而资料锁着时，不自己发起解锁，只写明缺什么交回（汇报里单列一行“需要本人资料：……”），不用已知事实凑、不降级回答（约法 L18）。”经 GPT 包装器派的，包装器会自动带上这一句，不用再写。

### 本人的限制优先
- 本人明确限定的型号、厂商、档位或预算，子代理和它再派出的都照样遵守，谁也不能自己放宽。
- 子代理的业务范围和授权只能比派它的一方窄，见〔用户授权〕。

### 可派模型清单
- 各家现在能派哪些型号、各适合什么活，列在一份模型清单里；它只作参考，不当门禁。
- 清单怎么更新、本人定过的型号限制，以〔约法 L23〕为准：本人说有新型号，AI 查厂商数据和权威评测，按需更新、直接生效。授权、预算仍先问本人；Claude 暂不派 Fable 5.1，新 Fable 同样按数据判断；Codex 主对话用别家模型时仍不派 Astra。
- 模型能力只凭厂商公布的数据和 AA 等权威评测，不在本机试跑比较。先弄清评测考什么，再和现用选择比；惊艳类还看审美和成品质量。AA 没数据时先按厂商数据暂定，数据够就定稿；AA 出数据后短复核。宿主支不支持、实际派出型号和运行快慢，照真实记录；没有数据就说明缺口。
- 某个项目专用的分工只在那个项目里适用，不自动变成全局默认。

### 改动与花费成比例
- 派活写死文件范围、代码与测试上限和时限，不写“修好”“做完整”这类没有边的目标；时限只算干活的时间，网络波动、模型满载重试、等额度恢复的时间不算；到点交回已做的和卡在哪，不自动延期，由根会话调整范围或做法、定好新时限再接着做。
- 交付先看加了几行、删了几行，超预算退回改小；测试按需：已有测试兜得住就不加，只覆盖会改变结果的关键路径，全站、全量检查留到发布前一次。
- Sol 只接方案、范围、文件和预算都已定的施工；架构、跨模块、开放问题和取舍，先交有授权的 Astra 或 Claude Opus 定。
- **够用就停**：能直接答的不查；要查证先找官方文档、已有研究、日志和回执。权威评测、厂商和媒体的可靠资料可以采信，不因“没亲眼看见”非要自己验；选模型只看权威评测和厂商数据，不自己实测。
- 只有查不到可靠资料、实测结果又会改变决定时才实测，动手或派单前写明会改变哪个决定、预计花多少额度、流量和时间；证据够说明结果就停，不为“完整证明”重建、穷举，也不重跑已经通过的部分。
- 新做法替换旧实现时，同一次改动里移走旧的，不留两套；汇报写几行，证据只给路径。

完整型号、按场景的档位与三种宿主派法，统一见本页〔型号与派法〕。Claude 能直接派 Sol、Luna；Astra 仍按本人给对话或项目的授权。

**本网站专用分工**：照写好的提示交 GPT-6 Luna low 画、落盘，GPT-6.1 Sol ultra 审；只适用于本项目。通用任务也只有照写好的提示生图、落盘用 Luna low，其他活用最高 max。

::screen{#rule-execution-coordination-04 section="points"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-04",
  "section": "points",
  "title": "人话要点：主对话的责任、两家协作、故障额度、新开对话",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“主对话的责任”配一个拿着清单打勾的小人、“Claude 和 GPT 一起干时”配 Claude 橙色星芒和 OpenAI 黑色花结两个标志并排握手、“快速模式、故障和额度”配一个电量回满的小电池、“什么时候新开对话”配一个新打开的对话气泡。卡片里每条要点前一个小绿圆点，正文深蓝灰。四张卡排成两行两列：上行左“主对话的责任”、右“Claude 和 GPT 一起干时”（这张最长，可以比左边高）；下行左“快速模式、故障和额度”、右“什么时候新开对话”。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。（g4 补充）“主对话的责任”卡现在多了接力成品、盯到交付、叫停后确认三处，比“Claude 和 GPT 一起干时”还长；两行两列的排法不变，上行两张卡高度按较长的一张，下行“什么时候新开对话”也多了一条满槽的说明，卡高按内容，不留大块空白。",
  "portrait": "竖版 9:16：四张卡片从上到下一张一条、整宽，顺序同横版（先左后右、先上后下）。字和横版完全一样。",
  "links": [
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   }
  ],
  "anchors": [
   {
    "id": "p-root",
    "text": "主对话的责任"
   },
   {
    "id": "p-claude-gpt",
    "text": "Claude 和 GPT 一起干时"
   },
   {
    "id": "p-recovery",
    "text": "快速模式、故障和额度"
   },
   {
    "id": "p-new-task",
    "text": "什么时候新开对话"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 2,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "主对话的责任"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "Claude 和 GPT 一起干时"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "快速模式、故障和额度",
     "row": "details",
     "width": "50%"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "什么时候新开对话",
     "row": "details",
     "width": "50%"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“主对话的责任”配一个拿着清单打勾的小人、“Claude 和 GPT 一起干时”配 Claude 橙色星芒和 OpenAI 黑色花结两个标志并排握手、“快速模式、故障和额度”配一个电量回满的小电池、“什么时候新开对话”配一个新打开的对话气泡。卡片里每条要点前一个小绿圆点，正文深蓝灰。四张卡排成两行两列：上行左“主对话的责任”、右“Claude 和 GPT 一起干时”（这张最长，可以比左边高）；下行左“快速模式、故障和额度”、右“什么时候新开对话”。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。（g4 补充）“主对话的责任”卡现在多了接力成品、盯到交付、叫停后确认三处，比“Claude 和 GPT 一起干时”还长；两行两列的排法不变，上行两张卡高度按较长的一张，下行“什么时候新开对话”也多了一条满槽的说明，卡高按内容，不留大块空白。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。\n10 月 11 日空白修：“Claude 和 GPT 一起干时”改整宽一张，下面“快速模式”“新开对话”两张各占一半，避免三栏不等高留空。"
  },
  "v": {
   "blocks": [
    {
     "type": "points_card",
     "columns": 2,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "主对话的责任"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版 9:16：四张卡片从上到下一张一条、整宽，顺序同横版（先左后右、先上后下）。字和横版完全一样。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
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
   "source_phrase": "一个拿着清单打勾的小人、“Claude 和 GPT 一起干时”配 Claude 橙色星芒和 OpenAI 黑色花结两个标志并排握手、“快速模式、故障和额度”配一个电量回满的小电池、“什么时候新开对话”配一个新打开的对话气泡",
   "sha256": "1ce8251fc7f1c135f39a832485a5a310cd19efbcee4363ecf3b88e28763ef482",
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
   "source_phrase": "",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  }
 ]
}
```

### 主对话的责任
- 派 GPT 子任务后，主对话按时限和风险，或在它报风险、卡住、需要纠偏时，看它已有的进度摘要（几分钟一两句），不看逐字推理流；不要求它额外报进度，也不给只读小单加固定检查。验收只核对派单要的结果和规定的验证。只读新增部分，共享读取、读完就关，不锁住它的日志；方向错及时纠正，没问题不打扰。Claude 子代理看不看由主持定。
- 主对话管战略、头脑风暴、抽查、QA（质量检查）和最终把关；具体活派出去，一两步小事顺手做，惊艳类样板和关键部分可以亲手做。
- 几段接力做同一个成品（写、画、审、拼）时，由主对话或指定的一个人对成品负责，亲自在真正用的地方看整体，截图、录屏可以派人采好送来；各段自查代替不了。先做完整样板再批量，共用规格只写一处；惊艳类在样板定稿前、交付前各一轮头脑风暴，主持的最后拿主意。
- 派出去以后接着做不冲突的事，不空等；但后台还有子任务时要一直盯到交付：每次等候返回后还在跑就接着等；快到时限时先让它交已有结果，由主对话调整范围或做法、定好新时限再延长，不自动延期；不能因为后台还在跑就结束主任务。
- 子代理创建成功只说明任务发出去了，不说明做完了；它交回的结果由主对话核对。
- 做错看主对话验收事实：缺材料或工具出错先补，在原线程、原档位接着做；有明确的错、也知道怎么改，就带反例和验收要求用 Steer（运行中纠偏）或在原线程 Resume（续作）就地改，不从头重做；只有会造成损失、越权或本人明确叫停时才 Stop，任务还要继续的同时安排接手；同一关键错再犯、方案被推翻或难度变了才换人。两家都失败再用一次 max；只缺本人材料、取舍或授权就直接问。
- 本人叫停主任务时，已知的子代理和后台任务一起停掉，再查一遍确认真停了。执行者中途没了，先看已有成果和汇报，再在原任务上接着做。

### Claude 和 GPT 一起干时
- Claude 主持时，按成品要求想和把关，也亲手做场景表交它的惊艳类样板和关键部分；本人定过由 Claude 写的成品、分析、文案、正式文书和对本人的理解照旧。
- 施工、采集、按清单审查和核对执行者汇报照场景表派；GPT 可以提清单外的实质问题，出主意时给原始材料，不先写死结论。
- Claude 抽查风险和看最终成品，GPT 交完整材料清单；Claude 也可自己挑没被推荐的样本。
- Codex 单独主持的任务，由它的主对话负同样的最终责任，不拿以前的分工当理由去等 Claude。
- 事实报告可以当证据用，但产品是不是真满足需求，仍要验收。
- 分工按成品要求，哪边额度多都不改；GPT 额度少，Claude 自己施工；Claude 额度少，由它判断等重置还是抽查后现在交付。只用一边时，那边既把关也施工，不查全部账号额度。
- Claude 因自身硬限制做不了本人已授权的某一步（例如删除清理、往网页填银行卡这类金融信息）时，不以“我做不了”结束，也不推给本人亲手做：先做完能做的部分，提醒本人可以交给 Codex 接着做，并附一条可复制的提示词，写清精确对象（路径、网址、页面栏目）、依据、已有进度和剩余动作、授权来源和做完怎么核对。提示词由本人复制粘贴给 Codex，不自动发到另一个聊天；Codex 按自己的规则做完，本人把结果回传，Claude 回读核对再接着做。这不扩大任何一方的授权。
- Claude 派 GPT 的具体入口见〔Claude 适配〕。

### 快速模式、故障和额度
- 没有本人许可，不开 fast 快速模式。
- 出故障后先核对并接回被打断的任务；排查可以另外并行做。
- 同一份 Codex 额度下，主对话还能正常用、只有子代理报额度用完时，立即在原任务上接着做，不等恢复（Claude 默认不这样接）。真的都用完了、或确认不了主对话还能用时才等；恢复后还有价值的原任务在原对话接着做，并告诉本人额度已恢复、任务已继续，不另起替身。
- 要换上下文时，先核对原任务真实做到哪，交接或停掉以后再安排，不重复做。

### 什么时候新开对话
- 只有确实有独立的成果和责任，才新开一个顶层任务（新对话）；项目多、活多、能同时开的名额满了都不是理由。
- 子代理名额真满了，Codex 自动改用 GPT 包装器接着派，仍是原主对话管的后台任务，型号、范围和授权都不放宽；登录、参数、网络这类故障先修真正的原因，不当成满了。拿不准刚才派没派出去，先查清，已经启动就接回来，不重派一份。
- AI 新开的对话默认不挂到任何已保存的项目下，本人指定项目时除外。

::screen{#rule-execution-coordination-05 section="points"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-05",
  "section": "points",
  "title": "人话要点：多个任务同时改东西",
  "scene": "横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“各用各的工作副本”配三张并排的小工作台各摊一份蓝图、“单点动作前加一把短锁”配挂钩上的黄铜钥匙和小沙漏（和开头插画同一把）、“不动别人的东西”配一个贴着别人名牌的小纸箱、“停下时留好接续状态”配一张夹在书里的书签。卡片里每条要点前一个小绿圆点，正文深蓝灰。上行两张大卡：左“各用各的工作副本”、右“单点动作前加一把短锁”；下行两张窄一点的卡：左“不动别人的东西”、右“停下时留好接续状态”。E:\\.agents、E:\\PCConfig、Move-TaskItemToRecycleBin.ps1 -AllowLinkedWorktree、git worktree remove、git add .、finally 这几处用等宽字体、浅绿底小框，其余字照常。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。",
  "portrait": "竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/#p-cleanup"
   }
  ],
  "anchors": [
   {
    "id": "p-parallel",
    "text": "多个任务同时改东西"
   },
   {
    "id": "p-worktree",
    "text": "各用各的工作副本"
   },
   {
    "id": "p-lock",
    "text": "单点动作前加一把短锁"
   },
   {
    "id": "p-others",
    "text": "不动别人的东西"
   },
   {
    "id": "p-handoff",
    "text": "停下时留好接续状态"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "points",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点·多个任务同时改东西"
    },
    {
     "type": "points_card",
     "columns": 2,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "各用各的工作副本"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版 16:9。左上一行深绿大字是本屏的“## …”标题（井号不画）。下面是圆角卡片（白底、浅绿细边），每个“### …”小标题一张卡，小标题画在卡片顶上一条浅绿底色带里、深绿粗体，井号不画；卡片左上角一个小水彩图标：“各用各的工作副本”配三张并排的小工作台各摊一份蓝图、“单点动作前加一把短锁”配挂钩上的黄铜钥匙和小沙漏（和开头插画同一把）、“不动别人的东西”配一个贴着别人名牌的小纸箱、“停下时留好接续状态”配一张夹在书里的书签。卡片里每条要点前一个小绿圆点，正文深蓝灰。上行两张大卡：左“各用各的工作副本”、右“单点动作前加一把短锁”；下行两张窄一点的卡：左“不动别人的东西”、右“停下时留好接续状态”。E:\\.agents、E:\\PCConfig、Move-TaskItemToRecycleBin.ps1 -AllowLinkedWorktree、git worktree remove、git add .、finally 这几处用等宽字体、浅绿底小框，其余字照常。〔〕里的字画成绿色下划线加小箭头的链接样式。不画编号，不加要点以外的字。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "人话要点·多个任务同时改东西"
    },
    {
     "type": "points_card",
     "columns": 2,
     "split_cards": false,
     "illustration": "left_inside",
     "icon_position": "header_left",
     "icons": "auto",
     "text_ref": "各用各的工作副本"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版 9:16：标题在上，四张卡片从上到下一张一条、整宽，顺序同横版。字和横版完全一样。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。"
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "三张并排的小工作台各摊一份蓝图、“单点动作前加一把短锁”配挂钩上的黄铜钥匙和小沙漏（和开头插画同一把）、“不动别人的东西”配一个贴着别人名牌的小纸箱、“停下时留好接续状态”配一张夹在书里的书签",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/rule-execution-coordination-05-brush-v2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-execution-coordination\\img\\rule-execution-coordination-05-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-961dbc324ba66f0f1c7e",
   "title_text": "人话要点 · 多个任务同时改东西",
   "sha256": "8c522658f3342e3f56ccd2dbc667fe2366a71eaf0a91e06f8232614d6755a1b8",
   "status": "ready",
   "source_box": [
    36,
    100,
    902,
    222
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 人话要点 · 多个任务同时改东西

### 各用各的工作副本
- 每个任务在自己的工作副本里改，验证后自己合并回默认分支并推送。
- 合并遇到冲突，先弄懂对方的改动再整合，不覆盖。
- 合并、推送、读回确认以后，把计划任务或技能直接在用的那份目录（原文叫“活动检出”，例如 E:\.agents、E:\PCConfig）快进到最新提交；那里有别人没提交的改动、快进不了时，不动它，并说明。
- 最后清理本任务已经合并回去、又没有未提交改动的工作副本（按〔工程与交付〕的清理入口）：可以用 git worktree remove <精确路径> 直接删除，也可以用 Move-TaskItemToRecycleBin.ps1 -AllowLinkedWorktree 回收；选回收时，工具确认回收站里确实收到了，再清掉这个副本在 Git 里的登记。
- 别的任务留下、目录已经不在的工作副本登记，回收工具顺带清掉：只删登记，分支和提交都还在。盘没接上，或者脱离分支的提交清了就找不到时，工具拒绝；这时先把提交挂到一个分支上再清，盘没接上就留着。
- 只读查看和跑测试，不用单开工作副本。

### 单点动作前加一把短锁
- 安装或升级软件、发布规则、改计划任务这类会互相影响的动作，动手前用 E:\.agents 里的短锁工具领锁（原文示例领 30 分钟，工具默认也是 30 分钟），做完马上释放。
- 同一种动作共用一个清楚、固定的锁名；持有人写清是哪个 AI（Codex 还是 Claude）和真实任务号。
- 先看锁的现状，领到了才动手；别人的有效锁还在时，等它结束或先核对情况，不抢。
- 要续期就由同一持有人再领一次；结束时写在 finally 里释放，不管成没成功都放掉。
- 短锁只防同时撞车，不给本人没给过的权限。
- 要用别的任务的产物时，说清等的是哪个提交、回执或文件，只有用到它的那一步等；源码接线、局部验证、合并预演这类准备照常先做，不把整单挂起“等某任务做完”。短锁也只锁那一下单点动作，不锁准备。

### 不动别人的东西
- 保留其他任务的改动和没提交的内容，不用 git add . 一把全加。
- 不从标题、目录或历史推断某处归自己。

### 停下时留好接续状态
- 没做完就停时，写清在哪个工作副本或分支、做到哪、还差什么，让后来的任务能接着做。

::screen{#rule-execution-coordination-06 section="original"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-06",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.execution-coordination.md",
   "release": "E280",
   "sha256": "4a769967b758b3c674f6ad8ad4dff87c16430c4942e98b168d4bbaa5620e2197",
   "public_sha256": "b3f5f48f7a5e267c2b79bd5d7e9f5739321e5df9c3406bfb789071589fb3f928",
   "from": null,
   "to": "## 改动与花费成比例",
   "start": 0,
   "end": 4302,
   "approved_omissions": []
  },
  "title": "原文（一）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“1.”到“8.”的编号照画；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 分工与并行施工”到第 5 条结束；右卡放第 6 条、第 7 条、第 8 条和“根会话负责战略……”那一段。",
  "portrait": "竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。",
  "links": [
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "用户授权",
    "href": "/rules/authorization/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-execution-coordination/rule-execution-coordination-06",
  "source_logical_id": "execution_coordination_contract",
  "source_public_sha256": "b3f5f48f7a5e267c2b79bd5d7e9f5739321e5df9c3406bfb789071589fb3f928",
  "source_rule_part": "rule-execution-coordination/rule-execution-coordination-06"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "原文·E280版，一字不改"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "分工与并行施工"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "一次交代清楚"
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E214 版，一字不改”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“1.”到“8.”的编号照画；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放从“# 分工与并行施工”到第 5 条结束；右卡放第 6 条、第 7 条、第 8 条和“根会话负责战略……”那一段。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；E214 对齐：使用真实 source_text_card，按完整编号条目分卡；供网站提取 ct-source-body，保留原顺序与原文链接。；E215新增Luna生图low例外后，原文两栏等高，避免增加同排底边高差；原文和分栏边界不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "原文·E280版，一字不改"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "分工与并行施工"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "一次交代清楚",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "接力做一样成品，要有一个人对整体负责",
     "page_break_before": true
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版 9:16：左上小字在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样；字多，行距紧一点但不挤。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；E214 对齐：使用真实 source_text_card，按完整编号条目分卡；供网站提取 ct-source-body，保留原顺序与原文链接。"
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
   "asset": "_library/titles/title-5002849d46891c01a050.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5002849d46891c01a050",
   "title_text": "分工与并行施工",
   "sha256": "23b61c8358a5a092232dbf3bef0bae942902a222680a49f50cca19c3658baff4",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "rule-execution-coordination/rule-execution-coordination-06-title-02.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-execution-coordination\\img\\rule-execution-coordination-06-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7d9f97dd5ba6c2f97759",
   "title_text": "派子代理的原则",
   "sha256": "6804cb8fc7d135e71cf5829627f289f976ca0e9ffc144877b5087319a20e3c28",
   "status": "ready",
   "source_box": [
    209,
    344,
    448,
    387
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E280 版，一字不改

# 分工与并行施工

owner: `E:\.agents`

这里是 Codex 和 Claude 共用的分工原则：要不要派子代理、怎么派、多个任务同时改东西时怎么不互相踩。两个宿主各自的调用方式只在各自适配专题里补充几行。

## 派子代理的原则

所有子代理由根会话总控，只按授权、派单范围、测试上限和验收方式交付，完成即汇报结束；不增加检查、诊断、扩展取证、原话审计、重复改写或无关汇报。测试上限为 0 时不写测试，已有验证够用就停；范围外发现只写一句建议。派单动作可能删数据、越权或造成损失时，停下该动作并交回根会话。

出处由根会话负责：写派单时区分本人原话与 AI 补充，已存本会话原话也算出处，标“本人原话（待归位）”。派活不附原话清单、要求表或相关决定；子代理照派单做，不查出处、不报“无出处”，只交回任务中的实质冲突和未知。

1. **主持的想和把关，活派出去做**（约法 L22）。主持的根会话管战略、头脑风暴、抽查、QA 和最后以人的角度看成品；具体的活派子代理做完、把结果送回来看，哪怕自己做也很快。只有整段活一两步就完的小事（看一个文件、改一句话、记一条本人决定）顺手做：看整段的目的和总量，不看单次操作多容易，50 张截图不是 50 件小事。相关的动作合成一单、一次交代清楚，不一个点击派一次。0 个子代理也正常：整件事只需要判断，或者本来就一两步。
2. **按成品和公开数据选人，能胜任的最低一档就够。** 计划注明成品是“要惊艳”（人眼判断好坏）还是“能用就行”（测试、报错可判断），本人可改。前者样板和关键部分交最好的，其余照样板铺开；后者交最划算的，机械活交最便宜的。只用厂商、AA 等权威评测判断能力，不本机试跑比较、不用本人强弱印象作依据（约法 L22）；当前选择见模型清单 `routing`。按剩余难点选档位，需要时可高于根会话，不逐次问。
   给人看的图、地图和示意图属于“要惊艳的关键部分”，样板交公开评测最好的模型，做法见 推荐流程（`E:/.agents/skills/report-page/references/decision-reports.md`）。
3. **别浪费额度。** 算未来的总投入：自己做要花的执行、验证和返工，对比委派要花的交代、上下文重建、来回沟通、审阅集成和返工。已经花掉的不算。
4. **每次显式写型号和档位，派完核对实际值。** 按模型清单（`E:/.agents/config/model-roster.json`） `routing.effort_rule` 选择，旧档位映射也只查清单。换代按约法 L23 和“新型号怎么调研”重评，不沿用旧型号设置。
5. **复核按本次改动的风险定深浅**（约法 L22）。主持先看改动、相关测试和实际运行验收；代码以能用、能根治、能维护为标准。再看坏了会有什么后果、能否撤回、测试能证明多少、影响面多大，决定不另派、聚焦复核还是完整复核，在计划中用一行写明档次和理由，本人随时可改。
   - **不另派复核。** 测试和实际运行能证明对错、可以撤回、影响面小的改动，由主持验收即可，例如普通脚本和后台的报错修复。
   - **聚焦复核。** 每个会话或每轮都会用到的 Hook、入口、共用组件，或者故障不容易发现的改动，只查计划中列出的风险点，给改动差异和相关上下文，不重审整个项目。
   - **完整复核。** 会导致泄密、把本人锁在外面、丢唯一数据或不可逆后果的改动，包括密码中心（PasswordCenter）、授权、本人验证、资料锁本身，以及有上述后果的迁移和删除；重大设计、规则取舍和决定也这样办。主持先理解本人原话，再给复核者本单必要的事实、约束和改动，分清已核事实、未知和主持的推断，不附原话清单、不预设结论，让它先独立形成意见。

   给本人拿去做决定的推荐、取舍、计划类汇报，交本人前用 Astra 独立复核断言证据和偏好外推；派 Astra 复核前每次先问本人，本人没有给长期授权，不派 Sol 做这项复核，做法见 推荐流程（`E:/.agents/skills/report-page/references/decision-reports.md`）。

   需要复核时，按模型清单的现有换家原则选人，至少用独立的上下文，型号和档位按本次风险与难度选，不写死。只提有证据、反例或失败路径的实质问题，没有就直说，不为凑问题改东西。问题修好后只复查那一处，补上能守住该反例的测试，不重开一轮全项目复核。后续更新按本次变更的风险重定深浅，用已有回归测试守住旧风险；碰到测试守不住的那一处，再做聚焦复核。主持仍负责最终验收。重大动作前的“把关”另按[重大动作与本人验证](/rules/protected-actions/)办理，不受这三档影响。
6. **一次交代清楚。** 所有型号采用同一标准：只给本单必要的目标、事实、授权范围、测试上限和验收方式，用中文说清，不灌历史、不写死每一步。子代理只查派单要求的内容；关键事实冲突或超范围决定连同已有结果和证据交回。交付分清事实与推断，附结果、验证和未解决风险；型号名称和“同意”不证明正确。
7. **根核验规则和判断资料需求，子代理按需读专题。** 原生派发前由根核验，包装器 Start/Resume 机械 Inspect；给出通过版本和专题路径，子代理不自行核验、不通读根规则。公开范围、资料锁和授权只引用现行专题，不写摘要、不沿用决定记录的旧说法；公开内容先读[个人资料与数据处理的公开分级表](/rules/privacy-data/#公开个人数据分级表)原文。

   根派活前判断资料需求，需要时先请本人验证解锁，不先派“只用给定材料”的降级版本。资料期全机共用，子代理从正式入口取用，不重新判断或发起验证；实际被拦、途中缺资料或到期时单列“需要本人资料：<缺什么、为什么>”交回，根解锁后补做，不用已记事实凑、不收降级结论。举例可以用假设或亮点，不为找真实例子读私人资料，不把假设说成真事。派活固定写：“需要本人私人资料而资料锁着时，不自己发起解锁，只写明缺什么交回（汇报里单列一行“需要本人资料：……”），不用已知事实凑、不降级回答（约法 L18）。”GPT 包装器已附带，不重复写。
8. **本人的限制优先。** 本人明确限定的型号、厂商、档位或预算，子代理和后代都照样遵守，不能自己放宽。子代理的业务范围和授权只能比父代理窄（见[用户授权](/rules/authorization/)）。
9. **可派范围看模型清单。** `config/model-roster.json` 列出各宿主现在能派哪些型号、各适合什么活。它只作参考，不当门禁；更新和本人已定的型号限制以约法 L23 为准，新型号按下面“新型号怎么调研”查。项目专用分工只在对应项目内适用，不自动改成全局默认。
10. **接力做一样成品，要有一个人对整体负责。** 几段接力做同一个成品（例如写、画、审、拼）时，由根会话或指定的一个负责人对最终成品负责，亲自看它在真正被使用的地方的整体（截图、录屏可以派人在真实环境里采好送来）：比例、版式、空白、前后是否一致。各段的自查只管自己那段，替代不了成品验收。先做一个从头到尾的完整样板定下规格，再批量做；几段共用的规格（尺寸、字号、版式、禁令）只写一处，各段引用。
11. **盲测。** 本人要盲测、盲调查或盲审时，每个参与者独立做：给同一份事实上下文和本人中途的同一批更正，不给、也不让它去找其他 AI 对同一件事的意见（包括本人粘贴来的）和其他参与者的结果，读取路径要隔开。主持收齐后中立地向本人汇报：各方结论并排、照原意呈现，不替哪一方加减分；主持自己的看法可以提，但单列并标明是主持看法。

根会话负责战略、优先级和最终验收（约法 L22），要惊艳的样板和关键部分可以亲手做；派出去后继续做不冲突的事，不空等。创建成功只说明任务已经发出，不说明做完了；子代理的结果由根会话核对。本人叫停主任务时，一起停掉已知的子代理。

主持按时限和风险，或在风险、卡住、纠偏时看已有思考摘要，不看逐字推理流，不要求额外进度或给只读小单加固定检查。验收只核对派单结果和规定验证。
用 `tools/Get-GptChildDigest.ps1 -RunDirs @('<结果目录>')` 只读新增，按条数和字数上限查看；读子任务日志必须共享读取，读完即关，不能占住文件妨碍写入。
看到方向错及时纠正，没问题不打扰，不为挑毛病去改。

Claude 主持时负责想、把关，以及模型清单交给它的惊艳样板和关键部分；本人指定由 Claude 写的成品、分析、文案、正式法律文书及价值偏好理解照旧。施工、采集和清单审查按场景表派。GPT 可提清单外实质问题；出主意时给原始材料和未定问题，不预设 Claude 答案。抽查由 Claude 定风险，GPT 给完整材料清单，Claude 可自选样本。

本人限制只用一边时由该根会话全程负责：GPT 额度少则 Claude 施工，Claude 额度少则它判断等重置还是抽查后交付；只有 GPT 则由 GPT 主对话把关、按清单选最合适的惊艳执行者，不等 Claude。另一家公开评测优势确实影响结果时说明差别和数据缺口，无数据只说缺口；不为选型查全部账号额度。Claude 派 GPT 的入口见[Claude 适配](/rules/claude-adapter/#派-gpt)。

本人新说的一句只覆盖它明说的那件事，没提到的旧分工照旧，做法见 推荐流程（`E:/.agents/skills/report-page/references/decision-reports.md`）。

未经本人许可，不启用 fast 快速模式。故障后先核对并接回被打断的任务，排查可以另行并行；需要等真实额度恢复的任务，恢复后在原对话继续，并告诉本人额度已恢复、任务已继续，不为恢复额度重建替身。同一 Codex 额度下根会话仍能正常工作、只有子代理报额度耗尽时，按下面的规则立即接续。需要更换上下文时先核对原任务的真实状态，交接或停止后再安排，不重复执行。

新开一个顶层任务（新对话）只在确实有独立的成果和责任时才做；项目多、工作量大或空槽满了都不是理由。AI 新开的顶层对话默认不挂到任何已保存项目下，本人指定项目时除外。

::screen{#rule-execution-coordination-07 section="original"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-07",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.execution-coordination.md",
   "release": "E280",
   "sha256": "4a769967b758b3c674f6ad8ad4dff87c16430c4942e98b168d4bbaa5620e2197",
   "public_sha256": "b3f5f48f7a5e267c2b79bd5d7e9f5739321e5df9c3406bfb789071589fb3f928",
   "from": "## 改动与花费成比例",
   "to": null,
   "start": 4302,
   "end": 10314,
   "approved_omissions": []
  },
  "title": "原文（二）",
  "scene": "横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · E230 版 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“1.”到“8.”的编号照画；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“本人让 Claude 与 GPT 协作时……”“未经本人许可……”“新开一个顶层任务……”三段；右卡放“## 多个任务同时改东西”和它下面的四条。",
  "portrait": "竖版 9:16：“原文 · E230 版 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。",
  "links": [
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/"
   },
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/#原生容量不足时转用共用包装器"
   },
   {
    "text": "Claude 适配",
    "href": "/rules/claude-adapter/#派-gpt"
   },
   {
    "text": "Claude 适配的清理规则",
    "href": "/rules/claude-adapter/#派-gpt"
   },
   {
    "text": "规则发布",
    "href": "/rules/rule-release/"
   },
   {
    "text": "工程与交付的清理入口",
    "href": "/rules/engineering-delivery/#下载临时文件和清理"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "original",
  "reuse": "",
  "source_excerpt_id": "rule-execution-coordination/rule-execution-coordination-07",
  "source_logical_id": "execution_coordination_contract",
  "source_public_sha256": "b3f5f48f7a5e267c2b79bd5d7e9f5739321e5df9c3406bfb789071589fb3f928",
  "source_rule_part": "rule-execution-coordination/rule-execution-coordination-07"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "原文·E280版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "改动与花费成比例",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "原生容量不足与原线程接续",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "一直有人管理到交付",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "新型号怎么调研",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "第三方评测和社区反馈",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "落地和记录",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "改分工的快做法：",
     "body_columns": 1
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "多个任务同时改东西",
     "body_columns": 1
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：横版 16:9，照约法原文样张的版式画：`E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\tests\\rules-text-a.png`。左上角一行小号深绿字“原文 · 续”，下面是正文。正文放在两张并排的大圆角卡片里（白底、浅绿细边），从左卡往右卡接着排。Markdown 的画法：“#”开头的行是页名，“##”开头的行是节标题，画成深绿粗体、井号不画；“1.”到“8.”的编号照画；**…** 是粗体，星号不画；`…` 里的路径和命令用等宽字体、浅绿底小框，反引号不画；〔〕里的字画成绿色下划线加小箭头的链接样式，〔〕不画。原文一字不改，标点照抄，不加任何没给的字。左卡放“本人让 Claude 与 GPT 协作时……”“未经本人许可……”“新开一个顶层任务……”三段；右卡放“## 多个任务同时改东西”和它下面的四条。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；E214 整段现行原文含容量接续和新型号调研；真实原文卡按完整段落/编号边界分卡，手机按卡安全分张。；续屏版本标签明确 E214，标签不属于规则正文。；blank-audit：长短栏改顺序整宽、撤固定最小画布，定稿字与顺序保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "原文·E280版·续"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "改动与花费成比例"
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "原生容量不足与原线程接续",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "一直有人管理到交付",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "新型号怎么调研",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "第三方评测和社区反馈",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "落地和记录",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "改分工的快做法：",
     "page_break_before": true
    },
    {
     "type": "source_text_card",
     "whole_block": true,
     "split_cards": false,
     "columns": 1,
     "text_ref": "多个任务同时改东西",
     "page_break_before": true
    }
   ],
   "notes": "本轮只用文字材料；仅按定稿已有标题出字。构图依据：竖版 9:16：“原文 · 续”在最上面，下面一张整宽大卡片从头排到尾，顺序和横版完全一样。；去除与组件固定竖单列相同的columns_v=1及已由highlight/真实节点数量/完整保字实现的冗余旧字段；实际要求不取消。；E214 整段现行原文含容量接续和新型号调研；真实原文卡按完整段落/编号边界分卡，手机按卡安全分张。；续屏版本标签明确 E214，标签不属于规则正文。"
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
   "asset": "rule-execution-coordination/rule-execution-coordination-07-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\rule-execution-coordination\\img\\rule-execution-coordination-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d95027df2f4dd9c1d6e5",
   "title_text": "多个任务同时改东西",
   "sha256": "4cf207e2ecba7e0e57083b46d9d8d2a276d50f2b3d11fd0dafbabdf57131b9df",
   "status": "ready",
   "source_box": [
    858,
    76,
    1251,
    141
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

原文 · E280 版 · 续

## 改动与花费成比例

- **派活写死范围和上限。**
  - 写明目标、已有授权、改哪几个文件或看哪几页，给行数预算和时限；只禁本人确实没授权的动作，已授权目标必需、内容已核验、不改变实体权利的前置手续直接办；
  - 目标要有边；新问题另派，不往运行中的单子里塞；
  - 一两步就完的小改，主持的自己做，不派人。
- **时长要合适，超时是信号。**
  - 按范围估一个合适的时长：太长容易越做越多、越做越乱，太短容易草率。
  - 时限只算干活的时间：网络波动、模型满载重试、等额度恢复的时间不算，按包装器记下的重试和等候时段扣除，另行列出。
  - 扣除后到点交回已做的部分和卡点，不自动延期；根会话调整范围或做法及新时限后再接续。
- **交付先看改了多少行。**
  - 主持的先看 `git diff --shortstat`，超预算的退回改小，不合并；
  - 汇报写明加了几行、删了几行。
- **测试和验证按需。**
  - 已有测试兜得住就不加；只给真出过、容易再犯的错加一个最小测试；不写只核对回执或产物指纹的测试；
  - 只验改动影响到的范围，全站、全量检查留到发布前跑一次。
- **要自己定方案的，不交 Sol。** Sol 只接范围、文件、行数预算都写死的施工；要自己定方案的（架构、跨模块改动、开放问题、取舍），交 Astra（有授权时）或 Claude Opus，定了方案再交 Sol 照做。
- **够用就停。**
  - 能直接答的不查；需要查证时先搜官方文档、已有研究，查已有日志和回执，能搜到可靠资料的不实测。
  - 权威评测、厂商和媒体的可靠资料可采信，不因“没亲眼看见”坚持自己验证；模型选型按权威评测和厂商数据，不自己实测。
  - 只有查不到可靠资料、且实测结果会改变决定时才实测；动手或派单前写明会改变哪个决定，以及预计花多少额度、流量和时间。
  - 不写没有意义的机械测试和过度测试；测试只覆盖会改变结果的关键路径。
  - 证据已经足以说明结果就停，不为“完整证明”去重建、穷举，也不重跑已经通过的部分。
- **替换就删掉旧的。** 被新做法替换的代码、脚本和目录，在同一次改动里删除，不留两套，历史留在 Git；回收站是可选做法。
- **汇报几行。** 写做了什么、结果、还剩什么、加删行数；证据只给路径。

## 做错了怎么办

升档、换人只看根会话验收看到的事实，不等子代理自己说不够：没有哪个模型会说“我推理不够”。

- 缺材料、交代漏了、工具出错、执行者中途断了：补上，在原线程、原档位接着做，已有的有效结果照用。这些不算做错。
- 有明确的错，也知道怎么改：带反例和验收要求，用 Steer（运行中纠偏）或原线程 Resume（续作）就地纠正，改相关部分，不从头重做。只有会造成损失、越权或本人明确叫停时才 Stop（停止）；任务仍要继续的，停的同时安排接手。
- 纠正后还犯同一个关键错误，或者核心方案被反例推翻、执行者拿不出能满足要求的改法：换人。可以换同一家更强的型号（例如 Sol 换 Astra），也可以换另一家（Claude 和 GPT 之间才算换一家）；交代剩下的难点、失败证据和已排除的原因。
- 开工后发现活比原来判断的难：当场按剩下的活重选型号和档位，不用等失败。
- 两家都做不对：最后用一次 max，写明要解决哪个难点、怎么验收；还不对，能自己继续修的照常修，剩下的带着结果、证据和可选做法来问本人。同一个模型不把从 xhigh 加到 max 当默认的下一步：两档只差多想一会儿，评测分数不一定更高，还更慢（见模型清单 `routing.effort_rule`）。
- 只缺本人才能给的材料、取舍或授权：不等失败次数，整理好直接问本人。

## Claude 受限的事项交给 Codex

Claude 因自身硬限制做不了本人已授权事项的某一步时（例如删除清理、往网页填写银行卡等金融账户信息，或 Claude 安全规则不允许的其他具体动作），不以“我做不了”结束，也不把这一步推给本人亲手做：先说清实际卡点，主动提醒本人可以交给 Codex 继续，并附一条简短、可复制的提示词，写明精确对象（路径、网址、页面和栏目等）、事实依据或资料来源、已有进度和剩余动作、授权来源，以及完成后的结果核对。能自行完成的部分照常完成，只把受限的那一步交出去。

交接沿用本人已有的任务范围和授权；Codex 按自己的规则和实际工具结果接续，本条不扩大任何一方的授权。提示词交给本人复制，由本人粘贴给 Codex，不自动向另一个聊天发送任务；Codex 做完后，本人把结果回传给 Claude，Claude 回读核对实际结果，再接着处理后续事项。

提示词示例：

- 删除：“请接手清理 <绝对路径> 中的 <已确认无用对象>；依据 <事实>，已完成 <进度>，尚需 <动作>。按现有授权执行，核对清理结果和实际释放空间。”
- 网页填写：“请接手 <网址和页面位置> 的 <剩余栏目>；按 <本人资料或模板路径> 填写，已完成 <进度>，填完回读核对后 <提交等剩余动作>，结果存到 <路径>。本人已授权 <事项>。”

## 原生容量不足与原线程接续

这里是共用执行规则；Codex 的入口差异和命令见[Codex 适配](/rules/codex-adapter/#原生容量不足时转用共用包装器)，Claude 的默认调用见[Claude 适配](/rules/claude-adapter/#派-gpt)。

- **容量够用时优先原生，真满槽才自动转用。** Codex 按当前宿主实际可用容量和任务状态判断，计入仍占槽的后代，不写死槽数。只有明确容量不足才能转用现有 GPT 包装器；鉴权、参数、上下文、网络或能力限制等失败先按真实原因修复，不一概当满槽。原生派发回执不明时，先查代理列表、任务状态或宿主回执，确认有没有实际启动；已经启动就接回原任务，避免重复执行。
- **入口改变，范围沿用。** 转用包装器仍是当前根对话管理的后台子任务，不建立顶层替身；显式选现有可派型号和档位，不扩大父任务的型号许可、业务范围、授权或期限。包装器保存 `ParentHarness`、完整 `SessionId` 和 `ContinueOnQuota`，后续 Resume 沿用。
- **同额度子代理单独报耗尽时立即原线程续作。** 仅同一 Codex 额度下根会话仍可正常调用、子代理报额度耗尽时适用，不等额度恢复。原生 GPT 子代理用原代理的 followup（续作）入口，其他公司模型主持的原生 GPT 子代理用原 `openai_child`；包装器任务启用 `-ContinueOnQuota` 后立即在同一线程续作，后续失败短暂退避再试，并持续受本轮时限约束。不得用 Start、新代理或新顶层对话替代旧任务。真正共同耗尽或无法确认根可正常调用时，保留原任务和状态，按实际恢复时间等候；Claude 默认不启用该开关。登录、参数或上下文出错时，修好真实原因后接回原任务，不乱换型号。
- **一直有人管理到交付。** 包装器 Start、Resume 的返回只表示本次等候结果；`still_running=true` 时立即照返回的 `watch_command` 挂后台 Watch，同一任务同时一条，每次返回后仍在跑就重新挂。需要时 Status/Check 核对真实状态，运行中纠偏用 Steer；截止时按上文调整范围或做法及新时限，再 Extend 延长或 Resume 续作，继续 Watch。原生任务用本宿主的查看和等候入口持续跟进。根会话继续做不冲突的工作，不能因后台还有任务就结束整个主任务。
- **停止与验收由根负责。** 本人叫停主任务时，停止全部已知原生任务、后代和包装器任务；停止等候命令不证明任务已停，要回读状态。执行者消失时先看已有改动和汇报，再在原线程 Resume。终态读取本轮 `report.md`、`last-message.md` 并核对实际成果和验证，不能把启动、入队、子代理自报完成当最终验收。包装器任务成功或主动停止后的会话清理沿用[Claude 适配的清理规则](/rules/claude-adapter/#派-gpt)。

## 新型号怎么调研

本人会告诉 AI 有新型号或新档位发布了，AI 就照这个办法查、按需更新模型清单并直接生效（约法 L23）；本人要求重估分工时也照这个办法查。AA 等权威评测还没出数据时，先按厂商公布的评测数据暂定，在模型清单里标“暂定”；厂商数据已经够判断的（例如同一家的新一代旗舰明显更强），直接定稿。本人说 AA 出了数据时，对这次新型号相关的选择做一次短复核：结论变了就改，暂定的核实后去掉“暂定”。模型能力（会不会做、做得好不好）只以厂商公布的数据和 AA 等权威评测为准，不在本机试跑比较，本人说的强弱也不作依据（约法 L22）；运行上的事实（宿主支不支持、派出去实际是哪个型号、多慢、会不会卡住）照实际使用记录。要找的是每类活能胜任的最低一档：先能胜任，再更快，再省额度。结论落到模型清单 `config/model-roster.json` 和两个宿主适配的用法。

1. **身份和可用性。** 从官方发布页、模型文档和价格页查型号 ID、价格（输入、输出、读缓存）、上下文、有哪些思考档位、默认哪档；在新开的对话里核对宿主能不能派、派出后系统提示里写的实际型号。
2. **先弄清分数量的是什么。** 以 AA 为主，按档位、按场景看：每个评测的题长什么样、分数怎么算，对应本人哪类活（模型清单 `routing.evals`）。分数是在很难的题上比高低，不是日常活的成功率；各档位分开看，最高档的分数不能给低档作证。评测页把分数、花费、耗时嵌在页面数据里，图上读不出时用浏览器从页面数据读；取不到的说明缺口。花费只在同一家里比，两边订阅额度各自独立。
3. **和现在的选择比。** 同一类活的相关评测上，新型号或新档位不低于现在的选择、耗时不更长，就可以换上；能胜任之上的分数只换来多等、多花。要惊艳的活看成品质量和审美类的评测（例如成品两两盲评、网页设计的人类偏好榜），不只看编程分。
4. **第三方评测和社区反馈。** 只采用有方法、有样本的评测；每条写来源、日期、样本多大、可能的偏差；厂商公布的评测数据可以作暂定依据，没有数据的宣传说法只当线索。互相矛盾时写明怎么判断，推断标明是推断。
5. **落地和记录。** 完整数据连同出处和查询日期写进决定文档对应一节；模型清单只写选择和起决定作用的几个数，注明查询日期。模型路由（哪类活派哪个型号、用什么档位）按数据直接更新；授权、预算这类本人定过的事要变先问本人（约法 L23）；都写清依据和怎么撤回。新型号的实际派出核对列进待验收清单。

改分工的快做法：
- **只改分工数据**（哪类活派哪个型号和档位、场景表、依据、不派的理由、新的 Claude 子代理模板）：改 `config/model-roster.json` 和 `templates/claude-home/agents/`，完整数据写进决定文档；跑 `agents-charter`、`agent-runtime-compatibility`、`duplicate-content` 三项测试，合并推送并快进活动检出 `E:\.agents` 就生效。这些文件不在规则发布快照里，各会话直接读主分支，不用发新版本；新的子代理类型在定义重新加载后出现，派一次核对实际型号。
- **改规则文字**（分工的做法、这套调研办法、各专题里的说法）：按[规则发布](/rules/rule-release/)选快速发布或标准发布；快速发布入口的 `-Mode Inspect` 会说明这些文件走不走得了快速通道。
- **发布后**：回读活动版本；通知正在派活的会话，只说改了什么、从哪一版起。

## 多个任务同时改东西

- **各用各的工作副本。** 每个施工任务用自己的 worktree，合并冲突先理解对方改动，不覆盖。验证、合并推送、远端回读、活动检出快进和分支清理统一按[Git 收尾](/rules/engineering-delivery/#git-收尾)，别人未提交或不能快进时不动并说明。只读和测试无需 worktree。已并入且干净的副本按[清理入口](/rules/engineering-delivery/#下载临时文件和清理)用 `git worktree remove <精确路径>` 删除，或 `Move-TaskItemToRecycleBin.ps1 -AllowLinkedWorktree` 回收。回收核对实体后清 Git 登记；目录已不存在的无损旧登记顺带清，分支和提交保留。盘未接上就留登记，脱离分支的提交先挂到分支再清。
- **依赖只等具体产物。** 要用别的任务的产物时，说清等的是哪个提交、回执或文件，只有用到它的那一步等；源码接线、局部验证、合并预演这类准备照常先做。整单挂起“等某任务做完”属于过度串行。短锁（见下条）只锁那一下单点动作，不锁准备。
- **单点动作前加一把短锁。** 安装或升级软件、发布规则、改计划任务这类会互相影响的动作，动手前用 `E:\.agents\tools\Invoke-ShortLock.ps1` 领锁，做完马上释放。同一种动作共用一个清楚、固定的锁名，持有人写当前宿主和真实任务号。先用 `-Mode Inspect -Name <锁名> -Json` 看现状，再用 `-Mode Acquire -Name <锁名> -Holder <当前任务> -Minutes 30 -Reason <一句话> -Json` 领锁；成功后才开始单点动作。别人的有效锁还在时，等它结束或先核对情况，不抢锁。需要续期时，同一持有人再次 Acquire；结束时在 `finally` 中用 `-Mode Release -Name <锁名> -Holder <同一持有人> -Json` 释放。短锁只避免并发相撞，不授予本人没有给的权限。
- **不动别人的东西。** 保留其他任务的改动和没提交的内容，不用 `git add .`，不从标题、目录或历史推断某处归自己。
- **停下时留好接续状态。** 没做完就停时，写清在哪个工作副本或分支、做到哪、还差什么，让后来的任务能接着做。
