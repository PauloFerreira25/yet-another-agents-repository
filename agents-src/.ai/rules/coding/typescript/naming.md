---
name: typescript-naming
Scope: Before naming, writing or reviewing any TypeScript
description: Naming conventions for TypeScript code in this project, based on the Google TypeScript Style Guide
---

The Google TypeScript Style Guide (https://google.github.io/styleguide/tsguide.html) is the baseline. Project-specific rules below take precedence where they differ.

## Code identifiers

| Identifier type | Style |
|---|---|
| Classes, interfaces, types, enums, decorators, type parameters | `UpperCamelCase` |
| Variables, parameters, functions, methods, properties, module aliases | `lowerCamelCase` |
| Global constants and enum values | `CONSTANT_CASE` |
| Environment variable names and error codes | `UPPER_SNAKE_CASE` |

```typescript
const entityId = params.id                           // lowerCamelCase
async function findById(params: IdParams): ...       // lowerCamelCase
interface FindEntityParams { ... }                   // UpperCamelCase
type EntityStatus = 'draft' | 'valid' | 'invalid'   // UpperCamelCase
const DATABASE_URL = config.DATABASE_URL             // UPPER_SNAKE_CASE
throw new NotFoundError('ENTITY_NOT_FOUND', ...)     // UPPER_SNAKE_CASE
```

Treat abbreviations as whole words: `loadHttpUrl`, not `loadHTTPURL`. This applies to all acronyms — `Uuid`, not `UUID`; `parentUuid`, not `parentUUID`; `Html`, not `HTML`.

Never use `_` as a prefix or suffix on identifiers.

Never prefix interfaces with `I` (e.g. `UserService`, not `IUserService`).

Never use abbreviations. Names must be descriptive (`user`, not `usr`; `request`, not `req`; `manager`, not `mgr`).

Never use single-letter names except for loop counters or well-known conventions (`i`, `j`, `x`, `y`).

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

## Files and directories

Use `camelCase` for all file and directory names:

```
src/domain/orderItem/orderItem.route.ts
src/domain/orderItem/orderItem.handler.ts
src/shared/config.ts
```

Never use `kebab-case`, `snake_case`, or `PascalCase` for file or directory names.

Exception: tooling config files follow each tool's own convention (`tsconfig.json`, `eslint.config.js`, `package.json`, `vitest.config.ts`).

The Google TypeScript Style Guide mentions `snake_case` for files only as a passing example in the Imports section — it is not a declared file naming convention. `camelCase` is a project decision, not a deviation from the guide.

## Long and compound names

Remove spaces, dots, and non-identifier characters. Capitalize each word after the first:

```
"chamada backend site uol.com.br"  →  backendCallUolComBr
"order item sync"                  →  orderItemSync
"api.payments.v2"                  →  apiPaymentsV2
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
