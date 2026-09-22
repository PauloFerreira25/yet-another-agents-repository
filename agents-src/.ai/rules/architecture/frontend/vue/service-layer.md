---
name: vue-service-layer
Scope: When creating or modifying a service, HTTP client, or any code that calls the backend
description: Services are the only layer that speaks HTTP, and they map backend responses into canonical domain types.
---

`app/services/` is the only place in the application where an HTTP request is made. No component, page, store, composable or query function issues one directly.

## Structure

```
app/services/
  client.ts              ← configured HTTP client, one per backend
  product/
    product.service.ts
```

The client centralizes base URL, headers, authentication and error normalization. Never configure those at a call site.

A service exposes methods named for the operation in domain terms — `getAll`, `getById`, `create`, `update`, `remove` — never for the transport.

## Mapping is the service's job

A service returns canonical domain types, never the raw response:

```ts
export const productService = {
  getById: async (id: string): Promise<Product> => {
    const response = await client.get<ProductResponse>(`/products/${id}`)
    return toProduct(response)
  },
}
```

The response type and the mapping function stay inside the service. Never export them, and never let a response shape reach a component. See [[architecture/frontend/vue/type-organization]].

This is what makes a backend change a one-file change.

## Errors

A service normalizes transport and protocol failures into the application's own error type before returning. Never let a client-specific error object escape the service layer. See [[coding/vue/error-handling]] for how callers handle what the service raises, and [[coding-principles/error-handling]] for the general principles.

## Consumption

Query and mutation functions delegate to a service method and never inline a request — see [[coding/vue/query-patterns]].

Never bypass the service layer because a call is small, one-off, or used in only one place.
