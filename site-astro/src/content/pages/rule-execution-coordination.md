---
{
 "title": "分工与并行施工",
 "kind": "rule-topic",
 "url": "/rules/execution-coordination/",
 "tagline": "谁想谁做、派谁，新型号和限制怎么看，多个任务同时施工怎么不打架。",
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
  "tagline": "谁想谁做、派谁，新型号和限制怎么看，多个任务同时施工怎么不打架。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "release": "E389",
   "commit": "c74447f7cefadc860208ad2425c236981caa837d",
   "ruleset_sha256": "bece26ac3f4569cf3582648846158e8e2c9145498e148bdaa1fe9edf514759f2",
   "activated_at": "2026-11-06T13:22:34.536034+08:00",
   "file": "sources/rules/docs/contracts/agents.execution-coordination.md",
   "sha256": "f95cc60380533e965b828fef389062af8ee8b0b09afa63034109bf06647af6be",
   "public_sha256": "72f4edc81fd0ffaea9ba9d3566f45218c8c3ae7ee0703e8238cfb6cd75e3d9f2"
  },
  "explanation_based_on": {
   "release": "E389",
   "sha256": "f95cc60380533e965b828fef389062af8ee8b0b09afa63034109bf06647af6be"
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
     "target": "/rules/execution-coordination/#p-l22",
     "screen": "rule-execution-coordination-01",
     "text": "L22 质量优先，不浪费额度"
    },
    {
     "target": "/rules/execution-coordination/#p-l23",
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
     "target": "/rules/execution-coordination/#p-l22",
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
     "target": "/rules/execution-coordination/#p-l23",
     "screen": "rule-execution-coordination-03",
     "text": "约法 L23"
    },
    {
     "target": "/rules/engineering-delivery/#p-cleanup",
     "screen": "rule-execution-coordination-05",
     "text": "工程与交付"
    },
    {
     "target": "/rules/codex-adapter/#p-dispatch",
     "screen": "rule-execution-coordination-08",
     "text": "Codex 适配"
    },
    {
     "target": "/rules/codex-adapter/#p-dispatch",
     "screen": "rule-execution-coordination-02",
     "text": "Codex 适配"
    },
    {
     "target": "/rules/engineering-delivery/#p-goal",
     "screen": "rule-execution-coordination-02",
     "text": "工程与交付"
    },
    {
     "target": "/rules/execution-coordination/#p-owner-roles",
     "screen": "rule-execution-coordination-03",
     "text": "本人定的分工和型号规矩"
    },
    {
     "target": "/rules/execution-coordination/#p-limits",
     "screen": "rule-execution-coordination-03",
     "text": "限制：比得过才重看"
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
  "sha256": "1927fcebf4a0c7b7fdf84fe4455e2fa908aafd77c591336079094eca21101404",
  "converted_at_beijing": "2026-11-06T13:54:07+08:00"
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
   },
   {
    "text": "派 Claude 子代理",
    "href": "/rules/claude-adapter/#p-subagents"
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
     "text_ref": "Claude主持时，想和判断自己来，动手的派出去"
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
     "text_ref": "型号与派法（按北京时间 2026-11-05 更新的模型清单）"
    },
    {
     "type": "notice",
     "row": "host",
     "width": "50%",
     "text_ref": "怎么搭配"
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
     "text_ref": "Claude主持时，想和判断自己来，动手的派出去"
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
     "text_ref": "型号与派法（按北京时间 2026-11-05 更新的模型清单）"
    },
    {
     "type": "notice",
     "row": "host",
     "width": "50%",
     "text_ref": "怎么搭配"
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

**Claude 主持时，想和判断自己来，动手的派出去；Codex 单独聊时自己想、自己做；几路一起干，改动不互相覆盖。**

主对话管战略、头脑风暴、抽查、QA（质量检查）和最终把关。Claude 主持时判断、定方案和写给本人的字自己来，代码派出去，一两步的小事顺手做；Codex 单独和本人聊时普通施工通常自己做，只有并行、量大或要全新上下文才开子代理。型号和档位按成品要求、厂商数据和权威评测选，惊艳类的样板与关键部分交做得最好的亲手做。多任务施工各用工作副本；共用设置的单点动作领短锁，做完释放。

### 型号与派法（按北京时间 2026-11-05 更新的模型清单）
| 型号 | 任务场景与档位 |
|---|---|
| GPT-6.1 Sol | 写代码、改脚本、修 bug、排障用 ultra，没有“关键代码”例外（项目另有分工的按项目）；查资料、取原文、批量核对，操作电脑和浏览器、截图，照清单核对和成批审图，方案定好后的代码和规则施工也用 ultra。摘录、读一页这类只读小单，按明确关键词筛原文，机械填充用 medium。不定大方案，不做判断型复核；看完现场发现要定方案，留言交回。被纠正一次先在原线程接着改；还错，主持先对两次交回的结果和本人说的现象，看修的是不是同一件事，是才换 Astra high（有授权）或 Opus high |
| GPT-6 Luna | 只把写好的提示原样交给生图工具、落盘，用 low；不花额度 |
| GPT-6.1 Terra | 现在没有默认场景 |
| GPT-6 Astra | 要授权：要紧审图 high；Sol 做不对换人时 high；并发、一致性、安全这类难路径和要紧决定的查证 ultra；法律事实和法条核对、硬核数理推理的复核，被复核的东西由 Claude 写时 ultra。本人长期授权的不用再点头，各只限这一类：完整复核 Claude 写的东西、每月的月度信和汇报复核、新 Astra 换代时读一遍写给它的限制，都用 ultra。不为生图派它 |
| Claude Opus 5.5 | 主持；小范围复核和抽查 low；常规审查、独立复核、材料多时出初稿 medium；要第二个脑子、完整分析和方案、聚焦复核、正式文书 high；困难设计、关键取舍、完整复核 GPT 写的东西、要惊艳的样板和关键部分 xhigh；两家都做不对时最后一次 max |
| Claude Sonnet 5.5 | 只跑专门要 Claude 来做的验收清单（比如核对 Claude 这边装没装好），用 low；不在 GPT 调不动时接替它 |

**怎么搭配**：Sol 简单只读和机械活用 medium，其余用 ultra；Luna 只照提示生图、落盘，用 low；其他型号选能胜任的最低档。做错先按验收事实补材料、在原线程改，同一关键错再犯，或方案走不通、活变难，就重选执行者；两家同档都做不对，才最后用一次 max，同一个模型不把从 xhigh 加到 max 当默认的下一步。Opus 与 Astra 的高档活选一家实施，可交叉独立复核。给本人看的成品、分析和价值取舍优先 Opus，主对话最终把关。每类活的默认和什么时候换写在模型清单的场景表，它管 Claude 主持。上表是清单在这一天的样子，型号换代或公开评测更新时以模型清单的当前版本为准，不把这张表当永久事实。

**三种宿主怎样派**
- Claude：代码派出去；自己的子代理默认用 Agent 类型选档派桌面，本人说“派API”后接下来 3 个走 API（见〔派 Claude 子代理〕）；Sol、Terra、Luna 无需另授权；Astra 按对话或项目授权，GPT 都经包装器写明型号和档位。
- Codex 的 GPT 主对话：普通施工通常自己做，只有并行、量大或要全新上下文才开原生子代理；要定大方案 Sol 交 Astra，Astra 自己定；判断型复核 Sol 交 Astra，Astra 开全新的 Astra；写明型号和档位，核对实际启动值；名额真满了才转共用包装器。
- Codex 的别家主模型：用 openai_child，只派 Sol、Terra、Luna，不派 Astra。

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
    "href": "/rules/execution-coordination/#p-l22"
   },
   {
    "text": "重大动作与本人验证",
    "href": "/rules/protected-actions/"
   },
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/#p-dispatch"
   },
   {
    "text": "工程与交付",
    "href": "/rules/engineering-delivery/#p-goal"
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
- 主对话管想和把关：战略、头脑风暴、抽查、质量检查和最终成品。判断和写给本人的字主持自己做。
- Claude 主持时代码派出去，例外见入口结尾“容易错的”那段；一两步的小事顺手做；其余施工按成品要求派发。
- Codex 单独和本人聊时不走这一套：它自己想、自己做；只有并行、量大或要全新上下文才开子代理。见〔Codex 适配〕。
- 看整段目的和总量，不看每次操作多容易；50 张截图不能拆成 50 件小事。
- 相关动作合成一单，一次交代清楚；只有判断或一两步的整件事，零个子代理也正常。

### 派谁、花多少
- 先按成品选人：能用就行的，交能胜任里最划算的；要惊艳的，样板和关键部分交做得最好的亲手做。
- 谁能胜任、谁做得最好，只看厂商数据和 AA（权威评测）；不自己测，也不拿本人说的强弱作证。
- 档位按剩下的真实难点选；质量需要时，子代理可以比主对话更强，不用每次问本人。
- 算今后的总投入：自己做要花的执行、验证和返工，对比派出去要花的交代、重建上下文、来回沟通、审阅整合和返工；已经花掉的不算。
- 每次派都写明型号和档位，不让子代理悄悄沿用主对话的设置；GPT-6.1 Sol 只读、步骤简单、代码上限为 0 的小单和机械活用 medium，施工、要判断的分析和难活用 ultra；Luna 只照写好的提示生图、落盘，用 low；派完核对实际启动的型号和档位。
- 型号和档位统一从模型清单的登记查：已登记被替代的型号，旧提示、原生入口、包装器、续作和后台重试都不能再派；没有数字的新命名也登记替代关系，不凭名字或参数大小猜强弱。

### 按风险决定复核深浅
- 主持先看改动、测试和实际使用结果，判断坏了会怎样、能否撤回、测试能证明多少、影响面多大（〔约法 L22〕）。
- 小而可撤回、测试与实际运行能证明对错的改动，由主持验收；每轮都用的 Hook、入口、共用组件或难发现的故障，聚焦查本次风险。
- 会导致泄密、把本人锁在外面、丢本人原件或唯一数据或不可逆后果的改动，完整独立复核，包括密码中心、授权、本人验证、资料锁本身，以及有这些后果的迁移和删除。计划写一行本次档次和理由；本人随时可改。
- 产品和战略上的取舍不交复核：本人会看到、会用到的东西，动手前先用一两句话或一张图给本人看样子，由本人定（见〔工程与交付〕）；推荐、取舍、计划类汇报交本人前也不另派子代理复核。
- 需要复核时按模型清单的复核分工选人：照清单核对（对着原话、规格、清单，查测试有没有被削弱，成批审图）交 Sol；要动脑判断的（完整复核、审计、方案和文案评审）交全新上下文的 Opus，不交施工型号（GPT 主持时交 Astra，别家模型主持的 Codex 派不了 Astra 时交 Sol ultra 并注明）；完整复核 Claude 写的东西交 Astra（本人长期授权）。照本人原话核对时，Sol 只查字面有没有漏，意思对不对主持看。
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
    "href": "/rules/execution-coordination/#p-l23"
   },
   {
    "text": "型号与派法",
    "href": "/rules/execution-coordination/#p-model-table"
   },
   {
    "text": "约法 L22",
    "href": "/rules/execution-coordination/#p-l22"
   },
   {
    "text": "中外消息快查",
    "href": "/skills/news-quickcheck/"
   },
   {
    "text": "本人定的分工和型号规矩",
    "href": "/rules/execution-coordination/#p-owner-roles"
   },
   {
    "text": "限制：比得过才重看",
    "href": "/rules/execution-coordination/#p-limits"
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
   },
   {
    "id": "p-muse",
    "text": "用 Muse 时怎么说话"
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
     "width": "50%"
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
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "用 Muse 时怎么说话",
     "columns": 1
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
     "row": "cards"
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
     "text_ref": "用 Muse 时怎么说话",
     "columns": 1
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
- 出处由主对话负责：写派单时分清本人原话和 AI 补充，原话存档里那条消息的编号（源消息 UUID）也算出处；派活不附原话清单、要求表或相关决定。子代理照派单做，不查出处、不报“无出处”，只交回任务里的实质冲突和未知。
- 子代理只按授权、派单范围、测试上限和验收方式交付，做完就汇报结束；不额外加检查、诊断、扩展取证、原话审计、重复改写或无关汇报。测试上限为 0 就不写测试，已有验证够用就停；范围外的发现只写一句建议。派单里的动作可能删数据、越权或造成损失时，停下这一步交回主对话。
- 不灌全部历史；派活松紧分两种：代码、规则和测试写明范围和行数，派单写明改动范围、Sol 的净增行数上限和测试上限；完成目标必需的文件可以改，汇报写明；行数不够在打算里说明还差多少、为什么，由派单人放宽，不算做错（这一代 Sol 要限行数是本人的要求，具体数字是派单人按大小估的，不为守数字砍掉需要的功能）；网页、表单、客服、申诉、找东西这类现场办事，只写目标、已知事实、授权、底线和怎样算办完，由掌握现场的执行者主动找入口、换说法、重试、走下一步，不替它写死步骤，也不规定只能试几次。
- 两种都守同一条底线：删除、发布、代本人发消息、付款、改账号设置等动作要有相应授权，本人审定的原文和取舍不擅自改写，事实不编造；碰到底线就停下这一步交回，其他情况换路继续。型号强弱只影响谁定方案、谁施工，不拿来收回执行者自主找路。
- 换路是换一类办法，不是换参数：同一个小目标用同一类办法两次没成（同样的报错、同样没结果），不试第三次；先看实际发生了什么（真实报错、开工后新出现的文件和进程、页面或程序现在的样子；工具报超时或取消，也要看结果是不是其实已经落地），再回到目标换一类办法；想不出就先做完不受影响的部分，写汇报交回。每次报错不同、结果在变，是在逼近，不算卡住。对网页或系统做的临时改动用完就还原；改坏了先还原，不在改坏的状态下接着查。
- 遇到关键事实冲突、拿不准的需求或取舍，子代理把问题、证据和建议写进留言，依赖这个答案的先放下，接着做不受影响的部分，不等回答，同一件事只问一次。
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

### 用 Muse 时怎么说话
- Claude、Codex 的任何模型和子代理访问 Muse，都走〔中外消息快查〕技能里的 Muse 入口，用本人第一人称、像正常人聊天一样说话；提问、补句、资料正文、协作说明、更新通知和会话标题都这样。
- 不用编号格式、工单式字段和“派单、交付物、原链”这类工作用语；要链接、要分清消息怎么来的，就用平常聊天的说法，标题也像人起的。只改说话方式，不加别的技术手段。长期授权的范围见〔用户授权〕。

### 可派模型清单
- 各家现在能派哪些型号、各适合什么活，列在一份模型清单里；它只作参考，不当门禁。
- 清单怎么更新、本人定过的型号规矩，以〔约法 L23〕为准（白话见下一屏〔本人定的分工和型号规矩〕）：本人说有新型号，AI 查厂商数据和权威评测，按需更新、直接生效。授权、预算仍先问本人；Claude 暂不派 Fable 5.1，新 Fable 同样按数据判断；Codex 主对话用别家模型时仍不派 Astra。
- 新型号的档位和场景只读模型清单的当前版本，不把某一天的静态表当永久事实。派谁、什么档位只凭厂商公布的数据和 AA 等权威评测，不在本机试跑比较；写给上一代的限制要不要重看另有一道门，见〔限制：比得过才重看〕。先弄清评测考什么，再和现用选择比；惊艳类还看审美和成品质量。AA 没数据时先按厂商数据暂定，数据够就定稿；AA 出数据后短复核。宿主支不支持、实际派出型号和运行快慢，照真实记录；没有数据就说明缺口。
- 某个项目专用的分工只在那个项目里适用，不自动变成全局默认。
- 所有入口一起换代：各项目的职责、授权和出处仍登记在模型清单的项目型号表，型号的当前值和前代替代关系统一登记一处。评估确定上位替代后走统一入口登记，自动保留前代，同步各家候选、项目当前选择和原生角色模板；原生派发、包装器、直接调用、续作、重试和 AICLI 都用同一份登记。各项目和技能里的直接引用一并核对，研究记录和真实历史不改写。
- 换代不扩大厂商许可、Astra 授权或预算，这些取舍要变仍问本人一次；单纯把已核定的前代换成当前替代型号，不重复问。宿主不支持旧代理换型续作时，明确返回“要迁移”，由主对话把原目标、已有文件和未完成项交给当前型号接着做，保留旧记录，不冒充同线程换型。每周治理沿现有入口查漏掉的当前引用，不新增定时任务。

### 改动与花费成比例
- 派活写明范围、净增行数和测试上限、时限，不写“修好”“做完整”这类没有边的目标。时限是估计，只算干活的时间，网络波动、模型满载重试、等额度恢复的时间不算；到点把已有产出、卡点和剩余工作报给根会话，接着做，不停；根会话觉得不对再调整范围、做法或喊停。叫醒了一直没回应，到 3 倍才停。
- 交付先看加了几行、删了几行；超了就看多出来的是不是必要、能不能更简：能更简的退回改小，确实必要的说明理由照收。测试按需：已有测试兜得住就不加，只覆盖会改变结果的关键路径，全站、全量检查留到发布前一次。
- 要自己定方案的（架构、跨模块、取舍）不交 Sol：方案定好再交它在范围和行数内施工。谁定方案看模型清单场景表：Claude 主持时主持读现场自己定，读不完或要第二个脑子才请 Opus，有授权也可换 Astra，一件活选一家。办事类任务可以派 GPT（包括 Sol），给目标、事实和底线，由它临场判断。
- **够用就停**：能直接答的不查；要查证先找官方文档、已有研究、日志和回执。权威评测、厂商和媒体的可靠资料可以采信，不因“没亲眼看见”非要自己验；选模型只看权威评测和厂商数据，不自己实测。
- 只有查不到可靠资料、实测结果又会改变决定时才实测，动手或派单前写明会改变哪个决定、预计花多少额度、流量和时间；证据够说明结果就停，不为“完整证明”重建、穷举，也不重跑已经通过的部分。
- **重复跑先问**：重复跑同一件事来比较或测试，超过 5 次先问本人跑几次、用什么档、结果能改变什么；说不出能改变什么就不跑（〔约法 L22〕）。
- **拿真实 AI 跑测试先防副作用**：真技能、钩子和本人的 Chrome 都可能被触发，`--ignore-user-config`、`--ephemeral` 这类开关断不开它们；先确认题目不会动到本人的东西，先跑一个看有没有副作用，再批量。
- 新做法替换旧实现时，同一次改动里移走旧的，不留两套；汇报写几行，证据只给路径。

完整型号、按场景的档位与三种宿主派法，统一见本页〔型号与派法〕。Claude 能直接派 Sol、Terra、Luna；Astra 仍按本人给对话或项目的授权，长期授权的那几类除外。

**本网站专用分工**：照写好的提示交 GPT-6 Luna low 画、落盘，GPT-6.1 Sol ultra 审；只适用于本项目。通用任务里 Luna 现在也只做照提示生图、落盘，不接其他活。

::screen{#rule-execution-coordination-08 section="points"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-08",
  "section": "points",
  "title": "人话要点：本人定的分工和型号规矩、新型号和限制",
  "scene": "横版：左对齐中号章节标题；一段说明；四张整宽要点卡按正文顺序。",
  "portrait": "竖版：同横版块序。",
  "links": [
   {
    "text": "Codex 适配",
    "href": "/rules/codex-adapter/#p-dispatch"
   }
  ],
  "anchors": [
   {
    "id": "p-owner-roles",
    "text": "人话要点 · 本人定的分工和型号规矩"
   },
   {
    "id": "p-l22",
    "text": "想和做分开（L22）"
   },
   {
    "id": "p-l23",
    "text": "型号规矩（L23）"
   },
   {
    "id": "p-new-model",
    "text": "新型号出了：每次都看派谁"
   },
   {
    "id": "p-limits",
    "text": "限制：比得过才重看"
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
     "align": "left",
     "size": "medium",
     "text_ref": "人话要点 · 本人定的分工和型号规矩"
    },
    {
     "type": "prose",
     "text_ref": "原来写在开场那一页的 L22、L23 搬到了这一篇"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "想和做分开（L22）"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "型号规矩（L23）"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "新型号出了：每次都看派谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "限制：比得过才重看"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "left",
     "size": "medium",
     "text_ref": "人话要点 · 本人定的分工和型号规矩"
    },
    {
     "type": "prose",
     "text_ref": "原来写在开场那一页的 L22、L23 搬到了这一篇"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "想和做分开（L22）"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "型号规矩（L23）"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "新型号出了：每次都看派谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "限制：比得过才重看"
    }
   ]
  }
 },
 "images": []
}
```

## 人话要点 · 本人定的分工和型号规矩

原来写在开场那一页的 L22、L23 搬到了这一篇，意思没变，别处写“约法 L22”“约法 L23”指的就是这里。这里写的分工是 Claude 主持；Codex 单独聊时它自己想、自己做，见〔Codex 适配〕。

### 想和做分开（L22）
- 主持管想和把关：战略、头脑风暴、抽查、质量检查，找出做事的 AI 没想到的地方，最后以人的角度看成品。要抽查 50 张网页截图，就派别的 AI 截好送来，主持只管看和判断。
- 能用就行的，交能胜任里最划算的；要惊艳的，样板和关键部分交做得最好的亲手做，其余照样板铺开。
- 谁能胜任、谁做得最好，只看厂商公布的数据和 AA 这类权威评测，不自己测，本人说哪个强哪个弱也不算。
- 额度多少不参与判断：不为省额度把活收回来自己做，也不为省额度少派复核、降低质量。省额度靠一次做对、少返工。
- 只有本人最新一条真实消息明确要看额度时才查 AI 额度；例外是 Muse 报错、迟迟不回或像被限流时可以查一次 Muse 的剩余额度。
- 重复跑同一件事来比较或测试，超过 5 次先问本人跑几次、用什么档、结果能改变什么；说不出就不跑。

### 型号规矩（L23）
- Claude 不用本人授权就能派自己的子代理和 GPT 的 Sol、Terra、Luna；派 Astra 要本人给这个对话或项目授权，长期授权的那几类除外。要高档的活在 Opus 和 Astra 里选一家，两家可以互相复核。本人常忘了给 Astra 授权，遇到 Astra 做得更好的活，Claude 要提醒。
- Codex 主对话用别家模型时，可以派 Sol、Terra、Luna，不派 Astra。Claude 只在跑专门要 Claude 来做的验收清单时派 Sonnet，暂时不派 Fable 5.1，新的 Fable 也按数据定。
- 派出的模型调不动时，不降型号和档位，也不把 GPT 的活转给 Claude；额度用完或账号调不了才提醒本人换账号，短时限流、满载和服务器临时出错自动重试。
- 本人只许用一边时，那一边既把关也施工。授权、预算这类本人定过的事，换代时仍先问本人。

### 新型号出了：每次都看派谁
- 本人说新型号出了才开始。查清强不强、划不划算，再看多了什么新本事（新工具、新输出格式，现在哪个绕路的做法可以换）。采集交 Sol ultra，判断主持自己来。
- 不低于现在的选择、耗时不更长、价钱没明显变贵就可以换上；更强但更慢或明显更贵的，现在的型号胜任的活不换，胜任不了的和要惊艳的换。
- 资料能说明哪类活更好，就只决定哪类活派谁；爱不爱问、说不说人话这类不从榜单上下结论。某一项判断不了，那一项先沿用，告诉本人缺哪一项。
- 给本人的话很短：是什么；强在哪（带来源）；多了什么新本事；换不换、看不看限制。

### 限制：比得过才重看
- **门**：写给上一代的限制，只有第三方评测显示新型号不低于这家现在最强的，而且明显强过上次读过限制的那个型号，才重看；还没人读过，就和这些限制当初针对的那个比。清单上不派的不算。没过一个字不动，告诉本人比了哪个评测、各多少分。
- **什么算过**：第三方的综合结果明显高过它，标了误差的差距要超过误差；派给这家的活里，有对口评测的没有哪类明显变差。新旧都比清单默认档，比不了、几家对不上都算没过。厂商的话和实际用的人怎么说只当线索：厂商数据能定派谁，两样都开不了这道门。只有厂商的话时，限制先沿用，模型清单记“等第三方评测”，每周治理查到评测出了，进驾驶舱给本人一句可复制的话。
- **没读过的型号**，遵守前代当时实际在守的限制，这不表示这些限制对。放到眼前明显不对时：结尾那段说清哪句不对、想改成什么，等本人点头；单子上的行数上限在打算里说，主持放宽；Sol 不定大方案，留言交回；其余的按本人要的结果做，当场说一声。
- **怎么读**：过了门，被评的新型号自己读一遍，别的型号不代读；只开一个，读一次，不跑任务、不试跑、不查记录。读的是作用到它身上的限制和程序，每条写留、改成哪句或删；说不准就写说不准，这条沿用。全留也是结果。
- **另一家复核**：表交回后另一家现在最强的看一遍（新 Claude 读的交 Astra ultra，新 GPT 读的交 Opus xhigh），只说哪条删错了、留错了、哪条理由像在替自己说话，不改结论；两家说法不一样的，两边都列给本人。
- **决定只作用于它**：它的后代跟它走，其余型号不受影响；它变强不放宽别的型号和别家的限制。
- **不问它**：撤不回的事、重大的事、资料锁、密钥、标明“禁令”的、本人的事本人定那条线、授权和预算、生图提示原样转交。
- **怎么生效**：限制目录只记这次判断，要改的是它指向的原句和程序。原句在开场那一页或两家结尾那段：先给本人看这句，他点头才上，没点头记“待定”，不算放开。原句在别处：单独列给本人，标“AI 建议”，他下一条回复没反对就改，没回复不算同意；受发布检查的专题限制句要他回一句明确的话。
- **留痕和撤回**：删的行不抹，写清哪一代删的、为什么。不另安排定时检查：本人指出问题，或主持在正常任务和验收中发现放开后出了问题，就由当时负责的主持恢复或改正；这不保证错的后果撤得回，也不保证一定有人发现。

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
   },
   {
    "id": "p-blind",
    "text": "盲审、盲测和盲调查"
   },
   {
    "id": "p-whole",
    "text": "发现项目整体有毛病"
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
     "text_ref": "盲审、盲测和盲调查",
     "columns": 1
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
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_cards": false,
     "illustration": "none",
     "icons": "none",
     "text_ref": "发现项目整体有毛病"
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
    },
    {
     "type": "points_card",
     "text_ref": "盲审、盲测和盲调查",
     "columns": 1
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
- 主对话管战略、头脑风暴、抽查、QA（质量检查）和最终把关。Claude 主持时判断、定方案和写给本人的字自己来，代码派出去，一两步小事顺手做，惊艳类样板和关键部分可以亲手做。
- 几段接力做同一个成品（写、画、审、拼）时，由主对话或指定的一个人对成品负责，亲自在真正用的地方看整体，截图、录屏可以派人采好送来；各段自查代替不了。先做完整样板再批量，共用规格只写一处；惊艳类在样板定稿前、交付前各一轮头脑风暴，主持的最后拿主意。
- 派出去以后接着做不冲突的事，不空等；但后台还有子任务时要一直盯到交付：每次等候返回后还在跑就接着等；到时限被叫醒时看产出，觉得不对才纠偏，要改时限再延长；不能因为后台还在跑就结束主任务。
- 子代理创建成功只说明任务发出去了，不说明做完了；它交回的结果由主对话核对。
- 卡住了怎么办（为的是不让真实任务白耗时间）：预计超过 30 分钟或成批的活，开工时告诉本人大概多久，派单写清“产出”（看得见、数得出的东西：存下的文件、通过的测试、写好的小节）和时限（只是估计，到点只叫醒主持）；包装器按产出涨没涨叫醒主持。短活不写；原生子代理没有这个提醒，时限写短、按时交回。
- 查进度只看产出涨没涨，不看忙不忙：一个检查间隔没涨、明显落后，或者同一个报错第三次出现，就算卡住。先看现场（真实报错原文、开工后新出现的文件和进程、现状和已经试过的办法），事实已经指出出路就直接纠偏；看不出，或想到的只是原路的变体，就请一个没参与过、和卡住的执行者不同家的模型，只给目标、事实、已试过的办法和底线，请它给三条做法不同的路，各写第一步怎么验证，不附自己的猜测。
- 选定的路用 Steer 发给还在跑的执行者，已经结束但没做完的在原线程 Resume，从现有进度接着做；时限到了还没做完，按剩下的量重估时间接着做，不当成收工。完成时间推后时，在对话里告诉本人一句：卡在哪、换成什么办法、新的预计时间，不停工，也不等回复。
- 只缺本人才能做的事（登录、授权、拿主意）立刻问；换了两类根本不同的办法仍不通，带着可选做法来问，问的同时继续做不依赖答案的部分。本人追问或质疑时，先核对现场事实：事实没变，就说明原判断为什么还成立；事实变了才换办法，并说清是哪条事实变了。
- 做错看主对话验收事实：缺材料或工具出错先补，在原线程、原档位接着做；有明确的错、也知道怎么改，就带反例和验收要求用 Steer（运行中纠偏）或在原线程 Resume（续作）就地改，不从头重做，Claude 主持时不自己补（一眼看清的错字除外）；只有会造成损失、越权或本人明确叫停时才 Stop，任务还要继续的同时安排接手；同一关键错再犯、方案被推翻或难度变了才换人。两家都失败再用一次 max；只缺本人材料、取舍或授权就直接问。
- 本人叫停主任务时，已知的子代理和后台任务一起停掉，再查一遍确认真停了。执行者中途没了，先看已有成果和汇报，再在原任务上接着做。

### 盲审、盲测和盲调查
三个说法意思不同，不混用：
- **盲审**：审的人只看得见给定的材料和提示词，不带本机的规则、记忆和上下文，也看不到其他 AI 的意见，就像外人第一次拿到这份东西。桌面版和 Codex 派的子代理开场就带着本机全部环境，不能用来盲审。做法：AI 在 `E:\Cache\BlindReview\<日期-事项>\` 放好材料和一份提示词，几位审的人拿同一份；本人自己去聊天网页开全新对话（不开记忆、不设个人偏好、不进项目、不添加本机文件夹），上传材料、写上提示词；本人把回答原样交回 AI，用完清掉文件夹。
- **盲测**：测试者带着上下文，像本人那样去用、去操作，看实际表现；可以派子代理，几位各自独立、互不看结果。
- **盲调查**：每个参与者独立调查，可以派子代理；给同一份事实和本人中途的同一批更正，不给也不让它去找其他 AI 对同一件事的意见（包括本人粘贴来的）和其他参与者的结果，读取路径隔开。
- 各方结果收齐后，主持中立地向本人汇报：结论并排、照原意呈现，不替哪一方加减分；主持自己的看法单列并标明。

### Claude 和 GPT 一起干时
- Claude 主持时，按成品要求想和把关，也亲手做场景表交它的惊艳类样板和关键部分；本人定过由 Claude 写的成品、分析、文案、正式文书和对本人的理解照旧。
- 施工、采集、按清单审查和核对执行者汇报照场景表派；GPT 可以提清单外的实质问题，出主意时给原始材料，不先写死结论。
- Claude 抽查风险和看最终成品，GPT 交完整材料清单；Claude 也可自己挑没被推荐的样本。
- Codex 单独主持的任务，它自己想、自己做，只有并行、量大或要全新上下文才开子代理；它的主对话负同样的最终责任，不拿以前的分工当理由去等 Claude。
- 事实报告可以当证据用，但产品是不是真满足需求，仍要验收。
- 分工按成品要求，不因哪边额度多或少改；GPT 的活不转给 Claude（调不动时见下面“快速模式、故障和额度”）。只用一边时，那边既把关也施工，不查全部账号额度。
- Claude 因自身硬限制做不了本人已授权的某一步（例如删除清理、往网页填银行卡这类金融信息）时，不以“我做不了”结束，也不推给本人亲手做：先做完能做的部分，提醒本人可以交给 Codex 接着做，并附一条可复制的提示词，写清精确对象（路径、网址、页面栏目）、依据、已有进度和剩余动作、授权来源和做完怎么核对。提示词由本人复制粘贴给 Codex，不自动发到另一个聊天；Codex 按自己的规则做完，本人把结果回传，Claude 回读核对再接着做。这不扩大任何一方的授权。
- Claude 派 GPT 的具体入口见〔Claude 适配〕。

### 快速模式、故障和额度
- 没有本人许可，不开 fast 快速模式。
- 出故障后先核对并接回被打断的任务；排查可以另外并行做。
- **模型调不动时按原因处理，不降级**：不降型号、不降档位，也不把 GPT 的活转给 Claude，不预先查额度。额度用完或账号失效才停下受影响的任务、提醒本人换账号（本人不在就登记进驾驶舱“需要你”），换好后按原型号、原档位、原派单接着做；短时限流、满载和服务器临时出错交包装器自动重试。细则见〔Claude 适配〕。
- 同一份 Codex 额度下，主对话还能正常用、只有子代理报额度用完时，立即在原任务上接着做，不等恢复（Claude 默认不这样接）。主对话也调不动、真的都用完了，才提醒本人换账号；换好账号或额度恢复后，还有价值的原任务在原对话接着做，并告诉本人，不另起替身。
- 要换上下文时，先核对原任务真实做到哪，交接或停掉以后再安排，不重复做。

### 什么时候新开对话
- 只有确实有独立的成果和责任，才新开一个顶层任务（新对话）；项目多、活多、能同时开的名额满了都不是理由。Codex 不自行新建顶层对话，分工用当前对话下的子代理。
- 子代理名额真满了，Codex 自动改用 GPT 包装器接着派，仍是原主对话管的后台任务，型号、范围和授权都不放宽；登录、参数、网络这类故障先修真正的原因，不当成满了。拿不准刚才派没派出去，先查清，已经启动就接回来，不重派一份。
- AI 新开的对话默认不挂到任何已保存的项目下，本人指定项目时除外。

### 发现项目整体有毛病
- 手上做别的事时，发现规矩、流程、工具这类以后每次用都受影响的毛病，不在这个对话里修，免得无关内容污染上下文：这里说一句发现了什么、交给了谁，手上的活接着做。
- Claude 另开一个对话去完善；Codex 在当前对话下交独立子代理，不新开顶层对话。交代只写毛病、怎么碰到的、什么算完善，不带这个对话的历史和私人内容。
- 手上的活就卡在这个毛病上时，先做不受影响的部分。
- 手上的活本来就是完善这个项目，或者一两步能改完的，当场改；Claude 改代码仍交 Sol。手上这件事自己的记录和进度不算整体毛病。

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
   },
   {
    "id": "p-bg-ask",
    "text": "后台在做、本人在问"
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
- 确需独立克隆（看外部项目、测真实行为）时放本任务临时目录，用完清理或按〔工程与交付〕的生命周期回收；干净且远端能恢复的克隆，用回收工具的 `-AllowCleanRepository` 核对后回收。

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

### 后台在做、本人在问
- 同一件事可能后台 AI 正在做，本人同时在对话里问，或者别的对话已经做过。不上锁，谁动手都先看三样：这件事的驾驶舱事项关了没有、进度写到哪；它归属的卡或文件写过没有；本人最近 3 小时的原话提没提到。
- 对话优先：本人问了就先用现成的答，不等后台，也不把后台正在做的重做一遍；本人说的新事实当场写进去，对话里做完就关事项，后台就不再开工。
- 后台发现本人已在处理就改期再看，到时还没写才自己做；写之前重读一遍，不用旧快照覆盖。

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
   "release": "E389",
   "sha256": "f95cc60380533e965b828fef389062af8ee8b0b09afa63034109bf06647af6be",
   "public_sha256": "72f4edc81fd0ffaea9ba9d3566f45218c8c3ae7ee0703e8238cfb6cd75e3d9f2",
   "from": null,
   "to": "## 改动与花费成比例",
   "start": 0,
   "end": 8341,
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
  "source_public_sha256": "72f4edc81fd0ffaea9ba9d3566f45218c8c3ae7ee0703e8238cfb6cd75e3d9f2",
  "source_rule_part": "rule-execution-coordination/rule-execution-coordination-06"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "原文·E389版，一字不改"
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
     "text_ref": "原文·E389版，一字不改"
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

原文 · E389 版，一字不改

# 分工与并行施工

owner: `E:\.agents`

## 本人定的分工和型号规矩（原约法 L22、L23）

别的规则写“约法 L22”“约法 L23”，指的就是这一节。这里的分工写的是 Claude 主持，代码的小事边界见 Claude 入口结尾“容易错的”那段；Codex 单独聊时它自己想、自己做，见 Codex 入口结尾和[Codex 适配](/rules/codex-adapter/#派子代理codex-的不同处)。

**L22 想和做分开，按成品的要求选人；质量优先，一次做对、少返工。**

- 主持的 AI 管想和把关：战略、头脑风暴、抽查、QA（质量检查），找出做事的 AI 没想到的地方，最后以人的角度看成品。具体的活派出去做，做完把结果送回来看：比如要抽查 50 张网页截图，就派别的 AI 截好送来，主持的只管看和判断；只有一两步就完的小事顺手做。
- 派给谁，看成品要什么：“能用就行”的（后台代码、脚本，报错就修），交能胜任里最划算的；要“惊艳”的（本人说要惊艳的，或对外给别人看的网页、视频、文案、设计），样板和关键部分交做得最好的亲手做，其余照样板铺开。
- 要惊艳的，样板定稿前和交付前各做一次头脑风暴，专想怎么从良好做到惊艳：把关只查做没做到要求，不会主动去想怎么更好。做事的 AI 也可以出主意，最后由主持的拿主意。
- 谁能胜任、谁做得最好，只看厂商公布的数据和 AA 这类权威评测，我们不自己测，本人说哪个强哪个弱也不算；现在的结果写在模型清单。
- 派不派、派给谁、思考多深、复核和质检做到什么程度，都按成品要求、能力和风险定，额度多少不参与判断；重大的事要独立复核。主持的 AI 不为省额度把活收回来自己做，也不为省额度少派复核、少做质检或降低质量。省额度靠一次做对、少返工；给别的 AI 交代任务，要一次说清、说人话。重复跑同一件事来比较或测试，超过 5 次先问本人：跑几次、用什么档、结果能改变什么；说不出能改变什么就不跑。
- 只有本人最新一条真实消息明确要 AI 看额度时，才查询 Claude 订阅用量、GPT 额度、API 余额等 AI 额度；没问就不查，也不绕工具或换来源查。本人给过的额度限制照办，不另外查询。例外：Muse 报错、迟迟不回或像被限流时，可以查一次 Muse 的剩余额度，分清是额度用完还是掉线、什么时候恢复；平时不查。

**L23 可派模型清单。** 保留一份可派模型清单，随新模型发布简单更新：新型号出来本人会说一声，AI 查清它比现有的强不强、划不划算，就按需更新清单、直接生效：AA 这类权威评测还没出数据时，先按厂商公布的数据暂定，AA 出了数据本人会让 AI 做一次短复核；厂商数据已经够判断的，直接定稿。清单所用评测换了评分方法、题集或版本，使旧依据失效或不可比时，AI 在现有每周治理里顺带发现，自动做一次短复核、同步清单，并在驾驶舱记下结果，不新建自动任务。授权、预算这类本人定过的事，换代时仍先问本人。Claude 暂时不派 Fable 5.1；新的 Fable 出来也照上面的办法定。Codex 里主对话用的是其他公司的模型时，可以派 GPT 的 Sol、Terra 和 Luna，不派最贵的 Astra。Claude 不用本人授权就可以派自己的子代理和 GPT 的 Sol、Terra、Luna（这三个便宜，Luna 不花额度）；派 Astra 要本人给这个对话或项目授权，有授权时要高档的活在 Opus 和 Astra 里选一家，不两家都派；两家同一级，可以互相复核。本人常忘了给 Astra 授权：遇到 Astra 做得更好的活（比如交叉复核），Claude 要提醒本人授权，具体哪些场景由 AI 定。Claude 只在跑专门要 Claude 来做的验收清单（比如核对 Claude 这边装没装好）时派 Sonnet，别的活不派。派出的模型调不动时，不降型号和思考档位，也不把 GPT 的活转给 Claude；额度用完或这个账号调不了该模型才提醒本人换账号，换好后按原型号、原档位重派，短时限流、满载和服务器临时出错交给包装器自动重试。分工按 L22，不因哪边额度多或少改；本人明确给过的厂商、型号和额度限制照办，不额外查询额度；本人只许用一边时，那一边的模型既把关也施工。跨厂商协作的方法可以通用；派出的 Codex 按自己真实的身份和有效授权，只做交给它的任务。已有许可在原范围内继续有效；“只限本对话”不扩成其他对话或项目。

## 派子代理的原则

Claude、Codex 的任何模型及子代理访问 Muse，都走搜索技能的 Muse 入口（`E:/.agents/skills/news-quickcheck/SKILL.md#muse`），按[以本人身份使用 Muse 的长期授权](/rules/authorization/#长期授权)用本人第一人称、像正常人聊天一样说话。提问、自动补句、资料正文、协作说明、更新通知和会话标题都照办；不用编号格式、工单式字段，以及“派单、交付物、原链、亲历／转述／官方”等工作用语。要链接、分清消息怎么来的，就用平常聊天的说法表达，标题也像人起的。只改说话方式，不加其他技术手段。

