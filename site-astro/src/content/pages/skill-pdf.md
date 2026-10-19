---
{
 "title": "PDF 读写和表单",
 "kind": "skill",
 "url": "/skills/pdf/",
 "tagline": "读、做、填 PDF，值存住了、每页看过才交。",
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
   "id": "boundaries",
   "label": "边界"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-pdf",
  "kind": "skill",
  "title": "PDF 读写和表单",
  "url": "/skills/pdf/",
  "tagline": "读、做、填 PDF，值存住了、每页看过才交。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-09 12:57"
   },
   "facts": [
    "近 7 天 AI 用了 9 次",
    "Codex 自带插件，10 月 10 日的版本"
   ],
   "as_of": "2026-10-11",
   "source": "AI 使用小记录（10 月 4 日 23:52 起 7 天，记到 10 月 11 日零点）；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "draft": "skill-pdf.md",
   "plugin_version": "26.1009.11318",
   "checked_beijing": "2026-10-11"
  },
  "video_prompt": "",
  "registry": {
   "groups": [
    {
     "id": "g-read",
     "name": "读"
    },
    {
     "id": "g-write",
     "name": "做和改"
    },
    {
     "id": "g-form",
     "name": "填表单"
    },
    {
     "id": "g-check",
     "name": "交之前查"
    },
    {
     "id": "g-environment",
     "name": "工作环境"
    }
   ],
   "features": [
    {
     "id": "f-01",
     "group": "g-read",
     "name": "读懂 PDF",
     "what": "标题、图表标签、脚注、来源和样本量一起读，不拆散",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-02",
     "group": "g-read",
     "name": "指定页和字段",
     "what": "只读、只填我点名的那几页、那几个空",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-03",
     "group": "g-write",
     "name": "做一份正式 PDF",
     "what": "字体、间距、边距、标题层级前后一致",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-04",
     "group": "g-write",
     "name": "改已有的 PDF",
     "what": "处理已有文件里的内容和表单字段",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-05",
     "group": "g-form",
     "name": "填完还能继续填",
     "what": "默认保持可填写，不把字直接贴在页面上",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-06",
     "group": "g-form",
     "name": "对清空和框",
     "what": "列出所有空，再一页页对上页面上能点的框",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-07",
     "group": "g-form",
     "name": "同名的空先问",
     "what": "名字一样、其实不同的空，不硬挂到一起",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-08",
     "group": "g-form",
     "name": "重开核值",
     "what": "存盘后重新打开，每个空的值都要对",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-09",
     "group": "g-form",
     "name": "外观也要对",
     "what": "画出来的样子不空、不旧、不被裁",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-10",
     "group": "g-form",
     "name": "压平成静态件",
     "what": "明确要才做，做完一个能填的框都不留",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-11",
     "group": "g-form",
     "name": "已签的不乱压",
     "what": "已签名的 PDF，没说清楚就不压平",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-12",
     "group": "g-check",
     "name": "逐页转成图看",
     "what": "用 Poppler 把每页转成图，看最后的样子",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-13",
     "group": "g-check",
     "name": "排版清单",
     "what": "没有裁切、重叠、坏表格、黑方块和读不出的字",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-14",
     "group": "g-check",
     "name": "不留占位字",
     "what": "工具留下的引用记号、占位字一律清掉",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-15",
     "group": "g-check",
     "name": "只交一份最终文件",
     "what": "做或改就交 PDF；只问内容就直接回答",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    },
    {
     "id": "f-16",
     "group": "g-environment",
     "name": "缺什么先装",
     "what": "需要的组件缺了就装，装不了说清缺哪个",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-pdf-04",
     "source": "skill-pdf.md 屏 4"
    }
   ],
   "numbers": [
    {
     "id": "n-features",
     "text": "16 项",
     "meaning": "本页 registry.features 条数",
     "as_of": "2026-10-11",
     "source": "本文件",
     "screens": [
      "skill-pdf-04"
     ]
    }
   ],
   "relations": [],
   "highlights": [],
   "mentions": [
    {
     "target": "/skills/md-to-pdf/",
     "screen": "skill-pdf-01",
     "text": "文稿转 PDF"
    },
    {
     "target": "/skills/pdf-render-safe/",
     "screen": "skill-pdf-01",
     "text": "PDF 逐页检查"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-pdf-01",
     "text": "个人正式文书技能"
    },
    {
     "target": "/skills/documents/",
     "screen": "skill-pdf-01",
     "text": "Word 文档"
    },
    {
     "target": "/skills/md-to-pdf/",
     "screen": "skill-pdf-05",
     "text": "文稿转 PDF"
    },
    {
     "target": "/skills/pdf-render-safe/",
     "screen": "skill-pdf-05",
     "text": "PDF 逐页检查"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-pdf-05",
     "text": "个人正式文书技能"
    },
    {
     "target": "/skills/documents/",
     "screen": "skill-pdf-05",
     "text": "Word 文档"
    }
   ],
   "live": []
  },
  "notes": {
   "bar_labels": [
    "做什么",
    "一个例子",
    "怎么做到",
    "能做的事",
    "边界"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-pdf/page.json",
  "sha256": "b126e4ae5076257338bc49f529f23c505dff325f71f51d25b945658eb48c981b",
  "converted_at_beijing": "2026-10-20T07:45:06+08:00"
 }
}
---

