---
{
 "title": "重大 Git/GitHub 变更保护与人类确认边界",
 "kind": "project",
 "url": "/projects/github-index/protected-major-actions/",
 "tagline": "",
 "toc": [
  {
   "id": "top",
   "label": "开头"
  },
  {
   "id": "usage",
   "label": "怎么用"
  },
  {
   "id": "tech",
   "label": "技术"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "github-index-protected-major-actions",
  "kind": "project",
  "title": "重大 Git/GitHub 变更保护与人类确认边界",
  "url": "/projects/github-index/protected-major-actions/",
  "parent": "github-local-index",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "GitHub 总索引源码（入口 9 月 27 日重写 b7fb62f、9 月 29 日加入先预演 e2ccb371，当前 HEAD e792eda）与已核验活动规则 E257 的保护合同；重写后无实际使用记录，待验收。"
  }
 },
 "source": {
  "page": "sources/pages/github-index-protected-major-actions/page.json",
  "sha256": "d773d8bcf995a597e96cc76e1643685914e4bd1838cc231ca5346d08c4ae9fe0",
  "converted_at_beijing": "2026-10-30T13:04:16+08:00"
 }
}
---

::screen{#github-index-protected-major-actions-01 section="top"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-01",
  "section": "top",
  "title": "重大 Git/GitHub 变更保护与人类确认边界",
  "links": [
   {
    "text": "回到项目 → GitHub 项目总索引",
    "href": "/projects/github-index/"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/github-index/#ai-brief"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "重大 Git/GitHub 变更保护与人类确认边界",
     "align": "left",
     "size": "large",
     "row": "top",
     "width": "58%",
     "row_fit_illustration": true
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（入口 9 月 27 日重写 b7fb62f、9 月 29 日加入先预演 e2ccb371，当前 HEAD e792eda）与已核验活动规则 E257 的保护合同；重写后无实际使用记录，待验收。",
     "row": "top"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕",
     "row": "top",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "GitHub 总索引 · 功能说明",
     "row": "top"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "top",
     "width": "42%",
     "align": "center"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "重大 Git/GitHub 变更保护与人类确认边界",
     "align": "left",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "常用",
       "state": "ok"
      }
     ],
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（入口 9 月 27 日重写 b7fb62f、9 月 29 日加入先预演 e2ccb371，当前 HEAD e792eda）与已核验活动规则 E257 的保护合同；重写后无实际使用记录，待验收。"
    },
    {
     "type": "action_button",
     "text_ref": "〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕",
     "brand_icons": {
      "GitHub": "_library/icons/GitHub标志.png"
     }
    },
    {
     "type": "prose",
     "text_ref": "GitHub 总索引 · 功能说明"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "center"
    }
   ]
  }
 },
 "images": [
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "asset": "_library/module-illustrations/github-index/protected-major-actions-v01.png",
   "key": "main-github-local-index",
   "source_phrase": "右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。",
   "sha256": "f6a8485326234a4cb73bee9e7e84b6b72345983f7a01a603f12234f852973252",
   "status": "ready"
  }
 ]
}
```

# 重大 Git/GitHub 变更保护与人类确认边界

〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕

GitHub 总索引 · 功能说明

仓库改名、改公开范围、删库或转移等重大变化，先绑住唯一目标、把能保全的内容保全好，再只执行这一项并回读。只有删库、转移和把非公开仓库改成公开这三类需要本人验证；新建公开仓库不再另做身份验证，但仍要本人明确同意、参数写准、建完回读；普通提交与正常推送照常走普通 Git。

**当前情况：**9 月 27 日改写成一个直接调用的入口，支持 10 种固定操作；9 月 29 日又给删库和转移加上“先预演、再正式执行”；10 月 27 日起新建公开仓库不再要本人验证（提交 b3b38c2）。改写后还没有实际使用记录，功能待验收；9 月 1 日建私有仓库的真实结果属于旧版本。

项目事实核对截至 2026-10-11 14:00（北京时间）；14:00 后的现场读数单独注明时间；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#github-index-protected-major-actions-02 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-02",
  "section": "usage",
  "title": "这项功能怎样使用",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-product",
    "text": "这项功能怎样使用"
   },
   {
    "id": "module-product",
    "text": "这项功能怎样使用"
   },
   {
    "id": "module-product-title",
    "text": "这项功能怎样使用"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这项功能怎样使用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "为什么需要它",
     "columns": 3,
     "last_full_width": false,
     "icon_position": "header_left",
     "header_icon": [
      "_library/round3/clean-assets/png/05-灯泡-clean.png",
      "_library/icons/双气泡.png",
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png"
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "这项功能怎样使用",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "为什么需要它",
     "columns": 1,
     "icon_position": "header_left",
     "header_icon": [
      "_library/round3/clean-assets/png/05-灯泡-clean.png",
      "_library/icons/双气泡.png",
      "_library/round3/clean-assets/png/16-纸箱对勾-clean.png"
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "key": "灯泡",
   "source_phrase": "冻结页迁移固定图标：why",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/icons/双气泡.png",
   "key": "双气泡",
   "source_phrase": "冻结页迁移固定图标：example",
   "sha256": "5f731d436981307abb0cf9d0e4327d2902a8f816dce649fa2f079ca9107b7433",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "asset": "_library/round3/clean-assets/png/16-纸箱对勾-clean.png",
   "key": "纸箱对勾",
   "source_phrase": "冻结页迁移固定图标：result",
   "sha256": "fe49f8097865f43368bd63749719f34865ace303c8e15ce1807066c9f9a8c9f5",
   "status": "ready"
  }
 ]
}
```

