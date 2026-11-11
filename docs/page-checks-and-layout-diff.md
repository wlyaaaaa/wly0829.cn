# 转换、排版与摆法回执

转换入口 `site-astro/tools/convert_page.py` 和排版入口
`site-astro/tools/render_blocks.py` 遇到页内错误后继续处理其余页，命令正常结束。
调用方读取逐页回执决定后续操作；退出码 0 不表示所有页通过，也不授权发布。
环境、参数等整批错误仍会使命令失败。失败页不写新的 Markdown 或排版 JSON；已有文件保留。

## 逐页检查

默认文件分别为 `site-astro/.cache/convert-page-checks.json` 和
`site-astro/.cache/render-page-checks.json`，可用 `CONVERT_PAGE_CHECKS`、
`BLOCK_PAGE_CHECKS` 指定路径。每次覆盖本次输入页的结果，不继承上次的通过状态。

```json
{
  "schema": "wly.page-checks.v1",
  "stage": "conversion",
  "pages": [
    {"page": "example", "passed": false, "errors": [
      {"code": "text_ref_unmatched", "screen": "example-01", "message": "认不出块：example-01 h：原来的开头"}
    ], "warnings": []}
  ]
}
```

`stage` 为 `conversion`、`preflight` 或 `render`。错误码为
`text_ref_unmatched`（认不出块）、`conversion_failed`（其他转换/预检失败）、
`render_failed`（准备、量屏缺块或收尾失败）。能定位到屏时 `screen` 是原屏 ID，
只能定位到页时为 `null`。`errors`、`warnings` 中每项均有 `code/screen/message`。
整合检查时按 `page` 合并两组数组，`passed` 取所有步骤的交集。

## 摆法比较

排版完成后自动输出 `site-astro/.cache/layout-diff.json`，
`BLOCK_LAYOUT_RECEIPT` 可改路径。`BLOCK_LAYOUT_BASELINE` 必须显式指向上次发布
留存或本次指定基线的 `src/content/rendered` 目录；本地上次构建不会自动当成发布基线。
不设基线时 `status=baseline_required`、`changed_screens=null`，不冒报零变化。
缺页、读不出或格式错误记在 `errors`，`status=incomplete`；不能按完整比较处理。

也可独立比较，不启动浏览器、不修改两版文件：

```powershell
python -B -X utf8 site-astro/tools/layout_diff.py <基线rendered目录> <新rendered目录> --output <回执.json> --pages example
```

回执格式为 `wly.layout-diff.v1`。`inputs` 记录两份 JSON 的 SHA256；`changes` 每项有
`page/screen/orientation/changed_fields/before/after/message`，横竖版分开。
`changed_screens` 按页和屏 ID 去重；新增、移除屏单列，不用屏序号推断内容丢失。
每个快照有 `height`、`rows`（每行的 `columns/cells/title`）、`blocks` 和 `order`；
`cells` 中的块 ID 在本次比较内关联两版，`blocks` 给组件类型和正文标签。
比较读取实际排好的 HTML：折成上下排的 flex 行按一栏算，标题与插画的内层并排单列。
栏数、并排关系、块顺序或屏高改变时，`message` 写出前后摆法，并点名标题行。

成品 DOM 没有跨版本唯一块编号。比较先按组件与正文匹配，再以同类位置处理改字；
同类块同时大改并换位时，回执中的块关联需人工核对。正文变化本身不会被算成摆法变化。
本工具只观察结果；它不重排、不修改屏幕几何，也不决定是否拦截发布。
