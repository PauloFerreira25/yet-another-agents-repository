---
name: nodejs-configuration
Scope: Before working with environment variables or startup configuration
description: All env vars validated with Zod at startup in src/shared/config.ts; never access process.env elsewhere.
---

Validate all environment variables with Zod at startup in a single file: `src/shared/config.ts`.

```typescript
import { z } from 'zod'

export const config = z.object({
  DATABASE_URL: z.string().url(),
  PORT:         z.coerce.number().default(3000),
  LOG_LEVEL:    z.enum(['debug', 'info', 'warn', 'error']).default('info'),
}).parse(process.env)
```

Never access `process.env` outside of `src/shared/config.ts`. The rest of the codebase imports `config`.

The service fails fast on startup if any required variable is missing or invalid — never defer validation to runtime.
