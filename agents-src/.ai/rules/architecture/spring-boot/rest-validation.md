---
name: spring-boot-rest-validation
Scope: Before writing or reviewing validation for a REST request body in a Spring Boot project
description: Jakarta Bean Validation setup, DTO placement, and the structural-vs-business-rule validation boundary.
---

## Standard mechanism

Use Jakarta Bean Validation (Jakarta Validation 3.1) via Hibernate Validator for structural validation of request payloads. Express constraints as annotations on the Request DTO's fields — never as imperative `if` checks in the controller or service.

```java
public record UserAccountCreateRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotNull @Past LocalDate birthDate
) {}
```

- Import constraints from `jakarta.validation.constraints.*` — never `javax.validation.*` (legacy Spring 4/5 only).
- Add `@Valid` on every `@RequestBody` parameter that needs validation. Without it, constraint annotations on the DTO are inert.
- Add the `spring-boot-starter-validation` dependency. Once present, Hibernate Validator auto-registers as the global `Validator` — no manual bean, no XML, no `@EnableWebMvc`. If validation silently does nothing, check this dependency first.
- Spring Framework 7 activates Jakarta validation on method parameters (e.g. `@Service` methods) automatically when constraint annotations are present. Add `@Validated` only when validation groups are needed — never assume it is mandatory everywhere.

## Where constraints live

Constraint annotations go on the Request DTO (see [[architecture/spring-boot/supporting-objects]]: `<feature-package>.rest`, `<Domain><Operation>Request`) — never on the domain/entity class. The domain entity enforces its own invariants independently of HTTP; the Request DTO enforces what a caller may send over the wire. Coupling them makes a domain-model change silently alter API validation, or vice versa.

## One DTO per operation, not validation groups

When required fields differ between operations (e.g. `id` absent on create, required on update), use separate Request classes per operation — consistent with [[architecture/spring-boot/supporting-objects]], which already mandates one Request/Response pair per operation.

Do not reach for Bean Validation groups (`@Validated(OnCreate.class)`) as the default way to vary required fields between operations. Reserve groups for the narrow case where the same DTO is genuinely reused across operations and the difference is incidental.

## Structural vs. business-rule validation

Two layers, never blurred:

- Structural validation (Bean Validation, on the DTO): is the payload well-formed? Runs before the controller method body executes.
- Business-rule validation (service layer, via domain exceptions): does a well-formed payload violate a business rule (e.g. "this email is already registered")? Requires a repository lookup or domain logic — not expressible as a constraint annotation. Belongs in the `@Service` layer, reported via a domain exception (see [[architecture/spring-boot/supporting-objects]]: `<Domain><Reason>Exception`), mapped to an HTTP response by the `@ControllerAdvice` (see [[architecture/spring-boot/error-handling]]).

Never implement a business rule as a custom `@ConstraintValidator` that performs I/O (database lookups, calls to another service). That couples validation to persistence, makes the constraint untestable without a database/mock, and hides a business rule where nobody expects to find one.

## Custom validators: allowed only when pure

A custom `@ConstraintValidator` is fine for a pure function of its input with no I/O: format checks (`@ValidCpf`, `@StrongPassword`), cross-field checks within the same DTO (`endDate` after `startDate`). Never for a check that needs a repository, an HTTP call, or any other collaborator — that is a business rule and belongs in the service layer.

## Validation error responses

`@Valid` failures raise `MethodArgumentNotValidException`. Handle it in the same `@RestControllerAdvice` described by [[architecture/spring-boot/error-handling]] — never add a separate, one-off exception handler for it in a controller. Return `ProblemDetail` (RFC 7807) with per-field errors as an extension property:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation failed");
        problem.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
            .map(e -> Map.of("field", e.getField(), "message", e.getDefaultMessage()))
            .toList());
        return problem;
    }
}
```

Never invent a bespoke, ad hoc error response shape for validation failures — `ProblemDetail` is the one format used for every error response on this stack, validation included.

## Legacy note (Spring 4, historical reference only — do not apply to this stack)

If working against a Spring 4 codebase specifically: constraints come from `javax.validation.constraints.*`; `@RestControllerAdvice` doesn't exist before Spring 4.3 (use `@ControllerAdvice` + `@ResponseBody` per method, or extend `ResponseEntityExceptionHandler`); there is no `ProblemDetail` — error response is a hand-rolled POJO; the validator may need explicit registration via `<mvc:annotation-driven validator="..."/>` in XML-configured projects. Never mix these idioms into a Boot 4.1/Framework 7 codebase.

## Worked example

Applying the above to the `UserAccount` feature used in [[architecture/spring-boot/supporting-objects]]:

```java
package com.example.user.account.rest;

public record UserAccountCreateRequest(
    @NotBlank String name,
    @NotBlank @Email String email
) {}
```

```java
package com.example.user.account;

@RestController
@RequestMapping("/user-accounts")
class UserAccountController {

    @PostMapping
    ResponseEntity<UserAccountCreateResponse> create(@Valid @RequestBody UserAccountCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }
}
```

- Malformed payload (blank `name`, invalid `email`) → `MethodArgumentNotValidException` → `400 Bad Request` `ProblemDetail` with per-field errors, handled centrally.
- Well-formed payload but email already registered → `UserAccountEmailAlreadyRegisteredException` thrown from the service → mapped to `409 Conflict` by the same `@ControllerAdvice`.
