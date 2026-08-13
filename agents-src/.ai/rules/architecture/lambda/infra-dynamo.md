---
name: infra-dynamo
Scope: Before working with the infra-dynamo package or DynamoDB transactions
description: What belongs in infra-dynamo, import boundaries, TransactWriteItem, and interpreting CancellationReasons
---

# infra-dynamo

## What Belongs Here

Always put `DynamoConfig` in this package — it is the type that binds a `DynamoDBDocumentClient` to a `tableName`, and it is the reason the package exists.

## Import Rules

`infra-dynamo` may import from the AWS SDK.

Never import from schema, repository, service, or lambda packages. `infra-dynamo` has no knowledge of any domain.

## TransactWriteItem in Repositories

`TransactWriteItem` is not exported as a standalone type by either AWS SDK package. Never import it directly from `@aws-sdk/client-dynamodb` or `@aws-sdk/lib-dynamodb` — both are wrong:

- `@aws-sdk/client-dynamodb` does export a type named `TransactWriteItem`, but it belongs to the low-level client. Its `Put.Item` / `Update.Key` / `ExpressionAttributeValues` require raw, manually-marshalled `AttributeValue` shapes (`{ S: 'value' }`), not plain JS values.
- The code that actually sends the transaction uses `TransactWriteCommand` from `@aws-sdk/lib-dynamodb` — the Document Client — which auto-marshals plain JS values, the same convention every other command in the project already follows (`PutCommand`, `UpdateCommand`, etc.). Passing the low-level client's `TransactWriteItem` shape into `TransactWriteCommand` fails to compile: its plain-value `Item`/`Key` are not assignable to `Record<string, AttributeValue>`.

Always derive the Document Client's transact item type instead of importing a name — the Document Client's transact item type is a computed type with no exported name of its own:

```typescript
import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

export type TransactWriteItem = NonNullable<TransactWriteCommandInput['TransactItems']>[number]
```

Define this in `infra-dynamo` and import it in repository files that need it. Leave a comment at the point of use explaining why it is derived rather than imported directly, so it doesn't get "simplified" back into a plain SDK import later.

## Interpreting CancellationReasons

Never treat `CancellationReason.Code` as a boolean or truthy check when interpreting `TransactionCanceledException.CancellationReasons` to find out which transact item caused a cancellation. DynamoDB sets `Code` to the literal string `"None"` for every item that did **not** cause the cancellation — never `null` or `undefined` — despite the AWS SDK's own type declaration doc comment implying otherwise ("If no error occurred... an error with a Null code... will be present"). A bare truthy check (`reason?.Code`) passes exactly as much for `"None"` as for a real failure code, so the first item in the array always "wins," regardless of which one actually failed.

Always check explicitly:

```typescript
import type { CancellationReason } from '@aws-sdk/client-dynamodb'

export type DidItemFailParams = { reason?: CancellationReason }

export function didItemFail(params: DidItemFailParams): boolean {
  return params.reason?.Code !== undefined && params.reason.Code !== 'None'
}
```
