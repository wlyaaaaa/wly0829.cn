# wly0829.cn

[wly0829.cn](https://wly0829.cn/) 是吴乐阳的个人 AI 协作工作台，可查看项目、技能、规则和实况，也可连接电脑及管理授权。现版于 2026 年 11 月 22 日上线。

- `site-v2/trial/first-projects/网站示意/` 放项目及技能讲解页的网页源和在用素材，`site-v2/first-layer/` 放列表、原理、规则、授权等页，`site-v2/home-build/site/` 是首页源码。
- `site-v2/live/` 是 `/live/` 的前端，[实况数据](docs/live.md) 由 PCConfig 状态服务供给。旧驾驶舱地址由现役构建生成兼容跳转。
- `scripts/build-site.py` 组装 `dist/`，`tools/preview_site.py` 提供本地预览。[项目规则](AGENTS.md) 另有访客、专用链接及搜索词查询入口。

项目文档与结构维护、网站修复与 QA 发版、内容按需更新分别推进。本人说“更新网站”时走 [按需更新七步](docs/update.md)。构建、扫描、正式发布和清理见 [发布与扫描](docs/publish-and-scan.md)。

## 在本人电脑的新工作副本组装

在本轮网站工作副本的根目录运行。需要 Node.js（含 npm）、Python 和 `site-v2/requirements.txt` 列出的包。公开克隆能查看源码，完整组装还依赖以下本机输入。

1. 按 [共用表准备命令](docs/update.md#十五东西在哪现有工具) 解析登记并运行 `共用表.py prepare --worktree`。解析器的 `mapped` 表示找到来源，准备命令才会按原相对路径把文件放到本轮工作副本。确认三项实际组装输入已就位：
   - `site-v2/trial/first-projects/公开页禁用词.txt`
   - `site-v2/trial/first-projects/表/归属表.md`
   - `site-v2/配置/规则公开改写.json`
2. 公开审查使用 `E:/PCConfig/registries/site_public_words.json`，规则页默认读取 `E:/.agents` 的现行活动版本。本机字体缺失时，构建按 `site-v2/site-assembly/素材/字体/登记.json` 取回登记字节并核 SHA-256。
3. 本地组装把规则本人稿写到本轮私有临时目录。普通预览可省略实况备用包和正式回执映射。制作发布成品时，按 [发布与扫描](docs/publish-and-scan.md) 配置同版备用包，并把配套映射中的 `files/.publish/private/live-project.json` 放到本轮相同相对位置（去掉 `files/`），核其中 `public`、`owner` 的绝对路径指向两份登记的实况来源。

```powershell
python -m pip install -r site-v2/requirements.txt
$env:WLY_OWNER_RULES_OUT = '<本轮私有临时目录>/owner-rule-pages'
npm run build
npm run preview -- --host 127.0.0.1 --port 5194
```

打开 `http://127.0.0.1:5194/`。预览读已有 `dist/`；改源码后先重新构建。`dist/`、`.cache/`、`node_modules/` 与 `.publish/` 分别存放产物、缓存、依赖和本机配置。活动规则换版时构建可能刷新工作副本里的规则样稿，正式成品按 [源码提交与封存说明](docs/publish-and-scan.md#工作副本依赖与构建) 处理。

公开仓跟踪组装所需的源码和在用素材。草稿、版面、画风、出图提示及工作记录使用已登记的私有配套；本轮替换掉的旧图按 [收尾步骤](docs/update.md#第-7-步-发布结果页收尾) 清理。
