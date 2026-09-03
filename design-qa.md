# AI CLI Profile Manager 第 20 项：产品、内容与视觉验收

## 结果与范围

本次只把既有 AI CLI Profile Manager 建成第 20 个独立项目页，并修复实际阻断本机同版本安装的 `CODEX_HOME` / `.codex` 兼容 Junction（目录连接）问题。没有预建第 21–25 项卡片或路由，没有新增 Provider、模型、付费 Live、GUI、TUI、聊天外壳、网站运行时、服务、数据库、后台任务、依赖或图片画廊。

页面继续使用现有 Registry、React、Vite 与 GitHub Pages 静态路由链，提供总览和七个来源模块：配置档与启动、引擎与 Provider、秘密与隔离、检查与实测、可恢复机器运行、本地模型与双代理、安装/退役与恢复。System 中原有 AI CLI Profile Manager 资产改为直达项目页。

此文记录发布前候选的来源、产品功能、内容、测试、浏览器与体积证据，不把将来的站点提交或 Pages 部署预写成完成。最终 Git、Pages 与公网结果以任务结束时的正式回读为准。

## 源项目修复与产品功能实测

- Git Owner 实时确认 `wlyaaaaa/ai-cli-profile-manager` 为 PUBLIC，默认分支 `main`；源修复已发布为 `88f72e668bcfc8499b89f390343bae909e50db1c`，本地 `main`、`origin/main` 与 GitHub API 回读一致，工作区干净。
- 开始时，本机已安装模块虽然显示 `0.3.12`，但 73 个文件只有 72 个与 `main` 相同，`ProfileService.ps1` 仍等于 `v0.3.12` tag，缺少 `255c300` 对损坏或非对象用户 Profile 的失败关闭修复。
- 第一次执行 `Install.ps1 -Force` 在任何替换前被退役预检阻断：`C:\Users\10979\.codex` 是指向真实 `E:\Data\AppData\Codex` 的兼容 Junction，而旧脚本把该入口当作实际扫描根并一概拒绝重解析点。原安装没有被改坏。
- `88f72e6` 让退役预检优先现有真实 `CODEX_HOME`；历史 managed state 只有文件名一致、直系父目录为单目标完整绝对 Junction、目标严格等于已验证真实 home 时才可作路径等价比对。旧记录路径不成为移动或存在性目标；未知、改写、越界、多层或身份不闭合对象仍在变更前停止。
- 独立反需求膨胀审查把初版 `+737/-36` 候选收缩为最终 `+362/-54`：删除三个通过改写生产脚本制造竞争的测试、大型合成 target/filename 矩阵和重复根校验；保留一个真实重复 helper、四个实际行为与原有退役/前像/回滚合同。
- 最终退役专项 32/32；完整 Pester 385/385、0 失败、0 跳过，耗时 146.232 秒；`scripts/Test-Release.ps1` exit 0，耗时 6.606 秒；PowerShell parser、UTF-8 BOM 与 `git diff --check` 均通过。
- 真实默认退役预检为 `ready / planned=0 / blocked=0`。最终 `Install.ps1 -Force` 成功，真实 `CODEX_HOME` 为 `E:\Data\AppData\Codex`，兼容 `.codex` Junction 与 target 原样保留，真实 quarantine 指纹未变化；安装载荷 73/73 与源码模块/data 字节匹配。
- 安装后 `aicli version` exit 0；`profile list --available --json` 回读 21 个公开 Profile、9 个 Codex Profile；`profile show codex-official --json` 为 OpenAI / `gpt-5.6-sol` / Responses 且 SecretRef 脱敏。
- 安装后的 `doctor codex-official --json` 为 14 通过、5 有限制、0 不可用；本地 Qwen3.8-27B Doctor 为 16 通过、5 有限制、0 不可用。限制包括父终端 `OPENAI_BASE_URL` 会被官方子进程清除、两个代理已安装未运行、Ollama 默认 11434 不可达，以及旧 Live 因 Codex CLI 已变为 0.153.0 而失效。
- `native codex-official` exit 0，真实显示官方登录、数据去向与将清除的 Provider 变量；`eject` exit 0，生成 2 个文件，`start.ps1` 为 1,566 B，未命中 `sk-` 秘密模式；不带 `--live` 的测试以 exit 2 正确拒绝。
- 安装态对 malformed JSON 与非对象 `[]` 两种内建同名用户 Profile 的 `show` / `list --available` 均返回 exit 4，不再静默退回内置模板。
- 本轮没有执行 `start`、Codex machine run、云端 Qwen/DeepSeek、官方 Codex/Claude、Rust Open Interpreter、OAuth、代理或本地 GPU 模型 Live。旧回执只按原版本、Profile 指纹和日期保留，不能晋升为当前 0.153.0 证据。

## 内容完整性与准确性

