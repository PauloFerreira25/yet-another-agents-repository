---
name: logger
Scope: When logging diagnostic information, debugging, or recording runtime events
description: Centralized logger in src/lib/logger.ts; debug suppressed in production; never use console directly
---

Never call `console.log`, `console.debug`, `console.info`, `console.warn`, or `console.error` directly. Always use the centralized logger at `src/lib/logger.ts`.

```ts
// src/lib/logger.ts
const isDev = import.meta.env.DEV

export const logger = {
  debug: isDev ? console.debug.bind(console) : () => {},
  info:  console.info.bind(console),
  warn:  console.warn.bind(console),
  error: console.error.bind(console),
}
```

## Log levels

| Method | Local / Dev | Production |
|---|---|---|
| `logger.debug` | printed | suppressed |
| `logger.info` | printed | printed |
| `logger.warn` | printed | printed |
| `logger.error` | printed | printed |

Use `debug` for development diagnostics (state transitions, query results, render traces). Use `info` for significant application events. Use `warn` for recoverable unexpected states. Use `error` for caught exceptions and unrecoverable states.

```ts
import { logger } from '@/lib/logger'

logger.debug('produtoStore: selectedId changed', { id })
logger.info('user authenticated', { userId })
logger.warn('stale cache detected, refetching')
logger.error('failed to load produto', error)
```

`logger.debug` compiles to a no-op function in production — no string interpolation cost, no console output.
