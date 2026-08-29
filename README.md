# wly0829.cn

吴乐阳本人使用的只读项目看板。网站公开访问，但第一读者是本人：打开页面后应当能理解项目、规则、Skills、当前状态、失败和证据，不需要回看旧对话。

## 当前内容

- 项目清单：`config/panel-projects.json`
- 当前第一个项目：`.agents`
- 五份活动规则：同一 `/rules` 工作台内切换
- Skills：按当前实际价值排序，每项包含意义、决策影响、当前规则、术语、失败恢复和验证

MVP 当前只有一个项目，不是长期数量限制。以后所有项目都加入项目清单；`.agents` 固定 `order=1`。

## 项目模式

- `real_dashboard（真实看板）`：默认。展示真实架构、流程、状态、缺口和证据。
- `curated_packaging（策展包装）`：只有用户明确指定的包装项目才可使用。

唯一不进入 Git 的项目文档是 `docs/design/private-content-rules.md`，它保存包装和屏蔽规则。其他产品、维护和 QA 文档都应跟踪。可重建 QA 图片留在 ignored 目录。

## 本地命令

```powershell
npm install
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
npm run build
npm test
npm run verify:snapshot
npm run verify:public
```

刷新动态快照：

```powershell
npm run refresh:snapshot
```

刷新要求 `.agents` canonical 工作树干净、联网 fetch 后 HEAD 与 `origin/main` 一致，并从固定 Authority 取得允许状态。活动 descriptor 与页面绑定的 logical id、SHA-256 或字节大小不一致时，刷新失败并要求先做 material semantic refresh，不能只换 generation 标签。解释是否准确由独立内容终审负责，不冒充 hash 检查能力。

判断 Source 变化是否需要网站任务：

```powershell
npm run impact -- --project agents --path AGENTS.md
npm run impact -- --project agents --path AGENTS.md --material-change
```

路径命中只表示影响候选；只有 Source Owner 确认页面会实质失真并显式传入 `--material-change`，才要求创建新的独立网站任务。

## 事实来源

优先级：

1. 固定 Authority 与同一 active generation；
2. Source 项目真实默认分支；
3. Git/机器/Provider 的正式 read-back；
4. 项目测试和用户路径；
5. 基于上述事实维护的页面解释。

Candidate 不冒充 Active；Source、Test、Install、Publish、Fresh task、E2E 和 User acceptance 彼此独立。

## 发布

项目使用 React、Vite 和 GitHub Pages。完成要求：

- 本地 build/test/public gate 通过；
- 真实浏览器完成桌面、平板和手机验收；
- 定向 commit 和 normal push 到 `main`；
- 远端 `main`、Pages deployment 和公网 read-back 指向同一提交；
- 直接路由、自定义 404、robots、sitemap 与 SEO 全部核对。

完整产品规格见 [个人项目看板 MVP 产品规格](docs/design/agents-mvp.md)，内容原则见 [看板内容建设原则](docs/design/内容建设原则与MVP重构方案.md)。
