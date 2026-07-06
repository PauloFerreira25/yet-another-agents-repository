---
name: java-code-quality
Scope: When resolving compiler warnings, Checkstyle errors, or static analysis findings in Java
description: Never suppress diagnostics — always fix the root cause; escalate to the human when the fix would require an anti-pattern.
---

Never suppress Java diagnostics with annotations or comments. The following are forbidden:

```java
@SuppressWarnings("unchecked")
@SuppressWarnings("rawtypes")
@SuppressWarnings("deprecation")
// NOSONAR
// CHECKSTYLE:OFF
// CHECKSTYLE:ON
```

Always fix the root cause. A suppression hides a problem without solving it — the next engineer will not know why the warning exists or whether it is still valid.

## When the fix is not obvious

Diagnose before acting:

1. Read the full compiler or tool message and understand what is being enforced
2. Identify why the code triggers the rule — not just where
3. Fix the underlying issue: wrong type, unsafe cast, deprecated API usage, or a misunderstanding of the API

## When the fix would require an anti-pattern

If fixing the warning correctly would require introducing a pattern that conflicts with the project's architecture or another rule — stop. Explain the conflict to the human and wait for a decision:

- Describe what the warning is
- Describe why the straightforward fix is problematic
- Present the options, including trade-offs
- Never pick an option unilaterally when the trade-off affects architecture or maintainability

## Definition of done

A task is not complete while compiler warnings, Checkstyle errors, or static analysis findings remain unresolved.
