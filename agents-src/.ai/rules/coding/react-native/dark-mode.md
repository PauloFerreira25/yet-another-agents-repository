---
name: react-native-dark-mode
Scope: When implementing theme switching, dark mode, or reading the user's color scheme preference
description: gluestack-ui colorMode drives NativeWind's dark: variant; useColorScheme reads the OS preference
---

Use gluestack-ui's `GluestackUIProvider` `mode` prop to manage color mode — it drives NativeWind's `dark:` variant the same way `next-themes` drives it on the web stack.

## Setup

```tsx
// app/_layout.tsx
import { GluestackUIProvider } from '@/component/ui/gluestack-ui-provider'

<GluestackUIProvider mode="system">
  {/* ... */}
</GluestackUIProvider>
```

- `mode="system"` — follows the OS appearance setting via `useColorScheme`, re-evaluated automatically when the user changes it in device settings while the app is foregrounded
- `mode="light"` / `mode="dark"` — forces a fixed mode, overridden by an explicit user toggle

## Toggle component

```tsx
// src/component/atom/themeToggle.tsx
import { useColorMode, useColorModeToggle } from '@/component/ui/gluestack-ui-provider'
import { Pressable } from 'react-native'
import { SunIcon, MoonIcon } from '@/component/ui/icon'

export function ThemeToggle() {
  const colorMode = useColorMode()
  const toggle = useColorModeToggle()

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={colorMode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onPress={toggle}
    >
      {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Pressable>
  )
}
```

## Persistence

An explicit user choice (overriding `system`) must be persisted via MMKV so it survives app restart — see `Zustand Stores` for the persistence pattern. `GluestackUIProvider` does not persist the mode itself; store the user's choice in a persisted preference store and pass it as the `mode` prop on next launch.

## Tailwind configuration

`darkMode: 'class'` is not applicable to NativeWind the way it is to web Tailwind — NativeWind derives `dark:` variants from the `GluestackUIProvider` color mode context automatically. Never try to toggle a `dark` class on a root DOM node; there is no DOM.
