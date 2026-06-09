---
name: nodejs-esm-and-tsconfig
Scope: Before configuring modules, writing imports, or setting up TypeScript
description: Always use ES Modules; required tsconfig.json compiler options for all Node.js + TypeScript projects.
---

## ES Modules

Always use ES Modules. Never use CommonJS.

- Set `"type": "module"` in `package.json`
- Use `import`/`export` syntax in all files
- Use `.js` extension in all local imports — required by NodeNext module resolution
- Never use `require()`, `module.exports`, or `exports`

```typescript
import { findById } from './entity.service.js'
import type { Entity } from './entity.model.js'
```

## tsconfig.json

Required compiler options for all projects:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

For `shared-libs` packages published to npm, also add:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

Never use `"moduleResolution": "node"` — it does not support ESM correctly.
