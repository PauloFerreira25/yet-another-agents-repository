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
