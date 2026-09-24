import "../app/style.css";
import "../app/computer-access-header.css";
import "../app/personal-media-gallery.css";
import { searchCompactEntries, searchResultExcerpt } from "../app/compact-search.js";
import "../app/continuation-brief.css";
import { initializeContinuationBriefs } from "../app/continuation-brief.js";

if (document.querySelector("[data-computer-access]")) import("../app/computer-access-client.jsx");

const searchEntries = [
  ...(Array.isArray(window.__WLY_SEARCH_INDEX__) ? window.__WLY_SEARCH_INDEX__ : []),
  ...(Array.isArray(window.__WLY_PROJECT_SEARCH_INDEX__) ? window.__WLY_PROJECT_SEARCH_INDEX__ : [])
];
function initializeSearch(container) {
  const input = container.querySelector("input");
  const scopeSelect = container.querySelector(".search-scope-select");
  if (!input) return;
  const resultId = input.getAttribute("aria-controls") || `search-results-${Math.random().toString(36).slice(2)}`;
  input.removeAttribute("aria-controls");
  let suppressNextFocusOpen = false;
  const liveStatus = document.createElement("span");
  liveStatus.className = "visually-hidden search-live-status";
  liveStatus.setAttribute("role", "status");
  liveStatus.setAttribute("aria-live", "polite");
  liveStatus.setAttribute("aria-atomic", "true");
  container.append(liveStatus);

  function closeResults() {
    container.querySelector(".global-search-results")?.remove();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-controls");
  }

  function scopeInfo() {
    const option = scopeSelect?.selectedOptions?.[0];
    return {
      id: scopeSelect?.value || "all",
      label: option?.textContent || "全站",
      placeholder: option?.dataset.searchPlaceholder || "搜索项目、系统、规则或 Skills",
      help: option?.dataset.searchHelp || "可以输入准确名称，也可以直接描述你想解决的问题",
      examples: option?.dataset.searchExamples || "恢复电脑 · 什么时候需要授权 · 找录音"
    };
  }

  function addResultKeyboardNavigation(panel) {
    panel.addEventListener("keydown", (event) => {
      const links = Array.from(panel.querySelectorAll("a[href]"));
      const currentIndex = links.indexOf(document.activeElement);
      if (event.key === "Escape") {
        event.preventDefault();
        closeResults();
        suppressNextFocusOpen = true;
        input.focus();
        return;
      }
      if (!links.length || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % links.length;
      if (event.key === "ArrowUp") nextIndex = currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = links.length - 1;
      links[nextIndex]?.focus();
    });
  }

  function renderResults() {
    closeResults();
    const query = input.value.trim();
    const scope = scopeInfo();
    const usesPartialAllIndex = container.dataset.searchPath !== "/search" && scope.id === "all";
    input.placeholder = scope.placeholder;
    input.setAttribute("aria-label", `在${scope.label}范围搜索关键词`);
    const results = query ? searchCompactEntries(searchEntries, query, scope.id) : [];
    const panel = document.createElement("div");
    panel.className = "global-search-results";
    panel.id = resultId;
    panel.setAttribute("aria-label", `${scope.label}搜索结果`);

    if (!query) {
      const help = document.createElement("div");
      help.className = "global-search-help";
      const strong = document.createElement("strong");
      strong.textContent = scope.help;
      const examples = document.createElement("span");
      examples.textContent = `试试：${scope.examples}`;
      help.append(strong, examples);
      panel.append(help);
      addResultKeyboardNavigation(panel);
      container.append(panel);
      input.setAttribute("aria-expanded", "true");
      input.setAttribute("aria-controls", resultId);
      liveStatus.textContent = `${scope.label}搜索提示已展开`;
      return;
    }

    const status = document.createElement("p");
    status.textContent = usesPartialAllIndex
      ? (results.length ? `显示最相关的前 ${Math.min(results.length, 9)} 项` : "快速结果未命中")
      : (results.length > 9 ? `找到 ${results.length} 项，显示前 9 项` : `找到 ${results.length} 项`);
    liveStatus.textContent = status.textContent;
    panel.append(status);

    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "global-search-empty";
      empty.textContent = usesPartialAllIndex
        ? "快速结果没有命中；完整搜索还会检索项目正文。"
        : "没有匹配结果。可以换成项目用途、现实问题或更短的关键词。";
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
        detail.textContent = searchResultExcerpt(entry, query);
        copy.append(title, detail);
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        link.append(type, copy, arrow);
        panel.append(link);
      }
    }
    if (usesPartialAllIndex || results.length > 9) {
      const allResults = document.createElement("a");
      allResults.className = "global-search-all-results";
      allResults.href = `/search/?q=${encodeURIComponent(query)}&scope=${encodeURIComponent(scope.id)}`;
      allResults.textContent = usesPartialAllIndex ? "查看完整搜索结果 →" : `查看全部 ${results.length} 条结果 →`;
      panel.append(allResults);
    }
    addResultKeyboardNavigation(panel);
    container.append(panel);
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", resultId);
  }

  input.addEventListener("input", renderResults);
  input.addEventListener("focus", () => {
    if (suppressNextFocusOpen) {
      suppressNextFocusOpen = false;
      return;
    }
    renderResults();
  });
  scopeSelect?.addEventListener("change", renderResults);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      container.querySelector(".global-search-results a[href]")?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const links = container.querySelectorAll(".global-search-results a[href]");
      links[links.length - 1]?.focus();
    } else if (event.key === "Escape") {
      closeResults();
      input.blur();
    }
  });
  container.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!container.contains(document.activeElement)) closeResults();
    }, 0);
  });
}

