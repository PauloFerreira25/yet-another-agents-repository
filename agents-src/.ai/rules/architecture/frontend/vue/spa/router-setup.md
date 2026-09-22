---
name: vue-spa-router-setup
Scope: When configuring the router or registering its plugin
description: File-based routing in a Vite SPA comes from vue-router's own Vite plugin, not from a hand-written route table.
---

vue-router provides file-based routing natively through its own Vite plugin. Register that plugin and let routes come from `app/pages/` — see [[architecture/frontend/vue/routing]] for the conventions, which are identical in both modes.

Never hand-write a route table. Never install a separate file-based routing package: the plugin that used to provide this was absorbed into vue-router itself, and adding it now duplicates what the router already does.

Import the generated routes from the router's auto entry and pass them to the router instance. Never enumerate routes alongside the generated ones.

Register the router on the application instance during bootstrap, in the order described by [[architecture/frontend/vue/spa/bootstrap]].

## Guards

Navigation guards live in `app/middleware/` and are registered once against the router instance. Never scatter guards across route definitions, and never put an access check inside a page — see [[architecture/frontend/vue/permissions]].

A guard that needs session state reads it from the store. A guard that must wait for the session to be restored awaits that restoration rather than racing it — see [[architecture/frontend/vue/spa/bootstrap]].

## Layouts

Layout selection is driven by page meta and applied by a layouts plugin, so a page declares its layout rather than importing and wrapping one. Never import a layout component inside a page.

## Type safety

The plugin generates route types. Use the typed helpers for navigation and for reading parameters, so a renamed route fails at build time instead of at runtime. Never navigate by assembling a path string by hand.
