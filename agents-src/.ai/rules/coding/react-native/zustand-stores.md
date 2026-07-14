---
name: react-native-zustand-stores
Scope: When creating a Zustand store
description: Same per-domain store convention as the web stack, extended with MMKV-backed persistence for state that must survive app restarts
---

For the base convention — one store per DDD domain, never a single global store, accessing state outside components via `.getState()` — follow `.ai/rules/architecture/frontend/react/web/zustand-stores.md`. It applies unchanged.

## MMKV persistence

Use Zustand's `persist` middleware with an MMKV-backed storage adapter for state that must survive an app restart (e.g. the persisted half of auth state, user preferences, draft form data). Never persist a store by default — persistence is a deliberate choice per store, made when losing the state on restart would be a real problem for the user.

```ts
// src/lib/storage.ts
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()
```

```ts
// src/store/preference/preference.store.ts
import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { storage } from '@/lib/storage'

const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
}

type PreferenceState = {
  language: string
  setLanguage: (language: string) => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      language: 'pt-BR',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'preference-storage', storage: createJSONStorage(() => mmkvStorage) }
  )
)
```

## What never gets persisted

- The `accessToken` — kept in memory only, exactly like the web stack. The refresh token that actually survives restarts lives in `expo-secure-store`, not MMKV (see `Service Layer` — MMKV is not encrypted at rest, `expo-secure-store` is).
- Server data — TanStack Query owns that cache; never mirror it into a persisted Zustand store.

## Rehydration timing

A persisted store rehydrates asynchronously on cold start. Never read a persisted store's value before `useAppStore.bootstrap()` resolves — gate any logic that depends on it behind the bootstrap phase (see `Bootstrap`), the same way session restoration is gated.
