# wly0829.cn

吴乐阳本人使用的个人 AI 协作工作台：查看项目、技能、规则和实况，连接电脑及管理授权。网站公开访问，主要为本人使用。

新版讲解页的网页源、实际使用的图和组装程序在 `site-v2/`。实况、后端及其依赖沿用现有入口。只有本人说“更新网站”才更新，流程见 [网站怎么更新](docs/update.md)。

```powershell
npm ci --prefix site-astro --ignore-scripts
python -m pip install -r site-v2/requirements.txt
npm run build
npm run preview -- --host 127.0.0.1 --port 5194
```

`npm run build` 组装讲解页和实况前端，输出仓库根 `dist/`。`preview` 打开已有成品。访客、专用链接及搜索词查询入口见 `AGENTS.md`。

公开仓只放组装网站需要的源码和实际引用的素材。草稿、版面、画风、出图提示、派单和验收记录、本人原话、退下来的旧图都在已登记的私有配套。

新工作副本用 `Get-ProjectPrivateCompanion.ps1 -Repo wlyaaaaa/wly0829.cn -RepoPath <工作副本> -Json` 查映射。按需更新先按[更新步骤](docs/update.md)将三张共用表和所需底稿复制到本轮工作副本。单独构建时可按登记读取归属表、公开词表和规则公开改写。正式发布用的工作副本另外链接 `.publish/private/live-project.json`，供发布回执写入登记的实况来源。编辑底稿时按需在编辑工作副本挂回相关文件。

构建后的扫描、OSS 地址改写和发布预演见 [发布与扫描](docs/publish-and-scan.md)。新版首次对外公开要等本人确认。
