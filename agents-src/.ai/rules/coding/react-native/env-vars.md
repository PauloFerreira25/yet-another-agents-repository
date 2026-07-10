---
name: react-native-env-vars
Scope: Before reading environment variables or configuring .env files in an Expo project
description: EXPO_PUBLIC_ prefix and process.env conventions for build-time variables; EAS secrets for values that must never ship in the bundle
---

Expo only inlines environment variables prefixed with `EXPO_PUBLIC_` into the JS bundle at build time. Variables without this prefix are not available at runtime in app code — they are `undefined`, the same failure mode as a missing `VITE_` prefix on the web stack.

```ts
// correct
const apiUrl = process.env.EXPO_PUBLIC_API_URL

// wrong — no prefix, not inlined into the bundle
const apiUrl = process.env.API_URL
```

Unlike Vite's `import.meta.env`, Expo uses plain `process.env.EXPO_PUBLIC_*` — Metro statically replaces these references at build time.

## Typing

Declare expected variables in a `.d.ts` file for autocompletion and compile-time checks:

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL: string
    EXPO_PUBLIC_APP_ENV: 'development' | 'staging' | 'production'
  }
}
```

## `.env` files

| File | Purpose |
|---|---|
| `.env` | Default values, committed to git |
| `.env.local` | Local overrides, never committed |
| Profile-specific (`.env.production`, etc.) | Loaded per `eas.json` build profile via `env` field |

Anything with `EXPO_PUBLIC_` is inlined into the bundle and is extractable by anyone who has the app binary — never put a secret behind this prefix, no matter how it is stored in `.env`.

## Secrets that must never ship in the bundle

Values the app must never expose (server-side API keys used only during the build, signing credentials) belong in **EAS secrets**, not in any `EXPO_PUBLIC_` variable:

```bash
eas secret:create --name API_SIGNING_KEY --value <value>
```

EAS secrets are available to build-time hooks and config plugins, never to runtime JS — if a value must be readable by client code at all, it is not a secret, and putting it behind a non-`EXPO_PUBLIC_` name does not protect it once the app ships.
