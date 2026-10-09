---
{
 "title": "加密库操作",
 "kind": "skill",
 "url": "/skills/vault-workflow/",
 "tagline": "让 AI 管本地加密库，密码只在本机窗口里输",
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
  "page": "skill-vault-workflow",
  "kind": "skill",
  "title": "加密库操作",
  "url": "/skills/vault-workflow/",
  "tagline": "让 AI 管本地加密库，密码只在本机窗口里输",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "3ed43855d89cf8d9102d05f296d08df62372b1b4",
   "commit_time": "2026-09-26T17:27:17+08:00",
   "file": "E:\\.agents\\skills\\vault-workflow\\SKILL.md（含 references 2 份）"
  },
  "video_prompt": "5 秒循环，水彩风、白底纯绿：一个 AI 小机器人在一扇半开的窗户外轻轻点头，窗户里一个绿色顶栏的小窗口亮起，一只手在键盘上敲几下；窗里递出一张只画着对勾的小纸条，机器人接过，旁边的绿色信封挂锁“咔”地扣上，亮一圈绿光；不出现可读的字。",
  "registry": {
   "mentions": [
    {
     "target": "/projects/vault-tool/",
     "text": "本地加密库",
     "screen": "skill-vault-workflow-01"
    },
    {
     "target": "/skills/authorization-file-broker/",
     "text": "加密文件技能",
     "screen": "skill-vault-workflow-01"
    },
    {
     "target": "/projects/vault-tool/#features",
     "text": "本地加密库 · 全部功能",
     "screen": "skill-vault-workflow-03"
    },
    {
     "target": "/skills/authorization-file-broker/",
     "text": "加密文件技能",
     "screen": "skill-vault-workflow-04"
    },
    {
     "target": "/skills/local-secret-broker/",
     "text": "密码和验证技能",
     "screen": "skill-vault-workflow-04"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "15 个模式名（Doctor、LocalEdit、PublishVault 等）和命令示例不上网站，属于施工细节；用人话写进例子和边界。",
    "“密码中心代码里的 vault session 不是这个 Vault”一条不上：是给 AI 分路由的实现提醒，读者用不着。",
    "隐写后“原封面进回收站”的处理规则不上：来源没核实（见 unsure），也不是用户会主动说的事。"
   ],
   "unsure": [
    "例子是按技能的真实流程编的示意（Doctor/AssessVault → LocalEdit → PublishVault -WhatIf → PublishVault），不是某一次真实操作的记录；“清单”“笔记”是泛称，不指真实库里的文件。",
    "SKILL.md“隐写产物保留与清理”写“按本人对 H 盘原始封面图的既定选择，只保留载体图片、原封面进回收站”；决定记录里没搜到这条原话，提交 3ed4385 也只有标题。已写进审计。",
    "技能页标题“加密库操作”是新起的名字（旧网站叫“打开加密库”）；项目页里链接文字也用“加密库操作技能”，两处要一起改。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-vault-workflow/page.json",
  "sha256": "23eb1bd17815443e20ca9758db36a9c2f0e5194b28e8ba195107e9e718397d69",
  "converted_at_beijing": "2026-10-10T03:45:10+08:00"
 }
}
---

::screen{#skill-vault-workflow-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-vault-workflow-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "左上标题“加密库操作”，下面一段介绍。右上一幅水彩插画：一个 AI 小机器人站在一扇半开的窗户外，窗户里是一个绿色顶栏写着“VAULT”的小窗口和一只正在键盘上输入的手；窗外机器人手里只拿着一张写着对勾和一串短哈希样式小方块的纸条（不画可读的字）；旁边一个贴着挂锁的绿色信封。下面六个对话气泡两列三行，每个气泡左边一个小图标（听诊器、眼睛、铅笔、封口的信封、钥匙、带锁的云）。最下面一行说明，带两个链接。",
  "portrait": "竖版：插画在标题下面；六个气泡一行一个；说明放最后。",
  "links": [
   {
    "text": "加密文件技能",
    "href": "/skills/authorization-file-broker/"
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
     "text_ref": "加密库操作",
     "row": "balanced-heading",
     "width": "88%"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "prose",
     "text_ref": "让 AI 帮我管"
    },
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "可以这样跟"
    },
    {
     "type": "dialogue",
     "columns": 2,
     "split_items": true,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "“看看 Key",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "只说“帮我"
    }
   ],
   "notes": "原图左标题正文右主图，主图卡外。六气泡两列三排按行读取，各左图标在横卡内、右是浅绿气泡。底部说明一行，链接文字严格依定稿（原图额外密码中心链接不保留）。需dialogue拆bullets为六气泡。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "加密库操作"
    },
    {
     "type": "illustration",
     "illustration": "outside"
    },
    {
     "type": "prose",
     "text_ref": "让 AI 帮我管"
    },
    {
     "type": "section_heading",
     "size": "small",
     "text_ref": "可以这样跟"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "split_items": true,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "“看看 Key",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "只说“帮我"
    }
   ],
   "notes": "主图在标题下、介绍段上、卡片外；六横卡一行一个、左图右气泡；底部整宽说明。图中VAULT文字只按定稿所点名字样处理，其他窗口字不保留。"
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
   "source_phrase": "“看看 Key 那份加密库还好不好。”",
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
   "source_phrase": "“打开 vault.enc，我要看里面的清单。”",
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
   "source_phrase": "“把 vault.enc 里那份笔记的第二段改一下。”",
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
   "source_phrase": "“把这个文件夹加密成一个新的 .enc 库。”",
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
   "source_phrase": "“改一下 vault.enc 的密码。”",
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
   "source_phrase": "“把改好的库备份到 Key，传完核对一下。”",
   "sha256": "cac3d3d1ad011972de9724cc436e4166973164778a938da90c0bc1ec1e2a44a4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "听诊器检查",
   "source_phrase": "听诊器",
   "sha256": "18d3aa616e0ec2aa16db0867599d221f862df22750e2e388ca3ad86630ecd1be",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/密封文件钥匙.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "密封文件钥匙",
   "source_phrase": "右上一幅水彩插画：一个 AI 小机器人站在一扇半开的窗户外，窗户里是一个绿色顶栏写着“VAULT”的小窗口和一只正在键盘上输入的手；窗外机器人手里只拿着一张写着对勾和一串短哈希样式小方块的纸条（不画可读的字）；旁边一个贴着挂锁的绿色信封。",
   "sha256": "403ce13ac20240234cb5c83107cbfe12f712515dc8e047df1cbe2246f6868cf2",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-7d45fb4cf6cb3980f6f9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-7d45fb4cf6cb3980f6f9",
   "title_text": "加密库操作",
   "sha256": "76e997a812bcc533c2d3935d6f11cde52541ecb1c9d171c1cb3a3947f253832c",
   "status": "ready"
  }
 ]
}
```

加密库操作

让 AI 帮我管本地加密库：检查 vault.enc 坏没坏，在本机窗口里打开看、改几行字，建新库、导出、改密码，把密文备份到私人 Key 仓库。要密码时，AI 只弹出本机窗口让我自己输；回到 AI 手里的只有“成没成、存在哪、几个文件、密文哈希”。

可以这样跟 AI 说：
- “看看 Key 那份加密库还好不好。”
- “打开 vault.enc，我要看里面的清单。”
- “把 vault.enc 里那份笔记的第二段改一下。”
- “把这个文件夹加密成一个新的 .enc 库。”
- “改一下 vault.enc 的密码。”
- “把改好的库备份到 Key，传完核对一下。”

只说“帮我加密这个文件”、没提 vault.enc、Key 或 VAULT03 时，默认交给〔加密文件技能〕，走密码中心那一套。

::screen{#skill-vault-workflow-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-vault-workflow-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "左上标题。一条从左到右的五步流程，每步一个编号圆圈、小水彩图标和两三行字（听诊器照着一个信封、一个绿色顶栏写“VAULT”的小窗口、一支铅笔在一页纸上改一句、一把挂锁重新扣上、一朵带锁的云和一个往回的箭头）。下面一张横卡片“回执里有什么、没有什么”，左右两半。",
  "portrait": "竖版：五步改成从上到下；回执卡片两半上下排。",
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
     "text_ref": "一个完整的例子："
    },
    {
     "type": "flow",
     "columns": 5,
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "先查，不要密码",
     "direction": "horizontal"
    },
    {
     "type": "comparison",
     "columns": 2,
     "inline_groups": [
      "回执里有",
      "没有"
     ],
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "回执里有",
     "inline_icons": [
      "_library/icons/钥匙.png",
      "_library/icons/钥匙.png"
     ]
    }
   ],
   "notes": "标题整屏两行居中；五编号站同排，编号左上、图标卡内顶部、标题正文在下，绿箭头串起。底下一满宽回执横卡左右两半：回执里有/没有，图标左内。回执是一个para节点，inline_groups需组件按原文区间拆左右且不漏字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整的例子："
    },
    {
     "type": "flow",
     "columns": 1,
     "columns_v": 1,
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "先查，不要密码",
     "direction": "vertical"
    },
    {
     "type": "comparison",
     "columns": 1,
     "inline_groups": [
      "回执里有",
      "没有"
     ],
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "回执里有",
     "inline_icons": [
      "_library/icons/钥匙.png",
      "_library/icons/钥匙.png"
     ]
    }
   ],
   "notes": "原图五步骤各为一整宽横卡，上下排列、左图右文、编号压左上；相邻卡无显式箭头，以原图为准。回执有/没有两半在底部上下排，各左图右文。标题两行居中。"
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
   "asset": "_library/round3/clean-assets/png/43-文件柜-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件柜",
   "source_phrase": "先查，不要密码。　AI 查环境和这个库的结构：格式对不对、要不要密钥文件、Key 是不是私有仓库。有一项不对就停下来说清楚。",
   "sha256": "f0b9ee3efc4f0022c96df1fbce4b8dff8c95bbc70ef0fee81367044b19e4fa88",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "弹出本机窗口。　顶栏写着“VAULT”；我输密码，要密钥文件就在窗口里选。密码框一拿到光标就断开输入法。",
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "在窗口里改。　窗口列出库里的文本文件，选中清单改那一句；不是文本的文件原样保留、不能改。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "保存。　只重新加密这次打开的那一套内容，另一套一个字节都不动；改完必须装得进原来的空间，装不下就拒绝保存，原库不动。写完读回再解一遍核对。",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "先预演，再上传。　AI 先预演一遍往 Key 上传，确认目标是私有仓库、路径对；再真的上传，从 GitHub 读回比对长度和 SHA-256，两样都对才说“备份好了”。",
   "sha256": "0a8164fd36a6e5e669a81ec81f3edbc7742e4c3c56232caa353815e70cab281c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "回执里有：成没成、存没存、路径、密文哈希。没有：密码、密钥文件、改了哪些字。",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "回执里有：成没成、存没存、路径、密文哈希。没有：密码、密钥文件、改了哪些字。",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "回执里有：成没成、存没存、路径、密文哈希。没有：密码、密钥文件、改了哪些字。",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "key": "钥匙",
   "source_phrase": "回执里有：成没成、存没存、路径、密文哈希。没有：密码、密钥文件、改了哪些字。",
   "sha256": "bcf00ea5f0ddd7619d3c2f1ed6acde97a99f54db98805c4aa4fa72d1e10eec58",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-eae954b1cdc66034c3c4.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-eae954b1cdc66034c3c4",
   "title_text": "一个完整的例子：“把 vault.enc 里的清单改一句，改完备份到 Key”",
   "sha256": "eea1fd784ed4e04d87171270f246225c54ef4ed9a8345ed1c5b273dff2f3e675",
   "status": "ready"
  }
 ]
}
```

