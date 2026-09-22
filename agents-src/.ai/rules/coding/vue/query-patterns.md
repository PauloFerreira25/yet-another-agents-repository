---
name: vue-query-patterns
Scope: When writing a Pinia Colada query or mutation
description: Queries delegate to the service layer, keys are arrays led by the domain noun, staleness is explicit, and invalidation is declared with the write that causes it.
---

## Queries

Always pass a service method as the `query` function. Never inline a request:

```ts
// correct
useQuery({
  key: () => ['product'],
  query: productService.getAll,
})

// wrong
useQuery({
  key: () => ['product'],
  query: () => fetch('/api/products').then(r => r.json()),
})
```

The service layer is the only place that speaks HTTP — see [[architecture/frontend/vue/service-layer]].

## Keys

Keys are arrays, led by the domain noun in the singular, followed by identifiers and filters:

```ts
['product']                        // the collection
['product', id]                    // one item
['product', { status: 'active' }]  // a filtered view
```

Declare the key as a function so it tracks its reactive dependencies. A key built from a route parameter or a filter must re-evaluate when that value changes; a key written as a plain array captures the value once and silently serves stale data for the rest of the component's life.

Never build a key from a value that is not part of what identifies the data.

## Staleness

Set staleness explicitly on every query. Never rely on the default, and never leave the decision implicit — how long a piece of data may be served from cache is a domain judgement, not a framework detail.

Where several queries share a caching profile, define named constants in `app/utils/` and import them, so the profiles are comparable and changing one is a single edit.

## Extraction

Write the query inline in the component that uses it. Extract it into a named composable in `app/composables/` only when a second component needs the same query — see [[coding/vue/composables]].

## Mutations

Always pass a service method as the `mutation` function, and declare invalidation with the mutation that causes it:

```ts
const queryCache = useQueryCache()

const { mutate: createProduct } = useMutation({
  mutation: productService.create,
  onSettled: () => queryCache.invalidateQueries({ key: ['product'] }),
})
```

Invalidation belongs next to the write. Never scatter refetch calls across the components that happen to display the affected data — that is the manual bookkeeping the cache exists to remove, and it breaks the moment a new consumer appears.

Never mutate cached data by hand to reflect a write. Invalidate and let the cache refetch, unless an optimistic update is genuinely required, in which case it is declared on the mutation and reverted on failure.
