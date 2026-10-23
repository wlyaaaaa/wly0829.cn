# 按需更新程序

## 来源登记与只读入口

保留 `registry.json` 的 `content-refresh.sources.v1` 和原有记录字段。新增字段均放在
`records[]` 的同一条记录：`field` 是 JSON 字段路径（如 `screens[0].text`、
`status_line.facts[0]`、`status_line.last.at`），`start/end` 可指定最终旧值的字符串字符范围；有范围时不用 page_pattern 再捕获。
字符范围必须完整覆盖一个数字或日期 token，且捕获值与登记 `current_value` 通过 `same_value`
比较，才是可信绑定；否则理由为“字符偏移已漂移或无法证明，需改用唯一上下文重绑”，
collect 标 `unavailable`，不生成改数。不自动移动或修补既有 `start/end`。
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
登记或 retrieve 的 `filter` 是字段相等筛选（例如 `{"kind":"skill"}`），防止同名工具与技能混计。每行是一次使用；`count_7d` 数两路账本共同完成水位之前的 7 个完整日，按北京时间日界计数，不含正在进行的一天；
`last_time` 返回相同 key 的最后时间。读取前核对账本旁两路 `state-codex.json` / `state-claude.json`：均须 `bootstrap_complete=true`，且排他水位 `last_completed` 有可解析的时区；不要求水位晚于当前时刻。覆盖末日是共同完成水位的前一天。水位缺失、损坏或覆盖不足返回 Unknown，不生成改数或推进关联截至；账本停写另标 source_broken。
普通入口若也从该账本生成当前用量文案，登记 `requires_usage_ledger=true`，执行前共用上述覆盖检查。
项目 `page_count` 仅数启用项目身份对应的无 `parent` 顶级页，保留 `kinds/status/public` 过滤；无类型限制的页数仍统计全部作者输入。

每次取数分别保存 `checked_at`（本次读取时间）、`source_observed_at`（来源真实观察时间）、
`source_coverage_end`（覆盖末日）和 `observation_basis`（观察依据）。
`git_count`、`file_count`、`line_count`、`regex_count`、`page_count`、`group_count`、
`feature_count`、`sqlite_ro`、`rules_inspect`、`log_window` 默认 `live_read`，
以本次 `checked_at` 作为 `source_observed_at`；显式声明可覆盖默认。
`usage_ledger` 使用 `coverage_end`。`json`、`entry` 使用登记的依据，记录级优先于入口配置；
可用 `source_observed_at_pointer`、`source_coverage_end_pointer` 从返回 JSON 读取时间。
快照依据写 `snapshot_timestamp`，覆盖依据写 `coverage_end`，现场读取写 `live_read`。
`json`、`entry` 缺声明时为 `unknown`：仍保存读到的 `new_value` 供核对，但状态为
`unavailable`，不生成改数，关联截至保留旧日期。展示日期采用来源真实观察时间或覆盖末日，
不把今天读到的旧快照改成今天观察。

截至日期记录使用 `qualifies:["数字记录id",...]`，不用独立 retrieve，
仍须通过 field/page_pattern 绑定实际日期。只有所有被注明数字均取得同口径新值时，
截至日期才更新为这些数字最早的真实观察日期或覆盖末日；任何 Unknown 都保留旧日期。
盘点输出 `qualifies_suggestion` 供 GPT 核对，建议本身不算登记。
日期句说明“库最近一次写入”“上次使用”、资料覆盖时间等事件口径时，
不能拿本轮读数时间替换：结果标 `manual_review`、旧值保留，
`number-edits.json.manual_reviews` 列“需人工核对”和 `date_candidate`。
候选值只表示本轮观察日期；GPT/内容 Owner 核对真实事件来源和含义后再处理，
Opus 负责需要改写的说明，`apply_edits.py` 不应用这些日期候选。

非历史、非 `status_line.state` 的人工记录必须同时有 `manual_reason` 和非空
`manual_route`。理由仅限 `needs_admin_rescan`、`ui_only`、`external_account`、
`judgment`、`source_broken`；最后一种的 route 写来源修复去向，其余写 GPT 去哪里怎么取。
历史与状态判断保留原来的例外。严格门会逐项报告旧清单缺失，不把旧格式自动伪造成合规。

本人提出更新总看板时，AI 手动运行一次。取数阶段读取来源表，取回能自动统计的数字，与当前作者源对照；生成结果、改数单、内容任务单、逐项清单和给 GPT 的分组事实任务单。默认可生成结果网页，非交互施工用 `--no-report` 只交 JSON 与 Markdown。取数本身不修改页面；审过改数单后另行应用，构建后再闭环。本程序没有定时任务，不在构建时读取本机，也不代替发布。

