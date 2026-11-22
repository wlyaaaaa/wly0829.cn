# 驾驶舱流量卡：删除网络套餐显示

status: local-verified-full-build-blocked
observed_at_beijing: 2026-11-15T18:15:00+08:00

流量卡只显示本机代理今天的量、近 60 分钟和是否超提醒线；订阅余额、有效期、重置日及取数失败文案已删除。首帧固定样本同步去掉套餐卡，保留代理流量。电脑区原有三行三列和相邻卡片保留。

- 真实公开接口 `https://live.wly0829.cn/computer-access/state?view=cockpit` 返回 `proxy_traffic`，无 `package`、`packages`、`package_*` 字段。
- 本机 Chrome 打开本工作树构建产物，实时流量为今天 19.6 GB、近 60 分钟 1.6 GB、没超提醒线；流量卡正文和详情均无套餐文字。
- 截图与回执：`E:/Cache/Claude/Temp/3a29b59f/gpt-children/20261115-180037-site-remove-package-ef301698/round-01/traffic-live.jpg`、同目录 `browser-receipt.json`。
- 驾驶舱及旧运行件 Node 回归 163/163 通过；Python 驾驶舱回归 26/27 通过，唯一 G4 失败已在基线 83598046 的原始渲染文件上复现，未改无关功能。
- Astro 原生驾驶舱三页构建及 167 个引用资源组装通过。独立构建时补入共享主检出已有的站点触控图标；未改图标来源。
- `npm run build` 被既有规则页生成器固定读取已不存在的 `E:/.agents/releases/E430/AGENTS.md` 阻塞。全站 `npm run test:built` 为 233/241 通过、8 项因完整站点产物缺失失败，尚不能核为仅剩约定的两项红测。

本轮只在任务分支提交，未合并、推送或发布。整站构建依赖及完整回归由主持接续处理；本页不表示新版网站已经上线。
