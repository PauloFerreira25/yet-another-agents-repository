---
name: vue-composables
Scope: When extracting logic into a composable
description: Extract on the second use, name for what the caller gets, and keep domain composables separate from generic ones.
---

**Extract on the second use, not the first.** Logic written once stays where it is used. A composable created in anticipation of reuse fixes an interface before the second case has shown what it needs.

Name a composable `use<Thing>`, for what the caller receives rather than for what happens inside.

## Placement

Generic composables that work with any domain are grouped by category:

```
app/composables/error/
app/composables/form/
```

Domain composables, which reference a specific service or store, live under the domain, singular:

```
app/composables/product/
```

A composable is domain-specific exactly when it names a domain. If it does not, it is generic, and putting it under a domain makes it invisible to the next caller.

## Discipline

Return plain refs and computed values. Never return a reactive object that callers must destructure carefully to keep reactivity.

Never call a composable conditionally, or inside a loop or callback. Composables run during setup, like every other composition function.

Clean up what you create. A composable that registers a listener, an observer or an interval removes it on scope disposal — or, better, uses the VueUse equivalent that already does, per [[coding/vue/vueuse-first]].

Never issue an HTTP request from a composable. A composable may wrap a query — that is the sanctioned way to share one query across components, per [[coding/vue/query-patterns]] — but the request itself is made by a service, which the query delegates to. A composable that builds a URL, a header or a request body has taken over the service layer's job, and every component using it now depends on the transport.
