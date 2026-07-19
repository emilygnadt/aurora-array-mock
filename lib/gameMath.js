export const GAME = {
  title: "Aurora Array",
  reels: 5,
  rows: 3,
  lines: 10,
  totalBet: 1,
  lineBet: 0.1,
  freeSpins: 9,
  freeMultiplier: 2,
};

export const SYMBOLS = {
  A: { name: "Aurora", short: "AU", tier: "premium" },
  O: { name: "Orbit", short: "OR", tier: "premium" },
  C: { name: "Comet", short: "CO", tier: "premium" },
  L: { name: "Luna", short: "LU", tier: "mid" },
  R: { name: "Crystal", short: "CR", tier: "mid" },
  N: { name: "Nova", short: "NO", tier: "low" },
  P: { name: "Pulse", short: "PU", tier: "low" },
  W: { name: "Wild", short: "W", tier: "wild" },
  S: { name: "Signal", short: "S", tier: "scatter" },
};

export const PAYTABLE = {
  A: { 3: 20, 4: 80, 5: 300 },
  O: { 3: 15, 4: 50, 5: 200 },
  C: { 3: 10, 4: 30, 5: 120 },
  L: { 3: 8, 4: 20, 5: 80 },
  R: { 3: 5, 4: 15, 5: 50 },
  N: { 3: 4, 4: 10, 5: 30 },
  P: { 3: 3, 4: 6, 5: 23 },
  W: { 3: 50, 4: 200, 5: 1000 },
};

export const PAYLINES = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 0, 1, 0],
];

export const REEL_STRIPS = [
  "S,P,L,P,N,P,N,L,R,P,L,W,A,S,C,O,N,R,O,L,R,P,W,R,N,C,N,S,P,R,C,P,R,P,C,N,L,O,N,A",
  "S,N,R,P,R,O,P,C,L,W,R,N,R,S,N,R,N,P,C,N,P,A,C,L,P,L,W,S,O,A,L,N,L,P,C,N,P,R,P,O",
  "S,N,O,C,P,N,C,L,P,O,A,C,P,S,N,R,N,W,L,A,N,R,P,C,R,P,R,S,R,L,O,L,P,L,P,N,P,N,W,R",
  "S,N,L,C,R,L,C,R,N,O,R,P,W,S,P,C,A,N,P,O,P,N,L,C,R,N,P,S,R,W,L,N,P,N,O,R,P,L,A,P",
  "S,O,R,N,P,N,L,C,L,R,O,C,R,S,L,N,L,P,C,N,W,P,L,P,A,P,R,S,P,R,P,C,N,W,N,R,A,O,P,N",
].map((strip) => strip.split(","));

export function createRng(seed = 20260718) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function windowFromStops(stops) {
  return REEL_STRIPS.map((strip, reel) =>
    Array.from({ length: GAME.rows }, (_, row) => strip[(stops[reel] + row) % strip.length]),
  );
}

export function randomStops(rng = Math.random) {
  return REEL_STRIPS.map((strip) => Math.floor(rng() * strip.length));
}

export function evaluateLine(symbols) {
  let best = { credits: 0, symbol: null, count: 0 };
  for (const target of Object.keys(PAYTABLE)) {
    let count = 0;
    for (const symbol of symbols) {
      if (symbol === target || symbol === "W") count += 1;
      else break;
    }
    const credits = count >= 3 ? PAYTABLE[target][count] ?? 0 : 0;
    if (credits > best.credits) best = { credits, symbol: target, count };
  }
  return best;
}

export function evaluateWindow(window, multiplier = 1) {
  const lineWins = PAYLINES.map((line, index) => {
    const symbols = line.map((row, reel) => window[reel][row]);
    const result = evaluateLine(symbols);
    return {
      line: index + 1,
      symbols,
      ...result,
      amount: result.credits * GAME.lineBet * multiplier,
    };
  }).filter((win) => win.amount > 0);
  const scatterCount = window.flat().filter((symbol) => symbol === "S").length;
  return {
    lineWins,
    scatterCount,
    featureTriggered: scatterCount >= 3,
    linePayout: lineWins.reduce((sum, win) => sum + win.amount, 0),
  };
}

export function spinBase(rng = Math.random) {
  const stops = randomStops(rng);
  const window = windowFromStops(stops);
  return { stops, window, ...evaluateWindow(window) };
}

