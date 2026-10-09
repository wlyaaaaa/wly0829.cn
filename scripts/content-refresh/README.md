# 按需更新程序

本人提出更新总看板时，AI 手动运行一次。程序读取来源表，取回能自动统计的数字，与当前 `sources/pages` 对照；生成一张结果网页和给 Opus 的任务单。本人只看网页，JSON 和 Markdown 是 AI 接续用的中间文件。本程序没有定时任务，不修改页面，不接进构建或发布，不在构建时读取本机。

```powershell
python scripts/content-refresh/refresh.py --output E:\Cache\content-refresh\本次更新
```

默认总重取时限 120 秒、每个来源 6 秒，可用 `--total-seconds`、`--item-seconds` 调整。来源读取在独立隐藏进程中运行，超时停止该读取及其子进程，再处理下一条；总时限耗尽后剩余来源标为未取得新值。页面检查和网页生成另算时间，网页生成最多 180 秒。相同重取办法只读一次，复用于多个页面。只读另一份内容快照时，用 `--root <含 sources/pages 的快照根目录> --registry <本程序来源表绝对路径>`；无需切换或修改样板。

运行成功只返回 `result.html` 链接。页面展示检查页数、数字数、变化、未取得新值、超过七天待处理的数字、全部写法命中，以及可展开的完整任务单。`result.json`、`opus-task.md`、`report-content.json`、`report-receipt.json` 留给 AI，交付时不要求本人打开这些文件。网页生成调用现有 `New-ReportPage.ps1 -ContentPath … -NoOpen -KeepDays 0`，不弹窗口；生成或自检失败时退出码为 1，不能宣称网页成功。

来源表在 `sources/refresh/registry.json`。`current_value` 是登记时页面值，`refreshed_value` 是上一轮清单值，两者均不是新验证。每次运行通过 `page_number` 或 `page_pattern` 从当前页重读旧值，定位失败就报未取得新值，不用登记值冒充。自动数字使用 `page_number` 时，还核对该值确实出现在所属正文中；正文已变而登记未同步时要求重绑，不能把过期登记报成页面现值。这个核对只能发现值已消失的失配，无法代替 Opus 判断同屏多个同值数字的语义。`affected_screens` 保留同口径的其他位置，Opus 更新时需一起核对并同步 `registry.numbers`。首页的动态占位符从本仓库页面登记统计，不改回写死数字。

`private=true` 的条目始终只登记去哪取个数，本程序不读取它。AI 需要这些数字时交回已授权的领域入口办理；本轮标“需本人资料”。`historical=true` 或 `frozen=true` 不重取，历史演进数字保持当时的事实。无法保持原统计口径的发现命令、端到端结果、人工审阅计数也标人工，不把代码行数、测试定义数当作测试通过结果。

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
