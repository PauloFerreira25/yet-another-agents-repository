---
name: react-native-error-handling
Scope: When handling errors from useQuery, useMutation, or unexpected runtime errors in a screen or template
description: Group-level error boundary for unexpected errors; useErrorStore for expected business errors; session expiry redirects explicitly since there is no thrown-navigation error boundary
---

Apply the same two-layer error handling as the web stack:

1. **Group error boundary** — catches unexpected errors (crashes, unhandled exceptions) via Expo Router's `ErrorBoundary` export on a group layout (see `Routing`).
2. **`useErrorStore`** — exclusively for expected business errors inside authenticated screens (domain rule violations, validation failures, conflict errors). Never use it for authentication or session errors.

`useErrorStore` is identical to the web stack's:

```ts
// src/store/error/error.store.ts
import { create } from 'zustand'

type ErrorEntry = { id: string; message: string }
type ErrorState = { errorList: ErrorEntry[]; addError: (message: string) => void }

export const useErrorStore = create<ErrorState>((set) => ({
  errorList: [],
  addError: (message) =>
    set((state) => ({ errorList: [...state.errorList, { id: crypto.randomUUID(), message }] })),
}))
```

## Session expiry — the divergence from web

On web, `UnauthenticatedError` propagates to a route error boundary that redirects to `/login` (a thrown navigation error the router catches). Expo Router's `ErrorBoundary` is for rendering crashes, not for redirect-on-error flow control — never throw `UnauthenticatedError` expecting a group layout to catch it and navigate.

Instead, handle it where the error surfaces — in `useQueryError` — and navigate explicitly:

```ts
// src/hook/error/useQueryError.ts
import { useEffect } from 'react'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useErrorStore } from '@/store/error/error.store'
import { UnauthenticatedError, ValidationError, ForbiddenError, ServerError } from '@/service/api/main.httpClient'

export function useQueryError(error: Error | null) {
  const addError = useErrorStore(s => s.addError)
  const { t } = useTranslation()

  useEffect(() => {
    if (!error) return
    if (error instanceof UnauthenticatedError) { router.replace('/login'); return }
    if (error instanceof ValidationError) addError(t('error.validation'))
    else if (error instanceof ForbiddenError) addError(t('error.forbidden'))
    else if (error instanceof ServerError) addError(t('error.server'))
  }, [error, addError, t])
}
```

Use `router.replace`, never `router.push`, for the login redirect — the expired screen must not remain in the navigation history for the user to swipe back into.

Never catch errors inside `queryFn` — let TanStack Query propagate the error to the component, exactly like the web stack.
