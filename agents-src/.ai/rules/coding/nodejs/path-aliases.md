---
name: nodejs-path-aliases
Scope: Before using @/ imports, configuring vitest, or configuring eslint import order in a Node.js project
description: Node.js path alias setup — extends the TypeScript baseline with tsc-alias for build
---

For tsconfig.json, vitest, and ESLint configuration, follow `.ai/rules/coding/typescript/path-aliases.md`.

Node.js-specific addition: TypeScript compiles path aliases but does not rewrite them in emitted JavaScript. Use `tsc-alias` to rewrite `@/*` after compilation:

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
