---
{
 "title": "中文语音转写",
 "kind": "project",
 "url": "/projects/chinese-asr/",
 "tagline": "把中文录音和口述变成能逐句核对的文字。",
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
  "page": "chinese-asr",
  "kind": "project",
  "title": "中文语音转写",
  "url": "/projects/chinese-asr/",
  "tagline": "把中文录音和口述变成能逐句核对的文字。",
  "status": "常用",
  "public": true,
  "repo_url": "https://github.com/wlyaaaaa/ChineseASR",
  "capability": "听懂中文语音",
  "based_on": {
   "commit": "8ba0d6297f559f158f8cb1f298c3d7f4ee66cc6b",
   "commit_time": "2026-09-28T05:53:55+08:00"
  },
  "video_prompt": "5–8 秒循环，从开头这屏的插画出发，镜头不动：衣领上的小麦克风旁，声波一圈圈缓缓荡开，化成一行行浅灰短线轻轻落到纸上；纸上两处淡黄小标记依次亮一下又暗下去；右下角白绿小胶囊听写窗的状态点由黄慢慢变绿；显卡侧面的绿光像呼吸一样明暗；背景水彩微微流动，偶尔一片小叶子飘过。画面里不出现任何文字，最后一帧回到第一帧，无缝循环。",
  "registry": {
   "groups": [
    {
     "id": "g-dictation",
     "name": "听写"
    },
    {
     "id": "g-transcribe",
     "name": "录音转文字"
    },
    {
     "id": "g-review",
     "name": "找出要回听的地方"
    },
    {
     "id": "g-cloud",
     "name": "云端复核"
    },
    {
     "id": "g-time",
     "name": "时间和说话人"
    },
    {
     "id": "g-upkeep",
     "name": "维护和装机"
    }
   ],
   "features": [
    {
     "id": "f-dictation",
     "group": "g-dictation",
     "name": "桌面听写",
     "what": "在任何输入框按 Win+H 或 Ctrl+Win+H 说中文，停顿约 0.6 秒就把这段打进光标处；不润色，不自动发送",
     "how": "点一下输入框，按 Win+H 开始说，再按一次暂停",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:11-25；configs/dictation.yaml；outputs/dictation/runtime.log 9 月 6–28 日 154 段"
    },
    {
     "id": "f-resident",
     "group": "g-dictation",
     "name": "常驻、随按随用",
     "what": "登录后模型就在内存里待命，录音时才上显卡、说完退回；9 月 27 日实测停下后三秒以内出字",
     "how": "不用做什么，登录后自动待命",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "AGENTS.md:13；owner-decisions.md 听写改成常驻；PCConfig pending_acceptance dictation-on-demand-hotkey=passed"
    },
    {
     "id": "f-gpu-yield",
     "group": "g-dictation",
     "name": "给本地大模型让显卡",
     "what": "本地大模型在用显卡时听写先等，录音存在内存里，让出来就接着出字",
     "how": "照常说话，小窗显示“等待 GPU”时稍等或按 Esc 取消",
     "status": "待验收",
     "screen": "chinese-asr-12",
     "source": "PCConfig pending_acceptance dictation-aicli-gpu-handoff（on_hold：程序隔离测试已过，本人未实测）；chinese_dictation_on_demand.md"
    },
    {
     "id": "f-mic-select",
     "group": "g-dictation",
     "name": "选麦克风",
     "what": "点小箭头或右键麦克风选设备、刷新；选中的麦克风断了只提示，不偷换别的",
     "how": "点小窗上的小箭头",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:17-19,35；configs/dictation.yaml input_device；outputs/dictation/preferences.json 存在"
    },
    {
     "id": "f-status-dot",
     "group": "g-dictation",
     "name": "状态点",
     "what": "麦克风右上角的小圆点：绿就绪、黄准备或等显卡、红故障，点开看原因和怎么办",
     "how": "点状态点",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "AGENTS.md:11；提交 a3f79f5"
    },
    {
     "id": "f-panel-place",
     "group": "g-dictation",
     "name": "小窗放对屏幕",
     "what": "只显示一个小窗，优先放串流用的虚拟屏，拔掉回主屏；拖过的位置保留",
     "how": "不用管；想换位置就拖动空白处",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:15；configs/dictation.yaml panel_monitor_ids"
    },
    {
     "id": "f-copy-recent",
     "group": "g-dictation",
     "name": "复制最近文字",
     "what": "字跟着你当下的输入位置走；一时没地方打字或发送失败时，从托盘或小箭头菜单取回最近整段",
     "how": "托盘右键“复制最近识别文字”",
     "status": "说不准",
     "screen": "chinese-asr-12",
     "source": "README.md:35；dictation_windows.py:1034（insert_text 写入时重读当前焦点）,1611,2001；dictation.py:751（用了不留痕）"
    },
    {
     "id": "f-release-hotkeys",
     "group": "g-dictation",
     "name": "把 Win+H 暂时还给系统",
     "what": "托盘里一键释放两组快捷键，再点一次恢复",
     "how": "托盘右键“暂时释放/恢复两组快捷键”",
     "status": "说不准",
     "screen": "chinese-asr-12",
     "source": "dictation_windows.py:2002（用了不留痕）"
    },
    {
     "id": "f-start-menu",
     "group": "g-dictation",
     "name": "开始菜单入口",
     "what": "程序没开时，从开始菜单点“中文听写”打开并开始录音",
     "how": "开始菜单里点“中文听写”",
     "status": "说不准",
     "screen": "chinese-asr-12",
     "source": "scripts/Start-Dictation.vbs；owner-decisions.md:105（E5 保留）"
    },
    {
     "id": "f-strict",
     "group": "g-transcribe",
     "name": "严格转写（默认）",
     "what": "Qwen3-ASR-1.7B 主听、SenseVoiceSmall 对照，交回干净正文和疑点清单",
     "how": "把录音交给 AI",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:43,119；objective-result 8 月 18 日–9 月 26 日 375 段"
    },
    {
     "id": "f-quick",
     "group": "g-transcribe",
     "name": "快速初稿",
     "what": "只用 SenseVoiceSmall 一个模型，快，但不做对照",
     "how": "跟 AI 说只要个大概",
     "status": "说不准",
     "screen": "chinese-asr-12",
     "source": "README.md:95,135（快速和严格的文件名分不开）"
    },
    {
     "id": "f-high-quality",
     "group": "g-transcribe",
     "name": "重要录音高质量转写",
     "what": "FireRedASR2-LLM 主听、Qwen3-ASR 对照，每个词对到时间，做成回听网页",
     "how": "跟 AI 说这段重要、要高质量",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:51；FireRed 原始结果 167 份，最近 9 月 26 日"
    },
    {
     "id": "f-long",
     "group": "g-transcribe",
     "name": "长录音分段续跑",
     "what": "按停顿切段；中断了再提交，已核对过的段跳过",
     "how": "把长录音交给 AI",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:470-486；长录音清单 30 份"
    },
    {
     "id": "f-batch",
     "group": "g-transcribe",
     "name": "整个文件夹一起转",
     "what": "一次转一个文件夹，模型一批只加载一次，每个文件各一份结果",
     "how": "把文件夹交给 AI",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "scripts/transcribe-folder.ps1；9 月 12 日一批 183 份结果"
    },
    {
     "id": "f-channel",
     "group": "g-transcribe",
     "name": "只转一个声道",
     "what": "双声道录音可以只转左或右一路，不据此判断是谁",
     "how": "跟 AI 说只转哪一路",
     "status": "说不准",
     "screen": "chinese-asr-12",
     "source": "docs/quality-and-model-maintenance.md（-ChannelIndex）"
    },
    {
     "id": "f-fun-nano",
     "group": "g-transcribe",
     "name": "换用 Fun-ASR-Nano",
     "what": "点名时用这个较重的 GPU 模型出初稿，不改默认",
     "how": "跟 AI 点名要 Fun-ASR-Nano",
     "status": "说不准",
     "screen": "chinese-asr-12",
     "source": "README.md:96,138；只找到 9 月 6 日一次结果，分不清是试跑还是真用"
    },
    {
     "id": "f-async",
     "group": "g-transcribe",
     "name": "交给 AI 不卡对话",
     "what": "本机服务最多等 15 秒就先回任务编号，长录音在后台跑；服务重启，最近 200 条任务历史还在",
     "how": "不用管，AI 自己查进度",
     "status": "在用",
     "screen": "chinese-asr-12",
     "source": "README.md:435-462；outputs/api/jobs.json 103 条"
    },
    {
     "id": "f-flags",
     "group": "g-review",
     "name": "标出要回听的句子",
     "what": "两个模型对不上、数字或否定词不同、没声音却出字、套话、异常重复、繁体、一长串没标点，都带时间标出来",
     "how": "看疑点清单",
     "status": "在用",
     "screen": "chinese-asr-13",
     "source": "README.md:44；risk_rules.py；text_comparison.py"
    },
    {
     "id": "f-review-page",
     "group": "g-review",
     "name": "本地回听网页",
     "what": "有争议的片段列成一页，点开就听那几秒；只用本机音频，不连外网",
     "how": "高质量转写时自动生成，打开网页",
     "status": "在用",
     "screen": "chinese-asr-13",
     "source": "quality-and-model-maintenance.md；quality.review.html 20 份"
    },
    {
     "id": "f-empty-outcome",
     "group": "g-review",
     "name": "分清没人说话和没转出来",
     "what": "空结果分四种结论，证据齐了才说“没人说话”",
     "how": "不用做什么，每份结果都带",
     "status": "在用",
     "screen": "chinese-asr-13",
     "source": "README.md:422-431；每份结果旁都有 objective-result"
    },
    {
     "id": "f-receipt",
     "group": "g-review",
     "name": "防改动清单",
     "what": "把正文、对照记录、两份原始结果的指纹绑在一张清单里，有一样被改过就不再算“已核对”",
     "how": "不用做什么，严格转写自动写",
     "status": "在用",
     "screen": "chinese-asr-13",
     "source": "README.md:298,412-420"
    },
    {
     "id": "f-llm-arb",
     "group": "g-review",
     "name": "本地大模型仲裁",
     "what": "打开后让本机大模型只看疑点证据给意见，不改原始结果；默认关",
     "how": "改配置打开",
     "status": "没用过",
     "screen": "chinese-asr-13",
     "source": "models.yaml llm_arbitration.enabled=false；找不到任何仲裁记录"
    },
    {
     "id": "f-cloud-auto",
     "group": "g-cloud",
     "name": "疑难录音自动复核",
     "what": "免费期内，疑难录音由处理它的 AI 送阿里云再听一遍，并排存，不覆盖本地稿",
     "how": "不用说，AI 自动做",
     "status": "在用",
     "screen": "chinese-asr-13",
     "source": "README.md:47,205；本地结果旁 25 份自动复核结果，最近 9 月 27 日"
    },
    {
     "id": "f-cloud-explicit",
     "group": "g-cloud",
     "name": "点名上云",
     "what": "免费期外，或不经本地转写直接整段送云端，我点头后单次上传；可加热词、保留方言或分说话人",
     "how": "跟 AI 说这段可以上云",
     "status": "在用",
     "screen": "chinese-asr-13",
     "source": "README.md:182-217；云端结果 68 次尝试，重要 11、质量复核 44"
    },
    {
     "id": "f-cloud-stop",
     "group": "g-cloud",
     "name": "出错自动停",
     "what": "额度、欠费、权限或模型下线就停掉自动上传；我说恢复，或换了模型、免费期、额度周期后再开",
     "how": "跟 AI 说“恢复云端复核”",
     "status": "没用过",
     "screen": "chinese-asr-13",
     "source": "README.md:203；auto-cloud-state.json 不存在，从没停过"
    },
    {
     "id": "f-cloud-pause",
     "group": "g-cloud",
     "name": "手动暂停",
     "what": "让 AI 暂停疑难录音的自动复核，写上原因；换模型、改免费期都不会自己重开，我说恢复才再开，点名上云照常",
     "how": "跟 AI 说“云端自动复核先暂停一下”",
     "status": "待验收",
     "screen": "chinese-asr-13",
     "source": "scripts/cloud-review-state.py pause --reason（提交 05fa586，9 月 29 日）；相关测试 27 项通过，没对正式状态暂停过"
    },
    {
     "id": "f-cloud-backfill",
     "group": "g-cloud",
     "name": "旧疑难录音补跑",
     "what": "列出以前的疑难录音一次补跑；原音搬了家，按指纹在 E:\\Music 找回",
     "how": "跟 AI 说把以前的疑难录音补跑一遍",
     "status": "说不准",
     "screen": "chinese-asr-13",
     "source": "scripts/cloud-review-batch.py；README.md:209"
    },
    {
     "id": "f-speakers",
     "group": "g-time",
     "name": "分清谁在说",
     "what": "出逐句时间和“说话人 1、2”；知道是两个人打电话可以直接告诉它人数",
     "how": "跟 AI 说有几个人、要分开",
     "status": "在用",
     "screen": "chinese-asr-14",
     "source": "README.md:99；Paraformer 结果 49 份，最近 9 月 12 日"
    },
    {
     "id": "f-self-voice",
     "group": "g-time",
     "name": "哪几句是我说的",
     "what": "拿唯一一份“我”的声音参考比对，再看声道、谁打给谁、说的内容；结论能推翻，不常用",
     "how": "问 AI“这段里哪几句是我说的”",
     "status": "在用",
     "screen": "chinese-asr-14",
     "source": "README.md:314-410；8 月 24–29 日留下的声音参考和证据文件；owner-decisions.md 声纹参考听样"
    },
    {
     "id": "f-align",
     "group": "g-time",
     "name": "已有文字找时间",
     "what": "给确认过的文案和录音，找出每个词在第几秒；做视频配音用",
     "how": "把文案和录音一起交给 AI",
     "status": "说不准",
     "screen": "chinese-asr-14",
     "source": "docs/known-text-alignment.md；video-scaffold AGENTS.md:9；没找到结果文件"
    },
    {
     "id": "f-readback",
     "group": "g-time",
     "name": "找回转过的结果",
     "what": "按原音指纹直接取以前带时间的结果，不重转、不开模型",
     "how": "问 AI 这段转过没有，或在个人媒体里找录音里的某句话",
     "status": "在用",
     "screen": "chinese-asr-14",
     "source": "README.md:144-168；personal_media.py:1991；personal-media VALUE_SAMPLING.md:78"
    },
    {
     "id": "f-gpu-queue",
     "group": "g-upkeep",
     "name": "排队用显卡",
     "what": "每个任务先要租约；转写和文字识别可以同时跑，本地大模型和两者不同时用",
     "how": "不用管",
     "status": "在用",
     "screen": "chinese-asr-14",
     "source": "README.md:464-468；PCConfig OllamaStable32100 两个任务"
    },
    {
     "id": "f-model-lock",
     "group": "g-upkeep",
     "name": "模型版本锁定",
     "what": "Qwen3-ASR、FireRedASR2-LLM 和强制对齐模型运行前核对版本、大小和指纹，其他模型没有这一步",
     "how": "不用管",
     "status": "在用",
     "screen": "chinese-asr-14",
     "source": "docs/architecture.md 引擎策略；MODEL_RECEIPT"
    },
    {
     "id": "f-model-switch",
     "group": "g-upkeep",
     "name": "比过才换模型、一键退回",
     "what": "同一批带标准答案的录音分开比字错、关键错、静音出字、耗时，更好才换",
     "how": "跟 AI 说想换某个新模型",
     "status": "没用过",
     "screen": "chinese-asr-14",
     "source": "quality-and-model-maintenance.md；outputs 下没有任何切换记录"
    },
    {
     "id": "f-check-updates",
     "group": "g-upkeep",
     "name": "查有没有新版本",
     "what": "手动查上游模型出没出新版本，不自动下载、不自动换",
     "how": "跟 AI 说查一下转写模型有没有新版",
     "status": "说不准",
     "screen": "chinese-asr-14",
     "source": "model_lifecycle check-updates（用了不留痕）"
    },
    {
     "id": "f-eval",
     "group": "g-upkeep",
     "name": "准确率评测",
     "what": "拿自己的录音配标准答案，算字错和漏字",
     "how": "给 AI 一批录音和对应的标准文字",
     "status": "没用过",
     "screen": "chinese-asr-14",
     "source": "scripts/eval.ps1、benchmark.ps1；eval/corpus 只有冒烟语料"
    },
    {
     "id": "f-doctor",
     "group": "g-upkeep",
     "name": "体检和试跑",
     "what": "一条命令查代理、显卡、模型配置和依赖；拿一段样例录音从头试跑一遍",
     "how": "跟 AI 说体检一下转写",
     "status": "在用",
     "screen": "chinese-asr-14",
     "source": "scripts/doctor.ps1、smoke-asr-smart.ps1；9 月 17、26 日的试跑结果目录"
    },
    {
     "id": "f-offline",
     "group": "g-upkeep",
     "name": "离线重装",
     "what": "E 盘另存一份当前在用的模型和锁定版本的依赖安装包（约 35 GiB），防上游撤包；换模型、升级依赖时一起刷新。9 月 29 日已在新建环境里只用这些本地包装好并自检通过；真断网安装、新环境里用显卡转写和换电脑恢复还没验",
     "how": "换模型或升级依赖后跟 AI 说刷新离线备用",
     "status": "待验收",
     "screen": "chinese-asr-14",
     "source": "offline\\current（提交 f4d75fc，9 月 29 日）：307 个文件 37,855,429,442 字节，SHA-256 回读通过；新环境用 pip --no-index 只从本地包安装并自检通过，没有真的断网验过；scripts\\refresh-offline.ps1 串起刷新流程"
    }
   ],
   "numbers": [
    {
     "id": "n-transcribed",
     "text": "435 段",
     "meaning": "8 月 18 日–10 月 10 日转成文字的不同录音，按原音 SHA-256 去重，去掉测试和验收目录；下限",
     "as_of": "2026-10-11",
     "source": "E:\\Projects\\Tools\\ChineseASR\\outputs 下 *objective-result.json 的 audio.raw_sha256 去重（不含 a4-demo、acceptance、quality-acceptance 目录；449 个文件→435 段；最晚一份结果文件写入于北京 10 月 10 日 17:34；北京 10 月 11 日 16:12 只读复核，与 GPT 15:55 结果一致；按同口径重算 9 月 28 日前为 375 段）",
     "screens": [
      "chinese-asr-01"
     ]
    },
    {
     "id": "n-dictation-median",
     "text": "0.45 秒",
     "meaning": "桌面听写识别一段用时的中位数",
     "as_of": "2026-10-10",
     "source": "outputs/dictation/runtime.log 两种识别行（transcribed elapsed_sec、model operation=transcribe seconds），445 段合算；同口径重算 9 月 28 日前为 154 段、0.53 秒",
     "screens": [
      "chinese-asr-01"
     ]
    },
    {
     "id": "n-dictation-count",
     "text": "445 段",
     "meaning": "9 月 6 日–10 月 4 日桌面听写识别的段数",
     "as_of": "2026-10-10",
     "source": "同上，日志北京时间 9 月 6 日 02:21 至 10 月 4 日 03:15",
     "screens": [
      "chinese-asr-01"
     ]
    },
    {
     "id": "n-models",
     "text": "9 个模型｜28.5 GiB",
     "meaning": "本机 models 目录里的模型个数和总大小",
     "as_of": "2026-10-11",
     "source": "E:\\Projects\\Tools\\ChineseASR\\models 递归求和 28.54 GiB；清单见 facts.md 第六节",
     "screens": [
      "chinese-asr-01",
      "chinese-asr-09"
     ]
    },
    {
     "id": "n-cloud-ok",
     "text": "54 次",
     "meaning": "全部云端调用里成功的次数（68 次尝试，51 段不同录音；含点名上云、质量复核和 9 月 26 日前的 3.0 旧模型）",
     "as_of": "2026-10-11",
     "source": "outputs/cloud-jobs/*.result.json status=succeeded 54、failed 14；最晚一次北京时间 9 月 27 日 01:11，之后没有新的云端复核（北京 10 月 11 日 16:12 只读复核，结果文件仍为 68 份）",
     "screens": [
      "chinese-asr-01",
      "chinese-asr-06"
     ]
    },
    {
     "id": "n-cloud-attempts",
     "text": "68 次",
     "meaning": "云端复核尝试次数",
     "as_of": "2026-10-11",
     "source": "同上",
     "screens": [
      "chinese-asr-06"
     ]
    },
    {
     "id": "n-cloud-recordings",
     "text": "51 段",
     "meaning": "云端复核成功涉及的不同录音",
     "as_of": "2026-10-11",
     "source": "同上，按 source_audio_sha256 去重",
     "screens": [
      "chinese-asr-06"
     ]
    },
    {
     "id": "n-cloud-auto",
     "text": "25 份；另 31 份等 AI 接手",
     "meaning": "写回本地结果旁的自动复核结果（cloud.review.json，全部成功）；另有 31 份还在“等 AI 接手”，不算已复核",
     "as_of": "2026-10-11",
     "source": "outputs 非测试目录下的 cloud.review.json",
     "screens": [
      "chinese-asr-06"
     ]
    },
    {
     "id": "n-free-until",
     "text": "12 月 21 日 00:00",
     "meaning": "两款 Qwen Audio 3.1 的免费期截止（本人转述，未经控制台核对）",
     "as_of": "2026-09-28",
     "source": "configs/models.yaml cloud_review.models.*.free_until",
     "screens": [
      "chinese-asr-06"
     ]
    },
    {
     "id": "n-code-lines",
     "text": "25225 行",
     "meaning": "正式代码物理行数（不含测试）",
     "as_of": "2026-10-11",
     "source": "git ls-files 逐文件计行：src 21679、runtime 718、scripts py 782、ps1 2016、vbs 30",
     "screens": [
      "chinese-asr-10"
     ]
    },
    {
     "id": "n-tests",
     "text": "测试定义 544 个（只计数）",
     "meaning": "自动测试用例个数（只计数未运行）",
     "as_of": "2026-10-11",
     "source": "unittest discover tests 的 countTestCases()",
     "screens": [
      "chinese-asr-10"
     ]
    },
    {
     "id": "n-commits",
     "text": "101 次",
     "meaning": "仓库提交次数",
     "as_of": "2026-10-11",
     "source": "git rev-list --count HEAD（1bd5a04）",
     "screens": [
      "chinese-asr-10"
     ]
    },
    {
     "id": "n-features",
     "text": "38 项",
     "meaning": "全部功能条数",
     "as_of": "2026-09-29",
     "source": "registry.features",
     "screens": [
      "chinese-asr-12"
     ]
    },
    {
     "id": "n-offline-size",
     "text": "约 35 GiB",
     "meaning": "离线备用整包大小（模型 104 个文件约 28.52 GiB、Windows 依赖包 129 个、FireRed WSL 依赖包 68 个，加 FireRed 源码归档）",
     "as_of": "2026-09-29",
     "source": "修复汇报 E:\\Cache\\Claude\\Temp\\98d9fa8d\\gpt-children\\20260929-010831-pa-asr\\round-02\\report.md：bundle.json 受 SHA-256 约束的 307 个文件 37,855,429,442 字节",
     "screens": [
      "chinese-asr-14"
     ]
    }
   ],
   "relations": [
    {
     "id": "r-wechat-voice",
     "with": "wechatdirect",
     "direction": "交来",
     "flow": "微信直读把语音消息导出成 WAV，需要文字时交给它转写",
     "source": "E:\\.agents\\skills\\wechat-direct\\SKILL.md:18"
    },
    {
     "id": "r-media-readback",
     "with": "personal-media",
     "direction": "拿走",
     "flow": "个人媒体找“录音里某句话在第几秒”时，按原音指纹只读取它已有的带时间转写（transcript-readback），不重转",
     "source": "V:\\Personal\\Projects\\personal-media\\personal_media.py:1991；README.md:179"
    },
    {
     "id": "r-media-fill",
     "with": "personal-media",
     "direction": "交来",
     "flow": "选中的录音还没有带时间的转写时，个人媒体交给它用 Paraformer 补这一段的时间",
     "source": "E:\\.agents\\skills\\personal-media\\SKILL.md:37；chinese-asr references/local-special-cases.md"
    },
    {
     "id": "r-media-self",
     "with": "media-person-self",
     "direction": "借用",
     "flow": "判断一段录音里有没有我在说话时，借它唯一的“我”的声音参考和逐句证据",
     "source": "E:\\.agents\\skills\\media-person-self\\SKILL.md:59-73"
    },
    {
     "id": "r-understanding",
     "with": "daily-preferences",
     "direction": "交来",
     "flow": "个人理解库选中的存疑录音经它的阿里云入口复核，授权跨续作有效；转写结果作为理解库的一种来源",
     "source": "V:\\Personal\\Projects\\daily-preferences\\docs\\source-rules.md:23；owner-decisions.md 个人理解库录音云复核范围"
    },
    {
     "id": "r-video-align",
     "with": "video-scaffold",
     "direction": "借用",
     "flow": "做视频时 Fish 没给原生时间戳，就用它的已知文案对齐给配音每个词标时间，不重新转写",
     "source": "E:\\Projects\\Archives\\video-scaffold\\AGENTS.md:9；docs/WORKFLOW.md:85"
    },
    {
     "id": "r-localocr",
     "with": "localocr",
     "direction": "共用",
     "flow": "共用一块显卡：转写和文字识别可以同时跑；端口 18666 归转写、18665 归文字识别",
     "source": "README.md:464-466；LocalOCR docs/TROUBLESHOOTING.md:70"
    },
    {
     "id": "r-pcconfig",
     "with": "pcconfig",
     "direction": "依赖",
     "flow": "电脑配置与恢复提供显卡排队服务（LocalGpuBroker，端口 32100）、听写登录任务的登记和换机恢复说明",
     "source": "E:\\PCConfig\\docs\\recovery\\chinese_asr.md；chinese_dictation_on_demand.md"
    },
    {
     "id": "r-password-center",
     "with": "password-center",
     "direction": "依赖",
     "flow": "云端复核的阿里云 key 由密码中心的持钥程序直接发给阿里云；这里只交准备好的请求体或 WebSocket 帧",
     "source": "AGENTS.md:10；README.md:645-650；提交 49b7d76"
    },
    {
     "id": "r-aicli",
     "with": "ai-cli-profile-manager",
     "direction": "让出",
     "flow": "AICLI 跑本地大模型要显卡时，听写经排队服务让出显卡，结束后恢复（待验收）",
     "source": "PCConfig pending_acceptance dictation-aicli-gpu-handoff"
    },
    {
     "id": "r-aliyun",
     "with": "阿里云百炼（外部服务）",
     "direction": "送出",
     "flow": "只送本地标出疑点的录音片段（3.1 Flash 每段≤120 秒 HTTPS，Flash-Message 每段≤30 秒 WebSocket），取回候选文字和用量",
     "source": "README.md:184-201"
    },
    {
     "id": "r-model-hubs",
     "with": "ModelScope、Hugging Face（外部服务）",
     "direction": "拿来",
     "flow": "按固定版本下载模型权重，下载后核对收据",
     "source": "README.md:219-286"
    },
    {
     "id": "r-github",
     "with": "GitHub（外部服务）",
     "direction": "送出",
     "flow": "公开源码；每次推送在干净的 Windows 运行器跑测试，不含模型、录音和转写",
     "source": ".github/workflows/tests.yml；README.md:596-616"
    },
    {
     "id": "r-file-intake",
     "with": "当时的 AI（按文件类型选读法）",
     "direction": "交来",
     "flow": "一堆文件里有中文录音时，当时的 AI 直接交给这个技能",
     "source": "E:\\.agents\\skills\\chinese-asr\\SKILL.md 第 8–18 行（提交 99e1da5）；file-intake-router 10 月 2 日退役"
    }
   ],
   "highlights": [
    {
     "id": "h-flag-doubts",
     "title": "它会指出哪里可能错",
     "screen": "chinese-asr-11"
    },
    {
     "id": "h-empty-not-silence",
     "title": "没转出字，不等于没人说话",
     "screen": "chinese-asr-11"
    },
    {
     "id": "h-no-lost-words",
     "title": "一按就能说，模型慢一点也不丢话",
     "screen": "chinese-asr-11"
    }
   ],
   "mentions": [
    {
     "target": "/how/#chinese-asr",
     "screen": "chinese-asr-01",
     "text": "在整套系统里的位置 → 怎么协作"
    },
    {
     "target": "/cockpit/#chinese-asr",
     "screen": "chinese-asr-01",
     "text": "现在正不正常 → 驾驶舱"
    },
    {
     "target": "/skills/chinese-asr/",
     "screen": "chinese-asr-02",
     "text": "中文语音转写技能"
    },
    {
     "target": "/projects/password-center/",
     "screen": "chinese-asr-06",
     "text": "密码中心"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "chinese-asr-07",
     "text": "电脑配置与恢复"
    },
    {
     "target": "/projects/pcconfig/",
     "screen": "chinese-asr-08",
     "text": "电脑配置与恢复"
    }
   ],
   "live": [
    {
     "slot": "run",
     "meaning": "Win+H 听写：登录任务“ChineseASR Dictation”在不在跑、上次启动有没有出错（例如“待命中”“没在运行”“上次启动失败”“暂时读不到”）",
     "source": "看板接口的自动任务扫描里 \\ChineseASR Dictation 这一项（Task Scheduler 的状态和 LastTaskResult）"
    },
    {
     "slot": "cloud",
     "meaning": "疑难录音自动云复核：开着、手动暂停或出错停了（写原因）还是免费期已到（写日期）",
     "source": "看板接口 /computer-access/api/status 的 projects.items[project=“中文语音转写”].cloud_review（state、free_until、last_run_at、last_result、failure_reason），9 月 29 日 PCConfig 提交 79c7abff 接上；运行中的服务重载后才读得到"
    }
   ]
  },
  "notes": {
   "merged": [
    "底稿“复核可疑文字”（重要录音先对照识别结果，找出要回听的句子）并进 f-flags“标出要回听的句子”，入口说法并进 f-strict：它说的就是严格模式的两路对照加疑点标注，单列会和“质量审计”重复。",
    "底稿“质量审计”（标出静音出字、重复和识别分歧）并进 f-flags。",
    "底稿“普通录音转写”写成 f-strict“严格转写（默认）”：asr-smart 默认就是 strict。"
   ],
   "dropped": [
    "Whisper-large-v3：配置里有、没有 adapter，不能运行，不算功能；只在“用了哪些模型”一屏写一句。",
    "“AI 可以自主做兼容、可回退的依赖更新”：是本人给的维护授权，不是功能，不列。",
    "离线评测集生成（eval.ps1 -Generate）并进 f-eval，不单列。"
   ],
   "unsure": [
    "替本人口吻写的句子（上线前请本人过目）：第 6 屏“日期是我记下的，没在阿里云控制台核对”“我说恢复才再开”“这是我知道后选的”“免费期过了还想传……才要我点头”；第 15 屏“我实测停下后三秒以内出字”；9 月 29 日补的第 6 屏“我也可以随时让 AI 暂停自动复核……两种停法都要我说恢复才再开”和第 13 屏第 26 项“我说恢复才再开”；第 12–13 屏功能表里“我点头后单次上传”“我说恢复才再开”“哪几句是我说的”“我的声音参考”。",
    "第 6 屏写了费用边界（免费额度用完即停的开关没开、可能产生欠费）。旧稿建议网站不写费用细节；我按“较真的读者会反驳‘免费’”的规矩写进去了，依据是 README.md:47 和本人 9/26 的决定。本人不想公开就删这一条。",
    "第 1、6 屏公开了云端复核次数（68/54/51/25）。旧稿建议不上网站（担心像在谈花钱）；这是使用次数，不是花费，我写上了。",
    "功能状态和底稿不同的三条：“辨认本人声音”底稿“不确定”→ 我标“在用”（8 月 24–29 日留下了声音参考和证据文件，本人说不常用）；“疑难云复核”底稿“待验收”→ 我标“在用”（本地结果旁已有 25 份自动复核结果、云端 54 次成功、最近一次 9 月 28 日 07:16）；“时间位置对齐”底稿“在用”→ 我标“说不准”（结果写在调用方目录，本仓库和视频项目里都没找到结果文件）。",
    "“现在”横条的 cloud 槽位：9 月 29 日看板接口已接上（PCConfig 79c7abff），运行中的服务要重载后才读得到；读不到时框里是“暂时读不到”。",
    "第 4 屏的示例正文和疑点清单是编的（“三百/三千”“谢谢观看”），真实输出的 [疑似] 写在词前还是词后没核对到具体格式；如要严格照真实格式，需要用公开样例音频跑一次再改。",
    "375 段是下限：8 月 18 日前的转写和写到别处的结果都没算。",
    "听写小窗没有现成截图，画成插画；设备菜单里第一项写的是配置里的名字“DJI Mic Mini”，实际菜单显示的名字可能更长（系统里叫“耳机 (DJI Mic Mini-…)”），没截图核对。",
    "FireRedASR2-LLM 写“小红书 FireRed 团队”是常识性背景，仓库文档只写 FireRedTeam，没有写公司名。"
   ]
  }
 },
 "source": {
  "page": "sources/pages/chinese-asr/page.json",
  "sha256": "2b122338bb3c5598a1d8cbbda1aae27d1829349132e2130c6ce5298cb315f86a",
  "converted_at_beijing": "2026-10-30T13:04:15+08:00"
 }
}
---

