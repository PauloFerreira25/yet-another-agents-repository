---
name: nodejs-type-specialization
Scope: Before defining shared handler types or importing common types in domain files
description: Shared types must be centralized in src/shared/commons/handler.types.ts — never imported directly from external packages in domain files.
---

Each project must create `src/shared/commons/handler.types.ts` to:
1. Re-export common types (IdParams, PaginationParams, PaginationResponse, etc.) — making it the single import point within the project
2. Specialize base types by combining them with the project's own framework types

```typescript
// src/shared/commons/handler.types.ts

// Re-export shared types — everything in the project imports from here
export type { IdParams, PaginationParams, PaginationMeta, PaginationResponse } from '@src/shared/commons/base.types.js'

// Specializations: base types + project-specific framework types
// defined by each project's architecture document
```

Within a project, always import from `src/shared/commons/handler.types.ts`. Never import directly from shared-libs in domain or handler files:

```typescript
// correct
import type { IdParams } from '@src/shared/commons/handler.types.js'

// wrong — bypasses the specialization layer
import type { IdParams } from '@<scope>/commons-types'
```

The shared-lib stays clean and framework-agnostic. `handler.types.ts` is where project-specific framework knowledge lives.
