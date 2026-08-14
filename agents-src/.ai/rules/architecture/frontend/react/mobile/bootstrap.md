---
name: mobile-bootstrap
Scope: When initializing the application, restoring session, or populating global stores on mount
description: A dedicated bootstrap phase runs before the first screen renders; a JS-owned bootstrap screen with a real loading indicator covers the phase once mounted, not the static native splash
---

## Overview

The application has a bootstrap phase that runs once on mount, before any screen is rendered. During this phase, stores are populated, the session is restored, and any data required globally is loaded.

The native splash screen only covers the brief window before any JavaScript has mounted. It is a static image with no way to show progress, so it is never used to gate the whole bootstrap phase — doing that leaves the user staring at a screen with no indication anything is happening, indistinguishable from a frozen app. As soon as the root layout mounts, the native splash is hidden and a JS-owned bootstrap screen with a real loading indicator takes over until the phase completes.

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

Expo's splash screen is a native view shown before any JavaScript runs. Hide it as soon as the root layout has something to paint — never keep it up until `bootstrap()` resolves; it cannot show a spinner, a percentage, or any other feedback, so leaving it up for the whole phase is exactly the failure this rule exists to prevent.

```tsx
// app/_layout.tsx
import { useCallback, useEffect } from 'react'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useAppStore } from '@/store/app/app.store'
import { BootstrapScreen } from '@/screen/bootstrap/bootstrapScreen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { bootstrapStatus, bootstrap } = useAppStore()

  useEffect(() => {
    if (bootstrapStatus === 'idle') bootstrap()
  }, [])

  const onLayout = useCallback(() => {
    SplashScreen.hideAsync()
  }, [])

  if (bootstrapStatus === 'idle' || bootstrapStatus === 'loading') {
    return <BootstrapScreen onLayout={onLayout} />
  }

  return <Slot onLayout={onLayout} />
}
```

`onLayout` fires on whichever tree paints first — `BootstrapScreen` or `Slot` — so the native splash is hidden the instant JS has anything to show, regardless of `bootstrapStatus`. From that point on, `BootstrapScreen` is what the user sees until the phase completes, not a static native image.

When `bootstrapStatus === 'error'`, `Slot` still renders so the `(private)` group's redirect guard can send the user to `/login` — same relationship as the web auth guard (see `Permissions`).

Never call `bootstrap()` more than once. The `'idle'` check ensures it runs exactly once per app launch.

## Bootstrap screen

`src/screen/bootstrap/bootstrapScreen.tsx` is the screen shown between the native splash hiding and the bootstrap phase completing. It has no routing logic — it is a pure visual component with a real loading indicator, not a static image standing in for the splash:

```tsx
import { View, ActivityIndicator } from 'react-native'

type Props = {
  onLayout?: () => void
}

export function BootstrapScreen({ onLayout }: Props) {
  return (
    <View onLayout={onLayout} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  )
}
```

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
