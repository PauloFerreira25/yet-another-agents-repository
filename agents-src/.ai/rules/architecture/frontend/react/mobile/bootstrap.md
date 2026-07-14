---
name: mobile-bootstrap
Scope: When initializing the application, restoring session, or populating global stores on mount
description: A dedicated bootstrap phase runs before the first screen renders, gated by a native splash screen instead of a DOM loading spinner
---

## Overview

The application has a bootstrap phase that runs once on mount, before any screen is rendered. During this phase, stores are populated, the session is restored, and any data required globally is loaded. The native splash screen stays visible for the duration — there is no in-DOM loading spinner, because nothing has mounted yet.

## App store

`src/store/app/app.store.ts` owns the bootstrap lifecycle, identical in shape to the web stack:

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
      // - rehydrate MMKV-backed Zustand stores (usually automatic, see Zustand Stores rule)
      // - restore session (tryRefreshToken)
      // - load user profile and permissions
      // - load global config
      set({ bootstrapStatus: 'ready' })
    } catch {
      set({ bootstrapStatus: 'error' })
    }
  },
}))
```

## Root layout and the native splash screen

Expo's splash screen is a native view shown before any JavaScript runs. Keep it visible until `bootstrap()` resolves, then hide it — never render a JS loading screen underneath it, and never hide it before fonts and the session are ready.

```tsx
// app/_layout.tsx
import { useEffect, useCallback } from 'react'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useAppStore } from '@/store/app/app.store'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { bootstrapStatus, bootstrap } = useAppStore()

  useEffect(() => {
    if (bootstrapStatus === 'idle') bootstrap()
  }, [])

  const onLayout = useCallback(async () => {
    if (bootstrapStatus === 'ready' || bootstrapStatus === 'error') {
      await SplashScreen.hideAsync()
    }
  }, [bootstrapStatus])

  if (bootstrapStatus === 'idle' || bootstrapStatus === 'loading') return null

  return (
    <Slot onLayout={onLayout} />
  )
}
```

When `bootstrapStatus === 'error'`, the tree still renders so the `(private)` group's redirect guard can send the user to `/login` — same relationship as the web auth guard (see `Permissions`).

Never call `bootstrap()` more than once. The `'idle'` check ensures it runs exactly once per app launch.

## Provider order

Providers are composed in `app/_layout.tsx`, outermost → innermost:

1. `GestureHandlerRootView` — must be the outermost view; required by Reanimated and any gesture-based navigation
2. `GluestackUIProvider` — supplies the design system and color mode
3. `QueryClientProvider` — must wrap everything that calls `useQueryClient()`
4. Root `Slot` / navigator

```tsx
// app/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GluestackUIProvider } from '@/component/ui/gluestack-ui-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout() {
  // ...bootstrap logic above...
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="system">
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  )
}
```

`bootstrap()` is orchestrated by the root layout — never inside `App` entry files or individual screens.
