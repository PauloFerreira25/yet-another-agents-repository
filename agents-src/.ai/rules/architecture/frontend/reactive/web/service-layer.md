---
name: service-layer
Scope: When creating API integration code
description: All HTTP calls go through the service layer divided by DDD domain
---

All HTTP calls must be written inside `src/service/<domain>/<domain>.service.ts`. No component, page, store, or hook may call `fetch`, `axios`, or any HTTP client directly. Services never use raw `fetch` — they always import a configured HTTP client.

## HTTP clients

Each backend has its own HTTP client at `src/service/api/<backend>.httpClient.ts`. Services import only the client they need.

```
src/service/api/
  main.httpClient.ts
  legacy.httpClient.ts
```

The client accepts a `skipAuth` option per request. When `skipAuth: true`, the Authorization header is omitted and 401 handling is skipped — used by `authService` to call the refresh endpoint without sending an expired token.

To break the circular import (`httpClient` → `authStore` → `authService` → `httpClient`), import `authStore` lazily **inside** the request function, not at the top of the module. By the time any request function executes, all modules are fully initialized.

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

type RequestOptions = RequestInit & { skipAuth?: boolean }

const BASE_URL = import.meta.env.VITE_API_URL

async function request<T>(path: string, opts: RequestOptions = {}, retry = true): Promise<T> {
  const { skipAuth, ...init } = opts

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (!skipAuth) {
    // lazy import — breaks circular dependency at module initialization time
    const { useAuthStore } = await import('@/store/auth/auth.store')
    const { accessToken } = useAuthStore.getState()
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers: { ...headers, ...init.headers } })

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
  get:    <T>(path: string, opts?: RequestOptions) => request<T>(path, opts),
  post:   <T>(path: string, body: unknown, opts?: RequestOptions) => request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),
  put:    <T>(path: string, body: unknown, opts?: RequestOptions) => request<T>(path, { method: 'PUT', body: JSON.stringify(body), ...opts }),
  del:          (path: string, opts?: RequestOptions) => request(path, { method: 'DELETE', ...opts }),
}
```

`authStore.tryRefreshToken()` owns the token lifecycle — it calls `authService.refresh()` and stores the new access token.

**Token storage strategy**: `accessToken` lives in Zustand (memory only — lost on page close). `refreshToken` is an HttpOnly cookie managed entirely by the server — the frontend never reads or stores it. The browser sends it automatically to the `/auth/refresh` endpoint.

`authService.refresh()` calls `mainClient` with `skipAuth: true` (no expired `accessToken` header) and `credentials: 'include'` (browser sends the HttpOnly cookie):

```ts
// src/service/auth/auth.service.ts
import { mainClient } from '@/service/api/main.httpClient'

export const authService = {
  refresh: () =>
    mainClient.post<{ accessToken: string }>('/auth/refresh', {}, { skipAuth: true, credentials: 'include' }),
  logout: () =>
    mainClient.post('/auth/logout', {}, { skipAuth: true, credentials: 'include' }),
}

// src/store/auth/auth.store.ts
import { authService } from '@/service/auth/auth.service'

type AuthState = {
  accessToken: string | null
  isAuthenticated: boolean
  setAccessToken: (token: string) => void
  tryRefreshToken: () => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  tryRefreshToken: async () => {
    try {
      const { accessToken } = await authService.refresh()
      set({ accessToken, isAuthenticated: true })
      return true
    } catch {
      set({ accessToken: null, isAuthenticated: false })
      return false
    }
  },
  logout: async () => {
    await authService.logout().catch(() => {})  // best-effort — clears server cookie
    set({ accessToken: null, isAuthenticated: false, permissions: [] })
  },
}))
```

On app mount, `useAppStore.bootstrap()` calls `tryRefreshToken()` to rehydrate the session from the existing cookie — if the cookie is still valid, the user stays logged in without re-entering credentials. See the `Bootstrap` rule for the full initialization flow.

`UnauthenticatedError` propagates through TanStack Query to the `private` grouper's error boundary, which redirects to login. Never use `useErrorStore` for session errors — it is exclusively for business errors inside authenticated pages.

Structure each service as a plain object with typed async methods. Always use the configured HTTP client — never raw `fetch`:

```ts
// src/service/produto/produto.service.ts
import { mainClient } from '@/service/api/main.httpClient'
import type { Produto, CreateProdutoRequest } from '@/type/produto/produto.type'

export const produtoService = {
  getAll: (): Promise<Produto[]> =>
    mainClient.get<Produto[]>('/produtos'),

  getById: (id: string): Promise<Produto> =>
    mainClient.get<Produto>(`/produtos/${id}`),

  create: (data: CreateProdutoRequest): Promise<Produto> =>
    mainClient.post<Produto>('/produtos', data),
}
```

When using TanStack Query, the `queryFn` must call the service method — never inline a `fetch` call:

```ts
// correct
queryFn: () => produtoService.getAll()

// wrong
queryFn: () => fetch('/api/produtos').then(r => r.json())
```

HTTP error handling belongs in the HTTP client. Components receive typed domain data or typed error instances — they never parse HTTP status codes directly.

## Mapping API responses to domain types

The service is responsible for converting the API response shape to the canonical domain type defined in `src/type/<domain>/<domain>.type.ts`. Callers never see the raw API shape.

```ts
// src/service/produto/produto.service.ts
import { mainClient } from '@/service/api/main.httpClient'
import type { Produto } from '@/type/produto/produto.type'

type ProdutoApiResponse = {
  produto_id: string
  nome_produto: string
  preco_unitario: number
}

function toProduto(raw: ProdutoApiResponse): Produto {
  return { id: raw.produto_id, nome: raw.nome_produto, preco: raw.preco_unitario }
}

export const produtoService = {
  getAll: async (): Promise<Produto[]> => {
    const list = await mainClient.get<ProdutoApiResponse[]>('/produtos')
    return list.map(toProduto)
  },
  getById: async (id: string): Promise<Produto> => {
    const raw = await mainClient.get<ProdutoApiResponse>(`/produtos/${id}`)
    return toProduto(raw)
  },
}
```

When the API shape already matches the domain type, no mapping function is needed. The `ApiResponse` type is an internal detail of the service file — never exported.
