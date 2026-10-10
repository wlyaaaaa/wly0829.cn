---
{
 "title": "网页上的事接着办",
 "kind": "skill",
 "url": "/skills/browser-control-continuity/",
 "tagline": "网页卡住、要登录时，接着把事办完。",
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
  "reading_order": [
   "skill-browser-control-continuity-01",
   "skill-browser-control-continuity-04"
  ],
  "schema": "site-b1.page.v1",
  "page": "skill-browser-control-continuity",
  "kind": "skill",
  "title": "网页上的事接着办",
  "url": "/skills/browser-control-continuity/",
  "tagline": "网页卡住、要登录时，接着把事办完。",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "1a11589e67917290e03df4d478145889f6796b8c",
   "commit_time": "2026-09-28T05:00:16+08:00",
   "file": "E:\\.agents\\skills\\browser-control-continuity\\SKILL.md 及 references\\runtime-recovery.md、scripts\\Invoke-BrowserControlContinuity.ps1"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [
    {
     "id": "n-cache-files",
     "text": "383 个文件 · 与官方安装包一致 · 缺 0",
     "meaning": "Codex 浏览器插件当前版本 26.924.22138 缓存里逐个与官方安装包比对的文件数和缺失数",
     "as_of": "2026-09-28",
     "source": "Invoke-BrowserControlContinuity.ps1 -Mode Inspect -Json，observed_utc 2026-09-28T12:36:07Z，closure.current_version_cache.checked_file_count / missing_file_count",
     "screens": [
      "skill-browser-control-continuity-03"
     ]
    },
    {
     "id": "n-host-keys",
     "text": "4 个程序路径",
     "meaning": "2026-09-18 修复回执里对不上、被改的配置项数",
     "as_of": "2026-09-18",
     "source": "E:\\Data\\PCConfig\\BrowserContinuity\\host-config-repair.json differing_keys",
     "screens": [
      "skill-browser-control-continuity-03",
      "skill-browser-control-continuity-04"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig-runtime",
     "with": "pcconfig",
     "direction": "用到",
     "flow": "只读检查时调用 PCConfig 的 Get-BrowserControlRuntime.ps1，找出当前用户装的 Codex 和官方插件资源",
     "source": "runtime-recovery.md:9；pcconfig f-browser-runtime"
    },
    {
     "id": "r-pcconfig-sms",
     "with": "pcconfig",
     "direction": "用到",
     "flow": "手机号登录时用 Invoke-SmsCode.ps1 从小米妙享转来的通知里取码（待验收，还没真用过）",
     "source": "SKILL.md:41；E:\\PCConfig\\docs\\runtime\\sms-code.md；pending_acceptance.json sms-code-first-real-login"
    },
    {
     "id": "r-google-code",
     "with": "skill-google-workspace-direct",
     "direction": "交给",
     "flow": "网站发到邮箱的验证码，交邮件技能在最近 10 分钟的邮件里等和取",
     "source": "SKILL.md:41“Email codes use the existing authorized email route”"
    },
    {
     "id": "r-chrome-providers",
     "with": "外部：Codex 的 Chrome 插件、Claude in Chrome、AI 桌面版内置浏览器、ChatGPT 云端浏览器",
     "direction": "补充",
     "flow": "技能不替代它们，只补续接、恢复和核对的做法；先读所选浏览器工具自己的说明",
     "source": "SKILL.md:8,19–23,43"
    },
    {
     "id": "r-doctor",
     "with": "agents（只读体检脚本）",
     "direction": "被检查",
     "flow": "只读体检脚本加查运行条件时经 PCConfig Get-SkillRuntimeReadiness.ps1 复用浏览器配置检查，只报配置，不证明活的会话能用",
     "source": "E:\\.agents\\tools\\Invoke-ControlPlaneDoctor.ps1 第 9–10 行（-CheckRuntime、Get-SkillRuntimeReadiness.ps1）"
    },
    {
     "id": "r-remote-fill",
     "with": "remote-control",
     "direction": "指过去",
     "flow": "AI 代填密码已退役，家在电脑远程控制页 f-browser-fill",
     "source": "owner-decisions.md 9 月 27 日 00:3x 盲填退役；b1\\remote-control\\page.json f-browser-fill"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L29",
     "screen": "skill-browser-control-continuity-01",
     "text": "约法 L29"
    },
    {
     "target": "/skills/google-workspace-direct/",
     "screen": "skill-browser-control-continuity-02",
     "text": "邮件、云盘和待办"
    },
    {
     "target": "/projects/pcconfig/#f-sms-code",
     "screen": "skill-browser-control-continuity-04",
     "text": "取短信验证码"
    },
    {
     "target": "/projects/pcconfig/#f-browser-runtime",
     "screen": "skill-browser-control-continuity-04",
     "text": "浏览器连接检查"
    },
    {
     "target": "/projects/remote-control/#f-browser-fill",
     "screen": "skill-browser-control-continuity-05",
     "text": "电脑远程控制"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "runtime-recovery.md 里的具体命令、参数名（ExpectedScriptsRoot 等）、回执字段和 Codex 内部接口名（node_repl、browser.tabs.list）不上页面，属于施工细节。",
    "旧稿 skills.json 的六条细节都已并入第 4 屏；“要验证码的登录，能取到码就自己登完”改写成“能填码的 AI”，因为 Claude 不亲手填码。"
   ],
   "unsure": [
    "页面名沿用旧网站的“网页上的事接着办”（content\\skills.json）。",
    "第 2 屏是照技能写的做法串起来的假设例子，页面上已写明；第 3 屏两件是真事：9 月 18 日有修复回执，9 月 28 日那次只有技能文档里的记录（提交 1a11589），具体发生在哪天未查清，所以写成“记进技能”。",
    "9 月 28 日 20:36 只读检查的总体结果是“要注意”：Chrome 里登记的 Codex 扩展宿主仍指向旧版本 26.901.51231 的程序（程序还在），它旁边 9 月 18 日修过的连接配置文件已经不在；插件当前版本的文件齐全。这会不会影响 Codex 现在控制 Chrome，未查清（没有实际去连）；页面只写了文件齐全这一项，详情见 audit.md 第 1 条；按 Claude 转达，这件交最后的产品审计由本人定，不派人修。",
    "“取短信验证码”在电脑配置与恢复页是“待验收”（还没真用过），本页写成能力而非已用过的事。",
    "技能总页分组：旧稿把它放在“电脑和账号”；它不是某个项目的入口，请 Claude 定。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-browser-control-continuity/page.json",
  "sha256": "d39ab250141513c17c2b5411c88472573942faac2bd8e2634cdb78d9bd3eb59e",
  "converted_at_beijing": "2026-10-10T05:26:53+08:00"
 }
}
---

::screen{#skill-browser-control-continuity-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-browser-control-continuity-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句话和一段说明。右边一幅水彩插画：一个 Chrome 浏览器窗口（画 Chrome 标志），里面一张填了一半的表单；窗口和一只代表 AI 的绿色小机械手之间的连线断成两截，一个小扳手正把两截接回去；窗口上方一排标签页都还开着，其中一个标签页上贴着一枚小小的绿色别针（表示保住不动）。下半部分一张“怎么跟 AI 说”的卡片，五句话做成对话气泡，两列排开。",
  "portrait": "竖版：标题、一句话、说明在上；插画占满宽度；五个对话气泡一行一个。",
  "links": [
   {
    "text": "约法 L29",
    "href": "/rules/charter/#L29"
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
     "text_ref": "大标题：网页上的事接着办",
     "row": "hero",
     "width": "49%"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "一句话："
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "49%",
     "index": 0
    },
    {
     "type": "dialogue",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "items_layout": {
      "order": "column-major",
      "rows": [
       3,
       2
      ],
      "speech_bubble": true,
      "speaker_side": "left",
      "keep_quotes": true
     },
     "text_ref": "怎么跟 AI 说",
     "split_items": true,
     "flow": "column",
     "rows": 3
    }
   ],
   "notes": "横版左标题介绍、右浏览器修线插画；下面全宽对话卡，五句按左列前三句、右列后两句。竖版先标题和全部介绍，再整宽插画，再五句气泡。定稿大标题/一句话/说明前缀原样交给渲染，不凭原图删字。 2026-10-03 本轮文字核对：已补split_items，横版列优先左3右2；未重新看图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "大标题：网页上的事接着办"
    },
    {
     "type": "prose",
     "text_ref": "一句话："
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "dialogue",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "items_layout": {
      "speech_bubble": true,
      "keep_quotes": true
     },
     "text_ref": "怎么跟 AI 说",
     "split_items": true
    }
   ],
   "notes": "横版左标题介绍、右浏览器修线插画；下面全宽对话卡，五句按左列前三句、右列后两句。竖版先标题和全部介绍，再整宽插画，再五句气泡。定稿大标题/一句话/说明前缀原样交给渲染，不凭原图删字。 2026-10-03 本轮文字核对：已补split_items，横版列优先左3右2；未重新看图。"
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
   "asset": "_library/illustrations/电脑故障.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "电脑故障",
   "source_phrase": "右边一幅水彩插画：一个 Chrome 浏览器窗口（画 Chrome 标志），里面一张填了一半的表单；窗口和一只代表 AI 的绿色小机械手之间的连线断成两截，一个小扳手正把两截接回去；窗口上方一排标签页都还开着，其中一个标签页上贴着一枚小小的绿色别针（表示保住不动）。",
   "sha256": "a829484c629a21dc7d82cef241b226eb8fc89c70cbfd5705df85aa0d8002837a",
   "status": "ready",
   "original_elements": [
    "一个 Chrome 浏览器窗口（画 Chrome 标志），里面一张填了一半的表单；窗口和一只代表 AI 的绿色小机械手之间的连线断成两截，一个小扳手正把两截接回去；窗口上方一排标签页都还开着，其中一个标签页上贴着一枚小小的绿色别针（表示保住不动"
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
   "asset": "_library/round3/titles/title-r3-1629dc4a2efd8cae9228.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-1629dc4a2efd8cae9228",
   "title_text": "网页上的事接着办",
   "sha256": "e4d3349d70ddd1d4ea746ce5d831250eeeed17141499d55a1a702d32da5f6021",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

大标题：网页上的事接着办

一句话：AI 在网页上办事，碰到连不上、页面卡住、要登录、要上传时，先保住已开的页面，查清卡在哪一层，修好后回到原来那一步接着办完。

说明：它不是另一个浏览器，是给现有浏览器控制补的一套做法。默认用我的 Chrome（〔约法 L29〕）。Claude 根会话和子代理用不了我已登录的浏览器：要用登录状态默认派 GPT；无需登录可用 Claude 内置浏览器。Codex 仍用我的 Chrome，我另有指定时照办。动手前先想这件事要不要开浏览器：只是生成文件就不开；我没指定要在网页上办时，邮件、云盘这类有直连接口的事走接口。

**怎么跟 AI 说**
- “网页刚才卡住了，接着把表填完，别刷新。”
- “在这个网站上把两个附件传上去，传完核对一下。”
- “用手机号登录，验证码能拿到就自己填。”
- “这个本地网页在浏览器里打开看看效果。”
- “Codex 连不上 Chrome 了，查一下断在哪。”

::screen{#skill-browser-control-continuity-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-browser-control-continuity-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版：左上标题。左边约三分之二宽，六个编号步骤沿一条弯弯的小路排下来，每步一个小水彩图标（一排标签页、一把钥匙和一部手机、一个文件夹里飞出一张纸、两个一层套一层的下拉框、一张打钩的回执、一段断了又接上的线）和两三行字。右边约三分之一宽，一张米色小回执插画，上面画真实的几行字（见“回执上的字”），回执下面一张小卡片“要注意”。",
  "portrait": "竖版：标题在上；六个步骤一行一步；回执插画和“要注意”卡在最下。",
  "links": [
   {
    "text": "邮件、云盘和待办",
    "href": "/skills/google-workspace-direct/"
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
     "text_ref": "标题：一个完整例子"
    },
    {
     "type": "prose",
     "text_ref": "假如我说："
    },
    {
     "type": "flow",
     "row": "body",
     "width": "65%",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "ribbon",
     "flow_direction": "vertical",
     "items_layout": {
      "count": 6,
      "card": "horizontal",
      "icon_side": "left",
      "path": "curved",
      "badge_side": "left"
     },
     "text_ref": "1先看现场",
     "direction": "vertical",
     "text_layout": "inline"
    },
    {
     "type": "document_mock",
     "row": "body",
     "width": "33%",
     "illustration": "top_inside",
     "paper": "receipt",
     "render_text": true,
     "text_ref": "回执上的字"
    },
    {
     "type": "notice",
     "row": "body",
     "illustration": "left_inside",
     "text_ref": "要注意：",
     "icons": [
      "_library/icons/文稿堆.png"
     ]
    }
   ],
   "notes": "横版六步一列沿细弯路，右侧米色回执（字用定稿程序覆排）及注意卡。竖原图第1张步骤1–4有左插图，第2张步骤5–6和回执、注意卡不配图；同角色统一字高，原续图合为一屏。标题定稿较长，保留文字并换行，不缩字。 新G3发现基础步骤卡末项叶子压字，改现有flow同列同序承载原步骤；曲线路径仍待接。 本轮 qa12a：标题按 large 章标题档位，完整定稿标题及前缀保留；步骤用现有 text_layout=inline，让原冒号紧接粗体步骤名，不单独挤到正文首行。竖续张恢复同角色左图，图按本屏原序0–3、4–5明确绑定；旧无图续张说明已被本轮审页修正。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：一个完整例子"
    },
    {
     "type": "prose",
     "text_ref": "假如我说："
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "items_layout": {
      "count": 6,
      "card": "horizontal",
      "original_split_after": 4
     },
     "text_ref": "1先看现场",
     "direction": "vertical",
     "page_break_after": true,
     "text_layout": "inline",
     "icons": [
      0,
      1,
      2,
      3
     ]
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "5提交前后都核对：提交前读回关键字段、附件个数和名",
     "direction": "vertical",
     "icons": [
      4,
      5
     ],
     "text_layout": "inline"
    },
    {
     "type": "document_mock",
     "columns": 1,
     "illustration": "none",
     "render_text": true,
     "text_ref": "回执上的字"
    },
    {
     "type": "notice",
     "illustration": "none",
     "text_ref": "要注意："
    }
   ],
   "notes": "横版六步一列沿细弯路，右侧米色回执（字用定稿程序覆排）及注意卡。竖原图第1张步骤1–4有左插图，第2张步骤5–6和回执、注意卡不配图；同角色统一字高，原续图合为一屏。标题定稿较长，保留文字并换行，不缩字。 新G3发现基础步骤卡末项叶子压字，改现有flow同列同序承载原步骤；曲线路径仍待接。 已接新核心清单中段切分及page_break_after，按原步骤边界分张；续图无图标要求以none落实，首段缺素材仍列未完成。 本轮 qa12a：标题按 large 章标题档位，完整定稿标题及前缀保留；步骤用现有 text_layout=inline，让原冒号紧接粗体步骤名，不单独挤到正文首行。竖续张恢复同角色左图，图按本屏原序0–3、4–5明确绑定；旧无图续张说明已被本轮审页修正。"
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
   "asset": "_library/icons/浏览器标签页.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "浏览器标签页",
   "source_phrase": "横版：左上标题。左边约三分之二宽，六个编号步骤沿一条弯弯的小路排下来，每步一个小水彩图标（一排标签页、一把钥匙和一部手机、一个文件夹里飞出一张纸、两个一层套一层的下拉框、一张打钩的回执、一段断了又接上的线）和两三行字。右边约三分之一宽，一张米色小回执插画，上面画真实的几行字（见“回执上的字”），回执下面一张小卡片“要注意”。",
   "sha256": "fb359c488e879b67b26f6e81fb169f9ce5d6162313f59dae249974f9fefea50e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一把钥匙和一部手机",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
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
   "source_phrase": "一个文件夹里飞出一张纸",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/嵌套下拉框.png",
   "fallback": false,
   "semantic_status": "round3_exact_request_theme_prepared",
   "key": "嵌套下拉框",
   "source_phrase": "横版：左上标题。左边约三分之二宽，六个编号步骤沿一条弯弯的小路排下来，每步一个小水彩图标（一排标签页、一把钥匙和一部手机、一个文件夹里飞出一张纸、两个一层套一层的下拉框、一张打钩的回执、一段断了又接上的线）和两三行字。右边约三分之一宽，一张米色小回执插画，上面画真实的几行字（见“回执上的字”），回执下面一张小卡片“要注意”。",
   "sha256": "239b1b09d1a4e9bea5e0b2d83be7c2a2ef31a6c60059d8cb1ebd2cbfdb3ab1dd",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "round3_request_subject_exact_reuse",
   "key": "打勾清单",
   "source_phrase": "一张打钩的回执",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "断线",
   "source_phrase": "一段断了又接上的线",
   "sha256": "8e40c182f809b7bca502da171ca29213f9bcf0ad1022eafd8ede55bfb7524e46",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "要注意：这是照技能写的做法串起来的例子，不是某一次办事的记录。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "要注意：这是照技能写的做法串起来的例子，不是某一次办事的记录。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/验证码纸.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "验证码纸",
   "source_phrase": "右边约三分之一宽，一张米色小回执插画，上面画真实的几行字（见“回执上的字”），回执下面一张小卡片“要注意”。",
   "sha256": "bd4eda69465f07bad83182ac2761b2456d746bb31d62a1a112f1c6aef5ad85e3",
   "status": "ready",
   "original_elements": [
    "米色小回执，只画纸面短线；真实回执字由排版程序另放"
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
   "asset": "_library/round3/titles/title-r3-54762c0f3a354c5c85e0.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-54762c0f3a354c5c85e0",
   "title_text": "一个完整例子：照这套做法，在网站上交一份带两个附件的申请会这样办",
   "sha256": "e020fb61fe7e9d0c565b7b709653f7b887287fee44ad60ba4b92f407daaa1164",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：一个完整例子：照这套做法，在网站上交一份带两个附件的申请会这样办

假如我说：“在这个网站上把申请交了，附件是桌面上那两个 PDF。”

1. **先看现场**：在我的 Chrome 里先列出已开的标签页，找到那个网站；已经登录着就直接用，填了一半的页面不刷新、不重开。
2. **要登录时**：要账号密码的，把登录页停在那里等我登；手机号登录的，能填码的 AI（例如 Codex）点“发送验证码”后取码：手机短信经小米妙享转到电脑的通知里，AI 读最近 60 秒的通知，取不到交我填；邮箱验证码交〔邮件、云盘和待办〕去等。登完先读页面，确认真的登录上了。
3. **上传一个一个来**：工具能直接选文件时，先等上传选框，再交给它完整路径；没有这种能力时，点一次上传，再截屏看选文件窗口是否弹出（页面结构里常常看不到它）。进度到 100% 不算完，要等网页自己的成功标记、读回文件名，再传下一个。
4. **联动下拉框一层层选**：选了省份，等城市的选项真出来了再选城市，不连着狂点。
5. **提交前后都核对**：提交前读回关键字段、附件个数和名字；点了提交、页面跳走了也不算成功，要打开生成的那条记录，看填的值和附件真的在。缺了马上说，撤回或重交是另一件要我同意的事。
6. **中途控制断了**：先分清是整个浏览器连不上，还是只有这一个标签页失控；只是标签页失控，就保住它和没提交的内容，不为了“试试”再点一次提交。

**回执上的字**
附件 2 / 2 · 网页显示上传成功
文件名已读回
已提交 · 记录已打开核对

**要注意**：这是照技能写的做法串起来的例子，不是某一次办事的记录。

::screen{#skill-browser-control-continuity-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-browser-control-continuity-03",
  "section": "examples",
  "title": "两次真事",
  "scene": "横版：左上标题。左边一张“麻烦”卡片，配一幅小插画：Codex 标志和 Chrome 标志之间的一根线断开，地上散落三张写着文件名的小纸片。中间一条竖着的时间线，两个节点各一张卡片（9 月 18 日、9 月 28 日）。9 月 18 日卡片里几行字；9 月 28 日卡片先一行粗体结论，下面四个小标题（出了什么事、原因、怎么处理的、结果和还剩什么）各跟一小段。右边一张米色小账本插画，上面画真实的几行字（见“账本上的字”）。最下面一条细卡片“学到的”。",
  "portrait": "竖版：标题在上；“麻烦”卡片；两个时间节点上下排，卡片占满宽，9 月 28 日卡片里的四个小标题一段一个；小插画放在标题旁或段落上方，不占正文列宽；账本插画；最下面“学到的”。",
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
     "text_ref": "标题：两次真事"
    },
    {
     "type": "points_card",
     "columns": 1,
     "illustration": "none",
     "text_ref": "麻烦：",
     "whole_block": true,
     "icon_position": "header_left",
     "paragraph_header_prefix": "**麻烦**：",
     "header_icon": [
      "_library/illustrations/浏览器断线账本.png"
     ],
     "header_icon_source": "illustrations"
    },
    {
     "type": "document_mock",
     "illustration": "top_inside",
     "paper": "ledger",
     "render_text": true,
     "text_ref": "账本上的字"
    },
    {
     "type": "timeline",
     "columns": 1,
     "connector": "line",
     "flow_direction": "vertical",
     "illustration": "none",
     "text_ref": "9 月 18 日 13:54：",
     "group_nodes_as_steps": true,
     "direction": "vertical",
     "text_layout": "inline"
    },
    {
     "type": "notice",
     "illustration": "left_inside",
     "text_ref": "学到的：",
     "icons": [
      "_library/icons/断线.png"
     ]
    }
   ],
   "notes": "横版标题全宽居中；下方左麻烦卡含断线插图、中两日期卡细竖线相连、右账本，底部全宽学到的。竖版原图把断线插画提到麻烦卡之前；第一张到9月18日，第二张9月28日+账本字+学到的。账本上的字是定稿块标识，未获删字授权，程序保留。 本轮使用已有timeline的line字段落实细竖线。 说明卡改已实现points_card原字承载，避免默认叶子压正文；原插画位仍未完成。 本轮 qa12a：timeline 用 text_layout=inline，原冒号留在日期旁；横版麻烦与账本移到时间线上方并排56/44，时间线整宽。麻烦原粗体段首提升卡头，沿现有字段把已绑定图放卡头右侧，原文字各一次。 本轮数值回读发现 upper_right_inside 在 para 段首卡头的前置校验不能消费，改为已支持的 paragraph_header_prefix+header_left 明确卡头图；正文仍整宽，不新增组件缺口。\nQA12压小图复核后微调：原标点一并提升卡头、续张编号沿用卡外左侧、长按钮手机单列、边界标题栏居中，均用现有接口，不删原字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：两次真事"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "text_ref": "麻烦：",
     "whole_block": true
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "top_inside",
     "items_layout": {
      "count": 2,
      "original_split_between_nodes": true
     },
     "text_ref": "9 月 18 日 13:54：",
     "page_break_after": true,
     "direction": "vertical",
     "icons": [
      "_library/hires-icons/代码窗口.png"
     ],
     "text_layout": "inline"
    },
    {
     "type": "timeline",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "top_inside",
     "text_ref": "9月28日记进技能的一次排查",
     "group_nodes_as_steps": true,
     "direction": "vertical",
     "text_layout": "inline"
    },
    {
     "type": "document_mock",
     "illustration": "none",
     "render_text": true,
     "text_ref": "账本上的字"
    },
    {
     "type": "notice",
     "illustration": "none",
     "text_ref": "学到的："
    }
   ],
   "notes": "横版标题全宽居中；下方左麻烦卡含断线插图、中两日期卡细竖线相连、右账本，底部全宽学到的。竖版原图把断线插画提到麻烦卡之前；第一张到9月18日，第二张9月28日+账本字+学到的。账本上的字是定稿块标识，未获删字授权，程序保留。 说明卡改已实现points_card原字承载，避免默认叶子压正文；原插画位仍未完成。 已接新核心page_break_after，在两个真实日期节点之间分张；没有重复日期或标题。 本轮 qa12a：timeline 用 text_layout=inline，原冒号留在日期旁；横版麻烦与账本移到时间线上方并排56/44，时间线整宽。麻烦原粗体段首提升卡头，沿现有字段把已绑定图放卡头右侧，原文字各一次。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "9月18日13:54：Codex更新后，Chrome扩展连回本机用的配置里，还指着旧版本的4个程序路径（Codex命令行、Node、Node交互环境、浏览器客户端）。技能自带的修复脚本只改这4项，代理、通道和其他字段原样留着；改前存了备份、留了回执，能照回执退回；再跑一次会显示“已是最新”。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "断线",
   "source_phrase": "学到的：修之前先找断在哪一层——调用写错、本机组件缺、插件没初始化、只有一个标签页失控，还是网站本身——一次只改一处，改完重试原来失败的那一步。",
   "sha256": "8e40c182f809b7bca502da171ca29213f9bcf0ad1022eafd8ede55bfb7524e46",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "断线",
   "source_phrase": "学到的：修之前先找断在哪一层——调用写错、本机组件缺、插件没初始化、只有一个标签页失控，还是网站本身——一次只改一处，改完重试原来失败的那一步。",
   "sha256": "8e40c182f809b7bca502da171ca29213f9bcf0ad1022eafd8ede55bfb7524e46",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/浏览器断线账本.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "浏览器断线账本",
   "source_phrase": "左边一张“麻烦”卡片，配一幅小插画：Codex 标志和 Chrome 标志之间的一根线断开，地上散落三张写着文件名的小纸片。中间一条竖着的时间线，两个节点各一张卡片（9 月 18 日、9 月 28 日），每张卡片里几行字。右边一张米色小账本插画，上面画真实的几行字（见“账本上的字”）。",
   "sha256": "667a74760490e4b687a46dba4a5d68c88bda6137f2d0bf58ec3287b5e7ec017a",
   "status": "ready",
   "original_elements": [
    "Codex 标志和 Chrome 标志之间的一根线断开，地上散落三张只画短线的小纸片；右边一张米色小账本插画，上面画只画抽象短线；正文由排版程序另放"
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
   "asset": "_library/round3/titles/title-r3-c04a1f1df1fa55129a61.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-c04a1f1df1fa55129a61",
   "title_text": "两次真事：Codex 更新后，AI 控制不了 Chrome",
   "sha256": "1fef3737ed892029aa3024dfbf5ccbf45135597bb5ff5c24e91cf9d37dd72904",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：两次真事：Codex 更新后，AI 控制不了 Chrome

**麻烦**：Codex 桌面版、它的 Chrome 插件和 Chrome 扩展各自升级。升级后 AI 常常突然控制不了 Chrome：报“找不到模块”，或者插件的几个运行文件不见了。以前手补文件，过几天又丢。

**9 月 18 日 13:54**：Codex 更新后，Chrome 扩展连回本机用的配置里，还指着旧版本的 4 个程序路径（Codex 命令行、Node、Node 交互环境、浏览器客户端）。技能自带的修复脚本只改这 4 项，代理、通道和其他字段原样留着；改前存了备份、留了回执，能照回执退回；再跑一次会显示“已是最新”。

**9 月 28 日记进技能的一次排查**

一句话：手补的文件会被旧的安装来源再次清掉；要先把安装来源修完整，再用官方安装命令重装。

- **出了什么事**：插件的 3 个运行文件一再消失，手补进去，过几天又没了。
- **原因**：Codex 桌面版部署自带插件时，要从系统保护的加密安装包里复制文件。复制失败时它本有按字节复制的后备办法，但后备只认错误码 6000；这次报的是 -4094，后备没启动，桌面版就接着用旧的登记来源（桌面版登记的插件安装来源）。从这个旧来源重装时，会把手补进去的新版本文件一起清掉。同样的文件按字节复制、核对哈希（文件指纹）都成功。
- **怎么处理的**：先把登记来源恢复完整，再用官方安装命令重装，不再一次次手补那 3 个文件。
- **结果和还剩什么**：这个重装做法在隔离的测试安装里验证过。真机上完整安装撑过了重启，但当时浏览器策略加载和桌面版的连接仍然失败，技能自己记作“部分恢复，不算彻底治好”（9 月 28 日的记录）。

**账本上的字**
浏览器插件 26.924.22138
383 个文件 · 与官方安装包一致 · 缺 0
9 月 28 日 20:36 只读检查

**学到的**：修之前先找断在哪一层——调用写错、本机组件缺、插件没初始化、只有一个标签页失控，还是网站本身——一次只改一处，改完重试原来失败的那一步。

::screen{#skill-browser-control-continuity-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-browser-control-continuity-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题。十一张小卡片排成两列六行（最后一行一张），每张左边一个小水彩图标、粗体名字、两行以内的说明。",
  "portrait": "竖版：标题在上；十一张卡片一行一张。",
  "links": [
   {
    "text": "取短信验证码",
    "href": "/projects/pcconfig/#f-sms-code"
   },
   {
    "text": "浏览器连接检查",
    "href": "/projects/pcconfig/#f-browser-runtime"
   }
  ],
  "anchors": [
   {
    "id": "a-need",
    "text": "先判断要不要开浏览器"
   },
   {
    "id": "a-chrome",
    "text": "用我的 Chrome"
   },
   {
    "id": "a-evidence",
    "text": "按证据修"
   },
   {
    "id": "a-preserve",
    "text": "保住现场"
   },
   {
    "id": "a-login",
    "text": "登录接着办"
   },
   {
    "id": "a-upload",
    "text": "上传看得见"
   },
   {
    "id": "a-form",
    "text": "表单核对到底"
   },
   {
    "id": "a-preview",
    "text": "本机网页预览"
   },
   {
    "id": "a-runtime",
    "text": "修浏览器插件的运行文件"
   },
   {
    "id": "a-cloud",
    "text": "云端浏览器另算"
   },
   {
    "id": "a-lessons",
    "text": "只记验证过的教训"
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
     "text_ref": "标题：能做的事"
    },
    {
     "type": "flow",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "items_layout": {
      "count": 11,
      "row_sizes": [
       2,
       2,
       2,
       2,
       2,
       1
      ],
      "last_card_span": 2,
      "badge_side": "left",
      "original_split_after": null
     },
     "text_ref": "1先判断要不要开浏览器",
     "direction": "horizontal",
     "item_rows": [
      2,
      2,
      2,
      2,
      2,
      1
     ]
    }
   ],
   "notes": "横版11张左图右文横卡两列六排，最后第11项整宽；竖版一项一行，原图第1张1–6有小图、第2张7–11无小图。顺序按定稿1–11；全宽章节标题居中。卡片最后整宽与竖续图图标差别需要组件支持。 本轮改用已有flow的item_rows，横版末项完整占整行；原竖版指定6项后分张仍未落地。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：能做的事"
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "items_layout": {
      "count": 11,
      "row_sizes": [
       1,
       1,
       1,
       1,
       1,
       1,
       1,
       1,
       1,
       1,
       1
      ],
      "last_card_span": 1,
      "badge_side": "left",
      "original_split_after": 6
     },
     "text_ref": "1先判断要不要开浏览器",
     "direction": "vertical",
     "page_break_after": true,
     "icons": [
      0,
      1,
      2,
      3,
      4,
      5
     ]
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "text_ref": "7表单核对到底联动下拉框一层层等选项出来再选；提交",
     "direction": "vertical",
     "icons": [
      6,
      7,
      8,
      9,
      10
     ],
     "number_position": "left_outside"
    }
   ],
   "notes": "横版11张左图右文横卡两列六排，最后第11项整宽；竖版一项一行，原图第1张1–6有小图、第2张7–11无小图。顺序按定稿1–11；全宽章节标题居中。卡片最后整宽与竖续图图标差别需要组件支持。 本轮改用已有flow的item_rows，横版末项完整占整行；原竖版指定6项后分张仍未落地。 已接新核心清单中段切分及page_break_after，按原步骤边界分张；续图无图标要求以none落实，首段缺素材仍列未完成。 本轮 qa12a：续张7–11恢复与1–6相同卡内左图，按原项0–5、6–10绑定，不从首图重用；保留六项后完整换张。旧续张无图说明被本轮审页修正。\nQA12压小图复核后微调：原标点一并提升卡头、续张编号沿用卡外左侧、长按钮手机单列、边界标题栏居中，均用现有接口，不删原字。"
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
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "先判断要不要开浏览器｜我明确要看网页、测交互、在网站上办事，就一定办到；只是生成文件不开；我没指定要在网页上办时，有直连接口的事走接口；可开可不开的预览，按值不值得定，没验的地方说清",
   "sha256": "8e40c182f809b7bca502da171ca29213f9bcf0ad1022eafd8ede55bfb7524e46",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-e48568e98f22e6cdf98d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "Chrome标志",
   "source_phrase": "用我的 Chrome｜沿用我已登录的状态和已开的标签页；Chrome 没开时用现有的方式打开或重连，先看再新建",
   "sha256": "33767ac43a888209aa81c09bc7a6eb6026ea739411a3ebc03e30e6380f39e8b2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/断线.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "断线",
   "source_phrase": "按证据修｜分清断在哪一层：调用写错、本机组件、插件初始化、单个标签页、页面、网站操作；用最小的检查把几种可能分开，一次只改一处，改完重试原来那一步",
   "sha256": "8e40c182f809b7bca502da171ca29213f9bcf0ad1022eafd8ede55bfb7524e46",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "保住现场｜已填、已登录、我自己的标签页，先看再动；一个标签页失控就保住它和没提交的内容；控制失败不等于网站出错，重新读页面再下结论",
   "sha256": "3adac5e6ca30429c0fc934071422cad3eb480d48b6d54d6a842a8516f6a689d4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "登录接着办｜已登录就直接用；要账号密码的，把登录页留给我；手机号登录，能填码的 AI 用〔取短信验证码〕，取不到交我；邮箱验证码交邮件技能；通行密钥、扫码、人机验证停在那一步等我，完成后在同一页接着办",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "上传看得见｜一次传一个；点上传后截屏看选文件窗口弹没弹，页面结构里看不到它不等于没弹；100% 不算完，要等网页的成功标记并读回文件名",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "表单核对到底｜联动下拉框一层层等选项出来再选；提交前读回关键字段、附件个数和名字；提交后打开生成的记录核对",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "本机网页预览｜不用 file:// 打开；先用项目已有的预览服务，没有才临时开一个只听本机（127.0.0.1）、端口由系统分配的服务，用完只关自己开的",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "修浏览器插件的运行文件｜只在 Codex 里用：先只读检查（〔浏览器连接检查〕）；配置对不上就只改 4 个路径；缺文件时优先走官方安装或重连，这些办不到、正在用的会话又要一个缺了的文件时，才临时从同一个官方安装包按字节补那几个，不覆盖、核指纹、留回执，用完进回收站",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "云端浏览器另算｜ChatGPT 的云端浏览器是另一套登录，走它自己的安全登录流程，不把本机的密码、Cookie 导给它",
   "sha256": "01332f157c15b884efe343411d7b8e1915859c37e0dd82fff326bee27665ff67",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "只记验证过的教训｜只留真出过、真修好的经验和我的明确要求；不留私人信息、截图、完整日志和临时编号",
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
   "asset": "_library/round3/titles/title-r3-7dadc2c869cdb800f4de.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "ea2afebfd1846c75e18aab7cec4ed1200b479bfa134dde5540602e3a65bc59a9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：能做的事

