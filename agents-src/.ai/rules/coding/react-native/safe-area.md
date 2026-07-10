---
name: safe-area
Scope: When laying out a screen's root container, a header, or any full-bleed content
description: Every screen root must respect device safe areas (notch, status bar, home indicator) via react-native-safe-area-context
---

Every screen's root container must account for the device's safe area — the notch, status bar, dynamic island, and home indicator. Never hardcode a top/bottom padding value to approximate it; device safe area insets vary across models and change with orientation.

```bash
npx expo install react-native-safe-area-context
```

`SafeAreaProvider` wraps the app once, in `app/_layout.tsx`, alongside the other root providers (see `Bootstrap`):

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context'

<SafeAreaProvider>
  {/* ...GluestackUIProvider, QueryClientProvider, Slot... */}
</SafeAreaProvider>
```

## Screen-level usage

Use `SafeAreaView` (from `react-native-safe-area-context`, never the deprecated core `react-native` one) for a screen's outermost container, or `useSafeAreaInsets` when a component needs fine-grained control (e.g. a header that must sit above the status bar but its content should not double-pad):

```tsx
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProdutoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      {/* ... */}
    </SafeAreaView>
  )
}
```

Set `edges` explicitly rather than accepting the default on every screen — a screen nested inside a tab navigator, for example, should not double-apply the bottom inset the tab bar already accounts for.

## Full-bleed content

Content that intentionally extends behind the status bar or notch (an image header, a video player) should not be wrapped in `SafeAreaView` at all — apply insets only to the interactive/text content layered on top of it, via `useSafeAreaInsets`, not to the full-bleed background element.

Layout components in `src/component/layout/` (see `Component Structure`) are the right place to centralize this — individual screens should not each reinvent safe-area handling.
