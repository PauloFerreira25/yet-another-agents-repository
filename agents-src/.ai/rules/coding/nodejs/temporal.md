---
name: nodejs-temporal
Scope: Before writing any code that creates, manipulates, or formats dates and times in a Node.js project
description: Node.js Temporal setup — extends the TypeScript baseline with version compatibility and AWS Lambda polyfill
---

For the Temporal directive and common patterns, follow `.ai/rules/coding/typescript/temporal.md`.

## Node version compatibility

- **Node 26+**: Temporal is available natively — no package needed
- **Node 24 (AWS Lambda runtime)**: Temporal requires the `temporal-polyfill` package — native support is behind a flag and not usable in production

While AWS Lambda does not support Node 26, always install `temporal-polyfill`:

```bash
npm install temporal-polyfill
```

```typescript
import { Temporal } from 'temporal-polyfill'
```

When AWS Lambda adds Node 26 support, remove the package and import from the native global.
