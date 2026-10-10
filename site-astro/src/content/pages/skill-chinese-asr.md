---
{
 "title": "中文语音转写技能",
 "kind": "skill",
 "url": "/skills/chinese-asr/",
 "tagline": "跟 AI 说一句，录音就变成能核对的文字。",
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
  "page": "skill-chinese-asr",
  "kind": "skill",
  "title": "中文语音转写技能",
  "url": "/skills/chinese-asr/",
  "tagline": "跟 AI 说一句，录音就变成能核对的文字。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-07 08:15"
   },
   "facts": [
    "近 7 天 AI 用了 3 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "based_on": {
   "commit": "98829877960b32e0f62685a859f449d9308edec3",
   "commit_time": "2026-09-28T07:17:30+08:00",
   "file": "E:\\.agents\\skills\\chinese-asr\\SKILL.md 及 references\\ 四份说明"
  },
  "video_prompt": "",
  "registry": {
   "mentions": [
    {
     "target": "/projects/chinese-asr/",
     "screen": "skill-chinese-asr-01",
     "text": "中文语音转写"
    },
    {
     "target": "/projects/chinese-asr/#features",
     "screen": "skill-chinese-asr-03",
     "text": "去看全部功能"
    },
    {
     "target": "/skills/personal-media/",
     "screen": "skill-chinese-asr-04",
     "text": "找照片、视频、录音"
    },
    {
     "target": "/skills/wechat-direct/",
     "screen": "skill-chinese-asr-04",
     "text": "微信直读"
    },
    {
     "target": "/skills/media-person-self/",
     "screen": "skill-chinese-asr-04",
     "text": "照片录音里有没有我"
    },
    {
     "target": "/skills/localocr/",
     "screen": "skill-chinese-asr-04",
     "text": "本地文字识别"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能里给 AI 的具体命令（asr-smart.ps1、speaker-evidence 等参数）不上页：读者要的是怎么说、会发生什么；命令在技能源文件和项目 README 里。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏十三句“怎么跟 AI 说”（9 月 29 日新加“云端自动复核先暂停一下。”）；第 3 屏“（我暂停了就不做）”；第 2 屏“我：……”两句和“AI 不再问我”；第 3 屏“不再问我”；第 4 屏“哪几句是我说的”“才要我点头”。",
    "第 2 屏整个例子是编的（40 分钟会议录音、12:40/25:03/31:18、32 句 18/11/3），已在图上写明“示例”。流程依据：skill references/cloud-and-important-evidence.md“Local evidence cross-check”（FireRed＋Qwen、35 秒切片、每段 verified）、“Automatic cloud review”第 7 行（-Important 标记、两引擎分歧、[疑似] 都算疑难，免费期内自动复核）；README.md:205、SKILL.md（超时复用 job_id、成功不等于逐字正确）、speaker-attribution.md（分组数不是人数、给出 self/other/unknown 句数和一句理由）。",
    "例子第 1 步“说了重要就走 FireRed＋Qwen”：技能写的是 legal/court/complaint/employment 或其他重要录音走这条路，这里只写“重要录音”，不写具体种类。",
    "第 4 屏几个技能的中文叫法（找照片、视频、录音／微信直读／照片录音里有没有我／本地文字识别）是我起的，要和技能总页、各技能页的标题统一；链接按 /skills/<技能名>/ 写。",
    "技能的 agents/openai.yaml 默认提示 9 月 29 日已改成本地优先、疑难录音按云端复核交接，重要录音的本地示例也补上了标记（.agents 提交 099e0eb），和页面一致。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-chinese-asr/page.json",
  "sha256": "1c191eb99a9a5ddd4665428c5af57d01601684bf0c2d31dc6fda9e83d66fa77a",
  "converted_at_beijing": "2026-10-10T09:06:30+08:00"
 }
}
---

::screen{#skill-chinese-asr-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-chinese-asr-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，项目名画成链接）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：十三句说法，每句画成一个浅绿色圆角对话气泡，两列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一只麦克风和一个对话气泡连着一张写满浅灰短线的纸（纸上不画字）。",
  "portrait": "竖版：标题和技能名一行；“它做什么”和浅绿小字段落；插画缩成一行；十三个对话气泡一行一个。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
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
     "text_ref": "中文语音转写技能",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 7 日 08:15",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 3 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "illustration",
     "row": "k1a-head",
     "illustration": "outside",
     "align": "right",
     "width": "auto"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "content_card",
     "row": "intro-cards",
     "width": "50%",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "它做什么"
    },
    {
     "type": "notice",
     "row": "intro-cards",
     "text_ref": "不用点名",
     "width": "50%"
    },
    {
     "type": "dialogue",
     "columns": 3,
     "split_paras": true,
     "illustration": "none",
     "icons": "none",
     "text_ref": "怎么跟 AI 说",
     "row_counts": [
      3,
      3,
      3,
      2,
      2
     ]
    }
   ],
   "notes": "2026-10-03 14:04:34 page-fixer-01 当前构图，以当前blocks为准：依据审查及压小图复核消除空白/窄表/插画变形，所有原字、原热区和未解决组件要求保留；历史构图意图已随本轮旧规格副本留作临时回退，不把旧notes当现状。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-chinese-asr-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:中文语音转写技能].text_ref"
     ],
     "requirement": "标题“中文语音转写技能”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-01.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:中文语音转写技能].size"
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
     "text_ref": "中文语音转写技能"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 7 日 08:15",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 3 次",
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
     "columns_v": 1,
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
     "illustration": "outside"
    },
    {
     "type": "section_heading",
     "text_ref": "怎么跟 AI 说",
     "size": "large"
    },
    {
     "type": "dialogue",
     "text_ref": "“把这段录音转成文字。”",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这段挺重要，拿不准的地方给我",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这段用高质量转一遍，我要能逐",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这个文件夹里的录音都转一下。",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这是两个人打电话，分清谁说了",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这段录音里有几个人在说话？”",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这段里哪几句是我说的？”",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这是配音文案和音频，给每个词",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这段录音以前转过吗？把带时间",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“这段可以传到云端再听一遍。”",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“云端自动复核先暂停一下。”",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“Win+H 按了没反应，帮我",
     "sides": [
      "left"
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "“云端复核是不是停了？恢复吧。",
     "sides": [
      "left"
     ]
    }
   ],
   "notes": "原v第一张是标题、技能名、说明卡、浅绿提示和外置主插画；v2 是十三问法单列气泡，按定稿不重复标题。十三独立气泡已按定稿逐段定位。；手机十三气泡已按真实定稿逐段独立块拆出，可直接用现组件，不依赖split_paras扩展。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-chinese-asr-01.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:中文语音转写技能].text_ref"
     ],
     "requirement": "标题“中文语音转写技能”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-01.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
    },
    {
     "owner": "主工程师",
     "type": "unsupported_layout",
     "fields": [
      "blocks[chapter_title:中文语音转写技能].size"
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
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-chinese-asr",
   "source_phrase": "右上角一幅小插画：一只麦克风和一个对话气泡连着一张写满浅灰短线的纸（纸上不画字）。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "一只麦克风和一个对话气泡连着一张写满浅灰短线的纸（纸上不画字"
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
   "asset": "_library/titles/title-b317940f680151b18f5f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b317940f680151b18f5f",
   "title_text": "中文语音转写技能",
   "sha256": "9bd58b9ff4330586f0fdc421e70ad2560620bd42fafe36a2a8674f4d26772d03",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

中文语音转写技能

技能名 chinese-asr · 〔中文语音转写〕项目的入口

**它做什么**
把中文录音交给 AI，或者问录音里有几个人、哪几句是我说的、某句话在第几秒，AI 就照这个技能用本机的中文语音转写来做：按说法选路线，把正文、疑点和时间交回来，拿不准的照实说拿不准。Win+H 听写不好用，也按它来查。

不用点名：说到中文录音、微信语音、时间戳、谁在说话、重要录音、Win+H 听写，AI 自己会用上它。听写本身不用跟 AI 说：点输入框，按 Win+H 就说。

**怎么跟 AI 说**
“把这段录音转成文字。”
“这段挺重要，拿不准的地方给我标出来。”
“这段用高质量转一遍，我要能逐段回听。”
“这个文件夹里的录音都转一下。”
“这是两个人打电话，分清谁说了什么，带上时间。”
“这段录音里有几个人在说话？”
“这段里哪几句是我说的？”
“这是配音文案和音频，给每个词标上时间。”
“这段录音以前转过吗？把带时间的结果找出来。”
“这段可以传到云端再听一遍。”
“云端自动复核先暂停一下。”
“Win+H 按了没反应，帮我看看。”
“云端复核是不是停了？恢复吧。”

::screen{#skill-chinese-asr-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-chinese-asr-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（示例那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”四步画成一条细竖线串起的四个小节点（每个节点一个小水彩图标：剪刀剪开一段波形、一张号码牌、放大镜照着一张清单、一朵云和两张并排的纸），再下面“AI 交回”画成左对齐的白底气泡，里面三条带时间的要点。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。",
  "portrait": "竖版：标题和示例标签；对话从上到下：我的气泡、四步、AI 的回复；“另一种问法”卡片放在最后。",
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
     "align": "left",
     "size": "large",
     "row": "head",
     "width": "38%",
     "text_ref": "一个完整例子"
    },
    {
     "type": "notice",
     "row": "head",
     "width": "62%",
     "tone": "gray",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
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
     "connector": "ribbon",
     "illustration": "left_inside",
     "icon_side": "left",
     "icons": "auto",
     "text_ref": "说了“重要”",
     "direction": "vertical",
     "connector_style": "thin_line",
     "illustration_inside": false
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "icons": "none",
     "text_ref": "AI 交回",
     "row": "results",
     "width": "50%"
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
     "text_ref": "另一种问法",
     "row": "results",
     "width": "50%"
    }
   ],
   "notes": "标题左侧、示例灰条同高右侧。主对话约2/3宽，用户气泡右对齐；四步绿细竖线及圆节点连接，图标在卡外左；AI交回白气泡置其下。另一种问法整张竖卡在右1/3，内部我/AI两气泡，底端主插画在卡内。不得将四步排成横向或2×2。 文字审查校正：另一种问法以已支持的 split_paras 组成一张外卡内两泡；AI交回不领取四步骤图标，避免把步骤物件误当头像。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "asset_order_review",
     "fields": [
      "blocks[timeline:说了“重要”].icons"
     ],
     "requirement": "四个可用图标目前只有顺序文件名，没有物件语义标注；须核对其与剪波形、号码牌、疑点清单、云端对照四步的一一对应。旧规格 notes 另有右卡底主插画，清单没有该 illustration，需图审确认后补素材/位置，不靠文字臆定。",
     "evidence": "定稿 skill-chinese-asr-02.scene；旧规格 notes；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[notice:示例：].tone"
     ],
     "requirement": "示例原构图为灰条，notice tone=gray 仍沿批准浅绿底；新底色要组件样张确认。",
     "evidence": "components/comp-text/primitives.py:render_notice"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:一个完整例子].text_ref"
     ],
     "requirement": "标题“一个完整例子”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-02.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
     "type": "notice",
     "tone": "gray",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
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
     "connector": "ribbon",
     "illustration": "left_inside",
     "icon_side": "left",
     "icons": "auto",
     "text_ref": "说了“重要”",
     "direction": "vertical",
     "connector_style": "thin_line",
     "illustration_inside": false
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "text_ref": "AI 交回",
     "icons": "none"
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
     "text_ref": "另一种问法"
    }
   ],
   "notes": "原v前四步，v2 AI交回与另一种问法。两组上下顺排；四步左外图、细竖线连接。AI交回五段是一气泡，另一问法我/AI分别两气泡。组名不能凭空复制成章节文字。 文字审查校正：另一种问法以已支持的 split_paras 组成一张外卡内两泡；AI交回不领取四步骤图标，避免把步骤物件误当头像。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "asset_order_review",
     "fields": [
      "blocks[timeline:说了“重要”].icons"
     ],
     "requirement": "四个可用图标目前只有顺序文件名，没有物件语义标注；须核对其与剪波形、号码牌、疑点清单、云端对照四步的一一对应。旧规格 notes 另有右卡底主插画，清单没有该 illustration，需图审确认后补素材/位置，不靠文字臆定。",
     "evidence": "定稿 skill-chinese-asr-02.scene；旧规格 notes；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[notice:示例：].tone"
     ],
     "requirement": "示例原构图为灰条，notice tone=gray 仍沿批准浅绿底；新底色要组件样张确认。",
     "evidence": "components/comp-text/primitives.py:render_notice"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:一个完整例子].text_ref"
     ],
     "requirement": "标题“一个完整例子”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-02.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   "asset": "_library/icons/剪刀.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "剪刀",
   "source_phrase": "剪刀剪开一段波形",
   "sha256": "70cb61682b6ecc2fc6e262b6c309d0ad67fb83036817d0263db7d9d72ea2d070",
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
   "source_phrase": "一张号码牌",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜照着一张清单",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
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
   "source_phrase": "一朵云和两张并排的纸",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
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

