---
name: domain-structure
Scope: Before creating or reorganizing a Lambda project structure
description: Domain-first organization, workspace config, TypeScript setup, and exports
---

# Lambda Domain Structure

This rule applies to an AWS Lambda project, where each domain layer and each handler is its own independently deployed npm package. For a long-running Node.js service — a single deployable process (an HTTP server, a queue consumer, or both) running from one codebase — follow `architecture/nodejs/folder-and-layers.md` instead; the two layering models are not interchangeable.

## Organization

Always organize by domain first, layer second. Never organize by layer first.

```
app/
  domain/
    product/src/schema/, repository/, service/
    order/src/schema/, repository/, service/
    checkout/src/service/, repository/   ← orchestrator: repository is transaction execution only, no owned table
  shared/infra-dynamo/, schema/, error/, util/
  lambdas/http/, sqs/, cron/
```

`app/shared/` is where this project's own shared code lives — `infra-dynamo`, `schema`, `error`, `util`.

There is no separate `port/` package. A repository package exports both its `make*` factory and the named type alias describing the returned function's shape (e.g. `FindProductById`) — what used to be the port's job now lives in the same package as the implementation. See [layer-rules.md](layer-rules.md) for the type-only-import rule that preserves the decoupling a port used to provide.

Never place schema, repository, or service at the workspace root as sibling directories.

Never place domain packages as direct children of `app/` — all domain packages live under `app/domain/`.

`shared/schema/` holds a type shared across every domain (e.g. a common `IdParams`) — one instance for the whole system, never duplicated per domain. This is distinct from `domain/<name>/src/schema/`, which holds types scoped to that one domain only. See [layer-rules.md](layer-rules.md) for which layers may import `shared/schema/`.

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

Never add `"references"` to a package's `tsconfig.json`, and never maintain a root `tsconfig.json` that references every package. Build order is not derived from `tsc --build`'s own reference graph — a project-specific tiered build script (e.g. `build-all.sh`) is the single source of truth for build order instead. Each package builds independently via its own `tsc --build` invocation, run in whatever order the build script's tiers dictate. A `"references"` entry, or a root tsconfig built around them, would be dead weight at best: nothing consults it for ordering, and — worse — a stale, half-maintained reference graph (e.g. a root tsconfig left behind after a migration, still pointing at a package that no longer exists) can silently break unrelated tooling that walks the directory tree looking for a tsconfig to resolve, such as a test runner, even though nothing in the real build ever reads it.

The build script must also run each package's own `test` script as part of building it, when that package's `package.json` declares one — never just `npm run build` alone — and fail that package's build the same way a `tsc --build` failure does if the tests don't pass. Skip packages that declare no `test` script. Run tests before build, matching `package-scripts.md`'s own per-package `ci` order (`lint && tsc --noEmit && test && build`). This gate exists because a clean full rebuild is not evidence that a package's existing tests still pass — building and testing are separate steps, and both must be gated, or a real regression can go unnoticed while the pipeline still reports success: a stale root tsconfig once silently broke one package's real test suite while every other package's rebuild kept succeeding, because the build script only ran `npm run build` and never `npm run test`.

Never commit `dist/`. Add `**/dist/` to `.gitignore`.

## Exports

Each domain package exposes layers via wildcard subpath exports:

```json
"exports": {
  "./schema":       "./dist/schema/index.js",
  "./repository/*": "./dist/repository/*.js",
  "./service/*":    "./dist/service/*.js"
}
```

`schema` uses `index.js` — it is a single stable file. All other layers use wildcards — each file is addressable directly with no manual maintenance when new files are added.

Exports point to `./dist/` — `tsc --build` must run before esbuild consumes any domain package.

A subpath wildcard import specifier must omit the file extension: `import { x } from '@lab/product/service/foo.service'`, never `'.../foo.service.js'`. This is the opposite of every other local import in this codebase (`esm-and-tsconfig.md` requires `.js` on relative imports) — the wildcard target already supplies its own `.js`. The `*` in `"./service/*": "./dist/service/*.js"` captures the entire literal remainder of the specifier the caller typed, including any extension typed there, and substitutes it into a target that already ends in `.js`. Typing the extension in the specifier doubles it into `*.js.js`, which fails both TypeScript's module resolution (`TS2307`) and Node's runtime ESM resolution (`ERR_MODULE_NOT_FOUND`).
