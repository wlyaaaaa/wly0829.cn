function nonEmptyString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`project snapshot ${field} must be a non-empty string`);
  }
  return value;
}

function freezeMetric(entry) {
  if (!entry || typeof entry !== "object") throw new TypeError("project snapshot metrics entry must be an object");
  return Object.freeze({
    label: nonEmptyString(entry.label, "metrics.label"),
    value: nonEmptyString(entry.value, "metrics.value")
  });
}

function freezeFact(entry) {
  if (!entry || typeof entry !== "object") throw new TypeError("project snapshot facts entry must be an object");
  return Object.freeze({
    label: nonEmptyString(entry.label, "facts.label"),
    value: nonEmptyString(entry.value, "facts.value"),
    hero: entry.hero !== false
  });
}

export function createProjectSnapshot({ observedAt, label, boundary, metrics, facts, gaps }) {
  nonEmptyString(observedAt, "observedAt");
  if (!Number.isFinite(Date.parse(observedAt))) throw new TypeError("project snapshot observedAt must be a valid timestamp");
  nonEmptyString(label, "label");
  if (!Array.isArray(metrics) || metrics.length < 1) throw new TypeError("project snapshot metrics must be a non-empty array");
  if (!Array.isArray(facts) || facts.length < 1) throw new TypeError("project snapshot facts must be a non-empty array");
  if (!Array.isArray(gaps) || gaps.length < 1) throw new TypeError("project snapshot gaps must be a non-empty array");

  const snapshotBoundary = nonEmptyString(boundary || gaps[0], "boundary");
  const currentSnapshot = Object.freeze({
    observedAt,
    label,
    boundary: snapshotBoundary,
    metrics: Object.freeze(metrics.map(freezeMetric)),
    facts: Object.freeze(facts.map(freezeFact)),
    gaps: Object.freeze(gaps.map((gap) => nonEmptyString(gap, "gaps")))
  });
  const cardMetrics = Object.freeze(currentSnapshot.metrics.map(({ label: metricLabel, value }) => Object.freeze({ label: metricLabel, value })));
  const heroFacts = Object.freeze(currentSnapshot.facts.filter((fact) => fact.hero).map(({ label: factLabel, value }) => Object.freeze({ label: factLabel, value })));
  const currentState = Object.freeze({
    observedAt: currentSnapshot.observedAt,
    label: currentSnapshot.label,
    facts: Object.freeze(currentSnapshot.facts.map(({ value }) => value)),
    gaps: currentSnapshot.gaps
  });

  return Object.freeze({
    currentSnapshot,
    cardMetrics,
    heroFacts,
    currentState,
    snapshotBoundary: `观察于 ${currentSnapshot.observedAt}；${currentSnapshot.boundary}`
  });
}
