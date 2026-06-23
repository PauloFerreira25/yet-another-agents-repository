---
name: routing
Scope: When creating or organizing route files
description: Code-based routing with constructor functions receiving parent route; directory structure mirrors URL except for organizational groupers
---

Routes are defined using constructor functions that receive the parent route. Each `.router.tsx` file exports a function, not a static route object. `src/router.tsx` is the only file that mounts the full route tree.

## Path-based routes

URL segments mirror the directory structure under `src/router/`:

```
/login            →  src/router/public/login/login.router.tsx
/admin/produto    →  src/router/private/admin/produto/produto.router.tsx
/dashboard        →  src/router/private/dashboard/dashboard.router.tsx
```

Each file uses `path:` and lazy-loads its page component:

```ts
// src/router/private/admin/produto/produto.router.tsx
import { lazy } from 'react'
import { createRoute, type AnyRoute } from '@tanstack/react-router'

export function createProdutoRouter(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: '/produto',
    component: lazy(() => import('@/page/private/admin/produto/produtoPage')),
    errorComponent: RouteErrorFallback,
  })
}
```

## Organizational groupers (pathless routes)

Some directories group routes logically without adding a URL segment. These use `id:` instead of `path:` and render a layout component with `<Outlet />`.

The top-level groupers are `public/` and `private/`:

```
src/router/
  router.tsx
  public/
    public.router.tsx       ← pathless, id: 'public', component: FullPageLayout
    login/
      login.router.tsx
  private/
    private.router.tsx      ← pathless, id: 'private', component: AppLayout
    admin/
      admin.router.tsx      ← pathless, id: 'admin', component: AdminLayout (if needed)
      produto/
        produto.router.tsx
    dashboard/
      dashboard.router.tsx
```

A grouper file defines the pathless route and aggregates its children:

```ts
// src/router/public/public.router.tsx
import { FullPageLayout } from '@/component/layout/fullPageLayout'

export function createPublicRouter(parentRoute: AnyRoute) {
  const publicRoute = createRoute({
    getParentRoute: () => parentRoute,
    id: 'public',
    component: FullPageLayout,
  })
  const loginRoute = createLoginRouter(publicRoute)
  return publicRoute.addChildren([loginRoute])
}
```

**Rule**: a directory is a grouper (not a URL segment) when its `.router.tsx` file uses `id:` instead of `path:`. The directory name does not appear in any URL.

## Layout components

Layout components live in `src/component/layout/` — they are visual templates that render `<Outlet />` for their children:

```
src/component/layout/fullPageLayout.tsx   ← public routes, no chrome
src/component/layout/appLayout.tsx        ← sidebar + header
```

Router files import layouts from `src/component/layout/` — layouts are never defined inside router files.

## Aggregation in `src/router.tsx`

```ts
import { createRootRoute, createRouter } from '@tanstack/react-router'
import { createPublicRouter } from '@/router/public/public.router'
import { createPrivateRouter } from '@/router/private/private.router'

const rootRoute = createRootRoute()
const publicRoute = createPublicRouter(rootRoute)
const privateRoute = createPrivateRouter(rootRoute)

const routeTree = rootRoute.addChildren([publicRoute, privateRoute])
export const router = createRouter({ routeTree })
```

Each router file only knows its own segment and its direct children. Never reference sibling or parent router files from within a router file.

## Auth guard

Never add data loaders to routes. Pages are 100% autonomous and fetch their own data via `useQuery`.

Authentication is the exception — use `beforeLoad` on the `private` grouper to redirect unauthenticated users before any component renders. `beforeLoad` is not a React component, so hooks cannot be used. Access the store via `.getState()`:

```ts
// src/router/private/private.router.tsx
import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth/auth.store'

export function createPrivateRouter(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    id: 'private',
    component: AppLayout,
    beforeLoad: () => {
      const { isAuthenticated } = useAuthStore.getState()
      if (!isAuthenticated) throw redirect({ to: '/login' })
      // Note: tryRefreshToken() runs on mount in main.tsx — by the time beforeLoad
      // executes, isAuthenticated is already set if the session cookie was valid.
    },
  })
}
```

Never call a service inside `beforeLoad` — auth state comes from the store, not from a network call.

## Error boundaries

Add `errorComponent` to every path-based route. Expected business errors are handled through `useErrorStore` — `errorComponent` is for unexpected runtime errors.

### Private grouper error boundary

The `private` grouper uses a dedicated `errorComponent` that intercepts all unhandled errors from its child routes:

- `UnauthenticatedError` → navigate to `/login` (session expired mid-session)
- Any other error → navigate to `/error` (global error page)

```tsx
// src/router/private/private.errorBoundary.tsx
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { UnauthenticatedError } from '@/service/api/main.httpClient'

type Props = { error: Error }

export function PrivateErrorBoundary({ error }: Props) {
  const navigate = useNavigate()

  useEffect(() => {
    if (error instanceof UnauthenticatedError) {
      navigate({ to: '/login' })
    } else {
      navigate({ to: '/error', search: { message: error.message } })
    }
  }, [error, navigate])

  return null
}
```

```ts
// src/router/private/private.router.tsx
export function createPrivateRouter(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    id: 'private',
    component: AppLayout,
    errorComponent: PrivateErrorBoundary,
    beforeLoad: () => {
      const { isAuthenticated } = useAuthStore.getState()
      if (!isAuthenticated) throw redirect({ to: '/login' })
    },
  })
}
```

### Global error page

`/error` is a public route — accessible without authentication so session errors can always reach it:

```
src/router/public/
  public.router.tsx
  login/
    login.router.tsx
  error/
    error.router.tsx
```

```ts
// src/router/public/error/error.router.tsx
export function createErrorRouter(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: '/error',
    component: lazy(() => import('@/page/public/error/errorPage')),
  })
}
```

The error page reads the `message` search param to display context. Never put sensitive error details in the URL — use a generic message for unexpected errors.
