# 网站维护（一页）

在仓库根目录运行，唯一入口是 `scripts/check-typeset-site.py`。正文在 `sources/pages/<页名>/page.json`，构图在相邻 `layout.json`；构图的 `text_ref` 必须继续对应正文。首页使用 `sources/creative/static-home/`。旧兼容路由沿用已验收基线。

首次使用：把登记的完整验收包、旧静态壳及其无损素材缓存分别材料化到 `.publish/baseline/`、`.publish/legacy/`、`.publish/asset-cache/`，安装项目已有 Python/Playwright/Pillow/fontTools 依赖；WOFF2 依赖用 `python -m pip install --target .publish/python-tools Brotli==1.2.0`，然后执行一次 `python scripts/check-typeset-site.py --all`。`.publish/` 仅保存可再生缓存、阶段证据及当前包；不要把 HTML-only OSS 包当完整基线。

| 操作 | 命令（先改唯一源） |
|---|---|
| 改一页，自动算影响 | `python scripts/check-typeset-site.py --changed` |
| 明确重出一页 | `python scripts/check-typeset-site.py --pages rescue` |
| 全量重出 | `python scripts/check-typeset-site.py --all` |
| 热修 | 修正文/构图/所属组件后，`python scripts/check-typeset-site.py --pages rescue`；验收后用 `--resume --publish`，共享代码改动用 `--changed` |
| 中断恢复 | `python scripts/check-typeset-site.py --resume`；发布中断用 `--resume --publish` |
| 恢复已发布旧包 | `pwsh -NoProfile -File scripts/rollback-hybrid.ps1 -RestoreRef <已确认恢复提交>`；取得本轮恢复指令后追加 `-Publish` |
| 加新页 | 新建 `sources/pages/<id>/page.json`、`layout.json`，登记导航及创意挂载范围；`python scripts/check-typeset-site.py --changed` |

五段为取输入、生成和装配、检查、发布、回读；`.publish/update/publication-state.json` 记录各段状态、秒数、失败原因及绑定产物。原子保存；输入或产物变化使相关段和后续段失效。`--resume` 先读取真实线上清单；已存在推送记录时只回读，不重复发布。失败日志和上一轮包留在同目录 `retained-*`，验收后按活动规则回收。

普通文字改动只重出选中页的图，未选中 HTML 沿用原字节。素材按实际页面/屏的引用计入指纹；目前组件和 CSS 全局加载，共享代码、字体、公共版本或无法拆清的创意依赖变化扩大到全站。没有变化且产物绑定仍成立时直接退出，不发布。外部目标 `github-profile` 不属于网站页面。

渲染固定为 `config/render.lock.json` 登记的 Chrome for Testing 154.0.8037.92，放 `E:/Tools/ChromeForTesting/`，无头运行且不读取本人浏览器资料。锁文件登记官方包/程序 SHA、渲染参数和系统字体版本/SHA；升级时先锁新版，再比较一次全量输出。首次安装按锁文件 URL 下载并核 SHA 后解压到登记目录，不能自动改用系统 Chrome。

发布沿用 `Publish-Pages.ps1` → `publish-typeset.ps1`。`--publish` 从 `.publish/publication-options.json` 读取 `Directive`、`LockHolder` 和可选 `paths`（运行/阅读/OSS/布局验收文件）；它们必须是实际验收和实际指令，入口不生成批准。发布前提交已验收的 `prep/*` 分支，再执行 `python scripts/check-typeset-site.py --resume --publish`。代码迁移分支只作本地验收。

实时状态先读 `https://live.wly0829.cn/computer-access/state`，失败回退原 Cloudflare 地址；原同名路径直接导航报 `ERR_BLOCKED_BY_CLIENT`，页面内 Fetch 已验证，网页与图片维持原托管。
`edge/edgeone/edge-functions/[[path]].js` 只转发此接口，其他路径 404；回源 6 秒超时、不缓存，仅对正式站两种 HTTPS 来源开放跨域读取。
部署：压缩 `edge/edgeone/` 的内容为 ZIP，在 EdgeOne 项目 `makers-lrgrecs7uvjl` 的“新建部署”上传，选择生产；这是接口包，不上传网站或图片。
域名：生产关联 `live.wly0829.cn`，Cloudflare CNAME 仅 DNS，并按控制台添加归属 TXT、申请免费 HTTPS；`eo-test` 保留供试验。
撤回：网站回退本次提交，EdgeOne 回滚到本轮开始前的生产部署 `dpgfu7u5kqgm`；只删除本轮 `live` 的域名绑定及 CNAME/TXT，保留原记录与 `eo-test`。
