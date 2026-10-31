# 网站维护

在仓库根使用唯一 `npm run build` 生成成品，再扫描本次改页，最后由本机发布器传送成品。CI 只部署 `site-dist` 上的成品，不构建源码、不重新编码素材，也不重复扫描或内容校验。完整更新步骤、分工和完成标准见 [按需更新操作清单](ondemand-update.md)，发布行为与计时回执见 [发布与扫描](publish-and-scan.md)。

## 日常更新

正文、构图与首页的作者输入和构建约束见 [Astro 说明](../site-astro/README.md#内容文件怎么写)。修改所属作者源，不直接编辑已发布 HTML 或转换后的 Markdown；首页不是排版阅读页，不参加阅读检查。

日常构建使用主持已确定的常驻工作树 `E:\Cache\wly-site-build\wt`。每轮先核对未提交改动及正在使用同一 `dist` 的任务；有别人的改动或归属不明的文件时先交回主持，不能用切分支、重置或清理覆盖它们。确认源码工作区干净、上一轮写入者已经结束后，才从最新 `origin/main` 开始：

```powershell
Set-Location -LiteralPath 'E:\Cache\wly-site-build\wt'
git status --short
# 确认未提交源码改动已妥善处理，再依次执行。
git fetch origin
$refreshStamp = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::UtcNow, 'China Standard Time').ToString('yyyyMMdd-HHmmss')
git switch -C "refresh/$refreshStamp" origin/main
```

`git fetch` 失败时不执行下一步。切换前记下 `site-astro/package-lock.json` 的内容指纹，切换后比较；`npm ci --prefix site-astro` 只在首次安装，或这份锁文件内容变化时执行。常驻工作树的根及 `site-astro` 下 `node_modules`、`site-astro/.cache`、`site-astro/public`、`site-astro/src/content/rendered`、`.publish/typeset-out/_cache` 和 `dist` 均留在原地，不以“准备新一轮”为由清空。缓存当前仍绑定绝对路径，换目录的恢复能力属于待做项。并行约束见 [Astro 说明的唯一构建入口与回执](../site-astro/README.md#唯一构建入口与回执)：同一 `dist` 只有一个写入者，各批构建依次运行。

```powershell
# 从常驻工作树的仓库根运行。
npm run build
python -B -X utf8 site-astro/tools/scan_glance.py --dist dist
# 先只读上一成功版本并计算本次差量，不上传、不推送。
python -B -X utf8 site-astro/tools/publish_site.py --dist dist --scan-result <扫描结果绝对路径> --dry-run
# 在已有发布授权内，先上传并回读资源，再正式部署同一份成品。
python -B -X utf8 site-astro/tools/publish_site.py --dist dist --scan-result <扫描结果绝对路径> --upload-only
python -B -X utf8 site-astro/tools/publish_site.py --dist dist --scan-result <扫描结果绝对路径>
# 发布返回、释放锁以后单独清理，可与下一轮取数并行。
python -B -X utf8 site-astro/tools/publish_site.py --retention-only <正式发布输出目录>
```

扫描默认使用 `published-diff`，比较上一成功发布清单与最终 HTML 哈希，覆盖多轮构建累计的新增及变化路由，不依赖最后一次重建页。规则换版仍只扫这些变化页；只有外壳、排版引擎或共享脚本变化时另外使用 `--pages all`。缺少成功发布记录时工具提示回退 `changed`，按已有扫描记录比较页面哈希；此时核实真实成功前版和累计范围，不能把回退当作发布证据。指定路由可用逗号分隔的 `--pages /route-a/,/route-b/`；首页 `/` 照常可选，只跳转首页的旧别名 `/cv/`、`/system/` 不重复扫描。扫描覆盖大块空白、压叠、裁字、空图框、404 和点不动，结果及稳定后的截图留在扫描目录。动效由本人看，AI 不录屏或判断开场与动效。

部分构建前先核最近一次成功基线：按 Git 共享目录 `wly-oss/published.json` 的成品提交定位成功发布的 `site-dist`，核对发布清单、构建回执及非目标 HTML 的实际 SHA256；目录完整不表示它是当前生产版本。缓存基线不符时，先按该成功构建回执逐文件校验原 `dist`，再同步到常驻工作树的可重建 `dist`，保留来源，仅使本轮目标路由的构建缓存失效后重建；不拿旧 `rendered` 缓存拼回较早的正文。

正式发布沿用本机已配置的阿里云 CLI、OSS profile 和 `wly0829-publication` 短锁；不新增登录或凭据。发布器先资源、后 HTML、最后成功记录；`--upload-only` 不切换公网。正式部署和公网回读通过后才更新 Git 共享目录的 `wly-oss/published.json`。默认发布输出位置、保留目录及独立 OSS 清理规则见[发布与扫描](publish-and-scan.md#发布做什么)。`publish-receipt.json` 区分本地计划、上传、Pages 和公网回读，不能把 dry-run 或资源上传写成已经上线。

## 独立阅读与几何检查

`check-typeset-site.py` 现在只读已有 `dist`，不构建、不发布，也不管理旧批处理账本。阅读计划或现成构建报告必须含 `pages` 对象及每页 `url`，且对应实际成品；报告和浏览器缓存写在 `dist` 外。

```powershell
python -B -X utf8 scripts/check-typeset-site.py `
  --dist dist --build-report <本代reading-plan或build-report.json> `
  --out <任务目录/reading.json> --pages <非首页的页名>
```

检查保留阅读位置、反复转屏、页内目录、刷新与历史导航矩阵，以及实际 HTML/脚本响应和成品字节不变检查。直接使用 `check-typeset-reading.py` 时也会排除首页和首页别名（首页是保留 HTML，不是排版阅读页）；不会用旧运行件补丁重建成品。

`run-typeset-checks.py` 的独立几何与 QA 能力继续保留。几何模式需要已经提供 `/__typeset/measure` 的本机预览，普通静态 `dist` 不自动提供该接口；输入、量测和证据契约见 [源包与独立检查](typeset-publication.md)。这些检查按具体任务使用，不接回 CI、不暗中触发重建或发布。

## 成品部署与回退

本机发布器准备独立的 `site-dist` 成品提交。部署工作流只保留在源码 `main`，只允许从 `main` 手动触发；必填 `sha` 是实际 `site-dist` 成品提交号。工作流先核实该提交属于 `site-dist` 历史，再 checkout、configure-pages、upload-pages-artifact 和 deploy-pages，不构建、不扫描。源码 `main` push 不自动部署。

需要重新部署指定旧成品时，使用同一工作流的 `sha` 输入，传入实际旧 `site-dist` SHA：

```powershell
gh workflow run pages.yml --repo wlyaaaaa/wly0829.cn --ref main -f sha=<旧site-dist提交SHA>
# 使用上条命令返回的运行网址所对应的 run id，不猜最近的一次运行。
gh run watch <上条命令对应的run-id> --repo wlyaaaaa/wly0829.cn --exit-status
```

回退不重建源码，不改 `main` 或域名设置；完成仍须核对实际公网清单、版本身份与关键页字节。手动 dispatch 的运行提交可能是工作流所在的 `main` 提交，不能单凭它证明 checkout 的旧成品已经上线。源码 SHA 与成品 SHA 分别记录，按构建来源和成品回读核对应关系，不能要求两个分支的 SHA 相同。工作流成功本身也不会替本机写入新的 `published.json`：若回退后的公网版本与本机成功记录不同，下一次增量发布前先核实真实成功前版，必要时使用已核验的 `--previous-manifest`，不能把旧指针当作刚回退的证明。现有源包准备、旧清单解析和素材迁移证据保留，另见 [OSS 资源契约](oss-publication.md)；旧一键批管和另一套发布/回退链已退役。
