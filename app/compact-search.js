const wordSegmenter = typeof Intl.Segmenter === "function"
  ? new Intl.Segmenter("zh", { granularity: "word" })
  : null;
const queryFillers = new Set("我 你 您 他 她 它 我们 你们 的 了 呢 吗 吧 啊 这 那 这个 那个 一 个 一份 一张 帮 帮忙 请 请问 想 想要 能 能否 可以 能不能 怎么 怎样 为什么 是否 哪个 哪些 什么 有没有 一下 一直 已经 还有 之后 然后 把 给 在 从 和 或 与 不 也 都 是 有 要 说 但 很 会 着 上 里 张 两 只 还 才 再 就".split(" "));
const preparedIndexes = new WeakMap();
const normalize = (value) => String(value || "").normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
const naturalTerms = [
  [/\bagents?\b/g, "ai"],
  [/签字|签署/g, "签名"],
  [/不记得|记不清|忘了/g, "忘记"],
  [/同时|一起|并行/g, "并发"]
];
const normalizeMeaning = (value) => naturalTerms.reduce((text, [pattern, term]) => text.replace(pattern, term), value);

export function createCompactSearchEntry(entry, href = entry.href) {
  const detailLimit = entry.type === "项目资产" ? 120 : entry.type === "系统组成" ? 140 : entry.type === "项目" ? 240 : 180;
  return {
    type: entry.type,
    group: entry.group,
    scopes: entry.scopes || [],
    projectSlug: entry.projectSlug || null,
    title: entry.title,
    detail: entry.detail.slice(0, detailLimit),
    href,
    aliases: [...new Set(entry.aliases || [])],
    search: entry.compactSearch ?? entry.search ?? ""
  };
}

function prepareEntry(entry) {
  const compact = createCompactSearchEntry(entry);
  const title = normalize(compact.title);
  const detail = normalize(compact.detail);
  const aliases = compact.aliases.map(normalize);
  const search = normalize(compact.search);
  const searchable = `${entry.type} ${title} ${detail} ${aliases.join(" ")} ${search}`;
  const semantic = { title: normalizeMeaning(title), detail: normalizeMeaning(detail), aliases: aliases.map(normalizeMeaning), search: normalizeMeaning(search), searchable: normalizeMeaning(searchable) };
  return { entry, title, detail, aliases, search, searchable, semantic };
}

function queryIntent(normalized) {
  // In an explicit correction, the rejected topic is not a positive search hint.
  const correction = normalized.match(/^(.*?)(?:不是|并非)([^，,。；;]*?)(?:(?:[，,。；;]\s*)?而是|[，,。；;]\s*是)(.+)$/u);
  const action = /^(?:要|想)?(查找|寻找|搜索|检索|读取|查看|打开|生成|制作|编写|编辑|修改|删除|恢复|上传|下载|复制|移动|找|查|写|做)/u;
  const inheritedAction = correction && !action.test(correction[3]) ? correction[2].match(action)?.[1] || "" : "";
  return normalizeMeaning(correction ? `${correction[1]} ${inheritedAction} ${correction[3]}` : normalized);
}

function queryTerms(normalized) {
  const focused = queryIntent(normalized);
  if (/^\p{Script=Han}{1,2}$/u.test(focused)) return [{ term: focused, weight: 1 }];
  const hanRuns = focused.match(/\p{Script=Han}+/gu) || [];
  const standaloneHan = new Set(hanRuns.filter((run) => run.length === 1));
  const words = wordSegmenter
    ? [...wordSegmenter.segment(focused)].filter((part) => part.isWordLike).map((part) => part.segment)
    : (focused.match(/[a-z0-9_.:/-]+|\p{Script=Han}+/gu) || []).flatMap((part) => /^\p{Script=Han}{3,}$/u.test(part)
      ? Array.from({ length: part.length - 1 }, (_, index) => part.slice(index, index + 2))
      : [part]);
  const terms = new Map();
  for (const word of words) {
    const term = word.replace(/[的了着]$/u, "");
    if (term && !queryFillers.has(term)) terms.set(term, /^\p{Script=Han}$/u.test(term) && !standaloneHan.has(term) ? 0.2 : 1);
  }
  // Native Chinese segmentation can split ordinary nouns into single characters.
  // Keep adjacent pairs too, without inventing pairs across punctuation or Latin.
  for (const run of hanRuns) {
    for (let index = 0; index < run.length - 1; index += 1) {
      const gram = run.slice(index, index + 2);
      if (![...gram].some((character) => queryFillers.has(character)) && !queryFillers.has(gram)) {
        terms.set(gram, 1);
      }
    }
  }
  return [...terms].map(([term, weight]) => ({ term, weight }));
}

