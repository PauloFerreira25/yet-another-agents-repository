---
name: mobile-folder-structure
Scope: When creating or organizing project files
description: Expo Router folder structure with DDD subdivision for domain-specific artifacts
---

## App root

```
app root
  app/
    _layout.tsx
    (public)/
    (private)/
  assets/
    locale/
      pt-BR/
        translation.json
      en/
        translation.json
    fonts/
    images/
  src/
    component/
    hook/
    lib/
    service/
    store/
    type/
  app.config.ts
  babel.config.js
  metro.config.js
  tsconfig.json
  .eslintrc.js
  .env
  .env.local
```

This is the React Native app's own root — the directory containing its `package.json`, `app.config.ts`, and Expo tooling. In a single-app repository this is also the repository root. In a monorepo with multiple systems, it is the app's package directory (e.g. `apps/mobile/`) — never assume it is the repository's top-level root.

`app/` is owned by Expo Router — every file inside it is a route. Everything else (components, hooks, services, stores, types) lives under `src/`, exactly like the web stack, so the domain layers stay agnostic of the routing mechanism.

Translation files live in `assets/locale/` and are bundled with the app — there is no static file server on a device, so they are imported directly rather than fetched at runtime (see `i18n` rule).

## `src/` structure

```
src/
  component/
    atom/          ← single-purpose, stateless building blocks
    molecule/      ← combinations of atoms
    organism/      ← complex self-contained sections
    template/      ← screen layouts with slot structure, no real data
    ui/            ← gluestack-ui components (read-only, never edit directly)
  hook/
    error/         ← generic error-handling hooks (useQueryError, useFormError)
    form/          ← generic form utility hooks
    realtime/      ← generic realtime hooks (useRealtime)
  lib/
    i18n.ts        ← i18next configuration
    i18n.d.ts      ← TypeScript key safety declaration
    logger.ts      ← centralized logger
    queryConfig.ts ← staleTime constants
    storage.ts     ← MMKV instance(s)
  service/
    api/           ← HTTP clients (one per backend)
  store/
    error/         ← useErrorStore
  type/
    common/
      error/       ← ApiError and related types
      pagination/  ← CursorPage<T> and related types
      notify/      ← notification types
```

## Subdivision rules

Organize the project by type at the top level of `src/`. Never create domain folders at the `src/` root.

Within each layer, create a DDD subdirectory only when the artifact is domain-specific. Generic, reusable artifacts stay at the layer root or in a category subdirectory.

`src/hook/` follows a mixed rule:
- Generic utility hooks grouped by **category**: `hook/error/`, `hook/form/`, `hook/realtime/`
- Domain-specific hooks grouped by **DDD domain**: `hook/<domain>/`

A hook is domain-specific when it references a service or store of a particular domain. A hook is generic when it works with any domain.

Never nest DDD subdirectories beyond one level deep within a layer.

There are no `page/` or `router/` layers — Expo Router's `app/` directory is both. Screen components that Expo Router renders live inside `app/`; anything reusable across screens is extracted into `src/component/` following the same Atomic Design rule as the web stack (see `Component Structure`).