function searchScopePresentation(scope) {
  if (scope === "project") return { label: "项目", placeholder: "搜索项目名、用途、模块或直接描述问题", help: "结果只落到项目" };
  if (scope === "system") return { label: "系统", placeholder: "搜索责任、关系或使用入口", help: "搜索系统责任与真实关系" };
  if (scope === "rules") return { label: "规则", placeholder: "搜索规则或直接描述约束问题", help: "搜索全部现行规则" };
  if (scope === "skills") return { label: "Skills", placeholder: "搜索 Skill 名称或直接描述要解决的问题", help: "搜索全部 Skills" };
  if (scope.startsWith("project:")) {
    const slug = scope.slice("project:".length);
    const projectEntry = searchEntries.find((entry) => entry.type === "项目" && entry.projectSlug === slug);
    const label = projectEntry?.title?.replace(/\s*·\s*总览$/, "") || slug;
    return { label, placeholder: `搜索 ${label} 的总览、模块或问题`, help: `只搜索 ${label}` };
  }
  return { label: "全站", placeholder: "搜索项目、系统、规则或 Skills", help: "搜索全部公开内容" };
}

function initializeHomeSearchDock() {
  const home = document.getElementById("home-search");
  const dock = document.querySelector(".home-search-dock");
  const search = home?.querySelector(".global-search");
  if (!home || !dock || !search) return;
  const header = document.querySelector(".site-header");
  const mobile = document.getElementById("mobile-site-search");
  const shortcut = dock.querySelector("a");
  const mobileButton = document.querySelector(".mobile-search-button");
  const update = () => {
    const desktop = getComputedStyle(dock).display !== "none";
    const above = home.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom;
    const target = desktop ? (above ? dock : home) : (mobile.hidden ? home : mobile);
    if (search.parentElement === target) return;
    const focused = search.contains(document.activeElement) ? document.activeElement : null;
    search.classList.toggle("desktop-search", target === dock);
    search.classList.toggle("mobile-search-control", target === mobile);
    target.append(search);
    shortcut.hidden = target === dock;
    if (focused) (target === home && above && !desktop ? mobileButton : focused).focus({ preventScroll: true });
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  document.addEventListener("header-search-change", update);
  update();
}

function normalizedSearchScope(value) {
  if (["all", "project", "system", "rules", "skills"].includes(value)) return value;
  if (value?.startsWith("project:")) {
    const slug = value.slice("project:".length);
    if (searchEntries.some((entry) => entry.type === "项目" && entry.projectSlug === slug)) return value;
  }
  return "all";
}

function createFullResultLink(entry, query) {
  const link = document.createElement("a");
  link.href = entry.href;
  const type = document.createElement("span");
  type.textContent = entry.type;
  const copy = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = entry.title;
  const detail = document.createElement("small");
  detail.textContent = searchResultExcerpt(entry, query, 140);
  copy.append(title, detail);
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  link.append(type, copy, arrow);
  return link;
}

function initializeSearchResultsPage() {
  const page = document.querySelector(".search-results-page");
  if (!page) return;
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q")?.trim() || "";
  const scope = normalizedSearchScope(params.get("scope") || "all");
  const presentation = searchScopePresentation(scope);
  const results = query ? searchCompactEntries(searchEntries, query, scope) : [];

  const heading = page.querySelector("header h1");
  const intro = page.querySelector("header p:last-child");
  if (heading) heading.textContent = query ? `“${query}”` : "输入一个名称或问题";
  if (intro) intro.textContent = `当前范围：${presentation.label}。修改查询或范围请直接使用页头唯一的搜索框。`;
  if (query) document.title = `${query}｜搜索｜吴乐阳`;

  page.querySelectorAll(":scope > .search-results-empty, :scope > .search-result-group").forEach((node) => node.remove());
  if (!query || !results.length) {
    const empty = document.createElement("div");
    empty.className = "search-results-empty";
    const strong = document.createElement("strong");
    strong.textContent = query ? "没有匹配结果" : presentation.help;
    const detail = document.createElement("p");
    detail.textContent = query ? "可以换成项目用途、现实问题或更短的关键词。" : "请直接使用页头搜索框。";
    empty.append(strong, detail);
    page.append(empty);
  } else {
      const section = document.createElement("section");
      section.className = "search-result-group";
      section.setAttribute("aria-label", "按相关性排列的搜索结果");
      const header = document.createElement("div");
      const title = document.createElement("h2");
      title.textContent = "找到的内容";
      const count = document.createElement("span");
      count.textContent = `${results.length} 项`;
      header.append(title, count);
      section.append(header, ...results.map((entry) => createFullResultLink(entry, query)));
      page.append(section);
  }

  for (const container of document.querySelectorAll(".global-search")) {
    const input = container.querySelector("input[name='q']");
    const select = container.querySelector("select[name='scope']");
    if (!input || !select) continue;
    let option = Array.from(select.options).find((candidate) => candidate.value === scope);
    if (!option) {
      option = document.createElement("option");
      option.value = scope;
      option.textContent = presentation.label;
      option.dataset.searchPlaceholder = presentation.placeholder;
      option.dataset.searchHelp = presentation.help;
      select.append(option);
    }
    select.value = scope;
    input.value = query;
    input.placeholder = presentation.placeholder;
    input.setAttribute("aria-label", `在${presentation.label}范围搜索关键词`);
    container.dataset.searchScope = scope;
  }
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
    document.dispatchEvent(new Event("header-search-change"));
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
  const links = Array.from(document.querySelectorAll(".rule-selector-list a[id^='rule-tab-']"));
  const panels = Array.from(document.querySelectorAll("[data-rule-panel]"));
  const select = document.querySelector(".rule-mobile-select select");
  const selector = document.querySelector(".rule-selector-panel");
  if (!links.length || !panels.length) return;
  const ids = links.map((link) => link.id.replace(/^rule-tab-/, ""));
  let aliases = {};
  try { aliases = JSON.parse(document.querySelector(".rules-workbench")?.dataset.ruleAliases || "{}"); } catch { /* Missing metadata must not break current-topic navigation. */ }

  function normalizedId(logicalId) {
    const candidate = aliases[logicalId] || logicalId;
    return ids.includes(candidate) ? candidate : ids[0];
  }

  function activate(logicalId, { focus = false, scroll = false } = {}) {
    const selectedId = normalizedId(logicalId);
    for (const link of links) {
      const active = link.id === "rule-tab-" + selectedId;
      link.classList.toggle("is-selected", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
      if (active && focus) link.focus({ preventScroll: true });
    }
    for (const panel of panels) panel.hidden = panel.dataset.rulePanel !== selectedId;
    if (select) select.value = selectedId;
    const selectedLink = document.getElementById("rule-tab-" + selectedId);
    if (selector && selectedLink) window.requestAnimationFrame(() => {
      if (selector.scrollHeight <= selector.clientHeight) return;
      const offset = selectedLink.getBoundingClientRect().top - selector.getBoundingClientRect().top;
      if (offset < 0 || offset + selectedLink.offsetHeight > selector.clientHeight) {
        selector.scrollTop += offset - 12;
      }
    });

    const target = document.getElementById("rule-panel-" + selectedId);
    if (scroll && target) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start" });
      }));
    }
    return selectedId;
  }

  function selectRule(logicalId, { scroll = false } = {}) {
    const selectedId = normalizedId(logicalId);
    const previousY = window.scrollY;
    const destination = new URL(window.location.href);
    destination.searchParams.set("rule", selectedId);
    destination.hash = "rule-panel-" + selectedId;
    if (destination.href !== window.location.href) window.history.pushState(null, "", destination.href);
    activate(selectedId, { scroll });
    if (!scroll) {
      const restore = () => window.scrollTo({ top: Math.min(previousY, Math.max(0, document.documentElement.scrollHeight - window.innerHeight)), behavior: "instant" });
      restore();
      window.requestAnimationFrame(restore);
    }
  }

  const scenarioLinks = Array.from(document.querySelectorAll(".rules-reader-scenario-grid a[href]"));
  for (const link of [...links, ...scenarioLinks]) {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const requested = destination.searchParams.get("rule");
      if (!requested) return;
      event.preventDefault();
      selectRule(requested, { scroll: scenarioLinks.includes(link) });
    });
  }

  links.forEach((link, index) => {
    link.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % links.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + links.length) % links.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = links.length - 1;
      links[nextIndex].focus();
    });
  });

  select?.addEventListener("change", () => {
    selectRule(select.value);
  });

  function activateFromLocation({ initial = false } = {}) {
    const requested = new URLSearchParams(window.location.search).get("rule");
    const selectedId = normalizedId(requested);
    const shouldScroll = initial && window.location.hash === "#rule-panel-" + selectedId;
    activate(selectedId, { scroll: shouldScroll });
  }

  window.addEventListener("popstate", activateFromLocation);
  window.addEventListener("hashchange", activateFromLocation);
  activateFromLocation({ initial: true });
}

