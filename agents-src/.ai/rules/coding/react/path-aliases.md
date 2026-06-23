---
name: react-path-aliases
Scope: Before using @/ imports or configuring Vite or tsconfig in a React project
description: @/ alias setup for React Vite projects — extends the TypeScript baseline with Vite-specific resolution
---

Use `@/` as an alias for the `src/` directory:

```ts
// wrong
import { produtoService } from '../../../../service/produto/produto.service'

// correct
import { produtoService } from '@/service/produto/produto.service'
```

For the TypeScript baseline configuration, follow `.ai/rules/coding/typescript/path-aliases.md` — the setup is identical, only the alias name differs (`@/*` instead of `@src/*`).

## tsconfig.app.json

Add to `tsconfig.app.json` (not the root `tsconfig.json`, which the scaffold leaves as a project-references file with no `compilerOptions`):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
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

