---
{
 "title": "Transport（Git 传输）、公开内容与授权三重门",
 "kind": "project",
 "url": "/projects/github-index/publication-gate/",
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
  "page": "github-index-publication-gate",
  "kind": "project",
  "title": "Transport（Git 传输）、公开内容与授权三重门",
  "url": "/projects/github-index/publication-gate/",
  "parent": "github-local-index",
  "status_line": {
   "state": "常用",
   "as_of": "2026-10-11",
   "source": "GitHub 总索引源码（提交 e792eda，10 月 7 日）推送放行矩阵与 PublicExposurePolicy，提交前密钥 Hook 已于 9 月 27 日删除；授权按已核验的活动规则 E257。"
  }
 },
 "source": {
  "page": "sources/pages/github-index-publication-gate/page.json",
  "sha256": "4ce7a52ee8b86bf1ff1196685855162084adcb4accd737257ba7a9675d9ec51b",
  "converted_at_beijing": "2026-10-22T08:32:30+08:00"
 }
}
---

::screen{#github-index-publication-gate-01 section="top"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-01",
  "section": "top",
  "title": "Transport（Git 传输）、公开内容与授权三重门",
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
     "text_ref": "Transport（Git 传输）、公开内容与授权三重门",
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
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（提交 e792eda，10 月 7 日）推送放行矩阵与 PublicExposurePolicy，提交前密钥 Hook 已于 9 月 27 日删除；授权按已核验的活动规则 E257。",
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
     "text_ref": "Transport（Git 传输）、公开内容与授权三重门",
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
     "static_note": "截至 10 月 11 日 · GitHub 总索引源码（提交 e792eda，10 月 7 日）推送放行矩阵与 PublicExposurePolicy，提交前密钥 Hook 已于 9 月 27 日删除；授权按已核验的活动规则 E257。"
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
   "asset": "_library/module-illustrations/github-index/publication-gate-v01.png",
   "key": "main-github-local-index",
   "source_phrase": "右上一幅水彩插画：一本摊开的大账本，左页是一行行小卡片（每行一个仓库，卡片左边一个小锁或小地球表示私有或公开，只画图形不画字）；右页几根细细的绿线从小文件夹里长出来（代表 Git 分支），汇到一根粗主干上；账本旁一只放大镜；右上角一个 GitHub 小猫标志（品牌标志照原样画）。",
   "sha256": "30e63a0333e3162c99fd4ffde1149dae6e57e6ecd1341fbe24b7a356385774ed",
   "status": "ready"
  }
 ]
}
```

# Transport（Git 传输）、公开内容与授权三重门

〔回到项目 → GitHub 项目总索引〕　〔复制 AI 续作说明〕

GitHub 总索引 · 功能说明

既防止把私钥、令牌或私人正文错推到公开仓库，也避免因为目标是 PRIVATE（私有）就胡乱改写恢复所需的精确内容。判断始终落在这次真实候选上，不拿“仓库是公开/私有”一个标签替代内容检查。

**当前情况：**已实现分别核对传输目标、公开内容和授权的发布检查；三项都成立才推送并核对远端。原来的“提交前拦密钥 Hook”已于 9 月 27 日退役，内容把关改由 AI 复审这次实际要推的文件。

项目事实核对截至 2026-10-11 14:00（北京时间）；14:00 后的现场读数单独注明时间；页面不实时探测运行状态。

项目源码：私有仓库，源码未公开；用法与技术说明可在下面阅读。

::screen{#github-index-publication-gate-02 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-02",
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

代码能推上去，不代表里面的资料适合公开，也不代表这次推送在我允许的范围内。这里分别看目标是否正确、实际内容能否公开、这次操作有没有授权。

## 举个实际例子

我说：“检查这批文件能否发到公开仓库。”系统逐文件判断真实内容；普通仓库名、路径和版本不会仅因看起来私有就全遮掉，能重复使用的密码则必须拦住。最后核对授权：已经在用的仓库，验证后的定向提交和正常推送本来就在我的长期授权里，不用每次再问；第一次把东西公开到一个新地方、首次发 Release 或强推，才要另外确认。

## 最后我会得到什么

得到三个独立答案：Git 目标与分支能否传输、实际候选是否适合当前公开面、这次操作是否在授权范围内。三道门都成立才会推送并从远端回读；任何一道不成立，只阻断对应步骤并说明缺口。

::screen{#github-index-publication-gate-03 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-03",
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

远端正确、实际内容适合目标可见范围且在授权范围内时才推送，并从远端回看。

## 发现问题时

候选文件含秘密、范围不清或目标仓库不对时停下对应步骤。

## 入口不可用或证据不足时

公开性或远端主分支暂时读不到时不发布，不拿简单扫描或旧记录代替判断。

::screen{#github-index-publication-gate-04 section="usage"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-04",
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
     "text_ref": "1. **固定这批候选**　AI 核对远端身份、可见性、要推出的内容和适用的授权。",
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
     "text_ref": "1. **固定这批候选**　AI 核对远端身份、可见性、要推出的内容和适用的授权。",
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

在 AI 项目对话中给出要发布的仓库、文件和目标分支，请它核对公开内容并完成正常推送。

## 需要准备什么

- 精确候选文件或提交

- 目标仓库可见性

- 发布目标，以及是否超出已有授权（例如第一次公开、新建目标）

## 从开始到拿到结果

1. **固定这批候选**　AI 核对远端身份、可见性、要推出的内容和适用的授权。

2. **分别检查三件事**　先看传输目标是否正确，再看这些内容适不适合目标可见范围，最后核对这次推送是否在授权范围内。

3. **回读远端结果**　正常推送后从远端默认分支核对提交；网站或应用可用性还需目标项目另验，任何一门不清楚都不宣称发布完成。

::screen{#github-index-publication-gate-05 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-05",
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
     "text_ref": "1. 授权按本人已有的长期授权判断：在仓库里干活就包括验证后的定向提交和正常推送，已登记在用的目标照常收尾，不用每次推送另找同意。第一次建新的外部目标或新公开面、首次 Release、强推和重大迁移按真实范围另判；Admission 的结果不能制造授权。",
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
     "text_ref": "1. 授权按本人已有的长期授权判断：在仓库里干活就包括验证后的定向提交和正常推送，已登记在用的目标照常收尾，不用每次推送另找同意。第一次建新的外部目标或新公开面、首次 Release、强推和重大迁移按真实范围另判；Admission 的结果不能制造授权。",
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

发布三重门已落地；传输、内容与授权分开判断

## 关键规则与设计选择

1. 授权按本人已有的长期授权判断：在仓库里干活就包括验证后的定向提交和正常推送，已登记在用的目标照常收尾，不用每次推送另找同意。第一次建新的外部目标或新公开面、首次 Release、强推和重大迁移按真实范围另判；Admission 的结果不能制造授权。

2. PUBLIC（公开） 目标必须使用当前 visibility（公开或私有属性），并审查实际 commits、paths 和 content。

3. PRIVATE（私有） 备份/恢复目标可按范围 preserve exact content，但不能把内容复制到公开索引或聊天。

4. PUBLIC（公开） 页面可以说明有用且已核对的 PRIVATE（私有） 仓库名、普通路径和状态，但不给 PRIVATE（私有） 项目制造猜测 GitHub 链接，也不展开其秘密或私人正文。

5. dirty 或混合工作区必须显式候选文件；不使用 `git add .`。

6. 路径规则零命中只是一层提示，不能替代人工/模型对候选语义的复审；总索引不输出机器发布结论，也不再安装提交前 Hook。

## 当前怎样实现

- 唯一矩阵按授权、repo identity、sync、dirty、visibility（公开或私有属性）、candidate exposure 和目标类别逐层判断。

- PUBLIC（公开） 路径分类由 PublicExposurePolicy.psd1 统一给 admission（仓库准入检查） 与 `.gitignore` 使用，避免两套规则漂移。

::screen{#github-index-publication-gate-06 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-06",
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
     "text_ref": "- 真实 `.env` 家族中的可用秘密、私钥、令牌、恢复材料和可直接滥用载荷失败关闭；日志、数据库、原始目录或普通个人数据只是内容审查候选，不因路径形态自动升级。",
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
     "text_ref": "- 真实 `.env` 家族中的可用秘密、私钥、令牌、恢复材料和可直接滥用载荷失败关闭；日志、数据库、原始目录或普通个人数据只是内容审查候选，不因路径形态自动升级。",
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

- 真实 `.env` 家族中的可用秘密、私钥、令牌、恢复材料和可直接滥用载荷失败关闭；日志、数据库、原始目录或普通个人数据只是内容审查候选，不因路径形态自动升级。

- pure delete、删除 secret-shaped 行和从敏感路径 rename 到安全目标属于修复；rename 进入敏感目标继续阻断。

- **提交前拦密钥的 Git Hook 已退役（2026-09-27）。**Install-GitHook 已删除，放行矩阵写明总索引和公开仓库都不安装这种 Hook；10 月 11 日核对本机没有 pre-commit，也没有另设 hooksPath。现在由声明式 `.gitignore`、Admission 的路径提示和 AI 对实际候选内容的复审分担这项职责。网站自己“发现可复用凭据就让公开构建失败”的检查属于网站项目，不受这次退役影响。

- 项目规则与 candidate diff 决定业务是否适合公开；总索引不生成 V1 publication_decision。

## 执行流程

1. 确认这次外部写入是否在已有授权内（已登记目标的正常推送属于长期授权；新目标、首次公开等另判）

2. 取得新鲜 repo identity、visibility（公开或私有属性）、目标 branch（分支） 与 refs

3. 限定本次 candidate commits、paths 和 staged/unstaged 内容

::screen{#github-index-publication-gate-07 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-07",
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
     "text_ref": "4. 按 canonical path policy 和语义边界复审公开暴露面",
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
     "text_ref": "4. 按 canonical path policy 和语义边界复审公开暴露面",
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

4. 按 canonical path policy 和语义边界复审公开暴露面

5. 运行项目测试；需要时再做内容扫描，扫描零命中也不等于语义通过

6. normal push 明确目标后，从远端默认分支回读 commit

7. 部署或网页结果由目标项目另行验证，不由 Git receipt（执行回执） 冒充

::screen{#github-index-publication-gate-08 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-08",
  "section": "tech",
  "title": "名词和入口",
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
     "text_ref": "名词和入口",
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
     "text_ref": "名词和入口",
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

## 名词和入口

## 本模块用到的名词

| 名词 | 意思 |
| --- | --- |
| transport ready（传输就绪） | 身份、分支、upstream（上游分支） 和同步状态支持已授权的 Git 传输。 |
| publication safe（发布安全） | 实际候选在当前 visibility（公开或私有属性）、项目规则和内容边界下可以进入目标。 |
| authorization present（已有授权） | 本人已有的长期授权或这次明确同意覆盖对应外部副作用；工具输出不能生成这份授权。 |
| canonical matrix（唯一规范矩阵） | 完整 PUBLIC（公开）/PRIVATE（私有） 放行和否决条件只维护一份，其他文档只链接。 |
| defense in depth（纵深防护） | 声明式 ignore、Admission 路径提示和 AI 候选复审分担拦截；提交前 Hook 这一层已于 2026-09-27 退役。任何一层都不是绝对安全证明。 |

## 专业定义

网络能推、内容适合当前公开面、这次操作在授权范围内，是三道彼此独立的门，缺一不可。

::screen{#github-index-publication-gate-09 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-09",
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
     "text_ref": "- Get-ProjectAdmission V1 不输出 publication_decision",
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
     "text_ref": "- Get-ProjectAdmission V1 不输出 publication_decision",
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

如果把 admission（仓库准入检查） 的 proceed 当成 publication 批准，公开仓库可能接收秘密或私人正文；如果把“出现敏感信息”机械等同于“必须脱敏”，又会破坏已确认 PRIVATE（私有） 恢复目标的可恢复性。

## 边界

- Get-ProjectAdmission V1 不输出 publication_decision

- 提交前 Hook 已退役：不再有 Install-GitHook -Inspect 或 bootstrap/repair，准入检查也不再核对 Hook 状态

- PUBLIC（公开） 历史 visibility（公开或私有属性） 不可代替本次现场 visibility（公开或私有属性）

- 模板后缀不豁免 secret content

- PRIVATE（私有） 不等于可以向公开页面、日志或聊天泄露内容

- PRIVATE（私有） 也不等于普通仓库名、公开安全路径或 Git 技术事实必须整类消失；只按实际值与当前用途判断

- 本模块不替目标项目决定 deploy、Pages 或用户验收

## 失败与恢复

- **identity、visibility（公开或私有属性）、target 或 candidate 不明确**：停止写入/发布，补最能降低不确定性的证据。

::screen{#github-index-publication-gate-10 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-10",
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
     "text_ref": "- **PUBLIC（公开） candidate 命中秘密或私人原始材料**：只提交移除、安全重构或公开安全摘要后的候选。",
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
     "text_ref": "- **PUBLIC（公开） candidate 命中秘密或私人原始材料**：只提交移除、安全重构或公开安全摘要后的候选。",
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

- **PUBLIC（公开） candidate 命中秘密或私人原始材料**：只提交移除、安全重构或公开安全摘要后的候选。

- **transport behind/diverged/conflicted/detached**：按项目语义 update/reconcile 后重新取证。

- **路径规则零命中但语义仍可能泄露**：继续人工/模型候选复审；不得以零命中放行。

- **PRIVATE（私有） 恢复目标可见性可能变化**：重新读取 live visibility（公开或私有属性）；未确认前不继续敏感 push。

::screen{#github-index-publication-gate-11 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-11",
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
     "text_ref": "- 唯一 transport/publication/authorization 矩阵",
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
     "text_ref": "- 唯一 transport/publication/authorization 矩阵",
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

- 唯一 transport/publication/authorization 矩阵

- publication 分离和 V1 边界

- 敏感路径 canonical cases（PublicExposurePolicy.psd1）

- 已退役、只作历史：Install-GitHook 与 Hook 回归（2026-09-27 删除）

- ignore、rename/delete 与内容路径回归

## 如何验证

- 2026-08-29 完整 Admission（仓库准入检查） 回归 exit 0，包含 PUBLIC（公开） exposure、pure delete、rename 和目标工作树 gate。

- Test-ProjectAdmission.ps1 对中央 policy 的真实 `.env`、模板、私钥、凭据配置、数据库与普通安全路径逐案验证。

- Run-UnitTests.ps1 覆盖中文/空格路径、NUL delimiter、模板秘密内容、type change、pure delete 和双向 rename。

::screen{#github-index-publication-gate-12 section="tech"}

```typeset
{
 "screen": {
  "id": "github-index-publication-gate-12",
  "section": "tech",
  "title": "依据与来源（二）",
  "links": [
   {
    "text": "上一个模块 工作树同步",
    "href": "/projects/github-index/worktree-sync/"
   },
   {
    "text": "下一个模块 重大变更保护",
    "href": "/projects/github-index/protected-major-actions/"
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
     "text_ref": "- 合同测试要求完整矩阵只有一个副本，旧脱敏文档只保留 redirect role。",
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
     "text_ref": "- 合同测试要求完整矩阵只有一个副本，旧脱敏文档只保留 redirect role。",
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

- 合同测试要求完整矩阵只有一个副本，旧脱敏文档只保留 redirect role。

- 2026-08-29 live admission（仓库准入检查） 证明 PUBLIC（公开）/main/0-0 仍因 dirty 返回 warn，这是当时的历史；总索引现在是私有仓库，10 月 11 日 16:34 只读检查为 PRIVATE（私有）/main、本地领先 2 个提交、warn；10 月 22 日 06:48 只读再数，本地相对本机缓存的 origin/main 领先 0 个提交（未 fetch，未重出 warn/pass 结论）。旧 Hook 测试只算退役历史，不作现在的防泄露证据；本轮没有执行候选复审、正常推送或网站构建的秘密检查，标“本轮未执行”，不代表这些能力不能用。

## 与其他模块的关系

它消费 Admission（仓库准入检查） 与 Worktree（Git 工作树） Sync 的 Git 证据，但额外要求候选内容和授权；Snapshot 模块只负责记录事实，不会替它批准发布。
