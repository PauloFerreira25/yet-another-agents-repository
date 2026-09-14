---
name: capability-boundaries
Scope: When deciding whether a new server capability should be a tool, a resource, or a prompt
description: Resources expose read-only data, tools perform actions with potential side effects, and prompts define reusable interaction templates — never blur these boundaries.
---

Expose a capability as a resource only when it is read-only data surfaced into context, analogous to a GET request: file contents, records, computed read-only views. A resource must never cause a side effect when read.

Expose a capability as a tool when it performs an action the model can invoke, including anything with a potential side effect (writes, mutations, external calls that change state), analogous to a POST request. Tool invocations are subject to user approval by the client.

Expose a capability as a prompt only when it is a reusable template that shapes how a user or model structures an interaction, not a way to fetch data or perform an action.

Never expose a mutating operation as a resource merely because it also returns data — if invoking it changes state, it is a tool.

When a single piece of functionality seems to fit two of these categories, split it: one resource for the read-only view, one tool for the action, rather than a single capability with a boolean flag that changes its behavior.
