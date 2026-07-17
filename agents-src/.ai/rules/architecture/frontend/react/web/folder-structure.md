---
name: folder-structure
Scope: When creating or organizing project files
description: Centralized layer-based folder structure with DDD subdivision for domain-specific artifacts
---

## App root

```
app root
  public/
    locale/
      pt-BR/
        translation.json
      en/
        translation.json
  src/
    component/
    hook/
    lib/
    page/
    router/
    service/
    store/
    type/
    main.tsx
  index.html
  vite.config.ts
  tsconfig.json
  .oxlintrc.json
  .env
  .env.local
  .env.production
```

This is the React web app's own root — the directory containing its `package.json`, `vite.config.ts`, and build tooling. In a single-app repository this is also the repository root. In a monorepo with multiple systems, it is the app's package directory (e.g. `apps/web/`) — never assume it is the repository's top-level root.

Translation files live in `public/locale/` so Vite serves them statically and `i18next-http-backend` loads them on demand without bundling.

## `src/` structure

```
src/
  component/
    atom/          ← single-purpose, stateless building blocks
    molecule/      ← combinations of atoms
    organism/      ← complex self-contained sections
    template/      ← page layouts with slot structure, no real data
    layout/        ← full-screen layouts that render <Outlet /> for router children
    ui/            ← shadcn/ui components (read-only, never edit directly)
  hook/
    error/         ← generic error-handling hooks (useQueryError, useFormError)
    form/          ← generic form utility hooks
    realtime/      ← generic SSE hooks (useSSE)
  lib/
    i18n.ts        ← i18next configuration
    i18n.d.ts      ← TypeScript key safety declaration
    logger.ts      ← centralized logger
    queryConfig.ts ← staleTime constants
  page/            ← pages connected to routing; DDD subdivision inside
  router/
    router.tsx     ← root route tree assembly
    public/        ← public grouper and its routes
    private/       ← private grouper (auth guard) and its routes
  service/
    api/           ← HTTP clients (one per backend)
  store/
    error/         ← useErrorStore
  type/
    common/
      error/       ← ApiError and related types
      pagination/  ← CursorPage<T> and related types
      notify/      ← notification types
  main.tsx
```

## Subdivision rules

Organize the project by type at the top level. Never create domain folders at the `src/` root.

Within each layer, create a DDD subdirectory only when the artifact is domain-specific. Generic, reusable artifacts stay at the layer root or in a category subdirectory.

`src/hook/` follows a mixed rule:
- Generic utility hooks grouped by **category**: `hook/error/`, `hook/form/`, `hook/realtime/`
- Domain-specific hooks grouped by **DDD domain**: `hook/<domain>/`

A hook is domain-specific when it references a service or store of a particular domain. A hook is generic when it works with any domain.

Never nest DDD subdirectories beyond one level deep within a layer.
