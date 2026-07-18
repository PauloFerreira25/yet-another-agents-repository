---
name: host-specific-values
Scope: When a devcontainer setting depends on the host machine (display, device GIDs, ports)
description: Never hardcode host-specific values — detect them once via initializeCommand and persist to .env.
---

Never hardcode a value in `docker-compose.yml` or a Dockerfile that depends on the specific
machine running the devcontainer — a device GID, a `DISPLAY` value, a host-only port. These
differ between hosts, and between users on the same host over time.

Detect such values with a host-side script wired through `devcontainer.json`'s
`initializeCommand` (runs on the host, before containers start), and write them to
`.devcontainer/.env`, which `docker compose` loads automatically:

```json
{
  "initializeCommand": "bash .devcontainer/scripts/init-host-env.sh"
}
```

The script must only fill in keys that are not already present in `.env` — never overwrite the
file on every run. A value the human corrected by hand must survive the next container rebuild:

```bash
set_if_missing() {
    local key="$1" value="$2"
    if grep -q "^${key}=" "$ENV_FILE"; then
        return
    fi
    echo "${key}=${value}" >> "$ENV_FILE"
}
```

The same script is the right place to pre-create any `.data-volumes/` subdirectory a service's
bind mount expects (see `Volume Ownership`) — a mount target that doesn't exist yet gets
auto-created by the Docker daemon as root, which then blocks the non-root container user from
writing to it. Pre-create it as the host user instead, before the first container start.
