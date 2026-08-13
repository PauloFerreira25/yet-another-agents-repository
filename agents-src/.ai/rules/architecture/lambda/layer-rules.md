---
name: layer-rules
Scope: Before implementing or reviewing any import between layers
description: Import rules per layer, inviolable constraints, and enforcement approach
---

# Layer Rules

## Import Table

There is no `port/` layer. A service depends on another layer's function *shape*, never the module that implements it, by importing only types (`import type`) — never a runtime `make*` factory or any other runtime export.

Same-package cross-layer access — a service importing its own domain's repository — uses an ordinary relative import, per `esm-and-tsconfig.md` (`.js`-suffixed), never the package's own name. Importing a package by its own name resolves through that package's `exports` map into `dist/`, which doesn't exist yet during that same package's own `tsc --build` — a self-reference/build-order problem. The package-name/subpath form (extensionless — see `domain-structure.md`'s Exports section) is reserved for genuine cross-package consumers: another domain's service (the orchestrator case) and the lambda composition root. The composition root is the only place that imports a runtime factory and injects the resulting function into the next factory up the chain — this is what preserves the decoupling a port used to provide, without a separate port package:

```typescript
// domain/product/src/service/decrementProductStock.service.ts — same-package cross-layer: relative import, type-only
import type { DecrementProductStockTransactItem } from '../repository/decrementProductStockTransactItem.repository.js'

export type DecrementProductStockServiceDependencies = {
  decrementProductStockTransactItem: DecrementProductStockTransactItem
  log: Log
}

export function makeDecrementProductStockService(
  dependencies: DecrementProductStockServiceDependencies
): DecrementProductStockService {
  return (params: DecrementProductStockTransactItemParams): TransactWriteItem[] => {
    dependencies.log.debug({ context: { params }, message: 'decrementProductStockService' })
    return dependencies.decrementProductStockTransactItem(params)
  }
}
```

```typescript
// lambdas/http/v1/checkout/post/src/handler.ts — cross-package consumer: package subpath, no extension, runtime value
import { makeDecrementProductStockTransactItem } from '@lab/product/repository/decrementProductStockTransactItem.repository'

const decrementProductStockTransactItem = makeDecrementProductStockTransactItem(config)
const decrementProductStock = makeDecrementProductStockService({ decrementProductStockTransactItem, log })
```

| Layer | May import | Never imports |
|---|---|---|
| `schema` | nothing from this project | any other layer |
| `infra-dynamo` | AWS SDK | schema, repository, service, lambda |
| `error` | nothing from this project | any other layer |
| `util` | error | schema, repository, service |
| `repository` | schema (same domain), shared schema, logger, infra-dynamo, AWS SDK | service, lambda |
| `service (domain)` | its own domain's repository — type-only (`import type`), schema (same domain), shared schema, logger, error | its own repository as a runtime value, any other domain's repository (type or runtime), infra-dynamo, AWS SDK, lambda |
| `service (orchestrator)` | other domains' services — type-only (`import type`), its own repository — type-only (`import type`; transaction execution only, no owned table), error, logger | any repository as a runtime value, another domain's repository (type or runtime), other domains' services as a runtime value, infra-dynamo, AWS SDK, lambda |
| `lambdas/` | service/* (runtime), repository/* (runtime `make*` factories), infra-dynamo, util, logger | inline business logic, factory instantiation inside handler |

"Shared schema" in the table above refers to `shared/schema/` — the single project-wide package for a type used across domains (e.g. a common `IdParams`), as opposed to `schema (same domain)`, which is scoped to one domain's own `domain/<name>/src/schema/`. See [domain-structure.md](domain-structure.md) for where `shared/schema/` lives.

"Logger" in the table above is the project's shared logging package — see [logging.md](../nodejs/logging.md) for setup and [logging.md](../../coding-principles/logging.md) for the first-line/outcome logging requirements every function in these layers must follow.

## Inviolable Rules

Never allow a service to import a repository as a runtime value. A domain service may only `import type` its own domain's repository's function-type declarations — never the runtime `make*` factory, and never any other domain's repository at all, in type or runtime form. The composition root is the only place that imports and calls the runtime factory, then injects the resulting function into the service.

Never allow an orchestrator service to import another domain's repository, in any form. An orchestrator may only `import type` other domains' service packages and its own repository — never as a runtime value. Its own repository exists solely to execute and interpret its cross-domain transaction (e.g. building the `TransactWriteCommand` and translating `TransactionCanceledException`), never to own data or a table.

Never instantiate factories inside the handler function — only at module level.

## Repositories Import TransactWriteItem Directly from the AWS SDK

`TransactWriteItem` is consumed in repository files, not a separate port layer. See [infra-dynamo.md](infra-dynamo.md) for the full rule.

## Enforcement

The rule "service never imports a repository from another domain" is enforced by convention and code review — not by tooling. Separate npm packages prevent ESLint from distinguishing whether an import from another package is a repository or a service, because the package path does not carry that semantic. Code review is the gate.