一个完整的例子：“把 vault.enc 里的清单改一句，改完备份到 Key”

1. **先查，不要密码。**　AI 查环境和这个库的结构：格式对不对、要不要密钥文件、Key 是不是私有仓库。有一项不对就停下来说清楚。
2. **弹出本机窗口。**　顶栏写着“VAULT”；我输密码，要密钥文件就在窗口里选。密码框一拿到光标就断开输入法。
3. **在窗口里改。**　窗口列出库里的文本文件，选中清单改那一句；不是文本的文件原样保留、不能改。
4. **保存。**　只重新加密这次打开的那一套内容，另一套一个字节都不动；改完必须装得进原来的空间，装不下就拒绝保存，原库不动。写完读回再解一遍核对。
5. **先预演，再上传。**　AI 先预演一遍往 Key 上传，确认目标是私有仓库、路径对；再真的上传，从 GitHub 读回比对长度和 SHA-256，两样都对才说“备份好了”。

**回执里有**：成没成、存没存、路径、密文哈希。**没有**：密码、密钥文件、改了哪些字。

::screen{#skill-vault-workflow-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-vault-workflow-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "左上标题。一张宽卡片，左边一个贴着挂锁的绿色信封小插画，右边一段话和一个链接按钮。",
  "portrait": "竖版：插画在上，文字和按钮在下。",
  "links": [
   {
    "text": "本地加密库 · 全部功能",
    "href": "/projects/vault-tool/#features",
    "locator_text": {
     "h": "本地加密库・全部功能",
     "v": "本地加密库・全部功能"
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
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "button_in_card": true,
     "illustration_width": "38%",
     "text_ref": "这个技能是"
    }
   ],
   "notes": "整屏章节标题居中（原图旧标题左对齐，按批准追加要求调整）。下方只有一张满宽卡，锁信封插画在卡内左约38%，正文在右，按钮紧接正文且在同一卡内，不移出卡。"
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
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-2a8efcedc56db75fbba3.png"
     ],
     "button_in_card": true,
     "text_ref": "这个技能是"
    }
   ],
   "notes": "一张满宽卡，锁信封大插画在卡内顶部，文字在下、链接按钮在卡底，全部同一卡内。标题居中大档。"
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "锁",
   "source_phrase": "这个技能是本地加密库的AI入口。它能做的，以及只能我自己在终端里做的（往已有的库里加文件用菜单，另做一份新副本用rebuild命令），全部列在项目页的“全部功能”里，这里不再抄一遍：\n本地加密库·全部功能",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-0a6aa6f2e7f4f4.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-0a6aa6f2e7f4f4",
   "source_phrase": "一张宽卡片，左边一个贴着挂锁的绿色信封小插画，右边一段话和一个链接按钮。",
   "sha256": "b2879220942f9a130ef3584fff6614dd154318addf1035d207b04b1383e8b392",
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
   "status": "ready"
  }
 ]
}
```

能做的事

这个技能是本地加密库的 AI 入口。它能做的，以及只能我自己在终端里做的（往已有的库里加文件用菜单，另做一份新副本用 rebuild 命令），全部列在项目页的“全部功能”里，这里不再抄一遍：

〔本地加密库 · 全部功能〕

::screen{#skill-vault-workflow-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-vault-workflow-04",
  "section": "limits",
  "title": "边界",
  "scene": "左上标题。左右两栏：左栏“管”，带绿色对勾的短句；右栏“不管，交给谁”，带灰色箭头的短句。最下面一条细卡片“守的几条死规矩”。",
  "portrait": "竖版：两栏上下排；细卡片放最后。",
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
     "text_ref": "边界"
    },
    {
     "type": "points_card",
     "row": "bounds",
     "width": "50%",
     "columns": 1,
     "illustration": "none",
     "illustration_align": "right",
     "icons": "auto",
     "item_icons": "check",
     "text_ref": "管"
    },
    {
     "type": "points_card",
     "row": "bounds",
     "width": "50%",
     "columns": 1,
     "illustration": "none",
     "illustration_align": "right",
     "icons": "auto",
     "item_icons": "arrow",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/打勾清单.png"
     ],
     "text_ref": "守的几条死规矩"
    }
   ],
   "notes": "整屏章节标题居中（原图旧左对齐，按批准追加要求调整）。左右各半宽两栏大卡；管卡对勾条目左、笔记本插画在右卡内，不管卡灰箭头条目、路牌在右下卡内；底下细满宽卡左检查单图右规则段。right_inside为所需组件扩展，禁止改成左内图。\nQA12 2026-10-03T13:33:49+08:00：按本页审查意见调整构图；本轮构图字段取代此前与之冲突的旧排法说明，素材/组件缺口见本页 .fix.md。"
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
     "type": "points_card",
     "columns": 1,
     "item_cards": true,
     "item_icons": "check",
     "illustration": "none",
     "text_ref": "管"
    },
    {
     "type": "points_card",
     "columns": 1,
     "item_cards": true,
     "item_icons": "arrow",
     "illustration": "none",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_clauses": true,
     "item_cards": true,
     "illustration": "none",
     "text_ref": "守的几条死规矩"
    }
   ],
   "notes": "原v标题左盾牌主图右卡外；管与不管各整宽大卡上下顺排、内含四条独立小卡。续v2采用approved新图，守的几条死规矩一大卡内有按原分号分成八段小卡；不得改字，split_clauses只切原文边界并保留标点。盾牌素材不得错用首屏机器人。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "守的几条死规矩 密码只在本机窗口里输，不进聊天、命令参数、环境变量和文件；只动点名的那一个库，不去别处找；只读检查不解密；导出只写到点名的文件夹，同名文件不覆盖；建库不删原件；改密码不改算钥匙的参数，另一套内容不碰；只往私有仓库上传，不定时自动传；验一次密码不留授权，下一个操作要再输。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/密封文件钥匙.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "密封文件钥匙",
   "source_phrase": "左上标题。左右两栏：左栏“管”，带绿色对勾的短句；右栏“不管，交给谁”，带灰色箭头的短句。最下面一条细卡片“守的几条死规矩”。",
   "sha256": "403ce13ac20240234cb5c83107cbfe12f712515dc8e047df1cbe2246f6868cf2",
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
   "status": "ready"
  }
 ]
}
```

边界

**管**
- vault.enc 这类 VAULT03 库（旧的 VAULT01、02 也能读），和私人 Key 仓库
- 在本机窗口里查看、修改库里的 UTF-8 文本
- 建新库、导出到指定文件夹、改密码、验一次密码、藏进图片和从图片取回
- 把密文传到 Key 并读回核对；明确要求时，把 Key 的说明文件换成安全文字

**不管，交给谁**
- 没点名的“帮我加密这个文件” → 加密文件技能
- 密码、API key、BitLocker、本人验证方式 → 密码和验证技能
- 往已有的库里加文件、另做新副本 → 我自己在终端做：加文件用 python vault_tool.py 的菜单，新副本用 python vault_tool.py rebuild --out 新文件
- 忘了密码、丢了密钥文件 → 谁也找不回

**守的几条死规矩**　密码只在本机窗口里输，不进聊天、命令参数、环境变量和文件；只动点名的那一个库，不去别处找；只读检查不解密；导出只写到点名的文件夹，同名文件不覆盖；建库不删原件；改密码不改算钥匙的参数，另一套内容不碰；只往私有仓库上传，不定时自动传；验一次密码不留授权，下一个操作要再输。
