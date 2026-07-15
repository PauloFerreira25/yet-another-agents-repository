---
name: react-temporal
Scope: Before writing any code that creates, manipulates, or formats dates and times in a React project
description: React browser Temporal setup — extends the TypeScript baseline with browser compatibility and polyfill
---

For the Temporal directive and common patterns, follow `.ai/rules/coding/typescript/temporal.md`.

## Browser compatibility and TypeScript

The scaffold's `lib: ["ES2023", "DOM"]` does not include `Temporal` — TypeScript will fail with `Cannot find name 'Temporal'` if you use the native global directly.

Always install and import from `temporal-polyfill`, which ships its own types:

```bash
npm install temporal-polyfill
```

```typescript
import { Temporal } from 'temporal-polyfill'
```

`temporal-polyfill` works in all browsers and gives TypeScript the types it needs. When native `Temporal` is stable across your browser support matrix and TypeScript adds it to the DOM lib, remove the package and switch to the native global.

## Locale-aware formatting

When formatting a date for display, pass the current i18next locale (see `i18n`) rather than hardcoding a locale string:

```tsx
import { useTranslation } from 'react-i18next'

const { i18n } = useTranslation()
local.toLocaleString(i18n.language, { dateStyle: 'medium' })
```

Never hardcode a locale string (`'pt-BR'`, `'en-US'`) in a component — the user's active locale can change at runtime via the language switcher, and the date format must follow it.