function initializeSkillCategories() {
  const rail = document.querySelector(".skill-category-rail");
  const items = Array.from(document.querySelectorAll(".skill-directory-item[data-skill-categories]"));
  if (!rail || !items.length) return;
  const buttons = Array.from(rail.querySelectorAll("button[data-skill-category]"));
  const resultCount = document.querySelector("[data-skill-result-count]");
  function activate(category, focus = false) {
    const selected = buttons.some((button) => button.dataset.skillCategory === category) ? category : "all";
    for (const button of buttons) {
      const active = button.dataset.skillCategory === selected;
      button.classList.toggle("is-current", active);
      button.setAttribute("aria-pressed", String(active));
      if (active && focus) button.focus();
    }
    for (const item of items) item.hidden = selected !== "all" && !String(item.dataset.skillCategories || "").split(/\s+/).includes(selected);
    if (resultCount) resultCount.textContent = selected === "all" ? `${items.length} 项能力` : `当前 ${items.filter((item) => !item.hidden).length} 项 · 共 ${items.length} 项`;
  }
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button.dataset.skillCategory));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;
      activate(buttons[nextIndex].dataset.skillCategory, true);
    });
  });
  activate("all");
}

function initializeProjectReadingLayers() {
  const nav = document.querySelector(".project-reading-nav");
  const panels = Array.from(document.querySelectorAll("[data-project-reading-panel]"));
  if (!nav || !panels.length) return;
  const tabs = Array.from(nav.querySelectorAll("[data-project-reading-tab]"));
  const ids = tabs.map((tab) => tab.dataset.projectReadingTab);
  const legacyLayers = {
    quick: "product", "project-reading-panel-quick": "product",
    product: "product", "module-product": "product",
    technical: "technical", "module-technical": "technical"
  };

  function locationTarget() {
    let hash = window.location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* An invalid hash is not a reading layer. */ }
    const target = document.getElementById(hash);
    const layer = target?.closest("[data-project-reading-panel]")?.dataset.projectReadingPanel
      || legacyLayers[hash] || hash.replace(/^project-reading-panel-/, "");
    return { id: ids.includes(layer) ? layer : "product", target };
  }

  function show(id, { focus = false } = {}) {
    const selected = ids.includes(id) ? id : "product";
    for (const tab of tabs) {
      const active = tab.dataset.projectReadingTab === selected;
      tab.classList.toggle("is-current", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus({ preventScroll: true });
    }
    for (const panel of panels) panel.hidden = panel.dataset.projectReadingPanel !== selected;
    return panels.find((panel) => panel.dataset.projectReadingPanel === selected);
  }

  function reveal(target) {
    if (!target) return;
    ensureOpenAncestors(target);
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function select(id, focus = false) {
    if (panels.some((panel) => panel.dataset.projectReadingPanel === id && !panel.hidden)) {
      if (focus) tabs.find((tab) => tab.dataset.projectReadingTab === id)?.focus({ preventScroll: true });
      return;
    }
    const panel = show(id, { focus });
    const hash = `#${panel.id}`;
    if (window.location.hash !== hash) window.history.pushState({ readingLayer: id }, "", hash);
    reveal(panel);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(tab.dataset.projectReadingTab);
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      select(tabs[nextIndex].dataset.projectReadingTab, true);
    });
  });

  function followLocation() {
    const { id, target } = locationTarget();
    const panel = show(id);
    if (window.location.hash) window.requestAnimationFrame(() => reveal(target || panel));
  }
  window.addEventListener("popstate", followLocation);
  window.addEventListener("hashchange", followLocation);
  window.addEventListener("pageshow", (event) => { if (event.persisted) followLocation(); });
  followLocation();
}

