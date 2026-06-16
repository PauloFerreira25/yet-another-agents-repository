---
name: nodejs-eslint
Scope: Before configuring ESLint or resolving ESLint errors
description: Flat config (v9+) with typescript-eslint, required rules, import resolver, and no-disable rule.
---

Use flat config (v9+) with `typescript-eslint`:

```javascript
// eslint.config.js
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports':        ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-import-type-side-effects':    'error',
      '@typescript-eslint/explicit-function-return-type':  ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-unused-vars':                                     'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'all', args: 'all',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'import/no-duplicates': 'error',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      }],
    },
  },
  { ignores: ['dist/', 'test/'] }
)
```

Install required plugins:

```
npm install -D typescript-eslint eslint-plugin-import eslint-import-resolver-typescript
```

`eslint-import-resolver-typescript` is required for `eslint-plugin-import` to resolve `.js` imports to `.ts` files under NodeNext. Without it, ESLint reports missing modules on every local import.

Never use the legacy `.eslintrc` format.

## No eslint-disable

Never use `eslint-disable`, `eslint-disable-next-line`, `eslint-disable-line`, or any variant of ESLint suppression comments in `.js` or `.ts` files.

If an ESLint error appears, fix the code to comply with the rule. If an existing `eslint-disable` is found, remove it and fix the underlying issue.

If the underlying issue cannot be resolved without suppressing the rule, stop and notify a human — do not work around it with a disable comment.
