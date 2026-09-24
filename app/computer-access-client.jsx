import { startInitialStatusRead } from "./computer-access-bootstrap.js";

const island = document.querySelector("[data-computer-access]");
if (island) {
  const initialRead = startInitialStatusRead();
  import("./computer-access-hydrate.jsx").then(module => module.mountComputerAccess(initialRead)).catch(() => {
    initialRead?.cancel();
    const state = island.querySelector(".ca-read-status");
    if (state) { state.dataset.busy = "false"; state.textContent = "状态组件加载失败"; }
    const notice = document.createElement("p");
    notice.setAttribute("role", "alert");
    notice.textContent = "页面组件暂未加载，请重新加载后查询。已有授权不会因此改变。";
    island.prepend(notice);
  });
}
