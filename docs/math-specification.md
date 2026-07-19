# Aurora Array — Mathematical Specification

## 1. Scope and assumptions

Aurora Array is a five-reel, three-row, ten-line slot model. Each reel selects one uniformly distributed stop from a 40-stop circular strip. The visible window consists of the selected stop and the next two positions. Reel selections are mutually independent.

The total wager is 1.00, divided equally across ten lines. Line awards are expressed as line-bet multipliers. Only the highest valid award is paid on each line. Awards evaluate left to right from reel one. Wild substitutes for every line-paying symbol and has a standalone paytable. Signal is a scatter symbol and does not participate in line wins.

Three or more Signals anywhere in the 15-position window award nine free spins. All free-spin line awards are multiplied by two. Free spins cannot retrigger, and Signals have no cash value.

## 2. Reel profile

Every reel has the same symbol-frequency vector but a different stop order:

| Symbol | Code | Stops per reel |
| --- | --- | ---: |
| Aurora | A | 2 |
| Orbit | O | 3 |
| Comet | C | 4 |
| Luna | L | 5 |
| Crystal | R | 6 |
| Nova | N | 7 |
| Pulse | P | 8 |
| Wild | W | 2 |
| Signal | S | 3 |

The three Signal stops are separated so no three-row reel window can contain more than one Signal. A reel therefore shows a Signal with probability `9 / 40 = 0.225`.

## 3. Line expectation

For symbol tuple `x = (x1, …, x5)`, let `w(x)` be the product of its five reel frequencies and let `p(x)` be the highest line-bet multiplier awarded after Wild substitution. The exact expected return for one line is

`E[line] = Σx w(x) p(x) / 40^5`.

All paylines use one position from each reel. Because every vertical reel position has the same marginal symbol distribution, each line has the same expected line-bet return. Dividing the 1.00 wager equally across ten identical-expectation lines leaves the base-game RTP equal to the single-line expectation:

`R_base = 0.39630029296875`.

## 4. Feature probability

Because each reel can show at most one Signal, the number of visible Signals is the number of reels whose three-position window includes Signal. With independent reels and `p = 9/40`,

`P(feature) = Σ(k=3..5) C(5,k) p^k (1-p)^(5-k)`

`P(feature) = 0.07892279296875`, or approximately one trigger per 12.6706 base rounds.

The implementation calculates this by convolving each reel's observed scatter-window-count distribution. This remains correct even if future strip order permits more than one scatter in a reel window.

## 5. Feature and total expectation

Free spins use the same reel strips and line rules. They do not retrigger, so the feature contribution is a finite expectation:

`R_feature = P(feature) × 9 spins × 2 multiplier × R_base`

`R_feature = 0.5629882675576974`.

Therefore,

`R_total = R_base + R_feature`

`R_total = 0.9592885605264474`, or **95.928856%**.

## 6. Verification strategy

The implementation uses three complementary checks:

1. Structural tests verify strip length and symbol counts.
2. Exact analysis verifies base expectation and feature probability without random sampling.
3. A fixed-seed Monte Carlo test executes complete rounds and checks convergence within a predeclared tolerance.

Simulation does not establish theoretical RTP; it checks that implemented behavior is consistent with the independently derived target.

## 7. Known design limitations

- The return is feature-heavy and the trigger is frequent relative to many commercial products.
- The model excludes bonuses with retriggers, persistence, variable multipliers, jackpots, and jurisdiction-specific constraints.
- Reported single-line hit probability is exact; whole-screen hit rate and standard deviation are measured by simulation because line outcomes are correlated through the shared reel window.
- Maximum exposure shown in the interface refers to the maximum standalone line award at the configured line wager, not an absolute cap on a complete feature round.
