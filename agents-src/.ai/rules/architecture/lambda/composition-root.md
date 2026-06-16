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

Factories return the bound function typed by the corresponding port.

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

Domain services receive repository ports as dependencies. Never pass a repository implementation directly.

Orchestrator services receive service ports from other domains. Never pass repositories or repository ports to an orchestrator.

For the intentional exception where orchestrator services receive `Transact` from `infra-dynamo`, see [infra-dynamo.md](infra-dynamo.md).

## Lambda as Composition Root

The lambda handler is the primary place where infrastructure and domain connect. It is the only place where all layers are allowed to be imported together.

Keep `makeTransact` inline in the handler — it is three lines with no logic and does not justify a shared helper.
