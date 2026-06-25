---
name: nodejs-shared-libs
Scope: Before creating shared logic or resolving local packages in a monorepo
description: shared-libs structure, TypeScript compilation requirements, and scoping conventions. Package resolution is covered by npm-workspace.md.
---

For workspace configuration and package resolution, follow `npm-workspace.md`.

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
- Must be publishable to npm without changes

Never create shared logic (error classes, utilities, types) directly in a project — extract to a shared-lib.

## Scoping conventions

Use a scoped name that signals the audience of the library:

- Generic libs reusable across any project (no business logic, no domain knowledge) use a shared technical scope
- Project-specific or business domain libs use a scope tied to the project that owns them

Each project defines its own scopes. Keep generic and project-specific libs in separate scopes so the audience is clear from the import path.
