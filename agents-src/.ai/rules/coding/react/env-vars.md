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
| `.env.example` | Documents every expected key with placeholder values, committed to git |
| `.env.local` | Real local values, never committed (gitignored) |
| `.env.production` | Real production values, never committed (gitignored) |

Never commit a `.env*` file that holds a real value — local or production. The only `.env*` file allowed in git is `.env.example`, and every value in it must be a placeholder, never a real credential or endpoint. Real values live in `.env.local` for local development, or are injected directly by the deployment environment (CI/CD, hosting platform) for every other stage — never read from a file tracked by git.

When adding a new variable, add its key with a placeholder value to `.env.example` in the same change, so the file stays a complete, current reference of what the project expects.

If the host repository's root `.gitignore` already blocks committing any `.env*` file — common in a monorepo, where it applies to every package, not just this one — that is not an obstacle to work around. It already matches this rule; do not edit a shared `.gitignore` outside this project's own directory to carve out an exception.
