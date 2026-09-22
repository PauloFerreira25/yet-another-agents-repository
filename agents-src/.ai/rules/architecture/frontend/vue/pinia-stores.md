---
name: vue-pinia-stores
Scope: When creating a Pinia store
description: One setup store per DDD domain, holding only client-owned state.
---

Write stores in the setup form, which reads like a composable and types without ceremony:

```ts
// app/stores/session.ts
export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  function signOut() {
    user.value = null
  }

  return { user, isAuthenticated, signOut }
})
```

Never use the options form.

One store per DDD domain. Never create a single global store holding unrelated concerns, and never create a store per component.

Name the file after the domain, singular: `app/stores/session.ts`, `app/stores/order.ts`. Export a composable named `use<Domain>Store`.

**A store holds only state the application owns.** Never place server data in a store — see [[architecture/frontend/vue/state-selection]] for the boundary and why it matters.

Never call the backend from a store. Stores hold state; services call the backend. A store that needs data from an API receives it from the caller, or the caller reads it from a query instead.

Derive rather than duplicate. Anything computable from existing state is a `computed`, never a second piece of state kept in sync by hand.

Never reach into another store's internals from a store. Where two domains genuinely interact, the coordination belongs in the component or composable that owns the interaction.