- 第一轮 source-first 独立审查从源规则、维护归档、两本手册、兼容矩阵、23 个 Manifest、模型/端口/代理 Registry 和代码入口重建长期产品轴，不以网站模块作为答案。
- 候选页同时说明 Profile → SecretRef → LaunchPlan → 原生 CLI、交互 `start`、`native` / `eject`、五类引擎、exact / no-fallback、DPAPI 与目标进程隔离、Doctor/text/tool/agent/all、Codex exact resume、硬预算、公开事件、受管搜索、本地模型、双代理、安装/更新/退役/卸载、中文手册与 OpenClaw 导入。
- 初次正式内容门发现并修复 3 个 P0：技术层缺少 21 个公开 Profile 的完整身份/兼容矩阵；OpenClaw 默认预览、`-Apply` / `-Force`、四个 DeepSeek Profile 与 DPAPI 导入生命周期完全缺失；Hero 把 Codex run 的实际模型/权限回读错误扩大到所有交互式启动。
- 同轮修复 Profile `set-default/remove` 与最后 SecretRef 删除边界、Rust Open Interpreter 0.0.21+ / 旧 Python 0.4.x 拒绝、Shell Key 排除、两本手册各自职责、PDF 证据边界、完整 profile/proxy/update/uninstall 命令面和 0/2/3/4/5/6 退出码。
- 最终矩阵与当前 `hidden=false` Manifest 集合精确为 21/21，Missing/Extra 均为空；每条保留 ID、引擎/Provider/模型、认证、start 或 machine-only、exact resume、source/static、installed/runtime、当前 Live/日期/限制。没有把 19 个已配置入口写成 19 个当前 Live 通过。
- 最终正式内容终审由宿主 verified 的 `gpt-5.6-sol / high / child` 完成，从 `88f72e6` 再次对照候选源码与构建页后给出 P0=0、P1=0、PASS。
- 公开内容门独立扫描 183 个源文件和 318 个构建文件，共 501 个文件，finding=0；未发现 Key、Bearer token、OAuth secret、私有端点或其他可复用秘密。

## 网站构建、测试与浏览器

- 修正后的完整网页测试为 112/112，通过第 20 项登记、七模块、三阅读层、单一快照、21 Profile 集合、OpenClaw/生命周期、自然搜索、刷新计划、System 直达、既有 19 项回归、全部路由、SEO、404、预算与公开内容合同。
- 静态构建生成 184 个完整页面和 291 条紧凑搜索记录；总览、七个模块和 21 Profile 矩阵均在构建 HTML 内，点击不等待正文 fetch（网络取数），禁用 JavaScript 时速览/产品/技术三层都显示。
- Playwright 使用本机 Edge 对 1440×900、768×1024、390×844、320×720 四档实测总览、可恢复机器运行与引擎矩阵：全部 HTTP 200，`documentWidth = clientWidth`，一个 h1，8 个总览/模块链接可见，最长 Profile ID 与命令无页面级横向溢出。
- GitHub 仓库按钮正确指向 `https://github.com/wlyaaaaa/ai-cli-profile-manager`；长标题在 390/320 自然换成两行，不与仓库卡重叠。320 首屏可读产品用途、start/run 权限差异、源码/安装状态、远程 Live 边界和观察时间。
- 速览→产品→技术的 ArrowRight / End 键切换会同步 `aria-selected`、`tabIndex`、`hidden` 与 hash；无 JavaScript 的 390 宽度页面三层均为 `display:block`。
- 21 条 Profile 在 1440/768/390/320 均首尾完整；390/320 全页截图中长 ID 可在连字符处自然换行，条目间距可扫描。浏览器 console warning/error、page error 与 request failed 均为 0。
- 独立视觉 QA 先发现移动首屏缺少当前状态和英语首现问题；Hero、项目卡、recoverable-runs 与 engines-providers 首现逐项修正后，由同一宿主 verified 的 `gpt-5.6-sol / high / child` 复核为 P0=0、P1=0、视觉 PASS。
- 本地预览已通过 Codex 右侧浏览器入口排队展示；queued 只表示已提交显示，不冒充本人已经查看。
- 可重建截图保存在 ignored 的 `docs/design/qa/ai-cli-profile-manager-project20/`，不进入公开 Git 历史。

## 体积与最小实现

- 共享交互 JavaScript 为 11,596 gzip B，在 12 KiB 线内；共享 CSS 为 21,082 gzip B，在 21 KiB 线内。两者与加入第 20 项前字节相同。
- 共享搜索为 105,656 gzip B，全项目模块搜索为 134,905 gzip B；七个 AI CLI Profile Manager 模块分片为 6,860 gzip B，仍远低于单项目 21 KiB 线。
- 21 Profile 完整矩阵和 OpenClaw/命令边界使原 103/131 KiB 搜索线不再足够；没有复制正文、没有删必要内容，最终只把总线调整为实测所需的最小整数 104/132 KiB。共享 JS/CSS 与单项目线不变。
- 没有修改 `page.jsx`、`style.css`、搜索算法、路由生成器、依赖或加载方式。新增面只是一份内容包、一项 Registry 登记、生成索引、定向测试、System 直达和必要的人类入口/项目规则/QA 同步。

## 发布边界

发布前仍须在包含本文件的最终工作树上重跑 `npm run build`、`npm test` 与 `git diff --check`，定向暂存本任务文件并 normal-push `main`；随后等待 Pages，确认本地 HEAD、远端 main 与部署 head SHA 一致，并公网回读项目目录、总览、代表模块、sitemap 与 404。新公网目标、force-push、付费 Live、秘密暴露和第 21–25 项施工均不在本项目本轮动作内。
