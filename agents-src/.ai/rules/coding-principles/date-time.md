---
name: date-time
Scope: Before writing code, APIs, or data models that handle dates or times
description: Language-agnostic rules for distinguishing and representing instants, civil dates, and recurring local times
---

# Date and Time

## Concepts

Always distinguish these three date/time concepts explicitly. Conflating them is the root cause of most date/time bugs.

**Instant** — a specific point in time ("when this happened/will happen"). Always store and transmit instants normalized to UTC. Never rely on the server's or database session's local time zone to interpret an instant value.

**Civil date** — a date with no time component and no zone (birth date, due date). Has no instant semantics. Never attach a time zone to a civil date.

**Recurring local time bound to a zone** — e.g. "this meeting is every day at 9am in the user's local time." Never store a fixed numeric UTC offset (e.g. "-03:00") for this case — offsets do not survive DST transitions or future changes to a region's time zone rules. Always store the IANA time zone identifier (e.g. "America/Sao_Paulo") together with the local wall-clock value, and recompute the actual instant at read/use time using the zone's rules as they are *then*, not the rules in effect when the value was written.

## Wire Format

Transmit instants as ISO-8601 UTC with a "Z" suffix (e.g. "2026-07-15T14:30:00Z"). Transmit civil dates as plain ISO-8601 dates (e.g. "2026-07-15"), with no time component.

Never invent a bespoke non-ISO-8601 date/time string format for any wire representation.

## Related Rules

For the language-specific type mapping (which type to use for each concept), see [[coding/java/date-time]].

For the database storage mapping (which column type to use for each concept), see [[db/postgres/timestamps]].
