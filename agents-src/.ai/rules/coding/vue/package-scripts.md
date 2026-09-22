---
name: vue-package-scripts
Scope: Before setting up or modifying package.json scripts, or installing dependencies in a Vue project
description: Vue specialization of the Node.js package script baseline — linting runs through the Vue-aware linter, and type checking covers Single File Components.
---

For dependency installation rules, follow [[coding/nodejs/package-scripts]]. For how versions are chosen, follow [[common/dependency-version-matrix]].

**The lint scripts in that baseline do not apply.** It prescribes ESLint; this stack does not use it. Lint runs through `oxlint-vue`, never the base `oxlint` binary and never `eslint` — see [[coding/vue/lint]].

**Its paths do not apply either.** That baseline writes `src` as the source directory. This stack uses `app` — see [[architecture/frontend/vue/folder-structure]]. Never add a `src/` directory to make one of its example scripts work as written.

Scripts that are identical in both delivery modes:

```json
{
  "scripts": {
    "lint":       "oxlint-vue .",
    "lint:fix":   "oxlint-vue . --fix",
    "test":       "vitest run",
    "test:watch": "vitest",
    "coverage":   "vitest run --coverage"
  }
}
```

Type checking uses the Single File Component-aware type checker, never `tsc` alone. `tsc` does not understand `.vue` files and reports a clean run over a project it never examined — which is worse than no type check, because it is trusted.

The development, build and preview scripts come from the mode's own tooling:

| Script | Vite SPA | Nuxt |
|---|---|---|
| `dev` | the Vite dev server | the Nuxt dev server |
| `build` | type check, then the Vite build | the Nuxt build |
| `preview` | serve the built output locally | serve the built output locally |

Build runs the type check first, so a build only happens over code that type-checks.

Add a `ci` script running lint, build and tests in that order, each gating the next.

Never run the dev server and the type checker through a process multiplexer in place of a real build step. Never use Node.js server patterns — running a bundled entry point directly — in either mode.
