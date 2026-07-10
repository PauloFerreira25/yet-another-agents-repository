---
name: react-native-eslint
Scope: Before configuring ESLint or resolving lint errors in an Expo project
description: eslint-config-expo is the default linter for Expo projects — flat config, extends the TypeScript baseline
---

Expo projects use ESLint, not OXLint — the Expo scaffold ships `eslint-config-expo` pre-wired. Do not introduce OXLint into an Expo project even though the web stack uses it; Metro/Expo tooling assumes ESLint.

```bash
npx expo install eslint eslint-config-expo --dev
```

```javascript
// eslint.config.js
const expoConfig = require('eslint-config-expo/flat')

module.exports = [
  ...expoConfig,
  {
    rules: {
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [{ pattern: '@/**', group: 'internal' }],
        'newlines-between': 'always',
      }],
    },
  },
]
```

`eslint-config-expo` already includes React, React Hooks, and React Native-specific rules (`react-hooks/rules-of-hooks`, RN-specific a11y checks) — never duplicate `eslint-plugin-react`/`eslint-plugin-react-hooks` configuration on top of it, that causes rule conflicts.

Run with:

```bash
npx expo lint
```

## No eslint-disable

Same rule as the TypeScript baseline: never use `eslint-disable` or any variant. If an error appears, fix the code. If the underlying issue cannot be resolved without suppressing the rule, stop and notify a human.
