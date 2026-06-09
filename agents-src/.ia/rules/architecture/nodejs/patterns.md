---
name: nodejs-patterns
Scope: Before implementing identifiers, list endpoints, request/response schemas, or any new functionality
description: UUIDv7 for identifiers, cursor-based pagination, schema-derived DTOs, and reuse-first discipline.
---

## Reuse before writing

Before implementing anything, verify it does not already exist:
- Search the codebase for existing utilities, types, and functions
- Check installed packages before adding a new dependency
- Never duplicate logic that exists elsewhere in the project

## Identifiers

Use UUIDv7 for all entity identifiers. Never use auto-increment integers, UUIDv4, or any other format.

UUIDv7 is time-ordered, universally unique, and works across distributed systems without coordination.

## Pagination

Prefer cursor-based pagination. Use offset/page only when there is a specific justification (fixed datasets, admin reports, export features).

Standard response envelope — `PaginationResponse<T>`:

```typescript
// { data: T[], pagination: { pageSize, nextCursor, prevCursor, hasNext, hasPrev } }
```

Standard input — `PaginationParams`:

```typescript
// { cursor?: string, pageSize?: number }
```

Never return a raw array from a list endpoint — always wrap in the standard envelope.

## DTOs

DTOs live in `<domain>.dto.ts` and are always derived from the base schemas in `<domain>.schema.ts` via `omit`, `extend`, or `pick`. Never define fields directly in a DTO.

Each endpoint has its own request DTO and its own response DTO. Never reuse the same DTO across different endpoints.

```typescript
// user.schema.ts
export const UserBaseSchema = z.object({
  name:  z.string(),
  email: z.string().email(),
  role:  z.enum(['admin', 'member']),
})

// user.dto.ts
export const CreateUserBodySchema     = UserBaseSchema.omit({ role: true })
export const CreateUserResponseSchema = UserBaseSchema.extend({ id: z.string() })
export const UpdateUserBodySchema     = UserBaseSchema.pick({ name: true })

export type CreateUserBody     = z.infer<typeof CreateUserBodySchema>
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>
export type UpdateUserBody     = z.infer<typeof UpdateUserBodySchema>
```

The base schema mirrors the Model fields relevant to the HTTP layer — not the full model. Internal fields (database timestamps, soft-delete flags) are not included.
