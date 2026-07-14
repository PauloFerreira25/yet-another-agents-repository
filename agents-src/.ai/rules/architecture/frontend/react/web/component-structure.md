---
name: component-structure
Scope: When creating or classifying a React component
description: Atomic Design hierarchy with DDD subdivision for domain-specific components
---

Classify every component into exactly one Atomic Design level before creating it:

- **atom**: single-purpose, stateless building blocks — Button, Input, Label, Icon
- **molecule**: combinations of atoms that form a functional unit — SearchBar, FormField, ProductCard
- **organism**: complex, self-contained UI sections composed of molecules and atoms — Header, ProductList, OrderForm
- **template**: page layouts with slot structure, no real data
- **page**: templates filled with real data, connected to routing

Place generic components under `src/component/<level>/`.

**Layout components** are a special category outside the Atomic Design levels. They are full-screen templates that render `<Outlet />` for router children. Place them under `src/component/layout/`:

```
src/component/layout/fullPageLayout.tsx   ← public routes, no chrome
src/component/layout/appLayout.tsx        ← sidebar + header
```

Never use the Atomic Design levels (template, organism, etc.) for layout components — `layout/` is their dedicated directory.

When a molecule, organism, or page is specific to a DDD domain, place it under a subdirectory named after the domain:

```
src/component/molecule/produto/productCard.tsx
src/component/organism/pedido/orderSummary.tsx
src/component/page/produto/productDetailPage.tsx
```

Never place domain-specific logic inside atoms. Atoms must be domain-agnostic.

When uncertain about which level a component belongs to: does it stand alone as a primitive (atom), combine primitives into a unit (molecule), or compose units into a section (organism)? Resolve this before writing the file.
