---
name: vue-esm-and-tsconfig
Scope: Before configuring modules, writing imports, or setting up TypeScript in a Vue project
description: Vue specialization of the TypeScript baseline — bundler module resolution, no emit, and Single File Component type checking.
---

For the ES Modules directive and the base compiler options, follow [[coding/typescript/esm-and-tsconfig]]. That rule delegates module resolution and output paths to the runtime; this is that rule for Vue, in both delivery modes.

Never use a file extension in a local import. Both modes resolve through a bundler, which does not need them.

Never set `rootDir` or `outDir`. The build tooling owns the output, and declaring them puts TypeScript and the bundler in disagreement about where files go.

## Compiler options

Use bundler module resolution. Never use the Node-style resolution modes in either mode: they require explicit file extensions the bundler does not want, and they change how package entry points are chosen.

Set `noEmit`. TypeScript's job here is to check types; the bundler compiles and emits.

Include the DOM library. These are browser applications, and in Nuxt the same code is also type-checked for the server render — the DOM types are still required.

## Type checking Single File Components

`tsc` does not understand `.vue` files. Run type checking through the Single File Component-aware checker instead, which extracts and checks the script block together with the template.

**Never type-check a Vue project with `tsc` alone.** It completes successfully over a project whose components it never examined, which reads as a passing check and is trusted as one. See [[coding/vue/package-scripts]].

## Where the options live

In Nuxt, the framework generates the TypeScript configuration. Extend from the generated file rather than replacing it, and never edit the generated file — it is rewritten on every prepare.

In a Vite SPA, the scaffold splits configuration into project-reference files. Put these options in the one covering application source, not the root file, which carries no compiler options of its own.
