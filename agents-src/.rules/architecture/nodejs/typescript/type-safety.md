---
name: nodejs-type-safety
Scope: Before writing types, using any, or casting with as
description: No any, no as casting — use unknown with narrowing and satisfies for type conformance.
---

## No `any`

Never use `any`. If the type is not known at the call site, use `unknown` and narrow before using the value:

```typescript
// wrong
function process(data: any): any { ... }

// correct
function process(data: unknown): string {
  if (typeof data !== 'string') throw new ValidationError('INVALID_INPUT', 'Expected string')
  return data
}
```

## No `as` casting

Never use `as` to cast types. Use a type guard to narrow safely:

```typescript
// wrong
const entity = result as Entity

// correct — type guard narrows safely
function isEntity(value: unknown): value is Entity {
  return typeof value === 'object' && value !== null && 'id' in value
}

if (isEntity(result)) {
  // result is Entity here
}
```

## `satisfies`

Use `satisfies` when validating type conformance at the point of definition — it checks the type without widening it:

```typescript
const config = {
  level: 'info',
  pretty: false,
} satisfies LoggerConfig
```
