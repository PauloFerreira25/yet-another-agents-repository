---
name: java-date-time
Scope: Before choosing a Java type for a date/time field, or serializing one to JSON
description: Java type and library choices for instants, civil dates, and recurring local times, and JSON serialization via jackson-datatype-jsr310
---

For the underlying concepts (instant vs. civil date vs. recurring local time bound to a zone), see [[coding-principles/date-time]]. This file covers only the Java type and library mechanics.

Always use `java.time` (JSR-310, available since Java 8). Never use `java.util.Date` or `java.util.Calendar` — both are legacy, mutable, and thread-unsafe.

## Type per concept

| Concept | Java type | Postgres column |
|---|---|---|
| Instant | `java.time.Instant` | `timestamptz` |
| Civil date | `java.time.LocalDate` | `date` |
| Recurring local time bound to a zone | `java.time.LocalDateTime` + `java.time.ZoneId` (separate column) | see [[db/postgres/timestamps]] |

**Instant.** Use `java.time.Instant` for a specific point in time. This is the default choice for audit fields (`createdAt`, `updatedAt`) and event timestamps. It maps directly to a Postgres `timestamptz` column with no extra JPA/Hibernate configuration needed.

`OffsetDateTime` is an acceptable alternative for instants, but `Instant` is the project default. Postgres does not persist the offset in a `timestamptz` column — it normalizes to UTC on write — so `OffsetDateTime`'s extra offset information doesn't survive a round trip through the database anyway; `Instant` is more honest about what's actually stored. Pick one as the team default and stay consistent. Never mix `Instant` and `OffsetDateTime` for the same kind of field across the codebase.

**Civil date.** Use `java.time.LocalDate` for a date with no time and no zone (birth date, due date). Maps to Postgres `date`.

**Recurring local time bound to a zone.** Persist a `java.time.LocalDateTime` (the naive wall-clock value) together with a separate `java.time.ZoneId` (stored as its zone ID string, e.g. `"America/Sao_Paulo"`) in its own column/field. Never persist only a fixed `ZoneOffset` for this case — offsets don't survive DST or zone-rule changes. Recompute the actual instant from the `ZoneId`'s current rules whenever it's needed, not from a stored offset.

## JSON serialization

Use the `jackson-datatype-jsr310` module and disable `SerializationFeature.WRITE_DATES_AS_TIMESTAMPS`, so `Instant`, `OffsetDateTime`, and `LocalDate` serialize as ISO-8601 strings — matching the wire format defined in [[coding-principles/date-time]] — not as numeric epoch values.

Never write custom `DateTimeFormatter`-based ad hoc serialization for API request/response DTOs when the Jackson JSR-310 module already produces the correct ISO-8601 format by default.
