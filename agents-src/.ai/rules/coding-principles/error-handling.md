---
name: error-handling
Scope: Before writing error handling, propagation, or logging code
description: Error handling, propagation, and logging rules
---

# Error Handling

## Principles

Always handle errors — log with context or propagate explicitly. Never silently swallow an error.

Fail fast: detect and report errors as early as possible. Never defer error detection to a later stage when it can be caught at the boundary.

## Propagation

Use language-appropriate error handling mechanisms. Propagate errors to the appropriate handling level.

Provide meaningful error messages. Include error context when re-throwing — never discard the original cause.

## Logging

Log errors with enough context to reproduce and debug the problem.

Never include passwords, tokens, or PII in log output. Mask or exclude sensitive data before logging.
