---
name: vue-theming
Scope: When implementing theme switching, dark mode, or reading the user's color scheme preference
description: Colors, spacing and typography come from the theme configuration; dark mode is a theme, not a parallel stylesheet.
---

The UI library's theme is the single source of design tokens. Define colors, typography and spacing once in the theme configuration and reference them everywhere else.

**Never hard-code a color in a component.** A hex value in a template is invisible to the theme, does not respond to a theme switch, and has to be found by hand when the palette changes.

**Dark mode is a theme, not a stylesheet.** Define a dark theme alongside the light one and switch between them through the library's own mechanism. Never maintain a parallel set of dark-mode overrides, and never toggle a class that a second stylesheet keys off.

Respect the operating system preference on first load, and let an explicit user choice override it. Persist that choice. Never force a theme regardless of what the user's environment reports.

Never introduce a second styling system alongside the library's. A utility-class framework layered on top brings its own reset and its own scale, and the two disagree about spacing, typography and baseline styles in ways that surface as small, hard-to-attribute visual defects. Where the library's tokens do not cover a need, extend the theme rather than bypassing it.

Component-level style is `scoped` and limited to layout concerns specific to that component — see [[architecture/frontend/vue/sfc-conventions]]. Anything that expresses the product's visual identity belongs in the theme.

Never read the theme by inspecting the DOM. The library exposes the active theme reactively; use it.
