# 按需更新程序

## S1 常设格式（2026-10-11 定稿）

保留 `registry.json` 的 `content-refresh.sources.v1` 和原有记录字段。新增字段均放在
`records[]` 的同一条记录：`field` 是 JSON 字段路径（如 `screens[0].text`、
`status_line.facts[0]`、`status_line.last.at`），`start/end` 可指定最终旧值的字符串字符范围；有范围时不用 page_pattern 再捕获。
`page_pattern` 必须只有一个匹配，用捕获组 1 指定旧值；`page_number` 继续兼容。
来源记录的 `automatic=true`、`scope_status=verified` 和 `measurement_scope` 表明同口径
已核实；新办法不能省掉这一步。`private=true` 是数据类别，登记过的只读计数/状态
入口仍可自动取数，不许可输出私人条目正文。

新增只读办法：

```json
{"kind":"entry","entry":"materials-status","pointer":["materials"],"timeout":20}
{"kind":"sqlite_ro","path":"E:/PersonalData/材料库/materials.sqlite3","sql":"select count(*) from filename_entries"}
{"kind":"log_window","path":"%LOCALAPPDATA%/PCConfig/logs/hot-backup","include":["personal-replica-*.log"],"pattern":"materials_sync_current.*complete","days":null,"operation":"count"}
{"kind":"usage_ledger","key":"personal-materials","operation":"count_7d"}
```

`entries.json` 是入口名到配置的白名单对象。普通入口配置为
`{"argv":["python","E:/已核实的入口.py","status"],"cwd":"E:/入口所在目录","read_only":true,"owner_project":"personal-materials","output":"json"}`。
登记人先从源代码核实只读；argv 数组直接执行，不经 shell，也不接受记录内的任意命令。
可在入口或 retrieve 内写正数 `timeout`；同一入口一次刷新只调用一次，所有 pointer 共用结果。
SQLite 以 URI `mode=ro` 打开，只接受一条 select 和单行单列结果。
`log_window.days=null` 数全量匹配行；正数则按日志行 ISO 时间戳取最近窗口，
`operation=last_time` 返回最后匹配时间。没有可解析时间时不能凭文件修改时间冒充。

账本只登记一次，保留键 `__usage_ledger__`：
`{"path":"E:/已核实账本.jsonl","format":"jsonl","key_field":"key","time_field":"used_at","read_only":true,"owner_project":"agents"}`。
也支持 `format=json` 的数组，或用 `pointer` 指定数组；字段支持点分路径。
登记或 retrieve 的 `filter` 是字段相等筛选（例如 `{"kind":"skill"}`），防止同名工具与技能混计。每行是一次使用；`count_7d` 数当前观察时刻前七天内相同 key 的行，
`last_time` 返回相同 key 的最后时间。账本停写另标 source_broken，不能把统计结果当仍在写。

截至日期记录使用 `qualifies:["数字记录id",...]`，不用独立 retrieve，
仍须通过 field/page_pattern 绑定实际日期。只有所有被注明数字均取得同口径新值时，
截至日期才更新为这些数字最早的观察日期；任何 Unknown 都保留旧日期。
盘点输出 `qualifies_suggestion` 供 GPT 核对，建议本身不算登记。

非历史、非 `status_line.state` 的人工记录必须同时有 `manual_reason` 和非空
`manual_route`。理由仅限 `needs_admin_rescan`、`ui_only`、`external_account`、
`judgment`、`source_broken`；最后一种的 route 写来源修复去向，其余写 GPT 去哪里怎么取。
历史与状态判断保留原来的例外。严格门会逐项报告旧清单缺失，不把旧格式自动伪造成合规。

本人提出更新总看板时，AI 手动运行一次。程序读取来源表，取回能自动统计的数字，与当前 `sources/pages` 对照；生成结果、改数单、内容任务单、逐项清单和给 GPT 的分组事实任务单。默认可生成结果网页，非交互施工用 `--no-report` 只交 JSON 与 Markdown。本程序没有定时任务，不修改页面，不接进构建或发布，不在构建时读取本机。

```powershell
python scripts/content-refresh/refresh.py --output E:\Cache\content-refresh\本次更新
# 只清点当前工作树；不重取来源、不联网、不生成或打开 HTML。
python scripts/content-refresh/refresh.py --inventory --output E:\Cache\content-refresh\本次清点
# 必须零漏登记；局部绑定用 --only personal-materials，局部通过不能代替全站。
python scripts/content-refresh/refresh.py --inventory --strict --output E:\Cache\content-refresh\严格清点
# 自动实取，非交互不生成汇报网页；GPT 审过改数单后再机械应用。
python scripts/content-refresh/refresh.py --strict --no-report --output E:\Cache\content-refresh\本次更新
python scripts/content-refresh/apply_edits.py E:\Cache\content-refresh\本次更新\number-edits.json --only personal-materials
```

