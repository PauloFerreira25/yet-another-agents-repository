---
name: spring-boot-rest-objects
Scope: Before creating or naming a Request or Response class for a REST controller
description: Package placement and naming convention for controller Request/Response DTOs.
---

## Package

Request and Response classes live in a `rest` sub-package of the feature package that owns the controller — never alongside the controller itself, never in the feature's root package: `<feature-package>.rest`.

Before applying this, check whether the feature package has been split by concept — see [[architecture/spring-boot/concept-subpackages]]. When it has, `<feature-package>` above means the concept subpackage that owns this Request/Response pair, not necessarily the feature root.

## Naming

Every class name follows `<Domain><Operation><Request|Response>`:

- `<Domain>` is the entity the feature package represents. It is never a fixed literal — it changes with every feature.
- `<Operation>` is the action the controller method performs, taken from the method's own name — not its HTTP verb. PATCH/PUT endpoints can represent distinct business operations; each gets its own operation name, never collapsed into one generic "Update".

Never a shared, generic `<Domain>Request`/`<Domain>Response` reused across multiple endpoints — each operation gets its own Request/Response pair, even when the payload shape is identical to another operation's.

Not every operation needs both a Request and a Response class. Create only the one the operation actually uses — never invent an empty class just to keep the pair symmetrical. A `GET` bound entirely from path or query parameters has no Request class. A `DELETE` (or any endpoint) that returns no body has no Response class; return `ResponseEntity<Void>` instead.

## Worked example

The following applies the rule above to one feature, `UserAccount` — used here only as an example; the same pattern applies to `Product`, `Catalog`, `Order`, or any other feature.

Feature package `com.example.user.account` holds the controller; its Request/Response classes live in `com.example.user.account.rest`.

| Controller method | Request | Response |
|---|---|---|
| `createAccount` | `UserAccountCreateRequest` | `UserAccountCreateResponse` |
| `updateAccount` | `UserAccountUpdateRequest` | `UserAccountUpdateResponse` |
| `updateAccountStatus` | `UserAccountUpdateStatusRequest` | `UserAccountUpdateStatusResponse` |