```powershell
python scripts/content-refresh/refresh.py --output E:\Cache\content-refresh\本次更新
# 只清点当前工作树；不重取来源、不联网、不生成或打开 HTML。
python scripts/content-refresh/refresh.py --inventory --output E:\Cache\content-refresh\本次清点
# 必须零漏登记；局部绑定用 --only personal-materials，局部通过不能代替全站。
python scripts/content-refresh/refresh.py --inventory --strict --output E:\Cache\content-refresh\严格清点
# 自动实取，非交互不生成汇报网页；GPT 审过改数单后再机械应用。
python -B -X utf8 scripts/content-refresh/refresh.py --strict --no-report --targeted personal-materials --output E:\Cache\content-refresh\本次更新
python -B -X utf8 scripts/content-refresh/apply_edits.py E:\Cache\content-refresh\本次更新\number-edits.json --report E:\Cache\content-refresh\本次更新\apply-report.json
# 作者源、写稿和预检处理完后，构建同一份输入，再回读成品。
npm run build
python -B -X utf8 scripts/content-refresh/refresh.py --close-run E:\Cache\content-refresh\本次更新\result.json --apply-report E:\Cache\content-refresh\本次更新\apply-report.json --dist dist --output E:\Cache\content-refresh\本次更新
```

默认刷新即 `collect` 阶段，结果生成唯一 `run_id`，改数单、应用回执和闭环必须属于同一轮。
`--targeted <页id,...>` 只选择本轮点名的人工核对与讲解范围，不缩小当前事实重取范围；
全部更新不传 `--targeted`。应用的 `--only <页id,...>` 可限制分路拥有的页面，
只应用分路后不能据此宣称整轮完成。

默认总重取时限 300 秒、普通来源 6 秒，可用 `--total-seconds`、`--item-seconds` 调整；入口登记或 retrieve.timeout 可给实际需要的单项预算，仍受总时限约束。按来源至少 8 路并发，`--workers` 可增加并行数，不降低任何进程优先级。来源读取在独立隐藏进程中运行，超时停止该读取及其子进程；总时限耗尽后剩余来源标为未取得新值。总预算预留子进程终止和结果落盘时间，网页生成最多 180 秒且必须落在剩余总预算内；没有余量就保留机器结果并报告网页未生成。相同重取办法只读一次，同一 entry 含失败也只调用一次，所有 pointer 共用；usage_ledger 全部请求共用一遍流式扫描，不把大账本装入内存，也不每项重读。只读另一份内容快照时，用 `--root <含 sources/pages 的快照根目录> --registry <本程序来源表绝对路径>`；`--entries` 可指定配套白名单，默认在来源表旁找 entries.json。

运行成功只返回 `result.html` 链接。页面展示检查页数、数字数、变化、未取得新值、超过七天待处理的数字、全部写法命中，以及可展开的完整任务单。`result.json`、`opus-task.md`、`report-content.json`、`report-receipt.json` 留给 AI，交付时不要求本人打开这些文件。网页生成调用现有 `New-ReportPage.ps1 -ContentPath … -NoOpen -KeepDays 0`，不弹窗口；生成或自检失败时退出码为 1，不能宣称网页成功。

来源表在 `sources/refresh/registry.json`。`current_value` 是登记时页面值，`refreshed_value` 是上一轮清单值，两者均不是新验证。每次运行通过 `page_number` 或 `page_pattern` 从当前页重读旧值，定位失败就报未取得新值，不用登记值冒充。自动数字使用 `page_number` 时，还核对该值确实出现在所属正文中；正文已变而登记未同步时要求重绑，不能把过期登记报成页面现值。这个核对只能发现值已消失的失配，无法代替 Opus 判断同屏多个同值数字的语义。`affected_screens` 保留同口径的其他位置，Opus 更新时需一起核对并同步 `registry.numbers`。首页的动态占位符从本仓库页面登记统计，不改回写死数字。

`private=true` 的条目只有已核实的固定只读办法和计数/状态口径可自动取数，不输出私人条目内容；尚未核实统计口径或登记自动办法的仍为 `domain_fact_task`，进入 `fact-tasks.md`，由事实子代理按 `source_location` 找所属领域入口。公开内容按活动公开分级原文和页面规则办理。未绑定当前展示位置的私人登记另列“展示位置待复核”，不能冒充已定位或已自动取数。`historical=true` 或 `frozen=true` 不重取，历史演进数字保持当时的事实。无法保持原统计口径的发现命令、端到端结果、人工审阅计数也标人工，不把代码行数、测试定义数当作测试通过结果。

## 逐项清单与事实分工

默认刷新和 `--inventory` 都写 `dated-inventory.json`、`fact-tasks.md`；清点模式只写这两份。`--root` 默认仍是脚本所在的当前仓库根，可显式选择含 `sources/pages` 的另一快照。遍历全部 `sources/pages/*/page.json`，保留每处“截至”的字段和字符范围，清点 `status_line.as_of/last/state/facts`、首屏数字卡和来源注。首屏卡片复用现有正文解析器，`source_note` 读取相邻 `layout.json` 的对应原文，不执行转换或排版。

