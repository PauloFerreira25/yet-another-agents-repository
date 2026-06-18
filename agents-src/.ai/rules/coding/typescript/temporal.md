---
name: nodejs-temporal
Scope: Before writing any code that creates, manipulates, or formats dates and times
description: Always use Temporal for date and time operations — never use Date, Date.now(), or numeric timestamp arithmetic.
---

## Use Temporal for all date and time operations

Never use `new Date()`, `Date.now()`, or manual timestamp arithmetic (`* 24 * 60 * 60 * 1000`). Use the TC39 Temporal API.

### Node version compatibility

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

## Common patterns

**Current instant:**
```typescript
Temporal.Now.instant()
```

**Subtract from now:**
```typescript
Temporal.Now.instant().subtract({ hours: 24 })
Temporal.Now.instant().subtract({ days: 7 })
```

**Convert to ISO string (for APIs):**
```typescript
Temporal.Now.instant().toString()                         // "2026-06-10T01:00:00Z"
Temporal.Now.zonedDateTimeISO().toPlainDate().toString()  // "2026-06-10"
```

**Parse from string:**
```typescript
Temporal.Instant.from('2026-06-10T00:00:00Z')
```

**Date arithmetic:**
```typescript
const start = Temporal.PlainDate.from('2026-01-01')
const end   = start.add({ months: 3 })
```

**Compare:**
```typescript
Temporal.Instant.compare(a, b) // -1 | 0 | 1
```

## Why not Date

- `Date` has no timezone-aware arithmetic — results vary by system locale
- Manual ms arithmetic (`n * 864e5`) is error-prone and unreadable
- `Date` has no concept of calendar, plain date, or duration — operations require manual conversion
- Temporal is the TC39 standard replacement, stable in Node 24+
