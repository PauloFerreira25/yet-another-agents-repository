---
name: vue-nuxt-module-config
Scope: When configuring Nuxt modules
description: Use each library's official Nuxt module, and configure the scan paths that the directory structure requires.
---

Install the official Nuxt module for each library that publishes one — the UI library, Pinia, Pinia Colada, i18n. A module wires server-side rendering, auto-import and plugin registration correctly; installing the bare library and registering it by hand reproduces that work badly.

Never register a library through a manual plugin when a module exists for it.

Declare modules in the configuration file in dependency order: Pinia before Pinia Colada, which installs onto it.

## Scan paths

The directory structure in [[architecture/frontend/vue/folder-structure]] subdivides by domain, and the default scan depth for auto-import is one level. Without configuration, anything in a domain subdirectory is silently not imported — the symptom is a composable or store that is undefined at runtime with no build error.

Configure the nested scan paths explicitly for composables, utilities and stores. Never move a file to the top level to make auto-import find it.

## Keeping configuration thin

The configuration file declares modules and their options. It is not where application logic lives.

Keep each module's options with the module entry rather than spread across the file, so the full configuration of one concern is readable at once.

Never disable server-side rendering globally to work around a component that does not tolerate it. Isolate that component instead, using the framework's own mechanism for client-only rendering, and state why in a comment at the point of use.

Never add a module to obtain a single helper that the application could express in a few lines. Every module is startup cost and upgrade surface — see [[coding-principles/dependencies]].
