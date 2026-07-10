---
name: react-native-path-aliases
Scope: Before using @/ imports or configuring Babel or tsconfig in an Expo project
description: '@/ alias setup for Expo projects — babel-plugin-module-resolver drives runtime resolution, tsconfig drives type-checking'
---

Use `@/` as an alias for the `src/` directory:

```ts
// wrong
import { produtoService } from '../../../../service/produto/produto.service'

// correct
import { produtoService } from '@/service/produto/produto.service'
```

For the TypeScript baseline, follow `.ai/rules/coding/typescript/path-aliases.md` — the `paths` entry in `tsconfig.json` is identical. The difference from both the Node.js and web stacks is the runtime resolver: Metro does not read `tsconfig.json` paths at bundle time, so a Babel plugin is required.

## babel.config.js

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: { '@': './src' },
        },
      ],
    ],
  }
}
```

```
npm install -D babel-plugin-module-resolver
```

Without this plugin, `tsc` type-checks `@/` imports correctly (via `tsconfig.json`) but Metro fails to resolve them at runtime — both configs must stay in sync. When adding a new alias segment, update `tsconfig.json` `paths` and `babel.config.js` `alias` together; never one without the other.
