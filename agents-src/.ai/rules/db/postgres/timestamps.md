---
name: postgres-timestamps
Scope: Before choosing a Postgres column type for a date/time field, or configuring the DB session/connection time zone
description: Postgres column type mapping for instants, civil dates, and recurring local times, and required session TimeZone configuration
---

For the underlying concepts (instant vs. civil date vs. recurring local time bound to a zone), see [[coding-principles/date-time]]. For the Java-side type mapping, see [[coding/java/date-time]]. This file covers only the Postgres column type and session/config behavior.

## Type per concept

**Instant.** Always use `timestamptz` (`timestamp with time zone`) for any column representing a specific point in time — audit fields (`created_at`, `updated_at`), event timestamps. Never use bare `timestamp` for this case.

**Civil date.** Use `date` for a date with no time and no zone (birth date, due date).

**Recurring local time bound to a zone.** Use a bare `timestamp` column to hold the naive wall-clock value, paired with a separate `text` column holding the IANA zone id (e.g. `"America/Sao_Paulo"`). Never store only a fixed UTC offset for this case — offsets do not survive DST transitions or future changes to a region's zone rules. Compute the actual instant at query/application time using the zone's current rules — never bake it into the stored row.

**Duration/period.** Use `interval` for a duration or period. Never model a duration as the difference of two `timestamp`/`timestamptz` values computed in application code — Postgres represents durations natively.

**Time-only values.** Avoid `time` and especially `timetz` — Postgres's own documentation discourages `timetz`. A pure time-of-day-without-date value is rarely what the domain actually needs. Before reaching for a time-only type, double check whether the concept being modeled is actually one of the four cases above.

## How `timestamptz` actually works

Never assume Postgres stores a per-row offset or zone in either `timestamp` or `timestamptz` — it does not. `timestamptz` converts the input value to UTC at write time (using the session's `TimeZone` setting to interpret any input that lacks an explicit offset), and converts it back to the session's `TimeZone` on read. This is what makes it a consistent, unambiguous point-in-time value regardless of which session or server time zone touches it.

Bare `timestamp` performs no such conversion — the literal value is stored as-is, so its meaning silently depends on whatever time zone assumption each reader/writer happens to make. This is the root cause of a whole class of subtle production bugs: a value written correctly during standard testing appears shifted after a deploy to a server in a different region, or after the DB session `TimeZone` config changes.

## Session time zone

Always standardize the application's DB connection/session `TimeZone` to UTC — e.g. via the JDBC URL parameter, or `SET TIME ZONE 'UTC'` at connection setup. Never rely on whatever the server's default `TimeZone` happens to be.
