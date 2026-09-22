---
name: vue-spa-project-scaffold
Scope: When initializing a new Vue project from scratch
description: Scaffold with Vite, set the source root to app/, then install the stack in dependency order with versions resolved at the time of the work.
---

## Before anything

Resolve the version matrix first, per [[common/dependency-version-matrix]]. Never copy a version from this rule or any other — none are written here, deliberately.

Confirm the project name with the human before creating anything. Infer it from context, state what you intend to create and where, and wait for an explicit answer.

## Steps

1. **Scaffold** with Vite's Vue TypeScript template.

2. **Move the source root to `app/`.** The template creates `src/`; rename it and update the path alias, the entry reference in the HTML file, and the TypeScript include paths. Verify the application still starts before continuing — see [[architecture/frontend/vue/folder-structure]] for the layout to create inside it.

3. **Install the runtime stack**: the UI library and its Vite plugin, Pinia, Pinia Colada, vue-router, VueUse, vee-validate, zod, vue-i18n, the charting wrapper with its underlying library, and the animation library.

4. **Install the development stack**: the linter, the type checker for Single File Components, Vitest with a DOM environment, Vue Test Utils and Testing Library.

5. **Configure auto-import parity**, per [[coding/vue/spa/auto-import-parity]].

6. **Register the router's Vite plugin**, per [[architecture/frontend/vue/spa/router-setup]].

7. **Write the entry file and plugin modules**, per [[architecture/frontend/vue/spa/bootstrap]].

8. **Configure the test runner** in the same config file as the build, so the path alias is defined once and cannot drift between the two.

9. **Add the scripts**, per [[coding/vue/package-scripts]]. The lint script invokes the Vue-aware linter, never the base binary — see [[coding/vue/lint]].

## Containers

When the project runs inside a development container, bind the dev server to all interfaces and confirm its port is forwarded in the container configuration. A server bound to loopback inside a container is unreachable from the host, and the symptom looks like a broken application rather than a networking setting.
