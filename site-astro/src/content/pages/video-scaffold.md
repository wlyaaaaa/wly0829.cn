---
{
 "title": "本地视频制作",
 "kind": "project",
 "url": "/projects/video-scaffold/",
 "tagline": "把定好的文案和素材做成 4K 视频",
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
  "page": "video-scaffold",
  "kind": "project",
  "title": "本地视频制作",
  "url": "/projects/video-scaffold/",
  "tagline": "把定好的文案和素材做成 4K 视频",
  "status": "偶尔用",
  "status_line": {
   "state": "偶尔用",
   "last": {
    "label": "上次更新",
    "at": "2026-10-08 15:52"
   },
   "facts": [
    "近 7 天改进了 19 次"
   ],
   "as_of": "2026-10-10",
   "source": "项目修改记录"
  },
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/video-scaffold",
  "capability": "做视频：配音、踩点动画、4K 渲染",
  "based_on": {
   "commit": "8c9be9e8e77874c0f0dd3ea937e3c5f359996846",
   "commit_time": "2026-10-08T02:52:33-05:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的水彩插画出发，镜头不动：显示器里浅绿色的毛玻璃背景缓缓流动，“核心结论”四个深绿字随着麦克风旁那条声波的起伏一个字一个字打出来，打完后轻轻浮起一下；打板轻轻合上一次，显卡的绿光慢慢呼吸，周围水彩叶子微微摇动；最后字淡回半透明，回到起始画面，首尾能无缝接上。不出现任何别的文字。",
  "registry": {
   "groups": [
    {
     "id": "g-start",
     "name": "开工"
    },
    {
     "id": "g-voice",
     "name": "配音和时间"
    },
    {
     "id": "g-scene",
     "name": "画面"
    },
    {
     "id": "g-output",
     "name": "出片"
    },
    {
     "id": "g-check",
     "name": "验收和收尾"
    },
    {
     "id": "g-webfilm",
     "name": "另一条线：网页成片"
    },
    {
     "id": "g-retired",
     "name": "已停用"
    }
   ],
   "features": [
    {
     "id": "f-init",
     "group": "g-start",
     "name": "新项目准备",
     "what": "开一个空白项目：只复制通用代码、模板和背景，不带上一期的旁白、素材、成片和密钥；目标文件夹不空就不开",
     "how": "把本期文案和素材交给 AI，让它建新项目",
     "status": "在用",
     "screen": "video-scaffold-08",
     "source": "init_project.py 第 1、41–93 行；docs/WORKFLOW.md「环境与初始化」"
    },
    {
     "id": "f-doctor",
     "group": "g-start",
     "name": "环境检查",
     "what": "查 Python、FFmpeg、浏览器组件、背景、显卡排队、对时间要用的中文语音转写是否就绪；只看不动，不开浏览器、不占显卡、不读密钥",
     "how": "让 AI 先查这期能不能做",
     "status": "在用",
     "screen": "video-scaffold-08",
     "source": "pipeline/doctor.py 第 236–318 行；9 月 28 日实跑 10 项通过、1 项未测"
    },
    {
     "id": "f-live-probe",
     "group": "g-start",
     "name": "真机和配音试一下",
     "what": "要实证时才跑：真开浏览器和显卡编码试一次；或真向 Fish 配一句测试音，用完就删",
     "how": "说“真机试一下”或“真配一句试试”",
     "status": "说不准",
     "screen": "video-scaffold-08",
     "source": "pipeline/doctor.py 第 1–7 行；探测音频用完即删，不留记录"
    },
    {
     "id": "f-status",
     "group": "g-start",
     "name": "查进度",
     "what": "列出每一步的结果还算不算数、为什么过期、该从哪一步重做",
     "how": "问 AI 这期做到哪了",
     "status": "待验收",
     "screen": "video-scaffold-08",
     "source": "docs/WORKFLOW.md 入口表；pipeline/workflow.py 第 282–284 行；9 月 18 日新加"
    },
    {
     "id": "f-script-split",
     "group": "g-voice",
     "name": "旁白分场",
     "what": "把一整篇旁白按段写成每场一个文本文件；没有单独的命令，要让 AI 调用",
     "how": "让 AI 把旁白分好场",
     "status": "说不准",
     "screen": "video-scaffold-08",
     "source": "pipeline/prep.py；tests/test_complete_contracts.py 第 315–322 行；run.ps1 没有对应阶段"
    },
    {
     "id": "f-tts",
     "group": "g-voice",
     "name": "配音生成",
     "what": "调 Fish Audio 把每场旁白读出来；6 月用过，9 月改走带时间戳的接口，还加了“旁白改了就拒绝沿用旧配音”",
     "how": "旁白定稿后让 AI 出声音",
     "status": "待验收",
     "screen": "video-scaffold-08",
     "source": "pipeline/fish_tts.py 第 98、175–216 行；pipeline/fish_native.py 由 6f72490（9 月 18 日）新加；审稿第 1 条"
    },
    {
     "id": "f-voice-tags",
     "group": "g-voice",
     "name": "语气和停顿标记",
     "what": "旁白里写 [emphasis]、[pause]、[excited] 这类标记，控制语气、停顿和音效，标记本身不会被读出来",
     "how": "让 AI 写旁白时适度加标记",
     "status": "在用",
     "screen": "video-scaffold-08",
     "source": "docs/VOICE.md；config.py 第 138–163 行"
    },
    {
     "id": "f-timing",
     "group": "g-voice",
     "name": "逐字时间轴",
     "what": "记下每个字几点几秒说出：优先用 Fish 返回的时间戳，没有就交给中文语音转写对齐；换方法不重配音",
     "how": "让 AI 给旁白逐字对时间",
     "status": "待验收",
     "screen": "video-scaffold-08",
     "source": "pipeline/transcribe.py 第 1–6 行；9 月 18 日换了做法"
    },
    {
     "id": "f-prompts",
     "group": "g-scene",
     "name": "逐场画面提示",
     "what": "每场生成一份提示：旁白、能踩点的词、素材路径和画面规矩，照着写画面",
     "how": "让 AI 先出每场的提示",
     "status": "说不准",
     "screen": "video-scaffold-08",
     "source": "pipeline/author.py；docs/AUTHORING.md「从提示词到片段」"
    },
    {
     "id": "f-scene",
     "group": "g-scene",
     "name": "场景制作",
     "what": "每场一个矢量图片段，用 32 种动画和现成组件，动画踩着旁白的字出现",
     "how": "告诉 AI 每个画面放什么",
     "status": "在用",
     "screen": "video-scaffold-08",
     "source": "templates/scene_base.html；v2lib.py；pipeline/build_scene.py"
    },
    {
     "id": "f-lint",
     "group": "g-scene",
     "name": "布局预检",
     "what": "渲染前在浏览器里停在每个动画的起止时刻，量有没有字跑出画面、素材缺没缺",
     "how": "让 AI 先把所有画面查一遍",
     "status": "待验收",
     "screen": "video-scaffold-08",
     "source": "pipeline/lint.py；pipeline/workflow.py 第 176–194 行；6 月版只停在一个稳定帧量，9 月改成采样每个动画的起止"
    },
    {
     "id": "f-preview",
     "group": "g-scene",
     "name": "有声预览",
     "what": "边听旁白边看画面，点词跳到那一秒；能改踩点后导出新的画面文件，不改原件；9 月 29 日修好了画面区域被白底挡住、看不到玻璃背景的毛病",
     "how": "让 AI 先给能听能看的预览",
     "status": "待验收",
     "screen": "video-scaffold-08",
     "source": "templates/preview.html；9 月 18 日从无声循环改成有声审阅；提交 351e349（9 月 29 日）：场景页与预览页配色方案一致，自测检查预览框实际像素，隔离自测截图可见背景"
    },
    {
     "id": "f-render",
     "group": "g-output",
     "name": "断点渲染",
     "what": "4 路并行逐帧渲染，每段数帧核对；断了接着做，只补缺的和坏的。6 月用过，9 月加了显卡排队、按指纹判断哪段要重渲",
     "how": "预览满意后让 AI 渲染；断了让它接着做",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "pipeline/render.py；pipeline/gpu.py 由 6f72490（9 月 18 日）新加；config.py 第 64–76 行；审稿第 2 条"
    },
    {
     "id": "f-merge",
     "group": "g-output",
     "name": "视频合成",
     "what": "画面合上旁白；放了背景音乐就自动垫在旁白下面；画面和声音时长对不上就不合",
     "how": "让 AI 出成片",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "pipeline/merge.py 第 103–169 行；6 月后改成先把旁白统一成 48 kHz 再拼、时长对不上就拒绝"
    },
    {
     "id": "f-cover",
     "group": "g-output",
     "name": "封面",
     "what": "按标题、副标题和可选主图出一张 3840×2160 的封面，字出界就报错",
     "how": "告诉 AI 标题和要不要主图",
     "status": "在用",
     "screen": "video-scaffold-09",
     "source": "pipeline/cover.py"
    },
    {
     "id": "f-chapters",
     "group": "g-output",
     "name": "章节",
     "what": "按场分组生成 B 站章节，从 00:00 开始；章太多、标题太长、两章太近都会提醒",
     "how": "告诉 AI 哪几场算一章",
     "status": "在用",
     "screen": "video-scaffold-09",
     "source": "pipeline/chapters.py；config.py 第 169–177 行"
    },
    {
     "id": "f-subtitles",
     "group": "g-output",
     "name": "字幕",
     "what": "从逐字时间轴出 SRT 和 WebVTT 字幕文件，不烧进画面",
     "how": "说要字幕",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "pipeline/subtitles.py；9 月 18 日新加"
    },
    {
     "id": "f-verify",
     "group": "g-check",
     "name": "成片核验",
     "what": "逐项核对来源、尺寸、帧率、编码、总帧数、时长、音画起点和封面；全过才算“就绪”",
     "how": "先让 AI 核验，我再看一遍听一遍",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "pipeline/cleanup.py verify；6 月版只查成片和封面在不在（f346d4e:pipeline/cleanup.py 第 45 行）；3f4ef22、17040ed、6f72490 重写；审稿第 3 条"
    },
    {
     "id": "f-manifest",
     "group": "g-check",
     "name": "交付清单",
     "what": "核验通过后记下成片、封面、章节、字幕的内容指纹和来源，注明还要人看",
     "how": "核验通过后让 AI 开清单",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "pipeline/workflow.py 第 294–322 行；9 月 18 日新加"
    },
    {
     "id": "f-cleanup",
     "group": "g-check",
     "name": "清理中间文件",
     "what": "只删认得的、能重新生成的中间文件，可以先只列不删；原件和成品不动，删不掉的列出来",
     "how": "让 AI 先列出能清的",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "pipeline/cleanup.py 第 14–60 行；6 月版是按通配符删、失败不报，8 月改成固定名单、能只列不删、删不掉就报"
    },
    {
     "id": "f-smoke",
     "group": "g-check",
     "name": "隔离整链自测",
     "what": "在一个新的空项目里用合成声音从头做到交付，再改一场，确认旧成片被拒、片段复用",
     "how": "改完代码让 AI 跑一遍",
     "status": "在用",
     "screen": "video-scaffold-09",
     "source": "pipeline/smoke.py；.github/workflows/validation.yml；9 月 28 日实跑通过"
    },
    {
     "id": "f-webfilm",
     "group": "g-webfilm",
     "name": "网页成片",
     "what": "AI 直接写一张会动的网页，程序按时间逐帧拍成 4K 视频；能先看关键几帧、只渲其中一段，不走分场配音那一套",
     "how": "把题目和要求交给 AI，让它按网页成片的约定写作品再渲染",
     "status": "待验收",
     "screen": "video-scaffold-09",
     "source": "webfilm/README.md；提交 b3e9b8f（北京 10/4 16:38）、7b7db63、0679e62（北京 10/8）；E:\\Projects\\VideoProductions\\20261004-webfilm-rehearsal 只有彩排产物，没有真视频"
    },
    {
     "id": "f-all-in-one",
     "group": "g-retired",
     "name": "一键全流程",
     "what": "一条命令从写旁白文件跑到成片；8 月 15 日换成分步骤，每步能停下来看",
     "how": "已停用",
     "status": "已停用",
     "screen": "video-scaffold-09",
     "source": "旧 build_v2.py（3f4ef22 之前）第 370–465 行；AGENTS.md 第 3 行"
    },
    {
     "id": "f-publish-kit",
     "group": "g-retired",
     "name": "投稿文案包",
     "what": "按旁白生成 B 站标题、简介、标签和投稿自检清单；随旧脚本停用，9 月 18 日删掉",
     "how": "已停用",
     "status": "已停用",
     "screen": "video-scaffold-09",
     "source": "提交 cf7e9dc；旧 build_v2.py 第 432 行；84501b0 删除 build_v2.py"
    },
    {
     "id": "f-archive",
     "group": "g-retired",
     "name": "一键归档",
     "what": "做完一期把素材和成品整体挪进归档文件夹；随旧脚本停用，现在每期开一个新项目",
     "how": "已停用",
     "status": "已停用",
     "screen": "video-scaffold-09",
     "source": "提交 cf7e9dc；旧 build_v2.py 第 350–367 行"
    },
    {
     "id": "f-whisper",
     "group": "g-retired",
     "name": "本地 Whisper 对时间",
     "what": "视频项目自己装 faster-whisper large-v3 对时间；9 月 18 日停用，改由中文语音转写统一对齐",
     "how": "已停用",
     "status": "已停用",
     "screen": "video-scaffold-09",
     "source": "提交 c434f1b、84501b0；config.py 第 210–214 行"
    }
   ],
   "numbers": [
    {
     "id": "n-canvas",
     "text": "3840×2160 · 60 帧",
     "meaning": "成片画布和帧率（默认配置）",
     "as_of": "2026-10-10",
     "source": "config.py 第 34–36 行（9 月 26 日后 config.py 未改）",
     "screens": [
      "video-scaffold-01"
     ]
    },
    {
     "id": "n-animations",
     "text": "32 种动画",
     "meaning": "场景模板支持的动画写法种数",
     "as_of": "2026-10-10",
     "source": "templates/scene_base.html 第 255–430 行动画 switch 的 case 去重计数；9 月 26 日后 scene_base.html 只加了一行配色声明，动画未变（10 月 10 日 git diff 复核）",
     "screens": [
      "video-scaffold-01",
      "video-scaffold-05",
      "video-scaffold-08"
     ]
    },
    {
     "id": "n-videos",
     "text": "1 期",
     "meaning": "用它做完并发布的视频期数",
     "as_of": "2026-10-10",
     "source": "提交 f346d4e 说明（第一期已发布）；之后没找到第二期成片的提交或文件；10 月 10 日复查：之后只有网页成片彩排和下一期的素材准备，没有第二期发布的记录",
     "screens": [
      "video-scaffold-01",
      "video-scaffold-10"
     ]
    },
    {
     "id": "n-tests",
     "text": "130 个",
     "meaning": "自动测试用例数（tests/ 下 def test 计数）",
     "as_of": "2026-10-10",
     "source": "grep -c \"def test\" tests/*.py：35＋6＋17＋17＋5＋3＋9＋5＋33（HEAD 8c9be9e，含网页成片 22 个）",
     "screens": [
      "video-scaffold-01",
      "video-scaffold-06"
     ]
    },
    {
     "id": "n-lines",
     "text": "8963 行",
     "meaning": "Git 里不在 tests/ 下的 45 个 .py 文件总行数（含空行注释）；其中原有分场生产线 6,492 行，10 月新加的 webfilm/ 约 2,471 行",
     "as_of": "2026-10-10",
     "source": "git ls-files | grep .py$ | grep -v ^tests/ | xargs wc -l（HEAD 8c9be9e）",
     "screens": [
      "video-scaffold-06"
     ]
    },
    {
     "id": "n-commits",
     "text": "58 次",
     "meaning": "全部提交数，6 月 26 日–10 月 8 日（北京时间）",
     "as_of": "2026-10-10",
     "source": "git rev-list --count HEAD（HEAD 8c9be9e，北京 10/8 15:52）",
     "screens": [
      "video-scaffold-06"
     ]
    },
    {
     "id": "n-workers",
     "text": "4 个 / 4 路",
     "meaning": "默认并行渲染路数（每路一个无头浏览器加一个编码进程）",
     "as_of": "2026-09-28",
     "source": "config.py 第 64 行",
     "screens": [
      "video-scaffold-04",
      "video-scaffold-05",
      "video-scaffold-06",
      "video-scaffold-09",
      "video-scaffold-10"
     ]
    },
    {
     "id": "n-doctor",
     "text": "10 项通过、1 项没测",
     "meaning": "静态环境检查结果",
     "as_of": "2026-09-28",
     "source": "9 月 28 日北京时间约 19:40 实跑 run.ps1 doctor",
     "screens": [
      "video-scaffold-03"
     ]
    },
    {
     "id": "n-smoke",
     "text": "2 段复用、3 段重渲",
     "meaning": "隔离自测里改一场后的片段复用和重做数",
     "as_of": "2026-09-28",
     "source": "9 月 28 日北京时间约 19:45 实跑 run.ps1 smoke 的结果 JSON",
     "screens": [
      "video-scaffold-06"
     ]
    },
    {
     "id": "n-features",
     "text": "26 项",
     "meaning": "全部功能条数（22 项现役＋4 项已停用）",
     "as_of": "2026-10-10",
     "source": "本页 registry.features 条数",
     "screens": [
      "video-scaffold-08"
     ]
    },
    {
     "id": "n-desync",
     "text": "3 分 47 秒",
     "meaning": "第一期渲染时音画开始错位的位置",
     "as_of": "2026-09-28",
     "source": "config.py 第 67–69 行注释；提交 a14aa03",
     "screens": [
      "video-scaffold-10"
     ]
    },
    {
     "id": "n-align-max",
     "text": "300 秒",
     "meaning": "共享对齐每场最长时长",
     "as_of": "2026-09-28",
     "source": "config.py ALIGNMENT_TIMEOUT_SECONDS；ChineseASR alignment_entry.py max_audio_sec",
     "screens": [
      "video-scaffold-05"
     ]
    },
    {
     "id": "n-tail",
     "text": "0.2 秒",
     "meaning": "每段配音末尾补的静音",
     "as_of": "2026-09-28",
     "source": "config.py 第 133 行",
     "screens": [
      "video-scaffold-07",
      "video-scaffold-10"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-chinese-asr-align",
     "with": "chinese-asr",
     "direction": "请它帮忙",
     "flow": "Fish 没给时间戳时，把每场的配音和已知文案交给中文语音转写（python -m zh_asr align，Qwen3-ForcedAligner-0.6B，本机显卡），拿回每个字的起止时间；每场最长 300 秒",
     "source": "pipeline/transcribe.py 第 102–178 行；ChineseASR configs/models.yaml 第 129–134 行"
    },
    {
     "id": "r-pcconfig-runtime",
     "with": "pcconfig",
     "direction": "拿来",
     "flow": "电脑配置与恢复的 Initialize-VideoScaffoldRuntime.ps1 把本机 Python、FFmpeg 目录、显卡排队地址、中文语音转写的根目录和解释器写进 .video-machine.json",
     "source": "E:\\PCConfig\\docs\\runtime\\video_scaffold.md；.video-machine.json"
    },
    {
     "id": "r-pcconfig-gpu",
     "with": "pcconfig",
     "direction": "请它帮忙",
     "flow": "渲染用显卡编码前，向电脑配置与恢复的显卡排队服务（127.0.0.1:32100）领 120 秒租约、每 40 秒续；和本地大模型、听写轮流用显卡",
     "source": "pipeline/gpu.py；config.py 第 206–207 行"
    },
    {
     "id": "r-fish-audio",
     "with": "Fish Audio（外部服务）",
     "direction": "交出去再拿回",
     "flow": "把每场旁白文字发给 Fish Audio 云端（s2.1-pro-free、云飞声线），拿回 mp3 和逐字时间戳；会用账户额度",
     "source": "config.py 第 122–127 行；pipeline/fish_tts.py；pipeline/fish_native.py"
    },
    {
     "id": "r-github-actions",
     "with": "GitHub Actions（外部服务）",
     "direction": "交出去",
     "flow": "每次推送 main 或提 PR，GitHub 跑 Windows/Linux 单元测试和 Linux CPU 整链短片，不用个人配置和 Fish 账户",
     "source": ".github/workflows/validation.yml"
    },
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "按需另用",
     "flow": "只在要读素材图片里的字时由 AI 另外调用本地文字识别；视频代码里没有调用，也不拿它识别自己生成的画面",
     "source": "docs/WORKFLOW.md「最小依赖与使用边界」"
    },
    {
     "id": "r-bilibili",
     "with": "B 站（外部平台）",
     "direction": "交出去（由我）",
     "flow": "章节按 B 站格式写，发不发由我定；工具本身不上传",
     "source": "pipeline/chapters.py 第 1–13 行；README.md 第 7 行"
    }
   ],
   "highlights": [
    {
     "id": "h-cue-on-words",
     "title": "动画踩着旁白的字",
     "screen": "video-scaffold-07"
    },
    {
     "id": "h-tail-silence",
     "title": "两场之间补一口气",
     "screen": "video-scaffold-07"
    }
   ],
   "mentions": [
    {
     "target": "/rules/charter/#L25",
     "screen": "video-scaffold-01",
     "text": "偶尔用 · 只修报错，不加新功能〔约法 L25〕"
    },
    {
     "target": "/how/#video-scaffold",
     "screen": "video-scaffold-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "video-scaffold-04",
     "text": "没有才交给〔中文语音转写〕按已知的文字对齐"
    },
    {
     "target": "/projects/chinese-asr/",
     "screen": "video-scaffold-05",
     "text": "备用模型在本机显卡上跑，归〔中文语音转写〕管"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "video-scaffold-05",
     "text": "〔电脑配置与恢复〕的显卡排队服务"
    }
   ],
   "live": []
  },
  "notes": {
   "merged": [
    "底稿“字幕封面章节”拆成三条：f-cover 封面、f-chapters 章节、f-subtitles 字幕——三样做法、上线时间和状态都不同（封面、章节 6 月就有且用过，字幕 9 月 18 日才加）。",
    "底稿“成片核验”拆成两条：f-verify 成片核验、f-manifest 交付清单——底稿的出处 workflow.py:295 是 manifest 阶段，核验和开清单是两个命令，清单 9 月 18 日才加。",
    "底稿之外补了 9 条：f-live-probe、f-status、f-script-split、f-voice-tags、f-prompts、f-smoke（现役代码里有、底稿没列），f-all-in-one、f-publish-kit、f-archive、f-whisper（已停用，按“写全”列出，方便看出退役了什么）。f-all-in-one 合并了旧入口的 all、ship、reset 三个命令。"
   ],
   "dropped": [
    "demo 命令没有单列：它和 smoke 调用同一个隔离自测（run_demo.py 只是转调 pipeline.smoke），并进 f-smoke。",
    "test、module、script、python 这几个维护用的命令不算功能，没有上。",
    "背景重建脚本 background/render_background.py（moderngl 着色器）没有单列：只在要换背景时用，现在的背景是一次做好的 60 秒循环片。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 1 屏“选题、写旁白、发不发，都由我定；中间我只出手两次：听着旁白看预览，最后看一遍成片。”；第 2 屏“跟 AI 这样说就行”的四句；第 7 屏“我要章节少、标题短。”（依据提交 cf7e9dc 写的“the explicit ask: fewer + shorter”，原话没找到）；第 10 屏“我定了：以后做不做视频再说，但这个项目要留着，想做的时候随时能做出来”（翻自决定 D8“可以不做视频，但不能没有这个项目”）。",
    "第一期视频的名字和平台：提交 f346d4e 只写“The first video (MD 氪金指南) is published”；“游戏王 MD”来自同期配置里的识别热词“游戏王MD”；平台按章节格式推断是 B 站，没有直接记录。请本人确认名字写成《游戏王 MD 氪金指南》是否合适、要不要写平台。",
    "“1 期”：只找到第一期发布的记录；第 2 期骨架（f346d4e 之后）有没有做成片，没找到证据，也没去私人媒体文件夹里翻。第一期原件归档到 E:\\video-archive\\md-krijin-v1\\，这个文件夹现在不存在，去向未查清。",
    "功能状态的判法（第 8 屏“怎么判的”）已由 Claude 确认：“待验收”＝做好了、还没在真实使用里验过。审稿后按这个判法统一改：6 月以后新加或换了做法、没用在一期真视频上的 11 项标“待验收”（查进度、配音生成、逐字时间轴、布局预检、有声预览、断点渲染、视频合成、字幕、成片核验、交付清单、清理中间文件）；新项目准备、封面、章节、场景制作只是加了防错检查，做法没变，仍标“在用”。",
    "Fish 配音花不花钱：9 月的文档说 doctor-live 和真配音“消耗账户额度”；6 月的旧注释说 s2.1-pro-free 配这个声线“不需要 API 额度”。页面只写了“会用额度”，没写要花钱。",
    "截图都来自我 9 月 28 日在草稿文件夹里跑的隔离自测（合成测试音、CPU 编码、标题“合成验收测试”），不是真视频的画面；旧网站和仓库里没有这个项目的真实截图（仓库里唯一的图是写着 PLACEHOLDER 的占位图）。第一期成片的真实画面如果找得到，比自测样片更好。",
    "旁白分场（第 8 屏第 5 项）标“说不准”没按审稿第 4 条改成“在用”：第一期用的是旧入口 build_v2.py 自己的 write_scripts，它只把代码里事先写好的每场文字各存一个文件；卡片说的“把一整篇旁白按段切开”是 pipeline/prep.py 的 slice_script＋write_scripts（6 月 26 日就有），旧入口没调它，第一期用没用查不到。“每场一个文本文件”这件事当时确实做过，切整篇旁白这一步没有证据。",
    "按本人“亮点只收已经在用的做法”的规矩，亮点只留两招（动画踩着旁白的字、两场之间补一口气，6 月第一期就这样做，f346d4e 版 build_scene.py 和 fish_tts.py 里都有）；3:47 错位挪进演进，改一场只重做一场、动画开头结尾都量、章节少而短、踩点写错就拦下挪进技术节（第 6 屏）并标明没在真视频上用过。另：数帧修法是 6 月 27 日 14:48 提交的，第一期到 6 月 28 日 03:33 前才发布，发布的那版很可能已经是修过之后渲染的，但没有记录能证实，所以演进照 Claude 的要求写“已改好，还没在下一期真片上验过”。",
    "第 1 屏插画屏幕上的“核心结论”和第 7 屏插画里的“先说结论 核心结论”来自仓库文档里的示例文字（docs/AUTHORING.md、docs/VOICE.md），不是真视频内容。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/video-scaffold/page.json",
  "sha256": "735573a49b620ffdc73b0518a60f55e4a84008cf7e2de099ff8b2ca819178b71",
  "converted_at_beijing": "2026-10-10T11:55:34+08:00"
 }
}
---

::screen{#video-scaffold-01 section="top"}

```typeset
{
 "screen": {
  "id": "video-scaffold-01",
  "section": "top",
  "title": "开头",
  "scene": "横版：左上大标题毛笔艺术字“本地视频制作”，标题下一枚小圆角标签（浅绿底）写状态那一行，其中“约法 L25”画成链接样式；标签下面是介绍段。右上一幅水彩插画：一台宽屏显示器，屏幕里是浅绿色流动的毛玻璃背景，上面一行深绿大字“核心结论”正在逐字打出（最后一个字半透明）；（text 里单独一行的“核心结论”就是屏幕上这四个字，不另画别处。）显示器左边一支立式麦克风，麦克风和屏幕之间飘着一条绿色声波；右边一块打板（场记板）和一小叠照片素材；显示器下面一张发着绿光的显卡；周围水彩绿叶。中间一排四张数字卡片（和电脑配置与恢复页第一屏的数字卡同一画法：上面小插画，大号绿色数字，下面一两行小字）：卡 1 插画一块 4K 屏幕，卡 2 插画一支笔在描一条曲线旁边一个跳动的数字，卡 3 插画一卷胶片带一个对勾，卡 4 插画一张打了很多小勾的测试清单。数字卡片右下角一行浅灰小字写截至日期。最下面一行两个按钮：左边一个白底细绿边的长按钮写“在整套系统里的位置 → 怎么协作”，右边一个带 GitHub 小猫标志的按钮写“GitHub”。这个项目没有自动任务，不画“现在”横条。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版从上到下：标题、状态标签、介绍段；插画放在介绍段下面，占满宽度；四张数字卡两张一行排两行；截至日期；两个按钮上下各占一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "约法 L25",
    "href": "/rules/charter/#L25"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#video-scaffold"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/video-scaffold"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/video-scaffold/#ai-brief"
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
     "row": "hero",
     "width": "48%",
     "align": "left",
     "size": "large",
     "text_ref": "本地视频制作"
    },
    {
     "type": "tag",
     "row": "hero",
     "align": "left",
     "text_ref": "偶尔用 · 只修报错"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次更新 10 月 8 日 15:52",
       "state": "ok"
      },
      {
       "text": "近 7 天改进了 19 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · 项目修改记录",
     "row": "hero"
    },
    {
     "type": "prose",
     "row": "hero",
     "align": "left",
     "text_ref": "把定好的文案和素材交给 AI"
    },
    {
     "type": "illustration",
     "row": "hero",
     "width": "52%",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "asset": "_library/fix-round-2/video-monitor-labeled.png"
    },
    {
     "type": "stat_card",
     "columns": 3,
     "align": "left",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "3840×2160",
     "columns_v": 1,
     "rows": [
      1,
      3
     ]
    },
    {
     "type": "prose",
     "align": "center",
     "text_ref": "核心结论",
     "textless": true
    },
    {
     "type": "action_button",
     "columns": 3,
     "align": "left",
     "text_ref": "在整套系统里的位置 → 怎么协作"
    }
   ],
   "notes": "按原定稿构图：横版左标题/标签/介绍、右显示器主插画，竖版依序整宽；四数字原文与三按钮保留。scene明确单独一行“核心结论”只归显示器画面。fix-round-2按e334bf56引导使用Luna编辑、根Sol核字的显式插画asset，四字只在显示器内出现；对应prose.textless=true经当前scene/唯一原节点/0links校验，不再另排正文。原source.text/links不改，原字号档、字色和motion字段保留。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "本地视频制作"
    },
    {
     "type": "tag",
     "align": "left",
     "text_ref": "偶尔用 · 只修报错"
    },
    {
     "type": "live_strip",
     "frame_mode": "plain",
     "static_items": [
      {
       "text": "偶尔用 · 上次更新 10 月 8 日 15:52",
       "state": "ok"
      },
      {
       "text": "近 7 天改进了 19 次",
       "state": "fact"
      }
     ],
     "static_note": "截至 10 月 10 日 · 项目修改记录"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "3840×2160",
     "rows": [
      1,
      1,
      1,
      1
     ]
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "把定好的文案和素材交给 AI"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "asset": "_library/fix-round-2/video-monitor-labeled.png"
    },
    {
     "type": "prose",
     "align": "center",
     "text_ref": "核心结论",
     "textless": true
    },
    {
     "type": "action_button",
     "columns": 1,
     "align": "center",
     "text_ref": "在整套系统里的位置 → 怎么协作"
    }
   ],
   "notes": "按原定稿构图：横版左标题/标签/介绍、右显示器主插画，竖版依序整宽；四数字原文与三按钮保留。scene明确单独一行“核心结论”只归显示器画面。fix-round-2按e334bf56引导使用Luna编辑、根Sol核字的显式插画asset，四字只在显示器内出现；对应prose.textless=true经当前scene/唯一原节点/0links校验，不再另排正文。原source.text/links不改，原字号档、字色和motion字段保留。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "显卡",
   "source_phrase": "3840×2160 · 60 帧｜成片画面，显卡 AV1 编码",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
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
   "source_phrase": "32 种动画｜打字、描线、数字滚动、3D 翻牌……都能踩着旁白的字出现",
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
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "1 期｜做完并发布的视频：6 月的《游戏王 MD 氪金指南》",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/GitHub标志.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "GitHub标志",
   "source_phrase": "91 个｜自动测试；每次推送还在 GitHub 上用合成声音完整出一条短片",
   "sha256": "d2e4c70ecb430e719cbb90667b9cc0920c668ab503ec15b96d2e4be0acc9154f",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-video-scaffold",
   "source_phrase": "右上一幅水彩插画：一台宽屏显示器，屏幕里是浅绿色流动的毛玻璃背景，上面一行深绿大字“核心结论”正在逐字打出（最后一个字半透明）；（text 里单独一行的“核心结论”就是屏幕上这四个字，不另画别处。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready",
   "original_elements": [
    "一台宽屏显示器，屏幕里是浅绿色流动的毛玻璃背景，上面一行深绿大字抽象图形正在逐字打出（最后一个字半透明）；（text 里单独一行的抽象图形就是屏幕上这四个字，不另画别处"
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
   "asset": "_library/titles/title-53b3f1b94558a15a78ab.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-53b3f1b94558a15a78ab",
   "title_text": "本地视频制作",
   "sha256": "ef06d75d9fbc36aea8db2e718e3d3f2d65d62f3e5cae4f8625eda062c8cb16f8",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 本地视频制作

偶尔用 · 只修报错，不加新功能〔约法 L25〕

把定好的文案和素材交给 AI，它调云端配好音，让动画踩着旁白的字出现，在这台电脑上渲染成 4K 视频，再配好封面、章节和字幕。选题、写旁白、发不发，都由我定；中间我只出手两次：听着旁白看预览，最后看一遍成片。

- **3840×2160 · 60 帧**｜成片画面，显卡 AV1 编码
- **32 种动画**｜打字、描线、数字滚动、3D 翻牌……都能踩着旁白的字出现
- **1 期**｜做完并发布的视频：6 月的《游戏王 MD 氪金指南》
- **130 个**｜自动测试；每次推送还在 GitHub 上用合成声音完整出一条短片

核心结论

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#video-scaffold-02 section="usage"}

```typeset
{
 "screen": {
  "id": "video-scaffold-02",
  "section": "usage",
  "title": "做一期视频，怎么走一遍",
  "scene": "横版：左上标题（毛笔艺术字加绿色笔刷线），标题下一行小字解释“场”。左边约五分之三宽：八个步骤沿一条弯弯的绿色胶片带从上往下排，每步一个圆形编号、一个角色小徽章（“我”画成一只小手、“AI”画成一个小对话气泡、“程序”画成一个小齿轮，“程序＋我”两个徽章并排）和一两行字；第 6、8 步的底色换成浅黄，旁边画一只小手，表示我出手的两处。右边约五分之二宽，上半部分留一个带细浅绿边框的截图空位（宽高比 5:4，约占右栏宽度的全部、屏幕高度的一半），截图下面一行小字是截图说明；下半部分一张便签样式的小卡片，标题“跟 AI 这样说就行”，下面四句话各带一个对话气泡小图标。",
  "portrait": "竖版：标题和解释在最上面；截图空位紧跟其后（占满宽度），下面是截图说明；然后八个步骤一行一步竖排，胶片带变成左侧一条竖线；最后是“跟 AI 这样说就行”小卡片。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/5600d0cbabf061be9dc1f1d70e3727f9ef43ccb02bb6e6778872c1ec7e80f4de.png",
    "where": "右栏上半，宽高比 5:4 的细浅绿边框空位（竖版在标题下面占满宽度）",
    "caption": "有声预览的真实截图。片子是自测用的示例，配的是合成声音，不是哪一期真视频；底部那行“使用真实配音”是预览页的固定提示。左边选场，下面点词跳到那一秒；展开后能改某个动画踩第几次出现的词、提前或推后几秒，另存成新的画面文件，不改原件",
    "portrait_locator_text": "定题、写好旁白，连同图片素材交给 AI。",
    "crop_h": [
     280,
     553,
     1050,
     1072
    ],
    "crop_v": [
     291,
     700,
     1044,
     1067
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
     "text_ref": "做一期视频，怎么走一遍"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "一段旁白配一个画面"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "align": "left",
     "illustration": "left_inside",
     "connector": "ribbon",
     "highlight": [
      6,
      8
     ],
     "icons": "auto",
     "text_ref": "我 定题、写好旁白"
    },
    {
     "type": "screenshot",
     "columns": 1,
     "align": "center",
     "ratio": "5:4",
     "row": "balanced-preview",
     "width": "35%",
     "row_fit_illustration": true
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "有声预览的真实截图",
     "row": "balanced-preview",
     "width": "65%"
    },
    {
     "type": "notice",
     "align": "left",
     "illustration": "left_inside",
     "tone": "green",
     "text_ref": "跟 AI 这样说就行",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "row": "balanced-preview"
    }
   ],
   "notes": "实图左栏八步沿弯曲胶片带竖排，圆形编号、角色小徽章紧贴左侧，每步右端还各有小图；第6、8步浅黄，手掌角色保留。右栏顶部5:4纯白截图槽、外部图注、下方四句便签；无大插画。caption在定稿最后，放回右栏截图下是空间重排。现flow可做竖向ribbon及highlight，但角色徽章、右端小图和双徽章需在组件样张核对，不能用默认上图下文替代。整屏标题依统一标准居中。；page-fixer-09（按审页意见）：移除未生效小号字字段，沿用共享正文；单张提示移除无效外卡列数字段",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "做一期视频，怎么走一遍"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "一段旁白配一个画面"
    },
    {
     "type": "screenshot",
     "columns": 1,
     "align": "center",
     "ratio": "5:4"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "align": "left",
     "illustration": "left_inside",
     "connector": "ribbon",
     "highlight": [
      6,
      8
     ],
     "icons": "auto",
     "text_ref": "我 定题、写好旁白"
    },
    {
     "type": "notice",
     "align": "left",
     "illustration": "left_inside",
     "tone": "green",
     "text_ref": "跟 AI 这样说就行",
     "icons": [
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ]
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "有声预览的真实截图"
    }
   ],
   "notes": "原竖版顺序v→v2：v为标题、解释、整宽空白截图、步骤1–6；v2为步骤7、8、四句便签、最下整宽caption卡。实图caption并未紧贴截图，和portrait描述冲突，此规格按实图留在最后；须保留唯一完整caption。第6、8步黄色，步骤7、8的原续图去掉右端插画、用大编号和大角色名，角色语义不丢。按完整步骤拆张，不截卡。；page-fixer-09（按审页意见）：移除未生效小号字字段，沿用共享正文；单张提示移除无效外卡列数字段",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "我　定题、写好旁白，连同图片素材交给 AI。",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "AI　开一个空白的新项目，先查环境：Python、FFmpeg、浏览器组件、显卡排队、对时间要用的中文语音转写齐不齐。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "AI　把旁白按场分好，调 Fish Audio 配音，再记下每个字在第几秒说出。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "AI　每场拿到一份提示（旁白、能踩点的词、素材路径），照着写出这场的画面，并注明每个动画在旁白说到哪个词时出现。",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "程序　把每场画面组装好，先查一遍：踩点的词旁白里有没有、字有没有跑出画面。有问题就停，不往下做。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "我　打开有声预览，边听边看；点一个词就跳到那一秒。哪里不对，让 AI 改。",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "代码窗口",
   "source_phrase": "程序　逐帧渲染成 4K 视频，合上旁白（有背景音乐就一起垫上），做封面、章节，要的话再出字幕。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
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
   "source_phrase": "程序＋我　程序核对成片的来源、时长、帧数，过了才开交付清单；我完整看一遍、听一遍，决定发不发。",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "“用这份旁白和这几张图做一期视频”\n  “先给我有声预览”\n  “预览没问题，出成片”\n  “渲染断了，接着做”",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "“用这份旁白和这几张图做一期视频”\n  “先给我有声预览”\n  “预览没问题，出成片”\n  “渲染断了，接着做”",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "“用这份旁白和这几张图做一期视频”\n  “先给我有声预览”\n  “预览没问题，出成片”\n  “渲染断了，接着做”",
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
   "asset": "_library/titles/title-d8d18231794edfce8674.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-d8d18231794edfce8674",
   "title_text": "做一期视频，怎么走一遍",
   "sha256": "fa54edbff0db627ff454e812d8e313f53c934b0b4442c3dbed9b347dd748093c",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 做一期视频，怎么走一遍

一段旁白配一个画面，叫一“场”。

1. **我**　定题、写好旁白，连同图片素材交给 AI。
2. **AI**　开一个空白的新项目，先查环境：Python、FFmpeg、浏览器组件、显卡排队、对时间要用的中文语音转写齐不齐。
3. **AI**　把旁白按场分好，调 Fish Audio 配音，再记下每个字在第几秒说出。
4. **AI**　每场拿到一份提示（旁白、能踩点的词、素材路径），照着写出这场的画面，并注明每个动画在旁白说到哪个词时出现。
5. **程序**　把每场画面组装好，先查一遍：踩点的词旁白里有没有、字有没有跑出画面。有问题就停，不往下做。
6. **我**　打开有声预览，边听边看；点一个词就跳到那一秒。哪里不对，让 AI 改。
7. **程序**　逐帧渲染成 4K 视频，合上旁白（有背景音乐就一起垫上），做封面、章节，要的话再出字幕。
8. **程序＋我**　程序核对成片的来源、时长、帧数，过了才开交付清单；我完整看一遍、听一遍，决定发不发。

**跟 AI 这样说就行**
- “用这份旁白和这几张图做一期视频”
- “先给我有声预览”
- “预览没问题，出成片”
- “渲染断了，接着做”

有声预览的真实截图。片子是自测用的示例，配的是合成声音，不是哪一期真视频；底部那行“使用真实配音”是预览页的固定提示。左边选场，下面点词跳到那一秒；展开后能改某个动画踩第几次出现的词、提前或推后几秒，另存成新的画面文件，不改原件

::screen{#video-scaffold-03 section="usage"}

```typeset
{
 "screen": {
  "id": "video-scaffold-03",
  "section": "usage",
  "title": "交出来什么，出了事怎么办",
  "scene": "横版：左上标题。左右两栏。左栏“交出来的东西”：五行，每行左边一个小水彩图标（胶片、一张封面图、书签、字幕条、一张带对勾的清单），右边粗体名称加一句话；左栏下方留一个带细浅绿边框的截图空位（16:9，约左栏宽度的三分之二），下面一行截图说明。右栏“出了事怎么办”：四张横向小卡片，每张左边一个小图标（静音的铃铛、放大镜照着进度条、断开又接上的胶片、垃圾桶旁一个问号），粗体一句加一行小字。最下面一条横跨整屏的浅绿细卡片“现在能不能用”，左边一个小体检表图标，右边两三行字。",
  "portrait": "竖版：标题；“交出来的东西”五行一行一条；截图空位占满宽度，下面截图说明；“出了事怎么办”四张卡一行一张；最后“现在能不能用”卡片。",
  "links": [],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/f63d478b4550f44b34d54887cf5d3807c341d1ee7c443ca2c3f20371752a3f40.png",
    "where": "左栏下方，16:9 细浅绿边框空位，约左栏宽度的三分之二（竖版占满宽度）",
    "caption": "示例封面：自测样片自动生成的，标题是测试用的名字，不是哪一期真视频",
    "crop_h": [
     0,
     315,
     1600,
     537
    ],
    "crop_v": [
     110,
     243,
     1250,
     611
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
     "text_ref": "交出来什么，出了事怎么办"
    },
    {
     "type": "section_heading",
     "row": "delivery",
     "width": "52%",
     "align": "left",
     "size": "medium",
     "text_ref": "交出来的东西"
    },
    {
     "type": "content_card",
     "row": "delivery",
     "columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/相机.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/icons/书签册.png",
      "_library/icons/文件写作.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "text_ref": "成片",
     "icon_size": 96
    },
    {
     "type": "section_heading",
     "row": "delivery",
     "width": "48%",
     "align": "left",
     "size": "medium",
     "text_ref": "出了事怎么办"
    },
    {
     "type": "content_card",
     "row": "delivery",
     "columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/icons/放大镜.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "没有自动提醒。",
     "icon_size": 96
    },
    {
     "type": "screenshot",
     "columns": 1,
     "align": "center",
     "ratio": "16:9",
     "max_width": 550
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "示例封面：自测"
    },
    {
     "type": "notice",
     "align": "left",
     "illustration": "left_inside",
     "tone": "green",
     "text_ref": "现在能不能用",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ]
    }
   ],
   "notes": "实图标题右方有独立卡外插画（显示器、封面、字幕、清单），不能漏掉；主体两栏各有浅绿外框。左栏五项是紧凑图标行，同属一栏容器，不宜套五张大卡；截图占实际左栏近全宽、caption在下，和scene约2/3宽有差异，按实图。右栏四个横向小卡、图标在卡内左侧。底部现在能不能用是全宽说明卡，含日期和完整环境段落，不是实时槽。；page-fixer-09（按审页意见）：移除未生效小号字字段，沿用共享正文；单张提示移除无效外卡列数字段；标题全宽居中、移除重复大插画，交付图标明确；截图百分比上限转550源px；2026-10-11 本页留白修正：交付与故障处理保持两栏，小图标统一96源px；封面与原图注单列在两栏之后，不参与两栏高度。全部原文与原图保留。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "交出来什么，出了事怎么办"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "交出来的东西"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": [
      "_library/icons/相机.png",
      "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
      "_library/icons/书签册.png",
      "_library/icons/文件写作.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png"
     ],
     "text_ref": "成片"
    },
    {
     "type": "screenshot",
     "columns": 1,
     "align": "center",
     "ratio": "16:9"
    },
    {
     "type": "prose",
     "align": "center",
     "text_ref": "示例封面：自测"
    },
    {
     "type": "section_heading",
     "align": "center",
     "size": "large",
     "text_ref": "出了事怎么办"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": [
      "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
      "_library/icons/放大镜.png",
      "_library/hires-icons-r2/icon-clean-73c422e226c420c598eb.png",
      "_library/fix-round-2/icon-clean-584a7a3acf82a1db78d6.png"
     ],
     "text_ref": "没有自动提醒。"
    },
    {
     "type": "notice",
     "align": "left",
     "illustration": "left_inside",
     "tone": "green",
     "text_ref": "现在能不能用",
     "icons": [
      "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png"
     ]
    }
   ],
   "notes": "原竖版v→v2：v含标题、交出来的东西五张左图右字整宽卡、整宽白框和caption；v2从出了事怎么办的大毛笔组名开始，四个无图整宽问答卡，最后现在能不能用大说明卡。横图标题旁插画在竖图省掉；右栏小图标在v2也省掉，不能机械横竖共享。此第二张组名来自定稿group节点，只出现一次。；page-fixer-09（按审页意见）：移除未生效小号字字段，沿用共享正文；单张提示移除无效外卡列数字段；标题全宽居中、移除重复大插画，交付图标明确；截图百分比上限转550源px",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "source_phrase": "胶片",
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
   "source_phrase": "一张封面图",
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
   "asset": "_library/icons/书签册.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "书签册",
   "source_phrase": "书签",
   "sha256": "c363edd0cb76d7fcdcf03abae41e213c92ebca7b434076607db2620e00e62e33",
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
   "source_phrase": "字幕条",
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
   "asset": "_library/icons/文件写作.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件写作",
   "source_phrase": "交付清单 ：记下每个文件的内容指纹（SHA-256，文件改一个字节就变）和来源，写明“还要人看过”",
   "sha256": "28af955cf2d0855d3f91be0690a129e092af2b43346eb766b773beab8f70519b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "现在能不能用（9月28日查）\n环境检查10项通过、1项没测（这次没真调Fish配音）；同一天在草稿文件夹里跑了一遍隔离自测，用合成声音、CPU编码完整出了一条2.4秒的样片，全部核对通过；9月26日GitHub上的自动测试（也是CPU）也通过。改版后的真配音、显卡编码和中文语音转写对齐，一次都还没真跑过。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "放大镜",
   "source_phrase": "不知道做到哪了。 让 AI 查进度：它列出哪些结果已经过期、为什么、该从哪一步重做。",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件核验",
   "source_phrase": "渲染断了。 接着渲染：核对过的片段直接用，只补缺的和坏的。",
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
   "asset": "_library/round3/clean-assets/png/05-灯泡-clean.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "灯泡",
   "source_phrase": "清理没删干净。 它列出没删掉的文件，不假装成功。",
   "sha256": "1b747452a1b8f0ee4b37b0f84b8c0108ef6554cd2fee1c989cb72e0409cc2165",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "现在能不能用（9月28日查）\n环境检查10项通过、1项没测（这次没真调Fish配音）；同一天在草稿文件夹里跑了一遍隔离自测，用合成声音、CPU编码完整出了一条2.4秒的样片，全部核对通过；9月26日GitHub上的自动测试（也是CPU）也通过。改版后的真配音、显卡编码和中文语音转写对齐，一次都还没真跑过。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "现在能不能用（9月28日查）\n环境检查10项通过、1项没测（这次没真调Fish配音）；同一天在草稿文件夹里跑了一遍隔离自测，用合成声音、CPU编码完整出了一条2.4秒的样片，全部核对通过；9月26日GitHub上的自动测试（也是CPU）也通过。改版后的真配音、显卡编码和中文语音转写对齐，一次都还没真跑过。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-video-scaffold",
   "source_phrase": "横版：左上标题。左右两栏。左栏“交出来的东西”：五行，每行左边一个小水彩图标（胶片、一张封面图、书签、字幕条、一张带对勾的清单），右边粗体名称加一句话；左栏下方留一个带细浅绿边框的截图空位（16:9，约左栏宽度的三分之二），下面一行截图说明。右栏“出了事怎么办”：四张横向小卡片，每张左边一个小图标（静音的铃铛、放大镜照着进度条、断开又接上的胶片、垃圾桶旁一个问号），粗体一句加一行小字。最下面一条横跨整屏的浅绿细卡片“现在能不能用”，左边一个小体检表图标，右边两三行字。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-f8960d493c3be57935f6.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\video-scaffold\\img\\video-scaffold-03-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-f8960d493c3be57935f6",
   "title_text": "交出来什么，出了事怎么办",
   "sha256": "eb46035423c7b0dd557486a0031983e79e4f750c85cb056a4cebcd33914879d9",
   "status": "ready",
   "source_box": [
    37,
    39,
    899,
    190
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 交出来什么，出了事怎么办

**交出来的东西**
- **成片**：4K、60 帧、AV1 编码；要背景音乐就放一首进去，它自动垫在旁白下面
- **封面**：一张 3840×2160 的图，标题、副标题，可选一张主图
- **章节**：B 站认的“分:秒 标题”格式，从 00:00 开始
- **字幕**：SRT 和 WebVTT 两个单独的文件，不烧进画面
- **交付清单**：记下每个文件的内容指纹（SHA-256，文件改一个字节就变）和来源，写明“还要人看过”

示例封面：自测样片自动生成的，标题是测试用的名字，不是哪一期真视频

**出了事怎么办**
- **没有自动提醒。** 它不在后台跑，出问题直接跟 AI 说。
- **不知道做到哪了。** 让 AI 查进度：它列出哪些结果已经过期、为什么、该从哪一步重做。
- **渲染断了。** 接着渲染：核对过的片段直接用，只补缺的和坏的。
- **清理没删干净。** 它列出没删掉的文件，不假装成功。

**现在能不能用**（9 月 28 日查）
环境检查 10 项通过、1 项没测（这次没真调 Fish 配音）；同一天在草稿文件夹里跑了一遍隔离自测，用合成声音、CPU 编码完整出了一条 2.4 秒的样片，全部核对通过；9 月 26 日 GitHub 上的自动测试（也是 CPU）也通过。改版后的真配音、显卡编码和中文语音转写对齐，一次都还没真跑过。

::screen{#video-scaffold-04 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-04",
  "section": "tech",
  "title": "画面是怎么做出来的",
  "scene": "横版：左上标题。上半屏一张从左到右的流程图：六个节点（圆角卡片，每个一个小水彩图标：麦克风、带刻度的声波、铅笔画矢量曲线、一个时钟指针、并排四个小浏览器窗口、一卷胶片叠在一块玻璃上），绿色箭头依次连起来，每个节点下面粗体名称加一两行小字；第 3 个节点里的那段代码用等宽字体、浅绿底色。下半屏左边留一个带细浅绿边框的截图空位（16:9，约屏幕宽度的一半），下面一行截图说明；右边画一条横向的时间刻度水彩示意：一条胶片被切成五小段，四支画笔各拿一段在画，表示分段并行（不写字）。",
  "portrait": "竖版只现有video-scaffold-04-v一张、原编号1–6、全部原文及唯一原图注，不新增目标。新9:16画布按全站已验收绿白水彩、统一标题正文层级排；样张只借风格，不借其图文或构图。六卡各从原编号、原粗体标题、竖线、原正文在同一整宽行开始，长文自然续行，不另占一行大卡标题。净正文860源px，正文36源px、行高44；去非必要大插画，不用左大图右窄字。六卡正文15行660px，卡内上下padding合144px、五间距60px；原标题64px及间距20px；唯一16:9平整白框860×484源px，原图注在框外下方2行88px；截图与图注间距合24px、上下边距48px，总1592/1672余80px。框内完全空白，不画假玻璃背景/假截图字，不补画笔胶片、标签、数字或空框。源text/真实caption/截图记录/横scene不改，正确字不降，普通图片不加放大入口。新画布按此排，旧左图右字不作为编辑约束。",
  "links": [
   {
    "text": "中文语音转写",
    "href": "/projects/chinese-asr/"
   }
  ],
  "anchors": [],
  "live": [],
  "screenshots": [
   {
    "file": "sources/assets/_references/1eca69a57c1985645dd89fc8cbfa4d8620fec58d0c14ed6c818c0fccad610b9e.png",
    "where": "下半屏左边，16:9 细浅绿边框空位，约屏幕宽度的一半（竖版占满宽度）",
    "caption": "示例画面：自测样片里的一帧（用 CPU 编码），字叠在循环的玻璃背景上",
    "crop_h": [
     0,
     134,
     1600,
     766
    ],
    "crop_v": [
     0,
     73,
     1600,
     828
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
     "text_ref": "画面是怎么做出来的"
    },
    {
     "type": "flow",
     "columns": 6,
     "direction": "horizontal",
     "align": "left",
     "illustration": "top_inside",
     "connector": "arrow",
     "icons": [
      "_library/icons/麦克风.png",
      "_library/icons/波形照片.png",
      "_library/icons/画笔调色板.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/相机.png"
     ],
     "text_ref": "配音"
    },
    {
     "type": "screenshot",
     "row": "bottom",
     "width": "50%",
     "columns": 1,
     "align": "center",
     "ratio": "16:9"
    },
    {
     "type": "prose",
     "row": "bottom",
     "align": "left",
     "text_ref": "示例画面：自"
    }
   ],
   "notes": "source_image为pages-approved明确批准的替换图，已查看替换图和旧横图；两者布局同构：六卡一排，图在卡内上方，绿色箭头从图高度串联；下面左半唯一纯白截图框＋外部caption、右半无字胶片与四画笔插画。第三图中原有data-cue示例字不是本屏定稿独立节点，复用资产必须去带字；只排定稿写画面段原文，不另造代码条或重加Fish Audio标题。；page-fixer-09（按审页意见）：移除未生效小号字字段，沿用共享正文；六步图标明确，手机编号/标题/正文分层并保留小图；横版删重复底图",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "medium",
     "text_ref": "画面是怎么做出来的"
    },
    {
     "type": "flow",
     "columns": 1,
     "direction": "vertical",
     "align": "left",
     "illustration": "left_inside",
     "connector": "none",
     "icons": [
      "_library/icons/麦克风.png",
      "_library/icons/波形照片.png",
      "_library/icons/画笔调色板.png",
      "_library/fix-round-2/icon-clean-ec6f32b73f88d6c9e058.png",
      "_library/hires-icons/代码窗口.png",
      "_library/icons/相机.png"
     ],
     "text_ref": "配音",
     "text_layout": "block",
     "icon_width": "18%"
    },
    {
     "type": "screenshot",
     "columns": 1,
     "align": "center",
     "ratio": "16:9"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "示例画面：自"
    }
   ],
   "notes": "已亲眼查看当前04-v；现图确为单张六个整宽横条，无任何左侧大插画、无箭头；编号、粗体名、竖线、正文从同一行开始，长文自然续行。下方唯一平整纯白16:9框，caption在外部下方，无胶片画笔插画。不得按旧左图右文重建。当前源图968×1624，最终输出941×1672的标准9:16并按定稿portrait净正文860、正文36、行高44等约定排；这类同一行短卡需组件样张核对，现flow默认可能把名称和正文拆行。；page-fixer-09（按审页意见）：六步图标明确，手机编号/标题/正文分层并保留小图；横版删重复底图",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "时钟",
   "source_phrase": "矢量曲线、一个时钟指针、并排四个小浏览器窗口、一卷胶片叠在一块玻璃上），绿色箭头依次连起来，每个节点下面粗体名称加一两行小字",
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h"
   ],
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "round2_same_project_main_reuse",
   "key": "main-video-scaffold",
   "source_phrase": "横版：左上标题。上半屏一张从左到右的流程图：六个节点（圆角卡片，每个一个小水彩图标：麦克风、带刻度的声波、铅笔画矢量曲线、一个时钟指针、并排四个小浏览器窗口、一卷胶片叠在一块玻璃上），绿色箭头依次连起来，每个节点下面粗体名称加一两行小字；第 3 个节点里的那段代码用等宽字体、浅绿底色。下半屏左边留一个带细浅绿边框的截图空位（16:9，约屏幕宽度的一半），下面一行截图说明；右边画一条横向的时间刻度水彩示意：一条胶片被切成五小段，四支画笔各拿一段在画，表示分段并行（不写字）。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/titles/title-r3-a636849de3b67d76b669.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\pipe\\shortjob\\engine\\production-b1-r1b\\state\\b1-video-scaffold-04-h\\round-01\\candidate-1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-a636849de3b67d76b669",
   "title_text": "画面是怎么做出来的",
   "sha256": "9b7c8f25d7c548822e927c3ff2ba2ec9e1b6c452b2771a01cf361684e3f4415a",
   "status": "ready",
   "source_box": [
    31,
    11,
    799,
    194
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

# 画面是怎么做出来的

1. **配音**｜Fish Audio 把每场旁白读成一段声音
2. **对时间**｜记下每个字几点几秒说出：优先用 Fish 返回的时间戳，没有才交给〔中文语音转写〕按已知的文字对齐
3. **写画面**｜每场一个矢量图（SVG）片段，给每个动画标上由旁白里哪个词触发；比如标“核心结论”，旁白说到这四个字时它才出现
4. **按时间画**｜每场的片段装进同一个网页模板，成了这场的场景网页；它只认一个时间：给它第几秒，它就画出那一秒的样子，和电脑快慢无关
5. **逐帧拍下**｜4 个无头浏览器（不开窗口的浏览器）并行，整条视频切成每段 5 秒，逐帧截透明图
6. **叠背景、编码**｜FFmpeg 把透明画面叠到 60 秒循环的 4K 玻璃背景上，显卡 AV1 编码；各段拼好，再合上旁白

示例画面：自测样片里的一帧（用 CPU 编码），字叠在循环的玻璃背景上

::screen{#video-scaffold-05 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-05",
  "section": "tech",
  "title": "用了什么模型和工具",
  "scene": "横版：左上标题。整屏一张三列表格（圆角外框、细浅绿分隔线、表头浅绿底），十行；每行最左边一个小水彩图标（麦克风、声波、铅笔、叠放的两张幻灯片、浏览器窗口、显卡芯片、音符、排队的小人、放大镜照着网页、打勾的清单）。第一行“Fish Audio”旁画 Fish Audio 的鱼形标志，最后一行“GitHub Actions”旁画 GitHub 小猫标志。表里的〔〕字画成链接样式。",
  "portrait": "竖版：表格改成十张小卡片一行一张：卡片上面粗体环节名和图标，下面第一行是“用的什么”，第二行是细节。",
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
     "text_ref": "用了什么模型和工具"
    },
    {
     "type": "table",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "环节"
    }
   ],
   "notes": "source_image为pages-approved批准替换图，已看替换及旧图。下方三列十行整宽表；列宽实际约18%/38%/44%，表头浅绿；每行图标在第一列左侧，Fish鱼标在第二列配音项，GitHub标在第二列最后项。细节完整自然换行，链接按定稿。不把逐行内容拆成横版十张卡。现table自动计算列宽且不读取icons字段，按原构图加行图标、固定比例需接入并出样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "用了什么模型和工具"
    },
    {
     "type": "table",
     "columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "环节"
    }
   ],
   "notes": "原竖版v→v2：v含标题、前五项（配音、对时间、画面、转场和质感、截帧），各卡左图右文，原环节名在卡头，下面用的什么与细节两条；v2后五项（编码、声音、显卡排队、预览、自动测试）无左图，整宽正文。不增独立表头大条；表头原字只完整出现一次，后续重复列名按data-echo。当前table会额外单排table-header且不放行图标，这与原图不同，需组件调整/样张。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "麦克风",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "声波",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/late-clean-review/pen-bottom-frame-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钢笔",
   "source_phrase": "铅笔",
   "sha256": "2d0d521fc4bad84cc12f472e1930bd6d0045f3efa00a238ee6dd31d23d3bb1c2",
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
   "source_phrase": "叠放的两张幻灯片",
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
   "source_phrase": "浏览器窗口",
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
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显卡",
   "source_phrase": "显卡芯片",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
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
   "source_phrase": "音符",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "排队的小人",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜照着网页",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-302d236597fc22e0ed9f.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-302d236597fc22e0ed9f",
   "title_text": "用了什么模型和工具",
   "sha256": "1f53a8f55c0181f9014c6e06ed10bbad98f68ce5ec02edd74a856c09dcd9fe4f",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 用了什么模型和工具

| 环节 | 用的什么 | 细节 |
|---|---|---|
| 配音 | Fish Audio 云端合成，s2.1-pro-free 模型，云飞声线 | 旁白文字会发到 Fish；能写 [emphasis]、[pause] 这类标记控制语气和停顿，标记不会被读出来 |
| 对时间 | Fish 返回的逐字时间戳；备用 Qwen3-ForcedAligner-0.6B | 备用模型在本机显卡上跑，归〔中文语音转写〕管，每场最长 300 秒；视频项目里不装语音模型 |
| 画面 | SVG ＋ 32 种动画 ＋ 组件库 | 组件库里有标题、数字爆开、对比表、仪表盘、3D 看板、粒子、路径变形这类现成件 |
| 转场和质感 | 场景之间 0.5 秒上浮淡入；轻暗角、细颗粒 | 渲染时直接做进画面 |
| 截帧 | Playwright 控制的无头 Chromium | 每个浏览器最多在内存里留 6 个场景页面，防止内存撑爆 |
| 编码 | FFmpeg，用显卡做 AV1 编码 | 恒定质量 22、10 位色深；哪段失败自动重试 2 次 |
| 声音 | FFmpeg | 旁白统一成 48 kHz 拼好；背景音乐音量 0.34，旁白一响就自动压低，片尾 1.2 秒淡出 |
| 显卡排队 | 〔电脑配置与恢复〕的显卡排队服务 | 渲染前领一张 120 秒的租约（不续就自动还回去），每 40 秒续一次；本地大模型和听写也用这块显卡 |
| 预览 | 本机临时网页服务 | 只在这台电脑上开，外面连不进来；只放预览用得到的文件 |
| 自动测试 | GitHub 自动测试 | 每次推送：Windows、Linux 各跑一遍测试，Linux 上再用 CPU 完整出一条短片 |

::screen{#video-scaffold-06 section="tech"}

```typeset
{
 "screen": {
  "id": "video-scaffold-06",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版：左上标题。上半屏：左边约三分之二宽，六张横向小卡片两列三行（每张左边一个小水彩图标：一个时钟和一帧胶片、一只举起的手掌、一个空着的导演椅、一支带锁的麦克风、一张显卡旁排队的小人、一个小工具箱），粗体一句加一两行小字；右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。下半屏一条横跨整屏的浅黄底细边框长卡片，标题是那句“这几招……”，下面四条两列两行，每条一个小图标（一条分成五段的胶片其中两段是虚线、一把尺子量着一行字、一个书签、一个写错的字被红圈圈住），粗体短标题加一两行字；卡片右上角一个黄色小圆点表示“待验收”。",
  "portrait": "竖版：标题；六张卡一行一张；三张大数字卡并排成一行小卡；最后是浅黄底长卡片，四条一行一条。",
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
     "text_ref": "为什么这样设计"
    },
    {
     "type": "numbered_steps",
     "row": "design",
     "width": "67%",
     "columns": 2,
     "align": "left",
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "每一帧按时间算出来。"
    },
    {
     "type": "stat_card",
     "row": "design",
     "width": "33%",
     "columns": 1,
     "align": "left",
     "illustration": "top_inside",
     "icons": "auto",
     "text_ref": "8963行"
    },
    {
     "type": "notice",
     "align": "left",
     "illustration": "left_inside",
     "tone": "yellow",
     "text_ref": "这几招：自测里跑通了",
     "icons": [
      "_library/icons/文件齿轮.png"
     ],
     "columns": 2
    }
   ],
   "notes": "实图六原则卡两列三行，卡内左图右文，右栏三数字卡竖排，数字在左、插画在右，与普通上图数字卡有差异。下方一张全宽浅黄卡内四条实际按左右两列两行：左上改一场、左下章节少而短、右上动画开头结尾、右下踩点写错；保留定稿顺序语义和唯一原文，不把视觉列读序当改文依据。右上黄色状态点为装饰，不新增状态词。现numbered_steps不完整支持left_inside、stat_card没有右图模式、notice不读取columns且黄底仍回退绿底；需组件样张接入这三处。；page-fixer-09（按审页意见）：提示正文用现已支持columns兑现两列",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "为什么这样设计"
    },
    {
     "type": "numbered_steps",
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "left_inside",
     "connector": "none",
     "icons": "auto",
     "text_ref": "每一帧按时间算出来。"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "none",
     "icons": "none",
     "text_ref": "8963行"
    },
    {
     "type": "notice",
     "align": "left",
     "illustration": "none",
     "tone": "yellow",
     "text_ref": "这几招：自测里跑通了"
    }
   ],
   "notes": "原竖版v→v2：v是标题和原则1–5（卡内左图右文）；v2原则6是无图整宽卡，然后6419与91两卡一排，37单卡下一排满宽，再是浅黄长卡四条逐行、无图。这与portrait三张数字并排一行有冲突，按实图2＋1满宽。同一steps节点内第6项图标应省，不能全组六图机械套；同一stats节点最后卡跨两列需接入，现columns_v=2只会最后卡半宽。定稿黄色长卡标题完整保留，源图标题措辞与定稿略异以定稿为准。；page-fixer-09（按审页意见）：单张提示移除无效外卡列数字段；手机数字卡每行一张",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "时钟",
   "source_phrase": "一个时钟和一帧胶片",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一只举起的手掌",
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
   "source_phrase": "一个空着的导演椅",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一支带锁的麦克风",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显卡",
   "source_phrase": "一张显卡旁排队的小人",
   "sha256": "d13359b8d413de624ca49b04df0ea872f5640703f6b0a026aad8fdfcfa788f07",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/icon-clean-0432a3e02a060c22b01c.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "工具箱",
   "source_phrase": "一个小工具箱",
   "sha256": "6a04a76ba647760bd360d417fa53d0df61ccbb296b9d1cfc947d54ee5a080b57",
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
   "source_phrase": "一条分成五段的胶片其中两段是虚线",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/尺子.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "尺子",
   "source_phrase": "一把尺子量着一行字",
   "sha256": "9be61732143a1e2789364ff9ebc4a88c6735a3b4fc188601be857caff5f4b679",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/书签册.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "书签册",
   "source_phrase": "一个书签",
   "sha256": "c363edd0cb76d7fcdcf03abae41e213c92ebca7b434076607db2620e00e62e33",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个写错的字被红圈圈住",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "改一场，只重做一场  ：每段渲染结果记着它用到的场景、素材、背景和编码设置的内容指纹；改了一场，旧成片被拒收，只重渲涉及这场的段。9 月 28 日的自测里改一场颜色：2 段复用、3 段重渲。\n动画开头结尾都量一遍  ：长渲染前，在浏览器里把每个动画的开头和结尾都停一下，量有没有字跑出画面；出画超过 3 像素就不让渲染。\n章节少而短  ：超过 10 章、标题超过 6 个字、两章隔不到 5 秒都会提醒；章节时间由各场配音时长加出来。\n踩点写错就拦下  ：踩点的词在旁白里找不到，组装时直接停；同一个词说了两次，可以指定第几次，再提前或推后几秒。",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h"
   ],
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "文件齿轮",
   "source_phrase": "改一场，只重做一场  ：每段渲染结果记着它用到的场景、素材、背景和编码设置的内容指纹；改了一场，旧成片被拒收，只重渲涉及这场的段。9 月 28 日的自测里改一场颜色：2 段复用、3 段重渲。\n动画开头结尾都量一遍  ：长渲染前，在浏览器里把每个动画的开头和结尾都停一下，量有没有字跑出画面；出画超过 3 像素就不让渲染。\n章节少而短  ：超过 10 章、标题超过 6 个字、两章隔不到 5 秒都会提醒；章节时间由各场配音时长加出来。\n踩点写错就拦下  ：踩点的词在旁白里找不到，组装时直接停；同一个词说了两次，可以指定第几次，再提前或推后几秒。",
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

