---
name: react-temporal
Scope: Before writing any code that creates, manipulates, or formats dates and times in a React project
description: React browser Temporal setup — extends the TypeScript baseline with browser compatibility and polyfill
---

For the Temporal directive and common patterns, follow `.ai/rules/coding/typescript/temporal.md`.

## Browser compatibility

Temporal is available natively in modern browsers (Chrome 129+, Firefox 139+, Safari 17.4+). For projects that need to support older browsers, install the polyfill:

```bash
npm install temporal-polyfill
```

```typescript
import { Temporal } from 'temporal-polyfill'
```

When your browser support matrix no longer requires the polyfill, remove the package and use the native global directly.
