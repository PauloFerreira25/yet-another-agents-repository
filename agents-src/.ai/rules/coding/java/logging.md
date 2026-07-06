---
name: java-logging
Scope: Before adding log statements to any Java layer
description: SLF4J via @Slf4j (Lombok) is the logger for Spring Boot projects — never use System.out, java.util.logging, or Log4j directly.
---

For log principles (first-line log, outcome logs, full result, sensitive data), follow `.ai/rules/coding-principles/logging.md`.

Use `@Slf4j` from Lombok to obtain the logger. Never declare a `LoggerFactory.getLogger(...)` manually when Lombok is available.

```java
@Slf4j
@Service
public class OrderService {

    public Order findById(String id) {
        log.debug("findById id={}", id);
        // ...
    }
}
```

Never use `System.out.println`, `System.err.println`, `java.util.logging`, or Log4j directly. All log output goes through SLF4J.
