// Public connection addresses only. Credentials stay in the client and the
// computer's existing credential store; this page never contacts either PC.
export const mcpDevices = [
  {
    id: "main",
    name: "主机",
    label: "桌面电脑",
    endpoint: "https://mcp.wly0829.cn/mcp",
    summary: "连接主机上的文件、命令和桌面工具。",
    permissionNote: "日常操作按客户端授权执行。维护权限单独开放。",
    verifiedAt: "2026-09-11T05:43:11Z",
    verifiedLabel: "2026-09-11 13:43（北京时间）",
    evidence: "自有域名入口已通过通用 MCP 客户端验收：20 次只读命令调用全部成功，返回主机身份；本轮单次耗时 0.70–0.77 秒。未认证请求返回 401。ChatGPT 在旧入口已完成验收，新入口正在重新授权。",
    transport: "Cloudflare Named Tunnel，自有域名入口；原电脑凭据保持不变。"
  },
  {
    id: "secondary",
    name: "副机",
    label: "笔记本电脑",
    endpoint: "https://laptop-e48n0drj.tailbe620b.ts.net/computer/mcp",
    summary: "独立连接副机，使用它自己的文件与工具。",
    permissionNote: "拥有独立授权；当前 ChatGPT 也已通过维护调用验收。",
    verifiedAt: "2026-09-11T03:28:08Z",
    verifiedLabel: "2026-09-11 11:28（北京时间）",
    evidence: "ChatGPT 普通命令调用 8/8 成功；SYSTEM 维护调用成功，返回退出码 0。",
    transport: "Tailscale Funnel，保留独立入口。"
  }
];

export function mcpSetupNote(device) {
  return [
    `请帮我配置这台电脑的远程 MCP 连接：${device.name}（${device.label}）。`,
    `服务地址：${device.endpoint}`,
    "连接方式：远程 MCP，Streamable HTTP（流式 HTTP）。",
    "先确认当前应用支持远程 MCP，或具备配置和调用 MCP 的工具能力；如果不支持，请明确说明。",
    "认证必需：使用我已配置的有效凭据，或引导我在专用认证设置中完成配置；不要要求我把密钥贴到普通聊天里。OAuth 仅适用于服务端已登记的客户端，支持 Bearer 认证的客户端可使用已有兼容方式。",
    "连接后列出可用工具，完成一次只读连通性检查，并确认返回的是上述电脑。"
  ].join("\n");
}
