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
  if (!entity) throw new NotFoundError({ code: 'ENTITY_NOT_FOUND', message: `Entity ${params.id} not found` })
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
export type AppErrorParams = {
  statusCode: number
  code:       string
  message:    string
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code:       string

  constructor(params: AppErrorParams) {
    super(params.message)
    this.statusCode = params.statusCode
    this.code       = params.code
  }
}

export type NotFoundErrorParams   = { code: string; message: string }
export type ValidationErrorParams = { code: string; message: string }
export type ConflictErrorParams   = { code: string; message: string }

export class NotFoundError   extends AppError { constructor(params: NotFoundErrorParams)   { super({ statusCode: 404, ...params }) } }
export class ValidationError extends AppError { constructor(params: ValidationErrorParams) { super({ statusCode: 422, ...params }) } }
export class ConflictError   extends AppError { constructor(params: ConflictErrorParams)   { super({ statusCode: 409, ...params }) } }
```

Define project-specific errors by extending `AppError`:

```typescript
export type BusinessRuleErrorParams = { message: string }

export class BusinessRuleError extends AppError {
  constructor(params: BusinessRuleErrorParams) {
    super({ statusCode: 422, code: 'BUSINESS_RULE_ERROR', message: params.message })
  }
}
```

## HTTP response envelope

```json
{ "error": "ENTITY_NOT_FOUND", "message": "Entity abc-123 not found" }
```

- `error` — `UPPER_SNAKE_CASE` code, stable and programmatically comparable
- `message` — human-readable, may change
- Unhandled errors (not `AppError` subclasses) return `500` with a generic message — never expose stack traces
