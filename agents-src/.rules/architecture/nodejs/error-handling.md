---
name: nodejs-error-handling
Scope: Before writing error throwing or catching in any layer
description: Who throws in each layer, AppError class hierarchy, and HTTP error response envelope.
---

## Who throws

**repository** — never throws domain errors. Returns `null` when an entity is not found.

**service** — checks the result and throws when a business rule is violated.

**handler** — never has `try/catch`. Errors propagate to the framework error handler.

```typescript
// repository — returns null, never throws
async function findById(params: IdParams): Promise<Entity | null> {
  return db.get(params.id) ?? null
}

// service — understands the domain, throws when needed
async function findById(params: IdParams): Promise<Entity> {
  const entity = await entityRepository.findById(params)
  if (!entity) throw new NotFoundError('ENTITY_NOT_FOUND', `Entity ${params.id} not found`)
  return entity
}

// handler — clean, no try/catch
async function findById(params: IdParams): Promise<Entity> {
  return entityService.findById(params)
}
```

## AppError class hierarchy

Define `AppError` as the base class in the project's shared error lib:

```typescript
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code:       string,
    message:                    string
  ) { super(message) }
}

export class NotFoundError   extends AppError { constructor(code: string, msg: string) { super(404, code, msg) } }
export class ValidationError extends AppError { constructor(code: string, msg: string) { super(422, code, msg) } }
export class ConflictError   extends AppError { constructor(code: string, msg: string) { super(409, code, msg) } }
```

Define project-specific errors by extending `AppError`:

```typescript
export class BusinessRuleError extends AppError {
  constructor(message: string) { super(422, 'BUSINESS_RULE_ERROR', message) }
}
```

## HTTP response envelope

```json
{ "error": "ENTITY_NOT_FOUND", "message": "Entity abc-123 not found" }
```

- `error` — `UPPER_SNAKE_CASE` code, stable and programmatically comparable
- `message` — human-readable, may change
- Unhandled errors (not `AppError` subclasses) return `500` with a generic message — never expose stack traces