默认总重取时限 300 秒、普通来源 6 秒，可用 `--total-seconds`、`--item-seconds` 调整；入口登记或 retrieve.timeout 可给实际需要的单项预算，仍受总时限约束。按来源至少 8 路并发，`--workers` 可增加并行数，不降低任何进程优先级。来源读取在独立隐藏进程中运行，超时停止该读取及其子进程；总时限耗尽后剩余来源标为未取得新值。总预算预留子进程终止和结果落盘时间，网页生成最多 180 秒且必须落在剩余总预算内；没有余量就保留机器结果并报告网页未生成。相同重取办法只读一次，同一 entry 含失败也只调用一次，所有 pointer 共用；usage_ledger 全部请求共用一遍流式扫描，不把大账本装入内存，也不每项重读。只读另一份内容快照时，用 `--root <含 sources/pages 的快照根目录> --registry <本程序来源表绝对路径>`；`--entries` 可指定配套白名单，默认在来源表旁找 entries.json。

运行成功只返回 `result.html` 链接。页面展示检查页数、数字数、变化、未取得新值、超过七天待处理的数字、全部写法命中，以及可展开的完整任务单。`result.json`、`opus-task.md`、`report-content.json`、`report-receipt.json` 留给 AI，交付时不要求本人打开这些文件。网页生成调用现有 `New-ReportPage.ps1 -ContentPath … -NoOpen -KeepDays 0`，不弹窗口；生成或自检失败时退出码为 1，不能宣称网页成功。

来源表在 `sources/refresh/registry.json`。`current_value` 是登记时页面值，`refreshed_value` 是上一轮清单值，两者均不是新验证。每次运行通过 `page_number` 或 `page_pattern` 从当前页重读旧值，定位失败就报未取得新值，不用登记值冒充。自动数字使用 `page_number` 时，还核对该值确实出现在所属正文中；正文已变而登记未同步时要求重绑，不能把过期登记报成页面现值。这个核对只能发现值已消失的失配，无法代替 Opus 判断同屏多个同值数字的语义。`affected_screens` 保留同口径的其他位置，Opus 更新时需一起核对并同步 `registry.numbers`。首页的动态占位符从本仓库页面登记统计，不改回写死数字。

`private=true` 的条目只有已核实的固定只读办法和计数/状态口径可自动取数，不输出私人条目内容；尚未核实统计口径或登记自动办法的仍为 `domain_fact_task`，进入 `fact-tasks.md`，由事实子代理按 `source_location` 找所属领域入口。公开内容按活动公开分级原文和页面规则办理。未绑定当前展示位置的私人登记另列“展示位置待复核”，不能冒充已定位或已自动取数。`historical=true` 或 `frozen=true` 不重取，历史演进数字保持当时的事实。无法保持原统计口径的发现命令、端到端结果、人工审阅计数也标人工，不把代码行数、测试定义数当作测试通过结果。

## 逐项清单与事实分工

默认刷新和 `--inventory` 都写 `dated-inventory.json`、`fact-tasks.md`；清点模式只写这两份。`--root` 默认仍是脚本所在的当前仓库根，可显式选择含 `sources/pages` 的另一快照。遍历全部 `sources/pages/*/page.json`，保留每处“截至”的字段和字符范围，清点 `status_line.as_of/last/state/facts`、首屏数字卡和来源注。首屏卡片复用现有正文解析器，`source_note` 读取相邻 `layout.json` 的对应原文，不执行转换或排版。

每项有页、屏、`field`、字符范围、行号、原文、原日期、来源记录 id、能否自动重取。`surface=visible` 表示展示文字；`author` 是构图和内部笔记；`reference` 是数字登记等参考副本。原文件“截至”总数由 `coverage.cutoff_occurrences/cutoff_surfaces` 分开报告，不能把构图、笔记、登记副本都算成展示事实；后两类不生成新的取数任务，私人来源登记位置待复核项例外。未登记展示项标“待登记·人工取数”。

来源匹配必须同时对上页、屏和实际字段/唯一捕获范围，或所属 `page_number` 的完整原话；一个孤立数字、同屏另一项已有来源、匹配多处的泛化表达或过期登记都不算绑定。`automatic=true` 还要求已登记的只读来源、非历史/冻结且统计口径已核实，它只说明具备自动重取办法，清点模式从不执行。来源注引用只差数字时按转换器的归一方式找到当前段落，仍无法定位时明确交人工复核。来源项目按已有路径身份归组，同一项目仅大小写或连字符不同的名字统一到现有项目页标识，每组最多 25 项；缺来源先核对页面所属项目的领域入口。历史/冻结项留在清单，`requires_refresh=false`，不自动激活。

