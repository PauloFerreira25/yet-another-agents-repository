# Package Organization Gap — Rules Dossier

Date: 2026-07-22

## Problem

The package `backend/service/auth/src/main/java/br/com/qgmbt/auth/session` mixes two different concepts at its root level instead of separating them.

Current layout:

```
session/
├── JwtProperties.java
├── RefreshTokenEntity.java
├── RefreshTokenRepository.java
├── RefreshTokenStatus.java
├── SessionController.java
├── SessionEntity.java
├── SessionIssuance.java
├── SessionRepository.java
├── SessionService.java
├── SessionTokenValidationResult.java
├── SessionValidationFailureReason.java
├── UserAccountClient.java
├── config/
│   └── JwtIssuerConfig.java
├── exception/
│   ├── SessionNotFoundException.java
│   ├── SessionRefreshTokenNotFoundException.java
│   ├── SessionRefreshTokenReusedException.java
│   └── SessionRevokedException.java
└── rest/
    ├── SessionIssueSystemSessionRequest.java
    ├── SessionIssueSystemSessionResponse.java
    ├── SessionIssueUserSessionRequest.java
    ├── SessionIssueUserSessionResponse.java
    ├── SessionListBySubjectResponse.java
    ├── SessionRenewTokenRequest.java
    ├── SessionRenewTokenResponse.java
    ├── SessionValidateTokenRequest.java
    ├── SessionValidateTokenResponse.java
    └── SessionValidateTokenResponse.java
```

Observation: the existing subpackages (`config`, `exception`, `rest`) split by **technical role** (what kind of class it is), not by **concept**. As a result, `RefreshTokenEntity`, `RefreshTokenRepository`, and `RefreshTokenStatus` — three classes belonging to one cohesive sub-concept, the refresh token — sit unpackaged at the root, mixed with the unrelated `Session*` classes and with `JwtProperties` and `UserAccountClient`, which belong to neither concept directly.

The concrete question raised: should `RefreshToken*` classes move into their own subpackage, e.g. `session.refreshtoken`, so the root package is not a flat bag of unrelated types?

## Where the codebase's rules were already checked

The repository defines rules for the `java-spring-boot` agent in `.claude/agents/backend/java-spring-boot.md`, each pointing at a file under `.ai/rules/`. The following were read in full to check whether package-splitting granularity is already covered:

| File checked | Result |
|---|---|
| `.ai/rules/coding-principles/design.md` | Covers function size, file size (500 lines), one-responsibility-per-file. Does not address package/directory granularity. |
| `.ai/rules/coding/java/naming.md` | Defines package name casing (`lowercase`, no separators — enforced by Checkstyle regex `^[a-z]+(\.[a-z][a-z0-9]*)*$`). Does not address when a new subpackage should be introduced. |
| `.ai/rules/architecture/spring-boot/exception-objects.md`, `config-objects.md`, `rest-objects.md`, `error-handling.md`, `rest-validation.md` | Each governs naming/shape of one class category (exceptions, `@Configuration` classes, REST DTOs). None addresses package depth or feature-based grouping. |
| Repository-wide search (`grep -rli "package" .ai/rules/`) | No hit for a Java- or Spring-Boot-specific rule about package structure/depth. The only "package" hits are Node/React package-scripts rules and React folder-structure rules, unrelated to this question. |

Conclusion: no existing rule contradicts or permits this reorganization — the topic is simply not covered. This is a gap, not a rule violation.

## How the Java community handles this

### Package by layer vs. package by feature

Industry material consistently frames this as two competing strategies:

- **Package by layer**: group classes by technical role (`controller`, `service`, `repository`, `dto`). This is what the `session` package currently does for `config`, `exception`, `rest`.
- **Package by feature**: group classes by the business concept/feature they implement, placing everything related to one feature in one package regardless of technical role.

Sources found:

