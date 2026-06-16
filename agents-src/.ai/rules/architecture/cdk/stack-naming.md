---
name: cdk-stack-naming
Scope: Before creating or naming a new stack
description: Stack IDs are PascalCase of the directory path, with no redundancy.
---

Stack IDs are PascalCase of the directory path, with no redundancy:

| File | Stack ID |
|---|---|
| `stacks/global/global-stack.ts` | `Global` |
| `stacks/region/us-east-1/shared-stack.ts` | `UsEast1Shared` |
| `stacks/region/us-east-1/dev/dev-stack.ts` | `UsEast1Dev` |
| `stacks/region/us-east-1/dev/api-stack.ts` | `UsEast1DevApi` |
| `stacks/region/us-east-1/prd/data-stack.ts` | `UsEast1PrdData` |
| `stacks/region/sa-east-1/dev/api-stack.ts` | `SaEast1DevApi` |

Derive the stack ID by converting each path segment to PascalCase and concatenating — skip segments that would create redundancy (e.g. "Dev" from `dev/dev-stack.ts` counts once, not twice).
