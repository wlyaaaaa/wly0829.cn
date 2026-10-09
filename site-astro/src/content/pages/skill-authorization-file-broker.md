---
{
 "title": "加密文件",
 "kind": "skill",
 "url": "/skills/authorization-file-broker/",
 "tagline": "点名的文件，交给密码中心加密保管",
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
  "page": "skill-authorization-file-broker",
  "kind": "skill",
  "title": "加密文件",
  "url": "/skills/authorization-file-broker/",
  "tagline": "点名的文件，交给密码中心加密保管",
  "status": "",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "2b3d031165595fb23537ae98bf6a788c979e632c",
   "commit_time": "2026-09-28T00:42:40+08:00",
   "file": "E:\\.agents\\skills\\authorization-file-broker\\SKILL.md"
  },
  "video_prompt": "5 秒循环，水彩风、白底纯绿：一个文件夹被绿丝带绕一圈打好结，结上四把小钥匙轻轻晃动；文件夹里飘出几块小方块，依次排进一个小盒子，盒子合上时亮一下绿光；不出现可读的字。",
  "registry": {
   "mentions": [
    {
     "target": "/projects/password-center/",
     "text": "密码中心",
     "screen": "skill-authorization-file-broker-01"
    },
    {
     "target": "/projects/vault-tool/",
     "text": "本地加密库",
     "screen": "skill-authorization-file-broker-01"
    },
    {
     "target": "/projects/password-center/#tech",
     "text": "密码中心 · 钥匙一层套一层",
     "screen": "skill-authorization-file-broker-02"
    },
    {
     "target": "/projects/password-center/#g-files",
     "text": "密码中心 · 加密文件",
     "screen": "skill-authorization-file-broker-03"
    },
    {
     "target": "/skills/local-secret-broker/",
     "text": "密码和验证技能",
     "screen": "skill-authorization-file-broker-04"
    },
    {
     "target": "/projects/vault-tool/",
     "text": "本地加密库",
     "screen": "skill-authorization-file-broker-04"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "五条命令示例（Invoke-SecretBroker.ps1 -Action AuthorizationFile*）不上网站，属于施工细节。"
   ],
   "unsure": [
    "例子里的路径“E:\\扫描件\\合同”是编的示意路径，不是真实文件夹。",
    "实际加密过的 .pcaf 只找到两个（手机 App 发布签名钥匙、9/23 验收样本），本人自己点名加密的还没找到；技能页不写使用次数。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-authorization-file-broker/page.json",
  "sha256": "10bfd7b458cc2627256eac4e6ed0b83e107ed8e321f830c69657a5a9ee0cf5d8",
  "converted_at_beijing": "2026-10-10T05:26:53+08:00"
 }
}
---

::screen{#skill-authorization-file-broker-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-authorization-file-broker-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "左上标题“加密文件”，下面一段介绍。右上一幅水彩插画：一个文件夹被一条绿丝带捆好，丝带结上挂四把小钥匙，旁边一个打开的小盒子里整齐放着几块小方块（表示分块加密）。下面五个对话气泡竖着排，每个气泡左边一个小图标（锁、放大镜、打开的箱子、眼睛、铅笔）。",
  "portrait": "竖版：插画在标题下面；五个气泡一行一个。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   },
   {
    "text": "本地加密库",
    "href": "/projects/vault-tool/"
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
     "row": "intro",
     "width": "55%",
     "text_ref": "加密文件"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "把我点名的文件或文件夹，交给密码中心加密成一个.pcaf文件夹"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "intro",
     "width": "45%"
    },
    {
     "type": "prose",
     "text_ref": "可以这样跟AI说："
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
      "_library/avatars/本人-通用.png"
     ],
     "illustration": "left_inside",
     "text_ref": "“帮我加密这个文件夹。”“这个.pcaf还能恢复吗？”“把它解到E:\\restored。”“打开里面的n"
    },
    {
     "type": "prose",
     "text_ref": "没说用哪一套时，“帮我加密这个文件”默认走这里；说的是vault.enc或Key仓库，就交给本地加密库那"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。左上标题“加密文件”，下面一段介绍。右上一幅水彩插画：一个文件夹被一条绿丝带捆好，丝带结上挂四把小钥匙，旁边一个打开的小盒子里整齐放着几块小方块（表示分块加密）。下面五个对话气泡竖着排，每个气泡左边一个小图标（锁、放大镜、打开的箱子、眼睛、铅笔）。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "加密文件"
    },
    {
     "type": "prose",
     "text_ref": "把我点名的文件或文件夹，交给密码中心加密成一个.pcaf文件夹"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "prose",
     "text_ref": "可以这样跟AI说："
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
      "_library/avatars/本人-通用.png"
     ],
     "illustration": "left_inside",
     "text_ref": "“帮我加密这个文件夹。”“这个.pcaf还能恢复吗？”“把它解到E:\\restored。”“打开里面的n"
    },
    {
     "type": "prose",
     "text_ref": "没说用哪一套时，“帮我加密这个文件”默认走这里；说的是vault.enc或Key仓库，就交给本地加密库那"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：插画在标题下面；五个气泡一行一个。",
   "portrait_required": true
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
   "source_phrase": "“帮我加密这个文件夹。”",
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
   "source_phrase": "“这个 .pcaf 还能恢复吗？”",
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
   "source_phrase": "“把它解到 E:\\restored。”",
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
   "source_phrase": "“打开里面的 notes.txt 给我看。”",
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
   "source_phrase": "“把里面这段话改一下，另存一份。”",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "锁",
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
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-password-center",
   "source_phrase": "右上一幅水彩插画：一个文件夹被一条绿丝带捆好，丝带结上挂四把小钥匙，旁边一个打开的小盒子里整齐放着几块小方块（表示分块加密）。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "一个文件夹被一条绿丝带捆好，丝带结上挂四把小钥匙，旁边一个打开的小盒子里整齐放着几块小方块（表示分块加密"
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
   "asset": "_library/titles/title-a6a91aec3d6c7fa74c29.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a6a91aec3d6c7fa74c29",
   "title_text": "加密文件",
   "sha256": "41555999cb9980b4a0f614386e8d183a291537845643e525a010aa09ed4f5bd7",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

加密文件

把我点名的文件或文件夹，交给〔密码中心〕加密成一个 .pcaf 文件夹；以后核验、解开、查看、修改，按本人验证规则办（四选一；受信任的桌面 AI 可复用有效资料期或无限制授权）。不用另记密码，原件也不动。

可以这样跟 AI 说：
- “帮我加密这个文件夹。”
- “这个 .pcaf 还能恢复吗？”
- “把它解到 E:\restored。”
- “打开里面的 notes.txt 给我看。”
- “把里面这段话改一下，另存一份。”

没说用哪一套时，“帮我加密这个文件”默认走这里；说的是 vault.enc 或 Key 仓库，就交给〔本地加密库〕那一套。

::screen{#skill-authorization-file-broker-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-authorization-file-broker-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "左上标题。一条从左到右的五步流程，每步一个编号圆圈、小水彩图标和两行字（文件夹、四把钥匙的环、一个 .pcaf 文件夹、一张回执、两块硬盘）。下面一张横卡片“回执里有什么、没有什么”，左右两半。",
  "portrait": "竖版：五步改成从上到下；回执卡片两半上下排。",
  "links": [
   {
    "text": "密码中心 · 钥匙一层套一层",
    "href": "/projects/password-center/#password-center-09",
    "locator_text": {
     "h": "密码中心·钥匙一层套一层。"
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
     "text_ref": "一个完整的例子：“帮我加密E:\\扫描件\\合同这个文件夹”"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "text_ref": "1只认点名的路径。AI只处理这一个文件夹，不去扫下载、文档或整块盘；遇到符号链接、目录联接这类指向别处的"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 2,
     "text_ref": "回执里有：文件数、路径、哈希、状态。没有：文件内容、钥匙。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。左上标题。一条从左到右的五步流程，每步一个编号圆圈、小水彩图标和两行字（文件夹、四把钥匙的环、一个 .pcaf 文件夹、一张回执、两块硬盘）。下面一张横卡片“回执里有什么、没有什么”，左右两半。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一个完整的例子：“帮我加密E:\\扫描件\\合同这个文件夹”"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "1只认点名的路径。AI只处理这一个文件夹，不去扫下载、文档或整块盘；遇到符号链接、目录联接这类指向别处的"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "columns": 1,
     "text_ref": "回执里有：文件数、路径、哈希、状态。没有：文件内容、钥匙。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：五步改成从上到下；回执卡片两半上下排。",
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
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹链接",
   "source_phrase": "只认点名的路径。　AI 只处理这一个文件夹，不去扫下载、文档或整块盘；遇到符号链接、目录联接这类指向别处的链接直接拒绝。",
   "sha256": "46432a7abe516e7ee3c92a764f8ab92ad1fe435544e50fc825be4383d0a81da0",
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
   "source_phrase": "验证一次。　没开着无限制授权，就弹四选一窗口，我挑一种。",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "加密。　没说放哪，就放在 E:\\Documents\\PasswordCenterEncryptedFiles 下面新建的 .pcaf 文件夹里；原件原地不动。怎么加密见〔密码中心 · 钥匙一层套一层〕。",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "source_phrase": "读回核对。　加密完再认一遍整个包，核对每个文件的哈希，才报“完成”。中途断了，下次核对已完成的部分再接着做。",
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
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "纸箱对勾",
   "source_phrase": "跟着备份走。　这个文件夹随文档每天备份到 G、再到 H；G、H 各自确认，H 没接上就写“待定”。",
   "sha256": "3777dffcebd18959634f0a7223b9ff2e81e3b6c7498df0f7a8941dcf69f8a0bd",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-1abec9b3222b498a6eb9.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-1abec9b3222b498a6eb9",
   "title_text": "一个完整的例子：“帮我加密 E:\\扫描件\\合同 这个文件夹”",
   "sha256": "827a9a54db4ae8722207a0bb6dedcb14ca674cef470996afd8c8db30b5a87a9b",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一个完整的例子：“帮我加密 E:\扫描件\合同 这个文件夹”

1. **只认点名的路径。**　AI 只处理这一个文件夹，不去扫下载、文档或整块盘；遇到符号链接、目录联接这类指向别处的链接直接拒绝。
2. **验证一次。**　受信任的桌面 AI 复用有效资料期或无限制授权；否则让我四选一验证。
3. **加密。**　没说放哪，就放在 E:\Documents\PasswordCenterEncryptedFiles 下面新建的 .pcaf 文件夹里；原件原地不动。怎么加密见〔密码中心 · 钥匙一层套一层〕。
4. **读回核对。**　加密完再认一遍整个包，核对每个文件的哈希，才报“完成”。中途断了，下次核对已完成的部分再接着做。
5. **跟着备份走。**　这个文件夹随文档每天备份到 G、再到 H；G、H 各自确认，H 没接上就写“待定”。

**回执里有**：文件数、路径、哈希、状态。**没有**：文件内容、钥匙。

::screen{#skill-authorization-file-broker-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-authorization-file-broker-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "左上标题。一张宽卡片，左边丝带捆着的文件夹小插画，右边一段话和一个链接按钮。",
  "portrait": "竖版：插画在上，文字和按钮在下。",
  "links": [
   {
    "text": "密码中心 · 加密文件",
    "href": "/projects/password-center/#g-files",
    "locator_text": {
     "h": "密码中心・加密文件",
     "v": "密码中心・加密文件"
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
     "text_ref": "这个技能是密码中心文件加密的入口：加密、核验、解开、查看、修改、中断续做、在新电脑上解开，全部列在密码中",
     "illustration": "left_inside",
     "columns": 1,
     "illustration_source": "illustration",
     "illustration_index": 0
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。左上标题。一张宽卡片，左边丝带捆着的文件夹小插画，右边一段话和一个链接按钮。 qa-11 修复：已有核查的锁文件夹图移入全宽说明卡左侧，撤独立插画栏，原说明和原链接仍在一张外卡。 qa-11 第二轮：视觉复核发现 points_card 的 28% 图栏仍撑高右侧留白，改用已有 content_card 的 240px 上限小图栏；原段与导航仍同一外卡。",
   "portrait_required": true
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
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "points_card",
     "whole_block": true,
     "text_ref": "这个技能是密码中心文件加密的入口：加密、核验、解开、查看、修改、中断续做、在新电脑上解开，全部列在密码中"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：插画在上，文字和按钮在下。",
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
   "asset": "_library/fix-round-2/icon-clean-ea93827b93a1f34e4c58.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "锁文件夹",
   "source_phrase": "一张宽卡片，左边丝带捆着的文件夹小插画，右边一段话和一个链接按钮。",
   "sha256": "a17733ae031a32e99492ccd65da9b09418d912d572b6663f79b80a8a15b40607",
   "status": "ready",
   "original_elements": [
    "丝带捆着的文件夹"
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

这个技能是密码中心文件加密的入口：加密、核验、解开、查看、修改、中断续做、在新电脑上解开，全部列在密码中心的“全部功能”里，这里不再抄一遍：

〔密码中心 · 加密文件〕

::screen{#skill-authorization-file-broker-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-authorization-file-broker-04",
  "section": "limits",
  "title": "边界",
  "scene": "左上标题。左右两栏：左栏“管”，带绿色对勾的短句；右栏“不管，交给谁”，带灰色箭头的短句。最下面一条细卡片“守的几条死规矩”。",
  "portrait": "竖版：两栏上下排；细卡片放最后。",
  "links": [
   {
    "text": "密码和验证技能",
    "href": "/skills/local-secret-broker/",
    "locator_instances": {
     "h": {
      "input_sha256": "9bc58d3945e5ac1e8246b0ad3ec24daa847ee251e705aa8aeaf94e5436472617",
      "instances": [
       {
        "context_text": "密码和验证技能入",
        "context_rect": [
         1154,
         438,
         1349,
         466
        ],
        "expected_rect": [
         1156,
         441,
         1326,
         466
        ],
        "lookup_text": "密码和验证技能",
        "confirm_region": true
       }
      ]
     }
    }
   },
   {
    "text": "本地加密库",
    "href": "/projects/vault-tool/"
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
     "type": "points_card",
     "columns": 2,
     "text_ref": "管"
    },
    {
     "type": "notice",
     "text_ref": "守的几条死规矩只动点名的路径，不扫盘找文件；原件和加密包都保留，不自动删除、上传或挪走；解开时遇到同名文"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。左上标题。左右两栏：左栏“管”，带绿色对勾的短句；右栏“不管，交给谁”，带灰色箭头的短句。最下面一条细卡片“守的几条死规矩”。",
   "portrait_required": true
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
     "type": "points_card",
     "columns": 2,
     "text_ref": "管"
    },
    {
     "type": "notice",
     "text_ref": "守的几条死规矩只动点名的路径，不扫盘找文件；原件和加密包都保留，不自动删除、上传或挪走；解开时遇到同名文"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：两栏上下排；细卡片放最后。",
   "portrait_required": true
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

边界

**管**
- 加密、核验、解开我点名的文件、文件夹或 ZIP
- 在本机窗口查看或修改包里的一个文本文件（只限 UTF-8 文本）
- 在一台没登记过的新电脑上，凭完整程序、恢复副本和 .pcaf 解开

**不管，交给谁**
- 密码、key、银行卡、磁盘恢复钥匙 → 〔密码和验证技能〕
- 用自己记的密码加密的 vault.enc → 〔本地加密库〕
- 不是文本的文件不在窗口里打开，要用就解到一个指定的文件夹

**守的几条死规矩**　只动点名的路径，不扫盘找文件；原件和加密包都保留，不自动删除、上传或挪走；解开时遇到同名文件不覆盖；文件内容和钥匙不进聊天、日志、剪贴板；修改一律另存新包，原包不动；钥匙和密码库、本地加密库都不共用。
