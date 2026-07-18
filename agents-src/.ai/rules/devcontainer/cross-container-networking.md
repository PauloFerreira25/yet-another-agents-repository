---
name: cross-container-networking
Scope: When a service needs to reach another service that binds to loopback only, or needs the host from inside a container
description: extra_hosts for reaching the host machine, and how to expose a service whose own tool binds to 127.0.0.1 only.
---

## Reaching the host machine from a container

To let a container reach a process running on the host (not in any container) — a browser with a
debug port open, a locally running service — add `extra_hosts` to the service that needs it:

```yaml
services:
  workspace:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

This only applies to reaching the actual host machine. Two services defined in the same
`docker-compose.yml`, on the same network, reach each other by service `hostname` directly —
never use `host.docker.internal` between sibling containers (see `Service Structure`).

## When the tool supports binding to all interfaces itself

Some server processes accept a flag to listen on every interface instead of loopback-only. Prefer
this over a relay when it's available — start the server that way, and point the client at the
server's container hostname via whatever configuration the client tool exposes for a remote
server address, instead of connecting from outside:

```bash
# on the server side (e.g. inside the android-emulator container)
adb -a -P 5037 start-server
```

```yaml
# on the client side (e.g. the workspace service)
environment:
  ADB_SERVER_SOCKET: tcp:android-emulator:5037
```

## When the tool cannot be reconfigured to bind wider

Some tools bind their own port to `127.0.0.1` specifically, by design, as their only access
control, with no flag to change it (e.g. an emulator's console/adb ports). A sibling container
cannot reach that port through the service's hostname, because the bind excludes every interface
except loopback.

Relay it onto the container's own real IP with `socat`, run from that service's own entrypoint
(never from the consumer side — the relay must run where the loopback-bound process lives):

```bash
CONTAINER_IP="$(hostname -I | awk '{print $1}')"
socat TCP-LISTEN:5554,bind="${CONTAINER_IP}",fork,reuseaddr TCP:127.0.0.1:5554 &
```

Bind the relay to the container's real IP, never `0.0.0.0` — the wildcard would collide with the
original process's existing bind on `127.0.0.1` for the same port. A sibling container then
reaches the relayed port via this container's hostname, as normal.

The same trick works in reverse — relaying a port that only resolves correctly from one specific
container's perspective (e.g. `adb reverse`'s `localhost:8081` resolving against the adb server's
own container, not against wherever the actual dev server listens) onto the hostname where it
actually needs to resolve.