export function playRound(rng = Math.random) {
  const base = spinBase(rng);
  const freeResults = [];
  let featurePayout = 0;
  if (base.featureTriggered) {
    for (let index = 0; index < GAME.freeSpins; index += 1) {
      const stops = randomStops(rng);
      const window = windowFromStops(stops);
      const result = evaluateWindow(window, GAME.freeMultiplier);
      featurePayout += result.linePayout;
      freeResults.push({ stops, window, ...result });
    }
  }
  return {
    base,
    freeResults,
    featurePayout,
    totalPayout: base.linePayout + featurePayout,
  };
}

function symbolFrequencies(strip) {
  return strip.reduce((counts, symbol) => {
    counts[symbol] = (counts[symbol] ?? 0) + 1;
    return counts;
  }, {});
}

export function exactLineMetrics() {
  const distributions = REEL_STRIPS.map((strip) => symbolFrequencies(strip));
  const symbols = Object.keys(SYMBOLS);
  let weightedPayout = 0;
  let weightedHits = 0;
  let combinations = 1;
  for (const strip of REEL_STRIPS) combinations *= strip.length;

  function visit(reel, combination, weight) {
    if (reel === GAME.reels) {
      const result = evaluateLine(combination);
      weightedPayout += result.credits * weight;
      if (result.credits > 0) weightedHits += weight;
      return;
    }
    for (const symbol of symbols) {
      const frequency = distributions[reel][symbol] ?? 0;
      if (frequency > 0) visit(reel + 1, [...combination, symbol], weight * frequency);
    }
  }
  visit(0, [], 1);
  return {
    rtp: weightedPayout / combinations,
    hitProbability: weightedHits / combinations,
    weightedPayout,
    combinations,
  };
}

function scatterWindowDistribution(strip) {
  const counts = new Map();
  for (let stop = 0; stop < strip.length; stop += 1) {
    let scatters = 0;
    for (let row = 0; row < GAME.rows; row += 1) {
      if (strip[(stop + row) % strip.length] === "S") scatters += 1;
    }
    counts.set(scatters, (counts.get(scatters) ?? 0) + 1);
  }
  return counts;
}

export function exactFeatureProbability() {
  let distribution = new Map([[0, 1]]);
  let denominator = 1;
  for (const strip of REEL_STRIPS) {
    const reelDistribution = scatterWindowDistribution(strip);
    const next = new Map();
    for (const [currentCount, currentWays] of distribution) {
      for (const [reelCount, reelWays] of reelDistribution) {
        const total = currentCount + reelCount;
        next.set(total, (next.get(total) ?? 0) + currentWays * reelWays);
      }
    }
    distribution = next;
    denominator *= strip.length;
  }
  let triggerWays = 0;
  for (const [count, ways] of distribution) if (count >= 3) triggerWays += ways;
  return { probability: triggerWays / denominator, triggerWays, combinations: denominator };
}

export function exactGameMetrics() {
  const line = exactLineMetrics();
  const feature = exactFeatureProbability();
  const baseRtp = line.rtp;
  const featureRtp = feature.probability * GAME.freeSpins * GAME.freeMultiplier * baseRtp;
  return {
    baseRtp,
    featureRtp,
    totalRtp: baseRtp + featureRtp,
    featureProbability: feature.probability,
    featureOdds: 1 / feature.probability,
    lineHitProbability: line.hitProbability,
    lineCombinations: line.combinations,
  };
}

export function simulate(iterations = 50000, seed = 20260718) {
  const rng = createRng(seed);
  let totalPayout = 0;
  let basePayout = 0;
  let featurePayout = 0;
  let hitSpins = 0;
  let features = 0;
  let mean = 0;
  let m2 = 0;
  const buckets = { zero: 0, under1: 0, oneTo5: 0, fiveTo20: 0, twentyPlus: 0 };

  for (let index = 1; index <= iterations; index += 1) {
    const round = playRound(rng);
    const payout = round.totalPayout;
    totalPayout += payout;
    basePayout += round.base.linePayout;
    featurePayout += round.featurePayout;
    if (payout > 0) hitSpins += 1;
    if (round.base.featureTriggered) features += 1;
    if (payout === 0) buckets.zero += 1;
    else if (payout < 1) buckets.under1 += 1;
    else if (payout < 5) buckets.oneTo5 += 1;
    else if (payout < 20) buckets.fiveTo20 += 1;
    else buckets.twentyPlus += 1;
    const delta = payout - mean;
    mean += delta / index;
    m2 += delta * (payout - mean);
  }
  return {
    iterations,
    seed,
    rtp: totalPayout / iterations,
    baseRtp: basePayout / iterations,
    featureRtp: featurePayout / iterations,
    hitFrequency: hitSpins / iterations,
    featureFrequency: features / iterations,
    standardDeviation: Math.sqrt(m2 / Math.max(1, iterations - 1)),
    maxExposure: 100,
    buckets,
  };
}
