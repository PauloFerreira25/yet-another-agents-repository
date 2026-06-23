---
name: react-error-handling
Scope: When handling errors from useQuery, useMutation, or unexpected runtime errors in a page or template
description: Route-level error boundary for unexpected errors; useErrorStore for expected business errors displayed by the template
---

Apply two-layer error handling:

1. **Route error boundary** — catches unexpected errors (crashes, unhandled exceptions) and session errors (`UnauthenticatedError` from the HTTP client). Configured via `errorComponent` in every route definition. The `private` grouper's error boundary is responsible for catching session expiry and redirecting to login.
2. **useErrorStore** — exclusively for expected business errors inside authenticated pages (domain rule violations, validation failures, conflict errors). Never use for authentication or session errors.

**useErrorStore** lives at `src/store/error/error.store.ts`:

```ts
import { create } from 'zustand'

type ErrorEntry = {
  id: string
  message: string
}

type ErrorState = {
  errorList: ErrorEntry[]
  addError: (message: string) => void
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorList: [],
  addError: (message) =>
    set((state) => ({
      errorList: [...state.errorList, { id: crypto.randomUUID(), message }],
    })),
}))
```

When a page receives an error from `useQuery`, push it to the store:

```ts
const { data, error } = useQuery({
  queryKey: ['produto', id],
  queryFn: () => produtoService.getById(id),
})
const addError = useErrorStore(s => s.addError)

useEffect(() => {
  if (error) addError(error.message)
}, [error])
```

The template component reads `errorList` from `useErrorStore` and renders the error UI. How and when errors are cleared is the responsibility of the template implementation.

Never catch errors inside `queryFn`. Let TanStack Query propagate the error to the component — the component decides whether to push to `useErrorStore` or let the route error boundary handle it.

Use `instanceof` to distinguish error types from the HTTP client. Use `useQueryError` (from `src/hook/error/useQueryError.ts`) to avoid reimplementing this in every page — it handles known errors and uses `t()` for translated messages:

```ts
const { data, error } = useQuery({ queryKey: ['produto', id], queryFn: () => produtoService.getById(id) })
useQueryError(error)
```

When a page needs custom handling for a specific error, use `instanceof` directly with `t()` for strings:

```ts
import { ValidationError, ForbiddenError } from '@/service/api/main.httpClient'
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()

useEffect(() => {
  if (!error) return
  if (error instanceof ValidationError) addError(t('error.validation'))
  else if (error instanceof ForbiddenError) addError(t('error.forbidden'))
  // ServerError and unexpected errors bubble to the route error boundary
}, [error])
```
