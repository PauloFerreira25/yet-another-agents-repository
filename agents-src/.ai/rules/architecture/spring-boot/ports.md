---
name: spring-boot-ports
Scope: Before configuring server.port or any port-related property in a Spring Boot project
description: Port convention for Spring Boot microservices — increment the leading digit per service, never the trailing digits.
---

Each microservice gets a port derived by incrementing the leading digit, starting at 8:

| Service index | HTTP | HTTPS (TLS) |
|---|---|---|
| 1 | 8080 | 8443 |
| 2 | 9080 | 9443 |
| 3 | 10080 | 10443 |

Never increment trailing digits across services (`8080` → `8081`). That pattern conflates service identity with port offset and breaks the convention.

Configure in `application.yml`:

```yaml
server:
  port: 8080        # HTTP
  # port: 8443      # HTTPS — uncomment when TLS is enabled
```

When TLS is active, use the corresponding `X443` port for the same service index. Never mix HTTP and HTTPS ports from different service indices on the same service.
