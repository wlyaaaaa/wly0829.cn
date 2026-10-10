---
{
 "title": "找文件原件",
 "kind": "skill",
 "url": "/skills/personal-materials/",
 "tagline": "说个大概，找出文档原件，翻到要看的那一页。",
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
  "page": "skill-personal-materials",
  "kind": "skill",
  "title": "找文件原件",
  "url": "/skills/personal-materials/",
  "tagline": "说个大概，找出文档原件，翻到要看的那一页。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-08 14:43"
   },
   "facts": [
    "近 7 天 AI 用了 5 次"
   ],
   "as_of": "2026-10-10",
   "source": "AI 使用小记录（记到 10 月 8 日）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "ad55b742899bbc0b51338bb062478815571e391e",
   "commit_time": "2026-09-27T05:14:09-05:00",
   "file": "E:\\.agents\\skills\\personal-materials\\SKILL.md",
   "rules_release": "E187",
   "project_commit": "ed2fd32c5e796c7f6e69645f88728e82f139f9f4"
  },
  "video_prompt": "",
  "registry": {
   "relations": [
    {
     "id": "r-project",
     "with": "personal-materials",
     "direction": "拿来",
     "flow": "技能调用个人材料查找的 materials.py（find、discover、inspect、locate-content、open 等），查的是它的登记和文件名清单",
     "source": "E:\\.agents\\skills\\personal-materials\\SKILL.md 第 25–35 行"
    },
    {
     "id": "r-media",
     "with": "personal-media",
     "direction": "分工",
     "flow": "照片、视频、录音都走找照片和录音，这个技能从不定位或打开媒体",
     "source": "SKILL.md 第 13、39 行"
    },
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "交出",
     "flow": "选中的 PDF 没有文字层时，只把这一份交给本地文字识别，结果对回原 PDF 页码和当前指纹",
     "source": "SKILL.md 第 23 行"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "拿来",
     "flow": "规则规定：只有原件位置不明、要跨位置找或定位失效时才用这个技能；知道位置直接读",
     "source": "E187 agents.capabilities-runtime.md 第 20 行；SKILL.md 第 12–14 行"
    }
   ],
   "mentions": [
    {
     "target": "/projects/personal-materials/#top",
     "screen": "skill-personal-materials-01",
     "text": "项目页开头"
    },
    {
     "target": "/projects/personal-materials/#features",
     "screen": "skill-personal-materials-03",
     "text": "项目页的全部功能"
    },
    {
     "target": "/skills/personal-media/",
     "screen": "skill-personal-materials-04",
     "text": "找照片和录音"
    },
    {
     "target": "/skills/localocr/",
     "screen": "skill-personal-materials-04",
     "text": "本地文字识别"
    }
   ]
  },
  "notes": {
   "merged": [
    "SKILL.md 里的各条命令（find、discover、inspect、locate-content、open、lookup-content 等）是项目功能，家在项目页全部功能，这里只链过去。"
   ],
   "dropped": [
    "SKILL.md 第 15、37、39 行里提到的不上网站的类别和历史画像文件，不写。"
   ],
   "unsure": [
    "例子里的租房合同、押金条款原文、“第 4 页”都是展示用例（本人允许虚构用例），不是某份真实材料；AI 那段回答是替 AI 写的示范，不是某次真实对话。",
    "页名沿用旧网站技能稿和“找照片和录音”“文件分拣”两页已经在用的“找文件原件”；技能自己的英文名是 personal-materials，项目页叫“个人材料查找”，两者不一样。",
    "第 1 屏前六句说法是替本人口吻写的展示用例，上线前请本人过目；第七句是本人 9 月 25 日的原话（“42文件现在就给我看，若他们在材料库已经有了，直接删了不用给我看”）稍作整理。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-personal-materials/page.json",
  "sha256": "da3da8b564da7ab9767dfa7735b69ef3a942d6fc5739bdba7566813c57bdd01d",
  "converted_at_beijing": "2026-10-10T09:06:30+08:00"
 }
}
---

