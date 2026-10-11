---
{
 "title": "照片视频录音管理",
 "kind": "project",
 "url": "/projects/personal-media/",
 "tagline": "手机腾空、原件去留、找回和上云，全交给 AI 管。",
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
  },
  {
   "id": "gallery",
   "label": "画廊"
  }
 ],
 "page": {
  "reading_order": [
   "personal-media-01",
   "personal-media-07",
   "personal-media-04"
  ],
  "schema": "site-b1.page.v1",
  "page": "personal-media",
  "kind": "project",
  "title": "照片视频录音管理",
  "url": "/projects/personal-media/",
  "tagline": "手机腾空、原件去留、找回和上云，全交给 AI 管。",
  "status": "常用",
  "public": false,
  "repo_url": null,
  "capability": "管照片、视频、录音原件",
  "based_on": {
   "commit": "b5f84ef0bcead2a7f9e912dbd9bd8e28d087eddd",
   "commit_time": "2026-10-10T01:39:06+08:00"
  },
  "video_prompt": "6 秒无缝循环，白底水彩风，从开头这屏右上的插画出发：左边手机屏幕上的几张照片轻轻飘起，沿一条绿色虚线弧飞进右边叠放的三块黑色硬盘，硬盘前面的绿色指示灯依次亮一下；硬盘上方的云朵里绿色向上箭头缓缓上下浮动；旁边录音笔屏幕上的绿色声波轻轻起伏；盆栽叶子随微风轻摆。镜头不动，没有文字，最后一帧回到第一帧。",
  "registry": {
   "groups": [
    {
     "id": "g-find",
     "name": "找东西"
    },
    {
     "id": "g-first-connect",
     "name": "手机第一次连上"
    },
    {
     "id": "g-after-unplug",
     "name": "拔线后在电脑上"
    },
    {
     "id": "g-decide",
     "name": "我来拍板"
    },
    {
     "id": "g-intake",
     "name": "收进来、改信息"
    },
    {
     "id": "g-phone-picks",
     "name": "放回手机的精选"
    },
    {
     "id": "g-cloud",
     "name": "云端"
    },
    {
     "id": "g-daily",
     "name": "每天自动和日常维护"
    },
    {
     "id": "g-private",
     "name": "私密"
    }
   ],
   "features": [
    {
     "id": "f-find-media",
     "group": "g-find",
     "name": "找照片、视频、录音",
     "what": "说哪天、在哪、拍了什么、画面里有什么字、录音里说过什么，它找出原件",
     "how": "跟 AI 说大概的时间、地点、画面或录音里的话，照片视频可以只找一种",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11459（search）；技能 E:\\.agents\\skills\\personal-media\\SKILL.md"
    },
    {
     "id": "f-find-passage",
     "group": "g-find",
     "name": "找录音里的某句话",
     "what": "说出那句话里的几个词，它告诉我在第几分第几秒（那段录音要先转过带时间的文字）",
     "how": "先找到那段录音，再说要找的话",
     "status": "待验收",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11464（locate-audio）；README 第 171 行：多数录音要先补带时间戳的转写"
    },
    {
     "id": "f-browse-folder",
     "group": "g-find",
     "name": "把找到的放进一个文件夹",
     "what": "找到的原件临时放进一个文件夹给我翻，不多占空间，看完就清掉",
     "how": "说“放进一个文件夹给我看”，看完说清掉",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11472（browse，同盘硬链接）、11479（clean）；真实使用：8 月 26 日建 browse\\CAS待处理图片-20260826 给本人看，8 月 27 日清掉 26 个文件（E:\\Media\\_manifests\\personal-media-current\\cas-browse-cleanup-receipt.json，PASS）"
    },
    {
     "id": "f-preserve-two",
     "group": "g-first-connect",
     "name": "新文件存两份",
     "what": "已有的跳过，新的在主硬盘、备份硬盘各存一份，逐个核对指纹",
     "how": "插上手机后自动做",
     "status": "在用",
     "maintenance": "只修报错",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\phone_file_preserve_clear.py:1594；本人决定 ZS15（9 月 27 日手机部分只修报错）"
    },
    {
     "id": "f-clear-phone",
     "group": "g-first-connect",
     "name": "清空手机",
     "what": "照片、视频、录音、文档等新文件都核对过两份，才一个个删掉手机上的这些；联系人、短信、聊天和 App 数据不碰",
     "how": "插上手机后自动做，删完告诉我可以拔线",
     "status": "在用",
     "maintenance": "只修报错",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\phone_file_preserve_clear.py:2923；README 第 226、248、254 行（文档等共享文件同样保全、清空）"
    },
    {
     "id": "f-phone-delete-follow",
     "group": "g-first-connect",
     "name": "手机上删了，电脑跟着删",
     "what": "放回手机的精选我在手机上删了，下次连上时电脑那份也删",
     "how": "在手机上删就行，下次连上时自动核对",
     "status": "在用",
     "maintenance": "只修报错",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\phone_file_preserve_clear.py:2542；本人决定 FY24（9 月 13 日）"
    },
    {
     "id": "f-pick-keepers",
     "group": "g-after-unplug",
     "name": "挑出值得留的",
     "what": "没用的不留（有用的事实先记进理解库），重复的只留一张，留下的分类、写描述、写出删掉会失去什么",
     "how": "拔线后 AI 在电脑上做",
     "status": "在用",
     "maintenance": "只修报错",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11533（phone-prepare，每张总览 25 格）、11541（phone-apply）"
    },
    {
     "id": "f-audio-docs",
     "group": "g-after-unplug",
     "name": "录音和文档一起整理",
     "what": "录音看转写定去留，文档交给个人材料查找",
     "how": "拔线后 AI 在电脑上做",
     "status": "在用",
     "maintenance": "只修报错",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\README.md 第 254–283 行（录音、文档同在一批里审，文档放回所属项目并登记到材料库）"
    },
    {
     "id": "f-staging-30d",
     "group": "g-after-unplug",
     "name": "满 30 天清掉暂存",
     "what": "不留的文件先在电脑上暂存 30 天，这期间能找回，到期进回收站",
     "how": "不用管，到期自动处理",
     "status": "待验收",
     "maintenance": "只修报错",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\README.md 第 26 行（closeout 退出保全副本）；v7 标黄，本次未见验收记录"
    },
    {
     "id": "f-review-page",
     "group": "g-decide",
     "name": "审批页",
     "what": "拿不准的做成一页，看着实物点保留或不留，带一栏抽查；我留下的它以后不能再撤",
     "how": "打开 AI 给的页面，每件点保留或不留，写一句说明",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11591（review-page）、11601（owner-decide）；本人决定 FY21"
    },
    {
     "id": "f-retract",
     "group": "g-decide",
     "name": "撤回",
     "what": "已经留下的，事后不想留了就撤出来，手机和云端跟着撤，30 天内能找回",
     "how": "指出哪件不要了，先看影响再执行",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11547（retract-applied）；本人决定 FY22"
    },
    {
     "id": "f-named-delete",
     "group": "g-decide",
     "name": "点名删除",
     "what": "我明确说删的，哪怕只剩这一份也删，先记下我的原话",
     "how": "直接说“把这几张删掉”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11609（owner-delete）"
    },
    {
     "id": "f-pc-delete-follow",
     "group": "g-decide",
     "name": "我在电脑上直接删",
     "what": "在文件夹里删了原件，不用告诉 AI：备份硬盘上的当天移进待删区、30 天后删，云端随后删，下次连手机时手机上也删",
     "how": "在文件夹里删就行",
     "status": "待验收",
     "maintenance": "日用",
     "screen": "personal-media-11",
     "source": "V:\\Personal\\Projects\\personal-media\\USER_REQUIREMENTS.md（7cb814c 新增的本人补充）；docs\\cloud-maintenance.md；G:\\80_Backup\\ControlPlane\\personal-replica-hot-last.json（deletion_propagated=true）"
    },
    {
     "id": "f-ingest-single",
     "group": "g-intake",
     "name": "收进单个文件",
     "what": "不是从手机来的，比如电脑录屏，直接收进来；在文件夹里却没登记的，原地补上记录",
     "how": "说“把这个收进来”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11559（ingest-file）；提交 f517be9（补登记 OBS 录屏）"
    },
    {
     "id": "f-one-format",
     "group": "g-intake",
     "name": "同一段视频只留一种格式",
     "what": "同一段视频有 MP4 和 MOV 两个文件，画面完全一样就只留一个",
     "how": "说“这两个是同一段，留一个”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11559（ingest-file 的等价容器退出）；真实使用：8 月 26 日 E:\\Downloads\\recording.mp4 与已登记视频内容相同，按 content_equivalent_variant_retired 退出、G 盘留一份（ingest\\05dd90bc….json，PASS）"
    },
    {
     "id": "f-albums",
     "group": "g-intake",
     "name": "编相册",
     "what": "挑中的照片编成一个起好名字的相册，Google 相册和手机上也有同名相册",
     "how": "说哪些照片编成什么相册",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11441（inventory 标注的相册整理入口）；9 月 15 日第一个相册"
    },
    {
     "id": "f-fix-date-place",
     "group": "g-intake",
     "name": "改日期、地点",
     "what": "照片日期或地点标错了，告诉它改成什么，电脑、手机、云端一起改",
     "how": "说哪张、改成什么",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11577（update-entry）"
    },
    {
     "id": "f-phone-picks",
     "group": "g-phone-picks",
     "name": "挑哪些放回手机",
     "what": "精选的自动放，普通的写出理由才放，我在审批页留下的默认放，总共不超过 60 GB",
     "how": "不用管；想带某张就说",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:63（PHONE_RECOVERY_MAX_BYTES=60_000_000_000）、11360"
    },
    {
     "id": "f-daily-picks",
     "group": "g-phone-picks",
     "name": "每天更新要放回的精选",
     "what": "电脑上备着一份要放回手机的精选，每天按最新挑选自动增删",
     "how": "不用管，每天 17:10 自动做",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11486（recovery-sync）；E:\\PCConfig\\tools\\Sync-PersonalReplicasToG.ps1:98–102；recovery-sync-receipt.json（9 月 28 日 PASS，2376 件）"
    },
    {
     "id": "f-phone-writeback",
     "group": "g-phone-picks",
     "name": "放回手机",
     "what": "第二次连上时只补新的、删多余的、挪位置，断了接着来，最后确认相册里看得到",
     "how": "第二次插上手机时自动做",
     "status": "在用",
     "maintenance": "只修报错",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\phone_file_preserve_clear.py:3287"
    },
    {
     "id": "f-phone-verify-only",
     "group": "g-phone-picks",
     "name": "只核对，不放回",
     "what": "只检查手机上的精选是不是都在，不往手机放东西",
     "how": "说“只查一下手机上的精选全不全”",
     "status": "没用过",
     "maintenance": "只修报错",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\phone_file_preserve_clear.py（核对模式）；v7 标灰"
    },
    {
     "id": "f-cloud-plan",
     "group": "g-cloud",
     "name": "算好每件去哪",
     "what": "每张照片该进 Google 相册哪个相册、每段录音该进 Drive 哪个文件夹，先在电脑上算好",
     "how": "不用管，维护时自动算",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11498（cloud-reconcile）；cloud-candidates.ndjson（9 月 28 日 17:11 更新）"
    },
    {
     "id": "f-cloud-upload",
     "group": "g-cloud",
     "name": "上传并核对",
     "what": "新留下的满 30 天才传，每件记下 Google 给的编号，重跑也不会重复传",
     "how": "不用管；也可以说“把这批传上去”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:6020（CLOUD_UPLOAD_SETTLE_DAYS=30）、11519（cloud-sync）"
    },
    {
     "id": "f-cloud-status",
     "group": "g-cloud",
     "name": "看还有多少没上云",
     "what": "列出已传的、还没到 30 天的、等着删的各有多少",
     "how": "问“云上还差多少”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11491（cloud-status）；cloud_upload.py --status"
    },
    {
     "id": "f-upload-wakeup",
     "group": "g-cloud",
     "name": "传完叫回 AI",
     "what": "上传要跑几个小时，传完或出错自动把 AI 叫回来收尾",
     "how": "不用管",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "V:\\Personal\\Projects\\personal-media\\cloud_wakeup_probe.py；cloud-upload-wakeup.log（9 月 13 日）"
    },
    {
     "id": "f-cloud-maintain",
     "group": "g-cloud",
     "name": "云端自动跟上",
     "what": "每天维护后自动跑一轮云端：满 30 天的新文件上传，电脑上删了的录音进 Drive 回收站，这部分已启用，最近一次 10 月 10 日 17:27 跑完；照片视频攒够 30 张由 AI 开网页删，网页定时任务还没部署",
     "how": "不用管",
     "status": "待验收",
     "maintenance": "日用",
     "screen": "personal-media-12",
     "source": "personal_media.py cloud-maintain；最近一次 10 月 10 日 17:27 跑完；照片视频网页定时任务还没部署"
    },
    {
     "id": "f-daily-maintain",
     "group": "g-daily",
     "name": "每天维护",
     "what": "每天 17:10 按硬盘上的实际情况更新记录，同步到备份硬盘，更新要放回手机的精选",
     "how": "不用管",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11406（sync-current）；计划任务 PersonalDataReplica-Hot-Daily（本机 04:10 CDT＝北京 17:10）"
    },
    {
     "id": "f-rebuild",
     "group": "g-daily",
     "name": "记录坏了重建",
     "what": "从存档的文字版把整份记录重建出来，云端编号一起恢复，不用重新上传",
     "how": "记录坏了时让 AI 恢复",
     "status": "没用过",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11392（catalog-build --cloud-state）、1179"
    },
    {
     "id": "f-snapshot-github",
     "group": "g-daily",
     "name": "记录存进 GitHub",
     "what": "整理完把整份记录的文字版存进私有仓库",
     "how": "不用管，整理完 AI 顺手做",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11455（snapshot-metadata）；提交 d261e67、f517be9"
    },
    {
     "id": "f-search-noise",
     "group": "g-daily",
     "name": "清理搜索里的杂音",
     "what": "把混进描述里的整理过程挪出去，搜索不再冒出无关结果",
     "how": "发现搜出无关的就说",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11414（repair-search-content）"
    },
    {
     "id": "f-beijing-dates",
     "group": "g-daily",
     "name": "按北京时间重算日期",
     "what": "重算每件是哪天拍的，对不上的标“日期不确定”",
     "how": "不用管",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11421（repair-local-dates）"
    },
    {
     "id": "f-catalog-check",
     "group": "g-daily",
     "name": "检查记录是否完好",
     "what": "记录有没有坏、一共多少件、硬盘接没接着",
     "how": "问“媒体记录还好吗”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11410（status）"
    },
    {
     "id": "f-acceptance",
     "group": "g-daily",
     "name": "整体验收",
     "what": "大改之后跑一遍测试和真实查询，核对电脑、手机、云端的记录对不对得上",
     "how": "大改后 AI 自己跑",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\acceptance.ps1；current-acceptance.json（9 月 24 日）"
    },
    {
     "id": "f-restore-markers",
     "group": "g-daily",
     "name": "补回丢失的处理记号",
     "what": "某批手机文件“已处理”的记号丢了，用当时的回执补回来，免得重复处理",
     "how": "发现重复处理时 AI 自己做",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11398（recover-phone-review-binding）；提交 73c86c3"
    },
    {
     "id": "f-private-hidden",
     "group": "g-private",
     "name": "私密的默认搜不出来",
     "what": "比如健康和基因检测结果这类照片，平时搜不出来；我说“包括私密的”，或 AI 更新对我的理解、私密的会改变结论时，才带上，只拿出需要的那几件",
     "how": "说“包括私密的”",
     "status": "在用",
     "maintenance": "日用",
     "screen": "personal-media-13",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11428（set-private-hidden）、1662；技能 --include-private"
    }
   ],
   "numbers": [
    {
     "id": "n-images-sorted",
     "text": "19851 → 3357 张",
     "meaning": "9 月 11–13 日那次整理：E:\\Pictures 里项目认得的图片从 19851 张降到 3357 张（含本人手删 328 张，另有 3 张后来手选新增）",
     "as_of": "2026-09-13",
     "source": "V:\\Personal\\Projects\\personal-media\\LOCAL_CLEANUP_RESULT.md 第 9、36 行；VALUE_SAMPLING.md 第 239 行",
     "screens": [
      "personal-media-01",
      "personal-media-10",
      "personal-media-14"
     ]
    },
    {
     "id": "n-catalog",
     "text": "4366 件 · 近 99 GB",
     "meaning": "目录库 media 表条数（图片 3486、视频 118、音频 762），大小按每件原件路径取文件大小相加＝98.63 GB（十进制），4366 件全部在位",
     "as_of": "2026-10-11",
     "source": "personal_media.py status / status --technical：PASS、catalog_rows=4366（北京 10 月 11 日 16:31—16:36 只读）；只读 SQL 按 media_type 分组，逐件 os.stat 求和 98,630,211,493 字节",
     "screens": [
      "personal-media-01"
     ]
    },
    {
     "id": "n-phone-picks",
     "text": "2377 件",
     "meaning": "要放回手机的精选包件数（45.42 GB）",
     "as_of": "2026-10-11",
     "source": "personal_media.py recovery-status：selected=2377、bytes=45,421,635,927、PASS_SELECTED_PLAN_CONSISTENT（北京 10 月 11 日 16:31—16:36 只读）",
     "screens": [
      "personal-media-01"
     ]
    },
    {
     "id": "n-phone-cap",
     "text": "60 GB",
     "meaning": "手机精选包上限",
     "as_of": "2026-09-28",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:63",
     "screens": [
      "personal-media-05",
      "personal-media-08",
      "personal-media-12"
     ]
    },
    {
     "id": "n-first-clear",
     "text": "1913 个新文件，17 分钟",
     "meaning": "9 月 26 日北京时间 04:43 那次连手机：新增 1913 个文件（照片视频 1863、文档 35、录音 15；其中 524 个电脑上已有，只记对应关系），存两份、核对、删完手机 04:43–05:00；删 1735 个，另 178 个删时已不在",
     "as_of": "2026-09-26",
     "source": "E:\\Media\\_manifests\\phone-shared-full-preserve-successor-v2\\runs\\20260925t204325146525-0a1ebafeb859-146552900\\capture-manifest.json（item_count 1913，kind 计数）、deletion-receipt.json（completed 21:00:16 UTC）",
     "screens": [
      "personal-media-01",
      "personal-media-02"
     ]
    },
    {
     "id": "n-writeback",
     "text": "2376 件精选放回手机",
     "meaning": "9 月 26 日第三次连上时回写手机精选，逐个核对 2376 件都在（45.42 GB）",
     "as_of": "2026-09-26",
     "source": "E:\\Media\\_manifests\\phone-shared-full-preserve-successor-v2\\runs\\20260926t091707214241-0a1ebafeb859-214267900\\phone-recovery-writeback.json（PASS，verified_items 2376，完成 17:58 北京时间）",
     "screens": [
      "personal-media-01"
     ]
    },
    {
     "id": "n-dongshan",
     "text": "4 秒找出那天的一百多张",
     "meaning": "一次真实查询：按那次下雪去的公园和当天日期、只要照片，找到一百多张（生活与回忆、精选两类）；只取前 8 张时实测用时 3.99 秒。示例不点名地点和日期",
     "as_of": "2026-09-28",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py search 只读实跑",
     "screens": [
      "personal-media-07"
     ]
    },
    {
     "id": "n-samples",
     "text": "24 件",
     "meaning": "定尺子时本人回答过的样本数（七轮累计）",
     "as_of": "2026-09-13",
     "source": "V:\\Personal\\Projects\\personal-media\\VALUE_SAMPLING.md 第 204 行",
     "screens": [
      "personal-media-10",
      "personal-media-14"
     ]
    },
    {
     "id": "n-first-upload",
     "text": "4230 件、96 GB",
     "meaning": "第一次全量上云件数和原件大小（96.18 GB，十进制）",
     "as_of": "2026-09-14",
     "source": "V:\\Personal\\Projects\\personal-media\\CLOUD_UPLOAD_RESULT.md 第 15 行；docs\\history\\phase-records.md 第 59 行",
     "screens": [
      "personal-media-10",
      "personal-media-14"
     ]
    },
    {
     "id": "n-upload-hours",
     "text": "6 个小时",
     "meaning": "第一次全量上云后台传输用时（日志 9 月 13 日 16:29–23:04 UTC，约 6.6 小时）",
     "as_of": "2026-09-14",
     "source": "cloud-upload-all.log 的创建和最后写入时间",
     "screens": [
      "personal-media-10"
     ]
    },
    {
     "id": "n-code-lines",
     "text": "16,433 行",
     "meaning": "Python 正式代码行数（不含 test_*.py，6 个文件，wc -l）",
     "as_of": "2026-10-11",
     "source": "git ls-files '*.py' 排除 test_ 后 splitlines 只读统计，提交 b5f84ef",
     "screens": [
      "personal-media-09"
     ]
    },
    {
     "id": "n-tests",
     "text": "测试定义 453 个（只计数）",
     "meaning": "按 10 月 10 日的源码版本、10 月 11 日静态清点，不是这次跑过的通过数",
     "as_of": "2026-10-11",
     "source": "git ls-files test_*.py 后静态统计 def test_，提交 b5f84ef；本轮未运行测试",
     "screens": [
      "personal-media-09"
     ]
    },
    {
     "id": "n-thumbs",
     "text": "25 张",
     "meaning": "一张总览拼的缩略图数（5 列）",
     "as_of": "2026-09-28",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:6957（per_sheet=25）",
     "screens": [
      "personal-media-08",
      "personal-media-09"
     ]
    },
    {
     "id": "n-settle-days",
     "text": "30 天",
     "meaning": "新留下的上云等待期；两块备份硬盘待删区保留期；电脑暂存保留期",
     "as_of": "2026-09-28",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:6020；E:\\PCConfig\\registries\\core_recovery.json maintenance.deletion_quarantine.retention_days",
     "screens": [
      "personal-media-05",
      "personal-media-06",
      "personal-media-08",
      "personal-media-11",
      "personal-media-12",
      "personal-media-14"
     ]
    },
    {
     "id": "n-web-batch",
     "text": "30 张",
     "meaning": "Google 相册照片视频攒够多少张才开网页删一次",
     "as_of": "2026-09-28",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:6023",
     "screens": [
      "personal-media-06",
      "personal-media-12"
     ]
    },
    {
     "id": "n-daily-time",
     "text": "17:10",
     "meaning": "每天维护的北京时间（计划任务本机 04:10 CDT）",
     "as_of": "2026-09-28",
     "source": "计划任务 PersonalDataReplica-Hot-Daily 触发器",
     "screens": [
      "personal-media-01",
      "personal-media-05",
      "personal-media-08",
      "personal-media-13",
      "personal-media-14"
     ]
    },
    {
     "id": "n-cold-time",
     "text": "14:30",
     "meaning": "外接第三块硬盘每天同步的北京时间（另加每次登录）",
     "as_of": "2026-09-28",
     "source": "计划任务 AIRecoveryColdSync-Daily（本机 01:30 CDT＋登录触发）",
     "screens": [
      "personal-media-05"
     ]
    },
    {
     "id": "n-feature-count",
     "text": "35 项",
     "meaning": "全部功能条数",
     "as_of": "2026-09-28",
     "source": "本页 registry.features",
     "screens": [
      "personal-media-11"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-understanding",
     "with": "daily-preferences",
     "direction": "交出",
     "flow": "整理时截图、订单这类不留的图里有用的事实先记进个人理解库（已有的不重复记），图再删",
     "source": "本页第 3 屏；本人决定记录 1701 行"
    },
    {
     "id": "r-materials",
     "with": "personal-materials",
     "direction": "双向",
     "flow": "手机带回来的文档留下的放进所属项目原件位置并登记到材料库；清空手机前按内容查材料库，已有的不再拉",
     "source": "V:\\Personal\\Projects\\personal-media\\README.md 第 26、283 行"
    },
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "拿来",
     "flow": "截图、证件等画面里的字由本地文字识别（PP-OCRv6）认出，写进每件的记录供搜索",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:165、196"
    },
    {
     "id": "r-asr",
     "with": "chinese-asr",
     "direction": "拿来",
     "flow": "录音的转写文字和逐句时间由中文语音转写产出；找某句话时只读它已有的带时间结果，没有时经授权补时间（本机 Paraformer）",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:66、1991、2043；技能 personal-media 的 Locate a recording passage 节"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "双向",
     "flow": "电脑配置与恢复的每日副本任务（北京时间 17:10）先跑本项目的 sync-current、recovery-sync，把原件同步到备份硬盘（删的进 30 天待删区），再启动本项目云端维护；外接硬盘的冷备份 14:30 和登录时跑；云维护结果写回看板回执",
     "source": "E:\\PCConfig\\tools\\Sync-PersonalReplicasToG.ps1:12、88–120、780；core_recovery.json"
    },
    {
     "id": "r-google-photos",
     "with": "Google 相册",
     "direction": "交出",
     "flow": "留下的照片视频按相册上传（官方接口），每件记下远端编号；删照片官方接口做不到，攒够 30 张由 AI 用本人已登录的 Chrome 在网页上移进回收站",
     "source": "V:\\Personal\\Projects\\personal-media\\docs\\cloud-maintenance.md 第 4–7 步"
    },
    {
     "id": "r-google-drive",
     "with": "Google Drive",
     "direction": "交出",
     "flow": "录音和音乐上传到 Drive 文件夹；电脑上删了的，Drive 上那份用接口移进回收站",
     "source": "V:\\Personal\\Projects\\personal-media\\docs\\cloud-maintenance.md 第 3 步"
    },
    {
     "id": "r-github",
     "with": "GitHub 私有仓库 wlyaaaaa/personal-media",
     "direction": "交出",
     "flow": "整份记录的无损文字版和代码存进私有仓库；记录坏了从这里重建",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11455"
    },
    {
     "id": "r-report-page",
     "with": "report-page",
     "direction": "拿来",
     "flow": "审批页由汇报网页技能画出来，本人在页上逐件点保留或不留，回复再交回 owner-decide",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:11591；README 第 309 行"
    },
    {
     "id": "r-media-person-self",
     "with": "media-person-self",
     "direction": "交出",
     "flow": "找到并选中的照片或录音，要判断里面有没有本人时交给“照片录音里有没有我”技能",
     "source": "E:\\.agents\\skills\\personal-media\\SKILL.md 的 Identity and content follow-up 节"
    },
    {
     "id": "r-codex-automation",
     "with": "Codex 定时任务 personal-media-cloud",
     "direction": "拿来",
     "flow": "网页删照片这一步设计成由 Codex 定时任务（每天北京时间 17:40、21:40）用 Chrome 做；9 月 28 日草案仍是暂停状态，没有登记进 Codex",
     "source": "V:\\Personal\\Projects\\personal-media\\docs\\automation.toml；E:\\PCConfig\\registries\\task_purpose_catalog.json:1432"
    }
   ],
   "highlights": [
    {
     "id": "h-24-samples",
     "title": "我只回答了 24 件，它整理了两万多件。",
     "screen": "personal-media-10"
    },
    {
     "id": "h-same-day-fix",
     "title": "一句纠正，当天写进程序。",
     "screen": "personal-media-10"
    },
    {
     "id": "h-six-hours",
     "title": "传 6 个小时，不用守着。",
     "screen": "personal-media-10"
    }
   ],
   "mentions": [
    {
     "target": "/how/#personal-media",
     "screen": "personal-media-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/cockpit/#personal-media",
     "screen": "personal-media-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/projects/personal-materials/",
     "screen": "personal-media-02",
     "text": "个人材料查找"
    },
    {
     "target": "/projects/daily-preferences/",
     "screen": "personal-media-03",
     "text": "理解库"
    },
    {
     "target": "/projects/personal-materials/",
     "screen": "personal-media-05",
     "text": "个人材料查找"
    },
    {
     "target": "/skills/personal-media/",
     "screen": "personal-media-07",
     "text": "找照片和录音"
    },
    {
     "target": "/skills/personal-media/",
     "screen": "personal-media-07",
     "text": "去技能页看 →"
    },
    {
     "target": "/projects/localocr/",
     "screen": "personal-media-08",
     "text": "本地文字识别"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "personal-media-08",
     "text": "中文语音转写"
    },
    {
     "target": "/how/#personal-media",
     "screen": "personal-media-09",
     "text": "怎么协作"
    },
    {
     "target": "/projects/personal-materials/",
     "screen": "personal-media-11",
     "text": "个人材料查找"
    },
    {
     "target": "/skills/media-person-self/",
     "screen": "personal-media-11",
     "text": "照片录音里有没有我"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "每天北京时间 17:10 的维护（电脑配置的每日副本任务里跑本项目的记录更新、手机精选更新和备份硬盘同步）上次跑得怎么样",
     "source": "G:\\80_Backup\\ControlPlane\\personal-replica-hot-last.json 的 status、completed_utc、errors；计划任务 PersonalDataReplica-Hot-Daily 的上次结果和下次时间"
    },
    {
     "slot": "cloud",
     "meaning": "云端维护（到期上传、Drive 跟删、照片视频攒批网页删）上次结果",
     "source": "E:\\Media\\_manifests\\personal-media-current\\cloud-maintenance-last.json 的 status、completed_utc、各 steps 的 status；Codex 定时任务 personal-media-cloud 登记后再加它写进 PCConfig 的看板回执"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“媒体查找”→ f-find-media；“录音定位”→ f-find-passage；“临时浏览”→ f-browse-folder；“视觉筛选”→ f-pick-keepers；“本人复核”→ f-review-page；“已选撤回”→ f-retract；“单件接入”→ f-ingest-single；“相册整理”→ f-albums。",
    "底稿“手机保全”→ f-preserve-two；“手机清理”→ f-clear-phone；“手机恢复包”→ f-phone-picks 与 f-daily-picks；“手机差异回写”→ f-phone-writeback；“手机反向删除”→ f-phone-delete-follow。",
    "底稿“云端候选”→ f-cloud-plan；“云端同步”→ f-cloud-upload；“云端覆盖核对”→ f-cloud-status；“云端退出”→ f-cloud-maintain 与 f-pc-delete-follow；“索引重建”→ f-rebuild。"
   ],
   "dropped": [
    "底稿 unmapped“人物筛选（--person）”：本人 9 月 28 日决定删掉“按人物找”，不识别别人的脸（决定记录 1910 行，personal-media c92dcaa），不上。",
    "底稿 unmapped“原件导出”：现役入口里 export 只导索引，没有原件导出，不上；要看原件用 f-browse-folder。",
    "底稿 unmapped“旅行/场景找全”：没有证据保证找全，不单列；按日期加地点找已含在 f-find-media。",
    "旧画廊屏（演进和画廊同一屏）拆开：画廊挪到“它怎么决定留不留”后面，演进单独一屏。"
   ],
   "unsure": [
    "manifest 里这项叫“个人媒体”，本页沿用标杆和 website-projects.json 的显示名“照片视频录音管理”；项目首页卡片请用同一个名字。",
    "f-pc-delete-follow（13）和 f-cloud-maintain（26）仍标待验收：9 月 28 日提交 7cb814c 已把云端维护接进每天 17:10 的任务，当天 17:11 实跑结果 ATTENTION——Drive 这步被“personal_access_classification_required”挡住（757 件 blocked），Google 相册这步通过；网页删照片要的 Codex 定时任务 personal-media-cloud 没有登记（E:\\Data\\AppData\\Codex\\automations 下没有这个目录，automation.toml 仍是 PAUSED 草案）。演进最后一条因此写了“（待验收）”。本人验收或决定前不要改成在用。",
    "底稿（inventory）把手机保全、清理、差异回写、反向删除和本人复核标“待验收”，本页沿用 v7 的“在用”：依据是本人 9 月 27 日 ZS15 终审“手机部分做完，之后只修报错”和 9 月 26 日的实际回执；底稿的“待验收”只是它这次没现场核。",
    "第 9 屏第 3 张卡改了说法：v7 写“语音转写都在本机显卡上跑”，但中文语音转写对难听清的录音会在免费期内自动送云端复核（E:\\.agents\\skills\\chinese-asr\\SKILL.md 第 16 行），改成“只有难听清的录音在免费期内整段送云端复核一遍”（审稿第 1 条纠正：送的是整段不是片段，见 chinese-asr references\\cloud-and-important-evidence.md），同一张卡补写看图的是正在干活的 Codex 或 Claude、缩略图会发到云端。",
    "资料解锁后重查（后按协调者更正停止找例子）：第 7 屏按查询结果改成“4 秒找出那天的一百多张”（按地点和当天日期、只要照片；地点来源是本人确认的现场地点，所以说明卡补“或我确认过的地点”）；第 2 屏“上次”改成“9 月 26 日那次”（那天之后还连过两次）；第 1 屏的例子是 9 月 26 日那次连手机的回执数字（只有件数，没有私人内容）；第 35 项例子按 README 第 150 行写“健康和基因检测结果这类”；第 3、15 项找到使用记录，恢复“在用”。第 2、7 屏因此改为局部修改，不再沿用原图。",
    "替本人口吻写的新句子（上线前请本人过目）：第 4 屏“点一张看大图。”；第 5 屏“手机上的文档：留下的放进它所属项目的原件文件夹（比如合同进‘正式事项’，学习资料进‘学习资料’），交给个人材料查找去找；不放回手机。”；第 11 屏“找到后想知道里面有没有我：见照片录音里有没有我”；第 13 屏第 35 项新说法；第 14 屏 9 月 28 日那条。",
    "Drive 被挡的原因（协调者 9 月 28 日告知）：网盘接口要求调用方声明个人资料访问分级，本项目这边没带，正有人修；页面不等它，第 13、26 项照实标待验收。",
    "拼页配置 personal-media-build-config.json 里第 2 屏审批页小样的两个热区指向 #approval，本页没有这个锚点；建议改指 #f-review-page。第 8 屏“中文语音转写”热区原指 /projects/chineseasr/，manifest 的 slug 是 chinese-asr，本页按 /projects/chinese-asr/ 写。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/personal-media/page.json",
  "sha256": "3fd4cdc6e2f10573d74a58b75917d0caa7f6c9ebad5239a818e39c4ea585f598",
  "converted_at_beijing": "2026-10-11T19:07:13+08:00"
 }
}
---

::screen{#personal-media-01 section="top"}

```typeset
{
 "screen": {
  "id": "personal-media-01",
  "section": "top",
  "title": "开头",
  "scene": "以已通过的横版第 1 屏 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-01-desktop.png 为底，版式、插画、四张数字卡和介绍段落都不动，只加四样：⓪介绍段落下面紧跟一段小一号的例子（“比如 9 月 26 日早上……逐个核对都在。”），左边一条细绿竖线，和介绍段落同宽；①四张数字卡下面右对齐一行小字“截至 10 月 11 日 16:31—16:36”；②数字卡下方横跨整屏一条细长的圆角横条，最左边绿色粗体“现在”，右边并排两组：每组先写小字标签（“每天 17:10 维护”“云端维护”），标签右边各留一个白底细浅绿描边的圆角空框，约宽 260、高 40 像素（按 1672 宽的画面算），框里什么都不画，网页程序往里填状态字；③横条下面左对齐两个白底细浅绿描边的圆角按钮，绿色字：“在整套系统里的位置 → 怎么协作”“现在正不正常 → 驾驶舱”。为放下这四样，插画可以略缩、四张数字卡可以略矮，数字卡里的字一个不改。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。 另加一样：④例子段落下面紧跟一行和例子同样大小的提示字（“清手机只删手机上的……结果各不一样，见〔不同的“不要”，结果不一样〕。”），左边不画竖线，〔〕里的字画成绿色链接字；为放下这一行，插画可以再略缩。",
  "portrait": "竖版 9:16，从上到下：大标题；右上那幅插画缩到整宽放在标题下；介绍段落；例子段落（左边细绿竖线）；四张数字卡改成两行两列；“截至 2026 年 10 月 11 日 16:31—16:36”一行；“现在”横条改成上下两行（每行一个标签加一个空框，空框约宽 60%、高 5%）；最下面两个按钮上下叠放、各占整宽。字和横版完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。 例子段落下面紧跟那行提示，链接字绿色。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#personal-media"
   },
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#personal-media"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/personal-media/#ai-brief"
   },
   {
    "text": "不同的“不要”，结果不一样",
    "href": "/projects/personal-media/#delete-results"
   }
  ],
  "anchors": [],
  "live": [
   "run",
   "cloud"
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
     "text_ref": "照片视频录音管理",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "live_box",
     "text_ref": "现在",
     "layout": "maintenance_pair",
     "keys": [
      "run",
      "cloud"
     ]
    },
    {
     "type": "stat_card",
     "text_ref": "3357张",
     "columns": 4,
     "columns_v": 1,
     "icons": "none",
     "variant": "header_value_table",
     "label_position": "below",
     "portrait_columns": 1,
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "截至10月11",
     "align": "right"
    },
    {
     "type": "prose",
     "text_ref": "手机和电脑里的",
     "row": "intro",
     "width": "70%",
     "row_fit_illustration": true
    },
    {
     "type": "quote",
     "text_ref": "比如9月26日",
     "variant": "left_line",
     "row": "intro"
    },
    {
     "type": "prose",
     "text_ref": "清手机只删",
     "row": "intro"
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "intro",
     "width": "30%"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "portrait_required": true,
   "source_layout": "以已通过的横版第 1 屏 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-01-desktop.png 为底，版式、插画、四张数字卡和介绍段落都不动，只加四样：⓪介绍段落下面紧跟一段小一号的例子（“比如 9 月 26 日早上……逐个核对都在。”），左边一条细绿竖线，和介绍段落同宽；①四张数字卡下面右对齐一行小字“截至 2026 年 9 月 28 日”；②数字卡下方横跨整屏一条细长的圆角横条，最左边绿色粗体“现在”，右边并排两组：每组先写小字标签（“每天 17:10 维护”“云端维护”），标签右边各留一个白底细浅绿描边的圆角空框，约宽 260、高 40 像素（按 1672 宽的画面算），框里什么都不画，网页程序往里填状态字；③横条下面左对齐两个白底细浅绿描边的圆角按钮，绿色字：“在整套系统里的位置 → 怎么协作”“现在正不正常 → 驾驶舱”。为放下这四样，插画可以略缩、四张数字卡可以略矮，数字卡里的字一个不改。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。 另加一样：④例子段落下面紧跟一行和例子同样大小的提示字（“清手机只删手机上的……结果各不一样，见〔不同的“不要”，结果不一样〕。”），左边不画竖线，〔〕里的字画成绿色链接字；为放下这一行，插画可以再略缩。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 4
   },
   "pending_requirements": [
    "例子左细竖线、四个数字卡图标与两个标签逐项绑定实时空框尚未实现；两个真实 live 键仍各有空框。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；09:5x 主工程师接管规格：按 comp-slots 接口把两个 single 实时框合成一个 maintenance_pair 块（run/cloud），不复制标签。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：首屏横版介绍70%/插画30%；手机版数字卡改单列；空图标高度继续查实际DOM。\n本轮观感复核后：四数字卡的header_value_table图标实际不显，按审查允许的“去掉空白”选项明确关闭图标与图槽，保留数字/说明和手机单列；原图标DOM不显的组件缺陷仍单独交回。\n2026-10-04 空白专查追加：已登记spec-locks；仅用现役字段重排本屏，定稿原字和原图不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "照片视频录音管理",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "live_box",
     "text_ref": "现在",
     "layout": "maintenance_pair",
     "keys": [
      "run",
      "cloud"
     ]
    },
    {
     "type": "stat_card",
     "text_ref": "3357张",
     "columns": 4,
     "columns_v": 1,
     "icons": "none",
     "variant": "header_value_table",
     "label_position": "below",
     "portrait_columns": 1,
     "illustration": "none"
    },
    {
     "type": "prose",
     "text_ref": "截至10月11",
     "align": "right"
    },
    {
     "type": "illustration",
     "index": 0
    },
    {
     "type": "prose",
     "text_ref": "手机和电脑里的"
    },
    {
     "type": "quote",
     "text_ref": "比如9月26日",
     "variant": "left_line"
    },
    {
     "type": "prose",
     "text_ref": "清手机只删"
    },
    {
     "type": "action_button",
     "text_ref": "在整套系统里的位置"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16，从上到下：大标题；右上那幅插画缩到整宽放在标题下；介绍段落；例子段落（左边细绿竖线）；四张数字卡改成两行两列；“截至 2026 年 9 月 28 日”一行；“现在”横条改成上下两行（每行一个标签加一个空框，空框约宽 60%、高 5%）；最下面两个按钮上下叠放、各占整宽。字和横版完全一样。 那一排按钮里同样有〔复制 AI 续作说明〕。 例子段落下面紧跟那行提示，链接字绿色。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 4
   },
   "pending_requirements": [
    "例子左细竖线、四个数字卡图标与两个标签逐项绑定实时空框尚未实现；两个真实 live 键仍各有空框。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。；09:5x 主工程师接管规格：按 comp-slots 接口把两个 single 实时框合成一个 maintenance_pair 块（run/cloud），不复制标签。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：首屏横版介绍70%/插画30%；手机版数字卡改单列；空图标高度继续查实际DOM。\n本轮观感复核后：四数字卡的header_value_table图标实际不显，按审查允许的“去掉空白”选项明确关闭图标与图槽，保留数字/说明和手机单列；原图标DOM不显的组件缺陷仍单独交回。"
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "**19851 → 3357 张**｜**4363 件 · 近 99 GB**｜**三块硬盘 + 云端**｜**2376 件**",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "9 月一次整理后剩下的图片｜现在登记的照片、视频、录音｜原件一份，两块备份硬盘各一份，Google 云端再一份｜挑出来放回手机的精选照片视频",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-media",
   "source_phrase": "”），左边不画竖线，〔〕里的字画成绿色链接字；为放下这一行，插画可以再略缩。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [],
   "hidden": false
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-media/personal-media-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\v2\\state\\fixer\\b1-personal-media-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-aa35b263ba8daf9ad204",
   "title_text": "照片视频录音管理",
   "sha256": "c436e9125e11e1617635f54152eb41faa8064d216e82663aedad1055f89f08cc",
   "status": "ready",
   "source_box": [
    55,
    1,
    749,
    154
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 照片视频录音管理

手机和电脑里的照片、视频、录音，连同手机上攒下的截图、录屏和文档，全交给 AI 管。以前它们散在手机、电脑和旧云端，八成是过后没人看的截图，想找的找不到，手机总是满的。

比如 9 月 26 日早上 4:43 我插上手机：手机里新增的 1913 个文件（照片视频 1863、文档 35、录音 15），电脑上没有的在两块硬盘各存一份、逐个核对，17 分钟后全部从手机删掉，它告诉我可以拔线；当天傍晚再插上，2376 件精选放回手机，逐个核对都在。

清手机只删手机上的，电脑和云端照留；从手机撤下、不再算精选、真的不要，结果各不一样，见〔不同的“不要”，结果不一样〕。

| **3357 张** | **4366 件 · 近 99 GB** | **三块硬盘 + 云端** | **2377 件** |
|---|---|---|---|
| 9 月一次整理后剩下的图片（整理前 19851 张） | 现在登记的照片、视频、录音 | 原件一份，两块备份硬盘各一份，Google 云端再一份 | 选进精选、要放回手机的照片视频；10 月 7 日最近一次放回手机就是这 2377 件 |

截至 10 月 11 日 16:31—16:36（只读核对；3357 张是 9 月那次整理的结果）

**现在**　每天 17:10 维护　云端维护

〔在整套系统里的位置 → 怎么协作〕　〔现在正不正常 → 驾驶舱〕　〔复制 AI 续作说明〕

::screen{#personal-media-02 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-02",
  "section": "usage",
  "title": "插上手机之后",
  "scene": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-02-desktop.png 为底，用局部修改只改卡片①标题下那行括号里的字：“（上次：1913 个新文件，17 分钟）”改成“（9 月 26 日那次：1913 个新文件，17 分钟）”，其余一律不动。三张并排大卡片，各有一幅插画：①手机连电脑，②电脑上整理（卡片下部一个审批页小样：缩略图和“保留”“不留”两个按钮），③精选放回手机。 这次再局部改两处：卡片②里“照片视频按下一屏的办法定去留”改成“照片视频按“它怎么决定留不留”那屏的办法定去留”；卡片③最后加一行绿色小字“清手机、撤下、真的不要，各删到哪一步，看紧接着的对照表。”，字多了可以把卡片③的插画略压扁。",
  "portrait": "竖版 9:16：标题在上；三张卡片改成上下叠放，每张卡片里插画在上、字在下，插画压扁到卡片宽度的一半高；卡片②的审批页小样放在它两段字下面、居中。字和横版完全一样。",
  "links": [
   {
    "text": "个人材料查找",
    "href": "/projects/personal-materials/"
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
     "text_ref": "插上手机之后",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "①第一次连上",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "illustration_source": "illustrations",
     "approval_mock": true
    }
   ],
   "portrait_required": true,
   "source_layout": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-02-desktop.png 为底，用局部修改只改卡片①标题下那行括号里的字：“（上次：1913 个新文件，17 分钟）”改成“（9 月 26 日那次：1913 个新文件，17 分钟）”，其余一律不动。三张并排大卡片，各有一幅插画：①手机连电脑，②电脑上整理（卡片下部一个审批页小样：缩略图和“保留”“不留”两个按钮），③精选放回手机。 这次再局部改两处：卡片②里“照片视频按下一屏的办法定去留”改成“照片视频按“它怎么决定留不留”那屏的办法定去留”；卡片③最后加一行绿色小字“清手机、撤下、真的不要，各删到哪一步，看紧接着的对照表。”，字多了可以把卡片③的插画略压扁。",
   "asset_requirements": {
    "illustrations": 3,
    "icons": 0
   },
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 main-closer3依据requests/comp-slots/claude-2235-media02-decision.md：独立原行审批页/保留/不留属于正文，approval_mock由core在第②卡两个正文para后的完整原para位置调用document_mock variant:approval一次；两按钮是静态样式、无新链接热区，手机居中；旧原裁片等待及源字归属冲突已被此裁定取代。程序实际验证另回读，新外观进最后验收。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "插上手机之后",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "①第一次连上",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "illustration_source": "illustrations",
     "approval_mock": true
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题在上；三张卡片改成上下叠放，每张卡片里插画在上、字在下，插画压扁到卡片宽度的一半高；卡片②的审批页小样放在它两段字下面、居中。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 3,
    "icons": 0
   },
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 main-closer3依据requests/comp-slots/claude-2235-media02-decision.md：独立原行审批页/保留/不留属于正文，approval_mock由core在第②卡两个正文para后的完整原para位置调用document_mock variant:approval一次；两按钮是静态样式、无新链接热区，手机居中；旧原裁片等待及源字归属冲突已被此裁定取代。程序实际验证另回读，新外观进最后验收。"
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
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机照片现图小槽4比3",
   "source_phrase": "三张并排大卡片，各有一幅插画：①手机连电脑，②电脑上整理（卡片下部一个审批页小样：缩略图和“保留”“不留”两个按钮），③精选放回手机。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "手机连电脑"
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
   "key": "截图聊天现图小槽4比3",
   "source_phrase": "三张并排大卡片，各有一幅插画：①手机连电脑，②电脑上整理（卡片下部一个审批页小样：缩略图和“保留”“不留”两个按钮），③精选放回手机。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "电脑上整理照片缩略图，保留原图的图库物件；按钮的文字由排版程序另放"
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
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机照片现图小槽4比3",
   "source_phrase": "三张并排大卡片，各有一幅插画：①手机连电脑，②电脑上整理（卡片下部一个审批页小样：缩略图和“保留”“不留”两个按钮），③精选放回手机。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "精选照片缩略图回到手机"
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
   "asset": "personal-media/personal-media-02-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-personal-media-02-h\\round-01\\candidate-1.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-dbecf80ccde245e7bfdc",
   "title_text": "插上手机之后",
   "sha256": "4ce731beac1cee469beca51d5228c7f66f586a92f3b69d86c1430b209a220c74",
   "status": "ready",
   "source_box": [
    26,
    37,
    451,
    164
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 插上手机之后

**① 第一次连上：把手机腾空（9 月 26 日那次：1913 个新文件，17 分钟）**

手机里新增的照片、视频、截图、录屏、录音、文档全部带走；电脑、材料库或别的项目里已经有的，按内容认出来，不再拉一遍。

新的先在主硬盘、备份硬盘各存一份，逐个核对内容指纹；全部对上，才一个个删掉手机上的这些文件。

联系人、短信、聊天记录、各个 App 自己的数据不碰；放回手机的精选也不碰。

删完就告诉我可以拔线，不用等后面整理完。

**② 拔线后：电脑上整理**

照片视频按“它怎么决定留不留”那屏的办法定去留；录音看转写定去留；文档交给〔个人材料查找〕项目。

拿不准的做成一页审批页给我看，我点保留或不留。

审批页　保留　不留

**③ 下次连上：把精选放回手机**

只补新留下的，删掉不再要的、调整换了分类的，没变的不重传；断了接着来；最后确认手机相册里看得到。

我在手机上删掉的精选，这次连上时电脑上那份也删。

反过来，我在电脑上删了的，这次连上时手机上那份也删。

清手机、撤下、真的不要，各删到哪一步，看紧接着的对照表。

::screen{#personal-media-06 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-06",
  "section": "usage",
  "title": "不同的“不要”，结果不一样",
  "scene": "已通过，横版沿用原图。两列五行对照表，结果格按浅绿、浅黄、浅灰、浅红、浅灰上色；右边一幅绿色回收桶插画。",
  "portrait": "竖版 9:16：标题；表格改成一行一条的五张卡片，每张上面是“情况”（深色字），下面是“结果”（带原来的底色）；回收桶插画缩小放在最下面。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "delete-results",
    "text": "不同的“不要”，结果不一样"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-05-desktop.png"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "不同的“不要”",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "情况",
     "result_tones": [
      "green",
      "yellow",
      "gray",
      "red",
      "gray"
     ],
     "row": "discard",
     "width": "74%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "row": "discard",
     "width": "22%"
    }
   ],
   "portrait_required": true,
   "source_layout": "已通过，横版沿用原图。两列五行对照表，结果格按浅绿、浅黄、浅灰、浅红、浅灰上色；右边一幅绿色回收桶插画。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "结果格五种浅底色的 result_tones 尚未被 table 消费；新状态底色需组件样张确认。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：表格列宽74%，回收桶插画列保持22%，按比例网格留出栏间距。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "不同的“不要”",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "table",
     "text_ref": "情况",
     "result_tones": [
      "green",
      "yellow",
      "gray",
      "red",
      "gray"
     ]
    },
    {
     "type": "illustration",
     "index": 0
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；表格改成一行一条的五张卡片，每张上面是“情况”（深色字），下面是“结果”（带原来的底色）；回收桶插画缩小放在最下面。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 0
   },
   "pending_requirements": [
    "结果格五种浅底色的 result_tones 尚未被 table 消费；新状态底色需组件样张确认。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "回收纸张",
   "source_phrase": "两列五行对照表，结果格按浅绿、浅黄、浅灰、浅红、浅灰上色；右边一幅绿色回收桶插画。",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready",
   "original_elements": [
    "两列五行对照表，结果格按浅绿、浅黄、浅灰、浅红、浅灰上色；右边一幅绿色回收桶插画"
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
   "asset": "_library/titles/title-ef4e7a0a1da5e9ed7b3a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ef4e7a0a1da5e9ed7b3a",
   "title_text": "不同的“不要”，结果不一样",
   "sha256": "33783f855f1a48fd31f3254b112055ef15f8f5857e47aacf58464508eaf593b6",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 不同的“不要”，结果不一样

| 情况 | 结果 |
|---|---|
| 为了腾空间清手机 | 电脑和云端照留 |
| 不想带在手机上了 | 只从手机撤下 |
| 不再算精选 | 云端挪进“其他归档”，不删不重传 |
| 真的不要了，或我直接在电脑上删了原件 | 全部跟着删：备份硬盘上的当天移进待删区，留 30 天再删；云端录音随每天维护进 Drive 回收站，照片视频攒够 30 张由 AI 开网页一次删（网页删除还没做成定时任务）；手机上的下次连上时删 |
| 硬盘没接上，或云端读不到 | 只报告，什么都不删，免得把备份一起清空 |

::screen{#personal-media-03 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-03",
  "section": "usage",
  "title": "它怎么决定留不留",
  "scene": "已通过，横版沿用原图。左边从宽到窄的三层漏斗卡片加一条视频长条，右边一张钉着的黄色便签。",
  "portrait": "竖版 9:16：标题；黄色便签缩小放在标题下右侧；三层卡片上下叠放、宽度逐层略收，保留漏斗感，每层插画缩成左侧小图标；最下面视频那条。字和横版完全一样。",
  "links": [
   {
    "text": "理解库",
    "href": "/projects/daily-preferences/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-03-desktop.png"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它怎么决定留不留",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "segmented_band",
     "text_ref": "第一层",
     "variant": "funnel",
     "direction": "vertical",
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "留下的每一件",
     "tone": "yellow"
    },
    {
     "type": "notice",
     "text_ref": "视频"
    }
   ],
   "portrait_required": true,
   "source_layout": "已通过，横版沿用原图。左边从宽到窄的三层漏斗卡片加一条视频长条，右边一张钉着的黄色便签。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 4
   },
   "pending_requirements": [
    "前三层是普通 para，segmented_band 没将其组成三段漏斗；黄色钉便签横版应右侧、竖版标题下，现 notice 无该构图。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它怎么决定留不留",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "segmented_band",
     "text_ref": "第一层",
     "variant": "funnel",
     "direction": "vertical",
     "connector": "none",
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "notice",
     "text_ref": "留下的每一件",
     "tone": "yellow"
    },
    {
     "type": "notice",
     "text_ref": "视频"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；黄色便签缩小放在标题下右侧；三层卡片上下叠放、宽度逐层略收，保留漏斗感，每层插画缩成左侧小图标；最下面视频那条。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 4
   },
   "pending_requirements": [
    "前三层是普通 para，segmented_band 没将其组成三段漏斗；黄色钉便签横版应右侧、竖版标题下，现 notice 无该构图。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-b5231c5de766f974b225.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-b5231c5de766f974b225",
   "title_text": "它怎么决定留不留",
   "sha256": "630c6ae590a51ffbeb906750a885926c818df64a71f0dbca19eb0aa6fa2bdae5",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 它怎么决定留不留

**第一层：**没用的出去。订单、账单、缴费、通知、App 界面、游戏结算、AI 对话、AI 生成的图，默认不留。截图和网上存的图不再一律不留：AI 逐件判断我还用不用得上，用得上就留。里面有用的事实（比如什么时候、买了什么、结果如何）先记进我的〔理解库〕，理解库已经有的就不重复记，图再删：文字就能还原，图不必留；但理解库拿来当证据的那张原图要留着。同一类我拍过板的，以后它直接照办，拿不准的才问我。

**第二层：**重复的出去。同一张图的裁剪、压缩、加水印版本，同一处风景的连拍，只留最清楚完整的一张。

**第三层：**剩下的分类放好。分进精选、生活与回忆、收藏与作品、资料原图、证件等几个固定分类，每件写一句描述。要留下任何一件，都得说出删掉会失去什么：一段别处没有的回忆、一份证件、正在用的材料或必要的凭据。“以后可能有用”不算。

留下的每一件都要说出：删掉会失去什么

**视频**也按这套办法审，只是我已经亲手筛过的那些不再重审。**录音和文档**跟照片视频在同一批里审，看转写和内容定去留。

::screen{#personal-media-05 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-05",
  "section": "usage",
  "title": "东西最后在哪",
  "scene": "以已通过的横版第 5 屏原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-04-desktop.png 为底：上半部标题和电脑、三块硬盘、手机、两朵云的插画、三个硬盘标签一律不动。下半部原来是上两张、下三张说明卡，改成两行、每行三张同样大小的卡片：第一行“电脑的三块硬盘”“手机”“手机上的文档”（新加，图标画一叠文档和一个文件夹），第二行“Google 相册”“Google Drive”“PSD 设计稿”。原有五张卡的字一个不改。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；插画改成上下排：电脑在中间，三块硬盘在电脑下面一排、箭头照旧，手机在左下、两朵云在右下；下面六张说明卡一行一张，顺序同横版。字和横版完全一样。",
  "links": [
   {
    "text": "个人材料查找",
    "href": "/projects/personal-materials/"
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
     "text_ref": "东西最后在哪",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "banner"
    },
    {
     "type": "prose",
     "text_ref": "主硬盘"
    },
    {
     "type": "content_card",
     "text_ref": "电脑的三块硬盘",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "portrait_required": true,
   "source_layout": "以已通过的横版第 5 屏原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-04-desktop.png 为底：上半部标题和电脑、三块硬盘、手机、两朵云的插画、三个硬盘标签一律不动。下半部原来是上两张、下三张说明卡，改成两行、每行三张同样大小的卡片：第一行“电脑的三块硬盘”“手机”“手机上的文档”（新加，图标画一叠文档和一个文件夹），第二行“Google 相册”“Google Drive”“PSD 设计稿”。原有五张卡的字一个不改。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 6
   },
   "pending_requirements": [
    "三个硬盘文字标签目前独立正文，尚未绑定到插画对应硬盘。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "东西最后在哪",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "banner"
    },
    {
     "type": "prose",
     "text_ref": "主硬盘"
    },
    {
     "type": "content_card",
     "text_ref": "电脑的三块硬盘",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；插画改成上下排：电脑在中间，三块硬盘在电脑下面一排、箭头照旧，手机在左下、两朵云在右下；下面六张说明卡一行一张，顺序同横版。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 6
   },
   "pending_requirements": [
    "三个硬盘文字标签目前独立正文，尚未绑定到插画对应硬盘。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "电脑的三块硬盘：原件在主硬盘；每天 17:10 同步到机箱里的备份硬盘，外接的第三块硬盘每天 14:30 和每次开机登录时再跟它同步。删掉的在两块备份硬盘的待删区各留 30 天，能反悔。清空手机前，主硬盘和备份硬盘先各存一份并核对。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "手机：只放挑出来的精选照片视频，最多 60 GB。精选的自动放，普通的要写出理由才放，我在审批页留下的默认放。录音和文档不放。",
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
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "手机上的文档：留下的放进它所属项目的原件文件夹（比如合同进“正式事项”，学习资料进“学习资料”），交给〔个人材料查找〕去找；不放回手机。",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "Google 相册：留下的照片视频满 30 天才传，免得我反悔还得去云端删；还没上传的先留在电脑。精选的分进各个相册，其余进一个叫“其他归档”的相册；同一张只传一份，换相册不重传。",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "Google Drive：录音和音乐。",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "PSD 设计稿：只留在电脑，不上传。",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-media",
   "source_phrase": "以已通过的横版第 5 屏原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-04-desktop.png 为底：上半部标题和电脑、三块硬盘、手机、两朵云的插画、三个硬盘标签一律不动。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "电脑、三块硬盘、手机、两朵云；硬盘标签的文字由排版程序另放"
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
   "asset": "_library/round3/titles/title-r3-d1a53630592d6b047029.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-05-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-d1a53630592d6b047029",
   "title_text": "东西最后在哪",
   "sha256": "f0fa9e9f4b8c475c095977c4c54ebe3372070d1ce3231142ff4a201e0961aa52",
   "status": "ready",
   "source_box": [
    41,
    73,
    605,
    291
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 东西最后在哪

主硬盘　备份硬盘　外接硬盘

- **电脑的三块硬盘：**原件在主硬盘；每天 17:10 同步到机箱里的备份硬盘，外接的第三块硬盘每天 14:30 和每次开机登录时再跟它同步。删掉的在两块备份硬盘的待删区各留 30 天，能反悔。清空手机前，主硬盘和备份硬盘先各存一份并核对。
- **手机：**只放挑出来的精选照片视频，最多 60 GB。精选的自动放，普通的要写出理由才放，我在审批页留下的默认放。录音和文档不放。
- **手机上的文档：**留下的放进它所属项目的原件文件夹（比如合同进“正式事项”，学习资料进“学习资料”），交给〔个人材料查找〕去找；不放回手机。
- **Google 相册：**留下的照片视频满 30 天才传，免得我反悔还得去云端删；还没上传的先留在电脑。精选的分进各个相册，其余进一个叫“其他归档”的相册；同一张只传一份，换相册不重传。
- **Google Drive：**录音和音乐。
- **PSD 设计稿：**只留在电脑，不上传。

::screen{#personal-media-07 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-07",
  "section": "usage",
  "title": "找东西",
  "scene": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-06-desktop.png 为底，用局部修改只改三处：大字“几秒找出那天的 20 张。”改成“4 秒找出那天的一百多张。”；四张结果图下的“1 月　公园”都改成“下雪那天　公园”；第一张说明卡里“（照片自带的 GPS）”改成“（照片自带的 GPS，或我确认过的地点）”，字多了可以多一行。其余一律不动。画面：左上一个戴眼镜的人拿手机说话，对话气泡；右上机器人拿放大镜，雪中公园石碑；中间四张雪景结果图；下面三张说明卡；最底一条“怎么跟 AI 说”和右边的按钮。",
  "portrait": "竖版 9:16：人物和气泡在上，“4 秒找出那天的一百多张。”跟在下面，机器人和石碑缩小放在右侧；四张结果图改成两行两列；三张说明卡一行一张；最底那条保留，按钮换到这条字下面、右对齐。字和横版完全一样。",
  "links": [
   {
    "text": "找照片和录音",
    "href": "/skills/personal-media/"
   },
   {
    "text": "去技能页看 →",
    "href": "/skills/personal-media/"
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
     "text_ref": "找东西",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "找那次下雪",
     "avatars": "auto",
     "avatar_source": "illustrations",
     "avatar_position": "outside-left",
     "right_images": [
      1
     ],
     "right_image_source": "illustrations"
    },
    {
     "type": "section_heading",
     "text_ref": "4秒找出"
    },
    {
     "type": "illustration",
     "text_ref": "下雪那天",
     "gallery_assets": [
      "_library/illustrations/personal-media-07-snow-01.png",
      "_library/illustrations/personal-media-07-snow-02.png",
      "_library/illustrations/personal-media-07-snow-03.png",
      "_library/illustrations/personal-media-07-snow-04.png"
     ],
     "columns": 4,
     "columns_v": 2,
     "caption_count": 4
    },
    {
     "type": "bullet_list",
     "text_ref": "可以按哪天",
     "columns": 3
    },
    {
     "type": "notice",
     "text_ref": "怎么跟AI说",
     "inline_button": "去技能页看 →"
    }
   ],
   "portrait_required": true,
   "source_layout": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-06-desktop.png 为底，用局部修改只改三处：大字“几秒找出那天的 20 张。”改成“4 秒找出那天的 140 张。”；四张结果图下的“1 月　洞山公园”都改成“1 月 21 日　洞山公园”；第一张说明卡里“（照片自带的 GPS）”改成“（照片自带的 GPS，或我确认过的地点）”，字多了可以多一行。其余一律不动。画面：左上一个戴眼镜的人拿手机说话，对话气泡；右上机器人拿放大镜，雪中公园石碑；中间四张雪景结果图；下面三张说明卡；最底一条“怎么跟 AI 说”和右边的按钮。",
   "asset_requirements": {
    "illustrations": 6,
    "icons": 3
   },
   "pending_requirements": [
    "main-closer2-brief.md Claude 第2条：四张无字雪景水彩插画等待 asset-round3；各下方原图注按真实源顺序一次输出，h一行四张、v两行两列；不绑定照片/截图、不用占位通过。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 main-closer2 Claude 第2条接线：中間四张结果图是无字插画，gallery_assets仅接四个明确新素材路径；人物/机器人原槽不挪位；缺图保持asset incomplete。四段图注来自原para，截图热区为0。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "找东西",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "dialogue",
     "text_ref": "找那次下雪",
     "avatars": "auto",
     "avatar_source": "illustrations",
     "avatar_position": "outside-left",
     "right_images": [
      1
     ],
     "right_image_source": "illustrations"
    },
    {
     "type": "section_heading",
     "text_ref": "4秒找出"
    },
    {
     "type": "illustration",
     "text_ref": "下雪那天",
     "gallery_assets": [
      "_library/illustrations/personal-media-07-snow-01.png",
      "_library/illustrations/personal-media-07-snow-02.png",
      "_library/illustrations/personal-media-07-snow-03.png",
      "_library/illustrations/personal-media-07-snow-04.png"
     ],
     "columns": 4,
     "columns_v": 2,
     "caption_count": 4
    },
    {
     "type": "bullet_list",
     "text_ref": "可以按哪天",
     "columns": 3
    },
    {
     "type": "notice",
     "text_ref": "怎么跟AI说",
     "inline_button": "去技能页看 →"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：人物和气泡在上，“4 秒找出那天的 140 张。”跟在下面，机器人和石碑缩小放在右侧；四张结果图改成两行两列；三张说明卡一行一张；最底那条保留，按钮换到这条字下面、右对齐。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 6,
    "icons": 3
   },
   "pending_requirements": [
    "main-closer2-brief.md Claude 第2条：四张无字雪景水彩插画等待 asset-round3；各下方原图注按真实源顺序一次输出，h一行四张、v两行两列；不绑定照片/截图、不用占位通过。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。 main-closer2 Claude 第2条接线：中間四张结果图是无字插画，gallery_assets仅接四个明确新素材路径；人物/机器人原槽不挪位；缺图保持asset incomplete。四段图注来自原para，截图热区为0。"
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
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "可以按哪天、在哪（照片自带的 GPS，或我确认过的地点）、拍了什么、画面里写着什么字、录音里说过什么来找，照片和视频能分开找。",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
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
   "source_phrase": "AI 查的是每件的记录：拍摄时间、地点、一句描述、画面里的字、录音转成的文字，不用去翻硬盘。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/21-外接硬盘-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "外接硬盘",
   "source_phrase": "找不到时说清是没有、已经删了，还是那块硬盘没接上。",
   "sha256": "418b9ec63f6d1ef6b9b299b25013f729cc73cd0e25bc3a652c78a7c2fe4f2997",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-wechatdirect.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "截图聊天现图小槽4比3",
   "source_phrase": "画面：左上一个戴眼镜的人拿手机说话，对话气泡；右上机器人拿放大镜，雪中公园石碑；中间四张雪景结果图；下面三张说明卡；最底一条“怎么跟 AI 说”和右边的按钮。",
   "sha256": "eafe03939f7aa3775c7a9b3f0451c9054de8c3e7f251437c1f71745b8a1ac6e1",
   "status": "ready",
   "original_elements": [
    "戴眼镜的人拿手机说话，旁边对话气泡"
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
   "asset": "_library/illustrations/main-how-this-site.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "机器人助手现图小槽4比3",
   "source_phrase": "画面：左上一个戴眼镜的人拿手机说话，对话气泡；右上机器人拿放大镜，雪中公园石碑；中间四张雪景结果图；下面三张说明卡；最底一条“怎么跟 AI 说”和右边的按钮。",
   "sha256": "965947350dbfb6819954dab14115c1bcda2186c989cc828b0cdf475bc3897ad7",
   "status": "ready",
   "original_elements": [
    "机器人拿放大镜，旁边雪中公园石碑；石碑只画石头轮廓"
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
   "asset": "_library/illustrations/personal-media-07-snow-01.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "personal-media-07-snow-01",
   "source_phrase": "中间四张雪景结果图",
   "sha256": "76c2d3a956d8d8d43a84888fbd00652f35a986d98cb8f0e759854cd47b9a7bdb",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/personal-media-07-snow-02.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "personal-media-07-snow-02",
   "source_phrase": "中间四张雪景结果图",
   "sha256": "f860224b22a8f95ecdf31628b07956af7fe22c1f1881b7439f3641c334ba9e4c",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/personal-media-07-snow-03.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "personal-media-07-snow-03",
   "source_phrase": "中间四张雪景结果图",
   "sha256": "3211d752464f40f994ec638b69042fc04cf7ec439c1db26374ed3aad8b555d13",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/personal-media-07-snow-04.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "personal-media-07-snow-04",
   "source_phrase": "中间四张雪景结果图",
   "sha256": "a8d9b2025932ff7d88d3c0d4c19afb309ee7f6978905b125e58b0b46dbbfcf51",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/personal-media-07-brush-v2.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-07-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a11eed2bfd99e1259bf3",
   "title_text": "找东西",
   "sha256": "973843d95938051149d921bfde272cf21fe8e9750477b26868a28cea45206709",
   "status": "ready",
   "source_box": [
    378,
    1,
    589,
    126
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 找东西

找那次下雪去公园拍的照片。

**4 秒找出那天的一百多张。**

下雪那天　公园　下雪那天　公园　下雪那天　公园　下雪那天　公园

- 可以按哪天、在哪（照片自带的 GPS，或我确认过的地点）、拍了什么、画面里写着什么字、录音里说过什么来找，照片和视频能分开找。
- AI 查的是每件的记录：拍摄时间、地点、一句描述、画面里的字、录音转成的文字，不用去翻硬盘。
- 找不到时说清查了哪些：是已经删了，还是那块硬盘没接上、某个来源没读到。有来源没查到时，零结果不能证明没有这件。

**怎么跟 AI 说：**见技能页的〔找照片和录音〕。　〔去技能页看 →〕

::screen{#personal-media-04 section="usage"}

```typeset
{
 "screen": {
  "id": "personal-media-04",
  "section": "usage",
  "title": "我拍的风景",
  "scene": "横版：左上毛笔艺术字标题“画廊”加绿色笔刷线，右上角几枝水彩绿叶；标题下一行说明。下面两行、每行五个照片空位（白底、细浅绿描边、圆角，里面什么都不画），同一行的空位一样高：第 3 张（灯笼）和第 7 张（金色中庭）是竖图，这两格画成竖向 3:4，其余八格横向 4:3，每行按实际宽度排开、左右对齐。空位下面一行小字说明（第 4 张说明较长，可折成三行，其余一行）。拼页程序往格子里贴旧网站已压好的缩略图（横图 720×540、竖图 405×540，按原比例完整放进、不裁），点开再显示原图（design\\v3\\preview\\photos 下那张，只压缩一次）。版面参照 E:\\Cache\\Claude\\Temp\\4bd59299\\research\\sr-compress\\round02\\source-snapshots\\personal-media\\3cc14c94409aec87-screen-11-desktop.png 右半边的画廊，但占满整屏宽，左边不再放演进。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题和说明在上；照片空位改成两列五行，第 3、7 张竖向 3:4、其余横向 4:3，同一行一样高，说明在各自空位下面。字和横版完全一样。",
  "links": [],
  "anchors": [
   {
    "id": "gallery",
    "text": "画廊"
   }
  ],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/b50119e7b6dba66895d1f86ff3f0238c2c913fa7a6e257d358ab1d8828025fdf.webp",
    "full": "public/media/personal-media/01-singapore-tree-well.jpg",
    "preserve_original": true,
    "where": "第一行左一的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "1. 沿着石墙，抬头看树。"
   },
   {
    "file": "sources/assets/_references/3ef12e8dcfc152b9652c13e4d1eb3f5eae4922717b4d3fdf8eb17f47791edfc1.webp",
    "full": "public/media/personal-media/02-hong-kong-harbor-lights.jpg",
    "preserve_original": true,
    "where": "第一行左二的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "2. 维港的灯，落在水里。"
   },
   {
    "file": "public/media/personal-media/03-beijing-lantern-corridor.jpg",
    "full": "public/media/personal-media/03-beijing-lantern-corridor.jpg",
    "preserve_original": true,
    "where": "第一行左三的照片空位（竖向 3:4）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "3. 走进一整条红灯笼。"
   },
   {
    "file": "public/media/personal-media/04-shanghai-sunset-skyline.jpg",
    "full": "public/media/personal-media/04-shanghai-sunset-skyline.jpg",
    "preserve_original": true,
    "where": "第一行左四的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "4. 傍晚，从高处看陆家嘴。整理时 AI 拿同一傍晚的两张问我留哪张，我留了这张。"
   },
   {
    "file": "sources/assets/_references/7f16b5ec33fe901393f4b5206ed8c276d4f4327d763adf8a5d892e6b1bbcf6a0.webp",
    "full": "public/media/personal-media/05-singapore-palm-street.jpg",
    "preserve_original": true,
    "where": "第一行左五的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "5. 店屋、棕榈和远处的金顶。"
   },
   {
    "file": "sources/assets/_references/1e622ffa0d1a85b87f1c9d952eda12d4c4f092d82613a202324445131554fe78.webp",
    "full": "public/media/personal-media/06-singapore-sea-and-sky.jpg",
    "preserve_original": true,
    "where": "第二行左一的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "6. 海面把天空接了下来。"
   },
   {
    "file": "public/media/personal-media/07-hong-kong-golden-atrium.jpg",
    "full": "public/media/personal-media/07-hong-kong-golden-atrium.jpg",
    "preserve_original": true,
    "where": "第二行左二的照片空位（竖向 3:4）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "7. 中庭里的金色星球。",
    "frame_bindings": {
     "h": {
      "49B0811B5D8E54B0AE63D5C315C65DBCA641362BDAEB48A0E17DA2F7245EB223": [
       401,
       603,
       588,
       841
      ]
     }
    }
   },
   {
    "file": "public/media/personal-media/08-chongqing-cable-car.jpg",
    "full": "public/media/personal-media/08-chongqing-cable-car.jpg",
    "preserve_original": true,
    "where": "第二行左三的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "8. 缆车穿过桥与层层屋顶。",
    "frame_bindings": {
     "h": {
      "49B0811B5D8E54B0AE63D5C315C65DBCA641362BDAEB48A0E17DA2F7245EB223": [
       602,
       614,
       929,
       835
      ]
     }
    }
   },
   {
    "file": "sources/assets/_references/76a0beac922e0990ff2946fee9e42ec1915d93a0f3fef9e82966234b87bc4de3.webp",
    "full": "public/media/personal-media/02-wuxi-blue-hour-water-town.jpg",
    "preserve_original": true,
    "where": "第二行左四的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "9. 天还没黑，河边已经亮灯。"
   },
   {
    "file": "sources/assets/_references/65a8ec13f43421b92b3e17b8c06cb3a3a4ac8859aeef61b244d7bb3b20ef80ce.webp",
    "full": "public/media/personal-media/10-kunming-lakeside-gulls.jpg",
    "preserve_original": true,
    "where": "第二行左五的照片空位（横向 4:3）；格子里贴 file 这张缩略图，按原比例完整放进；点开显示 full 那张原图",
    "caption": "10. 湖岸边，海鸥从眼前飞过。"
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "我拍的风景",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "我自己拍的10张"
    },
    {
     "type": "screenshot",
     "text_ref": "1沿着石墙",
     "columns": 5,
     "columns_v": 2,
     "ratios": [
      "4:3",
      "4:3",
      "3:4",
      "4:3",
      "4:3",
      "4:3",
      "3:4",
      "4:3",
      "4:3",
      "4:3"
     ],
     "caption_per_slot": true,
     "equal_row_height": true,
     "row_items": [
      5,
      5
     ]
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上毛笔艺术字标题“画廊”加绿色笔刷线，右上角几枝水彩绿叶；标题下一行说明。下面两行、每行五个照片空位（白底、细浅绿描边、圆角，里面什么都不画），同一行的空位一样高：第 3 张（灯笼）和第 7 张（金色中庭）是竖图，这两格画成竖向 3:4，其余八格横向 4:3，每行按实际宽度排开、左右对齐。空位下面一行小字说明（第 4 张说明较长，可折成三行，其余一行）。拼页程序往格子里贴旧网站已压好的缩略图（横图 720×540、竖图 405×540，按原比例完整放进、不裁），点开再显示原图（design\\v3\\preview\\photos 下那张，只压缩一次）。版面参照 E:\\Cache\\Claude\\Temp\\4bd59299\\research\\sr-compress\\round02\\source-snapshots\\personal-media\\3cc14c94409aec87-screen-11-desktop.png 右半边的画廊，但占满整屏宽，左边不再放演进。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 0
   },
   "pending_requirements": [
    "照片空框下逐格图注与横竖混合比例同排等高，screenshot 当前只画网格后集中输出十条图注。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "我拍的风景",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "prose",
     "text_ref": "我自己拍的10张"
    },
    {
     "type": "screenshot",
     "text_ref": "1沿着石墙",
     "columns": 5,
     "columns_v": 2,
     "ratios": [
      "4:3",
      "4:3",
      "3:4",
      "4:3",
      "4:3",
      "4:3",
      "3:4",
      "4:3",
      "4:3",
      "4:3"
     ],
     "caption_per_slot": true,
     "equal_row_height": true
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题和说明在上；照片空位改成两列五行，第 3、7 张竖向 3:4、其余横向 4:3，同一行一样高，说明在各自空位下面。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 0
   },
   "pending_requirements": [
    "照片空框下逐格图注与横竖混合比例同排等高，screenshot 当前只画网格后集中输出十条图注。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "personal-media/personal-media-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6f966a995ad3884757df",
   "title_text": "画廊",
   "sha256": "684661ca34ff0c625b805441d00e0e5836abb3717728e32fde7a67139c618a97",
   "status": "ready",
   "source_box": [
    47,
    0,
    352,
    185
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 我拍的风景

我自己拍的 10 张风景，大多在“精选”里。点一张看大图。

1. 沿着石墙，抬头看树。
2. 维港的灯，落在水里。
3. 走进一整条红灯笼。
4. 傍晚，从高处看陆家嘴。整理时 AI 拿同一傍晚的两张问我留哪张，我留了这张。
5. 店屋、棕榈和远处的金顶。
6. 海面把天空接了下来。
7. 中庭里的金色星球。
8. 缆车穿过桥与层层屋顶。
9. 天还没黑，河边已经亮灯。
10. 湖岸边，海鸥从眼前飞过。

::screen{#personal-media-08 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-08",
  "section": "tech",
  "title": "它是怎么跑的",
  "scene": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-08-desktop.png 为底，用局部修改只改两个节点的小字：第 4 个节点改成下面第 4 条的样子（多了“交给正在干活的 Codex 或 Claude 看（缩略图会发到云端，原件不发）”，字多可以四五行，卡片可略加高，两个链接仍画成链接样式）；第 8 个节点改成下面第 8 条的样子（多了“再启动云端维护”一句，放不下可以三行）；其余六个节点、标题、箭头一律不动。第 9 条“每天 07:15 到期收尾”是后加的文字，原图没有这个节点；补图时在第 8 个节点后面接一个同样样式的节点，图标画一只闹钟。",
  "portrait": "竖版 9:16：标题；八个节点改成两列四行（1 2 / 3 4 / 5 6 / 7 8），按 Z 字走向用绿色箭头连起来；第 8 个节点旁的循环小箭头保留；第 9 个节点单独占最后一行。字和横版完全一样。",
  "links": [
   {
    "text": "本地文字识别",
    "href": "/projects/localocr/"
   },
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
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
     "text_ref": "它是怎么跑的",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "连上手机",
     "columns": 3,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "z_order": true,
     "loop_at": 8,
     "item_rows": [
      3,
      1,
      4
     ]
    }
   ],
   "portrait_required": true,
   "source_layout": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-08-desktop.png 为底，用局部修改只改两个节点的小字：第 4 个节点改成下面第 4 条的样子（多了“交给正在干活的 Codex 或 Claude 看（缩略图会发到云端，原件不发）”，字多可以四五行，卡片可略加高，两个链接仍画成链接样式）；第 8 个节点改成下面第 8 条的样子（多了“再启动云端维护”一句，放不下可以三行）；其余六个节点、标题、箭头一律不动。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 8
   },
   "pending_requirements": [
    "第八节点循环箭头以及竖版两列四行 Z 字跨行箭头需核对补齐。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "它是怎么跑的",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "flow",
     "text_ref": "连上手机",
     "columns": 1,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "top_inside",
     "icons": "auto",
     "z_order": true,
     "loop_at": 8,
     "columns_v": 1
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；八个节点改成两列四行（1 2 / 3 4 / 5 6 / 7 8），按 Z 字走向用绿色箭头连起来；第 8 个节点旁的循环小箭头保留。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 8
   },
   "pending_requirements": [
    "第八节点循环箭头以及竖版两列四行 Z 字跨行箭头需核对补齐。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/hires-icons/数据库.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库",
   "source_phrase": "连上手机：USB 数据线 + ADB，手机上不装 App",
   "sha256": "865053c5fd589bd10fb3c83b7ce3d3750c44d8737ad5dc796e24176a5c33b2b2",
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
   "source_phrase": "认出已有的：每个文件算 SHA-256 内容指纹，和记录里已有的比，已有的不再拉",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "存两份再删：主硬盘、备份硬盘各一份，核对无误才删手机",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "看内容：25 张缩略图拼一张，交给正在干活的 Codex 或 Claude 看（缩略图会发到云端，原件不发）；截图里的字交给〔本地文字识别〕，录音交给〔中文语音转写〕",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "定去留：没用的出去，重复的留一张，留下的分类、写描述；拿不准的上审批页",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "记下来：SQLite 记录 + FTS5 全文检索；文字版存在 GitHub 私有仓库",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "送出去：精选放回手机（≤ 60 GB）；满 30 天上传 Google 相册、Drive",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "每天 17:10 维护：更新记录，备份硬盘跟着同步，更新要放回手机的精选，再启动云端维护",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-0960fa6e07411be916a2.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0960fa6e07411be916a2",
   "title_text": "它是怎么跑的",
   "sha256": "a023838529071c1a0c3174abc8a44b06cbb56530d94eac245446a4d19df0c688",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 它是怎么跑的

1. **连上手机**：USB 数据线 + ADB，手机上不装 App
2. **认出已有的**：每个文件算 SHA-256 内容指纹，和记录里已有的比，已有的不再拉
3. **存两份再删**：主硬盘、备份硬盘各一份，核对无误才删手机
4. **看内容**：25 张缩略图拼一张，交给正在干活的 Codex 或 Claude 看（缩略图会发到云端，原件不发）；截图里的字交给〔本地文字识别〕，录音交给〔中文语音转写〕
5. **定去留**：没用的出去，重复的留一张，留下的分类、写描述；拿不准的上审批页
6. **记下来**：SQLite 记录 + FTS5 全文检索；文字版存在 GitHub 私有仓库
7. **送出去**：精选放回手机（≤ 60 GB）；满 30 天上传 Google 相册、Drive
8. **每天 17:10 维护**：更新记录，备份硬盘跟着同步，更新要放回手机的精选，再启动云端维护
9. **每天 07:15 到期收尾**：后台隐藏运行，不需要连手机，也不上传。暂存满 30 天的批次先预演，现有收尾命令确认合格（eligible）才清理那批的保全副本；没满 30 天记“等待”，资料锁着或到期就跳过、等下次，一批失败不挡其余批次。最近一次 10 月 11 日 07:16 结束，整轮 PASS：7 批里 3 批通过、4 批还没到期在等；这不等于 7 批都已清完，也不证明手机回写或云端上传

::screen{#personal-media-09 section="tech"}

```typeset
{
 "screen": {
  "id": "personal-media-09",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-09-desktop.png 为底重画：版式、六张原则卡和三张大数字卡的位置、插画都照它。改四处：①右上大数字 16,433，下面小字改成“Python 正式代码（6 个文件）”；②中间大数字 453；③第三张原则卡（显卡插画那张）的小字换成下面的新句子，字多了可以四行，卡片略加高；④最下面那条的链接字从“怎么运转”改成“怎么协作”。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；三张大数字卡改成一行三个小方块放在标题下；六张原则卡一行一张；最下面那条链接。字和横版完全一样。",
  "links": [
   {
    "text": "怎么协作",
    "href": "/how/#personal-media"
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
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "认内容，不认文件名",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto"
    },
    {
     "type": "content_card",
     "text_ref": "两个 30 天不是一回事",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "reasons-tail",
     "width": "50%"
    },
    {
     "type": "stat_card",
     "text_ref": "16,433",
     "columns": 3,
     "row": "reasons-tail",
     "width": "50%",
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"
     ],
     "portrait_columns": 1
    },
    {
     "type": "notice",
     "text_ref": "它和理解库"
    }
   ],
   "portrait_required": true,
   "source_layout": "以已通过的横版原图 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-09-desktop.png 为底重画：版式、六张原则卡和三张大数字卡的位置、插画都照它。改四处：①右上大数字 16,433，下面小字改成“Python 正式代码（6 个文件）”；②中间大数字 453；③第三张原则卡（显卡插画那张）的小字换成下面的新句子，字多了可以四行，卡片略加高；④最下面那条的链接字从“怎么运转”改成“怎么协作”。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：手机版三个数字卡改为单列，避免数字在窄列内拆开；横版原列数保留。\n10 月 11 日空白修：七张原则卡（2 列）和三张数字卡（1 列）并排时数字栏底下空约 330 像素；改为原则卡占整行 2 列，第七张原则卡（两个 30 天）单独拆出，和三张数字卡（3 列）并排成下一行，免得 2 列网格最后一格空着。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "为什么这样设计",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "stat_card",
     "text_ref": "16,433",
     "columns": 3,
     "columns_v": 1,
     "icons": "auto",
     "portrait_columns": 1
    },
    {
     "type": "content_card",
     "text_ref": "认内容，不认文件名",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/云.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png",
      "_library/icons/GitHub标志.png",
      "_library/icons/云.png",
      "_library/fix-round-2/icon-clean-15ef475fee6a286d05b7.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ]
    },
    {
     "type": "prose",
     "text_ref": "两个30天不是一回事"
    },
    {
     "type": "notice",
     "text_ref": "它和理解库"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；三张大数字卡改成一行三个小方块放在标题下；六张原则卡一行一张；最下面那条链接。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 6
   },
   "pending_requirements": [],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：手机版三个数字卡改为单列，避免数字在窄列内拆开；横版原列数保留。"
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
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "认内容，不认文件名。SHA-256 内容指纹：改名、搬家、换手机都认得，同一件不会存两遍。",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "先有两份，再删手机。两块硬盘上的副本都核对过，才删手机上的那一个文件。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "给模型看的只是缩略图。缩略图拼成总览，交给正在干活的 Codex 或 Claude 看（会发到云端），原件不发；文字识别（PP-OCRv6）在本机显卡上跑，语音转写（SenseVoice、Qwen3-ASR 等）也在本机，只有难听清的录音在免费期内整段送云端复核一遍。",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "读不到不等于删了。硬盘没接上、云端读不到，只报告，什么都不删。",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "不会重复上传。每件记下 Google 给的编号，断了重跑也不传第二遍。",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "记录坏了能重建。用 GitHub 私有仓库里的文字版重建，云端编号一起恢复，不用重新上传。",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "16439 行 Python 正式代码（6 个文件）",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "打勾清单",
   "source_phrase": "455 个 自动测试",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "照片堆",
   "source_phrase": "25 张 一张总览里的缩略图",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "16439 行 Python 正式代码（6 个文件）",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "455 个 自动测试",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "25 张 一张总览里的缩略图",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-9ce99a7f5a6a4d1b80fa.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-9ce99a7f5a6a4d1b80fa",
   "title_text": "为什么这样设计",
   "sha256": "43506416825bbd48b039007b6ab8bcbf460c707042fe39a984e499e4e9967de8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 为什么这样设计

- **认内容，不认文件名。**SHA-256 内容指纹：改名、搬家、换手机都认得，同一件不会存两遍。
- **先有两份，再删手机。**两块硬盘上的副本都核对过，才删手机上的那一个文件。
- **给模型看的只是缩略图。**缩略图拼成总览，交给正在干活的 Codex 或 Claude 看（会发到云端），原件不发；文字识别（PP-OCRv6）在本机显卡上跑，语音转写（SenseVoice、Qwen3-ASR 等）也在本机，只有难听清的录音在免费期内整段送云端复核一遍。
- **读不到不等于删了。**硬盘没接上、云端读不到，只报告，什么都不删。
- **不会重复上传。**每件记下 Google 给的编号，断了重跑也不传第二遍。
- **记录坏了能重建。**用 GitHub 私有仓库里的文字版重建，云端编号一起恢复，不用重新上传。
- **两个 30 天不是一回事。**我在电脑上删掉的原件，备份硬盘上那份移进待删区、留 30 天再删，这是后悔期；手机上撤下、不留的文件，本批保全副本放 30 天是稳定期，到期由每天 07:15 的收尾清理。项目规则允许已确认可清理的本地文件和本批保全副本直接删除，回收站只是可选做法；但现有的 owner-delete 和 closeout 命令仍一律经共用入口放进回收站、并核对回收站里确有这一项，没有直接删除的参数。所以不能说所有本地删除都自动有 30 天可找回。

**16,433 行**　Python 正式代码（6 个文件，按 10 月 10 日的源码版本、10 月 11 日清点）

**453 个**　写好的自动测试（按 10 月 10 日的源码版本、10 月 11 日静态清点，不是这次跑过的通过数）

**25 张**　一张总览里的缩略图

它和理解库、材料库、文字识别、语音转写怎么配合：见〔怎么协作〕

::screen{#personal-media-10 section="highlights"}

```typeset
{
 "screen": {
  "id": "personal-media-10",
  "section": "highlights",
  "title": "亮点",
  "scene": "已通过，横版沿用原图。三张横向大卡片，左边插画，右边大字标题加三行说明。",
  "portrait": "竖版 9:16：标题；三张卡片上下叠放，每张插画在上、标题和说明在下。字和横版完全一样。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [],
  "chain": "",
  "reuse": "E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-07-desktop.png"
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "我只回答了24件",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "illustration_source": "illustrations"
    }
   ],
   "portrait_required": true,
   "source_layout": "已通过，横版沿用原图。三张横向大卡片，左边插画，右边大字标题加三行说明。",
   "asset_requirements": {
    "illustrations": 3,
    "icons": 0
   },
   "pending_requirements": [
    "三张横向大卡应左侧/顶部主插画；content_card 当前只消费小图标，未按每卡主插画绑定。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "亮点",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "content_card",
     "text_ref": "我只回答了24件",
     "columns": 1,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": "auto",
     "illustration_source": "illustrations"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；三张卡片上下叠放，每张插画在上、标题和说明在下。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 3,
    "icons": 0
   },
   "pending_requirements": [
    "三张横向大卡应左侧/顶部主插画；content_card 当前只消费小图标，未按每卡主插画绑定。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。"
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
   "asset": "_library/illustrations/媒体筛选留存.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "媒体筛选留存",
   "source_phrase": "三张横向大卡片，左边插画，右边大字标题加三行说明。",
   "sha256": "da3ac0cfe943c98653f7f3406dd25d3b867ab96807b0aacbe0e6463c80eb1961",
   "status": "ready",
   "original_elements": [],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/反馈写进程序.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "反馈写进程序",
   "source_phrase": "三张横向大卡片，左边插画，右边大字标题加三行说明。",
   "sha256": "44b31c673e934e2e73f706d3de1786eb7d25f9819a03f4cd4be818f7529f1a49",
   "status": "ready",
   "original_elements": [],
   "hidden": false
  },
  {
   "role": "illustration",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/后台上传核对.png",
   "fallback": false,
   "semantic_status": "remaining_explicit_theme_required",
   "key": "后台上传核对",
   "source_phrase": "三张横向大卡片，左边插画，右边大字标题加三行说明。",
   "sha256": "018acdfc4c5eba80a8b0ce45a079b95652422a1885baed773f9b602f3f9b2216",
   "status": "ready",
   "original_elements": [],
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-10-v.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    46,
    0,
    320,
    211
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 亮点

**我只回答了 24 件，它整理了两万多件。**
它先拿 24 件真实的照片、截图、录音问我留不留、为什么，再照这把尺子把 19851 张图片整理到 3357 张。我问能不能直接删掉八成，它不按比例，一件件看内容：删掉的比八成还多，可一条家常通话，它留了下来。

**一句纠正，当天写进程序。**
我说“这批本不该留图”，它当天就把“每留一件必须写出删掉会失去什么，写不出整批不执行”写进程序。我说“我连图片和视频都没看见”，当天就有了审批页，还专门加了一栏“它本会删、但可能看走眼的”让我抽查。

**传 6 个小时，不用守着。**
第一次全量上云 4230 件、96 GB，交给后台慢慢传；传完自动把 AI 叫回来核对，查出唯一一条结果不明的录音，补传完，一件没重复。

::screen{#personal-media-11 section="features"}

```typeset
{
 "screen": {
  "id": "personal-media-11",
  "section": "features",
  "title": "全部功能",
  "scene": "横版，全部功能一共三张，上下拼成一整段，三张用同一套网格：每组先是一行组名（毛笔字，比大标题小一号，左对齐，后面跟一道短绿色笔刷线），组名下面是这一组的功能卡，每行三张、同宽同高；组名不单独占一整列，卡片从左边距一直排到右边距。一组不跨屏。每张功能卡：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话；右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）；标了“只修报错”的在卡片右下角加一个小标签“只修报错”。下面每行“编号. 功能名｜一句话｜状态”：“｜”只是分隔符不画，状态不写字，画成圆点和标签；〔〕是链接画法。这一张顶上是标题（毛笔艺术字加绿色笔刷线）和紧跟在标题右边的一行图例（四个圆点依次画成绿、黄、灰、浅灰）。“找东西”这组三张卡片下面，左对齐加一行小字“找到后想知道里面有没有我：见照片录音里有没有我”，其中“照片录音里有没有我”画成链接样式。第一张底部不画边框或分隔线。已通过的旧版 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-10-desktop.png 的卡片画法、图标可以参考，但版面按这里的新规矩重排（原来左边的组名列去掉）。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：同样一组一段，组名一行，下面功能卡改成每行两张；标题在最上，图例在标题下换行成两行；卡片里的字、圆点和标签和横版完全一样。三张竖版也上下拼成一段。",
  "links": [
   {
    "text": "照片录音里有没有我",
    "href": "/skills/media-person-self/"
   },
   {
    "text": "个人材料查找",
    "href": "/projects/personal-materials/"
   }
  ],
  "anchors": [
   {
    "id": "g-find",
    "text": "找东西"
   },
   {
    "id": "f-find-media",
    "text": "找照片、视频、录音"
   },
   {
    "id": "f-find-passage",
    "text": "找录音里的某句话"
   },
   {
    "id": "f-browse-folder",
    "text": "把找到的放进一个文件夹"
   },
   {
    "id": "g-first-connect",
    "text": "手机第一次连上"
   },
   {
    "id": "f-preserve-two",
    "text": "新文件存两份"
   },
   {
    "id": "f-clear-phone",
    "text": "清空手机"
   },
   {
    "id": "f-phone-delete-follow",
    "text": "手机上删了，电脑跟着删"
   },
   {
    "id": "g-after-unplug",
    "text": "拔线后在电脑上"
   },
   {
    "id": "f-pick-keepers",
    "text": "挑出值得留的"
   },
   {
    "id": "f-audio-docs",
    "text": "录音和文档一起整理"
   },
   {
    "id": "f-staging-30d",
    "text": "满 30 天清掉暂存"
   },
   {
    "id": "g-decide",
    "text": "我来拍板"
   },
   {
    "id": "f-review-page",
    "text": "审批页"
   },
   {
    "id": "f-retract",
    "text": "撤回"
   },
   {
    "id": "f-named-delete",
    "text": "点名删除"
   },
   {
    "id": "f-pc-delete-follow",
    "text": "我在电脑上直接删"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pm-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（35项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用"
    },
    {
     "type": "feature_card",
     "text_ref": "找东西",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版，全部功能一共三张，上下拼成一整段，三张用同一套网格：每组先是一行组名（毛笔字，比大标题小一号，左对齐，后面跟一道短绿色笔刷线），组名下面是这一组的功能卡，每行三张、同宽同高；组名不单独占一整列，卡片从左边距一直排到右边距。一组不跨屏。每张功能卡：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话；右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）；标了“只修报错”的在卡片右下角加一个小标签“只修报错”。下面每行“编号. 功能名｜一句话｜状态”：“｜”只是分隔符不画，状态不写字，画成圆点和标签；〔〕是链接画法。这一张顶上是标题（毛笔艺术字加绿色笔刷线）和紧跟在标题右边的一行图例（四个圆点依次画成绿、黄、灰、浅灰）。“找东西”这组三张卡片下面，左对齐加一行小字“找到后想知道里面有没有我：见照片录音里有没有我”，其中“照片录音里有没有我”画成链接样式。第一张底部不画边框或分隔线。已通过的旧版 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-10-desktop.png 的卡片画法、图标可以参考，但版面按这里的新规矩重排（原来左边的组名列去掉）。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 14
   },
   "pending_requirements": [
    "绿/黄字状态需要映射为右上圆点，保留“只修报错”标签；现 feature_card 没有绿黄映射，组名毛笔图也未渲染。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：全部功能的手机版卡片改每行一张，完整原字和编号保持。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "全部功能（35项）",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用"
    },
    {
     "type": "feature_card",
     "text_ref": "找东西",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：同样一组一段，组名一行，下面功能卡改成每行两张；标题在最上，图例在标题下换行成两行；卡片里的字、圆点和标签和横版完全一样。三张竖版也上下拼成一段。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 14
   },
   "pending_requirements": [
    "绿/黄字状态需要映射为右上圆点，保留“只修报错”标签；现 feature_card 没有绿黄映射，组名毛笔图也未渲染。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：全部功能的手机版卡片改每行一张，完整原字和编号保持。"
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "● 在用　● 待验收　● 没用过　● 说不准　｜　只修报错＝不再加功能，坏了才修",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "找照片、视频、录音｜说哪天、在哪、拍了什么、画面里有什么字、录音里说过什么，它找出原件｜绿",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "找录音里的某句话｜说出那句话里的几个词，它告诉我在第几分第几秒（那段录音要先转过带时间的文字）｜黄",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "把找到的放进一个文件夹｜找到的原件临时放进一个文件夹给我翻，不多占空间，看完就清掉｜绿",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "新文件存两份｜已有的跳过，新的在主硬盘、备份硬盘各存一份，逐个核对指纹｜绿·只修报错",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "清空手机｜照片、视频、录音、文档等新文件都核对过两份，才一个个删掉手机上的这些；联系人、短信、聊天和 App 数据不碰｜绿·只修报错",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "手机上删了，电脑跟着删｜放回手机的精选我在手机上删了，下次连上时电脑那份也删｜绿·只修报错",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "挑出值得留的｜没用的不留（有用的事实先记进理解库），重复的只留一张，留下的分类、写描述、写出删掉会失去什么｜绿·只修报错",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "录音和文档一起整理｜录音看转写定去留，文档交给〔个人材料查找〕｜绿·只修报错",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "满 30 天清掉暂存｜不留的文件先在电脑上暂存 30 天，这期间能找回，到期进回收站｜黄·只修报错",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "审批页｜拿不准的做成一页，看着实物点保留或不留，带一栏抽查；我留下的它以后不能再撤｜绿",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "撤回｜已经留下的，事后不想留了就撤出来，手机和云端跟着撤，30 天内能找回｜绿",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/47-回收站文件-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "回收站文件",
   "source_phrase": "点名删除｜我明确说删的，哪怕只剩这一份也删，先记下我的原话｜绿",
   "sha256": "d71f70f2ef8e55126d0f2d5ad821da30ff08a54adce39f5ecd0fd14c3d31eea6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "我在电脑上直接删｜在文件夹里删了原件，不用告诉 AI：备份硬盘上的当天移进待删区、30 天后删，云端随后删，下次连手机时手机上也删｜黄",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "personal-media/personal-media-11-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-11-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-532b0a5a67ef64bb6401",
   "title_text": "全部功能（35 项）",
   "sha256": "1fa57c2d0712191d862d1797bcaa2d858bb69d0595e25d547f53f42ff4578c71",
   "status": "ready",
   "source_box": [
    29,
    0,
    577,
    105
   ],
   "g4_target_reference_available": true
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-d3bc2130b033878dd2cf.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d3bc2130b033878dd2cf",
   "title_text": "我来拍板",
   "sha256": "39c68022540502ec017f7cde2308f37e4d6638f6fd319eef9576675968cfb516",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-752a5ecab6515d915f35.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-752a5ecab6515d915f35",
   "title_text": "手机第一次连上",
   "sha256": "6c28a8903c017b060331fb51ccaa70dd11f3eec0896bff41f57112ce439bda53",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/personal-media-07-brush-v2.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-a11eed2bfd99e1259bf3",
   "title_text": "找东西",
   "sha256": "973843d95938051149d921bfde272cf21fe8e9750477b26868a28cea45206709",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-5d26951aee7dfc8bb4c0.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5d26951aee7dfc8bb4c0",
   "title_text": "拔线后在电脑上",
   "sha256": "f1c10bbb314e205227f6a2d5a1d3b91b8cb57499934ad371f948ecaf33d5f650",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（35 项）

● 在用　● 待验收　● 没用过　● 说不准　｜　只修报错＝不再加功能，坏了才修

**找东西**
1. 找照片、视频、录音｜说哪天、在哪、拍了什么、画面里有什么字、录音里说过什么，它找出原件｜绿
2. 找录音里的某句话｜说出那句话里的几个词，它告诉我在第几分第几秒（那段录音要先转过带时间的文字）｜黄
3. 把找到的放进一个文件夹｜找到的原件临时放进一个文件夹给我翻，不多占空间，看完就清掉｜绿
找到后想知道里面有没有我：见〔照片录音里有没有我〕

**手机第一次连上**
4. 新文件存两份｜已有的跳过，新的在主硬盘、备份硬盘各存一份，逐个核对指纹｜绿·只修报错
5. 清空手机｜照片、视频、录音、文档等新文件都核对过两份，才一个个删掉手机上的这些；联系人、短信、聊天和 App 数据不碰｜绿·只修报错
6. 手机上删了，电脑跟着删｜放回手机的精选我在手机上删了，下次连上时电脑那份也删｜绿·只修报错

**拔线后在电脑上**
7. 挑出值得留的｜没用的不留（有用的事实先记进理解库），重复的只留一张，留下的分类、写描述、写出删掉会失去什么｜绿·只修报错
8. 录音和文档一起整理｜录音看转写定去留，文档交给〔个人材料查找〕｜绿·只修报错
9. 满 30 天清掉暂存｜不留的文件先在电脑上暂存 30 天，这期间能找回；每天 07:15 自动查到期的批次，预演确认合格才清理，没到期就等，资料锁着就跳过等下次；不需要连手机、不上传；现有命令清理时仍放进回收站｜黄·只修报错

**我来拍板**
10. 审批页｜拿不准的做成一页，看着实物点保留或不留，带一栏抽查；我留下的它以后不能再撤｜绿
11. 撤回｜已经留下的，事后不想留了就撤出来，手机和云端跟着撤，30 天内能找回｜绿
12. 点名删除｜我明确说删的，哪怕只剩这一份也删，先记下我的原话｜绿
13. 我在电脑上直接删｜在文件夹里删了原件，不用告诉 AI：备份硬盘上的当天移进待删区、30 天后删，云端随后删，下次连手机时手机上也删｜黄

::screen{#personal-media-12 section="features"}

```typeset
{
 "screen": {
  "id": "personal-media-12",
  "section": "features",
  "title": "全部功能（续）",
  "scene": "横版，全部功能一共三张，上下拼成一整段，三张用同一套网格：每组先是一行组名（毛笔字，比大标题小一号，左对齐，后面跟一道短绿色笔刷线），组名下面是这一组的功能卡，每行三张、同宽同高；组名不单独占一整列，卡片从左边距一直排到右边距。一组不跨屏。每张功能卡：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话；右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）；标了“只修报错”的在卡片右下角加一个小标签“只修报错”。下面每行“编号. 功能名｜一句话｜状态”：“｜”只是分隔符不画，状态不写字，画成圆点和标签；〔〕是链接画法。这一张没有标题、没有图例，直接接着上一张往下排；顶部和底部都不画边框或分隔线，拼起来看不出是几张。先拿第一张当参考图画。已通过的旧版 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-10-desktop.png 的卡片画法、图标可以参考，但版面按这里的新规矩重排（原来左边的组名列去掉）。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：同样一组一段，组名一行，下面功能卡改成每行两张；没有标题和图例；卡片里的字、圆点和标签和横版完全一样。三张竖版也上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-intake",
    "text": "收进来、改信息"
   },
   {
    "id": "f-ingest-single",
    "text": "收进单个文件"
   },
   {
    "id": "f-one-format",
    "text": "同一段视频只留一种格式",
    "locator_text": {
     "h": "15. 同一段视频只留",
     "v": "15. 同一段视频"
    }
   },
   {
    "id": "f-albums",
    "text": "编相册"
   },
   {
    "id": "f-fix-date-place",
    "text": "改日期、地点"
   },
   {
    "id": "g-phone-picks",
    "text": "放回手机的精选"
   },
   {
    "id": "f-phone-picks",
    "text": "挑哪些放回手机"
   },
   {
    "id": "f-daily-picks",
    "text": "每天更新要放回的精选",
    "locator_text": {
     "h": "19. 每天更新要放回",
     "v": "19. 每天更新要放回"
    }
   },
   {
    "id": "f-phone-writeback",
    "text": "放回手机"
   },
   {
    "id": "f-phone-verify-only",
    "text": "只核对，不放回"
   },
   {
    "id": "g-cloud",
    "text": "云端"
   },
   {
    "id": "f-cloud-plan",
    "text": "算好每件去哪"
   },
   {
    "id": "f-cloud-upload",
    "text": "上传并核对"
   },
   {
    "id": "f-cloud-status",
    "text": "看还有多少没上云"
   },
   {
    "id": "f-upload-wakeup",
    "text": "传完叫回 AI"
   },
   {
    "id": "f-cloud-maintain",
    "text": "云端自动跟上"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pm-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "收进来、改信息",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush",
     "fill_last_row": true
    }
   ],
   "portrait_required": true,
   "source_layout": "横版，全部功能一共三张，上下拼成一整段，三张用同一套网格：每组先是一行组名（毛笔字，比大标题小一号，左对齐，后面跟一道短绿色笔刷线），组名下面是这一组的功能卡，每行三张、同宽同高；组名不单独占一整列，卡片从左边距一直排到右边距。一组不跨屏。每张功能卡：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话；右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）；标了“只修报错”的在卡片右下角加一个小标签“只修报错”。下面每行“编号. 功能名｜一句话｜状态”：“｜”只是分隔符不画，状态不写字，画成圆点和标签；〔〕是链接画法。这一张没有标题、没有图例，直接接着上一张往下排；顶部和底部都不画边框或分隔线，拼起来看不出是几张。先拿第一张当参考图画。已通过的旧版 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-10-desktop.png 的卡片画法、图标可以参考，但版面按这里的新规矩重排（原来左边的组名列去掉）。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 13
   },
   "pending_requirements": [
    "绿/灰/黄字状态需只显示对应圆点与只修报错标签，组名需毛笔图；当前组件未实现。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：全部功能的手机版卡片改每行一张，完整原字和编号保持。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "收进来、改信息",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：同样一组一段，组名一行，下面功能卡改成每行两张；没有标题和图例；卡片里的字、圆点和标签和横版完全一样。三张竖版也上下拼成一段。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 13
   },
   "pending_requirements": [
    "绿/灰/黄字状态需只显示对应圆点与只修报错标签，组名需毛笔图；当前组件未实现。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：全部功能的手机版卡片改每行一张，完整原字和编号保持。"
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
   "asset": "_library/icons/手机电脑连接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机电脑连接",
   "source_phrase": "收进单个文件｜不是从手机来的，比如电脑录屏，直接收进来；在文件夹里却没登记的，原地补上记录｜绿",
   "sha256": "b9b5e9913f3f6a8e6115a17621c7499d5661d8a2319822d2bd32f79c63e7f4b7",
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
   "source_phrase": "同一段视频只留一种格式｜同一段视频有 MP4 和 MOV 两个文件，画面完全一样就只留一个｜绿",
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "编相册｜挑中的照片编成一个起好名字的相册，Google 相册和手机上也有同名相册｜绿",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "改日期、地点｜照片日期或地点标错了，告诉它改成什么，电脑、手机、云端一起改｜绿",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "挑哪些放回手机｜精选的自动放，普通的写出理由才放，我在审批页留下的默认放，总共不超过 60 GB｜绿",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "每天更新要放回的精选｜电脑上备着一份要放回手机的精选，每天按最新挑选自动增删｜绿",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "绿封面册",
   "source_phrase": "放回手机｜第二次连上时只补新的、删多余的、挪位置，断了接着来，最后确认相册里看得到｜绿·只修报错",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
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
   "source_phrase": "只核对，不放回｜只检查手机上的精选是不是都在，不往手机放东西｜灰·只修报错",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/波形照片.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形照片",
   "source_phrase": "算好每件去哪｜每张照片该进 Google 相册哪个相册、每段录音该进 Drive 哪个文件夹，先在电脑上算好｜绿",
   "sha256": "0be5de041a835e7d7b125f5edf51ffd4fb98807c67f7ba7b495f1bd757cecce9",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "上传并核对｜新留下的满 30 天才传，每件记下 Google 给的编号，重跑也不会重复传｜绿",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云上传",
   "source_phrase": "看还有多少没上云｜列出已传的、还没到 30 天的、等着删的各有多少｜绿",
   "sha256": "8de10ccf5db7a61ca06adfd5e2dd98b7d53c0e2ed1602d101c8eba2d8f194760",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "传完叫回 AI｜上传要跑几个小时，传完或出错自动把 AI 叫回来收尾｜绿",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "云端自动跟上｜每天维护后自动处理云端：满 30 天的新文件上传；电脑上删了的，录音进 Drive 回收站，照片视频攒够 30 张由 AI 开网页一次删｜黄",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-45a38d424be78a562cd1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-45a38d424be78a562cd1",
   "title_text": "云端",
   "sha256": "f5049175abbaebf5aa036e1e2dc23db8f30887beb4c1b1249a51730facabcc1d",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-909d815d1fe21836cde4.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-909d815d1fe21836cde4",
   "title_text": "收进来、改信息",
   "sha256": "b69cfffd1126830e1f61a4088d85c5b621ebee9e5c309c0e783c0ae51492bfb4",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-0f7b8711d136fc5ee824.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-0f7b8711d136fc5ee824",
   "title_text": "放回手机的精选",
   "sha256": "0f444f8f1d7f9459d5db220a668b15715074acf3563c21c4a221a867ed1480dc",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**收进来、改信息**
14. 收进单个文件｜不是从手机来的，比如电脑录屏，直接收进来；在文件夹里却没登记的，原地补上记录｜绿
15. 同一段视频只留一种格式｜同一段视频有 MP4 和 MOV 两个文件，画面完全一样就只留一个｜绿
16. 编相册｜挑中的照片编成一个起好名字的相册，Google 相册和手机上也有同名相册｜绿
17. 改日期、地点｜照片日期或地点标错了，告诉它改成什么，电脑、手机、云端一起改｜绿

**放回手机的精选**
18. 挑哪些放回手机｜精选的自动放，普通的写出理由才放，我在审批页留下的默认放，总共不超过 60 GB｜绿
19. 每天更新要放回的精选｜电脑上备着一份要放回手机的精选，每天按最新挑选自动增删｜绿
20. 放回手机｜第二次连上时只补新的、删多余的、挪位置，断了接着来，最后确认相册里看得到｜绿·只修报错
21. 只核对，不放回｜只检查手机上的精选是不是都在，不往手机放东西｜灰·只修报错

**云端**
22. 算好每件去哪｜每张照片该进 Google 相册哪个相册、每段录音该进 Drive 哪个文件夹，先在电脑上算好｜绿
23. 上传并核对｜新留下的满 30 天才传，每件记下 Google 给的编号，重跑也不会重复传｜绿
24. 看还有多少没上云｜列出已传的、还没到 30 天的、等着删的各有多少｜绿
25. 传完叫回 AI｜上传要跑几个小时，传完或出错自动把 AI 叫回来收尾｜绿
26. 云端自动跟上｜每天维护后自动跑一轮云端：满 30 天的新文件上传，电脑上删了的录音进 Drive 回收站，这部分已启用，最近一次 10 月 10 日 17:27 跑完；照片视频攒够 30 张由 AI 开网页删，网页定时任务还没部署｜黄

::screen{#personal-media-13 section="features"}

```typeset
{
 "screen": {
  "id": "personal-media-13",
  "section": "features",
  "title": "全部功能（续）",
  "scene": "横版，全部功能一共三张，上下拼成一整段，三张用同一套网格：每组先是一行组名（毛笔字，比大标题小一号，左对齐，后面跟一道短绿色笔刷线），组名下面是这一组的功能卡，每行三张、同宽同高；组名不单独占一整列，卡片从左边距一直排到右边距。一组不跨屏。每张功能卡：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话；右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）；标了“只修报错”的在卡片右下角加一个小标签“只修报错”。下面每行“编号. 功能名｜一句话｜状态”：“｜”只是分隔符不画，状态不写字，画成圆点和标签；〔〕是链接画法。这一张没有标题、没有图例，直接接着上一张往下排；顶部和底部都不画边框或分隔线，拼起来看不出是几张。先拿第一张当参考图画。已通过的旧版 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-10-desktop.png 的卡片画法、图标可以参考，但版面按这里的新规矩重排（原来左边的组名列去掉）。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：同样一组一段，组名一行，下面功能卡改成每行两张；没有标题和图例；卡片里的字、圆点和标签和横版完全一样。三张竖版也上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-daily",
    "text": "每天自动和日常维护"
   },
   {
    "id": "f-daily-maintain",
    "text": "每天维护"
   },
   {
    "id": "f-rebuild",
    "text": "记录坏了重建"
   },
   {
    "id": "f-snapshot-github",
    "text": "记录存进 GitHub"
   },
   {
    "id": "f-search-noise",
    "text": "清理搜索里的杂音"
   },
   {
    "id": "f-beijing-dates",
    "text": "按北京时间重算日期"
   },
   {
    "id": "f-catalog-check",
    "text": "检查记录是否完好"
   },
   {
    "id": "f-acceptance",
    "text": "整体验收"
   },
   {
    "id": "f-restore-markers",
    "text": "补回丢失的处理记号"
   },
   {
    "id": "g-private",
    "text": "私密"
   },
   {
    "id": "f-private-hidden",
    "text": "私密的默认搜不出来"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "pm-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "每天自动和日常维护",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush",
     "fill_last_row": true
    }
   ],
   "portrait_required": true,
   "source_layout": "横版，全部功能一共三张，上下拼成一整段，三张用同一套网格：每组先是一行组名（毛笔字，比大标题小一号，左对齐，后面跟一道短绿色笔刷线），组名下面是这一组的功能卡，每行三张、同宽同高；组名不单独占一整列，卡片从左边距一直排到右边距。一组不跨屏。每张功能卡：左边一个小水彩图标，粗体“编号. 功能名”，下面一句话；右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）；标了“只修报错”的在卡片右下角加一个小标签“只修报错”。下面每行“编号. 功能名｜一句话｜状态”：“｜”只是分隔符不画，状态不写字，画成圆点和标签；〔〕是链接画法。这一张没有标题、没有图例，直接接着上一张往下排；顶部和底部都不画边框或分隔线，拼起来看不出是几张。先拿第一张当参考图画。已通过的旧版 E:\\Cache\\Claude\\Temp\\4bd59299\\design\\v4\\personal-media\\screen-10-desktop.png 的卡片画法、图标可以参考，但版面按这里的新规矩重排（原来左边的组名列去掉）。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 9
   },
   "pending_requirements": [
    "绿/灰字状态需只显示对应圆点，组名需毛笔图；当前组件未实现。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：全部功能的手机版卡片改每行一张，完整原字和编号保持。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "text_ref": "每天自动和日常维护",
     "columns": 3,
     "columns_v": 1,
     "portrait_columns": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "status_display": "dot",
     "group_heading_style": "brush"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：同样一组一段，组名一行，下面功能卡改成每行两张；没有标题和图例；卡片里的字、圆点和标签和横版完全一样。三张竖版也上下拼成一段。",
   "asset_requirements": {
    "illustrations": 0,
    "icons": 9
   },
   "pending_requirements": [
    "绿/灰字状态需只显示对应圆点，组名需毛笔图；当前组件未实现。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：全部功能的手机版卡片改每行一张，完整原字和编号保持。"
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
   "asset": "_library/fix-round-2/icon-clean-f2b865944254996a0705.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹同步",
   "source_phrase": "每天维护｜每天 17:10 按硬盘上的实际情况更新记录，同步到备份硬盘，更新要放回手机的精选｜绿",
   "sha256": "4501b95fb0ac26d229723daa24cc261677a6716be664a72ae704ba9b40b38da3",
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
   "source_phrase": "记录坏了重建｜从存档的文字版把整份记录重建出来，云端编号一起恢复，不用重新上传｜灰",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "记录存进 GitHub｜整理完把整份记录的文字版存进私有仓库｜绿",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-42402ae3529ca5be6e19.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹放大镜",
   "source_phrase": "清理搜索里的杂音｜把混进描述里的整理过程挪出去，搜索不再冒出无关结果｜绿",
   "sha256": "fb456a1e4d36c484db35e98e2658cdd3995122696d9857e338f9e40f4c5691cc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "按北京时间重算日期｜重算每件是哪天拍的，对不上的标“日期不确定”｜绿",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "检查记录是否完好｜记录有没有坏、一共多少件、硬盘接没接着｜绿",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "整体验收｜大改之后跑一遍测试和真实查询，核对电脑、手机、云端的记录对不对得上｜绿",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "手机",
   "source_phrase": "补回丢失的处理记号｜某批手机文件“已处理”的记号丢了，用当时的回执补回来，免得重复处理｜绿",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "私密的默认搜不出来｜比如健康和基因检测结果这类照片，平时搜不出来；我说“包括私密的”，或 AI 更新对我的理解、私密的会改变结论时，才带上，只拿出需要的那几件｜绿",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-1dc57da6e8fb57d828cb.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-1dc57da6e8fb57d828cb",
   "title_text": "每天自动和日常维护",
   "sha256": "51a61d72f79ce9d4ba24409a35262b99613ed786d1a3d7b2649fc92948927378",
   "status": "ready",
   "g4_target_reference_available": false
  },
  {
   "role": "title",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-412677b5b74ffd7678de.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-412677b5b74ffd7678de",
   "title_text": "私密",
   "sha256": "2a4664194ef6d35002fea49ce2c092be5716a9bbee2c495e9825b8dac3bb7ad6",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**每天自动和日常维护**
27. 每天维护｜每天 17:10 按硬盘上的实际情况更新记录，同步到备份硬盘，更新要放回手机的精选；另有每天 07:15 的到期收尾，见第 9 项｜绿
28. 记录坏了重建｜从存档的文字版把整份记录重建出来，云端编号一起恢复，不用重新上传｜灰
29. 记录存进 GitHub｜整理完把整份记录的文字版存进私有仓库｜绿
30. 清理搜索里的杂音｜把混进描述里的整理过程挪出去，搜索不再冒出无关结果｜绿
31. 按北京时间重算日期｜重算每件是哪天拍的，对不上的标“日期不确定”｜绿
32. 检查记录是否完好｜记录有没有坏、一共多少件、硬盘接没接着｜绿
33. 整体验收｜大改之后跑一遍测试和真实查询，核对电脑、手机、云端的记录对不对得上｜绿
34. 补回丢失的处理记号｜某批手机文件“已处理”的记号丢了，用当时的回执补回来，免得重复处理｜绿

**私密**
35. 私密的默认搜不出来｜比如健康和基因检测结果这类照片，平时搜不出来；我说“包括私密的”，或 AI 更新对我的理解、私密的会改变结论时，才带上，只拿出需要的那几件｜绿

::screen{#personal-media-14 section="history"}

```typeset
{
 "screen": {
  "id": "personal-media-14",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上毛笔艺术字标题“演进”加绿色笔刷线。下面一条从左到右的横向时间线（绿色细线加七个绿色圆点），七个节点在线上下交错排开，每个节点一个小水彩图标（笔记本电脑、一叠照片、上传的云、相册、打勾的清单、手机打勾、云加循环箭头），粗体日期，下面一两行小字。最后一个节点的小字末尾是“（待验收）”，这个节点的圆点画成黄色，其余绿色。右下角一小幅水彩插画：一台电脑、三块叠放的黑色硬盘和一朵云。旧版演进参照 E:\\Cache\\Claude\\Temp\\4bd59299\\research\\sr-compress\\round02\\source-snapshots\\personal-media\\3cc14c94409aec87-screen-11-desktop.png 左半边的画法。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
  "portrait": "竖版 9:16：标题；时间线改成竖向，从上到下七个节点，图标在线左边、日期和小字在线右边；右下角插画缩小放在最下面。字和横版完全一样。",
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
     "size": "medium",
     "row": "history-title",
     "width": "80%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "right",
     "row": "history-title",
     "width": "20%"
    },
    {
     "type": "timeline",
     "text_ref": "8月下旬",
     "columns": 7,
     "direction": "horizontal",
     "connector": "line",
     "illustration": "outside",
     "icons": "auto",
     "alternating": true,
     "last_marker": "pending"
    }
   ],
   "portrait_required": true,
   "source_layout": "横版：左上毛笔艺术字标题“演进”加绿色笔刷线。下面一条从左到右的横向时间线（绿色细线加七个绿色圆点），七个节点在线上下交错排开，每个节点一个小水彩图标（笔记本电脑、一叠照片、上传的云、相册、打勾的清单、手机打勾、云加循环箭头），粗体日期，下面一两行小字。最后一个节点的小字末尾是“（待验收）”，这个节点的圆点画成黄色，其余绿色。右下角一小幅水彩插画：一台电脑、三块叠放的黑色硬盘和一朵云。旧版演进参照 E:\\Cache\\Claude\\Temp\\4bd59299\\research\\sr-compress\\round02\\source-snapshots\\personal-media\\3cc14c94409aec87-screen-11-desktop.png 左半边的画法。风格照已通过的本页各屏（白底、纯绿主色、水彩插画、圆角卡片、细浅绿描边），大标题用毛笔艺术字加绿色笔刷线。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 7
   },
   "pending_requirements": [
    "横版七节点上下交错、末节点黄圆点、右下主插画定位，需组件消费 alternating/last_marker 与精确插画位。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：时间线后的主插画靠右、图宽25%，缩到右下角，不占满下半屏。\n2026-10-04 空白专查：按本人点名授权调整本屏排版，原定稿文字、截图及图标含义保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "text_ref": "演进",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "timeline",
     "text_ref": "8月下旬",
     "columns": 1,
     "direction": "vertical",
     "connector": "line",
     "illustration": "left_inside",
     "icons": "auto",
     "alternating": true,
     "last_marker": "pending"
    },
    {
     "type": "illustration",
     "index": 0,
     "align": "right",
     "target_width": "25%"
    }
   ],
   "portrait_required": true,
   "source_layout": "竖版 9:16：标题；时间线改成竖向，从上到下七个节点，图标在线左边、日期和小字在线右边；右下角插画缩小放在最下面。字和横版完全一样。",
   "asset_requirements": {
    "illustrations": 1,
    "icons": 7
   },
   "pending_requirements": [
    "横版七节点上下交错、末节点黄圆点、右下主插画定位，需组件消费 alternating/last_marker 与精确插画位。"
   ],
   "notes": "构图依据 typeset-inventory 本屏记录及 source_path 定稿的 scene/portrait；定稿原字不改。整屏章节标题按 STANDARDS 追加要求居中，分栏内标题保持定稿位置。未支持字段只保存要求，不宣称渲染已完成。\n本轮 page-fixer-06-a（按 _qa/review 审查意见，AI 补充）：时间线后的主插画靠右、图宽25%，缩到右下角，不占满下半屏。"
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
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "笔记本电脑",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "照片堆",
   "source_phrase": "一叠照片",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文件夹上传",
   "source_phrase": "上传的云",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/06-绿封面册-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "相册",
   "sha256": "8e233e6fb5a4417bc0c8a7ae48b29de9b2cb1b793e3767a7c195b834e9e632f2",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "打勾清单",
   "source_phrase": "打勾的清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-0d5aefedb5c28b43ed21.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "手机",
   "source_phrase": "手机打勾",
   "sha256": "f53fa849b6a80f1f9a9c8a27907b1062764e6be8c17026920823a01a548850d6",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "云加循环箭头",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-personal-media.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-personal-media",
   "source_phrase": "右下角一小幅水彩插画：一台电脑、三块叠放的黑色硬盘和一朵云。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "一台电脑、三块叠放的黑色硬盘和一朵云"
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
   "asset": "_library/round3/titles/title-r3-f8367a4ec7c3aa408a9e.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8367a4ec7c3aa408a9e",
   "title_text": "演进",
   "sha256": "5e38f5402d26af886eb6b1852d3363f3a618c01be6c60c423b490489a9a5c1ee",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 演进

- **8 月下旬：**建起整份记录，AI 能按描述找原件；开始连手机、存两份、清空。
- **9 月 11–13 日：**24 件样本定尺子，全库整理，19851 → 3357。
- **9 月 14 日：**第一次全量上云，4230 件、96 GB。
- **9 月 15 日：**挑中的照片能编成起好名字的相册。
- **9 月 26 日：**保留理由、审批页、抽查栏、满 30 天才上云写进程序；精选能放回手机。
- **9 月 27 日：**手机部分做完，之后只修报错。
- **9 月 28 日：**云端维护接进每天 17:10 的维护：满 30 天的自动上传，电脑上删了的云端跟着删；接口这部分已启用，照片的网页删除还没做成定时任务（待验收）。

::screen{#personal-media-gallery-history section="gallery"}

```typeset
{
 "screen": {
  "id": "personal-media-gallery-history",
  "section": "gallery",
  "title": "画廊",
  "scene": "普通小节标题与一行用法说明；真实截图原图按三列排列，各自图注在下，不画插画、不缩减内容。",
  "portrait": "小节标题与说明在上；全部原图改为单列，图注紧跟对应原图。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "public/media/personal-media/01-singapore-night-garden.jpg",
    "caption": "蓝色灯光、温室轮廓与水面倒影把城市夜色拉开成完整层次。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/03-guangzhou-city-dinner.jpg",
    "caption": "临窗的一顿饭：广州塔与江景、餐桌上的海鲜和玩偶留在同一张照片里。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/04-singapore-city-night-roads.jpg",
    "caption": "道路曲线从画面底部穿进高楼，把城市纵深完整带出来。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/05-singapore-tropical-canopy.jpg",
    "caption": "树冠撑满画面，阳光从枝叶间落进花与热带绿意。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/06-singapore-harbor-from-air.jpg",
    "caption": "冷暖船灯散在深色海面上，像旅程结束前的一张星图。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/07-singapore-sculpture-skyline.jpg",
    "caption": "高饱和的橙红前景把灰蓝城市切出鲜明节奏。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/08-changi-jewel-rain-vortex.jpg",
    "caption": "垂直水幕贯穿多层花园，绿色和紫色把空间感推到最高。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/09-shanghai-rainbow-sculpture.jpg",
    "caption": "彩虹色曲线和规整建筑形成一张轻快、干净的城市画面。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   },
   {
    "file": "public/media/personal-media/10-singapore-rainforest-stream.jpg",
    "caption": "溪流形成天然引导线，把苔石、落叶和层层绿意串在一起。",
    "where": "画廊：完整原图，点击放大",
    "preserve_original": true
   }
  ],
  "chain": "",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "text_ref": "画廊",
     "type": "chapter_title",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "text_ref": "蓝色灯光、温室轮廓与水面倒影把城市夜色拉开成完整层次。",
     "indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "8192:6144",
      "3072:4096",
      "6144:8192",
      "6144:8160",
      "8192:6144",
      "8192:6144",
      "6144:8192",
      "4096:3072",
      "6144:8192"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      },
      {
       "index": 1,
       "node_indices": [
        1
       ]
      },
      {
       "index": 2,
       "node_indices": [
        2
       ]
      },
      {
       "index": 3,
       "node_indices": [
        3
       ]
      },
      {
       "index": 4,
       "node_indices": [
        4
       ]
      },
      {
       "index": 5,
       "node_indices": [
        5
       ]
      },
      {
       "index": 6,
       "node_indices": [
        6
       ]
      },
      {
       "index": 7,
       "node_indices": [
        7
       ]
      },
      {
       "index": 8,
       "node_indices": [
        8
       ]
      }
     ],
     "equal_row_height": true
    }
   ]
  },
  "v": {
   "blocks": [
    {
     "text_ref": "画廊",
     "type": "chapter_title",
     "align": "center",
     "size": "medium"
    },
    {
     "type": "screenshot",
     "text_ref": "蓝色灯光、温室轮廓与水面倒影把城市夜色拉开成完整层次。",
     "indices": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "columns": 3,
     "columns_v": 1,
     "ratios": [
      "8192:6144",
      "3072:4096",
      "6144:8192",
      "6144:8160",
      "8192:6144",
      "8192:6144",
      "6144:8192",
      "4096:3072",
      "6144:8192"
     ],
     "caption_mode": "source_order",
     "slot_groups": [
      {
       "index": 0,
       "node_indices": [
        0
       ]
      },
      {
       "index": 1,
       "node_indices": [
        1
       ]
      },
      {
       "index": 2,
       "node_indices": [
        2
       ]
      },
      {
       "index": 3,
       "node_indices": [
        3
       ]
      },
      {
       "index": 4,
       "node_indices": [
        4
       ]
      },
      {
       "index": 5,
       "node_indices": [
        5
       ]
      },
      {
       "index": 6,
       "node_indices": [
        6
       ]
      },
      {
       "index": 7,
       "node_indices": [
        7
       ]
      },
      {
       "index": 8,
       "node_indices": [
        8
       ]
      }
     ],
     "equal_row_height": true
    }
   ]
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
   "asset": "personal-media/personal-media-04-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\personal-media\\img\\personal-media-04-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6f966a995ad3884757df",
   "title_text": "画廊",
   "sha256": "684661ca34ff0c625b805441d00e0e5836abb3717728e32fde7a67139c618a97",
   "status": "ready",
   "source_box": [
    47,
    0,
    352,
    185
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 画廊

点击图片，可以查看完整原图。

蓝色灯光、温室轮廓与水面倒影把城市夜色拉开成完整层次。

临窗的一顿饭：广州塔与江景、餐桌上的海鲜和玩偶留在同一张照片里。

道路曲线从画面底部穿进高楼，把城市纵深完整带出来。

树冠撑满画面，阳光从枝叶间落进花与热带绿意。

冷暖船灯散在深色海面上，像旅程结束前的一张星图。

高饱和的橙红前景把灰蓝城市切出鲜明节奏。

垂直水幕贯穿多层花园，绿色和紫色把空间感推到最高。

彩虹色曲线和规整建筑形成一张轻快、干净的城市画面。

溪流形成天然引导线，把苔石、落叶和层层绿意串在一起。
