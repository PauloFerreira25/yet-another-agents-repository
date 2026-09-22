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

## A long-running watch command as the service's own foreground process

A service whose `command:` is a build tool (or several tools together) running in watch mode —
never exiting, rebuilding on every source change — is its own PID 1 directly. This is a different
shape from `Poststart Relay Idempotency`, which backgrounds and detaches a relay launched *from*
a `postStartCommand` or entrypoint script so it survives that script's own session ending: here,
the watch command already stays alive for exactly as long as the container does, by construction,
so none of that detachment machinery applies.

The gotcha worth knowing when such a service appears to have exited or stopped reacting to
changes: inside a container's non-interactive process, there is no TTY, and some tools treat "no
TTY" as "run once and exit" rather than auto-detecting that a watcher was intended — silently
turning what was meant to be a permanent watcher into a one-shot that quits. Each tool needs its
own watch mode invoked explicitly (a bundler's `--watch`, and the equivalent for any other
long-running tool sharing that process), not left to auto-detection.
