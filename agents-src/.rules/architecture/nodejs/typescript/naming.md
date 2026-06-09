---
name: nodejs-naming
Scope: Before naming identifiers, files, or directories
description: TypeScript casing conventions, file naming rules, domain vocabulary (Schema/Model/Dto), and English-only identifiers.
---

## Code identifiers

- `camelCase` — variables, functions, parameters, object properties
- `PascalCase` — interfaces, type aliases, classes, enums
- `UPPER_SNAKE_CASE` — environment variable names and error codes

```typescript
const entityId = params.id                           // camelCase
async function findById(params: IdParams): ...       // camelCase
interface FindEntityParams { ... }                   // PascalCase
type EntityStatus = 'draft' | 'valid' | 'invalid'   // PascalCase
const DATABASE_URL = config.DATABASE_URL             // UPPER_SNAKE_CASE
throw new NotFoundError('ENTITY_NOT_FOUND', ...)     // UPPER_SNAKE_CASE
```

Never use abbreviations. Names must be descriptive (`user`, not `usr`; `request`, not `req`; `manager`, not `mgr`).

## Files and directories

Use `camelCase` for all file and directory names, without exception:

```
src/domain/orderItem/orderItem.route.ts
src/domain/orderItem/orderItem.handler.ts
src/shared/config.ts
```

Never use `kebab-case`, `snake_case`, or `PascalCase` for file or directory names.

Exception: tooling config files follow each tool's own convention (`tsconfig.json`, `eslint.config.js`, `package.json`, `vitest.config.ts`).

## Long and compound names

Remove spaces, dots, and non-identifier characters. Capitalize each word after the first:

```
"chamada backend site uol.com.br"  →  backendCallUolComBr
"order item sync"                  →  orderItemSync
"api.payments.v2"                  →  apiPaymentsV2
```

Domain names with dots have each segment treated as a separate word.

## Domain vocabulary

Three terms have precise meaning. Use them consistently in file names, type names, and conversation:

**Schema** — a Zod validation object (`z.object({...})`). Never use this word for a database structure or ORM definition.

**Model** — the domain entity type. What the repository returns and the service operates on. Technology-agnostic.

**Dto** — Data Transfer Object. The shape of data at the HTTP boundary.

```
UserModel   ← what the repository returns, what the service uses
UserSchema  ← Zod validation object
UserDto     ← what the HTTP handler receives or returns
```

## Language

All code identifiers — variables, functions, type names, interfaces, file names, field names, log messages, error codes, queue names, and event types — must be in English.

```typescript
// correct
throw new NotFoundError('ENTITY_NOT_FOUND', `Entity ${id} not found`)

// wrong
throw new NotFoundError('ENTIDADE_NAO_ENCONTRADA', `Entidade ${id} não encontrada`)
```

The only exception is when the human explicitly and deliberately requests otherwise.
