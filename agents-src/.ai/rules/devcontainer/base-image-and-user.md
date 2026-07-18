---
name: base-image-and-user
Scope: Before writing any devcontainer Dockerfile
description: Base image and non-root user conventions shared by every devcontainer service.
---

Base every devcontainer Dockerfile on `debian:trixie-slim`, unless the service requires a
different official base image for a hard technical reason (e.g. a language-specific slim image
that already bundles what a from-scratch Debian install would need) — confirm with the human
before deviating.

Every service runs as a non-root user, conventionally named `dev-user`, created to match the
host user's UID/GID so that files written into bind-mounted directories come out owned by the
host user, not root:

```dockerfile
ARG USER_UID=1000
ARG GROUP_GID=1000
ARG USERNAME=dev-user

RUN useradd -m -d /home/${USERNAME} -u ${USER_UID} -s /bin/bash ${USERNAME}
...
USER ${USERNAME}
```

`USER ${USERNAME}` must be the final user-switching instruction in the Dockerfile — never leave
the image running as root. `1000:1000` is the default; only override when the host user's actual
UID/GID differs (rare — most single-user Linux/macOS hosts default to 1000).

Install `sudo` and grant the user passwordless sudo only when the service genuinely needs
in-container privilege escalation (e.g. the `workspace` service, which runs Docker-in-Docker) —
not by default for every service.
