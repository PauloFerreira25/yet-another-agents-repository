---
name: nodejs-folder-and-layers
Scope: Before creating files or directories in src/
description: DDD folder structure, layer responsibilities, handler file splitting, and repository isolation.
---

## Folder structure

```
src/
├── index.ts         ← entry point, composes modules — no business logic
├── infra/           ← connections to external systems and bootstrap
│   ├── api.ts       ← HTTP server bootstrap (optional)
│   ├── queue.ts     ← message queue consumer bootstrap (optional)
│   ├── database.ts  ← database client (optional)
│   └── rabbitmq.ts  ← message queue client (optional)
├── domain/
│   └── <domain>/    ← one folder per bounded context
├── queue/           ← optional — present only when the project has workers
│   └── <worker>/    ← one folder per worker, grouped by business responsibility
└── shared/          ← domain-agnostic utilities with no external dependencies
    ├── config.ts    ← env var validation (Zod)
    ├── logger.ts    ← pino instance
    └── ...          ← pure helpers, no business logic, no infrastructure clients
```

`index.ts` only composes and starts — never contains business logic.

Files in `shared/` must be domain-agnostic and infrastructure-agnostic. If a file in `shared/` imports a database client or knows a domain rule, it is in the wrong place.

## Domain layer structure

Each domain folder contains:

```
domain/<name>/
├── index.ts                          ← exports routes for infra/api.ts
├── <name>.route.ts                   ← route definitions and schema references
├── <name>.handler.<function>.ts      ← one file per handler function
├── <name>.service.ts                 ← business logic, orchestration
├── <name>.repository.ts              ← database queries only
├── <name>.schema.ts                  ← base Zod schemas for the domain
├── <name>.dto.ts                     ← per-endpoint request/response DTOs
└── <name>.model.ts                   ← domain entity types
```

## Layer responsibilities

**handler** — translates the HTTP request into plain service input. No business logic, no conditions. Always serializes the response via `Schema.parse()` before returning — never returns raw service output. Never queries the database directly. Never has `try/catch`.

**service** — owns all business logic. Returns a Model, a composed type, or a primitive. Never returns a DTO and never imports HTTP framework types. May call multiple repositories or other services.

**repository** — database queries only. Never emits events and never contains business logic. Returns `null` when an entity is not found — never throws domain errors.

**schema** — never imports from `service`, `repository`, or `dto`.

**dto** — derives from `schema` — never defines fields independently.

## Handler file splitting

Each handler function lives in its own file. Never put more than one handler function in a single file.

Convention: `<domain>.<httpMethod>.<serviceFunction>.handler.ts`

```
domain/<name>/
├── <name>.post.create.handler.ts
├── <name>.get.list.handler.ts
├── <name>.get.findById.handler.ts
├── <name>.put.update.handler.ts
├── <name>.delete.delete.handler.ts
└── <name>.patch.restore.handler.ts
```

One handler per file is absolute — no exceptions, no grouping by semantic similarity. When adding a handler, there is always exactly one correct file name.

`service.ts` and `repository.ts` remain as single files per domain unless there is a concrete, justified reason to split.

## Repository isolation

The repository owns its infrastructure dependencies — the database connection and collection/table names are internal implementation details. Never passed in as parameters.

```typescript
// correct
import { db } from '@src/infra/database.js'
const COLLECTION = '<collection>'
export async function save(params: SaveParams): Promise<void> {
  await db.collection(COLLECTION).save(params.entity)
}

// wrong — service now knows which database and which collection exist
export async function save(params: { db: Database; entity: Entity }): Promise<void> {
  await params.db.collection('<collection>').save(params.entity)
}
```

## Workers

Workers follow the same pattern — replace `route` and `schema` with `consumer`:

```
queue/<group>/<worker>/
├── index.ts
├── <worker>.consumer.ts  ← subscribes to queue, calls handler
├── <worker>.handler.ts   ← processes the message
├── <worker>.service.ts   ← business logic
└── <worker>.model.ts     ← message types
```
