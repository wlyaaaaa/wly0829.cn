# Codex 适配

owner: `E:\.agents`

只在当前动作用到 Codex 特有机制时读。这里只补充 Codex 的不同处；共同原则在其他专题里，不在这里另立一套。本专题只补充 Codex 的调用方式；Claude 的调用方式见 [Claude 适配](agents.claude-adapter.md)。

## 入口和新消息

Codex home 里的 `AGENTS.md` 只是入口，规则从核验过的活动版本读。真实的新消息和自动续作、上下文压缩、工具消息分开看；Hook 会把个人资料状态带进来，Hook 缺失或投递不明时，资料状态按不明处理（不取用私人资料），普通工作照常。调用 MCP 不改变本机 Codex 原来的任务入口。新消息、Hook、子代理的真实身份和执行结果从本机现役入口核实，不从标题、模型自述或别的宿主遗留的环境借身份。

Codex 自动记忆的关闭配置是 `memories=false`、`generate_memories=false`、`use_memories=false`；当轮需要留下的内容统一按[共享经验的落点](agents.context-sources.md#共享经验的落点)处理，Codex 工具的已核实教训归本专题。

## 无限制授权

本人要给当前 Codex 对话开无限制授权时，直接运行 PCConfig 安装好的 `Invoke-OwnerTakeover.ps1 -Operation Open`，不先派模型判断。`HostTaskId` 只传当前宿主真实的线程 ID，不借历史任务、MCP 连接或别的对话。Open 会生成这次的配对和请求编号，用 Windows 现有的提权能力，弹出独立窗口让本人只填时长；回执里应有 `grant_type=unrestricted`。本人验证完成后，由 Hook 自动回读并使用这份授权（`CheckHost`）；模型不手动串 `Configure/Prepare/Activate/Status/Check`，也不反复打开窗口。必要的子代理沿用同一请求和原截止；本地命令带同一组三个接管环境值，不改用户级或机器级环境变量。回执丢了先查原请求，不自动重弹窗口或重新验证。入口真的报错时才去定向诊断。

## 派子代理：Codex 的不同处

共同原则见[分工与并行施工](agents.execution-coordination.md)，可派范围见 `config/model-roster.json`。

GPT 原生子代理在 `reasoning_effort` 中按共同原则填写当前默认档位：GPT-6.1 Sol 用 `ultra`，GPT-6 Luna 用可用最高档 `max`（照写好的提示生图、落盘用 `low`，见模型清单场景表“生图”）；GPT-6.1 Sol、GPT-6 Astra 原先的 xhigh 派单改填 `ultra`，GPT-6 Luna 没有 ultra。型号换代时按约法 L23 和[新型号怎么调研](agents.execution-coordination.md#新型号怎么调研)重新评估、直接更新，不自动沿用旧型号的设置。其他公司的模型档位沿用原设置。

- **主对话是 GPT 时**：容量够用时优先用原生子代理（`spawn_agent`），在 GPT-6 Luna、Sol、Astra 里按模型清单 `routing` 的场景表和难度分级（GPT 那一列）选型号和档位，各型号的档位和适用范围见 `hosts.codex.root_openai`；表里写“交 Claude”的活怎么办见 `routing.vendor_rule`。显式传 `model` 和 `reasoning_effort`，派完核对实际启动值。跨型号或跨档位时 `fork_turns` 用 `none` 或有限轮数；只有身份参数相同、完整历史确实有用时才用 `all`。
- **主对话是其他公司的模型时**：可以派 GPT-6 Sol 或 Luna，不派 Astra。容量够用时优先调用宿主工具 `openai_child`，显式填写 `agent_type`、`model`、`reasoning_effort`、`task_name`、`message`，不传 `fork_turns`；续聊走同一入口，子代理回话走 `openai_parent`，查看、等待和停止走 `openai_child_control`。子代理要再分工时，回原父任务安排。约法 L23 里“实际调用按我给这个对话或项目的授权”说的是 Claude 调用 Codex，不给 Codex 自己派 GPT 子代理另加一次授权要求。入口因容量以外的原因不可用时，主对话继续能做的部分，说清实际缺口，不悄悄换模型，也不借别的通道绕过真实限制；容量不足按下面的例外办理。
- **重大动作前的把关**：型号、最低档位和职责统一见[重大动作与本人验证](agents.protected-actions.md#重大动作前的把关)。确实需要另派时，用当前宿主的普通子代理入口明确填写符合要求的型号和思考档位；主对话为其他公司的模型时仍从上面的可派范围选择，不凭把关职责扩大可派型号。独立复核按分工原则另行安排。
- AICLI 配置和其他后端任务不是桌面原生子代理，不用来代替因鉴权、参数、上下文或真实能力限制而失败的 `openai_child`。仅宿主原生容量不足时，按下面的已授权例外转用共用包装器；其他失败按真实原因修好后继续，不随意换型号或通道。
- 新开有独立成果和责任的顶层对话时，工具可见就调用一次 `create_thread`，不预判失败、不要求本人重说；工具报错或拿不到可追踪的编号就停下说明，不盲目重试。原生槽满时的后台子任务仍由当前根对话管理，不用 `create_thread` 建顶层替身。

### 原生容量不足时转用共用包装器

实时确认宿主原生槽不足后，自动转用 `E:\.agents\tools\Invoke-ClaudeGptChild.ps1`，显式传 `-ParentHarness Codex` 和 `-SessionId '<当前真实父任务完整编号>'`。默认结果目录是 `E:\Cache\Codex\Temp\<完整SessionId>\gpt-children`，不借 Claude 会话号或截短编号。主对话是 GPT 时仍只在现有 Luna、Sol、Astra 中选；其他公司模型主持时仍只派 Sol、Luna，不派 Astra。容量判断、回执不明时的核对、同额度子代理续作及后台管理统一见[分工与并行施工的共用接续](agents.execution-coordination.md#原生容量不足与原线程接续)，不因入口改变扩大授权和业务范围。（出处：决定文档“Codex 满槽派发与同额度子代理续作”）

```powershell
$child = 'E:\.agents\tools\Invoke-ClaudeGptChild.ps1'
& $child -Mode Start -ParentHarness Codex -SessionId '<当前真实父任务完整编号>' -PromptFile '<任务.md绝对路径>' -Model gpt-6.1-sol -Effort ultra -NewWorktree -RepoPath '<仓库绝对路径>' -TaskName '<短名>' -ContinueOnQuota
& $child -Mode Watch -RunDirs @('<结果目录>')
& $child -Mode Resume -RunDir '<同一结果目录>' -PromptFile '<续作.md绝对路径>'
```

上例的 `-ContinueOnQuota` 只在同一 Codex 额度下根会话仍能正常调用时启用；否则省略。Resume 沿用保存的父宿主、真实任务号、型号、档位、传输方式和该开关，不用 Start 重建旧任务。只读任务用 `-WorkDir '<已有目录>'` 替换工作副本参数。其他管理命令的实际参数见包装器 `Get-Help`，共用执行方式见上述接续专题。

## 新消息里的状态

Hook 在真实新消息和子代理启动时，读取当前个人资料状态与本人接管状态，并告知宿主可核实的本会话型号和思考档位；本轮读不到的写未知，子代理启动时档位写未知，不借父会话的记录。资料状态不能确认时，不取用私人资料，普通工作继续；本人接管只使用正式入口回读的授权和原截止。Hook 不替模型选型号、思考档位或决定要不要委派，也不另设派发许可登记。不安装 Stop Hook。

## 官方升级

Codex 的版本号、构建号、带版本的安装目录和更新批次都不能当可用性门槛。密码中心沿本人 Windows 账户的真实祖先链识别登记包族的 Codex 桌面应用本体，日常调用自动选择 `codex-root`；从 Claude 桌面启动的 Codex 子进程按其 Claude 祖先识别为 `claude-root`，不按模型名称改换主体。官方更新后仍按同一账户、包族和桌面本体核验，无需运行时密钥续绑。受管 Hook 的内容哈希只保护 Hook 自身；缺了可选的宿主信息，只让依赖它的那项能力变成不明或不可用，普通项目照常。
