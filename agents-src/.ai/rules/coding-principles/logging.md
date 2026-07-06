---
name: logging
Scope: Before adding log statements to any layer
description: First-line log in every function, outcome logs for meaningful results, full result objects, and sensitive data rules.
---

## First-line log

The first line of every function must be a debug log with the function name. No exceptions.

The second argument or label is always the exact function name — this makes `grep` on logs reliable.

Never collapse two functions into one to avoid writing an extra log. Every function boundary exists for architectural reasons. The log is not a burden; it is the point.

## Outcome logs

Add a debug log when a function produces a meaningful result: a record persisted, a value computed, a decision made, an external call that returned a result.

Convention: `<functionName>:<outcome>`

What warrants an outcome log: record persisted, value computed (discount, fee, score), decision made (eligibility, rule evaluation), external call succeeded.

What does not: a simple lookup that returns a value or null, transformations with no side effects obvious from the entry log.

## Log the full result

Always log the full result object — never cherry-pick individual fields.

Exception: when the result contains sensitive data, omit those specific fields and log the rest. Never omit fields for any other reason.

## Sensitive data

When parameters contain sensitive data (passwords, tokens, personal data), log an explicit object omitting the sensitive fields. Never suppress the log — only omit the fields.

Never log the full params object when it contains sensitive fields.
