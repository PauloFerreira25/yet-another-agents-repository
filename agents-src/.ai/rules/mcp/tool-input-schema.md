---
name: tool-input-schema
Scope: When defining any MCP tool
description: Every tool input is a Zod object schema with one field per parameter, each carrying a .describe() call.
---

Define every tool's `inputSchema` as a Zod object schema (`z.object({...})`). Never accept an untyped or `z.any()` input — the schema is the only contract the calling model has for what a tool accepts.

Give every field its own entry in the schema, one field per logical parameter. Never collapse multiple parameters into a single free-form string or object the handler then parses itself.

Call `.describe()` on every field, including primitive ones, with a description precise enough that a model unfamiliar with the tool can infer the expected value (format, units, valid range) without seeing the handler implementation.

Constrain the schema as tightly as the domain allows — bounded ranges (`.min()`/`.max()`), fixed lengths, enums (`z.enum()`) — instead of a bare `z.string()` or `z.number()`, whenever the valid values are actually constrained.

Do not re-validate the input inside the handler once Zod has validated it — trust the parsed, typed value the SDK passes to the handler.