1. **先判断要不要开浏览器**｜我明确要看网页、测交互、在网站上办事，就一定办到；只是生成文件不开；我没指定要在网页上办时，有直连接口的事走接口；可开可不开的预览，按值不值得定，没验的地方说清
2. **用我的 Chrome**｜沿用已登录状态和已开的标签页；连不上时，用同一程序的无窗口模式做独立检查，需要原登录的步骤留待完成
3. **按证据修**｜分清断在哪一层：调用写错、本机组件、插件初始化、单个标签页、页面、网站操作；用最小的检查把几种可能分开，一次只改一处，改完重试原来那一步
4. **保住现场**｜已填、已登录、我自己的标签页，先看再动；一个标签页失控就保住它和没提交的内容；控制失败不等于网站出错，重新读页面再下结论
5. **登录接着办**｜已登录就直接用；要账号密码的，把登录页留给我；手机号登录，能填码的 AI 用〔取短信验证码〕，取不到交我；邮箱验证码交邮件技能；通行密钥、扫码、人机验证停在那一步等我，完成后在同一页接着办
6. **上传看得见**｜一次传一个；工具能直接选文件时先等选框再给路径，否则截屏处理弹出的窗口；100% 不算完，要等网页成功标记并读回文件名
7. **表单核对到底**｜联动下拉框一层层等选项出来再选；提交前读回关键字段、附件个数和名字；提交后打开生成的记录核对
8. **本机网页预览**｜不用 file:// 打开；先用项目已有的预览服务，没有才临时开一个只听本机（127.0.0.1）、端口由系统分配的服务，用完只关自己开的
9. **修浏览器插件的运行文件**｜只在 Codex 里用：先只读检查（〔浏览器连接检查〕）；配置对不上就只改 4 个路径；缺文件时优先走官方安装或重连，这些办不到、正在用的会话又要一个缺了的文件时，才临时从同一个官方安装包按字节补那几个，不覆盖、核指纹、留回执，用完进回收站
10. **云端浏览器另算**｜ChatGPT 的云端浏览器是另一套登录，走它自己的安全登录流程，不把本机的密码、Cookie 导给它
11. **只记验证过的教训**｜只留真出过、真修好的经验和我的明确要求；不留私人信息、截图、完整日志和临时编号

