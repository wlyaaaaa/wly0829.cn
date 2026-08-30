import "../app/style.css";
import { searchCompactEntries } from "../app/compact-search.js";

const searchIndexElement = document.getElementById("search-index");
const searchEntries = searchIndexElement
  ? JSON.parse(searchIndexElement.textContent || "[]")
  : [];
const preservedScrollKey = "wly-route-scroll-v1";

function restorePreservedScroll() {
  let record = null;
  try {
    record = JSON.parse(window.sessionStorage.getItem(preservedScrollKey) || "null");
    window.sessionStorage.removeItem(preservedScrollKey);
  } catch {
    return;
  }
  const currentTarget = `${window.location.pathname}${window.location.search}`;
  if (!record || record.target !== currentTarget || !Number.isFinite(record.scrollY) || !Number.isFinite(record.createdAt) || Date.now() - record.createdAt > 15000) return;
  const priorScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";
  window.scrollTo({ top: record.scrollY, behavior: "instant" });
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: record.scrollY, behavior: "instant" });
    window.requestAnimationFrame(() => { window.history.scrollRestoration = priorScrollRestoration; });
  });
}

function initializePreservedScrollNavigation() {
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest?.("a[data-preserve-scroll='true']");
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || anchor.target) return;
    const target = new URL(anchor.href, window.location.href);
    if (target.origin !== window.location.origin) return;
    try {
      window.sessionStorage.setItem(preservedScrollKey, JSON.stringify({
        target: `${target.pathname}${target.search}`,
        scrollY: window.scrollY,
        createdAt: Date.now()
      }));
    } catch {
      // Native navigation remains correct when storage is unavailable.
    }
  }, { capture: true });
}

restorePreservedScroll();

function initializeSearch(container) {
  const input = container.querySelector("input");
  if (!input) return;
  const resultId = input.getAttribute("aria-controls") || `search-results-${Math.random().toString(36).slice(2)}`;

  function closeResults() {
    container.querySelector(".global-search-results")?.remove();
    input.setAttribute("aria-expanded", "false");
  }

  function renderResults() {
    closeResults();
    const query = input.value.trim();
    if (!query) return;
    const results = searchCompactEntries(searchEntries, query);
    const panel = document.createElement("div");
    panel.className = "global-search-results";
    panel.id = resultId;
    panel.setAttribute("aria-label", "全站搜索结果");

    const status = document.createElement("p");
    status.setAttribute("aria-live", "polite");
    status.textContent = results.length > 9 ? `找到 ${results.length} 项，显示前 9 项` : `找到 ${results.length} 项`;
    panel.append(status);

    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "global-search-empty";
      empty.textContent = "没有匹配结果。可以直接搜索“委派”“录音”“仓库”或“加密”。";
      panel.append(empty);
    } else {
      for (const entry of results.slice(0, 9)) {
        const link = document.createElement("a");
        link.href = entry.href;
        const type = document.createElement("span");
        type.textContent = entry.type;
        const copy = document.createElement("span");
        const title = document.createElement("strong");
        title.textContent = entry.title;
        const detail = document.createElement("small");
        detail.textContent = entry.detail;
        copy.append(title, detail);
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        link.append(type, copy, arrow);
        panel.append(link);
      }
    }
    container.append(panel);
    input.setAttribute("aria-expanded", "true");
  }

  input.addEventListener("input", renderResults);
  input.addEventListener("focus", renderResults);
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeResults();
    input.blur();
  });
  container.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!container.contains(document.activeElement)) closeResults();
    }, 0);
  });
}

function initializeHeader() {
  const searchButton = document.querySelector(".mobile-search-button");
  const menuButton = document.querySelector(".menu-button");
  const searchPanelElement = document.getElementById("mobile-site-search");
  const navigation = document.getElementById("site-navigation");
  const backdrop = document.querySelector(".menu-backdrop");
  if (!searchButton || !menuButton || !searchPanelElement || !navigation || !backdrop) return;
  let openSurface = null;

  function setOpen(surface, returnFocus = false) {
    const prior = openSurface;
    openSurface = surface;
    const menuOpen = surface === "menu";
    const searchOpen = surface === "search";
    navigation.classList.toggle("is-open", menuOpen);
    searchPanelElement.classList.toggle("is-open", searchOpen);
    searchPanelElement.hidden = !searchOpen;
    backdrop.hidden = !menuOpen && !searchOpen;
    menuButton.setAttribute("aria-expanded", String(menuOpen));
    searchButton.setAttribute("aria-expanded", String(searchOpen));
    menuButton.setAttribute("aria-label", menuOpen ? "关闭外部链接" : "打开外部链接");
    searchButton.setAttribute("aria-label", searchOpen ? "关闭搜索" : "打开搜索");
    if (searchOpen) window.requestAnimationFrame(() => searchPanelElement.querySelector("input")?.focus());
    if (returnFocus && prior) (prior === "search" ? searchButton : menuButton).focus();
  }

  searchButton.addEventListener("click", () => setOpen(openSurface === "search" ? null : "search"));
  menuButton.addEventListener("click", () => setOpen(openSurface === "menu" ? null : "menu"));
  backdrop.addEventListener("click", () => setOpen(null));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && openSurface) setOpen(null, true);
  });
}