function scorePrepared({ entry, title, detail, aliases, search, searchable, semantic }, normalized, terms) {
  if (!normalized) return 0;
  if (title === normalized || title.startsWith(`${normalized} ·`)) return 18000;
  if (title.includes(normalized)) return 14000;
  if (aliases.some((alias) => alias.includes(normalized))) return 16000;
  if (detail.includes(normalized)) return 11000;
  if (searchable.includes(normalized)) return 9000;
  let score = 0;
  let matchedWeight = 0;
  const queryWeight = terms.reduce((total, { weight }) => total + weight, 0);
  for (const { term, weight } of terms) {
    const fieldWeight = semantic.title.includes(term) ? 12
      : semantic.detail.includes(term) ? 5
      : semantic.aliases.some((alias) => alias.includes(term)) ? 3
      : semantic.search.includes(term) ? 3 : 0;
    score += fieldWeight * weight;
    if (fieldWeight) matchedWeight += weight;
  }
  // A natural request should reach the owning reference before a cross-project
  // story. Explicit names, commands and aliases keep the exact-match priorities.
  const priority = entry.type === "项目" || entry.type === "项目内容" ? 3
    : entry.type === "真实工作场景" ? 0.5 : 1;
  const coverage = queryWeight ? matchedWeight / queryWeight : 0;
  return score * priority * coverage * coverage;
}

export function compactSearchScore(entry, query) {
  const normalized = normalize(query);
  return scorePrepared(prepareEntry(entry), normalized, queryTerms(normalized));
}

export function searchCompactEntries(entries, query, scope = "all") {
  const normalized = normalize(query);
  if (!normalized) return [];
  let prepared = preparedIndexes.get(entries);
  if (!prepared || prepared.length !== entries.length) {
    prepared = entries.map(prepareEntry);
    preparedIndexes.set(entries, prepared);
  }
  // A known device/version identifier is an explicit constraint, not filler.
  // Extract it after corrections so a rejected identifier cannot constrain B.
  const anchors = (queryIntent(normalized).match(/[a-z][a-z0-9_.:/\\-]*/g) || [])
    .filter((term) => /\d/.test(term) && prepared.some(({ searchable }) => searchable.includes(term)));
  const candidates = prepared.filter(({ entry, searchable }) =>
    (!scope || scope === "all" || (entry.scopes || []).includes(scope))
    && anchors.every((term) => searchable.includes(term)));
  const terms = queryTerms(normalized).map(({ term, weight }) => {
    const frequency = candidates.filter(({ semantic }) => semantic.searchable.includes(term)).length;
    return { term, weight: weight * Math.log1p(candidates.length / (frequency + 1)) };
  });
  const seenHrefs = new Set();
  const priority = ({ type }) => type === "项目内容" ? 0 : type === "项目" ? 1 : 2;
  return candidates
    .map((record, index) => ({ entry: record.entry, index, score: scorePrepared(record, normalized, terms) }))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || priority(left.entry) - priority(right.entry) || left.index - right.index)
    .map((result) => result.entry)
    .filter((entry) => {
      if (seenHrefs.has(entry.href)) return false;
      seenHrefs.add(entry.href);
      return true;
    });
}
