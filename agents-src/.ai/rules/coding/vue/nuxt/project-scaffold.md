---
name: vue-nuxt-project-scaffold
Scope: When initializing a new Nuxt project from scratch
description: Scaffold with Nuxt's own tooling, add modules in dependency order, and resolve every version at the time of the work.
---

## Before anything

Resolve the version matrix first, per [[common/dependency-version-matrix]]. No versions are written in this rule, deliberately. Pay particular attention to the UI library's Nuxt module, whose release channel has historically lagged the library itself — if the current release is a pre-release, that is an exception requiring a stated reason and explicit human confirmation before it is adopted.

Confirm the project name with the human before creating anything.

## Steps

1. **Scaffold** with Nuxt's own initializer, which creates the `app/` source root already.

2. **Create the directory layout** inside `app/`, per [[architecture/frontend/vue/folder-structure]]. Nuxt provides most of the names; add the ones it does not reserve.

3. **Install the modules** for the UI library, Pinia, Pinia Colada and i18n, and declare them in dependency order — see [[coding/vue/nuxt/module-config]].

4. **Install the remaining runtime packages** that have no module: VueUse, vee-validate, zod, the charting wrapper with its underlying library, and the animation library.

5. **Install the development stack**: the linter, Vitest, the Nuxt test utilities, Vue Test Utils and Testing Library.

6. **Configure the nested scan paths** for composables, utilities and stores, per [[coding/vue/nuxt/module-config]].

7. **Declare the configuration surface** in `runtimeConfig`, with the public and private split explicit from the start, per [[coding/vue/nuxt/runtime-config]].

8. **Set up session handling** before the first protected route exists, per [[architecture/frontend/vue/nuxt/session-ssr]]. Retrofitting cookie-based sessions after screens are built means revisiting every one of them.

9. **Add the scripts**, per [[coding/vue/package-scripts]]. The lint script invokes the Vue-aware linter — see [[coding/vue/lint]].

## Deployment

Server-side rendering requires a running server. Confirm with the human, before the project is built around it, that the deployment target provides one. A project scaffolded for server rendering and deployed as static files loses everything the choice was made for.

When the project runs inside a development container, bind the dev server to all interfaces and confirm its port is forwarded.
