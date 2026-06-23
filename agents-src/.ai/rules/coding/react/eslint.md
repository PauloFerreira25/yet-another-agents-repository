---
name: react-eslint
Scope: Before configuring ESLint or resolving ESLint errors in a React project
description: React ESLint setup — extends the TypeScript baseline with React, hooks, and accessibility plugins
---

For the base ESLint config, follow `.ai/rules/coding/typescript/eslint.md`.

React-specific additions: install and configure three extra plugins:

```
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

Add to the config object:

```javascript
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'

{
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'jsx-a11y': jsxA11yPlugin,
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react-hooks/rules-of-hooks':  'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope':    'off',   // not needed with react-jsx transform
    ...jsxA11yPlugin.configs.recommended.rules,
  },
}
```

React component functions return JSX — relax the explicit return type rule for them:

```javascript
'@typescript-eslint/explicit-function-return-type': ['error', {
  allowExpressions: true,
  allowTypedFunctionExpressions: true,
}],
```
