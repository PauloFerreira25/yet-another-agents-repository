---
name: wayland-forwarding
Scope: Before forwarding a GUI window from a container to the host display
description: Mount and environment conventions for a container-rendered window to appear on the host's native Wayland compositor.
---

The host runs native Wayland, not X11/XWayland — do not set up X11-style forwarding
(`/tmp/.X11-unix`, `DISPLAY`, an Xauthority mount) for a GUI window in this project. That
approach targets a display server this host does not run.

To let a container render a real GUI window on the host's Wayland compositor, mount the actual
Wayland socket and point the container at it with matching environment variables:

```yaml
services:
  android-emulator:
    environment:
      XDG_RUNTIME_DIR: /tmp
      WAYLAND_DISPLAY: ${WAYLAND_DISPLAY}
      QT_QPA_PLATFORM: wayland
    volumes:
      - ${XDG_RUNTIME_DIR}/${WAYLAND_DISPLAY}:/tmp/${WAYLAND_DISPLAY}
```

The container's user must have the same UID as the host user that owns the socket —
`XDG_RUNTIME_DIR` is only accessible to its owner. This already matches the project's standing
convention of a non-root `dev-user` with a matched UID (see `Base Image and User`) — no extra
setup needed on that front.

`WAYLAND_DISPLAY` (typically `wayland-0` or `wayland-1`) varies per host and per graphical
session. Resolve it via the `Host-Specific Values` init script, never hardcode it.

No auth-cookie workaround is needed here — Wayland's access control is the socket's own file
permissions, not a rotating cookie file, so the fragility X11/XWayland forwarding has around a
cookie's path changing per session simply does not apply.

A Qt-based GUI (e.g. the Android emulator's window) also needs `QT_QPA_PLATFORM=wayland` set in
its environment, or Qt falls back to an X11 backend that isn't there and fails to open a window.
