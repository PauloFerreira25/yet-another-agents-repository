---
name: java-naming
Scope: Before naming, writing or reviewing any Java
description: Naming conventions for Java code, based on the Google Java Style Guide and enforced by Checkstyle
---

The Google Java Style Guide (https://google.github.io/styleguide/javaguide.html) is the baseline. Checkstyle enforces these conventions on build — violations produce errors, not just warnings.

## Code identifiers

| Identifier type | Style |
|---|---|
| Packages | `lowercase` (no separators of any kind) |
| Classes, interfaces, enums, annotations | `PascalCase` |
| Methods, variables, parameters | `camelCase` |
| Constants (`static final`) | `UPPER_SNAKE_CASE` |

```java
package com.example.orderservice;    // lowercase, no separator

public class OrderService {          // PascalCase
    private static final int MAX_RETRIES = 3;   // UPPER_SNAKE_CASE

    public Order findById(String id) { ... }     // camelCase
}
```

## Entity classes

Every class annotated with `@Entity` must carry the `Entity` suffix: `UserAccountEntity`, not `UserAccount`.

## Packages (directories)

Checkstyle default regex: `^[a-z]+(\.[a-z][a-z0-9]*)*$`

This rejects all of the following:
- `snake_case` — underscore not in regex
- `camelCase` — uppercase not in regex
- `PascalCase` — uppercase not in regex
- `kebab-case` — hyphen not a valid Java identifier

Only `lowercase` without any separator passes Checkstyle. When a package name has multiple words, concatenate them: `orderitem`, not `order_item` or `orderItem`.

## Abbreviations and acronyms

Treat acronyms as words in `camelCase` and `PascalCase`: `HttpClient`, not `HTTPClient`; `parseXml`, not `parseXML`. This follows the Google Java Style Guide.

## Language

All identifiers must be in English.
