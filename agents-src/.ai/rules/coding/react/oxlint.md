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

## Scope

OXLint handles syntax and pattern rules. It does not perform type-aware analysis — that is the TypeScript compiler's responsibility (`tsc --noEmit` or `npm run build`).
