---
name: vue-routing
Scope: When creating or organizing route files
description: File-based routing from app/pages/ in both modes, with grouping directories for structure that must not appear in the URL.
---

Routes come from the file tree under `app/pages/`. The path of the file is the path of the route. Never maintain a hand-written route table.

This is native in Nuxt, and native in vue-router for a Vite SPA — see [[architecture/frontend/vue/spa/router-setup]] for registering it.

```
app/pages/index.vue              → /
app/pages/product/index.vue      → /product
app/pages/product/[id].vue       → /product/:id
```

A directory name in square brackets is a dynamic segment. Name it for what it identifies, not `[id]` everywhere — `[productId]` where the page nests under another resource.

## Grouping without affecting the URL

Wrap a directory name in parentheses to organize files without the segment entering the URL:

```
app/pages/(private)/product/index.vue   → /product
app/pages/(public)/login.vue            → /login
```

Use this to separate public from authenticated areas, and to group pages by domain where the domain is not meant to be part of the address. Never introduce a URL segment purely to satisfy a directory structure, and never flatten the structure to avoid one.

## Per-route metadata

Declare access requirements, layout and title on the page itself, using the framework's page-meta mechanism. Never encode them in a central table — the page owns its own requirements, and a reader opening the page sees them.

Route protection is governed by [[architecture/frontend/vue/permissions]].

## Layouts

A layout hosting routed children lives in `app/layouts/` and is selected per page through page meta. Never nest a layout inside `app/pages/`, and never rebuild layout switching by conditionally rendering chrome inside pages.
