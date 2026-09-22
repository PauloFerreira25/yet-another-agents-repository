---
name: volume-ownership
Scope: Before adding a bind mount, anonymous volume, or named volume to a service
description: Prevents root-owned volumes from blocking the non-root container user.
---

A fresh anonymous or named volume is root-owned by default. Docker's "copy-up" behavior carries
the mount target directory's ownership from the image into the volume the first time it's
created — so pre-create that directory in the Dockerfile and `chown` it to the container's user
before it's ever mounted over:

```dockerfile
RUN mkdir -p /app/.gradle && chown -R ${USER_UID}:${GROUP_GID} /app
```

Without this, the non-root container user (see `Base Image and User`) cannot write into the
volume, and the service fails at its first write (e.g. a build tool's cache directory).

This applies to anonymous volumes (e.g. isolating a subdirectory of a shared bind mount — see
`Gradle Shared Source Isolated Cache`), named volumes, and bind mounts pointing at a
`.data-volumes/` subdirectory that doesn't exist yet on the host — pre-create that host directory
too, as the host user, via the `Host-Specific Values` init script, before the first container
start ever attempts the mount.

## A bind mount nested inside another bind mount's own source tree

There is a third case, distinct from the two above: a bind mount whose **target** sits inside
another bind mount's own **source** tree, where that inner subpath doesn't exist yet on the host —
for example, an outer plain bind mounting an app directory (`../app:/app`) together with an inner
mount shadowing one of its subdirectories (`../.data-volumes/app-cache/node_modules:/app/node_modules`).

Because the outer mount is a plain bind (not a copy, not a volume), `/app` inside the container
**is** the host's `../app` directory — the same inode, not a separate storage layer. When the
inner mount's target doesn't already exist as a real directory on the host, Docker has to create
that mountpoint the moment the container is created — and it creates it directly on the host
path, as root, because the Docker daemon itself runs as host root. There is no copy-up step to
`chown` afterward here, unlike the named/anonymous-volume case above — the directory that ends up
wrong is a real, literal directory sitting inside the *other* bind mount's own host source tree.

The same applies across services: a sibling service separately bind-mounting into a subpath of a
tree another service also mounts (e.g. nginx mounting `../app/dist:/usr/share/nginx/html` while
another service mounts `../app:/app` for the same source tree) hits the identical case — `dist/`
is just another such subpath, whether or not it's shared between the two services' own mounts.

Fix: pre-create every such subpath as the host user, in the same `initializeCommand` init script
that already pre-creates `.data-volumes/` subdirectories — this needs to happen for *any*
bind-mount target that doesn't already exist as a real host directory, not only ones under
`.data-volumes/`.

**A residual first-boot flake, not fully root-caused:** even with every such directory correctly
pre-created and owned by the host user before the containers were ever created, the very first
`docker compose up` of a fresh devcontainer rebuild can still hit a one-off `EACCES` on a
service's first write into its own output directory, immediately settling into an otherwise-healthy
running state with no valid output ever produced. A single `docker restart` on that one service,
with no other change, has been observed to resolve it immediately and not recur on later restarts
— likely a transient mount-setup-ordering effect when two services with overlapping or adjacent
bind mounts are created concurrently. Treat this as a known, low-cost, self-resolving flake — one
`docker restart` after a fresh rebuild if a service's output looks empty or stale — rather than
investing in a firmer fix (a healthcheck-gated dependency, a retry loop) unless it turns out to
recur reliably.
