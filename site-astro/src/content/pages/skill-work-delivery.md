---
{
 "title": "工作支持与交付技能",
 "kind": "skill",
 "url": "/skills/work-delivery/",
 "tagline": "工作上的事交给 AI，要长期维护的交付才建包",
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
  "page": "skill-work-delivery",
  "kind": "skill",
  "title": "工作支持与交付技能",
  "url": "/skills/work-delivery/",
  "tagline": "工作上的事交给 AI，要长期维护的交付才建包",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-09-29 01:09"
   },
   "facts": [
    "近 7 天没用过"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": null,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "5fde1a5419ab6e012b4a56a5f235514ff1701b1d",
   "commit_time": "2026-09-12T19:33:16+08:00",
   "file": "E:\\.agents\\skills\\work-delivery\\SKILL.md 及 references\\continuous-source-package.md、agents\\openai.yaml"
  },
  "video_prompt": "",
  "registry": {
   "groups": [],
   "features": [],
   "numbers": [
    {
     "id": "n-example-facts",
     "text": "3 份资料，9 条事实，其中 1 条是假设",
     "meaning": "合成样例“报表口径统一”建包结果",
     "as_of": "2026-09-28",
     "source": "work-delivery-copilot\\scratch\\acceptance.json scenarios[reporting-review]",
     "screens": [
      "skill-work-delivery-02"
     ]
    },
    {
     "id": "n-example-impact",
     "text": "有 2 条指标定义对不上新版，标了过期",
     "meaning": "同一样例指标口径表换 v2 后的影响",
     "as_of": "2026-09-28",
     "source": "同上",
     "screens": [
      "skill-work-delivery-02"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-project",
     "with": "work-delivery-copilot",
     "direction": "入口",
     "flow": "技能只做自然语言路由和规矩，工作事项、事实和交付状态都在项目里",
     "source": "E:\\.agents\\skills\\work-delivery\\SKILL.md:8"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/projects/work-delivery-copilot/",
     "screen": "skill-work-delivery-01",
     "text": "〔工作支持与交付〕项目的入口"
    },
    {
     "target": "/projects/work-delivery-copilot/#features",
     "screen": "skill-work-delivery-03",
     "text": "〔去看全部功能〕"
    },
    {
     "target": "/projects/work-delivery-copilot/#usage",
     "screen": "skill-work-delivery-02",
     "text": "〔项目页“资料换了版”〕"
    },
    {
     "target": "/projects/work-delivery-copilot/#tech",
     "screen": "skill-work-delivery-03",
     "text": "〔项目页“技术”〕"
    },
    {
     "target": "/projects/work-delivery-copilot/#usage",
     "screen": "skill-work-delivery-04",
     "text": "〔项目页“出了事怎么办”〕"
    },
    {
     "target": "/skills/learning/",
     "screen": "skill-work-delivery-04",
     "text": "〔学习方法〕"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-work-delivery-04",
     "text": "〔个人正式文书〕"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "skill-work-delivery-04",
     "text": "〔个人理解库〕"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [
    "sha256:29ba85a31cfa14eca4e46ab309c1c314c004bb52a932362bdd0dc668332ba943"
   ],
   "unsure": [
    "“怎么跟 AI 说”十句是我按技能说明和项目合同写的可用说法，不是本人真说过的话（没有真实使用记录）。",
    "例子里 AI 交回的那段话是照合成样例 9 月 28 日重跑结果写的示范口吻，不是真实对话记录。",
    "“Claude 和 Codex 用的是同一份技能”：Claude 这边 C:\\Users\\10979\\.claude\\skills\\work-delivery 是指向 E:\\.agents\\skills\\work-delivery 的链接（已查）；Codex 侧按 C:\\Users\\10979\\.agents\\skills 的同名链接和 agents/openai.yaml 推断。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-work-delivery/page.json",
  "sha256": "b24f8fd3ad3a1806b42585714b96859b92b91b22d3cf051e7ba73ed77eb2f5ea",
  "converted_at_beijing": "2026-10-10T11:55:34+08:00"
 }
}
---

::screen{#skill-work-delivery-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-work-delivery-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，项目名画成链接）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：十句说法，每句画成一个浅绿色圆角对话气泡，两列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一只公文包半开着，露出三张纸，纸上连出一根细绿丝线（纸上不画字）。",
  "portrait": "竖版：标题和技能名一行；“它做什么”和浅绿小字段落；插画缩成一行；十个对话气泡一行一个。",
  "links": [
   {
    "text": "工作支持与交付",
    "href": "/projects/work-delivery-copilot/",
    "locator_instances": {
     "h": {
      "input_sha256": "d93ba3ee92142d2cb6f247fd50d7f03c689197229f174d16d5190a748260a222",
      "instances": [
       {
        "context_text": "技能名 work-delivery·工作支持与交付 项目的入口",
        "context_rect": [
         56,
         285,
         684,
         312
        ],
        "expected_rect": [
         334,
         287,
         511,
         312
        ],
        "confirm_region": true
       }
      ]
     },
     "v": {
      "input_sha256": "b64b1213d803183498dcb0354a826d92b14232b2fe0da85d0f25abaa3f5d1277",
      "instances": [
       {
        "context_text": "技能名 work-delivery·工作支持与交付 项目的入口",
        "context_rect": [
         57,
         191,
         887,
         231
        ],
        "expected_rect": [
         441,
         195,
         672,
         230
        ],
        "confirm_region": true
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
     "row": "hero",
     "width": "55%",
     "text_ref": "工作支持与交付技能"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 9 月 29 日 01:09",
       "state": "ok"
      },
      {
       "text": "近 7 天没用过",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "技能名"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%",
     "illustration": "outside"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "row": "content",
     "width": "50%",
     "text_ref": "它做什么"
    },
    {
     "type": "notice",
     "row": "content",
     "text_ref": "不用点名",
     "width": "50%"
    },
    {
     "type": "dialogue",
     "columns": 3,
     "split_paras": true,
     "illustration": "none",
     "icons": "none",
     "width": "100%",
     "text_ref": "怎么跟 AI 说",
     "row": "talk",
     "row_counts": [
      3,
      3,
      2,
      2
     ]
    }
   ],
   "notes": "构图来源：定稿 scene/portrait，库存 source_layout；横版标题和技能名在左上、主插画右上卡外，下方左栏说明卡和浅绿提示、右栏一张对话大卡；10 个原话段各一气泡，横版两列按列读取，竖版按定稿单列。引号原样保留。竖版插画在说明和提示之后、问法之前。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:工作支持与交付技能].text_ref"
     ],
     "requirement": "标题“工作支持与交付技能”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-01.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:工作支持与交付技能].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "工作支持与交付技能"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 9 月 29 日 01:09",
       "state": "ok"
      },
      {
       "text": "近 7 天没用过",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "它做什么"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "banner"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_paras": true,
     "flow": "column",
     "rows": 10,
     "illustration": "none",
     "icons": "none",
     "text_ref": "怎么跟 AI 说"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait，库存 source_layout；横版标题和技能名在左上、主插画右上卡外，下方左栏说明卡和浅绿提示、右栏一张对话大卡；10 个原话段各一气泡，横版两列按列读取，竖版按定稿单列。引号原样保留。竖版插画在说明和提示之后、问法之前。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:工作支持与交付技能].text_ref"
     ],
     "requirement": "标题“工作支持与交付技能”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-01.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:工作支持与交付技能].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
   "asset": "_library/round3/clean-assets/png/41-main-work-delivery-copilot-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-work-delivery-copilot",
   "source_phrase": "右上角一幅小插画：一只公文包半开着，露出三张纸，纸上连出一根细绿丝线（纸上不画字）。",
   "sha256": "b34c7153df2282317848eeb4bac7dea94c6fa493d676ad9494d84955680f0c76",
   "status": "ready",
   "original_elements": [
    "一只公文包半开着，露出三张纸，纸上连出一根细绿丝线（纸上不画字"
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
   "asset": "_library/titles/title-01e813c718dc919b1fac.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-01e813c718dc919b1fac",
   "title_text": "工作支持与交付技能",
   "sha256": "a65206836c9cb47097d33fc73ddb227d4f5fb1327138889ddd63f6791c1fdb91",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

工作支持与交付技能

技能名 work-delivery · 〔工作支持与交付〕项目的入口

**它做什么**
工作上的事交给 AI 时，AI 照这个技能进入工作支持与交付项目：一次性的问题直接办完；我点名了几份资料，而且要出好几种前后一致的文件、或者资料还会改要跟着更新时，才建“交付包”，让每条事实都能回到原文、资料换版后只重看真正失效的那几条。

不用点名：说到工作资料、方案、评审、需求文档、会议纪要、执行计划，AI 自己会用上它。Claude 和 Codex 用的是同一份技能。

**怎么跟 AI 说**
“帮我看看这份方案，哪里站不住。”
“根据这几份会议纪要，理一下接下来谁做什么。”
“这三份资料以后还会改，建个交付包，先出需求文档。”
“先告诉我这几份资料里哪些说法对不上，冲突先别替我定。”
“这条预算和日期能写进正式文件吗？指出分别来自哪里。”
“事实确认了，这一轮只要 Word 需求文档。”
“评审演示和跟踪表也按同一版出一下。”
“执行计划换新版了，看看哪些结论要改、哪些文件过期了。”
“按新口径出下一版。”
“现在这版文件和事实还对得上吗？”

::screen{#skill-work-delivery-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-work-delivery-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（示例那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”四步画成一条细竖线串起的四个小节点（每个节点一个小水彩图标：三张纸被一只手挑出来、一枚定位针钉在一行字上、一扇带对勾的小门、一张 Word 文档），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“过几天，资料换了版”，里面一问一答两个气泡。",
  "portrait": "竖版：标题和示例标签；对话从上到下：我的气泡、四步、AI 的回复；“过几天，资料换了版”卡片放在最后。",
  "links": [
   {
    "text": "项目页“资料换了版”",
    "href": "/projects/work-delivery-copilot/#work-delivery-copilot-04",
    "orientations": [
     "v"
    ]
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
     "row": "head",
     "width": "38%",
     "text_ref": "一个完整例子"
    },
    {
     "type": "tag",
     "tone": "gray",
     "row": "head",
     "width": "62%",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "illustration": "none",
     "icons": "none",
     "text_ref": "我：",
     "width": "100%",
     "row": "example"
    },
    {
     "type": "section_heading",
     "size": "medium",
     "row": "example",
     "text_ref": "AI 做了什么"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "connector_style": "thin_line",
     "illustration": "left_inside",
     "illustration_inside": false,
     "icons": "auto",
     "row": "example",
     "text_ref": "三份资料"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "illustration": "none",
     "icons": "none",
     "row": "example",
     "text_ref": "AI 交回"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "illustration": "none",
     "icons": "none",
     "text_ref": "过几天，资料换了版",
     "width": "100%",
     "row": "followup"
    },
    {
     "type": "prose",
     "text_ref": "换版时哪些算失效",
     "row": "followup"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。标题与示例小标签相邻；横版左约2/3是我、AI做事、AI交回的竖对话，右约1/3是一张外卡内的我/AI两气泡；竖版主对话在前，后续外卡整宽放最后。四步骤用细竖线和节点连接，四图标在节点左侧卡外；不要横排成2×2。换版说明链接在后续卡下。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "pending_requirements": [
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[tag:示例：].tone"
     ],
     "requirement": "示例为灰色小标签；tag 当前不消费 tone，须样张确认并实现该灰色标签，不能据字段声称已变灰。",
     "evidence": "定稿 skill-work-delivery-02.scene；components/comp-text/primitives.py:render_tag"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[timeline:三份资料].icons"
     ],
     "requirement": "icon 需要 4 个，当前有效总 manifest 有 1 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-work-delivery-02.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:一个完整例子].text_ref"
     ],
     "requirement": "标题“一个完整例子”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-02.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:一个完整例子].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
     "tone": "gray",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "illustration": "none",
     "icons": "none",
     "text_ref": "我："
    },
    {
     "type": "section_heading",
     "size": "medium",
     "text_ref": "AI 做了什么"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "connector_style": "thin_line",
     "illustration": "left_inside",
     "illustration_inside": false,
     "icons": "auto",
     "text_ref": "三份资料"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "illustration": "none",
     "icons": "none",
     "text_ref": "AI 交回"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "illustration": "none",
     "icons": "none",
     "text_ref": "过几天，资料换了版"
    },
    {
     "type": "prose",
     "text_ref": "换版时哪些算失效"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。标题与示例小标签相邻；横版左约2/3是我、AI做事、AI交回的竖对话，右约1/3是一张外卡内的我/AI两气泡；竖版主对话在前，后续外卡整宽放最后。四步骤用细竖线和节点连接，四图标在节点左侧卡外；不要横排成2×2。换版说明链接在后续卡下。",
   "pending_requirements": [
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[tag:示例：].tone"
     ],
     "requirement": "示例为灰色小标签；tag 当前不消费 tone，须样张确认并实现该灰色标签，不能据字段声称已变灰。",
     "evidence": "定稿 skill-work-delivery-02.scene；components/comp-text/primitives.py:render_tag"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[timeline:三份资料].icons"
     ],
     "requirement": "icon 需要 4 个，当前有效总 manifest 有 1 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-work-delivery-02.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:一个完整例子].text_ref"
     ],
     "requirement": "标题“一个完整例子”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-02.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:一个完整例子].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
   "source_phrase": "三张纸被一只手挑出来",
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
   "asset": "_library/hires-icons-r2/icon-clean-efc86be6e153919921f8.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "地图定位",
   "source_phrase": "一枚定位针钉在一行字上",
   "sha256": "d5f6c48bfe0e0fd7dc64c01839a98a5065656cccc64f8b997bfeab91cff020a8",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇带对勾的小门",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
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
   "source_phrase": "一张 Word 文档",
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

示例：照这个技能的做法写的，不是某一次的记录；资料是项目自带的合成样例，数字照 9 月 28 日重跑的结果

我：“需求说明、评审纪要、指标口径表这三份以后还会改，帮我出需求文档，目标是让日报、周报、月报用同一套指标定义。”

**AI 做了什么**
1. 三份资料是我点名的、还会改、要出正式文件，符合建包的两个条件，就建交付包；只读这三份，别的不碰。
2. 读完先交回用了哪几份、关键事实和对不上的地方；再登记 9 条事实，每条抄下原文那一句，程序算出它在第几行第几列。
3. “历史数据迁移范围”纪要里写着还没定，就留作“假设”，写进待确认事项，不当成定论。
4. 目标、范围、需求、异常、验收都有已确认的事实，没有互相矛盾的，过了门，才出 Word。

**AI 交回**
“交付包建好了：3 份资料，9 条事实，其中 1 条是假设（历史数据迁移范围）。需求文档已出，每条都带原文位置；这次只出了 Word，演示和跟踪表要的话从同一版补。要你定的只有一件：历史数据迁移范围什么时候能定下来？”

**过几天，资料换了版**
我：“指标口径表换新版了。”
AI：“有 2 条指标定义对不上新版，标了过期，其余照旧不用重看；上一版文件也标了过期。要按新口径出下一版吗？”
换版时哪些算失效、哪些自动接上，见〔项目页“资料换了版”〕。

::screen{#skill-work-delivery-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-work-delivery-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，六条短句两列排，每条前一个小水彩图标（一只手只捏着几张纸、一张纸条写着要点、一个问号气泡、一扇只开一道的小门、一把尺子、一张打勾的清单）。",
  "portrait": "竖版：横幅和按钮在上（按钮单独一行）；六条规矩一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/work-delivery-copilot/#features"
   },
   {
    "text": "项目页“技术”",
    "href": "/projects/work-delivery-copilot/#tech",
    "locator_text": {
     "h": "项目页“技术”)"
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
     "align": "center",
     "size": "large",
     "text_ref": "能做的事"
    },
    {
     "type": "notice",
     "inline_button": "去看全部功能",
     "text_ref": "这个技能能做的事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 2,
     "item_cards": true,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用这个技能时"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。整屏章节大标题居中；浅绿满宽横幅右端是原文“去看全部功能”按钮，竖版按钮单独一行；下方一张规矩大卡含卡头及 6 个左图右文内条目，横版两列、竖版一列。没有 scene 外的主插画。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:用这个技能时].icons"
     ],
     "requirement": "icon 需要 6 个，当前有效总 manifest 有 2 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-work-delivery-03.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:能做的事].text_ref"
     ],
     "requirement": "标题“能做的事”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-03.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:能做的事].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
     "inline_button": "去看全部功能",
     "text_ref": "这个技能能做的事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 1,
     "item_cards": true,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用这个技能时"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。整屏章节大标题居中；浅绿满宽横幅右端是原文“去看全部功能”按钮，竖版按钮单独一行；下方一张规矩大卡含卡头及 6 个左图右文内条目，横版两列、竖版一列。没有 scene 外的主插画。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:用这个技能时].icons"
     ],
     "requirement": "icon 需要 6 个，当前有效总 manifest 有 2 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-work-delivery-03.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:能做的事].text_ref"
     ],
     "requirement": "标题“能做的事”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-03.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:能做的事].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
   "source_phrase": "一只手只捏着几张纸",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张纸条写着要点",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "问号气泡",
   "source_phrase": "一个问号气泡",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打开门",
   "source_phrase": "一扇只开一道的小门",
   "sha256": "2b7b218dd7772a0030adfc51f1a230b31265718645392911b4ef5df384ddc02b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一张打勾的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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

这个技能能做的事，就是工作支持与交付项目的全部功能：日常工作支持、建包和核事实、出文件、资料换版。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 工作资料只用我这次点名的；不翻文件夹、账号、仓库和旧对话。
- 先交回会改变我判断的东西：用了哪几份、关键事实、冲突和缺口；还要很久时报一个有依据的预计时间。
- 只让我处理真正的冲突、待确认项和假设，已经写在资料里的不让我再填一遍。
- 出文件照项目的规矩走：要哪种出哪种，缺项或冲突只交草稿，正式文件只走项目入口，不为赶时间冒充正式版（机制见〔项目页“技术”〕）。
- 资料换版后先看影响，再决定出不出下一版；不拿“重新生成一遍”冒充影响分析。
- 交回的是结果，不是命令和回执：选了哪几份、哪些已确认、哪些是假设或冲突或过期、现在是草稿还是能正式出、实际出了哪些文件、哪些旧版过期、唯一要我定的事。

::screen{#skill-work-delivery-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-work-delivery-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，四行，右列的项目名画成链接；表格下面一张卡片“不做”，四条短句，其中的链接字画成链接样式。每块左上一个小水彩图标（一只打勾的公文包、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成四张小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”四条在最后。",
  "links": [
   {
    "text": "学习方法",
    "href": "/skills/learning/"
   },
   {
    "text": "个人正式文书",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "个人理解库",
    "href": "/skills/daily-preferences/"
   },
   {
    "text": "项目页“出了事怎么办”",
    "href": "/projects/work-delivery-copilot/#work-delivery-copilot-05"
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
     "illustration": "left_inside",
     "icons": [
      "_library/icons/公文包清单.png"
     ],
     "text_ref": "管"
    },
    {
     "type": "table",
     "columns": 2,
     "heading_size": "medium",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 1,
     "icon_position": "header_left",
     "illustration": "none",
     "icons": "none",
     "text_ref": "不做"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。横版左约1/3为标题及管卡，右约2/3上表格下不做卡，无连线。竖版依次为管、4 张表格行卡、不做；行卡上方“这些事”、下方“找谁”和原链接。三块各自的小图标放块内左上，禁止跨块复用一个图标。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "pending_requirements": [
    {
     "owner": "table",
     "type": "unsupported_layout",
     "fields": [
      "blocks[table:不管，交给谁].illustration",
      "blocks[table:不管，交给谁].icons",
      "blocks[table:不管，交给谁].heading_size"
     ],
     "requirement": "表格/行卡的路牌图标及卡头大小必须按源构图，table 当前只渲染标题与表体，不读取这三个字段。",
     "evidence": "定稿 skill-work-delivery-04.scene；components/table/table.py:render_table"
    },
    {
     "owner": "素材负责人",
     "type": "asset_order_review",
     "fields": [
      "blocks[content_card:管].icons",
      "blocks[table:不管，交给谁].icons",
      "blocks[points_card:不做].icons"
     ],
     "requirement": "三个块分别需要已核对的管、路牌、禁止图标映射；当前每屏只有 icon-01 且没有语义标注，不得多个块用 auto 重复同一物件。",
     "evidence": "定稿 skill-work-delivery-04.scene；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[content_card:管].icons",
      "blocks[table:不管，交给谁].icons",
      "blocks[points_card:不做].icons"
     ],
     "requirement": "icon 需要 3 个，当前有效总 manifest 有 1 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 skill-work-delivery-04.scene 明确每块一个、共三个图标；库存 assets 只估 1 个"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:边界].text_ref"
     ],
     "requirement": "标题“边界”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:边界].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
     "illustration": "left_inside",
     "icons": [
      "_library/icons/公文包清单.png"
     ],
     "text_ref": "管"
    },
    {
     "type": "table",
     "columns": 1,
     "heading_size": "medium",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 1,
     "icon_position": "header_left",
     "illustration": "none",
     "icons": "none",
     "text_ref": "不做"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。横版左约1/3为标题及管卡，右约2/3上表格下不做卡，无连线。竖版依次为管、4 张表格行卡、不做；行卡上方“这些事”、下方“找谁”和原链接。三块各自的小图标放块内左上，禁止跨块复用一个图标。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "pending_requirements": [
    {
     "owner": "table",
     "type": "unsupported_layout",
     "fields": [
      "blocks[table:不管，交给谁].illustration",
      "blocks[table:不管，交给谁].icons",
      "blocks[table:不管，交给谁].heading_size"
     ],
     "requirement": "表格/行卡的路牌图标及卡头大小必须按源构图，table 当前只渲染标题与表体，不读取这三个字段。",
     "evidence": "定稿 skill-work-delivery-04.scene；components/table/table.py:render_table"
    },
    {
     "owner": "素材负责人",
     "type": "asset_order_review",
     "fields": [
      "blocks[content_card:管].icons",
      "blocks[table:不管，交给谁].icons",
      "blocks[points_card:不做].icons"
     ],
     "requirement": "三个块分别需要已核对的管、路牌、禁止图标映射；当前每屏只有 icon-01 且没有语义标注，不得多个块用 auto 重复同一物件。",
     "evidence": "定稿 skill-work-delivery-04.scene；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[content_card:管].icons",
      "blocks[table:不管，交给谁].icons",
      "blocks[points_card:不做].icons"
     ],
     "requirement": "icon 需要 3 个，当前有效总 manifest 有 1 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 skill-work-delivery-04.scene 明确每块一个、共三个图标；库存 assets 只估 1 个"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:边界].text_ref"
     ],
     "requirement": "标题“边界”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-work-delivery\\page.json:skill-work-delivery-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:边界].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ]
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
   "asset": "_library/round3/clean-assets/png/13-公文包清单-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "公文包清单",
   "source_phrase": "一只打勾的公文包",
   "sha256": "6c838cf1f00338d2d467304875ffcc24263ed89010212c4d382029d3e92434fa",
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
真实工作里的看材料、沟通、做决定、评审和交付；判断要不要建交付包；建包、核事实、出文件、资料换版的全流程。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 学习路线、讲义、课程 | 〔学习方法〕 |
| 合同、协议、通知这类私人正式文书 | 〔个人正式文书〕 |
| 一次性改一份 Word、PPT 或表格 | AI 直接用现成的办公文件能力改，不建包 |
| 我本人的经历、习惯和偏好 | 〔个人理解库〕；这里只按需读、有依据才写回，不当业务事实 |

**不做**
- 没有具体工作事项时，不编公司、职位或任务，也不预先建台账。
- 发邮件、发布、审批、建任务这类对外动作，技能本身不做；要做时按我这次说的或早就授权过的范围办，出现新的对象或动作再问我。
- 不拿现状的缺口糊弄：Word、PDF 要先转成文字，交付包没有备份，这些照实说（应对见〔项目页“出了事怎么办”〕）。
- 没和“AI 直接做”比过时间，就不说省了多少时间。
