---
name: query-patterns
Scope: When writing a TanStack Query hook
description: queryFn must delegate to the service layer; extract to custom hook only when reused
---

Always pass a service method as `queryFn`. Never inline an HTTP call:

```ts
// correct
useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll })

// wrong
useQuery({ queryKey: ['produtos'], queryFn: () => fetch('/api/produtos').then(r => r.json()) })
```

**Query keys** must be arrays. Use the domain noun as the first element, followed by any identifiers or filters:

```ts
['produtos']                        // all items
['produto', id]                     // single item by id
['produtos', { status: 'ativo' }]   // filtered list
```

**Custom hook extraction**: extract `useQuery` into a named hook only when the same query is used in more than one component. When used in a single component, write it inline.

```ts
// extract when reused across multiple components
export const useProdutos = () =>
  useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll })
```

**staleTime**: set explicitly when caching behavior matters. Never assume the default (`0`) is correct — it triggers a refetch on every component remount.

When multiple queries share similar caching requirements, define named constants in `src/lib/queryConfig.ts` and import them:

```ts
// src/lib/queryConfig.ts
export const staleTime = {
  fresh:  0,
  short:  1000 * 60,
  medium: 1000 * 60 * 5,
  long:   1000 * 60 * 30,
}
```

```ts
import { staleTime } from '@/lib/queryConfig'

// must always be fresh
useQuery({ queryKey: ['notification'], queryFn: notificationService.getAll, staleTime: staleTime.fresh })

// can use cache
useQuery({ queryKey: ['produto'], queryFn: produtoService.getAll, staleTime: staleTime.medium })
```

Each query declares its own staleTime. There is no global default — every caching decision is explicit and local to the query.

## Pagination patterns

The pagination strategy follows what the backend provides — cursor-based or page-based. Choose the client pattern by the backend contract and the UI need:

### Cursor "next only" — feeds and lists

Use `useInfiniteQuery` when the backend paginates by cursor and the user navigates forward only (activity feed, chat history, search results). Exposes a "load more" button or infinite scroll trigger:

```ts
useInfiniteQuery({
  queryKey: ['notification'],
  queryFn: ({ pageParam }: { pageParam: string | null }) =>
    notificationService.getAll({ cursor: pageParam }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
  staleTime: staleTime.short,
})
```

### Fetch-all + in-memory — administrative tables

When a table needs full sorting, filtering, and pagination across all data, fetch all pages from the API and let TanStack Table handle pagination in memory. The service loops through pages until exhausted — works with both cursor-based and page-based backends:

```ts
// src/service/produto/produto.service.ts
getAll: async (): Promise<Produto[]> => {
  const result: Produto[] = []
  let cursor: string | null = null
  do {
    const page = await mainClient.get<{ data: Produto[]; nextCursor: string | null }>(
      `/produtos${cursor ? `?cursor=${cursor}` : ''}`
    )
    result.push(...page.data.map(toProduto))
    cursor = page.nextCursor
  } while (cursor)
  return result
},
```

```ts
// page uses useQuery (not useInfiniteQuery) — receives the full flat array
useQuery({
  queryKey: ['produto'],
  queryFn: produtoService.getAll,
  staleTime: staleTime.medium,
})
```

TanStack Table receives the full array and handles sorting, filtering, and pagination client-side via `getPaginationRowModel()`. See the `Table Patterns` rule.

**Mutations**: always pass a service method as `mutationFn`. Invalidate related queries in `onSuccess`:

```ts
const mutation = useMutation({
  mutationFn: produtoService.create,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['produtos'] }),
})
```
