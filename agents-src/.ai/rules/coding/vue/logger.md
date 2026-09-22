---
name: vue-logger
Scope: When logging diagnostic information, debugging, or recording runtime events
description: One centralized logger, never a bare console call, and nothing sensitive in a log line.
---

Log through a single module in `app/utils/`. Never call `console` directly in application code.

A central logger is what makes it possible to silence output by level in production, route errors to a reporting service, and add context uniformly. Scattered `console` calls can do none of that and are individually invisible.

Use levels with intent: `debug` for tracing during development, `info` for meaningful lifecycle events, `warn` for a recovered problem, `error` for a failure that reached the user.

Never leave a `debug` call behind after the problem is solved. Debug output left in place becomes noise that trains everyone to ignore the console.

## What never goes in a log

Never log credentials, tokens, session identifiers, or personal data. A browser log is readable by anyone with the device, and is frequently captured by monitoring tools.

Never log an entire API response or an entire store. Log the identifier and the operation.

## Errors

Log the technical detail where the error is handled, and show the user something they can act on — see [[coding/vue/error-handling]]. The two carry different content on purpose.

Include what makes the entry diagnosable: the operation, the relevant identifier, the error. Never log a bare message with no context, which tells a reader that something failed but nothing about what.

See [[coding-principles/logging]] for the general principles.
