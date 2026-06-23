---
name: nodejs-esm-and-tsconfig
Scope: Before configuring modules, writing imports, or setting up TypeScript in a Node.js project
description: Node.js ESM and tsconfig setup — extends the TypeScript baseline with NodeNext resolution
---

For the ESM directive and base compiler options, follow `.ai/rules/coding/typescript/esm-and-tsconfig.md`.

Node.js-specific addition: always use `.js` extension in local imports — required by NodeNext module resolution:

```typescript
// correct
import { findById } from './entity.service.js'
import type { Entity } from './entity.model.js'

// wrong
import { findById } from './entity.service'
```

## tsconfig.json (Node.js additions)

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

Never use `"moduleResolution": "node"` — it does not support ESM correctly.

For `shared-libs` packages published to npm, also add:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```
