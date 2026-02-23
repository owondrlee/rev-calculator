# God-tier Mental Models (For Building Fast Without Rot)

## 1) Complexity is the real cost
Every conditional, flag, and special case is rent you pay forever.
Spend complexity only when it buys simplicity elsewhere.

## 2) Build primitives, not piles
Create a few strong building blocks (primitives).
Features should be compositions of primitives, not bespoke one-offs.

## 3) Local reasoning wins
The best code can be understood locally.
If you need to chase references across the repo, the design is coupling.

## 4) Boundaries are everything
Keep the "edges" clean:
- UI ↔ domain logic
- domain logic ↔ IO (DB/network)
Most bugs live at boundaries; keep them explicit.

## 5) Make states explicit
If the system has states, model them clearly.
Avoid “implicit state” hidden in booleans scattered across files.

## 6) Prefer linear flow
Flatten nesting.
Guard clause early.
Aim for code that reads top-to-bottom like a story.

## 7) Design for deletion
If removing a feature is painful, architecture is too entangled.
Good systems make removal easy.

## 8) Optimize for change, not for imagination
Don’t build for a hypothetical future.
Build for the next 1–3 iterations and keep it clean so change is cheap.

## 9) Separate “policy” from “mechanism”
Policy = what we want (rules, decisions).
Mechanism = how it happens (implementation).
Keep them separate so policy can evolve without rewrites.

## 10) The refactor trigger
Refactor when:
- you must explain code in comments,
- a function exceeds ~40–60 lines,
- changes require touching many unrelated files,
- or a bug fix adds another “if”.

If the refactor becomes hard: rewrite the module.

## 11) Simple scaling heuristic
Ask:
- What breaks at 10× usage?
- What breaks at 100× usage?
Only fix the first obvious bottleneck; keep everything else simple.
