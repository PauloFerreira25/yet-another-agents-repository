---
name: nodejs-shared-libs
Scope: Before creating shared logic or resolving local packages in a monorepo
description: Monorepo resolution via file: references, shared-libs structure, and scoping conventions.
---

## Package resolution

Never use the `workspaces` field in `package.json`. Resolve local packages via `file:` references:

```json
{
  "dependencies": {
    "@<scope>/commons-errors": "file:../../shared-libs/commons-errors"
  }
}
```

Each package remains independent with its own `node_modules`.

## shared-libs structure

Shared libraries live in `shared-libs/`. Each one is an independent npm-publishable package:

```
shared-libs/
└── commons-errors/
    ├── src/
    │   └── index.ts
    ├── package.json   ← name, version, exports, types
    └── tsconfig.json  ← declaration: true
```

Requirements for every shared-lib:
- Must have a proper `name` (scoped), `version`, and `exports` field in `package.json`
- Must compile to `dist/` with `declaration: true` — consumers depend on the compiled output
- Must be referenceable via `file:` in development and publishable to npm without changes

Never create shared logic (error classes, utilities, types) directly in a project — extract to a shared-lib.

## Scoping conventions

Use a scoped name that signals the audience of the library:

- Generic libs reusable across any project (no business logic, no domain knowledge) use a shared technical scope
- Project-specific or business domain libs use a scope tied to the project that owns them

Each project defines its own scopes. Keep generic and project-specific libs in separate scopes so the audience is clear from the import path.
