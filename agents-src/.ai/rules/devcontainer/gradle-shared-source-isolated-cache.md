---
name: gradle-shared-source-isolated-cache
Scope: When multiple Gradle-based services share the same source bind mount
description: Give each service using a shared Gradle multi-module source tree its own private build cache, to avoid lock contention.
---

When multiple docker-compose services all bind-mount the same Gradle multi-module source
directory (e.g. one service per Spring Boot module, all built from the same `../backend`), each
one still needs its own private Gradle cache — sharing one `.gradle` across services racing the
same `fileHashes.lock` causes contention and intermittent build failures.

Shadow the shared mount's `.gradle` subdirectory with a per-service anonymous volume, and back it
with a bind mount into `.data-volumes/` so the cache survives a container rebuild:

```yaml
services:
  backend-core:
    volumes:
      - ../backend:/app
      - /app/.gradle
      - ../.data-volumes/gradle-cache/backend-core:/home/dev-user/.gradle
```

The anonymous `/app/.gradle` entry gives this service its own private view of that path, separate
from every sibling service also mounting `../backend:/app`. Pre-create and `chown` `/app/.gradle`
in the Dockerfile (see `Volume Ownership`) so the anonymous volume's copy-up carries the right
ownership.

A separate "watch" service running `gradle classes --continuous` (rather than `bootRun`) is a
useful pattern for triggering Spring Boot DevTools' in-JVM restart across every module at once —
`bootRun` never completes on its own, so it cannot be the target of `--continuous`; a task like
`classes` that actually finishes each cycle can.
