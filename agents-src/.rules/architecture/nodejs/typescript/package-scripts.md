---
name: nodejs-package-scripts
Scope: Before setting up or modifying package.json scripts, or installing dependencies
description: Required npm scripts, dev tooling, and package installation rules.
---

## Required scripts

```json
{
  "type": "module",
  "scripts": {
    "dev":        "concurrently \"tsx watch src/index.ts\" \"tsc --noEmit --watch\" \"esw --watch src\"",
    "build":      "tsc",
    "start":      "node dist/index.js",
    "lint":       "eslint src",
    "lint:fix":   "eslint src --fix",
    "test":       "vitest run",
    "test:watch": "vitest",
    "coverage":   "vitest run --coverage",
    "ci":         "npm run lint && tsc --noEmit && npm run test && npm run build"
  }
}
```

- `dev` — runs three processes in parallel: app with auto-reload, TypeScript type checker, ESLint watcher
- `start` — runs compiled output — never runs TypeScript in production
- `ci` — lint, typecheck, tests, build in order; build only runs if everything before it passes

Install required dev tools:

```
npm install -D concurrently eslint-watch
```

## Installing packages

- Only use packages that are open source and maintained by a company or large community
- Always install the latest version: `npm install <package>` — never specify a version
- Check whether an installed package already solves the problem before adding a new one
- Never manually edit `package.json` to add a dependency with a pinned version — always let npm resolve and record it

Specifying a version (`npm install <package>@x.y.z`) is only allowed when a human explicitly requests a specific version, or when another installed dependency constrains it as a peer dependency.
