---
{
 "title": "邮件、云盘和待办",
 "kind": "skill",
 "url": "/skills/google-workspace-direct/",
 "tagline": "查邮件、找云盘文件、记待办，也能等验证码。",
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
  "page": "skill-google-workspace-direct",
  "kind": "skill",
  "title": "邮件、云盘和待办",
  "url": "/skills/google-workspace-direct/",
  "tagline": "查邮件、找云盘文件、记待办，也能等验证码。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-07 22:11"
   },
   "facts": [
    "近 7 天 AI 用了 3 次"
   ],
   "as_of": "2026-10-11",
   "source": "AI 使用小记录（10 月 3–9 日，记到 10 月 9 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "74f00dad7743a401501a4b09d4b37e60b4589236",
   "commit_time": "2026-09-25T19:00:55+08:00",
   "file": "E:\\.agents\\skills\\google-workspace-direct\\SKILL.md 及 references\\search.md、reply-and-attachments.md、scripts\\gmail_read.py、drive_find.py；调用层核对到 PCConfig 6ba9bfc0（2026-09-28 15:56）"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [
    {
     "id": "n-mcp-tools",
     "text": "11 个只读工具",
     "meaning": "Google 连接给 AI 列出的只读工具数：邮件 4、云盘 4、待办 3；日历 2 个已冻结、不列出",
     "as_of": "2026-10-11",
     "source": "E:\\PCConfig\\tools\\Start-GoogleWorkspaceMcp.ps1:30–137 共 13 个，第 354 行滤掉 calendar_*",
     "screens": [
      "skill-google-workspace-direct-01"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "用到",
     "flow": "固定账号的授权（本机加密保存）、调用层 Invoke-GoogleWorkspaceProvider.ps1 和 11 个只读工具都在 PCConfig；技能经它读写 Gmail、云盘、待办",
     "source": "SKILL.md:8,20–26；PCConfig docs\\contracts\\pcconfig.google-workspace-provider.md"
    },
    {
     "id": "r-privacy",
     "with": "个人资料锁（PCConfig 保存的共享资料状态）",
     "direction": "受管",
     "flow": "读邮件和云盘私人内容前核对资料状态和截止时间；锁着就停下请本人验证",
     "source": "SKILL.md:10；/rules/privacy-data/"
    },
    {
     "id": "r-browser",
     "with": "skill-browser-control-continuity",
     "direction": "被用于",
     "flow": "网页登录要邮箱验证码时，浏览器技能交这里等码、取码",
     "source": "browser-control-continuity\\SKILL.md:41"
    },
    {
     "id": "r-intake",
     "with": "原生文件读取（当时的 AI 选读法）",
     "direction": "交给",
     "flow": "云盘下载的普通文件交给对应读法",
     "source": "SKILL.md:15（提交 99e1da5，E207 相同）"
    },
    {
     "id": "r-google",
     "with": "外部：Google（Gmail、Drive、Tasks 官方接口）",
     "direction": "连到",
     "flow": "直连官方接口，不经第三方连接器、浏览器或 rclone",
     "source": "E190 能力与运行方式专题“Google”条（入口写明 Gmail、Google 云盘和待办 Tasks，日历冻结）"
    }
   ],
   "mentions": [
    {
     "target": "/projects/pcconfig/#g-google",
     "screen": "skill-google-workspace-direct-01",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/rules/privacy-data/",
     "screen": "skill-google-workspace-direct-01",
     "text": "个人资料与数据处理"
    },
    {
     "target": "/rules/charter/#L15",
     "screen": "skill-google-workspace-direct-03",
     "text": "约法 L15"
    },
    {
     "target": "/projects/pcconfig/#g-google",
     "screen": "skill-google-workspace-direct-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/pcconfig/#g-google",
     "screen": "skill-google-workspace-direct-05",
     "text": "电脑配置与恢复"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "SKILL.md 里的命令、参数（--metadata-only、--exclude-id、-ActionAuthorizationConfirmed、privacy_level 的取值等）和错误代号不上页面，属于施工细节。",
    "旧稿 skills.json 六条细节里“往云盘上传、移动或共享文件”“待办能新建、修改、勾掉和调整顺序”是调用层的功能，家在电脑配置与恢复页 g-google，本页只在第 4 屏引导句里提一句。"
   ],
   "unsure": [
    "页面名沿用旧网站的“邮件、云盘和待办”（content\\skills.json）。",
    "两个例子是照技能写的做法串起来的，页面上已写明；第 3 屏末句“9 月 18 日真发过一次、验收后补进技能”的依据只有提交 713f574 的说明（“after live acceptance”，北京时间 9 月 18 日 15:47），没找到那次的回执。",
    "“能做的事”按规则只链到电脑配置与恢复页，但链的是它的 Google 直连一组 #g-google（比 #features 准）；技能自己管的七条做法在本页写全，因为它们不在那页的功能清单里。",
    "第 5 屏“待办需要重新授权时，请我自己在前台点同意”：SKILL.md:45 仍写着首次用待办可能要重新授权；oauth.dpapi 9 月 22 日 15:03 更新过，推测已经授权过，未核实。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-google-workspace-direct/page.json",
  "sha256": "2d4056ac26da81fa3237172c62fbe2edf314195d79160ba185840e8a8be1d774",
  "converted_at_beijing": "2026-10-11T14:14:11+08:00"
 }
}
---

::screen{#skill-google-workspace-direct-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-google-workspace-direct-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "横版：左上毛笔艺术字大标题，下面一句话和一段说明。右边一幅水彩插画：一台台式电脑，屏幕旁绕着三枚品牌标志——Gmail、Google 云盘（Google Drive）、Google 待办（Google Tasks）——用细细的绿线连到电脑；电脑侧面挂着一把小锁（表示个人资料锁）；稍远处一枚 Google 日历（Google Calendar）标志画成淡灰色，上面落着一片小雪花（表示冻结）。下半部分一张“怎么跟 AI 说”的卡片，五句话做成对话气泡，两列排开。",
  "portrait": "竖版：标题、一句话、说明在上；插画占满宽度；五个对话气泡一行一个。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/#g-google"
   },
   {
    "text": "个人资料与数据处理",
    "href": "/rules/privacy-data/"
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
     "text_ref": "大标题：邮件、云盘和待办"
    },
    {
     "type": "prose",
     "row": "hero",
     "size": "large",
     "bold": true,
     "text_ref": "一句话：用电脑上接好的那一个Google账号，读写Gmail、Google云盘和Go"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 7 日 22:11",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 3 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用小记录（10 月 3–9 日，记到 10 月 9 日）",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "说明：账号授权由电脑配置与恢复保管，只认这一个账号，用的时候换不了。AI手边有11个"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "dialogue",
     "columns": 2,
     "split_items": true,
     "text_ref": "怎么跟 AI 说",
     "row_counts": [
      2,
      2,
      1
     ]
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "chapter_title",
    "illustration",
    "content_card",
    "dialogue",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "横版：左上毛笔艺术字大标题，下面一句话和一段说明。右边一幅水彩插画：一台台式电脑，屏幕旁绕着三枚品牌标志——Gmail、Google 云盘（Google Drive）、Google 待办（Google Tasks）——用细细的绿线连到电脑；电脑侧面挂着一把小锁（表示个人资料锁）；稍远处一枚 Google 日历（Google Calendar）标志画成淡灰色，上面落着一片小雪花（表示冻结）。下半部分一张“怎么跟 AI 说”的卡片，五句话做成对话气泡，两列排开。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "怎么跟 AI 说"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。首屏左题/一句话/说明，右电脑与Gmail/Drive/Tasks及锁、淡灰Calendar雪花插画；下方一张外卡含五泡两列。疑似定稿元标签“大标题：/一句话：/说明：”现是para真实字，按当前定稿保全，交main/定稿负责人判定，规格不删。；素材登记插画0/1，必须补齐场景要求，不能删除插画位。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "大标题：邮件、云盘和待办"
    },
    {
     "type": "prose",
     "size": "large",
     "bold": true,
     "text_ref": "一句话：用电脑上接好的那一个Google账号，读写Gmail、Google云盘和Go"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 7 日 22:11",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 3 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用小记录（10 月 3–9 日，记到 10 月 9 日）"
    },
    {
     "type": "prose",
     "text_ref": "说明：账号授权由电脑配置与恢复保管，只认这一个账号，用的时候换不了。AI手边有11个"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_items": true,
     "text_ref": "怎么跟 AI 说"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "illustration",
    "dialogue",
    "chapter_title",
    "content_card",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "竖版：标题、一句话、说明在上；插画占满宽度；五个对话气泡一行一个。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     2
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "怎么跟 AI 说"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。标题、导语、说明→整宽插画→五泡单列。疑似元标签照定稿保全；冻结Calendar插画仍保留，不把三品牌改成其它图标。；素材登记插画0/1，必须补齐场景要求，不能删除插画位。"
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
   "asset": "_library/illustrations/工作区连接电脑.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "工作区连接电脑",
   "source_phrase": "右边一幅水彩插画：一台台式电脑，屏幕旁绕着三枚品牌标志——Gmail、Google 云盘（Google Drive）、Google 待办（Google Tasks）——用细细的绿线连到电脑；电脑侧面挂着一把小锁（表示个人资料锁）；稍远处一枚 Google 日历（Google Calendar）标志画成淡灰色，上面落着一片小雪花（表示冻结）。",
   "sha256": "e50b102a50b231e3a78d3bdfeca8b65c9bba457a6bfa4ef510bda45dae5c874a",
   "status": "ready",
   "original_elements": [
    "一台台式电脑，屏幕旁绕着三枚品牌标志——Gmail、Google 云盘（Google Drive）、Google 待办（Google Tasks）——用细细的绿线连到电脑；电脑侧面挂着一把小锁（表示个人资料锁）；稍远处一枚 Google 日历（Google Calendar）标志画成淡灰色，上面落着一片小雪花（表示冻结"
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
   "asset": "_library/round3/titles/title-r3-d223d6a75d27bc742247.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-d223d6a75d27bc742247",
   "title_text": "邮件、云盘和待办",
   "sha256": "a5421fc213e048e3607c88073ed1669389fac032f3d58ee2d3dae382856854fb",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

大标题：邮件、云盘和待办

一句话：用电脑上接好的那一个 Google 账号，读写 Gmail、Google 云盘和 Google 待办；说一次要什么，AI 自己搜、读正文、办完、再读回核对，不把一串搜索结果丢给我。

说明：账号授权由〔电脑配置与恢复〕保管，只认这一个账号，用的时候换不了。AI 手边有 11 个只读工具；发信、上传、改待办这类写入，走电脑配置与恢复里同一套调用程序的命令行。邮件（连主题、发件人和验证码）和云盘里的私人文件都算个人资料：资料锁着时先请我验证，不先偷看主题再决定要不要验证（〔个人资料与数据处理〕）。Google 日历已冻结：代码留着，不接、不调用、不维护，等我说恢复。

**怎么跟 AI 说**
- “看看邮箱里刚来的验证码。”
- “找一下上周快递公司那封邮件，把正文读给我。”
- “云盘里那份 redis 笔记找出来读一下。”
- “按这个意思回复原邮件，附上桌面那份 PDF。”
- “把‘交房租’那条待办勾掉。”

::screen{#skill-google-workspace-direct-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-google-workspace-direct-02",
  "section": "examples",
  "title": "例子：等验证码",
  "scene": "横版：左上标题，下面一行“假如我……”。左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩图标（一个放大镜照着信封、一只手从几张卡片里挑出一张、一个沙漏、一张被划掉的信封、一只时钟）和两三行字。右边约三分之一宽，一幅插画：一部手机大小的邮件列表，旁边一个圆形计时表盘，画面上的字见“表盘上的字”；下面一张小卡片“要注意”。",
  "portrait": "竖版：标题和“假如我……”在上；五个步骤一行一步；邮件列表和表盘插画、“要注意”卡在最下。",
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
     "text_ref": "标题：一个完整例子：照这套做法，“看看邮箱里刚来的验证码”会这样办"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "prose",
     "text_ref": "假如我在某个网站点了“发送邮箱验证码”，然后说：“看看邮箱里刚来的验证码。”"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-2f69b4805e2ef6ecc3ff.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-02-icon-02.png",
      "_library/fix-round-2/icon-clean-9d6654a0249800fa9e6a.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-02-icon-04.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "row": "mail-code",
     "width": "67%",
     "text_ref": "1不反问：资料已解锁（锁着就先请我验证）；不问是哪个网站、要哪类码，直接查最近10分"
    },
    {
     "type": "document_mock",
     "variant": "window",
     "row": "mail-code",
     "text_ref": "表盘上的字：最近10分钟每5秒刷新至少等2分钟已排除1封",
     "base_asset": "_library/illustrations/ill-r3-3b851ccc59f5297a.png",
     "label_positions": [
      {
       "x": 63.66667,
       "y": 5.09554,
       "width": 20.33333,
       "height": 10.50955,
       "align": "center"
      },
      {
       "x": 54.83333,
       "y": 78.02548,
       "width": 15.66667,
       "height": 8.59873,
       "align": "center"
      },
      {
       "x": 80.0,
       "y": 78.02548,
       "width": 16.5,
       "height": 9.87261,
       "align": "center"
      },
      {
       "x": 8.83333,
       "y": 63.3758,
       "width": 33.16667,
       "height": 19.42675,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      }
     ],
     "layout": "illustration_labels"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "row": "mail-code",
     "text_ref": "要注意：进度只说我需要知道的，比如“还在等，已经等了1分钟”，不讲内部规则和工具名；"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "chapter_title",
    "numbered_steps",
    "icon",
    "illustration",
    "content_card",
    "quote"
   ],
   "source_layout": "横版：左上标题，下面一行“假如我……”。左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩图标（一个放大镜照着信封、一只手从几张卡片里挑出一张、一个沙漏、一张被划掉的信封、一只时钟）和两三行字。右边约三分之一宽，一幅插画：一部手机大小的邮件列表，旁边一个圆形计时表盘，画面上的字见“表盘上的字”；下面一张小卡片“要注意”。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩",
     "右边约三分之一宽，一幅插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。左2/3五步一列，右1/3邮件列表与表盘、要注意卡。五小图在步卡左，不加步间箭头。core编号组件当前仅above_card横版与top_inside默认布局，left_inside实际仍上图；需core支持纵列左图。表盘四段字来源一para，document_mock只保文，需comp-slots按｜分成四标签叠在表盘，不能图下列四段假称原构图。标题：元标签仍保全。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标2/5，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：删除单独插画块，仅保留document_mock底图。\nmain-closer：图内标签接final-label-geometry实测唯一bindings；当前完整底图SHA b9a99be3ab748a9f9f547d9bf8b2c231c59b37e461d860a805755326075a63d2；保原字与motion，最终安全框包容由DOM复核。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：一个完整例子：照这套做法，“看看邮箱里刚来的验证码”会这样办"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "prose",
     "text_ref": "假如我在某个网站点了“发送邮箱验证码”，然后说：“看看邮箱里刚来的验证码。”"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-2f69b4805e2ef6ecc3ff.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-02-icon-02.png",
      "_library/fix-round-2/icon-clean-9d6654a0249800fa9e6a.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-02-icon-04.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png"
     ],
     "text_ref": "1不反问：资料已解锁（锁着就先请我验证）；不问是哪个网站、要哪类码，直接查最近10分"
    },
    {
     "type": "document_mock",
     "variant": "window",
     "text_ref": "表盘上的字：最近10分钟每5秒刷新至少等2分钟已排除1封",
     "base_asset": "_library/round3/portrait-label-supply/png/ill-r3-portrait-5c85a0a4b186e1ca.png",
     "layout": "illustration_labels",
     "label_positions": [
      {
       "x": 46.191406,
       "y": 13.011152,
       "width": 29.882812,
       "height": 11.152416,
       "align": "center"
      },
      {
       "x": 79.78515625,
       "y": 50.55762081784386,
       "width": 18.1640625,
       "height": 5.5762081784386615,
       "align": "center",
       "letter_spacing": -2.25,
       "word_spacing": -4,
       "nowrap": true
      },
      {
       "x": 46.191406,
       "y": 70.855019,
       "width": 31.835938,
       "height": 11.598513,
       "align": "center"
      },
      {
       "x": 9.863281,
       "y": 65.724907,
       "width": 25.292969,
       "height": 27.063197,
       "align": "center"
      }
     ],
     "label_bindings": [
      {
       "label_index": 0,
       "position_index": 0
      },
      {
       "label_index": 1,
       "position_index": 1
      },
      {
       "label_index": 2,
       "position_index": 2
      },
      {
       "label_index": 3,
       "position_index": 3
      }
     ],
     "notes": "排版：第2标签留在原纸签的扣下无字带，源区[817,680,1003,755]；保留原两空格与36px字形，仅收紧字距/空白距离并整行显示，底图和motion绑定不改。"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "要注意：进度只说我需要知道的，比如“还在等，已经等了1分钟”，不讲内部规则和工具名；"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "illustration",
    "chapter_title",
    "numbered_steps",
    "icon",
    "content_card",
    "quote"
   ],
   "source_layout": "竖版：标题和“假如我……”在上；五个步骤一行一步；邮件列表和表盘插画、“要注意”卡在最下。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩",
     "右边约三分之一宽，一幅插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。五步单列之后才是邮件列表/表盘与要注意卡；左图方式及表盘文字定位同横待实现。题和假如我段不塞第一步。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标2/5，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：删除单独插画块，仅保留document_mock底图。\nmain-closer：图内标签接final-label-geometry实测唯一bindings；当前完整底图SHA b9a99be3ab748a9f9f547d9bf8b2c231c59b37e461d860a805755326075a63d2；保原字与motion，最终安全框包容由DOM复核。\nmain-closer 2026-10-03T20:36:28+08:00：实际文字Range超出真实安全牌框，竖版撤下坐标绑定，恢复原合法保字＋composition incomplete；不把单靠固定.tb框的旧机器pass当通过。safe DOM证据 main-closer/family-label-dom.json；横版实测安全绑定保留。\nmain-closer3：仅竖版接正式ready同scene新PNG与其SHA实测牌面合同；完整等比、不裁切拉伸，保全部原签与36px正文；真实Range和整页程序检查另核，横版保持既有图。"
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
   "source_phrase": "一个放大镜照着信封",
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
   "source_phrase": "一只手从几张卡片里挑出一张",
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "一个沙漏",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
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
   "source_phrase": "一张被划掉的信封",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "时钟",
   "source_phrase": "一只时钟",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-r3-3b851ccc59f5297a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "ill-r3-3b851ccc59f5297a",
   "source_phrase": "右边约三分之一宽，一幅插画：一部手机大小的邮件列表，旁边一个圆形计时表盘，画面上的字见“表盘上的字”；下面一张小卡片“要注意”。",
   "sha256": "b9a99be3ab748a9f9f547d9bf8b2c231c59b37e461d860a805755326075a63d2",
   "status": "ready",
   "original_elements": [
    "手机大小的邮件列表、圆形计时表盘；邮件名和时间文字由排版程序另放"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/portrait-label-supply/png/ill-r3-portrait-5c85a0a4b186e1ca.png",
   "fallback": false,
   "semantic_status": "same_scene_portrait_capacity_pending",
   "key": "ill-r3-portrait-5c85a0a4b186e1ca",
   "source_phrase": "右边约三分之一宽，一幅插画：一部手机大小的邮件列表，旁边一个圆形计时表盘，画面上的字见“表盘上的字”；下面一张小卡片“要注意”。",
   "sha256": "903841124f7874c9b94ec7390a5bb81ec85e93ace0aec187a0ff52f83348ebfa",
   "status": "ready",
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-6f985d2c355c464874c8.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-6f985d2c355c464874c8",
   "title_text": "一个完整例子：照这套做法，“看看邮箱里刚来的验证码”会这样办",
   "sha256": "a5fe819bfcb1ede19737ae199e5ca89888296c7fe432643acd3f542675a45b3e",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：一个完整例子：照这套做法，“看看邮箱里刚来的验证码”会这样办

示例：照这个技能的做法写的，不是某一次的记录

假如我在某个网站点了“发送邮箱验证码”，然后说：“看看邮箱里刚来的验证码。”

1. **不反问**：资料已解锁（锁着就先请我验证）；不问是哪个网站、要哪类码，直接查最近 10 分钟收到的全部邮件（翻完所有页），读新邮件的正文，按收到时间从新到旧排。
2. **AI 挑码**：按我正在登录的那个服务挑；无关的邮件、正文里引用的旧码、写明已过期的码都不算。回答“码＋哪个服务＋几点收到”。
3. **还没到就等**：每 5 秒刷一次；头一回确认没有之后，至少再等 2 分钟，到点再查最后一次；中途一来立刻回答。只有真的等满了，才说“等了 2 分钟还没收到”。
4. **我说“不是这个”**：把否定过的邮件排除，接着原来的截止时间等，不从头再等 2 分钟，也不再报旧码；不用我再说“继续”。
5. **回答前再核一次时间**：邮件多、读得慢时，早先的候选可能刚好超出 10 分钟，回答前按当时的时间重新筛一遍。

**表盘上的字**：最近 10 分钟｜每 5 秒刷新｜至少等 2 分钟｜已排除 1 封

**要注意**：进度只说我需要知道的，比如“还在等，已经等了 1 分钟”，不讲内部规则和工具名；只要求修这个技能时，不替我取码。这是照技能写的做法串起来的例子，不是某一次的记录。

::screen{#skill-google-workspace-direct-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-google-workspace-direct-03",
  "section": "examples",
  "title": "例子：回复原邮件",
  "scene": "横版：左上标题。左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩图标（一个信封、一根把两封信串在一起的绿线、一枚回形针别着一份 PDF、一张写着“草稿”的便签、一个打钩的放大镜）和两三行字。右边约三分之一宽，一幅插画：一个邮件线程，三封信用绿线串成一串，最下面一封带回形针；插画下一张小卡片写最后那句真事。",
  "portrait": "竖版：标题在上；五个步骤一行一步；线程插画和小卡片在最下。",
  "links": [
   {
    "text": "约法 L15",
    "href": "/rules/charter/#L15"
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
     "text_ref": "标题：再一个例子：“按这个意思回复原邮件，附上桌面那份PDF”"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-4216bb60f8d557fcd3c0.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-02.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-03.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-04.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-05.png"
     ],
     "text_ref": "1找到原邮件：按我给的线索搜，读正文；要看来回经过才读整个线程。2回到原线程：用原邮"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "after-steps",
     "width": "35%",
     "size": "small",
     "row_fit_illustration": true
    },
    {
     "type": "quote",
     "whole_block": true,
     "columns": 1,
     "text_ref": "这是照技能写的做法串起来的例子，只有下面这句是真事：“我发给自己的线程要保留我”这一",
     "row": "after-steps",
     "width": "65%"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "chapter_title",
    "numbered_steps",
    "icon",
    "illustration",
    "content_card",
    "inline_link",
    "quote"
   ],
   "source_layout": "横版：左上标题。左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩图标（一个信封、一根把两封信串在一起的绿线、一枚回形针别着一份 PDF、一张写着“草稿”的便签、一个打钩的放大镜）和两三行字。右边约三分之一宽，一幅插画：一个邮件线程，三封信用绿线串成一串，最下面一封带回形针；插画下一张小卡片写最后那句真事。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩",
     "右边约三分之一宽，一幅插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左2/3五步竖列，右1/3线程插画及真事卡；竖五步→插画→小卡。第五步核对、附件等五图需原位置文件齐全，不能用仅01/03两图轮流复用；left_inside编号卡当前未真左排待core。第4图小便签“草稿”在scene有字但定稿步骤正文亦有“草稿”，不凭空多写标签。标题：元标签保全。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标2/5，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：五步占全宽，插画与引语在步骤下方35%/65%并排。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "标题：再一个例子：“按这个意思回复原邮件，附上桌面那份PDF”"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/fix-round-2/icon-clean-4216bb60f8d557fcd3c0.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-02.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-03.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-04.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-03-icon-05.png"
     ],
     "text_ref": "1找到原邮件：按我给的线索搜，读正文；要看来回经过才读整个线程。2回到原线程：用原邮"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "quote",
     "whole_block": true,
     "columns": 1,
     "text_ref": "这是照技能写的做法串起来的例子，只有下面这句是真事：“我发给自己的线程要保留我”这一"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "illustration",
    "content_card",
    "chapter_title",
    "numbered_steps",
    "icon",
    "inline_link",
    "quote"
   ],
   "source_layout": "竖版：标题在上；五个步骤一行一步；线程插画和小卡片在最下。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1
    ],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "左边约三分之二宽，五个编号步骤排成一列，每步一个小水彩",
     "右边约三分之一宽，一幅插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左2/3五步竖列，右1/3线程插画及真事卡；竖五步→插画→小卡。第五步核对、附件等五图需原位置文件齐全，不能用仅01/03两图轮流复用；left_inside编号卡当前未真左排待core。第4图小便签“草稿”在scene有字但定稿步骤正文亦有“草稿”，不凭空多写标签。标题：元标签保全。；素材登记插画0/1，必须补齐场景要求，不能删除插画位；素材登记图标2/5，按源位置的文件号显式请求，缺图不代表可以省略图标。"
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
   "source_phrase": "一个信封",
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
   "source_phrase": "一根把两封信串在一起的绿线",
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
   "source_phrase": "一枚回形针别着一份 PDF",
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
   "source_phrase": "一张写着“草稿”的便签",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一个打钩的放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/邮件线程.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "邮件线程",
   "source_phrase": "右边约三分之一宽，一幅插画：一个邮件线程，三封信用绿线串成一串，最下面一封带回形针；插画下一张小卡片写最后那句真事。",
   "sha256": "de3c2bbe03fdfc9746870d8da3b574c9581bcf7f5c1feb199b55661bd93c125f",
   "status": "ready",
   "original_elements": [
    "一个邮件线程，三封信用绿线串成一串，最下面一封带回形针"
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
   "asset": "_library/round3/titles/title-r3-ad68a8207ba2025c09d1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ad68a8207ba2025c09d1",
   "title_text": "再一个例子：“按这个意思回复原邮件，附上桌面那份 PDF”",
   "sha256": "7049071d5be4f07c4298b258c1284a9b33ee61e6f2998ffdbdb94c721226ba99",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

标题：再一个例子：“按这个意思回复原邮件，附上桌面那份 PDF”

示例：照这个技能的做法写的，不是某一次的记录

1. **找到原邮件**：按我给的线索搜，读正文；要看来回经过才读整个线程。
2. **回到原线程**：用原邮件指定的回复地址和原主题，接上原线程的编号，不靠在标题前加“Re:”假装同一个线程；有别的收件人时去掉我自己，只有我发给自己的线程才保留我；密送的人不复制；不借回复另换收件人或主题。
3. **附件照原样**：用本机完整路径，中文文件名照样支持；发之前先算大小，超了明说，不偷偷漏掉附件，也不擅自改成公开链接。
4. **发之前**：发信要有我点名的对象和动作（〔约法 L15〕）；只想先看看，就存成草稿。改草稿是整份替换，先读清旧草稿和我要保留的附件。
5. **发完读回**：按返回的邮件编号，读回线程、收件人、主题、附件名字和个数，才说“发好了”；结果不明时先查是不是已经发出，不重发。

这是照技能写的做法串起来的例子，只有下面这句是真事：“我发给自己的线程要保留我”这一条，是 9 月 18 日真发过一次、验收后补进技能的。

::screen{#skill-google-workspace-direct-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-google-workspace-direct-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题，下面一段引导文字（带一个链接）。下面七张小卡片排成两列四行（最后一行一张），每张左边一个小水彩图标、粗体名字、两行以内的说明。",
  "portrait": "竖版：标题和引导文字在上；七张卡片一行一张。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/#g-google"
   }
  ],
  "anchors": [
   {
    "id": "a-mail-search",
    "text": "搜邮件一次带正文"
   },
   {
    "id": "a-query",
    "text": "把话翻成搜索条件"
   },
   {
    "id": "a-drive-name",
    "text": "云盘按名字找"
   },
   {
    "id": "a-read-on",
    "text": "找到就接着读"
   },
   {
    "id": "a-code",
    "text": "等邮箱验证码"
   },
   {
    "id": "a-reply",
    "text": "回复原邮件、带附件"
   },
   {
    "id": "a-tasks",
    "text": "待办按原意"
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
     "size": "medium",
     "text_ref": "标题：能做的事"
    },
    {
     "type": "prose",
     "text_ref": "邮件、云盘、待办的具体操作——例如找、读、发、回复、草稿，云盘上传、移动、分享，待办"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-6d923445dca2e61f37fa.png",
      "_library/fix-round-2/icon-clean-c82b4ac1c302554d0eb4.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-03.png",
      "_library/fix-round-2/icon-clean-f072fa87a9293c222df3.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-05.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-06.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-07.png"
     ],
     "text_ref": "1搜邮件一次带正文一次调用搜一页（默认10封）并读出正文；只要定位就只取主题、发件人"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "chapter_title",
    "inline_link",
    "content_card",
    "icon",
    "numbered_steps"
   ],
   "source_layout": "横版：左上标题，下面一段引导文字（带一个链接）。下面七张小卡片排成两列四行（最后一行一张），每张左边一个小水彩图标、粗体名字、两行以内的说明。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1,
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "下面七张小卡片排成两列四行（最后一行一张），每张左边一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。七功能卡横2列四行末一张半宽、竖一列；每卡左图右粗名和说明，保原编号，定稿无状态词不加状态圆点。引导段原链接完整；标题：元标签待判定但不删除。；素材登记图标3/7，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：章节标题medium（位图高度仍需主程序落实）。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "标题：能做的事"
    },
    {
     "type": "prose",
     "text_ref": "邮件、云盘、待办的具体操作——例如找、读、发、回复、草稿，云盘上传、移动、分享，待办"
    },
    {
     "type": "feature_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-6d923445dca2e61f37fa.png",
      "_library/fix-round-2/icon-clean-c82b4ac1c302554d0eb4.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-03.png",
      "_library/fix-round-2/icon-clean-f072fa87a9293c222df3.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-05.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-06.png",
      "skill-google-workspace-direct\\skill-google-workspace-direct-04-icon-07.png"
     ],
     "text_ref": "1搜邮件一次带正文一次调用搜一页（默认10封）并读出正文；只要定位就只取主题、发件人"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "content_card",
    "chapter_title",
    "inline_link",
    "icon",
    "numbered_steps"
   ],
   "source_layout": "竖版：标题和引导文字在上；七张卡片一行一张。",
   "layout_variants": {
    "desktop_columns_mentioned": [
     1,
     2
    ],
    "portrait_columns_mentioned": [
     1
    ],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "下面七张小卡片排成两列四行（最后一行一张），每张左边一个小水彩"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。七功能卡横2列四行末一张半宽、竖一列；每卡左图右粗名和说明，保原编号，定稿无状态词不加状态圆点。引导段原链接完整；标题：元标签待判定但不删除。；素材登记图标3/7，按源位置的文件号显式请求，缺图不代表可以省略图标。；page-fixer-07：章节标题medium（位图高度仍需主程序落实）。"
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "搜邮件一次带正文｜一次调用搜一页（默认 10 封）并读出正文；只要定位就只取主题、发件人和时间。只在这一页里排时间，不假称“全邮箱最新”；要汇总全部，就翻完所有页并去重",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "把话翻成搜索条件｜人、主题、时间、文件夹一起拼成 Gmail 和云盘自己的查询，不把整句原话当精确短语；没结果先查条件是不是太窄、换别名和同义词，不马上说“没有”",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件写作",
   "source_phrase": "云盘按名字找｜先按完整文件名找，完全没有才放宽到“名字里包含”，最多 5 个候选；“redis 笔记”只拿“redis”去找；同名几份时看文件夹、类型、修改时间，真分不清才问我；结果不全时明说",
   "sha256": "28af955cf2d0855d3f91be0690a129e092af2b43346eb766b773beab8f70519b",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "找到就接着读｜Google 文档导出成文字，普通文件下载后由 AI 选合适的读法来读，并附上原文件链接",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "等邮箱验证码｜见第一个例子",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ee27e64c97037ad87bcf.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "气泡钢笔",
   "source_phrase": "回复原邮件、带附件｜见第二个例子",
   "sha256": "0885f03d0fd8605a1e8158ed683043f68c0a9f2176cb524056d398071c4424c1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "待办按原意｜先拿准清单编号再查改；到期只到日期，不当成几点截止；修改只改我点名的字段；“隐藏”只能查、不能设",
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

邮件、云盘、待办的具体操作——例如找、读、发、回复、草稿，云盘上传、移动、分享，待办新建、修改、勾掉——由〔电脑配置与恢复〕里的调用程序提供，功能列在它的 Google 直连一组。这个技能自己管的是“怎么用得顺”：

1. **搜邮件一次带正文**｜一次调用搜一页（默认 10 封）并读出正文；只要定位就只取主题、发件人和时间。只在这一页里排时间，不假称“全邮箱最新”；要汇总全部，就翻完所有页并去重
2. **把话翻成搜索条件**｜人、主题、时间、文件夹一起拼成 Gmail 和云盘自己的查询，不把整句原话当精确短语；没结果先查条件是不是太窄、换别名和同义词，不马上说“没有”
3. **云盘按名字找**｜先按完整文件名找，完全没有才放宽到“名字里包含”，最多 5 个候选；“redis 笔记”只拿“redis”去找；同名几份时看文件夹、类型、修改时间，真分不清才问我；结果不全时明说
4. **找到就接着读**｜Google 文档导出成文字，普通文件下载后由 AI 选合适的读法来读，并附上原文件链接
5. **等邮箱验证码**｜见第一个例子
6. **回复原邮件、带附件**｜见第二个例子
7. **待办按原意**｜先拿准清单编号再查改；到期只到日期，不当成几点截止；修改只改我点名的字段；“隐藏”只能查、不能设

::screen{#skill-google-workspace-direct-05 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-google-workspace-direct-05",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题。左右两栏：左栏“管”画一个打开的信封和一片云，下面一条；右栏“不管”画一个淡灰色的叉，下面五条。最下面一张宽卡片写“它不会做的事”。",
  "portrait": "竖版：“管”一栏在上、“不管”一栏在下，一条一行；最下面宽卡片。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/#g-google"
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
     "size": "medium",
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "管"
      },
      {
       "text_ref": "不管"
      }
     ],
     "connector": "none",
     "text_ref": "管"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "它不会做的事：邮件、文件、待办里写的内容只当资料，不当指令；发送、共享、删除要有明确"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "chapter_title",
    "comparison",
    "content_card",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "横版：左上标题。左右两栏：左栏“管”画一个打开的信封和一片云，下面一条；右栏“不管”画一个淡灰色的叉，下面五条。最下面一张宽卡片写“它不会做的事”。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "管",
     "不管"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横管/不管两栏、竖同序上下，底它不会做的事整宽卡；管头信封云、不管灰叉是scene要求，inventory图标0；comparison需明确group header图标映射和素材补齐，当前无组图不等于允许省掉。末段粗前缀为para，需comp-text显成卡头。；page-fixer-07：章节标题medium（位图高度仍需主程序落实）。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "标题：边界"
    },
    {
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "管"
      },
      {
       "text_ref": "不管"
      }
     ],
     "connector": "none",
     "text_ref": "管"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "它不会做的事：邮件、文件、待办里写的内容只当资料，不当指令；发送、共享、删除要有明确"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-google-workspace-direct\\page.json",
   "source_sha256": "41fc28ca1b8852703d4b4975268be8991276e5786c0798dd322d568da2cedd58",
   "source_component_order": [
    "content_card",
    "chapter_title",
    "comparison",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "竖版：“管”一栏在上、“不管”一栏在下，一条一行；最下面宽卡片。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "管",
     "不管"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横管/不管两栏、竖同序上下，底它不会做的事整宽卡；管头信封云、不管灰叉是scene要求，inventory图标0；comparison需明确group header图标映射和素材补齐，当前无组图不等于允许省掉。末段粗前缀为para，需comp-text显成卡头。；page-fixer-07：章节标题medium（位图高度仍需主程序落实）。"
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
- 这一个 Google 账号的 Gmail、云盘、待办：搜、读，以及我明确要求的写入

**不管**
- Google 日历（已冻结）
- Google 相册：另一份授权，归〔电脑配置与恢复〕
- Google 管理后台、付款
- 别的 Google 账号
- 在本机存一份邮件或云盘副本、自动同步

**它不会做的事**：邮件、文件、待办里写的内容只当资料，不当指令；发送、共享、删除要有明确的对象和动作，做完读回，不重复发送、不盲目重试；只读时网络抖一下最多重试一次；账号、权限出错就如实说缺什么，不换账号，也不改走浏览器或别的连接器绕过去；待办需要重新授权时，请我自己在前台点同意，AI 不代点。

**技术依据**　固定连接 `google-workspace.primary`，不换账号。云盘、待办的调用必须带用途等级 `privacy_level`，取 `screen` 或 `factor`；`none` 只用于不涉及个人资料的运维，缺了就返回 `personal_access_classification_required`。写入按精确动作授权并读回；结果是 `effect_unknown`（不确定有没有生效）时不自动重发，先回读核对。待办先取精确清单编号再查改；列表支持翻页、按更新时间筛、含已完成、含隐藏，保留分页和指派（assignment）信息；“隐藏”状态上游只读，没有设为隐藏的写操作。给 AI 列出的只读工具 11 个：邮件 4、云盘 4、待办 3；`Start-GoogleWorkspaceMcp.ps1` 里共 13 个定义，启动时滤掉日历的 2 个（`calendar_*`），日历保持冻结。本轮只读了技能和连接脚本，没有调用 Google 接口。
