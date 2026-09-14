---
name: transport-selection
Scope: When choosing a transport for a new MCP server
description: Default to stdio for local, process-spawned servers; use Streamable HTTP for remote servers; avoid the deprecated HTTP+SSE transport.
---

Use `StdioServerTransport` by default for any MCP server meant to be launched as a local child process by its host (e.g. a desktop client spawning the server via `command`/`args`). This is the common case for developer-facing tools and integrations installed on one machine.

Use Streamable HTTP for any server meant to be reached remotely over a network, or shared by multiple clients without being spawned per-client.

Never choose the HTTP+SSE transport for a new server. It exists only for backward compatibility with older clients that have not migrated to Streamable HTTP. If a specific client requires it, name that constraint explicitly and treat it as a temporary compatibility measure, not the default.

Never mix transport concerns into tool or resource handler logic — the transport is wired once at server startup and handler code must not assume which transport is active.
