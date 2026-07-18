---
name: service-structure
Scope: Before adding or configuring a service in docker-compose.yml
description: Baseline conventions every docker-compose.yml service follows — hostname, network, and persistence location.
---

Every service gets `hostname: <service-name>`, matching its compose key — this is what lets
sibling services address it by name (see `Cross-Container Networking`) instead of relying on
Docker's default network aliasing.

All services share a single bridge network, conventionally named `local-network`:

```yaml
networks:
  local-network:
    driver: bridge
```

`workspace` is the one service VS Code attaches to (`devcontainer.json`'s `service` field) — it
is not necessarily where application code runs. Per-language services (a backend module, a
frontend dev server, etc.) are typically separate compose services with their own build context,
so each gets its own isolated toolchain and dependency cache.

Persistent state that must survive a container rebuild — caches, credentials, generated data —
lives under a bind mount into `../.data-volumes/<descriptive-name>`, never inside the container's
own filesystem or an unlabeled anonymous volume. `.data-volumes/` sits outside `.devcontainer/`,
at the repository root, and must be excluded from the editor's file explorer and watcher (see
`VS Code Customizations`).
