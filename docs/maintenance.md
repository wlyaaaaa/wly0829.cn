# 网站维护

在仓库根使用唯一 `npm run build` 生成成品，再扫描本次改页，最后由本机发布器传送成品。CI 只部署 `site-dist` 上的成品，不构建源码、不重新编码素材，也不重复扫描或内容校验。完整发布行为与计时回执见 [发布与扫描](publish-and-scan.md)。

## 日常更新

正文和构图的写作、转换方法见 [Astro 说明](../site-astro/README.md)。修改所属页面的源内容，不直接把已发布 HTML 当作新源。`page.json`、相邻 `layout.json` 与转换后的 Markdown 要表达同一内容；构图中的 `text_ref` 继续对应正文。首页已锁定，保留现有页面和素材字节，不参加自动扫描、阅读或 UI 检查。

```powershell
# 从仓库根运行；构建入口由 G1 负责。
npm run build
python -B -X utf8 site-astro/tools/scan_glance.py --dist dist --pages changed
# 先只读上一成功版本并计算本次差量，不上传、不推送。
python -B -X utf8 site-astro/tools/publish_site.py --dist dist --dry-run
# 已取得本次发布授权时执行；本轮施工没有执行这条命令。
python -B -X utf8 site-astro/tools/publish_site.py --dist dist
```

`changed` 优先读取本代 `.build-receipt.json` 的重建页；没有回执时比较已有扫描记录与页面哈希。全站扫描用 `--pages all`，指定路由用逗号分隔的 `--pages /route-a/,/route-b/`；首页锁定时仍跳过 `/`。扫描覆盖大块空白、压叠、裁字、空图框、404 和点不动，结果及稳定后的截图留在扫描目录。动效由本人看，AI 不录屏或判断开场与动效。

正式发布沿用本机已配置的阿里云 CLI、OSS profile 和 `wly0829-publication` 短锁；不新增登录或凭据。发布器只上传变化资源和文档，先资源、后 HTML、最后清单；只对新传资源 HEAD，再 GET 关键页和本次变化页。发布不回收线上对象。`publish-receipt.json` 区分本地计划、上传、Pages 和公网回读，不能把 dry-run 写成已经上线。

## 独立阅读与几何检查

`check-typeset-site.py` 现在只读已有 `dist`，不构建、不发布，也不管理旧批处理账本。阅读计划或现成构建报告必须含 `pages` 对象及每页 `url`，且对应实际成品；报告和浏览器缓存写在 `dist` 外。

```powershell
python -B -X utf8 scripts/check-typeset-site.py `
  --dist dist --build-report <本代reading-plan或build-report.json> `
  --out <任务目录/reading.json> --pages <非首页的页名>
```

检查保留阅读位置、反复转屏、页内目录、刷新与历史导航矩阵，以及实际 HTML/脚本响应和成品字节不变检查。直接使用 `check-typeset-reading.py` 时也会排除首页和首页别名；不会用旧运行件补丁重建成品。

`run-typeset-checks.py` 的独立几何与 QA 能力继续保留。几何模式需要已经提供 `/__typeset/measure` 的本机预览，普通静态 `dist` 不自动提供该接口；输入、量测和证据契约见 [源包与独立检查](typeset-publication.md)。这些检查按具体任务使用，不接回 CI、不暗中触发重建或发布。

## 成品部署与回退

本机发布器准备独立的 `site-dist` 成品提交，并附最小 `.github/workflows/pages.yml`，使该分支 push 能触发部署。工作流使用 Ubuntu，只执行 checkout、configure-pages、upload-pages-artifact 和 deploy-pages。源码 `main` push 不触发部署。

需要重新部署指定旧成品时，使用同一工作流的 `ref` 输入，传入实际旧 `site-dist` SHA。下面是未来命令示例，本轮没有执行：

```powershell
gh workflow run pages.yml --repo wlyaaaaa/wly0829.cn --ref site-dist -f ref=<旧site-dist提交SHA>
gh run list --repo wlyaaaaa/wly0829.cn --workflow pages.yml --limit 5
gh run watch <run-id> --repo wlyaaaaa/wly0829.cn --exit-status
```

回退不重建源码，不改 `main` 或域名设置；完成仍须核对实际公网清单、版本身份与关键页字节。手动 dispatch 的运行提交可能是工作流所在提交，不能单凭它证明 checkout 的旧成品已经上线。现有源包准备、旧清单解析和素材迁移证据保留，另见 [OSS 资源契约](oss-publication.md)；旧一键批管和另一套发布/回退链已退役。