我：“这段会议录音挺重要，转成文字，拿不准的地方给我标出来。”（附一段 40 分钟的录音）

**AI 做了什么**
1. 说了“重要”，就走重要录音路线：FireRedASR2-LLM 主听、Qwen3-ASR 对照；40 分钟太长，按停顿切成最长 35 秒一段，断了能接着跑。
2. 最多等 15 秒没跑完，先回一句“在跑了”和任务编号；之后按这个编号查进度，不把同一段录音再交一遍。
3. 跑完不只看“成功”两个字：每一段的证据都要是“已核对”，还要看有没有一个模型失败、每条疑点是什么。
4. 标了重要，又有两处数字两个模型听得不一样，都算疑难：在免费期内，AI 不再问我，直接把它送阿里云再听一遍，云端稿和本地稿并排存。

**AI 交回**
“转好了，正文在结果目录里。要回听的有 3 处：
12:40　“三百”还是“三千”：本地两个模型不一样，云端听成“三千”；
25:03　本该没声音的地方出了“谢谢观看”，已标 [疑似]；
31:18　两个人抢着说，这句两边差得多。
其余句子两个模型一致，但一致不等于逐字正确，要引用原话请先回听。”

**另一种问法**
我：“这段通话里哪几句是我说的？”
AI：“按声音分成 2 组，分组可能多分或少分，不等于人数。32 句里 18 句是你、11 句是对方、3 句说不准。说话人 1 大多是你：声音接近你的参考，而且是你在回答对方的提问。”

