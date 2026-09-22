---
name: vue-dev-mock-data
Scope: When simulating backend data or building UI without a real backend endpoint
description: Simulated data lives only in the service layer, in a separate file, and never leaks into components or tests of real behavior.
---

When an endpoint does not exist yet, simulate it in the service layer and nowhere else. The rest of the application must not be able to tell the difference — that is the whole point of the boundary. See [[architecture/frontend/vue/service-layer]].

Keep the simulation in its own file beside the real service, named so its nature is obvious at a glance:

```
app/services/product/product.service.ts
app/services/product/product.service.mock.ts
```

The mock returns the same canonical domain types as the real service, with the same method signatures. A mock returning a different shape defers the integration problem instead of removing it, and the shape mismatch surfaces later as a rewrite.

**Never put simulated data in a component, a store, a page or a composable.** Data hard-coded upward of the service layer has to be hunted down when the endpoint arrives, and some of it is always missed.

Select between real and mock in one place, through configuration, never by editing call sites.

Simulate delay and failure, not just the happy path. A mock that resolves instantly hides every loading state and every error path, and those are found on the day the real endpoint appears.

**Never ship a mock into production.** Before the work is considered done, state explicitly which mocks are in place and what has to happen for each to be removed.

Test fixtures are a separate concern and are not governed by this rule — see [[coding/vue/testing]].
