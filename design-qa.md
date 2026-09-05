# ChineseASR 定向快照候选验收

## 当前结论

ChineseASR 网页增量已完成；首次候选 6518ad0 通过 147 项网站测试及 Chrome 验收。随后已修复阻断发布的快照时间耦合：带观察时间、与已发布主线完全一致且能核对来源 Git 原文的旧规则快照可保留，规则刷新仍必须绑定当前 E release。完整构建与公开门已通过，发布继续沿用现有 PUBLIC main/Pages，实际提交与部署状态由正式回读确定。

既有规划保持不变：保留 34 个独立项目，继续占用原 1–35 价值槽位，rank 15 留空；23 个已发布项目、11 个待建设项目，下一个为 #19 ProxyClean。本次没有改变项目选择或创建占位页面。

## 来源与语义增量

- 来源 PUBLIC wlyaaaaa/ChineseASR main：5c7b7da9b4bc4852124e76b5895fe6990abccfcf，2026-09-05 21:03 UTC 正式远端回读；它是 6c239e850ac6fee573fbb3e7a9e54b93d65a212c 的直接后继，只补正 README 的 FunASR 版本。本任务依据 E112 / 429e1f183a2e7d1670dd406fabe20e2ffc5a7f1b 执行。
- 来源路径：AGENTS.md、README.md、configs/dictation.yaml、requirements-core.txt、requirements-dictation.txt、scripts/dictation.ps1、src/zh_asr/dictation.py、src/zh_asr/dictation_audio.py、src/zh_asr/dictation_windows.py、tests/test_config.py、tests/test_dictation.py、tests/test_dictation_audio.py、tests/test_dictation_windows.py。
- 新产品含义：Win+H 托盘听写、逐停顿输入、Esc 取消未输入部分、焦点变化停输与主动复制、不自动回车发送、退出或暂停交还系统快捷键、登录自启及停启/卸载入口。
- 新技术含义：原 Qwen3-ASR-1.7B 单模型预载内存，录音期间申请 LocalGpuBroker，空闲释放显存与租约；16 kHz、600 ms 停顿、240 ms 最短语音、20 秒分段上限；指定设备缺失不换麦克风；音频与正文无历史文件，日志只记错误、耗时、字数。
- 依赖更新：FunASR 1.4.14 + NumPy 1.26.4；Qwen ASR 0.0.6、Torch/TorchAudio 2.11.0+cu128、Transformers 4.57.6 维持。兼容依赖可自主更新，模型新增/替换须有可靠中文效果、速度与兼容改进证据，不因版本或宣传换模，没有定时下载服务。
- 保留原文件转写、审计、说话人、云边界与离线恢复产品含义；未受影响的模型工件、WSL、环境和离线包检查保留 2026-08-31 观察边界，没有访问私人录音或重跑模型。
- Unknown：DJI Mic Mini 未连接，个人语音与真实按键端到端体验待本人完成。来源 376 项全套与最终 33 项定向测试不相加。官方 5.5 秒中文样本正确转写、预热单次解码约 0.47 秒，不代表整体耗时、个人准确率或零延迟。
- 表面：ChineseASR 总览、入口/模型/安装/运行模块、标题引导文案、Registry 对应来源，以及 System 直接派生的两处 ChineseASR 简介。Rules、Skills、PCConfig 和其他项目快照未刷新；未运行 --all。

## 验证

- build:site 生成 204 个完整静态页面、308 条紧凑搜索记录；路由数量不变。
- verify:public 扫描 193 个来源文件和 341 个生产文件，共 534 项，0 finding。
- 原候选 test:built：147/147 通过；窄修后完整套件覆盖 154 项，153 项首轮通过，QA 文档漏保留既有规划句造成的 1 项失败已补回并定向复验。历史长音频 4/4 指标仍绑定历史事实，未冒充本次重跑。
- 共享搜索 gzip 从既有约 120,787 B 增至约 121,151 B；原 118 KiB 仅余约 45 B。增长来自本次真实听写说明与技术检索词，无新运行依赖、点击时加载或重复模块。保留原专业内容，只把共享搜索预算增加最小整数 1 KiB 至 119 KiB；JS、CSS、项目搜索与分片预算不变，测试仍检查产物真实字节。
- Chrome：项目目录、总览和四个受影响模块，在 1440、390、320 宽度共 18 个组合无横向溢出，移动端截图已视觉检查；阅读层、键盘 Tab、原生跳转、System 对应简介和自定义 404 正常，console error/warn=0。
- 初始完整 build 因 E101/E112 差异阻断。根因是验证器把静态观察与此刻活动值直接绑定；Pages 的 Linux 构建原本只做快照内部一致性校验。窄修保留全部 9 项比较及真实现场验证，单列 live_drift 和 observation_relation；仅旧 release、四个规则来源文件与 origin/main 完全一致、候选以该主线为祖先、来源 commit 已在来源 main 发布、五份 Git 原文 bytes/SHA 全匹配时，允许 retained_published_observation。任何前提不成立仍阻断；没有 skip 参数、伪造身份、变更 Rules 内容或全站刷新。
- 新增 7 项真实临时 Git 仓库回归，覆盖 CRLF/LF 一致性、四种规则表面改动、缺失基线、未发布来源、缺失/损坏原文，以及未验证/同代身份冲突/回退代际拒绝。来源 collector 对新规则快照仍严格检查 verified current E release。

## 发布边界

只发布 ChineseASR 增量与这项已证必要的构建修复；原 E101 快照及观察时间保持原样，报告中本机现役 E112 不冒充网页已经刷新。没有新增常驻服务、缓存、定时器、依赖或运行时网络请求。最终必须回读本地 main、远端 main 和 Pages deployment 的同一提交，以及正式页面的听写内容与个人实测边界。
