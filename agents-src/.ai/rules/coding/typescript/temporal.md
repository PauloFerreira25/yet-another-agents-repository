---
name: temporal
Scope: Before writing any code that creates, manipulates, or formats dates and times
description: Always use Temporal for date and time operations — never use Date, Date.now(), or numeric timestamp arithmetic
---

Never use `new Date()`, `Date.now()`, or manual timestamp arithmetic (`* 24 * 60 * 60 * 1000`). Use the TC39 Temporal API.

Runtime-specific setup (Node version compatibility, polyfill for AWS Lambda, browser polyfill) is handled by the respective tooling rule.

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
- `Date` has no concept of calendar, plain date, or duration
- Temporal is the TC39 standard replacement