::screen{#skill-pdf-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-pdf-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版 4:3 水彩，绿叶风格。一份白色文件像一扇半开的门立在桌上：门的正面是看得见的页面，用浅灰细线代表段落、几个小方框代表表格的空；门后露出一张整齐的清单，一列小方格里有的打着绿色对勾（藏在文件里的表单清单）；一支绿色钢笔正往正面的一个方框里写，只画一道波浪线；几枝嫩绿叶子从右上角垂下。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一张纸上一个打着绿勾的小方框",
  "links": [
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/"
   },
   {
    "text": "PDF 逐页检查",
    "href": "/skills/pdf-render-safe/"
   },
   {
    "text": "个人正式文书技能",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "Word 文档",
    "href": "/skills/documents/"
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
     "text_ref": "PDF 读写和表单",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "60%"
    },
    {
     "type": "prose",
     "text_ref": "读、做、填 PDF：填进去的值真的存住，每一页真的看过，才交。",
     "size": "large",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 9 日 12:57",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 9 次",
       "state": "fact"
      },
      {
       "text": "Codex 自带插件，10 月 10 日的版本",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用小记录（10 月 4 日 23:52 起 7 天，记到 10 月 11 日零点）；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "PDF 有两层：看得见的页面，和藏在文件里、记着“有哪些空、各填了什么”的表单清",
     "row": "hero"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "row": "hero",
     "width": "40%"
    },
    {
     "type": "section_heading",
     "text_ref": "可以这样说：",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“这份报告第三章的结论和图表数字整理给我。”",
     "split_paras": true,
     "columns": 2,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "tail": true,
     "row_counts": [
      2,
      2,
      1
     ]
    },
    {
     "type": "notice",
     "text_ref": "只想把 Markdown 转成 PDF",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    }
   ],
   "notes": "首屏文字与完整插画并排；手机使用整宽图文、单列对话。单个提示条使用本屏图标槽 1。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "PDF 读写和表单",
     "align": "left",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "读、做、填 PDF：填进去的值真的存住，每一页真的看过，才交。",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 9 日 12:57",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 用了 9 次",
       "state": "fact"
      },
      {
       "text": "Codex 自带插件，10 月 10 日的版本",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 11 日 · AI 使用小记录（10 月 4 日 23:52 起 7 天，记到 10 月 11 日零点）；本轮用量 Unknown（账本未覆盖完整观察期，保留原值和日期）"
    },
    {
     "type": "prose",
     "text_ref": "PDF 有两层：看得见的页面，和藏在文件里、记着“有哪些空、各填了什么”的表单清"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "banner"
    },
    {
     "type": "section_heading",
     "text_ref": "可以这样说：",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "“这份报告第三章的结论和图表数字整理给我。”",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "left",
      "left",
      "left",
      "left",
      "left"
     ],
     "tail": true
    },
    {
     "type": "notice",
     "text_ref": "只想把 Markdown 转成 PDF",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    }
   ],
   "notes": "首屏文字与完整插画并排；手机使用整宽图文、单列对话。单个提示条使用本屏图标槽 1。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "一张纸上一个打着绿勾的小方框",
   "source_phrase": "一张纸上一个打着绿勾的小方框",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready",
   "verified_no_text": true
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/skills-new-20261012/pdf/pdf-01-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。一份白色文件像一扇半开的门立在桌上：门的正面是看得见的页面，用浅灰细线代表段落、几个小方框代表表格的空；门后露出一张整齐的清单，一列小方格里有的打着绿色对勾（藏在文件里的表单清单）；一支绿色钢笔正往正面的一个方框里写，只画一道波浪线；几枝嫩绿叶子从右上角垂下。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。一份白色文件像一扇半开的门立在桌上：门的正面是看得见的页面，用浅灰细线代表段落、几个小方框代表表格的空；门后露出一张整齐的清单，一列小方格里有的打着绿色对勾（藏在文件里的表单清单）；一支绿色钢笔正往正面的一个方框里写，只画一道波浪线；几枝嫩绿叶子从右上角垂下。画面里不出现任何文字。",
   "sha256": "6b8879e24a034f595ffb30542414b0fb906a92fad82f526d626181da9a462516",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

