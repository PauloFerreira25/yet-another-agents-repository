---
name: spring-boot-config-objects
Scope: Before creating or naming a @Configuration class for a Spring Boot project
description: Package placement and naming convention for @Configuration classes.
---

## Package

`@Configuration` classes live in a `config` sub-package of the feature package they configure —
never in the feature's root package: `<feature-package>.config`.

## Naming

Name a configuration class after the technical concern it wires, not after the domain it happens
to sit under — `<Concern>Config`. Unlike Request/Response or Exception classes, a configuration
class is about a technical integration, not a business operation, so it does not follow the
`<Domain><X>` naming pattern used elsewhere.

## Cross-cutting configuration

A genuinely cross-cutting configuration class — wiring something used by two or more features,
with no logic specific to a single feature (e.g. a global CORS policy, a shared `ObjectMapper`
bean, actuator/observability setup) — does not belong in any `<feature-package>.config`. It lives
outside the feature structure instead, in a shared package of this project (e.g.
`<shared-package>.config`).

Before treating a configuration class as cross-cutting, confirm it is genuinely free of
feature-specific logic. A messaging-topology config that only declares the queues one feature's
own pipeline uses is feature-scoped, even though the underlying messaging system is shared
infrastructure — what matters is whether the *content* is specific to one feature, not whether
the underlying technology is shared.

## Worked example

The following applies the rule above to one feature, `UserAccount` — used here only as an
example; the same pattern applies to `Product`, `Catalog`, `Order`, or any other feature.

Feature package `com.example.user.account` holds the domain, service, and controller classes;
its configuration classes live in `com.example.user.account.config` — for example, a config
class wiring an external service client this feature depends on (`<ExternalService>Config`), or
one declaring this feature's own messaging topology (`<MessagingSystem>Config`).
