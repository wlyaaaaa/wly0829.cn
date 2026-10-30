---
{
 "title": "个人正式文书技能",
 "kind": "skill",
 "url": "/skills/personal-formal-documents/",
 "tagline": "说一句要签什么，AI 做成能签能核对的文书。",
 "old_urls": [
  "/skills/document-materials/"
 ],
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
  "page": "skill-personal-formal-documents",
  "kind": "skill",
  "title": "个人正式文书技能",
  "url": "/skills/personal-formal-documents/",
  "tagline": "说一句要签什么，AI 做成能签能核对的文书。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-23 20:00"
   },
   "facts": [
    "10 月 18—24 日 AI 用了 9 次"
   ],
   "as_of": "2026-10-24",
   "source": "状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-23 20:00取这段已完成账本中的最近事件，不限于7天。这里的次数9次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。"
  },
  "public": null,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "5fde1a5419ab6e012b4a56a5f235514ff1701b1d",
   "commit_time": "2026-09-12T19:33:16+08:00",
   "file": "E:\\.agents\\skills\\personal-formal-documents\\SKILL.md"
  },
  "video_prompt": "",
  "registry": {
   "mentions": [
    {
     "target": "/projects/personal-formal-documents/",
     "screen": "skill-personal-formal-documents-01",
     "text": "个人正式文书"
    },
    {
     "target": "/projects/personal-formal-documents/#usage",
     "screen": "skill-personal-formal-documents-02",
     "text": "项目页“怎么用”"
    },
    {
     "target": "/projects/personal-formal-documents/#features",
     "screen": "skill-personal-formal-documents-03",
     "text": "去看全部功能"
    },
    {
     "target": "/projects/personal-formal-documents/#usage",
     "screen": "skill-personal-formal-documents-03",
     "text": "状态怎么分"
    },
    {
     "target": "/skills/work-delivery/",
     "screen": "skill-personal-formal-documents-04",
     "text": "工作交付"
    },
    {
     "target": "/skills/personal-materials/",
     "screen": "skill-personal-formal-documents-04",
     "text": "个人材料查找"
    },
    {
     "target": "/skills/daily-preferences/",
     "screen": "skill-personal-formal-documents-04",
     "text": "个人理解库"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "sha256:022e26708d458f880a87e1e87b951175ff1bd4895cae834556bb3577bc4ea972",
    "SKILL.md 描述里“negotiation-ready amendments”写成“修改条款、补充协议”，没单列。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏七句“怎么跟 AI 说”全是我按技能范围编的，不是本人说过的原话；第 2 屏例子里“我”的两句也是编的（屏上已标示例）。",
    "第 1 屏“这份合同帮我看一遍，哪些条款要留意”：审阅依据 README.md 第 14 行“合同草案、审阅”，但代码里没有专门的审阅功能，审阅就是 AI 读合同给意见，没有 formal-* 命令对应。",
    "第 3 屏规矩里“不另写一套生成程序，也不建一个集中的个人资料库”来自 SKILL.md 第 8 行，对外读者可能觉得是施工细节；保留是因为它说明了这个技能“只用一套程序”的边界，可删。"
   ]
  },
  "old_urls": [
   "/skills/document-materials/"
  ]
 },
 "source": {
  "page": "sources/pages/skill-personal-formal-documents/page.json",
  "sha256": "19b727434664ff5188dff829bb40408cb71826e17bc43fd133c2488b4a2f8825",
  "converted_at_beijing": "2026-10-30T14:00:58+08:00"
 }
}
---