## 这项功能怎样使用

用途与实际影响

## 为什么需要它

仓库改名、改变公开范围或删历史会影响别人看到什么、还能找回什么；目标错一个字就可能改错仓库。系统只对这一项真实变化做判断，只有删库、转移、把非公开仓库改成公开这三类才请本人验证，不把每次普通提交都叫来本人验证。新建公开仓库不另做身份验证，但它会让新东西对外可见，所以仍要我明确说要建、建成公开，AI 不会自己决定建公开库。

## 举个实际例子

比如我说“把仓库改名，但公开性和默认分支都别动”。系统先固定旧名称、仓库唯一 ID、可见性、默认分支，并确认新名称没有冲突；改名不属于要本人验证的三类，所以直接只执行改名。做完立即从新名称回读同一仓库 ID，并确认可见性和默认分支原样不动。任何目标漂移都会停下，而不是顺手改 owner 或其他设置。

## 最后我会得到什么

拿到明确的变更目标、执行前后状态以及是否还需本人验证；删库或转移前，我还会先看到一份损失清单：哪些 Git 内容已经保全、哪些网页内容只列了名字、哪些根本不在备份里。执行后从仓库现场核对；结果暂时不明时先查仓库，不重复发起可能已经发生的重大动作。

::screen{#github-index-protected-major-actions-03 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-03",
  "section": "usage",
  "title": "结果怎么看",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "结果怎么看",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "正常时",
     "columns": 3,
     "last_full_width": false,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons/试管对勾.png",
      "_library/round3/clean-assets/png/31-报警灯-clean.png",
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png"
     ]
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "结果怎么看",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "正常时",
     "columns": 1,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons/试管对勾.png",
      "_library/round3/clean-assets/png/31-报警灯-clean.png",
      "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png"
     ]
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/试管对勾.png",
   "key": "绿色测试通过",
   "source_phrase": "冻结页迁移固定图标：normal",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/round3/clean-assets/png/31-报警灯-clean.png",
   "key": "报警灯",
   "source_phrase": "冻结页迁移固定图标：problem",
   "sha256": "a7ac06abb238393f741ac172f2b0996e7cbb4a33a27953f53eb6776d5f8875be",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "asset": "_library/hires-icons-r2/icon-clean-d819641dd52018c42577.png",
   "key": "断开插头",
   "source_phrase": "冻结页迁移固定图标：unavailable",
   "sha256": "974fc896ff7e0b11f54d9ca28e622f41657acecd7eb02100cfa42c945052a1f3",
   "status": "ready"
  }
 ]
}
```

## 结果怎么看

## 正常时

目标仓库、旧状态、内容保全与必要确认都吻合后，只执行点名的这一项，并回读真实仓库。

## 发现问题时

目标变化、内容保全失败或远端部分完成时停下：保全失败直接停；已发生的结果保留，只补真正没完成的步骤。

## 入口不可用或证据不足时

仓库现场读不到，或需要本人验证的动作遇到验证入口不可用时，停这项重大动作；普通只读与安全本地工作仍可继续。

::screen{#github-index-protected-major-actions-04 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-04",
  "section": "usage",
  "title": "从哪里开始",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "从哪里开始",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "row": "start",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
     "width": "40%"
    },
    {
     "type": "section_heading",
     "text_ref": "从开始到拿到结果",
     "row": "start",
     "width": "60%",
     "heading_icon": "_library/icons/scene-r3-exact-three-stairs.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. **固定具体变化**　AI 记录旧仓库身份、目标值和不允许改变的设置，先查现场是否吻合；删库或转移先预演，把保全结果和损失范围讲给我。",
     "row": "start",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "从哪里开始",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "source_text_card",
     "text_ref": "需要准备什么",
     "icon_position": "header_left",
     "header_icon": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png"
    },
    {
     "type": "section_heading",
     "text_ref": "从开始到拿到结果",
     "heading_icon": "_library/icons/scene-r3-exact-three-stairs.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. **固定具体变化**　AI 记录旧仓库身份、目标值和不允许改变的设置，先查现场是否吻合；删库或转移先预演，把保全结果和损失范围讲给我。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "key": "工具箱",
   "source_phrase": "冻结页迁移固定图标：inputs",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "asset": "_library/icons/scene-r3-exact-three-stairs.png",
   "key": "上升台阶",
   "source_phrase": "冻结页迁移固定图标：steps",
   "sha256": "b2d695badac77b03b32249a3a6f83eaf9888916136a8657c0f6845b726f4f5a2",
   "status": "ready"
  }
 ]
}
```

