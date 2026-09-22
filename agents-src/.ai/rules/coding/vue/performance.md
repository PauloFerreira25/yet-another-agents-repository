---
name: vue-performance
Scope: When considering computed, watch, shallowRef, or any other performance optimization
description: Correct reactivity first, measurement before optimization, and watch as a last resort.
---

Most performance work in Vue is not optimization, it is using reactivity correctly.

**Derive with `computed`.** Anything calculable from existing state is a `computed`. It caches on its dependencies and recalculates only when they change.

**Never derive with `watch`.** A watcher that sets one piece of state from another creates a second source of truth, an extra render pass, and an ordering problem. Use `watch` only for genuine side effects: reacting to a change by doing something outside the reactive system.

**Never call a function in a template to compute a value.** It runs on every render with no caching. That is what `computed` is for.

## Before optimizing anything else

**Measure first.** Never apply an optimization on suspicion. Profile, identify what is actually slow, and confirm the change helped. An optimization applied without evidence adds complexity and usually moves nothing.

**Confirm with the human before optimizing.** Optimizations make code harder to read and harder to change. That trade is the human's to accept, not yours to make silently.

## When measurement points somewhere

`shallowRef` and `shallowReactive` stop deep reactivity conversion for large structures the application replaces wholesale rather than mutating. Use them when profiling shows the conversion cost, never by default.

`v-memo` skips re-rendering a subtree whose dependencies have not changed. It is a sharp tool with easy mistakes; use it only where a measured hot path justifies it.

Long lists need virtualization rather than micro-optimization. Rendering thousands of rows is the problem, and no amount of memoization fixes it.

Route-level code splitting is the exception to "measure first": it is structural, and splitting on route boundaries is correct by default.

Never leave a `console` call or a development-only check in a production path. See [[coding/vue/logger]].
