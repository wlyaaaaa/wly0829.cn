# 网站维护（一页）

在仓库根目录运行，唯一入口是 `scripts/check-typeset-site.py`。正文在 `sources/pages/<页名>/page.json`，构图在相邻 `layout.json`；构图的 `text_ref` 必须继续对应正文。首页使用 `sources/creative/static-home/`。旧兼容路由沿用已验收基线。

首次使用：把登记的完整验收包、旧静态壳及其无损素材缓存分别材料化到 `.publish/baseline/`、`.publish/legacy/`、`.publish/asset-cache/`，准备项目已有 Playwright/Pillow 依赖和正式 `scripts/check-site-ui.py`。Python、FontTools、Brotli 按 `config/render.lock.json` 的版本和 `python_tools` 目录准备；当前为 Python 3.14.7、FontTools 4.63.0、Brotli 1.2.0，后两者安装命令为 `python -m pip install --target E:/Tools/wly-typeset-python314 FontTools==4.63.0 Brotli==1.2.0`。入口开工即核依赖锁和检查器，然后执行一次 `python scripts/check-typeset-site.py --all`。`.publish/` 仍保存可再生缓存、阶段证据及当前包；完整基线须含实际素材字节，不能只提供 HTML-only OSS 包。

| 操作 | 命令（先改唯一源） |
|---|---|
| 改一页，自动算影响 | `python scripts/check-typeset-site.py --changed` |
| 限定一页生成与验收 | `python scripts/check-typeset-site.py --pages rescue`；图输入未变时仍复用完整页 |
| 全量重出 | `python scripts/check-typeset-site.py --all` |
| 热修 | 修正文/构图/所属组件后，`python scripts/check-typeset-site.py --pages rescue`；验收后用 `--resume --publish`，共享代码改动用 `--changed` |
| 中断恢复 | `python scripts/check-typeset-site.py --resume`；发布中断用 `--resume --publish` |
| 明确全量准备 OSS 对象 | 在本次命令显式追加 `--full-upload`；仅在确需全量时使用 |
| 恢复已发布旧包 | `pwsh -NoProfile -File scripts/rollback-hybrid.ps1 -RestoreRef <已确认恢复提交>`；取得本轮恢复指令后追加 `-Publish` |
| 加新页 | 新建 `sources/pages/<id>/page.json`、`layout.json`，登记导航及创意挂载范围；`python scripts/check-typeset-site.py --changed` |

`--run-root <目录>` 指定本次证据目录，默认 `.publish/update/`；恢复时用同一目录。`--state-root <目录>` 指定持久账本和完整页缓存，默认 Git 共同目录下的 `typeset-state/`，本地检查与已发布账本分开；更换任务目录不会重置页缓存。`--typeset-root`、`--baseline`、`--legacy-site`、`--asset-cache`、`--inventory` 可指定已登记输入，`--jobs` 控制 QA 并发，默认 3。

| 阶段 | 实际工作 |
|---|---|
| `inputs`：取输入 | 记录本批页面及输入身份，绑定本轮基线 |
| `generation`：生成和装配 | 变化的页出图，其余复用完整页；冻结输入、测几何，各准备步骤返回变化映射，最终材料化一次 |
| `checks`：检查 | 保留原排版 QA；检查影响路由及固定样本的 UI、图片页完整阅读矩阵、内容和 OSS 准备 |
| `publication`：发布 | 仅 `--publish` 执行；再次核验已验候选，复制后附加发布元数据，经原发布门推送 |
| `readback`：回读 | `--publish` 后确认实际线上版本及 HTML/素材字节 |

本次 `publication-state.json` 原子保存五段及各 Python 操作的开始、结束、秒数、失败原因和产物绑定；输入、范围或产物变化使相关段和后续段失效。固定样本为首页、驾驶舱、`/rules/charter/`、长项目 `.agents`、急救页，并追加 `/rules/` 真正原文层；首页交 UI 检查，实际 `typeset` 页面跑完整阅读矩阵。UI 回执绑定检查前后不变的候选 manifest SHA，旧回执或错代证据不能通过发布门。驾驶舱每次验收现跑；`--resume` 先读真实线上清单，确认已有发布时回读并重新检查驾驶舱，不重复发布。失败日志和上一轮包留在同目录 `retained-*`，验收后按活动规则回收。

