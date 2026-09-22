---
name: vue-path-aliases
Scope: Before using @/ imports or configuring path aliases in a Vue project
description: Vue specialization of the TypeScript path alias baseline — the alias points at app/, and the baseline's ESLint section does not apply.
---

Use `@/` as the alias for the source root, which is `app/` — see [[architecture/frontend/vue/folder-structure]]:

```ts
// wrong
import { productService } from '../../../services/product/product.service'

// correct
import { productService } from '@/services/product/product.service'
```

For the TypeScript configuration itself, follow [[coding/typescript/path-aliases]]. The setup is identical; only the alias name and target differ — `@/*` resolving to `./app/*`.

**The ESLint section of that baseline does not apply.** ESLint is not part of this stack, so there is no import resolver to configure — see [[coding/vue/lint]]. Never add ESLint to a Vue project in order to satisfy it.

## Nuxt

The alias is provided. Nuxt maps `@/` and `~/` to the source root with no configuration, and generates the TypeScript paths itself. Never redeclare it, and never edit the generated configuration — extend from it.

## Vite

Declare the alias in two places, which must agree: the bundler resolves it at build time, TypeScript resolves it for the editor and the type check. Vite resolves aliases natively, so no post-build path rewriting is needed.

Declare it once in the config file shared by the build and the test runner, so the alias cannot drift between them — see [[coding/vue/spa/project-scaffold]].

Never set `baseUrl`. It is deprecated, and `paths` resolves relative to the configuration file's own location without it.
