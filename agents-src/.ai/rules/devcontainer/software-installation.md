---
name: software-installation
Scope: Before installing software inside a devcontainer, or after editing a devcontainer Dockerfile
description: Software must be added to the Dockerfile, not installed ad hoc into a running container; every Dockerfile change must be validated with an untagged build.
---

Never install software directly into a running devcontainer (`docker exec ... apt install`, running a package manager from an interactive shell inside the container) unless the human has explicitly said the install is provisional. Do not decide on your own that an install counts as provisional — if the human hasn't said so, treat it as permanent and put it in the Dockerfile.

Anything a service needs on an ongoing basis must be added to that service's Dockerfile under `.devcontainer/container/<service>/`, never installed by hand into the running container. Devcontainers get rebuilt or recreated without warning — a "Rebuild Container", a fresh clone, a CI build — and anything installed only by hand disappears with no record of what was there or why.

After editing what a Dockerfile installs, always validate that it still builds before considering the change done. Build it without a tag, so the check doesn't leave a named image behind:

```bash
docker build <path-to-service-context>
```
