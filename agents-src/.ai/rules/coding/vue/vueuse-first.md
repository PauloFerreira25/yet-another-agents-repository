---
name: vue-vueuse-first
Scope: Before writing a composable for a browser API, device state, or reactive utility
description: Check VueUse before hand-rolling a composable that wraps a browser API or a common reactive pattern.
---

Before writing a composable that wraps a browser API, observes device or document state, or implements a common reactive utility, check whether VueUse already provides it.

This covers, among others: storage, media queries, element size and visibility, pointer and keyboard state, network status, clipboard, permissions, event listeners, debouncing and throttling, server-sent events.

Hand-rolled versions of these are where cleanup bugs live. The listener that is never removed, the observer that outlives its component, the storage read that throws in a private window — VueUse has already handled each of those, and a fresh implementation has to rediscover them.

Never reimplement a VueUse composable in order to avoid the dependency. It is already in the dependency graph.

Never wrap a VueUse composable in a pass-through of your own that adds nothing. Import it where it is used.

Do write your own when the need is genuinely domain-specific, or when the VueUse version does not fit and you can say precisely how. State the reason at the point of use, so the next reader does not have to re-derive it.

The check is cheap and the search is the whole obligation here: look before writing, not after.
