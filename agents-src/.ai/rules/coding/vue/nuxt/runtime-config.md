---
name: vue-nuxt-runtime-config
Scope: Before reading configuration or environment values
description: Configuration comes from runtimeConfig, with a strict split between values the client may see and values that stay on the server.
---

Read configuration through Nuxt's `runtimeConfig`. Never read `process.env` in application code, and never use the bundler's build-time environment interface — in a Nuxt project that mixes two mechanisms with different exposure rules, which is how secrets leak.

`runtimeConfig` is resolved at runtime rather than inlined at build time, so one build can be deployed to several environments.

## The split that matters

Values nested under the public key are sent to the browser. Everything else stays on the server.

**Never put a secret in the public section.** An API key, a token, a database credential or a private endpoint placed there is shipped to every visitor and readable in the page source.

**Never access a private value from client code.** It is undefined there, and the failure appears somewhere unrelated to the mistake.

When in doubt about whether a value is needed on the client, it is not. Move the call that needs it to the server side.

## Discipline

Declare every value the application uses in the configuration file, with a safe default, so the full set of expected values is readable in one place.

Validate required values at startup and fail loudly when one is missing.

Never branch on which environment the application is running in. Configuration expresses the difference; a condition inside the code hides it and makes environments diverge in ways nobody can see.

Commit an example environment file listing every variable with placeholder values. Never commit a real one.

See [[coding-principles/security]].