## 从哪里开始

在已接入总索引的 AI 对话中明确提出仓库改名、公开性或历史等重大 Git/GitHub 变更，并写清唯一目标。

## 需要准备什么

- 当前仓库和预期新状态

- 哪些设置必须保持

- 可用的恢复或确认方式

## 从开始到拿到结果

1. **固定具体变化**　AI 记录旧仓库身份、目标值和不允许改变的设置，先查现场是否吻合；删库或转移先预演，把保全结果和损失范围讲给我。

2. **按条件取得确认**　只有删库、转移、非公开改公开这三类查无限制授权，没有就请我验证一次；新建公开仓库不查授权、不弹验证，但必须是我明确要求的那一个；其他重大动作和普通提交、推送不附加这一步。

3. **只执行并核对一次**　回读同一仓库、目标状态和未改变项；结果丢失时先查现场，不重复发起可能已完成的动作。

::screen{#github-index-protected-major-actions-05 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-05",
  "section": "tech",
  "title": "技术实现与依据（一）",
  "links": [],
  "anchors": [
   {
    "id": "project-reading-panel-technical",
    "text": "技术实现与依据（一）"
   },
   {
    "id": "module-technical",
    "text": "技术实现与依据（一）"
   },
   {
    "id": "module-technical-title",
    "text": "技术实现与依据"
   }
  ],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 普通本地读取、可逆编辑、定向提交和已授权正常推送不自动升级为重大动作。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "1. 普通本地读取、可逆编辑、定向提交和已授权正常推送不自动升级为重大动作。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/打勾清单.png",
   "key": "打勾清单",
   "source_phrase": "冻结页迁移固定图标：rules",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  }
 ]
}
```

## 技术实现与依据（一）

这里保留实现、关键条件、精确入口、历史记录和验证结果。

当前保护语义以实际执行时核验的现行活动规则为准；现行入口 9 月 27 日重写（b7fb62f），9 月 29 日加入删库/转移先预演（e2ccb371），10 月 27 日去掉新建公开仓库的本人验证（b3b38c2）。重写后没有实际使用记录，生产端到端验证为 Unknown；旧版本的验收只作历史

## 关键规则与设计选择

1. 普通本地读取、可逆编辑、定向提交和已授权正常推送不自动升级为重大动作。

2. 固定 10 种操作：git-local 4 种（delete-local-ref、delete-remote-ref、force-update-local-ref、replace-remote-url），github-api 6 种（create-repository、rename-repository、set-visibility、set-default-branch、delete-repository、transfer-repository）；不开放任意 shell 或 API。

3. create-repository 可在当前账号下建空的 PRIVATE（私有） 或 PUBLIC（公开） 仓库；配置 origin、首次 normal push、默认分支收口和索引登记随后由普通 Git 分别完成，建库不等于项目已经发布。

4. 每种动作使用自己的精确参数、preimage 和 read-back（正式回读）；改名不能顺带改 owner/visibility/default branch（分支），替换 remote（远端仓库） URL 不能变成任意 Git 命令。

5. 是否需要本人验证按 GitHub 三类规则：删库、转移、非公开改公开需要有效的无限制授权，没有就本人验证一次；个人资料已解锁不能替代这次专门验证。新建公开仓库自 10 月 27 日起不另做身份验证，但仍须本人明确同意，并核对精确参数、仓库身份和执行后结果；“不验证”不等于 AI 可以自己决定建公开库。

6. Passkey（通行密钥）、TOTP（动态验证码）、Recovery（恢复码）、Account（账号验证）是四类因子；Google 和 Microsoft 只是 Account 类别的不同 Provider（提供方）。

7. 改名、改默认分支、改成私有、新建私有或公开仓库、更换本人账号下的远端地址，以及内容已被保留的 ref 删除/改写，不请本人验证，也不查无限制授权、资料期或密码中心；内容保全失败就直接停，不改成“请本人验证后继续”。这只是程序分支，调用前合格的 AI 仍按活动规则判断真实后果。

8. 已证层：当前源码和用隔离 Git、模拟 GitHub 与验证服务的测试定义存在；9 月 27 日重写后没有实际使用记录。旧的 C 盘第 79 代、E126/E131 和来源 bfc9f3f 只作历史，不证明现在的 10 类动作。

::screen{#github-index-protected-major-actions-06 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-06",
  "section": "tech",
  "title": "技术实现与依据（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- **旧的提案/能力票据链已退役（2026-09-27）。**原来 Prepare 冻结提案、AuthorizeMajorAction 授权、30 秒单次 Consume 后执行，并绑定签名、nonce（一次性随机凭据）和执行器哈希；现在脚本里没有这些步骤。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- **旧的提案/能力票据链已退役（2026-09-27）。**原来 Prepare 冻结提案、AuthorizeMajorAction 授权、30 秒单次 Consume 后执行，并绑定签名、nonce（一次性随机凭据）和执行器哈希；现在脚本里没有这些步骤。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（二）

## 当前怎样实现

- **旧的提案/能力票据链已退役（2026-09-27）。**原来 Prepare 冻结提案、AuthorizeMajorAction 授权、30 秒单次 Consume 后执行，并绑定签名、nonce（一次性随机凭据）和执行器哈希；现在脚本里没有这些步骤。

- 现行入口 Invoke-ProtectedGitHubMajorAction.ps1（894 行，最低 PowerShell 7.5，结果 schema `github-local-index.protected-major-action-result.v2`）只收 Operation、Repository、RepoPath、ArgumentsPath，以及可选的 DryRun 和验证方式，一次调用 Invoke-GitHubAction。

- 需要本人验证的分支调用已安装的 OwnerTakeover Check 和 SecretBroker VerifyAuthority，核对回执里的 highest_authority_verified 与 human_factor_performed，执行前再重读一次实际目标。

- 验证方式选 Auto 时不传 AuthorityFactor，由现役密码中心在四类方式里选一种；Runtime 身份不能顶替重大动作的本人验证；已有有效的无限制授权就不重复弹出。

- 进程用 ArgumentList 直接启动、不弹窗，Git 和 gh 入口固定；Git 前缀禁用 hooks，但保留调用者现有的有效 Git 凭据，清除的是 GIT_DIR、GIT_COMMON_DIR、GIT_WORK_TREE、GIT_OBJECT_DIRECTORY、GIT_ALTERNATE_OBJECT_DIRECTORIES、GH_HOST 等指定环境覆盖。

- create-repository 绑定 expected_absent、expected_local_branch、expected_head_oid 和 clean 工作树；PUBLIC（公开） 和 PRIVATE（私有） 都不走本人验证分支，建公开库的前提是本人明确同意，首次公开发布内容仍按活动规则单独判断。

- rename-repository 冻结旧/新 slug、同一 id/node_id、visibility（公开或私有属性） 和 default branch（分支）；新 slug 必须 absent，回读必须确认 identity 与除名称外的字段不变。

- ref 删除（本地或远端）和本地强制更新前，先证实原提交另有本地或 GitHub 的分支/标签保留；reflog、不可达对象、只在远端跟踪缓存里的提交都不算保留点；正在检出的分支不删、不强改。

::screen{#github-index-protected-major-actions-07 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-07",
  "section": "tech",
  "title": "技术实现与依据（三）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- 删除远端 ref 用精确 URL 加旧 OID 的 force-with-lease，防止期间别人新推的提交被误删。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "- 删除远端 ref 用精确 URL 加旧 OID 的 force-with-lease，防止期间别人新推的提交被误删。",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（三）

- 删除远端 ref 用精确 URL 加旧 OID 的 force-with-lease，防止期间别人新推的提交被误删。

- 删库和转移固定先用同一命令加 DryRun 预演，由调用的 AI 在正式执行前向本人讲清目标、本地 Git 保全结果、网页独有内容清单、没枚举的类别和损失范围；再去掉 DryRun 正式调用并重新读现场。已知内容或去向变了，就重新预演、重新讲。

- 这两次调用是合同里调用 AI 必须遵守的工作规则：脚本不保存前一次预演的票据，也不强制匹配，不能说成绕不过去的安全墙。DryRun 不查无限制授权、不弹验证、不改 GitHub，但删库/转移的预演会拉取、补全 Git 对象并建保全 refs，所以不是严格零写。

- 删库/转移的 Git 保全：浅克隆先补全，拉取全部分支、标签和历史并核对 OID，缺的本地分支或标签补建，同名但分叉的不覆盖；远端最新提交保存在 `refs/backup/github-major-action/<owner/repo>/objects/<oid>`。

- Git 以外的内容：issue（含 PR）、Release、发布包按全部分页列出标题、名称和链接，只是清单，没有备份内容；Wiki、讨论、项目、Actions 只给入口和已知开关，内容没枚举；Git LFS 外部对象、子模块仓库、Actions 产物和包注册表不在 Git 副本里。工具打印出来不等于本人已看过，损失边界要由 AI 具体讲给本人。

- 网页只展示公开安全的动作类别、规则差异和证据层，不公开因子秘密、账号身份、内部请求材料或可重放参数。

## 执行流程

1. 从 10 种固定操作中选一种，把精确仓库/ref/remote、旧值和目标值写进参数 JSON，不接受自由命令

2. 核对仓库身份、预期字段和同一 id/node_id；ref 类操作先证实原提交另有分支或标签保留

::screen{#github-index-protected-major-actions-08 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-08",
  "section": "tech",
  "title": "技术实现与依据（四）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "3. 删库或转移先带 DryRun 运行同一命令：补全 Git 对象、建保全 refs、列出网页独有内容，由 AI 把目标、保全结果、只列了清单的内容、没枚举的类别和损失范围讲给本人",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "技术实现与依据（四）",
     "size": "large",
     "heading_icon": "_library/hires-icons/打勾清单.png"
    },
    {
     "type": "numbered_steps",
     "text_ref": "3. 删库或转移先带 DryRun 运行同一命令：补全 Git 对象、建保全 refs、列出网页独有内容，由 AI 把目标、保全结果、只列了清单的内容、没枚举的类别和损失范围讲给本人",
     "columns": 1,
     "icons": "none",
     "illustration": "none",
     "connector": "none"
    }
   ]
  }
 },
 "images": []
}
```

