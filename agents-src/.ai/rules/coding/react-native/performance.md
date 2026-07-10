---
name: react-native-performance
Scope: When considering useMemo, useCallback, React.memo, FlashList tuning, or other performance optimizations
description: Same evidence-before-optimization discipline as the web stack, plus FlashList/Hermes-specific considerations unique to a mobile runtime
---

The web stack's core rule applies unchanged: never add `useMemo`, `useCallback`, or `React.memo` without validating with the human first, backed by profiler evidence — not intuition. See `.ai/rules/coding/react/performance.md` for the full rationale; it is not repeated here.

## Profiling on a device, not a browser

There is no browser DevTools Profiler. Use the React Native / Expo DevTools profiler (Flipper's React DevTools plugin, or `react-devtools` standalone) connected to a physical device or simulator — profiling only in a simulator can hide performance problems that only appear on lower-end hardware. When a performance concern is raised, confirm it against a mid-range physical device before proposing a fix, not against the simulator alone.

## FlashList-specific tuning

Beyond the general "never memoize without evidence" rule, `FlashList` (see `List Patterns`) has its own tuning knobs that are not premature optimization when the list is the actual bottleneck:

- `estimatedItemSize` accuracy — the single highest-impact setting; a rough estimate causes visible jank on fast scroll
- `renderItem` must be referentially stable (`useCallback` with an empty dependency array is the correct use of `useCallback` here — it is required, not speculative)
- Avoid nesting another scrollable (`ScrollView`, another `FlashList`) inside a `FlashList` row — this defeats virtualization for that row entirely

## Hermes

Expo ships with the Hermes JS engine by default. Never disable Hermes for a performance concern without measuring first — JSC (the alternative) is slower to start and has no bytecode precompilation. If startup time is a concern, check that Hermes is enabled before reaching for any other optimization.

## Images

Large, unresized images are a common and easy-to-miss mobile performance problem with no web equivalent (a browser downsamples image display cost differently than a native `Image` view does). Use `expo-image` instead of the core `Image` component for anything beyond a tiny icon — it caches and downsamples automatically. This is a correctness-level default, not a profiler-gated optimization.
