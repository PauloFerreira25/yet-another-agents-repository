---
name: docker-discipline
Scope: Before running any docker or docker compose command
description: Container lifecycle commands beyond restarting an already-running container require an explicit human request — never recreate, tear down, or start new containers to work around a problem.
---

## Always allowed

Read-only inspection commands require no approval and may be run freely at any time:

```bash
docker ps
docker ps -a
docker logs
docker inspect
docker compose ps
docker compose logs
docker compose config
docker stats
```

## The one write operation permitted without asking

Restarting a single container that is already running, from inside a devcontainer, to restart one of its own sibling containers:

```bash
docker restart <container>
```

## Never run without explicit approval

The following commands change what containers exist or are running. Never run any of them to work around a problem — they are forbidden unless the user has explicitly requested the specific operation:

```bash
docker compose up
docker compose down
docker compose restart     # restarts every service, not one container
docker run
docker rm
docker stop / docker kill
docker build / docker compose build
```

When a container-related problem does not go away with a plain `docker restart`, stop. Never escalate on your own to `docker compose down && up`, to `docker run` for a replacement container, or to any other recreation as a bigger hammer. Explain what you found and what you believe needs to happen, then wait for the human to do it or to explicitly approve it.

## Why this is stricter than a normal write operation

An agent's own session commonly runs inside one of the containers a `docker compose` command would affect. `docker compose down` (or `up` after a `down`) can tear down and recreate the very container the agent is executing in, killing the session that issued the command partway through its own recovery attempt. `docker run` starts a container entirely outside the project's declared `.devcontainer/` scope — an environment nothing in this repository tracks, rebuilds, or reproduces. Both failure modes are worse than the original problem, not obviously reversible by the agent itself once triggered, and are exactly why this rule exists.

## `docker restart` does not re-read compose config changes

A container's command, entrypoint, image, mounts, and environment are frozen into its config at creation time. `docker restart` re-runs that exact frozen config — it never re-consults `docker-compose.yml`. Editing a service's `command:` (or `environment:`, `volumes:`, `image:`, etc.) and then running `docker restart` on that service silently keeps running the old configuration forever; there is no error, no warning, nothing in the logs to suggest the new config didn't take effect.

If a compose edit doesn't seem to be taking effect after a restart, confirm with `docker inspect <container> --format '{{.Config.Cmd}}'` (or whichever field changed). A mismatch there means what's actually needed is `docker compose up -d <service>` to recreate just that one service's container — already covered by the "never without explicit approval" list above, but the trigger for asking is not only "restart didn't fix a problem": "I changed this service's config and need it applied" is just as valid a reason to ask. A scoped `docker compose up -d <single-service>` does not touch or recreate any other service, including the one the agent's own session may be running in — naming that explicitly matters, since the usual worry behind this whole rule is exactly "it might tear down my own session," and a single-service recreate structurally cannot do that to a different, unnamed service.
