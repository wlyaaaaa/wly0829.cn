实时状态先读 `https://live.wly0829.cn/computer-access/state`，失败回退原 Cloudflare 地址；原同名路径直接导航报 `ERR_BLOCKED_BY_CLIENT`，页面内 Fetch 已验证，网页与图片维持原托管。
`edge/edgeone/edge-functions/[[path]].js` 只转发此接口，其他路径 404；回源 6 秒超时、不缓存，仅对正式站两种 HTTPS 来源开放跨域读取。
部署：压缩 `edge/edgeone/` 的内容为 ZIP，在 EdgeOne 项目 `makers-lrgrecs7uvjl` 的“新建部署”上传，选择生产；这是接口包，不上传网站或图片。
域名：生产关联 `live.wly0829.cn`，Cloudflare CNAME 仅 DNS，并按控制台添加归属 TXT、申请免费 HTTPS；`eo-test` 保留供试验。
撤回：网站回退本次提交，EdgeOne 回滚到上一生产部署；只删除本轮 `live` 的域名绑定及 CNAME/TXT，保留原记录与 `eo-test`。
