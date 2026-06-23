---
name: react-esm-and-tsconfig
Scope: Before configuring modules, writing imports, or setting up TypeScript in a React Vite project
description: React Vite tsconfig setup — extends the TypeScript baseline with Bundler resolution and React JSX
---

For the ESM directive and base compiler options, follow `.ai/rules/coding/typescript/esm-and-tsconfig.md`.

React/Vite-specific additions:

- Never use `.js` extension in local imports — Vite's bundler resolves modules without extensions
- Never set `rootDir` or `outDir` — Vite owns the build output

## tsconfig.json (React/Vite additions)

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "noEmit": true
  }
}
```

`"noEmit": true` — TypeScript only type-checks; Vite handles compilation and output.

`"moduleResolution": "Bundler"` — correct for Vite projects. Never use `"NodeNext"` in a Vite project — it requires `.js` extensions that Vite does not need and that break tree-shaking.
