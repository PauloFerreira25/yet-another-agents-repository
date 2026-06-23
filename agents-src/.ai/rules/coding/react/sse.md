---
name: sse
Scope: When receiving real-time updates from the server (notifications, chat, live status)
description: SSE via native EventSource for server-push events; sending always via REST
---

Use native `EventSource` (SSE) for all server-push communication. Never use WebSocket — the architecture separates concerns: REST sends commands, SSE delivers events.

## Pattern

- **Send** → REST via `httpClient` (existing patterns apply — error handling, auth headers)
- **Receive** → SSE via `EventSource`; on event, invalidate the relevant TanStack Query

## useSSE hook

```ts
// src/hook/realtime/useSSE.ts
import { useEffect, useCallback } from 'react'
import { logger } from '@/lib/logger'

export function useSSE(url: string, onMessage: (event: MessageEvent) => void) {
  const stableHandler = useCallback(onMessage, [])

  useEffect(() => {
    const source = new EventSource(url, { withCredentials: true })
    source.onmessage = stableHandler
    source.onerror = () => logger.warn('SSE connection error', { url })
    return () => source.close()
  }, [url, stableHandler])
}
```

## Usage with TanStack Query

On receiving an event, invalidate the relevant query — do not update cache manually unless the event payload contains the full updated entity:

```ts
// src/page/private/chat/chatPage.tsx
import { useQueryClient } from '@tanstack/react-query'
import { useSSE } from '@/hook/realtime/useSSE'

const queryClient = useQueryClient()

useSSE(`${import.meta.env.VITE_API_URL}/chat/${roomId}/events`, (event) => {
  const data = JSON.parse(event.data) as { type: string }
  if (data.type === 'message') {
    queryClient.invalidateQueries({ queryKey: ['chat', roomId] })
  }
})
```

## Authentication

`EventSource` does not support custom headers. Pass the auth token as a query parameter, or use `withCredentials: true` with cookie-based auth:

```ts
// token as query param — only if the server accepts it
const url = `${import.meta.env.VITE_API_URL}/events?token=${useAuthStore.getState().token}`
new EventSource(url)

// cookie-based — preferred when the server supports it
new EventSource(url, { withCredentials: true })
```

Never embed tokens in URLs in production if logs or proxies capture the full URL — prefer cookie auth for SSE endpoints.

## Connection lifecycle

Open the SSE connection only on the page or component that needs it. The connection closes automatically when the component unmounts (`source.close()` in the cleanup function). Do not open a global persistent SSE connection unless the app requires app-wide real-time events (e.g., a global notification feed).