每项有页、屏、`field`、字符范围、行号、原文、原日期、来源记录 id、能否自动重取。`surface=visible` 表示展示文字；`author` 是构图和内部笔记；`reference` 是数字登记等参考副本。原文件“截至”总数由 `coverage.cutoff_occurrences/cutoff_surfaces` 分开报告，不能把构图、笔记、登记副本都算成展示事实；后两类不生成新的取数任务，私人来源登记位置待复核项例外。未登记展示项标“待登记·人工取数”。

“截至”的原始词汇命中与实际日期项分开统计。只有紧随其后的日期写法才生成 `as_of`：
“说明截至哪天”是功能用语，不向后找另一句的日期；中文、ISO、日期范围及明确相对日期继续清点。

整页事实核对戳分类为 `review_stamp`，在 `dated-inventory.json.review_stamps` 单列，交事实组更新；
它不绑定数值来源、不计入自动覆盖率，也不由程序填今天。碰过并核对事实的页更新核对戳，未涉及的页保留。
真正注明数字的截至继续要求来源；空来源数组允许只盘点核对戳，真实数字未登记仍使严格门失败。

来源匹配必须同时对上页、屏和实际字段/唯一捕获范围，或所属 `page_number` 的完整原话；一个孤立数字、同屏另一项已有来源、匹配多处的泛化表达或过期登记都不算绑定。原位绑定失败和它引起的关联截至失败合并为同一发现，`record_ids` 保留所有相关记录，不重复计数。`automatic=true` 还要求已登记的只读来源、非历史/冻结且统计口径已核实，它只说明具备自动重取办法，清点模式从不执行。非历史自动 `json`、`entry` 缺观察依据时单列 `observation_basis_gaps` 数量和清单，理由为“观察依据未登记”；这类缺口不计入 `missing`，当前也不使 `--strict` 非零退出。来源注引用只差数字时按转换器的归一方式找到当前段落，仍无法定位时明确交人工复核。来源项目按已有路径身份归组，同一项目仅大小写或连字符不同的名字统一到现有项目页标识，每组最多 25 项；缺来源先核对页面所属项目的领域入口。历史/冻结项留在清单，`requires_refresh=false`，不自动激活。

字符偏移无法证明时，盘点在 `record_bindings` 中保存该记录的 `binding_error`，
并单列 `offset_binding_gaps` 数量与清单；当前暂不计入 `missing`，也不使 `--strict`
非零退出。这不表示绑定已通过：取数仍是 `unavailable`，需用唯一上下文重新绑定后才能改数。

点名页的核对戳与 `status_line.state` 任务只列在 `--targeted` 指定范围；未传时列全部非历史页。
到期的稳定讲解单列 `semantic_due` 数量及页名，写入 `opus-task.md`、`fact-tasks.md`
和 `closure.json`，不并入事实闭环的人工 pending。语义复核周期仍为 28 天；没有真实复核时间
的页为 `due_unknown`，点名页和来源变化影响的解释本轮核对。
真实语义复核时间只从 `sources/refresh/semantic-reviews.json` 读取，不取 page.json 中的旧字段。
文件格式为 `{"schema":"content-refresh.semantic-reviews.v1","pages":{}}`；
闭环收到同一 `run_id`、带 `evidence` 的 `semantic:<页id>` 人工完成记录后，才写入该页
`checked_at/run_id/evidence`，不预填日期。

重取器只支持固定的只读办法：Git 提交数；文件或行数（可限定 Git 跟踪文件、递归包含和排除模式；`nonempty` 排除空白行，`empty_only` 只排空字符串行、保留纯空白行，`newline_only` 复现 `wc -l`）；JSON 标量或数组长度；活动规则正式 Inspect 结果；正则出现次数；本仓库页面数、功能数、首页组成员数。每条自动来源写明 `measurement_scope` 和 `scope_status`，仅 `verified` 才执行、比较；缺失或 `pending` 标“口径待核”，不算变化。范围、单位、是否含测试或网页成片、约数不同都不能用 offset 凑。文本按 UTF-8 或明确 UTF-16/32 标记读取；未匹配代码文件报取不到。`scale`、`round_to`、`digits` 用于复现原单位和近似数。没有任意 shell 命令字段；实测使用现有 Python 3.14。

