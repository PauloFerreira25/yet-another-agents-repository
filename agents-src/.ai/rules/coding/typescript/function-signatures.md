---
name: nodejs-function-signatures
Scope: Before defining any function
description: All functions receive a single object parameter; input types are named; return types are explicit.
---

All functions receive a single object parameter. No positional parameters, except the two narrow cases in "Exceptions" below.

```typescript
// correct
findById(params: IdParams): Promise<Entity>
find(params: FindEntityParams): Promise<Entity[]>
update(params: UpdateEntityParams): Promise<Entity>
delete(params: IdParams): Promise<void>

// wrong
findById(id: string): Promise<Entity>
update(id: string, name: string, description: string): Promise<Entity>
```

Define a shared `IdParams` type in the project — never inline `{ id: string }` in signatures.

Always declare explicit types on function parameters. Always declare return types on exported functions.

Input types must be explicit type aliases — never inline object types in signatures:

```typescript
// correct
type FindEntityParams = {
  pagination?: { cursor?: string; pageSize?: number }
  filter?:     { isActive?: boolean }
}
find(params: FindEntityParams): Promise<Entity[]>

// wrong
find(params: { pagination?: { cursor?: string }; filter?: { isActive?: boolean } }): Promise<Entity[]>
```

## Exceptions

Two cases keep a bare, unwrapped parameter. Both are technical constraints, not style choices — every other function still takes a single named object with no exception.

**TypeScript user-defined type guards.** A type guard's `value is X` predicate only narrows the type at the call site when its parameter is the literal, unwrapped argument passed in:

```typescript
// correct — parameter stays unwrapped so narrowing works at the call site
function isEntityModel(value: unknown): value is EntityModel { ... }

if (!isEntityModel(result.Item)) throw new NotFoundError(...)
return result.Item // narrowed to EntityModel here

// wrong — wrapping breaks narrowing: this narrows the throwaway object literal
// constructed at the call site, not result.Item itself
function isEntityModel(params: { value: unknown }): params is { value: EntityModel } { ... }
isEntityModel({ value: result.Item })
```

Never wrap a type guard's parameter in an object, even though every other function must be.

**Platform-dictated signatures.** A signature invoked directly by a runtime or framework that owns the call site — e.g. the AWS Lambda handler, `(event, context) => ...` — is not ours to change. There is no "single object parameter" to apply because the platform already calls it with a fixed argument list.