::screen{#skill-personal-materials-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-personal-materials-01",
  "section": "top",
  "title": "找文件原件",
  "scene": "横版：左边大标题，下面两行说明；右边一幅水彩插画：一个半开的木制文件柜抽屉，一只放大镜照着一页纸上一行绿色高亮，纸角挂着一个画着绿色对勾的小标签（纸上文字只画灰色横线）。下半部七个白底圆角对话气泡，前两行各三个、第三行一个加宽的，每个气泡里一句跟 AI 说的话，第七个气泡右下角画一个小的绿色对勾图标，括号里的说明写在这个气泡下面一行小字，“项目页开头”画成绿色链接样式，气泡左上一个小人头像图标；气泡上方一行小标题“这样说就行”。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和说明在上；插画缩到整宽放在说明下面；七个对话气泡一行一个上下排。字和横版完全一样。",
  "links": [
   {
    "text": "项目页开头",
    "href": "/projects/personal-materials/#top"
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
     "text_ref": "找文件原件",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 8 日 14:43",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 5 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "k1a-head",
     "width": "auto",
     "align": "right"
    },
    {
     "type": "prose",
     "text_ref": "不知道一份文档放在哪时，说个大概，AI找出那一份原件，核对确实是它，再翻到你要看的那"
    },
    {
     "type": "dialogue",
     "split_items": true,
     "columns": 3,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "illustration": "left_inside",
     "text_ref": "这样说就行",
     "row_counts": [
      3,
      2,
      2
     ]
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "chapter_title",
    "illustration",
    "prose",
    "tag",
    "dialogue",
    "inline_link",
    "section_heading",
    "bullet_list"
   ],
   "source_layout": "横版：左边大标题，下面两行说明；右边一幅水彩插画：一个半开的木制文件柜抽屉，一只放大镜照着一页纸上一行绿色高亮，纸角挂着一个画着绿色对勾的小标签（纸上文字只画灰色横线）。下半部七个白底圆角对话气泡，前两行各三个、第三行一个加宽的，每个气泡里一句跟 AI 说的话，第七个气泡右下角画一个小的绿色对勾图标，括号里的说明写在这个气泡下面一行小字，“项目页开头”画成绿色链接样式，气泡左上一个小人头像图标；气泡上方一行小标题“这样说就行”。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "这样说就行"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。首屏左题说明、右文件柜放大镜插画；七对白横3+3+1末泡加宽、竖七泡单列。每泡左上头像与第七泡绿色对勾仍是要求，inventory小图预算0须补7人像与勾；dialogue当前无末泡跨列或把括注提到泡下的小字接口，需comp-text，不能把括注当第八泡或丢掉。项目页开头是原链接。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "找文件原件"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 8 日 14:43",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 5 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · AI 使用小记录（记到 10 月 8 日）"
    },
    {
     "type": "prose",
     "text_ref": "不知道一份文档放在哪时，说个大概，AI找出那一份原件，核对确实是它，再翻到你要看的那"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "dialogue",
     "split_items": true,
     "columns": 1,
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ],
     "illustration": "left_inside",
     "text_ref": "这样说就行"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "illustration",
    "dialogue",
    "prose",
    "chapter_title",
    "tag",
    "inline_link",
    "section_heading",
    "bullet_list"
   ],
   "source_layout": "竖版 9:16：标题和说明在上；插画缩到整宽放在说明下面；七个对话气泡一行一个上下排。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "这样说就行"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右边一幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。首屏左题说明、右文件柜放大镜插画；七对白横3+3+1末泡加宽、竖七泡单列。每泡左上头像与第七泡绿色对勾仍是要求，inventory小图预算0须补7人像与勾；dialogue当前无末泡跨列或把括注提到泡下的小字接口，需comp-text，不能把括注当第八泡或丢掉。项目页开头是原链接。"
  }
 },
 "images": [
  {
   "role": "avatar",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“去年租房签的那份合同放哪了？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“要签字版，不要草稿。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“不是这几个，再找找，应该在下载文件夹里。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“上个月微信里收到的那份报价单。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“这份合同里讲押金怎么退的是第几页？”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“打开给我看看。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "avatar",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/avatars/本人-通用.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "本人通用头像",
   "source_phrase": "“这 42 个文件给我看，材料库里已经有了的直接删。”（9 月 25 日真这么说过，结果见项目页开头）",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/40-main-personal-materials-clean.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "main-personal-materials",
   "source_phrase": "横版：左边大标题，下面两行说明；右边一幅水彩插画：一个半开的木制文件柜抽屉，一只放大镜照着一页纸上一行绿色高亮，纸角挂着一个画着绿色对勾的小标签（纸上文字只画灰色横线）。",
   "sha256": "2d93d1dbb7e27d2bfe7edfb1fddc0ce968d1aa0b0d2abf80d5e29944ef796814",
   "status": "ready",
   "original_elements": [
    "一个半开的木制文件柜抽屉，一只放大镜照着一页纸上一行绿色高亮，纸角挂着一个画着绿色对勾的小标签（纸上文字只画灰色横线"
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
   "asset": "skill-personal-materials/skill-personal-materials-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\img\\skill-personal-materials-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b4cd545c8396c40e2a46",
   "title_text": "找文件原件",
   "sha256": "f4bc91323b790d83fd1ff844f746954f780ea2fb715e741831af5c016a742dff",
   "status": "ready",
   "source_box": [
    35,
    75,
    703,
    275
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 找文件原件

不知道一份文档放在哪时，说个大概，AI 找出那一份原件，核对确实是它，再翻到你要看的那一页。照片、视频、录音不归它。

**这样说就行**

- “去年租房签的那份合同放哪了？”
- “要签字版，不要草稿。”
- “不是这几个，再找找，应该在下载文件夹里。”
- “上个月微信里收到的那份报价单。”
- “这份合同里讲押金怎么退的是第几页？”
- “打开给我看看。”
- “这 42 个文件给我看，材料库里已经有了的直接删。”（9 月 25 日真这么说过，结果见〔项目页开头〕）

::screen{#skill-personal-materials-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-personal-materials-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "横版：左上标题。下面左右两栏：左栏是一段对话（“我”的绿色气泡在右、“AI”的白色回答卡片在左，回答卡片里一行小字引文用浅绿底框起来）；右栏是一条竖向的五步小流程，每步一个绿色圆圈编号和一句话，步与步之间绿色箭头，第 5 步画成虚线框。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；对话在上（气泡和回答卡片上下排），五步流程在下，一步一行。字和横版完全一样。",
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
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "row": "walkthrough",
     "width": "50%",
     "text_ref": "我：去年租房签的那份合同，要签字版，讲押金怎么退的是哪一条？"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "row": "walkthrough",
     "text_ref": "AI：签字版有2份，内容指纹完全相同，是同一份文件的两个副本（只列了带“签字”字样的"
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "row": "walkthrough",
     "text_ref": "我：不用，知道了。"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "row": "walkthrough",
     "width": "50%",
     "text_ref": "它背后做了什么",
     "optional_items": [
      5
     ]
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "chapter_title",
    "comparison",
    "dialogue",
    "numbered_steps",
    "flow"
   ],
   "source_layout": "横版：左上标题。下面左右两栏：左栏是一段对话（“我”的绿色气泡在右、“AI”的白色回答卡片在左，回答卡片里一行小字引文用浅绿底框起来）；右栏是一条竖向的五步小流程，每步一个绿色圆圈编号和一句话，步与步之间绿色箭头，第 5 步画成虚线框。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它背后做了什么"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左对话我右/AI左/我右三泡，右五步竖向绿箭头，第5步虚线框；引文第4页原文在AI单para内，需comp-text按现有引文范围加浅绿内框；flow尚无单项虚线边框选择，需comp-diagram仅第5步样式支持。不得新增图标（scene无步图）。\n本轮回读组件已有optional_items，已用于第五步虚线框；先前关于单项虚线不支持的备注已过时。引文内框仍未实现。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "text_ref": "我：去年租房签的那份合同，要签字版，讲押金怎么退的是哪一条？"
    },
    {
     "type": "dialogue",
     "sides": [
      "left"
     ],
     "text_ref": "AI：签字版有2份，内容指纹完全相同，是同一份文件的两个副本（只列了带“签字”字样的"
    },
    {
     "type": "dialogue",
     "sides": [
      "right"
     ],
     "text_ref": "我：不用，知道了。"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "connector": "arrow",
     "illustration": "none",
     "text_ref": "它背后做了什么",
     "optional_items": [
      5
     ]
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "numbered_steps",
    "flow",
    "chapter_title",
    "comparison",
    "dialogue"
   ],
   "source_layout": "竖版 9:16：标题；对话在上（气泡和回答卡片上下排），五步流程在下，一步一行。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它背后做了什么"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。标题→三泡对话→五步纵流程；引文内框和第5虚线框同横待组件实现。全文非新补示例，照既有定稿不改原例子。\n本轮回读组件已有optional_items，已用于第五步虚线框；先前关于单项虚线不支持的备注已过时。引文内框仍未实现。"
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
   "asset": "_library/round3/titles/title-r3-ffa2cdd15edd0e90e6e8.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\img\\skill-personal-materials-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ffa2cdd15edd0e90e6e8",
   "title_text": "一个完整的例子",
   "sha256": "124b2b24498ea3f5a4ab869e35efad8b281dcd8cd6557b63e9b7e3753660f0cb",
   "status": "ready",
   "source_box": [
    32,
    15,
    772,
    173
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 一个完整的例子

示例：照这个技能的做法写的，不是某一次的记录

**我：**去年租房签的那份合同，要签字版，讲押金怎么退的是哪一条？

**AI：**签字版有 2 份，内容指纹完全相同，是同一份文件的两个副本（只列了带“签字”字样的）。押金在第 4 页：“租期届满且房屋交还后十个工作日内，退还全部押金……”。这份已经核对过，和登记时一模一样。要打开给你看吗？

**我：**不用，知道了。

**它背后做了什么**

1. AI 把你的话整理成“租房合同 签字版”交给它，在登记过的原件里比对标题和已知文字。
2. 说法里有“签字”，不带“签字”“签署”字样的候选（比如草稿）直接不列；两份指纹相同，说成同一份的副本。
3. 选中一份，重新算 SHA-256，和登记时的大小、指纹对上。
4. 只读这一份 PDF 的文字，找到第 4 页，附一小段原文；没弹窗口，你说要看才打开。
5. 如果它是扫描件：说清哪几页没有文字，只把这一份交给本地文字识别，再对回页码。

::screen{#skill-personal-materials-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-personal-materials-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版：左上标题，下面一句带链接的话单独一行、字稍大，“项目页的全部功能”画成绿色链接样式，右边一个白底细浅绿描边的圆角按钮样式箭头。画面右半一幅较大的水彩插画：一个漏斗，上面几张只画灰线的纸落进去，下面只出来一页带绿色对勾的纸。这一屏字少，整体高度可以比别的屏矮，不硬填内容。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；那句链接的话；漏斗插画整宽放在下面。字和横版完全一样。",
  "links": [
   {
    "text": "项目页的全部功能",
    "href": "/projects/personal-materials/#features"
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
     "row": "abilities",
     "width": "60%",
     "text_ref": "能做的事"
    },
    {
     "type": "prose",
     "size": "large",
     "row": "abilities",
     "text_ref": "它是个人材料查找的入口，能做的事见项目页的全部功能。"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "abilities",
     "width": "40%",
     "size": "medium",
     "align": "center"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "chapter_title",
    "inline_link",
    "action_button",
    "illustration",
    "segmented_band"
   ],
   "source_layout": "横版：左上标题，下面一句带链接的话单独一行、字稍大，“项目页的全部功能”画成绿色链接样式，右边一个白底细浅绿描边的圆角按钮样式箭头。画面右半一幅较大的水彩插画：一个漏斗，上面几张只画灰线的纸落进去，下面只出来一页带绿色对勾的纸。这一屏字少，整体高度可以比别的屏矮，不硬填内容。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右半一幅较大的水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左标题及稍大链接段、右半漏斗插画；竖题→链接段→整宽漏斗。字少高度按内容，不强填9:16。段里箭头按钮仅是无字装饰，不能另外加项目链接文本；prose内原链接须comp-text提供右侧箭头按钮样式及同目标热区。；本轮审查修复：abilities左右栏改60/40，漏斗用medium并居中，减少右图撑高造成的左半空白。"
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
     "type": "prose",
     "size": "large",
     "text_ref": "它是个人材料查找的入口，能做的事见项目页的全部功能。"
    },
    {
     "type": "illustration",
     "index": 0
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "inline_link",
    "segmented_band",
    "illustration",
    "chapter_title",
    "action_button"
   ],
   "source_layout": "竖版 9:16：标题；那句链接的话；漏斗插画整宽放在下面。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右半一幅较大的水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横左标题及稍大链接段、右半漏斗插画；竖题→链接段→整宽漏斗。字少高度按内容，不强填9:16。段里箭头按钮仅是无字装饰，不能另外加项目链接文本；prose内原链接须comp-text提供右侧箭头按钮样式及同目标热区。"
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
   "asset": "_library/illustrations/ill-a0d08c68ea9b87.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-a0d08c68ea9b87",
   "source_phrase": "画面右半一幅较大的水彩插画：一个漏斗，上面几张只画灰线的纸落进去，下面只出来一页带绿色对勾的纸。",
   "sha256": "1b559154f36e5a8633c70c46909405a4cd52c3de2a29723895093358caa32708",
   "status": "ready",
   "original_elements": [
    "一个漏斗，上面几张只画灰线的纸落进去，下面只出来一页带绿色对勾的纸"
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
   "asset": "skill-personal-materials/skill-personal-materials-03-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-skill-personal-materials-03-h\\round-01\\candidate-1.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7dadc2c869cdb800f4de",
   "title_text": "能做的事",
   "sha256": "7220f624c3919cd1f629edfd976a6b5e536a5cb308a89e1951464d6d62cdffa4",
   "status": "ready",
   "source_box": [
    15,
    151,
    702,
    417
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 能做的事

它是个人材料查找的入口，能做的事见〔项目页的全部功能〕。

::screen{#skill-personal-materials-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-personal-materials-04",
  "section": "limits",
  "title": "边界",
  "scene": "横版：左上标题“边界”。下面两栏卡片：左栏绿色小勾标题“它管的”，三条；右栏灰色小叉标题“它不管的”，六条；每条一行或两行，左边一个小图标。右下角一小幅水彩插画：一个整齐的小卡片盒，旁边一台没插电的大扫描仪上画一个灰色叉。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；“它管的”一栏在上，“它不管的”一栏在下，每条一行；插画缩小放在最下面。字和横版完全一样。",
  "links": [
   {
    "text": "找照片和录音",
    "href": "/skills/personal-media/",
    "orientations": [
     "v"
    ]
   },
   {
    "text": "本地文字识别",
    "href": "/skills/localocr/",
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
     "align": "center",
     "size": "large",
     "text_ref": "边界"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "它管的"
      }
     ],
     "layout": "item_rows",
     "item_cards": true,
     "illustration": "left_inside",
     "item_icons": [
      "skill-personal-materials\\skill-personal-materials-04-icon-01.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-02.png",
      "_library/fix-round-2/icon-clean-8e9684d17b9e41e0c4fa.png"
     ],
     "group_markers": [
      "check"
     ],
     "connector": "none",
     "text_ref": "它管的",
     "row": "limits",
     "width": "50%",
     "image_mode": "item",
     "source_prose": true,
     "align_items": "start"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "limits",
     "size": "banner",
     "align": "center"
    },
    {
     "type": "comparison",
     "columns": 1,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "它不管的"
      }
     ],
     "layout": "item_rows",
     "item_cards": true,
     "illustration": "left_inside",
     "item_icons": [
      "_library/fix-round-2/icon-clean-7da2567a38794ca6b452.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/fix-round-2/icon-clean-a71898bcb8d85f69f314.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-07.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-08.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-09.png"
     ],
     "group_markers": [
      "cross"
     ],
     "connector": "none",
     "text_ref": "它不管的",
     "row": "limits",
     "width": "50%",
     "image_mode": "item",
     "source_prose": true,
     "align_items": "start"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "chapter_title",
    "content_card",
    "prose",
    "icon",
    "illustration",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "横版：左上标题“边界”。下面两栏卡片：左栏绿色小勾标题“它管的”，三条；右栏灰色小叉标题“它不管的”，六条；每条一行或两行，左边一个小图标。右下角一小幅水彩插画：一个整齐的小卡片盒，旁边一台没插电的大扫描仪上画一个灰色叉。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它管的",
     "它不管的"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右下角一小幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横两栏它管的3条/它不管的6条，组头绿勾/灰叉；各行左语义图标，主插画小卡盒与没插电扫描仪在右下卡外，竖最底。comparison已支持item_rows、明确逐项图文件、勾叉，但当前主插画独立底行无法右贴卡边，单块row只有一项不会按width约束，需core提供插画对齐与max_width，不能说右下小图已完成。图标缺02/07-09按对应语义补，不错配剩余5图。；素材登记图标5/9，按源位置的文件号显式请求，缺图不代表可以省略图标。；本轮审查修复：comparison按原分组拆为同排两块，各自只含3/6原条目；无width的扫描仪横带归入左列、置于左卡下方并居中，两卡不再由同一comparison网格拉为等高。不增加文字。\n2026-10-04 空白专查追加（AI实施；本人本轮明确授权重排）：三条管/六条不管是独立原文纵链，明确source_prose保持自然高度，原扫描图在短组后紧接，不再把短组外卡补至长组高度。 定稿和素材原件不改。"
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
     "type": "comparison",
     "columns": 2,
     "columns_v": 1,
     "groups": [
      {
       "text_ref": "它管的"
      },
      {
       "text_ref": "它不管的"
      }
     ],
     "layout": "item_rows",
     "item_cards": true,
     "illustration": "left_inside",
     "item_icons": [
      "skill-personal-materials\\skill-personal-materials-04-icon-01.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-02.png",
      "_library/fix-round-2/icon-clean-8e9684d17b9e41e0c4fa.png",
      "_library/fix-round-2/icon-clean-7da2567a38794ca6b452.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/fix-round-2/icon-clean-a71898bcb8d85f69f314.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-07.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-08.png",
      "skill-personal-materials\\skill-personal-materials-04-icon-09.png"
     ],
     "group_markers": [
      "check",
      "cross"
     ],
     "connector": "none",
     "text_ref": "它管的"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "banner",
     "align": "center"
    }
   ],
   "source_path": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\skill-personal-materials\\page.json",
   "source_sha256": "fca9594f53440b26fe3bdfc7881c33aaa81f1439afe641f3c6b325b55a3460d6",
   "source_component_order": [
    "prose",
    "illustration",
    "chapter_title",
    "content_card",
    "icon",
    "bullet_list",
    "inline_link"
   ],
   "source_layout": "竖版 9:16：标题；“它管的”一栏在上，“它不管的”一栏在下，每条一行；插画缩小放在最下面。字和横版完全一样。",
   "layout_variants": {
    "desktop_columns_mentioned": [],
    "portrait_columns_mentioned": [],
    "card_groups": [
     "它管的",
     "它不管的"
    ],
    "table_shapes": [],
    "illustration_position_mentions": [
     "右下角一小幅水彩插画"
    ],
    "portrait_split_or_protection": false
   },
   "notes": "依据定稿scene/portrait与库存文字描述制定，未查看图片、未渲染。横两栏它管的3条/它不管的6条，组头绿勾/灰叉；各行左语义图标，主插画小卡盒与没插电扫描仪在右下卡外，竖最底。comparison已支持item_rows、明确逐项图文件、勾叉，但当前主插画独立底行无法右贴卡边，单块row只有一项不会按width约束，需core提供插画对齐与max_width，不能说右下小图已完成。图标缺02/07-09按对应语义补，不错配剩余5图。；素材登记图标5/9，按源位置的文件号显式请求，缺图不代表可以省略图标。；本轮审查修复：手机页尾扫描仪用banner居中，空细框若属裁片污染则由素材共性请求处理。"
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "不知道在哪、要在几个地方找，或者原来的位置失效了：找出文档这类非媒体原件。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "选中后核对大小和内容指纹，翻到页码、段落或行号。",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
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
   "source_phrase": "没找到时说清查过哪些来源、哪些打不开、哪些没查，不说“没有这份”。",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "知道在哪的文件：AI 直接读，不经过它。",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "照片、视频、录音，也包括拍成照片的证件和截图：用〔找照片和录音〕。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "扫描件认字：交给〔本地文字识别〕，它只把那一份交过去。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "这份文件说明了什么、接下来怎么办：归各自的项目。",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "不扫整台电脑、不在后台跑、不复制或搬动原件，也不记人物、事件、重要程度。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "查找时不改登记：去掉删掉的文件只在每天 17:10 的同步里做。",
   "sha256": "99ea4809646d31db12b8e216bc463e77f51b435a55e6e70607697f3a0363023c",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/late-r3-scanner-card-box.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "late-r3-scanner-card-box",
   "source_phrase": "右下角一小幅水彩插画：一个整齐的小卡片盒，旁边一台没插电的大扫描仪上画一个灰色叉。",
   "sha256": "8af36b0505d74bfee38c9a1d014146303f3893b1e7e148214b9470c6795cdd7c",
   "status": "ready",
   "original_elements": [
    "一个整齐的小卡片盒，旁边一台没插电的大扫描仪上画一个灰色叉"
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

# 边界

**它管的**

- 不知道在哪、要在几个地方找，或者原来的位置失效了：找出文档这类非媒体原件。
- 选中后核对大小和内容指纹，翻到页码、段落或行号。
- 没找到时说清查过哪些来源、哪些打不开、哪些没查，不说“没有这份”。

**它不管的**

- 知道在哪的文件：AI 直接读，不经过它。
- 照片、视频、录音，也包括拍成照片的证件和截图：用〔找照片和录音〕。
- 扫描件认字：交给〔本地文字识别〕，它只把那一份交过去。
- 这份文件说明了什么、接下来怎么办：归各自的项目。
- 不扫整台电脑、不在后台跑、不复制或搬动原件，也不记人物、事件、重要程度。
- 查找时不改登记：去掉删掉的文件只在每天 17:10 的同步里做。
