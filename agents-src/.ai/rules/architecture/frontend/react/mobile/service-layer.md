---
name: mobile-service-layer
Scope: When creating API integration code
description: Same service-layer discipline as the web stack; token storage uses SecureStore instead of an HttpOnly cookie, and requests must account for offline state
---

All HTTP calls must be written inside `src/service/<domain>/<domain>.service.ts`. No component, screen, store, or hook may call `fetch` or any HTTP client directly. Services never use raw `fetch` — they always import a configured HTTP client. This is unchanged from the web stack.

## HTTP clients

Each backend has its own HTTP client at `src/service/api/<backend>.httpClient.ts`:

```
src/service/api/
  main.httpClient.ts
  legacy.httpClient.ts
```

```ts
// src/service/api/main.httpClient.ts
export class UnauthenticatedError extends Error {
  constructor() { super('Session expired') }
}
export class ValidationError extends Error {
  constructor(public body: unknown) { super('Validation failed') }
}
export class ForbiddenError extends Error {
  constructor() { super('Access denied') }
}
export class ServerError extends Error {
  constructor(public status: number) { super(`Server error ${status}`) }
}
export class OfflineError extends Error {
  constructor() { super('No network connection') }
}

type RequestOptions = RequestInit & { skipAuth?: boolean }

const BASE_URL = process.env.EXPO_PUBLIC_API_URL

async function request<T>(path: string, opts: RequestOptions = {}, retry = true): Promise<T> {
  const { skipAuth, ...init } = opts
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (!skipAuth) {
    const { useAuthStore } = await import('@/store/auth/auth.store')
    const { accessToken } = useAuthStore.getState()
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers: { ...headers, ...init.headers } })
  } catch {
    throw new OfflineError()
  }

  if (res.status === 401 && !skipAuth && retry) {
    const { useAuthStore } = await import('@/store/auth/auth.store')
    const refreshed = await useAuthStore.getState().tryRefreshToken()
    if (refreshed) return request<T>(path, opts, false)
    throw new UnauthenticatedError()
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    if (res.status === 422) throw new ValidationError(body)
    if (res.status === 403) throw new ForbiddenError()
    throw new ServerError(res.status)
  }
  return res.json() as Promise<T>
}

export const mainClient = {
  get:  <T>(path: string, opts?: RequestOptions) => request<T>(path, opts),
  post: <T>(path: string, body: unknown, opts?: RequestOptions) => request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),
  put:  <T>(path: string, body: unknown, opts?: RequestOptions) => request<T>(path, { method: 'PUT', body: JSON.stringify(body), ...opts }),
  del:        (path: string, opts?: RequestOptions) => request(path, { method: 'DELETE', ...opts }),
}
```

`process.env.EXPO_PUBLIC_API_URL` replaces `import.meta.env.VITE_API_URL` — see `Env Vars`.

## Token storage — the key divergence from web

There is no browser and no HttpOnly cookie the OS sends automatically. Both tokens are the app's responsibility:

- `accessToken` — kept in memory via Zustand, same as web (lost on cold start, refreshed via `tryRefreshToken` during `bootstrap()`).
- `refreshToken` — stored with `expo-secure-store` (backed by Keychain on iOS, Keystore-backed EncryptedSharedPreferences on Android). Never store the refresh token in MMKV or `AsyncStorage` — those are not encrypted at rest.

```ts
// src/service/auth/auth.service.ts
import * as SecureStore from 'expo-secure-store'
import { mainClient } from '@/service/api/main.httpClient'

const REFRESH_TOKEN_KEY = 'refreshToken'

export const authService = {
  refresh: async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
    if (!refreshToken) throw new Error('No refresh token stored')
    return mainClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh', { refreshToken }, { skipAuth: true }
    )
  },
  persistRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  clearRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
}
```

```ts
// src/store/auth/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  tryRefreshToken: async () => {
    try {
      const { accessToken, refreshToken } = await authService.refresh()
      await authService.persistRefreshToken(refreshToken)
      set({ accessToken, isAuthenticated: true })
      return true
    } catch {
      await authService.clearRefreshToken()
      set({ accessToken: null, isAuthenticated: false })
      return false
    }
  },
  logout: async () => {
    await authService.clearRefreshToken()
    set({ accessToken: null, isAuthenticated: false, permissions: [] })
  },
}))
```

On app launch, `useAppStore.bootstrap()` calls `tryRefreshToken()` to rehydrate the session from the stored refresh token — same relationship to bootstrap as the web stack (see `Bootstrap`).

## Offline requests

Every request can fail with `OfflineError` before it ever reaches the server — mobile networks drop far more often than a desktop browser's connection. Callers distinguish it from `ServerError` explicitly; never treat the two the same in UI. See `Offline & Network State` for when to check connectivity proactively instead of waiting for a failed request.

## Mapping API responses to domain types

Unchanged from the web stack: the service maps the raw API shape to the canonical domain type in `src/type/<domain>/<domain>.type.ts`. Callers never see the raw API shape. `queryFn` always delegates to the service method — never inlines a `fetch` call (see `Query Patterns`).
