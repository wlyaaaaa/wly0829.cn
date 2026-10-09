---
{
 "title": "个人材料查找",
 "kind": "project",
 "url": "/projects/personal-materials/",
 "tagline": "说个大概，找回那份文件原件，翻到要看的那一页。",
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
  },
  {
   "id": "highlights",
   "label": "亮点"
  },
  {
   "id": "features",
   "label": "全部功能"
  },
  {
   "id": "history",
   "label": "演进"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "personal-materials",
  "kind": "project",
  "title": "个人材料查找",
  "url": "/projects/personal-materials/",
  "tagline": "说个大概，找回那份文件原件，翻到要看的那一页。",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "找回文档原件并翻到那一页",
  "based_on": {
   "commit": "ed2fd32c5e796c7f6e69645f88728e82f139f9f4",
   "commit_time": "2026-09-27T07:24:42-05:00"
  },
  "video_prompt": "6 秒无缝循环，白底水彩风，从开头这屏右上的插画出发：半开的木制文件柜抽屉里，几页纸轻轻上下浮动；放大镜沿着一页纸慢慢移动，停在一行字上时那一行被绿色荧光笔划亮，亮光轻轻闪一下；一条绿色细虚线从这页纸延伸到纸角的小标签，标签上的绿色对勾淡入；角落的盆栽叶子随风轻摆。镜头不动，没有文字，最后一帧回到第一帧。",
  "registry": {
   "groups": [
    {
     "id": "g-find",
     "name": "找"
    },
    {
     "id": "g-read",
     "name": "核对和阅读"
    },
    {
     "id": "g-intake",
     "name": "收进来"
    },
    {
     "id": "g-upkeep",
     "name": "维护"
    }
   ],
   "features": [
    {
     "id": "f-find",
     "group": "g-find",
     "name": "凭印象找",
     "what": "说记得的标题、用途或一句话，在登记过的原件里给出几个候选，写明是标题对上还是正文对上",
     "how": "说“去年租房签的那份合同在哪”",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "materials.py 第 3984–3987、1331–1546 行 find；旧总账最近一次 9 月 27 日"
    },
    {
     "id": "f-version",
     "group": "g-find",
     "name": "按版本找",
     "what": "说“签字版”“草稿”“定稿”，只列出带同样版本词的候选",
     "how": "在说法里带上版本词",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "materials.py 第 1080–1095 行"
    },
    {
     "id": "f-discover",
     "group": "g-find",
     "name": "再扩大找",
     "what": "候选不对时，在允许的文件夹里按文件名现找一次，有文件数、层数和时间上限",
     "how": "说“不是这些，再找找”，能说出大概在哪更好",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "materials.py 第 34–37、2214 行 discover；README 第 28 行；旧总账 9 月 27 日"
    },
    {
     "id": "f-filename-list",
     "group": "g-find",
     "name": "微信和下载的文件名清单",
     "what": "微信收到的文件、下载文件夹每天记一份文件名清单，扩大找时一起查，排前面的现场确认还在",
     "how": "不用单独说，扩大找时自动查",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "README 第 30 行；materials.py 第 60–68、2063 行；提交 8e86b1e；9 月 26 日北京 01:23 第一次刷新：Downloads 9,576、微信四个收件夹 584+3,453+1,011+671（Claude 会话 ca702b24 子代理 a6e532 的工具输出）；filename_entries 9 月 28 日 15,210 条；每日同步日志 9 月 26–28 日成功"
    },
    {
     "id": "f-verify",
     "group": "g-read",
     "name": "确认是那一份",
     "what": "选中后重算大小和 SHA-256，和登记时比；只核对，不写登记，不弹窗口",
     "how": "选中一个候选，AI 自动核对",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "materials.py 第 4006–4013 行 inspect、inspect-discovered；SKILL.md 第 30–31 行；旧总账 9 月 27 日"
    },
    {
     "id": "f-locate",
     "group": "g-read",
     "name": "翻到那一页",
     "what": "在选中的 PDF、Word、TXT、Markdown 里找到页码、段落或行号，附一小段原文",
     "how": "选中文件后说要找的那句话",
     "status": "说不准",
     "screen": "personal-materials-10",
     "source": "materials.py 第 4027–4035、3395 行 locate-content；对话记录（Codex 9 月 15 日起、Claude 9 月 24 日起）里没找到带真实参数的调用"
    },
    {
     "id": "f-scan-ocr",
     "group": "g-read",
     "name": "扫描件先认字",
     "what": "PDF 没有文字层时，只把这一份交给本地文字识别，找到的位置对回原 PDF 的页码",
     "how": "要找的在扫描件里时，AI 自动接着做",
     "status": "说不准",
     "screen": "personal-materials-10",
     "source": "SKILL.md 第 23 行；materials.py 第 3386–3392 行；material_text 里 ocr 文字 0 份"
    },
    {
     "id": "f-open",
     "group": "g-read",
     "name": "打开原件",
     "what": "核对无误后，用电脑的默认软件打开真正的原件",
     "how": "说“打开那份”",
     "status": "说不准",
     "screen": "personal-materials-10",
     "source": "materials.py 第 4037–4043 行 open、第 3996–4004 行 open-discovered；旧总账 unknown，对话记录里没找到带真实参数的调用"
    },
    {
     "id": "f-intake",
     "group": "g-intake",
     "name": "精确登记",
     "what": "别的项目交来一份文件的路径、大小和指纹，现场复算对上才登记；只记位置，不复制原件",
     "how": "请 AI 把选定的文件加进以后能直接找到的范围",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "README 第 38–40 行；materials.py 第 847 行 intake；personal-media README 第 283 行；旧总账 9 月 26 日"
    },
    {
     "id": "f-dedup",
     "group": "g-intake",
     "name": "按内容查重",
     "what": "交来一批内容指纹（一次最多 1000 个），告诉你哪些已有一模一样的原件、在哪",
     "how": "处理新文件前问“这些是不是已经存过”",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "README 第 34 行；materials.py 第 2989 行 lookup-content；personal-media phone_file_preserve_clear.py 第 894 行；旧总账 9 月 26 日；真实一次：9 月 25 日本人说“若他们在材料库已经有了，直接删了”，AI 把 46 个文件（约 1.04 GiB）的内容指纹比对材料库和媒体库，0 个重复（Claude 会话 6b1e27e0，UTC 14:08–14:42；那次是只读 SQL 直接查材料库的指纹列，不是 lookup-content 命令）"
    },
    {
     "id": "f-sync",
     "group": "g-upkeep",
     "name": "删了就不再找",
     "what": "每天 17:10 去掉我已删掉的原件那一条；文件夹打不开、内容变了都不删",
     "how": "不用说，自己在文件夹里删就行",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "README 第 50 行；materials.py 第 3606–3683 行；PCConfig Sync-PersonalReplicasToG.ps1 第 82–89 行；日志 9 月 5–28 日 31 次成功"
    },
    {
     "id": "f-inventory",
     "group": "g-upkeep",
     "name": "看还有多少",
     "what": "按需数一遍来源里有多少非媒体文件、多少已登记，写明几点数的、是不是“至少”",
     "how": "问“这些地方还有多少材料”",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "README 第 54 行；materials.py 第 3715 行 inventory；旧总账 9 月 27 日；本稿 9 月 28 日现算"
    },
    {
     "id": "f-retire-source",
     "group": "g-upkeep",
     "name": "撤掉失效的来源",
     "what": "整个文件夹已经不存在、也不再指向任何原件时，才撤掉这条来源登记",
     "how": "说“某个文件夹已经不用了”",
     "status": "在用",
     "screen": "personal-materials-10",
     "source": "README 第 32 行；materials.py 第 2146 行 retire-source；真实一次：9 月 26 日北京 01:23 撤掉两个已清空的学习资料文件夹的来源登记，materials_removed=0、original_files_changed=0（Claude 会话 ca702b24 子代理 a6e532 的工具输出）"
    }
   ],
   "numbers": [
    {
     "id": "n-registered",
     "text": "164 份",
     "meaning": "精确登记的原件定位，全部核对过 SHA-256",
     "as_of": "2026-09-28",
     "source": "materials.py status 与只读 SQL（open_state=verified 164）",
     "screens": [
      "personal-materials-01",
      "personal-materials-05",
      "personal-materials-06",
      "personal-materials-07",
      "personal-materials-08"
     ]
    },
    {
     "id": "n-sources",
     "text": "53 个来源",
     "meaning": "已登记来源：文件夹 35、文件名清单 5、交接文件夹 8、单个文件 5",
     "as_of": "2026-09-28",
     "source": "只读 SQL group by source_kind；status sources=53",
     "screens": [
      "personal-materials-01",
      "personal-materials-06",
      "personal-materials-07"
     ]
    },
    {
     "id": "n-nonmedia",
     "text": "至少 74,939 个",
     "meaning": "53 个来源里的非媒体文件条目，下限（一个来源触到 5 万上限）",
     "as_of": "2026-09-28",
     "source": "materials.py inventory，北京 20:55，source_scope_nonmedia_file_entries_lower_bound",
     "screens": [
      "personal-materials-01",
      "personal-materials-07"
     ]
    },
    {
     "id": "n-discoverable",
     "text": "74,775 个",
     "meaning": "没精确登记、用时现找的非媒体文件（下限）",
     "as_of": "2026-09-28",
     "source": "inventory discoverable_not_exact_file_entries_lower_bound",
     "screens": [
      "personal-materials-07"
     ]
    },
    {
     "id": "n-seen",
     "text": "85,189 个",
     "meaning": "盘点时看过的不重复文件路径",
     "as_of": "2026-09-28",
     "source": "inventory unique_file_path_entries_seen",
     "screens": [
      "personal-materials-07"
     ]
    },
    {
     "id": "n-media-skipped",
     "text": "10,250 个",
     "meaning": "盘点时跳过的照片视频录音文件",
     "as_of": "2026-09-28",
     "source": "inventory media_file_entries_skipped",
     "screens": [
      "personal-materials-07"
     ]
    },
    {
     "id": "n-sync-runs",
     "text": "31 次，全部成功",
     "meaning": "每日维护里 materials_sync_current 这一步的次数：9 月 5–28 日每天 17:10 共 24 次，另有手动补跑 7 次（北京 9 月 7、9 日各 1 次，13 日 4 次，14 日 1 次）",
     "as_of": "2026-09-28",
     "source": "%LOCALAPPDATA%\\PCConfig\\logs\\hot-backup\\personal-replica-*.log，9 月 5–28 日北京 17:10",
     "screens": [
      "personal-materials-01"
     ]
    },
    {
     "id": "n-filenames",
     "text": "15,210 条",
     "meaning": "微信收到的文件和下载文件夹的文件名清单条目",
     "as_of": "2026-09-28",
     "source": "只读 SQL count(*) from filename_entries",
     "screens": [
      "personal-materials-03",
      "personal-materials-06"
     ]
    },
    {
     "id": "n-texts",
     "text": "44 份",
     "meaning": "有可搜文字的登记原件：文件自带完整文字 18、提取的部分文字 26",
     "as_of": "2026-09-28",
     "source": "只读 SQL group by text_kind",
     "screens": [
      "personal-materials-06",
      "personal-materials-07"
     ]
    },
    {
     "id": "n-relations",
     "text": "4 条",
     "meaning": "原件之间的原生关系",
     "as_of": "2026-09-28",
     "source": "status relations=4",
     "screens": [
      "personal-materials-06"
     ]
    },
    {
     "id": "n-size",
     "text": "1.2 GB",
     "meaning": "164 份登记原件字节合计 1,218,134,136",
     "as_of": "2026-09-28",
     "source": "只读 SQL sum(byte_size)",
     "screens": [
      "personal-materials-07"
     ]
    },
    {
     "id": "n-code-lines",
     "text": "4,192 行",
     "meaning": "materials.py 行数",
     "as_of": "2026-09-28",
     "source": "提交 ed2fd32 的 materials.py",
     "screens": [
      "personal-materials-06"
     ]
    },
    {
     "id": "n-tests",
     "text": "106 个",
     "meaning": "自动测试（69 个测试函数含参数化），9 月 28 日全部通过",
     "as_of": "2026-09-28",
     "source": "python -B -m pytest -q -p no:cacheprovider tests → 106 passed in 12.30s",
     "screens": [
      "personal-materials-06"
     ]
    },
    {
     "id": "n-old-kb",
     "text": "10 GB、219 万条",
     "meaning": "退役的旧个人知识库只读截面：10,403,168,256 字节、2,194,446 条材料定位",
     "as_of": "2026-08-25",
     "source": "sha256:57b8b04868cbf62f2ba68fa9f57b7df06b7f579bf1570ddfbeadcbbe32d46f4a",
     "screens": [
      "personal-materials-08"
     ]
    },
    {
     "id": "n-commits",
     "text": "21 次提交",
     "meaning": "仓库全部提交，北京时间 8 月 25 日–9 月 27 日",
     "as_of": "2026-09-28",
     "source": "git log --oneline",
     "screens": [
      "personal-materials-11"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-media",
     "with": "personal-media",
     "direction": "双向",
     "flow": "清空手机前把手机上文档的内容指纹交来查重（lookup-content），已有的不再拉；留下的新文档放进所属文件夹后用交接包登记进来（intake）。照片视频录音全归它，这里不碰",
     "source": "personal-media phone_file_preserve_clear.py 第 42、894 行；README 第 254、283 行；本项目 README 第 44 行"
    },
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "交出",
     "flow": "选中的 PDF 没有文字层、又要翻到哪一页时，只把这一份交去认字，位置对回原 PDF 页码和当前指纹",
     "source": "E:\\.agents\\skills\\personal-materials\\SKILL.md 第 23 行；materials.py 第 3386–3392 行"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "每日个人资料热备（北京 17:10）在复制到 G 盘前调用 sync-current；随后材料索引随 E:\\PersonalData 镜像到 G:\\80_Backup\\PersonalData；读私人资料前的资料锁判断来自 PCConfig 的 AuthorityHost",
     "source": "E:\\PCConfig\\tools\\Sync-PersonalReplicasToG.ps1 第 82–89、664–688 行；materials.py 第 4067–4091 行"
    },
    {
     "id": "r-understanding",
     "with": "daily-preferences",
     "direction": "交出",
     "flow": "这里不存认识和画像；个人理解库可以扫描材料库现有目录和索引，挑有价值的原件继续读；下载目录里的投递文件先进材料库",
     "source": "owner-decisions.md“个人理解库的范围与维护授权”；daily-preferences SKILL.md 第 43、61 行"
    },
    {
     "id": "r-formal-docs",
     "with": "personal-formal-documents",
     "direction": "交出",
     "flow": "正式文书的原件位置未知、跨位置或失效时，沿这里定位",
     "source": "E:\\Projects\\Tools\\personal-formal-documents\\docs\\project-contract.md 第 81 行"
    },
    {
     "id": "r-agents",
     "with": "agents",
     "direction": "拿来",
     "flow": "规则规定个人领域直达，只有原件位置不明、要跨位置找或定位失效时才用它；技能 personal-materials 由基座供给和体检",
     "source": "E187 agents.capabilities-runtime.md 第 20 行；E207 agents.capabilities-runtime.md 第 50 行（只读体检脚本）"
    },
    {
     "id": "r-wechat-files",
     "with": "微信电脑客户端",
     "direction": "拿来",
     "flow": "微信收到的文件目录（主号、副号，新旧客户端）每天记文件名清单，只存相对路径、大小、修改时间",
     "source": "SKILL.md 第 31 行；README 第 30 行"
    }
   ],
   "highlights": [
    {
     "id": "h-small-index",
     "title": "只记一小份，其余现找",
     "screen": "personal-materials-08"
    },
    {
     "id": "h-delete-truth",
     "title": "删了就是删了，没接上不算删",
     "screen": "personal-materials-08"
    },
    {
     "id": "h-exact-original",
     "title": "打开的就是登记的那一份",
     "screen": "personal-materials-08"
    },
    {
     "id": "h-version-words",
     "title": "说“签字版”，就不给草稿",
     "screen": "personal-materials-09"
    },
    {
     "id": "h-read-only",
     "title": "只看不记；查找从不顺手改登记",
     "screen": "personal-materials-09"
    }
   ],
   "mentions": [
    {
     "target": "/projects/personal-media/",
     "screen": "personal-materials-01",
     "text": "照片视频录音管理"
    },
    {
     "target": "/how/#personal-materials",
     "screen": "personal-materials-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/cockpit/#personal-materials",
     "screen": "personal-materials-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/projects/personal-media/",
     "screen": "personal-materials-02",
     "text": "照片视频录音管理"
    },
    {
     "target": "/projects/localocr/",
     "screen": "personal-materials-02",
     "text": "本地文字识别"
    },
    {
     "target": "/skills/personal-materials/",
     "screen": "personal-materials-02",
     "text": "找文件原件"
    },
    {
     "target": "/projects/personal-media/",
     "screen": "personal-materials-03",
     "text": "照片视频录音管理"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "personal-materials-04",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/personal-materials/#highlights",
     "screen": "personal-materials-04",
     "text": "亮点"
    },
    {
     "target": "/rules/charter/#L18",
     "screen": "personal-materials-04",
     "text": "约法 L18"
    },
    {
     "target": "/projects/personal-materials/#highlights",
     "screen": "personal-materials-05",
     "text": "亮点"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "每天 17:10 个人资料备份里“材料同步”（materials_sync_current）这一步上次跑得怎么样",
     "source": "PCConfig 每日热备：日志 %LOCALAPPDATA%\\PCConfig\\logs\\hot-backup\\personal-replica-*.log 里最新一行 maintenance=materials_sync_current status=…；失败时回执 G:\\80_Backup\\ControlPlane\\personal-replica-hot-last.json 的 errors 里有 materials_sync_current:<原因>；计划任务 PersonalDataReplica-Hot-Daily 的上次运行时间和结果"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“登记查找”→ f-find；底稿“有限发现”→ f-discover；底稿“候选核验”→ f-verify；底稿“正文定位”→ f-locate；底稿“打开原件”→ f-open；底稿“内容去重”→ f-dedup；底稿“精确接入”→ f-intake；底稿“现状同步”→ f-sync（底稿写“让 AI 按现状更新”，实际是每天 17:10 自动跑，已照实写）；底稿“范围盘点”→ f-inventory（status 只返回计数，并进这一项）。",
    "底稿之外新增 4 项（都有源码）：f-version（materials.py 第 1080–1095 行）、f-filename-list（refresh-filenames，9 月 26 日加）、f-scan-ocr（SKILL.md 第 23 行）、f-retire-source（retire-source）。"
   ],
   "dropped": [
    "init（建库、核对表结构）是技术动作，不列为功能。",
    "README 第 10–18 行的命令示例和 SKILL.md 第 37 行后半句涉及不上网站的类别，不引用；版本词只写“签字、草稿、定稿”，代码里另有两个版本词没写。",
    "旧稿亮点“硬盘没接上不会当成全删”已并进亮点“删了就是删了，没接上不算删”。",
    "9 月 26 日那次撤来源登记还撤了一个不上网站类别的文件夹，演进里只写两个学习资料文件夹。",
    "亮点“说实话，连一道小缝也写明”：资料解锁后重查，打开原件（f-open）仍找不到一次真实使用，照本人“亮点只收在用的做法”不恢复，留在第 5 屏技术节。"
   ],
   "unsure": [
    "“翻到那一页”“打开原件”“扫描件先认字”标“说不准”：资料解锁后（9 月 28 日）逐个查了全部对话记录（Codex 从 9 月 15 日、Claude 从 9 月 24 日起）：open、open-discovered 没有一次带真实参数的调用；locate-content 只有 9 月 27 日一次 AI 审计时的试跑（审计子任务自己挑的材料，不是本人的事），不算真实使用；没有一次返回“扫描件要认字”。9 月 15 日以前的记录不在，所以写说不准而不是没用过。“撤掉失效的来源”查到 9 月 26 日真实用过一次，已改为在用。",
    "第 8 屏写旧个人知识库“能收能查，却给不出我真正要的答案”，是按退役回执 RETIREMENT.md 的“人话结论”转述、替本人口吻写的句子，上线前请本人过目；那个旧项目不在网站项目清单里，所以没加链接。",
    "替本人口吻的其他句子：第 1 屏“记得有份文件，想不起放在哪”；第 3 屏前三个场景的说法（“去年租房签的那份合同”“上个月微信里收到的报价单”“讲押金怎么退的是哪一条”）是展示用例：按关键词查了本人在对话里的原话，能找到的凭印象找都属于不上网站的类别，没有可用的真实例子；第 2 张卡的数字和第 1 屏“真实的一次”是真的。",
    "开头“31 次，全部成功”是 24 天每天一次加 7 次手动补跑（审稿后已在卡片上写明）；日志从 9 月 5 日才有，更早的每日同步有没有跑无从核对。",
    "“现在”横条读日志文件最新一行：回执 JSON 里没有这一步成功的记录（只在失败时写 errors），第 2 批做驾驶舱时要决定是读日志还是先让 PCConfig 把每步状态写进回执（见 audit.md 第 1 条）。",
    "第 7 屏“5 份文件名清单”里微信占 4 份（主号、副号 × 新旧客户端）是按 SKILL.md 第 31 行的描述推的，没有读来源名称逐个核对。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/personal-materials/page.json",
  "sha256": "27eed6d1705f258a9c6b13b786754ae63b5fca11bd2c42cac3ca3d6a6c9567dc",
  "converted_at_beijing": "2026-10-10T06:24:13+08:00"
 }
}
---

::screen{#personal-materials-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-materials-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上大标题，下面一行粗体的一句话，再下面一段介绍；介绍下面一张浅绿底的小卡片，左上粗体“真实的一次”，后面接一段字，“照片视频录音管理”画成绿色链接样式。右上一幅水彩插画：一个半开的木制文件柜抽屉，几页纸从里面微微探出；一只放大镜照在其中一页上，放大镜里那一行被绿色荧光笔划亮；这页纸右边一条绿色细虚线连到一个挂在纸角的小标签，标签上只画一个绿色对勾。纸页上的文字只画成灰色横线，不写任何字。中间一排四张等宽数字卡，每张上面大号绿色粗体数字、下面两行小字说明，卡片左上角一个小图标（依次是：一页带对勾的文件、三个叠放的文件夹、一堆纸、一个循环箭头）。数字卡下面右对齐一行小字“截至……”。再下面横跨整屏一条细长的圆角横条：最左边绿色粗体“现在”，右边小字标签“每天 17:10 同步”，标签右边留一个白底细浅绿描边的圆角空框，约宽 300、高 40 像素（按 1672 宽的画面算），框里什么都不画，网页程序往里填状态字。横条下面左对齐两个白底细浅绿描边的圆角按钮，绿色字。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版 9:16，从上到下：大标题；插画缩到整宽；粗体一句话和介绍；“真实的一次”小卡片整宽；四张数字卡两行两列；“截至……”一行；“现在”横条改成上下两行（上面“现在　每天 17:10 同步”，下面一个空框，约宽 70%、高 5%）；两个按钮上下叠放、各占整宽。字和横版完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "照片视频录音管理",
    "href": "/projects/personal-media/"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#personal-materials"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#personal-materials"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-materials/#ai-brief"
   }
  ],
  "anchors": [],
  "live": [
   "run"
  ],
  "screenshots": [],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "个人材料查找",
     "align": "left",
     "size": "large",
     "asset": "personal-materials\\personal-materials-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-materials-01-h.png",
     "source_box": [
      44,
      56,
      608,
      201
     ]
    },
    {
     "type": "prose",
     "text_ref": "记得有份文件，想不起放在哪：说个大概，AI找出那一份原件，再翻到要看的那一页。",
     "size": "large",
     "bold": true
    },
    {
     "type": "live_box",
     "text_ref": "现在每天17:10同步",
     "slots": 1
    },
    {
     "type": "stat_card",
     "text_ref": "165份58个来源15,105条41次，全部成功精确登记的原件，每份都核对过内容指纹登记过的文件夹、单个文件和文件名清单微信收到的文件和下载",
     "variant": "number_header_table",
     "columns": 4,
     "columns_v": 2,
     "label_position": "above",
     "illustration": "top_inside",
     "icons": [
      "_library/icons/打勾清单.png",
      "_library/icons/文件夹.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "截至10月9日",
     "align": "right"
    },
    {
     "type": "prose",
     "text_ref": "合同、说明书、发票、课件这类文档，散在几十个文件夹、微信收到的文件和下载文件夹里。这个项目只记“哪份文件在哪、叫什么、内容指纹是多少”，不复",
     "row": "hero",
     "width": "55%",
     "row_valign": "center"
    },
    {
     "type": "source_text_card",
     "text_ref": "真实的一次9月25日，我让AI把一批谷歌云盘上传时留在电脑上、只剩一份的文件拿给我看，材料库里已有的直接删。它给这46个文件（约1GB）逐个",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "hero",
     "whole_block": true
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "45%"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作现在正不正常→驾驶舱复制AI续作说明"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第2项：按本屏 asset-map 原槽顺序显式绑定打勾清单、文件夹、文稿堆、绿色箭头，图在数字上方。当前表格统计的 img 已在 DOM 但仍被卡面遮住，见 requests/comp-hub/page-fixer-05-qa-common.md。原标题及原图取色坐标保持。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-01",
    "component_order": [
     "chapter_title",
     "prose",
     "content_card",
     "inline_link",
     "illustration",
     "tag",
     "monospace",
     "stat_card",
     "icon",
     "action_button",
     "live_strip",
     "table"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "个人材料查找",
     "align": "center",
     "size": "large",
     "asset": "personal-materials\\personal-materials-01-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-materials-01-h.png",
     "source_box": [
      44,
      56,
      608,
      201
     ]
    },
    {
     "type": "live_box",
     "text_ref": "现在每天17:10同步",
     "slots": 1
    },
    {
     "type": "stat_card",
     "text_ref": "165份58个来源15,105条41次，全部成功精确登记的原件，每份都核对过内容指纹登记过的文件夹、单个文件和文件名清单微信收到的文件和下载",
     "variant": "number_header_table",
     "columns": 1,
     "columns_v": 1,
     "label_position": "above",
     "illustration": "top_inside",
     "icons": [
      "_library/icons/打勾清单.png",
      "_library/icons/文件夹.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "截至10月9日",
     "align": "right"
    },
    {
     "type": "illustration"
    },
    {
     "type": "prose",
     "text_ref": "记得有份文件，想不起放在哪：说个大概，AI找出那一份原件，再翻到要看的那一页。",
     "size": "large",
     "bold": true
    },
    {
     "type": "prose",
     "text_ref": "合同、说明书、发票、课件这类文档，散在几十个文件夹、微信收到的文件和下载文件夹里。这个项目只记“哪份文件在哪、叫什么、内容指纹是多少”，不复"
    },
    {
     "type": "source_text_card",
     "text_ref": "真实的一次9月25日，我让AI把一批谷歌云盘上传时留在电脑上、只剩一份的文件拿给我看，材料库里已有的直接删。它给这46个文件（约1GB）逐个",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "whole_block": true
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置→怎么协作现在正不正常→驾驶舱复制AI续作说明"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第2项：数字卡单列、数字占整宽，四个图标按本屏原槽显式绑定并置于数字上方。图标已在 DOM 但仍被卡面遮住，见 requests/comp-hub/page-fixer-05-qa-common.md。原标题及原图取色坐标保持。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-01",
    "component_order": [
     "illustration",
     "content_card",
     "stat_card",
     "prose",
     "live_strip",
     "action_button",
     "chapter_title",
     "inline_link",
     "tag",
     "monospace",
     "icon",
     "table"
    ]
   },
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "一页带对勾的文件",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "三个叠放的文件夹",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一堆纸",
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
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "一个循环箭头",
   "sha256": "4c8b24f4690ddc583ca222e8084661258efa002ca92ca8c824c85bda3e179954",
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
   "source_phrase": "右上一幅水彩插画：一个半开的木制文件柜抽屉，几页纸从里面微微探出；一只放大镜照在其中一页上，放大镜里那一行被绿色荧光笔划亮；这页纸右边一条绿色细虚线连到一个挂在纸角的小标签，标签上只画一个绿色对勾。",
   "sha256": "2d93d1dbb7e27d2bfe7edfb1fddc0ce968d1aa0b0d2abf80d5e29944ef796814",
   "status": "ready",
   "original_elements": [
    "一个半开的木制文件柜抽屉，几页纸从里面微微探出；一只放大镜照在其中一页上，放大镜里那一行被绿色荧光笔划亮；这页纸右边一条绿色细虚线连到一个挂在纸角的小标签，标签上只画一个绿色对勾"
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
   "asset": "personal-materials/personal-materials-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-materials-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-3aedbba755a3ecadad30",
   "title_text": "个人材料查找",
   "sha256": "16baef8817de0758ff25860ad8af3013dac676286f76619404361559f51bf1f7",
   "status": "ready",
   "source_box": [
    44,
    56,
    608,
    201
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 个人材料查找

**记得有份文件，想不起放在哪：说个大概，AI 找出那一份原件，再翻到要看的那一页。**

合同、说明书、发票、课件这类文档，散在几十个文件夹、微信收到的文件和下载文件夹里。这个项目只记“哪份文件在哪、叫什么、内容指纹是多少”，不复制、不搬动原件：先查登记过的，不够再到允许的文件夹里按文件名现找；选中后核对确实是那一份，再翻到那一页。照片、视频、录音不归它管。

**真实的一次**　9 月 25 日，我让 AI 把一批谷歌云盘上传时留在电脑上、只剩一份的文件拿给我看，材料库里已有的直接删。它给这 46 个文件（约 1 GB）逐个算内容指纹，跟材料库和〔照片视频录音管理〕的记录比：一个都不重复，于是全部拿给我看；我看完，让它删了。

| **165 份** | **58 个来源** | **15,105 条** | **41 次，全部成功** |
|---|---|---|---|
| 精确登记的原件，每份都核对过内容指纹 | 登记过的文件夹、单个文件和文件名清单 | 微信收到的文件和下载文件夹的文件名，每天更新 | 9 月 5 日起每天 17:10 的同步，含手动补跑 8 次 |

截至 10 月 9 日

**现在**　每天 17:10 同步

〔在整套系统里的位置 → 怎么协作〕　〔现在正不正常 → 驾驶舱〕　〔复制 AI 续作说明〕

::screen{#personal-materials-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-materials-02",
  "section": "usage",
  "title": "什么时候轮到它",
  "scene": "横版：左上标题，下面一行粗体说明。主体是一张五行两列的分流表，画成五条横向的圆角卡片：左半写“你的情况”，中间一个绿色箭头，右半写“谁来办”；第二行（个人材料查找）整条用浅绿底色突出。表格右边一幅小水彩插画：一个路口的木制指路牌，分出若干块空白箭头牌（牌上不写字，数量不表示表格行数或事实），其中一块涂成绿色。最下面一行小字带链接。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和粗体说明在上；五行改成五张上下排的卡片，每张上面“你的情况”、下面绿色箭头和“谁来办”；第二张浅绿底；指路牌插画缩小放在卡片下面；最后一行链接。字和横版完全一样。",
  "links": [
   {
    "text": "照片视频录音管理",
    "href": "/projects/personal-media/"
   },
   {
    "text": "本地文字识别",
    "href": "/projects/localocr/"
   },
   {
    "text": "找文件原件",
    "href": "/skills/personal-materials/"
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
     "text_ref": "什么时候轮到它",
     "align": "center",
     "size": "large",
     "asset": "personal-materials\\personal-materials-02-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-materials-02-v.png",
     "source_box": [
      12,
      28,
      907,
      229
     ]
    },
    {
     "type": "prose",
     "text_ref": "它只管一件事：不知道原件在哪的时候，把那一份找出来。",
     "size": "large",
     "bold": true
    },
    {
     "type": "table",
     "text_ref": "你的情况谁来办知道文件在哪AI直接读，不经过它不知道在哪、要在几个地方找，或者原来的位置失效了个人材料查找找照片、视频、录音，也包括拍成照片",
     "highlight_rows": [
      2
     ],
     "variant": "routing",
     "row": "routing",
     "width": "75%"
    },
    {
     "type": "illustration",
     "row": "routing",
     "width": "25%"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、一个完整的例子：找文件原件"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-02",
    "component_order": [
     "chapter_title",
     "prose",
     "content_card",
     "table",
     "illustration",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "什么时候轮到它",
     "align": "center",
     "size": "large",
     "asset": "personal-materials\\personal-materials-02-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-materials-02-v.png",
     "source_box": [
      12,
      28,
      907,
      229
     ]
    },
    {
     "type": "prose",
     "text_ref": "它只管一件事：不知道原件在哪的时候，把那一份找出来。",
     "size": "large",
     "bold": true
    },
    {
     "type": "table",
     "text_ref": "你的情况谁来办知道文件在哪AI直接读，不经过它不知道在哪、要在几个地方找，或者原来的位置失效了个人材料查找找照片、视频、录音，也包括拍成照片",
     "highlight_rows": [
      2
     ],
     "variant": "routing"
    },
    {
     "type": "illustration"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、一个完整的例子：找文件原件"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-02",
    "component_order": [
     "content_card",
     "illustration",
     "prose",
     "inline_link",
     "chapter_title",
     "table"
    ]
   },
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
   "asset": "_library/illustrations/分岔指路.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "分岔指路",
   "source_phrase": "表格右边一幅小水彩插画：一个路口的木制指路牌，分出若干块空白箭头牌（牌上不写字，数量不表示表格行数或事实），其中一块涂成绿色。",
   "sha256": "1dfe279ec5b683d3ceacacf8af37000c33a04422ad35709f45cfde7f9e6e85c6",
   "status": "ready",
   "original_elements": [
    "一个路口的木制指路牌，分出若干块空白箭头牌（牌上不写字，数量不表示表格行数或事实），其中一块涂成绿色"
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
   "asset": "personal-materials/personal-materials-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-materials-02-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-66df8abb0937a3fde01d",
   "title_text": "什么时候轮到它",
   "sha256": "bf63ff840ff9cf60279ce3e6beb1149fb9c9e238a6c7906965dc6e14217090ab",
   "status": "ready",
   "source_box": [
    12,
    28,
    907,
    229
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 什么时候轮到它

**它只管一件事：不知道原件在哪的时候，把那一份找出来。**

| 你的情况 | 谁来办 |
|---|---|
| 知道文件在哪 | AI 直接读，不经过它 |
| 不知道在哪、要在几个地方找，或者原来的位置失效了 | **个人材料查找** |
| 找照片、视频、录音，也包括拍成照片的证件和截图 | 〔照片视频录音管理〕 |
| 找到的 PDF 是扫描件，要翻到某一页 | 这一份交给〔本地文字识别〕认字 |
| 这份文件说明了什么、接下来怎么办 | 归各自的项目，它只管找到 |

跟 AI 怎么说、一个完整的例子：〔找文件原件〕

::screen{#personal-materials-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-materials-03",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版：左上标题。下面两行两列四张大卡片，每张左上一幅小水彩插画、右边粗体小标题和两三行字。插画依次：①一只手翻开一叠文件，上面压着一个写着“草稿”的红章和一个写着“签字版”的绿章（这两个章上的字就是这两个词）；②一台电脑屏幕，左边一个绿色聊天气泡图标、右边一个下载箭头图标，下面是一列只有灰线的文件名；③一页 PDF 上一行绿色高亮，旁边一个小书签写着“第 4 页”；④一部手机把一页文档递向电脑，中间一个绿色的“=”号。卡片之间留适度空白。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；四张卡片一行一张上下排，插画放在每张卡片顶部。字和横版完全一样。",
  "links": [
   {
    "text": "照片视频录音管理",
    "href": "/projects/personal-media/"
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
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "凭印象找一份合同",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "50%",
     "header_icon": [
      "_library/icons/文稿堆.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "微信里收过、下载过的文件",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-top",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "翻到那一页",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-bottom",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "清手机时不重复存",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "cards-bottom",
     "width": "50%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-03",
    "component_order": [
     "chapter_title",
     "content_card",
     "illustration",
     "section_heading",
     "inline_link"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "平时怎么用",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "凭印象找一份合同",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "header_icon": [
      "_library/icons/文稿堆.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "微信里收过、下载过的文件",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "翻到那一页",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "清手机时不重复存",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-03",
    "component_order": [
     "content_card",
     "illustration",
     "chapter_title",
     "section_heading",
     "inline_link"
    ]
   },
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "凭印象找一份合同\n说“去年租房签的那份合同”。它在登记过的原件里比对标题和已知文字，给出4个以内的候选，写明是标题对上了还是正文对上了，分清草稿、签字版和一模一样的副本。\n草稿签字版",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文稿核验现图小槽4比3",
   "source_phrase": "插画依次：①一只手翻开一叠文件，上面压着一个写着“草稿”的红章和一个写着“签字版”的绿章（这两个章上的字就是这两个词）；②一台电脑屏幕，左边一个绿色聊天气泡图标、右边一个下载箭头图标，下面是一列只有灰线的文件名；③一页 PDF 上一行绿色高亮，旁边一个小书签写着“第 4 页”；④一部手机把一页文档递向电脑，中间一个绿色的“=”号。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一只手翻开一叠文件，上面压着一个画抽象短线的的红章和一个画抽象短线的的绿章（这两个章上的字就是这两个词"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "截图聊天现图小槽3比2",
   "source_phrase": "插画依次：①一只手翻开一叠文件，上面压着一个写着“草稿”的红章和一个写着“签字版”的绿章（这两个章上的字就是这两个词）；②一台电脑屏幕，左边一个绿色聊天气泡图标、右边一个下载箭头图标，下面是一列只有灰线的文件名；③一页 PDF 上一行绿色高亮，旁边一个小书签写着“第 4 页”；④一部手机把一页文档递向电脑，中间一个绿色的“=”号。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "一台电脑屏幕，左边一个绿色聊天气泡图标、右边一个下载箭头图标，下面是一列只有灰线的文件名"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文稿核验现图小槽4比3",
   "source_phrase": "插画依次：①一只手翻开一叠文件，上面压着一个写着“草稿”的红章和一个写着“签字版”的绿章（这两个章上的字就是这两个词）；②一台电脑屏幕，左边一个绿色聊天气泡图标、右边一个下载箭头图标，下面是一列只有灰线的文件名；③一页 PDF 上一行绿色高亮，旁边一个小书签写着“第 4 页”；④一部手机把一页文档递向电脑，中间一个绿色的“=”号。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一页 PDF 上一行绿色高亮，旁边一个小书签画抽象短线的"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/手机传文档.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "手机传文档",
   "source_phrase": "插画依次：①一只手翻开一叠文件，上面压着一个写着“草稿”的红章和一个写着“签字版”的绿章（这两个章上的字就是这两个词）；②一台电脑屏幕，左边一个绿色聊天气泡图标、右边一个下载箭头图标，下面是一列只有灰线的文件名；③一页 PDF 上一行绿色高亮，旁边一个小书签写着“第 4 页”；④一部手机把一页文档递向电脑，中间一个绿色的“=”号。",
   "sha256": "43e7083be7de7470eb4c6c1313009afd427495f4342b608b78b17ebb3596f5c8",
   "status": "ready",
   "original_elements": [
    "一部手机把一页文档递向电脑，中间一个绿色的抽象图形号"
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
   "asset": "personal-health/personal-health-02-title-01.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-8477921ac5c65e15db4b",
   "title_text": "平时怎么用",
   "sha256": "60c9e97a88acfcedd74e9fb83b6da164baa88d0d5f92d3774c43ec4726bce7e9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 平时怎么用

**凭印象找一份合同**
说“去年租房签的那份合同”。它在登记过的原件里比对标题和已知文字，给出 4 个以内的候选，写明是标题对上了还是正文对上了，分清草稿、签字版和一模一样的副本。

草稿　签字版

**微信里收过、下载过的文件**
说“上个月微信里收到的报价单”。微信收到的文件和下载文件夹每天记一份文件名清单，按文件名配对；排在前面的几个再现场确认还在不在。9 月 26 日第一次记：下载文件夹 9,576 个，主号、副号在新旧两版微信里的收件文件夹共 5,719 个；9 月 28 日合计 15,210 条。

**翻到那一页**
选中一份后说“讲押金怎么退的是哪一条”。PDF 给页码，Word 给第几段或表格里第几格，TXT 和 Markdown 给行号，每处附一小段原文。

第 4 页

**清手机时不重复存**
〔照片视频录音管理〕清空手机前，把手机上文档的内容指纹交过来查，这里已有一模一样的就不再拉一份；留下的新文档放进所属文件夹后，精确登记进来。

::screen{#personal-materials-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-materials-04",
  "section": "usage",
  "title": "每天自动做什么，出事怎么办",
  "scene": "横版：左右两栏。左栏窄（约三分之一宽）：标题“每天 17:10，自动”，下面一只水彩闹钟图标，再下面四条带绿色小圆点的短句，最后一行小字。右栏宽：标题“出事怎么办”，下面一张五行两列的表，左列情况、右列它怎么做，每行左边一个小图标（放大镜打问号、两页纸中间一个不等号、一页只有空白的扫描纸、一把锁、一个红色感叹号）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：“每天 17:10，自动”一栏在上；“出事怎么办”在下，表格改成五张卡片，每张上面粗体情况、下面它怎么做。字和横版完全一样。",
  "links": [
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
   },
   {
    "text": "亮点",
    "href": "/projects/personal-materials/#highlights"
   },
   {
    "text": "约法 L18",
    "href": "/rules/charter/#L18"
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
     "text_ref": "每天17:10，自动",
     "align": "left",
     "row": "routine",
     "width": "33%",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "电脑配置与恢复每天备份个人资料，复制到备份硬盘之前先跑这一步：",
     "row": "routine"
    },
    {
     "type": "bullet_list",
     "text_ref": "逐条看登记过的原件还在不在；我删掉的，去掉那一条，连同只属于它的文字（为什么这样定，见亮点）刷新微信收到的文件和下载文件夹的文件名清单做完，",
     "row": "routine"
    },
    {
     "type": "prose",
     "text_ref": "除此之外没有后台程序，不扫整台电脑。",
     "row": "routine"
    },
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "left",
     "row": "routine",
     "width": "67%",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "情况它怎么做没找到列出实际查过哪些来源、哪些打不开、哪些没查，不说“没有这份”；你换个说法或说出大概在哪，它在同样的范围里接着找选中的文件变",
     "row": "routine"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第3项：同排两个章节标题均声明 medium，删除重复头图的独立插画。标题图实际尺寸仍不受 size 控制，见 requests/main/page-fixer-05-qa-common.md。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-04",
    "component_order": [
     "chapter_title",
     "comparison",
     "bullet_list",
     "prose",
     "icon",
     "inline_link",
     "table"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "每天17:10，自动",
     "align": "left",
     "size": "large"
    },
    {
     "type": "illustration"
    },
    {
     "type": "prose",
     "text_ref": "电脑配置与恢复每天备份个人资料，复制到备份硬盘之前先跑这一步："
    },
    {
     "type": "bullet_list",
     "text_ref": "逐条看登记过的原件还在不在；我删掉的，去掉那一条，连同只属于它的文字（为什么这样定，见亮点）刷新微信收到的文件和下载文件夹的文件名清单做完，"
    },
    {
     "type": "prose",
     "text_ref": "除此之外没有后台程序，不扫整台电脑。"
    },
    {
     "type": "chapter_title",
     "text_ref": "出事怎么办",
     "align": "left",
     "size": "large"
    },
    {
     "type": "table",
     "text_ref": "情况它怎么做没找到列出实际查过哪些来源、哪些打不开、哪些没查，不说“没有这份”；你换个说法或说出大概在哪，它在同样的范围里接着找选中的文件变"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-04",
    "component_order": [
     "table",
     "chapter_title",
     "comparison",
     "bullet_list",
     "prose",
     "icon",
     "inline_link"
    ]
   },
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜打问号",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "两页纸中间一个不等号",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一页只有空白的扫描纸",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把锁",
   "sha256": "ed304e783e881716371e4b9d7dd992fa770c9c936fda9d4fc234f5d367d1fc00",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个红色感叹号",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-personal-materials",
   "source_phrase": "横版：左右两栏。左栏窄（约三分之一宽）：标题“每天 17:10，自动”，下面一只水彩闹钟图标，再下面四条带绿色小圆点的短句，最后一行小字。右栏宽：标题“出事怎么办”，下面一张五行两列的表，左列情况、右列它怎么做，每行左边一个小图标（放大镜打问号、两页纸中间一个不等号、一页只有空白的扫描纸、一把锁、一个红色感叹号）。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "sha256": "2d93d1dbb7e27d2bfe7edfb1fddc0ce968d1aa0b0d2abf80d5e29944ef796814",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-30b2f95f0ed4fc8623cf.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-04-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-30b2f95f0ed4fc8623cf",
   "title_text": "每天 17:10，自动",
   "sha256": "52789664b863dea58877b54da6865bf69812144f91bdf8d8e35f5d057ccbc690",
   "status": "ready",
   "source_box": [
    32,
    55,
    594,
    254
   ],
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-45a143d5be04db99e96c.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-45a143d5be04db99e96c",
   "title_text": "出事怎么办",
   "sha256": "f928d0c79dd2f414dc50379971745603f5f60766b4721b9cd809ea3427771c92",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 每天 17:10，自动

〔电脑配置与恢复〕每天备份个人资料，复制到备份硬盘之前先跑这一步：

- 逐条看登记过的原件还在不在；我删掉的，去掉那一条，连同只属于它的文字（为什么这样定，见〔亮点〕）
- 刷新微信收到的文件和下载文件夹的文件名清单
- 做完，整份登记随个人资料一起复制到备份硬盘
- 那天个人资料锁着，这一步就推迟到下一次（10 月 2 日、5 日各推迟过一次）

除此之外没有后台程序，不扫整台电脑。

## 出事怎么办

| 情况 | 它怎么做 |
|---|---|
| 没找到 | 列出实际查过哪些来源、哪些打不开、哪些没查，不说“没有这份”；你换个说法或说出大概在哪，它在同样的范围里接着找 |
| 选中的文件变了 | 大小或内容指纹和登记时对不上，不打开、不交给 AI 读，报告它变了 |
| 扫描件没有文字层 | 说明哪几页没字，这一份交给本地文字识别；不说“里面没有这句话” |
| 资料锁锁着 | 除了看几个计数，什么都不读，先请我验证（〔约法 L18〕） |
| 每天的同步失败 | 备份日志记下这一步失败和原因，开头的“现在”横条显示出来 |

::screen{#personal-materials-05 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-05",
  "section": "tech",
  "title": "一次查找经过哪几步",
  "scene": "横版：左上标题“一次查找经过哪几步”。主体一张从左到右、分两行的流程图，六个节点，每个节点一个圆角卡片：左上绿色圆圈编号、一个小水彩图标、粗体小标题、一两行小字；节点之间用绿色箭头连起来，第一行三个、第二行三个，第三个到第四个的箭头从右端折回下一行左端。第 3 个节点画成虚线边框，旁边一个小标签“不够才走这步”。最下面两段小字：先是“打开时有一道小缝”那一段，左边一个灰色小裂缝图标；再是最后一句话（“亮点”两字画成绿色链接样式），左边一个绿色小指纹图标。图标依次：对话气泡、带对勾的文件夹、放大镜照着一排文件夹、指纹、翻开的书加书签、打开的文件。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；六个节点改成一列从上到下，节点之间向下的绿色箭头；第 3 个节点仍是虚线框加小标签；底部横条放最后。字和横版完全一样。",
  "links": [
   {
    "text": "亮点",
    "href": "/projects/personal-materials/#highlights"
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
     "text_ref": "一次查找经过哪几步",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "1听懂你的话AI把你的描述交给它；它先去掉“帮我找”“那份”“放哪了”这类口头词2先查登记在登记过的165份里比对标题、来源和已知文字，平时",
     "columns": 3,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "tag",
     "text_ref": "不够才走这步"
    },
    {
     "type": "flow",
     "text_ref": "4选中再核对只完整读选中的这一份，算SHA-256内容指纹，和登记时的大小、指纹比5翻到那一页读出这一份的文字，返回页码、段落或行号，附不超",
     "columns": 3,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "打开时有一道小缝：Windows的默认软件只能按路径打开文件，最后一次核对和软件真正读取之间还有极短的空档，项目说明里照实写着，不说“绝对”"
    },
    {
     "type": "prose",
     "text_ref": "为什么一份文件要核几次指纹，见亮点。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-05",
    "component_order": [
     "chapter_title",
     "flow",
     "content_card",
     "icon",
     "section_heading",
     "prose",
     "tag",
     "inline_link",
     "numbered_steps"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "一次查找经过哪几步",
     "align": "center",
     "size": "large"
    },
    {
     "type": "flow",
     "text_ref": "1听懂你的话AI把你的描述交给它；它先去掉“帮我找”“那份”“放哪了”这类口头词2先查登记在登记过的165份里比对标题、来源和已知文字，平时",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "tag",
     "text_ref": "不够才走这步"
    },
    {
     "type": "flow",
     "text_ref": "4选中再核对只完整读选中的这一份，算SHA-256内容指纹，和登记时的大小、指纹比5翻到那一页读出这一份的文字，返回页码、段落或行号，附不超",
     "columns": 1,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "打开时有一道小缝：Windows的默认软件只能按路径打开文件，最后一次核对和软件真正读取之间还有极短的空档，项目说明里照实写着，不说“绝对”"
    },
    {
     "type": "prose",
     "text_ref": "为什么一份文件要核几次指纹，见亮点。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-05",
    "component_order": [
     "flow",
     "tag",
     "chapter_title",
     "content_card",
     "icon",
     "section_heading",
     "prose",
     "inline_link",
     "numbered_steps"
    ]
   },
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "听懂你的话｜AI 把你的描述交给它；它先去掉“帮我找”“那份”“放哪了”这类口头词",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "先查登记｜在登记过的 164 份里比对标题、来源和已知文字，平时给 4 个候选，最多 10 个",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "不够再现找｜挑最相关的至多 8 个来源按文件名找：合计不超过 2,500 个文件、每个来源 12 层、8 秒；微信和下载查文件名清单",
   "sha256": "009e9b0d3bbfea270bc9b84ba86742831419cad0fd982d8e015db0800bd94626",
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
   "source_phrase": "选中再核对｜只完整读选中的这一份，算 SHA-256 内容指纹，和登记时的大小、指纹比",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "翻到那一页｜读出这一份的文字，返回页码、段落或行号，附不超过 280 字的原文",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "笔记本电脑",
   "source_phrase": "交出去｜AI 直接读这个位置；你要自己看，才用电脑的默认软件打开",
   "sha256": "a94819a30d63b31d8f9c3e44cedc1da198bf7c61cd6e92081c44fcb19f2f36a3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e6ba3dabb7a211ac4166.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e6ba3dabb7a211ac4166",
   "title_text": "一次查找经过哪几步",
   "sha256": "e50c3741648d08258cc767c950579bf08cbc66decf899b14db7285a18cebc2e4",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 一次查找经过哪几步

1. **听懂你的话**｜AI 把你的描述交给它；它先去掉“帮我找”“那份”“放哪了”这类口头词
2. **先查登记**｜在登记过的 165 份里比对标题、来源和已知文字，平时给 4 个候选，最多 10 个
3. **不够再现找**｜挑最相关的至多 8 个来源按文件名找：合计不超过 2,500 个文件、每个来源 12 层、8 秒；微信和下载查文件名清单

不够才走这步

4. **选中再核对**｜只完整读选中的这一份，算 SHA-256 内容指纹，和登记时的大小、指纹比
5. **翻到那一页**｜读出这一份的文字，返回页码、段落或行号，附不超过 280 字的原文
6. **交出去**｜AI 直接读这个位置；你要自己看，才用电脑的默认软件打开

**打开时有一道小缝**：Windows 的默认软件只能按路径打开文件，最后一次核对和软件真正读取之间还有极短的空档，项目说明里照实写着，不说“绝对”。用默认软件打开原件这一步，还没在真实使用里验过。

为什么一份文件要核几次指纹，见〔亮点〕。

::screen{#personal-materials-06 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-06",
  "section": "tech",
  "title": "怎么配对、存了什么",
  "scene": "横版：左边约三分之二宽，四张上下排的横向小卡片，每张一个小图标、粗体一句原则、下面一两行小字（图标依次：两个拼在一起的字块、指纹、一个数据库圆柱、一本翻开的书）。第一张卡片里画一个小示意：“租房合同”四个字下面拆成“租房”“房合”“合同”三个绿色小方块。右边一列三个大数字，每个下面一行小字。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；四张卡片一行一张；三个大数字改成一行三个放在最下面。字和横版完全一样。",
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
     "text_ref": "怎么配对、存了什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "配对不用模型，结果能复查",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "principles-0",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "两份一样不一样，只看内容指纹",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "principles-0",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "存位置、指纹和可搜文字",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "principles-1",
     "width": "50%"
    },
    {
     "type": "points_card",
     "text_ref": "读文档用的库",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "principles-1",
     "width": "50%"
    },
    {
     "type": "stat_card",
     "text_ref": "4,242行Python，就一个文件110个自动测试（10月10日数）0字节复制的原件",
     "columns": 3,
     "columns_v": 3,
     "icons": "none"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：四条原理卡按两行两列；三项数字改为下方整宽一行，避免短数字竖栏下方大白。 仅更改单页排版规格，不改定稿字句和素材文件。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-06",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "stat_card",
     "prose"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "怎么配对、存了什么",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "配对不用模型，结果能复查",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "两份一样不一样，只看内容指纹",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "存位置、指纹和可搜文字",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "读文档用的库",
     "columns": 1,
     "whole_block": true,
     "illustration": "left_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "stat_card",
     "text_ref": "4,242行Python，就一个文件110个自动测试（10月10日数）0字节复制的原件",
     "columns": 1,
     "columns_v": 1,
     "icons": "none"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第6项：统计卡 columns 与 columns_v 均为1，4,192行和0字节不再挤进三列。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-06",
    "component_order": [
     "content_card",
     "prose",
     "stat_card",
     "chapter_title",
     "icon"
    ]
   },
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "4,192 行｜Python，就一个文件",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "106 个｜自动测试，9 月 28 日全部通过",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
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
   "source_phrase": "0 字节｜复制的原件",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-d7a2e33250663d085fc9.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-06-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d7a2e33250663d085fc9",
   "title_text": "怎么配对、存了什么",
   "sha256": "2c99959d556daf5fa5229769caaa6f57101e8f67649c6a759c0ac8c722f1cc5e",
   "status": "ready",
   "source_box": [
    23,
    55,
    916,
    293
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 怎么配对、存了什么

**配对不用模型，结果能复查**
听懂你的话是 AI 的事；程序自己只做字面配对：中文按相邻两个字切片。三个字以内的说法要整段出现；更长的，至少对上 2 片、且你说法切出的片有六成在候选里找到，或对上 3 片、且找到三成五，才算候选。它不会“猜”出一份不存在的文件。

租房合同　租房　房合　合同

**两份一样不一样，只看内容指纹**
SHA-256 相同才算一模一样的副本；名字像、日期近都不算。

**存位置、指纹和可搜文字**
一个 SQLite 数据库，五张表：来源、原件、原件之间的关系（比如哪份属于哪个文件包）、可搜的文字（能删了重建）、文件名清单。10 月 9 日：58 个来源，165 份原件，15,105 条文件名。不复制原件，不存人物、事件、重要程度。

**读文档用的库**
PDF 用 pypdf 读文字层，Word 用 python-docx 读正文段落和表格，TXT 和 Markdown 按行读（UTF-8 或带 BOM 的 UTF-16）。

**4,242 行**｜Python，就一个文件
**110 个**｜自动测试（10 月 10 日数）
**0 字节**｜复制的原件

::screen{#personal-materials-07 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-materials-07",
  "section": "tech",
  "title": "范围有多大",
  "scene": "横版：左上标题。上半部一条横向漏斗示意，从左到右四段，越来越窄，每段上面大号绿色数字、下面一行小字：看过的文件 → 去掉照片视频录音 → 非媒体文件 → 精确登记；第三段和第四段之间标注“其余用时现找”。下半部左右两块：左边一条横向堆叠条形图，把 53 个来源分成四段（35、5、8、5），每段不同深浅的绿色，下面四行图例；右边一条横向堆叠条形图，把 164 份登记原件按类型分成七段（74、20、17、18、11、9、15），下面七个图例，条形图上方写总大小。最下面一行小字。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；漏斗改成从上到下四层；两张条形图上下排，图例在各自下面；底部小字。字和横版完全一样。",
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
     "text_ref": "范围有多大",
     "align": "center",
     "size": "large"
    },
    {
     "type": "segmented_band",
     "text_ref": "85,189个看过的文件（重叠的来源只算一次）10,250个是照片、视频、录音，跳过",
     "variant": "funnel",
     "columns": 2,
     "direction": "horizontal",
     "illustration": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "58个来源是什么",
     "row": "ranges",
     "width": "50%",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "chart",
     "text_ref": "35个文件夹：没登记的文件按文件名现找5份文件名清单：微信收到的文件（主号、副号，新旧两版客户端）和下载文件夹，每天更新13个交接文件夹：别",
     "variant": "stacked",
     "row": "ranges",
     "chart_type": "stacked"
    },
    {
     "type": "section_heading",
     "text_ref": "165份登记原件，共1.2GB",
     "row": "ranges",
     "width": "50%",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "chart",
     "text_ref": "PDF74·网页20·Markdown17·Word18·表格11·JSON9·其他16",
     "variant": "stacked",
     "row": "ranges",
     "chart_type": "stacked"
    },
    {
     "type": "prose",
     "text_ref": "上面的文件总数是9月28日20:55数的，那次用时6秒。10月10日再数，20秒上限内没数完，所以总数仍用9"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第4项：分段带按现有 funnel 分两列两排，扩大末格可用宽度；单独的其余用时现找是原定稿段落，完整保留。第5项的两图均已使用现有 stacked，图例数值和说明分行及尾点观感仍见 requests/comp-diagram/page-fixer-05-personal-materials-qa.md。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-07",
    "component_order": [
     "chapter_title",
     "segmented_band",
     "stat_card",
     "prose",
     "annotation",
     "chart",
     "status_legend",
     "bullet_list"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "范围有多大",
     "align": "center",
     "size": "large"
    },
    {
     "type": "segmented_band",
     "text_ref": "85,189个看过的文件（重叠的来源只算一次）10,250个是照片、视频、录音，跳过",
     "variant": "stack",
     "columns": 1,
     "direction": "vertical",
     "illustration": "none"
    },
    {
     "type": "section_heading",
     "text_ref": "58个来源是什么",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "chart",
     "text_ref": "35个文件夹：没登记的文件按文件名现找5份文件名清单：微信收到的文件（主号、副号，新旧两版客户端）和下载文件夹，每天更新13个交接文件夹：别",
     "variant": "stacked",
     "chart_type": "stacked"
    },
    {
     "type": "section_heading",
     "text_ref": "165份登记原件，共1.2GB",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "chart",
     "text_ref": "PDF74·网页20·Markdown17·Word18·表格11·JSON9·其他16",
     "variant": "stacked",
     "chart_type": "stacked"
    },
    {
     "type": "prose",
     "text_ref": "上面的文件总数是9月28日20:55数的，那次用时6秒。10月10日再数，20秒上限内没数完，所以总数仍用9"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第4项：采用现有 stack 纵排等宽四段，保留所有源字和原独立说明段。第5项的两图使用现有 stacked；图例分行及尾点观感仍见 requests/comp-diagram/page-fixer-05-personal-materials-qa.md。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-07",
    "component_order": [
     "segmented_band",
     "chart",
     "status_legend",
     "chapter_title",
     "stat_card",
     "prose",
     "annotation",
     "bullet_list"
    ]
   },
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
   "asset": "_library/titles/title-9c1019fbea36b0468cca.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-07-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-9c1019fbea36b0468cca",
   "title_text": "范围有多大",
   "sha256": "ff88748ed2c877307686246dbe8d57a8228e0cc72f21478111b7c9c485e1f33e",
   "status": "ready",
   "source_box": [
    23,
    0,
    554,
    210
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 范围有多大

**85,189 个**　看过的文件（重叠的来源只算一次）
**10,250 个**　是照片、视频、录音，跳过
**至少 74,939 个**　非媒体文件
**164 份**　当时精确登记　　其余 74,775 个用时现找

其余用时现找

**58 个来源是什么**（10 月 9 日）
- 35 个文件夹：没登记的文件按文件名现找
- 5 份文件名清单：微信收到的文件（主号、副号，新旧两版客户端）和下载文件夹，每天更新
- 13 个交接文件夹：别的项目把原件精确交进来的地方
- 5 个单独登记的文件

**165 份登记原件，共 1.2 GB**（10 月 9 日）
PDF 74 · 网页 20 · Markdown 17 · Word 18 · 表格 11 · JSON 9 · 其他 16
其中 44 份有可搜的文字：18 份是文件自带的完整文字，26 份是提取出的部分文字。

上面的文件总数是 9 月 28 日 20:55 数的，那次用时 6 秒。10 月 10 日再数，20 秒上限内没数完，所以总数仍用 9 月 28 日的。有一个来源超过 5 万个文件，只数到 5 万，所以总数写“至少”。

::screen{#personal-materials-08 section="highlights"}

```typeset
{
 "screen": {
  "id": "personal-materials-08",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：左上标题“亮点”。三张等宽竖向大卡片并排，每张顶部一幅小水彩插画，下面粗体标题，再下面“麻烦”“解法”两段，“麻烦”两字灰色小标签、“解法”两字绿色小标签。插画依次：①左边一座堆到天花板的纸山，右边一个小巧的卡片盒，中间一个绿色箭头；②一只手把一页纸丢进回收站，旁边一块拔掉线的硬盘上挂着一个问号；③一页纸前后各一个指纹，中间一个绿色对勾。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；三张卡片一行一张上下排，插画在每张顶部。字和横版完全一样。",
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
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "只记一小份，其余现找",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "highlights",
     "width": "33.333%",
     "header_icon": [
      "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "删了就是删了，没接上不算删",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "highlights",
     "width": "33.333%"
    },
    {
     "type": "points_card",
     "text_ref": "打开的就是登记的那一份",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "row": "highlights",
     "width": "33.333%"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-08",
    "component_order": [
     "chapter_title",
     "monospace",
     "content_card",
     "illustration",
     "tag",
     "prose"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "只记一小份，其余现找",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png"
     ]
    },
    {
     "type": "points_card",
     "text_ref": "删了就是删了，没接上不算删",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "打开的就是登记的那一份",
     "columns": 1,
     "whole_block": true,
     "illustration": "top_inside",
     "icons": "auto",
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-08",
    "component_order": [
     "content_card",
     "prose",
     "illustration",
     "chapter_title",
     "monospace",
     "tag"
    ]
   },
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
   "asset": "_library/fix-round-2/icon-clean-484477a360da2bd4680d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打开门",
   "source_phrase": "只记一小份，其余现找\n麻烦：以前的个人知识库把材料都收进一个10GB的数据库，记了219万条材料位置，还自己推断事件和人物关系；能收能查，却给不出我真正要的答案，8月25日退役。\n解法：反过来，只记“哪份在哪、叫什么、指纹多少”。现在精确登记164份；其余七万多份不预先登记，用到时在允许的文件夹里现找；你要打开或要收进来时才登记。",
   "sha256": "852456776417cc516beae0cdfd5902ea8ffca347edec2806254ff247171b1766",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/纸山与索引盒.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "纸山与索引盒",
   "source_phrase": "插画依次：①左边一座堆到天花板的纸山，右边一个小巧的卡片盒，中间一个绿色箭头；②一只手把一页纸丢进回收站，旁边一块拔掉线的硬盘上挂着一个问号；③一页纸前后各一个指纹，中间一个绿色对勾。",
   "sha256": "28870a47db5c33b2899a8d5fa7c8ee51d4aa365096baf4d990a7599a2fca3a00",
   "status": "ready",
   "original_elements": [
    "左边一座堆到天花板的纸山，右边一个小巧的卡片盒，中间一个绿色箭头"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "回收纸张",
   "source_phrase": "插画依次：①左边一座堆到天花板的纸山，右边一个小巧的卡片盒，中间一个绿色箭头；②一只手把一页纸丢进回收站，旁边一块拔掉线的硬盘上挂着一个问号；③一页纸前后各一个指纹，中间一个绿色对勾。",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready",
   "original_elements": [
    "一只手把一页纸丢进回收站，旁边一块拔掉线的硬盘上挂着一个问号"
   ],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-ceb7770be79939.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-ceb7770be79939",
   "source_phrase": "插画依次：①左边一座堆到天花板的纸山，右边一个小巧的卡片盒，中间一个绿色箭头；②一只手把一页纸丢进回收站，旁边一块拔掉线的硬盘上挂着一个问号；③一页纸前后各一个指纹，中间一个绿色对勾。",
   "sha256": "cf94dec1a4cbbcb4fd06b860e2b844d3536bc284c2f8a330ed111b089f0ca908",
   "status": "ready",
   "original_elements": [
    "一页纸前后各一个指纹，中间一个绿色对勾"
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
   "asset": "_library/round3/titles/title-r3-ba0d3fdcc635f736cc8b.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 亮点

**只记一小份，其余现找**
麻烦：以前的个人知识库把材料都收进一个 10 GB 的数据库，记了 219 万条材料位置，还自己推断事件和人物关系；能收能查，却给不出我真正要的答案，8 月 25 日退役。
解法：反过来，只记“哪份在哪、叫什么、指纹多少”。现在精确登记 165 份；其余七万多份不预先登记，用到时在允许的文件夹里现找；你要打开或要收进来时才登记。

**删了就是删了，没接上不算删**
麻烦：我在文件夹里删了文件，旧记录还把它当原件给出来；反过来，硬盘没接上时，又不能把整盘当成删光。
解法：删文件不用告诉 AI。每天 17:10 只在来源文件夹能打开、而这个文件确实不存在时，才去掉那一条；文件夹打不开、文件还在但内容变了，都只报告、不删。

**打开的就是登记的那一份**
麻烦：同名的文件、改过的文件、拷来拷去的副本，看名字分不清。
解法：认的是 SHA-256 内容指纹。读之前和读之后在同一个打开的文件上各算一次，写进登记或打开之前再核一次；对不上就不交出去。

::screen{#personal-materials-09 section="highlights"}

```typeset
{
 "screen": {
  "id": "personal-materials-09",
  "section": "highlights",
  "title": "几个小巧思",
  "scene": "横版：左上标题。下面四条横向长卡片上下排，每条左边一个小水彩图标、粗体小标题、右边一两行说明（图标依次：两枚印章“草稿”“签字版”（印章上就是这两个词）、一只眼睛、一把只在固定时间转动的钥匙和时钟、一个装到一半的量杯）。卡片之间用细浅绿分隔线。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；四条卡片一行一条，图标在左、字在右不变。字和横版完全一样。",
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
     "text_ref": "几个小巧思",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "说“签字版”，就不给草稿说法里有“签字”“草稿”“定稿”这类版本词，候选里必须有同样的词才会列出；免得我要签字版，它递来一份草稿。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "只看不记AI自己读的时候只核对，不写登记，也不在桌面上弹出窗口；你说要看，才打开。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "查找从不顺手改登记找、核对、盘点都只读；去掉失效的登记只在每天17:10那一步做，出了问题只查一处。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "大文件夹拖不垮盘点单个来源最多数5万个文件，超了就标“至少”，接着数别的来源，整轮最多20秒。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-09",
    "component_order": [
     "chapter_title",
     "content_card",
     "icon",
     "section_heading"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "几个小巧思",
     "align": "center",
     "size": "large"
    },
    {
     "type": "points_card",
     "text_ref": "说“签字版”，就不给草稿说法里有“签字”“草稿”“定稿”这类版本词，候选里必须有同样的词才会列出；免得我要签字版，它递来一份草稿。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "只看不记AI自己读的时候只核对，不写登记，也不在桌面上弹出窗口；你说要看，才打开。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "查找从不顺手改登记找、核对、盘点都只读；去掉失效的登记只在每天17:10那一步做，出了问题只查一处。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    },
    {
     "type": "points_card",
     "text_ref": "大文件夹拖不垮盘点单个来源最多数5万个文件，超了就标“至少”，接着数别的来源，整轮最多20秒。",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "whole_block": true,
     "icon_position": "header_left"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 独立短卡改已实现points_card保留名/说明，避免基础卡默认叶子压字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-09",
    "component_order": [
     "content_card",
     "chapter_title",
     "icon",
     "section_heading"
    ]
   },
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
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
   "source_phrase": "",
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
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
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
   "source_phrase": "",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-dcd81d9754d1fc331c17.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-09-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-dcd81d9754d1fc331c17",
   "title_text": "几个小巧思",
   "sha256": "9b110977309ed1f7a87273e6bdb78ceca7df41d535c378c040c9d1f00f4c8da2",
   "status": "ready",
   "source_box": [
    17,
    0,
    757,
    262
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 几个小巧思

**说“签字版”，就不给草稿**　说法里有“签字”“草稿”“定稿”这类版本词，候选里必须有同样的词才会列出；免得我要签字版，它递来一份草稿。

草稿　签字版

**只看不记**　AI 自己读的时候只核对，不写登记，也不在桌面上弹出窗口；你说要看，才打开。

**查找从不顺手改登记**　找、核对、盘点都只读；去掉失效的登记只在每天 17:10 那一步做，出了问题只查一处。

**大文件夹拖不垮盘点**　单个来源最多数 5 万个文件，超了就标“至少”，接着数别的来源，整轮最多 20 秒。

::screen{#personal-materials-10 section="features"}

```typeset
{
 "screen": {
  "id": "personal-materials-10",
  "section": "features",
  "title": "全部功能",
  "scene": "横版：和标杆页“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；四组依次往下排。每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（“｜在用”这类字不画出来，只画圆点）。顶上标题，标题下一行图例，图例下一行小字。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。13 张卡片一屏放完。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题、图例和说明在上；组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "g-find",
    "text": "找"
   },
   {
    "id": "f-find",
    "text": "凭印象找"
   },
   {
    "id": "f-version",
    "text": "按版本找"
   },
   {
    "id": "f-discover",
    "text": "再扩大找"
   },
   {
    "id": "f-filename-list",
    "text": "微信和下载的文件名清单"
   },
   {
    "id": "g-read",
    "text": "核对和阅读"
   },
   {
    "id": "f-verify",
    "text": "确认是那一份"
   },
   {
    "id": "f-locate",
    "text": "翻到那一页"
   },
   {
    "id": "f-scan-ocr",
    "text": "扫描件先认字"
   },
   {
    "id": "f-open",
    "text": "打开原件"
   },
   {
    "id": "g-intake",
    "text": "收进来"
   },
   {
    "id": "f-intake",
    "text": "精确登记"
   },
   {
    "id": "f-dedup",
    "text": "按内容查重"
   },
   {
    "id": "g-upkeep",
    "text": "维护"
   },
   {
    "id": "f-sync",
    "text": "删了就不再找"
   },
   {
    "id": "f-inventory",
    "text": "看还有多少"
   },
   {
    "id": "f-retire-source",
    "text": "撤掉失效的来源"
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
     "text_ref": "全部功能（13项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "prose",
     "text_ref": "说不准＝这项用的时候不留记录，9月15–28日的对话记录里（Claude的从9月24日才有）也没找到用过的痕迹。"
    },
    {
     "type": "section_heading",
     "text_ref": "找",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1凭印象找说记得的标题、用途或一句话，在登记过的原件里给出几个候选，写明是标题对上还是正文对上在用2按版本找说“签字版”“草稿”“定稿”，只",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "text_ref": "核对和阅读",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "5确认是那一份选中后重算大小和SHA-256，和登记时比；只核对，不写登记，不弹窗口在用6翻到那一页在选中的PDF、Word、TXT、Mar",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "text_ref": "收进来",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9精确登记别的项目交来一份文件的路径、大小和指纹，现场复算对上才登记；只记位置，不复制原件在用10按内容查重交来一批内容指纹（一次最多100",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "fill_last_row": true
    },
    {
     "type": "section_heading",
     "text_ref": "维护",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "11删了就不再找每天17:10去掉我已删掉的原件那一条；文件夹打不开、内容变了都不删在用12看还有多少按需数一遍来源里有多少非媒体文件、多少",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "fill_last_row": true
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：四个功能组短末行使用已有fill_last_row，尾孤卡及两卡均分整行，保留原条序和图标。 仅更改单页排版规格，不改定稿字句和素材文件。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-10",
    "component_order": [
     "chapter_title",
     "status_legend",
     "section_heading",
     "feature_card",
     "icon"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（13项）",
     "align": "center",
     "size": "large"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "prose",
     "text_ref": "说不准＝这项用的时候不留记录，9月15–28日的对话记录里（Claude的从9月24日才有）也没找到用过的痕迹。"
    },
    {
     "type": "section_heading",
     "text_ref": "找",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "1凭印象找说记得的标题、用途或一句话，在登记过的原件里给出几个候选，写明是标题对上还是正文对上在用2按版本找说“签字版”“草稿”“定稿”，只",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "核对和阅读",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "5确认是那一份选中后重算大小和SHA-256，和登记时比；只核对，不写登记，不弹窗口在用6翻到那一页在选中的PDF、Word、TXT、Mar",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "收进来",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "9精确登记别的项目交来一份文件的路径、大小和指纹，现场复算对上才登记；只记位置，不复制原件在用10按内容查重交来一批内容指纹（一次最多100",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "section_heading",
     "text_ref": "维护",
     "align": "left",
     "size": "medium"
    },
    {
     "type": "feature_card",
     "text_ref": "11删了就不再找每天17:10去掉我已删掉的原件那一条；文件夹打不开、内容变了都不删在用12看还有多少按需数一遍来源里有多少非媒体文件、多少",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-10",
    "component_order": [
     "status_legend",
     "section_heading",
     "chapter_title",
     "feature_card",
     "icon"
    ]
   },
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "凭印象找｜说记得的标题、用途或一句话，在登记过的原件里给出几个候选，写明是标题对上还是正文对上｜在用",
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
   "asset": "_library/icons/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "按版本找｜说“签字版”“草稿”“定稿”，只列出带同样版本词的候选｜在用",
   "sha256": "23f66aeb4b0bf95338544f426a7cc9662a5d8085cb54b1aa7ec0c516469d89b4",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "再扩大找｜候选不对时，在允许的文件夹里按文件名现找一次，有文件数、层数和时间上限｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/微信标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "微信标志",
   "source_phrase": "微信和下载的文件名清单｜微信收到的文件、下载文件夹每天记一份文件名清单，扩大找时一起查，排前面的现场确认还在｜在用",
   "sha256": "009e9b0d3bbfea270bc9b84ba86742831419cad0fd982d8e015db0800bd94626",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "确认是那一份｜选中后重算大小和 SHA-256，和登记时比；只核对，不写登记，不弹窗口｜在用",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "翻到那一页｜在选中的 PDF、Word、TXT、Markdown 里找到页码、段落或行号，附一小段原文｜说不准",
   "sha256": "e381f9a8545a544abd34738bd989247e6d2d3b7f0477cf7d4d6655e8f1cc2a34",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "扫描件先认字｜PDF 没有文字层时，只把这一份交给本地文字识别，找到的位置对回原 PDF 的页码｜说不准",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "打开原件｜核对无误后，用电脑的默认软件打开真正的原件｜说不准",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "精确登记｜别的项目交来一份文件的路径、大小和指纹，现场复算对上才登记；只记位置，不复制原件｜在用",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "按内容查重｜交来一批内容指纹（一次最多 1000 个），告诉你哪些已有一模一样的原件、在哪｜在用",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "删了就不再找｜每天 17:10 去掉我已删掉的原件那一条；文件夹打不开、内容变了都不删｜在用",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "看还有多少｜按需数一遍来源里有多少非媒体文件、多少已登记，写明几点数的、是不是“至少”｜在用",
   "sha256": "5f7cf5327986376bfcc69f5e6fd02b46b26f8fd3a5e3a94feb01c51935021232",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "撤掉失效的来源｜整个文件夹已经不存在、也不再指向任何原件时，才撤掉这条来源登记｜在用",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-89d5d38b73ccb7f50ee7.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-89d5d38b73ccb7f50ee7",
   "title_text": "全部功能（13 项）",
   "sha256": "e46626e7dbf7420e96d4bd40ad16e465db6e17c84ab27c6232b07bd820934234",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（13 项）

图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
说不准＝这项用的时候不留记录，9 月 15–28 日的对话记录里（Claude 的从 9 月 24 日才有）也没找到用过的痕迹。

**找**
1. 凭印象找｜说记得的标题、用途或一句话，在登记过的原件里给出几个候选，写明是标题对上还是正文对上｜在用
2. 按版本找｜说“签字版”“草稿”“定稿”，只列出带同样版本词的候选｜在用
3. 再扩大找｜候选不对时，在允许的文件夹里按文件名现找一次，有文件数、层数和时间上限｜在用
4. 微信和下载的文件名清单｜微信收到的文件、下载文件夹每天记一份文件名清单，扩大找时一起查，排前面的现场确认还在｜在用

**核对和阅读**
5. 确认是那一份｜选中后重算大小和 SHA-256，和登记时比；只核对，不写登记，不弹窗口｜在用
6. 翻到那一页｜在选中的 PDF、Word、TXT、Markdown 里找到页码、段落或行号，附一小段原文｜说不准
7. 扫描件先认字｜PDF 没有文字层时，只把这一份交给本地文字识别，找到的位置对回原 PDF 的页码｜说不准
8. 打开原件｜核对无误后，用电脑的默认软件打开真正的原件｜说不准

**收进来**
9. 精确登记｜别的项目交来一份文件的路径、大小和指纹，现场复算对上才登记；只记位置，不复制原件｜在用
10. 按内容查重｜交来一批内容指纹（一次最多 1000 个），告诉你哪些已有一模一样的原件、在哪｜在用

**维护**
11. 删了就不再找｜每天 17:10 去掉我已删掉的原件那一条；文件夹打不开、内容变了都不删｜在用
12. 看还有多少｜按需数一遍来源里有多少非媒体文件、多少已登记，写明几点数的、是不是“至少”｜在用
13. 撤掉失效的来源｜整个文件夹已经不存在、也不再指向任何原件时，才撤掉这条来源登记｜在用

::screen{#personal-materials-11 section="history"}

```typeset
{
 "screen": {
  "id": "personal-materials-11",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。一条从左到右的绿色时间线，九个节点，每个节点一个绿色圆点，上方粗体日期，下方一两行字，节点上下交错排以免挤；时间线左端画一堆褪色的旧纸山，右端画一个小巧整齐的卡片盒。最下面一行小字。风格照标杆页（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；时间线改成从上到下的竖线，日期在左、字在右；旧纸山放在最上、卡片盒放在最下；底部小字。字和横版完全一样。",
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
     "text_ref": "演进",
     "align": "center",
     "size": "large",
     "asset": "personal-materials\\personal-materials-11-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-11-h.png",
     "source_box": [
      19,
      0,
      388,
      213
     ]
    },
    {
     "type": "timeline",
     "text_ref": "8月25日旧的个人知识库退役；同一天建成个人材料查找：只在登记范围里给少量候选，听得懂平常说法8月27日照片、视频、录音全部划给照片视频录音",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/icons/波形照片.png",
      "_library/icons/文件夹.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文稿堆.png",
      "_library/icons/文稿堆.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "8月25日–9月27日，一共21次提交。"
    }
   ],
   "notes": "依据 typeset-out/_qa/review/personal-materials.md 的本页审查修复；定稿节点完整分配，正文不缩字。第1项：九节点时间线 columns=1、direction=vertical，完整日期和说明纵排。原标题及原图取色坐标保持。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-11",
    "component_order": [
     "chapter_title",
     "timeline",
     "content_card",
     "prose"
    ]
   },
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "large",
     "asset": "personal-materials\\personal-materials-11-title-01.png",
     "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-11-h.png",
     "source_box": [
      19,
      0,
      388,
      213
     ]
    },
    {
     "type": "timeline",
     "text_ref": "8月25日旧的个人知识库退役；同一天建成个人材料查找：只在登记范围里给少量候选，听得懂平常说法8月27日照片、视频、录音全部划给照片视频录音",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/icons/波形照片.png",
      "_library/icons/文件夹.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
      "_library/fix-round-2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
      "_library/icons/文稿堆.png",
      "_library/icons/文稿堆.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "8月25日–9月27日，一共21次提交。"
    }
   ],
   "notes": "以 screens.jsonl 的 source_layout、定稿 scene/portrait 为文字构图依据；未看图。定稿节点完整分配，正文不缩字。 该章节标题显式复用旧manifest逐字一致裁切及其原图坐标，按G4实际取色，不拿共享标题缺坐标冒充通过。",
   "layout_reference": {
    "inventory": "typeset-inventory/screens.jsonl",
    "screen_id": "personal-materials-11",
    "component_order": [
     "timeline",
     "content_card",
     "chapter_title",
     "prose"
    ]
   },
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹放大镜",
   "source_phrase": "8 月 25 日 旧的个人知识库退役；同一天建成个人材料查找：只在登记范围里给少量候选，听得懂平常说法",
   "sha256": "99ea4809646d31db12b8e216bc463e77f51b435a55e6e70607697f3a0363023c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "波形照片",
   "source_phrase": "8 月 27 日 照片、视频、录音全部划给照片视频录音管理，这里查找、现找都跳过媒体",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹",
   "source_phrase": "8 月 31 日–9 月 1 日 认准“是哪一份”：现找的候选和来源文件夹绑在一起，不会被别处的同名文件顶替",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "9 月 2 日 能数清来源里还有多少文件",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件夹放大镜",
   "source_phrase": "9 月 3 日 我删了就是删了；去掉失效登记挪进每天的维护，查找不再顺手改登记",
   "sha256": "99ea4809646d31db12b8e216bc463e77f51b435a55e6e70607697f3a0363023c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "9 月 5 日 只核对、不打开；能翻到选中文件的那一页",
   "sha256": "827f125e690505d54320a842e5eb97301f7fb4627563545a827d122d27d6e974",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "9 月 11 日 按内容指纹查重，清手机时用上",
   "sha256": "df60f360f11a7654f00fca6918874cd62c11575b707a678cd23d5baad630e8d2",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "9 月 24 日 读私人资料前先过统一的资料锁",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文稿堆",
   "source_phrase": "9 月 26 日 微信收到的文件和下载文件夹也能按文件名找到；两个已清空的学习资料文件夹（Jenkins 参考、Linux 与 Kafka）撤掉了来源登记，原件一个没动",
   "sha256": "e2aea4f2809dededd76f1846875ca699b57eec4231132cc3040d6c11c3ae6646",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-materials/personal-materials-11-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-materials\\img\\personal-materials-11-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "9295104b2b762c99b491be8f3d3014cc5199cfc958a820556f1856b59a70d168",
   "status": "ready",
   "source_box": [
    19,
    0,
    388,
    213
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 演进

- **8 月 25 日**　旧的个人知识库退役；同一天建成个人材料查找：只在登记范围里给少量候选，听得懂平常说法
- **8 月 27 日**　照片、视频、录音全部划给照片视频录音管理，这里查找、现找都跳过媒体
- **8 月 31 日–9 月 1 日**　认准“是哪一份”：现找的候选和来源文件夹绑在一起，不会被别处的同名文件顶替
- **9 月 2 日**　能数清来源里还有多少文件
- **9 月 3 日**　我删了就是删了；去掉失效登记挪进每天的维护，查找不再顺手改登记
- **9 月 5 日**　只核对、不打开；能翻到选中文件的那一页
- **9 月 11 日**　按内容指纹查重，清手机时用上
- **9 月 24 日**　读私人资料前先过统一的资料锁
- **9 月 26 日**　微信收到的文件和下载文件夹也能按文件名找到；两个已清空的学习资料文件夹（Jenkins 参考、Linux 与 Kafka）撤掉了来源登记，原件一个没动

8 月 25 日–9 月 27 日，一共 21 次提交。