1. **每一帧按时间算出来。**｜动画只看传进来的时间，不用计时器和随机数；电脑快慢不影响节奏，4 个浏览器分段拍，拼起来也严丝合缝。
2. **人要看的地方停下来。**｜画面好不好、踩点准不准，程序判断不了。所以提示出完就停，等人或 AI 写画面；“核验通过”只说明文件齐、来源对，有没有人看过另算。
3. **不替我做决定。**｜不选题、不写旁白、不自动投稿；写画面那一步故意不接大模型接口，由正在干活的 AI 看着提示写。
4. **配音不悄悄重做。**｜配音要调云端、会用额度，重配一次整条的节奏都会变。所以认可过的默认复用；旁白改了就拒绝沿用旧配音，明确说重配才重配；只换对时间的方法，也不重配。
5. **不抢显卡，不碰别人的东西。**｜渲染先排队领显卡，忙就停下说明，不结束别人的任务；清理只删认得的、能重新生成的文件，原件和不认识的文件一律不动。
6. **视频项目不装语音模型。**｜对时间交给中文语音转写，模型只在那边装一份；视频项目直接依赖的 Python 包只有 Playwright 和 requests 两个，换机好装。

- **8963 行**｜Python 正式代码，不算测试（含 10 月新加的网页成片）
- **130 个**｜自动测试
- **58 次**｜提交（6 月 26 日–10 月 8 日）

