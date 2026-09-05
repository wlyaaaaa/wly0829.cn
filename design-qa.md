# ChineseASR 定向快照候选验收

## 当前结论

ChineseASR 网页增量已完成，尚未发布。204 个静态页面、公开内容检查及 147/147 网站测试通过，Chrome 产品验收通过；完整 npm run build 仍被既有规则快照门禁阻断。网站保存 E101，本机活动规则为 E112，verify:snapshot 返回 9 项 snapshot_live_*_drift。没有跳过、修改或模拟该检查，没有刷新其他来源，没有 push 或触发 Pages。

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
- verify:public 扫描 191 个来源文件和 341 个生产文件，共 532 项，0 finding。
- 最终 test:built：147/147 通过。历史长音频 4/4 指标仍绑定历史事实，未冒充本次重跑。
- 共享搜索 gzip 从既有约 120,787 B 增至约 121,151 B；原 118 KiB 仅余约 45 B。增长来自本次真实听写说明与技术检索词，无新运行依赖、点击时加载或重复模块。保留原专业内容，只把共享搜索预算增加最小整数 1 KiB 至 119 KiB；JS、CSS、项目搜索与分片预算不变，测试仍检查产物真实字节。
- Chrome：项目目录、总览和四个受影响模块，在 1440、390、320 宽度共 18 个组合无横向溢出，移动端截图已视觉检查；阅读层、键盘 Tab、原生跳转、System 对应简介和自定义 404 正常，console error/warn=0。
- 完整 npm run build：BLOCK；未受本次修改的 E101 网站规则快照与 E112 本机活动规则不一致。静态构建、公开门和单元测试不豁免该失败。

## 剩余义务

完整构建门、PUBLIC main push、Pages deployment 和公网新版本回读未完成。候选保存在独立本地分支 codex/chinese-asr-dictation-snapshot-20260905；主线仍是已发布的 50307b908249aae9dd7a72c5c9a50c962a20e366。继续发布前须在规则快照自身的授权范围解决 E101/E112 阻断，再验证合并后的最终批次。本任务没有将单来源请求扩大成规则或全站刷新。
