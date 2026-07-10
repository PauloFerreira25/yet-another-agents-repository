---
name: mobile-permissions
Scope: When protecting routes by permission, showing or hiding UI elements based on access, or loading user permissions
description: Same minimal action-based permission model as the web stack, enforced via Expo Router layout guards instead of beforeLoad
---

## Model

Same minimal permission model as the web stack: permissions are strings representing actions (`'produto.criar'`, `'admin.ver'`, `'pedido.cancelar'`), defined by the backend. The frontend only checks membership. Extend or replace this model per project as needed (roles, permission sets, backend-enforced UI config) — see the web `Permissions` rule's Extension points, which apply unchanged.

This rule covers **auth/UI permissions** (what the current user is allowed to see or do). For device-level OS permissions (camera, location, notifications), see `Native Permissions` — the two concepts are unrelated even though both are called "permissions".

## Auth store extension

Identical shape to the web stack:

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
```

Permissions are loaded during `useAppStore.bootstrap()`, alongside session restoration — see `Bootstrap`.

## Route-level protection

Expo Router has no `beforeLoad` hook. Route groups gate access with a redirect rendered at the top of the group's layout — evaluated on every mount of that layout:

```tsx
// app/(private)/_layout.tsx
import { Redirect, Slot } from 'expo-router'
import { useAuthStore } from '@/store/auth/auth.store'

export default function PrivateLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (!isAuthenticated) return <Redirect href="/login" />
  return <Slot />
}
```

For a permission scoped to a subgroup (e.g. `/admin`), nest another layout with its own guard:

```tsx
// app/(private)/admin/_layout.tsx
import { Redirect, Slot } from 'expo-router'
import { useAuthStore } from '@/store/auth/auth.store'

export default function AdminLayout() {
  const hasPermission = useAuthStore(s => s.hasPermission)
  if (!hasPermission('admin.ver')) return <Redirect href="/403" />
  return <Slot />
}
```

By the time any private layout renders, `bootstrap()` has already completed and `isAuthenticated`/`permissions` are set — the guard never needs to call `tryRefreshToken` itself.

## Component-level protection

Identical to the web stack — components the user has no permission to use must not exist in the tree at all:

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

Never use `disabled` or reduced `opacity` as a substitute for missing permission — return `null`.

## `/403` route

Add a `403.tsx` screen under the public group so redirects always resolve without requiring authentication:

```
app/
  (public)/
    login.tsx
    403.tsx
```
