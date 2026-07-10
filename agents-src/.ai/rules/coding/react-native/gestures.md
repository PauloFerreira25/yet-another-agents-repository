---
name: gestures
Scope: When implementing swipe, drag, pinch, or any custom touch gesture beyond a simple tap
description: react-native-gesture-handler for all custom gestures; GestureHandlerRootView must wrap the app; compose with Reanimated for gesture-driven animation
---

Use `react-native-gesture-handler` for any gesture beyond a plain tap (`Pressable`/`onPress` already handles taps natively and needs no gesture-handler involvement). Never build custom pan/swipe/pinch handling on the core `PanResponder` API — it predates gesture-handler and does not compose with Reanimated on the UI thread.

`GestureHandlerRootView` must wrap the entire app, as the outermost view in `app/_layout.tsx` (see `Bootstrap`) — omitting it causes gestures to silently fail to register on Android in particular.

## Basic gesture

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

const translateX = useSharedValue(0)

const pan = Gesture.Pan()
  .onUpdate((e) => { translateX.value = e.translationX })
  .onEnd(() => { translateX.value = withSpring(0) })

const style = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }))

<GestureDetector gesture={pan}>
  <Animated.View style={style} />
</GestureDetector>
```

Gesture callbacks (`onUpdate`, `onEnd`) run on the UI thread when paired with Reanimated shared values — never read or write React state directly inside them; bridge through a shared value instead, or `runOnJS` for the rare case that truly needs to touch JS-thread state.

## Composing gestures

Use `Gesture.Simultaneous`, `Gesture.Race`, or `Gesture.Exclusive` to combine gestures rather than nesting multiple `GestureDetector`s with unclear priority:

```tsx
const composed = Gesture.Simultaneous(pan, pinch)
```

## Interop with scrollable containers

A pan/swipe gesture inside a `ScrollView` or `FlashList` needs explicit conflict resolution — gesture-handler does not automatically know which should win. Use `Gesture.Pan().activeOffsetX([-10, 10])` (or the equivalent Y-axis config) to require a minimum movement before the custom gesture claims the touch, so vertical list scrolling is not hijacked by a horizontal swipe gesture.

## When not to reach for gesture-handler

A simple tap, long-press, or button remains a `Pressable` with `onPress`/`onLongPress` — do not wrap trivial tap targets in `GestureDetector`, it adds complexity with no behavioral benefit over the built-in handler.