# PDF 读写和表单
**读、做、填 PDF：填进去的值真的存住，每一页真的看过，才交。**

PDF 有两层：看得见的页面，和藏在文件里、记着“有哪些空、各填了什么”的表单清单。这个技能告诉 AI：读的时候把页码、表格、图注、脚注一起读，不拆散；做的时候字体、边距、层级排整齐；填表单默认保持能继续填，填完重新打开核对值，再把每一页转成图看。只有我明确要固定成不能改的样子，才“压平”。

可以这样说：
“这份报告第三章的结论和图表数字整理给我。”
“这张申请表按这些信息填好，以后还要能改。”
“把这些内容做成一份正式的 PDF。”
“填好的表重新打开看看，值是不是都存住了。”
“这张表填完压平，对方只看不改。”

只想把 Markdown 转成 PDF，用〔文稿转 PDF〕；只想把 PDF 摊开看排版、留检查报告，用〔PDF 逐页检查〕；我自己的合同、协议要签名、记交出，用〔个人正式文书技能〕。

::screen{#skill-pdf-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-pdf-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版 4:3 水彩，绿叶风格。一张三页的申请表在桌上摊开，页面上的方框里画着淡绿波浪线代表填好的内容；第一页和第三页各有一个长得一模一样的空框，两框之间连着一根细线，线中间亮着一盏小小的黄色信号灯（先停下）；旁边一只手把其中一页轻轻翻开（重新打开核对）；桌角几片绿叶。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一盏亮着黄灯的小信号灯",
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
     "align": "left",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "示例：",
     "tone": "gray",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "right",
      "left",
      "right",
      "left"
     ],
     "tail": true,
     "row": "example",
     "width": "64%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "row": "example",
     "width": "36%"
    },
    {
     "type": "points_card",
     "text_ref": "背后发生了什么",
     "columns": 1,
     "inner_columns": 2,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "对话保留原顺序和示例声明；完整插画独立放置；背后步骤在桌面两列、手机整宽。示例提示使用图标槽 1。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "left",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "示例：",
     "tone": "gray",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "split_paras": true,
     "columns": 1,
     "sides": [
      "right",
      "left",
      "right",
      "left"
     ],
     "tail": true
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "banner"
    },
    {
     "type": "points_card",
     "text_ref": "背后发生了什么",
     "columns": 1,
     "inner_columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "对话保留原顺序和示例声明；完整插画独立放置；背后步骤在桌面两列、手机整宽。示例提示使用图标槽 1。"
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
   "asset": "_library/skills-new-20261012/pdf/pdf-icon-02-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "一盏亮着黄灯的小信号灯",
   "source_phrase": "一盏亮着黄灯的小信号灯",
   "sha256": "ddc9e101bc030387ac6b494a3095f7af1c977ca22a8f76c6a5cd1dc484ce7fc3",
   "status": "ready",
   "verified_no_text": true
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/skills-new-20261012/pdf/pdf-02-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。一张三页的申请表在桌上摊开，页面上的方框里画着淡绿波浪线代表填好的内容；第一页和第三页各有一个长得一模一样的空框，两框之间连着一根细线，线中间亮着一盏小小的黄色信号灯（先停下）；旁边一只手把其中一页轻轻翻开（重新打开核对）；桌角几片绿叶。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。一张三页的申请表在桌上摊开，页面上的方框里画着淡绿波浪线代表填好的内容；第一页和第三页各有一个长得一模一样的空框，两框之间连着一根细线，线中间亮着一盏小小的黄色信号灯（先停下）；旁边一只手把其中一页轻轻翻开（重新打开核对）；桌角几片绿叶。画面里不出现任何文字。",
   "sha256": "ea62c12f0d27819eb6229fa6d30a54f8ee91fd71656abc2960277db1e2232cd9",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 一个完整例子
示例：照这个技能的做法写的，不是某一次的记录。

我：“这份 3 页的申请表按这些信息填好，要能继续改，别把字直接贴在页面上。”
AI：“先停一下问你：第 1 页和第 3 页各有一个叫‘日期’的空，名字一样，其实是两个不同的空，一个是申请日期、一个是签署日期。你只给了一个日期，另一个填什么？”
我：“签署日期留空，我手写。”
AI：“好了，表单还能继续填。重新打开核对过：值都存在文件里，页面上显示的和存的一样；3 页都转成图看过，没有字被框裁掉。签署日期留空。”

**背后发生了什么**
1. 先列出文件里所有表单空，再一页页找出页面上能点的框，对上谁是谁。
2. 两个同名的空其实是不同的对象，不硬挂到一起，先问清楚。
3. 填完存盘再重新打开：每个空的值对不对，页面上画出来的样子是不是新的、有没有被裁。
4. 每页转成图看最后的样子；只交这一份填好的 PDF。

::screen{#skill-pdf-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-pdf-03",
  "section": "examples",
  "title": "怎么做到的",
  "scene": "横版 4:3 水彩，绿叶风格。两块透明玻璃板一上一下叠着悬在桌面上方：上面一块是页面（浅灰段落线和几个方框），下面一块是一张清单（一列小方格，有的打了绿勾）；一根细细的绿藤从上层的每个方框垂下，连到下层对应的方格；画面右侧一只小熨斗正把一张纸压得平平整整。周围点缀绿叶。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "两块叠在一起的透明板，中间一根绿藤相连",
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
     "text_ref": "怎么做到的：两层都要看",
     "align": "left",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "页面那一层",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ],
     "row": "method",
     "width": "58%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "row": "method",
     "width": "42%"
    },
    {
     "type": "content_card",
     "text_ref": "清单那一层（AcroForm）",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "principles",
     "width": "33.333333333333336%"
    },
    {
     "type": "content_card",
     "text_ref": "能点的框和画出来的样子",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "principles",
     "width": "33.333333333333336%"
    },
    {
     "type": "content_card",
     "text_ref": "压平：明确要才做",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "principles",
     "width": "33.333333333333336%"
    }
   ],
   "notes": "第一项做法与插画并排，另外三项使用完整卡片；手机各块整宽，插画保留 4:3。第一项做法使用图标槽 1。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎么做到的：两层都要看",
     "align": "left",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "页面那一层",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "banner"
    },
    {
     "type": "content_card",
     "text_ref": "清单那一层（AcroForm）",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "能点的框和画出来的样子",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "压平：明确要才做",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    }
   ],
   "notes": "第一项做法与插画并排，另外三项使用完整卡片；手机各块整宽，插画保留 4:3。第一项做法使用图标槽 1。"
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
   "asset": "_library/skills-new-20261012/pdf/pdf-icon-03-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "两块叠在一起的透明板，中间一根绿藤相连",
   "source_phrase": "两块叠在一起的透明板，中间一根绿藤相连",
   "sha256": "e0af31b093df5c73a3e68c09a421e1b8ded0d5d4d1e2c034c1a0587c50f6916f",
   "status": "ready",
   "verified_no_text": true
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/skills-new-20261012/pdf/pdf-03-v03.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。两块透明玻璃板一上一下叠着悬在桌面上方：上面一块是页面（浅灰段落线和几个方框），下面一块是一张清单（一列小方格，有的打了绿勾）；一根细细的绿藤从上层的每个方框垂下，连到下层对应的方格；画面右侧一只小熨斗正把一张纸压得平平整整。周围点缀绿叶。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。两块透明玻璃板一上一下叠着悬在桌面上方：上面一块是页面（浅灰段落线和几个方框），下面一块是一张清单（一列小方格，有的打了绿勾）；一根细细的绿藤从上层的每个方框垂下，连到下层对应的方格；画面右侧一只小熨斗正把一张纸压得平平整整。周围点缀绿叶。画面里不出现任何文字。",
   "sha256": "92794254164af3bfb2606b096ab3eaed6ff3da19cdfd433386ed0b4d614d23a1",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 怎么做到的：两层都要看

