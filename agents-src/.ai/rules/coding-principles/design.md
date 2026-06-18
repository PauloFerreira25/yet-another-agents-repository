---
name: design
Scope: Before making design decisions, introducing abstractions, or structuring code
description: Simplicity, function size, code organization, refactoring, and performance
---

# Design

## Simplicity

Choose the simplest solution that meets current requirements. Never design for hypothetical future needs (YAGNI).

When introducing any of the following — persistent state, public or cross-boundary fields, behavioral flags or modes, reusable abstractions, component splits — select the smallest design surface that covers the current requirements and accepted technical constraints. Justify adoption by naming a current requirement that smaller alternatives fail to cover.

## Functions

Each function does one thing. Keep functions under 50 lines. Extract complex logic into separate, well-named functions. Functions should operate at a single level of abstraction.

Use 0–2 parameters per function. When a function requires 3 or more parameters, group related ones into a dedicated structure (object, struct, record, or equivalent in the language).

Prefer pure functions — no side effects. Separate data transformation from side effects.

Use early returns to reduce nesting. Keep nesting to a maximum of 3 levels; extract deeper logic into named functions.

## Code Organization

Group related functionality together. Separate domain logic, data access, and presentation. Avoid files exceeding 500 lines — split by responsibility.

One primary responsibility per file.

## Unused Code

Delete unused code immediately. Never comment it out — git history preserves it.

## Refactoring

Refactor related code within each change set — address naming, style, or structure issues in the files being modified.

Refactor when: code is duplicated, a function exceeds 50 lines, conditional logic is complex, or naming is unclear.

Make one change at a time. Keep tests passing throughout. Never aim for perfection in a single pass.

## Performance

Profile before optimizing. Never optimize during initial development without a measured bottleneck.

Prefer algorithmic improvements over micro-optimizations. Choose data structures based on access patterns. Handle memory, connections, and files properly.
