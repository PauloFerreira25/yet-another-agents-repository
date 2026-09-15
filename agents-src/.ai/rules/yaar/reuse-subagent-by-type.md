---
name: reuse-subagent-by-type
Scope: Before invoking the Agent tool to delegate a task to a specialist agent
description: Reuse an already-running or recently-finished subagent of the matching type for the same task instead of spawning a new one — a fresh instance re-reads its full required-rules set from scratch, which is the majority of what a session start costs.
---

Before invoking `Agent` to delegate to a specialist agent type, call `ListAgents` and check whether an agent of that same type is already running, or finished but still addressable, as part of the same task currently being worked on.

If one exists, continue it via `SendMessage` with the new instructions instead of spawning a new `Agent` call. Reusing it keeps everything it already accumulated for this task — files it read, decisions it already made — and avoids paying again the cost of a fresh session start: a new instance re-reads every rule marked required in its own Rules table before doing anything else, which is the majority of what a session start costs.

Only reuse an agent for a continuation of the same task it was already invoked for. Never reuse an agent whose prior work was for a different, unrelated task, even when the agent type matches — starting fresh in that case is correct, not wasteful, since carrying over unrelated context would contaminate the new task.

When no matching agent exists yet for the current task, invoke `Agent` normally. The resulting instance becomes the one to reuse for any further delegation to the same type within this same task.
