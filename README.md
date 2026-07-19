# Aurora Array

Aurora Array is an original slot math portfolio project. It combines a playable 5×3 game, a shared outcome engine, exact theoretical analysis, deterministic Monte Carlo verification, automated tests, and a concise mathematical case study.

## Portfolio intent

This project demonstrates the full quantitative-development loop:

1. Translate a compact rule set into an explicit mathematical model.
2. Construct reel strips and a paytable against a target return profile.
3. Implement one outcome engine shared by gameplay and analysis.
4. Calculate expectation independently of simulation.
5. Use deterministic simulation and automated tests as verification layers.
6. Communicate assumptions, limitations, and reproducible inputs.

## Game summary

- 5 reels × 3 rows
- 10 fixed paylines
- 1.00 total wager; 0.10 per line
- Wild substitutes for all line-paying symbols
- 3+ Signal scatters award 9 free spins
- Free-spin line wins pay at 2×
- No scatter cash award and no retrigger
- Exact theoretical RTP: **95.928856%**

## Mathematical profile

| Measure | Result |
| --- | ---: |
| Base-game RTP | 39.630029% |
| Feature RTP | 56.298827% |
| Total RTP | 95.928856% |
| Feature probability | 7.892279% |
| Feature odds | 1 in 12.6706 |
| Single-line hit probability | 4.595313% |

## Verification

The exact model enumerates the 102,400,000 weighted five-reel symbol combinations for a single payline in compressed frequency form. Scatter-window distributions are calculated per reel and convolved to obtain exact feature probability. A fixed-seed Monte Carlo runner then exercises complete base and feature rounds through the same engine used by the playable interface.

Run the tests with `npm test` and create a deployment build with `npm run build`.

## Repository map

- `lib/gameMath.js` strips, paytable, rules, outcome evaluation, exact analysis, and simulation
- `app/GamePortfolio.tsx` interactive portfolio presentation
- `tests/gameMath.test.mjs` strip, substitution, expectation, and simulation checks
- `docs/math-specification.md` model assumptions and derivation

## Independence statement

Aurora Array was independently created for portfolio use with original code, parameters, reel strips, names, visual design, and documentation. It contains no employer source code, internal tooling, proprietary game data, confidential production assets, or reverse-engineered implementation details.

This project is a mathematical and software demonstration only. It includes no real-money wagering, wallet, account, persistence, or commercial gambling service.
