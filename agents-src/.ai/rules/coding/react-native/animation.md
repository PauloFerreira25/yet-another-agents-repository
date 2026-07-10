---
name: react-native-animation
Scope: When adding animations, transitions, or motion to components
description: Reanimated for gesture-driven and layout animations; Moti as the declarative wrapper for component enter/exit
---

Use two layers of animation:

1. **Reanimated** (`react-native-reanimated`) — the underlying engine; use it directly for gesture-driven animations (drag, swipe-to-dismiss) and shared element transitions.
2. **Moti** (`moti`) — a declarative wrapper over Reanimated; use it for component enter/exit and simple layout animations, the same role Motion plays on the web stack.

Never use the legacy `Animated` API (`react-native`'s built-in) in new code — Reanimated runs on the UI thread and does not drop frames under JS thread load, `Animated` does.

```bash
npx expo install react-native-reanimated moti
```

Reanimated requires its Babel plugin as the **last** plugin in `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
      'react-native-reanimated/plugin', // must be listed last
    ],
  }
}
```

## Moti — enter/exit and layout

```tsx
import { MotiView, AnimatePresence } from 'moti'

<AnimatePresence>
  {isVisible && (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 8 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      {children}
    </MotiView>
  )}
</AnimatePresence>
```

Keep `duration` short: `100`–`200ms` for micro-interactions, `200`–`350ms` for panels and modals. Never exceed `500ms` for interface elements — same guidance as the web stack.

## Reanimated — gesture-driven and list animations

Use `useAnimatedStyle` + shared values directly when Moti's declarative API cannot express the interaction (drag gestures, custom spring physics tied to gesture position):

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

const offset = useSharedValue(0)
const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }))

<Animated.View style={style} />
```

FlashList item add/remove/reorder animations are handled by the list itself (see `List Patterns`) — never wrap `FlashList` items in `MotiView` for basic list transitions, it defeats the list's own recycling and drops frame rate on large lists.

## When plain `LayoutAnimation` is enough

For a single, simple layout change (e.g. an accordion expanding) with no gesture involved, the built-in `LayoutAnimation.configureNext()` is acceptable and avoids pulling Reanimated into a screen that has no other animation need. Reach for Moti/Reanimated once the interaction needs a gesture, a spring, or an enter/exit pair.
