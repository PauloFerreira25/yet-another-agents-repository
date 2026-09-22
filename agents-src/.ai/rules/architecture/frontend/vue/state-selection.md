---
name: vue-state-selection
Scope: When deciding where to store application state
description: The three-way decision between component-local reactive state, a Pinia store, and the Pinia Colada cache.
---

Apply this decision in order, and stop at the first match:

1. **Is this a copy of data the backend owns?** Data fetched from an API, needing caching, revalidation or invalidation.
   → It belongs in the Pinia Colada cache. See [[coding/vue/query-patterns]].

2. **Does more than one component need this?**
   → It belongs in a Pinia store for its domain. See [[architecture/frontend/vue/pinia-stores]].

3. **Does only this component need it?**
   → It stays in the component, as `ref` or `reactive`.

## The boundary that matters

Pinia holds what the application itself owns and invents: the authenticated session, loaded permissions, a theme preference, filters that persist across screens, the progress of a multi-step flow.

Pinia Colada holds copies of what the backend owns.

Pinia Colada runs on the same Pinia instance, so nothing technically prevents mixing them. The separation is a discipline, and it is the one that keeps the application correct:

**Never copy the result of a query into a hand-written store.** The moment server data is duplicated into a store, the cache can no longer keep it fresh, invalidation after a write stops reaching it, and two sources of truth diverge silently.

**Never use `ref` as a cache for an API response.** A `ref` populated in `onMounted` has no deduplication, no revalidation and no invalidation, and it re-fetches on every remount.

**Never promote state to a store preemptively.** State starts in the component. It moves to a store when the second consumer actually appears, not when one is imagined.
