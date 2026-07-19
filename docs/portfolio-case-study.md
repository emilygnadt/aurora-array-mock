# Portfolio Case Study: Aurora Array

## The brief

Create a compact slot-game demonstration that shows mathematical design and software-development ability without relying on proprietary code, production data, internal tools, or confidential assets.

## Approach

The project is structured as a miniature end-to-end game-math engagement. It begins with a deliberately narrow rule set, uses a feature structure whose expectation can be explained in one equation, and applies an original frequency profile across five distinct reel-strip orders. The outcome engine is separated from the presentation layer.

The exact model and playable game share the same strips, paytable, line definitions, and award evaluator. This reduces a common implementation risk: maintaining one version of the rules for presentation and another for analysis.

## Important design decision

The free-spin feature carries more than half of total return. That would require careful experiential review in a commercial product, but it serves this portfolio well. The model makes feature contribution visibly dependent on three understandable variables: trigger probability, number of awarded trials, and win multiplier.

The final theoretical RTP is 95.928856%. The model was not tuned against simulation output. Exact expectation determined the target; simulation was retained as a separate implementation check.

## Engineering decisions

- Deterministic seeded random generator for reproducible samples
- Pure evaluation functions with no UI dependency
- Frequency-compressed exact line enumeration
- General scatter-window convolution rather than a hard-coded binomial result
- Welford's online algorithm for simulated payout variance
- Automated tests for strips, Wild behavior, exact results, and statistical agreement
- Responsive, accessible interface with reduced-motion support

## Production extensions

A production engagement would add jurisdiction-specific requirements, approved random-number interfaces, formal PAR-sheet outputs, larger simulation campaigns with confidence intervals, game-event logging, boundary and malformed-input tests, independent model review, localization, accessibility review, and certification-support artifacts.

## Clean-room statement

This project was created independently using original parameters, source code, reel strips, naming, visual treatment, and written analysis. It does not use or disclose employer intellectual property.
