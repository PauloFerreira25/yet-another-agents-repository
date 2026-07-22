---
name: spring-boot-service-boundaries
Scope: Before a @Service injects a @Repository, or constructs/mutates an @Entity, that belongs to a different package
description: One entity's business rules are owned by exactly one @Service; every other @Service must delegate to it instead of reaching into its @Repository or @Entity directly.
---

## Ownership

Every `@Entity` has exactly one owning `@Service` — the one that lives in the same package as its `@Entity` and `@Repository`. Only that service may inject the `@Repository`, construct the `@Entity`, or call its mutators.

## Rule

A `@Service` may only inject and use the `@Repository` that lives in its own package, and may only construct or mutate the `@Entity` that lives in its own package.

When a `@Service` needs to read or change state owned by an entity in a different package, it must inject that package's own `@Service` and call it. Never inject another package's `@Repository` directly. Never construct or call a mutator on another package's `@Entity` directly, even when the compiler would allow it (e.g. the mutator happens to be `public`, or both classes currently sit in the same package).

This is the mechanism that keeps a business rule from being duplicated across services: if two services would otherwise both need to implement "how to create or mutate this entity," only one of them is allowed to — the entity's owning service — and every other caller goes through it instead of reimplementing the rule.

## Where the owning service lives

The owning service lives in the same package as the `@Entity` and `@Repository` it owns — see [[architecture/spring-boot/concept-subpackages]] for how that package is chosen when the entity belongs to a sub-concept split out of a feature package. A companion `@Service` introduced solely to satisfy this rule is itself a class specific to that sub-concept, and belongs in its subpackage the same way its `@Entity`, `@Repository`, exceptions, and REST DTOs do.

## Naming

Name the owning service after the concept it owns: `<Concept>Service` — for example `RefreshTokenService`, `FinancialSpaceInviteDeclineCounterService`.

## API shape — how much of the entity to expose

Default to hiding the entity completely: express the owning service's methods in primitives, records, booleans, or `void` — never let a caller outside the entity's package receive the entity type back.

Return the entity itself — for the caller to read its public accessors, never to mutate it — only when the caller's own decision genuinely depends on combining that entity's state with the caller's own aggregate's state, and no simpler primitive or record answer captures that combined decision (see [[coding-principles/design]]'s smallest-surface principle). This is the exception, not the default; most owning-service methods should return a `boolean`, `void`, or other primitive result.

## Worked examples

`FinancialSpaceInviteDeclineCounterService` (in `space.member.invitedeclinecounter`) exposes `boolean isBlocked(...)`, `void increment(...)`, `void reset(...)`. `FinancialSpaceMemberService` never sees `FinancialSpaceInviteDeclineCounterEntity` at all — this is the default shape.

`RefreshTokenService` (in `session.refreshtoken`) exposes `findByPresentedToken(...)`, which returns `RefreshTokenEntity` itself, because `SessionService.renewToken` must combine the refresh token's status with `SessionEntity`'s own state to detect reuse — a decision no single aggregate's service can make alone. `RefreshTokenEntity`'s constructor and mutators stay package-private to `session.refreshtoken`; only its public getters are reachable from `SessionService`.
