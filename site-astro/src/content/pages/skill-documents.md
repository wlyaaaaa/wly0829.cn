---
{
 "title": "Word 文档",
 "kind": "skill",
 "url": "/skills/documents/",
 "tagline": "做能接着改的 Word，每一页都看过再交。",
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
  "page": "skill-documents",
  "kind": "skill",
  "title": "Word 文档",
  "url": "/skills/documents/",
  "tagline": "做能接着改的 Word，每一页都看过再交。",
  "status": "",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-11 15:48"
   },
   "facts": [
    "10 月 18—24 日 AI 用了 0 次",
    "Codex 自带插件，10 月 30 日核对本机可用的是 26.1020.11618 版"
   ],
   "as_of": "2026-10-21",
   "source": "状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-11 15:48取这段已完成账本中的最近事件，不限于7天。这里的次数0次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。插件版本另按2026-10-30本机可发现的26.1020.11618记录，只证明宿主能找到，不代表新版业务验收。次数和时间只表示已记录调用，不证明业务效果。"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "draft": "skill-documents.md",
   "plugin_version": "26.1020.11618",
   "checked_beijing": "2026-10-11"
  },
  "video_prompt": "",
  "registry": {
   "groups": [
    {
     "id": "g-write",
     "name": "写和改"
    },
    {
     "id": "g-review",
     "name": "审阅和版本"
    },
    {
     "id": "g-structure",
     "name": "目录和结构"
    },
    {
     "id": "g-form",
     "name": "表单和转交"
    },
    {
     "id": "g-check",
     "name": "交之前查"
    }
   ],
   "features": [
    {
     "id": "f-01",
     "group": "g-write",
     "name": "新建 Word",
     "what": "开头讲清主题、用途和读者要做什么，不编事实",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-02",
     "group": "g-write",
     "name": "只改该改的",
     "what": "保留原来的结构、样式和可编辑性，就地改",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-03",
     "group": "g-write",
     "name": "先挑模板",
     "what": "没给参考时，能挑就先给一次选择，取消也照常做",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-04",
     "group": "g-write",
     "name": "照模板或参考做",
     "what": "原模板留着，不拿通用样式盖掉",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-05",
     "group": "g-write",
     "name": "能编辑的公式",
     "what": "要能改就用 Word 自己的公式；改用图片会说明",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-06",
     "group": "g-review",
     "name": "真批注",
     "what": "加在 Word 的批注栏里，指向具体的字句",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-07",
     "group": "g-review",
     "name": "修订痕迹",
     "what": "谁改了什么都留着；要干净版时按要求接受或拒绝",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-08",
     "group": "g-review",
     "name": "两版对比",
     "what": "两版各出页面图，再给差异图和文字差异",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-09",
     "group": "g-structure",
     "name": "目录、编号、脚注",
     "what": "按标题层级维护，正文改了跟着对上",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-10",
     "group": "g-structure",
     "name": "内部跳转和交叉引用",
     "what": "“见第 2 节”“见表 3”点得过去、对得上",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-11",
     "group": "g-structure",
     "name": "分节和页面布局",
     "what": "不同节用不同的纸向、页边和页眉页脚",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-12",
     "group": "g-structure",
     "name": "合并几份文档",
     "what": "正文、表格、编号和大部分格式都留着",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-13",
     "group": "g-structure",
     "name": "表格互转",
     "what": "Excel 表放进 Word 表格；Word 里一张表导出成 CSV",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-14",
     "group": "g-form",
     "name": "可填写的字段",
     "what": "做成 Word 真能填的空，纯文字字段最稳",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-15",
     "group": "g-form",
     "name": "限制编辑",
     "what": "只读、只许批注、只许修订或只许填表",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-16",
     "group": "g-form",
     "name": "无障碍检查",
     "what": "查标题层级、图片说明、表头和链接文字",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-17",
     "group": "g-form",
     "name": "遮盖指定文字",
     "what": "在副本里精确匹配、等长遮住，原件不动",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-18",
     "group": "g-form",
     "name": "清作者信息、管水印",
     "what": "清掉作者等记录；按需加水印或去水印",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-19",
     "group": "g-check",
     "name": "逐页看图",
     "what": "每批重要修改后全部页转成图，最后一轮每页都看",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-20",
     "group": "g-check",
     "name": "交成 Google 文档",
     "what": "先验好本地 Word、清掉标题边框，再导入成在线文档",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    },
    {
     "id": "f-21",
     "group": "g-check",
     "name": "只交要的",
     "what": "只要 Word 就只给 Word，检查用的图留在内部",
     "how": "交给 AI 按本页做法处理",
     "status": "说不准",
     "screen": "skill-documents-04",
     "source": "skill-documents.md 屏 4"
    }
   ],
   "numbers": [
    {
     "id": "n-features",
     "text": "21 项",
     "meaning": "本页 registry.features 条数",
     "as_of": "2026-10-11",
     "source": "本文件",
     "screens": [
      "skill-documents-04"
     ]
    }
   ],
   "relations": [],
   "highlights": [],
   "mentions": [
    {
     "target": "/skills/documents/",
     "screen": "skill-documents-01",
     "text": "Word 文档"
    },
    {
     "target": "/skills/pdf/",
     "screen": "skill-documents-01",
     "text": "PDF 读写和表单"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-documents-01",
     "text": "个人正式文书技能"
    },
    {
     "target": "/skills/md-to-pdf/",
     "screen": "skill-documents-01",
     "text": "文稿转 PDF"
    },
    {
     "target": "/skills/personal-formal-documents/",
     "screen": "skill-documents-05",
     "text": "个人正式文书技能"
    },
    {
     "target": "/skills/pdf/",
     "screen": "skill-documents-05",
     "text": "PDF 读写和表单"
    },
    {
     "target": "/skills/md-to-pdf/",
     "screen": "skill-documents-05",
     "text": "文稿转 PDF"
    },
    {
     "target": "/skills/pdf-render-safe/",
     "screen": "skill-documents-05",
     "text": "PDF 逐页检查"
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
  },
  "source_kind": "host_integrated"
 },
 "source": {
  "page": "sources/pages/skill-documents/page.json",
  "sha256": "ab0ea7b3e9aff760eac6b2db54c6ada622b40706a2cad12b27d08004dccccac2",
  "converted_at_beijing": "2026-10-30T14:00:58+08:00"
 }
}
---

