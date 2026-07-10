---
name: tsconfig-and-metro
Scope: Before configuring modules, writing imports, or setting up TypeScript in an Expo project
description: Expo/Metro tsconfig setup — extends the TypeScript baseline with Expo's base config and Metro bundler resolution
---

For the ESM directive and base compiler options, follow `.ai/rules/coding/typescript/esm-and-tsconfig.md`.

Expo/Metro-specific additions:

- Never use a `.js` extension in local imports — Metro resolves modules without extensions, same as Vite
- Never set `rootDir` or `outDir` — Expo/Metro own the build output, there is no `tsc` emit step
- Extend Expo's base config rather than redefining compiler options from scratch

## tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

`expo/tsconfig.base` sets `jsx`, `lib`, and `moduleResolution` correctly for the Expo/Metro runtime — never override these unless a specific Expo SDK upgrade guide instructs it.

## Metro, not Vite

Metro is the bundler; there is no `vite.config.ts` equivalent to configure module resolution. Path aliases are wired through `babel.config.js`, not `metro.config.js` — see `Path Aliases`.

Type-checking is a separate step from bundling, exactly like the web stack: `tsc --noEmit` runs in CI/`package-scripts`, Metro never type-checks.
