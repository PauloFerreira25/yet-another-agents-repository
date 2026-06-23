---
name: code-quality
Scope: When resolving TypeScript errors, lint errors, or warnings
description: Never suppress diagnostics — always fix the root cause; escalate to the human when the fix would require an anti-pattern
---

Never suppress TypeScript errors or lint warnings with comments. The following are forbidden:

```ts
// @ts-ignore
// @ts-expect-error
// oxlint-disable
// oxlint-disable-next-line
// eslint-disable
// eslint-disable-next-line
```

Always fix the root cause. A suppression comment hides a problem without solving it — the next engineer will not know why the warning exists or whether it is still valid.

## When the fix is not obvious

Diagnose before acting:

1. Read the full error message and understand what the compiler or linter is enforcing
2. Identify why the code triggers the rule — not just where
3. Fix the underlying issue: wrong type, missing import, incorrect usage, or a misunderstanding of the API

## When the fix would require an anti-pattern

If fixing the error correctly would require introducing a pattern that conflicts with the project's architecture or another rule — stop. Do not suppress and do not implement the anti-pattern. Explain the conflict to the human and wait for a decision:

- Describe what the error is
- Describe why the straightforward fix is problematic
- Present the options, including trade-offs
- Never pick an option unilaterally when the trade-off affects architecture or maintainability

## Definition of done

A task is not complete while TypeScript errors, lint errors, or lint warnings remain unresolved. Run `tsc -b` and `npm run lint` before declaring any work finished.
