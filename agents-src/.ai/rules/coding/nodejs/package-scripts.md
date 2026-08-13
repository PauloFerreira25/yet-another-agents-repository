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

`dev` has two shapes, depending on whether the package's `src/index.ts` is meant to be run or only imported.

**Executable model** — an app, server, worker, or Lambda handler with runtime side effects. Running `src/index.ts` live is the point:

```json
"dev": "concurrently \"tsx watch src/index.ts\" \"tsc --noEmit --watch\" \"chokidar 'src/**/*.ts' -c 'npm run lint'\""
```

**Lib model** — a shared-lib or pure utility package whose `src/index.ts` is only a re-export barrel with no top-level side effect. Running it live adds nothing over the type-checker and lint watcher already running alongside it, so `dev` omits `tsx watch` entirely:

```json
"dev": "concurrently \"tsc --noEmit --watch\" \"chokidar 'src/**/*.ts' -c 'npm run lint'\""
```

- `dev` — runs the TypeScript type-checker and the lint watcher in both models; the executable model additionally runs the app live with auto-reload
- `start` — runs compiled output — never runs TypeScript in production
- `ci` — lint, typecheck, tests, build in order; build only runs if everything before it passes

Never use `esw`/`eslint-watch` for the lint watcher. Its `peerDependencies` cap at `eslint@">=8 <9.0.0"`, incompatible with the flat config v9+ this project requires (see `eslint.md`), and ESLint has no native `--watch` flag. Use `chokidar-cli` instead — a generic file watcher that shells out to `npm run lint` on change, with no coupling to the installed ESLint version.

Install required dev tools:

```
npm install -D concurrently chokidar-cli
```

## Installing packages

- Only use packages that are open source and maintained by a company or large community
- Always install the latest version: `npm install <package>` — never specify a version
- Check whether an installed package already solves the problem before adding a new one
- Never manually edit `package.json` to add a dependency with a pinned version — always let npm resolve and record it
- In a workspace, always install with `--prefix` or from within the target package directory — never assume a devDependency in the workspace root is available to child packages

Specifying a version (`npm install <package>@x.y.z`) is only allowed when a human explicitly requests a specific version, or when another installed dependency constrains it as a peer dependency.

**Exception: `@types/node` on AWS Lambda.** Never install `@types/node` at latest in an AWS Lambda project. Pin its major version to match the Lambda runtime's actual Node version — see `coding/nodejs/temporal.md` for that version (currently Node 24). Latest `@types/node` type-checks against a newer Node API surface than the runtime actually provides, which can pass compilation locally while describing APIs that don't exist where the code runs, and can also conflict with a dependency's own types written against an older `worker_threads` (or other core module) surface.

## Updating existing packages

To bump the version of a dependency already in `package.json`, see [[coding/nodejs/dependency-updates]] — use `ncu` rather than checking each package individually online.
