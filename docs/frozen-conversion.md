# 冻结页转换操作

路由清单是文本文件，每行一个完整路由，保留结尾斜杠。工具入口：

```powershell
# 先预演，检查报告中的文字保留、拆屏、丢弃片段与警告。
python -B -X utf8 site-astro/tools/frozen_to_pages.py --routes <路由清单文件> --report <转换报告目录> --dry-run
# 实际生成作者输入。
python -B -X utf8 site-astro/tools/frozen_to_pages.py --routes <路由清单文件> --report <转换报告目录>
# 仅在确认已更新事实已保留、确需重转时使用 --force。
python -B -X utf8 site-astro/tools/frozen_to_pages.py --routes <路由清单文件> --report <转换报告目录> --force
```

工具只搬运文字、结构和链接，按固定图标表与构图模板生成 `page.json`、`layout.json`、素材表追加行及 `convert-report.json`，不判断新事实、不写产品叙述。已有作者页默认跳过；覆盖需明确 `--force`，覆盖前保存并核对已经更新的事实，随后人工并回。页 id 由项目和模块 slug 组成，原路由由新版认领。重名与其他结构异常应报错处理，不能自动另起一页来绕过。

共用图标和模板是 `frozen_module_icons.json`、`frozen_module_layout.json`。没通过就改共用模板或转换规则，不逐页手摆来掩盖规则问题。

新版原路由接管后，回退需撤销对应的新作者输入、素材表追加行和生成物，再重新构建，确认冻结路由恢复；不能把撤销作者页与重新部署旧成品混成一个动作。
