---
{
 "title": "省流量的云端素材",
 "kind": "skill",
 "url": "/skills/cloud-asset-channel/",
 "tagline": "AI 要反复读的文件，云上放一份，AI 在云里读。",
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
  "page": "skill-cloud-asset-channel",
  "kind": "skill",
  "title": "省流量的云端素材",
  "url": "/skills/cloud-asset-channel/",
  "tagline": "AI 要反复读的文件，云上放一份，AI 在云里读。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "file": "E:\\.agents\\skills\\cloud-asset-channel\\SKILL.md",
   "draft_worktree": "E:\\Cache\\Claude\\Temp\\4bd59299\\gpt-children\\20261002-081250-cloud-channel-base-2-490dd9ab\\worktree",
   "draft_commit": "b6cf92ec3321f41dc9377ba3614e02312d0a2a46（另有未提交改动：SKILL.md、reader 说明、能力与运行方式）",
   "rules_release": "E208（待发布；发布后补提交号和生效时间）"
  },
  "video_prompt": "5–8 秒无缝循环，以开头一屏右边的水彩插画为第一帧，镜头不动：桌上笔记本电脑往上飘出一张小画稿，沿一根细细的绿线升进一朵绿色水彩云，只飘一次；云里胸前黑色花结徽章的小机器人举起放大镜，在画稿上从左到右移一格；云下慢慢飘回一个小信封，轻轻落在电脑旁边；桌边绿植的叶子随风轻摇。全程不出现任何文字，不添加新东西。",
  "registry": {
   "groups": [
    {
     "id": "g-upload",
     "name": "传上去、认准版本"
    },
    {
     "id": "g-readers",
     "name": "谁在哪里读"
    },
    {
     "id": "g-keep",
     "name": "留和删"
    },
    {
     "id": "g-ledger",
     "name": "记账和提醒"
    }
   ],
   "features": [
    {
     "id": "f-ensure",
     "group": "g-upload",
     "name": "只传点名的文件",
     "what": "一次一个文件、写明用途，返回网址、指纹、大小、登记号",
     "how": "AI 调 Invoke-CloudAssetChannel.ps1 -Mode Ensure",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“上传、取网址和核对”；round-01\\ensure.json、byte-comparison.json（逐字节一致）"
    },
    {
     "id": "f-dedup",
     "group": "g-upload",
     "name": "同样内容只存一份",
     "what": "SHA-256 加首次扩展名命名，同内容复用",
     "how": "自动",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md；round-01\\ensure-dedup.json uploaded=false"
    },
    {
     "id": "f-version",
     "group": "g-upload",
     "name": "用前先核对",
     "what": "本机指纹变了就传新版，旧引用标“已被替换”",
     "how": "每次用前调 Ensure",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md"
    },
    {
     "id": "f-candidate",
     "group": "g-upload",
     "name": "候选先放着",
     "what": "-Status 候选 / 在用 / 没用",
     "how": "AI 调 Ensure -Status、SetStatus",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md"
    },
    {
     "id": "f-too-big",
     "group": "g-upload",
     "name": "传不上去就说",
     "what": "超过 Wrangler 单次上传能力的文件报失败，不拆分",
     "how": "自动",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“提醒和记账”末段"
    },
    {
     "id": "f-cloud-reader",
     "group": "g-readers",
     "name": "云里的 AI",
     "what": "按网址在云里读；正式云端审图只用新版 Codex Cloud 的 GPT-6.1 Sol",
     "how": "收件箱 Invoke-CloudAssetInbox.ps1 Register/Collect/Cleanup",
     "status": "待实施",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“接入已验证的读者”：新版具体接线由后续版本补齐"
    },
    {
     "id": "f-codex-local",
     "group": "g-readers",
     "name": "Codex 本机程序",
     "what": "不收网址图，如实报没接通",
     "how": "自动",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“模型在哪里读”；traffic\\summary.md 本机两个版本都拒绝远程网址"
    },
    {
     "id": "f-claude-local",
     "group": "g-readers",
     "name": "Claude",
     "what": "本机复核一次读完、一次答完，不走云",
     "how": "自动",
     "status": "在用",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md 开头；本人 10 月 2 日 07:35 原话"
    },
    {
     "id": "f-no-expiry",
     "group": "g-keep",
     "name": "不设过期",
     "what": "在用、按需更新要用的一直留",
     "how": "自动",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“保留和清理”"
    },
    {
     "id": "f-cleanup",
     "group": "g-keep",
     "name": "先看清单再删",
     "what": "Cleanup 预览、Cleanup -Apply 删除已被替换和没用的云副本",
     "how": "AI 调 -Mode Cleanup",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md；round-01\\cleanup-preview.json、cleanup.json"
    },
    {
     "id": "f-ledger",
     "group": "g-ledger",
     "name": "每个任务一本账",
     "what": "正文字节账、RecordTransfer、RecordNetwork；目标 ≤2 倍、>2.5 倍提醒",
     "how": "AI 调 -Mode Usage、RecordTransfer、RecordNetwork",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“提醒和记账”；round-01\\usage-body.json 出过 2.5 倍提醒"
    },
    {
     "id": "f-list",
     "group": "g-ledger",
     "name": "查登记",
     "what": "-Mode List 列出路径、指纹、大小、网址、用途、状态、上传和最后使用时间",
     "how": "AI 调 -Mode List",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md"
    },
    {
     "id": "f-capacity",
     "group": "g-ledger",
     "name": "容量提醒",
     "what": "登记总量到 10GB 的九成提醒本人去 Cloudflare 看付款；不设硬上限",
     "how": "自动，写在 warnings 里",
     "status": "待验收",
     "screen": "skill-cloud-asset-channel-03",
     "source": "SKILL.md“提醒和记账”"
    }
   ],
   "numbers": [
    {
     "id": "n-free",
     "text": "免费 10GB 的九成",
     "meaning": "R2 每月免费存储额度；工具在登记总量到 90% 时提醒",
     "as_of": "2026-10-02",
     "source": "SKILL.md“提醒和记账”；owner-choices.md 07:15 Cloudflare 官方价目",
     "screens": [
      "skill-cloud-asset-channel-03"
     ]
    },
    {
     "id": "n-ratio",
     "text": "2 倍 / 2.5 倍",
     "meaning": "任务传输字节与所用内容版本大小之和的比：目标与提醒线",
     "as_of": "2026-10-02",
     "source": "SKILL.md“提醒和记账”",
     "screens": [
      "skill-cloud-asset-channel-03"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-rule",
     "with": "rule:capabilities-runtime",
     "direction": "被引用",
     "flow": "规则“云端素材通道”一节规定何时走、规矩和标尺，具体命令见本技能",
     "source": "E208 草稿 agents.capabilities-runtime.md"
    },
    {
     "id": "r-r2",
     "with": "外部:Cloudflare R2",
     "direction": "交出",
     "flow": "文件经 Wrangler 网页授权上传桶 wly-ai-assets，公开前缀 https://ai.wly0829.cn/",
     "source": "SKILL.md“入口”；cloud\\r2-setup.md"
    },
    {
     "id": "r-codex-cloud",
     "with": "外部:Codex Cloud",
     "direction": "交出",
     "flow": "云端 GPT 按网址取图、切块看，结论 POST 到收件箱；本机只取文字 JSON",
     "source": "docs/cloud-asset-channel-reader.md"
    }
   ],
   "highlights": [],
   "mentions": [
    {
     "target": "/rules/capabilities-runtime/#p-cloud",
     "screen": "skill-cloud-asset-channel-01",
     "text": "这条通道的规矩：〔云端素材通道〕"
    },
    {
     "target": "/rules/privacy-data/#p-classification",
     "screen": "skill-cloud-asset-channel-04",
     "text": "公开范围照〔公开分级表〕判断"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [],
   "dropped": [
    "命令行参数、登记表路径、Wrangler 命令配置、重试次数、收件箱令牌和 HTTP 状态码：是给 AI 的操作说明，读者不关心；机制写到“云里取图、切块看、结论写回收件箱”为止。",
    "“接上读者时改哪里”（Invoke-ClaudeGptChild.ps1、app-server 输入组装）：开发接线说明，不上网站。",
    "旧版云端读图的实测和自报型号：规则已定不用旧版，网站只写正式路线和现在的做法。"
   ],
   "unsure": [
    "第 1 屏五句“可以这样说”是替本人口吻写的示例说法；实际多数时候由 AI 自己判断走不走这条通道（本人 10 月 2 日 07:36“你自己把握，我不管了”）。",
    "第 2 屏的例子是假设的（40 张、三轮、3 张没变），图上已写“例子是示意”。",
    "状态圆点：照技能页多数做法画（自己写全能做的事的 7 个非入口技能页里 4 个画了状态：修乱码、文稿转 PDF、PDF 逐页检查、汇报网页；3 个没画：照片录音里有没有我、网页上的事接着办、远程只让自己连；18 个入口技能页的能做的事链到项目页全部功能，那里都画了状态）。只在开发测试跑过的标待验收，云里审图标待实施，Claude 本机复核标在用（Claude 10 月 2 日定）。",
    "public=false、repo_url=null：照其他基座技能页（如 tailscale-safe-exposure）的写法，基座仓库是私有的。",
    "不是任何项目的入口，所以能做的事在本页写全，技能总页卡片不带“属于”。基座项目页第 15 屏演进里一句话提到它。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-cloud-asset-channel/page.json",
  "sha256": "afc3176c0b8d5d9c47a10ed8c9945445ab7520c0f23ead1dc2cc78a7c553e8dc",
  "converted_at_beijing": "2026-10-10T05:26:53+08:00"
 }
}
---

::screen{#skill-cloud-asset-channel-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-cloud-asset-channel-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段说明。右边一幅水彩插画：一张浅木色书桌上一台笔记本电脑，屏幕上方只伸出一根细细的绿线，往上连到一朵绿色水彩云；云里一个胸前黑色花结徽章（OpenAI 标志）的奶白小机器人拿放大镜看一张画稿；云下一个小信封正飘回桌上；桌边一盆绿植。插画里不画字。下半部分五个浅绿底对话气泡，两列排开（左三右二），每个气泡里一句引号里的话。最下面一行小字带一个链接，〔云端素材通道〕画成绿色下划线加小箭头的链接样式。",
  "portrait": "竖版：标题、副标题、说明；插画占满宽；五个气泡一行一个；链接小字在最下面。",
  "links": [
   {
    "text": "云端素材通道",
    "href": "/rules/capabilities-runtime/#p-cloud"
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
     "text_ref": "省流量的云端素材",
     "align": "left",
     "row": "hero",
     "width": "55%",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "AI要反复读的文件，从我电脑传到云上一份，之后AI在云里读，不再一遍遍走我电脑的流量。",
     "size": "large",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "做网站时，同一批图要被AI画、审、复核好几轮，每读一次都从我电脑再传一遍，流量远远超过图本身。这个技能告诉AI：同一个文件要读两次以上，或一",
     "row": "hero"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "section_heading",
     "text_ref": "可以这样说：",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“这批图要审好几轮，先放到云上。”",
     "split_paras": true,
     "columns": 2,
     "flow": "column",
     "rows": 3
    },
    {
     "type": "prose",
     "text_ref": "这条通道的规矩：云端素材通道"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-01",
    "component_order": [
     "chapter_title",
     "illustration",
     "tag",
     "dialogue",
     "prose",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "省流量的云端素材",
     "align": "center",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "AI要反复读的文件，从我电脑传到云上一份，之后AI在云里读，不再一遍遍走我电脑的流量。",
     "size": "large",
     "bold": true
    },
    {
     "type": "prose",
     "text_ref": "做网站时，同一批图要被AI画、审、复核好几轮，每读一次都从我电脑再传一遍，流量远远超过图本身。这个技能告诉AI：同一个文件要读两次以上，或一"
    },
    {
     "type": "illustration"
    },
    {
     "type": "section_heading",
     "text_ref": "可以这样说：",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“这批图要审好几轮，先放到云上。”",
     "split_paras": true,
     "columns": 2,
     "flow": "column",
     "rows": 3
    },
    {
     "type": "prose",
     "text_ref": "这条通道的规矩：云端素材通道"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-01",
    "component_order": [
     "illustration",
     "prose",
     "inline_link",
     "chapter_title",
     "tag",
     "dialogue"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/illustrations/云端审稿.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "云端审稿",
   "source_phrase": "右边一幅水彩插画：一张浅木色书桌上一台笔记本电脑，屏幕上方只伸出一根细细的绿线，往上连到一朵绿色水彩云；云里一个胸前黑色花结徽章（OpenAI 标志）的奶白小机器人拿放大镜看一张画稿；云下一个小信封正飘回桌上；桌边一盆绿植。",
   "sha256": "7a411f99317c55a7b24e019d9188e14b2881d7509ca2bc22eaa2571e6b3039c3",
   "status": "ready",
   "original_elements": [
    "一张浅木色书桌上一台笔记本电脑，屏幕上方只伸出一根细细的绿线，往上连到一朵绿色水彩云；云里一个胸前黑色花结徽章（OpenAI 标志）的奶白小机器人拿放大镜看一张画稿；云下一个小信封正飘回桌上；桌边一盆绿植"
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
   "asset": "_library/titles/title-72b5dfcd59fff7329346.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-72b5dfcd59fff7329346",
   "title_text": "省流量的云端素材",
   "sha256": "3400a0a3317e74c4dad43d46e58ee68a555995fbc4e188a7a80eb0143628b905",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 省流量的云端素材
**AI 要反复读的文件，从我电脑传到云上一份，之后 AI 在云里读，不再一遍遍走我电脑的流量。**

做网站时，同一批图要被 AI 画、审、复核好几轮，每读一次都从我电脑再传一遍，流量远远超过图本身。这个技能告诉 AI：同一个文件要读两次以上，或一批文件的处理流量明显超过文件本身时，先把它传到云上（Cloudflare R2）一份，把网址交给能在云里读的 AI，我电脑只收回文字结论。多数时候不用我说，AI 自己判断。

当前可用：文件上传、版本核对和云端命令任务。正式云端审图尚未通过校准，当前关闭；上传成功不代表审图已经验收。

可以这样说：
“这批图要审好几轮，先放到云上。”
“这张图以后还要用，云上那份留着。”
“这个任务一共走了多少流量？”
“云上没用的副本清一清。”
“云上现在占了多少空间？”

这条通道的规矩：〔云端素材通道〕

::screen{#skill-cloud-asset-channel-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-cloud-asset-channel-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色）；右边约 45% 宽一幅水彩插画：一叠画稿只有一份，沿一根绿线升进一朵云，云里一张画稿被切成整齐的小方格，一只放大镜停在其中一格上；云下三个小信封排成一列（代表三轮的文字结论）落回一台笔记本电脑旁。插画里不画字。下面一张横向浅灰卡片写“背后发生了什么”五步，带 1 到 5 的绿色圆圈序号；指纹网址那一句里的 ai.wly0829.cn/ 用等宽字体、浅绿底小框。最下面一行灰色小字是括号里那段。",
  "portrait": "竖版：标题；对话气泡上下排；插画在对话下面；五步一行一条；灰色小字在最后。",
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
     "type": "dialogue",
     "text_ref": "我：“这40张网站图要审三轮。”",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "columns": 1,
     "width": "100%",
     "row": "example"
    },
    {
     "type": "section_heading",
     "text_ref": "背后发生了什么",
     "align": "left",
     "size": "medium",
     "frame": "background-steps"
    },
    {
     "type": "flow",
     "text_ref": "1AI看出这批图要读三轮，超过两次，走这条通道。2每张图先算内容指纹（SHA-256），拿它当云上的名字：ai.wly0829.cn/后面接",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/云.png",
      "_library/icons/云.png",
      "_library/icons/文稿堆.png",
      "_library/icons/云.png"
     ],
     "frame": "background-steps"
    },
    {
     "type": "prose",
     "text_ref": "（例子是示意。上传、"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-02",
    "component_order": [
     "chapter_title",
     "dialogue",
     "illustration",
     "content_card",
     "numbered_steps",
     "monospace",
     "prose"
    ]
   },
   "portrait_required": true
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
     "type": "dialogue",
     "text_ref": "我：“这40张网站图要审三轮。”",
     "split_paras": true,
     "sides": [
      "right",
      "left"
     ],
     "columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "背后发生了什么",
     "align": "left",
     "size": "medium",
     "frame": "background-steps"
    },
    {
     "type": "flow",
     "text_ref": "1AI看出这批图要读三轮，超过两次，走这条通道。2每张图先算内容指纹（SHA-256），拿它当云上的名字：ai.wly0829.cn/后面接",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/云.png",
      "_library/icons/云.png",
      "_library/icons/文稿堆.png",
      "_library/icons/云.png"
     ],
     "frame": "background-steps"
    },
    {
     "type": "prose",
     "text_ref": "（例子是示意。上传、"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-02",
    "component_order": [
     "dialogue",
     "illustration",
     "numbered_steps",
     "prose",
     "chapter_title",
     "content_card",
     "monospace"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "AI 看出这批图要读三轮，超过两次，走这条通道。",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云",
   "source_phrase": "每张图先算内容指纹（SHA-256），拿它当云上的名字：ai.wly0829.cn/ 后面接 64 位指纹和扩展名。云上已有同样内容的，不再传。",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云",
   "source_phrase": "网址交给在 Codex 云端任务里跑的 GPT：它在云里取原图，切成原尺寸小块逐块看，每块附上坐标和指纹，结论写回收件箱。",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "本机只取回几 KB 的文字；第二轮、第三轮审同一张图，本机不再传图。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "云",
   "source_phrase": "有张图改了，指纹跟着变：传新版，旧版标“已被替换”，收尾时删掉云上的旧版。",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/late-r3-cloud-read-three-replies.png",
   "fallback": false,
   "semantic_status": "late_none_original_theme_prepared",
   "key": "late-r3-cloud-read-three-replies",
   "source_phrase": "横版：左上标题。左边约 55% 宽画一段对话（我在右、AI 在左的气泡，浅绿和白两色）；右边约 45% 宽一幅水彩插画：一叠画稿只有一份，沿一根绿线升进一朵云，云里一张画稿被切成整齐的小方格，一只放大镜停在其中一格上；云下三个小信封排成一列（代表三轮的文字结论）落回一台笔记本电脑旁。插画里不画字。下面一张横向浅灰卡片写“背后发生了什么”五步，带 1 到 5 的绿色圆圈序号；指纹网址那一句里的 ai.wly0829.cn/ 用等宽字体、浅绿底小框。最下面一行灰色小字是括号里那段。",
   "sha256": "09b71fedcb832d6f21dc7c89be6556bf22f2e05e2d9dac15449ee6c2dd7e0722",
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

## 一个完整例子

我：“这 40 张网站图要审三轮。”

AI：“40 张已各传到云上一份，其中 3 张和上一轮内容一样，没有重传。三轮都按网址在云里读，本机只取回文字结论；做完告诉你这个任务本机一共传了多少。”

**背后发生了什么**
1. AI 看出这批图要读三轮，超过两次，走这条通道。
2. 每张图先算内容指纹（SHA-256），拿它当云上的名字：ai.wly0829.cn/ 后面接 64 位指纹和扩展名。云上已有同样内容的，不再传。
3. 网址交给在 Codex 云端任务里跑的 GPT：它在云里取原图，切成原尺寸小块逐块看，每块附上坐标和指纹，结论写回收件箱。
4. 本机只取回几 KB 的文字；第二轮、第三轮审同一张图，本机不再传图。
5. 有张图改了，指纹跟着变：传新版，旧版标“已被替换”，收尾时删掉云上的旧版。

（例子是示意。上传、逐字节核对和文字收件箱已实测；旧版云端命令读者已接通，自报 GPT-5.6 Sol。正式审图尚未通过校准，网站图目前由 Claude Opus 终审；新版 GPT-6.1 Sol 的命令读者仍待升级。）

::screen{#skill-cloud-asset-channel-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-cloud-asset-channel-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题。四张卡片排成两行两列，各一个小水彩图标在左上角（一朵云托着一张小图片、一只放大镜、一个打开的小纸箱、一本小账本），卡片标题粗体深绿；上行左“传上去、认准版本”（最长，可以比右边高）、右“谁在哪里读”；下行左“留和删”、右“记账和提醒”。每条一行：粗体功能名，后面一句话，行尾括号里的状态词前面画一个状态圆点（在用＝绿圆点，待验收＝黄圆点，待实施＝空心绿圈），正文深蓝灰。最下面一行图例（三种圆点照画），后面一行灰字写待验收、待实施的意思。不加别的字。",
  "portrait": "竖版：标题；四张卡片一行一张，顺序同横版（先左后右、先上后下）；图例和灰字在最后。",
  "links": [],
  "anchors": [
   {
    "id": "g-upload",
    "text": "传上去、认准版本"
   },
   {
    "id": "g-readers",
    "text": "谁在哪里读"
   },
   {
    "id": "g-keep",
    "text": "留和删"
   },
   {
    "id": "g-ledger",
    "text": "记账和提醒"
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
     "text_ref": "能做的事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "传上去、认准版本",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "谁在哪里读",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "留和删",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-bottom",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "记账和提醒",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-bottom",
     "width": "50%"
    },
    {
     "type": "status_legend",
     "text_ref": "绿圆点＝在用黄圆点＝待验收空心绿圈＝待实施"
    },
    {
     "type": "prose",
     "text_ref": "待验收：做好了，只在开发测试里跑过"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-03",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "prose",
     "status_legend",
     "bullet_list"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "传上去、认准版本",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "谁在哪里读",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "留和删",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "记账和提醒",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "status_legend",
     "text_ref": "绿圆点＝在用黄圆点＝待验收空心绿圈＝待实施"
    },
    {
     "type": "prose",
     "text_ref": "待验收：做好了，只在开发测试里跑过"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-03",
    "component_order": [
     "content_card",
     "prose",
     "status_legend",
     "chapter_title",
     "icon",
     "bullet_list"
    ]
   },
   "portrait_required": true
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "只传点名的文件：一次一个文件、写明用途，不扫整个文件夹（待验收）",
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

## 能做的事

**传上去、认准版本**
- **只传点名的文件**：一次一个文件、写明用途，不扫整个文件夹（待验收）
- **同样内容只存一份**：换了路径、换了扩展名也认得出，不重传（待验收）
- **用前先核对**：每次给 AI 用之前核对本机指纹，变了就传新版、旧版标“已被替换”；不拿记住的旧网址跳过核对（待验收）
- **候选先放着**：待选的素材标“候选”，选中再换成“在用”，落选的标“没用”（待验收）
- **传不上去就说**：大到一次传不上去的文件如实报失败，不偷偷拆成 AI 读不了的几份（待验收）

**谁在哪里读**
- **云里的 AI**：命令读者已接通，在云里取文件、本机只收文字；正式审图尚未通过校准，当前关闭（待验收）
- **Codex 本机程序**：现在不收网址图，如实报没接通，不先下载再上传来冒充省流量（待验收）
- **Claude**：只在本机做自己的复核，每张图一次读完、一次答完，不走云（在用）

**留和删**
- **不设过期**：在用的、以后按需更新还要用的一直留（待验收）
- **先看清单再删**：只删“已被替换”和“没用”的；别处还在用或还是候选的不删。只删云副本，登记历史和本机原件都留着（待验收）

**记账和提醒**
- **每个任务一本账**：记本机实际上传、下载了多少，另记网络实测；目标不超过所用文件大小之和的 2 倍，超过 2.5 倍提醒查重复传输；没实测网络的不报达标（待验收）
- **查登记**：每个文件的路径、指纹、大小、网址、用途、状态、上传和最后使用时间（待验收）
- **容量提醒**：云上总量到免费 10GB 的九成，提醒我去 Cloudflare 看付款；超过也照样能传（待验收）

绿圆点＝在用　黄圆点＝待验收　空心绿圈＝待实施
待验收：做好了，只在开发测试里跑过（上传、逐字节核对、去重、删除、记账都有回执），还没在真实任务里用过。待实施：新版命令读者仍待升级；正式审图必须先通过校准，接通命令不代表可以启用。

::screen{#skill-cloud-asset-channel-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-cloud-asset-channel-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“交给它”约占 38% 宽，右栏“不交给它 / 它不做”约占 60% 宽，每栏一组带小图标的短句卡片（交给它：一叠画稿、一段胶片、一株正在长的小苗；不交给它：一把小锁、一张分级小表、一张单页纸、一支画笔、一把钥匙打了叉、一只小水表）；〔公开分级表〕画成绿色下划线加小箭头的链接样式。最下面一条横跨整屏的浅绿提示条写最后一句话。",
  "portrait": "竖版：标题；两栏改成上下两组，卡片一行一条；提示条在最下面。",
  "links": [
   {
    "text": "公开分级表",
    "href": "/rules/privacy-data/#p-classification"
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
     "text_ref": "交给它",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "item_cards": true,
     "row": "scope-1",
     "width": "100%"
    },
    {
     "type": "points_card",
     "text_ref": "不交给它/它不做",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "item_cards": true,
     "row": "scope-2",
     "width": "100%"
    },
    {
     "type": "notice",
     "text_ref": "上传、命令提交或取回结论失败时"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-04",
    "component_order": [
     "chapter_title",
     "comparison",
     "icon",
     "bullet_list",
     "content_card",
     "inline_link",
     "notice"
    ]
   },
   "portrait_required": true
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
     "text_ref": "交给它",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "item_cards": true
    },
    {
     "type": "points_card",
     "text_ref": "不交给它/它不做",
     "columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none",
     "icon_position": "header_left",
     "item_cards": true
    },
    {
     "type": "notice",
     "text_ref": "上传、命令提交或取回结论失败时"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 新构图，待样张：该方向无原图。；page-fixer-02 按本轮审页意见调整，文字顺序保留定稿。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "skill-cloud-asset-channel-04",
    "component_order": [
     "content_card",
     "notice",
     "chapter_title",
     "comparison",
     "icon",
     "bullet_list",
     "inline_link"
    ]
   },
   "portrait_required": true
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "同一个文件要被 AI 读两次以上",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "source_phrase": "一批文件的处理流量明显超过文件本身，例如逐张审图、看视频帧",
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
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "画笔调色板",
   "source_phrase": "画图：仍在本机",
   "sha256": "6a6909cabd9e10c5748d7103e00ff25f9bda7bc0551925c9a112b53e29275e81",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹上传",
   "source_phrase": "不新建 API 令牌、不经手密钥原文：上传只用 Wrangler 已有的网页授权",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "不改代理和网络设置；不为省流量降低图片质量或拉长任务时间",
   "sha256": "c6826d947b1a5b0e6f5f3c857ffd849b19652e70af280bd81b3b38ef8f86f4ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "以后按需更新还要接着用的素材",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
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

## 边界

**交给它**
- 同一个文件要被 AI 读两次以上
- 一批文件的处理流量明显超过文件本身，例如逐张审图、看视频帧
- 以后按需更新还要接着用的素材

**不交给它 / 它不做**
- 密码、密钥、恢复码、身份证件和银行卡照片：不上云，照旧在本机处理；路径或用途写明是这些的，工具直接拒绝，也不靠改名绕过
- 公开范围照〔公开分级表〕判断，不因为网址猜不到就随便传
- 只读一次的文件：直接读，不绕云
- 画图：仍在本机
- 不新建 API 令牌、不经手密钥原文：上传只用 Wrangler 已有的网页授权
- 不改代理和网络设置；不为省流量降低图片质量或拉长任务时间

上传、命令提交或取回结论失败时，说明具体缺口；先核对同一任务是否受理，不盲目重提或另开一条通道。
