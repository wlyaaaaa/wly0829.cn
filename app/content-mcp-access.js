// Public connection addresses only. Credentials stay in the client and the
// computer's existing credential store; this page never contacts either PC.
export const mcpDevices = [
  {
    id: "main",
    name: "主机",
    label: "桌面电脑",
    endpoint: "https://mcp.wly0829.cn/mcp",
    summary: "连接主机上的文件、命令和桌面工具。",
    permissionNote: "已授权普通操作、管理员与 SYSTEM 维护，均有实际调用验收。",
    verifiedAt: "2026-09-11T08:54:47Z",
    verifiedLabel: "2026-09-11 16:54（北京时间）",
    evidence: "ChatGPT 在新域名完成 OAuth 授权，普通命令返回主机 WLY；17:15–17:16（北京时间）管理员与 SYSTEM 维护均返回正确 Windows 身份、退出码 0，令牌自动刷新返回 200。此前通用 MCP 客户端的 20 次只读命令全部成功，本轮耗时 0.70–0.77 秒；未认证请求返回 401。",
    transport: "Cloudflare Named Tunnel，自有域名入口；原电脑凭据保持不变。"
  },
  {
    id: "secondary",
    name: "副机",
    label: "笔记本电脑",
    endpoint: "https://laptop-e48n0drj.tailbe620b.ts.net/computer/mcp",
    summary: "独立连接副机，使用它自己的文件与工具。",
    permissionNote: "独立授权；普通操作、管理员与 SYSTEM 维护均已验收。",
    verifiedAt: "2026-09-11T03:28:08Z",
    verifiedLabel: "2026-09-11 11:28（北京时间）",
    evidence: "ChatGPT 普通命令调用 8/8 成功，SYSTEM 维护返回退出码 0。17:49（北京时间）通用 MCP 客户端使用副机原凭据完成管理员与 SYSTEM 调用，两次均返回副机身份与退出码 0。",
    transport: "Tailscale Funnel，保留独立入口。"
  }
];

export const mcpMainFallback = {
  name: "主机",
  label: "经副机的备用连接",
  endpoint: "https://laptop-e48n0drj.tailbe620b.ts.net/main-computer/mcp",
  fallback: true,
  verifiedAt: "2026-09-11T09:44:42Z",
  verifiedLabel: "2026-09-11 17:44（北京时间）",
  evidence: "主动停止主机 Cloudflare 隧道，主入口实际返回 530 / Tunnel 错误 1033。通用客户端强制连接副机公网入口，普通命令 3/3 成功；随后另轮验收以管理员回读主机停止状态，再以 SYSTEM 成功启动 Cloudflare，主入口恢复。副机自己的 Codex 也完成独立 OAuth 和全新任务验收，返回主机 WLY 与 SYSTEM 身份。日常 ChatGPT 保留主、副两个插件，备用地址按需接入。"
};

export function mcpSetupNote(device) {
  return [
    `请帮我配置这台电脑的远程 MCP 连接：${device.name}（${device.label}）。`,
    `服务地址：${device.endpoint}`,
    "连接方式：远程 MCP，Streamable HTTP（流式 HTTP）。",
    "先确认当前应用支持远程 MCP，或具备配置和调用 MCP 的工具能力；如果不支持，请明确说明。",
    "认证必需：使用我已配置的有效凭据，或引导我在专用认证设置中完成配置；不要要求我把密钥贴到普通聊天里。OAuth 仅适用于服务端已登记的客户端，支持 Bearer 认证的客户端可使用已有兼容方式。",
    ...(device.fallback ? ["这是主机的备用入口，经副机转接，实际执行目标仍是主机，使用主机原有凭据与权限。仅在确认主入口连接故障后切换；认证失败应先检查授权，结果未知的操作应先核实，不能自动重试。两台电脑都需开机联网。"] : []),
    "连接后列出可用工具，完成一次只读连通性检查，并确认返回的是上述电脑。"
  ].join("\n");
}
