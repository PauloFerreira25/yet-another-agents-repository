---
name: vue-spa-bootstrap
Scope: When initializing the application, restoring session, or registering plugins on mount
description: A single entry file registers plugins in dependency order and resolves the session before the first protected render.
---

A Vite SPA has one entry file at the root of `app/`. It creates the application instance, registers plugins, and mounts. Nothing else belongs there.

## Registration order

Order follows dependency, and it matters:

1. Pinia, before anything that reads a store
2. Pinia Colada, which installs onto Pinia
3. The router, whose guards read session state from a store
4. The UI library
5. i18n

Never register a plugin that depends on another before it. Never work around an ordering problem by deferring initialization into a component.

Keep each plugin's configuration in its own module under `app/plugins/`, and keep the entry file a list of registrations. An entry file that accumulates configuration becomes the place where unrelated concerns are edited together.

## Session restoration

Restoring the session is asynchronous, and the first navigation must not race it.

Resolve the session once, before the router is allowed to complete its first navigation into a protected route. Never let a protected page render and then redirect on failure — the user sees a flash of content they are not entitled to, and any query the page started has already gone to the backend.

Never restore the session inside a component. A component that restores it runs after routing has already decided.

Render a deliberate loading state while restoration is in flight. Never show an empty shell or the unauthenticated view, which produces a visible flicker on every reload for an authenticated user.

## What does not belong here

Never preload domain data at bootstrap "so it is ready". Data is fetched by the screen that needs it, through a query that caches it — see [[coding/vue/query-patterns]].

Bootstrap loads what the whole application requires to decide what to draw: session, permissions, locale, theme. Nothing else.
