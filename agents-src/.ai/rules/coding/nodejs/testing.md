---
name: nodejs-testing
Scope: Before writing or configuring tests
description: Vitest setup, real infrastructure, 100% coverage enforcement, and test directory structure.
---

Use Vitest as the test runner — it understands TypeScript and ESM natively.

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'html'],
      thresholds: {
        lines: 100, functions: 100, branches: 100, statements: 100,
      },
    },
  },
})
```

```
npm install -D @vitest/coverage-v8
```

## Testing philosophy

Use real infrastructure — never mock databases, queues, or external services unless it is impossible to run them.

Test at the highest level possible — a handler test covers handler, service, and repository together. `service.test.ts` and `repository.test.ts` only exist to cover what the handler test cannot reach.

Each test file creates its own isolated infrastructure in `beforeAll` and destroys it in `afterAll`:

```typescript
// test/helper/database.ts
export async function createTestDatabase() {
  const name = `test_${generateUUIDv7()}`
  const db = await client.createDatabase(name)
  return { db, cleanup: () => client.dropDatabase(name) }
}
```

Tests must always achieve 100% coverage across lines, functions, branches, and statements. Thresholds are enforced in `vitest.config.ts` — the build fails if any threshold is not met. If 100% cannot be reached, stop and notify the human immediately with the uncovered lines and the reason why they cannot be covered.

## Test directory structure

`test/` mirrors `src/` — same folder names, same file names with `.test.ts` suffix:

```
test/
├── domain/
│   └── <domain>/
│       ├── <domain>.post.create.handler.test.ts
│       ├── <domain>.get.list.handler.test.ts
│       ├── <domain>.service.test.ts     ← only if handler cannot cover it
│       └── <domain>.repository.test.ts  ← only if handler cannot cover it
├── queue/
│   └── <group>/
│       └── <worker>.handler.test.ts
└── helper/
    └── database.ts   ← shared test utilities, not test files
```

Never place test files inside `src/`. Never use a flat `test/` directory — always mirror the source structure.
