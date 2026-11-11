/**
 * A toy model of bulk-transfer throughput against the number of parallel
 * streams, for the illustration on the optimizer page. The numbers are made
 * up: the shapes show why one fixed setting cannot suit every path, and are
 * not measurements of the real optimizer.
 *
 * Each extra stream adds less than the one before, until the path is full;
 * past that point every stream adds contention, so throughput falls again.
 */
export type Condition = {
  id: string;
  label: string;
  /** A word or two for labels inside the chart. */
  short: string;
  /** Plain-language reason the best setting sits where it does. */
  why: string;
  /** Share of the link this path can fill, from 0 to 1. */
  ceiling: number;
  /** How many streams it takes to approach the ceiling. */
  ramp: number;
  /** Throughput lost to contention per stream. */
  cost: number;
};

export const MIN_STREAMS = 1;
export const MAX_STREAMS = 32;

export const conditions: Condition[] = [
  {
    id: "nearby",
    label: "Nearby, quiet link",
    short: "Nearby",
    why: "Short round trips let each stream move a lot, so a handful fills the link.",
    ceiling: 1,
    ramp: 2.5,
    cost: 0.012,
  },
  {
    id: "distant",
    label: "Long-distance link",
    short: "Long-distance",
    why: "Long round trips cap what each stream can carry, so it takes many streams to fill the link.",
    ceiling: 1,
    ramp: 6,
    cost: 0.005,
  },
  {
    id: "busy",
    label: "Busy shared link",
    short: "Busy",
    why: "Other traffic takes half the link, and extra streams only cause losses.",
    ceiling: 0.55,
    ramp: 1.5,
    cost: 0.012,
  },
];

/** Throughput as a share of the link (0 to 1) for n parallel streams. */
export const throughput = (condition: Condition, n: number) =>
  Math.max(
    0.02,
    condition.ceiling * (1 - Math.exp(-n / condition.ramp)) -
      condition.cost * n,
  );

/** The best whole number of streams, found by trying every setting. */
export const best = (condition: Condition) => {
  let streams = MIN_STREAMS;
  for (let n = MIN_STREAMS; n <= MAX_STREAMS; n++)
    if (throughput(condition, n) > throughput(condition, streams)) streams = n;
  return { streams, value: throughput(condition, streams) };
};

/**
 * What a probe reports: the true value give or take up to 2%, the way live
 * telemetry wobbles. The wobble is fixed per setting so the toy is repeatable.
 */
export const measure = (condition: Condition, n: number) => {
  let h = n * 2654435761 + condition.id.length * 40503;
  for (const ch of condition.id)
    h = Math.imul(h ^ ch.charCodeAt(0), 2246822519);
  const wobble = ((h >>> 0) % 1000) / 1000 - 0.5;
  return throughput(condition, n) * (1 + 0.04 * wobble);
};

export const MAX_PROBES = 15;
const MAX_STEP = 4;

/**
 * The toy agent: a bounded hill climb that sees only what it measures. Each
 * probing interval it moves at most four streams; a better reading keeps the
 * direction and lengthens the step, a worse one turns back and halves it.
 */
export const search = (condition: Condition, start: number) => {
  const clamp = (n: number) => Math.min(MAX_STREAMS, Math.max(MIN_STREAMS, n));
  let current = clamp(start);
  let value = measure(condition, current);
  const probes = [{ streams: current, reading: value }];
  let direction = 1;
  let step = MAX_STEP;
  while (step >= 1 && probes.length < MAX_PROBES) {
    const next = clamp(current + direction * step);
    if (next === current) {
      direction = -direction;
      step = Math.floor(step / 2);
      continue;
    }
    const reading = measure(condition, next);
    probes.push({ streams: next, reading });
    if (reading > value) {
      current = next;
      value = reading;
      step = Math.min(step * 2, MAX_STEP);
    } else {
      direction = -direction;
      step = Math.floor(step / 2);
    }
  }
  return { probes, settled: current, value: throughput(condition, current) };
};