**页面那一层**
每页转成图看：字体、间距、边距一致，没有裁切、重叠、断开的表格、黑方块、读不出的字，也没留下占位字。文字能抽出来，不说明页面对。

**清单那一层（AcroForm）**
AcroForm 就是 PDF 里记“这份表有哪些空、各填了什么”的那张清单。页面上看得见字，不代表清单里真存了；重新打开读出来的值对，才算填好。

**能点的框和画出来的样子**
每个空落到页面上是一个能点的框（Widget），阅读器靠一段“外观”把值画出来。值对了、外观却是空的或旧的，对方看到的还是错的，所以两样都核。

**压平：明确要才做**
压平是把当前样子画死在页面上，删掉所有能填的框和清单。只在我说要静态件时做，做完重开确认一个能填的框都不剩。已签名的 PDF，没说清楚就不压。

::screen{#skill-pdf-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-pdf-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版 4:3 水彩，绿叶风格。一只打开的浅木色工具箱，分格里摆着：一枚放大镜、一支绿色钢笔、一把木尺、几枚纸夹、一枚圆形印章、一只小熨斗、一叠页面缩略图；工具箱四周散落几片嫩绿叶子。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一只打开的小工具箱，里面露出一枚放大镜",
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
     "text_ref": "能做的事（16 项）",
     "align": "left",
     "size": "large",
     "row": "features-head",
     "width": "68%",
     "row_fit_illustration": true
    },
    {
     "type": "status_legend",
     "text_ref": "图例：",
     "columns": 6,
     "portrait_columns": 3,
     "row": "features-head"
    },
    {
     "type": "prose",
     "text_ref": "说不准＝",
     "row": "features-head"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "row": "features-head",
     "width": "32%"
    },
    {
     "type": "section_heading",
     "text_ref": "读",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1. 读懂 PDF｜标题、图表标签、脚注、来源和样本量一起读，不拆散｜说不准",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "做和改",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "3. 做一份正式 PDF｜字体、间距、边距、标题层级前后一致｜说不准",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "填表单",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "5. 填完还能继续填｜默认保持可填写，不把字直接贴在页面上｜说不准",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "交之前查",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "12. 逐页转成图看｜用 Poppler 把每页转成图，看最后的样子｜说不准",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "工作环境",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "16. 缺什么先装｜需要的组件缺了就装，装不了说清缺哪个｜说不准",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "notice",
     "text_ref": "Poppler 是一套",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    }
   ],
   "notes": "按稿件组序和功能编号排；桌面三列、手机一列，保持完整字号和正文。图例说明与工具箱插画并排；屏末完整限制/环境说明使用图标槽 1。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事（16 项）",
     "align": "left",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：",
     "columns": 6,
     "portrait_columns": 3
    },
    {
     "type": "prose",
     "text_ref": "说不准＝"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "banner"
    },
    {
     "type": "section_heading",
     "text_ref": "读",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1. 读懂 PDF｜标题、图表标签、脚注、来源和样本量一起读，不拆散｜说不准",
     "columns": 1,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "做和改",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "3. 做一份正式 PDF｜字体、间距、边距、标题层级前后一致｜说不准",
     "columns": 1,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "填表单",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "5. 填完还能继续填｜默认保持可填写，不把字直接贴在页面上｜说不准",
     "columns": 1,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "交之前查",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "12. 逐页转成图看｜用 Poppler 把每页转成图，看最后的样子｜说不准",
     "columns": 1,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "section_heading",
     "text_ref": "工作环境",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "16. 缺什么先装｜需要的组件缺了就装，装不了说清缺哪个｜说不准",
     "columns": 1,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "none",
     "icons": "none",
     "connector": "none",
     "last_row": "fill"
    },
    {
     "type": "notice",
     "text_ref": "Poppler 是一套",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    }
   ],
   "notes": "按稿件组序和功能编号排；桌面三列、手机一列，保持完整字号和正文。图例说明与工具箱插画并排；屏末完整限制/环境说明使用图标槽 1。"
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
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "一只打开的小工具箱，里面露出一枚放大镜",
   "source_phrase": "一只打开的小工具箱，里面露出一枚放大镜",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready",
   "verified_no_text": true
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/skills-new-20261012/pdf/pdf-04-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。一只打开的浅木色工具箱，分格里摆着：一枚放大镜、一支绿色钢笔、一把木尺、几枚纸夹、一枚圆形印章、一只小熨斗、一叠页面缩略图；工具箱四周散落几片嫩绿叶子。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。一只打开的浅木色工具箱，分格里摆着：一枚放大镜、一支绿色钢笔、一把木尺、几枚纸夹、一枚圆形印章、一只小熨斗、一叠页面缩略图；工具箱四周散落几片嫩绿叶子。画面里不出现任何文字。",
   "sha256": "d9bc31e4df6a7580621e4dbf4473a8fb1323810a948be1b351c917f55e56dec3",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 能做的事（16 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