function ensureOpenAncestors(target) {
  for (let disclosure = target?.closest("details"); disclosure; disclosure = disclosure.parentElement?.closest("details")) disclosure.open = true;
}

function initializeSystemHome() {
  const home = document.querySelector(".system-home");
  if (!home) return;
  const tabs = Array.from(home.querySelectorAll("[data-system-scenario-tab]"));
  const panels = Array.from(home.querySelectorAll("[data-system-scenario-panel]"));
  const tabRail = home.querySelector(".system-workflow-tabs");
  const scrollIndicator = home.querySelector("[data-system-workflow-scroll-indicator]");
  const ids = tabs.map((tab) => tab.dataset.systemScenarioTab);
  if (!tabs.length || !panels.length) return;

  function updateScenarioScrollIndicator() {
    if (!tabRail || !scrollIndicator) return;
    const overflow = Math.max(0, tabRail.scrollWidth - tabRail.clientWidth);
    scrollIndicator.hidden = overflow <= 1;
    if (overflow <= 1) return;
    const thumbWidth = Math.max(12, Math.min(100, (tabRail.clientWidth / tabRail.scrollWidth) * 100));
    const thumbLeft = Math.max(0, Math.min(100 - thumbWidth, (tabRail.scrollLeft / tabRail.scrollWidth) * 100));
    scrollIndicator.style.setProperty("--scenario-scroll-thumb-width", `${thumbWidth}%`);
    scrollIndicator.style.setProperty("--scenario-scroll-thumb-left", `${thumbLeft}%`);
  }

  function idFromHash() {
    const match = window.location.hash.match(/^#system-scenario-(.+)$/);
    return match && ids.includes(match[1]) ? match[1] : null;
  }

  function restoreScroll(previousY) {
    let frames = 3;
    const restore = () => {
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: Math.min(previousY, maxY), behavior: "instant" });
      frames -= 1;
      if (frames > 0) window.requestAnimationFrame(restore);
    };
    restore();
  }

  function activateScenario(requestedId, { updateUrl = false, focus = false } = {}) {
    const previousY = window.scrollY;
    const id = ids.includes(requestedId) ? requestedId : ids[0];
    for (const tab of tabs) {
      const active = tab.dataset.systemScenarioTab === id;
      tab.classList.toggle("is-current", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && (updateUrl || focus)) {
        const rail = tab.closest(".system-workflow-tabs");
        if (rail) rail.scrollLeft = Math.max(0, Math.min(tab.offsetLeft - (rail.clientWidth - tab.clientWidth) / 2, rail.scrollWidth - rail.clientWidth));
        window.requestAnimationFrame(updateScenarioScrollIndicator);
        if (focus) tab.focus({ preventScroll: true });
      }
    }
    for (const panel of panels) {
      const active = panel.dataset.systemScenarioPanel === id;
      panel.hidden = !active;
      panel.classList.toggle("is-current", active);
    }
    if (updateUrl) {
      const next = new URL(window.location.href);
      next.hash = `system-scenario-${id}`;
      window.history.replaceState({}, "", `${next.pathname}${next.search}${next.hash}`);
    }
    if (updateUrl || focus) restoreScroll(previousY);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateScenario(tab.dataset.systemScenarioTab, { updateUrl: true }));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      activateScenario(tabs[nextIndex].dataset.systemScenarioTab, { updateUrl: true, focus: true });
    });
  });

  function revealHashTarget({ scroll = true } = {}) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target || !home.contains(target)) return;
    ensureOpenAncestors(target);
    if (scroll) window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
  }

  home.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return;
    ensureOpenAncestors(document.getElementById(url.hash.slice(1)));
  });

  window.addEventListener("hashchange", () => {
    const id = idFromHash();
    if (id) activateScenario(id);
    revealHashTarget();
  });
  tabRail?.addEventListener("scroll", updateScenarioScrollIndicator, { passive: true });
  window.addEventListener("resize", updateScenarioScrollIndicator);
  if (tabRail && typeof ResizeObserver !== "undefined") new ResizeObserver(updateScenarioScrollIndicator).observe(tabRail);
  document.fonts?.ready?.then(updateScenarioScrollIndicator);
  activateScenario(idFromHash() || ids[0]);
  updateScenarioScrollIndicator();
  // Enhancement collapses the other static scenarios after native fragment
  // navigation; align the requested section again against the final layout.
  revealHashTarget({ scroll: performance.getEntriesByType("navigation")[0]?.type === "navigate" });
}

