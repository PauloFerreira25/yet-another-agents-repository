---
name: vue-mode-detection
Scope: Before applying any rule that carries a category, or changing any project configuration
description: Determine the delivery mode from the project itself before acting, because every category rule depends on that answer being right.
---

This stack has two delivery modes — a Vite single-page application, and Nuxt with server-side rendering. They share one architecture, and differ in bootstrap, configuration, scaffolding and the consequences of server rendering. Every rule carrying a category applies to exactly one of them.

**Determine the mode from the project before applying any category rule.** Never carry an assumption from earlier in a session, from the task's phrasing, or from what the previous project used.

## The signal

A `nuxt.config.ts` at the application's root means Nuxt. Its absence means a Vite single-page application.

Confirm against the declared dependencies when the file is missing but the project looks unusual. A project depending on Nuxt without a configuration file is broken or mid-migration, and neither category applies cleanly — stop and ask rather than choosing one.

Never infer the mode from the presence of directories. The layout is deliberately identical in both modes, so it carries no information about which one this is — see [[architecture/frontend/vue/folder-structure]].

## Per application, not per repository

In a monorepo the mode is a property of the application being changed, not of the repository. Two applications side by side may differ, and the answer must be resolved again for each one.

Never apply the mode of the application you looked at last to the one you are changing now.

## New projects

A project being created from scratch has nothing to detect. The mode is a decision, and it belongs to the human: it determines the deployment target, how sessions are stored, and whether server rendering is available at all.

Confirm the mode explicitly before scaffolding anything, and state what the choice commits the project to — see [[coding/vue/spa/project-scaffold]] and [[coding/vue/nuxt/project-scaffold]]. Never infer it from the stack the human mentioned, and never default to one silently.

## Applying it

Read universal rules always. Read a category rule only when it matches the mode you determined.

Never read or apply a rule from the other mode's category, even when it appears to describe something relevant. Where the two modes genuinely share a concern, the shared part is already in a universal rule.