说不准＝技能里写着这一项，但 AI 的使用记录只记“用了这个技能”，看不出用到了哪一项、做没做成；写这页时也没有真的处理 PDF。

**读**
1. 读懂 PDF｜标题、图表标签、脚注、来源和样本量一起读，不拆散｜说不准
2. 指定页和字段｜只读、只填我点名的那几页、那几个空｜说不准

**做和改**
3. 做一份正式 PDF｜字体、间距、边距、标题层级前后一致｜说不准
4. 改已有的 PDF｜处理已有文件里的内容和表单字段｜说不准

**填表单**
5. 填完还能继续填｜默认保持可填写，不把字直接贴在页面上｜说不准
6. 对清空和框｜列出所有空，再一页页对上页面上能点的框｜说不准
7. 同名的空先问｜名字一样、其实不同的空，不硬挂到一起｜说不准
8. 重开核值｜存盘后重新打开，每个空的值都要对｜说不准
9. 外观也要对｜画出来的样子不空、不旧、不被裁｜说不准
10. 压平成静态件｜明确要才做，做完一个能填的框都不留｜说不准
11. 已签的不乱压｜已签名的 PDF，没说清楚就不压平｜说不准

**交之前查**
12. 逐页转成图看｜用 Poppler 把每页转成图，看最后的样子｜说不准
13. 排版清单｜没有裁切、重叠、坏表格、黑方块和读不出的字｜说不准
14. 不留占位字｜工具留下的引用记号、占位字一律清掉｜说不准
15. 只交一份最终文件｜做或改就交 PDF；只问内容就直接回答｜说不准

