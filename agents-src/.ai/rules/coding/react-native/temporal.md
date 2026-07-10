---
name: react-native-temporal
Scope: Before writing any code that creates, manipulates, or formats dates and times in a React Native project
description: Hermes has no native Temporal support — always install and import from temporal-polyfill
---

For the Temporal directive and common patterns, follow `.ai/rules/coding/typescript/temporal.md`.

## Hermes compatibility

Hermes (Expo's default JS engine) does not implement `Temporal` natively. Always install and import from `temporal-polyfill`, exactly like the web stack's browser polyfill requirement:

```bash
npx expo install temporal-polyfill
```

```typescript
import { Temporal } from 'temporal-polyfill'
```

Never rely on TypeScript's `lib` setting to provide `Temporal` types in a React Native project — `expo/tsconfig.base`'s `lib` does not include it, and there is no runtime global to back it even if the types were declared. `temporal-polyfill` provides both the runtime implementation and the types together.

## Locale-aware formatting

When formatting a date for display, pass the device locale (from `expo-localization`, already used for i18n — see `i18n`) rather than hardcoding a locale string:

```ts
import { getLocales } from 'expo-localization'

const locale = getLocales()[0]?.languageTag ?? 'pt-BR'
Temporal.Now.zonedDateTimeISO().toLocaleString(locale, { dateStyle: 'medium' })
```

When native `Temporal` ships in a future Hermes release, remove the package and switch to the native global — same migration path the web stack describes for browsers.