## 技术实现与依据（四）

3. 删库或转移先带 DryRun 运行同一命令：补全 Git 对象、建保全 refs、列出网页独有内容，由 AI 把目标、保全结果、只列了清单的内容、没枚举的类别和损失范围讲给本人

4. 属于三类的动作（删库、转移、非公开改公开）：有有效的无限制授权就继续，否则本人验证一次；取消、拒绝或超时就结束本次，不盲目重试

5. 去掉 DryRun 正式调用：重新读现场，核对实际目标和保全 refs；内容或去向变了就重新预演；授权到期就停

6. 固定 Git 参数或固定 GitHub 接口只执行一次；返回失败或响应丢失仍先从本地/GitHub 现场回读

7. read-back（正式回读） 比较操作自己的目标字段：ref OID、remote（远端仓库） URL、repo identity/visibility/name/default branch（分支）/existence/owner；只有 executed_verified 才算已证实，read_back_failed 或 effect_failed_state_unknown 如实保留“可能已改变”，不自动重试；转移是异步的，没证实就不报完成

8. create 之后另做 origin、normal push、default-branch convergence 与索引登记；其他动作成功后也只报告精确字段变化，项目发布/恢复继续由对应 Owner 完成

::screen{#github-index-protected-major-actions-09 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-09",
  "section": "tech",
  "title": "名词和入口（一）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口（一）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口（一）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  }
 },
 "images": []
}
```

## 名词和入口（一）

## 本模块用到的名词

| 名词 | 意思 |
| --- | --- |
| Major action（重大动作） | 会删除、转移、公开、重命名或改变仓库关键身份和恢复路径的 GitHub 现实操作。 |
| Typed effect（类型化动作） | 十个固定操作之一，使用封闭字段、固定参数、固定接口与回读合同；不是通用 shell 或 GitHub API 通道。 |
| Proposal（动作提案，已退役） | 旧路线里 Prepare 冻结的短时候选；2026-09-27 起不再使用。 |
| Single-use capability（单次执行能力，已退役） | 旧路线的 30 秒单次执行票据；现在没有票据，每次正式执行前直接重读现场。 |
| DryRun（预演） | 删库/转移前必做的同命令预演：不查授权、不弹验证、不改 GitHub，但会拉取、补全 Git 对象并建保全 refs，所以不是严格零写。 |
| Human factor（人类因子） | Passkey、TOTP、Recovery、Account 四类已登记证明中的任一类；只有删库、转移、非公开改公开这三类 GitHub 动作在没有无限制授权时需要。 |
| Semantic decision（语义判断） | 调用前由合格 AI 结合真实目标、范围、影响和可恢复性判断；程序的普通分支不查密码中心，不等于取消这层判断。 |
| Preservation ref（保全引用） | 删库/转移前把远端最新提交保存在 `refs/backup/github-major-action/…` 下；只保 Git 内容。 |

::screen{#github-index-protected-major-actions-10 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-10",
  "section": "tech",
  "title": "名词和入口（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口（二）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "名词和入口（二）",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "名词"
    }
   ]
  }
 },
 "images": []
}
```

