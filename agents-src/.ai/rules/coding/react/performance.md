---
name: performance
Scope: When considering useMemo, useCallback, React.memo, or other performance optimizations
description: Optimize only when profiler evidence shows a problem; never memoize by default
---

Never add `useMemo`, `useCallback`, or `React.memo` without explicitly validating with the human first — even when a situation seems to call for it. Never remove existing memoization without the same validation. The human decides; the agent proposes.

Optimization candidates must be backed by evidence: React DevTools Profiler or browser performance tools showing a concrete problem — a component rendering too frequently, a computation taking measurable time, or a child re-rendering when its props have not changed.

When optimization is warranted:

- `useMemo` — for computations that are demonstrably slow (sorting/filtering large arrays, complex derivations). Not for simple mappings or object literals.
- `useCallback` — only when passing a function to a child wrapped in `React.memo`. Without `React.memo` on the child, `useCallback` has no effect.
- `React.memo` — for components that render frequently with the same props and the render cost is measurable. Always profile before wrapping.

```ts
// wrong — memoizing without evidence
const items = useMemo(() => data.map(d => ({ ...d, label: d.nome })), [data])

// correct — only if profiler shows this computation is slow
const sortedItems = useMemo(() => [...data].sort(compareFn), [data])
```

The default React rendering model is sufficient for most UI work. Reach for memoization as a last resort, not a first instinct.
