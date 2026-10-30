# Codex 适配

owner: `E:\.agents`

只在用到 Codex 特有机制时读；共同原则见其他专题。

## 入口和新消息

Codex home 里的 `AGENTS.md` 只是入口，规则从核验过的活动版本读。真实的新消息和自动续作、上下文压缩、工具消息分开看；Hook 会把个人资料状态带进来，Hook 缺失或投递不明时，资料状态按不明处理，并先用 `StatusPersonalEnvironment` 重读。锁着或不明时不取用私人资料；根会话问到本人自己的事，第一步先请本人验证解锁，通过后再查资料、派子代理和作答，不给降级回答；纯技术工作照常。调用 MCP 不改变本机 Codex 原来的任务入口。新消息、Hook、子代理的真实身份和执行结果从本机现役入口核实，不从标题、模型自述或别的宿主遗留的环境借身份。

SessionStart 的 startup/compact/resume 按[长任务接续](/rules/context-sources/#长任务接续)执行，不注入决定短表或要求表；原生子代理压缩跳过 SessionStart 时，也按该节读原任务状态。

根会话压缩后的只读复核按[共用复核规则](/rules/context-sources/#压缩后的后台复核)执行。此项已授权自动任务使用共用 GPT 后台包装器，并保留真实 Codex 父会话号；不受普通派发的“原生满槽才转包装器”条件限制，不扩大其他任务的调用范围。程序换窗是否触发与原生压缩分开核验，具体入口见运维说明（`E:/.agents/docs/operations/context-hooks.md`）。

Codex 自动记忆的关闭配置是 `memories=false`、`generate_memories=false`、`use_memories=false`；需要留下的内容统一按[共享经验的落点](/rules/context-sources/#共享经验的落点)处理，Codex 工具的已核实教训归本专题。

**浏览器**：Codex 桌面版的主对话和它用原生机制派的子代理，访问网站、看网页、用本人登录状态，都不调用桌面自带的浏览器工具（Chrome 插件、电脑操作插件的 `cua_repl`、应用内浏览器），一律和 Claude 一样，用共用包装器（`#原生容量不足时转用共用包装器`）派 GPT 子代理去做：带 `-ParentHarness Codex` 和当前真实父任务完整编号，型号和档位按 `config/model-roster.json` 的浏览器场景；这类网页任务不受“原生满槽才转包装器”的限制，派单按“派活松紧怎么定”写目标、已知事实、底线和完成标准，页面或入口只作参考，不叫子代理改用 `cua_repl`。包装器派出的子代理用 `agent.browsers.get("chrome")` 在本人 Chrome 自己新开的后台标签页里操作，不用 `getDefault()`、`getForUrl()` 或 `iab` 让运行时代选。应用内浏览器只用于本机文件、本地预览或本人当轮点名时。本机渲染范围与子代理连不上时的处理按[浏览器规则](/rules/capabilities-runtime/#浏览器)执行。这是可由本人当场改的默认。

## 读取聊天结果

仅查看进度时优先用 `wait_threads` 的紧凑快照；确需正文才用 `read_thread`。`turnLimit` 限制轮数，`maxOutputCharsPerItem` 约束工具说明列出的单项输出或聊天消息，都不是总输出大小保证。

`read_thread` 的消息 `id` 可能与原话存档的 `uuid` 不同；登记源消息 UUID 时，按对应原话存档的 `uuid` 填写，不能直接拿读取结果的 `id` 替代。

在 `functions.exec` 内解析返回的 JSON，只输出本次所需字段或消息，并对输出设总字数上限；更多内容按游标或明确选择续取，不直接 `text` 整个结果或把原始大数组回灌上下文。调用参数以当前工具能力为准；必须完整阅读的规则或原文仍要分段取齐。

## 定时任务和收尾

- Codex 定时任务每跑一轮，同样用结论回执命令把一句人话结论写进驾驶舱，见[能力与运行方式](/rules/capabilities-runtime/#汇报网站和自动运行的东西)“定时任务的结论写进驾驶舱”。
- Codex 没有结构化的收尾工具：本轮有要本人定或做的事时，最后一条回复的最后一行写“【等你】<一句人话>”，钩子据此登记驾驶舱、本人回复后关闭；没有等本人的事就不写这一行。

## 无限制授权

本人要给当前 Codex 对话开无限制授权时，直接运行 PCConfig 安装好的 `Invoke-OwnerTakeover.ps1 -Operation Open`，不先派模型判断。`HostTaskId` 只传当前宿主真实的线程 ID，不借历史任务、MCP 连接或别的对话。Open 会生成这次的配对和请求编号，用 Windows 现有的提权能力，弹出独立窗口让本人只填时长；回执里应有 `grant_type=unrestricted`。本人验证完成后，由 Hook 自动回读并使用这份授权（`CheckHost`）；模型不手动串 `Configure/Prepare/Activate/Status/Check`，也不反复打开窗口。必要的子代理沿用同一请求和原截止；本地命令带同一组三个接管环境值，不改用户级或机器级环境变量。回执丢了先查原请求，不自动重弹窗口或重新验证。入口真的报错时才去定向诊断。

## 派子代理：Codex 的不同处

共同原则见[分工与并行施工](/rules/execution-coordination/)，可派范围见 `config/model-roster.json`。
原生子代理和包装器子任务统一按[子代理原则](/rules/execution-coordination/#派子代理的原则)及[派活松紧怎么定](/rules/execution-coordination/#派活松紧怎么定)交付；核验由根或包装器完成，子代理按需读给定版本的专题。

原生 GPT 的 `reasoning_effort` 按共同原则第 4 条和模型清单 `routing.effort_rule` 填写；其他厂商沿用各自设置。型号换代按[新型号怎么调研](/rules/execution-coordination/#新型号怎么调研)重评。

- **主对话是 GPT 时**：容量够用时优先用原生子代理（`spawn_agent`），按模型清单 `routing` 的场景表和难度分级（GPT 那一列）选型号和档位，可派型号、档位和适用范围见 `hosts.codex.root_openai`；表里写“交 Claude”的活怎么办见 `routing.vendor_rule`。显式传 `model` 和 `reasoning_effort`，派完核对实际启动值。跨型号或跨档位时 `fork_turns` 用 `none` 或有限轮数；只有身份参数相同、完整历史确实有用时才用 `all`。
- **主对话是其他公司的模型时**：可派型号见模型清单对应宿主的范围，不派 Astra。容量够用时优先调用宿主工具 `openai_child`，显式填写 `agent_type`、`model`、`reasoning_effort`、`task_name`、`message`，不传 `fork_turns`；续聊走同一入口，子代理回话走 `openai_parent`，查看、等待和停止走 `openai_child_control`。子代理要再分工时，回原父任务安排。约法 L23 里“实际调用按我给这个对话或项目的授权”说的是 Claude 调用 Codex，不给 Codex 自己派 GPT 子代理另加一次授权要求。入口因容量以外的原因不可用时，主对话继续能做的部分，说清实际缺口，不悄悄换模型，也不借别的通道绕过真实限制；容量不足按下面的例外办理。
- **重大动作前的把关**：型号、最低档位和职责统一见[重大动作与本人验证](/rules/protected-actions/#重大动作前的把关)。确实需要另派时，用当前宿主的普通子代理入口明确填写符合要求的型号和思考档位；主对话为其他公司的模型时仍从上面的可派范围选择，不凭把关职责扩大可派型号。独立复核按分工原则另行安排。
- AICLI 配置和其他后端任务不是桌面原生子代理，不用来代替因鉴权、参数、上下文或真实能力限制而失败的 `openai_child`。仅宿主原生容量不足时，按下面的已授权例外转用共用包装器；其他失败按真实原因修好后继续，不随意换型号或通道。
- 新开有独立成果和责任的顶层对话时，工具可见就调用一次 `create_thread`，不预判失败、不要求本人重说；工具报错或拿不到可追踪的编号就停下说明，不盲目重试。原生槽满时的后台子任务仍由当前根对话管理，不用 `create_thread` 建顶层替身。

### 原生容量不足时转用共用包装器

实时确认宿主原生槽不足后，自动转用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，显式传 `-ParentHarness Codex` 和 `-SessionId '<当前真实父任务完整编号>'`。默认结果目录是 `E:\Cache\Codex\Temp\<完整SessionId>\gpt-children`，不借 Claude 会话号或截短编号。容量判断、回执不明时的核对、同额度子代理续作及后台管理统一见[分工与并行施工的共用接续](/rules/execution-coordination/#原生容量不足与原线程接续)，不因入口改变扩大授权和业务范围。

```powershell
$child = 'E:\.agents\tools\Invoke-ClaudeGptChild.ps1'
& $child -Mode Start -ParentHarness Codex -SessionId '<当前真实父任务完整编号>' -PromptFile '<任务.md绝对路径>' -Model gpt-6.1-sol -Effort ultra -NewWorktree -RepoPath '<仓库绝对路径>' -TaskName '<短名>' -ContinueOnQuota
& $child -Mode Watch -RunDirs @('<结果目录>')
& $child -Mode Resume -RunDir '<同一结果目录>' -PromptFile '<续作.md绝对路径>'
```

执行器监测、订阅、接续状态和参数用法只见派发说明（`E:/.agents/docs/claude-gpt-child-dispatch.md`），与 Claude 共用。

上例的 `-ContinueOnQuota` 只在同额度根会话仍能正常调用时启用。派活字段、预算和验收只见派发说明；修改仓库用任务专用工作树，只读用 `-WorkDir '<已有目录>'`。

## 新消息里的状态

Hook 每条真实新消息和子代理启动带来共享资料、本人接管及可核实的型号和档位；未知如实写，子代理启动不借父记录。根状态未知用 `StatusPersonalEnvironment` 回读；个人资料的判断、解锁和缺口交回按[资料锁](/rules/privacy-data/#个人资料的锁和解锁)与共同原则第 7 条，纯技术工作继续。

Stop 与 Claude 共用版本、明确 Report 目标集合、验收和资料缺口检查；首次拦截按真实原因补解锁或验收，同轮第二次只提示。边界核验失败只放行受影响检查并留诊断码。Hook 不选型号、档位或是否委派，不加派发许可、不按关键词弹验证。具体接线见状态钩子（`E:/.agents/docs/operations/context-hooks.md#个人资料先解锁与结束兜底`）。

## 官方升级

Codex 的版本号、构建号、带版本的安装目录和更新批次都不能当可用性门槛。密码中心沿本人 Windows 账户的真实祖先链识别登记包族的 Codex 桌面应用本体，日常调用自动选择 `codex-root`；从 Claude 桌面启动的 Codex 子进程按其 Claude 祖先识别为 `claude-root`，不按模型名称改换主体。官方更新后仍按同一账户、包族和桌面本体核验，无需运行时密钥续绑。受管 Hook 的内容哈希只保护 Hook 自身；缺了可选的宿主信息，只让依赖它的那项能力变成不明或不可用，普通项目照常。