::screen{#chinese-asr-01 section="top"}

```typeset
{
 "screen": {
  "id": "chinese-asr-01",
  "section": "top",
  "title": "开头",
  "scene": "横版画面：左上大标题毛笔艺术字“中文语音转写”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一叠录音文件、一只麦克风带秒表、一排三个小方块代表模型、一朵云。数字卡下面一条细长的圆角横条：最左写“现在”，接着是小字“听写”和一个留空的浅色圆角小框（约横条宽度的 30%），再是小字“云端复核”和同样大小的空框，最右一个按钮〔现在正不正常 → 驾驶舱〕；两个空框里什么都不画，网页程序会往里填字。横条下面一行放两个白底细绿边的圆角按钮：〔在整套系统里的位置 → 怎么协作〕、〔GitHub〕（GitHub 按钮左边画 GitHub 的小猫标志）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
  "portrait": "竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、“现在”横条改成竖排三行（“现在”一行，“听写”加空框一行，“云端复核”加空框一行，空框占整行宽约 70%），驾驶舱按钮单独一行，最后两个按钮上下各一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
  "links": [
   {
    "text": "现在正不正常 → 驾驶舱",
    "href": "/cockpit/#chinese-asr"
   },
   {
    "text": "在整套系统里的位置 → 怎么协作",
    "href": "/how/#chinese-asr"
   },
   {
    "text": "GitHub",
    "href": "https://github.com/wlyaaaaa/ChineseASR"
   },
   {
    "text": "复制 AI 续作说明",
    "href": "/projects/chinese-asr/#ai-brief"
   },
   {
    "text": "选哪条路",
    "href": "/projects/chinese-asr/#routes"
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
     "align": "left",
     "size": "large",
     "row": "intro",
     "width": "52%",
     "text_ref": "中文语音转写"
    },
    {
     "type": "prose",
     "size": "large",
     "bold": true,
     "row": "intro",
     "text_ref": "把中文录音和口述变成能逐句核对的文字。"
    },
    {
     "type": "live_strip",
     "text_ref": "现在听写云端复核现在正不正常→驾驶舱",
     "frame_mode": "plain",
     "row": "intro"
    },
    {
     "type": "prose",
     "row": "intro",
     "text_ref": "在自己电脑上把中文录音转成文字，还会指出哪里可能错：默认每段录音让两个不同的模型各听一遍（Qwen3-A"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0,
     "row": "intro",
     "width": "48%"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto",
     "text_ref": "513段8月18日–10月21日"
    },
    {
     "type": "action_button",
     "columns": 3,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上大标题毛笔艺术字“中文语音转写”，下面一行一句话（绿色、比正文大一号），再下面介绍段。右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。中间一排四张数字卡片（和标杆页开头的数字卡一样：上面小插画，大号绿色数字，下面一行小字）；小插画依次是：一叠录音文件、一只麦克风带秒表、一排三个小方块代表模型、一朵云。数字卡下面一条细长的圆角横条：最左写“现在”，接着是小字“听写”和一个留空的浅色圆角小框（约横条宽度的 30%），再是小字“云端复核”和同样大小的空框，最右一个按钮〔现在正不正常 → 驾驶舱〕；两个空框里什么都不画，网页程序会往里填字。横条下面一行放两个白底细绿边的圆角按钮：〔在整套系统里的位置 → 怎么协作〕、〔GitHub〕（GitHub 按钮左边画 GitHub 的小猫标志）。 首屏那一排按钮末尾多一个同样样式的按钮〔复制 AI 续作说明〕（链接样式，和旁边的按钮一样大小）。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "中文语音转写"
    },
    {
     "type": "prose",
     "size": "large",
     "bold": true,
     "text_ref": "把中文录音和口述变成能逐句核对的文字。"
    },
    {
     "type": "live_strip",
     "text_ref": "现在听写云端复核现在正不正常→驾驶舱",
     "frame_mode": "plain"
    },
    {
     "type": "stat_card",
     "columns": 4,
     "columns_v": 2,
     "icons": "auto",
     "text_ref": "513段8月18日–10月21日"
    },
    {
     "type": "prose",
     "text_ref": "在自己电脑上把中文录音转成文字，还会指出哪里可能错：默认每段录音让两个不同的模型各听一遍（Qwen3-A"
    },
    {
     "type": "illustration",
     "illustration": "outside",
     "index": 0
    },
    {
     "type": "action_button",
     "columns": 1,
     "columns_v": 1,
     "text_ref": "在整套系统里的位置→怎么协作GitHub复制AI续作说明"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：从上到下依次是大标题、一句话、介绍段、插画（缩成一整行宽）、四张数字卡改成两行两张、“现在”横条改成竖排三行（“现在”一行，“听写”加空框一行，“云端复核”加空框一行，空框占整行宽约 70%），驾驶舱按钮单独一行，最后两个按钮上下各一行。 那一排按钮里同样有〔复制 AI 续作说明〕。",
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
   "source_phrase": "375 段｜8 月 18 日–9 月 26 日转成文字的不同录音（至少）",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "0.53 秒｜听写识别一段的中位用时（9 月 6–28 日，共 154 段）",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "9 个模型｜都在本机跑，共 28.5 GiB",
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
   "asset": "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云上传",
   "source_phrase": "54 次｜云端复核成功（8 月 1 日–9 月 28 日，含点名上云）",
   "sha256": "8de10ccf5db7a61ca06adfd5e2dd98b7d53c0e2ed1602d101c8eba2d8f194760",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-chinese-asr",
   "source_phrase": "右上一幅水彩插画：一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点）。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "一只夹在衣领上的小麦克风，声波一圈圈荡开，化成一行行浅灰短线落到一张纸上，纸上有两处淡黄色的小标记（纸上只画短线和黄标记，不画任何字）；纸旁一块显卡侧面亮着绿光；右下角浮着一个白底绿色的小胶囊（听写小窗：一个绿色麦克风图标、一个小下拉箭头、一个小叉，麦克风右上角一颗绿色小圆点"
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
   "asset": "_library/titles/title-398cd04705c27daf5f2a.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-398cd04705c27daf5f2a",
   "title_text": "中文语音转写",
   "sha256": "9ad5d18ce6077e2d501be681fb038a73dd24c9224c966f3dc04d7595e46099f1",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

中文语音转写

把中文录音和口述变成能逐句核对的文字。比如“把这段录音转成文字，听不清的地方标出来”，会收到文字和需要回听的时间点。

在自己电脑上把中文录音转成文字，还会指出哪里可能错：默认每段录音让两个不同的模型各听一遍（Qwen3-ASR-1.7B 主听、SenseVoiceSmall 对照），对不上的地方标出时间点。重要录音可以点名走高质量路线，另给回听网页。按 Win+H 也能口述，把文字打进当前输入框。各种录音走哪条路见〔选哪条路〕。

**513 段**｜8 月 18 日–10 月 21 日转成文字的不同录音（至少；10 月 22 日数）
**0.45 秒**｜听写识别一段的中位用时（9 月 6 日–10 月 4 日，共 445 段）
**8 个模型**｜都在本机跑，共 26.5 GiB
**57 次**｜云端复核成功（8 月 1 日起，含点名上云；截至 10 月 22 日）

现在　听写　云端复核　〔现在正不正常 → 驾驶舱〕

〔在整套系统里的位置 → 怎么协作〕　〔GitHub〕　〔复制 AI 续作说明〕

::screen{#chinese-asr-05 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-05",
  "section": "usage",
  "title": "选哪条路",
  "scene": "横版画面：左上标题。一张水彩风格的大表格，三列十一行，表头浅绿底；每行最左边一个小水彩图标（一只麦克风压在键盘上、兔子、普通录音、带星的录音、一朵云下面一把放大镜、很长的磁带、文件夹、两个说话气泡、一只指着自己的手、一张写满字的纸加时钟、一只回形针夹着旧纸）。行与行之间细浅绿分隔线。表格右上角画一支小小的分岔路路牌。表格下面一行字，末尾〔疑难的，再请云端听一遍〕画成白底细浅绿描边的圆角按钮。",
  "portrait": "竖版：标题；表格改成十一张小卡片一行一张：卡片粗体写“想要”那一格，下面两行分别是“怎么转：…”“交回什么：…”（这两个前缀是竖版卡片里的小标签，横版不画）；图标放卡片左上；最下面那行字和按钮单独一行，按钮右对齐。",
  "links": [
   {
    "text": "疑难的，再请云端听一遍",
    "href": "/projects/chinese-asr/#cloud-review"
   }
  ],
  "anchors": [
   {
    "id": "routes",
    "text": "选哪条路"
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
     "text_ref": "选哪条路"
    },
    {
     "type": "table",
     "icons": "auto",
     "text_ref": "想要怎么转交回什么边说边打字桌面听写：Win+H，只用Qwen3-ASR一个模型停顿约0.6秒就打进光标"
    },
    {
     "type": "prose",
     "text_ref": "云端什么时候传、怎么停、花不花钱：疑难的，再请云端听一遍"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。一张水彩风格的大表格，三列十一行，表头浅绿底；每行最左边一个小水彩图标（一只麦克风压在键盘上、兔子、普通录音、带星的录音、一朵云下面一把放大镜、很长的磁带、文件夹、两个说话气泡、一只指着自己的手、一张写满字的纸加时钟、一只回形针夹着旧纸）。行与行之间细浅绿分隔线。表格右上角画一支小小的分岔路路牌。表格下面一行字，末尾〔疑难的，再请云端听一遍〕画成白底细浅绿描边的圆角按钮。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "选哪条路"
    },
    {
     "type": "table",
     "icons": "auto",
     "text_ref": "想要怎么转交回什么边说边打字桌面听写：Win+H，只用Qwen3-ASR一个模型停顿约0.6秒就打进光标"
    },
    {
     "type": "prose",
     "text_ref": "云端什么时候传、怎么停、花不花钱：疑难的，再请云端听一遍"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；表格改成十一张小卡片一行一张：卡片粗体写“想要”那一格，下面两行分别是“怎么转：…”“交回什么：…”（这两个前缀是竖版卡片里的小标签，横版不画）；图标放卡片左上；最下面那行字和按钮单独一行，按钮右对齐。",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "一只麦克风压在键盘上",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "兔子",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "普通录音",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "带星的录音",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "一朵云下面一把放大镜",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
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
   "source_phrase": "很长的磁带",
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
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "文件夹",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/气泡.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "气泡",
   "source_phrase": "两个说话气泡",
   "sha256": "a58ff382f40a593b35aed5fb214cfba69d55f1157e3ea7db20331bee0b345d24",
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
   "source_phrase": "一只指着自己的手",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一张写满字的纸加时钟",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
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
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一只回形针夹着旧纸",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
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
   "source_phrase": "表格右上角画一支小小的分岔路路牌。",
   "sha256": "1dfe279ec5b683d3ceacacf8af37000c33a04422ad35709f45cfde7f9e6e85c6",
   "status": "ready",
   "original_elements": [
    "一支小小的分岔路路牌，只画路牌实体轮廓和分岔形状，不加牌面文字"
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
   "asset": "_library/titles/title-5b76399c244795471cf1.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-5b76399c244795471cf1",
   "title_text": "选哪条路",
   "sha256": "2061c15fe66c65704e896c392c7ed6d8dec88f1c379bd78383d1185f63dac47d",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

选哪条路

| 想要 | 怎么转 | 交回什么 |
|---|---|---|
| 边说边打字 | 桌面听写：Win+H，只用 Qwen3-ASR 一个模型 | 停顿约 0.6 秒就打进光标处；不润色、不上传 |
| 快速知道大意 | 快速初稿：SenseVoiceSmall 一个模型 | 正文，不做对照 |
| 平常的录音（默认） | 严格：Qwen3-ASR 主听、SenseVoiceSmall 对照 | 正文＋疑点清单＋防改动清单 |
| 重要的录音，要能逐段回听 | 高质量：FireRedASR2-LLM 主听、Qwen3-ASR 对照，每个词对到时间上 | 以上全部，再加本地回听网页 |
| 疑难的：两个模型对不上、有 [疑似]、标成重要 | 免费期内自动请阿里云百炼（Qwen Audio 3.1）再听一遍；可以让 AI 暂停 | 云端稿和本地稿并排放，本地稿不动 |
| 很长的录音 | 按停顿切段，断了再提交就接着跑 | 已核对过的段不重做 |
| 一整个文件夹 | 批量转，模型一批只加载一次 | 每个文件各一份结果 |
| 分清谁在说 | Paraformer 出逐句时间，CAM++ 按声音分组 | “说话人 1、说话人 2”，只分组，不认人 |
| 哪几句是我说的 | 用唯一一份“我”的声音参考比对，再看声道、谁打给谁、说的内容 | 每句标我、别人或说不准，都是能推翻的推定 |
| 已有文字，只要时间 | Qwen3-ForcedAligner 把文字对到录音上，每段不超过 300 秒 | 每个词的起止秒；不证明文字对 |
| 以前转过的录音 | 按原音指纹直接取回已有结果 | 带时间的片段，不重转、不开模型 |

云端什么时候传、怎么停、花不花钱：〔疑难的，再请云端听一遍〕

::screen{#chinese-asr-02 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-02",
  "section": "usage",
  "title": "两种用法",
  "scene": "横版画面：左上标题。下面左右两张大圆角卡片，各占一半宽。左卡上方一幅小水彩插画：一张书桌，显示器上一个聊天输入框，右下角浮着白绿小胶囊听写窗，一只手在键盘上按着 Win 键（输入框里只画浅灰短线，不画字）；右卡上方一幅小水彩插画：左边一部手机显示一个语音气泡、一个录音文件图标，一支绿色箭头指向一张纸，纸上两处淡黄标记（只画短线）。卡片里粗体小标题，下面四条带小圆点的短句。两张卡下面横跨整屏一行浅绿底的小结（字比正文略大）；最下面一行放链接。",
  "portrait": "竖版：标题；左卡整张在上、右卡整张在下，各自插画在卡片顶部；小结一行；链接一行。",
  "links": [
   {
    "text": "中文语音转写技能",
    "href": "/skills/chinese-asr/"
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
     "text_ref": "两种用法"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/麦克风.png"
     ],
     "text_ref": "口述：按Win+H就说"
    },
    {
     "type": "notice",
     "text_ref": "听写要快，所以只用一个模型；录音要准，所以两个模型、慢一点，但会指出哪里可能错。"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、有哪些说法：中文语音转写技能"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。下面左右两张大圆角卡片，各占一半宽。左卡上方一幅小水彩插画：一张书桌，显示器上一个聊天输入框，右下角浮着白绿小胶囊听写窗，一只手在键盘上按着 Win 键（输入框里只画浅灰短线，不画字）；右卡上方一幅小水彩插画：左边一部手机显示一个语音气泡、一个录音文件图标，一支绿色箭头指向一张纸，纸上两处淡黄标记（只画短线）。卡片里粗体小标题，下面四条带小圆点的短句。两张卡下面横跨整屏一行浅绿底的小结（字比正文略大）；最下面一行放链接。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "两种用法"
    },
    {
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/icons/麦克风.png"
     ],
     "text_ref": "口述：按Win+H就说"
    },
    {
     "type": "notice",
     "text_ref": "听写要快，所以只用一个模型；录音要准，所以两个模型、慢一点，但会指出哪里可能错。"
    },
    {
     "type": "prose",
     "text_ref": "跟AI怎么说、有哪些说法：中文语音转写技能"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；左卡整张在上、右卡整张在下，各自插画在卡片顶部；小结一行；链接一行。",
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
   "asset": "_library/hires-icons/代码窗口.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "口述：按 Win+H 就说 \n开机登录后，听写程序自己启动，把模型装进内存待命；不按就不录。点一下任何输入框（聊天框、文档、AI对话框），按Win+H或Ctrl+Win+H，屏幕上出现一个小窗，开始录音。说完停顿约0.6秒（或一口气说满20秒），这一段就打进光标处；再按一次暂停并收起。只用一个模型，不润色，也不会自动按回车发送。",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "麦克风",
   "source_phrase": "录音：交给 AI \n微信语音、会议、电话、口述笔记、课程录音，把文件交给AI就行。AI交给本机的转写服务，最多等15秒；没跑完就先拿回任务编号，接着回话，不被长录音卡住。跑完交回：干净的正文；一份疑点清单（哪一句、在第几秒、为什么可疑）；要求高质量时再加一个本地回听网页。疑难的录音，AI会自动请云端再听一遍，两份并排放，不覆盖本地稿。",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/听写窗口.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "听写窗口",
   "source_phrase": "左卡上方一幅小水彩插画：一张书桌，显示器上一个聊天输入框，右下角浮着白绿小胶囊听写窗，一只手在键盘上按着 Win 键（输入框里只画浅灰短线，不画字）；右卡上方一幅小水彩插画：左边一部手机显示一个语音气泡、一个录音文件图标，一支绿色箭头指向一张纸，纸上两处淡黄标记（只画短线）。",
   "sha256": "9805d7a1bc9651fec9702abfae2a8e4556a15ec366a939fe66c29e8e9dcbb0ff",
   "status": "ready",
   "original_elements": [
    "一张书桌，显示器上一个聊天输入框，右下角浮着白绿小胶囊听写窗，一只手在键盘上按着 Win 键（输入框里只画浅灰短线，不画字"
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
   "source_phrase": "左卡上方一幅小水彩插画：一张书桌，显示器上一个聊天输入框，右下角浮着白绿小胶囊听写窗，一只手在键盘上按着 Win 键（输入框里只画浅灰短线，不画字）；右卡上方一幅小水彩插画：左边一部手机显示一个语音气泡、一个录音文件图标，一支绿色箭头指向一张纸，纸上两处淡黄标记（只画短线）。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "左边一部手机显示一个语音气泡、一个录音文件图标，一支绿色箭头指向一张纸，纸上两处淡黄标记（只画短线"
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
   "asset": "_library/round3/titles/title-r3-21a1ae82f9192f6779d4.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\work-delivery-copilot\\img\\work-delivery-copilot-02-h.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-21a1ae82f9192f6779d4",
   "title_text": "两种用法",
   "sha256": "873190dee313516494a9269126bd18f89205b89116a3cb68004cb3a424472657",
   "status": "ready",
   "source_box": [
    49,
    64,
    506,
    219
   ],
   "g4_target_reference_available": false
  }
 ]
}
```

两种用法

**口述：按 Win+H 就说**
- 开机登录后，听写程序自己启动，把模型装进内存待命；不按就不录。
- 点一下任何输入框（聊天框、文档、AI 对话框），按 Win+H 或 Ctrl+Win+H，屏幕上出现一个小窗，开始录音。
- 说完停顿约 0.6 秒（或一口气说满 20 秒），这一段就打进光标处；再按一次暂停并收起。
- 只用一个模型，不润色，也不会自动按回车发送。

**录音：交给 AI**
- 微信语音、会议、电话、口述笔记、课程录音，把文件交给 AI 就行。
- AI 交给本机的转写服务，最多等 15 秒；没跑完就先拿回任务编号，接着回话，不被长录音卡住。
- 跑完交回：干净的正文；一份疑点清单（哪一句、在第几秒、为什么可疑）；要求高质量时再加一个本地回听网页。
- 疑难的录音，AI 会自动请云端再听一遍，两份并排放，不覆盖本地稿。

听写要快，所以只用一个模型；录音要准，所以两个模型、慢一点，但会指出哪里可能错。

跟 AI 怎么说、有哪些说法：〔中文语音转写技能〕

::screen{#chinese-asr-04 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-04",
  "section": "usage",
  "title": "一段录音交给 AI 之后",
  "scene": "横版画面：左上标题。上半部分一条从左到右的流程，五个圆角节点，每个节点一个小水彩图标（一只递出录音文件的手、一个波形变成整齐的波形并带一枚指纹、两只耳朵、放大镜照着两行字、一叠三张纸加一枚指纹印章），绿色箭头相连，节点里粗体小标题加一两行小字。下半部分画成一张摊开的水彩纸（示例结果）：左半是“正文”，两行字，其中“[疑似]”用淡黄底；右半是“疑点清单”，三行，每行前面一个小色块（P0 深橙、P1 橙、P2 浅黄）。纸的左上角一枚小小的斜体灰字标签（“交回来的样子”那一行）。最下面一行小字。",
  "portrait": "竖版：标题；五个流程节点改成从上到下排，箭头向下；示例纸张在下，“正文”和“疑点清单”上下排；最后一行小字。",
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
     "text_ref": "一段录音交给AI之后"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "text_ref": "1提交AI把录音交给本机转写服务（只在本机监听），最多等15秒，没完就先拿任务编号。2统一格式转成16k"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "columns": 2,
     "section_starts": [
      0,
      3
     ],
     "heading_refs": [
      "正文",
      "疑点清单"
     ],
     "header_nodes": 1,
     "highlights": [
      "[疑似]"
     ],
     "status_prefixes": [
      "P0",
      "P1",
      "P2"
     ],
     "text_ref": "交回来的样子（示例，内容是编的）"
    },
    {
     "type": "prose",
     "text_ref": "正文保持干净，只在拿不准的地方写[疑似]；两个模型都听不清的写[听不清]。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。上半部分一条从左到右的流程，五个圆角节点，每个节点一个小水彩图标（一只递出录音文件的手、一个波形变成整齐的波形并带一枚指纹、两只耳朵、放大镜照着两行字、一叠三张纸加一枚指纹印章），绿色箭头相连，节点里粗体小标题加一两行小字。下半部分画成一张摊开的水彩纸（示例结果）：左半是“正文”，两行字，其中“[疑似]”用淡黄底；右半是“疑点清单”，三行，每行前面一个小色块（P0 深橙、P1 橙、P2 浅黄）。纸的左上角一枚小小的斜体灰字标签（“交回来的样子”那一行）。最下面一行小字。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "一段录音交给AI之后"
    },
    {
     "type": "flow",
     "columns": 5,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "1提交AI把录音交给本机转写服务（只在本机监听），最多等15秒，没完就先拿任务编号。2统一格式转成16k"
    },
    {
     "type": "document_mock",
     "variant": "paper",
     "columns": 1,
     "section_starts": [
      0,
      3
     ],
     "heading_refs": [
      "正文",
      "疑点清单"
     ],
     "header_nodes": 1,
     "highlights": [
      "[疑似]"
     ],
     "status_prefixes": [
      "P0",
      "P1",
      "P2"
     ],
     "text_ref": "交回来的样子（示例，内容是编的）"
    },
    {
     "type": "prose",
     "text_ref": "正文保持干净，只在拿不准的地方写[疑似]；两个模型都听不清的写[听不清]。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；五个流程节点改成从上到下排，箭头向下；示例纸张在下，“正文”和“疑点清单”上下排；最后一行小字。",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "一只递出录音文件的手",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "一个波形变成整齐的波形并带一枚指纹",
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
   "source_phrase": "两只耳朵",
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
   "asset": "_library/round3/clean-assets/png/03-放大镜-clean.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "放大镜",
   "source_phrase": "放大镜照着两行字",
   "sha256": "84904c9325e20f1cc5a64be3b7621158834c1e37275ad7b03a515f4bd515ab4a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/封印文稿.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "封印文稿",
   "source_phrase": "一叠三张纸加一枚指纹印章",
   "sha256": "49dc9f261f75038d023a855365baea65981bb92e37f2615336060521b10d7aaf",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-29fcfd38909a51e5457c.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-29fcfd38909a51e5457c",
   "title_text": "一段录音交给 AI 之后",
   "sha256": "7d889c868b977a0cfa155e8f2aaea68b730838805172254a8fc33a465e0a27b9",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

一段录音交给 AI 之后

1. **提交**｜AI 把录音交给本机转写服务（只在本机监听），最多等 15 秒，没完就先拿任务编号。
2. **统一格式**｜转成 16 kHz 单声道，记下原件和转换后文件的 SHA-256（内容指纹，改一个字节就变）。
3. **两个模型各听一遍**｜Qwen3-ASR-1.7B 主听，SenseVoiceSmall 对照；长录音先按停顿切段。
4. **对照找疑点**｜逐句比：数字、否定词、单位、编号对不上的单独列；再查没声音却出字、套话、异常重复。
5. **交结果**｜正文、疑点清单，外加一张防改动清单：把所有结果文件的指纹绑在一起，事后查得出有没有被改过。

交回来的样子（示例，内容是编的）

正文
……下个月的预算先按三百万 [疑似] 报上去……
……

疑点清单
P0　03:12　“三百”还是“三千”：两个模型数字不同，请回听
P1　07:45　这里没有人声，却出现“谢谢观看”
P2　12:03　这句两个模型差得多，建议回听

正文保持干净，只在拿不准的地方写 [疑似]；两个模型都听不清的写 [听不清]。

这段录音以前转过的，不管当时是单独转还是跟着文件夹整批转，都能按原音指纹找回那份稿，不用为了拿稿再转一遍；找回的稿要是没有能回放的时间段，会明说“有稿、缺时间”，不当成没转过。哪一步跑失败了，交回的是转写进程实际的退出原因，比如音频解不开。

模型偶尔吐出繁体字时，交回前只把字形换成简体：“軟體”变“软体”、“檔案”变“档案”，不顺手把用词换成另一种说法（不会把“软体”改成“软件”、“资讯”改成“信息”），桌面听写打出来的字也一样。这样正文里的词就是模型听到的词，用词上的差别留给人判断。

::screen{#chinese-asr-06 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-06",
  "section": "usage",
  "title": "疑难的，再请云端听一遍",
  "scene": "横版画面：左上标题。标题下一条横向流程（四个小节点：一张存好的纸、一台电脑上方一个写着沙漏的小便签、一只手把一小段波形递向一朵云、云下两张并排的纸中间一个小不等号），绿色箭头相连，流程那段字分成四段写在节点下。中间七张小横卡片两列排（最后一张占满一行），每张左边一个小水彩图标（问号放大镜、一把锁、两条不同粗细的管道、日历、暂停按钮、一枚硬币、一把钥匙），右边粗体小标题加正文。下方一条浅绿底细长卡片放数字那句；最下面一行灰色小字。",
  "portrait": "竖版：标题；流程四个节点改成上下排；七张卡片一行一张；数字卡片；灰色小字。",
  "links": [
   {
    "text": "密码中心",
    "href": "/projects/password-center/"
   }
  ],
  "anchors": [
   {
    "id": "cloud-review",
    "text": "疑难的，再请云端听一遍"
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
     "text_ref": "疑难的，再请云端听一遍"
    },
    {
     "type": "flow",
     "direction": "horizontal",
     "columns": 4,
     "connector": "arrow",
     "illustration": "above_card",
     "segment_refs": [
      "本地稿先存好",
      "本机服务",
      "处理这段录音的 AI",
      "云端"
     ],
     "text_ref": "本地稿先存好→本机服务只记一笔“等AI接手”，自己从不上传→处理这段录音的AI把它送到阿里云百炼（Qwe"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "facts-0",
     "width": "50%",
     "text_ref": "什么算疑难：两个模型对不上、正文里有[疑似]、有一个模型失败、复核说要回听，或者这段被标成重要。"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "facts-0",
     "width": "50%",
     "text_ref": "什么不上传：普通清楚的录音和桌面听写，一律不上传。"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "facts-1",
     "width": "50%",
     "text_ref": "怎么传：短的走HTTPS，每段不超过120秒，能顺便分说话人；长的走实时WebSocket，本地先切成不"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "facts-1",
     "width": "50%",
     "text_ref": "免费期内自动：两款3.1模型的免费期记到北京时间12月21日00:00（日期是我记下的，没在阿里云控制台"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "facts-2",
     "width": "50%",
     "text_ref": "出错就停，也能手动停：阿里云报额度用完、欠费、余额不足、没权限或模型下线，就记下原因、停掉以后的自动上传"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "row": "facts-2",
     "width": "50%",
     "text_ref": "费用：阿里云“免费额度用完即停”的开关没开，本地也不算用量，所以免费额度用完到阿里云报错之间可能产生欠费"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "钥匙不经手：阿里云的key由密码中心直接送出去，这里只准备好请求；key不进命令行、文件和日志。"
    },
    {
     "type": "notice",
     "text_ref": "8月1日–9月27日全部云端调用（含点名上云和9月26日以前的旧模型）：尝试68次，成功54次，涉及51"
    },
    {
     "type": "prose",
     "text_ref": "本地转写时标成重要的录音也算疑难，免费期内照样自动复核；免费期过了还想传，或者不经本地转写直接把整段送上"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。标题下一条横向流程（四个小节点：一张存好的纸、一台电脑上方一个写着沙漏的小便签、一只手把一小段波形递向一朵云、云下两张并排的纸中间一个小不等号），绿色箭头相连，流程那段字分成四段写在节点下。中间七张小横卡片两列排（最后一张占满一行），每张左边一个小水彩图标（问号放大镜、一把锁、两条不同粗细的管道、日历、暂停按钮、一枚硬币、一把钥匙），右边粗体小标题加正文。下方一条浅绿底细长卡片放数字那句；最下面一行灰色小字。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "疑难的，再请云端听一遍"
    },
    {
     "type": "flow",
     "direction": "vertical",
     "columns": 4,
     "connector": "arrow",
     "illustration": "above_card",
     "segment_refs": [
      "本地稿先存好",
      "本机服务",
      "处理这段录音的 AI",
      "云端"
     ],
     "text_ref": "本地稿先存好→本机服务只记一笔“等AI接手”，自己从不上传→处理这段录音的AI把它送到阿里云百炼（Qwe"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "什么算疑难：两个模型对不上、正文里有[疑似]、有一个模型失败、复核说要回听，或者这段被标成重要。"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "什么不上传：普通清楚的录音和桌面听写，一律不上传。"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "怎么传：短的走HTTPS，每段不超过120秒，能顺便分说话人；长的走实时WebSocket，本地先切成不"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "免费期内自动：两款3.1模型的免费期记到北京时间12月21日00:00（日期是我记下的，没在阿里云控制台"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "出错就停，也能手动停：阿里云报额度用完、欠费、余额不足、没权限或模型下线，就记下原因、停掉以后的自动上传"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "费用：阿里云“免费额度用完即停”的开关没开，本地也不算用量，所以免费额度用完到阿里云报错之间可能产生欠费"
    },
    {
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "钥匙不经手：阿里云的key由密码中心直接送出去，这里只准备好请求；key不进命令行、文件和日志。"
    },
    {
     "type": "notice",
     "text_ref": "8月1日–9月27日全部云端调用（含点名上云和9月26日以前的旧模型）：尝试68次，成功54次，涉及51"
    },
    {
     "type": "prose",
     "text_ref": "本地转写时标成重要的录音也算疑难，免费期内照样自动复核；免费期过了还想传，或者不经本地转写直接把整段送上"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；流程四个节点改成上下排；七张卡片一行一张；数字卡片；灰色小字。",
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
   "source_phrase": "问号放大镜",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把锁",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
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
   "source_phrase": "两条不同粗细的管道",
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
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "日历",
   "source_phrase": "日历",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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
   "source_phrase": "暂停按钮",
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
   "source_phrase": "一枚硬币",
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
   "asset": "_library/icons/钥匙.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "钥匙",
   "source_phrase": "一把钥匙",
   "sha256": "c521280de777763c3cfeb238750a1871f8e263be5a6aa081993bd462c3cca2cf",
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
   "source_phrase": "",
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
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "",
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
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-885cfbfa5b84b744b1dc.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-885cfbfa5b84b744b1dc",
   "title_text": "疑难的，再请云端听一遍",
   "sha256": "f408e074a578e255aa2e4a486a76175518a82da1483d0873965dd202d9639da1",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

疑难的，再请云端听一遍

本地稿先存好 → 本机服务只记一笔“等 AI 接手”，自己从不上传 → 处理这段录音的 AI 把它送到阿里云百炼（Qwen Audio 3.1） → 云端稿和本地稿并排存，标出哪里不一样，本地稿不动

**什么算疑难**：两个模型对不上、正文里有 [疑似]、有一个模型失败、复核说要回听，或者这段被标成重要。
**什么不上传**：普通清楚的录音和桌面听写，一律不上传。
**怎么传**：短的走 HTTPS，每段不超过 120 秒，能顺便分说话人；长的走实时 WebSocket，本地先切成不超过 30 秒的段。
**免费期内自动**：两款 3.1 模型的免费期记到北京时间 12 月 21 日 00:00（日期是我记下的，没在阿里云控制台核对）；过期就不再自动传，结果里写“免费期已到期，云端未跑”。
**出错就停，也能手动停**：阿里云报额度用完、欠费、余额不足、没权限或模型下线，就记下原因、停掉以后的自动上传；网络抖动、超时只算这一次失败。出错停的，我说恢复就再开；换了新模型、新的免费期或新的额度周期，也会自动再开（仍受免费期限制）。我也可以让 AI 手动暂停并写上原因，这种只有我说恢复才再开，换模型、改免费期都不算。点名上云不受影响。
**费用**：阿里云“免费额度用完即停”的开关没开，本地也不算用量，所以免费额度用完到阿里云报错之间可能产生欠费；这是我知道后选的。
**钥匙不经手**：阿里云的 key 由〔密码中心〕直接送出去，这里只准备好请求；key 不进命令行、文件和日志。

8 月 1 日–9 月 27 日全部云端调用（含点名上云和 9 月 26 日以前的旧模型）：尝试 68 次，成功 54 次，涉及 51 段录音；9 月 26 日有了疑难自动复核后，写回本地结果的有 25 份，另有 31 份还在“等 AI 接手”，不算已复核（10 月 11 日统计，之后没有更晚的云端调用）。

本地转写时标成重要的录音也算疑难，免费期内照样自动复核；免费期过了还想传，或者不经本地转写直接把整段送上云，才要我点头，走的是同一个入口。

::screen{#chinese-asr-03 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-03",
  "section": "usage",
  "title": "听写小窗",
  "scene": "横版画面：左上标题。左半边一幅放大的水彩插画：白底绿边的小胶囊听写窗（真实尺寸 200×75 像素，这里放大画）：左边一个绿色麦克风按钮，麦克风右上角一颗小圆点，旁边一个小下拉箭头，最右一个小叉。从麦克风、小箭头、叉、圆点各引一条细线到旁边的标注文字（插画标注那四行）。小箭头下方展开一个小下拉菜单，里面四行字（设备菜单那一行的四项，第一项前面一个小对勾）。三色圆点图例画成三颗小圆点：绿、黄、红，各跟一句话。右半边一张浅绿边框的卡片“几个细节”，七条短句，每条前一个小水彩图标（两块屏幕、Esc 键、两个窗口、拔掉的麦克风、内存条、托盘小菜单、开始菜单）。右下角画一个 Windows 托盘右键小菜单，三行字（托盘那一行的三项）。小窗和菜单里的字只画这里给的。",
  "portrait": "竖版：标题；放大的小胶囊插画和标注在上（标注改到插画下方逐行排列）；设备菜单和三色圆点紧跟其后；“几个细节”卡片在下，七条一行一条；托盘小菜单放在最后。",
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
     "text_ref": "听写小窗"
    },
    {
     "type": "annotation",
     "media_width": 55,
     "anchors": [
      {
       "unit": 0,
       "x": 0.119167,
       "y": 0.507092,
       "width": 0.155,
       "height": 0.659574
      },
      {
       "unit": 1,
       "x": 0.2525,
       "y": 0.524823,
       "width": 0.051667,
       "height": 0.170213
      },
      {
       "unit": 2,
       "x": 0.89,
       "y": 0.514184,
       "width": 0.07,
       "height": 0.304965
      },
      {
       "unit": 3,
       "x": 0.208333,
       "y": 0.258865,
       "width": 0.04,
       "height": 0.177305
      }
     ],
     "illustration": "outside",
     "text_ref": "麦克风：点一下录音（图标变绿就在收音），再点暂停",
     "row": "panel",
     "width": "52%",
     "asset": "_library/illustrations/听写胶囊四部位.png"
    },
    {
     "type": "document_mock",
     "variant": "menu",
     "text_ref": "设备菜单：DJIMicMiniWindows默认麦克风刷新麦克风复制最近文字",
     "row": "panel"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "icons": "auto",
     "row": "panel",
     "width": "48%",
     "text_ref": "几个细节"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。左半边一幅放大的水彩插画：白底绿边的小胶囊听写窗（真实尺寸 200×75 像素，这里放大画）：左边一个绿色麦克风按钮，麦克风右上角一颗小圆点，旁边一个小下拉箭头，最右一个小叉。从麦克风、小箭头、叉、圆点各引一条细线到旁边的标注文字（插画标注那四行）。小箭头下方展开一个小下拉菜单，里面四行字（设备菜单那一行的四项，第一项前面一个小对勾）。三色圆点图例画成三颗小圆点：绿、黄、红，各跟一句话。右半边一张浅绿边框的卡片“几个细节”，七条短句，每条前一个小水彩图标（两块屏幕、Esc 键、两个窗口、拔掉的麦克风、内存条、托盘小菜单、开始菜单）。右下角画一个 Windows 托盘右键小菜单，三行字（托盘那一行的三项）。小窗和菜单里的字只画这里给的。\nmain-closer：2026-10-03T20:34:00+08:00 北京时间接听写四真实部位几何，完整图SHA 229bcb8f2ae1b1689f1d723853716b51ff59ce709753ec2e36c09d169b8db564；普通annotation自有媒体，引线坐标来自final-label-geometry，未猜坐标。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "听写小窗"
    },
    {
     "type": "annotation",
     "media_width": 100,
     "anchors": [
      {
       "unit": 0,
       "x": 0.119167,
       "y": 0.507092,
       "width": 0.155,
       "height": 0.659574
      },
      {
       "unit": 1,
       "x": 0.2525,
       "y": 0.524823,
       "width": 0.051667,
       "height": 0.170213
      },
      {
       "unit": 2,
       "x": 0.89,
       "y": 0.514184,
       "width": 0.07,
       "height": 0.304965
      },
      {
       "unit": 3,
       "x": 0.208333,
       "y": 0.258865,
       "width": 0.04,
       "height": 0.177305
      }
     ],
     "illustration": "outside",
     "text_ref": "麦克风：点一下录音（图标变绿就在收音），再点暂停",
     "asset": "_library/illustrations/听写胶囊四部位.png"
    },
    {
     "type": "document_mock",
     "variant": "menu",
     "text_ref": "设备菜单：DJIMicMiniWindows默认麦克风刷新麦克风复制最近文字"
    },
    {
     "type": "points_card",
     "whole_block": true,
     "icons": "auto",
     "text_ref": "几个细节"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；放大的小胶囊插画和标注在上（标注改到插画下方逐行排列）；设备菜单和三色圆点紧跟其后；“几个细节”卡片在下，七条一行一条；托盘小菜单放在最后。\nmain-closer：2026-10-03T20:34:00+08:00 北京时间接听写四真实部位几何，完整图SHA 229bcb8f2ae1b1689f1d723853716b51ff59ce709753ec2e36c09d169b8db564；普通annotation自有媒体，引线坐标来自final-label-geometry，未猜坐标。",
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
   "asset": "_library/hires-icons-r2/icon-clean-64b110e28ee97a9a2746.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显示器",
   "source_phrase": "两块屏幕",
   "sha256": "55d32f5accb3b0f3b0581ada87254e747e7beb55266ea7bf9a9d9e4ff5c886ff",
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
   "source_phrase": "Esc 键",
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
   "source_phrase": "两个窗口",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "麦克风",
   "source_phrase": "拔掉的麦克风",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
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
   "source_phrase": "内存条",
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
   "source_phrase": "托盘小菜单",
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
   "source_phrase": "开始菜单",
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
   "asset": "_library/illustrations/听写胶囊四部位.png",
   "fallback": false,
   "semantic_status": "round3_annotation_explicit_targets_required",
   "key": "听写胶囊四部位",
   "source_phrase": "左半边一幅放大的水彩插画：白底绿边的小胶囊听写窗（真实尺寸 200×75 像素，这里放大画）：左边一个绿色麦克风按钮，麦克风右上角一颗小圆点，旁边一个小下拉箭头，最右一个小叉。",
   "sha256": "229bcb8f2ae1b1689f1d723853716b51ff59ce709753ec2e36c09d169b8db564",
   "status": "ready",
   "original_elements": [
    "白底绿边的小胶囊听写窗（真实尺寸 200×75 像素，这里放大画）：左边一个绿色麦克风按钮，麦克风右上角一颗小圆点，旁边一个小下拉箭头，最右一个小叉"
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
   "asset": "_library/round2/isolated-titles/chinese-asr-03-title-clean.png",
   "source_image": "E:\\Cache\\Claude\\Temp\\4bd59299\\b1\\chinese-asr\\img\\chinese-asr-03-v.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-bd07fe0f9041361d495a",
   "title_text": "听写小窗",
   "sha256": "718177222b59295d480e811393cdbcc9dd3aa76aa37f5651de855bff7beb5a3f",
   "status": "ready",
   "source_box": [
    260,
    12,
    675,
    137
   ],
   "g4_target_reference_available": true
  }
 ]
}
```

听写小窗

麦克风：点一下录音（图标变绿就在收音），再点暂停
小箭头：选麦克风、刷新、复制最近文字
×：收起并暂停，最后一句照样说完
状态点：绿＝准备好了　黄＝在准备模型或在等显卡　红＝出了故障，点开看原因和怎么办

设备菜单：DJI Mic Mini　Windows 默认麦克风　刷新麦克风　复制最近文字

**几个细节**
- 200×75 像素，只显示一个：优先放在串流用的虚拟屏上，拔掉就回主屏；屏幕插拔、改分辨率会自己挪回来，拖过的位置保留。
- Esc 取消还没打进去的那段，已经打进去的留着。
- 说着说着点进了别的输入框、或切到别的程序，接下来的字就打进你现在所在的位置（切换前还没识别完的那段也跟过去），不会把你拽回原来的窗口，录音不停、也不报红。一时没有能打字的地方（焦点落在小窗自己身上，或快捷键还没松开），小窗显示“等待输入位置”：点回输入框就接着打，这期间的文字留在内存里可以从菜单复制，恢复后只打新出来的字，不把旧的再打一遍。真的发送失败才报红“文字输入失败”，下一段照样再试；管理员权限的窗口可能不收字，用复制取回。
- 选的麦克风拔了，只提示插回或换一个，不会偷偷换别的麦克风录。
- 声音和刚识别的文字只在内存里，不存文件；技术日志只记耗时、字数和出错，不记说了什么。
- 托盘右键：复制最近识别文字　暂时释放/恢复两组快捷键　退出中文听写
- 程序没开时，开始菜单里点“中文听写”打开。

::screen{#chinese-asr-07 section="usage"}

```typeset
{
 "screen": {
  "id": "chinese-asr-07",
  "section": "usage",
  "title": "出事怎么办",
  "scene": "横版画面：左上标题。一张两列九行的水彩表格（左列“遇到”，右列“怎么办”），左列每格前一个小水彩图标（没反应的键盘、黄色圆点、红色圆点、空输入框、排队的显卡、问号、断开的胶片、暂停的云、两台电脑）。表格下面一条浅绿底的小结。右上角画一只小急救箱。",
  "portrait": "竖版：标题；表格改成九张小卡片一行一张：卡片粗体写“遇到”那一格，下面一段写“怎么办”；小结在最后。",
  "links": [
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
     "text_ref": "出事怎么办"
    },
    {
     "type": "table",
     "icons": "auto",
     "text_ref": "遇到怎么办按Win+H没反应看托盘里有没有中文听写：没有就从开始菜单点“中文听写”；有的话看快捷键是不是"
    },
    {
     "type": "prose",
     "text_ref": "AI排查听写时分开看三样：听写状态、技术日志、显卡排队服务的状态，不把“等显卡”当成“模型坏了”。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。一张两列九行的水彩表格（左列“遇到”，右列“怎么办”），左列每格前一个小水彩图标（没反应的键盘、黄色圆点、红色圆点、空输入框、排队的显卡、问号、断开的胶片、暂停的云、两台电脑）。表格下面一条浅绿底的小结。右上角画一只小急救箱。",
   "portrait_required": true
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
     "type": "table",
     "icons": "auto",
     "text_ref": "遇到怎么办按Win+H没反应看托盘里有没有中文听写：没有就从开始菜单点“中文听写”；有的话看快捷键是不是"
    },
    {
     "type": "prose",
     "text_ref": "AI排查听写时分开看三样：听写状态、技术日志、显卡排队服务的状态，不把“等显卡”当成“模型坏了”。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；表格改成九张小卡片一行一张：卡片粗体写“遇到”那一格，下面一段写“怎么办”；小结在最后。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "没反应的键盘",
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
   "source_phrase": "黄色圆点",
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
   "source_phrase": "红色圆点",
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
   "source_phrase": "空输入框",
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
   "asset": "_library/hires-icons/11-显卡-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "显卡",
   "source_phrase": "排队的显卡",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "问号",
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
   "source_phrase": "断开的胶片",
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
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "云",
   "source_phrase": "暂停的云",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/笔记本电脑.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "笔记本电脑",
   "source_phrase": "两台电脑",
   "sha256": "ed5b8e2befc42e2596eefd6abfbc175ad0f28cded8b74294024e493cc0623430",
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

出事怎么办

| 遇到 | 怎么办 |
|---|---|
| 按 Win+H 没反应 | 看托盘里有没有中文听写：没有就从开始菜单点“中文听写”；有的话看快捷键是不是被暂时释放了，从托盘恢复 |
| 小窗一直是黄点 | 点状态点看原因：“正在准备模型”是刚开机在装模型；“等待 GPU”是本地大模型在用显卡，录音已存在内存里，让出来就接着出字，不想等按 Esc |
| 小窗是红点 | 点状态点看原因：麦克风断了就插回或换一个；模型加载失败就点一下麦克风重试，不用重启电脑 |
| 说完了字没打进去 | 小窗写“等待输入位置”：当时没有能打字的输入框，点回输入框，后面的字会接着打，没打进去的那段从托盘或小箭头菜单“复制最近识别文字”取回；红点写“文字输入失败”，或者是管理员权限的窗口：同样复制取回，下一段会重新尝试 |
| 转写说显卡忙 | 同类转写或本地大模型占着显卡，它不抢，结果里写着是谁占着；等那边结束再提交 |
| 结果里有 [疑似]、[听不清] | 不是坏了，是模型拿不准：照疑点清单回听那几秒 |
| 转写失败了 | 看结果里的失败原因：写的是转写进程自己的退出码和最后几行报错，比如文件加密或损坏、音频解不开；只有跑到一半真的丢了显卡租约，才报“租约丢失” |
| 找以前转过的稿，说没有时间段 | 这是有稿、缺能回放的时间，稿件位置照样给出，不是没转过，不用为此重转；真要逐句时间再另外补 |
| 长录音跑到一半断了 | 再提交同一段录音，已核对过的段直接跳过，只跑剩下的 |
| 云端复核停了 | 结果里写着原因；手动停的说“恢复云端复核”才重开，出错停的换了模型、免费期或额度周期也会重开 |
| 换电脑 | 照〔电脑配置与恢复〕里的恢复说明装回依赖和固定版本的模型，再重建听写的登录任务 |

AI 排查听写时分开看三样：听写状态、技术日志、显卡排队服务的状态，不把“等显卡”当成“模型坏了”。

::screen{#chinese-asr-08 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-08",
  "section": "tech",
  "title": "它是怎么搭的",
  "scene": "横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一个写着 AI 的对话气泡和一个小胶囊、一台小服务器、排着队的三张小显卡加一张号牌、一个带齿轮的小盒子、一本登记册、一叠纸加指纹印章），绿色箭头依次连起来；“入口”节点下方分出一条虚线小箭头指向小胶囊，表示听写是另一条路。每个节点里粗体小标题，下面一两行小字。下半部分左右两张卡片：左“显卡怎么分”（画三个彩色小方块代表转写、文字识别、本地大模型，前两个并排，第三个和它们之间隔一道小栅栏），右“这台电脑”（画一张侧面发绿光的显卡）。最下面一行小字，左边画 GitHub 小猫标志。",
  "portrait": "竖版：标题；六个节点改成从上到下排，箭头向下，听写那条虚线分支画在第一个节点右侧；两张卡片上下排；最后一行小字。",
  "links": [
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
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "flow",
     "columns": 6,
     "direction": "horizontal",
     "connector": "arrow",
     "illustration": "above_card",
     "text_ref": "1入口AI调asr-smart脚本提交录音；桌面听写是另一条路，登录时由计划任务“ChineseASRD"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_paras": true,
     "text_ref": "显卡怎么分：转写和文字识别可以同时跑，同类任务排队，本地大模型和这两者不同时用。听写的模型平时在内存里，"
    },
    {
     "type": "prose",
     "text_ref": "每次推到GitHub，都在一台干净的Windows机器上把测试跑一遍（不带显卡，不下载模型）。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。上半部分一张从左到右的流程图，六个圆角节点（小水彩图标依次：一个写着 AI 的对话气泡和一个小胶囊、一台小服务器、排着队的三张小显卡加一张号牌、一个带齿轮的小盒子、一本登记册、一叠纸加指纹印章），绿色箭头依次连起来；“入口”节点下方分出一条虚线小箭头指向小胶囊，表示听写是另一条路。每个节点里粗体小标题，下面一两行小字。下半部分左右两张卡片：左“显卡怎么分”（画三个彩色小方块代表转写、文字识别、本地大模型，前两个并排，第三个和它们之间隔一道小栅栏），右“这台电脑”（画一张侧面发绿光的显卡）。最下面一行小字，左边画 GitHub 小猫标志。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "它是怎么搭的"
    },
    {
     "type": "flow",
     "columns": 6,
     "direction": "vertical",
     "connector": "arrow",
     "illustration": "left_inside",
     "text_ref": "1入口AI调asr-smart脚本提交录音；桌面听写是另一条路，登录时由计划任务“ChineseASRD"
    },
    {
     "type": "points_card",
     "columns": 1,
     "split_paras": true,
     "text_ref": "显卡怎么分：转写和文字识别可以同时跑，同类任务排队，本地大模型和这两者不同时用。听写的模型平时在内存里，"
    },
    {
     "type": "prose",
     "text_ref": "每次推到GitHub，都在一台干净的Windows机器上把测试跑一遍（不带显卡，不下载模型）。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；六个节点改成从上到下排，箭头向下，听写那条虚线分支画在第一个节点右侧；两张卡片上下排；最后一行小字。",
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
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历时钟",
   "source_phrase": "入口｜AI 调 asr-smart 脚本提交录音；桌面听写是另一条路，登录时由计划任务“ChineseASR Dictation”启动",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "本机转写服务｜只在 127.0.0.1:18666 监听；收下任务就回编号，任务历史存最近 200 条，重启不丢",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "显卡排队｜先向〔电脑配置与恢复〕里的显卡排队服务要一张 2 分钟的租约（用显卡的许可，不续就收回），干活时每 20 秒续一次；拿不到就不跑",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
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
   "source_phrase": "工作进程｜每个任务单独起一个子进程跑模型，服务本身不装模型；管它的进程没了，它和它在 WSL（Windows 里的 Linux）里的子进程一起收掉",
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
   "asset": "_library/icons/文件齿轮.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件齿轮",
   "source_phrase": "模型登记｜一个配置文件（models.yaml）登记每个模型的版本和用途，代码里不写死模型；同类模型换一个只改这个文件",
   "sha256": "59705876c0c4dd805e6f4b02660eedad339740924895bba94a1681ce822f725f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "结果｜正文、对照记录、两份原始结果、防改动清单；云端结果另存一份",
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
   "asset": "_library/round3/titles/title-r3-b5b4dae881cd56890248.png",
   "fallback": false,
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-r3-b5b4dae881cd56890248",
   "title_text": "它是怎么搭的",
   "sha256": "5ff003545290b929c681d3d624faeefbc9518fdd5841b212babf6410143f9a46",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

它是怎么搭的

1. **入口**｜AI 调 asr-smart 脚本提交录音；桌面听写是另一条路，登录时由计划任务“ChineseASR Dictation”启动
2. **本机转写服务**｜只在 127.0.0.1:18666 监听；收下任务就回编号，任务历史存最近 200 条，重启不丢
3. **显卡排队**｜先向〔电脑配置与恢复〕里的显卡排队服务要一张 2 分钟的租约（用显卡的许可，不续就收回），干活时每 20 秒续一次；拿不到就不跑
4. **工作进程**｜每个任务单独起一个子进程跑模型，服务本身不装模型；管它的进程没了，它和它在 WSL（Windows 里的 Linux）里的子进程一起收掉
5. **模型登记**｜一个配置文件（models.yaml）登记每个模型的版本和用途，代码里不写死模型；同类模型换一个只改这个文件
6. **结果**｜正文、对照记录、两份原始结果、防改动清单；云端结果另存一份

**显卡怎么分**：转写和文字识别可以同时跑，同类任务排队，本地大模型和这两者不同时用。听写的模型平时在内存里，录音时才上显卡。

**这台电脑**：RTX 5090 D 32 GB 显卡、64 GB 内存。重要录音用的 FireRedASR2-LLM 隔在 WSL 里跑，给了 32 GB 内存加 8 GB 交换空间。

每次推到 GitHub，都在一台干净的 Windows 机器上把测试跑一遍（不带显卡，不下载模型）。

**听写怎么跟着光标**：`dictation_windows.py` 的 `insert_text` 先等快捷键修饰键松开（最多 0.5 秒），再在每段写入时重新读当前前台窗口和焦点，用 SendInput 打进去，不复用旧窗口、也不把它拉到前台；没有外部目标、落在自己的窗口或修饰键没松开返回“暂时无法输入”，`dictation.py` 显示“等待输入位置”，最近全文留在内存供复制；SendInput 真失败才报错，下一段再试（10 月 2 日北京时间提交 16fef59、9def713）。这类修复只做后台程序检查，没做前台体验验收；10 月 11 日核对时听写在运行、快捷键和开始菜单入口都在，这次运行的听写进程 10 月 10 日 11:06 启动，晚于这项修复。

**繁简只换字形**：模型输出（Qwen3-ASR、FireRedASR2 适配器）、对照、风险规则和桌面听写都经 `text_normalizer.py` 转简体；10 月 11 日 00:52 提交 1bd5a04 把 OpenCC 的 `tw2sp`（会连地区用词一起改，比如“軟體”变“软件”）换成只换字形的 `t2s`，没装 OpenCC 时的备用字表也只换字形，重复转换结果不变；新增 4 个测试定义。本轮没执行测试、没拿真实录音验收；现在运行的听写进程启动早于这次提交，重启后才会用上，文件转写的下一个任务是否已加载新版也没核对。

::screen{#chinese-asr-09 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-09",
  "section": "tech",
  "title": "用了哪些模型",
  "scene": "横版画面：左上标题。一张四列十一行的水彩表格，表头浅绿底；“在哪跑”一列用小图标区分：本机显卡画一张小显卡，本机画一台小电脑，云端画一朵小云。在“疑难复核”那一行最左边画阿里云的橙色标志。表格下面一行小字。",
  "portrait": "竖版：标题；表格改成十一张小卡片一行一张：粗体写“做什么”，下面依次三行“模型…”“在哪跑…”“为什么…”（竖版卡片内用小灰字标签区分这三行，横版不画标签）；最后一行小字。",
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
     "text_ref": "用了哪些模型"
    },
    {
     "type": "table",
     "icons": "auto",
     "text_ref": "做什么模型在哪跑为什么选它日常主听Qwen3-ASR-1.7B（阿里通义千问，17亿参数）本机显卡按公开"
    },
    {
     "type": "prose",
     "text_ref": "8个本机模型目录共26.5GiB（10月22日数），都不进GitHub。文件转写现在只有4个识别引擎：Qwen3-ASR-1.7B、SenseVoiceSmall、FireRedASR2-LLM、Pa"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。一张四列十一行的水彩表格，表头浅绿底；“在哪跑”一列用小图标区分：本机显卡画一张小显卡，本机画一台小电脑，云端画一朵小云。在“疑难复核”那一行最左边画阿里云的橙色标志。表格下面一行小字。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "用了哪些模型"
    },
    {
     "type": "table",
     "icons": "auto",
     "text_ref": "做什么模型在哪跑为什么选它日常主听Qwen3-ASR-1.7B（阿里通义千问，17亿参数）本机显卡按公开"
    },
    {
     "type": "prose",
     "text_ref": "8个本机模型目录共26.5GiB（10月22日数），都不进GitHub。文件转写现在只有4个识别引擎：Qwen3-ASR-1.7B、SenseVoiceSmall、FireRedASR2-LLM、Pa"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；表格改成十一张小卡片一行一张：粗体写“做什么”，下面依次三行“模型…”“在哪跑…”“为什么…”（竖版卡片内用小灰字标签区分这三行，横版不画标签）；最后一行小字。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "做什么｜模型｜在哪跑｜为什么选它",
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
   "asset": "_library/titles/title-ba3bec5c420cdf3b1725.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-ba3bec5c420cdf3b1725",
   "title_text": "用了哪些模型",
   "sha256": "7041904026eedb0965187e13d645e5cf838d43d216ebe623231a3c0442fd2488",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

用了哪些模型

| 做什么 | 模型 | 在哪跑 | 为什么选它 |
|---|---|---|---|
| 日常主听 | Qwen3-ASR-1.7B（阿里通义千问，17 亿参数） | 本机显卡 | 按公开中文评测挑的准确率优先模型；听写也用它 |
| 对照 | SenseVoiceSmall（阿里，小而快） | 本机显卡 | 和主听是两套不同的模型，两边对不上的地方最可能错；快速初稿也单用它 |
| 重要录音主听 | FireRedASR2-LLM（小红书 FireRed 团队，内含 70 亿参数的 Qwen2-7B） | 本机显卡，隔在 WSL 里 | 更强；只在点名时用，不因为装好了就变默认 |
| 词对到时间 | Qwen3-ForcedAligner-0.6B | 本机显卡 | 只找位置，不证明文字对 |
| 切段、加标点 | FSMN-VAD、CT-Transformer | 本机 | 在停顿处下刀，切口自然；给转写加标点 |
| 逐句时间、分说话人 | Paraformer-large＋CAM++ | 本机 | 出逐句时间；按声音分组，只分组不认人 |
| 我的声音参考 | CAM++，判定门槛固定 0.31 | 本机，私有文件 | 只在真要判断时用，结论永远是推定 |
| 听写的人声检测 | WebRTC VAD | 本机 | 没说话就不送去识别，免得空录音被编出字 |
| 疑难复核 | Qwen Audio 3.1 ASR Flash、Flash-Message（阿里云百炼） | 云端 | 只处理本地标出疑点的录音 |

8 个本机模型目录共 26.5 GiB（10 月 22 日数），都不进 GitHub。文件转写现在只有 4 个识别引擎：Qwen3-ASR-1.7B、SenseVoiceSmall、FireRedASR2-LLM、Paraformer-large，配成两套组合：日常（Qwen 主听、SenseVoice 对照）和重要录音（FireRed 主听、Qwen 对照）。10 月 20 日把一直没在用的路线删干净了：备选初稿 Fun-ASR-Nano（本机权重移进回收站，要用回来得按源码记录恢复配置、重新下载）、本地大模型仲裁、只登记没接上的 Whisper-large-v3，以及过期的云端 Qwen Audio 3.0。10 月 21 日又把 FireRed 进出数据、云端结果和隐藏入口的报错输出都固定成 UTF-8，中文不再因为系统编码变成乱码；默认用哪个模型没变。

::screen{#chinese-asr-10 section="tech"}

```typeset
{
 "screen": {
  "id": "chinese-asr-10",
  "section": "tech",
  "title": "为什么这样设计",
  "scene": "横版画面：左上标题。左边约三分之二宽，六张横向小卡片两列三行，每张左边一个小水彩图标（两只耳朵中间一个不投票的叉、一叠纸加封条、一把小锁挂在模型盒上、一架天平、一只手指着一个文件、一个关着的小开关），右边粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。",
  "portrait": "竖版：标题；六张卡片一行一张；三张大数字卡改成一行三张小卡放在最后。",
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
     "type": "content_card",
     "columns": 1,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "不投票，也不让AI改写。主听的原话留着，对照模型只负责指出分歧，分歧处标[疑似]交给人听。让第三个模型投",
     "row": "design",
     "width": "68%"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 3,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "row": "design",
     "width": "32%",
     "text_ref": "25225行代码（Python23179行、PowerShell2016行、VBS30行）544个测试定义（只计数）"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左上标题。左边约三分之二宽，六张横向小卡片两列三行，每张左边一个小水彩图标（两只耳朵中间一个不投票的叉、一叠纸加封条、一把小锁挂在模型盒上、一架天平、一只手指着一个文件、一个关着的小开关），右边粗体一句加一两行小字。右边约三分之一宽，竖着三张大数字卡（大号绿色数字，下面一行小字）。",
   "portrait_required": true
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
     "type": "content_card",
     "columns": 2,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "不投票，也不让AI改写。主听的原话留着，对照模型只负责指出分歧，分歧处标[疑似]交给人听。让第三个模型投"
    },
    {
     "type": "stat_card",
     "columns": 1,
     "columns_v": 1,
     "icons": [
      "_library/hires-icons/代码窗口.png",
      "_library/hires-icons/打勾清单.png",
      "_library/hires-icons-r2/版本循环文件.png"
     ],
     "text_ref": "25225行代码（Python23179行、PowerShell2016行、VBS30行）544个测试定义（只计数）"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；六张卡片一行一张；三张大数字卡改成一行三张小卡放在最后。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "两只耳朵中间一个不投票的叉",
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
   "asset": "_library/icons/文稿堆.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "文稿堆",
   "source_phrase": "一叠纸加封条",
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
   "asset": "_library/round3/clean-assets/png/04-锁-clean.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "锁",
   "source_phrase": "一把小锁挂在模型盒上",
   "sha256": "e9be58c66ad552ea1aa18cf5f0796168edeb3bb0813b4e6b66a7ce6b1e6ca808",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "天平",
   "source_phrase": "一架天平",
   "sha256": "4b72accf42775e0407daa6539d3442c05d1f7885c446c9cd1eee55c2af7077f0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/指向手.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "指向手",
   "source_phrase": "一只手指着一个文件",
   "sha256": "b91d58864458ae828bac8c417ce629dc5c21bbafc9cb56094265107503bfe26c",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/开关.png",
   "fallback": false,
   "semantic_status": "scene_explicit_primary_object",
   "key": "开关",
   "source_phrase": "一个关着的小开关",
   "sha256": "b0edbda21d608f2e29778b8526baf627f649e9a8ec2751907fa9f5fe02e34586",
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
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "代码窗口",
   "source_phrase": "24838 行 代码（Python 22831 行、PowerShell 1977 行、VBS 30 行）",
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
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "526 个 自动测试",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历",
   "source_phrase": "93 次 提交（7 月 7 日–9 月 28 日）",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
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

为什么这样设计

**不投票，也不让 AI 改写。**｜主听的原话留着，对照模型只负责指出分歧，分歧处标 [疑似] 交给人听。让第三个模型投票或让大模型润色，会把猜测包装成事实。
**结果能自证没被改过。**｜每次严格转写写一张清单，把正文、对照记录、两份原始结果的路径、大小、SHA-256 绑在一起；有一样被改过，状态就从“已核对”降成“不完整”。整个目录搬到备份盘也能复查。以后按原音指纹取回这份稿（单独转的、整批转的都算），也先照清单核对正文和原始结果的大小、SHA-256，对不上就不交；交回时带着原来的质量结论，当时标了要回听、两路有冲突的，取回后照样是要回听，不因为找到了稿就算已核对。
**三个模型锁版本，其余没锁。**｜Qwen3-ASR、FireRedASR2-LLM 和强制对齐模型记下版本、必要文件的大小和 SHA-256，运行前核对，对不上就不加载。升级麻烦一点，换来今天的结果和一个月前的能对得上。
**新模型不追。**｜有新版本不等于更好。要换默认，得用同一批带标准答案的录音，把字错、关键内容错、静音出字、疑点多少、耗时分开比，确实更好才换，并留好一键退回。
**只处理点名的那一段。**｜问一段录音就只转这一段，不去扫整个录音库；公开短样例只用来查能不能跑，私人录音不拿来当测试集。
**基础转写不靠大模型猜。**｜可以接本机大模型看疑点，但默认关：没有它也得稳定跑完；打开了也只读疑点证据，不改原始结果。

**25225 行**｜代码（Python 23179 行、PowerShell 2016 行、VBS 30 行）
**544 个**｜测试定义（只计数）
**101 次**｜提交（7 月 7 日–10 月 11 日）

::screen{#chinese-asr-11 section="highlights"}

```typeset
{
 "screen": {
  "id": "chinese-asr-11",
  "section": "highlights",
  "title": "亮点",
  "scene": "横版画面：和标杆页“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面“麻烦”“解法”两段正文（“麻烦：”“解法：”四个字用绿色粗体）。插画：1 两只耳朵各听一条波形，波形下两张纸，中间一个放大镜照着一处“三百/三千”的差别（放大镜里只画两个小色块，不画字）；2 一段平直的波形旁边四个小格子，其中一个亮起；3 白绿小胶囊听写窗，麦克风是绿的，旁边一个小内存条托着一团声波，远处一张显卡。",
  "portrait": "竖版：标题；三张卡片上下排，每张插画在上、字在下。",
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
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/气泡.png",
      "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png"
     ],
     "text_ref": "它会指出哪里可能错。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：和标杆页“亮点”一样：三张大卡片横排，每张上面一幅小水彩插画，卡片标题用大字，下面“麻烦”“解法”两段正文（“麻烦：”“解法：”四个字用绿色粗体）。插画：1 两只耳朵各听一条波形，波形下两张纸，中间一个放大镜照着一处“三百/三千”的差别（放大镜里只画两个小色块，不画字）；2 一段平直的波形旁边四个小格子，其中一个亮起；3 白绿小胶囊听写窗，麦克风是绿的，旁边一个小内存条托着一团声波，远处一张显卡。",
   "portrait_required": true
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
     "columns": 3,
     "columns_v": 1,
     "illustration": "top_inside",
     "icons": [
      "_library/icons/日历时钟.png",
      "_library/hires-icons-r2/气泡.png",
      "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png"
     ],
     "text_ref": "它会指出哪里可能错。"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：标题；三张卡片上下排，每张插画在上、字在下。",
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
   "asset": "_library/icons/日历时钟.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "日历时钟",
   "source_phrase": "它会指出哪里可能错。 \n麻烦：普通转写读起来句句通顺，错在哪只能从头听一遍。\n解法：两个不同的模型各听一遍，逐句比；数字、否定词、单位、编号只要两边不同就单独列出，不会被“整段95%相同”掩盖。“谢谢观看”这类视频套话，只有一边听出、或者这段本该没声音时才报，真有人这么说不会被乱删。正文保持干净，疑点带着时间，先回听那几秒。",
   "sha256": "a604980c998270412615e6b84661adaba773022a7ae8167c4bb69153981a259e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 2,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/气泡.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "气泡",
   "source_phrase": "没转出字，不等于没人说话。 \n麻烦：结果是空的，很容易被当成“这段是静音”，再被别的程序当成“没说过”。\n解法：结论分四种：转出了字、确实没人说话、有人说话但没转出来、说不准。只有整段都覆盖到、人声检测给出了“没有人声”的证据，才敢说没人说话；别的一律不下这个结论。",
   "sha256": "a58ff382f40a593b35aed5fb214cfba69d55f1157e3ea7db20331bee0b345d24",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/icon-clean-d62f5aaf71fae96c015f.png",
   "fallback": false,
   "semantic_status": "AI补充：复用同类主体，不承诺源句全部组合/动作细节一致",
   "key": "天平",
   "source_phrase": "一按就能说，模型慢一点也不丢话。 \n麻烦：刚开机模型还在装、或者显卡被本地大模型占着时开口，前半句会丢。\n解法：麦克风图标一变绿就开始收音（和右上角的状态点是两回事），声音先存在内存里，模型准备好再识别；模型进程卡住只重启它自己，没交出去的那段最多重试一次；“等显卡”“准备模型”“麦克风故障”分开显示。模型平时常驻内存，录音时才上显卡，说完就退回，把显卡让出来。",
   "sha256": "4b72accf42775e0407daa6539d3442c05d1f7885c446c9cd1eee55c2af7077f0",
   "status": "ready"
  },
  {
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "common_subject_reused_per_b2bc0efe",
   "key": "语音转写现图小槽4比3",
   "source_phrase": "插画：1 两只耳朵各听一条波形，波形下两张纸，中间一个放大镜照着一处“三百/三千”的差别（放大镜里只画两个小色块，不画字）；2 一段平直的波形旁边四个小格子，其中一个亮起；3 白绿小胶囊听写窗，麦克风是绿的，旁边一个小内存条托着一团声波，远处一张显卡。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "两只耳朵各听一条波形，波形下两张纸，中间一个放大镜照着一处抽象图形的差别（放大镜里只画两个小色块，不画字"
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
   "source_phrase": "插画：1 两只耳朵各听一条波形，波形下两张纸，中间一个放大镜照着一处“三百/三千”的差别（放大镜里只画两个小色块，不画字）；2 一段平直的波形旁边四个小格子，其中一个亮起；3 白绿小胶囊听写窗，麦克风是绿的，旁边一个小内存条托着一团声波，远处一张显卡。",
   "sha256": "31f0f14bae9218df618102a98136ddafd52cb593a5474a0425248c78e85a9f14",
   "status": "ready",
   "original_elements": [
    "一段平直的波形旁边四个小格子，其中一个亮起"
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
   "asset": "_library/illustrations/听写窗口.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "听写窗口",
   "source_phrase": "插画：1 两只耳朵各听一条波形，波形下两张纸，中间一个放大镜照着一处“三百/三千”的差别（放大镜里只画两个小色块，不画字）；2 一段平直的波形旁边四个小格子，其中一个亮起；3 白绿小胶囊听写窗，麦克风是绿的，旁边一个小内存条托着一团声波，远处一张显卡。",
   "sha256": "9805d7a1bc9651fec9702abfae2a8e4556a15ec366a939fe66c29e8e9dcbb0ff",
   "status": "ready",
   "original_elements": [
    "白绿小胶囊听写窗，麦克风是绿的，旁边一个小内存条托着一团声波，远处一张显卡"
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

亮点

**它会指出哪里可能错。**
麻烦：普通转写读起来句句通顺，错在哪只能从头听一遍。
解法：两个不同的模型各听一遍，逐句比；数字、否定词、单位、编号只要两边不同就单独列出，不会被“整段 95% 相同”掩盖。“谢谢观看”这类视频套话，只有一边听出、或者这段本该没声音时才报，真有人这么说不会被乱删。正文保持干净，疑点带着时间，先回听那几秒。

**没转出字，不等于没人说话。**
麻烦：结果是空的，很容易被当成“这段是静音”，再被别的程序当成“没说过”。
解法：结论分四种：转出了字、确实没人说话、有人说话但没转出来、说不准。只有整段都覆盖到、人声检测给出了“没有人声”的证据，才敢说没人说话；别的一律不下这个结论。

**一按就能说，模型慢一点也不丢话。**
麻烦：刚开机模型还在装、或者显卡被本地大模型占着时开口，前半句会丢。
解法：麦克风图标一变绿就开始收音（和右上角的状态点是两回事），声音先存在内存里，模型准备好再识别；模型进程卡住只重启它自己，没交出去的那段最多重试一次；“等显卡”“准备模型”“麦克风故障”分开显示。模型平时常驻内存，录音时才上显卡，说完就退回，把显卡让出来。

::screen{#chinese-asr-12 section="features"}

```typeset
{
 "screen": {
  "id": "chinese-asr-12",
  "section": "features",
  "title": "全部功能（一）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按本组张数排满每一行：听写第 1–9 项排成 3+3+3；录音转文字第 10–17 项排成 4+4；行内卡片等高等距，不留空卡位；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第一张：顶上有标题（毛笔艺术字加绿色笔刷线）和图例，图例下一行小字说明两种状态的判定。图例四个圆点分别画成绿、黄、灰、浅灰。各卡状态：1 绿；2 绿；3 黄；4 绿；5 绿；6 绿；7 浅灰；8 浅灰；9 浅灰；10 绿；11 浅灰；12 绿；13 绿；14 绿；15 浅灰；16 浅灰；17 绿。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。第一张顶上保留标题、图例和说明。",
  "links": [],
  "anchors": [
   {
    "id": "g-dictation",
    "text": "听写"
   },
   {
    "id": "f-dictation",
    "text": "桌面听写"
   },
   {
    "id": "f-resident",
    "text": "常驻、随按随用"
   },
   {
    "id": "f-gpu-yield",
    "text": "给本地大模型让显卡"
   },
   {
    "id": "f-mic-select",
    "text": "选麦克风"
   },
   {
    "id": "f-status-dot",
    "text": "状态点"
   },
   {
    "id": "f-panel-place",
    "text": "小窗放对屏幕"
   },
   {
    "id": "f-copy-recent",
    "text": "复制最近文字"
   },
   {
    "id": "f-release-hotkeys",
    "text": "把 Win+H 暂时还给系统"
   },
   {
    "id": "f-start-menu",
    "text": "开始菜单入口"
   },
   {
    "id": "g-transcribe",
    "text": "录音转文字"
   },
   {
    "id": "f-strict",
    "text": "严格转写（默认）"
   },
   {
    "id": "f-quick",
    "text": "快速初稿"
   },
   {
    "id": "f-high-quality",
    "text": "重要录音高质量转写"
   },
   {
    "id": "f-long",
    "text": "长录音分段续跑"
   },
   {
    "id": "f-batch",
    "text": "整个文件夹一起转"
   },
   {
    "id": "f-channel",
    "text": "只转一个声道"
   },
   {
    "id": "f-fun-nano",
    "text": "换用 Fun-ASR-Nano"
   },
   {
    "id": "f-async",
    "text": "交给 AI 不卡对话"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "chinese-asr-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（38项）"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收●没用过●说不准"
    },
    {
     "type": "prose",
     "text_ref": "没用过＝每用一次都会留下文件，现在一件也找不到；说不准＝用了不一定留痕，记录里没找到"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "听写"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "录音转文字",
     "statuses": [
      null,
      null,
      null,
      null,
      null,
      null,
      "off",
      null
     ]
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按本组张数排满每一行：听写第 1–9 项排成 3+3+3；录音转文字第 10–17 项排成 4+4；行内卡片等高等距，不留空卡位；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第一张：顶上有标题（毛笔艺术字加绿色笔刷线）和图例，图例下一行小字说明两种状态的判定。图例四个圆点分别画成绿、黄、灰、浅灰。各卡状态：1 绿；2 绿；3 黄；4 绿；5 绿；6 绿；7 浅灰；8 浅灰；9 浅灰；10 绿；11 浅灰；12 绿；13 绿；14 绿；15 浅灰；16 浅灰；17 绿。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "chapter_title",
     "align": "center",
     "size": "large",
     "text_ref": "全部功能（38项）"
    },
    {
     "type": "status_legend",
     "text_ref": "●在用●待验收●没用过●说不准"
    },
    {
     "type": "prose",
     "text_ref": "没用过＝每用一次都会留下文件，现在一件也找不到；说不准＝用了不一定留痕，记录里没找到"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "听写"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "录音转文字",
     "statuses": [
      null,
      null,
      null,
      null,
      null,
      null,
      "off",
      null
     ]
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。第一张顶上保留标题、图例和说明。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "桌面听写｜在任何输入框按 Win+H 或 Ctrl+Win+H 说中文，停顿约 0.6 秒就把这段打进光标处；不润色，不自动发送",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "常驻、随按随用｜登录后模型就在内存里待命，录音时才上显卡、说完退回；9 月 27 日实测停下后三秒以内出字",
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
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "给本地大模型让显卡｜本地大模型在用显卡时听写先等，录音存在内存里，让出来就接着出字",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 4,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "选麦克风｜点小箭头或右键麦克风选设备、刷新；选中的麦克风断了只提示，不偷换别的",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
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
   "source_phrase": "状态点｜麦克风右上角的小圆点：绿就绪、黄准备或等显卡、红故障，点开看原因和怎么办",
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
   "asset": "_library/hires-icons-r2/icon-clean-52188346609616ef9b0b.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "双屏同步",
   "source_phrase": "小窗放对屏幕｜只显示一个小窗，优先放串流用的虚拟屏，拔掉回主屏；拖过的位置保留",
   "sha256": "c37acf19a83b48fe035ee2e9131af25e6a15b1e09897ebc7d9fc57fbfd01fe5f",
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
   "source_phrase": "复制最近文字｜焦点换了就不再往别处打字，从托盘或小箭头菜单取回刚才整段",
   "sha256": "5808bd7916a1bd66cbb7f3409c6d74d59c6e88c005601e5db73ac8fd6215322a",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/版本循环文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "版本循环文件",
   "source_phrase": "把 Win+H 暂时还给系统｜托盘里一键释放两组快捷键，再点一次恢复",
   "sha256": "1d65d5fe0ed0a3f6e4e94b2a7024700038f5b2e771e081f97c5ce90d3dbf3bb0",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "开始菜单入口｜程序没开时，从开始菜单点“中文听写”打开并开始录音",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "打勾清单",
   "source_phrase": "严格转写（默认）｜Qwen3-ASR-1.7B 主听、SenseVoiceSmall 对照，交回干净正文和疑点清单",
   "sha256": "d8caa3a377838d7bb36bf12ab3d81365013fb4d3908627fe49c96e40b92a27b7",
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
   "source_phrase": "快速初稿｜只用 SenseVoiceSmall 一个模型，快，但不做对照",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "重要录音高质量转写｜FireRedASR2-LLM 主听、Qwen3-ASR 对照，每个词对到时间，做成回听网页",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 13,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "长录音分段续跑｜按停顿切段；中断了再提交，已核对过的段跳过",
   "sha256": "df68c5dfe8a18cb72dc31763b522c78b2ddaad96fb0490ce1123357f3cbed634",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 14,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/文件夹.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "文件夹",
   "source_phrase": "整个文件夹一起转｜一次转一个文件夹，模型一批只加载一次，每个文件各一份结果",
   "sha256": "ee8723cb2fa06df3b8158d41e608706146cb7eb566edcba01341bd8371f5a06f",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 15,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "只转一个声道｜双声道录音可以只转左或右一路，不据此判断是谁",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 16,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "换用 Fun-ASR-Nano｜点名时用这个较重的 GPU 模型出初稿，不改默认",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 17,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "交给 AI 不卡对话｜本机服务最多等 15 秒就先回任务编号，长录音在后台跑；服务重启，最近 200 条任务历史还在",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "title",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/titles/title-e54f83bf05eee7b1d004.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "title_exact_match": true,
   "text_verified": true,
   "key": "title-e54f83bf05eee7b1d004",
   "title_text": "全部功能（38 项）",
   "sha256": "31cc6d03afcf48aa6186f83fb5e9a916d8f0f5f9a820b5af5dd1fab7775a2c08",
   "status": "ready",
   "g4_target_reference_available": false
  }
 ]
}
```

全部功能（38 项）
● 在用　● 待验收　● 没用过　● 说不准
没用过＝每用一次都会留下文件，现在一件也找不到；说不准＝用了不一定留痕，记录里没找到

**听写**
1. 桌面听写｜在任何输入框按 Win+H 或 Ctrl+Win+H 说中文，停顿约 0.6 秒就把这段打进光标处；不润色，不自动发送
2. 常驻、随按随用｜登录后模型就在内存里待命，录音时才上显卡、说完退回；9 月 27 日实测停下后三秒以内出字
3. 给本地大模型让显卡｜本地大模型在用显卡时听写先等，录音存在内存里，让出来就接着出字
4. 选麦克风｜点小箭头或右键麦克风选设备、刷新；选中的麦克风断了只提示，不偷换别的
5. 状态点｜麦克风右上角的小圆点：绿就绪、黄准备或等显卡、红故障，点开看原因和怎么办
6. 小窗放对屏幕｜只显示一个小窗，优先放串流用的虚拟屏，拔掉回主屏；拖过的位置保留
7. 复制最近文字｜字跟着你当下的输入位置走；一时没地方打字或发送失败时，从托盘或小箭头菜单取回最近整段
8. 把 Win+H 暂时还给系统｜托盘里一键释放两组快捷键，再点一次恢复
9. 开始菜单入口｜程序没开时，从开始菜单点“中文听写”打开并开始录音

**录音转文字**
10. 严格转写（默认）｜Qwen3-ASR-1.7B 主听、SenseVoiceSmall 对照，交回干净正文和疑点清单
11. 快速初稿｜只用 SenseVoiceSmall 一个模型，快，但不做对照
12. 重要录音高质量转写｜FireRedASR2-LLM 主听、Qwen3-ASR 对照，每个词对到时间，做成回听网页
13. 长录音分段续跑｜按停顿切段；中断了再提交，已核对过的段跳过
14. 整个文件夹一起转｜一次转一个文件夹，模型一批只加载一次，每个文件各一份结果
15. 只转一个声道｜双声道录音可以只转左或右一路，不据此判断是谁
16. Fun-ASR-Nano 初稿（10 月 20 日已撤）｜这条点名路线连同本机权重都撤了，现在点名会被当成没登记的模型直接报错；要用回来得按源码记录恢复配置、重新下载
17. 交给 AI 不卡对话｜本机服务最多等 15 秒就先回任务编号，长录音在后台跑；服务重启，最近 200 条任务历史还在

::screen{#chinese-asr-13 section="features"}

```typeset
{
 "screen": {
  "id": "chinese-asr-13",
  "section": "features",
  "title": "全部功能（二）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按本组张数排满每一行：找出要回听的地方第 18–22 项排成 2+3；云端复核第 23–27 项排成 2+3；行内卡片等高等距，不留空卡位；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第二张：没有标题、没有图例，直接接着排。各卡状态：18 绿；19 绿；20 绿；21 绿；22 灰；23 绿；24 绿；25 灰；26 黄；27 浅灰。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-review",
    "text": "找出要回听的地方"
   },
   {
    "id": "f-flags",
    "text": "标出要回听的句子"
   },
   {
    "id": "f-review-page",
    "text": "本地回听网页"
   },
   {
    "id": "f-empty-outcome",
    "text": "分清没人说话和没转出来"
   },
   {
    "id": "f-receipt",
    "text": "防改动清单"
   },
   {
    "id": "f-llm-arb",
    "text": "本地大模型仲裁"
   },
   {
    "id": "g-cloud",
    "text": "云端复核"
   },
   {
    "id": "f-cloud-auto",
    "text": "疑难录音自动复核"
   },
   {
    "id": "f-cloud-explicit",
    "text": "点名上云"
   },
   {
    "id": "f-cloud-stop",
    "text": "出错自动停"
   },
   {
    "id": "f-cloud-pause",
    "text": "手动暂停"
   },
   {
    "id": "f-cloud-backfill",
    "text": "旧疑难录音补跑"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "chinese-asr-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "statuses": [
      null,
      null,
      null,
      null,
      "off"
     ],
     "text_ref": "找出要回听的地方"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "云端复核"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按本组张数排满每一行：找出要回听的地方第 18–22 项排成 2+3；云端复核第 23–27 项排成 2+3；行内卡片等高等距，不留空卡位；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第二张：没有标题、没有图例，直接接着排。各卡状态：18 绿；19 绿；20 绿；21 绿；22 灰；23 绿；24 绿；25 灰；26 黄；27 浅灰。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "statuses": [
      null,
      null,
      null,
      null,
      "off"
     ],
     "text_ref": "找出要回听的地方"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "云端复核"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "标出要回听的句子｜两个模型对不上、数字或否定词不同、没声音却出字、套话、异常重复、繁体、一长串没标点，都带时间标出来",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "本地回听网页｜有争议的片段列成一页，点开就听那几秒；只用本机音频，不连外网",
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
   "asset": "_library/hires-icons/01-绿叶装饰-clean.png",
   "fallback": true,
   "semantic_status": "unresolved_semantics_fallback",
   "key": "绿叶装饰",
   "source_phrase": "分清没人说话和没转出来｜空结果分四种结论，证据齐了才说“没人说话”",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "防改动清单｜把正文、对照记录、两份原始结果的指纹绑在一张清单里，有一样被改过就不再算“已核对”",
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
   "asset": "_library/icons/禁止文件.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "禁止文件",
   "source_phrase": "本地大模型仲裁｜打开后让本机大模型只看疑点证据给意见，不改原始结果；默认关",
   "sha256": "416e742e6b404499ba1014eaab7d17a21ab518cd3139112dadfb009f47a3ed3e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "疑难录音自动复核｜免费期内，疑难录音由处理它的 AI 送阿里云再听一遍，并排存，不覆盖本地稿",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
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
   "source_phrase": "点名上云｜免费期外，或不经本地转写直接整段送云端，我点头后单次上传；可加热词、保留方言或分说话人",
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
   "asset": "_library/hires-icons/33-文件夹上传-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件夹上传",
   "source_phrase": "出错自动停｜额度、欠费、权限或模型下线就停掉自动上传；我说恢复，或换了模型、免费期、额度周期后再开",
   "sha256": "88ee65efacac7c0a99ad172a81ea9c1be5688e9fe8e8d13e211ee0db3207c3af",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云上传",
   "source_phrase": "手动暂停｜让 AI 暂停疑难录音的自动复核，写上原因；换模型、改免费期都不会自己重开，我说恢复才再开，点名上云照常",
   "sha256": "8de10ccf5db7a61ca06adfd5e2dd98b7d53c0e2ed1602d101c8eba2d8f194760",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "旧疑难录音补跑｜列出以前的疑难录音一次补跑；原音搬了家，按指纹在 E:\\Music 找回",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  }
 ]
}
```

**找出要回听的地方**
18. 标出要回听的句子｜两个模型对不上、数字或否定词不同、没声音却出字、套话、异常重复、繁体、一长串没标点，都带时间标出来
19. 本地回听网页｜有争议的片段列成一页，点开就听那几秒；只用本机音频，不连外网
20. 分清没人说话和没转出来｜空结果分四种结论，证据齐了才说“没人说话”
21. 防改动清单｜把正文、对照记录、两份原始结果的指纹绑在一张清单里，有一样被改过就不再算“已核对”
22. 本地大模型仲裁（10 月 20 日已撤）｜原来可以打开让本机大模型只看疑点证据给意见、默认关；一直没在用，连同代码删掉了，疑点现在靠两路比对、风险规则和人工回听

**云端复核**
23. 疑难录音自动复核｜免费期内，疑难录音由处理它的 AI 送阿里云再听一遍，并排存，不覆盖本地稿
24. 点名上云｜免费期外，或不经本地转写直接整段送云端，我点头后单次上传；可加热词、保留方言或分说话人
25. 出错自动停｜额度、欠费、权限或模型下线就停掉自动上传；我说恢复，或换了模型、免费期、额度周期后再开
26. 手动暂停｜让 AI 暂停疑难录音的自动复核，写上原因；换模型、改免费期都不会自己重开，我说恢复才再开，点名上云照常
27. 旧疑难录音补跑｜列出以前的疑难录音一次补跑；原音搬了家，按指纹在 E:\Music 找回

::screen{#chinese-asr-14 section="features"}

```typeset
{
 "screen": {
  "id": "chinese-asr-14",
  "section": "features",
  "title": "全部功能（三）",
  "scene": "横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按本组张数排满每一行：时间和说话人第 28–31 项排成 2+2；维护和装机第 32–38 项排成 3+4；行内卡片等高等距，不留空卡位；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第三张：没有标题、没有图例，接着排；所有卡片排满后，在段尾另画一幅浅浅的水彩小插画（一只麦克风和一张写满浅灰短线的纸，不画字），不要画边框。各卡状态：28 绿；29 绿；30 浅灰；31 绿；32 绿；33 绿；34 灰；35 浅灰；36 灰；37 绿；38 黄。",
  "portrait": "竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。",
  "links": [],
  "anchors": [
   {
    "id": "g-time",
    "text": "时间和说话人"
   },
   {
    "id": "f-speakers",
    "text": "分清谁在说"
   },
   {
    "id": "f-self-voice",
    "text": "哪几句是我说的"
   },
   {
    "id": "f-align",
    "text": "已有文字找时间"
   },
   {
    "id": "f-readback",
    "text": "找回转过的结果"
   },
   {
    "id": "g-upkeep",
    "text": "维护和装机"
   },
   {
    "id": "f-gpu-queue",
    "text": "排队用显卡"
   },
   {
    "id": "f-model-lock",
    "text": "模型版本锁定"
   },
   {
    "id": "f-model-switch",
    "text": "比过才换模型、一键退回"
   },
   {
    "id": "f-check-updates",
    "text": "查有没有新版本"
   },
   {
    "id": "f-eval",
    "text": "准确率评测"
   },
   {
    "id": "f-doctor",
    "text": "体检和试跑"
   },
   {
    "id": "f-offline",
    "text": "离线重装"
   }
  ],
  "live": [],
  "screenshots": [],
  "chain": "chinese-asr-features",
  "reuse": ""
 },
 "layout": {
  "h": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "时间和说话人"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "维护和装机"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：和标杆页“全部功能”同一种卡片，但组名不单独占一列：每组先一行毛笔小标题（组名），下面该组的功能卡片按本组张数排满每一行：时间和说话人第 28–31 项排成 2+2；维护和装机第 32–38 项排成 3+4；行内卡片等高等距，不留空卡位；每张卡片左边一个小水彩图标，粗体“编号. 功能名”，下面一句话，右上角一个小圆点表示状态（绿＝在用，黄＝待验收，灰＝没用过，浅灰＝说不准）。“｜”只是功能名和那句话的分隔，不画。三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第三张：没有标题、没有图例，接着排；所有卡片排满后，在段尾另画一幅浅浅的水彩小插画（一只麦克风和一张写满浅灰短线的纸，不画字），不要画边框。各卡状态：28 绿；29 绿；30 浅灰；31 绿；32 绿；33 绿；34 灰；35 浅灰；36 灰；37 绿；38 黄。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "portrait_required": true
  },
  "v": {
   "blocks": [
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "时间和说话人"
    },
    {
     "type": "feature_card",
     "columns": 3,
     "columns_v": 1,
     "illustration": "left_inside",
     "icons": "auto",
     "text_ref": "维护和装机"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：同样的字，卡片改成一行一张，组名小标题照旧在每组上方；圆点仍在卡片右上角。三张竖图同样上下拼成一段。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "分清谁在说｜出逐句时间和“说话人 1、2”；知道是两个人打电话可以直接告诉它人数",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "哪几句是我说的｜拿唯一一份“我”的声音参考比对，再看声道、谁打给谁、说的内容；结论能推翻，不常用",
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
   "source_phrase": "已有文字找时间｜给确认过的文案和录音，找出每个词在第几秒；做视频配音用",
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
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "找回转过的结果｜按原音指纹直接取以前带时间的结果，不重转、不开模型",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
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
   "source_phrase": "排队用显卡｜每个任务先要租约；转写和文字识别可以同时跑，本地大模型和两者不同时用",
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
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "模型版本锁定｜Qwen3-ASR、FireRedASR2-LLM 和强制对齐模型运行前核对版本、大小和指纹，其他模型没有这一步",
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
   "asset": "_library/icons/秒表.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "秒表",
   "source_phrase": "比过才换模型、一键退回｜同一批带标准答案的录音分开比字错、关键错、静音出字、耗时，更好才换",
   "sha256": "f121f21414f8af87c5b41de891573f1730a4ade5ab2db1f743ea7e85f5f25b29",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-f12e6ff1182222417108.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云下载",
   "source_phrase": "查有没有新版本｜手动查上游模型出没出新版本，不自动下载、不自动换",
   "sha256": "a149b95737b7aae5ced9666a2cebe730366ea2410c938467df8d9e92e9459c39",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/麦克风.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "麦克风",
   "source_phrase": "准确率评测｜拿自己的录音配标准答案，算字错和漏字",
   "sha256": "cea9f4749442b691ce487ee15121c3b015313056f57ade43ae892e4046e0043e",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons-r2/42-听诊器检查-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "听诊器检查",
   "source_phrase": "体检和试跑｜一条命令查代理、显卡、模型配置和依赖；拿一段样例录音从头试跑一遍",
   "sha256": "38adc2f33129bb6867d702884c21813e4cb94804311d51a68bcf03398d90243b",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/数据库循环.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "数据库循环",
   "source_phrase": "离线重装｜E 盘另存一份当前在用的模型和锁定版本的依赖安装包（约 35 GiB），防上游撤包；换模型、升级依赖时一起刷新。待断网安装验收",
   "sha256": "894f72432d69ebe5a435a11509bc73a6dbd83eb6b5f77468cc9cf402de4362ad",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
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
   "role": "illustration",
   "slot_ordinal": 1,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-chinese-asr",
   "source_phrase": "三张图上下拼成一整段：画风、字号层级、组名和状态点统一；两列、三列、四列行按张数调整卡宽，每排等高等距、铺满画布，上下边都不画边框；这是第三张：没有标题、没有图例，接着排；所有卡片排满后，在段尾另画一幅浅浅的水彩小插画（一只麦克风和一张写满浅灰短线的纸，不画字），不要画边框。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "一只麦克风和一张写满浅灰短线的纸，不画字），不要画边框"
   ],
   "hidden": false
  }
 ]
}
```

**时间和说话人**
28. 分清谁在说｜出逐句时间和“说话人 1、2”；知道是两个人打电话可以直接告诉它人数
29. 哪几句是我说的｜拿唯一一份“我”的声音参考比对，再看声道、谁打给谁、说的内容；结论能推翻，不常用
30. 已有文字找时间｜给确认过的文案和录音，找出每个词在第几秒；做视频配音用
31. 找回转过的结果｜按原音指纹直接取以前的结果，单独转的、整批转的都找；核对过指纹才交，原来的回听标记照留；有稿没时间段就说明缺时间，不当成没转过；不重转、不开模型

**维护和装机**
32. 排队用显卡｜每个任务先要租约；转写和文字识别可以同时跑，本地大模型和两者不同时用
33. 模型版本锁定｜Qwen3-ASR、FireRedASR2-LLM 和强制对齐模型运行前核对版本、大小和指纹，其他模型没有这一步
34. 比过才换模型、一键退回｜同一批带标准答案的录音分开比字错、关键错、静音出字、耗时，更好才换
35. 查有没有新版本｜手动查上游模型出没出新版本，不自动下载、不自动换
36. 准确率评测｜拿自己的录音配标准答案，算字错和漏字
37. 体检和试跑｜一条命令查代理、显卡、模型配置和依赖；拿一段样例录音从头试跑一遍
38. 离线重装｜E 盘另存一份当前在用的模型和锁定版本的依赖安装包（约 35 GiB），防上游撤包；换模型、升级依赖时一起刷新。9 月 29 日已在新建环境里只用这些本地包装好并自检通过；真断网安装、新环境里用显卡转写和换电脑恢复还没验

::screen{#chinese-asr-15 section="history"}

```typeset
{
 "screen": {
  "id": "chinese-asr-15",
  "section": "history",
  "title": "演进",
  "scene": "横版画面：左边一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边留一幅大一点的水彩插画：从上到下依次长出一张写满短线的纸、两只耳朵、一张显卡、一个白绿小胶囊听写窗、一朵云和一把钥匙，像一路长出来的样子（插画里不画字）。",
  "portrait": "竖版：时间线占满宽度从上到下；插画缩小放在最上面。",
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
     "text_ref": "演进",
     "size": "large"
    },
    {
     "type": "timeline",
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "text_ref": "7月7日：一天搭起骨架：两个模型严格转写、幻觉风险规则、按轻重排的回听队列、本机转写服务、长录音断点续跑",
     "columns": 1,
     "width": "100%"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。横版画面：左边一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边留一幅大一点的水彩插画：从上到下依次长出一张写满短线的纸、两只耳朵、一张显卡、一个白绿小胶囊听写窗、一朵云和一把钥匙，像一路长出来的样子（插画里不画字）。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
   "portrait_required": true
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
     "direction": "vertical",
     "connector": "ribbon",
     "illustration": "left_inside",
     "text_ref": "7月7日：一天搭起骨架：两个模型严格转写、幻觉风险规则、按轻重排的回听队列、本机转写服务、长录音断点续跑",
     "columns": 1,
     "width": "100%"
    }
   ],
   "notes": "依据派单的统一标准和库存 source_layout 文字；未读取图像。横竖各按本屏描述编排。竖版：时间线占满宽度从上到下；插画缩小放在最上面。 2026-10-03 页修复05：按对应观感审查调整列数、留白与插画；定稿文字原样保留，逐条处理见同页 .fix.md。",
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
   "asset": "_library/icons/盾牌对勾.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "盾牌对勾",
   "source_phrase": "7 月 7 日：一天搭起骨架：两个模型严格转写、幻觉风险规则、按轻重排的回听队列、本机转写服务、长录音断点续跑、批量转写。",
   "sha256": "f0f7bf71ee382c538ac4758d72c99d915b243d5f916a3d42a70d900089769784",
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
   "source_phrase": "7 月 30 日：加 FireRedASR2-LLM，重要录音有了更强的本地路线。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 3,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云上传",
   "source_phrase": "8 月 1 日：重要录音可以点名上云（Qwen Audio 3.0）。",
   "sha256": "8de10ccf5db7a61ca06adfd5e2dd98b7d53c0e2ed1602d101c8eba2d8f194760",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 18 日：分清“没转出字”和“没人说话”。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 5,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-ac8457a4d0eb95d6af6d.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "8 月 24–25 日：分说话人；可推翻的“我的声音参考”。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 6,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-5fbd5c4a89d6e83599d1.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云上传",
   "source_phrase": "9 月 5–6 日：按原音指纹找回已有转写；Win+H 桌面听写上线；存疑的转写也能上云复核。",
   "sha256": "8de10ccf5db7a61ca06adfd5e2dd98b7d53c0e2ed1602d101c8eba2d8f194760",
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
   "semantic_status": "text_inferred_object_unverified",
   "key": "日历",
   "source_phrase": "9 月 14 日：听写加状态点，小窗放大到 200×75，只显示一个。",
   "sha256": "3f1a4857af2f7ca2a494026c1df22fcf8eb098a1f43de926f6c93dcf06bfe749",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 8,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/fix-round-2/icon-clean-6c55fc8beed8ccfd6516.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "红色警示",
   "source_phrase": "9 月 17–18 日：本地回听网页、词对到时间、模型版本锁定和一键退回；给视频配音找时间的入口。收尾验收跑了 482 项测试，零失败。",
   "sha256": "6be8a220f000b19729cdca6b3ceb7b241ff819043979ed4fb900d0ef855d9143",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 9,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "9 月 26 日：疑难录音在免费期内自动请云端复核（Qwen Audio 3.1）。",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 10,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/hires-icons/09-时钟-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "时钟",
   "source_phrase": "9 月 27 日：听写改回常驻；我实测停下后三秒以内出字。",
   "sha256": "28abf04a8f3a08fb89397e48b8b375da590410a098a0625245d25b52e1e4a7dc",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 11,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/icons/云.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "云",
   "source_phrase": "9 月 28 日：云端的 key 改由密码中心送出，这里只准备请求。",
   "sha256": "90c9bf9cc6beae234027a022585184318573c9f990ff7da6788845987bfa47f3",
   "status": "ready"
  },
  {
   "role": "icon",
   "slot_ordinal": 12,
   "orientations": [
    "h",
    "v"
   ],
   "asset": "_library/round3/clean-assets/png/12-文件核验-clean.png",
   "fallback": false,
   "semantic_status": "text_inferred_object_unverified",
   "key": "文件核验",
   "source_phrase": "9 月 29 日：云端自动复核可以手动暂停；核对并补齐重要录音的标记，确保它一路传到云端复核；离线备用建好一份，待断网安装验收。",
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
   "asset": "_library/illustrations/main-chinese-asr.png",
   "fallback": false,
   "semantic_status": "automatically_accepted_per_b2bc0efe",
   "key": "main-chinese-asr",
   "source_phrase": "横版画面：左边一条竖向时间线，每个节点一个小水彩图标、粗体日期、一两行字；右边留一幅大一点的水彩插画：从上到下依次长出一张写满短线的纸、两只耳朵、一张显卡、一个白绿小胶囊听写窗、一朵云和一把钥匙，像一路长出来的样子（插画里不画字）。",
   "sha256": "fd0136b15d80cd1eadf7d3d7a94f9306e1c2d9776454b28c009fc4c21fbff27f",
   "status": "ready",
   "original_elements": [
    "从上到下依次长出一张写满短线的纸、两只耳朵、一张显卡、一个白绿小胶囊听写窗、一朵云和一把钥匙，像一路长出来的样子（插画里不画字"
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

演进

- **7 月 7 日**：一天搭起骨架：两个模型严格转写、幻觉风险规则、按轻重排的回听队列、本机转写服务、长录音断点续跑、批量转写。
- **7 月 30 日**：加 FireRedASR2-LLM，重要录音有了更强的本地路线。
- **8 月 1 日**：重要录音可以点名上云（Qwen Audio 3.0；9 月 27 日免费期过期后只留作显式后备，10 月 20 日删除）。
- **8 月 18 日**：分清“没转出字”和“没人说话”。
- **8 月 24–25 日**：分说话人；可推翻的“我的声音参考”。
- **9 月 5–6 日**：按原音指纹找回已有转写；Win+H 桌面听写上线；存疑的转写也能上云复核。
- **9 月 14 日**：听写加状态点，小窗放大到 200×75，只显示一个。
- **9 月 17–18 日**：本地回听网页、词对到时间、模型版本锁定和一键退回；给视频配音找时间的入口。收尾验收跑了 482 项测试，零失败。
- **9 月 26 日**：疑难录音在免费期内自动请云端复核（Qwen Audio 3.1）。
- **9 月 27 日**：听写改回常驻；我实测停下后三秒以内出字。
- **9 月 28 日**：云端的 key 改由密码中心送出，这里只准备请求。
- **9 月 29 日**：云端自动复核可以手动暂停；核对并补齐重要录音的标记，确保它一路传到云端复核；离线备用建好一份，在新建环境里只用本地包装好并自检通过，真断网安装和换电脑恢复还没验。
- **10 月 20—21 日**：删掉一直没在用的路线：Fun-ASR-Nano 初稿、本地大模型仲裁、只登记没接上的 Whisper、过期的 Qwen Audio 3.0，本机模型从 9 个减到 8 个；云端复核修好续作和碎尾段；FireRed、云结果和隐藏入口的中文输出固定为 UTF-8（32df3b9、325b0c4）。
- **10 月 28–29 日**：转写进程自己失败时，交回它的退出码和报错末尾，不再被一句显卡租约报错盖住（8b6980c）；按原音指纹找已有稿也会找文件夹批量转的结果，有稿没时间段时说明缺时间，不当成没转过（512f443）。