::screen{#skill-documents-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-documents-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "横版 4:3 水彩，绿叶风格。一张折角的白色文稿纸摊在浅木色桌面上，纸上用浅灰细线代表段落、用淡绿细格代表一张小表格，页边贴着两三张淡黄色小便签（表示批注）；纸旁斜放一支绿色钢笔；右侧一叠同样的纸页像扑克牌一样扇形摊开，每页右上角一个小小的绿色对勾；几枝嫩绿叶子从左上角垂进画面。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一张折角的文稿纸，角上落着一片嫩绿叶子",
  "links": [
   {
    "text": "Word 文档",
    "href": "/skills/documents/"
   },
   {
    "text": "PDF 读写和表单",
    "href": "/skills/pdf/"
   },
   {
    "text": "个人正式文书技能",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/"
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
     "text_ref": "Word 文档",
     "align": "left",
     "size": "large",
     "row": "hero",
     "width": "60%"
    },
    {
     "type": "prose",
     "text_ref": "做能接着改的 Word：样式、表格、批注都留着，每一页都看过再交。",
     "size": "large",
     "bold": true,
     "row": "hero"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 11 日 15:48",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 0 次",
       "state": "fact"
      },
      {
       "text": "Codex 自带插件，10 月 30 日核对本机可用的是 26.1020.11618 版",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 21 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-11 15:48取这段已完成账本中的最近事件，不限于7天。这里的次数0次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。插件版本另按2026-10-30本机可发现的26.1020.11618记录，只证明宿主能找到，不代表新版业务验收。次数和时间只表示已记录调用，不证明业务效果。",
     "row": "hero"
    },
    {
     "type": "prose",
     "text_ref": "Word 文件能打开、文字抽得出来，页面上照样可能表格断成两半、字体换了、页眉错",
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
     "text_ref": "“照这份参考写一份 Word 说明，以后我还要改。”",
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
     "text_ref": "Word 文档",
     "align": "left",
     "size": "large"
    },
    {
     "type": "prose",
     "text_ref": "做能接着改的 Word：样式、表格、批注都留着，每一页都看过再交。",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次使用 10 月 11 日 15:48",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 0 次",
       "state": "fact"
      },
      {
       "text": "Codex 自带插件，10 月 30 日核对本机可用的是 26.1020.11618 版",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 21 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-11 15:48取这段已完成账本中的最近事件，不限于7天。这里的次数0次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。插件版本另按2026-10-30本机可发现的26.1020.11618记录，只证明宿主能找到，不代表新版业务验收。次数和时间只表示已记录调用，不证明业务效果。"
    },
    {
     "type": "prose",
     "text_ref": "Word 文件能打开、文字抽得出来，页面上照样可能表格断成两半、字体换了、页眉错"
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
     "text_ref": "“照这份参考写一份 Word 说明，以后我还要改。”",
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
   "asset": "_library/icons/白纸.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "一张折角的文稿纸，角上落着一片嫩绿叶子",
   "source_phrase": "一张折角的文稿纸，角上落着一片嫩绿叶子",
   "sha256": "e010ca7001948622ae4e18db3eea512568d933314d2ef2a8d4249bdb31d7d41e",
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
   "asset": "_library/skills-new-20261012/word/word-01-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。一张折角的白色文稿纸摊在浅木色桌面上，纸上用浅灰细线代表段落、用淡绿细格代表一张小表格，页边贴着两三张淡黄色小便签（表示批注）；纸旁斜放一支绿色钢笔；右侧一叠同样的纸页像扑克牌一样扇形摊开，每页右上角一个小小的绿色对勾；几枝嫩绿叶子从左上角垂进画面。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。一张折角的白色文稿纸摊在浅木色桌面上，纸上用浅灰细线代表段落、用淡绿细格代表一张小表格，页边贴着两三张淡黄色小便签（表示批注）；纸旁斜放一支绿色钢笔；右侧一叠同样的纸页像扑克牌一样扇形摊开，每页右上角一个小小的绿色对勾；几枝嫩绿叶子从左上角垂进画面。画面里不出现任何文字。",
   "sha256": "5cdea3f114a6b5ef6de0a5ad4f313deac4c21b7297175d70b433a40901dd4794",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

# Word 文档
**做能接着改的 Word：样式、表格、批注都留着，每一页都看过再交。**

Word 文件能打开、文字抽得出来，页面上照样可能表格断成两半、字体换了、页眉错位。这个技能告诉 AI 怎么新建或修改 Word：先看原来的样子，只动该动的地方；批注、修订、目录、脚注、可填写的字段都保留成 Word 真能用的样子；每改一批，就把所有页转成图看一遍，最后一轮每页都看过才交给我。

可以这样说：
“照这份参考写一份 Word 说明，以后我还要改。”
“只改第三节，别的格式一点都别动。”
“这两版比一下，改了哪些地方列出来。”
“修订全部接受，批注删掉，给我一份干净版。”
“做成对方只能填这几栏、别的改不了的 Word。”

只想把 Markdown 转成 PDF，用〔文稿转 PDF〕；已经是 PDF 的文件，用〔PDF 读写和表单〕；我自己的合同、协议要签名、记交出，用〔个人正式文书技能〕。

::screen{#skill-documents-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-documents-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "横版 4:3 水彩，绿叶风格。两张文稿纸并排立在桌上：左边那张页边贴着几张淡黄便签、几处淡红的划线和淡绿的插入线（工作版），右边那张干干净净（干净版）；两张纸前面一枚放大镜，正对着一张跨页断开、被一根细细的绿藤重新接上的表格；桌角一小叠页面缩略图，最上面一张有绿色对勾。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "两张并排的纸，一张贴着便签，一张干干净净",
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
   "asset": "_library/skills-new-20261012/word/word-icon-02-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "两张并排的纸，一张贴着便签，一张干干净净",
   "source_phrase": "两张并排的纸，一张贴着便签，一张干干净净",
   "sha256": "c85c6eeceeacc595a3158071fa86f331c9b6da7eb173ea792173a4ce179d429e",
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
   "asset": "_library/skills-new-20261012/word/word-02-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。两张文稿纸并排立在桌上：左边那张页边贴着几张淡黄便签、几处淡红的划线和淡绿的插入线（工作版），右边那张干干净净（干净版）；两张纸前面一枚放大镜，正对着一张跨页断开、被一根细细的绿藤重新接上的表格；桌角一小叠页面缩略图，最上面一张有绿色对勾。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。两张文稿纸并排立在桌上：左边那张页边贴着几张淡黄便签、几处淡红的划线和淡绿的插入线（工作版），右边那张干干净净（干净版）；两张纸前面一枚放大镜，正对着一张跨页断开、被一根细细的绿藤重新接上的表格；桌角一小叠页面缩略图，最上面一张有绿色对勾。画面里不出现任何文字。",
   "sha256": "8dfe93a10b0dc51adaf513dd43744038dcf87da2a83acc33724bf7b69caccbcc",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 一个完整例子
示例：照这个技能的做法写的，不是某一次的记录。

我：“这份活动方案的 Word，把第三节的预算改成新数字，批注都留着；再给我一份干净版发给大家。”
AI：“两份都好了。工作版只动了第三节的预算表和两句说明，批注都在、指向的位置没变；干净版接受了修订、去掉了批注。改完后预算表跨页断开了一行，已经调好，全部页重新看过。批注在页面图里看不出来，我另外打开文件内部核对过。”

**背后发生了什么**
1. 先读原文件的结构和样式，确认这次只改第三节，其余不碰。
2. 普通文字和表格用能保留格式的办法改；批注、修订这类要动文件内部结构的，用插件自带的工具。
3. 所有页转成图，每页按原大小看字体、裁切、重叠、表格跨页和页眉页脚；有问题回去改源文件，再看全部页。
4. 干净版另存一份，工作版原样留着；最后只交这两份 Word，检查用的图和调试文件留在内部。

::screen{#skill-documents-03 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-documents-03",
  "section": "examples",
  "title": "怎么做到的",
  "scene": "横版 4:3 水彩，绿叶风格。从左到右三样东西：一张半透明的描图纸正盖在一张旧文稿上、边角对齐（照原样改）；一排页面缩略图像胶片一样横着排开，一枚放大镜停在其中一页上；一个半开的小木抽屉，里面露出一叠淡黄便签（藏在文件里的批注）。三样东西之间点缀几片绿叶和一根细藤。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一排胶片样的页面缩略图，上面停着一枚放大镜",
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
     "text_ref": "怎么做到的",
     "align": "left",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "先看原来的样子",
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
     "text_ref": "每改一批，全部页看一遍",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "principles",
     "width": "33.333333333333336%"
    },
    {
     "type": "content_card",
     "text_ref": "批注和修订另外查",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none",
     "row": "principles",
     "width": "33.333333333333336%"
    },
    {
     "type": "content_card",
     "text_ref": "没给样子时的默认",
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
     "text_ref": "怎么做到的",
     "align": "left",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "先看原来的样子",
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
     "text_ref": "每改一批，全部页看一遍",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "批注和修订另外查",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "icons": "none"
    },
    {
     "type": "content_card",
     "text_ref": "没给样子时的默认",
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
   "asset": "_library/skills-new-20261012/word/word-icon-03-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "一排胶片样的页面缩略图，上面停着一枚放大镜",
   "source_phrase": "一排胶片样的页面缩略图，上面停着一枚放大镜",
   "sha256": "72d3703e13eee7cc7c6e6b8189457a3b50ae7475666f52662f0f0072228820cd",
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
   "asset": "_library/skills-new-20261012/word/word-03-v02.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。从左到右三样东西：一张半透明的描图纸正盖在一张旧文稿上、边角对齐（照原样改）；一排页面缩略图像胶片一样横着排开，一枚放大镜停在其中一页上；一个半开的小木抽屉，里面露出一叠淡黄便签（藏在文件里的批注）。三样东西之间点缀几片绿叶和一根细藤。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。从左到右三样东西：一张半透明的描图纸正盖在一张旧文稿上、边角对齐（照原样改）；一排页面缩略图像胶片一样横着排开，一枚放大镜停在其中一页上；一个半开的小木抽屉，里面露出一叠淡黄便签（藏在文件里的批注）。三样东西之间点缀几片绿叶和一根细藤。画面里不出现任何文字。",
   "sha256": "d95d5b253d77e4ee59a8799f61bd2cc446e711fa85534253587f53084ecd2356",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 怎么做到的

**先看原来的样子**
有模板、参考或旧文件，就照它的结构和样式改，只动该动的地方，不拿通用样式盖掉。没给任何样子、又能挑模板时，先让我挑一次；不挑也照常做。

**每改一批，全部页看一遍**
能打开、能抽出文字，不代表页面没问题。每批重要修改后把所有页转成图看；最后一轮每一页都按原大小看过才交，不抽查。

**批注和修订另外查**
页面图里常常看不到批注。批注在不在、指向哪一句，要打开文件内部的批注记录核对，不能看图就说“没有”。

**没给样子时的默认**
美式信纸 Letter（比 A4 略宽略短）纵向，正文 11–12 号，标题黑色、不加下划线和装饰线；表格只用在真要比较的数据上，浅灰细线、真表头，不用固定行高把字裁掉。

::screen{#skill-documents-04 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-documents-04",
  "section": "abilities",
  "title": "能做的事",
  "scene": "横版 4:3 水彩，绿叶风格。一只打开的浅木色工具箱，分格里整齐摆着小物件：一支钢笔、一叠淡黄便签、一本夹着绿色书签的小册子、一张小表格卡片、一把小铜锁、一卷绿色遮字胶带、一枚放大镜；工具箱周围散落几片嫩绿叶子。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一只打开的小工具箱",
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
     "text_ref": "能做的事（21 项）",
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
     "text_ref": "写和改",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1. 新建 Word｜开头讲清主题、用途和读者要做什么，不编事实｜说不准",
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
     "text_ref": "审阅和版本",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "6. 真批注｜加在 Word 的批注栏里，指向具体的字句｜说不准",
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
     "text_ref": "目录和结构",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9. 目录、编号、脚注｜按标题层级维护，正文改了跟着对上｜说不准",
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
     "text_ref": "表单和转交",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "14. 可填写的字段｜做成 Word 真能填的空，纯文字字段最稳｜说不准",
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
     "text_ref": "19. 逐页看图｜每批重要修改后全部页转成图，最后一轮每页都看｜说不准",
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
     "text_ref": "几项有现成的限制：",
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
     "text_ref": "能做的事（21 项）",
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
     "text_ref": "写和改",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1. 新建 Word｜开头讲清主题、用途和读者要做什么，不编事实｜说不准",
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
     "text_ref": "审阅和版本",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "6. 真批注｜加在 Word 的批注栏里，指向具体的字句｜说不准",
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
     "text_ref": "目录和结构",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9. 目录、编号、脚注｜按标题层级维护，正文改了跟着对上｜说不准",
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
     "text_ref": "表单和转交",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "14. 可填写的字段｜做成 Word 真能填的空，纯文字字段最稳｜说不准",
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
     "text_ref": "19. 逐页看图｜每批重要修改后全部页转成图，最后一轮每页都看｜说不准",
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
     "text_ref": "几项有现成的限制：",
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
   "key": "一只打开的小工具箱",
   "source_phrase": "一只打开的小工具箱",
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
   "asset": "_library/skills-new-20261012/word/word-04-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。一只打开的浅木色工具箱，分格里整齐摆着小物件：一支钢笔、一叠淡黄便签、一本夹着绿色书签的小册子、一张小表格卡片、一把小铜锁、一卷绿色遮字胶带、一枚放大镜；工具箱周围散落几片嫩绿叶子。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。一只打开的浅木色工具箱，分格里整齐摆着小物件：一支钢笔、一叠淡黄便签、一本夹着绿色书签的小册子、一张小表格卡片、一把小铜锁、一卷绿色遮字胶带、一枚放大镜；工具箱周围散落几片嫩绿叶子。画面里不出现任何文字。",
   "sha256": "fe35ff51e7100c1b7d16b54c8db9625ba7727286f113784621fcbf08e574bd1b",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 能做的事（21 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
说不准＝技能里写着这一项，但 AI 的使用记录只记“用了这个技能”，看不出用到了哪一项、做没做成；写这页时也没有真的做 Word。

**写和改**
1. 新建 Word｜开头讲清主题、用途和读者要做什么，不编事实｜说不准
2. 只改该改的｜保留原来的结构、样式和可编辑性，就地改｜说不准
3. 先挑模板｜没给参考时，能挑就先给一次选择，取消也照常做｜说不准
4. 照模板或参考做｜原模板留着，不拿通用样式盖掉｜说不准
5. 能编辑的公式｜要能改就用 Word 自己的公式；改用图片会说明｜说不准

**审阅和版本**
6. 真批注｜加在 Word 的批注栏里，指向具体的字句｜说不准
7. 修订痕迹｜谁改了什么都留着；要干净版时按要求接受或拒绝｜说不准
8. 两版对比｜两版各出页面图，再给差异图和文字差异｜说不准

**目录和结构**
9. 目录、编号、脚注｜按标题层级维护，正文改了跟着对上｜说不准
10. 内部跳转和交叉引用｜“见第 2 节”“见表 3”点得过去、对得上｜说不准
11. 分节和页面布局｜不同节用不同的纸向、页边和页眉页脚｜说不准
12. 合并几份文档｜正文、表格、编号和大部分格式都留着｜说不准
13. 表格互转｜Excel 表放进 Word 表格；Word 里一张表导出成 CSV｜说不准

**表单和转交**
14. 可填写的字段｜做成 Word 真能填的空，纯文字字段最稳｜说不准
15. 限制编辑｜只读、只许批注、只许修订或只许填表｜说不准
16. 无障碍检查｜查标题层级、图片说明、表头和链接文字｜说不准
17. 遮盖指定文字｜在副本里精确匹配、等长遮住，原件不动｜说不准
18. 清作者信息、管水印｜清掉作者等记录；按需加水印或去水印｜说不准

**交之前查**
19. 逐页看图｜每批重要修改后全部页转成图，最后一轮每页都看｜说不准
20. 交成 Google 文档｜先验好本地 Word、清掉标题边框，再导入成在线文档｜说不准
21. 只交要的｜只要 Word 就只给 Word，检查用的图留在内部｜说不准

几项有现成的限制：合并时页眉页脚和分节设置不合并、图片默认不带；表格转出去，合并单元格、公式、图表不保留；下拉框、勾选框、日期这类字段不保证原样；遮盖只管正文文字，图片、图表、嵌入文件和旧修订里的同样内容要另查；去水印可能误删页眉里的正常图形。

::screen{#skill-documents-05 section="boundaries"}

```typeset
{
 "screen": {
  "id": "skill-documents-05",
  "section": "boundaries",
  "title": "边界",
  "scene": "横版 4:3 水彩，绿叶风格。林间一个小岔路口，中间立着一块空白的木制指路牌，伸出四块不写字的箭头木板；四个方向的小路尽头各放着一样东西：一卷系着绿丝带的卷轴、一张右上角有方框的表格纸、一叠摊成网格的页面缩略图、一台小小的打印机；指路牌脚下放着一张折角的文稿纸。周围是嫩绿的树丛和落叶。画面里不出现任何文字。",
  "portrait": "竖版：沿用同一幅横版 4:3 插画，完整显示、不裁切。标题、正文和卡片使用整宽；对话、功能卡逐项竖排，表格占满宽度。",
  "icon": "一块空白的木制指路牌",
  "links": [
   {
    "text": "个人正式文书技能",
    "href": "/skills/personal-formal-documents/"
   },
   {
    "text": "PDF 读写和表单",
    "href": "/skills/pdf/"
   },
   {
    "text": "文稿转 PDF",
    "href": "/skills/md-to-pdf/"
   },
   {
    "text": "PDF 逐页检查",
    "href": "/skills/pdf-render-safe/"
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
     "text_ref": "不交给它，找谁",
     "columns": 2,
     "heading_size": "medium",
     "illustration": "none",
     "icons": "none",
     "row": "division",
     "width": "62%"
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
     "text_ref": "不交给它，找谁",
     "columns": 1,
     "heading_size": "medium",
     "illustration": "none",
     "icons": "none"
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
   "asset": "_library/skills-new-20261012/word/word-05-v01.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "横版 4:3 水彩，绿叶风格。林间一个小岔路口，中间立着一块空白的木制指路牌，伸出四块不写字的箭头木板；四个方向的小路尽头各放着一样东西：一卷系着绿丝带的卷轴、一张右上角有方框的表格纸、一叠摊成网格的页面缩略图、一台小小的打印机；指路牌脚下放着一张折角的文稿纸。周围是嫩绿的树丛和落叶。画面里不出现任何文字。",
   "source_phrase": "横版 4:3 水彩，绿叶风格。林间一个小岔路口，中间立着一块空白的木制指路牌，伸出四块不写字的箭头木板；四个方向的小路尽头各放着一样东西：一卷系着绿丝带的卷轴、一张右上角有方框的表格纸、一叠摊成网格的页面缩略图、一台小小的打印机；指路牌脚下放着一张折角的文稿纸。周围是嫩绿的树丛和落叶。画面里不出现任何文字。",
   "sha256": "448b4c7a67cccf9e27e77a937c2ed23ee366686409c3c4649af5199022a81073",
   "status": "ready",
   "verified_no_text": true
  }
 ]
}
```

## 边界

**交给它**
- 要一份能接着改的 Word，版面要靠得住
- 改现有的 Word，原来的表格、批注、修订都要留着
- 出干净版、比两版、整理目录脚注、做能填的表
- 要在线编辑的 Google 文档，从验好的 Word 导进去

**不交给它，找谁**
| 这些事 | 找谁 |
|---|---|
| 我自己的合同、协议、通知，要签名、记交出 | 〔个人正式文书技能〕，它有自己的一套生成和检查 |
| 已经是 PDF 的文件：读、改、填表 | 〔PDF 读写和表单〕 |
| Markdown 文稿要变成 PDF | 〔文稿转 PDF〕 |
| 已有 PDF 要逐页出图、留检查报告 | 〔PDF 逐页检查〕 |

**它不做**
- 不保证自动刷新：目录、页码有时要在 Word 里打开刷新一次才显示新位置
- 限制编辑不是加密：有的软件会直接无视
- 自动无障碍检查不等于通过全部无障碍标准，图片说明还要人判断
- 不替我发出去：导入 Google 文档要我说清放在哪，发给谁由我定

它是 Codex 自带的文件插件（10 月 30 日核对时，本机 Codex 插件缓存里只有 26.1020.11618 这一版；10 月 22 日核对时是 26.1017.22135 版，这页早先写的是 10 月 10 日的 26.1009.11318 版），不是我自己写的技能；我在 Codex 里用它，Claude 那边有没有同样的能力，这次没查清。“每页看过才交”是它交东西前要守的规矩，不代表写这页时跑过一次；换了版本也只是核对了本机能找到的是哪一版，没有拿新版重新做过一份文件。
