---
name: android-emulator
Scope: When adding or configuring an Android emulator service
description: Entry point for an Android emulator container — routes to GPU passthrough and Wayland forwarding, plus emulator-specific entrypoint concerns.
---

An Android emulator running with a real GUI window (not headless, not VNC) needs two other rules
applied together — read both before writing this service:

- `GPU Device Passthrough` — the emulator needs `/dev/kvm` for hardware acceleration and
  `/dev/dri` for GPU-rendered graphics.
- `Wayland Forwarding` — the emulator's Qt window needs to reach the host's compositor.

## Entrypoint script responsibilities

The emulator container's own `entrypoint.sh` (not `docker-compose.yml` or the Dockerfile) owns:

- Creating the AVD on first boot if it doesn't already exist (`avdmanager create avd`), guarded
  by checking whether `${HOME}/.android/avd/<name>.avd` already exists — never recreate it on
  every container start.
- Clearing stale `*.lock` files under that AVD directory before starting the emulator — a
  container killed without a clean shutdown leaves lock files that make the emulator think
  another instance already owns the AVD, even though only one emulator process ever runs per
  container.
- Starting `adb` bound to all interfaces (`adb -a -P 5037 start-server`) so sibling containers
  can reach it directly — see `Cross-Container Networking`.
- Relaying the emulator's console/adb ports (bound to `127.0.0.1` by the emulator itself, not
  configurable) onto the container's real IP — see `Cross-Container Networking`.
- Launching the emulator itself last, as the entrypoint's final `exec`: `emulator -avd <name>
  -gpu ${EMULATOR_GPU_MODE} -no-snapshot-save`. Use `exec`, not a backgrounded call, so the
  emulator process becomes PID 1 and the container exits cleanly when it does.

`${HOME}/.android` must be a persisted bind mount into `.data-volumes/` (see `Service
Structure`) — losing it means recreating the AVD and repeating any interactive first-boot setup
(e.g. Play Store sign-in) on every rebuild.
