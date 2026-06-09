---
name: nodejs-function-signatures
Scope: Before defining any function
description: All functions receive a single object parameter; input types are named; return types are explicit.
---

All functions receive a single object parameter. No positional parameters, no exceptions.

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

Input types must be explicit interfaces or type aliases — never inline object types in signatures:

```typescript
// correct
interface FindEntityParams {
  pagination?: { cursor?: string; pageSize?: number }
  filter?:     { isActive?: boolean }
}
find(params: FindEntityParams): Promise<Entity[]>

// wrong
find(params: { pagination?: { cursor?: string }; filter?: { isActive?: boolean } }): Promise<Entity[]>
```
