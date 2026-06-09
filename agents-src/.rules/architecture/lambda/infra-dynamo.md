---
name: infra-dynamo
Scope: Before working with the infra-dynamo package or DynamoDB transactions
description: What belongs in infra-dynamo, import boundaries, and the Transact exception
---

# infra-dynamo

## What Belongs Here

Always put `DynamoConfig` in this package — it is the type that binds a `DynamoDBDocumentClient` to a `tableName`, and it is the reason the package exists.

Always put `Transact` here as a named type. It is the execution contract used by orchestrator services for atomic operations.

Never put `makeTransact` here. It is three lines with no logic — it belongs inline in the handler that needs it.

## Import Rules

`infra-dynamo` may import from the AWS SDK.

Never import from schema, port, repository, service, or lambda packages. `infra-dynamo` has no knowledge of any domain.

## The Intentional Exception: Orchestrators Import `Transact`

Orchestrator services import `Transact` from `@<project>/infra-dynamo`. This violates the general rule that services do not know infrastructure — and the violation is accepted consciously.

**Why:** DynamoDB's `TransactWriteCommand` requires all items to be sent in a single API call. There is no `BEGIN TRANSACTION` / `COMMIT` sequence as in SQL databases. The coordinator must collect all items and know how to send them together. Making the orchestrator completely infrastructure-agnostic without an external transaction manager — which does not exist in the Lambda/DynamoDB ecosystem — is not possible.

**What the orchestrator is allowed to import:** only `Transact`.

Never allow the orchestrator to import `DynamoDBClient`, `TransactWriteCommand`, or `tableName`. The internals of each domain remain opaque. The coupling is to the atomic execution contract, not to the DynamoDB implementation.

## TransactWriteItem in Ports

When an infrastructure type is not abstracted — used as-is without transformation — import it directly from its source.

`TransactWriteItem` is not wrapped or transformed anywhere in the project. Re-exporting it via `infra-dynamo` would create indirection without abstraction. Import it from `@aws-sdk/lib-dynamodb` directly in port files that need it.
