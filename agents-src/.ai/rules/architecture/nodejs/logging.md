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