所有子代理由根会话总控，只按授权、派单范围、测试上限和验收方式交付，完成即汇报结束；范围按下文“派活松紧怎么定”判断，不增加与目标无关的检查、诊断、扩展取证、原话审计、重复改写或汇报。测试上限为 0 时不写测试，已有验证够用就停；范围外发现只写一句建议。派单动作可能删数据、越权或造成损失时，停下该动作并交回根会话。

出处由根会话负责：写派单时区分本人原话与 AI 补充，原话存档里的源消息 UUID 也算出处。派活不附原话清单、要求表或相关决定；子代理照派单做，不查出处、不报“无出处”，只交回任务中的实质冲突和未知。

1. **按约法 L22 分工。** 判断和写给本人的字主持自己做；Claude 主持时代码一律派（小事边界见 Claude 入口结尾“容易错的”那段）。翻一段聊天、读几个文件这种一两步的主持顺手做。其余施工按成品要求派发，相关动作合成一单，不一个点击派一次。怎么派一单见 `dispatch-work` 技能。
2. **按成品和公开数据选人，能胜任的最低一档就够。** 计划注明成品是“要惊艳”（本人说要惊艳的，或对外给别人看的）还是“能用就行”（测试、报错可判断），本人可改。前者样板和关键部分交最好的，其余照样板铺开；后者交最划算的，机械活交最便宜的。只用厂商、AA 等权威评测判断能力，不本机试跑比较、不用本人强弱印象作依据（约法 L22）；当前选择见模型清单 `routing`。按剩余难点选档位，需要时可高于根会话，不逐次问。
   给人看的图、地图和示意图，样板交公开评测最好的模型，做法见 推荐流程（`E:/.agents/skills/report-page/references/decision-reports.md`）。
