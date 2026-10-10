# 增量发布与一眼错误扫描

先构建成品，再用一个扫描入口检查稳定后的画面。发布入口只传新增或内容变化的文件，并留下实测计时。扫描失败只报告问题；扫描器不改页面，也不替本人按授权、解锁、锁屏等按钮。

```powershell
python -B -X utf8 scripts/prepare-oss-release.py finalize-dist --dist <dist>
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages changed
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages all
python -B -X utf8 site-astro/tools/scan_glance.py --dist <dist> --pages /projects/daily-preferences/,/projects/password-center/
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <scan-result.json> --dry-run
python -B -X utf8 site-astro/tools/publish_site.py --dist <dist> --scan-result <scan-result.json>
```

`<dist>` 是完整构建目录。构建最后调用离线 `finalize-dist`，一次完成资源地址改写和 OSS/Pages 分包身份；扫描和发布都使用收口后的同一份磁盘字节。这个函数不读取线上清单，同一输入的结果可重复，已收口且未改变的目录再次运行不变。G1 接线前可以手动执行第一条命令；发布入口不再改写页面或资源。没有构建回执时，扫描仍能读取成品并自行计算文件哈希。

资源地址由该资源和实际依赖的内容决定。修改一份 JSON 时，无关脚本和页面不会因为整包指纹变化而换地址；读取该 JSON 的脚本会随真正变化的依赖更新。循环引用使用有限的源依赖闭包，重复定稿不在循环中反复换键。

构建部分重建旧成品时，原始清单可带 `previous_oss`，值为上一次本机最终清单的 `oss` 对象。它提供旧对象的 `key`、`url`、`sha256`、`source` 及已有回执，供离线保留字节未变的地址、识别旧绝对引用；这不是一次成功部署证明。旧脚本中真正受依赖变化影响的引用会更新，查询参数和锚点保留。定稿清单保存结果，不再重复保存整个 `previous_oss` 副本。发布仍独立比较真实成功前版，决定哪些对象确实要上传。

## 发布做什么

- 显式 `--previous-manifest <文件>` 无效时直接报错；未指定时，沿用 `oss-retention.py` 对真实成功 GitHub Pages 部署的发现方式。不会把未部署的最新提交当成上一版。
- 先逐个比较整份 dist 的文件 SHA256 与指定扫描记录，增、删、改任何文件均拒绝发布并列出差异。再按最终成品清单与真实成功前版计算上传计划；对象地址变化也必须上传对应字节，不能因为哈希相同就跳过新地址。资源先上传 OSS，随后把原字节的 Pages 成品提交到专用 `site-dist` 分支；全部部署和回读通过后，最后写既有 Git 共享目录的 `wly-oss/published.json` 成功记录。
- OSS 对本次上传对象做 HEAD，核大小及 ETag 或 Content-MD5；首页、驾驶舱、`/computer-access/` 和变化的 HTML 做 GET，核 HTTP 200 和正文 SHA256。推完 `site-dist` 后，从 `main` 手动触发 `pages.yml` 并传入刚推的 `sha`；按触发命令返回的运行网址取得 run id，等待该次运行成功才开始页面回读。`--pages-timeout`（默认 600 秒）覆盖触发和等待，失败或超时直接报错；若 GitHub CLI 未返回运行网址，也报错而不猜是哪次运行。
- `oss-retention.py pin` 在上传前保留本次所需对象。保留集包含清单对象，以及成品 HTML、CSS、JS 中实际引用的绝对 OSS 地址。发布不调用回收，不删除任何线上对象。
- 沿用已有 `aliyun ossutil` 的 `website-images` 配置，程序不读取、复制或记录凭据内容。没有新增 CDN 刷新步骤，既有被替换的发布链也没有这一步。

每次运行在输出目录写 `publish-receipt.json`，包含逐步秒数、计划与实际传输文件数和字节数、HEAD/GET 结果、部署标识及失败原因。`--output <新目录>` 可指定落点；默认写到 dist 的同级唯一目录。失败回执会保留，不把上传完成当成发布成功。

`--dry-run` 同样先核扫描文件哈希，只读上一版清单，计算差异，并在独立临时仓库生成真实的 `site-dist` 提交。首次提交没有父提交；已存在分支时从其提交接续。预演不领发布锁、不 pin、不上传、不推送、不触发部署、不写成功记录。传输时间按固定 10,000,000 字节/秒估算；回执明确记录这个假设，它不是网络实测，也不包含 GitHub Pages 排队时间。

成品仓库包含全部 Pages 文件、资源清单和成品身份，部署工作流只保留在 `main`，源码工作树不切分支。关闭 Git 换行转换后逐文件核暂存 blob 原始字节；普通 push 不强推。`--source-commit <40位源码SHA>` 可说明成品对应的源码，优先使用成品已有构建回执；缺失写 `Unknown`，不把当前源码 HEAD 冒充构建证据。

## 扫描做什么

