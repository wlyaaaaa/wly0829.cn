---
{
 "title": "修乱码",
 "kind": "skill-redirect",
 "url": "/skills/mojibake-doctor/",
 "tagline": "已退役",
 "toc": [],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "skill-mojibake-doctor",
  "kind": "skill-redirect",
  "title": "修乱码",
  "url": "/skills/mojibake-doctor/",
  "destination": "/skills/",
  "tagline": "已退役",
  "status": "已退役",
  "public": false,
  "repo_url": null,
  "capability": "",
  "based_on": {
   "file": "退役提交 .agents 03b03df8（北京时间 11 月 1 日 18:31）：技能目录和测试删除，登记为退役并移除发现链接；登记见 config/personal-skill-supply.json 的 retired_skills"
  },
  "video_prompt": "",
  "registry": {
   "numbers": [],
   "relations": [],
   "mentions": [
    {
     "target": "/skills/",
     "screen": "skill-mojibake-doctor-01",
     "text": "技能首页"
    }
   ]
  },
  "notes": {
   "merged": [],
   "dropped": [
    "原页的说法、例子和能做的事整页撤下：技能 11 月 1 日退役，旧网址只留去向说明。"
   ],
   "unsure": []
  }
 },
 "source": {
  "page": "sources/pages/skill-mojibake-doctor/page.json",
  "sha256": "658da4b4136f25e1242d890ef39308cc8868949020aa8aa33de162000a8ec66f",
  "converted_at_beijing": "2026-11-04T17:54:17+08:00"
 }
}
---

::screen{#skill-mojibake-doctor-01 section="top"}

```typeset
{
 "screen": {
  "id": "skill-mojibake-doctor-01",
  "section": "top",
  "title": "去向",
  "scene": "",
  "portrait": "",
  "links": [
   {
    "text": "技能首页",
    "href": "/skills/"
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
     "text_ref": "修乱码",
     "align": "left",
     "size": "large",
     "row": "go",
     "width": "70%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "text_ref": "这个技能11月1日退",
     "row": "go"
    },
    {
     "type": "illustration",
     "asset": "_library/icons/工具箱回收站.png",
     "align": "center",
     "row": "go",
     "width": "30%"
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "修乱码",
     "align": "center",
     "size": "large"
    },
    {
     "type": "illustration",
     "asset": "_library/icons/工具箱回收站.png",
     "align": "center",
     "target_width": "55%",
     "target_height": 317
    },
    {
     "type": "prose",
     "text_ref": "这个技能11月1日退"
    }
   ]
  }
 },
 "images": []
}
```

修乱码

这个技能 11 月 1 日退役了：AI 自己就能认出编码哪里错了、把中文改回来，不值得再单独维护一个专门技能。

文件里的中文变成乱码时，直接跟 AI 说一句“这个文件乱码了，帮我修一下”就行，不用点名，它用手边现成的办法处理。专门的修复工具已经撤了，这种处理也没有单独验收过，重要的文件改完自己看一眼。现在在用的技能见〔技能首页〕。
