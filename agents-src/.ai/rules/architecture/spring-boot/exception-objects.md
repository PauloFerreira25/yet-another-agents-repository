---
name: spring-boot-exception-objects
Scope: Before creating or naming an exception class for a feature
description: Package placement and naming convention for domain exception classes.
---

## Package

Exception classes live in an `exception` sub-package of the feature package that owns them — never alongside the domain, service, or controller classes themselves, never in the feature's root package: `<feature-package>.exception`.

## Naming

Every class name follows `<Domain><Reason>Exception`:

- `<Domain>` is the entity the feature package represents. It is never a fixed literal — it changes with every feature.
- `<Reason>` is the specific failure condition, taken from the business rule being violated — never a generic term.

Never a shared, generic `<Domain>Exception` reused across multiple failure conditions — each distinct failure gets its own exception class.

## Base class

Before creating a new exception class, check whether the project already has a common base exception (e.g., `DomainException`, `BusinessException`) that domain exceptions extend. Only if the project has no such base class, extend `RuntimeException` directly. Never invent a new shared base class without first confirming none already exists.

See [[architecture/spring-boot/error-handling]] for how these exceptions are mapped to HTTP responses in the `@ControllerAdvice`.

## Worked example

The following applies the rule above to one feature, `UserAccount` — used here only as an example; the same pattern applies to `Product`, `Catalog`, `Order`, or any other feature.

Feature package `com.example.user.account` holds the domain and service classes; its exception classes live in `com.example.user.account.exception`.

| Failure condition | Exception class |
|---|---|
| Account does not exist | `UserAccountNotFoundException` |
| Account already exists | `UserAccountAlreadyExistsException` |
| Account status transition is invalid | `UserAccountInvalidStatusTransitionException` |