Opus 按任务单修改同口径真变化及其影响到的用法、例子和边界。当前事实每次更新均按真实来源重取，取不到保留原日期并明确 Unknown；历史证据保留原日期，稳定讲解按 28 天复核线处理。“发布前阻断”包含首屏旧截至、固定现行规则版本、个数与子页不符、退役入口仍现行、真提交号、接口网址、终端菜单；“提醒，不阻断”包含本机路径、多数字卡、非首屏旧日期等。路径公开范围按约法 L20，不是一律禁止。程序不写叙述、不判语义质量 PASS；口径待核与提醒不能作为发布阻断。

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
`page_number` 绑定的数字登记、登记日期及唯一完整原话同步，不按裸数字搜索其他句子。
`audit_edits.py <number-edits.json>` 只读改数单，逐处列旧值→新值，并标出小数位变化、日期倒退、
时分精度变化、跳变过半和非数字非日期，核过再应用。

`binding_checks.py` 是严格盘点里的登记自检，只读作者文件、不读来源：`pattern` 是自动记录的
`page_pattern` 不恰好命中一处（含 `{{…}}` 的字段按展开后文字核），`digits` 是 `retrieve.digits`
与页面小数位不同，`mirror` 是挂 `registry_number` 的页内数字表数值已与正文不同；三类任一非空，
`--strict` 非零退出。`observed` 列出自动数字同句里没登记的观察时间，写进盘点和 `fact-tasks.md`，
完整性测试给它设只许减少的上限；`manual_qualified` 列出 `qualifies` 连着人工项、因而永远推不动的
截至日期，同样设只许减少的上限。`usage_ledger` 可用 `keys` 把几个技能合起来算（次数相加、最近一次取最晚）。
取数时旧值不小于 5 而来源返回 0，记 `unavailable`、不生成改数；
JSON 清单分类计数用 `operation: "count_where"` 加 `where` 条件按条目字段数。

`authors.py` 是生成和应用改数单共同使用的真实作者定位入口。普通字段指向本页
`sources/pages/<页id>/page.json`；整个字段恰为 `{{stories...}}` 或 `{{另一页...}}`
时，沿绑定找到 `scripts/how-demo-data.json` 或所引用页的具体字段，下标和 `id/scenario`
匹配都落实为可编辑的具体路径。how 的整段占位保留原样，数字写入演示数据的真实位置。
`scale`、`rules`、`group_counts` 和 `roster` 不能作为改数目标；行内占位的作者仍是本页，
但字符编辑范围与任一 `{{...}}` 相交时以 `placeholder_computed_value` 跳过。
应用只允许写 `sources/pages/<页id>/page.json` 与 `scripts/how-demo-data.json`。

写作者文件前，先按构建的依赖关系找到受影响页：页内引用其他页、依赖全部页的 `scale`、
依赖 projects-home 的 `group_counts`，以及引用 `stories` 的页都随相应作者变化重转。
逐页把当前 JSON 转到临时目录，与已入库的 `site-astro/src/content/pages/<页id>.md` 比较；
只忽略 frontmatter 的 `source.converted_at_beijing`，其余 frontmatter 和正文必须逐字一致。
Markdown 不存在时允许首次生成；存在分叉时该页全部改数以 `author_markdown_diverged`
跳过，不先写一份无法进入网页的 JSON。
写入后默认调用官方 CLI `python site-astro/tools/convert_page.py <受影响页...>`，只转相关页，
随后再次逐页比较。应用回执 `markdown_readback` 保存每页 `verified/failed` 和 Markdown
SHA-256；转换或回读失败的页不算应用成功。

闭环以同轮应用回执的字段回读、记录值原位回读和所属页 `markdown_readback` 三者
`verified` 为变化项完成条件；缺一就是 `pending`。闭环只同步已确认记录的登记字段，
保留来源表的两空格缩进、中文、LF 和末尾换行。
传 `--dist <成品目录>` 时，按 Markdown frontmatter 的 `url`（缺省为 `/<页id>/`）
找到 HTML，去标签、HTML 反转义并归一空白，确认原位回读的新片段实际存在；
找不到时 `display_readback` 失败、该项仍为 pending。
不传 `--dist` 时明确记录 `display_readback=not_checked`；字段和渲染输入闭环可为 `closed`，
但不能据此宣称成品已显示，更不能代替公网回读。

人工完成记录放在同轮应用回执的 `manual_closures` 中，每项提供
`id`、`run_id`、`checked_at`、`evidence` 和 `status="completed"`。
核对戳与状态任务沿用任务单的 id；`semantic:<页id>` 用于持久化真正完成的讲解复核。
Unknown 仍须保留旧值、旧日期并明确来源缺口，不能仅凭读过文件就关闭人工任务。

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

使用账本的写入恢复和完整性由源项目核实；停写时，对依赖当前持续写入的页登记 source_broken 并保留旧日期，不能凭一次读到计数就宣称全链恢复。
日常 90 分钟路径、20 分钟事实调查上限、单项 3 分钟 Unknown 与完整演练门见 [按需更新操作清单](../../docs/ondemand-update.md)。
