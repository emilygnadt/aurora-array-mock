"use client";

import { useMemo, useState } from "react";
import {
  GAME,
  PAYLINES,
  PAYTABLE,
  REEL_STRIPS,
  SYMBOLS,
  createRng,
  exactGameMetrics,
  playRound,
  simulate,
  windowFromStops,
} from "../lib/gameMath.js";

const initialStops = [4, 11, 18, 25, 32];
const initialWindow = windowFromStops(initialStops);
const percent = (value: number, digits = 2) => `${(value * 100).toFixed(digits)}%`;

function SymbolTile({ symbol, active = false }: { symbol: string; active?: boolean }) {
  const data = SYMBOLS[symbol as keyof typeof SYMBOLS];
  return (
    <div className={`symbol symbol-${data.tier} ${active ? "symbol-active" : ""}`} aria-label={data.name}>
      <span className="symbol-mark">{data.short}</span>
      <span className="symbol-name">{data.name}</span>
    </div>
  );
}

export default function GamePortfolio() {
  const theoretical = useMemo(() => exactGameMetrics(), []);
  const [rng] = useState(() => createRng(Date.now()));
  const [screen, setScreen] = useState(initialWindow);
  const [message, setMessage] = useState("Ready for a one-credit demonstration spin.");
  const [win, setWin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [simulation, setSimulation] = useState<ReturnType<typeof simulate> | null>(null);
  const [activeLines, setActiveLines] = useState<number[]>([]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setActiveLines([]);
    setMessage("Sampling five independent reel stops…");
    window.setTimeout(() => {
      const round = playRound(rng);
      setScreen(round.base.window);
      setWin(round.totalPayout);
      setFreeSpins(round.freeResults.length);
      setActiveLines(round.base.lineWins.map((line) => line.line));
      if (round.base.featureTriggered) {
        setMessage(`Signal locked: ${GAME.freeSpins} free spins at ${GAME.freeMultiplier}× returned ${round.totalPayout.toFixed(2)} credits.`);
      } else if (round.totalPayout > 0) {
        setMessage(`${round.base.lineWins.length} winning line${round.base.lineWins.length === 1 ? "" : "s"} returned ${round.totalPayout.toFixed(2)} credits.`);
      } else {
        setMessage("No award on this sample. The next outcome is independent.");
      }
      setSpinning(false);
    }, 520);
  };

  const runSimulation = () => {
    setMessage("Running 50,000 deterministic portfolio spins…");
    window.setTimeout(() => {
      const result = simulate(50000, 20260718);
      setSimulation(result);
      setMessage(`Simulation complete. Observed RTP: ${percent(result.rtp)}.`);
    }, 20);
  };

  return (
    <main>
      <nav className="topbar" aria-label="Portfolio navigation">
        <a className="brand" href="#top"><span className="brand-dot" /> AURORA ARRAY</a>
        <div className="nav-links">
          <a href="#game">Game</a><a href="#math">Math</a><a href="#method">Method</a>
        </div>
        <span className="clean-room">CLEAN-ROOM STUDY · 2026</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">SLOT MATHEMATICS · GAME SYSTEMS · VERIFICATION</p>
          <h1>A small game with<br /><em>auditable math.</em></h1>
          <p className="hero-lede">An original 5×3 portfolio game designed to demonstrate reel modeling, payout evaluation, exact expectation, deterministic simulation, and technical communication.</p>
          <div className="hero-actions">
            <a className="button primary" href="#game">Play the model</a>
            <a className="button secondary" href="#math">Inspect the numbers</a>
          </div>
        </div>
        <div className="metric-orbit" aria-label="Headline game metrics">
          <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
          <div className="metric-core"><span>THEORETICAL RTP</span><strong>{percent(theoretical.totalRtp)}</strong><small>exact expectation</small></div>
          <div className="orbit-note note-a"><b>{GAME.lines}</b><span>LINES</span></div>
          <div className="orbit-note note-b"><b>1/{theoretical.featureOdds.toFixed(1)}</b><span>FEATURE</span></div>
          <div className="orbit-note note-c"><b>{GAME.freeSpins}×{GAME.freeMultiplier}</b><span>FREE MODE</span></div>
        </div>
      </section>

      <section className="game-section" id="game">
        <div className="section-heading">
          <div><p className="eyebrow">INTERACTIVE MODEL</p><h2>Spin the same engine<br />used by the analysis.</h2></div>
          <p>The interface, exact calculations, and Monte Carlo runner all share one evaluation model—preventing presentation logic from drifting away from the math.</p>
        </div>
        <div className="cabinet">
          <div className="cabinet-header"><span>BASE GAME</span><strong>AURORA ARRAY</strong><span>10 LINES · 1.00 BET</span></div>
          <div className={`reel-window ${spinning ? "is-spinning" : ""}`}>
            {screen.map((reel, reelIndex) => (
              <div className="reel" key={reelIndex}>
                {reel.map((symbol, row) => {
                  const active = activeLines.some((lineNumber) => PAYLINES[lineNumber - 1][reelIndex] === row);
                  return <SymbolTile key={`${reelIndex}-${row}`} symbol={symbol} active={active} />;
                })}
              </div>
            ))}
          </div>
          <div className="cabinet-status" aria-live="polite"><span>{message}</span><strong>WIN {win.toFixed(2)}</strong></div>
          <div className="controls">
            <div className="control-readout"><span>BET</span><b>1.00</b></div>
            <button className="spin-button" onClick={handleSpin} disabled={spinning}>{spinning ? "SAMPLING" : "SPIN"}</button>
            <div className="control-readout"><span>FREE SPINS</span><b>{freeSpins}</b></div>
          </div>
          <p className="responsible-note">Portfolio demonstration only. No currency, wagering, account, or persistence.</p>
        </div>
      </section>

      <section className="math-section" id="math">
        <div className="section-heading inverse">
          <div><p className="eyebrow">MATHEMATICAL PROFILE</p><h2>Expectation first.<br />Simulation second.</h2></div>
          <p>The theoretical result is calculated from weighted symbol combinations and exact scatter-window convolution. Simulation is a separate verification layer.</p>
        </div>
        <div className="math-grid">
          <article className="metric-card featured"><span>TOTAL THEORETICAL RTP</span><strong>{percent(theoretical.totalRtp, 3)}</strong><p>Base {percent(theoretical.baseRtp)} + feature {percent(theoretical.featureRtp)}</p></article>
          <article className="metric-card"><span>FEATURE FREQUENCY</span><strong>1 in {theoretical.featureOdds.toFixed(2)}</strong><p>Three or more Signals in view</p></article>
          <article className="metric-card"><span>SINGLE-LINE HIT RATE</span><strong>{percent(theoretical.lineHitProbability)}</strong><p>Weighted over {theoretical.lineCombinations.toLocaleString()} combinations</p></article>
          <article className="metric-card"><span>MAX LINE AWARD</span><strong>100×</strong><p>Five Wilds at a 0.10 line wager</p></article>
        </div>

        <div className="simulator-panel">
          <div className="sim-copy"><p className="eyebrow">REPRODUCIBLE CHECK</p><h3>Monte Carlo runner</h3><p>50,000 base rounds using seed <code>20260718</code>. Feature rounds are included in return and dispersion.</p><button className="button primary" onClick={runSimulation}>Run verification</button></div>
          <div className="sim-results">
            {simulation ? <>
              <div><span>Observed RTP</span><b>{percent(simulation.rtp)}</b></div>
              <div><span>Spin hit rate</span><b>{percent(simulation.hitFrequency)}</b></div>
              <div><span>Feature rate</span><b>{percent(simulation.featureFrequency)}</b></div>
              <div><span>Std. deviation</span><b>{simulation.standardDeviation.toFixed(2)}×</b></div>
              <div className="distribution">
                {Object.entries(simulation.buckets).map(([bucket, count]) => <span key={bucket} style={{ height: `${Math.max(8, (count / simulation.iterations) * 130)}px` }} title={`${bucket}: ${count}`} />)}
              </div>
            </> : <div className="empty-result"><span>Σ</span><p>Run the fixed-seed sample to compare observed performance with the exact target.</p></div>}
          </div>
        </div>
      </section>

      <section className="details-section">
        <div className="paytable-block">
          <p className="eyebrow">PAYTABLE · LINE-BET MULTIPLIERS</p><h2>Compact by design.</h2>
          <div className="paytable">
            {Object.entries(PAYTABLE).map(([symbol, pays]) => <div className="pay-row" key={symbol}><SymbolTile symbol={symbol} /><div><span>3× <b>{pays[3 as keyof typeof pays]}</b></span><span>4× <b>{pays[4 as keyof typeof pays]}</b></span><span>5× <b>{pays[5 as keyof typeof pays]}</b></span></div></div>)}
          </div>
        </div>
        <div className="rules-block">
          <p className="eyebrow">RULE SET</p>
          <ol>
            <li><b>01</b><div><strong>Left-to-right line pays</strong><p>Highest valid award is selected per line. Wins begin on reel one.</p></div></li>
            <li><b>02</b><div><strong>Wild substitution</strong><p>Wild substitutes for every line symbol and also has its own award.</p></div></li>
            <li><b>03</b><div><strong>Signal feature</strong><p>Three or more Signals anywhere trigger nine free spins. Signals do not pay cash.</p></div></li>
            <li><b>04</b><div><strong>Free-mode multiplier</strong><p>All free-spin line wins pay at 2×. No retrigger keeps the expectation transparent.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="method-section" id="method">
        <p className="eyebrow">CLEAN-ROOM DEVELOPMENT</p><h2>Built to be explainable,<br />not merely playable.</h2>
        <div className="method-grid">
          <article><span>01</span><h3>Model</h3><p>Five original 40-stop strips share a controlled frequency profile while preserving distinct stop order.</p><small>{REEL_STRIPS.length} reels · {REEL_STRIPS[0].length} stops each</small></article>
          <article><span>02</span><h3>Evaluate</h3><p>A single engine resolves wild substitution, line awards, scatter counts, and feature rounds.</p><small>One source of truth</small></article>
          <article><span>03</span><h3>Prove</h3><p>Exact weighted enumeration establishes expectation; seeded simulation tests implementation behavior.</p><small>Exact + empirical</small></article>
          <article><span>04</span><h3>Communicate</h3><p>The case study exposes assumptions, formulas, limitations, and reproducible inputs.</p><small>Audit-ready documentation</small></article>
        </div>
        <div className="clean-room-statement"><strong>Independence statement</strong><p>Aurora Array is an independently created portfolio study using original code, parameters, strips, naming, visual design, and documentation. It contains no employer source code, internal tooling, proprietary game data, or confidential production assets.</p></div>
      </section>

      <footer><div><strong>AURORA ARRAY</strong><span>Independent slot-math portfolio study</span></div><p>Designed for professional review · Demonstration only</p></footer>
    </main>
  );
}