## 名词和入口（二）

| 名词 | 意思 |
| --- | --- |
| Preimage（变更前状态） | 动作前真实仓库身份、可见性、默认分支或远端配置，用于判断漂移和恢复。 |
| Read-back（正式回读） | 动作之后从 GitHub Owner 现场重新读取最终状态；命令返回成功不能替代它。 |

## 专业定义

建空仓库、删库、转移、改名、改可见性、换默认分支或远端、删改 ref，都必须绑住精确目标并事后回读；只有删库、转移、非公开改公开这三类动作请本人验证；新建公开仓库不另做验证但须本人明确同意；普通 Git 不因此层层弹确认。

::screen{#github-index-protected-major-actions-11 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-11",
  "section": "tech",
  "title": "出问题时（一）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 管理员权限、插件、账号登录或适配器存在都不产生用户授权",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 管理员权限、插件、账号登录或适配器存在都不产生用户授权",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons-r2/扳手.png",
   "key": "扳手",
   "source_phrase": "冻结页迁移固定图标：failure",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  }
 ]
}
```

## 出问题时（一）

解决什么

重大动作要区分源码支持、某次真实动作完成和当前执行路线可用。删库和转移还要让我事先看清哪些内容能保住、哪些只是列了清单、哪些根本没有备份。改写后的入口还没有实际使用记录，所以这里只说已实现、待验收，不说已验证。

## 边界

- 管理员权限、插件、账号登录或适配器存在都不产生用户授权

- 普通提交和正常推送不会仅因使用 GitHub 就自动要求人类因子

- 10 个固定操作是闭集；不开放任意 shell、任意 Git 参数、任意 gh alias/extension、任意接口或任意 payload

- DryRun 不查无限制授权、不弹验证、不改 GitHub；删库/转移的预演会拉取并建保全 refs，不是严格零写

- 人类因子值、恢复秘密、账号身份和一次性执行材料不进入公开网页

- “先预演、再正式执行”是调用 AI 必须遵守的工作规则；脚本不保存预演票据、不强制匹配，不能说成绕不过去的安全墙

- Git LFS 外部对象、子模块仓库、Actions 产物和包注册表不在 Git 副本里；issue、Release、发布包只列清单，不备份内容

## 失败与恢复

- **改写后还没有某项实际使用记录，或真实调用发现入口/验证服务失效**：前者只标待验收，不单凭网页拒绝已授权动作；执行时现场核对精确目标，以真实回执和回读为准。实际失败只停受影响动作，普通工作继续。

::screen{#github-index-protected-major-actions-12 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-12",
  "section": "tech",
  "title": "出问题时（二）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **删除/强更 ref 的原提交没有别的分支或标签保留，或远端 URL/旧 OID 不再匹配**：停止，保留当前 ref/remote（远端仓库） 并重新取证；不把目标漂移当作允许覆盖。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **删除/强更 ref 的原提交没有别的分支或标签保留，或远端 URL/旧 OID 不再匹配**：停止，保留当前 ref/remote（远端仓库） 并重新取证；不把目标漂移当作允许覆盖。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons-r2/扳手.png",
   "key": "扳手",
   "source_phrase": "冻结页迁移固定图标：failure",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  }
 ]
}
```

