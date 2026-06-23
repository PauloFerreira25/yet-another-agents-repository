---
name: nodejs-eslint
Scope: Before configuring ESLint or resolving ESLint errors in a Node.js project
description: Node.js ESLint setup — extends the TypeScript baseline with the NodeNext import resolver
---

For the base ESLint config, follow `.ai/rules/coding/typescript/eslint.md`.

Node.js-specific addition: `eslint-import-resolver-typescript` is required for `eslint-plugin-import` to resolve `.js` imports to `.ts` files under NodeNext. Without it, ESLint reports missing modules on every local import.

Add to the config object:

```javascript
settings: {
  'import/resolver': {
    typescript: { alwaysTryTypes: true },
  },
},
```

Install:

```
npm install -D eslint-import-resolver-typescript
```
