---
name: react-package-scripts
Scope: Before setting up or modifying package.json scripts, or installing dependencies in a React project
description: React Vite scripts — extends the Node.js package rules with Vite-specific dev, build, and preview scripts
---

For package installation rules, follow `.ai/rules/coding/nodejs/package-scripts.md`.

React/Vite-specific scripts:

```json
{
  "scripts": {
    "dev":        "vite",
    "build":      "tsc -b && vite build",
    "preview":    "vite preview",
    "lint":       "oxlint",
    "lint:fix":   "oxlint --fix",
    "test":       "vitest run",
    "test:watch": "vitest",
    "coverage":   "vitest run --coverage",
    "ci":         "npm run lint && npm run build && npm run test"
  }
}
```

- `dev` — Vite dev server with HMR
- `build` — type-checks first (`tsc --noEmit`), then Vite bundles; build only runs if typecheck passes
- `preview` — serves the production build locally for manual verification
- `ci` — lint, build (includes typecheck), tests in order; each step must pass before the next runs

Never use `tsx watch`, `concurrently`, or `node dist/` in a React project — these are Node.js patterns.
