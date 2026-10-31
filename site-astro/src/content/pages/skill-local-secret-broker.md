---
{
 "title": "密码和本人验证",
 "kind": "skill",
 "url": "/skills/local-secret-broker/",
 "tagline": "让 AI 按规矩用密码中心：查、用、验证、授权",
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
  "page": "skill-local-secret-broker",
  "kind": "skill",
  "title": "密码和本人验证",
  "url": "/skills/local-secret-broker/",
  "tagline": "让 AI 按规矩用密码中心：查、用、验证、授权",
  "status": "",
  "status_line": {
   "state": "常用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-26 13:02"
   },
   "facts": [
    "10 月 18—24 日 AI 用了 80 次"
   ],
   "as_of": "2026-10-26",
   "source": "状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 19:04取这段已完成账本中的最近事件，不限于7天。这里的次数68次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "705fc4b307218c1b274d97ec42465ea497aaadff",
   "commit_time": "2026-09-28T01:36:49+08:00",
   "file": "E:\\.agents\\skills\\local-secret-broker\\SKILL.md（含 references 4 份）"
  },
  "video_prompt": "5 秒循环，水彩风、白底纯绿：一个对话气泡从左边浮起，里面一行模糊的灰线；一条绿色光线从气泡流到中间的绿色保险柜，柜门轻开一下，一个小窗口从柜门飘出、窗口里一个绿色对勾亮起；不出现任何可读的字或数字。",
  "registry": {
   "mentions": [
    {
     "target": "/projects/password-center/",
     "text": "密码中心",
     "screen": "skill-local-secret-broker-01"
    },
    {
     "target": "/projects/password-center/#g-vault",
     "text": "密码库日常",
     "screen": "skill-local-secret-broker-03"
    },
    {
     "target": "/projects/password-center/#g-programs",
     "text": "给程序用 key",
     "screen": "skill-local-secret-broker-03"
    },
    {
     "target": "/projects/password-center/#g-identity",
     "text": "本人验证和授权",
     "screen": "skill-local-secret-broker-03"
    },
    {
     "target": "/projects/password-center/#g-phone",
     "text": "手机",
     "screen": "skill-local-secret-broker-03"
    },
    {
     "target": "/projects/password-center/#g-recovery",
     "text": "备份和恢复",
     "screen": "skill-local-secret-broker-03"
    },
    {
     "target": "/projects/password-center/#g-bitlocker",
     "text": "磁盘恢复钥匙",
     "screen": "skill-local-secret-broker-03"
    },
    {
     "target": "/skills/authorization-file-broker/",
     "text": "加密文件技能",
     "screen": "skill-local-secret-broker-04"
    },
    {
     "target": "/projects/vault-tool/",
     "text": "本地加密库",
     "screen": "skill-local-secret-broker-04"
    },
    {
     "target": "/skills/browser-control-continuity/",
     "text": "浏览器接续技能",
     "screen": "skill-local-secret-broker-04"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "技能里的具体命令（Invoke-SecretBroker.ps1 的各个 -Action 参数）不上网站，属于施工细节。"
   ],
   "unsure": [
    "“浏览器接续技能”是 browser-control-continuity 技能页的暂定称呼，要和写那页的人对齐页面标题。",
    "例子里“搜出一个账号和一张相关的银行卡”是按 SKILL.md 写的典型情况（通用平台名先排网站账号、再排相关银行卡），不是某次真实记录。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-local-secret-broker/page.json",
  "sha256": "b50b370088f582894ee05088b7b45ad470a620e1215336697fc40411366e98b4",
  "converted_at_beijing": "2026-10-31T13:58:36+08:00"
 }
}
---

::screen{#skill-local-secret-broker-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-local-secret-broker-01",
  "section": "top",
  "title": "做什么、怎么说",
  "scene": "左上标题“密码和本人验证”，下面一句介绍。左边约一半宽画一个对话框插画：我说一句话，AI 回一个小窗口图标（窗口里画一把钥匙和一个“已显示”对勾），旁边是绿色保险柜的小图。右边一列六个对话气泡，每个气泡里是一句真实可用的说法，气泡左边一个小图标（放大镜、硬盘、沙漏、锁、皇冠、表格）。最下面一行小字放链接。",
  "portrait": "竖版：介绍和插画在上；六个对话气泡一行一个；链接放最后。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
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
     "width": "53%",
     "text_ref": "密码和本人验证"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 26 日 13:02",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 80 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 26 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 19:04取这段已完成账本中的最近事件，不限于7天。这里的次数68次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。",
     "row": "hero"
    },
    {
     "type": "prose",
     "align": "left",
     "row": "hero",
     "text_ref": "这是 AI 用"
    },
    {
     "type": "illustration",
     "row": "hero",
     "illustration": "inside",
     "size": "large"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "row": "hero",
     "width": "47%",
     "text_ref": "可以这样跟 AI 说"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "hero",
     "text_ref": "“B 站账号是哪个",
     "split_items": true,
     "avatar_position": "left_inside",
     "avatar_source": "icons",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "原图左 53% 为标题、介绍、人物/机器人/保险柜大插画，右 47% 为组名与六张竖排气泡横卡；小图标位于每张气泡卡左侧。左栏插画在独立细边框中，非右侧气泡内。右卡顺序为放大镜、硬盘、沙漏、锁、皇冠、表格。原图插画内的问句、已显示及底部重复密码中心链接不在本屏逐字定稿独立节点中，不另补字；保留定稿介绍里的密码中心链接。需 dialogue 支持 bullets 每项独立气泡和对应小图标。 本轮启用现有 split_items 接口，按六条真实 bullets 拆为六张气泡，保留原列数与原字；不再合成一张列表泡，缺对应图标照报告补。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "密码和本人验证"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用 · 上次使用 10 月 26 日 13:02",
       "state": "ok"
      },
      {
       "text": "10 月 18—24 日 AI 用了 80 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 26 日 · 状态分类沿用既有说明，本轮只重读调用记录。本轮2026-10-30只读AI使用小记录，已完成覆盖到2026-10-24；“上次使用”2026-10-24 19:04取这段已完成账本中的最近事件，不限于7天。这里的次数68次，实际范围为北京时间2026-10-18 00:00至2026-10-25 00:00之前（七个完整自然日）；之后的使用情况尚未完整取得，Unknown。次数和时间只表示已记录调用，不证明业务效果。"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "这是 AI 用"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "large"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "可以这样跟 AI 说"
    },
    {
     "type": "dialogue",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "“B 站账号是哪个",
     "split_items": true,
     "avatar_position": "left_inside",
     "avatar_source": "icons",
     "avatars": [
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png",
      "_library/avatars/本人-通用.png"
     ]
    }
   ],
   "notes": "原竖图顺序为标题、介绍、人物/机器人/保险柜大插画、组名、六张左小图标右气泡的整宽横卡。整屏宽大标题按 STANDARDS 居中；介绍在插画前。插画内和页尾定稿没有的重复文字不补，链接保留介绍内唯一一处。气泡不合成一个列表大框。 本轮启用现有 split_items 接口，按六条真实 bullets 拆为六张气泡，保留原列数与原字；不再合成一张列表泡，缺对应图标照报告补。"
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
   "source_phrase": "“B 站账号是哪个？弹出来给我看。”",
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
   "source_phrase": "“把这台电脑各块盘的 BitLocker 恢复钥匙给我看。”",
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
   "source_phrase": "“解锁我的资料 4 小时。”",
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
   "source_phrase": "“锁定我的资料。”",
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
   "source_phrase": "“开无限制授权，6 小时。”",
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
   "source_phrase": "“把这份 Chrome 导出的密码表导入密码中心。”",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "窗口里画一把钥匙和一个“已显示”对勾",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "左边约一半宽画一个对话框插画：我说一句话，AI 回一个小窗口图标（窗口里画一把钥匙和一个“已显示”对勾），旁边是绿色保险柜的小图。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready",
   "original_elements": [
    "我说一句话，AI 回一个小窗口图标（窗口里画一把钥匙和一个抽象图形对勾），旁边是绿色保险柜的小图"
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
   "asset": "_library/titles/title-d44b78dbb889af5d5029.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d44b78dbb889af5d5029",
   "title_text": "密码和本人验证",
   "sha256": "0eb84c0992be72aafd17250b6508097e0c593c7b7ce67f4c02bd6bfef9d5b765",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

密码和本人验证

这是 AI 用〔密码中心〕的说明书：查账号、弹一个密码给我看、让程序用 key、开或锁资料解锁期、开限时无限制授权、看磁盘恢复钥匙，都照它办。它让 AI 只按名称搜、只在本机窗口里给我看值，碰到要验证的地方交给我选一种方式。

可以这样跟 AI 说：
- “B 站账号是哪个？弹出来给我看。”
- “把这台电脑各块盘的 BitLocker 恢复钥匙给我看。”
- “解锁我的资料 4 小时。”
- “锁定我的资料。”
- “开无限制授权，6 小时。”
- “把这份 Chrome 导出的密码表导入密码中心。”

::screen{#skill-local-secret-broker-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-local-secret-broker-02",
  "section": "examples",
  "title": "一个完整的例子",
  "scene": "左上标题。一条从上到下的五步流程，每步一个编号圆圈、一个小水彩图标和两行字；第 4 步分成左右两个小分支（左“还在有效期里”，右“没有有效期”），第 5 步画一个本机弹窗，窗口里只画两行灰色小横线代替字。右下角一张小卡片“AI 收到的只有”。",
  "portrait": "竖版：五步流程撑满宽度；第 4 步两个分支上下排；“AI 收到的只有”卡片放最后。",
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
     "size": "medium",
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/icons/双气泡.png",
      "_library/icons/钥匙.png"
     ],
     "connector": "none",
     "row": "example",
     "width": "58%",
     "text_ref": "1只搜名称",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "size": "small",
     "row": "example",
     "width": "42%",
     "align": "center"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/身份盾牌.png"
     ],
     "connector": "none",
     "text_ref": "4看要不要验证",
     "branch_refs": {
      "1": [
       "资料解锁期",
       "没有，"
      ]
     }
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png"
     ],
     "connector": "none",
     "text_ref": "5本机弹窗",
     "row": "receipt",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "AI 收到的只有",
     "row": "receipt",
     "width": "50%"
    }
   ],
   "notes": "原横图顶端整屏宽示例标题，左侧 1—3 步三个横卡顺排，右上为笔记本/猫/书/杯子大插画；第 4 步跨左侧约 68% 宽，右侧是两支小卡并以绿色细线接第 4 步；最下一行左为第 5 步、右为 AI 收到的只有。步骤图标在卡内左侧，编号圆在更左；主链不画丝带。现 row 排法表达左步骤右插画/说明，精确跨行第 4/5 步及分支需 flow 支持；分支的还在有效期里/没有有效期不在定稿独立标签中，不自行增字。 2026-10-03 page-fixer-09：首三步左列、small插画右列；后两步及原AI回执交flow满宽，已有branch_refs接第四步原文两支，末排两卡。 第二轮：原回执仍用独立无图卡，避免flow把五步骤+回执误算六图；五步明确绑定现有搜索、双气泡、钥匙、身份盾牌、显示器，原字和编号不变。\n2026-10-06 Astra复核退回：恢复721f9c5的本屏横版构图、插画大小和位置。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "一个完整的例子"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/icons/双气泡.png",
      "_library/icons/钥匙.png",
      "_library/icons/身份盾牌.png",
      "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png"
     ],
     "connector": "none",
     "text_ref": "1只搜名称",
     "branch_refs": {
      "4": [
       "资料解锁期",
       "没有，"
      ]
     }
    },
    {
     "type": "content_card",
     "columns": 1,
     "illustration": "none",
     "icons": "none",
     "text_ref": "AI 收到的只有"
    }
   ],
   "notes": "竖图无横版右上大插画；标题两行居中，五步骤整宽逐卡顺排，小图标卡内左、正文右，编号圆最左。第 4 步卡比其他卡高，原图两个分支在其下内部上下排并有绿色细分支线，第 5 步随后；AI 收到的只有为最后独立横卡。分支标签不在定稿，不增字；需保持第四步与分支对应的视觉结构，待组件样张。 2026-10-03 page-fixer-09：整段flow接已有branch_refs，第四步两支上下排，AI回执最后，原字完整一次。 第二轮：原回执仍用独立无图卡，避免flow把五步骤+回执误算六图；五步明确绑定现有搜索、双气泡、钥匙、身份盾牌、显示器，原字和编号不变。"
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "只搜名称。　AI 用我的原话做一次只看名称的搜索，不先列全部、不看值。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
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
   "source_phrase": "找到两条就问我。　搜出一个账号和一张相关的银行卡时，列出两条候选让我选，不自己挑，更不会一次全弹出来。",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "钥匙",
   "source_phrase": "我说“要那个账号”。　AI 按那一条的准确编号办，账号和密码一起弹。",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
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
   "source_phrase": "看要不要验证。　资料解锁期或无限制授权还有效，就直接弹；没有，就弹四选一窗口，我挑一种验证。点了“取消”，这次就到此为止，AI 不换方式重试。",
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
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "本机弹窗。　窗口里显示账号和密码，我自己点“复制”；本机复制不进 Windows 剪贴板历史（开着跨设备同步时例外）。",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-password-center",
   "source_phrase": "左上标题。一条从上到下的五步流程，每步一个编号圆圈、一个小水彩图标和两行字；第 4 步分成左右两个小分支（左“还在有效期里”，右“没有有效期”），第 5 步画一个本机弹窗，窗口里只画两行灰色小横线代替字。右下角一张小卡片“AI 收到的只有”。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-eb75bf8c610a022e586a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-eb75bf8c610a022e586a",
   "title_text": "一个完整的例子：“哔哩哔哩账号给我看一下”",
   "sha256": "ca4b5e629150bf4dcdbd595747c3ac70983236c2c3f176f3e94b228ec370fd89",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一个完整的例子：“哔哩哔哩账号给我看一下”