## 出问题时（二）

- **删除/强更 ref 的原提交没有别的分支或标签保留，或远端 URL/旧 OID 不再匹配**：停止，保留当前 ref/remote（远端仓库） 并重新取证；不把目标漂移当作允许覆盖。

- **改名目标已存在，或改名后 id/node_id、visibility（公开或私有属性）、default branch（分支） 变化**：停止并报告 identity/read-back（正式回读） mismatch；不把另一仓库或顺带字段变更写成成功。

- **set-visibility、set-default-branch、delete 或 transfer 后回读不一致**：如实标 read_back_failed 或 effect_failed_state_unknown，先从 GitHub 现场确认最终 visibility（公开或私有属性）/branch/existence/owner；禁止盲目重放。

- **创建前同名远端已存在、登录 owner 不符或本地 branch（分支）/HEAD/clean 漂移**：create-repository 失败关闭；保留本地仓库，先确认是接入已有远端、改名还是修复本地 preimage。

- **空仓库已创建，但配置 origin 或首次 push 失败**：不再调用 create；从已回读的同一 identity 继续普通 Git 收敛，保留本地首个提交并在完成默认分支回读后再登记。

- **首次 push 成功但默认分支或索引登记未闭合**：把远端提交保留为已完成事实；显式修正/确认 default branch（分支），再刷新导航和基线，不删除或重建仓库。

