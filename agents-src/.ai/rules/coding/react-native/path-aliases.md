---
name: react-native-path-aliases
Scope: Before using @/ imports or configuring Metro or tsconfig in an Expo project
description: '@/ alias setup for Expo projects — Metro resolves tsconfig.json paths natively since Expo SDK 50, no Babel plugin required'
---

Use `@/` as an alias for the `src/` directory:

```ts
// wrong
import { produtoService } from '../../../../service/produto/produto.service'

// correct
import { produtoService } from '@/service/produto/produto.service'
```

For the TypeScript baseline, follow `.ai/rules/coding/typescript/path-aliases.md` — the `paths` entry in `tsconfig.json` is identical.

Since Expo SDK 50, `@expo/metro-config` resolves `compilerOptions.baseUrl` and `compilerOptions.paths` from `tsconfig.json` natively, at bundle time. Never add `babel-plugin-module-resolver` or a `module-resolver` Babel plugin entry for this — it is redundant on SDK 50+ and must not be introduced.

## Requirements for native resolution to work

- `metro.config.js` must build its config from `getDefaultConfig` in `expo/metro-config` — this is what wires `tsconfigPaths` resolution in. Never replace it with a hand-rolled resolver.
- `tsconfig.json` must declare `baseUrl` and `paths`, exactly as in the TypeScript baseline rule.
- After adding or changing a `paths` entry, restart the Expo CLI with the cache cleared (`npx expo start -c`) — Metro does not pick up `tsconfig.json` changes on a plain hot reload.

## metro.config.js

```js
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

module.exports = config
```

No `resolver.alias` entry or Babel plugin is needed beyond this. If the project needs other Metro customization (SVG transforms, monorepo `watchFolders`, etc.), extend this `config` object — never bypass `getDefaultConfig`, since that call is what enables `tsconfigPaths` resolution.
