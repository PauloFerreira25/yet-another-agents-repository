---
name: react-native-logger
Scope: When logging diagnostic information, debugging, or recording runtime events
description: Centralized logger in src/lib/logger.ts; debug suppressed in production via __DEV__; never use console directly
---

Never call `console.log`, `console.debug`, `console.info`, `console.warn`, or `console.error` directly. Always use the centralized logger at `src/lib/logger.ts`.

```ts
// src/lib/logger.ts
export const logger = {
  debug: __DEV__ ? console.debug.bind(console) : () => {},
  info:  console.info.bind(console),
  warn:  console.warn.bind(console),
  error: console.error.bind(console),
}
```

`__DEV__` is a React Native global (injected by Metro), the equivalent of the web stack's `import.meta.env.DEV` — never use `process.env.NODE_ENV` to gate this, it is not reliably set in the Expo runtime.

## Log levels

Same convention as the web stack: `debug` for development diagnostics, `info` for significant events, `warn` for recoverable unexpected states, `error` for caught exceptions and unrecoverable states.

```ts
import { logger } from '@/lib/logger'

logger.debug('produtoStore: selectedId changed', { id })
logger.info('user authenticated', { userId })
logger.warn('stale cache detected, refetching')
logger.error('failed to load produto', error)
```

## Production visibility

Unlike a browser tab, there is no way to open devtools on an end user's device. `console.*` output in a production build is invisible unless the user is connected via a debugger — `logger.error` calls should also report to whatever crash-reporting service the project uses (Sentry, Bugsnag), not just print. Wiring that integration is a project-level decision; when a crash-reporting SDK is present, extend `logger.error` to forward to it rather than adding separate reporting calls scattered through the codebase.
