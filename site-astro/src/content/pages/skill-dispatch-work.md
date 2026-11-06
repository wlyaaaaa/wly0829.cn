---
{
 "title": "派活和验收",
 "kind": "skill",
 "url": "/skills/dispatch-work/",
 "tagline": "我交代一件事，主持的 AI 分给合适的 AI，做完交回来核对；我不用记命令。",
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
  },
  {
   "id": "tech",
   "label": "技术"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-dispatch-work",
  "kind": "skill",
  "title": "派活和验收",
  "url": "/skills/dispatch-work/",
  "tagline": "我交代一件事，主持的 AI 分给合适的 AI，做完交回来核对；我不用记命令。",
  "status": "",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次更新",
    "at": "2026-11-06 02:59"
   },
   "facts": [],
   "as_of": "2026-11-06",
   "source": "技能说明和派活程序"
  },
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "commit": "621a9b49",
   "commit_time": "2026-11-06T02:59:26+08:00",
   "file": "E:\\.agents\\skills\\dispatch-work\\SKILL.md；E:\\.agents\\tools\\Invoke-ClaudeGptChild.ps1；E:\\.agents\\docs\\claude-gpt-child-dispatch.md；E:\\.agents\\config\\model-roster.json",
   "rules_release": "E387"
  },
  "search_aliases": [
   "派活和验收",
   "dispatch-work",
   "派活",
   "分工",
   "子代理",
   "谁来做",
   "派给别的 AI",
   "验收",
   "单子"
  ],
  "registry": {
   "relations": [],
   "mentions": [
    {
     "target": "/rules/execution-coordination/",
     "screen": "skill-dispatch-work-02",
     "text": "分工与并行施工"
    },
    {
     "target": "/skills/image-generation/",
     "screen": "skill-dispatch-work-03",
     "text": "生图"
    },
    {
     "target": "/rules/execution-coordination/",
     "screen": "skill-dispatch-work-04",
     "text": "分工与并行施工"
    },
    {
     "target": "/skills/image-generation/",
     "screen": "skill-dispatch-work-04",
     "text": "生图"
    },
    {
     "target": "/skills/project-entry-gate/",
     "screen": "skill-dispatch-work-04",
     "text": "改项目前先核对"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "不写使用次数：没有可靠账本。",
    "命令和单子字段只放技术层。"
   ],
   "unsure": [
    "怎么说和例子是照技能能力写的说明用例，不是本人说过的话，也不是运行记录；例子里的“读配置时没处理文件不存在”是编的。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/skill-dispatch-work/page.json",
  "sha256": "b947d8a355dd8408b21771b34631110d4a1d4a234a5a19e0ed4ac244289f2053",
  "converted_at_beijing": "2026-11-06T13:54:09+08:00"
 }
}
---

::screen{#skill-dispatch-work-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-dispatch-work-01",
  "section": "top",
  "title": "做什么、怎么跟 AI 说",
  "scene": "",
  "portrait": "",
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
     "text_ref": "派活和验收",
     "align": "left",
     "size": "large",
     "row": "k1a-head",
     "width": "fit-content(60%)"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 11 月 6 日 02:59",
       "state": "ok"
      }
     ],
     "static_note": "截至 11 月 6 日 · 技能说明和派活程序",
     "row": "k1a-head",
     "width": "minmax(0,1fr)"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么"
    },
    {
     "type": "prose",
     "text_ref": "我交代一件事"
    },
    {
     "type": "prose",
     "text_ref": "交回来的是"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 2,
     "split_paras": true,
     "illustration": "none"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "派活和验收",
     "align": "center",
     "size": "large"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次更新 11 月 6 日 02:59",
       "state": "ok"
      }
     ],
     "static_note": "截至 11 月 6 日 · 技能说明和派活程序"
    },
    {
     "type": "prose",
     "text_ref": "技能名"
    },
    {
     "type": "section_heading",
     "text_ref": "它做什么"
    },
    {
     "type": "prose",
     "text_ref": "我交代一件事"
    },
    {
     "type": "prose",
     "text_ref": "交回来的是"
    },
    {
     "type": "notice",
     "text_ref": "不用点名"
    },
    {
     "type": "dialogue",
     "text_ref": "怎么跟 AI 说",
     "columns": 2,
     "split_paras": true,
     "illustration": "none"
    }
   ]
  }
 },
 "images": []
}
```

派活和验收

技能名 dispatch-work · 规则库里的通用做法，不挂在某个项目下

**它做什么**
我交代一件事，接话的那个 AI（下面叫“主持的 AI”）不一定亲手做完：写代码、查资料、成批核对这些活，它按模型清单分给合适的 AI，自己留着听懂我要什么、定方案、把关。这个技能是它的派活说明：一件活怎么写清楚交出去、交出去以后怎么等、做完怎么交回来、谁来核对。

交回来的是成品和实际结果：东西做好了没有、我说的问题还在不在、验证跑出来什么样、哪些没办成。后台开始运行不算做完，做事的 AI 说做完了也不算数；主持的 AI 看过实际结果、对得上我要的，才告诉我完成了，并说清是谁做的。

不用点名，也不用记命令：我照常在原来的对话里说要办的事，主持的 AI 要派活时自己会读它，我不用运行什么。只有取舍、授权这类非我不可的事才回来问我。它不是一套新程序，网站上也没有开任务的按钮：用的还是已有的派活程序，后台执行、接完成通知，不用谁手工盯着看。

**怎么跟 AI 说**
“这个脚本老报错，修好，告诉我原因。”
“这 50 张截图都查一遍，有问题的挑出来给我看。”
“这个资料查清楚，原文和出处一起交回来。”
“这次你亲手写，别派出去。”
“它做的不对，让它在原来的基础上接着改，别重开。”
“这件事是谁做的？你核对过哪些？”

::screen{#skill-dispatch-work-02 section="examples"}

```typeset
{
 "screen": {
  "id": "skill-dispatch-work-02",
  "section": "examples",
  "title": "一个完整例子",
  "scene": "",
  "portrait": "",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
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
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "sides": [
      "left"
     ],
     "illustration": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "出问题时"
    },
    {
     "type": "table",
     "text_ref": "碰到的情况"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一个完整例子",
     "align": "center",
     "size": "large"
    },
    {
     "type": "tag",
     "text_ref": "示例："
    },
    {
     "type": "dialogue",
     "text_ref": "我：",
     "sides": [
      "right"
     ],
     "illustration": "none"
    },
    {
     "type": "timeline",
     "text_ref": "AI 做了什么",
     "direction": "vertical",
     "columns": 1,
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "dialogue",
     "text_ref": "AI 交回",
     "sides": [
      "left"
     ],
     "illustration": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "出问题时"
    },
    {
     "type": "table",
     "text_ref": "碰到的情况"
    }
   ]
  }
 },
 "images": []
}
```

一个完整例子

示例：照这个技能的做法写的，不是某一次的记录

我：“这个脚本老报错，修好。”

**AI 做了什么**
1. 写单子：主持的 AI 把我这句话、要的结果（报错不再出现）、怎么算做到、已经查实的事和真正不能碰的边界写下来。修报错只写现象和要的结果，不替它先读代码；确实有猜测，写明“猜的，现场可以纠正”。
2. 派出去：按模型清单选人，这类活现在交 GPT-6.1 Sol，并写明能改多少行。改仓库的活用单独的工作副本，不动我正在用的那份。
3. 后台执行：做事的 AI 在后台干，主持的 AI 接着做别的，接到完成通知再回来，不用手工一遍遍去看。
4. 中途有事：它留言问的，主持的 AI 能定就当场回，要我定的才问我；它的打算没问题就不回，说行数不够就回一句放宽到多少。时限只是估计，到点只叫醒主持的 AI 看一眼，做事的 AI 接着做。
5. 核对：读交回的汇报，再看我说的报错还在不在，再看测试和实际运行，再看它写的原因和改动对不对得上。
6. 收尾：通过后先把改动合并、推送（单子写明授权的由 Sol 做），再办结这一单；已经合入、没有别的改动的工作副本才会被清掉。

**AI 交回**
“修好了，这个报错没再出现。原因是读配置时没处理文件不存在的情况；改了这一个脚本，测试和真跑一遍都过了。GPT-6.1 Sol 改的，我核对了现象、测试和改动。”

**出问题时**
| 碰到的情况 | AI 怎么办 |
|---|---|
| 交回的东西有毛病 | 让它在原来的任务里接着改，主持的 AI 不替它补，一眼看清的错字除外；再错才换人 |
| 做事的 AI 说全好了 | 不算验收。有成品的，让它按我原来的用法走一遍，交回截图和操作结果，主持的 AI 看样子合不合意、原来的问题还在不在 |
| 要我拿主意的事：取舍、授权、花钱 | 做事的 AI 交回主持的 AI；能定的自己定，定不了的才问我，别的部分接着做 |
| 时限到了还没做完 | 只叫醒主持的 AI，做事的 AI 接着做；觉得不对就纠偏、改时限或叫停；叫醒了一直没回应，到 3 倍时限才停 |
| 已经结束，又要接着做 | 在原来的任务里继续，不重开 |
| 派出去的 AI 调不动 | 短时限流、满载和服务器临时出错自动重试；额度用完或账号用不了才提醒我换账号，换好后按原型号、原档位重派；不降型号，也不把 GPT 的活转给 Claude |
| 卡住了、做错了怎么算 | 按〔分工与并行施工〕里的办法：先查现场，再换一类办法 |

::screen{#skill-dispatch-work-03 section="abilities"}

```typeset
{
 "screen": {
  "id": "skill-dispatch-work-03",
  "section": "abilities",
  "title": "能做的事",
  "scene": "",
  "portrait": "",
  "links": [
   {
    "text": "生图",
    "href": "/skills/image-generation/"
   }
  ],
  "anchors": [
   {
    "id": "a-roles",
    "text": "谁做什么"
   },
   {
    "id": "a-ticket",
    "text": "一张单子写什么"
   },
   {
    "id": "a-accept",
    "text": "怎么算做完"
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
     "text_ref": "能做的事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "把一件活"
    },
    {
     "type": "section_heading",
     "text_ref": "谁做什么"
    },
    {
     "type": "table",
     "text_ref": "角色"
    },
    {
     "type": "points_card",
     "text_ref": "一张单子写什么",
     "columns": 1
    },
    {
     "type": "points_card",
     "text_ref": "怎么算做完",
     "columns": 1
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "能做的事",
     "align": "center",
     "size": "large"
    },
    {
     "type": "notice",
     "text_ref": "把一件活"
    },
    {
     "type": "section_heading",
     "text_ref": "谁做什么"
    },
    {
     "type": "table",
     "text_ref": "角色"
    },
    {
     "type": "points_card",
     "text_ref": "一张单子写什么",
     "columns": 1
    },
    {
     "type": "points_card",
     "text_ref": "怎么算做完",
     "columns": 1
    },
    {
     "type": "points_card",
     "text_ref": "用这个技能时",
     "columns": 1
    }
   ]
  }
 },
 "images": []
}
```

能做的事

把一件活写清楚交出去，接回来，核对完。下面是技能和派活程序里写的做法；谁做哪类活以模型清单为准，这张表是 11 月 6 日读到的分工。

**谁做什么**
| 角色 | 管什么 |
|---|---|
| 主持的 AI（我正在对话的那个 Claude 或 Codex） | 听懂我要什么、定方案、写单子、核对结果、写给我看的话。Claude 主持时，只有我说那句话时它就知道怎么改、一个文件里几行就完、也不用发布的小事才自己动手；我明说“你亲手写”才算，平常说“你改一下”不算 |
| GPT-6.1 Sol | 写代码、修报错、查资料、成批核对、操作浏览器这类具体的活 |
| GPT-6 Luna | 现在主要用来生图，做法见〔生图〕 |
| Claude 的子代理 | Claude 主持时，要第二个脑子、独立复核和要惊艳的样板交它们 |
| GPT-6 Astra | 最贵的一档。Claude 主持时只有主对话能派，还要我授权；Codex 主对话是 GPT 时直接派，不用另要授权；派了要在途中和最后都说一声 |
| Codex 主持时 | 优先用它自带的子代理，自带的满了才走同一个派活程序 |
| 做事的 AI | 照单子做，交回成品、验证结果和没办成的部分。它手上只有一张单子，不知道我为什么要这个，所以它查对不对，是不是我要的由主持的 AI 看 |

**一张单子写什么**
- 任务一句话，我这次说的那句话，要的结果，怎么算做到。
- 已经查实的事实和已经定的方案；猜的步骤不写死。
- 真正的边界：授权和钱、对外发布、删数据、这一单能改多少行。
- 时限是估计；行数不够，做事的 AI 说一声，主持的 AI 放宽，不算它做错。
- 复核的人没参与定方案和施工，单子里不给作者的结论。

**怎么算做完**
- 有成品的：按我原来的用法走一遍，交回关键截图和操作结果，主持的 AI 看样子合不合意、原来的问题还在不在。
- 后台的活：看我说的现象还在不在，再看测试和实际运行，再看写的一句原因和改动对不对得上。
- 写给我的事实：决定结论的那几条，主持的 AI 自己对过原文；程序数的说明怎么数的；其余写明谁说的、没核实。GPT 的话不直接转给我，我要看原话时除外。

**用这个技能时，AI 守的规矩**
- 后台开始运行不算完成，子代理的报告也不自动算验收通过。
- 做错了在原来的任务里改，不重开；主持的 AI 不替它补。
- 我问代码是什么意思，读几个文件直接答；问为什么坏了，算排障，派出去。
- 派活不扩大授权：对外发布、花钱、删唯一的数据，该问我的照样问我。

::screen{#skill-dispatch-work-04 section="limits"}

```typeset
{
 "screen": {
  "id": "skill-dispatch-work-04",
  "section": "limits",
  "title": "边界",
  "scene": "",
  "portrait": "",
  "links": [
   {
    "text": "分工与并行施工",
    "href": "/rules/execution-coordination/"
   },
   {
    "text": "生图",
    "href": "/skills/image-generation/"
   },
   {
    "text": "改项目前先核对",
    "href": "/skills/project-entry-gate/"
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
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1
    },
    {
     "type": "notice",
     "text_ref": "现在的情况"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "边界",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "管",
     "columns": 1
    },
    {
     "type": "section_heading",
     "text_ref": "不管，交给谁"
    },
    {
     "type": "table",
     "text_ref": "这些事"
    },
    {
     "type": "points_card",
     "text_ref": "不做",
     "columns": 1
    },
    {
     "type": "notice",
     "text_ref": "现在的情况"
    }
   ]
  }
 },
 "images": []
}
```

边界

**管**
主持的 AI 怎么把一件活写成单子、交出去、等结果、接回来、核对；Claude 和 Codex 主持时都用它。

**不管，交给谁**
| 这些事 | 找谁 |
|---|---|
| 这类活派给哪个型号、什么档位 | 模型清单，规矩见〔分工与并行施工〕 |
| 派活松紧、复核做到多深、卡住和做错了怎么办 | 〔分工与并行施工〕 |
| 生图怎么派、怎么验收 | 〔生图〕 |
| 改代码之前核对仓库和同步 | 〔改项目前先核对〕 |
| 具体的事怎么办（查消息、在网页上办事、发微信） | 各自的技能；这里只管怎么派 |

**不做**
- 不决定哪个模型强、哪个弱。
- 不是新的后台系统：没有定时任务、常驻服务，也不用我安装或运行什么；网站上没有开任务的按钮。
- 不要求每一单都另派人复核：复核做到多深，按这次改动的风险定。
- 小事不派：一两步就能答、能改的，主持的 AI 自己来。

**现在的情况**
这页写的是做法。写这页时（11 月 6 日）只读了技能说明、派活程序的说明和入口参数，没有为这页开新任务，完成通知这一段也没有专门实测；派过多少单没有可靠统计，这里不写次数。

::screen{#skill-dispatch-work-05 section="tech"}

```typeset
{
 "screen": {
  "id": "skill-dispatch-work-05",
  "section": "tech",
  "title": "技术实现与依据",
  "scene": "",
  "portrait": "",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {},
 "images": []
}
```

## 技术实现与依据

这里保留入口、单子卡头、等候和验收的命令、来源。

**11 月 6 日核对**　技能 E:\.agents\skills\dispatch-work\SKILL.md（.agents 11dcb016 于北京时间 11 月 6 日 01:01 新建，621a9b49 02:59 再调整，当时 81 行）；供应登记 config/personal-skill-supply.json 里 install:true；Codex 的发现目录 C:\Users\<用户名>\.agents\skills\dispatch-work 是指向这份目录的链接。写这页时只读文件和参数，没有开任务。

## 入口

- 派 GPT：`& 'E:\.agents\tools\Invoke-ClaudeGptChild.ps1' -Mode Start -Model <型号> -Effort <档位> -PromptFile <单子> -TaskName <短名>`；改仓库加 `-NewWorktree -RepoPath <仓库>`。生图另加 `-TrafficMode Generation`，见生图技能。
- Codex 主持时优先原生子代理；原生槽满才用上面这条，并加 `-ParentHarness Codex -SessionId <完整会话号>`。
- Claude 子代理（Claude 主持时）：Agent 工具，`subagent_type` 写模型清单里的角色（如 opus-high）；单子写法相同，时限写短，它没有到点提醒。
- Astra：Claude 主持时只有根会话能派，要有授权（模型清单写着哪几类）；Codex 主对话是 GPT 时直接派，不用另要授权。思考摘要写一句“我要派 Astra”，途中和最后一条都说一声。
- 选谁、什么档位只看 E:\.agents\config\model-roster.json 的 `routing.scenarios`。

## 单子卡头

- 只读单：`任务`、`范围: 无（只读）`、`代码上限: 0`、`时限分钟`。
- 改代码：`任务`、`范围`（如 tools/example.ps1）、`代码上限`（净增行数，按大小估）、`测试上限`、`时限分钟`。
- Astra 只要时限分钟。单子存成 UTF-8 文件。

## 等

- Start 立刻返回，独立执行器在后台持续监测直到这一轮任务结束，新版回执 `monitoring=true`、`watch_required=false`。要收到宿主的完成通知，等候要覆盖正在跑的任务：已有有效等候就不重复挂（`watch_subscription_required=false`）。不用手工轮询。
- 留言：`-Mode Steer -RunDir <目录> -PromptFile <消息>` 回；打算没问题不回，说行数不够的回一句放宽到多少。
- 改时限：`-Mode Extend -RunDir <目录> -Minutes <N> -Reason <为什么>`。到时限只叫醒主持，叫醒了一直没回应，到 3 倍才停。
- 接着做：`-Mode Resume -RunDir <目录> -PromptFile <续作单>`，在原线程，不重开。

## 验收

- 读 `round-xx/report.md`，再看实际结果。
- 通过后合并推送（单子写明授权的由 Sol 做），再 `-Mode Accept -RunDir <目录>`（没有登记验收命令加 `-NoCommands`）；已合入且干净的工作树才会被清。

## 细则在哪

- 松紧、卡住、做错了怎么办：规则《分工与并行施工》。
- 全部参数：E:\.agents\docs\claude-gpt-child-dispatch.md。

## 实测和缺口

- 这页写的是技能和程序说明。入口脚本的模式参数读过（Start、Steer、Extend、Resume、Accept），没有开任务逐条验证，完成通知这一段没有专门实测，不代表每个分支都验收过。
- 使用次数：没有可靠的账本，不写。这页不是新的后台系统，没有新增定时任务或常驻服务。
