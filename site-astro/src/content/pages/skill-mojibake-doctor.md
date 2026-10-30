---
{
 "title": "修乱码",
 "kind": "skill",
 "url": "/skills/mojibake-doctor/",
 "tagline": "查清中文乱码怎么来的，能严格倒回才修。",
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
  "page": "skill-mojibake-doctor",
  "kind": "skill",
  "title": "修乱码",
  "url": "/skills/mojibake-doctor/",
  "tagline": "查清中文乱码怎么来的，能严格倒回才修。",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-23 00:04"
   },
   "facts": [
    "近 7 天 AI 用了 7 次"
   ],
   "as_of": "2026-10-24",
   "source": "AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。"
  },
  "based_on": {
   "commit": "6dd21f643bef0efb33263afe9e9527bf4362879d",
   "commit_time": "2026-09-28T19:28:54+08:00",
   "file": "E:\\.agents\\skills\\mojibake-doctor\\SKILL.md、scripts\\mojibake_core.py（786 行）、scripts\\mojibake_doctor.py（302 行）"
  },
  "video_prompt": "",
  "registry": {
   "groups": [
    {
     "id": "g-detect",
     "name": "怎么判断"
    },
    {
     "id": "g-find",
     "name": "查"
    },
    {
     "id": "g-fix",
     "name": "修"
    },
    {
     "id": "g-guard",
     "name": "守"
    }
   ],
   "features": [
    {
     "id": "f-scan",
     "group": "g-find",
     "name": "扫文件夹",
     "what": "挑出哪些文件乱码，报告只有统计和结论",
     "how": "说“扫一下这个文件夹”",
     "status": "说不准",
     "screen": "skill-mojibake-doctor-04",
     "source": "E:\\.agents\\skills\\mojibake-doctor\\scripts\\mojibake_doctor.py run_scan；使用小记录 9 月 17 日 03:19 命令 1 次，分不出子命令"
    },
    {
     "id": "f-diagnose",
     "group": "g-find",
     "name": "诊断一个文件",
     "what": "出修复计划：层数、修前修后指纹、目标编码",
     "how": "说“这个文件乱码了”",
     "status": "说不准",
     "screen": "skill-mojibake-doctor-04",
     "source": "E:\\.agents\\skills\\mojibake-doctor\\scripts\\mojibake_core.py create_repair_plan"
    },
    {
     "id": "f-skip",
     "group": "g-find",
     "name": "跳过的也说清",
     "what": "二进制、>5 MB、不认识的扩展名、链接都记为跳过，列出最多 200 条，总数照实",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_doctor.py SKIPPED_REASONS、MAX_SKIPPED_LISTED；mojibake_core.py MAX_FILE_BYTES"
    },
    {
     "id": "f-utf16",
     "group": "g-find",
     "name": "UTF-16 文件",
     "what": "带 BOM 的分类、扫描，不自动改",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-mojibake-doctor-04",
     "source": "SKILL.md；tests\\test_mojibake_doctor.py test_utf16_bom_is_classified_and_scanned"
    },
    {
     "id": "f-preview",
     "group": "g-fix",
     "name": "预览",
     "what": "看修好的样子，不写",
     "how": "说“先给我看修好是什么样”",
     "status": "说不准",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_doctor.py repair（不带 --apply）"
    },
    {
     "id": "f-apply",
     "group": "g-fix",
     "name": "修一个文件",
     "what": "指纹核对、原字节备份、修改单、整份原子替换",
     "how": "说要修哪个文件就直接修",
     "status": "没用过",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_core.py apply_repair_plan；E:\\Data\\AppData\\Codex\\MojibakeDoctor\\transactions 不存在"
    },
    {
     "id": "f-verify",
     "group": "g-fix",
     "name": "修完再验",
     "what": "确认文件就是计划里的那一版",
     "how": "自动",
     "status": "没用过",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_core.py verify_repair_plan"
    },
    {
     "id": "f-restore",
     "group": "g-fix",
     "name": "还原",
     "what": "按修改单换回原样，备份被改或文件又被改都拒绝",
     "how": "说“还原回去”",
     "status": "没用过",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_core.py restore_transaction；测试 test_restore_is_hash_pinned_and_idempotent、test_restore_refuses_target_drift"
    },
    {
     "id": "f-normalize",
     "group": "g-fix",
     "name": "老 GBK 文件转 UTF-8",
     "what": "明说来源是 GB18030 且逐字节无损才转",
     "how": "说“这是老的 GBK 文件，转成 UTF-8”",
     "status": "没用过",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_core.py analyze_file normalize_from；--normalize-from gb18030"
    },
    {
     "id": "f-format",
     "group": "g-guard",
     "name": "格式照规矩",
     "what": "含中文 .ps1 带 BOM，Markdown/JSON/YAML 不带",
     "how": "自动",
     "status": "说不准",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_core.py encode_for_target；SKILL.md 最后一段；诊断时调用（mojibake_core.py 391 行），跟诊断一样分不出是否用过"
    },
    {
     "id": "f-backup-root",
     "group": "g-guard",
     "name": "备份放稳的地方",
     "what": "放 CODEX_HOME 下，没有就停下要位置",
     "how": "自动",
     "status": "没用过",
     "screen": "skill-mojibake-doctor-04",
     "source": "mojibake_core.py _default_transaction_root；CODEX_HOME=E:\\Data\\AppData\\Codex；只在真修时用到（mojibake_core.py 438 行），默认备份目录不存在"
    }
   ],
   "numbers": [
    {
     "id": "n-usage",
     "text": "读这个技能 26 次，跑它的命令 2 次",
     "meaning": "使用小记录：kind=skill 的 mojibake-doctor（Codex 23、Claude 3），name=mojibake_doctor.py 的命令 2 次（Codex，9 月 17 日 03:19、10 月 7 日 02:55）",
     "as_of": "2026-10-08",
     "source": "E:\\Data\\PCConfig\\AiUsageLedger\\usage-events.jsonl；9 月 17 日 02:24–10 月 7 日 22:56（北京），记录记到 10 月 8 日 23:59",
     "screens": [
      "skill-mojibake-doctor-01"
     ]
    },
    {
     "id": "n-repairs",
     "text": "还没有真正修过一个文件",
     "meaning": "默认备份目录 CODEX_HOME\\MojibakeDoctor\\transactions 不存在；每次真修都会在这里留一份",
     "as_of": "2026-10-10",
     "source": "列目录 E:\\Data\\AppData\\Codex\\MojibakeDoctor（10 月 10 日仍不存在）",
     "screens": [
      "skill-mojibake-doctor-01",
      "skill-mojibake-doctor-04"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-codex-home",
     "with": "Codex",
     "direction": "拿来",
     "flow": "原样备份放在 Codex 数据目录 CODEX_HOME 下",
     "source": "mojibake_core.py _default_transaction_root"
    }
   ],
   "mentions": [
    {
     "target": "/skills/localocr/",
     "screen": "skill-mojibake-doctor-05",
     "text": "本地文字识别"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "skill-mojibake-doctor-05",
     "text": "改项目前先核对"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "五个子命令名（scan、diagnose、repair、verify、restore）和 --output、--transaction-root 参数不上页，用人话写成扫、诊断、预览、修、验、还原。",
    "判定阈值的常量名不上页，只写数值。"
   ],
   "unsure": [
    "替本人口吻写的句子：第 1 屏六句“怎么跟 AI 说”；第 2 屏“我：……”两句和“我说‘修 README.md’”。",
    "第 2 屏例子：四个文件是我在临时目录造的（README.md、步骤.txt、短.txt、正常.md），扫描、诊断、预览、修、验、还原都是 9 月 28 日 22:10–22:22 真跑的，备份放在临时目录（--transaction-root），没有动任何真实文件。“AI 交回”是按结果写的话。",
    "“已经还原过就不再动它”依据测试名 test_restore_is_hash_pinned_and_idempotent，这次实跑第二次还原的返回状态没细看。",
    "第 4 屏“说不准”“没用过”的判定写在图上；这一页有自己的功能清单（技能不是某个项目的入口），编号放在 registry.features。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-mojibake-doctor/page.json",
  "sha256": "5c687cb756694899b72f4aeadc1e9edc76a9610b1b897ed5320003d444945604",
  "converted_at_beijing": "2026-10-30T11:16:51+08:00"
 }
}
---

::screen{#skill-mojibake-doctor-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-mojibake-doctor-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版画面：左上大标题毛笔艺术字，下面一行小字（技能名那一行，链接画成绿色下划线）。左半边上“它做什么”一段，下面一段浅绿底的小字（不用点名那段）和一行灰色小字（用了多少次那行）。右半边一张大的水彩对话卡片“怎么跟 AI 说”：每句画成一个浅绿色圆角对话气泡，一列排，气泡里的字就是引号里的话（引号也画）。右上角一幅小插画：一张纸上半截是一串歪歪扭扭的怪字，中间一只镊子夹起一小块，下半截变回整齐的中文；纸边上一个小小的回形针夹着一张备份小卡。 插画中的纸上只用抽象错乱笔迹和整齐线条作示意，不写具体故意乱码字串或替换字符，也不把示意当成实测文件数据。",
  "portrait": "竖版单张：原标题、技能名；它做什么整宽正文；六句怎么跟 AI 说各一整宽气泡；原不用点名段和使用灰字在最后。正文36源px、44行高，860源px净宽，插画仅小标识，不占大块正文空间。插画中的纸上只用抽象错乱笔迹和整齐线条作示意，不写具体故意乱码字串或替换字符，也不把示意当成实测文件数据。",
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
     "text_ref": "修乱码",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "68%"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 23 日 00:04",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 7 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 24 日 · AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "技能名",
     "row": "hero"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "32%",
     "index": 0,
     "illustration": "outside",
     "size": "banner",
     "target_width": 340,
     "align": "right"
    },
    {
     "type": "points_card",
     "text_ref": "它做什么",
     "whole_block": true,
     "row": "body",
     "width": "46%"
    },
    {
     "type": "notice",
     "text_ref": "不用点名：",
     "row": "body"
    },
    {
     "type": "prose",
     "text_ref": "使用小记录开始记以来",
     "row": "body"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 1,
     "split_paras": true,
     "tail": true,
     "illustration": "none",
     "row": "body",
     "width": "54%"
    }
   ],
   "notes": "2026-10-03 14:04:34 page-fixer-01 当前构图，以当前blocks为准：依据审查及压小图复核消除空白/窄表/插画变形，所有原字、原热区和未解决组件要求保留；历史构图意图已随本轮旧规格副本留作临时回退，不把旧notes当现状。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "修乱码",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 23 日 00:04",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 7 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 24 日 · AI 使用小记录（10 月 14 日—10 月 20 日，7 个完整北京时间自然日）；之后尚未补采，仍为 Unknown。次数和最近时间只表示已记录的 AI 调用，不证明业务效果。"
    },
    {
     "type": "illustration",
     "index": 0,
     "illustration": "outside",
     "size": "banner",
     "target_width": 392,
     "align": "center"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "points_card",
     "text_ref": "它做什么",
     "whole_block": true
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 1,
     "split_paras": true,
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "不用点名："
    },
    {
     "type": "prose",
     "text_ref": "使用小记录开始记以来"
    }
   ],
   "notes": "2026-10-03 14:04:34 page-fixer-01 当前构图，以当前blocks为准：依据审查及压小图复核消除空白/窄表/插画变形，所有原字、原热区和未解决组件要求保留；历史构图意图已随本轮旧规格副本留作临时回退，不把旧notes当现状。"
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
   "asset": "_library/illustrations/乱码修复通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "乱码修复通用构图",
   "source_phrase": "右上角一幅小插画：一张纸上半截是一串歪歪扭扭的怪字，中间一只镊子夹起一小块，下半截变回整齐的中文；纸边上一个小小的回形针夹着一张备份小卡。",
   "sha256": "654836fb065c59c5959d1f6583beb44040fcc5e597fd50943aebfa97e831037f",
   "status": "ready",
   "original_elements": [
    "一张纸上半截是一串歪歪扭扭的怪字，中间一只镊子夹起一小块，下半截变回整齐的中文；纸边上一个小小的回形针夹着一张备份小卡"
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
   "asset": "_library/titles/title-66149eed64850fe3895f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-66149eed64850fe3895f",
   "title_text": "修乱码",
   "sha256": "fbf3fbec7d298beb4e75a8fb2edb8e1b12ef28e0bdb35c51bf18f476c54310f7",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

修乱码

技能名 mojibake-doctor

**它做什么**
文件里的中文变成乱码时，AI 用它先从原始字节查清是怎么乱的，再决定能不能修：能严格倒回去的才修。我只说看看，它先给我看修好的样子；我已经说了要修哪个文件，它就直接修：先存好原样备份、核对指纹，再整份换掉，修完再核验一遍。修错了能照备份还原。原始内容已经丢失的，它说明缺口，不硬修。

**怎么跟 AI 说**
“这个文件打开全是乱码，帮我看看。”
“扫一下这个文件夹，哪些文件乱码了？”
“先给我看修好是什么样，别直接改。”
“就修 README.md 这一个。”
“刚才修的那个，还原回去。”
“这是老的 GBK 文件，转成 UTF-8。”

不用点名：说到乱码、中文显示成怪字、UTF-8 和 GBK 弄混、文件头的 BOM 坏了，AI 自己会用上它。

使用小记录开始记以来，AI 读这个技能 26 次，跑它的命令 2 次。这台电脑上还没有真正修过一个文件（10 月 10 日查的备份目录）。

::screen{#skill-mojibake-doctor-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-mojibake-doctor-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版画面：左上标题，旁边一枚灰色小标签（例子来历那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”几步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一只放大镜照着一串怪字、一把往回拧的扳手、一个问号小气泡、一个上了锁的备份盒、一个往回转的箭头），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。 插画中的纸上只用抽象错乱笔迹和整齐线条作示意，不写具体故意乱码字串或替换字符，也不把示意当成实测文件数据。",
  "portrait": "竖版保留既有两张顺序v→v2。v只含原标题、原例子来历、我提问、AI 做了什么及步骤1–4；v2保持正确原步骤5、AI 交回、另一种问法及全部原字，不重画v2。v正文36源px、44行高、860源px净宽，小图标在标题旁，整宽按1–4顺序排，不能把步骤5或后续回复搬回v。插画中的纸上只用抽象错乱笔迹和整齐线条作示意，不写具体故意乱码字串或替换字符，也不把示意当成实测文件数据。",
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
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "line",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "split_paras": true,
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "dialogue",
     "text_ref": "另一种问法",
     "columns": 1,
     "split_paras": true,
     "tail": true,
     "illustration": "none"
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "line",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "split_paras": true,
     "tail": true,
     "illustration": "none"
    },
    {
     "type": "dialogue",
     "text_ref": "另一种问法",
     "columns": 1,
     "split_paras": true,
     "tail": true,
     "illustration": "none"
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 原portrait要求v只含步骤1–4、v2始于步骤5；现有引擎只按几何高度分张，page_break_after未消费，分页边界列未完成。",
   "requested_split": {
    "before_step": 5
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
   "source_phrase": "一只放大镜照着一串怪字",
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
   "asset": "_library/hires-icons-r2/扳手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "扳手",
   "source_phrase": "一把往回拧的扳手",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
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
   "source_phrase": "一个问号小气泡",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "纸箱对勾",
   "source_phrase": "一个上了锁的备份盒",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个往回转的箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/乱码修复通用构图.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "ill-32c810f698d5c2",
   "source_phrase": "横版画面：左上标题，旁边一枚灰色小标签（例子来历那一行）。左边约三分之二宽画成一段竖向的对话：最上面“我”的气泡（右对齐，浅绿底），下面“AI 做了什么”几步画成一条细竖线串起的小节点（每个节点一个小水彩图标：一只放大镜照着一串怪字、一把往回拧的扳手、一个问号小气泡、一个上了锁的备份盒、一个往回转的箭头），再下面“AI 交回”画成左对齐的白底气泡。右边约三分之一宽一张竖卡片“另一种问法”，里面一问一答两个气泡。 插画中的纸上只用抽象错乱笔迹和整齐线条作示意，不写具体故意乱码字串或替换字符，也不把示意当成实测文件数据。",
   "sha256": "654836fb065c59c5959d1f6583beb44040fcc5e597fd50943aebfa97e831037f",
   "status": "ready",
   "original_elements": [],
   "hidden": false
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

示例：照这个技能的做法写的，不是某一次的记录；文件是为这个例子造的，结果是 9 月 28 日真跑出来的

我：“docs 文件夹里好几个文件打开是乱码，看看。”

**AI 做了什么**
1. 扫了 4 个文件：3 个有问题，“正常中文”那份没被报。
2. README.md 的标题被读成乱码。UTF-8 的字被当成 GBK 读错了一次；倒回一层得到“# 项目说明”，常用字占比从 0.24 升到 1.0，确定度“高”，能修。
3. 步骤.txt 被错读了两次，倒回两层得到“第一步：打开设置”，也是“高”、能修。
4. 短.txt 倒回后是“你好”，但只有两个字，也可能本来就这么写，只报不修。
5. 我说“修 README.md”：先预览，不写；再修：存一份原字节备份和一张修改单，确认诊断之后文件没被人动过，整份一次换掉；最后再验一遍，通过。

**AI 交回**
“README.md 修好了，标题是‘# 项目说明’，原样备份在修改单旁边。步骤.txt 也能修，要修再说。短.txt 只有两个字，拿不准，我没动。”

**另一种问法**
我：“刚才修的那个，还原回去。”
AI：“先核对备份没被动过、文件还是我修完的样子，才换回原样；已经还原过就不再动它。现在它又是乱码那版了。”

::screen{#skill-mojibake-doctor-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-mojibake-doctor-03",
  "section": "abilities",
  "title": "能做的事：怎么判断是乱码",
  "scene": "横版画面：左上标题。上半部分一条从左到右的流程：一段怪字 → 按 GB18030 编回字节（画一串小方块）→ 按 UTF-8 解开 → 一段正常中文，箭头上写每一步的小字；流程下方一个小循环箭头标“最多 8 层”。下半部分左右两张卡片：左边“修不修，看这三条”，右边“哪些不算乱码”。",
  "portrait": "竖版：流程改成从上到下四个方框；两张卡片一行一张。",
  "links": [],
  "anchors": [
   {
    "id": "g-detect",
    "text": "怎么判断是乱码"
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
     "text_ref": "能做的事：怎么判断是乱码",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "只看原始字节",
     "direction": "horizontal",
     "columns": 4,
     "connector": "arrow",
     "illustration": "none",
     "segment_refs": [
      "把怪字按 GB18030",
      "再按 UTF-8",
      "来回一个字节"
     ],
     "semantic_layout": "byte_reversal_four_nodes"
    },
    {
     "type": "comparison",
     "text_ref": "修不修",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "修不修"
      },
      {
       "text_ref": "哪些不算"
      }
     ],
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "还会一起报出的疑点",
     "whole_block": true
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 四个流程框与最多8层小循环仅有连续原文描述，现flow不拆para，需组件逐字分段及无字几何；当前保留全文，不冒称构图完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事：怎么判断是乱码",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "只看原始字节",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "segment_refs": [
      "把怪字按 GB18030",
      "再按 UTF-8",
      "来回一个字节"
     ],
     "semantic_layout": "byte_reversal_four_nodes"
    },
    {
     "type": "comparison",
     "text_ref": "修不修",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "修不修"
      },
      {
       "text_ref": "哪些不算"
      }
     ],
     "illustration": "none"
    },
    {
     "type": "notice",
     "text_ref": "还会一起报出的疑点",
     "whole_block": true
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 四个流程框与最多8层小循环仅有连续原文描述，现flow不拆para，需组件逐字分段及无字几何；当前保留全文，不冒称构图完成。"
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
   "asset": "_library/titles/title-379e63da6e51a7e561b3.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-379e63da6e51a7e561b3",
   "title_text": "能做的事：怎么判断是乱码",
   "sha256": "0e3eb8ccb4cf55700f6ef989ab5f0886f5949b011fe9b59fa89ba15818970ce4",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事：怎么判断是乱码

**只看原始字节，不靠词表**
最常见的中文乱码，是 UTF-8 写的字被当成 GBK（GB18030）读了。它把这一步严格地倒回去：把怪字按 GB18030 编回字节，再按 UTF-8 解开，来回一个字节都不差才算倒回一层；被错读了几次就倒几层，最多 8 层。

**修不修，看这三条**
- 倒回后的文字里，常用汉字（GB2312 一级字和 Big5 常用字）占比到 0.65 以上
- 比原来至少高 0.25
- 至少 3 个常用汉字才给修复方案；只有 2 个的只报“可能是”，不给修

**哪些不算乱码**
- 普通中文本身不算；能按 GB18030 解开，也不证明原意是中文
- 标点、符号不拉低分数；日文、韩文和 � 留在分母里，不会被误当成中文
- 不用哪个项目专门的词表来判定，换个仓库标准也一样

**还会一起报出的疑点**
替换符 �（字已经丢了）、私用区字符、扩展 A 区和兼容区汉字的数量；这些只用来提示，不作为修复依据。

::screen{#skill-mojibake-doctor-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-mojibake-doctor-04",
  "section": "abilities",
  "title": "能做的事：全部功能",
  "scene": "横版画面：左上标题。三张并排的竖卡片，各一个小水彩图标在左上角（放大镜、扳手、锁），卡片标题粗体，下面每条功能一行：粗体功能名，后面一句话，行尾括号里的状态词前面画一个状态圆点（没用过＝灰圆点，说不准＝浅灰圆点）。最下面一行图例（两种圆点照画），后面一行灰字写判定。",
  "portrait": "竖版：三张卡片一行一张；图例在最后。",
  "links": [],
  "anchors": [
   {
    "id": "g-find",
    "text": "查"
   },
   {
    "id": "f-scan",
    "text": "扫文件夹"
   },
   {
    "id": "f-diagnose",
    "text": "诊断一个文件"
   },
   {
    "id": "f-skip",
    "text": "跳过的也说清"
   },
   {
    "id": "f-utf16",
    "text": "UTF-16 文件"
   },
   {
    "id": "g-fix",
    "text": "修"
   },
   {
    "id": "f-preview",
    "text": "预览",
    "locator_text": {
     "h": "预览：看修好的样子，一个字节都不写"
    }
   },
   {
    "id": "f-apply",
    "text": "修一个文件"
   },
   {
    "id": "f-verify",
    "text": "修完再验"
   },
   {
    "id": "f-restore",
    "text": "还原"
   },
   {
    "id": "f-normalize",
    "text": "老 GBK 文件转 UTF-8"
   },
   {
    "id": "g-guard",
    "text": "守"
   },
   {
    "id": "f-format",
    "text": "格式照规矩"
   },
   {
    "id": "f-backup-root",
    "text": "备份放稳的地方"
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
     "text_ref": "能做的事：全部功能",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "comparison",
     "text_ref": "查",
     "columns": 3,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "查"
      },
      {
       "text_ref": "修"
      },
      {
       "text_ref": "守"
      }
     ],
     "illustration": "top_inside",
     "icons": "auto",
     "group_images": [
      "_library/icons/放大镜.png",
      "_library/icons/扳手.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "灰圆点"
    },
    {
     "type": "notice",
     "text_ref": "没用过："
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 查/修/守三外卡及状态点按scene；inventory只估1图标而scene指定3个，按3个素材位记录缺口。状态词前灰/浅灰圆点尚需组件，不修改定稿词。 三外卡只在组头各一图，不给11条另造图标；状态点需按原词组接口，仍列未完成。\n2026-10-03 页修复员 page-fixer-01：依据本页 _qa/review 审查意见调整构图；本轮 fields 以实际重出 report/notes 核验，原 notes 是旧规格说明，不作为本轮已完成证据。\n2026-10-06 Astra复核退回：恢复721f9c5的本屏横版构图、插画大小和位置。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事：全部功能",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "comparison",
     "text_ref": "查",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "查"
      },
      {
       "text_ref": "修"
      },
      {
       "text_ref": "守"
      }
     ],
     "illustration": "top_inside",
     "icons": "auto",
     "group_images": [
      "_library/icons/放大镜.png",
      "_library/icons/扳手.png",
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "灰圆点"
    },
    {
     "type": "notice",
     "text_ref": "没用过："
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 查/修/守三外卡及状态点按scene；inventory只估1图标而scene指定3个，按3个素材位记录缺口。状态词前灰/浅灰圆点尚需组件，不修改定稿词。 三外卡只在组头各一图，不给11条另造图标；状态点需按原词组接口，仍列未完成。\n2026-10-03 页修复员 page-fixer-01：依据本页 _qa/review 审查意见调整构图；本轮 fields 以实际重出 report/notes 核验，原 notes 是旧规格说明，不作为本轮已完成证据。"
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "扫文件夹：挑出哪些文件乱码，报告只有统计和结论，不带正文（说不准）",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "查",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "修",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "守",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "查",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "修",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "守",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-0331b958f7f8c35b2760.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0331b958f7f8c35b2760",
   "title_text": "能做的事：全部功能",
   "sha256": "080376b45bddcbd43ad87c18d4cb9ea49125a354c8736725cbe0f6d31c7dcd3c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

能做的事：全部功能

**查**
- **扫文件夹**：挑出哪些文件乱码，报告只有统计和结论，不带正文（说不准）
- **诊断一个文件**：出一份修复计划，写明倒回几层、修前修后的指纹（说不准）
- **跳过的也说清**：二进制、超过 5 MB、不认识的扩展名、链接和快捷目录都记为“跳过”，点名的文件跳过也会写出来（说不准）
- **UTF-16 文件**：带文件头的会分类、会扫，但不自动改（说不准）

**修**
- **预览**：看修好的样子，一个字节都不写（说不准）
- **修一个文件**：只修点名的那一个；先存原字节备份和修改单，核对指纹，整份一次换掉（没用过）
- **修完再验**：确认文件就是计划里的那一版（没用过）
- **还原**：按修改单换回原样；备份被动过、文件又被改过都不换（没用过）
- **老 GBK 文件转 UTF-8**：必须明说原来是 GB18030，且转换一个字节不丢（没用过）

**守**
- **格式照规矩**：诊断时就按目标格式算好：含中文的 .ps1 存成带 BOM 的 UTF-8，Markdown、JSON、YAML 不带 BOM（说不准）
- **备份放稳的地方**：真修时放在 Codex 数据目录（这台电脑是 E:\Data\AppData\Codex）下，找不到就停下要我给位置，不退到临时目录或系统盘（没用过）

灰圆点＝没用过　浅灰圆点＝说不准
没用过：每修一次都会在备份目录留下一份，这台电脑上一份也没有。说不准：9 月 17 日跑过 1 次命令，记录分不出是扫描、诊断还是预览。

::screen{#skill-mojibake-doctor-05 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-mojibake-doctor-05",
  "section": "limits",
  "title": "边界",
  "scene": "横版画面：左上标题。左边约三分之一宽一张卡片“管”，一段字；右边约三分之二宽一张两列表格“不管，交给谁”，右列的名字画成链接；表格下面一张卡片“不做”。每块左上一个小水彩图标（一个打钩的镊子、一个指路牌、一个禁止小标）。",
  "portrait": "竖版：“管”卡片在上；表格改成小卡片一行一张（粗体写“这些事”，下面写找谁）；“不做”在最后。",
  "links": [
   {
    "text": "本地文字识别",
    "href": "/skills/localocr/"
   },
   {
    "text": "改项目前先核对",
    "href": "/skills/project-entry-gate/"
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
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "scope",
     "width": "33%"
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁",
     "row": "scope",
     "width": "65%"
    },
    {
     "type": "table",
     "text_ref": "这些事",
     "columns": 2,
     "columns_v": 1,
     "row": "scope"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "scope"
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 原scene每块左上一个图标共3个，inventory只估1个；保留三素材位需求，不假称已齐。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "管",
     "columns": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事",
     "columns": 2,
     "columns_v": 1
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "构图依据typeset-inventory/screens.jsonl的source_layout及本屏定稿scene/portrait；不读取图。整宽章节标题居中，首屏左栏标题依原构图左对齐。所有可读字取定稿，示意图只可抽象笔迹，不新增怪字。 原scene每块左上一个图标共3个，inventory只估1个；保留三素材位需求，不假称已齐。"
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
   "source_phrase": "一个打钩的镊子",
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
文本文件里的中文乱码：UTF-8 和 GBK／GB18030 弄混、错读好几层、文件头 BOM 坏了、出现 � 或私用区字符；查清怎么乱的，能严格倒回的才修，修的时候留好退路。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 图片、扫描件里的字 | 〔本地文字识别〕 |
| 一堆不知道是什么的文件 | 当时的 AI 先看类型、选合适的读法，是乱码文本再交过来 |
| 修好之后提交、推送到仓库 | 〔改项目前先核对〕 |

**不做**
- 不批量自动改：一次只修我点名的一个文件；我只说看看时，只预览、不改。
- 字已经丢了（�）不硬补：先找 Git 历史、备份，或者重新生成。
- 只有两个字的“疑似”不修。
- GB18030 文件不自动转；不带文件头的 UTF-16 和 GB18030 光看字节分不清，没弄清来源前不转。
- 不跟随链接和快捷目录，不把备份放到会被清掉的地方。
