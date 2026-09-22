---
name: vue-spa-auto-import-parity
Scope: Before configuring auto-import or resolving an unresolved import
description: A Vite SPA configures auto-import to match the framework behavior Nuxt provides implicitly, so code moves between modes unchanged.
---

Nuxt auto-imports components, composables, stores and utilities from their directories. Vite does not. Without matching that, the same file needs different imports in each mode, and the shared directory structure stops delivering portability.

Configure the two unplugin packages that provide it: one for components, one for composables and utilities. Point both at the directories from [[architecture/frontend/vue/folder-structure]], including nested paths — the default scan depth is one level and will silently miss anything in a domain subdirectory.

Register the store directory with the same treatment, nested paths included.

Generate the declaration files the plugins produce and commit them, so types resolve in the editor and in a clean checkout. Never add them to the ignore file, and never edit them by hand — they are regenerated.

## Discipline

Never rely on auto-import for anything outside these directories. An import that comes from a package is written explicitly.

Never import a component explicitly when auto-import covers it. Mixed conventions in the same file make it unclear what the rule is.

When an import does not resolve, check the plugin's scan configuration before adding an explicit import. An explicit import added to work around a misconfiguration hides the misconfiguration from every file that comes after.

Component names come from the file name, with grouping directories excluded from the derived name — see [[architecture/frontend/vue/component-structure]].
