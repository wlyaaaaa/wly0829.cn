# wly0829.cn

吴乐阳本人使用的只读项目看板。网站公开访问，但第一读者是本人：打开页面后应当能理解项目、规则、Skills、当前状态、失败和证据，不需要回看旧对话。

## 当前内容

- 项目清单：`config/panel-projects.json`
- 当前项目顺序：`.agents`、PCConfig、GitHub 总索引、ChineseASR（1/2/3/4）
- 五份活动规则：同一 `/rules` 工作台内切换
- Skills：按当前实际价值排序，每项包含意义、决策影响、当前规则、术语、失败恢复和验证

单项目内容 MVP 和三项目本地版已经验收；当前新增且仅新增 ChineseASR，由项目清单驱动，`.agents` 固定 `order=1`。规则页始终读取 verified current E release；本轮用户已授权在 current E release、PCConfig、GitHub 总索引和 ChineseASR 快照刷新并验证后发布公网。

## 项目模式

- `real_dashboard（真实看板）`：默认。展示真实架构、流程、状态、缺口和证据。
- `curated_packaging（策展包装）`：只有用户明确指定的包装项目才可使用。

已纳入项目默认展示完整产品与技术细节。只隐藏私人敏感正文和密钥、令牌、恢复码等可复用秘密；模型、Provider、Profile、版本、模式、路径、端口、组件、数据流、提交、hash、候选、安装/运行状态、失败、测试、E2E 和已知缺口都保留。每个项目第一屏先列出当前实际选择，不能让本人读完整篇才拼出“现在到底用了什么”。

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

## AI 快速刷新

网页正文由 AI 更新。用户只需要说“刷新个人看板里的 PCConfig”或“全部更新一下”；AI 读取 Registry 和真实 Owner、判断实质变化、自动修复安全问题、原位更新内容并给出本地预览。小改默认不更新，全量复核也允许全部项目保持字节不变。

AI 内部可先取得定向或全量刷新计划：

```powershell
npm run refresh:ai -- --project pcconfig
npm run refresh:ai -- --project chinese-asr
npm run refresh:ai -- --all
npm run verify:ai-refresh -- --bundle <ai-result.json>
```

该命令只返回项目、当前内容指纹、事实采集入口和刷新边界，不写网页正文。完整合同见 [个人看板 AI 快速刷新合同](docs/maintenance/ai-panel-refresh.md)。

当前首屏 JavaScript gzip 预算为 256 KiB；启用第 8 个项目前必须切换为项目详情 lazy-load 和轻量派生搜索索引，防止未来 40+ 项目把首屏撑大。

刷新 `.agents` 的活动规则/Skill 结构化证据：

```powershell
npm run refresh:agents-snapshot
```

该结构化刷新只属于 `.agents`。Rules 正文、路径和 SHA 只取 `Invoke-EAgentRulesRelease.ps1 -Mode Inspect -Json` 返回的 frozen current E release；当前 source checkout 即使 dirty 或已进入下一候选提交，也只能作为非活动施工状态展示，不能覆盖 E release。刷新通过独占锁、前后 Git/E pointer 完整指纹和原子替换避免半新半旧；快速刷新不重跑整个源码测试集，没有新全量回归证据就明确显示 Unknown。解释是否准确仍由 AI 内容终审负责，不冒充 hash 检查能力。

判断 Source 变化是否需要网站任务：

```powershell
npm run impact -- --project agents --path AGENTS.md
npm run impact -- --project agents --path AGENTS.md --material-change
```

路径命中只表示影响候选；只有 Source Owner 确认页面会实质失真并显式传入 `--material-change`，才要求创建新的独立网站任务。

## 事实来源

优先级：

1. 正式 current E release、PRIVATE main commit 与五文件 ruleset；
2. Source 项目真实默认分支；
3. Git/机器/Provider 的正式 read-back；
4. 项目测试和用户路径；
5. 基于上述事实维护的页面解释。

Dirty/unreleased source 不冒充 current E release；Source、Test、Install、Publish、Fresh task、E2E 和 User acceptance 彼此独立。C 盘旧规则材料只作恢复历史。

## 发布

项目使用 React、Vite 和 GitHub Pages。完成要求：

- 本地 build/test/public gate 通过；
- 真实浏览器完成桌面、平板和手机验收；
- 定向 commit 和 normal push 到 `main`；
- 远端 `main`、Pages deployment 和公网 read-back 指向同一提交；
- 直接路由、自定义 404、robots、sitemap 与 SEO 全部核对。

完整产品规格见 [个人项目看板 MVP 产品规格](docs/design/agents-mvp.md)，内容原则见 [看板内容建设原则](docs/design/内容建设原则与MVP重构方案.md)。