::screen{#skill-personal-formal-documents-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-personal-formal-documents-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，项目名画成链接）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：七句说法，每句画成一个浅绿色圆角对话气泡，两列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一个对话气泡连着一份协议，协议下方一栏绿色签名、一栏空横线（纸上不画字）。",
  "portrait": "竖版：大标题、技能名一行、“它做什么”一段、浅绿底小字依次往下；插画缩小放在“怎么跟 AI 说”上方；七个对话气泡改成一列，一行一句。",
  "links": [
   {
    "text": "个人正式文书",
    "href": "/projects/personal-formal-documents/",
    "locator_text": {
     "v": "个人正式文书项目的入口"
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
     "text_ref": "个人正式文书技能"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 23 日 20:00",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 9 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 24 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-23 20:00取这段已完成账本中的最近事件，不限于7天。这里的次数9次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "技能名"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "row": "hero",
     "text_ref": "它做什么"
    },
    {
     "type": "notice",
     "row": "hero",
     "text_ref": "不用点名"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%",
     "illustration": "outside"
    },
    {
     "type": "dialogue",
     "columns": 2,
     "split_paras": true,
     "illustration": "none",
     "icons": "none",
     "text_ref": "怎么跟 AI 说",
     "row_counts": [
      2,
      2,
      2,
      1
     ]
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。01 横版将它做什么 content_card 与不用点名 notice 直接并入 hero 左55%栏，紧随标题和技能名；主插画与原4+3双列对话同属右45%栏。保留所有定稿节点与链接一次，不缩字号、不改定稿。；page-fixer-03第二轮：主图下的长对话退出hero窄右栏，独占下一整宽行，保留原双列按列读与所有气泡；避免左下大片空白。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-personal-formal-documents-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:个人正式文书技能].text_ref"
     ],
     "requirement": "标题“个人正式文书技能”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-01.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:个人正式文书技能].size"
     ],
     "requirement": "保留 large 标题档位；core._title 当前不消费 size，须按原图标题角色核对实际大小。",
     "evidence": "typeset-proto/components/core/__init__.py:_title"
    }
   ],
   "prior_round_notes": "构图来源：定稿 scene/portrait，库存 source_layout；横版标题和技能名在左上、主插画右上卡外，下方左栏说明卡和浅绿提示、右栏一张对话大卡；7 个原话段各一气泡，横版两列按列读取，竖版按定稿单列。引号原样保留。竖版插画在说明和提示之后、问法之前。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "个人正式文书技能"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 23 日 20:00",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 9 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 24 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-23 20:00取这段已完成账本中的最近事件，不限于7天。这里的次数9次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。"
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
     "rows": 7,
     "illustration": "none",
     "icons": "none",
     "text_ref": "怎么跟 AI 说"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait，库存 source_layout；横版标题和技能名在左上、主插画右上卡外，下方左栏说明卡和浅绿提示、右栏一张对话大卡；7 个原话段各一气泡，横版两列按列读取，竖版按定稿单列。引号原样保留。竖版插画在说明和提示之后、问法之前。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-personal-formal-documents-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:个人正式文书技能].text_ref"
     ],
     "requirement": "标题“个人正式文书技能”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-01.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:个人正式文书技能].size"
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
   "asset": "_library/illustrations/main-personal-formal-documents.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-formal-documents",
   "source_phrase": "右上角一幅小插画：一个对话气泡连着一份协议，协议下方一栏绿色签名、一栏空横线（纸上不画字）。",
   "sha256": "dd0d6900de4c91a553f10202fc97b1011007055899ad6135ab2e0c9bbfa6b210",
   "status": "ready",
   "original_elements": [
    "一个对话气泡连着一份协议，协议下方一栏绿色签名、一栏空横线（纸上不画字"
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
   "asset": "_library/titles/title-4e505cc090bd810df22a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-4e505cc090bd810df22a",
   "title_text": "个人正式文书技能",
   "sha256": "9ea1a8d6ecf356089ce24eff24f9dbc38cfbf3a4df41393b05fef9943817dd70",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

个人正式文书技能

技能名 personal-formal-documents · 〔个人正式文书〕项目的入口

**它做什么**
要写合同、协议、通知、声明或修改条款时，AI 照这个技能进入个人正式文书项目：先读项目的入口说明，只读这次要用的那份细则，用最小的办法把文书做出来，交回能改的 Word、内容一致的 PDF、附件清单，和一个拷到别处也能自证齐全的材料包。

不用点名：说到合同、协议、通知、声明、补充条款，AI 自己会用上它。

**怎么跟 AI 说**
“把我们谈好的合租分摊条件写成正式协议，我这边签好名。”
“这份合同帮我看一遍，哪些条款要留意，标出来。”
“写一份通知给房东，说我 10 月底退租，要打印版。”
“把原合同的付款改成按季度，出一份补充协议。”
“这份协议对方签好寄回来了，帮我记上。”
“这份通知我已经发邮件给对方了，记一下。”
“我把上次那份协议的材料包拷到 U 盘了，查查齐不齐。”

::screen{#skill-personal-formal-documents-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-personal-formal-documents-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（示例那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面一条细长的浅绿底小横条写“AI 做了什么”那一句（“项目页‘怎么用’”画成链接样式，横条左端五个很小的水彩图标排成一排：文件夹、问号气泡、放大镜、一栏签名一栏空、打钩的缩略图），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“过几天”，里面一问一答两个气泡。",
  "portrait": "竖版：标题和示例标签在上；“我”的气泡、“AI 做了什么”横条、“AI 交回”气泡从上到下；“过几天”卡片放在最后，整行宽。",
  "links": [
   {
    "text": "项目页“怎么用”",
    "href": "/projects/personal-formal-documents/#usage"
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
     "row": "example",
     "width": "67%",
     "text_ref": "我："
    },
    {
     "type": "notice",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ],
     "illustration": "left_inside",
     "row": "example",
     "text_ref": "AI 做了什么"
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
     "row": "example",
     "width": "33%",
     "text_ref": "过几天"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。标题与示例小标签相邻；横版左约2/3是我、AI做事、AI交回的竖对话，右约1/3是一张外卡内的我/AI两气泡；竖版主对话在前，后续外卡整宽放最后。做事段为一条细浅绿横条，五小图标在横条左端；不把这一段改成编号步骤。",
   "pending_requirements": [
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[tag:示例：].tone"
     ],
     "requirement": "示例为灰色小标签；tag 当前不消费 tone，须样张确认并实现该灰色标签，不能据字段声称已变灰。",
     "evidence": "定稿 skill-personal-formal-documents-02.scene；components/comp-text/primitives.py:render_tag"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[notice:AI 做了什么].icons",
      "blocks[notice:AI 做了什么].illustration"
     ],
     "requirement": "AI 做了什么是细浅绿横条，左端五个小图标按文件夹、问号、放大镜、本人签名/对方留空、核对缩略图排成一排；notice 当前不消费图标字段。",
     "evidence": "定稿 skill-personal-formal-documents-02.scene；components/comp-text/primitives.py:render_notice"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[notice:AI 做了什么].icons"
     ],
     "requirement": "icon 需要 5 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 skill-personal-formal-documents-02.scene 明确五图；库存 assets 将本屏图标误计为 0，需一并校正素材登记"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:一个完整例子].text_ref"
     ],
     "requirement": "标题“一个完整例子”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-02.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
     "type": "notice",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ],
     "illustration": "left_inside",
     "text_ref": "AI 做了什么"
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
     "text_ref": "过几天"
    }
   ],
   "notes": "构图来源：定稿 scene/portrait。标题与示例小标签相邻；横版左约2/3是我、AI做事、AI交回的竖对话，右约1/3是一张外卡内的我/AI两气泡；竖版主对话在前，后续外卡整宽放最后。做事段为一条细浅绿横条，五小图标在横条左端；不把这一段改成编号步骤。",
   "pending_requirements": [
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[tag:示例：].tone"
     ],
     "requirement": "示例为灰色小标签；tag 当前不消费 tone，须样张确认并实现该灰色标签，不能据字段声称已变灰。",
     "evidence": "定稿 skill-personal-formal-documents-02.scene；components/comp-text/primitives.py:render_tag"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[notice:AI 做了什么].icons",
      "blocks[notice:AI 做了什么].illustration"
     ],
     "requirement": "AI 做了什么是细浅绿横条，左端五个小图标按文件夹、问号、放大镜、本人签名/对方留空、核对缩略图排成一排；notice 当前不消费图标字段。",
     "evidence": "定稿 skill-personal-formal-documents-02.scene；components/comp-text/primitives.py:render_notice"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[notice:AI 做了什么].icons"
     ],
     "requirement": "icon 需要 5 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "定稿 skill-personal-formal-documents-02.scene 明确五图；库存 assets 将本屏图标误计为 0，需一并校正素材登记"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:一个完整例子].text_ref"
     ],
     "requirement": "标题“一个完整例子”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-02.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "建事项卡、问清缺的室友全名和起始日期、先查再生成、只签我这一栏、逐页查过再封包，六步见项目页“怎么用”。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "建事项卡、问清缺的室友全名和起始日期、先查再生成、只签我这一栏、逐页查过再封包，六步见项目页“怎么用”。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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

