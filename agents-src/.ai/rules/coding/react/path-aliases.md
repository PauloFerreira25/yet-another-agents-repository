---
name: react-path-aliases
Scope: Before using @/ imports or configuring Vite, tsconfig, or eslint import order in a React project
description: @/ alias setup for React Vite projects — extends the TypeScript baseline with Vite-specific resolution
---

Use `@/` as an alias for the `src/` directory:

```ts
// wrong
import { produtoService } from '../../../../service/produto/produto.service'

// correct
import { produtoService } from '@/service/produto/produto.service'
```

For `tsconfig.json` and ESLint configuration, follow `.ai/rules/coding/typescript/path-aliases.md` — the setup is identical, only the alias name differs (`@/*` instead of `@src/*`).

## tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## vite.config.ts

Vite resolves aliases natively at runtime and build — no `tsc-alias` needed:

```ts
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
})
```

## ESLint

```js
'import/order': ['error', {
  'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  'pathGroups': [{ pattern: '@/**', group: 'internal' }],
  'newlines-between': 'always',
}],
```
