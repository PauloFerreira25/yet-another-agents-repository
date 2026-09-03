---
name: oxlint
Scope: Before configuring OXLint or resolving lint errors in a React project
description: OXLint is the default linter in this stack — the scaffold ships with it pre-configured
---

The Vite scaffold already includes OXLint with React and TypeScript plugins configured in `.oxlintrc.json`. Do not install or configure ESLint.

Run the linter with:

```bash
npm run lint
```

## Default configuration

The scaffold's `.oxlintrc.json` already enables:

- `react/rules-of-hooks` — enforces the Rules of Hooks
- `react/only-export-components` — warns when non-component values are exported from component files

## Extending rules

Add rules directly to `.oxlintrc.json`. OXLint rule names follow the same conventions as ESLint:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }],
    "no-console": "warn"
  }
}
```

## Vendor file exception

shadcn/ui files under `src/component/ui/` are read-only vendor code (see the Shadcn / Tailwind rule) and commonly export a component alongside its variant config (e.g. `buttonVariants`) from the same file — an upstream convention this project does not restructure. Disable `only-export-components` for that directory instead of treating it as an unresolved warning:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  },
  "overrides": [
    {
      "files": ["src/component/ui/**"],
      "rules": {
        "react/only-export-components": "off"
      }
    }
  ]
}
```

## Scope

OXLint handles syntax and pattern rules. It does not perform type-aware analysis — that is the TypeScript compiler's responsibility (`tsc --noEmit` or `npm run build`).
