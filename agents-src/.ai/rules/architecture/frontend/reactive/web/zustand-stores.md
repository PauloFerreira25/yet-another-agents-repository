---
name: zustand-stores
Scope: When creating a Zustand store
description: Multiple stores organized by DDD domain, never a single global store
---

Create one store per DDD domain. Never create a single global store with slices.

Place each store at `src/store/<domain>/<domain>.store.ts`.

```ts
// src/store/produto/produto.store.ts
import { create } from 'zustand'

type ProdutoState = {
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

export const useProdutoStore = create<ProdutoState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}))
```

Use Zustand only for client-side shared state: UI state, selected items, filters, user session data not derived from the server. Never store API responses in Zustand — that is the responsibility of TanStack Query.

When a component in one domain needs to react to state from another domain, pass values through component props or TanStack Query dependencies — never import one domain store into another.

## Accessing state outside React components

Hooks cannot be called outside React components. In contexts like router `beforeLoad`, use `.getState()` to read store state directly:

```ts
// correct — outside a component (e.g. router beforeLoad)
const { isAuthenticated } = useAuthStore.getState()

// wrong — hooks only work inside React components
const { isAuthenticated } = useAuthStore()
```
