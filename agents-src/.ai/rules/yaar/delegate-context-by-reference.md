---
name: delegate-context-by-reference
Scope: When delegating a task via the Agent tool, and the project decisions relevant to that task are already captured in a written doc or spec file in the repository
description: Point delegated agents at existing docs/specs instead of retyping accumulated project context inline in every delegation prompt.
---

When delegating a task via the `Agent` tool, and the project decisions relevant to that task are
already captured in a written doc or spec file in the repository (e.g. `docs/specs/*.md`,
`docs/*.md`), point the delegated agent at those file paths in the background section instead of
retyping the decisions inline.

Only describe inline what is not yet written down anywhere else in the repository.

This does not change what context should be shared or how much a delegated agent is owed — it
only changes how already-written context is delivered: by reference, not by copy.
