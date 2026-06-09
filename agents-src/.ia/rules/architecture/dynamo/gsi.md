---
name: dynamo-gsi
Scope: Before creating or naming a Global Secondary Index
description: GSI naming convention and creation policy for DynamoDB.
---

## Naming

Always use descriptive names based on the indexed field, following the pattern `{field}-index`:

```
personId-index   ✅
email-index      ✅
GSI1             ❌
GSI2             ❌
```

The name must make the field and the purpose of the index clear without having to open the code.

## Creation policy

Only create a GSI when there is code that uses it. Never create in anticipation.

DynamoDB allows adding GSIs to existing tables at any time with no downtime and no data loss — there is no cost in waiting.
