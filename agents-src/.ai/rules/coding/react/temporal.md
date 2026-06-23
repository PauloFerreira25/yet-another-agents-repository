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
