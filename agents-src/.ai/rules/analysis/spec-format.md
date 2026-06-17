---
name: spec-format
Scope: Before writing any spec document
description: Mandatory structure and sections for a domain spec document
---

This is the canonical format for DDD domain spec documents. Use it when the unit of work being specified is a DDD domain.

Every spec document covers exactly one DDD domain. The filename is the domain name in
kebab-case (e.g. `product.md`, `order.md`).

The document must open with a header block before any other content:

```
---
Domain: <domain-name>
Last updated: <YYYY-MM-DD HH:MM>
Status: Draft | Final
---
```

`Status` has exactly two valid values: `Draft` (spec is being written or is incomplete) and `Final` (spec is confirmed and complete).

Whenever writing or updating a spec file, run `date "+%Y-%m-%d %H:%M"` via the Bash tool to get the current date and time and set it as the `Last updated` value. Never hardcode or assume a date.

The document must then contain the following sections in this order:

**Context** — what this domain is responsible for and what its boundaries are. State what
other domains consume from it and what it does not own.

**Actors** — who interacts with this domain. Name each actor and describe their role in
one sentence.

**Business Rules** (domain-level, optional) — invariants that apply across the entire domain,
not tied to a specific use case. Write each rule as a single, verifiable statement. Omit
this section if all rules are scoped to individual use cases.

**Use Cases** — one subsection per use case. Each use case contains:
- A **Business Rules** block listing the invariants and constraints specific to that use case.
  Write each rule as a single, verifiable statement. When a rule cannot be expressed
  unambiguously in prose, use a formula, a table, or a short code snippet — never use
  code as a substitute for clear thinking.
- A description of what the use case receives, validates, and produces or persists.
  No implementation detail.

Each use case must be detailed enough for a developer to implement without needing to ask
follow-up questions. If the information collected during the interview is insufficient to
meet this bar, return to the interview before writing.

**Constraints** (optional) — technical restrictions stated by the human during the interview.
Two forms are allowed:

- Simple constraint: a direct statement (e.g. "Must not use DynamoDB").
- Model constraint: a code example provided by the human, included verbatim and marked as
  a reference to follow. Do not interpret, expand, or modify the code — reproduce it exactly
  as given.

Do not include sections on layers, contracts, or internal structure — those are
implementation decisions left to the developer.
