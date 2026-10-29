// 构建时读一份最新数据画首帧（驾驶舱和二级页“AI 的账本”共用）：两个入口都返回精简视图；格式不符时换下一个，最后用仓库里的上一份。
import fallback from './snapshot.json';
import { normalize } from './model.js';

export const ENDPOINTS = ['https://live.wly0829.cn/computer-access/state?view=cockpit', 'https://mcp.wly0829.cn/computer-access/api/status?view=cockpit'];
export const LOCAL = ['/__status?view=cockpit'];
export async function latest() {
  for (const url of ENDPOINTS) {
    try {
      const r = await fetch(url, { headers: { Origin: 'https://wly0829.cn' }, signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      const v = await r.json();
      if (normalize(v).ok) return v;
    } catch { /* 用下一个，最后用仓库里的上一份 */ }
  }
  return fallback;
}
export const safe = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
