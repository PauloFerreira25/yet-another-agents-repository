---
name: directory-layout
Scope: Before creating or locating any file inside .devcontainer/
description: Canonical directory layout for a project's .devcontainer/ tree.
---

`.devcontainer/container/<service>/` is always the build context for that service — its
`Dockerfile` and any service-specific configuration live there (e.g. `container/nginx/default.conf`,
`container/postgres/01-init-databases.sh`). Never place a service's Dockerfile anywhere else.

`.devcontainer/scripts/` holds helper scripts — both host-side (run via `initializeCommand`) and
container-side (run via `postStartCommand` or a service's own `entrypoint.sh`).

The `.devcontainer/` root itself holds only `devcontainer.json`, `docker-compose.yml`, and `.env`
(host-specific, generated — see `Host-Specific Values`). Never add loose config files at this
level; they belong under `container/<service>/` or `scripts/`.

In `docker-compose.yml`, every service's `build.context` points at `./container/<service>`, and
`dockerfile` is always named `Dockerfile` (never renamed).
