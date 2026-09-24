import React from "react";
import { hydrateRoot } from "react-dom/client";
import ComputerAccess from "./computer-access.jsx";
import { isHostOrigin } from "./computer-access-model.js";

if (isHostOrigin(window.location.origin)) {
  function officialLink(link) {
    if (!link) return;
    const href = link.getAttribute("href");
    if (href?.startsWith("/")) link.href = new URL(href, "https://wly0829.cn").href;
  }
  for (const link of document.querySelectorAll('a[href^="/"]')) if (!link.closest("[data-computer-access]")) officialLink(link);
  // Search suggestions are created after load; their destinations stay on the website.
  document.addEventListener("click", event => officialLink(event.target.closest("a")), true);
  document.addEventListener("submit", event => {
    if (!event.target.matches('form[role="search"]')) return;
    event.preventDefault();
    const url = new URL("/search/", "https://wly0829.cn");
    url.search = new URLSearchParams(new FormData(event.target)).toString();
    window.location.assign(url.href);
  }, true);
}

const island = document.querySelector("[data-computer-access]");
class AccessPageBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="ca-page" role="alert"><h1>页面暂时无法显示最新状态</h1><p>已有授权不会因此改变。请重新加载后查询原请求，不要重复提交验证码。</p><button type="button" onClick={() => window.location.reload()}>重新加载并查询</button></section>;
    return this.props.children;
  }
}
if (island) hydrateRoot(island, <AccessPageBoundary><ComputerAccess /></AccessPageBoundary>);
