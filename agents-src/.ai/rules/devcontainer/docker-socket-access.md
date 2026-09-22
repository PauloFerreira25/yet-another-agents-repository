---
name: docker-socket-access
Scope: When deciding whether the workspace service needs docker-in-docker or docker-outside-of-docker
description: docker-in-docker gives an isolated nested daemon with no visibility into sibling containers; docker-outside-of-docker mounts the real host socket instead — a security posture decision, never a silent default.
---

These two devcontainer features answer the same question — "can code running inside `workspace`
use Docker?" — with very different consequences for controlling sibling containers.

## docker-in-docker

Gives `workspace` its own **isolated, nested** Docker daemon. The container's network namespace is
still the real one from the compose stack — DNS resolution and connectivity to sibling service
hostnames over the shared bridge network work normally — but the `docker` CLI inside `workspace`
talks to the nested daemon, which has **zero knowledge of the sibling containers** the host's real
compose stack started.

`docker ps`, `docker logs`, and `docker restart` run against a sibling from inside such a
`workspace` all silently operate against the wrong, empty engine. This is easy to misdiagnose as
"the sibling isn't running" when it is actually running fine, just invisible from here. Confirm
with `docker network ls` (only the container's own isolated default networks show up, never the
compose stack's real bridge) and `ps aux` (a `dockerd`/`containerd` pair running as processes
inside this very container) before concluding a sibling is actually down.

## docker-outside-of-docker

Mounts the **host's real** Docker socket into `workspace`, giving it genuine control of the host
daemon — and therefore of every sibling container, `docker restart` included, exactly as
`.ai/rules/common/docker-discipline.md` assumes is always possible.

For a compose-based devcontainer, this mount is not automatic — it must be added explicitly:

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker-host.sock
```

The target path matters: it is `/var/run/docker-host.sock`, not `/var/run/docker.sock` — that is
the specific path the feature's own entrypoint wrapper looks for.

## This is a security decision, not a technical default

Mounting the host socket is root-equivalent access to the host's Docker daemon, and therefore root
on the host itself on a typical rootful setup, and root inside any container on that host — not
only this project's own. Always name this choice explicitly and get the human's explicit
confirmation before switching a project to `docker-outside-of-docker`, the same as any other
privileged-access change. Never treat a general preference for this feature as license to switch a
project to it without asking each time.
