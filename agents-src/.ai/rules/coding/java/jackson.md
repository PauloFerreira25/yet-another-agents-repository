---
name: java-jackson
Scope: Before adding a JSON library dependency, configuring an ObjectMapper, or handling REST payload naming/null/unknown-property behavior
description: Jackson is the only JSON library for this stack; configure it through Spring Boot's autoconfiguration, never a hand-built ObjectMapper
---

Always use Jackson (`jackson-databind`, delivered transitively via `spring-boot-starter-web`) as the JSON library. Never introduce Gson, JSON-B/Yasson, Moshi, or a hand-rolled JSON parser into a Spring Boot project — not even for a single endpoint or a "quick" utility class. Never add a second JSON library alongside Jackson.

## ObjectMapper configuration

Never instantiate a custom `ObjectMapper` from scratch (`new ObjectMapper()`) as a `@Bean` — it bypasses Spring Boot's autoconfigured `Jackson2ObjectMapperBuilder` and silently drops its defaults, including the JSR-310 module registration that date/time serialization depends on (see [[coding/java/date-time]] for what breaks when this happens).

When custom Jackson configuration is genuinely needed, provide a `Jackson2ObjectMapperBuilderCustomizer` bean instead — it customizes on top of Spring Boot's autoconfigured builder rather than replacing it.

## Naming strategy

Default to camelCase (Java field name = JSON key name) — this is Jackson's default and requires no configuration. Never override the naming strategy per class with ad hoc `@JsonProperty` renames sprinkled across DTOs to fake `snake_case`.

If a project genuinely needs `snake_case` JSON, set it once, globally: `spring.jackson.property-naming-strategy=SNAKE_CASE`. Never mix naming conventions across endpoints in the same project.

## Null handling

Default Jackson behavior (include the key with an explicit `null` value) unless the project has adopted omission of null fields as a deliberate, global decision. If it has, set it once globally — `spring.jackson.default-property-inclusion=non_null` — never as a per-DTO `@JsonInclude(NON_NULL)` annotation applied inconsistently.

## Unknown properties

Rely on Spring Boot's default of `FAIL_ON_UNKNOWN_PROPERTIES` disabled — this lets a client tolerate new fields added to a response without breaking. Never re-enable this feature project-wide.

## Request/Response DTOs

Request and Response classes are `record`s (see [[architecture/spring-boot/rest-objects]]). Jackson (2.12+) deserializes records natively from their canonical constructor — never add Lombok annotations or a custom `@JsonCreator` to a record DTO just to make Jackson accept it.

Date/time field types and their serialization behavior are covered separately — see [[coding/java/date-time]]; this file governs JSON handling in general, not date-specific rules.
