---
name: stdio-output-safety
Scope: Before adding any console or logging output to a stdio-transport MCP server
description: Never write to stdout in a stdio-transport server — it corrupts the JSON-RPC message stream; all logging must go to stderr or a file.
---

Never use `console.log`, `process.stdout.write`, or any other call that writes to standard output in a server using `StdioServerTransport`. The stdio transport uses stdout exclusively to carry JSON-RPC messages between server and client; any other bytes written there corrupt the message stream and break the connection.

Send all diagnostic output to stderr instead: use `console.error`, or configure a logging library to write to stderr or to a file — never to its default stdout stream.

This constraint is specific to the stdio transport. A server running over Streamable HTTP has no such restriction and may log to stdout normally, since HTTP responses are carried over the network connection, not over the process's standard streams.

Before adding a new logging call anywhere in a stdio-transport server, verify it does not resolve to stdout, including through a third-party logger's default configuration.
