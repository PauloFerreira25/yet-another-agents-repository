---
name: platform-specific-code
Scope: When behavior, styling, or a native API must differ between iOS and Android
description: File-extension splitting for substantial divergence; Platform.select for small inline differences; never branch silently without a comment on why
---

React Native runs the same JS on both platforms, but iOS and Android diverge in real, unavoidable ways (permission flows, back-navigation gestures, shadow/elevation styling, keyboard behavior). Handle divergence deliberately, not by trial and error.

## Small inline differences

Use `Platform.select` or `Platform.OS` checks for differences confined to a few lines — a style value, a single conditional prop:

```ts
import { Platform } from 'react-native'

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  android: { elevation: 2 },
})
```

Always add a short comment when the reason for the divergence is not obvious from the code itself — e.g. why a value differs, not that it differs.

## Substantial divergence — file extension splitting

When a component's implementation differs enough that inline branching would hurt readability, split into `.ios.tsx` and `.android.tsx` files. Metro resolves the correct one automatically based on the running platform — never import the platform-specific file directly by its full name:

```
src/component/organism/produto/shareSheet.ios.tsx
src/component/organism/produto/shareSheet.android.tsx
```

```tsx
// correct — Metro resolves shareSheet.ios.tsx or shareSheet.android.tsx automatically
import { ShareSheet } from '@/component/organism/produto/shareSheet'

// wrong — bypasses platform resolution, always imports one platform's file
import { ShareSheet } from '@/component/organism/produto/shareSheet.ios'
```

Use this split when more than roughly a third of the component's logic differs by platform — below that threshold, `Platform.select` inline is more maintainable than two parallel files that must be kept in sync.

## Never assume behavioral parity

Do not assume a library or native API behaves identically on both platforms without checking its documentation — keyboard avoidance, back-gesture handling, and permission dialogs are the most common places where an assumption ported from iOS silently breaks Android (or vice versa). When behavior must be verified and cannot be confirmed from documentation, this falls under the `How to Think` research-first rule — verify on both platforms before declaring a fix complete.
