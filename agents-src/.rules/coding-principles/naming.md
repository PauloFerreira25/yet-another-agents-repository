---
name: naming
Scope: Before naming variables, functions, files, or writing comments
description: Naming conventions, comment discipline, and documentation standards
---

# Naming and Readability

## Naming

Use meaningful, descriptive names drawn from the problem domain.

Use full words. Abbreviations are acceptable only when widely recognized in the domain.

Never use single-letter names except for loop counters or well-known conventions (i, j, x, y).

Extract magic numbers and strings into named constants.

## Comments

Comment the "why" — the reasoning behind a decision, a constraint, a non-obvious invariant. Never comment the "how" — the code communicates that.

Never leave commented-out code in the codebase. Retrieve removed code from git history when needed.

Write comments that remain accurate regardless of future code changes. Never reference dates, versions, or temporary state in comments.

Update comments in the same commit that changes the corresponding behavior.

Write for future maintainers, not for the current moment.

## Documentation

Document public APIs and interfaces. Include usage examples for complex functionality.

Record trade-offs and alternatives considered in architecture documentation — not in inline comments.

Record historical context in commit messages, not in comments.