- [Package by Layer for Spring Projects Is Obsolete](https://dzone.com/articles/package-by-layer-for-spring-projects-is-obsolete) (DZone)
- [Spring Boot Series Part 4: The Folder Structure (Packaging by Layer vs. Feature)](https://medium.com/@rmpasindunimesha/spring-boot-series-part-4-the-folder-structure-packaging-by-layer-vs-feature-1fe1d6662fc2) (Medium)
- [Package by Layer vs Package by Feature (How Clean Architecture and Hexagonal Architecture fit in)](https://jshingler.github.io/blog/2025/10/25/package-by-feature-vs-clean-architecture/)
- [Java Practices → Package by feature, not layer](http://www.javapractices.com/topic/TopicAction.do?Id=205)
- [Package by feature vs package by layer — Grokipedia](https://grokipedia.com/page/Package_by_feature_vs_package_by_layer)
- [Spring Boot Code Structure: Package by Layer vs Package by Feature](https://medium.com/@akintopbas96/spring-boot-code-structure-package-by-layer-vs-package-by-feature-5331a0c911fe)

Summary of consensus: Spring Boot itself does not mandate either strategy, but community guidance for medium-to-large applications favors package by feature — grouping by business domain or vertical slice yields higher cohesion, lower coupling between packages, and easier extraction into separate modules/services later. Package by layer remains acceptable for small applications, with the common recommendation being to start by layer and refactor toward by-feature once navigating a single feature requires jumping across too many top-level packages.

### Domain-Driven Design angle

Where DDD terminology applies, the same idea appears as "package by aggregate root": a subpackage named after the aggregate (e.g. `customer`, `order`) contains that aggregate's entities, value objects, and repository interface together, so a developer can see everything belonging to that concept in one directory.

Sources found:

- [Clean DDD lessons: project structure and naming conventions](https://medium.com/unil-ci-software-engineering/clean-ddd-lessons-project-structure-and-naming-conventions-00d0b9c57610)
- [Oliver Drotbohm — Implementing DDD Building Blocks in Java](https://odrotbohm.de/2020/03/Implementing-DDD-Building-Blocks-in-Java/)
- [DDD-konforme Package-Konvention (ArchiLab)](https://www.archi-lab.io/infopages/ddd/package-convention-ddd.html)
- [DDD and package organization](https://codeforfunandmoney.wordpress.com/2016/07/13/domain-driven-design-and-package-organization/)
- [DDD: Application File Structure](http://www.javajirawat.com/2013/05/ddd-application-file-structure.html)

Applied to this codebase: `RefreshToken` reads as its own sub-concept nested inside the `session` feature (a session issues/tracks refresh tokens), which is exactly the situation these sources describe as warranting its own subpackage — `session.refreshtoken` — rather than being flattened into `session`'s root alongside the unrelated `Session*` classes.

## The gap that needs a rule

None of the following are currently decided anywhere in `.ai/rules/`:

1. **Trigger**: what condition causes a group of classes to be pulled into a subpackage — e.g. "N or more classes share a sub-concept name prefix", or "an entity has its own repository and status/enum", or a purely qualitative judgment call.
2. **Mixed strategy**: the codebase already applies package-by-layer for `config`/`exception`/`rest` inside a feature package. Whether package-by-concept subpackages (like `refreshtoken`) should coexist with those layer-based ones, and how a class that is both a specific concept and a specific layer (e.g. `RefreshTokenEntity`, arguably `refreshtoken` concept + entity layer) should be classified, is undecided.
3. **Retroactivity**: whether an existing flat structure should be reorganized when discovered, or only new code follows the new convention going forward.
4. **Where the rule lives**: whether this belongs in a language-agnostic rule (`.ai/rules/coding-principles/design.md`) or a Spring-Boot/Java-specific one (`.ai/rules/architecture/spring-boot/` or `.ai/rules/coding/java/`), and whether it needs registering in the `Rules` table of `.claude/agents/backend/java-spring-boot.md` with a `Scope` describing when to apply it (e.g. "Before creating a package or adding a class to an existing package").

This document does not propose rule wording — it is the input data for whoever authors the rule.