- **仓库身份、可见性或目标动作漂移**：停下重新取得现场事实；不能拿旧仓库名或旧可见性继续。

- **内容保全失败**（补全历史、核对 OID 或建保全 refs 没成功）：直接停，不改成请本人验证后继续。

::screen{#github-index-protected-major-actions-13 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-13",
  "section": "tech",
  "title": "出问题时（三）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **人类验证取消、拒绝、超时或 Provider 不可用**：结束本次未执行的重大动作，不盲目重试，不自动换另一因子，也不改变设备信任。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "出问题时（三）",
     "size": "large",
     "heading_icon": "_library/hires-icons-r2/扳手.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- **人类验证取消、拒绝、超时或 Provider 不可用**：结束本次未执行的重大动作，不盲目重试，不自动换另一因子，也不改变设备信任。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons-r2/扳手.png",
   "key": "扳手",
   "source_phrase": "冻结页迁移固定图标：failure",
   "sha256": "c7bce5595c6ff1262404f84f83793a1e1cda2660078c4ef0eacf676774f9aa28",
   "status": "ready"
  }
 ]
}
```

## 出问题时（三）

- **人类验证取消、拒绝、超时或 Provider 不可用**：结束本次未执行的重大动作，不盲目重试，不自动换另一因子，也不改变设备信任。

- **动作响应丢失或正式回读与预期不一致**：保留同一尝试，先从 GitHub 现场回读，标记现实状态未收敛并进入恢复或人工协调；禁止直接重放删除、转移、改名或公开操作，也不以本地日志冒充完成。

::screen{#github-index-protected-major-actions-14 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-14",
  "section": "tech",
  "title": "依据与来源（一）",
  "links": [],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- Git/GitHub 重大动作合同 `docs/contracts/git.protected-major-actions.md`（一次调用、先预演、内容保全和回读）",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（一）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- Git/GitHub 重大动作合同 `docs/contracts/git.protected-major-actions.md`（一次调用、先预演、内容保全和回读）",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/数据库.png",
   "key": "数据库",
   "source_phrase": "冻结页迁移固定图标：sources",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  }
 ]
}
```

