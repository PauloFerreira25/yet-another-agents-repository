---
name: permissions
Scope: When protecting routes by permission, showing or hiding UI elements based on access, or loading user permissions
description: Minimal action-based permission model loaded from the backend; extendable per project
---

## Model

This is a **minimal permission model**. It covers the common case of action-based permissions loaded from the backend. Each project should extend or replace this model as needed — role-based systems, hierarchical permissions, or permission sets are all valid extensions.

Permissions are strings representing actions: `'produto.criar'`, `'admin.ver'`, `'pedido.cancelar'`. The backend defines what actions exist and which user holds them. The frontend only checks membership.

## Auth store extension

Add `permissions` and `hasPermission` to `useAuthStore`:

```ts
// src/store/auth/auth.store.ts
type AuthState = {
  accessToken: string | null
  isAuthenticated: boolean
  permissions: string[]
  setAccessToken: (token: string) => void
  setPermissions: (permissions: string[]) => void
  hasPermission: (action: string) => boolean
  tryRefreshToken: () => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  permissions: [],
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  setPermissions: (permissions) => set({ permissions }),
  hasPermission: (action) => get().permissions.includes(action),
  tryRefreshToken: async () => { /* ... */ },
  logout: () => set({ accessToken: null, isAuthenticated: false, permissions: [] }),
}))
```

Permissions are loaded during `useAppStore.bootstrap()` alongside session restoration.

## Route-level protection

Use `hasPermission` in `beforeLoad` to block access before the component renders. Unauthorized access redirects to `/403`:

```ts
// src/router/private/admin/admin.router.tsx
beforeLoad: () => {
  const { isAuthenticated, hasPermission } = useAuthStore.getState()
  if (!isAuthenticated) throw redirect({ to: '/login' })
  if (!hasPermission('admin.ver')) throw redirect({ to: '/403' })
},
```

## Component-level protection

Components the user has no permission to use must not appear in the DOM at all — never disable or hide via CSS, never render and conditionally style. Use `PermissionGate` to wrap any element that requires a permission:

```tsx
// src/component/atom/permissionGate.tsx
import { useAuthStore } from '@/store/auth/auth.store'

type Props = { action: string; children: React.ReactNode }

export function PermissionGate({ action, children }: Props) {
  const hasPermission = useAuthStore(s => s.hasPermission)
  if (!hasPermission(action)) return null
  return <>{children}</>
}
```

```tsx
<PermissionGate action="produto.criar">
  <Button onClick={handleCreate}>{t('page.produto.new')}</Button>
</PermissionGate>

<PermissionGate action="produto.excluir">
  <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
</PermissionGate>
```

`PermissionGate` returns `null` — the element does not exist in the DOM when the user lacks the action. Never use `disabled`, `opacity-50`, or `pointer-events-none` as a substitute for missing permission.

## `/403` route

Add a `/403` page to the public grouper — accessible without authentication so redirects from `beforeLoad` always resolve:

```
src/router/public/
  error/
    error.router.tsx     ← /error
  forbidden/
    forbidden.router.tsx ← /403
```

## Extension points

This model is intentionally minimal. Common extensions:

- **Role-based**: store `roles: string[]` and derive permissions from a role-to-action map
- **Permission sets**: group actions into named sets and check membership at the set level
- **Backend-enforced UI config**: backend returns a `{ canCreate, canDelete, canAdmin }` object instead of raw strings — map it to the `permissions` array on load

Never implement complex permission logic in components. Keep all checks in `hasPermission` or in `beforeLoad` guards.
