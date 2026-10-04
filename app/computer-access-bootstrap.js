// Start the same bounded read while the React island downloads. Never persist authority.
import { freshStatus } from './computer-access-model.js';
export function startInitialStatusRead() {
  const host = "https://mcp.wly0829.cn";
  const allowed = window.location.origin === host || window.location.origin === "https://wly0829.cn";
  let initialRead = null;
  if (allowed && !document.hidden) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const promise = fetch(`${host}/computer-access/api/status`, { credentials: "include", cache: "no-store", signal: controller.signal })
      .then(async response => {
        let data;
        try { data = await response.json(); } catch {}
        if (!response.ok || !data || data.status === "error" || !freshStatus(data)) {
          const error = new Error("initial_status_unavailable");
          error.httpStatus = response.status;
          throw error;
        }
        return data;
      })
      .finally(() => clearTimeout(timer));
    promise.catch(() => {}); // Hydration may finish after a network rejection.
    initialRead = { promise, started: performance.now(), cancel: () => controller.abort() };
  }
  return initialRead;
}
