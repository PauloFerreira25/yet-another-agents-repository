---
name: composition-root
Scope: Before writing a Lambda handler or wiring factory dependencies
description: Factory instantiation at module level and make* pattern rules
---

# Composition Root

## Handler Rules

Always instantiate all factories at module level — never inside the handler function.

The handler function receives only input data. It has zero dependencies. All wiring happens before the handler is defined.

```typescript
// module level — correct
const getProduct = makeGetProductById({ findById: makeFindProductById(config) })

export const handler = async (event) => {
  await getProduct(event.pathParameters.id)  // zero deps, only data
}
```

Never do this:

```typescript
// inside handler — wrong
export const handler = async (event) => {
  const getProduct = makeGetProductById({ findById: makeFindProductById(config) })
}
```

## make* Pattern

Every function that receives dependencies must be a factory named `make*`. No exceptions.

Factories return the bound function typed by its own named type alias, defined in the same package as the factory itself — there is no separate port package to reference.

```typescript
export function makeFindProductById(config: DynamoConfig): FindProductById {
  return async (id) => { ... }
}
```

## Wiring Order

Wire in layers. Resolve infrastructure first, then domain services, then orchestrators.

```typescript
// layer 1: infrastructure → domain service
const getProduct = makeGetProductById({ findById: makeFindProductById(config) })

// layer 2: domain services → orchestrator
const createCheckout = makeCreateCheckout({ getProduct, ... })
```

## Service Dependencies

Domain services depend only on their own domain's repository's function-type declarations, imported with `import type` — e.g. `import type { FindProductById } from '../repository/findProductById.repository.js'`, an ordinary relative import, never the package's own name (see `layer-rules.md` for why) — never the runtime `make*` factory, and never another domain's repository in any form. The composition root is what actually calls the repository's factory and injects the resulting function into the service factory as a dependency.

Orchestrator services depend the same way on other domains' service packages — `import type` only, via the package-name/subpath form since that is a genuine cross-package consumer (e.g. `import type { FindProductByIdService } from '@lab/product/service/findProductById.service'`, no `.js`) — never the runtime factory. They depend on their own repository's function-type declaration the same relative-import way a domain service does, for the same reason. Never pass another domain's repository, or any repository as a runtime value, to an orchestrator; the composition root injects only the already-built function.

## Lambda as Composition Root

The lambda handler is the primary place where infrastructure and domain connect. It is the only place where all layers are allowed to be imported together.

Transaction-execution logic — building the `TransactWriteCommand`, calling `client.send()`, and translating the result (including interpreting `TransactionCanceledException`) — lives in the orchestrator's own repository as a single `make*` factory, e.g. `makeExecuteCheckoutTransaction({ client }): ExecuteCheckoutTransaction` in `domain/checkout/repository`. Never build it inline in the handler. The lambda only constructs the `DynamoDBDocumentClient` and passes it straight in as `client`.

`client` stays an injected dependency into that factory rather than being constructed inside it, even though it has exactly one consumer in this lambda: `coding-principles/testing.md` requires dependency injection specifically so tests can substitute a fake `client.send`. Never inline the construction of an external/infra object a test needs to substitute, no matter how few consumers it has — every product CRUD lambda already follows the same shape, `client` built once and handed to exactly one `make*` call.

This is a different question from whether to merge factories. Never split a single package's logic into two factories that are only ever used as a pair (e.g. one that builds a low-level executor and a second that just wires it into the first) — when one factory exists solely to feed another within the same package, merge them into one `make*` factory instead; that composition belongs inside the package, not glued together by the caller. Keeping `client` injected and merging the transaction-building factories are both correct at the same time: the first is about substitutability in tests, the second is about not making the caller assemble two factories that always travel together.
