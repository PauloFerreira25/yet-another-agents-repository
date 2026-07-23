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

Extract magic numbers, strings, and any other literal value into named constants — never limit this to numbers.

Before hardcoding a literal value, search the codebase for whether that value already exists as a named constant, a configuration value, or a variable already exposed at runtime. If it does, reuse that source — never introduce a second, independent literal for the same value. Two literals that represent the same value are a duplication risk: change one, forget the other, and they silently diverge.

Do not promote every duplicated literal into a new environment variable by default. An environment variable is only for a value that genuinely needs to differ between environments. When the value is fixed and already available as a single source of truth elsewhere in the codebase, reuse that source instead of adding a new one.

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
