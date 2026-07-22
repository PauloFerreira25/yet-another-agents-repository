---
name: spring-boot-concept-subpackages
Scope: Before creating a package or adding a class to an existing feature package
description: When a feature package's sub-concept gets its own subpackage, how far the split reaches, and how it nests with layer-based subpackages.
---

## Trigger

A feature package's root can end up holding classes for more than one concept. Split a sub-concept into its own subpackage when it has its own `@Entity` and `@Repository` — that pairing is the signal that the sub-concept is a persistent aggregate in its own right, not merely a group of similarly-named classes.

A sub-concept with no entity+repository of its own does not trigger a subpackage on its own, no matter how many classes share its name prefix.

## Scope of the move

Once the trigger fires, move every class at the feature root that shares the sub-concept's name prefix into the new subpackage — not only the `@Entity` and `@Repository` that triggered it. A status enum, or any other class named after the same sub-concept, moves with them even though it would not have triggered the subpackage on its own.

## Naming

Name the subpackage after the sub-concept, following [[coding/java/naming]]: lowercase, no separators. `session.refreshtoken`, not `session.refresh_token` or `session.refreshToken`.

## Coexistence with layer subpackages

A concept subpackage is a full vertical slice: it nests its own `config`, `exception`, and `rest` subpackages exactly as described in [[architecture/spring-boot/supporting-objects]] — apply that rule's Configuration/Exception/Request-Response sections using the concept subpackage as the base package, not the feature root.

A class belongs under the concept subpackage only when it is specific to that sub-concept. A class that concerns the feature in general — not the sub-concept specifically — stays under the feature root's own `config`/`exception`/`rest`, even after the sub-concept gets its own subpackage.

A class outside the concept subpackage that used to construct or mutate the entity directly (because it used to live in the same package, before the split) loses that access once the entity moves. It does not regain access by widening the entity's constructor or mutators to `public` — see [[architecture/spring-boot/service-boundaries]] for how that caller delegates to the concept's own service instead.

Worked example: feature package `session` holds the general `Session*` classes; `SessionRefreshTokenNotFoundException` is specific to the `refreshtoken` sub-concept, so it lives in `session.refreshtoken.exception`. A general session exception unrelated to refresh tokens stays in `session.exception`.

## Retroactivity

This applies retroactively, not only to new code. Whenever a plan or review identifies an existing feature package that already meets the trigger above, include a refactor stage to reorganize it — do not defer the reorganization just because the affected code predates this rule.
