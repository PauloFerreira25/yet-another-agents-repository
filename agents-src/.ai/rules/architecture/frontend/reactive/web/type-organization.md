---
name: type-organization
Scope: When creating or locating TypeScript types
description: Canonical domain types live in src/type/<domain>/, generic cross-cutting types in src/type/common/<concept>/
---

## Domain types

Each domain has its own directory under `src/type/`. The type file represents the canonical domain model — what the entity *is* in the system. Every layer imports from here and derives what it needs.

```
src/type/
  produto/
    produto.type.ts
  pedido/
    pedido.type.ts
```

```ts
// src/type/produto/produto.type.ts
export type Produto = { id: string; nome: string; preco: number }
export type CreateProdutoRequest = Omit<Produto, 'id'>
export type UpdateProdutoRequest = Partial<Omit<Produto, 'id'>>
```

Each layer derives its own shape using `Omit`, `Pick`, or intersection — never duplicates the canonical type:

```ts
// src/service/produto/produto.service.ts
import type { Produto, CreateProdutoRequest } from '@/type/produto/produto.type'

// src/store/produto/produto.store.ts
import type { Produto } from '@/type/produto/produto.type'
type ProdutoState = { selecionado: Produto | null; setSelected: (p: Produto | null) => void }

// src/page/produto/produtoPage.tsx
import type { Produto } from '@/type/produto/produto.type'
```

`src/type/` does not import from service, store, component, or page. It is a leaf in the dependency tree.

A type file is created as soon as a domain exists, even if there is no store yet. Never tie the existence of a domain type to the existence of a store.

## Common types

Cross-cutting types that belong to no specific domain live under `src/type/common/`. Each concept gets its own subdirectory — never a flat file dump inside `common/`:

```
src/type/common/
  error/
    error.type.ts
  notify/
    notify.type.ts
  pagination/
    pagination.type.ts
```

```ts
// src/type/common/pagination/pagination.type.ts
export type CursorPage<T> = { data: T[]; nextCursor: string | null }
export type CursorParam = { cursor: string | null }

// src/type/common/error/error.type.ts
export type ApiError = { code: string; message: string }
```

The same DDD subdivision rule applies to `common/` — if a concept grows, keep it in its own subdirectory, not as a sibling file.
