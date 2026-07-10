---
name: mobile-component-structure
Scope: When creating or classifying a React Native component
description: Same Atomic Design hierarchy as the web stack; layout components render Slot instead of Outlet
---

Classify every component into exactly one Atomic Design level before creating it — identical taxonomy to the web stack:

- **atom**: single-purpose, stateless building blocks — Button, Input, Label, Icon
- **molecule**: combinations of atoms that form a functional unit — SearchBar, FormField, ProductCard
- **organism**: complex, self-contained UI sections composed of molecules and atoms — Header, ProductList, OrderForm
- **template**: screen layouts with slot structure, no real data
- **screen**: templates filled with real data — these live inside `app/` as Expo Router route files, not under `src/component/`

Place generic components under `src/component/<level>/`.

**Layout components** are a special category outside the Atomic Design levels. They are full-screen templates that render `<Slot />` for their nested route. Place them under `src/component/layout/`, and reference them from the corresponding `app/**/_layout.tsx` file:

```
src/component/layout/publicLayout.tsx    ← no chrome, used by app/(public)/_layout.tsx
src/component/layout/appLayout.tsx       ← tab bar / header, used by app/(private)/_layout.tsx
```

Never use the Atomic Design levels (template, organism, etc.) for layout components — `layout/` is their dedicated directory. Never inline layout chrome directly in an `app/**/_layout.tsx` file once it grows beyond a thin composition of a layout component and the guard logic from `Permissions`.

When a molecule, organism is specific to a DDD domain, place it under a subdirectory named after the domain:

```
src/component/molecule/produto/productCard.tsx
src/component/organism/pedido/orderSummary.tsx
```

Never place domain-specific logic inside atoms. Atoms must be domain-agnostic.

`src/component/ui/` holds gluestack-ui primitives — read-only, never edited directly (see `NativeWind / gluestack-ui`). Extensions to a `ui/` primitive are wrapped as an atom, exactly like the web stack wraps shadcn/ui.

When uncertain about which level a component belongs to: does it stand alone as a primitive (atom), combine primitives into a unit (molecule), or compose units into a section (organism)? Resolve this before writing the file.
