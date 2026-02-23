# Claude Instructions for This Repo

Read these files first:
- /ai-brain/engineering-constitution.md
- /ai-brain/prompting-standards.md
- /ai-brain/mental-models.md
- /DECISIONS.md (if present)

Working style:
- Prefer minimal diffs for existing code.
- Prefer deletion and consolidation over adding layers.
- If requirements are unclear, ask up to 5 questions; otherwise proceed with stated assumptions.
- If you detect rising complexity, propose a rewrite of the module rather than bandaids.

Output requirements:
- Show changed files only.
- Include brief reasoning about tradeoffs for architectural changes.
- Add tests for business-critical logic and bug regressions when feasible.