::screen{#skill-chinese-asr-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-chinese-asr-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一根手指点着一个文件、一张号码牌、一个“≠”号、一个空盒子、一朵云、排队的小显卡、两个问号气泡、一把锁）。",
  "portrait": "竖版：横幅和按钮在上（按钮单独一行）；八条规矩一行一条。",
  "links": [
   {
    "text": "去看全部功能",
    "href": "/projects/chinese-asr/#features"
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
     "width": "70%",
     "text_ref": "能做的事"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "30%",
     "illustration": "outside",
     "size": "banner",
     "target_width": 246,
     "align": "right"
    },
    {
     "type": "notice",
     "inline_button": true,
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
   "notes": "2026-10-03 14:04:34 page-fixer-01 当前构图，以当前blocks为准：依据审查及压小图复核消除空白/窄表/插画变形，所有原字、原热区和未解决组件要求保留；历史构图意图已随本轮旧规格副本留作临时回退，不把旧notes当现状。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:用这个技能时].icons"
     ],
     "requirement": "icon 需要 8 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-chinese-asr-03.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "旧规格保留标题旁卡外主插画；当前总manifest无该 illustration；scene 未另列，须由页图审核对旧构图来源后补齐"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:能做的事].text_ref"
     ],
     "requirement": "标题“能做的事”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-03.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
     "align": "left",
     "size": "large",
     "row": "hero",
     "row_v": true,
     "width": "45%",
     "text_ref": "能做的事"
    },
    {
     "type": "illustration",
     "row": "hero",
     "row_v": true,
     "width": "55%",
     "illustration": "outside"
    },
    {
     "type": "notice",
     "inline_button": true,
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
   "notes": "原图主插画在标题右侧、卡外；下方说明横幅及按钮单独一行。八规矩各一横卡、左图右文，包含在整宽大卡内，一列八排。不把手机标题变成无插画的满宽标题。",
   "pending_requirements": [
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[points_card:用这个技能时].icons"
     ],
     "requirement": "icon 需要 8 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "typeset-inventory/screens.jsonl:skill-chinese-asr-03.source_layout；typeset-assets/manifest.jsonl"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "旧规格保留标题旁卡外主插画；当前总manifest无该 illustration；scene 未另列，须由页图审核对旧构图来源后补齐"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:能做的事].text_ref"
     ],
     "requirement": "标题“能做的事”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-03.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   "asset": "_library/icons/指向手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "指向手",
   "source_phrase": "一根手指点着一个文件",
   "sha256": "b91d58864458ae828bac8c417ce629dc5c21bbafc9cb56094265107503bfe26c",
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
   "source_phrase": "一张号码牌",
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
   "source_phrase": "一个“≠”号",
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
   "source_phrase": "一个空盒子",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "一朵云",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显卡",
   "source_phrase": "排队的小显卡",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "问号气泡",
   "source_phrase": "两个问号气泡",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-chinese-asr",
   "source_phrase": "横版画面：上方一条横跨整屏的浅绿底圆角横幅，写能做的事那一句，右端一个白底细绿边按钮（〔去看全部功能〕）。下方一张大卡片“用这个技能时，AI 守的规矩”，八条短句两列排，每条前一个小水彩图标（一根手指点着一个文件、一张号码牌、一个“≠”号、一个空盒子、一朵云、排队的小显卡、两个问号气泡、一把锁）。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
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

