---
name: mobile-routing
Scope: When creating or organizing route files
description: Expo Router file-based routing — directory structure under app/ is the route tree, groups organize without adding URL segments
---

Expo Router derives the entire route tree from the file structure under `app/`. There are no constructor functions and no separate router-assembly file — the filesystem is the route tree.

## Path-based routes

File paths under `app/` map directly to routes:

```
app/(public)/login.tsx           →  /login
app/(private)/dashboard.tsx      →  /dashboard
app/(private)/admin/produto.tsx  →  /admin/produto
```

Each file default-exports the screen component:

```tsx
// app/(private)/admin/produto.tsx
export default function ProdutoScreen() {
  const { data } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll })
  return <ProductList products={data} />
}
```

Dynamic segments use bracket syntax:

```
app/(private)/produto/[id].tsx   →  /produto/:id
```

```tsx
// app/(private)/produto/[id].tsx
import { useLocalSearchParams } from 'expo-router'

export default function ProdutoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data } = useQuery({ queryKey: ['produto', id], queryFn: () => produtoService.getById(id) })
  return <ProductDetail produto={data} />
}
```

## Groups (pathless routes)

A directory wrapped in parentheses is a **group** — it organizes routes and can attach a shared layout, but never appears in the URL. The top-level groups are `(public)` and `(private)`:

```
app/
  _layout.tsx                 ← root layout, composes providers (see Bootstrap)
  (public)/
    _layout.tsx                ← group layout, no auth guard
    login.tsx
  (private)/
    _layout.tsx                ← group layout, auth guard (see Permissions)
    admin/
      _layout.tsx               ← nested group, permission guard
      produto.tsx
    dashboard.tsx
```

**Rule**: a directory wrapped in `(parentheses)` is a group. A directory without parentheses is a real URL segment. Never confuse the two — an unwrapped directory changes every child route's URL.

## Layout components

Layout components live in `src/component/layout/` (see `Component Structure`) and are referenced from the corresponding `_layout.tsx`:

```tsx
// app/(private)/_layout.tsx
import { AppLayout } from '@/component/layout/appLayout'
import { Slot } from 'expo-router'

export default function PrivateLayout() {
  // ...auth guard from Permissions...
  return (
    <AppLayout>
      <Slot />
    </AppLayout>
  )
}
```

`_layout.tsx` files own guard logic and provider composition only — visual chrome belongs in the imported layout component, never inlined.

## Data loading

Never add data loaders to route files. Screens are 100% autonomous and fetch their own data via `useQuery`, exactly like the web stack's pages.

## Error boundaries

Expo Router supports a colocated `+error.tsx` (via React error boundaries at the layout level, using `expo-router`'s `ErrorBoundary` export) for unexpected runtime errors within a group:

```tsx
// app/(private)/_layout.tsx
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorScreen error={error} onRetry={retry} />
}
```

Expected business errors still go through `useErrorStore`, not the route error boundary — see `Error Handling`. Session expiry (`UnauthenticatedError`) is handled by redirecting from within the query error handler to `/login`, since there is no route-level exception propagation equivalent to a web error boundary catching a thrown navigation error.

## Deep linking

Every route under `app/` is automatically deep-linkable once a URL scheme is configured in `app.config.ts` — no manual linking configuration is needed, unlike bare React Navigation. Never hand-write a `linking` config when using Expo Router.
