# Engineering Constitution (Non-Negotiables)

This repository is built under the following rules. If a request conflicts with these rules, STOP and propose a compliant alternative.

## 1) Clarity is the product
- Prefer boring, readable code over clever code.
- Choose names that make the code self-explanatory.
- If a piece of logic needs a comment to be understood, refactor until it doesn’t.

## 2) Delete > Bandaid
- Before adding new code, remove obsolete code.
- If a fix introduces more conditionals, more flags, or more coupling: propose a rewrite of the affected module.
- When uncertain: simplify, consolidate, delete.

## 3) Local reasoning
- A developer should understand a file in isolation.
- Avoid hidden cross-file side effects.
- Keep functions small and predictable.

## 4) Single responsibility
- One module = one job.
- Split UI, domain logic, and IO (DB/network) concerns.
- No “god files.”

## 5) Explicit boundaries
- Inputs/outputs should be explicit.
- Avoid implicit global state mutations.
- Prefer pure functions where possible.

## 6) Error handling is part of the API
- Fail loudly and early with useful messages.
- Validate inputs at boundaries.
- Never swallow exceptions without a clear reason and logging.

## 7) Minimal dependencies
- Add a dependency only if it meaningfully reduces complexity.
- Prefer built-in platform features and small libraries.
- No dependencies for “convenience” if they add long-term risk.

## 8) Maintainability over premature optimization
- Optimize only when measured or clearly necessary.
- Keep architecture simple until scale demands complexity.
- Add caching/queues only when there is a demonstrated bottleneck.

## 9) Testing strategy (lightweight but real)
- Add tests for business-critical logic and bug regressions.
- Prefer fast unit tests for core logic; integration tests for boundaries.
- If testing is heavy, simplify the design until it becomes easy to test.

## 10) Security & privacy defaults
- Never log secrets.
- Use least-privilege permissions.
- Treat user data as toxic: minimize collection, minimize retention.

## 11) Definition of “done”
A change is done when:
- it works,
- it is readable,
- it does not increase conceptual complexity,
- and it is easy to remove later.
