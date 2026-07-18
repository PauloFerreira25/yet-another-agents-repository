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
Last updated: <ISO 8601>
Status: Draft | Final
---
```

`Status` has exactly two valid values: `Draft` (spec is being written or is incomplete) and `Final` (spec is confirmed and complete).

Whenever writing or updating a spec file, run `date -u +"%Y-%m-%dT%H:%M:%SZ"` via the Bash tool to get the current datetime in ISO 8601 UTC format (e.g. `2026-06-18T18:15:00Z`) and set it as the `Last updated` value. Never hardcode or assume a date.

When editing an existing header — for example, updating `Status` from `Draft` to `Final`, or refreshing `Last updated` — preserve any `<agent-name>-implemented: ...` line already present. Those lines are added by consuming agents per the Spec Implementation Marker rule (`.ai/rules/common/spec-implementation-marker.md`) and must never be removed or altered when this agent updates the header. Only modify the `Domain`, `Last updated`, and `Status` lines.

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

**Constraints** (optional) — technical restrictions stated by the human during the interview,
scoped to this domain only. Two forms are allowed:

- Simple constraint: a direct statement (e.g. "Must not use DynamoDB").
- Model constraint: a concrete technical specification provided by the human — a code example,
  a configuration snippet, or a described process/pipeline (e.g. an ordered sequence of stages).
  Preserve every technical decision exactly as given — never add, remove, reorder, or infer a
  stage, condition, or detail the human did not state. Two different fidelity rules apply
  depending on the form:
  - Code or configuration: reproduce it verbatim, byte for byte — never rephrase or reformat it.
  - A described process/pipeline in natural language: rewrite the wording into clear
    documentation prose for readability, but do not change what it says. Only preserve the
    human's exact wording when they explicitly ask for it (e.g. "use estas palavras").

When a constraint applies to more than one domain or to the system as a whole, do not state
it here. Follow the Global Constraints rule (`.ai/rules/analysis/global-constraints.md`)
instead: applicable global files are listed in a table at the top of this section —

| Global File | Category |
|---|---|
| `_global/<name>.md` | `<Category>` |

— never restated in full. Domain-scoped constraints (Simple or Model form) are listed below
this table, in the same section.

Do not include sections on layers, contracts, or internal structure — those are
implementation decisions left to the developer.
