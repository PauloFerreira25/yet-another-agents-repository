---
name: nodejs-path-aliases
Scope: Before using @src imports, configuring vitest, or configuring eslint import order
description: @src alias setup across tsconfig, tsc-alias, vitest, and eslint.
---

Use `@src` as an alias for the `src/` directory to eliminate deep relative imports:

```typescript
// wrong
import { config } from '../../../../shared/config.js'

// correct
import { config } from '@src/shared/config.js'
```

## tsconfig.json

Add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@src/*": ["src/*"] }
  }
}
```

## Runtime resolution (build)

TypeScript compiles path aliases but does not rewrite them in the emitted JavaScript. Use `tsc-alias` to rewrite `@src/*` after compilation:

```
npm install -D tsc-alias
```

```json
{
  "scripts": {
    "build": "tsc && tsc-alias"
  }
}
```

The `dev` script requires no change — `tsx` resolves path aliases from `tsconfig.json` natively.

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: { '@src': resolve(import.meta.dirname, 'src') },
  },
})
```

## ESLint

Add `pathGroups` to `import/order` so the alias is treated as internal:

```javascript
'import/order': ['error', {
  'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  'pathGroups': [{ pattern: '@src/**', group: 'internal' }],
  'newlines-between': 'always',
}],
```