::screen{#skill-browser-control-continuity-05 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-browser-control-continuity-05",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“管”画一个打开的工具箱，下面两条；右栏“不管”画一个淡灰色的叉，下面三条。最下面一张宽卡片写“它不会做的事”。",
  "portrait": "竖版：“管”一栏在上、“不管”一栏在下，一条一行；最下面宽卡片。",
  "links": [
   {
    "text": "电脑远程控制",
    "href": "/projects/remote-control/#f-browser-fill"
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
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "none",
     "items_layout": {
      "groups": [
       "管",
       "不管"
      ],
      "icons": [
       "toolbox",
       "gray_cross"
      ],
      "heading_side": "left",
      "icon_side": "right",
      "bullet_counts": [
       2,
       3
      ]
     },
     "text_ref": "管",
     "group_images": [
      "_library/icons/工具箱.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "它不会做的事：",
     "whole_block": true
    }
   ],
   "notes": "横版管/不管两栏，每栏上部组名与大插画并排、下部圆点条目；底部全宽它不会做的事卡左禁止小插画右文字。竖版管、不管上下整卡；底部宽卡保留左小插画。全宽章节标题按标准居中。 说明卡改已实现points_card原字承载，避免默认叶子压正文；原插画位仍未完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "connector": "none",
     "items_layout": {
      "groups": [
       "管",
       "不管"
      ],
      "icons": [
       "toolbox",
       "gray_cross"
      ],
      "heading_side": "left",
      "icon_side": "right",
      "bullet_counts": [
       2,
       3
      ]
     },
     "text_ref": "管",
     "group_images": [
      "_library/icons/工具箱.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "points_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "text_ref": "它不会做的事：",
     "whole_block": true
    }
   ],
   "notes": "横版管/不管两栏，每栏上部组名与大插画并排、下部圆点条目；底部全宽它不会做的事卡左禁止小插画右文字。竖版管、不管上下整卡；底部宽卡保留左小插画。全宽章节标题按标准居中。 说明卡改已实现points_card原字承载，避免默认叶子压正文；原插画位仍未完成。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "管",
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
   "asset": "_library/icons/scene-r3-browser-boundary-gray-cross.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "scene-r3-browser-boundary-gray-cross",
   "source_phrase": "一个淡灰色的叉",
   "sha256": "c15c30918190e95b555cec1600efe403416bc668f8b5081863cf0fd4da96ca30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "管",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "不管",
   "sha256": "5b07d3188e7e7273cb2c737b5d9912964ff5331a55b1316e445674b0587f849f",
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

标题：边界

**管**
- AI 控制浏览器时的断线、登录、标签页、表单、上传和本机网页预览
- Codex 浏览器插件运行文件的检查和有限修复

**不管**
- 具体网站的业务：字段什么意思、填什么、交给谁，归各自的项目
- 不用看网页的事：只生成文件；或我没指定要在网页上办、有直连接口的邮件、云盘
- 装新浏览器、升级浏览器、改浏览器的策略设置

**它不会做的事**：不填密码、不读密码框、不导出密码库，AI 代填密码已经退役（见〔电脑远程控制〕）；不绕过也不关掉验证码、人机验证和通行密钥；不为了让检查变绿就重启 Chrome、关标签页、清登录或重置浏览器配置；不装常驻服务、计划任务或新的控制层。能修浏览器，不等于能在网站上办事：登录、上传、提交、删除仍按那件事本来的授权。Claude 按自己的内置规则不亲手填验证码和密码，这一步交给 Codex 这类 AI 或我。
