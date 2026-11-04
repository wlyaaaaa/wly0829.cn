// 构建只用仓库里的固定公开样本画首帧；驾驶舱和“AI 的账本”一致，实时端点仅供浏览器读取。
import fallback from './snapshot.json';

export const ENDPOINTS = ['https://live.wly0829.cn/computer-access/state?view=cockpit', 'https://mcp.wly0829.cn/computer-access/api/status?view=cockpit'];
export const LOCAL = ['/__status?view=cockpit'];
export async function latest() {
  return fallback;
}
export const safe = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
