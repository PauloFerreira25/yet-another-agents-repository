---
name: react-native-realtime
Scope: When receiving real-time updates from the server (notifications, chat, live status)
description: WebSocket for server-push events since React Native has no native EventSource; connection lifecycle is driven by AppState, not component mount alone
---

React Native has no native `EventSource` — the web stack's SSE pattern does not port directly. Use a WebSocket connection for server-push events instead. If the backend only exposes SSE and cannot add a WebSocket endpoint, use `react-native-sse` (an `EventSource` polyfill) rather than building a raw HTTP streaming client from scratch.

## Pattern

- **Send** → REST via `mainClient` (existing service-layer patterns apply — error handling, auth headers)
- **Receive** → WebSocket; on message, invalidate the relevant TanStack Query

## useRealtime hook

```ts
// src/hook/realtime/useRealtime.ts
import { useEffect, useRef, useCallback } from 'react'
import { AppState } from 'react-native'
import { logger } from '@/lib/logger'

export function useRealtime(url: string, onMessage: (event: MessageEvent) => void) {
  const socketRef = useRef<WebSocket | null>(null)
  const stableHandler = useCallback(onMessage, [])

  useEffect(() => {
    function connect() {
      const socket = new WebSocket(url)
      socket.onmessage = stableHandler
      socket.onerror = () => logger.warn('realtime connection error', { url })
      socketRef.current = socket
    }

    connect()

    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active' && socketRef.current?.readyState !== WebSocket.OPEN) {
        connect()
      } else if (status !== 'active') {
        socketRef.current?.close()
      }
    })

    return () => {
      subscription.remove()
      socketRef.current?.close()
    }
  }, [url, stableHandler])
}
```

## AppState-driven lifecycle — the key divergence from web

A browser tab keeps its SSE connection alive in the background; a backgrounded mobile app is suspended by the OS and the socket dies silently. Never assume a connection opened on mount is still alive when the screen becomes visible again — close it on background and reconnect on foreground, as shown above. See `App Lifecycle` for the general `AppState` pattern this follows.

## Usage with TanStack Query

Identical to the web stack: on receiving a message, invalidate the relevant query rather than manually patching the cache, unless the payload contains the full updated entity.

```ts
// app/(private)/chat/[roomId].tsx
import { useQueryClient } from '@tanstack/react-query'
import { useRealtime } from '@/hook/realtime/useRealtime'

const queryClient = useQueryClient()

useRealtime(`${WS_BASE_URL}/chat/${roomId}/events`, (event) => {
  const data = JSON.parse(event.data) as { type: string }
  if (data.type === 'message') {
    queryClient.invalidateQueries({ queryKey: ['chat', roomId] })
  }
})
```

## Authentication

Pass the auth token as a query parameter or a WebSocket subprotocol header — there is no cookie jar automatically attached the way a browser attaches one to an `EventSource` request. Never embed a long-lived token; use the short-lived `accessToken` from `useAuthStore` and reconnect (picking up the current token) rather than trying to update an open socket's auth mid-connection.

## Connection lifecycle

Open the connection only on the screen that needs it, closed on unmount and on background — never a global always-open connection unless the app genuinely needs app-wide real-time events (e.g. a global notification badge), in which case scope it to the root layout instead of a screen.
