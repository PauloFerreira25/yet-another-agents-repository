---
name: env-file-layering
Scope: When a service needs to load environment variables from more than one env file
description: A required base env file plus an optional local override, using Compose's env_file required flag instead of a pre-touch workaround.
---

When a service needs to read config committed by the app itself, plus an optional local or
host-specific override the app's own repo gitignores, use Compose's long `env_file` syntax:

```yaml
env_file:
  - ../path/to/app/.env.committed-base
  - path: ../path/to/app/.env
    required: false
```

Order matters: later entries win on overlapping keys, so the optional local override always goes
last.

`required: false` is the built-in way to say "this file may not exist, don't fail if it's
missing" (Compose ≥ 2.24 — check the installed `docker compose version` before relying on it).
Without it, `docker compose config` and `docker compose up` hard-fail with "env file ... not
found" the instant that path doesn't exist on disk — which is exactly what a fresh clone of an
app repo with a gitignored `.env` looks like.

Reach for `required: false` instead of a custom pre-touch/pre-create workaround (e.g. an
`initializeCommand` step that creates an empty placeholder file) — it is the established feature
for exactly this situation, and a workaround only reintroduces the same fragility this flag
exists to remove.
