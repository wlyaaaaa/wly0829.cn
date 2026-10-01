# 拼图静态站点的发布与回退

本流程从拼好的站点生成发布目录，保留全部页面正文和原样的 AVIF 图片。它不会改输入目录。旧版 React/Vite 源码、依赖和构建命令保留，供回退使用。

## 图片策略

- 横版正文保留 AVIF 1920、2880；竖版正文保留 AVIF 1280。
- 卡片保留所有现有 AVIF 档位，避免改变卡片实际选图。
- 非 AVIF 浏览器只使用单份 640 宽 WebP 兜底，来自已有小档 WebP。它会更模糊；现代浏览器仍使用原始 AVIF 文件。
- 原样保留截图、共享装饰和视频；排除本机编译记录、来源路径和不被 HTML 引用的旧图片变体。
- 页面的懒加载、预加载、picture、查看器引用一起更新。保留资源逐个检查 SHA-256。

本机准备需要 Python 3.11 以上和 Pillow；当前设备已具备。CI 只验证已准备目录，不重新编码。

本次网站原文按本人指定固定为 **E207 / 9e269f2**，与以后活动规则如何升级分开。`config/assembled-rules-pin.json` 保存经发布记录/文件哈希核验的来源和原文文字指纹；构建与 CI 检查各规则页的版本说明、page-data 来源版本/哈希，以及实际可见原文正文。只改标签不能通过。沿用已批准的两处能力文本省略和四行旧项目表省略，额外导航不算原文；代码段的空格也参与指纹。旧版本或正文不符会列出页面并停止发布。

Pages 使用现有免费方案。Actions 的标准 Pages 运行器免费，产物存储另算共享配额；部署成功后只删除本次产生的临时 Pages 产物，报告写入不计产物存储的作业摘要。失败部署的包最多保留一天。发布前仍要检查账户共享配额，不能用 Pages 的 1 GB 单站额度替代 Actions 存储额度。

## 准备和发布

在审定的 prep 分支工作副本中运行。`<assembled-site>` 是第 1、2 批拼好的完整目录。

```powershell
# 默认只构建和检查，结果放在 ignored .publish 目录。
pwsh -NoProfile -File scripts/publish-assembled.ps1 -Source '<assembled-site>'

# 准备给审阅者检查的 site-release，仍不提交、不推送。
pwsh -NoProfile -File scripts/publish-assembled.ps1 -Source '<assembled-site>' -Stage

# 完整检查通过后，一条命令准备、提交产物并正常推到远端 main。
# 已审定的脚本和 workflow 必须先提交，不能混有其他暂存改动。
pwsh -NoProfile -File scripts/publish-assembled.ps1 -Source '<assembled-site>' -Publish
```

第 2 批拼入后用新的完整目录重跑同一命令。已有 `site-release` 会移动到该次 `.publish` 运行目录的 `previous-release`，保留到新版本部署验收完成，随后按任务临时文件规则回收。若远端 main 已前进、不能正常快进推送，脚本停止；先在 prep 工作副本中整合新 main 并重新验收。

发布脚本要求根 `index.html` 和 `404.html`、所有站内链接和资源存在、CNAME 为 `wly0829.cn`，文件及 tar 保守估计均不超过 850,000,000 字节。只供 B1 抽查的 `--allow-incomplete` 不能绕过发布脚本或 CI。

CI 根据 `site-release/index.html` 选择静态新站，否则沿用旧 Vite 构建。每次部署前会再运行原有全文件凭据检查，以及新站的引用、域名、体积和公开内容检查。检查失败就停止部署，不自动改正文。

```powershell
gh run list --repo wlyaaaaa/wly0829.cn --workflow pages.yml --limit 5
gh run watch <run-id> --repo wlyaaaaa/wly0829.cn --exit-status
gh api repos/wlyaaaaa/wly0829.cn/deployments -f environment=github-pages -f per_page=5
```

部署后核对该次运行的 headSha、Pages deployment commit 和远端 main；然后回读正式域名的首页、项目、规则、技能、图片和视频。大陆访问须以真实无代理网络验收，不把本机构建成功当成公网成功。

## 一条命令即时回退

```powershell
gh workflow run pages.yml --repo wlyaaaaa/wly0829.cn --ref main -f site=legacy
```

它重新构建并部署保留的旧 Vite 网站，不改 DNS，不修改仓库历史。运行结束后仍要核对部署结果。下一次 main push 的 auto 模式会再次选择新站；若要持续停留旧版，在 prep 分支撤销新站发布提交、正常推送 main，或将 `site-release` 移出跟踪再提交。不能用强推回退。

## 公开门范围

原有 `verify:public` 继续对所有 tracked/unignored 源文件及产物逐字节查凭据；新增检查针对公开产物。技术路径和命令允许。私人资料路径、受排除话题、编译凭据与来源记录会阻断，并给出文件、位置和命中词。扫描不会自动删除正文。媒体内文字没有通过这一字节检查完成 OCR 验收；内容负责人须沿用图稿的公开内容验收。

构建先复制并逐个核验输入快照，避免编译器继续修改预览时混入不同版本。快照留在 `.publish/snapshots`，正式发布验收后按任务临时文件规则回收。

私有仓库身份从本机登记表读取，只把页面数据中的完整仓库身份改为稳定中性项目键，不上传登记表。续作说明为此显示“项目键”；后续 AI 通过中文项目名与本机索引定位真实来源。实时状态仍使用原中文项目名。持续集成通过 GitHub 公开仓库清单独立复验身份引用，公开清单为空或 API 读取失败就停止。公开的产品名、技能名、路径和路由不是仓库身份字段，保留其原义。
