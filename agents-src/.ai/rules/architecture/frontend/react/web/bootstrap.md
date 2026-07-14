---
name: bootstrap
Scope: When initializing the application, restoring session, or populating global stores on mount
description: A dedicated bootstrap phase runs before the app renders any route; a loading screen is shown until the phase completes
---

## Overview

The application has a bootstrap phase that runs once on mount, before any route is rendered. During this phase, stores are populated, the session is restored, and any data required globally is loaded. A loading screen is shown for the duration.

## App store

`src/store/app/app.store.ts` owns the bootstrap lifecycle:

```ts
import { create } from 'zustand'

type BootstrapStatus = 'idle' | 'loading' | 'ready' | 'error'

type AppState = {
  bootstrapStatus: BootstrapStatus
  bootstrap: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  bootstrapStatus: 'idle',
  bootstrap: async () => {
    set({ bootstrapStatus: 'loading' })
    try {
      // Orchestrate all initialization here:
      // - restore session (tryRefreshToken)
      // - load user profile
      // - load global config
      // - populate any stores needed before the first route renders
      set({ bootstrapStatus: 'ready' })
    } catch {
      set({ bootstrapStatus: 'error' })
    }
  },
}))
```

The `bootstrap()` function is the single orchestration point. What it calls is determined by the application's needs — the store defines the lifecycle, not the data.

## Root route component

The root route component checks `bootstrapStatus` and renders accordingly:

```tsx
// src/router/router.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAppStore } from '@/store/app/app.store'
import { BootstrapPage } from '@/page/bootstrap/bootstrapPage'

function RootComponent() {
  const { bootstrapStatus, bootstrap } = useAppStore()

  useEffect(() => {
    if (bootstrapStatus === 'idle') bootstrap()
  }, [])

  if (bootstrapStatus === 'idle' || bootstrapStatus === 'loading') {
    return <BootstrapPage />
  }

  if (bootstrapStatus === 'error') {
    // session could not be restored — private routes will redirect to login
    // render the tree so the router can evaluate beforeLoad guards
  }

  return <Outlet />
}

export const rootRoute = createRootRoute({ component: RootComponent })
```

When `bootstrapStatus === 'error'`, the tree still renders so TanStack Router can evaluate the `beforeLoad` guard on the private grouper, which will redirect to `/login`.

## Bootstrap page

`src/page/bootstrap/bootstrapPage.tsx` is the loading screen shown during the bootstrap phase. It has no routing logic — it is a pure visual component:

```tsx
export function BootstrapPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <span className="animate-spin" aria-label="Carregando" />
    </div>
  )
}
```

## Relationship with auth guard

By the time any `beforeLoad` guard on the `private` grouper executes, `bootstrap()` has already completed and `useAuthStore.isAuthenticated` is set. The auth guard does not need to call `tryRefreshToken` — that is bootstrap's responsibility.

Never call `bootstrap()` more than once. The `'idle'` check in the root component ensures it runs exactly once per session.

## `main.tsx`

`main.tsx` is responsible only for mounting React and composing providers. All initialization logic belongs in `bootstrap()`, not here.

Provider order (outermost → innermost):

1. `ThemeProvider` — must wrap everything so `dark:` Tailwind classes work on all children
2. `QueryClientProvider` — must wrap the router so `useQueryClient()` is available in all route components
3. `RouterProvider` — the router itself

```tsx
// main.tsx
import '@/lib/i18n'                        // i18next side-effect — must run before render
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router/router'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
```

`bootstrap()` is called by the root route component — never in `main.tsx`.
