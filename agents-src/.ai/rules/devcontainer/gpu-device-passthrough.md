---
name: gpu-device-passthrough
Scope: Before configuring a service that needs GPU or hardware device access
description: Numeric user + explicit group_add is required for a container to actually use a passed-through device.
---

Passing a device through with `devices:` (e.g. `/dev/kvm`, `/dev/dri`) is not enough by itself —
the container's user also needs to belong to the host groups that own those device files.

A numeric `user: "UID:GID"` in docker-compose.yml bypasses supplementary group membership from
`/etc/group` entirely, even if the Dockerfile already added the user to the right groups at build
time. Re-add the groups explicitly via `group_add`, using the host's actual GIDs:

```yaml
services:
  android-emulator:
    user: "1000:1000"
    group_add:
      - "${KVM_GID}"
      - "${VIDEO_GID}"
    privileged: true
    devices:
      - /dev/kvm
      - /dev/dri
```

Get the host's GIDs with `stat -c '%g' /dev/kvm` and `stat -c '%g' <a /dev/dri/render* device>` —
these are host-specific, so resolve them via the `Host-Specific Values` mechanism, never
hardcode them.

`privileged: true` is required for raw device access of this kind — scope it to only the
service(s) that actually need it, never apply it project-wide.
