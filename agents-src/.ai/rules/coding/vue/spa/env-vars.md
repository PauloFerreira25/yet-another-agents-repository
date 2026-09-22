---
name: vue-spa-env-vars
Scope: Before reading environment variables or configuring .env files
description: Prefixed build-time variables read through the bundler's typed interface, with nothing secret among them.
---

Vite exposes only variables carrying its public prefix to client code, through `import.meta.env`. Never read from `process.env` in application code.

Declare the types for the variables the application uses, so a missing or misspelled variable is a type error rather than `undefined` at runtime.

Read environment variables in one configuration module and export typed values from it. Never scatter `import.meta.env` reads through components and services — a variable read in fifteen places cannot be validated, defaulted or renamed in one edit.

Validate required variables at startup and fail loudly when one is missing. An application that starts with an undefined API base URL fails later, somewhere unrelated, with an error that does not name the cause.

## Nothing secret

**Everything exposed this way is public.** It is inlined into the bundle at build time and readable by anyone who opens the application.

Never put an API key, a token, a credential or anything else secret in a prefixed variable, whatever the deployment. A secret that the browser needs is a secret the backend should be using on the browser's behalf. See [[coding-principles/security]].

## Files

Commit an example file listing every variable the application expects, with placeholder values, so a new checkout is runnable. Never commit a real environment file.

Values differing by environment belong in that environment's configuration, never in a condition inside the code that checks which environment it is running in.