**工作环境**
16. 缺什么先装｜需要的组件缺了就装，装不了说清缺哪个｜说不准

Poppler 是一套常用的开源 PDF 工具，这里用它把页面转成图。中间文件放在临时文件夹、用完清理，最终文件起稳定、看得懂的名字。

::screen{#skill-pdf-05 section="boundaries"}

```typeset
{
 "screen": {
  "id": "skill-pdf-05",
  "section": "boundaries",
  "title": "边界",
  "scene": "横版 4:3 水彩，绿叶风格。林间一个小岔路口，中间立着一块空白的木制指路牌，伸出四块不写字的箭头木板；四条小路尽头各放着一样东西：一台小小的打印机、一叠摊成网格的页面缩略图、一卷系着绿丝带的卷轴、一张蓝色细边的文稿纸；指路牌脚下放着一张带方框的表格纸。周围是嫩绿树丛和落叶。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一块空白的木制指路牌",
  "links": [
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/"
   },
   {
    "text": "PDF 逐页检查",
    "href": "/skills/pdf-render-safe/"
   },
   {
    "text": "个人正式文书技能",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "Word 文档",
    "href": "/skills/documents/"
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
     "align": "left",
     "size": "large",
     "row": "boundary-head",
     "width": "60%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "row": "boundary-head",
     "width": "40%"
    },
    {
     "type": "content_card",
     "text_ref": "交给它",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "division",
     "width": "38%"
    },
    {
     "type": "table",
     "text_ref": "分工：该用哪个",
     "columns": 2,
     "heading_size": "medium",
     "illustration": "none",
     "icons": "none",
     "row": "division",
     "width": "62%"
    },
    {
     "type": "prose",
     "text_ref": "〔PDF 逐页检查〕和这里"
    },
    {
     "type": "points_card",
     "text_ref": "它不做",
     "columns": 1,
     "inner_columns": 2,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "notice",
     "text_ref": "它是 Codex 自带的",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    }
   ],
   "notes": "交给它与分工表桌面双栏，手机整宽；限制与插件来源完整保留。来源提示使用图标槽 1，指路牌插画独立显示。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "left",
     "size": "large"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center",
     "size": "banner"
    },
    {
     "type": "content_card",
     "text_ref": "交给它",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "table",
     "text_ref": "分工：该用哪个",
     "columns": 1,
     "heading_size": "medium",
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "prose",
     "text_ref": "〔PDF 逐页检查〕和这里"
    },
    {
     "type": "points_card",
     "text_ref": "它不做",
     "columns": 1,
     "inner_columns": 1,
     "whole_block": true,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "notice",
     "text_ref": "它是 Codex 自带的",
     "tone": "green",
     "illustration": "left_inside",
     "icon_indices": [
      1
     ]
    }
   ],
   "notes": "交给它与分工表桌面双栏，手机整宽；限制与插件来源完整保留。来源提示使用图标槽 1，指路牌插画独立显示。"
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
   "asset": "_library/icons/岔路.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "一块空白的木制指路牌",
   "source_phrase": "一块空白的木制指路牌",
   "sha256": "60c8c99a88b19baf8d010994b8a9b34841a6138e79791cbeef9e79686267047a",
   "status": "ready",
   "verified_no_text": true
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/skills-new-20261012/pdf/pdf-05-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。林间一个小岔路口，中间立着一块空白的木制指路牌，伸出四块不写字的箭头木板；四条小路尽头各放着一样东西：一台小小的打印机、一叠摊成网格的页面缩略图、一卷系着绿丝带的卷轴、一张蓝色细边的文稿纸；指路牌脚下放着一张带方框的表格纸。周围是嫩绿树丛和落叶。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。林间一个小岔路口，中间立着一块空白的木制指路牌，伸出四块不写字的箭头木板；四条小路尽头各放着一样东西：一台小小的打印机、一叠摊成网格的页面缩略图、一卷系着绿丝带的卷轴、一张蓝色细边的文稿纸；指路牌脚下放着一张带方框的表格纸。周围是嫩绿树丛和落叶。画面里不出现任何文字。",
   "sha256": "4bf86bc6d0a447801dd2540276d1ed5cf76bf0829cfb82ab29bd77fa1d8e81a8",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 边界

**交给它**
- 读版面要紧的 PDF，页码、表格、脚注要对得上
- 做一份正式 PDF，字体、页码要整齐
- 填 PDF 表单，以后还要能继续填
- 填好后固定成不能改的静态件

**分工：该用哪个**
| 想做的事 | 用哪个 |
|---|---|
| Markdown 文稿转成 PDF，查页数和必须有的字 | 〔文稿转 PDF〕 |
| 已有 PDF 只想摊成逐页图、留版本和检查报告 | 〔PDF 逐页检查〕，只看不改 |
| 我自己的合同、协议、通知，要签名、记交出 | 〔个人正式文书技能〕 |
| 要改的是 Word 源文件 | 〔Word 文档〕 |

〔PDF 逐页检查〕和这里都会把页面转成图看；它多了固定的运行环境和每一版的检查报告，但不改 PDF、也不管表单里的值。

**它不做**
- 不判断内容对不对：页面和清单都对，不代表写的事实没错
- 不擅自压平：没说要静态件，就一直保持能填
- 不拿旧东西冒充：旧的页面图、“命令成功”、抽出来的文字，都不算这次查过

它是 Codex 自带的 PDF 插件（10 月 10 日的版本 26.1009.11318），不是我自己写的技能；近 7 天的 9 次都是 Codex 用的，Claude 那边有没有同样的能力，这次没查清。使用记录只说明用到了，不说明每次都做成了。