示例：照这个技能的做法写的，不是某一次的记录

我：“把我们谈好的合租分摊条件写成正式协议，我这边签好名。”（附上谈条件的聊天截图）

**AI 做了什么**
建事项卡、问清缺的室友全名和起始日期、先查再生成、只签我这一栏、逐页查过再封包，六步见〔项目页“怎么用”〕。

**AI 交回**
“协议做好了，你这一方已签，材料包在这件事的记录文件夹里，状态是‘可以交出’，还没发给任何人。逐页检查全过。室友那栏的签字和日期是空的，等他签好，你把文件给我，我单独记‘对方已签回’。”

**过几天**
我：“他签好拍照发我了。”
AI：“已放进原件，记下‘对方已签回’。照片上两方签名都看得清；这不代表房租已经付了，付没付要另有凭据。”

::screen{#skill-personal-formal-documents-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-personal-formal-documents-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，七条短句两列排，每条前一个小水彩图标（一本翻开的说明书、两堆分开的卡片、五级小台阶、一个信封上的“停”手势、一把锁、一本通讯录和一个回头箭头、一只 GitHub 小猫标志旁放一份待核对可见范围的文件清单）。",
  "portrait": "竖版：横幅在上，字换行，按钮单独一行；规矩卡片改成一列七条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/personal-formal-documents/#features"
   },
   {
    "text": "状态怎么分",
    "href": "/projects/personal-formal-documents/#personal-formal-documents-04"
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
   "notes": "构图来源：定稿 scene/portrait。整屏章节大标题居中；浅绿满宽横幅右端是原文“去看全部功能”按钮，竖版按钮单独一行；下方一张规矩大卡含卡头及 7 个左图右文内条目，横版两列、竖版一列。没有 scene 外的主插画。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:用这个技能时].icons"
     ],
     "requirement": "icon 需要 7 个，当前有效总 manifest 有 3 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-personal-formal-documents-03.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:能做的事].text_ref"
     ],
     "requirement": "标题“能做的事”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-03.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   "notes": "构图来源：定稿 scene/portrait。整屏章节大标题居中；浅绿满宽横幅右端是原文“去看全部功能”按钮，竖版按钮单独一行；下方一张规矩大卡含卡头及 7 个左图右文内条目，横版两列、竖版一列。没有 scene 外的主插画。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:用这个技能时].icons"
     ],
     "requirement": "icon 需要 7 个，当前有效总 manifest 有 3 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-personal-formal-documents-03.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:能做的事].text_ref"
     ],
     "requirement": "标题“能做的事”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-03.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   "asset": "_library/fix-round-2/icon-clean-c3db329fc87c047f9a97.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "翻开册子",
   "source_phrase": "一本翻开的说明书",
   "sha256": "443a1e26f04d1a582103f4475c613c05b9c1f1c9e854081d0d14073fc8e51894",
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
   "source_phrase": "两堆分开的卡片",
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
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "五级小台阶",
   "sha256": "fb447e90e43d25696e5e3b5a53d4c4c3c9227bdd19db3c5ee3776fb2938cdb17",
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
   "source_phrase": "一个信封上的“停”手势",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
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
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一本通讯录和一个回头箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "GitHub标志",
   "source_phrase": "一只 GitHub 小猫标志上压一个禁止小标",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
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

