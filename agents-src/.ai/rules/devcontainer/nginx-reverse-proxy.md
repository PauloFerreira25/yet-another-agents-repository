---
name: nginx-reverse-proxy
Scope: When adding an nginx reverse proxy in front of multiple dev servers
description: Single-origin path-based routing to avoid CORS between the frontend and backend dev servers, with HMR websocket support.
---

When a project has more than one dev server (frontend + one or more backends), put an `nginx`
service in front of them as the single entry point on port 80 — the browser then only ever talks
to one origin, avoiding CORS between the frontend and backend services entirely.

```yaml
services:
  nginx:
    image: nginx:1.30-alpine
    volumes:
      - ./container/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "80:80"
```

Route by path prefix, proxying to each service by its compose hostname:

```nginx
location /api/auth/ {
    proxy_pass http://backend-auth:9080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

For a frontend dev server with hot module replacement (Vite, or any dev server using a websocket
for live reload), the proxy must also upgrade the connection — without these headers, HMR
silently falls back to full page reloads on every change:

```nginx
location / {
    proxy_pass http://frontend-web:5173/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

Use a pinned image tag (e.g. `nginx:1.30-alpine`), never `nginx:latest` — this service has no
Dockerfile of its own, so an unpinned tag is the only thing standing between a rebuild and an
unplanned nginx upgrade.
