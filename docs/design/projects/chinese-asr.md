# ChineseASR 看板设计与事实基线

## 1. 进入看板的理由

ChineseASR 是当前第 4 个项目。它不是“模型列表”，而是一套本人真实使用的中文录音处理产品：从输入检查、模式选择、异步任务、长音频断点续跑，到审计、客观结果、说话人线索和隐私边界都有现行实现与验证入口。

它优先于其他候选的原因：

- PUBLIC（公开）仓库有可直接跳转的 GitHub 地址；
- 默认分支干净并与远端同步；
- 产品边界明确，能够形成六个真实模块，不需要硬拆分类；
- 本次 fresh（新鲜）运行 345 项单元测试全部通过；
- 本机 Doctor 能识别 GPU、FunASR、Qwen ASR、PyTorch、模型配置和缓存；
- 有清楚的证据缺口，可以避免把源码、测试和环境体检冒充真实录音 E2E（端到端验证）。

## 2. Source 身份

| 项 | 当前事实 |
| --- | --- |
| Repository | `wlyaaaaa/ChineseASR` |
| Visibility | PUBLIC（公开） |
| Default branch | `main` |
| Local root | `E:\Projects\Tools\ChineseASR` |
| Source commit | `70e3255326ad8ba7b0e335fdf6b4a19caf0d8029` |
| Sync | fresh remote refs 后 `HEAD...origin/main = 0/0` |
| Main worktree | clean（干净） |
| Residual | 一个已合并、干净、无唯一提交的旧工作树仍被 Git Owner 登记；不影响 main，确认没有外部任务依赖前不删除 |

## 3. 证据基线

### 本次已运行

- `scripts\doctor.ps1`：通过。
  - GPU：NVIDIA GeForce RTX 5090 D；驱动 610.88；32607 MiB。
  - WinHTTP：Direct access；代理环境干净。
  - FunASR、Qwen ASR、PyTorch：已安装。
  - 默认快速引擎：SenseVoice。
  - strict（严格）组合：Qwen3-ASR-1.7B + SenseVoice。
  - Registry 可读六个引擎：FireRedASR2-LLM、Fun-ASR-Nano、Paraformer、Qwen3-ASR-1.7B、SenseVoice、Whisper Large V3。
- `.venv\Scripts\python.exe -m unittest discover -s tests -q`：345 项，345 通过，78.623 秒。
- `git diff --check`：通过。

### 本次没有运行

- `scripts\smoke-asr-smart.ps1 -Json`：会加载真实模型；本次没有运行，所以不能写成本次 strict E2E 已通过。
- `scripts\smoke-evidence-asr.ps1 -Audio <file> -Json`：需要具名重要录音并人工核听，本次没有读取私人录音。
- 专业云入口：需要明确重要性和本次上传授权；本次没有上传、密钥消费或付费调用。
- 固定 truth（人工真值）benchmark：本次目标不是模型准确率对比，没有重跑。

### 历史真实成品证据

- 公开文档记录过一段超过 40 秒的中文电话录音四切片证据验收：FireRed + Qwen 四段均 `verified`。
- 相同请求续跑为 0 个重新处理、4 个跳过，证明同一任务身份下的分段复用曾真实工作。
- 默认 strict smoke 另有历史通过记录。这些是历史 E2E，不是本轮 fresh 模型验收，也不证明逐字正确。

## 4. 信息架构

项目总览负责回答：

1. 它实际把什么问题解决掉；
2. 一次真实任务如何从录音走到可复核结果；
3. 当前源码、测试、环境与 E2E 分别到了哪一层；
4. 哪些结果仍然必须回听；
5. 如何快速进入 Doctor、日常转写、长音频、批量和验证。

六个模块来自真实责任边界：

1. `task-routing`：输入、Smart API、job、缓存、期限、取消与恢复；
2. `models-modes`：模型 Registry、quick / strict 和显式 profile；
3. `long-batch`：连续切片、manifest、断点续跑和批量模型复用；
4. `audit-evidence`：双模型分歧、风险、客观结果、sidecar 与回执；
5. `speaker-attribution`：时间线、匿名聚类、person:self 线索和可撤销归属；
6. `runtime-privacy`：本地优先、GPU 租约、专业云入口、SecretRef 与公开边界。

项目卡片必须直接显示总览和六个模块；七个入口正好单行，不使用下拉框。

## 5. 状态表达

项目总状态使用 `mixed（证据混合）`，原因不是源码故障，而是证据层必须分开：

- Source：main 已同步；
- Test：345/345 通过；
- Environment：Doctor 通过；
- Runtime smoke：本次未运行；
- Important evidence route：本次未运行；
- Cloud route：本次未授权、未运行；
- Human review：没有读取具名私人录音。

页面不得把后三项缺失写成代码失败，也不得用前三项代替后三项。

默认结果以正文、原始输出、审计、风险和恢复入口为主。完整逐句时间线、匿名说话人和本人线索属于显式路线；默认 Qwen adapter 只规范化文本，项目没有内置音频播放器或保证可点击跳转。

## 6. 公开边界

允许公开：

- 产品用途、架构、模块、模型身份、模式、入口、测试数量和无秘密状态；
- 公共源码路径、公开 GitHub 地址、提交和内容指纹；
- 失败处理、隐私策略、E2E 缺口和人工复核边界。

不得进入网页或 Git：

- 私人录音、转写正文、声纹向量和调用方私人上下文；
- 模型权重、本机输出、wheelhouse、缓存和专业云请求；
- API Key、SecretRef 对应明文、授权回执中的秘密能力；
- 把 Speaker 编号或 person:self 分数写成真实身份结论。

## 7. 刷新规则

更新 ChineseASR 看板时，AI 先读 Registry 和当前内容，再按需要运行：

1. Git admission 与 fresh refs；
2. Doctor；
3. 全量单元测试；
4. 只有运行、默认模式或用户可见输出实质变化时才运行默认 smoke；
5. 只有存在已授权具名样本时才运行证据级或云路线；
6. 修复无需用户决策的真实项目问题；
7. 原位更新现有事实、模块和演化阶段，不追加刷新日志。

小型 refactor、测试增加、模型只是安装但没有成为默认或取得新证据，都不自动改变网页。