function initializeRulesWorkbench() {
  const tabs = Array.from(document.querySelectorAll(".rule-selector-list [role='tab']"));
  const panels = Array.from(document.querySelectorAll("[data-rule-panel]"));
  const select = document.querySelector(".rule-mobile-select select");
  if (!tabs.length || !panels.length) return;
  const ids = tabs.map((tab) => tab.id.replace(/^rule-tab-/, ""));

  function activate(logicalId, { updateUrl = false, focus = false } = {}) {
    const selectedId = ids.includes(logicalId) ? logicalId : ids[0];
    for (const tab of tabs) {
      const active = tab.id === `rule-tab-${selectedId}`;
      tab.classList.toggle("is-selected", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    }
    for (const panel of panels) panel.hidden = panel.dataset.rulePanel !== selectedId;
    if (select) select.value = selectedId;
    if (updateUrl) {
      const next = new URL(window.location.href);
      next.pathname = "/rules/";
      next.searchParams.set("rule", selectedId);
      window.history.pushState({}, "", `${next.pathname}${next.search}`);
    }
  }

  for (const [index, tab] of tabs.entries()) {
    const logicalId = ids[index];
    tab.addEventListener("click", () => activate(logicalId, { updateUrl: true }));
    tab.addEventListener("keydown", (event) => {
      const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      activate(ids[nextIndex], { updateUrl: true, focus: true });
    });
  }
  select?.addEventListener("change", () => activate(select.value, { updateUrl: true }));
  window.addEventListener("popstate", () => activate(new URLSearchParams(window.location.search).get("rule")));
  activate(new URLSearchParams(window.location.search).get("rule"));
}

function createButton(className, label, text) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", label);
  button.textContent = text;
  return button;
}

