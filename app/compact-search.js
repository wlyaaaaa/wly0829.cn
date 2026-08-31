export function compactSearchScore(entry, query) {
  const normalized = String(query).trim().toLowerCase();
  if (!normalized) return 0;
  const title = entry.title.toLowerCase();
  const detail = entry.detail.toLowerCase();
  const aliases = (entry.aliases || []).map((value) => value.toLowerCase());
  const searchable = `${entry.type} ${title} ${detail} ${aliases.join(" ")} ${entry.search || ""}`.toLowerCase();
  const latinTokens = normalized.match(/[a-z][a-z0-9_.:/-]*/g) || [];
  const matchedLatinTokens = latinTokens.filter((token) => searchable.includes(token));
  if (latinTokens.length && matchedLatinTokens.length / latinTokens.length < 0.6) return 0;
  if (title.includes(normalized)) return 14000;
  if (aliases.some((alias) => alias.includes(normalized))) return 16000;
  if (detail.includes(normalized)) return 11000;
  if (searchable.includes(normalized)) return 9000;

  const compact = normalized.replace(/[a-z0-9_.:/-]+/gi, "").replace(/[^\p{Script=Han}]/gu, "");
  const grams = compact.length >= 3
    ? Array.from({ length: compact.length - 1 }, (_, index) => compact.slice(index, index + 2))
    : compact ? [compact] : [];
  if (!grams.length) return matchedLatinTokens.length ? 70 + matchedLatinTokens.length * 12 : 0;
  const matched = grams.filter((gram) => searchable.includes(gram)).length;
  if (matched / grams.length < 0.45) return 0;
  const titleMatched = grams.filter((gram) => title.includes(gram)).length;
  const detailMatched = grams.filter((gram) => detail.includes(gram)).length;
  return matched * 10 + titleMatched * 8 + detailMatched * 4;
}

export function searchCompactEntries(entries, query, scope = "all") {
  return entries
    .map((entry, index) => ({ entry, index, score: compactSearchScore(entry, query) }))
    .filter((result) => result.score > 0 && (scope === "all" || (result.entry.scopes || []).includes(scope)))
    .sort((left, right) => right.score - left.score || (left.entry.type === "项目内容" ? 0 : 1) - (right.entry.type === "项目内容" ? 0 : 1) || left.index - right.index)
    .map((result) => result.entry);
}