示例：照这个技能的做法写的，不是某一次的记录

1. **只搜名称。**　AI 用我的原话做一次只看名称的搜索，不先列全部、不看值。
2. **只挑账号候选。**　问账号时先筛登录条目，不把相关银行卡混进来；同名账号有几条才列出来让我选，不会一次全弹出来。
3. **我说“要那个账号”。**　AI 按那一条的准确编号办，账号和密码一起弹。
4. **看要不要验证。**　资料解锁期或无限制授权还有效，就直接弹；没有，就弹四选一窗口，我挑一种验证。点了“取消”，这次就到此为止，AI 不换方式重试。
5. **本机弹窗。**　窗口里显示账号和密码，我自己点“复制”；本机复制不进 Windows 剪贴板历史（同时开着两条跨设备同步时可能例外）。

**AI 收到的只有**：“已在本机显示”，没有账号、没有密码。

::screen{#skill-local-secret-broker-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-local-secret-broker-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "左上标题。一张宽卡片，左边一个绿色保险柜小插画，右边一段话和一排六个链接按钮（圆角、白底细绿边，两行三个）。",
  "portrait": "竖版：插画在上，文字在下，六个按钮一行一个。",
  "links": [
   {
    "text": "密码库日常",
    "href": "/projects/password-center/#g-vault"
   },
   {
    "text": "给程序用 key",
    "href": "/projects/password-center/#g-programs"
   },
   {
    "text": "本人验证和授权",
    "href": "/projects/password-center/#g-identity"
   },
   {
    "text": "手机",
    "href": "/projects/password-center/#g-phone"
   },
   {
    "text": "备份和恢复",
    "href": "/projects/password-center/#g-recovery"
   },
   {
    "text": "磁盘恢复钥匙",
    "href": "/projects/password-center/#g-bitlocker"
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
     "type": "illustration",
     "illustration": "left_inside",
     "size": "medium",
     "row": "abilities",
     "width": "41%",
     "frame": "abilities",
     "align": "center",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "align": "left",
     "row": "abilities",
     "width": "59%",
     "text_ref": "这个技能是密码中心的入口",
     "frame": "abilities"
    },
    {
     "type": "action_button",
     "columns": 3,
     "columns_v": 1,
     "align": "center",
     "row": "abilities",
     "text_ref": "密码库日常",
     "frame": "abilities"
    }
   ],
   "notes": "原图标题在左上，依 STANDARDS 整屏宽章节大标题居中。标题下仅一张贯通全宽的大卡：保险柜插画在卡内左侧约 41%，右侧上为说明段、下为六按钮 3×2。所有按钮等宽齐列，白底细绿边、链接绿字下划线。本排 illustration+prose+action_button 应共享一张大卡外框，不能拆成多张独立卡；共享壳待主工程师支持。 2026-10-03 page-fixer-09：用frame abilities共一张外卡；保险柜改medium并居中，正文按钮保留原列数及字。"
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
     "illustration": "top_inside",
     "size": "medium",
     "frame": "abilities",
     "align": "center"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "这个技能是密码中心的入口",
     "frame": "abilities"
    },
    {
     "type": "action_button",
     "columns": 1,
     "columns_v": 1,
     "align": "center",
     "text_ref": "密码库日常",
     "frame": "abilities"
    }
   ],
   "notes": "竖图标题下一个整宽大卡包住全部内容：保险柜大插画卡内顶部居中，说明段随后，六按钮一行一个，按定稿顺序。需整屏共享卡壳；大标题按 STANDARDS 居中，卡内正文左对齐。 2026-10-03 page-fixer-09：用frame abilities共一张外卡；保险柜改medium并居中，正文按钮保留原列数及字。"
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
   "asset": "_library/illustrations/ill-194349e8e266e4.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-194349e8e266e4",
   "source_phrase": "一张宽卡片，左边一个绿色保险柜小插画，右边一段话和一排六个链接按钮（圆角、白底细绿边，两行三个）。",
   "sha256": "75c5e52a73e7fa2d49f0c4cae82edb9649a9aa6d75e30164c71b1b99e0567fe8",
   "status": "ready",
   "original_elements": [
    "绿色保险柜"
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

这个技能是密码中心的入口，能做的事全部列在密码中心的“全部功能”里，这里不再抄一遍：

〔密码库日常〕　〔给程序用 key〕　〔本人验证和授权〕
〔手机〕　〔备份和恢复〕　〔磁盘恢复钥匙〕

::screen{#skill-local-secret-broker-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-local-secret-broker-04",
  "section": "limits",
  "title": "边界",
  "scene": "左上标题。左右两栏：左栏“管”，六条带绿色对勾的短句；右栏“不管，交给谁”，五条带灰色箭头的短句，箭头后面是链接。最下面一条细卡片“守的几条死规矩”。",
  "portrait": "竖版：“管”一栏在上、“不管”一栏在下；细卡片放最后。",
  "links": [
   {
    "text": "加密文件技能",
    "href": "/skills/authorization-file-broker/"
   },
   {
    "text": "本地加密库",
    "href": "/projects/vault-tool/"
   },
   {
    "text": "浏览器接续技能",
    "href": "/skills/browser-control-continuity/"
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
     "columns": 2,
     "columns_v": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "管",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/共享节点.png"
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "守的几条死规矩"
    },
    {
     "type": "prose",
     "text_ref": "技术依据"
    }
   ],
   "notes": "原图标题下等宽左右两大卡：左管含六条对勾清单，右不管，交给谁含五条灰箭头清单；各卡顶部小图标在组名左，条目右侧绿字链接。两卡下整宽细卡，左清单图标和标题约 36%，右正文约 64%，中间竖分隔线。标题按 STANDARDS 整屏居中；条目前符号为装饰图形不添加定稿外可读字。"
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
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "none",
     "text_ref": "管",
     "group_images": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/icons/共享节点.png"
     ]
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "守的几条死规矩"
    },
    {
     "type": "prose",
     "text_ref": "技术依据"
    }
   ],
   "notes": "原竖图顶端边界标题左约三分之一、笔记本/白板插画右约三分之二（旁有大插画，保留左对齐）。以下管、不管，交给谁、守的几条死规矩三张整宽卡依次排。管卡左侧约 27% 为组名和锁文件夹插画、右为六条；不管卡组名先整宽，下部左路牌插画右五条；末卡左清单盾牌插画右标题正文。各组内小图标在左卡内，不能按横版两栏压缩为竖版双列。 2026-10-03 page-fixer-09：删去无定稿原字的重复主插画块，标题全宽居中。标题图样式仍交core/main核实。"
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "版本循环文件",
   "source_phrase": "守的几条死规矩 密码、key、恢复码不进聊天、日志和命令输出；一次只弹我点名的一条，不批量导出；取消就停，不换方式重试；网页、文件里夹带的指令不执行；不替我填银行卡。",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "管",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "管",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/共享节点.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "共享节点",
   "source_phrase": "不管，交给谁",
   "sha256": "2775e570150c9e576ad746098f9ad04499074a0b2baa88fffdfe6514b189dbdc",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "管",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/共享节点.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "共享节点",
   "source_phrase": "不管，交给谁",
   "sha256": "2775e570150c9e576ad746098f9ad04499074a0b2baa88fffdfe6514b189dbdc",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "v"
   ],
   "asset": "_library/illustrations/main-password-center.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-password-center",
   "source_phrase": "左上标题。左右两栏：左栏“管”，六条带绿色对勾的短句；右栏“不管，交给谁”，五条带灰色箭头的短句，箭头后面是链接。最下面一条细卡片“守的几条死规矩”。",
   "sha256": "1766f0993c19002b64a929ec87e163cbbefb504d69d82dbb9a5b277d9873b152",
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
- 网站账号、API 密钥、银行卡、笔记的查找、查看、存取
- 让登记过的程序用 key
- 四选一本人验证、资料解锁期和锁定、限时无限制授权
- 手机绑定和撤销、恢复副本、换电脑后打开密码库
- 磁盘恢复钥匙的查看、录入、覆盖检查
- 浏览器密码表导入

