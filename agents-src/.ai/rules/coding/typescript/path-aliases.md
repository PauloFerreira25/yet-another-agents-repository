---
name: path-aliases
Scope: Before configuring path aliases in tsconfig, vitest, or eslint
description: @/ alias setup — tsconfig, vitest, and ESLint. Runtime resolution is tooling-specific and handled by nodejs or react rules
---

Use `@/` as an alias for the `src/` directory to eliminate deep relative imports:

```typescript
// wrong
import { config } from '../../../../shared/config.js'

// correct
import { config } from '@/shared/config.js'
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
})
```

## ESLint

```javascript
'import/order': ['error', {
  'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  'pathGroups': [{ pattern: '@/**', group: 'internal' }],
  'newlines-between': 'always',
}],
```

Runtime build resolution (`tsc-alias` for Node.js, Vite config for React) is handled by the respective tooling rule.
