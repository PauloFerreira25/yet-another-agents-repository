---
name: dependencies
Scope: Before introducing or adopting a dependency or pattern from existing code
description: Dependency injection and pattern representativeness rules
---

# Dependencies

## Injection

Inject external dependencies as parameters — constructor injection for classes, function parameters for procedural or functional code.

Depend on abstractions, not concrete implementations. Minimize inter-module dependencies.

Never hardcode external dependencies inside a function or class body when they can be injected.

## Reference Representativeness

When adopting a pattern, API, or dependency from existing code:

- If referencing only 2–3 nearby files, confirm the pattern is representative by checking usage across the repository before adopting it.
- If multiple approaches coexist in the repository, identify the majority pattern and make a deliberate choice — selecting whichever is nearest is not sufficient.
- If adopting an external dependency, verify repository-wide usage distribution for the same dependency. If the appropriate version cannot be determined from repository state alone, escalate.
- If following an existing pattern when an alternative exists, state the reason (e.g. consistency with surrounding code, avoiding breaking changes, pending coordinated update).

Nearby code is a starting point for investigation, not a sufficient basis for adoption. Verify that what you reference is representative of the repository's conventions and current best practices before using it as a model.
