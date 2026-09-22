---
name: vue-type-organization
Scope: When creating or locating TypeScript types
description: Canonical domain types live in app/types/<domain>/ and are defined by the domain, never by the shape of an API response.
---

Domain types live in `app/types/<domain>/`, one directory per DDD domain, with singular directory and file names.

Types shared across domains live in `app/types/common/`, grouped by concern — errors, pagination, notification.

**A domain type is defined by the domain, not by the backend.** Never declare a type by transcribing an API response. The backend's shape is an implementation detail of the backend, and mirroring it propagates every one of its inconsistencies through the whole application.

Where the API's shape differs from the domain's, the difference is absorbed in the service layer, which maps one into the other — see [[architecture/frontend/vue/service-layer]]. A response type used only for that mapping stays inside the service that performs it and is never exported to the rest of the application.

Never define a domain type inside a component, a store or a composable. Those consume domain types; they do not own them.

Never use `any` to bridge a shape you have not modeled. See [[coding/typescript/type-safety]].

Component prop and emit types are declared inline at the component, not in `app/types/` — they describe one component's interface, not the domain.