function initializeSystemSectionNavigation() {
  const navigation = document.querySelector("[data-system-section-navigation]");
  const home = document.querySelector(".system-home");
  if (!navigation || !home) return;
  const rail = navigation.querySelector(".system-section-navigation-rail");
  const links = Array.from(navigation.querySelectorAll("[data-system-section-link]"));
  const sections = links.map((link) => document.getElementById(link.dataset.systemSectionLink));
  if (!rail || links.length === 0 || sections.some((section) => !section)) return;
  let activeIndex = -1;
  let frame = 0;
  let clickedIndex = null;
  let clickScrollIdleTimer = 0;
  let clickLockFallbackTimer = 0;

  function headerHeight() {
    return document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  }

  function revealActiveLink(link, behavior = "smooth") {
    if (rail.scrollWidth <= rail.clientWidth) return;
    const left = link.offsetLeft;
    const right = left + link.offsetWidth;
    const visibleLeft = rail.scrollLeft;
    const visibleRight = visibleLeft + rail.clientWidth;
    if (left < visibleLeft + 8) rail.scrollTo({ left: Math.max(0, left - 12), behavior });
    else if (right > visibleRight - 8) rail.scrollTo({ left: Math.min(rail.scrollWidth - rail.clientWidth, right - rail.clientWidth + 12), behavior });
  }

  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    links.forEach((link, linkIndex) => {
      const current = linkIndex === index;
      link.classList.toggle("is-current", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    revealActiveLink(links[index]);
  }

  function update() {
    frame = 0;
    if (clickedIndex !== null) {
      setActive(clickedIndex);
      return;
    }
    const readingLine = headerHeight() + navigation.getBoundingClientRect().height + 18;
    let nextIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= readingLine + 2) nextIndex = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) nextIndex = sections.length - 1;
    setActive(nextIndex);

  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function targetReached(index) {
    if (index === null) return true;
    const readingLine = headerHeight() + navigation.getBoundingClientRect().height + 18;
    const targetTop = sections[index].getBoundingClientRect().top;
    const atPageEnd = index === sections.length - 1 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    return atPageEnd || Math.abs(targetTop - readingLine) <= 32;
  }

  function releaseClickLock(force = false) {
    if (clickedIndex === null) return;
    if (!force && !targetReached(clickedIndex)) return;
    clickedIndex = null;
    window.clearTimeout(clickScrollIdleTimer);
    window.clearTimeout(clickLockFallbackTimer);
    scheduleUpdate();
  }

  function handleScroll() {
    if (clickedIndex !== null) {
      window.clearTimeout(clickScrollIdleTimer);
      clickScrollIdleTimer = window.setTimeout(() => releaseClickLock(), 180);
    }
    scheduleUpdate();
  }

  links.forEach((link, index) => link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    clickedIndex = index;
    window.clearTimeout(clickScrollIdleTimer);
    window.clearTimeout(clickLockFallbackTimer);
    setActive(index);
    revealActiveLink(link);
    ensureOpenAncestors(sections[index]);
    const readingLine = headerHeight() + navigation.getBoundingClientRect().height + 18;
    const targetTop = Math.max(0, Math.ceil(window.scrollY + sections[index].getBoundingClientRect().top - readingLine));
    const next = new URL(window.location.href);
    next.hash = link.dataset.systemSectionLink;
    window.history.replaceState(window.history.state, "", `${next.pathname}${next.search}${next.hash}`);
    window.scrollTo({ top: targetTop, behavior: "instant" });
    clickLockFallbackTimer = window.setTimeout(() => releaseClickLock(true), 3200);
  }));
  window.addEventListener("scroll", handleScroll, { passive: true });
  if ("onscrollend" in window) window.addEventListener("scrollend", () => releaseClickLock());
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(scheduleUpdate).observe(home);
  update();
}