## 依据与来源（一）

## 真实入口

- Git/GitHub 重大动作合同 `docs/contracts/git.protected-major-actions.md`（一次调用、先预演、内容保全和回读）

- 现行入口 `tools/Invoke-ProtectedGitHubMajorAction.ps1`；按三类规则决定是否本人验证（10 月 27 日起新建公开仓库不在其中）

- 解析 current（当前状态） E 保护合同路径的当前指针；正文路径由 Inspect 返回

- GitHub 总索引的项目重大动作边界和公开安全规则

## 如何验证

- 2026-08-29 历史提交 6afc858 修复五因子与机械 human_required（需要人类验证）旧语义，并 normal push（正常推送）到当时的公开 main；这是旧版本历史。

- 2026-08-31 Test-ProtectedGitHubMajorAction.ps1 当时通过，测的是旧适配器；9 月 27 日重写后，不能拿它证明现行实现。

- 当前测试 `tests/Test-ProtectedGitHubMajorAction.ps1` 的静态断言覆盖 10 类参数、删库/转移先预演、ref 保留点和 force-with-lease 等，用隔离 Git 和模拟的 GitHub/验证服务，不碰真实仓库；10 月 11 日只读了定义，没有运行。

- 历史 Test-ControlPlaneContracts.ps1、git diff --check 和 staged public-content hook（钩子） 通过；这些是旧层历史，提交前 Hook 已于 2026-09-27 退役。

::screen{#github-index-protected-major-actions-15 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-protected-major-actions-15",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 公开发布",
    "href": "/projects/github-index/publication-gate/"
   },
   {
    "text": "下一个模块 快照与恢复",
    "href": "/projects/github-index/snapshot-recovery/"
   }
  ],
  "anchors": [],
  "live": null,
  "screenshots": [],
  "chain": null,
  "reuse": null
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 2026-08-29 当时的 GitHub API 与 ls-remote 对 refs/heads/main 回读均精确等于 6afc858d418714664a757a4950f65de8a9d3578d；它只是一条历史验收。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "text_ref": "依据与来源（二）",
     "size": "large",
     "heading_icon": "_library/hires-icons/数据库.png"
    },
    {
     "type": "bullet_list",
     "text_ref": "- 2026-08-29 当时的 GitHub API 与 ls-remote 对 refs/heads/main 回读均精确等于 6afc858d418714664a757a4950f65de8a9d3578d；它只是一条历史验收。",
     "columns": 1,
     "icons": "none",
     "illustration": "none"
    }
   ]
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "asset": "_library/hires-icons/数据库.png",
   "key": "数据库",
   "source_phrase": "冻结页迁移固定图标：sources",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
   "status": "ready"
  }
 ]
}
```

## 依据与来源（二）

- 2026-08-29 当时的 GitHub API 与 ls-remote 对 refs/heads/main 回读均精确等于 6afc858d418714664a757a4950f65de8a9d3578d；它只是一条历史验收。

- 2026-09-01 用旧版本真实创建过一个空 PRIVATE（私有） 仓库，9 月 2 日回读了元数据；这是旧版本结果，不外推为重写后已经用过。

- 2026 年 10 月 11 日的历史观察：当时活动规则为 E257，保护合同 SHA-256=5928788380abde6b5ffb7111367e8b57c8c7b6a9545123e3e18713c9deb75caa；当时 Git 代码 e792eda。实际执行时核验现行活动规则。规则身份不证明 10 类动作、当时的四类验证（现为三类）或验证服务的端到端成功；9 月 9 日 E126/E131 的哈希只作历史。

## 与其他模块的关系

它在 Publication Gate 已证明目标、内容和授权之后，单独处理少数高影响 GitHub 动作；Admission（仓库准入检查） 提供现场身份，Snapshot 只记录索引快照，二者都不能替代调用前的真实后果判断和正式回读。
