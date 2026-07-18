---
name: poststart-relay-idempotency
Scope: Before writing a postStartCommand or entrypoint script that starts a background relay/process
description: How to background a long-running helper process so it survives the script's own session teardown, without starting a duplicate on every restart.
---

A `postStartCommand` runs inside a `docker exec` session that ends the instant the script
returns. `nohup` alone only ignores SIGHUP — it does not detach the process from that session's
process group, so a plain `nohup ... &` gets killed along with the session anyway.

Use `setsid` to start the process in a brand new session, independent of the script that launched
it, and `disown` so the shell doesn't track it either:

```bash
setsid nohup <command> < /dev/null > /tmp/<name>.log 2>&1 &
disown
sleep 2
```

The trailing `sleep` matters: the parent session can be torn down before `setsid` finishes
detaching the child into its new session, which would sweep the child up with it. A short sleep
gives the detach time to land first.

Before starting anything, check whether the relay is already running — `postStartCommand` and a
container's `entrypoint.sh` can both run more than once across restarts, and starting a second
copy of the same relay leaves the first as an orphaned, port-conflicting process:

```bash
if ! pgrep -f "<distinctive command fragment>" > /dev/null 2>&1; then
    setsid nohup <command> ... &
    disown
fi
```
