---
name: nodejs-npm-workspace
Scope: Before creating, configuring, or modifying packages inside an npm workspace
description: Autonomy rules for npm workspace packages and workspace-aware path resolution.
---

## Package autonomy

Every package inside a workspace must be self-contained. It must run, test, and build without relying on devDependencies declared in the workspace root or any sibling package.

- Declare all required devDependencies directly in the package's own `package.json`
- Install them with `npm install --save-dev <package>` from within the package directory (or via `--prefix`)
- Never assume that a tool installed in the workspace root is available inside a child package

The workspace root `package.json` exists only to define the `workspaces` list and install shared build tooling that is explicitly scoped to the root (e.g. `typescript`, `esbuild`). It is not a dependency provider for child packages.

## Resolving the workspace root path

When a package needs to reference a file at the workspace root (e.g. `.env`), do not use relative paths with `../` counting — they break silently when packages are moved or nested differently.

Use the `npm_config_local_prefix` environment variable, which npm injects automatically pointing to the workspace root whenever a script runs:

```typescript
import { join } from 'node:path'

const envPath = join(process.env.npm_config_local_prefix!, '.env')
```

This works regardless of how deep the package sits in the directory tree.

`npm_config_local_prefix` is only available when the code runs via `npm run`. If the code must also run outside npm scripts, fall back to a relative path or require the caller to pass the path explicitly.
