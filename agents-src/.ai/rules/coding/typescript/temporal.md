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

## Receiving dates from the API

The backend always sends instants as ISO-8601 UTC with a `Z` suffix, and civil dates (birth date, due date — no time, no zone) as plain ISO-8601 dates — see [[coding-principles/date-time]] for the full contract. Never assume a different format, and never hand-roll a parser (regex, string slicing) for an API date string.

Parse an instant field with `Temporal.Instant.from(value)`. Parse a civil date field with `Temporal.PlainDate.from(value)`.

```typescript
const createdAt = Temporal.Instant.from(response.createdAt)   // "2026-06-10T01:00:00Z" -> Instant
const birthDate = Temporal.PlainDate.from(response.birthDate) // "2026-06-10" -> PlainDate
```

## Sending dates to the API

Serialize a `Temporal.Instant` or `Temporal.PlainDate` back with `.toString()` — it always produces the exact wire format the backend expects. Never build the string manually (concatenation, template literals, custom padding).

```typescript
body: JSON.stringify({ scheduledFor: instant.toString() }) // "2026-06-10T01:00:00Z"
```

## Displaying dates to the user

An instant from the API is UTC. Never display it to the user without first converting it to their local time zone — a raw `Instant.toString()` or its unconverted clock time is not what the user should see. Convert with `toZonedDateTimeISO`, using the runtime's own detected zone, before formatting:

```typescript
const zone = Temporal.Now.timeZoneId()          // e.g. "America/Sao_Paulo"
const local = createdAt.toZonedDateTimeISO(zone)
```

Which locale string to pass to `toLocaleString` is runtime-specific — see the React or React Native specialization of this rule.