3. **质量和额度按约法 L22。** 本人给过的额度限制照办，不另查额度。
4. **每次显式写型号和档位，派完核对实际值。** 按模型清单（`E:/.agents/config/model-roster.json`）的场景选择职责，再从 `routing.model_families` 解析当前型号和档位；所有厂商、家族及以后新增的模型共用这份登记，不在程序里分别写换代分支。已经登记为被替代的型号不能从旧提示、原生入口、包装器、续作或后台重试继续派出。无数字的新命名也登记替代关系，不凭名字或参数大小猜强弱。换代仍按约法 L23 和“新型号怎么调研”重评，不沿用未经核定的旧档位。
5. **复核按本次改动的风险定深浅**（约法 L22）。主持先看改动、相关测试和实际运行验收；代码以能用、能根治、能维护为标准。再看坏了会有什么后果、能否撤回、测试能证明多少、影响面多大，决定不另派、聚焦复核还是完整复核，在计划中用一行写明档次和理由，本人随时可改。
   - **不另派复核。** 测试和实际运行能证明对错、可以撤回、影响面小的改动，由主持验收即可，例如普通脚本和后台的报错修复。删 AI 产物和能重建的东西（缓存、临时目录、AI 生成的代码、日志、截图、已推送的工作副本）也在这一档，删除本身不等于重要。
   - **聚焦复核。** 每个会话或每轮都会用到的 Hook、入口、共用组件，或者故障不容易发现的改动，只查计划中列出的风险点，给改动差异和相关上下文，不重审整个项目。
   - **完整复核。** 会导致泄密、把本人锁在外面、丢本人原件或唯一数据或不可逆后果的改动，包括密码中心（PasswordCenter）、授权、本人验证、资料锁本身，以及有上述后果的迁移和删除。产品和战略上的取舍不交复核，按[先给本人看样子，再做](/rules/engineering-delivery/#目标优先于实现)办。主持先理解本人原话，再给复核者本单必要的事实、约束和改动，分清已核事实、未知和主持的推断，不附原话清单、不预设结论，让它先独立形成意见。

   需要复核时，按模型清单的复核分工（`routing.current_generation_defaults` 的 `review_*`）选人：照清单核对和要动脑判断的分开，判断型不交施工型号；至少用独立的上下文。只提有证据、反例或失败路径的实质问题，没有就直说，不为凑问题改东西。同一个改动只复核一次：只修会造成上面那类后果的问题，修好由主持用反例和测试核对，不再派第二轮；其余建议不返工。后续更新按本次变更的风险重定深浅，用已有回归测试守住旧风险；碰到测试守不住的那一处，再做聚焦复核。主持仍负责最终验收。重大动作前的“把关”另按[重大动作与本人验证](/rules/protected-actions/)办理，不受这三档影响。
6. **一次交代清楚。** 派单按下节“派活松紧怎么定”，只给本单必要的目标、事实、授权、测试上限和验收方式，用中文说清，不灌历史。改动要在真实环境里跑的（后台服务怎么启动、数据从哪来、事件谁先谁后），派单写清这些事实，并要求在真实环境里验一次，不只拿假数据测。交付分清事实与推断，附结果、验证和未解决风险。
7. **根核验规则和判断资料需求，子代理按需读专题。** 原生派发前由根核验，包装器 Start/Resume 机械 Inspect；给出通过版本和专题路径，子代理不自行核验、不通读根规则。公开范围、资料锁和授权只引用现行专题，不写摘要、不沿用决定记录的旧说法；公开内容先读[个人资料与数据处理的公开分级表](/rules/privacy-data/#公开个人数据分级表)原文。

   根派活前判断资料需求，需要时先请本人验证解锁，不先派“只用给定材料”的降级版本。资料期全机共用，子代理从正式入口取用，不重新判断或发起验证；实际被拦、途中缺资料或到期时单列“需要本人资料：<缺什么、为什么>”交回，根解锁后补做，不用已记事实凑、不收降级结论。举例可以用假设或亮点，不为找真实例子读私人资料，不把假设说成真事。派活固定写：“需要本人私人资料而资料锁着时，不自己发起解锁，只写明缺什么交回（汇报里单列一行“需要本人资料：……”），不用已知事实凑、不降级回答（约法 L18）。”GPT 包装器已附带，不重复写。
8. **本人的限制优先。** 本人明确限定的型号、厂商、档位或预算，子代理和后代都照样遵守，不能自己放宽。子代理的业务范围和授权只能比父代理窄（见[用户授权](/rules/authorization/)）。
9. **可派范围看模型清单。** `config/model-roster.json` 只作参考，不当门禁；更新和本人已定的型号限制按约法 L23，新型号按下文调研。项目专用分工不自动改成全局默认。
10. **接力做一样成品，要有一个人对整体负责。** 几段接力做同一个成品（例如写、画、审、拼）时，由根会话或指定的一个负责人对最终成品负责，亲自看它在真正被使用的地方的整体（截图、录屏可以派人在真实环境里采好送来）：比例、版式、空白、前后是否一致。各段的自查只管自己那段，替代不了成品验收。先做一个从头到尾的完整样板定下规格，再批量做；几段共用的规格（尺寸、字号、版式、禁令）只写一处，各段引用。
11. **盲审、盲测和盲调查。** 三个说法意思不同，不混用：
   - **盲审：**专指无上下文环境的审：审的人只看得见给定的材料和提示词，不带本机的规则、记忆和上下文，也看不到其他 AI 对同一件事的意见，就像外人第一次拿到这份东西。带着本机环境审的不算盲审；桌面版和 Codex 派的子代理开场就带着本机全部环境，不能用来盲审。不管审的是 Claude 还是 ChatGPT，Claude 和 Codex 都这样办：
     1. AI 在 `E:\Cache\BlindReview\<日期-事项>\` 准备一个文件夹，只放要给的材料和一份提示词；几位审的人拿同一份材料和同一份提示词。
     2. 本人自己去聊天网页开一个全新的对话：不开记忆、不设个人偏好、不进项目、不添加本机文件夹；上传材料，写上提示词（可直接用文件夹里那份）。
     3. 本人把回答原样交回 AI，用完清掉文件夹。
   - **盲测：**有上下文、模拟本人的行为测试：测试者带着上下文，像本人那样去用、去操作，看实际表现；可以派子代理，几位测试者各自独立、互不看结果。
   - **盲调查：**每个参与者独立调查，可以派子代理：给同一份事实上下文和本人中途的同一批更正，不给、也不让它去找其他 AI 对同一件事的意见（包括本人粘贴来的）和其他参与者的结果，读取路径要隔开。
   - 各方结果收齐后，主持中立地向本人汇报：各方结论并排、照原意呈现，不替哪一方加减分；主持自己的看法可以提，但单列并标明是主持看法。

派出去后继续做不冲突的事，不空等。还有自己能推进的步骤时不结束这一轮。本对话能做的事不另开新对话卡片，项目整体有毛病（`#发现项目整体有毛病`）时除外。Git 里能找回的不算唯一数据。本人叫停主任务时，一起停掉已知的子代理。

主持按时限和风险，或在风险、卡住、纠偏时看已有思考摘要，不看逐字推理流，不要求额外进度或给只读小单加固定检查。验收只核对派单结果和规定验证。
用 `tools/Get-GptChildDigest.ps1 -RunDirs @('<结果目录>')` 只读新增，按条数和字数上限查看；读子任务日志必须共享读取，读完即关，不能占住文件妨碍写入。

Claude 主持时负责想、把关，以及模型清单交给它的惊艳样板和关键部分；本人指定由 Claude 写的成品、分析、文案、正式法律文书及价值偏好理解照旧。施工、采集和清单审查按场景表派。GPT 可提清单外实质问题；出主意时给原始材料和未定问题，不预设 Claude 答案。抽查由 Claude 定风险，GPT 给完整材料清单，Claude 可自选样本。

本人明确限制只用一边时，由该根会话全程派发和把关；只有 GPT 时，不等 Claude。确实无法在本人限制内完成时，交回已做结果和需要本人定的事。另一家公开评测优势确实影响结果时说明差别和数据缺口，无数据只说缺口。Claude 派 GPT 的入口见[Claude 适配](/rules/claude-adapter/#派-gpt)。

本人新说的一句只覆盖它明说的那件事，没提到的旧分工照旧，做法见 推荐流程（`E:/.agents/skills/report-page/references/decision-reports.md`）。

未经本人许可，不启用 fast 快速模式。故障后按下文“原生容量不足与原线程接续”核对并接回原任务；真实额度恢复后在原对话继续，并告诉本人。

新开一个顶层任务（新对话）只在确实有独立的成果和责任时才做；项目多、工作量大或空槽满了都不是理由。AI 新开的顶层对话默认不挂到任何已保存项目下，本人指定项目时除外。Codex 不自行新建顶层对话，按[Codex 适配](/rules/codex-adapter/#派子代理codex-的不同处)执行。

## 发现项目整体有毛病

手上在做别的事时，发现项目整体性的不完善，另开一个对话去完善（这算有独立的成果和责任），不在这个对话里修，免得无关的内容污染它的上下文。Codex 的处理方式见[Codex 适配](/rules/codex-adapter/#派子代理codex-的不同处)。

- **什么算整体性。** 规矩、流程、工具这类以后每次用都受影响的毛病。手上这件事自己的记录和进度不算，照常改。
- **这个对话做什么。** 说一句发现了什么、交给了哪个对话，手上的活接着做。手上的活就卡在这个毛病上时，先做不受影响的部分，新对话修好再接。
- **新对话的交代。** 只写毛病、怎么碰到的、什么算完善，不带这个对话的历史和私人内容。怎么开按各宿主适配。
- **不用另开的。** 手上的活本来就是完善这个项目；或者一两步就能改完。

## 派活松紧怎么定

底线对 Claude、GPT 和所有派发入口都一样。当前分档里的“GPT 比 Claude 略弱”不等于判断力不够；型号强弱只影响少数地方，例如代码、规则由谁定方案、谁按方案施工，不能据此把派单写成逐步操作说明或收回自主找路。型号选择按模型清单当前评测，不把某一代的分档固定成永久身份。

- **底线写明、不得越过。** 不可逆或难撤回的删除、发布、代本人发消息、付款、改账号设置等动作，必须具备相应授权；个人资料、凭据、本人验证和未授权事项按同版相关专题办理。本人审定的对外原文、价值取舍和偏好不擅自改写或重新解释；拟稿按派单给定意思交根把关。事实不编造，没查实的原因不当事实，机器回复不当结论；对外按项目口径，不擅自认错、不放狠话。共享标签页、他人文件和分支等边界照旧。已有授权按规则执行，不因列在这里重问。
- **代码、规则和测试写明范围和行数。** 派单写明改动范围、Sol 的净增行数上限和测试上限；完成目标必需的文件可以改，汇报写明；行数不够在打算里说明还差多少、为什么，由派单人放宽，不算做错。范围内的技术做法由执行者判断。这一代 Sol 要限行数是本人的要求（本人 2026-11-05 02:03）；具体数字是派单人按大小估的，不为守数字砍掉需要的功能。授权、数据和对外边界照旧卡住。
- **现场办事主动找路。** 网页、表单、客服、申诉、找东西等任务写目标、已知事实、授权、底线和什么算办完（按结果定义），由掌握现场信息的执行者查看、尝试、找入口、走下一步，例如申诉不通过后查看升级申诉；不等派单逐项写到，不规定只能试几次。此项不因型号分档收回。可撤回的看页面、试入口、换说法、重试、换分类，以及底线内的对话说法和查资料范围，执行者自主判断，够用即停；相关旁边问题顺手处理，涉及代码、规则或测试仍守预算，无关问题只汇报一句。
- **换路是换一类办法，不是换参数。** 同一个小目标用同一类办法两次没成（同样的报错、同样没结果），不试第三次：先看实际发生了什么（真实报错、开工后新出现的文件和进程、页面或程序现状；工具报超时或取消也要看结果是不是其实已经落地），再回到目标换一类办法；想不出就先做完不受影响的部分，写汇报交回。每次报错不同、结果在变的是在逼近，不算卡住。对网页或系统做的临时改动用完就还原；改完出问题先还原，不在改坏的状态下接着查。
- **不替现场写死步骤。** 派单人没见过的页面、表单和流程不替执行者假设；只有确认某条路唯一可行时才规定步骤，既往经验写成“参考”。碰到底线停下受影响动作交回，其他情况换路继续；工具故障、资料缺失按各自规则交回；时限是估计，到点报告已有产出和剩余工作并接着做；不编造完成。

模型换代或强弱排序变化时，按“新型号怎么调研”更新模型清单；本节的自主程度与派单写法，过了那里的门才回看。约法 L23 和上述底线照旧。

::screen{#rule-execution-coordination-07 section="original"}

```typeset
{
 "screen": {
  "id": "rule-execution-coordination-07",
  "section": "original",
  "shape": "source_text",
  "source": {
   "file": "docs/contracts/agents.execution-coordination.md",
   "release": "E389",
   "sha256": "f95cc60380533e965b828fef389062af8ee8b0b09afa63034109bf06647af6be",
   "public_sha256": "72f4edc81fd0ffaea9ba9d3566f45218c8c3ae7ee0703e8238cfb6cd75e3d9f2",
   "from": "## 改动与花费成比例",
   "to": null,
   "start": 8341,
   "end": 20029,
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
  "source_public_sha256": "72f4edc81fd0ffaea9ba9d3566f45218c8c3ae7ee0703e8238cfb6cd75e3d9f2",
  "source_rule_part": "rule-execution-coordination/rule-execution-coordination-07"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "原文·E389版·续"
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
     "text_ref": "原文·E389版·续"
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

原文 · E389 版 · 续

## 改动与花费成比例

- **施工范围和上限按上节给定。** 已授权目标必需、内容已核验、不改变实体权利的前置手续直接办；无关的新问题不塞进运行中的单子。
- **时长要合适，超时是信号。**
  - 时限只算干活的时间：网络波动、模型满载重试、等额度恢复的时间不算，按包装器记下的重试和等候时段扣除，另行列出。
  - 扣除后到点把已有产出、卡点和剩余工作报给根会话，接着做，不停；根会话觉得不对再调整范围、做法或喊停。叫醒了一直没回应，到 3 倍才停。
- **交付先看 `git diff --shortstat`。** 超预算时看多出来的是不是必要、能不能更简：能更简的退回改小，确实必要的说明理由照收；汇报写明加删行数。
- **测试和验证按需。**
  - 已有测试兜得住就不加；只给真出过、容易再犯的错加一个最小测试；不写只核对回执或产物指纹的测试；
  - 只验改动影响到的范围，全站、全量检查留到发布前跑一次。
- **要自己定方案的，不交 Sol。** 这条按模型清单当前分档用于改代码、改规则的架构、跨模块改动和设计取舍：方案定好再交 Sol 在范围和行数内施工，谁定方案看模型清单场景表。办事类任务可派 GPT（包括 Sol），按“派活松紧怎么定”给目标、事实和底线，由它临场判断。
- **够用就停。**
  - 能直接答的不查；需要查证时先搜官方文档、已有研究，查已有日志和回执，能搜到可靠资料的不实测。
  - 权威评测、厂商和媒体的可靠资料可采信，不因“没亲眼看见”坚持自己验证；模型选型按权威评测和厂商数据，不自己实测。
  - 只有查不到可靠资料、且实测结果会改变决定时才实测；动手或派单前写明会改变哪个决定，以及必要的流量和时间，不为估算查询账号额度。
  - 拿真实 AI 跑测试时，真技能、钩子和本人的 Chrome 都可能被触发，`--ignore-user-config`、`--ephemeral` 这类开关断不开它们：先确认题目不会动到本人的东西，先跑一个看有没有副作用，再批量。
  - 不写没有意义的机械测试和过度测试；测试只覆盖会改变结果的关键路径。
  - 证据已经足以说明结果就停，不为“完整证明”去重建、穷举，也不重跑已经通过的部分。
- **替换后的旧实现**按[仓库和过程材料](/rules/engineering-delivery/#仓库和过程材料)删除。
- **汇报几行。** 写做了什么、结果、还剩什么、加删行数；证据只给路径。

## 卡住了怎么办

目的是不让真实任务无意义地耗时间。

- **开工时定产出。** 预计超过 30 分钟或成批的活，开工时告诉本人预计多久，派单写“产出”（看得见、数得出的东西：存下的文件、通过的测试、写好的小节）和时限（只是估计，到点只叫醒主持）；包装器按产出有没有增长叫醒主持。短活不写。原生子代理没有这个提醒，时限写短，按时交回。
- **按产出查，不按忙不忙查。** 被叫醒或到检查点时只看产出涨没涨。一个检查间隔没涨、明显落后，或同一报错第三次出现，算卡住。
- **先查现场，再换脑子。** 先看真实报错原文、开工后新出现的文件和进程、现状和已试过的办法；事实已指明出路就直接纠偏。看不出，或想到的只是原路的变体，就请一个没参与过的模型（和卡住的执行者不同家，至少是新上下文），只给目标、事实、已试过的办法和底线，请它给三条做法不同的路，各写第一步怎么验证，不给自己的猜测。
- **原地纠偏，不收工。** 选定的路用 Steer 发给运行中的执行者，已结束但没做完的在原线程 Resume，从现有进度接着做。时限到了还没做完，按剩下的量重估时间接着做，不当成收工。
- **推后就说。** 完成时间推后时在对话里告诉本人一句：卡在哪、换成什么办法、新的预计时间；不停工、不等回复。
- **问本人。** 只缺本人才能做的事（登录、授权、拿主意）立刻问；换了两类根本不同的办法仍不通，带可选做法来问；问的同时继续做不依赖答案的部分。
- **被追问先查事实。** 本人追问或质疑时先核对现场事实：事实没变就说明原判断为什么还成立，事实变了才换办法，并说清是哪条事实变了。

## 做错了怎么办

升档、换人看根会话验收事实。

- 缺材料、交代漏了、工具出错、执行者中途断了：补上，在原线程、原档位接着做，已有的有效结果照用。这些不算做错。
- 有明确的错，也知道怎么改：带反例和验收要求，用 Steer（运行中纠偏）或原线程 Resume（续作）就地纠正，改相关部分，不从头重做；Claude 主持时不自己补（一眼看清的错字除外）。只有会造成损失、越权或本人明确叫停时才 Stop（停止）；任务仍要继续的，停的同时安排接手。
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
- **同额度子代理单独报耗尽时立即原线程续作。** 仅同一 Codex 额度下根会话仍可正常调用、子代理报额度耗尽时适用，不等额度恢复。原生 GPT 子代理用原代理的 followup（续作）入口，其他公司模型主持的原生 GPT 子代理用原 `openai_child`；包装器任务启用 `-ContinueOnQuota` 后立即在同一线程续作，后续失败短暂退避再试，并持续受本轮时限约束。不得用 Start、新代理或新顶层对话替代旧任务。根会话也调不动、真正共同耗尽时，按[Claude 适配](/rules/claude-adapter/)“模型调不动时按原因处理”提醒本人换账号，换好后接回原任务；Claude 默认不启用该开关。登录、参数或上下文出错时，修好真实原因后接回原任务，不乱换型号。
- **一直有人管理到交付。** 包装器 Start、Resume 的返回只表示本次等候结果；`still_running=true` 时立即照返回的 `watch_command` 挂后台 Watch，同一任务同时一条，每次返回后仍在跑就重新挂。需要时 Status/Check 核对真实状态，运行中纠偏用 Steer；到时限被叫醒时按上文看产出，觉得不对才 Steer，要改时限用 Extend；任务已结束要接着做用 Resume，继续 Watch。原生任务用本宿主的查看和等候入口持续跟进。根会话继续做不冲突的工作，不能因后台还有任务就结束整个主任务。
- **停止与验收由根负责。** 本人叫停主任务时，停止全部已知原生任务、后代和包装器任务；停止等候命令不证明任务已停，要回读状态。执行者消失时先看已有改动和汇报，再在原线程 Resume。终态读取本轮 `report.md`、`last-message.md` 并核对实际成果和验证，不能把启动、入队、子代理自报完成当最终验收。包装器任务成功或主动停止后的会话清理沿用[Claude 适配的清理规则](/rules/claude-adapter/#派-gpt)。

## 新型号怎么调研

本人会告诉 AI 有新型号或新档位发布了，AI 就照这个办法查、按需更新模型清单并直接生效（约法 L23）；本人要求重估分工时也照这个办法查。AA 等权威评测还没出数据时，先按厂商公布的评测数据暂定，在模型清单里标“暂定”；厂商数据已经够判断的（例如同一家的新一代旗舰明显更强），直接定稿。本人说 AA 出了数据时，对这次新型号相关的选择做一次短复核：结论变了就改，暂定的核实后去掉“暂定”。模型能力（会不会做、做得好不好）只以厂商公布的数据和 AA 等权威评测为准，不在本机试跑比较，本人说的强弱也不作依据（约法 L22）；运行上的事实（宿主支不支持、派出去实际是哪个型号、多慢、会不会卡住）照实际使用记录。要找的是每类活能胜任的最低一档：先能胜任，再比较公开数据中的速度和价格，不查本人账号额度。结论落到模型清单 `config/model-roster.json` 和两个宿主适配的用法。

1. **身份和可用性。** 从官方发布页、模型文档和价格页查型号 ID、价格（输入、输出、读缓存）、上下文、有哪些思考档位、默认哪档；在新开的对话里核对宿主能不能派、派出后系统提示里写的实际型号。再看多了什么新本事：新工具、新输出格式，现在哪个绕路的做法可以换（比如生图能不能直接出动图）。采集交 Sol ultra，判断根自己来；Sol 交回原文和出处，把原文写的和它推断的分开。
2. **先弄清分数量的是什么。** 以 AA 为主，按档位、按场景看：每个评测的题长什么样、分数怎么算，对应本人哪类活（模型清单 `routing.evals`）。分数是在很难的题上比高低，不是日常活的成功率；各档位分开看，最高档的分数不能给低档作证。评测页把分数、花费、耗时嵌在页面数据里，图上读不出时用浏览器从页面数据读；取不到的说明缺口。花费只在同一家里比，两边订阅额度各自独立。资料能说明哪类活更好，就只据此决定哪类活派谁，不把分数翻译成日常成功率或行为已经改好；爱不爱问、说不说人话这类，不从榜单上下结论。某一项判断不了（几家对不上、版本或档位比不了），那一项先沿用，能看清的照常调，告诉本人缺哪一项，不让他替 AI 解读榜单。
3. **和现在的选择比。** 同一类活的相关评测上，新型号或新档位不低于现在的选择、耗时不更长、价钱没明显变贵，就可以换上；更强但更慢或明显更贵的，现在的型号胜任的活不换，胜任不了的和要惊艳的换，告诉本人一句；能胜任之上的分数只换来多等、多花。要惊艳的活看成品质量和审美类的评测（例如成品两两盲评、网页设计的人类偏好榜），不只看编程分。
4. **第三方评测和社区反馈。** 只采用有方法、有样本的评测；每条写来源、日期、样本多大、可能的偏差；厂商公布的评测数据可以作暂定依据，没有数据的宣传说法只当线索。互相矛盾时写明怎么判断，推断标明是推断。实际用的人怎么说，用 `news-quickcheck` 查，同时查官方；新本事到底能不能用靠它，强不强只当线索，不决定派谁。
5. **落地和记录。** 完整数据连同出处和查询日期写进 `docs/research/` 下带日期的调研记录；模型清单只写选择和起决定作用的几个数，注明查询日期。模型路由（哪类活派哪个型号、用什么档位）按数据直接更新；授权、预算这类本人定过的事要变先问本人（约法 L23）；都写清依据和怎么撤回。新型号的实际派出核对列进待验收清单。给本人的话只有四句：是什么；强在哪（带来源）；多了什么新本事；换不换、看不看限制。不看限制的写比了哪个评测、各多少分。决定结论的那几条根自己对过原文。
6. **所有入口一起换代。** 各项目的职责、授权和出处仍登记在 `project_models`；型号的当前值与前代替代关系统一归 `routing.model_families`。评估确定上位替代后，通过统一更新入口（`E:/.agents/docs/operations/model-routing.md`）登记，自动保留前代、同步各宿主候选、项目当前选择和原生角色模板；原生派发、包装器、直接调用、续作、重试及 AICLI 都消费同一登记，不再逐个补旧型号映射。各项目和技能中的直接引用一并核对，研究记录和真实历史不改写。换代不扩大厂商许可、Astra 授权或预算；这些取舍要变仍问本人一次，单纯把已核定的前代换成当前替代型号不重复请示。宿主不支持原生旧代理换型续作时，返回 `model_migration_required`，由根会话把原目标、已有文件和未完成项交给当前型号接续，保留旧记录；不在旧型号上继续，也不伪造同线程换型。每周治理沿现有入口核对遗漏的当前引用，不新增定时任务。强弱次序变了（新型号接过这家最难那类活的默认，不要求明显强过）：根同时改项目里按“最强型号”选的当前值；本人固定的厂商、职责和授权范围照旧，统一更新入口不替根判断。同一家族只有部分活该换：新型号用不同的稳定键单独登记、不写前代，只改那几类活的派法，旧型号留着做别的；限制照样跟上一代走；整族都换才跑统一换代。
7. **过了门才拆脚手架。** 过了下面的门时，把各道钩子和检查最近的命中记录给新型号当线索；它和根判断换代后没有收益的，连规则句子和检查代码一起拆。

### 限制：比得过才重看

新模型明显强才重看写给上一代的限制（本人 2026-11-05 02:15、02:54）。每个新型号都看派不派、多了什么新本事；限制只在过了下面这道门才看，没过一个字不动，告诉本人比了哪个评测、各多少分。本人没说新型号出了，什么都不发生。

- **门：** 第三方评测显示它不低于这家现在最强的，而且明显强过上次读过限制的那个型号；还没人读过，就是这些限制当初针对的那个。清单上不派的不算（比如 Fable）。同一批发布的型号都和更换前的比，比完再更新清单。
- **看什么：** 只看第三方评测（AA 这类权威评测、有方法有样本的媒体评测）。厂商的话和实际用的人怎么说只当线索：厂商数据能定派谁，两样都开不了这道门。只有厂商的话：限制先沿用，模型清单 `limits` 记“等第三方评测”；每周治理查到评测出了，进驾驶舱给本人一句可复制的话，他贴给 Claude 就接着看。
- **什么算过：** 第三方的综合结果（AA 总分这类）明显高过它，评测标了误差的，差距要超过误差；派给这家的活里，有对口评测的没有哪类明显变差。新旧都比清单默认档，这一档没有分算比不了；几家综合结果对不上或比不了，都算没过。根写得出哪个评测、测什么、各多少分；写不出不算。只有个别几类活强、综合没明显高：那几类换派它，不读限制。
- **按实际达到的条件定，不按旧名字。** 新 Sol 比过 Astra 就读，新 Luna 比不过就不读。新 Fable 先定派不派（约法 L23），不派不读。型号改了名字走现有登记前代的办法，写着旧名字的行按前代算写给它；新名字不代表更强，也不代表读过。
- **没读过的型号，** 遵守前代当时实际在守的限制（前代读过改了的按改后的），这不表示这些限制对（本人 2026-11-05 02:17）。放到眼前明显不对时：结尾那段说清哪句不对、想改成什么，等本人点头；单子上的行数上限在打算里说，根放宽；Sol 不定大方案，留言交回根定；其余的句子按本人要的结果做，当场说一声。
- **什么时候读：** 评测出来就读（本人 2026-11-05 22:18）。

**新型号读一遍。** 想得到一张表：每条留、改成哪句、或删；说不准的写说不准，这条沿用。没有不合格，全留也是结果。只开一个，读一次，不跑任务、不试跑、不查记录。

- **谁读：** 被评的新型号自己读，别的型号不代读。登记好、定义重新加载后再开，用清单默认档；它第一句报系统提示里的型号，不是新型号不算读过。Claude 主持：根开一个新 Claude 子代理，根已经是这个新模型就自己读；新 GPT 走现有包装器。Codex 主持处理新 GPT：根开原生子代理，根已经是它就自己读。单独在 Codex 里处理 Claude 换代：做完采集和核对，把材料和要问的话写成一段可复制的话交本人转给 Claude，GPT 不代读，也不调 Claude。新 Astra 读这一遍的授权见[用户授权](/rules/authorization/#长期授权)。
- **另一家复核（本人 2026-11-05 22:18）：** 表交回后，另一家现在最强的看一遍：新 Claude 读的交 Astra ultra（属于 Claude 写的东西的完整复核），新 GPT 读的交 opus-xhigh。只给表、读的材料和问话，不给根的看法；也按直觉，不跑任务、不查记录。它只说哪条删错了、留错了、哪条理由像在替自己说话，不改结论。两家说法不一样的，两边都列给本人。单独在 Codex 里处理时 Codex 不派 Claude，要 Claude 复核的写成一段可复制的话交本人转。
- **读什么，只读会作用到它身上的：** 模型清单 `limits` 里写给它这个型号和这家的行，根贴上指向的规则原句全文，有原话编号的也贴原话；上下文 Hook 运维（`E:/.agents/docs/operations/context-hooks.md`）开头那张表里作用到它的行，现成的命中次数附上，只当线索，不另查；结尾那段；GPT 还读自动带的开头；厂商的换代说明和写提示的建议。别的型号的不读不改。同一型号不用每档各读一遍：结论写明适用哪些档，只针对这一档能力的理由不顺带放宽别的档，说不清的档先沿用。
- **问什么（这段就是给它的话，贴在材料前面）：**

  > 先说一句你系统提示里写的型号。
  >
  > 下面这些话是写给上一代的，不一定是上一代的最优解，别按它们是对的来。这不是考你，也不测你听不听话。不跑任务、不查记录，全按直觉。
  >
  > 每条（理由相同的放一起说）：想一件常见的实际工作，再想一件它最该管的活。没有这句话你会怎么做；加上它，哪一步会改变；这个改变对本人是帮忙还是添麻烦，是让你多做了还是少做了。原话说的那件事放到你身上还会发生吗，厂商说明里有依据就写哪句。
  >
  > 然后定：留、改成哪句话、或删。这句话解决不了但事情还在，写换成什么说法或程序提醒才行，想不出才删。说不准就写说不准，这条沿用，别写成已经证明有用。不用每条都填满，也不用凑删的。你变强了，不等于别的型号的限制也能放开。
  >
  > 你开场读到的那一页，哪句放到你身上明显多余，顺带说；“最要紧的”那几段、授权和预算不用写。

- **不问它：** 撤不回的事、重大的事、资料锁、密钥、标明“禁令”的；本人的事本人定那条线；授权和预算（约法 L23）；生图提示原样转交、生图比代码强（本人 2026-11-05 18:12）；挡的是工具毛病、不是模型能力的程序。

**决定只作用于它。** 它的后代跟它走，其余型号不受影响。它变强不放宽别的型号和别家的限制，也不能宣布别家的毛病改了。共用的一句话不删，句后写“Opus 6 起不算”这样；GPT 自动带的开头和程序说的话，要不一样时按型号分开带（脚本交 Sol）；其他型号都不用了才真删。

**谁改、怎么生效。** `limits` 只记这次判断，限制要改变，改的是它指向的原句和确实执行这条限制的程序。句子根写，脚本交 Sol。根不替它改结论，觉得不对写在旁边给本人看。全留不动任何句子，`limits` 记“X 读过，全留”。

- 原句在开场那一页或两家结尾那段：先给本人看这句，他点头才上；没点头 `limits` 记“待定”，不算放开。
- 原句在别处（派活技能、GPT 自动带的开头、程序说的话）：结果和复核的不同意见单独列给本人，标“AI 建议”，他下一条回复没反对就改，发布时写他那条回复的编号；没回复不算同意，先沿用，`limits` 记“待定”（本人 2026-11-05 22:18）。全局规则（专题）里受发布检查的限制句，检查不认“没反对”：单独标出，要他回一句明确的话。

**删了留痕。** `limits` 里删的行不抹，写清哪一代删的、为什么。

**谁撤回。** 不另安排定时检查。本人指出问题，或根在正常任务和验收中发现放开后出了问题，就由当时负责的根处理，按分工恢复或改正。它的后代下次读时，连前代删过的行一起读，可以写恢复；比不过的不读。`limits` 帮着找回当时改了什么，不保证错的后果撤得回，也不保证一定有人发现。

**跟着看的和不看的。** 派谁、什么档位、多了什么新本事：每次新型号都看。`limits`、结尾那段、GPT 自动带的开头、程序做的事：过了门才看。开场那一页其余的话：新模型觉得哪句明显多余就提，本人点头才上。两类 Astra 长期授权：换代时先问本人沿不沿用。最上面那几段、本人明确要的、授权和预算不随换代。生图只查新本事、改型号标签。两家适配里的工具用法碰到才改，其余旧规则不普查。

改分工的快做法：
- **只改分工数据**（哪类活派哪个型号和档位、场景表、依据、不派的理由、新的 Claude 子代理模板）：改 `config/model-roster.json` 和 `templates/claude-home/agents/`，完整数据写进调研记录；跑 `agents-charter`、`agent-runtime-compatibility`、`duplicate-content` 三项测试，合并推送并快进活动检出 `E:\.agents` 就生效。这些文件不在规则发布快照里，各会话直接读主分支，不用发新版本；新的子代理类型在定义重新加载后出现，派一次核对实际型号。
- **改规则文字**（分工的做法、这套调研办法、各专题里的说法）：按[规则发布](/rules/rule-release/)选快速发布或标准发布；快速发布入口的 `-Mode Inspect` 会说明这些文件走不走得了快速通道。
- **发布后**：回读活动版本；通知正在派活的会话，只说改了什么、从哪一版起。

## 多个任务同时改东西

- **各用各的工作副本。** 每个施工任务用自己的 worktree，合并冲突先理解对方改动，不覆盖。工作副本从本机已有仓库用 `git worktree add` 建；确需独立克隆（看外部项目、测 Git 行为）时放在本任务临时目录，用完清理或按[生命周期回收](/rules/engineering-delivery/#下载临时文件和清理)，干净且远端可恢复的克隆用 `Move-TaskItemToRecycleBin.ps1 -AllowCleanRepository` 核对后回收。验证、合并推送、远端回读、活动检出快进和分支清理统一按[Git 收尾](/rules/engineering-delivery/#git-收尾)，别人未提交或不能快进时不动并说明。只读和测试无需 worktree。已并入且干净的副本按[清理入口](/rules/engineering-delivery/#下载临时文件和清理)用 `git worktree remove <精确路径>` 删除，或 `Move-TaskItemToRecycleBin.ps1 -AllowLinkedWorktree` 回收。回收核对实体后清 Git 登记；目录已不存在的无损旧登记顺带清，分支和提交保留。盘未接上就留登记，脱离分支的提交先挂到分支再清。
- **依赖只等具体产物。** 要用别的任务的产物时，说清等的是哪个提交、回执或文件，只有用到它的那一步等；源码接线、局部验证、合并预演这类准备照常先做。整单挂起“等某任务做完”属于过度串行。短锁（见下条）只锁那一下单点动作，不锁准备。
- **单点动作前加一把短锁。** 安装或升级软件、发布规则、改计划任务这类会互相影响的动作，动手前用 `E:\.agents\tools\Invoke-ShortLock.ps1` 领锁，做完马上释放。同一种动作共用一个清楚、固定的锁名，持有人写当前宿主和真实任务号。先用 `-Mode Inspect -Name <锁名> -Json` 看现状，再用 `-Mode Acquire -Name <锁名> -Holder <当前任务> -Minutes 30 -Reason <一句话> -Json` 领锁；成功后才开始单点动作。别人的有效锁还在时，等它结束或先核对情况，不抢锁。需要续期时，同一持有人再次 Acquire；结束时在 `finally` 中用 `-Mode Release -Name <锁名> -Holder <同一持有人> -Json` 释放。短锁只避免并发相撞，不授予本人没有给的权限。
- **后台在做、本人在问。** 同一件事可能后台 AI 正在做，本人同时在对话里问，或者别的对话已经做过。不上锁（锁没释放就真漏了，比多做一次更糟），谁动手都先看三样：这件事的驾驶舱事项关了没有、进度写到哪；它归属的卡或文件写过没有；本人最近 3 小时的原话（`E:\.agents\docs\owner-quotes`）提没提到。对话优先：本人问了就先用现成的答，不等后台，也不把后台正在做的重做一遍；本人说的新事实当场写进去；对话里做完就关事项，后台就不再开工。后台发现本人已在处理就改期再看，到时还没写才自己做；本人已经知道的不再告诉他。写之前重读最新内容，只补没有的，不拿开工时读到的旧版覆盖；转写、采集、看网站先查有没有现成结果，本人明说要重做才重做。
- **不动别人的东西。** 保留其他任务的改动和没提交的内容，不用 `git add .`，不从标题、目录或历史推断某处归自己。
- **停下时留好接续状态。** 没做完就停时，写清在哪个工作副本或分支、做到哪、还差什么，让后来的任务能接着做。
