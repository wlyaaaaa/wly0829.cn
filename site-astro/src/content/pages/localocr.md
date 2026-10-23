---
{
 "title": "本地文字识别",
 "kind": "project",
 "url": "/projects/localocr/",
 "tagline": "在本机显卡上把图片和扫描件里的字读准、读全。",
 "toc": [
  {
   "id": "top",
   "label": "开头",
   "img": "/_shared/nav-unify-standard/nav-unify-label-42-7371cd297c.webp"
  },
  {
   "id": "usage",
   "label": "怎么用",
   "img": "/_shared/nav-unify-standard/nav-unify-label-43-9fe7ee9705.webp"
  },
  {
   "id": "tech",
   "label": "技术",
   "img": "/_shared/nav-unify-standard/nav-unify-label-49-4aa1a3c674.webp"
  },
  {
   "id": "highlights",
   "label": "亮点",
   "img": "/_shared/nav-unify-standard/nav-unify-label-13-ba0d3fdcc6.webp"
  },
  {
   "id": "features",
   "label": "全部功能",
   "img": "/_shared/nav-unify-standard/nav-unify-label-25-6c8f61c250.webp"
  },
  {
   "id": "history",
   "label": "演进",
   "img": "/_shared/nav-unify-standard/nav-unify-label-55-f8367a4ec7.webp"
  }
 ],
 "page": {
  "schema": "site-b1.page.v1",
  "page": "localocr",
  "kind": "project",
  "title": "本地文字识别",
  "url": "/projects/localocr/",
  "tagline": "在本机显卡上把图片和扫描件里的字读准、读全。",
  "status": "常用",
  "status_line": {
   "state": "在用",
   "last": {
    "label": "上次使用",
    "at": "2026-10-20 14:00"
   },
   "facts": [
    "近 7 天 AI 点名用了 14 次"
   ],
   "as_of": "2026-10-21",
   "source": "识别服务日志；AI 使用记录"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/LocalOCR",
  "capability": "看懂图片和扫描件里的字",
  "based_on": {
   "commit": "d47d48822760918ee4895750ba8cfa851be7af32",
   "commit_time": "2026-09-27T16:22:31+08:00"
  },
  "video_prompt": "6 秒无缝循环，白底水彩风格，从开头这屏的插画出发：机箱里的显卡绿光缓慢呼吸；三张纸（手机截图、扫描讲义、带表格的单据）从显卡上方轻轻飘起，纸上的一行行字依次化成绿色小方框，排队飞进放大镜；其中表格那张纸飞到一半停住，一道细绿光扫过表格的横竖线，它转向另一条更粗的绿色光带（强模型）再飞进放大镜；放大镜下方“有字”“没字”“说不准”三个小标签轮流轻轻亮一下。镜头不动，没有文字，结尾回到起始画面。",
  "registry": {
   "groups": [
    {
     "id": "g-read",
     "name": "读字"
    },
    {
     "id": "g-route",
     "name": "选模型"
    },
    {
     "id": "g-structure",
     "name": "表格和位置"
    },
    {
     "id": "g-trust",
     "name": "结果靠得住"
    },
    {
     "id": "g-run",
     "name": "运行和显卡"
    },
    {
     "id": "g-version",
     "name": "版本和换模型"
    }
   ],
   "features": [
    {
     "id": "f-image",
     "group": "g-read",
     "name": "图片和截图识字",
     "what": "png、jpg、webp、bmp 图片和截图，读出全部文字",
     "how": "跟 AI 说读哪张图，或拖到 start.bat",
     "status": "在用",
     "screen": "localocr-10",
     "source": "router.py 第 5 行；任务登记 646 张图片"
    },
    {
     "id": "f-scan",
     "group": "g-read",
     "name": "扫描件逐页识字",
     "what": "扫描 PDF 按 216 DPI 逐页渲染再读，多页 TIFF 逐帧读，并核对实际页数",
     "how": "跟 AI 说这份扫描件转成文字",
     "status": "在用",
     "screen": "localocr-10",
     "source": "pdf_utils.py 第 104 行；ARCHITECTURE.md；任务登记 12 份 PDF 共 34 页"
    },
    {
     "id": "f-folder",
     "group": "g-read",
     "name": "一个文件夹一起读",
     "what": "每个文件分别选路线，不支持的文件列为跳过",
     "how": "把文件夹交给 AI",
     "status": "说不准",
     "screen": "localocr-10",
     "source": "router.py 第 29–49 行；任务记录按单个文件记，看不出是否整夹提交"
    },
    {
     "id": "f-drag",
     "group": "g-read",
     "name": "拖到 start.bat 就识别",
     "what": "不经过 AI，自己拖文件，结果在 outputs 文件夹",
     "how": "把文件拖到 start.bat 上",
     "status": "说不准",
     "screen": "localocr-10",
     "source": "README.md；9 月 8 日修过拖放路径（376a777），但拖放不单独留记录"
    },
    {
     "id": "f-outputs",
     "group": "g-read",
     "name": "三种结果文件",
     "what": "纯文字 TXT、保留标题表格的 Markdown、带坐标和把握分的 JSON",
     "how": "识别后自动写出",
     "status": "在用",
     "screen": "localocr-10",
     "source": "QUICKSTART_FOR_AI.md“输出”"
    },
    {
     "id": "f-rotate",
     "group": "g-read",
     "name": "歪的倒的先转正",
     "what": "两个方向小模型判断整页和每行字的朝向，先转正再读",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-10",
     "source": "model_profiles.json 第 17–19 行；任务登记 628 条带 page_angle"
    },
    {
     "id": "f-auto",
     "group": "g-route",
     "name": "先快后强自动选",
     "what": "每页先用快模型读，体检不过的页才换强模型",
     "how": "默认就是自动",
     "status": "在用",
     "screen": "localocr-10",
     "source": "difficulty.py；任务登记 auto 639 次、升级 256 次（截至 10 月 11 日 14:00）"
    },
    {
     "id": "f-page-escalate",
     "group": "g-route",
     "name": "只重读有问题的页",
     "what": "多页文件里只把没读好的那几页交给强模型，其余页保留快读结果",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-10",
     "source": "任务登记 9 月 26 日 17:09 一份 16 页 PDF 只重读第 15 页"
    },
    {
     "id": "f-explicit",
     "group": "g-route",
     "name": "指定模型",
     "what": "可以直接说用快模型、强模型或结构还原，自动选路不改写",
     "how": "跟 AI 说“用强模型读”",
     "status": "在用",
     "screen": "localocr-10",
     "source": "smart_router.py 第 48–66 行；任务登记 reason=explicit_ocr 288 次、explicit_model 69 次"
    },
    {
     "id": "f-triage",
     "group": "g-route",
     "name": "只看走哪条路",
     "what": "先预览这份材料会走哪条路线，不真的识别",
     "how": "让 AI 先预检",
     "status": "说不准",
     "screen": "localocr-10",
     "source": "ocr_smart.ps1 -TriageOnly 第 390 行；预检不留任务记录"
    },
    {
     "id": "f-table",
     "group": "g-structure",
     "name": "表格还原成行列",
     "what": "PP-StructureV3 把表格还原成行列 HTML，给每块区域坐标",
     "how": "明确说“要表格结构”",
     "status": "没用过",
     "screen": "localocr-10",
     "source": "model_profiles.json；任务登记里真实材料 0 次（只有 9 月 3 日测试样例 1 次）"
    },
    {
     "id": "f-formula-seal",
     "group": "g-structure",
     "name": "公式和印章",
     "what": "同一条结构还原路线认出公式、检测印章文字",
     "how": "明确说要公式或印章",
     "status": "没用过",
     "screen": "localocr-10",
     "source": "model_profiles.json 第 105–108 行；同上 0 次"
    },
    {
     "id": "f-coords",
     "group": "g-structure",
     "name": "每行字的位置和把握分",
     "what": "JSON 里每块字有框、多边形、阅读顺序和 0–1 的把握分",
     "how": "要位置时说一声",
     "status": "在用",
     "screen": "localocr-10",
     "source": "ARCHITECTURE.md“模型和结果合同”"
    },
    {
     "id": "f-objective",
     "group": "g-trust",
     "name": "有字、没字、说不准",
     "what": "每份结果附一份客观结论，空结果不当“没字”",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-11",
     "source": "objective_result.py；15,665 条带结论识别（按次数，不能相加）"
    },
    {
     "id": "f-summary",
     "group": "g-trust",
     "name": "一句人话摘要",
     "what": "把覆盖、质量、文字块数和是否升级写成一句话",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-11",
     "source": "acc6d15；任务登记 15,545 条完成记录带摘要"
    },
    {
     "id": "f-snapshot",
     "group": "g-trust",
     "name": "原件留底再识别",
     "what": "先算指纹做只读快照，识别完原件变了就不发结果",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-11",
     "source": "ARCHITECTURE.md“输入、状态与输出”"
    },
    {
     "id": "f-cache",
     "group": "g-trust",
     "name": "识过不重识",
     "what": "同样的材料和请求再来，核对指纹后直接交上次结果",
     "how": "自动；也可以让 AI 先查",
     "status": "在用",
     "screen": "localocr-11",
     "source": "756d0cf；outputs.py 第 45 行"
    },
    {
     "id": "f-partial",
     "group": "g-trust",
     "name": "中断时保住读完的页",
     "what": "超时或崩溃时已读完的页留作部分结果，不冒充整份",
     "how": "自动",
     "status": "说不准",
     "screen": "localocr-11",
     "source": "ARCHITECTURE.md；只有中断时才出现，登记里没有单独字段"
    },
    {
     "id": "f-server",
     "group": "g-run",
     "name": "本机识别服务",
     "what": "只在本机 18665 端口，同一时间只做一个识别，忙时直说不排队",
     "how": "AI 自动启动",
     "status": "在用",
     "screen": "localocr-11",
     "source": "server.py；ARCHITECTURE.md"
    },
    {
     "id": "f-status",
     "group": "g-run",
     "name": "查进度、取消",
     "what": "按任务编号查到哪一步，或只取消这一项",
     "how": "跟 AI 说“看看做到哪了”或“取消”",
     "status": "说不准",
     "screen": "localocr-11",
     "source": "server.py 第 137、143 行；查询和取消不留记录"
    },
    {
     "id": "f-gpu",
     "group": "g-run",
     "name": "领显卡、和语音转写同时跑",
     "what": "向显卡调度员领租约才加载模型；可和语音转写并行，和本地大模型互斥",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-11",
     "source": "gpu_broker.py；PCConfig broker.py 第 474–499 行"
    },
    {
     "id": "f-release",
     "group": "g-run",
     "name": "用完腾显卡",
     "what": "关掉工作进程、还回显卡；本地大模型要用时调度员也会先清",
     "how": "说“识别完把显卡腾出来”",
     "status": "在用",
     "screen": "localocr-11",
     "source": "release_resources.ps1；台账有 release_resources.ps1 命令记录"
    },
    {
     "id": "f-limits",
     "group": "g-run",
     "name": "超时和内存上限",
     "what": "一次默认 300 秒、最多 2 小时；内存超 30 GB 只停自己",
     "how": "自动；长任务 AI 会放宽期限",
     "status": "在用",
     "screen": "localocr-11",
     "source": "ARCHITECTURE.md“任务与资源生命周期”"
    },
    {
     "id": "f-observer",
     "group": "g-run",
     "name": "给看板的任务视图",
     "what": "只读、不含文件内容的任务列表接口",
     "how": "看板读取",
     "status": "说不准",
     "screen": "localocr-11",
     "source": "server.py 第 163 行；本轮没找到调用方"
    },
    {
     "id": "f-release-snapshot",
     "group": "g-version",
     "name": "正式版和开发代码分开",
     "what": "每天用的是验收过的快照，改代码不影响它",
     "how": "自动",
     "status": "在用",
     "screen": "localocr-11",
     "source": "UPGRADING.md；current → 9 月 24 日版"
    },
    {
     "id": "f-rollback",
     "group": "g-version",
     "name": "退回上一版",
     "what": "保留上一版，出问题可以切回，切回也要它自己的验收",
     "how": "跟 AI 说退回上一版",
     "status": "在用",
     "screen": "localocr-11",
     "source": "UPGRADING.md；旧网站记载 9 月 17 日实测切换和回滚"
    },
    {
     "id": "f-acceptance",
     "group": "g-version",
     "name": "换版前三道验收",
     "what": "依赖、181 项测试无失败、9 个合成样例的真实显卡识别全过才切换",
     "how": "换版时 AI 跑",
     "status": "在用",
     "screen": "localocr-11",
     "source": "验收回执 acceptance.json"
    },
    {
     "id": "f-model-swap",
     "group": "g-version",
     "name": "换模型只改配置",
     "what": "模型写在配置档里，新模型先对照验收，不自动当默认",
     "how": "跟 AI 说想试某个新模型",
     "status": "在用",
     "screen": "localocr-11",
     "source": "MODELS.md“可替换版本合同”；e93fdc6"
    }
   ],
   "numbers": [
    {
     "id": "n-jobs",
     "text": "17,189 次识别",
     "meaning": "7 月 8 日–10 月 11 日 14:00 的识别次数；共 14,976 份材料、16,157 页。任务登记里完成的识别，去掉项目自带样例、冒烟测试和 8 月 18 日开发时的空白测试图；材料按原件指纹去重；页数累加；命中缓存不新增记录",
     "as_of": "2026-10-23",
     "source": "见来源记录 localocr-n-jobs-0，观察于 2026-10-23T10:27:03+08:00",
     "screens": [
      "localocr-01"
     ]
    },
    {
     "id": "n-auto",
     "text": "60%；自动选模型的 681 次里 410 次快模型就够，256 次换了强模型；其余 15,435 次直接指定模型",
     "meaning": "route.requested_engine=auto 的完成记录里是否升级（截至 10 月 11 日 14:00）；9 月 29 日一批临时图片的升级占 9 月 28 日后升级的大部分",
     "as_of": "2026-10-23",
     "source": "见来源记录 localocr-n-auto-1，观察于 2026-10-23T10:27:03+08:00",
     "screens": [
      "localocr-01",
      "localocr-08"
     ]
    },
    {
     "id": "n-page-escalate",
     "text": "16 页的扫描 PDF 只重读了第 15 页（9 月 26 日）",
     "meaning": "route.escalated_page_indices=[14]",
     "as_of": "2026-09-28",
     "source": "同上，只读页数和页号字段",
     "screens": [
      "localocr-08",
      "localocr-09"
     ]
    },
    {
     "id": "n-models",
     "text": "18 个本地模型，共 3.9 GiB",
     "meaning": "WSL /root/.paddlex/official_models 目录数和 du 总大小",
     "as_of": "2026-10-12",
     "source": "wsl du -sb /root/.paddlex/official_models（10 月 11 日复核：18 个、3.9 GiB）",
     "screens": [
      "localocr-01",
      "localocr-06"
     ]
    },
    {
     "id": "n-tests",
     "text": "181 项测试无失败（16 项按条件跳过）；9 个合成样例；9 月 24 日验收",
     "meaning": "现役版本验收回执：181 项单元测试，165 项通过、16 项按条件跳过、0 项失败，9 个合成样例覆盖三条路线全过",
     "as_of": "2026-10-12",
     "source": "/root/localocr-runtimes/current 仍指向 9 月 24 日验收的版本（10 月 10 日复核）；tests 下 def test_ 仍是 181 个",
     "screens": [
      "localocr-01",
      "localocr-07",
      "localocr-11",
      "localocr-12"
     ]
    },
    {
     "id": "n-speed",
     "text": "一张截图约 2 秒；强模型首次约 50 秒",
     "meaning": "验收 quality.json：快模型热着 1.85–2.08 秒/样例（首次含加载 17.4 秒）；VL 首次含加载 50.4 秒",
     "as_of": "2026-09-24",
     "source": "quality.json 各样例 elapsed_sec",
     "screens": [
      "localocr-02",
      "localocr-06",
      "localocr-08"
     ]
    },
    {
     "id": "n-memory",
     "text": "工作进程内存约 16 GB（强模型）",
     "meaning": "验收中加载 VL 后工作进程内存峰值 16.25–16.31 GiB（不是显存）",
     "as_of": "2026-09-24",
     "source": "quality.json process_peak_rss_bytes",
     "screens": [
      "localocr-06",
      "localocr-08"
     ]
    },
    {
     "id": "n-table-score",
     "text": "平均把握分 0.99995",
     "meaning": "验收样例 auto_table 快读 9 行的平均把握分 0.999949",
     "as_of": "2026-09-24",
     "source": "quality.json auto_table route.difficulty.metrics",
     "screens": [
      "localocr-09"
     ]
    },
    {
     "id": "n-objective",
     "text": "15,665 次带结论识别：15,196 次“有字”、466 次“说不准”、3 次“没字”",
     "meaning": "8 月 18 日起带 objective_outcome 的真实识别结果（去掉项目自带样例、冒烟测试和 8 月 18 日开发时的空白测试图）；按 9 月 28 日 20:26 截止复算仍是 274 份全为“有字”，之后的“说不准”和 3 份“没字”都在 9 月 29 日以后。这是按识别次数算的，不是按材料：三类分别涉及 14,261、446、1 份材料，同一份材料识别几次可能落进不同的类，所以三个数不能相加，也加不出 14,976 份材料。",
     "as_of": "2026-10-11",
     "source": "任务登记 result.objective_outcome 计数（10 月 11 日北京 16:10 只读复算：text_detected 15,196、indeterminate 466、no_text_detected 3）",
     "screens": [
      "localocr-09"
     ]
    },
    {
     "id": "n-code",
     "text": "6,903 行程序、4,801 行测试、43 次提交",
     "meaning": "git ls-files 统计：localocr/*.py 5173 + 根目录 ps1/bat 1455 + scripts 275；tests/*.py 4801；git log 43 次；每个已跟踪文件只计一次",
     "as_of": "2026-10-11",
     "source": "git ls-files 逐文件物理行数；HEAD 50af3fafae40e1284e8f4873f283b7ce5361ce41，2026-10-11 北京时间复核；git rev-list --count HEAD",
     "screens": [
      "localocr-07",
      "localocr-12"
     ]
    },
    {
     "id": "n-features",
     "text": "全部功能（28 项）",
     "meaning": "本页 registry.features 条数",
     "as_of": "2026-09-28",
     "source": "本页",
     "screens": [
      "localocr-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-file-intake",
     "with": "当时的 AI（按文件类型选读法）",
     "direction": "拿来",
     "flow": "一堆文件混在一起时，当时的 AI 把扫描件、无文字层 PDF 和要逐字的图片交给它，电子版 PDF 和 Office 文件走各自的读取工具",
     "source": "E:\\.agents\\skills\\localocr\\SKILL.md 第 8–17 行（提交 99e1da5）；file-intake-router 10 月 2 日退役"
    },
    {
     "id": "r-materials",
     "with": "personal-materials",
     "direction": "拿来",
     "flow": "找到的原件没有文字层、要翻到哪一页时，只对这一份调用，复用已有结果，位置绑定到原 PDF 的页码",
     "source": "E:\\.agents\\skills\\personal-materials\\SKILL.md 第 23 行"
    },
    {
     "id": "r-media",
     "with": "personal-media",
     "direction": "拿来",
     "flow": "整理照片时画面由 AI 自己看，截图上的屏幕文字交给它逐字读；搜索索引 4,363 条里 376 条这样审过",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py 第 165 行；keeper-search-index.ndjson 字段计数"
    },
    {
     "id": "r-asr",
     "with": "chinese-asr",
     "direction": "并行",
     "flow": "共用一块显卡，两者可以同时持有租约",
     "source": "E:\\PCConfig\\tools\\local_gpu_broker\\broker.py 第 70–71、474–499 行"
    },
    {
     "id": "r-pcconfig-broker",
     "with": "pcconfig",
     "direction": "依赖",
     "flow": "显卡调度员发租约；本地大模型要用显卡前先清掉文字识别的工作进程",
     "source": "broker.py 第 389–396 行；task_purpose_catalog.json 第 322、341 行"
    },
    {
     "id": "r-pcconfig-restore",
     "with": "pcconfig",
     "direction": "被登记",
     "flow": "项目路径、端口 18665、恢复锚点、换机时按来源重下模型",
     "source": "PCConfig registries/project_restore_anchors.json、core_recovery.json、wsl_user_data_backup.json；GitHub 总索引 config/repository-paths.json（仓库导航快照）"
    },
    {
     "id": "r-ollama",
     "with": "本地大模型（Ollama）",
     "direction": "互斥",
     "flow": "和本地大模型不能同时占显卡",
     "source": "broker.py；本人决定“9/27 中文转写维护与显卡分工”"
    },
    {
     "id": "r-modelscope",
     "with": "ModelScope 魔搭（外部）",
     "direction": "拿来",
     "flow": "安装时下载模型，之后离线",
     "source": "docs/MODELS.md“下载来源优先级”"
    },
    {
     "id": "r-github-ci",
     "with": "GitHub Actions（外部）",
     "direction": "给出",
     "flow": "每次推送跑模型无关的测试",
     "source": ".github/workflows/tests.yml"
    }
   ],
   "highlights": [
    {
     "id": "h-fast-then-strong",
     "title": "先快后强，只重读有问题的那一页",
     "screen": "localocr-08"
    },
    {
     "id": "h-table-lines",
     "title": "把握分很高，也可能读错表格",
     "screen": "localocr-09"
    },
    {
     "id": "h-no-text",
     "title": "读不出字，不等于没有字",
     "screen": "localocr-09"
    },
    {
     "id": "h-no-unwarp",
     "title": "截图不需要“摊平”",
     "screen": "localocr-09"
    }
   ],
   "mentions": [
    {
     "target": "/how/#localocr",
     "screen": "localocr-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/skills/localocr/",
     "screen": "localocr-02",
     "text": "跟 AI 怎么说 → 技能页"
    },
    {
     "target": "/projects/personal-media/",
     "screen": "localocr-02",
     "text": "照片视频录音管理"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "localocr-07",
     "text": "中文语音转写"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "localocr-07",
     "text": "电脑配置与恢复"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“图片文字识别”→ f-image；“扫描PDF识别”→ f-scan（并入多页 TIFF）；“按材料选识别”→ f-auto，另拆出 f-page-escalate、f-explicit、f-triage；“表格版面识别”拆成 f-table、f-formula-seal（结构还原）和 f-coords（普通识别也有的位置和把握分）；“识别结果复核”→ f-objective（另拆出 f-summary）；“作业查询取消”→ f-status；“结果复用”→ f-cache；“资源释放”→ f-release。",
    "“忙时直说不排队”并入 f-server，因为它是服务的固定行为，不是能单独用的功能。"
   ],
   "dropped": [
    "AI 自己看图和本地识字怎么分工、两边冲突怎么办：家在技能页 /skills/localocr/，本页只写一句并链过去。",
    "安装、预热模型、重型多模型测试要明确同意（--allow-heavy）等维护细节：读者不关心，不上。"
   ],
   "unsure": [
    "开头没有“现在”横条和〔现在正不正常 → 驾驶舱〕：这个项目自己没有计划任务（显卡调度员的两个任务归电脑配置与恢复）。如果驾驶舱想显示“识别服务在不在跑、现在忙不忙”（/health 的 active_jobs），可以加一个 run 槽位，请 Claude 定。",
    "“表格还原成行列”“公式和印章”标“没用过”：任务登记里真实材料上结构还原 0 次（旧功能总账写的是“在用”）。真实材料上的表格目前是靠自动换强模型保住行列。请本人确认这两项要不要保留。",
    "“退回上一版”标“在用”依据的是旧网站记载的 9 月 17 日端到端回执（切换、回滚、再恢复），本轮没重新读那份回执原件。",
    "第 2 屏“我一般不直接开它，而是跟 AI 说要读什么”是替本人口吻写的句子，上线前请本人过目。",
    "数字和旧稿不同：旧稿 9 月 28 日 04:45 算的是 645 次、517 份、667 页、“97% 以上只用快模型”；按审稿意见截至 9 月 28 日 20:26 重算为 684、555、706（还在每天增长，上线前可再算一次）。另外“97%”把直接指定快模型的 357 次也算进去了，会夸大自动选路的效果，本页改用“自动选模型 300 次里 92% 快模型就够”。",
    "画廊的输出截图是 9 月 3 日结构还原路线的旧结果，现役版本没用同一张图重跑；截图里自带的文字（“实际识别输出”等）由拼页原样贴上，不在本页 text 里。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/localocr/page.json",
  "sha256": "823cbb87e4c003a0e6558032a6710dfa8856c0df7a76b7b81ab75ecb3fa92afb",
  "converted_at_beijing": "2026-10-23T14:53:34+08:00"
 }
}
---

::screen{#localocr-01 section="top"}

```typeset
{
 "screen": {
  "id": "localocr-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段介绍。右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：1 一叠纸，2 两条岔路一快一慢，3 一排小方块（模型），4 一张打勾的清单。卡片下面右对齐一行灰色小字“截至 2026 年 10 月 11 日 14:00”。最下面一行两个白底细绿边圆角按钮。没有“现在”横条（这个项目没有自己的自动任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：大标题、副标题、介绍从上往下；插画放在介绍下面，占满宽；四张数字卡两行两列；截至日期；两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#localocr"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/LocalOCR"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/localocr/#ai-brief"
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
     "width": "50%",
     "text_ref": "本地文字识别"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次使用 10 月 20 日 14:00",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 点名用了 14 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 21 日 · 识别服务日志；AI 使用记录",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "text_ref": "在自己电脑的显卡上，把图片、截图和扫描件里的字读准、读全"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "50%"
    },
    {
     "type": "stat_card",
     "variant": "paragraph_stats",
     "columns": 4,
     "columns_v": 2,
     "illustration": "top_inside",
     "icons": "auto",
     "expected_cards": 4,
     "text_ref": "17,189次识别，共16,066份材料"
    },
    {
     "type": "prose",
     "text_ref": "截至2026年10月23日10:27（北京时间"
    },
    {
     "type": "action_button",
     "columns": 3,
     "columns_v": 1,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上毛笔艺术字大标题，下面一句粗体副标题和一段介绍。右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。中间一排四张数字卡（上面小插画、大号绿色数字、下面一行小字）：1 一叠纸，2 两条岔路一快一慢，3 一排小方块（模型），4 一张打勾的清单。卡片下面右对齐一行灰色小字“截至 2026 年 9 月 28 日”。最下面一行两个白底细绿边圆角按钮。没有“现在”横条（这个项目没有自己的自动任务）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "本地文字识别"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "在用 · 上次使用 10 月 20 日 14:00",
       "state": "ok"
      },
      {
       "text": "近 7 天 AI 点名用了 14 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 21 日 · 识别服务日志；AI 使用记录"
    },
    {
     "type": "stat_card",
     "variant": "paragraph_stats",
     "columns": 4,
     "columns_v": 2,
     "illustration": "top_inside",
     "icons": "auto",
     "expected_cards": 4,
     "text_ref": "17,189次识别，共16,066份材料"
    },
    {
     "type": "prose",
     "text_ref": "截至2026年10月23日10:27（北京时间"
    },
    {
     "type": "prose",
     "text_ref": "在自己电脑的显卡上，把图片、截图和扫描件里的字读准、读全"
    },
    {
     "type": "illustration"
    },
    {
     "type": "action_button",
     "columns": 3,
     "columns_v": 1,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：大标题、副标题、介绍从上往下；插画放在介绍下面，占满宽；四张数字卡两行两列；截至日期；两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "684 次｜识别，555 份材料、706 页（7 月 8 日–9 月 28 日 20:26）",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "92%｜自动选模型的 300 次里，277 次快模型就够，23 次换了强模型（其余 384 次是直接指定快模型）",
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
   "asset": "_library/fix-round-2/icon-clean-f12e6ff1182222417108.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云下载",
   "source_phrase": "18 个｜本地模型，共 3.9 GB，下载后离线运行",
   "sha256": "a149b95737b7aae5ced9666a2cebe730366ea2410c938467df8d9e92e9459c39",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/试管对勾.png",
   "fallback": false,
   "semantic_status": "owner_requested_test_pass_icon",
   "key": "绿色测试通过",
   "source_phrase": "181 项｜测试无失败（16 项按条件跳过），现役版本 9 月 24 日验收",
   "sha256": "006d19b6c111eb426183a27eeba8b211df84035835b69f400e3dfad58d99e4a1",
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
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-localocr",
   "source_phrase": "右上一幅水彩插画：一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签“有字”“没字”“说不准”。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一台侧透机箱，显卡亮着绿光，显卡上方飘出三张纸（一张手机截图、一张扫描讲义、一张带表格的单据），纸上的字化成一行行绿色小方框飞进一个放大镜；放大镜旁边三个小标签抽象图形抽象图形抽象图形"
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
   "asset": "localocr/localocr-01-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\localocr\\img\\localocr-01-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-6077f34d4f3fa1ff31ba",
   "title_text": "本地文字识别",
   "sha256": "84b6833b60f41aa68e46393d7023d3a48e8487a764c7da9e071ad183b89d3bed",
   "status": "ready",
   "source_box": [
    41,
    47,
    722,
    220
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 本地文字识别
**在自己电脑的显卡上，把图片、截图和扫描件里的字读准、读全，并说清哪里没把握。**

AI 自己也能看图，说个大意没问题；要准确抄下扫描件、参数表或几十张截图，就把文件交给它。比如“把这张参数表读成文字，没把握的地方标出来”，会得到文字和逐页判断：有字、没字，还是说不准；要还原表格行列，明确说明。识字在本机离线完成，图片不传到识别网站；读不好的页再用更强的模型重读。

17,189 次｜识别，共 16,066 份材料；里面有不少是 AI 批量做的网站截图检查和图片压缩试验，不全是我主动交的
60%｜自动选模型时快模型就够：681 次里有 410 次
18 个｜本地模型，共 3.9 GiB，下载后离线运行
187 项｜测试无失败（17 项按条件跳过），现役版本 10 月 16 日 12:29 验收

截至 2026 年 10 月 23 日 10:27（北京时间）；识别从 7 月 8 日算起；测试数是现役版本验收时的数

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#localocr-13 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-13",
  "section": "usage",
  "title": "什么材料走哪条路",
  "scene": "横版：左上毛笔艺术字标题加绿色笔刷线。画面左边约 22% 宽一幅水彩插画：一叠纸（一张手机截图、一张扫描讲义、一张带表格的单据）走进一个听诊器形状的“体检”小站。从左往右是一张选路图：一条绿色主路从纸堆出发，先到第一张大卡片“普通页”（图标：闪电），这条路画成实线最粗；从体检小站分出一条向下弯的绿色支路，标小字“体检不过关的那一页”，通向第二张大卡片“难页”（图标：望远镜）；纸堆上方另有一条细虚线支路，标小字“明说要结构”，通向第三张大卡片“要还原结构”（图标：表格网格）。三张卡片从上到下排在画面右侧约 75% 宽里，每张卡片左边是粗体卡片标题和括号说明，右边是一个浅绿底的圆角模型名条（写“→ 快读：……”那一行），下面一两行正文。三张卡片宽高一致、间距一致，不留空格子。最下面一条横跨整屏的细卡片放最后一句，两个〔〕画成白底细浅绿描边的圆角按钮。三个图标和第 6 屏“用的哪些模型”表格里的图标保持同一画法。",
  "portrait": "竖版：标题；插画缩成一行宽在上；三张卡片上下排、各占满宽，卡片之间用一段向下的绿色箭头连起来（第二段箭头旁写“体检不过关的那一页”，通向第三张的箭头画成虚线，旁写“明说要结构”）；每张卡片里先标题，再模型名条，再正文；最下面两个按钮上下各一行。字和横版完全一样。",
  "links": [
   {
    "text": "亮点：先快后强",
    "href": "/projects/localocr/#fast-then-strong"
   },
   {
    "text": "用的哪些模型",
    "href": "/projects/localocr/#models"
   }
  ],
  "anchors": [
   {
    "id": "routes",
    "text": "什么材料走哪条路"
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
     "align": "center",
     "size": "large",
     "text_ref": "什么材料走哪条路"
    },
    {
     "type": "illustration",
     "row": "routes",
     "width": "22%",
     "row_fit_illustration": true
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"
     ],
     "row": "routes",
     "width": "78%",
     "text_ref": "普通页：截图、网页图、普通扫描件"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "row": "routes-bottom",
     "text_ref": "难页：快读后体检不过关（一个字没读出来、把握分偏低、读出",
     "width": "50%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "row": "routes-bottom",
     "text_ref": "要还原结构：表格变成行列，认公式和印章，给每块区域坐标",
     "width": "50%"
    },
    {
     "type": "notice",
     "text_ref": "体检的完整门槛见亮点：先快后强；全部模型见用的哪些模型。"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上毛笔艺术字标题加绿色笔刷线。画面左边约 22% 宽一幅水彩插画：一叠纸（一张手机截图、一张扫描讲义、一张带表格的单据）走进一个听诊器形状的“体检”小站。从左往右是一张选路图：一条绿色主路从纸堆出发，先到第一张大卡片“普通页”（图标：闪电），这条路画成实线最粗；从体检小站分出一条向下弯的绿色支路，标小字“体检不过关的那一页”，通向第二张大卡片“难页”（图标：望远镜）；纸堆上方另有一条细虚线支路，标小字“明说要结构”，通向第三张大卡片“要还原结构”（图标：表格网格）。三张卡片从上到下排在画面右侧约 75% 宽里，每张卡片左边是粗体卡片标题和括号说明，右边是一个浅绿底的圆角模型名条（写“→ 快读：……”那一行），下面一两行正文。三张卡片宽高一致、间距一致，不留空格子。最下面一条横跨整屏的细卡片放最后一句，两个〔〕画成白底细浅绿描边的圆角按钮。三个图标和第 6 屏“用的哪些模型”表格里的图标保持同一画法。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\n2026-10-04 空白专查追加（AI实施；本人本轮明确授权重排）：主图只旁置第一条普通页说明；难页/结构还原两条独立移下方双列，不让左图陪三条长纵链。 定稿和素材原件不改。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "什么材料走哪条路"
    },
    {
     "type": "illustration"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"
     ],
     "row": "routes",
     "width": "78%",
     "text_ref": "普通页：截图、网页图、普通扫描件"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "row": "routes",
     "text_ref": "难页：快读后体检不过关（一个字没读出来、把握分偏低、读出"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "row": "routes",
     "text_ref": "要还原结构：表格变成行列，认公式和印章，给每块区域坐标"
    },
    {
     "type": "notice",
     "text_ref": "体检的完整门槛见亮点：先快后强；全部模型见用的哪些模型。"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；插画缩成一行宽在上；三张卡片上下排、各占满宽，卡片之间用一段向下的绿色箭头连起来（第二段箭头旁写“体检不过关的那一页”，通向第三张的箭头画成虚线，旁写“明说要结构”）；每张卡片里先标题，再模型名条，再正文；最下面两个按钮上下各一行。字和横版完全一样。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "key": "照片堆",
   "source_phrase": "普通页：截图、网页图、普通扫描件 \n→快读：PP-OCRv6_medium（检测、识别各一个模型）\n默认先走这条。模型热着一页约2秒，每行字给一个0–1的把握分。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": " \n难页：快读后体检不过关（一个字没读出来、把握分偏低、读出∑∫这类公式符号、带横竖线的表格）\n→只把这一页交给强模型：PaddleOCR-VL-1.6＋PP-DocLayoutV3版面检测\n用于读表格、公式、多栏等难页，读不准的仍要核对；首次加载加识别约50秒、内存约16GB，所以只给有问题的页，快读结果留着对照。已知是多栏论文、公式很多的文档，直接说“用强模型”。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "要还原结构：表格变成行列，认公式和印章，给每块区域坐标 \n→结构还原：PP-StructureV3（内部识字用PP-OCRv5，另有表格、公式PP-FormulaNet_plus-L、印章模型）\n只在明确说要结构时走，不参与自动选择；真实材料上还没用过，只在项目自带的样例上跑过。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "key": "照片堆",
   "source_phrase": "普通页：截图、网页图、普通扫描件 \n→快读：PP-OCRv6_medium（检测、识别各一个模型）\n默认先走这条。模型热着一页约2秒，每行字给一个0–1的把握分。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": " \n难页：快读后体检不过关（一个字没读出来、把握分偏低、读出∑∫这类公式符号、带横竖线的表格）\n→只把这一页交给强模型：PaddleOCR-VL-1.6＋PP-DocLayoutV3版面检测\n用于读表格、公式、多栏等难页，读不准的仍要核对；首次加载加识别约50秒、内存约16GB，所以只给有问题的页，快读结果留着对照。已知是多栏论文、公式很多的文档，直接说“用强模型”。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": "要还原结构：表格变成行列，认公式和印章，给每块区域坐标 \n→结构还原：PP-StructureV3（内部识字用PP-OCRv5，另有表格、公式PP-FormulaNet_plus-L、印章模型）\n只在明确说要结构时走，不参与自动选择；真实材料上还没用过，只在项目自带的样例上跑过。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/识别纸张通用构图.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "识别纸张通用构图",
   "source_phrase": "画面左边约 22% 宽一幅水彩插画：一叠纸（一张手机截图、一张扫描讲义、一张带表格的单据）走进一个听诊器形状的“体检”小站。",
   "sha256": "f9df63d5f9169507df5d49cc657a281a8cf6f4a6c22bd301d70545b1e78f3991",
   "status": "ready",
   "original_elements": [
    "一叠纸（一张手机截图、一张扫描讲义、一张带表格的单据）走进一个听诊器形状的抽象图形小站"
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
   "asset": "_library/round3/titles/title-836e7102d7fd69c05c88.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-836e7102d7fd69c05c88",
   "title_text": "什么材料走哪条路",
   "sha256": "77ee80bd350f23df230cb7092b7623d3f6838357e083fd6974942b9529d0a335",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 什么材料走哪条路

**普通页：截图、网页图、普通扫描件**
→ 快读：PP-OCRv6_medium（检测、识别各一个模型）
默认先走这条。模型热着一页约 2 秒，每行字给一个 0–1 的把握分。

**难页：快读后体检不过关**（一个字没读出来、把握分偏低、读出 ∑ ∫ 这类公式符号、带横竖线的表格）
→ 只把这一页交给强模型：PaddleOCR-VL-1.6 ＋ PP-DocLayoutV3 版面检测
用于读表格、公式、多栏等难页，读不准的仍要核对；首次加载加识别约 50 秒、内存约 16 GB，所以只给有问题的页，快读结果留着对照。已知是多栏论文、公式很多的文档，直接说“用强模型”。

**要还原结构：表格变成行列，认公式和印章，给每块区域坐标**
→ 结构还原：PP-StructureV3（内部识字用 PP-OCRv5，另有表格、公式 PP-FormulaNet_plus-L、印章模型）
只在明确说要结构时走，不参与自动选择；真实材料上还没用过，只在项目自带的样例上跑过。

体检的完整门槛见〔亮点：先快后强〕；全部模型见〔用的哪些模型〕。

::screen{#localocr-02 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-02",
  "section": "usage",
  "title": "平时怎么用",
  "scene": "横版：左上标题，下面一行说明文字（含一个链接）。三张竖向大卡片横排，每张上面一幅小水彩插画（1 手机截图叠成一摞，2 一本 16 页的扫描讲义，只有其中一页被绿色荧光笔圈起来，3 相册网格里几张截图，屏幕上的字被放大镜照着），插画下面卡片标题粗体，下面正文。最下面一条细横条放一句话。",
  "portrait": "竖版：标题、说明在上；三张卡片上下排，每张插画在左、字在右；最下面横条。",
  "links": [
   {
    "text": "跟 AI 怎么说 → 技能页",
    "href": "/skills/localocr/"
   },
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
     "align": "center",
     "size": "large",
     "text_ref": "平时怎么用"
    },
    {
     "type": "prose",
     "text_ref": "我一般不直接开它，而是跟AI说要读什么，AI判断该不该用"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "usage",
     "width": "33.333%",
     "text_ref": "1一字不差抄截图",
     "whole_block": true,
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "usage",
     "width": "33.333%",
     "text_ref": "2扫描讲义转文字",
     "whole_block": true,
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "usage",
     "width": "33.333%",
     "text_ref": "3整理照片时读屏幕上的字",
     "whole_block": true,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题，下面一行说明文字（含一个链接）。三张竖向大卡片横排，每张上面一幅小水彩插画（1 手机截图叠成一摞，2 一本 16 页的扫描讲义，只有其中一页被绿色荧光笔圈起来，3 相册网格里几张截图，屏幕上的字被放大镜照着），插画下面卡片标题粗体，下面正文。最下面一条细横条放一句话。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。 页修复 07（北京时间 2026-10-03）：按 qa-07 第2条电脑三张用法卡改用已有 left_inside，保留三列和原节点；重复内卡根因仍交 main。；图审回读仍嵌套步骤内卡：改用已有source_text_card单steps卡头+完整para正文接口，显式图标只显示一次，无新组件/新字。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "平时怎么用"
    },
    {
     "type": "prose",
     "text_ref": "我一般不直接开它，而是跟AI说要读什么，AI判断该不该用"
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "usage",
     "width": "33.333%",
     "text_ref": "1一字不差抄截图",
     "whole_block": true,
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "usage",
     "width": "33.333%",
     "text_ref": "2扫描讲义转文字",
     "whole_block": true,
     "icon_position": "header_left",
     "header_icon": [
      "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png"
     ]
    },
    {
     "type": "source_text_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "none",
     "row": "usage",
     "width": "33.333%",
     "text_ref": "3整理照片时读屏幕上的字",
     "whole_block": true,
     "icon_position": "header_left",
     "header_icon": [
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ]
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题、说明在上；三张卡片上下排，每张插画在左、字在右；最下面横条。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；图审回读仍嵌套步骤内卡：改用已有source_text_card单steps卡头+完整para正文接口，显式图标只显示一次，无新组件/新字。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n1一字不差抄截图\n一批截图要一字不差时，AI交给它读。模型热着时一张截图约2秒；结果带每行字的位置和把握分；有字块把握分低于0.50时，结果会标“置信度较低”，AI据此回原图核对。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n1一字不差抄截图\n一批截图要一字不差时，AI交给它读。模型热着时一张截图约2秒；结果带每行字的位置和把握分；有字块把握分低于0.50时，结果会标“置信度较低”，AI据此回原图核对。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n2扫描讲义转文字\n整份扫描讲义要转成文字时，每页先快读，哪一页读得差、或者像表格公式，只把那一页交给强模型（怎么判断见亮点）。交回全文时，AI会说清哪几页换过模型、哪几页把握不高。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n2扫描讲义转文字\n整份扫描讲义要转成文字时，每页先快读，哪一页读得差、或者像表格公式，只把那一页交给强模型（怎么判断见亮点）。交回全文时，AI会说清哪几页换过模型、哪几页把握不高。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": " \n3整理照片时读屏幕上的字\n照片视频录音管理整理截图时，画面由AI自己看，屏幕上的字交给它逐字读；读出的字只作参考，不作为删图的理由。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": " \n3整理照片时读屏幕上的字\n照片视频录音管理整理截图时，画面由AI自己看，屏幕上的字交给它逐字读；读出的字只作参考，不作为删图的理由。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n1一字不差抄截图\n一批截图要一字不差时，AI交给它读。模型热着时一张截图约2秒；结果带每行字的位置和把握分；有字块把握分低于0.50时，结果会标“置信度较低”，AI据此回原图核对。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n1一字不差抄截图\n一批截图要一字不差时，AI交给它读。模型热着时一张截图约2秒；结果带每行字的位置和把握分；有字块把握分低于0.50时，结果会标“置信度较低”，AI据此回原图核对。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n2扫描讲义转文字\n整份扫描讲义要转成文字时，每页先快读，哪一页读得差、或者像表格公式，只把那一页交给强模型（怎么判断见亮点）。交回全文时，AI会说清哪几页换过模型、哪几页把握不高。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-7a6ac71307734801d4b7.png",
   "fallback": false,
   "key": "双机器人",
   "source_phrase": " \n2扫描讲义转文字\n整份扫描讲义要转成文字时，每页先快读，哪一页读得差、或者像表格公式，只把那一页交给强模型（怎么判断见亮点）。交回全文时，AI会说清哪几页换过模型、哪几页把握不高。",
   "sha256": "24ebab9dc3aba20253c9649452a6cad0693cdbd2bfd29e69f06e07dd2f5dde30",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": " \n3整理照片时读屏幕上的字\n照片视频录音管理整理截图时，画面由AI自己看，屏幕上的字交给它逐字读；读出的字只作参考，不作为删图的理由。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "key": "文件核验",
   "source_phrase": " \n3整理照片时读屏幕上的字\n照片视频录音管理整理截图时，画面由AI自己看，屏幕上的字交给它逐字读；读出的字只作参考，不作为删图的理由。",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "手机照片现图小槽4比3",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅小水彩插画（1 手机截图叠成一摞，2 一本 16 页的扫描讲义，只有其中一页被绿色荧光笔圈起来，3 相册网格里几张截图，屏幕上的字被放大镜照着），插画下面卡片标题粗体，下面正文。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "手机截图叠成一摞"
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
   "asset": "_library/illustrations/ill-c8b9869aab61ad.png",
   "fallback": false,
   "semantic_status": "matched_existing_objects",
   "key": "ill-c8b9869aab61ad",
   "source_phrase": "三张竖向大卡片横排，每张上面一幅小水彩插画（1 手机截图叠成一摞，2 一本 16 页的扫描讲义，只有其中一页被绿色荧光笔圈起来，3 相册网格里几张截图，屏幕上的字被放大镜照着），插画下面卡片标题粗体，下面正文。",
   "sha256": "28708e9a68b4fa19329c1899898d6dd4e3e973d0c20a0fdce8dab5d0332bf6ff",
   "status": "ready",
   "original_elements": [
    "一本 16 页的扫描讲义，只有其中一页被绿色荧光笔圈起来"
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
   "source_phrase": "三张竖向大卡片横排，每张上面一幅小水彩插画（1 手机截图叠成一摞，2 一本 16 页的扫描讲义，只有其中一页被绿色荧光笔圈起来，3 相册网格里几张截图，屏幕上的字被放大镜照着），插画下面卡片标题粗体，下面正文。",
   "sha256": "2f2e7ce709a4936fd3ce41f5e643c012ed98b5dda9eea2b2a990721902d62783",
   "status": "ready",
   "original_elements": [
    "相册网格里几张截图，屏幕上的字被放大镜照着"
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

## 平时怎么用
我一般不直接开它，而是跟 AI 说要读什么，AI 判断该不该用它、再调它；也可以把文件拖到 start.bat 上，结果在 outputs 文件夹。怎么跟 AI 说、什么时候 AI 自己看就够：〔跟 AI 怎么说 → 技能页〕

1. **一字不差抄截图**
一批截图要一字不差时，AI 交给它读。模型热着时一张截图约 2 秒；结果带每行字的位置和把握分；有字块把握分低于 0.50 时，结果会标“置信度较低”，AI 据此回原图核对。

2. **扫描讲义转文字**
整份扫描讲义要转成文字时，每页先快读，哪一页读得差、或者像表格公式，只把那一页交给强模型（怎么判断见亮点）。交回全文时，AI 会说清哪几页换过模型、哪几页把握不高。

3. **整理照片时读屏幕上的字**
〔照片视频录音管理〕整理截图时，画面由 AI 自己看，屏幕上的字交给它逐字读；读出的字只作参考，不作为删图的理由。

::screen{#localocr-03 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-03",
  "section": "usage",
  "title": "读出来是什么样",
  "scene": "横版：左上标题。上半部分左右两个带细浅绿边框的空位（各约占宽度 40%，4:3 左右），中间一个绿色箭头从左指向右；左空位贴原图截图，右空位贴识别输出截图；每个空位下面一行小字说明。下半部分一排三张小卡片（TXT、MD、JSON 各一个小文件图标），右边一张稍宽的浅黄底便签卡，上面写“人话摘要”那一句。空位里什么都不画。",
  "portrait": "竖版：标题；原图空位、向下箭头、输出空位上下排，各带说明；三张文件卡一行一张；摘要便签在最下面。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/4fbf3d65137840ceecba3c516856412760303c96230389ae5bcc63f5c6caf4fe.webp",
    "where": "上半部分左边的空位",
    "caption": "原图：项目自带的合成采购单（900×600），有标题、六列表格、五条商品和合计。",
    "frame_bindings": {
     "h": {
      "27E99DFB1CF5BF828BA68AF4DD19C6F94966C1203BF9693DE2DDE832B6812887": [
       48,
       113,
       766,
       448
      ]
     },
     "v": {
      "1FBE9402EFBFB1F6358C71982EF5DB7697174E090905B0485D4AF5831E1F68AB": [
       49,
       141,
       850,
       682
      ]
     }
    },
    "crop_h": [
     0,
     27,
     900,
     442
    ]
   },
   {
    "file": "sources/assets/_references/c0efe539bcea67b32b891321fdb3f0c531600a3d728c30d6e2072277338719c5.webp",
    "where": "上半部分右边的空位",
    "caption": "9 月 3 日本机实际输出（结构还原路线）：六列、五行和合计都对；原图标题没进正文，原始文字行把标题里的编号 PO-2026-0712 读成了 P0-2026-0712。如实保留，不修饰成全对。",
    "frame_bindings": {
     "h": {
      "27E99DFB1CF5BF828BA68AF4DD19C6F94966C1203BF9693DE2DDE832B6812887": [
       900,
       105,
       1626,
       448
      ]
     },
     "v": {
      "1FBE9402EFBFB1F6358C71982EF5DB7697174E090905B0485D4AF5831E1F68AB": [
       49,
       887,
       850,
       1442
      ]
     }
    },
    "crop_h": [
     25,
     160,
     1054,
     640
    ]
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
     "align": "center",
     "size": "large",
     "text_ref": "读出来是什么样"
    },
    {
     "type": "screenshot",
     "indices": [
      0,
      1
     ],
     "columns": 2,
     "columns_v": 1,
     "ratio": "3:2",
     "caption_mode": "source_order",
     "connector": "arrow",
     "text_ref": "原图：项目自带的合成采购单（900×600），有标题、六"
    },
    {
     "type": "prose",
     "text_ref": "每次识别写出三份结果："
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "TXT纯文字，按页分开"
    },
    {
     "type": "notice",
     "text_ref": "另附一份客观结论和一句人话摘要，例如这张图的摘要："
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题。上半部分左右两个带细浅绿边框的空位（各约占宽度 40%，4:3 左右），中间一个绿色箭头从左指向右；左空位贴原图截图，右空位贴识别输出截图；每个空位下面一行小字说明。下半部分一排三张小卡片（TXT、MD、JSON 各一个小文件图标），右边一张稍宽的浅黄底便签卡，上面写“人话摘要”那一句。空位里什么都不画。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。 页修复 07（北京时间 2026-10-03）：接入既有 comp-slots/page-agent-t05-shot-response：两槽与各自原图注由同一截图块按 source_order 承接，横两列、竖一列、箭头连接；只合并规格分块，不删图注、不把截图写进浅色留空框。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "读出来是什么样"
    },
    {
     "type": "screenshot",
     "indices": [
      0,
      1
     ],
     "columns": 2,
     "columns_v": 1,
     "ratio": "3:2",
     "caption_mode": "source_order",
     "connector": "arrow",
     "text_ref": "原图：项目自带的合成采购单（900×600），有标题、六"
    },
    {
     "type": "prose",
     "text_ref": "每次识别写出三份结果："
    },
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "TXT纯文字，按页分开"
    },
    {
     "type": "notice",
     "text_ref": "另附一份客观结论和一句人话摘要，例如这张图的摘要："
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；原图空位、向下箭头、输出空位上下排，各带说明；三张文件卡一行一张；摘要便签在最下面。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。 页修复 07（北京时间 2026-10-03）：接入既有 comp-slots/page-agent-t05-shot-response：两槽与各自原图注由同一截图块按 source_order 承接，横两列、竖一列、箭头连接；只合并规格分块，不删图注、不把截图写进浅色留空框。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "TXT 纯文字，按页分开\n",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "Markdown 保留标题层级，表格、公式留结构\n",
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
   "key": "灯泡",
   "source_phrase": "JSON 每块字的位置框、把握分、阅读顺序和类型\n",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "TXT 纯文字，按页分开\n",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "key": "灯泡",
   "source_phrase": "Markdown 保留标题层级，表格、公式留结构\n",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "key": "灯泡",
   "source_phrase": "JSON 每块字的位置框、把握分、阅读顺序和类型\n",
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
   "asset": "_library/titles/title-84a305beb3019ba74f7a.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\localocr\\img\\localocr-03-h.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-84a305beb3019ba74f7a",
   "title_text": "读出来是什么样",
   "sha256": "e39e6eb2e4d24712abd49e6b6b74b61f6bf504bda3b6618302ee406a96ea5cc6",
   "status": "ready",
   "source_box": [
    40,
    12,
    586,
    150
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 读出来是什么样

原图：项目自带的合成采购单（900×600），有标题、六列表格、五条商品和合计。
9 月 3 日本机实际输出（结构还原路线）：六列、五行和合计都对；原图标题没进正文，原始文字行把标题里的编号 PO-2026-0712 读成了 P0-2026-0712。如实保留，不修饰成全对。

每次识别写出三份结果：
**TXT**｜纯文字，按页分开
**Markdown**｜保留标题层级，表格、公式留结构
**JSON**｜每块字的位置框、把握分、阅读顺序和类型

另附一份客观结论和一句人话摘要，例如这张图的摘要：
“识别完成：检测到 2 个文字块；覆盖完整；质量未知；未触发自动升级。”
结构还原把整张表算作一块、合计算一块，所以是 2 个文字块；这条路线不给把握分，质量只能写“未知”，不是出错。

::screen{#localocr-04 section="usage"}

```typeset
{
 "screen": {
  "id": "localocr-04",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版：左上标题，下面一行小字。七张横向小卡片排成两列（左四右三），每张左边一个小水彩图标（红灯的排队牌、沙漏、停止按钮、显卡递给另一只手、一半的纸、搬家纸箱、放大镜对着原图），右边粗体一句加小字。右列第四个位置放一张浅绿底提示卡，写最后一句话。",
  "portrait": "竖版：标题、小字；七张卡片一行一张；提示卡在最下面。",
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
     "text_ref": "出事怎么办"
    },
    {
     "type": "prose",
     "text_ref": "它没有自动提醒；出了问题直接跟AI说，AI按下面的办法处"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "正忙同时只做一个识别。再交一份，会直接回“有任务在跑”和"
    },
    {
     "type": "notice",
     "text_ref": "把握分高也不等于每个字都对：关键的小字、淡字，回原图看一"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题，下面一行小字。七张横向小卡片排成两列（左四右三），每张左边一个小水彩图标（红灯的排队牌、沙漏、停止按钮、显卡递给另一只手、一半的纸、搬家纸箱、放大镜对着原图），右边粗体一句加小字。右列第四个位置放一张浅绿底提示卡，写最后一句话。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "出事怎么办"
    },
    {
     "type": "prose",
     "text_ref": "它没有自动提醒；出了问题直接跟AI说，AI按下面的办法处"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "正忙同时只做一个识别。再交一份，会直接回“有任务在跑”和"
    },
    {
     "type": "notice",
     "text_ref": "把握分高也不等于每个字都对：关键的小字、淡字，回原图看一"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题、小字；七张卡片一行一张；提示卡在最下面。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "source_phrase": "红灯的排队牌",
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
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "沙漏",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
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
   "source_phrase": "停止按钮",
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
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显卡",
   "source_phrase": "显卡递给另一只手",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一半的纸",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "搬家纸箱",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜对着原图",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
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

## 出事怎么办
它没有自动提醒；出了问题直接跟 AI 说，AI 按下面的办法处理。

**正忙**｜同时只做一个识别。再交一份，会直接回“有任务在跑”和任务编号，不偷偷排队；AI 先查进度，不重复提交。
**太久**｜一次默认最多 300 秒，长任务可放宽到 2 小时；超时连同子进程一起结束，显卡还回去。AI 那边等不及先断开，不等于识别失败，先按任务编号回查。
**想停**｜按任务编号只取消这一项，不影响别的服务；取消后不自动重试。
**显卡要给别人**｜说“识别完把显卡腾出来”。另外，电脑上有个显卡调度员（电脑配置与恢复里的本机小服务：谁要用显卡，先向它领一张限时许可，也就是“租约”；它决定谁能同时用、谁要等）。本地大模型要用显卡时，它会先把文字识别清走。
**批量里中途有一份出错**｜整次照样报失败，但前面已经做完的结果会跟着失败一起交回，并写明卡在哪一份、后面哪些还没做；不用整批重来（10 月 16 日起）。
**强模型重读失败**｜快读的结果单独存成“部分结果”，照样报失败，不当完成。
**换电脑**｜模型和运行环境不进备份，按登记从魔搭重下、重建环境，再跑一遍验收。

把握分高也不等于每个字都对：关键的小字、淡字，回原图看一眼。

::screen{#localocr-05 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-05",
  "section": "tech",
  "title": "一次识别经过哪几步",
  "scene": "横版：左上标题。一条从左到右的流程图，六个圆角节点（小水彩图标：带锁的文件副本、领号牌、一叠纸被切成一页页、闪电、听诊器、三份文件），绿色箭头依次相连，节点下面一两行小字；第 5 个节点和第 4 个之间多画一条向下弯的细支线，通向一个小一点的“强模型”节点再回到第 6 个。流程图下面两张横向小卡片并排。",
  "portrait": "竖版：标题；六个节点从上往下排，箭头向下，强模型支线画在第 5 个节点右侧；两张小卡片上下排。",
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
     "text_ref": "一次识别经过哪几步"
    },
    {
     "type": "flow",
     "columns": 6,
     "direction": "horizontal",
     "illustration": "above_card",
     "icons": "auto",
     "connector": "arrow",
     "branch_after": 5,
     "branch_return": 6,
     "text_ref": "1先留底算原件的内容指纹（SHA-256），复制一份只读"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "识过不重识同一份材料、同样的请求再来，先核对原件、模型、"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题。一条从左到右的流程图，六个圆角节点（小水彩图标：带锁的文件副本、领号牌、一叠纸被切成一页页、闪电、听诊器、三份文件），绿色箭头依次相连，节点下面一两行小字；第 5 个节点和第 4 个之间多画一条向下弯的细支线，通向一个小一点的“强模型”节点再回到第 6 个。流程图下面两张横向小卡片并排。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一次识别经过哪几步"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "illustration": "left_inside",
     "icons": "auto",
     "connector": "arrow",
     "branch_after": 5,
     "branch_return": 6,
     "text_ref": "1先留底算原件的内容指纹（SHA-256），复制一份只读"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "识过不重识同一份材料、同样的请求再来，先核对原件、模型、"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；六个节点从上往下排，箭头向下，强模型支线画在第 5 个节点右侧；两张小卡片上下排。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "source_phrase": "一条向下弯的细支线，通向一个小一点的“强模型”节点再回到第 6 个",
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
   "source_phrase": "",
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
   "slot_ordinal": 7,
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
   "asset": "_library/titles/title-3df730e1229eed07fb1c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-3df730e1229eed07fb1c",
   "title_text": "一次识别经过哪几步",
   "sha256": "17e8c530089ace8ae5c2d0631f6509873a0c9e4e86bab6534df94796aea8120d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 一次识别经过哪几步

1. **先留底**｜算原件的内容指纹（SHA-256），复制一份只读快照来识别；识别完再核一次，原件中途被改就不发结果。
2. **领显卡**｜向显卡调度员领租约，领到才加载模型。
3. **拆页**｜PDF 按 216 DPI 逐页渲染成图（单页最多 2400 万像素），多页 TIFF 逐帧拆开；图片直接读。
4. **快读**｜每页先用 PP-OCRv6 读，每行字附一个 0–1 的把握分。
5. **逐页体检**｜不过关的页交给 PaddleOCR-VL-1.6 重读，快读结果照样留着对照（规则见亮点）。
6. **交结果**｜写出三份结果、客观结论和人话摘要；最后写完任务记录才算完成。

**识过不重识**｜同一份材料、同样的请求再来，先核对原件、模型、配置和输出文件的指纹，都对得上才直接交上次的结果；换了模型不会误用旧结果。
**要表格结构时**｜明确说要表格、公式、印章或区域坐标，走 PP-StructureV3 这条路；它不参与自动选择。

::screen{#localocr-06 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-06",
  "section": "tech",
  "title": "用的哪些模型",
  "scene": "横版：左上标题。一张五行四列的表格（圆角、细浅绿线、表头浅绿底），每行最左边一个小水彩图标（闪电、旋转箭头、望远镜、表格网格、被熨平的纸）。表格下面一条横跨整屏的细卡片放最后两句话，右端画魔搭的小标志（抽象魔方图形，不写英文商标字）。",
  "portrait": "竖版：标题；每行模型改成一张卡片（第一行粗体用途，下面三行：模型、做什么、为什么），五张上下排；底部细卡片。",
  "links": [],
  "anchors": [
   {
    "id": "models",
    "text": "用的哪些模型"
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
     "align": "center",
     "size": "large",
     "text_ref": "用的哪些模型"
    },
    {
     "type": "table",
     "columns": 4,
     "portrait_layout": "row_cards",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用途模型做什么为什么这样选日常识字PP-OCRv6med"
    },
    {
     "type": "notice",
     "text_ref": "全部是百度飞桨的模型，从ModelScope魔搭下载（国"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题。一张五行四列的表格（圆角、细浅绿线、表头浅绿底），每行最左边一个小水彩图标（闪电、旋转箭头、望远镜、表格网格、被熨平的纸）。表格下面一条横跨整屏的细卡片放最后两句话，右端画魔搭的小标志（抽象魔方图形，不写英文商标字）。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "用的哪些模型"
    },
    {
     "type": "table",
     "columns": 4,
     "portrait_layout": "row_cards",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "用途模型做什么为什么这样选日常识字PP-OCRv6med"
    },
    {
     "type": "notice",
     "text_ref": "全部是百度飞桨的模型，从ModelScope魔搭下载（国"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；每行模型改成一张卡片（第一行粗体用途，下面三行：模型、做什么、为什么），五张上下排；底部细卡片。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "source_phrase": "闪电",
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
   "asset": "_library/fix-round-2/icon-clean-6eb649eb04de5b696e76.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿色箭头",
   "source_phrase": "旋转箭头",
   "sha256": "017a3e9b325d6fbe67b330c9f3e1a0df2fb40ea3315c9820879a309d577c1b07",
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
   "source_phrase": "望远镜",
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
   "source_phrase": "表格网格",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "被熨平的纸",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-bb35286273c0e9b2518a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bb35286273c0e9b2518a",
   "title_text": "用的哪些模型",
   "sha256": "a6cbd322cc64ff90d6b6c5e85e8e8aba76d3418ade99dc9770c0c7bb191ee081",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 用的哪些模型

| 用途 | 模型 | 做什么 | 为什么这样选 |
|---|---|---|---|
| 日常识字 | PP-OCRv6 medium（检测、识别各一个模型） | 先框出每行字，再逐行认字，每行给把握分 | 精度和速度的折中：不用手机版小模型，也不用旧版；截图、网页图、普通扫描件都靠它 |
| 转正方向 | PP-LCNet 两个小模型 | 判断整页和每行字是不是横着、倒着 | 拍歪、扫倒的页先转正再读 |
| 难页重读 | PaddleOCR-VL-1.6（视觉语言模型，约 1.9 GB）＋ PP-DocLayoutV3 版面检测 | 看懂整页版面，表格、公式、多栏都读得好 | 读得好但慢：首次加载加识别约 50 秒，工作进程内存约 16 GB，所以只给有问题的页 |
| 结构还原 | PP-StructureV3：版面 2 个、识字 PP-OCRv5 2 个、表格 5 个、公式 PP-FormulaNet 1 个、印章 1 个 | 表格还原成行列，认公式和印章，给每块区域坐标 | 只在明确要结构时用；它不支持 v6，所以内部用 v5 |
| 纸张摊平 | UVDoc | 把拍弯的纸“摊平” | 只给强模型和结构还原用；日常识字关掉（见亮点） |

全部是百度飞桨的模型，从 ModelScope 魔搭下载（国内直连约 25 MB/s），共 18 个、3.9 GiB，下载后离线运行。用哪个模型写在一个配置文件里，换模型不改代码。

AI 自己也能看图，说个大意没问题；可要一字不差抄下扫描讲义、参数表或几十张截图，它会漏字、猜字，还说不清哪里没看清。这个项目用百度飞桨的文字识别模型在本机离线识字：每页先用快模型（PP-OCRv6_medium）读，只把读得不好、或看得出是表格公式的那几页交给强模型（PaddleOCR-VL-1.6）重读；要把表格还原成行列，明说就走结构还原（PP-StructureV3）；每份结果写明“有字”“没字”还是“说不准”。识字这一步不联网，图片不传到任何识别网站。

::screen{#localocr-07 section="tech"}

```typeset
{
 "screen": {
  "id": "localocr-07",
  "section": "tech",
  "title": "跑在哪、怎么不打架",
  "scene": "横版：左上标题。左边约 40% 宽一幅水彩示意图：一个 Windows 窗口里套着一个小企鹅图标的 Linux 盒子（WSL2），盒子里一个小服务器图标，下面一块显卡，显卡旁一个戴帽子的“调度员”小人，手里三张号牌：“文字识别”“语音转写”（两张并排都亮）、“本地大模型”（单独、灰着）。右边约 60% 宽五张横向小卡片上下排，每张粗体一句加小字。最下面一行灰色小字。",
  "portrait": "竖版：标题；示意图占满宽；五张卡片一行一张；灰色小字在最下面。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
   },
   {
    "text": "电脑配置与恢复",
    "href": "/projects/pcconfig/"
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
     "text_ref": "跑在哪、怎么不打架",
     "row": "balanced-heading",
     "width": "88%",
     "row_fit_illustration": true
    },
    {
     "type": "illustration",
     "asset": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-assets\\_library\\illustrations\\main-localocr.png",
     "target_height": 430,
     "target_width": 523,
     "align": "center",
     "row": "balanced-heading",
     "width": "12%"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-a9b00cda4f2ae87d4b1f.png",
      "_library/icons/公文包清单.png"
     ],
     "text_ref": "为什么在Linux里跑这台电脑是RTX5090D（新一代"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"
     ],
     "text_ref": "一块显卡",
     "last_full_width": true
    },
    {
     "type": "prose",
     "text_ref": "10 月 20 日早上服务没在监听"
    },
    {
     "type": "prose",
     "text_ref": "代码：6,903行程序（Python、PowerShel"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题。左边约 40% 宽一幅水彩示意图：一个 Windows 窗口里套着一个小企鹅图标的 Linux 盒子（WSL2），盒子里一个小服务器图标，下面一块显卡，显卡旁一个戴帽子的“调度员”小人，手里三张号牌：“文字识别”“语音转写”（两张并排都亮）、“本地大模型”（单独、灰着）。右边约 60% 宽五张横向小卡片上下排，每张粗体一句加小字。最下面一行灰色小字。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。\n2026-10-04 大空白专查（AI实施；本人本轮明确授权重排）：主图与前两条说明组成30/70上栏，其余三条整宽三列，五条原文和五幅图按原序保留。 仅更改单页排版规格，不改定稿字句和素材文件。\n插画实际复验：target_height与target_width按素材完整自然比例成对设置，不把单独max-height压成扁图；原图字节不变。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "跑在哪、怎么不打架"
    },
    {
     "type": "illustration",
     "row": "runtime",
     "width": "40%",
     "asset": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\claude-gate-1001\\typeset-assets\\_library\\illustrations\\main-localocr.png"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-a9b00cda4f2ae87d4b1f.png",
      "_library/icons/公文包清单.png",
      "_library/icons/文稿堆.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png"
     ],
     "row": "runtime",
     "width": "60%",
     "text_ref": "为什么在Linux里跑这台电脑是RTX5090D（新一代"
    },
    {
     "type": "prose",
     "text_ref": "10 月 20 日早上服务没在监听"
    },
    {
     "type": "prose",
     "text_ref": "代码：6,903行程序（Python、PowerShel"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；示意图占满宽；五张卡片一行一张；灰色小字在最下面。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "key": "显卡",
   "source_phrase": "为什么在 Linux 里跑 这台电脑是 RTX 5090 D（新一代 Blackwell 架构），Windows 版飞桨显卡版跑不起来；整套放进 WSL2（Windows 自带的 Linux）：Ubuntu 24.04、飞桨 3.4、CUDA 12.9、PaddleOCR 3.7。代价是 Windows 和 Linux 之间要转路径，中文、空格、拖放路径在 9 月 6 日、8 日、24 日都专门修过。\n",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/13-公文包清单-clean.png",
   "fallback": false,
   "key": "公文包清单",
   "source_phrase": "一个本机服务 FastAPI 写的接口，只在本机 18665 端口。接口本身不加载模型，模型在一个随时能结束的工作进程里：同一模型连着用就热着复用，换模型先关旧的再开新的，不让几套模型叠在内存里。\n",
   "sha256": "6c838cf1f00338d2d467304875ffcc24263ed89010212c4d382029d3e92434fa",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "一块显卡：两家可同时，大模型单用 文字识别和〔中文语音转写〕可以同时用显卡；本地大模型要用时，前两家都得让开。由〔电脑配置与恢复〕里的显卡调度员按租约分配。\n",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "key": "时钟",
   "source_phrase": "有上限 一次请求默认 300 秒、最多 2 小时；服务连同子进程内存上限 30 GB（不是显存），超了只停自己。\n",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "key": "红色警示",
   "source_phrase": "每天用的是验收过的一版 正式服务从快照运行，留当前版和上一版；新版要过依赖、181 项测试（无失败，16 项按条件跳过）、9 个合成样例的真实显卡识别三道验收才切换，退回上一版也要它自己的验收记录。\n",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "key": "显卡",
   "source_phrase": "为什么在 Linux 里跑 这台电脑是 RTX 5090 D（新一代 Blackwell 架构），Windows 版飞桨显卡版跑不起来；整套放进 WSL2（Windows 自带的 Linux）：Ubuntu 24.04、飞桨 3.4、CUDA 12.9、PaddleOCR 3.7。代价是 Windows 和 Linux 之间要转路径，中文、空格、拖放路径在 9 月 6 日、8 日、24 日都专门修过。\n",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/13-公文包清单-clean.png",
   "fallback": false,
   "key": "公文包清单",
   "source_phrase": "一个本机服务 FastAPI 写的接口，只在本机 18665 端口。接口本身不加载模型，模型在一个随时能结束的工作进程里：同一模型连着用就热着复用，换模型先关旧的再开新的，不让几套模型叠在内存里。\n",
   "sha256": "6c838cf1f00338d2d467304875ffcc24263ed89010212c4d382029d3e92434fa",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "v"
   ],
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "key": "文稿堆",
   "source_phrase": "一块显卡：两家可同时，大模型单用 文字识别和〔中文语音转写〕可以同时用显卡；本地大模型要用时，前两家都得让开。由〔电脑配置与恢复〕里的显卡调度员按租约分配。\n",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "key": "时钟",
   "source_phrase": "有上限 一次请求默认 300 秒、最多 2 小时；服务连同子进程内存上限 30 GB（不是显存），超了只停自己。\n",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "key": "红色警示",
   "source_phrase": "每天用的是验收过的一版 正式服务从快照运行，留当前版和上一版；新版要过依赖、181 项测试（无失败，16 项按条件跳过）、9 个合成样例的真实显卡识别三道验收才切换，退回上一版也要它自己的验收记录。\n",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
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
   "semantic_status": "final_gap_same_project_main_reuse",
   "key": "WSL服务与显卡结构图",
   "source_phrase": "横版：左上标题。左边约 40% 宽一幅水彩示意图：一个 Windows 窗口里套着一个小企鹅图标的 Linux 盒子（WSL2），盒子里一个小服务器图标，下面一块显卡，显卡旁一个戴帽子的“调度员”小人，手里三张号牌：“文字识别”“语音转写”（两张并排都亮）、“本地大模型”（单独、灰着）。右边约 60% 宽五张横向小卡片上下排，每张粗体一句加小字。最下面一行灰色小字。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "左边约 40% 宽一幅水彩示意图：一个 Windows 窗口里套着一个小企鹅图标的 Linux 盒子（WSL2），盒子里一个小服务器图标，下面一块显卡，显卡旁一个戴帽子的抽象图形小人，手里三张号牌：抽象图形抽象图形（两张并排都亮）、抽象图形（单独、灰着"
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
   "asset": "_library/round3/titles/title-r3-f255783c85c0e7082f7e.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\localocr\\img\\localocr-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f255783c85c0e7082f7e",
   "title_text": "跑在哪、怎么不打架",
   "sha256": "6b6eb440fb19d9d568f81ae7125ee9c161903063691425bf8e088769595e7e60",
   "status": "ready",
   "source_box": [
    29,
    14,
    680,
    157
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

## 跑在哪、怎么不打架

**为什么在 Linux 里跑**｜这台电脑是 RTX 5090 D（新一代 Blackwell 架构），Windows 版飞桨显卡版跑不起来；整套放进 WSL2（Windows 自带的 Linux）：Ubuntu 24.04、飞桨 3.4、CUDA 12.9、PaddleOCR 3.7。代价是 Windows 和 Linux 之间要转路径，中文、空格、拖放路径在 9 月 6 日、8 日、24 日都专门修过，10 月 14 日又修了临时路径参数和输出回传；9 月 24 日起路径交给 Ubuntu 自己换算，参数逐个原样传进去。
**一个本机服务**｜FastAPI 写的接口，只在本机 18665 端口；9 月 24 日起只认本机地址，别的网站想借浏览器调用它会被拒收，请求格式不对也拒收。接口本身不加载模型，模型在一个随时能结束的工作进程里：同一模型连着用就热着复用，换模型先关旧的再开新的，不让几套模型叠在内存里。
**一块显卡：两家可同时，大模型单用**｜文字识别和〔中文语音转写〕可以同时用显卡；本地大模型要用时，前两家都得让开。由〔电脑配置与恢复〕里的显卡调度员按租约分配。
**有上限**｜一次请求默认 300 秒、最多 2 小时；服务连同子进程内存上限 30 GB（不是显存），超了只停自己。10 月 12 日起还看整台电脑剩多少内存：模型启动前和运行中每 3 秒查一次，至少给整机留出总内存的 10%（不少于 1 GiB），不够就只结束本次识别、明确返回资源不足，不去挤别的程序；强模型也改成按需加载显卡模块，少占常驻内存。
**每天用的是验收过的一版**｜正式服务从快照运行，留当前版和上一版；新版要过依赖、单元测试、9 个合成样例的真实显卡识别三道验收才切换，退回上一版也要它自己的验收记录。现役快照是 WSL 里的 `/root/localocr-runtimes/batch-results-20261016`，10 月 16 日 12:29 验收：187 项测试无失败（17 项按条件跳过），9 个合成样例全过；上一版是 10 月 12 日验收的 `memory-fix-20261012-1522`。9 月 24 日的 `audit-fixes-20260924-01a0d3e3-final` 和 9 月 17 日的飞桨 3.4.0 版还留在目录里，但已不是当前版或上一版。9 月 17 日那一版从 Windows 入口真实走过一遍切换、回退和恢复；之后的版本，包括现役的 10 月 16 日版，都还没做过同样的演练。
**10 月 20 日早上服务没在监听**｜本轮取数时请求 `http://127.0.0.1:18665/health` 被拒绝连接（10 月 11 日 13:33 那次也一样），也就是当时本机识别服务没开着或连不上；原因没有查明，这次也没去启动它，不据此说模型、现役快照或识别能力坏了。需要时用 `start_server.ps1` 启动常驻服务。

代码：6,903 行程序（Python、PowerShell），4,801 行测试；公开仓库每次推送，GitHub 自动跑一遍不需要显卡的测试。

::screen{#localocr-08 section="highlights"}

```typeset
{
 "screen": {
  "id": "localocr-08",
  "section": "highlights",
  "title": "亮点：先快后强，只重读那一页",
  "scene": "横版：左上标题“亮点”，下面一张横跨整屏的大卡片。卡片左边约 35% 宽一幅水彩插画：一叠 16 页纸摊开成扇形，其中 15 页淡淡地打着绿勾，第 15 页被抽出来放在一台望远镜下面。卡片右边：粗体标题，下面“麻烦”“解法”“结果”“取舍”四段，每段开头两个字用绿色小标签；解法里的六条画成两列小清单，每条前面一个小听诊器图标。",
  "portrait": "竖版：标题；插画在上占满宽；四段上下排，六条清单一行一条。",
  "links": [],
  "anchors": [
   {
    "id": "fast-then-strong",
    "text": "先快后强，只重读有问题的那一页"
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
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "illustration",
     "row": "highlight",
     "width": "35%",
     "frame": "localocr-highlight",
     "row_fit_illustration": true
    },
    {
     "type": "section_heading",
     "row": "highlight",
     "width": "65%",
     "text_ref": "先快后强，只重读有问题的那一页",
     "frame": "localocr-highlight"
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "麻烦每页都用强模型最稳，但太慢：强模型首次加载加识别要5",
     "frame": "localocr-highlight"
    },
    {
     "type": "bullet_list",
     "columns": 2,
     "row": "highlight",
     "bare": true,
     "text_ref": "一个字都没读出来整页平均把握分低于0.78把握分低于0.",
     "frame": "localocr-highlight"
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "例外：近乎纯色、本来就像空白的页读不出字，不算“没读出来",
     "frame": "localocr-highlight"
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "结果7月8日–9月28日，自动选模型的300次里有277",
     "frame": "localocr-highlight"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题“亮点”，下面一张横跨整屏的大卡片。卡片左边约 35% 宽一幅水彩插画：一叠 16 页纸摊开成扇形，其中 15 页淡淡地打着绿勾，第 15 页被抽出来放在一台望远镜下面。卡片右边：粗体标题，下面“麻烦”“解法”“结果”“取舍”四段，每段开头两个字用绿色小标签；解法里的六条画成两列小清单，每条前面一个小听诊器图标。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "亮点"
    },
    {
     "type": "illustration",
     "row": "highlight",
     "width": "35%",
     "frame": "localocr-highlight"
    },
    {
     "type": "section_heading",
     "row": "highlight",
     "width": "65%",
     "text_ref": "先快后强，只重读有问题的那一页",
     "frame": "localocr-highlight"
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "麻烦每页都用强模型最稳，但太慢：强模型首次加载加识别要5",
     "frame": "localocr-highlight"
    },
    {
     "type": "bullet_list",
     "columns": 2,
     "row": "highlight",
     "bare": true,
     "text_ref": "一个字都没读出来整页平均把握分低于0.78把握分低于0.",
     "frame": "localocr-highlight"
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "例外：近乎纯色、本来就像空白的页读不出字，不算“没读出来",
     "frame": "localocr-highlight"
    },
    {
     "type": "prose",
     "row": "highlight",
     "text_ref": "结果7月8日–9月28日，自动选模型的300次里有277",
     "frame": "localocr-highlight"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；插画在上占满宽；四段上下排，六条清单一行一条。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "麻烦｜每页都用强模型最稳，但太慢：强模型首次加载加识别要 50 秒，内存约 16 GB；快模型热着一页约 2 秒。靠文件名猜哪份难，又常常猜错。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "解法｜每页先快读，再逐页体检，下面任一条成立，只把这一页交给强模型：",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
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
   "source_phrase": "一个字都没读出来",
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
   "source_phrase": "整页平均把握分低于 0.78",
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
   "asset": "_library/illustrations/文稿核验通用构图-bright-green-20261022.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文稿核验通用构图",
   "source_phrase": "卡片左边约 35% 宽一幅水彩插画：一叠 16 页纸摊开成扇形，其中 15 页淡淡地打着绿勾，第 15 页被抽出来放在一台望远镜下面。",
   "sha256": "5ab5d727ebd3989c5b1e52da63351021f9c6dfb0807578c5e82d78525913a406",
   "status": "ready",
   "original_elements": [
    "一叠 16 页纸摊开成扇形，其中 15 页淡淡地打着绿勾，第 15 页被抽出来放在一台望远镜下面"
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
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\localocr\\img\\localocr-08-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "30317b0c45077d07548237258c116d682fdfc22e75a08438b2426ea01e68f4b2",
   "status": "ready",
   "source_box": [
    25,
    0,
    273,
    212
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

## 亮点

### 先快后强，只重读有问题的那一页

**麻烦**｜每页都用强模型最稳，但太慢：强模型首次加载加识别要 50 秒，内存约 16 GB；快模型热着一页约 2 秒。靠文件名猜哪份难，又常常猜错。

**解法**｜每页先快读，再逐页体检，下面任一条成立，只把这一页交给强模型：
- 一个字都没读出来
- 整页平均把握分低于 0.78
- 把握分低于 0.80 的行占四分之一以上
- 把握分低于 0.50 的行占一成以上
- 读出了 ∑、∫ 这类公式符号
- 图上横线和竖线的交叉点有 6 个以上（带线的表格）
- 读出了字，却一个把握分都没有

例外：近乎纯色、本来就像空白的页读不出字，不算“没读出来”，不升级。

**结果**｜7 月 8 日–9 月 28 日，自动选模型的 300 次里有 277 次（92%）快模型就够。9 月 29 日进来一批 200 多张临时图片，字少、把握分低，大多换了强模型。算到 10 月 11 日，自动选模型共 639 次，快模型就够的占 60%。9 月 26 日一份 16 页的扫描 PDF，只有第 15 页被重读，其余 15 页保留快读结果。

**取舍**｜这是经验规则，不是真的看懂了版面，会漏判；已知是多栏论文、公式很多的文档，直接说用强模型。

::screen{#localocr-09 section="highlights"}

```typeset
{
 "screen": {
  "id": "localocr-09",
  "section": "highlights",
  "title": "亮点：三个小巧思",
  "scene": "横版：和照片视频录音管理页的“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面“麻烦”“解法”“证据”三段。插画：1 一张表格被拆成散落的小字块，旁边一个 99.99 分的满分徽章，一把尺子在找横竖线；2 一张空白纸旁边三个小牌子“有字”“没字”“说不准”，“说不准”那块亮着；3 一台熨斗悬在一张平整的手机截图上方，截图边缘被烫卷了一角。",
  "portrait": "竖版：三张卡片上下排，每张插画在上、字在下。",
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
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"
     ],
     "text_ref": "1.把握分很高，也可能读错表格"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：和照片视频录音管理页的“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面“麻烦”“解法”“证据”三段。插画：1 一张表格被拆成散落的小字块，旁边一个 99.99 分的满分徽章，一把尺子在找横竖线；2 一张空白纸旁边三个小牌子“有字”“没字”“说不准”，“说不准”那块亮着；3 一台熨斗悬在一张平整的手机截图上方，截图边缘被烫卷了一角。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  },
  "v": {
   "blocks": [
    {
     "type": "content_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons/打勾清单.png",
      "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png"
     ],
     "text_ref": "1.把握分很高，也可能读错表格"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：三张卡片上下排，每张插画在上、字在下。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。"
  }
 },
 "images": [
  {
   "role": "icon",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": "1. 把握分很高，也可能读错表格 \n麻烦快模型读表格时，每个字都认得很自信，却把表格拆成一串散字，只看把握分发现不了。\n解法体检时另外用图像找横线和竖线的交叉点，够6个就判为表格页，交给强模型。\n证据验收样例“自动路线·表格”：快读9行，平均把握分0.99995，没有一行低分，仍因为查到表格线被送去重读。真实材料也有：9月26日那份16页扫描件的第15页，平均把握分0.997，就是因为表格线才被重读的。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "key": "问号气泡",
   "source_phrase": "2. 读不出字，不等于没有字 \n麻烦结果为空时，AI很容易说“这图没字”，其实可能是字太小、太淡或模型出错。\n解法结论分三种：有字、没字、说不准。只有整页读全、质量够、另有独立证据才判“没字”；目前唯一的独立证据是“近乎纯色的图”检测，其余空结果一律“说不准”。结论用指纹绑定原件、请求、模型和输出文件。\n证据8月18日起带结论的274份真实结果都是“有字”，还没遇到过空结果；验收里的纯白样例图按“近乎纯色”判为没字。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "key": "照片堆",
   "source_phrase": "3. 截图不需要“摊平” \n麻烦UVDoc本是给拍弯的纸用的，对平整的软件截图反而裁掉边缘、读错字，还连带触发不必要的强模型重读。\n解法日常识字默认关掉摊平，只保留转正方向；强模型和结构还原处理纸质文档时仍开着。\n证据8月28日起这样设；关掉后截图的主体文字和位置恢复正常。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "key": "打勾清单",
   "source_phrase": "1. 把握分很高，也可能读错表格 \n麻烦快模型读表格时，每个字都认得很自信，却把表格拆成一串散字，只看把握分发现不了。\n解法体检时另外用图像找横线和竖线的交叉点，够6个就判为表格页，交给强模型。\n证据验收样例“自动路线·表格”：快读9行，平均把握分0.99995，没有一行低分，仍因为查到表格线被送去重读。真实材料也有：9月26日那份16页扫描件的第15页，平均把握分0.997，就是因为表格线才被重读的。",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "key": "问号气泡",
   "source_phrase": "2. 读不出字，不等于没有字 \n麻烦结果为空时，AI很容易说“这图没字”，其实可能是字太小、太淡或模型出错。\n解法结论分三种：有字、没字、说不准。只有整页读全、质量够、另有独立证据才判“没字”；目前唯一的独立证据是“近乎纯色的图”检测，其余空结果一律“说不准”。结论用指纹绑定原件、请求、模型和输出文件。\n证据8月18日起带结论的274份真实结果都是“有字”，还没遇到过空结果；验收里的纯白样例图按“近乎纯色”判为没字。",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "key": "照片堆",
   "source_phrase": "3. 截图不需要“摊平” \n麻烦UVDoc本是给拍弯的纸用的，对平整的软件截图反而裁掉边缘、读错字，还连带触发不必要的强模型重读。\n解法日常识字默认关掉摊平，只保留转正方向；强模型和结构还原处理纸质文档时仍开着。\n证据8月28日起这样设；关掉后截图的主体文字和位置恢复正常。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
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
   "key": "识别纸张现图小槽4比3",
   "source_phrase": "插画：1 一张表格被拆成散落的小字块，旁边一个 99.99 分的满分徽章，一把尺子在找横竖线；2 一张空白纸旁边三个小牌子“有字”“没字”“说不准”，“说不准”那块亮着；3 一台熨斗悬在一张平整的手机截图上方，截图边缘被烫卷了一角。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一张表格被拆成散落的小字块，旁边一个 99.99 分的满分徽章，一把尺子在找横竖线"
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
   "asset": "_library/illustrations/main-localocr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "识别纸张现图小槽4比3",
   "source_phrase": "插画：1 一张表格被拆成散落的小字块，旁边一个 99.99 分的满分徽章，一把尺子在找横竖线；2 一张空白纸旁边三个小牌子“有字”“没字”“说不准”，“说不准”那块亮着；3 一台熨斗悬在一张平整的手机截图上方，截图边缘被烫卷了一角。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一张空白纸旁边三个小牌子抽象图形抽象图形抽象图形，抽象图形那块亮着"
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
   "key": "识别纸张现图小槽4比3",
   "source_phrase": "插画：1 一张表格被拆成散落的小字块，旁边一个 99.99 分的满分徽章，一把尺子在找横竖线；2 一张空白纸旁边三个小牌子“有字”“没字”“说不准”，“说不准”那块亮着；3 一台熨斗悬在一张平整的手机截图上方，截图边缘被烫卷了一角。",
   "sha256": "1d48c252c6be5bb8840517879a4404ec6e9509777347fafc98f5db475fb9cbb6",
   "status": "ready",
   "original_elements": [
    "一台熨斗悬在一张平整的手机截图上方，截图边缘被烫卷了一角"
   ],
   "hidden": false
  }
 ]
}
```

**1. 把握分很高，也可能读错表格**
麻烦｜快模型读表格时，每个字都认得很自信，却把表格拆成一串散字，只看把握分发现不了。
解法｜体检时另外用图像找横线和竖线的交叉点，够 6 个就判为表格页，交给强模型。
证据｜验收样例“自动路线·表格”：快读 9 行，平均把握分 0.99995，没有一行低分，仍因为查到表格线被送去重读。真实材料也有：9 月 26 日那份 16 页扫描件的第 15 页，平均把握分 0.997，就是因为表格线才被重读的。

**2. 读不出字，不等于没有字**
麻烦｜结果为空时，AI 很容易说“这图没字”，其实可能是字太小、太淡或模型出错。
解法｜结论分三种：有字、没字、说不准。只有整页读全、质量够、另有独立证据才判“没字”；目前唯一的独立证据是“近乎纯色的图”检测，其余空结果一律“说不准”。结论用指纹绑定原件、请求、模型和输出文件。
证据｜截至 10 月 11 日 14:00，16,074 次完成的识别里有 15,665 次带了这个结论：15,196 次“有字”，466 次“说不准”，3 次“没字”；另外 409 次早期识别还没有这一项。这是按识别次数算的，不是按材料：三类分别涉及 14,261、446、1 份材料，同一份材料识别几次可能落进不同的类，所以三个数不能相加，也加不出 14,976 份材料。3 次“没字”是 9 月 29 日晚上对同一份材料的三次请求，是机器给的结论，没有人看图确认过；验收里的纯白样例图按“近乎纯色”判为没字。

**3. 截图不需要“摊平”**
麻烦｜UVDoc 本是给拍弯的纸用的，对平整的软件截图反而裁掉边缘、读错字，还连带触发不必要的强模型重读。
解法｜日常识字默认关掉摊平，只保留转正方向；强模型和结构还原处理纸质文档时仍开着。
证据｜8 月 28 日起这样设；关掉后截图的主体文字和位置恢复正常。

::screen{#localocr-10 section="features"}

```typeset
{
 "screen": {
  "id": "localocr-10",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和电脑配置与恢复页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下一行小字，第二张没有标题和图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）；第一张顶上标题、图例和说明。",
  "links": [],
  "anchors": [
   {
    "id": "g-read",
    "text": "读字"
   },
   {
    "id": "f-image",
    "text": "图片和截图识字"
   },
   {
    "id": "f-scan",
    "text": "扫描件逐页识字"
   },
   {
    "id": "f-folder",
    "text": "一个文件夹一起读"
   },
   {
    "id": "f-drag",
    "text": "拖到 start.bat 就识别"
   },
   {
    "id": "f-outputs",
    "text": "三种结果文件"
   },
   {
    "id": "f-rotate",
    "text": "歪的倒的先转正"
   },
   {
    "id": "g-route",
    "text": "选模型"
   },
   {
    "id": "f-auto",
    "text": "先快后强自动选"
   },
   {
    "id": "f-page-escalate",
    "text": "只重读有问题的页"
   },
   {
    "id": "f-explicit",
    "text": "指定模型"
   },
   {
    "id": "f-triage",
    "text": "只看走哪条路"
   },
   {
    "id": "g-structure",
    "text": "表格和位置"
   },
   {
    "id": "f-table",
    "text": "表格还原成行列"
   },
   {
    "id": "f-formula-seal",
    "text": "公式和印章"
   },
   {
    "id": "f-coords",
    "text": "每行字的位置和把握分"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "localocr-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（28项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "prose",
     "text_ref": "没用过＝每次识别都会留任务记录，真实材料里一次也没有；说"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "读字"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1图片和截图识字png、jpg、webp、bmp图片和截"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "选模型"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "7先快后强自动选每页先用快模型读，体检不过的页才换强模型"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "表格和位置"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "11表格还原成行列PP-StructureV3把表格还原"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：和电脑配置与恢复页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下一行小字，第二张没有标题和图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。 页修复 07（北京时间 2026-10-03）：按 qa-07 第3条将本屏3个功能分组改为已有 section_heading small，原组名逐字保留；章节标题仍用毛笔图。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（28项）"
    },
    {
     "type": "status_legend",
     "text_ref": "图例：●在用●待验收○待实施●没用过●说不准✕已停用"
    },
    {
     "type": "prose",
     "text_ref": "没用过＝每次识别都会留任务记录，真实材料里一次也没有；说"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "读字"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "1图片和截图识字png、jpg、webp、bmp图片和截"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "选模型"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "7先快后强自动选每页先用快模型读，体检不过的页才换强模型"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "表格和位置"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "11表格还原成行列PP-StructureV3把表格还原"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）；第一张顶上标题、图例和说明。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。 页修复 07（北京时间 2026-10-03）：按 qa-07 第3条将本屏3个功能分组改为已有 section_heading small，原组名逐字保留；章节标题仍用毛笔图。"
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
   "source_phrase": "图片和截图识字｜png、jpg、webp、bmp 图片和截图，读出全部文字｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "source_phrase": "扫描件逐页识字｜扫描 PDF 按 216 DPI 逐页渲染再读，多页 TIFF 逐帧读，并核对实际页数｜在用",
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
   "asset": "_library/icons/文件夹链接.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹链接",
   "source_phrase": "一个文件夹一起读｜每个文件分别选路线，不支持的文件列为跳过｜说不准",
   "sha256": "6fcf197790b6dfee317fb4a82a55e817b702418b0be2201038e927e688c23f0c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "拖到 start.bat 就识别｜不经过 AI，自己拖文件，结果在 outputs 文件夹｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "三种结果文件｜纯文字 TXT、保留标题表格的 Markdown、带坐标和把握分的 JSON｜在用",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "歪的倒的先转正｜两个方向小模型判断整页和每行字的朝向，先转正再读｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "先快后强自动选｜每页先用快模型读，体检不过的页才换强模型｜在用",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
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
   "source_phrase": "只重读有问题的页｜多页文件里只把没读好的那几页交给强模型，其余页保留快读结果｜在用",
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
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "指定模型｜可以直接说用快模型、强模型或结构还原，自动选路不改写｜在用",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "只看走哪条路｜先预览这份材料会走哪条路线，不真的识别｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
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
   "source_phrase": "表格还原成行列｜PP-StructureV3 把表格还原成行列 HTML，给每块区域坐标｜没用过",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "公式和印章｜同一条结构还原路线认出公式、检测印章文字｜没用过",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "每行字的位置和把握分｜JSON 里每块字有框、多边形、阅读顺序和 0–1 的把握分｜在用",
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
   "asset": "_library/titles/title-832fae0fa1193bf6035b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-832fae0fa1193bf6035b",
   "title_text": "全部功能（28 项）",
   "sha256": "6d3d12f37d920a1a5fd9c8cb7a2cb87a8329866c1afc0d67237213e6b3f95774",
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
   "asset": "_library/titles/title-bf9114190f82e713bc95.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bf9114190f82e713bc95",
   "title_text": "表格和位置",
   "sha256": "cec3a8c2e951d5c9bfe14e51146ee5c9d2f48ac2e4389ecbfde7ebb9f714b6f7",
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
   "asset": "_library/titles/title-28809440ab88664c39f1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-28809440ab88664c39f1",
   "title_text": "读字",
   "sha256": "e76d2bab87c1ae465e70070a256eefed7885e64b911ade927410515f36a5f35f",
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
   "asset": "_library/titles/title-23c4841cbe265cd064ad.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-23c4841cbe265cd064ad",
   "title_text": "选模型",
   "sha256": "3b5c186f9e4373e1d358c0e66b638088a7a0cf3605a820d550808a1291f3e4e2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 全部功能（28 项）
图例：● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用
没用过＝每次识别都会留任务记录，真实材料里一次也没有；说不准＝用了也不一定留记录。

**读字**
1. 图片和截图识字｜png、jpg、webp、bmp 图片和截图，读出全部文字｜在用
2. 扫描件逐页识字｜扫描 PDF 按 216 DPI 逐页渲染再读，多页 TIFF 逐帧读，并核对实际页数｜在用
3. 一个文件夹一起读｜每个文件分别选路线，不支持的文件列为跳过｜说不准
4. 拖到 start.bat 就识别｜不经过 AI，自己拖文件，结果在 outputs 文件夹｜说不准
5. 三种结果文件｜纯文字 TXT、保留标题表格的 Markdown、带坐标和把握分的 JSON｜在用
6. 歪的倒的先转正｜两个方向小模型判断整页和每行字的朝向，先转正再读｜在用

**选模型**
7. 先快后强自动选｜每页先用快模型读，体检不过的页才换强模型｜在用
8. 只重读有问题的页｜多页文件里只把没读好的那几页交给强模型，其余页保留快读结果｜在用
9. 指定模型｜可以直接说用快模型、强模型或结构还原，自动选路不改写｜在用
10. 只看走哪条路｜先预览这份材料会走哪条路线，不真的识别｜说不准

**表格和位置**
11. 表格还原成行列｜PP-StructureV3 把表格还原成行列 HTML，给每块区域坐标｜没用过
12. 公式和印章｜同一条结构还原路线认出公式、检测印章文字｜没用过
13. 每行字的位置和把握分｜JSON 里每块字有框、多边形、阅读顺序和 0–1 的把握分｜在用

::screen{#localocr-11 section="features"}

```typeset
{
 "screen": {
  "id": "localocr-11",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：和电脑配置与恢复页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下一行小字，第二张没有标题和图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。",
  "portrait": "竖版：组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）；第一张顶上标题、图例和说明。",
  "links": [],
  "anchors": [
   {
    "id": "g-trust",
    "text": "结果靠得住"
   },
   {
    "id": "f-objective",
    "text": "有字、没字、说不准"
   },
   {
    "id": "f-summary",
    "text": "一句人话摘要"
   },
   {
    "id": "f-snapshot",
    "text": "原件留底再识别"
   },
   {
    "id": "f-cache",
    "text": "识过不重识"
   },
   {
    "id": "f-partial",
    "text": "中断时保住读完的页"
   },
   {
    "id": "g-run",
    "text": "运行和显卡"
   },
   {
    "id": "f-server",
    "text": "本机识别服务"
   },
   {
    "id": "f-status",
    "text": "查进度、取消"
   },
   {
    "id": "f-gpu",
    "text": "领显卡、和语音转写同时跑"
   },
   {
    "id": "f-release",
    "text": "用完腾显卡"
   },
   {
    "id": "f-limits",
    "text": "超时和内存上限"
   },
   {
    "id": "f-observer",
    "text": "给看板的任务视图"
   },
   {
    "id": "g-version",
    "text": "版本和换模型"
   },
   {
    "id": "f-release-snapshot",
    "text": "正式版和开发代码分开"
   },
   {
    "id": "f-rollback",
    "text": "退回上一版"
   },
   {
    "id": "f-acceptance",
    "text": "换版前三道验收"
   },
   {
    "id": "f-model-swap",
    "text": "换模型只改配置"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "localocr-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "结果靠得住"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "14有字、没字、说不准每份结果附一份客观结论，空结果不当"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "运行和显卡"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "19本机识别服务只在本机18665端口，同一时间只做一个"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "版本和换模型"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "25正式版和开发代码分开每天用的是验收过的快照，改代码不"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：和电脑配置与恢复页的“全部功能”一样的画法，但组名不单独占一整列：每组的组名（毛笔字）写在这组卡片上方一行，下面卡片排成三列；每张卡片左边小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（竖线不画）。两张图上下拼成一整段：同一个网格，第一张顶上有标题、图例和图例下一行小字，第二张没有标题和图例，接着往下排；上下边都不画边框。圆点颜色：在用＝绿，待验收＝黄，待实施＝空心绿圈，没用过＝灰，说不准＝浅灰，已停用＝灰色叉。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。 页修复 07（北京时间 2026-10-03）：按 qa-07 第3条将本屏3个功能分组改为已有 section_heading small，原组名逐字保留；章节标题仍用毛笔图。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "结果靠得住"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "14有字、没字、说不准每份结果附一份客观结论，空结果不当"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "运行和显卡"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "19本机识别服务只在本机18665端口，同一时间只做一个"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "small",
     "text_ref": "版本和换模型"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "25正式版和开发代码分开每天用的是验收过的快照，改代码不"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：组名在上，卡片一行一张（编号功能名、一句话、状态圆点在右上）；第一张顶上标题、图例和说明。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；功能组名的毛笔要求现直接交给已有chapter_title组件（小/中档、左对齐），不继续在feature_card内部以普通h3冒充；没有逐字图时由质量关列title未完成。 页修复 07（北京时间 2026-10-03）：按 qa-07 第3条将本屏3个功能分组改为已有 section_heading small，原组名逐字保留；章节标题仍用毛笔图。"
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
   "source_phrase": "有字、没字、说不准｜每份结果附一份客观结论，空结果不当“没字”｜在用",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "一句人话摘要｜把覆盖、质量、文字块数和是否升级写成一句话｜在用",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文稿堆",
   "source_phrase": "原件留底再识别｜先算指纹做只读快照，识别完原件变了就不发结果｜在用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "识过不重识｜同样的材料和请求再来，核对指纹后直接交上次结果｜在用",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "中断时保住读完的页｜超时或崩溃时已读完的页留作部分结果，不冒充整份｜说不准",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "本机识别服务｜只在本机 18665 端口，同一时间只做一个识别，忙时直说不排队｜在用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 7,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "查进度、取消｜按任务编号查到哪一步，或只取消这一项｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "领显卡、和语音转写同时跑｜向显卡调度员领租约才加载模型；可和语音转写并行，和本地大模型互斥｜在用",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显卡",
   "source_phrase": "用完腾显卡｜关掉工作进程、还回显卡；本地大模型要用时调度员也会先清｜在用",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/沙漏.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "沙漏",
   "source_phrase": "超时和内存上限｜一次默认 300 秒、最多 2 小时；内存超 30 GB 只停自己｜在用",
   "sha256": "832f14c995b046898ae2ca304e804dc44efa3a83e3a7d8c056bc73a910ad0678",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "给看板的任务视图｜只读、不含文件内容的任务列表接口｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "正式版和开发代码分开｜每天用的是验收过的快照，改代码不影响它｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "退回上一版｜保留上一版，出问题可以切回，切回也要它自己的验收｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "换版前三道验收｜依赖、181 项测试无失败、9 个合成样例的真实显卡识别全过才切换｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "换模型只改配置｜模型写在配置档里，新模型先对照验收，不自动当默认｜在用",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-42a7349ed63d01fcfbd4.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-42a7349ed63d01fcfbd4",
   "title_text": "版本和换模型",
   "sha256": "e4a8f50a957fd8d781689a4fe2d106e3c34cfee64af7296da6664a57e67deed2",
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
   "asset": "_library/titles/title-cb974c2fd1313936b428.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-cb974c2fd1313936b428",
   "title_text": "结果靠得住",
   "sha256": "45d4ac611bd60428c1e5fe8cb6d34fd63cf2d293fb6b80bfa264995412cae1f1",
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
   "asset": "_library/titles/title-34c6277de864cb7d079c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-34c6277de864cb7d079c",
   "title_text": "运行和显卡",
   "sha256": "05b5848b04bdf9c4ce0bcc184b5d2f7653e2df2a16c9e27dd1792f72bb6a1506",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

**结果靠得住**
14. 有字、没字、说不准｜每份结果附一份客观结论，空结果不当“没字”｜在用
15. 一句人话摘要｜把覆盖、质量、文字块数和是否升级写成一句话｜在用
16. 原件留底再识别｜先算指纹做只读快照，识别完原件变了就不发结果｜在用
17. 识过不重识｜同样的材料和请求再来，核对指纹后直接交上次结果｜在用
18. 中断时保住读完的页｜超时或崩溃时已读完的页留作部分结果，不冒充整份｜说不准

**运行和显卡**
19. 本机识别服务｜只在本机 18665 端口，同一时间只做一个识别，忙时直说不排队｜在用
20. 查进度、取消｜按任务编号查到哪一步，或只取消这一项｜说不准
21. 领显卡、和语音转写同时跑｜向显卡调度员领租约才加载模型；可和语音转写并行，和本地大模型互斥｜在用
22. 用完腾显卡｜关掉工作进程、还回显卡；本地大模型要用时调度员也会先清｜在用
23. 超时和内存上限｜一次默认 300 秒、最多 2 小时；内存超 30 GB 只停自己｜在用
24. 给看板的任务视图｜只读、不含文件内容的任务列表接口｜说不准

**版本和换模型**
25. 正式版和开发代码分开｜每天用的是验收过的快照，改代码不影响它｜在用
26. 退回上一版｜保留上一版，出问题可以切回，切回也要它自己的验收｜在用
27. 换版前三道验收｜依赖、181 项测试无失败、9 个合成样例的真实显卡识别全过才切换｜在用
28. 换模型只改配置｜模型写在配置档里，新模型先对照验收，不自动当默认｜在用

::screen{#localocr-12 section="history"}

```typeset
{
 "screen": {
  "id": "localocr-12",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。一条从左到右的水彩绿丝带时间轴，上面十个小旗，每个小旗：日期（粗体绿色）＋一行字，上下错开不挤；丝带起点画一块显卡，终点画一张打勾的验收单。时间轴下面一行灰色小字。",
  "portrait": "竖版：标题；时间轴改成从上往下的竖丝带，小旗一行一个；灰色小字在最下面。",
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
     "text_ref": "演进（2026年）",
     "row": "balanced-heading",
     "width": "70%"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "small",
     "align": "left",
     "description": "丝带起点显卡",
     "row": "balanced-heading",
     "width": "15%"
    },
    {
     "type": "illustration",
     "index": 1,
     "size": "small",
     "align": "right",
     "description": "丝带终点验收纸",
     "row": "balanced-heading",
     "width": "15%"
    },
    {
     "type": "timeline",
     "columns": 5,
     "direction": "horizontal",
     "connector": "ribbon",
     "illustration": "outside",
     "icons": "none",
     "paragraph_items": true,
     "text_ref": "7月2日在RTX5080上跑通PaddleOCR3.7（"
    },
    {
     "type": "prose",
     "text_ref": "50次提交，7月2日到10月16日。9月24日以后先是两次小改：9月29日改正文档里“文字识别和语音转写能不能同时用显卡”的说明，10月1日删掉两段没人调用的内部代码；10月12日到16日又有一组稳定"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：横版：左上标题。一条从左到右的水彩绿丝带时间轴，上面十个小旗，每个小旗：日期（粗体绿色）＋一行字，上下错开不挤；丝带起点画一块显卡，终点画一张打勾的验收单。时间轴下面一行灰色小字。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；本轮文字优先；仅此屏竖版由短命子代理查看338×600、42279字节的单张压缩JPEG确认：标题下左侧有显卡，底部说明框左侧有装订方格纸（未辨清勾，不能称验收单），所有日期旗在竖丝带右，日期上/正文下。横版只按scene十旗一条水平丝带，列数改10，不借竖图推断横版。无需每日期10个图标；只需两端图位，当前缺明确素材。上下错开旗帜仍需组件/审页确认。 页修复 07（北京时间 2026-10-03）：按 qa-07 第5条横时间轴十项改五列两行，两端图栏各14%、时间轴72%；竖版起点图保留独立左侧小栏，时间轴改整宽独立块，解除18%图栏占去正文左边的宽度。原十日期和页尾统计全部保留。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进（2026年）"
    },
    {
     "type": "illustration",
     "index": 0,
     "size": "small",
     "align": "left",
     "row": "axis-start",
     "row_v": true,
     "width": "18%",
     "description": "标题下左侧显卡"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "outside",
     "icons": "none",
     "paragraph_items": true,
     "text_ref": "7月2日在RTX5080上跑通PaddleOCR3.7（"
    },
    {
     "type": "illustration",
     "index": 1,
     "size": "small",
     "align": "left",
     "row": "footer",
     "row_v": true,
     "width": "22%",
     "description": "底部说明框左侧装订方格纸"
    },
    {
     "type": "prose",
     "text_ref": "50次提交，7月2日到10月16日。9月24日以后先是两次小改：9月29日改正文档里“文字识别和语音转写能不能同时用显卡”的说明，10月1日删掉两段没人调用的内部代码；10月12日到16日又有一组稳定",
     "row": "footer",
     "row_v": true,
     "width": "78%"
    }
   ],
   "notes": "本轮仅用已有文字材料核对；未查看图片。构图依据：竖版：标题；时间轴改成从上往下的竖丝带，小旗一行一个；灰色小字在最下面。；独立插画的卡外位置及先后顺序由blocks/row实现，冗余placement/illustration:outside说明移除；构图意图保留在原notes。；本轮文字优先；仅此屏竖版由短命子代理查看338×600、42279字节的单张压缩JPEG确认：标题下左侧有显卡，底部说明框左侧有装订方格纸（未辨清勾，不能称验收单），所有日期旗在竖丝带右，日期上/正文下。横版只按scene十旗一条水平丝带，列数改10，不借竖图推断横版。无需每日期10个图标；只需两端图位，当前缺明确素材。上下错开旗帜仍需组件/审页确认。 页修复 07（北京时间 2026-10-03）：按 qa-07 第5条横时间轴十项改五列两行，两端图栏各14%、时间轴72%；竖版起点图保留独立左侧小栏，时间轴改整宽独立块，解除18%图栏占去正文左边的宽度。原十日期和页尾统计全部保留。"
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
   "asset": "_library/round3/clean-assets/png/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "显卡",
   "source_phrase": "丝带起点显卡／标题下左侧显卡",
   "sha256": "a1f8f6bc994770f2e92d64d220784ac5622c33eb4375e3dd52eb6e7e14bb3285",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-45940475938ca8fdb78a.png",
   "fallback": false,
   "semantic_status": "AI补充：按本轮许可复用同主体；不承诺组合/动作/方格细节一致",
   "key": "白纸",
   "source_phrase": "丝带终点纸张／底说明框左侧装订方格纸",
   "sha256": "e010ca7001948622ae4e18db3eea512568d933314d2ef2a8d4249bdb31d7d41e",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-60559ec08d1172637358.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-60559ec08d1172637358",
   "title_text": "演进（2026 年）",
   "sha256": "db23165afb23b1b352da4a906595585ada3cfcf674b7dc824e7908e425f6a9b2",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

## 演进（2026 年）

7 月 2 日｜在 RTX 5080 上跑通 PaddleOCR 3.7（放进 WSL2；随后换成同一代架构的 5090 D）
7 月 5 日｜本机识别服务；用完可以腾显卡
7 月 7 日｜模型写进配置档；加上结构还原；识过不重识；自动选路
7 月 12 日｜所有显卡工作都先向全机调度员领号
7 月 30 日｜难页自动交本地强模型重读
8 月 18 日｜分清“读不出”和“没有字”，每份结果附客观结论
8 月 28 日｜截图关掉纸张摊平；运行和入口全面加固
9 月 2 日｜每份结果加一句人话摘要
9 月 17 日｜正式版和开发代码分开，可以退回上一版
9 月 24 日｜新版本验收：181 项测试无失败（16 项按条件跳过），9 个合成样例全过
10 月 12–16 日｜强模型更省内存、按整机剩余内存把关；批量中途出错也交回已完成的结果；现役换成 10 月 16 日验收的一版：187 项测试无失败（17 项按条件跳过），9 个合成样例全过

50 次提交，7 月 2 日到 10 月 16 日。9 月 24 日以后先是两次小改：9 月 29 日改正文档里“文字识别和语音转写能不能同时用显卡”的说明，10 月 1 日删掉两段没人调用的内部代码；10 月 12 日到 16 日又有一组稳定性修复：强模型的内存增长和整机内存把关、Windows 入口的输出回传与临时路径、输出收集也受同一时限约束、输入路径不存在时明确报失败、批量中途出错保留已完成结果。每天在用的是 10 月 16 日验收的那一版快照（上一版是 10 月 12 日验收的一版），开发代码变了不会自己换上去。
