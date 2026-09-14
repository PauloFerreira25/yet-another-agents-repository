---
name: tool-result-error-handling
Scope: When a tool handler can fail
description: Expected domain failures return a CallToolResult with isError set to true; thrown errors and McpError are reserved for protocol-level failures.
---

When a tool handler encounters an expected domain failure (a not-found record, an invalid downstream response, a rejected precondition, a timed-out call to a dependency), return a normal `CallToolResult` with `isError: true` and a descriptive `text` content entry explaining what failed. This surfaces the failure to the calling model as part of the conversation, so it can decide how to proceed — retry, ask the user, or try a different approach.

A call to any external dependency (a downstream API, a database, a subprocess) must have an explicit timeout. When it fires, treat it the same as any other expected domain failure: return `isError: true` naming what timed out, never let the tool call hang indefinitely or leave it to the transport to time out on its own.

Never throw from inside a tool handler for a failure the domain can anticipate. A thrown error terminates the request at the protocol level instead of giving the model a chance to react to it.

Reserve throwing, or constructing an `McpError`, for failures that are about the protocol or server itself, not the tool's domain: an internal invariant violation, a malformed request the schema did not catch, or a dependency the server cannot function without.

Every error path — expected or not — must produce a message specific enough to act on. Never return or throw a bare "something went wrong" with no indication of what was being attempted or what failed.
