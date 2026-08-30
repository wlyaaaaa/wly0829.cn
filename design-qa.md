# 六项目 MAP 设计与产品验收

状态：`six_project_public_pass`

观察时间：2026-08-30

## 当前范围

项目 Registry 当前启用 6 项，顺序为 `.agents`、PCConfig、GitHub 总索引、
ChineseASR、TimeAudit、PC Panel Hub。PC Panel Hub 使用“总览 + 5 个真实产品
模块”：指标与可信度、机箱屏渲染、串口与刷新、HS2 事件浮层、电源与自愈。
Source / Tests / Runtime / Demo / Protocol / Owner observation 留在总览证据层，
没有为了视觉对称增加网站基础设施模块。

## 源项目修复与回读

- PUBLIC 源项目 `wlyaaaaa/PC-Panel-Hub` 已从 `271ffd25` 前进到
  `2717ecb4c37bd9e3a0e4a635384ee5a2458c8399`。
- 本地 `main`、`origin/main` 与 `git ls-remote refs/heads/main` 回读一致，
  工作树干净。
- 公开源码 ZIP 现包含 TURZX 与 HS2 双屏源码；机器 JSON、厂商二进制和生成目录
  被排除，只保留无实际天气坐标/网卡值的 `config.example.json`。
- 物理 `config.json` 已保留、补齐私有天气配置并停止 Git 跟踪；没有重启天气、
  stream、任务、USB 或显示模式。
- 回归：天气 8/8、指标 83/83、协议 79/79、HS2 Core 321/321；完整
  `scripts/test.ps1 -SkipStreamWhenRunning` 通过，生产 stream 新鲜时明确跳过
  `TestVideoStream`。
- 普通提交只清理当前 main 与未来 ZIP，既有 PUBLIC Git 历史不会被 normal push
  重写；本轮没有 force-push 或历史清理。

## 内容与可视化

- 首屏公开 6 个决策事实：双屏职责、1 Hz Hybrid、数据节拍、当前运行、来源回归、
  尚缺证据。
- 内容独立解释 TimeAudit / PCConfig / PC Panel Hub Owner 边界，不按 README
  章节复述；CPU 口径使用当前源码的 `% Processor Utility`。
- 画廊为 6 张完整图 + 6 张 WebP 预览。第一张是 2026-08-30 直接捕获的
  `DISPLAY31` 当前 2288×1048 画面，展示已经实际生效的 Wallpaper Engine
  动态壁纸及透明浮层电量/时间；它不是合成替代图。
- 其余 5 张为公开安全的软件设计或场景演示，逐张显示 `evidenceLevel`、
  `proves` 与 `doesNotProve`，不冒充实体 OLED。
- 完整图共 3,474,134 bytes；预览共 206,652 bytes。列表只请求 WebP，打开灯箱
  后才请求当前 JPG/PNG。

## 自动化门

- `npm run build`：PASS。
- `npm test`：33/33 PASS。
- Snapshot binding：E89、5 个 rule bindings、23 个公开 Skill、25 个 active
  install intent，0 finding。
- PUBLIC gate：82 个 source + 107 个 dist，共 189 个文件，0 finding。
- 67 条产品路由均生成目录入口；另有 custom 404，共 68 个 HTML。
- 生产 JavaScript：838,203 bytes，gzip 288,631 bytes（281.87 KiB），低于
  320 KiB 防膨胀审查线约 38.13 KiB。没有新增依赖、服务、watcher、数据库或
  点击后 dynamic import。

## 真实浏览器 QA

使用 Microsoft Edge 150 的真实 1440×900、390×844、768×900 viewport 验收，
回执为：

任务专用 E 盘临时目录中的 `browser-qa/qa-report.json`（ignored QA 证据）

- 首页 6 卡两列，前 4 卡进入桌面首屏；桌面/移动/平板均无横向溢出。
- 390 与 768 宽度从总览切模块再返回，`window.scrollY` delta 均为 0。
- 模块切换新增 Document / Script / Fetch / XHR 请求均为 0，无 spinner、
  skeleton 或空白。
- 画廊打开前 6 张均为 WebP、完整图请求为 0；打开第一张后为实际动态壁纸 JPG。
- 灯箱 portal 到 `document.body`，1/6 → 2/6 → 1/6、关闭、左右键、Escape、
  Tab / Shift+Tab 焦点圈、关闭后焦点恢复全部通过。
- 灯箱覆盖 390×844 viewport，z-index 200 高于 header 40。
- 浏览器 console warning/error 与 runtime exception：0。

当前忽略的视觉证据：

- `docs/design/qa/home-1440x900.png`
- `docs/design/qa/pc-panel-overview-1440x900.png`
- `docs/design/qa/pc-panel-overview-390x844.png`
- `docs/design/qa/pc-panel-gallery-390x844.png`
- `docs/design/qa/pc-panel-lightbox-390x844.png`

实际生成物保存在同一任务的 `browser-qa` 临时目录；提交前复制到 ignored QA
目录，不进入 PUBLIC Git 历史。

## 当前仍诚实保留的缺口

- command 204 没有设备 ACK；主机 heartbeat 不能替代实体像素。
- 本轮没有重演 TURZX 实体 1 Hz、冻结恢复、睡眠/唤醒或异常断电启动。
- HS2 动态壁纸当前已由实际画面和本人观察确认；单帧不证明长期帧率或未来恢复。
- 当前 eager bundle 仍在阈值内。后续实测接近 320 KiB 时，即使项目不到十个，
  也必须切换 build-time route-specific static content + shared small JS + prefetch，
  不能删除正文或转成点击 lazy-load。
- 浏览器插件缓存存在版本路径错配；本轮没有拿它当产品 blocker，而是用实际 Edge
  完成同等浏览器交互验收。缓存问题不影响已交付网页代码。

## 发布边界

六项目内容提交 `b674b1f7a73ae48c8031f6f7f28ddfc9e6de272f` 已 normal push 到
PUBLIC `main`。Pages run `33295308893` 的 build 与 deploy 均为 success，远端
`refs/heads/main` 回读同一提交。

公网回读结果：

- 首页、PC Panel Hub 总览与 5 个模块路由均为 200，canonical URL 正确。
- 公网 JavaScript `index-BDhxgj0W.js`：838,203 bytes，SHA-256
  `58b9c1cfa88906c753a13514198d8d8630742af5f0712046a493fe553f29b8e3`。
- 公网 CSS `index-C8gSuhdS.css`：68,947 bytes，SHA-256
  `ad0ffbcf07359157977c90a98c9eeb8001ca33076807f0ebc0e3f8df9329f9ac`。
- 实际动态壁纸 JPG 与 WebP 预览均为 200、MIME 正确，bytes/SHA 与本地 dist
  完全一致。
- 公网 Edge 真实交互 QA 在 1440、390、768 宽度再次 PASS：模块滚动 delta=0、
  点击切换新增请求=0、画廊 WebP→当前 JPG、1/6↔2/6、焦点圈、Escape、portal、
  viewport 覆盖与 console 0 问题全部闭合。

因此当前结果为 `six_project_public_pass`；不再以本地预览、CI 或截图单独冒充
公网完成。
