---
name: offline-network
Scope: When a feature must behave correctly without a network connection, or before deciding whether to check connectivity proactively
description: NetInfo for proactive connectivity checks; combine with OfflineError from the service layer for reactive handling — never assume a request will simply succeed
---

Mobile networks drop and degrade far more often than a desktop connection. Every screen that performs a mutation or depends on fresh data must have a deliberate answer for "what happens with no network" — not just an unhandled rejected promise.

```bash
npx expo install @react-native-community/netinfo
```

## Reactive handling — the default

For most requests, rely on the service layer's `OfflineError` (see `Service Layer`) surfacing through the same error-handling path as any other request failure — a toast or inline message, not a crash. This requires no extra code beyond what `Error Handling` already prescribes; do not add `NetInfo` checks in front of every request as a matter of default hygiene.

## Proactive checks — only when the UX genuinely needs it

Use `NetInfo` when the interaction should be disabled or change *before* attempting a request — e.g. graying out a "Sync now" button, or showing a persistent offline banner:

```ts
import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

export function useIsConnected(): boolean {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    return NetInfo.addEventListener((state) => setIsConnected(state.isConnected ?? true))
  }, [])

  return isConnected
}
```

Never use a proactive `NetInfo` check as the sole gate before every mutation "just in case" — connectivity can change between the check and the actual request. The reactive `OfflineError` path is still required regardless of whether a proactive check exists.

## Retrying

When a request fails with `OfflineError`, TanStack Query's default retry behavior already re-attempts on a backoff — do not add a manual "retry when back online" listener unless the feature specifically needs an immediate retry the instant connectivity returns (e.g. queued form submission), in which case listen for the `NetInfo` transition to `isConnected: true` and call `queryClient.refetchQueries()` / re-trigger the pending mutation explicitly.

## What this rule does not cover

Full offline-first behavior (local write queue, conflict resolution, background sync) is a significant architectural decision beyond a default stack choice — treat it as a feature to design deliberately with the human, not something to add speculatively because "mobile should probably support offline."
