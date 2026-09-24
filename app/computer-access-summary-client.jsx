import { startInitialStatusRead } from "./computer-access-bootstrap.js";
const island = document.querySelector("[data-access-summary]");
if (island) {
  const initialRead = startInitialStatusRead();
  import("./computer-access-summary-hydrate.jsx").then(module => module.mountAccessSummary(initialRead)).catch(() => {
    initialRead?.cancel();
    const state = island.querySelector(".ca-read-status");
    if (state) { state.dataset.busy = "false"; state.textContent = "状态组件加载失败"; }
  });
}
