import test from "node:test";
import assert from "node:assert/strict";
import {
  GAME,
  PAYTABLE,
  REEL_STRIPS,
  evaluateLine,
  exactGameMetrics,
  simulate,
} from "../lib/gameMath.js";

test("all reel strips have the documented length and symbol frequencies", () => {
  const expected = { A: 2, O: 3, C: 4, L: 5, R: 6, N: 7, P: 8, W: 2, S: 3 };
  for (const strip of REEL_STRIPS) {
    assert.equal(strip.length, 40);
    const counts = Object.fromEntries(Object.keys(expected).map((symbol) => [symbol, strip.filter((item) => item === symbol).length]));
    assert.deepEqual(counts, expected);
  }
});

test("wild substitution chooses the highest valid line award", () => {
  assert.deepEqual(evaluateLine(["W", "A", "A", "A", "O"]), { credits: PAYTABLE.A[4], symbol: "A", count: 4 });
  assert.deepEqual(evaluateLine(["W", "W", "W", "W", "W"]), { credits: PAYTABLE.W[5], symbol: "W", count: 5 });
  assert.equal(evaluateLine(["S", "A", "A", "A", "A"]).credits, 0);
});

test("the exact model reproduces the designed profile", () => {
  const metrics = exactGameMetrics();
  assert.ok(Math.abs(metrics.baseRtp - 0.39630029296875) < 1e-12);
  assert.ok(Math.abs(metrics.featureProbability - 0.07892279296875) < 1e-12);
  assert.ok(Math.abs(metrics.totalRtp - 0.9592885605264474) < 1e-12);
  assert.equal(GAME.freeSpins, 9);
  assert.equal(GAME.freeMultiplier, 2);
});

test("fixed-seed simulation stays near theoretical RTP", () => {
  const exact = exactGameMetrics();
  const sample = simulate(100000, 20260718);
  assert.ok(Math.abs(sample.rtp - exact.totalRtp) < 0.035, `observed ${sample.rtp}, expected ${exact.totalRtp}`);
  assert.ok(Math.abs(sample.featureFrequency - exact.featureProbability) < 0.005);
});