推送已经发出但结果不明（`push_requested` / `push_result_unknown`）时，`--resume --publish` 只回读原发布代；原输入或候选绑定无法确认时停止交回，不重新上传或推送。确认发布失败而 main 已被其他人推进时也停止，不覆盖后续提交。

普通文字改动只重出变化页的图；纯装配或只影响静态壳与交互的 JS 改动复用图，再生成受影响候选。页指纹使用真实渲染依赖和稳定相对标识，装配依赖另行计入选页；实际共用 CSS、字体和公共依赖变化扩大影响范围。已有共享资源在原路径变字节或被删除且未证明引用范围时，验收扩大到全部路由；新增内容寻址图片只通过其引用页面进入影响集。没有变化且产物绑定仍成立时直接退出，不发布。外部目标 `github-profile` 不属于网站页面。

OSS 默认复用当前已封存的 `site-release/release-manifest.json`；上一版缺失或核验失败就停，并说明原因。`--full-upload` 独立明确选择全量准备；`--all` 控制全量出图，`WLY_RELEASE_FULL=1` 控制既有全量重验。实际上传前的 `verify-local` 回执打印待传对象数量和字节数，扣除已保留及同计划已成功的对象。

差量上传和公网回读分别核验。正式发布器在替换发布包前读取线上小型版本标识，自动匹配 Git 共同目录下 `latest-typeset-readback.json` 的最近完整通过报告；匹配后只 GET 描述发生变化的对象，其余保留原通过证据。找不到、错代、报告损坏、线上标识无法核对或显式全量重验时回到完整 GET，并在发布状态及回读报告记录原因。每次完整回读通过后保存新的共享基准；正常末尾和恢复回读都沿用已有完整通过报告。直接调用 `publish-typeset.ps1` 时可显式传 `-PreviousReadback`；正式批入口自动选择基准，无需这个参数。

渲染固定为 `config/render.lock.json` 登记的 Chrome for Testing 154.0.8037.92，放 `E:/Tools/ChromeForTesting/`，无头运行且不读取本人浏览器资料。锁文件登记官方包/程序 SHA、渲染参数和系统字体版本/SHA；升级时先锁新版，再比较一次全量输出。首次安装按锁文件 URL 下载并核 SHA 后解压到登记目录，不能自动改用系统 Chrome。

发布沿用 `Publish-Pages.ps1` → `publish-typeset.ps1`。`--publish` 从 `.publish/publication-options.json` 读取 `Directive`、`LockHolder` 和可选 `paths`（OSS/布局等验收文件）；本轮 `RuntimeVerification` 和 `ReadingPlan` 由新检查入口绑定，必须有真实 UI、完整阅读和实际发布指令，入口不生成批准。发布前提交已验收的 `prep/*` 分支，再执行 `python scripts/check-typeset-site.py --resume --publish`；候选或范围变化后更新实际指令的绑定。发布器统一 Inspect/Acquire/Release `wly0829-publication` 短锁，持有人为 `Claude/<真实任务号>` 或 `Codex/<真实任务号>`；锁内直接复制已验候选，不重新运行 builder，也不修改原候选。代码迁移分支只作本地验收。

主分支 `publish-typeset.ps1 -UiFull` 扩展其额外 UI 门为全路由；Python 检查入口已自动覆盖影响集与固定样本。`Publish-Pages.ps1` 没有 `-UiFull` 参数，不能把它直接传给 Python 的发布包装入口。

实时状态先读 `https://live.wly0829.cn/computer-access/state`，失败回退原 Cloudflare 地址；原同名路径直接导航报 `ERR_BLOCKED_BY_CLIENT`，页面内 Fetch 已验证，网页与图片维持原托管。
`edge/edgeone/edge-functions/[[path]].js` 只转发此接口，其他路径 404；回源 6 秒超时、不缓存，仅对正式站两种 HTTPS 来源开放跨域读取。
部署：压缩 `edge/edgeone/` 的内容为 ZIP，在 EdgeOne 项目 `makers-lrgrecs7uvjl` 的“新建部署”上传，选择生产；这是接口包，不上传网站或图片。
域名：生产关联 `live.wly0829.cn`，Cloudflare CNAME 仅 DNS，并按控制台添加归属 TXT、申请免费 HTTPS；`eo-test` 保留供试验。
撤回：网站回退本次提交，EdgeOne 回滚到本轮开始前的生产部署 `dpgfu7u5kqgm`；只删除本轮 `live` 的域名绑定及 CNAME/TXT，保留原记录与 `eo-test`。
