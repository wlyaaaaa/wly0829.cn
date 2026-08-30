function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createTermAnnotator(translations) {
  const ordered = [...translations].sort((left, right) => right[0].length - left[0].length);
  const lookup = new Map();
  for (const [term, translation] of ordered) {
    const key = term.toLowerCase();
    if (!lookup.has(key)) lookup.set(key, translation);
  }
  const expression = new RegExp(
    `(?<![A-Za-z0-9_-])(?:${ordered.map(([term]) => escapeRegExp(term)).join("|")})(?![A-Za-z0-9_-]|（|\\.[A-Za-z0-9])`,
    "gi"
  );

  const annotatePlain = (segment) => segment.replace(expression, (match) => {
    const translation = lookup.get(match.toLowerCase());
    return translation ? `${match}（${translation}）` : match;
  });
  const protectedExpression = /(?:https?:\/\/[^\s<>"']+|(?:[A-Za-z]:\\|\\\\)[^\s<>"']+|\/(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+|--[A-Za-z0-9][A-Za-z0-9_-]*)/gi;
  const annotateSegment = (segment) => {
    let result = "";
    let cursor = 0;
    for (const match of segment.matchAll(protectedExpression)) {
      result += annotatePlain(segment.slice(cursor, match.index));
      result += match[0];
      cursor = match.index + match[0].length;
    }
    return result + annotatePlain(segment.slice(cursor));
  };
  const trailingKnownTermLength = (segment) => {
    const lower = segment.toLowerCase();
    for (const [term] of ordered) {
      const normalized = term.toLowerCase();
      const start = lower.length - normalized.length;
      if (start < 0 || lower.slice(start) !== normalized) continue;
      if (start > 0 && /[A-Za-z0-9_-]/.test(segment[start - 1])) continue;
      return term.length;
    }
    return 0;
  };

  return function annotateTerms(text) {
    const source = String(text);
    let result = "";
    let segmentStart = 0;
    let parenthesisDepth = 0;

    for (let index = 0; index < source.length; index += 1) {
      if (source[index] === "（") {
        if (parenthesisDepth === 0) {
          const outside = source.slice(segmentStart, index);
          const protectedLength = trailingKnownTermLength(outside);
          const prefix = protectedLength > 0 ? outside.slice(0, -protectedLength) : outside;
          const protectedTerm = protectedLength > 0 ? outside.slice(-protectedLength) : "";
          result += `${annotateSegment(prefix)}${protectedTerm}（`;
          segmentStart = index + 1;
        }
        parenthesisDepth += 1;
      } else if (source[index] === "）" && parenthesisDepth > 0) {
        parenthesisDepth -= 1;
        if (parenthesisDepth === 0) {
          result += source.slice(segmentStart, index + 1);
          segmentStart = index + 1;
        }
      }
    }

    if (segmentStart < source.length) {
      result += parenthesisDepth === 0
        ? annotateSegment(source.slice(segmentStart))
        : source.slice(segmentStart);
    }
    return result;
  };
}
