---
name: state-selection
Scope: When deciding where to store application state
description: Criterion for choosing between local state, Zustand, and TanStack Query
---

Apply this decision in order:

1. **Is this server data?** (fetched from an API, needs caching, background sync, or invalidation)
   → Use TanStack Query. Never mirror server data into Zustand or `useState`.

2. **Is this state shared across more than one component?**
   → Use Zustand. Create or update the domain store for this data.

3. **Is this state used only by a single component?**
   → Use `useState` (or `useReducer` for complex local transitions).

Never store server state in Zustand. Never use `useState` as a cache for API responses. Never lift state into Zustand preemptively — only when the second component that needs it appears.
