---
name: nodejs-logging
Scope: Before adding log statements to any layer
description: pino setup for Node.js projects. Log principles (first-line, outcome, sensitive data) are in coding-principles/logging.md.
---

For log principles, follow `.ai/rules/coding-principles/logging.md`.

Use `pino` as the logger. Instantiate once in `src/shared/logger.ts`:

```typescript
import pino from 'pino'
import { config } from './config.js'

export const log = pino({ level: config.LOG_LEVEL })
```
