---
name: tool-testing
Scope: Before writing or configuring tests for an MCP server
description: MCP-specific test shape — tools/resources/prompts directory layout, schema and CallToolResult assertions, and how the base Node.js testing rule's real-infrastructure principle applies to third-party dependencies a tool wraps.
---

This rule extends `.ai/rules/coding/nodejs/testing.md`: the test runner (Vitest), coverage enforcement, and the general preference for real infrastructure over mocks all still apply. This file only adds what the base rule does not know about — the shape of an MCP server.

## Directory structure

Mirror `src/` under `test/` by capability type instead of by domain/queue layers:

```
test/
├── tools/
│   └── <tool-name>.test.ts
├── resources/
│   └── <resource-name>.test.ts
├── prompts/
│   └── <prompt-name>.test.ts
└── helper/
    └── ...              ← shared test utilities, not test files
```

## What each tool test must assert

For every tool, test three things together, not just the underlying business logic:

- The input schema accepts every valid shape it should and rejects every invalid one (missing required fields, out-of-range values, wrong types) — assert directly against the Zod schema or through a call that exercises it.
- The handler returns the correct `CallToolResult` shape for its success path, including the exact `content` array.
- The handler returns `isError: true` with a descriptive message for every expected domain failure path, per `.ai/rules/mcp/tool-result-error-handling.md` — never assert only that it "throws" or "fails" without checking the returned result shape.

## Third-party dependencies

When a tool wraps a service outside the project's ownership (a public API, a third-party integration with no test/sandbox mode under the project's control), that dependency falls under the base rule's own exception — "unless it is impossible to run them" — so mock it, and test the tool's own logic (request construction, response mapping, error translation) against that mock.

This does not extend to infrastructure the project owns (its own database, its own internal service). Test those for real, exactly as the base rule requires.

## Manual verification

Use `@modelcontextprotocol/inspector` to manually exercise a running server during development — listing tools/resources/prompts, invoking a tool interactively, inspecting the raw protocol exchange. This is a manual complement to the automated test suite, never a substitute for it.
