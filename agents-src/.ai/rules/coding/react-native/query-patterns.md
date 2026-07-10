---
name: react-native-query-patterns
Scope: When writing a TanStack Query hook
description: Same service-delegated queryFn convention as the web stack; refetch is triggered by AppState foreground instead of window focus
---

Always pass a service method as `queryFn`. Never inline an HTTP call — this and the query key conventions are unchanged from `.ai/rules/coding/react/query-patterns.md`:

```ts
// correct
useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll })
```

Query keys are arrays, domain noun first, then identifiers or filters. Custom hook extraction only when the same query is reused across more than one screen. `staleTime` is always set explicitly, defined centrally in `src/lib/queryConfig.ts` — see the web rule for the full rationale, it applies unchanged.

## Refetch on foreground, not on window focus

The browser's `visibilitychange`/focus events do not exist on a device. TanStack Query's default `refetchOnWindowFocus` has no effect in React Native. Wire refetch to the app's foreground transition instead, once, at the query client level:

```ts
// src/lib/queryConfig.ts
import { AppState, type AppStateStatus } from 'react-native'
import { focusManager } from '@tanstack/react-query'

AppState.addEventListener('change', (status: AppStateStatus) => {
  focusManager.setFocused(status === 'active')
})
```

Register this once, near where the `QueryClient` is created (see `Bootstrap`) — never per-screen. With `focusManager` wired, `refetchOnWindowFocus: true` (the default) now refetches when the app returns to the foreground, matching the intent of the web behavior. See `App Lifecycle` for other `AppState`-driven concerns beyond query refetching.

## Pagination

Follow the same cursor-based `useInfiniteQuery` pattern as the web stack for feeds and activity lists. There is no fetch-all-and-paginate-in-memory pattern on mobile — see `List Patterns` for why FlashList replaces that use case instead of TanStack Table.

## Mutations

Unchanged: always pass a service method as `mutationFn`, invalidate related queries in `onSuccess`.
