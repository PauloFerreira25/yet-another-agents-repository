---
name: destructive-operations
Scope: Before running any command that drops, truncates, or irreversibly deletes data, schema, or infrastructure
description: Destructive operations against a database or infrastructure always require explicit human confirmation, regardless of environment.
---

Always ask for explicit confirmation before running any command that drops or truncates a table,
drops a database or schema, deletes data with no way to recover it, or destroys a provisioned
infrastructure resource — `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, an unscoped `DELETE`, a
table/stack/stream deletion in any managed datastore, or the equivalent destroy/teardown command
for any infrastructure resource.

"It's just a local/dev environment" or "the data is disposable/test data" is never sufficient
justification to skip asking. Confirm every time, in every environment — including a dev
container, a local database, a sandbox account, or data/resources you believe are only test
fixtures. The human, not the agent, decides whether what is in front of them is actually
disposable.

State exactly what will be dropped, deleted, or destroyed, and why, before asking — a vague "can
I clean this up?" is not an adequate confirmation request. Only proceed after an explicit yes to
that specific operation; a prior general approval to "fix this" or "unblock the migration" does
not cover a destructive operation discovered along the way.
