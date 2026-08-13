---
name: nodejs-entry-point
Scope: Before creating a new package or setting up compilation in a Node.js project
description: Every package must have src/index.ts as its single entry point; package.json exports, main, and types all point to dist/index.js.
---

Every package — service or shared-lib — must have `src/index.ts` as its single entry point.

`src/index.ts` may contain only re-exports. A file that exists purely to aggregate and re-export other modules is correct and expected:

```typescript
// src/index.ts
export { AppError, NotFoundError, ValidationError } from './errors.js'
export type { PaginationParams, PaginationResponse } from './types.js'
```

## package.json

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

Never add sub-path exports unless the package explicitly requires them. The default is a single `.` export pointing to `dist/index.js`.

A Lambda domain package (see `architecture/lambda/domain-structure.md`) is the explicit-requirement case: one package exposes several independently-addressable layers — `schema`, `repository`, `service` — each as its own subpath, because each layer is consumed separately by different callers. That is not a violation of this rule; it is the case this rule's exception exists for.
