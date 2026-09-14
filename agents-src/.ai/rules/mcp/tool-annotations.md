---
name: tool-annotations
Scope: When registering any MCP tool
description: Declare readOnlyHint, destructiveHint, idempotentHint, and openWorldHint accurately on every tool; treat them as client-facing hints, never as an access-control mechanism.
---

Set the `annotations` object on every registered tool: `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint`. Derive each value from what the tool actually does, never from a default left unexamined.

Set `readOnlyHint: true` only when the tool has no side effects. Set `destructiveHint: true` for any tool that can delete or irreversibly overwrite data — a well-behaved client uses this to require human confirmation before it runs unattended. Set `idempotentHint: true` only when calling the tool repeatedly with the same input produces no additional effect beyond the first call. Set `openWorldHint: true` only when the tool interacts with an open-ended external system (the public internet, an arbitrary user-supplied endpoint) rather than a fixed, closed domain.

Never treat these annotations as an enforcement or security mechanism. They are untrusted hints a client may or may not respect — they inform client-side UX (auto-execution versus confirmation prompts), and do not substitute for real authorization or validation inside the handler itself. A tool that requires access control must enforce it in its own logic regardless of what its annotations declare.