function initializeBackToTop() {
  const button = document.querySelector("[data-back-to-top]");
  const footer = document.querySelector(".site-footer");
  const status = document.querySelector("[data-back-to-top-stamp-status]");
  if (!button) return;
  let frame = 0;
  let stamp;
  let stampTimer = 0;
  let returning = false;
  let hasShown = false;

  function firstVisibleHeading() {
    return Array.from(document.querySelectorAll("main h1, main h2")).find((heading) => {
      const style = window.getComputedStyle(heading);
      return !heading.classList.contains("visually-hidden")
        && style.display !== "none"
        && style.visibility !== "hidden"
        && heading.getClientRects().length > 0;
    });
  }

  function hideStamp() {
    window.clearTimeout(stampTimer);
    stampTimer = 0;
    stamp?.remove();
    stamp = undefined;
    if (status) status.textContent = "";
  }

  function showStamp(reducedMotion) {
    if (hasShown) return;
    hasShown = true;
    const heading = firstVisibleHeading();
    if (heading) {
      stamp = document.createElement("span");
      stamp.className = "back-to-top-stamp";
      stamp.textContent = "↟ 兜一圈，回来啦";
      stamp.setAttribute("aria-hidden", "true");
      heading.append(stamp);
      if (reducedMotion) stamp.classList.add("is-visible");
      else window.requestAnimationFrame(() => stamp?.classList.add("is-visible"));
    }
    if (status) status.textContent = "已回到页面顶部。兜一圈，回来啦。";
    stampTimer = window.setTimeout(hideStamp, 1800);
  }

  function update() {
    frame = 0;
    const footerVisible = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    button.hidden = window.scrollY < Math.max(520, window.innerHeight * 0.75) || footerVisible;
    if (returning && window.scrollY <= 2) {
      returning = false;
      showStamp(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }
  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }
  button.addEventListener("click", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    returning = true;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
    window.requestAnimationFrame(scheduleUpdate);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    returning = false;
    hideStamp();
  });
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  update();
}