`changed` 优先读取 `.build-receipt.json` 的 `rebuilt_pages`；没有回执时，比较当前页面 SHA256 与同一输出目录里上一份扫描记录。第一次没有记录时扫描所有页面。检查未完成的页面不会记成已完成，因此下次仍会选中。`--out <目录>` 可保存独立的一次验收，默认写到 dist 同级 `scan-glance`。

扫描器沿用 `rescue-sweep.py` 和 `rescue-sweep-dom.js` 的文字范围、可见性、滚动、哈希和截图方法。四个独立无头 Chrome 并行检查 1920×1080、3840×2160，设备像素比为 1。它启动任务自己的本机静态服务，按最终清单把尚未上传的新 OSS 地址映射到 dist 中的确切资源字节；旧继承资源和实时只读数据继续以公网一致的 Origin/Referer 请求，写请求不转发。预览仅在内存里把 URL 换成本机代理地址，磁盘成品不变。临时浏览器配置位于任务输出目录，用完释放，不读取本人的 Chrome 登录资料。

每页先等 load、字体及当前图片，网络静默一秒；从顶部滚到页底触发懒加载，等待图片和网络稳定，再回到顶部检查。超时或检查器异常是 `scan_error`，不会得到通过结论。不录屏、不判断动效或打开过程；这些仍由本人验收。

六类失败是大块空白、文字压叠、文字被裁、空图框、请求或站内链接与锚点错误、可见按钮或链接点不动。屏幕像素阈值与叠放白名单集中在 `scan_glance.json`。栏底空白仍须超过 200 像素；用本人截图校准后，行高比例从 25% 调为 20%，使“手机上也能用”屏实际 218.8 像素、20.54% 的空白被检出，屏内竖带仍须超过视口高度 40%。原普查另外七类保留为提示：屏外或透明文字、占位词与坏字、重复标题、重复卡片、重复大图、横向越界、日期说法。

本人已于北京时间 2026 年 10 月 11 日 04:32 验收首页。`home_locked` 现默认 `true`，全站扫描、改页扫描及路由指定扫描均跳过首页，也不把首页发出的离线断链列入结论。以后首页的视觉改动由 AI 看静态截图、本人看效果，不再等待主持手动打开锁定。新扫描器不写死时段按钮个数。

输出 `scan-result.json` 记录页面、视口、类别、元素选择器、坐标、逐页计时及截图路径，并记录全 dist 的 `dist_files_sha256`。开始和结束的成品清单不同会报 `scan_error`，不能得到通过结论。每页每视口一张整页 PNG，失败局部图从同一张完整截图按实际坐标裁切。请求失败没有元素坐标时附首屏；未选中页面的离线断链只记录 `viewport=offline`、空坐标，不伪造局部截图。退出码非零表示有失败；实时接口读不到单列为 `live_unavailable`，不计作静态 404。

## 旧入口的处理

已移除 `publish-oss-assets.ps1`、`Publish-Pages.ps1`、`publish-typeset.ps1`、`publish-hybrid.ps1`、`publish-assembled.ps1`、`rollback-hybrid.ps1`，以及准备器的 `verify-remote`、`seal-remote` CLI、旧 hybrid restore 和专属测试。历史完整 GET/封存格式的解析和测试辅助函数仍供旧清单回归，发布入口不调用它们。`fullsite_check.py` 的通用溢出、坏图、请求错误和空白检测由新扫描器接替，已删除。

保留 `link_check.py` 作为新扫描入口调用的离线链接和锚点检查，只有一份实现。`check.py` 还有逐屏原文对照、窄栏/表格宽度和空卡内容检查；`check-site-ui.py` 还有专门的交互与历史基线检查；`run-typeset-checks.py` 和 `check-typeset-*` 还有几何、阅读位置和恢复证据，均未被这次稳定画面扫描完整覆盖。它们不代替新扫描入口；本次不运行其中的动效审查。旧 UI 检查的时段标签已改为四个，并同步删除对应两条循环按钮缺失基线。

## 与构建链的接线

这次只改发布和扫描，不接管构建。`pages.yml` 只允许从 `main` 手动触发，必填 `sha` 是 40 位十六进制的 `site-dist` 提交号；先 fetch 该分支并核实提交属于其历史，再 checkout 该提交、configure-pages、upload-pages-artifact、deploy-pages；CI 不构建、不扫描。官方成品上传动作始终排除 `.git`、`.github`。`check-typeset-site.py` 现只读已有 dist，阅读位置、转屏、导航和哈希检查保留。构建调用 `finalize-dist`；必要的资源复制和历史继承逻辑集中在 `prepare-oss-release.py`，旧 hybrid 装配、全量验证及其 CLI 已退出。

现有 `github-pages` 环境于北京时间 2026 年 10 月 11 日 05:17 只读确认仅允许 `main`，保持该设置；发布窗口先把本次工作流合入 `main`，再执行发布命令，本次没有改设置、建远程分支或部署。回退用同一入口：`gh workflow run pages.yml --repo wlyaaaaa/wly0829.cn --ref main -f sha=<上一个site-dist提交号>`，等待返回的 run id 成功后核公网资源清单和成品身份。不能把本地预演说成真实上传、Pages 部署或五分钟发布已经验收。
