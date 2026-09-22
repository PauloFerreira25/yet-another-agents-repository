---
name: vue-nuxt-data-fetching-ownership
Scope: Before fetching data or choosing between useAsyncData and a Pinia Colada query
description: Nuxt's own fetching composables and the Pinia Colada cache overlap; this rule decides which owns what, so a project never runs two caches.
---

Nuxt provides `useAsyncData` and `useFetch`, which fetch during server rendering and transfer the result to the client. Pinia Colada provides a cache with deduplication, revalidation and invalidation. Both can fetch, and a project that uses them interchangeably ends up with two caches that do not know about each other.

The division is by purpose, and it is not negotiable within a project:

**Pinia Colada owns application data.** Anything the user navigates to, filters, refetches, or that a write invalidates. This is the default and covers nearly everything — see [[coding/vue/query-patterns]].

**Nuxt's composables own render-critical data.** Data that must exist in the server-rendered HTML: the content of a public page that has to be indexable, or anything a search engine or link preview must see without executing JavaScript.

## The test

Ask whether the HTML returned by the server has to already contain this data.

If yes, it is render-critical and uses Nuxt's fetching. If no — and for anything behind authentication the answer is always no — it belongs to the cache.

## Rules that follow

Never fetch the same resource through both mechanisms. It is fetched twice, cached twice, and the two disagree after the first write.

Both delegate to the service layer. Nuxt's composables are not an exception to [[architecture/frontend/vue/service-layer]]; the fetching function calls a service method exactly as a query does.

Never use `useAsyncData` because a page happens to need data on load. That is what the cache is for, and it does it with deduplication the other has no concept of.

Invalidation after a write is the cache's mechanism. Never refetch render-critical data by calling a refresh function scattered across components.

State which mechanism a page uses and why, where it is not obvious. This is the decision most likely to be made inconsistently by whoever works on the page next.
