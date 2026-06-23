---
name: react-env-vars
Scope: Before reading environment variables or configuring .env files in a React Vite project
description: Vite environment variable conventions — VITE_ prefix, import.meta.env, and TypeScript typing
---

Vite only exposes environment variables prefixed with `VITE_` to the browser bundle. Variables without this prefix are not available at runtime — they are silently `undefined`.

Never use `process.env` in a React project. Always use `import.meta.env`:

```typescript
// correct
const apiUrl = import.meta.env.VITE_API_URL

// wrong — process.env is not available in Vite browser bundles
const apiUrl = process.env.VITE_API_URL
```

## Typing

Declare all expected variables in `src/lib/env.d.ts` to get TypeScript autocompletion and catch missing variables at compile time:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## .env files

| File | Purpose |
|---|---|
| `.env` | Default values, committed to git |
| `.env.local` | Local overrides, never committed |
| `.env.production` | Production values, committed |

Never commit secrets to any `.env` file tracked by git. Secrets belong in `.env.local` or in the deployment environment directly.
