---
name: spring-boot-exception-objects
Scope: Before creating or naming an exception class for a feature
description: Package placement and naming convention for domain exception classes.
---

## Package

Exception classes live in an `exception` sub-package of the feature package that owns them — never alongside the domain, service, or controller classes themselves, never in the feature's root package: `<feature-package>.exception`.

Before applying this, check whether the feature package has been split by concept — see [[architecture/spring-boot/concept-subpackages]]. When it has, `<feature-package>` above means the concept subpackage that owns this exception, not necessarily the feature root.

## Naming

Every class name follows `<Domain><Reason>Exception`:

- `<Domain>` is the entity the feature package represents. It is never a fixed literal — it changes with every feature.
- `<Reason>` is the specific failure condition, taken from the business rule being violated — never a generic term.

Never a shared, generic `<Domain>Exception` reused across multiple failure conditions — each distinct failure gets its own exception class.

## Cross-cutting exceptions

A genuinely cross-cutting exception — used by two or more features, with no business logic specific to a single feature (e.g. a generic "resource not found" or "invalid argument" condition) — does not belong in any `<feature-package>.exception`. It lives outside the feature structure instead:

- Check first whether the organization already maintains a shared library for this purpose (common across services) — reuse it rather than duplicating the convention inside this project.
- Only if no such library exists, place it in a shared package of this project (e.g. `<shared-package>.exception`).

This is the only case where a generic exception name is acceptable, since the exception is not tied to a single domain.

Before treating an exception as cross-cutting, confirm it is genuinely free of feature-specific logic. An exception that happens to share a name across two features but represents a different business rule in each is not cross-cutting — it stays per-feature, named per the convention above.

## Base class

Before creating a new exception class, determine the project's existing convention by searching the codebase for other exception classes already in use (e.g. search for files or classes named `*Exception`), in this order:

1. Inspect what those existing exceptions extend. If they already extend a class imported from a shared or external library (a package outside this project's own source tree), reuse that same base class — do not introduce a second, competing base class.
2. If no shared-lib base is in use, search for a project-local abstract exception class extending `RuntimeException` (or `Exception`) that lives outside any feature's `exception` sub-package — typically in a `common`/`shared` package (e.g. `DomainException`, `BusinessException`). That is this project's base exception, if one exists — extend it.
3. Only if neither a shared-lib base nor a project-local base exception is found anywhere in the codebase, extend `RuntimeException` directly.

Never invent a new shared base class without completing this search first. A base class already used by other exceptions in the project — whether from a shared library or defined locally — always takes precedence over creating a new one.

See [[architecture/spring-boot/error-handling]] for how these exceptions are mapped to HTTP responses in the `@ControllerAdvice`.

## Worked example

The following applies the rule above to one feature, `UserAccount` — used here only as an example; the same pattern applies to `Product`, `Catalog`, `Order`, or any other feature.

Feature package `com.example.user.account` holds the domain and service classes; its exception classes live in `com.example.user.account.exception`.

| Failure condition | Exception class |
|---|---|
| Account does not exist | `UserAccountNotFoundException` |
| Account already exists | `UserAccountAlreadyExistsException` |
| Account status transition is invalid | `UserAccountInvalidStatusTransitionException` |