function initializeGallery(gallery) {
  const cards = Array.from(gallery.querySelectorAll(".project-gallery-card[data-gallery-src]"));
  if (!cards.length) return;
  const images = cards.map((card) => ({
    src: card.dataset.gallerySrc,
    alt: card.dataset.galleryAlt,
    caption: card.dataset.galleryCaption,
    evidenceLevel: card.dataset.galleryEvidenceLevel,
    evidenceLabel: card.dataset.galleryEvidenceLabel,
    proves: card.dataset.galleryProves,
    doesNotProve: card.dataset.galleryDoesNotProve
  }));
  let activeIndex = 0;
  let zoom = 1;
  let fitSize = null;
  let returnFocus = null;
  let previousOverflow = "";
  let resizeObserver = null;

  const overlay = document.createElement("div");
  overlay.className = "project-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "project-lightbox-title");
  const dialog = document.createElement("div");
  dialog.className = "project-lightbox-dialog";
  const heading = document.createElement("h2");
  heading.className = "visually-hidden";
  heading.id = "project-lightbox-title";
  const toolbar = document.createElement("div");
  toolbar.className = "project-lightbox-toolbar";
  const count = document.createElement("span");
  const live = document.createElement("span");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  const zoomControls = document.createElement("div");
  zoomControls.className = "project-lightbox-zoom-controls";
  zoomControls.setAttribute("role", "group");
  zoomControls.setAttribute("aria-label", "大图缩放");
  const zoomOut = createButton("", "缩小大图", "−");
  const zoomReset = createButton("project-lightbox-zoom-reset", "恢复适合窗口大小", "100%");
  const zoomIn = createButton("", "放大大图", "+");
  zoomControls.append(zoomOut, zoomReset, zoomIn);
  const closeButton = createButton("project-lightbox-close", "关闭大图", "× 关闭");
  toolbar.append(count, live, zoomControls, closeButton);

  const stage = document.createElement("div");
  stage.className = "project-lightbox-stage";
  const previousButton = createButton("project-lightbox-previous", "上一张", "←");
  const nextButton = createButton("project-lightbox-next", "下一张", "→");
  const figure = document.createElement("figure");
  const viewport = document.createElement("div");
  viewport.className = "project-lightbox-viewport";
  viewport.tabIndex = 0;
  const canvas = document.createElement("div");
  canvas.className = "project-lightbox-image-canvas";
  const image = document.createElement("img");
  image.className = "project-lightbox-image";
  canvas.append(image);
  viewport.append(canvas);
  const caption = document.createElement("figcaption");
  caption.className = "project-lightbox-caption";
  figure.append(viewport, caption);
  stage.append(previousButton, figure, nextButton);
  dialog.append(heading, toolbar, stage);
  overlay.append(dialog);

  function measureFit() {
    if (!image.naturalWidth || !image.naturalHeight || !viewport.clientWidth || !viewport.clientHeight) return;
    const scale = Math.min(viewport.clientWidth / image.naturalWidth, viewport.clientHeight / image.naturalHeight);
    fitSize = {
      width: Math.max(1, Math.floor(image.naturalWidth * scale)),
      height: Math.max(1, Math.floor(image.naturalHeight * scale)),
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      viewportWidth: viewport.clientWidth,
      viewportHeight: viewport.clientHeight
    };
    renderZoom();
  }

  function renderZoom() {
    zoom = Math.min(4, Math.max(1, Number(zoom.toFixed(1))));
    viewport.dataset.zoom = String(zoom);
    viewport.setAttribute("aria-label", zoom > 1 ? "已放大的图片区域；使用方向键或滚动条查看细节" : "完整图片区域");
    zoomOut.disabled = zoom <= 1;
    zoomIn.disabled = zoom >= 4;
    zoomReset.textContent = `${Math.round(zoom * 100)}%`;
    if (!fitSize) return;
    dialog.dataset.imageOrientation = fitSize.naturalWidth > fitSize.naturalHeight ? "landscape" : "portrait";
    dialog.dataset.zoom = String(zoom);
    const width = Math.max(1, Math.round(fitSize.width * zoom));
    const height = Math.max(1, Math.round(fitSize.height * zoom));
    canvas.style.width = `${zoom === 1 ? width : Math.max(fitSize.viewportWidth, width)}px`;
    canvas.style.height = `${zoom === 1 ? height : Math.max(fitSize.viewportHeight, height)}px`;
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
  }

  function resetZoom() {
    zoom = 1;
    viewport.scrollTo({ top: 0, left: 0 });
    renderZoom();
  }

  function renderCaption(item) {
    caption.replaceChildren();
    if (item.evidenceLevel) {
      const evidence = document.createElement("strong");
      evidence.textContent = `${item.evidenceLevel} · ${item.evidenceLabel}`;
      caption.append(evidence);
    }
    const copy = document.createElement("span");
    copy.textContent = item.caption;
    caption.append(copy);
    for (const [label, value] of [["能证明：", item.proves], ["不能证明：", item.doesNotProve]]) {
      if (!value) continue;
      const row = document.createElement("small");
      const strong = document.createElement("b");
      strong.textContent = label;
      row.append(strong, document.createTextNode(value));
      caption.append(row);
    }
  }

  function showImage(index) {
    activeIndex = (index + images.length) % images.length;
    const item = images[activeIndex];
    zoom = 1;
    fitSize = null;
    delete dialog.dataset.imageOrientation;
    dialog.dataset.zoom = "1";
    canvas.removeAttribute("style");
    image.removeAttribute("style");
    image.src = item.src;
    image.alt = item.alt;
    heading.textContent = `图片查看器：${item.alt}`;
    count.textContent = `${activeIndex + 1} / ${images.length}`;
    live.textContent = `第 ${activeIndex + 1} 张，共 ${images.length} 张：${item.alt}`;
    renderCaption(item);
    resetZoom();
    if (image.complete) window.requestAnimationFrame(measureFit);
  }

  function close() {
    if (!overlay.isConnected) return;
    resizeObserver?.disconnect();
    resizeObserver = null;
    overlay.remove();
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => returnFocus?.focus());
  }

  function handleKeyDown(event) {
    if (event.key === "Tab") {
      const controls = Array.from(overlay.querySelectorAll("button:not([disabled]), [tabindex='0']"));
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    } else if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft" && !(zoom > 1 && viewport.contains(document.activeElement))) showImage(activeIndex - 1);
    else if (event.key === "ArrowRight" && !(zoom > 1 && viewport.contains(document.activeElement))) showImage(activeIndex + 1);
    else if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "+" || event.key === "=")) {
      event.preventDefault();
      zoom += 0.5;
      renderZoom();
    } else if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "-" || event.key === "_")) {
      event.preventDefault();
      zoom -= 0.5;
      renderZoom();
    } else if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === "0") {
      event.preventDefault();
      resetZoom();
    }
  }

  function open(index, trigger) {
    returnFocus = trigger;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.append(overlay);
    showImage(index);
    document.addEventListener("keydown", handleKeyDown);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measureFit);
      resizeObserver.observe(viewport);
    }
    closeButton.focus();
  }

  image.addEventListener("load", measureFit);
  image.addEventListener("dblclick", () => {
    if (zoom === 1) {
      zoom = 2;
      renderZoom();
    } else resetZoom();
  });
  zoomOut.addEventListener("click", () => { zoom -= 0.5; renderZoom(); });
  zoomIn.addEventListener("click", () => { zoom += 0.5; renderZoom(); });
  zoomReset.addEventListener("click", resetZoom);
  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));
  overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) close(); });
  cards.forEach((card, index) => card.addEventListener("click", () => open(index, card)));
}