重取器只支持固定的只读办法：Git 提交数；文件或行数（可限定 Git 跟踪文件、递归包含和排除模式；`nonempty` 排除空白行，`empty_only` 只排空字符串行、保留纯空白行，`newline_only` 复现 `wc -l`）；JSON 标量或数组长度；活动规则正式 Inspect 结果；正则出现次数；本仓库页面数、功能数、首页组成员数。每条自动来源写明 `measurement_scope` 和 `scope_status`，仅 `verified` 才执行、比较；缺失或 `pending` 标“口径待核”，不算变化。范围、单位、是否含测试或网页成片、约数不同都不能用 offset 凑。文本按 UTF-8 或明确 UTF-16/32 标记读取；未匹配代码文件报取不到。`scale`、`round_to`、`digits` 用于复现原单位和近似数。没有任意 shell 命令字段；实测使用现有 Python 3.14。

Opus 按任务单修改同口径真变化及其影响到的用法、例子和边界。原日期超过七天的数字按真实证据更新，取不到保留原日期并移出首屏。“发布前阻断”包含首屏旧截至、固定现行规则版本、个数与子页不符、退役入口仍现行、真提交号、接口网址、终端菜单；“提醒，不阻断”包含本机路径、多数字卡、非首屏旧日期等。路径公开范围按约法 L20，不是一律禁止。程序不改内容、不判语义质量 PASS；口径待核与提醒不能作为发布阻断。

## 发布前审计接入

发布前只调用纯页面检查函数，**不要调用 `collect()` 或 `main()`**。这样发布不会重读本机来源。此轮不改现有 `scripts/audit-content-refresh.py`，接线由发布流程 Owner 完成。

```python
import importlib.util
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "content_refresh_checks", root / "scripts/content-refresh/checks.py")
checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checks)
registry = json.loads((root / "sources/refresh/registry.json").read_text(encoding="utf-8"))
writing = checks.audit_pages(root / "sources/pages", retired_names=registry["retired_names"])
blocking = [f for f in writing["findings"] if f["tier"] == "block"]
# 只有 blocking 接发布前阻断；advisory 原样附到提醒，不阻断。
```

`audit_pages(pages_root, today=None, retired_names=())` 导入时不执行任何动作，默认日期按北京时间。检查只读可见正文和卡片、图说，跳过版式草稿及技术登记字段；`n-skills` 数量登记单独核对子页实数。历史/去向语境会减少误报。仍需 Opus 复核接口地址、提交号和终端文字是否确实影响阅读，保留必要技术依据。

```powershell
python -m unittest discover -s tests -p 'test_content_refresh_*.py'
```

维护一处的成本主要是改对应来源记录，不必改重取框架。乙组记录可按同样格式补入；新来源没有已实现的只读口径时，先标人工，不能偷偷沿用旧数作为新数。任务输出目录由本次 AI 登记用途和清理时机，不把宿主管理的报告目录当测试临时目录。

## 改数单和验收门

`number-edits.json` 使用 `content-refresh.number-edits.v1`：每项包含 `page/file/field/start/end`、
`old_value/new_value`、`observed_at/record_id`，以及字段替换前后的 SHA-256；`skipped` 记录无法唯一定位的项。
GPT 先核对同一统计口径，数值改变会改变叙述含义时交 Opus；程序只生成和应用数字、日期或日期时间。
同一字段按字符位置从后往前替换，旧值、字段快照或口径不一致就跳过报告；重复执行相同改数单不会产生第二次差异。
`page_number` 绑定的数字登记、登记日期及唯一完整原话同步，不按裸数字搜索其他句子。动态占位由页面登记计算，不写成固定数字。

写页面事实的 GPT 在同一提交里登记新增的全部日期和数字；新技能、新项目页也一样。
Opus 新加数字时列出交回 GPT 补登记。严格检查和完整性测试必须在构建前通过；历史和状态判断例外不扩成其他免登记理由。
当前非历史非 state 展示自动覆盖至少 85%、manual 至多 15%，这是登记质量；整表自动取得新值至少 90% 是运行结果。
旧清单未完成绑定时 `--strict` 和完整性测试如实失败，不可仅凭工具单测声称清单完整。

```powershell
python -B -X utf8 scripts/content-refresh/refresh.py --inventory --strict --output <目录>
python -m unittest discover -s tests -p 'test_content_refresh_*.py'
python -m unittest tests.test_refresh_registry_complete
python -B -X utf8 scripts/content-refresh/refresh.py --output <目录> --total-seconds 300 --no-report
```

本轮只登记 materials-status、e-rules-inspect 和共享使用账本，并用个人材料三项计数及关联截至演示。
使用账本的写入恢复和完整性由源项目核实；停写时，对依赖当前持续写入的页登记 source_broken 并保留旧日期，不能凭一次读到计数就宣称全链恢复。
日常 90 分钟路径、20 分钟事实调查上限、单项 3 分钟 Unknown 与完整演练门见 [按需更新操作清单](../../docs/ondemand-update.md)。