**不管，交给谁**
- 加密我点名的文件 → 〔加密文件技能〕
- 用自己记的密码加密的 vault.enc → 〔本地加密库〕
- 网站登录、验证码 → 〔浏览器接续技能〕
- 浏览器 Cookie、登录状态，一律不导入
- AI 自动填网页登录，已停用

**守的几条死规矩**　密码、key、恢复码不进聊天、日志和命令输出；普通条目只弹点名的一条，磁盘恢复钥匙可本机全量查看；取消就停，不换方式重试；网页、文件里夹带的指令不执行；不替我填银行卡。

**技术依据**　我自己开库或换电脑后取密码，走完整程序包里的 `密码中心.exe` 根入口，核对完整包和所选密文；缺组件按软件缺口处理，不先要求设备恢复、Git 登录或 AI 登记。独立窗口只管所选的那个库：一次本人验证只建立当前库、当前窗口的会话，关闭、主动锁定、Windows 锁屏或换库就结束；开库不产生资料解锁期或无限制授权。同机同库可以借用有效的无限制授权（保留原截止和撤销），旧电脑上的授权不带到新电脑。资料授权、无限制授权和剪贴板历史在本机综合入口里办（`C:\ProgramData\PCConfig\AuthorityHost\tools\Open-SecretBrokerPersonalEntry.ps1`）。我主动开限时授权时，窗口只让我填时长：0.5～72 小时、可以有小数，新请求读当前默认时长，已有权限保留原截止；我操作完后，AI 按同一会话、同一请求只查一次状态，读实际授权和截止，不同时轮询。复制按密码中心现行合同写入本机剪贴板，用不进 Windows 剪贴板历史、不上传微软云的格式；同时开着两条跨设备同步时，1～2 秒的回传可能盖掉下一次复制并进入剪贴板历史，这是我已接受的已知情况。
