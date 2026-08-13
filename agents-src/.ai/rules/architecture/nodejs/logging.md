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

## AWS Lambda

Never use `pino` on AWS Lambda. Its default transport (`thread-stream`) runs a worker thread — a poor fit for Lambda's execution model: the environment can be frozen or torn down between invocations, risking lost log writes or shutdown-latency surprises that don't exist in a long-running process. CloudWatch Logs already captures stdout directly, so the worker thread buys nothing here beyond added cold-start cost.

Use a plain `console.log` JSON-line logger instead. Keep the same logging principles (first-line log, outcome logs, sensitive-data omission) — only the transport changes:

```typescript
export type LoggerParams = { level: string }
export type LogParams    = { context?: Record<string, unknown>; message: string }
export type Logger       = { debug: (params: LogParams) => void }

export function makeLogger(params: LoggerParams): Logger {
  return {
    debug: ({ context, message }) => {
      if (params.level !== 'debug') return
      console.log(JSON.stringify({ level: 'debug', message, ...context }))
    },
  }
}
```

```typescript
const log = makeLogger({ level: config.LOG_LEVEL })
log.debug({ context: { params }, message: 'findById' })
```

The examples below use `pino`'s own two-argument call shape (`log.debug(mergingObject, message)`) — that shape belongs to `pino`'s API, not ours, so it stays as-is for the general Node.js case. On AWS Lambda, apply the same principle through the logger above instead: `log.debug({ context, message })`.

## First-line log

```typescript
async function findById(params: IdParams): Promise<Entity> {
  log.debug({ params }, 'findById')
  // ...
}
```

## Outcome logs

```typescript
async function createOrder(params: CreateOrderParams): Promise<Order> {
  log.debug({ params }, 'createOrder')
  const order = await orderRepository.save({ order: build(params) })
  log.debug({ order }, 'createOrder:created')
  return order
}
```

## Log the full result

```typescript
// wrong — forces a second lookup to see anything beyond the id
log.debug({ orderId: order.id }, 'createOrder:created')

// correct — everything is available immediately
log.debug({ order }, 'createOrder:created')
```

## Sensitive data

```typescript
async function createUser(params: CreateUserParams): Promise<User> {
  log.debug({ email: params.email }, 'createUser') // omits password
}

async function authenticate(params: AuthParams): Promise<Session> {
  log.debug({ username: params.username }, 'authenticate') // omits password
}
```