这个技能能做的事，就是中文语音转写项目的全部功能：听写、录音转文字、找出要回听的地方、云端复核、时间和说话人、维护和装机。〔去看全部功能〕

**用这个技能时，AI 守的规矩**
- 只处理点名的那一段或那个文件夹，不去翻整个录音库。
- 等不及了就拿同一个任务编号接着查，不把同一段录音再交一遍。
- “成功”只说明跑完了；两个模型一致、证据齐全、时间对得上，都不等于逐字正确。[疑似] 和分歧原样交回，不润色成通顺的话。
- 结果是空的，先看结论是哪一种，不直接说“没人说话”。
- 疑难录音在免费期内自动云端复核（我暂停了就不做）；两份稿都保留，重要录音先看云端稿，再用本地双模型核对。
- 显卡被占就等，或者说清是谁占着；不绕过排队，也不停别人的任务。
- 说话人分成几组不当成几个人；声音比对只给能推翻的推定。
- 录音、转写正文、模型和声音参考都不放进 GitHub。

::screen{#skill-chinese-asr-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-chinese-asr-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的技能名画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一只打钩的麦克风、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成五张小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”四条在最后。",
  "links": [
   {
    "text": "找照片、视频、录音",
    "href": "/skills/personal-media/"
   },
   {
    "text": "微信聊天读取",
    "href": "/skills/wechat-direct/"
   },
   {
    "text": "照片录音里有没有我",
    "href": "/skills/media-person-self/"
   },
   {
    "text": "本地文字识别",
    "href": "/skills/localocr/"
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
     "text_ref": "边界"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "top_inside",
     "icons": "auto",
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
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "不做"
    }
   ],
   "notes": "原图标题占左栏，管竖卡左约1/3，麦克风打钩插画卡内上方；右约2/3不管五行二列表格，路牌插画在卡内右上、卡头左上。右栏下不做横卡，禁止小标在左内，四短句右侧；无连线。",
   "pending_requirements": [
    {
     "owner": "table",
     "type": "unsupported_layout",
     "fields": [
      "blocks[table:不管，交给谁].illustration",
      "blocks[table:不管，交给谁].icons",
      "blocks[table:不管，交给谁].heading_size"
     ],
     "requirement": "原表卡/行卡的路牌位置和卡头大小必须保留；table 当前不消费这三个字段。",
     "evidence": "旧规格 notes；components/table/table.py:render_table"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[points_card:不做].illustration",
      "blocks[points_card:不做].icons"
     ],
     "requirement": "不做卡有禁止物件在卡内左侧（横）/顶部（竖）；普通 points_card 在未启用 item_cards/header_left 时忽略图标，现规格的四条仍为普通清单，需按原图落实整卡插画。",
     "evidence": "旧规格 notes；components/comp-text/cards.py:_points_headed"
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
     "evidence": "定稿 skill-chinese-asr-04.scene 每块一个、共三个，库存只估1个；总manifest仅1个"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:边界].text_ref"
     ],
     "requirement": "标题“边界”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
     "align": "left",
     "size": "large",
     "row": "hero",
     "row_v": true,
     "width": "38%",
     "text_ref": "边界"
    },
    {
     "type": "illustration",
     "row": "hero",
     "row_v": true,
     "width": "62%",
     "illustration": "outside"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "管"
    },
    {
     "type": "table",
     "columns": 1,
     "heading_size": "large",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "inner_columns": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "不做"
    }
   ],
   "notes": "原v标题左、路牌主图右卡外；管卡在上，麦克风图在卡内顶部。五表行改单列五卡、这些事粗体置上找谁和链接置下；v2采用approved替换，最后不做四条整宽排列。原v与v2末两表行有重叠，按同一屏定稿只显示一次。",
   "pending_requirements": [
    {
     "owner": "table",
     "type": "unsupported_layout",
     "fields": [
      "blocks[table:不管，交给谁].illustration",
      "blocks[table:不管，交给谁].icons",
      "blocks[table:不管，交给谁].heading_size"
     ],
     "requirement": "原表卡/行卡的路牌位置和卡头大小必须保留；table 当前不消费这三个字段。",
     "evidence": "旧规格 notes；components/table/table.py:render_table"
    },
    {
     "owner": "comp-text",
     "type": "unsupported_layout",
     "fields": [
      "blocks[points_card:不做].illustration",
      "blocks[points_card:不做].icons"
     ],
     "requirement": "不做卡有禁止物件在卡内左侧（横）/顶部（竖）；普通 points_card 在未启用 item_cards/header_left 时忽略图标，现规格的四条仍为普通清单，需按原图落实整卡插画。",
     "evidence": "旧规格 notes；components/comp-text/cards.py:_points_headed"
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
     "evidence": "定稿 skill-chinese-asr-04.scene 每块一个、共三个，库存只估1个；总manifest仅1个"
    },
    {
     "owner": "素材负责人",
     "type": "missing_asset",
     "fields": [
      "blocks[illustration].illustration"
     ],
     "requirement": "illustration 需要 1 个，当前有效总 manifest 有 0 个；按源文物件语义和原序补齐，不复用错误物件、不放空图。",
     "evidence": "旧规格保留竖版标题旁外置路牌主图；当前总manifest没有 illustration"
    },
    {
     "owner": "素材负责人",
     "type": "title_fallback",
     "fields": [
      "blocks[chapter_title:边界].text_ref"
     ],
     "requirement": "标题“边界”当前总 manifest 无逐字一致的合格 title 素材，程序会用字体兜底；补合格标题图后核对原浓度。",
     "evidence": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-chinese-asr\\page.json:skill-chinese-asr-04.text; typeset-assets/manifest.jsonl；components/core/__init__.py:_title"
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "一只打钩的麦克风",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-chinese-asr",
   "source_phrase": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，五行，右列的技能名画成链接；表格下面一张卡片“不做”，四条短句。每块左上一个小水彩图标（一只打钩的麦克风、一个指路牌、一个禁止小标）。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
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
中文录音和微信语音转成文字；时间戳；分说话人、估计有几个人（有依据时才给一个能推翻的估计，分成几组本身不算人数）；哪几句是我说的；重要录音；云端复核；转写项目的维护、换模型、升级依赖；Win+H 听写出的毛病。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 某段录音在哪、录音里某句话在哪一段 | 〔找照片、视频、录音〕先找到录音，再按指纹取这里已有的结果 |
| 读微信聊天、把语音消息导出来 | 〔微信聊天读取〕；导出后要文字才交到这里 |
| 一张照片或一段录音里有没有我 | 〔照片录音里有没有我〕；录音那一半借用这里的声音参考 |
| 图片、截图里的字 | 〔本地文字识别〕 |
| 一堆不知道是什么的文件 | 当时的 AI 先看类型、选合适的读法，是中文录音再交过来 |

**不做**
- 英文、多语种和做字幕不是目标。
- 不认别人是谁：别人只标“对方”或“说不准”。
- 说“重要”会走本地两个模型的重要录音路线，标了重要的也算疑难，免费期内会自动请云端再听一遍（并排存，不覆盖本地稿）；免费期外，或不经本地转写直接整段上云，才要我点头。
- 不因为出了新版本就换模型，也不设定时下载；有同一批录音比出来明显更好的证据，AI 才换，并留好退回。
