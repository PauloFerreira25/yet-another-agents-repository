---
name: nginx-static-spa-subpath
Scope: When configuring nginx to serve a pre-built static SPA under a subpath instead of at the origin root
description: Serving a pre-built static bundle (not a live dev server) under a subpath — bundler base path, nginx alias/try_files, and how to read the resulting error symptoms.
---

This is a different pattern from `Nginx Reverse Proxy`, which puts nginx in front of one or more
**live dev servers** via `proxy_pass`. Here there is no dev server at all: a Node service builds a
static bundle and keeps rebuilding it on every change, and nginx serves that build output
directly as static files.

Two services:

```yaml
services:
  frontend-build:
    command: sh -c "npm ci && npm run build -- --watch"
  nginx:
    depends_on:
      - frontend-build
    volumes:
      - ../.data-volumes/frontend-build-output:/usr/share/nginx/html:ro
```

`depends_on` can only order container *startup*, not build *readiness*. The build service never
exits — it is a watcher, not a one-shot build — so there is no `service_completed_successfully`
condition available here. Plain `depends_on` (the default `service_started` condition) is the
correct and only option; nginx may 404 for the first few seconds until the initial build
finishes. Document this as expected, not a bug to fix.

## Serving under a subpath

When the SPA is served under a subpath (e.g. `/backoffice/`) instead of the origin root, two
things must independently agree on that subpath:

- The bundler's own base-path setting (e.g. Vite's `base`) must be set at build time, so emitted
  asset URLs in the built `index.html` are prefixed with the subpath. Pass it as a build-time
  env var into the build service rather than hardcoding it in any devcontainer file — the app
  owns and reads that variable; the devcontainer service only forwards it.
- nginx's location block must route that subpath using `alias`, not `root`, with a `try_files`
  fallback for the SPA's own client-side router:

  ```nginx
  location /backoffice/ {
      alias /usr/share/nginx/html/;
      try_files $uri $uri/ /backoffice/index.html;
  }
  ```

  `alias` is required here because the location prefix does not match the actual directory layout
  on disk — `root` would look for `/usr/share/nginx/html/backoffice/index.html`, which does not
  exist. The `try_files` fallback target must repeat the full subpath (`/backoffice/index.html`),
  not a bare `/index.html` — nginx must re-resolve it through this same `location` block via
  `alias` again, not through `location /` (which either doesn't exist or serves something else
  entirely).

  A convenience redirect at the origin is optional but common:

  ```nginx
  location = / { return 302 /backoffice/; }
  ```

## Reading the failure symptoms

- A `try_files` fallback target pointing at the wrong path (e.g. a bare `/index.html` instead of
  the full subpath), or a genuinely missing/empty build output, produces an nginx-reported
  "rewrite or internal redirection cycle" — surfaced to the client as a **500**, not a 404.
- A **403** on the subpath itself (no trailing filename) means nginx matched the location
  correctly but found no index to serve, with `autoindex off` (the default). This is almost
  always a missing or empty build output directory, not an nginx configuration bug.
