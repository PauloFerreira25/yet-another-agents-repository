---
name: vue-nuxt-session-ssr
Scope: When handling session, authentication, or any credential the server needs at render time
description: Under server-side rendering the session lives in an httpOnly cookie, because the server renders the page and cannot read browser storage.
---

Under server-side rendering the server renders the page before the browser runs anything. It therefore needs the credential at render time, and it has no access to browser storage.

**The session lives in an `httpOnly` cookie.** Never store a token in local storage or session storage in a Nuxt project. The server cannot read them, so every authenticated page either renders as unauthenticated and corrects itself on the client — a visible flash and a wasted render — or has to be excluded from server rendering entirely, which discards the reason for using Nuxt.

An `httpOnly` cookie is also unreadable by JavaScript, which removes an entire class of token theft. Set `secure` and an appropriate `sameSite` value.

## Consequences

Never read the token in client code. Client code does not need it: the cookie travels with the request automatically.

Requests made during server rendering must forward the incoming cookie. A request issued on the server does not inherit the browser's cookie jar, and without forwarding it arrives unauthenticated. Handle this once in the HTTP client, never per call site — see [[architecture/frontend/vue/service-layer]].

Never expose the session cookie to client-side configuration — see [[coding/vue/nuxt/runtime-config]].

Because the cookie is sent automatically with every request, protect state-changing endpoints against cross-site request forgery. This is a backend obligation, and it is not optional simply because the frontend never handles the token.

## Session state

The user profile and permissions derived from the session are ordinary client state and live in a Pinia store — see [[architecture/frontend/vue/state-selection]]. The credential itself never does.

Resolve the session in server-side middleware, so a protected route is decided before anything renders. Never redirect from inside a page after it has rendered.