function initializeFooterEmailCopy() {
  document.querySelectorAll("[data-copy-value]").forEach((row) => {
    const button = row.querySelector("button");
    const label = button?.querySelector("span");
    const status = row.querySelector('[role="status"]');
    const value = row.dataset.copyValue;
    if (!button || !label || !status || !value) return;
    const originalLabel = label.textContent;
    const valueName = row.dataset.copyName || "邮箱地址";
    let resetTimer = 0;
    let copying = false;

    function legacyCopy() {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      try {
        return document.execCommand("copy");
      } finally {
        field.remove();
      }
    }

    button.addEventListener("click", async () => {
      if (copying) return;
      let success = false;
      const restoreFocus = document.activeElement === button;
      copying = true;
      button.setAttribute("aria-busy", "true");
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          success = true;
        }
      } catch {
        // A denied Clipboard API falls through to the bounded local fallback.
      }
      if (!success) {
        try { success = legacyCopy(); } catch { success = false; }
      }
      window.clearTimeout(resetTimer);
      label.textContent = success ? "已复制" : "复制失败";
      status.textContent = valueName + label.textContent;
      copying = false;
      button.removeAttribute("aria-busy");
      if (restoreFocus) window.requestAnimationFrame(() => button.focus({ preventScroll: true }));
      resetTimer = window.setTimeout(() => {
        label.textContent = originalLabel;
        status.textContent = "";
      }, 1800);
    });
  });
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
  const prefetchAdjacent = gallery.dataset.galleryPrefetchAdjacentFull === "true";
  const images = cards.map((card) => ({
    src: card.dataset.gallerySrc,
    thumbnail: card.querySelector("img")?.currentSrc || card.querySelector("img")?.getAttribute("src") || card.dataset.gallerySrc,
    alt: card.dataset.galleryAlt,
    caption: card.dataset.galleryCaption,
    evidenceLevel: card.dataset.galleryEvidenceLevel,
    evidenceLabel: card.dataset.galleryEvidenceLabel,
    categoryLabel: card.dataset.galleryCategoryLabel,
    proves: card.dataset.galleryProves,
    doesNotProve: card.dataset.galleryDoesNotProve
  }));
  let activeIndex = 0;
  let zoom = 1;
  let fitSize = null;
  let returnFocus = null;
  let previousOverflow = "";
  let resizeObserver = null;
  let fullRequestToken = 0;
  const fullImageRequests = new Map();

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
  let image = document.createElement("img");
  image.className = "project-lightbox-image";
  canvas.append(image);
  viewport.append(previousButton, canvas, nextButton);
  const caption = document.createElement("figcaption");
  caption.className = "project-lightbox-caption";
  figure.append(viewport, caption);
  stage.append(figure);
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

  function handleImageDoubleClick() {
    if (zoom === 1) {
      zoom = 2;
      renderZoom();
    } else resetZoom();
  }

  function installDisplayImage(candidate, item) {
    candidate.className = "project-lightbox-image";
    candidate.alt = item.alt;
    candidate.decoding = "async";
    candidate.removeAttribute("loading");
    candidate.removeAttribute("style");
    candidate.ondblclick = handleImageDoubleClick;
    candidate.addEventListener("load", measureFit, { once: true });
    image.replaceWith(candidate);
    image = candidate;
    if (image.complete && image.naturalWidth) window.requestAnimationFrame(measureFit);
  }

  function loadDecodedFullImage(src) {
    const existing = fullImageRequests.get(src);
    if (existing) return existing;
    const request = (async () => {
      const candidate = new Image();
      candidate.decoding = "async";
      candidate.src = src;
      await candidate.decode();
      if (!candidate.naturalWidth || !candidate.naturalHeight) throw new Error("gallery_full_image_empty");
      return candidate;
    })();
    fullImageRequests.set(src, request);
    request.catch(() => {
      if (fullImageRequests.get(src) === request) fullImageRequests.delete(src);
    });
    return request;
  }

  function prefetchAdjacentFullImages(index) {
    if (!prefetchAdjacent || images.length < 2) return;
    const adjacent = new Set([(index - 1 + images.length) % images.length, (index + 1) % images.length]);
    for (const adjacentIndex of adjacent) void loadDecodedFullImage(images[adjacentIndex].src).catch(() => {});
  }

  async function upgradeToFullImage(index, token) {
    const item = images[index];
    try {
      const candidate = await loadDecodedFullImage(item.src);
      if (token !== fullRequestToken || index !== activeIndex || !overlay.isConnected) return;
      fitSize = null;
      installDisplayImage(candidate, item);
      prefetchAdjacentFullImages(index);
    } catch {
      // Keep the thumbnail visible and every control usable.
    }
  }

  function renderCaption(item) {
    caption.replaceChildren();
    if (item.evidenceLevel) {
      const evidence = document.createElement("strong");
      evidence.textContent = `${item.evidenceLevel} · ${item.evidenceLabel}`;
      caption.append(evidence);
    } else if (item.categoryLabel) {
      const category = document.createElement("strong");
      category.textContent = item.categoryLabel;
      caption.append(category);
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
    const requestToken = ++fullRequestToken;
    if (!prefetchAdjacent) fullImageRequests.clear();
    zoom = 1;
    fitSize = null;
    delete dialog.dataset.imageOrientation;
    dialog.dataset.zoom = "1";
    canvas.removeAttribute("style");
    const preview = new Image();
    preview.src = item.thumbnail || item.src;
    installDisplayImage(preview, item);
    heading.textContent = `图片查看器：${item.alt}`;
    count.textContent = `${activeIndex + 1} / ${images.length}`;
    live.textContent = `第 ${activeIndex + 1} 张，共 ${images.length} 张：${item.alt}`;
    renderCaption(item);
    resetZoom();
    if (image.complete) window.requestAnimationFrame(measureFit);
    void upgradeToFullImage(activeIndex, requestToken);
  }

  function close() {
    if (!overlay.isConnected) return;
    fullRequestToken += 1;
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

  zoomOut.addEventListener("click", () => { zoom -= 0.5; renderZoom(); });
  zoomIn.addEventListener("click", () => { zoom += 0.5; renderZoom(); });
  zoomReset.addEventListener("click", resetZoom);
  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));
  overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) close(); });
  cards.forEach((card, index) => card.addEventListener("click", () => open(index, card)));
  document.querySelectorAll("a[data-project-gallery-preview]").forEach((trigger) => {
    const index = images.findIndex((image) => image.src === trigger.getAttribute("href"));
    if (index < 0) return;
    trigger.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(index, trigger);
    });
  });
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
  const documentHref = (value) => {
    const target = new URL(value, window.location.href);
    return `${target.origin}${target.pathname}${target.search}`;
  };
  const prefetched = new Set(Array.from(document.querySelectorAll("link[rel='prefetch'][as='document']"), (link) => documentHref(link.href)));
  function prefetchAnchor(anchor) {
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
    const target = new URL(anchor.href, window.location.href);
    const targetDocument = documentHref(target.href);
    if (target.origin !== window.location.origin || targetDocument === documentHref(window.location.href) || prefetched.has(targetDocument)) return;
    if (/\.[a-z0-9]{2,8}$/i.test(target.pathname)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = `${target.pathname}${target.search}`;
    document.head.append(link);
    prefetched.add(targetDocument);
  }
  document.addEventListener("pointerover", (event) => prefetchAnchor(event.target.closest?.("a[href]")), { passive: true });
  document.addEventListener("focusin", (event) => prefetchAnchor(event.target.closest?.("a[href]")));
}

function initializeFooterSignature() {
  const button = document.querySelector("[data-footer-signature]");
  const label = button?.querySelector("[data-footer-signature-label]");
  const status = document.querySelector("[data-footer-signature-status]");
  if (!button || !label) return;
  let resetTimer = 0;
  button.addEventListener("click", () => {
    window.clearTimeout(resetTimer);
    label.textContent = "事情办成啦";
    button.classList.add("is-revealed");
    if (status) status.textContent = "页脚彩蛋：事情办成啦";
    resetTimer = window.setTimeout(() => {
      label.textContent = "啦啦啦";
      button.classList.remove("is-revealed");
      if (status) status.textContent = "";
    }, 1800);
  });
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
initializeContinuationBriefs();
initializeSearchResultsPage();
document.querySelectorAll(".project-gallery").forEach(initializeGallery);
initializeHeader();
initializeHomeSearchDock();
initializeRulesWorkbench();
initializeSkillCategories();
initializeProjectReadingLayers();
initializeSystemHome();
initializeSystemSectionNavigation();
initializeBackToTop();
initializeFooterEmailCopy();
initializeFooterSignature();
initializeFlowField();
initializeDocumentPrefetch();
centerCurrentProjectNavigation();