**这几招：自测里跑通了，还没在一期真视频上用过**
- **改一场，只重做一场**：每段渲染结果记着它用到的场景、素材、背景和编码设置的内容指纹；改了一场，旧成片被拒收，只重渲涉及这场的段。9 月 28 日的自测里改一场颜色：2 段复用、3 段重渲。
- **动画开头结尾都量一遍**：长渲染前，在浏览器里把每个动画的开头和结尾都停一下，量有没有字跑出画面；出画超过 3 像素就不让渲染。
- **章节少而短**：超过 10 章、标题超过 6 个字、两章隔不到 5 秒都会提醒；章节时间由各场配音时长加出来。
- **踩点写错就拦下**：踩点的词在旁白里找不到，组装时直接停；同一个词说了两次，可以指定第几次，再提前或推后几秒。

::screen{#video-scaffold-07 section="highlights"}

```typeset
{
 "screen": {
  "id": "video-scaffold-07",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版：和照片视频录音管理页的“亮点”一样的画法：左上标题，两张大卡片横排（各占一半宽），每张上面一幅小水彩插画，卡片标题用大字，下面一段正文。最后两行字只画在卡 1 的插画里：“先说结论 核心结论”是插画里的旁白字条，末行“核心结论”是屏幕上弹出的字。插画：卡 1 一句旁白字条“先说结论 核心结论”，从“核心结论”四个字拉出一条绿色细线连到屏幕上正在弹出的同样四个字；卡 2 两段声波之间留出一小段平的空白，空白处画一个小小的逗号，下面一条胶片在同一位置多停了一格。",
  "portrait": "竖版：标题；两张大卡片一行一张（插画在上、字在下）。",
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
     "text_ref": "亮点"
    },
    {
     "type": "content_card",
     "columns": 2,
     "align": "left",
     "illustration": "top_inside",
     "icons": [
      "_library/illustrations/ill-r3-c02936fda748b204.png",
      "_library/icons/画笔调色板.png"
     ],
     "text_ref": "动画踩着旁白的字。",
     "icon_size": 360,
     "image_underlay": [
      true,
      false
     ]
    },
    {
     "type": "annotation",
     "align": "left",
     "text_ref": "先说结论 核心结论",
     "labels_position": "overlay",
     "target_selector": "[data-comp=\"content_card\"] .card.side:first-child .sideic img",
     "anchors": [
      {
       "unit": 0,
       "x": 0.255833,
       "y": 0.58272,
       "width": 0.378333,
       "height": 0.238971
      },
      {
       "unit": 1,
       "x": 0.76,
       "y": 0.490808,
       "width": 0.306667,
       "height": 0.319853
      }
     ],
     "connector": "none"
    }
   ],
   "notes": "实图标题下两张等宽大卡横排；每卡上方大幅插画在卡内，标题及长正文在下。卡1有纸面旁白和显示器，绿色细线把纸面的核心结论连到屏幕同词；卡2声波中留平直停顿、胶片多停一格。末两para节点只在卡1插画里出现：先说结论 核心结论覆纸面（两行），核心结论覆显示器；不得排成独立第三块，不得混入卡2正文。annotation在此负责这两节点的内容归属，实际必须嵌入卡1的上方插画，不是独立调用当前annotation默认左右引线图；这一嵌入当前规格接口未实现，需主工程师接入/样张。两卡插画用大illustration，不用小icon顶图敷衍。\nmain-closer 2026-10-03T20:34:00+08:00：首卡实际无字旁白纸面/显示器采用final-label-geometry底图SHA 1617f2b072f9cbdcf4c846c7fd4f972950d2c9d34399d07771e92499b794c1dc，首卡image_underlay显式声明，末两原节点按原DOM顺序保留，由annotation覆到两实测安全中心及宽度；底图已有绿连线，不再另画，未猜任何新坐标。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "align": "left",
     "illustration": "top_inside",
     "icons": [
      "_library/illustrations/ill-r3-c02936fda748b204.png",
      "_library/icons/画笔调色板.png"
     ],
     "text_ref": "动画踩着旁白的字。",
     "icon_size": 360,
     "image_underlay": [
      true,
      false
     ]
    },
    {
     "type": "annotation",
     "align": "left",
     "text_ref": "先说结论 核心结论",
     "labels_position": "overlay",
     "target_selector": "[data-comp=\"content_card\"] .card.side:first-child .sideic img",
     "anchors": [
      {
       "unit": 0,
       "x": 0.255833,
       "y": 0.58272,
       "width": 0.378333,
       "height": 0.238971
      },
      {
       "unit": 1,
       "x": 0.76,
       "y": 0.490808,
       "width": 0.306667,
       "height": 0.319853
      }
     ],
     "connector": "none"
    }
   ],
   "notes": "原竖图一张，两大卡上下，每卡插画在卡内上方、标题正文在下；两幅插画宽度接近整卡，不做左大图右窄文。末两节点归卡1插画，纸面与屏幕覆字只出现一次；annotation必须嵌入第一卡上部，不能在第二卡后另排标注块。现引擎只能用text_ref分文字、不能将末尾节点嵌回第一卡，主工程师需接入，未接入前不能报告构图/逐字完成。\nmain-closer 2026-10-03T20:34:00+08:00：首卡实际无字旁白纸面/显示器采用final-label-geometry底图SHA 1617f2b072f9cbdcf4c846c7fd4f972950d2c9d34399d07771e92499b794c1dc，首卡image_underlay显式声明，末两原节点按原DOM顺序保留，由annotation覆到两实测安全中心及宽度；底图已有绿连线，不再另画，未猜任何新坐标。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "动画踩着旁白的字。 \n画面里写“说到‘核心结论’时出现”，程序去逐字时间轴里查这个词第几秒说出，换成动画的开始时间；一个词占好几个字时，还按字数往里插，落点更准。不用人手写“第2.4秒出现”，旁白重配了，踩点跟着新的时间走。第一期就是这样做的。",
   "sha256": "4969c2bb7191704c4f1fb5e93cd0575b69b5c08e3f42cb32f2451fa50b4eeb69",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/画笔调色板.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "画笔调色板",
   "source_phrase": "两场之间补一口气。 \n做第一期时听着两段旁白接得太急。于是每段配音末尾补0.2秒静音，时长按补过的算，画面也跟着多停这一下，声音和画面不会因此错开。只管接缝，不改语速。",
   "sha256": "e753d6f0c05218dbfce4f65f119025ccc453dd77a5da6fb2551f53410cfd3cce",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/ill-r3-c02936fda748b204.png",
   "fallback": false,
   "semantic_status": "program_draws_relations_and_text",
   "key": "ill-r3-c02936fda748b204",
   "source_phrase": "插画：卡 1 一句旁白字条“先说结论 核心结论”，从“核心结论”四个字拉出一条绿色细线连到屏幕上正在弹出的同样四个字；卡 2 两段声波之间留出一小段平的空白，空白处画一个小小的逗号，下面一条胶片在同一位置多停了一格。",
   "sha256": "1617f2b072f9cbdcf4c846c7fd4f972950d2c9d34399d07771e92499b794c1dc",
   "status": "ready",
   "original_elements": [
    "一句旁白字条抽象图形，从抽象图形四个字拉出一条绿色细线连到屏幕上正在弹出的同样四个字"
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
   "asset": "_library/illustrations/波形.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "波形",
   "source_phrase": "插画：卡 1 一句旁白字条“先说结论 核心结论”，从“核心结论”四个字拉出一条绿色细线连到屏幕上正在弹出的同样四个字；卡 2 两段声波之间留出一小段平的空白，空白处画一个小小的逗号，下面一条胶片在同一位置多停了一格。",
   "sha256": "31f0f14bae9218df618102a98136ddafd52cb593a5474a0425248c78e85a9f14",
   "status": "ready",
   "original_elements": [
    "两段声波之间留出一小段平的空白，空白处画一个小小的逗号，下面一条胶片在同一位置多停了一格"
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
   "asset": "video-scaffold/video-scaffold-07-title-01.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\video-scaffold\\img\\video-scaffold-07-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ba0d3fdcc635f736cc8b",
   "title_text": "亮点",
   "sha256": "0af11a4a03924b13941a5fd8c19a86d98304bafb57edd6eafefd462da4ee2b9d",
   "status": "ready",
   "source_box": [
    39,
    62,
    351,
    301
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

# 亮点

**动画踩着旁白的字。**
画面里写“说到‘核心结论’时出现”，程序去逐字时间轴里查这个词第几秒说出，换成动画的开始时间；一个词占好几个字时，还按字数往里插，落点更准。不用人手写“第 2.4 秒出现”，旁白重配了，踩点跟着新的时间走。第一期就是这样做的。

**两场之间补一口气。**
做第一期时听着两段旁白接得太急。于是每段配音末尾补 0.2 秒静音，时长按补过的算，画面也跟着多停这一下，声音和画面不会因此错开。只管接缝，不改语速。

先说结论 核心结论

核心结论

::screen{#video-scaffold-08 section="features"}

```typeset
{
 "screen": {
  "id": "video-scaffold-08",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版：和电脑配置与恢复页“全部功能”同一种卡片画法，但组名不单独占一列：左上标题（毛笔字）和同一行右边的图例条；图例下面一行浅灰小字写“怎么判的”。下面按组排：每组先是一行组名（毛笔字，左边一小段绿色笔刷线，横跨整行），组名下面是这一组的功能卡，三列排开；每张卡左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个状态圆点（在用＝绿，待验收＝黄，说不准＝浅灰，没用过＝灰，待实施＝空心绿圈，已停用＝灰色叉）。三组各 4 张：每组第一行三张、第二行一张靠左，右边空出的两格位置画一小幅水彩插画（开工组：一只打开的空文件夹和一张体检单；配音和时间组：麦克风和一条带刻度的声波；画面组：一块画板上画着一条绿色曲线），不写字。这一张和下一张上下拼成一整段：同一个网格，下一张没有标题和图例，上下边都不画边框。状态文字不画出来，只画圆点。",
  "portrait": "竖版：标题；图例两行排；“怎么判的”一段；每组组名一行，下面功能卡一行一张（图标在左、字在右、圆点在右上）；组里的小插画省掉。",
  "links": [],
  "anchors": [
   {
    "id": "g-start",
    "text": "开工"
   },
   {
    "id": "f-init",
    "text": "新项目准备"
   },
   {
    "id": "f-doctor",
    "text": "环境检查"
   },
   {
    "id": "f-live-probe",
    "text": "真机和配音试一下"
   },
   {
    "id": "f-status",
    "text": "查进度"
   },
   {
    "id": "g-voice",
    "text": "配音和时间"
   },
   {
    "id": "f-script-split",
    "text": "旁白分场"
   },
   {
    "id": "f-tts",
    "text": "配音生成"
   },
   {
    "id": "f-voice-tags",
    "text": "语气和停顿标记"
   },
   {
    "id": "f-timing",
    "text": "逐字时间轴"
   },
   {
    "id": "g-scene",
    "text": "画面"
   },
   {
    "id": "f-prompts",
    "text": "逐场画面提示"
   },
   {
    "id": "f-scene",
    "text": "场景制作"
   },
   {
    "id": "f-lint",
    "text": "布局预检"
   },
   {
    "id": "f-preview",
    "text": "有声预览"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "video-scaffold-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "row": "heading",
     "width": "34%",
     "align": "left",
     "size": "large",
     "text_ref": "全部功能（26项）"
    },
    {
     "type": "status_legend",
     "row": "heading",
     "width": "66%",
     "columns": 6,
     "align": "left",
     "size": "small",
     "text_ref": "● 在用"
    },
    {
     "type": "prose",
     "row": "heading",
     "align": "left",
     "text_ref": "怎么判的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "开工"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "新项目准备"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "配音和时间"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "旁白分场"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "画面"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "逐场画面提示"
    }
   ],
   "notes": "实图与scene冲突：每组确实是组名整行，组名下左侧19%一幅卡外插画，右侧81%四张无图卡单排，不是三列两行。按实图columns=4、icons=none，不把左插画放入功能卡，也不加每卡图标。顶行标题约34%左，右66%图例、怎么判的；不是整宽章节标题所以align=left。开工/配音和时间/画面组名毛笔字带横向笔刷线。和09为同一无上下外边框链；状态只画原状态点，定稿状态词为其语义来源，现feature_card还会额外排状态词，需与G1状态表达规则统一。；page-fixer-09（按审页意见）：移除未生效小号字字段，沿用共享正文",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（26项）"
    },
    {
     "type": "status_legend",
     "columns": 3,
     "portrait_columns": 3,
     "align": "left",
     "text_ref": "● 在用"
    },
    {
     "type": "prose",
     "align": "left",
     "text_ref": "怎么判的"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "开工"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "新项目准备"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "配音和时间"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "旁白分场"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "画面"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "逐场画面提示"
    }
   ],
   "notes": "原竖版v→v2：v含标题、两行三项图例、怎么判的、开工四卡；v2含配音和时间四卡和画面四卡。各功能卡一行一张，卡内左图右文、状态在右上，省掉横版组外插画。源v尺寸962×1635，最终标准941宽。续图组名保留但不重复全部功能标题/图例。卡状态以定稿为准；功能12完整9月29日新增文字必须保留，不能沿原图小字遗漏。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "新项目准备｜开一个空白项目：只复制通用代码、模板和背景，不带上一期的旁白、素材、成片和密钥；目标文件夹不空就不开｜在用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "环境检查｜查 Python、FFmpeg、浏览器组件、背景、显卡排队、对时间要用的中文语音转写是否就绪；只看不动，不开浏览器、不占显卡、不读密钥｜在用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "真机和配音试一下｜要实证时才跑：真开浏览器和显卡编码试一次；或真向 Fish 配一句测试音，用完就删｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "查进度｜列出每一步的结果还算不算数、为什么过期、该从哪一步重做｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "旁白分场｜把一整篇旁白按段写成每场一个文本文件；没有单独的命令，要让 AI 调用｜说不准",
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
   "source_phrase": "配音生成｜调 Fish Audio 把每场旁白读出来；6 月用过，9 月改走带时间戳的接口，还加了“旁白改了就拒绝沿用旧配音”｜待验收",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "语气和停顿标记｜旁白里写 [emphasis]、[pause]、[excited] 这类标记，控制语气、停顿和音效，标记本身不会被读出来｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
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
   "source_phrase": "逐字时间轴｜记下每个字几点几秒说出：优先用 Fish 返回的时间戳，没有就交给中文语音转写对齐；换方法不重配音｜待验收",
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
   "asset": "_library/fix-round-2/icon-clean-6d1e5a91e66aac8dcd81.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "问号气泡",
   "source_phrase": "逐场画面提示｜每场生成一份提示：旁白、能踩点的词、素材路径和画面规矩，照着写画面｜说不准",
   "sha256": "080be4948e2a7cdb6073e59785c0a5152e99f9ae5fe1774b21048f9b53056b22",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-587ab2de075ca5525b26.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "照片堆",
   "source_phrase": "场景制作｜每场一个矢量图片段，用 32 种动画和现成组件，动画踩着旁白的字出现｜在用",
   "sha256": "bb6bf0eedf25e5b0ba6427527091df9c684a6e635943b440f443ad5280e33f5c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "布局预检｜渲染前在浏览器里停在每个动画的起止时刻，量有没有字跑出画面、素材缺没缺｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "有声预览｜边听旁白边看画面，点词跳到那一秒；能改踩点后导出新的画面文件，不改原件；9 月 29 日修好了画面区域被白底挡住、看不到玻璃背景的毛病｜待验收",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
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
   "source_phrase": "",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
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
   "slot_ordinal": 15,
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
   "asset": "_library/round3/clean-assets/png/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "文件收纳现图小槽4比3",
   "source_phrase": "三组各 4 张：每组第一行三张、第二行一张靠左，右边空出的两格位置画一小幅水彩插画（开工组：一只打开的空文件夹和一张体检单；配音和时间组：麦克风和一条带刻度的声波；画面组：一块画板上画着一条绿色曲线），不写字。",
   "sha256": "6370948116c73ba01b0aba13328812d5fd2315a881c6dbbb10ce01cbe1d7eb97",
   "status": "ready",
   "original_elements": [
    "打开的空文件夹和体检单，纸上只画短线"
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
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "语音转写现图小槽4比3",
   "source_phrase": "三组各 4 张：每组第一行三张、第二行一张靠左，右边空出的两格位置画一小幅水彩插画（开工组：一只打开的空文件夹和一张体检单；配音和时间组：麦克风和一条带刻度的声波；画面组：一块画板上画着一条绿色曲线），不写字。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "麦克风和一条带刻度的声波"
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
   "asset": "_library/illustrations/画板曲线.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "画板曲线",
   "source_phrase": "三组各 4 张：每组第一行三张、第二行一张靠左，右边空出的两格位置画一小幅水彩插画（开工组：一只打开的空文件夹和一张体检单；配音和时间组：麦克风和一条带刻度的声波；画面组：一块画板上画着一条绿色曲线），不写字。",
   "sha256": "538371356f06d66e5610e143861ecdd0305ca030a9bc21439c9b6f109810215f",
   "status": "ready",
   "original_elements": [
    "画板上画一条绿色曲线"
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
   "asset": "_library/titles/title-63735e387888cdd72a9b.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-63735e387888cdd72a9b",
   "title_text": "全部功能（25 项）",
   "sha256": "60d0b674270883c94e01563dd88d7915919dac0f6e295d69d6b8ac8bfcba8b5d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

# 全部功能（26 项）

● 在用　● 待验收　○ 待实施　● 没用过　● 说不准　✕ 已停用

怎么判的：只做过一期真视频（6 月）。那期用过、现在做法没变的，和在这台电脑上真跑过的检查，标“在用”；6 月以后新加或换了做法、只在自动测试里跑通、还没用在一期真视频上的，标“待验收”。

**开工**
1. 新项目准备｜开一个空白项目：只复制通用代码、模板和背景，不带上一期的旁白、素材、成片和密钥；目标文件夹不空就不开｜在用
2. 环境检查｜查 Python、FFmpeg、浏览器组件、背景、显卡排队、对时间要用的中文语音转写是否就绪；只看不动，不开浏览器、不占显卡、不读密钥｜在用
3. 真机和配音试一下｜要实证时才跑：真开浏览器和显卡编码试一次；或真向 Fish 配一句测试音，用完就删｜说不准
4. 查进度｜列出每一步的结果还算不算数、为什么过期、该从哪一步重做｜待验收

**配音和时间**
5. 旁白分场｜把一整篇旁白按段写成每场一个文本文件；没有单独的命令，要让 AI 调用｜说不准
6. 配音生成｜调 Fish Audio 把每场旁白读出来；6 月用过，9 月改走带时间戳的接口，还加了“旁白改了就拒绝沿用旧配音”｜待验收
7. 语气和停顿标记｜旁白里写 [emphasis]、[pause]、[excited] 这类标记，控制语气、停顿和音效，标记本身不会被读出来｜在用
8. 逐字时间轴｜记下每个字几点几秒说出：优先用 Fish 返回的时间戳，没有就交给中文语音转写对齐；换方法不重配音｜待验收

**画面**
9. 逐场画面提示｜每场生成一份提示：旁白、能踩点的词、素材路径和画面规矩，照着写画面｜说不准
10. 场景制作｜每场一个矢量图片段，用 32 种动画和现成组件，动画踩着旁白的字出现｜在用
11. 布局预检｜渲染前在浏览器里停在每个动画的起止时刻，量有没有字跑出画面、素材缺没缺｜待验收
12. 有声预览｜边听旁白边看画面，点词跳到那一秒；能改踩点后导出新的画面文件，不改原件；9 月 29 日修好了画面区域被白底挡住、看不到玻璃背景的毛病｜待验收

::screen{#video-scaffold-09 section="features"}

```typeset
{
 "screen": {
  "id": "video-scaffold-09",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版：接上一张往下排，同一个网格、同一种卡片，没有标题、没有图例，上下边都不画边框。按组排：组名一行（毛笔字，左边一小段绿色笔刷线），下面功能卡三列：出片 5 张（第一行三张、第二行两张，右边空出的一格画一小卷胶片插画）、验收和收尾 4 张（第二行一张靠左，右边两格画一张打勾的清单插画）、已停用 4 张（卡片整体淡一些，状态画灰色叉；第二行一张靠左，右边两格画一只装着旧胶片的收纳箱插画）。插画不写字。状态文字不画出来，只画圆点或叉。",
  "portrait": "竖版：接上一张；每组组名一行，功能卡一行一张；小插画省掉。",
  "links": [],
  "anchors": [
   {
    "id": "g-output",
    "text": "出片"
   },
   {
    "id": "f-render",
    "text": "断点渲染"
   },
   {
    "id": "f-merge",
    "text": "视频合成"
   },
   {
    "id": "f-cover",
    "text": "封面"
   },
   {
    "id": "f-chapters",
    "text": "章节"
   },
   {
    "id": "f-subtitles",
    "text": "字幕"
   },
   {
    "id": "g-check",
    "text": "验收和收尾"
   },
   {
    "id": "f-verify",
    "text": "成片核验"
   },
   {
    "id": "f-manifest",
    "text": "交付清单"
   },
   {
    "id": "f-cleanup",
    "text": "清理中间文件"
   },
   {
    "id": "f-smoke",
    "text": "隔离整链自测"
   },
   {
    "id": "g-retired",
    "text": "已停用"
   },
   {
    "id": "f-all-in-one",
    "text": "一键全流程"
   },
   {
    "id": "f-publish-kit",
    "text": "投稿文案包"
   },
   {
    "id": "f-archive",
    "text": "一键归档"
   },
   {
    "id": "f-whisper",
    "text": "本地 Whisper 对时间"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "video-scaffold-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "出片"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "断点渲染",
     "tail_illustration": {
      "slot": 1
     }
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "验收和收尾"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "成片核验",
     "tail_illustration": {
      "slot": 2
     }
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "已停用"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "一键全流程",
     "tail_illustration": {
      "slot": 3
     }
    }
   ],
   "notes": "接08同一链，本屏无章节标题、无图例、无上下外边框。出片5卡三列(3＋2)，胶片插画仅填第二排右侧剩余一格；验收和收尾4卡(3＋1)，第二排最后单卡实际约占44%宽，清单插画填其右方剩余两格；已停用4卡(3＋1)，最后单卡实际约44%宽、旧胶片箱在右边，整组淡灰、状态叉。三个illustration块必须嵌到前一组grid的尾排空格，不能另起整宽行；现引擎无此网格尾格插画接口，notes是准确定位要求，需主工程师接入/样张。；主工程师接管规格：三张组外插画按 comp-hub 接口改为前一个 feature_card 的 tail_illustration.slot 1/2/3（原三个独立 illustration 块移除，免得同图再出整宽行）。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "出片"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "断点渲染"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "验收和收尾"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "成片核验"
    },
    {
     "type": "section_heading",
     "align": "left",
     "size": "medium",
     "text_ref": "已停用"
    },
    {
     "type": "feature_card",
     "columns": 1,
     "portrait_columns": 1,
     "align": "left",
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "一键全流程"
    }
   ],
   "notes": "原竖版v→v2：v是出片5卡；v2是验收和收尾4卡、已停用4卡。各卡整宽、图在卡内左侧、状态右上，已停用图/标题/底色淡灰；省掉三幅组外插画。无全部功能章节标题、无重复图例。原竖图功能卡末尾还有状态文字而scene说仅点，按定稿与G1完整显示原词时要和主工程师的状态表达规则统一，不能静默藏字。",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "source_phrase": "断点渲染｜4 路并行逐帧渲染，每段数帧核对；断了接着做，只补缺的和坏的。6 月用过，9 月加了显卡排队、按指纹判断哪段要重渲｜待验收",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "视频合成｜画面合上旁白；放了背景音乐就自动垫在旁白下面；画面和声音时长对不上就不合｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "封面｜按标题、副标题和可选主图出一张 3840×2160 的封面，字出界就报错｜在用",
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
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "章节｜按场分组生成 B 站章节，从 00:00 开始；章太多、标题太长、两章太近都会提醒｜在用",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
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
   "source_phrase": "字幕｜从逐字时间轴出 SRT 和 WebVTT 字幕文件，不烧进画面｜待验收",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "成片核验｜逐项核对来源、尺寸、帧率、编码、总帧数、时长、音画起点和封面；全过才算“就绪”｜待验收",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
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
   "source_phrase": "交付清单｜核验通过后记下成片、封面、章节、字幕的内容指纹和来源，注明还要人看｜待验收",
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
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "清理中间文件｜只删认得的、能重新生成的中间文件，可以先只列不删；原件和成品不动，删不掉的列出来｜待验收",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "隔离整链自测｜在一个新的空项目里用合成声音从头做到交付，再改一场，确认旧成片被拒、片段复用｜在用",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "一键全流程｜一条命令从写旁白文件跑到成片；8 月 15 日换成分步骤，每步能停下来看｜已停用",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "投稿文案包｜按旁白生成 B 站标题、简介、标签和投稿自检清单；随旧脚本停用，9 月 18 日删掉｜已停用",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "一键归档｜做完一期把素材和成品整体挪进归档文件夹；随旧脚本停用，现在每期开一个新项目｜已停用",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "本地 Whisper 对时间｜视频项目自己装 faster-whisper large-v3 对时间；9 月 18 日停用，改由中文语音转写统一对齐｜已停用",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
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
   "slot_ordinal": 15,
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
   "slot_ordinal": 16,
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
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "胶片媒体现图小槽4比3",
   "source_phrase": "按组排：组名一行（毛笔字，左边一小段绿色笔刷线），下面功能卡三列：出片 5 张（第一行三张、第二行两张，右边空出的一格画一小卷胶片插画）、验收和收尾 4 张（第二行一张靠左，右边两格画一张打勾的清单插画）、已停用 4 张（卡片整体淡一些，状态画灰色叉；第二行一张靠左，右边两格画一只装着旧胶片的收纳箱插画）。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready",
   "original_elements": [
    "一小卷胶片"
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
   "asset": "_library/icons/打勾清单.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "勾选清单",
   "source_phrase": "按组排：组名一行（毛笔字，左边一小段绿色笔刷线），下面功能卡三列：出片 5 张（第一行三张、第二行两张，右边空出的一格画一小卷胶片插画）、验收和收尾 4 张（第二行一张靠左，右边两格画一张打勾的清单插画）、已停用 4 张（卡片整体淡一些，状态画灰色叉；第二行一张靠左，右边两格画一只装着旧胶片的收纳箱插画）。",
   "sha256": "76c489ef0fbf542a8a18aad443119b8d5ea87b6727997a714f92d626040ad491",
   "status": "ready",
   "original_elements": [
    "一张打勾的清单，纸上只画短线"
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
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "胶片媒体现图小槽4比3",
   "source_phrase": "按组排：组名一行（毛笔字，左边一小段绿色笔刷线），下面功能卡三列：出片 5 张（第一行三张、第二行两张，右边空出的一格画一小卷胶片插画）、验收和收尾 4 张（第二行一张靠左，右边两格画一张打勾的清单插画）、已停用 4 张（卡片整体淡一些，状态画灰色叉；第二行一张靠左，右边两格画一只装着旧胶片的收纳箱插画）。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready",
   "original_elements": [
    "装着旧胶片的收纳箱"
   ],
   "hidden": false
  }
 ]
}
```

**出片**
13. 断点渲染｜4 路并行逐帧渲染，每段数帧核对；断了接着做，只补缺的和坏的。6 月用过，9 月加了显卡排队、按指纹判断哪段要重渲｜待验收
14. 视频合成｜画面合上旁白；放了背景音乐就自动垫在旁白下面；画面和声音时长对不上就不合｜待验收
15. 封面｜按标题、副标题和可选主图出一张 3840×2160 的封面，字出界就报错｜在用
16. 章节｜按场分组生成 B 站章节，从 00:00 开始；章太多、标题太长、两章太近都会提醒｜在用
17. 字幕｜从逐字时间轴出 SRT 和 WebVTT 字幕文件，不烧进画面｜待验收

**验收和收尾**
18. 成片核验｜逐项核对来源、尺寸、帧率、编码、总帧数、时长、音画起点和封面；全过才算“就绪”｜待验收
19. 交付清单｜核验通过后记下成片、封面、章节、字幕的内容指纹和来源，注明还要人看｜待验收
20. 清理中间文件｜只删认得的、能重新生成的中间文件，可以先只列不删；原件和成品不动，删不掉的列出来｜待验收
21. 隔离整链自测｜在一个新的空项目里用合成声音从头做到交付，再改一场，确认旧成片被拒、片段复用｜在用

**另一条线：网页成片**
22. 网页成片｜AI 直接写一张会动的网页，程序按时间逐帧拍成 4K 视频；能先看关键几帧、只渲其中一段，不走分场配音那一套｜待验收

**已停用**
23. 一键全流程｜一条命令从写旁白文件跑到成片；8 月 15 日换成分步骤，每步能停下来看｜已停用
24. 投稿文案包｜按旁白生成 B 站标题、简介、标签和投稿自检清单；随旧脚本停用，9 月 18 日删掉｜已停用
25. 一键归档｜做完一期把素材和成品整体挪进归档文件夹；随旧脚本停用，现在每期开一个新项目｜已停用
26. 本地 Whisper 对时间｜视频项目自己装 faster-whisper large-v3 对时间；9 月 18 日停用，改由中文语音转写统一对齐｜已停用

::screen{#video-scaffold-10 section="history"}

```typeset
{
 "screen": {
  "id": "video-scaffold-10",
  "section": "history",
  "title": "演进",
  "scene": "横版：左上标题。左侧一条竖向时间线，八个节点，每个节点一个小水彩图标、粗体日期、一两行字（节点图标：一块空白画板、一卷正在冲洗的胶片、一个发出去的纸飞机、一排编号的台阶、一串带编号的卡片、一个带对勾的盾牌、一本变薄的小册子、一块擦干净的玻璃）。右侧约三分之一宽一幅大一点的水彩插画：一台显示器、一支麦克风、一张显卡、一卷胶片由小到大依次排开，像一路长出来的样子；插画里不写字。",
  "portrait": "竖版：标题；时间线一行一个节点；插画放最后，占满宽度。",
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
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "align": "left",
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": "auto",
     "text_ref": "6 月 26 日",
     "connector_style": "thin_line"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "top_inside",
     "index": 0,
     "size": "small"
    }
   ],
   "notes": "实图左65%八日期节点沿一条直绿色竖线，不是弯胶片；小图在日期卡内左侧、日期和说明在右。右35%独立浅绿边框大插画卡，显示器、麦克风、显卡、胶片由小到大。节点6月27日长文不缩字。parse把全部日期识别为stats节点，timeline支持stats可保全原字，不可错误改成数字统计卡。connector=ribbon在此只借连接机制，实物必须是直线＋圆点，组件需按样张核对。；page-fixer-09（按审页意见）：时间线整宽、末图小号，移除长空右栏",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "演进"
    },
    {
     "type": "timeline",
     "columns": 1,
     "direction": "vertical",
     "align": "left",
     "illustration": "left_inside",
     "connector": "ribbon",
     "icons": "auto",
     "text_ref": "6 月 26 日",
     "connector_style": "thin_line"
    },
    {
     "type": "illustration",
     "align": "center",
     "illustration": "outside",
     "index": 0,
     "size": "small"
    }
   ],
   "notes": "原竖版v→v2：v是标题、6月26/27/28三个日期卡、最后整宽卡外大插画；v2是8月15日、8月31日–9月4日、9月18/26/29五个日期卡，左侧直绿线延续、圆点对应卡。插画实际在第3节点后、不是完整八节点后；与portrait插画放最后有冲突，按实图。现全部日期是同一stats节点，单靠text_ref不能把第4项分出来，因此这份timeline+illustration只登记块归属，必须在timeline第3项后嵌插画并续剩余5项；未接入前不可声称已复现。续图原文件名v2，不新增v3。；page-fixer-09（按审页意见）：时间线整宽、末图小号，移除长空右栏",
   "verification_notes": "本轮仅按库存与定稿文字核对；旧 notes 保留作为上轮构图证据，其中关于组件未实现的说法须以本轮 agent-report.md 和当前接口为准。未看图，不声称视觉验收完成。"
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
   "source_phrase": "一块空白画板",
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
   "source_phrase": "一卷正在冲洗的胶片",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一个发出去的纸飞机",
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
   "asset": "_library/fix-round-2/icon-clean-839512a73462b1c73a7b.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "上升台阶",
   "source_phrase": "一排编号的台阶",
   "sha256": "fb447e90e43d25696e5e3b5a53d4c4c3c9227bdd19db3c5ee3776fb2938cdb17",
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
   "source_phrase": "一串带编号的卡片",
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
   "asset": "_library/round3/clean-assets/png/08-盾牌-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "盾牌",
   "source_phrase": "一个带对勾的盾牌",
   "sha256": "53bd06dc245ab3fd8f472ad56e57f14d775fdac2c8fda524a89513012cafe440",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "绿封面册",
   "source_phrase": "一本变薄的小册子",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一块擦干净的玻璃",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": false,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "video-scaffold-10-icon-09",
   "source_phrase": "9 月 30 日：GitHub 自动测试补齐依赖（新加的条目，用这条时间线里常用的绿芽图标）",
   "sha256": "ef6f9637d6fc3120502f2c2f3245d50bfb7ad3fda54db56afbca5c4d24d30322",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/小放映机.png",
   "fallback": false,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "video-scaffold-10-icon-10",
   "source_phrase": "10 月 4 日：另开“网页成片”线（新加的条目，用素材库已有的小放映机图标）",
   "sha256": "7f176ae6f0f6c24c8c6a6886cd28fc21614f9c6b0a4bc7d09b5735893fa07eac",
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
   "fallback": false,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "video-scaffold-10-icon-11",
   "source_phrase": "10 月 8 日：网页成片能先看关键几帧（新加的条目，用这条时间线里常用的绿芽图标）",
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
   "asset": "_library/illustrations/main-video-scaffold.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-video-scaffold",
   "source_phrase": "右侧约三分之一宽一幅大一点的水彩插画：一台显示器、一支麦克风、一张显卡、一卷胶片由小到大依次排开，像一路长出来的样子；插画里不写字。",
   "sha256": "a6ac71e4d63fca105264cc1b56666a0a2d6808b3f143c646868b97d83b6c9b8c",
   "status": "ready",
   "original_elements": [
    "一台显示器、一支麦克风、一张显卡、一卷胶片由小到大依次排开，像一路长出来的样子；插画里不写字"
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

- **6 月 26 日**　建库：4K、60 帧、显卡 AV1 编码；矢量图动画底板；本地 Whisper 逐字对时间；Fish 配音
- **6 月 27 日**　边做第一期边修：截图提速约一倍；渲染断了能接着做；每段配音补 0.2 秒静音。渲染时 8 路显卡编码同时跑，超过了显卡同时能开的路数，几段悄悄少了帧、程序却报成功，从 3 分 47 秒起画面抢在旁白前面；改成每段渲染完先数帧、少一帧就重做，并行降到 4 路——已改好，还没在下一期真片上验过
- **6 月 28 日**　第一期《游戏王 MD 氪金指南》做完发布，素材整体归档；加上章节检查、投稿文案包、一键归档
- **8 月 15 日**　换成分步骤的命令入口，环境检查改写成只读的逐项检查；一键全流程停用
- **8 月 31 日–9 月 4 日**　场景编号可以跳着来（01、04、100）；每样中间结果绑定它的输入，换了素材不会沿用旧画面
- **9 月 18 日**　有声预览、字幕、交付清单、查进度、隔离自测和 GitHub 自动测试；对时间改用 Fish 时间戳和中文语音转写，本地 Whisper 停用，旧的一体化脚本删掉
- **9 月 26 日**　说明文档精简到五句话。我定了：以后做不做视频再说，但这个项目要留着，想做的时候随时能做出来
- **9 月 29 日**　修好有声预览：画面区域原来被一层白底挡住，看不到玻璃背景
- **9 月 30 日**　GitHub 自动测试补齐依赖；清理中间文件改成放进回收站，出错就停下
- **10 月 4 日**　按我点名的需求，另开一条独立的“网页成片”线（10 月 4—8 日加的，维护档位仍是偶尔用、只修报错）：AI 直接写一张会动的网页，程序按时间逐帧拍成 4K 视频；在草稿文件夹里彩排过，还没用在真视频上
- **10 月 8 日**　网页成片能先看关键几帧、只渲其中一段；补了一份创作指南和一条原创示例短片
