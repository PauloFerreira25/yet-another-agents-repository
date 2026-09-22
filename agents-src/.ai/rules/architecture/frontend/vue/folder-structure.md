---
name: vue-folder-structure
Scope: When creating or organizing project files
description: One directory layout shared by Vite SPA and Nuxt projects, using the names Nuxt mandates, with the two naming exceptions this requires stated explicitly.
---

## The source root is `app/`

Every path in this stack begins at `app/`. Never `src/`, in either delivery mode.

This is the single most frequently broken rule here, because everything pushes the other way: the Vite template creates a `src/`, and the inherited TypeScript and Node.js rules write their examples against `src`. None of that applies — see [[coding/vue/path-aliases]] and [[coding/vue/package-scripts]], which restate the substitution for the configuration each one governs.

**If you are about to write a path beginning with `src/`, stop.** You are either working from a baseline example that does not apply here, or from a scaffold whose source root was never moved. Resolve that before creating the file, not after — files created under the wrong root have to be moved later, and every import, alias and config reference pointing at them has to be found and corrected.

In Nuxt the root is mandated by the framework. In a Vite SPA it is configuration, applied immediately after scaffolding and before any other file exists — see [[coding/vue/spa/project-scaffold]].

Both delivery modes use the same layout below. A Vite SPA adopts the names Nuxt mandates rather than the other way around, because Nuxt cannot be configured out of them and Vite has no opinion. This keeps one structure rule instead of two, and lets code move between modes without being reorganized.

## Layout

```
app/
  assets/          ← static assets processed by the bundler
  components/      ← Atomic Design levels, DDD subdivision inside
  composables/     ← reusable composition functions
  layouts/         ← full-screen layouts hosting routed children
  middleware/      ← navigation guards
  pages/           ← routed pages; the file path is the route
  plugins/         ← framework and library registration
  services/        ← the only layer that speaks HTTP
  stores/          ← Pinia stores, one per DDD domain
  types/           ← canonical domain types
  utils/           ← pure helper functions
public/            ← served as-is, never processed
```

Never create a domain directory at the root of `app/`. Organize by layer first, then subdivide by domain inside the layer.

Within a layer, create a domain subdirectory only when the artifact belongs to one domain. Generic, reusable artifacts stay at the layer root.

Never nest domain subdirectories more than one level deep inside a layer.

## Naming: two exceptions, and their limit

This layout departs from [[coding/typescript/naming]], which requires singular directory names and forbids `PascalCase` for files. Both departures are deliberate and both are bounded. The governing criterion is ownership of the name:

**When the framework owns the name, use the framework's name.** Every directory in the layout above is either mandated by Nuxt or is the documented default of a module the stack depends on, so all of them are plural. They cannot be renamed without breaking auto-discovery.

**When we own the name, the singular rule applies unchanged.** Domain subdirectories are singular: `components/molecule/product/`, `stores/order.ts`, `services/product/`. Every file name is singular.

**Component file names are `PascalCase`.** Vue and Nuxt derive a component's registered name from its file name, so the file name is not free-form — it is part of the public identity of the component. `ProductCard.vue`, never `productCard.vue`.

These three points are the entire exception. Everything else — variables, functions, types, non-component files — follows [[coding/typescript/naming]] exactly. Never widen the exception by analogy, and never "correct" the plural directory names or `PascalCase` component files back to singular: they are compliant with this rule, not violations of the other one.

## Mode differences

The layout above is complete for Nuxt.

A Vite SPA adds an application entry file at the root of `app/` and needs explicit configuration to reach parity with the framework behavior Nuxt provides implicitly — see the `spa-vite` rules for router setup, bootstrap and auto-import.

Nuxt additionally reserves `server/`, `shared/`, `modules/` and `layers/` at the project root. Use them for their documented purpose only, and never relocate anything from the layout above into them.
