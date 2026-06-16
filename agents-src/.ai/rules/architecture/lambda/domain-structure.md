---
name: domain-structure
Scope: Before creating or reorganizing a Lambda project structure
description: Domain-first organization, workspace config, TypeScript setup, and exports
---

# Lambda Domain Structure

## Organization

Always organize by domain first, layer second. Never organize by layer first.

```
app/
  domain/
    product/src/schema/, port/, repository/, service/
    order/src/schema/, port/, repository/, service/
    checkout/src/service/        ← orchestrator: no repository
  shared/infra-dynamo/, error/, util/
  lambdas/http/, sqs/, cron/
```

Never place schema, repository, or service at the workspace root as sibling directories.

Never place domain packages as direct children of `app/` — all domain packages live under `app/domain/`.

## Workspace package.json

Always list workspace packages explicitly. Never use globs.

Globs cause npm to interpret intermediate directories (e.g. `shared/`) as packages. List every package by path.

## Package Naming

Domain packages: `@<project>/<domain>` (e.g. `@<project>/product`).

Lambda packages: `@<project>/lambda-<trigger>-<path>` where path segments are joined with `-` (e.g. `@<project>/lambda-http-v1-checkout-post`).

Path parameters use `_` prefix in the directory name: `_id` represents `{id}` in the URL.

Each HTTP method is an independent npm package — one bundle per Lambda, no shared code between routes.

## TypeScript Configuration

`app/tsconfig.base.json` declares shared compiler options only. Never add `include`, `outDir`, or `rootDir` to the base — these are path-relative and must be declared by each package.

Each package's `tsconfig.json` must declare:
- `"composite": true`
- `"rootDir": "src"`
- `"outDir": "dist"`
- `"references"` listing every internal dependency

`app/tsconfig.json` at the workspace root has `"files": []` and references every package. This is the single entry point for `tsc --build`.

Never commit `dist/`. Add `**/dist/` to `.gitignore`.

## Exports

Each domain package exposes layers via wildcard subpath exports:

```json
"exports": {
  "./schema":       "./dist/schema/index.js",
  "./port/*":       "./dist/port/*.js",
  "./repository/*": "./dist/repository/*.js",
  "./service/*":    "./dist/service/*.js"
}
```

`schema` uses `index.js` — it is a single stable file. All other layers use wildcards — each file is addressable directly with no manual maintenance when new files are added.

Exports point to `./dist/` — `tsc --build` must run before esbuild consumes any domain package.