function initializeFlowField() {
  const canvas = document.querySelector(".flow-field");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!canvas || !context) return;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;
  let previous = 0;
  let pageHidden = document.hidden;

  function curveY(x, base, phase, amplitude) {
    return base
      + Math.sin(x * 0.00175 + phase) * amplitude
      + Math.sin(x * 0.00062 - phase * 0.67) * amplitude * 0.52
      + Math.sin(x * 0.0031 + phase * 0.31) * amplitude * 0.12;
  }

  function draw(now, force = false) {
    if (pageHidden && !force) return;
    if (!force && now - previous < 40) {
      frame = window.requestAnimationFrame(draw);
      return;
    }
    previous = now;
    context.clearRect(0, 0, width, height);
    const time = reducedMotion ? 0 : now / 1000;
    const lineCount = width < 700 ? 24 : 38;
    const fieldHeight = height + 260;
    const verticalDrift = reducedMotion ? 0 : time * 13;
    const amplitude = width < 700 ? 22 : 38;
    const step = width < 700 ? 9 : 12;
    for (let index = 0; index < lineCount; index += 1) {
      const row = (fieldHeight * index) / Math.max(lineCount - 1, 1);
      const base = -130 + ((row + verticalDrift) % fieldHeight);
      const phase = time * 0.16 + index * 0.025;
      const accent = index % 9 === 4;
      context.beginPath();
      for (let x = -80; x <= width + 80; x += step) {
        const y = curveY(x, base, phase, amplitude);
        if (x === -80) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = accent ? "rgba(0, 164, 73, 0.30)" : "rgba(0, 118, 53, 0.12)";
      context.lineWidth = accent ? 1.15 : 0.72;
      context.stroke();
    }
    if (!force && !reducedMotion && !pageHidden) frame = window.requestAnimationFrame(draw);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(performance.now(), true);
  }

  function handleVisibility() {
    pageHidden = document.hidden;
    window.cancelAnimationFrame(frame);
    if (!pageHidden) frame = window.requestAnimationFrame(draw);
  }

  function handleMotion(event) {
    reducedMotion = event.matches;
    window.cancelAnimationFrame(frame);
    draw(performance.now(), true);
    if (!reducedMotion && !pageHidden) frame = window.requestAnimationFrame(draw);
  }

  resize();
  if (!reducedMotion) frame = window.requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", handleVisibility);
  motionQuery.addEventListener?.("change", handleMotion);
}

function initializeDocumentPrefetch() {
  const prefetched = new Set(Array.from(document.querySelectorAll("link[rel='prefetch'][as='document']"), (link) => link.href));
  function prefetchAnchor(anchor) {
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
    const target = new URL(anchor.href, window.location.href);
    if (target.origin !== window.location.origin || target.href === window.location.href || prefetched.has(target.href)) return;
    if (/\.[a-z0-9]{2,8}$/i.test(target.pathname)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = `${target.pathname}${target.search}`;
    document.head.append(link);
    prefetched.add(target.href);
  }
  document.addEventListener("pointerover", (event) => prefetchAnchor(event.target.closest?.("a[href]")), { passive: true });
  document.addEventListener("focusin", (event) => prefetchAnchor(event.target.closest?.("a[href]")));
}

function centerCurrentProjectNavigation() {
  if (window.innerWidth > 900) return;
  const navigation = document.querySelector(".project-navigation");
  const selected = navigation?.querySelector("a[aria-current='page']");
  if (!navigation || !selected) return;
  navigation.scrollLeft = Math.max(0, selected.offsetLeft - (navigation.clientWidth - selected.clientWidth) / 2);
}

document.documentElement.dataset.enhanced = "true";
document.querySelectorAll(".global-search").forEach(initializeSearch);
document.querySelectorAll(".project-gallery").forEach(initializeGallery);
initializeHeader();
initializeRulesWorkbench();
initializeFlowField();
initializeDocumentPrefetch();
initializePreservedScrollNavigation();
centerCurrentProjectNavigation();
