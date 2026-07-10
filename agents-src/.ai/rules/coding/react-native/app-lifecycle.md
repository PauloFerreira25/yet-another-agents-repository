---
name: app-lifecycle
Scope: When behavior must react to the app moving between foreground, background, and inactive states
description: AppState is the mobile equivalent of window focus/visibility events; drives query refetch, realtime reconnection, and pausing expensive work
---

A mobile app is suspended (not just hidden) when backgrounded — timers stop, network sockets die, animations freeze. There is no direct web equivalent; `AppState` is the primitive that replaces `document.visibilitychange` and `window.onfocus`/`onblur`, but the underlying reality (the process may be fully suspended, not just occluded) is stricter than a background browser tab.

## Reading the current state

```ts
import { AppState } from 'react-native'

const subscription = AppState.addEventListener('change', (nextState) => {
  // nextState: 'active' | 'background' | 'inactive'
})

// later
subscription.remove()
```

Always store and remove the subscription — `AppState.addEventListener` does not clean itself up, and a leaked listener fires for the lifetime of the app.

## What must react to lifecycle transitions

- **Query refetch** — wired once at the query-client level via `focusManager`, see `Query Patterns`. Do not add a second, ad-hoc `AppState` listener per screen for this; it is already handled globally.
- **Realtime connections** — close on background, reconnect on foreground, see `Realtime`. A socket left open while backgrounded is not just wasteful — the OS kills it, and code that assumes it is still alive after foregrounding will fail silently.
- **Timers/polling** — clear intervals on background, restart on foreground. A `setInterval` left running assumes it keeps firing in the background; on iOS it will not, on Android it may be throttled unpredictably.
- **Animations** — Reanimated/Moti animations pause automatically when backgrounded; no manual handling needed for those specifically.

## Where to put the listener

Global concerns (query refetch, realtime, session-expiry checks) are wired once in the root layout or a dedicated hook consumed there — never duplicated per-screen. Screen-local concerns (pausing a video player, a camera preview) are wired in that screen's own `useEffect`, scoped to its own subscription.

Never assume a component's state is preserved correctly across a background/foreground cycle without testing it explicitly — this is one of the most common gaps between "works in the simulator during active development" and "breaks after the user switches apps and comes back."