这个技能能做的事，就是个人正式文书项目的全部功能：定下这件事、写文书、出文件、检查和签名、交出去以后。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 先读项目的入口说明，再只读这次要用的那份细则；不另写一套生成程序，也不建一个集中的个人资料库。
- 事实、原件、日期、金额、约定、收件方和还不知道的分开记；缺了就问，不补造；原件之间对不上，不替我挑一个顺眼的。
- 做好、签好、可以交出、已交出、已收到、已办理各是一级，每级要凭据；做好文件从不等于已经交出（〔状态怎么分〕）。
- 替我发出、提交、付款、撤回或和解，要我明确说这一次对谁、用哪一版、做什么。
- 读原件前先过个人资料锁；锁着就请我验证，不换个路子绕过去。
- 共用的本人信息从个人理解库取；发现有依据的新信息或更正，当场写回并读回确认；已经签好或交出的文书不跟着改。
- 原件、旧稿、签好的版本和新文件分开留，旧的不覆盖；材料包拷过或中途断过，先核对再接着用。原件和私人事实留在各自的存放处；放进本人可信的私人仓库按私人资料规则办，秘密和材料正文都不公开。

::screen{#skill-personal-formal-documents-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-personal-formal-documents-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，三行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一份打钩的协议、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片、表格（改成三张小卡，每张上面“这些事”、下面“找谁”）、“不做”卡片从上到下。",
  "links": [
   {
    "text": "工作交付",
    "href": "/skills/work-delivery/"
   },
   {
    "text": "个人材料查找",
    "href": "/skills/personal-materials/"
   },
   {
    "text": "个人理解库",
    "href": "/skills/daily-preferences/"
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
     "icons": "auto",
     "row": "limits",
     "text_ref": "管",
     "width": "33%"
    },
    {
     "type": "table",
     "columns": 2,
     "heading_size": "medium",
     "illustration": "top_inside",
     "icons": "auto",
     "row": "limits",
     "width": "67%",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 1,
     "icon_position": "header_left",
     "illustration": "left_inside",
     "icons": "auto",
     "row": "limits",
     "text_ref": "不做"
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。04 边界标题单独整行居中；管卡插画由 top_inside 改 left_inside，与不做卡均为左图右文。横版管卡保留左33%，右67%仍为不管表格及不做卡。管卡当前绿叶兜底图另交素材请求；卡角叶子和标题笔刷残底交对应 owner，不把请求当已修。",
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
     "evidence": "定稿 skill-personal-formal-documents-04.scene；components/table/table.py:render_table"
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
     "evidence": "定稿 skill-personal-formal-documents-04.scene；typeset-assets/manifest.jsonl"
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
     "evidence": "定稿 skill-personal-formal-documents-04.scene 明确每块一个、共三个图标；库存 assets 只估 1 个"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:边界].text_ref"
     ],
     "requirement": "标题“边界”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   ],
   "prior_round_notes": "构图来源：定稿 scene/portrait。横版左约1/3为标题及管卡，右约2/3上表格下不做卡，无连线。竖版依次为管、3 张表格行卡、不做；行卡上方“这些事”、下方“找谁”和原链接。三块各自的小图标放块内左上，禁止跨块复用一个图标。"
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
     "icons": "auto",
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
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "不做"
    }
   ],
   "notes": "本轮依据审查原文逐条修正规格；未出图、未看图，质量关和观感由主会话重渲染复核。04 边界标题单独整行居中；管卡插画由 top_inside 改 left_inside，与不做卡均为左图右文。横版管卡保留左33%，右67%仍为不管表格及不做卡。管卡当前绿叶兜底图另交素材请求；卡角叶子和标题笔刷残底交对应 owner，不把请求当已修。",
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
     "evidence": "定稿 skill-personal-formal-documents-04.scene；components/table/table.py:render_table"
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
     "evidence": "定稿 skill-personal-formal-documents-04.scene；typeset-assets/manifest.jsonl"
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
     "evidence": "定稿 skill-personal-formal-documents-04.scene 明确每块一个、共三个图标；库存 assets 只估 1 个"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:边界].text_ref"
     ],
     "requirement": "标题“边界”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-formal-documents\\page.json:skill-personal-formal-documents-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   ],
   "prior_round_notes": "构图来源：定稿 scene/portrait。横版左约1/3为标题及管卡，右约2/3上表格下不做卡，无连线。竖版依次为管、3 张表格行卡、不做；行卡上方“这些事”、下方“找谁”和原链接。三块各自的小图标放块内左上，禁止跨块复用一个图标。"
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
   "asset": "_library/icons/打钩协议.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "打钩协议",
   "source_phrase": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，三行，右列的名字画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一份打钩的协议、一个指路牌、一个禁止小标）。",
   "sha256": "38bfbb0b14144de8d31dae2c44e827fb5c523a9d66355d5385fd91ec86487061",
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
我自己的合同、协议、补充条款、通知和声明：起草、审阅，出能改的 Word 和内容一致的 PDF，核对附件、列清单；签我这一方；逐页查正文、页码、页边、空白和签名看不看得清，电子版按用途用颜色，要打印再单看黑白效果；封材料包；记交出和对方签回。逐页检查只管版面和齐全，整篇意思和语气还要另外读过。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 工作上的需求文档、PPT、表格、项目计划；只改一个现成的 Word 或 PDF | 〔工作交付〕；单个文件直接用对应的文档能力做 |
| 原件在哪、找不到某份旧合同 | 〔个人材料查找〕先找到，再交过来 |
| 我的姓名、住址这类基本情况 | 〔个人理解库〕，这里只取用，不另存一份 |

**不做**
- 别人的事：不替别人写正式文书。
- 一般翻译和随手写的文案不走这里。
- 不自己发出、寄出或提交；交不交、什么时候交，由我定。
- 不推断对方已签、合同已生效或已付款。
